/**
 * Whiteboard/Scratchpad System
 * Canvas-based drawing tool for problem-solving and brainstorming
 */

class Whiteboard {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isDrawing = false;
        this.currentTool = 'pen';
        this.currentColor = '#000000';
        this.brushSize = 3;
        this.lastX = 0;
        this.lastY = 0;

        this.initializeElements();
        this.setupCanvas();
        this.bindEvents();
        this.loadSavedCanvas();
    }

    /**
     * Initialize DOM elements
     */
    initializeElements() {
        this.openBtn = document.getElementById('open-whiteboard-btn');
        this.closeBtn = document.getElementById('close-whiteboard-btn');
        this.section = document.getElementById('whiteboard-section');
        this.canvas = document.getElementById('whiteboard-canvas');
        this.saveBtn = document.getElementById('save-whiteboard-btn');
        this.clearBtn = document.getElementById('clear-whiteboard-btn');
        this.downloadBtn = document.getElementById('download-whiteboard-btn');

        this.brushSizeSlider = document.getElementById('brush-size');
        this.brushSizeLabel = document.getElementById('brush-size-label');

        this.toolBtns = document.querySelectorAll('.tool-btn');
        this.colorBtns = document.querySelectorAll('.color-btn');
    }

    /**
     * Setup canvas
     */
    setupCanvas() {
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');

        // Set canvas size
        this.resizeCanvas();

        // Setup drawing context
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        window.addEventListener('resize', () => this.resizeCanvas());
    }

    /**
     * Resize canvas
     */
    resizeCanvas() {
        if (!this.canvas) return;

        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();

        this.canvas.width = rect.width;
        this.canvas.height = rect.height - 20; // Account for padding

        // Restore canvas if resized
        this.loadSavedCanvas();
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        this.openBtn?.addEventListener('click', () => this.open());
        this.closeBtn?.addEventListener('click', () => this.close());
        this.saveBtn?.addEventListener('click', () => this.saveCanvas());
        this.clearBtn?.addEventListener('click', () => this.clearCanvas());
        this.downloadBtn?.addEventListener('click', () => this.downloadCanvas());

        this.brushSizeSlider?.addEventListener('input', (e) => {
            this.brushSize = parseInt(e.target.value);
            this.brushSizeLabel.textContent = `${this.brushSize}px`;
        });

        this.toolBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.toolBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentTool = btn.dataset.tool;
            });
        });

        this.colorBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.colorBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentColor = btn.dataset.color;
            });
        });

        // Drawing events
        if (this.canvas) {
            this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
            this.canvas.addEventListener('mousemove', (e) => this.draw(e));
            this.canvas.addEventListener('mouseup', () => this.stopDrawing());
            this.canvas.addEventListener('mouseout', () => this.stopDrawing());

            // Touch events
            this.canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const mouseEvent = new MouseEvent('mousedown', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                this.canvas.dispatchEvent(mouseEvent);
            });

            this.canvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const mouseEvent = new MouseEvent('mousemove', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                this.canvas.dispatchEvent(mouseEvent);
            });

            this.canvas.addEventListener('touchend', (e) => {
                e.preventDefault();
                const mouseEvent = new MouseEvent('mouseup', {});
                this.canvas.dispatchEvent(mouseEvent);
            });
        }
    }

    /**
     * Open whiteboard
     */
    open() {
        const landingSection = document.getElementById('landing-section');
        if (landingSection) landingSection.classList.add('hidden');

        if (this.section) {
            this.section.classList.remove('hidden');
            this.resizeCanvas();
            this.loadSavedCanvas();
        }
    }

    /**
     * Close whiteboard
     */
    close() {
        if (this.section) this.section.classList.add('hidden');

        const landingSection = document.getElementById('landing-section');
        if (landingSection) landingSection.classList.remove('hidden');
    }

    /**
     * Get mouse position relative to canvas
     */
    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    /**
     * Start drawing
     */
    startDrawing(e) {
        this.isDrawing = true;
        const pos = this.getMousePos(e);
        this.lastX = pos.x;
        this.lastY = pos.y;
    }

    /**
     * Draw
     */
    draw(e) {
        if (!this.isDrawing) return;

        const pos = this.getMousePos(e);

        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(pos.x, pos.y);

        if (this.currentTool === 'pen') {
            this.ctx.strokeStyle = this.currentColor;
            this.ctx.lineWidth = this.brushSize;
            this.ctx.globalCompositeOperation = 'source-over';
        } else if (this.currentTool === 'eraser') {
            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.lineWidth = this.brushSize * 2;
            this.ctx.globalCompositeOperation = 'destination-out';
        }

        this.ctx.stroke();

        this.lastX = pos.x;
        this.lastY = pos.y;
    }

    /**
     * Stop drawing
     */
    stopDrawing() {
        this.isDrawing = false;
    }

    /**
     * Clear canvas
     */
    clearCanvas() {
        if (!confirm('Are you sure you want to clear the whiteboard?')) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        console.log('🗑️ Whiteboard cleared');
    }

    /**
     * Save canvas to localStorage
     */
    saveCanvas() {
        try {
            const dataURL = this.canvas.toDataURL('image/png');
            localStorage.setItem('whiteboardCanvas', dataURL);
            console.log('💾 Whiteboard saved');
            alert('Whiteboard saved successfully!');
        } catch (error) {
            console.error('Failed to save whiteboard:', error);
            alert('Failed to save whiteboard. Canvas might be too large.');
        }
    }

    /**
     * Load canvas from localStorage
     */
    loadSavedCanvas() {
        try {
            const saved = localStorage.getItem('whiteboardCanvas');
            if (saved) {
                const img = new Image();
                img.onload = () => {
                    // Clear and fill with white
                    this.ctx.fillStyle = '#FFFFFF';
                    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                    // Draw saved image
                    this.ctx.drawImage(img, 0, 0);
                    console.log('📥 Whiteboard loaded');
                };
                img.src = saved;
            } else {
                // Initialize with white background
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            }
        } catch (error) {
            console.error('Failed to load whiteboard:', error);
            // Initialize with white background
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    /**
     * Download canvas as PNG
     */
    downloadCanvas() {
        try {
            const dataURL = this.canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `whiteboard-${Date.now()}.png`;
            link.href = dataURL;
            link.click();

            console.log('📥 Whiteboard downloaded');
        } catch (error) {
            console.error('Failed to download whiteboard:', error);
            alert('Failed to download whiteboard.');
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.whiteboard = new Whiteboard();
    console.log('🎨 Whiteboard initialized');
});
