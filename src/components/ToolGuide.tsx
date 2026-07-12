import React, { useState } from "react";
import { HelpCircle, Sparkles, BookOpen, Layers, CheckCircle, ChevronDown, ChevronUp, Share2, Pin, ShieldCheck } from "lucide-react";
import { ALL_TOOLS } from "../data";

interface ToolGuideProps {
  toolId: string;
  category: string;
  onSelectTool?: (id: string | null) => void;
  favorites?: any[];
  onToggleFavorite?: (id: string) => void;
  onTriggerNotification?: (title: string, desc: string) => void;
}

export default function ToolGuide({
  toolId,
  category,
  onSelectTool,
  favorites = [],
  onToggleFavorite,
  onTriggerNotification,
}: ToolGuideProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const currentTool = ALL_TOOLS.find((t) => t.id === toolId);
  if (!currentTool) return null;

  // Generate dynamic, realistic SEO details, FAQ, Features, and Guides
  const getToolMetadata = () => {
    const name = currentTool.name;
    const desc = currentTool.description;

    const baseData = {
      description: desc,
      howToUse: [
        `Select the input parameter or upload your source files using our clean drag-and-drop landing area.`,
        `Configure your processing metrics, custom formats, compression rates, or tone options.`,
        `Click the main processing action button to compute high-performance results instantly.`,
        `Preview your generated output on our sleek interactive display and download your files securely.`
      ],
      features: [
        `100% Secure & Client-Centered: Your assets never touch external databases unless AI models are queried.`,
        `Ultra-Responsive Layout: Fully compatible across both wide desktop screens and mobile touch targets.`,
        `Instant High-Speed Execution: Powered by local canvas triggers and optimized server-side caches.`,
        `Dynamic History Tracking: Saves your recent operations automatically to your workspace history panel.`
      ],
      faq: [
        {
          q: `Is my data securely protected during conversion?`,
          a: `Absolutely! All conversion algorithms run directly in your local browser sandbox or within highly secure, temporary in-memory server channels. We do not store, catalog, or inspect any of your uploaded files.`
        },
        {
          q: `Does this utility support batch file processing?`,
          a: `Yes! Pro and Team tier memberships unlock high-speed bulk concurrent processing, allowing you to convert, resize, or compress up to 50 files simultaneously.`
        },
        {
          q: `How do I share the generated results?`,
          a: `Simply click the 'Share Link' button at the top of the workspace. This generates a temporary encrypted link that your colleagues can visit to view or download the results.`
        }
      ],
      seo: {
        title: `${name} | All Tools Professional Online Utilities`,
        description: `Optimize your workspace workflow with our free ${name}. ${desc} Access instructions, features, FAQs, and developer tools.`,
        keywords: `${name.toLowerCase()}, online converter, free tools, saas suite, all tools workspace, ${category.toLowerCase()} tools`
      }
    };

    // Add specialized details for key requested tools to make them ultra high-fidelity
    if (toolId.startsWith("ai-")) {
      baseData.howToUse = [
        `Enter your text draft, prompt keywords, or upload files into the AI input field.`,
        `Select your desired tone of voice, professional style, and target draft length.`,
        `Click generate to execute server-side processing powered by Gemini 3.5 Flash.`,
        `Review the generated copy, copy to clipboard, or click regenerate to explore alternative variations.`
      ];
      baseData.features = [
        `Powered by Gemini 3.5 Flash for high-speed, high-intelligence contextual generations.`,
        `Maintains full formatting, lists, and headings so they are production-ready.`,
        `SEO Optimized algorithms to naturally inject keywords into headers and summaries.`,
        `Unlimited history logs and one-click copy indicators.`
      ];
      baseData.faq.push({
        q: `What is the daily usage limit for the AI generator?`,
        a: `Free accounts receive 10 daily credits. Upgrading to our Pro tier unlocks completely unlimited Gemini-powered generations with priority queue processing speeds.`
      });
    } else if (category === "PDF") {
      baseData.howToUse = [
        `Drag and drop your PDF or office documents into the high-contrast upload zone.`,
        `Reorder pages, set password encryption keys, or type signature stamps as required.`,
        `Initiate processing to apply standard PDF layout and alignment parsers.`,
        `Download your clean, fully aligned DOCX, XLSX, or compressed PDF result instantly.`
      ];
      baseData.features = [
        `Maintains absolute layout fidelity, original spacing, and font metrics.`,
        `Secured with advanced high-entropy AES password encryption rules.`,
        `Compatible with standard doc types: PDF, DOCX, XLSX, PPTX, and vector images.`,
        `One-click electronic signatures with clean hand-drawn visual scaling.`
      ];
    } else if (category === "Calculator") {
      baseData.howToUse = [
        `Select your target calculations template (Amortizations, BMI body index, or Percentages).`,
        `Fill out the numeric input parameters (principals, interest rates, weights, or heights).`,
        `The calculator updates instantly on every keystroke with highly detailed charts or tables.`,
        `Download the generated financial amortization table or health advice report.`
      ];
      baseData.features = [
        `Dynamic Live Updating: Values recalculate in real-time as you type.`,
        `Detailed Amortization Timelines: Access granular breakdown tables of monthly compound results.`,
        `Universal Scales: Easily toggle between metric and imperial measuring standards.`
      ];
    } else if (toolId === "temp-mail") {
      baseData.howToUse = [
        `Open the Temp Mail workspace to automatically spawn a brand new, random temporary email address.`,
        `Click 'Copy Email' to instantly copy the generated mailbox to your computer clipboard.`,
        `Use this address when signing up for services, downloading PDFs, or testing verification alerts.`,
        `Watch the live dashboard. Incoming messages will populate your secure inbox in real-time.`
      ];
      baseData.features = [
        `10-Minute Expiry protection: Automated trash cycles sweep the temporary mailbox regularly.`,
        `Live WebSocket Triggers: Real incoming test triggers let you test inbox behavior instantly.`,
        `Attachment Safe: Read, display, and audit rich HTML mail layouts without risk of malware.`
      ];
    } else if (toolId === "url-shortener") {
      baseData.howToUse = [
        `Paste your extremely long link into our high-performance url input field.`,
        `Set a customizable short alias or enable password protection rules if desired.`,
        `Click 'Shorten Link' to immediately generate a functional, fast, and secure short URL.`,
        `Download the custom generated high-fidelity QR Code to share on social media or print materials.`
      ];
      baseData.features = [
        `Real Redirections: True HTTP 302 redirections active on this platform domain.`,
        `Dynamic QR Codes: Beautiful high-contrast vector code download files.`,
        `Complete click count and referrer tracking charts on your premium user dashboard.`
      ];
    }

    return baseData;
  };

  const meta = getToolMetadata();

  // Find related tools (excluding current tool, same category, max 3)
  const relatedTools = ALL_TOOLS.filter((t) => t.category === category && t.id !== toolId).slice(0, 3);

  const handleShare = () => {
    const url = `${window.location.origin}/tools/${toolId}`;
    navigator.clipboard.writeText(url);
    if (onTriggerNotification) {
      onTriggerNotification(
        "SEO Link Copied! 🔗",
        `Sharing URL for ${currentTool.name} has been copied to your clipboard.`
      );
    }
  };

  const isFavorited = favorites.some((f: any) => f.toolId === toolId);

  return (
    <div id={`seo-guide-${toolId}`} className="mt-12 pt-10 border-t border-neutral-800 space-y-8 font-sans">
      
      {/* 1. Header with Share / Favorite */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-xl p-5">
        <div>
          <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">SEO Optimized Route: /tools/{toolId}</span>
          <h3 className="text-xl font-bold text-white mt-1">Complete User Guide & Metadata</h3>
          <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{meta.description}</p>
        </div>

        <div className="flex items-center gap-2">
          {onToggleFavorite && (
            <button
              onClick={() => {
                onToggleFavorite(toolId);
                if (onTriggerNotification) {
                  onTriggerNotification(
                    isFavorited ? "Pinned Shortcut Removed" : "Shortcut Pinned! 📌",
                    `The ${currentTool.name} has been updated in your left category shortcut rail.`
                  );
                }
              }}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border cursor-pointer ${isFavorited ? "bg-amber-950/20 text-amber-400 border-amber-900/50" : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white"}`}
            >
              <Pin className={`w-3.5 h-3.5 ${isFavorited ? "rotate-0 fill-amber-400" : "rotate-45"}`} />
              <span>{isFavorited ? "Pinned" : "Pin Tool"}</span>
            </button>
          )}

          <button
            onClick={handleShare}
            className="px-3 py-2 bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Page</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Guide Body (Two columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: How to use */}
        <div className="bg-neutral-900/40 border border-neutral-850 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-indigo-400">
            <BookOpen className="w-4 h-4 shrink-0" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-sans">How to Use this Tool</h4>
          </div>

          <ol className="space-y-3.5">
            {meta.howToUse.map((step, idx) => (
              <li key={idx} className="flex gap-3 text-xs leading-relaxed text-neutral-300">
                <span className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-800 text-indigo-400 font-bold font-mono flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Right: Key Features */}
        <div className="bg-neutral-900/40 border border-neutral-850 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-indigo-400">
            <Sparkles className="w-4 h-4 shrink-0" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-sans">Key Features & Alignment</h4>
          </div>

          <ul className="space-y-3">
            {meta.features.map((feat, idx) => (
              <li key={idx} className="flex gap-2.5 text-xs leading-relaxed text-neutral-300">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 3. Collapsible FAQs */}
      <div className="bg-neutral-900/30 border border-neutral-850 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-indigo-400">
          <HelpCircle className="w-4 h-4 shrink-0" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-sans">Frequently Asked Questions</h4>
        </div>

        <div className="space-y-2">
          {meta.faq.map((item, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <div key={idx} className="border border-neutral-800/60 rounded-lg overflow-hidden bg-neutral-950/30">
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                  className="w-full flex justify-between items-center p-3 text-left text-xs font-semibold text-white hover:bg-neutral-900 transition-colors cursor-pointer"
                >
                  <span>🙋 {item.q}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                </button>
                {isExpanded && (
                  <div className="px-4 py-3 border-t border-neutral-800/40 bg-neutral-950/60 text-xs text-neutral-400 leading-relaxed font-sans">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Related Tools Carousel/Row */}
      {relatedTools.length > 0 && onSelectTool && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-400">
            <Layers className="w-4 h-4 shrink-0" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-sans">Related {category} Tools</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => onSelectTool(tool.id)}
                className="group p-4 rounded-xl bg-neutral-900 border border-neutral-850 hover:border-indigo-500/50 hover:bg-neutral-850/60 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <h5 className="font-semibold text-sm text-neutral-200 group-hover:text-white transition-colors">{tool.name}</h5>
                  <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2 leading-relaxed">{tool.description}</p>
                </div>
                <div className="mt-3 text-[10px] text-indigo-400 font-bold group-hover:underline flex items-center gap-1">
                  <span>Open workspace</span>
                  <span className="font-mono">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Elegant SEO Meta Tag Visual Representation */}
      <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-5 space-y-3 font-mono text-[11px]">
        <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Active Indexing Headers
          </span>
          <span className="text-[9px] bg-indigo-950/50 border border-indigo-900/60 text-indigo-400 px-2 py-0.5 rounded-full font-bold">SEO METADATA INJECTED</span>
        </div>

        <div className="space-y-2 text-neutral-400">
          <div>
            <span className="text-indigo-400 font-bold">&lt;title&gt;</span>
            <span className="text-white"> {meta.seo.title} </span>
            <span className="text-indigo-400 font-bold">&lt;/title&gt;</span>
          </div>

          <div>
            <span className="text-neutral-500">&lt;meta name="description" content="</span>
            <span className="text-neutral-300">{meta.seo.description}</span>
            <span className="text-neutral-500">" /&gt;</span>
          </div>

          <div>
            <span className="text-neutral-500">&lt;meta name="keywords" content="</span>
            <span className="text-neutral-300">{meta.seo.keywords}</span>
            <span className="text-neutral-500">" /&gt;</span>
          </div>

          <div>
            <span className="text-neutral-500">&lt;link rel="canonical" href="</span>
            <span className="text-indigo-400">https://alltools.com/tools/{toolId}</span>
            <span className="text-neutral-500">" /&gt;</span>
          </div>
        </div>
      </div>

    </div>
  );
}
