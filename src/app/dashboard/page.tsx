"use client";

import { useAuth } from "@/context/AuthContext";
import { useScores } from "@/hooks/useScores";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Trophy, ArrowUpRight, TrendingUp, Heart, Trash2, Pencil, X, Check } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import Loader from "@/components/Loader";

import { useWinnings, WinningRecord } from "@/hooks/useWinnings";

export default function Dashboard() {
  const { user, refreshUser, loading } = useAuth();
  const { scores, fetching, submitScore, deleteScore, updateScore, error: scoreError } = useScores();
  const { stats, loading: statsLoading } = useDashboardStats();
  const { winnings, submitProof } = useWinnings();
  const router = useRouter();

  const [newScore, setNewScore] = useState("");
  const [editingScoreId, setEditingScoreId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [showProofModal, setShowProofModal] = useState<string | null>(null);
  const [proofUrl, setProofUrl] = useState("");

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else {
        refreshUser();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, router]);

  if (loading || statsLoading || (!user && !loading)) {
    return <Loader />;
  }

  const handleUpdate = async (id: number) => {
    const success = await updateScore(id, Number(editingValue));
    if (success) {
      setEditingScoreId(null);
      setEditingValue("");
    }
  };

  const handleVerify = async (winId: string) => {
      const success = await submitProof(winId, proofUrl);
      if (success) {
          setShowProofModal(null);
          setProofUrl("");
          toast.success("Verification submitted successfully!");
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans pb-20 p-2 sm:p-4 md:p-12">
      <main className="max-w-7xl mx-auto px-2 sm:px-6 py-4 sm:py-12">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-0.5 w-12 bg-emerald-500 rounded-full" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600">User Dashboard</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">Welcome back, {user?.name}</h1>
              <p className="text-slate-600 font-medium mt-3 text-base sm:text-lg max-w-xl">Manage your scores, track your impact, and get ready for the next draw.</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
          {/* Subscription Status */}
          <section className="bg-white border border-slate-200 rounded-[2.5rem] p-6 sm:p-10 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8">
              <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                <Trophy className="w-6 h-6" />
              </div>
            </div>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Member Status</h2>
            <div className="space-y-6">
              <div>
                <div className={`text-6xl font-black ${stats?.subscription?.status === 'active' ? 'text-slate-900' : 'text-slate-400'}`}>
                  {stats?.subscription?.status === 'active' ? 'Active' : 'Inactive'}
                </div>
                <div className="text-sm font-bold text-slate-500 mt-2 uppercase tracking-widest">
                  Plan: {stats?.subscription?.plan || 'None'}
                </div>
              </div>
              {stats?.subscription?.status === 'active' ? (
                <div className="text-sm font-black text-emerald-600 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  Next Draw: {stats?.participation?.next_draw_date ? new Date(stats.participation.next_draw_date).toLocaleDateString() : 'Pending'}
                </div>
              ) : (
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 text-emerald-600 font-black hover:gap-3 transition-all mt-4"
                >
                  Activate Membership <ArrowUpRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </section>

          {/* Charity Contribution */}
          <section className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8">
              <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                <Heart className="w-6 h-6" />
              </div>
            </div>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Philanthropy</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-1">
                  Supporting:
                </div>
                <div className="text-3xl font-black text-slate-900 leading-tight">
                  {stats?.charity?.name || 'No Charity Selected'}
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Total Distributed</div>
                  <div className="text-2xl font-black text-slate-900">${stats?.charity?.total_contributed || 0}</div>
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Contribution %</div>
                  <div className="text-2xl font-black text-slate-900">{stats?.charity?.percentage}%</div>
                </div>
              </div>
              <Link
                href="/charities"
                className="inline-flex items-center gap-2 text-slate-400 font-black text-xs hover:text-emerald-600 transition-colors pt-2"
              >
                Change Recipient <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          {/* Draw Participation & Winnings */}
          <section className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8">
              <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Winning Summary</h2>
            <div className="space-y-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">My Winnings</div>
                <div className="flex items-center gap-4">
                    <div className="text-5xl font-black text-slate-900">${stats?.winnings?.total_won || 0}</div>
                    <div className="text-xs font-bold text-slate-500 uppercase leading-relaxed">Total Prizes<br/>Paid Out</div>
                </div>
                <div className="pt-6 border-t border-slate-100">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Participation</div>
                    <div className="flex items-center justify-between text-xs font-black">
                        <span className="text-slate-400">Total Draws Entered</span>
                        <span className="text-slate-900">{stats?.participation?.total_draws_entered}</span>
                    </div>
                </div>
            </div>
          </section>
        </div>

        {/* Winnings & Verification Section */}
        {winnings.length > 0 && (
            <section className="bg-white border border-slate-200 rounded-[3rem] p-12 shadow-sm mb-8 overflow-hidden relative">
                <div className="absolute top-0 right-0 bg-emerald-500 text-white px-8 py-2 rounded-bl-3xl font-black text-xs uppercase tracking-widest">Winnings Track</div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">Prize Verification</h2>
                <p className="text-slate-500 font-medium mb-10">Verify your wins to bridge the gap between scores and payouts.</p>
                
                <div className="grid gap-4">
                    {winnings.map((w: WinningRecord) => (
                        <div key={w.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-6 sm:p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:border-emerald-200 transition-all group">
                            <div className="flex items-center gap-6 mb-4 md:mb-0">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black transition-all ${w.verification_status === 'paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-900 shadow-sm'}`}>
                                    {w.matches}
                                </div>
                                <div>
                                    <div className="text-lg font-black text-slate-900">Match {w.matches} Prize</div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Draw Date: {new Date(w.draws.date).toLocaleDateString()}</div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10">
                                <div className="text-left sm:text-right">
                                    <div className="text-2xl font-black text-emerald-600">${w.prize_amount.toLocaleString()}</div>
                                    <div className={`text-[10px] font-black uppercase tracking-widest ${
                                        w.verification_status === 'paid' ? 'text-emerald-500' : 
                                        w.verification_status === 'verified' ? 'text-cyan-500' : 'text-amber-500'
                                    }`}>
                                        {w.verification_status}
                                    </div>
                                </div>

                                {w.verification_status === 'pending' && (
                                    <button 
                                        onClick={() => setShowProofModal(w.id)}
                                        className="bg-slate-900 hover:bg-slate-700 text-white font-black px-6 py-3 rounded-2xl transition-all text-sm active:scale-95 shadow-xl shadow-slate-900/10 w-full sm:w-auto text-center"
                                    >
                                        Submit Proof
                                    </button>
                                )}
                                {w.verification_status === 'verified' && (
                                    <div className="bg-cyan-50 text-cyan-600 font-black px-6 py-3 rounded-2xl text-sm border border-cyan-100 flex items-center gap-2 w-full sm:w-auto justify-center">
                                        <div className="w-1.5 h-1.5 bg-cyan-600 rounded-full animate-pulse" />
                                        In Review
                                    </div>
                                )}
                                {w.verification_status === 'paid' && (
                                    <div className="bg-emerald-50 text-emerald-600 font-black px-6 py-3 rounded-2xl text-sm border border-emerald-100 flex items-center gap-2 w-full sm:w-auto justify-center">
                                        <Check className="w-4 h-4" /> Paid
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Score Entry Form */}
          <section className="bg-white border border-slate-200 rounded-[2.5rem] sm:rounded-[3rem] p-6 lg:p-12 shadow-sm order-1 relative">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Submit Official Score</h2>
            <p className="text-slate-500 font-medium mb-10">Only your latest 5 scores are kept to calculate your handicap.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="number"
                min="1"
                max="45"
                placeholder="Stableford Score"
                value={newScore}
                onChange={(e) => setNewScore(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-3xl p-5 text-xl font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-300 w-full"
              />
              <button 
                onClick={async () => {
                  const success = await submitScore(Number(newScore));
                  if (success) setNewScore("");
                }}
                disabled={fetching}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white px-10 py-5 sm:py-0 rounded-3xl font-black transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/20 w-full sm:w-auto"
              >
                {fetching ? "..." : "Submit"}
              </button>
            </div>
            {scoreError && (
              <p className="mt-4 text-sm font-bold text-rose-500 flex items-center gap-2 animate-pulse">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                {scoreError}
              </p>
            )}
            <div className="mt-8">
              <div className="w-full bg-slate-100 h-2 my-6 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-1000" 
                  style={{ width: `${(scores.length / 5) * 100}%` }}
                />
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                {scores.length} of 5 scores required for full verification
              </p>
            </div>
          </section>

          {/* Score Track Record */}
          <section className="bg-white border border-slate-200 rounded-[2.5rem] sm:rounded-[3rem] p-6 lg:p-12 shadow-sm order-2 overflow-hidden">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Recent Track Record</h2>
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
              {scores.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between p-6 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 rounded-4xl transition-all group">
                  <div className="flex items-center gap-5">
                    {editingScoreId === s.id ? (
                      <input 
                        type="number"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="w-14 h-14 bg-white border-2 border-emerald-500 rounded-2xl flex items-center justify-center font-black text-slate-900 text-xl text-center focus:outline-none"
                        autoFocus
                      />
                    ) : (
                      <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center font-black text-slate-900 text-xl group-hover:border-emerald-500 transition-colors">
                        {s.value}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-black text-slate-900">Stableford Points</div>
                      <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Verified Entry</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-6 ml-4">
                    <div className="text-xs font-bold text-slate-400 tabular-nums lowercase shrink-0">
                        {new Date(s.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-all">
                      {editingScoreId === s.id ? (
                        <>
                          <button 
                            onClick={() => handleUpdate(s.id)}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                            title="Save Changes"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setEditingScoreId(null)}
                            className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all"
                            title="Cancel Edit"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => {
                              setEditingScoreId(s.id);
                              setEditingValue(s.value.toString());
                            }}
                            className="p-2 text-slate-400 sm:text-slate-300 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl transition-all"
                            title="Edit Score"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteScore(s.id)}
                            className="p-2 text-rose-400 sm:text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                            title="Delete Score"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {scores.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-slate-400 font-bold">No scores on record yet.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Proof Modal */}
      {showProofModal && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
              <div className="bg-white w-full max-w-xl rounded-[3rem] p-12 shadow-2xl relative">
                  <button onClick={() => setShowProofModal(null)} className="absolute top-8 right-8 p-3 hover:bg-slate-100 rounded-2xl transition-all">
                      <X className="w-6 h-6 text-slate-400" />
                  </button>
                  <h3 className="text-3xl font-black text-slate-900 mb-2">Verify Your Win</h3>
                  <p className="text-slate-500 font-medium mb-8 leading-relaxed">Please provide a URL to a screenshot of your official golf platform scores mirroring your entries here.</p>
                  
                  <div className="space-y-6">
                      <div>
                          <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-3">Screenshot URL (e.g. Imgur, Cloudinary)</label>
                          <input 
                            type="url"
                            value={proofUrl}
                            onChange={(e) => setProofUrl(e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                          />
                      </div>
                      <button 
                        onClick={() => handleVerify(showProofModal)}
                        disabled={!proofUrl}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 text-white font-black py-5 rounded-2xl text-lg shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
                      >
                          Submit for Review
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
