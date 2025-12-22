
import React from 'react';
import { 
  Plus, 
  Scissors, 
  Clock, 
  DollarSign, 
  Trash2, 
  Edit2, 
  X, 
  Save, 
  CheckCircle2,
  Info,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

const ServicesPage: React.FC = () => {
  const [services, setServices] = React.useState<Service[]>([]);
  const [initialLoading, setInitialLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingService, setEditingService] = React.useState<Service | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const [name, setName] = React.useState('');
  const [duration, setDuration] = React.useState(30);
  const [price, setPrice] = React.useState('');

  const fetchServices = async () => {
    try {
      setInitialLoading(true);
      const response = await api.get('/services');
      setServices(response.data);
    } catch (err) {
      console.error("Erro ao buscar serviços:", err);
    } finally {
      setInitialLoading(false);
    }
  };

  React.useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = () => {
    setEditingService(null);
    setName('');
    setDuration(30);
    setPrice('');
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setName(service.name);
    setDuration(service.duration);
    setPrice(service.price.toString());
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;
    
    try {
      await api.delete(`/services/${id}`);
      setServices(services.filter(s => s.id !== id));
    } catch (err) {
      alert("Erro ao excluir serviço.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaveSuccess(false);

    const payload = {
      name,
      duration,
      price: parseFloat(price)
    };

    try {
      if (editingService) {
        const res = await api.put(`/services/${editingService.id}`, payload);
        setServices(services.map(s => s.id === editingService.id ? res.data : s));
      } else {
        const res = await api.post('/services', payload);
        setServices([...services, res.data]);
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsModalOpen(false);
      }, 1000);
    } catch (err) {
      alert("Erro ao salvar serviço.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;
  }

  return (
    <div className="max-w-6xl space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <p className="text-slate-500 text-sm">Gerencie os serviços que sua IA oferecerá aos clientes.</p>
        <button onClick={openAddModal} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg">
          <Plus size={20} /> Novo Serviço
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white border border-slate-100 text-indigo-600 rounded-2xl shadow-sm"><Scissors size={20} /></div>
                <div className="flex gap-1">
                  <button onClick={() => openEditModal(service)} className="p-2 text-slate-400 hover:text-indigo-600 transition-all"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(service.id)} className="p-2 text-slate-400 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-4">{service.name}</h3>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-500 text-xs"><Clock size={14} /> {service.duration} min</div>
                  <div className="flex items-center gap-2 text-emerald-600 font-bold">R$ {service.price.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !loading && setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95">
              <h3 className="text-xl font-bold mb-8">{editingService ? 'Editar Serviço' : 'Novo Serviço'}</h3>
              <form onSubmit={handleSave} className="space-y-6">
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do Serviço" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-indigo-500 outline-none" />
                <div className="grid grid-cols-2 gap-4">
                  <select value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value={15}>15 min</option><option value={30}>30 min</option><option value={45}>45 min</option><option value={60}>1 hora</option>
                  </select>
                  <input type="number" required step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Valor (R$)" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" /> : saveSuccess ? <><CheckCircle2 size={18} /> Sucesso!</> : <><Save size={18} /> Salvar</>}
                </button>
              </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
