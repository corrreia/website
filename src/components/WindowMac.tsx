import React from "react";

interface WindowMacProps {
  title: string;
  children: React.ReactNode;
}

export function WindowMac({ title, children }: WindowMacProps) {
  return (
    <div className="h-full flex flex-col rounded-xl border border-border bg-gradient-to-br from-background to-muted shadow-lg overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#e0e0e0] to-[#c8c8c8] border-b border-border select-none">
        <div className="flex gap-1 mr-2">
          <span className="inline-block w-3 h-3 rounded-full bg-red-500 border border-red-700 shadow-inner"></span>
          <span className="inline-block w-3 h-3 rounded-full bg-yellow-400 border border-yellow-600 shadow-inner"></span>
          <span className="inline-block w-3 h-3 rounded-full bg-green-500 border border-green-700 shadow-inner"></span>
        </div>
        <span className="font-semibold text-xs text-foreground/70 tracking-wide truncate">{title}</span>
      </div>
      <div className="flex-1 flex flex-col p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
}
