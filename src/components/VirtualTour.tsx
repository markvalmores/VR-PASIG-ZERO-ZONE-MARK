import React, { useState } from "react";
import { Compass, ZoomIn, ZoomOut, Info, MapPin, Eye, Volume2, VolumeX, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Hotspot {
  id: string;
  x: number; // percentage
  y: number; // percentage
  title: string;
  description: string;
  hardware: string;
}

interface TourScene {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  hotspots: Hotspot[];
}

const TOUR_SCENES: TourScene[] = [
  {
    id: "main-lounge",
    name: "Main VR Omni-Lounge",
    imageUrl: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1200&q=80",
    description: "Our high-capacity zone equipped with custom Oculus/Meta Quest 3 and HTC Vive Pro headsets. Calibrated tracking sensors cover the full 3x3m zones for unrestricted spatial movement.",
    hotspots: [
      {
        id: "h-main-1",
        x: 35,
        y: 45,
        title: "Meta Quest 3 Spatial Zone",
        description: "Equipped with high-performance Wi-Fi 6E streaming from our 1 Gbps fiber trunk.",
        hardware: "Oculus Quest 3 (128GB) + Premium Elite Straps + Pro Controllers"
      },
      {
        id: "h-main-2",
        x: 65,
        y: 35,
        title: "Ceiling Tether System",
        description: "Zero-drag cable retractors so you never trip over cords during high-action sessions.",
        hardware: "KIWI V2 Silent Cable Management Rig"
      }
    ]
  },
  {
    id: "vip-rig",
    name: "VIP Motion Flight & Racing Cockpit",
    imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
    description: "A premium motion-simulated rig configured for F1 2024, Assetto Corsa, and Microsoft Flight Simulator. Features direct-drive feedback and structural bass transducers.",
    hotspots: [
      {
        id: "h-vip-1",
        x: 48,
        y: 50,
        title: "Fanatec Direct Drive Wheel",
        description: "Direct-drive feedback delivers realistic gravel, kerb, and tire grip simulations.",
        hardware: "Fanatec DD2 Wheel Base + ClubSport V3 Loadcell Pedals"
      },
      {
        id: "h-vip-2",
        x: 72,
        y: 40,
        title: "Triple 144Hz Curve Setup",
        description: "Secondary high-refresh visual array for spectators or ultra-wide peripheral tracking.",
        hardware: "3x ASUS ROG 32\" 1440p Curve Displays"
      }
    ]
  },
  {
    id: "retro-arcade",
    name: "Kapitolyo Retro Lounge",
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    description: "Enjoy gaming history! From classic CRT-based consoles like PS1, PS2, and N64 up to modern co-op stations. Cozy beanbags, loaded game collections, and high-fidelity retro upscale boxes.",
    hotspots: [
      {
        id: "h-retro-1",
        x: 25,
        y: 55,
        title: "Retro CRT Corner",
        description: "Original Sony Trinitron CRTs with composite/RGB inputs for 100% accurate latency-free retro gaming.",
        hardware: "PS1, PS2, N64, Super Famicom with RetroTINK 5X Scalers"
      },
      {
        id: "h-retro-2",
        x: 75,
        y: 60,
        title: "Chill Lounge Area",
        description: "Spacious area for your friends to spectate, enjoy drinks, and browse with our 1 Gbps Wi-Fi.",
        hardware: "Custom Giant Beanbags & High-Fidelity Surround Sound"
      }
    ]
  }
];

interface VirtualTourProps {
  lowGraphics: boolean;
}

export default function VirtualTour({ lowGraphics }: VirtualTourProps) {
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isMuted, setIsMuted] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const activeScene = TOUR_SCENES[activeSceneIdx];

  const handleZoom = (direction: "in" | "out") => {
    setZoomLevel((prev) => {
      const next = direction === "in" ? prev + 0.25 : prev - 0.25;
      const bounded = Math.min(Math.max(next, 1), 2.5);
      if (bounded === 1) {
        setPanOffset({ x: 0, y: 0 });
      }
      return bounded;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel === 1) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning || zoomLevel === 1) return;
    const x = e.clientX - panStart.x;
    const y = e.clientY - panStart.y;
    // Bound the pan
    const maxPan = (zoomLevel - 1) * 200;
    setPanOffset({
      x: Math.min(Math.max(x, -maxPan), maxPan),
      y: Math.min(Math.max(y, -maxPan / 2), maxPan / 2)
    });
  };

  const handleMouseUpOrLeave = () => {
    setIsPanning(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-4 md:p-6 shadow-2xl space-y-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-500 animate-pulse" />
            <h2 className="text-xl md:text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
              Interactive VR Zone Virtual Tour
            </h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Explore 30-A San Lorenzo, Kapitolyo, Pasig. Click hotspots to inspect setups and gear.
          </p>
        </div>

        {/* Ambient controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              !isMuted ? "bg-cyan-950/40 border-cyan-500/50 text-cyan-400" : "bg-slate-800 border-slate-700 text-slate-400"
            }`}
            title={isMuted ? "Play Ambient Sounds" : "Mute Sounds"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{!isMuted ? "Ambient ON" : "Ambient Muted"}</span>
          </button>

          <span className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300">
            Wi-Fi Speed: 1 GBPS (⚡ Pure Fiber)
          </span>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {TOUR_SCENES.map((scene, idx) => (
          <button
            key={scene.id}
            onClick={() => {
              setActiveSceneIdx(idx);
              setZoomLevel(1);
              setPanOffset({ x: 0, y: 0 });
              setSelectedHotspot(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-display font-bold transition-all cursor-pointer ${
              activeSceneIdx === idx
                ? "bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-500/60 text-cyan-300 shadow-md shadow-cyan-950/20"
                : "bg-slate-800/50 border border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {scene.name}
          </button>
        ))}
      </div>

      {/* Interactive Stage */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 group select-none">
        {/* Navigation Compass HUD */}
        <div className="absolute top-4 left-4 z-20 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-lg p-2 flex items-center gap-2 text-xs text-slate-300">
          <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" style={{ animationDuration: "12s" }} />
          <span className="font-mono text-[10px] tracking-wider uppercase">{activeScene.id} // CAM_0{activeSceneIdx + 1}</span>
        </div>

        {/* Zoom & Pan HUD */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-lg p-1">
          <button
            onClick={() => handleZoom("out")}
            disabled={zoomLevel === 1}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 disabled:opacity-30 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="px-2 text-[10px] font-mono text-slate-400">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={() => handleZoom("in")}
            disabled={zoomLevel >= 2.5}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 disabled:opacity-30 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Ambient audio simulation status */}
        {!isMuted && (
          <div className="absolute bottom-4 left-4 z-20 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-lg px-2 py-1 flex items-center gap-1.5 text-[10px] text-emerald-400">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono uppercase tracking-wider">Playing: Ambient VR Hum & Chillout Beats</span>
          </div>
        )}

        {/* Main Canvas View */}
        <div
          className={`w-full h-full relative overflow-hidden transition-all duration-300 ${
            zoomLevel > 1 ? "cursor-grab active:cursor-grabbing" : ""
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
        >
          <div
            className={`w-full h-full relative transition-transform ease-out duration-100`}
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
              filter: lowGraphics ? "contrast(1.1) brightness(0.9) grayscale(0.25)" : "none",
            }}
          >
            <img
              src={activeScene.imageUrl}
              alt={activeScene.name}
              className="w-full h-full object-cover select-none pointer-events-none"
              referrerPolicy="no-referrer"
            />

            {/* Hotspots Overlay */}
            {activeScene.hotspots.map((hotspot) => (
              <button
                key={hotspot.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedHotspot(hotspot);
                }}
                className="absolute flex items-center justify-center p-2 rounded-full cursor-pointer group/node"
                style={{
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y}%`,
                  transform: "translate(-50%, -50%) scale(1.1)",
                }}
              >
                {/* Node wave ring */}
                <span className="absolute w-8 h-8 rounded-full bg-cyan-500/40 animate-ping" />
                <span className="absolute w-5 h-5 rounded-full bg-cyan-600/80 group-hover/node:scale-125 transition-transform" />
                <MapPin className="w-4 h-4 text-white relative z-10" />

                {/* Hotspot tooltip preview */}
                <span className="absolute top-full mt-2 hidden group-hover/node:block bg-slate-950/90 border border-slate-700 text-slate-100 text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-30 font-display">
                  {hotspot.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Hotspot Drawer Details Overlay */}
        <AnimatePresence>
          {selectedHotspot && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="absolute bottom-4 right-4 left-4 md:left-auto md:w-96 z-30 bg-slate-950/95 border border-cyan-500/50 rounded-xl p-4 shadow-xl backdrop-blur-md"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-1.5 text-cyan-400">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <h4 className="text-sm font-display font-bold tracking-tight">{selectedHotspot.title}</h4>
                </div>
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="text-slate-400 hover:text-slate-200 text-xs px-1.5 py-0.5 rounded border border-slate-800 hover:border-slate-600 bg-slate-900 cursor-pointer font-mono"
                >
                  ESC
                </button>
              </div>

              <p className="text-xs text-slate-300 mt-2 line-clamp-3">
                {selectedHotspot.description}
              </p>

              <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                <div className="text-[10px] font-mono text-slate-400">
                  <span className="text-slate-300 font-bold">Hardware Specs:</span> {selectedHotspot.hardware}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Description / Location Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-800/30 border border-slate-800 rounded-xl p-4">
        <div className="md:col-span-2 space-y-1">
          <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-400 uppercase">ZONE DETAILS</span>
          <h3 className="text-base font-display font-semibold text-slate-100">{activeScene.name}</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {activeScene.description}
          </p>
        </div>

        <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
          <span className="text-[10px] font-mono font-bold tracking-wider text-violet-400 uppercase">VISIT OUR HUB</span>
          <div className="text-xs space-y-1 text-slate-300">
            <p className="font-semibold text-slate-100 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>Kapitolyo Pasig Hub</span>
            </p>
            <p className="text-slate-400 text-[11px] leading-snug">
              30-A San Lorenzo, Pasig City, Metro Manila, Kapitolyo (near Pioneer)
            </p>
            <p className="text-slate-400 text-[11px]">
              Open daily: <span className="text-slate-200">9:00 AM - 11:00 PM</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
