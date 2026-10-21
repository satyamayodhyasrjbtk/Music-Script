import React from 'react';
import { Album, Song } from '../types/music';
import { Disc, ArrowLeft, Download, Play, Pause, Calendar, Music, Sparkles } from 'lucide-react';

interface AlbumDetailProps {
  album: Album;
  songs: Song[];
  allAlbums: Album[];
  isPlaying: boolean;
  currentSong: Song | null;
  onPlaySong: (song: Song) => void;
  onSelectSong: (song: Song) => void;
  onSelectAlbum: (album: Album) => void;
  onDownloadSong: (song: Song) => void;
  onBack: () => void;
}

export const AlbumDetail: React.FC<AlbumDetailProps> = ({
  album,
  songs,
  allAlbums,
  isPlaying,
  currentSong,
  onPlaySong,
  onSelectSong,
  onSelectAlbum,
  onDownloadSong,
  onBack,
}) => {
  const albumSongs = songs.filter((s) => s.album === album.name || s.albumSlug === album.slug);
  const otherAlbums = allAlbums.filter((a) => a.id !== album.id);

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
          <span className="text-gray-500">Albums</span>
          <span>&gt;</span>
          <span className="text-gray-900 font-bold truncate">{album.name}</span>
        </div>
        <span className="text-[10px] text-emerald-800 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          /album/{album.slug}
        </span>
      </div>

      {/* Album Showcase Banner */}
      <div className="bg-[#0b5331] text-white p-5 rounded-lg shadow-sm border-b-2 border-emerald-400 flex flex-col sm:flex-row items-center sm:items-start gap-4">
        {/* Album Artwork */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg bg-emerald-950 border-2 border-emerald-400/60 shadow-xl overflow-hidden shrink-0 flex items-center justify-center relative group">
          {album.coverArt ? (
            <img src={album.coverArt} alt={album.name} className="w-full h-full object-cover" />
          ) : (
            <Disc className="w-12 h-12 text-emerald-300 animate-spin" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left space-y-1">
          <span className="bg-emerald-800 text-emerald-200 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
            Official DJ Album
          </span>
          <h1 className="text-lg sm:text-2xl font-black text-white">{album.name}</h1>
          <p className="text-xs text-emerald-200">
            Artist / Producer: <strong className="text-white">{album.artist}</strong>
          </p>
          <p className="text-[11px] text-emerald-300/80">{album.description}</p>
          <div className="text-[11px] text-emerald-200 flex items-center justify-center sm:justify-start gap-3 pt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {album.releaseYear}
            </span>
            <span>•</span>
            <span className="font-bold text-amber-300">{albumSongs.length} Tracks Included</span>
          </div>
        </div>
      </div>

      {/* Album Tracks */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 flex items-center justify-between text-xs font-bold text-gray-700 uppercase">
          <span>Album Tracklist ({albumSongs.length} Songs)</span>
        </div>

        <div className="divide-y divide-gray-100">
          {albumSongs.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500">
              No tracks mapped to this album yet.
            </div>
          ) : (
            albumSongs.map((song, idx) => {
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
                        {song.remixer} • {song.bitrate} • {song.hits.toLocaleString()} Hits
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
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-semibold px-2 py-1.5 rounded border border-gray-300"
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

      {/* Related Albums */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <h3 className="text-xs font-bold text-gray-800 uppercase mb-3 flex items-center gap-1.5">
          <Disc className="w-3.5 h-3.5 text-emerald-700" />
          <span>Related DJ Albums & Compilations</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {otherAlbums.slice(0, 5).map((alb) => (
            <button
              key={alb.id}
              onClick={() => onSelectAlbum(alb)}
              className="p-2.5 rounded border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-left transition flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded bg-gray-200 mb-2 overflow-hidden shadow-xs">
                {alb.coverArt ? (
                  <img src={alb.coverArt} alt={alb.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                ) : (
                  <Disc className="w-8 h-8 m-auto text-gray-400" />
                )}
              </div>
              <span className="text-xs font-bold text-gray-900 group-hover:text-emerald-700 line-clamp-1">
                {alb.name}
              </span>
              <span className="text-[10px] text-gray-500">{alb.artist}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
