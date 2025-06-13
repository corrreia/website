import React from "react";
import { EnhancedWindow } from "@/components/EnhancedWindow";
import { Button } from "@/components/ui/button";
import profile from "@/app/profile.json";
import {
  Mail,
  Github,
  Linkedin,
  FileText,
  Copy,
  ExternalLink,
} from "lucide-react";
import type { WindowState } from "@/lib/useWindowManager";

interface ContactCardProps {
  windowState: WindowState;
  onMouseDown: (e: React.MouseEvent) => void;
  onDragStart: (startX: number, startY: number) => void;
  onResizeStart: (direction: string, startX: number, startY: number) => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
}

export function ContactCard({
  windowState,
  onMouseDown,
  onDragStart,
  onResizeStart,
  onMinimize,
  onMaximize,
  onClose,
}: ContactCardProps) {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here if you have one
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const contactItems = [
    {
      icon: Mail,
      label: "Email",
      value: profile.contact.email,
      href: `mailto:${profile.contact.email}`,
      copyable: true,
    },
    {
      icon: Github,
      label: "GitHub",
      value: profile.contact.github,
      href: profile.contact.github,
      copyable: false,
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: profile.contact.linkedin,
      href: profile.contact.linkedin,
      copyable: false,
    },
    {
      icon: FileText,
      label: "CV",
      value: profile.contact.cv,
      href: `https://${profile.contact.cv}`,
      copyable: false,
    },
  ];

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
        <div className="flex items-center gap-2 mb-4">
          <Mail className="size-5 text-foreground" />
          <h2 className="text-xl font-bold text-foreground">
            Contact Information
          </h2>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Get in touch with me through any of these channels.
        </p>

        <div className="space-y-3 flex-1">
          {contactItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 rounded-lg border bg-muted/50"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Icon className="size-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {item.value}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {item.copyable && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(item.value)}
                      className="size-8 p-0"
                      title="Copy to clipboard"
                    >
                      <Copy className="size-3" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="size-8 p-0"
                    title="Open link"
                  >
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="size-3" />
                    </a>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </EnhancedWindow>
  );
}
