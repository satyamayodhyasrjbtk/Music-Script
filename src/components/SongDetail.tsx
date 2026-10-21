import React, { useState } from 'react';
import { Song, Category, Album, Artist, Tag } from '../types/music';
import { 
  ArrowLeft, Download, Play, Pause, Share2, Copy, Check, Disc, 
  Sparkles, Flame, QrCode, PhoneCall, Volume2, ShieldAlert, ExternalLink, 
  Clock, HardDrive, Hash, Folder, User, Tag as TagIcon, ChevronRight,
  FileText, ChevronDown, ChevronUp
} from 'lucide-react';

interface SongDetailProps {
  song: Song;
  allSongs: Song[];
  allCategories: Category[];
  allAlbums: Album[];
  allArtists: Artist[];
  allTags: Tag[];
  isPlaying: boolean;
  onPlaySong: (song: Song) => void;
  onSelectSong: (song: Song) => void;
  onSelectCategory: (cat: Category) => void;
  onSelectAlbum: (album: Album) => void;
  onSelectArtist: (artist: Artist) => void;
  onSelectTag: (tag: Tag) => void;
  onDownloadSong: (song: Song, quality?: '320' | '192' | '128' | 'ringtone') => void;
  onBack: () => void;
}

export const SongDetail: React.FC<SongDetailProps> = ({
  song,
  allSongs,
  allCategories,
  allAlbums,
  allArtists,
  allTags,
  isPlaying,
  onPlaySong,
  onSelectSong,
  onSelectCategory,
  onSelectAlbum,
  onSelectArtist,
  onSelectTag,
  onDownloadSong,
  onBack,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isLyricsExpanded, setIsLyricsExpanded] = useState(true);
  const [lyricsCopied, setLyricsCopied] = useState(false);

  const handleCopyLyrics = () => {
    if (song.lyrics) {
      navigator.clipboard.writeText(song.lyrics);
      setLyricsCopied(true);
      setTimeout(() => setLyricsCopied(false), 2000);
    }
  };

  // Filter related tracks (5-6 items)
  const artistSongs = allSongs.filter(
    (s) => s.id !== song.id && s.singer.toLowerCase() === song.singer.toLowerCase()
  ).slice(0, 6);

  const categorySongs = allSongs.filter(
    (s) => s.id !== song.id && s.category === song.category
  ).slice(0, 6);

  // Find linked category, album, artist
  const currentCategory = allCategories.find(
    (c) => c.name === song.category || c.slug === song.categorySlug
  );
  const currentAlbum = allAlbums.find(
    (a) => a.name === song.album || a.slug === song.albumSlug
  );
  const currentSinger = allArtists.find(
    (a) => a.name.toLowerCase() === song.singer.toLowerCase()
  );
  const currentRemixer = allArtists.find(
    (a) => a.name.toLowerCase() === song.remixer.toLowerCase()
  );

  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://djsongshub.in/song/${song.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsapp = () => {
    const text = encodeURIComponent(`🎵 Download "${song.title}" (${song.bitrate} HQ DJ Remix) by ${song.remixer} here: ${currentUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const shareFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(fbUrl, '_blank', 'width=600,height=450,noopener,noreferrer');
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(`🎵 Download "${song.title}" (${song.bitrate} HQ DJ Remix) by ${song.remixer}`);
    const hashtags = encodeURIComponent(song.tags.slice(0, 3).join(',') || 'DJRemix,Bhojpuri,MP3Download');
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${text}&hashtags=${hashtags}`;
    window.open(twitterUrl, '_blank', 'width=600,height=450,noopener,noreferrer');
  };

  const shareTelegram = () => {
    const text = encodeURIComponent(`🎵 ${song.title} - Free ${song.bitrate} MP3 Download`);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Breadcrumb Navigation with Connected Links */}
      <div className="bg-white px-3.5 py-2.5 rounded-lg border border-gray-200 shadow-sm flex flex-wrap items-center justify-between text-xs text-gray-500 gap-2">
        <div className="flex items-center gap-1.5 overflow-hidden flex-wrap">
          <button onClick={onBack} className="hover:text-emerald-700 font-semibold flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </button>
          <span>&gt;</span>
          {currentCategory ? (
            <button
              onClick={() => onSelectCategory(currentCategory)}
              className="text-gray-600 hover:text-emerald-700 font-medium hover:underline"
            >
              {song.category}
            </button>
          ) : (
            <span className="text-gray-600 font-medium">{song.category}</span>
          )}
          <span>&gt;</span>
          <span className="text-gray-900 font-bold truncate max-w-xs">{song.title}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-emerald-800 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            /song/{song.slug}
          </span>
          <button
            onClick={handleCopyLink}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-semibold px-2.5 py-1 rounded border border-gray-300 flex items-center gap-1 transition"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>

      {/* Main Track Showcase Card (Matching Screenshot 2) */}
      <div className="bg-gradient-to-b from-[#0b5331] to-[#073922] text-white rounded-t-xl p-6 shadow-md border-b-2 border-emerald-400 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Badges */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="bg-emerald-900/90 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded tracking-wider">
            DJ TRACK
          </span>
          <span className="bg-emerald-500 text-emerald-950 text-[10px] font-black px-2.5 py-0.5 rounded shadow">
            320 Kbps Studio
          </span>
          {song.isTrending && (
            <span className="bg-red-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded uppercase flex items-center gap-1">
              <Flame className="w-3 h-3 fill-current" />
              Trending
            </span>
          )}
        </div>

        {/* Center Disc Artwork with animation */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div
              className={`w-28 h-28 rounded-full bg-gradient-to-tr from-gray-950 via-gray-900 to-gray-800 border-4 border-emerald-400/50 shadow-2xl flex items-center justify-center ${
                isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-emerald-800 border-2 border-amber-400 flex items-center justify-center shadow-inner">
                <Disc className="w-6 h-6 text-amber-300" />
              </div>
            </div>
            <button
              onClick={() => onPlaySong(song)}
              className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-emerald-500 text-emerald-950 hover:bg-emerald-400 flex items-center justify-center shadow-lg transition transform hover:scale-110 active:scale-95"
              title={isPlaying ? 'Pause Track' : 'Play Track'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current ml-0.5" />
              )}
            </button>
          </div>
        </div>

        {/* Title & Metadata with Clickable Relations */}
        <div className="text-center space-y-1.5 max-w-xl mx-auto">
          <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-tight">
            {song.title}
          </h1>
          <p className="text-xs text-emerald-200">
            Remixed By:{' '}
            {currentRemixer ? (
              <button
                onClick={() => onSelectArtist(currentRemixer)}
                className="text-white font-bold hover:text-amber-300 underline"
              >
                {song.remixer}
              </button>
            ) : (
              <strong className="text-white font-bold">{song.remixer}</strong>
            )}
          </p>
          <p className="text-xs text-emerald-200">
            Original Singer:{' '}
            {currentSinger ? (
              <button
                onClick={() => onSelectArtist(currentSinger)}
                className="text-emerald-100 hover:text-white underline font-medium"
              >
                {song.singer}
              </button>
            ) : (
              <span className="text-emerald-100">{song.singer}</span>
            )}
          </p>
          {song.album && currentAlbum && (
            <p className="text-[11px] text-amber-300">
              Album:{' '}
              <button
                onClick={() => onSelectAlbum(currentAlbum)}
                className="hover:underline font-bold"
              >
                {song.album}
              </button>
            </p>
          )}
          <div className="text-[11px] text-emerald-300/80 pt-1 flex items-center justify-center gap-3 flex-wrap">
            <span>
              Folder:{' '}
              {currentCategory ? (
                <button
                  onClick={() => onSelectCategory(currentCategory)}
                  className="hover:underline font-semibold text-emerald-200"
                >
                  {song.category}
                </button>
              ) : (
                song.category
              )}
            </span>
            <span>•</span>
            <span>{song.duration}</span>
            <span>•</span>
            <span className="font-bold text-amber-300">{song.hits.toLocaleString()} Hits</span>
          </div>
        </div>
      </div>

      {/* Online Audio Streaming Box */}
      <div className="bg-[#052b1a] text-white p-4 border-x border-b border-emerald-900 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => onPlaySong(song)}
            className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 flex items-center justify-center shrink-0 shadow transition"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 ml-0.5 fill-current" />
            )}
          </button>
          <div>
            <span className="text-xs font-bold text-emerald-300 block">
              Listen Song Online (High Quality)
            </span>
            <span className="text-[11px] text-gray-400">
              {isPlaying ? 'Live WebAudio Synthesized Beat Streaming...' : 'Click to stream 320 Kbps audio preview'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => onDownloadSong(song, '320')}
            className="bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 text-xs font-semibold px-3 py-1.5 rounded border border-emerald-600/50 flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            Save Offline
          </button>
        </div>
      </div>

      {/* Direct Server Download Zone */}
      <div className="bg-white p-5 rounded-b-xl border border-gray-200 shadow-sm text-center">
        <div className="inline-flex items-center gap-1 text-[11px] font-black text-red-600 tracking-wider uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FAST DIRECT SERVER DOWNLOAD LINK</span>
        </div>

        {/* Primary 320 Kbps Master Download Button */}
        <div>
          <button
            onClick={() => onDownloadSong(song, '320')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black text-sm sm:text-base px-8 py-3.5 rounded-lg shadow-md hover:shadow-lg transition transform active:scale-95 group"
          >
            <Download className="w-5 h-5 group-hover:translate-y-0.5 transition" />
            <span>[ Download File Here (320 Kbps HQ) ]</span>
            <span className="bg-red-700/80 text-white text-xs px-2 py-0.5 rounded font-mono ml-1">
              {song.fileSize}
            </span>
          </button>
        </div>
        <p className="text-[11px] text-gray-500 mt-2">
          Click and tap above to download the original master audio file without any ads or survey.
        </p>

        {/* Alternative Quality Downloads */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-xl mx-auto">
          <button
            onClick={() => onDownloadSong(song, '192')}
            className="bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-800 text-xs font-bold py-2.5 px-3 rounded flex items-center justify-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5 text-gray-600" />
            <span>Download 192 Kbps (4.7 MB)</span>
          </button>

          <button
            onClick={() => onDownloadSong(song, '128')}
            className="bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-800 text-xs font-bold py-2.5 px-3 rounded flex items-center justify-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5 text-gray-600" />
            <span>Download 128 Kbps (3.2 MB)</span>
          </button>

          <button
            onClick={() => onDownloadSong(song, 'ringtone')}
            className="bg-amber-400 hover:bg-amber-500 text-amber-950 text-xs font-black py-2.5 px-3 rounded flex items-center justify-center gap-1.5 transition shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-950" />
            <span>Call Ringtone (30s) (1.2 MB)</span>
          </button>
        </div>
      </div>

      {/* Social Share Toolbar with WhatsApp, Facebook, Twitter/X */}
      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5 shrink-0">
          <Share2 className="w-3.5 h-3.5 text-emerald-700" />
          Share This Song:
        </span>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* WhatsApp Share */}
          <button
            onClick={shareWhatsapp}
            className="bg-[#25D366] hover:bg-[#1EBE5D] text-white text-[11px] font-bold px-3 py-1.5 rounded transition flex items-center gap-1.5 shadow-xs"
            title="Share on WhatsApp"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span>WhatsApp</span>
          </button>

          {/* Facebook Share */}
          <button
            onClick={shareFacebook}
            className="bg-[#1877F2] hover:bg-[#166FE5] text-white text-[11px] font-bold px-3 py-1.5 rounded transition flex items-center gap-1.5 shadow-xs"
            title="Share on Facebook"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>Facebook</span>
          </button>

          {/* Twitter / X Share */}
          <button
            onClick={shareTwitter}
            className="bg-[#0f1419] hover:bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded transition flex items-center gap-1.5 shadow-xs"
            title="Share on Twitter / X"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span>Twitter / X</span>
          </button>

          {/* Telegram Share */}
          <button
            onClick={shareTelegram}
            className="bg-[#2AABEE] hover:bg-[#229ED9] text-white text-[11px] font-bold px-3 py-1.5 rounded transition flex items-center gap-1.5 shadow-xs"
            title="Share on Telegram"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
            </svg>
            <span>Telegram</span>
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 text-[11px] font-semibold px-2.5 py-1.5 rounded transition flex items-center gap-1"
            title="Copy Direct Link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>

          {/* Mobile QR */}
          <button
            onClick={() => setShowQrModal(true)}
            className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-[11px] font-semibold px-2.5 py-1.5 rounded transition flex items-center gap-1"
            title="Generate Mobile QR Code"
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-700" />
            <span>QR Code</span>
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full text-center space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Scan to Download on Mobile</h3>
            <div className="bg-gray-50 border p-4 rounded-lg flex items-center justify-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentUrl)}`}
                alt="Song QR Code"
                className="w-44 h-44 mx-auto rounded"
              />
            </div>
            <p className="text-xs text-gray-500">
              Point your smartphone camera at this QR code to open and download immediately.
            </p>
            <button
              onClick={() => setShowQrModal(false)}
              className="w-full bg-emerald-700 text-white font-bold py-2 rounded text-xs hover:bg-emerald-800"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Song Technical Specifications & Info Table with Interactive Relations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-emerald-900 text-white px-4 py-2.5 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wide">
            Song Technical Specifications & Info
          </h2>
          <span className="text-[10px] text-emerald-300 font-mono">
            320kbps-cbr-audio-master
          </span>
        </div>

        <table className="w-full text-xs text-left">
          <tbody className="divide-y divide-gray-100">
            <tr className="hover:bg-gray-50/60">
              <td className="px-4 py-2.5 font-semibold text-gray-500 w-1/3">Song Title:</td>
              <td className="px-4 py-2.5 font-bold text-gray-900">{song.title}</td>
            </tr>
            <tr className="hover:bg-gray-50/60">
              <td className="px-4 py-2.5 font-semibold text-gray-500">DJ / Remixer:</td>
              <td className="px-4 py-2.5 text-emerald-800 font-bold">
                {currentRemixer ? (
                  <button onClick={() => onSelectArtist(currentRemixer)} className="hover:underline">
                    {song.remixer}
                  </button>
                ) : (
                  song.remixer
                )}
              </td>
            </tr>
            <tr className="hover:bg-gray-50/60">
              <td className="px-4 py-2.5 font-semibold text-gray-500">Original Singer:</td>
              <td className="px-4 py-2.5 text-gray-800 font-medium">
                {currentSinger ? (
                  <button onClick={() => onSelectArtist(currentSinger)} className="hover:underline text-emerald-900 font-bold">
                    {song.singer}
                  </button>
                ) : (
                  song.singer
                )}
              </td>
            </tr>
            {song.album && currentAlbum && (
              <tr className="hover:bg-gray-50/60">
                <td className="px-4 py-2.5 font-semibold text-gray-500">Album / Compilation:</td>
                <td className="px-4 py-2.5 text-blue-700 font-bold">
                  <button onClick={() => onSelectAlbum(currentAlbum)} className="hover:underline flex items-center gap-1">
                    <Disc className="w-3.5 h-3.5" />
                    <span>{song.album}</span>
                  </button>
                </td>
              </tr>
            )}
            <tr className="hover:bg-gray-50/60">
              <td className="px-4 py-2.5 font-semibold text-gray-500">Category / Folder:</td>
              <td className="px-4 py-2.5 text-gray-800">
                {currentCategory ? (
                  <button onClick={() => onSelectCategory(currentCategory)} className="text-emerald-800 font-bold hover:underline">
                    {song.category}
                  </button>
                ) : (
                  song.category
                )}
              </td>
            </tr>
            <tr className="hover:bg-gray-50/60">
              <td className="px-4 py-2.5 font-semibold text-gray-500">Tags & Hashtags:</td>
              <td className="px-4 py-2.5">
                <div className="flex flex-wrap gap-1.5">
                  {song.tags.map((tagStr) => {
                    const matchedTag = allTags.find(
                      (t) => t.name.toLowerCase() === tagStr.toLowerCase() || t.slug === tagStr.toLowerCase()
                    ) || {
                      id: tagStr,
                      name: tagStr,
                      slug: tagStr.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                      count: 1,
                    };
                    return (
                      <button
                        key={tagStr}
                        onClick={() => onSelectTag(matchedTag)}
                        className="bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 text-[10px] px-2 py-0.5 rounded border border-gray-200 transition font-medium"
                      >
                        #{tagStr}
                      </button>
                    );
                  })}
                </div>
              </td>
            </tr>
            <tr className="hover:bg-gray-50/60">
              <td className="px-4 py-2.5 font-semibold text-gray-500">File Size:</td>
              <td className="px-4 py-2.5 font-mono text-gray-800">{song.fileSize}</td>
            </tr>
            <tr className="hover:bg-gray-50/60">
              <td className="px-4 py-2.5 font-semibold text-gray-500">Audio Bitrate:</td>
              <td className="px-4 py-2.5 text-red-600 font-bold">
                {song.bitrate} Constant Bit Rate (CBR)
              </td>
            </tr>
            <tr className="hover:bg-gray-50/60">
              <td className="px-4 py-2.5 font-semibold text-gray-500">Duration:</td>
              <td className="px-4 py-2.5 font-mono text-gray-800">{song.duration}</td>
            </tr>
            <tr className="hover:bg-gray-50/60">
              <td className="px-4 py-2.5 font-semibold text-gray-500">Total Downloads:</td>
              <td className="px-4 py-2.5 text-emerald-700 font-black">
                {song.hits.toLocaleString()} Hits
              </td>
            </tr>
            <tr className="hover:bg-gray-50/60">
              <td className="px-4 py-2.5 font-semibold text-gray-500">Release Year & Date:</td>
              <td className="px-4 py-2.5 text-gray-800">{song.releaseYear} ({song.releaseDate})</td>
            </tr>
            <tr className="hover:bg-gray-50/60">
              <td className="px-4 py-2.5 font-semibold text-gray-500">Tempo & Rhythm:</td>
              <td className="px-4 py-2.5 text-gray-800">{song.tempo}</td>
            </tr>
            <tr className="hover:bg-gray-50/60">
              <td className="px-4 py-2.5 font-semibold text-gray-500">Song Lyrics / Bol:</td>
              <td className="px-4 py-2.5">
                {song.lyrics ? (
                  <button
                    onClick={() => {
                      setIsLyricsExpanded(true);
                      const el = document.getElementById('lyrics-container-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 text-emerald-800 hover:text-emerald-950 font-bold bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded border border-emerald-300 transition text-xs cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Full Lyrics Available (Click to View)</span>
                  </button>
                ) : (
                  <span className="text-gray-400 italic">Not available</span>
                )}
              </td>
            </tr>
            <tr className="hover:bg-gray-50/60">
              <td className="px-4 py-2.5 font-semibold text-gray-500">Direct Song URL:</td>
              <td className="px-4 py-2.5 text-blue-600 break-all font-mono text-[11px]">
                <a href={currentUrl} className="underline hover:text-blue-800">
                  {currentUrl}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Expandable Song Lyrics Section with Scrollable Container */}
      <div id="lyrics-container-section" className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Expandable Header Banner */}
        <div className="bg-gradient-to-r from-[#073922] via-[#0b5331] to-[#0e613b] text-white px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setIsLyricsExpanded(!isLyricsExpanded)}
            className="flex items-center gap-2.5 hover:opacity-95 transition text-left cursor-pointer group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-900/90 border border-emerald-400/30 flex items-center justify-center text-amber-300 shadow-sm group-hover:scale-105 transition">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wide text-white">
                  Song Lyrics &amp; Bol (गीत के बोल)
                </h2>
                <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded shadow-xs uppercase">
                  Lyrics
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/90">
                Official Hindi / Bhojpuri verified lyrics &amp; stanzas
              </p>
            </div>
          </button>

          <div className="flex items-center gap-2">
            {song.lyrics && isLyricsExpanded && (
              <button
                type="button"
                onClick={handleCopyLyrics}
                className="bg-emerald-800 hover:bg-emerald-700 text-emerald-100 text-[11px] font-semibold px-2.5 py-1.5 rounded border border-emerald-600/60 flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                title="Copy full song lyrics to clipboard"
              >
                {lyricsCopied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{lyricsCopied ? 'Lyrics Copied!' : 'Copy Lyrics'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsLyricsExpanded(!isLyricsExpanded)}
              className="bg-black/30 hover:bg-black/50 text-white text-xs font-semibold px-3 py-1.5 rounded border border-emerald-400/30 flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>{isLyricsExpanded ? 'Hide Lyrics' : 'Show Lyrics'}</span>
              {isLyricsExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable Body */}
        {isLyricsExpanded && (
          <div className="p-4 sm:p-5 bg-gradient-to-b from-emerald-50/20 via-white to-white">
            {song.lyrics ? (
              <div className="space-y-3">
                {/* Track subtitle bar */}
                <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 pb-2 border-b border-gray-100 gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-gray-700">Song:</span>
                    <span className="font-bold text-gray-900">{song.title}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span>Singer: <strong className="text-emerald-800">{song.singer}</strong></span>
                    <span>•</span>
                    <span>DJ Remixer: <strong className="text-gray-800">{song.remixer}</strong></span>
                  </div>
                </div>

                {/* Scrollable Container for Song Lyrics */}
                <div className="relative rounded-lg border border-emerald-100 bg-[#fbfdfb] p-4 shadow-inner">
                  <div className="max-h-80 overflow-y-auto pr-3 text-xs sm:text-sm text-gray-800 leading-relaxed font-sans whitespace-pre-line space-y-1 select-text scrollbar-thin scrollbar-thumb-emerald-200 scrollbar-track-transparent">
                    {song.lyrics}
                  </div>
                </div>

                {/* Bottom action bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                  <span className="text-[11px] text-gray-400">
                    Scroll inside the box to read all verses, chorus, and DJ drops.
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyLyrics}
                      className="text-xs text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      {lyricsCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{lyricsCopied ? 'Copied!' : 'Copy All Bol'}</span>
                    </button>
                    <span className="text-gray-300">•</span>
                    <button
                      type="button"
                      onClick={() => {
                        const snippet = song.lyrics ? song.lyrics.slice(0, 300) : song.title;
                        const text = encodeURIComponent(`🎵 Lyrics of "${song.title}":\n\n${snippet}...\n\nRead full lyrics & download song on: ${currentUrl}`);
                        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
                      }}
                      className="text-xs text-green-600 hover:text-green-800 font-bold hover:underline cursor-pointer"
                    >
                      Share Lyrics on WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 px-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <FileText className="w-9 h-9 text-gray-400 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-gray-700">Lyrics Not Yet Transcribed</h4>
                <p className="text-[11px] text-gray-500 mt-1 max-w-md mx-auto">
                  The lyrics for &ldquo;{song.title}&rdquo; are currently being transcribed. You can add or edit lyrics for this track through the Admin Panel.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 1. Related Songs by Artist (5-6 items) */}
      {artistSongs.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-[#0b5331] text-white px-4 py-2 flex items-center justify-between text-xs font-bold">
            <span>Related Songs by Artist: {song.singer}</span>
            <span className="text-[10px] text-emerald-200 font-mono">
              {artistSongs.length} Tracks
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {artistSongs.map((aSong) => (
              <div
                key={aSong.id}
                className="p-2.5 flex items-center justify-between text-xs hover:bg-gray-50 transition"
              >
                <div>
                  <button
                    onClick={() => onSelectSong(aSong)}
                    className="font-bold text-gray-900 hover:text-emerald-700 text-left block hover:underline"
                  >
                    {aSong.title}
                  </button>
                  <span className="text-[10px] text-gray-400">
                    {aSong.bitrate} • {aSong.fileSize}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectSong(aSong)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-semibold px-2 py-1 rounded border border-gray-300"
                  >
                    View Page
                  </button>
                  <button
                    onClick={() => onDownloadSong(aSong, '320')}
                    className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-2.5 py-1 rounded"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Related DJ Songs From this Category (5-6 items) */}
      {categorySongs.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 flex items-center justify-between text-xs font-bold text-gray-800 border-b border-gray-200">
            <span>Related DJ Songs From '{song.category}'</span>
            {currentCategory && (
              <button
                onClick={() => onSelectCategory(currentCategory)}
                className="text-emerald-700 text-[10px] hover:underline flex items-center gap-0.5"
              >
                <span>View Category</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="divide-y divide-gray-100">
            {categorySongs.map((cSong) => (
              <div
                key={cSong.id}
                className="p-2.5 flex items-center justify-between text-xs hover:bg-gray-50 transition"
              >
                <div>
                  <button
                    onClick={() => onSelectSong(cSong)}
                    className="font-bold text-gray-900 hover:text-emerald-700 text-left block hover:underline"
                  >
                    {cSong.title}
                  </button>
                  <span className="text-[10px] text-gray-400">
                    DJ: {cSong.remixer} • {cSong.hits.toLocaleString()} Hits
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectSong(cSong)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-semibold px-2 py-1 rounded border border-gray-300"
                  >
                    View Page
                  </button>
                  <button
                    onClick={() => onDownloadSong(cSong, '320')}
                    className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-2.5 py-1 rounded"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Related Albums (5-6 items) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-xs font-bold text-gray-800 uppercase mb-3 flex items-center gap-1.5">
          <Disc className="w-3.5 h-3.5 text-emerald-700" />
          <span>Related DJ Albums & Compilations</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {allAlbums.slice(0, 6).map((alb) => (
            <button
              key={alb.id}
              onClick={() => onSelectAlbum(alb)}
              className="p-2 rounded border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-center transition group flex flex-col items-center"
            >
              <div className="w-14 h-14 rounded bg-gray-100 mb-1.5 overflow-hidden shadow-xs">
                {alb.coverArt ? (
                  <img src={alb.coverArt} alt={alb.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                ) : (
                  <Disc className="w-7 h-7 m-auto text-gray-400" />
                )}
              </div>
              <span className="text-[11px] font-bold text-gray-900 group-hover:text-emerald-700 line-clamp-1">
                {alb.name}
              </span>
              <span className="text-[9px] text-gray-500">{alb.songCount} Tracks</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Related Categories & Folders (5-6 items) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-xs font-bold text-gray-800 uppercase mb-3 flex items-center gap-1.5">
          <Folder className="w-3.5 h-3.5 text-emerald-700" />
          <span>Related Music Folders & Categories</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {allCategories.slice(0, 6).map((cat) => (
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
