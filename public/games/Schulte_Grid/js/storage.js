/**
 * 本地存储管理模块
 */

const Storage = {
    STORAGE_KEY: 'schulte_grid_data',

    /**
     * 获取所有存储的数据
     * @returns {Object} 存储的数据对象
     */
    getData() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : this.getInitialData();
        } catch (error) {
            console.error('Error reading from storage:', error);
            return this.getInitialData();
        }
    },

    /**
     * 保存数据
     * @param {Object} data - 要保存的数据对象
     */
    saveData(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to storage:', error);
        }
    },

    /**
     * 初始化数据结构
     * @returns {Object} 初始数据对象
     */
    getInitialData() {
        const difficulties = ['3', '4', '5', '6', '4x5'];
        const data = {
            bestTimes: {},
            history: {}
        };

        difficulties.forEach(diff => {
            data.bestTimes[diff] = null;
            data.history[diff] = [];
        });

        return data;
    },

    /**
     * 获取最佳成绩
     * @param {string} difficulty - 难度级别
     * @returns {number|null} 最佳成绩（毫秒）
     */
    getBestTime(difficulty) {
        const data = this.getData();
        return data.bestTimes[difficulty];
    },

    /**
     * 保存最佳成绩
     * @param {string} difficulty - 难度级别
     * @param {number} time - 完成时间（毫秒）
     * @returns {boolean} 是否为新纪录
     */
    saveBestTime(difficulty, time) {
        const data = this.getData();
        const currentBest = data.bestTimes[difficulty];

        if (currentBest === null || time < currentBest) {
            data.bestTimes[difficulty] = time;
            this.saveData(data);
            return true; // 新纪录
        }
        return false;
    },

    /**
     * 添加游戏记录
     * @param {string} difficulty - 难度级别
     * @param {number} time - 完成时间（毫秒）
     * @param {number} timestamp - 时间戳
     * @returns {Object} 添加的记录对象
     */
    addGameRecord(difficulty, time, timestamp) {
        const data = this.getData();
        const record = {
            time,
            timestamp,
            date: Utils.formatDate(timestamp)
        };

        data.history[difficulty].unshift(record);

        // 只保留最近50条记录
        if (data.history[difficulty].length > 50) {
            data.history[difficulty] = data.history[difficulty].slice(0, 50);
        }

        this.saveData(data);
        return record;
    },

    /**
     * 获取历史记录
     * @param {string} difficulty - 难度级别
     * @returns {Array} 历史记录数组
     */
    getHistory(difficulty) {
        const data = this.getData();
        return data.history[difficulty] || [];
    },

    /**
     * 清除历史记录
     * @param {string|null} difficulty - 难度级别，null表示清除所有
     */
    clearHistory(difficulty = null) {
        const data = this.getData();

        if (difficulty) {
            data.history[difficulty] = [];
            data.bestTimes[difficulty] = null;
        } else {
            Object.keys(data.history).forEach(key => {
                data.history[key] = [];
                data.bestTimes[key] = null;
            });
        }

        this.saveData(data);
    },

    /**
     * 获取统计数据
     * @param {string} difficulty - 难度级别
     * @returns {Object} 统计数据对象
     */
    getStats(difficulty) {
        const history = this.getHistory(difficulty);
        const bestTime = this.getBestTime(difficulty);

        const stats = {
            totalGames: history.length,
            bestTime: bestTime,
            averageTime: history.length > 0
                ? history.reduce((sum, record) => sum + record.time, 0) / history.length
                : null,
            recentGames: history.slice(0, 10)
        };

        return stats;
    }
};
