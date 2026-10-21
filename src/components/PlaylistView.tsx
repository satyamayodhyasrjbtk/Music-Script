import React from 'react';
import { Song } from '../types/music';
import { Play, Pause, Download, Heart, ArrowLeft, Trash2, Music } from 'lucide-react';

interface PlaylistViewProps {
  favoriteSongs: Song[];
  isPlaying: boolean;
  currentSong: Song | null;
  onPlaySong: (song: Song) => void;
  onSelectSong: (song: Song) => void;
  onDownloadSong: (song: Song) => void;
  onRemoveFavorite: (songId: string) => void;
  onBack: () => void;
}

export const PlaylistView: React.FC<PlaylistViewProps> = ({
  favoriteSongs,
  isPlaying,
  currentSong,
  onPlaySong,
  onSelectSong,
  onDownloadSong,
  onRemoveFavorite,
  onBack,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-gray-600 hover:text-emerald-700 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Songs</span>
        </button>

        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-pink-600 fill-pink-600" />
          <h2 className="text-xs font-black uppercase text-gray-800">
            My Favorite DJ Songs & Playlist ({favoriteSongs.length})
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {favoriteSongs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-semibold">Your playlist is empty.</p>
            <p className="text-xs text-gray-400 mt-1">
              Click the heart icon next to any song in the list to bookmark it here for fast playback.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {favoriteSongs.map((song, idx) => {
              const isThisPlaying = currentSong?.id === song.id && isPlaying;
              return (
                <div
                  key={song.id}
                  className="p-3 flex items-center justify-between gap-3 hover:bg-emerald-50/40 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs text-gray-400 font-bold w-4 text-right">
                      {idx + 1}.
                    </span>
                    <button
                      onClick={() => onPlaySong(song)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition ${
                        isThisPlaying
                          ? 'bg-emerald-600 text-white animate-pulse'
                          : 'bg-gray-100 text-gray-700 hover:bg-emerald-600 hover:text-white'
                      }`}
                    >
                      {isThisPlaying ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <button
                        onClick={() => onSelectSong(song)}
                        className="text-xs font-bold text-gray-900 hover:text-emerald-700 text-left block truncate hover:underline"
                      >
                        {song.title}
                      </button>
                      <div className="text-[11px] text-gray-500 truncate">
                        DJ: {song.remixer} • {song.bitrate} • {song.fileSize}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onDownloadSong(song)}
                      className="bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold px-3 py-1.5 rounded flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Download</span>
                    </button>
                    <button
                      onClick={() => onRemoveFavorite(song.id)}
                      className="text-gray-400 hover:text-red-500 p-1.5"
                      title="Remove from playlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
