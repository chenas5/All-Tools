import React, { useState } from "react";
import { X, Mail, Lock, User, Github, Chrome, ShieldCheck, KeyRound } from "lucide-react";
import { UserProfile } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [is2FA, setIs2FA] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const mockSuccessfulUser = (customEmail: string, customName: string, customUsername: string): UserProfile => ({
    id: "user_" + Math.random().toString(36).substring(2, 9),
    name: customName || "All Tools Member",
    username: customUsername || "alltools_member",
    email: customEmail || "user@example.com",
    avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(customUsername || "alltools")}`,
    bio: "Hi there! I am a proud member of the All Tools platform.",
    country: "United States",
    language: "English (US)",
    timezone: "America/Los_Angeles",
    subscription: "Free",
    creditsRemaining: 10,
    apiKeys: ["cw_live_8f3a...b72e"],
    referralCode: "WAVE_" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    referralsCount: 0,
    joinedDate: new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })
  });

  const handleTraditionalAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email || !password) {
      setError("Please fill in all credentials.");
      return;
    }

    // Direct platform owner verification
    if (email.toLowerCase() === "chenwave9@gmail.com") {
      if (password === "Kasepp12") {
        const ownerUser: UserProfile = {
          id: "owner_chenwave9",
          name: "Chenwave Owner",
          username: "chenwave9",
          email: "chenwave9@gmail.com",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
          joinedDate: "07/11/2026",
          creditsRemaining: 999999,
          referralsCount: 142,
          referralCode: "WAVE_99P",
          apiKeys: ["at_live_owner_8f3a2bd3"],
          subscription: "Pro",
          bio: "Primary Platform Owner. Managing the All Tools platform workspace and security infrastructure.",
          country: "United States",
          timezone: "EST (UTC-5)",
          language: "English",
          role: "Super Admin"
        };
        onLoginSuccess(ownerUser);
        onClose();
        return;
      } else {
        setError("Incorrect password for the primary platform owner account.");
        return;
      }
    }

    if (isForgotPassword) {
      setMessage("A password recovery code has been dispatched to " + email);
      return;
    }

    if (isSignUp && (!name || !username)) {
      setError("Please fill in your name and choose a unique username.");
      return;
    }

    // Trigger 2FA step to make it highly authentic!
    if (!is2FA) {
      setIs2FA(true);
      setMessage("Authentication credentials accepted. Please input the 2FA token sent to your device.");
      return;
    }

    if (is2FA && twoFactorCode !== "123456" && twoFactorCode.length > 0) {
      // Allow any or 123456
    }

    // Successful login!
    const loggedUser = mockSuccessfulUser(email, name || "Wave Explorer", username || email.split("@")[0]);
    onLoginSuccess(loggedUser);
    onClose();
  };

  const handleSocialLogin = (platform: "Google" | "GitHub") => {
    setError("");
    setMessage("");
    const socialUser = mockSuccessfulUser(
      platform === "Google" ? "google.user@gmail.com" : "github.developer@github.com",
      platform === "Google" ? "Google User" : "GitHub Developer",
      platform === "Google" ? "google_coder" : "git_wizard"
    );
    // Directly log in
    onLoginSuccess(socialUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        id="auth-modal"
        className="w-full max-w-md overflow-hidden bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl transition-all"
      >
        {/* Header */}
        <div className="relative px-6 py-5 border-b border-neutral-800 bg-neutral-900/50 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white font-sans">
              {isForgotPassword ? "Reset Password" : is2FA ? "Two-Factor Authentication" : isSignUp ? "Create Free Account" : "Welcome Back"}
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              {isForgotPassword 
                ? "Retrieve access to your utility vault." 
                : is2FA 
                ? "Enter security token to authenticate session." 
                : isSignUp 
                ? "Get 10 daily AI credits and saved workspaces." 
                : "Sign in to access your All Tools."}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleTraditionalAuth} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-red-950/40 border border-red-900/60 text-red-300 rounded-lg">
              {error}
            </div>
          )}
          {message && (
            <div className="p-3 text-xs bg-emerald-950/40 border border-emerald-900/60 text-emerald-300 rounded-lg">
              {message}
            </div>
          )}

          {/* 2FA Form Mode */}
          {is2FA ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  Verification Pin Code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="E.g. 123456 (or any code)"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <p className="text-[10px] text-neutral-500 mt-1">
                  We've simulated sending a verification pin code. Enter any 6-digit number to bypass.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                Verify & Log In
              </button>

              <button
                type="button"
                onClick={() => {
                  setIs2FA(false);
                  setMessage("");
                }}
                className="w-full text-center text-xs text-neutral-400 hover:text-white underline"
              >
                Back to credentials
              </button>
            </div>
          ) : (
            <>
              {/* Traditional Credentials Form Mode */}
              {!isForgotPassword && isSignUp && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-300">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2 pl-9 pr-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-300">Username</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-sm text-neutral-500 font-medium">@</span>
                      <input
                        type="text"
                        placeholder="coder12"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2 pl-7 pr-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              {!isForgotPassword && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-medium text-neutral-300">Password</label>
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm py-2.5 rounded-lg transition-colors cursor-pointer mt-2 shadow-lg shadow-indigo-950/20"
              >
                {isForgotPassword ? "Send Password Recovery Link" : isSignUp ? "Generate Free Account" : "Access Platform"}
              </button>

              {/* Social Logins */}
              {!isForgotPassword && (
                <div className="space-y-3 pt-3 border-t border-neutral-800/60">
                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-neutral-800/40"></div>
                    <span className="flex-shrink mx-3 text-[10px] text-neutral-500 uppercase tracking-wider font-mono">Or connect with</span>
                    <div className="flex-grow border-t border-neutral-800/40"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleSocialLogin("Google")}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-neutral-300 bg-neutral-950 border border-neutral-800 rounded-lg hover:bg-neutral-800 hover:text-white transition-all cursor-pointer"
                    >
                      <Chrome className="w-3.5 h-3.5 text-red-500" />
                      Google
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSocialLogin("GitHub")}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-neutral-300 bg-neutral-950 border border-neutral-800 rounded-lg hover:bg-neutral-800 hover:text-white transition-all cursor-pointer"
                    >
                      <Github className="w-3.5 h-3.5 text-white" />
                      GitHub
                    </button>
                  </div>
                </div>
              )}

              {/* Toggle Account Mode */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setIsForgotPassword(false);
                    setError("");
                    setMessage("");
                  }}
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  {isForgotPassword 
                    ? "Go back to Login" 
                    : isSignUp 
                    ? "Already have an account? Sign in" 
                    : "New to All Tools? Create a free account"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
