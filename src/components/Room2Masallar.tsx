import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, CheckCircle, ArrowRight, Sparkles, Heart, HelpCircle, Utensils } from 'lucide-react';
import { ROOMS_DATA, TALE_SEGMENTS, LEGEND_SALT_LAKE } from '../data/escapeRoomData';
import { soundEffects } from '../utils/audio';

interface Room2MasallarProps {
  isMuted: boolean;
  onRoomCompleted: () => void;
  onGoToNextRoom: () => void;
  isCompleted: boolean;
}

export const Room2Masallar: React.FC<Room2MasallarProps> = ({
  isMuted,
  onRoomCompleted,
  onGoToNextRoom,
  isCompleted
}) => {
  const roomInfo = ROOMS_DATA[1];
  const [hasAddedSaltToTable, setHasAddedSaltToTable] = useState<boolean>(false);
  const [selectedLegendLesson, setSelectedLegendLesson] = useState<string | null>(null);
  const [showStoryModal, setShowStoryModal] = useState<boolean>(false);

  useEffect(() => {
    if (isCompleted) {
      setHasAddedSaltToTable(true);
      setSelectedLegendLesson('lesson1');
    }
  }, [isCompleted]);

  const handleAddSalt = () => {
    if (isCompleted) return;
    soundEffects.saltSprinkle(isMuted);
    setHasAddedSaltToTable(true);
    checkPuzzleCompletion(true, selectedLegendLesson);
  };

  const handleSelectLesson = (lessonId: string) => {
    if (isCompleted) return;
    soundEffects.click(isMuted);
    setSelectedLegendLesson(lessonId);
    checkPuzzleCompletion(hasAddedSaltToTable, lessonId);
  };

  const checkPuzzleCompletion = (saltAdded: boolean, lesson: string | null) => {
    if (saltAdded && lesson === 'lesson1') {
      soundEffects.levelUnlock(isMuted);
      setShowStoryModal(true);
      onRoomCompleted();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Room Header */}
      <div className="bg-white/80 border border-sky-200 rounded-2xl p-5 md:p-6 shadow-xs backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sky-100 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-700">
              <span>Seviye 2</span>
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
      </div>

      {/* Main Interactive Stage: Masal Sofrası ve Tuz Gölü Efsanesi */}
      <div className="bg-gradient-to-b from-sky-50 to-blue-50/40 border-2 border-sky-300 rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
        {/* Part 1: "Seni Tuz Kadar Seviyorum" Masal Aşaması */}
        <div className="bg-white/95 border-2 border-sky-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-sky-100 pb-3">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-sky-600" />
              <h3 className="font-cinzel font-bold text-lg text-sky-950">
                1. Masal Bilmecesi: &quot;Seni Tuz Kadar Seviyorum&quot;
              </h3>
            </div>
            <span className="text-xs text-sky-700 font-semibold bg-sky-100 px-3 py-1 rounded-full">
              Padişahın Sofrası
            </span>
          </div>

          {/* Tale Story Progression Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {TALE_SEGMENTS.map((seg, idx) => (
              <div
                key={seg.id}
                className="p-3.5 bg-sky-50/80 border border-sky-200 rounded-xl space-y-1.5 text-xs text-slate-700"
              >
                <div className="font-cinzel font-bold text-sky-900 text-sm flex items-center justify-between">
                  <span>{idx + 1}. {seg.title}</span>
                </div>
                <p className="leading-relaxed font-sans">{seg.text}</p>
                <div className="text-[11px] font-semibold text-sky-700 pt-1 border-t border-sky-200/60">
                  ✦ {seg.highlight}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Banquet Table Stage */}
          <div className="p-5 bg-gradient-to-r from-sky-100 via-sky-50 to-blue-100 border-2 border-sky-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white border-2 border-sky-300 flex items-center justify-center text-3xl shadow-inner">
                {hasAddedSaltToTable ? '🧂' : '🍲'}
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-sky-800">
                  Saray Ziyafet Sofrası Durumu:
                </div>
                <div className="text-sm font-semibold text-sky-950">
                  {hasAddedSaltToTable
                    ? '✓ Sofraya Ak Tuz Konuldu! Padişah hayatın gerçek lezzetini idrak etti.'
                    : '⚠ Sofrada altın ve gümüş kaplar var ama tuz yok! Padişah yemek yiyemiyor.'}
                </div>
              </div>
            </div>

            {!hasAddedSaltToTable && (
              <button
                type="button"
                onClick={handleAddSalt}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-cinzel font-bold text-xs md:text-sm rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
              >
                <Utensils className="w-4 h-4" />
                <span>Sofraya Tuzu Getir & Lezzeti Aç</span>
              </button>
            )}
          </div>
        </div>

        {/* Part 2: Tuz Gölü Efsanesi ve Ahde Vefa */}
        <div className="bg-white/95 border-2 border-sky-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-sky-100 pb-3">
            <BookOpen className="w-5 h-5 text-sky-600" />
            <h3 className="font-cinzel font-bold text-lg text-sky-950">
              2. Efsane Bilmecesi: {LEGEND_SALT_LAKE.title}
            </h3>
          </div>

          <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl text-xs md:text-sm text-slate-700 leading-relaxed space-y-2">
            <p className="italic">
              &quot;{LEGEND_SALT_LAKE.text}&quot;
            </p>
          </div>

          {/* Interactive Lesson Question */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-bold text-sky-900">
              Soru: Bu kadim efsane bizlere tuz ve misafirperverlik hakkında hangi temel ahlaki dersi verir?
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleSelectLesson('lesson1')}
                className={`p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                  selectedLegendLesson === 'lesson1'
                    ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                    : 'bg-white text-slate-700 border-sky-200 hover:bg-sky-50'
                }`}
              >
                <strong>A) Doğru Cevap:</strong> Tuz ve sofra nimeti esirgenemez bir haktır; misafire ikram etmek ve cömertlik töredir.
              </button>

              <button
                type="button"
                onClick={() => handleSelectLesson('lesson2')}
                className={`p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                  selectedLegendLesson === 'lesson2'
                    ? 'bg-red-100 text-red-900 border-red-300'
                    : 'bg-white text-slate-700 border-sky-200 hover:bg-sky-50'
                }`}
              >
                <strong>B)</strong> Tuz gölleri sadece ticari bir maden ocağıdır.
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Next Room Bar */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border-2 border-sky-400 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="p-3 bg-sky-100 text-sky-700 rounded-full border border-sky-300">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-sky-600 font-bold uppercase tracking-wider">
                2. Mührü Kazandınız!
              </div>
              <div className="text-lg font-cinzel font-bold text-sky-950">
                {roomInfo.sealName} Açıldı
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowStoryModal(true)}
              className="px-4 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-semibold rounded-xl border border-sky-200 transition-colors"
            >
              Masal Hikmetini Gör
            </button>
            <button
              onClick={onGoToNextRoom}
              className="flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-cinzel font-bold text-sm rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Seviye 3&apos;e İlerle (Anadolu İnanışları Odası)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Story Insight Modal */}
      <AnimatePresence>
        {showStoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              className="bg-white border-2 border-sky-400 rounded-2xl max-w-2xl w-full p-6 md:p-8 text-slate-800 shadow-2xl relative"
            >
              <div className="text-center mb-5">
                <span className="text-xs font-semibold uppercase tracking-widest text-sky-600">
                  Türk Masal ve Efsane İrfanı
                </span>
                <h3 className="text-2xl font-cinzel font-bold text-sky-950 mt-1">
                  Altından Kıymetli Olan Tuz
                </h3>
              </div>

              <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl space-y-2 text-xs md:text-sm text-slate-700 leading-relaxed font-sans">
                <p>
                  Masalda padişahın küçük kızı, sevginin parlak mücevherlerle değil; hayatın devam etmesini sağlayan en zaruri ve yalın cevherle ölçüldüğünü haykırmıştı.
                  Tuzsuz kalan padişah, altının açlığı gideremediğini ve lezzet katamadığını görmüştür.
                </p>
                <p>
                  Efsanede ise tuz, esirgenmesi felaket getiren mukaddes bir nimet olarak karşımıza çıkar.
                  Tuz Gölü Efsanesi, Anadolu insanına yüzyıllar boyunca misafire sofrayı açmayı öğütlemiştir.
                </p>
                <div className="pt-2 border-t border-sky-200 text-sky-800 font-mono text-xs">
                  ✦ Kazanılan Semantik Anlam: HAYATIN ÖZÜ, GERÇEK SEVGİ VE BEREKET
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setShowStoryModal(false);
                    onGoToNextRoom();
                  }}
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-cinzel font-bold text-xs md:text-sm rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Anladım, Anadolu İnanışları Odası&apos;na Geç</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
