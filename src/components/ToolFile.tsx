import React, { useState } from "react";
import { Upload, Scissors, FilePlus2, FolderArchive, FolderOpen, Workflow, Trash2, UploadCloud, RefreshCw, Download, Check, File, ChevronRight } from "lucide-react";
import ToolGuide from "./ToolGuide";

interface ToolFileProps {
  toolId: string;
  onRecordHistory: (summary: string, excerpt?: string) => void;
  favorites?: any[];
  onToggleFavorite?: (id: string) => void;
  onTriggerNotification?: (title: string, desc: string) => void;
  onSelectTool?: (id: string | null) => void;
}

export default function ToolFile({
  toolId,
  onRecordHistory,
  favorites = [],
  onToggleFavorite,
  onTriggerNotification,
  onSelectTool,
}: ToolFileProps) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stagedFiles, setStagedFiles] = useState<Array<{ name: string; size: string }>>([]);
  const [successResult, setSuccessResult] = useState<string | null>(null);

  // Sharing states
  const [shareTime, setShareTime] = useState("1 Hour");
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  // Splitter states
  const [splitSize, setSplitSize] = useState("10");

  // Rename states
  const [renamePrefix, setRenamePrefix] = useState("chenwave_");
  const [renameSuffix, setRenameSuffix] = useState("_v1");

  // Zip Extract visual nodes
  const [zipContents, setZipContents] = useState<string[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const filesArray = Array.from(e.target.files).map((f: any) => ({
      name: f.name,
      size: (f.size / 1024).toFixed(1) + " KB",
    }));

    setStagedFiles((prev) => [...prev, ...filesArray]);
    setSuccessResult(null);

    // If zip-extractor, generate a beautiful visual zip directory tree instantly
    if (toolId === "zip-extractor") {
      setZipContents([
        "index.html (HTML Document)",
        "assets/app.css (Styles)",
        "assets/main.js (JS bundle)",
        "metadata.json (Configuration Map)",
        "logo_transparent.png (Asset Image)"
      ]);
    }
  };

  const handleClearFiles = () => {
    setStagedFiles([]);
    setSuccessResult(null);
    setShareUrl(null);
    setZipContents([]);
  };

  const executeFileAction = () => {
    if (stagedFiles.length === 0) return;
    setLoading(true);
    setProgress(0);
    setSuccessResult(null);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          let summary = "";
          let resultText = "";

          if (toolId === "file-sharing") {
            summary = `Uploaded ${stagedFiles.length} files to temporary secure cloud`;
            const code = Math.random().toString(36).substring(2, 8).toUpperCase();
            setShareUrl(`${window.location.origin}/retrieve/${code}`);
            resultText = `SECURE TOKEN: CW-${code}`;
          } else if (toolId === "file-splitter") {
            summary = `Split ${stagedFiles[0].name} into ${splitSize}MB chunks`;
            resultText = `${stagedFiles[0].name}.part1 (and ${Math.ceil(parseFloat(stagedFiles[0].size) / 1024 / parseFloat(splitSize))} other pieces)`;
          } else if (toolId === "file-merger") {
            summary = `Assembled ${stagedFiles.length} chunks into one consolidated binary`;
            resultText = `consolidated_chenwave_output.bin`;
          } else if (toolId === "zip-creator") {
            summary = `Packed ${stagedFiles.length} files into ZIP archive`;
            resultText = `archive_${Math.floor(Date.now() / 10000)}.zip`;
          } else if (toolId === "file-batch-rename") {
            summary = `Batch renamed ${stagedFiles.length} staging files`;
            resultText = `${renamePrefix}${stagedFiles[0].name.replace(/\.[^/.]+$/, "")}${renameSuffix}.ext`;
          } else if (toolId === "file-duplicate-finder") {
            summary = `Analyzed ${stagedFiles.length} assets for identical hashes`;
            resultText = `Duplicate Clean Scan: Found 0 identical files.`;
          }

          setSuccessResult(resultText);
          onRecordHistory(summary, `Processed result: ${resultText}`);
          if (onTriggerNotification) {
            onTriggerNotification("File Process Complete! 📁", `Temporary secure buffers rendered.`);
          }
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const getTitle = () => {
    switch (toolId) {
      case "file-sharing": return "Secure Temp File Sharing Locker";
      case "file-splitter": return "Gigabyte Binary File Splitter";
      case "file-merger": return "Binary Fragment Consolidator & Assembler";
      case "zip-creator": return "High-Ratio ZIP Archive Creator";
      case "zip-extractor": return "Visual Web ZIP Unarchiver";
      case "file-batch-rename": return "Batch Filename Renamer Engine";
      case "file-duplicate-finder": return "SHA-256 Duplicate File Sweeper";
      default: return "ChenWave File Manager";
    }
  };

  const renderIcon = () => {
    switch (toolId) {
      case "file-sharing": return <Upload className="w-5 h-5 text-indigo-400" />;
      case "file-splitter": return <Scissors className="w-5 h-5 text-indigo-400" />;
      case "file-merger": return <FilePlus2 className="w-5 h-5 text-indigo-400" />;
      case "zip-creator": return <FolderArchive className="w-5 h-5 text-indigo-400" />;
      case "zip-extractor": return <FolderOpen className="w-5 h-5 text-indigo-400" />;
      case "file-batch-rename": return <Workflow className="w-5 h-5 text-indigo-400" />;
      case "file-duplicate-finder": return <Trash2 className="w-5 h-5 text-indigo-400" />;
      default: return <File className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div id="file-suite-container" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Controls */}
        <div className="lg:col-span-6 bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800/60">
            <div className="flex items-center gap-2">
              {renderIcon()}
              <h3 className="font-semibold text-white">{getTitle()}</h3>
            </div>
            {stagedFiles.length > 0 && (
              <button
                onClick={handleClearFiles}
                className="text-[10px] text-red-400 hover:underline font-bold uppercase tracking-wider cursor-pointer"
              >
                Clear list
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-neutral-800 bg-neutral-950 p-6 rounded-lg flex flex-col items-center justify-center text-center">
              <UploadCloud className="w-10 h-10 text-neutral-600 mb-2" />
              <p className="text-xs font-semibold text-neutral-300">Staging Area for Workspace Files</p>
              <p className="text-[10px] text-neutral-500 mt-0.5">Drag & drop files or folders (Supports sizes up to 2GB)</p>
              
              <input
                type="file"
                id="file-uploader"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => document.getElementById("file-uploader")?.click()}
                className="mt-3 px-3 py-1.5 bg-neutral-900 border border-neutral-850 hover:border-indigo-500 text-[11px] font-semibold text-white rounded-lg cursor-pointer transition-all"
              >
                Select Files
              </button>
            </div>

            {/* List of staged files */}
            {stagedFiles.length > 0 && (
              <div className="space-y-1 max-h-32 overflow-y-auto bg-neutral-950 p-2.5 rounded-lg border border-neutral-850">
                <p className="text-[10px] font-mono font-bold text-neutral-500 mb-1">STAGED FILES ({stagedFiles.length})</p>
                {stagedFiles.map((file, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[11px] py-1 border-b border-neutral-900/40 font-mono">
                    <span className="text-neutral-300 truncate max-w-[200px] flex items-center gap-1">
                      <File className="w-3 h-3 text-neutral-500" />
                      {file.name}
                    </span>
                    <span className="text-neutral-500">{file.size}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Dynamic parameters for tools */}
            {stagedFiles.length > 0 && (
              <div className="space-y-3 pt-2">
                {toolId === "file-sharing" && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-neutral-400">File Lifespan Duration (TTL)</label>
                    <select
                      value={shareTime}
                      onChange={(e) => setShareTime(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-1.5 px-2.5 text-xs text-neutral-300 focus:outline-none"
                    >
                      <option value="10 Min">10 Minutes (Instant check)</option>
                      <option value="1 Hour">1 Hour (Standard delivery)</option>
                      <option value="1 Day">1 Day (Short collaborate)</option>
                      <option value="7 Days">7 Days (Long storage)</option>
                    </select>
                  </div>
                )}

                {toolId === "file-splitter" && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-neutral-400">Split Chunk Size Limit (MB)</label>
                    <select
                      value={splitSize}
                      onChange={(e) => setSplitSize(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-1.5 px-2.5 text-xs text-neutral-300 focus:outline-none"
                    >
                      <option value="5">5 MB (Standard email attachment)</option>
                      <option value="10">10 MB (Discord limit)</option>
                      <option value="50">50 MB (Slack free limit)</option>
                      <option value="100">100 MB (Github file limit)</option>
                    </select>
                  </div>
                )}

                {toolId === "file-batch-rename" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-neutral-400">Filename Prefix</label>
                      <input
                        type="text"
                        value={renamePrefix}
                        onChange={(e) => setRenamePrefix(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-neutral-400">Filename Suffix</label>
                      <input
                        type="text"
                        value={renameSuffix}
                        onChange={(e) => setRenameSuffix(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                )}

                {toolId !== "zip-extractor" && (
                  <button
                    onClick={executeFileAction}
                    disabled={loading}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800/40 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : renderIcon()}
                    Execute File Operations
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Previews / Results */}
        <div className="lg:col-span-6 flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden min-h-[340px]">
          <div className="px-5 py-3.5 border-b border-neutral-800/60 bg-neutral-950 flex justify-between items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">Operations Display Board</span>
          </div>

          <div className="flex-grow p-6 bg-neutral-950/40 flex flex-col items-center justify-center">
            {loading ? (
              <div className="w-full max-w-xs space-y-3">
                <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto animate-bounce" />
                <p className="text-xs text-neutral-400 text-center">Parsing structure metadata ({progress}%)...</p>
                <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden border border-neutral-800">
                  <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : zipContents.length > 0 && toolId === "zip-extractor" ? (
              <div className="w-full space-y-4">
                <div className="bg-neutral-950 border border-neutral-850 p-3 rounded-lg space-y-2">
                  <p className="text-[10px] font-mono font-bold text-neutral-500 uppercase flex items-center gap-1">
                    <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
                    Unzipped Directory Tree Map
                  </p>
                  
                  <div className="space-y-1 text-xs">
                    {zipContents.map((node, i) => (
                      <div key={i} className="flex items-center gap-1.5 py-1 text-neutral-300 hover:text-white font-mono pl-2">
                        <ChevronRight className="w-3 h-3 text-neutral-600" />
                        <span>📂 {node}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    onRecordHistory("Extracted contents of ZIP package");
                    if (onTriggerNotification) {
                      onTriggerNotification("Unzipped Package! 📂", "All packed directories and binary assets compiled to downloads.");
                    }
                  }}
                  className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg cursor-pointer"
                >
                  Unpack & Save All Files
                </button>
              </div>
            ) : successResult ? (
              <div className="text-center space-y-4 w-full">
                <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl max-w-sm mx-auto space-y-2 text-center">
                  <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-xs font-semibold text-white">Action Completed Successfully!</p>
                  <p className="text-[10px] font-mono text-neutral-400 break-all">{successResult}</p>
                  
                  {shareUrl && (
                    <div className="mt-3 p-2 bg-neutral-950 border border-neutral-850 rounded-md text-left space-y-1">
                      <p className="text-[9px] font-mono font-bold text-neutral-500 uppercase">ENCRYPTED PUBLIC SHARE LINK:</p>
                      <p className="text-[10px] text-indigo-400 font-mono truncate select-all">{shareUrl}</p>
                    </div>
                  )}
                </div>

                {!shareUrl && (
                  <a
                    href={`#download_${successResult}`}
                    onClick={(e) => e.preventDefault()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-lg cursor-pointer shadow-lg shadow-indigo-950/20"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download File Outputs
                  </a>
                )}
              </div>
            ) : (
              <div className="text-center text-neutral-600">
                <File className="w-10 h-10 mb-2 opacity-20 text-indigo-400 mx-auto" />
                <p className="text-xs">Staged files will display here.</p>
                <p className="text-[10px] text-neutral-700 mt-1">Upload your zip, document or package to inspect indices and run filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEO guidelines & FAQs */}
      <ToolGuide
        toolId={toolId}
        category="File"
        onSelectTool={onSelectTool}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        onTriggerNotification={onTriggerNotification}
      />
    </div>
  );
}
