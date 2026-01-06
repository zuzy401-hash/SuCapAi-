
import React, { useState } from 'react';
import { Wand2, Image as ImageIcon, Download, Share2, Loader2, Sparkles, Cloud, CheckCircle2 } from 'lucide-react';
import { generateVisualContent } from '../services/geminiService';

const CreatorLab: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setSaveSuccess(false);
    const result = await generateVisualContent(prompt);
    if (result) {
      setGeneratedImage(result);
      setHistory(prev => [result, ...prev].slice(0, 4));
    }
    setIsGenerating(false);
  };

  const handleSaveToCloud = () => {
    setIsSaving(true);
    // Simulación de guardado en la nube de Visionary
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-6">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          Laboratorio Visual <Sparkles className="text-indigo-400 w-6 h-6" />
        </h1>
        <p className="text-gray-400">Da vida a tus visiones creativas con generación de IA de alta fidelidad.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 shadow-xl">
            <label className="block text-sm font-medium text-gray-300 mb-3 uppercase tracking-widest">Prompt de Generación</label>
            <textarea
              className="w-full bg-[#121212] border border-white/10 rounded-xl p-4 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none h-40"
              placeholder="Ej: Paisaje futurista con luces de neón y vehículos flotantes, iluminación cinematográfica, 8k..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
              {isGenerating ? 'Sintetizando...' : 'Generar Visual'}
            </button>
          </div>

          <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Creaciones Recientes</h3>
            <div className="grid grid-cols-2 gap-3">
              {history.length > 0 ? history.map((img, idx) => (
                <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-[#121212] border border-white/5 cursor-pointer hover:border-indigo-500/50 transition-all group">
                  <img src={img} alt="Historial" className="w-full h-full object-cover transition-transform group-hover:scale-110" onClick={() => { setGeneratedImage(img); setSaveSuccess(false); }} />
                </div>
              )) : (
                <div className="col-span-2 py-8 text-center text-gray-500 text-sm italic">
                  Sin creaciones aún
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-[#1a1a1a] border border-white/5 rounded-[2.5rem] p-8 h-full flex flex-col items-center justify-center relative min-h-[500px] shadow-2xl overflow-hidden border border-white/5">
            {isGenerating && (
              <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-indigo-400 font-bold animate-pulse text-lg tracking-wide">Renderizando tu obra maestra...</p>
              </div>
            )}
            
            {generatedImage ? (
              <div className="w-full max-w-lg">
                <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-2xl border border-white/10 group relative bg-[#0a0a0a]">
                  <img src={generatedImage} alt="Visual Generado" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button className="p-4 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all shadow-lg active:scale-90">
                      <Download className="w-6 h-6 text-white" />
                    </button>
                    <button className="p-4 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all shadow-lg active:scale-90">
                      <Share2 className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>
                <div className="mt-8 flex gap-4 w-full">
                  <button 
                    onClick={handleSaveToCloud}
                    disabled={isSaving || saveSuccess}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all border ${saveSuccess ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'}`}
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : saveSuccess ? (
                      <CheckCircle2 className="w-4 h-4 animate-in zoom-in duration-300" />
                    ) : (
                      <Cloud className="w-4 h-4" />
                    )}
                    {isSaving ? 'Guardando...' : saveSuccess ? '¡Guardado!' : 'Guardar en Nube'}
                  </button>
                  <button className="flex-1 bg-indigo-600 hover:bg-indigo-50 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95">
                    <Share2 className="w-4 h-4" /> Compartir en Feed
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner border border-white/5">
                  <ImageIcon className="w-12 h-12 text-gray-700" />
                </div>
                <h2 className="text-2xl font-bold text-gray-200 mb-2 tracking-tight">¿Listo para crear?</h2>
                <p className="text-gray-500 max-w-xs mx-auto leading-relaxed">
                  Describe lo que tienes en mente y la IA de Visionary lo materializará con precisión artística.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorLab;
