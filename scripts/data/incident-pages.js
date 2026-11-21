'use strict';

/**
 * Loader for ZTDS Incident Counterfactuals SSOT (`data/incidents.json`).
 * Dynamically merges per-incident matrix summaries and primary sources into HUB
 * so adding an incident entry to `data/incidents.json` updates every view atomically.
 */

const fs = require('fs');
const path = require('path');

const DATA_PATH = path.resolve(__dirname, '../../data/incidents.json');

function loadIncidentData() {
  const raw = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const incidents = Array.isArray(raw.incidents) ? raw.incidents : [];

  const matrix = incidents.map(inc => {
    const ms = inc.matrixSummary || {};
    return {
      incident: ms.incident || inc.shortLabel || inc.headline,
      link: inc.path || `/incidents/${inc.slug}/`,
      rootVector: ms.rootVector || inc.metaDescription,
      ztdsControl: ms.ztdsControl || (inc.invariants && inc.invariants[0] && inc.invariants[0].howItHelps) || '',
      boundaryLimit: ms.boundaryLimit || (inc.notPrevented && inc.notPrevented[0]) || ''
    };
  });

  const seenUrls = new Set();
  const primarySources = [];
  for (const s of (raw.hub && raw.hub.primarySources) || []) {
    if (s && s.url && !seenUrls.has(s.url)) {
      seenUrls.add(s.url);
      primarySources.push(s);
    }
  }
  for (const inc of incidents) {
    for (const s of inc.primarySources || []) {
      if (s && s.url && !seenUrls.has(s.url)) {
        seenUrls.add(s.url);
        primarySources.push(s);
      }
    }
  }

  const latestIso = incidents.reduce((best, inc) => {
    const t = inc.modifiedIso || inc.publishedIso || '';
    return t > best ? t : best;
  }, (raw.hub && raw.hub.modifiedIso) || '2026-11-21T00:00:00Z');

  const hub = {
    ...(raw.hub || {}),
    modifiedIso: latestIso,
    primarySources,
    crossCuttingMatrix: matrix
  };

  return { HUB: hub, INCIDENTS: incidents };
}

const loaded = loadIncidentData();
module.exports = {
  ...loaded,
  loadIncidentData,
  DATA_PATH
};
