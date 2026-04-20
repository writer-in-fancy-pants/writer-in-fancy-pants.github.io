// src/main.js
// ─────────────────────────────────────────────────────────────
// App shell: routing, tab switching, blog renderer,
// likes, share, search, giscus, RSS, theme toggle.
// ─────────────────────────────────────────────────────────────

import './styles/main.css'
import { POSTS, getLikes, isLiked, toggleLike,
         getTopics, getDateGroups, searchPosts } from './blog.js';
import { initMusic }          from './music.js';
import { mountGiscus, updateGiscusTheme } from './giscus.js';
import { generateRSS }        from './rss.js';

// ── Projects data ─────────────────────────────────────────────
const PROJECTS = [
  {
    title : "Meditations",
    status: 'active',
    description : 'Live neurofeedback / biofeedback training and monitored meditation via stream from health devices (EEG, Heart rate, etc).',
    tags: ['alpha/theta', 'hrv', 'neurofeedback', 'python', 'audio', 'js', 'open source'],
    link: 'https://github.com/writer-in-fancy-pants/meditations',
    demo : 'https://writer-in-fancy-pants.github.io/meditations/'
  },
  {
    title : "Mind Acoustic Tools",
    status: 'active',
    description : 'Tools that use spatial (stereo) audio. Currently supports Hearing Test, EMDR self-therapy, and guided meditations. Work in progress, would love feedback on expected features.',
    tags: ['audio', 'emdr', 'python', 'js', 'open source', 'dashboard'],
    link : 'https://github.com/writer-in-fancy-pants/mind-audio-tools',
    demo : 'https://writer-in-fancy-pants.github.io/mind-audio-tools/'
  },
  {
    title : "Muse 2 EEG Dashboard",
    status: 'active',
    description : 'Dashboard to visualize and compare EEG sessions using various neurofeedback metrics and frequency spectrum power distribution. Upload csv files with "timestamps,TF9,AF7,AF8,TF10" header and signal ordering. Other recordings should be converted to this format before uploading using conversion tools provided in the repo',
    tags: ['eeg', 'neurofeedback', 'python', 'js', 'open source', 'dashboard'],
    link: 'https://github.com/writer-in-fancy-pants/muse2-eeg-dashboard',
    demo: 'https://writer-in-fancy-pants.github.io/muse2-eeg-dashboard/'
  },
  // Add your projects here. Example:
  // {
  //   title:       'Project Name',
  //   description: 'What it does.',
  //   tags:        ['Python', 'LLM'],
  //   link:        'https://github.com/...',
  //   demo:        'https://...',   // optional
  // },
];

// ─────────────────────────────────────────────────────────────
// 1. THEME
// ─────────────────────────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.dataset.theme = saved;
  updateToggleLabel(saved);
}

function updateToggleLabel(theme) {
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
}

document.getElementById('theme-toggle')?.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('theme', next);
  updateToggleLabel(next);
  updateGiscusTheme();
});

// ─────────────────────────────────────────────────────────────
// 2. TOAST
// ─────────────────────────────────────────────────────────────
function toast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2200);
}

// ─────────────────────────────────────────────────────────────
// 3. HASH ROUTER
// Route format:
//   #about  #blog  #blog/post-id  #projects  #music  #music/track-id
// ─────────────────────────────────────────────────────────────
const TABS = ['about', 'blog', 'projects', 'music'];

function parseHash() {
  const raw = location.hash.replace('#', '') || 'about';
  const [section, sub] = raw.split('/');
  return { section: TABS.includes(section) ? section : 'about', sub: sub || null };
}

function navigate(hash, pushState = true) {
  if (pushState) history.pushState(null, '', `#${hash}`);
  render(parseHash());
}

window.addEventListener('popstate', () => render(parseHash()));

// ─────────────────────────────────────────────────────────────
// 4. TAB SWITCHER
// ─────────────────────────────────────────────────────────────
function showSection(id) {
  document.querySelectorAll('.page').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-tabs button').forEach(b => b.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
  document.getElementById(`tab-${id}`)?.classList.add('active');
  // Update OG url meta
  document.getElementById('og-url')?.setAttribute('content',
    `https://writer-in-fancy-pants.github.io/#${id}`);
}

TABS.forEach(id => {
  document.getElementById(`tab-${id}`)?.addEventListener('click', () => navigate(id));
});

// ─────────────────────────────────────────────────────────────
// 5. RENDER DISPATCHER
// ─────────────────────────────────────────────────────────────
function render({ section, sub }) {
  showSection(section);

  if (section === 'blog') {
    if (sub) renderPost(sub);
    else     renderPostList();
  } else if (section === 'projects') {
    renderProjects();
    mountGiscus('giscus-projects', 'projects');
  } else if (section === 'music') {
    initMusic();
    mountGiscus('giscus-music', sub ? `music/${sub}` : 'music');
  } else if (section === 'about') {
    //mountGiscus('giscus-about', 'about');
  }
}

// ─────────────────────────────────────────────────────────────
// 6. BLOG — LIST VIEW
// ─────────────────────────────────────────────────────────────
function renderPostList(postsToShow = POSTS, activeTopic = null) {
  const listView   = document.getElementById('post-list-view');
  const singleView = document.getElementById('single-post-view');
  if (!listView || !singleView) return;
  listView.style.display   = '';
  singleView.style.display = 'none';

  const container = document.getElementById('posts-container');
  if (!container) return;
  container.innerHTML = '';

  if (postsToShow.length === 0) {
    container.innerHTML = '<p class="empty-state">No posts found.</p>';
    return;
  }

  postsToShow.forEach(post => {
    const card = document.createElement('article');
    card.className = 'post-card';

    const liked = isLiked(post.id);
    const likes = getLikes(post.id);

    card.innerHTML = `
      <div class="post-card-header">
        <div>
          <h3 class="post-card-title">${post.title}</h3>
          <div class="post-card-meta">
            <span class="post-date">${formatDate(post.date)}</span>
            <span class="post-tag">${post.topic}</span>
            <span class="reading-time">${post.readingTime}</span>
          </div>
        </div>
      </div>
      <p class="post-excerpt">${post.excerpt}</p>
      <div class="post-card-footer">
        <a class="read-more" data-id="${post.id}" href="#blog/${post.id}">Read more →</a>
        <div class="post-card-actions">
          <button class="action-btn like-btn ${liked ? 'liked' : ''}"
                  data-id="${post.id}" aria-label="Like">
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            <span>${likes}</span>
          </button>
          <button class="action-btn share-btn" data-id="${post.id}"
                  data-title="${post.title}" aria-label="Share">
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>
            Share
          </button>
        </div>
      </div>
    `;

    // Read more click
    card.querySelector('.read-more').addEventListener('click', e => {
      e.preventDefault();
      navigate(`blog/${post.id}`);
    });

    // Like
    card.querySelector('.like-btn').addEventListener('click', e => {
      const btn    = e.currentTarget;
      const result = toggleLike(post.id);
      btn.classList.toggle('liked', result.liked);
      btn.querySelector('span').textContent = result.count;
    });

    // Share
    card.querySelector('.share-btn').addEventListener('click', e => {
      sharePost(e.currentTarget.dataset.id, e.currentTarget.dataset.title);
    });

    container.appendChild(card);
  });

  buildSidebar(activeTopic);
}

// ─────────────────────────────────────────────────────────────
// 7. BLOG — SIDEBAR
// ─────────────────────────────────────────────────────────────
function buildSidebar(activeTopic) {
  const topicList = document.getElementById('topic-index');
  const dateList  = document.getElementById('date-index');
  if (!topicList || !dateList) return;

  topicList.innerHTML = '';
  const allLi = document.createElement('li');
  allLi.innerHTML = `<button class="${!activeTopic ? 'active' : ''}">All <span class="count">${POSTS.length}</span></button>`;
  allLi.querySelector('button').addEventListener('click', () => {
    renderPostList(POSTS, null);
  });
  topicList.appendChild(allLi);

  getTopics().forEach(([topic, count]) => {
    const li = document.createElement('li');
    li.innerHTML = `<button class="${activeTopic === topic ? 'active' : ''}">${topic} <span class="count">${count}</span></button>`;
    li.querySelector('button').addEventListener('click', () => {
      renderPostList(POSTS.filter(p => p.topic === topic), topic);
    });
    topicList.appendChild(li);
  });

  dateList.innerHTML = '';
  getDateGroups().forEach(([ym, count]) => {
    const li = document.createElement('li');
    const label = new Date(ym + '-01').toLocaleDateString('en-US', { year:'numeric', month:'long' });
    li.innerHTML = `<button>${label} <span class="count">${count}</span></button>`;
    li.querySelector('button').addEventListener('click', () => {
      renderPostList(POSTS.filter(p => p.date?.startsWith(ym)), null);
    });
    dateList.appendChild(li);
  });
}

// ─────────────────────────────────────────────────────────────
// 8. BLOG — SINGLE POST VIEW
// ─────────────────────────────────────────────────────────────
function renderPost(id) {
  const post = POSTS.find(p => p.id === id);
  const listView   = document.getElementById('post-list-view');
  const singleView = document.getElementById('single-post-view');
  if (!listView || !singleView) return;

  if (!post) {
    listView.style.display   = '';
    singleView.style.display = 'none';
    return;
  }

  listView.style.display   = 'none';
  singleView.style.display = '';

  // Fill fields
  document.getElementById('sp-title').textContent       = post.title;
  document.getElementById('sp-date').textContent        = formatDate(post.date);
  document.getElementById('sp-topic').textContent       = post.topic;
  //document.getElementById('sp-reading-time').textContent = post.readingTime;
  document.getElementById('sp-body').innerHTML          = post.html;

  // Add scripts from html
  const parser = new DOMParser();
  const doc =parser.parseFromString(post.html, 'text/html');
  const scripts = doc.querySelectorAll('script');
  scripts.forEach(script => {
      const newScript = document.createElement('script');
      
      // Copy attributes (e.g., src, type, async)
      Array.from(script.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
      });

      // If it's an inline script, copy the text content
      if (script.textContent) {
          newScript.textContent = script.textContent;
      }

      // Append to the page to trigger execution
      document.body.appendChild(newScript);
  });

  // Update SEO meta
  document.title = `${post.title} - writer-in-fancy-pants.github.com`;
  document.getElementById('og-title')?.setAttribute('content', post.title);
  document.getElementById('og-description')?.setAttribute('content', post.excerpt);
  document.getElementById('og-url')?.setAttribute(
     'content', `https://writer-in-fancy-pants.github.io/#blog/${post.id}`);
  document.getElementById('sp-body')
  // singleView.style.visibility = 'visible';
  // Sync like buttons
  syncLikeButtons(post.id);

  // Back button
  document.getElementById('back-btn').onclick = () => navigate('blog');

  // Action bar buttons
  bindPostActions(post.id, post.title);

  // Mount Giscus for this specific post
  mountGiscus('giscus-blog', `blog/${post.id}`);

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function syncLikeButtons(id) {
  const liked = isLiked(id);
  const count = getLikes(id);
  ['sp-like-btn', 'sp-like-btn-footer'].forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.classList.toggle('liked', liked);
    // update counter span inside button
    const counter = btn.querySelector('span') || btn.querySelector('#sp-like-count') || btn.querySelector('#sp-like-count-footer');
    if (counter) counter.textContent = count;
  });
  const c1 = document.getElementById('sp-like-count');
  const c2 = document.getElementById('sp-like-count-footer');
  if (c1) c1.textContent = count;
  if (c2) c2.textContent = count;
}

function bindPostActions(id, title) {
  ['sp-like-btn', 'sp-like-btn-footer'].forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.onclick = () => {
      const result = toggleLike(id);
      syncLikeButtons(id);
    };
  });

  ['sp-share-btn', 'sp-share-btn-footer'].forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.onclick = () => sharePost(id, title);
  });

  const copyBtn = document.getElementById('sp-copy-btn');
  if (copyBtn) {
    copyBtn.onclick = () => {
      const url = `${location.origin}${location.pathname}#blog/${id}`;
      navigator.clipboard.writeText(url).then(() => toast('Link copied!'));
    };
  }
}

// ─────────────────────────────────────────────────────────────
// 9. PROJECTS RENDERER
// ─────────────────────────────────────────────────────────────
function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid || grid.dataset.rendered) return;
  grid.dataset.rendered = '1';
  grid.innerHTML = '';

  if (PROJECTS.length === 0) {
    grid.innerHTML = '<p class="empty-state">Projects coming soon.</p>';
    return;
  }

  PROJECTS.forEach(p => {
    const card = document.createElement('div');
    card.className = 'project-card';
    const tags = (p.tags || []).map(t => `<span class="project-tag">${t}</span>`).join('');
    const links = [
      p.link ? `<a href="${p.link}" target="_blank" rel="noopener" class="project-link">GitHub →</a>` : '',
      p.demo ? `<a href="${p.demo}" target="_blank" rel="noopener" class="project-link">Demo →</a>` : '',
    ].join('');
    card.innerHTML = `
      <h3 class="project-title">${p.title}</h3>
      <p class="project-desc">${p.description}</p>
      <div class="project-tags">${tags}</div>
      <div class="project-links">${links}</div>
    `;
    grid.appendChild(card);
  });
}

// ─────────────────────────────────────────────────────────────
// 10. SHARE HELPER
// ─────────────────────────────────────────────────────────────
function sharePost(id, title) {
  const url = `${location.origin}${location.pathname}#blog/${id}`;
  if (navigator.share) {
    navigator.share({ title, url }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url).then(() => toast('Link copied!'));
  }
}

// ─────────────────────────────────────────────────────────────
// 11. SEARCH
// ─────────────────────────────────────────────────────────────
let _searchTimeout;
document.getElementById('blog-search')?.addEventListener('input', e => {
  clearTimeout(_searchTimeout);
  _searchTimeout = setTimeout(() => {
    const q = e.target.value.trim();
    if (q.length === 0) renderPostList(POSTS, null);
    else renderPostList(searchPosts(q), null);
  }, 250);
});

// ─────────────────────────────────────────────────────────────
// 12. RSS — inject <link> and expose /feed.xml at build time
// ─────────────────────────────────────────────────────────────
// The Vite plugin in vite.config.js handles writing the file.
// Here we just expose the generator for the plugin to use.
export { generateRSS, POSTS };

// ─────────────────────────────────────────────────────────────
// 13. UTILITIES
// ─────────────────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

// ─────────────────────────────────────────────────────────────
// 14. BOOT
// ─────────────────────────────────────────────────────────────
initTheme();
document.getElementById('yr').textContent = new Date().getFullYear();
render(parseHash());
