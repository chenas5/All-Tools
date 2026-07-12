import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import Dashboard from "./components/Dashboard";
import ToolAI from "./components/ToolAI";
import ToolPDF from "./components/ToolPDF";
import ToolImage from "./components/ToolImage";
import ToolDeveloper from "./components/ToolDeveloper";
import ToolTempMail from "./components/ToolTempMail";
import ToolURL from "./components/ToolURL";
import ToolCalculator from "./components/ToolCalculator";
import ToolQR from "./components/ToolQR";
import ToolVideo from "./components/ToolVideo";
import ToolAudio from "./components/ToolAudio";
import ToolFile from "./components/ToolFile";
import ToolText from "./components/ToolText";
import AdminPanel from "./components/AdminPanel";

import { UserProfile, ToolDefinition, FavoriteItem, ActionHistory, PaymentTransaction, SupportTicket, AdminSaaSSettings, PromoCode } from "./types";
import { ALL_TOOLS } from "./data";
import { Star, Home, ArrowLeft, Heart, ShieldCheck, HelpCircle } from "lucide-react";

export default function App() {
  const [user, setUser] = useState<UserProfile | null>({
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
    country: "Indonesia",
    timezone: "WIB (UTC+7)",
    language: "Bahasa Indonesia",
    role: "Super Admin"
  });

  const [transactions, setTransactions] = useState<PaymentTransaction[]>([
    {
      id: "TX-1001",
      username: "alice_v",
      email: "alice@example.com",
      plan: "Pro (Monthly)",
      amount: 29900,
      paymentMethod: "QRIS",
      date: "2026-07-10",
      proofImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=300",
      status: "Successful"
    },
    {
      id: "TX-1002",
      username: "bob_b",
      email: "bob_builder@example.com",
      plan: "Team",
      amount: 99000,
      paymentMethod: "BCA Bank Transfer",
      date: "2026-07-11",
      proofImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300",
      status: "Pending"
    }
  ]);

  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: "TCK-401",
      username: "bob_b",
      category: "Payment problem",
      subject: "BCA Bank Transfer Delay",
      message: "I transferred Rp99.000 via BCA. I uploaded the receipt but my account is still on the Free plan. Please verify manually.",
      screenshot: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300",
      priority: "High",
      status: "Open",
      createdAt: "2026-07-11 08:30 AM",
      replies: [
        {
          sender: "User",
          message: "Let me know if you need another angle of the transfer proof.",
          timestamp: "2026-07-11 08:32 AM"
        }
      ]
    },
    {
      id: "TCK-402",
      username: "alice_v",
      category: "Bug report",
      subject: "PDF Merger output blank pages",
      message: "When merging two scanned assets, the final sheet output comes out blank.",
      priority: "Medium",
      status: "Closed",
      createdAt: "2026-07-09 02:15 PM",
      replies: [
        {
          sender: "Admin",
          message: "We have updated the ghostscript compilation module on our worker nodes. This is now fully resolved.",
          timestamp: "2026-07-10 09:10 AM"
        }
      ]
    }
  ]);

  const [saasSettings, setSaasSettings] = useState<AdminSaaSSettings>({
    bankName: "BCA",
    bankAccountName: "ChenWave Official",
    bankAccountNumber: "8045129930",
    bankInstructions: "1. Open your Mobile Banking or visit an ATM.\n2. Select Transfer -> Transfer to Other Bank Account.\n3. Enter Bank Code for BCA (014) followed by the account number.\n4. Ensure the recipient name is ChenWave Official.\n5. Keep the screenshot or physical receipt to upload.",
    bankActive: true,

    danaName: "Chenwave Official DANA",
    danaPhone: "081234567890",
    danaActive: true,

    gopayName: "Chenwave GoPay Store",
    gopayPhone: "081234567890",
    gopayActive: true,

    ovoName: "OVO Business ChenWave",
    ovoPhone: "081234567890",
    ovoActive: true,

    shopeepayName: "ShopeePay ChenWave Store",
    shopeepayPhone: "081234567890",
    shopeepayActive: true,

    qrisImage: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=gpn-qris-chenwave-id-998234",
    qrisInstructions: "1. Save or screenshot the QRIS QR Code above.\n2. Open your e-wallet (DANA, GoPay, OVO, ShopeePay, LinkAja) or your Mobile Banking app.\n3. Choose 'Scan' or 'QR Pay'.\n4. Select the image from your gallery or scan directly.\n5. Input the exact billing amount, confirm payment, and download receipt.",
    qrisActive: true,

    telegramUsername: "ChenwavePRO72",
    supportEmail: "support@alltools.com",
    supportHours: "08:00 - 22:00 WIB (Daily)",
    autoReplyMessage: "Thank you for contacting ChenWave Support. We have logged your query and will reply within 30 minutes during our service hours."
  });

  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([
    { code: "CHENWAVE99", discountPercent: 99, maxClaims: 100, activeClaims: 42, planUnlock: "Pro", status: "Active" },
    { code: "LAUNCHPRO", discountPercent: 50, maxClaims: 500, activeClaims: 218, planUnlock: "Pro", status: "Active" },
    { code: "TEAMPOWER", discountPercent: 30, maxClaims: 50, activeClaims: 49, planUnlock: "Team", status: "Active" },
    { code: "FREEPASS", discountPercent: 100, maxClaims: 10, activeClaims: 10, planUnlock: "Enterprise", status: "Expired" }
  ]);

  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Favorites collection
  const [favorites, setFavorites] = useState<FavoriteItem[]>([
    { id: "fav-1", toolId: "ai-writer" },
    { id: "fav-2", toolId: "temp-mail" }
  ]);

  // History action log
  const [history, setHistory] = useState<ActionHistory[]>([
    {
      id: "h-1",
      toolId: "ai-writer",
      toolName: "AI Writer",
      actionSummary: "Generated draft blog about SEO optimizations using Gemini API",
      timestamp: "07/11/2026, 11:20 AM"
    },
    {
      id: "h-2",
      toolId: "image-resizer",
      toolName: "Image Resizer",
      actionSummary: "Resized marketing banner PNG to 800x600 pixels",
      timestamp: "07/11/2026, 09:45 AM"
    }
  ]);

  // Notifications Queue
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; desc: string; read: boolean }>>([
    {
      id: "notif-1",
      title: "Welcome to All Tools!",
      desc: "Get started by testing our offline image processors, base64 tools, or launch the Gemini AI copywriter.",
      read: false
    },
    {
      id: "notif-2",
      title: "Pro Subscription Active",
      desc: "Thank you for supporting All Tools! Bulk exports and fast API execution speeds are active.",
      read: true
    }
  ]);

  // Toggle dynamic class hooks for Dark/Light Mode on the main body
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Load initial MongoDB data states on app mount
  useEffect(() => {
    const fetchDatabaseState = async () => {
      try {
        const settingsRes = await fetch("/api/saas-settings");
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          if (settingsData) setSaasSettings(settingsData);
        }

        const txRes = await fetch("/api/transactions");
        if (txRes.ok) {
          const txData = await txRes.json();
          if (txData && txData.length > 0) setTransactions(txData);
        }

        const ticketRes = await fetch("/api/tickets");
        if (ticketRes.ok) {
          const ticketData = await ticketRes.json();
          if (ticketData && ticketData.length > 0) setTickets(ticketData);
        }

        const promoRes = await fetch("/api/promo-codes");
        if (promoRes.ok) {
          const promoData = await promoRes.json();
          if (promoData && promoData.length > 0) setPromoCodes(promoData);
        }
      } catch (err) {
        console.error("Failed to load initial database states:", err);
      }
    };
    fetchDatabaseState();
  }, []);

  const handleRecordHistory = (summary: string, excerpt?: string) => {
    const newRecord: ActionHistory = {
      id: "h_" + Math.random().toString(36).substring(2, 9),
      toolId: activeToolId || "general",
      toolName: activeToolId ? ALL_TOOLS.find(t => t.id === activeToolId)?.name || "General" : "Utility",
      actionSummary: summary + (excerpt ? ` (${excerpt})` : ""),
      timestamp: new Date().toLocaleString()
    };
    setHistory(prev => [newRecord, ...prev]);
  };

  const handleTriggerNotification = (title: string, desc: string) => {
    const newNotif = {
      id: "notif_" + Math.random().toString(36).substring(2, 9),
      title,
      desc,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleToggleFavorite = (toolId: string) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.toolId === toolId);
      if (exists) {
        return prev.filter(f => f.toolId !== toolId);
      } else {
        return [...prev, { id: "fav_" + Math.random().toString(36).substring(2, 9), toolId }];
      }
    });
  };

  const handleLoginSuccess = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    setIsAuthOpen(false);
    handleTriggerNotification("Authentication Successful", `Welcome to All Tools, ${loggedInUser.email}!`);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveToolId(null);
    handleTriggerNotification("Signed Out", "You have logged out of your SaaS workspace locker safely.");
  };

  const activeTool = ALL_TOOLS.find(t => t.id === activeToolId);

  // Determine current path breadcrumbs
  const getBreadcrumbs = () => {
    if (activeToolId === "user-dashboard") {
      return ["Home", "User Dashboard"];
    }
    if (activeToolId === "admin-panel") {
      return ["Home", "Admin Control Center"];
    }
    if (activeTool) {
      return ["Home", `${activeTool.category} Utilities`, activeTool.name];
    }
    return ["Home"];
  };

  return (
    <div id="saas-platform" className={`min-h-screen relative overflow-x-hidden transition-colors ${isDarkMode ? "bg-neutral-950 text-neutral-100" : "bg-neutral-50 text-neutral-900"}`}>
      
      {/* Decorative Glows for Sophisticated Dark mode */}
      {isDarkMode && (
        <>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none -z-10" />
          <div className="absolute top-1/3 left-[-100px] w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        </>
      )}

      {/* Global Navbar */}
      <Navbar
        user={user}
        onLogout={handleLogout}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenDashboard={() => setActiveToolId("user-dashboard")}
        onOpenAdmin={() => setActiveToolId("admin-panel")}
        globalSearch={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          if (val) {
            setActiveToolId(null); // Return to directory grid when searching
          }
        }}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        isDarkMode={isDarkMode}
        notifications={notifications}
        onMarkNotificationsRead={() => {
          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dynamic breadcrumb header & navigation buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-mono">
            {getBreadcrumbs().map((bc, i, arr) => (
              <React.Fragment key={bc}>
                <span className={i === arr.length - 1 ? "text-indigo-400 font-bold" : "hover:text-white cursor-pointer"} onClick={() => i === 0 ? setActiveToolId(null) : null}>
                  {bc}
                </span>
                {i < arr.length - 1 && <span>/</span>}
              </React.Fragment>
            ))}
          </div>

          {(activeToolId || searchQuery) && (
            <button
              onClick={() => {
                setActiveToolId(null);
                setSearchQuery("");
              }}
              className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer w-fit border border-neutral-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Homepage
            </button>
          )}
        </div>

        {/* Multi-column Grid workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: CATEGORIES & PINNED shortcuts */}
          <div className="lg:col-span-3 space-y-6">
            <Sidebar
              tools={ALL_TOOLS}
              activeToolId={activeToolId}
              onSelectTool={setActiveToolId}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {/* RIGHT COLUMN: WORKSPACE VIEWS OR DIRECTORY */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* WORKSPACE SWITCH ROUTING */}
            {activeToolId === "user-dashboard" && user ? (
              <Dashboard
                user={user}
                onUpdateUser={setUser}
                history={history}
                onClearHistory={() => setHistory([])}
                onDeleteHistoryItem={(id) => setHistory(prev => prev.filter(h => h.id !== id))}
                favorites={favorites}
                onTriggerNotification={handleTriggerNotification}
                transactions={transactions}
                onUpdateTransactions={setTransactions}
                tickets={tickets}
                onUpdateTickets={setTickets}
                saasSettings={saasSettings}
                promoCodes={promoCodes}
                onUpdatePromoCodes={setPromoCodes}
              />
            ) : activeToolId === "admin-panel" && user && user.role === "Super Admin" ? (
              <AdminPanel
                user={user}
                onUpdateUser={setUser}
                onTriggerNotification={handleTriggerNotification}
                onSelectTool={setActiveToolId}
                transactions={transactions}
                onUpdateTransactions={setTransactions}
                tickets={tickets}
                onUpdateTickets={setTickets}
                saasSettings={saasSettings}
                onUpdateSaasSettings={setSaasSettings}
                promoCodes={promoCodes}
                onUpdatePromoCodes={setPromoCodes}
              />
            ) : activeToolId && (activeToolId === "ai-assistant" || activeToolId.startsWith("ai-")) ? (
              <ToolAI
                toolId={activeToolId}
                onRecordHistory={handleRecordHistory}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onTriggerNotification={handleTriggerNotification}
                onSelectTool={setActiveToolId}
              />
            ) : activeToolId && (activeToolId.startsWith("pdf-") || activeToolId.endsWith("-to-pdf")) ? (
              <ToolPDF
                toolId={activeToolId}
                onRecordHistory={handleRecordHistory}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onTriggerNotification={handleTriggerNotification}
                onSelectTool={setActiveToolId}
              />
            ) : activeToolId && (activeToolId.startsWith("image-") && !activeToolId.startsWith("image-to-pdf")) ? (
              <ToolImage
                toolId={activeToolId}
                onRecordHistory={handleRecordHistory}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onTriggerNotification={handleTriggerNotification}
                onSelectTool={setActiveToolId}
              />
            ) : activeToolId && activeToolId.startsWith("video-") ? (
              <ToolVideo
                toolId={activeToolId}
                onRecordHistory={handleRecordHistory}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onTriggerNotification={handleTriggerNotification}
                onSelectTool={setActiveToolId}
              />
            ) : activeToolId && activeToolId.startsWith("audio-") ? (
              <ToolAudio
                toolId={activeToolId}
                onRecordHistory={handleRecordHistory}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onTriggerNotification={handleTriggerNotification}
                onSelectTool={setActiveToolId}
              />
            ) : activeToolId && activeToolId.startsWith("qr-") ? (
              <ToolQR
                toolId={activeToolId}
                onRecordHistory={handleRecordHistory}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onTriggerNotification={handleTriggerNotification}
                onSelectTool={setActiveToolId}
              />
            ) : activeToolId && activeToolId.startsWith("file-") ? (
              <ToolFile
                toolId={activeToolId}
                onRecordHistory={handleRecordHistory}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onTriggerNotification={handleTriggerNotification}
                onSelectTool={setActiveToolId}
              />
            ) : activeToolId && activeToolId.startsWith("text-") ? (
              <ToolText
                toolId={activeToolId}
                onRecordHistory={handleRecordHistory}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onTriggerNotification={handleTriggerNotification}
                onSelectTool={setActiveToolId}
              />
            ) : activeToolId && (activeToolId === "json-formatter" || activeToolId === "base64-converter" || activeToolId === "hash-generator" || activeToolId === "xml-to-json" || activeToolId === "yaml-to-json" || activeToolId === "markdown-editor" || activeToolId === "url-encoder" || activeToolId === "regex-tester" || activeToolId === "jwt-decoder") ? (
              <ToolDeveloper
                toolId={activeToolId}
                onRecordHistory={handleRecordHistory}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onTriggerNotification={handleTriggerNotification}
                onSelectTool={setActiveToolId}
              />
            ) : activeToolId === "temp-mail" ? (
              <ToolTempMail
                onRecordHistory={handleRecordHistory}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onTriggerNotification={handleTriggerNotification}
                onSelectTool={setActiveToolId}
              />
            ) : activeToolId && (activeToolId === "url-shortener" || activeToolId === "url-analytics") ? (
              <ToolURL
                toolId={activeToolId}
                onRecordHistory={handleRecordHistory}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onTriggerNotification={handleTriggerNotification}
                onSelectTool={setActiveToolId}
              />
            ) : activeToolId && activeToolId.startsWith("calculator-") ? (
              <ToolCalculator
                toolId={activeToolId}
                onRecordHistory={handleRecordHistory}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onTriggerNotification={handleTriggerNotification}
                onSelectTool={setActiveToolId}
              />
            ) : (
              /* DEFAULT HOMEPAGE */
              <Hero
                user={user}
                tools={ALL_TOOLS}
                activeToolId={activeToolId}
                onSelectTool={setActiveToolId}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onTriggerNotification={handleTriggerNotification}
                onOpenAuth={() => setIsAuthOpen(true)}
              />
            )}
          </div>
        </div>
      </main>

      {/* Global Footers */}
      <Footer />

      {/* Auth Modal Drawer */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
