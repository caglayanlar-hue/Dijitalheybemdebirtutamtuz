import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, Sparkles, BookOpen, Key, CheckCircle, ArrowRight, Music, HelpCircle } from 'lucide-react';
import { ROOMS_DATA, GOKTURK_RUNES } from '../data/escapeRoomData';
import { soundEffects } from '../utils/audio';

interface Room1DedeKorkutProps {
  isMuted: boolean;
  onRoomCompleted: () => void;
  onGoToNextRoom: () => void;
  isCompleted: boolean;
}

export const Room1DedeKorkut: React.FC<Room1DedeKorkutProps> = ({
  isMuted,
  onRoomCompleted,
  onGoToNextRoom,
  isCompleted
}) => {
  const roomInfo = ROOMS_DATA[0];
  const targetPassword = 'TUZ EKMEK';

  const [inputVal, setInputVal] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showLearningModal, setShowLearningModal] = useState<boolean>(false);
  const [activeRuneInfo, setActiveRuneInfo] = useState<string | null>(null);

  useEffect(() => {
    if (isCompleted) {
      setInputVal(targetPassword);
    }
  }, [isCompleted]);

  const handleKopuzStringClick = (noteFreq: number) => {
    soundEffects.click(isMuted);
    // Play light string chime
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(noteFreq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // ignore
    }
  };

  const handleCheckPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCompleted) return;

    const normalized = inputVal
      .trim()
      .toLocaleUpperCase('tr-TR')
      .replace(/\s+/g, ' ');

    if (normalized === targetPassword) {
      soundEffects.levelUnlock(isMuted);
      setErrorMessage(null);
      setShowLearningModal(true);
      onRoomCompleted();
    } else {
      soundEffects.error(isMuted);
      setErrorMessage('Kopuzun tınısı uyuşmadı! Göktürk runik harflerini çözerek iki kelimelik cevabı yazın.');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Room Header */}
      <div className="bg-white/80 border border-sky-200 rounded-2xl p-5 md:p-6 shadow-xs backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sky-100 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-700">
              <span>Seviye 1</span>
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

        {/* NLP Tags */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-sky-800">
          <span className="font-semibold text-sky-900">Kavramsal Etiketler:</span>
          <span>Destan</span>
          <span>·</span>
          <span>Epik</span>
          <span>·</span>
          <span>Sadakat</span>
          <span>·</span>
          <span>Misafirperverlik</span>
          <span>·</span>
          <span>Töre</span>
        </div>
      </div>

      {/* Main Interactive Stage: Dede Korkut'un Kopuzu & Göktürk Kriptogramı */}
      <div className="relative bg-gradient-to-b from-sky-50 to-blue-50/40 border-2 border-sky-300 rounded-3xl p-6 md:p-8 shadow-sm overflow-hidden">
        {/* Subtle decorative motif in background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
          <svg viewBox="0 0 300 300" className="w-[500px] h-[500px]">
            <circle cx="150" cy="150" r="130" fill="none" stroke="#0284c7" strokeWidth="2" strokeDasharray="4,4" />
            <polygon points="150,30 180,120 270,150 180,180 150,270 120,180 30,150 120,120" fill="none" stroke="#0284c7" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="relative z-10 space-y-6">
          {/* Dede Korkut Kopuz Visual Showcase */}
          <div className="bg-white/95 border-2 border-sky-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="text-center space-y-2 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-100/80 text-sky-800 rounded-full text-xs font-semibold">
                <Music className="w-3.5 h-3.5 text-sky-600" />
                <span>Dede Korkut&apos;un Sedef Kakmalı Kopuzu</span>
              </div>
              <h3 className="text-xl md:text-2xl font-cinzel font-bold text-sky-950">
                Oğuz Yiğitlerinin Sadakat Bilmecesi
              </h3>
              <p className="text-sm text-slate-600 max-w-xl mx-auto italic">
                &quot;Oğuz elinde bir yiğidin sadakati ne ile mühürlenir?&quot;
              </p>
            </div>

            {/* Interactive Kopuz SVG Illustration */}
            <div className="flex flex-col items-center justify-center my-4">
              <div className="relative w-full max-w-lg h-36 md:h-44 bg-gradient-to-r from-sky-100 via-sky-50 to-blue-100 rounded-2xl border-2 border-sky-300 flex items-center justify-center p-4 shadow-inner">
                {/* Kopuz Neck & Body SVG */}
                <svg viewBox="0 0 460 120" className="w-full h-full">
                  {/* Pear-shaped soundbox body */}
                  <path d="M 40 60 C 40 25, 110 20, 150 35 C 190 50, 190 70, 150 85 C 110 100, 40 95, 40 60 Z" fill="#bae6fd" stroke="#0284c7" strokeWidth="2.5" />
                  {/* Soundhole */}
                  <circle cx="100" cy="60" r="14" fill="#0369a1" />
                  {/* Long neck */}
                  <rect x="150" y="52" width="220" height="16" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" rx="4" />
                  {/* Pegbox head */}
                  <path d="M 370 48 L 420 40 L 420 80 L 370 72 Z" fill="#bae6fd" stroke="#0284c7" strokeWidth="2" />
                  
                  {/* 2 Strings */}
                  <line x1="100" y1="57" x2="410" y2="57" stroke="#0284c7" strokeWidth="1.5" />
                  <line x1="100" y1="63" x2="410" y2="63" stroke="#0284c7" strokeWidth="1.5" />

                  {/* Runes carved along the neck */}
                  <text x="175" y="64" fill="#0c4a6e" fontSize="13" fontWeight="bold" fontFamily="monospace">
                    𐱃 𐰆 𐰕
                  </text>
                  <circle cx="230" cy="60" r="2.5" fill="#0284c7" />
                  <text x="245" y="64" fill="#0c4a6e" fontSize="13" fontWeight="bold" fontFamily="monospace">
                    𐰝 𐰚 𐰢 𐰝
                  </text>
                </svg>

                {/* Kopuz interactive strings buttons */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                  <button
                    onClick={() => handleKopuzStringClick(330)}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-sky-300 text-sky-800 rounded-lg hover:bg-sky-50 shadow-xs transition-colors"
                  >
                    1. Tele Dokun
                  </button>
                  <button
                    onClick={() => handleKopuzStringClick(440)}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-sky-300 text-sky-800 rounded-lg hover:bg-sky-50 shadow-xs transition-colors"
                  >
                    2. Tele Dokun
                  </button>
                </div>
              </div>

              {/* Runic Inscription Display */}
              <div className="mt-4 p-4 bg-sky-50/80 border border-sky-200 rounded-xl text-center space-y-1 w-full max-w-lg">
                <div className="text-xs font-semibold text-sky-800">
                  Kopuzun Sapındaki Göktürk Runik Yazıtı:
                </div>
                <div className="text-3xl md:text-4xl font-mono tracking-widest text-sky-950 font-bold py-1">
                  𐱃𐰆𐰕 : 𐰝𐰚𐰢𐰝
                </div>
                <div className="text-[11px] text-slate-500">
                  (Aşağıdaki runik alfabe tablosunu kullanarak bu 2 kelimeyi Latin harflerine çevirin)
                </div>
              </div>
            </div>

            {/* Göktürk Runik Alfabe Çözücü Kartı */}
            <div className="mt-6 border-t border-sky-100 pt-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-sky-600" />
                  <span>Göktürk Alfabesi Kriptografi Anahtarı</span>
                </span>
                <span className="text-xs text-sky-600 italic">Harflere tıklayarak sesi ve anlamı inceleyin</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {GOKTURK_RUNES.map((r) => {
                  const isSelected = activeRuneInfo === r.letter;
                  return (
                    <button
                      key={r.letter}
                      type="button"
                      onClick={() => {
                        soundEffects.click(isMuted);
                        setActiveRuneInfo(isSelected ? null : r.letter);
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-600 text-white border-sky-700 shadow-xs scale-105'
                          : 'bg-sky-50/70 border-sky-200 hover:bg-sky-100/80 text-sky-950'
                      }`}
                    >
                      <div className="text-2xl font-mono font-bold leading-none">{r.rune}</div>
                      <div className="text-xs font-cinzel font-bold mt-1 text-sky-900">{r.letter} Harfi</div>
                      <div className="text-[10px] opacity-80 leading-tight">{r.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Decryption Form */}
            <form onSubmit={handleCheckPassword} className="mt-6 border-t border-sky-100 pt-5 flex flex-col items-center gap-3">
              <label htmlFor="korkutInput" className="text-xs font-semibold text-slate-700">
                Kopuzun Şifresini Çözün (2 Kelime):
              </label>

              <div className="flex items-center gap-2 max-w-md w-full">
                <input
                  id="korkutInput"
                  type="text"
                  placeholder="Şifreyi yazınız (Örn: TUZ EKMEK)"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  disabled={isCompleted}
                  className="w-full px-4 py-2.5 text-base md:text-lg font-cinzel font-bold uppercase tracking-wider bg-white border-2 border-sky-300 rounded-xl text-sky-950 placeholder-sky-300 text-center focus:outline-none focus:border-sky-500 shadow-xs"
                />
                {!isCompleted ? (
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-cinzel font-bold text-sm rounded-xl shadow-xs transition-all whitespace-nowrap cursor-pointer"
                  >
                    Kilidi Aç
                  </button>
                ) : (
                  <div className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-300 whitespace-nowrap flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Şifre Çözüldü</span>
                  </div>
                )}
              </div>

              {errorMessage && (
                <div className="text-xs text-red-600 font-medium bg-red-50 border border-red-200 px-4 py-2 rounded-lg">
                  {errorMessage}
                </div>
              )}
            </form>
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
              <Unlock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-sky-600 font-bold uppercase tracking-wider">
                1. Mührü Kazandınız!
              </div>
              <div className="text-lg font-cinzel font-bold text-sky-950">
                {roomInfo.sealName} Açıldı
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLearningModal(true)}
              className="px-4 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-semibold rounded-xl border border-sky-200 transition-colors"
            >
              Öğrenme Çıktısını Gör
            </button>
            <button
              onClick={onGoToNextRoom}
              className="flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-cinzel font-bold text-sm rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Seviye 2&apos;ye İlerle (Masal ve Efsane Odası)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Dede Korkut Learning Output Modal (Mandatory User Requirement:
          Öğrenme Çıktısı: Şifre çözüldüğünde ekranda beliren metin: "Dede Korkut boylarında tuz ve ekmek, Oğuz yiğitlerinin birbirlerine verdikleri sadakat sözünün en kutsal nişanıdır.") */}
      <AnimatePresence>
        {showLearningModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              className="bg-white border-2 border-sky-400 rounded-2xl max-w-2xl w-full p-6 md:p-8 text-slate-800 shadow-2xl relative overflow-hidden"
            >
              <div className="text-center mb-5">
                <span className="text-xs font-semibold uppercase tracking-widest text-sky-600">
                  Dede Korkut Kitabı & Oğuz Töresi
                </span>
                <h3 className="text-2xl md:text-3xl font-cinzel font-bold text-sky-950 mt-1">
                  Şifre Başarıyla Çözüldü: TUZ EKMEK
                </h3>
              </div>

              {/* Exact Required Learning Output */}
              <div className="p-5 bg-sky-50 border-2 border-sky-300 rounded-2xl text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-sky-700 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <span>Öğrenme Çıktısı</span>
                  <Sparkles className="w-4 h-4 text-sky-600" />
                </div>
                <blockquote className="text-lg md:text-xl font-cinzel font-bold text-sky-950 leading-relaxed">
                  &quot;Dede Korkut boylarında tuz ve ekmek, Oğuz yiğitlerinin birbirlerine verdikleri sadakat sözünün en kutsal nişanıdır.&quot;
                </blockquote>
              </div>

              {/* Cultural Context Description */}
              <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs md:text-sm text-slate-700 leading-relaxed font-sans">
                <p className="font-semibold text-sky-900">
                  Oğuz Töresinde Tuz Ekmek ve Toy Kültürü:
                </p>
                <p>
                  Oğuz beyleri bir araya geldiklerinde büyük toy (ziyafet) verir, kazanlar kaynatır ve tuzu ekmeği bölüşürlerdi.
                  Bu paylaşım, beye ve obaya karşı can feda etme yeminiydi.
                  Oğuz töresinde bir çadırda tuzu ve ekmeği yenen kişiye ihanet etmek, en aşağılık suç ve nankörlük sayılırdı.
                </p>
                <div className="pt-2 border-t border-slate-200 text-sky-800 font-mono text-xs">
                  ✦ Kazanılan Semantik Anlam: OĞUZ TÖRESİ, AHDE VEFA VE BEYE SADAKAT
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setShowLearningModal(false);
                    onGoToNextRoom();
                  }}
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-cinzel font-bold text-xs md:text-sm rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Anladım, Masal ve Efsane Odası&apos;na Geç</span>
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
