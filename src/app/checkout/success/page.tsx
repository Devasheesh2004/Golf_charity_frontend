"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function CheckoutSuccess() {
  const router = useRouter();

  const { refreshUser, user } = useAuth();

  useEffect(() => {
    // Refresh user data immediately to catch the new subscription status
    if (user) {
      refreshUser();
    }

    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router, user, refreshUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 border-t border-slate-200 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-md w-full p-12 bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl shadow-emerald-500/5 relative z-10 mx-6 text-center">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner shadow-emerald-500/10">
          <CheckCircle className="w-14 h-14 text-emerald-600" />
        </div>
        
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Payment Recieved!</h1>
        <p className="text-slate-500 font-medium mb-10 leading-relaxed">
          Welcome to the family. Your subscription is active and you&apos;re now officially entered into the monthly draw.
        </p>

        <div className="space-y-6">
          <Link
            href="/dashboard"
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] flex justify-center items-center gap-3 group"
          >
            Go to Dashboard
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
            <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">Redirecting in 5s...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
