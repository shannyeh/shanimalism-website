/**
 * 3D Space Background Animation with Three.js
 * 創建沉浸式的3D宇宙空間效果，支持日/夜間模式
 */
document.addEventListener("DOMContentLoaded", function() {
    console.log("3D Space background initializing...");
    
    // 檢查 Three.js 是否正確載入
    if (typeof THREE === 'undefined') {
        console.error("Three.js library is not loaded! Please check your script references.");
        return;
    }
    
    // 全局變量
    let scene, camera, renderer;
    let stars = [];
    let isDarkMode = document.documentElement.classList.contains('dark-mode');
    let isRotating = true;
    
    // 初始化
    function init() {
        try {
            console.log("Initializing 3D space background...");
            
            // 創建場景
            scene = new THREE.Scene();
            
            // 創建相機
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 50;
            
            // 創建渲染器
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(isDarkMode ? 0x121212 : 0xf5f5f5);
            
            // 創建容器元素
            let container = document.getElementById('space-background');
            if (!container) {
                console.log("Creating new space-background container");
                container = document.createElement('div');
                container.id = 'space-background';
                container.style.position = 'fixed';
                container.style.top = '0';
                container.style.left = '0';
                container.style.width = '100%';
                container.style.height = '100%';
                container.style.zIndex = '-1';
                container.style.pointerEvents = 'none';
                document.body.insertBefore(container, document.body.firstChild);
            } else {
                console.log("Using existing space-background container");
                // 清空現有容器
                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }
            }
            
            // 添加渲染器到容器
            container.appendChild(renderer.domElement);
            console.log("Renderer added to container");
            
            // 添加環境光
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);
            
            // 添加定向光 - 模擬太陽光
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(1, 1, 1);
            scene.add(directionalLight);
            
            // 創建星星
            createStars();
            
            // 創建近距離星球
            createNearbyStars();
            
            // 添加窗口大小調整監聽器
            window.addEventListener('resize', onWindowResize, false);
            
            // 監聽主題變更
            document.addEventListener('themeChanged', function(event) {
                console.log("Theme changed event received in space background:", event.detail.theme);
                isDarkMode = event.detail.theme === 'dark';
                toggleTheme();
            });
            
            // 開始動畫循環
            animate();
            console.log("3D space background initialized successfully");
        } catch (error) {
            console.error("Error initializing 3D space background:", error);
        }
    }
    
    // 創建普通星星
    function createStars() {
        // 創建 1000 個普通星星
        for (let i = 0; i < 1000; i++) {
            // 隨機位置 - 在更大的空間中分布
            const distance = 50 + Math.random() * 900;
            const angle = Math.random() * Math.PI * 2;
            const height = -450 + Math.random() * 900;
            
            const x = distance * Math.cos(angle);
            const y = height;
            const z = distance * Math.sin(angle);
            
            // 隨機大小
            const size = 0.1 + Math.random() * 0.5;
            
            // 創建星星幾何體和材質
            const geometry = new THREE.SphereGeometry(size, 8, 8);
            const material = new THREE.MeshBasicMaterial({
                color: isDarkMode ? 0xe0e0e0 : 0x888888, // 日間模式使用更深的灰色
                transparent: true,
                opacity: isDarkMode ? (0.8 + Math.random() * 0.2) : (0.9 + Math.random() * 0.1) // 日間模式更不透明
            });
            
            // 創建網格
            const star = new THREE.Mesh(geometry, material);
            star.position.set(x, y, z);
            
            // 添加閃爍效果參數
            star.userData = {
                twinkleSpeed: 0.01 + Math.random() * 0.03,
                twinklePhase: Math.random() * Math.PI * 2,
                originalOpacity: material.opacity,
                originalSize: size
            };
            
            scene.add(star);
            stars.push(star);
        }
        
        console.log("Added distant stars");
    }
    
    // 創建近距離星球體
    function createNearbyStars() {
        // 創建 10 個大型近距離星球
        for (let i = 0; i < 10; i++) {
            // 在更廣闊的空間中分布星球
            const distance = 150 + Math.random() * 500;
            const angle = Math.random() * Math.PI * 2;
            const height = -150 + Math.random() * 300;
            
            const x = distance * Math.cos(angle);
            const y = height;
            const z = distance * Math.sin(angle);
            
            // 隨機大小 - 比普通星星大得多
            const size = 5 + Math.random() * 15;
            
            // 為每顆星球生成獨特的種子
            const planetSeed = Math.random() * 10000;
            
            // 決定星球類型 - 每顆星球都不同
            const planetType = Math.floor(Math.random() * 5); // 0-4 五種不同類型的星球
            
            // 創建更複雜的星球形狀
            // 使用更高細分度的球體作為基礎
            const geometry = new THREE.SphereGeometry(size, 64, 64);
            
            // 添加更真實的星球表面變形
            const positionAttribute = geometry.getAttribute('position');
            const vertex = new THREE.Vector3();
            
            // 使用柏林噪聲模擬函數 - 加入種子使每顆星球獨特
            function noise3D(x, y, z, scale) {
                // 簡化的柏林噪聲模擬，加入星球種子
                const X = Math.floor(x * scale + planetSeed);
                const Y = Math.floor(y * scale + planetSeed);
                const Z = Math.floor(z * scale + planetSeed);
                
                // 使用正弦函數創建偽隨機值
                return Math.sin(X * 12.9898 + Y * 78.233 + Z * 37.719) * 43758.5453 % 1;
            }
            
            // 分形噪聲函數 - 模擬真實地形
            function fractalNoise(x, y, z, octaves, persistence) {
                // 多個頻率的噪聲疊加
                let noise = 0;
                let amplitude = 1.0;
                let frequency = 1.0;
                let maxValue = 0;
                
                for (let i = 0; i < octaves; i++) {
                    // 不同頻率和振幅的噪聲疊加
                    noise += amplitude * noise3D(x * frequency, y * frequency, z * frequency, 1);
                    maxValue += amplitude;
                    amplitude *= persistence; // 每層振幅變化
                    frequency *= 2.0; // 每層頻率翻倍
                }
                
                // 標準化
                return noise / maxValue;
            }
            
            // 應用噪聲到每個頂點
            for (let i = 0; i < positionAttribute.count; i++) {
                vertex.fromBufferAttribute(positionAttribute, i);
                const normalizedPos = vertex.clone().normalize();
                
                // 根據星球類型應用不同的地形特徵
                let totalNoise = 0;
                
                switch(planetType) {
                    case 0: // 類地行星 - 山脈、海洋和大陸
                        const continents = fractalNoise(normalizedPos.x, normalizedPos.y, normalizedPos.z, 6, 0.65) * 0.25;
                        const mountains = fractalNoise(normalizedPos.x * 3, normalizedPos.y * 3, normalizedPos.z * 3, 4, 0.5) * 0.1;
                        // 只在大陸上添加山脈
                        totalNoise = continents + (continents > 0.12 ? mountains : 0);
                        break;
                        
                    case 1: // 類月球 - 大量隕石坑
                        const baseTerrain = fractalNoise(normalizedPos.x, normalizedPos.y, normalizedPos.z, 3, 0.5) * 0.1;
                        // 大量隕石坑
                        for (let c = 0; c < 10; c++) {
                            const craterSeed = noise3D(c, c, c, 1) * 10;
                            const craterSize = 0.5 + noise3D(c+1, c+1, c+1, 1) * 2;
                            const craterX = noise3D(c+2, 0, 0, 1) * 2 - 1;
                            const craterY = noise3D(0, c+2, 0, 1) * 2 - 1;
                            const craterZ = noise3D(0, 0, c+2, 1) * 2 - 1;
                            const craterPos = new THREE.Vector3(craterX, craterY, craterZ).normalize();
                            
                            // 計算點到隕石坑中心的距離
                            const dist = normalizedPos.distanceTo(craterPos);
                            
                            // 如果在隕石坑範圍內，添加凹陷
                            if (dist < craterSize * 0.15) {
                                const craterDepth = 0.15 * (1 - dist / (craterSize * 0.15));
                                totalNoise -= craterDepth;
                            }
                        }
                        totalNoise += baseTerrain;
                        break;
                        
                    case 2: // 氣態巨行星 - 平滑的條紋
                        // 水平條紋
                        const bands = Math.sin(normalizedPos.y * 10 + planetSeed) * 0.05;
                        // 大型風暴
                        const storms = fractalNoise(normalizedPos.x * 2, normalizedPos.y * 2, normalizedPos.z * 2, 3, 0.7) * 0.1;
                        totalNoise = bands + storms * 0.5;
                        break;
                        
                    case 3: // 火山行星 - 大量火山和熔岩流
                        const baseSurface = fractalNoise(normalizedPos.x, normalizedPos.y, normalizedPos.z, 4, 0.5) * 0.15;
                        // 添加火山錐
                        for (let v = 0; v < 5; v++) {
                            const volcanoX = noise3D(v, 0, 0, 1) * 2 - 1;
                            const volcanoY = noise3D(0, v, 0, 1) * 2 - 1;
                            const volcanoZ = noise3D(0, 0, v, 1) * 2 - 1;
                            const volcanoPos = new THREE.Vector3(volcanoX, volcanoY, volcanoZ).normalize();
                            
                            // 計算點到火山中心的距離
                            const dist = normalizedPos.distanceTo(volcanoPos);
                            
                            // 如果在火山範圍內，添加凸起
                            if (dist < 0.3) {
                                const volcanoHeight = 0.3 * (1 - dist / 0.3);
                                totalNoise += volcanoHeight * volcanoHeight * 0.5;
                            }
                        }
                        totalNoise += baseSurface;
                        break;
                        
                    case 4: // 冰凍行星 - 冰川和裂縫
                        const iceSurface = fractalNoise(normalizedPos.x, normalizedPos.y, normalizedPos.z, 5, 0.6) * 0.1;
                        // 添加冰川裂縫
                        const cracks = (Math.abs(fractalNoise(normalizedPos.x * 8, normalizedPos.y * 8, normalizedPos.z * 8, 2, 0.9)) - 0.5) * 0.1;
                        totalNoise = iceSurface + cracks;
                        break;
                }
                
                // 添加通用的小型表面細節
                const detailNoise = fractalNoise(normalizedPos.x * 15, normalizedPos.y * 15, normalizedPos.z * 15, 2, 0.5) * 0.03;
                totalNoise += detailNoise;
                
                // 應用噪聲，但保持整體形狀
                vertex.normalize().multiplyScalar(size * (1 + totalNoise));
                
                // 更新頂點
                positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
            }
            
            // 更新法線
            geometry.computeVertexNormals();
            
            // 選擇星球顏色 - 根據星球類型
            let starColor;
            let colorChoice = Math.random();
            
            // 根據星球類型選擇顏色
            if (isDarkMode) {
                // 夜間模式顏色
                switch(planetType) {
                    case 0: // 類地行星 - 藍綠色調
                        starColor = colorChoice > 0.5 ? 0x446677 : 0x335566;
                        break;
                    case 1: // 類月球 - 灰色調
                        starColor = colorChoice > 0.5 ? 0x888888 : 0x777777;
                        break;
                    case 2: // 氣態巨行星 - 棕黃色調
                        starColor = colorChoice > 0.5 ? 0xaa8866 : 0x997755;
                        break;
                    case 3: // 火山行星 - 紅色調
                        starColor = colorChoice > 0.5 ? 0x993333 : 0x882222;
                        break;
                    case 4: // 冰凍行星 - 藍白色調
                        starColor = colorChoice > 0.5 ? 0xaabbcc : 0x99aacc;
                        break;
                }
            } else {
                // 日間模式顏色 - 使用更深的顏色以增強可見度
                switch(planetType) {
                    case 0: // 類地行星 - 深藍綠色調
                        starColor = colorChoice > 0.5 ? 0x446688 : 0x335577;
                        break;
                    case 1: // 類月球 - 深灰色調
                        starColor = colorChoice > 0.5 ? 0x666666 : 0x555555;
                        break;
                    case 2: // 氣態巨行星 - 深棕黃色調
                        starColor = colorChoice > 0.5 ? 0x996633 : 0x885522;
                        break;
                    case 3: // 火山行星 - 深紅色調
                        starColor = colorChoice > 0.5 ? 0x992222 : 0x881111;
                        break;
                    case 4: // 冰凍行星 - 深藍色調
                        starColor = colorChoice > 0.5 ? 0x4477aa : 0x336699;
                        break;
                }
            }
            
            // 創建材質 - 根據星球類型調整參數
            const material = new THREE.MeshStandardMaterial({
                color: starColor,
                roughness: planetType === 1 ? 0.9 : (planetType === 4 ? 0.3 : 0.7),  // 月球最粗糙，冰凍行星最光滑
                metalness: planetType === 3 ? 0.3 : 0.1,  // 火山行星稍微金屬感強一些
                transparent: false,
                flatShading: planetType === 1 || planetType === 3  // 月球和火山行星使用平面著色
            });
            
            // 創建網格
            const star = new THREE.Mesh(geometry, material);
            star.position.set(x, y, z);
            
            // 添加隨機旋轉
            star.rotation.x = Math.random() * Math.PI;
            star.rotation.y = Math.random() * Math.PI;
            star.rotation.z = Math.random() * Math.PI;
            
            // 添加閃爍效果參數 - 較慢的閃爍
            star.userData = {
                twinkleSpeed: 0.005 + Math.random() * 0.01, // 較慢的閃爍
                twinklePhase: Math.random() * Math.PI * 2,
                originalOpacity: 1.0, // 完全不透明
                originalSize: size,
                darkModeColor: starColor,
                lightModeColor: starColor, // 保持相同的顏色，只是亮度不同
                isNearby: true, // 標記為近距離星球
                planetType: planetType, // 記錄星球類型
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.001,
                    y: (Math.random() - 0.5) * 0.001,
                    z: (Math.random() - 0.5) * 0.001
                }
            };
            
            scene.add(star);
            stars.push(star);
        }
        
        console.log("Added diverse planet-like celestial bodies");
    }
    
    // 切換主題
    function toggleTheme() {
        renderer.setClearColor(isDarkMode ? 0x121212 : 0xf5f5f5);
        
        // 更新星球顏色
        stars.forEach(star => {
            if (star.userData.isNearby) {
                // 更新近距離星球的顏色
                star.material.color.setHex(isDarkMode ? star.userData.darkModeColor : star.userData.lightModeColor);
            }
        });
    }
    
    // 窗口大小調整處理
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // 動畫循環
    function animate() {
        requestAnimationFrame(animate);
        
        // 更新星星
        const time = Date.now() * 0.001;
        
        stars.forEach(star => {
            // 閃爍效果
            const twinkle = Math.sin(time * star.userData.twinkleSpeed + star.userData.twinklePhase) * 0.1 + 0.9;
            
            if (!star.userData.isNearby) {
                // 普通星星閃爍
                star.material.opacity = star.userData.originalOpacity * twinkle;
            } else {
                // 近距離星球旋轉
                if (isRotating) {
                    star.rotation.x += star.userData.rotationSpeed.x;
                    star.rotation.y += star.userData.rotationSpeed.y;
                    star.rotation.z += star.userData.rotationSpeed.z;
                }
            }
        });
        
        // 緩慢旋轉整個場景
        if (isRotating) {
            scene.rotation.y += 0.0005;
        }
        
        renderer.render(scene, camera);
    }
    
    // 啟動
    init();
});
