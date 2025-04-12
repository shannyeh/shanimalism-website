// 音樂資料庫
const musicLibrary = [
    {
        title: "Romanticism 2.0",
        artist: "Yun",
        file: "assets/sounds/music/y2mate.com - 姜云升  浪漫主义 伴奏.mp3",
        cover: "assets/sounds/image/barebreathe_favicon_white.png"
    }
];

// 音樂播放器功能
console.log("Music player script loaded - CONSOLIDATED VERSION");

class MusicPlayer {
    constructor() {
        console.log("MusicPlayer constructor called");
        
        // 初始化音頻對象
        this.audio = new Audio();
        this.audio.addEventListener('ended', () => this.playNext());
        
        // 設置自動播放
        this.audio.autoplay = false; // 禁用自動播放，等待用戶互動
        
        // 獲取DOM元素
        this.playerElement = document.querySelector('.music-player');
        this.albumCover = document.querySelector('.album-cover');
        this.trackTitle = document.querySelector('.track-title');
        this.trackArtist = document.querySelector('.track-artist');
        this.progressContainer = document.querySelector('.progress-container');
        this.progress = document.querySelector('.progress');
        this.currentTimeElement = document.querySelector('.current-time');
        this.durationElement = document.querySelector('.duration');
        this.playPauseBtn = document.querySelector('.play-pause-btn');
        this.playIcon = document.querySelector('.play-icon');
        this.pauseIcon = document.querySelector('.pause-icon');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.muteToggleBtn = document.querySelector('.mute-toggle-btn');
        this.togglePlayerBtn = document.querySelector('.toggle-player');
        this.volumeSlider = document.querySelector('.volume-slider');
        
        // 儲存上一次的音量值，用於靜音切換
        this.lastVolume = 0.7;
        
        // 檢查DOM元素是否存在
        if (!this.playerElement || !this.playPauseBtn) {
            console.error("Music player elements not found");
            return;
        }
        
        console.log("DOM elements found:", {
            playerElement: !!this.playerElement,
            playPauseBtn: !!this.playPauseBtn,
            playIcon: !!this.playIcon,
            pauseIcon: !!this.pauseIcon
        });
        
        // 音樂曲目列表
        this.tracks = musicLibrary;
        
        // 當前曲目索引
        this.currentTrackIndex = 0;
        
        // 初始化事件監聽器
        this.initEventListeners();
        
        // 從本地存儲加載狀態
        this.loadState();
        
        // 加載當前曲目
        this.loadTrack(this.currentTrackIndex);
        
        // 嘗試自動播放
        this.attemptAutoplay();
        
        // 監聽主題變更
        this.observeThemeChanges();
    }
    
    initEventListeners() {
        console.log("Initializing event listeners");
        
        // 播放/暫停按鈕點擊事件 - 直接使用原生點擊事件
        if (this.playPauseBtn) {
            this.playPauseBtn.onclick = (e) => {
                console.log('Play/Pause button clicked');
                e.preventDefault();
                this.togglePlay();
                return false;
            };
        }
        
        // 上一首/下一首按鈕點擊事件
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.playPrevious());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.playNext());
        }
        
        // 進度條點擊事件
        if (this.progressContainer) {
            this.progressContainer.addEventListener('click', (e) => this.setProgress(e));
        }
        
        // 靜音切換按鈕事件 - 增加觸摸事件支持
        if (this.muteToggleBtn) {
            // 點擊事件
            this.muteToggleBtn.addEventListener('click', () => this.toggleMute());
            
            // 觸摸事件支持
            this.muteToggleBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMute();
            }, { passive: false });
        }
        
        // 音量滑塊事件
        if (this.volumeSlider) {
            this.volumeSlider.addEventListener('input', () => {
                this.audio.volume = this.volumeSlider.value;
                
                // 如果音量不為0，更新靜音按鈕狀態
                if (parseFloat(this.volumeSlider.value) > 0) {
                    this.muteToggleBtn.classList.remove('muted');
                } else {
                    this.muteToggleBtn.classList.add('muted');
                }
                
                // 保存音量設置
                this.saveState();
            });
        }
        
        // 播放器收起/展開按鈕事件
        if (this.togglePlayerBtn) {
            this.togglePlayerBtn.addEventListener('click', () => this.togglePlayerVisibility());
        }
        
        // 音頻時間更新事件
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        
        // 音頻元數據加載完成事件
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
    }
    
    loadTrack(index) {
        console.log(`Loading track at index: ${index}`);
        
        // 確保索引在有效範圍內
        if (index < 0) index = this.tracks.length - 1;
        if (index >= this.tracks.length) index = 0;
        
        this.currentTrackIndex = index;
        
        // 設置音頻源
        const track = this.tracks[index];
        this.audio.src = track.file;
        
        // 更新UI
        this.albumCover.src = track.cover;
        this.trackTitle.textContent = track.title;
        this.trackArtist.textContent = track.artist;
        
        // 重置進度條
        this.progress.style.width = '0%';
        this.currentTimeElement.textContent = '0:00';
        
        // 保存狀態
        this.saveState();
    }
    
    togglePlay() {
        console.log('Toggle play/pause');
        if (this.audio.paused) {
            this.play();
        } else {
            this.pause();
        }
    }
    
    play() {
        console.log('Play');
        // 播放音頻
        this.audio.play()
            .then(() => {
                console.log('Audio playback started successfully');
                // 更新UI
                this._updatePlayPauseUI(true);
            })
            .catch(error => {
                console.error('Error starting audio playback:', error);
                // 更新UI為暫停狀態
                this._updatePlayPauseUI(false);
            });
    }
    
    pause() {
        console.log('Pause');
        // 暫停音頻
        this.audio.pause();
        
        // 更新UI
        this._updatePlayPauseUI(false);
        
        // 保存狀態
        this.saveState();
    }
    
    // Private method to update UI
    _updatePlayPauseUI(isPlaying) {
        console.log(`Updating play/pause UI, isPlaying: ${isPlaying}`);
        
        if (!this.playPauseBtn) {
            console.error("Play/Pause button not found");
            return;
        }
        
        if (isPlaying) {
            this.playPauseBtn.classList.add('playing');
            if (this.playerElement) {
                this.playerElement.classList.add('playing');
            }
        } else {
            this.playPauseBtn.classList.remove('playing');
            if (this.playerElement) {
                this.playerElement.classList.remove('playing');
            }
        }
    }
    
    playNext() {
        console.log('Play next track');
        this.loadTrack(this.currentTrackIndex + 1);
        this.play();
    }
    
    playPrevious() {
        console.log('Play previous track');
        this.loadTrack(this.currentTrackIndex - 1);
        this.play();
    }
    
    updateProgress() {
        const { currentTime, duration } = this.audio;
        const progressPercent = (currentTime / duration) * 100;
        
        // 更新進度條
        this.progress.style.width = `${progressPercent}%`;
        
        // 更新當前時間
        this.currentTimeElement.textContent = this.formatTime(currentTime);
    }
    
    updateDuration() {
        // 更新總時長
        const duration = this.audio.duration || 0;
        this.durationElement.textContent = this.formatTime(duration);
    }
    
    setProgress(e) {
        const width = this.progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audio.duration;
        
        this.audio.currentTime = (clickX / width) * duration;
    }
    
    toggleMute() {
        console.log('Toggle mute');
        
        if (this.audio.volume > 0) {
            // 儲存當前音量並設為靜音
            this.lastVolume = this.audio.volume;
            this.audio.volume = 0;
            this.muteToggleBtn.classList.add('muted');
            
            // 更新音量滑塊
            if (this.volumeSlider) {
                this.volumeSlider.value = 0;
            }
        } else {
            // 恢復音量
            this.audio.volume = this.lastVolume;
            this.muteToggleBtn.classList.remove('muted');
            
            // 更新音量滑塊
            if (this.volumeSlider) {
                this.volumeSlider.value = this.lastVolume;
            }
        }
    }
    
    togglePlayerVisibility() {
        console.log('Toggle player visibility');
        this.playerElement.classList.toggle('collapsed');
        this.saveState();
    }
    
    loadState() {
        try {
            // 加載曲目索引
            const savedIndex = localStorage.getItem('currentTrackIndex');
            if (savedIndex !== null) {
                this.currentTrackIndex = parseInt(savedIndex, 10);
                console.log(`Loaded track index: ${this.currentTrackIndex}`);
            }
            
            // 加載音量
            const savedVolume = localStorage.getItem('volume');
            if (savedVolume !== null) {
                const volume = parseFloat(savedVolume);
                this.audio.volume = volume;
                if (this.volumeSlider) {
                    this.volumeSlider.value = volume;
                }
                console.log(`Loaded volume: ${volume}`);
                
                // 更新靜音按鈕狀態
                if (volume === 0) {
                    this.muteToggleBtn.classList.add('muted');
                } else {
                    this.muteToggleBtn.classList.remove('muted');
                }
            } else {
                // 默認音量
                this.audio.volume = 0.7;
                if (this.volumeSlider) {
                    this.volumeSlider.value = 0.7;
                }
            }
            
            // 加載播放器收起/展開狀態
            const playerCollapsed = localStorage.getItem('playerCollapsed');
            if (playerCollapsed === 'true') {
                this.playerElement.classList.add('collapsed');
                console.log('Player loaded in collapsed state');
            } else {
                this.playerElement.classList.remove('collapsed');
                console.log('Player loaded in expanded state');
            }
            
            // 加載播放狀態（暫時不自動播放，等待用戶點擊）
            // const isPlaying = localStorage.getItem('isPlaying');
            // if (isPlaying === 'true') {
            //     // 不再自動播放，而是等待用戶點擊
            //     // this.play();
            // }
        } catch (error) {
            console.error('Error loading player state:', error);
        }
    }
    
    saveState() {
        localStorage.setItem('currentTrackIndex', this.currentTrackIndex);
        localStorage.setItem('isPlaying', !this.audio.paused);
        localStorage.setItem('volume', this.audio.volume);
        localStorage.setItem('playerCollapsed', this.playerElement.classList.contains('collapsed'));
    }
    
    observeThemeChanges() {
        // Listen for theme change events
        document.addEventListener('themeChanged', (e) => {
            console.log('Theme changed to:', e.detail.theme);
            // Here you can adjust the player's style based on the theme change
            // Since we use CSS variables, most styles will adapt automatically
        });
    }
    
    // 嘗試自動播放音樂
    attemptAutoplay() {
        console.log('不再嘗試自動播放，等待用戶互動');
        // 不再嘗試自動播放，而是等待用戶點擊 tune in 按鈕或調整音量
        // 更新 UI 為非播放狀態
        this._updatePlayPauseUI(false);
        
        // 不再添加事件監聽器，等待用戶點擊 tune in 按鈕
    }
    
    // 格式化時間為分:秒格式
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
}

// Initialize music player after DOM has loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing music player");
    
    try {
        // 初始化音樂播放器
        const player = new MusicPlayer();
        window.musicPlayer = player; // 將播放器實例添加到全局變量
        player.loadTrack(0);
        
        // 添加底部展開按鈕的點擊事件
        const musicToggleButton = document.getElementById('musicToggleButton');
        if (musicToggleButton) {
            // 點擊事件
            musicToggleButton.addEventListener('click', function() {
                const musicPlayer = document.querySelector('.music-player');
                if (musicPlayer && musicPlayer.classList.contains('collapsed')) {
                    musicPlayer.classList.remove('collapsed');
                    musicToggleButton.style.display = 'none';
                }
            });
            
            // 觸摸事件支持
            musicToggleButton.addEventListener('touchstart', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const musicPlayer = document.querySelector('.music-player');
                if (musicPlayer && musicPlayer.classList.contains('collapsed')) {
                    musicPlayer.classList.remove('collapsed');
                    musicToggleButton.style.display = 'none';
                }
            }, { passive: false });
            
            // 檢查播放器的初始狀態
            const musicPlayer = document.querySelector('.music-player');
            const isMobile = window.innerWidth <= 768;
            
            // 如果是大屏幕且播放器收起，顯示底部按鈕
            if (musicPlayer && musicPlayer.classList.contains('collapsed') && !isMobile) {
                musicToggleButton.style.display = 'block';
            } else {
                musicToggleButton.style.display = 'none';
            }
        }
        
        // 監聽視窗大小變化，調整播放器狀態
        window.addEventListener('resize', function() {
            const musicPlayer = document.querySelector('.music-player');
            const musicToggleButton = document.getElementById('musicToggleButton');
            const isMobile = window.innerWidth <= 768;
            
            if (!musicPlayer || !musicToggleButton) return;
            
            // 如果是手機或小屏幕設備，確保播放器展開
            if (isMobile && musicPlayer.classList.contains('collapsed')) {
                musicPlayer.classList.remove('collapsed');
                musicToggleButton.style.display = 'none';
            }
        });
        
        // 初始化音量提示功能
        initVolumePrompt();
        
    } catch (e) {
        console.error("Error initializing music player:", e);
    }
});

/**
 * 宇宙風格音量提示功能
 * 當音樂自動播放時，顯示宇宙風格的提示來引導用戶調整音量
 */
function initVolumePrompt() {
    console.log('初始化音量提示功能');
    
    // 獲取DOM元素
    const volumePrompt = document.querySelector('.volume-prompt');
    const closeBtn = document.querySelector('.volume-prompt-close');
    const actionBtn = document.querySelector('.volume-prompt-action');
    
    // 確認元素存在
    if (!volumePrompt) {
        console.error('找不到音量提示元素');
        return;
    }
    
    if (!closeBtn) {
        console.error('找不到關閉按鈕元素');
        return;
    }
    
    // 加入更多星星的動畫效果
    addCosmicEffects();
    
    // 顯示提示，但不自動關閉
    setTimeout(function() {
        console.log('顯示音量提示');
        volumePrompt.classList.add('show');
        volumePrompt.style.display = 'block';
        
        // 不再自動關閉，只能由用戶點擊關閉
    }, 1000);
    
    // 點擊關閉按鈕隱藏提示 - 直接使用onclick屬性
    closeBtn.onclick = function() {
        console.log('關閉按鈕被點擊');
        hidePrompt();
        return false; // 防止事件冒泡
    };
    
    // 點擊 tune in 按鈕
    actionBtn.addEventListener('click', function() {
        console.log('點擊 tune in 按鈕');
        
        // 直接使用全局音樂播放器實例
        if (window.musicPlayer) {
            console.log('找到音樂播放器實例');
            
            // 設置音量為70%
            window.musicPlayer.audio.volume = 0.7;
            
            // 更新音量滑塊
            if (window.musicPlayer.volumeSlider) {
                window.musicPlayer.volumeSlider.value = 0.7;
            }
            
            // 播放音樂
            window.musicPlayer.play();
            console.log('已呼叫音樂播放器的 play 方法');
        } else {
            console.error('找不到音樂播放器實例');
            
            // 備用方案：直接操作 DOM 元素
            const audio = document.querySelector('audio');
            const volumeSlider = document.querySelector('.volume-slider');
            const musicPlayer = document.querySelector('.music-player');
            
            if (audio && volumeSlider) {
                // 設置音量
                audio.volume = 0.7;
                volumeSlider.value = 0.7;
                
                // 觸發輸入事件
                const event = new Event('input');
                volumeSlider.dispatchEvent(event);
                
                // 播放音樂
                audio.play()
                    .then(() => {
                        console.log('音樂已開始播放');
                        if (musicPlayer) {
                            musicPlayer.classList.add('playing');
                            const playButton = musicPlayer.querySelector('.play-button');
                            if (playButton) {
                                playButton.classList.add('playing');
                            }
                        }
                    })
                    .catch(error => {
                        console.error('播放音樂時發生錯誤:', error);
                    });
            }
        }
        
        // 隱藏提示
        hidePrompt();
    });
    
    // 隱藏提示函數
    function hidePrompt() {
        console.log('執行 hidePrompt 函數');
        try {
            // 確保元素存在
            if (!volumePrompt) {
                throw new Error('找不到音量提示元素');
            }
            
            // 移除顯示類名
            volumePrompt.classList.remove('show');
            // 添加隱藏類名
            volumePrompt.classList.add('hidden');
            // 直接設置為不可見
            volumePrompt.style.display = 'none';
            // 記錄已顯示
            sessionStorage.setItem('volumePromptShown', 'true');
            
            console.log('提示框已成功隱藏');
        } catch (error) {
            console.error('隱藏提示框時發生錯誤:', error);
        }
    }
    
    // 監聽音量變化
    const volumeSlider = document.querySelector('.volume-slider');
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            // 如果用戶調整了音量，隱藏提示
            if (parseFloat(this.value) > 0) {
                hidePrompt();
            }
        });
        
        // 檢查初始音量是否為0
        if (parseFloat(volumeSlider.value) === 0) {
            // 如果初始音量為0，顯示提示
            setTimeout(function() {
                volumePrompt.classList.add('show');
            }, 3000);
        }
    }
    
    // 加入宇宙效果
    function addCosmicEffects() {
        // 加入更多星星
        for (let i = 0; i < 15; i++) {
            const star = document.createElement('span');
            star.className = 'cosmic-star';
            star.style.top = `${Math.random() * 100}%`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.width = `${Math.random() * 2 + 1}px`;
            star.style.height = star.style.width;
            star.style.animationDelay = `${Math.random() * 3}s`;
            star.style.animationDuration = `${Math.random() * 3 + 1}s`;
            volumePrompt.appendChild(star);
        }
    }
}
