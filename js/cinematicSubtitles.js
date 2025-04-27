// cinematicSubtitles.js
// 動態電影字幕跑馬燈效果

const cinematicLines = [
  "Somewhere beyond the noise, there’s a place where ideas float like stars.",
  "At barebreathe, every breath sparks a new constellation.",
  "Come find yours."
];

function showCinematicSubtitles() {
  // 隱藏 hero 區域
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    heroSection.style.opacity = '0';
    heroSection.style.pointerEvents = 'none';
  }

  // 建立字幕容器
  let subtitleContainer = document.getElementById('cinematic-subtitles');
  if (!subtitleContainer) {
    subtitleContainer = document.createElement('div');
    subtitleContainer.id = 'cinematic-subtitles';
    document.body.appendChild(subtitleContainer);
  }
  subtitleContainer.innerHTML = '';
  subtitleContainer.style.display = 'flex';

  // 電影字幕：淡入淡出逐行顯示
  let lineIdx = 0;
  function showLine() {
    if (lineIdx >= cinematicLines.length) {
      // 全部結束後自動淡出字幕容器
      setTimeout(() => {
        subtitleContainer.classList.add('fade-out');
      }, 1400);
      setTimeout(() => {
        subtitleContainer.style.display = 'none';
      }, 2200);
      return;
    }
    const line = cinematicLines[lineIdx];
    const lineElem = document.createElement('div');
    lineElem.className = 'cinematic-line';
    lineElem.textContent = line;
    lineElem.style.opacity = '0';
    subtitleContainer.appendChild(lineElem);
    // 淡入
    setTimeout(() => {
      lineElem.style.opacity = '1';
      lineElem.classList.add('line-finished');
    }, 80);
    // 停留一段時間後淡出
    setTimeout(() => {
      lineElem.style.opacity = '0';
      setTimeout(() => {
        lineElem.remove();
        lineIdx++;
        showLine();
      }, 700);
    }, 2200);
  }
  showLine();
}

// 事件綁定
window.addEventListener('DOMContentLoaded', function () {
  const symbolBtn = document.querySelector('.hero-symbol-btn');
  if (symbolBtn) {
    symbolBtn.addEventListener('click', function (e) {
      e.preventDefault();
      showCinematicSubtitles();
    });
  }
});

// 支援 ESC 跳過字幕
window.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const subtitleContainer = document.getElementById('cinematic-subtitles');
    if (subtitleContainer) subtitleContainer.style.display = 'none';
    // 可選：恢復 hero 區域或進入主頁內容
  }
});
