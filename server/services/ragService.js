const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// In-memory store for manifesto chunks and their embeddings
let vectorStore = [];
let isInitialized = false;

// FIX 1: Do NOT instantiate GoogleGenerativeAI at module load time.
// If GEMINI_API_KEY is missing, the constructor on some SDK versions throws
// synchronously, crashing the process before app.listen() completes.
// Instead, create it lazily inside functions that need it.
let _genAI = null;
function getGenAI() {
  if (!_genAI) {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      throw new Error('[RAGService] GEMINI_API_KEY is not configured.');
    }
    _genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return _genAI;
}

/**
 * Calculates cosine similarity between two vectors.
 */
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Loads manifestos, chunks them, and generates embeddings.
 * Run once on startup or first request.
 */
async function initializeStore() {
  if (isInitialized) return;

  // FIX 2: Check API key BEFORE trying to use the SDK, and set isInitialized=true
  // so the guard works correctly even in the no-key case (prevents infinite retries).
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.warn('[RAGService] GEMINI_API_KEY not configured. RAG features will be disabled.');
    isInitialized = true; // Mark as done so we don't retry on every request
    return;
  }

  // FIX 3: Guard against missing manifestos directory — fs.readdirSync throws
  // synchronously inside an async function, which becomes an unhandled rejection
  // that Node 15+ converts to a process exit.
  const manifestosDir = path.join(__dirname, '..', 'data', 'manifestos');
  if (!fs.existsSync(manifestosDir)) {
    console.warn(`[RAGService] Manifestos directory not found at ${manifestosDir}. RAG will be empty.`);
    isInitialized = true;
    return;
  }

  let files;
  try {
    files = fs.readdirSync(manifestosDir);
  } catch (err) {
    console.error('[RAGService] Could not read manifestos directory:', err.message);
    isInitialized = true; // Prevent retry loops
    return;
  }

  console.log('[RAGService] Initializing in-memory vector store...');

  let genAI;
  try {
    genAI = getGenAI();
  } catch (err) {
    console.error('[RAGService] Failed to initialize Gemini client:', err.message);
    isInitialized = true;
    return;
  }

  const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-2' });

  for (const file of files) {
    if (!file.endsWith('.txt')) continue;
    const partyAbbr = file.replace('.txt', '').toUpperCase();

    let text;
    try {
      text = fs.readFileSync(path.join(manifestosDir, file), 'utf-8');
    } catch (err) {
      console.error(`[RAGService] Could not read ${file}:`, err.message);
      continue;
    }

    // Robust sentence-based chunking
    const chunks = text.split(/\.\s+/).filter(c => c.trim().length > 10);
    console.log(`[RAGService] Extracted ${chunks.length} chunks from ${partyAbbr}.txt`);

    for (const chunk of chunks) {
      try {
        const cleanChunk = chunk.trim() + '.';
        const result = await embeddingModel.embedContent(cleanChunk);
        vectorStore.push({
          party: partyAbbr,
          text: cleanChunk,
          embedding: result.embedding.values
        });
      } catch (err) {
        console.error(`[RAGService] Failed to embed chunk for ${partyAbbr}:`, err.message);
        // Continue processing remaining chunks — don't abort the whole store
      }
    }
  }

  isInitialized = true;
  console.log(`[RAGService] Initialized with ${vectorStore.length} chunks.`);
}

/**
 * Queries the RAG system to answer a question based on party manifestos.
 */
async function answerManifestoQuestion(question, partyFilter = null, language = 'en') {
  if (!isInitialized) await initializeStore();

  const genAI = getGenAI(); // Will throw with a clear message if key is missing
  const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-2' });
  const chatModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  // 1. Embed the question
  const queryResult = await embeddingModel.embedContent(question);
  const queryEmbedding = queryResult.embedding.values;

  // 2. Retrieve top K similar chunks
  let relevantChunks = vectorStore;
  if (partyFilter && partyFilter !== 'ALL') {
    relevantChunks = relevantChunks.filter(c => c.party === partyFilter.toUpperCase());
  }

  const scoredChunks = relevantChunks.map(chunk => ({
    ...chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding)
  }));

  // Sort descending by score and take top 3
  scoredChunks.sort((a, b) => b.score - a.score);
  const topChunks = scoredChunks.slice(0, 3);

  const contextText = topChunks.map(c => `[${c.party}] ${c.text}`).join('\n');

  // 3. Generate answer
  const prompt = `
    You are Gyani, an unbiased Indian election assistant for VirtuElect.
    Answer the user's question about party manifestos using ONLY the provided context below.
    If the context does not contain the answer, politely say you don't have that information in the current manifesto database. Do not hallucinate.
    Provide the response in this language: ${language}.
    Keep your answer concise and direct.

    Context:
    ${contextText}

    User Question: ${question}
  `;

  const responseResult = await chatModel.generateContent(prompt);

  return {
    answer: responseResult.response.text(),
    sources: topChunks.map(c => ({ party: c.party, text: c.text, score: c.score }))
  };
}

module.exports = {
  initializeStore,
  answerManifestoQuestion
};
