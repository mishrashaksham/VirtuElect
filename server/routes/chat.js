const router = require('express').Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios'); // use axios — already a dependency, avoids Node fetch issues

// ── System Prompt ──────────────────────────────────────────────────────────────
function buildSystemPrompt() {
  return [
    "You are 'Gyani', a friendly, intelligent, and strictly non-partisan AI election assistant for the VirtuElect platform.",
    "You help citizens of India and other democracies understand election processes, voter registration, candidate information, how EVMs work, polling procedures, election results, and how to participate in democracy.",
    "Your tone is warm, knowledgeable, and encouraging — like a wise and helpful friend who deeply understands Indian politics and the ECI (Election Commission of India).",
    "Always be accurate, helpful, and non-partisan. Never recommend or endorse any candidate or party.",
    "",
    "IMPORTANT INSTRUCTIONS:",
    "- Prioritize Indian election knowledge: ECI, Lok Sabha 2024 & 2026, Vidhan Sabha elections, voter ID (EPIC), Aadhaar-voter link, NOTA, EVMs, VVPAT, etc.",
    "- For process questions, present clear numbered steps.",
    "- Keep responses concise, structured, and easy to understand.",
    "- For real-time results/live news, clarify your training cutoff and direct users to eci.gov.in (India) or vote.gov (USA).",
    "- Never recommend any candidate, party, or ideology. Remain strictly neutral.",
    "- Format your response with short paragraphs and lists where appropriate.",
    "- If asked who to vote for, politely refuse and explain your non-partisan role.",
  ].join('\n');
}

// ── POST /api/chat ─────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  // CHECKPOINT 1: Request received
  console.log('[ChatRoute] ✅ POST /api/chat received');
  console.log('[ChatRoute] Body keys:', Object.keys(req.body || {}));

  try {
    const { message, history = [] } = req.body;

    // CHECKPOINT 2: Validate message
    if (!message?.trim()) {
      console.log('[ChatRoute] ❌ No message provided');
      return res.status(400).json({ error: 'Message is required.', reply: 'Please send a message.', responseType: 'text' });
    }
    console.log('[ChatRoute] ✅ Message received:', message.slice(0, 60));

    // CHECKPOINT 3: Check API key
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      console.error('[ChatRoute] ❌ GEMINI_API_KEY is missing from .env');
      return res.status(503).json({
        reply: '⚠️ The Gemini API key has not been configured. Please add GEMINI_API_KEY to server/.env and restart.',
        responseType: 'text',
      });
    }
    console.log('[ChatRoute] ✅ API key found (length:', geminiKey.length, ')');

    // CHECKPOINT 4: Initialize Gemini
    console.log('[ChatRoute] 🔄 Initializing GoogleGenerativeAI...');
    const genAI = new GoogleGenerativeAI(geminiKey);

    const systemPrompt = buildSystemPrompt();

    console.log('[ChatRoute] 🔄 Getting model gemini-2.0-flash...');
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: systemPrompt,
    });
    console.log('[ChatRoute] ✅ Model initialized');

    // CHECKPOINT 5: Build chat history
    const chatHistory = history
      .filter((m) => m.content?.trim())
      .map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));
    console.log('[ChatRoute] ✅ Chat history built, turns:', chatHistory.length);

    // CHECKPOINT 6: Send message
    console.log('[ChatRoute] 🔄 Starting chat and sending message...');
    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(message);
    const replyText = result.response.text();
    console.log('[ChatRoute] ✅ Reply received, length:', replyText.length);

    return res.json({ reply: replyText, responseType: 'text' });

  } catch (error) {
    // FULL diagnostic dump
    console.error('[ChatRoute] ❌ ERROR at some checkpoint above ↑');
    console.error('[ChatRoute] error.name    :', error?.name);
    console.error('[ChatRoute] error.message :', error?.message);
    console.error('[ChatRoute] error.status  :', error?.status);
    console.error('[ChatRoute] error.stack   :\n', error?.stack);

    const msg = error instanceof Error ? error.message : String(error);
    let userReply = `I'm sorry, something went wrong. Please try again. (${msg.slice(0, 80)})`;

    if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid')) {
      userReply = '⚠️ Invalid Gemini API key. Please check GEMINI_API_KEY in server/.env.';
    } else if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota')) {
      userReply = '⚠️ API quota exceeded. Please wait and try again.';
    } else if (msg.includes('not found') || msg.includes('404')) {
      userReply = '⚠️ The AI model was not found. The model name may be unsupported by your API key tier.';
    }

    return res.status(500).json({ reply: userReply, responseType: 'text', debug: msg });
  }
});

module.exports = router;
