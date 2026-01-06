
import React from 'react';
import { Check, Zap, Sparkles } from 'lucide-react';
import { MEMBERSHIP_PLANS } from '../constants';

const PricingSection: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black mb-4 tracking-tight">Elige tu camino creativo</h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Escala tu producción con nuestros planes. Obtén un <span className="text-white font-bold">20% de descuento</span> en facturación anual.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MEMBERSHIP_PLANS.map((plan) => (
          <div 
            key={plan.tier}
            className={`relative rounded-[2rem] border p-8 flex flex-col transition-all duration-500 hover:translate-y-[-8px] ${plan.color} ${plan.recommended ? 'ring-2 ring-purple-500 shadow-2xl shadow-purple-500/20 bg-[#111]' : 'bg-[#0e0e0e]'}`}
          >
            {plan.recommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 via-indigo-600 to-purple-500 bg-[length:200%_auto] animate-gradient text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg">
                Más Popular
              </div>
            )}
            
            <div className="mb-8 flex items-center justify-between">
              <div className="p-4 bg-white/5 rounded-2xl shadow-inner">
                {plan.icon}
              </div>
              <span className="text-gray-500 text-xs font-black uppercase tracking-widest">{plan.tier}</span>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">{plan.price}</span>
                {plan.price !== '$0 MXN' && <span className="text-gray-500 text-sm font-bold">/mes</span>}
              </div>
            </div>

            <ul className="space-y-5 mb-12 flex-1">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-300 font-medium">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-indigo-500" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              className={`w-full py-5 rounded-2xl font-black transition-all shadow-lg active:scale-95 ${
                plan.tier === 'Ultra' 
                  ? 'bg-amber-500 hover:bg-amber-400 text-amber-950 shadow-amber-500/20' 
                  : plan.recommended 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-indigo-500/30' 
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
              }`}
            >
              Comenzar Ahora
            </button>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-indigo-900/40 border border-white/5 rounded-[2.5rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-3xl">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-400 font-black text-xs uppercase tracking-[0.2em] mb-4">
            <Sparkles className="w-5 h-5 fill-indigo-400" /> OFERTA ESPECIAL DE LANZAMIENTO
          </div>
          <h3 className="text-3xl md:text-4xl font-black mb-4 leading-tight">Ahorra un 40% adicional</h3>
          <p className="text-gray-400 text-lg">Actualiza a Pro hoy y usa el código <span className="text-white font-black bg-white/10 px-4 py-2 rounded-xl border border-white/10 mx-1">CREADOR24</span> al finalizar la compra.</p>
        </div>
        <button className="bg-white text-black px-12 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-transform shrink-0 shadow-2xl shadow-white/10 active:scale-95">
          Reclamar Descuento
        </button>
      </div>
    </div>
  );
};

export default PricingSection;
