import React from 'react';
import { Artist, Song } from '../types/music';
import { User, ArrowLeft, Download, Play, Pause, Music, Mic2, Disc, ChevronRight } from 'lucide-react';

interface ArtistDetailProps {
  artist: Artist;
  songs: Song[];
  allArtists: Artist[];
  isPlaying: boolean;
  currentSong: Song | null;
  onPlaySong: (song: Song) => void;
  onSelectSong: (song: Song) => void;
  onSelectArtist: (artist: Artist) => void;
  onDownloadSong: (song: Song) => void;
  onBack: () => void;
}

export const ArtistDetail: React.FC<ArtistDetailProps> = ({
  artist,
  songs,
  allArtists,
  isPlaying,
  currentSong,
  onPlaySong,
  onSelectSong,
  onSelectArtist,
  onDownloadSong,
  onBack,
}) => {
  const artistSongs = songs.filter(
    (s) =>
      s.singer.toLowerCase().includes(artist.name.toLowerCase()) ||
      s.remixer.toLowerCase().includes(artist.name.toLowerCase()) ||
      s.singerSlug === artist.slug ||
      s.remixerSlug === artist.slug
  );

  const otherArtists = allArtists.filter((a) => a.id !== artist.id);

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
          <span className="text-gray-500">Artists</span>
          <span>&gt;</span>
          <span className="text-gray-900 font-bold truncate">{artist.name}</span>
        </div>
        <span className="text-[10px] text-emerald-800 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          /artist/{artist.slug}
        </span>
      </div>

      {/* Artist Profile Header */}
      <div className="bg-gradient-to-r from-[#0b5331] to-[#062c1a] text-white p-5 rounded-lg shadow-sm border-b-2 border-emerald-400 flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <div className="w-24 h-24 rounded-full bg-emerald-950 border-2 border-emerald-400/60 shadow-xl overflow-hidden shrink-0 flex items-center justify-center">
          {artist.image ? (
            <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-12 h-12 text-emerald-300" />
          )}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="bg-emerald-800 text-emerald-200 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase flex items-center gap-1">
              {artist.role === 'dj' ? <Disc className="w-3 h-3" /> : <Mic2 className="w-3 h-3" />}
              {artist.role === 'dj' ? 'Official DJ Remixer' : 'Playback Artist / Singer'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">{artist.name}</h1>
          <p className="text-xs text-emerald-200/90 leading-relaxed max-w-xl">{artist.bio}</p>
          <div className="text-[11px] text-emerald-300 font-semibold pt-1">
            Total Songs on Portal: <strong className="text-white">{artistSongs.length} Tracks</strong>
          </div>
        </div>
      </div>

      {/* Track List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 flex items-center justify-between text-xs font-bold text-gray-700 uppercase">
          <span>Popular Tracks by {artist.name}</span>
          <span className="text-[10px] text-gray-400">{artistSongs.length} Files</span>
        </div>

        <div className="divide-y divide-gray-100">
          {artistSongs.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500">
              No tracks uploaded under this artist name.
            </div>
          ) : (
            artistSongs.map((song, idx) => {
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
                        {song.category} • {song.bitrate} • {song.hits.toLocaleString()} Hits
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

      {/* Related Artists */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <h3 className="text-xs font-bold text-gray-800 uppercase mb-3 flex items-center gap-1.5">
          <Mic2 className="w-3.5 h-3.5 text-emerald-700" />
          <span>More Artists & DJ Producers</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {otherArtists.slice(0, 4).map((art) => (
            <button
              key={art.id}
              onClick={() => onSelectArtist(art)}
              className="p-3 rounded border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-center transition group flex flex-col items-center"
            >
              <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 mb-2 shadow-xs">
                {art.image ? (
                  <img src={art.image} alt={art.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                ) : (
                  <User className="w-8 h-8 m-auto text-gray-400" />
                )}
              </div>
              <span className="text-xs font-bold text-gray-900 group-hover:text-emerald-700 line-clamp-1">
                {art.name}
              </span>
              <span className="text-[10px] text-gray-400 uppercase">{art.role}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
