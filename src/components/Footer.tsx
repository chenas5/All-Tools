import React from "react";
import { Sparkles, Globe, ShieldCheck, Heart, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="platform-footer" className="bg-neutral-950 border-t border-neutral-850 py-12 text-neutral-400 mt-20 transition-colors font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main link grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Company branding summary */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={scrollToTop}>
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-[1px] shadow-md shadow-indigo-950/20">
                <div className="w-full h-full rounded-[7px] bg-neutral-900 flex items-center justify-center transition-colors group-hover:bg-neutral-850">
                  <span className="font-extrabold text-[10px] tracking-tighter bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    A
                  </span>
                  <span className="font-extrabold text-[10px] tracking-tighter text-white -ml-0.5">
                    T
                  </span>
                </div>
              </div>
              <span className="text-sm font-bold text-white tracking-tight">
                All <span className="text-indigo-400">Tools</span>
              </span>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-sm">
              An all-in-one unified SaaS workspace built for students, developers, content creators, and businesses to access fast, offline-first utilities without privacy intrusions.
            </p>
          </div>

          {/* Column 1: Core Tools */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Tools Suite</h5>
            <ul className="space-y-1.5 text-xs">
              <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Gemini AI Writer</span></li>
              <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">PDF Amalgamator</span></li>
              <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Image & QR Processor</span></li>
              <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Developer Digests</span></li>
              <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Temporary Mailboxes</span></li>
            </ul>
          </div>

          {/* Column 2: Developers */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Platform</h5>
            <ul className="space-y-1.5 text-xs">
              <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Developer API Docs</span></li>
              <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Affiliate Portal</span></li>
              <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Changelog v3.2</span></li>
              <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Infrastructure Status</span></li>
              <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Community GitHub</span></li>
            </ul>
          </div>

          {/* Column 3: Legal Footer */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Legal Core</h5>
            <ul className="space-y-1.5 text-xs">
              <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Privacy Protocol</span></li>
              <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Cookie Policy</span></li>
              <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">SLA & Refund Rules</span></li>
              <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">GDPR Compliance</span></li>
            </ul>
          </div>

        </div>

        {/* Small copyright footnotes */}
        <div className="border-t border-neutral-850 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-neutral-500">
            <span>© 2026 All Tools Inc.</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              Secure AES SSL Encryption Sandbox
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-850 text-xs text-neutral-300 hover:text-white rounded-lg flex items-center gap-1 cursor-pointer border border-neutral-850"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>

      </div>
    </footer>
  );
}
