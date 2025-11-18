/**
 * Lofi Music Player
 * Integrates YouTube lofi streams with custom controls
 */

class MusicPlayer {
    constructor() {
        this.player = null;
        this.isExpanded = false;
        this.currentVolume = 30;
        this.isPlaying = false;
        this.currentVideoId = 'jfKfPfyJRdk'; // Default: Lofi Girl - Beats to Relax/Study

        this.initializeElements();
        this.bindEvents();
        this.loadPlayerState();
    }

    /**
     * Initialize DOM element references
     */
    initializeElements() {
        this.musicPlayer = document.getElementById('music-player');
        this.toggleBtn = document.getElementById('music-toggle-btn');
        this.playerContent = document.getElementById('music-player-content');
        this.playerFrame = document.getElementById('music-player-frame');
        this.channelSelect = document.getElementById('music-channel-select');
        this.playBtn = document.getElementById('music-play-btn');
        this.pauseBtn = document.getElementById('music-pause-btn');
        this.volumeSlider = document.getElementById('music-volume-slider');
        this.volumeLabel = document.getElementById('music-volume-label');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Toggle player visibility
        this.toggleBtn?.addEventListener('click', () => this.togglePlayer());

        // Channel selection
        this.channelSelect?.addEventListener('change', (e) => {
            this.changeChannel(e.target.value);
        });

        // Play/pause controls
        this.playBtn?.addEventListener('click', () => this.play());
        this.pauseBtn?.addEventListener('click', () => this.pause());

        // Volume control
        this.volumeSlider?.addEventListener('input', (e) => {
            this.setVolume(parseInt(e.target.value));
        });

        // Close player when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isExpanded &&
                this.musicPlayer &&
                !this.musicPlayer.contains(e.target)) {
                // Don't close if clicking on the player itself
                if (e.target !== this.toggleBtn && !this.toggleBtn?.contains(e.target)) {
                    // Optional: uncomment to close on outside click
                    // this.togglePlayer();
                }
            }
        });
    }

    /**
     * Initialize YouTube player (called by YouTube API)
     */
    initializePlayer() {
        console.log('🎵 Initializing YouTube player...');

        if (!this.playerFrame) {
            console.error('❌ Player frame not found');
            return;
        }

        // Create YouTube player
        this.player = new YT.Player(this.playerFrame, {
            height: '100%',
            width: '100%',
            videoId: this.currentVideoId,
            playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                fs: 0,
                iv_load_policy: 3,
                modestbranding: 1,
                rel: 0,
                showinfo: 0
            },
            events: {
                'onReady': (event) => this.onPlayerReady(event),
                'onStateChange': (event) => this.onPlayerStateChange(event),
                'onError': (event) => this.onPlayerError(event)
            }
        });
    }

    /**
     * Player ready callback
     */
    onPlayerReady(event) {
        console.log('✅ YouTube player ready');

        // Set initial volume
        if (this.player && this.player.setVolume) {
            this.player.setVolume(this.currentVolume);
        }

        // Auto-play if was playing before
        if (this.isPlaying) {
            this.play();
        }
    }

    /**
     * Player state change callback
     */
    onPlayerStateChange(event) {
        // Update playing state
        const isNowPlaying = event.data === YT.PlayerState.PLAYING;

        if (isNowPlaying !== this.isPlaying) {
            this.isPlaying = isNowPlaying;
            this.updatePlayPauseButtons();
            this.savePlayerState();
        }

        // Log state for debugging
        const states = {
            '-1': 'Unstarted',
            '0': 'Ended',
            '1': 'Playing',
            '2': 'Paused',
            '3': 'Buffering',
            '5': 'Cued'
        };
        console.log('🎵 Player state:', states[event.data] || event.data);
    }

    /**
     * Player error callback
     */
    onPlayerError(event) {
        console.error('❌ YouTube player error:', event.data);

        const errors = {
            2: 'Invalid video ID',
            5: 'HTML5 player error',
            100: 'Video not found or private',
            101: 'Video not allowed to be played in embedded players',
            150: 'Video not allowed to be played in embedded players'
        };

        const errorMsg = errors[event.data] || 'Unknown error';
        console.error('Error details:', errorMsg);
    }

    /**
     * Toggle player expanded/collapsed
     */
    togglePlayer() {
        this.isExpanded = !this.isExpanded;

        if (this.playerContent) {
            if (this.isExpanded) {
                this.playerContent.classList.remove('hidden');

                // Initialize player if not already done
                if (!this.player && window.YT && window.YT.Player) {
                    this.initializePlayer();
                }
            } else {
                this.playerContent.classList.add('hidden');
            }
        }

        this.savePlayerState();
    }

    /**
     * Change music channel
     */
    changeChannel(videoId) {
        if (!videoId || videoId === this.currentVideoId) return;

        console.log('🎵 Changing channel to:', videoId);
        this.currentVideoId = videoId;

        // Load new video
        if (this.player && this.player.loadVideoById) {
            this.player.loadVideoById(videoId);

            // Auto-play if was playing
            if (this.isPlaying) {
                setTimeout(() => {
                    if (this.player && this.player.playVideo) {
                        this.player.playVideo();
                    }
                }, 500);
            }
        }

        this.savePlayerState();
    }

    /**
     * Play music
     */
    play() {
        if (!this.player || !this.player.playVideo) {
            console.warn('⚠️ Player not ready yet');
            return;
        }

        console.log('▶️ Playing music');
        this.player.playVideo();
        this.isPlaying = true;
        this.updatePlayPauseButtons();
        this.savePlayerState();
    }

    /**
     * Pause music
     */
    pause() {
        if (!this.player || !this.player.pauseVideo) {
            console.warn('⚠️ Player not ready yet');
            return;
        }

        console.log('⏸️ Pausing music');
        this.player.pauseVideo();
        this.isPlaying = false;
        this.updatePlayPauseButtons();
        this.savePlayerState();
    }

    /**
     * Set volume
     */
    setVolume(volume) {
        this.currentVolume = Math.max(0, Math.min(100, volume));

        // Update label
        if (this.volumeLabel) {
            this.volumeLabel.textContent = `${this.currentVolume}%`;
        }

        // Set player volume
        if (this.player && this.player.setVolume) {
            this.player.setVolume(this.currentVolume);
        }

        this.savePlayerState();
    }

    /**
     * Update play/pause button visibility
     */
    updatePlayPauseButtons() {
        if (this.playBtn && this.pauseBtn) {
            if (this.isPlaying) {
                this.playBtn.classList.add('hidden');
                this.pauseBtn.classList.remove('hidden');
            } else {
                this.playBtn.classList.remove('hidden');
                this.pauseBtn.classList.add('hidden');
            }
        }
    }

    /**
     * Save player state to localStorage
     */
    savePlayerState() {
        try {
            const state = {
                isExpanded: this.isExpanded,
                currentVolume: this.currentVolume,
                isPlaying: this.isPlaying,
                currentVideoId: this.currentVideoId
            };
            localStorage.setItem('musicPlayerState', JSON.stringify(state));
        } catch (error) {
            console.error('Failed to save music player state:', error);
        }
    }

    /**
     * Load player state from localStorage
     */
    loadPlayerState() {
        try {
            const saved = localStorage.getItem('musicPlayerState');
            if (!saved) return;

            const state = JSON.parse(saved);

            // Restore volume
            if (state.currentVolume !== undefined) {
                this.currentVolume = state.currentVolume;
                if (this.volumeSlider) {
                    this.volumeSlider.value = this.currentVolume;
                }
                if (this.volumeLabel) {
                    this.volumeLabel.textContent = `${this.currentVolume}%`;
                }
            }

            // Restore channel
            if (state.currentVideoId) {
                this.currentVideoId = state.currentVideoId;
                if (this.channelSelect) {
                    this.channelSelect.value = state.currentVideoId;
                }
            }

            // Restore playing state (but don't auto-expand or auto-play)
            this.isPlaying = false; // Don't auto-play on page load
            this.updatePlayPauseButtons();

            console.log('✅ Music player state restored');
        } catch (error) {
            console.error('Failed to load music player state:', error);
        }
    }
}

// Global instance
let musicPlayer;

// Wait for YouTube API to load
window.onYouTubeIframeAPIReady = function() {
    console.log('✅ YouTube IFrame API ready');
    if (musicPlayer && musicPlayer.isExpanded) {
        musicPlayer.initializePlayer();
    }
};

// Initialize music player when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        musicPlayer = new MusicPlayer();
        console.log('🎵 Music player initialized');
    } catch (error) {
        console.error('Failed to initialize music player:', error);
    }
});
