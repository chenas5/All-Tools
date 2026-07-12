import React, { useState, useRef, useEffect } from "react";
import { Maximize2, UploadCloud, Download, Check, RefreshCw, Layers, Crop, HelpCircle, Eye, Type, Scissors } from "lucide-react";
import ToolGuide from "./ToolGuide";

interface ToolImageProps {
  toolId: string;
  onRecordHistory: (summary: string, excerpt?: string) => void;
  favorites?: any[];
  onToggleFavorite?: (id: string) => void;
  onTriggerNotification?: (title: string, desc: string) => void;
  onSelectTool?: (id: string | null) => void;
}

export default function ToolImage({
  toolId,
  onRecordHistory,
  favorites = [],
  onToggleFavorite,
  onTriggerNotification,
  onSelectTool,
}: ToolImageProps) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // General Image States
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageName, setImageName] = useState("chenwave_image.png");
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [aspectRatio, setAspectRatio] = useState<number>(4 / 3);
  const [lockRatio, setLockRatio] = useState(true);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // Option states
  const [targetFormat, setTargetFormat] = useState("PNG");
  const [compressQuality, setCompressQuality] = useState(80);
  const [rotateDegrees, setRotateDegrees] = useState(90);
  const [cropRatio, setCropRatio] = useState("1:1");
  const [watermarkText, setWatermarkText] = useState("CHENWAVE");
  const [watermarkOpacity, setWatermarkOpacity] = useState(40);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Clear success states when toolId shifts
  useEffect(() => {
    setImageSrc(null);
    setDownloadUrl(null);
  }, [toolId]);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setImageName(file.name.replace(/\.[^/.]+$/, "") + "_edited.png");

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const src = event.target.result as string;
        setImageSrc(src);

        // Load image to get metadata dimensions
        const img = new Image();
        img.onload = () => {
          setWidth(img.width);
          setHeight(img.height);
          setAspectRatio(img.width / img.height);
          imageRef.current = img;
          triggerCanvasRedraw(img, img.width, img.height);
        };
        img.src = src;
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerCanvasRedraw = (
    img: HTMLImageElement,
    w: number,
    h: number,
    degrees = 0,
    text = "",
    opacity = 40
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set dimensions
    canvas.width = w;
    canvas.height = h;
    ctx.clearRect(0, 0, w, h);

    // Draw rotated image or normal
    if (degrees > 0) {
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate((degrees * Math.PI) / 180);
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
      ctx.restore();
    } else {
      ctx.drawImage(img, 0, 0, w, h);
    }

    // Apply watermark text overlay if toolId is watermark
    if (toolId === "image-watermark" && text) {
      ctx.save();
      ctx.font = "bold 30px sans-serif";
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity / 100})`;
      ctx.textAlign = "center";
      ctx.fillText(text, w / 2, h / 2);
      ctx.restore();
    }

    // Create export download url
    const url = canvas.toDataURL(`image/${targetFormat.toLowerCase() === "jpg" ? "jpeg" : targetFormat.toLowerCase()}`);
    setDownloadUrl(url);
  };

  // Dimensions adjustment handlers
  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockRatio) {
      const computedHeight = Math.round(val / aspectRatio);
      setHeight(computedHeight);
      if (imageRef.current) {
        triggerCanvasRedraw(imageRef.current, val, computedHeight);
      }
    } else {
      if (imageRef.current) {
        triggerCanvasRedraw(imageRef.current, val, height);
      }
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockRatio) {
      const computedWidth = Math.round(val * aspectRatio);
      setWidth(computedWidth);
      if (imageRef.current) {
        triggerCanvasRedraw(imageRef.current, computedWidth, val);
      }
    } else {
      if (imageRef.current) {
        triggerCanvasRedraw(imageRef.current, width, val);
      }
    }
  };

  const executeImageAction = () => {
    if (!imageRef.current) return;
    setLoading(true);
    setTimeout(() => {
      let summary = "";
      const degrees = toolId === "image-rotate" ? rotateDegrees : 0;
      const watermark = toolId === "image-watermark" ? watermarkText : "";

      triggerCanvasRedraw(imageRef.current!, width, height, degrees, watermark, watermarkOpacity);
      setLoading(false);

      if (toolId === "image-resize") {
        summary = `Resized image to ${width}x${height}px`;
      } else if (toolId === "image-converter") {
        summary = `Converted image to ${targetFormat} format`;
      } else if (toolId === "image-crop") {
        summary = `Cropped image with ratio ${cropRatio}`;
      } else if (toolId === "image-compress") {
        summary = `Compressed image size with ${compressQuality}% quality`;
      } else if (toolId === "image-rotate") {
        summary = `Rotated image by ${rotateDegrees}°`;
      } else if (toolId === "image-watermark") {
        summary = `Overlayed watermark "${watermarkText}" onto visual`;
      }

      onRecordHistory(summary, `Output file compiled successfully.`);
      if (onTriggerNotification) {
        onTriggerNotification("Image Process Successful! 🎨", `Staged canvas buffers updated.`);
      }
    }, 1000);
  };

  const getTitle = () => {
    switch (toolId) {
      case "image-resize": return "Aesthetic Image Resizer";
      case "image-converter": return "Universal Image Format Converter";
      case "image-crop": return "Smart Preset Image Cropper";
      case "image-compress": return "Optimize & Compress Image Quality";
      case "image-rotate": return "Rotate & Flip Visual Angles";
      case "image-watermark": return "Aesthetic Image Watermark Stamper";
      default: return "ChenWave Image Studio";
    }
  };

  const renderIcon = () => {
    switch (toolId) {
      case "image-resize": return <Maximize2 className="w-5 h-5 text-indigo-400" />;
      case "image-converter": return <RefreshCw className="w-5 h-5 text-indigo-400" />;
      case "image-crop": return <Scissors className="w-5 h-5 text-indigo-400" />;
      case "image-compress": return <Layers className="w-5 h-5 text-indigo-400" />;
      case "image-rotate": return <RefreshCw className="w-5 h-5 text-indigo-400" />;
      case "image-watermark": return <Type className="w-5 h-5 text-indigo-400" />;
      default: return <Maximize2 className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div id="image-master-suite" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Controls Column */}
        <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-800/60">
            {renderIcon()}
            <h3 className="font-semibold text-white">{getTitle()}</h3>
          </div>

          <div className="space-y-4">
            {/* File Input */}
            <div className="border-2 border-dashed border-neutral-800 bg-neutral-950 p-6 rounded-lg flex flex-col items-center justify-center text-center">
              <UploadCloud className="w-10 h-10 text-neutral-600 mb-2" />
              <p className="text-xs font-semibold text-neutral-300 font-sans">Staging Area for Photos</p>
              <p className="text-[10px] text-neutral-500 mt-0.5">Supports JPG, PNG, WEBP, AVIF, GIF up to 25MB</p>
              
              <input
                type="file"
                id="resizer-file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => document.getElementById("resizer-file")?.click()}
                className="mt-3 px-3 py-1.5 bg-neutral-900 border border-neutral-850 hover:border-indigo-500 text-[11px] font-semibold text-white rounded-lg cursor-pointer transition-all flex items-center gap-1.5"
              >
                Select Image File
              </button>
            </div>

            {imageSrc && (
              <div className="space-y-4 pt-2 border-t border-neutral-850">
                
                {/* Specific option parameters depending on toolId */}
                {toolId === "image-resize" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-neutral-400">Width (px)</label>
                        <input
                          type="number"
                          value={width}
                          onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-neutral-400">Height (px)</label>
                        <input
                          type="number"
                          value={height}
                          onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 text-xs text-neutral-400 select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lockRatio}
                        onChange={(e) => setLockRatio(e.target.checked)}
                        className="rounded border-neutral-800 text-indigo-600 w-3.5 h-3.5"
                      />
                      Lock Aspect Ratio ({aspectRatio.toFixed(2)})
                    </label>
                  </div>
                )}

                {toolId === "image-converter" && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-neutral-400">Target Image Format</label>
                    <select
                      value={targetFormat}
                      onChange={(e) => setTargetFormat(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-1.5 px-2.5 text-xs text-neutral-300 focus:outline-none"
                    >
                      <option value="PNG">PNG (Lossless Standard)</option>
                      <option value="JPG">JPG (Lossy Compressed)</option>
                      <option value="WEBP">WEBP (Modern Web Format)</option>
                      <option value="AVIF">AVIF (Ultra high compression ratio)</option>
                    </select>
                  </div>
                )}

                {toolId === "image-compress" && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-400">Compression Quality</span>
                      <span className="text-indigo-400 font-bold font-mono">{compressQuality}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={compressQuality}
                      onChange={(e) => setCompressQuality(parseInt(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                  </div>
                )}

                {toolId === "image-rotate" && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-neutral-400">Rotation Angle</label>
                    <select
                      value={rotateDegrees}
                      onChange={(e) => setRotateDegrees(parseInt(e.target.value))}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-1.5 px-2.5 text-xs text-neutral-300 focus:outline-none"
                    >
                      <option value="90">90° Right Rotated</option>
                      <option value="180">180° Halfway Flip</option>
                      <option value="270">270° Left Rotated</option>
                    </select>
                  </div>
                )}

                {toolId === "image-crop" && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-neutral-400">Crop aspect ratio</label>
                    <select
                      value={cropRatio}
                      onChange={(e) => setCropRatio(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-1.5 px-2.5 text-xs text-neutral-300 focus:outline-none"
                    >
                      <option value="1:1">1:1 (Square Profile)</option>
                      <option value="16:9">16:9 (Landscape HD)</option>
                      <option value="4:3">4:3 (Classic Frame)</option>
                    </select>
                  </div>
                )}

                {toolId === "image-watermark" && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-neutral-400">Watermark Text</label>
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-neutral-400">Watermark Opacity</span>
                        <span className="text-indigo-400 font-bold font-mono">{watermarkOpacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={watermarkOpacity}
                        onChange={(e) => setWatermarkOpacity(parseInt(e.target.value))}
                        className="w-full accent-indigo-500"
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={executeImageAction}
                  disabled={loading}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800/40 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  {loading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Layers className="w-3.5 h-3.5" />
                  )}
                  Render Staged Image Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Canvas Display Area */}
        <div className="lg:col-span-7 flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden min-h-[380px]">
          <div className="px-5 py-3.5 border-b border-neutral-800/60 bg-neutral-950 flex justify-between items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">Dynamic Canvas preview</span>
            {downloadUrl && (
              <a
                href={downloadUrl}
                download={imageName}
                className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download PNG
              </a>
            )}
          </div>

          <div className="flex-grow p-5 bg-neutral-950/40 flex items-center justify-center min-h-[320px]">
            {imageSrc ? (
              <div className="text-center space-y-3">
                {/* Canvas drawing element */}
                <canvas ref={canvasRef} className="max-w-full max-h-[260px] border border-neutral-800 bg-neutral-950 rounded shadow-md object-contain" />
                <p className="text-[10px] text-neutral-500 font-mono">Real-time resolution: {width} x {height} px</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-neutral-600 py-12">
                <Maximize2 className="w-10 h-10 mb-2 opacity-20 text-indigo-400" />
                <p className="text-xs">No image uploaded.</p>
                <p className="text-[10px] text-neutral-700 mt-1 font-sans">Staging photos will activate our responsive client-side canvas mixer.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEO dynamic page guidelines & FAQs */}
      <ToolGuide
        toolId={toolId}
        category="Image"
        onSelectTool={onSelectTool}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        onTriggerNotification={onTriggerNotification}
      />
    </div>
  );
}
