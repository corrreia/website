import React from "react";
import { EnhancedWindow } from "@/components/EnhancedWindow";
import type { WindowState } from "@/lib/useWindowManager";

interface EnhancedAboutMeCardProps {
  windowState: WindowState;
  onMouseDown: (e: React.MouseEvent) => void;
  onDragStart: (startX: number, startY: number) => void;
  onResizeStart: (direction: string, startX: number, startY: number) => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
}

export function EnhancedAboutMeCard({
  windowState,
  onMouseDown,
  onDragStart,
  onResizeStart,
  onMinimize,
  onMaximize,
  onClose,
}: EnhancedAboutMeCardProps) {
  return (
    <EnhancedWindow
      windowState={windowState}
      onMouseDown={onMouseDown}
      onDragStart={onDragStart}
      onResizeStart={onResizeStart}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onClose={onClose}
      variant="mac"
    >
      <div className="p-4 sm:p-5 h-full flex flex-col">
        <h2 className="text-xl font-bold mb-2 text-foreground">About Me</h2>
        <p className="text-base text-muted-foreground mb-4">
          I&apos;m Tomás Correia, a software engineer with a passion for
          building. I studied Computer Science at the University of Lisbon.
        </p>
        <p className="text-base text-muted-foreground mb-4">
          When I&apos;m not coding, I&apos;m usually tinkering with my home lab,
          my smart home, my network, or just enjoying the outdoors and spending
          time with my friends and family.
        </p>
        <p className="text-base text-muted-foreground mb-4">
          Here are some of the projects I use in my home lab:
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          <a
            href="https://home-assistant.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-[#41BDF5] hover:bg-[#369BD9] text-white transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            Home Assistant
          </a>
          <a
            href="https://proxmox.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-[#E57000] hover:bg-[#CC6600] text-white transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            Proxmox
          </a>
          <a
            href="https://docker.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-[#2496ED] hover:bg-[#1E7FC6] text-white transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            Docker
          </a>
        </div>
        <p className="text-sm text-muted-foreground opacity-75">
          I will add more here soon...
        </p>
      </div>
    </EnhancedWindow>
  );
}
