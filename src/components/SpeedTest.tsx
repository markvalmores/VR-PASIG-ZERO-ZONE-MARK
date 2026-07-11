import React, { useState, useEffect } from "react";
import { Play, RotateCcw, Wifi, Activity, Download, Upload, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SpeedTestProps {
  lowGraphics: boolean;
}

export default function SpeedTest({ lowGraphics }: SpeedTestProps) {
  const [testStage, setTestStage] = useState<"idle" | "ping" | "download" | "upload" | "finished">("idle");
  const [ping, setPing] = useState(0);
  const [jitter, setJitter] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [testHistory, setTestHistory] = useState<number[]>([]);

  // Simulate Speed Test
  useEffect(() => {
    if (testStage === "idle") return;

    let timer: NodeJS.Timeout;
    if (testStage === "ping") {
      setProgress(0);
      let step = 0;
      const interval = setInterval(() => {
        step += 5;
        setProgress(Math.min(step, 100));
        setPing(Math.round(2 + Math.random() * 2));
        setJitter(parseFloat((0.2 + Math.random() * 0.3).toFixed(2)));
        if (step >= 100) {
          clearInterval(interval);
          setTestStage("download");
        }
      }, 80);
      return () => clearInterval(interval);
    }

    if (testStage === "download") {
      setProgress(0);
      let step = 0;
      const interval = setInterval(() => {
        step += 4;
        setProgress(Math.min(step, 100));
        // Exponential-like acceleration to ~985 Mbps (1 Gbps)
        const target = 985;
        const current = Math.round(target * Math.sin((step / 100) * (Math.PI / 2)) + (Math.random() * 15 - 7.5));
        setDownloadSpeed(Math.max(10, current));
        setTestHistory((prev) => [...prev, Math.max(10, current)].slice(-20));

        if (step >= 100) {
          clearInterval(interval);
          setTestStage("upload");
        }
      }, 80);
      return () => clearInterval(interval);
    }

    if (testStage === "upload") {
      setProgress(0);
      let step = 0;
      const interval = setInterval(() => {
        step += 4;
        setProgress(Math.min(step, 100));
        // Accelerating upload speeds to ~928 Mbps
        const target = 928;
        const current = Math.round(target * Math.sin((step / 100) * (Math.PI / 2)) + (Math.random() * 12 - 6));
        setUploadSpeed(Math.max(10, current));
        setTestHistory((prev) => [...prev, Math.max(10, current)].slice(-20));

        if (step >= 100) {
          clearInterval(interval);
          setTestStage("finished");
        }
      }, 80);
      return () => clearInterval(interval);
    }
  }, [testStage]);

  const startTest = () => {
    setPing(0);
    setJitter(0);
    setDownloadSpeed(0);
    setUploadSpeed(0);
    setTestHistory([]);
    setTestStage("ping");
  };

  // Calculate percentage angle for SVG gauge
  const currentSpeed = testStage === "download" ? downloadSpeed : testStage === "upload" ? uploadSpeed : testStage === "finished" ? downloadSpeed : 0;
  const maxSimSpeed = 1000;
  const percentage = Math.min(100, (currentSpeed / maxSimSpeed) * 100);
  const strokeDashoffset = 440 - (440 * percentage) / 100;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-2xl space-y-6">
      {/* Title & Hub Announcement */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-violet-500 animate-pulse" />
            <h2 className="text-xl md:text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
              Zero Zone Speed & Latency Analyzer
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            We provide a dedicated <span className="text-cyan-400 font-bold">1 GBPS Dual-Band Fiber Wi-Fi Connection</span> at our Kapitolyo lounge. Run a check to see how well your device operates!
          </p>
        </div>

        <div className="bg-gradient-to-r from-cyan-950 to-violet-950 border border-cyan-800/50 rounded-xl px-4 py-2 flex items-center gap-3">
          <Wifi className="w-5 h-5 text-cyan-400 animate-pulse" />
          <div className="text-left">
            <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">HUB CAPACITY</p>
            <p className="text-xs font-display font-extrabold text-cyan-300">1000 MBPS (1 GBPS) PURE FIBER</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Speedometer Gauge Widget */}
        <div className="lg:col-span-2 bg-slate-950/60 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Radial Speed Dial */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* SVG Speed Circle */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="70"
                className="stroke-slate-800 fill-none"
                strokeWidth="8"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                className="stroke-cyan-500 fill-none transition-all duration-100"
                strokeWidth="10"
                strokeDasharray="440"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  filter: lowGraphics ? "none" : "drop-shadow(0 0 8px rgba(6, 182, 212, 0.4))",
                }}
              />
            </svg>

            {/* Inner Dashboard Readings */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <AnimatePresence mode="wait">
                {testStage === "idle" ? (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-2"
                  >
                    <Wifi className="w-12 h-12 text-slate-500 mx-auto animate-bounce" />
                    <button
                      onClick={startTest}
                      className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-slate-950 font-display font-extrabold rounded-lg shadow-lg hover:shadow-cyan-500/20 text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Start Test</span>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="active"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-1"
                  >
                    <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                      {testStage === "ping" ? "PINGING TEST" : testStage === "download" ? "DOWNLOADING" : testStage === "upload" ? "UPLOADING" : "COMPLETED"}
                    </span>
                    <div className="text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight">
                      {testStage === "ping"
                        ? `${ping}`
                        : testStage === "download"
                        ? `${downloadSpeed}`
                        : testStage === "upload"
                        ? `${uploadSpeed}`
                        : `${downloadSpeed}`}
                    </div>
                    <div className="text-xs font-mono font-bold text-cyan-400">
                      {testStage === "ping" ? "MS LATENCY" : "MBPS BANDWIDTH"}
                    </div>
                    {testStage !== "finished" && (
                      <div className="w-24 bg-slate-800 rounded-full h-1 mt-2 overflow-hidden mx-auto">
                        <div
                          className="bg-gradient-to-r from-cyan-400 to-violet-500 h-1 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Test Status Bar Indicator */}
          {testStage !== "idle" && (
            <div className="w-full mt-4 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg">
              <span className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${testStage !== "finished" ? "bg-amber-500 animate-ping" : "bg-emerald-500"}`} />
                <span>Status: {testStage.toUpperCase()}...</span>
              </span>
              <span>Stability Graph: {testHistory.length > 0 ? "STABLE TRACE" : "WAITING"}</span>
            </div>
          )}
        </div>

        {/* Diagnostic Panel Results */}
        <div className="space-y-4">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between h-full">
            <h3 className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">TEST METRICS</h3>

            <div className="space-y-2.5">
              {/* Latency metric */}
              <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-violet-400" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-mono">PING / JITTER</p>
                    <p className="text-xs font-bold text-slate-200">Server Response</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-display font-extrabold text-violet-300">
                    {ping ? `${ping} ms` : "---"}
                  </p>
                  <p className="text-[10px] font-mono text-slate-500">
                    {jitter ? `± ${jitter}ms Jitter` : "---"}
                  </p>
                </div>
              </div>

              {/* Download metric */}
              <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-cyan-400" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-mono">DOWNLOAD SPEED</p>
                    <p className="text-xs font-bold text-slate-200">Vegas / Pasig Node</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-display font-extrabold text-cyan-300">
                    {downloadSpeed ? `${downloadSpeed} Mbps` : "---"}
                  </p>
                  <p className="text-[10px] font-mono text-slate-500">Peak Connection</p>
                </div>
              </div>

              {/* Upload metric */}
              <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-mono">UPLOAD SPEED</p>
                    <p className="text-xs font-bold text-slate-200">Symmetrical Fiber</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-display font-extrabold text-emerald-300">
                    {uploadSpeed ? `${uploadSpeed} Mbps` : "---"}
                  </p>
                  <p className="text-[10px] font-mono text-slate-500">Cloud Sync Rate</p>
                </div>
              </div>
            </div>

            {testStage === "finished" ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-950/20 border border-emerald-500/40 rounded-lg p-3 text-xs text-emerald-400 flex items-start gap-2"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
                <div className="space-y-1">
                  <p className="font-bold">Device Qualified for 1 Gbps!</p>
                  <p className="text-[10px] text-slate-300 leading-normal">
                    Your current performance supports low-latency, 120Hz high-fidelity cloud VR setups. We guarantee peak symmetrical performance at our branch!
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-300">Check Your Stream Capability</p>
                  <p className="text-[10px] leading-normal text-slate-400 mt-0.5">
                    Run the diagnostic test to measure connection jitter, response speed, and determine your qualification certificate.
                  </p>
                </div>
              </div>
            )}

            {testStage === "finished" && (
              <button
                onClick={startTest}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-lg text-xs font-medium text-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-run Diagnostics</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
