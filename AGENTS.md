# Agent Context

## Repository Structure

This repository contains a standalone, no-build Star Wars-style opening crawl for "The Snack Wars".

### Overview

This is a **zero-dependency implementation** that requires no build step or package manager. Just open `index.html` in a browser and it works.

### File Organization

```
.
├── index.html              # Main HTML file
├── AGENTS.md              # This file
├── logo.svg               # Snack Wars logo
├── Starjedi.ttf           # Star Wars font
├── SWCrawlTitle3.ttf      # Crawl text font
├── styles/
│   ├── variables.css      # Animation timing variables (edit to change speed)
│   ├── animations.css     # Keyframe animations
│   └── main.css          # Layout and styling
└── js/
    └── main.js           # Play button and keyboard controls
```

### Key Features

- **Standalone HTML**: Open directly in any modern browser
- **Modular CSS**: Animation timing, keyframes, and layout are separated
- **Easy customization**: Edit `styles/variables.css` to change animation speed
- **Keyboard controls**: Press Escape or Space to restart
- **Audio included**: Star Wars theme music (loaded from CDN)

### Working with This Repo

**To modify animation timing:**
Edit `styles/variables.css` - the `--time-factor` variable controls crawl speed

**To modify styling:**
Edit `styles/main.css` for layout and appearance

**To modify animations:**
Edit `styles/animations.css` for keyframe animations

**To modify interactions:**
Edit `js/main.js` for JavaScript behavior

### Testing

```bash
# Simple HTTP server for testing
python3 -m http.server 8000
# Then open http://localhost:8000
```

Or simply open `index.html` directly in your browser.

### No Build Required

This implementation intentionally avoids:
- npm/node dependencies
- Build tools or bundlers
- Transpilation steps
- External frameworks

Just pure HTML, CSS, and JavaScript that works in any modern browser.
