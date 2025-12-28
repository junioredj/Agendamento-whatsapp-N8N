
import React from "react";
import {
  Plus,
  Briefcase,
  Clock,
  DollarSign,
  Trash2,
  Edit2,
  X,
  Save,
  CheckCircle2,
  Loader2,
  AlignLeft,
  Info,
} from "lucide-react";
import { api } from "../services/api";
import SmartIALoader from "../components/SmartIALoader";

interface Service {
  id: string;
  descricao: string;
  resumo?: string;
  tempo_conclusao: number;
  valor: number;
}

const ServicesPage: React.FC = () => {
  const [services, setServices] = React.useState<Service[]>([]);
  const [initialLoading, setInitialLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingService, setEditingService] = React.useState<Service | null>(
    null
  );
  const [loading, setLoading] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const [name, setName] = React.useState("");
  const [details, setDetails] = React.useState("");
  const [duration, setDuration] = React.useState(30);
  const [price, setPrice] = React.useState("");

  const fetchServices = async () => {
    try {
      setInitialLoading(true);
      const response = await api.get("/api/services");
      setServices(response.data);
    } catch (err: any) {
      console.error("Erro ao buscar serviços:", err);
      if (err.response?.status === 401) {
        window.location.href = "/login";
      }
    } finally {
      setInitialLoading(false);
    }
  };

  React.useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = () => {
    setEditingService(null);
    setName("");
    setDetails("");
    setDuration(30);
    setPrice("");
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setName(service.descricao || "");
    setDetails(service.resumo || "");
    setDuration(service.tempo_conclusao || 30);
    setPrice(service.valor != null ? service.valor.toFixed(2) : "");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;
    try {
      await api.delete(`/api/services/${id}`);
      setServices(services.filter((s) => s.id !== id));
    } catch (err) {
      alert("Erro ao excluir serviço. Tente novamente.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaveSuccess(false);

    const descricao = name.trim();
    const resumo = details.trim();
    const tempo_conclusao = Number(duration);
    const valor = parseFloat(price.replace(",", ".")) || 0;

    if (!descricao) {
      alert("Por favor, preencha o nome do serviço.");
      setLoading(false);
      return;
    }

    const payload = {
      descricao,
      resumo,
      tempo_conclusao,
      valor,
    };

    try {
      let res;
      if (editingService) {
        res = await api.put(`/api/services/${editingService.id}`, payload);
        setServices(
          services.map((s) => (s.id === editingService.id ? res.data : s))
        );
      } else {
        res = await api.post("/api/services", payload);
        setServices([...services, res.data]);
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSaveSuccess(false);
      }, 1500);
    } catch (err: any) {
      console.error("Erro ao salvar:", err);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <SmartIALoader
        message="Carregando dados"
        submessage="Aguarde enquanto carregamos os seus serviços"
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-slate-500 text-sm font-medium">
          Personalize os serviços que a sua IA oferecerá aos seus clientes.
        </p>
        <button
          onClick={openAddModal}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all transform active:scale-95"
        >
          <Plus size={20} /> Novo Serviço
        </button>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
          <div className="inline-block p-8 bg-slate-50 rounded-3xl mb-4">
            <Briefcase className="text-slate-300 mx-auto" size={48} />
          </div>
          <p className="text-slate-500 text-lg font-bold">
            Nenhum serviço cadastrado ainda.
          </p>
          <p className="text-slate-400 text-sm mt-1">
            Adicione seu primeiro serviço para que sua IA possa começar a
            agendar!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/20 transition-all group relative overflow-hidden flex flex-col h-full"
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <Briefcase size={20} />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(service)}
                      className="p-2 text-slate-400 hover:text-indigo-600 transition-all hover:bg-indigo-50 rounded-lg"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-all hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-800 mb-2">
                  {service.descricao}
                </h3>

                {service.resumo && (
                  <p className="text-slate-500 text-sm font-medium mb-4 line-clamp-2">
                    {service.resumo}
                  </p>
                )}

                <div className="mt-auto pt-4 border-t border-slate-50 space-y-3">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                    <Clock size={14} className="text-indigo-500" />{" "}
                    {service.tempo_conclusao} minutos
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 font-black text-2xl">
                    <span className="text-sm">R$</span>
                    {(service.valor ?? 0).toFixed(2).replace(".", ",")}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Serviço */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => !loading && setIsModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 md:p-10 animate-in zoom-in-95 duration-300 border border-slate-100">
            <h3 className="text-2xl font-black mb-8 text-slate-800">
              {editingService ? "Editar Serviço" : "Cadastrar Novo Serviço"}
            </h3>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Nome do Serviço
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Corte de cabelo"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none text-base font-bold transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2 group relative">
                  <AlignLeft size={12} /> Descrição Detalhada
                  <div className="relative cursor-help">
                    <Info size={14} className="text-indigo-400 hover:text-indigo-600 transition-colors" />
                    {/* Tooltip customizado */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-4 bg-slate-900 text-white text-[11px] font-medium leading-relaxed rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-2xl z-50 pointer-events-none">
                      Descreva o que está incluso no serviço para que a inteligência artifical possa entender melhor sobre o serviço prestado...
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
                    </div>
                  </div>
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Corte de cabelo realizado com tesoura e máquina, incluindo acabamento nas laterais e na nuca."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Duração
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                  >
                    <option value={5}>05 min</option>
                    <option value={10}>10 min</option>
                    <option value={15}>15 min</option>
                    <option value={20}>20 min</option>
                    <option value={25}>25 min</option>
                    <option value={30}>30 min</option>
                    <option value={35}>35 min</option>
                    <option value={40}>40 min</option>
                    <option value={45}>45 min</option>
                    <option value={50}>50 min</option>
                    <option value={55}>55 min</option>
                    <option value={60}>1h 00 min</option>
                    <option value={65}>1h 05 min</option>
                    <option value={70}>1h 10 min</option>
                    <option value={75}>1h 15 min</option>
                    <option value={80}>1h 20 min</option>
                    <option value={85}>1h 25 min</option>
                    <option value={90}>1h 30 min</option>
                    <option value={95}>1h 35 min</option>
                    <option value={100}>1h 40 min</option>
                    <option value={105}>1h 45 min</option>
                    <option value={110}>1h 50 min</option>
                    <option value={115}>1h 55 min</option>
                    <option value={120}>2h 00 min</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || !name || !price}
                  className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 disabled:opacity-60 transform active:scale-[0.98]"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : saveSuccess ? (
                    <>
                      <CheckCircle2 size={24} /> Sucesso!
                    </>
                  ) : (
                    <>
                      <Save size={24} />{" "}
                      {editingService ? "Atualizar Serviço" : "Salvar Serviço"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
