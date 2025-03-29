/**
 * 3D Space Background Animation
 * 創建沉浸式的3D宇宙空間效果，支持日/夜間模式
 */
document.addEventListener("DOMContentLoaded", function() {
    console.log("Space background initializing...");
    
    // 1. 創建 Canvas 元素
    const canvas = document.createElement('canvas');
    canvas.id = 'space-background';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';  // 確保在最底層
    canvas.style.pointerEvents = 'none';  // 不捕獲鼠標事件
    document.body.insertBefore(canvas, document.body.firstChild);
    
    // 2. 獲取繪圖上下文
    const ctx = canvas.getContext('2d');  // 移除 alpha 參數，使用默認設置
    
    // 3. 顏色設置
    const COLORS = {
        STARS: '#ffffff',  // 更亮的星星顏色
        STARS_RGB: '255, 255, 255'  // RGB格式，用於設置透明度
    };
    
    // 4. 星星參數
    const starCount = 800;  // 星星數量
    const stars = [];  // 存儲星星的數組
    
    // 5. 旋轉和動畫參數
    let angle = 0;  // 旋轉角度
    
    // 6. 鼠標位置 - 用於視差效果
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;
    
    // 7. 設置 Canvas 大小
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        console.log(`Canvas resized to: ${canvas.width}x${canvas.height}`);
    }
    
    // 8. 初始化 Canvas 大小
    resizeCanvas();
    
    // 9. 監聽窗口大小變化
    window.addEventListener('resize', resizeCanvas);
    
    // 10. 監聽鼠標移動
    document.addEventListener('mousemove', function(e) {
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
    });
    
    // 11. 創建星星 - 使用球面坐標確保均勻分布
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
    
    // 12. 初始化星星
    createStars();
    
    // 13. 更新鼠標位置 - 平滑過渡
    function updateMousePosition() {
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;
    }
    
    // 14. 繪製星星
    function drawStars() {
        // 清空畫布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 更新旋轉角度
        angle += 0.001; // 增加旋轉速度
        
        // 更新鼠標位置
        updateMousePosition();
        
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
            const rotatedZ = star.z * cosA + star.x * sinA;
            
            // 計算透視投影
            const scale = 400 / (400 + rotatedZ); // 透視投影比例
            
            // 應用視差效果
            const projectedX = centerX + rotatedX * scale + parallaxX * scale * 50;
            const projectedY = centerY + star.y * scale + parallaxY * scale * 50;
            
            // 計算大小和亮度
            const size = star.size * scale * twinkleFactor;
            const brightness = star.brightness * twinkleFactor;
            
            // 繪製星星
            ctx.beginPath();
            ctx.arc(projectedX, projectedY, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${COLORS.STARS_RGB}, ${brightness})`;
            ctx.fill();
        }
        
        // 添加調試信息
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '12px Arial';
        ctx.fillText(`Stars: ${stars.length}, Angle: ${angle.toFixed(3)}`, 10, 20);
    }
    
    // 15. 動畫循環
    function animate() {
        drawStars();
        requestAnimationFrame(animate);
    }
    
    // 16. 啟動動畫
    animate();
    
    // 17. 監聽主題變更
    document.addEventListener('themeChanged', function(e) {
        console.log('Theme changed to: ' + e.detail.theme);
        // 主題變更時不需要特別處理，因為星星顏色保持不變
    });
    
    console.log("Space background initialized");
});
