
import React, { useState } from 'react';
import { TrendingUp, Users, Cloud, Star, ChevronRight, Play, Sparkles, ArrowRight, Zap, Heart } from 'lucide-react';
import { MOCK_USER } from '../constants';

const Dashboard: React.FC = () => {
  const [votes, setVotes] = useState<{ [key: string]: boolean }>({});
  const [lastVote, setLastVote] = useState<string | null>(null);

  const stats = [
    { label: 'Almacenamiento Nube', value: '42.5 GB / 100 GB', icon: Cloud, color: 'text-blue-400' },
    { label: 'Créditos Mensuales', value: '850 / 1000', icon: Sparkles, color: 'text-amber-400' },
    { label: 'Rango Comunitario', value: 'Top 5%', icon: Star, color: 'text-purple-400' },
    { label: 'Vistas de Activos', value: '12.4K', icon: TrendingUp, color: 'text-emerald-400' },
  ];

  const toggleVote = (id: string, artist: string) => {
    const isNewVote = !votes[id];
    setVotes(prev => ({ ...prev, [id]: isNewVote }));
    
    if (isNewVote) {
      setLastVote(artist);
      setTimeout(() => setLastVote(null), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-6">
      {/* Toast de Voto */}
      {lastVote && (
        <div className="fixed bottom-10 right-10 z-50 bg-pink-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Heart className="w-5 h-5 fill-current" />
          <span className="font-bold text-sm">¡Voto de regreso enviado a {lastVote}!</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative rounded-[2.5rem] overflow-hidden mb-12 bg-[#111] border border-white/5 min-h-[400px] flex items-center shadow-2xl">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=2000" 
            alt="Fondo Creativo" 
            className="w-full h-full object-cover opacity-40 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent"></div>
        </div>
        
        <div className="relative z-10 p-10 md:p-16 max-w-3xl">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest mb-4">
            <Sparkles className="w-4 h-4" /> Red Global de Creadores
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight tracking-tighter">
            Potencia tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500">Visión Visual.</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-xl">
            Bienvenido de nuevo, {MOCK_USER.name.split(' ')[0]}. Tienes 3 nuevas colaboraciones esperando y tu último render es tendencia en el Laboratorio.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/30 flex items-center gap-2 group">
              Explorar Laboratorio <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-2xl font-bold transition-all backdrop-blur-md">
              Ver Analíticas
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 transition-all hover:border-white/20 group">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </div>
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className="text-xl font-bold text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Destacados de la Comunidad</h2>
              <button className="text-indigo-400 text-sm font-semibold hover:text-indigo-300 flex items-center gap-1">Ver Galería <ChevronRight className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { id: 'item-1', title: 'Odisea Cyberpunk', artist: 'Elena Vance', img: 'https://images.unsplash.com/photo-1605142859862-978be7eba909?auto=format&fit=crop&q=80&w=800' },
                { id: 'item-2', title: 'Geometría Abstracta', artist: 'Marcus K.', img: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800' }
              ].map((item, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="aspect-[4/3] rounded-3xl overflow-hidden relative mb-4 border border-white/5 shadow-2xl">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleVote(item.id, item.artist); }}
                      className={`absolute top-4 right-4 p-3 rounded-xl backdrop-blur-md transition-all active:scale-90 ${votes[item.id] ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20 scale-110' : 'bg-black/40 text-white hover:bg-black/60 opacity-0 group-hover:opacity-100'}`}
                    >
                      <Heart className={`w-5 h-5 ${votes[item.id] ? 'fill-current animate-[heartBeat_1s_ease-in-out]' : ''}`} />
                    </button>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end pointer-events-none">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full border-2 border-white/20 bg-gray-800 overflow-hidden">
                           <img src={`https://picsum.photos/seed/${item.artist}/100`} alt="Avatar" />
                        </div>
                        <span className="text-white text-sm font-bold">{item.artist}</span>
                      </div>
                      <h3 className="text-white text-xl font-black">{item.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Proyectos Activos</h2>
            <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-8 space-y-8 shadow-inner">
              {[
                { name: 'Campaña Branding Octubre', progress: 75, date: '24 Oct' },
                { name: 'Tráiler de Cine IA', progress: 30, date: '12 Oct' },
                { name: 'UI de App Móvil V3', progress: 95, date: 'Ayer' }
              ].map((project, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-gray-200">{project.name}</span>
                    <span className="text-xs text-indigo-400 font-bold uppercase tracking-widest">{project.progress}% Completado</span>
                  </div>
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-500" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-10">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-10 text-white relative overflow-hidden group shadow-2xl shadow-indigo-500/20">
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-3">Visionary Pro</h3>
              <p className="text-indigo-100 text-sm mb-8 leading-relaxed opacity-90">Desbloquea exportaciones 4K, generación de IA prioritaria y espacio ilimitado en la nube.</p>
              <button className="bg-white text-indigo-700 w-full py-4 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-all transform group-hover:scale-[1.02]">Actualizar Ahora</button>
            </div>
            <Sparkles className="absolute -bottom-8 -right-8 w-40 h-40 text-white/10 group-hover:rotate-12 transition-transform duration-700" />
          </div>

          <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-8 shadow-xl">
            <h3 className="text-lg font-bold mb-8">Actividad Reciente</h3>
            <div className="space-y-8">
              {[
                { name: 'Sarah J.', action: 'compartió un nuevo prompt', time: 'hace 2m' },
                { name: 'David W.', action: 'le dio like a tu proyecto', time: 'hace 15m' },
                { name: 'Creative Lab', action: 'lanzó la actualización v2.5', time: 'hace 1h' },
              ].map((activity, idx) => (
                <div key={idx} className="flex gap-4 group cursor-default">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex-shrink-0 overflow-hidden border border-white/5 transition-transform group-hover:scale-105">
                    <img src={`https://picsum.photos/seed/${activity.name}/80`} alt="Activity" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-300 font-medium leading-tight"><span className="text-white font-bold">{activity.name}</span> {activity.action}</p>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-sm font-bold transition-all">Ver Toda la Actividad</button>
          </div>
        </aside>
      </div>
      <style>{`
        @keyframes heartBeat {
          0% { transform: scale(1); }
          14% { transform: scale(1.3); }
          28% { transform: scale(1); }
          42% { transform: scale(1.3); }
          70% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
