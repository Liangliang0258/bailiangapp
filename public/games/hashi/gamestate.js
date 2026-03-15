class GameState {
    constructor(difficulty = 'medium') {
        this.difficulty = difficulty;
        this.gridSize = this.getGridSize(difficulty);
        this.islands = new Map();
        this.bridges = [];
        this.selectedIsland = null;
        this.moves = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.isComplete = false;
    }

    getGridSize(difficulty) {
        const sizes = { easy: 5, medium: 7, hard: 9 };
        return sizes[difficulty] || 7;
    }

    addIsland(row, col, target) {
        const key = `${row},${col}`;
        this.islands.set(key, { row, col, target, current: 0 });
        return key;
    }

    getIsland(key) {
        return this.islands.get(key);
    }

    getBridgeCount(fromKey, toKey) {
        const bridge = this.bridges.find(b =>
            (b.fromKey === fromKey && b.toKey === toKey) ||
            (b.fromKey === toKey && b.toKey === fromKey)
        );
        return bridge ? bridge.count : 0;
    }

    addBridge(fromKey, toKey) {
        const existingIndex = this.bridges.findIndex(b =>
            (b.fromKey === fromKey && b.toKey === toKey) ||
            (b.fromKey === toKey && b.toKey === fromKey)
        );
        if (existingIndex >= 0) {
            this.bridges[existingIndex].count++;
            this.bridges[existingIndex].count = Math.min(this.bridges[existingIndex].count, 2);
        } else {
            this.bridges.push({ fromKey, toKey, count: 1 });
        }
        this.updateIslandCounts();
        this.moves++;
    }

    removeBridge(fromKey, toKey) {
        const existingIndex = this.bridges.findIndex(b =>
            (b.fromKey === fromKey && b.toKey === toKey) ||
            (b.fromKey === toKey && b.toKey === fromKey)
        );
        if (existingIndex >= 0) {
            this.bridges[existingIndex].count--;
            if (this.bridges[existingIndex].count <= 0) {
                this.bridges.splice(existingIndex, 1);
            }
            this.updateIslandCounts();
            this.moves++;
        }
    }

    updateIslandCounts() {
        this.islands.forEach(island => island.current = 0);
        this.bridges.forEach(bridge => {
            const fromIsland = this.islands.get(bridge.fromKey);
            const toIsland = this.islands.get(bridge.toKey);
            if (fromIsland) fromIsland.current += bridge.count;
            if (toIsland) toIsland.current += bridge.count;
        });
    }

    selectIsland(key) { this.selectedIsland = key; }
    clearSelection() { this.selectedIsland = null; }

    startTimer() {
        this.startTime = Date.now();
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    getElapsedTime() {
        if (!this.startTime) return 0;
        return Math.floor((Date.now() - this.startTime) / 1000);
    }

    reset() {
        this.bridges = [];
        this.islands.forEach(island => island.current = 0);
        this.selectedIsland = null;
        this.moves = 0;
        this.startTime = null;
        this.isComplete = false;
        this.stopTimer();
    }

    complete() {
        this.isComplete = true;
        this.stopTimer();
    }

    getIslandKeys() { return Array.from(this.islands.keys()); }
    getIslandsArray() { return Array.from(this.islands.values()); }
}
