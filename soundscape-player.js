/**
 * Ambient Soundscape Player
 * Generates and mixes ambient sounds using Web Audio API
 */

class SoundscapePlayer {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.masterGainNode = null;
        this.timerInterval = null;
        this.isPlaying = false;

        this.initializeElements();
        this.bindEvents();
        this.loadSettings();
    }

    /**
     * Initialize DOM elements
     */
    initializeElements() {
        this.toggleBtn = document.getElementById('soundscape-toggle-btn');
        this.content = document.getElementById('soundscape-content');
        this.playBtn = document.getElementById('soundscape-play-all');
        this.stopBtn = document.getElementById('soundscape-stop-all');
        this.masterVolumeSlider = document.getElementById('soundscape-master-volume');
        this.masterVolumeLabel = document.getElementById('soundscape-master-volume-label');
        this.timerToggle = document.getElementById('soundscape-timer-toggle');
        this.timerDuration = document.getElementById('soundscape-timer-duration');

        this.soundToggles = document.querySelectorAll('.sound-toggle');
        this.volumeSliders = document.querySelectorAll('.sound-volume');
        this.presetButtons = document.querySelectorAll('.preset-btn');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        this.toggleBtn?.addEventListener('click', () => this.togglePanel());
        this.playBtn?.addEventListener('click', () => this.playAll());
        this.stopBtn?.addEventListener('click', () => this.stopAll());

        this.masterVolumeSlider?.addEventListener('input', (e) => this.updateMasterVolume(e.target.value));

        this.timerToggle?.addEventListener('change', (e) => {
            this.timerDuration.disabled = !e.target.checked;
        });

        // Sound toggles
        this.soundToggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => this.toggleSound(e.target.dataset.sound, e.target.checked));
        });

        // Volume sliders
        this.volumeSliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                const soundName = e.target.dataset.sound;
                const volume = e.target.value;
                this.updateSoundVolume(soundName, volume);

                // Update label
                const label = e.target.nextElementSibling;
                if (label) label.textContent = `${volume}%`;
            });
        });

        // Preset buttons
        this.presetButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.loadPreset(e.target.dataset.preset));
        });
    }

    /**
     * Toggle soundscape panel
     */
    togglePanel() {
        if (this.content) {
            this.content.classList.toggle('hidden');
        }
    }

    /**
     * Initialize Audio Context
     */
    initAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGainNode = this.audioContext.createGain();
            this.masterGainNode.connect(this.audioContext.destination);
            this.masterGainNode.gain.value = 1.0;

            console.log('🎧 Audio context initialized');
        }
    }

    /**
     * Generate noise buffer
     */
    generateNoiseBuffer(type = 'white') {
        const bufferSize = this.audioContext.sampleRate * 2;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);

        if (type === 'white') {
            // White noise - full spectrum random
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
        } else if (type === 'pink') {
            // Pink noise (1/f noise) - more natural sounding
            let b0, b1, b2, b3, b4, b5, b6;
            b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                output[i] *= 0.11;
                b6 = white * 0.115926;
            }
        } else if (type === 'brown') {
            // Brown noise (Brownian noise) - deeper, rumbling sound
            let lastOut = 0.0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                output[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = output[i];
                output[i] *= 3.5; // Compensate for gain loss
            }
        }

        return buffer;
    }

    /**
     * Create sound source
     */
    createSound(soundName) {
        this.initAudioContext();

        const sound = {
            source: null,
            gainNode: this.audioContext.createGain(),
            filterNode: this.audioContext.createBiquadFilter(),
            isPlaying: false
        };

        // Connect filter to gain, then to master
        sound.filterNode.connect(sound.gainNode);
        sound.gainNode.connect(this.masterGainNode);
        sound.gainNode.gain.value = 0.5;

        // Create appropriate sound based on type with specific filtering
        switch(soundName) {
            case 'whitenoise':
                sound.buffer = this.generateNoiseBuffer('white');
                sound.filterNode.type = 'highpass';
                sound.filterNode.frequency.value = 300;
                break;
            case 'rain':
                sound.buffer = this.generateNoiseBuffer('pink');
                sound.filterNode.type = 'bandpass';
                sound.filterNode.frequency.value = 2000;
                sound.filterNode.Q.value = 0.5;
                break;
            case 'thunder':
                sound.buffer = this.generateNoiseBuffer('brown');
                sound.filterNode.type = 'lowpass';
                sound.filterNode.frequency.value = 200;
                sound.gainNode.gain.value = 0.3;
                break;
            case 'ocean':
                sound.buffer = this.generateNoiseBuffer('pink');
                sound.filterNode.type = 'lowpass';
                sound.filterNode.frequency.value = 800;
                sound.filterNode.Q.value = 1.0;
                break;
            case 'forest':
                sound.buffer = this.generateNoiseBuffer('pink');
                sound.filterNode.type = 'bandpass';
                sound.filterNode.frequency.value = 3000;
                sound.filterNode.Q.value = 0.7;
                break;
            case 'fireplace':
                sound.buffer = this.generateNoiseBuffer('brown');
                sound.filterNode.type = 'lowpass';
                sound.filterNode.frequency.value = 500;
                sound.filterNode.Q.value = 0.5;
                break;
            case 'coffeeshop':
                sound.buffer = this.generateNoiseBuffer('pink');
                sound.filterNode.type = 'bandpass';
                sound.filterNode.frequency.value = 1500;
                sound.filterNode.Q.value = 0.8;
                break;
            case 'fan':
                sound.buffer = this.generateNoiseBuffer('white');
                sound.filterNode.type = 'lowpass';
                sound.filterNode.frequency.value = 1200;
                break;
        }

        return sound;
    }

    /**
     * Toggle individual sound
     */
    toggleSound(soundName, enabled) {
        const volumeSlider = document.querySelector(`.sound-volume[data-sound="${soundName}"]`);

        if (enabled) {
            volumeSlider.disabled = false;
            if (!this.sounds[soundName]) {
                this.sounds[soundName] = this.createSound(soundName);
            }
            this.playSound(soundName);
        } else {
            volumeSlider.disabled = true;
            this.stopSound(soundName);
        }

        this.saveSettings();
    }

    /**
     * Play individual sound
     */
    playSound(soundName) {
        if (!this.sounds[soundName]) return;

        const sound = this.sounds[soundName];

        // Stop existing source
        if (sound.source) {
            sound.source.stop();
        }

        // Create new source
        sound.source = this.audioContext.createBufferSource();
        sound.source.buffer = sound.buffer;
        sound.source.loop = true;
        // Connect source -> filter -> gain -> master
        sound.source.connect(sound.filterNode);
        sound.source.start(0);
        sound.isPlaying = true;

        console.log(`🔊 Playing: ${soundName}`);
    }

    /**
     * Stop individual sound
     */
    stopSound(soundName) {
        if (!this.sounds[soundName]) return;

        const sound = this.sounds[soundName];
        if (sound.source && sound.isPlaying) {
            sound.source.stop();
            sound.source = null;
            sound.isPlaying = false;
            console.log(`🔇 Stopped: ${soundName}`);
        }
    }

    /**
     * Update sound volume
     */
    updateSoundVolume(soundName, volume) {
        if (!this.sounds[soundName]) return;

        const sound = this.sounds[soundName];
        const normalizedVolume = volume / 100;
        sound.gainNode.gain.value = normalizedVolume;

        this.saveSettings();
    }

    /**
     * Update master volume
     */
    updateMasterVolume(volume) {
        if (this.masterGainNode) {
            this.masterGainNode.gain.value = volume / 100;
        }
        if (this.masterVolumeLabel) {
            this.masterVolumeLabel.textContent = `${volume}%`;
        }

        this.saveSettings();
    }

    /**
     * Play all enabled sounds
     */
    playAll() {
        this.initAudioContext();

        this.soundToggles.forEach(toggle => {
            if (toggle.checked) {
                const soundName = toggle.dataset.sound;
                if (!this.sounds[soundName]) {
                    this.sounds[soundName] = this.createSound(soundName);
                }
                this.playSound(soundName);
            }
        });

        this.isPlaying = true;

        // Start timer if enabled
        if (this.timerToggle?.checked) {
            this.startTimer();
        }

        console.log('▶️ Playing all active sounds');
    }

    /**
     * Stop all sounds
     */
    stopAll() {
        Object.keys(this.sounds).forEach(soundName => {
            this.stopSound(soundName);
        });

        this.isPlaying = false;
        this.clearTimer();

        console.log('⏹️ Stopped all sounds');
    }

    /**
     * Start auto-stop timer
     */
    startTimer() {
        this.clearTimer();

        const minutes = parseInt(this.timerDuration?.value || 30);
        const milliseconds = minutes * 60 * 1000;

        this.timerInterval = setTimeout(() => {
            this.stopAll();
            console.log(`⏰ Auto-stopped after ${minutes} minutes`);
        }, milliseconds);

        console.log(`⏰ Timer set for ${minutes} minutes`);
    }

    /**
     * Clear timer
     */
    clearTimer() {
        if (this.timerInterval) {
            clearTimeout(this.timerInterval);
            this.timerInterval = null;
        }
    }

    /**
     * Load preset configuration
     */
    loadPreset(presetName) {
        // Stop all sounds first
        this.soundToggles.forEach(toggle => {
            toggle.checked = false;
            const volumeSlider = document.querySelector(`.sound-volume[data-sound="${toggle.dataset.sound}"]`);
            volumeSlider.disabled = true;
        });
        this.stopAll();

        // Define presets
        const presets = {
            focus: {
                whitenoise: 70,
                fan: 30
            },
            relax: {
                ocean: 60,
                rain: 40,
                forest: 30
            },
            rainy: {
                rain: 70,
                thunder: 20
            },
            nature: {
                forest: 60,
                ocean: 40
            }
        };

        const preset = presets[presetName];
        if (!preset) return;

        // Apply preset
        Object.entries(preset).forEach(([soundName, volume]) => {
            const toggle = document.querySelector(`.sound-toggle[data-sound="${soundName}"]`);
            const volumeSlider = document.querySelector(`.sound-volume[data-sound="${soundName}"]`);
            const volumeLabel = volumeSlider?.nextElementSibling;

            if (toggle) {
                toggle.checked = true;
                volumeSlider.disabled = false;
                volumeSlider.value = volume;
                if (volumeLabel) volumeLabel.textContent = `${volume}%`;

                // Create and set volume
                if (!this.sounds[soundName]) {
                    this.sounds[soundName] = this.createSound(soundName);
                }
                this.updateSoundVolume(soundName, volume);
            }
        });

        console.log(`🎯 Loaded preset: ${presetName}`);

        // Auto-play the preset
        setTimeout(() => this.playAll(), 100);
    }

    /**
     * Save settings to localStorage
     */
    saveSettings() {
        const settings = {
            masterVolume: this.masterVolumeSlider?.value || 100,
            sounds: {}
        };

        this.soundToggles.forEach(toggle => {
            const soundName = toggle.dataset.sound;
            const volumeSlider = document.querySelector(`.sound-volume[data-sound="${soundName}"]`);

            settings.sounds[soundName] = {
                enabled: toggle.checked,
                volume: parseInt(volumeSlider?.value || 50)
            };
        });

        try {
            localStorage.setItem('soundscapeSettings', JSON.stringify(settings));
        } catch (error) {
            console.error('Failed to save soundscape settings:', error);
        }
    }

    /**
     * Load settings from localStorage
     */
    loadSettings() {
        try {
            const saved = localStorage.getItem('soundscapeSettings');
            if (!saved) return;

            const settings = JSON.parse(saved);

            // Set master volume
            if (settings.masterVolume) {
                this.masterVolumeSlider.value = settings.masterVolume;
                this.updateMasterVolume(settings.masterVolume);
            }

            // Set individual sounds
            if (settings.sounds) {
                Object.entries(settings.sounds).forEach(([soundName, config]) => {
                    const toggle = document.querySelector(`.sound-toggle[data-sound="${soundName}"]`);
                    const volumeSlider = document.querySelector(`.sound-volume[data-sound="${soundName}"]`);
                    const volumeLabel = volumeSlider?.nextElementSibling;

                    if (toggle && volumeSlider) {
                        toggle.checked = config.enabled;
                        volumeSlider.value = config.volume;
                        volumeSlider.disabled = !config.enabled;
                        if (volumeLabel) volumeLabel.textContent = `${config.volume}%`;
                    }
                });
            }

            console.log('✅ Soundscape settings loaded');
        } catch (error) {
            console.error('Failed to load soundscape settings:', error);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('soundscape-player')) {
        window.soundscapePlayer = new SoundscapePlayer();
        console.log('🎵 Soundscape Player initialized');
    }
});
