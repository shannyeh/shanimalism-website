/**
 * 3D Space Background Effect
 * 為網站創建宇宙空間背景效果，包括隨機生成的閃爍星星
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Space background script loaded');
    
    // 創建星星容器
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';
    document.body.appendChild(starsContainer);
    console.log('Stars container created and appended to body');
    
    // 星星數量 - 根據屏幕大小調整
    const starCount = Math.min(Math.floor(window.innerWidth * window.innerHeight / 1000), 200);
    console.log(`Creating ${starCount} stars`);
    
    // 生成星星
    for (let i = 0; i < starCount; i++) {
        createStar(starsContainer);
    }
    
    // 添加視差效果 - 滾動時星星微移
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        starsContainer.style.transform = `translateY(${scrollY * 0.05}px)`;
    });
    
    // 窗口大小改變時重新生成星星
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // 清除現有星星
            starsContainer.innerHTML = '';
            // 重新計算星星數量
            const newStarCount = Math.min(Math.floor(window.innerWidth * window.innerHeight / 1000), 200);
            // 重新生成星星
            for (let i = 0; i < newStarCount; i++) {
                createStar(starsContainer);
            }
        }, 200);
    });
});

/**
 * 創建單個星星
 * @param {HTMLElement} container - 星星的容器元素
 */
function createStar(container) {
    const star = document.createElement('div');
    star.className = 'star';
    
    // 隨機位置
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    // 隨機大小 (0.5px - 2px)
    const size = Math.random() * 1.5 + 0.5;
    
    // 隨機閃爍持續時間 (3-8秒)
    const duration = Math.random() * 5 + 3;
    
    // 隨機亮度 (0.3-1)
    const opacity = Math.random() * 0.7 + 0.3;
    
    // 隨機延遲開始時間
    const delay = Math.random() * 10;
    
    // 設置星星樣式
    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.setProperty('--duration', `${duration}s`);
    star.style.setProperty('--opacity', opacity);
    star.style.animationDelay = `${delay}s`;
    
    // 添加到容器
    container.appendChild(star);
    
    // 為較亮的星星添加光暈效果
    if (size > 1.5 && Math.random() > 0.7) {
        star.style.boxShadow = `0 0 ${size * 2}px rgba(255, 255, 255, ${opacity * 0.5})`;
    }
    
    // 為少數星星添加彩色效果
    if (Math.random() > 0.9) {
        const hue = Math.random() * 60 + 180; // 藍色到紫色範圍
        star.style.backgroundColor = `hsla(${hue}, 100%, 80%, ${opacity})`;
        if (size > 1.2) {
            star.style.boxShadow = `0 0 ${size * 3}px hsla(${hue}, 100%, 70%, ${opacity * 0.6})`;
        }
    }
}

// 添加隨機流星效果
setInterval(function() {
    if (Math.random() > 0.7) { // 30%的機率出現流星
        createShootingStar();
    }
}, 8000);

/**
 * 創建流星效果
 */
function createShootingStar() {
    console.log('Creating shooting star');
    const shootingStar = document.createElement('div');
    shootingStar.className = 'shooting-star';
    
    // 隨機起始位置 (總是從屏幕上方或右側開始)
    const startFromTop = Math.random() > 0.5;
    const x = startFromTop ? Math.random() * 100 : 100;
    const y = startFromTop ? 0 : Math.random() * 50;
    
    // 隨機長度和角度
    const length = Math.random() * 150 + 100;
    const angle = Math.random() * 50 + 20; // 20-70度角
    
    // 設置流星樣式
    shootingStar.style.left = `${x}%`;
    shootingStar.style.top = `${y}%`;
    shootingStar.style.width = `${length}px`;
    shootingStar.style.transform = `rotate(${angle}deg)`;
    
    // 添加到星星容器
    const starsContainer = document.querySelector('.stars');
    if (starsContainer) {
        starsContainer.appendChild(shootingStar);
        console.log('Shooting star added to container');
        
        // 動畫結束後移除流星
        setTimeout(() => {
            shootingStar.remove();
        }, 1000);
    } else {
        console.error('Stars container not found');
    }
}
