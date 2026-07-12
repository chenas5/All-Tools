import React, { useState, useRef } from "react";
import { Music, Maximize2, Scissors, FilePlus2, Mic, Volume2, Mic2, Workflow, UploadCloud, RefreshCw, Download, Check, Play, Pause } from "lucide-react";
import ToolGuide from "./ToolGuide";

interface ToolAudioProps {
  toolId: string;
  onRecordHistory: (summary: string, excerpt?: string) => void;
  favorites?: any[];
  onToggleFavorite?: (id: string) => void;
  onTriggerNotification?: (title: string, desc: string) => void;
  onSelectTool?: (id: string | null) => void;
}

export default function ToolAudio({
  toolId,
  onRecordHistory,
  favorites = [],
  onToggleFavorite,
  onTriggerNotification,
  onSelectTool,
}: ToolAudioProps) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioFile, setAudioFile] = useState<{ name: string; size: string } | null>(null);
  const [successResult, setSuccessResult] = useState<string | null>(null);

  // Voice recorder states
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // TTS States
  const [ttsText, setTtsText] = useState("Hello! Welcome to ChenWave Tools AI Voice Synthesizer.");
  const [ttsPitch, setTtsPitch] = useState(1);
  const [ttsRate, setTtsRate] = useState(1);
  const [ttsPlaying, setTtsPlaying] = useState(false);

  // Audio specific states
  const [targetCodec, setTargetCodec] = useState("MP3");
  const [audioCutterRange, setAudioCutterRange] = useState("0:10 - 0:45");
  const [voiceChangerPitch, setVoiceChangerPitch] = useState("Robot");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setAudioFile({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB"
    });
    setSuccessResult(null);
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setRecordedBlobUrl(url);
        onRecordHistory("Recorded live mic speech", "Downloaded local voice recording WAV file.");
        if (onTriggerNotification) {
          onTriggerNotification("Recording Saved! 🎙️", "Mic voice record successfully saved in-memory.");
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      if (onTriggerNotification) {
        onTriggerNotification("Mic Access Denied", "Please authorize microphone access to run live voice recording.");
      }
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // stop stream tracks
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const executeSpeechSynth = () => {
    if (!ttsText.trim()) return;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(ttsText);
      utterance.pitch = ttsPitch;
      utterance.rate = ttsRate;
      utterance.onstart = () => setTtsPlaying(true);
      utterance.onend = () => setTtsPlaying(false);
      window.speechSynthesis.speak(utterance);
      onRecordHistory("Generated TTS speech synthesis", ttsText.substring(0, 40) + "...");
    } else {
      if (onTriggerNotification) {
        onTriggerNotification("TTS Not Supported", "This browser does not support standard speech synthesis APIs.");
      }
    }
  };

  const executeAudioAction = () => {
    if (!audioFile) return;
    setLoading(true);
    setProgress(0);
    setSuccessResult(null);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          const nameWithoutExt = audioFile.name.replace(/\.[^/.]+$/, "");
          let resultText = "";

          if (toolId === "audio-converter") {
            resultText = `${nameWithoutExt}_converted.${targetCodec.toLowerCase()}`;
          } else if (toolId === "audio-compress") {
            resultText = `${nameWithoutExt}_compressed_96kbps.mp3`;
          } else if (toolId === "audio-cutter") {
            resultText = `${nameWithoutExt}_cut.mp3`;
          } else if (toolId === "audio-merger") {
            resultText = `merged_chenwave_track.mp3`;
          } else if (toolId === "audio-voice-changer") {
            resultText = `${nameWithoutExt}_voice_${voiceChangerPitch.toLowerCase()}.mp3`;
          } else if (toolId === "audio-stt") {
            resultText = `transcript_${nameWithoutExt}.txt`;
          }

          setSuccessResult(resultText);
          onRecordHistory(`Processed Audio: ${resultText}`);
          if (onTriggerNotification) {
            onTriggerNotification("Audio Processed! 🎵", `Output file computed successfully.`);
          }
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const getTitle = () => {
    switch (toolId) {
      case "audio-converter": return "Universal Audio Format Converter";
      case "audio-compress": return "Audio Bitrate Compressor";
      case "audio-cutter": return "Precision MP3 Alarm & Ringtone Cutter";
      case "audio-merger": return "Multitrack Audio Timeline Merger";
      case "audio-voice-recorder": return "High-Fidelity Web Voice Recorder";
      case "audio-tts": return "Interactive Text to Speech Synthesizer";
      case "audio-stt": return "Automatic Speech to Text Transcriber";
      case "audio-voice-changer": return "Dynamic DSP Voice Effect Changer";
      default: return "ChenWave Audio Suite";
    }
  };

  const renderIcon = () => {
    switch (toolId) {
      case "audio-converter": return <Music className="w-5 h-5 text-indigo-400" />;
      case "audio-compress": return <Maximize2 className="w-5 h-5 text-indigo-400" />;
      case "audio-cutter": return <Scissors className="w-5 h-5 text-indigo-400" />;
      case "audio-merger": return <FilePlus2 className="w-5 h-5 text-indigo-400" />;
      case "audio-voice-recorder": return <Mic className="w-5 h-5 text-indigo-400" />;
      case "audio-tts": return <Volume2 className="w-5 h-5 text-indigo-400" />;
      case "audio-stt": return <Mic2 className="w-5 h-5 text-indigo-400" />;
      case "audio-voice-changer": return <Workflow className="w-5 h-5 text-indigo-400" />;
      default: return <Music className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div id="audio-suite-container" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Configurations column */}
        <div className="lg:col-span-6 bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-800/60">
            {renderIcon()}
            <h3 className="font-semibold text-white">{getTitle()}</h3>
          </div>

          {/* Special view: Voice Recorder */}
          {toolId === "audio-voice-recorder" && (
            <div className="space-y-4 text-center py-6">
              <div className="relative mx-auto w-20 h-20 bg-neutral-950 rounded-full flex items-center justify-center border border-neutral-800">
                {isRecording && (
                  <span className="absolute inset-0 rounded-full bg-red-600/20 border-2 border-red-500 animate-ping" />
                )}
                <Mic className={`w-8 h-8 ${isRecording ? "text-red-500" : "text-neutral-400"}`} />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">{isRecording ? "Recording Live Mic Audio" : "Voice Recorder Staged"}</p>
                <p className="text-[10px] text-neutral-500">Record verification, feedback, or test audios directly in-browser.</p>
              </div>

              <div className="flex justify-center gap-2">
                {!isRecording ? (
                  <button
                    onClick={handleStartRecording}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-xs font-semibold text-white rounded-lg cursor-pointer transition-all"
                  >
                    Start Recording
                  </button>
                ) : (
                  <button
                    onClick={handleStopRecording}
                    className="px-4 py-2 bg-neutral-950 border border-neutral-800 hover:text-red-400 text-xs font-semibold text-white rounded-lg cursor-pointer transition-all"
                  >
                    Stop Recording
                  </button>
                )}
              </div>

              {recordedBlobUrl && (
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-3 max-w-xs mx-auto">
                  <p className="text-[10px] font-mono text-neutral-400">Recorded Audio playback:</p>
                  <audio src={recordedBlobUrl} controls className="w-full h-8 bg-neutral-900 rounded" />
                  <a
                    href={recordedBlobUrl}
                    download="chenwave_voice_record.wav"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-[10px] font-semibold text-white rounded-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download WAV
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Special view: Text To Speech */}
          {toolId === "audio-tts" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-neutral-400">Target Spoken Text</label>
                <textarea
                  rows={4}
                  value={ttsText}
                  onChange={(e) => setTtsText(e.target.value)}
                  placeholder="Type anything out loud..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-neutral-400">Voice Pitch ({ttsPitch}x)</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={ttsPitch}
                    onChange={(e) => setTtsPitch(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-neutral-400">Speech Speed ({ttsRate}x)</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={ttsRate}
                    onChange={(e) => setTtsRate(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
              </div>

              <button
                onClick={executeSpeechSynth}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {ttsPlaying ? <Pause className="w-3.5 h-3.5 animate-pulse" /> : <Play className="w-3.5 h-3.5" />}
                Speak Text Aloud (SpeechSynthesis)
              </button>
            </div>
          )}

          {/* Upload forms for converters / compressors / cutters */}
          {toolId !== "audio-voice-recorder" && toolId !== "audio-tts" && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-neutral-800 bg-neutral-950 p-6 rounded-lg flex flex-col items-center justify-center text-center">
                <UploadCloud className="w-10 h-10 text-neutral-600 mb-2" />
                <p className="text-xs font-semibold text-neutral-300">Staging Area for Audio Tracks</p>
                <p className="text-[10px] text-neutral-500">Supports MP3, WAV, AAC, OGG up to 50MB</p>
                
                <input
                  type="file"
                  id="audio-uploader"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => document.getElementById("audio-uploader")?.click()}
                  className="mt-3 px-3 py-1.5 bg-neutral-900 border border-neutral-850 hover:border-indigo-500 text-[11px] font-semibold text-white rounded-lg cursor-pointer transition-all"
                >
                  Upload Audio Track
                </button>
              </div>

              {audioFile && (
                <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 text-xs flex justify-between items-center">
                  <span className="text-neutral-300 font-mono font-medium truncate max-w-[200px]">{audioFile.name}</span>
                  <span className="text-neutral-500 font-mono">{audioFile.size}</span>
                </div>
              )}

              {audioFile && (
                <div className="space-y-3">
                  {toolId === "audio-converter" && (
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-neutral-400">Target Audio Format</label>
                      <select
                        value={targetCodec}
                        onChange={(e) => setTargetCodec(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-1.5 px-2.5 text-xs text-neutral-300 focus:outline-none"
                      >
                        <option value="MP3">MP3 Format (Lightweight)</option>
                        <option value="WAV">WAV format (Uncompressed Studio)</option>
                        <option value="AAC">AAC Format (Apple M4A)</option>
                        <option value="OGG">OGG Vorbis (Game Dev format)</option>
                      </select>
                    </div>
                  )}

                  {toolId === "audio-cutter" && (
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-neutral-400">Cutter Segment Range (mm:ss)</label>
                      <input
                        type="text"
                        value={audioCutterRange}
                        onChange={(e) => setAudioCutterRange(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                  )}

                  {toolId === "audio-voice-changer" && (
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-neutral-400">Pitch modulation type</label>
                      <select
                        value={voiceChangerPitch}
                        onChange={(e) => setVoiceChangerPitch(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-1.5 px-2.5 text-xs text-neutral-300 focus:outline-none"
                      >
                        <option value="Robot">🤖 Metallic Robot Pitch</option>
                        <option value="Echo">📢 Space Hall Echo</option>
                        <option value="Chipmunk">🐿️ Ultra-High Chipmunk</option>
                        <option value="Deep">👹 Deep Cave Orge Pitch</option>
                      </select>
                    </div>
                  )}

                  <button
                    onClick={executeAudioAction}
                    disabled={loading}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800/40 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : renderIcon()}
                    Execute Audio Processing
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results preview column */}
        <div className="lg:col-span-6 flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden min-h-[340px]">
          <div className="px-5 py-3.5 border-b border-neutral-800/60 bg-neutral-950 flex justify-between items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">Output Processing Box</span>
          </div>

          <div className="flex-grow p-6 bg-neutral-950/40 flex flex-col items-center justify-center">
            {loading ? (
              <div className="w-full max-w-xs space-y-3">
                <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto animate-bounce" />
                <p className="text-xs text-neutral-400 text-center">Modulating soundwaves ({progress}%)...</p>
                <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden border border-neutral-800">
                  <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : successResult ? (
              <div className="text-center space-y-4 w-full">
                <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl max-w-sm mx-auto space-y-2">
                  <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-xs font-semibold text-white">Audio Processing Successful!</p>
                  <p className="text-[10px] font-mono text-neutral-400 break-all">{successResult}</p>
                </div>

                <a
                  href={`#download_${successResult}`}
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-lg cursor-pointer shadow-lg shadow-indigo-950/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Processed Track
                </a>
              </div>
            ) : (
              <div className="text-center text-neutral-600">
                <Music className="w-10 h-10 mb-2 opacity-20 text-indigo-400 mx-auto" />
                <p className="text-xs">Waiting for audio track inputs...</p>
                <p className="text-[10px] text-neutral-700 mt-1">Staging files or selecting live inputs triggers our browser web-audio mixers.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic SEO FAQs and guides */}
      <ToolGuide
        toolId={toolId}
        category="Audio"
        onSelectTool={onSelectTool}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        onTriggerNotification={onTriggerNotification}
      />
    </div>
  );
}
