import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Check,
  ChevronDown,
  X,
} from "lucide-react";
import { api } from "../services/api";

const PROFESSIONS = [
  "Cabeleireiro(a)",
  "Barbeiro",
  "Maquiador(a)",
  "Manicure",
  "Pedicure",
  "Designer de Sobrancelhas",
  "Lash Designer (Cílios)",
  "Esteticista",
  "Depiladora",
  "Micropigmentador(a)",
  "Trancista",
  "Colorista Capilar",
  "Terapeuta Capilar",
];

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isProfessionsOpen, setIsProfessionsOpen] = React.useState(false);

  const [form, setForm] = React.useState({
    name: "",
    company: "",
    email: "",
    password: "",
    professions: [] as string[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const toggleProfession = (prof: string) => {
    const isSelected = form.professions.includes(prof);
    if (isSelected) {
      setForm({
        ...form,
        professions: form.professions.filter((p) => p !== prof),
      });
    } else {
      setForm({
        ...form,
        professions: [...form.professions, prof],
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.professions.length === 0) {
      setError("Por favor, selecione pelo menos uma profissão.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        name: form.name,
        company: form.company,
        email: form.email,
        password: form.password,
        business_area: form.professions, // 👈 ARRAY REAL
      };

      await api.post("/api/auth/register", payload);

      navigate("/dashboard");
    } catch (err: any) {
      console.error("Erro ao registrar:", err);
      if (err.response) {
        setError(
          err.response.data.message ||
            "Erro ao criar conta. Verifique os dados."
        );
      } else {
        setError("Servidor indisponível no momento.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={20} /> Voltar ao início
      </Link>

      <div className="w-full max-w-lg bg-white p-8 rounded-3xl shadow-xl border border-slate-100 my-10">
        <div className="text-center mb-10">
          <div className="inline-block p-3 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-100">
            <Sparkles className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold">Crie sua conta Grátis</h1>
          <p className="text-slate-500 mt-2">
            Comece a automatizar seus agendamentos em 5 minutos.
          </p>
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
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Seu nome completo"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Nome da sua empresa
              </label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Ex: Barbearia Estilo"
              />
            </div>
          </div>

          {/* Custom Multi-select for Professions */}
          <div className="relative">
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Áreas de Atuação
            </label>

            {/* INPUT REAL COM JSON */}
            <input
              type="hidden"
              name="business_area"
              value={JSON.stringify(form.professions)}
            />

            <div
              onClick={() => setIsProfessionsOpen(!isProfessionsOpen)}
              className="w-full min-h-[52px] px-4 py-2 rounded-xl border border-slate-200 bg-white cursor-pointer flex flex-wrap gap-2 items-center justify-between"
            >
              <div className="flex flex-wrap gap-2 flex-1">
                {form.professions.length === 0 ? (
                  <span className="text-slate-400">
                    Selecione uma ou mais...
                  </span>
                ) : (
                  form.professions.map((p) => (
                    <span
                      key={p}
                      className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border border-indigo-100"
                    >
                      {p}
                      <X
                        size={12}
                        className="cursor-pointer hover:text-indigo-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleProfession(p);
                        }}
                      />
                    </span>
                  ))
                )}
              </div>

              <ChevronDown
                size={20}
                className={`text-slate-400 transition-transform ${
                  isProfessionsOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {isProfessionsOpen && (
              <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-60 overflow-y-auto p-2">
                {PROFESSIONS.map((prof) => (
                  <div
                    key={prof}
                    onClick={() => toggleProfession(prof)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer ${
                      form.professions.includes(prof)
                        ? "bg-indigo-50 text-indigo-700 font-bold"
                        : "hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <span className="text-sm">{prof}</span>
                    {form.professions.includes(prof) && <Check size={16} />}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Seu E-mail Profissional
            </label>
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
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Escolha uma Senha
            </label>
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
            <p className="text-[10px] text-slate-400 mt-1">
              A senha deve ter pelo menos 8 caracteres.
            </p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Criar minha conta agora"
              )}
            </button>
          </div>
        </form>

        <p className="text-center mt-8 text-slate-600">
          Já tem uma conta?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-bold hover:text-indigo-700"
          >
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
