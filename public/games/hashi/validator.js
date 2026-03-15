class HashiValidator {
    constructor(gameState) {
        this.gameState = gameState;
    }

    canAddBridge(fromKey, toKey) {
        const fromIsland = this.gameState.getIsland(fromKey);
        const toIsland = this.gameState.getIsland(toKey);
        if (!fromIsland || !toIsland) return { valid: false, reason: 'Island not found' };

        const fromPos = { row: fromIsland.row, col: fromIsland.col };
        const toPos = { row: toIsland.row, col: toIsland.col };
        if (!areAdjacent(fromPos, toPos)) {
            return { valid: false, reason: 'Islands must be adjacent' };
        }

        const currentCount = this.gameState.getBridgeCount(fromKey, toKey);
        if (currentCount >= 2) {
            return { valid: false, reason: 'Maximum 2 bridges allowed' };
        }

        if (fromIsland.current >= fromIsland.target) {
            return { valid: false, reason: 'Source island already has enough bridges' };
        }
        if (toIsland.current >= toIsland.target) {
            return { valid: false, reason: 'Target island already has enough bridges' };
        }

        const newBridge = {
            from: { row: fromIsland.row, col: fromIsland.col },
            to: { row: toIsland.row, col: toIsland.col }
        };

        const existingBridges = this.gameState.bridges.map(b => ({
            from: parseIslandKey(b.fromKey),
            to: parseIslandKey(b.toKey)
        }));

        if (wouldCrossBridge(newBridge, existingBridges, this.gameState.gridSize)) {
            return { valid: false, reason: 'Bridge would cross existing bridge' };
        }

        return { valid: true };
    }

    areAllIslandsSatisfied() {
        for (const [key, island] of this.gameState.islands) {
            if (island.current !== island.target) return false;
        }
        return true;
    }

    areAllIslandsConnected() {
        const keys = this.gameState.getIslandKeys();
        if (keys.length === 0) return true;

        const uf = new UnionFind(keys.length);
        const keyToIndex = new Map(keys.map((k, i) => [k, i]));

        this.gameState.bridges.forEach(bridge => {
            const idx1 = keyToIndex.get(bridge.fromKey);
            const idx2 = keyToIndex.get(bridge.toKey);
            uf.union(idx1, idx2);
        });

        return uf.getCount() === 1;
    }

    isGameWon() {
        return this.areAllIslandsSatisfied() && this.areAllIslandsConnected();
    }

    getErrorStates() {
        const errors = new Set();
        for (const [key, island] of this.gameState.islands) {
            if (island.current > island.target) {
                errors.add(key);
            }
        }
        return errors;
    }

    getSatisfiedIslands() {
        const satisfied = new Set();
        for (const [key, island] of this.gameState.islands) {
            if (island.current === island.target) {
                satisfied.add(key);
            }
        }
        return satisfied;
    }

    getAdjacentIslands(islandKey) {
        const island = this.gameState.getIsland(islandKey);
        if (!island) return [];

        const keys = [];
        const directions = [
            { row: -1, col: 0 }, { row: 1, col: 0 },
            { row: 0, col: -1 }, { row: 0, col: 1 }
        ];

        for (const dir of directions) {
            const adjKey = `${island.row + dir.row},${island.col + dir.col}`;
            if (this.gameState.islands.has(adjKey)) {
                keys.push(adjKey);
            }
        }

        return keys;
    }

    isValidState() {
        return this.getErrorStates().size === 0;
    }
}
