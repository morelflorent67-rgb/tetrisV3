/**
 * Logique pure Tetris : SRS, 7-bag, Collisions.
 */
export const COLS = 10;
export const ROWS = 20;

export const PIECES = {
    'I': { color: '#00f0f0', shape: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]] },
    'J': { color: '#0000f0', shape: [[1,0,0],[1,1,1],[0,0,0]] },
    'L': { color: '#f0a000', shape: [[0,0,1],[1,1,1],[0,0,0]] },
    'O': { color: '#f0f000', shape: [[1,1],[1,1]] },
    'S': { color: '#00f000', shape: [[0,1,1],[1,1,0],[0,0,0]] },
    'T': { color: '#a000f0', shape: [[0,1,0],[1,1,1],[0,0,0]] },
    'Z': { color: '#f00000', shape: [[1,1,0],[0,1,1],[0,0,0]] }
};

// SRS Wall Kick Data (simplifié)
export const KICKS = {
    "0-1": [[0,0], [-1,0], [-1,1], [0,-2], [-1,-2]],
    "1-0": [[0,0], [1,0], [1,-1], [0,2], [1,2]],
    "1-2": [[0,0], [1,0], [1,-1], [0,2], [1,2]],
    "2-1": [[0,0], [-1,0], [-1,1], [0,-2], [-1,-2]],
    // ... etc, peut être complété pour un SRS parfait
};

export class Piece {
    constructor(type) {
        this.type = type;
        this.shape = PIECES[type].shape;
        this.color = PIECES[type].color;
        this.x = 3;
        this.y = 0;
        this.rotation = 0;
    }

    rotate(matrix) {
        return matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());
    }
}

export function createBag() {
    const pieces = Object.keys(PIECES);
    let bag = [...pieces];
    for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    return bag;
}