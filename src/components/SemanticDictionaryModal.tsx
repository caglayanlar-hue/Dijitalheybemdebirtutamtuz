import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, X, Heart, Shield, MessageSquare, Music } from 'lucide-react';
import { ROOMS_DATA } from '../data/escapeRoomData';

interface SemanticDictionaryModalProps {
  onClose: () => void;
}

export const SemanticDictionaryModal: React.FC<SemanticDictionaryModalProps> = ({ onClose }) => {
  const getIcon = (id: number) => {
    switch (id) {
      case 1:
        return <Music className="w-5 h-5 text-sky-600" />;
      case 2:
        return <Heart className="w-5 h-5 text-sky-600" />;
      case 3:
        return <Shield className="w-5 h-5 text-sky-600" />;
      default:
        return <MessageSquare className="w-5 h-5 text-sky-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-3xl bg-white border-2 border-sky-300 rounded-3xl p-6 md:p-8 text-slate-800 shadow-2xl relative my-8"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-xl bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-sky-700 text-xs font-bold uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Halk Edebiyatı & Folklor Kılavuzu</span>
        </div>

        <h3 className="text-2xl font-cinzel font-bold text-sky-950">
          Tuzun Kültürel Hafızadaki Dört Boyutu
        </h3>

        <p className="text-xs md:text-sm text-slate-600 mt-1 mb-6">
          Dede Korkut boylarından Anadolu masallarına, şifa ocaklarından dilimizdeki deyimlere tuzun sembolik dünyası.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ROOMS_DATA.map((room) => (
            <div
              key={room.id}
              className="bg-sky-50/70 border border-sky-200 rounded-2xl p-4.5 space-y-2 hover:border-sky-400 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white border border-sky-200 shadow-xs">
                  {getIcon(room.id)}
                </div>
                <div>
                  <div className="text-[11px] font-mono text-sky-700">
                    Seviye {room.id} · {room.culturalCode.split(',')[0]}
                  </div>
                  <h4 className="font-cinzel font-bold text-sky-950 text-base">
                    {room.semanticMeaning}
                  </h4>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-sans pt-1">
                {room.culturalBackground}
              </p>

              <div className="pt-2 text-[11px] text-sky-800 font-semibold border-t border-sky-100">
                Kazanım: {room.pedagogicalGoal}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            Anladım, Kaçış Odasına Dön
          </button>
        </div>
      </motion.div>
    </div>
  );
};
