/**
 * 音效管理模块
 * 使用 Web Audio API 生成音效，无需外部音频文件
 */

const AudioManager = {
    sounds: {},
    enabled: true,
    volume: 0.5,
    audioContext: null,

    /**
     * 初始化音效管理器
     */
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.loadSounds();
        } catch (error) {
            console.error('Web Audio API not supported:', error);
            this.enabled = false;
        }
    },

    /**
     * 加载音效
     */
    loadSounds() {
        // 正确点击音效
        this.sounds.correct = () => this.playTone(800, 0.1, 'sine');

        // 错误点击音效
        this.sounds.wrong = () => this.playTone(200, 0.2, 'sawtooth');

        // 完成游戏音效
        this.sounds.complete = () => this.playCompleteSound();
    },

    /**
     * 播放单音
     * @param {number} frequency - 频率 (Hz)
     * @param {number} duration - 持续时间（秒）
     * @param {string} type - 波形类型
     */
    playTone(frequency, duration, type = 'sine') {
        if (!this.enabled || !this.audioContext) return;

        // 恢复音频上下文（浏览器自动播放策略）
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

            gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
                0.01,
                this.audioContext.currentTime + duration
            );

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (error) {
            console.error('Error playing tone:', error);
        }
    },

    /**
     * 播放完成音效（一系列上升的音符）
     */
    playCompleteSound() {
        if (!this.enabled || !this.audioContext) return;

        // 恢复音频上下文
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
        const now = this.audioContext.currentTime;

        notes.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, now + index * 0.15);

            gainNode.gain.setValueAtTime(this.volume, now + index * 0.15);
            gainNode.gain.exponentialRampToValueAtTime(
                0.01,
                now + index * 0.15 + 0.2
            );

            oscillator.start(now + index * 0.15);
            oscillator.stop(now + index * 0.15 + 0.2);
        });
    },

    /**
     * 播放指定音效
     * @param {string} soundName - 音效名称
     */
    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    },

    /**
     * 切换静音
     * @returns {boolean} 当前是否启用音效
     */
    toggleMute() {
        this.enabled = !this.enabled;
        return this.enabled;
    },

    /**
     * 设置音量
     * @param {number} volume - 音量值 (0-1)
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }
};
