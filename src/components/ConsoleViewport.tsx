import React, { useState } from "react";
import { Monitor, Cpu, HelpCircle, Laptop, Settings, Sparkles, CheckCircle2 } from "lucide-react";
import { ConsoleViewType } from "../types";

interface ConsoleViewportProps {
  currentView: ConsoleViewType;
  setCurrentView: (view: ConsoleViewType) => void;
  lowGraphics: boolean;
  setLowGraphics: (lg: boolean) => void;
  legacyFonts: boolean;
  setLegacyFonts: (lf: boolean) => void;
}

interface ConsoleDetails {
  id: ConsoleViewType;
  name: string;
  resolution: string;
  aspect: string;
  browserType: string;
  notes: string;
  lowGraphicsRecommended: boolean;
}

const CONSOLE_LIST: ConsoleDetails[] = [
  {
    id: "responsive",
    name: "Modern Desktop/Mobile (Responsive)",
    resolution: "Dynamic",
    aspect: "Full Responsive",
    browserType: "Chrome / Safari / Edge",
    notes: "Default modern web browser configuration. Supports all animations and high-fidelity assets.",
    lowGraphicsRecommended: false
  },
  {
    id: "nintendo_switch",
    name: "Nintendo Switch Browser",
    resolution: "1280 x 720 (720p)",
    aspect: "16:9 Landscape",
    browserType: "NetFront Browser NX",
    notes: "Requires standard DNS redirection to open the browser. Touch controls fully supported.",
    lowGraphicsRecommended: false
  },
  {
    id: "ps5",
    name: "PlayStation 5 Web Portal",
    resolution: "3840 x 2160 (4K)",
    aspect: "16:9 Landscape",
    browserType: "WebKit (Modern)",
    notes: "Accessed by sending a link to a friend. Full flexbox and high-speed media streaming support.",
    lowGraphicsRecommended: false
  },
  {
    id: "ps4",
    name: "PlayStation 4 Internet Browser",
    resolution: "1920 x 1080 (1080p)",
    aspect: "16:9 Landscape",
    browserType: "WebKit-based NetFront",
    notes: "Standard integrated browser. Fully compatible with layout engines. Speed is stable.",
    lowGraphicsRecommended: false
  },
  {
    id: "ps3",
    name: "PlayStation 3 (Classic)",
    resolution: "1280 x 720 / 480p",
    aspect: "16:9 / 4:3",
    browserType: "NetFront Browser",
    notes: "Older browser. Turn off JavaScript errors in browser settings if prompt dialogs appear.",
    lowGraphicsRecommended: true
  },
  {
    id: "ps2",
    name: "PlayStation 2 (Retro Linux Browser)",
    resolution: "640 x 480 (480i CRT)",
    aspect: "4:3 CRT",
    browserType: "PS2 Linux Netscape / Konqueror",
    notes: "Simulates retro interlace scanlines and composite filter. Low Graphics and System Fonts recommended.",
    lowGraphicsRecommended: true
  },
  {
    id: "ps1",
    name: "PlayStation 1 (Simulated NetYaroze)",
    resolution: "320 x 240 (240p Scanline)",
    aspect: "4:3 Classic",
    browserType: "NetYaroze Homebrew Loader",
    notes: "Renders in monospaced scanline interface. Runs low-fidelity state engine for maximum nostalgia.",
    lowGraphicsRecommended: true
  },
  {
    id: "xbox_one",
    name: "Xbox One / Series X Edge",
    resolution: "1920 x 1080",
    aspect: "16:9 Wide",
    browserType: "Microsoft Edge (Chromium)",
    notes: "Fully featured modern Chromium browser. Excellent performance on controller and virtual pointer.",
    lowGraphicsRecommended: false
  },
  {
    id: "xbox_360",
    name: "Xbox 360 Internet Explorer",
    resolution: "1280 x 720 (HD)",
    aspect: "16:9",
    browserType: "IE9-based Fork",
    notes: "Clear cookie heap in Hub menu if layout loads slow. Zooming can be toggled with Left/Right Sticks.",
    lowGraphicsRecommended: true
  },
  {
    id: "nintendo_ds_3ds",
    name: "Nintendo DS / 3DS (Dual Screen)",
    resolution: "320 x 240 / 400 x 240",
    aspect: "Double Screens",
    browserType: "NetFront / Opera Mobile",
    notes: "Renders in unique dual-screen layout with top-screen active display and bottom-screen control pad.",
    lowGraphicsRecommended: true
  },
  {
    id: "psp_psvita",
    name: "Sony PSP / PS Vita Browser",
    resolution: "480 x 272 / 960 x 544",
    aspect: "16:9 Compact",
    browserType: "NetFront Compact Browser",
    notes: "PS Vita has multi-touch compatibility. PSP browser requires low image caching to avoid out-of-memory errors.",
    lowGraphicsRecommended: true
  }
];

export default function ConsoleViewport({
  currentView,
  setCurrentView,
  lowGraphics,
  setLowGraphics,
  legacyFonts,
  setLegacyFonts
}: ConsoleViewportProps) {
  const activeConsole = CONSOLE_LIST.find((c) => c.id === currentView) || CONSOLE_LIST[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-2xl space-y-6">
      
      {/* Upper header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight">
              Console Compatibility & View Sandbox
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Toggle simulated console viewports to see how our layout adapts to Nintendo Switch, classic PlayStations, Xbox, and dual-screen handhels!
          </p>
        </div>

        {/* Diagnostic switches */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setLowGraphics(!lowGraphics)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
              lowGraphics
                ? "bg-amber-950/40 border-amber-500/60 text-amber-400"
                : "bg-slate-850 border-slate-800 text-slate-400 hover:text-slate-300"
            }`}
          >
            <span>Low-Graphics: {lowGraphics ? "ENABLED" : "DISABLED"}</span>
          </button>

          <button
            onClick={() => setLegacyFonts(!legacyFonts)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
              legacyFonts
                ? "bg-purple-950/40 border-purple-500/60 text-purple-400"
                : "bg-slate-850 border-slate-800 text-slate-400 hover:text-slate-300"
            }`}
          >
            <span>Console-Fonts: {legacyFonts ? "ENABLED" : "DISABLED"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Console Selector List */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3.5">
          <h3 className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase pb-2 border-b border-slate-800 flex items-center gap-1.5">
            <Monitor className="w-4 h-4 text-cyan-400" />
            <span>Select Target Sandbox View</span>
          </h3>

          <div className="space-y-1 max-h-[360px] overflow-y-auto pr-1">
            {CONSOLE_LIST.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setCurrentView(c.id);
                  if (c.lowGraphicsRecommended) {
                    setLowGraphics(true);
                  }
                }}
                className={`w-full p-2.5 rounded-lg border text-left transition-all cursor-pointer block ${
                  currentView === c.id
                    ? "bg-gradient-to-r from-cyan-950/40 to-violet-950/40 border-cyan-500/60 text-white"
                    : "bg-slate-900/30 border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold leading-tight">{c.name}</p>
                  <span className="text-[9px] font-mono opacity-60 shrink-0">{c.aspect}</span>
                </div>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">{c.browserType}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Console Diagnostics & Tips */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2 pb-3 border-b border-slate-850">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">ACTIVE EMULATION PROFILE</span>
                <h3 className="text-base font-display font-extrabold text-white mt-0.5">{activeConsole.name}</h3>
              </div>

              <div className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-md text-[10px] font-mono text-slate-400">
                Res: <span className="text-slate-200">{activeConsole.resolution}</span>
              </div>
            </div>

            {/* Spec details rows */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs text-slate-350">
              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800/60 space-y-1">
                <p className="font-mono text-[10px] text-slate-500">BROWSER KERNEL</p>
                <p className="font-semibold text-slate-300">{activeConsole.browserType}</p>
              </div>

              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800/60 space-y-1">
                <p className="font-mono text-[10px] text-slate-500">OPTIMIZATION GUIDE</p>
                <p className="font-semibold text-slate-300">
                  {activeConsole.lowGraphicsRecommended ? "Low-Graphics mode recommended!" : "Full web specs supported!"}
                </p>
              </div>
            </div>

            {/* Compatibility notes box */}
            <div className="bg-slate-900/35 border border-slate-800 rounded-lg p-3 text-xs flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-slate-200">How to load on this console:</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {activeConsole.notes}
                </p>
              </div>
            </div>

            {/* Simulated Frame status badge */}
            <div className="bg-cyan-950/10 border border-cyan-500/25 rounded-lg p-3.5 text-xs text-cyan-400 flex items-start gap-2">
              <Cpu className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
              <div className="space-y-0.5">
                <p className="font-bold">Active Engine Adjustments:</p>
                <p className="text-[10px] text-slate-350 leading-relaxed">
                  The primary viewport automatically adapts page scale, CSS grid margins, image quality filters, and input polling frequency to match the hardware specs of the <span className="font-semibold text-white">{activeConsole.name}</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
