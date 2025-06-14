"use client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import profile from "./profile.json";
import { EnhancedAboutMeCard } from "./cards/AboutMeCard";
import { EnhancedFeaturedProjectCard } from "./cards/FeaturedProjectCard";
import { EnhancedSkillsCard } from "./cards/SkillsCard";
import { CheerPXCard } from "./cards/CheerpXCard";
import { ContactCard } from "./cards/ContactCard";
import { useWindowManager } from "@/lib/useWindowManager";
import { useNasaApod } from "@/lib/useNasaApod";
import React, { useEffect } from "react";

export default function Home() {
  const windowManager = useWindowManager();
  const { apod, isLoading: apodLoading, error: apodError } = useNasaApod();

  // Initialize windows on component mount
  useEffect(() => {
    // Only add default windows if windowManager is initialized and no windows exist
    if (windowManager.isInitialized) {
      const totalWindows =
        Object.keys(windowManager.windows).length +
        Object.keys(windowManager.closedWindows).length;

      if (totalWindows === 0) {
        // Generate random positions for all windows (including contact)
        const windowPositions = windowManager.generateRandomWindowPositions();

        // Add non-contact windows first
        windowPositions
          .filter((w) => !w.isContact)
          .forEach((windowConfig) => {
            windowManager.addWindow({
              id: windowConfig.id,
              title: windowConfig.title,
              x: windowConfig.x,
              y: windowConfig.y,
              width: windowConfig.width,
              height: windowConfig.height,
              isMinimized: false,
              isMaximized: false,
              isVisible: true,
            });
          });

        // Add contact window LAST to ensure highest z-index (always on top)
        const contactWindow = windowPositions.find((w) => w.isContact);
        if (contactWindow) {
          windowManager.addWindow({
            id: contactWindow.id,
            title: contactWindow.title,
            x: contactWindow.x,
            y: contactWindow.y,
            width: contactWindow.width,
            height: contactWindow.height,
            isMinimized: false,
            isMaximized: false,
            isVisible: true,
          });
        }
      }
    }
  }); // React when initialization completes

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
        case "cheerpx":
          return <CheerPXCard key={id} {...commonProps} />;
        case "contact":
          return <ContactCard key={id} {...commonProps} />;
        default:
          return null;
      }
    });
  };

  return (
    <div className="min-h-screen w-full bg-background font-sans">
      {/* Desktop Environment - Full Height */}
      <main
        className="h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
        style={{
          backgroundImage:
            apod && !apodLoading ? `url(${apod.hdurl || apod.url})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Header Card - Non-movable */}
        <div className="absolute top-4 left-4 z-5">
          <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-lg border border-white/20">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full lg:w-auto">
                <Avatar className="size-12 sm:size-14 lg:size-16 flex-shrink-0">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback>
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-center sm:items-start w-full lg:w-auto min-w-0">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-center sm:text-left lg:truncate">
                    {profile.name}
                  </h1>
                  <p className="text-muted-foreground text-sm sm:text-base text-center sm:text-left mt-0.5">
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
                <Button
                  size="default"
                  className="w-full sm:w-auto min-w-[120px]"
                  onClick={() => windowManager.showWindowCentered("contact")}
                >
                  Contact Me
                </Button>
                <ThemeToggle size="default" />
              </div>
            </div>
          </div>
        </div>
        {/* Overlay for better contrast */}
        {apod && !apodLoading && (
          <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
        )}

        {/* Loading indicator for APOD */}
        {apodLoading && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs">
              Loading NASA Astronomy Picture...
            </div>
          </div>
        )}

        {/* Error indicator for APOD */}
        {apodError && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-red-100/90 dark:bg-red-900/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-red-800 dark:text-red-200">
              Failed to load NASA image
            </div>
          </div>
        )}

        {/* Window Container */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {renderWindows()}
        </div>

        {/* Desktop Instructions - Left */}
        <div className="absolute bottom-4 left-4 z-5">
          <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-sm">
            <h3 className="font-semibold text-sm mb-2">Desktop Features:</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Drag title bar to move windows</li>
              <li>• Drag edges/corners to resize</li>
              <li>• Double-click title to maximize</li>
              <li>• Minimize/close to hide windows</li>
              <li>• Restore from top-right panel</li>
            </ul>
          </div>
        </div>

        {/* NASA APOD Info - Right */}
        {apod && !apodLoading && (
          <div className="absolute bottom-4 right-4 z-5">
            <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-sm">
              <a
                href={`https://apod.nasa.gov/apod/ap${apod.date
                  .replace(/-/g, "")
                  .substring(2)}.html`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              >
                <span className="font-medium">{apod.title}</span>
                <div className="text-[10px] text-muted-foreground mt-1">
                  Click to view on NASA APOD
                </div>
              </a>
              {apod.copyright && (
                <div className="text-[10px] text-muted-foreground mt-2 opacity-75">
                  © {apod.copyright}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Restore Panel */}
        {Object.keys(windowManager.closedWindows).length > 0 && (
          <div className="absolute top-4 right-4 z-15">
            <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-white/20 min-w-[200px]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></div>
                <h4 className="text-sm font-semibold text-foreground">
                  Hidden Windows
                </h4>
              </div>
              <div className="space-y-2">
                {Object.entries(windowManager.closedWindows).map(
                  ([id, window]) => (
                    <button
                      key={id}
                      onClick={() => windowManager.restoreWindow(id)}
                      className="w-full flex items-center gap-3 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-200 group border border-transparent hover:border-border"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-md bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium">
                        {window.title.charAt(0)}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {window.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Click to restore
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-muted-foreground group-hover:text-blue-500 transition-colors"
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
              <div className="mt-3 pt-3 border-t border-border">
                <div className="text-xs text-muted-foreground text-center">
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

        {/* Footer Card - Non-movable */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-5">
          <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-white/20 max-w-lg">
            <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground text-center">
              <span>
                © {new Date().getFullYear()} {profile.name}. All source code is
                available on{" "}
                <a
                  href="https://github.com/corrreia/website"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  GitHub
                </a>
                .
              </span>
              <span className="group cursor-pointer relative inline-block">
                Built with <span className="text-red-500">❤</span>
                <span className="absolute left-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-1 whitespace-nowrap">
                  by ChatGPT
                </span>
              </span>
              <span>
                🐧 Linux VM powered by{" "}
                <a
                  href="https://leaningtech.com/cheerpx/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  CheerpX
                </a>
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
