import React from "react";
import {
  User,
  FolderOpen,
  Code,
  Terminal,
  MessageCircle,
  Info,
} from "lucide-react";

interface DesktopIconsProps {
  openWindow: (windowId: string) => void;
  openWindows: Record<string, unknown>; // To check which windows are already open
}

interface DesktopIcon {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const desktopIcons: DesktopIcon[] = [
  {
    id: "about",
    title: "About Me",
    icon: User,
    description: "Learn more about me",
  },
  {
    id: "project",
    title: "Projects",
    icon: FolderOpen,
    description: "View my projects",
  },
  {
    id: "skills",
    title: "Skills",
    icon: Code,
    description: "Technical skills",
  },
  {
    id: "cheerpx",
    title: "Terminal",
    icon: Terminal,
    description: "Linux terminal",
  },
  {
    id: "chat",
    title: "Chat",
    icon: MessageCircle,
    description: "Global chat room",
  },
  {
    id: "contact",
    title: "Contact",
    icon: Info,
    description: "Contact information",
  },
];

export function DesktopIcons({ openWindow, openWindows }: DesktopIconsProps) {
  return (
    <div className="absolute top-40 left-4 z-5 pointer-events-auto">
      <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
        {desktopIcons.map((iconData) => {
          const Icon = iconData.icon;
          const isOpen = !!openWindows[iconData.id];

          return (
            <button
              key={iconData.id}
              onClick={() => openWindow(iconData.id)}
              className={`flex flex-col items-center gap-2 p-2 sm:p-3 rounded-lg transition-all duration-200 hover:bg-muted/50 hover:backdrop-blur-sm hover:scale-105 group min-w-[70px] sm:min-w-[80px] ${
                isOpen
                  ? "bg-primary/10 backdrop-blur-sm ring-2 ring-primary/20"
                  : ""
              }`}
              title={iconData.description}
            >
              <div
                className={`p-2 rounded-lg transition-all duration-200 shadow-md border ${
                  isOpen
                    ? "bg-primary text-primary-foreground border-primary/20"
                    : "bg-background text-muted-foreground border-border group-hover:bg-muted group-hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span
                className={`text-xs font-medium text-center leading-tight transition-all duration-200 px-2 py-1 rounded shadow-sm border ${
                  isOpen
                    ? "text-primary bg-background border-primary/20"
                    : "text-muted-foreground bg-background border-border group-hover:text-foreground"
                }`}
              >
                {iconData.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
