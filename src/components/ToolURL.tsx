import React, { useState } from "react";
import { Link, Copy, Check, ExternalLink, RefreshCw, AlertCircle, Trash2, ArrowRight } from "lucide-react";

interface ShortUrlItem {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
}

interface ToolURLProps {
  toolId: string;
  onRecordHistory: (summary: string, excerpt?: string) => void;
  favorites?: any[];
  onToggleFavorite?: (id: string) => void;
  onTriggerNotification?: (title: string, desc: string) => void;
  onSelectTool?: (id: string | null) => void;
}

export default function ToolURL({
  toolId,
  onRecordHistory,
  favorites = [],
  onToggleFavorite,
  onTriggerNotification,
  onSelectTool,
}: ToolURLProps) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState("");
  
  const [shortenedList, setShortenedList] = useState<ShortUrlItem[]>([
    {
      id: "seed-1",
      originalUrl: "https://ai.studio/build",
      shortCode: "cw_aistudio",
      shortUrl: `${window.location.origin}/r/cw_aistudio`,
      clicks: 45,
    }
  ]);

  const handleShortenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const targetUrl = originalUrl.trim();
    if (!targetUrl) {
      setError("Please specify a URL to shorten.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/url/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: targetUrl }),
      });

      const data = await res.json();
      if (res.ok && data.shortUrl) {
        const newItem: ShortUrlItem = {
          id: Math.random().toString(36).substring(2, 9),
          originalUrl: data.originalUrl,
          shortCode: data.shortCode,
          shortUrl: data.shortUrl,
          clicks: 0,
        };

        setShortenedList((prev) => [newItem, ...prev]);
        setOriginalUrl("");
        onRecordHistory(`Shortened URL into code "${data.shortCode}"`, data.originalUrl);
      } else {
        setError(data.error || "Failed to communicate with shorten engine.");
      }
    } catch (err: any) {
      setError("Connection failure to the shorten microservice.");
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(""), 1500);
  };

  const deleteShortened = (id: string) => {
    setShortenedList((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div id="url-shortener-container" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Shorten Box */}
        <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-800/60">
            <Link className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-white">Shorten a Long Link</h3>
          </div>

          <form onSubmit={handleShortenSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-400">Paste your target URL link</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="E.g. google.com/search?q=chenwave+tools&hl=en..."
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-3 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                />
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">
                Any address is accepted. We'll automatically prefix `http://` if omitted.
              </p>
            </div>

            {error && (
              <div className="p-3 text-xs bg-red-950/20 border border-red-900/40 text-red-400 rounded-lg flex items-center gap-1.5 font-sans">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !originalUrl.trim()}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/40 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {loading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Link className="w-3.5 h-3.5" />
              )}
              Create Short Redirection Route
            </button>
          </form>

          <div className="p-3.5 bg-neutral-950/60 rounded border border-neutral-850 space-y-2 text-[10px] text-neutral-500 leading-relaxed font-sans">
            <h4 className="font-semibold text-neutral-400">💡 Native HTTP Redirections</h4>
            <p>Our server registers each shorten code directly in the active process. When a visitor navigates to your short link, they will instantly trigger an HTTP 302 redirection straight to your destination.</p>
          </div>
        </div>

        {/* Shortened URL List Panel */}
        <div className="lg:col-span-7 flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden min-h-[380px]">
          <div className="px-5 py-3.5 border-b border-neutral-800/60 bg-neutral-950 flex justify-between items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">Active redirection registry</span>
            <span className="text-[10px] text-neutral-500 font-mono">Active: {shortenedList.length}</span>
          </div>

          <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-neutral-950/20">
            {shortenedList.length > 0 ? (
              shortenedList.map((item) => (
                <div key={item.id} className="p-4 bg-neutral-900 border border-neutral-850 rounded-xl space-y-3">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 border-b border-neutral-850/40 pb-2">
                    <div className="overflow-hidden">
                      <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider font-mono">Original Link</span>
                      <p className="text-xs font-sans text-neutral-400 truncate max-w-[280px]" title={item.originalUrl}>
                        {item.originalUrl}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Simulated clicks</span>
                      <p className="text-xs font-mono font-bold text-neutral-300">{item.clicks}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-neutral-950 border border-neutral-850 rounded-lg p-2.5">
                    <span className="text-xs font-mono text-indigo-300 select-all truncate max-w-[280px]">
                      {item.shortUrl}
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => copyUrl(item.id, item.shortUrl)}
                        className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        title="Copy Short URL"
                      >
                        {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <a
                        href={item.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          item.clicks++;
                          onRecordHistory(`Followed short link redirect /r/${item.shortCode}`, item.originalUrl);
                        }}
                        className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-indigo-400 transition-colors"
                        title="Open Redirection Link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => deleteShortened(item.id)}
                        className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete Link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-neutral-600 py-16">
                <Link className="w-10 h-10 mb-2 opacity-20 text-indigo-400" />
                <p className="text-xs">Registry is completely empty.</p>
                <p className="text-[10px] text-neutral-700 mt-1">Shorten links on the left side to register dynamic redirects.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
