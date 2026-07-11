import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "database.json");

app.use(express.json());

// Type definitions for our persistent server-side state
interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

interface Post {
  id: string;
  author: string;
  authorAvatar: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  reactions: Record<string, number>;
  comments: Comment[];
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isAdmin: boolean;
  avatar?: string;
  reactions: Record<string, number>;
}

interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline";
  isFriend: boolean;
  isFollowing: boolean;
  lastActive: string;
}

interface Booking {
  id: string;
  name: string;
  phone: string;
  date: string;
  timeSlot: string;
  gCashNumber: string;
  amount: number;
  status: "pending" | "confirmed";
  createdAt: string;
}

interface DbState {
  posts: Post[];
  messages: Message[];
  friends: Friend[];
  bookings: Booking[];
}

// Seed Initial Data
const INITIAL_STATE: DbState = {
  posts: [
    {
      id: "post-1",
      author: "Mark VR Specialist",
      authorAvatar: "⚡",
      title: "Welcome to VR PASIG Zero Zone - 1 Gbps Ultra Wi-Fi Guide!",
      content: "Hello Zero Zone fans! We've fully optimized our Kapitolyo branch with high-performance VR headsets and a blazing-fast 1 Gbps dual-band Wi-Fi connection. Ensure your mobile devices or consoles are connected to our 5GHz band 'VR-PASIG-ZERO-ZONE_5G' for lag-free speeds!",
      category: "Guides",
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      upvotes: 42,
      downvotes: 1,
      reactions: { "🔥": 8, "🎮": 12, "👍": 15 },
      comments: [
        {
          id: "c-1",
          author: "JuandiceVR",
          content: "Tried the 1 Gbps connection yesterday while waiting for my turn. Downloaded a full game update in minutes. Insane speeds!",
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
        }
      ]
    },
    {
      id: "post-2",
      author: "GamerGirl_Philippines",
      authorAvatar: "🌸",
      title: "Zero Zone Kapitolyo virtual tour is so sleek",
      content: "Just loaded the virtual tour on my phone and it rendered instantly in 60fps! Can't wait to visit the actual location at 30-A San Lorenzo this weekend. The setup looks clean!",
      category: "Reviews",
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      upvotes: 28,
      downvotes: 0,
      reactions: { "❤️": 5, "✨": 6, "😮": 2 },
      comments: [
        {
          id: "c-2",
          author: "ZeroZoneStaff",
          content: "Thank you! We work hard to keep our virtual tour updated. See you this weekend! We've reserved the PS5 lounge for you.",
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
        }
      ]
    }
  ],
  messages: [
    {
      id: "msg-1",
      sender: "System Alert",
      content: "Welcome to VR PASIG Zero Zone Live CS! How can we assist you today?",
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      isAdmin: true,
      avatar: "⚙️",
      reactions: {}
    },
    {
      id: "msg-2",
      sender: "Mark",
      content: "Hi! Are you open during holidays? Do you accept GCash booking?",
      timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
      isAdmin: false,
      avatar: "🧑",
      reactions: { "👍": 1 }
    },
    {
      id: "msg-3",
      sender: "VR Zero Zone CS",
      content: "Yes, Mark! We are open daily from 9:00 AM to 11:00 PM, including holidays. You can book using the Book Now tab, pay with GCash, and send your receipt directly to our Facebook!",
      timestamp: new Date(Date.now() - 3600000 * 1.2).toISOString(),
      isAdmin: true,
      avatar: "⚡",
      reactions: { "❤️": 2 }
    }
  ],
  friends: [
    {
      id: "f-1",
      name: "Mark (Founder)",
      avatar: "👑",
      status: "online",
      isFriend: true,
      isFollowing: true,
      lastActive: "Active now"
    },
    {
      id: "f-2",
      name: "VR Zero Zone CS",
      avatar: "⚡",
      status: "online",
      isFriend: true,
      isFollowing: true,
      lastActive: "Active now"
    },
    {
      id: "f-3",
      name: "Kapitolyo VR Hub",
      avatar: "🏠",
      status: "online",
      isFriend: false,
      isFollowing: false,
      lastActive: "Active 5m ago"
    },
    {
      id: "f-4",
      name: "GamerGirl_Philippines",
      avatar: "🌸",
      status: "online",
      isFriend: false,
      isFollowing: false,
      lastActive: "Active 10m ago"
    }
  ],
  bookings: []
};

// Database read/write helpers
function loadDb(): DbState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Failed to parse database.json, seeding defaults:", error);
  }
  saveDb(INITIAL_STATE);
  return INITIAL_STATE;
}

function saveDb(state: DbState) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to write to database.json:", error);
  }
}

// Initial DB read
let db = loadDb();

// API Endpoints

// 1. COMMUNITY
app.get("/api/community/posts", (req, res) => {
  res.json(db.posts);
});

app.post("/api/community/posts", (req, res) => {
  const { author, authorAvatar, title, content, category } = req.body;
  if (!author || !title || !content) {
    return res.status(400).json({ error: "Missing required post fields" });
  }

  const newPost: Post = {
    id: `post-${Date.now()}`,
    author,
    authorAvatar: authorAvatar || "👤",
    title,
    content,
    category: category || "General",
    createdAt: new Date().toISOString(),
    upvotes: 1,
    downvotes: 0,
    reactions: {},
    comments: []
  };

  db.posts.unshift(newPost);
  saveDb(db);
  res.status(201).json(newPost);
});

app.post("/api/community/posts/:id/vote", (req, res) => {
  const { id } = req.params;
  const { type } = req.body; // "up" | "down"

  const post = db.posts.find((p) => p.id === id);
  if (!post) return res.status(404).json({ error: "Post not found" });

  if (type === "up") {
    post.upvotes += 1;
  } else if (type === "down") {
    post.downvotes += 1;
  }

  saveDb(db);
  res.json(post);
});

app.post("/api/community/posts/:id/react", (req, res) => {
  const { id } = req.params;
  const { emoji } = req.body;

  const post = db.posts.find((p) => p.id === id);
  if (!post) return res.status(404).json({ error: "Post not found" });

  if (!post.reactions[emoji]) {
    post.reactions[emoji] = 0;
  }
  post.reactions[emoji] += 1;

  saveDb(db);
  res.json(post);
});

app.post("/api/community/posts/:id/comments", (req, res) => {
  const { id } = req.params;
  const { author, content } = req.body;

  if (!author || !content) {
    return res.status(400).json({ error: "Missing author or comment content" });
  }

  const post = db.posts.find((p) => p.id === id);
  if (!post) return res.status(404).json({ error: "Post not found" });

  const newComment: Comment = {
    id: `comment-${Date.now()}`,
    author,
    content,
    createdAt: new Date().toISOString()
  };

  post.comments.push(newComment);
  saveDb(db);
  res.status(201).json(post);
});


// 2. MESSENGER
app.get("/api/messenger/messages", (req, res) => {
  res.json(db.messages);
});

app.post("/api/messenger/messages", (req, res) => {
  const { sender, content, avatar, isAdmin } = req.body;
  if (!sender || !content) {
    return res.status(400).json({ error: "Missing message sender or content" });
  }

  const newMessage: Message = {
    id: `msg-${Date.now()}`,
    sender,
    content,
    timestamp: new Date().toISOString(),
    isAdmin: !!isAdmin,
    avatar: avatar || "👤",
    reactions: {}
  };

  db.messages.push(newMessage);

  // Trigger an auto-reply from Customer Support if they mentioned 'wifi', 'price', 'g-cash', 'address' or 'tour'
  const lowerContent = content.toLowerCase();
  let replyText = "";
  if (lowerContent.includes("wifi") || lowerContent.includes("speed") || lowerContent.includes("internet")) {
    replyText = "We offer blazing-fast Wi-Fi up to 1 GBPS speed here at VR PASIG Zero Zone! You can test your connection speed anytime in our Speed Test tab.";
  } else if (lowerContent.includes("price") || lowerContent.includes("cost") || lowerContent.includes("rates")) {
    replyText = "Our rates are PHP 150/hour for standard VR setups, PHP 250/hour for high-fidelity PS5/PCVR gaming, and VIP lounges starting at PHP 500/hour. Complete your booking on our Book Now tab!";
  } else if (lowerContent.includes("gcash") || lowerContent.includes("pay")) {
    replyText = "You can pay with GCash by sending to @ 09763329358. Send the transaction receipt to us on Facebook at https://www.facebook.com/usagyuunvtuber5/ so we can confirm it instantly!";
  } else if (lowerContent.includes("address") || lowerContent.includes("location") || lowerContent.includes("where")) {
    replyText = "Our physical address is: 30-A San Lorenzo Pasig City Metro Manila Kapitolyo. Come over for a fantastic experience!";
  } else if (lowerContent.includes("tour") || lowerContent.includes("virtual")) {
    replyText = "Check out our interactive Virtual Tour tab! You can explore the state-of-the-art gaming zones and lounges before you even arrive.";
  }

  if (replyText) {
    setTimeout(() => {
      const dbUpdate = loadDb();
      const botReply: Message = {
        id: `msg-bot-${Date.now()}`,
        sender: "VR Zero Zone CS",
        content: replyText,
        timestamp: new Date().toISOString(),
        isAdmin: true,
        avatar: "⚡",
        reactions: {}
      };
      dbUpdate.messages.push(botReply);
      db = dbUpdate;
      saveDb(db);
    }, 1200);
  }

  saveDb(db);
  res.status(201).json(newMessage);
});

app.post("/api/messenger/messages/:id/react", (req, res) => {
  const { id } = req.params;
  const { emoji } = req.body;

  const msg = db.messages.find((m) => m.id === id);
  if (!msg) return res.status(404).json({ error: "Message not found" });

  if (!msg.reactions[emoji]) {
    msg.reactions[emoji] = 0;
  }
  msg.reactions[emoji] += 1;

  saveDb(db);
  res.json(msg);
});


// 3. FRIENDS / CONTACTS
app.get("/api/friends", (req, res) => {
  res.json(db.friends);
});

app.post("/api/friends/:id/friend", (req, res) => {
  const { id } = req.params;
  const friend = db.friends.find((f) => f.id === id);
  if (!friend) return res.status(404).json({ error: "User not found" });

  friend.isFriend = !friend.isFriend;
  saveDb(db);
  res.json(friend);
});

app.post("/api/friends/:id/follow", (req, res) => {
  const { id } = req.params;
  const friend = db.friends.find((f) => f.id === id);
  if (!friend) return res.status(404).json({ error: "User not found" });

  friend.isFollowing = !friend.isFollowing;
  saveDb(db);
  res.json(friend);
});


// 4. BOOKINGS
app.get("/api/bookings", (req, res) => {
  res.json(db.bookings);
});

app.post("/api/bookings", (req, res) => {
  const { name, phone, date, timeSlot, gCashNumber, amount } = req.body;
  if (!name || !phone || !date || !timeSlot || !gCashNumber) {
    return res.status(400).json({ error: "Missing required booking fields" });
  }

  const newBooking: Booking = {
    id: `book-${Date.now()}`,
    name,
    phone,
    date,
    timeSlot,
    gCashNumber,
    amount: Number(amount) || 250,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  db.bookings.unshift(newBooking);
  saveDb(db);
  res.status(201).json(newBooking);
});

// 5. CACHE CLEAR & RE-SEED API
app.post("/api/system/clear-cache", (req, res) => {
  db = { ...INITIAL_STATE, bookings: [] };
  saveDb(db);
  res.json({ success: true, message: "System state has been reset and seed data loaded successfully." });
});

// Main Full-Stack setup integrating Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
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
    console.log(`Server running at http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
