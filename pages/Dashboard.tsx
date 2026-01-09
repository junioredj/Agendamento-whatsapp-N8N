import React from "react";
import {
  TrendingUp,
  Calendar as CalendarIcon,
  ChevronRight,
  ChevronUp,
  Clock,
  MoreVertical,
  Info,
  Loader2,
  Sparkles,
  Bot,
  MessageSquare,
  Zap,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { api } from "../services/api";
import SmartIALoader from "../components/SmartIALoader";

const Dashboard: React.FC = () => {
  const [showAll, setShowAll] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState<any[]>([]);
  const [appointments, setAppointments] = React.useState<any[]>([]);
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [aiInsights, setAiInsights] = React.useState<string>("");
  const [aiLoading, setAiLoading] = React.useState<boolean>(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/api/dashboard");

      console.log(data);

      // ======================
      // CARDS (TOP STATS)
      // ======================
      const statsData = [
        //Card do valor financeiro para hoje
        {
          title: data.cards.today.label,
          count: data.cards.today.total,
          revenue: `R$ ${data.cards.today.total_estimated}`,
          sublabel: "Total estimado",
          informacao:
            "Valor finaceiro projetado para hoje com base nos agendamentos cadastrados",
          // change: "+12%",
          color: "indigo",
          icon: <CalendarIcon size={24} />,
          hasEstimatedTooltip: true,
        },
        //Card do valor finaneiro para amanhã
        {
          title: data.cards.tomorrow.label,
          count: data.cards.tomorrow.total,
          revenue: `R$ ${data.cards.tomorrow.total_estimated}`,
          sublabel: "Total estimado",
          informacao:
            "Valor finaceiro projetado para amanhã com base nos agendamentos cadastrados",
          // change: "-5%",
          color: "violet",
          icon: <Clock size={24} />,
          hasEstimatedTooltip: true,
        },
        //Card de total faturado no mês
        {
          title: data.cards.monthly_revenue.label,
          count: `R$ ${data.cards.monthly_revenue.total}`,
          sublabel: "Total estimado",
          informacao: "Valor finaceiro dos trabalhos já realizados nesse mês",
          // change: "+18%",
          color: "emerald",
          icon: <TrendingUp size={24} />,
          hasEstimatedTooltip: false,
        },

        //Card de mensagens enviadas
        {
          title: "Mensagens Enviadas (30 dias)",
          count: `${data.automation.messages_last_30_days.toLocaleString()} msgs`,
          // sublabel: "Tempo Economizado",
          // revenue: data.automation.time_saved.label,
          // informacao: "Tempo economizado de envio de mensagens no WhatsApp",
          // change: "+25%",
          color: "amber",
          icon: <Zap size={24} />,
          hasEstimatedTooltip: false,
        },
        {
          title: "Performance do Bot (30 dias)",
          count: `${data.conversation_metrics_30d.conversion_rate}%`,
          sublabel: "Taxa de conversão",
          revenue: `
    ${data.conversation_metrics_30d.abandoned} abandonadas • 
    ${data.conversation_metrics_30d.transferred_to_human} humanas
  `,
          informacao:
            "Conversão: conversas que viraram agendamento. Abandonadas: sem resposta final. Humanas: transferidas para atendente.",
          color: "sky",
          icon: <MessageSquare size={24} />,
          hasEstimatedTooltip: true,
        },
      ];

      setStats(statsData);

      // ======================
      // AGENDAMENTOS DE HOJE
      // ======================
      const formattedAppointments = data.appointments_today.map((item: any) => {
        const [date, time] = item.date.split(" ");

        return {
          id: item.id,
          time: time.slice(0, 5), // HH:mm
          customer: item.client,
          service: "Atendimento", // pode vir do backend depois
          value: item.price,
        };
      });

      setAppointments(formattedAppointments);

      // ======================
      // GRÁFICO SEMANAL
      // ======================
      const formattedChart = data.weekly_revenue.map((item: any) => ({
        name: item.date,
        valor: item.total,
      }));

      setChartData(formattedChart);

      handleAIInsights(data.cards);
    } catch (error) {
      console.warn("Erro ao carregar dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAIInsights = async (data: any) => {
    setAiLoading(true);
    const insights = [];
    setAiInsights(
      insights || "Foco total na agenda de hoje para maximizar resultados!"
    );
    setAiLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const getMinutes = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
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
      .filter((a) => getMinutes(a.time) >= currentMinutes)
      .sort((a, b) => getMinutes(a.time) - getMinutes(b.time));

    const past = appointments
      .filter((a) => getMinutes(a.time) < currentMinutes)
      .sort((a, b) => getMinutes(a.time) - getMinutes(b.time));

    return [...future, ...past];
  }, [appointments]);

  const displayedAppointments = showAll
    ? sortedAppointments
    : sortedAppointments.slice(0, 5);

  if (loading) {
    return (
      <SmartIALoader
        message="Analisando Métricas SmartIA"
        submessage="Sincronizando agendamentos e faturamento em tempo real..."
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group/card"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-3 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl`}
              >
                {stat.icon}
              </div>
              {/* <span
                className={`text-xs font-bold px-2 py-1 rounded-full ${
                  stat.change.startsWith("+")
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {stat.change}
              </span> */}
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">
              {stat.title}
            </h3>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-slate-800">
                  {stat.count}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <p className="text-sm font-bold text-slate-400">
                    {stat.hasEstimatedTooltip && (
                      <span className="mr-1">{stat.sublabel}</span>
                    )}
                    {stat.revenue}
                  </p>
                  {stat.hasEstimatedTooltip && (
                    <div className="group relative inline-block">
                      <Info
                        size={14}
                        className="text-slate-300 cursor-help hover:text-indigo-500 transition-colors"
                      />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-slate-800 text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 text-center shadow-xl leading-relaxed border border-slate-700">
                        {stat.informacao}
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
              <h2 className="text-xl font-bold text-slate-800">
                Agendamentos de Hoje
              </h2>
              <div className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Sincronizado via Google Calendar
              </div>
            </div>
            <p className="text-sm text-slate-400 font-medium lowercase">
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "short",
              })}
            </p>
          </div>

          <div className="space-y-3">
            {displayedAppointments.length > 0 ? (
              displayedAppointments.map((item, index) => {
                const past = isTimePast(item.time);
                const isNext =
                  !past &&
                  (index === 0 ||
                    isTimePast(displayedAppointments[index - 1]?.time));

                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-4 transition-all rounded-2xl ${
                      past
                        ? "bg-slate-50/30 opacity-60"
                        : isNext
                        ? "bg-indigo-50/40 ring-1 ring-indigo-100"
                        : "bg-slate-50/50 hover:bg-indigo-50/30"
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <div
                        className={`px-4 py-2 rounded-xl text-sm font-bold min-w-[70px] text-center ${
                          past
                            ? "bg-slate-200 text-slate-500"
                            : "bg-indigo-50 text-indigo-600"
                        }`}
                      >
                        {item.time}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-base font-bold leading-none ${
                              past ? "text-slate-500" : "text-slate-800"
                            }`}
                          >
                            {item.customer}
                          </h4>
                          {isNext && (
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter bg-indigo-100 px-1.5 rounded">
                              Próximo
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-xs font-medium mt-1 ${
                            past ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          {item.service}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <p
                        className={`font-bold text-base ${
                          past ? "text-slate-400" : "text-emerald-500"
                        }`}
                      >
                        R$ {item.value}
                      </p>
                      <button className="p-2 text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 text-slate-400">
                Nenhum agendamento para hoje.
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-center border-t border-slate-50 pt-6">
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50/50 px-6 py-2 rounded-full"
            >
              {showAll ? (
                <>
                  <ChevronUp size={16} /> Recolher
                </>
              ) : (
                <>
                  <ChevronRight size={16} /> Ver todos
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-8">
            Faturamento Semanal
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="valor"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorVal)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
