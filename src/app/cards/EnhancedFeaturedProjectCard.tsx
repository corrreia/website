import React from "react";
import { EnhancedWindow } from "@/components/EnhancedWindow";
import { Button } from "@/components/ui/button";
import type { WindowState } from "@/lib/useWindowManager";

interface EnhancedFeaturedProjectCardProps {
  windowState: WindowState;
  onMouseDown: (e: React.MouseEvent) => void;
  onDragStart: (startX: number, startY: number) => void;
  onResizeStart: (direction: string, startX: number, startY: number) => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
}

export function EnhancedFeaturedProjectCard({
  windowState,
  onMouseDown,
  onDragStart,
  onResizeStart,
  onMinimize,
  onMaximize,
  onClose,
}: EnhancedFeaturedProjectCardProps) {
  return (
    <EnhancedWindow
      windowState={windowState}
      onMouseDown={onMouseDown}
      onDragStart={onDragStart}
      onResizeStart={onResizeStart}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onClose={onClose}
      variant="windows"
    >
      <h2 className="text-xl font-bold mb-2 text-foreground">
        Portfolio Website
      </h2>
      <p className="text-base text-muted-foreground mb-4">
        An interactive portfolio website built with Next.js, TypeScript, and
        Tailwind CSS. Features include drag-and-drop windows, theme switching,
        and responsive design.
      </p>

      <div className="space-y-3 mb-4">
        <div>
          <h3 className="font-semibold text-sm mb-1">Technologies Used:</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
              Next.js
            </span>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
              TypeScript
            </span>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
              Tailwind CSS
            </span>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
              React
            </span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-1">Features:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Draggable and resizable windows</li>
            <li>• Dark/light theme support</li>
            <li>• Responsive design</li>
            <li>• Modern UI components</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-2 mt-auto">
        <Button asChild variant="outline" className="flex-1">
          <a href="#" rel="noopener noreferrer">
            View Demo
          </a>
        </Button>
        <Button asChild variant="default" className="flex-1">
          <a href="#" rel="noopener noreferrer">
            View Source
          </a>
        </Button>
      </div>
    </EnhancedWindow>
  );
}
