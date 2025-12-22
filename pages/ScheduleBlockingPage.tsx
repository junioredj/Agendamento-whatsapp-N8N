
import React from 'react';
import { 
  Clock, 
  CalendarX, 
  Plus, 
  Trash2, 
  Calendar as CalendarIcon,
  Save,
  CheckCircle2,
  Loader2,
  Info
} from 'lucide-react';
import { api } from '../services/api';

interface BusinessHour {
  day: string;
  enabled: boolean;
  start: string;
  end: string;
}

interface BlockedEvent {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  isFullDay: boolean;
}

const ScheduleBlockingPage: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  
  const [hours, setHours] = React.useState<BusinessHour[]>([]);
  const [blockedEvents, setBlockedEvents] = React.useState<BlockedEvent[]>([]);

  // Form State para novo bloqueio
  const [newBlock, setNewBlock] = React.useState({
    date: '', startTime: '09:00', endTime: '10:00', reason: '', isFullDay: false
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hoursRes, blocksRes] = await Promise.all([
        api.get('/schedule/hours'),
        api.get('/schedule/blocks')
      ]);
      setHours(hoursRes.data);
      setBlockedEvents(blocksRes.data);
    } catch (err) {
      console.error("Erro ao buscar horários:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleToggleDay = (index: number) => {
    const newHours = [...hours];
    newHours[index].enabled = !newHours[index].enabled;
    setHours(newHours);
  };

  const handleSaveHours = async () => {
    setIsSaving(true);
    try {
      await api.post('/schedule/hours', { hours });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert("Erro ao salvar horários.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddBlock = async () => {
    if (!newBlock.date) return alert("Selecione uma data.");
    try {
      const res = await api.post('/schedule/blocks', newBlock);
      setBlockedEvents([res.data, ...blockedEvents]);
      setNewBlock({ date: '', startTime: '09:00', endTime: '10:00', reason: '', isFullDay: false });
    } catch (err) {
      alert("Erro ao adicionar bloqueio.");
    }
  };

  const removeBlock = async (id: string) => {
    try {
      await api.delete(`/schedule/blocks/${id}`);
      setBlockedEvents(blockedEvents.filter(b => b.id !== id));
    } catch (err) {
      alert("Erro ao excluir bloqueio.");
    }
  };

  if (loading) {
    return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;
  }

  return (
    <div className="max-w-6xl space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
              <Clock className="text-indigo-600" /> Horário de Funcionamento
            </h2>
            <div className="space-y-4">
              {hours.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleToggleDay(idx)}
                      className={`w-12 h-6 rounded-full relative transition-colors ${item.enabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${item.enabled ? 'left-7' : 'left-1'}`}></div>
                    </button>
                    <span className="font-bold text-slate-700 w-32">{item.day}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="time" disabled={!item.enabled} value={item.start} onChange={(e) => {
                      const nh = [...hours]; nh[idx].start = e.target.value; setHours(nh);
                    }} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none" />
                    <span className="text-slate-400 text-xs">até</span>
                    <input type="time" disabled={!item.enabled} value={item.end} onChange={(e) => {
                      const nh = [...hours]; nh[idx].end = e.target.value; setHours(nh);
                    }} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <button onClick={handleSaveHours} disabled={isSaving} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg">
                {isSaving ? <Loader2 className="animate-spin" /> : saveSuccess ? <CheckCircle2 size={18} /> : <Save size={18} />} Salvar Horários
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-3"><CalendarX className="text-red-500" /> Bloqueios Pontuais</h2>
            <div className="space-y-4">
              <input type="date" value={newBlock.date} onChange={(e) => setNewBlock({...newBlock, date: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" />
              <input type="text" placeholder="Motivo" value={newBlock.reason} onChange={(e) => setNewBlock({...newBlock, reason: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" />
              <button onClick={handleAddBlock} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                <Plus size={18} /> Adicionar Bloqueio
              </button>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="font-bold mb-6">Bloqueios Ativos</h3>
            <div className="space-y-4">
              {blockedEvents.map(block => (
                <div key={block.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold">{block.reason || 'Bloqueio'}</p>
                    <p className="text-xs text-slate-500">{new Date(block.date).toLocaleDateString()} • {block.startTime}</p>
                  </div>
                  <button onClick={() => removeBlock(block.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ScheduleBlockingPage;
