import React from 'react';
import { Song } from '../types/music';
import { Flame, Play, Pause, TrendingUp, Sparkles, Disc } from 'lucide-react';

interface TrendingMarqueeProps {
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song) => void;
  onSelectSong: (song: Song) => void;
}

export const TrendingMarquee: React.FC<TrendingMarqueeProps> = ({
  songs,
  currentSong,
  isPlaying,
  onPlaySong,
  onSelectSong,
}) => {
  // Compute top 5 most-hit songs
  const top5Songs = [...songs]
    .sort((a, b) => b.hits - a.hits)
    .slice(0, 5);

  if (top5Songs.length === 0) return null;

  return (
    <div className="bg-[#072416] border-y border-emerald-600/40 text-white overflow-hidden shadow-inner flex items-center">
      {/* Static Label / Badge */}
      <div className="bg-gradient-to-r from-red-600 to-amber-500 text-white font-black text-xs px-3 sm:px-4 py-2 shrink-0 flex items-center gap-1.5 shadow-md z-10 select-none">
        <Flame className="w-4 h-4 fill-amber-300 animate-bounce" />
        <span className="tracking-wider uppercase text-[11px] font-black">Trending Now</span>
        <span className="hidden md:inline-block bg-black/30 text-[9px] px-1.5 py-0.2 rounded uppercase font-bold text-amber-200">
          Top 5 Hits
        </span>
      </div>

      {/* Marquee Track */}
      <div className="relative flex-1 overflow-hidden py-1.5 group">
        <div className="animate-marquee items-center space-x-6 pl-4">
          {/* Repeat list twice to ensure infinite continuous loop */}
          {[...top5Songs, ...top5Songs].map((song, index) => {
            const rank = (index % top5Songs.length) + 1;
            const isThisPlaying = currentSong?.id === song.id && isPlaying;

            return (
              <div
                key={`${song.id}-${index}`}
                className="flex items-center gap-2 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/30 rounded-full pl-2 pr-3 py-1 transition cursor-pointer select-none text-xs shrink-0"
              >
                {/* Rank Badge */}
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] shadow ${
                    rank === 1
                      ? 'bg-amber-400 text-black'
                      : rank === 2
                      ? 'bg-gray-200 text-gray-900'
                      : rank === 3
                      ? 'bg-amber-700 text-white'
                      : 'bg-emerald-800 text-emerald-200'
                  }`}
                >
                  #{rank}
                </span>

                {/* Quick Play Trigger */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlaySong(song);
                  }}
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition ${
                    isThisPlaying
                      ? 'bg-emerald-400 text-emerald-950 animate-pulse'
                      : 'bg-emerald-800 hover:bg-emerald-400 hover:text-emerald-950 text-white'
                  }`}
                  title={isThisPlaying ? 'Pause track' : 'Play track'}
                >
                  {isThisPlaying ? (
                    <Pause className="w-2.5 h-2.5 fill-current" />
                  ) : (
                    <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                  )}
                </button>

                {/* Title & Artist */}
                <span
                  onClick={() => onSelectSong(song)}
                  className="font-bold text-gray-100 hover:text-emerald-300 transition hover:underline max-w-[200px] sm:max-w-[260px] truncate"
                >
                  {song.title}
                </span>

                <span className="text-[10px] text-emerald-400/80 font-medium hidden sm:inline">
                  ({song.remixer})
                </span>

                {/* Hits Count Badge */}
                <span className="bg-red-900/80 text-amber-300 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full border border-red-500/40">
                  {song.hits >= 1000 ? `${(song.hits / 1000).toFixed(1)}K` : song.hits} Hits
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
