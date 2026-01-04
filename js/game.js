import { Piece, createBag, COLS, ROWS } from './tetris.js';
import { Renderer } from './renderer.js';
import { InputHandler } from './input.js';

export class Game {
    constructor(canvas) {
        this.renderer = new Renderer(canvas, COLS, ROWS);
        this.input = new InputHandler();
        this.grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
        this.bag = createBag();
        this.nextBag = createBag();
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.paused = false;
        this.gameOver = false;
        
        this.spawnPiece();
        this.lastTime = 0;
        this.dropCounter = 0;
        this.dropInterval = 1000;

        window.addEventListener('resize', () => this.renderer.resize());
    }

    spawnPiece() {
        const type = this.bag.pop();
        this.piece = new Piece(type);
        if (this.bag.length === 0) {
            this.bag = this.nextBag;
            this.nextBag = createBag();
        }
        if (this.collide()) this.gameOver = true;
    }

    collide(p = this.piece) {
        return p.shape.some((row, dy) => {
            return row.some((value, dx) => {
                let x = p.x + dx;
                let y = p.y + dy;
                return value && (x < 0 || x >= COLS || y >= ROWS || (this.grid[y] && this.grid[y][x]));
            });
        });
    }

    rotate() {
        const oldShape = this.piece.shape;
        this.piece.shape = this.piece.rotate(this.piece.shape);
        if (this.collide()) this.piece.shape = oldShape; // Simple kick
    }

    move(dir) {
        this.piece.x += dir;
        if (this.collide()) this.piece.x -= dir;
    }

    drop() {
        this.piece.y++;
        if (this.collide()) {
            this.piece.y--;
            this.lock();
            return false;
        }
        this.dropCounter = 0;
        return true;
    }

    lock() {
        this.piece.shape.forEach((row, dy) => {
            row.forEach((val, dx) => {
                if (val) this.grid[this.piece.y + dy][this.piece.x + dx] = this.piece.color;
            });
        });
        this.clearLines();
        this.spawnPiece();
    }

    clearLines() {
        let linesCleared = 0;
        for (let y = ROWS - 1; y >= 0; y--) {
            if (this.grid[y].every(cell => cell !== 0)) {
                this.grid.splice(y, 1);
                this.grid.unshift(Array(COLS).fill(0));
                linesCleared++;
                y++;
            }
        }
        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.score += [0, 100, 300, 500, 800][linesCleared] * this.level;
            this.level = Math.floor(this.lines / 10) + 1;
            this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
            this.updateUI();
        }
    }

    updateUI() {
        document.getElementById('score').innerText = this.score;
        document.getElementById('level').innerText = this.level;
    }

    getGhost() {
        const ghost = { ...this.piece, y: this.piece.y };
        while (!this.collide(ghost)) { ghost.y++; }
        ghost.y--;
        return ghost;
    }

    loop(time = 0) {
        if (this.paused || this.gameOver) {
            this.draw();
            requestAnimationFrame(this.loop.bind(this));
            return;
        }

        const dt = time - this.lastTime;
        this.lastTime = time;
        this.dropCounter += dt;

        this.handleInput();

        if (this.dropCounter > this.dropInterval) {
            this.drop();
        }

        this.draw();
        requestAnimationFrame(this.loop.bind(this));
    }

    handleInput() {
        const action = this.input.getAction();
        if (!action) return;
        if (action === 'LEFT') this.move(-1);
        if (action === 'RIGHT') this.move(1);
        if (action === 'DOWN') this.drop();
        if (action === 'ROTATE') this.rotate();
        if (action === 'HARD') while(this.drop());
        if (action === 'PAUSE') this.paused = !this.paused;
    }

    draw() {
        this.renderer.clear();
        this.renderer.drawGrid(this.grid);
        if (!this.gameOver) {
            this.renderer.drawPiece(this.getGhost(), true);
            this.renderer.drawPiece(this.piece);
        }
        if (this.paused || this.gameOver) {
            document.getElementById('overlay').classList.remove('hidden');
            document.getElementById('msg').innerText = this.gameOver ? 'GAME OVER' : 'PAUSED';
        } else {
            document.getElementById('overlay').classList.add('hidden');
        }
    }
}