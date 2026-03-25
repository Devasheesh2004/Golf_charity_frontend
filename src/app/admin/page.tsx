"use client";

import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Users, Trophy, Gift, CheckCircle } from "lucide-react";
import Loader from "@/components/Loader";

interface AdminStats {
  activeSubs: number;
  totalPrizePool: number;
  totalRaised: number;
  pendingProofs: number;
}

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const api = useApi();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchStats = async () => {
      try {
        const data = await api.get<AdminStats>("/admin/stats");
        if (mounted) setStats(data);
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      }
    };

    if (!loading) {
      if (!user || user.role !== "admin") {
        router.push("/login");
      } else {
        // Run fetch operation asynchronously
        void fetchStats();
      }
    }

    return () => {
      mounted = false;
    };
  }, [user, loading, router, api]);

  if (loading || user?.role !== "admin") {
    return <Loader />;
  }

  const modules = [
    { title: "User Directory", desc: "Monitor subscribers, manage billing states, and adjust user profiles.", icon: <Users className="w-8 h-8 text-cyan-600" />, href: "/admin/users" },
    { title: "Draw Configuration", desc: "Initialize prize pools, set winning numbers, and trigger algorithmic draws.", icon: <Trophy className="w-8 h-8 text-amber-600" />, href: "/admin/draws" },
    { title: "Charity Catalog", desc: "Audit charity listings, update impact descriptions, and manage featured status.", icon: <Gift className="w-8 h-8 text-rose-600" />, href: "/admin/charities" },
    { title: "Payout Verification", desc: "Review uploaded proof of scores and authorize winnings distribution.", icon: <CheckCircle className="w-8 h-8 text-emerald-600" />, href: "/admin/winners" },
  ];

  return (
      <main className="container mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-3">Systems Overview</h1>
          <p className="text-slate-500 font-medium text-lg">Global platform state and operations management interface.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            { label: "Active Subs", value: stats ? stats.activeSubs.toLocaleString() : "..." },
            { label: "Monthly Draw", value: stats ? `$${stats.totalPrizePool.toLocaleString()}` : "..." },
            { label: "Total Raised", value: stats ? `$${stats.totalRaised.toLocaleString()}` : "..." },
            { label: "Pending Proofs", value: stats ? stats.pendingProofs.toString() : "..." }
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-colors" />
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">{stat.label}</div>
              <div className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {modules.map((mod, idx) => (
            <div 
              key={idx} 
              onClick={() => router.push(mod.href)}
              className="bg-white border border-slate-200 rounded-[2.5rem] p-10 hover:border-cyan-500/30 transition-all cursor-pointer group relative overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-cyan-500/5"
            >
              <div className="absolute top-0 right-0 p-10 pointer-events-none group-hover:scale-110 transition-all duration-700 opacity-5 group-hover:opacity-10 scale-150">
                {mod.icon}
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-cyan-50 group-hover:border-cyan-100 transition-all duration-500 shadow-inner">
                  {mod.icon}
                </div>
                <h2 className="text-3xl font-black mb-3 tracking-tight text-slate-900 group-hover:text-cyan-700 transition-colors">{mod.title}</h2>
                <p className="text-slate-500 font-medium text-base leading-relaxed max-w-sm">{mod.desc}</p>
                <div className="mt-10 flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-cyan-600 group-hover:text-cyan-500 transition-colors">
                  Initialize Module <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
  );
}

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);
