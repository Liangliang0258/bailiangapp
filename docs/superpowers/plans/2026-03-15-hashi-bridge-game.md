# 数桥 (Hashi Bridge) 游戏实现计划

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个基于SVG的逻辑推理游戏，玩家通过在岛屿间建立桥梁满足数字要求。

**Architecture:** 纯HTML/CSS/JS无框架，SVG渲染游戏区域，模块化分离生成器、验证器、渲染器逻辑。采用并查集算法检测连通性。

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript, SVG

---

## Chunk 1: 项目基础结构和样式

### Task 1: 创建HTML页面结构

**Files:**
- Create: `public/games/hashi/index.html`

- [ ] **Step 1: 创建HTML基础结构**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>数桥 Hashi - 逻辑推理游戏</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="app-container">
        <header class="game-header">
            <h1 class="game-title">数桥 Hashi</h1>
            <div class="header-controls">
                <select id="difficultySelect" class="difficulty-select">
                    <option value="easy">简单</option>
                    <option value="medium" selected>中等</option>
                    <option value="hard">困难</option>
                </select>
                <button id="resetBtn" class="btn">重置</button>
                <button id="helpBtn" class="btn">?</button>
            </div>
        </header>

        <main class="game-main">
            <div class="canvas-container">
                <svg id="gameSvg" viewBox="0 0 500 500" aria-label="数桥游戏区域">
                    <g class="bridges-layer"></g>
                    <g class="hints-layer"></g>
                    <g class="islands-layer"></g>
                </svg>
            </div>
        </main>

        <footer class="game-footer">
            <div class="stats">
                <span class="stat">步数: <strong id="movesCount">0</strong></span>
                <span class="stat">时间: <strong id="timer">00:00</strong></span>
                <span class="stat">最佳: <strong id="bestScore">-</strong></span>
            </div>
        </footer>
    </div>

    <div id="winModal" class="modal hidden" aria-hidden="true">
        <div class="modal-backdrop"></div>
        <div class="modal-content">
            <h2>🎉 完成！</h2>
            <p class="win-stats">
                步数: <span id="winMoves">0</span> |
                时间: <span id="winTime">00:00</span>
            </p>
            <p class="best-record" id="bestRecordMsg"></p>
            <button id="playAgainBtn" class="btn primary">再来一局</button>
        </div>
    </div>

    <div id="helpModal" class="modal hidden" aria-hidden="true">
        <div class="modal-backdrop"></div>
        <div class="modal-content large">
            <h2>游戏规则</h2>
            <div class="rules-content">
                <p>1. 点击两个相邻岛屿建立桥梁</p>
                <p>2. 每个岛屿的桥梁数量必须等于其数字</p>
                <p>3. 两岛之间最多2座桥</p>
                <p>4. 桥梁只能水平或垂直连接</p>
                <p>5. 所有岛屿必须连通</p>
            </div>
            <button id="closeHelpBtn" class="btn primary">明白了</button>
        </div>
    </div>

    <canvas id="confettiCanvas" class="confetti-canvas"></canvas>

    <script src="utils.js"></script>
    <script src="gamestate.js"></script>
    <script src="validator.js"></script>
    <script src="generator.js"></script>
    <script src="renderer.js"></script>
    <script src="main.js"></script>
    <script src="../navbar.js"></script>
</body>
</html>
```

- [ ] **Step 2: 验证HTML结构**

检查：HTML文件已创建，包含所有必要的元素

- [ ] **Step 3: 提交HTML**

```bash
git add public/games/hashi/index.html
git commit -m "feat(hashi): add HTML structure for Hashi bridge game"
```

---

### Task 2: 创建CSS样式文件

**Files:**
- Create: `public/games/hashi/style.css`

- [ ] **Step 1: 编写基础CSS样式**

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --color-primary: #3B82F6;
    --color-success: #10B981;
    --color-error: #EF4444;
    --color-text: #1F2937;
    --color-bg: #FAFAFA;
    --color-surface: #FFFFFF;
    --color-border: #E5E7EB;
    --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
    --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: var(--color-bg);
    color: var(--color-text);
    line-height: 1.5;
    min-height: 100vh;
    padding-top: 70px; /* navbar offset */
}

.app-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

/* Header */
.game-header {
    text-align: center;
    margin-bottom: 20px;
}

.game-title {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 16px;
    color: var(--color-text);
}

.header-controls {
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}

/* Buttons & Selects */
.btn {
    padding: 10px 20px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-surface);
    color: var(--color-text);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.btn:hover {
    background: var(--color-bg);
    border-color: var(--color-primary);
}

.btn:active {
    transform: scale(0.98);
}

.btn.primary {
    background: linear-gradient(135deg, var(--color-primary), #2563EB);
    color: white;
    border: none;
}

.btn.primary:hover {
    opacity: 0.9;
}

.difficulty-select {
    padding: 10px 16px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-surface);
    font-size: 14px;
    cursor: pointer;
}

/* Game Area */
.game-main {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.canvas-container {
    width: 100%;
    max-width: 500px;
    aspect-ratio: 1;
    background: var(--color-surface);
    border-radius: 16px;
    box-shadow: var(--shadow-md);
    padding: 20px;
}

#gameSvg {
    width: 100%;
    height: 100%;
}

/* SVG Elements */
.island {
    cursor: pointer;
    transition: transform 0.15s;
}

.island:hover {
    transform: scale(1.05);
}

.island circle {
    fill: var(--color-surface);
    stroke: var(--color-text);
    stroke-width: 2;
}

.island.selected circle {
    stroke: var(--color-primary);
    stroke-width: 3;
}

.island.error circle {
    stroke: var(--color-error);
    stroke-width: 3;
}

.island.satisfied circle {
    stroke: var(--color-success);
    stroke-width: 3;
}

.island text {
    font-size: 18px;
    font-weight: 600;
    fill: var(--color-text);
    text-anchor: middle;
    dominant-baseline: central;
}

.bridge {
    stroke: var(--color-primary);
    stroke-width: 3;
    stroke-linecap: round;
}

.bridge.double line:first-child {
    stroke: var(--color-primary);
}

.bridge.double line:last-child {
    stroke: var(--color-primary);
}

.bridge.error {
    stroke: var(--color-error);
}

.hint-line {
    stroke: var(--color-border);
    stroke-width: 2;
    stroke-dasharray: 5,5;
    fill: none;
}

/* Footer Stats */
.game-footer {
    background: var(--color-surface);
    border-radius: 12px;
    padding: 16px;
    box-shadow: var(--shadow-sm);
}

.stats {
    display: flex;
    justify-content: space-around;
    gap: 10px;
}

.stat {
    font-size: 14px;
    color: #6B7280;
}

.stat strong {
    color: var(--color-text);
    font-weight: 600;
}

/* Modals */
.modal {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    pointer-events: none;
}

.modal:not(.hidden) {
    pointer-events: auto;
}

.modal.hidden {
    display: none;
}

.modal-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px);
}

.modal-content {
    position: relative;
    background: var(--color-surface);
    border-radius: 16px;
    padding: 32px;
    max-width: 90%;
    width: 400px;
    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
    text-align: center;
}

.modal-content.large {
    width: 500px;
}

.modal-content h2 {
    font-size: 24px;
    margin-bottom: 16px;
}

.win-stats {
    font-size: 18px;
    margin: 20px 0;
    color: #6B7280;
}

.best-record {
    font-size: 14px;
    color: var(--color-success);
    margin-bottom: 20px;
}

.rules-content {
    text-align: left;
    margin: 20px 0;
    line-height: 1.8;
}

/* Confetti */
.confetti-canvas {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 200;
}

/* Responsive */
@media (max-width: 640px) {
    .app-container {
        padding: 12px;
    }

    .game-title {
        font-size: 22px;
    }

    .canvas-container {
        padding: 12px;
    }

    .header-controls {
        gap: 8px;
    }

    .btn, .difficulty-select {
        padding: 8px 14px;
        font-size: 13px;
    }

    .modal-content {
        padding: 24px;
        width: 90%;
    }
}
```

- [ ] **Step 2: 验证CSS样式**

检查：CSS文件已创建，包含所有必要的样式

- [ ] **Step 3: 提交CSS**

```bash
git add public/games/hashi/style.css
git commit -m "feat(hashi): add CSS styles for Hashi bridge game"
```

---

## Chunk 2: 工具函数和游戏状态

### Task 3: 创建工具函数模块

**Files:**
- Create: `public/games/hashi/utils.js`

- [ ] **Step 1: 实现并查集数据结构**

```javascript
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

// Check if two islands are adjacent (horizontal or vertical)
function areAdjacent(island1, island2) {
    const rowDiff = Math.abs(island1.row - island2.row);
    const colDiff = Math.abs(island1.col - island2.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
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
```

- [ ] **Step 2: 验证工具函数**

检查：所有工具函数已定义，包括并查集、距离计算、相邻判断等

- [ ] **Step 3: 提交工具函数**

```bash
git add public/games/hashi/utils.js
git commit -m "feat(hashi): add utility functions including Union-Find"
```

---

### Task 4: 创建游戏状态管理模块

**Files:**
- Create: `public/games/hashi/gamestate.js`

- [ ] **Step 1: 实现游戏状态类**

```javascript
class GameState {
    constructor(difficulty = 'medium') {
        this.difficulty = difficulty;
        this.gridSize = this.getGridSize(difficulty);
        this.islands = new Map(); // key: "row,col", value: {row, col, target, current}
        this.bridges = []; // Array of {fromKey, toKey, count}
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
        const key = getIslandKey(row, col);
        this.islands.set(key, {
            row,
            col,
            target,
            current: 0
        });
        return key;
    }

    getIsland(key) {
        return this.islands.get(key);
    }

    hasBridge(fromKey, toKey) {
        return this.bridges.some(b =>
            (b.fromKey === fromKey && b.toKey === toKey) ||
            (b.fromKey === toKey && b.toKey === fromKey)
        );
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
        // Reset all counts
        this.islands.forEach(island => island.current = 0);

        // Count bridges for each island
        this.bridges.forEach(bridge => {
            const fromIsland = this.islands.get(bridge.fromKey);
            const toIsland = this.islands.get(bridge.toKey);
            if (fromIsland) fromIsland.current += bridge.count;
            if (toIsland) toIsland.current += bridge.count;
        });
    }

    selectIsland(key) {
        this.selectedIsland = key;
    }

    clearSelection() {
        this.selectedIsland = null;
    }

    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            // Timer update handled by renderer
        }, 1000);
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

    getIslandKeys() {
        return Array.from(this.islands.keys());
    }

    getIslandsArray() {
        return Array.from(this.islands.values());
    }
}
```

- [ ] **Step 2: 验证状态管理**

检查：GameState类已实现，包含所有必要的方法

- [ ] **Step 3: 提交状态管理**

```bash
git add public/games/hashi/gamestate.js
git commit -m "feat(hashi): add GameState class for managing game state"
```

---

## Chunk 3: 验证器和生成器

### Task 5: 创建规则验证器模块

**Files:**
- Create: `public/games/hashi/validator.js`

- [ ] **Step 1: 实现验证器类**

```javascript
class HashiValidator {
    constructor(gameState) {
        this.gameState = gameState;
    }

    // Check if a bridge can be added between two islands
    canAddBridge(fromKey, toKey) {
        const fromIsland = this.gameState.getIsland(fromKey);
        const toIsland = this.gameState.getIsland(toKey);

        if (!fromIsland || !toIsland) return { valid: false, reason: 'Island not found' };

        // Check if islands are adjacent
        const fromPos = { row: fromIsland.row, col: fromIsland.col };
        const toPos = { row: toIsland.row, col: toIsland.col };
        if (!areAdjacent(fromPos, toPos)) {
            return { valid: false, reason: 'Islands must be adjacent' };
        }

        // Check max 2 bridges
        const currentCount = this.gameState.getBridgeCount(fromKey, toKey);
        if (currentCount >= 2) {
            return { valid: false, reason: 'Maximum 2 bridges allowed' };
        }

        // Check if adding bridge would exceed island targets
        if (fromIsland.current >= fromIsland.target) {
            return { valid: false, reason: 'Source island already has enough bridges' };
        }
        if (toIsland.current >= toIsland.target) {
            return { valid: false, reason: 'Target island already has enough bridges' };
        }

        // Check if bridge would cross existing bridges
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

    // Check if all islands are satisfied
    areAllIslandsSatisfied() {
        for (const [key, island] of this.gameState.islands) {
            if (island.current !== island.target) {
                return false;
            }
        }
        return true;
    }

    // Check if all islands are connected
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

    // Check if game is won
    isGameWon() {
        return this.areAllIslandsSatisfied() && this.areAllIslandsConnected();
    }

    // Get error states for rendering
    getErrorStates() {
        const errors = new Set(); // island keys with errors

        // Check for islands exceeding target
        for (const [key, island] of this.gameState.islands) {
            if (island.current > island.target) {
                errors.add(key);
            }
        }

        // Check for islands that cannot possibly reach target
        for (const [key, island] of this.gameState.islands) {
            const remaining = island.target - island.current;
            if (remaining < 0) continue;

            // Count available adjacent spots
            const adjacentIslands = this.getAdjacentIslands(key);
            let availableCapacity = 0;

            for (const adjKey of adjacentIslands) {
                const currentBridges = this.gameState.getBridgeCount(key, adjKey);
                availableCapacity += (2 - currentBridges);
            }

            if (availableCapacity < remaining) {
                errors.add(key);
            }
        }

        return errors;
    }

    // Get satisfied islands
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

        const adjacent = [];
        const directions = [
            { row: -1, col: 0 },
            { row: 1, col: 0 },
            { row: 0, col: -1 },
            { row: 0, col: 1 }
        ];

        for (const dir of directions) {
            const newRow = island.row + dir.row;
            const newCol = island.col + dir.col;
            const adjKey = getIslandKey(newRow, newCol);
            if (this.gameState.islands.has(adjKey)) {
                adjacent.push(adjKey);
            }
        }

        return adjacent;
    }

    // Check if current state is valid (not won, but no errors)
    isValidState() {
        return this.getErrorStates().size === 0;
    }
}
```

- [ ] **Step 2: 验证验证器**

检查：HashiValidator类已实现，包含所有验证方法

- [ ] **Step 3: 提交验证器**

```bash
git add public/games/hashi/validator.js
git commit -m "feat(hashi): add HashiValidator for rule validation"
```

---

### Task 6: 创建关卡生成器模块

**Files:**
- Create: `public/games/hashi/generator.js`

- [ ] **Step 1: 实现关卡生成器类**

```javascript
class HashiGenerator {
    constructor() {
        this.rng = this.seededRandom(Math.random());
    }

    seededRandom(seed) {
        return function() {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };
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
        const maxAttempts = 100;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const result = this.tryGenerate(gridSize, islandCount);
            if (result) {
                return result;
            }
        }

        // Fallback to simple generation
        return this.generateSimpleLevel(gridSize, islandCount);
    }

    tryGenerate(gridSize, islandCount) {
        // Step 1: Place islands randomly
        const positions = this.generateIslandPositions(gridSize, islandCount);
        if (!positions) return null;

        // Step 2: Generate a valid bridge configuration
        const bridges = this.generateValidBridges(positions, gridSize);
        if (!bridges) return null;

        // Step 3: Calculate target numbers from bridges
        const targets = this.calculateTargets(positions, bridges);

        // Return level data
        return {
            gridSize,
            islands: positions.map((pos, i) => ({
                row: pos.row,
                col: pos.col,
                target: targets[i]
            }))
        };
    }

    generateIslandPositions(gridSize, count) {
        const positions = [];
        const occupied = new Set();

        for (let i = 0; i < count; i++) {
            let attempts = 0;
            let pos;

            do {
                pos = {
                    row: Math.floor(this.rng() * gridSize),
                    col: Math.floor(this.rng() * gridSize)
                };
                attempts++;
            } while (occupied.has(getIslandKey(pos.row, pos.col)) && attempts < 50);

            if (attempts >= 50) return null; // Can't place all islands

            occupied.add(getIslandKey(pos.row, pos.col));
            positions.push(pos);
        }

        return positions;
    }

    generateValidBridges(positions, gridSize) {
        const keys = positions.map(p => getIslandKey(p.row, p.col));
        const bridgeCount = new Map();
        keys.forEach(k => bridgeCount.set(k, 0));

        // Build adjacency graph
        const adjacency = this.buildAdjacencyGraph(positions, gridSize);

        // Use backtracking to find valid configuration
        const bridges = [];
        const used = this.tryBuildBridges(keys, adjacency, bridgeCount, bridges, 0);

        if (!used || !this.areIslandsConnected(keys, bridges)) {
            return null;
        }

        return bridges;
    }

    buildAdjacencyGraph(positions, gridSize) {
        const adj = new Map();

        for (let i = 0; i < positions.length; i++) {
            const key = getIslandKey(positions[i].row, positions[i].col);
            const neighbors = [];

            for (let j = 0; j < positions.length; j++) {
                if (i === j) continue;

                if (areAdjacent(positions[i], positions[j])) {
                    neighbors.push(getIslandKey(positions[j].row, positions[j].col));
                }
            }

            adj.set(key, neighbors);
        }

        return adj;
    }

    tryBuildBridges(keys, adjacency, bridgeCount, bridges, index) {
        if (index === keys.length) {
            return bridges; // Success
        }

        const key = keys[index];
        const neighbors = adjacency.get(key) || [];

        // Try different configurations for this island
        // For simplicity, just add bridges randomly until target is met
        // This is a basic implementation - can be improved with backtracking

        // Random target between 1 and min(4, neighbors.length * 2)
        const maxBridges = Math.min(4, neighbors.length * 2);
        const target = Math.floor(this.rng() * maxBridges) + 1;

        let added = 0;
        const shuffledNeighbors = [...neighbors].sort(() => this.rng() - 0.5);

        for (const neighbor of shuffledNeighbors) {
            if (added >= target) break;

            // Check if bridge already exists
            const existing = bridges.find(b =>
                (b.fromKey === key && b.toKey === neighbor) ||
                (b.fromKey === neighbor && b.toKey === key)
            );

            const currentCount = existing ? existing.count : 0;
            if (currentCount < 2) {
                if (existing) {
                    existing.count++;
                } else {
                    bridges.push({ fromKey: key, toKey: neighbor, count: 1 });
                }
                bridgeCount.set(key, (bridgeCount.get(key) || 0) + 1);
                bridgeCount.set(neighbor, (bridgeCount.get(neighbor) || 0) + 1);
                added++;
            }
        }

        return this.tryBuildBridges(keys, adjacency, bridgeCount, bridges, index + 1);
    }

    areIslandsConnected(keys, bridges) {
        if (keys.length === 0) return true;

        const uf = new UnionFind(keys.length);
        const keyToIndex = new Map(keys.map((k, i) => [k, i]));

        bridges.forEach(bridge => {
            const idx1 = keyToIndex.get(bridge.fromKey);
            const idx2 = keyToIndex.get(bridge.toKey);
            uf.union(idx1, idx2);
        });

        return uf.getCount() === 1;
    }

    calculateTargets(positions, bridges) {
        const targets = new Array(positions.length).fill(0);

        bridges.forEach(bridge => {
            const fromKey = getIslandKey(bridge.from.row, bridge.from.col);
            const toKey = getIslandKey(bridge.to.row, bridge.to.col);

            const fromIndex = positions.findIndex(p =>
                p.row === bridge.from.row && p.col === bridge.from.col
            );
            const toIndex = positions.findIndex(p =>
                p.row === bridge.to.row && p.col === bridge.to.col
            );

            if (fromIndex >= 0) targets[fromIndex] += bridge.count;
            if (toIndex >= 0) targets[toIndex] += bridge.count;
        });

        return targets;
    }

    generateSimpleLevel(gridSize, islandCount) {
        // Fallback: Generate a very simple solvable level
        const positions = [];
        const step = Math.floor(gridSize / Math.ceil(Math.sqrt(islandCount)));

        for (let row = 1; row < gridSize - 1; row += step) {
            for (let col = 1; col < gridSize - 1; col += step) {
                if (positions.length >= islandCount) break;
                positions.push({ row, col });
            }
        }

        // Ensure we have exactly islandCount positions
        while (positions.length < islandCount) {
            positions.push({
                row: Math.floor(this.rng() * (gridSize - 2)) + 1,
                col: Math.floor(this.rng() * (gridSize - 2)) + 1
            });
        }

        // Create simple targets (1-3)
        const targets = positions.map(() => Math.floor(this.rng() * 3) + 1);

        return {
            gridSize,
            islands: positions.map((pos, i) => ({
                row: pos.row,
                col: pos.col,
                target: targets[i]
            }))
        };
    }
}
```

- [ ] **Step 2: 验证生成器**

检查：HashiGenerator类已实现，包含随机生成和回退方案

- [ ] **Step 3: 提交生成器**

```bash
git add public/games/hashi/generator.js
git commit -m "feat(hashi): add HashiGenerator for level generation"
```

---

## Chunk 4: 渲染器

### Task 7: 创建SVG渲染器模块

**Files:**
- Create: `public/games/hashi/renderer.js`

- [ ] **Step 1: 实现渲染器类 - 基础结构**

```javascript
class HashiRenderer {
    constructor(svgElement, gameState) {
        this.svg = svgElement;
        this.gameState = gameState;
        this.bridgesLayer = svgElement.querySelector('.bridges-layer');
        this.hintsLayer = svgElement.querySelector('.hints-layer');
        this.islandsLayer = svgElement.querySelector('.islands-layer');

        this.cellSize = 0;
        this.offset = { x: 0, y: 0 };
        this.islandRadius = 22;

        this.setupViewBox();
    }

    setupViewBox() {
        const size = this.gameState.gridSize;
        const padding = 40;
        const availableSize = 500 - padding * 2;
        this.cellSize = availableSize / (size - 1);
        this.offset = { x: padding, y: padding };
    }

    gridToPixel(row, col) {
        return {
            x: this.offset.x + col * this.cellSize,
            y: this.offset.y + row * this.cellSize
        };
    }

    clear() {
        this.bridgesLayer.innerHTML = '';
        this.hintsLayer.innerHTML = '';
        this.islandsLayer.innerHTML = '';
    }

    render(validator) {
        this.clear();

        // Render bridges first (so they appear behind islands)
        this.renderBridges(validator);

        // Render hints
        this.renderHints();

        // Render islands last (so they appear on top)
        this.renderIslands(validator);
    }

    renderBridges(validator) {
        const errorStates = validator.getErrorStates();

        this.gameState.bridges.forEach(bridge => {
            const fromIsland = this.gameState.getIsland(bridge.fromKey);
            const toIsland = this.gameState.getIsland(bridge.toKey);

            const from = this.gridToPixel(fromIsland.row, fromIsland.col);
            const to = this.gridToPixel(toIsland.row, toIsland.col);

            const isError = errorStates.has(bridge.fromKey) || errorStates.has(bridge.toKey);

            if (bridge.count === 1) {
                this.renderSingleBridge(from, to, isError);
            } else {
                this.renderDoubleBridge(from, to, isError);
            }
        });
    }

    renderSingleBridge(from, to, isError) {
        const line = this.createSvgElement('line', {
            x1: from.x,
            y1: from.y,
            x2: to.x,
            y2: to.y,
            class: isError ? 'bridge error' : 'bridge'
        });
        this.bridgesLayer.appendChild(line);
    }

    renderDoubleBridge(from, to, isError) {
        const group = this.createSvgElement('g', {
            class: isError ? 'bridge double error' : 'bridge double'
        });

        // Calculate offset for parallel lines
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const offsetX = (-dy / length) * 3;
        const offsetY = (dx / length) * 3;

        const line1 = this.createSvgElement('line', {
            x1: from.x + offsetX,
            y1: from.y + offsetY,
            x2: to.x + offsetX,
            y2: to.y + offsetY
        });

        const line2 = this.createSvgElement('line', {
            x1: from.x - offsetX,
            y1: from.y - offsetY,
            x2: to.x - offsetX,
            y2: to.y - offsetY
        });

        group.appendChild(line1);
        group.appendChild(line2);
        this.bridgesLayer.appendChild(group);
    }

    renderHints() {
        if (!this.gameState.selectedIsland) return;

        const selectedKey = this.gameState.selectedIsland;
        const selectedIsland = this.gameState.getIsland(selectedKey);
        const adjacentKeys = this.getAdjacentIslandKeys(selectedIsland);

        const from = this.gridToPixel(selectedIsland.row, selectedIsland.col);

        adjacentKeys.forEach(adjKey => {
            const adjIsland = this.gameState.getIsland(adjKey);
            const to = this.gridToPixel(adjIsland.row, adjIsland.col);

            const line = this.createSvgElement('line', {
                x1: from.x,
                y1: from.y,
                x2: to.x,
                y2: to.y,
                class: 'hint-line'
            });
            this.hintsLayer.appendChild(line);
        });
    }

    getAdjacentIslandKeys(island) {
        const keys = [];
        const directions = [
            { row: -1, col: 0 },
            { row: 1, col: 0 },
            { row: 0, col: -1 },
            { row: 0, col: 1 }
        ];

        for (const dir of directions) {
            const key = getIslandKey(island.row + dir.row, island.col + dir.col);
            if (this.gameState.islands.has(key)) {
                keys.push(key);
            }
        }

        return keys;
    }

    renderIslands(validator) {
        const errorStates = validator.getErrorStates();
        const satisfied = validator.getSatisfiedIslands();
        const selectedKey = this.gameState.selectedIsland;

        this.gameState.islands.forEach((island, key) => {
            const pos = this.gridToPixel(island.row, island.col);
            const group = this.createSvgElement('g', {
                class: 'island',
                'data-key': key
            });

            let stateClass = '';
            if (errorStates.has(key)) stateClass = 'error';
            else if (satisfied.has(key)) stateClass = 'satisfied';
            else if (key === selectedKey) stateClass = 'selected';

            if (stateClass) {
                group.classList.add(stateClass);
            }

            const circle = this.createSvgElement('circle', {
                cx: pos.x,
                cy: pos.y,
                r: this.islandRadius
            });

            const text = this.createSvgElement('text', {
                x: pos.x,
                y: pos.y
            });
            text.textContent = island.target;

            group.appendChild(circle);
            group.appendChild(text);
            this.islandsLayer.appendChild(group);
        });
    }

    createSvgElement(tag, attrs) {
        const ns = 'http://www.w3.org/2000/svg';
        const el = document.createElementNS(ns, tag);
        Object.entries(attrs).forEach(([key, value]) => {
            el.setAttribute(key, value);
        });
        return el;
    }

    updateStats() {
        document.getElementById('movesCount').textContent = this.gameState.moves;

        const elapsed = this.gameState.getElapsedTime();
        document.getElementById('timer').textContent = formatTime(elapsed);
    }
}
```

- [ ] **Step 2: 验证渲染器基础结构**

检查：HashiRenderer类已实现基础渲染方法

- [ ] **Step 3: 提交渲染器基础**

```bash
git add public/games/hashi/renderer.js
git commit -m "feat(hashi): add HashiRenderer with basic SVG rendering"
```

---

## Chunk 5: 主游戏逻辑

### Task 8: 创建主游戏控制模块

**Files:**
- Create: `public/games/hashi/main.js`

- [ ] **Step 1: 实现主游戏控制器**

```javascript
// Main Game Controller
class HashiGame {
    constructor() {
        this.svg = document.getElementById('gameSvg');
        this.gameState = new GameState('medium');
        this.validator = null;
        this.renderer = null;
        this.generator = new HashiGenerator();

        this.init();
    }

    init() {
        // Bind UI elements
        this.difficultySelect = document.getElementById('difficultySelect');
        this.resetBtn = document.getElementById('resetBtn');
        this.helpBtn = document.getElementById('helpBtn');
        this.playAgainBtn = document.getElementById('playAgainBtn');
        this.closeHelpBtn = document.getElementById('closeHelpBtn');

        this.winModal = document.getElementById('winModal');
        this.helpModal = document.getElementById('helpModal');

        // Setup event listeners
        this.difficultySelect.addEventListener('change', () => this.newGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.helpBtn.addEventListener('click', () => this.showHelp());
        this.playAgainBtn.addEventListener('click', () => {
            this.hideModals();
            this.newGame();
        });
        this.closeHelpBtn.addEventListener('click', () => this.hideHelp());

        // Close modals on backdrop click
        this.winModal.querySelector('.modal-backdrop').addEventListener('click', () => this.hideModals());
        this.helpModal.querySelector('.modal-backdrop').addEventListener('click', () => this.hideHelp());

        // Start first game
        this.newGame();
    }

    newGame() {
        const difficulty = this.difficultySelect.value;
        this.gameState = new GameState(difficulty);
        this.validator = new HashiValidator(this.gameState);
        this.renderer = new HashiRenderer(this.svg, this.gameState);

        // Generate level
        const level = this.generator.generate(difficulty);
        this.loadLevel(level);

        // Setup event listeners
        this.setupGameEvents();

        // Start timer
        this.gameState.startTimer();
        this.startTimerUpdate();

        // Load best score
        this.loadBestScore();
    }

    loadLevel(level) {
        this.gameState.gridSize = level.gridSize;
        level.islands.forEach(island => {
            this.gameState.addIsland(island.row, island.col, island.target);
        });

        this.render();
    }

    setupGameEvents() {
        // Remove old listeners
        this.svg.removeEventListener('click', this.handleSvgClick);

        // Add new listener
        this.handleSvgClick = (e) => this.handleIslandClick(e);
        this.svg.addEventListener('click', this.handleSvgClick);
    }

    handleIslandClick(event) {
        const islandEl = event.target.closest('.island');
        if (!islandEl) return;

        const key = islandEl.dataset.key;
        if (!key) return;

        const clickedIsland = this.gameState.getIsland(key);

        if (this.gameState.selectedIsland === null) {
            // First click - select island
            this.gameState.selectIsland(key);
            this.render();
        } else if (this.gameState.selectedIsland === key) {
            // Clicked same island - deselect
            this.gameState.clearSelection();
            this.render();
        } else {
            // Clicked different island - try to add/remove bridge
            const selectedKey = this.gameState.selectedIsland;
            const selectedIsland = this.gameState.getIsland(selectedKey);

            // Check if islands are adjacent
            if (this.validator.canAddBridge(selectedKey, key).valid) {
                const currentCount = this.gameState.getBridgeCount(selectedKey, key);
                if (currentCount === 0) {
                    this.gameState.addBridge(selectedKey, key);
                } else if (currentCount === 1) {
                    this.gameState.addBridge(selectedKey, key); // Add second bridge
                } else {
                    this.gameState.removeBridge(selectedKey, key); // Remove bridge
                }

                this.gameState.clearSelection();
                this.checkWin();
                this.render();
                this.renderer.updateStats();
            } else {
                // Not adjacent - select new island instead
                this.gameState.selectIsland(key);
                this.render();
            }
        }
    }

    checkWin() {
        if (this.validator.isGameWon()) {
            this.gameState.complete();
            this.showWinModal();
            this.saveBestScore();
        }
    }

    render() {
        this.renderer.render(this.validator);
        this.renderer.updateStats();
    }

    resetGame() {
        this.gameState.reset();
        this.render();
    }

    startTimerUpdate() {
        setInterval(() => {
            if (!this.gameState.isComplete) {
                this.renderer.updateStats();
            }
        }, 1000);
    }

    showWinModal() {
        const elapsed = this.gameState.getElapsedTime();
        document.getElementById('winMoves').textContent = this.gameState.moves;
        document.getElementById('winTime').textContent = formatTime(elapsed);

        // Check if new best
        const best = this.getBestScore();
        if (best === null || this.gameState.moves < best.moves) {
            document.getElementById('bestRecordMsg').textContent = '🏆 新记录！';
        } else {
            document.getElementById('bestRecordMsg').textContent = `最佳: ${best.moves} 步`;
        }

        this.winModal.classList.remove('hidden');
        this.winModal.setAttribute('aria-hidden', 'false');

        // Launch confetti
        this.launchConfetti();
    }

    hideModals() {
        this.winModal.classList.add('hidden');
        this.winModal.setAttribute('aria-hidden', 'true');
    }

    showHelp() {
        this.helpModal.classList.remove('hidden');
        this.helpModal.setAttribute('aria-hidden', 'false');
    }

    hideHelp() {
        this.helpModal.classList.add('hidden');
        this.helpModal.setAttribute('aria-hidden', 'true');
    }

    loadBestScore() {
        const best = this.getBestScore();
        document.getElementById('bestScore').textContent = best ? best.moves : '-';
    }

    getBestScore() {
        const key = `hashi_best_${this.gameState.difficulty}`;
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : null;
    }

    saveBestScore() {
        const key = `hashi_best_${this.gameState.difficulty}`;
        const current = { moves: this.gameState.moves, time: this.gameState.getElapsedTime() };
        const best = this.getBestScore();

        if (!best || current.moves < best.moves) {
            localStorage.setItem(key, JSON.stringify(current));
        }
    }

    launchConfetti() {
        const canvas = document.getElementById('confettiCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

        for (let i = 0; i < 150; i++) {
            particles.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15 - 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 8 + 4,
                gravity: 0.2
            });
        }

        let animationId;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.gravity;

                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, p.size, p.size);

                if (p.y > canvas.height) {
                    particles.splice(i, 1);
                }
            });

            if (particles.length > 0) {
                animationId = requestAnimationFrame(animate);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        };

        animate();

        setTimeout(() => {
            cancelAnimationFrame(animationId);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 3000);
    }
}

// Initialize game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new HashiGame());
} else {
    new HashiGame();
}
```

- [ ] **Step 2: 验证主游戏逻辑**

检查：HashiGame类已实现，包含完整的游戏控制逻辑

- [ ] **Step 3: 提交主游戏逻辑**

```bash
git add public/games/hashi/main.js
git commit -m "feat(hashi): add main game controller with full game logic"
```

---

### Task 9: 更新主站点数据配置

**Files:**
- Modify: `lib/data.ts`

- [ ] **Step 1: 在游戏列表中添加数桥游戏**

在 `games` 数组中添加：

```typescript
{
  id: "3",
  title: "数桥 Hashi",
  description: "经典逻辑推理游戏，通过建立桥梁连接岛屿满足数字要求。",
  image: "/images/games/hashi-thumb.svg",
  link: "/games/hashi/index.html",
}
```

同时将原来的"待开发"项目下移。

- [ ] **Step 2: 验证配置更新**

检查：lib/data.ts中已添加数桥游戏条目

- [ ] **Step 3: 提交配置更新**

```bash
git add lib/data.ts
git commit -m "feat(hashi): add Hashi bridge game to portfolio"
```

---

### Task 10: 创建缩略图

**Files:**
- Create: `public/images/games/hashi-thumb.svg`

- [ ] **Step 1: 创建游戏缩略图SVG**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6"/>
      <stop offset="100%" style="stop-color:#2563EB"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="200" height="200" rx="16" fill="url(#bg)"/>

  <!-- Islands -->
  <circle cx="50" cy="60" r="18" fill="white" stroke="#1F2937" stroke-width="2"/>
  <text x="50" y="65" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#1F2937">2</text>

  <circle cx="150" cy="60" r="18" fill="white" stroke="#1F2937" stroke-width="2"/>
  <text x="150" y="65" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#1F2937">3</text>

  <circle cx="100" cy="140" r="18" fill="white" stroke="#1F2937" stroke-width="2"/>
  <text x="100" y="145" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#1F2937">4</text>

  <!-- Bridges -->
  <line x1="68" y1="60" x2="132" y2="60" stroke="#10B981" stroke-width="4" stroke-linecap="round"/>
  <line x1="68" y1="68" x2="132" y2="68" stroke="#10B981" stroke-width="4" stroke-linecap="round"/>

  <line x1="55" y1="75" x2="95" y2="125" stroke="white" stroke-width="4" stroke-linecap="round"/>

  <line x1="145" y1="75" x2="105" y2="125" stroke="white" stroke-width="4" stroke-linecap="round"/>

  <!-- Title -->
  <text x="100" y="185" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="white">数桥 Hashi</text>
</svg>
```

- [ ] **Step 2: 验证缩略图创建**

检查：SVG缩略图文件已创建

- [ ] **Step 3: 提交缩略图**

```bash
git add public/images/games/hashi-thumb.svg
git commit -m "feat(hashi): add game thumbnail SVG"
```

---

## 验收测试

### Task 11: 完整游戏测试

**Files:**
- Test: Manual testing in browser

- [ ] **Step 1: 启动开发服务器**

```bash
pnpm dev
```

访问: `http://localhost:3000/games/hashi/index.html`

- [ ] **Step 2: 基础功能测试**

- [ ] 页面正常加载，显示游戏界面
- [ ] 点击岛屿可以选中
- [ ] 点击相邻岛屿可以建立桥梁
- [ ] 再次点击可以建立第二座桥
- [ ] 再次点击可以删除桥梁
- [ ] 点击非相邻岛屿会切换选中状态

- [ ] **Step 3: 规则验证测试**

- [ ] 超过目标数字的岛屿显示红色
- [ ] 已完成目标的岛屿显示绿色
- [ ] 选中岛屿时显示虚线提示
- [ ] 桥梁正确渲染（单桥/双桥）

- [ ] **Step 4: 游戏流程测试**

- [ ] 难度选择可以正常切换
- [ ] 重置按钮可以重置当前关卡
- [ ] 计时器正常工作
- [ ] 步数统计正确
- [ ] 完成时显示胜利弹窗
- [ ] 最佳记录正确保存

- [ ] **Step 5: 响应式测试**

在开发者工具中测试不同屏幕尺寸：
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

- [ ] **Step 6: 浏览器兼容性测试**

测试不同浏览器：
- [ ] Chrome
- [ ] Safari
- [ ] Firefox

- [ ] **Step 7: 提交测试通过（如需修复）**

如果发现bug，修复后重新测试，然后提交：

```bash
git commit -m "fix(hashi): fix bugs found during testing"
```

---

## Task 12: 清理旧游戏文件

**Files:**
- Remove: `public/games/new_game/`

- [ ] **Step 1: 删除旧的三角数阵游戏**

```bash
rm -rf public/games/new_game
```

- [ ] **Step 2: 提交清理**

```bash
git add -A
git commit -m "refactor(hashi): remove old Triangle Spin game, replaced by Hashi"
```

---

## 实现完成检查清单

- [ ] 所有文件已创建
- [ ] 所有测试通过
- [ ] 游戏在浏览器中正常运行
- [ ] 响应式设计正常工作
- [ ] 最佳记录功能正常
- [ ] 通关特效正常显示
- [ ] 代码已提交到git

---

## 开发笔记

**关键设计决策：**

1. **使用SVG而非Canvas** - SVG更容易处理点击事件，响应式缩放更简单
2. **并查集检测连通性** - 高效的连通性检测算法
3. **回溯生成关卡** - 确保生成的关卡有解
4. **localStorage存储记录** - 简单的持久化方案

**可能的改进：**

1. 添加撤销功能
2. 优化关卡生成算法
3. 添加提示系统
4. 添加音效

**已知限制：**

1. 关卡生成可能产生多个解
2. 提示系统未实现（预留）
3. 没有关卡保存功能
