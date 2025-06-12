import React from "react";

interface WindowWinProps {
  title: string;
  children: React.ReactNode;
}

  return (
    <div className="h-full flex flex-col rounded-md border border-[#bfcad6] bg-gradient-to-br from-[#f3f6fa] to-[#e7ecf3] shadow-lg overflow-hidden">
      <div
        className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-[#e3eaf6] to-[#c7d4e9] border-b border-[#bfcad6] select-none cursor-grab active:cursor-grabbing"
        {...(typeof (window as any) !== 'undefined' && (window as any).dragHandleProps ? (window as any).dragHandleProps : {})}
      >
        <div className="flex gap-1 mr-2">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#0078d7] border border-[#005fa3] shadow-inner"></span>
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#f9d423] border border-[#bfa100] shadow-inner"></span>
        </div>
        <span className="font-semibold text-xs text-foreground/80 tracking-wide truncate flex-1">{title}</span>
        <span className="ml-auto flex gap-1">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#e81123] border border-[#a80000] shadow-inner"></span>
        </span>
      </div>
      <div className="flex-1 flex flex-col p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
}
