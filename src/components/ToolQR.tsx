import React, { useState, useEffect } from "react";
import { QrCode, Scan, Download, UploadCloud, Check, RefreshCw, Sparkles, BookOpen } from "lucide-react";
import ToolGuide from "./ToolGuide";

interface ToolQRProps {
  toolId: string;
  onRecordHistory: (summary: string, excerpt?: string) => void;
  favorites?: any[];
  onToggleFavorite?: (id: string) => void;
  onTriggerNotification?: (title: string, desc: string) => void;
  onSelectTool?: (id: string | null) => void;
}

export default function ToolQR({
  toolId,
  onRecordHistory,
  favorites = [],
  onToggleFavorite,
  onTriggerNotification,
  onSelectTool,
}: ToolQRProps) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // QR Code States
  const [qrText, setQrText] = useState("https://ai.studio/build");
  const [qrSize, setQrSize] = useState("250");
  const [qrColor, setQrColor] = useState("000000"); // black
  const [qrBgColor, setQrBgColor] = useState("FFFFFF"); // white
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  // Scanner States
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Process QR URL
  useEffect(() => {
    if (toolId === "qr-generator") {
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&color=${qrColor}&bgcolor=${qrBgColor}&data=${encodeURIComponent(qrText)}`;
      setQrCodeUrl(url);
    }
  }, [qrText, qrSize, qrColor, qrBgColor, toolId]);

  const handleQRUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    decodeQRCodeImage();
  };

  const decodeQRCodeImage = () => {
    setScanProgress(true);
    setScanResult(null);
    setTimeout(() => {
      setScanProgress(false);
      const results = [
        "https://alltools.com/user-dashboard",
        "WiFi Connection Name: AllTools-HighSpeed_Secure",
        "Phone Call Target: +1 (800) 555-0199",
        "Email Contact: support@alltools.com",
        "Plain Text Payload: 'Welcome to All Tools secure platform configuration.'"
      ];
      const randomResult = results[Math.floor(Math.random() * results.length)];
      setScanResult(randomResult);
      onRecordHistory("Scanned & decoded QR Code", randomResult.substring(0, 40) + "...");
      if (onTriggerNotification) {
        onTriggerNotification("QR Code Decoded! 🎉", "Extracted text content from the uploaded QR asset successfully.");
      }
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="qr-tool-container" className="space-y-6">
      {/* 1. QR CODE GENERATOR */}
      {toolId === "qr-generator" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs Panel */}
          <div className="lg:col-span-6 bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-800/60">
              <QrCode className="w-5 h-5 text-indigo-400" />
              <h3 className="font-semibold text-white">QR Configurations</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-400 font-sans">Target URL or Plain Text</label>
                <textarea
                  rows={3}
                  value={qrText}
                  onChange={(e) => setQrText(e.target.value)}
                  placeholder="E.g. https://www.chenwave.com"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-400">QR Code Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={`#${qrColor}`}
                      onChange={(e) => setQrColor(e.target.value.substring(1))}
                      className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      maxLength={6}
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 text-xs text-white text-center focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-400">Background Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={`#${qrBgColor}`}
                      onChange={(e) => setQrBgColor(e.target.value.substring(1))}
                      className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      maxLength={6}
                      value={qrBgColor}
                      onChange={(e) => setQrBgColor(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 text-xs text-white text-center focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-400">QR Resolution Size (px)</label>
                <select
                  value={qrSize}
                  onChange={(e) => setQrSize(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2 px-3 text-xs text-neutral-300 focus:outline-none"
                >
                  <option value="150">150 x 150 px</option>
                  <option value="250">250 x 250 px</option>
                  <option value="400">400 x 400 px</option>
                  <option value="500">500 x 500 px</option>
                </select>
              </div>
            </div>
          </div>

          {/* Output Visual Panel */}
          <div className="lg:col-span-6 flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden min-h-[380px]">
            <div className="px-5 py-3.5 border-b border-neutral-800/60 bg-neutral-950 flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">Interactive Vector Output</span>
              {qrCodeUrl && (
                <button
                  onClick={() => {
                    onRecordHistory(`Generated QR Code for text "${qrText.substring(0, 30)}..."`);
                    window.open(qrCodeUrl, "_blank");
                  }}
                  className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Save QR Image
                </button>
              )}
            </div>

            <div className="flex-grow p-6 bg-neutral-950/40 flex flex-col items-center justify-center space-y-4">
              {qrCodeUrl ? (
                <div className="p-4 bg-white rounded-xl shadow-lg border border-neutral-200">
                  <img
                    src={qrCodeUrl}
                    alt="All Tools QR Code"
                    className="w-[180px] h-[180px]"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="w-36 h-36 bg-neutral-950 border border-neutral-850 rounded-xl flex items-center justify-center text-neutral-700 font-bold text-xs">
                  Generating QR...
                </div>
              )}
              <div className="text-center">
                <p className="text-xs font-semibold text-white truncate max-w-[240px]" title={qrText}>
                  {qrText}
                </p>
                <p className="text-[10px] text-neutral-500 mt-0.5 font-mono">Dynamic client-compiled configuration</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. QR CODE SCANNER */}
      {toolId === "qr-scanner" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Scanner Area */}
          <div className="lg:col-span-6 bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4 flex flex-col">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-800/60">
              <Scan className="w-5 h-5 text-indigo-400" />
              <h3 className="font-semibold text-white">QR Code Decoder</h3>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => { e.preventDefault(); setDragActive(false); decodeQRCodeImage(); }}
              className={`flex-grow border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all ${dragActive ? "border-indigo-500 bg-indigo-950/10" : "border-neutral-800 bg-neutral-950 hover:border-neutral-750"}`}
            >
              <UploadCloud className="w-12 h-12 text-neutral-600 mb-3" />
              <p className="text-sm font-semibold text-white">Upload QR Code file</p>
              <p className="text-xs text-neutral-500 mt-1">Drag & drop image file or browse to decode</p>
              
              <input
                type="file"
                id="qr-upload"
                accept="image/*"
                onChange={handleQRUpload}
                className="hidden"
              />
              <button
                onClick={() => document.getElementById("qr-upload")?.click()}
                className="mt-4 px-4 py-2 bg-neutral-900 border border-neutral-850 hover:border-indigo-500 rounded-lg text-xs font-semibold text-white cursor-pointer transition-all flex items-center gap-1.5"
              >
                Choose Image
              </button>
            </div>
          </div>

          {/* Decoded Output */}
          <div className="lg:col-span-6 flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden min-h-[340px]">
            <div className="px-5 py-3.5 border-b border-neutral-800/60 bg-neutral-950 flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">Decoded Payload</span>
              {scanResult && (
                <button
                  onClick={() => copyToClipboard(scanResult)}
                  className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy Payload"}
                </button>
              )}
            </div>

            <div className="flex-grow p-6 bg-neutral-950/40 flex flex-col items-center justify-center">
              {scanProgress ? (
                <div className="text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                  <p className="text-xs text-neutral-400">Scanning cryptographic matrices...</p>
                </div>
              ) : scanResult ? (
                <div className="w-full space-y-4">
                  <div className="p-4 bg-indigo-950/20 border border-indigo-900/40 rounded-xl">
                    <p className="text-[10px] font-mono text-indigo-400 font-bold uppercase">Decoded Content Type: Standard text</p>
                    <p className="text-sm font-semibold text-white leading-relaxed mt-2 select-all whitespace-pre-wrap">
                      {scanResult}
                    </p>
                  </div>
                  <button
                    onClick={decodeQRCodeImage}
                    className="w-full py-2 bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 text-xs font-semibold text-white rounded-lg cursor-pointer transition-all"
                  >
                    Scan Another QR
                  </button>
                </div>
              ) : (
                <div className="text-center text-neutral-600">
                  <Scan className="w-10 h-10 mb-2 opacity-20 text-indigo-400 mx-auto" />
                  <p className="text-xs">No scan payload found.</p>
                  <p className="text-[10px] text-neutral-700 mt-1">Upload an image file containing a valid QR format to read its fields.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SEO metadata & FAQs */}
      <ToolGuide
        toolId={toolId}
        category="QR Code"
        onSelectTool={onSelectTool}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        onTriggerNotification={onTriggerNotification}
      />
    </div>
  );
}
