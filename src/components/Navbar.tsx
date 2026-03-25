"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LogOut, LayoutDashboard, Heart, DollarSign, ArrowLeft, Menu, X, Shield, PlusCircle, Home } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMobileMenuOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navClasses = `sticky top-0 z-50 transition-all duration-300 ${
    scrolled 
      ? "border-b border-slate-200 bg-white/95 backdrop-blur-xl py-4 shadow-sm" 
      : "bg-white border-transparent py-6"
  }`;

  // Helper for active link detection
  const isActive = (path: string) => pathname === path;

  // Special presentation for Admin routes
  if (user?.role === "admin") {
    const isSubPage = pathname !== "/admin";
    
    return (
      <nav className={navClasses}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-4 group">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center font-black text-white italic shadow-lg group-hover:bg-cyan-600 transition-colors">
                IG
              </div>
              <div className="font-black text-xl tracking-tighter uppercase italic text-slate-900 hidden sm:block">
                Admin<span className="text-cyan-600">Control</span>
              </div>
            </Link>
            {isSubPage && (
              <>
                <div className="w-px h-6 bg-slate-200 mx-2 hidden sm:block"></div>
                <Link href="/admin" className="hidden sm:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-cyan-600 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Link>
              </>
            )}
          </div>
          <div className="flex gap-4 items-center">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security Access</span>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Master Admin</span>
            </div>
            <button
              onClick={logout}
              className="group px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 transition-all flex items-center gap-2 text-sm font-bold text-slate-700 shadow-sm active:scale-95 cursor-pointer"
            >
              <LogOut className="w-4 h-4 group-hover:text-rose-600 transition-colors" /> <span className="hidden sm:inline">Sign Out</span>
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 bg-slate-100 rounded-xl text-slate-600"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Admin Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-100 bg-white overflow-hidden shadow-2xl"
            >
              <div className="p-6 space-y-3">
                <Link href="/admin" className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${isActive("/admin") ? "bg-slate-900 text-white shadow-lg" : "hover:bg-slate-50 font-black text-slate-900 border border-transparent hover:border-slate-200"}`}>
                  <LayoutDashboard className={`w-5 h-5 ${isActive("/admin") ? "text-cyan-400" : "text-slate-400"}`} /> Admin Home
                </Link>
                <Link href="/admin/draws" className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${isActive("/admin/draws") ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/20" : "hover:bg-slate-50 font-black text-slate-900 border border-transparent hover:border-slate-200"}`}>
                  <PlusCircle className={`w-5 h-5 ${isActive("/admin/draws") ? "text-white" : "text-cyan-500"}`} /> Draws & Rewards
                </Link>
                <Link href="/admin/winners" className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${isActive("/admin/winners") ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "hover:bg-slate-50 font-black text-slate-900 border border-transparent hover:border-slate-200"}`}>
                  <Shield className={`w-5 h-5 ${isActive("/admin/winners") ? "text-white" : "text-emerald-500"}`} /> Winner Verification
                </Link>
                <Link href="/admin/charities" className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${isActive("/admin/charities") ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20" : "hover:bg-slate-50 font-black text-slate-900 border border-transparent hover:border-slate-200"}`}>
                  <Heart className={`w-5 h-5 ${isActive("/admin/charities") ? "text-white" : "text-rose-500"}`} /> Charity Catalog
                </Link>
                <Link href="/admin/users" className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${isActive("/admin/users") ? "bg-slate-900 text-white shadow-lg" : "hover:bg-slate-50 font-black text-slate-900 border border-transparent hover:border-slate-200"}`}>
                  <LayoutDashboard className={`w-5 h-5 ${isActive("/admin/users") ? "text-cyan-400" : "text-slate-400"}`} /> User Directory
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    );
  }

  // Standard/Public Navigation
  return (
    <nav className={navClasses}>
      <div className="container mx-auto px-6 flex justify-between items-center relative z-20">
        <Link href="/" className="font-black text-2xl text-slate-900 tracking-tight flex items-center gap-2 group">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-xs italic group-hover:scale-110 transition-transform">IG</div>
          Impact<span className="text-emerald-600">Golf</span>
        </Link>
        
        <div className="flex gap-8 items-center">
          <nav className="hidden md:flex gap-6">
            {user && (
              <Link href="/dashboard" className={`text-sm flex items-center gap-2 transition-colors ${isActive("/dashboard") ? "font-black text-slate-900" : "font-bold text-slate-500 hover:text-emerald-600"}`}>
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
            )}
            <Link href="/charities" className={`text-sm flex items-center gap-1.5 transition-colors ${isActive("/charities") ? "font-black text-slate-900" : "font-bold text-slate-500 hover:text-emerald-600"}`}>
              <Heart className="w-4 h-4" /> Charities
            </Link>
            <Link href="/pricing" className={`text-sm flex items-center gap-1.5 transition-colors ${isActive("/pricing") ? "font-black text-slate-900" : "font-bold text-slate-500 hover:text-emerald-600"}`}>
              <DollarSign className="w-4 h-4" /> Pricing
            </Link>
          </nav>

          <div className="h-4 w-px bg-slate-200 hidden md:block" />

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end gap-0.5">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Authenticated</span>
                  <span className="text-sm font-bold text-slate-900">{user.name}</span>
                </div>
                <div className="w-9 h-9 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center font-black text-emerald-600 shadow-inner">
                  {user.name?.[0].toUpperCase()}
                </div>
                <button 
                  onClick={logout}
                  className="hidden sm:flex bg-slate-50 hover:bg-rose-50 border border-slate-100 hover:border-rose-100 text-slate-500 hover:text-rose-600 px-4 py-2 rounded-xl transition-all active:scale-95 font-bold text-sm items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors hidden sm:block">Sign In</Link>
                <Link 
                  href="/signup" 
                  className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] sm:text-sm font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all shadow-lg active:scale-95"
                >
                  Join Now
                </Link>
              </div>
            )}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 bg-slate-50 rounded-xl text-slate-600 border border-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Public Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-100 bg-white overflow-hidden shadow-2xl relative z-10"
          >
            <div className="p-6 space-y-2">
              <Link href="/" className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${isActive("/") ? "bg-slate-900 text-white shadow-lg" : "hover:bg-slate-50 font-black text-slate-900"}`}>
                  <Home className={`w-5 h-5 ${isActive("/") ? "text-emerald-400" : "text-slate-400"}`} /> Home
              </Link>
              {user && (
                  <Link href="/dashboard" className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${isActive("/dashboard") ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "hover:bg-slate-50 font-black text-slate-900"}`}>
                      <LayoutDashboard className={`w-5 h-5 ${isActive("/dashboard") ? "text-white" : "text-emerald-600"}`} /> Dashboard
                  </Link>
              )}
              <Link href="/charities" className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${isActive("/charities") ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20" : "hover:bg-slate-50 font-black text-slate-900"}`}>
                <Heart className={`w-5 h-5 ${isActive("/charities") ? "text-white" : "text-rose-500"}`} /> Charities
              </Link>
              <Link href="/pricing" className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${isActive("/pricing") ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/20" : "hover:bg-slate-50 font-black text-slate-900"}`}>
                <DollarSign className={`w-5 h-5 ${isActive("/pricing") ? "text-white" : "text-cyan-400"}`} /> Pricing
              </Link>
              {user && (
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-rose-50 text-rose-600 font-black mt-4 transition-all"
                >
                  <LogOut className="w-5 h-5" /> Sign Out
                </button>
              )}
              {!user && (
                <Link href="/login" className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${isActive("/login") ? "bg-slate-900 text-white shadow-lg" : "hover:bg-slate-50 font-black text-slate-900"}`}>
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
