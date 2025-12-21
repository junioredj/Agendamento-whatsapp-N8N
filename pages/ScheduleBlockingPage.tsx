
import React from 'react';
import { 
  Clock, 
  CalendarX, 
  Plus, 
  Trash2, 
  Info, 
  Calendar as CalendarIcon,
  ShieldAlert,
  Save,
  CheckCircle2
} from 'lucide-react';

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
  isRecurring?: boolean;
}

const ScheduleBlockingPage: React.FC = () => {
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  
  const [hours, setHours] = React.useState<BusinessHour[]>([
    { day: 'Segunda-feira', enabled: true, start: '08:00', end: '20:00' },
    { day: 'Terça-feira', enabled: true, start: '08:00', end: '20:00' },
    { day: 'Quarta-feira', enabled: true, start: '08:00', end: '20:00' },
    { day: 'Quinta-feira', enabled: true, start: '08:00', end: '20:00' },
    { day: 'Sexta-feira', enabled: true, start: '08:00', end: '20:00' },
    { day: 'Sábado', enabled: true, start: '09:00', end: '16:00' },
    { day: 'Domingo', enabled: false, start: '00:00', end: '00:00' },
  ]);

  const [blockedEvents, setBlockedEvents] = React.useState<BlockedEvent[]>([
    { id: '1', date: '2024-12-25', startTime: '00:00', endTime: '23:59', reason: 'Natal', isFullDay: true },
    { id: '2', date: '2024-12-21', startTime: '12:00', endTime: '13:30', reason: 'Almoço da Equipe', isFullDay: false },
  ]);

  // Form State
  const [newBlockDate, setNewBlockDate] = React.useState('');
  const [newBlockStart, setNewBlockStart] = React.useState('09:00');
  const [newBlockEnd, setNewBlockEnd] = React.useState('10:00');
  const [newBlockReason, setNewBlockReason] = React.useState('');
  const [isFullDay, setIsFullDay] = React.useState(false);
  const [replicateAllDays, setReplicateAllDays] = React.useState(false);

  const dateInputRef = React.useRef<HTMLInputElement>(null);

  const handleToggleDay = (index: number) => {
    const newHours = [...hours];
    newHours[index].enabled = !newHours[index].enabled;
    setHours(newHours);
  };

  const handleTimeChange = (index: number, field: 'start' | 'end', value: string) => {
    const newHours = [...hours];
    newHours[index][field] = value;
    setHours(newHours);
  };

  const handleSaveHours = () => {
    setIsSaving(true);
    setSaveSuccess(false);

    // Simula salvamento via API
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Resetar estado de sucesso após 3 segundos
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1500);
  };

  const removeBlock = (id: string) => {
    setBlockedEvents(blockedEvents.filter(b => b.id !== id));
  };

  const handleAddBlock = () => {
    if (!newBlockDate && !replicateAllDays) {
      alert("Por favor, selecione uma data ou marque para replicar todos os dias.");
      return;
    }

    const newBlock: BlockedEvent = {
      id: Math.random().toString(36).substr(2, 9),
      date: newBlockDate || 'Recorrente',
      startTime: isFullDay ? '00:00' : newBlockStart,
      endTime: isFullDay ? '23:59' : newBlockEnd,
      reason: newBlockReason || 'Bloqueio sem nome',
      isFullDay: isFullDay,
      isRecurring: replicateAllDays
    };

    setBlockedEvents([newBlock, ...blockedEvents]);
    
    // Reset form
    setNewBlockDate('');
    setNewBlockReason('');
    setIsFullDay(false);
    setReplicateAllDays(false);
  };

  const triggerPicker = (e: React.MouseEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
    try {
      (e.target as any).showPicker();
    } catch (err) {
      console.warn("showPicker is not supported in this browser.");
    }
  };

  return (
    <div className="max-w-6xl space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Working Hours */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Clock size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Horário de Funcionamento</h2>
                <p className="text-sm text-slate-500">Defina os horários em que seu estabelecimento está aberto.</p>
              </div>
            </div>

            <div className="space-y-4">
              {hours.map((item, idx) => (
                <div key={idx} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${item.enabled ? 'border-slate-100 bg-slate-50/50' : 'border-slate-100 bg-slate-50 opacity-50'}`}>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleToggleDay(idx)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${item.enabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${item.enabled ? 'left-7' : 'left-1'}`}></div>
                    </button>
                    <span className="font-bold text-slate-700 w-32">{item.day}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <input 
                      type="time" 
                      disabled={!item.enabled}
                      value={item.start}
                      onChange={(e) => handleTimeChange(idx, 'start', e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    />
                    <span className="text-slate-400">até</span>
                    <input 
                      type="time" 
                      disabled={!item.enabled}
                      value={item.end}
                      onChange={(e) => handleTimeChange(idx, 'end', e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                onClick={handleSaveHours}
                disabled={isSaving || saveSuccess}
                className={`min-w-[200px] px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                  saveSuccess 
                    ? 'bg-emerald-600 text-white shadow-emerald-200' 
                    : isSaving 
                    ? 'bg-indigo-400 text-white cursor-wait'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                }`}
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Salvando...
                  </>
                ) : saveSuccess ? (
                  <>
                    <CheckCircle2 size={18} />
                    Horários Salvos!
                  </>
                ) : (
                  <>
                    <Save size={18} /> 
                    Salvar Horários
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-indigo-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <ShieldAlert size={160} />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Dica de Produtividade</h3>
              <p className="text-indigo-200 text-sm max-w-md leading-relaxed">
                Você sabia? Bloquear horários de almoço fixos ajuda a IA a sugerir horários mais realistas para seus clientes, evitando que você precise reagendar manualmente depois.
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: Specific Blocks */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                <CalendarX size={24} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Bloqueios Pontuais</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Data</label>
                <div className="relative">
                  <CalendarIcon 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" 
                    size={16} 
                  />
                  <input 
                    ref={dateInputRef}
                    type="date" 
                    disabled={replicateAllDays}
                    value={newBlockDate}
                    onChange={(e) => setNewBlockDate(e.target.value)}
                    onClick={triggerPicker}
                    onFocus={triggerPicker}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50 cursor-pointer appearance-none block" 
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <input 
                  type="checkbox" 
                  id="replicateDays"
                  checked={replicateAllDays}
                  onChange={(e) => setReplicateAllDays(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="replicateDays" className="text-sm font-medium text-slate-600 cursor-pointer">Replicar para todos os dias</label>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <input 
                  type="checkbox" 
                  id="fullDay"
                  checked={isFullDay}
                  onChange={(e) => setIsFullDay(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="fullDay" className="text-sm font-medium text-slate-600 cursor-pointer">Dia inteiro</label>
              </div>

              {!isFullDay && (
                <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Início</label>
                    <input 
                      type="time" 
                      value={newBlockStart}
                      onChange={(e) => setNewBlockStart(e.target.value)}
                      onClick={triggerPicker}
                      onFocus={triggerPicker}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Fim</label>
                    <input 
                      type="time" 
                      value={newBlockEnd}
                      onChange={(e) => setNewBlockEnd(e.target.value)}
                      onClick={triggerPicker}
                      onFocus={triggerPicker}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer" 
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Motivo (Opcional)</label>
                <input 
                  type="text" 
                  placeholder="Ex: Feriado municipal" 
                  value={newBlockReason}
                  onChange={(e) => setNewBlockReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>

              <button 
                onClick={handleAddBlock}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all mt-4 active:scale-95 shadow-lg shadow-slate-200"
              >
                <Plus size={18} /> Adicionar Bloqueio
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">Bloqueios Ativos</h3>
            
            <div className="space-y-4">
              {blockedEvents.length === 0 ? (
                <div className="text-center py-8">
                  <Info className="mx-auto text-slate-200 mb-2" size={32} />
                  <p className="text-slate-400 text-xs font-medium">Nenhum bloqueio futuro configurado.</p>
                </div>
              ) : (
                blockedEvents.map(block => (
                  <div key={block.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group animate-in slide-in-from-right-4 fade-in duration-300">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        {block.isRecurring ? (
                          <div className="mt-1 p-1 bg-indigo-100 text-indigo-600 rounded">
                            <Clock size={12} />
                          </div>
                        ) : (
                          <div className="mt-1 p-1 bg-red-100 text-red-600 rounded">
                            <CalendarIcon size={12} />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-bold text-slate-800">{block.reason}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {block.isRecurring ? 'Todos os dias' : (block.date === 'Recorrente' ? 'Todos os dias' : new Date(block.date).toLocaleDateString('pt-BR'))} • {block.isFullDay ? 'Dia inteiro' : `${block.startTime} às ${block.endTime}`}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeBlock(block.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ScheduleBlockingPage;
