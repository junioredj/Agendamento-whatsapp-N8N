
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Check, Sparkles, Zap, ArrowRight, Loader2 } from 'lucide-react';
//import { createStripeCheckout } from '../services/api';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const isLoggedIn = !!localStorage.getItem('auth_token');

  const handleSubscribe = async () => {
    if (!isLoggedIn) {
      navigate('/login?redirectTo=/precos');
      return;
    }

    setLoading(true);
    //await createStripeCheckout();
    setLoading(false);
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Zap size={16} /> Plano Simples e Transparente
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Tudo o que você precisa em <br/><span className="gradient-text">um único plano.</span></h1>
          <p className="text-slate-600 text-xl max-w-2xl mx-auto">Sem taxas escondidas, sem limites complexos. Apenas automação total para sua barbearia crescer.</p>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="relative bg-white p-10 md:p-14 rounded-[3rem] border-2 border-indigo-600 shadow-2xl shadow-indigo-100 transition-all hover:scale-[1.02]">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-xl">
              <Sparkles size={16} /> PLANO SMART COMPLETO
            </div>

            <div className="text-center mb-10">
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-6xl font-black text-slate-900">R$ 69</span>
                <span className="text-slate-400 text-xl font-bold">/mês</span>
              </div>
              <p className="text-slate-500 font-medium">Cancele quando quiser. Sem fidelidade.</p>
            </div>
            
            <div className="space-y-5 mb-12">
              {[
                "Agendamentos ilimitados via WhatsApp",
                "Agente de IA com voz e texto natural",
                "Integração com Google Calendar",
                "Lembretes automáticos (anti-faltas)",
                "Painel de faturamento em tempo real",
                "Suporte prioritário via WhatsApp",
                "Gestão de bloqueio de horários"
              ].map((feature, fIdx) => (
                <div key={fIdx} className="flex items-center gap-4 text-slate-700">
                  <div className="bg-indigo-50 p-1.5 rounded-full shrink-0">
                    <Check size={18} className="text-indigo-600" />
                  </div>
                  <span className="font-semibold">{feature}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-6 rounded-[2rem] font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 transform active:scale-95"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  {isLoggedIn ? 'Assinar Agora com Stripe' : 'Entrar para Assinar'} 
                  <ArrowRight size={24} />
                </>
              )}
            </button>
            
            <div className="mt-8 flex items-center justify-center gap-4 text-slate-400">
               <span className="text-xs font-bold uppercase tracking-widest">+500 barbearias ativas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
