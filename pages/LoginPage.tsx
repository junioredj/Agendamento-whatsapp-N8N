
import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [isDemo, setIsDemo] = React.useState(false);

  const redirectTo = searchParams.get('redirectTo') || '/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user_name', response.data.user?.name || 'Usuário');
      }
      
      navigate(redirectTo);
    } catch (err: any) {
      if (err.message === "Network Error" || !err.response) {
        setIsDemo(true);
        setError('Servidor API offline. Entrando em modo de demonstração...');
        setTimeout(() => {
          localStorage.setItem('auth_token', 'demo-token-123');
          localStorage.setItem('user_name', 'Barbeiro de Teste');
          navigate(redirectTo);
        }, 1500);
      } else {
        setError(err.response?.data?.message || 'E-mail ou senha incorretos.');
      }
    } finally {
      if (!isDemo) setLoading(false);
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
          <p className="text-slate-500 mt-2">
            {searchParams.get('redirectTo') 
              ? 'Faça login para concluir sua assinatura.' 
              : 'Entre na sua conta para gerenciar seu salão.'}
          </p>
        </div>

        {error && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-medium border animate-in fade-in slide-in-from-top-2 flex items-center gap-3 ${
            isDemo ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-red-50 text-red-600 border-red-100'
          }`}>
            {isDemo ? <Loader2 className="animate-spin shrink-0" size={18} /> : <AlertCircle className="shrink-0" size={18} />}
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
          Não tem uma conta? <Link to={`/registrar?redirectTo=${redirectTo}`} className="text-indigo-600 font-bold hover:text-indigo-700">Crie agora</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
