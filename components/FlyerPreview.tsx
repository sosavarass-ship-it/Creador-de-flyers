
import React, { useState } from 'react';
import { FlyerState, SocialFormat } from '../types';
import { FORMAT_RATIOS, FORMAT_CLASSES } from '../constants';
import { ChevronLeft, ChevronRight, Download, Share2, Copy, Check, MessageSquareText } from 'lucide-react';

interface Props {
  state: FlyerState;
}

const FlyerPreview: React.FC<Props> = ({ state }) => {
  const { content, imageUrl, format } = state;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);

  if (!content) return null;

  const slides = [
    { type: 'intro', title: content.title, body: content.description },
    ...content.points.map((p, i) => ({ type: 'point', title: `Paso ${i + 1}`, body: p })),
    { type: 'outro', title: '¡Sumate!', body: content.callToAction }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const copyToClipboard = (text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-2xl px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className={`relative bg-white shadow-2xl rounded-[2rem] overflow-hidden transition-all duration-500 border-[12px] border-white ${FORMAT_RATIOS[format]} ${FORMAT_CLASSES[format]}`}>
        {/* Background Visual */}
        <div className="absolute inset-0 z-0">
          {imageUrl ? (
            <img src={imageUrl} alt="Flyer Visual" className="w-full h-full object-cover opacity-20 blur-[1px]" />
          ) : (
            <div className="w-full h-full bg-orange-50" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/40 to-white/95" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col p-10 justify-between">
          <div className="flex justify-between items-center">
            <div className="bg-[#e86b32] text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase">
              Little Founders
            </div>
            <div className="bg-[#2a75a0]/10 text-[#2a75a0] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
              {state.category}
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8">
            {imageUrl && currentSlide === 0 && (
              <div className="w-40 h-40 rounded-[2.5rem] rotate-3 border-4 border-white overflow-hidden shadow-2xl mb-4 transition-transform hover:rotate-0">
                <img src={imageUrl} alt="Hero" className="w-full h-full object-cover" />
              </div>
            )}
            
            <h2 className="text-4xl md:text-5xl font-black text-[#2a75a0] leading-[1.1] tracking-tight drop-shadow-sm">
              {slides[currentSlide].title}
            </h2>
            <p className="text-xl text-gray-600 font-semibold max-w-xs mx-auto leading-relaxed">
              {slides[currentSlide].body}
            </p>
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="flex space-x-1.5">
              {slides.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all ${currentSlide === i ? 'w-8 bg-orange-500' : 'w-2 bg-gray-200'}`} />
              ))}
            </div>
            <div className="flex space-x-3">
               <button onClick={prevSlide} className="p-3 bg-gray-50 hover:bg-orange-50 rounded-2xl text-gray-400 hover:text-orange-500 transition-all active:scale-95">
                <ChevronLeft size={24} strokeWidth={3} />
              </button>
              <button onClick={nextSlide} className="p-3 bg-orange-500 hover:bg-orange-600 rounded-2xl text-white transition-all shadow-lg shadow-orange-500/30 active:scale-95">
                <ChevronRight size={24} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Caption Section */}
      <div className="w-full bg-white rounded-[2rem] p-6 shadow-xl shadow-orange-900/5 border border-orange-50 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <MessageSquareText size={16} /> Texto para el post
          </h4>
          <button 
            onClick={() => copyToClipboard(content.caption, setCopiedCaption)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              copiedCaption ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {copiedCaption ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedCaption ? '¡Copiado!' : 'Copiar Texto'}</span>
          </button>
        </div>
        <div className="bg-orange-50/50 p-4 rounded-2xl text-sm text-gray-700 leading-relaxed font-medium italic whitespace-pre-wrap border border-orange-100/50">
          {content.caption}
        </div>
        
        <div className="flex flex-wrap gap-2 pt-2">
          {content.hashtags.map((tag, idx) => (
            <span key={idx} className="text-[11px] font-bold text-[#2a75a0] bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100/50">
              {tag}
            </span>
          ))}
          <button 
            onClick={() => copyToClipboard(content.hashtags.join(' '), setCopiedHashtags)}
            className="ml-auto p-1.5 text-gray-400 hover:text-[#2a75a0] transition-colors"
            title="Copiar Hashtags"
          >
            {copiedHashtags ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 w-full">
        <button className="flex-1 min-w-[200px] flex items-center justify-center space-x-3 bg-[#2a75a0] text-white px-8 py-4 rounded-[1.5rem] font-bold hover:brightness-110 transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98]">
          <Download size={22} />
          <span>Descargar Diseño</span>
        </button>
        <button className="flex items-center space-x-3 bg-white border-2 border-[#2a75a0] text-[#2a75a0] px-8 py-4 rounded-[1.5rem] font-bold hover:bg-blue-50 transition-all shadow-sm active:scale-[0.98]">
          <Share2 size={22} />
          <span>Compartir</span>
        </button>
      </div>
    </div>
  );
};

export default FlyerPreview;
