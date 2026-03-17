/**
 * Snack Wars Opening Crawl - Main JavaScript
 * Handles play button interaction, audio playback, crawl selection, and keyboard controls
 */

(function() {
    'use strict';

    // DOM Element References
    const playButton = document.getElementById('playButton');
    const themeAudio = document.getElementById('themeAudio');
    const recordButton = document.getElementById('recordButton');
    const crawlSelect = document.getElementById('crawlSelect');
    const episodeEl = document.getElementById('episode');
    const titleEl = document.getElementById('title');
    const textEl = document.getElementById('text');
    const youtubeLinkEl = document.getElementById('youtubeLink');
    const endScreenEl = document.getElementById('endScreen');

    // Recording state
    let mediaRecorder = null;
    let recordedChunks = [];
    let isRecording = false;

    // Available crawls
    let availableCrawls = [];
    let currentCrawl = null;

    /**
     * Discover available crawl files by trying to fetch them
     */
    async function discoverCrawls() {
        const crawls = [];
        let partNum = 1;
        
        while (true) {
            const filename = `part_${partNum}.txt`;
            try {
                const response = await fetch(`opening_crawls/${filename}`, { method: 'HEAD' });
                if (response.ok) {
                    crawls.push({
                        id: filename.replace('.txt', ''),
                        label: `Part ${partNum}`,
                        path: `opening_crawls/${filename}`
                    });
                    partNum++;
                } else {
                    break;
                }
            } catch (e) {
                break;
            }
        }
        
        return crawls;
    }

    /**
     * Load crawl content from file
     * @param {string} crawlId - The crawl ID (e.g., 'part_1')
     */
    async function loadCrawl(crawlId) {
        const crawl = availableCrawls.find(c => c.id === crawlId);
        if (!crawl) return false;

        try {
            const response = await fetch(crawl.path);
            if (!response.ok) return false;
            
            const text = await response.text();
            const lines = text.trim().split('\n').filter(line => line.trim() !== '');
            
            if (lines.length < 4) {
                console.error('Crawl file must have at least 4 lines: YouTube URL, episode, title, and content');
                return false;
            }

            // Parse: line 1 = YouTube URL, line 2 = episode, line 3 = title, rest = body paragraphs
            const youtubeUrl = lines[0];
            episodeEl.textContent = lines[1];
            titleEl.textContent = lines[2];
            
            // Build paragraphs from remaining lines
            const paragraphs = lines.slice(3);
            textEl.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
            
            // Update YouTube links
            updateYoutubeLinks(youtubeUrl, lines[1], lines[2]);
            
            currentCrawl = crawlId;
            return true;
        } catch (error) {
            console.error('Failed to load crawl:', error);
            return false;
        }
    }

    /**
     * Update YouTube link elements with the provided URL and metadata
     * @param {string} url - YouTube video URL
     * @param {string} episode - Episode text (e.g., "PART I")
     * @param {string} title - Title text (e.g., "THE SNACK WARS")
     */
    function updateYoutubeLinks(url, episode, title) {
        // Update the bottom right YouTube link
        if (youtubeLinkEl) {
            const link = youtubeLinkEl.querySelector('a');
            if (link) {
                link.href = url;
                const span = link.querySelector('span');
                if (span) {
                    span.textContent = `Watch "${episode.replace('PART', 'Part')}, ${title}"`;
                }
            }
        }

        // Update the end screen YouTube link
        if (endScreenEl) {
            const link = endScreenEl.querySelector('a');
            if (link) {
                link.href = url;
                const subtext = link.querySelector('.endScreenSubtext');
                if (subtext) {
                    subtext.textContent = `"${episode.replace('PART', 'Part')}, ${title}"`;
                }
            }
        }
    }

    /**
     * Populate the crawl selector dropdown
     */
    function populateSelector() {
        crawlSelect.innerHTML = '';
        availableCrawls.forEach(crawl => {
            const option = document.createElement('option');
            option.value = crawl.id;
            option.textContent = crawl.label;
            crawlSelect.appendChild(option);
        });
    }

    /**
     * Handle crawl selection change
     */
    function handleCrawlChange() {
        const selectedCrawl = crawlSelect.value;
        loadCrawl(selectedCrawl);
        updateUrl(selectedCrawl);
    }

    /**
     * Update URL without reloading page
     * @param {string} crawlId
     */
    function updateUrl(crawlId) {
        const url = new URL(window.location.href);
        url.searchParams.set('crawl', crawlId);
        window.history.replaceState({}, '', url);
    }

    /**
     * Get crawl from URL parameter
     */
    function getCrawlFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('crawl');
    }

    /**
     * Initialize the crawl system
     */
    async function initCrawls() {
        availableCrawls = await discoverCrawls();
        
        if (availableCrawls.length === 0) {
            console.error('No crawl files found in opening_crawls/');
            return;
        }

        populateSelector();

        // Check URL parameter first
        const urlCrawl = getCrawlFromUrl();
        const initialCrawl = urlCrawl && availableCrawls.find(c => c.id === urlCrawl) 
            ? urlCrawl 
            : availableCrawls[0].id;

        crawlSelect.value = initialCrawl;
        await loadCrawl(initialCrawl);
    }

    /**
     * Start the animation and audio playback
     */
    function startPlayback() {
        document.body.classList.add('playing');
        themeAudio.currentTime = 0;
        themeAudio.play().catch(function(error) {
            console.log('Audio playback failed:', error);
        });
    }

    /**
     * Stop the animation and reset audio
     */
    function stopPlayback() {
        document.body.classList.remove('playing');
        themeAudio.pause();
        themeAudio.currentTime = 0;
    }

    /**
     * Handle keyboard controls
     * @param {KeyboardEvent} e
     */
    function handleKeyboard(e) {
        if (e.key === 'Escape') {
            stopPlayback();
        } else if (e.key === ' ') {
            // Toggle UI visibility for clean recording
            e.preventDefault();
            document.body.classList.toggle('hide-ui');
        }
    }

    /**
     * Start screen recording with audio
     */
    async function startRecording() {
        try {
            // Hide the record button so it doesn't appear in recording
            recordButton.classList.add('hidden');
            
            // Wait a moment for the button to hide
            await new Promise(resolve => setTimeout(resolve, 100));

            // Capture the current tab with audio (no microphone needed)
            const displayStream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    mediaSource: 'screen',
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    displaySurface: 'browser',
                    logicalSurface: false,
                    cursor: 'never'
                },
                audio: true,
                preferCurrentTab: true
            });

            // Use the display stream directly (includes tab audio, no microphone)
            const combinedStream = displayStream;

            // Show recording indicator (button reappears with recording state)
            recordButton.classList.remove('hidden');
            recordButton.classList.add('recording');
            recordButton.textContent = 'Stop Recording';

            // Create media recorder with WebM format (most universal)
            mediaRecorder = new MediaRecorder(combinedStream, {
                mimeType: 'video/webm;codecs=vp9,opus'
            });

            recordedChunks = [];

            mediaRecorder.ondataavailable = function(e) {
                if (e.data.size > 0) {
                    recordedChunks.push(e.data);
                }
            };

            mediaRecorder.onstop = function() {
                // Create blob and download
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'snack-wars-crawl-' + new Date().toISOString().replace(/[:.]/g, '-') + '.webm';
                document.body.appendChild(a);
                a.click();
                
                // Cleanup
                setTimeout(function() {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 100);

                // Reset button state
                isRecording = false;
                recordButton.classList.remove('recording');
                recordButton.textContent = 'Record';

                // Stop all tracks
                displayStream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            isRecording = true;

            // Handle user stopping screen share via browser UI
            displayStream.getVideoTracks()[0].onended = function() {
                stopRecording();
            };

        } catch (err) {
            console.error('Recording failed:', err);
            recordButton.classList.remove('hidden', 'recording');
            recordButton.textContent = 'Record';
            isRecording = false;
            alert('Recording failed. Please allow screen sharing permissions.');
        }
    }

    /**
     * Stop the recording
     */
    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
    }

    /**
     * Toggle recording state
     */
    function toggleRecording() {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    }

    // Event Listeners
    if (playButton) {
        playButton.addEventListener('click', startPlayback);
    }

    if (recordButton) {
        recordButton.addEventListener('click', toggleRecording);
    }

    if (crawlSelect) {
        crawlSelect.addEventListener('change', handleCrawlChange);
    }

    document.addEventListener('keydown', handleKeyboard);

    // Initialize crawls on page load
    initCrawls();

})();
