
import React from 'react';
import Navbar from '../components/Navbar';
import { Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingPage: React.FC = () => {
  const plans = [
    {
      name: "Start",
      price: "R$ 97",
      description: "Ideal para profissionais liberais começando agora.",
      features: [
        "Até 50 agendamentos/mês",
        "IA Conversacional Básica",
        "Integração WhatsApp",
        "Relatórios semanais"
      ]
    },
    {
      name: "Pro",
      price: "R$ 197",
      description: "O mais escolhido para barbearias e salões médios.",
      recommended: true,
      features: [
        "Agendamentos Ilimitados",
        "IA Avançada (mais humana)",
        "Integração Google Calendar",
        "Remarcação automática",
        "Dashboard completa",
        "Suporte Prioritário"
      ]
    },
    {
      name: "Business",
      price: "R$ 397",
      description: "Focado em grandes franquias e múltiplos funcionários.",
      features: [
        "Múltiplos agentes de IA",
        "API para Integrações",
        "Treinamento personalizado de IA",
        "Gerente de conta dedicado",
        "Customização total do fluxo",
        "Whitelabel (opcional)"
      ]
    }
  ];

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Planos que <span className="gradient-text">cabem no seu negócio.</span></h1>
          <p className="text-slate-600 text-xl max-w-2xl mx-auto">Escolha o nível de automação que você precisa para crescer hoje mesmo.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative bg-white p-8 rounded-3xl border-2 transition-all hover:scale-105 ${
                plan.recommended ? 'border-indigo-600 shadow-2xl' : 'border-slate-100 shadow-xl'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                  <Sparkles size={14} /> MAIS POPULAR
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className="text-slate-500">/mês</span>
              </div>
              <p className="text-slate-600 mb-8 text-sm">{plan.description}</p>
              
              <ul className="space-y-4 mb-10">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-3 text-slate-700 text-sm">
                    <div className="bg-indigo-50 p-1 rounded-full">
                      <Check size={14} className="text-indigo-600" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link 
                to="/registrar" 
                className={`w-full py-4 rounded-xl font-bold text-center block transition-all ${
                  plan.recommended 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200' 
                  : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                }`}
              >
                Escolher {plan.name}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-20 glass p-10 rounded-3xl text-center border border-slate-200 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Dúvidas sobre o funcionamento da IA?</h2>
          <p className="text-slate-600 mb-8">Nossa equipe está pronta para te mostrar como nossa tecnologia pode dobrar sua produtividade.</p>
          <button className="text-indigo-600 font-bold border-b-2 border-indigo-600 hover:text-indigo-700">Falar com um consultor agora</button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
