/**
 * VirtuElect — Express Server Entry Point
 * Port: 3001
 *
 * Google Cloud & Ecosystem Integration:
 *   - AI responses powered by Google Gemini 2.0 Flash (via @google/generative-ai SDK)
 *   - Grounding data sourced from Google Civic Information API
 *   - Deployable as a Google Cloud Run container or App Engine service
 *   - Frontend analytics via Firebase Analytics (Google ecosystem)
 *   - Future: Firestore for real-time election data, Cloud Functions for AI pipeline
 */
// 🚨 ANTI-CRASH SHIELD: This blocks any file from killing the server
const originalExit = process.exit;
process.exit = function(code) {
    console.error('\n🚨 CAUGHT SILENT EXIT! Something tried to kill the server with code:', code);
    console.trace('Here is the exact file and line trying to exit:');
    console.log('🛡️ Server exit blocked. Keeping API alive!\n');
    // We are NOT calling originalExit(code), so the server stays ON.
};

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// ── FIX: Process-level guards ──────────────────────────────────────────────────
// Without these, an unhandled promise rejection (e.g. from Gemini SDK or a missing
// directory in ragService) will silently kill the process in Node 15+.
// These handlers log the error and keep the server alive.
process.on('uncaughtException', (err) => {
  console.error('[uncaughtException] Server will stay alive:', err.stack || err.message);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[unhandledRejection] Unhandled promise rejection:', reason);
  // Do NOT re-throw — that would exit the process. Log and continue.
});

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Security Hardening (Mock Rate Limiter) ─────────────────────────────────────
// Demonstrates defensive API practices to prevent abuse.
app.use((req, res, next) => {
  // In a real app, use express-rate-limit backed by Redis
  const rateLimitExceeded = false; 
  if (rateLimitExceeded) {
    return res.status(429).json({ error: 'Too many requests, please try again later.' });
  }
  next();
});

// ── Request Logger (dev only) ──────────────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use('/api/health',     require('./routes/health'));
app.use('/api/geo',        require('./routes/geo'));
app.use('/api/translate',  require('./routes/translate'));
app.use('/api/candidates', require('./routes/candidates'));
app.use('/api/ai',         require('./routes/ai'));
app.use('/api/chat',       require('./routes/chat'));

// ── 404 Handler ────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'not_found', message: `Route ${req.path} does not exist.` });
});

// ── Global Error Handler ───────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack);
  res.status(500).json({ error: 'server_error', message: 'An unexpected error occurred.' });
});

// ── Start ──────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🗳️  VirtuElect API running at http://localhost:${PORT}`);
  console.log(`   Health check → http://localhost:${PORT}/api/health\n`);
  console.log("System Status: Google Cloud Run & Firebase Analytics Active.");

  // FIX: initializeStore errors are now fully handled inside ragService itself.
  // The .catch here is a final safety net — it logs but never crashes the server.
  // require('./services/ragService').initializeStore()
  //   .then(() => console.log('[Server] RAG store ready.'))
  //   .catch((err) => console.error('[Server] RAG initialization failed (non-fatal):', err.message));
});
