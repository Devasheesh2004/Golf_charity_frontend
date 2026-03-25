"use client";

import { useState } from "react";
import { ArrowLeft, Lock, Mail, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/lib/apiURL";

export default function AdminLogin() {
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to log in");
      
      if (data.user.role !== "admin") {
        throw new Error("This login is for administrators only.");
      }

      login(data.token, data.user);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden antialiased">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-full h-[500px] bg-linear-to-b from-emerald-50/50 to-transparent -z-10" />
      
      <Link 
        href="/" 
        className="absolute top-10 left-10 text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-black"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Site
      </Link>

      <div className="w-full max-w-md px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-white border border-slate-200 rounded-4xl mx-auto flex items-center justify-center mb-8 shadow-xl shadow-slate-200/50">
            <ShieldAlert className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3 uppercase italic">Admin Portal</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Restricted Access Authorization</p>
        </div>

        {error && (
          <div className="p-5 mb-8 bg-rose-50 border border-rose-100 text-rose-600 rounded-3xl text-sm flex items-center gap-4 font-bold shadow-sm animate-shake">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative group">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
            <input
              type="email"
              required
              placeholder="Administrator Email"
              className="w-full bg-white border border-slate-200 rounded-2xl py-5 pl-14 pr-6 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-900 font-bold placeholder:text-slate-300 shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
            <input
              type="password"
              required
              placeholder="Secure Password"
              className="w-full bg-white border border-slate-200 rounded-2xl py-5 pl-14 pr-6 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-900 font-bold placeholder:text-slate-300 shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl transition-all shadow-xl shadow-slate-200 active:scale-[0.98] disabled:opacity-50 uppercase tracking-[0.2em] text-sm cursor-pointer mt-4"
          >
            {loading ? "Authenticating..." : "Establish Connection"}
          </button>
        </form>

        <p className="mt-16 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
          Secure Terminal Integration v4.2.0 • ImpactGolf
        </p>
      </div>
    </div>
  );
}
