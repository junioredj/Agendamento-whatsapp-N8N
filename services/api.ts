
import axios from 'axios';
import { GoogleGenAI } from "@google/genai";

/**
 * Configuração do Axios para Laravel Sanctum
 */
export const api = axios.create({
  // Se o seu backend estiver em outra porta ou domínio, altere aqui.
  // Importante: Não coloque /api no final da baseURL se for usar rotas WEB (como /login)
  baseURL: 'http://localhost:8000', 
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Interceptor para injetar token se estiver usando Bearer (opcional para Sanctum com Cookies)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Erro 419: Token CSRF expirado
    if (error.response?.status === 419 && !originalRequest._retry) {
      originalRequest._retry = true;
      await fetchCsrfToken();
      return api(originalRequest);
    }

    // Erro 401: Não autorizado (Sessão caiu)
    if (error.response?.status === 401) {
      if (!window.location.hash.includes('/login')) {
        localStorage.removeItem('auth_token');
        window.location.href = '#/login';
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Handshake de Cookies do Sanctum
 */
export const fetchCsrfToken = async () => {
  try {
    // Rota padrão do Sanctum para setar o cookie XSRF-TOKEN
    await api.get('/sanctum/csrf-cookie');
    console.log("CSRF Cookie obtido com sucesso.");
  } catch (e) {
    console.error("Erro ao obter CSRF. Verifique se o domínio está no SANCTUM_STATEFUL_DOMAINS.", e);
    throw e;
  }
};

export const createStripeCheckout = async () => {
  try {
    const response = await api.post('/api/payments/create-checkout-session');
    if (response.data.url) window.location.href = response.data.url;
  } catch (error) {
    alert("Erro ao processar pagamento.");
  }
};

export const getAIInsights = async (stats: any) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analise: ${JSON.stringify(stats)}`,
    });
    return response.text;
  } catch (error) {
    return "Mantenha o foco na agenda de hoje!";
  }
};
