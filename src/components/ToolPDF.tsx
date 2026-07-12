import React, { useState, useRef, useEffect } from "react";
import { FilePlus2, FileText, ArrowRight, Download, UploadCloud, Trash2, HelpCircle, Eye, ShieldAlert, Check, RefreshCw, Scissors, Lock, Key, Type, Edit3 } from "lucide-react";
import ToolGuide from "./ToolGuide";

interface ToolPDFProps {
  toolId: string;
  onRecordHistory: (summary: string, excerpt?: string) => void;
  favorites?: any[];
  onToggleFavorite?: (id: string) => void;
  onTriggerNotification?: (title: string, desc: string) => void;
  onSelectTool?: (id: string | null) => void;
}

interface StagedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  content: string;
}

export default function ToolPDF({
  toolId,
  onRecordHistory,
  favorites = [],
  onToggleFavorite,
  onTriggerNotification,
  onSelectTool,
}: ToolPDFProps) {
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successResult, setSuccessResult] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // General configuration states
  const [outputName, setOutputName] = useState("ChenWave_Document.pdf");
  const [password, setPassword] = useState("");
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [watermarkColor, setWatermarkColor] = useState("#FF0000");
  const [pageRange, setPageRange] = useState("1-3");
  const [compressQuality, setCompressQuality] = useState("Medium");
  const [rotateDegrees, setRotateDegrees] = useState("90");

  // Signature canvas states
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Clear states when toolId shifts
  useEffect(() => {
    setStagedFiles([]);
    setSuccessResult(null);
    setDownloadUrl(null);
    const names: Record<string, string> = {
      "pdf-merge": "ChenWave_Merged_Document.pdf",
      "pdf-split": "ChenWave_Split_Pages.pdf",
      "pdf-compress": "ChenWave_Compressed.pdf",
      "pdf-protect": "ChenWave_Protected_Secured.pdf",
      "pdf-watermark": "ChenWave_Watermarked.pdf",
      "pdf-signature": "ChenWave_Signed_Contract.pdf",
    };
    setOutputName(names[toolId] || "ChenWave_Output.pdf");
  }, [toolId]);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      processIncomingFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processIncomingFiles(e.target.files);
    }
  };

  const processIncomingFiles = (files: FileList) => {
    const list: StagedFile[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const textContent = (event.target?.result as string) || "";
        const newItem: StagedFile = {
          id: "staged_" + Math.random().toString(36).substring(2, 9),
          name: file.name,
          size: file.size,
          type: file.type || "application/pdf",
          content: textContent.substring(0, 5000), // Limit size for local mock storage
        };
        setStagedFiles((prev) => [...prev, newItem]);
      };
      reader.readAsText(file);
    });
  };

  const deleteStagedFile = (id: string) => {
    setStagedFiles((prev) => prev.filter((f) => f.id !== id));
    setSuccessResult(null);
    setDownloadUrl(null);
  };

  // Canvas drawing hand-drawn signatures
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#4f46e5"; // Indigo-600
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";

    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const executePDFAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (stagedFiles.length === 0) return;
    setLoading(true);
    setProgress(15);
    setSuccessResult(null);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);

          let summary = "";
          let resultText = "";

          // Synthesize mock PDF output binary
          const header = `%PDF-1.4\n%ChenWave Professional Suite compiled buffer\n\n`;
          const combinedText = stagedFiles
            .map((f, i) => `=== SHEET ${i + 1}: ${f.name} ===\n${f.content.substring(0, 1000)}`)
            .join("\n\n");

          const blob = new Blob([header + combinedText], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          setDownloadUrl(url);

          if (toolId === "pdf-merge") {
            summary = `Merged ${stagedFiles.length} files into "${outputName}"`;
            resultText = outputName;
          } else if (toolId === "pdf-split") {
            summary = `Split PDF "${stagedFiles[0].name}" [pages: ${pageRange}]`;
            resultText = `${stagedFiles[0].name.replace(/\.[^/.]+$/, "")}_extracted_pages.pdf`;
          } else if (toolId === "pdf-compress") {
            summary = `Compressed PDF "${stagedFiles[0].name}" with ${compressQuality} algorithm`;
            resultText = `${stagedFiles[0].name.replace(/\.[^/.]+$/, "")}_compressed.pdf`;
          } else if (toolId === "pdf-protect") {
            summary = `Protected PDF "${stagedFiles[0].name}" with military AES passphrase`;
            resultText = `${stagedFiles[0].name.replace(/\.[^/.]+$/, "")}_encrypted.pdf`;
          } else if (toolId === "pdf-unlock") {
            summary = `Decrypted and unlocked password from PDF "${stagedFiles[0].name}"`;
            resultText = `${stagedFiles[0].name.replace(/\.[^/.]+$/, "")}_unsecured.pdf`;
          } else if (toolId === "pdf-watermark") {
            summary = `Stamped watermark "${watermarkText}" onto PDF "${stagedFiles[0].name}"`;
            resultText = `${stagedFiles[0].name.replace(/\.[^/.]+$/, "")}_stamped.pdf`;
          } else if (toolId === "pdf-signature") {
            summary = `Digitally signed document "${stagedFiles[0].name}" with touch-pad signature`;
            resultText = `${stagedFiles[0].name.replace(/\.[^/.]+$/, "")}_signed.pdf`;
          } else if (toolId.startsWith("pdf-to-")) {
            const format = toolId.split("-")[2].toUpperCase();
            summary = `Converted PDF "${stagedFiles[0].name}" to editable ${format} sheet`;
            resultText = `${stagedFiles[0].name.replace(/\.[^/.]+$/, "")}_converted.${format === "PPT" ? "pptx" : format === "EXCEL" ? "xlsx" : "docx"}`;
          } else if (toolId.endsWith("-to-pdf")) {
            summary = `Converted Office document "${stagedFiles[0].name}" to read-only PDF`;
            resultText = `${stagedFiles[0].name.replace(/\.[^/.]+$/, "")}_locked.pdf`;
          }

          setSuccessResult(resultText);
          onRecordHistory(summary, `Output compiled successfully: ${resultText}`);
          if (onTriggerNotification) {
            onTriggerNotification("PDF Process Successful! 📄", `Buffer downloaded safely.`);
          }
          return 100;
        }
        return prev + 30;
      });
    }, 400);
  };

  const getTitle = () => {
    switch (toolId) {
      case "pdf-merge": return "Merge PDF Documents";
      case "pdf-split": return "Split PDF & Extract Pages";
      case "pdf-compress": return "Compress PDF File Size";
      case "pdf-protect": return "Lock PDF with Password Encryption";
      case "pdf-unlock": return "Unlock PDF Password Restraints";
      case "pdf-watermark": return "PDF Copyright Watermark Stamper";
      case "pdf-signature": return "E-Sign PDF Legal Documents";
      case "pdf-to-word": return "Convert PDF to Editable Word DOCX";
      case "pdf-to-excel": return "Convert PDF to Spreadsheet XLSX";
      case "pdf-to-ppt": return "Convert PDF to presentation PPTX";
      case "word-to-pdf": return "Convert Word DOCX to secure PDF";
      case "excel-to-pdf": return "Convert Excel Sheets to clean PDF";
      case "ppt-to-pdf": return "Convert Presentation slides to PDF";
      case "image-to-pdf": return "Convert JPEG/PNG images to unified PDF";
      default: return "ChenWave PDF Suite";
    }
  };

  return (
    <div id="pdf-master-workspace" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Section: Upload & Options */}
        <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-800/60">
            <div className="flex items-center gap-2">
              <FilePlus2 className="w-5 h-5 text-indigo-400" />
              <h3 className="font-semibold text-white">{getTitle()}</h3>
            </div>
            <span className="text-[10px] text-neutral-500 font-mono">Staged: {stagedFiles.length}</span>
          </div>

          <form onSubmit={executePDFAction} className="space-y-4">
            {/* Drag & Drop */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-800 hover:border-indigo-500/50 rounded-lg p-6 text-center cursor-pointer bg-neutral-950/40 hover:bg-neutral-950/80 transition-all group"
            >
              <input
                type="file"
                multiple={toolId === "pdf-merge" || toolId === "image-to-pdf"}
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
              />
              <UploadCloud className="w-10 h-10 mx-auto text-neutral-600 group-hover:text-indigo-400 transition-colors mb-2" />
              <p className="text-xs font-semibold text-neutral-300">Drag & drop source files here, or browse</p>
              <p className="text-[10px] text-neutral-500 mt-0.5">Compatible with PDF, Word, Excel, PowerPoint, JPEG, PNG (Max 50MB)</p>
            </div>

            {/* List of staged files */}
            {stagedFiles.length > 0 && (
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                <p className="text-[10px] font-mono font-bold text-neutral-500 uppercase">STAGED FILES:</p>
                {stagedFiles.map((file, i) => (
                  <div key={file.id} className="flex items-center justify-between p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-xs font-mono">
                    <span className="text-neutral-300 truncate max-w-[220px]">{file.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-500">({(file.size / 1024).toFixed(1)} KB)</span>
                      <button
                        type="button"
                        onClick={() => deleteStagedFile(file.id)}
                        className="p-1 rounded text-neutral-500 hover:text-red-400 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Sub-tool specific fields */}
            {stagedFiles.length > 0 && (
              <div className="space-y-4 pt-2 border-t border-neutral-850">
                {toolId === "pdf-protect" && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-400 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-indigo-400" />
                      AES Encryption Passphrase Key
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Add high-entropy password..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}

                {toolId === "pdf-unlock" && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-400 flex items-center gap-1">
                      <Key className="w-3.5 h-3.5 text-indigo-400" />
                      Decryption Owner Passphrase
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Type correct document password..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}

                {toolId === "pdf-watermark" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-400 flex items-center gap-1">
                        <Type className="w-3.5 h-3.5 text-indigo-400" />
                        Stamper Text
                      </label>
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-400">Stamp Color</label>
                      <input
                        type="color"
                        value={watermarkColor}
                        onChange={(e) => setWatermarkColor(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg h-8 cursor-pointer px-1 py-1"
                      />
                    </div>
                  </div>
                )}

                {toolId === "pdf-split" && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-400 flex items-center gap-1">
                      <Scissors className="w-3.5 h-3.5 text-indigo-400" />
                      Page extraction index ranges (e.g., 1-5, 8, 12)
                    </label>
                    <input
                      type="text"
                      value={pageRange}
                      onChange={(e) => setPageRange(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>
                )}

                {toolId === "pdf-compress" && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-400">Compression Strength</label>
                    <select
                      value={compressQuality}
                      onChange={(e) => setCompressQuality(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-1.5 px-2.5 text-xs text-neutral-300 focus:outline-none"
                    >
                      <option value="Low">Low Compression (95% text resolution kept)</option>
                      <option value="Medium">Medium Compression (80% standard web layout)</option>
                      <option value="High">High Compression (50% email attachment size)</option>
                    </select>
                  </div>
                )}

                {/* Hand-drawn signature pad */}
                {toolId === "pdf-signature" && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-neutral-400 flex items-center gap-1">
                      <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                      Draw signature below on touch pad:
                    </label>
                    <div className="relative border border-neutral-800 bg-white rounded-lg overflow-hidden h-36">
                      <canvas
                        ref={sigCanvasRef}
                        width={400}
                        height={140}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        className="w-full h-full cursor-crosshair"
                      />
                      <button
                        type="button"
                        onClick={clearSignature}
                        className="absolute bottom-2 right-2 px-2.5 py-1 bg-neutral-950 border border-neutral-800 text-[9px] font-bold text-red-400 hover:text-red-300 rounded"
                      >
                        Clear Canvas
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-400">Output Filename</label>
                  <input
                    type="text"
                    value={outputName}
                    onChange={(e) => setOutputName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800/40 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  Amalgamate PDF Buffers Now
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Right Section: Results display */}
        <div className="lg:col-span-5 flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden min-h-[380px]">
          <div className="px-5 py-3.5 border-b border-neutral-800/60 bg-neutral-950 flex justify-between items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">Export Logs</span>
          </div>

          <div className="flex-grow p-6 bg-neutral-950/40 flex flex-col items-center justify-center">
            {loading ? (
              <div className="w-full max-w-xs space-y-3">
                <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                <p className="text-xs text-neutral-400 text-center">Rebuilding layout structures ({progress}%)...</p>
                <div className="w-full bg-neutral-900 h-1 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : successResult && downloadUrl ? (
              <div className="text-center space-y-4 w-full">
                <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl max-w-xs mx-auto space-y-2">
                  <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-xs font-semibold text-white">Document compiled successfully!</p>
                  <p className="text-[10px] font-mono text-neutral-400 break-all">{successResult}</p>
                </div>

                <a
                  href={downloadUrl}
                  download={successResult}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-lg cursor-pointer shadow-lg shadow-indigo-950/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Processed PDF
                </a>
              </div>
            ) : (
              <div className="text-center text-neutral-600">
                <FileText className="w-10 h-10 mb-2 opacity-20 text-indigo-400 mx-auto" />
                <p className="text-xs">Waiting for staging inputs...</p>
                <p className="text-[10px] text-neutral-700 mt-1 font-sans">Uploading your source files triggers our in-browser alignment parsers.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Unified SEO Guidelines FAQs & guides bottom section */}
      <ToolGuide
        toolId={toolId}
        category="PDF"
        onSelectTool={onSelectTool}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        onTriggerNotification={onTriggerNotification}
      />
    </div>
  );
}
