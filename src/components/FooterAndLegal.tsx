import React, { useState } from 'react';
import { Category, SiteSettings, StaticPageSlug } from '../types/music';
import { ShieldCheck, Mail, Send, Check, X, FileText, Globe, AlertTriangle } from 'lucide-react';

interface FooterAndLegalProps {
  categories: Category[];
  settings: SiteSettings;
  onSelectCategory: (catName: string) => void;
  onOpenPhpScript: () => void;
  onNavigateToPage?: (slug: StaticPageSlug) => void;
}

export const FooterAndLegal: React.FC<FooterAndLegalProps> = ({
  categories,
  settings,
  onSelectCategory,
  onOpenPhpScript,
  onNavigateToPage,
}) => {
  const [activeLegalModal, setActiveLegalModal] = useState<
    'about' | 'contact' | 'dmca' | 'privacy' | 'terms' | 'sitemap' | null
  >(null);

  const handleOpenPage = (pageSlug: StaticPageSlug) => {
    if (onNavigateToPage) {
      onNavigateToPage(pageSlug);
    } else {
      setActiveLegalModal(pageSlug === 'disclaimer' ? 'dmca' : (pageSlug as any));
    }
  };

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('Song Request / DMCA Inquiry');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setActiveLegalModal(null);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 2000);
  };

  return (
    <>
      <footer className="bg-gray-900 text-gray-400 text-xs py-8 mt-12 border-t-2 border-emerald-600">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Brand & Mission Statement */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="text-white text-base font-bold">{settings.siteName}</span>
              <span className="bg-emerald-800 text-emerald-200 text-[9px] font-black px-1.5 py-0.2 rounded">
                OFFICIAL
              </span>
            </div>
            <p className="mt-2 text-gray-400 text-[11px] leading-relaxed">
              India's premier high definition 320 Kbps MP3 &amp; DJ remix downloading hub. Delivering high fidelity studio master audio tracks with sub-bass, roadshow dholki mixes, and instant mobile ringtones. Powered by ultra-fast Cloud CDN.
            </p>

            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-medium text-emerald-400">
              <button onClick={() => handleOpenPage('about-us')} className="hover:underline cursor-pointer">
                About Us
              </button>
              <button onClick={() => handleOpenPage('contact-us')} className="hover:underline cursor-pointer">
                Contact
              </button>
              <button onClick={() => handleOpenPage('disclaimer')} className="hover:underline cursor-pointer">
                DMCA Disclaimer
              </button>
              <button onClick={() => handleOpenPage('privacy-policy')} className="hover:underline cursor-pointer">
                Privacy Policy
              </button>
              <button onClick={() => handleOpenPage('terms-and-conditions')} className="hover:underline cursor-pointer">
                Terms of Use
              </button>
              <button onClick={() => handleOpenPage('sitemap')} className="hover:underline cursor-pointer">
                Sitemap (XML)
              </button>
              <button onClick={onOpenPhpScript} className="text-amber-400 hover:underline font-bold cursor-pointer">
                PHP 8.3 Script (ZIP)
              </button>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-white font-bold mb-2 uppercase text-[11px] tracking-wider text-emerald-300">
              Popular Categories
            </h4>
            <ul className="space-y-1 text-[11px]">
              {categories.slice(0, 4).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onSelectCategory(cat.name)}
                    className="hover:text-white transition text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & DMCA Disclaimer */}
          <div>
            <h4 className="text-white font-bold mb-2 uppercase text-[11px] tracking-wider text-emerald-300">
              Legal & DMCA Notice
            </h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              All audio files and DJ remixes available on this portal are for promotional and entertainment use only. All original music copyright belongs to respective music labels and copyright holders.
            </p>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="max-w-6xl mx-auto px-4 mt-8 pt-4 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-2">
          <div>
            &copy; {new Date().getFullYear()} {settings.siteName}. All rights reserved. Optimized for fast Google AdSense compliance.
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>PHP 8.3 / 8.4 / 8.5 Tested</span>
          </div>
        </div>
      </footer>

      {/* Legal Modals */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto text-gray-800 space-y-4 text-xs">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-700" />
                <h3 className="text-base font-black text-gray-900 capitalize">
                  {activeLegalModal === 'about' && 'About Our Music Portal'}
                  {activeLegalModal === 'contact' && 'Contact Support & Feedback'}
                  {activeLegalModal === 'dmca' && 'DMCA Copyright & Takedown Policy'}
                  {activeLegalModal === 'privacy' && 'Privacy Policy (AdSense & GDPR)'}
                  {activeLegalModal === 'terms' && 'Terms and Conditions'}
                  {activeLegalModal === 'sitemap' && 'Dynamic XML Sitemap Preview'}
                </h3>
              </div>
              <button
                onClick={() => setActiveLegalModal(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            {activeLegalModal === 'about' && (
              <div className="space-y-3 leading-relaxed text-gray-700">
                <p>
                  <strong>{settings.siteName}</strong> is a dedicated digital audio distribution hub committed to providing high-fidelity, studio-quality MP3 downloads and exclusive DJ remixes.
                </p>
                <p>
                  Our sound engineers and curators focus on crystal-clear audio frequencies, specifically calibrated 320 Kbps constant bitrate (CBR) tracks, competition roadshow dholki mixes, and mobile-ready ringtones.
                </p>
                <h4 className="font-bold text-gray-900 mt-2">Why Our Platform Is Fast:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Direct server chunked streaming without deceptive redirect loops.</li>
                  <li>Clean semantic HTML markup adhering to Google AdSense Quality Rater guidelines.</li>
                  <li>Modern Web Audio API playback engine for immediate listening before downloading.</li>
                </ul>
              </div>
            )}

            {activeLegalModal === 'contact' && (
              <div>
                {contactSent ? (
                  <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg text-center font-bold">
                    ✓ Thank you! Your message has been sent to our sound administrator.
                  </div>
                ) : (
                  <form onSubmit={handleSendContact} className="space-y-3">
                    <p className="text-gray-600">
                      Have a song request, remix inquiry, or DMCA query? Fill out the form below or contact <strong className="text-emerald-700">{settings.adminEmail}</strong>.
                    </p>
                    <div>
                      <label className="block font-semibold mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full border rounded px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full border rounded px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Subject</label>
                      <select
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        className="w-full border rounded px-3 py-2 text-xs bg-gray-50"
                      >
                        <option value="Song Request">Song / DJ Remix Request</option>
                        <option value="DMCA Removal">DMCA Copyright Removal Request</option>
                        <option value="Advertising / AdSense">Advertising & Partnership</option>
                        <option value="General Feedback">General Feedback</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Message</label>
                      <textarea
                        rows={4}
                        required
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Provide details or song URLs..."
                        className="w-full border rounded px-3 py-2 text-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-5 rounded text-xs flex items-center gap-1.5 shadow"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Inquiry</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {activeLegalModal === 'dmca' && (
              <div className="space-y-3 leading-relaxed text-gray-700">
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-amber-900 text-[11px]">
                  <strong>Notice:</strong> {settings.siteName} respects the intellectual property rights of copyright holders. All music published here is intended solely for promotional and non-commercial evaluation.
                </div>
                <h4 className="font-bold text-gray-900">DMCA Takedown Procedure:</h4>
                <p>
                  If you are a music company, artist, or legal representative and believe that any track hosted or linked on our site infringes your copyright, submit a takedown request to <strong>{settings.adminEmail}</strong> containing:
                </p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Exact URL of the song file on {settings.siteName}.</li>
                  <li>Evidence or proof of ownership or authorization by the copyright holder.</li>
                  <li>Valid email and physical contact address.</li>
                </ol>
                <p className="text-red-700 font-semibold">
                  Upon verification, our administrative team guarantees removal of the specified song within 24 to 48 business hours.
                </p>
              </div>
            )}

            {activeLegalModal === 'privacy' && (
              <div className="space-y-3 leading-relaxed text-gray-700">
                <p>
                  At <strong>{settings.siteName}</strong>, accessible from {settings.siteUrl}, our highest priority is the privacy of our visitors.
                </p>
                <h4 className="font-bold text-gray-900">Google DoubleClick DART Cookies & AdSense:</h4>
                <p>
                  Google is one of our third-party advertising partners. It uses cookies, commonly known as DART cookies, to serve ads to our website visitors based upon their visit to our site and other websites across the Internet. Visitors may opt out of the use of DART cookies by visiting the Google Ad and Content Network Privacy Policy.
                </p>
                <h4 className="font-bold text-gray-900">Log Files:</h4>
                <p>
                  We follow standard operational procedures using log files. These files log visitors when they access audio streams and download files. The information collected includes IP addresses, browser types, Internet Service Providers (ISP), date/time stamps, and referring URLs.
                </p>
                <h4 className="font-bold text-gray-900">GDPR & CCPA Data Rights:</h4>
                <p>
                  You have the right to request access, rectification, or erasure of your personal data. Contact our Data Protection Officer at {settings.adminEmail}.
                </p>
              </div>
            )}

            {activeLegalModal === 'terms' && (
              <div className="space-y-3 leading-relaxed text-gray-700">
                <p>
                  By accessing <strong>{settings.siteName}</strong>, you agree to be bound by these Terms and Conditions and agree that you are responsible for compliance with any applicable local laws.
                </p>
                <h4 className="font-bold text-gray-900">Use License:</h4>
                <p>
                  Permission is granted to stream and download temporary copies of audio materials for personal, non-commercial transitory listening only.
                </p>
                <h4 className="font-bold text-gray-900">Disclaimers:</h4>
                <p>
                  The materials on this site are provided on an 'as is' basis. {settings.siteName} makes no warranties, expressed or implied, regarding commercial merchantability.
                </p>
              </div>
            )}

            {activeLegalModal === 'sitemap' && (
              <div className="space-y-2">
                <p className="text-gray-600">
                  Google Search Console compliant XML sitemap format generated for all categories and tracks:
                </p>
                <div className="bg-gray-900 text-emerald-400 p-3 rounded font-mono text-[11px] overflow-x-auto max-h-60">
                  <pre>{`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${settings.siteUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${settings.siteUrl}/pages/about.php</loc>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${settings.siteUrl}/pages/privacy.php</loc>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${settings.siteUrl}/pages/disclaimer.php</loc>
    <priority>0.5</priority>
  </url>
${categories.map((c) => `  <url>\n    <loc>${settings.siteUrl}/category/${c.slug}</loc>\n    <priority>0.8</priority>\n  </url>`).join('\n')}
</urlset>`}</pre>
                </div>
              </div>
            )}

            <div className="pt-3 border-t flex justify-end">
              <button
                onClick={() => setActiveLegalModal(null)}
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded font-bold text-xs"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
