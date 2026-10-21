/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Song, Category, Album, Artist, Tag, UserProfile, SiteSettings, StaticPageSlug, SitePanel } from './types/music';
import { 
  INITIAL_SONGS, INITIAL_CATEGORIES, INITIAL_ALBUMS, 
  INITIAL_ARTISTS, INITIAL_TAGS, INITIAL_USER, INITIAL_SETTINGS, INITIAL_PANELS
} from './data/defaultSongs';
import { Header } from './components/Header';
import { TrendingMarquee } from './components/TrendingMarquee';
import { SearchBar } from './components/SearchBar';
import { CategoryFolders } from './components/CategoryFolders';
import { SitePanels } from './components/SitePanels';
import { SongList } from './components/SongList';
import { SongDetail } from './components/SongDetail';
import { CategoryDetail } from './components/CategoryDetail';
import { AlbumDetail } from './components/AlbumDetail';
import { ArtistDetail } from './components/ArtistDetail';
import { TagDetail } from './components/TagDetail';
import { PageDetail, ALL_STATIC_PAGES } from './components/PageDetail';
import { UserPanel } from './components/UserPanel';
import { StickyPlayer } from './components/StickyPlayer';
import { AdminPanel } from './components/AdminPanel';
import { PhpScriptModal } from './components/PhpScriptModal';
import { PlaylistView } from './components/PlaylistView';
import { DownloadModal } from './components/DownloadModal';
import { FooterAndLegal } from './components/FooterAndLegal';
import { playSynthBeat, stopSynthBeat, setMasterVolume } from './utils/audioEngine';

export type AppView = 
  | 'home' 
  | 'song-detail' 
  | 'category-detail' 
  | 'album-detail' 
  | 'artist-detail' 
  | 'tag-detail' 
  | 'page-detail'
  | 'admin' 
  | 'user' 
  | 'playlists';

export default function App() {
  // Persistent State
  const [songs, setSongs] = useState<Song[]>(() => {
    try {
      const saved = localStorage.getItem('stm_songs_v2');
      if (saved) {
        const parsed: Song[] = JSON.parse(saved);
        // Seamlessly merge lyrics from INITIAL_SONGS if not present in cached items
        return parsed.map((s) => {
          if (!s.lyrics) {
            const initialMatch = INITIAL_SONGS.find((init) => init.id === s.id || init.slug === s.slug);
            if (initialMatch?.lyrics) {
              return { ...s, lyrics: initialMatch.lyrics };
            }
          }
          return s;
        });
      }
      return INITIAL_SONGS;
    } catch {
      return INITIAL_SONGS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('stm_categories_v2');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [albums, setAlbums] = useState<Album[]>(() => {
    try {
      const saved = localStorage.getItem('stm_albums_v2');
      return saved ? JSON.parse(saved) : INITIAL_ALBUMS;
    } catch {
      return INITIAL_ALBUMS;
    }
  });

  const [artists, setArtists] = useState<Artist[]>(() => {
    try {
      const saved = localStorage.getItem('stm_artists_v2');
      return saved ? JSON.parse(saved) : INITIAL_ARTISTS;
    } catch {
      return INITIAL_ARTISTS;
    }
  });

  const [tags, setTags] = useState<Tag[]>(() => {
    try {
      const saved = localStorage.getItem('stm_tags_v2');
      return saved ? JSON.parse(saved) : INITIAL_TAGS;
    } catch {
      return INITIAL_TAGS;
    }
  });

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('stm_user_v2');
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('stm_settings_v2');
      if (saved) {
        const parsed: SiteSettings = JSON.parse(saved);
        if (!parsed.siteName || parsed.siteName.toLowerCase().includes('djmixx') || parsed.siteUrl?.includes('djmixx')) {
          return {
            ...INITIAL_SETTINGS,
            ...parsed,
            siteName: 'DjSongsHub.In All In One',
            siteSubtitle: 'All In One DJ Remix & High Speed MP3 Portal',
            siteUrl: 'https://djsongshub.in',
            metaDescription: INITIAL_SETTINGS.metaDescription,
            noticeBanner: INITIAL_SETTINGS.noticeBanner,
          };
        }
        return parsed;
      }
      return INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('stm_favorites_v2');
      return saved ? JSON.parse(saved) : ['song-1', 'song-7'];
    } catch {
      return ['song-1', 'song-7'];
    }
  });

  // Website Panels State (Panel Creation & Management)
  const [panels, setPanels] = useState<SitePanel[]>(() => {
    try {
      const saved = localStorage.getItem('stm_panels_v2');
      return saved ? JSON.parse(saved) : INITIAL_PANELS;
    } catch {
      return INITIAL_PANELS;
    }
  });

  useEffect(() => {
    localStorage.setItem('stm_panels_v2', JSON.stringify(panels));
  }, [panels]);

  const handleAddPanel = (newPanel: SitePanel) => {
    setPanels((prev) => [...prev, newPanel]);
  };

  const handleUpdatePanel = (updated: SitePanel) => {
    setPanels((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleDeletePanel = (panelId: string) => {
    setPanels((prev) => prev.filter((p) => p.id !== panelId));
  };

  // Active View & Route Items
  const [activeView, setActiveView] = useState<AppView>('home');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [selectedPageSlug, setSelectedPageSlug] = useState<StaticPageSlug>('about-us');

  // Home Page Filter & Search
  const [homeCategoryFilter, setHomeCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortMode, setSortMode] = useState<'date' | 'hits' | 'rewind'>('date');

  // Modals
  const [showPhpModal, setShowPhpModal] = useState(false);
  const [downloadTarget, setDownloadTarget] = useState<{
    song: Song;
    quality: '320' | '192' | '128' | 'ringtone';
  } | null>(null);

  // Persistent Player state
  const [currentSong, setCurrentSong] = useState<Song | null>(INITIAL_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [progressPercent, setProgressPercent] = useState(12);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('stm_songs_v2', JSON.stringify(songs));
  }, [songs]);

  useEffect(() => {
    localStorage.setItem('stm_categories_v2', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('stm_albums_v2', JSON.stringify(albums));
  }, [albums]);

  useEffect(() => {
    localStorage.setItem('stm_artists_v2', JSON.stringify(artists));
  }, [artists]);

  useEffect(() => {
    localStorage.setItem('stm_tags_v2', JSON.stringify(tags));
  }, [tags]);

  useEffect(() => {
    localStorage.setItem('stm_user_v2', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('stm_settings_v2', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('stm_favorites_v2', JSON.stringify(favorites));
  }, [favorites]);

  // Audio Playback progress ticker
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setProgressPercent((prev) => (prev >= 100 ? 0 : prev + 0.8));
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // URL Routing Sync
  const updateBrowserUrl = (path: string) => {
    if (typeof window !== 'undefined') {
      try {
        window.history.pushState({}, '', path);
      } catch {
        // Fallback for sandboxed iframes
      }
    }
  };

  // Navigation handlers with clean URL tracking
  const navigateToHome = () => {
    setActiveView('home');
    updateBrowserUrl('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSong = (song: Song) => {
    setSelectedSong(song);
    setActiveView('song-detail');
    updateBrowserUrl(`/song/${song.slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setActiveView('category-detail');
    updateBrowserUrl(`/category/${cat.slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAlbum = (alb: Album) => {
    setSelectedAlbum(alb);
    setActiveView('album-detail');
    updateBrowserUrl(`/album/${alb.slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToArtist = (art: Artist) => {
    setSelectedArtist(art);
    setActiveView('artist-detail');
    updateBrowserUrl(`/artist/${art.slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToArtistByName = (artistName: string) => {
    const found = artists.find(
      (a) => a.name.toLowerCase() === artistName.toLowerCase()
    ) || {
      id: `art-${Date.now()}`,
      name: artistName,
      slug: artistName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      role: 'dj' as const,
      trackCount: 1,
      bio: 'Featured recording and remixing artist.',
    };
    navigateToArtist(found);
  };

  const navigateToCategoryByName = (categoryName: string) => {
    const found = categories.find((c) => c.name === categoryName);
    if (found) {
      navigateToCategory(found);
    } else {
      setHomeCategoryFilter(categoryName);
      navigateToHome();
    }
  };

  const navigateToTag = (tag: Tag) => {
    setSelectedTag(tag);
    setActiveView('tag-detail');
    updateBrowserUrl(`/tag/${tag.slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPage = (pageSlug: StaticPageSlug) => {
    setSelectedPageSlug(pageSlug);
    setActiveView('page-detail');
    updateBrowserUrl(`/page/${pageSlug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // URL Popstate & Initial Route Synchronizer
  useEffect(() => {
    const handleRouteFromUrl = () => {
      if (typeof window === 'undefined') return;
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      const querySlug = searchParams.get('slug');

      // 1. Static Page handling: /page/about-us or /page.php?slug=about-us or /pages/about.php
      if (path.startsWith('/page/') || (path.includes('page.php') && querySlug)) {
        let slug = (path.startsWith('/page/') 
          ? path.replace('/page/', '').split('/')[0] 
          : (querySlug || '')).toLowerCase() as StaticPageSlug;
        if (slug === ('dmca' as any)) slug = 'disclaimer';
        if (slug === ('about' as any)) slug = 'about-us';
        if (slug === ('contact' as any)) slug = 'contact-us';
        if (slug === ('terms' as any)) slug = 'terms-and-conditions';
        if (slug === ('privacy' as any)) slug = 'privacy-policy';
        if (slug === ('faq' as any) || slug === ('help' as any)) slug = 'faqs';
        if (slug === ('upload' as any) || slug === ('guidelines' as any)) slug = 'upload-guidelines';

        if (slug) {
          setSelectedPageSlug(slug);
          setActiveView('page-detail');
          return;
        }
      } 
      
      // 2. Song handling: /song/song-slug or /song.php?slug=song-slug
      if (path.startsWith('/song/') || (path.includes('song.php') && querySlug)) {
        const slug = path.startsWith('/song/') 
          ? path.replace('/song/', '').split('/')[0] 
          : (querySlug || '');
        const found = songs.find((s) => s.slug === slug);
        if (found) {
          setSelectedSong(found);
          setActiveView('song-detail');
          return;
        }
      } 
      
      // 3. Category handling: /category/cat-slug or /category.php?slug=cat-slug or /category.php
      if (path.startsWith('/category/') || path.includes('category.php')) {
        const slug = path.startsWith('/category/') 
          ? path.replace('/category/', '').split('/')[0] 
          : (querySlug || '');
        if (slug) {
          const found = categories.find((c) => c.slug === slug || c.slug.toLowerCase() === slug.toLowerCase());
          if (found) {
            setSelectedCategory(found);
            setActiveView('category-detail');
            return;
          }
        }
        // If /category.php with no slug or category not found, show folders/home
        setHomeCategoryFilter('all');
        setActiveView('home');
        return;
      } 
      
      // 4. Album handling: /album/album-slug or /album.php?slug=album-slug
      if (path.startsWith('/album/') || (path.includes('album.php') && querySlug)) {
        const slug = path.startsWith('/album/') 
          ? path.replace('/album/', '').split('/')[0] 
          : (querySlug || '');
        const found = albums.find((a) => a.slug === slug);
        if (found) {
          setSelectedAlbum(found);
          setActiveView('album-detail');
          return;
        }
      } 
      
      // 5. Artist handling: /artist/artist-slug or /artist.php?slug=artist-slug
      if (path.startsWith('/artist/') || (path.includes('artist.php') && querySlug)) {
        const slug = path.startsWith('/artist/') 
          ? path.replace('/artist/', '').split('/')[0] 
          : (querySlug || '');
        const found = artists.find((a) => a.slug === slug);
        if (found) {
          setSelectedArtist(found);
          setActiveView('artist-detail');
          return;
        }
      } 
      
      // 6. Tag handling: /tag/tag-slug or /tag.php?slug=tag-slug
      if (path.startsWith('/tag/') || (path.includes('tag.php') && querySlug)) {
        const slug = path.startsWith('/tag/') 
          ? path.replace('/tag/', '').split('/')[0] 
          : (querySlug || '');
        const found = tags.find((t) => t.slug === slug);
        if (found) {
          setSelectedTag(found);
          setActiveView('tag-detail');
          return;
        }
      } 
      
      // 7. Admin, User, Playlists
      if (path === '/admin' || path.includes('admin/login.php') || path.includes('admin/dashboard.php')) {
        setActiveView('admin');
      } else if (path === '/user') {
        setActiveView('user');
      } else if (path === '/playlists') {
        setActiveView('playlists');
      }
    };

    handleRouteFromUrl();
    window.addEventListener('popstate', handleRouteFromUrl);
    return () => window.removeEventListener('popstate', handleRouteFromUrl);
  }, [songs, categories, albums, artists, tags]);

  // Dynamic Schema.org JSON-LD Structured Data for Songs, Albums, Pages & Portal
  const jsonLdData = useMemo(() => {
    const baseUrl = settings.siteUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://djsongshub.in');

    // 1. DEDICATED SONG JSON-LD (Schema.org MusicRecording, MusicComposition & BreadcrumbList)
    if (activeView === 'song-detail' && selectedSong) {
      const songImage = selectedSong.thumbnailUrl || selectedSong.albumArt || `${baseUrl}/album-art-placeholder.jpg`;
      return {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'MusicRecording',
            '@id': `${baseUrl}/song/${selectedSong.slug}#audio`,
            'name': selectedSong.title,
            'url': `${baseUrl}/song/${selectedSong.slug}`,
            'image': songImage,
            'duration': `PT${selectedSong.durationSec || 245}S`,
            'datePublished': selectedSong.releaseDate || selectedSong.releaseYear,
            'genre': selectedSong.category,
            'inLanguage': 'hi',
            'description': selectedSong.description,
            'keywords': selectedSong.keywords?.join(', ') || 'dj song download, 320kbps remix',
            'byArtist': {
              '@type': 'MusicGroup',
              'name': selectedSong.singer,
              'url': `${baseUrl}/artist/${selectedSong.singerSlug || 'artist'}`,
            },
            'producer': {
              '@type': 'Person',
              'name': selectedSong.remixer,
              'url': `${baseUrl}/artist/${selectedSong.remixerSlug || 'dj'}`,
            },
            ...(selectedSong.album
              ? {
                  'inAlbum': {
                    '@type': 'MusicAlbum',
                    'name': selectedSong.album,
                    'url': `${baseUrl}/album/${selectedSong.albumSlug || ''}`,
                  },
                }
              : {}),
            'audio': {
              '@type': 'AudioObject',
              'contentUrl': selectedSong.audioUrl || `${baseUrl}/download/${selectedSong.slug}`,
              'encodingFormat': 'audio/mpeg',
              'bitrate': selectedSong.bitrate,
            },
            'aggregateRating': {
              '@type': 'AggregateRating',
              'ratingValue': '4.9',
              'bestRating': '5',
              'worstRating': '1',
              'ratingCount': String(Math.max(25, Math.floor((selectedSong.hits || 1000) / 250))),
            },
            ...(selectedSong.lyrics
              ? {
                  'lyrics': {
                    '@type': 'MusicLyrics',
                    'text': selectedSong.lyrics,
                  },
                }
              : {}),
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'INR',
              'availability': 'https://schema.org/InStock',
              'url': `${baseUrl}/song/${selectedSong.slug}`,
            },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': baseUrl,
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': selectedSong.category,
                'item': `${baseUrl}/category/${selectedSong.categorySlug || 'category'}`,
              },
              {
                '@type': 'ListItem',
                'position': 3,
                'name': selectedSong.title,
                'item': `${baseUrl}/song/${selectedSong.slug}`,
              },
            ],
          },
        ],
      };
    }

    // 2. DEDICATED ALBUM JSON-LD (Schema.org MusicAlbum & Track List)
    if (activeView === 'album-detail' && selectedAlbum) {
      const albumTracks = songs.filter(
        (s) => s.album === selectedAlbum.name || s.albumSlug === selectedAlbum.slug
      );
      return {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'MusicAlbum',
            '@id': `${baseUrl}/album/${selectedAlbum.slug}#album`,
            'name': selectedAlbum.name,
            'url': `${baseUrl}/album/${selectedAlbum.slug}`,
            'albumReleaseType': 'https://schema.org/AlbumRelease',
            'datePublished': selectedAlbum.releaseYear,
            'numTracks': selectedAlbum.songCount,
            'genre': albumTracks[0]?.category || 'DJ Remix Competition',
            'description': selectedAlbum.description || `Official DJ compilation album: ${selectedAlbum.name}`,
            'byArtist': {
              '@type': 'MusicGroup',
              'name': selectedAlbum.artist,
              'url': `${baseUrl}/artist/${selectedAlbum.artistSlug || 'artist'}`,
            },
            'aggregateRating': {
              '@type': 'AggregateRating',
              'ratingValue': '4.95',
              'bestRating': '5',
              'worstRating': '1',
              'ratingCount': String(Math.max(40, selectedAlbum.songCount * 45)),
            },
            ...(selectedAlbum.coverArt ? { 'image': selectedAlbum.coverArt } : {}),
            'track': {
              '@type': 'ItemList',
              'numberOfItems': albumTracks.length,
              'itemListElement': albumTracks.map((trk, idx) => ({
                '@type': 'ListItem',
                'position': idx + 1,
                'item': {
                  '@type': 'MusicRecording',
                  'name': trk.title,
                  'url': `${baseUrl}/song/${trk.slug}`,
                  'duration': `PT${trk.durationSec || 240}S`,
                },
              })),
            },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': baseUrl,
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Albums',
                'item': `${baseUrl}/#albums`,
              },
              {
                '@type': 'ListItem',
                'position': 3,
                'name': selectedAlbum.name,
                'item': `${baseUrl}/album/${selectedAlbum.slug}`,
              },
            ],
          },
        ],
      };
    }

    // 3. STATIC / LEGAL PAGE JSON-LD (AboutPage, ContactPage, FAQPage, WebPage)
    if (activeView === 'page-detail') {
      const p = ALL_STATIC_PAGES.find((pg) => pg.slug === selectedPageSlug) || ALL_STATIC_PAGES[0];
      const pageType = selectedPageSlug === 'about-us'
        ? 'AboutPage'
        : selectedPageSlug === 'contact-us'
        ? 'ContactPage'
        : selectedPageSlug === 'faqs'
        ? 'FAQPage'
        : 'WebPage';

      return {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': pageType,
            '@id': `${baseUrl}/page/${p.slug}#page`,
            'name': p.title,
            'url': `${baseUrl}/page/${p.slug}`,
            'description': p.description,
            'inLanguage': 'en',
            'publisher': {
              '@type': 'Organization',
              'name': settings.siteName,
              'url': baseUrl,
            },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': baseUrl,
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Pages',
                'item': `${baseUrl}/page/about-us`,
              },
              {
                '@type': 'ListItem',
                'position': 3,
                'name': p.shortTitle,
                'item': `${baseUrl}/page/${p.slug}`,
              },
            ],
          },
        ],
      };
    }

    // 4. CATEGORY COLLECTION JSON-LD
    if (activeView === 'category-detail' && selectedCategory) {
      const catSongs = songs.filter(
        (s) => s.category === selectedCategory.name || s.categorySlug === selectedCategory.slug
      );
      return {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'CollectionPage',
            '@id': `${baseUrl}/category/${selectedCategory.slug}#category`,
            'name': `${selectedCategory.name} - DJ Remixes & Songs`,
            'url': `${baseUrl}/category/${selectedCategory.slug}`,
            'description': selectedCategory.description,
            'mainEntity': {
              '@type': 'ItemList',
              'numberOfItems': catSongs.length,
              'itemListElement': catSongs.map((s, idx) => ({
                '@type': 'ListItem',
                'position': idx + 1,
                'url': `${baseUrl}/song/${s.slug}`,
                'name': s.title,
              })),
            },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': baseUrl },
              { '@type': 'ListItem', 'position': 2, 'name': 'Categories', 'item': `${baseUrl}/#categories` },
              { '@type': 'ListItem', 'position': 3, 'name': selectedCategory.name, 'item': `${baseUrl}/category/${selectedCategory.slug}` },
            ],
          },
        ],
      };
    }

    // 5. ARTIST DISCOGRAPHY JSON-LD
    if (activeView === 'artist-detail' && selectedArtist) {
      const artistTracks = songs.filter(
        (s) => s.singer === selectedArtist.name || s.remixer === selectedArtist.name || s.singerSlug === selectedArtist.slug || s.remixerSlug === selectedArtist.slug
      );
      return {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'MusicGroup',
            '@id': `${baseUrl}/artist/${selectedArtist.slug}#artist`,
            'name': selectedArtist.name,
            'url': `${baseUrl}/artist/${selectedArtist.slug}`,
            'description': selectedArtist.bio || `Official artist discography: ${selectedArtist.name}`,
            'track': artistTracks.map((s) => ({
              '@type': 'MusicRecording',
              'name': s.title,
              'url': `${baseUrl}/song/${s.slug}`,
            })),
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': baseUrl },
              { '@type': 'ListItem', 'position': 2, 'name': 'Artists', 'item': `${baseUrl}/#artists` },
              { '@type': 'ListItem', 'position': 3, 'name': selectedArtist.name, 'item': `${baseUrl}/artist/${selectedArtist.slug}` },
            ],
          },
        ],
      };
    }

    // 6. GENERAL PORTAL JSON-LD (WebSite & MusicPlaylist for Home / Folders)
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          'url': baseUrl,
          'name': settings.siteName,
          'description': settings.metaDescription,
          'potentialAction': {
            '@type': 'SearchAction',
            'target': {
              '@type': 'EntryPoint',
              'urlTemplate': `${baseUrl}/?search={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
          },
        },
        {
          '@type': 'MusicPlaylist',
          'name': 'Latest Uploaded Songs & DJ Remixes',
          'numTracks': songs.length,
          'track': songs.slice(0, 10).map((s, idx) => ({
            '@type': 'MusicRecording',
            'name': s.title,
            'url': `${baseUrl}/song/${s.slug}`,
            'position': idx + 1,
            'duration': `PT${s.durationSec || 240}S`,
          })),
        },
      ],
    };
  }, [activeView, selectedSong, selectedAlbum, selectedCategory, selectedArtist, selectedPageSlug, songs, settings]);

  // Sync JSON-LD and SEO Title / Meta Description
  useEffect(() => {
    let scriptEl = document.getElementById('schema-jsonld') as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'schema-jsonld';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(jsonLdData, null, 2);

    // Dynamic Title & Meta Description update
    if (activeView === 'song-detail' && selectedSong) {
      document.title = `${selectedSong.title} (${selectedSong.bitrate} HQ MP3 Download) | ${settings.siteName}`;
    } else if (activeView === 'album-detail' && selectedAlbum) {
      document.title = `${selectedAlbum.name} (${selectedAlbum.releaseYear}) | ${settings.siteName}`;
    } else if (activeView === 'page-detail') {
      const p = ALL_STATIC_PAGES.find((pg) => pg.slug === selectedPageSlug);
      document.title = `${p?.title || 'Page'} | ${settings.siteName}`;
    } else if (activeView === 'category-detail' && selectedCategory) {
      document.title = `${selectedCategory.name} - DJ Remixes & Songs | ${settings.siteName}`;
    } else if (activeView === 'artist-detail' && selectedArtist) {
      document.title = `${selectedArtist.name} - DJ Songs & Tracks | ${settings.siteName}`;
    } else {
      document.title = `${settings.siteName} & DJ Remix Hub | High Quality MP3 Downloads`;
    }
  }, [jsonLdData, activeView, selectedSong, selectedAlbum, selectedPageSlug, selectedCategory, selectedArtist, settings]);

  // Play / Pause Controls
  const handlePlaySong = (song: Song) => {
    if (currentSong?.id === song.id && isPlaying) {
      stopSynthBeat();
      setIsPlaying(false);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
      playSynthBeat(138);
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopSynthBeat();
      setIsPlaying(false);
    } else {
      if (!currentSong && songs.length > 0) {
        setCurrentSong(songs[0]);
      }
      setIsPlaying(true);
      playSynthBeat(138);
    }
  };

  const handlePrev = () => {
    if (!currentSong) return;
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentSong(songs[prevIndex]);
    if (isPlaying) playSynthBeat(138);
  };

  const handleNext = () => {
    if (!currentSong) return;
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentSong(songs[nextIndex]);
    if (isPlaying) playSynthBeat(138);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setMasterVolume(newVol);
  };

  const handleToggleFavorite = (songId: string) => {
    setFavorites((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]
    );
  };

  // Server-side style download increment: only on actual file download request
  const handleTriggerDownload = (song: Song, quality: '320' | '192' | '128' | 'ringtone' = '320') => {
    setDownloadTarget({ song, quality });
  };

  const handleIncrementHit = (songId: string) => {
    setSongs((prev) =>
      prev.map((s) => (s.id === songId ? { ...s, hits: s.hits + 1 } : s))
    );
    setUser((prev) => ({
      ...prev,
      downloadsCount: prev.downloadsCount + 1,
    }));
  };

  // Filtered & Sorted Songs for Home View
  const filteredSongs = useMemo(() => {
    let result = [...songs];

    if (homeCategoryFilter !== 'all') {
      result = result.filter((s) => s.category === homeCategoryFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.remixer.toLowerCase().includes(q) ||
          s.singer.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q)) ||
          s.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }

    if (sortMode === 'hits') {
      result.sort((a, b) => b.hits - a.hits);
    } else if (sortMode === 'rewind') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      result.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
    }

    return result;
  }, [songs, homeCategoryFilter, searchQuery, sortMode]);

  const favoriteSongsList = useMemo(() => {
    return songs.filter((s) => favorites.includes(s.id));
  }, [songs, favorites]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans antialiased flex flex-col pb-24">
      {/* 1. Header Navigation */}
      <Header
        onNavigate={(view) => {
          if (view === 'php-script') {
            setShowPhpModal(true);
          } else if (view === 'home') {
            navigateToHome();
          } else {
            setActiveView(view as any);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onNavigateToPage={navigateToPage}
        activeView={activeView}
        playlistCount={favorites.length}
        noticeBanner={settings.noticeBanner}
      />

      {/* 2. Trending Now Scrolling Marquee (Directly below Main Header) */}
      <TrendingMarquee
        songs={songs}
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlaySong={handlePlaySong}
        onSelectSong={navigateToSong}
      />

      {/* 3. Main Container Area */}
      <main className="max-w-6xl w-full mx-auto px-3 sm:px-4 mt-3 flex-1">
        {/* AdSense Leaderboard Unit */}
        {settings.adsenseEnabled && (
          <div className="my-2.5">
            <div className="bg-white border border-dashed border-gray-300 rounded-lg p-2 text-center text-xs text-gray-400 shadow-xs">
              <span className="uppercase tracking-widest text-[9px] block text-gray-400 font-bold mb-1">
                ADVERTISEMENT
              </span>
              <div className="h-16 sm:h-20 bg-gray-50/80 rounded flex items-center justify-center font-mono text-[11px] text-gray-500 border border-gray-100">
                <span className="font-semibold">Google AdSense 728x90 Leaderboard Unit</span>
                <span className="hidden sm:inline text-[10px] text-gray-400 ml-2">
                  (High Speed Responsive Placement)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 1: HOME PAGE */}
        {activeView === 'home' && (
          <div className="space-y-4">
            <SearchBar
              categories={categories}
              selectedCategory={homeCategoryFilter}
              onSelectCategory={(cat) => setHomeCategoryFilter(cat)}
              searchQuery={searchQuery}
              onSearchChange={(q) => setSearchQuery(q)}
              onSearchSubmit={(e) => e.preventDefault()}
            />

            {/* TOP PANELS (Admin created notice boards, featured alerts) */}
            <SitePanels
              panels={panels}
              placement="home_top"
              songs={songs}
              categories={categories}
              artists={artists}
              tags={tags}
              currentSong={currentSong}
              isPlaying={isPlaying}
              onPlaySong={handlePlaySong}
              onSelectSong={navigateToSong}
              onSelectCategory={navigateToCategory}
              onSelectArtist={navigateToArtist}
              onDownloadSong={(song, quality) => handleTriggerDownload(song, quality)}
              onOpenAdminPanels={() => setActiveView('admin')}
            />

            <CategoryFolders
              categories={categories}
              selectedCategory={homeCategoryFilter}
              onSelectCategory={(catName) => {
                const foundCat = categories.find((c) => c.name === catName);
                if (foundCat && homeCategoryFilter === catName) {
                  navigateToCategory(foundCat);
                } else {
                  setHomeCategoryFilter(catName);
                }
              }}
              onOpenCreateCategory={() => setActiveView('admin')}
            />

            {/* MIDDLE PANELS (Admin created songs collections, DJ showcases, etc.) */}
            <SitePanels
              panels={panels}
              placement="home_middle"
              songs={songs}
              categories={categories}
              artists={artists}
              tags={tags}
              currentSong={currentSong}
              isPlaying={isPlaying}
              onPlaySong={handlePlaySong}
              onSelectSong={navigateToSong}
              onSelectCategory={navigateToCategory}
              onSelectArtist={navigateToArtist}
              onDownloadSong={(song, quality) => handleTriggerDownload(song, quality)}
              onOpenAdminPanels={() => setActiveView('admin')}
            />

            {homeCategoryFilter !== 'all' && (
              <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-lg flex items-center justify-between text-xs text-emerald-900">
                <span>
                  Filtering by Folder: <strong>{homeCategoryFilter}</strong> ({filteredSongs.length} Tracks)
                </span>
                <button
                  onClick={() => setHomeCategoryFilter('all')}
                  className="font-bold underline text-emerald-800 hover:text-emerald-950"
                >
                  Clear Filter
                </button>
              </div>
            )}

            <SongList
              songs={filteredSongs}
              sortMode={sortMode}
              onSortChange={(mode) => setSortMode(mode)}
              currentSong={currentSong}
              isPlaying={isPlaying}
              onPlaySong={handlePlaySong}
              onSelectSong={navigateToSong}
              onSelectArtist={navigateToArtistByName}
              onSelectCategoryName={navigateToCategoryByName}
              onDownloadSong={(song, quality) => handleTriggerDownload(song, quality)}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />

            {/* BOTTOM PANELS (Admin created VIP banners, WhatsApp / Telegram links) */}
            <SitePanels
              panels={panels}
              placement="home_bottom"
              songs={songs}
              categories={categories}
              artists={artists}
              tags={tags}
              currentSong={currentSong}
              isPlaying={isPlaying}
              onPlaySong={handlePlaySong}
              onSelectSong={navigateToSong}
              onSelectCategory={navigateToCategory}
              onSelectArtist={navigateToArtist}
              onDownloadSong={(song, quality) => handleTriggerDownload(song, quality)}
              onOpenAdminPanels={() => setActiveView('admin')}
            />
          </div>
        )}

        {/* VIEW 2: DEDICATED SONG DETAIL PAGE (/song/{slug}) */}
        {activeView === 'song-detail' && selectedSong && (
          <SongDetail
            song={selectedSong}
            allSongs={songs}
            allCategories={categories}
            allAlbums={albums}
            allArtists={artists}
            allTags={tags}
            isPlaying={isPlaying && currentSong?.id === selectedSong.id}
            onPlaySong={handlePlaySong}
            onSelectSong={navigateToSong}
            onSelectCategory={navigateToCategory}
            onSelectAlbum={navigateToAlbum}
            onSelectArtist={navigateToArtist}
            onSelectTag={navigateToTag}
            onDownloadSong={(song, quality) => handleTriggerDownload(song, quality)}
            onBack={navigateToHome}
          />
        )}

        {/* VIEW 3: DEDICATED CATEGORY DETAIL PAGE (/category/{slug}) */}
        {activeView === 'category-detail' && selectedCategory && (
          <CategoryDetail
            category={selectedCategory}
            songs={songs}
            allCategories={categories}
            albums={albums}
            isPlaying={isPlaying}
            currentSong={currentSong}
            onPlaySong={handlePlaySong}
            onSelectSong={navigateToSong}
            onSelectCategory={navigateToCategory}
            onSelectAlbum={navigateToAlbum}
            onDownloadSong={(song) => handleTriggerDownload(song, '320')}
            onBack={navigateToHome}
          />
        )}

        {/* VIEW 4: DEDICATED ALBUM DETAIL PAGE (/album/{slug}) */}
        {activeView === 'album-detail' && selectedAlbum && (
          <AlbumDetail
            album={selectedAlbum}
            songs={songs}
            allAlbums={albums}
            isPlaying={isPlaying}
            currentSong={currentSong}
            onPlaySong={handlePlaySong}
            onSelectSong={navigateToSong}
            onSelectAlbum={navigateToAlbum}
            onDownloadSong={(song) => handleTriggerDownload(song, '320')}
            onBack={navigateToHome}
          />
        )}

        {/* VIEW 5: DEDICATED ARTIST DETAIL PAGE (/artist/{slug}) */}
        {activeView === 'artist-detail' && selectedArtist && (
          <ArtistDetail
            artist={selectedArtist}
            songs={songs}
            allArtists={artists}
            isPlaying={isPlaying}
            currentSong={currentSong}
            onPlaySong={handlePlaySong}
            onSelectSong={navigateToSong}
            onSelectArtist={navigateToArtist}
            onDownloadSong={(song) => handleTriggerDownload(song, '320')}
            onBack={navigateToHome}
          />
        )}

        {/* VIEW 6: DEDICATED TAG DETAIL PAGE (/tag/{slug}) */}
        {activeView === 'tag-detail' && selectedTag && (
          <TagDetail
            tag={selectedTag}
            songs={songs}
            allTags={tags}
            isPlaying={isPlaying}
            currentSong={currentSong}
            onPlaySong={handlePlaySong}
            onSelectSong={navigateToSong}
            onSelectTag={navigateToTag}
            onDownloadSong={(song) => handleTriggerDownload(song, '320')}
            onBack={navigateToHome}
          />
        )}

        {/* VIEW 7: USER DASHBOARD & SONG REQUEST */}
        {activeView === 'user' && (
          <UserPanel
            user={user}
            favoriteSongs={favoriteSongsList}
            onPlaySong={handlePlaySong}
            onSelectSong={navigateToSong}
            onRequestSong={(req) => {
              setUser((prev) => ({
                ...prev,
                uploadedTracksCount: prev.uploadedTracksCount + 1,
              }));
            }}
            onBack={navigateToHome}
            onSwitchToAdmin={() => setActiveView('admin')}
          />
        )}

        {/* VIEW 8: PLAYLIST VIEW */}
        {activeView === 'playlists' && (
          <PlaylistView
            favoriteSongs={favoriteSongsList}
            isPlaying={isPlaying}
            currentSong={currentSong}
            onPlaySong={handlePlaySong}
            onSelectSong={navigateToSong}
            onDownloadSong={(song) => handleTriggerDownload(song, '320')}
            onRemoveFavorite={handleToggleFavorite}
            onBack={navigateToHome}
          />
        )}

        {/* VIEW 9: ADMIN PANEL WITH COMPLETE CRUD, YOUTUBE IMPORT & SITEMAP */}
        {activeView === 'admin' && (
          <AdminPanel
            songs={songs}
            categories={categories}
            albums={albums}
            artists={artists}
            tags={tags}
            settings={settings}
            panels={panels}
            onAddSong={(newSong) => setSongs([newSong, ...songs])}
            onUpdateSong={(updatedSong) =>
              setSongs(songs.map((s) => (s.id === updatedSong.id ? updatedSong : s)))
            }
            onDeleteSong={(songId) => setSongs(songs.filter((s) => s.id !== songId))}
            onAddCategory={(newCat) => setCategories([...categories, newCat])}
            onUpdateCategory={(upCat) =>
              setCategories(categories.map((c) => (c.id === upCat.id ? upCat : c)))
            }
            onDeleteCategory={(catId) => setCategories(categories.filter((c) => c.id !== catId))}
            onAddAlbum={(newAlb) => setAlbums([...albums, newAlb])}
            onDeleteAlbum={(albId) => setAlbums(albums.filter((a) => a.id !== albId))}
            onAddArtist={(newArt) => setArtists([...artists, newArt])}
            onDeleteArtist={(artId) => setArtists(artists.filter((a) => a.id !== artId))}
            onAddTag={(newTag) => setTags([...tags, newTag])}
            onDeleteTag={(tagId) => setTags(tags.filter((t) => t.id !== tagId))}
            onUpdateSettings={(newSettings) => setSettings(newSettings)}
            onAddPanel={handleAddPanel}
            onUpdatePanel={handleUpdatePanel}
            onDeletePanel={handleDeletePanel}
            onClose={navigateToHome}
          />
        )}

        {/* VIEW 10: DEDICATED STATIC & LEGAL PAGES (/page/{slug}) */}
        {activeView === 'page-detail' && (
          <PageDetail
            slug={selectedPageSlug}
            settings={settings}
            allSongs={songs}
            allCategories={categories}
            allAlbums={albums}
            allArtists={artists}
            allTags={tags}
            onNavigateToPage={navigateToPage}
            onSelectSong={navigateToSong}
            onSelectCategory={navigateToCategory}
            onSelectAlbum={navigateToAlbum}
            onBack={navigateToHome}
          />
        )}
      </main>

      {/* JSON-LD Structured Data Script for Search Crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* Footer and Legal Pages */}
      <FooterAndLegal
        categories={categories}
        settings={settings}
        onSelectCategory={(catName) => {
          const found = categories.find((c) => c.name === catName);
          if (found) {
            navigateToCategory(found);
          } else {
            setHomeCategoryFilter(catName);
            navigateToHome();
          }
        }}
        onOpenPhpScript={() => setShowPhpModal(true)}
        onNavigateToPage={navigateToPage}
      />

      {/* Persistent Bottom Sticky Player */}
      <StickyPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onPrev={handlePrev}
        onNext={handleNext}
        volume={volume}
        onVolumeChange={handleVolumeChange}
        onDownload={(song) => handleTriggerDownload(song, '320')}
        progressPercent={progressPercent}
      />

      {/* Download Progress Modal (Server-side style increment on actual save) */}
      {downloadTarget && (
        <DownloadModal
          song={downloadTarget.song}
          quality={downloadTarget.quality}
          onClose={() => setDownloadTarget(null)}
          onIncrementHit={handleIncrementHit}
        />
      )}

      {/* Complete PHP 8.3/8.4/8.5 Script Exporter Modal */}
      {showPhpModal && (
        <PhpScriptModal onClose={() => setShowPhpModal(false)} />
      )}
    </div>
  );
}
