import React from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Smartphone,
  Building,
  Save,
  ShieldCheck,
  LogOut,
  CreditCard,
  CheckCircle2,
  Loader2,
  Zap,
  ZapOff,
  ArrowRight,
  PlusCircle,
} from "lucide-react";
import { api } from "../services/api";

const countryCodes = [
  { code: "+55", country: "BR", name: "Brasil" },
  { code: "+1", country: "US", name: "Estados Unidos/Canadá" },
  { code: "+351", country: "PT", name: "Portugal" },
].sort((a, b) => a.name.localeCompare(b.name));

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [perfilData, setPerfilData] = React.useState<any>(null);
  const [usuario_logado, setUsuarioLogado] = React.useState([]);

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    number: "",
    business_name: "",
    ddi: "+55",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/profile");
      setPerfilData(response.data);
      setUsuarioLogado(response);

      setFormData({
        name: response.data.name || "",
        email: response.data.email || "",
        number: response.data.number || "",
        business_name: response.data.company || "",
        ddi: response.data.ddi || "+55",
      });
    } catch (err) {
      console.error("Erro ao buscar perfil:", err);
      // Fallback para demonstração se a API falhar
      const fallbackName = localStorage.getItem("user_name") || "Usuário";
      setFormData([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.business_name.trim(),
        number: formData.number
          ? `${formData.ddi}${formData.number}`.replace(/\s+/g, "")
          : null,
      };

      await api.put("/api/profile", payload);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert("Erro ao salvar perfil. Verifique a conexão com o servidor.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (e) {}
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_name");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  const activeSubscription = perfilData?.subscriptions?.find(
    (sub: any) => sub.status === "active" || sub.status === "trialing"
  );
  const subscription = usuario_logado?.data?.subscriptions?.[0];
  const isCanceled = subscription?.stripe_status === "canceled";
  return (
    <div className="max-w-4xl animate-in fade-in duration-500 pb-20">
      {/* Card Principal de Perfil */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mb-8">
        <div className="h-40 bg-gradient-to-r from-indigo-600 to-violet-600 relative">
          <div className="absolute -bottom-12 left-8 p-1.5 bg-white rounded-full shadow-lg">
            <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-4xl border-4 border-white">
              {formData.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold border border-white/20">
              <ShieldCheck size={16} /> CONTA VERIFICADA
            </div>
          </div>
        </div>

        <div className="pt-16 p-8">
          <div className="mb-10">
            <h2 className="text-2xl font-black text-slate-800">
              {formData.name}
            </h2>
            <p className="text-slate-500 font-medium">
              Configurações da sua conta profissional
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                  <User size={16} className="text-indigo-500" /> Nome Completo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                  <Mail size={16} className="text-indigo-500" /> E-mail
                  Profissional
                </label>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                  <Smartphone size={16} className="text-indigo-500" /> WhatsApp
                  Conectado
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.ddi}
                    onChange={(e) =>
                      setFormData({ ...formData, ddi: e.target.value })
                    }
                    className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-4 outline-none font-bold"
                  >
                    {countryCodes.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={formData.number}
                    onChange={(e) =>
                      setFormData({ ...formData, number: e.target.value })
                    }
                    placeholder="99999-9999"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                  <Building size={16} className="text-indigo-500" /> Nome da
                  Barbearia / Salão
                </label>
                <input
                  type="text"
                  value={formData.business_name}
                  onChange={(e) =>
                    setFormData({ ...formData, business_name: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
              <button
                type="button"
                onClick={handleLogout}
                className="text-red-500 font-bold flex items-center gap-2 hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
              >
                <LogOut size={20} /> Sair da Conta
              </button>

              <button
                type="submit"
                disabled={saving}
                className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all transform active:scale-95"
              >
                {saving ? (
                  <Loader2 className="animate-spin" />
                ) : saveSuccess ? (
                  <>
                    <CheckCircle2 size={20} /> Perfil Atualizado!
                  </>
                ) : (
                  <>
                    <Save size={20} /> Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Seção de Plano Contratado */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
        <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
          <CreditCard className="text-indigo-600" /> Meu Plano
        </h3>

        {usuario_logado?.data?.subscriptions?.[0]?.stripe_subscription_id ? (
          <div
            className={`rounded-3xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 border ${
              isCanceled
                ? "bg-amber-50 border-amber-100"
                : "bg-indigo-50 border-indigo-100"
            }`}
          >
            <div className="flex items-center gap-5">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                  isCanceled
                    ? "bg-amber-500 shadow-amber-200"
                    : "bg-indigo-600 shadow-indigo-200"
                }`}
              >
                {isCanceled ? <ZapOff size={28} /> : <Zap size={28} />}
              </div>
              <div>
                <p className="text-slate-900 font-black text-lg">
                  {subscription?.plan?.name || "Plano Profissional"}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isCanceled
                        ? "bg-amber-500"
                        : "bg-emerald-500 animate-pulse"
                    }`}
                  ></span>
                  <p
                    className={`${
                      isCanceled ? "text-amber-600" : "text-indigo-600"
                    } text-sm font-bold`}
                  >
                    {isCanceled ? "Assinatura Cancelada" : "Assinatura Ativa"}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="text-slate-500 text-sm font-medium mb-1">
                {isCanceled ? "Acesso garantido até" : "Próxima renovação"}
              </p>
              <p className="text-slate-900 font-black text-xl">
                {isCanceled ? (
                  new Date(
                          usuario_logado.data.subscriptions[0].ends_at
                        ).toLocaleDateString("pt-BR")
                ) : (
                  <>
                    R${" "}
                    {(subscription?.plan?.amount || 0).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    /mês
                  </>
                )}
              </p>
            </div>

            <button
              onClick={() => navigate("/minha-assinatura")}
              className={`bg-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm border ${
                isCanceled
                  ? "text-amber-600 border-amber-200 hover:bg-amber-600 hover:text-white"
                  : "text-indigo-600 border-indigo-200 hover:bg-indigo-600 hover:text-white"
              }`}
            >
              Gerenciar Assinatura
            </button>
          </div>
        ) : (
          /* Empty State - Quando não há plano ativo */
          <div className="bg-slate-50 rounded-3xl p-8 border-2 border-dashed border-slate-200 flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm border border-slate-100 mb-2">
              <ZapOff size={32} />
            </div>
            <div className="max-w-sm">
              <h4 className="text-lg font-black text-slate-800 mb-1">
                Você não possui um plano ativo
              </h4>
              <p className="text-slate-500 text-sm font-medium">
                Sua IA está desativada. Assine agora para automatizar seus
                agendamentos via WhatsApp 24 horas por dia.
              </p>
            </div>
            <button
              onClick={() => navigate("/precos")}
              className="mt-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all transform active:scale-95 group"
            >
              <PlusCircle size={20} />
              Escolher um Plano
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        )}

        <p className="mt-6 text-slate-400 text-xs text-center md:text-left flex items-center justify-center md:justify-start gap-2">
          <ShieldCheck size={14} /> Pagamentos processados com segurança via
          Stripe
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
