"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, User, Mail, Lock, Heart, Trophy, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCharities, Charity } from "@/hooks/useCharities";
import { API_URL } from "@/lib/apiURL";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login, loading: authLoading } = useAuth();
  const { charities, loading: fetchingCharities } = useCharities();
  
  useEffect(() => {
    if (!authLoading && user) {
        if (user.role === "admin") router.push("/admin");
        else router.push("/dashboard");
    }
  }, [user, authLoading, router]);
  
  const [formData, setFormData] = useState({ name: "", email: "", password: "", charity_recipient: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Details, 2: OTP
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle pre-selected charity from URL
  useEffect(() => {
    const preselectedId = searchParams.get("charityId");
    if (preselectedId && !formData.charity_recipient) {
      setFormData(prev => ({ ...prev, charity_recipient: preselectedId }));
    }
  }, [searchParams, formData.charity_recipient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && !formData.charity_recipient) {
      setError("Please select a charity to support.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      if (step === 1) {
        const res = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to create account");

        if (data.otpRequired) {
          setStep(2);
        } else {
          router.push("/login");
        }
      } else {
        // Step 2: Verify OTP
        const res = await fetch(`${API_URL}/auth/verify-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, otp }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Invalid OTP");

        login(data.token, data.user);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 border-t border-slate-200 py-12">
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <form
        onSubmit={handleSubmit}
        className={`w-full ${step === 1 ? 'max-w-5xl' : 'max-w-md'} p-6 sm:p-12 bg-white border border-slate-200 rounded-[3rem] shadow-2xl relative z-10 mx-6 transition-all duration-700`}
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
             <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Trophy className="w-4 h-4 text-white" />
             </div>
             <span className="text-xs font-black uppercase tracking-widest text-emerald-600">ImpactGolf Community</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            {step === 1 ? "Start Your Impact" : "Verify Email"}
          </h2>
          <p className="text-slate-500 mt-3 font-medium text-lg leading-relaxed">
            {step === 1 ? "Join thousands of golfers turning scores into change." : `We've sent a 6-digit code to ${formData.email}`}
          </p>
        </div>

        {error && (
          <div className="p-4 mb-8 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm text-center font-bold animate-shake uppercase tracking-tight">
            {error}
          </div>
        )}

        <div className={`grid ${step === 1 ? 'lg:grid-cols-2 gap-16' : 'grid-cols-1'} items-start`}>
          {step === 1 ? (
             <>
                {/* Column 1: Personal Details */}
                <div className="space-y-6">
                  <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">1. Personal Information</div>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-50 border rounded-2xl py-4.5 pl-14 pr-6 outline-none focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 transition-all text-slate-900 font-bold placeholder:text-slate-400 border-transparent focus:bg-white"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="email"
                      required
                      className="w-full bg-slate-50 border rounded-2xl py-4.5 pl-14 pr-6 outline-none focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 transition-all text-slate-900 font-bold placeholder:text-slate-400 border-transparent focus:bg-white"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full bg-slate-50 border rounded-2xl py-4.5 pl-14 pr-12 outline-none focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 transition-all text-slate-900 font-bold placeholder:text-slate-400 border-transparent focus:bg-white"
                      placeholder="Create Password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-[0.98] flex justify-center items-center gap-3 group text-lg"
                    >
                        {loading ? "Processing..." : "Create Account"}
                        {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                    </button>
                  </div>
                </div>

                {/* Column 2: Charity Cards */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-xs font-black uppercase tracking-widest text-slate-400">2. Select Your Recipient</div>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-md font-black">CHOOSE ONE</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto pr-3 custom-scrollbar">
                    {fetchingCharities ? (
                        [1,2,3,4].map(i => <div key={i} className="h-40 bg-slate-50 animate-pulse rounded-3xl" />)
                    ) : (
                        charities.map((charity: Charity) => (
                           <label
                             key={charity.id}
                             className={`flex flex-col items-center justify-center p-6 bg-slate-50 border rounded-[2.5rem] transition-all cursor-pointer group text-center relative ${formData.charity_recipient === charity.id ? 'border-emerald-500 bg-emerald-50/50 shadow-inner' : 'border-transparent hover:border-slate-200 hover:bg-white'}`}
                           >
                             <input 
                                type="radio" 
                                name="charity" 
                                className="hidden" 
                                value={charity.id}
                                checked={formData.charity_recipient === charity.id}
                                onChange={() => setFormData({ ...formData, charity_recipient: charity.id })}
                             />
                             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all ${formData.charity_recipient === charity.id ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-500'}`}>
                               <Heart className={`w-6 h-6 ${formData.charity_recipient === charity.id ? 'fill-current' : ''}`} />
                             </div>
                             <h4 className={`text-sm font-black leading-tight ${formData.charity_recipient === charity.id ? 'text-slate-900 border-b-2 border-emerald-500/30' : 'text-slate-500 group-hover:text-slate-900'}`}>{charity.name}</h4>
                             {formData.charity_recipient === charity.id && (
                                <div className="absolute top-3 right-3">
                                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                </div>
                             )}
                           </label>
                        ))
                    )}
                  </div>
                </div>
             </>
          ) : (
            <div className="space-y-8">
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={6}
                  autoFocus
                  className="w-full bg-slate-50 border border-slate-200 rounded-4xl py-8 text-center text-5xl font-black tracking-[0.6em] outline-none focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 transition-all text-slate-900 shadow-inner placeholder:text-slate-200"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-[0.98] flex justify-center items-center gap-3 group cursor-pointer"
              >
                {loading ? "Verifying..." : "Enter Platform"}
                {!loading && <Trophy className="w-6 h-6 group-hover:rotate-12 transition-transform" />}
              </button>
              
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="w-full text-sm text-slate-400 hover:text-slate-700 transition-colors font-black flex items-center justify-center gap-2 uppercase tracking-widest"
              >
                Change Details
              </button>
            </div>
          )}
        </div>

        <p className="mt-12 text-center text-slate-500 text-sm font-bold uppercase tracking-widest">
          Already a member?{" "}
          <Link href="/login" className="text-emerald-600 hover:text-emerald-500 font-black hover:underline underline-offset-8">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function Signup() {
  return (
    <Suspense fallback={<div>Loading Signup...</div>}>
      <SignupContent />
    </Suspense>
  );
}
