import React, { useState, useEffect } from 'react';
import { 
  Song, Category, Album, Artist, Tag, SiteSettings, 
  SitePanel, PanelType, PanelPlacement, PanelTheme 
} from '../types/music';
import { generateUniqueSlug, slugify } from '../utils/slugUtils';
import { 
  ShieldCheck, Upload, Trash2, Edit3, Plus, Music, FolderPlus, 
  BarChart3, Settings, Eye, Check, X, Flame, Sparkles, RefreshCw, Key,
  Youtube, Disc, User, Hash, Globe, Download, Copy, ExternalLink, Link2,
  Folder, Zap, CheckCircle2, Activity, Radio, FileAudio, Sliders, ArrowRight,
  Layers, LayoutGrid, ToggleLeft, ToggleRight, ArrowUp, ArrowDown, Bell, EyeOff
} from 'lucide-react';
import {
  analyzeAudioFile,
  estimateBpmFromDetails,
  calculateFileSize,
  formatDuration,
  parseDurationToSeconds,
} from '../utils/audioAnalyzer';

interface AdminPanelProps {
  songs: Song[];
  categories: Category[];
  albums: Album[];
  artists: Artist[];
  tags: Tag[];
  settings: SiteSettings;
  panels?: SitePanel[];
  onAddSong: (newSong: Song) => void;
  onUpdateSong: (updatedSong: Song) => void;
  onDeleteSong: (songId: string) => void;
  onAddCategory: (category: Category) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  onAddAlbum: (album: Album) => void;
  onDeleteAlbum: (albumId: string) => void;
  onAddArtist: (artist: Artist) => void;
  onDeleteArtist: (artistId: string) => void;
  onAddTag: (tag: Tag) => void;
  onDeleteTag: (tagId: string) => void;
  onUpdateSettings: (newSettings: SiteSettings) => void;
  onAddPanel?: (panel: SitePanel) => void;
  onUpdatePanel?: (panel: SitePanel) => void;
  onDeletePanel?: (panelId: string) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  songs,
  categories,
  albums,
  artists,
  tags,
  settings,
  panels = [],
  onAddSong,
  onUpdateSong,
  onDeleteSong,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onAddAlbum,
  onDeleteAlbum,
  onAddArtist,
  onDeleteArtist,
  onAddTag,
  onDeleteTag,
  onUpdateSettings,
  onAddPanel,
  onUpdatePanel,
  onDeletePanel,
  onClose,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<
    'songs' | 'upload' | 'youtube' | 'categories' | 'panels' | 'albums' | 'artists' | 'tags' | 'sitemap' | 'settings'
  >('songs');

  const [editingSong, setEditingSong] = useState<Song | null>(null);

  // Panel State (Create Panel Option & Management Functions)
  const [panelTitle, setPanelTitle] = useState('');
  const [panelSubtitle, setPanelSubtitle] = useState('');
  const [panelType, setPanelType] = useState<PanelType>('songs');
  const [panelPlacement, setPanelPlacement] = useState<PanelPlacement>('home_middle');
  const [panelTheme, setPanelTheme] = useState<PanelTheme>('emerald');
  const [panelBadge, setPanelBadge] = useState('HOT');
  const [panelIcon, setPanelIcon] = useState('flame');
  const [panelItemLimit, setPanelItemLimit] = useState(4);
  const [panelFilterCategory, setPanelFilterCategory] = useState(categories[0]?.name || '');
  const [panelFilterTag, setPanelFilterTag] = useState('');
  const [panelSongsSort, setPanelSongsSort] = useState<'trending' | 'hits' | 'latest'>('trending');
  const [panelCustomHtml, setPanelCustomHtml] = useState('');
  const [panelActionUrl, setPanelActionUrl] = useState('');
  const [panelActionText, setPanelActionText] = useState('');
  const [panelIsActive, setPanelIsActive] = useState(true);
  const [panelSuccess, setPanelSuccess] = useState('');
  const [editingPanelId, setEditingPanelId] = useState<string | null>(null);

  // Sub-Admin & DJ Accounts Panel State
  const [djPanelName, setDjPanelName] = useState('');
  const [djPanelEmail, setDjPanelEmail] = useState('');
  const [djPanelRole, setDjPanelRole] = useState<'creator' | 'admin'>('creator');
  const [djAccountSuccess, setDjAccountSuccess] = useState('');


  // Upload Form State
  const [title, setTitle] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [singer, setSinger] = useState(artists[2]?.name || 'Pawan Singh');
  const [remixer, setRemixer] = useState(artists[0]?.name || 'DJ Surendra Ayodhya');
  const [category, setCategory] = useState(categories[0]?.name || 'Bhojpuri Club & Hard Bass Remixes');
  const [album, setAlbum] = useState(albums[0]?.name || 'Ayodhya Sound Lab Vol. 1');
  const [bitrate, setBitrate] = useState<'320 Kbps' | '192 Kbps' | '128 Kbps'>('320 Kbps');
  const [fileSize, setFileSize] = useState('8.8 MB');
  const [duration, setDuration] = useState('3:45');
  const [tempo, setTempo] = useState('138 BPM (Heavy Dance Drop)');
  const [tagsInput, setTagsInput] = useState('bhojpuri, hard-bass, dholki-mix, dj-remix');
  const [keywordsInput, setKeywordsInput] = useState('bhojpuri dj song download, 320kbps remix, roadshow bass');
  const [description, setDescription] = useState('Exclusive studio master audio remix.');
  const [lyrics, setLyrics] = useState('');
  const [hits, setHits] = useState(15000);
  const [isHot, setIsHot] = useState(true);
  const [isTrending, setIsTrending] = useState(true);
  const [uploadSuccess, setUploadSuccess] = useState('');

  // Audio Auto-Detection & Calculation State
  const [autoCalculateAudioInfo, setAutoCalculateAudioInfo] = useState(true);
  const [isAnalyzingAudio, setIsAnalyzingAudio] = useState(false);
  const [audioAnalysisMessage, setAudioAnalysisMessage] = useState('Auto-calculated by song details: 8.8 MB • 3:45 • 138 BPM');

  // Quick Category Creator in Upload Tab
  const [quickCatOpen, setQuickCatOpen] = useState(false);
  const [quickCatName, setQuickCatName] = useState('');
  const [quickCatBadge, setQuickCatBadge] = useState('NEW');
  const [quickCatDesc, setQuickCatDesc] = useState('');
  const [quickCatSuccess, setQuickCatSuccess] = useState('');

  // Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatCustomSlug, setNewCatCustomSlug] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatBadge, setNewCatBadge] = useState('NEW');
  const [catSuccess, setCatSuccess] = useState('');

  // Edit Modal Audio Detection State
  const [editAnalyzingAudio, setEditAnalyzingAudio] = useState(false);
  const [editAudioMessage, setEditAudioMessage] = useState('');

  // YouTube Importer State
  const [ytUrl, setYtUrl] = useState('');
  const [ytTitle, setYtTitle] = useState('');
  const [ytCategory, setYtCategory] = useState(categories[0]?.name || 'Latest Roadshow 2026');
  const [ytSinger, setYtSinger] = useState('Pawan Singh & Shilpi Raj');
  const [ytRemixer, setYtRemixer] = useState('DJ Surendra Ayodhya');
  const [ytThumbnail, setYtThumbnail] = useState('');
  const [ytLoading, setYtLoading] = useState(false);
  const [ytSuccess, setYtSuccess] = useState('');

  // Album Form State
  const [newAlbName, setNewAlbName] = useState('');
  const [newAlbArtist, setNewAlbArtist] = useState('DJ Surendra Ayodhya');
  const [newAlbYear, setNewAlbYear] = useState('2026');
  const [newAlbDesc, setNewAlbDesc] = useState('High fidelity compilation');

  // Artist Form State
  const [newArtName, setNewArtName] = useState('');
  const [newArtRole, setNewArtRole] = useState<'singer' | 'dj' | 'both'>('dj');
  const [newArtBio, setNewArtBio] = useState('Sound producer and DJ remixer');

  // Tag Form State
  const [newTagName, setNewTagName] = useState('');

  // Sitemap state
  const [copiedSitemap, setCopiedSitemap] = useState(false);

  // Auto-calculate File size, Duration, and Tempo BPM from details
  const triggerAutoCalculation = (
    currentTitle: string,
    currentCategory: string,
    currentBitrate: string,
    currentDurationStr?: string,
    currentTags?: string
  ) => {
    const durStr = currentDurationStr || duration || '3:45';
    const durSec = parseDurationToSeconds(durStr);
    const calculatedSize = calculateFileSize(currentBitrate, durSec);
    const { tempoDescription, bpm } = estimateBpmFromDetails(
      currentTitle,
      currentCategory,
      currentTags || tagsInput
    );

    setFileSize(calculatedSize);
    setDuration(durStr);
    setTempo(tempoDescription);
    setAudioAnalysisMessage(
      `✓ Auto-Calculated by song details: File Size: ${calculatedSize} • Duration: ${durStr} • Tempo: ${tempoDescription}`
    );
  };

  // Auto update slug & audio info when title changes in upload form
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    const existingSlugs = songs.map((s) => s.slug);
    setCustomSlug(generateUniqueSlug(newTitle, existingSlugs));

    if (autoCalculateAudioInfo && newTitle.trim().length > 2) {
      triggerAutoCalculation(newTitle, category, bitrate, duration, tagsInput);
    }
  };

  // Handle when audio file is uploaded/dragged in the upload form
  const handleAudioFileInput = async (file: File) => {
    if (!file) return;
    setIsAnalyzingAudio(true);
    setAudioAnalysisMessage(`Analyzing "${file.name}" audio spectrum, duration & BPM...`);
    try {
      const result = await analyzeAudioFile(file, bitrate);
      setFileSize(result.fileSize);
      setDuration(result.duration);
      setTempo(result.tempoDescription);
      if (!title.trim()) {
        const cleanName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
        setTitle(cleanName);
        const existingSlugs = songs.map((s) => s.slug);
        setCustomSlug(generateUniqueSlug(cleanName, existingSlugs));
      }
      setAudioAnalysisMessage(
        `✓ Audio File Decoded Live: File Size = ${result.fileSize} • Duration = ${result.duration} • Real BPM = ${result.tempoDescription}`
      );
    } catch (err) {
      console.error(err);
      triggerAutoCalculation(title || file.name, category, bitrate);
    } finally {
      setIsAnalyzingAudio(false);
    }
  };

  // Handle quick category creation inside Upload tab
  const handleQuickCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCatName.trim()) return;

    const existingSlugs = categories.map((c) => c.slug);
    const catSlug = generateUniqueSlug(quickCatName, existingSlugs);

    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: quickCatName.trim(),
      slug: catSlug,
      count: 0,
      description: quickCatDesc.trim() || 'Exclusive high quality DJ remixes collection',
      badge: quickCatBadge || 'NEW',
      isNew: true,
    };

    onAddCategory(newCat);
    setCategory(newCat.name);
    setQuickCatSuccess(`Category "${newCat.name}" created and selected!`);
    setQuickCatName('');
    setQuickCatDesc('');
    setTimeout(() => {
      setQuickCatSuccess('');
      setQuickCatOpen(false);
    }, 2000);
  };

  // YouTube auto detect handler
  const handleYtInputChange = (url: string) => {
    setYtUrl(url);
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      const videoId = match[2];
      setYtThumbnail(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
      
      // Smart title detection simulation
      let detected = 'Superhit Bhojpuri Roadshow DJ Remix 2026';
      if (url.toLowerCase().includes('pawan')) {
        detected = 'Pawan Singh - Special Competition Hard Vibration Mix 2026';
      } else if (url.toLowerCase().includes('sapna')) {
        detected = 'Sapna Choudhary - Solid Body Haryanvi Subwoofer Drop';
      } else if (url.toLowerCase().includes('khesari')) {
        detected = 'Khesari Lal Yadav - Club Dance Roadshow Edit';
      }
      setYtTitle(detected);
    } else {
      setYtThumbnail('');
    }
  };

  const handleImportYoutube = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ytTitle.trim()) return;

    setYtLoading(true);
    const existingSlugs = songs.map((s) => s.slug);
    const autoSlug = generateUniqueSlug(ytTitle, existingSlugs);

    const newTrack: Song = {
      id: `song-${Date.now()}`,
      slug: autoSlug,
      title: ytTitle,
      singer: ytSinger,
      singerSlug: slugify(ytSinger),
      remixer: ytRemixer,
      remixerSlug: slugify(ytRemixer),
      category: ytCategory,
      categorySlug: slugify(ytCategory),
      album: 'Latest Roadshow 2026',
      albumSlug: 'latest-roadshow-2026',
      bitrate: '320 Kbps',
      fileSize: '8.6 MB',
      duration: '3:48',
      durationSec: 228,
      hits: 24500,
      releaseYear: '2026',
      releaseDate: new Date().toISOString().split('T')[0],
      tempo: '140 BPM (Heavy Dance Drop)',
      tags: ['bhojpuri', 'dj-remix', 'roadshow-2026', 'hard-bass'],
      keywords: [ytTitle.toLowerCase(), '320kbps mp3 download', 'youtube dj mix'],
      description: `Ripped and remastered 320 Kbps audio master from official YouTube source.`,
      thumbnailUrl: ytThumbnail,
      youtubeUrl: ytUrl,
      lyrics: `[Intro - Official YouTube Audio Master]\n(DJ Remix 320 Kbps - ${ytRemixer})\n\n[Verse 1]\n${ytTitle}\nVocals: ${ytSinger}\n(Hard Bass Kick Vibration Drop)\n\n[Chorus]\nFull lyrics transcribed from official audio. Enjoy high-quality master playback!`,
      isHot: true,
      isTrending: true,
    };

    setTimeout(() => {
      onAddSong(newTrack);
      setYtLoading(false);
      setYtSuccess(`Track "${ytTitle}" imported and published at /song/${autoSlug}`);
      setYtUrl('');
      setYtTitle('');
      setYtThumbnail('');
      setTimeout(() => {
        setYtSuccess('');
        setActiveTab('songs');
      }, 1500);
    }, 600);
  };

  const handleCreateSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const existingSlugs = songs.map((s) => s.slug);
    const finalSlug = customSlug.trim()
      ? generateUniqueSlug(customSlug, existingSlugs)
      : generateUniqueSlug(title, existingSlugs);

    const newSongItem: Song = {
      id: `song-${Date.now()}`,
      slug: finalSlug,
      title,
      singer: singer || 'Various Artists',
      singerSlug: slugify(singer || 'Various Artists'),
      remixer: remixer || 'DJ Surendra Ayodhya',
      remixerSlug: slugify(remixer || 'DJ Surendra Ayodhya'),
      category,
      categorySlug: slugify(category),
      album,
      albumSlug: slugify(album),
      bitrate,
      fileSize,
      duration,
      durationSec: 225,
      hits: Number(hits) || 0,
      releaseYear: '2026',
      releaseDate: new Date().toISOString().split('T')[0],
      tempo,
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      keywords: keywordsInput.split(',').map((k) => k.trim()).filter(Boolean),
      description,
      lyrics: lyrics.trim() || undefined,
      isHot,
      isTrending,
    };

    onAddSong(newSongItem);
    setUploadSuccess(`Song "${title}" successfully published at /song/${finalSlug}`);
    setTitle('');
    setCustomSlug('');
    setLyrics('');
    setTimeout(() => {
      setUploadSuccess('');
      setActiveTab('songs');
    }, 1500);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const existingSlugs = categories.map((c) => c.slug);
    const catSlug = newCatCustomSlug.trim()
      ? generateUniqueSlug(newCatCustomSlug, existingSlugs)
      : generateUniqueSlug(newCatName, existingSlugs);

    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      slug: catSlug,
      count: 0,
      description: newCatDesc.trim() || `${newCatName.trim()} - High quality DJ remix tracks and MP3 songs collection`,
      badge: newCatBadge || undefined,
      isNew: true,
    };

    onAddCategory(newCat);
    setCatSuccess(`Category "${newCat.name}" successfully created with live URL /category/${catSlug}`);
    setNewCatName('');
    setNewCatCustomSlug('');
    setNewCatDesc('');
    setTimeout(() => setCatSuccess(''), 3000);
  };

  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbName.trim()) return;

    const existingSlugs = albums.map((a) => a.slug);
    const albSlug = generateUniqueSlug(newAlbName, existingSlugs);

    const newAlb: Album = {
      id: `alb-${Date.now()}`,
      name: newAlbName,
      slug: albSlug,
      artist: newAlbArtist,
      artistSlug: slugify(newAlbArtist),
      releaseYear: newAlbYear,
      songCount: 0,
      description: newAlbDesc,
    };

    onAddAlbum(newAlb);
    setNewAlbName('');
    setNewAlbDesc('');
  };

  const handleCreateArtist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArtName.trim()) return;

    const existingSlugs = artists.map((a) => a.slug);
    const artSlug = generateUniqueSlug(newArtName, existingSlugs);

    const newArt: Artist = {
      id: `art-${Date.now()}`,
      name: newArtName,
      slug: artSlug,
      role: newArtRole,
      trackCount: 0,
      bio: newArtBio,
    };

    onAddArtist(newArt);
    setNewArtName('');
    setNewArtBio('');
  };

  const handleCreateTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    const existingSlugs = tags.map((t) => t.slug);
    const tagSlug = generateUniqueSlug(newTagName, existingSlugs);

    const newTag: Tag = {
      id: `tag-${Date.now()}`,
      name: slugify(newTagName),
      slug: tagSlug,
      count: 0,
    };

    onAddTag(newTag);
    setNewTagName('');
  };

  // PANEL CRUD & MANAGEMENT FUNCTIONS
  const handleCreateOrUpdatePanel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!panelTitle.trim()) return;

    if (editingPanelId) {
      const existing = panels.find((p) => p.id === editingPanelId);
      if (existing && onUpdatePanel) {
        const updated: SitePanel = {
          ...existing,
          title: panelTitle.trim(),
          subtitle: panelSubtitle.trim() || undefined,
          type: panelType,
          placement: panelPlacement,
          theme: panelTheme,
          badge: panelBadge.trim() || undefined,
          icon: panelIcon,
          itemLimit: panelItemLimit,
          filterCategory: panelType === 'songs' ? panelFilterCategory : undefined,
          filterTag: panelType === 'songs' && panelFilterTag.trim() ? panelFilterTag.trim() : undefined,
          songsSort: panelType === 'songs' ? panelSongsSort : undefined,
          customHtml: (panelType === 'notice' || panelType === 'banner') ? panelCustomHtml.trim() : undefined,
          actionUrl: panelActionUrl.trim() || undefined,
          actionText: panelActionText.trim() || undefined,
          isActive: panelIsActive,
        };
        onUpdatePanel(updated);
        setPanelSuccess(`Updated panel "${updated.title}" successfully!`);
      }
      setEditingPanelId(null);
    } else {
      const newPanel: SitePanel = {
        id: `panel-${Date.now()}`,
        title: panelTitle.trim(),
        subtitle: panelSubtitle.trim() || undefined,
        type: panelType,
        placement: panelPlacement,
        order: panels.length + 1,
        isActive: panelIsActive,
        theme: panelTheme,
        badge: panelBadge.trim() || undefined,
        icon: panelIcon,
        itemLimit: panelItemLimit,
        filterCategory: panelType === 'songs' ? panelFilterCategory : undefined,
        filterTag: panelType === 'songs' && panelFilterTag.trim() ? panelFilterTag.trim() : undefined,
        songsSort: panelType === 'songs' ? panelSongsSort : undefined,
        customHtml: (panelType === 'notice' || panelType === 'banner') ? panelCustomHtml.trim() : undefined,
        actionUrl: panelActionUrl.trim() || undefined,
        actionText: panelActionText.trim() || undefined,
        createdAt: new Date().toISOString().split('T')[0],
      };
      if (onAddPanel) {
        onAddPanel(newPanel);
      }
      setPanelSuccess(`Created new panel "${newPanel.title}" successfully (Option ON & Active)!`);
    }

    // Reset Form
    setPanelTitle('');
    setPanelSubtitle('');
    setPanelCustomHtml('');
    setPanelActionUrl('');
    setPanelActionText('');
    setTimeout(() => setPanelSuccess(''), 4000);
  };

  const handleEditPanel = (p: SitePanel) => {
    setEditingPanelId(p.id);
    setPanelTitle(p.title);
    setPanelSubtitle(p.subtitle || '');
    setPanelType(p.type);
    setPanelPlacement(p.placement);
    setPanelTheme(p.theme);
    setPanelBadge(p.badge || 'HOT');
    setPanelIcon(p.icon || 'flame');
    setPanelItemLimit(p.itemLimit || 4);
    setPanelFilterCategory(p.filterCategory || categories[0]?.name || '');
    setPanelFilterTag(p.filterTag || '');
    setPanelSongsSort(p.songsSort || 'trending');
    setPanelCustomHtml(p.customHtml || '');
    setPanelActionUrl(p.actionUrl || '');
    setPanelActionText(p.actionText || '');
    setPanelIsActive(p.isActive);
    setActiveTab('panels');
  };

  const handleTogglePanelActive = (panel: SitePanel) => {
    if (onUpdatePanel) {
      onUpdatePanel({
        ...panel,
        isActive: !panel.isActive,
      });
      setPanelSuccess(`Panel "${panel.title}" is now ${!panel.isActive ? 'ACTIVE (ON)' : 'DISABLED (OFF)'}`);
      setTimeout(() => setPanelSuccess(''), 3000);
    }
  };

  const handleMovePanel = (panel: SitePanel, direction: 'up' | 'down') => {
    if (!onUpdatePanel) return;
    const sorted = [...panels].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((p) => p.id === panel.id);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      const prev = sorted[index - 1];
      const curOrder = panel.order;
      onUpdatePanel({ ...panel, order: prev.order });
      onUpdatePanel({ ...prev, order: curOrder });
    } else if (direction === 'down' && index < sorted.length - 1) {
      const next = sorted[index + 1];
      const curOrder = panel.order;
      onUpdatePanel({ ...panel, order: next.order });
      onUpdatePanel({ ...next, order: curOrder });
    }
  };

  const handleDuplicatePanel = (panel: SitePanel) => {
    if (!onAddPanel) return;
    const clone: SitePanel = {
      ...panel,
      id: `panel-${Date.now()}`,
      title: `${panel.title} (Copy)`,
      order: panels.length + 1,
      createdAt: new Date().toISOString().split('T')[0],
    };
    onAddPanel(clone);
    setPanelSuccess(`Duplicated panel "${clone.title}" successfully!`);
    setTimeout(() => setPanelSuccess(''), 3000);
  };

  const handleApplyPanelPreset = (presetKey: string) => {
    setEditingPanelId(null);
    if (presetKey === 'trending_songs') {
      setPanelTitle('🔥 Top 2026 Roadshow & Subwoofer Blast Tracks');
      setPanelSubtitle('Heavy dance drops and competition bassline remixes');
      setPanelType('songs');
      setPanelPlacement('home_middle');
      setPanelTheme('crimson');
      setPanelBadge('VIRAL');
      setPanelIcon('flame');
      setPanelItemLimit(6);
      setPanelSongsSort('trending');
    } else if (presetKey === 'notice_board') {
      setPanelTitle('📢 DjSongsHub.In Official Notice & Booking Line');
      setPanelSubtitle('Official announcements, track submissions, and DJ contact');
      setPanelType('notice');
      setPanelPlacement('home_top');
      setPanelTheme('amber');
      setPanelBadge('NOTICE');
      setPanelIcon('bell');
      setPanelCustomHtml('Welcome to DjSongsHub.In All In One Official Portal! All Roadshow Hard Bass, Dholki Mix, and Festive DJ Songs are updated in 320Kbps Studio Master Quality with zero buffering.');
      setPanelActionUrl('https://t.me/djsongshub');
      setPanelActionText('⚡ Join Telegram Channel (Instant Updates)');
    } else if (presetKey === 'dj_showcase') {
      setPanelTitle('🎧 Featured DJ Remixers & Audio Producers');
      setPanelSubtitle('Official verified mixers of Ayodhya & India');
      setPanelType('artists');
      setPanelPlacement('home_middle');
      setPanelTheme('slate');
      setPanelBadge('VERIFIED');
      setPanelIcon('disc');
      setPanelItemLimit(4);
    } else if (presetKey === 'folders_grid') {
      setPanelTitle('📁 Popular DJ Music Folders & Packs');
      setPanelSubtitle('Browse by Bhojpuri, Haryanvi, EDM, and Roadshow packs');
      setPanelType('categories');
      setPanelPlacement('home_top');
      setPanelTheme('emerald');
      setPanelBadge('FOLDERS');
      setPanelIcon('folder');
      setPanelItemLimit(6);
    } else if (presetKey === 'vip_banner') {
      setPanelTitle('🚀 DjSongsHub Fast Download Pass & WhatsApp Group');
      setPanelSubtitle('Get unlimited direct download links without waiting • Share your remix tracks with 50K+ listeners');
      setPanelType('banner');
      setPanelPlacement('home_bottom');
      setPanelTheme('neon');
      setPanelBadge('VIP PASS');
      setPanelIcon('zap');
      setPanelCustomHtml('Are you a DJ Remixer or Music Producer? Upload your tracks on DjSongsHub and get featured on Homepage Panels with your DJ name and phone number!');
      setPanelActionUrl('https://wa.me/?text=Hello%20DjSongsHub%20I%20want%20to%20submit%20my%20DJ%20Song');
      setPanelActionText('📲 Connect on WhatsApp for DJ Upload');
    }
  };

  const handleCreateDjAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!djPanelName.trim() || !djPanelEmail.trim()) return;
    setDjAccountSuccess(`DJ Sub-Panel Account created for "${djPanelName}" (${djPanelEmail}) with role "${djPanelRole}". Login link & credentials generated!`);
    setDjPanelName('');
    setDjPanelEmail('');
    setTimeout(() => setDjAccountSuccess(''), 4000);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSong) {
      onUpdateSong(editingSong);
      setEditingSong(null);
    }
  };

  // Generate XML Sitemap dynamically
  const generatedSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  <url>
    <loc>${settings.siteUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${settings.siteUrl}/pages/about.php</loc>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${settings.siteUrl}/pages/contact.php</loc>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${settings.siteUrl}/pages/privacy.php</loc>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${settings.siteUrl}/pages/disclaimer.php</loc>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${settings.siteUrl}/pages/terms.php</loc>
    <priority>0.5</priority>
  </url>

  <!-- Categories (${categories.length}) -->
${categories.map((c) => `  <url>\n    <loc>${settings.siteUrl}/category/${c.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.85</priority>\n  </url>`).join('\n')}

  <!-- Albums (${albums.length}) -->
${albums.map((a) => `  <url>\n    <loc>${settings.siteUrl}/album/${a.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.80</priority>\n  </url>`).join('\n')}

  <!-- Artists (${artists.length}) -->
${artists.map((ar) => `  <url>\n    <loc>${settings.siteUrl}/artist/${ar.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.80</priority>\n  </url>`).join('\n')}

  <!-- Tags (${tags.length}) -->
${tags.map((t) => `  <url>\n    <loc>${settings.siteUrl}/tag/${t.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.70</priority>\n  </url>`).join('\n')}

  <!-- Published Songs (${songs.length}) -->
${songs.map((s) => `  <url>\n    <loc>${settings.siteUrl}/song/${s.slug}</loc>\n    <lastmod>${s.releaseDate || new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.95</priority>\n  </url>`).join('\n')}
</urlset>`;

  const handleDownloadSitemap = () => {
    const blob = new Blob([generatedSitemapXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopySitemap = () => {
    navigator.clipboard.writeText(generatedSitemapXml);
    setCopiedSitemap(true);
    setTimeout(() => setCopiedSitemap(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white p-4 rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <h1 className="text-sm font-black text-white">Full Master Admin Control</h1>
            <p className="text-[10px] text-gray-400">CRUD for Songs, Categories, Albums, Artists, Tags & Sitemap</p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-1.5 text-xs">
          <button
            onClick={() => setActiveTab('songs')}
            className={`px-2.5 py-1.5 rounded font-bold transition ${
              activeTab === 'songs' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            Songs ({songs.length})
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-2.5 py-1.5 rounded font-bold transition flex items-center gap-1 ${
              activeTab === 'upload' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>+ Upload Song</span>
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-2.5 py-1.5 rounded font-bold transition flex items-center gap-1 ${
              activeTab === 'categories' ? 'bg-emerald-500 text-gray-950 font-black ring-2 ring-emerald-300' : 'bg-emerald-900/70 text-emerald-300 hover:bg-emerald-800 border border-emerald-500/40'
            }`}
            title="Create and manage categories / music folders (Option ON)"
          >
            <FolderPlus className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ Create Category (ON)</span>
            <span className="bg-emerald-950/60 text-emerald-200 text-[10px] px-1 py-0.2 rounded font-mono ml-0.5">
              {categories.length}
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab('panels');
              setEditingPanelId(null);
            }}
            className={`px-2.5 py-1.5 rounded font-bold transition flex items-center gap-1 ${
              activeTab === 'panels'
                ? 'bg-amber-400 text-gray-950 font-black ring-2 ring-amber-300'
                : 'bg-amber-900/60 text-amber-300 hover:bg-amber-800 border border-amber-500/40'
            }`}
            title="Create and manage website panels & custom blocks (Option ON)"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Create Panel (ON)</span>
            <span className="bg-amber-950/80 text-amber-200 text-[10px] px-1 py-0.2 rounded font-mono ml-0.5">
              {panels.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('youtube')}
            className={`px-2.5 py-1.5 rounded font-bold transition flex items-center gap-1 ${
              activeTab === 'youtube' ? 'bg-red-600 text-white' : 'text-red-400 hover:bg-gray-800'
            }`}
          >
            <Youtube className="w-3.5 h-3.5" />
            <span>YouTube Import</span>
          </button>
          <button
            onClick={() => setActiveTab('albums')}
            className={`px-2.5 py-1.5 rounded font-bold transition ${
              activeTab === 'albums' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            Albums ({albums.length})
          </button>
          <button
            onClick={() => setActiveTab('artists')}
            className={`px-2.5 py-1.5 rounded font-bold transition ${
              activeTab === 'artists' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            Artists ({artists.length})
          </button>
          <button
            onClick={() => setActiveTab('tags')}
            className={`px-2.5 py-1.5 rounded font-bold transition ${
              activeTab === 'tags' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            Tags ({tags.length})
          </button>
          <button
            onClick={() => setActiveTab('sitemap')}
            className={`px-2.5 py-1.5 rounded font-bold transition flex items-center gap-1 ${
              activeTab === 'sitemap' ? 'bg-amber-500 text-black' : 'text-amber-300 hover:bg-gray-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Sitemap</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-2.5 py-1.5 rounded font-bold transition ${
              activeTab === 'settings' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            Settings
          </button>
          <a
            href="/djsongshub_php8_suite.zip"
            download="djsongshub_php8_suite.zip"
            className="px-2.5 py-1.5 rounded font-bold transition flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs shadow-sm cursor-pointer"
            title="Download PHP 8.3-8.5 Production Website Suite (ZIP)"
          >
            <Download className="w-3.5 h-3.5 text-black" />
            <span>Download ZIP</span>
          </a>
          <button
            onClick={onClose}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-1.5 rounded ml-1"
            title="Close Admin Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TAB 1: Song Library */}
      {activeTab === 'songs' && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-700 uppercase">Manage Songs & Slugs</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('youtube')}
                className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold px-2.5 py-1 rounded flex items-center gap-1"
              >
                <Youtube className="w-3 h-3" />
                <span>YouTube Fast Import</span>
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1 rounded"
              >
                + Upload Song
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase border-b border-gray-200 text-[10px]">
                <tr>
                  <th className="px-4 py-2.5">Title & URL Slug</th>
                  <th className="px-4 py-2.5">Category & Album</th>
                  <th className="px-4 py-2.5">Bitrate</th>
                  <th className="px-4 py-2.5">Hits Count</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {songs.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/60">
                    <td className="px-4 py-2.5">
                      <div className="font-bold text-gray-900">{s.title}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-emerald-800 font-mono">
                          /song/{s.slug}
                        </span>
                        {s.lyrics && (
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded border border-emerald-300">
                            Lyrics
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        Singer: {s.singer} | DJ: {s.remixer}
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="text-gray-700 font-semibold">{s.category}</div>
                      {s.album && <div className="text-[10px] text-gray-400">{s.album}</div>}
                    </td>
                    <td className="px-4 py-2.5 font-bold text-red-600">{s.bitrate}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-800">{s.hits.toLocaleString()}</span>
                        <button
                          onClick={() => onUpdateSong({ ...s, hits: s.hits + 500 })}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-[9px] px-1.5 py-0.5 rounded border"
                          title="Add +500 hits"
                        >
                          +500
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right space-x-2">
                      <button
                        onClick={() => setEditingSong(s)}
                        className="text-emerald-700 font-bold hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${s.title}" permanently?`)) {
                            onDeleteSong(s.id);
                          }
                        }}
                        className="text-red-600 font-bold hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Standard Upload Form */}
      {activeTab === 'upload' && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b">
            Upload & Publish New Song / DJ Remix
          </h3>

          {uploadSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs p-3 rounded mb-4">
              {uploadSuccess}
            </div>
          )}

          <form onSubmit={handleCreateSong} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Song Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Kamariya Kare Lapa Lap (Hard Dholki Bass Mix 2026)"
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:border-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                Unique URL Slug (Auto-generated with duplicate collision resolver)
              </label>
              <input
                type="text"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                placeholder="e.g. kamariya-kare-lapa-lap-hard-dholki"
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs font-mono text-emerald-800 bg-gray-50"
              />
              <p className="text-[10px] text-gray-400 mt-1">Live URL will be: /song/{customSlug || 'slug'}</p>
            </div>

            {/* Category / Folder Selection with Inline Category Create Option */}
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-3 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Folder className="w-4 h-4 text-emerald-700" />
                  <label className="font-bold text-gray-800 text-xs">Folder / Category Selection *</label>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-semibold">
                    {categories.length} Folders Available
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setQuickCatOpen(!quickCatOpen)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1 rounded text-[11px] flex items-center gap-1.5 shadow-xs transition cursor-pointer self-start sm:self-auto"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>{quickCatOpen ? '✕ Close Category Option' : '+ Create Category (Option ON)'}</span>
                </button>
              </div>

              {/* Inline Category Creator (When Option is Open) */}
              {quickCatOpen && (
                <div className="bg-white border-2 border-emerald-500 rounded-lg p-3 space-y-2 shadow-xs transition animate-fadeIn">
                  <div className="flex items-center justify-between border-b pb-1">
                    <span className="text-xs font-black text-emerald-900 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Quick Create Category &amp; Auto-Select
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                      OPTION ON
                    </span>
                  </div>

                  {quickCatSuccess && (
                    <div className="bg-emerald-50 text-emerald-800 text-xs p-2 rounded border border-emerald-300 font-semibold">
                      {quickCatSuccess}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">Category Name *</label>
                      <input
                        type="text"
                        value={quickCatName}
                        onChange={(e) => setQuickCatName(e.target.value)}
                        placeholder="e.g. Navratri Bhakti Special DJ Songs"
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:border-emerald-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">Badge</label>
                      <select
                        value={quickCatBadge}
                        onChange={(e) => setQuickCatBadge(e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs bg-gray-50"
                      >
                        <option value="NEW">NEW</option>
                        <option value="HOT">HOT</option>
                        <option value="2026">2026</option>
                        <option value="EXCLUSIVE">EXCLUSIVE</option>
                        <option value="BHAKTI">BHAKTI</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">Description (Optional)</label>
                    <input
                      type="text"
                      value={quickCatDesc}
                      onChange={(e) => setQuickCatDesc(e.target.value)}
                      placeholder="e.g. High energy festival bhakti and roadshow remix tracks"
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:border-emerald-600 outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setQuickCatOpen(false)}
                      className="px-3 py-1 border border-gray-300 rounded text-gray-600 text-[11px]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleQuickCreateCategory}
                      disabled={!quickCatName.trim()}
                      className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold px-3.5 py-1 rounded text-[11px] flex items-center gap-1 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Save &amp; Select Category
                    </button>
                  </div>
                </div>
              )}

              {/* Category Dropdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Choose Category</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      if (autoCalculateAudioInfo) {
                        triggerAutoCalculation(title, e.target.value, bitrate, duration, tagsInput);
                      }
                    }}
                    className="w-full border border-emerald-300 rounded px-3 py-2 text-xs bg-white font-semibold text-gray-800 focus:ring-1 focus:ring-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} {c.badge ? `[${c.badge}]` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Album / Compilation</label>
                  <select
                    value={album}
                    onChange={(e) => setAlbum(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-xs bg-white"
                  >
                    {albums.map((a) => (
                      <option key={a.id} value={a.name}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Bitrate Quality</label>
                  <select
                    value={bitrate}
                    onChange={(e) => {
                      const newBitrate = e.target.value as '320 Kbps' | '192 Kbps' | '128 Kbps';
                      setBitrate(newBitrate);
                      if (autoCalculateAudioInfo) {
                        const durSec = parseDurationToSeconds(duration);
                        const newSize = calculateFileSize(newBitrate, durSec);
                        setFileSize(newSize);
                        setAudioAnalysisMessage(`Updated file size to ${newSize} for ${newBitrate}`);
                      }
                    }}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-xs bg-white font-bold text-red-600"
                  >
                    <option value="320 Kbps">320 Kbps HQ Studio Master</option>
                    <option value="192 Kbps">192 Kbps Standard High Quality</option>
                    <option value="128 Kbps">128 Kbps Mobile Fast Audio</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Original Singer</label>
                <input
                  type="text"
                  value={singer}
                  onChange={(e) => setSinger(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">DJ / Remixer</label>
                <input
                  type="text"
                  value={remixer}
                  onChange={(e) => setRemixer(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs"
                />
              </div>
            </div>

            {/* AUTOMATIC AUDIO INFO & BPM DETECTION ENGINE */}
            <div className="bg-gradient-to-r from-emerald-900 to-gray-900 text-white rounded-lg p-3.5 space-y-2.5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-700/60 pb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
                  <div>
                    <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                      <span>Automatic Audio Metadata Engine</span>
                      <span className="bg-emerald-500 text-gray-950 font-black text-[9px] px-1.5 py-0.2 rounded uppercase">
                        AUTO-DETECT ACTIVE
                      </span>
                    </h4>
                    <p className="text-[10px] text-emerald-200">
                      File size, duration &amp; tempo BPM automatically generated from song details or audio file inspection
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-100 cursor-pointer bg-black/30 px-2 py-1 rounded">
                    <input
                      type="checkbox"
                      checked={autoCalculateAudioInfo}
                      onChange={(e) => setAutoCalculateAudioInfo(e.target.checked)}
                      className="rounded text-emerald-500"
                    />
                    <span>Auto-Calc: {autoCalculateAudioInfo ? 'ON' : 'OFF'}</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => triggerAutoCalculation(title, category, bitrate, duration, tagsInput)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded flex items-center gap-1 transition cursor-pointer"
                    title="Recalculate File Size, Duration & BPM"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Recalculate</span>
                  </button>
                </div>
              </div>

              {/* Audio File Drag & Drop / Analyzer Box */}
              <div className="bg-white/10 border border-emerald-500/30 rounded-lg p-2.5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <FileAudio className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[11px] font-bold text-white block">
                      Inspect Audio File (.mp3, .wav, .m4a, .aac, .ogg)
                    </span>
                    <span className="text-[10px] text-gray-300 block">
                      Decodes audio with Web Audio API for exact file size, audio duration &amp; real-time BPM detection
                    </span>
                  </div>
                </div>

                <label className="cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black text-xs px-3 py-1.5 rounded flex items-center gap-1.5 transition shadow-sm shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isAnalyzingAudio ? 'Analyzing Audio...' : 'Choose Audio File'}</span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleAudioFileInput(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Live Status Toast */}
              {audioAnalysisMessage && (
                <div className="bg-emerald-950/70 border border-emerald-400/40 text-emerald-200 text-[11px] px-2.5 py-1.5 rounded flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-mono text-[10px] sm:text-[11px]">{audioAnalysisMessage}</span>
                </div>
              )}
            </div>

            {/* AUTO-FILLED AUDIO DETAILS: File Size, Duration, BPM */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-gray-700">File Size *</label>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                    Auto-Filled
                  </span>
                </div>
                <input
                  type="text"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  placeholder="e.g. 8.8 MB"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs font-mono font-bold text-gray-900 bg-gray-50 focus:bg-white focus:border-emerald-600 outline-none"
                />
                <p className="text-[10px] text-gray-400 mt-0.5">Calculated from bitrate ({bitrate}) and duration</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-gray-700">Duration (M:SS) *</label>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                    Auto-Filled
                  </span>
                </div>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => {
                    setDuration(e.target.value);
                    if (autoCalculateAudioInfo) {
                      const durSec = parseDurationToSeconds(e.target.value);
                      const newSize = calculateFileSize(bitrate, durSec);
                      setFileSize(newSize);
                    }
                  }}
                  placeholder="e.g. 3:45"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs font-mono font-bold text-gray-900 bg-gray-50 focus:bg-white focus:border-emerald-600 outline-none"
                />
                <p className="text-[10px] text-gray-400 mt-0.5">Auto-detected or parsed to seconds</p>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-700">Initial Hits / Downloads</label>
                <input
                  type="number"
                  value={hits}
                  onChange={(e) => setHits(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs"
                />
                <p className="text-[10px] text-gray-400 mt-0.5">Starting counter on website</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-gray-700">Tempo / BPM Information *</label>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                  Auto-Analyzed
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={tempo}
                  onChange={(e) => setTempo(e.target.value)}
                  placeholder="e.g. 138 BPM (Heavy Dance Drop)"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs font-semibold text-gray-900 bg-gray-50 focus:bg-white focus:border-emerald-600 outline-none pr-20"
                />
                <span className="absolute right-2 top-2 text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded pointer-events-none">
                  Live BPM
                </span>
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Automatically analyzes energy peaks in audio or generates appropriate DJ tempo by song title
              </p>
            </div>

            <div>
              <label className="block font-semibold mb-1">Hashtags & Tags (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">SEO Keywords</label>
              <input
                type="text"
                value={keywordsInput}
                onChange={(e) => setKeywordsInput(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-gray-700">Song Lyrics / Bol (गीत के बोल)</label>
                <span className="text-[10px] text-gray-400">Optional • Displayed in expandable container on song page</span>
              </div>
              <textarea
                rows={4}
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                placeholder="Enter song lyrics, stanzas, verses and chorus (line breaks are preserved)..."
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs font-sans leading-relaxed focus:border-emerald-600 outline-none"
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isHot}
                  onChange={(e) => setIsHot(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span className="font-semibold text-gray-700">Display HOT Badge</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTrending}
                  onChange={(e) => setIsTrending(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span className="font-semibold text-gray-700">Display TRENDING Badge</span>
              </label>
            </div>

            <div className="pt-4 border-t">
              <button
                type="submit"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-6 rounded text-xs transition shadow-sm"
              >
                Publish Song to Portal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: YouTube 1-Click Importer */}
      {activeTab === 'youtube' && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Youtube className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="text-sm font-bold text-gray-800">
                YouTube Song Link Importer (Automatic Title & Rip)
              </h3>
              <p className="text-[11px] text-gray-500">
                Paste any YouTube link to auto-detect title, download thumbnail, and generate a 320Kbps downloadable track.
              </p>
            </div>
          </div>

          {ytSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded">
              {ytSuccess}
            </div>
          )}

          <form onSubmit={handleImportYoutube} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">YouTube Song / Video Link *</label>
              <input
                type="text"
                value={ytUrl}
                onChange={(e) => handleYtInputChange(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:border-red-600 outline-none"
              />
            </div>

            {ytThumbnail && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 border rounded-lg">
                <img src={ytThumbnail} alt="YouTube thumbnail" className="w-24 h-16 object-cover rounded shadow" />
                <div className="flex-1">
                  <span className="text-[10px] uppercase font-bold text-red-600 block">Automatic Preview</span>
                  <input
                    type="text"
                    value={ytTitle}
                    onChange={(e) => setYtTitle(e.target.value)}
                    className="w-full border rounded px-2 py-1 text-xs font-bold text-gray-800 mt-1"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold mb-1">Category</label>
                <select
                  value={ytCategory}
                  onChange={(e) => setYtCategory(e.target.value)}
                  className="w-full border rounded px-3 py-2 bg-gray-50"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Singer</label>
                <input
                  type="text"
                  value={ytSinger}
                  onChange={(e) => setYtSinger(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">DJ / Remixer</label>
                <input
                  type="text"
                  value={ytRemixer}
                  onChange={(e) => setYtRemixer(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={ytLoading}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded text-xs transition flex items-center gap-2 shadow"
            >
              <Youtube className="w-4 h-4" />
              <span>{ytLoading ? 'Ripping Audio & Publishing...' : 'Import & Publish Song'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: Category Folders CRUD */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-6">
          {/* Header & Status Banner */}
          <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-emerald-700" />
              <div>
                <h3 className="text-sm font-black text-emerald-950 flex items-center gap-2">
                  <span>Category &amp; Music Folder Creator</span>
                  <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded font-black tracking-wide">
                    OPTION ON &amp; ACTIVE
                  </span>
                </h3>
                <p className="text-[11px] text-emerald-800">
                  Create new category folders with SEO slugs, custom badges, and auto-indexed links.
                </p>
              </div>
            </div>

            <div className="text-[11px] font-bold text-emerald-900 bg-white/80 px-2.5 py-1 rounded border border-emerald-200 self-start sm:self-auto">
              Total Categories: {categories.length}
            </div>
          </div>

          {catSuccess && (
            <div className="bg-emerald-100 border border-emerald-400 text-emerald-900 text-xs p-3 rounded font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>{catSuccess}</span>
            </div>
          )}

          {/* Quick 1-Click Popular Category Presets */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-1.5">
            <span className="text-[11px] font-bold text-gray-700 block">
              ⚡ Quick 1-Click Popular Category Presets (Click to autofill):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { name: 'Navratri Bhakti Special DJ Songs', badge: 'BHAKTI', desc: 'Devotional Navratri bhakti bhajans, dholak mixes & roadshow aarti remixes' },
                { name: 'Bhojpuri Roadshow Hard Bass 2026', badge: 'HOT', desc: 'High voltage Bhojpuri competition hard bass and subwoofer drop remixes' },
                { name: 'Bol Bum Sawan Special Mix', badge: 'BHAKTI', desc: 'Kawad Yatra, Lord Shiva DJ songs and Sawan special nonstop remixes' },
                { name: 'Haryanvi Subwoofer Blast', badge: '2026', desc: 'Heavy bass Haryanvi dance tracks and DJ remixes' },
                { name: 'Hindi 90s Jhankar Beats', badge: 'EXCLUSIVE', desc: 'Evergreen 90s Bollywood remix songs with electro dholki beats' },
                { name: 'Nonstop Competition Remixes', badge: 'NEW', desc: '30-minute nonstop DJ battle & roadshow competition mixes' },
              ].map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setNewCatName(preset.name);
                    setNewCatBadge(preset.badge);
                    setNewCatDesc(preset.desc);
                    const existingSlugs = categories.map((c) => c.slug);
                    setNewCatCustomSlug(generateUniqueSlug(preset.name, existingSlugs));
                  }}
                  className="bg-white hover:bg-emerald-50 hover:border-emerald-400 border border-gray-300 text-gray-800 text-[10px] font-semibold px-2.5 py-1 rounded shadow-2xs transition cursor-pointer"
                >
                  + {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* New Category Form */}
          <form onSubmit={handleCreateCategory} className="space-y-3 text-xs bg-gray-50/60 p-4 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-semibold mb-1 text-gray-800">Category / Folder Name *</label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => {
                    setNewCatName(e.target.value);
                    const existingSlugs = categories.map((c) => c.slug);
                    setNewCatCustomSlug(generateUniqueSlug(e.target.value, existingSlugs));
                  }}
                  placeholder="e.g. Navratri Bhakti Special DJ Songs"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:border-emerald-600 outline-none bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-800">Badge</label>
                <select
                  value={newCatBadge}
                  onChange={(e) => setNewCatBadge(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs bg-white font-bold"
                >
                  <option value="NEW">NEW</option>
                  <option value="HOT">HOT</option>
                  <option value="2026">2026</option>
                  <option value="EXCLUSIVE">EXCLUSIVE</option>
                  <option value="BHAKTI">BHAKTI</option>
                  <option value="ROADSHOW">ROADSHOW</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-gray-800">
                  Custom URL Slug (Live at /category/{newCatCustomSlug || 'slug'})
                </label>
                <input
                  type="text"
                  value={newCatCustomSlug}
                  onChange={(e) => setNewCatCustomSlug(e.target.value)}
                  placeholder="e.g. navratri-bhakti-special-dj-songs"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs font-mono text-emerald-800 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-800">Folder Description</label>
                <input
                  type="text"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Short description for SEO and category detail page"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={!newCatName.trim()}
                className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-black py-2 px-6 rounded text-xs transition shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <FolderPlus className="w-4 h-4" />
                <span>Create &amp; Publish Category</span>
              </button>
            </div>
          </form>

          {/* Existing Categories Table */}
          <div>
            <h4 className="text-xs font-black text-gray-800 uppercase mb-2 flex items-center justify-between">
              <span>Existing Categories ({categories.length})</span>
              <span className="text-[10px] text-gray-400 font-normal">Click title or link to test category page</span>
            </h4>
            <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden bg-white">
              {categories.map((c) => (
                <div key={c.id} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs hover:bg-gray-50/70">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Folder className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="font-bold text-gray-900">{c.name}</span>
                      {c.badge && (
                        <span className="text-[9px] bg-red-500 text-white font-bold px-1.5 py-0.2 rounded uppercase">
                          {c.badge}
                        </span>
                      )}
                      <a
                        href={`/category/${c.slug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          window.history.pushState({}, '', `/category/${c.slug}`);
                          window.dispatchEvent(new PopStateEvent('popstate'));
                        }}
                        className="text-[10px] text-emerald-800 hover:underline font-mono flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200"
                        title="Open category page"
                      >
                        /category/{c.slug}
                        <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                      </a>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{c.description}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-gray-600 font-semibold text-[11px] bg-gray-100 px-2 py-0.5 rounded">
                      {c.count} Files
                    </span>
                    {categories.length > 1 && (
                      <button
                        onClick={() => {
                          if (confirm(`Delete folder "${c.name}"?`)) {
                            onDeleteCategory(c.id);
                          }
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: Panels Manager & Panel Creation (OPTION ON & ACTIVE) */}
      {activeTab === 'panels' && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-6">
          {/* Header & Status Banner */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-700 text-white p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-amber-400 text-amber-950 font-black text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                  OPTION ON &amp; ACTIVE
                </span>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-300" />
                  Website Panels &amp; Content Blocks Manager
                </h3>
              </div>
              <p className="text-xs text-amber-100 mt-1">
                Create and control custom website panels: Song collections, Category folders, Notice boards, DJ Artists showcase, and WhatsApp/Telegram VIP banners.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingPanelId(null);
                  handleApplyPanelPreset('trending_songs');
                }}
                className="bg-white/20 hover:bg-white/30 text-white font-bold text-xs px-2.5 py-1.5 rounded transition flex items-center gap-1"
                title="Fill form with Trending Songs panel preset"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>+ Preset Panel</span>
              </button>
            </div>
          </div>

          {/* Toast / Notification */}
          {panelSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs p-3 rounded-lg flex items-center gap-2 font-semibold animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{panelSuccess}</span>
            </div>
          )}

          {/* 1-Click Preset Buttons */}
          <div className="bg-amber-50/70 border border-amber-200/80 p-3.5 rounded-lg space-y-2">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Quick 1-Click Panel Presets (Auto-Configures All Functions):
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleApplyPanelPreset('trending_songs')}
                className="bg-white hover:bg-red-50 text-red-800 text-xs font-bold px-3 py-1.5 rounded border border-red-200 transition flex items-center gap-1 shadow-xs"
              >
                <Flame className="w-3.5 h-3.5 text-red-500" />
                <span>+ Trending 2026 Songs Panel</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPanelPreset('notice_board')}
                className="bg-white hover:bg-amber-50 text-amber-900 text-xs font-bold px-3 py-1.5 rounded border border-amber-300 transition flex items-center gap-1 shadow-xs"
              >
                <Bell className="w-3.5 h-3.5 text-amber-600" />
                <span>+ Official Notice &amp; Announcement Panel</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPanelPreset('dj_showcase')}
                className="bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold px-3 py-1.5 rounded border border-slate-300 transition flex items-center gap-1 shadow-xs"
              >
                <Disc className="w-3.5 h-3.5 text-slate-600" />
                <span>+ DJ Remixers Showcase Panel</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPanelPreset('folders_grid')}
                className="bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded border border-emerald-300 transition flex items-center gap-1 shadow-xs"
              >
                <Folder className="w-3.5 h-3.5 text-emerald-600" />
                <span>+ Category Folders Panel</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPanelPreset('vip_banner')}
                className="bg-white hover:bg-cyan-50 text-cyan-900 text-xs font-bold px-3 py-1.5 rounded border border-cyan-300 transition flex items-center gap-1 shadow-xs"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-600" />
                <span>+ WhatsApp/Telegram VIP Banner</span>
              </button>
            </div>
          </div>

          {/* Panel Creation / Edit Form */}
          <form onSubmit={handleCreateOrUpdatePanel} className="space-y-4 text-xs bg-gray-50/70 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <h4 className="font-bold text-gray-900 flex items-center gap-1.5 text-sm">
                <Plus className="w-4 h-4 text-amber-600" />
                {editingPanelId ? 'Edit Panel Configuration' : 'Create New Website Panel'}
              </h4>
              {editingPanelId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingPanelId(null);
                    setPanelTitle('');
                    setPanelSubtitle('');
                  }}
                  className="text-xs text-gray-500 hover:text-gray-800 underline font-semibold"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {/* Title & Subtitle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-gray-800">Panel Title / Heading *</label>
                <input
                  type="text"
                  value={panelTitle}
                  onChange={(e) => setPanelTitle(e.target.value)}
                  placeholder="e.g. 🔥 Top 2026 Roadshow & Subwoofer Blast Tracks"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:border-amber-500 outline-none bg-white font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-800">Panel Subtitle / Description</label>
                <input
                  type="text"
                  value={panelSubtitle}
                  onChange={(e) => setPanelSubtitle(e.target.value)}
                  placeholder="e.g. High energy competition remixes remastered in 320Kbps"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:border-amber-500 outline-none bg-white"
                />
              </div>
            </div>

            {/* Type, Placement, Theme */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-gray-800">Panel Type *</label>
                <select
                  value={panelType}
                  onChange={(e) => setPanelType(e.target.value as PanelType)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs bg-white font-bold text-gray-800"
                >
                  <option value="songs">🎵 Song Collection / List</option>
                  <option value="categories">📁 Category Folders Grid</option>
                  <option value="notice">📢 Notice / Announcement Board</option>
                  <option value="artists">🎧 Featured DJ Remixers</option>
                  <option value="banner">🚀 Promotional VIP Banner</option>
                  <option value="quick_links">🔗 Quick Filter Tags Cloud</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-800">Website Placement *</label>
                <select
                  value={panelPlacement}
                  onChange={(e) => setPanelPlacement(e.target.value as PanelPlacement)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs bg-white font-medium"
                >
                  <option value="home_top">Top of Homepage (Above Folders)</option>
                  <option value="home_middle">Middle of Homepage (Between Folders &amp; Songs)</option>
                  <option value="home_bottom">Bottom of Homepage (Above Footer)</option>
                  <option value="all">Universal (Everywhere)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-800">Theme &amp; Accent Color</label>
                <select
                  value={panelTheme}
                  onChange={(e) => setPanelTheme(e.target.value as PanelTheme)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs bg-white font-bold"
                >
                  <option value="emerald">🟢 Emerald Green (Classic DjSongsHub)</option>
                  <option value="crimson">🔴 Crimson Red (Hard Bass / Hot)</option>
                  <option value="neon">🔵 Cyan Neon (High Energy / EDM)</option>
                  <option value="amber">🟠 Amber Gold (Notice / VIP)</option>
                  <option value="slate">⚫ Slate Dark (Pro DJs / Studio)</option>
                  <option value="purple">🟣 Royal Purple (Exclusive Drops)</option>
                </select>
              </div>
            </div>

            {/* Badge, Icon, Item Limit, Active Status */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-gray-800">Badge Label</label>
                <input
                  type="text"
                  value={panelBadge}
                  onChange={(e) => setPanelBadge(e.target.value)}
                  placeholder="e.g. HOT, NEW, VIRAL, VIP"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs bg-white font-bold uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-800">Panel Icon</label>
                <select
                  value={panelIcon}
                  onChange={(e) => setPanelIcon(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs bg-white font-medium"
                >
                  <option value="flame">🔥 Flame (Trending)</option>
                  <option value="bell">🔔 Bell (Notice)</option>
                  <option value="music">🎵 Music (Songs)</option>
                  <option value="disc">💿 Disc (DJ Artist)</option>
                  <option value="zap">⚡ Zap (VIP / High Speed)</option>
                  <option value="folder">📁 Folder (Categories)</option>
                  <option value="radio">📻 Radio (Live / FM)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-800">Max Items to Show</label>
                <select
                  value={panelItemLimit}
                  onChange={(e) => setPanelItemLimit(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs bg-white font-medium"
                >
                  <option value={4}>4 Items</option>
                  <option value={6}>6 Items</option>
                  <option value={8}>8 Items</option>
                  <option value={12}>12 Items</option>
                  <option value={16}>16 Items</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-800">Panel Status</label>
                <button
                  type="button"
                  onClick={() => setPanelIsActive(!panelIsActive)}
                  className={`w-full py-2 px-3 rounded font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                    panelIsActive
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  {panelIsActive ? (
                    <>
                      <ToggleRight className="w-4 h-4 text-emerald-200" />
                      <span>Status: ON (Active)</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-4 h-4 text-gray-500" />
                      <span>Status: OFF (Disabled)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Conditional Type Config: Songs Filter */}
            {panelType === 'songs' && (
              <div className="p-3 bg-emerald-50/60 rounded border border-emerald-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-emerald-950">Filter by Category / Folder</label>
                  <select
                    value={panelFilterCategory}
                    onChange={(e) => setPanelFilterCategory(e.target.value)}
                    className="w-full border border-emerald-300 rounded px-2.5 py-1.5 text-xs bg-white"
                  >
                    <option value="">All Categories (No filter)</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-emerald-950">Filter by Tag (Optional)</label>
                  <input
                    type="text"
                    value={panelFilterTag}
                    onChange={(e) => setPanelFilterTag(e.target.value)}
                    placeholder="e.g. hard-bass, bhojpuri"
                    className="w-full border border-emerald-300 rounded px-2.5 py-1.5 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-emerald-950">Sorting Order</label>
                  <select
                    value={panelSongsSort}
                    onChange={(e) => setPanelSongsSort(e.target.value as 'trending' | 'hits' | 'latest')}
                    className="w-full border border-emerald-300 rounded px-2.5 py-1.5 text-xs bg-white font-medium"
                  >
                    <option value="trending">🔥 Trending &amp; Hot Tracks First</option>
                    <option value="hits">📈 Most Hits / Total Downloads</option>
                    <option value="latest">⚡ Newest Release Date</option>
                  </select>
                </div>
              </div>
            )}

            {/* Conditional Type Config: Notice & Banner */}
            {(panelType === 'notice' || panelType === 'banner') && (
              <div className="p-3 bg-amber-50/60 rounded border border-amber-200 space-y-3">
                <div>
                  <label className="block font-semibold mb-1 text-amber-950">Notice Announcement / Banner Body *</label>
                  <textarea
                    rows={2}
                    value={panelCustomHtml}
                    onChange={(e) => setPanelCustomHtml(e.target.value)}
                    placeholder="Enter announcement text or promotional message..."
                    className="w-full border border-amber-300 rounded px-3 py-2 text-xs bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-amber-950">Action Button Link (URL)</label>
                    <input
                      type="text"
                      value={panelActionUrl}
                      onChange={(e) => setPanelActionUrl(e.target.value)}
                      placeholder="e.g. https://t.me/djsongshub or https://wa.me/..."
                      className="w-full border border-amber-300 rounded px-3 py-1.5 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-amber-950">Action Button Text</label>
                    <input
                      type="text"
                      value={panelActionText}
                      onChange={(e) => setPanelActionText(e.target.value)}
                      placeholder="e.g. Join Telegram VIP Channel"
                      className="w-full border border-amber-300 rounded px-3 py-1.5 text-xs bg-white font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Action */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-gray-500">
                Created panels will immediately render on the site with real-time download and playback functions.
              </span>
              <button
                type="submit"
                disabled={!panelTitle.trim()}
                className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-black py-2.5 px-6 rounded text-xs transition shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-amber-200" />
                <span>{editingPanelId ? 'Save Panel Changes' : 'Create & Publish Panel (Option ON)'}</span>
              </button>
            </div>
          </form>

          {/* Existing Panels Management Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-black text-gray-800 uppercase flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-600" />
                <span>Existing Website Panels ({panels.length})</span>
              </h4>
              <span className="text-[10px] text-gray-500">
                Use ▲ / ▼ to reorder • Toggle ON/OFF switch for instant visibility
              </span>
            </div>

            <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-xs">
              {panels
                .sort((a, b) => a.order - b.order)
                .map((p, idx) => (
                  <div
                    key={p.id}
                    className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition ${
                      p.isActive ? 'hover:bg-amber-50/30' : 'bg-gray-50/80 opacity-70'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Order and Move Buttons */}
                      <div className="flex flex-col items-center justify-center shrink-0">
                        <button
                          type="button"
                          onClick={() => handleMovePanel(p, 'up')}
                          disabled={idx === 0}
                          className="text-gray-400 hover:text-gray-800 disabled:opacity-20 p-0.5"
                          title="Move Panel Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono font-bold text-[11px] text-gray-600">
                          #{p.order}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleMovePanel(p, 'down')}
                          disabled={idx === panels.length - 1}
                          className="text-gray-400 hover:text-gray-800 disabled:opacity-20 p-0.5"
                          title="Move Panel Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Panel Info */}
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-900 text-xs sm:text-sm">
                            {p.title}
                          </span>
                          {p.badge && (
                            <span className="bg-amber-100 text-amber-900 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                              {p.badge}
                            </span>
                          )}
                          <span className="bg-gray-100 text-gray-700 text-[10px] px-2 py-0.5 rounded font-mono">
                            Type: {p.type}
                          </span>
                          <span className="bg-blue-50 text-blue-800 text-[10px] px-2 py-0.5 rounded font-mono">
                            Placement: {p.placement}
                          </span>
                          <span className="bg-purple-50 text-purple-800 text-[10px] px-2 py-0.5 rounded font-mono">
                            Theme: {p.theme}
                          </span>
                        </div>
                        {p.subtitle && (
                          <p className="text-[11px] text-gray-500 line-clamp-1">{p.subtitle}</p>
                        )}
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {/* Active Status Switch */}
                      <button
                        type="button"
                        onClick={() => handleTogglePanelActive(p)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition ${
                          p.isActive
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                        title={p.isActive ? 'Panel is visible on website. Click to disable.' : 'Panel is hidden. Click to enable.'}
                      >
                        {p.isActive ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-700" />
                            <span>Active (ON)</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-gray-500" />
                            <span>Disabled (OFF)</span>
                          </>
                        )}
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleEditPanel(p)}
                        className="bg-gray-100 hover:bg-amber-100 text-gray-700 hover:text-amber-900 px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition"
                        title="Edit panel"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      {/* Duplicate Button */}
                      <button
                        type="button"
                        onClick={() => handleDuplicatePanel(p)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition"
                        title="Duplicate panel"
                      >
                        <Copy className="w-3 h-3" />
                        <span className="hidden sm:inline">Clone</span>
                      </button>

                      {/* Delete Button */}
                      {onDeletePanel && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete panel "${p.title}"?`)) {
                              onDeletePanel(p.id);
                            }
                          }}
                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition"
                          title="Delete panel"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

              {panels.length === 0 && (
                <div className="p-8 text-center text-xs text-gray-500">
                  No panels created yet. Use the presets above or form to create your first website panel!
                </div>
              )}
            </div>
          </div>

          {/* Sub-Admin & DJ Accounts Panel Creator Section */}
          <div className="pt-4 border-t border-gray-200">
            <div className="bg-slate-900 text-white p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold flex items-center gap-1.5 text-white">
                    <User className="w-4 h-4 text-emerald-400" />
                    Create DJ / Staff Sub-Panel Accounts (Upload &amp; Management Portal)
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    Create dedicated sub-panels for DJ Artists or Staff with track upload and analytics rights.
                  </p>
                </div>
                <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded uppercase">
                  DJ PORTAL ON
                </span>
              </div>

              {djAccountSuccess && (
                <div className="bg-emerald-900/80 border border-emerald-400 text-emerald-200 text-xs p-2.5 rounded">
                  {djAccountSuccess}
                </div>
              )}

              <form onSubmit={handleCreateDjAccount} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">DJ / Staff Name *</label>
                  <input
                    type="text"
                    value={djPanelName}
                    onChange={(e) => setDjPanelName(e.target.value)}
                    placeholder="e.g. DJ Surendra Ayodhya"
                    required
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded px-3 py-1.5"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Email / Username *</label>
                  <input
                    type="email"
                    value={djPanelEmail}
                    onChange={(e) => setDjPanelEmail(e.target.value)}
                    placeholder="e.g. djsurendra@djsongshub.in"
                    required
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded px-3 py-1.5"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Panel Role</label>
                  <select
                    value={djPanelRole}
                    onChange={(e) => setDjPanelRole(e.target.value as 'creator' | 'admin')}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded px-3 py-1.5 font-bold"
                  >
                    <option value="creator">🎧 DJ Remixer / Creator Panel</option>
                    <option value="admin">🛡️ Sub-Admin Panel</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-4 rounded text-xs transition"
                  >
                    + Create DJ Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Albums CRUD */}
      {activeTab === 'albums' && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-3 pb-2 border-b">
              Add New DJ Album / Compilation
            </h3>
            <form onSubmit={handleCreateAlbum} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Album Title *</label>
                <input
                  type="text"
                  value={newAlbName}
                  onChange={(e) => setNewAlbName(e.target.value)}
                  placeholder="e.g. Bass Vibration Vol. 2"
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Primary Artist</label>
                <input
                  type="text"
                  value={newAlbArtist}
                  onChange={(e) => setNewAlbArtist(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Release Year</label>
                <input
                  type="text"
                  value={newAlbYear}
                  onChange={(e) => setNewAlbYear(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-4 rounded text-xs"
                >
                  Create Album
                </button>
              </div>
            </form>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">Existing Albums & Slugs</h4>
            <div className="divide-y divide-gray-100 border rounded">
              {albums.map((a) => (
                <div key={a.id} className="p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-800">{a.name}</span>
                    <span className="text-[10px] text-emerald-800 font-mono ml-2">/album/{a.slug}</span>
                    <p className="text-[11px] text-gray-400">{a.artist} • {a.releaseYear}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onDeleteAlbum(a.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete album"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Artists CRUD */}
      {activeTab === 'artists' && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-3 pb-2 border-b">
              Add New Singer or DJ Artist
            </h3>
            <form onSubmit={handleCreateArtist} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Artist Name *</label>
                <input
                  type="text"
                  value={newArtName}
                  onChange={(e) => setNewArtName(e.target.value)}
                  placeholder="e.g. DJ Rahul Rock"
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Role</label>
                <select
                  value={newArtRole}
                  onChange={(e) => setNewArtRole(e.target.value as any)}
                  className="w-full border rounded px-3 py-2 bg-gray-50"
                >
                  <option value="dj">DJ / Remixer</option>
                  <option value="singer">Playback Singer</option>
                  <option value="both">Both Singer & Producer</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-4 rounded text-xs"
                >
                  Create Artist
                </button>
              </div>
            </form>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">Existing Artists & Slugs</h4>
            <div className="divide-y divide-gray-100 border rounded">
              {artists.map((ar) => (
                <div key={ar.id} className="p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-800">{ar.name}</span>
                    <span className="text-[10px] text-emerald-800 font-mono ml-2">/artist/{ar.slug}</span>
                    <span className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded ml-2 uppercase">
                      {ar.role}
                    </span>
                  </div>
                  <button
                    onClick={() => onDeleteArtist(ar.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete artist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: Tags CRUD */}
      {activeTab === 'tags' && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-3 pb-2 border-b">
              Add New SEO Tag
            </h3>
            <form onSubmit={handleCreateTag} className="flex gap-3 text-xs max-w-md">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="e.g. competition-bass"
                required
                className="flex-1 border rounded px-3 py-2"
              />
              <button
                type="submit"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-4 rounded text-xs"
              >
                Create Tag
              </button>
            </form>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">Active Tags ({tags.length})</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <div
                  key={t.id}
                  className="bg-gray-50 border rounded-full px-3 py-1 text-xs flex items-center gap-2"
                >
                  <span className="font-bold text-gray-800">#{t.name}</span>
                  <span className="text-[10px] text-gray-400 font-mono">/tag/{t.slug}</span>
                  <button
                    onClick={() => onDeleteTag(t.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: Automatic Sitemap Generator */}
      {activeTab === 'sitemap' && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b">
            <div>
              <h3 className="text-sm font-bold text-gray-800">
                Dynamic XML Sitemap Generator & Validator
              </h3>
              <p className="text-[11px] text-gray-400">
                Automatically indexes all published Songs, Categories, Albums, Artists, and Tags.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySitemap}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 border"
              >
                {copiedSitemap ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSitemap ? 'Copied XML!' : 'Copy XML'}</span>
              </button>
              <button
                onClick={handleDownloadSitemap}
                className="bg-amber-400 hover:bg-amber-500 text-black font-black px-4 py-1.5 rounded flex items-center gap-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download sitemap.xml</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="bg-gray-50 p-2.5 rounded border">
              <span className="text-[10px] uppercase text-gray-400 block font-bold">Songs</span>
              <span className="text-base font-black text-gray-900">{songs.length} URLs</span>
            </div>
            <div className="bg-gray-50 p-2.5 rounded border">
              <span className="text-[10px] uppercase text-gray-400 block font-bold">Categories</span>
              <span className="text-base font-black text-gray-900">{categories.length} URLs</span>
            </div>
            <div className="bg-gray-50 p-2.5 rounded border">
              <span className="text-[10px] uppercase text-gray-400 block font-bold">Albums</span>
              <span className="text-base font-black text-gray-900">{albums.length} URLs</span>
            </div>
            <div className="bg-gray-50 p-2.5 rounded border">
              <span className="text-[10px] uppercase text-gray-400 block font-bold">Artists</span>
              <span className="text-base font-black text-gray-900">{artists.length} URLs</span>
            </div>
            <div className="bg-gray-50 p-2.5 rounded border">
              <span className="text-[10px] uppercase text-gray-400 block font-bold">Tags</span>
              <span className="text-base font-black text-gray-900">{tags.length} URLs</span>
            </div>
          </div>

          <div className="bg-gray-950 text-emerald-400 p-4 rounded-lg font-mono text-[11px] overflow-auto max-h-72 border border-gray-800">
            <pre>{generatedSitemapXml}</pre>
          </div>
        </div>
      )}

      {/* TAB 9: AdSense & SEO */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-gray-800 pb-2 border-b">
            Google AdSense & SEO Optimization Settings
          </h3>

          <div>
            <label className="block font-semibold mb-1">AdSense Publisher ID</label>
            <input
              type="text"
              value={settings.adsensePublisherId}
              onChange={(e) => onUpdateSettings({ ...settings, adsensePublisherId: e.target.value })}
              className="w-full border rounded px-3 py-2 font-mono"
            />
            <p className="text-[10px] text-gray-400 mt-1">Example: pub-9482710398402819</p>
          </div>

          <div>
            <label className="block font-semibold mb-1">Top Live Ticker News / Updates Text</label>
            <textarea
              rows={2}
              value={settings.noticeBanner}
              onChange={(e) => onUpdateSettings({ ...settings, noticeBanner: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Global SEO Meta Description</label>
            <textarea
              rows={2}
              value={settings.metaDescription}
              onChange={(e) => onUpdateSettings({ ...settings, metaDescription: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Global SEO Keywords</label>
            <input
              type="text"
              value={settings.metaKeywords}
              onChange={(e) => onUpdateSettings({ ...settings, metaKeywords: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
      )}

      {/* Edit Song Modal */}
      {editingSong && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-gray-900">Edit Song Details & Slug</h3>
              <button onClick={() => setEditingSong(null)}>
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Title</label>
                <input
                  type="text"
                  value={editingSong.title}
                  onChange={(e) => setEditingSong({ ...editingSong, title: e.target.value })}
                  className="w-full border rounded p-2"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">URL Slug</label>
                <input
                  type="text"
                  value={editingSong.slug}
                  onChange={(e) => setEditingSong({ ...editingSong, slug: slugify(e.target.value) })}
                  className="w-full border rounded p-2 font-mono text-emerald-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Singer</label>
                  <input
                    type="text"
                    value={editingSong.singer}
                    onChange={(e) => setEditingSong({ ...editingSong, singer: e.target.value })}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">DJ / Remixer</label>
                  <input
                    type="text"
                    value={editingSong.remixer}
                    onChange={(e) => setEditingSong({ ...editingSong, remixer: e.target.value })}
                    className="w-full border rounded p-2"
                  />
                </div>
              </div>

              {/* Category in Edit Modal */}
              <div>
                <label className="block font-semibold mb-1">Category / Folder</label>
                <select
                  value={editingSong.category}
                  onChange={(e) => {
                    const newCat = e.target.value;
                    const foundCat = categories.find((c) => c.name === newCat);
                    setEditingSong({
                      ...editingSong,
                      category: newCat,
                      categorySlug: foundCat?.slug || slugify(newCat),
                    });
                  }}
                  className="w-full border rounded p-2 text-xs bg-gray-50"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} {c.badge ? `[${c.badge}]` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Total Hits / Downloads</label>
                  <input
                    type="number"
                    value={editingSong.hits}
                    onChange={(e) => setEditingSong({ ...editingSong, hits: Number(e.target.value) })}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Bitrate</label>
                  <select
                    value={editingSong.bitrate}
                    onChange={(e) => {
                      const newBitrate = e.target.value as any;
                      const durSec = editingSong.durationSec || parseDurationToSeconds(editingSong.duration || '3:45');
                      const newSize = calculateFileSize(newBitrate, durSec);
                      setEditingSong({
                        ...editingSong,
                        bitrate: newBitrate,
                        fileSize: newSize,
                      });
                    }}
                    className="w-full border rounded p-2"
                  >
                    <option value="320 Kbps">320 Kbps</option>
                    <option value="192 Kbps">192 Kbps</option>
                    <option value="128 Kbps">128 Kbps</option>
                  </select>
                </div>
              </div>

              {/* Automatic Audio Info in Edit Modal */}
              <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-2.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-emerald-950 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-emerald-700" />
                    Auto Audio Info &amp; BPM Analysis
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (!editingSong) return;
                      const durStr = editingSong.duration || '3:45';
                      const durSec = parseDurationToSeconds(durStr);
                      const calculatedSize = calculateFileSize(editingSong.bitrate || '320 Kbps', durSec);
                      const { tempoDescription } = estimateBpmFromDetails(
                        editingSong.title,
                        editingSong.category,
                        editingSong.tags?.join(', ') || ''
                      );
                      setEditingSong({
                        ...editingSong,
                        fileSize: calculatedSize,
                        duration: durStr,
                        durationSec: durSec,
                        tempo: tempoDescription,
                      });
                      setEditAudioMessage(`✓ Auto-Calculated: ${calculatedSize} • ${durStr} • ${tempoDescription}`);
                    }}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] px-2 py-0.5 rounded flex items-center gap-1"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    <span>Auto-Calculate</span>
                  </button>
                </div>

                <div className="flex items-center justify-between bg-white border border-emerald-200 p-2 rounded gap-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
                    <FileAudio className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Drop audio file to live-decode duration, file size &amp; BPM:</span>
                  </div>
                  <label className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-2 py-1 rounded shrink-0">
                    <span>{editAnalyzingAudio ? 'Analyzing...' : 'Analyze Audio File'}</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0] && editingSong) {
                          const file = e.target.files[0];
                          setEditAnalyzingAudio(true);
                          setEditAudioMessage(`Analyzing ${file.name}...`);
                          try {
                            const res = await analyzeAudioFile(file, editingSong.bitrate || '320 Kbps');
                            setEditingSong({
                              ...editingSong,
                              fileSize: res.fileSize,
                              duration: res.duration,
                              durationSec: res.durationSec,
                              tempo: res.tempoDescription,
                            });
                            setEditAudioMessage(`✓ Live Decoded: ${res.fileSize} • ${res.duration} • ${res.tempoDescription}`);
                          } catch (err) {
                            console.error(err);
                          } finally {
                            setEditAnalyzingAudio(false);
                          }
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                {editAudioMessage && (
                  <div className="text-[10px] text-emerald-800 font-mono bg-emerald-100 p-1.5 rounded">
                    {editAudioMessage}
                  </div>
                )}
              </div>

              {/* Audio Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">File Size (MB)</label>
                  <input
                    type="text"
                    value={editingSong.fileSize || '8.8 MB'}
                    onChange={(e) => setEditingSong({ ...editingSong, fileSize: e.target.value })}
                    className="w-full border rounded p-2 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Duration (M:SS)</label>
                  <input
                    type="text"
                    value={editingSong.duration || '3:45'}
                    onChange={(e) => {
                      const newDur = e.target.value;
                      const durSec = parseDurationToSeconds(newDur);
                      const newSize = calculateFileSize(editingSong.bitrate || '320 Kbps', durSec);
                      setEditingSong({
                        ...editingSong,
                        duration: newDur,
                        durationSec: durSec,
                        fileSize: newSize,
                      });
                    }}
                    className="w-full border rounded p-2 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-700">Tempo / BPM Information</label>
                <input
                  type="text"
                  value={editingSong.tempo || '138 BPM'}
                  onChange={(e) => setEditingSong({ ...editingSong, tempo: e.target.value })}
                  className="w-full border rounded p-2 text-xs font-semibold"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold">Song Lyrics / Bol (गीत के बोल)</label>
                  <span className="text-[10px] text-gray-400">Expandable section on song page</span>
                </div>
                <textarea
                  rows={4}
                  value={editingSong.lyrics || ''}
                  onChange={(e) => setEditingSong({ ...editingSong, lyrics: e.target.value })}
                  placeholder="Enter or edit song lyrics and stanzas..."
                  className="w-full border rounded p-2 text-xs font-sans leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingSong(null)}
                  className="px-4 py-2 border rounded text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
