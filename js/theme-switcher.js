// 主題切換功能
console.log("Theme switcher script loaded");

// 獲取主題切換按鈕
const themeToggle = document.querySelector('.theme-toggle');

// 檢查本地存儲中的主題偏好
function getStoredTheme() {
    return localStorage.getItem('theme');
}

// 設置主題
function setTheme(theme) {
    console.log("Setting theme to:", theme);
    if (theme === 'dark') {
        document.documentElement.classList.add('dark-theme');
    } else {
        document.documentElement.classList.remove('dark-theme');
    }
    localStorage.setItem('theme', theme);
}

// 切換主題
function toggleTheme() {
    console.log("Toggle theme clicked");
    const currentTheme = getStoredTheme() || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// 初始化主題
function initializeTheme() {
    console.log("Initializing theme");
    const storedTheme = getStoredTheme();
    
    if (storedTheme) {
        console.log("Found stored theme:", storedTheme);
        setTheme(storedTheme);
    } else {
        // 檢查系統偏好
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        console.log("System prefers dark mode:", prefersDark);
        setTheme(prefersDark ? 'dark' : 'light');
    }
}

// 當DOM加載完成後初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    initializeTheme();
    
    // 確保主題切換按鈕存在
    if (themeToggle) {
        console.log("Theme toggle button found, adding event listener");
        themeToggle.addEventListener('click', toggleTheme);
    } else {
        console.error("Theme toggle button not found!");
    }
});
