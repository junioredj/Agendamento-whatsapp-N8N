
import React from 'react';
import { 
  TrendingUp, 
  Calendar as CalendarIcon, 
  ChevronRight,
  ChevronUp,
  Clock,
  MoreVertical,
  Info,
  Loader2
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
import { api } from '../services/api';

const Dashboard: React.FC = () => {
  const [showAll, setShowAll] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState<any[]>([]);
  const [appointments, setAppointments] = React.useState<any[]>([]);
  const [chartData, setChartData] = React.useState<any[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, appRes, chartRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/appointments/today'),
        api.get('/dashboard/revenue-chart')
      ]);

      setStats([
        { 
          title: "Agendamentos Hoje", 
          count: statsRes.data.todayCount, 
          revenue: `R$ ${statsRes.data.todayRevenue.toFixed(2)}`, 
          change: statsRes.data.todayChange, 
          color: "indigo", 
          icon: <CalendarIcon size={24} />,
          hasEstimatedTooltip: true
        },
        { 
          title: "Agendamentos Amanhã", 
          count: statsRes.data.tomorrowCount, 
          revenue: `R$ ${statsRes.data.tomorrowRevenue.toFixed(2)}`, 
          change: statsRes.data.tomorrowChange, 
          color: "violet", 
          icon: <Clock size={24} />,
          hasEstimatedTooltip: true
        },
        { 
          title: "Faturamento Mensal", 
          count: `R$ ${statsRes.data.monthlyRevenue.toFixed(0)}`, 
          revenue: `Meta: R$ ${statsRes.data.monthlyGoal.toFixed(0)}`, 
          change: statsRes.data.monthlyChange, 
          color: "emerald", 
          icon: <TrendingUp size={24} />,
          hasEstimatedTooltip: false
        }
      ]);
      setAppointments(appRes.data);
      setChartData(chartRes.data);
    } catch (error) {
      console.warn("API Offline, carregando dados de demonstração...");
      // Dados de fallback para demonstração
      setStats([
        { title: "Agendamentos Hoje", count: 12, revenue: "R$ 450,00", change: "+12%", color: "indigo", icon: <CalendarIcon size={24} />, hasEstimatedTooltip: true },
        { title: "Agendamentos Amanhã", count: 8, revenue: "R$ 320,00", change: "-5%", color: "violet", icon: <Clock size={24} />, hasEstimatedTooltip: true },
        { title: "Faturamento Mensal", count: "R$ 8.420", revenue: "Meta: R$ 10.000", change: "+18%", color: "emerald", icon: <TrendingUp size={24} />, hasEstimatedTooltip: false }
      ]);
      setAppointments([
        { id: '1', time: '09:00', customer: 'Ricardo Alves', service: 'Corte Degradê', value: '45.00' },
        { id: '2', time: '10:30', customer: 'Marcos Oliveira', service: 'Barba e Toalha Quente', value: '35.00' },
        { id: '3', time: '14:00', customer: 'Felipe Santos', service: 'Corte + Barba', value: '70.00' },
        { id: '4', time: '15:30', customer: 'Gustavo Lima', service: 'Corte Tesoura', value: '55.00' },
      ]);
      setChartData([
        { name: 'Seg', valor: 400 }, { name: 'Ter', valor: 600 }, { name: 'Qua', valor: 500 },
        { name: 'Qui', valor: 900 }, { name: 'Sex', valor: 1200 }, { name: 'Sáb', valor: 1500 }, { name: 'Dom', valor: 200 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const getMinutes = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const isTimePast = (timeStr: string) => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    return getMinutes(timeStr) < currentMinutes;
  };

  const sortedAppointments = React.useMemo(() => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const future = appointments
      .filter(a => getMinutes(a.time) >= currentMinutes)
      .sort((a, b) => getMinutes(a.time) - getMinutes(b.time));

    const past = appointments
      .filter(a => getMinutes(a.time) < currentMinutes)
      .sort((a, b) => getMinutes(a.time) - getMinutes(b.time));

    return [...future, ...past];
  }, [appointments]);

  const displayedAppointments = showAll ? sortedAppointments : sortedAppointments.slice(0, 5);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400 gap-4">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <p className="font-medium">Carregando sua visão geral...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
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
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-slate-800 text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 text-center shadow-xl leading-relaxed border border-slate-700">
                        Orçamento estimado com base nos agendamentos cadastrados.
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
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-800">Agendamentos de Hoje</h2>
              <div className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Sincronizado via WhatsApp
              </div>
            </div>
            <p className="text-sm text-slate-400 font-medium lowercase">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' })}
            </p>
          </div>
          
          <div className="space-y-3">
            {displayedAppointments.length > 0 ? displayedAppointments.map((item, index) => {
              const past = isTimePast(item.time);
              const isNext = !past && (index === 0 || isTimePast(displayedAppointments[index-1]?.time));

              return (
                <div key={item.id} className={`flex items-center justify-between p-4 transition-all rounded-2xl ${past ? 'bg-slate-50/30 opacity-60' : isNext ? 'bg-indigo-50/40 ring-1 ring-indigo-100' : 'bg-slate-50/50 hover:bg-indigo-50/30'}`}>
                  <div className="flex items-center gap-6">
                    <div className={`px-4 py-2 rounded-xl text-sm font-bold min-w-[70px] text-center ${past ? 'bg-slate-200 text-slate-500' : 'bg-indigo-50 text-indigo-600'}`}>
                      {item.time}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`text-base font-bold leading-none ${past ? 'text-slate-500' : 'text-slate-800'}`}>{item.customer}</h4>
                        {isNext && <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter bg-indigo-100 px-1.5 rounded">Próximo</span>}
                      </div>
                      <p className={`text-xs font-medium mt-1 ${past ? 'text-slate-400' : 'text-slate-500'}`}>{item.service}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <p className={`font-bold text-base ${past ? 'text-slate-400' : 'text-emerald-500'}`}>R$ {item.value}</p>
                    <button className="p-2 text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100"><MoreVertical size={18} /></button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 text-slate-400">Nenhum agendamento para hoje.</div>
              )}
            </div>

            <div className="mt-6 flex justify-center border-t border-slate-50 pt-6">
              <button onClick={() => setShowAll(!showAll)} className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50/50 px-6 py-2 rounded-full">
                {showAll ? <><ChevronUp size={16} /> Recolher</> : <><ChevronRight size={16} /> Ver todos</>}
              </button>
            </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-8">Faturamento Semanal</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <RechartsTooltip contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
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
