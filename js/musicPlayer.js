// 音樂資料庫
const musicLibrary = [
    {
        title: "Ambient Flow",
        artist: "Barebreathe Studio",
        file: "sounds/music/ambient-flow.mp3",
        cover: "image/music-covers/ambient-flow.jpg"
    },
    {
        title: "Minimal Waves",
        artist: "Barebreathe Studio",
        file: "sounds/music/minimal-waves.mp3",
        cover: "image/music-covers/minimal-waves.jpg"
    },
    {
        title: "Distant Dreams",
        artist: "Barebreathe Studio",
        file: "sounds/music/distant-dreams.mp3",
        cover: "image/music-covers/distant-dreams.jpg"
    },
    {
        title: "Quiet Thoughts",
        artist: "Barebreathe Studio",
        file: "sounds/music/quiet-thoughts.mp3",
        cover: "image/music-covers/quiet-thoughts.jpg"
    },
    {
        title: "Gentle Breeze",
        artist: "Barebreathe Studio",
        file: "sounds/music/gentle-breeze.mp3",
        cover: "image/music-covers/gentle-breeze.jpg"
    }
];

// 音樂播放器類
class MusicPlayer {
    constructor() {
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.isCollapsed = false;
        this.audio = new Audio();
        this.audio.volume = 0.5;
        
        // 事件監聽器
        this.audio.addEventListener('ended', () => this.playNext());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        
        // 初始化播放器
        this.initPlayer();
        this.loadTrack(this.currentTrackIndex);
        
        // 檢查主題變化
        this.observeThemeChanges();
    }
    
    // 初始化播放器
    initPlayer() {
        console.log("初始化音樂播放器...");
        
        // 獲取DOM元素
        this.playerElement = document.querySelector('.music-player');
        this.toggleButton = document.querySelector('.toggle-player');
        this.playPauseButton = document.querySelector('.play-pause-btn');
        this.prevButton = document.querySelector('.prev-btn');
        this.nextButton = document.querySelector('.next-btn');
        this.volumeSlider = document.querySelector('.volume-slider');
        this.progressContainer = document.querySelector('.progress-container');
        this.progress = document.querySelector('.progress');
        
        // 添加事件監聽器
        if (this.toggleButton) {
            this.toggleButton.addEventListener('click', () => this.togglePlayerCollapse());
        }
        
        if (this.playPauseButton) {
            this.playPauseButton.addEventListener('click', () => this.togglePlay());
        }
        
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.playPrev());
        }
        
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.playNext());
        }
        
        if (this.volumeSlider) {
            this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        }
        
        if (this.progressContainer) {
            this.progressContainer.addEventListener('click', (e) => this.setProgress(e));
        }
        
        // 從本地存儲加載播放器狀態
        this.loadPlayerState();
    }
    
    // 加載音軌
    loadTrack(index) {
        // 確保索引在有效範圍內
        if (index < 0) index = musicLibrary.length - 1;
        if (index >= musicLibrary.length) index = 0;
        
        this.currentTrackIndex = index;
        const track = musicLibrary[index];
        
        // 設置音頻源
        this.audio.src = track.file;
        this.audio.load();
        
        // 更新播放器 UI
        this.updateTrackInfo();
        
        // 保存當前音軌到本地存儲
        localStorage.setItem('currentTrackIndex', index);
    }
    
    // 更新音軌信息
    updateTrackInfo() {
        const track = musicLibrary[this.currentTrackIndex];
        
        // 更新標題和藝術家
        const titleElement = document.querySelector('.track-title');
        const artistElement = document.querySelector('.track-artist');
        const coverElement = document.querySelector('.album-cover');
        
        if (titleElement) titleElement.textContent = track.title;
        if (artistElement) artistElement.textContent = track.artist;
        if (coverElement) {
            coverElement.src = track.cover;
            coverElement.alt = `${track.title} by ${track.artist}`;
        }
    }
    
    // 切換播放/暫停
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    // 播放
    play() {
        this.audio.play()
            .then(() => {
                this.isPlaying = true;
                if (this.playPauseButton) {
                    this.playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
                    this.playPauseButton.setAttribute('aria-label', '暫停');
                }
                // 保存播放狀態
                localStorage.setItem('isPlaying', 'true');
            })
            .catch(error => {
                console.error('播放失敗:', error);
            });
    }
    
    // 暫停
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        if (this.playPauseButton) {
            this.playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
            this.playPauseButton.setAttribute('aria-label', '播放');
        }
        // 保存播放狀態
        localStorage.setItem('isPlaying', 'false');
    }
    
    // 播放下一首
    playNext() {
        this.loadTrack(this.currentTrackIndex + 1);
        if (this.isPlaying) this.play();
    }
    
    // 播放上一首
    playPrev() {
        this.loadTrack(this.currentTrackIndex - 1);
        if (this.isPlaying) this.play();
    }
    
    // 設置音量
    setVolume(value) {
        this.audio.volume = value;
        localStorage.setItem('volume', value);
    }
    
    // 更新進度條
    updateProgress() {
        const duration = this.audio.duration || 1;
        const currentTime = this.audio.currentTime;
        const progressPercent = (currentTime / duration) * 100;
        
        if (this.progress) {
            this.progress.style.width = `${progressPercent}%`;
        }
        
        // 更新時間顯示
        this.updateTimeDisplay(currentTime, duration);
    }
    
    // 更新時間顯示
    updateTimeDisplay(currentTime, duration) {
        const currentTimeElement = document.querySelector('.current-time');
        if (currentTimeElement) {
            currentTimeElement.textContent = this.formatTime(currentTime);
        }
    }
    
    // 更新總時長
    updateDuration() {
        const durationElement = document.querySelector('.duration');
        if (durationElement) {
            durationElement.textContent = this.formatTime(this.audio.duration);
        }
    }
    
    // 設置進度
    setProgress(e) {
        const width = this.progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audio.duration;
        
        this.audio.currentTime = (clickX / width) * duration;
    }
    
    // 格式化時間
    formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' + sec : sec}`;
    }
    
    // 切換播放器收起/展開狀態
    togglePlayerCollapse() {
        this.isCollapsed = !this.isCollapsed;
        if (this.playerElement) {
            this.playerElement.classList.toggle('collapsed', this.isCollapsed);
        }
        // 保存狀態
        localStorage.setItem('isCollapsed', this.isCollapsed);
    }
    
    // 從本地存儲加載播放器狀態
    loadPlayerState() {
        // 加載音量
        const savedVolume = localStorage.getItem('volume');
        if (savedVolume !== null) {
            this.audio.volume = parseFloat(savedVolume);
            if (this.volumeSlider) {
                this.volumeSlider.value = parseFloat(savedVolume);
            }
        }
        
        // 加載當前音軌
        const savedTrackIndex = localStorage.getItem('currentTrackIndex');
        if (savedTrackIndex !== null) {
            this.loadTrack(parseInt(savedTrackIndex));
        }
        
        // 加載播放狀態
        const savedIsPlaying = localStorage.getItem('isPlaying');
        if (savedIsPlaying === 'true') {
            // 使用 setTimeout 來確保音頻已經加載
            setTimeout(() => this.play(), 100);
        }
        
        // 加載收起狀態
        const savedIsCollapsed = localStorage.getItem('isCollapsed');
        if (savedIsCollapsed === 'true') {
            this.isCollapsed = true;
            if (this.playerElement) {
                this.playerElement.classList.add('collapsed');
            }
        }
    }
    
    // 觀察主題變化
    observeThemeChanges() {
        // 監聽主題切換事件
        document.addEventListener('themeChanged', (e) => {
            console.log('主題已切換:', e.detail.theme);
            // 可以在這裡添加主題相關的邏輯
        });
    }
}

// 當 DOM 加載完成後初始化音樂播放器
document.addEventListener('DOMContentLoaded', () => {
    console.log('初始化音樂播放器...');
    const player = new MusicPlayer();
});
