const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const { summarizeAffidavit } = require('../services/aiService');
const { answerManifestoQuestion } = require('../services/ragService');

// Load candidates to pass to summarizer
const candidatesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'candidates.json'), 'utf-8')
);

/**
 * Helper function to find a candidate by ID across all constituencies.
 *
 * @param {string} id - The unique identifier of the candidate.
 * @returns {Object|null} The candidate object if found, otherwise null.
 */
function findCandidateById(id) {
  for (const constId in candidatesData.constituencies) {
    const found = candidatesData.constituencies[constId].candidates.find(c => c.id === id);
    if (found) return found;
  }
  return null;
}

// ── POST /api/ai/summarize ─────────────────────────────────────────────────────
/**
 * @route POST /api/ai/summarize
 * @description Generates a 3-point summary of a candidate's affidavit using Google Gemini AI.
 * @param {import('express').Request} req
 * @param {Object} req.body
 * @param {string} req.body.candidateId - The ID of the candidate.
 * @param {string} [req.body.language='en'] - The language for the summary (e.g., 'en', 'hi').
 * @param {import('express').Response} res
 * @returns {Object} JSON response containing success status and the summary array.
 * @throws {Error} 500 error if the AI generation fails.
 */
router.post('/summarize', async (req, res) => {
  const { candidateId, language = 'en' } = req.body;

  if (!candidateId) {
    return res.status(400).json({ error: 'missing_params', message: 'candidateId is required' });
  }

  const candidate = findCandidateById(candidateId);
  if (!candidate) {
    return res.status(404).json({ error: 'not_found', message: 'Candidate not found' });
  }

  try {
    const summary = await summarizeAffidavit(candidate, language);
    return res.json({ success: true, summary });
  } catch (err) {
    console.error('[AIRoute] Summarize error:', err);
    return res.status(500).json({ error: 'ai_error', message: 'Failed to generate summary' });
  }
});

// ── POST /api/ai/manifesto-chat ────────────────────────────────────────────────
/**
 * @route POST /api/ai/manifesto-chat
 * @description Answers a question based on a political party's manifesto using RAG.
 * @param {import('express').Request} req
 * @param {Object} req.body
 * @param {string} req.body.question - The question asked by the user.
 * @param {string} req.body.party - The political party.
 * @param {string} [req.body.language='en'] - The language for the answer.
 * @param {import('express').Response} res
 * @returns {Object} JSON response containing the AI answer.
 * @throws {Error} 500 error if RAG process fails.
 */
router.post('/manifesto-chat', async (req, res) => {
  const { question, party, language = 'en' } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'missing_params', message: 'question is required' });
  }

  try {
    const result = await answerManifestoQuestion(question, party, language);
    return res.json({ success: true, ...result });
  } catch (err) {
    console.error('[AIRoute] RAG error:', err);
    return res.status(500).json({ error: 'ai_error', message: 'Failed to answer question' });
  }
});

module.exports = router;
