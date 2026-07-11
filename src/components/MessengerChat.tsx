import React, { useState, useEffect, useRef } from "react";
import { Send, UserPlus, UserCheck, Heart, Users, MessageSquare, ShieldAlert, CircleDot, RefreshCw, Smile } from "lucide-react";
import { Message, Friend } from "../types";

interface MessengerChatProps {
  currentUser: string;
  lowGraphics: boolean;
}

export default function MessengerChat({ currentUser, lowGraphics }: MessengerChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [activeFriendId, setActiveFriendId] = useState<string>("f-2"); // VR Zero Zone CS default
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch both messages and friends list from the server
  const fetchChatData = async (showLoading = false) => {
    if (showLoading) setIsRefreshing(true);
    try {
      const [msgRes, friendRes] = await Promise.all([
        fetch("/api/messenger/messages"),
        fetch("/api/friends")
      ]);

      if (msgRes.ok) {
        const msgs = await msgRes.json();
        setMessages(msgs);
      }
      if (friendRes.ok) {
        const fList = await friendRes.json();
        setFriends(fList);
      }
    } catch (err) {
      console.error("Failed to load messenger data:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChatData();
    // Poll every 3 seconds for tight real-time messenger experience
    const interval = setInterval(() => {
      fetchChatData();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll chat to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle Send Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const currentText = messageText;
    setMessageText("");
    setIsSending(true);

    // Optimistic local push
    const tempMsg: Message = {
      id: `temp-${Date.now()}`,
      sender: currentUser,
      content: currentText,
      timestamp: new Date().toISOString(),
      isAdmin: false,
      avatar: "🧑",
      reactions: {}
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await fetch("/api/messenger/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: currentUser,
          content: currentText,
          avatar: "🧑",
          isAdmin: false
        })
      });

      if (res.ok) {
        await fetchChatData();
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setIsSending(false);
    }
  };

  // Toggle Friend state (Add Friend / Remove Friend)
  const handleToggleFriend = async (friendId: string) => {
    // Optimistic local state update
    setFriends((prev) =>
      prev.map((f) => {
        if (f.id === friendId) {
          return { ...f, isFriend: !f.isFriend };
        }
        return f;
      })
    );

    try {
      await fetch(`/api/friends/${friendId}/friend`, { method: "POST" });
      await fetchChatData();
    } catch (err) {
      console.error("Error updating friend state:", err);
    }
  };

  // Toggle Follow state (Follow / Unfollow)
  const handleToggleFollow = async (friendId: string) => {
    // Optimistic local state update
    setFriends((prev) =>
      prev.map((f) => {
        if (f.id === friendId) {
          return { ...f, isFollowing: !f.isFollowing };
        }
        return f;
      })
    );

    try {
      await fetch(`/api/friends/${friendId}/follow`, { method: "POST" });
      await fetchChatData();
    } catch (err) {
      console.error("Error updating follow state:", err);
    }
  };

  // React to a Message
  const handleReactToMessage = async (msgId: string, emoji: string) => {
    // Optimistic local state update
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === msgId) {
          const currentVal = m.reactions[emoji] || 0;
          return {
            ...m,
            reactions: { ...m.reactions, [emoji]: currentVal + 1 }
          };
        }
        return m;
      })
    );

    try {
      await fetch(`/api/messenger/messages/${msgId}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji })
      });
    } catch (err) {
      console.error("Error reacting to message:", err);
    }
  };

  const activeFriend = friends.find((f) => f.id === activeFriendId);
  const chatEmojis = ["👍", "❤️", "🎮", "😂", "😮", "😢"];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[550px]">
      
      {/* Sidebar Friends List */}
      <div className="w-full md:w-64 bg-slate-950 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col shrink-0 h-40 md:h-full">
        <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-display font-extrabold text-slate-200 tracking-wider uppercase">
              CS & Contacts
            </span>
          </div>
          <button
            onClick={() => fetchChatData(true)}
            className="p-1 hover:bg-slate-850 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
            title="Reload Chat Status"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Contacts scrolling area */}
        <div className="flex-1 overflow-y-auto p-2 flex flex-row md:flex-col gap-1 md:gap-1.5">
          {friends.map((f) => {
            const isSelected = f.id === activeFriendId;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFriendId(f.id)}
                className={`flex-1 md:flex-none w-36 md:w-full p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-cyan-950/40 to-violet-950/40 border-cyan-500/50 text-white"
                    : "bg-slate-900/40 border-transparent hover:border-slate-800 text-slate-300"
                }`}
              >
                <div className="relative">
                  <span className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-sm">
                    {f.avatar}
                  </span>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
                </div>
                
                <div className="flex-1 min-w-0 hidden md:block">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold truncate text-slate-100">{f.name}</p>
                  </div>
                  <p className="text-[10px] text-slate-450 truncate">{f.lastActive}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-900/60 h-0 md:h-full">
        {activeFriend ? (
          <>
            {/* Chat header */}
            <div className="p-3.5 border-b border-slate-800 flex justify-between items-center bg-slate-950/30">
              <div className="flex items-center gap-2.5">
                <span className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-sm">
                  {activeFriend.avatar}
                </span>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-100">{activeFriend.name}</h3>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <CircleDot className="w-2.5 h-2.5 text-emerald-500 animate-pulse" />
                    <span>Real-time Active Connection</span>
                  </div>
                </div>
              </div>

              {/* Add Friend & Follow Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleToggleFriend(activeFriend.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                    activeFriend.isFriend
                      ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-400 hover:bg-emerald-900/30"
                      : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {activeFriend.isFriend ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                  <span>{activeFriend.isFriend ? "Friend ✔" : "Add Friend"}</span>
                </button>

                <button
                  onClick={() => handleToggleFollow(activeFriend.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                    activeFriend.isFollowing
                      ? "bg-violet-950/40 border-violet-500/50 text-violet-400 hover:bg-violet-900/30"
                      : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${activeFriend.isFollowing ? "fill-current" : ""}`} />
                  <span>{activeFriend.isFollowing ? "Following" : "Follow"}</span>
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/15">
              {messages.map((msg) => {
                const isMe = msg.sender === currentUser;
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 max-w-[85%] ${isMe ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                  >
                    {!isMe && (
                      <span className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-xs shrink-0 select-none">
                        {msg.avatar || "👤"}
                      </span>
                    )}

                    <div className="space-y-1">
                      <div className={`text-[9px] text-slate-500 font-mono px-1 ${isMe ? "text-right" : ""}`}>
                        {msg.sender} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`rounded-2xl px-3.5 py-2 text-xs relative group/bubble ${
                          isMe
                            ? "bg-cyan-600 text-slate-950 rounded-br-none font-medium"
                            : "bg-slate-800 text-slate-200 rounded-bl-none border border-slate-750"
                        }`}
                      >
                        <p className="leading-relaxed break-words whitespace-pre-wrap">{msg.content}</p>

                        {/* Quick reaction floating picker */}
                        <div className={`absolute bottom-full mb-1 hidden group-hover/bubble:flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-full p-1 shadow-xl z-20 ${isMe ? "right-0" : "left-0"}`}>
                          {chatEmojis.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => handleReactToMessage(msg.id, emoji)}
                              className="text-xs hover:scale-135 transition-transform p-0.5 cursor-pointer"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Rendered reactions block */}
                      {Object.keys(msg.reactions).length > 0 && (
                        <div className={`flex flex-wrap gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}>
                          {Object.entries(msg.reactions).map(([emoji, count]) => (
                            <span
                              key={emoji}
                              className="inline-flex items-center gap-0.5 bg-slate-950/80 border border-slate-800 text-[10px] px-1.5 py-0.5 rounded-full text-slate-400"
                            >
                              <span>{emoji}</span>
                              <span className="text-[8px] font-bold font-mono">{count}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat bottom message input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2 bg-slate-950/30">
              <input
                type="text"
                placeholder={`Ask anything! Try typing "wifi", "gcash", "address", or "price"...`}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                disabled={isSending}
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500/50 focus:outline-none rounded-xl px-4.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 transition-colors"
              />
              <button
                type="submit"
                disabled={isSending || !messageText.trim()}
                className="px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center shrink-0 disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-2">
            <MessageSquare className="w-10 h-10 text-slate-600 animate-bounce" />
            <p className="text-sm font-semibold text-slate-300">Select a support channel to chat</p>
          </div>
        )}
      </div>
    </div>
  );
}
