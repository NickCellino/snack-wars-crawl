# Star Wars Opening Crawl: A Code Walkthrough

*2026-03-16T03:45:36Z by Showboat 0.6.1*
<!-- showboat-id: f742cf53-d1a2-4f25-8682-b56f59e5b5f2 -->

This document provides a linear walkthrough of the Star Wars Opening Crawl implementation in index.html. This is a single-file implementation that recreates the iconic Star Wars intro sequence with pure HTML, CSS, and minimal JavaScript.



## Part 1: Animation Timing System

The entire animation sequence is orchestrated through CSS custom properties (variables) defined in the :root selector. This allows precise control over timing without modifying multiple animation declarations.

Key insight: The --time-factor variable scales the crawl speed while keeping the logo animation at its original speed (matching the iconic timing from the films).

```bash
cat index.html | sed -n '10,48p'
```

```output
    <style>
        /* 
         * ANIMATION SPEED CONTROL
         * 
         * --time-factor: Controls the crawling text scroll speed
         *   - 1.0 = normal speed (default)
         *   - 0.7 = 30% faster (current setting)
         *   - 0.5 = 2x faster
         *   - 2.0 = 2x slower
         * 
         * Logo animation always stays at original speed (11s)
         * Only the text crawl is affected by this factor.
         */
        :root {
            --time-factor: 1.5;

            /* use this for testing */
            /* --time-factor: 0.2; */
            
            /* Logo timings - always original speed */
            --logo-duration: 11s;
            --logo-delay: 9s;
            
            /* Intro text - original speed */
            --intro-duration: 6s;
            --intro-delay: 1s;
            
            /* Crawl timings - affected by time factor */
            --crawl-duration: calc(73s * var(--time-factor));
            --crawl-delay: 16.5s;
            
            /* Ending - affected by time factor */
            --ending-duration: calc(7s * var(--time-factor));
            --ending-delay: calc(86s * var(--time-factor));
            
            /* End screen fade-in - starts 5s before crawl ends */
            --end-screen-delay: calc(var(--crawl-delay) + var(--crawl-duration) - (28.5s * var(--time-factor)));
        }

```



## Part 2: The Four-Phase Animation Sequence

The animation proceeds through four distinct phases, each triggered by adding the .playing class to the body element. Let us examine each phase:

### Phase 1: "A Long Time Ago..." (0s - 9s)

The first phase displays the iconic cyan text on a black background. This uses two overlapping animations:

```bash
echo '=== Intro Phase CSS ===' && cat index.html | sed -n '138,168p'
```

```output
=== Intro Phase CSS ===
        /* Intro Text */
        .introBackground {
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100vw;
            height: 100vh;
            background-color: black;
            opacity: 0;
        }

        body.playing .introBackground {
            animation: introBackgroundAnimation 9s;
        }

        .intro {
            padding-right: 5%;
            padding-left: 5%;
            color: #4bd5ee;
            font-weight: 400;
            font-size: 4.5vw;
            opacity: 0;
            transform: scaleX(1.1);
        }

        body.playing .intro {
            animation: introTextAnimation var(--intro-duration) ease-out var(--intro-delay);
        }
```

```bash
echo '=== Intro Phase Keyframes ===' && cat index.html | sed -n '399,410p'
```

```output
=== Intro Phase Keyframes ===
        /* Animations */
        @keyframes introTextAnimation {
            0% { opacity: 0; }
            20% { opacity: 1; }
            90% { opacity: 1; }
            100% { opacity: 0; }
        }

        @keyframes introBackgroundAnimation {
            0% { opacity: 1; }
            100% { opacity: 1; }
        }
```



**Animation Analysis:**
- introBackgroundAnimation: Simply keeps the black background visible for 9s (0% to 100% opacity: 1)
- introTextAnimation: Fade in at 0%, fully visible at 20%, fade out at 90%, gone at 100%
- The 1s delay (--intro-delay) lets the Star Wars theme music establish itself first



### Phase 2: The Logo Zoom (9s - 20s)

This is the most iconic animation. The logo starts massive, shrinks toward the viewer, and disappears into infinity. The cubic-bezier timing function creates the characteristic acceleration.

```bash
echo '=== Logo CSS ===' && cat index.html | sed -n '170,221p'
```

```output
=== Logo CSS ===
        /* Logo */
        #logo {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            font-family: StarWars, sans-serif;
            opacity: 0;
            width: 100vw;
        }

        body.playing #logo {
            animation: logoAnimation var(--logo-duration) cubic-bezier(.11, .6, .48, .88) var(--logo-delay);
        }

        .logoSub {
            width: 100%;
        }

        #logoDefault {
            width: 100%;
            max-width: 800px;
            height: auto;
            display: none;
            margin: 0 auto;
        }

        .logoText {
            display: flex;
            flex-direction: column;
            align-items: center;
            color: black;
            text-shadow:
                -2px -2px 0 #ffd54e,
                2px -2px 0 #ffd54e,
                -2px 2px 0 #ffd54e,
                2px 2px 0 #ffd54e,
                -3px 0 0 #ffd54e,
                3px 0 0 #ffd54e,
                0 -3px 0 #ffd54e,
                0 3px 0 #ffd54e;
            letter-spacing: .18em;
            font-size: 200px;
            line-height: 1em;
            font-family: StarWars, sans-serif;
        }

        .logoText div {
            white-space: nowrap;
        }

```

```bash
echo '=== Logo Keyframes ===' && cat index.html | sed -n '412,422p'
```

```output
=== Logo Keyframes ===
        @keyframes logoAnimation {
            0% {
                transform: translate(-50%, -50%) scale(2.2);
                opacity: 1;
            }
            95% { opacity: 1; }
            100% {
                transform: translate(-50%, -50%) scale(0.01);
                opacity: 0;
            }
        }
```



**Animation Analysis:**
- Starts at scale(2.2) - 220% of normal size
- Ends at scale(0.01) - 1% of normal size (effectively vanishing)
- Cubic-bezier(.11, .6, .48, .88) creates a slow start, accelerates in the middle, then eases out
- Opacity stays at 1 until 95%, then fades quickly to 0
- The translate(-50%, -50%) keeps the logo centered throughout

The text-shadow effect creates the iconic yellow outline around black text - using multiple shadows for a thicker border effect.



### Phase 3: The Opening Crawl (16.5s - 89.5s with 1.5x factor)

This is the 3D perspective scroll that defines Star Wars. The text tilts backward using perspective and rotateX, then scrolls upward.

```bash
echo '=== Crawl Container CSS ===' && cat index.html | sed -n '222,253p'
```

```output
=== Crawl Container CSS ===
        /* Titles/Crawl */
        #titles {
            position: absolute;
            top: auto;
            bottom: 0;
            left: 50%;
            overflow: hidden;
            margin: 0 0 0 -7.325em;
            width: 14.65em;
            height: 50em;
            text-align: justify;
            word-wrap: break-word;
            font-size: 350%;
            transform-origin: 50% 100%;
            transform: perspective(300px) rotateX(25deg);
        }

        #titles > div {
            position: absolute;
            top: 100%;
            width: 100%;
        }

        body.playing #titles > div {
            animation: titlesAnimation var(--crawl-duration) linear var(--crawl-delay) forwards;
        }

        #titles > div > p {
            margin: 1.35em 0 1.85em 0;
            line-height: 1.35em;
            backface-visibility: hidden;
        }
```

```bash
echo '=== Crawl Keyframes ===' && cat index.html | sed -n '424,433p'
```

```output
=== Crawl Keyframes ===
        @keyframes titlesAnimation {
            0% {
                top: 100%;
                opacity: 1;
            }
            100% {
                top: -200%;
                opacity: 1;
            }
        }
```



**Animation Analysis:**
- The container uses perspective(300px) rotateX(25deg) to create the 3D tilt
- transform-origin: 50% 100% sets the pivot at the bottom center
- The inner div starts at top: 100% (below the container) and scrolls to top: -200%
- Linear timing ensures constant scrolling speed
- Duration is 73s * time-factor (currently 1.5 = 109.5s)
- Delay of 16.5s lets the logo animation finish first
- backface-visibility: hidden prevents text rendering issues during the 3D transform

The crawl text content itself is structured with an episode title and story paragraphs:

```bash
echo '=== Crawl Content HTML ===' && cat index.html | sed -n '500,512p'
```

```output
=== Crawl Content HTML ===
            <div id="titles">
                <div>
                    <p id="episode" class="tcenter">PART I</p>
                    <p id="title" class="tcenter">THE SNACK WARS</p>
                    <div id="text">
                        <p>Turmoil has engulfed the Snack Kingdoms. The Goldfish King has declared war on the Pretzel King, gathering his knights, the fearsome Reese's Pumpkins.</p>
                        <p>The Pretzel King, ruler of the Cookie armies, has assembled his warriors for battle. Two mighty monarchs prepare for sweet and savory combat.</p>
                        <p>As the first skirmish rages, the Cookies defeat the Pumpkins in the grinder of defeat. The Goldfish King retreats to his castle, only to be driven out by the Cookie forces.</p>
                        <p>Both kings have lost their palaces and must seek new warriors to continue the conflict. The Goldfish King finds an ally in the mysterious tape, while the Pretzel King takes refuge in the toy toilet.</p>
                        <p>Who will find their warriors first? And who will win the war?</p>
                    </div>
                </div>
            </div>
```



### Phase 4: Background Star Scroll & End Screen

After the crawl completes, two things happen simultaneously:
1. The background stars scroll upward to simulate moving through space
2. The end screen fades in with a call-to-action

```bash
echo '=== Background Star Scroll ===' && cat index.html | sed -n '287,298p'
```

```output
=== Background Star Scroll ===
        #backgroundSpace {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4100px;
            background: url('https://kassellabs.us-east-1.linodeobjects.com/static-assets/star-wars/bg-stars.png') repeat;
        }

        body.playing #backgroundSpace {
            animation: scrolldown var(--ending-duration) var(--ending-delay) forwards;
        }
```

```bash
echo '=== Star Scroll Keyframes ===' && cat index.html | sed -n '435,438p'
```

```output
=== Star Scroll Keyframes ===
        @keyframes scrolldown {
            0% { transform: translateY(0); }
            100% { transform: translateY(-2200px); }
        }
```

```bash
echo '=== End Screen CSS ===' && cat index.html | sed -n '338,397p'
```

```output
=== End Screen CSS ===
        /* End Screen */
        #endScreen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 60;
            opacity: 0;
            pointer-events: none;
        }

        body.playing #endScreen {
            animation: fadeInScreen 2s ease var(--end-screen-delay) forwards;
        }

        #endScreen a {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            color: #ff0000;
            text-decoration: none;
            background: rgba(0, 0, 0, 0.9);
            padding: 60px 80px;
            border-radius: 20px;
            border: 4px solid #ff0000;
            transition: all 0.3s ease;
        }

        #endScreen a:hover {
            background: #ff0000;
            color: white;
            transform: scale(1.05);
        }

        .endScreenText {
            font-size: 48px;
            font-weight: bold;
            font-family: 'News Cycle', sans-serif;
        }

        .endScreenSubtext {
            font-size: 36px;
            font-family: 'News Cycle', sans-serif;
        }

        #endScreen svg {
            width: 80px;
            height: 80px;
            margin-top: 20px;
        }

        @keyframes fadeInScreen {
            0% { opacity: 0; pointer-events: none; }
            100% { opacity: 1; pointer-events: auto; }
        }
```



**Animation Analysis:**
- Background scroll starts at delay of 86s * time-factor (129s at 1.5x)
- Moves the 4100px tall starfield up by 2200px over 7s * time-factor
- End screen fadeInScreen uses pointer-events to enable/disable clicking
- Starts 28.5s before the crawl ends (calculated in --end-screen-delay)

Notice how --end-screen-delay is calculated using other variables:
`calc(var(--crawl-delay) + var(--crawl-duration) - (28.5s * var(--time-factor)))`

This maintains proper timing even when adjusting the time factor.



## Part 3: JavaScript Interaction Layer

The JavaScript is intentionally minimal - just 20 lines. Its responsibilities:
1. Handle the play button click to start the animation
2. Allow restarting via Escape or Space keys

The design philosophy: All animation logic belongs in CSS. JavaScript only toggles the .playing class.

```bash
echo '=== JavaScript ===' && cat index.html | sed -n '543,562p'
```

```output
=== JavaScript ===
    <script>
        document.getElementById('playButton').addEventListener('click', function() {
            document.body.classList.add('playing');
            const audio = document.getElementById('themeAudio');
            audio.currentTime = 0;
            audio.play().catch(function(error) {
                console.log('Audio playback failed:', error);
            });
        });

        // Allow restarting by clicking during playback
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' || e.key === ' ') {
                document.body.classList.remove('playing');
                const audio = document.getElementById('themeAudio');
                audio.pause();
                audio.currentTime = 0;
            }
        });
    </script>
```



## Part 4: Architecture Insights

### The .playing Class Pattern

All animations are gated by `body.playing` selectors. This single class acts as a master switch:
- Without .playing: All animation containers are hidden, only the play button shows
- With .playing: All CSS animations begin according to their delays

This is more elegant than managing animation states in JavaScript.

### Audio Synchronization

The Star Wars theme audio is exactly 109 seconds. The CSS timing is designed to match:
- Logo zoom finishes as the main theme swells
- Crawl text appears on the iconic trumpet fanfare
- End screen appears as the music concludes

The current --time-factor of 1.5 slows the crawl to match the shorter audio file used.

### 3D Perspective Technique

The crawl effect uses CSS 3D transforms, not canvas or WebGL:
- perspective(300px) on the container establishes the 3D context
- rotateX(25deg) tilts the text backward into the distance
- The scroll animation moves the content upward through this tilted plane
- This creates the illusion of text receding into infinity



### Responsive Design

The implementation includes mobile breakpoints at 500px:
- Font sizes scale down (200px → 100px for logo)
- Crawl font-size reduces from 350% to 180%
- Button padding and sizes adjust for touch targets
- YouTube link repositioned to avoid overlap

### No Build Step Required

Unlike the reference implementation in src/ (a full React/Webpack app), this single-file version:
- Loads only two custom fonts (Starjedi.ttf and SWCrawlTitle3.ttf)
- Uses a CDN-hosted starfield background
- Streams audio from external hosting
- Can be opened directly in any browser without compilation



## Summary: Complete Timing Diagram

| Time | Event | Duration |
|------|-------|----------|
| 0s | User clicks Play button | - |
| 0s | "A long time ago..." fades in | 6s (1s delay) |
| 9s | Logo appears at 220% size | 11s |
| 16.5s | Crawl text begins (logo still visible) | 109.5s (73s × 1.5) |
| 20s | Logo vanishes (scale 0.01) | - |
| 97.5s | End screen begins fade-in | 2s |
| 126s | Background stars scroll | 10.5s |

**Total runtime: ~136 seconds**

The beauty of this implementation is its declarative nature. By using CSS variables for timing and the .playing class as a trigger, the entire complex sequence is described purely in CSS. The JavaScript merely initiates the process and handles user interrupts.
