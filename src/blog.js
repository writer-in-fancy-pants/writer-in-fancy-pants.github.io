/**
 * blog.js
 * Loads all markdown files from /blog/*.md at build time via Vite's import.meta.glob.
 * Each file must begin with a YAML-like frontmatter block delimited by ---.
 *
 * Frontmatter fields:
 *   id       – unique slug (used for URL hash and anchors)
 *   title    – post title
 *   date     – ISO date string e.g. "2025-11-12"
 *   topic    – category string
 *   excerpt  – one-sentence summary shown in list view
 */

import { marked } from 'marked'

// Vite eagerly imports all .md files under /blog at build time.
// The `?raw` suffix gives us the file content as a plain string.
const rawFiles = import.meta.glob('/blog/*.md', { eager: true, query: '?raw', import: 'default' })

/**
 * Parse YAML-ish frontmatter between the first pair of --- delimiters.
 * Returns { meta: {}, body: '' }
 */
function parseFrontmatter(raw) {
  const fm = {}
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/m)
  if (!match) return { meta: fm, body: raw }

  const [, header, body] = match
  for (const line of header.split('\n')) {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) continue
    const key = line.slice(0, colonIdx).trim()
    let value = line.slice(colonIdx + 1).trim()
    // Strip surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    fm[key] = value
  }

  return { meta: fm, body: body.trim() }
}

/**
 * Returns a sorted (newest first) array of post objects:
 * { id, title, date, topic, excerpt, html }
 */
export function loadPosts() {
  const posts = []

  for (const [, raw] of Object.entries(rawFiles)) {
    const { meta, body } = parseFrontmatter(raw)
    if (!meta.id || !meta.title) continue

    posts.push({
      id:      meta.id,
      title:   meta.title,
      date:    meta.date || '',
      topic:   meta.topic || 'General',
      excerpt: meta.excerpt || '',
      html:    marked.parse(body),
      // Seed comments array (replace with a real backend / giscus in production)
      comments: []
    })
  }

  return posts.sort((a, b) => b.date.localeCompare(a.date))
}
