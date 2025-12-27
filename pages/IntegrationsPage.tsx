
import React from 'react';
import { 
  MessageCircle, 
  Calendar, 
  Shield, 
  CheckCircle2, 
  Info,
  ExternalLink,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import GoogleIcon from "../src/assets/images/google_calendar.png";
import WhatsappIcon from '../src/assets/images/whatsapp-business-icon.png';
import SmartIALoader from '../components/SmartIALoader';

const IntegrationsPage: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [waLoading, setWaLoading] = React.useState(false);
  const [gcLoading, setGcLoading] = React.useState(false);
  const [status, setStatus] = React.useState({ whatsapp: false, google: false });
  

  // Estados dos formulários
  const [waData, setWaData] = React.useState({ token: '', phoneId: '' });



  const fetchIntegrations = async () => {
    try {
        setLoading(true);
        
        // Chamada específica para o status do Google (sua nova rota)
        const googleRes = await api.get('/api/user/integrations-status');


        setStatus({ 
            whatsapp: null, 
            // Atualiza com base na resposta da nova API de status
            google: !!googleRes.data?.google_connected 
        });

    } catch (err) {
        console.error("Erro ao buscar integrações:", err);
        setStatus({ whatsapp: false, google: false });
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

//   const handleGoogleConnect = async () => {
//     setGcLoading(true);
    

    
//     try {
//         const response = await api.get('/api/conectar-google-calendar');
//         window.location.href = response.data.url;
//         setGcLoading(false);
//         setStatus(prev => ({ ...prev, google: true }));
//     } catch (err) {
//         alert("Erro ao obter link de autorização.");
//         setGcLoading(false);
//     }
// };




const handleGoogleConnect = async () => {
    setGcLoading(true);
    try {
        const response = await api.get('/api/conectar-google-calendar');
        
        // Abre o Google em uma nova janelinha
        const popup = window.open(response.data.url, 'Google Login', 'width=500,height=600');

        // Verifica a cada 1 segundo se o popup fechou
        const checkPopup = setInterval(() => {
            if (popup.closed) {
                clearInterval(checkPopup);
                setGcLoading(false);
                
                // Aqui você chama uma API rápida só para confirmar se o status mudou no banco
                verificarStatusConexao(); 
            }
        }, 1000);

    } catch (err) {
        alert("Erro ao conectar.");
        setGcLoading(false);
    }
};

const verificarStatusConexao = async () => {
    const res = await api.get('/api/user/integrations-status');
    if (res.data.google_connected) {
        setStatus(prev => ({ ...prev, google: true }));
    }
};


 

  const handleGoogleDisconnect = async () => {
    if(!confirm("Deseja realmente desconectar sua conta Google?")) return;
    
    setGcLoading(true);
    try {
        // Esta rota deve setar 'google_calendar_token' como null no Laravel
        await api.post('/api/user/google-disconnect');
        
        setStatus(prev => ({ ...prev, google: false }));
        alert("Conta Google desconectada com sucesso.");
    } catch (err) {
        console.error(err);
        alert("Erro ao desconectar conta.");
    } finally {
        setGcLoading(false);
    }
};

  if (loading) {
    return (
      <SmartIALoader 
        message="Carregando Integrações" 
        submessage="Conectando aos servidores Meta e Google..."
      />
    );
  }

  return (
    <div className="max-w-6xl space-y-8 animate-in fade-in duration-500 pb-20 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* WhatsApp Integration Card */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl shadow-inner">
                <img src={WhatsappIcon} alt="WhatsApp" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800">WhatsApp Business</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">API Cloud Oficial</p>
              </div>
            </div>
            {status.whatsapp && (
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-emerald-100">
                <CheckCircle2 size={12} /> Conectado
              </div>
            )}
          </div>

          <form onSubmit={handleSaveWA} className="space-y-6 flex-1">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Token Permanente</label>
              <input 
                type="password" 
                required
                value={waData.token}
                onChange={(e) => setWaData({...waData, token: e.target.value})}
                placeholder="Insira o Token gerado na Meta"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number ID</label>
              <input 
                type="text" 
                required
                value={waData.phoneId}
                onChange={(e) => setWaData({...waData, phoneId: e.target.value})}
                placeholder="ID do número de telefone"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
              />
            </div>

            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex gap-3">
              <Info className="text-indigo-600 shrink-0 mt-0.5" size={16} />
              <p className="text-[11px] text-indigo-800 leading-relaxed font-medium">
                Essas credenciais são obtidas no portal <strong>Meta for Developers</strong>. 
                <a href="#" className="font-bold underline ml-1 inline-flex items-center gap-0.5 hover:text-indigo-600">
                  Manual de ajuda <ExternalLink size={10} />
                </a>
              </p>
            </div>

            <button 
              type="submit"
              disabled={waLoading}
              className="w-full py-4 rounded-2xl font-black bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {waLoading ? <Loader2 className="animate-spin" /> : 'Sincronizar WhatsApp'}
            </button>
          </form>
        </div>

        {/* Google Calendar Integration Card - REFORMULADO */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl shadow-inner relative">
                {/* <Calendar size={32} /> */}
                <img src={GoogleIcon} alt="Google" />
                {/* Pequeno badge representando o Google */}
                
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800">Google Calendar</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sincronização Bidirecional</p>
              </div>
            </div>
            {status.google && (
              <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-blue-100">
                <CheckCircle2 size={12} /> Conectado
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-center text-center space-y-6">
            {!status.google ? (
              <div className="space-y-6 py-6">
                <div className="max-w-[280px] mx-auto">
                    <p className="text-slate-600 text-sm font-medium leading-relaxed">
                        Conecte sua conta Google para que a Inteligência Artificial verifique sua disponibilidade em tempo real e adicione os agendamentos automaticamente.
                    </p>
                </div>
                
                <div className="p-5 bg-blue-50/50 rounded-3xl border border-blue-100 flex items-start gap-4 text-left">
                  <Shield className="text-blue-600 shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="text-xs font-black text-blue-900 uppercase mb-1">Privacidade Total</h4>
                    <p className="text-[10px] text-blue-700 leading-tight font-medium">
                        A SmartSchedule acessa apenas os horários ocupados para evitar conflitos. Seus dados pessoais nunca são compartilhados.
                    </p>
                  </div>
                </div>

                <button 
                  onClick={handleGoogleConnect}
                  disabled={gcLoading}
                  className="w-full py-5 rounded-[2rem] font-black bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-lg shadow-slate-100 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  {gcLoading ? (
                    <Loader2 className="animate-spin text-blue-600" />
                  ) : (
                    <>
                      <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-6 h-6 object-contain" alt="Google" />
                      Conectar com Google Calendar
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-8 py-10 animate-in zoom-in-95 duration-500">
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4 border-4 border-emerald-100">
                        <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-lg font-black text-slate-800">Tudo pronto!</h3>
                    <p className="text-sm text-slate-400 font-bold">Sua agenda Google está vinculada.</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">G</div>
                        <div className="text-left">
                            <p className="text-xs font-black text-slate-700">Google Workspace</p>
                            <p className="text-[10px] text-slate-400 font-bold">Sincronização Ativa</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleGoogleDisconnect}
                        className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline px-3 py-1"
                    >
                        Desconectar
                    </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-center gap-2">
             <AlertCircle size={14} className="text-slate-300" />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Integração homologada via Google OAuth 2.0</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default IntegrationsPage;
