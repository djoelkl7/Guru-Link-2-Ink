/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { Cpu, FileText, Activity, Loader2, Zap } from 'lucide-react';

interface LoadingStateProps {
  message: string;
  type: 'repo' | 'article';
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message, type }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const targetProgress = useRef(10); // Start at 10%
  
  // Theme configuration based on type
  const config = type === 'repo' ? {
    color: 'text-violet-400',
    bg: 'bg-violet-500',
    border: 'border-violet-500',
    shadow: 'shadow-violet-500/50',
    icon: Cpu,
    logPrefix: 'git',
    tasks: [
      "Fetching remote tree object...",
      "Parsing Abstract Syntax Tree...",
      "Mapping dependency graph...",
      "Identifying structural hotspots...",
      "Vectorizing node positions...",
      "Calculating force-directed layout...",
      "Optimizing render pipeline...",
      "Compiling WebGL assets...",
      "Finalizing lightmap bake..."
    ]
  } : {
    color: 'text-emerald-400',
    bg: 'bg-emerald-500',
    border: 'border-emerald-500',
    shadow: 'shadow-emerald-500/50',
    icon: FileText,
    logPrefix: 'web',
    tasks: [
      "Resolving DNS headers...",
      "Scraping DOM structure...",
      "Extracting semantic entities...",
      "Analyzing content density...",
      "Synthesizing visual metaphors...",
      "Determining optimal layout...",
      "Rasterizing vector layers...",
      "Applying style transfer...",
      "Generating final composite..."
    ]
  };

  const Icon = config.icon;

  // Smart Progress Logic based on message content
  useEffect(() => {
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes("connect") || lowerMsg.includes("fetch") || lowerMsg.includes("read") || lowerMsg.includes("init")) {
        targetProgress.current = 35;
    } else if (lowerMsg.includes("analyz") || lowerMsg.includes("research") || lowerMsg.includes("pars") || lowerMsg.includes("struct")) {
        targetProgress.current = 70;
    } else if (lowerMsg.includes("generat") || lowerMsg.includes("render") || lowerMsg.includes("design") || lowerMsg.includes("transform")) {
        targetProgress.current = 98;
    }
  }, [message]);

  // Smooth Progress Animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const diff = targetProgress.current - prev;
        if (Math.abs(diff) < 0.5) return prev;
        // Move 5% of the remaining distance per tick for smooth easing
        return prev + diff * 0.05;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Log Simulator
  useEffect(() => {
    setLogs([`> initializing ${config.logPrefix}_module...`]);
    
    const interval = setInterval(() => {
      setLogs(prev => {
        // Randomly decide to add a log or not to simulate variable processing speed
        if (Math.random() > 0.7) return prev;

        const nextLog = config.tasks[Math.floor(Math.random() * config.tasks.length)];
        const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
        const newLogs = [...prev, `[${timestamp}] ${nextLog} ... OK`];
        if (newLogs.length > 5) return newLogs.slice(newLogs.length - 5);
        return newLogs;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [type, config.tasks, config.logPrefix]);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center py-16 animate-in fade-in duration-700 relative">
      
      {/* Background Glow Effect - Enhanced */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${config.bg} rounded-full blur-[120px] opacity-[0.12] pointer-events-none mix-blend-screen animate-pulse`}></div>

      {/* Visual HUD */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-10">
        
        {/* Outer decorative ring */}
        <div className={`absolute inset-0 rounded-full border border-white/5 shadow-2xl backdrop-blur-sm bg-black/10`}></div>

        {/* Progress Ring (SVG) */}
        <div className="absolute inset-2">
            <svg className="w-full h-full -rotate-90 pointer-events-none filter drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]">
                {/* Track */}
                <circle
                    cx="50%" cy="50%" r="46%"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-slate-800/50"
                />
                {/* Value - with glow filter via class */}
                <circle
                    cx="50%" cy="50%" r="46%"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray="290%" // Approx circumference
                    strokeDashoffset={`${290 - (290 * progress / 100)}%`}
                    strokeLinecap="round"
                    className={`${config.color} transition-all duration-300 ease-out`}
                    style={{ filter: `drop-shadow(0 0 4px currentColor)` }}
                />
            </svg>
        </div>

        {/* Static Decorative Tick Marks */}
        <div className="absolute inset-0 rounded-full pointer-events-none">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <div 
                    key={deg} 
                    className="absolute w-1 h-2 bg-white/20 left-1/2 top-2 origin-[50%_120px]"
                    style={{ transform: `translateX(-50%) rotate(${deg}deg)` }}
                ></div>
            ))}
        </div>
        
        {/* Spinning Dashed Ring - Slow */}
        <div className={`absolute inset-10 rounded-full border border-dashed ${config.border} opacity-20 animate-[spin_12s_linear_infinite]`}></div>
        
        {/* Counter-Spinning Inner Ring - Fast */}
        <div className={`absolute inset-16 rounded-full border-2 border-t-transparent border-l-transparent ${config.border} opacity-40 animate-[spin_3s_linear_infinite_reverse]`}></div>

        {/* Central Core */}
        <div className={`relative z-10 w-28 h-28 rounded-full ${config.bg} bg-opacity-5 backdrop-blur-xl border border-white/10 flex items-center justify-center overflow-hidden shadow-inner group`}>
           <div className={`absolute inset-0 ${config.bg} opacity-10 animate-pulse`}></div>
           <Icon className={`w-12 h-12 ${config.color} relative z-10 animate-bounce`} style={{ animationDuration: '2s' }} />
           
           {/* Scan Effect Overlay */}
           <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent w-full h-[200%] -translate-y-full animate-scan pointer-events-none`}></div>
        </div>

        {/* Orbiting Particles */}
        <div className="absolute inset-0 animate-[spin_4s_linear_infinite]">
           <div className={`absolute top-6 left-1/2 -translate-x-1/2 w-2 h-2 ${config.bg} rounded-full shadow-[0_0_10px_currentColor] border border-white`}></div>
        </div>
        <div className="absolute inset-0 animate-[spin_5s_linear_infinite_reverse]">
           <div className={`absolute bottom-10 right-10 w-1.5 h-1.5 white rounded-full opacity-80 shadow-[0_0_8px_white]`}></div>
        </div>
      </div>

      {/* Message and Percentage */}
      <div className="text-center mb-8 relative z-10 space-y-2">
         <h3 className={`text-xl font-mono font-bold ${config.color} tracking-[0.2em] uppercase animate-pulse drop-shadow-lg`}>
            {message || 'PROCESSING'}
         </h3>
         <div className="flex items-center justify-center gap-3">
             <div className="h-px w-12 bg-gradient-to-r from-transparent to-slate-600"></div>
             <p className="text-xs font-mono text-slate-400 font-semibold">{Math.round(progress)}% COMPLETE</p>
             <div className="h-px w-12 bg-gradient-to-l from-transparent to-slate-600"></div>
         </div>
      </div>

      {/* Terminal Window */}
      <div className="w-full bg-slate-950/80 rounded-xl border border-white/10 p-4 font-mono text-xs relative overflow-hidden shadow-2xl backdrop-blur-md">
        {/* Window Controls */}
        <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
             <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700"></div>
             </div>
             <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-wider">
                <Activity className="w-3 h-3" /> kernel_log
             </div>
        </div>
        
        {/* Logs */}
        <div className="flex flex-col gap-1.5 h-24 justify-end relative z-10 overflow-hidden">
            {logs.map((log, i) => (
                <div key={i} className="text-slate-400 animate-in slide-in-from-left-2 fade-in duration-300 truncate font-medium flex items-center">
                    <span className={`${config.color} opacity-70 mr-2 text-[10px]`}>➜</span>
                    {log}
                </div>
            ))}
             <div className="flex items-center gap-2 text-slate-500 animate-pulse mt-1 pl-4 border-l border-slate-800 ml-1">
               <Zap className="w-3 h-3" />
               <span className="text-[10px] uppercase tracking-wider">Executing opcodes...</span>
            </div>
        </div>

        {/* Scanline Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20"></div>
      </div>
    </div>
  );
};
