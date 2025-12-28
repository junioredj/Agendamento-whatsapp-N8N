
import React from 'react';
import { ArrowLeft, ShieldCheck, FileText, Scale, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const TermsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 pt-32">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-8 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Voltar
        </button>

        <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="bg-indigo-600 p-10 text-white relative">
            <FileText className="absolute right-10 top-10 opacity-10" size={120} />
            <h1 className="text-4xl font-black mb-2">Termos de Uso</h1>
            <p className="text-indigo-100 font-medium">Última atualização: 24 de Maio de 2024</p>
          </div>

          <div className="p-10 md:p-16 prose prose-slate max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-black text-slate-800 mb-4 flex items-center gap-3">
                <ShieldCheck className="text-indigo-600" /> 1. Aceitação dos Termos
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Ao acessar e utilizar a plataforma <strong>SmartSchedule AI</strong>, você concorda em cumprir e estar vinculado a estes Termos de Uso. Este serviço é operado para fornecer automação de agendamentos via WhatsApp para profissionais de beleza e barbearias.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-black text-slate-800 mb-4 flex items-center gap-3">
                <Scale className="text-indigo-600" /> 2. Descrição do Serviço
              </h2>
              <p className="text-slate-600 leading-relaxed">
                A SmartSchedule AI fornece uma interface de inteligência artificial que interage com clientes finais através da API do WhatsApp para realizar agendamentos, tirar dúvidas e sincronizar dados com o Google Calendar. O usuário é responsável por obter as credenciais necessárias junto à Meta e Google.
              </p>
            </section>

            <section className="mb-12 p-6 bg-amber-50 rounded-3xl border border-amber-100">
              <h2 className="text-xl font-black text-amber-800 mb-4 flex items-center gap-3">
                <AlertTriangle /> 3. Responsabilidade sobre a IA
              </h2>
              <p className="text-amber-900/80 text-sm leading-relaxed">
                Nossa IA utiliza processamento de linguagem natural. Embora busquemos a máxima precisão, o SmartSchedule AI não se responsabiliza por erros de interpretação cometidos pela IA que resultem em agendamentos incorretos. O usuário deve configurar seus serviços e horários corretamente para minimizar riscos.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-black text-slate-800 mb-4">4. Assinaturas e Pagamentos</h2>
              <ul className="list-disc pl-5 text-slate-600 space-y-2">
                <li>Os planos são cobrados mensalmente de forma recorrente via Stripe.</li>
                <li>O cancelamento pode ser feito a qualquer momento pelo painel, mantendo o acesso até o fim do ciclo pago.</li>
                <li>Reembolsos são analisados individualmente em até 7 dias após a primeira contratação.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-black text-slate-800 mb-4">5. Propriedade Intelectual</h2>
              <p className="text-slate-600 leading-relaxed">
                Todo o código, design, algoritmos de IA e marca SmartSchedule AI são de propriedade exclusiva da nossa empresa. É proibida a engenharia reversa ou reprodução parcial dos nossos sistemas.
              </p>
            </section>

            <div className="pt-10 border-t border-slate-100 text-center">
              <p className="text-slate-400 text-sm">
                Dúvidas sobre estes termos? <a href="mailto:suporte@smartschedule.ai" className="text-indigo-600 font-bold">suporte@smartschedule.ai</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
