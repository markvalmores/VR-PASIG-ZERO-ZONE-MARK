import React, { useState } from "react";
import {
  Download,
  Copy,
  ExternalLink,
  Globe,
  Palette,
  Image,
  FileText,
  Mail,
  Check,
  Plus,
  RefreshCw,
  FileCode,
  TrendingUp,
  Sparkles,
  Layers,
  Heart,
  Smartphone,
  Tv,
  Gamepad2,
  Lock,
  Share2
} from "lucide-react";

interface MediaKitProps {
  lowGraphics?: boolean;
}

export default function MediaKit({ lowGraphics = false }: MediaKitProps) {
  // Persistence of Vercel Media Kit URL
  const [vercelUrl, setVercelUrl] = useState(() => {
    return localStorage.getItem("vr_pasig_vercel_media_kit_url") || "https://vr-pasig-media-kit.vercel.app";
  });
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [tempUrl, setTempUrl] = useState(vercelUrl);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [previewActive, setPreviewActive] = useState(true);

  // Partnership Contact Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formBrand, setFormBrand] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Notification triggers
  const triggerCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    let sanitized = tempUrl.trim();
    if (sanitized && !/^https?:\/\//i.test(sanitized)) {
      sanitized = "https://" + sanitized;
    }
    setVercelUrl(sanitized);
    localStorage.setItem("vr_pasig_vercel_media_kit_url", sanitized);
    setIsEditingUrl(false);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formName && formEmail && formBrand) {
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setFormName("");
        setFormEmail("");
        setFormBrand("");
        setFormMessage("");
      }, 5000);
    }
  };

  // Color Swatches
  const colors = [
    { name: "Cyan Prime", hex: "#06b6d4", bg: "bg-cyan-500", text: "text-cyan-400" },
    { name: "Violet Pulse", hex: "#8b5cf6", bg: "bg-violet-500", text: "text-violet-400" },
    { name: "Emerald Signal", hex: "#10b981", bg: "bg-emerald-500", text: "text-emerald-400" },
    { name: "Slate Deep", hex: "#0f172a", bg: "bg-slate-900", text: "text-slate-400" },
    { name: "Crimson Spark", hex: "#f43f5e", bg: "bg-rose-500", text: "text-rose-400" },
  ];

  // Code starter boilerplate for React Vercel App
  const vercelStarterCode = `// Save as App.tsx in your React/Vite template & deploy to Vercel!
import React from 'react';
import { Sparkles, Gamepad, Globe, Users } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-900 bg-slate-900/60 p-6 backdrop-blur">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-black text-white tracking-widest uppercase">
            VR PASIG Zero Zone Mark
          </h1>
          <span className="text-xs bg-cyan-950 text-cyan-400 border border-cyan-800/40 px-3 py-1 rounded-full font-mono">
            MEDIA KIT v1.0
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto p-8 grid md:grid-cols-2 gap-8">
        <section className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> Brand Identity
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            The premium virtual reality gaming sanctuary situated in Kapitolyo, Pasig. Equipped with 1 Gbps ultra-low latency optical fibers, high-end console emulation, and cozy custom VR visual zones.
          </p>
          <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-mono text-slate-500">PRIMARY COLOR</p>
              <div className="h-8 bg-cyan-500 rounded-lg mt-1" />
              <p className="text-[10px] font-mono text-slate-300 mt-1">#06B6D4</p>
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-500">ACCENT COLOR</p>
              <div className="h-8 bg-violet-500 rounded-lg mt-1" />
              <p className="text-[10px] font-mono text-slate-300 mt-1">#8B5CF6</p>
            </div>
          </div>
        </section>

        <section className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-violet-400 flex items-center gap-2">
            <Users className="w-5 h-5" /> Media Outreach
          </h2>
          <ul className="space-y-2 text-xs">
            <li className="flex justify-between border-b border-slate-800/60 pb-2">
              <span className="text-slate-400">Total Gamers Reached</span>
              <span className="font-mono text-white font-bold">12,500+ / mo</span>
            </li>
            <li className="flex justify-between border-b border-slate-800/60 pb-2">
              <span className="text-slate-400">Average Session Time</span>
              <span className="font-mono text-white font-bold">145 mins</span>
            </li>
            <li className="flex justify-between pb-2">
              <span className="text-slate-400">GCash Booking Rate</span>
              <span className="font-mono text-white font-bold">92%</span>
            </li>
          </ul>
        </section>
      </main>

      <footer className="border-t border-slate-900 text-center py-6 text-[10px] text-slate-600">
        VR PASIG Zero Zone Mark // Powered by Vercel
      </footer>
    </div>
  );
}`;

  return (
    <div className="space-y-6">
      
      {/* Media Kit Banner Title Block */}
      <div className="relative overflow-hidden bg-gradient-to-br from-cyan-950/40 via-slate-950 to-violet-950/40 border border-slate-850 rounded-2xl p-6 md:p-8">
        {!lowGraphics && (
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        )}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 animate-pulse" />
              <span>Media Kit & Brand Center</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-black text-white tracking-tight uppercase">
              VR PASIG PRESS & PARTNER HUBS
            </h1>
            <p className="text-xs md:text-sm text-slate-350 max-w-2xl leading-relaxed">
              Official assets, color guidelines, community reach figures, and deployment assets for 
              <strong className="text-cyan-300"> VR PASIG Zero Zone Mark</strong>. Elevate local VR cyber café culture with our official media kit.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              onClick={() => triggerCopy("VR PASIG Zero Zone Mark is Metro Manila's premier VR cyber café sanctuary located in Kapitolyo, Pasig City.", "description")}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <Copy className="w-4 h-4 text-cyan-400" />
              <span>{copiedText === "description" ? "Copied!" : "Copy Pitch"}</span>
            </button>

            <a
              href="https://streamlabs.com/usagyuunvtuber/tip"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 hover:opacity-90 rounded-xl text-xs font-display font-extrabold transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/15"
            >
              <Heart className="w-4 h-4 fill-slate-950" />
              <span>Sponsor Hub</span>
            </a>
          </div>
        </div>
      </div>

      {/* Grid Layout: Core Assets & Vercel App Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Brand Kit Downloads & Guidelines */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Logo & Visual Assets Showcase */}
          <div className="bg-slate-900/40 border border-slate-850/60 rounded-2xl p-6 space-y-5">
            <h2 className="text-sm font-display font-black tracking-wider uppercase text-slate-300 flex items-center gap-2">
              <Image className="w-4.5 h-4.5 text-cyan-400" />
              <span>Brand Assets & Visual Downloads</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Asset Item 1: High-Res Logo */}
              <div className="bg-slate-950/60 border border-slate-850 rounded-xl p-4 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="h-28 w-full rounded-lg bg-gradient-to-br from-cyan-950/40 via-slate-900 to-violet-950/40 flex items-center justify-center relative overflow-hidden border border-slate-850">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center shadow-xl shadow-cyan-900/30">
                      <Gamepad2 className="w-8 h-8 text-slate-950" />
                    </div>
                    <span className="absolute bottom-1 right-2 text-[9px] font-mono text-cyan-400">SVG VECTOR</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-200">VR Pasig Primary Emblem</h3>
                  <p className="text-[10px] text-slate-500 font-mono">High-res transparency format optimized for print or screen overlays.</p>
                </div>
                <button
                  onClick={() => triggerCopy("https://ais-dev-f3wyljkw6so6yg7remntov-9199574104.asia-southeast1.run.app/assets/logo-vector.svg", "logo1")}
                  className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-mono text-slate-300 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{copiedText === "logo1" ? "Link Copied!" : "Download Vector (SVG)"}</span>
                </button>
              </div>

              {/* Asset Item 2: Display Wallpaper */}
              <div className="bg-slate-950/60 border border-slate-850 rounded-xl p-4 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="h-28 w-full rounded-lg bg-slate-900 flex items-center justify-center relative overflow-hidden border border-slate-850">
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/80 to-violet-950/80" />
                    {/* Retro Cyber Grid visualization */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
                    <div className="relative z-10 text-center">
                      <p className="text-[11px] font-display font-black tracking-wider text-white uppercase">Kapitolyo Cyberdome</p>
                      <p className="text-[8px] font-mono text-cyan-400">1920 x 1080 PX</p>
                    </div>
                    <span className="absolute bottom-1 right-2 text-[9px] font-mono text-violet-400">WALLPAPER</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-200">Zero Zone Desktop Grid Wallpaper</h3>
                  <p className="text-[10px] text-slate-500 font-mono">Atmospheric custom synthwave background for streaming screens.</p>
                </div>
                <button
                  onClick={() => triggerCopy("https://ais-dev-f3wyljkw6so6yg7remntov-9199574104.asia-southeast1.run.app/assets/desktop-wallpaper.jpg", "logo2")}
                  className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-mono text-slate-300 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{copiedText === "logo2" ? "Link Copied!" : "Download High-Res JPG"}</span>
                </button>
              </div>

            </div>
          </div>

          {/* Color Palettes & Brand Values */}
          <div className="bg-slate-900/40 border border-slate-850/60 rounded-2xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-sm font-display font-black tracking-wider uppercase text-slate-300 flex items-center gap-2">
                <Palette className="w-4.5 h-4.5 text-cyan-400" />
                <span>Brand Colors & Color Swatches</span>
              </h2>
              <span className="text-[10px] font-mono text-slate-500">CLICK SWATCH TO COPY COLOR HEX</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => triggerCopy(c.hex, c.name)}
                  className="bg-slate-950/60 hover:bg-slate-900/80 border border-slate-850/80 hover:border-slate-750 p-3 rounded-xl transition-all text-left space-y-2 cursor-pointer group"
                >
                  <div className={`h-10 w-full rounded-lg ${c.bg} shadow-inner transition-transform group-hover:scale-[1.02]`} />
                  <div>
                    <p className="text-[11px] font-bold text-slate-200 truncate">{c.name}</p>
                    <p className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                      <span>{c.hex}</span>
                      <span className="text-[9px] text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">Copy</span>
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Core Analytics & Press Release */}
          <div className="bg-slate-900/40 border border-slate-850/60 rounded-2xl p-6 space-y-5">
            <h2 className="text-sm font-display font-black tracking-wider uppercase text-slate-300 flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-cyan-400" />
              <span>Target Metrics & Outreach</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950/50 border border-slate-850/60 p-4 rounded-xl text-center space-y-1">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Active Clientele</p>
                <p className="text-2xl font-display font-black text-cyan-400">8,500+</p>
                <p className="text-[10px] text-slate-400 font-mono">Registered gamers & recurring accounts</p>
              </div>

              <div className="bg-slate-950/50 border border-slate-850/60 p-4 rounded-xl text-center space-y-1">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Network Speed</p>
                <p className="text-2xl font-display font-black text-violet-400">1.2 Gbps</p>
                <p className="text-[10px] text-slate-400 font-mono">Dedicated fiber line buffer headroom</p>
              </div>

              <div className="bg-slate-950/50 border border-slate-850/60 p-4 rounded-xl text-center space-y-1">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Weekly Bookings</p>
                <p className="text-2xl font-display font-black text-emerald-400">180+</p>
                <p className="text-[10px] text-slate-400 font-mono">Online slot requests via GCash Gateways</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Vercel App Connection & Press Inquiry form */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Vercel App URL Customizer & Preview Box */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-850 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-display font-black tracking-wider uppercase text-slate-200 flex items-center gap-2">
                <Globe className="w-4.5 h-4.5 text-cyan-400" />
                <span>Vercel App Media Kit</span>
              </h2>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Connected to Vercel" />
            </div>

            <p className="text-xs text-slate-350 leading-relaxed">
              Add your own custom Vercel web app deployment link below to dynamically map and preview your live brand media kit.
            </p>

            {/* Custom URL Input block */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850/60 space-y-3">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">CONFIGURED VERCEL URL</span>
              {isEditingUrl ? (
                <form onSubmit={handleSaveUrl} className="space-y-2">
                  <input
                    type="text"
                    value={tempUrl}
                    onChange={(e) => setTempUrl(e.target.value)}
                    placeholder="e.g. vr-pasig-mediakit.vercel.app"
                    className="w-full bg-slate-900 border border-slate-800 text-xs px-3 py-2 rounded-lg text-white focus:outline-none focus:border-cyan-500/60"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setTempUrl(vercelUrl);
                        setIsEditingUrl(false);
                      }}
                      className="px-2.5 py-1 text-[10px] font-mono text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 text-[10px] font-mono bg-cyan-500 text-slate-950 rounded font-bold cursor-pointer"
                    >
                      Apply Link
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-slate-350 truncate select-all">{vercelUrl}</span>
                  <button
                    onClick={() => {
                      setTempUrl(vercelUrl);
                      setIsEditingUrl(true);
                    }}
                    className="text-[10px] text-cyan-400 hover:underline shrink-0 cursor-pointer"
                  >
                    Modify
                  </button>
                </div>
              )}
            </div>

            {/* External Redirect Actions */}
            <div className="flex gap-2">
              <a
                href={vercelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 bg-cyan-950/40 hover:bg-cyan-900/30 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Launch Live Kit</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setPreviewActive(!previewActive)}
                className={`px-3 py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                  previewActive
                    ? "bg-slate-900 border-slate-800 text-slate-300"
                    : "bg-slate-950 border-slate-900 text-slate-500"
                }`}
              >
                {previewActive ? "Hide Sandbox" : "Show Sandbox"}
              </button>
            </div>

            {/* Simulated Live Sandbox Frame */}
            {previewActive && (
              <div className="border border-slate-850 rounded-xl overflow-hidden bg-slate-950/60 p-1 relative">
                <div className="bg-slate-900/50 px-3 py-1.5 border-b border-slate-850/60 flex items-center justify-between text-[9px] font-mono text-slate-500">
                  <span className="truncate max-w-[150px]">{vercelUrl}</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="h-1 w-1 rounded-full bg-emerald-400" />
                    SSL Secure
                  </span>
                </div>
                
                {/* Simulated Web frame preview for instant feedback without iframe errors */}
                <div className="p-4 space-y-4 text-left max-h-[300px] overflow-y-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-widest">VR Pasig Cyber Kit</span>
                    <span className="text-[8px] font-mono text-slate-500">Ver: 1.0.0</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-white uppercase">Kapitolyo's Best VR Virtual Oasis</h3>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      We offer premium Virtual Reality setups featuring immersive high-refresh rate consoles and state-of-the-art broadband speed.
                    </p>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800/60 space-y-1.5">
                    <p className="text-[9px] font-mono text-slate-400">PARTNERSHIP CHANNELS</p>
                    <div className="flex items-center gap-2 text-[10px] text-cyan-300">
                      <span>• streamlabs.com/usagyuunvtuber</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Vercel App Code Deployment Block */}
          <div className="bg-slate-900/40 border border-slate-850/60 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-display font-black tracking-wider uppercase text-slate-300 flex items-center gap-2">
              <FileCode className="w-4.5 h-4.5 text-cyan-400" />
              <span>Vercel Deploy Source Code</span>
            </h2>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Deploy this media kit to Vercel easily. Copy the React template code below to bootstrap your deployment repository.
            </p>
            <button
              onClick={() => triggerCopy(vercelStarterCode, "starterCode")}
              className="w-full py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-750 text-xs font-mono text-slate-300 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-cyan-400" />
              <span>{copiedText === "starterCode" ? "Code Copied!" : "Copy Starter Code"}</span>
            </button>
          </div>

          {/* Contact & Brand Sponsorship inquiries */}
          <div className="bg-slate-900/40 border border-slate-850/60 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-display font-black tracking-wider uppercase text-slate-300 flex items-center gap-2">
              <Mail className="w-4.5 h-4.5 text-cyan-400" />
              <span>Inquiries & Sponsorships</span>
            </h2>

            {formSubmitted ? (
              <div className="bg-cyan-950/20 border border-cyan-800/40 p-4 rounded-xl text-center space-y-1">
                <Check className="w-8 h-8 text-cyan-400 mx-auto" />
                <h3 className="text-xs font-bold text-white">Proposal Transmitted</h3>
                <p className="text-[10px] text-slate-400">Our marketing representative will respond shortly to your email address.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg text-[11px] p-2 text-white focus:outline-none focus:border-cyan-500/40"
                />
                <input
                  type="email"
                  required
                  placeholder="Brand / Email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg text-[11px] p-2 text-white focus:outline-none focus:border-cyan-500/40"
                />
                <input
                  type="text"
                  required
                  placeholder="Company / Agency"
                  value={formBrand}
                  onChange={(e) => setFormBrand(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg text-[11px] p-2 text-white focus:outline-none focus:border-cyan-500/40"
                />
                <textarea
                  rows={2}
                  placeholder="Brief collaboration outline..."
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg text-[11px] p-2 text-white focus:outline-none focus:border-cyan-500/40 resize-none"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-cyan-500 to-violet-500 text-slate-950 font-bold font-display text-xs rounded-xl cursor-pointer hover:opacity-95 transition-opacity"
                >
                  Send Proposal Brief
                </button>
              </form>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
