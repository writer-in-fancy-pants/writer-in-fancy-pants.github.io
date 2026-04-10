import { defineConfig } from 'vite'

export default defineConfig({
  // Set this to your GitHub Pages repo name if deploying to
  // https://yourusername.github.io/repo-name/
  // Leave as '/' if deploying to https://yourusername.github.io/
  base: 'https://writer-in-fancy-pants.github.io/',

  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  }
})
