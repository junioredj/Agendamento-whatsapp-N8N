
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const [form, setForm] = React.useState({
    name: '',
    company: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/register', form);
      
      // Se o backend já retorna o token no registro (boa prática), logamos o usuário
      if (response.data.token || response.data.access_token) {
        localStorage.setItem('auth_token', response.data.token || response.data.access_token);
        localStorage.setItem('user_name', response.data.user?.name || form.name);
        navigate('/dashboard');
      } else {
        // Caso o backend não retorne o token, enviamos para o login
        alert("Conta criada com sucesso! Por favor, faça login.");
        navigate('/login');
      }
    } catch (err: any) {
      console.error('Erro ao registrar:', err);
      if (err.response) {
        setError(err.response.data.message || 'Erro ao criar conta. Verifique os dados.');
      } else {
        setError('Servidor indisponível no momento.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors">
        <ArrowLeft size={20} /> Voltar ao início
      </Link>

      <div className="w-full max-w-lg bg-white p-8 rounded-3xl shadow-xl border border-slate-100 my-10">
        <div className="text-center mb-10">
          <div className="inline-block p-3 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-100">
            <Sparkles className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold">Crie sua conta Grátis</h1>
          <p className="text-slate-500 mt-2">Comece a automatizar seus agendamentos em 5 minutos.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl text-sm font-medium border bg-red-50 text-red-600 border-red-100 animate-in fade-in slide-in-from-top-2 flex items-center gap-3">
            <AlertCircle className="shrink-0" size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nome</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="João Silva"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nome da Barbearia</label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Barbearia Estilo"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Seu E-mail Profissional</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="contato@barbearia.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Escolha uma Senha</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="••••••••"
            />
            <p className="text-[10px] text-slate-400 mt-1">A senha deve ter pelo menos 8 caracteres.</p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Criar minha conta agora'}
            </button>
          </div>
        </form>

        <p className="text-center mt-8 text-slate-600">
          Já tem uma conta? <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-700">Entrar</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
