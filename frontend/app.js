window.fintrackApi = (function () {
  const API_BASE_URL = 'http://localhost:3000/api/auth';

  async function request(path, payload) {
    const response = await fetch(API_BASE_URL + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      let message = 'Помилка запиту до сервера.';

      try {
        const errorData = await response.json();
        message = errorData.message || message;
      } catch (error) {
        // Keep default error message when backend does not return JSON.
      }

      throw new Error(message);
    }

    return response.json();
  }

  return {
    register: function (payload) {
      return request('/register', payload);
    },
    login: function (payload) {
      return request('/login', payload);
    },
    googleAuth: function (mode) {
      return request('/google', { mode: mode });
    }
  };
})();
