
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, perform auth logic here
    navigate('/dashboard');
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

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Seu E-mail</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Sua Senha</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
            <div className="text-right mt-2">
              <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">Esqueceu a senha?</a>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform active:scale-[0.98]"
          >
            Entrar no Sistema
          </button>
        </form>

        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-400">Ou continue com</span></div>
        </div>

        <div className="mt-6">
          <button className="w-full bg-white border border-slate-200 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all font-medium text-slate-700">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            Google
          </button>
        </div>

        <p className="text-center mt-8 text-slate-600">
          Não tem uma conta? <Link to="/registrar" className="text-indigo-600 font-bold hover:text-indigo-700">Crie agora</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
