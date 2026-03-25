"use client";

import { AuthProvider } from "@/context/AuthContext";
import { ToastContainer } from "react-toastify";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <ToastContainer position="top-center" theme="dark" autoClose={3000} />
    </AuthProvider>
  );
}
