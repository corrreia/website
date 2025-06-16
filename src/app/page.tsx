"use client";
import { EnhancedAboutMeCard } from "./cards/AboutMeCard";
import { EnhancedFeaturedProjectCard } from "./cards/FeaturedProjectCard";
import { EnhancedSkillsCard } from "./cards/SkillsCard";
import { CheerPXCard } from "./cards/CheerpXCard";
import { ContactCard } from "./cards/ContactCard";
import { ChatCard } from "./cards/ChatCard";
import { useWindowManager } from "@/lib/useWindowManager";
import { useNasaApod } from "@/lib/useNasaApod";
import React from "react";

// Import the new components
import { HeaderCard } from "@/components/HeaderCard";
import { ApodInfoPanel } from "@/components/ApodInfoPanel";
import { DesktopInstructions } from "@/components/DesktopInstructions";

import { FooterCard } from "@/components/FooterCard";
import { ApodStatusIndicators } from "@/components/ApodStatusIndicators";
import { BackgroundOverlay } from "@/components/BackgroundOverlay";
import { DesktopIcons } from "@/components/DesktopIcons";

export default function Home() {
  const windowManager = useWindowManager();
  const {
    apod,
    isLoading: apodLoading,
    error: apodError,
    goToPreviousDay,
    goToNextDay,
    canGoBack,
    canGoForward,
  } = useNasaApod();

  // Window manager is now responsible for initial window creation

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
        case "chat":
          return <ChatCard key={id} {...commonProps} />;
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
        <HeaderCard
          onContactClick={() => windowManager.openWindow("contact")}
        />
        {/* Overlay for better contrast */}
        <BackgroundOverlay hasApod={!!apod} isLoading={apodLoading} />

        {/* Loading/Error indicators for APOD */}
        <ApodStatusIndicators isLoading={apodLoading} error={apodError} />

        {/* Window Container */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {renderWindows()}
        </div>

        {/* Desktop Instructions - Left */}
        <DesktopInstructions />

        {/* NASA APOD Info - Right */}
        {apod && !apodLoading && (
          <ApodInfoPanel
            apod={apod}
            onPreviousDay={goToPreviousDay}
            onNextDay={goToNextDay}
            canGoBack={canGoBack}
            canGoForward={canGoForward}
          />
        )}

        {/* Desktop Icons */}
        <DesktopIcons
          openWindow={windowManager.openWindow}
          openWindows={windowManager.windows}
        />

        {/* Footer Card - Non-movable */}
        <FooterCard />
      </main>
    </div>
  );
}
