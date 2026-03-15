class HashiRenderer {
    constructor(svgElement, gameState) {
        this.svg = svgElement;
        this.gameState = gameState;
        this.bridgesLayer = svgElement.querySelector('.bridges-layer');
        this.islandsLayer = svgElement.querySelector('.islands-layer');
        this.hintsLayer = svgElement.querySelector('.hints-layer');
        this.cellSize = 0;
        this.offset = { x: 40, y: 40 };
        this.islandRadius = 22;
        this.setupViewBox();
    }

    setupViewBox() {
        const size = this.gameState.gridSize;
        const padding = 40;
        const availableSize = 500 - padding * 2;
        this.cellSize = availableSize / (size - 1);
    }

    gridToPixel(row, col) {
        return { x: this.offset.x + col * this.cellSize, y: this.offset.y + row * this.cellSize };
    }

    clear() {
        this.bridgesLayer.innerHTML = '';
        this.hintsLayer.innerHTML = '';
        this.islandsLayer.innerHTML = '';
    }

    render(validator) {
        this.clear();
        this.renderBridges(validator);
        this.renderHints();
        this.renderIslands(validator);
    }

    renderBridges(validator) {
        const errors = validator.getErrorStates();
        this.gameState.bridges.forEach(bridge => {
            const fromIsland = this.gameState.getIsland(bridge.fromKey);
            const toIsland = this.gameState.getIsland(bridge.toKey);
            const from = this.gridToPixel(fromIsland.row, fromIsland.col);
            const to = this.gridToPixel(toIsland.row, toIsland.col);
            const isError = errors.has(bridge.fromKey) || errors.has(bridge.toKey);
            if (bridge.count === 1) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', from.x); line.setAttribute('y1', from.y);
                line.setAttribute('x2', to.x); line.setAttribute('y2', to.y);
                line.setAttribute('class', isError ? 'bridge error' : 'bridge');
                this.bridgesLayer.appendChild(line);
            } else {
                const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                group.setAttribute('class', isError ? 'bridge double error' : 'bridge double');
                const dx = (to.x - from.x) / Math.sqrt((to.x - from.x) ** 2 + (to.y - from.y) ** 2) * 6;
                const dy = (to.y - from.y) / Math.sqrt((to.x - from.x) ** 2 + (to.y - from.y) ** 2) * 6;
                const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line1.setAttribute('x1', from.x + dx); line1.setAttribute('y1', from.y + dy);
                line1.setAttribute('x2', to.x + dx); line1.setAttribute('y2', to.y + dy);
                const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line2.setAttribute('x1', from.x - dx); line2.setAttribute('y1', from.y - dy);
                line2.setAttribute('x2', to.x - dx); line2.setAttribute('y2', to.y - dy);
                group.appendChild(line1); group.appendChild(line2);
                this.bridgesLayer.appendChild(group);
            }
        });
    }

    renderHints() {
        if (!this.gameState.selectedIsland) return;
        const selectedIsland = this.gameState.getIsland(this.gameState.selectedIsland);
        const from = this.gridToPixel(selectedIsland.row, selectedIsland.col);

        // Show hints for all connectable islands (same row/col, no islands between)
        this.gameState.islands.forEach((island, key) => {
            if (key === this.gameState.selectedIsland) return;

            // Check if connectable
            const canConnect = areAdjacent(selectedIsland, island, this.gameState);
            if (canConnect) {
                const to = this.gridToPixel(island.row, island.col);
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', from.x); line.setAttribute('y1', from.y);
                line.setAttribute('x2', to.x); line.setAttribute('y2', to.y);
                line.setAttribute('class', 'hint-line');
                this.hintsLayer.appendChild(line);
            }
        });
    }

    renderIslands(validator) {
        const errors = validator.getErrorStates();
        const satisfied = validator.getSatisfiedIslands();
        const selectedKey = this.gameState.selectedIsland;
        this.gameState.islands.forEach((island, key) => {
            const pos = this.gridToPixel(island.row, island.col);
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.setAttribute('class', 'island');
            group.setAttribute('data-key', key);
            let stateClass = '';
            if (errors.has(key)) stateClass = 'error';
            else if (satisfied.has(key)) stateClass = 'satisfied';
            else if (key === selectedKey) stateClass = 'selected';
            if (stateClass) group.classList.add(stateClass);
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', pos.x); circle.setAttribute('cy', pos.y);
            circle.setAttribute('r', this.islandRadius);
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', pos.x); text.setAttribute('y', pos.y);
            text.textContent = island.target;
            group.appendChild(circle); group.appendChild(text);
            // Let click bubble naturally to SVG where main.js handles it
            this.islandsLayer.appendChild(group);
        });
    }

    updateStats() {
        document.getElementById('movesCount').textContent = this.gameState.moves;
        const elapsed = this.gameState.getElapsedTime();
        document.getElementById('timer').textContent = formatTime(elapsed);
    }
}
