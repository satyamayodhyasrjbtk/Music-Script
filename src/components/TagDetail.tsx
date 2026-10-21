import React from 'react';
import { Tag, Song } from '../types/music';
import { Hash, ArrowLeft, Download, Play, Pause, Music, Tag as TagIcon } from 'lucide-react';

interface TagDetailProps {
  tag: Tag;
  songs: Song[];
  allTags: Tag[];
  isPlaying: boolean;
  currentSong: Song | null;
  onPlaySong: (song: Song) => void;
  onSelectSong: (song: Song) => void;
  onSelectTag: (tag: Tag) => void;
  onDownloadSong: (song: Song) => void;
  onBack: () => void;
}

export const TagDetail: React.FC<TagDetailProps> = ({
  tag,
  songs,
  allTags,
  isPlaying,
  currentSong,
  onPlaySong,
  onSelectSong,
  onSelectTag,
  onDownloadSong,
  onBack,
}) => {
  const tagSongs = songs.filter((s) =>
    s.tags.some(
      (t) =>
        t.toLowerCase().replace(/[^a-z0-9]/g, '-') === tag.slug ||
        t.toLowerCase() === tag.name.toLowerCase()
    )
  );

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Breadcrumbs */}
      <div className="bg-white px-3.5 py-2.5 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <button onClick={onBack} className="hover:text-emerald-700 font-semibold flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </button>
          <span>&gt;</span>
          <span className="text-gray-500">Tags</span>
          <span>&gt;</span>
          <span className="text-gray-900 font-bold">#{tag.name}</span>
        </div>
        <span className="text-[10px] text-emerald-800 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          /tag/{tag.slug}
        </span>
      </div>

      {/* Tag Header Banner */}
      <div className="bg-gradient-to-r from-[#0b5331] to-[#073922] text-white p-5 rounded-lg shadow-sm border-b-2 border-emerald-400 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-emerald-700/80 border border-emerald-400/40 flex items-center justify-center shrink-0">
            <Hash className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-white">#{tag.name}</h1>
            <p className="text-xs text-emerald-200">All songs tagged with #{tag.name}</p>
          </div>
        </div>
        <div className="bg-black/30 px-3 py-1.5 rounded-lg border border-emerald-500/30 text-right">
          <span className="text-[10px] text-emerald-300 font-semibold block uppercase">Tracks</span>
          <span className="text-lg font-black text-white">{tagSongs.length} Files</span>
        </div>
      </div>

      {/* Track List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 text-xs font-bold text-gray-700 uppercase">
          Tracks Matching #{tag.name}
        </div>

        <div className="divide-y divide-gray-100">
          {tagSongs.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500">
              No tracks found with this tag.
            </div>
          ) : (
            tagSongs.map((song, idx) => {
              const isThisPlaying = currentSong?.id === song.id && isPlaying;
              return (
                <div
                  key={song.id}
                  className="p-3 flex items-center justify-between gap-2.5 hover:bg-emerald-50/40 transition"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-bold text-gray-400 w-5 text-right">
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
                    <div className="min-w-0 truncate">
                      <button
                        onClick={() => onSelectSong(song)}
                        className="text-xs font-bold text-gray-900 hover:text-emerald-700 truncate block text-left hover:underline"
                      >
                        {song.title}
                      </button>
                      <div className="text-[11px] text-gray-500 truncate">
                        DJ: {song.remixer} • {song.hits.toLocaleString()} Hits
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onDownloadSong(song)}
                      className="bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold px-3 py-1.5 rounded flex items-center gap-1 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Download</span>
                    </button>
                    <button
                      onClick={() => onSelectSong(song)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-semibold px-2.5 py-1.5 rounded border border-gray-300"
                    >
                      View
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Popular Tag Cloud */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <h3 className="text-xs font-bold text-gray-800 uppercase mb-2 flex items-center gap-1.5">
          <TagIcon className="w-3.5 h-3.5 text-emerald-700" />
          <span>Popular SEO Tags</span>
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {allTags.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelectTag(t)}
              className={`text-xs px-2.5 py-1 rounded-full border transition flex items-center gap-1 ${
                t.slug === tag.slug
                  ? 'bg-emerald-700 text-white border-emerald-700 font-bold'
                  : 'bg-gray-50 hover:bg-emerald-50 text-gray-700 border-gray-200 hover:border-emerald-400'
              }`}
            >
              <span>#{t.name}</span>
              <span className="text-[10px] opacity-70">({t.count})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
