document.addEventListener('DOMContentLoaded', function() {
    console.log('Theme switcher script loaded');
    
    // 獲取主題切換按鈕
    const themeToggle = document.querySelector('.theme-toggle');
    console.log('Theme toggle button:', themeToggle);
    
    // 檢查本地存儲中是否有保存的主題偏好
    const savedTheme = localStorage.getItem('theme');
    console.log('Saved theme:', savedTheme);
    
    // 檢查系統偏好
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    console.log('System prefers dark scheme:', prefersDarkScheme.matches);
    
    // 如果有保存的主題偏好，使用它
    if (savedTheme) {
        document.documentElement.classList.toggle('dark-theme', savedTheme === 'dark');
        console.log('Applied saved theme preference');
    } else {
        // 否則，根據系統偏好設置初始主題
        document.documentElement.classList.toggle('dark-theme', prefersDarkScheme.matches);
        console.log('Applied system theme preference');
    }
    
    // 切換主題的功能
    function toggleTheme() {
        console.log('Toggle theme clicked');
        const isDarkTheme = document.documentElement.classList.toggle('dark-theme');
        console.log('Dark theme enabled:', isDarkTheme);
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    }
    
    // 為按鈕添加點擊事件監聽器
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        console.log('Click event listener added to theme toggle button');
    } else {
        console.error('Theme toggle button not found!');
    }
    
    // 監聽系統主題變化（僅當用戶未手動設置主題時）
    prefersDarkScheme.addEventListener('change', function(e) {
        console.log('System theme preference changed:', e.matches);
        if (!localStorage.getItem('theme')) {
            document.documentElement.classList.toggle('dark-theme', e.matches);
            console.log('Applied new system theme preference');
        }
    });
});
