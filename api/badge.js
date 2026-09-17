const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const query = req.query || {};
  let slug = query.slug || query.id || 'default';
  slug = String(slug).replace(/\.svg$/i, '').trim().toLowerCase();

  let isVerified = false;
  let labelRight = 'SELF-ATTESTED';
  let colorRight = '#d97706'; // Amber for self-attested
  let textColorRight = '#ffffff';

  // Handle high-prestige enterprise seals directly
  if (slug === 'seal-verified' || slug === 'seal-sovereign') {
    const sealPath = path.join(__dirname, `../public/badge/${slug}.svg`);
    if (fs.existsSync(sealPath)) {
      const sealSvg = fs.readFileSync(sealPath, 'utf8');
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800');
      return res.status(200).send(sealSvg);
    }
  }

  try {
    const registryPath = path.join(__dirname, '../data/registry.json');
    if (fs.existsSync(registryPath)) {
      const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
      const entity = (registry.entities || []).find(e => e.slug === slug || e.id === slug);
      if (entity) {
        isVerified = true;
        labelRight = 'VERIFIED';
        colorRight = '#059669'; // Emerald
      }
    }
  } catch (err) {
    // Fallback gracefully
  }

  // Pre-approved flagship aliases
  if (slug.includes('privacyscrubber') || slug === 'reference') {
    isVerified = true;
    labelRight = 'VERIFIED';
    colorRight = '#059669';
  }

  // Custom label overrides via query parameters
  if (query.label) {
    labelRight = String(query.label).trim().toUpperCase();
  } else if (query.status === 'sovereign' || slug.includes('sovereign')) {
    labelRight = 'SOVEREIGN';
    colorRight = '#2563eb';
  } else if (query.status === 'dpa' || slug.includes('dpa')) {
    labelRight = 'DPA EXEMPT';
    colorRight = '#0f172a';
    textColorRight = '#10b981';
  }

  // Geometry calculations
  const wLeft = 58;
  const charWidth = 6.8;
  const wRight = Math.max(64, Math.round(labelRight.length * charWidth + 16));
  const totalWidth = wLeft + wRight;
  const textXRight = wLeft + Math.round(wRight / 2);

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="22" viewBox="0 0 ${totalWidth} 22" fill="none">
  <defs>
    <clipPath id="badgeClip">
      <rect width="${totalWidth}" height="22" rx="4"/>
    </clipPath>
  </defs>
  <g clip-path="url(#badgeClip)">
    <rect width="${wLeft}" height="22" fill="#0f172a"/>
    <rect x="${wLeft}" width="${wRight}" height="22" fill="${colorRight}"/>
    <rect width="${totalWidth}" height="22" stroke="#0f172a" stroke-width="1" fill="none"/>
    <!-- Official ZTDS Air-Gap Monolith Vector Mark -->
    <g transform="translate(6, 4)">
      <path d="M5.5 1.5C2.5 1.5 1 3.5 1 7C1 10.5 2.5 12.5 5.5 12.5V9.5C3.5 9.5 3.2 8 3.2 7C3.2 6 3.5 4.5 5.5 4.5V1.5Z" fill="#020617" stroke="#10b981" stroke-width="0.8"/>
      <path d="M8.5 1.5C11.5 1.5 13 3.5 13 7C13 10.5 11.5 12.5 8.5 12.5V9.5C10.5 9.5 10.8 8 10.8 7C10.8 6 10.5 4.5 8.5 4.5V1.5Z" fill="#020617" stroke="#10b981" stroke-width="0.8"/>
      <path d="M7 3L9.5 7L7 11L4.5 7Z" fill="#10b981"/>
      <circle cx="7" cy="7" r="1" fill="#38bdf8"/>
    </g>
    <text x="24" y="15" font-family="-apple-system, BlinkMacSystemFont, 'Inter', Roboto, sans-serif" font-size="10" font-weight="700" fill="#f8fafc" letter-spacing="0.5">ZTDS</text>
    <text x="${textXRight}" y="15" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Inter', Roboto, sans-serif" font-size="9" font-weight="700" fill="${textColorRight}" letter-spacing="0.6">${labelRight}</text>
  </g>
</svg>`.trim();

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800');
  return res.status(200).send(svg);
};
