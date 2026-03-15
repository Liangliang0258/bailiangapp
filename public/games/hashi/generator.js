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
        return this.generateSolvableLevel(size, islandCount);
    }

    generateSolvableLevel(gridSize, islandCount) {
        // Generate valid island positions first
        const positions = this.generateIslandPositions(gridSize, islandCount);
        if (!positions) return this.generateSimpleLevel(gridSize, islandCount);

        // Build a valid bridge configuration (minimum spanning tree style)
        const bridgeConfig = this.buildValidBridgeConfig(positions, gridSize);

        // Calculate targets based on bridge counts
        const targets = this.calculateTargets(positions, bridgeConfig);

        return {
            gridSize,
            islands: positions.map((p, i) => ({ row: p.row, col: p.col, target: targets[i] })),
            solution: bridgeConfig // Store the solution
        };
    }

    generateIslandPositions(gridSize, islandCount) {
        const positions = [];
        const occupied = new Set();

        // Try to place islands ensuring at least 2 per row/col for connectivity
        const rowsPerIsland = Math.ceil(Math.sqrt(gridSize * islandCount) / gridSize);
        const colsPerIsland = Math.ceil(Math.sqrt(gridSize * islandCount) / gridSize);

        let attempts = 0;
        while (positions.length < islandCount && attempts < 200) {
            const row = Math.floor(this.rng() * gridSize);
            const col = Math.floor(this.rng() * gridSize);
            const key = `${row},${col}`;

            if (!occupied.has(key)) {
                // Check if this position can connect to existing islands
                let canConnect = positions.length === 0;
                if (!canConnect) {
                    for (const pos of positions) {
                        if (this.canConnectDirectly(row, col, pos.row, pos.col, positions)) {
                            canConnect = true;
                            break;
                        }
                    }
                }

                if (canConnect) {
                    occupied.add(key);
                    positions.push({ row, col });
                }
            }
            attempts++;
        }

        return positions.length === islandCount ? positions : null;
    }

    canConnectDirectly(r1, c1, r2, c2, positions) {
        if (r1 !== r2 && c1 !== c2) return false;

        // Check if there's an island blocking the path
        if (r1 === r2) {
            const minC = Math.min(c1, c2);
            const maxC = Math.max(c1, c2);
            for (const pos of positions) {
                if (pos.row === r1 && pos.col > minC && pos.col < maxC) return false;
            }
        } else {
            const minR = Math.min(r1, r2);
            const maxR = Math.max(r1, r2);
            for (const pos of positions) {
                if (pos.col === c1 && pos.row > minR && pos.row < maxR) return false;
            }
        }
        return true;
    }

    buildValidBridgeConfig(positions, gridSize) {
        const bridges = [];
        const n = positions.length;
        const connected = new Set([0]);

        // First, ensure connectivity with minimum bridges (spanning tree)
        while (connected.size < n) {
            for (let i = 0; i < n; i++) {
                if (connected.has(i)) continue;
                for (let j of connected) {
                    if (this.canConnectDirectly(positions[i].row, positions[i].col,
                        positions[j].row, positions[j].col, positions)) {
                        bridges.push({ from: i, to: j, count: 1 });
                        connected.add(i);
                        break;
                    }
                }
            }
        }

        // Add extra bridges to make the puzzle more interesting
        // Try to add a second bridge to some connections
        for (let i = 0; i < bridges.length; i++) {
            if (this.rng() > 0.5) {
                bridges[i].count = 2;
            }
        }

        // Convert to key-based format
        return bridges.map(b => ({
            fromKey: `${positions[b.from].row},${positions[b.from].col}`,
            toKey: `${positions[b.to].row},${positions[b.to].col}`,
            count: b.count
        }));
    }

    calculateTargets(positions, bridgeConfig) {
        const targets = new Array(positions.length).fill(0);

        for (const bridge of bridgeConfig) {
            const fromIdx = positions.findIndex(p =>
                p.row === parseInt(bridge.fromKey.split(',')[0]) &&
                p.col === parseInt(bridge.fromKey.split(',')[1])
            );
            const toIdx = positions.findIndex(p =>
                p.row === parseInt(bridge.toKey.split(',')[0]) &&
                p.col === parseInt(bridge.toKey.split(',')[1])
            );

            if (fromIdx >= 0) targets[fromIdx] += bridge.count;
            if (toIdx >= 0) targets[toIdx] += bridge.count;
        }

        // Ensure minimum target of 1
        return targets.map(t => Math.max(t, 1));
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

        // Build a simple solution
        const bridgeConfig = this.buildValidBridgeConfig(positions, gridSize);
        const targets = this.calculateTargets(positions, bridgeConfig);

        return {
            gridSize,
            islands: positions.map((p, i) => ({ row: p.row, col: p.col, target: targets[i] })),
            solution: bridgeConfig
        };
    }
}
