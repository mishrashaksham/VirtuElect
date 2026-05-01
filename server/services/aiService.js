const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates an unbiased 3-point summary of a candidate's affidavit.
 * @param {Object} candidateData - The candidate object from the database.
 * @param {string} targetLanguage - Language code (e.g., 'en', 'hi', 'te')
 * @returns {Promise<Array<string>>} Array of exactly 3 bullet points.
 */
async function summarizeAffidavit(candidateData, targetLanguage = 'en') {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  // Use Gemini 1.5 Flash for speed
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `
    You are an unbiased, analytical political assistant for an Indian election app called VirtuElect.
    Your task is to analyze the following candidate affidavit data and provide exactly three short, factual bullet points.
    
    Guidelines:
    1. Point 1 must summarize their Total Assets and Liabilities.
    2. Point 2 must summarize their Criminal Cases (if 0, state "Clean record with no pending criminal cases").
    3. Point 3 must summarize their Educational Qualification and Profession.
    4. Do not include any flattery, bias, or subjective language. Just the hard facts.
    5. The output must be in language: ${targetLanguage} (Translate the facts accurately if not English).
    6. Return ONLY a JSON array of 3 strings. No markdown, no code blocks, just the JSON array.
    
    Candidate Data:
    Name: ${candidateData.name}
    Party: ${candidateData.party}
    Assets: ${candidateData.assets_total}
    Liabilities: ${candidateData.liabilities}
    Criminal Cases: ${candidateData.criminal_cases}
    Criminal Details: ${candidateData.criminal_details}
    Education: ${candidateData.education}
    Profession: ${candidateData.profession}
    Raw Affidavit Text: ${candidateData.affidavit_raw}
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean up the response to ensure it's pure JSON (sometimes models wrap in ```json)
    let cleanedText = responseText.trim();
    if (cleanedText.startsWith('\`\`\`json')) {
      cleanedText = cleanedText.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
    } else if (cleanedText.startsWith('\`\`\`')) {
      cleanedText = cleanedText.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '').trim();
    }

    const summaryArray = JSON.parse(cleanedText);
    
    if (!Array.isArray(summaryArray) || summaryArray.length !== 3) {
      throw new Error('Model did not return exactly 3 points.');
    }
    
    return summaryArray;
  } catch (error) {
    console.error('[AIService] Summarization Error:', error);
    // Fallback if AI fails
    return [
      `Total Assets: ${candidateData.assets_total} (Liabilities: ${candidateData.liabilities})`,
      `Criminal Cases: ${candidateData.criminal_cases}`,
      `Education: ${candidateData.education}`
    ];
  }
}

module.exports = {
  summarizeAffidavit
};
