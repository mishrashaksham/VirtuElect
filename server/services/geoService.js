/**
 * GeoService — Point-in-Polygon constituency detection using Turf.js
 * Loads the mock GeoJSON FeatureCollection and determines which
 * parliamentary constituency a given lat/lng falls within.
 */

const turf = require('@turf/turf');
const fs = require('fs');
const path = require('path');

// Load GeoJSON once at startup for performance
const geoDataPath = path.join(__dirname, '..', 'data', 'constituencies.geojson');
let featureCollection = null;

function loadGeoData() {
  if (!featureCollection) {
    const raw = fs.readFileSync(geoDataPath, 'utf-8');
    featureCollection = JSON.parse(raw);
    console.log(`[GeoService] Loaded ${featureCollection.features.length} constituency polygons.`);
  }
  return featureCollection;
}

/**
 * Detect which constituency a point (lat, lng) falls within.
 * @param {number} lat — Latitude (e.g. 28.6139 for Delhi)
 * @param {number} lng — Longitude (e.g. 77.2090 for Delhi)
 * @returns {object|null} — Constituency properties or null if outside coverage
 */
function detectConstituency(lat, lng) {
  const fc = loadGeoData();

  // Turf uses [longitude, latitude] order (GeoJSON spec)
  const point = turf.point([lng, lat]);

  for (const feature of fc.features) {
    if (turf.booleanPointInPolygon(point, feature)) {
      return {
        id: feature.properties.id,
        name: feature.properties.name,
        state: feature.properties.state,
        stateCode: feature.properties.stateCode,
        type: feature.properties.type,
        number: feature.properties.number,
        electionDate: feature.properties.electionDate,
        lastElectionDate: feature.properties.lastElectionDate,
        scenario: feature.properties.scenario
      };
    }
  }

  return null; // Point doesn't fall within any known constituency
}

/**
 * Get list of all available constituencies (for manual dropdown fallback).
 * @returns {Array} — Array of { id, name, state, stateCode }
 */
function getAllConstituencies() {
  const fc = loadGeoData();
  return fc.features.map(f => ({
    id: f.properties.id,
    name: f.properties.name,
    state: f.properties.state,
    stateCode: f.properties.stateCode
  }));
}

module.exports = {
  detectConstituency,
  getAllConstituencies,
  loadGeoData
};
