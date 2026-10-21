import React, { useState } from 'react';
import { getPhpProjectFiles, PhpFileItem } from '../utils/phpCodeGenerator';
import JSZip from 'jszip';
import { 
  FileCode, Download, Copy, Check, Folder, Code2, 
  Terminal, ShieldCheck, CheckCircle2, ChevronRight, X
} from 'lucide-react';

interface PhpScriptModalProps {
  onClose: () => void;
}

export const PhpScriptModal: React.FC<PhpScriptModalProps> = ({ onClose }) => {
  const files = getPhpProjectFiles();
  const [selectedFile, setSelectedFile] = useState<PhpFileItem>(files[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Add all project files into zip
      files.forEach((file) => {
        zip.file(file.path, file.content);
      });

      // Add empty folders placeholders
      zip.folder('uploads/audio');
      zip.folder('uploads/artwork');
      zip.folder('logs');

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'stm_music_portal_php8_suite.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      setIsZipping(false);
      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 3000);
    } catch (err) {
      console.error('ZIP generation error:', err);
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl flex flex-col w-full max-w-6xl h-[92vh] overflow-hidden text-gray-100">
        
        {/* Header Bar */}
        <div className="bg-gray-800 px-5 py-3 border-b border-gray-700 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center shadow">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black text-white">
                  PHP 8.3 / 8.4 / 8.5 Song Downloading Script Suite
                </h2>
                <span className="bg-emerald-500 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  Production Ready
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                100% Complete cPanel/Apache/Nginx Package • Secure Admin Panel • AdSense Optimized • PDO MySQL
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Direct PHP Suite ZIP Download Link */}
            <a
              href="/djsongshub_php8_suite.zip"
              download="djsongshub_php8_suite.zip"
              className="bg-amber-400 hover:bg-amber-300 text-black font-black text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow transition"
              title="Download PHP 8.3-8.5 Website Suite ready for cPanel"
            >
              <Download className="w-4 h-4 text-black" />
              <span>Download PHP Suite (ZIP)</span>
              <span className="bg-red-600 text-white text-[9px] px-1 py-0.2 rounded font-black">
                43 KB
              </span>
            </a>

            {/* Complete Source Project ZIP */}
            <a
              href="/djsongshub_all_in_one_full_project.zip"
              download="djsongshub_all_in_one_full_project.zip"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow transition"
              title="Download Full Project Source Code (React + Vite + PHP)"
            >
              <Download className="w-4 h-4 text-white" />
              <span>Full Project Code (ZIP)</span>
            </a>

            <button
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-gray-300 p-2 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status / Alert Bar */}
        {zipSuccess && (
          <div className="bg-emerald-800 text-emerald-100 text-xs px-4 py-2 font-semibold flex items-center gap-2 border-b border-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Success! Downloaded stm_music_portal_php8_suite.zip containing all files, SQL schema, and setup guide.</span>
          </div>
        )}

        {/* Main Content: File Explorer & Code Viewer */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="w-full md:w-72 bg-gray-950 border-r border-gray-800 p-3 overflow-y-auto shrink-0 space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-2">
              Project Files ({files.length})
            </div>

            <div className="space-y-1">
              {files.map((file) => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-2.5 py-2 rounded-md text-xs font-mono flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/50'
                        : 'text-gray-300 hover:bg-gray-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-gray-500'}`} />
                      <span className="truncate">{file.path}</span>
                    </div>
                    {isSelected && <ChevronRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Quick Checklist for AdSense & Host */}
            <div className="mt-4 p-3 bg-gray-900 rounded-lg border border-gray-800 text-[11px] space-y-2">
              <span className="font-bold text-emerald-400 block">PHP 8.3+ Features Included:</span>
              <ul className="text-gray-400 space-y-1 text-[10px]">
                <li>✓ Strict types <code className="text-emerald-300">declare(strict_types=1);</code></li>
                <li>✓ Native PDO with prepared statements</li>
                <li>✓ Chunked download streaming (RAM safe)</li>
                <li>✓ Password hashing via <code className="text-emerald-300">bcrypt</code></li>
                <li>✓ Dynamic XML Sitemap for SEO</li>
                <li>✓ Responsive Tailwind CSS frontend</li>
              </ul>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 flex flex-col bg-[#0b0f19] overflow-hidden">
            {/* File Info Bar */}
            <div className="bg-gray-800/80 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-emerald-300 font-bold">{selectedFile.path}</span>
                <span className="text-[11px] text-gray-400 ml-3">{selectedFile.description}</span>
              </div>

              <button
                onClick={handleCopy}
                className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1.5 rounded flex items-center gap-1.5 transition font-semibold"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-gray-200 select-text">
              <pre>
                <code>{selectedFile.content}</code>
              </pre>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
