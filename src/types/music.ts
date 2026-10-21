export interface Song {
  id: string;
  slug: string;
  title: string;
  remixer: string;
  remixerSlug?: string;
  singer: string;
  singerSlug?: string;
  category: string;
  categorySlug?: string;
  album?: string;
  albumSlug?: string;
  bitrate: '320 Kbps' | '192 Kbps' | '128 Kbps';
  fileSize: string;
  duration: string;
  durationSec: number;
  hits: number;
  releaseYear: string;
  releaseDate: string;
  tempo: string;
  tags: string[];
  keywords: string[];
  description: string;
  isHot?: boolean;
  isTrending?: boolean;
  audioUrl?: string;
  albumArt?: string;
  thumbnailUrl?: string;
  youtubeUrl?: string;
  lyrics?: string;
  directSongUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
  description: string;
  isNew?: boolean;
  badge?: string;
}

export interface Album {
  id: string;
  name: string;
  slug: string;
  artist: string;
  artistSlug?: string;
  releaseYear: string;
  coverArt?: string;
  songCount: number;
  description?: string;
}

export interface Artist {
  id: string;
  name: string;
  slug: string;
  role: 'singer' | 'dj' | 'both';
  trackCount: number;
  bio?: string;
  image?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'creator';
  joinedDate: string;
  favoritesCount: number;
  downloadsCount: number;
  uploadedTracksCount: number;
}

export interface SiteSettings {
  siteName: string;
  siteSubtitle: string;
  siteUrl: string;
  adminEmail: string;
  adsenseEnabled: boolean;
  adsensePublisherId: string;
  metaKeywords: string;
  metaDescription: string;
  noticeBanner: string;
}

export interface PlaylistItem {
  song: Song;
  addedAt: number;
}

export type PanelType = 
  | 'songs'          // Song list panel (filtered by category, tags, hot, or trending)
  | 'categories'     // Category folders grid panel
  | 'notice'         // Announcement / notice board alert panel
  | 'artists'        // Featured DJ Remixers showcase panel
  | 'banner'         // Promotional / Telegram / WhatsApp / Ad banner panel
  | 'quick_links';   // Fast tags & quick links pills panel

export type PanelPlacement = 'home_top' | 'home_middle' | 'home_bottom' | 'all';
export type PanelTheme = 'emerald' | 'slate' | 'crimson' | 'neon' | 'amber' | 'purple';

export interface SitePanel {
  id: string;
  title: string;
  subtitle?: string;
  type: PanelType;
  placement: PanelPlacement;
  order: number;
  isActive: boolean;
  theme: PanelTheme;
  badge?: string;
  icon?: string;
  itemLimit?: number;
  
  // Type specific configuration
  filterCategory?: string; // for 'songs' type
  filterTag?: string;      // for 'songs' type
  songsSort?: 'latest' | 'hits' | 'trending';
  
  customHtml?: string;     // for 'banner' or 'notice' text
  actionUrl?: string;      // e.g. 'https://t.me/djsongshub'
  actionText?: string;     // e.g. 'Join Telegram VIP'
  
  createdAt: string;
}

export type StaticPageSlug = 
  | 'about-us' 
  | 'contact-us' 
  | 'privacy-policy' 
  | 'terms-and-conditions' 
  | 'disclaimer' 
  | 'sitemap'
  | 'faqs'
  | 'upload-guidelines';

export interface StaticPageInfo {
  slug: StaticPageSlug;
  title: string;
  shortTitle: string;
  description: string;
  path: string;
}

