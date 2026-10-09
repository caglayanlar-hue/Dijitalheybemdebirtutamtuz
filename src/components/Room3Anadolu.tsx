import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle, ArrowRight, Volume2, VolumeX, RotateCcw, BookOpen, Shield } from 'lucide-react';
import { ROOMS_DATA } from '../data/escapeRoomData';
import { soundEffects, SpeechEngine } from '../utils/audio';

interface Room3AnadoluProps {
  isMuted: boolean;
  onRoomCompleted: () => void;
  onGoToNextRoom: () => void;
  isCompleted: boolean;
}

interface ShadowEntity {
  id: string;
  name: string;
  description: string;
  x: number; // percentage
  y: number; // percentage
  isPurified: boolean;
}

const INITIAL_ENTITIES: ShadowEntity[] = [
  {
    id: 'nazar',
    name: 'Nazar',
    description: 'Kem gözün ve hasedin uğursuz gölgesi',
    x: 25,
    y: 35,
    isPurified: false
  },
  {
    id: 'koku',
    name: 'Kötü Koku',
    description: 'Bozulma ve ter kokusu',
    x: 75,
    y: 42,
    isPurified: false
  },
  {
    id: 'zayiflik',
    name: 'Zayıflık',
    description: 'Dermansızlık ve hastalıklara açıklık',
    x: 50,
    y: 65,
    isPurified: false
  }
];

const NARRATION_TEXT = 
  "Anadolu'da yeni doğan bebeklerin tuzlanması geleneği, asırlardır süregelen kadim bir koruma ve sağlık ritüelidir. " +
  "Bebekler doğduktan sonra hafif tuzlu suyla yıkanır veya tuzlanır. Bu ritüelin amacı deriyi pişirip sertleştirmek, terin ömür boyu kokmasını önlemek, " +
  "ve çocuğu kem göz ile nazardan sakınmaktır. " +
  "Ayrıca ateşe tuz atılarak yapılan 'tuz bakısı' ve 'tuz çevirme' ritüellerinde tuzun çıtırtıyla patlaması, nazarın çatladığının ve negatif enerjinin yok olduğunun simgesidir.";

export const Room3Anadolu: React.FC<Room3AnadoluProps> = ({
  isMuted,
  onRoomCompleted,
  onGoToNextRoom,
  isCompleted
}) => {
  const roomInfo = ROOMS_DATA[2];
  const [entities, setEntities] = useState<ShadowEntity[]>(INITIAL_ENTITIES);
  const [isSaltEquipped, setIsSaltEquipped] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [purificationMessage, setPurificationMessage] = useState<string | null>(null);
  const [isNarrating, setIsNarrating] = useState<boolean>(false);
  const [hasTriggeredNarration, setHasTriggeredNarration] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCompleted) {
      setEntities(INITIAL_ENTITIES.map((e) => ({ ...e, isPurified: true })));
    }
  }, [isCompleted]);

  const allPurified = entities.every((e) => e.isPurified);

  useEffect(() => {
    if (allPurified && !hasTriggeredNarration && !isCompleted) {
      setHasTriggeredNarration(true);
      onRoomCompleted();
      soundEffects.levelUnlock(isMuted);
      startAudioNarration();
    }
  }, [allPurified, hasTriggeredNarration, isCompleted, isMuted, onRoomCompleted]);

  const startAudioNarration = () => {
    if (isMuted) return;
    setIsNarrating(true);
    SpeechEngine.speak(
      NARRATION_TEXT,
      () => setIsNarrating(true),
      () => setIsNarrating(false),
      () => setIsNarrating(false)
    );
  };

  const stopAudioNarration = () => {
    SpeechEngine.stop();
    setIsNarrating(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleEntityClick = (entityId: string) => {
    if (isCompleted) return;

    if (!isSaltEquipped) {
      soundEffects.error(isMuted);
      setPurificationMessage('Önce alt kısımdaki envanterden "Ak Tuz Kesesi"ni elinize almalısınız!');
      return;
    }

    soundEffects.saltSprinkle(isMuted);
    const updated = entities.map((item) =>
      item.id === entityId ? { ...item, isPurified: true } : item
    );
    setEntities(updated);

    const targetName = entities.find((e) => e.id === entityId)?.name;
    setPurificationMessage(`Tuz serpildi! "${targetName}" arındırıldı ve ocak ateşinde çatladı!`);
  };

  const handleEquipSalt = () => {
    soundEffects.parchment(isMuted);
    setIsSaltEquipped(!isSaltEquipped);
    if (!isSaltEquipped) {
      setPurificationMessage('Ak Tuz Kesesi elinizde! Şimdi gölgelerin üzerine tıklayın.');
    }
  };

  const handleResetRoom = () => {
    if (isCompleted) return;
    soundEffects.parchment(isMuted);
    setEntities(INITIAL_ENTITIES);
    setIsSaltEquipped(false);
    setPurificationMessage(null);
    stopAudioNarration();
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Room Header */}
      <div className="bg-white/80 border border-sky-200 rounded-2xl p-5 md:p-6 shadow-xs backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sky-100 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-700">
              <span>Seviye 3</span>
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
          <Shield className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <strong>Göreviniz:</strong> Odada mavi fenerinizi gezdirerek saklanan 3 olumsuz gölgeyi
            (<em>Nazar</em>, <em>Kötü Koku</em>, <em>Zayıflık</em>) bulun.
            Envanterden <strong>Ak Tuz Kesesi</strong>&apos;ni seçip bu gölgelerin üzerine tıklayarak arındırın!
          </div>
        </div>
      </div>

      {/* Main Interactive Stage: Anadolu Ocağı & Şifa Odası */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className={`relative w-full h-[440px] md:h-[480px] rounded-3xl border-2 border-sky-300 shadow-sm overflow-hidden cursor-crosshair select-none transition-colors ${
          allPurified ? 'bg-gradient-to-b from-sky-100 via-sky-50 to-blue-100' : 'bg-slate-900'
        }`}
      >
        {/* Ambient Room Visual: Hearth, Cradle and Clay Pots */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full opacity-40" viewBox="0 0 800 500">
            {/* Hearth fireplace in Center */}
            <path d="M 330 450 Q 330 260 400 230 Q 470 260 470 450 Z" fill={allPurified ? '#e0f2fe' : '#1e293b'} stroke="#0284c7" strokeWidth="2.5" />
            {/* Fire embers */}
            <circle cx="400" cy="380" r="30" fill="#38bdf8" filter="blur(8px)" opacity={allPurified ? '0.9' : '0.4'} />
            <circle cx="400" cy="380" r="15" fill="#0284c7" filter="blur(4px)" opacity={allPurified ? '1' : '0.6'} />

            {/* Cradle silhouette */}
            <path d="M 120 420 Q 180 435 240 420 L 230 360 L 130 360 Z" fill={allPurified ? '#bae6fd' : '#0f172a'} stroke="#0284c7" strokeWidth="2" />
            <path d="M 110 425 Q 180 450 250 425" fill="none" stroke="#0284c7" strokeWidth="2.5" />
            <text x="145" y="390" fill={allPurified ? '#0369a1' : '#bae6fd'} fontSize="11" fontFamily="sans-serif">
              👶 Beşik (Tuzlama)
            </text>

            <text x="365" y="440" fill={allPurified ? '#0369a1' : '#bae6fd'} fontSize="12" fontFamily="serif">
              🔥 Şifa Ocağı
            </text>
          </svg>
        </div>

        {/* Dynamic Flashlight Mask (if not yet fully purified) */}
        {!allPurified && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-200"
            style={{
              background: `radial-gradient(circle 170px at ${mousePos.x}% ${mousePos.y}%, rgba(56, 189, 248, 0.12) 0%, rgba(15, 23, 42, 0.8) 60%, rgba(15, 23, 42, 0.98) 100%)`
            }}
          />
        )}

        {/* Floating Entities in Shadows */}
        {entities.map((entity) => (
          <div
            key={entity.id}
            style={{
              left: `${entity.x}%`,
              top: `${entity.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            className="absolute z-20"
          >
            {!entity.isPurified ? (
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleEntityClick(entity.id)}
                className={`p-3 md:p-4 rounded-full border-2 transition-all flex flex-col items-center justify-center cursor-pointer shadow-md ${
                  isSaltEquipped
                    ? 'border-sky-400 bg-sky-950/90 text-sky-100 ring-4 ring-sky-300 hover:bg-sky-900'
                    : 'border-slate-600 bg-black/70 text-slate-300 hover:border-sky-400'
                }`}
              >
                <span className="text-xl md:text-2xl animate-pulse">
                  {entity.id === 'nazar' ? '🧿' : entity.id === 'koku' ? '💨' : '🥀'}
                </span>
                <span className="font-cinzel text-xs font-bold mt-1 text-sky-200">
                  {entity.name}
                </span>
                <span className="text-[10px] text-slate-300 font-mono mt-0.5 max-w-[110px] text-center leading-tight">
                  {isSaltEquipped ? 'Tıkla & Tuz Serp' : 'Tuz Kesesi Seç'}
                </span>
              </motion.button>
            ) : (
              <motion.div
                initial={{ scale: 1.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-2.5 rounded-full bg-sky-100 border border-sky-400 text-sky-900 flex items-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span className="text-xs font-semibold">{entity.name} Arındırıldı</span>
              </motion.div>
            )}
          </div>
        ))}

        {/* Prompt overlay */}
        <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md border border-sky-200 rounded-xl p-2.5 max-w-xs text-xs text-slate-700 pointer-events-none shadow-xs">
          <div className="font-bold text-sky-900 flex items-center gap-1">
            <span>Fener Kılavuzu:</span>
          </div>
          <div>
            Fareyi gezdirerek odayı tarayın. Kalan gölgeler:{' '}
            <strong className="text-sky-700">
              {entities.filter((e) => !e.isPurified).length} / 3
            </strong>
          </div>
        </div>

        {/* Notification feedback */}
        {purificationMessage && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 border border-sky-300 rounded-xl px-4 py-2 text-xs md:text-sm text-sky-950 font-semibold text-center shadow-md pointer-events-none">
            {purificationMessage}
          </div>
        )}
      </div>

      {/* Inventory & Tool Deck */}
      <div className="p-4 bg-white/90 border border-sky-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEquipSalt}
            disabled={isCompleted}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl border-2 transition-all cursor-pointer shadow-xs ${
              isSaltEquipped
                ? 'bg-sky-600 text-white border-sky-700 ring-4 ring-sky-200 font-bold'
                : 'bg-sky-50 text-sky-950 border-sky-200 hover:bg-sky-100'
            }`}
          >
            <span className="text-2xl">🧂</span>
            <div className="text-left">
              <div className="text-xs uppercase font-cinzel tracking-wider">
                {isSaltEquipped ? '✓ Ak Tuz Kesesi Elinizde' : 'Ak Tuz Kesesini Seç'}
              </div>
              <div className="text-[11px] opacity-80">
                Ocak ateşi ve arınma tılsımı
              </div>
            </div>
          </motion.button>

          {!isCompleted && entities.some((e) => e.isPurified) && (
            <button
              onClick={handleResetRoom}
              className="text-xs text-slate-500 hover:text-sky-700 flex items-center gap-1 p-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Sıfırla</span>
            </button>
          )}
        </div>

        {/* Narration Controls */}
        <div className="flex items-center gap-2">
          {isNarrating ? (
            <button
              onClick={stopAudioNarration}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-900 rounded-xl border border-red-300 text-xs font-semibold"
            >
              <VolumeX className="w-4 h-4 text-red-700" />
              <span>Anlatımı Durdur</span>
            </button>
          ) : (
            <button
              onClick={startAudioNarration}
              className="flex items-center gap-1.5 px-3 py-2 bg-sky-50 hover:bg-sky-100 text-sky-900 rounded-xl border border-sky-200 text-xs font-semibold"
            >
              <Volume2 className="w-4 h-4 text-sky-700" />
              <span>Sesli Anlatımı Dinle</span>
            </button>
          )}
        </div>
      </div>

      {/* Narration & Folk Belief Card */}
      {allPurified && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 md:p-6 bg-gradient-to-r from-sky-50 via-white to-blue-50 border-2 border-sky-300 rounded-2xl shadow-xs space-y-3"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-100 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
                Anadolu Halk Kültürü & Şifa İnanışları
              </span>
              <h3 className="text-xl md:text-2xl font-cinzel font-bold text-sky-950 mt-0.5">
                Bebek Tuzlama ve Tuz Çevirme Ritüeli
              </h3>
            </div>

            {isNarrating && (
              <div className="flex items-center gap-1 bg-sky-100 px-3 py-1.5 rounded-full border border-sky-300">
                <Volume2 className="w-4 h-4 text-sky-700 animate-pulse" />
                <span className="text-xs text-sky-800 font-semibold">Sesli Anlatım Devrede...</span>
              </div>
            )}
          </div>

          <p className="text-sm md:text-base text-slate-700 leading-relaxed font-sans">
            {NARRATION_TEXT}
          </p>

          <div className="pt-2 border-t border-sky-100 text-sky-800 font-mono text-xs">
            ✦ Kazanılan Semantik Anlam: ŞİFA, ARINMA VE NAZARDAN KORUNMA
          </div>
        </motion.div>
      )}

      {/* Next Room Bar */}
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
                3. Mührü Kazandınız!
              </div>
              <div className="text-lg font-cinzel font-bold text-sky-950">
                {roomInfo.sealName} Açıldı
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              stopAudioNarration();
              onGoToNextRoom();
            }}
            className="flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-cinzel font-bold text-sm rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Final Seviyesi&apos;ne İlerle (Deyimler, Atasözleri ve Maniler)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
};
