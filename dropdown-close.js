// 手機尺寸下，點擊 dropdown menu 以外自動關閉 menu
window.addEventListener('DOMContentLoaded', function() {
  var nav = document.querySelector('.navigation');
  var hamburger = document.querySelector('.hamburger');
  function isMobile() {
    return window.innerWidth <= 600;
  }
  document.addEventListener('click', function(e) {
    if (!isMobile()) return;
    if (!nav.classList.contains('active')) return;
    // 如果點擊在 menu 內（含 menu 本身或漢堡按鈕），不關閉
    if (nav.contains(e.target) || hamburger.contains(e.target)) return;
    nav.classList.remove('active');
    hamburger.classList.remove('active');
  });
});
