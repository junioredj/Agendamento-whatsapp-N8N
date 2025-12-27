import React, { useEffect, useState } from "react";
import {
  CreditCard,
  Calendar,
  Zap,
  AlertCircle,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

interface Subscription {
  id: string;
  plan_name: string;
  amount: number;
  status: "active" | "canceled" | "past_due";
  next_billing_date: string;
  card_brand?: string;
  card_last4?: string;
}

const SubscriptionManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [usuario_logado, setUsuarioLogado] = React.useState([]);
  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/user/subscription");
      setUsuarioLogado(response);
      if (response.data.success) {
        setSubscription(response.data.data);
      } else {
        throw new Error("Falha ao carregar");
      }
    } catch (err) {
      console.warn("API Offline, usando dados de demonstração.");
      setSubscription([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handleCancelSubscription = async () => {
    setCanceling(true);
    try {
      // Simulação de chamada de cancelamento
      await api.post(`/api/user/subscription/cancel`, { id: usuario_logado.data.subscriptions[0].stripe_subscription_id });
      setSubscription((prev) =>
        prev ? { ...prev, status: "canceled" } : null
      );
      setToast({
        message: "Assinatura cancelada com sucesso.",
        type: "success",
      });
      setShowCancelModal(false);
    } catch (err) {
      setToast({ message: "Erro ao cancelar assinatura.", type: "error" });
    } finally {
      setCanceling(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <p className="text-slate-500 font-bold">
          Carregando detalhes do faturamento...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-12 left-1/2 -translate-x-1/2 z-[200] p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top duration-300 border ${
            toast.type === "success"
              ? "bg-emerald-500 text-white border-emerald-400"
              : "bg-red-500 text-white border-red-400"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <p className="font-bold text-sm">{toast.message}</p>
        </div>
      )}

      {/* Botão Voltar */}
      <button
        onClick={() => navigate("/perfil")}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-8 transition-colors group"
      >
        <ArrowLeft
          size={20}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Voltar ao Perfil
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Lado Esquerdo - Detalhes do Plano */}
        <div className="md:col-span-8 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-indigo-100/10 p-8 md:p-10 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10"></div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  Minha Assinatura
                </h1>
                <p className="text-slate-500 font-medium">
                  Gerencie seu plano e preferências de faturamento.
                </p>
              </div>

              <div
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${
                  usuario_logado.data.subscriptions[0].stripe_status === "active"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : "bg-red-50 text-red-600 border-red-100"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    usuario_logado.data.subscriptions[0].stripe_status === "active"
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-red-500"
                  }`}
                />
                {usuario_logado.data.subscriptions[0].stripe_status === "active" ? "Ativo" : "Cancelado"}
              </div>
            </div>

            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                  <Zap size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {usuario_logado.data.subscriptions[0].plan.name}
                  </h3>
                  <p className="text-indigo-600 font-bold text-sm">
                    Cobrança mensal
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-200">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Clock size={12} /> Próxima Cobrança
                  </p>
                  <p className="text-slate-800 font-bold">
                    {
                       new Date(
                          usuario_logado.data.subscriptions[0].ends_at
                        ).toLocaleDateString("pt-BR")
                      }
                  </p>
                </div>
                {console.log()}
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <CreditCard size={12} /> Valor do Plano
                  </p>
                  <p className="text-slate-800 font-bold text-xl">
                    R${" "}
                    {usuario_logado.data.subscriptions[0].plan.amount.toLocaleString(
                      "pt-BR",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>

            {usuario_logado.data.subscriptions[0].stripe_status === "active" && (
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="px-8 py-4 bg-white text-red-500 border-2 border-red-100 rounded-2xl font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                >
                  <XCircle size={18} /> Cancelar Assinatura
                </button>
                <button
                  onClick={() => navigate("/precos")}
                  className="flex-1 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                >
                  Fazer Upgrade de Plano
                </button>
              </div>
            )}

            {usuario_logado.data.subscriptions[0].stripe_status === "canceled" && (
              <div className="p-6 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-4">
                <AlertCircle className="text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-red-900">
                    Assinatura Cancelada
                  </h4>
                  <p className="text-sm text-red-700 leading-tight">
                    Você ainda terá acesso aos recursos até o final do ciclo
                    atual ({
                       new Date(
                          usuario_logado.data.subscriptions[0].ends_at
                        ).toLocaleDateString("pt-BR")
                      }).
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lado Direito - Infos Extras */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2">
              <ShieldCheck size={20} className="text-emerald-500" />
              Pagamento Seguro
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <CreditCard className="text-slate-400" size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                   final {usuario_logado.data.subscriptions[0].card_last4}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                    Cartão de Crédito
                  </p>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 text-center font-medium px-2 leading-relaxed">
                Suas informações de pagamento são criptografadas e processadas
                pelo Stripe. Nós não armazenamos os dados completos do seu
                cartão.
              </p>
            </div>
          </div>

          <div className="bg-indigo-600 p-8 rounded-[2rem] text-white shadow-xl shadow-indigo-200">
            <h4 className="font-black mb-4">Dúvidas com o faturamento?</h4>
            <p className="text-indigo-100 text-xs font-medium leading-relaxed mb-6">
              Nosso suporte financeiro está pronto para te ajudar com reembolsos
              ou problemas técnicos.
            </p>
            <button className="w-full py-3 bg-white/20 backdrop-blur-md rounded-xl font-bold text-sm hover:bg-white/30 transition-all border border-white/20">
              Chamar no WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DE CANCELAMENTO */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => !canceling && setShowCancelModal(false)}
          />
          <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in-95 duration-300 border border-slate-100 text-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">
              Tem certeza?
            </h3>
            <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
              Ao cancelar, sua IA de agendamentos no WhatsApp deixará de
              funcionar assim que o ciclo atual expirar.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleCancelSubscription}
                disabled={canceling}
                className="w-full py-5 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 transition-all shadow-lg shadow-red-100 active:scale-95 flex items-center justify-center gap-2"
              >
                {canceling ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Sim, Cancelar Plano"
                )}
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={canceling}
                className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                Manter meu plano
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagementPage;
