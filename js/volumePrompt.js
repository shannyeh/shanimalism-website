/**
 * 宇宙風格音量提示功能
 * 當音樂自動播放時，顯示宇宙風格的提示來引導用戶調整音量
 */
document.addEventListener('DOMContentLoaded', function() {
    // 獲取DOM元素
    const volumePrompt = document.querySelector('.volume-prompt');
    const closeBtn = document.querySelector('.volume-prompt-close');
    const actionBtn = document.querySelector('.volume-prompt-action');
    
    // 加入更多星星的動畫效果
    addCosmicEffects();
    
    // 檢查是否已經顯示過提示（使用sessionStorage記錄，每次會話只顯示一次）
    const hasShownPrompt = sessionStorage.getItem('volumePromptShown');
    
    // 如果沒有顯示過提示，則顯示
    if (!hasShownPrompt) {
        // 延遞3秒後顯示提示，確保頁面已完全加載
        setTimeout(function() {
            volumePrompt.classList.add('show');
            
            // 20秒後自動隱藏提示
            setTimeout(function() {
                hidePrompt();
            }, 20000);
        }, 3000);
    }
    
    // 點擊關閉按鈕隱藏提示
    closeBtn.addEventListener('click', function() {
        hidePrompt();
    });
    
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
    
    // 隱藏提示並記錄已顯示
    function hidePrompt() {
        volumePrompt.classList.remove('show');
        sessionStorage.setItem('volumePromptShown', 'true');
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
