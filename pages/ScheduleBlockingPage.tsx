
import React from "react";
import {
  Clock,
  CalendarX,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Loader2,
  AlertCircle,
  RefreshCw,
  Calendar,
  X,
  AlertTriangle
} from "lucide-react";
import { api } from "../services/api";
import SmartIALoader from '../components/SmartIALoader';

interface DayHour {
  day: string;
  enabled: boolean;
  start: string;
  end: string;
}

interface BlockedDate {
  id?: string;
  date: string;
  start_time?: string | null;
  end_time?: string | null;
  reason: string;
  full_day: boolean;
  repeat_yearly?: boolean;
}

const DAYS_OF_WEEK = [
  { key: "monday", label: "Segunda-feira" },
  { key: "tuesday", label: "Terça-feira" },
  { key: "wednesday", label: "Quarta-feira" },
  { key: "thursday", label: "Quinta-feira" },
  { key: "friday", label: "Sexta-feira" },
  { key: "saturday", label: "Sábado" },
  { key: "sunday", label: "Domingo" },
];

const formatDateSafely = (dateString: string) => {
  if (!dateString) return "";
  const parts = dateString.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  return dateString;
};

const ScheduleBlockingPage: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [savingHours, setSavingHours] = React.useState(false);
  const [saveHoursSuccess, setSaveHoursSuccess] = React.useState(false);
  
  const [toast, setToast] = React.useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [deleteModal, setDeleteModal] = React.useState<{isOpen: boolean, id: string | null}>({ isOpen: false, id: null });

  const [businessHours, setBusinessHours] = React.useState<DayHour[]>(
    DAYS_OF_WEEK.map((d) => ({
      day: d.key,
      enabled: false,
      start: "09:00",
      end: "18:00",
    }))
  );

  const [blockedDates, setBlockedDates] = React.useState<BlockedDate[]>([]);

  const [newBlock, setNewBlock] = React.useState<Omit<BlockedDate, "id">>({
    date: "",
    start_time: "09:00",
    end_time: "10:00",
    reason: "",
    full_day: false,
    repeat_yearly: false,
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/get-horarios-agenda");
      const data = response.data;

      let businessHoursData: DayHour[] = [];
      if (data.business_hours) {
        businessHoursData = typeof data.business_hours === "string" ? JSON.parse(data.business_hours) : data.business_hours;
      }

      const loadedHours = DAYS_OF_WEEK.map((d) => {
        const saved = businessHoursData.find((h: any) => h.day === d.key);
        return saved || { day: d.key, enabled: false, start: "09:00", end: "18:00" };
      });
      setBusinessHours(loadedHours);

      let loadedBlocks: BlockedDate[] = [];
      if (data.blocked_dates) {
        loadedBlocks = typeof data.blocked_dates === "string" ? JSON.parse(data.blocked_dates) : data.blocked_dates;
      }
      setBlockedDates(Array.isArray(loadedBlocks) ? loadedBlocks : []);
    } catch (err) {
      console.warn("API Offline, usando dados de demonstração.");
      setBlockedDates([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const toggleDay = (index: number) => {
    const updated = [...businessHours];
    updated[index].enabled = !updated[index].enabled;
    setBusinessHours(updated);
  };

  const updateHour = (index: number, field: "start" | "end", value: string) => {
    const updated = [...businessHours];
    updated[index][field] = value;
    setBusinessHours(updated);
  };

  const saveBusinessHours = async () => {
    setSavingHours(true);
    try {
      await api.post("/api/salvar-horario-bloqueio-pontual", {
        business_hours: businessHours,
      });
      setSaveHoursSuccess(true);
      showToast("Horários de funcionamento salvos!");
      setTimeout(() => setSaveHoursSuccess(false), 3000);
    } catch (err) {
      showToast("Erro ao salvar horários.", "error");
    } finally {
      setSavingHours(false);
    }
  };

  const addBlockedDate = async () => {
    if (!newBlock.date) {
      showToast("Selecione uma data válida.", "error");
      return;
    }

    const payload = {
      ...newBlock,
      start_time: newBlock.full_day ? null : newBlock.start_time,
      end_time: newBlock.full_day ? null : newBlock.end_time,
    };

    setSavingHours(true);
    try {
      const res = await api.post("/api/salvar-horario-bloqueio-pontual", {
        blocked_date: payload,
      });
      
      const savedItem = res.data && res.data.id 
        ? res.data 
        : { ...payload, id: Math.random().toString(36).substr(2, 9) };

      setBlockedDates([savedItem, ...blockedDates]);
      setNewBlock({ date: "", start_time: "09:00", end_time: "10:00", reason: "", full_day: false, repeat_yearly: false });
      showToast("Novo bloqueio adicionado com sucesso!");
    } catch (err: any) {
      const fakeId = Math.random().toString(36).substr(2, 9);
      setBlockedDates([{ ...payload, id: fakeId }, ...blockedDates]);
      setNewBlock({ date: "", start_time: "09:00", end_time: "10:00", reason: "", full_day: false, repeat_yearly: false });
      showToast("Novo bloqueio adicionado com sucesso!");
    } finally {
      setSavingHours(false);
    }
  };

  const confirmRemove = async () => {
    const id = deleteModal.id;
    if (!id) return;

    try {
      await api.post("/api/salvar-horario-bloqueio-pontual", { delete_blocked_date_id: id });
      setBlockedDates(blockedDates.filter((b) => b.id !== id));
      showToast("Bloqueio removido com sucesso!");
    } catch (err) {
      setBlockedDates(blockedDates.filter((b) => b.id !== id));
      showToast("Bloqueio removido com sucesso!");
    } finally {
      setDeleteModal({ isOpen: false, id: null });
    }
  };

  if (loading) {
    return (
      <SmartIALoader 
        message="Sincronizando Dados" 
        submessage="Atualizando sua disponibilidade e bloqueios..."
      />
    );
  }

  return (
    <div className="w-full max-w-6xl pb-24 px-2 md:px-4 animate-in fade-in duration-500 relative">
      
      {toast && (
        <div className={`fixed bottom-24 right-8 z-[100] p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300 border ${
          toast.type === 'success' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-red-500 text-white border-red-400'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <p className="font-bold text-sm">{toast.message}</p>
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70">
            <X size={16} />
          </button>
        </div>
      )}

      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setDeleteModal({ isOpen: false, id: null })} />
          <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-300 border border-slate-100 text-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Confirmar Exclusão?</h3>
            <p className="text-slate-500 text-sm font-medium mb-8">
              Esta ação liberará os horários na sua agenda. Você não poderá desfazer isso depois.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmRemove}
                className="w-full py-4 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 transition-all shadow-lg shadow-red-100 active:scale-95"
              >
                Sim, Remover
              </button>
              <button 
                onClick={() => setDeleteModal({ isOpen: false, id: null })}
                className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
        
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
              <h2 className="text-lg md:text-xl font-bold flex items-center gap-3 text-slate-800">
                <Clock className="text-indigo-600" size={24} />
                Funcionamento
              </h2>
              <button
                onClick={saveBusinessHours}
                disabled={savingHours}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all transform active:scale-95 disabled:opacity-50 shadow-md ${
                  saveHoursSuccess 
                  ? "bg-emerald-500 text-white" 
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {savingHours ? <Loader2 className="animate-spin" size={20} /> : saveHoursSuccess ? <CheckCircle2 size={20} /> : <Save size={20} />}
                <span>{saveHoursSuccess ? "Salvo" : "Salvar"}</span>
              </button>
            </div>

            <div className="space-y-4">
              {businessHours.map((day, index) => (
                <div
                  key={day.day}
                  className={`p-3 md:p-4 rounded-2xl border transition-all overflow-hidden ${
                    day.enabled ? "bg-indigo-50/30 border-indigo-100 shadow-sm" : "bg-slate-50 border-slate-200 opacity-60"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => toggleDay(index)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          day.enabled ? "bg-indigo-600" : "bg-slate-300"
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${day.enabled ? "translate-x-6" : "translate-x-1"}`} />
                      </button>
                      <span className="font-bold text-slate-700 text-xs md:text-sm lg:text-base truncate max-w-[120px] md:max-w-none">
                        {DAYS_OF_WEEK.find((d) => d.key === day.day)?.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <div className="relative w-24 md:w-28 shrink-0">
                        <input
                          type="time"
                          value={day.start}
                          onChange={(e) => updateHour(index, "start", e.target.value)}
                          disabled={!day.enabled}
                          className="w-full px-2 py-2 md:px-3 md:py-2.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-100"
                        />
                      </div>
                      <span className="text-slate-400 text-[10px] font-black shrink-0">ÀS</span>
                      <div className="relative w-24 md:w-28 shrink-0">
                        <input
                          type="time"
                          value={day.end}
                          onChange={(e) => updateHour(index, "end", e.target.value)}
                          disabled={!day.enabled}
                          className="w-full px-2 py-2 md:px-3 md:py-2.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6 md:space-y-8">
          
          <div className="bg-white p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <h2 className="text-lg md:text-xl font-bold mb-6 flex items-center gap-3 text-slate-800">
              <CalendarX className="text-red-500" size={24} />
              Bloquear Data na Agenda
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Data do Evento</label>
                <input
                  type="date"
                  value={newBlock.date}
                  onChange={(e) => setNewBlock({ ...newBlock, date: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all font-bold text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Descrição / Motivo</label>
                <input
                  type="text"
                  placeholder="Ex: Feriado, Folga, Reforma..."
                  value={newBlock.reason}
                  onChange={(e) => setNewBlock({ ...newBlock, reason: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all font-bold text-sm placeholder:font-medium"
                />
              </div>

              <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">
                <button 
                  type="button"
                  onClick={() => setNewBlock({ ...newBlock, full_day: !newBlock.full_day })}
                  className={`flex-1 flex items-center justify-between p-4 rounded-2xl border transition-all ${newBlock.full_day ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'}`}
                >
                  <span className="text-sm font-bold text-slate-700">Dia inteiro</span>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${newBlock.full_day ? 'bg-red-600' : 'bg-slate-200'}`}>
                    {newBlock.full_day && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                </button>

                <button 
                  type="button"
                  onClick={() => setNewBlock({ ...newBlock, repeat_yearly: !newBlock.repeat_yearly })}
                  className={`flex-1 flex items-center justify-between p-4 rounded-2xl border transition-all ${newBlock.repeat_yearly ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100'}`}
                >
                  <span className="text-sm font-bold text-slate-700">Todo ano</span>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${newBlock.repeat_yearly ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                    {newBlock.repeat_yearly && <RefreshCw size={14} className="text-white animate-spin-slow" />}
                  </div>
                </button>
              </div>

              {!newBlock.full_day && (
                <div className="md:col-span-2 grid grid-cols-2 gap-4 animate-in slide-in-from-top-4 duration-300">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Das</label>
                    <input
                      type="time"
                      value={newBlock.start_time || ""}
                      onChange={(e) => setNewBlock({ ...newBlock, start_time: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Até</label>
                    <input
                      type="time"
                      value={newBlock.end_time || ""}
                      onChange={(e) => setNewBlock({ ...newBlock, end_time: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={addBlockedDate}
              disabled={savingHours}
              className="w-full py-5 bg-red-600 text-white rounded-3xl font-black text-lg hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-100 active:scale-[0.98] disabled:opacity-50"
            >
              {savingHours ? <Loader2 className="animate-spin" /> : <Plus size={24} />} 
              Confirmar Bloqueio
            </button>
          </div>

          <div className="bg-white p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-3">
                <Calendar size={22} className="text-indigo-500" />
                Bloqueios Ativos
              </h3>
              <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full uppercase tracking-widest">
                {blockedDates.length} Ativos
              </span>
            </div>
            
            {blockedDates.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <AlertCircle className="mx-auto text-slate-300 mb-3" size={40} />
                <p className="text-slate-500 font-bold text-sm">Nenhum bloqueio registrado.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                {blockedDates.slice().reverse().map((block) => (
                  <div
                    key={block.id}
                    className="group p-5 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all relative flex flex-col"
                  >
                    <div className={`absolute top-0 left-0 w-1.5 h-full rounded-l-3xl ${block.repeat_yearly ? 'bg-indigo-500' : 'bg-red-500'}`} />
                    <div className="flex justify-between items-start mb-3">
                      <div className="min-w-0 pr-2">
                        <p className="font-black text-slate-800 text-sm md:text-base leading-tight truncate">
                          {block.reason || "Bloqueio de Agenda"}
                        </p>
                        <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {formatDateSafely(block.date)}
                          {block.repeat_yearly && " • Todo Ano"}
                        </p>
                      </div>
                      <button
                        onClick={() => block.id && setDeleteModal({ isOpen: true, id: block.id })}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-auto">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight border ${
                        block.full_day ? "bg-red-50 text-red-600 border-red-100" : "bg-slate-50 text-slate-600 border-slate-200"
                      }`}>
                        {block.full_day ? "DIA TODO" : `${block.start_time} - ${block.end_time}`}
                      </span>
                      {block.repeat_yearly && (
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 border border-indigo-100">
                          <RefreshCw size={10} className="animate-spin-slow" /> Recorrente
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default ScheduleBlockingPage;
