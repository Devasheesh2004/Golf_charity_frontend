"use client";

import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { CheckCircle, XCircle, Eye, Trophy, AlertCircle, Calendar, Hash, Mail } from "lucide-react";
import { toast } from "react-toastify";

interface Winner {
    id: string;
    draw_id: string;
    users?: { name: string, email: string };
    draws?: { date: string, draw_type: string, winning_numbers: number[] };
    prize_amount: number;
    matches: number;
    created_at: string;
    verification_status: "pending" | "paid" | "rejected" | "verified";
    proof_url?: string;
}

import Loader from "@/components/Loader";

export default function AdminWinnersPage() {
    const { user, loading: authLoading } = useAuth();
    const api = useApi();
    const router = useRouter();
    const [winners, setWinners] = useState<Winner[]>([]);
    const [loading, setLoading] = useState(true);
    
    const fetchWinners = useCallback(async () => {
        try {
            const data = await api.get<Winner[]>("/admin/winners");
            setWinners(data);
        } catch(err) {
            console.error("Failed to fetch winners", err);
        } finally {
            setLoading(false);
        }
    }, [api]);

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.role !== "admin") {
                router.push("/login");
            } else {
                fetchWinners();
            }
        }
    }, [user, authLoading, router, fetchWinners]);

    const handleAction = async (id: string, action: "paid" | "rejected") => {
        try {
            await api.post("/admin/verify-payout", { winnerId: id, status: action === "paid" ? "verified" : "rejected" });
            toast.success(action === "paid" ? "Winner payout verified!" : "Winner proof rejected.");
            await fetchWinners();
        } catch(err) {
            console.error("Action error:", err);
            toast.error("Failed to update status");
        }
    };

    if (authLoading || loading) return <Loader />;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans pb-20 p-4 sm:p-12">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 text-amber-400 rounded-2xl flex items-center justify-center font-black text-lg sm:text-xl shadow-xl shadow-slate-900/10">09</div>
                        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase">Winner Verification System</h1>
                    </div>
                    <p className="text-slate-500 font-medium text-base sm:text-lg max-w-2xl">Review payout evidence, verify score captures, and authorize prize distribution.</p>
                </header>

                <div className="bg-white border border-slate-200 rounded-4xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                            <tr>
                                <th className="px-6 py-6">Subscriber Details</th>
                                <th className="px-6 py-6">Prize Tier</th>
                                <th className="px-6 py-6">Draw Intel</th>
                                <th className="px-6 py-6">Evidence / Proof</th>
                                <th className="px-6 py-6">Status</th>
                                <th className="px-6 py-6 text-right">Verification</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {winners.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-10 py-32 text-center text-slate-400 font-bold italic">
                                        <div className="flex flex-col items-center gap-4 opacity-30">
                                            <Trophy className="w-12 h-12" />
                                            No winning records detected.
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                winners.map(w => (
                                    <tr key={w.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold">
                                                    {w.users?.name?.charAt(0) || "?"}
                                                </div>
                                                <div>
                                                    <div className="text-lg font-black text-slate-900">{w.users?.name || "Unknown Subscriber"}</div>
                                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        <Mail className="w-3 h-3 text-cyan-600" /> {w.users?.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-8">
                                            <div className="text-2xl font-black text-emerald-600 tracking-tighter">${w.prize_amount.toLocaleString()}</div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 w-max px-2 py-0.5 rounded-lg mt-1">{w.matches} Number Match</div>
                                        </td>
                                        <td className="px-6 py-8">
                                            <div className="flex items-center gap-2 text-sm font-black text-slate-900 mb-1">
                                                <Calendar className="w-4 h-4 text-slate-300" />
                                                {w.draws?.date ? new Date(w.draws.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                <Hash className="w-3 h-3 text-slate-400" /> {w.draw_id.slice(0, 8)} | {w.draws?.draw_type}
                                            </div>
                                        </td>
                                        <td className="px-6 py-8">
                                            {w.proof_url ? (
                                                <a 
                                                    href={w.proof_url} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 text-[10px] font-black text-cyan-600 hover:text-cyan-500 transition-colors bg-cyan-50 px-4 py-2.5 rounded-2xl border border-cyan-100 uppercase tracking-widest shadow-sm shadow-cyan-600/5 active:scale-95"
                                                >
                                                    <Eye className="w-4 h-4" /> Inspect Capture
                                                </a>
                                            ) : (
                                                <div className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 bg-slate-100 px-4 py-2.5 rounded-2xl uppercase tracking-widest italic opacity-60">
                                                    <AlertCircle className="w-4 h-4" /> Pending Proof
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-8">
                                            {w.verification_status === "verified" ? (
                                                <span className="px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-cyan-50 text-cyan-600 border border-cyan-100 flex items-center gap-2 w-max animate-pulse">
                                                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" /> Pending Review
                                                </span>
                                            ) : (
                                                <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-max border ${
                                                    w.verification_status === "paid" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                    w.verification_status === "rejected" ? "bg-rose-50 text-rose-600 border-rose-100" :
                                                    "bg-slate-100 text-slate-400 border-transparent"
                                                }`}>
                                                    {w.verification_status === "paid" && <CheckCircle className="w-3.5 h-3.5" />}
                                                    {w.verification_status === "rejected" && <XCircle className="w-3.5 h-3.5" />}
                                                    {w.verification_status}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-8 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button 
                                                    onClick={() => handleAction(w.id, "paid")}
                                                    disabled={w.verification_status !== "verified"}
                                                    className="p-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-600 rounded-2xl transition-all disabled:opacity-30 disabled:grayscale active:scale-95 shadow-sm shadow-emerald-500/10"
                                                    title="Approve & Mark Paid"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                                <button 
                                                    onClick={() => handleAction(w.id, "rejected")}
                                                    disabled={w.verification_status !== "verified"}
                                                    className="p-3 bg-rose-100 hover:bg-rose-200 text-rose-600 rounded-2xl transition-all disabled:opacity-30 disabled:grayscale active:scale-95 shadow-sm shadow-rose-500/10"
                                                    title="Reject Proof"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
