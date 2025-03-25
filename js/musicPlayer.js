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

// 音樂播放器功能
console.log("Music player script loaded");

class MusicPlayer {
    constructor() {
        // 初始化音頻對象
        this.audio = new Audio();
        this.audio.addEventListener('ended', () => this.playNext());
        
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
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.volumeSlider = document.querySelector('.volume-slider');
        this.togglePlayerBtn = document.querySelector('.toggle-player');
        
        // 檢查DOM元素是否存在
        if (!this.playerElement || !this.playPauseBtn) {
            console.error("Music player elements not found");
            return;
        }
        
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
        
        // 監聽主題變更
        this.observeThemeChanges();
    }
    
    initEventListeners() {
        // 播放/暫停按鈕點擊事件
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());
        
        // 上一首/下一首按鈕點擊事件
        this.prevBtn.addEventListener('click', () => this.playPrevious());
        this.nextBtn.addEventListener('click', () => this.playNext());
        
        // 進度條點擊事件
        this.progressContainer.addEventListener('click', (e) => this.setProgress(e));
        
        // 音量滑塊變更事件
        this.volumeSlider.addEventListener('input', () => this.setVolume());
        
        // 音頻時間更新事件
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        
        // 音頻加載完成事件
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        
        // 切換播放器顯示/隱藏
        this.togglePlayerBtn.addEventListener('click', () => this.togglePlayerVisibility());
        
        // 頁面卸載前保存狀態
        window.addEventListener('beforeunload', () => this.saveState());
    }
    
    loadTrack(index) {
        // 確保索引在有效範圍內
        if (index < 0) index = this.tracks.length - 1;
        if (index >= this.tracks.length) index = 0;
        
        // 更新當前曲目索引
        this.currentTrackIndex = index;
        
        // 獲取當前曲目信息
        const track = this.tracks[index];
        
        // 更新音頻源
        this.audio.src = track.file;
        
        // 更新UI
        this.albumCover.src = track.cover;
        this.trackTitle.textContent = track.title;
        this.trackArtist.textContent = track.artist;
        
        // 重置進度條
        this.progress.style.width = '0%';
        this.currentTimeElement.textContent = '0:00';
        
        // 保存當前曲目到本地存儲
        localStorage.setItem('currentTrackIndex', index);
    }
    
    togglePlay() {
        if (this.audio.paused) {
            this.play();
        } else {
            this.pause();
        }
    }
    
    play() {
        this.audio.play();
        this.playPauseBtn.classList.add('playing');
        localStorage.setItem('isPlaying', 'true');
    }
    
    pause() {
        this.audio.pause();
        this.playPauseBtn.classList.remove('playing');
        localStorage.setItem('isPlaying', 'false');
    }
    
    playNext() {
        this.loadTrack(this.currentTrackIndex + 1);
        if (this.audio.paused && localStorage.getItem('isPlaying') === 'true') {
            this.play();
        }
    }
    
    playPrevious() {
        this.loadTrack(this.currentTrackIndex - 1);
        if (this.audio.paused && localStorage.getItem('isPlaying') === 'true') {
            this.play();
        }
    }
    
    updateProgress() {
        const { currentTime, duration } = this.audio;
        const progressPercent = (currentTime / duration) * 100;
        this.progress.style.width = `${progressPercent}%`;
        
        // 更新當前時間顯示
        const minutes = Math.floor(currentTime / 60);
        const seconds = Math.floor(currentTime % 60).toString().padStart(2, '0');
        this.currentTimeElement.textContent = `${minutes}:${seconds}`;
    }
    
    updateDuration() {
        const { duration } = this.audio;
        if (isNaN(duration)) return;
        
        // 更新總時長顯示
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60).toString().padStart(2, '0');
        this.durationElement.textContent = `${minutes}:${seconds}`;
    }
    
    setProgress(e) {
        const width = this.progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audio.duration;
        
        this.audio.currentTime = (clickX / width) * duration;
    }
    
    setVolume() {
        const volume = this.volumeSlider.value;
        this.audio.volume = volume;
        localStorage.setItem('volume', volume);
    }
    
    togglePlayerVisibility() {
        this.playerElement.classList.toggle('collapsed');
        localStorage.setItem('playerCollapsed', this.playerElement.classList.contains('collapsed'));
    }
    
    loadState() {
        // 加載音量設置
        const volume = localStorage.getItem('volume');
        if (volume !== null) {
            this.audio.volume = parseFloat(volume);
            this.volumeSlider.value = parseFloat(volume);
        }
        
        // 加載當前曲目索引
        const trackIndex = localStorage.getItem('currentTrackIndex');
        if (trackIndex !== null) {
            this.currentTrackIndex = parseInt(trackIndex);
        }
        
        // 加載播放器折疊狀態
        const collapsed = localStorage.getItem('playerCollapsed');
        if (collapsed === 'true') {
            this.playerElement.classList.add('collapsed');
        }
        
        // 檢查是否應該自動播放
        const isPlaying = localStorage.getItem('isPlaying');
        if (isPlaying === 'true') {
            // 由於瀏覽器政策限制，無法自動播放，但我們可以設置UI狀態
            this.playPauseBtn.classList.add('playing');
        }
    }
    
    saveState() {
        localStorage.setItem('currentTrackIndex', this.currentTrackIndex);
        localStorage.setItem('isPlaying', !this.audio.paused);
        localStorage.setItem('volume', this.audio.volume);
        localStorage.setItem('playerCollapsed', this.playerElement.classList.contains('collapsed'));
    }
    
    observeThemeChanges() {
        // 監聽主題變更事件
        document.addEventListener('themeChanged', (e) => {
            console.log('Theme changed to:', e.detail.theme);
            // 這裡可以根據主題變更調整播放器樣式
            // 由於我們使用CSS變量，大部分樣式會自動適應
        });
    }
}

// DOM 加載完成後初始化音樂播放器
document.addEventListener('DOMContentLoaded', function() {
    new MusicPlayer();
});
