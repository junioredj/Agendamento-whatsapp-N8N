
import React from 'react';
import { 
  User, 
  Mail, 
  Smartphone, 
  Building, 
  Save, 
  ShieldCheck, 
  ChevronDown, 
  Lock, 
  X,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react';

const countryCodes = [
  { code: '+55', country: 'BR', name: 'Brasil' },
  { code: '+1', country: 'US', name: 'Estados Unidos/Canadá' },
  { code: '+351', country: 'PT', name: 'Portugal' },
  { code: '+44', country: 'GB', name: 'Reino Unido' },
  { code: '+34', country: 'ES', name: 'Espanha' },
  { code: '+33', country: 'FR', name: 'França' },
  { code: '+49', country: 'DE', name: 'Alemanha' },
  { code: '+39', country: 'IT', name: 'Itália' },
  { code: '+54', country: 'AR', name: 'Argentina' },
  { code: '+52', country: 'MX', name: 'México' },
  { code: '+56', country: 'CL', name: 'Chile' },
  { code: '+57', country: 'CO', name: 'Colômbia' },
  { code: '+598', country: 'UY', name: 'Uruguai' },
  { code: '+595', country: 'PY', name: 'Paraguai' },
  { code: '+51', country: 'PE', name: 'Peru' },
  { code: '+591', country: 'BO', name: 'Bolívia' },
  { code: '+58', country: 'VE', name: 'Venezuela' },
  { code: '+507', country: 'PA', name: 'Panamá' },
  { code: '+506', country: 'CR', name: 'Costa Rica' },
  { code: '+505', country: 'NI', name: 'Nicarágua' },
  { code: '+504', country: 'HN', name: 'Honduras' },
  { code: '+503', country: 'SV', name: 'El Salvador' },
  { code: '+502', country: 'GT', name: 'Guatemala' },
  { code: '+53', country: 'CU', name: 'Cuba' },
  { code: '+1', country: 'DO', name: 'Rep. Dominicana' },
  { code: '+593', country: 'EC', name: 'Equador' },
  { code: '+81', country: 'JP', name: 'Japão' },
  { code: '+82', country: 'KR', name: 'Coreia do Sul' },
  { code: '+86', country: 'CN', name: 'China' },
  { code: '+91', country: 'IN', name: 'Índia' },
  { code: '+61', country: 'AU', name: 'Austrália' },
  { code: '+64', country: 'NZ', name: 'Nova Zelândia' },
  { code: '+7', country: 'RU', name: 'Rússia' },
  { code: '+27', country: 'ZA', name: 'África do Sul' },
  { code: '+244', country: 'AO', name: 'Angola' },
  { code: '+258', country: 'MZ', name: 'Moçambique' },
  { code: '+238', country: 'CV', name: 'Cabo Verde' },
  { code: '+245', country: 'GW', name: 'Guiné-Bissau' },
  { code: '+239', country: 'ST', name: 'S. Tomé e Príncipe' },
  { code: '+41', country: 'CH', name: 'Suíça' },
  { code: '+32', country: 'BE', name: 'Bélgica' },
  { code: '+31', country: 'NL', name: 'Holanda' },
  { code: '+43', country: 'AT', name: 'Áustria' },
  { code: '+46', country: 'SE', name: 'Suécia' },
  { code: '+47', country: 'NO', name: 'Noruega' },
  { code: '+45', country: 'DK', name: 'Dinamarca' },
  { code: '+353', country: 'IE', name: 'Irlanda' },
  { code: '+30', country: 'GR', name: 'Grécia' },
  { code: '+90', country: 'TR', name: 'Turquia' },
  { code: '+971', country: 'AE', name: 'Emirados Árabes' },
  { code: '+966', country: 'SA', name: 'Arábia Saudita' },
  { code: '+972', country: 'IL', name: 'Israel' },
].sort((a, b) => a.name.localeCompare(b.name));

const ProfilePage: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);
  const [passwordLoading, setPasswordLoading] = React.useState(false);
  const [selectedDDI, setSelectedDDI] = React.useState('+55');
  const [phoneNumber, setPhoneNumber] = React.useState('11988887777');
  const [showCurrentPass, setShowCurrentPass] = React.useState(false);
  const [showNewPass, setShowNewPass] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaveSuccess(false);

    // Simula uma chamada de API
    setTimeout(() => {
      setLoading(false);
      setSaveSuccess(true);
      
      // Resetar o estado de sucesso após 3 segundos
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1200);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    // Simula uma chamada de API
    setTimeout(() => {
      setPasswordLoading(false);
      setIsPasswordModalOpen(false);
      alert("Senha alterada com sucesso!");
    }, 1500);
  };

  return (
    <div className="max-w-4xl animate-in fade-in duration-500 relative">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-violet-600 relative">
          <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-full">
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-indigo-600 font-bold text-3xl border-4 border-white shadow-sm">
              J
            </div>
          </div>
        </div>

        <div className="pt-16 p-8">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">João Silva</h2>
              <p className="text-slate-500">Membro Pro desde Janeiro 2024</p>
            </div>
            <div className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-xs font-bold">
              <ShieldCheck size={16} /> CONTA VERIFICADA
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <User size={16} /> Nome Completo
                </label>
                <input 
                  type="text" 
                  defaultValue="João Silva"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Mail size={16} /> E-mail
                </label>
                <input 
                  type="email" 
                  defaultValue="joao.silva@barbearia.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Smartphone size={16} /> WhatsApp Conectado
                </label>
                <div className="flex gap-2">
                  <div className="relative min-w-[140px]">
                    <select 
                      value={selectedDDI}
                      onChange={(e) => setSelectedDDI(e.target.value)}
                      className="w-full h-full appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-3 outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold text-slate-700 cursor-pointer transition-all"
                    >
                      {countryCodes.map((item) => (
                        <option key={`${item.country}-${item.code}`} value={item.code}>
                          {item.name} ({item.code})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                  </div>
                  <input 
                    type="tel" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="Número do WhatsApp"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Building size={16} /> Nome do Negócio
                </label>
                <input 
                  type="text" 
                  defaultValue="João Barber Shop"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
              <p className="text-xs text-slate-400 max-w-sm">
                Ao alterar seu e-mail ou número de WhatsApp, a IA reiniciará a conexão para validar as novas credenciais.
              </p>
              <button 
                type="submit"
                disabled={loading || saveSuccess}
                className={`min-w-[200px] px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                  saveSuccess 
                    ? 'bg-emerald-600 text-white shadow-emerald-200' 
                    : loading 
                    ? 'bg-indigo-400 text-white cursor-wait'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Salvando...
                  </>
                ) : saveSuccess ? (
                  <>
                    <CheckCircle2 size={18} />
                    Salvo com Sucesso!
                  </>
                ) : (
                  <>
                    <Save size={18} /> 
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">Segurança</h3>
          <button 
            onClick={() => setIsPasswordModalOpen(true)}
            className="text-sm text-indigo-600 font-bold hover:text-indigo-700 transition-colors flex items-center gap-2 group"
          >
             Alterar senha de acesso 
             <div className="p-1 bg-indigo-50 rounded group-hover:bg-indigo-100 transition-colors">
               <Lock size={14} />
             </div>
          </button>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">Assinatura</h3>
          <div className="flex items-center justify-between">
            <div>
               <p className="text-sm font-bold text-slate-700">Plano Pro</p>
               <p className="text-xs text-green-500 font-medium">Assinatura Ativa</p>
            </div>
            <button className="text-sm text-red-500 font-bold hover:text-red-600 transition-colors">Cancelar</button>
          </div>
        </div>
      </div>

      {/* Modal de Alteração de Senha */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => !passwordLoading && setIsPasswordModalOpen(false)}
          ></div>
          
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 fade-in duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Lock size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Alterar Senha</h3>
                </div>
                <button 
                  onClick={() => setIsPasswordModalOpen(false)}
                  disabled={passwordLoading}
                  className="p-2 hover:bg-slate-50 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Senha Atual</label>
                  <div className="relative">
                    <input 
                      type={showCurrentPass ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nova Senha</label>
                  <div className="relative">
                    <input 
                      type={showNewPass ? "text" : "password"}
                      required
                      placeholder="Pelo menos 8 caracteres"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 flex gap-3">
                   <div className="shrink-0 text-indigo-600 mt-0.5">
                     <CheckCircle2 size={16} />
                   </div>
                   <p className="text-[11px] text-indigo-700 leading-relaxed">
                     Sua nova senha deve ser diferente da anterior e conter uma combinação de letras, números e símbolos para maior segurança.
                   </p>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    disabled={passwordLoading}
                    className="flex-1 py-4 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-colors border border-slate-200"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={passwordLoading}
                    className="flex-1 py-4 text-sm font-bold bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {passwordLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : "Atualizar Senha"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
