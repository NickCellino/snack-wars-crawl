# Snack Wars Opening Crawl

A Star Wars-style opening crawl for "The Snack Wars" with a simple "Click to Play" interface.

## Features

- Black screen with starfield background
- Centered "Click to Play" button
- Full Star Wars opening crawl animation with:
  - "A long time ago..." intro
  - Star Wars logo animation
  - Scrolling crawl text
  - Death Star appearance
  - Theme music
- YouTube link to "The Snack Wars, Part 1!" appears during playback
- Press ESC or Space to restart

## Local Testing

Since this is a static HTML file, you can test it locally using any of these methods:

### Option 1: Direct File Open
Simply open `index.html` in your web browser by double-clicking the file.

### Option 2: Python HTTP Server
```bash
cd crawl
python3 -m http.server 8000
# Then open http://localhost:8000 in your browser
```

### Option 3: Node.js HTTP Server
```bash
cd crawl
npx http-server -p 8000
# Then open http://localhost:8000 in your browser
```

### Option 4: VS Code Live Server
Install the "Live Server" extension in VS Code, right-click on `index.html`, and select "Open with Live Server".

**Note:** Modern browsers require user interaction to autoplay audio, so make sure to click the "Click to Play" button to hear the theme music.

## Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions. Just push to the `main` or `master` branch and it will deploy automatically.

### Setup Instructions

1. Push this code to a GitHub repository
2. Go to Settings → Pages in your GitHub repository
3. Under "Build and deployment", select:
   - Source: GitHub Actions
4. The workflow will run automatically on your next push, or you can trigger it manually from the Actions tab

### Manual Deployment

If you prefer to deploy manually, simply copy the `crawl/index.html` file to any static web hosting service (GitHub Pages, Netlify, Vercel, etc.).

## Customization

### Change the Crawl Text
Edit the content inside the `#text` div in `crawl/index.html`.

### Change the Logo Text
Modify the `.logoText` div in `crawl/index.html`.

### Change Animation Speed
To make the crawl faster or slower, edit the CSS custom property at the top of `index.html`:

```css
:root {
    --time-factor: 0.7;  /* Change this value */
}
```

- `1.0` = normal speed
- `0.7` = 30% faster (current setting)
- `0.5` = 2x faster
- `2.0` = 2x slower

All animation timings (intro, logo, crawl, ending) will scale automatically based on this value.

## Credits

Based on the Star Wars Intro Creator by Kassel Labs (https://github.com/KasselLabs/StarWarsIntroCreator)

Theme music and assets used under fair use for educational/parody purposes.