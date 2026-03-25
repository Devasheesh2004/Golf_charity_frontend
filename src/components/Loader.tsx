"use client";

import { Loader2 } from "lucide-react";

export default function Loader({ fullScreen = true }: { fullScreen?: boolean }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-ping scale-150" />
        <div className="relative bg-white p-6 rounded-[2.5rem] shadow-2xl border border-slate-100 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" strokeWidth={3} />
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-50/60 backdrop-blur-[2px] z-9999 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
