import React, { useState } from 'react';
import { UserProfile, Song } from '../types/music';
import { User, Heart, Download, Music, Youtube, Check, Send, Sparkles, Shield, ArrowLeft } from 'lucide-react';

interface UserPanelProps {
  user: UserProfile;
  favoriteSongs: Song[];
  onPlaySong: (song: Song) => void;
  onSelectSong: (song: Song) => void;
  onRequestSong: (req: { title: string; youtubeUrl: string; notes: string }) => void;
  onBack: () => void;
  onSwitchToAdmin: () => void;
}

export const UserPanel: React.FC<UserPanelProps> = ({
  user,
  favoriteSongs,
  onPlaySong,
  onSelectSong,
  onRequestSong,
  onBack,
  onSwitchToAdmin,
}) => {
  const [ytUrl, setYtUrl] = useState('');
  const [detectedTitle, setDetectedTitle] = useState('');
  const [userNotes, setUserNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Auto extract YouTube Title or Video ID preview
  const handleYtChange = (url: string) => {
    setYtUrl(url);
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      const videoId = match[2];
      // Simulated automatic title extraction from URL / Video ID
      const cleanedSample = url.includes('pawan')
        ? 'Pawan Singh - New Roadshow DJ Remix 2026'
        : url.includes('sapna')
        ? 'Sapna Choudhary - Car Subwoofer Blast'
        : `YouTube DJ Track #${videoId.substring(0, 6)} (Auto-detected)`;
      setDetectedTitle(cleanedSample);
    } else {
      setDetectedTitle('');
    }
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ytUrl.trim() && !detectedTitle.trim()) return;

    onRequestSong({
      title: detectedTitle || 'Requested YouTube Track',
      youtubeUrl: ytUrl,
      notes: userNotes,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setYtUrl('');
      setDetectedTitle('');
      setUserNotes('');
    }, 2500);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Breadcrumbs */}
      <div className="bg-white px-3.5 py-2.5 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between text-xs text-gray-500">
        <button onClick={onBack} className="hover:text-emerald-700 font-semibold flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          Home
        </button>
        <span className="text-gray-900 font-bold">User Dashboard</span>
      </div>

      {/* User Header Profile */}
      <div className="bg-gradient-to-r from-[#0b5331] to-[#073922] text-white p-5 rounded-lg shadow-sm border-b-2 border-emerald-400 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-16 h-16 rounded-full bg-emerald-700/80 border-2 border-emerald-400 flex items-center justify-center shrink-0 shadow">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white">{user.name}</h1>
              <span className="bg-emerald-400 text-emerald-950 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">{user.email}</p>
            <p className="text-[11px] text-emerald-300/80">Member since {user.joinedDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSwitchToAdmin}
            className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 border border-emerald-500/40"
          >
            <Shield className="w-3.5 h-3.5 text-amber-300" />
            <span>Open Admin Panel</span>
          </button>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-sm text-center">
          <Heart className="w-5 h-5 text-pink-500 mx-auto mb-1" />
          <span className="text-[10px] text-gray-500 uppercase font-semibold">Favorites</span>
          <p className="text-xl font-black text-gray-800">{favoriteSongs.length}</p>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-sm text-center">
          <Download className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
          <span className="text-[10px] text-gray-500 uppercase font-semibold">Downloads</span>
          <p className="text-xl font-black text-emerald-700">{user.downloadsCount}</p>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-sm text-center">
          <Music className="w-5 h-5 text-blue-600 mx-auto mb-1" />
          <span className="text-[10px] text-gray-500 uppercase font-semibold">Track Requests</span>
          <p className="text-xl font-black text-blue-700">{user.uploadedTracksCount}</p>
        </div>
      </div>

      {/* YouTube Paste & Auto Song Request Feature */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b">
          <Youtube className="w-5 h-5 text-red-600" />
          <div>
            <h3 className="text-sm font-bold text-gray-800">
              Paste YouTube Link & Request Song
            </h3>
            <p className="text-[11px] text-gray-400">
              Paste any YouTube song or remix link to auto-detect title and request a 320Kbps audio master.
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded text-xs font-semibold text-center flex items-center justify-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Song request received! Our studio DJs are processing the 320Kbps HQ audio cut.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmitRequest} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold mb-1">YouTube Video / Song URL *</label>
              <input
                type="text"
                value={ytUrl}
                onChange={(e) => handleYtChange(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:border-emerald-600 outline-none"
              />
            </div>

            {detectedTitle && (
              <div className="bg-amber-50 border border-amber-200 p-2.5 rounded text-amber-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <span className="text-[10px] font-bold uppercase block text-amber-700">Auto-detected Title:</span>
                  <span className="font-bold text-xs">{detectedTitle}</span>
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold mb-1">Custom Notes / DJ Remix Style (optional)</label>
              <input
                type="text"
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="e.g. Please mix with heavy competition dholki bass and high frequency treble"
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs"
              />
            </div>

            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-2 px-5 rounded text-xs transition flex items-center gap-1.5 shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Song Request</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
