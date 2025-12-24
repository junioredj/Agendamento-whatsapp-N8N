
import axios from 'axios';
import { GoogleGenAI } from "@google/genai";

/**
 * Configuração do Axios para Laravel Sanctum
 */
export const api = axios.create({
  // Se o seu backend estiver em outra porta ou domínio, altere aqui.
  // Importante: Não coloque /api no final da baseURL se for usar rotas WEB (como /login)
  baseURL: 'http://localhost:8000', 
  withCredentials: true,            // ← ESSA LINHA É OBRIGATÓRIA!
});

export const  fetchCsrfCookie = async (): Promise<void> => {
  try {
    await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
      withCredentials: true, // Garante que o cookie seja salvo
    });
  } catch (error) {
    console.error('Erro ao obter CSRF cookie:', error);
    throw error; // Ou trate como preferir
  }
};