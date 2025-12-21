
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-indigo-600 rounded-lg group-hover:bg-indigo-700 transition-colors">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              SmartSchedule
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link to="/" className="text-slate-600 hover:text-indigo-600 transition-colors">Início</Link>
            <Link to="/precos" className="text-slate-600 hover:text-indigo-600 transition-colors">Preços</Link>
            <Link to="/login" className="text-slate-600 hover:text-indigo-600 transition-colors">Entrar</Link>
            <Link to="/registrar" className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
              Começar Grátis
            </Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass border-b border-slate-200 absolute w-full left-0 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col items-center text-center">
            <Link to="/" className="w-full py-3 text-slate-600" onClick={() => setIsOpen(false)}>Início</Link>
            <Link to="/precos" className="w-full py-3 text-slate-600" onClick={() => setIsOpen(false)}>Preços</Link>
            <Link to="/login" className="w-full py-3 text-slate-600" onClick={() => setIsOpen(false)}>Login</Link>
            <Link to="/registrar" className="w-full py-3 bg-indigo-600 text-white rounded-lg shadow-md" onClick={() => setIsOpen(false)}>Criar Conta</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
