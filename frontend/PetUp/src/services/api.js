import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined' && token.split('.').length === 3) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token adicionado ao cabeçalho:', token);
    } else {
      console.warn('Nenhum token válido encontrado no localStorage ou token malformado');
    }
    return config;
  },
  (error) => {
    console.error('Erro no interceptor de requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (error.config.url !== '/auth/login') {
        console.log('Erro 401 detectado, limpando token e redirecionando para /login');
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        window.location.href = '/login';
      }
    }
    console.error('Erro na resposta da API:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const checkLoginStatus = async () => {
  try {
    const response = await api.get('/auth/check');
    console.log('Resposta do /auth/check:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao verificar status:', error.response?.status, error.response?.data || error.message);
    throw error;
  }
};

export const loginWithGoogle = () => {
  console.log('Iniciando login com Google');
  window.location.href = 'http://localhost:8080/oauth2/authorization/google';
};

export const handleGoogleLoginCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  if (token && token.split('.').length === 3) {
    console.log('Token recebido na URL:', token);
    localStorage.setItem('token', token);
    try {
      const data = await checkLoginStatus();
      const userName = data.name || 'Usuário';
      localStorage.setItem('userName', userName);
      console.log('Nome do usuário salvo no localStorage:', userName);
      window.history.replaceState({}, document.title, window.location.pathname);
      return true;
    } catch (error) {
      console.error('Erro ao processar callback do Google:', error.response?.status, error.response?.data || error.message);
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      return false;
    }
  } else {
    console.log('Nenhum token válido encontrado na URL');
    return false;
  }
};

export const loginManual = async (email, password) => {
  try {
    console.log('Tentando login manual com email:', email);
    const response = await api.post('/auth/login', { email, password });
    console.log('Resposta completa do login manual:', response);
    const token = response.data;

    if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
      console.error('Token inválido recebido:', token);
      throw new Error('Token JWT inválido recebido do backend');
    }

    localStorage.setItem('token', token);
    console.log('Token salvo no localStorage:', localStorage.getItem('token'));

    const data = await checkLoginStatus();
    const userName = data.name || 'Usuário';
    localStorage.setItem('userName', userName);
    console.log('Nome do usuário salvo no localStorage:', userName);
    return true;
  } catch (error) {
    console.error('Erro no login manual:', error.message, error.stack);
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  console.log('Logout realizado, redirecionando para /login');
  window.location.href = '/login';
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    console.log('Resposta do forgot-password:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao solicitar redefinição de senha:', error.response?.data || error.message);
    throw error;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    console.log('Resposta do reset-password:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao redefinir senha:', error.response?.data || error.message);
    throw error;
  }
};

export default api;