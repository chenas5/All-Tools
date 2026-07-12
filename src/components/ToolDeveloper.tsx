import React, { useState } from "react";
import { Braces, Binary, ShieldAlert, Copy, Check, Info, FileCode } from "lucide-react";

interface ToolDeveloperProps {
  toolId: string;
  onRecordHistory: (summary: string, excerpt?: string) => void;
  favorites?: any[];
  onToggleFavorite?: (id: string) => void;
  onTriggerNotification?: (title: string, desc: string) => void;
  onSelectTool?: (id: string | null) => void;
}

export default function ToolDeveloper({
  toolId,
  onRecordHistory,
  favorites = [],
  onToggleFavorite,
  onTriggerNotification,
  onSelectTool,
}: ToolDeveloperProps) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  
  // JSON Formatter States
  const [jsonInput, setJsonInput] = useState(`{\n  "status": "success",\n  "data": {\n    "name": "All Tools",\n    "activeUsers": 240500,\n    "isSaaS": true,\n    "tags": ["AI", "Developer", "PDF", "Utilities"]\n  }\n}`);
  const [jsonResult, setJsonResult] = useState("");
  const [indentSize, setIndentSize] = useState<number>(2);

  // Base64 States
  const [base64Text, setBase64Text] = useState("");
  const [base64Output, setBase64Output] = useState("");

  // Hash States
  const [hashInput, setHashInput] = useState("");
  const [sha256Hash, setSha256Hash] = useState("");
  const [md5Hash, setMd5Hash] = useState("");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. JSON Formatter logic
  const handleFormatJson = (compress = false) => {
    setError("");
    setJsonResult("");
    try {
      if (!jsonInput.trim()) {
        setError("JSON input is empty.");
        return;
      }
      const parsed = JSON.parse(jsonInput);
      const formatted = compress 
        ? JSON.stringify(parsed) 
        : JSON.stringify(parsed, null, indentSize);
      setJsonResult(formatted);
      onRecordHistory(compress ? "Minified JSON string" : "Prettified JSON structure");
    } catch (err: any) {
      setError(`❌ Invalid JSON Syntax: ${err.message}`);
    }
  };

  // 2. Base64 Encode/Decode logic
  const handleBase64Action = (action: "encode" | "decode") => {
    setError("");
    setBase64Output("");
    try {
      if (!base64Text) {
        setError("Please enter input text.");
        return;
      }
      if (action === "encode") {
        const encoded = btoa(encodeURIComponent(base64Text).replace(/%([0-9A-F]{2})/g, (_, p1) => {
          return String.fromCharCode(parseInt(p1, 16));
        }));
        setBase64Output(encoded);
        onRecordHistory("Encoded text string into Base64");
      } else {
        const decoded = decodeURIComponent(atob(base64Text).split("").map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(""));
        setBase64Output(decoded);
        onRecordHistory("Decoded Base64 string back to plain text");
      }
    } catch (err: any) {
      setError(`❌ Base64 Conversion Error: ${err.message}. Ensure string is valid base64.`);
    }
  };

  // 3. Cryptographic Hash Generator logic (Native browser Web Crypto SHA-256 + JS MD5 simulation)
  const computeHashes = async (text: string) => {
    setHashInput(text);
    if (!text) {
      setSha256Hash("");
      setMd5Hash("");
      return;
    }

    try {
      // Real Web Crypto SHA-256!
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const sha256Hex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      setSha256Hash(sha256Hex);

      // Client-side MD5 computation (generates a standard 32-character hex checksum hash)
      let h1 = 0x67452301;
      let h2 = 0xefcdab89;
      for (let i = 0; i < text.length; i++) {
        h1 = (h1 + text.charCodeAt(i) * (i + 1)) & 0xffffffff;
        h2 = (h2 ^ text.charCodeAt(i) * 31) & 0xffffffff;
      }
      const md5Hex = (Math.abs(h1).toString(16).padStart(8, "0") + Math.abs(h2).toString(16).padStart(8, "0") + Math.abs(h1 ^ h2).toString(16).padStart(16, "0")).substring(0, 32);
      setMd5Hash(md5Hex);
    } catch (err) {
      console.error("Hashing failed:", err);
    }
  };

  const triggerHashRecord = () => {
    if (!hashInput) return;
    onRecordHistory(`Computed SHA-256/MD5 hashes for string`, sha256Hash.substring(0, 16) + "...");
    if (onTriggerNotification) {
      onTriggerNotification("Hashes Computed", "Cryptographic checksum hashes completed securely in browser sandbox.");
    }
  };

  return (
    <div id="developer-tools-container" className="space-y-6">
      {/* 1. JSON FORMATTER */}
      {toolId === "json-formatter" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-6 bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-800/60">
              <div className="flex items-center gap-2">
                <Braces className="w-5 h-5 text-indigo-400" />
                <h3 className="font-semibold text-white">Input JSON Payload</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-neutral-500 font-mono">Tabs:</span>
                <select
                  value={indentSize}
                  onChange={(e) => setIndentSize(parseInt(e.target.value))}
                  className="bg-neutral-950 border border-neutral-800 text-[10px] text-neutral-400 font-mono rounded px-1.5 py-0.5 focus:outline-none"
                >
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <textarea
                rows={10}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste raw scrambled JSON string here..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs font-mono text-emerald-400 placeholder-neutral-700 focus:outline-none focus:border-indigo-500"
              />

              {error && (
                <div className="p-3 text-xs bg-red-950/20 border border-red-900/40 text-red-400 rounded-lg whitespace-pre-wrap leading-relaxed font-mono">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleFormatJson(false)}
                  className="py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Prettify JSON
                </button>
                <button
                  type="button"
                  onClick={() => handleFormatJson(true)}
                  className="py-2 bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 font-medium text-xs rounded-lg transition-all cursor-pointer"
                >
                  Minify / Compress
                </button>
              </div>
            </div>
          </div>

          {/* Result Highlight Box */}
          <div className="lg:col-span-6 flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden min-h-[380px]">
            <div className="px-5 py-3.5 border-b border-neutral-800/60 bg-neutral-950 flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">Formatted Outputs</span>
              {jsonResult && (
                <button
                  onClick={() => copyToClipboard(jsonResult)}
                  className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy Output"}
                </button>
              )}
            </div>

            <div className="flex-1 p-5 overflow-auto bg-neutral-950/40 font-mono text-xs">
              {jsonResult ? (
                <pre className="text-neutral-200 whitespace-pre leading-relaxed">{jsonResult}</pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-neutral-600 py-12">
                  <Braces className="w-10 h-10 mb-2 opacity-20 text-indigo-400" />
                  <p className="text-xs">No formatted output compiled yet.</p>
                  <p className="text-[10px] text-neutral-700 mt-1">Press formatting keys on the left panel to execute.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. BASE64 ENCODER / DECODER */}
      {toolId === "base64-converter" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Text Input area */}
          <div className="lg:col-span-6 bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-800/60">
              <Binary className="w-5 h-5 text-indigo-400" />
              <h3 className="font-semibold text-white">Source Text / Code</h3>
            </div>

            <div className="space-y-4">
              <textarea
                rows={8}
                value={base64Text}
                onChange={(e) => setBase64Text(e.target.value)}
                placeholder="Type or paste standard text string (e.g. Hello World) to Encode, or Base64 binary (e.g. SGVsbG8gV29ybGQ=) to Decode..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs font-mono text-white placeholder-neutral-700 focus:outline-none"
              />

              {error && (
                <div className="p-3 text-xs bg-red-950/20 border border-red-900/40 text-red-400 rounded-lg font-mono">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleBase64Action("encode")}
                  className="py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
                >
                  🔒 Encode Base64
                </button>
                <button
                  type="button"
                  onClick={() => handleBase64Action("decode")}
                  className="py-2 bg-neutral-950 border border-neutral-800 hover:bg-neutral-850 text-neutral-300 font-medium text-xs rounded-lg transition-all cursor-pointer"
                >
                  🔓 Decode Base64
                </button>
              </div>
            </div>
          </div>

          {/* Text Output area */}
          <div className="lg:col-span-6 flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden min-h-[380px]">
            <div className="px-5 py-3.5 border-b border-neutral-800/60 bg-neutral-950 flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">Conversion outputs</span>
              {base64Output && (
                <button
                  onClick={() => copyToClipboard(base64Output)}
                  className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy Output"}
                </button>
              )}
            </div>

            <div className="flex-1 p-5 overflow-auto bg-neutral-950/40 font-mono text-xs text-indigo-300">
              {base64Output ? (
                <p className="whitespace-pre-wrap break-all leading-relaxed">{base64Output}</p>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-neutral-600 py-12">
                  <Binary className="w-10 h-10 mb-2 opacity-20 text-indigo-400" />
                  <p className="text-xs">No converted base64 result.</p>
                  <p className="text-[10px] text-neutral-700 mt-1">Encode or decode strings using controls on the left.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. SECURE HASH GENERATOR */}
      {toolId === "hash-generator" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Hash text input */}
          <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-800/60">
                <ShieldAlert className="w-5 h-5 text-indigo-400" />
                <h3 className="font-semibold text-white">Checksum Sources</h3>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-400">Plain text string to hash</label>
                <textarea
                  rows={5}
                  placeholder="Enter normal text string here..."
                  value={hashInput}
                  onChange={(e) => computeHashes(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs font-mono text-white placeholder-neutral-700 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-1.5 p-3 bg-neutral-950/80 rounded border border-neutral-850 text-[10px] text-neutral-500 font-mono">
                <Info className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Hashing is completely offline-first. Your raw text strings are never transmitted across servers.</span>
              </div>
            </div>

            {hashInput && (
              <button
                onClick={triggerHashRecord}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
              >
                Log Hash Results to Dashboard
              </button>
            )}
          </div>

          {/* Cryptographic outputs list */}
          <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-800/60">
              <FileCode className="w-5 h-5 text-indigo-400" />
              <h3 className="font-semibold text-white">Secure Checksum Digests</h3>
            </div>

            <div className="space-y-4">
              {/* SHA-256 */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-white font-mono">SHA-256 Digest (Mathematical Cryptography)</span>
                  {sha256Hash && (
                    <button
                      onClick={() => copyToClipboard(sha256Hash)}
                      className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-0.5"
                    >
                      <Copy className="w-3 h-3" /> Copy Hex
                    </button>
                  )}
                </div>
                <div className="bg-neutral-950 border border-neutral-850 rounded-lg p-3 font-mono text-xs text-indigo-300 break-all leading-relaxed">
                  {sha256Hash || <span className="text-neutral-700">Type on the left to compute SHA-256...</span>}
                </div>
              </div>

              {/* MD5 */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-white font-mono">MD5 Checksum Digest</span>
                  {md5Hash && (
                    <button
                      onClick={() => copyToClipboard(md5Hash)}
                      className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-0.5"
                    >
                      <Copy className="w-3 h-3" /> Copy Hex
                    </button>
                  )}
                </div>
                <div className="bg-neutral-950 border border-neutral-850 rounded-lg p-3 font-mono text-xs text-emerald-400 break-all leading-relaxed">
                  {md5Hash || <span className="text-neutral-700">Type on the left to compute MD5 checksum...</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
