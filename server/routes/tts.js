const router = require('express').Router();
const axios = require('axios');

/**
 * @route POST /api/tts
 * @description Converts text to speech using Google Cloud TTS REST API.
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body.
 * @param {string} req.body.text - The text to synthesize.
 * @param {string} [req.body.languageCode='en-IN'] - The language code (e.g., 'en-US', 'hi-IN').
 * @param {Object} res - Express response object.
 * @returns {Buffer} Audio buffer (MP3 format) if successful, otherwise JSON error.
 * @throws {Error} If the TTS API request fails.
 */
router.post('/', async (req, res) => {
  const { text, languageCode = 'en-IN' } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'missing_params', message: 'text is required' });
  }

  const apiKey = process.env.GOOGLE_TTS_API_KEY || process.env.GOOGLE_TRANSLATE_API_KEY || process.env.GEMINI_API_KEY; // Fallback attempts
  
  if (!apiKey) {
    console.error('[TTS Route] Missing GOOGLE_TTS_API_KEY');
    return res.status(500).json({ error: 'config_error', message: 'TTS API key is not configured' });
  }

  try {
    const response = await axios.post(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        input: { text },
        voice: { languageCode, name: languageCode === 'hi-IN' ? 'hi-IN-Neural2-A' : 'en-IN-Neural2-A' },
        audioConfig: { audioEncoding: 'MP3' }
      }
    );

    if (!response.data || !response.data.audioContent) {
      throw new Error('Invalid response from Google TTS API');
    }

    // Convert base64 audioContent to binary buffer
    const audioBuffer = Buffer.from(response.data.audioContent, 'base64');

    // Send the buffer directly as an audio/mpeg response
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length
    });
    return res.send(audioBuffer);

  } catch (error) {
    console.error('[TTS Route] Error synthesizing speech:', error.response?.data || error.message);
    return res.status(500).json({ error: 'tts_error', message: 'Failed to synthesize speech' });
  }
});

module.exports = router;
