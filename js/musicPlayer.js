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

class MusicPlayer {
    constructor() {
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.audio = new Audio();
        this.audio.volume = 0.5;
        this.audio.addEventListener('ended', () => this.playNext());
        
        // 初始化播放器
        this.initPlayer();
        this.loadTrack(this.currentTrackIndex);
    }
    
    initPlayer() {
        // 更新播放器 UI
        const playerContainer = document.querySelector('.music-player');
        
        // 更新播放器標題和藝術家
        this.updateTrackInfo();
        
        // 添加事件監聽器
        document.querySelector('.play-pause-btn').addEventListener('click', () => this.togglePlay());
        document.querySelector('.prev-btn').addEventListener('click', () => this.playPrev());
        document.querySelector('.next-btn').addEventListener('click', () => this.playNext());
        document.querySelector('.volume-slider').addEventListener('input', (e) => this.setVolume(e.target.value));
        
        // 進度條更新
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        document.querySelector('.progress-container').addEventListener('click', (e) => this.setProgress(e));
    }
    
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
    }
    
    updateTrackInfo() {
        const track = musicLibrary[this.currentTrackIndex];
        document.querySelector('.track-title').textContent = track.title;
        document.querySelector('.track-artist').textContent = track.artist;
        document.querySelector('.album-cover').src = track.cover;
        document.querySelector('.album-cover').alt = `${track.title} by ${track.artist}`;
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        this.audio.play();
        this.isPlaying = true;
        document.querySelector('.play-pause-btn').innerHTML = '<i class="fas fa-pause"></i>';
        document.querySelector('.play-pause-btn').setAttribute('aria-label', '暫停');
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        document.querySelector('.play-pause-btn').innerHTML = '<i class="fas fa-play"></i>';
        document.querySelector('.play-pause-btn').setAttribute('aria-label', '播放');
    }
    
    playNext() {
        this.loadTrack(this.currentTrackIndex + 1);
        if (this.isPlaying) this.play();
    }
    
    playPrev() {
        this.loadTrack(this.currentTrackIndex - 1);
        if (this.isPlaying) this.play();
    }
    
    setVolume(value) {
        this.audio.volume = value;
    }
    
    updateProgress() {
        const progress = document.querySelector('.progress');
        const duration = this.audio.duration || 1;
        const currentTime = this.audio.currentTime;
        const progressPercent = (currentTime / duration) * 100;
        
        progress.style.width = `${progressPercent}%`;
        
        // 更新時間顯示
        document.querySelector('.current-time').textContent = this.formatTime(currentTime);
        document.querySelector('.duration').textContent = this.formatTime(duration);
    }
    
    setProgress(e) {
        const progressContainer = document.querySelector('.progress-container');
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audio.duration;
        
        this.audio.currentTime = (clickX / width) * duration;
    }
    
    formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' + sec : sec}`;
    }
}

// 當 DOM 加載完成後初始化音樂播放器
document.addEventListener('DOMContentLoaded', () => {
    const player = new MusicPlayer();
});
