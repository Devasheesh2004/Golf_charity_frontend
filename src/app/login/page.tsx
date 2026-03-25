"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/lib/apiURL";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
  const router = useRouter();
  const { user, login, loading: authLoading } = useAuth();
  
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === "admin") router.push("/admin");
      else router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Credentials, 2: OTP
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (step === 1) {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to log in");

        if (data.otpRequired) {
          setStep(2);
        } else {
          // Admin login (direct)
          login(data.token, data.user);
        }
      } else {
        // Step 2: Verify OTP
        const res = await fetch(`${API_URL}/auth/verify-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 border-t border-slate-200">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 sm:p-10 bg-white border border-slate-200 rounded-3xl shadow-xl relative z-10 mx-6"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {step === 1 ? "Welcome Back" : "Security Check"}
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            {step === 1 ? "Sign in to your account" : `Authentication code sent to ${email}`}
          </p>
        </div>

        {error && (
          <div className="p-3 mb-6 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm text-center font-medium">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {step === 1 ? (
            <>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-12 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </>
          ) : (
            <div className="relative">
              <input
                type="text"
                required
                maxLength={6}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 text-center text-3xl font-black tracking-[0.5em] outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-900"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <p className="text-center text-sm text-slate-500 mt-4 leading-relaxed font-medium">Check your inbox for a verification code.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] flex justify-center items-center gap-2 group cursor-pointer"
          >
            {loading ? "Authenticating..." : step === 1 ? "Sign In" : "Verify & Continue"}
            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>

          {step === 2 && (
            <button 
              type="button" 
              onClick={() => setStep(1)}
              className="w-full text-sm text-slate-400 hover:text-slate-900 transition-colors font-medium"
            >
              Back to login
            </button>
          )}
        </div>

        {step === 1 && (
          <p className="mt-10 text-center text-slate-500 text-sm font-medium">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-emerald-600 hover:text-emerald-500 font-bold hover:underline underline-offset-4">
              Sign up
            </Link>
          </p>
        )}
      </form>
    </div>
  );
}
