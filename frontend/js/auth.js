(function () {
  const form = document.getElementById('authForm');
  const title = document.getElementById('authTitle');
  const subtitle = document.getElementById('authSubtitle');
  const formHeading = document.getElementById('formHeading');
  const formDescription = document.getElementById('formDescription');
  const submitButton = document.getElementById('submitButton');
  const googleButton = document.getElementById('googleButton');
  const googleButtonText = document.getElementById('googleButtonText');
  const switchPrompt = document.getElementById('switchPrompt');
  const switchModeButton = document.getElementById('switchModeButton');
  const statusBox = document.getElementById('authStatus');
  const nameField = document.getElementById('nameField');
  const confirmField = document.getElementById('confirmField');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const switchModeButtons = document.querySelectorAll('[data-switch-mode]');
  const modeFromUrl = new URLSearchParams(window.location.search).get('mode');
  let mode = modeFromUrl === 'login' ? 'login' : 'register';

  function setStatus(message, type) {
    statusBox.textContent = message;
    statusBox.classList.remove('is-error', 'is-success');

    if (type) {
      statusBox.classList.add(type);
    }
  }

  function updateMode(nextMode) {
    mode = nextMode === 'login' ? 'login' : 'register';
    const isLogin = mode === 'login';

    document.title = isLogin ? 'FinTrack - Вхід' : 'FinTrack - Реєстрація';
    title.textContent = isLogin ? 'Увійдіть у свій акаунт' : 'Створіть акаунт';
    subtitle.textContent = isLogin
      ? 'Форма готова для підключення бекенд-методу входу та авторизації через Google.'
      : 'Після підключення бекенду ця форма зможе створювати обліковий запис та запускати OAuth через Google.';
    formHeading.textContent = isLogin ? 'Вхід' : 'Реєстрація';
    formDescription.textContent = isLogin
      ? 'Використайте email і пароль для входу в існуючий акаунт.'
      : 'Заповніть форму, щоб почати користуватись FinTrack.';
    submitButton.textContent = isLogin ? 'Увійти' : 'Зареєструватися';
    googleButtonText.textContent = isLogin ? 'Увійти через Google' : 'Зареєструватися через Google';
    switchPrompt.textContent = isLogin ? 'Ще не маєте акаунта?' : 'Вже маєте акаунт?';
    switchModeButton.textContent = isLogin ? 'Реєстрація' : 'Увійти';
    nameField.hidden = isLogin;
    confirmField.hidden = isLogin;
    passwordInput.autocomplete = isLogin ? 'current-password' : 'new-password';
    confirmPasswordInput.required = !isLogin;

    window.history.replaceState({}, '', 'auth.html?mode=' + mode);
    setStatus(
      isLogin
        ? 'Форма входу готова. Після запуску бекенду метод login відправить дані на API.'
        : 'Форма реєстрації готова. Після запуску бекенду метод register відправить дані на API.',
      null
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      password: String(formData.get('password') || '')
    };

    if (!payload.email || !payload.password) {
      setStatus('Заповніть email та пароль.', 'is-error');
      return;
    }

    if (mode === 'register') {
      const confirmPassword = String(formData.get('confirmPassword') || '');

      if (!payload.name) {
        setStatus('Для реєстрації вкажіть ім\'я.', 'is-error');
        return;
      }

      if (payload.password !== confirmPassword) {
        setStatus('Паролі не співпадають.', 'is-error');
        return;
      }
    }

    setStatus('Надсилаю дані на бекенд...', null);

    try {
      const result = mode === 'login'
        ? await window.fintrackApi.login(payload)
        : await window.fintrackApi.register(payload);

      setStatus(result.message || 'Запит виконано успішно.', 'is-success');
    } catch (error) {
      setStatus(error.message || 'Не вдалося виконати запит до бекенду.', 'is-error');
    }
  }

  async function handleGoogleAuth() {
    setStatus('Ініціалізую вхід через Google...', null);

    try {
      const result = await window.fintrackApi.googleAuth(mode);
      setStatus(result.message || 'Google авторизацію ініційовано.', 'is-success');
    } catch (error) {
      setStatus(error.message || 'Не вдалося звернутися до Google endpoint.', 'is-error');
    }
  }

  switchModeButton.addEventListener('click', function () {
    updateMode(mode === 'login' ? 'register' : 'login');
  });

  switchModeButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      updateMode(button.getAttribute('data-switch-mode'));
    });
  });

  form.addEventListener('submit', handleSubmit);
  googleButton.addEventListener('click', handleGoogleAuth);

  updateMode(mode);
})();
