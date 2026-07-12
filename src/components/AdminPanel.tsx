import React, { useState, useEffect, useRef } from "react";
import { 
  ShieldAlert, Settings, Users, History, Activity, Sparkles, Database, 
  Cpu, Trash2, Search, CheckCircle, RefreshCw, Key, ArrowRight, ShieldCheck, 
  Flame, Mail, HardDrive, Filter, Download, Tag, Terminal, Save, Check, 
  Ban, AlertCircle, Plus, FileText, Globe, KeyRound, DollarSign, Image,
  ChevronRight, MessageSquare, AlertTriangle, Eye, XCircle, Send, CheckSquare
} from "lucide-react";
import { UserProfile, ActionHistory, CloudFile, PaymentTransaction, SupportTicket, AdminSaaSSettings, PromoCode } from "../types";

interface AdminPanelProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onTriggerNotification: (title: string, desc: string) => void;
  onSelectTool: (id: string | null) => void;
  transactions: PaymentTransaction[];
  onUpdateTransactions: React.Dispatch<React.SetStateAction<PaymentTransaction[]>>;
  tickets: SupportTicket[];
  onUpdateTickets: React.Dispatch<React.SetStateAction<SupportTicket[]>>;
  saasSettings: AdminSaaSSettings;
  onUpdateSaasSettings: React.Dispatch<React.SetStateAction<AdminSaaSSettings>>;
  promoCodes: PromoCode[];
  onUpdatePromoCodes: React.Dispatch<React.SetStateAction<PromoCode[]>>;
}

interface AuditLogEntry {
  id: string;
  adminUser: string;
  action: string;
  timestamp: string;
  ipAddress: string;
}

export default function AdminPanel({
  user,
  onUpdateUser,
  onTriggerNotification,
  onSelectTool,
  transactions,
  onUpdateTransactions,
  tickets,
  onUpdateTickets,
  saasSettings,
  onUpdateSaasSettings,
  promoCodes,
  onUpdatePromoCodes
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "payments" | "users" | "promo" | "tickets" | "files" | "terminal" | "settings" | "logs">("overview");
  
  const [mongoStatus, setMongoStatus] = useState<{
    connected: boolean;
    error: string | null;
    uri: string;
    appName: string;
    source: string;
    stats: {
      urls: number;
      temp_mails: number;
      transactions: number;
      tickets: number;
      promo_codes: number;
    }
  } | null>(null);

  const [refreshingMongo, setRefreshingMongo] = useState(false);

  const fetchMongoStatus = async () => {
    try {
      const res = await fetch("/api/mongodb/status");
      if (res.ok) {
        const data = await res.json();
        setMongoStatus(data);
      }
    } catch (err) {
      console.error("Failed to fetch MongoDB status", err);
    }
  };

  useEffect(() => {
    fetchMongoStatus();
    const interval = setInterval(fetchMongoStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleManualMongoRefresh = async () => {
    setRefreshingMongo(true);
    await fetchMongoStatus();
    setTimeout(() => {
      setRefreshingMongo(false);
      onTriggerNotification("Database Refreshed", "Live MongoDB Atlas statistics synchronized successfully.");
    }, 600);
  };

  
  // Security audit logs
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    { id: "A-501", adminUser: "chenwave9", action: "Updated QRIS Gateway Image", timestamp: new Date(Date.now() - 4 * 60000).toLocaleString(), ipAddress: "114.122.45.18" },
    { id: "A-502", adminUser: "chenwave9", action: "Approved payment TX-1002 for @alice_v", timestamp: new Date(Date.now() - 15 * 60000).toLocaleString(), ipAddress: "114.122.45.18" },
    { id: "A-503", adminUser: "chenwave9", action: "Created promo code CHENWAVE99", timestamp: new Date(Date.now() - 60 * 60000).toLocaleString(), ipAddress: "114.122.45.18" },
    { id: "A-504", adminUser: "system", action: "Automatic database vacuum complete", timestamp: new Date(Date.now() - 120 * 60000).toLocaleString(), ipAddress: "127.0.0.1" }
  ]);

  const [logSearch, setLogSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [fileSearch, setFileSearch] = useState("");
  const [promoSearch, setPromoSearch] = useState("");
  const [ticketSearch, setTicketSearch] = useState("");
  const [txSearch, setTxSearch] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [rejectionInputId, setRejectionInputId] = useState<string | null>(null);
  const [rejectionReasonText, setRejectionReasonText] = useState("");
  const [previewingReceiptUrl, setPreviewingReceiptUrl] = useState<string | null>(null);

  // Platform Config State (System Settings)
  const [creditsLimit, setCreditsLimit] = useState(100);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [requireEmailVerify, setRequireEmailVerify] = useState(true);
  const [maxUploadLimit, setMaxUploadLimit] = useState(100);

  // Indonesian Gateway Settings (SaaS settings mirrors)
  const [qrisImage, setQrisImage] = useState(saasSettings.qrisImage);
  const [qrisInstructions, setQrisInstructions] = useState(saasSettings.qrisInstructions);
  const [qrisActive, setQrisActive] = useState(saasSettings.qrisActive);

  const [bankName, setBankName] = useState(saasSettings.bankName);
  const [bankAccountNumber, setBankAccountNumber] = useState(saasSettings.bankAccountNumber);
  const [bankAccountName, setBankAccountName] = useState(saasSettings.bankAccountName);
  const [bankInstructions, setBankInstructions] = useState(saasSettings.bankInstructions);
  const [bankActive, setBankActive] = useState(saasSettings.bankActive);

  const [danaPhone, setDanaPhone] = useState(saasSettings.danaPhone);
  const [danaName, setDanaName] = useState(saasSettings.danaName);
  const [gopayPhone, setGopayPhone] = useState(saasSettings.gopayPhone);
  const [gopayName, setGopayName] = useState(saasSettings.gopayName);
  const [ovoPhone, setOvoPhone] = useState(saasSettings.ovoPhone);
  const [ovoName, setOvoName] = useState(saasSettings.ovoName);
  const [shopeepayPhone, setShopeepayPhone] = useState(saasSettings.shopeepayPhone);
  const [shopeepayName, setShopeepayName] = useState(saasSettings.shopeepayName);

  const [telegramUsername, setTelegramUsername] = useState(saasSettings.telegramUsername);
  const [supportHours, setSupportHours] = useState(saasSettings.supportHours);
  const [autoReplyMessage, setAutoReplyMessage] = useState(saasSettings.autoReplyMessage);

  // User list editor state
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editName, setEditName] = useState("");
  const [editSubscription, setEditSubscription] = useState<"Free" | "Pro" | "Team" | "Enterprise">("Free");
  const [editRole, setEditRole] = useState<"User" | "Developer" | "Super Admin">("User");
  const [editCredits, setEditCredits] = useState(0);

  // Promo Codes Form
  const [newPromoCode, setNewPromoCode] = useState("");
  const [newPromoDiscount, setNewPromoDiscount] = useState(50);
  const [newPromoMax, setNewPromoMax] = useState(100);
  const [newPromoPlan, setNewPromoPlan] = useState<"Pro" | "Team" | "Enterprise" | "Pro (Monthly)" | "Pro (Yearly)">("Pro (Monthly)");

  // Terminal Simulator State
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "ChenWave All-Tools Super-Admin Command Line Interface",
    "Type 'help' to view available operations, or 'reboot' to cycle routes.",
    "-------------------------------------------------------------------------",
    "saas-cluster-node-1:~# "
  ]);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Global user list
  const [userDirectory, setUserDirectory] = useState<UserProfile[]>([
    {
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
      country: "Indonesia",
      timezone: "WIB (UTC+7)",
      language: "Bahasa Indonesia",
      role: "Super Admin"
    },
    {
      id: "usr_alice",
      name: "Alice Vance",
      username: "alice_v",
      email: "alice@company.com",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      joinedDate: "07/10/2026",
      creditsRemaining: 450,
      referralsCount: 12,
      referralCode: "ALICE_999",
      apiKeys: ["at_live_a3f82e1c"],
      subscription: "Pro",
      bio: "Full Stack Designer. Building automation tools with node.",
      country: "Canada",
      timezone: "EST (UTC-5)",
      language: "English",
      role: "User"
    },
    {
      id: "usr_charlie",
      name: "Charlie Brown",
      username: "charlie_b",
      email: "charlie@peanuts.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
      joinedDate: "07/08/2026",
      creditsRemaining: 15,
      referralsCount: 1,
      referralCode: "CHARLIE_S",
      apiKeys: [],
      subscription: "Free",
      bio: "Learning AI development and PDF merge scripting.",
      country: "United States",
      timezone: "PST (UTC-8)",
      language: "English",
      role: "User"
    }
  ]);

  // Global files
  const [globalFiles, setGlobalFiles] = useState<CloudFile[]>([
    { id: "f1", name: "Quarterly_Tax_Summary.pdf", size: 4204500, type: "application/pdf", uploadedAt: "07/10/2026", folder: "Finance", shareLink: "https://alltools.com/s/tax_q3", passwordProtected: true, username: "chenwave9" },
    { id: "f2", name: "Banner_Prototype_Final.png", size: 1250300, type: "image/png", uploadedAt: "07/09/2026", folder: "Assets", shareLink: "https://alltools.com/s/banner_img", passwordProtected: false, username: "alice_v" },
    { id: "f3", name: "Production_Config.env", size: 1240, type: "text/plain", uploadedAt: "07/08/2026", folder: "Temp Files", shareLink: "https://alltools.com/s/config_env", passwordProtected: true, username: "alice_v" },
    { id: "f4", name: "SaaS_Logo_V2.svg", size: 45600, type: "image/svg+xml", uploadedAt: "07/11/2026", folder: "Assets", shareLink: "https://alltools.com/s/logo_svg", passwordProtected: false, username: "bob_b" }
  ]);

  // Support ticket active chat
  const [activeAdminTicketId, setActiveAdminTicketId] = useState<string | null>(null);
  const [adminTicketReplyText, setAdminTicketReplyText] = useState("");

  const activeTicket = tickets.find(t => t.id === activeAdminTicketId);

  // Calculate SaaS Financial totals
  const totalRevenue = transactions
    .filter(tx => tx.status === "Successful")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const pendingApprovalsCount = transactions.filter(tx => tx.status === "Pending").length;
  const activeSubsCount = userDirectory.filter(u => u.subscription !== "Free").length;
  const unresolvedTicketsCount = tickets.filter(t => t.status === "Open").length;

  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs]);

  const handleSaveSaaSSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      qrisImage,
      qrisInstructions,
      qrisActive,
      bankName,
      bankAccountNumber,
      bankAccountName,
      bankInstructions,
      bankActive,
      danaPhone,
      danaName,
      gopayPhone,
      gopayName,
      ovoPhone,
      ovoName,
      shopeepayPhone,
      shopeepayName,
      telegramUsername,
      supportHours,
      autoReplyMessage
    };

    try {
      const res = await fetch("/api/saas-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        onUpdateSaasSettings(payload);

        // Log action
        const newAudit: AuditLogEntry = {
          id: "A-" + Math.floor(500 + Math.random() * 500),
          adminUser: user.username,
          action: "Updated SaaS Gateway & Telegram Support core config parameters (persisted to MongoDB Atlas)",
          timestamp: new Date().toLocaleString(),
          ipAddress: "114.122.45.18"
        };
        setAuditLogs(prev => [newAudit, ...prev]);

        onTriggerNotification("SaaS Settings Saved", "All Indonesia local gateway methods, credentials, and customer auto replies saved & synchronized to MongoDB Atlas.");
      } else {
        throw new Error("Failed to save settings via API");
      }
    } catch (err) {
      console.error("Failed to save settings to DB:", err);
      // Fallback to local state anyway to ensure good user experience
      onUpdateSaasSettings(payload);
      onTriggerNotification("SaaS Settings Saved", "Saved to offline memory (database cluster link busy).");
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePayment = async (txId: string) => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx) return;

    const resolvedPlan = tx.plan.startsWith("Pro") ? "Pro" : tx.plan.startsWith("Team") ? "Team" : "Enterprise";
    const creditsToGrant = tx.plan.startsWith("Pro") ? 10000 : tx.plan.startsWith("Team") ? 50000 : 1000000;

    try {
      const res = await fetch(`/api/transactions/${txId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Successful", rejectionReason: undefined })
      });

      if (res.ok) {
        // Update transaction state locally
        onUpdateTransactions(prev => prev.map(t => {
          if (t.id === txId) {
            return { ...t, status: "Successful", rejectionReason: undefined };
          }
          return t;
        }));

        // Find user in local list or currently active profile
        const targetUsername = tx.username;
        
        // Simulate upgrading the user plan & adding credits
        const isOwner = user.username === targetUsername;

        if (isOwner) {
          onUpdateUser({
            ...user,
            subscription: resolvedPlan as any,
            creditsRemaining: user.creditsRemaining + creditsToGrant
          });
        }

        setUserDirectory(prev => prev.map(u => {
          if (u.username === targetUsername) {
            return {
              ...u,
              subscription: resolvedPlan as any,
              creditsRemaining: u.creditsRemaining + creditsToGrant
            };
          }
          return u;
        }));

        // Audit logs
        const newAudit: AuditLogEntry = {
          id: "A-" + Math.floor(500 + Math.random() * 500),
          adminUser: user.username,
          action: `Approved receipt ${txId} (${resolvedPlan}). Upgraded @${targetUsername}, granted ${creditsToGrant.toLocaleString()} credits.`,
          timestamp: new Date().toLocaleString(),
          ipAddress: "114.122.45.18"
        };
        setAuditLogs(prev => [newAudit, ...prev]);

        onTriggerNotification("Payment Verified", `Approved subscription for @${targetUsername}. Account upgraded to ${resolvedPlan}.`);
        fetchMongoStatus();
      } else {
        throw new Error("HTTP error approving payment");
      }
    } catch (err) {
      console.error(err);
      onTriggerNotification("Approval Error", "Database synchronization failed. Please try again.");
    }
  };

  const handleRejectPayment = async (txId: string) => {
    if (!rejectionReasonText.trim()) return;

    try {
      const res = await fetch(`/api/transactions/${txId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Rejected", rejectionReason: rejectionReasonText.trim() })
      });

      if (res.ok) {
        // Reject transaction
        onUpdateTransactions(prev => prev.map(t => {
          if (t.id === txId) {
            return { ...t, status: "Rejected", rejectionReason: rejectionReasonText.trim() };
          }
          return t;
        }));

        const tx = transactions.find(t => t.id === txId);
        const targetUsername = tx ? tx.username : "unknown";

        // Audit logs
        const newAudit: AuditLogEntry = {
          id: "A-" + Math.floor(500 + Math.random() * 500),
          adminUser: user.username,
          action: `Rejected receipt ${txId} for @${targetUsername}. Reason: "${rejectionReasonText.trim()}"`,
          timestamp: new Date().toLocaleString(),
          ipAddress: "114.122.45.18"
        };
        setAuditLogs(prev => [newAudit, ...prev]);

        onTriggerNotification("Payment Proof Rejected", `Sent invoice rejection reason to @${targetUsername}.`);
        setRejectionInputId(null);
        setRejectionReasonText("");
        fetchMongoStatus();
      } else {
        throw new Error("HTTP error rejecting payment");
      }
    } catch (err) {
      console.error(err);
      onTriggerNotification("Rejection Error", "Database synchronization failed. Please try again.");
    }
  };

  // Modify subscriber manually
  const handleEditSubscriber = (u: UserProfile) => {
    setEditingUser(u);
    setEditName(u.name);
    setEditSubscription(u.subscription);
    setEditRole(u.role);
    setEditCredits(u.creditsRemaining);
  };

  const handleSaveSubscriberOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setUserDirectory(prev => prev.map(u => {
      if (u.id === editingUser.id) {
        return {
          ...u,
          name: editName,
          subscription: editSubscription,
          role: editRole,
          creditsRemaining: editCredits
        };
      }
      return u;
    }));

    // If editing currently logged in user
    if (editingUser.id === user.id) {
      onUpdateUser({
        ...user,
        name: editName,
        subscription: editSubscription,
        role: editRole,
        creditsRemaining: editCredits
      });
    }

    // Audit logs
    const newAudit: AuditLogEntry = {
      id: "A-" + Math.floor(500 + Math.random() * 500),
      adminUser: user.username,
      action: `Override settings for user @${editingUser.username}: Tier=${editSubscription}, Credits=${editCredits}`,
      timestamp: new Date().toLocaleString(),
      ipAddress: "114.122.45.18"
    };
    setAuditLogs(prev => [newAudit, ...prev]);

    onTriggerNotification("Subscriber Settings Overridden", `@${editingUser.username} manually modified by Super Admin.`);
    setEditingUser(null);
  };

  // Create Campaign Promo Code
  const handleCreatePromoCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;

    const code = newPromoCode.trim().toUpperCase();
    const newPromo: PromoCode = {
      code,
      discountPercent: newPromoDiscount,
      maxClaims: newPromoMax,
      activeClaims: 0,
      planUnlock: newPromoPlan.startsWith("Pro") ? "Pro" : newPromoPlan.startsWith("Team") ? "Team" : "Enterprise",
      status: "Active"
    };

    try {
      const res = await fetch("/api/promo-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPromo)
      });

      if (res.ok) {
        onUpdatePromoCodes(prev => [newPromo, ...prev]);

        // Audit logs
        const newAudit: AuditLogEntry = {
          id: "A-" + Math.floor(500 + Math.random() * 500),
          adminUser: user.username,
          action: `Created coupon code ${code} (${newPromoDiscount}% off ${newPromoPlan})`,
          timestamp: new Date().toLocaleString(),
          ipAddress: "114.122.45.18"
        };
        setAuditLogs(prev => [newAudit, ...prev]);

        onTriggerNotification("Promo Coupon Staged", `Promo code '${code}' is active for standard users.`);
        setNewPromoCode("");
        fetchMongoStatus();
      } else {
        throw new Error("HTTP error creating promo code");
      }
    } catch (err) {
      console.error(err);
      onTriggerNotification("Coupon Error", "Failed to sync coupon to database.");
    }
  };

  const handleTogglePromoStatus = async (code: string) => {
    const promo = promoCodes.find(p => p.code === code);
    if (!promo) return;
    const newStatus = promo.status === "Active" ? "Expired" : "Active";

    try {
      const res = await fetch(`/api/promo-codes/${code}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        onUpdatePromoCodes(prev => prev.map(p => {
          if (p.code === code) {
            return { ...p, status: newStatus };
          }
          return p;
        }));

        onTriggerNotification("Promo Status Updated", `Coupon state toggled.`);
        fetchMongoStatus();
      } else {
        throw new Error("HTTP error toggling promo code");
      }
    } catch (err) {
      console.error(err);
      onTriggerNotification("Coupon Update Error", "Failed to sync status change to database.");
    }
  };

  // Reply to customer support ticket
  const handleAdminTicketReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAdminTicketId || !adminTicketReplyText.trim()) return;

    const replyObj = {
      sender: "Admin",
      message: adminTicketReplyText.trim(),
      timestamp: new Date().toLocaleString()
    };

    try {
      const res = await fetch(`/api/tickets/${activeAdminTicketId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: replyObj })
      });

      if (res.ok) {
        // Update ticket in parent state
        onUpdateTickets(prev => prev.map(t => {
          if (t.id === activeAdminTicketId) {
            return {
              ...t,
              status: "Replied",
              replies: [...t.replies, replyObj]
            };
          }
          return t;
        }));

        // Also update ticket status to Replied
        await fetch(`/api/tickets/${activeAdminTicketId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Replied" })
        });

        setAdminTicketReplyText("");
        onTriggerNotification("Ticket Comment Staged", `Reply sent to customer ticket ${activeAdminTicketId}.`);
        fetchMongoStatus();
      } else {
        throw new Error("HTTP error replying to ticket");
      }
    } catch (err) {
      console.error(err);
      onTriggerNotification("Ticket Error", "Failed to sync reply comment to database.");
    }
  };

  const handleCloseTicket = async (tId: string) => {
    try {
      const res = await fetch(`/api/tickets/${tId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Closed" })
      });

      if (res.ok) {
        onUpdateTickets(prev => prev.map(t => {
          if (t.id === tId) {
            return { ...t, status: "Closed" };
          }
          return t;
        }));

        onTriggerNotification("Ticket Closed", `Support ticket ${tId} marked as successfully resolved.`);
        fetchMongoStatus();
      } else {
        throw new Error("HTTP error closing ticket");
      }
    } catch (err) {
      console.error(err);
      onTriggerNotification("Ticket Status Error", "Failed to close ticket in database.");
    }
  };

  // Command terminal engine
  const handleTerminalCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim();
    const parts = cmd.split(" ");
    const primaryCmd = parts[0].toLowerCase();
    const response = [`saas-cluster-node-1:~# ${cmd}`];

    switch (primaryCmd) {
      case "help":
        response.push(
          "Available Commands:",
          "  help                  - Displays operational system diagnostic manuals",
          "  status                - Probes load balancer routers, port registers, and cache heaps",
          "  reboot                - Cycles Node.js Express server.ts routes",
          "  approve [txId]        - Directly validates transaction and upgrades target account",
          "  reject [txId] [reason]- Cancels transaction proof",
          "  users                 - Lists all simulated subscriber directory accounts",
          "  clear                 - Standard clear terminal buffer command"
        );
        break;
      case "status":
        response.push(
          "Platform Clusters Telemetry Check:",
          "  - DB Connections       : 24 active pools (Drizzle/Postgres mirror)",
          "  - Memory Usage         : 184 MB / 1024 MB (V8 garbage collector nominal)",
          "  - Network Port         : 3000 Inbound Ingress (NGINX Proxy ONLINE)",
          "  - SSL Certification    : Let's Encrypt (valid, expires in 84 days)",
          "  - Node Environment     : production"
        );
        break;
      case "reboot":
        response.push(
          "Cycling Express routes...",
          "Compiling assets in dist/server.cjs via esbuild...",
          "Server re-bind complete on port 3000. Operational."
        );
        onTriggerNotification("Server Rebooted", "Simulated Express router rebooted.");
        break;
      case "users":
        response.push("Simulated Subscriber Directory Nodes:");
        userDirectory.forEach(u => {
          response.push(`  - @${u.username} (${u.email}) [Tier: ${u.subscription}] [Role: ${u.role}]`);
        });
        break;
      case "approve":
        const apId = parts[1]?.toUpperCase();
        if (!apId) {
          response.push("Error: Usage: approve [TX-ID]");
        } else {
          const matchedTx = transactions.find(t => t.id === apId);
          if (!matchedTx) {
            response.push(`Error: Transaction id ${apId} not indexed in billing records.`);
          } else {
            handleApprovePayment(apId);
            response.push(`Success: Approved manual receipt slip ${apId}.`);
          }
        }
        break;
      case "clear":
        setTerminalLogs(["saas-cluster-node-1:~# "]);
        setTerminalInput("");
        return;
      default:
        response.push(`Unknown command: '${primaryCmd}'. Type 'help' to review operational manuals.`);
    }

    setTerminalLogs(prev => [...prev, ...response, "saas-cluster-node-1:~# "]);
    setTerminalInput("");
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
  };

  // Filters
  const filteredAuditLogs = auditLogs.filter(l => 
    l.action.toLowerCase().includes(logSearch.toLowerCase()) || 
    l.adminUser.toLowerCase().includes(logSearch.toLowerCase())
  );

  const filteredUsers = userDirectory.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.username.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredFiles = globalFiles.filter(f => 
    f.name.toLowerCase().includes(fileSearch.toLowerCase()) ||
    (f.username && f.username.toLowerCase().includes(fileSearch.toLowerCase()))
  );

  const filteredPromos = promoCodes.filter(p => 
    p.code.toLowerCase().includes(promoSearch.toLowerCase()) ||
    p.planUnlock.toLowerCase().includes(promoSearch.toLowerCase())
  );

  const filteredTransactions = transactions.filter(tx => 
    tx.id.toLowerCase().includes(txSearch.toLowerCase()) ||
    tx.username.toLowerCase().includes(txSearch.toLowerCase()) ||
    tx.plan.toLowerCase().includes(txSearch.toLowerCase()) ||
    tx.paymentMethod.toLowerCase().includes(txSearch.toLowerCase())
  );

  const filteredTickets = tickets.filter(t => 
    t.id.toLowerCase().includes(ticketSearch.toLowerCase()) ||
    t.username.toLowerCase().includes(ticketSearch.toLowerCase()) ||
    t.subject.toLowerCase().includes(ticketSearch.toLowerCase()) ||
    t.category.toLowerCase().includes(ticketSearch.toLowerCase())
  );

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden font-sans shadow-2xl relative">
      
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-neutral-900 p-6 border-b border-neutral-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-950/40">
              <ShieldAlert className="w-6 h-6 animate-pulse text-indigo-100" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Operations Control Center 
                <span className="text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">SUPER ADMIN</span>
              </h2>
              <p className="text-xs text-neutral-300 mt-0.5">Primary SaaS utility suite dashboard, user registry, file locker, and interactive terminal diagnostic nodes.</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-neutral-400 font-mono block">Node Signature</span>
            <span className="text-xs text-indigo-400 font-bold font-mono">alltools_main_cluster</span>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex flex-wrap border-b border-neutral-800 bg-neutral-950/40 px-4">
        {[
          { id: "overview", label: "Overview & Revenue", icon: Activity },
          { id: "payments", label: `Manual Approvals (${pendingApprovalsCount})`, icon: DollarSign },
          { id: "users", label: "Subscriber Override", icon: Users },
          { id: "promo", label: "Coupon System", icon: Tag },
          { id: "tickets", label: `Support Tickets (${unresolvedTicketsCount})`, icon: MessageSquare },
          { id: "files", label: "Global Cloud Files", icon: HardDrive },
          { id: "terminal", label: "Interactive CLI", icon: Terminal },
          { id: "settings", label: "Core Gateway Prefs", icon: Settings },
          { id: "logs", label: "Security Audit Logs", icon: History }
        ].map(tab => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveAdminTicketId(null); setActiveTab(tab.id as any); }}
              className={`py-3.5 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${activeTab === tab.id ? "border-indigo-500 text-white bg-neutral-900/50" : "border-transparent text-neutral-400 hover:text-white"}`}
            >
              <TabIcon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="p-6">
        
        {/* OVERVIEW & DIAGNOSTICS */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            
            {/* SaaS Metrics cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-neutral-950/40 border border-neutral-800 rounded-xl p-4 space-y-1">
                <span className="text-[10px] font-bold text-neutral-500 uppercase font-mono">Total SaaS Revenue</span>
                <h3 className="text-xl font-bold text-emerald-400 font-mono">{formatRupiah(totalRevenue)}</h3>
                <p className="text-[9px] text-neutral-400">Sum of successful approved checks.</p>
              </div>

              <div className="bg-neutral-950/40 border border-neutral-800 rounded-xl p-4 space-y-1">
                <span className="text-[10px] font-bold text-neutral-500 uppercase font-mono">Pending Receipts</span>
                <h3 className="text-xl font-bold text-amber-500 font-mono">{pendingApprovalsCount} queue</h3>
                <p className="text-[9px] text-neutral-400">Awaiting manual administrator verify.</p>
              </div>

              <div className="bg-neutral-950/40 border border-neutral-800 rounded-xl p-4 space-y-1">
                <span className="text-[10px] font-bold text-neutral-500 uppercase font-mono">Active Premium Accounts</span>
                <h3 className="text-xl font-bold text-indigo-400 font-mono">{activeSubsCount} subscribers</h3>
                <p className="text-[9px] text-neutral-400">Pro, Team, or Enterprise accounts.</p>
              </div>

              <div className="bg-neutral-950/40 border border-neutral-800 rounded-xl p-4 space-y-1">
                <span className="text-[10px] font-bold text-neutral-500 uppercase font-mono">Open Customer Tickets</span>
                <h3 className="text-xl font-bold text-red-400 font-mono">{unresolvedTicketsCount} unresolved</h3>
                <p className="text-[9px] text-neutral-400">Requires review from the help desk.</p>
              </div>
            </div>

            {/* Custom SVG Performance Graph Analytics */}
            <div className="bg-neutral-950/50 border border-neutral-800 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-neutral-850 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-indigo-400" />
                    Live SaaS Performance Analytics
                  </h3>
                  <p className="text-xs text-neutral-500">Interactive telemetry logs mapped against system request execution thresholds.</p>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500" /> API Hits</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> CPU Load</span>
                </div>
              </div>

              {/* Graphic container */}
              <div className="h-44 w-full bg-neutral-950/80 rounded-xl border border-neutral-850/60 relative p-4 flex flex-col justify-between">
                {/* Simulated Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-10">
                  <div className="border-t border-neutral-300 w-full" />
                  <div className="border-t border-neutral-300 w-full" />
                  <div className="border-t border-neutral-300 w-full" />
                  <div className="border-t border-neutral-300 w-full" />
                </div>

                {/* SVG Graph Paths */}
                <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 500 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="indigoGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="emeraldGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Area beneath API hits */}
                  <path d="M 0 100 L 50 60 L 100 80 L 150 30 L 200 45 L 250 15 L 300 70 L 350 40 L 400 20 L 450 60 L 500 10 L 500 100 Z" fill="url(#indigoGlow)" />
                  {/* Line API Hits */}
                  <path d="M 0 100 L 50 60 L 100 80 L 150 30 L 200 45 L 250 15 L 300 70 L 350 40 L 400 20 L 450 60 L 500 10" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Line CPU Load */}
                  <path d="M 0 90 L 50 85 L 100 80 L 150 70 L 200 85 L 250 60 L 300 50 L 350 75 L 400 80 L 450 45 L 500 35" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
                </svg>

                {/* Vertical labels */}
                <div className="flex justify-between text-[9px] text-neutral-500 font-mono z-10 w-full mt-auto pt-2 border-t border-neutral-850/40">
                  <span>08:00</span>
                  <span>10:00</span>
                  <span>12:00</span>
                  <span>14:00</span>
                  <span>16:00</span>
                  <span>18:00</span>
                  <span>Current WIB</span>
                </div>
              </div>
            </div>

            {/* Quick action shortcuts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-950/30 border border-neutral-800 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Gateway Channels</h4>
                <p className="text-[11px] text-neutral-400">Current active payment paths: QRIS, Bank Transfer BCA, DANA, GoPay, OVO, ShopeePay. Click preferences to alter details.</p>
                <button onClick={() => setActiveTab("settings")} className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-[10px] font-bold cursor-pointer">
                  Configure Gateways
                </button>
              </div>

              <div className="p-4 bg-neutral-950/30 border border-neutral-800 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Unresolved Tickets Queue</h4>
                <p className="text-[11px] text-neutral-400">We have {unresolvedTicketsCount} customer issues active on the system helpdesk catalog.</p>
                <button onClick={() => setActiveTab("tickets")} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-bold cursor-pointer">
                  Answering Console
                </button>
              </div>
            </div>

            {/* MongoDB Connection Status and Live Stats Card */}
            <div className="p-5 bg-neutral-950/60 border border-neutral-800 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-green-500/10 text-green-400 rounded-lg">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      MongoDB Connection Status Console
                    </h4>
                    <p className="text-xs text-neutral-500">Live synchronization statistics with MongoDB Atlas cloud clusters.</p>
                  </div>
                </div>

                <button 
                  onClick={handleManualMongoRefresh}
                  disabled={refreshingMongo}
                  className="p-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white cursor-pointer transition-colors flex items-center justify-center disabled:opacity-50"
                  title="Force DB state refresh"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshingMongo ? "animate-spin" : ""}`} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left: Connection indicators */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center justify-between p-3 bg-neutral-900/40 rounded-xl border border-neutral-850">
                    <span className="text-[11px] font-semibold text-neutral-400">Cluster Status:</span>
                    {mongoStatus?.connected ? (
                      <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-emerald-500/15 text-emerald-400 flex items-center gap-1 font-mono uppercase">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                        Online
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-red-500/15 text-red-400 flex items-center gap-1 font-mono uppercase">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                        Offline (Local Fallback)
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-neutral-500 uppercase font-mono tracking-wider">ConnectionString Endpoint</span>
                    <div className="p-2 bg-neutral-900/60 rounded-lg border border-neutral-850 font-mono text-[10px] text-neutral-300 break-all select-all">
                      {mongoStatus?.uri || "mongodb+srv://alltools:****@alltools.g306a9o.mongodb.net/?appName=Cluster0"}
                    </div>
                  </div>

                  {mongoStatus?.error && (
                    <div className="p-2.5 bg-red-500/5 border border-red-900/50 rounded-lg text-[10px] text-red-400 space-y-1">
                      <div className="font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-red-500" /> Connection Alert:
                      </div>
                      <p className="font-mono leading-relaxed">{mongoStatus.error}</p>
                    </div>
                  )}
                </div>

                {/* Right: Counters */}
                <div className="lg:col-span-7 space-y-3">
                  <span className="text-[9px] font-bold text-neutral-500 uppercase font-mono tracking-wider block">Live Cloud Collections Counter</span>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                    {[
                      { label: "Shortened URLs", count: mongoStatus?.stats?.urls ?? 0, col: "bg-indigo-500/10 text-indigo-400 border-indigo-500/10" },
                      { label: "Temp Mailboxes", count: mongoStatus?.stats?.temp_mails ?? 0, col: "bg-purple-500/10 text-purple-400 border-purple-500/10" },
                      { label: "SaaS Gateways", count: mongoStatus?.connected ? 1 : 0, col: "bg-amber-500/10 text-amber-400 border-amber-500/10" },
                      { label: "Promo Coupons", count: mongoStatus?.stats?.promo_codes ?? 0, col: "bg-emerald-500/10 text-emerald-400 border-emerald-500/10" },
                      { label: "Approved Revenue", count: mongoStatus?.stats?.transactions ?? 0, col: "bg-blue-500/10 text-blue-400 border-blue-500/10" },
                      { label: "Support Tickets", count: mongoStatus?.stats?.tickets ?? 0, col: "bg-rose-500/10 text-rose-400 border-rose-500/10" }
                    ].map((item, idx) => (
                      <div key={idx} className={`p-2.5 rounded-xl border ${item.col} flex flex-col justify-between h-16`}>
                        <span className="text-[9px] font-bold opacity-80 leading-tight">{item.label}</span>
                        <span className="text-lg font-black font-mono self-end">{mongoStatus?.connected ? item.count : "N/A"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>


          </div>
        )}

        {/* TAB 2: MANUAL PAYMENT APPROVALS & HISTORY */}
        {activeTab === "payments" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Manual Payment Verification Center</h3>
                <p className="text-xs text-neutral-400">Verify user uploaded transfer receipts and validate premium access triggers.</p>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-neutral-600" />
                <input
                  type="text"
                  placeholder="Search receipt logs..."
                  value={txSearch}
                  onChange={(e) => setTxSearch(e.target.value)}
                  className="bg-neutral-950 border border-neutral-850 rounded px-8 py-1.5 text-xs text-white placeholder-neutral-700 focus:outline-none"
                />
              </div>
            </div>

            {/* List queue table */}
            <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950/20">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 font-mono text-[10px] uppercase">
                    <th className="p-3">User</th>
                    <th className="p-3">Plan Request</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Uploaded Date</th>
                    <th className="p-3 text-center">Receipt Slip</th>
                    <th className="p-3 text-right">Verification Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-850 text-neutral-300">
                  {filteredTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-neutral-900/30">
                      <td className="p-3">
                        <div className="font-bold text-white">@{tx.username}</div>
                        <div className="text-[10px] text-neutral-500 font-mono">{tx.email}</div>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-white">{tx.plan}</span>
                      </td>
                      <td className="p-3 font-mono text-indigo-300">{tx.paymentMethod}</td>
                      <td className="p-3 font-mono font-bold text-white">{formatRupiah(tx.amount)}</td>
                      <td className="p-3 font-mono text-neutral-400">{tx.date}</td>
                      <td className="p-3 text-center">
                        {tx.proofImage ? (
                          <button
                            onClick={() => setPreviewingReceiptUrl(tx.proofImage || null)}
                            className="px-2.5 py-1 bg-neutral-950 hover:bg-neutral-900 rounded border border-neutral-850 text-[10px] font-bold text-indigo-400 cursor-pointer flex items-center gap-1 mx-auto"
                          >
                            <Image className="w-3.5 h-3.5" /> Preview Slip
                          </button>
                        ) : (
                          <span className="text-neutral-600">-</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {tx.status === "Pending" ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleApprovePayment(tx.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => setRejectionInputId(tx.id)}
                              className="px-2.5 py-1 bg-red-950/80 hover:bg-red-900 text-red-400 font-bold rounded cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            tx.status === "Successful" ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/40" :
                            "bg-red-950/40 text-red-400 border border-red-900/40"
                          }`}>
                            {tx.status.toUpperCase()}
                          </span>
                        )}

                        {/* REJECTION INPUT MODAL */}
                        {rejectionInputId === tx.id && (
                          <div className="mt-2 text-left bg-neutral-950 p-3 rounded-lg border border-neutral-800 space-y-2">
                            <label className="text-[10px] text-neutral-400 font-bold block">Enter Rejection Reason:</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Blurry photo / Fake receipt slip details"
                              value={rejectionReasonText}
                              onChange={(e) => setRejectionReasonText(e.target.value)}
                              className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-xs text-white focus:outline-none w-full"
                            />
                            <div className="flex gap-1.5 justify-end">
                              <button
                                onClick={() => setRejectionInputId(null)}
                                className="px-2 py-0.5 bg-neutral-800 rounded text-[9px]"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleRejectPayment(tx.id)}
                                className="px-2 py-0.5 bg-red-600 text-white rounded text-[9px] font-bold"
                              >
                                Submit Rejection
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-neutral-600">No transaction records match search filter.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* SLIP PREVIEW MODAL LIGHTBOX */}
            {previewingReceiptUrl && (
              <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                <div className="bg-neutral-950 border border-neutral-800 rounded-2xl max-w-sm w-full overflow-hidden p-4 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-850">
                    <h4 className="text-xs font-mono font-bold text-white">Manual Slip Image Inspection</h4>
                    <button onClick={() => setPreviewingReceiptUrl(null)} className="text-neutral-500 hover:text-white text-xs">Close</button>
                  </div>
                  <img
                    src={previewingReceiptUrl}
                    alt="Receipt Slip Proof"
                    className="w-full h-80 object-contain bg-neutral-900 rounded-lg border border-neutral-800"
                  />
                  <button
                    onClick={() => setPreviewingReceiptUrl(null)}
                    className="w-full py-1.5 bg-neutral-900 hover:bg-neutral-800 text-xs font-semibold text-white rounded"
                  >
                    Finish Review
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: USER ACCOUNT OVERRIDES */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Subscriber Management & Overrides</h3>
                <p className="text-xs text-neutral-400">Directly override user subscription tiers and credit allocations manually.</p>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-neutral-600" />
                <input
                  type="text"
                  placeholder="Search user profile indexes..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="bg-neutral-950 border border-neutral-850 rounded px-8 py-1.5 text-xs text-white placeholder-neutral-700 focus:outline-none"
                />
              </div>
            </div>

            {/* IF EDITING SUBSCRIBER */}
            {editingUser && (
              <form onSubmit={handleSaveSubscriberOverride} className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-4 max-w-md">
                <div className="pb-2 border-b border-neutral-850">
                  <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase">override properties</span>
                  <h4 className="text-xs font-bold text-white uppercase">Editing @{editingUser.username}</h4>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-neutral-300">
                  <div className="space-y-1">
                    <label>Display Name</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-white focus:outline-none w-full"
                    />
                  </div>

                  <div className="space-y-1">
                    <label>Remaining Credits</label>
                    <input
                      type="number"
                      required
                      value={editCredits}
                      onChange={(e) => setEditCredits(parseInt(e.target.value) || 0)}
                      className="bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-white focus:outline-none w-full font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label>Subscription Tier</label>
                    <select
                      value={editSubscription}
                      onChange={(e) => setEditSubscription(e.target.value as any)}
                      className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1.5 text-white outline-none w-full"
                    >
                      <option value="Free">Free</option>
                      <option value="Pro">Pro</option>
                      <option value="Team">Team</option>
                      <option value="Enterprise">Enterprise</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label>System Role Access</label>
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value as any)}
                      className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1.5 text-white outline-none w-full"
                    >
                      <option value="User">User</option>
                      <option value="Developer">Developer</option>
                      <option value="Super Admin">Super Admin</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-3 py-1 bg-neutral-900 text-neutral-400 rounded text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded"
                  >
                    Save Override
                  </button>
                </div>
              </form>
            )}

            {/* Subscriber Index lists */}
            <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950/20">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 font-mono text-[10px] uppercase">
                    <th className="p-3">User Node</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3 font-mono">Subscription</th>
                    <th className="p-3 font-mono">Credits</th>
                    <th className="p-3 font-mono">Role</th>
                    <th className="p-3">Join Date</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-850 text-neutral-300">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-neutral-900/30">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <img src={u.avatar} alt="Avatar" className="w-6 h-6 rounded-full" />
                          <div>
                            <span className="font-bold text-white">@{u.username}</span>
                            <span className="text-[10px] text-neutral-500 block">{u.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3 font-mono">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          u.subscription === "Free" ? "bg-neutral-900 text-neutral-500" : "bg-indigo-950 text-indigo-400 border border-indigo-900/40"
                        }`}>
                          {u.subscription.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-semibold text-emerald-400">{u.creditsRemaining.toLocaleString()}</td>
                      <td className="p-3 font-mono text-neutral-400">{u.role}</td>
                      <td className="p-3 font-mono text-neutral-400">{u.joinedDate}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleEditSubscriber(u)}
                          className="px-2.5 py-1 bg-neutral-950 hover:bg-neutral-900 text-[10px] font-bold text-indigo-400 rounded border border-neutral-850 cursor-pointer"
                        >
                          Modify Sub
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 4: CAMPAIGN COUOPN SYSTEM */}
        {activeTab === "promo" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Campaign Promotional Coupon Manager</h3>
                <p className="text-xs text-neutral-400">Generate discount coupon codes to reduce checkout billing costs.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Promo Generator Form */}
              <div className="md:col-span-1">
                <form onSubmit={handleCreatePromoCode} className="bg-neutral-950/60 border border-neutral-800 p-4 rounded-xl space-y-4">
                  <span className="text-[10px] font-bold text-indigo-400 font-mono uppercase">Add Coupon Campaign</span>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] text-neutral-400">Promo Code String</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. LAUNCHPRO"
                      value={newPromoCode}
                      onChange={(e) => setNewPromoCode(e.target.value)}
                      className="bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white uppercase focus:outline-none w-full font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-400">Discount %</label>
                      <input
                        type="number"
                        required
                        min={1}
                        max={100}
                        value={newPromoDiscount}
                        onChange={(e) => setNewPromoDiscount(parseInt(e.target.value) || 10)}
                        className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1.5 text-white focus:outline-none w-full"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-400">Max Usage Claims</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={newPromoMax}
                        onChange={(e) => setNewPromoMax(parseInt(e.target.value) || 100)}
                        className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1.5 text-white focus:outline-none w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-neutral-400">Target Plan Package</label>
                    <select
                      value={newPromoPlan}
                      onChange={(e) => setNewPromoPlan(e.target.value as any)}
                      className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1.5 text-white outline-none w-full text-xs"
                    >
                      <option value="Pro (Monthly)">Pro (Monthly)</option>
                      <option value="Pro (Yearly)">Pro (Yearly)</option>
                      <option value="Team">Team</option>
                      <option value="Enterprise">Enterprise</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 font-bold text-white text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Stage Promo Campaign
                  </button>
                </form>
              </div>

              {/* Promo List */}
              <div className="md:col-span-2 space-y-3">
                <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950/20">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 font-mono text-[10px] uppercase">
                        <th className="p-3">Coupon Code</th>
                        <th className="p-3">Discount</th>
                        <th className="p-3 font-mono">Unlock Target</th>
                        <th className="p-3 font-mono">Claims Index</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-850 text-neutral-300 font-mono">
                      {filteredPromos.map((p, i) => (
                        <tr key={i} className="hover:bg-neutral-900/30">
                          <td className="p-3 font-bold text-white">{p.code}</td>
                          <td className="p-3 text-emerald-400">{p.discountPercent}% OFF</td>
                          <td className="p-3 text-indigo-300 font-sans">{p.planUnlock}</td>
                          <td className="p-3 text-neutral-400">{p.activeClaims} / {p.maxClaims} used</td>
                          <td className="p-3">
                            <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${
                              p.status === "Active" ? "bg-emerald-950 text-emerald-400 border border-emerald-900/40" : "bg-neutral-900 text-neutral-500"
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleTogglePromoStatus(p.code)}
                              className="px-2 py-0.5 bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 text-[10px] rounded text-neutral-400 hover:text-white"
                            >
                              Toggle
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: HELP TICKETS DESK */}
        {activeTab === "tickets" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Customer Help Desk (Support Tickets)</h3>
                <p className="text-xs text-neutral-400">Manage user complaints, technical bug reports, and submit replies directly.</p>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-neutral-600" />
                <input
                  type="text"
                  placeholder="Search user complaints..."
                  value={ticketSearch}
                  onChange={(e) => setTicketSearch(e.target.value)}
                  className="bg-neutral-950 border border-neutral-850 rounded px-8 py-1.5 text-xs text-white placeholder-neutral-700 focus:outline-none"
                />
              </div>
            </div>

            {/* IF COMPLAINT CHAT ROOM OPEN */}
            {activeAdminTicketId && activeTicket ? (
              <div className="space-y-4 bg-neutral-950 border border-neutral-800 p-4 rounded-xl">
                <div className="flex justify-between items-center border-b border-neutral-850 pb-2">
                  <div>
                    <span className="text-[10px] text-neutral-500 font-mono">TICKET: {activeTicket.id}</span>
                    <h4 className="text-xs font-bold text-white uppercase">User complaint: {activeTicket.subject}</h4>
                  </div>
                  <button
                    onClick={() => setActiveAdminTicketId(null)}
                    className="text-[10px] font-bold text-neutral-400 hover:text-white font-mono bg-neutral-900 px-2 py-1 rounded"
                  >
                    Back to Helpdesk Grid
                  </button>
                </div>

                <div className="space-y-3 max-h-[250px] overflow-y-auto">
                  {/* Original Complaint */}
                  <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between text-[9px] text-neutral-500 font-mono">
                      <span>Sender: @{activeTicket.username}</span>
                      <span>{activeTicket.createdAt}</span>
                    </div>
                    <p className="text-white whitespace-pre-wrap">{activeTicket.message}</p>
                    {activeTicket.screenshot && (
                      <div className="mt-2">
                        <span className="text-[9px] font-mono text-neutral-500 block">Screenshot Attachment:</span>
                        <img src={activeTicket.screenshot} alt="Screenshot attachment" className="w-36 h-24 object-cover bg-neutral-950 rounded border border-neutral-800 cursor-zoom-in" />
                      </div>
                    )}
                  </div>

                  {/* Reply timeline */}
                  {activeTicket.replies.map((rep, index) => (
                    <div key={index} className={`p-3 rounded-lg text-xs space-y-1 ${rep.sender === "Admin" ? "bg-indigo-950/40 border border-indigo-900/30 ml-6" : "bg-neutral-900 border border-neutral-800 mr-6"}`}>
                      <div className="flex justify-between font-mono text-[9px] text-neutral-500">
                        <span className={rep.sender === "Admin" ? "text-indigo-400 font-bold" : ""}>{rep.sender === "Admin" ? "👑 Super Admin (You)" : `@${activeTicket.username}`}</span>
                        <span>{rep.timestamp}</span>
                      </div>
                      <p className="text-white whitespace-pre-wrap">{rep.message}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                <form onSubmit={handleAdminTicketReply} className="flex gap-2 border-t border-neutral-850 pt-3">
                  <input
                    type="text"
                    required
                    placeholder="Type administrative reply comment..."
                    value={adminTicketReplyText}
                    onChange={(e) => setAdminTicketReplyText(e.target.value)}
                    className="bg-neutral-900 border border-neutral-850 rounded px-3 py-1.5 text-xs text-white focus:outline-none w-full"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white rounded-lg flex items-center gap-1 shrink-0"
                  >
                    Send Reply <Send className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCloseTicket(activeTicket.id)}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-xs text-red-400 font-bold rounded"
                  >
                    Close Ticket
                  </button>
                </form>
              </div>
            ) : (
              <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950/20">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 font-mono text-[10px] uppercase">
                      <th className="p-3">Ticket ID</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">User</th>
                      <th className="p-3">Priority</th>
                      <th className="p-3">Created</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-850 text-neutral-300">
                    {filteredTickets.map(t => (
                      <tr key={t.id} className="hover:bg-neutral-900/30">
                        <td className="p-3 font-mono font-bold text-white">{t.id}</td>
                        <td className="p-3 text-indigo-300">{t.category}</td>
                        <td className="p-3 font-medium text-white truncate max-w-xs">{t.subject}</td>
                        <td className="p-3">@{t.username}</td>
                        <td className="p-3 font-mono">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                            t.priority === "Urgent" ? "bg-red-950/80 text-red-400 border border-red-900/40" :
                            t.priority === "High" ? "bg-amber-950/80 text-amber-400 border border-amber-900/40" :
                            "bg-neutral-900 text-neutral-400 border border-neutral-800"
                          }`}>
                            {t.priority}
                          </span>
                        </td>
                        <td className="p-3 text-neutral-400 font-mono text-[10px]">{t.createdAt}</td>
                        <td className="p-3">
                          <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${
                            t.status === "Closed" ? "bg-neutral-900 text-neutral-500" :
                            t.status === "Replied" ? "bg-indigo-950 text-indigo-400 border border-indigo-900/40" :
                            "bg-emerald-950 text-emerald-400 border border-emerald-900/40"
                          }`}>
                            {t.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setActiveAdminTicketId(t.id)}
                            className="px-2.5 py-1 bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 text-[10px] text-indigo-400 font-bold rounded cursor-pointer"
                          >
                            Open Desk
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredTickets.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-6 text-center text-neutral-600">No active customer tickets recorded.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: GLOBAL FILE LOCKER */}
        {activeTab === "files" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Global Cloud File Locker</h3>
                <p className="text-xs text-neutral-400">Administrative view of every active cloud locker file registered across All Tools.</p>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-neutral-600" />
                <input
                  type="text"
                  placeholder="Search file name, owner..."
                  value={fileSearch}
                  onChange={(e) => setFileSearch(e.target.value)}
                  className="bg-neutral-950 border border-neutral-850 rounded px-8 py-1.5 text-xs text-white placeholder-neutral-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950/20">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 font-mono text-[10px] uppercase">
                    <th className="p-3">File Name</th>
                    <th className="p-3">Owner</th>
                    <th className="p-3 font-mono">Locker Folder</th>
                    <th className="p-3 font-mono">Capacity</th>
                    <th className="p-3">Staged Date</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-850 text-neutral-300">
                  {filteredFiles.map(f => (
                    <tr key={f.id} className="hover:bg-neutral-900/30">
                      <td className="p-3 font-semibold text-white truncate max-w-xs">{f.name}</td>
                      <td className="p-3">@{f.username || "anonymous"}</td>
                      <td className="p-3 text-indigo-300 font-mono">{f.folder}</td>
                      <td className="p-3 font-mono text-neutral-400">{(f.size / 1024).toFixed(1)} KB</td>
                      <td className="p-3 font-mono text-neutral-400">{f.uploadedAt}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setGlobalFiles(prev => prev.filter(item => item.id !== f.id));
                            onTriggerNotification("File Purged", `File ${f.name} permanently shredded.`);
                          }}
                          className="p-1 rounded text-neutral-400 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: INTERACTIVE TERMINAL CLI */}
        {activeTab === "terminal" && (
          <div className="space-y-4">
            <div className="border-b border-neutral-800 pb-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Simulated Cluster Terminal Console</h3>
              <p className="text-xs text-neutral-400">Admin CLI interface to reboot services, cycle routers, approve transaction queues, and inspect database tables.</p>
            </div>

            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 font-mono text-xs text-neutral-300 space-y-2 h-80 overflow-y-auto">
              <div className="space-y-1">
                {terminalLogs.map((log, i) => (
                  <p key={i} className="whitespace-pre-wrap leading-relaxed">{log}</p>
                ))}
                <div ref={terminalBottomRef} />
              </div>
            </div>

            <form onSubmit={handleTerminalCommand} className="flex gap-2">
              <span className="font-mono text-xs text-indigo-400 self-center">saas-cluster-node-1:~# </span>
              <input
                type="text"
                placeholder="Type command (e.g. 'help', 'status', 'reboot', 'approve [ID]')..."
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-indigo-300 focus:outline-none w-full font-mono placeholder-indigo-950"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded text-xs text-white font-mono"
              >
                Execute
              </button>
            </form>
          </div>
        )}

        {/* TAB 8: SYSTEM CORE & GATEWAY PREFERENCES */}
        {activeTab === "settings" && (
          <form onSubmit={handleSaveSaaSSettings} className="space-y-6">
            <div className="border-b border-neutral-800 pb-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">SaaS Core & Gateway Configurator</h3>
              <p className="text-xs text-neutral-400">Directly modify bank credentials, QRIS assets, Telegram support handles, and pricing configurations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-neutral-300">
              
              {/* QRIS Config */}
              <div className="bg-neutral-950 p-4 border border-neutral-800 rounded-xl space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-850">
                  <span className="font-mono text-indigo-400 font-bold uppercase text-[9px]">🇮🇩 Indonesian QRIS Channel</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={qrisActive} onChange={(e) => setQrisActive(e.target.checked)} className="rounded text-indigo-600 focus:ring-0" />
                    <span className="font-bold">Active</span>
                  </label>
                </div>

                <div className="space-y-1">
                  <label>QRIS Base64 / Image Node URL</label>
                  <input type="text" value={qrisImage} onChange={(e) => setQrisImage(e.target.value)} className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1.5 text-white w-full focus:outline-none font-mono" />
                </div>

                <div className="space-y-1">
                  <label>Instructions Description</label>
                  <textarea rows={2} value={qrisInstructions} onChange={(e) => setQrisInstructions(e.target.value)} className="bg-neutral-900 border border-neutral-800 rounded p-2 text-white w-full focus:outline-none" />
                </div>
              </div>

              {/* Bank Transfer Config */}
              <div className="bg-neutral-950 p-4 border border-neutral-800 rounded-xl space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-850">
                  <span className="font-mono text-indigo-400 font-bold uppercase text-[9px]">🇮🇩 Bank Transfer Channel</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={bankActive} onChange={(e) => setBankActive(e.target.checked)} className="rounded text-indigo-600 focus:ring-0" />
                    <span className="font-bold">Active</span>
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label>Bank Name</label>
                    <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-white w-full focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label>Account Number</label>
                    <input type="text" value={bankAccountNumber} onChange={(e) => setBankAccountNumber(e.target.value)} className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-white w-full focus:outline-none font-mono" />
                  </div>
                  <div className="space-y-1">
                    <label>Account Owner</label>
                    <input type="text" value={bankAccountName} onChange={(e) => setBankAccountName(e.target.value)} className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-white w-full focus:outline-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label>Transfer Guidelines</label>
                  <textarea rows={2} value={bankInstructions} onChange={(e) => setBankInstructions(e.target.value)} className="bg-neutral-900 border border-neutral-800 rounded p-2 text-white w-full focus:outline-none" />
                </div>
              </div>

              {/* Indonesian E-Wallets Config */}
              <div className="bg-neutral-950 p-4 border border-neutral-800 rounded-xl space-y-3 md:col-span-2">
                <span className="font-mono text-indigo-400 font-bold uppercase text-[9px] block border-b border-neutral-850 pb-1.5">🇮🇩 Indonesian E-Wallet Registrations</span>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-neutral-900/40 rounded-lg space-y-2 border border-neutral-850">
                    <h5 className="font-bold text-white uppercase text-[10px]">DANA wallet</h5>
                    <div className="space-y-1.5">
                      <input type="text" placeholder="Phone Number" value={danaPhone} onChange={(e) => setDanaPhone(e.target.value)} className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-white w-full font-mono text-[11px]" />
                      <input type="text" placeholder="Name" value={danaName} onChange={(e) => setDanaName(e.target.value)} className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-white w-full text-[11px]" />
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-900/40 rounded-lg space-y-2 border border-neutral-850">
                    <h5 className="font-bold text-white uppercase text-[10px]">GoPay wallet</h5>
                    <div className="space-y-1.5">
                      <input type="text" placeholder="Phone Number" value={gopayPhone} onChange={(e) => setGopayPhone(e.target.value)} className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-white w-full font-mono text-[11px]" />
                      <input type="text" placeholder="Name" value={gopayName} onChange={(e) => setGopayName(e.target.value)} className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-white w-full text-[11px]" />
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-900/40 rounded-lg space-y-2 border border-neutral-850">
                    <h5 className="font-bold text-white uppercase text-[10px]">OVO wallet</h5>
                    <div className="space-y-1.5">
                      <input type="text" placeholder="Phone Number" value={ovoPhone} onChange={(e) => setOvoPhone(e.target.value)} className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-white w-full font-mono text-[11px]" />
                      <input type="text" placeholder="Name" value={ovoName} onChange={(e) => setOvoName(e.target.value)} className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-white w-full text-[11px]" />
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-900/40 rounded-lg space-y-2 border border-neutral-850">
                    <h5 className="font-bold text-white uppercase text-[10px]">ShopeePay wallet</h5>
                    <div className="space-y-1.5">
                      <input type="text" placeholder="Phone Number" value={shopeepayPhone} onChange={(e) => setShopeepayPhone(e.target.value)} className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-white w-full font-mono text-[11px]" />
                      <input type="text" placeholder="Name" value={shopeepayName} onChange={(e) => setShopeepayName(e.target.value)} className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-white w-full text-[11px]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Telegram Support desk Config */}
              <div className="bg-neutral-950 p-4 border border-neutral-800 rounded-xl space-y-3 md:col-span-2">
                <span className="font-mono text-indigo-400 font-bold uppercase text-[9px] block border-b border-neutral-850 pb-1.5">💬 Telegram Official Customer Desk Integration</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label>Telegram Handle Username (@)</label>
                    <input type="text" value={telegramUsername} onChange={(e) => setTelegramUsername(e.target.value)} className="bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-white w-full focus:outline-none font-mono" />
                  </div>
                  <div className="space-y-1.5">
                    <label>Customer Desk Active Support Hours</label>
                    <input type="text" value={supportHours} onChange={(e) => setSupportHours(e.target.value)} className="bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-white w-full focus:outline-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label>Standard Autoreply / Offline Greeting Template Message</label>
                  <textarea rows={2} value={autoReplyMessage} onChange={(e) => setAutoReplyMessage(e.target.value)} className="bg-neutral-900 border border-neutral-800 rounded p-2 text-white w-full focus:outline-none" />
                </div>
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 font-bold text-white text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer"
            >
              <Save className="w-4 h-4" /> {loading ? "Updating SaaS values..." : "Commit Gateway Preferences"}
            </button>
          </form>
        )}

        {/* TAB 9: SECURITY AUDIT LOGS */}
        {activeTab === "logs" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Platform Security Audit Logs</h3>
                <p className="text-xs text-neutral-400">Strict chronological trail cataloging administrative actions, credit allocations, and receipt overrides.</p>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-neutral-600" />
                <input
                  type="text"
                  placeholder="Search action logs..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className="bg-neutral-950 border border-neutral-850 rounded px-8 py-1.5 text-xs text-white placeholder-neutral-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {filteredAuditLogs.map(item => (
                <div key={item.id} className="p-3 bg-neutral-950 border border-neutral-850 rounded-lg flex items-center justify-between gap-3 font-mono text-[11px] hover:bg-neutral-900/20">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-500">{item.timestamp}</span>
                      <span className="px-1.5 py-0.2 bg-indigo-950/40 text-indigo-400 rounded text-[9px] font-bold">
                        {item.adminUser}
                      </span>
                    </div>
                    <p className="text-white font-sans">{item.action}</p>
                  </div>

                  <span className="text-neutral-500 text-[10px] shrink-0">IP: {item.ipAddress}</span>
                </div>
              ))}
              {filteredAuditLogs.length === 0 && <p className="text-center text-xs text-neutral-600 py-6">No matching logs indexed.</p>}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
