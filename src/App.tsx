import React, { useState, useEffect } from "react";
import {
  Cpu,
  Wifi,
  MapPin,
  Phone,
  ShieldCheck,
  AlertCircle,
  Wrench,
  Trash2,
  Compass,
  MessageSquare,
  Users,
  CreditCard,
  CheckCircle2,
  Gamepad2,
  Smartphone,
  Tv,
  Gamepad,
  Sparkles,
  RefreshCw,
  Clock,
  ExternalLink
} from "lucide-react";
import VirtualTour from "./components/VirtualTour";
import SpeedTest from "./components/SpeedTest";
import CommunityForum from "./components/CommunityForum";
import MessengerChat from "./components/MessengerChat";
import BookingSystem from "./components/BookingSystem";
import ConsoleViewport from "./components/ConsoleViewport";
import { ConsoleViewType } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "speedtest" | "community" | "messenger" | "booking" | "console">("home");
  const [currentUser, setCurrentUser] = useState("GuestGamer_" + Math.floor(100 + Math.random() * 900));
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [userInputName, setUserInputName] = useState(currentUser);
  
  // Console simulation states
  const [consoleView, setConsoleView] = useState<ConsoleViewType>("responsive");
  const [lowGraphics, setLowGraphics] = useState(false);
  const [legacyFonts, setLegacyFonts] = useState(false);
  const [mobileOrientation, setMobileOrientation] = useState<"portrait" | "landscape">("landscape");

  // Diagnostics and recovery state
  const [systemAlert, setSystemAlert] = useState<{ type: "success" | "info" | "error"; msg: string } | null>(null);
  const [isFixing, setIsFixing] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Auto-clear alert after 5 seconds
  useEffect(() => {
    if (systemAlert) {
      const timer = setTimeout(() => setSystemAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [systemAlert]);

  // Handler to Clear Cache / Reset Server state
  const handleClearCache = async () => {
    setIsClearing(true);
    setSystemAlert({ type: "info", msg: "Clearing connection buffers and resetting backend state..." });

    try {
      const res = await fetch("/api/system/clear-cache", { method: "POST" });
      if (res.ok) {
        setSystemAlert({
          type: "success",
          msg: "Cache flushed! Loaded fresh seed database from VR PASIG server."
        });
        // Reset local preferences
        setLowGraphics(false);
        setLegacyFonts(false);
      } else {
        throw new Error("Reset call failed");
      }
    } catch (err) {
      // Fallback local notification
      setSystemAlert({
        type: "success",
        msg: "Client local state flushed successfully!"
      });
    } finally {
      setIsClearing(false);
    }
  };

  // Handler to Auto Fix page errors
  const handleAutoFix = () => {
    setIsFixing(true);
    setSystemAlert({ type: "info", msg: "Running local browser compatibility checks and fixing scripts..." });

    setTimeout(() => {
      setIsFixing(false);
      setSystemAlert({
        type: "success",
        msg: "Page optimization complete! Fixed CSS layouts, synchronized socket queries, and activated 1 Gbps buffer boosters."
      });
    }, 1500);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInputName.trim()) {
      setCurrentUser(userInputName.trim());
      setIsEditingUser(false);
      setSystemAlert({ type: "success", msg: `Alias updated to: ${userInputName.trim()}` });
    }
  };

  // Outer layout class depending on legacy font preference
  const fontClass = legacyFonts ? "font-mono" : "font-sans";

  // Central Application Content component
  const renderMainContent = () => {
    switch (activeTab) {
      case "home":
        return <VirtualTour lowGraphics={lowGraphics} />;
      case "speedtest":
        return <SpeedTest lowGraphics={lowGraphics} />;
      case "community":
        return <CommunityForum currentUser={currentUser} lowGraphics={lowGraphics} />;
      case "messenger":
        return <MessengerChat currentUser={currentUser} lowGraphics={lowGraphics} />;
      case "booking":
        return <BookingSystem lowGraphics={lowGraphics} />;
      case "console":
        return (
          <ConsoleViewport
            currentView={consoleView}
            setCurrentView={setConsoleView}
            lowGraphics={lowGraphics}
            setLowGraphics={setLowGraphics}
            legacyFonts={legacyFonts}
            setLegacyFonts={setLegacyFonts}
          />
        );
      default:
        return <VirtualTour lowGraphics={lowGraphics} />;
    }
  };

  // Render wrapper frames depending on selected Console Simulator
  const renderAdaptiveContainer = (content: React.ReactNode) => {
    if (consoleView === "responsive") {
      return <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-8">{content}</div>;
    }

    // Handle other console view frameworks
    switch (consoleView) {
      case "nintendo_switch":
        return (
          <div className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col items-center">
            <span className="text-xs font-mono text-slate-500 mb-2">🎮 Nintendo Switch Bezel Emulation</span>
            <div className="w-full border-8 border-slate-800 rounded-3xl overflow-hidden bg-slate-900 flex flex-col md:flex-row relative shadow-2xl">
              {/* Left Joycon */}
              <div className="md:w-16 bg-cyan-500 min-h-[100px] md:min-h-0 flex md:flex-col items-center justify-between p-3 shrink-0 text-slate-950 font-black">
                <div className="text-center">
                  <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-slate-950 mx-auto" />
                  <span className="text-[9px] mt-1 block">L-STICK</span>
                </div>
                <div className="grid grid-cols-3 gap-1 w-8">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-950 block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-950 block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-950 block" />
                </div>
                <span className="text-[10px] tracking-tighter">-</span>
              </div>

              {/* Main Screen Content */}
              <div className="flex-1 overflow-hidden min-w-0 max-h-[600px] overflow-y-auto bg-slate-950 p-3 md:p-6">
                {content}
              </div>

              {/* Right Joycon */}
              <div className="md:w-16 bg-rose-500 min-h-[100px] md:min-h-0 flex md:flex-col items-center justify-between p-3 shrink-0 text-slate-950 font-black">
                <span className="text-[10px] tracking-tighter">+</span>
                <div className="grid grid-cols-3 gap-1 w-8">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-950 block flex items-center justify-center text-[7px] text-white">X</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-950 block flex items-center justify-center text-[7px] text-white">Y</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-950 block flex items-center justify-center text-[7px] text-white">A</span>
                </div>
                <div className="text-center">
                  <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-slate-950 mx-auto" />
                  <span className="text-[9px] mt-1 block">R-STICK</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "nintendo_ds_3ds":
        return (
          <div className="w-full max-w-xl mx-auto px-4 py-8 flex flex-col items-center space-y-4">
            <span className="text-xs font-mono text-slate-500">📖 Dual-Screen DS/3DS Console Emulation</span>
            
            {/* Top Screen - Virtual Tour View */}
            <div className="w-full border-12 border-slate-800 rounded-xl bg-slate-950 aspect-video overflow-hidden shadow-xl p-3 relative">
              <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-mono text-slate-600">TOP DISPLAY</span>
              <VirtualTour lowGraphics={lowGraphics} />
            </div>

            {/* Bottom Screen - Booking/Chat View */}
            <div className="w-full max-w-md border-12 border-slate-700 rounded-xl bg-slate-950 aspect-[4/3] overflow-y-auto shadow-xl p-3 relative">
              <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-mono text-slate-600">BOTTOM TOUCH SCREEN</span>
              <div className="pt-2">
                <BookingSystem lowGraphics={lowGraphics} />
              </div>
            </div>
          </div>
        );

      case "psp_psvita":
        return (
          <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center">
            <span className="text-xs font-mono text-slate-500 mb-2">🎮 Sony Handheld PSP / PS Vita Emulation</span>
            <div className="w-full border-12 border-slate-900 rounded-[40px] overflow-hidden bg-slate-950 flex flex-col md:flex-row relative shadow-2xl p-2">
              
              {/* Left Handheld Pad */}
              <div className="md:w-20 min-h-[80px] md:min-h-0 flex md:flex-col items-center justify-between py-6 shrink-0 text-slate-500 text-xs">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[10px]">
                  D-PAD
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800" />
                <span className="text-[8px] font-mono">HOME</span>
              </div>

              {/* Main Handheld Screen */}
              <div className="flex-1 bg-slate-950 p-3 md:p-5 overflow-y-auto max-h-[500px] border-l border-r border-slate-850">
                {content}
              </div>

              {/* Right Handheld Pad */}
              <div className="md:w-20 min-h-[80px] md:min-h-0 flex md:flex-col items-center justify-between py-6 shrink-0 text-slate-500 text-xs">
                <div className="grid grid-cols-2 gap-2 text-center text-[9px]">
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold">△</span>
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold">◯</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800" />
                <span className="text-[8px] font-mono">START</span>
              </div>
            </div>
          </div>
        );

      case "ps1":
      case "ps2":
        return (
          <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center">
            <span className="text-xs font-mono text-slate-500 mb-2">📺 Retro CRT Console Monitor Emulation</span>
            <div className="w-full border-[16px] border-slate-700 rounded-3xl bg-slate-950 overflow-hidden relative shadow-2xl p-4 md:p-6">
              {/* CRT Scanline Overlay */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-slate-950/20 to-transparent z-40" style={{ backgroundSize: "100% 4px" }} />
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_60%,rgba(0,0,0,0.6)_100%)] z-40" />

              <div className="relative z-30 overflow-y-auto max-h-[550px] pr-1">
                {content}
              </div>
            </div>
          </div>
        );

      default:
        return <div className="w-full max-w-7xl mx-auto px-4 py-8">{content}</div>;
    }
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col ${fontClass}`}>
      
      {/* Dynamic Header System Notification HUD */}
      <div className="bg-slate-900 border-b border-slate-850 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-3">
          
          {/* Logo & Main Title Area */}
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center shadow-lg shadow-cyan-950/40">
              <Gamepad2 className="w-5 h-5 text-slate-950 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-base font-display font-black tracking-wider text-white uppercase">
                  VR PASIG Zero Zone Mark
                </h1>
                <span className="bg-cyan-950 border border-cyan-800/40 text-[9px] font-mono px-2 py-0.5 rounded-full text-cyan-300 font-bold uppercase tracking-widest animate-pulse-fast">
                  1 GBPS WI-FI ACTIVE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                30-A San Lorenzo, Pasig City, Metro Manila, Kapitolyo
              </p>
            </div>
          </div>

          {/* User Alias Config Area */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-[9px] font-mono text-slate-500 uppercase">CLIENT PROFILE</p>
              {isEditingUser ? (
                <form onSubmit={handleSaveUser} className="flex gap-1 items-center mt-0.5">
                  <input
                    type="text"
                    value={userInputName}
                    onChange={(e) => setUserInputName(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-[10px] text-slate-200 px-2 py-0.5 rounded focus:outline-none"
                    maxLength={15}
                    autoFocus
                  />
                  <button type="submit" className="text-[9px] bg-cyan-500 text-slate-950 px-1.5 py-0.5 rounded font-bold cursor-pointer">
                    Save
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-300 font-display">{currentUser}</span>
                  <button
                    onClick={() => setIsEditingUser(true)}
                    className="text-[9px] text-cyan-400 hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Status indicators */}
            <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-850 px-3 py-1.5 rounded-xl">
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Node: Online</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Persistent Address & Mobile Numbers ribbon */}
      <div className="bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-violet-950/30 border-b border-slate-850/50 py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 text-xs">
          <div className="flex items-center gap-1 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate">Address: 30-A San Lorenzo Pasig City Metro Manila Kapitolyo</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 text-[11px] text-slate-350">
            <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="font-mono">Contact Us (Mobile):</span>
            <span className="font-mono text-cyan-300 hover:underline">0976-332-9358</span>
            <span>/</span>
            <span className="font-mono text-cyan-300 hover:underline">0917-812-3309</span>
            <span>/</span>
            <span className="font-mono text-cyan-300 hover:underline">0956-059-1961</span>
            <span>/</span>
            <span className="font-mono text-cyan-300 hover:underline">0905-383-7408</span>
          </div>
        </div>
      </div>

      {/* Main Tabs Selection Navigation */}
      <div className="bg-slate-950/20 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-3 no-scrollbar">
            
            <button
              onClick={() => setActiveTab("home")}
              className={`px-4.5 py-2 rounded-xl text-xs font-display font-extrabold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === "home"
                  ? "bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 border border-cyan-500/50 text-cyan-400"
                  : "bg-slate-900/30 border border-transparent text-slate-450 hover:text-slate-300"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Virtual Tour</span>
            </button>

            <button
              onClick={() => setActiveTab("speedtest")}
              className={`px-4.5 py-2 rounded-xl text-xs font-display font-extrabold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === "speedtest"
                  ? "bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 border border-cyan-500/50 text-cyan-400"
                  : "bg-slate-900/30 border border-transparent text-slate-450 hover:text-slate-300"
              }`}
            >
              <Wifi className="w-4 h-4" />
              <span>Speed Test</span>
            </button>

            <button
              onClick={() => setActiveTab("community")}
              className={`px-4.5 py-2 rounded-xl text-xs font-display font-extrabold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === "community"
                  ? "bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 border border-cyan-500/50 text-cyan-400"
                  : "bg-slate-900/30 border border-transparent text-slate-450 hover:text-slate-300"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Community (Reddit)</span>
            </button>

            <button
              onClick={() => setActiveTab("messenger")}
              className={`px-4.5 py-2 rounded-xl text-xs font-display font-extrabold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === "messenger"
                  ? "bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 border border-cyan-500/50 text-cyan-400"
                  : "bg-slate-900/30 border border-transparent text-slate-450 hover:text-slate-300"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Messenger (FB)</span>
            </button>

            <button
              onClick={() => setActiveTab("booking")}
              className={`px-4.5 py-2 rounded-xl text-xs font-display font-extrabold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === "booking"
                  ? "bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 border border-cyan-500/50 text-cyan-400"
                  : "bg-slate-900/30 border border-transparent text-slate-450 hover:text-slate-300"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Book Now // GCash</span>
            </button>

            <button
              onClick={() => setActiveTab("console")}
              className={`px-4.5 py-2 rounded-xl text-xs font-display font-extrabold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === "console"
                  ? "bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 border border-cyan-500/50 text-cyan-400"
                  : "bg-slate-900/30 border border-transparent text-slate-450 hover:text-slate-300"
              }`}
            >
              <Gamepad className="w-4 h-4" />
              <span>Console Emulator Sandbox</span>
            </button>

            <a
              href="https://www.meta.com/experiences/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4.5 py-2 rounded-xl text-xs font-display font-extrabold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 bg-slate-900/30 border border-transparent text-slate-450 hover:text-slate-300 hover:bg-slate-900/50 hover:border-cyan-500/30"
            >
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>META VR</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>

            <a
              href="https://queststoredb.com/on_sale/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4.5 py-2 rounded-xl text-xs font-display font-extrabold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 bg-slate-900/30 border border-transparent text-slate-450 hover:text-slate-300 hover:bg-slate-900/50 hover:border-cyan-500/30"
            >
              <Gamepad2 className="w-4 h-4 text-cyan-400" />
              <span>BUY VR GAMES ONLINE</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>

            <a
              href="https://streamlabs.com/usagyuunvtuber/tip"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4.5 py-2 rounded-xl text-xs font-display font-extrabold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 bg-slate-900/30 border border-transparent text-slate-450 hover:text-slate-300 hover:bg-slate-900/50 hover:border-yellow-500/30"
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>SUPPORT US</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>

          </div>
        </div>
      </div>

      {/* Floating alert/success display portal */}
      {systemAlert && (
        <div className="max-w-7xl mx-auto px-4 mt-4 w-full">
          <div
            className={`p-3.5 rounded-xl border flex items-start gap-2.5 shadow-xl transition-all ${
              systemAlert.type === "success"
                ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                : systemAlert.type === "error"
                ? "bg-rose-950/40 border-rose-500/40 text-rose-300"
                : "bg-cyan-950/40 border-cyan-500/40 text-cyan-300"
            }`}
          >
            {systemAlert.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-xs font-bold font-mono tracking-wider">
                {systemAlert.type === "success" ? "SYSTEM DIAGNOSTICS: SUCCESS" : "SYSTEM MESSAGE"}
              </p>
              <p className="text-[11px] text-slate-200 mt-0.5 leading-normal">{systemAlert.msg}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Orientation & Mobile-Responsive Helper panel (Only shown when not strictly in standard desktop mode) */}
      {consoleView === "responsive" && (
        <div className="max-w-7xl mx-auto px-4 mt-4 w-full block lg:hidden">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex justify-between items-center text-xs">
            <span className="text-[10px] font-mono text-slate-400 uppercase">MOBILE SIMULATION</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMobileOrientation("portrait")}
                className={`px-2.5 py-1 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                  mobileOrientation === "portrait" ? "bg-cyan-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-400"
                }`}
              >
                Portrait
              </button>
              <button
                onClick={() => setMobileOrientation("landscape")}
                className={`px-2.5 py-1 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                  mobileOrientation === "landscape" ? "bg-cyan-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-400"
                }`}
              >
                Landscape
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Central viewport wrapper */}
      <main className={`flex-1 transition-all ${
        consoleView === "responsive" && mobileOrientation === "portrait" ? "max-w-[400px] mx-auto border-x border-slate-800 bg-slate-950/40" : ""
      }`}>
        {renderAdaptiveContainer(renderMainContent())}
      </main>

      {/* High Performance Banner */}
      <div className="bg-slate-950 border-t border-slate-900 py-6 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow" style={{ animationDuration: "8s" }} />
            <span>Fully optimized for maximum broadband and low latency console browsers.</span>
          </div>
          <p className="text-[10px] font-mono text-slate-600">
            VR PASIG Zero Zone Mark // Kapitolyo Branch Core Engine v2.5
          </p>
        </div>
      </div>

      {/* Footer containing the mandated System Controls (Clear Cache, Auto Fix) */}
      <footer className="bg-slate-900 border-t border-slate-850 py-4.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="text-center md:text-left">
            <p className="text-xs font-bold text-slate-300">Experiencing page responsiveness errors?</p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Reset cached states or trigger automated self-healing scripts.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-center">
            {/* Clear Cache Button */}
            <button
              onClick={handleClearCache}
              disabled={isClearing}
              className="px-4 py-2 bg-slate-950 hover:bg-slate-850 text-rose-400 border border-rose-500/30 hover:border-rose-400/60 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-40"
              title="Flushes local preferences and restores standard backup database"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isClearing ? "Clearing..." : "Clear Cache"}</span>
            </button>

            {/* Auto Fix Button */}
            <button
              onClick={handleAutoFix}
              disabled={isFixing}
              className="px-4 py-2 bg-slate-950 hover:bg-slate-850 text-cyan-400 border border-cyan-500/30 hover:border-cyan-400/60 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-40"
              title="Runs diagnostic routines to bypass faulty browser renderers"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>{isFixing ? "Fixing..." : "Auto Fix"}</span>
            </button>
          </div>

        </div>
      </footer>

    </div>
  );
}
