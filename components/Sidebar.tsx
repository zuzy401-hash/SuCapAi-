
import React, { useState } from 'react';
import { Home, Cloud, MessageSquare, ShieldCheck, Settings, LogOut, LayoutGrid, Link as LinkIcon, Check } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [copied, setCopied] = useState(false);
  const APP_URL = "https://visionary.creator.hub/workspace/alpha";

  const menuItems = [
    { id: 'dashboard', label: 'Panel Principal', icon: Home },
    { id: 'lab', label: 'Laboratorio Visual', icon: LayoutGrid },
    { id: 'cloud', label: 'Nube de Archivos', icon: Cloud },
    { id: 'ai', label: 'Asistente IA', icon: MessageSquare },
    { id: 'plans', label: 'Membresías', icon: ShieldCheck },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(APP_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="w-64 bg-[#121212] border-r border-white/5 h-screen flex flex-col fixed left-0 top-0 z-20">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/20">V</div>
          <span className="font-bold text-lg tracking-tight">Visionary</span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-white/10 text-white shadow-sm' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'group-hover:text-indigo-400'}`} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-8 pt-8 border-t border-white/5">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-4">Espacio Compartido</p>
          <button 
            onClick={handleCopy}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-gray-300 hover:text-white hover:border-white/10 transition-all text-sm group"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <LinkIcon className="w-4 h-4 shrink-0 text-indigo-400" />
              <span className="truncate opacity-60">Copiar Enlace</span>
            </div>
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <div className="w-4 h-4"></div>}
          </button>
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-white/5">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors">
          <Settings className="w-5 h-5" />
          <span className="text-sm font-medium">Ajustes</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
