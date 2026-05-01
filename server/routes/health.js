/**
 * GET /api/health
 * Simple health check endpoint.
 */
const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'VirtuElect API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime().toFixed(2) + 's'
  });
});

module.exports = router;
