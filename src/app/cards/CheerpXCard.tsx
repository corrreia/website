import React, { useEffect, useRef, useState } from "react";
import { EnhancedWindow } from "@/components/EnhancedWindow";
import type { WindowState } from "@/lib/useWindowManager";

interface CheerPXCardProps {
  windowState: WindowState;
  onMouseDown: (e: React.MouseEvent) => void;
  onDragStart: (startX: number, startY: number) => void;
  onResizeStart: (direction: string, startX: number, startY: number) => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
}

export function CheerPXCard({
  windowState,
  onMouseDown,
  onDragStart,
  onResizeStart,
  onMinimize,
  onMaximize,
  onClose,
}: CheerPXCardProps) {
  const consoleRef = useRef<HTMLPreElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cxRef = useRef<any>(null); // CheerpX doesn't export proper types

  useEffect(() => {
    let mounted = true;

    const initializeCheerpX = async () => {
      try {
        setIsLoading(true);

        // Load CheerPX from CDN to avoid build issues
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const CheerpX = (window as any).CheerpX;
        if (!CheerpX) {
          throw new Error("CheerpX not loaded. Please refresh the page.");
        }

        if (!mounted) return;

        // Create devices
        const cloudDevice = await CheerpX.CloudDevice.create(
          "wss://disks.webvm.io/debian_large_20230522_5044875331.ext2"
        );

        if (!mounted) return;

        const idbDevice = await CheerpX.IDBDevice.create("cheerpx-block");
        const overlayDevice = await CheerpX.OverlayDevice.create(
          cloudDevice,
          idbDevice
        );

        if (!mounted) return;

        // Create CheerpX Linux instance
        const cx = await CheerpX.Linux.create({
          mounts: [{ type: "ext2", path: "/", dev: overlayDevice }],
        });

        if (!mounted) return;

        cxRef.current = cx;

        // Set up console
        if (consoleRef.current) {
          cx.setConsole(consoleRef.current);
        }

        setIsLoading(false);

        // Run bash
        await cx.run("/bin/bash", ["--login"], {
          env: [
            "HOME=/home/user",
            "USER=user",
            "SHELL=/bin/bash",
            "EDITOR=vim",
            "LANG=en_US.UTF-8",
            "LC_ALL=C",
            "TERM=xterm-256color",
          ],
          cwd: "/home/user",
          uid: 1000,
          gid: 1000,
        });
      } catch (err) {
        console.error("CheerpX initialization failed:", err);
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Failed to initialize CheerpX"
          );
          setIsLoading(false);
        }
      }
    };

    // Only initialize if the window is visible and not minimized
    if (windowState.isVisible && !windowState.isMinimized) {
      initializeCheerpX();
    }

    return () => {
      mounted = false;
      // Cleanup CheerpX instance if it exists
      if (cxRef.current) {
        try {
          // CheerpX doesn't have a standard cleanup method,
          // so we'll just clear the reference
          cxRef.current = null;
        } catch (e) {
          console.error("Error cleaning up CheerpX:", e);
        }
      }
    };
  }, [windowState.isVisible, windowState.isMinimized]);

  return (
    <EnhancedWindow
      windowState={windowState}
      onMouseDown={onMouseDown}
      onDragStart={onDragStart}
      onResizeStart={onResizeStart}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onClose={onClose}
      variant="linux"
    >
      <div className="relative h-full bg-black overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-sm">Loading Linux virtual machine...</p>
              <p className="text-xs text-gray-400 mt-2">
                This may take a few seconds to download and initialize
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 text-red-200 z-10">
            <div className="text-center p-4">
              <p className="text-sm font-semibold mb-2">CheerpX Error</p>
              <p className="text-xs">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        )}

        {/* The actual console element - now takes full window */}
        <pre
          ref={consoleRef}
          className="h-full w-full text-green-400 font-mono text-sm overflow-auto bg-black resize-none outline-none"
          style={{
            fontFamily: '"Consolas", "Monaco", "Lucida Console", monospace',
            lineHeight: 1.4,
          }}
        />
      </div>
    </EnhancedWindow>
  );
}
