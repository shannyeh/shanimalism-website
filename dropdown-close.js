// dropdown menu close button event
window.addEventListener('DOMContentLoaded', function() {
  var closeBtn = document.querySelector('.dropdown-close-btn');
  var nav = document.querySelector('.navigation');
  if (closeBtn && nav) {
    closeBtn.addEventListener('click', function() {
      nav.classList.remove('active');
    });
  }
});
