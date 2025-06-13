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
      <h2 className="text-xl font-bold mb-2 text-foreground">About Me</h2>
      <p className="text-base text-muted-foreground mb-4">
        I&apos;m a passionate developer who loves creating beautiful and
        functional user interfaces. I have experience with modern web
        technologies including React, Next.js, TypeScript, and Tailwind CSS.
      </p>
      <p className="text-base text-muted-foreground mb-4">
        When I&apos;m not coding, you can find me exploring new technologies,
        contributing to open source projects, or working on personal side
        projects that solve interesting problems.
      </p>
      <div className="mt-auto pt-4">
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
            Creative
          </span>
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
            Problem Solver
          </span>
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
            Team Player
          </span>
        </div>
      </div>
    </EnhancedWindow>
  );
}
