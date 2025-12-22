
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
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';

const countryCodes = [
  { code: '+55', country: 'BR', name: 'Brasil' },
  { code: '+1', country: 'US', name: 'Estados Unidos/Canadá' },
  { code: '+351', country: 'PT', name: 'Portugal' },
].sort((a, b) => a.name.localeCompare(b.name));

const ProfilePage: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);
  
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    business_name: '',
    ddi: '+55'
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/me');
      setFormData({
        name: response.data.name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        business_name: response.data.business_name || '',
        ddi: response.data.ddi || '+55'
      });
    } catch (err) {
      console.error("Erro ao buscar perfil:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      await api.put('/me', formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert("Erro ao salvar perfil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;
  }

  return (
    <div className="max-w-4xl animate-in fade-in duration-500 relative">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-violet-600 relative">
          <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-full">
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-indigo-600 font-bold text-3xl border-4 border-white shadow-sm">
              {formData.name.charAt(0)}
            </div>
          </div>
        </div>

        <div className="pt-16 p-8">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{formData.name}</h2>
              <p className="text-slate-500">Membro Pro</p>
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
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Mail size={16} /> E-mail
                </label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Smartphone size={16} /> WhatsApp Conectado
                </label>
                <div className="flex gap-2">
                  <select 
                    value={formData.ddi}
                    onChange={(e) => setFormData({...formData, ddi: e.target.value})}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-3 outline-none"
                  >
                    {countryCodes.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                  </select>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Building size={16} /> Nome do Negócio
                </label>
                <input 
                  type="text" 
                  value={formData.business_name}
                  onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button 
                type="submit"
                disabled={saving}
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-indigo-700 transition-all"
              >
                {saving ? <Loader2 className="animate-spin" /> : saveSuccess ? <><CheckCircle2 size={18} /> Salvo!</> : <><Save size={18} /> Salvar Alterações</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
