"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { WindowState } from "@/lib/useWindowManager";

interface EnhancedWindowProps {
  windowState: WindowState;
  onMouseDown: (e: React.MouseEvent) => void;
  onDragStart: (startX: number, startY: number) => void;
  onResizeStart: (direction: string, startX: number, startY: number) => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  children: React.ReactNode;
  variant?: "mac" | "windows" | "linux";
}

export function EnhancedWindow({
  windowState,
  onMouseDown,
  onDragStart,
  onResizeStart,
  onMinimize,
  onMaximize,
  onClose,
  children,
  variant = "mac",
}: EnhancedWindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = windowRef.current;
    if (!element) return;

    // Viewport bounds for maximized windows
    if (windowState.isMaximized) {
      element.style.width = "100vw";
      element.style.height = "100vh";
    }
  }, [windowState.isMaximized]);

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    // Don't start drag if clicking on a button
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }

    if (e.detail === 2) {
      // Double click to maximize/restore
      onMaximize();
    } else {
      onDragStart(e.clientX, e.clientY);
    }
    e.preventDefault();
  };

  const handleResizeMouseDown =
    (direction: string) => (e: React.MouseEvent) => {
      onResizeStart(direction, e.clientX, e.clientY);
      e.preventDefault();
      e.stopPropagation();
    };

  const getWindowStyle = () => {
    const baseStyle: React.CSSProperties = {
      position: "absolute",
      left: windowState.x,
      top: windowState.y,
      width: windowState.width,
      height: windowState.height,
      zIndex: windowState.zIndex,
      userSelect: "none",
    };

    if (windowState.isMaximized) {
      return {
        ...baseStyle,
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
      };
    }

    return baseStyle;
  };

  const renderWindowControls = () => {
    switch (variant) {
      case "mac":
        return (
          <div className="flex gap-2">
            <button
              className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff3b30] border border-[#e0443e] shadow-sm transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              title="Close"
            />
            <button
              className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ff9500] border border-[#dea123] shadow-sm transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onMinimize();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              title="Minimize"
            />
            <button
              className="w-3 h-3 rounded-full bg-[#27ca3f] hover:bg-[#28cd41] border border-[#20ac2e] shadow-sm transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onMaximize();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              title={windowState.isMaximized ? "Restore" : "Maximize"}
            />
          </div>
        );

      case "windows":
        return (
          <div className="flex">
            <button
              className="w-[46px] h-8 flex items-center justify-center hover:bg-[#f3f3f3] dark:hover:bg-[#404040] transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onMinimize();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              title="Minimize"
            >
              <div className="w-3 h-[1px] bg-[#0f0f0f] dark:bg-white"></div>
            </button>
            <button
              className="w-[46px] h-8 flex items-center justify-center hover:bg-[#f3f3f3] dark:hover:bg-[#404040] transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onMaximize();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              title={windowState.isMaximized ? "Restore" : "Maximize"}
            >
              <div className="w-2.5 h-2.5 border border-[#0f0f0f] dark:border-white bg-transparent"></div>
            </button>
            <button
              className="w-[46px] h-8 flex items-center justify-center hover:bg-[#c42b1c] hover:text-white transition-colors group"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              title="Close"
            >
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                <path
                  d="M1 1L11 11M11 1L1 11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        );

      case "linux":
        return (
          <div className="flex">
            <button
              className="w-8 h-7 flex items-center justify-center hover:bg-[#deddda] dark:hover:bg-[#3d3846] rounded transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              title="Close"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 4L12 12M12 4L4 12"
                  stroke="currentColor"
                  className="text-[#000006cc] dark:text-white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const getWindowClasses = () => {
    const baseClasses = "flex flex-col border shadow-lg overflow-hidden";

    switch (variant) {
      case "mac":
        return cn(
          baseClasses,
          "rounded-xl border-[#d0d0d0] dark:border-[#515151] bg-white dark:bg-[#1d1d20] shadow-2xl backdrop-blur-md"
        );
      case "windows":
        return cn(
          baseClasses,
          "rounded-lg border-[#e0e0e0] dark:border-[#3c3c3c] bg-white dark:bg-[#1e1e1e] shadow-xl"
        );
      case "linux":
        return cn(
          baseClasses,
          "rounded-lg border-[#c0bfbc] dark:border-[#5e5c64] bg-white dark:bg-[#1d1d20] shadow-lg"
        );
      default:
        return baseClasses;
    }
  };

  const getHeaderClasses = () => {
    const baseClasses =
      "flex items-center select-none cursor-grab active:cursor-grabbing";

    switch (variant) {
      case "mac":
        return cn(
          baseClasses,
          "gap-3 px-4 py-1.5 bg-[#fafafb] dark:bg-[#2e2e32]"
        );
      case "windows":
        return cn(
          baseClasses,
          "gap-2 px-3 py-2 bg-white dark:bg-[#2c2c2c] h-8"
        );
      case "linux":
        return cn(
          baseClasses,
          "gap-3 px-4 py-3 bg-[#f6f5f4] dark:bg-[#2e2e32]"
        );
      default:
        return baseClasses;
    }
  };

  const renderResizeHandles = () => {
    if (windowState.isMaximized) return null;

    return (
      <>
        {/* Corner handles */}
        <div
          className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize"
          onMouseDown={handleResizeMouseDown("nw")}
        />
        <div
          className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize"
          onMouseDown={handleResizeMouseDown("ne")}
        />
        <div
          className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize"
          onMouseDown={handleResizeMouseDown("sw")}
        />
        <div
          className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize"
          onMouseDown={handleResizeMouseDown("se")}
        />

        {/* Edge handles */}
        <div
          className="absolute top-0 left-2 right-2 h-1 cursor-n-resize"
          onMouseDown={handleResizeMouseDown("n")}
        />
        <div
          className="absolute bottom-0 left-2 right-2 h-1 cursor-s-resize"
          onMouseDown={handleResizeMouseDown("s")}
        />
        <div
          className="absolute left-0 top-2 bottom-2 w-1 cursor-w-resize"
          onMouseDown={handleResizeMouseDown("w")}
        />
        <div
          className="absolute right-0 top-2 bottom-2 w-1 cursor-e-resize"
          onMouseDown={handleResizeMouseDown("e")}
        />
      </>
    );
  };

  return (
    <div
      ref={windowRef}
      className={getWindowClasses()}
      style={getWindowStyle()}
      onMouseDown={onMouseDown}
    >
      {renderResizeHandles()}

      <div className={getHeaderClasses()} onMouseDown={handleHeaderMouseDown}>
        {variant === "mac" && renderWindowControls()}

        <div
          className={cn(
            "flex-1 text-center",
            variant === "windows" && "text-left"
          )}
        >
          <span className="font-medium text-sm text-[#000006cc] dark:text-white tracking-tight select-none">
            {windowState.title}
          </span>
        </div>

        {variant === "mac" && <div className="w-[42px]"></div>}
        {(variant === "windows" || variant === "linux") &&
          renderWindowControls()}
      </div>

      <div className="flex-1 flex flex-col p-4 sm:p-5 bg-white dark:bg-[#1d1d20] overflow-auto">
        {children}
      </div>
    </div>
  );
}
