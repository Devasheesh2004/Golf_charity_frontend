"use client";

import { useState } from "react";
import { useCharities, Charity } from "@/hooks/useCharities";
import { useCharitySelection } from "@/hooks/useCharitySelection";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Search, Heart, Star, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Loader from "@/components/Loader";

export default function CharitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { charities, loading, error } = useCharities();
  const { selectCharity, selecting } = useCharitySelection();
  const { user } = useAuth();
  const router = useRouter();

  const handleSupport = async (charityId: string) => {
    if (!user) {
      router.push(`/signup?charityId=${charityId}`);
      return;
    }
    await selectCharity(charityId);
  };

  const filteredCharities = charities.filter((c: Charity) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-rose-600 font-bold p-8 text-center">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <main className="container mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-8 bg-slate-200" />
            <span className="text-xs font-black uppercase tracking-[0.4em] text-emerald-600">The Giving Directory</span>
            <span className="h-px w-8 bg-slate-200" />
          </div>
          <h1 className="text-6xl font-black mb-6 text-slate-900 tracking-tight leading-[0.9]">Support a Cause</h1>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">
            Every score you record and every subscription renewal directly contributes to these amazing organizations. Select one to become your primary recipient.
          </p>
        </div>

        <div className="relative max-w-lg mx-auto mb-20 shadow-sm rounded-full overflow-hidden group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by mission or title..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-full py-5 pl-16 pr-8 outline-none focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 transition-all text-slate-900 font-bold placeholder:text-slate-400"
          />
        </div>

        {user && user.subscription_status !== 'active' && (
            <div className="max-w-4xl mx-auto mb-16 bg-emerald-600 rounded-[3rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-emerald-500/20">
                <div className="flex items-center gap-6">
                    <div className="bg-white/10 p-4 rounded-3xl">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black">Ready to Start Contributing?</h3>
                        <p className="text-emerald-50 font-medium">Activate your membership to turn your golf scores into impact.</p>
                    </div>
                </div>
                <Link href="/pricing" className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-emerald-50 transition-all active:scale-95 whitespace-nowrap">
                    View Pricing <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredCharities.length === 0 ? (
            <div className="col-span-full py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200 text-center text-slate-400 font-bold italic">
              No charities matched your search. Try another keyword!
            </div>
          ) : (
            filteredCharities.map((charity: Charity) => (
              <div key={charity.id} className="bg-white border border-slate-200 rounded-[3rem] p-10 hover:border-emerald-500/30 transition-all duration-500 flex flex-col items-center text-center relative group shadow-sm hover:shadow-2xl hover:shadow-emerald-500/5">
                {charity.featured && (
                  <div className="absolute top-8 right-8 bg-amber-400 text-white p-2.5 rounded-2xl shadow-lg shadow-amber-500/20 group">
                    <Star className="w-5 h-5 fill-current" />
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all pointer-events-none whitespace-nowrap shadow-xl">
                      Featured Charity
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-slate-900" />
                    </div>
                  </div>
                )}
                
                {user?.charity_recipient === charity.id && (
                    <div className="absolute top-8 left-8 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg shadow-emerald-500/20">
                        Primary Recipient
                    </div>
                )}

                <div className="bg-slate-50 w-28 h-28 rounded-4xl flex items-center justify-center mb-10 text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-500 transition-all duration-500 shadow-inner">
                  <Heart className="w-12 h-12" />
                </div>

                <h2 className="text-3xl font-black mb-4 text-slate-900 leading-none">{charity.name}</h2>
                <p className="text-slate-500 font-medium mb-8 flex-1 leading-relaxed text-sm px-4">{charity.description}</p>
                
                <div className="w-full pt-10 border-t border-slate-50 flex flex-col gap-6">
                  <div className="flex justify-start items-center px-2">
                    <div className="text-left">
                        <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Impact to Date</div>
                        <div className="text-2xl font-black text-emerald-600 tracking-tighter">${charity.total_raised?.toLocaleString() || 0}</div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleSupport(charity.id)}
                    disabled={selecting || user?.charity_recipient === charity.id}
                    className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-50 disabled:text-slate-300 text-white font-black py-5 rounded-3xl transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10 group/btn"
                  >
                    {user?.charity_recipient === charity.id ? (
                      <><CheckCircle2 className="w-6 h-6 text-emerald-400" /> Selected</>
                    ) : (
                      selecting ? "Synchronizing..." : <><Heart className="w-5 h-5 group-hover/btn:animate-pulse" /> Support this Cause</>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
