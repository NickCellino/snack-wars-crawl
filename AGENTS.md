# Agent Context

## Repository Structure

This repository has a split structure:

### Reference Implementation (`src/`)
The `src/` directory contains the original **Star Wars Intro Creator** by Kassel Labs, cloned from https://github.com/KasselLabs/StarWarsIntroCreator. This is a full React application with:
- Webpack build system
- npm/node dependencies
- Complex configuration
- Material-UI components

This reference implementation is a fully-featured web app for creating custom Star Wars opening crawls.

### My Single-File Implementation
The root `index.html` file (along with `Starjedi.ttf`, `SWCrawlTitle3.ttf`, and `logo.svg`) is **my own single-file implementation**. This was added in commit `328839d` ("Got the basic part working").

This implementation:
- Is a standalone HTML file with embedded CSS and JavaScript
- Requires no build step or dependencies
- Creates a Star Wars-style opening crawl for "The Snack Wars"
- Includes starfield animation, logo animation, and scrolling text
- Has a "Click to Play" button to handle browser autoplay restrictions

## Working with This Repo

**When making changes:**
- Work on the root `index.html` file (the single-file implementation)
- The `src/` directory is the original reference and should generally not be modified
- Test the single-file implementation by opening `index.html` directly in a browser

## Testing

```bash
# Simple HTTP server for testing
python3 -m http.server 8000
# Then open http://localhost:8000
```

## Key Files

- `index.html` - Main single-file implementation (MY CODE)
- `Starjedi.ttf` - Star Wars font
- `SWCrawlTitle3.ttf` - Crawl text font
- `logo.svg` - Snack Wars logo
- `src/` - Original Kassel Labs React app (REFERENCE ONLY)
