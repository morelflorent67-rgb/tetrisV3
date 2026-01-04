/**
 * Gestion unifiée Clavier + Tactile.
 */
export class InputHandler {
    constructor() {
        this.action = null;
        this.initKeyboard();
        this.initTouch();
    }

    initKeyboard() {
        window.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft' || e.key === 'a') this.action = 'LEFT';
            if (e.key === 'ArrowRight' || e.key === 'd') this.action = 'RIGHT';
            if (e.key === 'ArrowDown' || e.key === 's') this.action = 'DOWN';
            if (e.key === 'ArrowUp' || e.key === 'w') this.action = 'ROTATE';
            if (e.key === ' ') this.action = 'HARD';
            if (e.key === 'p') this.action = 'PAUSE';
        });
    }

    initTouch() {
        let touchStartX = 0;
        let touchStartY = 0;
        let lastTap = 0;

        window.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            
            // Double tap pour Hard Drop
            const now = Date.now();
            if (now - lastTap < 300) this.action = 'HARD';
            lastTap = now;
        });

        window.addEventListener('touchend', e => {
            const dx = e.changedTouches[0].clientX - touchStartX;
            const dy = e.changedTouches[0].clientY - touchStartY;

            if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
                this.action = 'ROTATE';
            } else if (Math.abs(dx) > Math.abs(dy)) {
                this.action = dx > 0 ? 'RIGHT' : 'LEFT';
            } else if (dy > 30) {
                this.action = 'DOWN';
            }
        });
    }

    getAction() {
        const a = this.action;
        this.action = null;
        return a;
    }
}