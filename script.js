// ==========================================
// SLIDE DECK CONTROLLER
// Handles navigation, transitions, and UI updates
// ==========================================

class SlideDeck {
    constructor() {
        // Initialize state
        this.currentSlide = 1;
        this.totalSlides = document.querySelectorAll('.slide').length;

        // Get DOM elements
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.slideCounter = document.getElementById('slideCounter');
        this.progressBar = document.getElementById('progress');

        // Bind event listeners
        this.attachEventListeners();

        // Initialize UI
        this.updateUI();

        console.log(`Slide deck initialized: ${this.totalSlides} slides loaded`);
    }

    // ==========================================
    // EVENT LISTENERS
    // ==========================================

    attachEventListeners() {
        // Button navigation
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowRight':
                case 'PageDown':
                case ' ': // Spacebar
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'ArrowLeft':
                case 'PageUp':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(1);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides);
                    break;
            }
        });

        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    }

    // ==========================================
    // NAVIGATION METHODS
    // ==========================================

    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    previousSlide() {
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides) {
            return;
        }

        // Determine direction for animation
        const direction = slideNumber > this.currentSlide ? 'next' : 'prev';

        // Get current and target slides
        const currentSlideElement = this.slides[this.currentSlide - 1];
        const targetSlideElement = this.slides[slideNumber - 1];

        // Apply exit animation to current slide
        currentSlideElement.classList.remove('active');
        if (direction === 'next') {
            currentSlideElement.classList.add('exit-left');
        }

        // Apply entry animation to target slide
        setTimeout(() => {
            // Reset all slides
            this.slides.forEach(slide => {
                slide.classList.remove('active', 'exit-left');
            });

            // Activate target slide
            targetSlideElement.classList.add('active');

            // Update state
            this.currentSlide = slideNumber;

            // Update UI elements
            this.updateUI();

            // Log transition
            console.log(`Navigated to slide ${this.currentSlide}/${this.totalSlides}`);
        }, 50);
    }

    // ==========================================
    // TOUCH/SWIPE HANDLING
    // ==========================================

    handleSwipe(startX, endX) {
        const swipeThreshold = 50; // Minimum swipe distance in pixels
        const difference = startX - endX;

        if (Math.abs(difference) > swipeThreshold) {
            if (difference > 0) {
                // Swiped left - go to next slide
                this.nextSlide();
            } else {
                // Swiped right - go to previous slide
                this.previousSlide();
            }
        }
    }

    // ==========================================
    // UI UPDATE METHODS
    // ==========================================

    updateUI() {
        // Update slide counter
        this.slideCounter.textContent = `${this.currentSlide} / ${this.totalSlides}`;

        // Update progress bar
        const progressPercentage = (this.currentSlide / this.totalSlides) * 100;
        this.progressBar.style.width = `${progressPercentage}%`;

        // Update button states
        this.updateButtonStates();

        // Update page title to show current slide
        const currentSlideElement = this.slides[this.currentSlide - 1];
        const slideTitle = currentSlideElement.querySelector('.slide-title, .main-title');
        if (slideTitle) {
            document.title = `${slideTitle.textContent} - GMC Acadia Korea Market`;
        }
    }

    updateButtonStates() {
        // Disable previous button on first slide
        if (this.currentSlide === 1) {
            this.prevBtn.disabled = true;
            this.prevBtn.style.opacity = '0.3';
        } else {
            this.prevBtn.disabled = false;
            this.prevBtn.style.opacity = '1';
        }

        // Disable next button on last slide
        if (this.currentSlide === this.totalSlides) {
            this.nextBtn.disabled = true;
            this.nextBtn.style.opacity = '0.3';
        } else {
            this.nextBtn.disabled = false;
            this.nextBtn.style.opacity = '1';
        }
    }

    // ==========================================
    // UTILITY METHODS
    // ==========================================

    getCurrentSlideNumber() {
        return this.currentSlide;
    }

    getTotalSlides() {
        return this.totalSlides;
    }
}

// ==========================================
// INITIALIZE APPLICATION
// ==========================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create slide deck instance
    const slideDeck = new SlideDeck();

    // Make it globally accessible for debugging
    window.slideDeck = slideDeck;

    // Add subtle animation on load
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    // Log initialization
    console.log('GMC Acadia Korea Market Deck - Ready');
    console.log('Navigation: Arrow keys, PageUp/PageDown, or click buttons');
    console.log('Quick jump: Home (first slide), End (last slide)');
});

// ==========================================
// KEYBOARD SHORTCUTS HELP
// ==========================================

// Display keyboard shortcuts when user presses '?'
document.addEventListener('keydown', (e) => {
    if (e.key === '?') {
        alert(
            'Keyboard Shortcuts:\n\n' +
            '→ / Space / PageDown - Next slide\n' +
            '← / PageUp - Previous slide\n' +
            'Home - First slide\n' +
            'End - Last slide\n' +
            '? - Show this help'
        );
    }
});

// ==========================================
// ANALYTICS & PERFORMANCE TRACKING
// ==========================================

// Track slide view times (optional - can be used for analytics)
class SlideAnalytics {
    constructor() {
        this.slideViewTimes = {};
        this.startTime = Date.now();
        this.currentSlideStartTime = Date.now();
    }

    trackSlideChange(slideNumber) {
        const now = Date.now();
        const duration = now - this.currentSlideStartTime;

        if (!this.slideViewTimes[slideNumber]) {
            this.slideViewTimes[slideNumber] = 0;
        }

        this.slideViewTimes[slideNumber] += duration;
        this.currentSlideStartTime = now;
    }

    getReport() {
        return {
            totalTime: Date.now() - this.startTime,
            slideViewTimes: this.slideViewTimes
        };
    }
}

// Initialize analytics (optional)
const analytics = new SlideAnalytics();
window.slideAnalytics = analytics;
