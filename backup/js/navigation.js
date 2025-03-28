// 導航菜單功能
console.log("Navigation script loaded");

// DOM 加載完成後執行
document.addEventListener('DOMContentLoaded', function() {
    // 獲取漢堡菜單按鈕和導航菜單
    const hamburger = document.querySelector('.hamburger');
    const navigation = document.querySelector('.navigation');

    if (!hamburger || !navigation) {
        console.error("Hamburger menu or navigation not found");
        return;
    }

    console.log("Hamburger and navigation elements found");

    // 切換導航菜單顯示狀態
    function toggleNavigation() {
        console.log("Toggle navigation clicked");
        hamburger.classList.toggle('active');
        navigation.classList.toggle('active');
    }

    // 添加事件監聽器
    hamburger.addEventListener('click', toggleNavigation);

    // 點擊菜單項目後關閉菜單
    const navLinks = document.querySelectorAll('.navigation a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navigation.classList.remove('active');
        });
    });
});