
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Check, Sparkles, Zap, ArrowRight, Loader2 } from "lucide-react";
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext'; // o contexto que criamos


interface Promotion {
  active: boolean;
  new_price: number;
  cupom: string;
}

interface Plano {
  id: number;
  name: string;
  amount: number;
  currency: string;
  interval: string;
  stripe_price_id: string;
  description: {
    features: string[];
  };
  promotion?: Promotion;
}

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [submittingPlanId, setSubmittingPlanId] = useState<number | null>(null);
  const [loadingPlans, setLoadingPlans] = useState(true);

  const { user, loading } = useAuth();
  const isLoggedIn = user;
  

  // Busca os planos e verifica se há uma intenção de assinatura pendente (pós-login)
  useEffect(() => {
    const fetchPlanos = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/all/plans");
        const json = await response.json();

        if (json.success) {
          setPlanos(json.data);
          
          // Lógica de "Auto-Assinar" após o login
          const planToSubscribeId = searchParams.get("planId");
          if (planToSubscribeId && isLoggedIn) {
            const plan = json.data.find((p: Plano) => p.id.toString() === planToSubscribeId);
            if (plan) {
              handleSubscribe(plan);
            }
          }
        }
      } catch (error) {
        console.error("Erro ao carregar planos", error);
        // Fallback para evitar tela vazia em demo
        const fallbackPlans = [{
          id: 1,
          name: "Plano Smart IA",
          amount: 69.00,
          currency: "BRL",
          interval: "month",
          stripe_price_id: "price_123",
          description: { features: ["Agendamentos ilimitados", "IA 24h no WhatsApp"] }
        }];
        setPlanos(fallbackPlans);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlanos();
  }, [isLoggedIn]); // Re-executa se o status de login mudar


  const handleSubscribe = async (plano: Plano) => {
    // 1. Verifica autenticação
    if (!isLoggedIn) {
      // Salva o ID do plano na URL de redirecionamento para processar após o login
      const returnUrl = encodeURIComponent(`/precos?planId=${plano.id}`);
      navigate(`/login?redirectTo=${returnUrl}`);
      return;
    }

    // 2. Inicia estado de carregamento
    setSubmittingPlanId(plano.id);
    
    try {
      const payload = {
        price_id: plano.stripe_price_id,
        email: localStorage.getItem('email') || "", // Tenta pegar o email do localstorage
        plan_id : plano.id,
      };
      

      console.log("=====> ", plano.id);
      const response = await api.post("/api/stripe/checkout/prices", payload);

      if (response.data && response.data.url) {
        // 3. Redireciona para o Stripe
        window.location.href = response.data.url;
      } else {
        throw new Error("URL de checkout não recebida");
      }
    } catch (error) {
      console.error("Erro ao iniciar checkout:", error);
      alert("Não foi possível iniciar o checkout. Por favor, tente novamente.");
      setSubmittingPlanId(null);
    }
  };


  if (loadingPlans) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen overflow-x-hidden">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Zap size={16} /> Plano Simples e Transparente
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-slate-900 tracking-tight">
            Tudo o que você precisa em <br />
            <span className="gradient-text">um único plano.</span>
          </h1>
          <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Sem taxas escondidas, sem limites complexos. Apenas automação total
            para sua barbearia crescer.
          </p>
        </div>

        {/* CONTAINER DE PLANOS */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 items-stretch">
          {planos.map((plano) => (
            <div
              key={plano.id}
              className="relative bg-white p-8 md:p-10 rounded-[3rem] border-2 border-indigo-600 shadow-2xl shadow-indigo-100 transition-all hover:scale-[1.02] w-full max-w-[400px] flex flex-col animate-in zoom-in-95 duration-500"
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-xl whitespace-nowrap">
                <Sparkles size={16} /> {plano.name}
              </div>

              {/* PREÇO */}
              <div className="text-center mb-10 mt-6">
                {plano.promotion?.active ? (
                  <>
                    <div className="flex justify-center items-center gap-3 mb-1">
                      <span className="text-2xl font-bold text-slate-300 line-through">
                        R$ {plano.amount.toFixed(0)}
                      </span>
                      <span className="text-slate-300 font-bold text-sm">
                        /{plano.interval === "month" ? "mês" : plano.interval}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-5xl md:text-6xl font-black text-indigo-600">
                        R$ {plano.promotion.new_price}
                      </span>
                      <span className="text-slate-400 text-xl font-bold">
                        /{plano.interval === "month" ? "mês" : plano.interval}
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-xs font-black mt-3 uppercase tracking-wider border border-emerald-100">
                      Cupom{" "}
                      <span className="text-emerald-500">
                        {plano.promotion.cupom}
                      </span>{" "}
                      • 1º MÊS
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-5xl md:text-6xl font-black text-slate-900">
                        R$ {plano.amount.toFixed(0)}
                      </span>
                      <span className="text-slate-400 text-xl font-bold">
                        /{plano.interval === "month" ? "mês" : plano.interval}
                      </span>
                    </div>

                    <p className="text-slate-500 font-medium text-sm">
                      Cancele quando quiser. Sem fidelidade.
                    </p>
                  </>
                )}
              </div>

              {/* FEATURES */}
              <div className="space-y-4 mb-10 flex-1">
                {plano.description?.features?.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 text-slate-700"
                  >
                    <div className="bg-indigo-50 p-1.5 rounded-full shrink-0 mt-0.5">
                      <Check size={16} className="text-indigo-600" />
                    </div>
                    <span className="font-bold text-sm leading-tight">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA COM CARREGAMENTO */}
              <button
                onClick={() => handleSubscribe(plano)}
                disabled={submittingPlanId !== null}
                className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submittingPlanId === plano.id ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Processando...
                  </>
                ) : (
                  <>
                    {isLoggedIn ? "Assinar Agora" : "Entrar para Assinar"}
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* INFO ADICIONAL */}
        <div className="mt-20 text-center max-w-xl mx-auto">
          <p className="text-slate-400 text-sm font-medium">
            Dúvidas sobre os planos?{" "}
            <a href="#" className="text-indigo-600 font-bold hover:underline">
              Fale com um consultor
            </a>{" "}
            ou veja nossa central de ajuda.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
