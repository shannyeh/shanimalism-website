// Music database
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

// Music player functionality
console.log("Music player script loaded");

class MusicPlayer {
    constructor() {
        // Initialize audio object
        this.audio = new Audio();
        this.audio.addEventListener('ended', () => this.playNext());
        
        // Get DOM elements
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
        
        // Check if DOM elements exist
        if (!this.playerElement) {
            console.error("Music player element not found");
            return;
        }
        
        // Check play/pause button
        if (!this.playPauseBtn) {
            console.error("Play/Pause button not found");
            return;
        } else {
            console.log("Play/Pause button found:", this.playPauseBtn);
            console.log("Initial button class:", this.playPauseBtn.className);
        }
        
        // Music track list
        this.tracks = musicLibrary;
        
        // Current track index
        this.currentTrackIndex = 0;
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Load state from local storage
        this.loadState();
        
        // Load current track
        this.loadTrack(this.currentTrackIndex);
        
        // Observe theme changes
        this.observeThemeChanges();
    }
    
    initEventListeners() {
        // Play/pause button click event
        this.playPauseBtn.addEventListener('click', () => {
            console.log("Play/pause button clicked");
            this.togglePlay();
        });
        
        // Previous/next button click events
        this.prevBtn.addEventListener('click', () => this.playPrevious());
        this.nextBtn.addEventListener('click', () => this.playNext());
        
        // Progress bar click event
        this.progressContainer.addEventListener('click', (e) => this.setProgress(e));
        
        // Volume slider change event
        this.volumeSlider.addEventListener('input', () => this.setVolume());
        
        // Audio time update event
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        
        // Audio loaded metadata event
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        
        // Toggle player visibility
        this.togglePlayerBtn.addEventListener('click', () => this.togglePlayerVisibility());
        
        // Save state before unload
        window.addEventListener('beforeunload', () => this.saveState());
    }
    
    loadTrack(index) {
        // Ensure index is within valid range
        if (index < 0) index = this.tracks.length - 1;
        if (index >= this.tracks.length) index = 0;
        
        // Update current track index
        this.currentTrackIndex = index;
        
        // Get current track information
        const track = this.tracks[index];
        
        // Update audio source
        this.audio.src = track.file;
        
        // Update UI
        this.albumCover.src = track.cover;
        this.trackTitle.textContent = track.title;
        this.trackArtist.textContent = track.artist;
        
        // Reset progress bar
        this.progress.style.width = '0%';
        this.currentTimeElement.textContent = '0:00';
        
        // Save current track to local storage
        localStorage.setItem('currentTrackIndex', index);
    }
    
    togglePlay() {
        console.log("togglePlay called, audio.paused:", this.audio.paused);
        
        if (this.audio.paused) {
            this.play();
        } else {
            this.pause();
        }
    }
    
    play() {
        console.log("Playing audio");
        
        // Play audio
        this.audio.play()
            .then(() => {
                console.log("Audio played successfully");
                // Add playing class
                this.playPauseBtn.classList.add('playing');
                this.playerElement.classList.add('playing');
                localStorage.setItem('isPlaying', 'true');
            })
            .catch(error => {
                console.error('Play failed:', error);
                // Reset button state on failure
                this.playPauseBtn.classList.remove('playing');
                this.playerElement.classList.remove('playing');
                localStorage.setItem('isPlaying', 'false');
            });
    }
    
    pause() {
        console.log("Pausing audio");
        
        // Pause audio
        this.audio.pause();
        
        // Remove playing class
        this.playPauseBtn.classList.remove('playing');
        this.playerElement.classList.remove('playing');
        
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
        if (isNaN(duration)) return;
        
        // 更新進度條
        const progressPercent = (currentTime / duration) * 100;
        this.progress.style.width = `${progressPercent}%`;
        
        // 更新當前時間
        const minutes = Math.floor(currentTime / 60);
        const seconds = Math.floor(currentTime % 60).toString().padStart(2, '0');
        this.currentTimeElement.textContent = `${minutes}:${seconds}`;
    }
    
    formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }
    
    updateDuration() {
        const { duration } = this.audio;
        if (isNaN(duration)) return;
        
        // 更新總時長顯示
        this.durationElement.textContent = this.formatTime(duration);
    }
    
    setProgress(e) {
        const width = this.progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audio.duration;
        
        this.audio.currentTime = (clickX / width) * duration;
    }
    
    setVolume() {
        const volume = this.volumeSlider.value;
        this.audio.volume = volume / 100;
        localStorage.setItem('volume', volume / 100);
    }
    
    togglePlayerVisibility() {
        this.playerElement.classList.toggle('collapsed');
        localStorage.setItem('playerCollapsed', this.playerElement.classList.contains('collapsed'));
    }
    
    loadState() {
        // Load state from local storage
        const currentTrackIndex = localStorage.getItem('currentTrackIndex');
        const volume = localStorage.getItem('volume');
        const isPlaying = localStorage.getItem('isPlaying');
        const collapsed = localStorage.getItem('playerCollapsed');
        
        // Set current track index
        if (currentTrackIndex !== null) {
            this.currentTrackIndex = parseInt(currentTrackIndex);
        }
        
        // Set volume
        if (volume !== null) {
            this.audio.volume = parseFloat(volume);
            this.volumeSlider.value = parseFloat(volume) * 100;
        }
        
        // 加載播放器折疊狀態
        if (collapsed === 'true') {
            this.playerElement.classList.add('collapsed');
        }
        
        // Set playing state
        if (isPlaying === 'true') {
            // 由於瀏覽器政策限制，無法自動播放，但我們可以設置UI狀態
            this.playPauseBtn.classList.add('playing');
            this.playerElement.classList.add('playing');
        } else {
            this.playPauseBtn.classList.remove('playing');
        }
    }
    
    saveState() {
        localStorage.setItem('currentTrackIndex', this.currentTrackIndex);
        localStorage.setItem('isPlaying', !this.audio.paused);
        localStorage.setItem('volume', this.audio.volume);
        localStorage.setItem('playerCollapsed', this.playerElement.classList.contains('collapsed'));
    }
    
    observeThemeChanges() {
        // Observe theme change events
        document.addEventListener('themeChanged', (e) => {
            console.log('Theme changed to:', e.detail.theme);
            // Here you can adjust the player style based on the theme change
            // Since we use CSS variables, most styles will adapt automatically
        });
    }
}

// Initialize music player after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new MusicPlayer();
});
