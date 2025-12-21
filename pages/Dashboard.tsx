
import React from 'react';
import { 
  TrendingUp, 
  Calendar as CalendarIcon, 
  ChevronRight,
  ChevronUp,
  Clock,
  MoreVertical,
  Info
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

const data = [
  { name: 'Seg', valor: 400 },
  { name: 'Ter', valor: 300 },
  { name: 'Qua', valor: 600 },
  { name: 'Qui', valor: 800 },
  { name: 'Sex', valor: 1200 },
  { name: 'Sab', valor: 1500 },
  { name: 'Dom', valor: 200 },
];

const appointmentsToday = [
  { id: 1, time: "09:00", customer: "João Silva", service: "Corte + Barba", value: "R$ 70" },
  { id: 2, time: "10:00", customer: "Pedro Santos", service: "Corte", value: "R$ 50" },
  { id: 3, time: "11:30", customer: "Carlos Oliveira", service: "Corte + Barba", value: "R$ 70" },
  { id: 4, time: "14:00", customer: "Lucas Ferreira", service: "Barba", value: "R$ 35" },
  { id: 5, time: "15:00", customer: "André Costa", service: "Corte", value: "R$ 50" },
  { id: 6, time: "16:00", customer: "Rafael Lima", service: "Corte + Barba", value: "R$ 70" },
  { id: 7, time: "16:45", customer: "Gustavo Souza", service: "Corte", value: "R$ 50" },
  { id: 8, time: "17:30", customer: "Marcos Reus", service: "Corte + Sobrancelha", value: "R$ 60" },
  { id: 9, time: "18:15", customer: "Felipe Melo", service: "Barba", value: "R$ 35" },
  { id: 10, time: "19:00", customer: "Bruno Alves", service: "Corte", value: "R$ 50" },
  { id: 11, time: "19:45", customer: "Tiago Silva", service: "Corte + Barba", value: "R$ 70" },
  { id: 12, time: "20:30", customer: "Diego Costa", service: "Corte", value: "R$ 50" },
];

const Dashboard: React.FC = () => {
  const [showAll, setShowAll] = React.useState(false);

  const getMinutes = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const isTimePast = (timeStr: string) => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    return getMinutes(timeStr) < currentMinutes;
  };

  // Lógica de ordenação inteligente solicitada
  const sortedAppointments = React.useMemo(() => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const future = appointmentsToday
      .filter(a => getMinutes(a.time) >= currentMinutes)
      .sort((a, b) => getMinutes(a.time) - getMinutes(b.time));

    const past = appointmentsToday
      .filter(a => getMinutes(a.time) < currentMinutes)
      .sort((a, b) => getMinutes(a.time) - getMinutes(b.time));

    return [...future, ...past];
  }, []);

  const displayedAppointments = showAll ? sortedAppointments : sortedAppointments.slice(0, 5);

  const stats = [
    { 
      title: "Agendamentos Hoje", 
      count: 12, 
      revenue: "R$ 480,00", 
      change: "+20%", 
      color: "indigo", 
      icon: <CalendarIcon size={24} />,
      hasEstimatedTooltip: true
    },
    { 
      title: "Agendamentos Amanhã", 
      count: 8, 
      revenue: "R$ 320,00", 
      change: "-5%", 
      color: "violet", 
      icon: <Clock size={24} />,
      hasEstimatedTooltip: true
    },
    { 
      title: "Faturamento Mensal", 
      count: "R$ 12.450", 
      revenue: "Meta: R$ 15.000", 
      change: "+12%", 
      color: "emerald", 
      icon: <TrendingUp size={24} />,
      hasEstimatedTooltip: false
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group/card">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                stat.change.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.title}</h3>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-slate-800">{stat.count}</p>
                
                <div className="flex items-center gap-1.5 mt-1">
                  <p className="text-sm font-bold text-slate-400">
                    {stat.hasEstimatedTooltip && <span className="mr-1">Total estimado:</span>}
                    {stat.revenue}
                  </p>
                  
                  {stat.hasEstimatedTooltip && (
                    <div className="group relative inline-block">
                      <Info size={14} className="text-slate-300 cursor-help hover:text-indigo-500 transition-colors" />
                      
                      {/* Tooltip Content */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-slate-800 text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 text-center shadow-xl leading-relaxed border border-slate-700">
                        Orçamento estimado com base nos agendamentos cadastrados.
                        {/* Tooltip Arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        {/* Agendamentos de Hoje List Section */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm transition-all duration-300">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-800">Agendamentos de Hoje</h2>
              <div className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Ordenado por prioridade
              </div>
            </div>
            <p className="text-sm text-slate-400 font-medium lowercase">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' })}
            </p>
          </div>
          
          <div className="space-y-3">
            {displayedAppointments.map((item, index) => {
              const past = isTimePast(item.time);
              const isNext = !past && (index === 0 || isTimePast(displayedAppointments[index-1]?.time));

              return (
                <div 
                  key={item.id} 
                  className={`flex items-center justify-between p-4 transition-all group cursor-pointer rounded-2xl animate-in fade-in slide-in-from-top-2
                    ${past 
                      ? 'bg-slate-50/30 opacity-60 grayscale-[0.5]' 
                      : isNext 
                        ? 'bg-indigo-50/40 ring-1 ring-indigo-100 shadow-sm' 
                        : 'bg-slate-50/50 hover:bg-indigo-50/30'
                    }`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`relative px-4 py-2 rounded-xl text-sm font-bold min-w-[70px] text-center transition-colors
                      ${past 
                        ? 'bg-slate-200 text-slate-500' 
                        : 'bg-indigo-50 text-indigo-600'
                      }`}
                    >
                      {item.time}
                      {isNext && (
                        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white animate-pulse"></div>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`text-base font-bold leading-none transition-colors
                          ${past ? 'text-slate-500' : 'text-slate-800'}
                        `}>
                          {item.customer}
                        </h4>
                        {isNext && (
                          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter bg-indigo-100 px-1.5 rounded">Próximo</span>
                        )}
                      </div>
                      <p className={`text-xs font-medium mt-1 transition-colors
                        ${past ? 'text-slate-400' : 'text-slate-500'}
                      `}>
                        {item.service}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <p className={`font-bold text-base transition-colors
                      ${past ? 'text-slate-400' : 'text-emerald-500'}
                    `}>
                      {item.value}
                    </p>
                    <button className="p-2 text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-center border-t border-slate-50 pt-6">
            <button 
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50/50 px-6 py-2 rounded-full hover:bg-indigo-100"
            >
              {showAll ? (
                <>Recolher horários <ChevronUp size={16} /></>
              ) : (
                <>Ver todos os horários <ChevronRight size={16} /></>
              )}
            </button>
          </div>
        </div>

        {/* Faturamento Chart */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Faturamento Semanal</h2>
              <p className="text-sm text-slate-500">Estimativa baseada em agendamentos confirmados</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <RechartsTooltip 
                   contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="valor" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
