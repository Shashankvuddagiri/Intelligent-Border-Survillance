import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Shield, AlertTriangle, Activity, Map as MapIcon,
  Upload, Video, Image as ImageIcon, CheckCircle,
  XCircle, BarChart3, Clock, User, Truck, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = 'http://127.0.0.1:5000';

function App() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('image'); // 'image' or 'video'
  const [history, setHistory] = useState([]);
  const [nightMode, setNightMode] = useState(false);
  const [fusionMode, setFusionMode] = useState('rgb'); // 'rgb', 'thermal', 'dehaze'
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [advisorText, setAdvisorText] = useState("");
  const [roi, setRoi] = useState(null); // [x1, y1, x2, y2]
  const [drawing, setDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState(null);
  const [signalSent, setSignalSent] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setLoading(true);
    setAnalysis(null);
    setAdvisorText("");

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('enhance', nightMode);
    formData.append('fusion_mode', fusionMode);
    if (roi) formData.append('roi', JSON.stringify(roi));

    try {
      const endpoint = activeTab === 'image' ? '/analyze' : '/process-video';
      const res = await axios.post(`${API_BASE}${endpoint}`, formData);
      console.log("DEBUG: Analysis Endpoint:", endpoint);
      console.log("DEBUG: Response Data:", res.data);
      
      setAnalysis(res.data);

      const narrative = res.data.advisor?.narrative || res.data.tracking_summary;
      if (narrative) {
        // Typing effect
        let i = 0;
        const text = narrative;
        setAdvisorText("");
        const interval = setInterval(() => {
          setAdvisorText(text.slice(0, i));
          i++;
          if (i > text.length) clearInterval(interval);
        }, 10);
      }
      setHistory(prev => [{
        id: Date.now(),
        name: selectedFile.name,
        level: res.data.threat?.level || 'LOW',
        time: new Date().toLocaleTimeString()
      }, ...prev]);
    } catch (err) {
      console.error("Analysis failed", err);
      alert("Analysis failed. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignalCommand = () => {
    setSignalSent(true);
    setTimeout(() => setSignalSent(false), 3000);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col gap-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <header className="flex justify-between items-center glass p-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AEGIS <span className="text-blue-500">SENTINEL</span></h1>
            <p className="text-xs text-secondary mono">INTELLIGENT BORDER SURVEILLANCE</p>
          </div>
        </div>
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
            {['rgb', 'thermal', 'dehaze'].map((mode) => (
              <button
                key={mode}
                onClick={() => setFusionMode(mode)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${fusionMode === mode ? 'bg-blue-600 text-white shadow-lg' : 'text-secondary hover:text-white'}`}
              >
                {mode.toUpperCase()}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setNightMode(!nightMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${nightMode ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'bg-black/40 border-white/10 text-secondary'}`}
          >
            <Clock className={`w-4 h-4 ${nightMode ? 'text-indigo-200' : 'text-blue-500'}`} />
            {nightMode ? 'NIGHT VISION: ON' : 'ENVIRONMENT: DAY'}
          </button>
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs text-secondary font-semibold uppercase">Terminal Status</span>
            <span className="text-sm text-green-500 flex items-center gap-1 font-bold">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              OPERATIONAL
            </span>
          </div>
      </header>


      {/* Main Content */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">

        {/* Left Column: Controls & History */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <section className="glass p-6 flex flex-col gap-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-500" /> Control Center
            </h2>
            <div className="flex bg-black/40 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('image')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${activeTab === 'image' ? 'bg-blue-600 text-white shadow-lg' : 'text-secondary hover:text-white'}`}
              >
                <ImageIcon className="w-4 h-4" /> Static
              </button>
              <button
                onClick={() => setActiveTab('video')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${activeTab === 'video' ? 'bg-blue-600 text-white shadow-lg' : 'text-secondary hover:text-white'}`}
              >
                <Video className="w-4 h-4" /> Motion
              </button>
            </div>

            <div
              onClick={() => fileInputRef.current.click()}
              className="border-2 border-dashed border-border-color rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold">Deploy Asset</p>
                <p className="text-xs text-secondary mt-1">Upload {activeTab === 'image' ? 'JPG/PNG' : 'MP4/AVI'}</p>
              </div>
              <input
                type="file"
                hidden
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept={activeTab === 'image' ? "image/*" : "video/*"}
              />
            </div>
          </section>

          <section className="glass p-6 flex-grow overflow-hidden flex flex-col">
            <h2 className="text-sm font-bold uppercase text-secondary tracking-widest mb-4">Event Logs</h2>
            <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
              {history.length === 0 ? (
                <div className="text-center py-8 opacity-20">
                  <Clock className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-xs">No activity recorded</p>
                </div>
              ) : (
                history.map(item => (
                  <div key={item.id} className="bg-black/30 p-3 rounded-xl border border-white/5 flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold truncate max-w-[120px]">{item.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.level === 'CRITICAL' ? 'bg-red-900/50 text-red-400' :
                          item.level === 'HIGH' ? 'bg-orange-900/50 text-orange-400' :
                            'bg-green-900/50 text-green-400'
                        }`}>
                        {item.level}
                      </span>
                    </div>
                    <span className="text-[10px] text-secondary mono">{item.time}</span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Center Column: Viewer */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <section className="glass overflow-hidden relative min-h-[500px] flex items-center justify-center">
            <div className="scanner-line" />
            <AnimatePresence mode="wait">
              {!analysis && !loading && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-center flex flex-col items-center gap-4 p-12"
                >
                  <Activity className="w-16 h-16 text-blue-500/20" />
                  <p className="text-secondary text-sm max-w-sm">
                    Strategic Surveillance Interface. Deploy physical assets to begin real-time analysis and threat identification.
                  </p>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-6"
                >
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    <Shield className="w-8 h-8 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold animate-pulse">Analyzing Neural Patterns...</p>
                    <p className="text-xs text-secondary mono mt-1">Cross-referencing Global Threat DB</p>
                  </div>
                </motion.div>
              )}

              {analysis && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="relative w-full h-full cursor-crosshair"
                  onMouseDown={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width;
                    const y = (e.clientY - rect.top) / rect.height;
                    setDrawStart({ x, y });
                    setDrawing(true);
                  }}
                  onMouseMove={(e) => {
                    if (!drawing) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width;
                    const y = (e.clientY - rect.top) / rect.height;
                    setRoi([
                      Math.min(drawStart.x, x),
                      Math.min(drawStart.y, y),
                      Math.max(drawStart.x, x),
                      Math.max(drawStart.y, y)
                    ]);
                  }}
                  onMouseUp={() => setDrawing(false)}
                >
                  {analysis.video_url ? (
                    <video 
                      key={analysis.video_url}
                      className="w-full h-full object-contain bg-black"
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                    >
                      <source src={`${API_BASE}${analysis.video_url}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={`${API_BASE}${analysis.image_url}`}
                      className="w-full h-full object-contain"
                      alt="Current Feed"
                    />
                  )}
                  
                  {/* Neural Heatmap Overlay */}
                  {showHeatmap && (
                    <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen bg-blue-900/20" />
                  )}

                  {/* Virtual Fence Overlay */}
                  {roi && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute border-[2px] border-cyan-400 bg-cyan-500/10 pointer-events-none shadow-[0_0_15px_rgba(34,211,238,0.5)] z-20"
                      style={{
                        left: `${roi[0] * 100}%`,
                        top: `${roi[1] * 100}%`,
                        width: `${(roi[2] - roi[0]) * 100}%`,
                        height: `${(roi[3] - roi[1]) * 100}%`
                      }}
                    >
                      <div className="absolute -top-6 left-0 flex items-center gap-2 bg-cyan-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-t-lg backdrop-blur-sm border-t border-x border-cyan-300/30">
                        <Shield className="w-3 h-3 animate-pulse" />
                        <span className="tracking-[0.2em] uppercase">Tactical_Intrusion_Zone</span>
                        <span className="ml-2 px-1 bg-black/40 rounded">ACTIVE</span>
                      </div>
                      <div className="absolute inset-0 opacity-10 scanner-line h-full w-full" style={{ background: 'linear-gradient(transparent, #22d3ee, transparent)' }} />
                    </motion.div>
                  )}

                  {/* Detections Overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    {analysis.detections?.map((det, idx) => (
                      <div
                        key={idx}
                        className="absolute border-2 border-red-500 rounded"
                        style={{
                          left: `${(det.bbox[0] / 640) * 100}%`,
                          top: `${(det.bbox[1] / 640) * 100}%`,
                          width: `${((det.bbox[2] - det.bbox[0]) / 640) * 100}%`,
                          height: `${((det.bbox[3] - det.bbox[1]) / 640) * 100}%`,
                        }}
                      >
                        <span className="absolute -top-6 left-0 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
                          {det.label} ({(det.confidence * 100).toFixed(1)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Corner Indicators */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button 
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${showHeatmap ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-black/60 border-white/10 text-secondary'}`}
              >
                NEURAL_HEATMAP: {showHeatmap ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="absolute bottom-4 right-4 bg-black/60 p-4 rounded-xl border border-white/10 backdrop-blur max-w-[200px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-secondary font-bold uppercase">Grid Status</span>
                <Activity className="w-3 h-3 text-blue-400" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: '75%' }}
                    className="h-full bg-blue-500"
                  />
                </div>
                <span className="text-[9px] mono text-blue-400">LATENCY: 12ms</span>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-3 gap-6">
            <div className="glass p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-secondary text-xs font-bold uppercase">Humans</span>
                <User className="w-4 h-4 text-red-500" />
              </div>
              <span className="text-2xl font-bold">{analysis?.detections?.filter(d => d.label === 'person').length || 0}</span>
            </div>
            <div className="glass p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-secondary text-xs font-bold uppercase">Vehicles</span>
                <Truck className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-2xl font-bold">{analysis?.detections?.filter(d => ['car', 'truck', 'bus'].includes(d.label)).length || 0}</span>
            </div>
            <div className="glass p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-secondary text-xs font-bold uppercase">Environment</span>
                <MapIcon className="w-4 h-4 text-green-500" />
              </div>
              <span className="text-xs font-bold truncate uppercase">{analysis?.scene || 'Unmapped'}</span>
            </div>
          </section>
        </div>

        {/* Right Column: Threats & Intelligence */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Strategic Advisor Panel */}
          <section className="glass p-6 border-l-2 border-l-indigo-500 overflow-hidden">
             <h2 className="text-xs font-bold uppercase text-indigo-400 tracking-[0.2em] mb-4 flex items-center justify-between">
                SENTINEL STRATEGIC ADVISOR <Shield className="w-3 h-3" />
             </h2>
             <div className="min-h-[100px] flex flex-col gap-2">
                <p className="text-xs leading-relaxed text-slate-300 italic mono">
                  {advisorText || (loading ? "SITREP: Generating tactical reconnaissance report..." : "Standby for intelligence synthesis.")}
                  {advisorText && <motion.span animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-1.5 h-3 bg-indigo-500 ml-1" />}
                </p>
                
                {analysis?.advisor?.insights && (
                   <div className="grid grid-cols-1 gap-2 mt-4">
                      {analysis.advisor.insights.map((insight, idx) => (
                        <div key={idx} className="p-2 bg-white/5 rounded border border-white/5 flex flex-col">
                           <span className="text-[10px] text-secondary uppercase font-bold">{insight.title}</span>
                           <div className="flex justify-between items-baseline">
                              <span className="text-sm font-bold text-indigo-400">{insight.value}</span>
                              <span className="text-[9px] text-slate-500">{insight.desc}</span>
                           </div>
                        </div>
                      ))}
                   </div>
                )}
             </div>
          </section>

           <section className={`glass p-6 ${analysis?.threat?.level === 'CRITICAL' ? 'threat-critical' :
              analysis?.threat?.level === 'HIGH' ? 'threat-high' :
                'threat-low'
            }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <AlertTriangle className={`w-5 h-5 ${analysis?.threat?.level === 'CRITICAL' ? 'text-red-500 animate-pulse' : 'text-blue-500'
                  }`} /> Threat Profile
              </h2>
              {analysis?.threat && (
                <span className="text-lg font-bold mono">{(analysis.threat.score * 100).toFixed(0)}%</span>
              )}
            </div>
            {!analysis ? (
              <p className="text-xs text-secondary text-center py-12">Waiting for input data...</p>
            ) : (
                <div className="flex flex-col gap-6">
                  {analysis.tracking_summary ? (
                    <div className="p-4 bg-indigo-900/30 rounded-xl border border-indigo-400/30">
                       <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Video Tracking Report</h3>
                       <p className="text-xs text-slate-300 leading-relaxed mono">{analysis.tracking_summary}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase text-secondary tracking-widest">Risk Indicators</h3>
                      <div className="flex flex-col gap-2">
                        {analysis.threat?.reasons?.length > 0 ? (
                          analysis.threat.reasons.map((reason, i) => (
                            <div key={i} className="flex gap-3 p-3 bg-black/30 rounded-xl border border-white/5">
                              <div className="mt-1"><Info className="w-3 h-3 text-blue-400" /></div>
                              <p className="text-xs text-slate-300 leading-relaxed">{reason}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-green-400 font-bold italic">No active risk factors detected.</p>
                        )}
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={handleSignalCommand}
                    className="w-full py-3 bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-red-500/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    Signal Command Center
                  </button>
                </div>
              )}

          </section>

          <section className="glass p-6 flex flex-col gap-4">
             <h2 className="text-[10px] font-bold uppercase text-secondary tracking-widest flex items-center justify-between">
                Autonomous Systems <MapIcon className="w-3 h-3" />
             </h2>
             <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between p-2 bg-black/30 rounded-lg border border-white/5">
                   <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${analysis?.threat?.level === 'CRITICAL' ? 'bg-indigo-500 animate-pulse' : 'bg-slate-600'}`} />
                      <span className="text-[10px] mono">DRONE_SWARM_01</span>
                   </div>
                   <span className="text-[9px] text-secondary">{analysis?.threat?.level === 'CRITICAL' ? 'DEPLOYED' : 'READY'}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-black/30 rounded-lg border border-white/5">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-[10px] mono">ACOUSTIC_ARRAY</span>
                   </div>
                   <span className="text-[9px] text-secondary">VIBRATIONAL: NOMINAL</span>
                </div>
             </div>
          </section>

          {analysis?.advisor?.sectors && (
             <section className="glass p-4">
                <h2 className="text-[10px] font-bold uppercase text-secondary tracking-widest mb-3">Sector Density Analytcs</h2>
                <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10 rounded overflow-hidden">
                   {Object.entries(analysis.advisor.sectors).map(([sec, count]) => (
                     <div key={sec} className="bg-black/40 p-3 flex flex-col items-center">
                        <span className="text-[9px] text-secondary font-bold">{sec}</span>
                        <span className={`text-lg font-bold ${count > 0 ? 'text-indigo-400 animate-pulse' : 'text-slate-700'}`}>{count}</span>
                     </div>
                   ))}
                </div>
             </section>
          )}

          <section className="glass p-6 flex-grow">


            <h2 className="text-sm font-bold uppercase text-secondary tracking-widest mb-4 flex items-center justify-between">
              Data Distribution <BarChart3 className="w-4 h-4" />
            </h2>
            <div className="h-40 flex items-end justify-between gap-2 px-2">
              {[40, 70, 30, 90, 50].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  className="flex-1 bg-blue-500/20 border-t-2 border-blue-500 rounded-t-sm"
                />
              ))}
            </div>
            <p className="text-[10px] text-secondary mt-4 mono text-center">ANALYTICS ENGINE: ACTIVE_POLLING</p>
          </section>
        </div>

      </main>

      {/* Footer / Status Bar */}
      <footer className="glass p-4 px-6 flex justify-between items-center">
        <div className="flex gap-6 items-center text-[10px] mono text-secondary">
          <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" /> ENCRYPTION: AES-256</span>
          <span className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-500" /> JAMMING: INACTIVE</span>
        </div>
        <div className="text-[10px] mono text-secondary font-bold">
          COORDINATES: 28.6139° N, 77.2090° E
        </div>
      </footer>

      {/* Signal Command Toast */}
      <AnimatePresence>
        {signalSent && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="bg-red-600/90 backdrop-blur-xl border border-red-400/30 px-6 py-4 rounded-2xl shadow-2xl shadow-red-500/40 flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
               </div>
               <div>
                  <p className="text-white font-bold text-sm uppercase tracking-widest">Signal Transmitted</p>
                  <p className="text-red-100 text-[10px] mono">CMD_CHANNEL_ENCRYPTED: {new Date().toLocaleTimeString()}</p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
