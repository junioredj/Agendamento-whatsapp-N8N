
import axios from 'axios';
import { GoogleGenAI } from "@google/genai";

// Configuração da instância do Axios para o seu backend Laravel
export const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Interceptor de Requisição: Injeta o Bearer Token do Sanctum
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de Resposta: Trata erros 401 (Não autorizado/Token expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Sessão expirada ou inválida no Laravel Sanctum.');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_name');
      if (!window.location.hash.includes('/login')) {
        window.location.href = '#/login';
      }
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
    if (response.data.url) {
      window.location.href = response.data.url;
    }
  } catch (error) {
    console.error("Erro ao iniciar Stripe Checkout:", error);
    alert("Erro ao processar pagamento. Tente novamente mais tarde.");
  }
};

/**
 * Gemini AI Integration
 * Generates smart business insights based on dashboard statistics
 */
export const getAIInsights = async (stats: any) => {
  try {
    // A API KEY é obtida diretamente do process.env.API_KEY injetado
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Você é um consultor especializado para donos de barbearia. Analise estes números atuais: ${JSON.stringify(stats)}. 
      Dê 3 dicas curtas, práticas e motivadoras para aumentar o faturamento hoje. 
      Use um tom amigável e direto em português do Brasil.`,
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao obter insights da IA:", error);
    return "Mantenha o foco no atendimento de qualidade para garantir a fidelidade dos seus clientes hoje!";
  }
};
