import React from 'react';
import { Radio, Download, ShieldCheck, Code, Music, Sparkles, Heart, FileText } from 'lucide-react';
import { StaticPageSlug } from '../types/music';

interface HeaderProps {
  onNavigate: (view: 'home' | 'admin' | 'php-script' | 'playlists' | 'user' | 'legal') => void;
  onNavigateToPage?: (slug: StaticPageSlug) => void;
  activeView: string;
  playlistCount: number;
  noticeBanner: string;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  onNavigateToPage,
  activeView,
  playlistCount,
  noticeBanner,
}) => {
  return (
    <header className="sticky top-0 z-40 shadow-md">
      {/* Top Updates News Ticker */}
      <div className="bg-amber-400 text-black text-xs font-semibold py-1 px-4 overflow-hidden border-b border-amber-500 shadow-inner flex items-center gap-2">
        <span className="bg-black text-amber-400 font-extrabold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider shrink-0 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
          UPDATES
        </span>
        <div className="truncate whitespace-nowrap text-[11px] font-medium flex-1">
          {noticeBanner}
        </div>
        <div className="hidden md:flex items-center gap-2 text-[10px] text-amber-950 shrink-0 font-bold">
          <span className="inline-block w-2 h-2 rounded-full bg-green-600"></span>
          Online: 4,892 | Cloud CDN Active
        </div>
      </div>

      {/* Main Branding Bar */}
      <div className="bg-[#0b5331] text-white border-b-2 border-emerald-500 px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Logo & Tagline */}
          <div 
            onClick={() => onNavigate('home')} 
            className="cursor-pointer flex items-center gap-3 group select-none"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-700/80 border border-emerald-400/40 flex items-center justify-center shadow-inner group-hover:scale-105 transition">
              <Music className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white group-hover:text-emerald-200 transition">
                  DjSongsHub<span className="text-emerald-300">.In</span>
                </span>
                <span className="bg-gradient-to-r from-amber-400 to-yellow-300 text-stone-900 text-[10px] font-black px-2 py-0.5 rounded shadow uppercase tracking-wider">
                  ALL IN ONE
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/90 font-medium tracking-wide">
                All In One DJ Remixes, Bhojpuri, Hindi, Haryanvi &amp; 320Kbps HQ MP3 Portal
              </p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <nav className="flex items-center flex-wrap gap-2 text-xs font-semibold">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 cursor-pointer ${
                activeView === 'home'
                  ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-400'
                  : 'text-emerald-100 hover:bg-emerald-800/60'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              Home
            </button>

            <button
              onClick={() => onNavigate('playlists')}
              className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 cursor-pointer ${
                activeView === 'playlists'
                  ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-400'
                  : 'text-emerald-100 hover:bg-emerald-800/60'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
              Playlists
              <span className="bg-emerald-900 text-emerald-200 text-[10px] px-1.5 py-0.2 rounded-full">
                {playlistCount}
              </span>
            </button>

            {/* User Panel Link */}
            <button
              onClick={() => onNavigate('user')}
              className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 cursor-pointer ${
                activeView === 'user'
                  ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-400'
                  : 'text-emerald-100 hover:bg-emerald-800/60'
              }`}
            >
              <span>User Panel</span>
            </button>

            {/* Direct Page Link to /page/about-us */}
            <button
              onClick={() => onNavigateToPage ? onNavigateToPage('about-us') : onNavigate('legal')}
              className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 cursor-pointer ${
                activeView === 'page-detail'
                  ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-400'
                  : 'text-emerald-100 hover:bg-emerald-800/60'
              }`}
              title="Visit /page/about-us and all official static pages"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-300" />
              <span>About &amp; Pages</span>
            </button>

            {/* Direct Instant ZIP Download Link */}
            <a
              href="/djsongshub_php8_suite.zip"
              download="djsongshub_php8_suite.zip"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-3 py-1.5 rounded transition flex items-center gap-1.5 shadow cursor-pointer"
              title="Download Complete PHP 8.3-8.5 Website ZIP Suite"
            >
              <Download className="w-3.5 h-3.5 text-black" />
              <span>Download ZIP</span>
              <span className="bg-red-600 text-white text-[9px] px-1 py-0.2 rounded font-black uppercase">
                PHP
              </span>
            </a>

            {/* PHP 8.3-8.5 Script Exporter Button */}
            <button
              onClick={() => onNavigate('php-script')}
              className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 cursor-pointer ${
                activeView === 'php-script'
                  ? 'bg-emerald-700 text-white font-extrabold shadow-sm'
                  : 'bg-emerald-900/90 hover:bg-emerald-700 text-emerald-200 border border-emerald-500/40'
              }`}
              title="Get complete PHP 8.3/8.4/8.5 Script Suite and view code"
            >
              <Code className="w-3.5 h-3.5" />
              <span>PHP Suite</span>
            </button>

            <button
              onClick={() => onNavigate('admin')}
              className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 cursor-pointer ${
                activeView === 'admin'
                  ? 'bg-emerald-400 text-emerald-950 font-extrabold shadow-sm'
                  : 'bg-emerald-800/80 hover:bg-emerald-700 text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin
            </button>
          </nav>
        </div>
      </div>

      {/* Direct Page Quick Links Bar: /page/about-us and all pages */}
      <div className="bg-[#073922] text-emerald-200 border-b border-emerald-800/80 px-4 py-1.5 text-[11px] overflow-x-auto shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center gap-2 flex-nowrap md:flex-wrap">
          <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px] shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Quick Pages:
          </span>
          <button
            onClick={() => onNavigateToPage?.('about-us')}
            className="hover:text-white hover:underline bg-emerald-900/60 hover:bg-emerald-800 px-2 py-0.5 rounded border border-emerald-700/60 transition shrink-0 cursor-pointer"
            title="/page/about-us"
          >
            /page/about-us
          </button>
          <button
            onClick={() => onNavigateToPage?.('contact-us')}
            className="hover:text-white hover:underline bg-emerald-900/60 hover:bg-emerald-800 px-2 py-0.5 rounded border border-emerald-700/60 transition shrink-0 cursor-pointer"
            title="/page/contact-us"
          >
            /page/contact-us
          </button>
          <button
            onClick={() => onNavigateToPage?.('disclaimer')}
            className="hover:text-white hover:underline bg-emerald-900/60 hover:bg-emerald-800 px-2 py-0.5 rounded border border-emerald-700/60 transition shrink-0 cursor-pointer"
            title="/page/disclaimer"
          >
            /page/disclaimer (DMCA)
          </button>
          <button
            onClick={() => onNavigateToPage?.('privacy-policy')}
            className="hover:text-white hover:underline bg-emerald-900/60 hover:bg-emerald-800 px-2 py-0.5 rounded border border-emerald-700/60 transition shrink-0 cursor-pointer"
            title="/page/privacy-policy"
          >
            /page/privacy-policy
          </button>
          <button
            onClick={() => onNavigateToPage?.('terms-and-conditions')}
            className="hover:text-white hover:underline bg-emerald-900/60 hover:bg-emerald-800 px-2 py-0.5 rounded border border-emerald-700/60 transition shrink-0 cursor-pointer"
            title="/page/terms-and-conditions"
          >
            /page/terms-and-conditions
          </button>
          <button
            onClick={() => onNavigateToPage?.('sitemap')}
            className="hover:text-white hover:underline bg-emerald-900/60 hover:bg-emerald-800 px-2 py-0.5 rounded border border-emerald-700/60 transition shrink-0 cursor-pointer"
            title="/page/sitemap"
          >
            /page/sitemap (XML)
          </button>
          <button
            onClick={() => onNavigateToPage?.('faqs')}
            className="hover:text-white hover:underline bg-emerald-900/60 hover:bg-emerald-800 px-2 py-0.5 rounded border border-emerald-700/60 transition shrink-0 cursor-pointer"
            title="/page/faqs"
          >
            /page/faqs
          </button>
        </div>
      </div>
    </header>
  );
};
