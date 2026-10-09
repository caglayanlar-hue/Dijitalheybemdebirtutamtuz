import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HelpCircle, X, ChevronRight, Lightbulb } from 'lucide-react';
import { ROOMS_DATA } from '../data/escapeRoomData';

interface TeacherClueModalProps {
  currentRoomId: number;
  onClose: () => void;
}

export const TeacherClueModal: React.FC<TeacherClueModalProps> = ({
  currentRoomId,
  onClose
}) => {
  const currentRoom = ROOMS_DATA.find((r) => r.id === currentRoomId) || ROOMS_DATA[0];
  const [unlockedClueCount, setUnlockedClueCount] = useState<number>(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-white border-2 border-sky-300 rounded-3xl p-6 text-slate-800 shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-xl bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-sky-700 text-xs font-bold uppercase tracking-wider mb-2">
          <HelpCircle className="w-4 h-4" />
          <span>Öğretmen & Öğrenci İpucu Kılavuzu</span>
        </div>

        <h3 className="text-xl font-cinzel font-bold text-sky-950">
          {currentRoom.roomTitle} İpuçları
        </h3>

        <p className="text-xs text-slate-500 mt-1 mb-5">
          Takıldığınızda aşamalı ipuçlarını açarak soruyu kendi çabanızla çözmeye çalışın.
        </p>

        {/* Clues Accordion */}
        <div className="space-y-3">
          {currentRoom.clues.map((clue, idx) => {
            const isUnlocked = idx < unlockedClueCount;

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isUnlocked
                    ? 'bg-sky-50 border-sky-300 text-slate-800 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5 text-sky-700">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>İpucu {idx + 1}</span>
                  </span>
                  {!isUnlocked && (
                    <span className="text-[10px] font-mono text-slate-400">
                      (Kilitli)
                    </span>
                  )}
                </div>

                <div className="text-xs md:text-sm font-sans leading-relaxed">
                  {isUnlocked ? clue : 'Bu ipucu henüz açılmadı.'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progressive Clue Reveal Button */}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
          {unlockedClueCount < currentRoom.clues.length ? (
            <button
              onClick={() => setUnlockedClueCount((prev) => prev + 1)}
              className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <span>Sonraki İpucunu Göster ({unlockedClueCount + 1}/{currentRoom.clues.length})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-xs text-sky-700 font-medium">
              Tüm ipuçları görüntülendi.
            </span>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium"
          >
            Kapat
          </button>
        </div>
      </motion.div>
    </div>
  );
};
