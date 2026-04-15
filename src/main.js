import './styles/main.css'
import { loadPosts } from './blog.js'

/* ═══════════════════════════════════════════════
   DATA — edit PROJECTS to describe your work
═══════════════════════════════════════════════ */
const PROJECTS = [
  {
    name : "Muse 2 EEG Dashboard",
    status: 'active',
    desc: 'Dashboard to visualize and compare EEG sessions using various neurofeedback metrics and frequency spectrum power distribution. Upload csv files with "timestamps,TF9,AF7,AF8,TF10" header and signal ordering. Other recordings should be converted to this format before uploading using conversion tools provided in the repo',
    tags: ['eeg', 'neurofeedback', 'python', 'js', 'open source', 'dashboard'],
    links: [
      { label: 'GitHub', url: 'https://github.com/writer-in-fancy-pants/muse2-eeg-dashboard', primary: false },
      { label: 'Dashboard',   url: 'https://writer-in-fancy-pants.github.io/muse2-eeg-dashboard/', primary: true }
    ]
  },
  {
    name : "Meditations",
    status: 'active',
    desc: 'Live neurofeedback / biofeedback training and monitored meditation via stream from health devices (EEG, Heart rate, etc).',
    tags: ['alpha/theta', 'hrv', 'neurofeedback', 'python', 'audio', 'js', 'open source'],
    links: [
      { label: 'GitHub', url: 'https://github.com/writer-in-fancy-pants/meditations', primary: false },
      { label: 'Dashboard',   url: 'https://writer-in-fancy-pants.github.io/meditations/', primary: true }
    ]
  }
  {
    name : "Mind Acoustic Tools",
    status: 'active',
    desc: 'Tools that use spatial (stereo) audio. Currently supports Hearing Test, EMDR self-therapy, and guided meditations. Work in progress, would love feedback on expected features.',
    tags: ['audio', 'emdr', 'python', 'js', 'open source', 'dashboard'],
    links: [
      { label: 'GitHub', url: 'https://github.com/writer-in-fancy-pants/mind-audio-tools', primary: false },
      { label: 'Dashboard',   url: 'https://writer-in-fancy-pants.github.io/mind-audio-tools/', primary: true }
    ]
  }
  // {
  //   name: 'ML Experiment Tracker',
  //   status: 'active',
  //   desc: 'Lightweight experiment tracking for PyTorch training runs. Logs metrics, hyperparameters, and artifacts to a local SQLite database with a clean web UI — no cloud account needed.',
  //   tags: ['Python', 'PyTorch', 'SQLite', 'FastAPI'],
  //   links: [
  //     { label: 'GitHub',    url: 'https://github.com/yourusername/ml-tracker', primary: true },
  //     { label: 'Live Demo', url: 'https://ml-tracker-demo.vercel.app', primary: false }
  //   ]
  // },
  // {
  //   name: 'Research Paper: [Title]',
  //   status: 'active',
  //   desc: 'Published at [Conference / Journal]. Proposes a new approach to [problem area] that reduces [metric] by X% while maintaining [other property].',
  //   tags: ['Research', 'ML', 'NLP'],
  //   links: [
  //     { label: 'arXiv', url: 'https://arxiv.org/abs/XXXX.XXXXX', primary: true },
  //     { label: 'Code',  url: 'https://github.com/yourusername/paper-code', primary: false }
  //   ]
  // },
  // {
  //   name: 'Datavis Dashboard',
  //   status: 'wip',
  //   desc: 'An interactive dashboard for exploring [dataset]. Built to answer questions I kept having to write one-off scripts for. Work in progress — contributions welcome.',
  //   tags: ['TypeScript', 'D3.js', 'React'],
  //   links: [
  //     { label: 'GitHub', url: 'https://github.com/yourusername/datavis', primary: true }
  //   ]
  // },
  // {
  //   name: 'OldProject',
  //   status: 'archived',
  //   desc: 'An early experiment in [domain]. No longer maintained, but the approach might still be interesting as a reference.',
  //   tags: ['Python', 'Flask'],
  //   links: [
  //     { label: 'GitHub', url: 'https://github.com/yourusername/oldproject', primary: true }
  //   ]
  // }
]

/* ═══════════════════════════════════════════════
   THEME
═══════════════════════════════════════════════ */
function initTheme() {
  // Default to dark; honour saved preference
  const saved = localStorage.getItem('theme')
  const theme = saved || 'dark'
  applyTheme(theme)
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
  const btn = document.getElementById('theme-toggle')
  if (btn) btn.textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark'
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme')
  applyTheme(current === 'dark' ? 'light' : 'dark')
}

/* ═══════════════════════════════════════════════
   TABS
═══════════════════════════════════════════════ */
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'))
  document.querySelectorAll('.nav-tabs button').forEach(b => b.classList.remove('active'))
  document.getElementById(name).classList.add('active')
  document.getElementById('tab-' + name).classList.add('active')
}

/* ═══════════════════════════════════════════════
   BLOG
═══════════════════════════════════════════════ */
let posts = []
let localComments = {}
let isLoggedIn = false
let currentPostId = null

function buildBlog(filtered, headingText) {
  const container = document.getElementById('posts-container')
  container.innerHTML = ''

  const titleEl = document.querySelector('.blog-page-title')
  titleEl.innerHTML = headingText || 'Writing'
  if (headingText) {
    const reset = document.createElement('a')
    reset.href = '#'
    reset.style.cssText = 'font-size:.8rem;color:var(--accent);margin-left:.7rem;'
    reset.textContent = '(clear)'
    reset.onclick = e => { e.preventDefault(); buildBlog(posts) }
    titleEl.appendChild(reset)
  }

  const list = filtered || posts
  if (!list.length) {
    container.innerHTML = '<p style="color:var(--muted);font-size:.9rem;padding:1.5rem 0;">No posts found.</p>'
    return
  }

  list.forEach(post => {
    const card = document.createElement('div')
    card.className = 'post-card'
    card.innerHTML = `
      <div class="post-meta">
        <span class="post-tag">${post.topic}</span>
        <span>${formatDate(post.date)}</span>
      </div>
      <a class="post-title" href="#" data-id="${post.id}">${post.title}</a>
      <p class="post-excerpt">${post.excerpt}</p>
      <a class="read-more" href="#" data-id="${post.id}">Read more →</a>
    `
    card.querySelectorAll('[data-id]').forEach(el =>
      el.addEventListener('click', e => { e.preventDefault(); openPost(post.id) })
    )
    container.appendChild(card)
  })
}

function buildSidebar() {
  // Topics
  const topics = [...new Set(posts.map(p => p.topic))]
  const topicList = document.getElementById('topic-index')
  topicList.innerHTML = topics.map(t =>
    `<li><a href="#" class="topic-tag" data-topic="${t}">${t}</a></li>`
  ).join('')
  topicList.querySelectorAll('[data-topic]').forEach(el =>
    el.addEventListener('click', e => {
      e.preventDefault()
      const t = el.dataset.topic
      buildBlog(posts.filter(p => p.topic === t), `Topic: ${t}`)
    })
  )

  // Dates
  const groups = {}
  posts.forEach(p => {
    const ym = p.date.slice(0, 7)
    if (!groups[ym]) groups[ym] = []
    groups[ym].push(p)
  })

  const dateList = document.getElementById('date-index')
  dateList.innerHTML = Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([ym, ps]) => {
      const label = new Date(ym + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      const sub = ps.map(p =>
        `<li><a href="#" style="padding-left:.7rem;" data-id="${p.id}">↳ ${p.title.length > 28 ? p.title.slice(0,28)+'…' : p.title}</a></li>`
      ).join('')
      return `<li><a href="#" style="font-weight:500;" data-ym="${ym}">${label}</a></li>${sub}`
    }).join('')

  dateList.querySelectorAll('[data-id]').forEach(el =>
    el.addEventListener('click', e => {
      e.preventDefault()
      openPost(el.dataset.id)
    })
  )
  dateList.querySelectorAll('[data-ym]').forEach(el =>
    el.addEventListener('click', e => {
      e.preventDefault()
      const ym = el.dataset.ym
      const label = new Date(ym + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      buildBlog(posts.filter(p => p.date.startsWith(ym)), label)
    })
  )
}

function openPost(id) {
  const post = posts.find(p => p.id === id)
  if (!post) return
  currentPostId = id

  document.getElementById('sp-title').textContent = post.title
  document.getElementById('sp-date').textContent = formatDate(post.date)
  document.getElementById('sp-topic').textContent = post.topic
  document.getElementById('sp-body').innerHTML = post.html

  renderComments(post)

  document.getElementById('post-list-view').classList.add('hidden')
  document.getElementById('single-post-view').classList.add('active')
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function closePost() {
  currentPostId = null
  document.getElementById('post-list-view').classList.remove('hidden')
  document.getElementById('single-post-view').classList.remove('active')
}

function renderComments(post) {
  const list = document.getElementById('comments-list')
  const all = [...post.comments, ...(localComments[post.id] || [])]
  list.innerHTML = all.length
    ? all.map(c => `
        <div class="comment">
          <div class="comment-avatar">${(c.initials || c.author.slice(0,2)).toUpperCase()}</div>
          <div class="comment-body">
            <p class="comment-author">${c.author}</p>
            <p class="comment-date">${c.date}</p>
            <p class="comment-text">${c.text}</p>
          </div>
        </div>`).join('')
    : '<p style="font-size:.87rem;color:var(--muted);margin-bottom:1rem;">No comments yet.</p>'

  updateAuthUI()
}

function updateAuthUI() {
  const status  = document.getElementById('auth-status')
  const btn     = document.getElementById('auth-toggle-btn')
  const notice  = document.getElementById('login-notice')
  const form    = document.getElementById('comment-form')

  if (isLoggedIn) {
    status.textContent = 'Signed in as Demo User.'
    btn.textContent = 'Sign out'
    notice.style.display = 'none'
    form.classList.add('visible')
  } else {
    status.textContent = 'You are not logged in.'
    btn.textContent = 'Sign in (demo)'
    notice.style.display = ''
    form.classList.remove('visible')
  }
}

function submitComment() {
  const input = document.getElementById('comment-input')
  const text  = input.value.trim()
  if (!text || !currentPostId) return

  if (!localComments[currentPostId]) localComments[currentPostId] = []
  localComments[currentPostId].push({
    author:   'Demo User',
    initials: 'DU',
    date:     new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    text
  })

  input.value = ''
  const post = posts.find(p => p.id === currentPostId)
  renderComments(post)
}

/* ═══════════════════════════════════════════════
   PROJECTS
═══════════════════════════════════════════════ */
function buildProjects() {
  const statusLabels = { active: 'Active', archived: 'Archived', wip: 'In Progress' }
  const grid = document.getElementById('projects-grid')
  grid.innerHTML = PROJECTS.map(p => `
    <div class="project-card">
      <div class="project-card-header">
        <span class="project-name">${p.name}</span>
        <span class="project-status status-${p.status}">${statusLabels[p.status]}</span>
      </div>
      <p class="project-desc">${p.desc}</p>
      <div class="project-tags">
        ${p.tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}
      </div>
      <div class="project-links">
        ${p.links.map(l => `
          <a class="project-link ${l.primary ? 'project-link-primary' : 'project-link-secondary'}"
             href="${l.url}" target="_blank" rel="noopener">
            ${l.primary ? svgExternal() : ''}${l.label}
          </a>`).join('')}
      </div>
    </div>`).join('')
}

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
function formatDate(d) {
  if (!d) return ''
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  })
}

function svgExternal() {
  return `<svg viewBox="0 0 16 16"><path d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/><path d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/></svg>`
}

/* ═══════════════════════════════════════════════
   WIRE-UP
═══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Theme
  initTheme()
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme)

  // Nav logo
  document.querySelector('.nav-logo').addEventListener('click', () => showPage('about'))

  // Tab buttons
  document.getElementById('tab-about').addEventListener('click',    () => showPage('about'))
  document.getElementById('tab-blog').addEventListener('click',     () => showPage('blog'))
  document.getElementById('tab-projects').addEventListener('click', () => showPage('projects'))

  // Blog back button
  document.getElementById('back-btn').addEventListener('click', closePost)

  // Auth
  document.getElementById('auth-toggle-btn').addEventListener('click', () => {
    isLoggedIn = !isLoggedIn
    updateAuthUI()
  })
  document.getElementById('login-notice-link').addEventListener('click', e => {
    e.preventDefault()
    isLoggedIn = true
    updateAuthUI()
  })

  // Comment submit
  document.getElementById('submit-comment-btn').addEventListener('click', submitComment)
  document.getElementById('clear-comment-btn').addEventListener('click', () => {
    document.getElementById('comment-input').value = ''
  })

  // Footer year
  document.getElementById('yr').textContent = new Date().getFullYear()

  // Load blog posts (sync via eager import.meta.glob)
  posts = loadPosts()
  buildBlog()
  buildSidebar()

  // Projects
  buildProjects()
})
