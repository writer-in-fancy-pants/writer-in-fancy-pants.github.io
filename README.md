# Personal Site

A clean personal website built with **Vite** and plain JS/CSS. Designed for GitHub Pages.

## Quick Start

```bash
npm install
npm run dev       # dev server at http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview the production build locally
```

## Project Structure

```
personal-site/
├── index.html              # Main HTML shell
├── vite.config.js          # Vite config (set base: for GitHub Pages)
├── package.json
├── blog/                   # ← ADD YOUR POSTS HERE as .md files
│   ├── my-first-post.md
│   └── another-post.md
├── src/
│   ├── main.js             # App logic + PROJECTS data
│   ├── blog.js             # Markdown loader (reads /blog/*.md at build time)
│   └── styles/
│       └── main.css        # All styles + light/dark theme variables
└── public/                 # Static assets (favicon, resume.pdf, etc.)
```

## Adding a Blog Post

Create a new `.md` file in the `blog/` directory. The filename becomes part of the post's identity.

Every file **must** start with a frontmatter block:

```markdown
---
id: my-post-slug
title: "My Post Title"
date: "2025-12-01"
topic: "Web Dev"
excerpt: "A one-sentence summary shown in the post list."
---

Your post body in **Markdown** goes here.

## A heading

Paragraph text, `inline code`, etc.

\`\`\`python
# code blocks work too
def hello(): pass
\`\`\`
```

**Frontmatter fields:**

| Field     | Required | Description                                  |
|-----------|----------|----------------------------------------------|
| `id`      | ✅       | Unique slug (used for anchors)               |
| `title`   | ✅       | Post title displayed everywhere              |
| `date`    | ✅       | ISO date `YYYY-MM-DD` (used for sorting)     |
| `topic`   | ✅       | Category shown in sidebar and tag badge      |
| `excerpt` | ✅       | Short summary shown in the post list         |

## Customising the Site

### About Me
Edit the HTML in `index.html` inside `<section id="about">`. Update your name, tagline, bio, and social links.

### Projects
Edit the `PROJECTS` array near the top of `src/main.js`.

### Theme
Dark mode is the default. Users can toggle — their preference is saved in `localStorage`. To change the default, edit the `initTheme()` function in `src/main.js`.

### GitHub Pages base path
If your site is at `https://yourusername.github.io/repo-name/`, set `base: '/repo-name/'` in `vite.config.js`. If it's at `https://yourusername.github.io/`, leave it as `'/'`.

## Deploying to GitHub Pages

### Option A — GitHub Actions (recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Option B — Manual

```bash
npm run build
# Then push the dist/ folder to the gh-pages branch
```

## Comments

The comment system is a local-state demo. For real persistent comments, replace the comment section in `index.html` with [giscus](https://giscus.app/) (uses GitHub Discussions, free, zero backend).
