
import React from 'react';
import { 
  MessageCircle, 
  Calendar, 
  Shield, 
  Zap, 
  CheckCircle2, 
  Info,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';

const IntegrationsPage: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [waLoading, setWaLoading] = React.useState(false);
  const [gcLoading, setGcLoading] = React.useState(false);
  const [status, setStatus] = React.useState({ whatsapp: false, google: false });

  // Estados dos formulários
  const [waData, setWaData] = React.useState({ token: '', phoneId: '' });
  const [gcData, setGcData] = React.useState({ clientId: '', clientSecret: '' });

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/integrations');
      setWaData({ token: response.data.wa_token || '', phoneId: response.data.wa_phone_id || '' });
      setGcData({ clientId: response.data.gc_client_id || '', clientSecret: response.data.gc_client_secret || '' });
      setStatus({ whatsapp: !!response.data.wa_token, google: !!response.data.gc_client_id });
    } catch (err) {
      console.error("Erro ao buscar integrações:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleSaveWA = async (e: React.FormEvent) => {
    e.preventDefault();
    setWaLoading(true);
    try {
      await api.post('/integrations/whatsapp', waData);
      setStatus(prev => ({ ...prev, whatsapp: true }));
      alert("Integração WhatsApp salva com sucesso!");
    } catch (err) {
      alert("Erro ao salvar integração WhatsApp.");
    } finally {
      setWaLoading(false);
    }
  };

  const handleSaveGC = async (e: React.FormEvent) => {
    e.preventDefault();
    setGcLoading(true);
    try {
      await api.post('/integrations/google', gcData);
      setStatus(prev => ({ ...prev, google: true }));
      alert("Integração Google Agenda salva com sucesso!");
    } catch (err) {
      alert("Erro ao salvar integração Google.");
    } finally {
      setGcLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;
  }

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
            {status.whatsapp && <CheckCircle2 className="text-emerald-500" size={24} />}
          </div>

          <form onSubmit={handleSaveWA} className="space-y-6 flex-1">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Access Token (Permanente)</label>
              <input 
                type="password" 
                required
                value={waData.token}
                onChange={(e) => setWaData({...waData, token: e.target.value})}
                placeholder="EAAG..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number ID</label>
              <input 
                type="text" 
                required
                value={waData.phoneId}
                onChange={(e) => setWaData({...waData, phoneId: e.target.value})}
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
              disabled={waLoading}
              className="w-full py-4 rounded-2xl font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200 transition-all flex items-center justify-center gap-2"
            >
              {waLoading ? <Loader2 className="animate-spin" /> : 'Salvar Configurações'}
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
            {status.google && <CheckCircle2 className="text-emerald-500" size={24} />}
          </div>

          <form onSubmit={handleSaveGC} className="space-y-6 flex-1">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Client ID (OAuth 2.0)</label>
              <input 
                type="text" 
                required
                value={gcData.clientId}
                onChange={(e) => setGcData({...gcData, clientId: e.target.value})}
                placeholder="seu-app.apps.googleusercontent.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Client Secret</label>
              <input 
                type="password" 
                required
                value={gcData.clientSecret}
                onChange={(e) => setGcData({...gcData, clientSecret: e.target.value})}
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
              disabled={gcLoading}
              className="w-full py-4 rounded-2xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 transition-all flex items-center justify-center gap-2"
            >
              {gcLoading ? <Loader2 className="animate-spin" /> : 'Vincular Google Agenda'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default IntegrationsPage;
