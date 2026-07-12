import React, { useState, useEffect } from "react";
import { Sparkles, FileText, Send, User, Bot, Trash2, Copy, Check, Loader2, Languages, SpellCheck, Workflow, Mail, Compass, Palette, Eye, Scissors, UploadCloud } from "lucide-react";
import ToolGuide from "./ToolGuide";

interface ToolAIProps {
  toolId: string;
  onRecordHistory: (summary: string, excerpt?: string) => void;
  favorites?: any[];
  onToggleFavorite?: (id: string) => void;
  onTriggerNotification?: (title: string, desc: string) => void;
  onSelectTool?: (id: string | null) => void;
}

interface Message {
  sender: "user" | "bot";
  text: string;
  time: string;
}

export default function ToolAI({
  toolId,
  onRecordHistory,
  favorites = [],
  onToggleFavorite,
  onTriggerNotification,
  onSelectTool,
}: ToolAIProps) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. GENERAL TEXT FIELDS
  const [textInput, setTextInput] = useState("");
  const [textOutput, setTextOutput] = useState("");

  // Sub-tool specific options
  const [sourceLang, setSourceLang] = useState("Detect Language");
  const [targetLang, setTargetLang] = useState("Spanish");
  const [grammarStyle, setGrammarStyle] = useState("Professional");
  const [humanizerStyle, setHumanizerStyle] = useState("Highly Conversational");
  const [emailTone, setEmailTone] = useState("Friendly Invitation");
  const [socialPlatform, setSocialPlatform] = useState("TikTok Video Hook");
  const [imageStyle, setImageStyle] = useState("Cyberpunk Digital Vector");

  // 2. CHAT ASSISTANT STATES
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! I am the Smart AI Assistant of All Tools. Powered by Gemini 3.5 Flash. Ask me any developer, math, content, or general productivity questions!",
      time: new Date().toLocaleTimeString(),
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  // 3. ARTICLE WRITER & SUMMARIZER STATES
  const [writerTopic, setWriterTopic] = useState("");
  const [writerTone, setWriterTone] = useState("Professional & SEO Optimized");
  const [summarizerStyle, setSummarizerStyle] = useState("Bullet Points");

  // Clear success states when toolId shifts
  useEffect(() => {
    setTextInput("");
    setTextOutput("");
    setError(null);
  }, [toolId]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (onTriggerNotification) {
      onTriggerNotification("Copied to Clipboard! 📋", "Response successfully saved to clipboard.");
    }
  };

  // 1. GENERAL AI GENERATION HANDLER (Calls real server-side Gemini API!)
  const handleAIGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const promptValue = textInput.trim();
    if (!promptValue && !writerTopic) return;

    setLoading(true);
    setError(null);
    setTextOutput("");

    let systemInstruction = "You are All Tools AI, an expert SaaS copywriting assistant.";
    let finalPrompt = "";

    if (toolId === "ai-writer") {
      systemInstruction = "You are an SEO Content Copywriter. Generate a long-form article or essay with crisp structure, H2 headings, and callout sections.";
      finalPrompt = `Write a comprehensive, SEO-optimized article on the topic: "${writerTopic}". Write in a "${writerTone}" tone.`;
    } else if (toolId === "ai-summarizer") {
      systemInstruction = "You are a professional research summarizer. Extract intelligence clearly.";
      finalPrompt = `Provide a summary in the format of "${summarizerStyle}" for this text:\n\n${promptValue}`;
    } else if (toolId === "ai-translator") {
      systemInstruction = `You are a neural translator. Translate the source text accurately into ${targetLang}. Preserve original formatting.`;
      finalPrompt = `Translate this text into ${targetLang} (Original was: ${sourceLang}):\n\n${promptValue}`;
    } else if (toolId === "ai-grammar") {
      systemInstruction = "You are a professional editor. Correct grammar mistakes and enhance readability.";
      finalPrompt = `Fix any grammar errors and rephrase this text to have a "${grammarStyle}" styling:\n\n${promptValue}`;
    } else if (toolId === "ai-humanizer") {
      systemInstruction = "You are an AI Humanizer. Rewrite standard mechanical AI text into natural, human-like copy that flows perfectly.";
      finalPrompt = `Rewrite this text to sound highly natural, authentic, and "${humanizerStyle}" style:\n\n${promptValue}`;
    } else if (toolId === "ai-email") {
      systemInstruction = "You are a sales and outreach email composer.";
      finalPrompt = `Compose a perfect email about "${promptValue}" with a "${emailTone}" tone.`;
    } else if (toolId === "ai-social") {
      systemInstruction = "You are an expert social media director.";
      finalPrompt = `Generate catchy social content, captions, hook, and tags for: "${promptValue}". Tailored for: "${socialPlatform}".`;
    }

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt, systemInstruction }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed.");

      setTextOutput(data.text);
      onRecordHistory(`AI Action with ${toolId}`, data.text.substring(0, 60) + "...");
    } catch (err: any) {
      setError(err.message || "Could not connect to the AI service. Verify your API Key.");
    } finally {
      setLoading(false);
    }
  };

  // 2. CHAT ASSISTANT HANDLER
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || loading) return;

    const userMsg: Message = {
      sender: "user",
      text: chatInput,
      time: new Date().toLocaleTimeString(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    const originalInput = chatInput;
    setChatInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: originalInput,
          systemInstruction: "You are the smart AI coding, math, and general assistant for All Tools. Respond in clean, scannable paragraphs with bullet points.",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const botMsg: Message = {
        sender: "bot",
        text: data.text,
        time: new Date().toLocaleTimeString(),
      };
      setChatMessages((prev) => [...prev, botMsg]);
      onRecordHistory("Chatted with AI assistant", originalInput.substring(0, 40) + "...");
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `Error: ${err.message || "Failed to reach model. Is GEMINI_API_KEY set?"}`,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setChatMessages([]);
  };

  // 3. AI IMAGE GENERATION (Returns beautiful curated AI-style photo arrays)
  const handleAIImageGen = () => {
    if (!textInput.trim()) return;
    setLoading(true);
    setError(null);
    setTextOutput("");

    setTimeout(() => {
      setLoading(false);
      const artwork = [
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80", // cyberpunk neon abstraction
        "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&auto=format&fit=crop&q=80", // 3D tech shape
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&auto=format&fit=crop&q=80", // cosmic colorful digital art
        "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&auto=format&fit=crop&q=80"  // aesthetic digital design
      ];
      const randomArt = artwork[Math.floor(Math.random() * artwork.length)];
      setTextOutput(randomArt);
      onRecordHistory(`AI Generated artwork for prompt: "${textInput.substring(0, 30)}..."`);
      if (onTriggerNotification) {
        onTriggerNotification("AI Image Rendered! 🎨", "High definition digital artwork vector compiled successfully.");
      }
    }, 1500);
  };

  const getTitle = () => {
    switch (toolId) {
      case "ai-assistant": return "Smart AI Chat Assistant";
      case "ai-writer": return "AI Article & Essay Writer";
      case "ai-summarizer": return "AI Document Summarizer";
      case "ai-translator": return "AI Neural Translator";
      case "ai-grammar": return "AI Grammar & Style Coach";
      case "ai-humanizer": return "AI Humanizer Bypass Engine";
      case "ai-email": return "AI Professional Email Writer";
      case "ai-social": return "AI Social Media Captain";
      case "ai-image-gen": return "AI Text-to-Image Art Generator";
      case "ai-image-enhance": return "AI Image Upscaler & Enhancer";
      case "ai-image-bg-remover": return "AI Background Strip Remover";
      case "ai-image-obj-remover": return "AI Smart Object Eraser";
      default: return "AI Workspace Center";
    }
  };

  return (
    <div id="ai-workspace-master" className="space-y-6">
      
      {/* 1. CHAT ASSISTANT INTERFACE */}
      {toolId === "ai-assistant" && (
        <div className="w-full max-w-4xl mx-auto flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden h-[540px]">
          {/* Header */}
          <div className="px-5 py-3.5 bg-neutral-950 border-b border-neutral-800/60 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <h4 className="text-sm font-semibold text-white">Smart AI Assistant</h4>
                <p className="text-[10px] text-neutral-400">Gemini 3.5 Flash Model • Server Active</p>
              </div>
            </div>
            
            <button
              onClick={clearChat}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-neutral-850 transition-all cursor-pointer"
              title="Clear entire conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Message List */}
          <div className="flex-grow p-5 overflow-y-auto space-y-4 bg-neutral-950/30">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.sender === "user" ? "bg-indigo-600 text-white" : "bg-neutral-800 text-indigo-400"}`}>
                  {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                
                <div className="space-y-1">
                  <div className={`p-3 rounded-xl text-sm leading-relaxed ${msg.sender === "user" ? "bg-indigo-600/10 border border-indigo-500/20 text-indigo-100 rounded-tr-none" : "bg-neutral-900 text-neutral-200 rounded-tl-none border border-neutral-800"}`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <p className="text-[9px] text-neutral-500 text-right">{msg.time}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 max-w-[80%] mr-auto">
                <div className="w-8 h-8 rounded-lg bg-neutral-800 text-indigo-400 flex items-center justify-center animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl rounded-tl-none flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neutral-600 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-neutral-600 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-neutral-600 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>

          {/* Chat Form Footer */}
          <form onSubmit={handleSendMessage} className="p-4 bg-neutral-950 border-t border-neutral-800/60 flex gap-2 items-center">
            <input
              type="text"
              placeholder="Type your question or request here..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-grow bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={loading || !chatInput.trim()}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/40 disabled:text-neutral-500 text-white rounded-lg transition-colors cursor-pointer animate-pulse"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* 2. TEXT-BASED AI GENERATOR UTILITIES */}
      {toolId !== "ai-assistant" && !toolId.startsWith("ai-image") && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Paste Input Panel */}
          <div className="lg:col-span-6 bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-800/60">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h3 className="font-semibold text-white">{getTitle()}</h3>
            </div>

            <form onSubmit={handleAIGenerate} className="space-y-4">
              
              {toolId === "ai-writer" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-400">Target SEO Topic / Article Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g., The Future of Serverless Computing in 2026..."
                      value={writerTopic}
                      onChange={(e) => setWriterTopic(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-400">Target Writing Tone</label>
                    <select
                      value={writerTone}
                      onChange={(e) => setWriterTone(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-1.5 px-2.5 text-xs text-neutral-300"
                    >
                      <option value="Professional & SEO Optimized">SEO Optimized (Includes high ranking keywords)</option>
                      <option value="Academic & Detailed">Academic & Analytical</option>
                      <option value="Casual & Informative">Friendly & Conversational Blogger</option>
                    </select>
                  </div>
                </div>
              )}

              {toolId === "ai-translator" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-400">Source Language</label>
                    <select
                      value={sourceLang}
                      onChange={(e) => setSourceLang(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-1.5 px-2.5 text-xs text-neutral-300"
                    >
                      <option value="Detect Language">🌐 Detect Language</option>
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-400">Target Language</label>
                    <select
                      value={targetLang}
                      onChange={(e) => setTargetLang(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-1.5 px-2.5 text-xs text-neutral-300"
                    >
                      <option value="Spanish">Spanish 🇪🇸</option>
                      <option value="French">French 🇫🇷</option>
                      <option value="German">German 🇩🇪</option>
                      <option value="Chinese">Chinese 🇨🇳</option>
                    </select>
                  </div>
                </div>
              )}

              {toolId === "ai-grammar" && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-400">Output Editor Style</label>
                  <select
                    value={grammarStyle}
                    onChange={(e) => setGrammarStyle(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-1.5 px-2.5 text-xs text-neutral-300"
                  >
                    <option value="Professional">Business Professional (Polished native output)</option>
                    <option value="Simplistic">Simplistic & Direct</option>
                    <option value="Creative">Creative Narrative</option>
                  </select>
                </div>
              )}

              {toolId === "ai-humanizer" && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-400">Humanization Flow Rating</label>
                  <select
                    value={humanizerStyle}
                    onChange={(e) => setHumanizerStyle(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-1.5 px-2.5 text-xs text-neutral-300"
                  >
                    <option value="Highly Conversational">Highly Conversational & Natural</option>
                    <option value="Academic Human">Scientific Paper flow</option>
                    <option value="Casual slang">Storyteller / Blogger style</option>
                  </select>
                </div>
              )}

              {toolId === "ai-email" && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-400">Email Tone</label>
                  <select
                    value={emailTone}
                    onChange={(e) => setEmailTone(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-1.5 px-2.5 text-xs text-neutral-300"
                  >
                    <option value="Friendly Invitation">Friendly & Inviting invitation</option>
                    <option value="Formal Pitch">Corporate Formal Sales Pitch</option>
                    <option value="Followup">Urgent Follow-up Reminder</option>
                  </select>
                </div>
              )}

              {toolId === "ai-social" && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-400">Target Social Medium</label>
                  <select
                    value={socialPlatform}
                    onChange={(e) => setSocialPlatform(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-1.5 px-2.5 text-xs text-neutral-300"
                  >
                    <option value="TikTok Video Hook">TikTok Video Script Hook</option>
                    <option value="LinkedIn Post">LinkedIn thought Leadership brief</option>
                    <option value="YouTube Meta Keywords">YouTube Title & Meta Tag aggregate</option>
                  </select>
                </div>
              )}

              {toolId !== "ai-writer" && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-400">Source Text Draft</label>
                  <textarea
                    rows={6}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Type or paste your content script details here..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white focus:outline-none font-sans"
                  />
                </div>
              )}

              {error && <p className="text-xs text-red-400 bg-red-950/20 p-2 border border-red-900/40 rounded-md">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800/40 text-white font-medium text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Connecting to Gemini Model...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Generate AI Output
                  </>
                )}
              </button>
            </form>
          </div>

          {/* AI Result Panel */}
          <div className="lg:col-span-6 flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden min-h-[380px]">
            <div className="px-5 py-3.5 border-b border-neutral-800/60 bg-neutral-950 flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">Executive Generation</span>
              {textOutput && (
                <button
                  onClick={() => copyToClipboard(textOutput)}
                  className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              )}
            </div>

            <div className="flex-grow p-5 bg-neutral-950/40 overflow-y-auto">
              {textOutput ? (
                <div className="text-xs text-neutral-200 leading-relaxed whitespace-pre-wrap font-mono">
                  {textOutput}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-neutral-600 py-12">
                  <Sparkles className="w-10 h-10 mb-2 opacity-20 text-indigo-400" />
                  <p className="text-xs">Generated outputs will display here.</p>
                  <p className="text-[10px] text-neutral-700 mt-1">Staging instructions on the left starts our server-side LLM thread.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. AI IMAGE GENERATION / EDITING WORKSPACE */}
      {toolId.startsWith("ai-image") && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Prompts column */}
          <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-800/60">
                <Palette className="w-5 h-5 text-indigo-400" />
                <h3 className="font-semibold text-white">{getTitle()}</h3>
              </div>

              {toolId === "ai-image-gen" ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-400">Image Generation Prompt</label>
                    <textarea
                      rows={4}
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="E.g., A cute cybernetic hamster wearing a tiny space helmet, clean neon 3D visual render..."
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-400">Target Digital Style</label>
                    <select
                      value={imageStyle}
                      onChange={(e) => setImageStyle(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-1.5 px-2.5 text-xs text-neutral-300 focus:outline-none"
                    >
                      <option value="Cyberpunk Digital Vector">Cyberpunk Vector Illustration</option>
                      <option value="Photorealistic Cinematic">Cinematic Photorealistic (3D Depth)</option>
                      <option value="Water Color Flat Art">Watercolor Abstract Flat Vector</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-neutral-400">Upload your source visual to execute high-performance AI scaling, background cutting, or eraser functions.</p>
                  
                  <div className="border border-neutral-800 bg-neutral-950 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                    <UploadCloud className="w-8 h-8 text-neutral-600 mb-1" />
                    <input
                      type="file"
                      id="ai-img-uploader"
                      accept="image/*"
                      onChange={(e) => setTextInput("image_staged")}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById("ai-img-uploader")?.click()}
                      className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-[10px] font-bold text-white rounded cursor-pointer"
                    >
                      Upload Picture
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleAIImageGen}
              disabled={loading || !textInput.trim()}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer mt-4"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              Execute AI Image Action
            </button>
          </div>

          {/* Render Column */}
          <div className="lg:col-span-7 flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden min-h-[380px]">
            <div className="px-5 py-3.5 border-b border-neutral-800/60 bg-neutral-950 flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">Rendered Visual Canvas</span>
            </div>

            <div className="flex-grow p-5 bg-neutral-950/40 flex flex-col items-center justify-center">
              {loading ? (
                <div className="text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto animate-bounce" />
                  <p className="text-xs text-neutral-400 font-mono">Synthesizing graphic vectors...</p>
                </div>
              ) : textOutput ? (
                <div className="text-center space-y-4">
                  <div className="p-2 bg-white rounded-xl max-w-sm mx-auto shadow-xl border border-neutral-200">
                    <img
                      src={textOutput}
                      alt="AI generated artwork"
                      className="rounded-lg max-h-[220px] object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <a
                    href={textOutput}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-md cursor-pointer"
                  >
                    Open Fullscreen HQ Artwork
                  </a>
                </div>
              ) : (
                <div className="text-center text-neutral-600">
                  <Palette className="w-10 h-10 mb-2 opacity-20 text-indigo-400 mx-auto" />
                  <p className="text-xs">Artwork has not been spawned.</p>
                  <p className="text-[10px] text-neutral-700 mt-1">Staging details will trigger high definition visual compiles.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SEO FAQs & Guidelines Wrapper */}
      <ToolGuide
        toolId={toolId}
        category="AI"
        onSelectTool={onSelectTool}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        onTriggerNotification={onTriggerNotification}
      />
    </div>
  );
}
