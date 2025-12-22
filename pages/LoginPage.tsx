
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '../services/api';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Supondo que o backend retorne um token ou confirme a sessão via cookie
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }
      
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Erro no login:", err);
      setError(err.response?.data?.message || 'E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors">
        <ArrowLeft size={20} /> Voltar ao início
      </Link>

      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <div className="text-center mb-10">
          <div className="inline-block p-3 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-100">
            <Sparkles className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold">Bem-vindo de volta!</h1>
          <p className="text-slate-500 mt-2">Entre na sua conta para gerenciar seu salão.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Seu E-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Sua Senha</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="••••••••"
            />
            <div className="text-right mt-2">
              <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">Esqueceu a senha?</a>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Entrar no Sistema'}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-600">
          Não tem uma conta? <Link to="/registrar" className="text-indigo-600 font-bold hover:text-indigo-700">Crie agora</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
