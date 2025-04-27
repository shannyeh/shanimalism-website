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

  // 建立按鈕區域
  let btnGroup = document.createElement('div');
  btnGroup.className = 'cinematic-btn-group';
  subtitleContainer.appendChild(btnGroup);
  // 下一條按鈕
  let nextBtn = document.createElement('button');
  nextBtn.className = 'cinematic-btn next-btn';
  nextBtn.textContent = 'Next';
  btnGroup.appendChild(nextBtn);
  // Skip 按鈕
  let skipBtn = document.createElement('button');
  skipBtn.className = 'cinematic-btn skip-btn';
  skipBtn.textContent = 'Skip';
  btnGroup.appendChild(skipBtn);

  let lineIdx = 0;
  let isSkipping = false;

  function endSubtitles() {
    subtitleContainer.classList.add('fade-out');
    setTimeout(() => {
      subtitleContainer.style.display = 'none';
    }, 800);
  }

  function appendLine() {
    if (isSkipping) return;
    if (lineIdx >= cinematicLines.length) {
      endSubtitles();
      return;
    }
    const line = cinematicLines[lineIdx];
    const lineElem = document.createElement('div');
    lineElem.className = 'cinematic-line';
    lineElem.textContent = line;
    lineElem.style.opacity = '0';
    subtitleContainer.insertBefore(lineElem, btnGroup);
    setTimeout(() => {
      lineElem.style.opacity = '1';
      lineElem.classList.add('line-finished');
    }, 40);
    lineIdx++;
    // 控制 Next 按鈕狀態
    if (lineIdx >= cinematicLines.length) {
      nextBtn.style.display = 'none';
    }
  }

  // 下一條按鈕事件
  nextBtn.onclick = function(e) {
    e.preventDefault();
    appendLine();
  };
  // Skip 按鈕事件
  skipBtn.onclick = function(e) {
    e.preventDefault();
    isSkipping = true;
    endSubtitles();
  };

  // 支援 ESC 跳過字幕
  window._cinematicSubtitleEscHandler = function(e) {
    if (e.key === 'Escape') {
      isSkipping = true;
      endSubtitles();
    }
  };
  window.addEventListener('keydown', window._cinematicSubtitleEscHandler);

  // 清理事件（字幕結束時）
  subtitleContainer.addEventListener('transitionend', function cleanup() {
    if (subtitleContainer.style.display === 'none') {
      window.removeEventListener('keydown', window._cinematicSubtitleEscHandler);
      subtitleContainer.removeEventListener('transitionend', cleanup);
    }
  });

  // 初始第一句
  appendLine();

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
