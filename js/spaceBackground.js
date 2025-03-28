// 3D Space Background Animation
document.addEventListener('DOMContentLoaded', function() {
    console.log("Space background initializing...");
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'space-background';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    // Get canvas context
    const ctx = canvas.getContext('2d');
    
    // 固定顏色設置
    const COLORS = {
        DAY_MODE: {
            BACKGROUND: '#f5f5f5', // 米白色背景
            BACKGROUND_RGB: '245, 245, 245'
        },
        NIGHT_MODE: {
            BACKGROUND: '#121212', // 深灰黑色背景
            BACKGROUND_RGB: '18, 18, 18'
        },
        STARS: '#e0e0e0',      // 淡灰色星星 (固定)
        STARS_RGB: '224, 224, 224'
    };
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        console.log("Canvas resized to: " + canvas.width + "x" + canvas.height);
    }
    
    // 星星參數
    const starCount = 500;
    const stars = [];
    
    // 旋轉角度
    let angle = 0;
    
    // 檢查當前模式
    function isDarkModeActive() {
        return document.documentElement.classList.contains('dark-mode');
    }
    
    // 創建星星
    function createStars() {
        console.log("Creating stars...");
        for (let i = 0; i < starCount; i++) {
            // 創建3D空間中的隨機點
            const radius = 800 + Math.random() * 400; // 800-1200範圍內的半徑
            const theta = Math.random() * Math.PI * 2; // 0-2π
            const phi = Math.acos(2 * Math.random() - 1); // 0-π
            
            // 轉換為笛卡爾坐標
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
            
            // 添加星星
            stars.push({
                x: x,
                y: y,
                z: z,
                size: 0.5 + Math.random() * 1.5,
                brightness: 0.5 + Math.random() * 0.5
            });
        }
        console.log(`Created ${stars.length} stars`);
    }
    
    // 繪製星星
    function drawStars() {
        // 清空畫布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 繪製背景
        ctx.fillStyle = isDarkModeActive() ? COLORS.NIGHT_MODE.BACKGROUND : COLORS.DAY_MODE.BACKGROUND;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 更新旋轉角度
        angle += 0.001;
        
        // 繪製所有星星
        for (let i = 0; i < stars.length; i++) {
            const star = stars[i];
            
            // 應用旋轉 - 繞Y軸
            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);
            
            const rotatedX = star.x * cosA - star.z * sinA;
            const rotatedZ = star.x * sinA + star.z * cosA;
            
            // 投影到2D屏幕
            const scale = 400 / (400 + rotatedZ); // 透視投影
            const x2d = rotatedX * scale + canvas.width / 2;
            const y2d = star.y * scale + canvas.height / 2;
            
            // 只繪製可見的星星
            if (x2d >= -100 && x2d <= canvas.width + 100 && 
                y2d >= -100 && y2d <= canvas.height + 100) {
                
                // 根據Z軸位置調整亮度
                const alpha = star.brightness * (1 - Math.abs(rotatedZ) / 1200);
                
                // 繪製星星
                ctx.beginPath();
                ctx.arc(x2d, y2d, star.size * scale, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${COLORS.STARS_RGB}, ${alpha})`;
                ctx.fill();
                
                // 在夜間模式添加光暈
                if (isDarkModeActive() && star.size > 1) {
                    ctx.beginPath();
                    ctx.arc(x2d, y2d, star.size * scale * 2, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${COLORS.STARS_RGB}, ${alpha * 0.2})`;
                    ctx.fill();
                }
            }
        }
        
        // 持續動畫
        window.requestAnimationFrame(drawStars);
    }
    
    // 監聽主題切換
    const observer = new MutationObserver(function(mutations) {
        console.log("Theme changed");
    });
    
    observer.observe(document.documentElement, { 
        attributes: true,
        attributeFilter: ['class']
    });
    
    // 監聽窗口大小變化
    window.addEventListener('resize', resizeCanvas);
    
    // 初始化
    resizeCanvas();
    createStars();
    
    // 開始動畫
    console.log("Starting animation...");
    drawStars();
});
