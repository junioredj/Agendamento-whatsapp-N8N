
import React from 'react';
import { ArrowLeft, Lock, Eye, Database, Share2, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const PrivacyPage: React.FC = () => {
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
            <Lock className="absolute right-10 top-10 opacity-10" size={120} />
            <h1 className="text-4xl font-black mb-2">Privacidade</h1>
            <p className="text-indigo-100 font-medium">Conformidade com a LGPD • Segurança Máxima</p>
          </div>

          <div className="p-10 md:p-16 prose prose-slate max-w-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <Eye className="text-indigo-600 mb-4" size={32} />
                <h3 className="font-black text-slate-800 mb-2">O que vemos?</h3>
                <p className="text-sm text-slate-500">Coletamos dados de contato dos seus clientes e horários da sua agenda para fins de marcação.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <Database className="text-indigo-600 mb-4" size={32} />
                <h3 className="font-black text-slate-800 mb-2">Onde fica?</h3>
                <p className="text-sm text-slate-500">Seus dados são armazenados em servidores criptografados de alta segurança.</p>
              </div>
            </div>

            <section className="mb-12">
              <h2 className="text-2xl font-black text-slate-800 mb-4 flex items-center gap-3">
                <UserCheck className="text-indigo-600" /> 1. Coleta de Dados
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Para o funcionamento da plataforma, coletamos dados fornecidos pelo usuário (Nome, E-mail, Empresa, Telefone) e dados dos seus clientes (Nome e Telefone) que interagem com a IA no WhatsApp.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-black text-slate-800 mb-4 flex items-center gap-3">
                <Share2 className="text-indigo-600" /> 2. Compartilhamento com Terceiros
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Seus dados são compartilhados apenas com parceiros essenciais:
              </p>
              <ul className="list-disc pl-5 text-slate-600 space-y-2 mt-4">
                <li><strong>Meta (WhatsApp Business):</strong> Para processar as mensagens.</li>
                <li><strong>Google LLC:</strong> Para sincronização da agenda.</li>
                <li><strong>Stripe:</strong> Para processamento seguro de pagamentos.</li>
                <li><strong>Google Cloud (Gemini AI):</strong> Para processamento de inteligência artificial.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-black text-slate-800 mb-4">3. Direitos do Usuário (LGPD)</h2>
              <p className="text-slate-600 leading-relaxed">
                Você tem o direito de acessar, corrigir, portar ou solicitar a exclusão de seus dados a qualquer momento. Para exercer esses direitos, basta entrar em contato através do nosso suporte.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-black text-slate-800 mb-4">4. Segurança dos Dados</h2>
              <p className="text-slate-600 leading-relaxed">
                Implementamos medidas técnicas e administrativas para proteger seus dados contra acessos não autorizados e situações acidentais ou ilícitas de destruição, perda ou alteração.
              </p>
            </section>

            <div className="pt-10 border-t border-slate-100 text-center">
              <p className="text-slate-400 text-sm">
                Política válida a partir de Junho de 2024.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
