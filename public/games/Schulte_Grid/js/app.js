/**
 * 应用主控制器
 */

class SchulteApp {
    constructor() {
        // DOM元素
        this.gridContainer = document.getElementById('grid');
        this.timerDisplay = document.getElementById('timer');
        this.bestTimeDisplay = document.getElementById('best-time');
        this.gameHint = document.getElementById('game-hint');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.historyBtn = document.getElementById('history-btn');
        this.difficultyBtns = document.querySelectorAll('.difficulty-btn');
        this.historyModal = document.getElementById('history-modal');
        this.completeModal = document.getElementById('complete-modal');
        this.completionTimeDisplay = document.getElementById('completion-time');
        this.completionDifficultyDisplay = document.getElementById('completion-difficulty');
        this.newRecordDisplay = document.getElementById('new-record');

        // 当前设置
        this.currentDifficulty = '4';
        this.currentColumns = 4;
        this.currentRows = 4;

        // 初始化模块
        this.timer = new Timer(this.timerDisplay);
        this.game = null;
        this.currentStartTime = null;

        // 绑定事件
        this.bindEvents();

        // 初始化
        this.init();
    }

    /**
     * 初始化应用
     */
    init() {
        // 初始化音效管理器
        AudioManager.init();

        // 创建游戏实例
        this.game = new SchulteGame({
            container: this.gridContainer,
            onCorrectClick: () => AudioManager.play('correct'),
            onWrongClick: () => AudioManager.play('wrong'),
            onComplete: () => this.handleGameComplete()
        });

        // 初始化游戏网格
        this.game.init(this.currentColumns, this.currentColumns, this.currentRows);

        // 加载最佳成绩
        this.loadBestTime();
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 难度选择
        this.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const difficulty = btn.dataset.size;
                this.changeDifficulty(difficulty);
            });
        });

        // 开始按钮
        this.startBtn.addEventListener('click', () => this.startGame());

        // 重置按钮
        this.resetBtn.addEventListener('click', () => this.resetGame());

        // 历史记录按钮
        this.historyBtn.addEventListener('click', () => this.showHistory());

        // 模态框关闭
        document.getElementById('close-modal').addEventListener('click', () => {
            this.closeModal(this.historyModal);
        });

        document.getElementById('close-complete').addEventListener('click', () => {
            this.closeModal(this.completeModal);
        });

        // 再玩一次
        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.closeModal(this.completeModal);
            this.startGame();
        });

        // 清除历史
        document.getElementById('clear-history').addEventListener('click', () => {
            this.clearHistory();
        });

        // 历史记录标签切换
        const tabs = document.querySelectorAll('.history-tabs .tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const difficulty = tab.dataset.difficulty;
                this.showHistoryForDifficulty(difficulty);
            });
        });

        // 点击模态框外部关闭
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });
    }

    /**
     * 改变难度
     * @param {string} difficulty - 难度标识
     */
    changeDifficulty(difficulty) {
        // 停止当前游戏
        if (this.timer.isActive()) {
            this.resetGame();
        }

        // 更新当前设置
        this.currentDifficulty = difficulty;

        // 解析网格大小
        if (difficulty.includes('x')) {
            [this.currentColumns, this.currentRows] = difficulty.split('x').map(Number);
        } else {
            const size = parseInt(difficulty);
            this.currentColumns = size;
            this.currentRows = size;
        }

        // 更新按钮状态
        this.difficultyBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.size === difficulty);
        });

        // 重新初始化游戏
        this.game.init(this.currentColumns, this.currentColumns, this.currentRows);

        // 更新最佳成绩显示
        this.loadBestTime();
    }

    /**
     * 开始游戏
     */
    startGame() {
        // 重置游戏
        this.game.reset();

        // 重置并立即启动计时器
        this.timer.reset();
        this.timer.start();
        this.currentStartTime = Utils.getTimestamp();

        // 更新提示文字
        this.updateHint('计时中！按顺序点击数字 <strong>1 → 2 → 3...</strong>');

        // 开始游戏
        this.game.start();

        // 更新按钮状态
        this.startBtn.style.display = 'none';
        this.resetBtn.style.display = 'inline-block';

        // 禁用难度选择
        this.difficultyBtns.forEach(btn => {
            btn.disabled = true;
        });
    }

    /**
     * 更新提示文字
     * @param {string} html - 提示内容（支持HTML）
     */
    updateHint(html) {
        if (this.gameHint) {
            this.gameHint.innerHTML = html;
        }
    }

    /**
     * 重置游戏
     */
    resetGame() {
        // 停止计时
        this.timer.reset();

        // 重置游戏
        this.game.reset();

        // 重置提示文字
        this.updateHint('点击 <strong>"开始游戏"</strong> 按钮开始训练');

        // 更新按钮状态
        this.startBtn.style.display = 'inline-block';
        this.resetBtn.style.display = 'none';

        // 启用难度选择
        this.difficultyBtns.forEach(btn => {
            btn.disabled = false;
        });
    }

    /**
     * 游戏完成处理
     */
    handleGameComplete() {
        // 停止计时
        const finalTime = this.timer.stop();

        // 保存记录
        const isNewRecord = Storage.saveBestTime(
            this.currentDifficulty,
            finalTime
        );

        Storage.addGameRecord(
            this.currentDifficulty,
            finalTime,
            this.currentStartTime
        );

        // 播放完成音效
        AudioManager.play('complete');

        // 更新最佳成绩显示
        this.loadBestTime();

        // 显示完成模态框
        this.showCompleteModal(finalTime, isNewRecord);

        // 更新按钮状态
        this.startBtn.style.display = 'inline-block';
        this.resetBtn.style.display = 'none';

        // 启用难度选择
        this.difficultyBtns.forEach(btn => {
            btn.disabled = false;
        });
    }

    /**
     * 加载最佳成绩
     */
    loadBestTime() {
        const bestTime = Storage.getBestTime(this.currentDifficulty);

        if (bestTime) {
            this.bestTimeDisplay.textContent = Utils.formatTime(bestTime);
        } else {
            this.bestTimeDisplay.textContent = '--:--.---';
        }

        // 同时更新参考时间
        this.updateReferenceTimes();
    }

    /**
     * 更新参考时间显示
     */
    updateReferenceTimes() {
        // 移除所有行的高亮
        const tableRows = document.querySelectorAll('.reference-table tbody tr');
        tableRows.forEach(row => {
            row.classList.remove('active-row');
        });

        // 高亮当前难度所在行
        const currentRow = document.querySelector(`.reference-table tbody tr[data-difficulty="${this.currentDifficulty}"]`);
        if (currentRow) {
            currentRow.classList.add('active-row');
        }
    }

    /**
     * 显示历史记录
     */
    showHistory() {
        this.historyModal.classList.add('active');
        this.showHistoryForDifficulty(this.currentDifficulty);
    }

    /**
     * 显示特定难度的历史记录
     * @param {string} difficulty - 难度标识
     */
    showHistoryForDifficulty(difficulty) {
        // 更新标签状态
        const tabs = document.querySelectorAll('.history-tabs .tab');
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.difficulty === difficulty);
        });

        // 获取历史记录
        const history = Storage.getHistory(difficulty);
        const historyList = document.getElementById('history-list');

        // 清空列表
        historyList.innerHTML = '';

        // 显示记录
        if (history.length === 0) {
            historyList.innerHTML = '<p style="text-align: center; color: #7f8c8d; padding: 20px;">暂无记录</p>';
        } else {
            history.forEach((record, index) => {
                const item = document.createElement('div');
                item.className = 'history-item';
                item.innerHTML = `
                    <span class="rank">#${index + 1}</span>
                    <span class="time">${Utils.formatTime(record.time)}</span>
                    <span class="date">${record.date}</span>
                `;
                historyList.appendChild(item);
            });
        }
    }

    /**
     * 清除历史记录
     */
    clearHistory() {
        if (confirm('确定要清除当前难度的历史记录吗？')) {
            Storage.clearHistory(this.currentDifficulty);
            this.showHistoryForDifficulty(this.currentDifficulty);
            this.loadBestTime();
        }
    }

    /**
     * 显示完成模态框
     * @param {number} time - 完成时间
     * @param {boolean} isNewRecord - 是否新纪录
     */
    showCompleteModal(time, isNewRecord) {
        // 设置难度显示
        const difficultyText = this.currentDifficulty.includes('x')
            ? this.currentDifficulty.replace('x', '×')
            : `${this.currentDifficulty}×${this.currentDifficulty}`;
        this.completionDifficultyDisplay.textContent = difficultyText;

        this.completionTimeDisplay.textContent = Utils.formatTime(time);

        if (isNewRecord) {
            this.newRecordDisplay.style.display = 'block';
        } else {
            this.newRecordDisplay.style.display = 'none';
        }

        this.completeModal.classList.add('active');
    }

    /**
     * 关闭模态框
     * @param {HTMLElement} modal - 模态框元素
     */
    closeModal(modal) {
        modal.classList.remove('active');
    }
}

// 当DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    const app = new SchulteApp();
});
