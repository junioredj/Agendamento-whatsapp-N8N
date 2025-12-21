
import React from 'react';
import { 
  MessageCircle, 
  Calendar, 
  Shield, 
  Zap, 
  CheckCircle2, 
  Save, 
  Info,
  ExternalLink,
  Smartphone
} from 'lucide-react';

const IntegrationsPage: React.FC = () => {
  const [waLoading, setWaLoading] = React.useState(false);
  const [waSuccess, setWaSuccess] = React.useState(false);
  const [gcLoading, setGcLoading] = React.useState(false);
  const [gcSuccess, setGcSuccess] = React.useState(false);

  const handleSaveWA = (e: React.FormEvent) => {
    e.preventDefault();
    setWaLoading(true);
    setTimeout(() => {
      setWaLoading(false);
      setWaSuccess(true);
      setTimeout(() => setWaSuccess(false), 3000);
    }, 1500);
  };

  const handleSaveGC = (e: React.FormEvent) => {
    e.preventDefault();
    setGcLoading(true);
    setTimeout(() => {
      setGcLoading(false);
      setGcSuccess(true);
      setTimeout(() => setGcSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-6xl space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* WhatsApp Integration Card */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                <MessageCircle size={32} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">WhatsApp Oficial</h2>
                <p className="text-sm text-slate-500">API Business (Cloud API)</p>
              </div>
            </div>
            {waSuccess && <CheckCircle2 className="text-emerald-500" size={24} />}
          </div>

          <form onSubmit={handleSaveWA} className="space-y-6 flex-1">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Access Token (Permanente)</label>
              <input 
                type="password" 
                required
                placeholder="EAAG..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number ID</label>
              <input 
                type="text" 
                required
                placeholder="1234567890..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex gap-3">
              <Info className="text-indigo-600 shrink-0" size={18} />
              <p className="text-[11px] text-indigo-700 leading-relaxed">
                Você pode encontrar essas credenciais no painel de desenvolvedores do Facebook (Meta for Developers). 
                <a href="#" className="font-bold underline ml-1 inline-flex items-center gap-0.5">Ver tutorial <ExternalLink size={10} /></a>
              </p>
            </div>

            <button 
              type="submit"
              disabled={waLoading || waSuccess}
              className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                waSuccess 
                  ? 'bg-emerald-600 text-white shadow-emerald-200' 
                  : waLoading 
                  ? 'bg-indigo-400 text-white cursor-wait'
                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'
              }`}
            >
              {waLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : waSuccess ? (
                <>Conectado!</>
              ) : (
                <>Conectar WhatsApp</>
              )}
            </button>
          </form>
        </div>

        {/* Google Calendar Integration Card */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                <Calendar size={32} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Google Calendar</h2>
                <p className="text-sm text-slate-500">Sincronização de Agenda</p>
              </div>
            </div>
            {gcSuccess && <CheckCircle2 className="text-emerald-500" size={24} />}
          </div>

          <form onSubmit={handleSaveGC} className="space-y-6 flex-1">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Client ID (OAuth 2.0)</label>
              <input 
                type="text" 
                required
                placeholder="seu-app.apps.googleusercontent.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Client Secret</label>
              <input 
                type="password" 
                required
                placeholder="••••••••••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
              <Shield className="text-blue-600 shrink-0" size={18} />
              <p className="text-[11px] text-blue-700 leading-relaxed">
                Suas informações são protegidas. A IA lê apenas sua disponibilidade para evitar conflitos de horários.
              </p>
            </div>

            <button 
              type="submit"
              disabled={gcLoading || gcSuccess}
              className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                gcSuccess 
                  ? 'bg-emerald-600 text-white shadow-emerald-200' 
                  : gcLoading 
                  ? 'bg-indigo-400 text-white cursor-wait'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
              }`}
            >
              {gcLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : gcSuccess ? (
                <>Sincronizado!</>
              ) : (
                <>Vincular Google Agenda</>
              )}
            </button>
          </form>
        </div>

      </div>

      {/* IA Status Monitor */}
      <div className="bg-slate-900 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
          <Zap size={200} />
        </div>
        
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Zap className="text-indigo-400" /> Monitor da IA
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <p className="text-slate-400 text-xs font-bold uppercase">Status do Fluxo</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-sm font-medium">IA Pronta para Atender</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-slate-400 text-xs font-bold uppercase">Conexão WhatsApp</p>
              <p className="text-sm font-medium">{waSuccess ? 'Verificada e Ativa' : 'Aguardando Credenciais'}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-slate-400 text-xs font-bold uppercase">Sincronização Agenda</p>
              <p className="text-sm font-medium">{gcSuccess ? 'Tempo Real Habilitado' : 'Não Vinculada'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsPage;
