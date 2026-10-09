import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, CheckCircle, ArrowRight, RotateCcw, Award, Sparkles, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ROOMS_DATA, FOLKLORE_ITEMS, IdiomItem } from '../data/escapeRoomData';
import { soundEffects } from '../utils/audio';

interface Room4DeyimlerProps {
  isMuted: boolean;
  onRoomCompleted: () => void;
  onShowCertificate: () => void;
  isCompleted: boolean;
}

export const Room4Deyimler: React.FC<Room4DeyimlerProps> = ({
  isMuted,
  onRoomCompleted,
  onShowCertificate,
  isCompleted
}) => {
  const roomInfo = ROOMS_DATA[3];
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const wordBank = ['bilmek', 'us', 'kuru', 'meclisine'];

  useEffect(() => {
    if (isCompleted) {
      const completed: Record<string, string> = {};
      FOLKLORE_ITEMS.forEach((item) => {
        completed[item.id] = item.targetSlot;
      });
      setMatches(completed);
    }
  }, [isCompleted]);

  const allDone = FOLKLORE_ITEMS.every(
    (item) => matches[item.id] === item.targetSlot
  );

  const handleSelectSlot = (item: IdiomItem) => {
    if (isCompleted) return;

    if (!selectedWord) {
      if (matches[item.id]) {
        soundEffects.click(isMuted);
        const copy = { ...matches };
        delete copy[item.id];
        setMatches(copy);
        setFeedback(null);
      } else {
        setFeedback('Önce aşağıdaki kelime havuzundan uygun kelimeye tıklayın!');
      }
      return;
    }

    soundEffects.click(isMuted);
    const newMatches = { ...matches, [item.id]: selectedWord };
    setMatches(newMatches);
    setSelectedWord(null);

    if (selectedWord === item.targetSlot) {
      soundEffects.saltSprinkle(isMuted);
      setFeedback(`Tebrikler! ${item.category} başarıyla tamamlandı.`);
    } else {
      soundEffects.error(isMuted);
      setFeedback('Bu kelime cümlenin semantik anlamına tam uymadı.');
    }

    const checkAll = FOLKLORE_ITEMS.every(
      (f) => (newMatches[f.id] || '') === f.targetSlot
    );

    if (checkAll) {
      soundEffects.levelUnlock(isMuted);
      triggerConfetti();
      onRoomCompleted();
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const handleReset = () => {
    if (isCompleted) return;
    soundEffects.parchment(isMuted);
    setMatches({});
    setSelectedWord(null);
    setFeedback(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Room Header */}
      <div className="bg-white/80 border border-sky-200 rounded-2xl p-5 md:p-6 shadow-xs backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sky-100 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-700">
              <span>Seviye 4 (Final)</span>
              <span>·</span>
              <span>{roomInfo.culturalCode}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-cinzel font-bold text-sky-950 tracking-wide mt-1">
              {roomInfo.roomTitle}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-sky-800 bg-sky-50 border border-sky-200 px-3 py-2 rounded-xl">
            <BookOpen className="w-4 h-4 text-sky-600 shrink-0" />
            <span>Kaynak: <strong>{roomInfo.sourceContext}</strong></span>
          </div>
        </div>

        <p className="text-sm md:text-base text-slate-700 leading-relaxed font-sans">
          {roomInfo.description}
        </p>

        <div className="mt-3 p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs md:text-sm text-sky-900 flex items-start gap-2.5">
          <MessageSquare className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <strong>Göreviniz:</strong> Türkçemizin sözlü hazinesinde yer alan deyim, atasözü ve manilerin eksik kelimelerini
            aşağıdaki kelime havuzundan seçerek tamamlayın ve son mührü kazanın!
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="bg-gradient-to-b from-sky-50 to-blue-50/40 border-2 border-sky-300 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-cinzel font-bold text-sky-950">
            Deyim, Atasözü ve Mani Tamamlama Sandığı
          </h3>
          {!isCompleted && Object.keys(matches).length > 0 && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-sky-700 hover:text-sky-900"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Temizle</span>
            </button>
          )}
        </div>

        {/* Puzzle Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FOLKLORE_ITEMS.map((item) => {
            const currentFilled = matches[item.id];
            const isFilled = Boolean(currentFilled);
            const isCorrect = currentFilled === item.targetSlot;

            return (
              <div
                key={item.id}
                className={`p-4 md:p-5 rounded-2xl border-2 transition-all ${
                  isCorrect
                    ? 'bg-white border-emerald-400 shadow-xs'
                    : isFilled
                    ? 'bg-red-50/80 border-red-300'
                    : 'bg-white/90 border-sky-200 hover:border-sky-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-sky-700 font-semibold mb-2">
                  <span className="bg-sky-100 px-2.5 py-0.5 rounded-full font-cinzel">
                    {item.category}
                  </span>
                  {isCorrect && (
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Doğru
                    </span>
                  )}
                </div>

                {/* Phrase gap button */}
                <div className="text-sm md:text-base text-slate-800 font-medium leading-relaxed my-2">
                  {item.phrase.split('...')[0]}
                  <button
                    onClick={() => handleSelectSlot(item)}
                    disabled={isCompleted}
                    className={`inline-flex items-center justify-center px-3 py-1 mx-1.5 rounded-lg border-2 font-mono text-xs md:text-sm font-bold transition-all cursor-pointer ${
                      isCorrect
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                        : currentFilled
                        ? 'bg-red-600 text-white border-red-500'
                        : selectedWord
                        ? 'bg-sky-500 text-white border-sky-600 animate-pulse'
                        : 'bg-sky-50 text-sky-800 border-dashed border-sky-300 hover:border-sky-500'
                    }`}
                  >
                    {currentFilled || '___ ? ___'}
                  </button>
                  {item.phrase.split('...')[1]}
                </div>

                {/* Meaning & origin note */}
                <div className="mt-3 pt-2.5 border-t border-sky-100 text-xs text-slate-600">
                  <strong>Anlamı:</strong> {item.meaning}
                </div>

                {isCorrect && (
                  <div className="mt-2 text-[11px] text-sky-800 italic bg-sky-50 p-2 rounded-lg">
                    💡 {item.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Word Bank Deck */}
        <div className="p-4 bg-white/90 border border-sky-200 rounded-2xl space-y-3 shadow-xs">
          <div className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span>Kelime Havuzu (Önce kelimeye dokunun, sonra karttaki boşluğa yerleştirin):</span>
            {selectedWord && (
              <span className="text-sky-700 font-mono font-bold">
                Seçilen: &quot;{selectedWord}&quot;
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2.5">
            {wordBank.map((word) => {
              const isUsed = Object.values(matches).includes(word);
              const isCurrentlySelected = selectedWord === word;

              return (
                <button
                  key={word}
                  onClick={() => setSelectedWord(isCurrentlySelected ? null : word)}
                  disabled={isCompleted}
                  className={`px-4 py-2 rounded-xl font-mono text-sm font-bold border-2 transition-all cursor-pointer ${
                    isCurrentlySelected
                      ? 'bg-sky-600 text-white border-sky-700 ring-4 ring-sky-200 scale-105'
                      : isUsed
                      ? 'bg-slate-100 text-slate-400 border-slate-200 opacity-60'
                      : 'bg-sky-50 text-sky-950 border-sky-300 hover:bg-sky-100 hover:border-sky-400 shadow-xs'
                  }`}
                >
                  {word}
                </button>
              );
            })}
          </div>

          {feedback && (
            <div className="text-xs md:text-sm text-sky-900 font-medium">
              {feedback}
            </div>
          )}
        </div>
      </div>

      {/* Completion Victory Card */}
      {allDone && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 border-sky-400 rounded-2xl p-6 md:p-8 shadow-sm space-y-5 text-center"
        >
          <div className="inline-flex p-3 bg-sky-100 text-sky-700 rounded-full">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-600">
              Tüm Seviyeler Başarıyla Çözüldü
            </span>
            <h3 className="text-2xl md:text-3xl font-cinzel font-black text-sky-950">
              Tuzun Dört Kadim Mührü Tamamlandı!
            </h3>
            <p className="text-sm text-slate-600 max-w-xl mx-auto font-sans leading-relaxed">
              Oğuz töresinin tuz ekmek andından Türk masallarına, Anadolu&apos;nun şifa ocaklarından
              zengin deyimlerimize kadar tuzun kültürel hafızadaki tüm sırlarını keşfettiniz.
            </p>
          </div>

          <div className="pt-3 flex justify-center">
            <button
              onClick={onShowCertificate}
              className="flex items-center gap-2 px-8 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-cinzel font-bold text-sm rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <Award className="w-4 h-4" />
              <span>Başarı Belgesini Görüntüle & Yazdır</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
