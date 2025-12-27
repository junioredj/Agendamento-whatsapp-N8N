
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  MessageCircle, 
  ArrowRight, 
  Sparkles,
  LayoutDashboard,
  Zap,
  ShieldCheck
} from 'lucide-react';

const ThankYouPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos Decorativos de Fundo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-100 rounded-full blur-3xl opacity-30 -z-10 animate-pulse"></div>
      
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-indigo-100 border border-slate-100 p-8 md:p-16 text-center relative overflow-hidden animate-in zoom-in-95 duration-500">
          
          {/* Confete Fake / Estrela */}
          <div className="absolute top-10 right-10 text-yellow-400 animate-bounce delay-100">
            <Sparkles size={32} />
          </div>
          <div className="absolute bottom-10 left-10 text-indigo-300 animate-bounce delay-300">
            <Sparkles size={24} />
          </div>

          {/* Ícone de Sucesso */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full mb-8 border-4 border-emerald-100 shadow-inner animate-in fade-in slide-in-from-bottom-4 duration-700">
            <CheckCircle2 size={48} />
          </div>

          {/* Mensagem Principal */}
          <div className="space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Assinatura <span className="text-indigo-600">Ativada!</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
              Parabéns! Você acaba de dar o passo mais importante para escalar seu negócio com inteligência artificial.
            </p>
          </div>

          {/* Card de Próximo Passo */}
          <div className="bg-slate-50 rounded-[2rem] p-6 mb-12 border border-slate-100 text-left flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
              <Zap size={32} />
            </div>
            <div>
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-1">Passo Obrigatório</h3>
              <p className="text-sm text-slate-500 font-medium">Conecte seu WhatsApp Business agora para que a IA comece a responder seus clientes.</p>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => navigate('/integracoes')}
              className="w-full bg-emerald-500 text-white py-6 rounded-3xl font-black text-xl hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 transform active:scale-95 group"
            >
              <MessageCircle size={24} />
              Conectar meu WhatsApp
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full bg-white text-slate-500 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 border border-slate-100"
            >
              <LayoutDashboard size={18} />
              Ir para o Dashboard primeiro
            </button>
          </div>

          {/* Rodapé do Card */}
          <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <ShieldCheck size={14} className="text-emerald-500" />
              Pagamento Seguro
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <Sparkles size={14} className="text-indigo-400" />
              Acesso Instantâneo
            </div>
          </div>
        </div>
        
        <p className="text-center mt-8 text-slate-400 text-sm font-medium">
          Dúvidas? <a href="#" className="text-indigo-600 font-bold hover:underline">Chame nosso suporte técnico</a>
        </p>
      </div>
    </div>
  );
};

export default ThankYouPage;
