/**
 * Snack Wars Opening Crawl - Main JavaScript
 * Handles play button interaction, audio playback, and keyboard controls
 */

(function() {
    'use strict';

    // DOM Element References
    const playButton = document.getElementById('playButton');
    const themeAudio = document.getElementById('themeAudio');
    const recordButton = document.getElementById('recordButton');

    // Recording state
    let mediaRecorder = null;
    let recordedChunks = [];
    let isRecording = false;

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

    document.addEventListener('keydown', handleKeyboard);

})();
