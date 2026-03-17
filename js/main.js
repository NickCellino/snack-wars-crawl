/**
 * Snack Wars Opening Crawl - Main JavaScript
 * Handles play button interaction, audio playback, and keyboard controls
 */

(function() {
    'use strict';

    // DOM Element References
    const playButton = document.getElementById('playButton');
    const themeAudio = document.getElementById('themeAudio');

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
        if (e.key === 'Escape' || e.key === ' ') {
            stopPlayback();
        }
    }

    // Event Listeners
    if (playButton) {
        playButton.addEventListener('click', startPlayback);
    }

    document.addEventListener('keydown', handleKeyboard);

})();
