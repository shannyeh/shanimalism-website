// 主題切換功能
console.log("Theme switcher script loaded");

// DOM 加載完成後執行
document.addEventListener('DOMContentLoaded', function() {
    // 獲取主題切換按鈕
    const themeToggle = document.getElementById('theme-toggle');

    if (!themeToggle) {
        console.error("Theme toggle button not found");
        return;
    }

    console.log("Theme toggle button found");

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
        
        // 發送主題變更事件，讓其他組件可以響應
        const themeChangedEvent = new CustomEvent('themeChanged', {
            detail: { theme: theme }
        });
        document.dispatchEvent(themeChangedEvent);
    }

    // 切換主題
    function toggleTheme() {
        console.log("Toggle theme clicked");
        const currentTheme = getStoredTheme() || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    }

    // 初始化主題
    function initTheme() {
        // 檢查本地存儲中的主題偏好
        let theme = getStoredTheme();
        
        // 如果沒有存儲的主題偏好，則使用系統偏好
        if (!theme) {
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            theme = prefersDarkMode ? 'dark' : 'light';
        }
        
        // 設置初始主題
        setTheme(theme);
    }

    // 添加事件監聽器
    themeToggle.addEventListener('click', toggleTheme);

    // 初始化主題
    initTheme();
});