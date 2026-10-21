import React from 'react';
import { SitePanel, Song, Category, Artist, Tag } from '../types/music';
import { 
  Play, Pause, Download, Folder, Bell, Flame, Disc, Zap, 
  ExternalLink, ChevronRight, Sparkles, Radio, ArrowRight, ShieldCheck,
  CheckCircle2, Music
} from 'lucide-react';

interface SitePanelsProps {
  panels: SitePanel[];
  placement?: 'home_top' | 'home_middle' | 'home_bottom' | 'all';
  songs: Song[];
  categories: Category[];
  artists: Artist[];
  tags: Tag[];
  currentSong: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song) => void;
  onSelectSong: (song: Song) => void;
  onSelectCategory: (category: Category) => void;
  onSelectArtist: (artist: Artist) => void;
  onDownloadSong: (song: Song, quality: '320' | '192' | '128' | 'ringtone') => void;
  onOpenAdminPanels?: () => void;
}

export const SitePanels: React.FC<SitePanelsProps> = ({
  panels,
  placement = 'all',
  songs,
  categories,
  artists,
  tags,
  currentSong,
  isPlaying,
  onPlaySong,
  onSelectSong,
  onSelectCategory,
  onSelectArtist,
  onDownloadSong,
  onOpenAdminPanels,
}) => {
  // Filter panels matching placement and active state
  const activePanels = panels
    .filter((p) => p.isActive)
    .filter((p) => placement === 'all' || p.placement === placement || p.placement === 'all')
    .sort((a, b) => a.order - b.order);

  if (activePanels.length === 0) return null;

  const getThemeStyles = (theme: SitePanel['theme']) => {
    switch (theme) {
      case 'crimson':
        return {
          headerBg: 'bg-gradient-to-r from-red-700 to-rose-900 text-white',
          border: 'border-red-200',
          badge: 'bg-red-500 text-white',
          button: 'bg-red-600 hover:bg-red-700 text-white',
          accent: 'text-red-700',
        };
      case 'neon':
        return {
          headerBg: 'bg-gradient-to-r from-cyan-900 to-blue-900 text-white',
          border: 'border-cyan-200',
          badge: 'bg-cyan-400 text-slate-950 font-black',
          button: 'bg-cyan-600 hover:bg-cyan-700 text-white',
          accent: 'text-cyan-600',
        };
      case 'amber':
        return {
          headerBg: 'bg-gradient-to-r from-amber-600 to-orange-700 text-white',
          border: 'border-amber-200',
          badge: 'bg-amber-400 text-amber-950 font-black',
          button: 'bg-amber-600 hover:bg-amber-700 text-white',
          accent: 'text-amber-700',
        };
      case 'slate':
        return {
          headerBg: 'bg-gradient-to-r from-slate-800 to-gray-900 text-white',
          border: 'border-gray-200',
          badge: 'bg-slate-700 text-white',
          button: 'bg-slate-800 hover:bg-slate-700 text-white',
          accent: 'text-slate-800',
        };
      case 'purple':
        return {
          headerBg: 'bg-gradient-to-r from-purple-800 to-indigo-900 text-white',
          border: 'border-purple-200',
          badge: 'bg-purple-400 text-purple-950 font-black',
          button: 'bg-purple-700 hover:bg-purple-600 text-white',
          accent: 'text-purple-700',
        };
      case 'emerald':
      default:
        return {
          headerBg: 'bg-gradient-to-r from-[#0b5331] to-[#073922] text-white',
          border: 'border-emerald-200',
          badge: 'bg-emerald-400 text-emerald-950 font-black',
          button: 'bg-[#0b5331] hover:bg-[#073922] text-white',
          accent: 'text-[#0b5331]',
        };
    }
  };

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'flame':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'bell':
        return <Bell className="w-4 h-4 text-amber-300" />;
      case 'disc':
        return <Disc className="w-4 h-4 text-cyan-300" />;
      case 'zap':
        return <Zap className="w-4 h-4 text-yellow-300" />;
      case 'radio':
        return <Radio className="w-4 h-4 text-emerald-300" />;
      case 'folder':
        return <Folder className="w-4 h-4 text-yellow-300" />;
      case 'music':
      default:
        return <Music className="w-4 h-4 text-emerald-300" />;
    }
  };

  return (
    <div className="space-y-4">
      {activePanels.map((panel) => {
        const theme = getThemeStyles(panel.theme);

        return (
          <div
            key={panel.id}
            className={`bg-white rounded-lg border ${theme.border} shadow-sm overflow-hidden transition hover:shadow`}
          >
            {/* Panel Header */}
            <div className={`${theme.headerBg} px-3.5 py-2.5 flex items-center justify-between gap-2 border-b border-white/10`}>
              <div className="flex items-center gap-2 min-w-0">
                <span className="p-1 rounded bg-white/10 shrink-0">
                  {getIcon(panel.icon)}
                </span>
                <div className="truncate">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-xs sm:text-sm font-bold truncate">
                      {panel.title}
                    </h3>
                    {panel.badge && (
                      <span className={`${theme.badge} text-[10px] uppercase px-1.5 py-0.5 rounded shadow-sm tracking-wider`}>
                        {panel.badge}
                      </span>
                    )}
                  </div>
                  {panel.subtitle && (
                    <p className="text-[11px] text-white/80 truncate font-normal">
                      {panel.subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Admin Panel Quick Action */}
              {onOpenAdminPanels && (
                <button
                  onClick={onOpenAdminPanels}
                  title="Edit this panel in Admin Panel"
                  className="shrink-0 text-[10px] bg-white/20 hover:bg-white/30 text-white font-semibold px-2 py-1 rounded flex items-center gap-1 transition"
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-300" />
                  <span className="hidden sm:inline">Panel #{panel.order}</span>
                </button>
              )}
            </div>

            {/* Panel Content based on Type */}
            <div className="p-3">
              {/* TYPE 1: NOTICE / ANNOUNCEMENT */}
              {panel.type === 'notice' && (
                <div className="space-y-2.5">
                  <div className="text-xs text-gray-700 leading-relaxed bg-amber-50/70 border border-amber-200/60 p-3 rounded-md flex items-start gap-2.5">
                    <Bell className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-medium text-gray-800">
                        {panel.customHtml || 'Official Announcements & Notification Board'}
                      </p>
                    </div>
                  </div>
                  {panel.actionUrl && (
                    <div className="flex items-center justify-end">
                      <a
                        href={panel.actionUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded ${theme.button} transition shadow-sm`}
                      >
                        {panel.actionText || 'Open Link'}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* TYPE 2: SONGS LIST PANEL */}
              {panel.type === 'songs' && (() => {
                let displaySongs = [...songs];
                if (panel.filterCategory) {
                  displaySongs = displaySongs.filter((s) => s.category === panel.filterCategory);
                }
                if (panel.filterTag) {
                  displaySongs = displaySongs.filter((s) => s.tags?.includes(panel.filterTag!));
                }
                if (panel.songsSort === 'trending') {
                  displaySongs.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0) || b.hits - a.hits);
                } else if (panel.songsSort === 'hits') {
                  displaySongs.sort((a, b) => b.hits - a.hits);
                } else {
                  displaySongs.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
                }

                const limit = panel.itemLimit || 4;
                const limitedSongs = displaySongs.slice(0, limit);

                return (
                  <div className="space-y-1.5">
                    {limitedSongs.map((song, idx) => {
                      const isCurrentActive = currentSong?.id === song.id;
                      return (
                        <div
                          key={song.id}
                          className={`flex items-center justify-between p-2 rounded-md border text-xs transition ${
                            isCurrentActive
                              ? 'bg-emerald-50 border-emerald-300'
                              : 'bg-gray-50/70 border-gray-200/80 hover:bg-emerald-50/40 hover:border-emerald-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <span className="w-5 text-center font-bold text-gray-400 text-[11px]">
                              {idx + 1}.
                            </span>
                            <button
                              onClick={() => onPlaySong(song)}
                              aria-label={isCurrentActive && isPlaying ? "Pause song" : "Play song"}
                              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition ${
                                isCurrentActive && isPlaying
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                              }`}
                            >
                              {isCurrentActive && isPlaying ? (
                                <Pause className="w-3.5 h-3.5" />
                              ) : (
                                <Play className="w-3.5 h-3.5 ml-0.5" />
                              )}
                            </button>
                            <div className="min-w-0">
                              <button
                                onClick={() => onSelectSong(song)}
                                className="font-semibold text-gray-900 hover:text-emerald-700 text-left truncate block max-w-xs sm:max-w-md"
                              >
                                {song.title}
                              </button>
                              <div className="flex items-center gap-2 text-[10px] text-gray-500 flex-wrap">
                                <span className="text-emerald-700 font-bold">{song.remixer}</span>
                                <span>•</span>
                                <span className="bg-emerald-100 text-emerald-800 px-1 rounded font-bold">{song.bitrate}</span>
                                <span>•</span>
                                <span>{song.duration}</span>
                                <span>•</span>
                                <span>{song.fileSize}</span>
                                {song.tempo && (
                                  <>
                                    <span>•</span>
                                    <span className="text-indigo-600 font-medium">{song.tempo}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => onDownloadSong(song, '320')}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded flex items-center gap-1 shadow-sm transition"
                              title="Download MP3 320Kbps"
                            >
                              <Download className="w-3 h-3" />
                              <span className="hidden sm:inline">Download</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {limitedSongs.length === 0 && (
                      <p className="text-xs text-gray-500 py-3 text-center">No songs available for this panel criteria.</p>
                    )}
                  </div>
                );
              })()}

              {/* TYPE 3: CATEGORY FOLDERS */}
              {panel.type === 'categories' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {categories.slice(0, panel.itemLimit || 6).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => onSelectCategory(cat)}
                      className="flex items-center justify-between p-2.5 rounded-md bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 transition text-left group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Folder className="w-4 h-4 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 group-hover:text-emerald-800 truncate">
                            {cat.name}
                          </p>
                          <p className="text-[10px] text-gray-500 truncate">{cat.description}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded ml-2 shrink-0">
                        {cat.count} Tracks
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* TYPE 4: DJ ARTISTS SHOWCASE */}
              {panel.type === 'artists' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {artists.slice(0, panel.itemLimit || 4).map((art) => (
                    <button
                      key={art.id}
                      onClick={() => onSelectArtist(art)}
                      className="bg-gray-50 hover:bg-emerald-50 p-2.5 rounded-lg border border-gray-200 hover:border-emerald-300 transition text-center group flex flex-col items-center"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 mb-1.5 border border-emerald-300 group-hover:scale-105 transition-transform">
                        {art.image ? (
                          <img src={art.image} alt={art.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-emerald-800 text-white font-bold text-xs">
                            DJ
                          </div>
                        )}
                      </div>
                      <p className="text-xs font-bold text-gray-900 group-hover:text-emerald-700 truncate w-full">
                        {art.name}
                      </p>
                      <span className="text-[10px] text-gray-500 mt-0.5">
                        {art.trackCount} Official Tracks
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* TYPE 5: BANNER / PROMOTION / TELEGRAM */}
              {panel.type === 'banner' && (
                <div className="p-3 bg-gradient-to-r from-gray-50 to-emerald-50/50 rounded-lg border border-emerald-200/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="space-y-1 text-center sm:text-left">
                    <p className="text-xs font-bold text-gray-900">
                      {panel.customHtml || 'Special VIP Channel & Direct Download Updates'}
                    </p>
                    <p className="text-[11px] text-gray-600">
                      Instant audio updates • 320Kbps Master Sound • No Ads Link
                    </p>
                  </div>
                  {panel.actionUrl && (
                    <a
                      href={panel.actionUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-md ${theme.button} transition shadow shrink-0`}
                    >
                      {panel.actionText || 'Join VIP Channel'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}

              {/* TYPE 6: QUICK LINKS / TAGS */}
              {panel.type === 'quick_links' && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="text-xs bg-gray-100 hover:bg-emerald-100 text-gray-800 hover:text-emerald-900 px-2.5 py-1 rounded-md border border-gray-200 cursor-pointer transition font-medium"
                    >
                      #{tag.name} ({tag.count})
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
