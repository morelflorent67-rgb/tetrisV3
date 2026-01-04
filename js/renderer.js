/**
 * Rendu Canvas haute performance (DPR aware).
 */
export class Renderer {
    constructor(canvas, cols, rows) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.cols = cols;
        this.rows = rows;
        this.resize();
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        this.cellSize = rect.height / this.rows;
    }

    clear() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawGrid(grid) {
        grid.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) this.drawBlock(x, y, value);
            });
        });
    }

    drawBlock(x, y, color, opacity = 1) {
        this.ctx.globalAlpha = opacity;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize - 1, this.cellSize - 1);
        this.ctx.globalAlpha = 1;
    }

    drawPiece(piece, isGhost = false) {
        const color = isGhost ? '#333' : piece.color;
        piece.shape.forEach((row, dy) => {
            row.forEach((value, dx) => {
                if (value) this.drawBlock(piece.x + dx, piece.y + dy, color, isGhost ? 0.5 : 1);
            });
        });
    }
}