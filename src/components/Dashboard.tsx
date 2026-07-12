import React, { useState } from "react";
import { 
  CreditCard, Key, History, Users, Settings, FileBox, ShieldAlert,
  FolderOpen, Plus, Trash2, Shield, Eye, Copy, Check, Search, Download, 
  Map, Globe, Volume2, Save, BadgeCheck, Bell, UserPlus, UploadCloud,
  LifeBuoy, Send, AlertCircle, Calendar, DollarSign, CheckCircle2, XCircle,
  FileImage, MessageSquare, Clock, ExternalLink, HelpCircle, ChevronDown, ChevronUp, Tag
} from "lucide-react";
import { UserProfile, CloudFile, ActionHistory, FavoriteItem, PaymentTransaction, SupportTicket, AdminSaaSSettings, PromoCode } from "../types";

interface DashboardProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  history: ActionHistory[];
  onClearHistory: () => void;
  onDeleteHistoryItem: (id: string) => void;
  favorites: FavoriteItem[];
  onTriggerNotification: (title: string, desc: string) => void;
  transactions: PaymentTransaction[];
  onUpdateTransactions: React.Dispatch<React.SetStateAction<PaymentTransaction[]>>;
  tickets: SupportTicket[];
  onUpdateTickets: React.Dispatch<React.SetStateAction<SupportTicket[]>>;
  saasSettings: AdminSaaSSettings;
  promoCodes: PromoCode[];
  onUpdatePromoCodes: React.Dispatch<React.SetStateAction<PromoCode[]>>;
}

const FAQ_ITEMS = [
  {
    id: "faq-1",
    category: "Account",
    q: "How do I upgrade or reset my API keys?",
    a: "Navigate to your 'Workspace API Keys' tab in your user dashboard, copy your token or click '+ Create Secret Token' to generate a brand new developer access credentials node."
  },
  {
    id: "faq-2",
    category: "Payment",
    q: "What payment methods are supported?",
    a: "For Indonesia, we support QRIS, Bank Transfer (BCA), Virtual Account, and e-wallets (DANA, GoPay, OVO, ShopeePay). Internationally, we accept Credit Cards, PayPal, and Stripe."
  },
  {
    id: "faq-3",
    category: "Payment",
    q: "How long does manual payment verification take?",
    a: "Our standard manual verification takes about 5 to 15 minutes during our active support hours (08:00 - 22:00 WIB). Once our admin team approves your receipt, your premium plan activates instantly."
  },
  {
    id: "faq-4",
    category: "Subscription",
    q: "Can I upgrade or downgrade my plan at any time?",
    a: "Absolutely! You can select any plan from the 'Billing & Subscription' tab. If you prefer to change your plan manually or seek enterprise packages, please open a support ticket."
  },
  {
    id: "faq-5",
    category: "Tools",
    q: "Are there daily execution limits on the Free plan?",
    a: "Yes, the Free plan includes ads and has restricted daily credits, temporary email limits, and standard speeds. Upgrading to a Pro plan removes watermarks, grants full tools access, and unlocks 10,000 AI credits."
  },
  {
    id: "faq-6",
    category: "Bug Report",
    q: "Where do I submit system exceptions or error traces?",
    a: "You can file a support ticket from the 'Help Center & Support' tab. Set priority to 'Urgent', describe the issue, attach an optional screenshot, and click Submit to alert our on-call developer."
  }
];

export default function Dashboard({ 
  user, 
  onUpdateUser, 
  history, 
  onClearHistory, 
  onDeleteHistoryItem,
  favorites,
  onTriggerNotification,
  transactions,
  onUpdateTransactions,
  tickets,
  onUpdateTickets,
  saasSettings,
  promoCodes,
  onUpdatePromoCodes
}: DashboardProps) {
  
  const [activeTab, setActiveTab] = useState<"workspace" | "files" | "history" | "keys" | "billing" | "support" | "settings" | "referrals">("workspace");
  const [copiedLink, setCopiedLink] = useState("");
  const [copiedKey, setCopiedKey] = useState(false);

  // Profile Form States
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [country, setCountry] = useState(user.country);
  const [timezone, setTimezone] = useState(user.timezone);
  const [language, setLanguage] = useState(user.language);

  // File states
  const [files, setFiles] = useState<CloudFile[]>([
    {
      id: "f1",
      name: "Quarterly_Tax_Summary.pdf",
      size: 4204500,
      type: "application/pdf",
      uploadedAt: "07/10/2026",
      folder: "Finance",
      shareLink: "https://alltools.com/s/tax_q3",
      passwordProtected: true,
    },
    {
      id: "f2",
      name: "Banner_Prototype_Final.png",
      size: 1250300,
      type: "image/png",
      uploadedAt: "07/09/2026",
      folder: "Assets",
      shareLink: "https://alltools.com/s/banner_img",
      passwordProtected: false,
    }
  ]);
  const [newFileFolder, setNewFileFolder] = useState("Finance");
  const [historySearch, setHistorySearch] = useState("");

  // Billing states
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<"Pro (Monthly)" | "Pro (Yearly)" | "Team" | "Enterprise" | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [promoCodeApplied, setPromoCodeApplied] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [checkoutStep, setCheckoutStep] = useState<"select_plan" | "select_method" | "pay_upload" | "pending_review">("select_plan");
  
  // Proof Upload Simulation
  const [proofImageInput, setProofImageInput] = useState<string>("");
  const [sampleProofSelected, setSampleProofSelected] = useState<string>("proof_slip_bca_987.png");
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);

  // Help & Tickets States
  const [faqSearch, setFaqSearch] = useState("");
  const [faqCategoryFilter, setFaqCategoryFilter] = useState("All");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  const [newTicketCategory, setNewTicketCategory] = useState<"Payment problem" | "Account issue" | "Tool error" | "Bug report" | "Suggestion">("Payment problem");
  const [newTicketSubject, setNewTicketSubject] = useState("");
  const [newTicketMessage, setNewTicketMessage] = useState("");
  const [newTicketScreenshot, setNewTicketScreenshot] = useState("");
  const [newTicketPriority, setNewTicketPriority] = useState<"Low" | "Medium" | "High" | "Urgent">("Medium");

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [ticketReplyInput, setTicketReplyInput] = useState("");

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      username,
      bio,
      country,
      timezone,
      language
    });
    onTriggerNotification("Profile Saved", "Your personal details have been synchronized successfully.");
  };

  const handleApplyPromoCode = () => {
    setPromoError("");
    setPromoSuccess("");
    if (!promoCodeInput.trim()) return;

    const code = promoCodeInput.trim().toUpperCase();
    const match = promoCodes.find(p => p.code === code);

    if (!match) {
      setPromoError("Invalid promotional coupon code.");
      setPromoCodeApplied(null);
      return;
    }

    if (match.status === "Expired" || match.activeClaims >= match.maxClaims) {
      setPromoError("This promotional campaign has expired or reached usage limits.");
      setPromoCodeApplied(null);
      return;
    }

    setPromoCodeApplied(match);
    setPromoSuccess(`Coupon '${code}' applied successfully! ${match.discountPercent}% Discount activated.`);
  };

  const getPlanPrice = (plan: "Pro (Monthly)" | "Pro (Yearly)" | "Team" | "Enterprise") => {
    let base = 0;
    if (plan === "Pro (Monthly)") base = 29900;
    else if (plan === "Pro (Yearly)") base = 299000;
    else if (plan === "Team") base = 99000;
    else if (plan === "Enterprise") base = 499000;

    if (promoCodeApplied && (promoCodeApplied.planUnlock === "Pro" && plan.startsWith("Pro") || promoCodeApplied.planUnlock === plan)) {
      const discount = (base * promoCodeApplied.discountPercent) / 100;
      return Math.max(0, base - discount);
    }
    return base;
  };

  const handleInitiateCheckout = (planName: "Pro (Monthly)" | "Pro (Yearly)" | "Team" | "Enterprise") => {
    setSelectedPlanForCheckout(planName);
    setCheckoutStep("select_method");
  };

  const handleSubmitPaymentProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanForCheckout || !selectedPaymentMethod) return;

    setIsSubmittingProof(true);

    setTimeout(() => {
      const finalAmount = getPlanPrice(selectedPlanForCheckout);
      const newTx: PaymentTransaction = {
        id: "TX-" + Math.floor(1000 + Math.random() * 9000),
        username: user.username,
        email: user.email,
        plan: selectedPlanForCheckout,
        amount: finalAmount,
        paymentMethod: selectedPaymentMethod,
        date: new Date().toISOString().split("T")[0],
        proofImage: proofImageInput || `https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=300`,
        status: "Pending"
      };

      onUpdateTransactions(prev => [newTx, ...prev]);

      // If promo code applied, increment active claims
      if (promoCodeApplied) {
        onUpdatePromoCodes(prev => prev.map(p => {
          if (p.code === promoCodeApplied.code) {
            return { ...p, activeClaims: p.activeClaims + 1 };
          }
          return p;
        }));
      }

      onTriggerNotification("Payment Proof Uploaded", "Your manual receipt has been queued for verification by ChenWave Admin.");
      
      // Add activity history
      const recordHistory = {
        id: "h_" + Math.random().toString(36).substring(2, 9),
        toolId: "billing",
        toolName: "Billing Checkout",
        actionSummary: `Submitted payment proof for ${selectedPlanForCheckout} via ${selectedPaymentMethod}`,
        timestamp: new Date().toLocaleString()
      };
      // simulate appending history
      history.unshift(recordHistory);

      setIsSubmittingProof(false);
      setCheckoutStep("pending_review");
    }, 1200);
  };

  const handleAddKey = () => {
    const randomKey = "cw_live_" + Math.random().toString(36).substring(2, 10) + "..." + Math.random().toString(36).substring(2, 6);
    onUpdateUser({
      ...user,
      apiKeys: [...user.apiKeys, randomKey]
    });
    onTriggerNotification("API Key Registered", "Your new production secret access key is ready.");
  };

  const handleRealFileUpload = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    
    const newFile: CloudFile = {
      id: "file_" + Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
      uploadedAt: new Date().toLocaleDateString("en-US"),
      folder: newFileFolder,
      shareLink: `https://alltools.com/s/share_${Math.random().toString(36).substring(2, 7)}`,
      passwordProtected: false
    };

    setFiles((prev) => [newFile, ...prev]);
    onTriggerNotification("File Uploaded", `"${newFile.name}" has been loaded into your ${newFileFolder} cloud locker.`);
  };

  const deleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const copyShareLink = (id: string, link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(""), 1500);
  };

  // Filter history
  const filteredHistory = history.filter((h) => 
    h.toolName.toLowerCase().includes(historySearch.toLowerCase()) ||
    h.actionSummary.toLowerCase().includes(historySearch.toLowerCase())
  );

  const exportHistoryToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Timestamp,Tool Name,Action Details"].join(",") + "\n"
      + history.map(e => `"${e.timestamp}","${e.toolName}","${e.actionSummary}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ChenWave_History_Log.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Support Ticket Submission
  const handleCreateSupportTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject.trim() || !newTicketMessage.trim()) return;

    const newTicket: SupportTicket = {
      id: "TCK-" + Math.floor(400 + Math.random() * 600),
      username: user.username,
      category: newTicketCategory,
      subject: newTicketSubject,
      message: newTicketMessage,
      screenshot: newTicketScreenshot || undefined,
      priority: newTicketPriority,
      status: "Open",
      createdAt: new Date().toLocaleString(),
      replies: []
    };

    onUpdateTickets(prev => [newTicket, ...prev]);
    onTriggerNotification("Support Ticket Created", "Your ticket has been catalogued. Admin agents will review it soon.");

    // Reset Form
    setNewTicketSubject("");
    setNewTicketMessage("");
    setNewTicketScreenshot("");
  };

  const handleSendTicketReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId || !ticketReplyInput.trim()) return;

    onUpdateTickets(prev => prev.map(t => {
      if (t.id === selectedTicketId) {
        return {
          ...t,
          status: "Open", // reset status to open for admin review
          replies: [
            ...t.replies,
            {
              sender: "User",
              message: ticketReplyInput.trim(),
              timestamp: new Date().toLocaleString()
            }
          ]
        };
      }
      return t;
    }));

    setTicketReplyInput("");
    onTriggerNotification("Reply Sent", "Your message comment has been appended to the ticket history.");
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
  };

  // Filter FAQs
  const filteredFaqs = FAQ_ITEMS.filter(f => {
    const matchesSearch = f.q.toLowerCase().includes(faqSearch.toLowerCase()) || f.a.toLowerCase().includes(faqSearch.toLowerCase());
    const matchesCat = faqCategoryFilter === "All" || f.category === faqCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);
  const myTransactions = transactions.filter(tx => tx.username === user.username);
  const myTickets = tickets.filter(t => t.username === user.username);

  return (
    <div id="dashboard-layout" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Sidebar navigation */}
      <div className="lg:col-span-3 bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-4 h-fit">
        <div className="px-3 py-3 bg-neutral-950 border border-neutral-850 rounded-xl text-center space-y-2">
          <div className="relative inline-block">
            <img
              src={user.avatar}
              alt="avatar"
              className="w-14 h-14 mx-auto rounded-full border border-neutral-700 bg-neutral-900 object-cover"
            />
            {user.subscription !== "Free" && (
              <span className="absolute bottom-0 right-0 p-1 bg-indigo-600 rounded-full text-white border-2 border-neutral-950">
                <BadgeCheck className="w-3 h-3" />
              </span>
            )}
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-tight">@{user.username}</h4>
            <p className="text-[10px] text-neutral-400 font-mono mb-1.5">{user.email}</p>
            <span className={`text-[9px] font-bold font-mono px-2.5 py-0.5 rounded-full border ${
              user.subscription === "Free" ? "bg-neutral-900 text-neutral-400 border-neutral-800" :
              user.subscription === "Pro" ? "bg-indigo-950/60 text-indigo-300 border-indigo-800" :
              user.subscription === "Team" ? "bg-emerald-950/60 text-emerald-300 border-emerald-800" :
              "bg-amber-950/60 text-amber-300 border-amber-800"
            }`}>
              {user.subscription.toUpperCase()} PLAN
            </span>
          </div>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab("workspace")}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${activeTab === "workspace" ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/40" : "text-neutral-400 hover:text-white hover:bg-neutral-850"}`}
          >
            <CreditCard className="w-4 h-4" />
            Workspace Overview
          </button>
          
          <button
            onClick={() => { setSelectedPlanForCheckout(null); setCheckoutStep("select_plan"); setActiveTab("billing"); }}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${activeTab === "billing" ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/40" : "text-neutral-400 hover:text-white hover:bg-neutral-850"}`}
          >
            <DollarSign className="w-4 h-4" />
            Billing & Premium
          </button>

          <button
            onClick={() => setActiveTab("files")}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${activeTab === "files" ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/40" : "text-neutral-400 hover:text-white hover:bg-neutral-850"}`}
          >
            <FolderOpen className="w-4 h-4" />
            My Cloud Files ({files.length})
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${activeTab === "history" ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/40" : "text-neutral-400 hover:text-white hover:bg-neutral-850"}`}
          >
            <History className="w-4 h-4" />
            Recent Action Log ({history.length})
          </button>

          <button
            onClick={() => setActiveTab("keys")}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${activeTab === "keys" ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/40" : "text-neutral-400 hover:text-white hover:bg-neutral-850"}`}
          >
            <Key className="w-4 h-4" />
            Workspace API Keys
          </button>

          <button
            onClick={() => { setSelectedTicketId(null); setActiveTab("support"); }}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${activeTab === "support" ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/40" : "text-neutral-400 hover:text-white hover:bg-neutral-850"}`}
          >
            <LifeBuoy className="w-4 h-4" />
            Help Center & Support
          </button>

          <button
            onClick={() => setActiveTab("referrals")}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${activeTab === "referrals" ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/40" : "text-neutral-400 hover:text-white hover:bg-neutral-850"}`}
          >
            <Users className="w-4 h-4" />
            Referral Program
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${activeTab === "settings" ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/40" : "text-neutral-400 hover:text-white hover:bg-neutral-850"}`}
          >
            <Settings className="w-4 h-4" />
            Profile & Settings
          </button>
        </nav>

        {/* INTERACTIVE SIMULATION ROLE SWITCHER */}
        <div className="pt-4 border-t border-neutral-800 space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider px-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            Simulation Switcher
          </div>
          <p className="text-[10px] text-neutral-500 leading-relaxed px-2">
            Change roles or plans in real-time to test subscriber activations & admin dashboards.
          </p>
          <div className="grid grid-cols-2 gap-1 px-1">
            <button
              onClick={() => {
                onUpdateUser({ ...user, role: "User" });
                onTriggerNotification("Flipped to USER Mode", "Standard layout active. Complete subscription flow to trigger manual verification.");
              }}
              className={`p-1.5 text-[10px] font-bold rounded border cursor-pointer transition-colors ${user.role !== "Super Admin" ? "bg-indigo-950 border-indigo-800 text-white" : "bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-white"}`}
            >
              Standard User
            </button>
            <button
              onClick={() => {
                onUpdateUser({ ...user, role: "Super Admin" });
                onTriggerNotification("Flipped to ADMIN Mode", "Super Admin Panel fully unlocked. Check manual review tabs to confirm transactions.");
              }}
              className={`p-1.5 text-[10px] font-bold rounded border cursor-pointer transition-colors ${user.role === "Super Admin" ? "bg-indigo-950 border-indigo-800 text-white" : "bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-white"}`}
            >
              Super Admin
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1 px-1">
            {["Free", "Pro", "Team", "Enterprise"].map(p => (
              <button
                key={p}
                onClick={() => {
                  onUpdateUser({ ...user, subscription: p as any });
                  onTriggerNotification(`Simulation Plan Swapped`, `Your account plan simulated as: ${p}`);
                }}
                className={`p-1 text-[9px] font-mono rounded cursor-pointer transition-colors border ${user.subscription === p ? "bg-emerald-950 border-emerald-800 text-emerald-400" : "bg-neutral-950 border-neutral-850 text-neutral-500 hover:text-white"}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="lg:col-span-9 bg-neutral-900 border border-neutral-800 rounded-2xl p-5 min-h-[420px] flex flex-col shadow-lg">
        
        {/* TAB 1: WORKSPACE WORKDESK */}
        {activeTab === "workspace" && (
          <div className="space-y-6 flex-1">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-800/60">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Workspace Overview</h3>
              <span className="text-[10px] text-neutral-500 font-mono">Joined: {user.joinedDate}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-neutral-950/70 border border-neutral-850 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider font-mono">Simulated Cloud Storage</span>
                <p className="text-lg font-bold text-white font-mono">
                  {(files.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024)).toFixed(2)} MB
                </p>
                <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: `${(files.reduce((sum, f) => sum + f.size, 0) / (100 * 1024 * 1024)) * 100}%` }} />
                </div>
                <p className="text-[9px] text-neutral-500 font-mono">Limit: {user.subscription === "Free" ? "100 MB" : user.subscription === "Pro" ? "50 GB" : user.subscription === "Team" ? "250 GB" : "Unlimited"}</p>
              </div>

              <div className="p-4 bg-neutral-950/70 border border-neutral-850 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Remaining Credits</span>
                <p className="text-xl font-bold text-emerald-400 font-mono">{user.creditsRemaining.toLocaleString()}</p>
                <p className="text-[9px] text-neutral-500">Decrements dynamically per AI prompt execution.</p>
              </div>

              <div className="p-4 bg-neutral-950/70 border border-neutral-850 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider font-mono">Starred Tools</span>
                <p className="text-xl font-bold text-white font-mono">{favorites.length}</p>
                <p className="text-[9px] text-neutral-500">Pinned shortcuts on your global sidebar rail.</p>
              </div>
            </div>

            {/* Quick Pricing Summary redirect */}
            <div className="bg-gradient-to-r from-indigo-950/40 to-neutral-950/70 border border-indigo-900/40 p-4 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="space-y-1 text-center md:text-left">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">Premium Benefits</span>
                <h4 className="text-xs font-bold text-white">Full Tool Suite access, no watermarks, permanent inboxes & API tokens!</h4>
                <p className="text-[10px] text-neutral-400 font-sans">Check prices starting from Rp29.900/month for comprehensive team workspaces.</p>
              </div>
              <button
                onClick={() => { setSelectedPlanForCheckout(null); setCheckoutStep("select_plan"); setActiveTab("billing"); }}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors font-sans shrink-0 flex items-center gap-1"
              >
                Upgrade Plan <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: BILLING & SUBSCRIPTIONS */}
        {activeTab === "billing" && (
          <div className="space-y-6 flex-1 flex flex-col">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-800/60">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-indigo-400" />
                Billing & Premium Activations
              </h3>
              <span className="text-xs text-neutral-400">Current Level: <strong className="text-indigo-400 uppercase font-mono">{user.subscription}</strong></span>
            </div>

            {/* IF CHEVOUT STEP: SELECT PLAN */}
            {checkoutStep === "select_plan" && (
              <div className="space-y-6">
                
                {/* Coupon entry bar */}
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-indigo-400 font-mono uppercase flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" /> Have a Promotional Campaign Coupon?
                    </span>
                    <p className="text-[10px] text-neutral-400">Apply custom codes to unlock discount percentages or premium trials.</p>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <input
                      type="text"
                      placeholder="e.g. CHENWAVE99"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none placeholder-neutral-600 font-mono"
                    />
                    <button
                      onClick={handleApplyPromoCode}
                      className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Apply Code
                    </button>
                  </div>
                </div>

                {promoError && <p className="text-xs text-red-400 font-semibold flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {promoError}</p>}
                {promoSuccess && <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> {promoSuccess}</p>}

                {/* Subscriptions Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  
                  {/* FREE PLAN */}
                  <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-400 font-mono uppercase tracking-wider">Free Plan</h4>
                      <p className="text-xs font-mono font-bold text-white mt-2">Rp0 <span className="text-[10px] text-neutral-500">/ month</span></p>
                      
                      <ul className="text-[10px] text-neutral-400 space-y-1.5 mt-4 font-sans list-disc list-inside">
                        <li>Access to basic tools</li>
                        <li>Limited daily credits</li>
                        <li>Ad banners active</li>
                        <li>Limited locker storage</li>
                        <li>Temporary email (10 min)</li>
                        <li>Watermarked PDF reports</li>
                      </ul>
                    </div>
                    
                    <button
                      disabled
                      className="w-full mt-5 py-1.5 bg-neutral-900 text-neutral-500 rounded-lg text-[10px] font-bold text-center border border-neutral-850"
                    >
                      Default Plan
                    </button>
                  </div>

                  {/* PRO PLAN */}
                  <div className="bg-neutral-950 p-4 rounded-xl border-2 border-indigo-500 relative flex flex-col justify-between">
                    <span className="absolute -top-2.5 right-4 bg-indigo-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">RECOMMENDED</span>
                    <div>
                      <h4 className="text-xs font-bold text-indigo-400 font-mono uppercase tracking-wider">Pro Plan</h4>
                      <div className="mt-2 space-y-0.5">
                        <p className="text-xs font-mono font-bold text-white">
                          {formatRupiah(getPlanPrice("Pro (Monthly)"))} <span className="text-[9px] text-neutral-500">/ mo</span>
                        </p>
                        <p className="text-[10px] text-neutral-400 font-mono">
                          Yearly: {formatRupiah(getPlanPrice("Pro (Yearly)"))} <span className="text-[9px] text-neutral-500">/ yr</span>
                        </p>
                      </div>

                      <ul className="text-[10px] text-neutral-400 space-y-1.5 mt-4 font-sans list-disc list-inside">
                        <li><strong>Remove Ads</strong> entirely</li>
                        <li>Full AI, PDF & Image access</li>
                        <li><strong>10.000 AI Credits</strong> / mo</li>
                        <li>Permanent customized Email</li>
                        <li>50GB Cloud File Locker</li>
                        <li>Priority Queue processing</li>
                        <li>Developer API dashboard</li>
                      </ul>
                    </div>

                    <div className="mt-5 space-y-1.5">
                      <button
                        onClick={() => handleInitiateCheckout("Pro (Monthly)")}
                        className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold text-center cursor-pointer transition-colors"
                      >
                        Subscribe Monthly
                      </button>
                      <button
                        onClick={() => handleInitiateCheckout("Pro (Yearly)")}
                        className="w-full py-1.5 bg-indigo-950 hover:bg-indigo-900 border border-indigo-800 text-indigo-300 rounded-lg text-[10px] font-bold text-center cursor-pointer transition-colors"
                      >
                        Subscribe Yearly
                      </button>
                    </div>
                  </div>

                  {/* TEAM PLAN */}
                  <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-emerald-400 font-mono uppercase tracking-wider">Team Plan</h4>
                      <p className="text-xs font-mono font-bold text-white mt-2">
                        {formatRupiah(getPlanPrice("Team"))} <span className="text-[10px] text-neutral-500">/ mo</span>
                      </p>

                      <ul className="text-[10px] text-neutral-400 space-y-1.5 mt-4 font-sans list-disc list-inside">
                        <li>Everything in Pro Plan +</li>
                        <li><strong>Team Shared workspace</strong></li>
                        <li><strong>Includes 5 members</strong></li>
                        <li>250GB Shared Storage</li>
                        <li>Team members permissions</li>
                        <li>Team usage analytics</li>
                      </ul>
                    </div>

                    <button
                      onClick={() => handleInitiateCheckout("Team")}
                      className="w-full mt-5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold text-center cursor-pointer transition-colors"
                    >
                      Subscribe Team
                    </button>
                  </div>

                  {/* ENTERPRISE PLAN */}
                  <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-amber-500 font-mono uppercase tracking-wider">Enterprise</h4>
                      <p className="text-xs font-mono font-bold text-white mt-2">
                        {formatRupiah(getPlanPrice("Enterprise"))} <span className="text-[10px] text-neutral-500">/ mo</span>
                      </p>

                      <ul className="text-[10px] text-neutral-400 space-y-1.5 mt-4 font-sans list-disc list-inside">
                        <li>Unlimited Team members</li>
                        <li>Unlimited Cloud Storage</li>
                        <li>Custom API token limits</li>
                        <li>Dedicated account manager</li>
                        <li>Advanced single-sign-on (SSO)</li>
                        <li>Enterprise SLA guarantees</li>
                      </ul>
                    </div>

                    <button
                      onClick={() => handleInitiateCheckout("Enterprise")}
                      className="w-full mt-5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold text-center cursor-pointer transition-colors"
                    >
                      Get Enterprise
                    </button>
                  </div>
                </div>

                {/* Plan comparative list info */}
                <div className="bg-neutral-950 p-4 border border-neutral-850 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-white font-mono uppercase">Frequently Asked Questions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] text-neutral-400 leading-relaxed">
                    <div>
                      <p className="font-bold text-neutral-300">Q: Can I pay with GoPay or QRIS?</p>
                      <p>A: Yes! We provide direct QRIS generation and Indonesian e-wallets including GoPay, DANA, OVO, and ShopeePay.</p>
                    </div>
                    <div>
                      <p className="font-bold text-neutral-300">Q: How is my premium plan activated?</p>
                      <p>A: When you complete a payment and upload your receipt, the admin will approve it and your subscription benefits activate instantly.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* IF CHECKOUT STEP: SELECT PAYMENT METHOD */}
            {checkoutStep === "select_method" && selectedPlanForCheckout && (
              <div className="space-y-5">
                <div className="flex justify-between items-center bg-neutral-950 p-3 rounded-xl border border-neutral-850">
                  <div className="text-xs">
                    <span className="text-neutral-500 font-mono text-[9px] uppercase">Selected Plan</span>
                    <h4 className="font-bold text-white">{selectedPlanForCheckout} Workspace</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-neutral-500 font-mono text-[9px] uppercase">Amount Due</span>
                    <p className="text-sm font-mono font-bold text-indigo-400">{formatRupiah(getPlanPrice(selectedPlanForCheckout))}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Select Payment Method</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Indonesian Methods */}
                    <div className="p-4 bg-neutral-950/60 border border-neutral-850 rounded-xl space-y-2.5">
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-900/40 uppercase">Local Indonesia Pay</span>
                      
                      <div className="space-y-1.5">
                        {saasSettings.qrisActive && (
                          <label className="flex items-center gap-3 p-2 bg-neutral-950 border border-neutral-900 rounded-lg hover:border-indigo-500/60 cursor-pointer text-xs">
                            <input
                              type="radio"
                              name="pay_method"
                              checked={selectedPaymentMethod === "QRIS"}
                              onChange={() => setSelectedPaymentMethod("QRIS")}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>🇮🇩 QRIS (Instant Digital QR Code)</span>
                          </label>
                        )}

                        {saasSettings.bankActive && (
                          <label className="flex items-center gap-3 p-2 bg-neutral-950 border border-neutral-900 rounded-lg hover:border-indigo-500/60 cursor-pointer text-xs">
                            <input
                              type="radio"
                              name="pay_method"
                              checked={selectedPaymentMethod === "BCA Bank Transfer"}
                              onChange={() => setSelectedPaymentMethod("BCA Bank Transfer")}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>🇮🇩 BCA Bank Transfer (ChenWave Official)</span>
                          </label>
                        )}

                        {saasSettings.danaActive && (
                          <label className="flex items-center gap-3 p-2 bg-neutral-950 border border-neutral-900 rounded-lg hover:border-indigo-500/60 cursor-pointer text-xs">
                            <input
                              type="radio"
                              name="pay_method"
                              checked={selectedPaymentMethod === "DANA"}
                              onChange={() => setSelectedPaymentMethod("DANA")}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>🇮🇩 DANA E-Wallet</span>
                          </label>
                        )}

                        {saasSettings.gopayActive && (
                          <label className="flex items-center gap-3 p-2 bg-neutral-950 border border-neutral-900 rounded-lg hover:border-indigo-500/60 cursor-pointer text-xs">
                            <input
                              type="radio"
                              name="pay_method"
                              checked={selectedPaymentMethod === "GoPay"}
                              onChange={() => setSelectedPaymentMethod("GoPay")}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>🇮🇩 GoPay E-Wallet</span>
                          </label>
                        )}

                        {saasSettings.ovoActive && (
                          <label className="flex items-center gap-3 p-2 bg-neutral-950 border border-neutral-900 rounded-lg hover:border-indigo-500/60 cursor-pointer text-xs">
                            <input
                              type="radio"
                              name="pay_method"
                              checked={selectedPaymentMethod === "OVO"}
                              onChange={() => setSelectedPaymentMethod("OVO")}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>🇮🇩 OVO E-Wallet</span>
                          </label>
                        )}

                        {saasSettings.shopeepayActive && (
                          <label className="flex items-center gap-3 p-2 bg-neutral-950 border border-neutral-900 rounded-lg hover:border-indigo-500/60 cursor-pointer text-xs">
                            <input
                              type="radio"
                              name="pay_method"
                              checked={selectedPaymentMethod === "ShopeePay"}
                              onChange={() => setSelectedPaymentMethod("ShopeePay")}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>🇮🇩 ShopeePay E-Wallet</span>
                          </label>
                        )}
                      </div>
                    </div>

                    {/* International Methods */}
                    <div className="p-4 bg-neutral-950/60 border border-neutral-850 rounded-xl space-y-2.5">
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-900/40 uppercase">Global Channels</span>
                      
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-3 p-2 bg-neutral-950 border border-neutral-900 rounded-lg hover:border-indigo-500/60 cursor-pointer text-xs">
                          <input
                            type="radio"
                            name="pay_method"
                            checked={selectedPaymentMethod === "Credit Card"}
                            onChange={() => setSelectedPaymentMethod("Credit Card")}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <span>🌐 Credit Card (Visa/Mastercard)</span>
                        </label>

                        <label className="flex items-center gap-3 p-2 bg-neutral-950 border border-neutral-900 rounded-lg hover:border-indigo-500/60 cursor-pointer text-xs">
                          <input
                            type="radio"
                            name="pay_method"
                            checked={selectedPaymentMethod === "PayPal"}
                            onChange={() => setSelectedPaymentMethod("PayPal")}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <span>🌐 PayPal Gateway Integration</span>
                        </label>

                        <label className="flex items-center gap-3 p-2 bg-neutral-950 border border-neutral-900 rounded-lg hover:border-indigo-500/60 cursor-pointer text-xs">
                          <input
                            type="radio"
                            name="pay_method"
                            checked={selectedPaymentMethod === "Stripe"}
                            onChange={() => setSelectedPaymentMethod("Stripe")}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <span>🌐 Stripe Secure Elements</span>
                        </label>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-neutral-850">
                  <button
                    onClick={() => setCheckoutStep("select_plan")}
                    className="px-4 py-2 bg-neutral-950 border border-neutral-850 text-neutral-400 hover:text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Back to Plans
                  </button>
                  <button
                    disabled={!selectedPaymentMethod}
                    onClick={() => setCheckoutStep("pay_upload")}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* IF CHECKOUT STEP: PAY & UPLOAD PROOF */}
            {checkoutStep === "pay_upload" && selectedPlanForCheckout && selectedPaymentMethod && (
              <form onSubmit={handleSubmitPaymentProof} className="space-y-5">
                
                <div className="bg-neutral-950 p-4 border border-neutral-850 rounded-xl space-y-3">
                  <div className="flex justify-between items-center border-b border-neutral-850 pb-2">
                    <div>
                      <span className="text-[10px] text-neutral-500 font-mono">STEP 3 OF 3</span>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Payment Terminal Instructions</h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">{formatRupiah(getPlanPrice(selectedPlanForCheckout))}</span>
                  </div>

                  {/* DYNAMIC DETAILS ACCORDING TO THE METHOD */}
                  {selectedPaymentMethod === "QRIS" && (
                    <div className="space-y-4 text-center md:text-left">
                      <div className="flex flex-col md:flex-row items-center gap-4">
                        <img
                          src={saasSettings.qrisImage}
                          alt="QRIS QR Code"
                          className="w-36 h-36 bg-white p-2 rounded-lg border border-neutral-700"
                        />
                        <div className="space-y-1">
                          <span className="bg-emerald-950 text-emerald-400 font-bold font-mono px-2 py-0.5 rounded text-[9px] uppercase">GPN QRIS Certified</span>
                          <h5 className="text-xs font-bold text-white mt-1">Scan QRIS to Complete Checkout</h5>
                          <p className="text-[10px] text-neutral-400 whitespace-pre-line leading-relaxed">{saasSettings.qrisInstructions}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === "BCA Bank Transfer" && (
                    <div className="space-y-3 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-neutral-900 p-3 rounded-lg border border-neutral-850">
                        <div>
                          <span className="text-neutral-500 text-[9px] font-mono block">BANK NAME</span>
                          <span className="font-bold text-white text-xs">{saasSettings.bankName}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 text-[9px] font-mono block">ACCOUNT NUMBER</span>
                          <span className="font-bold text-indigo-400 text-xs font-mono select-all flex items-center gap-1.5">
                            {saasSettings.bankAccountNumber}
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(saasSettings.bankAccountNumber);
                                onTriggerNotification("Copied", "Bank account number saved to clipboard.");
                              }}
                              className="text-neutral-500 hover:text-white"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500 text-[9px] font-mono block">RECIPIENT NAME</span>
                          <span className="font-bold text-white text-xs">{saasSettings.bankAccountName}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-neutral-400">Transfer Guidelines:</span>
                        <p className="text-[10px] text-neutral-500 whitespace-pre-line leading-relaxed">{saasSettings.bankInstructions}</p>
                      </div>
                    </div>
                  )}

                  {/* E-Wallets */}
                  {["DANA", "GoPay", "OVO", "ShopeePay"].includes(selectedPaymentMethod) && (
                    <div className="space-y-3 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-neutral-900 p-3 rounded-lg border border-neutral-850">
                        <div>
                          <span className="text-neutral-500 text-[9px] font-mono block">WALLET PHONE NUMBER</span>
                          <span className="font-bold text-indigo-400 text-xs font-mono select-all flex items-center gap-1.5">
                            {selectedPaymentMethod === "DANA" ? saasSettings.danaPhone :
                             selectedPaymentMethod === "GoPay" ? saasSettings.gopayPhone :
                             selectedPaymentMethod === "OVO" ? saasSettings.ovoPhone :
                             saasSettings.shopeepayPhone}
                            <button
                              type="button"
                              onClick={() => {
                                const phone = selectedPaymentMethod === "DANA" ? saasSettings.danaPhone :
                                              selectedPaymentMethod === "GoPay" ? saasSettings.gopayPhone :
                                              selectedPaymentMethod === "OVO" ? saasSettings.ovoPhone :
                                              saasSettings.shopeepayPhone;
                                navigator.clipboard.writeText(phone);
                                onTriggerNotification("Copied", "Phone number copied to clipboard.");
                              }}
                              className="text-neutral-500 hover:text-white"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500 text-[9px] font-mono block">REGISTERED OWNER</span>
                          <span className="font-bold text-white text-xs">
                            {selectedPaymentMethod === "DANA" ? saasSettings.danaName :
                             selectedPaymentMethod === "GoPay" ? saasSettings.gopayName :
                             selectedPaymentMethod === "OVO" ? saasSettings.ovoName :
                             saasSettings.shopeepayName}
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] text-neutral-400 leading-relaxed font-sans">
                        Instructions: Please open your {selectedPaymentMethod} app, tap 'Send To Phone', enter the owner mobile number above, specify the exact billing total of <strong>{formatRupiah(getPlanPrice(selectedPlanForCheckout))}</strong>, and proceed to pay. Store the transaction summary ticket for upload below.
                      </p>
                    </div>
                  )}

                  {/* Sandboxed Global Methods */}
                  {["Credit Card", "PayPal", "Stripe"].includes(selectedPaymentMethod) && (
                    <div className="space-y-3">
                      <span className="bg-indigo-950 text-indigo-300 font-bold font-mono px-2 py-0.5 rounded text-[9px] uppercase">SANDBOXED SECURE INPUT</span>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-400">Cardholder Name</label>
                          <input type="text" placeholder="Chen Wave" className="bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1 text-xs text-white focus:outline-none w-full" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-400">Card Number (Mock Sandbox)</label>
                          <input type="text" placeholder="4111 2222 3333 4444" className="bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1 text-xs text-white focus:outline-none w-full font-mono" />
                        </div>
                      </div>
                      <p className="text-[10px] text-neutral-500">
                        Since this is a simulated sandbox SaaS platform, entering mock card details will instantly direct you to upload an authorization token/receipt to confirm manual validation rules.
                      </p>
                    </div>
                  )}
                </div>

                {/* UPLOAD PROOF FORM ELEMENT */}
                <div className="bg-neutral-950 p-4 border border-neutral-850 rounded-xl space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Upload Payment Proof (Receipt Slip)</h4>
                  
                  {/* Select Proof Simulators */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-neutral-400 block font-semibold">Select a preset receipt proof image (to simulate verification easily):</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <label className="flex items-center gap-2 p-2 rounded bg-neutral-900 text-[10px] cursor-pointer text-neutral-300 border border-neutral-800 hover:border-indigo-500">
                        <input
                          type="radio"
                          name="proof_presets"
                          checked={sampleProofSelected === "proof_slip_bca_987.png"}
                          onChange={() => {
                            setSampleProofSelected("proof_slip_bca_987.png");
                            setProofImageInput("https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=300");
                          }}
                        />
                        <span>✅ Valid BCA Receipt Slip Preset (Alice)</span>
                      </label>
                      <label className="flex items-center gap-2 p-2 rounded bg-neutral-900 text-[10px] cursor-pointer text-neutral-300 border border-neutral-800 hover:border-indigo-500">
                        <input
                          type="radio"
                          name="proof_presets"
                          checked={sampleProofSelected === "fake_blurry_slip.png"}
                          onChange={() => {
                            setSampleProofSelected("fake_blurry_slip.png");
                            setProofImageInput("https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=300");
                          }}
                        />
                        <span>❌ Fake/Wrong Amount Receipt Slip Preset (Charlie)</span>
                      </label>
                    </div>
                  </div>

                  {/* Drag and Drop Zone or custom url */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-neutral-400 block">Or upload your custom receipt image file:</span>
                    <label className="flex flex-col items-center justify-center border border-dashed border-neutral-800 hover:border-indigo-500/60 bg-neutral-950/20 hover:bg-neutral-950/40 rounded-xl p-6 text-center cursor-pointer transition-all">
                      <UploadCloud className="w-6 h-6 text-indigo-400 mb-1" />
                      <p className="text-[11px] font-semibold text-white">Select Receipt Image File (PDF, PNG, JPG)</p>
                      <p className="text-[9px] text-neutral-500">Simulates loading file securely into verification storage</p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setSampleProofSelected(e.target.files[0].name);
                            setProofImageInput("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300");
                          }
                        }}
                      />
                    </label>
                    {sampleProofSelected && (
                      <p className="text-[10px] font-mono text-indigo-400 flex items-center gap-1.5 justify-center">
                        <FileImage className="w-3.5 h-3.5" /> File Selected: {sampleProofSelected}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep("select_method")}
                    className="px-4 py-2 bg-neutral-950 border border-neutral-850 text-neutral-400 hover:text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Back to Methods
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingProof}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                  >
                    {isSubmittingProof ? "Uploading Proof..." : "Submit Receipt for Approval"} <Send className="w-3 h-3" />
                  </button>
                </div>
              </form>
            )}

            {/* STATUS: PENDING REVIEW OR SUCCESS STATE */}
            {checkoutStep === "pending_review" && (
              <div className="bg-neutral-950 border border-neutral-850 rounded-xl p-8 text-center space-y-4 max-w-md mx-auto my-6">
                <div className="p-4 bg-amber-500/15 text-amber-400 rounded-full w-14 h-14 mx-auto flex items-center justify-center border border-amber-500/30">
                  <Clock className="w-8 h-8 animate-spin" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Manual Payment Proof Staged!</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Our platform administrators are currently reviewing your uploaded transaction invoice. Manual verification typically processes in 5-15 minutes.
                  </p>
                </div>
                <div className="p-3.5 bg-neutral-900 rounded-lg border border-neutral-850 text-[11px] font-mono text-neutral-400 text-left space-y-1">
                  <p>• Plan: <strong className="text-indigo-400">{selectedPlanForCheckout}</strong></p>
                  <p>• Method: <strong className="text-indigo-400">{selectedPaymentMethod}</strong></p>
                  <p>• Status: <strong className="text-amber-500 uppercase animate-pulse">PENDING REVIEW</strong></p>
                </div>
                <button
                  onClick={() => { setCheckoutStep("select_plan"); }}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold text-white cursor-pointer"
                >
                  View Subscription Options
                </button>
              </div>
            )}

            {/* TRANSACTION HISTORY LEDGER FOR THIS USER */}
            <div className="space-y-3 pt-4 border-t border-neutral-800">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">My Subscription Transactions</h4>
              <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950/20">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 font-mono text-[10px] uppercase">
                      <th className="p-3">Transaction ID</th>
                      <th className="p-3">Plan</th>
                      <th className="p-3">Method</th>
                      <th className="p-3">Billing Amount</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-850">
                    {myTransactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-neutral-900/30">
                        <td className="p-3 font-mono font-bold text-white">{tx.id}</td>
                        <td className="p-3 text-neutral-300 font-medium">{tx.plan}</td>
                        <td className="p-3 text-neutral-400 font-mono text-[11px]">{tx.paymentMethod}</td>
                        <td className="p-3 font-mono font-semibold text-white">{formatRupiah(tx.amount)}</td>
                        <td className="p-3 font-mono text-neutral-400">{tx.date}</td>
                        <td className="p-3">
                          <div className="space-y-1">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              tx.status === "Successful" ? "bg-emerald-950/50 text-emerald-400 border border-emerald-900/40" :
                              tx.status === "Pending" ? "bg-amber-950/50 text-amber-400 border border-amber-900/40" :
                              "bg-red-950/50 text-red-400 border border-red-900/40"
                            }`}>
                              {tx.status}
                            </span>
                            {tx.rejectionReason && (
                              <p className="text-[9px] text-red-400 font-mono mt-1 max-w-xs leading-tight">Reason: {tx.rejectionReason}</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {myTransactions.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-neutral-600">No transactions recorded for your profile.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: CLOUD FILES LOCKER */}
        {activeTab === "files" && (
          <div className="space-y-5 flex-1">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-800/60">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">My Files Locker</h3>
              <span className="text-[10px] text-neutral-500 font-mono">Limit: {files.length} items staged</span>
            </div>

            {/* Real File Upload Dropzone */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-8">
                <label 
                  id="dropzone-label"
                  className="flex flex-col items-center justify-center border border-dashed border-neutral-800 hover:border-indigo-500/60 bg-neutral-950/20 hover:bg-neutral-950/40 rounded-xl p-5 text-center cursor-pointer transition-all duration-200"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.dataTransfer.files) {
                      handleRealFileUpload(e.dataTransfer.files);
                    }
                  }}
                >
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleRealFileUpload(e.target.files)}
                  />
                  <UploadCloud className="w-8 h-8 text-indigo-400 mb-2" />
                  <p className="text-xs font-semibold text-white">Drag & drop your files here, or <span className="text-indigo-400 underline">browse</span></p>
                  <p className="text-[10px] text-neutral-500 mt-1">Supports images, PDFs, spreadsheets, and more (Max 100MB)</p>
                </label>
              </div>

              <div className="md:col-span-4 flex flex-col justify-between p-3.5 bg-neutral-950/50 border border-neutral-850 rounded-xl">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider font-mono">Locker Target Folder</span>
                  <select
                    value={newFileFolder}
                    onChange={(e) => setNewFileFolder(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-neutral-300 focus:outline-none"
                  >
                    <option value="Finance">📁 Finance folder</option>
                    <option value="Assets">📁 Assets folder</option>
                    <option value="Temp Files">📁 Temp files</option>
                  </select>
                </div>
                <p className="text-[10px] text-neutral-500 mt-2">
                  Files uploaded to All Tools Locker are secured using industry-standard AES-256 cloud encryption.
                </p>
              </div>
            </div>

            {/* Files List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {files.map((file) => (
                <div key={file.id} className="p-3 bg-neutral-950/44 border border-neutral-850 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded bg-neutral-900 flex items-center justify-center border border-neutral-800 text-indigo-400">
                      <FileBox className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold text-white truncate max-w-[180px] md:max-w-[320px]" title={file.name}>
                        {file.name}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-mono">
                        <span>{file.uploadedAt}</span>
                        <span>•</span>
                        <span>{(file.size / 1024).toFixed(1)} KB</span>
                        <span>•</span>
                        <span className="text-indigo-400 bg-indigo-950/40 px-1.5 py-0.2 rounded">{file.folder}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {file.passwordProtected && (
                      <span className="p-1 rounded bg-neutral-900 text-amber-500" title="Password-Protected Sharing Link active">
                        <Shield className="w-3.5 h-3.5" />
                      </span>
                    )}

                    <button
                      onClick={() => copyShareLink(file.id, file.shareLink || "")}
                      className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      title="Copy Shareable Locker Link"
                    >
                      {copiedLink === file.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => deleteFile(file.id)}
                      className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                      title="Purge Document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ACTION HISTORY */}
        {activeTab === "history" && (
          <div className="space-y-4 flex-1 flex flex-col">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-800/60 shrink-0">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">SaaS Interaction Ledger</h3>
              <div className="flex gap-2">
                {history.length > 0 && (
                  <>
                    <button
                      onClick={exportHistoryToCSV}
                      className="px-2.5 py-1 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-300 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" /> Export CSV
                    </button>
                    <button
                      onClick={onClearHistory}
                      className="px-2.5 py-1 bg-red-950/40 border border-red-900 text-red-400 hover:bg-red-900 hover:text-white rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Clear History
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Search filter bar */}
            <div className="relative shrink-0">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-neutral-600" />
              <input
                type="text"
                placeholder="Search history ledger logs..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-850 rounded px-8 py-1.5 text-xs text-white placeholder-neutral-700 focus:outline-none"
              />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-2 max-h-[260px]">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
                  <div key={item.id} className="p-3 bg-neutral-950/40 border border-neutral-850 rounded-lg flex items-center justify-between gap-3 font-sans">
                    <div className="space-y-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-neutral-500 font-mono">{item.timestamp}</span>
                        <span className="text-[9px] font-bold font-mono px-1.5 py-0.2 bg-neutral-900 text-indigo-400 rounded">
                          {item.toolName}
                        </span>
                      </div>
                      <p className="text-xs text-white font-medium truncate">{item.actionSummary}</p>
                    </div>

                    <button
                      onClick={() => onDeleteHistoryItem(item.id)}
                      className="p-1 rounded text-neutral-600 hover:text-red-400 hover:bg-neutral-900 transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="h-full py-16 text-center text-xs text-neutral-600">
                  No records matched your index search parameters.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: API KEYS */}
        {activeTab === "keys" && (
          <div className="space-y-5 flex-1">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-800/60">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Developer API Keys</h3>
              <button
                onClick={handleAddKey}
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 rounded text-[10px] font-bold text-white cursor-pointer"
              >
                + Create Secret Token
              </button>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              Authenticate your CLI scripts, backend servers, or custom programs directly into ChenWave. These private key secrets grant full programmatic access to standard compiler and converter tools.
            </p>

            <div className="space-y-2 font-mono">
              {user.apiKeys.map((key, i) => (
                <div key={i} className="p-3 bg-neutral-950 border border-neutral-850 rounded-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-neutral-500">Live API Key</span>
                    <p className="text-xs text-indigo-300 font-bold tracking-wider">{key}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("cw_secret_live_8f3a29bc1e884f3c9902bd3a72e");
                      setCopiedKey(true);
                      setTimeout(() => setCopiedKey(false), 1500);
                    }}
                    className="p-1.5 bg-neutral-900 hover:bg-neutral-800 rounded border border-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: HELP CENTER FAQ & SUPPORT TICKET CONSOLE */}
        {activeTab === "support" && (
          <div className="space-y-6 flex-1 flex flex-col">
            
            {/* Header section with Telegram Support Info */}
            <div className="bg-gradient-to-r from-indigo-950/40 to-neutral-950 p-5 rounded-2xl border border-indigo-900/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase">Customer Desk Online</span>
                </div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Telegram Official Customer Support
                </h4>
                <p className="text-xs text-neutral-400">
                  Direct Chat with staff: <strong className="text-white">@{saasSettings.telegramUsername}</strong> • Hours: <strong className="text-white">{saasSettings.supportHours}</strong>
                </p>
                <p className="text-[10px] text-neutral-500 leading-relaxed max-w-lg">
                  {saasSettings.autoReplyMessage}
                </p>
              </div>

              <a
                href={`https://t.me/${saasSettings.telegramUsername}`}
                target="_blank"
                referrerPolicy="no-referrer"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shrink-0 shadow-lg shadow-indigo-950"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Contact Customer Support
              </a>
            </div>

            {/* If a ticket is currently selected, show the reply viewer */}
            {selectedTicketId && selectedTicket ? (
              <div className="space-y-4 bg-neutral-950/40 p-4 border border-neutral-800 rounded-xl">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-850">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500">TICKET: {selectedTicket.id}</span>
                    <h4 className="text-xs font-bold text-white uppercase">{selectedTicket.subject}</h4>
                  </div>
                  <button
                    onClick={() => setSelectedTicketId(null)}
                    className="text-[10px] text-neutral-400 hover:text-white font-mono bg-neutral-900 px-2 py-1 rounded"
                  >
                    Back to Tickets
                  </button>
                </div>

                <div className="space-y-3 max-h-[250px] overflow-y-auto">
                  {/* Original Complaint message */}
                  <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg space-y-1 text-xs">
                    <div className="flex justify-between font-mono text-[9px] text-neutral-500">
                      <span>User: @{selectedTicket.username}</span>
                      <span>{selectedTicket.createdAt}</span>
                    </div>
                    <p className="text-white whitespace-pre-wrap">{selectedTicket.message}</p>
                    {selectedTicket.screenshot && (
                      <div className="mt-2">
                        <span className="text-[9px] font-mono text-neutral-500 block">Screenshot Attachment:</span>
                        <img src={selectedTicket.screenshot} alt="attachment" className="w-24 h-16 object-cover bg-neutral-950 rounded border border-neutral-850 cursor-zoom-in" />
                      </div>
                    )}
                  </div>

                  {/* Replies feed */}
                  {selectedTicket.replies.map((rep, idx) => (
                    <div key={idx} className={`p-3 rounded-lg text-xs space-y-1 ${rep.sender === "Admin" ? "bg-indigo-950/30 border border-indigo-900/40 ml-6" : "bg-neutral-900 border border-neutral-800 mr-6"}`}>
                      <div className="flex justify-between font-mono text-[9px] text-neutral-500">
                        <span className={rep.sender === "Admin" ? "text-indigo-400 font-bold" : ""}>{rep.sender === "Admin" ? "👑 Admin Support" : `@${selectedTicket.username}`}</span>
                        <span>{rep.timestamp}</span>
                      </div>
                      <p className="text-white whitespace-pre-wrap">{rep.message}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendTicketReply} className="flex gap-2 border-t border-neutral-850 pt-3">
                  <input
                    type="text"
                    required
                    placeholder="Type your comment reply here..."
                    value={ticketReplyInput}
                    onChange={(e) => setTicketReplyInput(e.target.value)}
                    className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none w-full"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg flex items-center gap-1 shrink-0"
                  >
                    Send <Send className="w-3 h-3" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* FAQ SECTION */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Interactive Help Center</h4>
                    <select
                      value={faqCategoryFilter}
                      onChange={(e) => setFaqCategoryFilter(e.target.value)}
                      className="bg-neutral-950 border border-neutral-800 rounded px-2 py-0.5 text-[10px] text-neutral-300 outline-none"
                    >
                      <option value="All">All Categories</option>
                      <option value="Account">Account</option>
                      <option value="Payment">Payment</option>
                      <option value="Subscription">Subscription</option>
                      <option value="Tools">Tools</option>
                      <option value="Bug Report">Bug Report</option>
                    </select>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-neutral-600" />
                    <input
                      type="text"
                      placeholder="Search FAQs..."
                      value={faqSearch}
                      onChange={(e) => setFaqSearch(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-850 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-700 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {filteredFaqs.map(faq => (
                      <div key={faq.id} className="border border-neutral-850 rounded-xl bg-neutral-950/20 overflow-hidden text-xs">
                        <button
                          onClick={() => setExpandedFaqId(expandedFaqId === faq.id ? null : faq.id)}
                          className="w-full flex justify-between items-center p-3 text-left font-bold text-white hover:bg-neutral-900/40 cursor-pointer"
                        >
                          <span>{faq.q}</span>
                          {expandedFaqId === faq.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                        {expandedFaqId === faq.id && (
                          <p className="p-3 border-t border-neutral-850 bg-neutral-950 text-neutral-400 leading-relaxed font-sans">
                            {faq.a}
                          </p>
                        )}
                      </div>
                    ))}
                    {filteredFaqs.length === 0 && <p className="text-center text-xs text-neutral-600 py-6">No matching articles found.</p>}
                  </div>
                </div>

                {/* CREATE TICKET AND TICKET HISTORY FORM */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Submit Support Ticket</h4>
                  
                  <form onSubmit={handleCreateSupportTicket} className="space-y-3 text-xs bg-neutral-950/40 p-4 border border-neutral-800 rounded-xl">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-400">Category</label>
                        <select
                          value={newTicketCategory}
                          onChange={(e) => setNewTicketCategory(e.target.value as any)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1.5 text-white outline-none text-xs"
                        >
                          <option value="Payment problem">Payment problem</option>
                          <option value="Account issue">Account issue</option>
                          <option value="Tool error">Tool error</option>
                          <option value="Bug report">Bug report</option>
                          <option value="Suggestion">Suggestion</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-400">Priority</label>
                        <select
                          value={newTicketPriority}
                          onChange={(e) => setNewTicketPriority(e.target.value as any)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1.5 text-white outline-none text-xs"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Urgent">Urgent</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-400">Subject</label>
                      <input
                        type="text"
                        required
                        placeholder="Brief title of the problem"
                        value={newTicketSubject}
                        onChange={(e) => setNewTicketSubject(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-1.5 text-white focus:outline-none text-xs placeholder-neutral-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-400">Detailed Message</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Detail your request or bug parameters"
                        value={newTicketMessage}
                        onChange={(e) => setNewTicketMessage(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded p-2.5 text-white focus:outline-none text-xs placeholder-neutral-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-400">Screenshot URL / Base64 (Optional)</label>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          placeholder="Or select simulated preset snapshot below"
                          value={newTicketScreenshot}
                          onChange={(e) => setNewTicketScreenshot(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-1 text-xs text-white focus:outline-none placeholder-neutral-700"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setNewTicketScreenshot("https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=300");
                            onTriggerNotification("Preset Attached", "Simulated invoice receipt snapshot loaded.");
                          }}
                          className="px-2.5 bg-neutral-800 hover:bg-neutral-700 rounded text-[10px] font-bold text-white whitespace-nowrap cursor-pointer"
                        >
                          Mock slip
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 font-bold text-white text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" /> Submit Support Ticket
                    </button>
                  </form>

                </div>
              </div>
            )}

            {/* MY TICKETS ARCHIVE LIST */}
            {!selectedTicketId && (
              <div className="space-y-3 pt-4 border-t border-neutral-800">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">My Support Ticket History</h4>
                <div className="divide-y divide-neutral-850 border border-neutral-850 rounded-xl bg-neutral-950/20 overflow-hidden text-xs">
                  {myTickets.map(ticket => (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className="p-3.5 flex justify-between items-center hover:bg-neutral-900/30 cursor-pointer transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-neutral-500 font-mono font-bold">{ticket.id}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            ticket.priority === "Urgent" ? "bg-red-950 text-red-400 border border-red-900/40" :
                            ticket.priority === "High" ? "bg-amber-950 text-amber-400 border border-amber-900/40" :
                            "bg-neutral-900 text-neutral-400 border border-neutral-800"
                          }`}>
                            {ticket.priority} priority
                          </span>
                        </div>
                        <h5 className="font-semibold text-white">{ticket.subject}</h5>
                        <p className="text-[11px] text-neutral-400 truncate max-w-sm md:max-w-lg">{ticket.message}</p>
                      </div>

                      <div className="text-right space-y-1">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          ticket.status === "Closed" ? "bg-neutral-900 text-neutral-500" : "bg-emerald-950/50 text-emerald-400 border border-emerald-900/40"
                        }`}>
                          {ticket.status}
                        </span>
                        <p className="text-[9px] text-neutral-500 font-mono">Replies: {ticket.replies.length}</p>
                      </div>
                    </div>
                  ))}
                  {myTickets.length === 0 && (
                    <p className="text-center text-xs text-neutral-600 py-8">You have not submitted any customer tickets.</p>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 7: REFERRALS */}
        {activeTab === "referrals" && (
          <div className="space-y-5 flex-1">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-800/60">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Referral Program</h3>
              <span className="text-[10px] text-neutral-500 font-mono">Invited: {user.referralsCount} users</span>
            </div>

            <div className="p-4 bg-indigo-950/15 border border-indigo-900/40 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-indigo-400" />
                Invite Friends & Earn Credits
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                For every person that registers an account using your exclusive referral code, you'll receive a bonus of <strong>25 premium AI credits</strong> and <strong>2 free Pro plan days</strong>!
              </p>
            </div>

            {/* Code copying bar */}
            <div className="bg-neutral-950 border border-neutral-850 rounded-xl p-3 flex justify-between items-center">
              <div>
                <span className="text-[9px] text-neutral-500 font-mono uppercase">Your Referral Link</span>
                <p className="text-xs text-white font-mono font-bold">
                  https://alltools.com/join?ref={user.referralCode}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`https://alltools.com/join?ref=${user.referralCode}`);
                  onTriggerNotification("Link Copied", "Your invite code has been saved to clipboard.");
                }}
                className="p-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white rounded cursor-pointer"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            {/* Leaderboard */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">Leaderboard</h4>
              <div className="divide-y divide-neutral-850 border border-neutral-850 rounded-xl bg-neutral-950/20 overflow-hidden font-sans">
                {[
                  { rank: 1, name: "Maximus_Gamer", referrals: 245, bonus: "+6125 CR" },
                  { rank: 2, name: "Developer_Sam", referrals: 184, bonus: "+4600 CR" },
                  { rank: 3, name: "SaaS_Wrangler", referrals: 142, bonus: "+3550 CR" },
                ].map((item) => (
                  <div key={item.rank} className="p-3 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-neutral-500 font-bold">#{item.rank}</span>
                      <span className="text-white font-semibold">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] font-mono">
                      <span className="text-neutral-400">{item.referrals} joins</span>
                      <span className="text-indigo-400 font-bold">{item.bonus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: SETTINGS & PREFERENCES */}
        {activeTab === "settings" && (
          <form onSubmit={handleProfileSave} className="space-y-5 flex-1 flex flex-col justify-between">
            <div className="space-y-4 font-sans">
              <div className="pb-2 border-b border-neutral-800/60">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">My Profile</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-400">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-400">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-400">Locker Bio / Headline</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-3 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-400">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-400">Language</label>
                  <input
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-400">Timezone</label>
                  <input
                    type="text"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-xs font-semibold text-white flex items-center justify-center gap-1 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              Save Settings Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
