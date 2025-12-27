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
} from "lucide-react";
import { api } from "../services/api";
import SmartIALoader from '../components/SmartIALoader';

interface Service {
  id: string;
  descricao: string;
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
  const [duration, setDuration] = React.useState(30);
  const [price, setPrice] = React.useState("");

  const fetchServices = async () => {
    try {
      setInitialLoading(true);
      const response = await api.get("/api/services"); // Laravel já filtra pelo usuário logado
      setServices(response.data);
    } catch (err: any) {
      console.error("Erro ao buscar serviços:", err);
      if (err.response?.status === 401) {
        // Sessão expirada (opcional: redirecionar para login)
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
    setDuration(30);
    setPrice("");
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setName(service.descricao || "");
    setDuration(service.tempo_conclusao || 30);
    setPrice(service.valor != null ? service.valor.toFixed(2) : "");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;

    try {
      alert("O id é: " + id)
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

  // Garanta que os valores sejam válidos
  const descricao = name.trim();
  const tempo_conclusao = Number(duration);
  const valor = parseFloat(price.replace(',', '.')) || 0;

  if (!descricao) {
    alert("Por favor, preencha a descrição do serviço.");
    setLoading(false);
    return;
  }

  if (isNaN(tempo_conclusao) || tempo_conclusao <= 0) {
    alert("Selecione um tempo de conclusão válido.");
    setLoading(false);
    return;
  }

  if (isNaN(valor) || valor < 0) {
    alert("Insira um valor válido.");
    setLoading(false);
    return;
  }

  const payload = {
    descricao,
    tempo_conclusao,     // ← agora com valor garantido
    valor,
  };

  console.log("Payload enviado:", payload); // ← Adicione isso para debugar

  try {
    let res;
    if (editingService) {
      res = await api.put(`/api/services/${editingService.id}`, payload);
      setServices(services.map(s => 
        s.id === editingService.id ? res.data : s
      ));
    } else {
      res = await api.post('/api/services', payload);
      setServices([...services, res.data]);
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setSaveSuccess(false);
    }, 1500);
  } catch (err: any) {
    console.error("Erro completo:", err);
    const msg = err.response?.data?.message || "Erro ao salvar serviço. Verifique os campos.";
    console.log(payload);
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
        <p className="text-slate-500 text-sm">
          Gerencie os serviços que sua IA oferecerá aos clientes.
        </p>
        <button
          onClick={openAddModal}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg transition-all"
        >
          <Plus size={20} /> Novo Serviço
        </button>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-block p-8 bg-slate-50 rounded-3xl">
            <Briefcase className="text-slate-300 mx-auto mb-4" size={64} />
            <p className="text-slate-500 text-lg">
              Nenhum serviço cadastrado ainda.
            </p>
            <p className="text-slate-400 text-sm mt-2">
              Adicione seu primeiro serviço para começar!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-white border border-slate-100 text-indigo-600 rounded-2xl shadow-sm">
                    <Briefcase size={20} /> 
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(service)}
                      className="p-2 text-slate-400 hover:text-indigo-600 transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                  {service.descricao}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Clock size={16} /> {service.tempo_conclusao} minutos
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-xl">
                    <DollarSign size={20} />
                    R$ {(service.valor ?? 0).toFixed(2).replace(".", ",")}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => !loading && setIsModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-bold mb-8 text-center">
              {editingService ? "Editar Serviço" : "Novo Serviço"}
            </h3>
            <form onSubmit={handleSave} className="space-y-6">
              <input
                type="text"
                required
                name="descricao"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Corte Masculino"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none text-base"
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  name="tempo_conclusao"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                  <option value={45}>45 min</option>
                  <option value={60}>60 min</option>
                  <option value={90}>90 min</option>
                  <option value={120}>120 min</option>
                </select>
                <input
                  type="number"
                  name="valor"
                  required
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0,00"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !name || !price}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : saveSuccess ? (
                  <>
                    <CheckCircle2 size={20} /> Salvo com sucesso!
                  </>
                ) : (
                  <>
                    <Save size={20} />{" "}
                    {editingService ? "Atualizar" : "Criar Serviço"}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
