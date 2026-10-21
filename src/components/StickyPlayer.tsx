import React from 'react';
import { Song } from '../types/music';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Download, Disc, Sparkles } from 'lucide-react';

interface StickyPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  onDownload: (song: Song) => void;
  progressPercent: number;
}

export const StickyPlayer: React.FC<StickyPlayerProps> = ({
  currentSong,
  isPlaying,
  onTogglePlay,
  onPrev,
  onNext,
  volume,
  onVolumeChange,
  onDownload,
  progressPercent,
}) => {
  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0e1713] text-white border-t-2 border-emerald-500 shadow-2xl">
      {/* Visual seek progress bar */}
      <div className="w-full bg-gray-800 h-1 cursor-pointer group">
        <div
          className="bg-emerald-400 h-full transition-all duration-150 relative"
          style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
        >
          <div className="absolute right-0 -top-1 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Track Info */}
        <div className="flex items-center gap-3 min-w-0 max-w-xs sm:max-w-sm">
          <div
            className={`w-10 h-10 rounded-full bg-emerald-900 border border-emerald-400/50 flex items-center justify-center shrink-0 ${
              isPlaying ? 'animate-[spin_3s_linear_infinite]' : ''
            }`}
          >
            <Disc className="w-5 h-5 text-emerald-300" />
          </div>
          <div className="min-w-0 truncate">
            <h4 className="text-xs font-bold text-white truncate hover:text-emerald-300 cursor-pointer">
              {currentSong.title}
            </h4>
            <div className="text-[11px] text-gray-400 truncate flex items-center gap-1.5">
              <span className="text-emerald-400 font-semibold">{currentSong.remixer}</span>
              <span>•</span>
              <span>{currentSong.singer}</span>
            </div>
          </div>
        </div>

        {/* Center Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onPrev}
            className="text-gray-400 hover:text-white transition p-1"
            title="Previous track"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={onTogglePlay}
            className="w-9 h-9 rounded-full bg-amber-400 hover:bg-amber-300 text-black flex items-center justify-center shadow-lg transition transform hover:scale-105 active:scale-95"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 ml-0.5 fill-current" />
            )}
          </button>

          <button
            onClick={onNext}
            className="text-gray-400 hover:text-white transition p-1"
            title="Next track"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Right Section: Bitrate badge, Volume & Fast Download */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden md:inline-block bg-emerald-950 text-emerald-400 border border-emerald-500/50 text-[10px] font-black px-2 py-0.5 rounded tracking-wider uppercase">
            320 KBPS
          </span>

          {/* Volume slider */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => onVolumeChange(volume > 0 ? 0 : 0.7)}
              className="text-gray-400 hover:text-white"
            >
              {volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-16 h-1 accent-emerald-400 bg-gray-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* Fast Download button */}
          <button
            onClick={() => onDownload(currentSong)}
            className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-black font-extrabold text-[11px] px-3 py-1.5 rounded flex items-center gap-1.5 shadow transition transform active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-black" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};
