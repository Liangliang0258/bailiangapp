class HashiGame {
    constructor() {
        this.svg = document.getElementById('gameSvg');
        this.gameState = new GameState('medium');
        this.validator = null;
        this.renderer = null;
        this.generator = new HashiGenerator();
        this.timerInterval = null;
        this.init();
    }

    init() {
        this.difficultySelect = document.getElementById('difficultySelect');
        this.resetBtn = document.getElementById('resetBtn');
        this.hintBtn = document.getElementById('hintBtn');
        this.helpBtn = document.getElementById('helpBtn');
        this.playAgainBtn = document.getElementById('playAgainBtn');
        this.closeHelpBtn = document.getElementById('closeHelpBtn');
        this.winModal = document.getElementById('winModal');
        this.helpModal = document.getElementById('helpModal');

        this.difficultySelect.addEventListener('change', () => this.newGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.hintBtn.addEventListener('click', () => this.showHint());
        this.helpBtn.addEventListener('click', () => this.showHelp());
        this.playAgainBtn.addEventListener('click', () => { this.hideModals(); this.newGame(); });
        this.closeHelpBtn.addEventListener('click', () => this.hideHelp());
        this.winModal.querySelector('.modal-backdrop').addEventListener('click', () => this.hideModals());
        this.helpModal.querySelector('.modal-backdrop').addEventListener('click', () => this.hideHelp());

        this.newGame();
    }

    newGame() {
        // Clear existing timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        const difficulty = this.difficultySelect.value;
        this.gameState = new GameState(difficulty);
        this.validator = new HashiValidator(this.gameState);
        this.renderer = new HashiRenderer(this.svg, this.gameState);

        const level = this.generator.generate(difficulty);
        this.loadLevel(level);
        this.setupGameEvents();
        this.gameState.startTimer();
        this.startTimerUpdate();
        this.loadBestScore();
    }

    loadLevel(level) {
        this.gameState.gridSize = level.gridSize;
        this.gameState.solution = level.solution || [];
        console.log('Level loaded with solution:', this.gameState.solution);
        level.islands.forEach(island => {
            this.gameState.addIsland(island.row, island.col, island.target);
        });
        this.render();
    }

    setupGameEvents() {
        this.svg.removeEventListener('click', this.handleSvgClick);
        this.handleSvgClick = (e) => {
            const islandEl = e.target.closest('.island');
            if (!islandEl) return;
            const key = islandEl.dataset.key;
            if (!key) return;
            if (this.gameState.selectedIsland === null) {
                this.gameState.selectIsland(key);
            } else if (this.gameState.selectedIsland === key) {
                this.gameState.clearSelection();
            } else {
                const selectedKey = this.gameState.selectedIsland;
                if (this.validator.canAddBridge(selectedKey, key).valid) {
                    const currentCount = this.gameState.getBridgeCount(selectedKey, key);
                    if (currentCount === 0) this.gameState.addBridge(selectedKey, key);
                    else if (currentCount === 1) this.gameState.addBridge(selectedKey, key);
                    else this.gameState.removeBridge(selectedKey, key);
                    this.gameState.clearSelection();
                    this.checkWin();
                } else {
                    this.gameState.selectIsland(key);
                }
            }
            this.render();
            this.renderer.updateStats();
        };
        this.svg.addEventListener('click', this.handleSvgClick);
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
        this.timerInterval = setInterval(() => {
            if (!this.gameState.isComplete) this.renderer.updateStats();
        }, 1000);
    }

    showWinModal() {
        const elapsed = this.gameState.getElapsedTime();
        document.getElementById('winMoves').textContent = this.gameState.moves;
        document.getElementById('winTime').textContent = formatTime(elapsed);
        const best = this.getBestScore();
        document.getElementById('bestRecordMsg').textContent = (!best || this.gameState.moves < best.moves) ? '🏆 新记录！' : `最佳: ${best.moves} 步`;
        this.winModal.classList.remove('hidden');
        this.winModal.setAttribute('aria-hidden', 'false');
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

    showHint() {
        console.log('showHint called', this.gameState.solution);
        // Directly show the solution without any popup
        if (this.gameState.solution && this.gameState.solution.length > 0) {
            console.log('Loading solution:', this.gameState.solution);
            this.gameState.bridges = [];
            this.gameState.solution.forEach(bridge => {
                this.gameState.bridges.push({
                    fromKey: bridge.fromKey,
                    toKey: bridge.toKey,
                    count: bridge.count
                });
            });
            this.gameState.updateIslandCounts();
            this.gameState.clearSelection();
            this.render();
            this.checkWin();
        } else {
            console.log('No solution found');
        }
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
            particles.push({ x: canvas.width / 2, y: canvas.height / 2, vx: (Math.random() - 0.5) * 15, vy: (Math.random() - 0.5) * 15 - 5, color: colors[Math.floor(Math.random() * colors.length)], size: Math.random() * 8 + 4, gravity: 0.2 });
        }
        let animationId;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, i) => {
                p.x += p.vx; p.y += p.vy; p.vy += p.gravity;
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, p.size, p.size);
                if (p.y > canvas.height) particles.splice(i, 1);
            });
            if (particles.length > 0) animationId = requestAnimationFrame(animate);
            else { ctx.clearRect(0, 0, canvas.width, canvas.height); cancelAnimationFrame(animationId); }
        };
        animate();
        setTimeout(() => { cancelAnimationFrame(animationId); ctx.clearRect(0, 0, canvas.width, canvas.height); }, 3000);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new HashiGame());
} else {
    new HashiGame();
}
