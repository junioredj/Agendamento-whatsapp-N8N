import React from "react";
import {
  Clock,
  CalendarX,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { api } from "../services/api";

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

const ScheduleBlockingPage: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [savingHours, setSavingHours] = React.useState(false);
  const [saveHoursSuccess, setSaveHoursSuccess] = React.useState(false);

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
  });

  // Carregar dados do backend
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/get-horarios-agenda");

      const data = response.data;

      // === Business Hours ===
      let businessHoursData: DayHour[] = [];
      if (data.business_hours) {
        if (typeof data.business_hours === "string") {
          businessHoursData = JSON.parse(data.business_hours);
        } else {
          businessHoursData = data.business_hours;
        }
      }

      const loadedHours = DAYS_OF_WEEK.map((d) => {
        const saved = businessHoursData.find((h: any) => h.day === d.key);
        return saved || { day: d.key, enabled: false, start: "09:00", end: "18:00" };
      });
      setBusinessHours(loadedHours);

      // === Blocked Dates ===
      let loadedBlocks: BlockedDate[] = [];
      if (data.blocked_dates) {
        if (typeof data.blocked_dates === "string") {
          loadedBlocks = JSON.parse(data.blocked_dates);
        } else if (Array.isArray(data.blocked_dates)) {
          loadedBlocks = data.blocked_dates;
        }
      }
      setBlockedDates(loadedBlocks);
    } catch (err) {
      console.error("Erro ao carregar configurações:", err);
      alert("Não foi possível carregar as configurações da agenda.");
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

  // Salvar apenas horários de funcionamento
  const saveBusinessHours = async () => {
    setSavingHours(true);
    try {
      await api.post("/salvar-horario-bloqueio-pontual", {
        business_hours: businessHours,
      });
      setSaveHoursSuccess(true);
      setTimeout(() => setSaveHoursSuccess(false), 3000);
    } catch (err) {
      alert("Erro ao salvar horários de funcionamento.");
    } finally {
      setSavingHours(false);
    }
  };

  // Adicionar novo bloqueio pontual
  const addBlockedDate = async () => {
    if (!newBlock.date) {
      alert("Selecione uma data para o bloqueio.");
      return;
    }

    const payload = {
      date: newBlock.date,
      reason: newBlock.reason,
      full_day: newBlock.full_day,
      start_time: newBlock.full_day ? null : newBlock.start_time,
      end_time: newBlock.full_day ? null : newBlock.end_time,
    };

    try {
      const res = await api.post("/salvar-horario-bloqueio-pontual", {
        blocked_date: payload, // Envia como objeto único
      });

      // Atualiza a lista local com o novo bloqueio retornado
      setBlockedDates([res.data, ...blockedDates]);

      // Limpa o formulário
      setNewBlock({
        date: "",
        start_time: "09:00",
        end_time: "10:00",
        reason: "",
        full_day: false,
      });
    } catch (err: any) {
      console.error("Erro ao adicionar bloqueio:", err);
      alert(err.response?.data?.message || "Erro ao adicionar bloqueio.");
    }
  };

  // Remover bloqueio pontual
  const removeBlockedDate = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este bloqueio?")) return;

    try {
      await api.post("/salvar-horario-bloqueio-pontual", {
        delete_blocked_date_id: id,
      });

      setBlockedDates(blockedDates.filter((b) => b.id !== id));
    } catch (err) {
      alert("Erro ao remover bloqueio.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4">
      {/* Horário de Funcionamento */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Clock className="text-indigo-600" size={28} />
            Horário de Funcionamento
          </h2>
          <button
            onClick={saveBusinessHours}
            disabled={savingHours}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md"
          >
            {savingHours ? (
              <Loader2 className="animate-spin" size={18} />
            ) : saveHoursSuccess ? (
              <CheckCircle2 size={18} />
            ) : (
              <Save size={18} />
            )}
            {saveHoursSuccess ? "Salvo!" : "Salvar Horários"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {businessHours.map((day, index) => (
            <div
              key={day.day}
              className={`p-5 rounded-2xl border transition-all ${
                day.enabled ? "bg-indigo-50 border-indigo-200" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleDay(index)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      day.enabled ? "bg-indigo-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        day.enabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="font-semibold text-slate-800">
                    {DAYS_OF_WEEK.find((d) => d.key === day.day)?.label}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="time"
                  value={day.start}
                  onChange={(e) => updateHour(index, "start", e.target.value)}
                  disabled={!day.enabled}
                  className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50"
                />
                <span className="text-slate-500">até</span>
                <input
                  type="time"
                  value={day.end}
                  onChange={(e) => updateHour(index, "end", e.target.value)}
                  disabled={!day.enabled}
                  className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bloqueios Pontuais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <CalendarX className="text-red-600" size={28} />
              Bloqueios Pontuais
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Data do bloqueio
                </label>
                <input
                  type="date"
                  value={newBlock.date}
                  onChange={(e) => setNewBlock({ ...newBlock, date: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Motivo (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Feriado, viagem, manutenção..."
                  value={newBlock.reason}
                  onChange={(e) => setNewBlock({ ...newBlock, reason: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="fullDay"
                  checked={newBlock.full_day}
                  onChange={(e) => setNewBlock({ ...newBlock, full_day: e.target.checked })}
                  className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                />
                <label htmlFor="fullDay" className="text-sm font-medium">
                  Bloqueio o dia inteiro
                </label>
              </div>

              {!newBlock.full_day && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Das
                    </label>
                    <input
                      type="time"
                      value={newBlock.start_time}
                      onChange={(e) => setNewBlock({ ...newBlock, start_time: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Até
                    </label>
                    <input
                      type="time"
                      value={newBlock.end_time}
                      onChange={(e) => setNewBlock({ ...newBlock, end_time: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                </>
              )}
            </div>

            <button
              onClick={addBlockedDate}
              className="w-full md:w-auto px-8 py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-lg"
            >
              <Plus size={20} /> Adicionar Bloqueio
            </button>
          </div>
        </div>

        {/* Lista de bloqueios ativos */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg">
          <h3 className="text-xl font-bold mb-6">Bloqueios Ativos</h3>
          {blockedDates.length === 0 ? (
            <p className="text-slate-500 text-center py-8">
              Nenhum bloqueio cadastrado.
            </p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {blockedDates.map((block) => (
                <div
                  key={block.id}
                  className="p-4 rounded-2xl bg-red-50 border border-red-200 flex justify-between items-start"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-red-800">
                      {block.reason || "Bloqueio sem motivo"}
                    </p>
                    <p className="text-sm text-red-600 mt-1">
                      {new Date(block.date).toLocaleDateString("pt-BR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    {!block.full_day && block.start_time && block.end_time && (
                      <p className="text-xs text-red-700 mt-1">
                        {block.start_time} até {block.end_time}
                      </p>
                    )}
                    {block.full_day && (
                      <p className="text-xs text-red-700 mt-1">Dia inteiro</p>
                    )}
                  </div>
                  <button
                    onClick={() => block.id && removeBlockedDate(block.id)}
                    className="text-red-500 hover:text-red-700 ml-4"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleBlockingPage;