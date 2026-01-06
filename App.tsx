
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CreatorLab from './components/CreatorLab';
import CloudDrive from './components/CloudDrive';
import AIChat from './components/AIChat';
import PricingSection from './components/PricingSection';
import { User, Bell, Search, X, Check } from 'lucide-react';
import { MOCK_USER } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Tu nuevo render 'Cyberpunk Odyssey' ha sido destacado.", time: "hace 5m", read: false },
    { id: 2, text: "David W. te envió un voto de regreso.", time: "hace 22m", read: false },
    { id: 3, text: "Actualización v2.5 de Laboratorio Visual disponible.", time: "hace 1h", read: true }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'lab':
        return <CreatorLab />;
      case 'cloud':
        return <CloudDrive />;
      case 'ai':
        return <AIChat />;
      case 'plans':
        return <PricingSection />;
      default:
        return <Dashboard />;
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 min-h-screen flex flex-col relative">
        {/* Header Global Localizado */}
        <header className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-2xl border-b border-white/5 px-8 py-5 flex items-center justify-between shadow-2xl">
          <div className="relative w-96 hidden lg:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Busca comunidad, archivos o herramientas..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-600"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-3 rounded-xl transition-all border ${showNotifications ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border-white/5'}`} 
                title="Notificaciones"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 text-white text-[10px] font-black rounded-full border-2 border-[#0a0a0a] flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-4 w-80 bg-[#121212] border border-white/10 rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
                    <h4 className="font-bold text-sm">Notificaciones</h4>
                    <button onClick={markAllAsRead} className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300">Marcar todo</button>
                  </div>
                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? notifications.map(n => (
                      <div key={n.id} className={`px-6 py-5 border-b border-white/5 hover:bg-white/[0.02] transition-colors relative ${!n.read ? 'bg-indigo-500/[0.03]' : ''}`}>
                        {!n.read && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-full"></div>}
                        <p className="text-xs text-gray-300 mb-1 leading-relaxed">{n.text}</p>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{n.time}</span>
                      </div>
                    )) : (
                      <div className="px-6 py-10 text-center">
                        <p className="text-xs text-gray-500">No hay notificaciones nuevas</p>
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-[#1a1a1a]">
                    <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 transition-all">Ver todas las alertas</button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4 pl-6 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-white leading-none mb-1">{MOCK_USER.name}</p>
                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Nivel {MOCK_USER.tier}</p>
              </div>
              <div className="relative group cursor-pointer" onClick={() => setActiveTab('plans')}>
                <div className="absolute inset-0 bg-indigo-500 rounded-2xl blur-md opacity-0 group-hover:opacity-40 transition-opacity"></div>
                <img 
                  src={MOCK_USER.avatar} 
                  className="relative w-11 h-11 rounded-2xl border-2 border-white/10 object-cover transition-transform group-hover:scale-105"
                  alt="Avatar" 
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0a0a0a] flex items-center justify-center shadow-lg" title="Verificado">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido Dinámico */}
        <div className="flex-1 overflow-y-auto custom-scrollbar" onClick={() => setShowNotifications(false)}>
          {renderContent()}
        </div>
        
        {/* Footer Localizado */}
        <footer className="px-8 py-10 border-t border-white/5 text-center bg-[#0a0a0a]">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-8 mb-4">
              <a href="#" className="text-xs text-gray-500 hover:text-indigo-400 transition-colors font-bold uppercase tracking-widest">Términos</a>
              <a href="#" className="text-xs text-gray-500 hover:text-indigo-400 transition-colors font-bold uppercase tracking-widest">Privacidad</a>
              <a href="#" className="text-xs text-gray-500 hover:text-indigo-400 transition-colors font-bold uppercase tracking-widest">Soporte</a>
            </div>
            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.3em]">
              &copy; 2024 Visionary Creator Hub • Impulsado por Gemini AI • Diseñado para la excelencia
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
