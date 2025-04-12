// 導航菜單功能
console.log("Navigation script loaded");

// DOM 加載完成後執行
document.addEventListener('DOMContentLoaded', function() {
    // 獲取漢堡菜單按鈕、導航菜單和關閉按鈕
    const hamburger = document.querySelector('.hamburger');
    const navigation = document.querySelector('.navigation');
    const closeMenuBtn = document.querySelector('.close-menu');

    if (!hamburger || !navigation) {
        console.error("Hamburger menu or navigation not found");
        return;
    }

    console.log("Navigation elements found");

    // 切換導航菜單顯示狀態
    function toggleNavigation() {
        console.log("Toggle navigation clicked");
        hamburger.classList.toggle('active');
        navigation.classList.toggle('active');
    }

    // 添加事件監聽器
    hamburger.addEventListener('click', toggleNavigation);
    
    // 為關閉按鈕添加點擊事件
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navigation.classList.remove('active');
        });
    }

    // 點擊菜單項目後關閉菜單
    const navLinks = document.querySelectorAll('.navigation a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navigation.classList.remove('active');
        });
    });
});