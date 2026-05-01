/**
 * Candidate Routes
 *
 * GET /api/candidates/:constituencyId            — Fetch candidates + scenario
 * GET /api/candidates/:constituencyId/results    — Historical election results
 * GET /api/candidates/find/:candidateId          — Single candidate by ID
 */
const router = require('express').Router();
const path = require('path');
const fs = require('fs');

// Load data once at startup
const candidatesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'candidates.json'), 'utf-8')
);
const resultsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'past-results.json'), 'utf-8')
);

/**
 * Determine election scenario based on constituency's electionDate vs. today.
 * - 'ongoing'  : election is happening today (±3 days)
 * - 'near'     : election within 60 days
 * - 'far'      : election more than 60 days away
 */
function getScenario(electionDateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const electionDate = new Date(electionDateStr);
  electionDate.setHours(0, 0, 0, 0);
  const diffMs = electionDate - today;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays >= -3 && diffDays <= 3) return 'ongoing';
  if (diffDays > 3 && diffDays <= 60) return 'near';
  return 'far'; // includes past elections
}

// ── GET /api/candidates/:constituencyId ────────────────────────────────────────
router.get('/:constituencyId', (req, res) => {
  const { constituencyId } = req.params;
  const constituencyData = candidatesData.constituencies[constituencyId];

  if (!constituencyData) {
    return res.status(404).json({
      error: 'not_found',
      message: `No data found for constituency: "${constituencyId}".`,
      available: Object.keys(candidatesData.constituencies)
    });
  }

  const scenario = getScenario(constituencyData.electionDate);

  return res.json({
    success: true,
    constituency: {
      id: constituencyId,
      name: constituencyData.name,
      state: constituencyData.state,
      type: constituencyData.type,
      electionDate: constituencyData.electionDate,
      lastElectionDate: constituencyData.lastElectionDate
    },
    scenario,
    candidates: constituencyData.candidates,
    dataSource: 'VirtuElect Mock Database (ADR/ECI-style affidavit data — for educational demo only)'
  });
});

// ── GET /api/candidates/:constituencyId/results ────────────────────────────────
router.get('/:constituencyId/results', (req, res) => {
  const { constituencyId } = req.params;
  const results = resultsData[constituencyId];

  if (!results) {
    return res.status(404).json({
      error: 'not_found',
      message: `No historical results found for constituency: "${constituencyId}".`
    });
  }

  return res.json({
    success: true,
    constituencyId,
    results,
    dataSource: 'VirtuElect Mock Database (ECI-style results — for educational demo only)'
  });
});

// ── GET /api/candidates/find/:candidateId ──────────────────────────────────────
router.get('/find/:candidateId', (req, res) => {
  const { candidateId } = req.params;

  for (const constId in candidatesData.constituencies) {
    const c = candidatesData.constituencies[constId];
    const found = c.candidates.find(cand => cand.id === candidateId);
    if (found) {
      return res.json({
        success: true,
        candidate: found,
        constituencyId: constId,
        constituencyName: c.name
      });
    }
  }

  return res.status(404).json({
    error: 'not_found',
    message: `No candidate found with ID: "${candidateId}".`
  });
});

module.exports = router;
