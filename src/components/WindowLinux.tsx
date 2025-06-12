import React from "react";

interface WindowLinuxProps {
  title: string;
  children: React.ReactNode;
}

export function WindowLinux({ title, children }: WindowLinuxProps) {
  return (
    <div className="h-full flex flex-col rounded-md border border-border bg-gradient-to-br from-[#f3f4f6] to-[#e5e7eb] shadow-lg overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#e5e7eb] to-[#d1d5db] border-b border-border select-none">
        <div className="flex gap-1 mr-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#ff5555] border border-[#a80000] shadow-inner"></span>
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#f1fa8c] border border-[#bfa100] shadow-inner"></span>
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#50fa7b] border border-[#007a29] shadow-inner"></span>
        </div>
        <span className="font-semibold text-xs text-foreground/70 tracking-wide truncate">{title}</span>
      </div>
      <div className="flex-1 flex flex-col p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
}
