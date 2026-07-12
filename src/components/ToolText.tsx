import React, { useState, useEffect } from "react";
import { FileText, Workflow, Trash2, Scissors, ShieldAlert, Palette, Lock, Check, Copy, RefreshCw } from "lucide-react";
import ToolGuide from "./ToolGuide";

interface ToolTextProps {
  toolId: string;
  onRecordHistory: (summary: string, excerpt?: string) => void;
  favorites?: any[];
  onToggleFavorite?: (id: string) => void;
  onTriggerNotification?: (title: string, desc: string) => void;
  onSelectTool?: (id: string | null) => void;
}

export default function ToolText({
  toolId,
  onRecordHistory,
  favorites = [],
  onToggleFavorite,
  onTriggerNotification,
  onSelectTool,
}: ToolTextProps) {
  const [copied, setCopied] = useState(false);

  // General Text Input
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  // Counter metrics
  const [metrics, setMetrics] = useState({ chars: 0, words: 0, lines: 0, readTime: 0 });

  // Diff States
  const [diffLeft, setDiffLeft] = useState("");
  const [diffRight, setDiffRight] = useState("");
  const [diffResult, setDiffResult] = useState<Array<{ text: string; type: "added" | "removed" | "equal" }>>([]);

  // Password States
  const [pwLength, setPwLength] = useState(16);
  const [pwIncludeNumbers, setPwIncludeNumbers] = useState(true);
  const [pwIncludeSymbols, setPwIncludeSymbols] = useState(true);

  // Lorem States
  const [loremParas, setLoremParas] = useState(3);

  // Real-time counter metrics
  useEffect(() => {
    if (toolId === "text-counter") {
      const chars = inputText.length;
      const words = inputText.trim() === "" ? 0 : inputText.trim().split(/\s+/).length;
      const lines = inputText.trim() === "" ? 0 : inputText.split("\n").length;
      const readTime = Math.ceil(words / 200); // 200 words per minute average
      setMetrics({ chars, words, lines, readTime });
    }
  }, [inputText, toolId]);

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (onTriggerNotification) {
      onTriggerNotification("Copied to Clipboard! 📋", "Text output successfully saved to clipboard buffers.");
    }
  };

  const handleCaseChange = (mode: string) => {
    let result = inputText;
    if (mode === "upper") result = inputText.toUpperCase();
    else if (mode === "lower") result = inputText.toLowerCase();
    else if (mode === "title") {
      result = inputText.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    } else if (mode === "snake") {
      result = inputText.toLowerCase().replace(/\s+/g, "_");
    } else if (mode === "camel") {
      result = inputText
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    }
    setOutputText(result);
    onRecordHistory(`Converted text case to ${mode}`);
  };

  const handleCleanText = () => {
    const cleaned = inputText
      .replace(/\s+/g, " ") // Collapse spaces
      .trim()
      .replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, ""); // strip emojis
    setOutputText(cleaned);
    onRecordHistory("Cleaned and sanitized plain text formatting");
  };

  const handleRemoveBlankLines = () => {
    const filtered = inputText
      .split("\n")
      .filter((line) => line.trim() !== "")
      .join("\n");
    setOutputText(filtered);
    onRecordHistory("Pruned empty blank lines from list");
  };

  const executeDiffCheck = () => {
    const leftLines = diffLeft.split("\n");
    const rightLines = diffRight.split("\n");
    const results: Array<{ text: string; type: "added" | "removed" | "equal" }> = [];

    // Simple side by side line diff
    const max = Math.max(leftLines.length, rightLines.length);
    for (let i = 0; i < max; i++) {
      const left = leftLines[i] || "";
      const right = rightLines[i] || "";

      if (left === right) {
        results.push({ text: left, type: "equal" });
      } else {
        if (left) results.push({ text: `- ${left}`, type: "removed" });
        if (right) results.push({ text: `+ ${right}`, type: "added" });
      }
    }
    setDiffResult(results);
    onRecordHistory("Ran line diff difference comparison check");
  };

  const generateLorem = () => {
    const list = [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tristique congue ex eget feugiat. Integer luctus ex vitae nisl tempus pellentesque.",
      "Cras nec dictum erat, id ultrices lectus. Nam vel nisl sollicitudin, laoreet diam tincidunt, hendrerit elit. Curabitur sed arcu pulvinar, viverra tortor non.",
      "Proin elementum, dolor vitae vestibulum feugiat, ante ipsum placerat lectus, pretium dictum neque nulla in felis. Aliquam pulvinar est vel nisl tempor cursus.",
      "Donec elementum felis lectus, sed finibus arcu porta vitae. Quisque rhoncus dolor ac tincidunt pellentesque. Fusce facilisis erat sit amet elit volutpat iaculis."
    ];
    let items: string[] = [];
    for (let i = 0; i < loremParas; i++) {
      items.push(list[i % list.length]);
    }
    setOutputText(items.join("\n\n"));
    onRecordHistory(`Spawned ${loremParas} paragraphs of Lorem Ipsum filler text`);
  };

  const generatePassword = () => {
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (pwIncludeNumbers) chars += "0123456789";
    if (pwIncludeSymbols) chars += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    let pass = "";
    for (let i = 0; i < pwLength; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setOutputText(pass);
    onRecordHistory("Generated dynamic high-entropy secure password");
  };

  return (
    <div id="text-suite-container" className="space-y-6">
      
      {/* 1. DIFF CHECKER VIEW */}
      {toolId === "text-diff-checker" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs Column */}
          <div className="lg:col-span-6 bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-800/60">
              <ShieldAlert className="w-5 h-5 text-indigo-400" />
              <h3 className="font-semibold text-white">Compare Plain Paragraphs</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-neutral-400">Original Text (Left side)</label>
                <textarea
                  rows={5}
                  value={diffLeft}
                  onChange={(e) => setDiffLeft(e.target.value)}
                  placeholder="Paste original source script..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-neutral-400">Modified Text (Right side)</label>
                <textarea
                  rows={5}
                  value={diffRight}
                  onChange={(e) => setDiffRight(e.target.value)}
                  placeholder="Paste modified target script..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <button
                onClick={executeDiffCheck}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4" />
                Analyze Structural Differences
              </button>
            </div>
          </div>

          {/* Diff comparison preview */}
          <div className="lg:col-span-6 flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden min-h-[360px]">
            <div className="px-5 py-3.5 border-b border-neutral-800/60 bg-neutral-950">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">Highlight Differences</span>
            </div>

            <div className="flex-grow p-4 bg-neutral-950/40 overflow-y-auto space-y-1 font-mono text-xs leading-relaxed">
              {diffResult.length > 0 ? (
                diffResult.map((line, i) => (
                  <div
                    key={i}
                    className={`px-2 py-0.5 rounded ${line.type === "added" ? "bg-emerald-950/40 text-emerald-400 border-l-2 border-emerald-500" : line.type === "removed" ? "bg-red-950/40 text-red-400 border-l-2 border-red-500" : "text-neutral-400"}`}
                  >
                    {line.text || "\u00A0"}
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-neutral-600 py-12">
                  <ShieldAlert className="w-10 h-10 mb-2 opacity-20 text-indigo-400" />
                  <p className="text-xs">No analysis computed.</p>
                  <p className="text-[10px] text-neutral-700 mt-1">Provide scripts in both fields to inspect exact addition and subtraction lists.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* 2. GENERAL TEXT UTILITIES VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls Box */}
          <div className="lg:col-span-6 bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-800/60">
              <FileText className="w-5 h-5 text-indigo-400" />
              <h3 className="font-semibold text-white">Input Plain Text</h3>
            </div>

            {/* Config zones depending on toolId */}
            {toolId === "text-password-generator" && (
              <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-850 space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Password length</span>
                    <span className="text-indigo-400 font-mono font-bold">{pwLength} characters</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="64"
                    value={pwLength}
                    onChange={(e) => setPwLength(parseInt(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div className="flex justify-between gap-4">
                  <label className="flex items-center gap-2 text-xs text-neutral-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pwIncludeNumbers}
                      onChange={(e) => setPwIncludeNumbers(e.target.checked)}
                      className="rounded border-neutral-800 text-indigo-600 w-3.5 h-3.5"
                    />
                    Include Numbers (0-9)
                  </label>
                  <label className="flex items-center gap-2 text-xs text-neutral-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pwIncludeSymbols}
                      onChange={(e) => setPwIncludeSymbols(e.target.checked)}
                      className="rounded border-neutral-800 text-indigo-600 w-3.5 h-3.5"
                    />
                    Special Characters (!@#)
                  </label>
                </div>

                <button
                  onClick={generatePassword}
                  className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-lg cursor-pointer"
                >
                  Spawn Password
                </button>
              </div>
            )}

            {toolId === "text-lorem-generator" && (
              <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-850 space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-neutral-400">Paragraph count</label>
                  <select
                    value={loremParas}
                    onChange={(e) => setLoremParas(parseInt(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-1.5 px-2.5 text-xs text-neutral-300 focus:outline-none"
                  >
                    <option value="1">1 Paragraph</option>
                    <option value="3">3 Paragraphs</option>
                    <option value="5">5 Paragraphs</option>
                    <option value="8">8 Paragraphs</option>
                  </select>
                </div>

                <button
                  onClick={generateLorem}
                  className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-lg cursor-pointer"
                >
                  Generate Lorem Filler
                </button>
              </div>
            )}

            {toolId !== "text-password-generator" && toolId !== "text-lorem-generator" && (
              <textarea
                rows={8}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or paste your text documents, raw datasets, paragraphs, or copy list arrays here..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans leading-relaxed"
              />
            )}

            {/* Controls depending on toolId */}
            {toolId === "text-case-converter" && inputText.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <button
                  onClick={() => handleCaseChange("upper")}
                  className="px-2.5 py-1.5 bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 text-[10px] font-mono text-neutral-300 rounded-lg"
                >
                  UPPERCASE
                </button>
                <button
                  onClick={() => handleCaseChange("lower")}
                  className="px-2.5 py-1.5 bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 text-[10px] font-mono text-neutral-300 rounded-lg"
                >
                  lowercase
                </button>
                <button
                  onClick={() => handleCaseChange("title")}
                  className="px-2.5 py-1.5 bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 text-[10px] font-mono text-neutral-300 rounded-lg"
                >
                  Title Case
                </button>
                <button
                  onClick={() => handleCaseChange("snake")}
                  className="px-2.5 py-1.5 bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 text-[10px] font-mono text-neutral-300 rounded-lg"
                >
                  snake_case
                </button>
                <button
                  onClick={() => handleCaseChange("camel")}
                  className="px-2.5 py-1.5 bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 text-[10px] font-mono text-neutral-300 rounded-lg"
                >
                  camelCase
                </button>
              </div>
            )}

            {toolId === "text-cleaner" && inputText.length > 0 && (
              <button
                onClick={handleCleanText}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg flex items-center justify-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Sanitize Extra Spaces & Emojis
              </button>
            )}

            {toolId === "text-remove-lines" && inputText.length > 0 && (
              <button
                onClick={handleRemoveBlankLines}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg flex items-center justify-center gap-1 cursor-pointer"
              >
                <Scissors className="w-3.5 h-3.5" />
                Strip Duplicate & Empty Lines
              </button>
            )}

            {toolId === "text-counter" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-850 text-center">
                  <p className="text-[10px] font-mono text-neutral-500 font-bold uppercase">Characters</p>
                  <p className="text-sm font-bold text-white mt-1 font-mono">{metrics.chars}</p>
                </div>
                <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-850 text-center">
                  <p className="text-[10px] font-mono text-neutral-500 font-bold uppercase">Words</p>
                  <p className="text-sm font-bold text-white mt-1 font-mono">{metrics.words}</p>
                </div>
                <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-850 text-center">
                  <p className="text-[10px] font-mono text-neutral-500 font-bold uppercase">Lines</p>
                  <p className="text-sm font-bold text-white mt-1 font-mono">{metrics.lines}</p>
                </div>
                <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-850 text-center">
                  <p className="text-[10px] font-mono text-neutral-500 font-bold uppercase">Read Time</p>
                  <p className="text-sm font-bold text-white mt-1 font-mono">{metrics.readTime} min</p>
                </div>
              </div>
            )}
          </div>

          {/* Results Box */}
          <div className="lg:col-span-6 flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden min-h-[360px]">
            <div className="px-5 py-3.5 border-b border-neutral-800/60 bg-neutral-950 flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">Output Results</span>
              {outputText && (
                <button
                  onClick={() => copyToClipboard(outputText)}
                  className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              )}
            </div>

            <div className="flex-grow p-4 bg-neutral-950/40 overflow-y-auto">
              {outputText ? (
                <div className="text-xs text-neutral-200 font-mono whitespace-pre-wrap leading-relaxed select-all">
                  {outputText}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-neutral-600 py-12">
                  <FileText className="w-10 h-10 mb-2 opacity-20 text-indigo-400" />
                  <p className="text-xs">Waiting for textual configurations...</p>
                  <p className="text-[10px] text-neutral-700 mt-1">Processed results can be instantly copied to your draft editors.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SEO guidelines page section */}
      <ToolGuide
        toolId={toolId}
        category="Text"
        onSelectTool={onSelectTool}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        onTriggerNotification={onTriggerNotification}
      />
    </div>
  );
}
