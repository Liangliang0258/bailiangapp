/**
 * 计时器模块
 */

class Timer {
    /**
     * 创建计时器实例
     * @param {HTMLElement} displayElement - 显示时间的DOM元素
     */
    constructor(displayElement) {
        this.displayElement = displayElement;
        this.startTime = null;
        this.elapsedTime = 0;
        this.isRunning = false;
        this.intervalId = null;
    }

    /**
     * 开始计时
     */
    start() {
        if (this.isRunning) return;

        this.startTime = Date.now() - this.elapsedTime;
        this.isRunning = true;
        this.updateDisplay();

        this.intervalId = setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime;
            this.updateDisplay();
        }, 10); // 每10毫秒更新一次
    }

    /**
     * 停止计时
     * @returns {number} 经过的时间（毫秒）
     */
    stop() {
        if (!this.isRunning) return this.elapsedTime;

        this.isRunning = false;
        clearInterval(this.intervalId);
        this.elapsedTime = Date.now() - this.startTime;
        return this.elapsedTime;
    }

    /**
     * 重置计时器
     */
    reset() {
        this.stop();
        this.elapsedTime = 0;
        this.startTime = null;
        this.updateDisplay();
    }

    /**
     * 更新显示
     */
    updateDisplay() {
        if (this.displayElement) {
            this.displayElement.textContent = Utils.formatTime(this.elapsedTime);
        }
    }

    /**
     * 获取当前时间
     * @returns {number} 当前经过的时间（毫秒）
     */
    getCurrentTime() {
        return this.isRunning
            ? Date.now() - this.startTime
            : this.elapsedTime;
    }

    /**
     * 检查是否正在运行
     * @returns {boolean} 是否正在运行
     */
    isActive() {
        return this.isRunning;
    }
}
