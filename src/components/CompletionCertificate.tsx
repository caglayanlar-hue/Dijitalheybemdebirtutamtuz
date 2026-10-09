import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Award, Printer, RotateCcw, Share2, Sparkles, Check } from 'lucide-react';
import { ROOMS_DATA } from '../data/escapeRoomData';

interface CompletionCertificateProps {
  studentName: string;
  onUpdateStudentName: (name: string) => void;
  elapsedSeconds: number;
  onRestart: () => void;
  onClose: () => void;
}

export const CompletionCertificate: React.FC<CompletionCertificateProps> = ({
  studentName,
  onUpdateStudentName,
  elapsedSeconds,
  onRestart,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins} dakika ${s} saniye`;
  };

  const currentDate = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const text = `🏆 "Tuzun Gizemi: Dede Korkut ve Anadolu İnanışları" Kaçış Odası'nı ${formatTime(elapsedSeconds)} sürede başarıyla tamamladım!`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl bg-white text-slate-800 rounded-3xl shadow-2xl border-8 border-sky-400 p-6 md:p-10 relative overflow-hidden"
      >
        {/* Printable Certificate Frame */}
        <div className="border-4 border-dashed border-sky-200 p-6 md:p-8 rounded-2xl relative space-y-6 text-center">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-sky-700 font-cinzel text-xs font-bold tracking-widest uppercase">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>Dede Korkut & Anadolu Halk Kültürü Başarı Belgesi</span>
              <Sparkles className="w-4 h-4 text-sky-600" />
            </div>

            <h1 className="text-3xl md:text-5xl font-cinzel font-black tracking-tight text-sky-950">
              TUZUN GİZEMİ
            </h1>

            <p className="text-xs md:text-sm font-cinzel text-sky-800 tracking-wider uppercase font-semibold">
              Kültürel Miras ve Kaçış Odası Tamamlama Sertifikası
            </p>
          </div>

          {/* Student Name Presentation */}
          <div className="my-6 space-y-2">
            <p className="text-xs md:text-sm text-slate-600 font-medium italic">
              Bu belge, Dede Korkut boylarının sadakat andından Türk masallarına, Anadolu ocaklarının şifa geleneklerinden sözlü edebiyatımıza uzanan tüm şifreleri çözen:
            </p>

            <div className="inline-block border-b-2 border-sky-400 px-8 py-1">
              <input
                type="text"
                value={studentName}
                onChange={(e) => onUpdateStudentName(e.target.value)}
                placeholder="Öğrenci veya Grup Adını Yazınız..."
                className="text-2xl md:text-3xl font-cinzel font-bold text-sky-950 text-center bg-transparent focus:outline-none w-full max-w-md"
              />
            </div>
            <div className="text-[11px] text-sky-600">
              (Adınızı değiştirmek için kutunun üzerine tıklayabilirsiniz)
            </div>
          </div>

          {/* 4 Seals Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 my-6">
            {ROOMS_DATA.map((room) => (
              <div
                key={room.id}
                className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-xs"
              >
                <div className="w-10 h-10 rounded-full bg-white border border-sky-300 flex items-center justify-center text-lg mb-2 shadow-xs">
                  {room.id === 1 ? '🎻' : room.id === 2 ? '👑' : room.id === 3 ? '🧿' : '📜'}
                </div>
                <div className="text-[10px] font-cinzel font-bold uppercase text-sky-800 tracking-wider">
                  {room.sealName}
                </div>
                <div className="text-xs font-bold text-sky-950 mt-0.5">
                  {room.semanticMeaning}
                </div>
                <div className="text-[9px] text-slate-500 mt-1 font-mono">
                  {room.sourceContext.split('&')[0]}
                </div>
              </div>
            ))}
          </div>

          {/* Performance & Academic Metrics */}
          <div className="flex flex-wrap items-center justify-between text-xs text-sky-900 border-t border-b border-sky-100 py-3 px-4 font-mono">
            <div>
              <strong>Tarih:</strong> {currentDate}
            </div>
            <div>
              <strong>Geçen Süre:</strong> {formatTime(elapsedSeconds)}
            </div>
            <div>
              <strong>Kazanılan Rozetler:</strong> 4 / 4 Tam Başarı
            </div>
          </div>

          {/* Semantic Summary Statement */}
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed max-w-2xl mx-auto font-sans">
            Öğrenci; tuzun sadece maddi bir besin değil; Türk kültüründe <strong>Oğuz töresine sadakat</strong>,
            <strong>altından kıymetli vefa</strong>, <strong>hastalıktan ve nazardan arınma</strong> ile
            <strong>sözün tadı ve bilgeliği</strong> anlamlarını taşıdığını kanıtlamıştır.
          </p>

          {/* Signatures */}
          <div className="pt-6 flex justify-between items-end text-xs text-slate-700">
            <div className="text-center">
              <div className="font-cinzel font-bold text-sm text-sky-950">Dede Korkut Ata</div>
              <div className="text-[10px] text-sky-700">Oğuz Boyları Bilgesi</div>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-sky-400 flex items-center justify-center text-center font-cinzel font-black text-[9px] text-sky-900 rotate-12 shadow-xs bg-sky-50">
              OĞUZ MÜHRÜ
            </div>
            <div className="text-center">
              <div className="font-cinzel font-bold text-sm text-sky-950">Anadolu Kültür Kurulu</div>
              <div className="text-[10px] text-sky-700">Eğitim ve Töre Meclisi</div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Sertifikayı Yazdır / PDF İndir</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 bg-sky-50 hover:bg-sky-100 text-sky-900 rounded-xl text-xs font-semibold transition-colors border border-sky-200"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Kopyalandı!' : 'Başarıyı Paylaş'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRestart}
              className="flex items-center gap-1.5 px-3 py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Baştan Oyna</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Odaları İncelemeye Dön
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
