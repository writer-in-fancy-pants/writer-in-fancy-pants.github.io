// src/giscus.js
// ─────────────────────────────────────────────────────────────
// Thin wrapper around the Giscus script widget.
//
// SETUP (one-time):
//   1. Go to https://giscus.app and configure your repo.
//   2. Replace GISCUS_REPO, GISCUS_REPO_ID, GISCUS_CATEGORY,
//      GISCUS_CATEGORY_ID below with the values it gives you.
//   3. Make sure Discussions are enabled on the repo and the
//      giscus GitHub App is installed.
// ─────────────────────────────────────────────────────────────

// ── ✏️  YOUR SETTINGS ───────────────────────────────────────
const GISCUS_REPO          = 'writer-in-fancy-pants/writer-in-fancy-pants.github.io';
const GISCUS_REPO_ID       = 'R_kgDORj_ZYw';          // from giscus.app
const GISCUS_CATEGORY      = 'Announcements';
const GISCUS_CATEGORY_ID   = 'DIC_kwDORj_ZY84C6jaI';   // from giscus.app
const GISCUS_REACTIONS     = '1';
// ────────────────────────────────────────────────────────────

let _currentTerm = null;

/**
 * Mount (or re-mount) Giscus into `containerId`.
 *
 * @param {string} containerId  - id of the <div> to render into
 * @param {string} term         - unique string per page/post
 *                                e.g. 'about', 'blog/my-post-slug', 'projects', 'music'
 */
export function mountGiscus(containerId, term) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Wipe old widget so Giscus re-initialises cleanly for the new term
  container.innerHTML = '';
  _currentTerm = term;

  const theme = document.documentElement.dataset.theme === 'light'
    ? 'light'
    : 'dark_dimmed';

  const script = document.createElement('script');
  script.src                = 'https://giscus.app/client.js';
  script.setAttribute('data-repo',             GISCUS_REPO);
  script.setAttribute('data-repo-id',          GISCUS_REPO_ID);
  script.setAttribute('data-category',         GISCUS_CATEGORY);
  script.setAttribute('data-category-id',      GISCUS_CATEGORY_ID);
  script.setAttribute('data-mapping',          'specific');   // use `term` directly
  script.setAttribute('data-term',             term);
  script.setAttribute('data-strict',           '0');
  script.setAttribute('data-reactions-enabled', GISCUS_REACTIONS);
  script.setAttribute('data-emit-metadata',    '0');
  script.setAttribute('data-input-position',   'top');
  script.setAttribute('data-theme',            theme);
  script.setAttribute('data-lang',             'en');
  script.crossOrigin = 'anonymous';
  script.async       = true;

  container.appendChild(script);
}

/**
 * Update the theme of any currently-mounted Giscus iframe
 * (call this from the theme-toggle handler).
 */
export function updateGiscusTheme() {
  const theme = document.documentElement.dataset.theme === 'light'
    ? 'light'
    : 'dark_dimmed';
  const frame = document.querySelector('iframe.giscus-frame');
  if (!frame) return;
  frame.contentWindow.postMessage(
    { giscus: { setConfig: { theme } } },
    'https://giscus.app'
  );
}
