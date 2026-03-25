"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function CheckoutCancel() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 border-t border-slate-200 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-md w-full p-12 bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl relative z-10 mx-6 text-center">
        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner shadow-rose-500/10">
          <AlertCircle className="w-14 h-14 text-rose-600" />
        </div>
        
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Payment Cancelled</h1>
        <p className="text-slate-500 font-medium mb-10 leading-relaxed">
          The payment process was interrupted. No charges were made to your account. Feel free to try again whenever you&apos;re ready!
        </p>

        <div className="space-y-6">
          <Link
            href="/pricing"
            className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-2xl transition-all active:scale-[0.98] flex justify-center items-center gap-3 group border border-slate-200"
          >
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            Back to Pricing
          </Link>
          <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">Questions? Contact Support</p>
        </div>
      </div>
    </div>
  );
}
