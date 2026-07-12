export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  country: string;
  language: string;
  timezone: string;
  subscription: "Free" | "Pro" | "Team" | "Enterprise";
  creditsRemaining: number;
  apiKeys: string[];
  referralCode: string;
  referralsCount: number;
  joinedDate: string;
  role?: "Super Admin" | "Admin" | "Moderator" | "Developer" | "User";
}

export interface UserPreferences {
  darkMode: boolean;
  notificationPreferences: {
    emails: boolean;
    inApp: boolean;
    alerts: boolean;
  };
  defaultFileFormat: string;
}

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  icon: string; // Name of Lucide icon to load dynamically
  category: "AI" | "PDF" | "Image" | "Video" | "Developer" | "Temp Mail" | "URL" | "Calculator" | "Utilities" | "Audio" | "QR Code" | "File" | "Text" | "Security";
  usageCount: number;
  trending?: boolean;
  new?: boolean;
}

export interface TempMailMessage {
  id: string;
  from: string;
  subject: string;
  body: string;
  timestamp: string;
}

export interface CloudFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  folder?: string;
  shareLink?: string;
  passwordProtected?: boolean;
}

export interface ActionHistory {
  id: string;
  timestamp: string;
  toolId: string;
  toolName: string;
  actionSummary: string;
  resultExcerpt?: string;
}

export interface FavoriteItem {
  id: string;
  toolId: string;
  collectionName?: string;
}

export interface PaymentTransaction {
  id: string;
  username: string;
  email: string;
  plan: "Pro (Monthly)" | "Pro (Yearly)" | "Team" | "Enterprise";
  amount: number;
  paymentMethod: string;
  date: string;
  proofImage: string;
  status: "Pending" | "Successful" | "Rejected" | "Expired";
  rejectionReason?: string;
}

export interface SupportTicket {
  id: string;
  username: string;
  category: "Payment problem" | "Account issue" | "Tool error" | "Bug report" | "Suggestion";
  subject: string;
  message: string;
  screenshot?: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Open" | "Replied" | "Closed";
  createdAt: string;
  replies: Array<{
    sender: "User" | "Admin";
    message: string;
    timestamp: string;
  }>;
}

export interface AdminSaaSSettings {
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankInstructions: string;
  bankActive: boolean;

  danaName: string;
  danaPhone: string;
  danaActive: boolean;

  gopayName: string;
  gopayPhone: string;
  gopayActive: boolean;

  ovoName: string;
  ovoPhone: string;
  ovoActive: boolean;

  shopeepayName: string;
  shopeepayPhone: string;
  shopeepayActive: boolean;

  qrisImage: string;
  qrisInstructions: string;
  qrisActive: boolean;

  telegramUsername: string;
  supportEmail: string;
  supportHours: string;
  autoReplyMessage: string;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  maxClaims: number;
  activeClaims: number;
  planUnlock: "Pro" | "Team" | "Enterprise";
  status: "Active" | "Expired";
}
