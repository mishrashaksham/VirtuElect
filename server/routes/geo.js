/**
 * Geo Routes
 *
 * POST /api/geo/constituency  — Detect constituency from lat/lng (Turf.js PiP)
 * GET  /api/geo/constituencies — Full list for manual dropdown fallback
 */
const router = require('express').Router();
const { detectConstituency, getAllConstituencies } = require('../services/geoService');

// ── POST /api/geo/constituency ─────────────────────────────────────────────────
// Body: { lat: number, lng: number }
// Returns the constituency that contains the point, or 404 if outside coverage.
router.post('/constituency', (req, res) => {
  const { lat, lng } = req.body;

  // Validate inputs
  if (lat === undefined || lng === undefined) {
    return res.status(400).json({
      error: 'missing_params',
      message: 'Request body must include both "lat" and "lng" as numbers.'
    });
  }

  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);

  if (isNaN(parsedLat) || isNaN(parsedLng)) {
    return res.status(400).json({
      error: 'invalid_params',
      message: '"lat" and "lng" must be valid numbers.'
    });
  }

  // Rough bounding box check for India
  if (parsedLat < 8.0 || parsedLat > 37.5 || parsedLng < 68.0 || parsedLng > 97.5) {
    return res.status(400).json({
      error: 'out_of_bounds',
      message: 'Coordinates are outside India. Please check your location settings.'
    });
  }

  try {
    const constituency = detectConstituency(parsedLat, parsedLng);

    if (!constituency) {
      return res.status(404).json({
        error: 'outside_coverage',
        message: 'Your location is within India but outside our demo coverage area. Please use the manual selector.',
        hint: 'Demo covers: Delhi, Mumbai South, Bengaluru Central, Hyderabad, Chennai Central, Kolkata North, Pune, Ahmedabad East.'
      });
    }

    return res.json({
      success: true,
      constituency,
      detectionMethod: 'geolocation'
    });
  } catch (err) {
    console.error('[GeoRoute] Error during detection:', err);
    return res.status(500).json({
      error: 'server_error',
      message: 'Geospatial detection failed. Please use the manual selector.'
    });
  }
});

// ── GET /api/geo/constituencies ────────────────────────────────────────────────
// Returns all available constituencies for the manual dropdown.
router.get('/constituencies', (req, res) => {
  try {
    const list = getAllConstituencies();
    return res.json({ success: true, constituencies: list });
  } catch (err) {
    console.error('[GeoRoute] Error fetching constituency list:', err);
    return res.status(500).json({ error: 'server_error', message: 'Could not load constituency list.' });
  }
});

module.exports = router;
