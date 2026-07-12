import React, { useState, useEffect } from "react";
import { Mail, Copy, Check, RefreshCw, Eye, Sparkles, Inbox, Send, ChevronRight, ArrowLeft } from "lucide-react";
import { TempMailMessage } from "../types";

interface ToolTempMailProps {
  onRecordHistory: (summary: string, excerpt?: string) => void;
  favorites?: any[];
  onToggleFavorite?: (id: string) => void;
  onTriggerNotification?: (title: string, desc: string) => void;
  onSelectTool?: (id: string | null) => void;
}

export default function ToolTempMail({
  onRecordHistory,
  favorites = [],
  onToggleFavorite,
  onTriggerNotification,
  onSelectTool,
}: ToolTempMailProps) {
  const [email, setEmail] = useState("");
  const [messages, setMessages] = useState<TempMailMessage[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<TempMailMessage | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);

  const generateNewMailbox = async () => {
    setLoading(true);
    setSelectedMsg(null);
    try {
      const res = await fetch("/api/temp-mail/generate", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.email) {
        setEmail(data.email);
        setMessages([
          {
            id: "welcome-email",
            from: "system@alltools.com",
            subject: "Welcome to All Tools Temp Mail!",
            body: "Hello! Thank you for choosing All Tools Temp Mail. Your temporary mailbox is now active and ready to receive incoming emails. Feel free to copy this address and use it for signups, newsletter testing, and privacy protection. Try pressing the 'Receive Test Email' button to instantly test email delivery to this address!",
            timestamp: new Date().toLocaleTimeString(),
          }
        ]);
        onRecordHistory(`Created new temporary email account "${data.email}"`);
      }
    } catch (err) {
      console.error("Failed to generate temp email:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshInbox = async () => {
    if (!email) return;
    setPolling(true);
    try {
      const res = await fetch(`/api/temp-mail/inbox?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (res.ok && data.inbox) {
        setMessages(data.inbox);
      }
    } catch (err) {
      console.error("Inbox refresh error:", err);
    } finally {
      setTimeout(() => setPolling(false), 500);
    }
  };

  const receiveTestEmail = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/temp-mail/trigger-mock-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Refresh inbox list directly
        await refreshInbox();
        onRecordHistory(`Received test security/alert email from ${data.email.from}`, data.email.subject);
      }
    } catch (err) {
      console.error("Failed to trigger test email:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateNewMailbox();
  }, []);

  // Poll inbox every 6 seconds to keep it live!
  useEffect(() => {
    if (!email) return;
    const interval = setInterval(() => {
      refreshInbox();
    }, 6000);
    return () => clearInterval(interval);
  }, [email]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div id="temp-mail-workspace" className="space-y-6">
      {/* Mail Address Bar Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left w-full md:w-auto">
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider font-mono">Your Temporary Address</span>
          <div className="flex items-center justify-center md:justify-start gap-2.5">
            {loading ? (
              <div className="h-6 w-56 bg-neutral-950 rounded animate-pulse shrink-0" />
            ) : (
              <span className="text-lg md:text-xl font-bold font-mono text-white tracking-tight break-all">
                {email || "generating..."}
              </span>
            )}
            <button
              onClick={handleCopyEmail}
              disabled={!email}
              className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-850 text-neutral-400 hover:text-white hover:border-neutral-700 transition-all shrink-0 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={receiveTestEmail}
            disabled={!email || loading}
            className="flex-1 md:flex-none py-2 px-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/30 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Receive Test Email
          </button>

          <button
            onClick={generateNewMailbox}
            disabled={loading}
            className="flex-1 md:flex-none py-2 px-3.5 bg-neutral-950 border border-neutral-800 hover:bg-neutral-850 text-neutral-300 font-medium text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            New Email Account
          </button>
        </div>
      </div>

      {/* Grid: Inbox List vs Reading Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[440px]">
        {/* Inbox List (Always visible, responsive size) */}
        <div className={`bg-neutral-900 border border-neutral-800 rounded-xl flex flex-col overflow-hidden ${selectedMsg ? "hidden lg:flex lg:col-span-5" : "lg:col-span-12 flex"}`}>
          <div className="px-5 py-3.5 bg-neutral-950 border-b border-neutral-850/60 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Incoming Inbox Queue</h4>
            </div>
            
            <button
              onClick={refreshInbox}
              className="p-1 text-neutral-500 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${polling ? "animate-spin" : ""}`} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-neutral-850/50 bg-neutral-950/20">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMsg(msg)}
                  className={`p-4 hover:bg-neutral-950/80 transition-colors cursor-pointer flex justify-between items-start gap-3 ${selectedMsg?.id === msg.id ? "bg-neutral-950/80 border-l-2 border-indigo-500" : ""}`}
                >
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-indigo-400 font-mono truncate max-w-[120px]">{msg.from}</span>
                      <span className="text-[9px] text-neutral-500 font-mono">{msg.timestamp}</span>
                    </div>
                    <p className="text-xs font-semibold text-white truncate">{msg.subject}</p>
                    <p className="text-[11px] text-neutral-400 truncate leading-relaxed">{msg.body}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-600 shrink-0 self-center" />
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-neutral-600 py-16">
                <Mail className="w-10 h-10 mb-2 opacity-20 text-indigo-400 animate-bounce" />
                <p className="text-xs">Mailbox is listening live...</p>
                <p className="text-[10px] text-neutral-700 mt-1">Send an email to {email || "your address"} or click 'Receive Test Email'.</p>
              </div>
            )}
          </div>
        </div>

        {/* Selected Message Reading Panel */}
        {selectedMsg && (
          <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-xl flex flex-col overflow-hidden h-full">
            {/* Action Bar */}
            <div className="px-5 py-3.5 bg-neutral-950 border-b border-neutral-850/60 flex justify-between items-center shrink-0">
              <button
                onClick={() => setSelectedMsg(null)}
                className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Inbox
              </button>
              
              <span className="text-[9px] font-mono text-neutral-500">{selectedMsg.timestamp}</span>
            </div>

            {/* Email Header */}
            <div className="p-5 border-b border-neutral-850/60 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider font-mono">Sender Details</span>
                  <p className="text-xs font-mono text-white">{selectedMsg.from}</p>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider font-mono">Subject</span>
                <h3 className="text-sm font-bold text-neutral-100">{selectedMsg.subject}</h3>
              </div>
            </div>

            {/* Email Body */}
            <div className="flex-1 p-5 overflow-y-auto bg-neutral-950/30 text-xs md:text-sm text-neutral-300 whitespace-pre-wrap leading-relaxed font-sans">
              {selectedMsg.body}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
