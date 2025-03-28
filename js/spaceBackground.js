/**
 * 3D Space Background Animation
 * 創建沉浸式的3D宇宙空間效果，支持日/夜間模式
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log("Space background initializing...");
    
    // 創建canvas元素
    const canvas = document.createElement('canvas');
    canvas.id = 'space-background';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    document.body.insertBefore(canvas, document.body.firstChild); // 確保canvas在最底層
    
    // 獲取canvas上下文
    const ctx = canvas.getContext('2d', { alpha: true }); // 確保支持透明度
    
    // 顏色設置 - 只定義星星顏色
    const COLORS = {
        STARS: '#e0e0e0',
        STARS_RGB: '224, 224, 224'
    };
    
    // 設置canvas大小
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        console.log(`Canvas resized to: ${canvas.width}x${canvas.height}`);
    }
    
    // 星星參數
    const starCount = 800; // 增加星星數量以增強沉浸感
    const stars = [];
    
    // 旋轉角度
    let angle = 0;
    
    // 鼠標位置 - 用於視差效果
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    
    // 流星參數
    const meteors = [];
    const meteorChance = 0.005; // 每幀產生流星的概率
    
    // 檢查當前模式
    function isDarkModeActive() {
        return document.documentElement.classList.contains('dark-mode');
    }
    
    // 創建星星 - 使用球面坐標確保均勻分布
    function createStars() {
        console.log("Creating stars...");
        for (let i = 0; i < starCount; i++) {
            // 使用球面坐標系統創建均勻分布的點
            const radius = 800 + Math.random() * 600; // 800-1400範圍內的半徑
            const theta = Math.random() * Math.PI * 2; // 0-2π
            const phi = Math.acos(2 * Math.random() - 1); // 0-π，確保均勻分布
            
            // 轉換為笛卡爾坐標
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
            
            // 添加星星，包含閃爍效果的參數
            stars.push({
                x: x,
                y: y,
                z: z,
                size: 0.5 + Math.random() * 1.5, // 0.5-2.0範圍內的大小
                brightness: 0.5 + Math.random() * 0.5, // 基礎亮度
                twinkleSpeed: 0.01 + Math.random() * 0.03, // 閃爍速度
                twinklePhase: Math.random() * Math.PI * 2 // 閃爍相位
            });
        }
        console.log(`Created ${stars.length} stars`);
    }
    
    // 創建流星
    function createMeteor() {
        // 從屏幕上方隨機位置開始
        const startX = Math.random() * canvas.width;
        const startY = -20; // 屏幕上方
        
        // 計算終點 - 對角線方向
        const endX = startX - 300 - Math.random() * 300;
        const endY = startY + 300 + Math.random() * 300;
        
        // 添加流星
        meteors.push({
            startX: startX,
            startY: startY,
            endX: endX,
            endY: endY,
            size: 1 + Math.random() * 2, // 流星大小
            speed: 10 + Math.random() * 20, // 移動速度
            progress: 0, // 動畫進度 (0-1)
            length: 50 + Math.random() * 100 // 流星尾巴長度
        });
    }
    
    // 更新流星位置
    function updateMeteors() {
        // 隨機產生新流星
        if (Math.random() < meteorChance && meteors.length < 3) {
            createMeteor();
        }
        
        // 更新現有流星
        for (let i = meteors.length - 1; i >= 0; i--) {
            const meteor = meteors[i];
            meteor.progress += meteor.speed / 1000;
            
            // 移除完成動畫的流星
            if (meteor.progress >= 1) {
                meteors.splice(i, 1);
            }
        }
    }
    
    // 繪製流星
    function drawMeteors() {
        for (let i = 0; i < meteors.length; i++) {
            const meteor = meteors[i];
            
            // 計算當前位置
            const x = meteor.startX + (meteor.endX - meteor.startX) * meteor.progress;
            const y = meteor.startY + (meteor.endY - meteor.startY) * meteor.progress;
            
            // 計算方向
            const angle = Math.atan2(meteor.endY - meteor.startY, meteor.endX - meteor.startX);
            
            // 繪製流星頭部
            ctx.beginPath();
            ctx.arc(x, y, meteor.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${COLORS.STARS_RGB}, 1)`;
            ctx.fill();
            
            // 繪製流星尾巴
            const gradientLength = meteor.length;
            const tailX = x - Math.cos(angle) * gradientLength;
            const tailY = y - Math.sin(angle) * gradientLength;
            
            const gradient = ctx.createLinearGradient(x, y, tailX, tailY);
            gradient.addColorStop(0, `rgba(${COLORS.STARS_RGB}, 0.8)`);
            gradient.addColorStop(1, `rgba(${COLORS.STARS_RGB}, 0)`);
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(tailX, tailY);
            ctx.lineWidth = meteor.size;
            ctx.strokeStyle = gradient;
            ctx.stroke();
        }
    }
    
    // 更新鼠標位置 - 平滑過渡
    function updateMousePosition() {
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;
    }
    
    // 繪製星星
    function drawStars() {
        // 完全清空畫布，包括背景
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 更新旋轉角度
        angle += 0.0005; // 緩慢旋轉
        
        // 更新鼠標位置
        updateMousePosition();
        
        // 更新流星
        updateMeteors();
        
        // 繪製所有星星
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // 計算鼠標引起的視差偏移
        const parallaxX = (mouseX - centerX) * 0.01;
        const parallaxY = (mouseY - centerY) * 0.01;
        
        for (let i = 0; i < stars.length; i++) {
            const star = stars[i];
            
            // 更新閃爍效果
            star.twinklePhase += star.twinkleSpeed;
            const twinkleFactor = 0.7 + 0.3 * Math.sin(star.twinklePhase);
            
            // 應用旋轉 - 繞Y軸
            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);
            
            const rotatedX = star.x * cosA - star.z * sinA;
            const rotatedZ = star.x * sinA + star.z * cosA;
            
            // 應用視差效果 - 根據深度調整
            const parallaxFactor = 1 - Math.abs(rotatedZ) / 1400;
            const parallaxOffsetX = parallaxX * parallaxFactor;
            const parallaxOffsetY = parallaxY * parallaxFactor;
            
            // 投影到2D屏幕
            const scale = 400 / (400 + rotatedZ); // 透視投影
            const x2d = rotatedX * scale + centerX + parallaxOffsetX;
            const y2d = star.y * scale + centerY + parallaxOffsetY;
            
            // 只繪製可見的星星
            if (x2d >= -50 && x2d <= canvas.width + 50 && 
                y2d >= -50 && y2d <= canvas.height + 50) {
                
                // 根據Z軸位置調整亮度
                const distanceFactor = 1 - Math.abs(rotatedZ) / 1400;
                const alpha = star.brightness * distanceFactor * twinkleFactor;
                
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
        
        // 繪製流星
        drawMeteors();
        
        // 持續動畫
        requestAnimationFrame(drawStars);
    }
    
    // 監聽鼠標移動
    document.addEventListener('mousemove', function(e) {
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
    });
    
    // 監聽主題切換
    document.addEventListener('themeChanged', function(e) {
        console.log(`Theme changed to: ${e.detail.theme}`);
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
