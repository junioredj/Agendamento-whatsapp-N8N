import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Sparkles, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { api, fetchCsrfCookie } from "../services/api";
import { useAuth } from "../context/AuthContext"; // ← IMPORTANTE: Adicione isso

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { login } = useAuth(); // ← Pegamos a função login do contexto

  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Garante que o cookie CSRF esteja pronto (com await!)
      await fetchCsrfCookie();

      // 2. Faz login no backend
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      // 3. Atualiza o estado de autenticação no contexto
      //    (a função login do contexto já faz a chamada /api/user e seta o user)
      await login(email, password); // ← Isso atualiza o user no AuthContext

      // 4. Opcional: salva nome no localStorage (só para exibir no header, etc.)
      const fullName = response.data.user.name;
      const nomeESobrenome = fullName.split(" ").slice(0, 2).join(" ");
      localStorage.setItem("user_name", nomeESobrenome);
      localStorage.setItem("email", email);

      // 5. Redireciona
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      console.error("Erro no login:", err);

      if (err.code === "ERR_NETWORK") {
        setError(
          "Erro de rede: verifique se o backend está online e CORS configurado."
        );
      } else {
        setError(
          err.response?.data?.message ||
            err.response?.data?.errors?.email?.[0] ||
            "E-mail ou senha incorretos."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors group"
      >
        <ArrowLeft
          size={20}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Voltar ao início
      </Link>

      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-100">
            <Sparkles className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Login</h1>
          <p className="text-slate-500 mt-2">
            Identificamos um erro de conexão. Tente novamente após ajustar o
            backend.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-start gap-3 text-sm">
            <AlertCircle className="shrink-0" size={18} />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50/50"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50/50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 text-lg"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Entrar"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
