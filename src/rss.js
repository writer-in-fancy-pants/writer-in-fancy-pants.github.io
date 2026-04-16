// src/rss.js
// ─────────────────────────────────────────────────────────────
// Generates an RSS 2.0 XML string from blog post objects.
// Call generateRSS(posts) at build time (vite plugin) OR
// serve it dynamically via a /feed.xml route.
//
// Each post must have: { id, title, date, topic, excerpt, body? }
// ─────────────────────────────────────────────────────────────

const SITE_URL   = 'https://writer-in-fancy-pants.github.io';
const SITE_TITLE = "Mehul's Blog";
const SITE_DESC  = 'Researcher, tinkerer, DJ — occasional essays and deep-dives.';

function escXml(str = '') {
  return str
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&apos;');
}

function rfcDate(isoDate) {
  return new Date(isoDate).toUTCString();
}

export function generateRSS(posts = []) {
  const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
  const lastBuild = sorted.length ? rfcDate(sorted[0].date) : new Date().toUTCString();

  const items = sorted.map(p => `
  <item>
    <title>${escXml(p.title)}</title>
    <link>${SITE_URL}/#blog/${escXml(p.id)}</link>
    <guid isPermaLink="true">${SITE_URL}/#blog/${escXml(p.id)}</guid>
    <pubDate>${rfcDate(p.date)}</pubDate>
    <category>${escXml(p.topic)}</category>
    <description>${escXml(p.excerpt)}</description>
  </item>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escXml(SITE_DESC)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;
}
