
import axios from 'axios';

// Configuração da instância do Axios para o backend
export const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Interceptor para injetar o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Exemplo de interceptor para tratar erros globais
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Sessão expirada. Redirecionando...');
      localStorage.removeItem('auth_token');
    }
    return Promise.reject(error);
  }
);

/**
 * Inicia o processo de checkout com Stripe
 */
export const createStripeCheckout = async () => {
  try {
    const response = await api.post('/payments/create-checkout-session');
    // O backend deve retornar a URL do checkout do Stripe
    if (response.data.url) {
      window.location.href = response.data.url;
    }
  } catch (error) {
    console.error("Erro ao iniciar Stripe Checkout:", error);
    alert("Erro ao processar pagamento. Tente novamente mais tarde.");
  }
};
