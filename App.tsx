
import React, { useState } from 'react';
import { TargetAudience, Category, SocialFormat, FlyerState } from './types';
import { generateFlyerContent, generateFlyerImage, getFinancialTrends } from './services/geminiService';
import FlyerPreview from './components/FlyerPreview';
import { Sparkles, Users, Layers, Monitor, RotateCcw, Wand2, Loader2, Search, AlertCircle, MessageCircle } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<FlyerState>({
    target: TargetAudience.KIDS,
    category: Category.TIP,
    format: SocialFormat.INSTAGRAM,
    userPrompt: '',
    content: null,
    imageUrl: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<'trends' | 'content' | 'image' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setLoadingStep('trends');
      const trends = await getFinancialTrends(state.target);
      
      setLoadingStep('content');
      const content = await generateFlyerContent(state.target, state.category, trends, state.userPrompt);
      
      setLoadingStep('image');
      const imageUrl = await generateFlyerImage(content, state.target);
      
      setState(prev => ({ ...prev, content, imageUrl }));
    } catch (err: any) {
      setError(err.message?.includes('quota') 
        ? 'Se alcanzó el límite de generación. Intentá de nuevo en un ratito.' 
        : 'Hubo un error al generar. Porfa, probá otra vez.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setLoadingStep(null);
    }
  };

  const getLoadingMessage = () => {
    switch (loadingStep) {
      case 'trends': return 'Mirando qué es tendencia...';
      case 'content': return 'Escribiendo en argentino...';
      case 'image': return 'Haciendo el dibujo...';
      default: return 'Cocinando magia...';
    }
  };

  const reset = () => {
    if (window.confirm('¿Empezamos un diseño nuevo de cero?')) {
      setState({
        target: TargetAudience.KIDS,
        category: Category.TIP,
        format: SocialFormat.INSTAGRAM,
        userPrompt: '',
        content: null,
        imageUrl: null,
      });
      setError(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffcf8] flex flex-col selection:bg-orange-100">
      <header className="bg-white/80 backdrop-blur-md border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg transform -rotate-3">
            <Sparkles className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#2a75a0] leading-none">Little Founders</h1>
            <span className="text-[10px] font-bold tracking-widest text-orange-500 uppercase">Flyer Studio</span>
          </div>
        </div>
        <button 
          onClick={reset}
          className="group flex items-center space-x-2 text-gray-500 hover:text-orange-600 transition-all font-medium px-4 py-2 rounded-full hover:bg-orange-50"
        >
          <RotateCcw size={18} className="group-hover:rotate-[-180deg] transition-transform duration-500" />
          <span className="hidden sm:inline">Nuevo Diseño</span>
        </button>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <div className="bg-white p-7 rounded-[2.5rem] shadow-2xl shadow-orange-900/5 border border-orange-100 space-y-7">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Wand2 size={20} className="text-orange-500" />
              Configurá tu Flyer
            </h2>

            {/* User Custom Prompt */}
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 flex items-center gap-2 uppercase tracking-tighter">
                <MessageCircle size={14} /> ¿Qué querés que genere?
              </label>
              <textarea
                value={state.userPrompt}
                onChange={(e) => setState(prev => ({ ...prev, userPrompt: e.target.value }))}
                placeholder="Ej: Un reto de ahorro de 30 días para comprarse una consola o tips para invertir las propinas..."
                className="w-full h-24 p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white outline-none font-medium text-sm text-gray-700 transition-all resize-none placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 flex items-center gap-2 uppercase tracking-tighter">
                <Users size={14} /> 1. Público
              </label>
              <div className="grid grid-cols-1 gap-2">
                {Object.values(TargetAudience).map(t => (
                  <button
                    key={t}
                    onClick={() => setState(prev => ({ ...prev, target: t }))}
                    className={`p-4 rounded-2xl text-left border-2 transition-all duration-300 font-bold text-sm ${
                      state.target === t 
                      ? 'border-orange-500 bg-orange-50/50 text-orange-700 shadow-inner' 
                      : 'border-gray-50 bg-gray-50 hover:border-orange-200 text-gray-500'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 flex items-center gap-2 uppercase tracking-tighter">
                <Layers size={14} /> 2. Estilo
              </label>
              <div className="grid grid-cols-1 gap-2">
                {Object.values(Category).map(c => (
                  <button
                    key={c}
                    onClick={() => setState(prev => ({ ...prev, category: c }))}
                    className={`p-4 rounded-2xl text-left border-2 transition-all duration-300 font-bold text-sm ${
                      state.category === c 
                      ? 'border-blue-500 bg-blue-50/50 text-blue-700 shadow-inner' 
                      : 'border-gray-50 bg-gray-50 hover:border-blue-200 text-gray-500'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 flex items-center gap-2 uppercase tracking-tighter">
                <Monitor size={14} /> 3. Formato
              </label>
              <select
                value={state.format}
                onChange={(e) => setState(prev => ({ ...prev, format: e.target.value as SocialFormat }))}
                className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-orange-500 outline-none font-bold text-gray-700 transition-colors cursor-pointer text-sm"
              >
                {Object.values(SocialFormat).map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full relative group overflow-hidden bg-[#e86b32] text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-orange-500/30 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:translate-y-0"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <Loader2 className="animate-spin" size={24} />
                    <span className="animate-pulse">{getLoadingMessage()}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center space-x-2">
                      <Sparkles size={22} className="group-hover:animate-bounce" />
                      <span>¡Generar ahora!</span>
                    </div>
                  </div>
                )}
              </button>
            </div>

            {error && (
              <div className="flex items-start space-x-2 text-red-600 text-sm font-bold bg-red-50 p-4 rounded-2xl border border-red-100">
                <AlertCircle size={18} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </aside>

        <section className="lg:col-span-8 order-1 lg:order-2 flex flex-col items-center justify-center min-h-[500px] bg-white/40 rounded-[3rem] border-2 border-dashed border-gray-200 m-2 lg:m-0">
          {state.content ? (
            <FlyerPreview state={state} />
          ) : (
            <div className="text-center space-y-8 max-w-sm p-8 transition-all duration-700">
              <div className="relative mx-auto w-32 h-32">
                <div className="absolute inset-0 bg-orange-200 rounded-full animate-ping opacity-20"></div>
                <div className="relative bg-gradient-to-br from-orange-100 to-white w-32 h-32 rounded-full flex items-center justify-center shadow-inner border border-white">
                  <Search className="text-orange-500" size={48} />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-[#2a75a0] tracking-tight">Tu idea, potenciada</h3>
                <p className="text-gray-500 text-lg leading-relaxed font-medium">
                  Escribí tu pedido, elegí el público y dejá que Little Founders cree un post <span className="text-orange-600 font-bold italic">bien argentino</span> para tus redes.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="py-8 text-center bg-white/50 border-t">
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
          Little Founders &bull; Finanzas para el futuro &bull; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default App;
