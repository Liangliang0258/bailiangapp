/**
 * 游戏核心逻辑模块
 */

class SchulteGame {
    /**
     * 创建游戏实例
     * @param {Object} options - 配置选项
     */
    constructor(options = {}) {
        this.gridSize = options.gridSize || 4; // 默认4x4
        this.gridColumns = options.gridColumns || 4;
        this.gridRows = options.gridRows || 4;
        this.container = options.container;
        this.onComplete = options.onComplete;
        this.onCorrectClick = options.onCorrectClick;
        this.onWrongClick = options.onWrongClick;

        this.numbers = [];
        this.currentTarget = 1;
        this.totalNumbers = 0;
        this.isGameActive = false;
    }

    /**
     * 初始化游戏
     * @param {number} size - 网格大小
     * @param {number} columns - 列数
     * @param {number} rows - 行数
     */
    init(size, columns, rows) {
        this.gridSize = size;
        this.gridColumns = columns;
        this.gridRows = rows;
        this.totalNumbers = columns * rows;
        this.currentTarget = 1;
        this.isGameActive = false;

        this.generateGrid();
    }

    /**
     * 生成网格
     */
    generateGrid() {
        // 生成1到n的数字并随机排列
        this.numbers = Utils.shuffleArray(
            Utils.generateSequence(this.totalNumbers)
        );

        // 清空容器
        this.container.innerHTML = '';

        // 设置CSS Grid样式
        this.container.style.gridTemplateColumns = `repeat(${this.gridColumns}, 1fr)`;
        this.container.className = 'grid-container';

        // 创建网格项
        this.numbers.forEach((number, index) => {
            const cell = document.createElement('div');
            cell.className = 'grid-item';
            cell.textContent = number;
            cell.dataset.number = number;
            cell.dataset.index = index;

            // 添加点击事件
            cell.addEventListener('click', () => this.handleCellClick(cell));

            // 延迟动画
            cell.style.animationDelay = `${index * 30}ms`;

            this.container.appendChild(cell);
        });
    }

    /**
     * 开始游戏
     */
    start() {
        this.isGameActive = true;
        this.currentTarget = 1;
    }

    /**
     * 处理单元格点击
     * @param {HTMLElement} cell - 被点击的单元格
     */
    handleCellClick(cell) {
        if (!this.isGameActive) return;

        const clickedNumber = parseInt(cell.dataset.number);

        if (clickedNumber === this.currentTarget) {
            this.handleCorrectClick(cell);
        } else {
            this.handleWrongClick(cell);
        }
    }

    /**
     * 处理正确点击
     * @param {HTMLElement} cell - 被点击的单元格
     */
    handleCorrectClick(cell) {
        // 添加正确样式
        cell.classList.add('correct');

        // 播放音效
        if (this.onCorrectClick) {
            this.onCorrectClick();
        }

        // 移动到下一个数字
        this.currentTarget++;

        // 检查是否完成
        if (this.currentTarget > this.totalNumbers) {
            this.completeGame();
        } else {
            // 短暂延迟后标记为已完成
            setTimeout(() => {
                cell.classList.remove('correct');
                cell.classList.add('completed');
            }, 400);
        }
    }

    /**
     * 处理错误点击
     * @param {HTMLElement} cell - 被点击的单元格
     */
    handleWrongClick(cell) {
        // 添加错误样式
        cell.classList.add('wrong');

        // 播放音效
        if (this.onWrongClick) {
            this.onWrongClick();
        }

        // 移除错误样式
        setTimeout(() => {
            cell.classList.remove('wrong');
        }, 400);
    }

    /**
     * 完成游戏
     */
    completeGame() {
        this.isGameActive = false;

        // 所有单元格标记为完成
        const cells = this.container.querySelectorAll('.grid-item');
        cells.forEach(cell => {
            cell.classList.add('completed');
        });

        // 触发完成回调
        if (this.onComplete) {
            this.onComplete();
        }
    }

    /**
     * 重置游戏
     */
    reset() {
        this.isGameActive = false;
        this.currentTarget = 1;
        this.generateGrid();
    }

    /**
     * 获取当前进度
     * @returns {Object} 进度对象
     */
    getProgress() {
        return {
            current: this.currentTarget,
            total: this.totalNumbers,
            percentage: ((this.currentTarget - 1) / this.totalNumbers) * 100
        };
    }
}
