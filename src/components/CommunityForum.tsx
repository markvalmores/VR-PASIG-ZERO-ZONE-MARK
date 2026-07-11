import React, { useState, useEffect } from "react";
import { MessageSquare, ArrowBigUp, ArrowBigDown, Send, User, Sparkles, Filter, Smile, Plus, RefreshCw } from "lucide-react";
import { Post } from "../types";

interface CommunityForumProps {
  currentUser: string;
  lowGraphics: boolean;
}

export default function CommunityForum({ currentUser, lowGraphics }: CommunityForumProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("General");
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState("");
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch posts from database on mount and set up real-time polling
  const fetchPosts = async (showLoading = false) => {
    if (showLoading) setIsRefreshing(true);
    try {
      const res = await fetch("/api/community/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error("Failed to fetch community posts:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // 5-second polling interval for "ALL REALTIME NO FAKES" synchronization
    const interval = setInterval(() => {
      fetchPosts();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle post submit
  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsSubmittingPost(true);
    try {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: currentUser,
          authorAvatar: "🧑‍💻",
          title: newTitle,
          content: newContent,
          category: newCategory
        })
      });

      if (res.ok) {
        setNewTitle("");
        setNewContent("");
        setNewCategory("General");
        await fetchPosts();
      }
    } catch (err) {
      console.error("Error creating post:", err);
    } finally {
      setIsSubmittingPost(false);
    }
  };

  // Handle upvote / downvote
  const handleVote = async (postId: string, type: "up" | "down") => {
    // Optimistic update
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            upvotes: type === "up" ? post.upvotes + 1 : post.upvotes,
            downvotes: type === "down" ? post.downvotes + 1 : post.downvotes
          };
        }
        return post;
      })
    );

    try {
      await fetch(`/api/community/posts/${postId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type })
      });
    } catch (err) {
      console.error("Error voting:", err);
    }
  };

  // Handle adding emoji reaction
  const handleReact = async (postId: string, emoji: string) => {
    // Optimistic update
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const currentCount = post.reactions[emoji] || 0;
          return {
            ...post,
            reactions: {
              ...post.reactions,
              [emoji]: currentCount + 1
            }
          };
        }
        return post;
      })
    );

    try {
      await fetch(`/api/community/posts/${postId}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji })
      });
    } catch (err) {
      console.error("Error adding reaction:", err);
    }
  };

  // Handle comment submit
  const handleCommentSubmit = async (postId: string) => {
    if (!commentInput.trim()) return;

    const savedCommentText = commentInput;
    setCommentInput("");

    try {
      const res = await fetch(`/api/community/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: currentUser,
          content: savedCommentText
        })
      });

      if (res.ok) {
        await fetchPosts();
      }
    } catch (err) {
      console.error("Error creating comment:", err);
    }
  };

  const filteredPosts = selectedCategory === "All"
    ? posts
    : posts.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

  const categories = ["All", "Guides", "Reviews", "General", "Events"];
  const reactionEmojis = ["🔥", "🎮", "👍", "❤️", "✨", "😮"];

  return (
    <div className="space-y-6">
      {/* Community Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-center relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
              <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight">
                Zero Zone Reddit Community
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Discuss gaming strategies, organize co-op squads, and read Kapitolyo center announcements.
            </p>
          </div>
          <button
            onClick={() => fetchPosts(true)}
            disabled={isRefreshing}
            className="p-2 hover:bg-slate-800 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono disabled:opacity-50"
            title="Force Reload Post Database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Sync Live</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Post Creation Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Plus className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-display font-bold text-slate-100">Create Community Post</h3>
          </div>

          <form onSubmit={handleSubmitPost} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Title</label>
              <input
                type="text"
                placeholder="What's on your mind?"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 rounded-lg px-2 py-2 text-xs text-slate-300 focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="General">General</option>
                  <option value="Guides">Guides</option>
                  <option value="Reviews">Reviews</option>
                  <option value="Events">Events</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Author Alias</label>
                <div className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">{currentUser}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Content</label>
              <textarea
                placeholder="Share your experience, query, or review here..."
                rows={4}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingPost}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-slate-950 font-display font-extrabold rounded-lg shadow-lg text-xs tracking-wider uppercase transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmittingPost ? "Publishing..." : "Publish to Board"}
            </button>
          </form>
        </div>

        {/* Forum Feed List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/40 p-1.5 border border-slate-800 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-slate-800 text-cyan-400 font-bold border border-slate-700"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts Feed container */}
          {filteredPosts.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-2">
              <MessageSquare className="w-10 h-10 text-slate-600 mx-auto animate-bounce" />
              <p className="text-sm font-semibold text-slate-300">No discussion threads found</p>
              <p className="text-xs text-slate-500">Be the first to create a topic under the &quot;{selectedCategory}&quot; category!</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5 flex gap-4 hover:border-slate-700/60 transition-colors"
              >
                {/* Voting Column */}
                <div className="flex flex-col items-center gap-1 bg-slate-950/40 border border-slate-800 rounded-lg p-1.5 h-fit shrink-0">
                  <button
                    onClick={() => handleVote(post.id, "up")}
                    className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer"
                    title="Upvote"
                  >
                    <ArrowBigUp className="w-5 h-5" />
                  </button>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {post.upvotes - post.downvotes}
                  </span>
                  <button
                    onClick={() => handleVote(post.id, "down")}
                    className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-rose-500 transition-colors cursor-pointer"
                    title="Downvote"
                  >
                    <ArrowBigDown className="w-5 h-5" />
                  </button>
                </div>

                {/* Post Content column */}
                <div className="flex-1 space-y-2.5">
                  <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400">
                    <span className="h-5 w-5 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-xs">
                      {post.authorAvatar}
                    </span>
                    <span className="font-semibold text-slate-200">{post.author}</span>
                    <span>•</span>
                    <span className="bg-slate-800 text-[10px] font-mono px-2 py-0.5 rounded text-cyan-400 border border-slate-700/60">
                      {post.category}
                    </span>
                    <span>•</span>
                    <span className="text-[10px]">
                      {new Date(post.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm md:text-base font-display font-bold text-slate-100 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1.5 whitespace-pre-wrap">
                      {post.content}
                    </p>
                  </div>

                  {/* Emoji reactions row */}
                  <div className="flex flex-wrap items-center gap-1 border-t border-b border-slate-800/40 py-2">
                    {reactionEmojis.map((emoji) => {
                      const count = post.reactions[emoji] || 0;
                      return (
                        <button
                          key={emoji}
                          onClick={() => handleReact(post.id, emoji)}
                          className={`px-2 py-1 bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 rounded-md text-[11px] flex items-center gap-1 hover:bg-slate-900 transition-colors cursor-pointer ${
                            count > 0 ? "border-cyan-500/40 text-cyan-400 bg-cyan-950/10" : "text-slate-400"
                          }`}
                        >
                          <span>{emoji}</span>
                          {count > 0 && <span className="font-mono text-[9px] font-bold">{count}</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Comments Toggle & List */}
                  <div className="space-y-3">
                    <button
                      onClick={() =>
                        setActiveCommentsPostId(activeCommentsPostId === post.id ? null : post.id)
                      }
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors font-medium cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.comments.length} Comments</span>
                    </button>

                    {activeCommentsPostId === post.id && (
                      <div className="bg-slate-950/50 border border-slate-800/60 rounded-xl p-3.5 space-y-4">
                        {/* Comments loop */}
                        {post.comments.length > 0 && (
                          <div className="space-y-3 max-h-48 overflow-y-auto pr-1.5">
                            {post.comments.map((comment) => (
                              <div key={comment.id} className="text-xs space-y-0.5 border-l-2 border-slate-800 pl-2.5">
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold">
                                  <span className="text-slate-300">{comment.author}</span>
                                  <span>•</span>
                                  <span>
                                    {new Date(comment.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                  </span>
                                </div>
                                <p className="text-slate-300 leading-normal text-[11px]">{comment.content}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Comment input form */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Write a comment..."
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleCommentSubmit(post.id);
                            }}
                            className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500/50 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none transition-colors"
                          />
                          <button
                            onClick={() => handleCommentSubmit(post.id)}
                            className="p-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-lg transition-colors cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
