// vite.config.js
import { defineConfig } from 'vite';
import { resolve }      from 'path';
import fs               from 'fs';
import path             from 'path';

// ── RSS generation plugin ─────────────────────────────────────
// Reads all blog posts at build time, generates /dist/feed.xml
function rssPlugin() {
  return {
    name: 'vite-plugin-rss',
    closeBundle() {
      try {
        // Dynamically import helpers (CJS-safe in the build hook)
        //const { marked }       = require('marked');
        const postsDir         = resolve(__dirname, 'blog');
        const files            = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

        const SITE_URL   = 'https://writer-in-fancy-pants.github.io';
        const SITE_TITLE = "Mehul's Blog";
        const SITE_DESC  = 'Researcher, tinkerer, DJ — occasional essays and deep-dives.';

        function esc(str = '') {
          return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
                    .replace(/"/g,'&quot;').replace(/'/g,'&apos;');
        }

        const posts = files.map(f => {
          const raw   = fs.readFileSync(path.join(postsDir, f), 'utf-8');
          const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
          const meta  = {};
          if (match) {
            match[1].split('\n').forEach(line => {
              const i = line.indexOf(':');
              if (i === -1) return;
              meta[line.slice(0,i).trim()] = line.slice(i+1).trim().replace(/^["']|["']$/g,'');
            });
          }
          return meta;
        }).sort((a,b) => new Date(b.date||0) - new Date(a.date||0));

        const items = posts.map(p => `
  <item>
    <title>${esc(p.title)}</title>
    <link>${SITE_URL}/#blog/${esc(p.id)}</link>
    <guid isPermaLink="true">${SITE_URL}/#blog/${esc(p.id)}</guid>
    <pubDate>${new Date(p.date).toUTCString()}</pubDate>
    <category>${esc(p.topic)}</category>
    <description>${esc(p.excerpt)}</description>
  </item>`).join('\n');

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${esc(SITE_DESC)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

        const outDir = resolve(__dirname, 'dist');
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.join(outDir, 'feed.xml'), xml, 'utf-8');
        console.log('✓ RSS feed written to dist/feed.xml');
      } catch (e) {
        console.warn('RSS plugin: could not generate feed.xml —', e.message);
      }
    },
  };
}

export default defineConfig({
  // Set your GitHub Pages repo base here.
  // If deploying to https://writer-in-fancy-pants.github.io/ (root), use '/'.
  base: '/',

  plugins: [rssPlugin()],

  build: {
    outDir: 'dist',
    rollupOptions: {
      input: { main: resolve(__dirname, 'index.html') },
    },
  },

  // Allow Vite to import .md files as raw strings
  assetsInclude: ['**/*.md'],
});
