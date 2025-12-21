
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
  Info
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  duration: number; // em minutos
  price: number;
}

const ServicesPage: React.FC = () => {
  const [services, setServices] = React.useState<Service[]>([
    { id: '1', name: 'Corte de Cabelo Masculino', duration: 30, price: 50 },
    { id: '2', name: 'Barba Terapia', duration: 30, price: 35 },
    { id: '3', name: 'Combo: Corte + Barba', duration: 60, price: 75 },
    { id: '4', name: 'Sobrancelha', duration: 15, price: 15 },
  ]);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingService, setEditingService] = React.useState<Service | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  // Form states
  const [name, setName] = React.useState('');
  const [duration, setDuration] = React.useState(30);
  const [price, setPrice] = React.useState('');

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

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaveSuccess(false);

    // Simulação de API
    setTimeout(() => {
      const serviceData: Service = {
        id: editingService ? editingService.id : Math.random().toString(36).substr(2, 9),
        name,
        duration,
        price: parseFloat(price)
      };

      if (editingService) {
        setServices(services.map(s => s.id === editingService.id ? serviceData : s));
      } else {
        setServices([...services, serviceData]);
      }

      setLoading(false);
      setSaveSuccess(true);

      setTimeout(() => {
        setSaveSuccess(false);
        setIsModalOpen(false);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="max-w-6xl space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-slate-500 text-sm">Gerencie os serviços que sua IA oferecerá aos clientes.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" /> 
          Novo Serviço
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-[4rem] -mr-8 -mt-8 transition-all group-hover:scale-110"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white border border-slate-100 text-indigo-600 rounded-2xl shadow-sm">
                  <Scissors size={20} />
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => openEditModal(service)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(service.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-4 line-clamp-1">{service.name}</h3>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock size={14} />
                    <span className="text-xs font-medium">{service.duration} minutos</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <DollarSign size={14} />
                    <span className="text-sm font-bold">R$ {service.price.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="h-8 w-1 bg-indigo-100 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}

        {services.length === 0 && (
          <div className="col-span-full py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
            <div className="p-6 bg-slate-50 rounded-full text-slate-300 mb-4">
              <Scissors size={48} />
            </div>
            <h3 className="text-xl font-bold text-slate-700">Nenhum serviço cadastrado</h3>
            <p className="text-slate-400 max-w-xs mt-2">Cadastre seu primeiro serviço para que a IA possa agendar para você.</p>
            <button 
              onClick={openAddModal}
              className="mt-6 text-indigo-600 font-bold flex items-center gap-2 hover:underline"
            >
              Começar agora <Plus size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex gap-4">
        <Info className="text-amber-600 shrink-0" />
        <div>
          <h4 className="font-bold text-amber-800 text-sm">Como isso afeta a IA?</h4>
          <p className="text-amber-700 text-xs mt-1 leading-relaxed">
            A Inteligência Artificial usa a **Duração** de cada serviço para encontrar janelas de tempo livre no seu Google Calendar. Se você alterar um valor ou tempo, a IA passará a considerar as novas regras instantaneamente em todas as novas conversas no WhatsApp.
          </p>
        </div>
      </div>

      {/* Modal Adicionar/Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => !loading && setIsModalOpen(false)}
          ></div>
          
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Scissors size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {editingService ? 'Editar Serviço' : 'Novo Serviço'}
                  </h3>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  disabled={loading}
                  className="p-2 hover:bg-slate-50 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nome do Serviço</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Corte Degradê"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Duração</label>
                    <select 
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value={15}>15 min</option>
                      <option value={30}>30 min</option>
                      <option value={45}>45 min</option>
                      <option value={60}>1 hora</option>
                      <option value={90}>1h 30min</option>
                      <option value={120}>2 horas</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Valor (R$)</label>
                    <input 
                      type="number" 
                      required
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0,00"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-6 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={loading}
                    className="flex-1 py-4 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-colors border border-slate-200"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={loading || saveSuccess}
                    className={`flex-1 py-4 text-sm font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                      saveSuccess 
                        ? 'bg-emerald-600 text-white shadow-emerald-200' 
                        : loading 
                        ? 'bg-indigo-400 text-white cursor-wait'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                    }`}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : saveSuccess ? (
                      <>
                        <CheckCircle2 size={18} />
                        Sucesso!
                      </>
                    ) : (
                      <>
                        <Save size={18} /> 
                        {editingService ? 'Salvar' : 'Criar'}
                      </>
                    )}
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

export default ServicesPage;
