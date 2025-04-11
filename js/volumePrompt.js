/**
 * 宇宙風格音量提示功能
 * 當音樂自動播放時，顯示宇宙風格的提示來引導用戶調整音量
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('音量提示腳本已載入');
    
    // 獲取DOM元素
    const volumePrompt = document.querySelector('.volume-prompt');
    const closeBtn = document.querySelector('.volume-prompt-close');
    const actionBtn = document.querySelector('.volume-prompt-action');
    
    // 確認元素存在
    if (!volumePrompt) {
        console.error('找不到音量提示元素');
        return;
    }
    
    if (!closeBtn) {
        console.error('找不到關閉按鈕元素');
        return;
    }
    
    // 加入更多星星的動畫效果
    addCosmicEffects();
    
    // 直接顯示提示（用於測試）
    setTimeout(function() {
        console.log('顯示音量提示');
        volumePrompt.classList.add('show');
        volumePrompt.style.display = 'block';
        
        // 20秒後自動隱藏提示
        setTimeout(function() {
            hidePrompt();
        }, 20000);
    }, 1000);
    
    // 點擊關閉按鈕隱藏提示 - 直接使用onclick屬性
    closeBtn.onclick = function() {
        console.log('關閉按鈕被點擊');
        hidePrompt();
        return false; // 防止事件冒泡
    };
    
    // 點擊校準音量按鈕
    actionBtn.addEventListener('click', function() {
        // 獲取音樂播放器實例
        const volumeSlider = document.querySelector('.volume-slider');
        if (volumeSlider) {
            // 設置音量為70%
            volumeSlider.value = 0.7;
            // 觸發輸入事件來更新音量
            const event = new Event('input');
            volumeSlider.dispatchEvent(event);
            
            // 如果有音樂播放器的音量設置方法，也直接調用
            const audio = document.querySelector('audio');
            if (audio) {
                audio.volume = 0.7;
            }
        }
        
        // 隱藏提示
        hidePrompt();
    });
    
    // 隱藏提示函數
    function hidePrompt() {
        console.log('執行 hidePrompt 函數');
        try {
            // 確保元素存在
            if (!volumePrompt) {
                throw new Error('找不到音量提示元素');
            }
            
            // 移除顯示類名
            volumePrompt.classList.remove('show');
            // 添加隱藏類名
            volumePrompt.classList.add('hidden');
            // 直接設置為不可見
            volumePrompt.style.display = 'none';
            // 記錄已顯示
            sessionStorage.setItem('volumePromptShown', 'true');
            
            console.log('提示框已成功隱藏');
        } catch (error) {
            console.error('隱藏提示框時發生錯誤:', error);
        }
    }
    
    // 監聽音量變化
    const volumeSlider = document.querySelector('.volume-slider');
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            // 如果用戶調整了音量，隱藏提示
            if (parseFloat(this.value) > 0) {
                hidePrompt();
            }
        });
        
        // 檢查初始音量是否為0
        if (parseFloat(volumeSlider.value) === 0) {
            // 如果初始音量為0，顯示提示
            setTimeout(function() {
                volumePrompt.classList.add('show');
            }, 3000);
        }
    }
    
    // 加入宇宙效果
    function addCosmicEffects() {
        // 加入更多星星
        for (let i = 0; i < 15; i++) {
            const star = document.createElement('span');
            star.className = 'cosmic-star';
            star.style.top = `${Math.random() * 100}%`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.width = `${Math.random() * 2 + 1}px`;
            star.style.height = star.style.width;
            star.style.animationDelay = `${Math.random() * 3}s`;
            star.style.animationDuration = `${Math.random() * 3 + 1}s`;
            volumePrompt.appendChild(star);
        }
    }
});
