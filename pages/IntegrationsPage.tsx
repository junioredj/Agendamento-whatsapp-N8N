import React from "react";
import {
  MessageCircle,
  Calendar,
  Shield,
  CheckCircle2,
  Info,
  ExternalLink,
  Loader2,
  AlertCircle,
  Zap,
  Lock,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import SmartIALoader from "../components/SmartIALoader";

const IntegrationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [waLoading, setWaLoading] = React.useState(false);
  const [gcLoading, setGcLoading] = React.useState(false);
  const [status, setStatus] = React.useState({
    whatsapp: false,
    google: false,
  });
  const [hasSubscription, setHasSubscription] = React.useState(false);

  // Estados dos formulários
  const [waData, setWaData] = React.useState({ token: "", phoneId: "" });

  const fetchIntegrationsAndStatus = async () => {
    try {
      setLoading(true);

      // Buscamos o status das integrações e o perfil (para ver assinatura)

      const response = api.get("/api/user/integrations-status");

      const subscription = (await response).data?.subscriptions?.[0];
      const google = (await response).data;
      console.log(google);

      const isActive = subscription?.ends_at
        ? new Date() < new Date(subscription.ends_at)
        : false;

      setHasSubscription(isActive);
      setStatus({
        whatsapp: false,
        google: !!google.google_connected,
      });
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      // Fallback para demo
      setHasSubscription(false);
      setStatus({ whatsapp: false, google: false });
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  React.useEffect(() => {
    fetchIntegrationsAndStatus();
  }, []);

  const handleSaveWA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasSubscription) return;

    setWaLoading(true);
    try {
      await api.post("/integrations/whatsapp", waData);
      setStatus((prev) => ({ ...prev, whatsapp: true }));
      alert("Integração WhatsApp salva com sucesso!");
    } catch (err) {
      alert("Erro ao salvar integração WhatsApp.");
    } finally {
      setWaLoading(false);
    }
  };

  const handleGoogleConnect = async () => {
    if (!hasSubscription) return;
    setGcLoading(true);
    try {
      const response = await api.get("/api/conectar-google-calendar");
      const popup = window.open(
        response.data.url,
        "Google Login",
        "width=500,height=600"
      );

      const checkPopup = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkPopup);
          setGcLoading(false);
          verificarStatusConexao();
        }
      }, 1000);
    } catch (err) {
      alert("Erro ao conectar.");
      setGcLoading(false);
    }
  };

  const verificarStatusConexao = async () => {
    const res = await api.get("/api/user/integrations-status");
    if (res.data.google_connected) {
      setStatus((prev) => ({ ...prev, google: true }));
    }
  };

  const handleGoogleDisconnect = async () => {
    if (!confirm("Deseja realmente desconectar sua conta Google?")) return;
    setGcLoading(true);
    try {
      await api.post("/api/user/google-disconnect");
      setStatus((prev) => ({ ...prev, google: false }));
    } catch (err) {
      console.error(err);
    } finally {
      setGcLoading(false);
    }
  };

  if (loading) {
    return (
      <SmartIALoader
        message="Carregando Integrações"
        submessage="Conectando aos servidores Meta e Google..."
      />
    );
  }

  return (
    <div className="max-w-6xl space-y-8 animate-in fade-in duration-500 pb-20 px-4">
      {/* 1. Alerta de Assinatura (Aparece se não houver assinatura) */}
      {!hasSubscription && (
        <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-5 text-center md:text-left">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
              <ShieldAlert size={32} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">
                Assinatura Necessária
              </h3>
              <p className="text-indigo-100 font-medium text-sm">
                Para ativar a Inteligência Artificial no WhatsApp e sincronizar
                sua agenda Google, é necessário contratar um plano.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/precos")}
            className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-slate-50 transition-all shadow-lg active:scale-95 whitespace-nowrap"
          >
            Ver Planos <ArrowRight size={20} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* WhatsApp Integration Card */}
        <div
          className={`bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col transition-all duration-500 ${
            !hasSubscription ? "grayscale-[0.5] opacity-80 select-none" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl shadow-inner">
                <MessageCircle size={32} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800">
                  WhatsApp Business
                </h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  API Cloud Oficial
                </p>
              </div>
            </div>
            {status.whatsapp && hasSubscription && (
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-emerald-100">
                <CheckCircle2 size={12} /> Conectado
              </div>
            )}
            {!hasSubscription && (
              <div className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                <Lock size={10} /> Bloqueado
              </div>
            )}
          </div>

          <form onSubmit={handleSaveWA} className="space-y-6 flex-1">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Access Token Permanente
              </label>
              <input
                type="password"
                required
                disabled={!hasSubscription}
                value={waData.token}
                onChange={(e) =>
                  setWaData({ ...waData, token: e.target.value })
                }
                placeholder={
                  hasSubscription
                    ? "Insira o Token gerado na Meta"
                    : "Assine para habilitar este campo"
                }
                className={`w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium ${
                  !hasSubscription
                    ? "cursor-not-allowed placeholder:text-slate-300"
                    : ""
                }`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Phone Number ID
              </label>
              <input
                type="text"
                required
                disabled={!hasSubscription}
                value={waData.phoneId}
                onChange={(e) =>
                  setWaData({ ...waData, phoneId: e.target.value })
                }
                placeholder={
                  hasSubscription
                    ? "ID do número de telefone"
                    : "Assine para habilitar este campo"
                }
                className={`w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium ${
                  !hasSubscription
                    ? "cursor-not-allowed placeholder:text-slate-300"
                    : ""
                }`}
              />
            </div>

            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex gap-3">
              <Info className="text-indigo-600 shrink-0 mt-0.5" size={16} />
              <p className="text-[11px] text-indigo-800 leading-relaxed font-medium">
                Essas credenciais são obtidas no portal{" "}
                <strong>Meta for Developers</strong>.
                <a
                  href="#"
                  className="font-bold underline ml-1 inline-flex items-center gap-0.5 hover:text-indigo-600"
                >
                  Manual de ajuda <ExternalLink size={10} />
                </a>
              </p>
            </div>

            <button
              type="submit"
              disabled={waLoading || !hasSubscription}
              className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 active:scale-95 ${
                !hasSubscription
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200"
              }`}
            >
              {!hasSubscription && <Lock size={18} />}
              {waLoading ? (
                <Loader2 className="animate-spin" />
              ) : !hasSubscription ? (
                "Recurso para Assinantes"
              ) : (
                "Sincronizar WhatsApp"
              )}
            </button>
          </form>
        </div>

        {/* Google Calendar Integration Card */}
        <div
          className={`bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col transition-all duration-500 ${
            !hasSubscription ? "grayscale-[0.5] opacity-80 select-none" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl shadow-inner relative">
                <Calendar size={32} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800">
                  Google Calendar
                </h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Sincronização Bidirecional
                </p>
              </div>
            </div>
            {status.google && hasSubscription && (
              <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-blue-100">
                <CheckCircle2 size={12} /> Conectado
              </div>
            )}
            {!hasSubscription && (
              <div className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                <Lock size={10} /> Bloqueado
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-center text-center space-y-6">
            {!status.google || !hasSubscription ? (
              <div className="space-y-6 py-6">
                <div className="max-w-[280px] mx-auto">
                  <p className="text-slate-600 text-sm font-medium leading-relaxed">
                    Conecte sua conta Google para que a Inteligência Artificial
                    verifique sua disponibilidade em tempo real e adicione os
                    agendamentos automaticamente.
                  </p>
                </div>

                <div className="p-5 bg-blue-50/50 rounded-3xl border border-blue-100 flex items-start gap-4 text-left">
                  <Shield className="text-blue-600 shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="text-xs font-black text-blue-900 uppercase mb-1">
                      Privacidade Total
                    </h4>
                    <p className="text-[10px] text-blue-700 leading-tight font-medium">
                      A SmartSchedule acessa apenas os horários ocupados para
                      evitar conflitos. Seus dados pessoais nunca são
                      compartilhados.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleGoogleConnect}
                  disabled={gcLoading || !hasSubscription}
                  className={`w-full py-5 rounded-[2rem] font-black transition-all flex items-center justify-center gap-3 active:scale-95 border-2 ${
                    !hasSubscription
                      ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-lg shadow-slate-100"
                  }`}
                >
                  {gcLoading ? (
                    <Loader2 className="animate-spin text-blue-600" />
                  ) : (
                    <>
                      {!hasSubscription ? (
                        <Lock size={20} />
                      ) : (
                        <img
                          src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                          className="w-6 h-6 object-contain"
                          alt="Google"
                        />
                      )}
                      {!hasSubscription
                        ? "Bloqueado para não assinantes"
                        : "Conectar com Google Calendar"}
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-8 py-10 animate-in zoom-in-95 duration-500">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4 border-4 border-emerald-100">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-lg font-black text-slate-800">
                    Tudo pronto!
                  </h3>
                  <p className="text-sm text-slate-400 font-bold">
                    Sua agenda Google está vinculada.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                      G
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-black text-slate-700">
                        Google Workspace
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold">
                        Sincronização Ativa
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleGoogleDisconnect}
                    className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline px-3 py-1"
                  >
                    Desconectar
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-center gap-2">
            <AlertCircle size={14} className="text-slate-300" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              Integração homologada via Google OAuth 2.0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsPage;
