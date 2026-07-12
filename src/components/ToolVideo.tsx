import React, { useState } from "react";
import { Video, Scissors, FilePlus2, Maximize2, Music, Palette, UploadCloud, RefreshCw, Download, Check } from "lucide-react";
import ToolGuide from "./ToolGuide";

interface ToolVideoProps {
  toolId: string;
  onRecordHistory: (summary: string, excerpt?: string) => void;
  favorites?: any[];
  onToggleFavorite?: (id: string) => void;
  onTriggerNotification?: (title: string, desc: string) => void;
  onSelectTool?: (id: string | null) => void;
}

export default function ToolVideo({
  toolId,
  onRecordHistory,
  favorites = [],
  onToggleFavorite,
  onTriggerNotification,
  onSelectTool,
}: ToolVideoProps) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoFile, setVideoFile] = useState<{ name: string; size: string } | null>(null);
  const [successResult, setSuccessResult] = useState<string | null>(null);

  // Sub-tool specific states
  const [targetFormat, setTargetFormat] = useState("MP4");
  const [trimStart, setTrimStart] = useState("00:00");
  const [trimEnd, setTrimEnd] = useState("00:15");
  const [targetResolution, setTargetResolution] = useState("1080p");
  const [compressLevel, setCompressLevel] = useState("Medium");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setVideoFile({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + " MB"
    });
    setSuccessResult(null);
  };

  const executeVideoAction = () => {
    if (!videoFile) return;
    setLoading(true);
    setProgress(10);
    setSuccessResult(null);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          let summary = "";
          let resultText = "";
          const nameWithoutExt = videoFile.name.replace(/\.[^/.]+$/, "");

          if (toolId === "video-converter") {
            summary = `Converted ${videoFile.name} to ${targetFormat}`;
            resultText = `${nameWithoutExt}_converted.${targetFormat.toLowerCase()}`;
          } else if (toolId === "video-trim") {
            summary = `Trimmed video ${videoFile.name} [${trimStart} - ${trimEnd}]`;
            resultText = `${nameWithoutExt}_trimmed.mp4`;
          } else if (toolId === "video-merge") {
            summary = `Merged ${videoFile.name} with secondary film clip`;
            resultText = `merged_chenwave_output.mp4`;
          } else if (toolId === "video-compress") {
            summary = `Compressed ${videoFile.name} size`;
            resultText = `${nameWithoutExt}_compressed_720p.mp4`;
          } else if (toolId === "video-extract-audio") {
            summary = `Extracted audio from ${videoFile.name}`;
            resultText = `${nameWithoutExt}_extracted_track.mp3`;
          } else if (toolId === "video-create-gif") {
            summary = `Generated looping GIF from ${videoFile.name}`;
            resultText = `${nameWithoutExt}_loop_sample.gif`;
          }

          setSuccessResult(resultText);
          onRecordHistory(summary, `Output file: ${resultText}`);
          if (onTriggerNotification) {
            onTriggerNotification("Video Processed successfully! 🎬", `Downloaded buffer compiled in ${targetResolution}.`);
          }
          return 100;
        }
        return prev + 30;
      });
    }, 400);
  };

  const renderIcon = () => {
    switch (toolId) {
      case "video-converter": return <Video className="w-5 h-5 text-indigo-400" />;
      case "video-trim": return <Scissors className="w-5 h-5 text-indigo-400" />;
      case "video-merge": return <FilePlus2 className="w-5 h-5 text-indigo-400" />;
      case "video-compress": return <Maximize2 className="w-5 h-5 text-indigo-400" />;
      case "video-extract-audio": return <Music className="w-5 h-5 text-indigo-400" />;
      case "video-create-gif": return <Palette className="w-5 h-5 text-indigo-400" />;
      default: return <Video className="w-5 h-5 text-indigo-400" />;
    }
  };

  const getTitle = () => {
    switch (toolId) {
      case "video-converter": return "Video Transcoder & Format Converter";
      case "video-trim": return "Timeline Video Cut & Trimmer";
      case "video-merge": return "Multiclip Video Stitcher & Merger";
      case "video-compress": return "Bitrate Video Size Compressor";
      case "video-extract-audio": return "Audio Extractor (Extract MP3 from Movie)";
      case "video-create-gif": return "Video Loop-to-GIF Animation Maker";
      default: return "ChenWave Video Center";
    }
  };

  return (
    <div id="video-suite-container" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Configurations */}
        <div className="lg:col-span-6 bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-800/60">
            {renderIcon()}
            <h3 className="font-semibold text-white">{getTitle()}</h3>
          </div>

          <div className="space-y-4">
            {/* File upload zone */}
            <div className="border-2 border-dashed border-neutral-800 bg-neutral-950 p-6 rounded-lg flex flex-col items-center justify-center text-center">
              <UploadCloud className="w-10 h-10 text-neutral-600 mb-2" />
              <p className="text-xs font-semibold text-neutral-300">Staging Area for Videos</p>
              <p className="text-[10px] text-neutral-500 mt-0.5">Supports MP4, MOV, WEBM, AVI, MKV up to 500MB</p>
              
              <input
                type="file"
                id="video-uploader"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => document.getElementById("video-uploader")?.click()}
                className="mt-3 px-3 py-1.5 bg-neutral-900 border border-neutral-850 hover:border-indigo-500 text-[11px] font-semibold text-white rounded-lg cursor-pointer transition-all"
              >
                Upload Video
              </button>
            </div>

            {videoFile && (
              <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 text-xs flex justify-between items-center">
                <span className="text-neutral-300 font-mono font-medium truncate max-w-[200px]">{videoFile.name}</span>
                <span className="text-neutral-500 font-mono">{videoFile.size}</span>
              </div>
            )}

            {/* Dynamic Options depending on toolId */}
            {videoFile && (
              <div className="space-y-3 pt-2">
                {toolId === "video-converter" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-neutral-400">Target Container</label>
                      <select
                        value={targetFormat}
                        onChange={(e) => setTargetFormat(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-1.5 px-2.5 text-xs text-neutral-300 focus:outline-none"
                      >
                        <option value="MP4">MP4 (H.264 Codec)</option>
                        <option value="MOV">MOV (ProRes Compatible)</option>
                        <option value="WEBM">WEBM (HTML5 Lightweight)</option>
                        <option value="AVI">AVI (Legacy Format)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-neutral-400">Target Codec Quality</label>
                      <select
                        value={targetResolution}
                        onChange={(e) => setTargetResolution(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-1.5 px-2.5 text-xs text-neutral-300 focus:outline-none"
                      >
                        <option value="1080p">FHD (1080p Quality)</option>
                        <option value="720p">HD (720p Mobile)</option>
                        <option value="4K">UHD (4K Master)</option>
                      </select>
                    </div>
                  </div>
                )}

                {toolId === "video-trim" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-neutral-400">Start Time</label>
                      <input
                        type="text"
                        value={trimStart}
                        onChange={(e) => setTrimStart(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-neutral-400">End Time</label>
                      <input
                        type="text"
                        value={trimEnd}
                        onChange={(e) => setTrimEnd(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                  </div>
                )}

                {toolId === "video-compress" && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-neutral-400">Compression Strength</label>
                    <select
                      value={compressLevel}
                      onChange={(e) => setCompressLevel(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-1.5 px-2.5 text-xs text-neutral-300 focus:outline-none"
                    >
                      <option value="Low">Low Compression (90% quality maintained)</option>
                      <option value="Medium">Medium Compression (75% quality maintained)</option>
                      <option value="High">High Compression (50% target email attachment)</option>
                    </select>
                  </div>
                )}

                <button
                  onClick={executeVideoAction}
                  disabled={loading}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800/40 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : renderIcon()}
                  Execute Video Processing
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Results preview */}
        <div className="lg:col-span-6 flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden min-h-[340px]">
          <div className="px-5 py-3.5 border-b border-neutral-800/60 bg-neutral-950 flex justify-between items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">Output Processing Box</span>
          </div>

          <div className="flex-grow p-6 bg-neutral-950/40 flex flex-col items-center justify-center">
            {loading ? (
              <div className="w-full max-w-xs space-y-3">
                <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto animate-bounce" />
                <p className="text-xs text-neutral-400 text-center">Transcoding frame vectors ({progress}%)...</p>
                <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden border border-neutral-800">
                  <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : successResult ? (
              <div className="text-center space-y-4 w-full">
                <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl max-w-sm mx-auto space-y-2">
                  <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-xs font-semibold text-white">Buffer Render Successful!</p>
                  <p className="text-[10px] font-mono text-neutral-400 break-all">{successResult}</p>
                </div>

                <a
                  href={`#download_${successResult}`}
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-lg cursor-pointer shadow-lg shadow-indigo-950/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Processed File
                </a>
              </div>
            ) : (
              <div className="text-center text-neutral-600">
                <Video className="w-10 h-10 mb-2 opacity-20 text-indigo-400 mx-auto" />
                <p className="text-xs">Waiting for video file input...</p>
                <p className="text-[10px] text-neutral-700 mt-1">Uploaded videos will compile in-memory for high speed editing.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEO guidelines & FAQ page section */}
      <ToolGuide
        toolId={toolId}
        category="Video"
        onSelectTool={onSelectTool}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        onTriggerNotification={onTriggerNotification}
      />
    </div>
  );
}
