import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory fallback databases
const urlDatabase = new Map<string, string>();
const mailDatabase = new Map<string, Array<{
  id: string;
  from: string;
  subject: string;
  body: string;
  timestamp: string;
}>>();

// MongoDB setup
const rawUri = process.env.MONGODB_URI || "mongodb+srv://alltools:<Kasepp12>@alltools.g306a9o.mongodb.net/?appName=Cluster0";
// Clean brackets around <Kasepp12> if present
const cleanedUri = rawUri.replace("<Kasepp12>", "Kasepp12");

let mongoClient: MongoClient | null = null;
let db: Db | null = null;
let dbStatus = {
  connected: false,
  error: null as string | null,
  uri: cleanedUri.replace(/:([^@]+)@/, ":****@"), // Mask password for client exposure
  appName: "Cluster0",
  source: process.env.MONGODB_URI ? "env" : "default"
};

async function seedDefaults() {
  if (!db) return;
  try {
    const settingsCol = db.collection("saas_settings");
    const countSettings = await settingsCol.countDocuments();
    if (countSettings === 0) {
      await settingsCol.insertOne({
        _id: "current_settings" as any,
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
      console.log("[MongoDB] Seeded default SaaS settings.");
    }

    const promoCol = db.collection("promo_codes");
    const countPromo = await promoCol.countDocuments();
    if (countPromo === 0) {
      await promoCol.insertMany([
        { code: "CHENWAVE99", discountPercent: 99, maxClaims: 100, activeClaims: 42, planUnlock: "Pro", status: "Active" },
        { code: "LAUNCHPRO", discountPercent: 50, maxClaims: 500, activeClaims: 218, planUnlock: "Pro", status: "Active" },
        { code: "TEAMPOWER", discountPercent: 30, maxClaims: 50, activeClaims: 49, planUnlock: "Team", status: "Active" },
        { code: "FREEPASS", discountPercent: 100, maxClaims: 10, activeClaims: 10, planUnlock: "Enterprise", status: "Expired" }
      ]);
      console.log("[MongoDB] Seeded default promo codes.");
    }

    const txCol = db.collection("transactions");
    const countTx = await txCol.countDocuments();
    if (countTx === 0) {
      await txCol.insertMany([
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
      console.log("[MongoDB] Seeded default transactions.");
    }

    const ticketCol = db.collection("tickets");
    const countTickets = await ticketCol.countDocuments();
    if (countTickets === 0) {
      await ticketCol.insertMany([
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
      console.log("[MongoDB] Seeded default support tickets.");
    }
  } catch (error) {
    console.error("[MongoDB] Seed defaults error:", error);
  }
}

async function connectToMongo() {
  try {
    console.log(`[MongoDB] Connecting to database...`);
    mongoClient = new MongoClient(cleanedUri, {
      connectTimeoutMS: 10000,
      socketTimeoutMS: 10000,
    });
    await mongoClient.connect();
    db = mongoClient.db("alltools_db");
    dbStatus.connected = true;
    dbStatus.error = null;
    console.log("[MongoDB] Connected successfully to 'alltools_db'");
    await seedDefaults();
  } catch (err: any) {
    console.error("[MongoDB] Connection failed:", err.message);
    dbStatus.connected = false;
    
    let friendlyError = err.message;
    if (err.message.includes("tlsv1 alert internal error") || err.message.includes("alert number 80") || err.message.includes("SSL routines")) {
      friendlyError = "MongoDB Atlas IP Whitelist Blocked: Koneksi ditolak karena IP sandbox AI Studio belum di-whitelist di MongoDB Atlas Anda. Solusi: Masuk ke dashboard MongoDB Atlas -> Network Access -> klik 'Add IP Address' -> masukkan '0.0.0.0/0' (Allow Access from Anywhere) lalu simpan.";
    } else if (err.message.includes("Authentication failed") || err.message.includes("auth failed") || err.message.includes("bad auth")) {
      friendlyError = "MongoDB Authentication Failed: Username atau password salah. Pastikan password yang digunakan sudah benar dan tidak mengandung karakter khusus tanpa encoding, atau sesuaikan password di MongoDB Atlas -> Database Access.";
    }
    
    dbStatus.error = friendlyError;
  }
}

// Start connection in background so it does not block startup
connectToMongo();

// Lazy initializer for Google GenAI
let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    let key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      key = "AQ.Ab8RN6KBVUD1GOkvyzgh9qm4AO7VMIU5YwLHA3GHPHq7w5xcOg";
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// 1. MongoDB Status Endpoint
app.get("/api/mongodb/status", async (req, res) => {
  try {
    let stats = {
      urls: 0,
      temp_mails: 0,
      transactions: 0,
      tickets: 0,
      promo_codes: 0
    };
    if (dbStatus.connected && db) {
      stats.urls = await db.collection("urls").countDocuments();
      stats.temp_mails = await db.collection("temp_mails").countDocuments();
      stats.transactions = await db.collection("transactions").countDocuments();
      stats.tickets = await db.collection("tickets").countDocuments();
      stats.promo_codes = await db.collection("promo_codes").countDocuments();
    }
    return res.json({
      ...dbStatus,
      stats
    });
  } catch (error: any) {
    return res.json({
      ...dbStatus,
      error: error.message
    });
  }
});

// 2. SaaS Settings Endpoints
app.get("/api/saas-settings", async (req, res) => {
  try {
    if (dbStatus.connected && db) {
      const settings = await db.collection("saas_settings").findOne({ _id: "current_settings" as any });
      if (settings) {
        return res.json(settings);
      }
    }
    return res.json(null);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/saas-settings", async (req, res) => {
  try {
    const settings = req.body;
    if (dbStatus.connected && db) {
      // Remove mongodb internal id if passed
      delete settings._id;
      await db.collection("saas_settings").updateOne(
        { _id: "current_settings" as any },
        { $set: { ...settings, updatedAt: new Date() } },
        { upsert: true }
      );
      return res.json({ success: true, message: "Settings saved to MongoDB." });
    }
    return res.json({ success: true, message: "Settings simulated (MongoDB offline)." });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 3. Transactions Endpoints
app.get("/api/transactions", async (req, res) => {
  try {
    if (dbStatus.connected && db) {
      const txs = await db.collection("transactions").find().toArray();
      return res.json(txs);
    }
    return res.json([]);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/transactions", async (req, res) => {
  try {
    const tx = req.body;
    if (dbStatus.connected && db) {
      await db.collection("transactions").insertOne({ ...tx, createdAt: new Date() });
      return res.json({ success: true, message: "Saved to MongoDB" });
    }
    return res.json({ success: true, message: "Saved locally" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.put("/api/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (dbStatus.connected && db) {
      delete updates._id;
      await db.collection("transactions").updateOne({ id }, { $set: updates });
      return res.json({ success: true });
    }
    return res.json({ success: true, message: "MongoDB offline" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 4. Tickets Endpoints
app.get("/api/tickets", async (req, res) => {
  try {
    if (dbStatus.connected && db) {
      const ticketsList = await db.collection("tickets").find().toArray();
      return res.json(ticketsList);
    }
    return res.json([]);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/tickets", async (req, res) => {
  try {
    const ticket = req.body;
    if (dbStatus.connected && db) {
      await db.collection("tickets").insertOne({ ...ticket, createdAt: new Date() });
      return res.json({ success: true });
    }
    return res.json({ success: true, message: "MongoDB offline" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/tickets/:id/replies", async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    if (dbStatus.connected && db) {
      await db.collection("tickets").updateOne(
        { id },
        { $push: { replies: reply } as any }
      );
      return res.json({ success: true });
    }
    return res.json({ success: true, message: "MongoDB offline" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.put("/api/tickets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (dbStatus.connected && db) {
      delete updates._id;
      await db.collection("tickets").updateOne({ id }, { $set: updates });
      return res.json({ success: true });
    }
    return res.json({ success: true, message: "MongoDB offline" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 5. Promo Codes Endpoints
app.get("/api/promo-codes", async (req, res) => {
  try {
    if (dbStatus.connected && db) {
      const codes = await db.collection("promo_codes").find().toArray();
      return res.json(codes);
    }
    return res.json([]);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/promo-codes", async (req, res) => {
  try {
    const codeData = req.body;
    if (dbStatus.connected && db) {
      await db.collection("promo_codes").insertOne({ ...codeData, createdAt: new Date() });
      return res.json({ success: true });
    }
    return res.json({ success: true, message: "MongoDB offline" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.put("/api/promo-codes/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const updates = req.body;
    if (dbStatus.connected && db) {
      delete updates._id;
      await db.collection("promo_codes").updateOne({ code }, { $set: updates });
      return res.json({ success: true });
    }
    return res.json({ success: true, message: "MongoDB offline" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// AI Copywriter Generation Endpoint
app.post("/api/ai/generate", async (req, res) => {
  try {
    const { prompt, systemInstruction } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || "You are ChenWave AI, a highly smart and helpful assistant on the ChenWave Tools utility suite.",
        temperature: 0.7,
      },
    });

    const text = response.text || "No response received from the AI model.";
    return res.json({ text });
  } catch (error: any) {
    console.error("AI API Error:", error);
    return res.status(500).json({
      error: error.message || "An error occurred during content generation."
    });
  }
});

// URL Shortener Endpoint
app.post("/api/url/shorten", async (req, res) => {
  try {
    const { originalUrl } = req.body;
    if (!originalUrl) {
      return res.status(400).json({ error: "URL is required." });
    }

    // Basic URL validation
    let validUrl = originalUrl.trim();
    if (!/^https?:\/\//i.test(validUrl)) {
      validUrl = "http://" + validUrl;
    }

    // Generate unique short code
    const shortCode = Math.random().toString(36).substring(2, 8);
    
    if (dbStatus.connected && db) {
      await db.collection("urls").insertOne({ shortCode, originalUrl: validUrl, createdAt: new Date() });
    } else {
      urlDatabase.set(shortCode, validUrl);
    }

    // Build absolute URL
    const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;
    const shortUrl = `${appUrl}/r/${shortCode}`;

    return res.json({ shortCode, originalUrl: validUrl, shortUrl });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// URL Redirection Route
app.get("/r/:code", async (req, res) => {
  const { code } = req.params;
  let originalUrl: string | undefined = undefined;

  try {
    if (dbStatus.connected && db) {
      const doc = await db.collection("urls").findOne({ shortCode: code });
      if (doc) {
        originalUrl = doc.originalUrl;
      }
    } else {
      originalUrl = urlDatabase.get(code);
    }
    
    if (originalUrl) {
      return res.redirect(302, originalUrl);
    } else {
      return res.redirect("/?shortenerError=not_found");
    }
  } catch (error) {
    return res.redirect("/?shortenerError=error");
  }
});

// Temp Mail: Generate Email
app.post("/api/temp-mail/generate", async (req, res) => {
  try {
    const randomId = Math.random().toString(36).substring(2, 10);
    const email = `user_${randomId}@alltools.com`;
    const defaultInbox = [
      {
        id: "welcome-email",
        from: "system@alltools.com",
        subject: "Welcome to All Tools Temp Mail!",
        body: "Hello! Thank you for choosing All Tools Temp Mail. Your temporary mailbox is now active and ready to receive incoming emails. Feel free to copy this address and use it for signups, newsletter testing, and privacy protection. Try pressing the 'Receive Test Email' button to instantly test email delivery to this address!",
        timestamp: new Date().toLocaleTimeString(),
      }
    ];

    if (dbStatus.connected && db) {
      await db.collection("temp_mails").updateOne(
        { email },
        { $set: { email, inbox: defaultInbox, createdAt: new Date() } },
        { upsert: true }
      );
    } else {
      mailDatabase.set(email, defaultInbox);
    }

    return res.json({ email });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Temp Mail: Get Inbox
app.get("/api/temp-mail/inbox", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email parameter is required." });
    }

    let inbox: any[] = [];
    if (dbStatus.connected && db) {
      const doc = await db.collection("temp_mails").findOne({ email });
      inbox = doc ? doc.inbox : [];
    } else {
      inbox = mailDatabase.get(email) || [];
    }
    return res.json({ inbox });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Temp Mail: Trigger Incoming Mock Email
app.post("/api/temp-mail/trigger-mock-email", async (req, res) => {
  try {
    const { email, type } = req.body;
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email is required." });
    }

    let inbox: any[] = [];
    if (dbStatus.connected && db) {
      const doc = await db.collection("temp_mails").findOne({ email });
      if (!doc) {
        return res.status(404).json({ error: "Email address not found or expired." });
      }
      inbox = doc.inbox;
    } else {
      const localInbox = mailDatabase.get(email);
      if (!localInbox) {
        return res.status(404).json({ error: "Email address not found or expired." });
      }
      inbox = localInbox;
    }

    const mockEmails = [
      {
        id: Math.random().toString(36).substring(2, 12),
        from: "security@github.com",
        subject: "[GitHub] Security Verification Code: " + Math.floor(100000 + Math.random() * 900000),
        body: "Someone recently tried to register or sign in to a GitHub account using this email address. Your security verification code is attached below:\n\nVerification Code: " + Math.floor(100000 + Math.random() * 900000) + "\n\nIf this wasn't you, please disregard this email.",
        timestamp: new Date().toLocaleTimeString(),
      },
      {
        id: Math.random().toString(36).substring(2, 12),
        from: "newsletter@techcrunch.com",
        subject: "TechCrunch Weekly: The rise of All Tools all-in-one SaaS platform!",
        body: "All Tools has officially launched to critical acclaim! Over 500 online tools are now consolidated in a single high-performance dashboard. Experts predict this will disrupt the traditional fragmented utility website space. Read the full review inside...",
        timestamp: new Date().toLocaleTimeString(),
      },
      {
        id: Math.random().toString(36).substring(2, 12),
        from: "support@netflix.com",
        subject: "Your subscription renewal receipt - Netflix Pro Plan",
        body: "Thank you for being a loyal Netflix subscriber. This is a receipt for your monthly payment of $15.49. Your next billing date will be August 11, 2026. No action is required. If you have questions, please reach out to our support portal.",
        timestamp: new Date().toLocaleTimeString(),
      },
      {
        id: Math.random().toString(36).substring(2, 12),
        from: "alerts@paypal.com",
        subject: "Payment Alert: Received $150.00 USD from John Doe",
        body: "Good news! You have received a payment of $150.00 USD from John Doe via PayPal Checkout. The funds have been placed in your available balance and are ready for bank transfer. Details:\n\nTransaction ID: TXN-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
        timestamp: new Date().toLocaleTimeString(),
      }
    ];

    const chosenEmail = mockEmails[Math.floor(Math.random() * mockEmails.length)];
    inbox.unshift(chosenEmail);

    if (dbStatus.connected && db) {
      await db.collection("temp_mails").updateOne({ email }, { $set: { inbox } });
    } else {
      mailDatabase.set(email, inbox);
    }

    return res.json({ success: true, message: "Test email triggered and placed in inbox.", email: chosenEmail });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Vite Middleware for development, or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ChenWave Tools Server] running on http://localhost:${PORT}`);
  });
}

startServer();
