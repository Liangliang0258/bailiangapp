class HashiGenerator {
    constructor() {
        this.rng = Math.random;
    }

    generate(difficulty = 'medium') {
        const sizeMap = { easy: 5, medium: 7, hard: 9 };
        const islandCountMap = { easy: [4, 6], medium: [6, 9], hard: [8, 12] };
        const size = sizeMap[difficulty] || 7;
        const [minIslands, maxIslands] = islandCountMap[difficulty] || [6, 9];
        const islandCount = Math.floor(this.rng() * (maxIslands - minIslands + 1)) + minIslands;
        return this.generateLevel(size, islandCount);
    }

    generateLevel(gridSize, islandCount) {
        const positions = [];
        const occupied = new Set();
        for (let i = 0; i < islandCount; i++) {
            let pos, key;
            let attempts = 0;
            do {
                pos = { row: Math.floor(this.rng() * gridSize), col: Math.floor(this.rng() * gridSize) };
                key = `${pos.row},${pos.col}`;
                attempts++;
            } while (occupied.has(key) && attempts < 50);
            if (attempts >= 50) return this.generateSimpleLevel(gridSize, islandCount);
            occupied.add(key);
            positions.push(pos);
        }

        // Generate targets (simplified)
        const targets = positions.map(() => Math.floor(this.rng() * 3) + 1);

        return { gridSize, islands: positions.map((p, i) => ({ row: p.row, col: p.col, target: targets[i] })) };
    }

    generateSimpleLevel(gridSize, islandCount) {
        const positions = [];
        const step = Math.floor(gridSize / Math.ceil(Math.sqrt(islandCount)));
        for (let row = 1; row < gridSize - 1; row += step) {
            for (let col = 1; col < gridSize - 1; col += step) {
                if (positions.length >= islandCount) break;
                positions.push({ row, col });
            }
        }
        while (positions.length < islandCount) {
            positions.push({
                row: Math.floor(Math.random() * (gridSize - 2)) + 1,
                col: Math.floor(Math.random() * (gridSize - 2)) + 1
            });
        }
        const targets = positions.map(() => Math.floor(Math.random() * 3) + 1);
        return { gridSize, islands: positions.map((p, i) => ({ row: p.row, col: p.col, target: targets[i] })) };
    }
}
