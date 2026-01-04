import { Game } from './game.js';

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const game = new Game(canvas);
    
    // Start game loop
    game.loop();

    document.getElementById('restart-btn').onclick = () => {
        location.reload();
    };

    // Service Worker Registration
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(() => console.log("PWA Ready"))
            .catch(err => console.log("SW Error", err));
    }
});