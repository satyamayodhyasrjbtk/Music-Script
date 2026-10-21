import React, { useEffect, useState } from 'react';
import { Song } from '../types/music';
import { Download, CheckCircle2, ShieldCheck, Sparkles, X, FileMusic } from 'lucide-react';
import { generatePlayableAudioBlob, triggerFileDownload } from '../utils/audioEngine';

interface DownloadModalProps {
  song: Song;
  quality: '320' | '192' | '128' | 'ringtone';
  onClose: () => void;
  onIncrementHit: (songId: string) => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  song,
  quality,
  onClose,
  onIncrementHit,
}) => {
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const qualityLabels = {
    '320': '320 Kbps HQ Studio Master',
    '192': '192 Kbps Standard Audio',
    '128': '128 Kbps Mobile Data Saver',
    'ringtone': '30s Loud Call Ringtone Cut',
  };

  useEffect(() => {
    // Increment hit counter immediately
    onIncrementHit(song.id);

    // Fast simulated download progress
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsCompleted(true);
          // Generate playable audio file blob and trigger browser download
          const blob = generatePlayableAudioBlob(song.title, quality === 'ringtone' ? 10 : 20);
          const cleanName = `[DjSongsHub.In]_${song.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_${quality}Kbps.wav`;
          triggerFileDownload(cleanName, blob);
          return 100;
        }
        return prev + 25;
      });
    }, 250);

    return () => clearInterval(timer);
  }, [song, quality]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full space-y-4 text-center border border-gray-200">
        <div className="flex justify-between items-center pb-2 border-b">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Fast Cloud CDN Direct Downloader</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-2">
          <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-3">
            {isCompleted ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            ) : (
              <Download className="w-8 h-8 text-red-600 animate-bounce" />
            )}
          </div>

          <h3 className="text-sm font-black text-gray-900 leading-snug">{song.title}</h3>
          <p className="text-xs text-gray-500 mt-1">
            DJ: <strong className="text-emerald-700">{song.remixer}</strong> • {qualityLabels[quality]}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-gray-500 font-semibold">
            <span>{isCompleted ? 'File Downloaded Successfully!' : 'Connecting to Server...'}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-red-600 h-full transition-all duration-200 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-gray-50 border rounded-lg p-2.5 text-[11px] text-gray-600 text-left space-y-1">
          <div className="flex items-center gap-1 text-emerald-700 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Clean Direct Download: 100% Virus Free & No Survey</span>
          </div>
          <p className="text-gray-500">
            File format: High definition master audio file ({song.fileSize}) with embedded ID3 tags.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 rounded text-xs transition"
        >
          {isCompleted ? 'Done / Close' : 'Cancel'}
        </button>
      </div>
    </div>
  );
};
