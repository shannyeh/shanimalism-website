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
            document.body.classList.add('dark-mode');
            document.documentElement.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
            document.documentElement.classList.remove('dark-mode');
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
        // 檢查是否有用戶手動設置的主題偏好
        const userSetTheme = localStorage.getItem('userSetTheme');
        
        if (!userSetTheme) {
            // 第一次手動切換，記錄用戶偏好
            localStorage.setItem('userSetTheme', 'true');
        }
        
        const currentTheme = getStoredTheme() || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    }

    // 初始化主題
    function initTheme() {
        // 檢查用戶是否手動設置過主題
        const userSetTheme = localStorage.getItem('userSetTheme');
        
        // 如果用戶沒有手動設置過主題，則使用系統偏好
        if (!userSetTheme) {
            // 檢查本地存儲中的主題偏好
            let theme = getStoredTheme();
            
            // 如果沒有存儲的主題偏好，則使用系統偏好
            if (!theme) {
                const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                theme = prefersDarkMode ? 'dark' : 'light';
            }
            
            // 設置初始主題
            setTheme(theme);
        } else {
            // 用戶手動設置過主題，使用存儲的設置
            const theme = getStoredTheme() || 'light';
            setTheme(theme);
        }
    }

    // 監聽系統主題變更
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // 當系統主題變更時自動調整網站主題
    darkModeMediaQuery.addEventListener('change', (e) => {
        // 只有當用戶沒有手動設置過主題時，才跟隨系統主題
        const userSetTheme = localStorage.getItem('userSetTheme');
        if (!userSetTheme) {
            const newTheme = e.matches ? 'dark' : 'light';
            setTheme(newTheme);
        }
    });

    // 添加事件監聽器
    themeToggle.addEventListener('click', toggleTheme);

    // 初始化主題
    initTheme();
    
    // 添加重置按鈕功能（可選）
    // 如果您想添加一個重置按鈕，讓用戶可以恢復跟隨系統主題的功能
    const resetSystemThemeButton = document.getElementById('reset-system-theme');
    if (resetSystemThemeButton) {
        resetSystemThemeButton.addEventListener('click', () => {
            localStorage.removeItem('userSetTheme');
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const theme = prefersDarkMode ? 'dark' : 'light';
            setTheme(theme);
        });
    }
});