
import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Blocks, 
  LogOut, 
  Settings,
  User,
  Sparkles,
  CalendarX,
  Scissors
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_name');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col fixed h-full z-30">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <span className="text-xl font-bold">SmartSchedule</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <Link 
            to="/dashboard" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive('/dashboard') 
              ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
              : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link 
            to="/servicos" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive('/servicos') 
              ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
              : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Scissors size={20} />
            <span className="font-medium">Serviços</span>
          </Link>
          <Link 
            to="/integracoes" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive('/integracoes') 
              ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
              : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Blocks size={20} />
            <span className="font-medium">Integrações</span>
          </Link>
          <Link 
            to="/bloqueio" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive('/bloqueio') 
              ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
              : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <CalendarX size={20} />
            <span className="font-medium">Bloqueio de Agenda</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <Link to="/perfil" className="block bg-slate-50 p-4 rounded-xl mb-4 hover:bg-indigo-50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                J
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">João Silva</p>
                <p className="text-xs text-slate-500">Barbeiro Premium</p>
              </div>
            </div>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            {isActive('/dashboard') && 'Visão Geral'}
            {isActive('/servicos') && 'Meus Serviços'}
            {isActive('/integracoes') && 'Integrações'}
            {isActive('/perfil') && 'Meu Perfil'}
            {isActive('/bloqueio') && 'Bloqueio de Agenda'}
          </h1>
          <div className="flex gap-4">
            <Link to="/perfil" className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <Settings size={22} />
            </Link>
            <Link to="/perfil" className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <User size={22} />
            </Link>
          </div>
        </header>
        <Outlet />
      </main>

      {/* Mobile Navbar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50 overflow-x-auto">
        <div className="flex justify-between w-full min-w-[320px] gap-2">
          <Link to="/dashboard" className={isActive('/dashboard') ? 'text-indigo-600' : 'text-slate-400'}>
            <LayoutDashboard size={24} />
          </Link>
          <Link to="/servicos" className={isActive('/servicos') ? 'text-indigo-600' : 'text-slate-400'}>
            <Scissors size={24} />
          </Link>
          <Link to="/integracoes" className={isActive('/integracoes') ? 'text-indigo-600' : 'text-slate-400'}>
            <Blocks size={24} />
          </Link>
          <Link to="/bloqueio" className={isActive('/bloqueio') ? 'text-indigo-600' : 'text-slate-400'}>
            <CalendarX size={24} />
          </Link>
          <Link to="/perfil" className={isActive('/perfil') ? 'text-indigo-600' : 'text-slate-400'}>
            <User size={24} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
