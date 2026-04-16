// src/music.js
// ─────────────────────────────────────────────────────────────
// Music tab: static track data + render helpers.
// To add a track: push an entry to MUSIC_TRACKS below.
// ─────────────────────────────────────────────────────────────

export const MUSIC_TRACKS = [
  {
    id: 'dnb-mix-dnb2b',
    title: 'Drum & Bass Mix',
    artist: 'dnb2b (octobass × tipsysound)',
    type: 'youtube',
    // YouTube video ID
    src: 'IegjEa8tDzQ',
    genre: 'Drum & Bass',
    year: '',
    description: 'A collaborative DnB mix — two artists, one vibe.',
  },
  {
    id: 'garage-housewarming',
    title: 'Live — Garage @ Housewarming',
    artist: 'octobass',
    type: 'youtube',
    src: 'bPC0C3GNils',
    genre: 'UK Garage',
    year: '',
    description: 'Live garage set recorded at a housewarming party.',
  },
  {
    id: 'house-last-resort',
    title: 'Live — House @ 라스트리조트 (Last Resort)',
    artist: 'octobass × House of Beats',
    type: 'youtube',
    src: 'rS9RvUlasAM',
    genre: 'House',
    year: '',
    description: 'Live house set at Last Resort, Seoul, with House of Beats.',
  },
  {
    id: 'afro-house-basement',
    title: 'Live — Afro House @ Basement Club',
    artist: 'octobass',
    type: 'youtube',
    src: 'vi0BHt_TLuI',
    genre: 'Afro House',
    year: '',
    description: 'Live afro-house set at Basement Club (now DnB Seoul).',
  },
  {
    id: 'sc-originals',
    title: 'Original Tracks',
    artist: 'octobass',
    type: 'soundcloud',
    // Full SoundCloud profile URL for the widget
    src: 'https://soundcloud.com/djoctobass',
    genre: 'Various',
    year: '',
    description: 'Original productions — browse the full SoundCloud profile.',
  },
];

// ── Likes (localStorage, keyed by track id) ─────────────────
function getLikes(id) {
  return parseInt(localStorage.getItem(`music-likes-${id}`) || '0', 10);
}
function toggleLike(id) {
  const liked = localStorage.getItem(`music-liked-${id}`) === '1';
  const count = getLikes(id);
  if (liked) {
    localStorage.setItem(`music-liked-${id}`, '0');
    localStorage.setItem(`music-likes-${id}`, String(Math.max(0, count - 1)));
  } else {
    localStorage.setItem(`music-liked-${id}`, '1');
    localStorage.setItem(`music-likes-${id}`, String(count + 1));
  }
  return { liked: !liked, count: getLikes(id) };
}
function isLiked(id) {
  return localStorage.getItem(`music-liked-${id}`) === '1';
}

// ── Share helper ─────────────────────────────────────────────
function shareTrack(id, title) {
  const url = `${location.origin}${location.pathname}#music/${id}`;
  if (navigator.share) {
    navigator.share({ title, url }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url).then(() => showToast('Link copied!'));
  }
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

// ── Embed builders ───────────────────────────────────────────
function youtubeEmbed(videoId) {
  return `<div class="embed-wrap yt-embed">
    <iframe
      src="https://www.youtube-nocookie.com/embed/${videoId}"
      title="YouTube video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      loading="lazy"
    ></iframe>
  </div>`;
}

function soundcloudEmbed(profileUrl) {
  const encoded = encodeURIComponent(profileUrl);
  return `<div class="embed-wrap sc-embed">
    <iframe
      src="https://w.soundcloud.com/player/?url=${encoded}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=true&visual=true"
      scrolling="no"
      allow="autoplay"
      loading="lazy"
    ></iframe>
  </div>`;
}

// ── Card renderer ─────────────────────────────────────────────
function buildCard(track) {
  const liked    = isLiked(track.id);
  const likes    = getLikes(track.id);
  const embed    = track.type === 'youtube'
    ? youtubeEmbed(track.src)
    : soundcloudEmbed(track.src);

  const card = document.createElement('article');
  card.className = 'music-card';
  card.dataset.id = track.id;

  card.innerHTML = `
    ${embed}
    <div class="music-card-body">
      <div class="music-card-meta">
        <span class="music-genre-tag">${track.genre}</span>
        ${track.year ? `<span class="music-year">${track.year}</span>` : ''}
      </div>
      <h3 class="music-card-title">${track.title}</h3>
      <p class="music-card-artist">${track.artist}</p>
      ${track.description ? `<p class="music-card-desc">${track.description}</p>` : ''}
      <div class="music-card-actions">
        <button class="action-btn like-btn ${liked ? 'liked' : ''}"
                data-id="${track.id}" aria-label="Like">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          <span class="like-count">${likes}</span>
        </button>
        <button class="action-btn share-btn" data-id="${track.id}"
                data-title="${track.title}" aria-label="Share">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>
          Share
        </button>
      </div>
    </div>
  `;

  // Wire up like button
  card.querySelector('.like-btn').addEventListener('click', (e) => {
    const btn = e.currentTarget;
    const result = toggleLike(track.id);
    btn.classList.toggle('liked', result.liked);
    btn.querySelector('.like-count').textContent = result.count;
  });

  // Wire up share button
  card.querySelector('.share-btn').addEventListener('click', (e) => {
    shareTrack(e.currentTarget.dataset.id, e.currentTarget.dataset.title);
  });

  return card;
}

// ── Public init ───────────────────────────────────────────────
export function initMusic() {
  const grid = document.getElementById('music-grid');
  if (!grid) return;
  grid.innerHTML = '';
  MUSIC_TRACKS.forEach(t => grid.appendChild(buildCard(t)));
}
