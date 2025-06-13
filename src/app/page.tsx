"use client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import profile from "./profile.json";
import { EnhancedAboutMeCard } from "./cards/EnhancedAboutMeCard";
import { EnhancedFeaturedProjectCard } from "./cards/EnhancedFeaturedProjectCard";
import { EnhancedSkillsCard } from "./cards/EnhancedSkillsCard";
import { useWindowManager } from "@/lib/useWindowManager";
import React, { useEffect } from "react";

export default function Home() {
  const windowManager = useWindowManager();

  // Initialize windows on component mount
  useEffect(() => {
    // Only add windows if they don't exist yet
    if (Object.keys(windowManager.windows).length === 0) {
      // Add initial windows with staggered positions
      windowManager.addWindow({
        id: "about",
        title: "About Me",
        x: 50,
        y: 100,
        width: 400,
        height: 350,
        isMinimized: false,
        isMaximized: false,
        isVisible: true,
      });

      windowManager.addWindow({
        id: "project",
        title: "Featured Project",
        x: 500,
        y: 150,
        width: 450,
        height: 400,
        isMinimized: false,
        isMaximized: false,
        isVisible: true,
      });

      windowManager.addWindow({
        id: "skills",
        title: "Skills",
        x: 100,
        y: 300,
        width: 380,
        height: 450,
        isMinimized: false,
        isMaximized: false,
        isVisible: true,
      });
    }
  }, []); // Only run once on mount

  const renderWindows = () => {
    return Object.entries(windowManager.windows).map(([id, windowState]) => {
      const commonProps = {
        windowState,
        onMouseDown: () => windowManager.bringToFront(id),
        onDragStart: (startX: number, startY: number) =>
          windowManager.startDrag(id, startX, startY),
        onResizeStart: (direction: string, startX: number, startY: number) =>
          windowManager.startResize(id, direction, startX, startY),
        onMinimize: () => windowManager.toggleMinimize(id),
        onMaximize: () => windowManager.toggleMaximize(id),
        onClose: () => windowManager.closeWindow(id),
      };

      switch (id) {
        case "about":
          return <EnhancedAboutMeCard key={id} {...commonProps} />;
        case "project":
          return <EnhancedFeaturedProjectCard key={id} {...commonProps} />;
        case "skills":
          return <EnhancedSkillsCard key={id} {...commonProps} />;
        default:
          return null;
      }
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-background font-sans">
      {/* Header Section */}
      <header className="w-full flex flex-col lg:flex-row items-center justify-between px-3 sm:px-6 lg:px-12 py-4 sm:py-6 lg:py-8 bg-card/80 border-b shadow-sm gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full lg:w-auto">
          <Avatar className="size-16 sm:size-18 lg:size-20 flex-shrink-0">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback>
              {profile.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center sm:items-start w-full lg:w-auto min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-center sm:text-left lg:truncate">
              {profile.name}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg text-center sm:text-left mt-0.5">
              {profile.title}
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 sm:gap-2 mt-2 sm:mt-1">
              {profile.badges.map((badge: string) => (
                <Badge
                  key={badge}
                  variant="secondary"
                  className="text-xs px-2 py-0.5"
                >
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto lg:flex-shrink-0">
          <Button size="default" className="w-full sm:w-auto min-w-[120px]">
            Contact Me
          </Button>
          <ThemeToggle size="default" />
        </div>
      </header>

      {/* Desktop Environment */}
      <main className="flex-1 relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        {/* Window Container */}
        <div className="absolute inset-0">{renderWindows()}</div>

        {/* Desktop Instructions */}
        <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto">
          <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-sm">
            <h3 className="font-semibold text-sm mb-2">Window Controls:</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Drag title bar to move windows</li>
              <li>• Drag edges/corners to resize</li>
              <li>• Double-click title to maximize</li>
              <li>• Minimize/close to hide windows</li>
              <li>• Restore from top-right panel</li>
            </ul>
          </div>
        </div>

        {/* Restore Panel */}
        {Object.keys(windowManager.closedWindows).length > 0 && (
          <div className="absolute top-6 right-6">
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-gray-200 dark:border-gray-700 min-w-[200px]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></div>
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Hidden Windows
                </h4>
              </div>
              <div className="space-y-2">
                {Object.entries(windowManager.closedWindows).map(
                  ([id, window]) => (
                    <button
                      key={id}
                      onClick={() => windowManager.restoreWindow(id)}
                      className="w-full flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-md bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium">
                        {window.title.charAt(0)}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {window.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Click to restore
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                          />
                        </svg>
                      </div>
                    </button>
                  )
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {Object.keys(windowManager.closedWindows).length} window
                  {Object.keys(windowManager.closedWindows).length !== 1
                    ? "s"
                    : ""}{" "}
                  hidden
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full flex flex-col items-center gap-2 text-xs text-muted-foreground py-4 sm:py-6 border-t bg-card/80 px-2 sm:px-0">
        <span className="text-center">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </span>
        <span className="text-center">
          Built with Next.js, Tailwind CSS, and shadcn/ui.
        </span>
      </footer>
    </div>
  );
}
