import React from 'react';
import { Category, Song, Album } from '../types/music';
import { Folder, ArrowLeft, Music, Disc, Download, Play, Pause, ChevronRight } from 'lucide-react';

interface CategoryDetailProps {
  category: Category;
  songs: Song[];
  allCategories: Category[];
  albums: Album[];
  isPlaying: boolean;
  currentSong: Song | null;
  onPlaySong: (song: Song) => void;
  onSelectSong: (song: Song) => void;
  onSelectCategory: (category: Category) => void;
  onSelectAlbum: (album: Album) => void;
  onDownloadSong: (song: Song) => void;
  onBack: () => void;
}

export const CategoryDetail: React.FC<CategoryDetailProps> = ({
  category,
  songs,
  allCategories,
  albums,
  isPlaying,
  currentSong,
  onPlaySong,
  onSelectSong,
  onSelectCategory,
  onSelectAlbum,
  onDownloadSong,
  onBack,
}) => {
  const categorySongs = songs.filter((s) => s.category === category.name || s.categorySlug === category.slug);
  const otherCategories = allCategories.filter((c) => c.id !== category.id);

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
          <span className="text-gray-500">Categories</span>
          <span>&gt;</span>
          <span className="text-gray-900 font-bold truncate">{category.name}</span>
        </div>
        <span className="text-[10px] text-emerald-800 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          /category/{category.slug}
        </span>
      </div>

      {/* Category Header Card */}
      <div className="bg-gradient-to-r from-[#0b5331] to-[#073922] text-white p-5 rounded-lg shadow-sm border-b-2 border-emerald-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-700/80 border border-emerald-400/40 flex items-center justify-center shrink-0 shadow">
            <Folder className="w-7 h-7 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-black text-white">{category.name}</h1>
              {category.badge && (
                <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                  {category.badge}
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-200/90 mt-1 max-w-lg leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>
        <div className="bg-black/30 px-3 py-1.5 rounded-lg border border-emerald-500/30 text-right shrink-0">
          <span className="text-[10px] text-emerald-300 font-semibold block uppercase">Total Tracks</span>
          <span className="text-lg font-black text-white">{categorySongs.length} Files</span>
        </div>
      </div>

      {/* Song List in this Category */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 flex items-center justify-between text-xs font-bold text-gray-700 uppercase">
          <span>Tracks in this Folder</span>
          <span className="text-[10px] text-gray-500 lowercase">sorted by hits</span>
        </div>

        <div className="divide-y divide-gray-100">
          {categorySongs.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500">
              No songs uploaded in this folder yet.
            </div>
          ) : (
            categorySongs.map((song, idx) => {
              const isThisPlaying = currentSong?.id === song.id && isPlaying;
              return (
                <div
                  key={song.id}
                  className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-emerald-50/40 transition"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="text-xs font-bold text-gray-400 w-5 text-right mt-1">
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
                    <div>
                      <button
                        onClick={() => onSelectSong(song)}
                        className="text-xs font-bold text-gray-900 hover:text-emerald-700 text-left block hover:underline"
                      >
                        {song.title}
                      </button>
                      <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                        <span>DJ: <strong className="text-emerald-800">{song.remixer}</strong></span>
                        <span>•</span>
                        <span>{song.bitrate}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold">{song.hits.toLocaleString()} Hits</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => onDownloadSong(song)}
                      className="bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold px-3 py-1.5 rounded flex items-center gap-1 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => onSelectSong(song)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-semibold px-2.5 py-1.5 rounded border border-gray-300"
                    >
                      View Page
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Related Folders */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <h3 className="text-xs font-bold text-gray-800 uppercase mb-3 flex items-center gap-1.5">
          <Folder className="w-3.5 h-3.5 text-emerald-700" />
          <span>Explore Other Categories & Folders</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {otherCategories.slice(0, 6).map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat)}
              className="p-2.5 rounded border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-left transition flex items-center justify-between"
            >
              <div className="truncate">
                <span className="text-xs font-bold text-gray-800 block truncate">{cat.name}</span>
                <span className="text-[10px] text-gray-400">{cat.count} Files</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
