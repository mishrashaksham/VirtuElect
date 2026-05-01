const router = require('express').Router();
const axios = require('axios');

// Basic English strings in the app to translate
const APP_STRINGS = [
  "EVM Sim-Console",
  "Know Your Candidate",
  "Next-Gen Voting",
  "The future of secure, verifiable digital democracy.",
  "High-Fidelity Simulation Protocol",
  "Explore the intricate mechanics of a secure Electronic Voting Machine through our advanced lumina tactile interface. Experience uncompromised security coupled with transparent verification.",
  "The Secure Voting Process",
  "Step 1: Registration",
  "Voters establish their digital identity and eligibility within the secure electoral roll network.",
  "Step 2: KYC & Affidavits",
  "Candidates submit immutable cryptographic affidavits regarding assets, history, and background.",
  "Step 3: EVM Voting",
  "Tactile selection interface capturing intent precisely without reliance on vulnerable networks.",
  "Step 4: VVPAT Verification",
  "Immediate physical VVPAT generation allowing voters to verify choices before finalization.",
  "Explore verified candidate data and AI-summarized affidavits before casting your vote.",
  "ELECTION TYPE",
  "STATE",
  "CONSTITUENCY",
  "Declared Assets:",
  "Criminal Records:",
  "Attendance:",
  "✨ View AI Summary",
  "Live Simulator",
  "Interact with the simulated hardware units below.",
  "Control Unit",
  "SYSTEM READY",
  "Issue Ballot",
  "Close Poll",
  "Total Reset",
  "Ballot Unit Interface",
  "VVPAT System",
  "Voter Verifiable Paper Audit Trail Monitor",
  "Awaiting vote...",
  "None of the Above",
  "Privacy",
  "Technical Manual",
  "Source Integrity"
];

const translationCache = { en: {} };
APP_STRINGS.forEach(s => translationCache.en[s] = s);

router.get('/dict', async (req, res) => {
  const { lang } = req.query;
  if (!lang || lang === 'en') return res.json(translationCache.en);
  
  if (translationCache[lang]) {
    return res.json(translationCache[lang]);
  }

  if (!process.env.GOOGLE_TRANSLATE_API_KEY || process.env.GOOGLE_TRANSLATE_API_KEY === 'your_google_cloud_api_key') {
    console.warn("No Google Cloud API Key, returning English");
    return res.json(translationCache.en);
  }

  try {
    const response = await axios.post(`https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`, {
      q: APP_STRINGS,
      target: lang,
      format: 'text'
    });

    const translatedArray = response.data.data.translations.map(t => t.translatedText);
    const dict = {};
    APP_STRINGS.forEach((str, i) => {
      dict[str] = translatedArray[i];
    });

    translationCache[lang] = dict;
    return res.json(dict);
  } catch (error) {
    console.error('[TranslateRoute] Error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'translation_failed', fallback: translationCache.en });
  }
});

module.exports = router;
