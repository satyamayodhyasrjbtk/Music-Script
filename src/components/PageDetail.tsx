import React, { useState } from 'react';
import { Song, Category, Album, Artist, Tag, SiteSettings, StaticPageSlug } from '../types/music';
import { 
  ArrowLeft, Copy, Check, ShieldCheck, Mail, Send, FileText, Globe, 
  AlertTriangle, ExternalLink, ChevronRight, Music, Disc, Folder, User, Sparkles
} from 'lucide-react';

interface PageDetailProps {
  slug: StaticPageSlug;
  settings: SiteSettings;
  allSongs: Song[];
  allCategories: Category[];
  allAlbums: Album[];
  allArtists: Artist[];
  allTags: Tag[];
  onNavigateToPage: (slug: StaticPageSlug) => void;
  onSelectSong: (song: Song) => void;
  onSelectCategory: (category: Category) => void;
  onSelectAlbum: (album: Album) => void;
  onBack: () => void;
}

export const ALL_STATIC_PAGES: {
  slug: StaticPageSlug;
  title: string;
  shortTitle: string;
  description: string;
  badge?: string;
}[] = [
  {
    slug: 'about-us',
    title: 'About Us - DjSongsHub.In All In One Studio & Sound Lab',
    shortTitle: 'About Us',
    description: 'Learn about our audio remastering process, 320 Kbps studio sound lab, and editorial team.',
  },
  {
    slug: 'contact-us',
    title: 'Contact Support & Song Request Desk',
    shortTitle: 'Contact Us',
    description: 'Reach our administrative desk, request songs, or submit partnership and remix inquiries.',
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy (Google AdSense & GDPR Compliant)',
    shortTitle: 'Privacy Policy',
    description: 'Information collection, Google DoubleClick DART cookies, analytics, and data rights disclosures.',
  },
  {
    slug: 'terms-and-conditions',
    title: 'Terms of Use & Audio Licensing Agreement',
    shortTitle: 'Terms & Conditions',
    description: 'Usage guidelines, promotional evaluation licenses, disclaimer of warranties, and limitations.',
  },
  {
    slug: 'disclaimer',
    title: 'DMCA Copyright Disclaimer & Takedown Notice',
    shortTitle: 'DMCA Disclaimer',
    badge: 'Legal',
    description: 'Intellectual property notice, fair promotional use policies, and takedown instructions.',
  },
  {
    slug: 'sitemap',
    title: 'Complete HTML & XML Sitemap Directory',
    shortTitle: 'Sitemap Index',
    badge: 'SEO',
    description: 'Search engine index of all published songs, albums, categories, artists, and legal pages.',
  },
  {
    slug: 'faqs',
    title: 'Frequently Asked Questions & Download Guide',
    shortTitle: 'Help & FAQs',
    badge: 'Help',
    description: 'Answers to downloading questions, 320 Kbps audio bitrate, ringtone setup, and DJ track submissions.',
  },
  {
    slug: 'upload-guidelines',
    title: 'DJ Remix Upload Guidelines & Audio Standards',
    shortTitle: 'Upload Rules',
    badge: 'Rules',
    description: 'Audio submission criteria, master bitrate specs, ID3 tag conventions, and copyright rules.',
  },
];

export const PageDetail: React.FC<PageDetailProps> = ({
  slug,
  settings,
  allSongs,
  allCategories,
  allAlbums,
  allArtists,
  allTags,
  onNavigateToPage,
  onSelectSong,
  onSelectCategory,
  onSelectAlbum,
  onBack,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedXml, setCopiedXml] = useState(false);
  const [sitemapTab, setSitemapTab] = useState<'html' | 'xml'>('html');

  // Contact form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Song / DJ Remix Request');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const currentPage = ALL_STATIC_PAGES.find((p) => p.slug === slug) || ALL_STATIC_PAGES[0];
  const pageUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/page/${currentPage.slug}` 
    : `${settings.siteUrl}/page/${currentPage.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSubmitted(false);
    }, 4000);
  };

  const rawXmlSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core Portal -->
  <url>
    <loc>${settings.siteUrl}/</loc>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Static & Legal Pages -->
${ALL_STATIC_PAGES.map((p) => `  <url>\n    <loc>${settings.siteUrl}/page/${p.slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`).join('\n')}
  <!-- Categories -->
${allCategories.map((c) => `  <url>\n    <loc>${settings.siteUrl}/category/${c.slug}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.85</priority>\n  </url>`).join('\n')}
  <!-- Albums -->
${allAlbums.map((a) => `  <url>\n    <loc>${settings.siteUrl}/album/${a.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`).join('\n')}
  <!-- Songs -->
${allSongs.map((s) => `  <url>\n    <loc>${settings.siteUrl}/song/${s.slug}</loc>\n    <lastmod>${s.releaseDate || new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.95</priority>\n  </url>`).join('\n')}
</urlset>`;

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* 1. Breadcrumbs Navigation with URL indicator */}
      <div className="bg-white px-3.5 py-2.5 rounded-lg border border-gray-200 shadow-sm flex flex-wrap items-center justify-between text-xs text-gray-500 gap-2">
        <div className="flex items-center gap-1.5 overflow-hidden flex-wrap">
          <button onClick={onBack} className="hover:text-emerald-700 font-semibold flex items-center gap-1 cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </button>
          <span>&gt;</span>
          <span className="text-gray-500 font-medium">Pages</span>
          <span>&gt;</span>
          <span className="text-gray-900 font-bold truncate max-w-xs">{currentPage.shortTitle}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-emerald-800 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            /page/{currentPage.slug}
          </span>
          <button
            onClick={handleCopyLink}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-semibold px-2.5 py-1 rounded border border-gray-300 flex items-center gap-1 transition cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied URL!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>

      {/* 2. Interconnected Pages Navigation Strip ("new new link all pages") */}
      <div className="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
          <Globe className="w-3 h-3 text-emerald-700" />
          <span>Official Portal Pages &amp; Legal Index:</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {ALL_STATIC_PAGES.map((pageItem) => {
            const isActive = pageItem.slug === slug;
            return (
              <button
                key={pageItem.slug}
                onClick={() => onNavigateToPage(pageItem.slug)}
                className={`text-xs px-3 py-1.5 rounded-md font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 border border-gray-200 hover:border-emerald-300'
                }`}
              >
                <span>{pageItem.shortTitle}</span>
                {pageItem.badge && (
                  <span className={`text-[9px] px-1 py-0.2 rounded font-black uppercase ${
                    isActive ? 'bg-emerald-900 text-emerald-200' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {pageItem.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Page Header Banner */}
      <div className="bg-gradient-to-r from-[#073922] via-[#0b5331] to-[#0e613b] text-white rounded-t-xl p-6 shadow-md border-b-2 border-emerald-400">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-emerald-900/80 border border-emerald-400/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded text-amber-300 mb-2 uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official Policy &amp; Information Desk</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
            {currentPage.title}
          </h1>
          <p className="text-xs text-emerald-100/90 mt-1.5 leading-relaxed">
            {currentPage.description}
          </p>
          <div className="mt-3 flex items-center gap-3 text-[11px] text-emerald-300/80 flex-wrap">
            <span>Portal: <strong>{settings.siteName}</strong></span>
            <span>•</span>
            <span>Last Updated: <strong>October 2026</strong></span>
            <span>•</span>
            <span className="text-amber-300 font-mono">Status: Verified &amp; AdSense Compliant</span>
          </div>
        </div>
      </div>

      {/* 4. Page Body Container */}
      <div className="bg-white p-6 rounded-b-xl border border-gray-200 shadow-sm text-gray-800 leading-relaxed text-xs sm:text-sm">
        {/* PAGE 1: ABOUT US */}
        {slug === 'about-us' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-2 pb-1 border-b">
                Welcome to {settings.siteName}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                <strong>{settings.siteName}</strong> is India's dedicated audio remastering portal, providing ultra-clean, high-definition 320 Kbps constant bit rate (CBR) MP3 downloads and DJ remix master editions. Launched to serve audio enthusiasts, roadshow sound operators, competition DJ teams, and listeners, our platform emphasizes speed, high fidelity sub-bass frequencies, and clean navigation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold mb-2">
                  320
                </div>
                <h3 className="font-bold text-gray-900 text-xs mb-1">CBR Studio Quality</h3>
                <p className="text-[11px] text-gray-600">
                  All tracks are transcoded with zero loss at 320 Kbps CBR, preserving vocal harmonics and tight sub-bass frequencies from 30Hz to 18kHz.
                </p>
              </div>

              <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold mb-2">
                  ⚡
                </div>
                <h3 className="font-bold text-gray-900 text-xs mb-1">No Deceptive Loops</h3>
                <p className="text-[11px] text-gray-600">
                  Unlike traditional download websites with multiple deceptive popups, our direct server download delivers files directly in one single click.
                </p>
              </div>

              <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold mb-2">
                  🎵
                </div>
                <h3 className="font-bold text-gray-900 text-xs mb-1">Live Audio Engine</h3>
                <p className="text-[11px] text-gray-600">
                  Listen immediately via our real-time Web Audio API synthesizer stream before saving offline to your device storage.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold text-gray-900 mb-2 pb-1 border-b">
                Editorial Team &amp; Sound Lab
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Our audio testing lab operates out of Ayodhya, Uttar Pradesh, specializing in traditional Bhojpuri folk rhythms, Dholki beats, Haryanvi competition drops, and festival trance anthems. Our sound curators manually calibrate every audio file for roadshow speaker systems and car subwoofers.
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-gray-900 block">Chief Sound Remixer &amp; Admin: DJ Surendra</span>
                  <span className="text-gray-500 text-[11px]">Contact: {settings.adminEmail}</span>
                </div>
                <button
                  onClick={() => onNavigateToPage('contact-us')}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded text-xs transition cursor-pointer"
                >
                  Contact Desk
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 2: CONTACT US */}
        {slug === 'contact-us' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-2 pb-1 border-b">
                Contact Our Support &amp; Song Request Team
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Have a request for a specific DJ remix, feedback about sound quality, partnership proposals, or DMCA inquiries? Our team is available 24/7.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Form */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <h3 className="font-bold text-xs uppercase text-gray-700 mb-3 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-emerald-700" />
                  <span>Send Direct Inquiry</span>
                </h3>

                {submitted ? (
                  <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 p-4 rounded-lg text-center space-y-1">
                    <Check className="w-6 h-6 text-emerald-700 mx-auto" />
                    <p className="font-bold text-xs">Message Received Successfully!</p>
                    <p className="text-[11px] text-emerald-800">
                      Our audio support team will review your inquiry and respond within 24 business hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-700">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full border border-gray-300 bg-white rounded px-3 py-2 text-xs focus:border-emerald-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-700">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full border border-gray-300 bg-white rounded px-3 py-2 text-xs focus:border-emerald-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-700">Subject Category</label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full border border-gray-300 bg-white rounded px-3 py-2 text-xs"
                      >
                        <option value="Song / DJ Remix Request">🎵 Song / DJ Remix Request</option>
                        <option value="Audio Quality / Bug Report">🎧 Audio Quality / File Issue</option>
                        <option value="DMCA Copyright Removal">⚖️ DMCA Copyright Removal</option>
                        <option value="Advertising / Business Partnership">💼 Advertising &amp; Partnerships</option>
                        <option value="General Feedback">💬 General Feedback</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-700">Message / Song Link *</label>
                      <textarea
                        rows={4}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Please include song name, artist, or specific details..."
                        className="w-full border border-gray-300 bg-white rounded px-3 py-2 text-xs focus:border-emerald-600 outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Official Inquiry</span>
                    </button>
                  </form>
                )}
              </div>

              {/* Right Column: Contact Channels */}
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-2">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                    Official Administrative Email
                  </span>
                  <a
                    href={`mailto:${settings.adminEmail}`}
                    className="text-emerald-700 hover:underline font-bold text-sm block"
                  >
                    {settings.adminEmail}
                  </a>
                  <p className="text-[11px] text-gray-500">
                    Monitored directly by our chief technical officer and sound mastering staff.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-2">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                    Ayodhya Sound Lab &amp; Studio Desk
                  </span>
                  <p className="text-xs text-gray-800 font-semibold">
                    Civil Lines, Ayodhya (Faizabad Hub), Uttar Pradesh - 224001, India
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Studio working hours: Monday to Saturday, 10:00 AM - 8:00 PM IST.
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-950 space-y-1.5">
                  <span className="font-bold text-xs flex items-center gap-1.5 text-emerald-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>24-Hour DMCA Guarantee</span>
                  </span>
                  <p className="text-[11px] text-emerald-900/90 leading-relaxed">
                    Copyright holders requesting removal of unauthorized remixes are prioritized and resolved within 24 to 48 business hours with confirmation reply.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 3: PRIVACY POLICY */}
        {slug === 'privacy-policy' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-2 pb-1 border-b">
                Privacy Policy (Google AdSense, Cookies &amp; Data Rights)
              </h2>
              <p className="text-gray-600 leading-relaxed">
                At <strong>{settings.siteName}</strong>, accessible via <strong>{settings.siteUrl}</strong>, the privacy of our visitors is of paramount importance to us. This Privacy Policy document outlines the types of personal information collected and recorded by {settings.siteName} and how we utilize it in accordance with Indian IT Laws, GDPR, and Google AdSense publisher policies.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 text-xs mb-1.5 uppercase tracking-wide">
                1. Google DoubleClick DART Cookies &amp; AdSense
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Google is a third-party vendor on our site. It uses cookies, commonly known as DART cookies, to serve ads to our site visitors based upon their visit to {settings.siteName} and other sites on the Internet. Visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at:
              </p>
              <div className="bg-gray-50 p-2.5 rounded border border-gray-200 mt-2 font-mono text-[11px] text-emerald-800 break-all">
                https://policies.google.com/technologies/ads
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 text-xs mb-1.5 uppercase tracking-wide">
                2. Server Log Files &amp; Download Tracking
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Like most standard web servers, {settings.siteName} utilizes log files. These files merely log visitors to the site—usually a standard procedure for hosting companies and part of hosting services' analytics. The information inside the log files includes Internet Protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamp, referring/exit pages, and number of clicks. These are not linked to any information that is personally identifiable. The sole purpose of the information is for analyzing trends, preventing DDoS abuse, tracking genuine song download counts, and administering the portal.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 text-xs mb-1.5 uppercase tracking-wide">
                3. Third Party Advertising Partners
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Some of our advertising partners may use cookies and web beacons on our site. Our advertising partners include Google AdSense. Each of our advertising partners has their own Privacy Policy for their policies on user data.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 text-xs mb-1.5 uppercase tracking-wide">
                4. User Data Protection &amp; Inquiries
              </h3>
              <p className="text-gray-600 leading-relaxed">
                If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <strong>{settings.adminEmail}</strong>.
              </p>
            </div>
          </div>
        )}

        {/* PAGE 4: TERMS AND CONDITIONS */}
        {slug === 'terms-and-conditions' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-2 pb-1 border-b">
                Terms of Service &amp; Audio Usage Agreement
              </h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing this website, you are agreeing to be bound by these website Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 text-xs mb-1.5 uppercase tracking-wide">
                1. Promotional Listening License
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Permission is granted to stream and download one temporary copy of any audio track on {settings.siteName} for personal, non-commercial transitory listening only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600 text-xs">
                <li>Modify or copy commercial song stems for reselling.</li>
                <li>Use the audio materials for any commercial broadcast without original rights holder clearance.</li>
                <li>Attempt to decompile or reverse engineer any software running on the server.</li>
                <li>Remove any copyright or other proprietary notations from the materials.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 text-xs mb-1.5 uppercase tracking-wide">
                2. Disclaimer of Warranties
              </h3>
              <p className="text-gray-600 leading-relaxed">
                The materials on {settings.siteName} are provided "as is". {settings.siteName} makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 text-xs mb-1.5 uppercase tracking-wide">
                3. Site Terms of Use Modifications
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {settings.siteName} may revise these terms of use for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms and Conditions of Use.
              </p>
            </div>
          </div>
        )}

        {/* PAGE 5: DMCA DISCLAIMER */}
        {slug === 'disclaimer' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-2 pb-1 border-b">
                DMCA Copyright Disclaimer &amp; Takedown Procedure
              </h2>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-3.5 rounded-r text-amber-900 text-xs leading-relaxed my-3">
                <strong>Legal Notice:</strong> {settings.siteName} is a promotional audio showcase. All original musical compositions, lyrics, and master recordings belong exclusively to their respective record labels, authors, and copyright holders.
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 text-xs mb-1.5 uppercase tracking-wide">
                Safe Harbor Compliance (17 U.S.C. § 512 &amp; Indian IT Act)
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {settings.siteName} complies with the Digital Millennium Copyright Act (DMCA) and Indian Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules. It is our policy to respond immediately to any infringement notices and take appropriate action.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 text-xs mb-1.5 uppercase tracking-wide">
                How to Submit a DMCA Takedown Notice
              </h3>
              <p className="text-gray-600 leading-relaxed mb-2">
                If your copyrighted work has been posted on {settings.siteName} or if links to your copyrighted work are returned through our search engine and you wish to have this material removed, please send a written notification to <strong>{settings.adminEmail}</strong> providing the following details:
              </p>
              <ol className="list-decimal pl-5 space-y-1.5 text-gray-700 text-xs">
                <li>Provide physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
                <li>Identify the copyrighted work claimed to have been infringed (title, artist, album).</li>
                <li>Identify the exact URL slug on {settings.siteName} where the alleged material is located (e.g. <code>{settings.siteUrl}/song/song-name</code>).</li>
                <li>Provide your full contact information, including physical mailing address, telephone number, and official corporate email address.</li>
                <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
              </ol>
            </div>

            <div className="bg-red-50 border border-red-200 p-3.5 rounded-lg text-red-900 text-xs">
              <span className="font-bold block mb-1">Guaranteed Removal Timeframe:</span>
              Please allow 24 to 48 business hours for an email response and automatic removal of the file from our CDN storage servers.
            </div>
          </div>
        )}

        {/* PAGE 6: SITEMAP (HTML & XML) */}
        {slug === 'sitemap' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between border-b pb-3 gap-2">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Site Directory &amp; Sitemap Index
                </h2>
                <p className="text-xs text-gray-500">
                  Comprehensive index of all canonical URLs, published songs, categories, and legal pages.
                </p>
              </div>

              {/* HTML / XML Tabs */}
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setSitemapTab('html')}
                  className={`text-xs px-3 py-1 rounded font-bold transition cursor-pointer ${
                    sitemapTab === 'html' ? 'bg-white text-emerald-800 shadow-xs' : 'text-gray-600'
                  }`}
                >
                  HTML Index
                </button>
                <button
                  onClick={() => setSitemapTab('xml')}
                  className={`text-xs px-3 py-1 rounded font-bold transition cursor-pointer ${
                    sitemapTab === 'xml' ? 'bg-white text-emerald-800 shadow-xs' : 'text-gray-600'
                  }`}
                >
                  Raw XML View
                </button>
              </div>
            </div>

            {sitemapTab === 'html' ? (
              <div className="space-y-6">
                {/* 1. Static Pages */}
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wide text-gray-700 mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Official Portal &amp; Legal Pages ({ALL_STATIC_PAGES.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ALL_STATIC_PAGES.map((p) => (
                      <button
                        key={p.slug}
                        onClick={() => onNavigateToPage(p.slug)}
                        className="p-2.5 rounded border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <span className="font-bold text-xs text-gray-900 group-hover:text-emerald-800 block">
                            {p.title}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">/page/{p.slug}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-700" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Categories */}
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wide text-gray-700 mb-2 flex items-center gap-1.5">
                    <Folder className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Music Folders &amp; Categories ({allCategories.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {allCategories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => onSelectCategory(c)}
                        className="p-2.5 rounded border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <span className="font-bold text-xs text-gray-900 group-hover:text-emerald-800 block">
                            {c.name}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">/category/{c.slug}</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {c.count} Files
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Albums */}
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wide text-gray-700 mb-2 flex items-center gap-1.5">
                    <Disc className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Albums &amp; Compilations ({allAlbums.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {allAlbums.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => onSelectAlbum(a)}
                        className="p-2.5 rounded border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition flex items-center justify-between group cursor-pointer"
                      >
                        <div className="truncate">
                          <span className="font-bold text-xs text-gray-900 group-hover:text-emerald-800 block truncate">
                            {a.name}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">/album/{a.slug}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-700 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Songs */}
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wide text-gray-700 mb-2 flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Index of All Songs &amp; DJ Remixes ({allSongs.length})</span>
                  </h3>
                  <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                    {allSongs.map((s) => (
                      <div
                        key={s.id}
                        className="p-2.5 flex items-center justify-between text-xs hover:bg-gray-50 transition"
                      >
                        <div>
                          <button
                            onClick={() => onSelectSong(s)}
                            className="font-bold text-gray-900 hover:text-emerald-700 text-left block hover:underline"
                          >
                            {s.title}
                          </button>
                          <span className="text-[10px] text-gray-400 font-mono">
                            /song/{s.slug} • {s.singer} ({s.bitrate})
                          </span>
                        </div>
                        <button
                          onClick={() => onSelectSong(s)}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded border border-emerald-300 shrink-0 cursor-pointer"
                        >
                          View Track
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Standard XML sitemap formatted for Google Search Console &amp; Bing Webmaster.
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(rawXmlSitemap);
                      setCopiedXml(true);
                      setTimeout(() => setCopiedXml(false), 2000);
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-3 py-1 rounded border border-gray-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedXml ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedXml ? 'Copied XML!' : 'Copy Raw XML'}</span>
                  </button>
                </div>

                <div className="bg-gray-950 text-emerald-400 p-4 rounded-lg font-mono text-[11px] overflow-auto max-h-96 border border-gray-800">
                  <pre>{rawXmlSitemap}</pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PAGE 7: FAQS & HELP */}
        {slug === 'faqs' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-2 pb-1 border-b">
                Frequently Asked Questions ({settings.siteName})
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Everything you need to know about downloading 320 Kbps audio, ringtones, player controls, and submitting your own DJ remixes.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 text-sm mb-1.5 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">1</span>
                  Is downloading music from {settings.siteName} 100% free?
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Yes, absolutely. All audio streams, 320 Kbps master MP3 files, 192 Kbps, 128 Kbps, and 30-second mobile ringtones are completely free for promotional and listening purposes with zero registration fees.
                </p>
              </div>

              <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 text-sm mb-1.5 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">2</span>
                  What makes 320 Kbps audio superior for DJ roadshows and cars?
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Standard downloads on other sites are often compressed to 64 Kbps or 96 Kbps, which distorts bass and clips high frequencies. Our 320 Kbps CBR studio masters retain deep sub-frequencies (32Hz–60Hz) that drive large subwoofers cleanly without distortion.
                </p>
              </div>

              <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 text-sm mb-1.5 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">3</span>
                  How do I set a downloaded track as my phone ringtone?
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  On the song page, click on <strong>"M4R / Ringtone (30s)"</strong>. Once downloaded to your device, navigate to your phone's <em>Settings &gt; Sound &amp; Vibration &gt; Phone Ringtone</em> and select the downloaded clip.
                </p>
              </div>

              <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 text-sm mb-1.5 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">4</span>
                  Can I submit my own DJ remix to be featured on {settings.siteName}?
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Yes! Verified DJ artists and remixers can submit tracks using our Contact desk or through the DJ Upload Guidelines page. We require uncompressed WAV/MP3 files at 320 Kbps with proper metadata.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 8: UPLOAD GUIDELINES */}
        {slug === 'upload-guidelines' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-2 pb-1 border-b">
                DJ Remix Upload Guidelines &amp; Audio Standards
              </h2>
              <p className="text-gray-600 leading-relaxed">
                To maintain the highest acoustic fidelity on {settings.siteName}, all submitted DJ remixes, roadshow dholki mixes, and mashups must comply with the following technical specifications.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-emerald-200 bg-emerald-50/40 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 text-xs mb-2 flex items-center gap-1.5 text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Technical Requirements
                </h3>
                <ul className="space-y-2 text-xs text-gray-600 list-disc list-inside">
                  <li><strong>Bitrate:</strong> 320 Kbps Constant Bitrate (CBR) or 44.1kHz 16-bit WAV.</li>
                  <li><strong>Mastering:</strong> Peak limiter ceiling at -0.3 dB TP; Integrated LUFS between -9 LUFS and -7 LUFS for club/roadshow edits.</li>
                  <li><strong>Bass Balance:</strong> Sub-bass centered (Mono sub below 90Hz) to prevent phase cancellation on roadshow setups.</li>
                  <li><strong>Artwork:</strong> 1000x1000 JPG/PNG square cover art with clear title and DJ credits.</li>
                </ul>
              </div>

              <div className="border border-amber-200 bg-amber-50/40 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 text-xs mb-2 flex items-center gap-1.5 text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Submission Policies &amp; Prohibitions
                </h3>
                <ul className="space-y-2 text-xs text-gray-600 list-disc list-inside">
                  <li>No ear-rape clipping or heavily distorted audio files.</li>
                  <li>No promotional voice drops every 5 seconds; voice drops must not overwhelm the vocal line.</li>
                  <li>Full artist, singer, composer, and original song owner credit must be provided.</li>
                  <li>DMCA compliant: Any track requested for removal by the legal rights holder will be promptly unlisted.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Bottom Navigation Grid Interconnecting All Pages */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-xs font-bold text-gray-800 uppercase mb-3 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-emerald-700" />
          <span>All Pages &amp; Direct Links</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {ALL_STATIC_PAGES.map((pg) => {
            const isCurrent = pg.slug === slug;
            return (
              <button
                key={pg.slug}
                onClick={() => onNavigateToPage(pg.slug)}
                className={`p-2.5 rounded-lg border text-center transition flex flex-col items-center justify-center cursor-pointer ${
                  isCurrent
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                    : 'border-gray-200 hover:border-emerald-400 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <FileText className={`w-4 h-4 mb-1 ${isCurrent ? 'text-emerald-700' : 'text-gray-400'}`} />
                <span className="text-[11px] font-semibold line-clamp-1">{pg.shortTitle}</span>
                <span className="text-[9px] text-gray-400 font-mono mt-0.5">/page/{pg.slug}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
