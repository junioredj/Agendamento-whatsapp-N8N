
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

// Exemplo de interceptor para tratar erros globais ou adicionar tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Lógica para redirecionar ao login se o token expirar
      console.error('Sessão expirada. Redirecionando...');
    }
    return Promise.reject(error);
  }
);
