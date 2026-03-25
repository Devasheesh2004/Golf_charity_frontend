"use client";

import { useAuth } from "@/context/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, ArrowRight, Loader2 } from "lucide-react";

export default function Pricing() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const { initiateCheckout, processing } = useSubscription();

  // Refresh user data from server on mount to ensure we have the most recent subscription state
  useEffect(() => {
    if (!loading && user?.id) {
      refreshUser();
    }
  }, [loading, user?.id, refreshUser]);

  const handleSubscribe = async (planType: string) => {
    if (!user) {
      router.push("/signup");
      return;
    }
    await initiateCheckout(planType);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[40%] h-[40%] bg-cyan-500/5 rounded-full blur-[150px] -z-10" />

      <main className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-black mb-6 text-slate-900 tracking-tight">Select Your Impact Plan</h1>
        <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
          Join a community of golfers who turn every score into a positive force for change. Choose the level that fits your goals.
        </p>

        <div className="flex justify-center items-center gap-6 mb-20">
          <span className={`text-sm font-bold tracking-wide uppercase ${billing === "monthly" ? "text-emerald-600" : "text-slate-400"}`}>Monthly</span>
          <button 
            onClick={() => setBilling(billing === "monthly" ? "yearly" : "monthly")}
            className="w-20 h-10 bg-slate-200 rounded-full relative transition-all hover:bg-slate-300 focus:outline-none shadow-inner"
          >
            <div className={`w-8 h-8 bg-white rounded-full absolute top-1 transition-all shadow-md ${billing === "yearly" ? "left-11" : "left-1"}`} />
          </button>
          <span className={`text-sm font-bold tracking-wide uppercase ${billing === "yearly" ? "text-emerald-600" : "text-slate-400"}`}>Yearly (Save 20%)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {[
            {
              id: "standard",
              name: "Standard Impact",
              desc: "Perfect for casual golfers who want to play and give back.",
              price: billing === "monthly" ? 19 : 190,
              features: ["Enter 5 Stableford Scores", "Participate in Monthly Draws", "10% Min Charity Contribution", "Email Notifications"],
            },
            {
              id: "pro",
              name: "Pro Impact",
              desc: "For the dedicated golfer playing to maximize algorithm chances.",
              price: billing === "monthly" ? 49 : 490,
              features: ["Advanced Analytics", "Algorithmic Draw Priority", "Custom Charity Percentages", "Priority Customer Support"],
            }
          ].map((plan, idx) => {
            const planKey = `${plan.id}_${billing}`;
            const isActive = 
              user?.subscription_status?.toLowerCase() === "active" && 
              user?.subscription_plan?.toLowerCase() === planKey.toLowerCase();
            
            if (isActive) console.log(`[PRICING] Found active plan matches: ${planKey}`);
            if (user?.subscription_plan?.toLowerCase() === planKey.toLowerCase() && user?.subscription_status?.toLowerCase() !== "active") {
              console.warn(`[PRICING] Plan matched (${planKey}) but status is ${user?.subscription_status}`);
            }

            // High-impact active banner logic (fallback for other billing cycles)
            const isUserOnThisTierOnAnyCycle = user?.subscription_status?.toLowerCase() === "active" && user?.subscription_plan?.toLowerCase()?.startsWith(plan.id);
            const showActiveBanner = isActive || isUserOnThisTierOnAnyCycle;
            const hasActiveYearlyForThisTier = user?.subscription_status === "active" && user?.subscription_plan === `${plan.id}_yearly`;
            const isMonthlyDowngradeLocked = billing === "monthly" && hasActiveYearlyForThisTier;

            // Pro Superiority Logic (Standard is disabled if Pro is active)
            const isStandardPlan = plan.id === "standard";
            const hasActivePro = user?.subscription_status === "active" && user?.subscription_plan?.includes("pro");
            const isLockedByPro = isStandardPlan && hasActivePro;

            // Yearly Lifecycle Protection (If user has standard_yearly, they can't take pro_monthly)
            const isProPlan = plan.id === "pro";
            const hasActiveStandardYearly = user?.subscription_status === "active" && user?.subscription_plan === "standard_yearly";
            const isUpgradeLockedByYearlyTerm = isProPlan && billing === "monthly" && hasActiveStandardYearly;

            const isDisabled = !!processing || loading || isActive || isMonthlyDowngradeLocked || isLockedByPro || isUpgradeLockedByYearlyTerm;

            return (
              <div key={idx} className={`bg-white border rounded-[2.5rem] p-12 transition-all duration-500 flex flex-col items-start text-left relative overflow-hidden group shadow-sm hover:shadow-2xl hover:shadow-emerald-500/5 ${showActiveBanner ? 'border-emerald-500 ring-4 ring-emerald-500/5' : 'border-slate-200 hover:border-emerald-500/30'} ${isLockedByPro || isUpgradeLockedByYearlyTerm ? 'opacity-80' : ''}`}>
                {(idx === 1 || showActiveBanner) && !isActive && (
                   <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
                )}
                {showActiveBanner && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white px-6 py-2 rounded-bl-3xl font-black text-xs uppercase tracking-widest shadow-lg">
                    {isActive ? "Current Active Plan" : "Tier Active"}
                  </div>
                )}
                
                <h3 className="text-3xl font-black mb-3 text-slate-900">{plan.name}</h3>
                <p className="text-slate-500 mb-10 font-medium leading-relaxed">{plan.desc}</p>
                <div className="text-6xl font-black mb-10 text-slate-900 tracking-tighter">
                  ${plan.price}<span className="text-lg text-slate-400 font-bold tracking-normal italic">/{billing === "monthly" ? "mo" : "yr"}</span>
                </div>
                <ul className="space-y-5 mb-12 flex-1">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-4 group/item">
                      <div className="w-6 h-6 bg-emerald-50 rounded-lg flex items-center justify-center group-hover/item:bg-emerald-100 transition-colors">
                        <Check className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-600 font-bold">{feat}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => handleSubscribe(planKey)}
                  disabled={isDisabled}
                  className={`w-full py-5 rounded-2xl font-black transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer ${isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-none cursor-default' : (isMonthlyDowngradeLocked || isLockedByPro || isUpgradeLockedByYearlyTerm ? 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-200')}`}
                >
                  {processing === planKey ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                  ) : isActive ? (
                    <><Check className="w-5 h-5" /> Active Tier</>
                  ) : isLockedByPro ? (
                    <><Check className="w-5 h-5" /> Pro Tier Active</>
                  ) : isUpgradeLockedByYearlyTerm ? (
                    <><Check className="w-5 h-5" /> Annual Cycle Term</>
                  ) : isMonthlyDowngradeLocked ? (
                    <><Check className="w-5 h-5" /> Annual Cycle Active</>
                  ) : (
                    <>Continue with this Plan <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
