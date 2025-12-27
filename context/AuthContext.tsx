// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { api, fetchCsrfCookie } from "../services/api"; // sua instância do Axios configurada

interface AuthContextType {
  user: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true); // evita flash de tela errada

  // Verifica se o usuário está logado ao carregar a app
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await api.get("/api/user"); // rota protegida no Laravel
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    await fetchCsrfCookie(); // Uma vez só, com await
    await api.post("/api/auth/login", { email, password });
    const response = await api.get("/api/user");
    setUser(response.data);
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (e) {
      console.error(e);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
};
