import React from 'react';
import { Song } from '../types/music';
import { Download, Play, Pause, Heart, FileText, Flame, Music, Sparkles } from 'lucide-react';

interface SongListProps {
  songs: Song[];
  sortMode: 'date' | 'hits' | 'rewind';
  onSortChange: (mode: 'date' | 'hits' | 'rewind') => void;
  currentSong: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song) => void;
  onSelectSong: (song: Song) => void;
  onSelectArtist?: (artistName: string) => void;
  onSelectCategoryName?: (categoryName: string) => void;
  onDownloadSong: (song: Song, quality?: '320' | '192' | '128' | 'ringtone') => void;
  favorites: string[];
  onToggleFavorite: (songId: string) => void;
}

export const SongList: React.FC<SongListProps> = ({
  songs,
  sortMode,
  onSortChange,
  currentSong,
  isPlaying,
  onPlaySong,
  onSelectSong,
  onSelectArtist,
  onSelectCategoryName,
  onDownloadSong,
  favorites,
  onToggleFavorite,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Table Header Bar */}
      <div className="bg-gray-50/90 px-3.5 py-2.5 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-emerald-700" />
          <h2 className="text-xs font-black uppercase text-gray-800 tracking-wide">
            Latest Uploaded Songs & DJ Remixes
          </h2>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
            {songs.length} Files
          </span>
        </div>

        {/* Sorting Controls */}
        <div className="text-[11px] font-semibold text-gray-500 flex items-center gap-1.5 select-none">
          <span className="text-gray-400">Sort:</span>
          <button
            onClick={() => onSortChange('date')}
            className={`px-1.5 py-0.5 rounded transition ${
              sortMode === 'date'
                ? 'text-red-600 font-extrabold underline'
                : 'hover:text-gray-900'
            }`}
          >
            Post Date
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => onSortChange('hits')}
            className={`px-1.5 py-0.5 rounded transition ${
              sortMode === 'hits'
                ? 'text-red-600 font-extrabold underline'
                : 'hover:text-gray-900'
            }`}
          >
            Most Hits
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => onSortChange('rewind')}
            className={`px-1.5 py-0.5 rounded transition ${
              sortMode === 'rewind'
                ? 'text-red-600 font-extrabold underline'
                : 'hover:text-gray-900'
            }`}
          >
            Rewind
          </button>
        </div>
      </div>

      {/* Song Rows */}
      <div className="divide-y divide-gray-100">
        {songs.length === 0 ? (
          <div className="p-12 text-center">
            <Music className="w-10 h-10 text-gray-300 mx-auto mb-2 animate-bounce" />
            <p className="text-xs font-semibold text-gray-500">
              No songs found matching your search or category filter.
            </p>
          </div>
        ) : (
          songs.map((song, idx) => {
            const isThisPlaying = currentSong?.id === song.id && isPlaying;
            const isFav = favorites.includes(song.id);

            return (
              <div
                key={song.id}
                className={`p-3 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group ${
                  currentSong?.id === song.id
                    ? 'bg-emerald-50/70 border-l-4 border-l-emerald-600'
                    : 'hover:bg-emerald-50/30'
                }`}
              >
                {/* Left: Index, Play Trigger & Info */}
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  {/* Play Button & Number */}
                  <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-gray-400 w-5 text-right">
                      {idx + 1}.
                    </span>
                    <button
                      onClick={() => onPlaySong(song)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition shadow-sm ${
                        isThisPlaying
                          ? 'bg-emerald-600 text-white animate-pulse'
                          : 'bg-gray-100 text-gray-700 hover:bg-emerald-600 hover:text-white'
                      }`}
                      title={isThisPlaying ? 'Pause song' : 'Play preview beat'}
                    >
                      {isThisPlaying ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                      )}
                    </button>
                  </div>

                  {/* Title & Technical Metadata */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => onSelectSong(song)}
                        className="text-xs font-bold text-gray-900 hover:text-emerald-700 text-left transition hover:underline"
                      >
                        {song.title}
                      </button>

                      {song.isHot && (
                        <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase shrink-0 flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5 fill-current" />
                          Hit
                        </span>
                      )}
                      {song.isTrending && (
                        <span className="bg-amber-500 text-black text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase shrink-0">
                          Trending
                        </span>
                      )}
                    </div>

                    {/* Metadata line matching screenshot with connected links */}
                    <div className="text-[11px] text-gray-500 flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                      <span>
                        DJ:{' '}
                        {onSelectArtist ? (
                          <button
                            onClick={() => onSelectArtist(song.remixer)}
                            className="text-emerald-800 font-semibold hover:underline"
                          >
                            {song.remixer}
                          </button>
                        ) : (
                          <strong className="text-emerald-800 font-semibold">{song.remixer}</strong>
                        )}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span>
                        Singer:{' '}
                        {onSelectArtist ? (
                          <button
                            onClick={() => onSelectArtist(song.singer)}
                            className="text-gray-700 hover:text-emerald-700 hover:underline"
                          >
                            {song.singer}
                          </button>
                        ) : (
                          <span className="text-gray-700">{song.singer}</span>
                        )}
                      </span>
                      <span className="text-gray-300">•</span>
                      {onSelectCategoryName ? (
                        <button
                          onClick={() => onSelectCategoryName(song.category)}
                          className="text-gray-500 hover:text-emerald-700 hover:underline"
                        >
                          {song.category}
                        </button>
                      ) : (
                        <span className="text-gray-400">{song.category}</span>
                      )}
                      <span className="text-gray-300">•</span>
                      <span className="bg-emerald-50 text-emerald-700 font-bold px-1 rounded text-[10px] border border-emerald-200">
                        {song.bitrate}
                      </span>
                      <span className="text-gray-400">{song.fileSize}</span>
                      <span className="text-gray-400">{song.duration}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-600 font-semibold">
                        {song.hits.toLocaleString()} Hits
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Fast Download, View Page, Favorite */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {/* Download Button */}
                  <button
                    onClick={() => onDownloadSong(song, '320')}
                    className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-[11px] font-bold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-sm transition transform active:scale-95"
                    title="Download 320 Kbps HQ MP3"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>

                  {/* View Page Button */}
                  <button
                    onClick={() => onSelectSong(song)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-semibold px-2.5 py-1.5 rounded border border-gray-300 transition flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5 text-gray-500" />
                    <span>View Page</span>
                  </button>

                  {/* Favorite Toggle */}
                  <button
                    onClick={() => onToggleFavorite(song.id)}
                    className={`p-1.5 rounded-full transition ${
                      isFav
                        ? 'text-pink-600 hover:text-pink-700'
                        : 'text-gray-300 hover:text-pink-500'
                    }`}
                    title={isFav ? 'Remove from Playlist' : 'Add to Playlist'}
                  >
                    <Heart
                      className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`}
                    />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
