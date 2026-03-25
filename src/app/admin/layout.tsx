"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation"; // Added import for useRouter
import { useEffect } from "react"; // Added import for useEffect

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "admin") {
        router.push("/dashboard");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-900 font-bold">Authenticating Admin...</div>;
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans pb-20 p-4 sm:p-12 selection:bg-cyan-500/10">
      {children}
    </div>
  );
}
