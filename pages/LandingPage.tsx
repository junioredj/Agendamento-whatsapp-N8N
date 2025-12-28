
import React from 'react';
// Fix: Use namespace import for react-router-dom to resolve missing member error
import * as ReactRouter from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  CheckCircle2, 
  Bot,
  ArrowRight,
  Sparkles,
  Calendar,
  MessageCircle,
  Clock,
  TrendingUp,
  User,
  Zap,
  ShieldCheck,
  Smartphone,
  Star
} from 'lucide-react';

const { Link } = ReactRouter;

const LandingPage: React.FC = () => {
  const steps = [
    {
      number: 1,
      icon: <MessageCircle size={28} />,
      iconColor: "bg-[#25D366]",
      title: "Cliente envia mensagem",
      desc: "Seu cliente entra em contato pelo WhatsApp solicitando um agendamento."
    },
    {
      number: 2,
      icon: <Bot size={28} />,
      iconColor: "bg-gradient-to-br from-[#6366f1] to-[#a855f7]",
      title: "IA responde automaticamente",
      desc: "Nosso agente de IA entende o pedido e oferece os horários disponíveis."
    },
    {
      number: 3,
      icon: <Calendar size={28} />,
      iconColor: "bg-[#10b981]",
      title: "Horário é confirmado",
      desc: "A IA agenda no sistema e sincroniza com Google Calendar automaticamente."
    },
    {
      number: 4,
      icon: <CheckCircle2 size={28} />,
      iconColor: "bg-[#6366f1]",
      title: "Lembrete automático",
      desc: "O cliente recebe confirmação e lembrete antes do atendimento."
    }
  ];

  const benefits = [
    {
      icon: <Clock size={20} className="text-indigo-600" />,
      title: "Atendimento 24/7",
      desc: "Sua IA nunca dorme. Atenda clientes a qualquer hora, mesmo de madrugada."
    },
    {
      icon: <TrendingUp size={20} className="text-indigo-600" />,
      title: "Aumente seu faturamento",
      desc: "Mais agendamentos automáticos significa mais clientes e mais receita."
    },
    {
      icon: <User size={20} className="text-indigo-600" />,
      title: "Menos trabalho manual",
      desc: "Pare de responder mensagens repetitivas. A IA cuida de tudo."
    },
    {
      icon: <Zap size={20} className="text-indigo-600" />,
      title: "Respostas instantâneas",
      desc: "Clientes recebem resposta em segundos, não em horas ou dias."
    },
    {
      icon: <ShieldCheck size={20} className="text-indigo-600" />,
      title: "Reduz faltas",
      desc: "Lembretes automáticos diminuem significativamente os no-shows."
    },
    {
      icon: <Smartphone size={20} className="text-indigo-600" />,
      title: "Tudo pelo WhatsApp",
      desc: "Seus clientes já usam WhatsApp. Sem apps extras para baixar."
    }
  ];

  const testimonials = [
    {
      text: "Depois do SmartSchedule, meus agendamentos aumentaram 40%. A IA responde na hora e meus clientes adoram!",
      name: "Carlos Silva",
      role: "Barbearia Vintage",
      initials: "CS",
      color: "bg-indigo-600"
    },
    {
      text: "Antes eu passava horas respondendo WhatsApp. Agora a IA faz tudo e eu foco nas clientes.",
      name: "Ana Paula",
      role: "Studio de Beleza AP",
      initials: "AP",
      color: "bg-violet-600"
    },
    {
      text: "A integração com Google Calendar é perfeita. Nunca mais tive conflito de horário!",
      name: "Marina Costa",
      role: "Espaço Nails",
      initials: "MC",
      color: "bg-blue-600"
    }
  ];

  return (
    <div className="pt-16">
      <Navbar />
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24 bg-slate-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-indigo-100 rounded-full blur-3xl opacity-20 -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-8 animate-bounce">
            <Bot size={18} />
            IA Revolucionando Agendamentos
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 leading-tight">
            Seu <span className="gradient-text">Agente de IA</span> que agenda por você no WhatsApp.
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Deixe que nossa inteligência artificial atenda seus clientes, tire dúvidas e agende horários 24 horas por dia. Menos trabalho manual, mais faturamento.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link to="/registrar" className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-200">
              Começar Agora Gratuitamente <ArrowRight size={20} />
            </Link>
            <Link to="/precos" className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-xl text-lg font-bold hover:bg-slate-50 transition-all">
              Ver Planos
            </Link>
          </div>
        </div>
      </section>

      {/* 2. WhatsApp Simulation Section */}
      <section className="py-24 bg-white overflow-hidden border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-4xl font-bold mb-6 text-slate-900">Assista a IA em ação no WhatsApp</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Esqueça as respostas demoradas. Nossa IA responde instantaneamente, consulta sua agenda e fecha o horário. O cliente sai satisfeito e você foca no seu talento.
              </p>
              
              <div className="space-y-4">
                {[
                  "Entendimento de linguagem natural (texto e áudio)",
                  "Sincronização em tempo real com sua agenda",
                  "Lembretes automáticos para reduzir faltas",
                  "Suporte a reagendamentos inteligente"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-1 rounded-full text-indigo-600">
                      <CheckCircle2 size={18} />
                    </div>
                    <span className="font-semibold text-slate-700">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative order-1 lg:order-2">
              <div className="mx-auto w-[300px] h-[600px] bg-slate-900 rounded-[3rem] p-2.5 shadow-2xl border-8 border-slate-800 relative z-10 flex flex-col overflow-hidden">
                <div className="h-5 w-24 bg-slate-800 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl z-20"></div>
                <div className="flex-1 bg-[#e5ddd5] rounded-[2.2rem] overflow-hidden flex flex-col">
                  <div className="bg-[#075e54] p-3 pt-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[#075e54] text-xs">S</div>
                    <div>
                      <p className="text-white text-[12px] font-bold leading-none">Smart Barber IA</p>
                      <p className="text-white/70 text-[9px]">Online agora</p>
                    </div>
                  </div>
                  <div className="flex-1 p-3 space-y-4 overflow-y-auto bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat">
                    <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm max-w-[85%]">
                      <p className="text-[12px]">Olá! Como posso te ajudar hoje? ✂️</p>
                    </div>
                    <div className="bg-[#dcf8c6] p-2 rounded-lg rounded-tr-none shadow-sm max-w-[85%] ml-auto">
                      <p className="text-[12px]">Quero cortar o cabelo amanhã a tarde!</p>
                    </div>
                    <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm max-w-[85%]">
                      <p className="text-[12px]">Claro! Temos às 14:30 e às 16:00. Qual prefere?</p>
                    </div>
                    <div className="bg-[#dcf8c6] p-2 rounded-lg rounded-tr-none shadow-sm max-w-[85%] ml-auto">
                      <p className="text-[12px]">16:00 tá perfeito.</p>
                    </div>
                    <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm max-w-[85%]">
                      <p className="text-[12px] font-bold text-indigo-600">Confirmado! ✅</p>
                      <p className="text-[12px]">Corte marcado para amanhã às 16:00. Te vejo lá!</p>
                    </div>
                  </div>
                  <div className="bg-[#f0f0f0] p-2 flex gap-2">
                    <div className="flex-1 bg-white rounded-full px-3 py-1.5 text-[10px] text-slate-400">Digite uma mensagem...</div>
                    <div className="w-6 h-6 bg-[#075e54] rounded-full flex items-center justify-center text-white">
                      <Bot size={12} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[80px] -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Como Funciona Section */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Como a SmartSchedule Funciona?</h2>
            <p className="text-slate-500 text-lg">Um fluxo simples, automático e extremamente eficiente.</p>
          </div>
          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {steps.map((step, i) => (
                <div key={i} className="relative group">
                  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col relative">
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg border-4 border-white">
                      {step.number}
                    </div>
                    <div className={`${step.iconColor} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-slate-100 group-hover:scale-110 transition-transform duration-300`}>
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Por que escolher Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
              Por que escolher o <span className="gradient-text">SmartSchedule</span>?
            </h2>
            <p className="text-slate-500 text-lg">Benefícios que transformam a gestão do seu negócio</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <div key={i} className="p-8 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold mb-3 text-slate-900">{benefit.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Depoimentos Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
              O que nossos clientes <span className="gradient-text">estão dizendo</span>
            </h2>
            <p className="text-slate-500 text-lg">Veja como o SmartSchedule está transformando negócios</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-left flex flex-col h-full">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} size={16} className="fill-emerald-400 text-emerald-400" />
                  ))}
                </div>
                
                <p className="text-slate-600 text-sm italic mb-8 flex-1 leading-relaxed">
                  "{t.text}"
                </p>

                <div className="flex items-center gap-4 border-t border-slate-50 pt-6">
                  <div className={`w-12 h-12 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                    <p className="text-slate-400 text-xs font-medium">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Final CTA Section (New Section from Image) */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-[#8b5cf6] to-[#a855f7] rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_50%_50%,#fff,transparent)] pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-sm font-bold mb-8">
              <Sparkles size={16} /> Comece gratuitamente
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              Pronto para automatizar seus <br className="hidden md:block" /> agendamentos?
            </h2>
            
            <p className="text-white/80 text-lg md:text-xl mb-12 max-w-3xl mx-auto font-medium">
              Junte-se a centenas de profissionais que já economizam tempo e aumentam seus lucros com o SmartSchedule AI.
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Link 
                to="/registrar" 
                className="bg-white text-[#8b5cf6] px-10 py-5 rounded-2xl text-lg font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-xl"
              >
                Criar conta grátis <ArrowRight size={20} />
              </Link>
              <Link 
                to="/precos" 
                className="bg-transparent border-2 border-white/30 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-white/10 transition-all"
              >
                Ver planos e preços
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Sparkles className="text-indigo-400" />
            <span className="text-xl font-bold">SmartSchedule AI</span>
          </div>
          <p className="text-slate-400 text-sm">© 2024 SmartSchedule Inc. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <Link to="/termos" className="hover:text-indigo-400 transition-colors">Termos</Link>
            <Link to="/privacidade" className="hover:text-indigo-400 transition-colors">Privacidade</Link>
            <a href="#" className="hover:text-indigo-400 transition-colors">Suporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
