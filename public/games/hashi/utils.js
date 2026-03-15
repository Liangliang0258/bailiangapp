/**
 * Utility functions for Hashi Bridge puzzle game
 */

// Union-Find (Disjoint Set) for connectivity checking
class UnionFind {
    constructor(size) {
        this.parent = new Array(size);
        this.rank = new Array(size);
        for (let i = 0; i < size; i++) {
            this.parent[i] = i;
            this.rank[i] = 0;
        }
    }

    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }

    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);

        if (rootX === rootY) return;

        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
        } else if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
        } else {
            this.parent[rootY] = rootX;
            this.rank[rootX]++;
        }
    }

    getCount() {
        const roots = new Set();
        for (let i = 0; i < this.parent.length; i++) {
            roots.add(this.find(i));
        }
        return roots.size;
    }
}

// Distance calculation
function distance(p1, p2) {
    return Math.sqrt(Math.pow(p2.col - p1.col, 2) + Math.pow(p2.row - p1.row, 2));
}

// Check if two islands can be connected (same row/col with no islands between)
function areAdjacent(island1, island2, gameState) {
    // Must be in same row or same column
    if (island1.row !== island2.row && island1.col !== island2.col) {
        return false;
    }

    // Check if there are any islands between them
    if (island1.row === island2.row) {
        // Same row - check columns between
        const minCol = Math.min(island1.col, island2.col);
        const maxCol = Math.max(island1.col, island2.col);
        for (const [key, island] of gameState.islands) {
            if (island.row === island1.row && island.col > minCol && island.col < maxCol) {
                return false; // Island between them
            }
        }
        return true;
    } else {
        // Same column - check rows between
        const minRow = Math.min(island1.row, island2.row);
        const maxRow = Math.max(island1.row, island2.row);
        for (const [key, island] of gameState.islands) {
            if (island.col === island1.col && island.row > minRow && island.row < maxRow) {
                return false; // Island between them
            }
        }
        return true;
    }
}

// Check if a bridge would cross any existing bridge
function wouldCrossBridge(bridge, existingBridges, gridSize) {
    // Only horizontal-vertical crossings need to be checked
    for (const existing of existingBridges) {
        if (bridgesCross(bridge, existing)) {
            return true;
        }
    }
    return false;
}

function bridgesCross(b1, b2) {
    // b1 and b2 are {from: {row, col}, to: {row, col}}
    // Check if they cross at right angles
    const b1Horizontal = b1.from.row === b1.to.row;
    const b2Horizontal = b2.from.row === b2.to.row;

    if (b1Horizontal === b2Horizontal) return false; // Parallel, no cross

    // One horizontal, one vertical - check if they cross
    const horizontal = b1Horizontal ? b1 : b2;
    const vertical = b1Horizontal ? b2 : b1;

    const hRow = horizontal.from.row;
    const hCol1 = Math.min(horizontal.from.col, horizontal.to.col);
    const hCol2 = Math.max(horizontal.from.col, horizontal.to.col);

    const vCol = vertical.from.col;
    const vRow1 = Math.min(vertical.from.row, vertical.to.row);
    const vRow2 = Math.max(vertical.from.row, vertical.to.row);

    return hRow > vRow1 && hRow < vRow2 && vCol > hCol1 && vCol < hCol2;
}

// Format time as MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Get island key for storage
function getIslandKey(row, col) {
    return `${row},${col}`;
}

// Parse island key
function parseIslandKey(key) {
    const [row, col] = key.split(',').map(Number);
    return { row, col };
}
