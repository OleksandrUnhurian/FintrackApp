(function () {
  const authButtons = document.querySelectorAll('[data-auth-target]');

  authButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      const mode = button.getAttribute('data-auth-target') || 'register';
      window.location.href = 'auth.html?mode=' + encodeURIComponent(mode);
    });
  });
})();
