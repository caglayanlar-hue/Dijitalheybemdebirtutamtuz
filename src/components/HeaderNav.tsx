import React from 'react';
import { Volume2, VolumeX, HelpCircle, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';

interface HeaderNavProps {
  currentRoom: number;
  totalRooms: number;
  unlockedRooms: number[];
  onSelectRoom: (roomId: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenClues: () => void;
  onResetGame: () => void;
  elapsedSeconds: number;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentRoom,
  unlockedRooms,
  onSelectRoom,
  isMuted,
  onToggleMute,
  onOpenClues,
  onResetGame,
  elapsedSeconds,
  isFullscreen,
  onToggleFullscreen
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const roomNames = [
    { id: 1, label: "Dede Korkut" },
    { id: 2, label: "Masal ve Efsane" },
    { id: 3, label: "Anadolu İnanışları" },
    { id: 4, label: "Sözdeki Tuz" },
  ];

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 lg:px-8 py-3 bg-white/90 backdrop-blur-md border-b border-sky-200 text-sky-950 shadow-xs">
      {/* Zone 1: Single text element wordmark in display face */}
      <a
        href="#home"
        onClick={(e) => { e.preventDefault(); onSelectRoom(1); }}
        className="text-lg md:text-xl font-cinzel font-bold tracking-tight text-sky-900 hover:text-blue-700 transition-colors whitespace-nowrap shrink-0"
      >
        Tuzun Gizemi
      </a>

      {/* Zone 2: 4 nav links with clean typography & active states */}
      <nav className="hidden md:flex items-center gap-6 text-xs lg:text-sm font-medium">
        {roomNames.map((r) => {
          const isUnlocked = unlockedRooms.includes(r.id);
          const isCurrent = currentRoom === r.id;
          return (
            <button
              key={r.id}
              onClick={() => isUnlocked && onSelectRoom(r.id)}
              disabled={!isUnlocked}
              className={`transition-all pb-0.5 whitespace-nowrap text-left ${
                isCurrent
                  ? 'text-sky-700 font-semibold border-b-2 border-sky-500'
                  : isUnlocked
                  ? 'text-slate-600 hover:text-sky-900'
                  : 'text-slate-300 cursor-not-allowed'
              }`}
            >
              {r.id}. {r.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: 1-2 primary actions + time display */}
      <div className="flex items-center gap-2 lg:gap-3">
        <span className="font-mono text-xs text-sky-900 bg-sky-100/90 px-2.5 py-1 rounded border border-sky-200 tabular-nums font-semibold">
          ⏱ {formatTime(elapsedSeconds)}
        </span>

        <button
          onClick={onToggleMute}
          title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
          className="p-1.5 rounded text-sky-700 hover:text-sky-950 hover:bg-sky-100 transition-colors"
          aria-label={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={onToggleFullscreen}
          title="Tam Ekran"
          className="hidden sm:block p-1.5 rounded text-sky-700 hover:text-sky-950 hover:bg-sky-100 transition-colors"
          aria-label="Tam Ekran"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        <button
          onClick={onOpenClues}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded shadow-xs transition-all whitespace-nowrap"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>İpucu</span>
        </button>

        <button
          onClick={onResetGame}
          title="Oyunu Sıfırla"
          className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          aria-label="Oyunu Sıfırla"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
