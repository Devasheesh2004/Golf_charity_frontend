"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/lib/api";
import { Trophy, Play, CheckCircle, AlertCircle, Loader2, Info, ArrowUpCircle, Layers } from "lucide-react";
import { toast } from "react-toastify";

interface Draw {
  id: string;
  date: string;
  total_prize_pool: number;
  draw_type: string;
  winning_numbers: number[];
}

interface Simulation {
  logic: string;
  estimated_pool: number;
  rollover: number;
  winning_numbers: number[];
  allocations: { match5: number; match4: number; match3: number };
  preview_winners?: { match5: number; match4: number; match3: number };
}

export default function AdminDraws() {
  const { user, loading: authLoading } = useAuth();
  const api = useApi();
  
  const [logic, setLogic] = useState<"random" | "algorithmic">("random");
  const [simulation, setSimulation] = useState<Simulation | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [history, setHistory] = useState<Draw[]>([]);

  const fetchHistory = useCallback(async () => {
    try {
      const data = await api.get<Draw[]>("/admin/draws");
      setHistory(data);
    } catch {
      console.error("Failed to fetch history");
    }
  }, [api]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSimulate = async () => {
    setSimulating(true);
    setSimulation(null);
    try {
      const data = await api.post<Simulation>("/admin/draws/simulate", { logic });
      setSimulation(data);
      toast.success("Simulation completed successfully!");
    } catch {
      toast.error("Simulation failed. Ensure backend is running and database is seeded.");
    } finally {
      setSimulating(false);
    }
  };

  const handlePublish = async () => {
    if (!simulation) return;
    setPublishing(true);
    try {
      await api.post("/admin/draws/publish", {
        logic: simulation.logic,
        winning_numbers: simulation.winning_numbers,
        prize_pool: simulation.estimated_pool
      });
      toast.success("Draw published successfully!");
      setSimulation(null);
      fetchHistory();
    } catch {
      toast.error("Publishing failed");
    } finally {
      setPublishing(false);
    }
  };

  if (authLoading || user?.role !== 'admin') {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans pb-20 p-4 sm:p-12">
        <div className="max-w-7xl mx-auto">
            <header className="mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 text-amber-400 rounded-2xl flex items-center justify-center font-black text-lg sm:text-xl shadow-xl shadow-slate-900/10 shrink-0">06</div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase">Draw & Reward System</h1>
          </div>
          <p className="text-slate-500 font-medium text-base sm:text-lg max-w-2xl">Manage monthly prize distributions, simulation modes, and jackpot rollovers.</p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Configuration Wing */}
          <aside className="xl:col-span-1 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                    <Layers className="w-4 h-4" /> Strategy Selection
                </h3>
                
                <div className="space-y-3">
                    <button 
                        onClick={() => setLogic('random')}
                        className={`w-full p-6 rounded-3xl text-left transition-all border-2 ${logic === 'random' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'}`}
                    >
                        <div className="font-black mb-1">Random Generation</div>
                        <div className="text-[10px] opacity-70 uppercase font-bold tracking-widest">Standard Lottery Style</div>
                    </button>
                    
                    <button 
                        onClick={() => setLogic('algorithmic')}
                        className={`w-full p-6 rounded-3xl text-left transition-all border-2 ${logic === 'algorithmic' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'}`}
                    >
                        <div className="font-black mb-1">Algorithmic Distribution</div>
                        <div className="text-[10px] opacity-70 uppercase font-bold tracking-widest">Weighted by User Scores</div>
                    </button>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100">
                    <div className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Draw Tiers</div>
                    <div className="flex flex-wrap gap-2">
                        {['5-Number', '4-Number', '3-Number'].map(tier => (
                            <span key={tier} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter italic">
                                {tier} Match
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-4xl p-6 text-emerald-800">
                <div className="flex items-center gap-2 mb-2 font-black text-sm">
                    <Info className="w-4 h-4" /> Operational Note
                </div>
                <p className="text-xs font-semibold leading-relaxed opacity-80">
                    Draws are executed on a monthly cadence. Official publishing requires a successful pre-analysis simulation.
                </p>
            </div>
          </aside>

          {/* Main Execution Wing */}
          <main className="xl:col-span-3 space-y-8">
            <section className="bg-white border border-slate-200 rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 shadow-sm relative overflow-hidden">
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Prize Pool Analysis</h2>
                        <p className="text-slate-500 font-medium text-sm sm:text-base">Verify statistics and winner distribution before final commit.</p>
                    </div>

                    <button 
                        onClick={handleSimulate}
                        disabled={simulating}
                        className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 text-white font-black px-8 sm:px-10 py-5 sm:py-6 rounded-3xl sm:rounded-4xl transition-all flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20 active:scale-95 w-full sm:w-auto"
                    >
                        {simulating ? <Loader2 className="w-6 h-6 animate-spin text-cyan-400" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" fill="currentColor" />}
                        {simulating ? "Analyzing Data..." : "Run Simulation Mode"}
                    </button>
                </div>

                {simulation && (
                    <div className="mt-12 pt-12 border-t border-slate-100 animate-in fade-in slide-in-from-top-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                <div className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tighter mb-4">
                                    ${simulation.estimated_pool.toLocaleString()}
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                                    <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-widest text-xs">
                                        <Trophy className="w-4 h-4" /> Global Prize Pool
                                    </div>
                                    {simulation.rollover > 0 && (
                                        <div className="flex items-center gap-2 text-amber-600 font-black uppercase tracking-widest text-[10px] sm:text-xs bg-amber-50 px-3 py-1 rounded-full w-max">
                                            <ArrowUpCircle className="w-4 h-4" /> ${simulation.rollover.toLocaleString()} Rollover Included
                                        </div>
                                    )}
                                </div>

                                <div className="mt-10 flex flex-wrap gap-3 sm:gap-4">
                                    {simulation.winning_numbers.map((n, i) => (
                                        <div key={i} className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-lg sm:text-xl font-black shadow-lg">
                                            {n}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-[2.5rem] p-8 space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Distribution Preview</h4>
                                <div className="space-y-4">
                                    {[
                                        { tier: "5-Match Jackpot (40%)", amount: simulation.allocations.match5, count: simulation.preview_winners?.match5 || 0, color: "text-amber-500" },
                                        { tier: "4-Match Prize (35%)", amount: simulation.allocations.match4, count: simulation.preview_winners?.match4 || 0, color: "text-emerald-500" },
                                        { tier: "3-Match Prize (25%)", amount: simulation.allocations.match3, count: simulation.preview_winners?.match3 || 0, color: "text-cyan-500" },
                                    ].map(t => (
                                        <div key={t.tier} className="flex justify-between items-center group">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-slate-900">{t.tier}</span>
                                                <span className="text-[10px] font-bold text-slate-400">{t.count} Winner(s) Detected</span>
                                            </div>
                                            <div className={`text-xl font-black ${t.color}`}>${t.amount.toLocaleString()}</div>
                                        </div>
                                    ))}
                                </div>

                                <button 
                                    onClick={handlePublish}
                                    disabled={publishing}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 mt-6"
                                >
                                    {publishing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                                    Publish Official Monthly Results
                                </button>
                                
                                {simulation.preview_winners?.match5 === 0 && (
                                    <div className="text-[10px] text-amber-600 font-bold text-center mt-2 flex items-center justify-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> No Jackpot Winners: Rollover will be applied to next month.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </section>

            <section className="bg-white border border-slate-200 rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-6">Published Draw History</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {history.length === 0 ? (
                        <div className="md:col-span-2 py-20 text-center text-slate-400 italic font-medium flex flex-col items-center gap-2 opacity-40">
                            <Trophy className="w-12 h-12" />
                            No historical records found.
                        </div>
                    ) : (
                        history.map((draw) => (
                            <div key={draw.id} className="p-8 border border-slate-100 rounded-4xl bg-slate-50 hover:bg-white hover:shadow-xl transition-all group flex flex-col justify-between">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{new Date(draw.date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</div>
                                        <div className="text-2xl font-black text-slate-900">${draw.total_prize_pool.toLocaleString()}</div>
                                    </div>
                                    <span className="text-[10px] bg-slate-900 text-white px-3 py-1 rounded-full font-black uppercase tracking-widest scale-90 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {draw.draw_type}
                                    </span>
                                </div>
                                <div className="flex gap-2.5">
                                    {draw.winning_numbers.map((n, i) => (
                                        <div key={i} className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-sm font-black text-slate-900 shadow-sm">
                                            {n}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
          </main>
        </div>
        </div>
    </div>
  );
}
