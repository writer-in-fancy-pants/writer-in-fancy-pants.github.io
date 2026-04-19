// src/blog.js
// ─────────────────────────────────────────────────────────────
// Loads markdown posts at build time (Vite glob import),
// parses frontmatter, and provides rendering helpers.
// ─────────────────────────────────────────────────────────────

import { marked } from 'marked';

// Vite eager glob — picks up every .md file in /blog/
const RAW = import.meta.glob('/blog/*.md', { query: '?raw', import: 'default' , eager: true });

// ── Frontmatter parser ────────────────────────────────────────
function parseFrontmatter(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta = {};
  match[1].split('\n').forEach(line => {
    const idx = line.indexOf(':');
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    meta[key] = val;
  });
  return { meta, body: match[2] };
}

// ── Reading time ──────────────────────────────────────────────
function readingTime(text) {
  const words = text.trim().split(/\s+/).length;
  const mins  = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

// ── Build post list ───────────────────────────────────────────
export const POSTS = Object.entries(RAW)
  .map(([path, raw]) => {
    const { meta, body } = parseFrontmatter(raw);
    const filename = path.replace('/blog/', '').replace('.md', '');
    return {
      id:      meta.id      || filename,
      title:   meta.title   || filename,
      date:    meta.date    || '',
      topic:   meta.topic   || 'General',
      excerpt: meta.excerpt || '',
      readingTime: readingTime(body),
      body,
      html: marked.parse(body),
    };
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date));

// ── Likes (localStorage) ──────────────────────────────────────
export function getLikes(id)  { return parseInt(localStorage.getItem(`blog-likes-${id}`) || '0', 10); }
export function isLiked(id)   { return localStorage.getItem(`blog-liked-${id}`) === '1'; }
export function toggleLike(id) {
  const liked = isLiked(id);
  const count = getLikes(id);
  localStorage.setItem(`blog-liked-${id}`, liked ? '0' : '1');
  localStorage.setItem(`blog-likes-${id}`, String(liked ? Math.max(0, count - 1) : count + 1));
  return { liked: !liked, count: getLikes(id) };
}

// ── Topics + date groups ──────────────────────────────────────
export function getTopics() {
  const map = {};
  POSTS.forEach(p => { map[p.topic] = (map[p.topic] || 0) + 1; });
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

export function getDateGroups() {
  const map = {};
  POSTS.forEach(p => {
    if (!p.date) return;
    const ym = p.date.slice(0, 7);
    map[ym] = (map[ym] || 0) + 1;
  });
  return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
}

// ── Search ────────────────────────────────────────────────────
export function searchPosts(query) {
  const q = query.toLowerCase();
  return POSTS.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.excerpt.toLowerCase().includes(q) ||
    p.topic.toLowerCase().includes(q) ||
    p.body.toLowerCase().includes(q)
  );
}
