import React, { useState } from "react";
import { 
  Sparkles, ShieldCheck, Flame, Cpu, Star, Search, PlusCircle, HelpCircle, 
  ArrowRight, ShieldAlert, BadgeCheck, Check, Send, ChevronDown, ChevronUp, UserPlus,
  FileText, Terminal, Calculator
} from "lucide-react";
import { ToolDefinition, FavoriteItem, UserProfile } from "../types";
import { FAQS, TESTIMONIALS } from "../data";
import * as Icons from "lucide-react";

interface HeroProps {
  user: UserProfile | null;
  tools: ToolDefinition[];
  activeToolId: string | null;
  onSelectTool: (id: string | null) => void;
  favorites: FavoriteItem[];
  onToggleFavorite: (toolId: string) => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onTriggerNotification: (title: string, desc: string) => void;
  onOpenAuth: () => void;
}

export default function Hero({
  user,
  tools,
  activeToolId,
  onSelectTool,
  favorites,
  onToggleFavorite,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onTriggerNotification,
  onOpenAuth
}: HeroProps) {

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  // Helper to load dynamic icons safely
  const renderIcon = (iconName: string) => {
    const LucideIcon = (Icons as any)[iconName];
    return LucideIcon ? <LucideIcon className="w-5 h-5 text-indigo-400 shrink-0" /> : <Icons.HelpCircle className="w-5 h-5 text-indigo-400 shrink-0" />;
  };

  const isFavorited = (toolId: string) => favorites.some((f) => f.toolId === toolId);

  // Filter tools based on search and category
  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubscribed(true);
    onTriggerNotification(
      "Newsletter Subscribed! 📨", 
      "You have joined the ChenWave update list for new utilities and coupons."
    );
    setNewsletterEmail("");
  };

  // Pre-configured Featured Collections
  const collections = [
    {
      title: "Creator Copywriting Kit",
      iconName: "FileText",
      tools: ["ai-writer", "ai-summarizer"],
      desc: "Assemble rapid essays, marketing posts, and concise article summaries using Gemini 3.5 Flash."
    },
    {
      title: "Developer Productivity Kit",
      iconName: "Terminal",
      tools: ["json-formatter", "base64-converter", "hash-generator"],
      desc: "Prettify JSON trees, calculate native secure checksum hashes, and encode URL binaries client-side."
    },
    {
      title: "Daily Calculation Kit",
      iconName: "Calculator",
      tools: ["calculator-loan", "calculator-bmi", "calculator-percentage"],
      desc: "Estimate EMI amortizations, evaluate body mass health indexes, and balance fractional ratios."
    }
  ];

  const getCollectionIcon = (iconName: string) => {
    switch (iconName) {
      case "FileText": return <FileText className="w-4 h-4 text-indigo-400 shrink-0" />;
      case "Terminal": return <Terminal className="w-4 h-4 text-indigo-400 shrink-0" />;
      case "Calculator": return <Calculator className="w-4 h-4 text-indigo-400 shrink-0" />;
      default: return <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />;
    }
  };

  return (
    <div className="space-y-16">
      
      {/* CONDITIONAL HEADER: Welcome card for users, or Marketing Hero for visitors */}
      {user ? (
        <div className="p-6 bg-gradient-to-r from-neutral-900 to-indigo-950/25 border border-neutral-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans shadow-lg">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Welcome back, <span className="text-indigo-400 font-extrabold">{user.name}</span>! 👋
            </h3>
            <p className="text-xs text-neutral-400">
              Your <span className="text-indigo-400 font-semibold">{user.subscription} Plan</span> workspace is fully active and synchronized. Explore your high-performance tools below.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono bg-neutral-950 px-3.5 py-2 rounded-xl border border-neutral-850 w-fit shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-neutral-400">Credits Remaining:</span>
            <span className="text-indigo-400 font-bold">{user.creditsRemaining === 999999 ? "∞ Unlimited" : user.creditsRemaining}</span>
          </div>
        </div>
      ) : (
        /* HERO SECTION */
        <section className="relative text-center max-w-4xl mx-auto pt-8 pb-4 space-y-6">
          
          {/* Floating Accent pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/40 border border-indigo-900/60 text-indigo-300 text-xs font-semibold animate-bounce mx-auto">
            <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>V3.2 Release: Direct Gemini AI Writer Integrated</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight font-sans">
            Everything You Need.<br />
            <span className="text-indigo-500 bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">One Unified Platform.</span>
          </h1>

          <p className="text-base md:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Access hundreds of high-performance online utilities including Gemini-powered AI writing, PDF document merges, offline developer toolkits, instant temporary email, and absolute URL shortening.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={onOpenAuth}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all shadow-xl shadow-indigo-950/30 cursor-pointer"
            >
              Start Free Now
            </button>
            <button
              onClick={() => {
                onSelectCategory("All");
                document.getElementById("tool-grid-anchor")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 py-3 bg-neutral-900 border border-neutral-800 hover:bg-neutral-850 hover:text-white text-neutral-300 font-semibold text-sm rounded-xl transition-all cursor-pointer"
            >
              Explore All Tools
            </button>
          </div>

          {/* Hero Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-10 border-t border-neutral-850">
            {[
              { val: "500+", label: "Online Tools" },
              { val: "3.2M+", label: "Files Processed" },
              { val: "240K+", label: "Active Users" },
              { val: "SSL", label: "Secure Sandbox" },
              { val: "99.9%", label: "Uptime SLA" }
            ].map((stat, i) => (
              <div key={i} className="text-center p-3 bg-neutral-900/40 rounded-xl border border-neutral-850/50">
                <p className="text-lg md:text-xl font-bold text-white font-mono">{stat.val}</p>
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold font-sans mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CORE SEARCH & DIRECTORY GRID */}
      <section id="tool-grid-anchor" className="space-y-6 pt-6">
        
        {/* Title Bar with controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-neutral-850">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">Interactive Utilities Vault</h2>
            <p className="text-xs text-neutral-500 mt-0.5 font-sans">Click on any directory tile to boot that tool module live.</p>
          </div>

          {/* Inline search for mobile */}
          <div className="relative md:hidden w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-850 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-neutral-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="group relative bg-neutral-900 border border-neutral-850 hover:border-indigo-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all hover:translate-y-[-2px] hover:shadow-xl hover:shadow-indigo-950/5"
            >
              <div className="space-y-3.5">
                {/* Header line */}
                <div className="flex justify-between items-start">
                  <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-850 text-indigo-400 group-hover:bg-indigo-950/20 group-hover:border-indigo-900 transition-colors">
                    {renderIcon(tool.icon)}
                  </div>
                  
                  {/* Action tags */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {tool.trending && (
                      <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded-full bg-red-950/50 text-red-400 border border-red-900/40">
                        TRENDING
                      </span>
                    )}
                    {tool.new && (
                      <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-950/50 text-emerald-400 border border-emerald-900/40">
                        NEW
                      </span>
                    )}

                    {/* Pin favorite button */}
                    <button
                      onClick={() => {
                        onToggleFavorite(tool.id);
                        onTriggerNotification(
                          isFavorited(tool.id) ? "Shortcut Purged" : "Shortcut Pinned 📌",
                          `"${tool.name}" shortcut has been updated in your left category rail.`
                        );
                      }}
                      className={`p-1 rounded-md transition-colors border ${isFavorited(tool.id) ? "bg-amber-950/40 text-amber-500 border-amber-900/40" : "bg-neutral-950 text-neutral-600 hover:text-white border-neutral-850"}`}
                      title="Pin shortcut to sidebar"
                    >
                      <Star className={`w-3.5 h-3.5 ${isFavorited(tool.id) ? "fill-current" : ""}`} />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">
                    {tool.name}
                  </h4>
                  <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </div>

              {/* Action trigger footer */}
              <div className="pt-4 mt-4 border-t border-neutral-850/50 flex justify-between items-center">
                <span className="text-[10px] text-neutral-500 font-mono">Usage: {tool.usageCount.toLocaleString()} clicks</span>
                <button
                  onClick={() => onSelectTool(tool.id)}
                  className="px-3.5 py-1.5 bg-neutral-950 hover:bg-indigo-600 text-neutral-300 hover:text-white text-[10px] font-semibold font-mono rounded-lg transition-colors flex items-center gap-1 border border-neutral-850 hover:border-indigo-500 cursor-pointer"
                >
                  Boot Module
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}

          {filteredTools.length === 0 && (
            <div className="col-span-full py-16 text-center text-neutral-600">
              <ShieldAlert className="w-10 h-10 mx-auto text-neutral-800 mb-2" />
              <p className="text-sm font-semibold">No tools matched your search: "{searchQuery}"</p>
              <button
                onClick={() => {
                  onSearchChange("");
                  onSelectCategory("All");
                }}
                className="mt-2 text-xs text-indigo-400 hover:underline"
              >
                Reset search queries
              </button>
            </div>
          )}
        </div>
      </section>

      {/* FEATURED COLLECTIONS */}
      <section className="space-y-6">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-white">Featured Utility Collections</h3>
          <p className="text-xs text-neutral-500 mt-0.5 font-sans">Grouped toolkits curated for specific study or workflow goals.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {collections.map((coll, i) => (
            <div key={i} className="p-5 bg-neutral-900 border border-neutral-850 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-2 font-sans">
                <div className="flex items-center gap-2">
                  {getCollectionIcon(coll.iconName)}
                  <h4 className="font-bold text-white text-sm leading-tight">{coll.title}</h4>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">{coll.desc}</p>
              </div>

              <div className="flex gap-2.5">
                {coll.tools.map((tid) => {
                  const t = tools.find((tool) => tool.id === tid);
                  if (!t) return null;
                  return (
                    <button
                      key={tid}
                      onClick={() => onSelectTool(tid)}
                      className="px-2.5 py-1 bg-neutral-950 border border-neutral-850 text-[10px] text-neutral-400 hover:text-white hover:border-indigo-500 rounded font-mono transition-all cursor-pointer"
                    >
                      {t.name.split(" ")[0]}..
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {!user && (
        <>
          {/* TESTIMONIALS */}
          <section className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h3 className="text-lg md:text-xl font-bold text-white">SaaS Client Testimonials</h3>
              <p className="text-xs text-neutral-500 leading-relaxed font-sans">
                Hear from developers, creators, and professionals using our comprehensive unified toolbox every single day.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TESTIMONIALS.map((t) => (
                <div key={t.id} className="p-5 bg-neutral-900 border border-neutral-850 rounded-2xl space-y-4 font-sans font-sans">
                  <p className="text-xs text-neutral-300 italic leading-relaxed font-sans">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3 border-t border-neutral-850/50 pt-3">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-8 h-8 rounded-full border border-neutral-800 object-cover"
                    />
                    <div>
                      <h5 className="text-xs font-bold text-white">{t.name}</h5>
                      <p className="text-[10px] text-neutral-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ COLLAPSIBLE DRAWER ACCORDIONS */}
          <section className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-lg md:text-xl font-bold text-white">Collapsible Platform FAQs</h3>
              <p className="text-xs text-neutral-500 font-sans">Got questions about limits, API quotas, or file processing? Check details below.</p>
            </div>

            <div className="space-y-2.5 font-sans">
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="border border-neutral-850 rounded-xl bg-neutral-900 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaqIndex(expandedFaqIndex === i ? null : i)}
                    className="w-full px-5 py-4 flex justify-between items-center text-left text-xs md:text-sm text-neutral-200 font-semibold hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                      {faq.question}
                    </span>
                    {expandedFaqIndex === i ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                  </button>

                  {expandedFaqIndex === i && (
                    <div className="px-5 pb-4 text-xs text-neutral-400 leading-relaxed border-t border-neutral-850/50 pt-3 bg-neutral-950/30">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* NEWSLETTER FORM SECTION */}
          <section className="bg-indigo-950/20 border border-indigo-900/30 p-8 rounded-3xl max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 font-sans">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-base md:text-lg font-bold text-white">Subscribe to ChenWave Bulletins</h3>
              <p className="text-xs text-neutral-400 max-w-md leading-relaxed">
                Stay in the loop with weekly features drops, new tool summaries, and Pro discount codes. No spam, ever.
              </p>
            </div>

            {newsletterSubscribed ? (
              <div className="p-3 text-xs bg-emerald-950/50 border border-emerald-900 text-emerald-400 rounded-xl font-bold flex items-center gap-1">
                <BadgeCheck className="w-4 h-4" /> Subscription Active! Thank you.
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2 w-full md:w-auto shrink-0 animate-fade-in">
                <input
                  type="email"
                  placeholder="name@company.com"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Join List
                </button>
              </form>
            )}
          </section>
        </>
      )}
    </div>
  );
}
