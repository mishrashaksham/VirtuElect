const axios = require('axios');

/**
 * Translates text using the official Google Cloud Translation REST API.
 * @param {string} text - Text to translate.
 * @param {string} targetLanguage - Target language code (e.g., 'hi', 'te', 'ta').
 * @returns {Promise<string>} Translated text.
 */
async function translateText(text, targetLanguage) {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  
  // If no API key or target is English, return original
  if (!apiKey || apiKey === 'your_google_translate_api_key_here' || targetLanguage === 'en') {
    return text;
  }

  try {
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        q: text,
        target: targetLanguage,
        format: 'text' // Use 'text' or 'html'
      }
    );

    const translations = response.data.data.translations;
    if (translations && translations.length > 0) {
      return translations[0].translatedText;
    }
    return text;
  } catch (error) {
    console.error('[TranslateService] Google Translate API Error:', error?.response?.data || error.message);
    // Fallback to original text on failure
    return text;
  }
}

module.exports = {
  translateText
};
