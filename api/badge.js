const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const query = req.query || {};
  let slug = query.slug || query.id || 'default';
  slug = String(slug).replace(/\.svg$/i, '').trim().toLowerCase();

  let isVerified = false;
  let labelRight = 'SELF-ATTESTED';
  let colorRight = '#eab308'; // Amber

  try {
    const registryPath = path.join(__dirname, '../data/registry.json');
    if (fs.existsSync(registryPath)) {
      const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
      const entity = (registry.entities || []).find(e => e.slug === slug || e.id === slug);
      if (entity) {
        isVerified = true;
        labelRight = 'VERIFIED';
        colorRight = '#10b981'; // Emerald
      }
    }
  } catch (err) {
    // Fallback gracefully
  }

  // Pre-approved flagship aliases
  if (slug.includes('privacyscrubber') || slug === 'reference') {
    isVerified = true;
    labelRight = 'VERIFIED';
    colorRight = '#10b981';
  }

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="138" height="22" viewBox="0 0 138 22" fill="none">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="138" y2="22" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0b0f19"/>
      <stop offset="1" stop-color="#020617"/>
    </linearGradient>
    <clipPath id="clip">
      <rect width="138" height="22" rx="4"/>
    </clipPath>
  </defs>
  <g clip-path="url(#clip)">
    <rect width="66" height="22" fill="#0f172a"/>
    <rect x="66" width="72" height="22" fill="#020617"/>
    <rect width="138" height="22" stroke="#1e293b" stroke-width="1" fill="none"/>
    <circle cx="12" cy="11" r="4" fill="#38bdf8"/>
    <text x="22" y="15" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="700" fill="#f8fafc" letter-spacing="0.5">ZTDS</text>
    <text x="73" y="15" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="700" fill="${colorRight}" letter-spacing="0.6">${labelRight}</text>
  </g>
</svg>`.trim();

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800');
  return res.status(200).send(svg);
};
