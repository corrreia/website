import React from "react";
import { EnhancedWindow } from "@/components/EnhancedWindow";
import { Badge } from "@/components/ui/badge";
import type { WindowState } from "@/lib/useWindowManager";

interface EnhancedSkillsCardProps {
  windowState: WindowState;
  onMouseDown: (e: React.MouseEvent) => void;
  onDragStart: (startX: number, startY: number) => void;
  onResizeStart: (direction: string, startX: number, startY: number) => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
}

const skillCategories = {
  Backend: ["Golang", "Node.js", "Django/Python"],
  Concepts: [
    "Virtualization",
    "Containerization",
    "Distributed Systems",
    "Networking",
    "Security",
  ],
  Frontend: ["Mainly Vibes", "Next.js"],
  Tools: ["Git", "Docker", "Linux", "Proxmox"],
  "Other Skills": ["Home Labbing", "Home Automation", "Tinkering"],
};

export function EnhancedSkillsCard({
  windowState,
  onMouseDown,
  onDragStart,
  onResizeStart,
  onMinimize,
  onMaximize,
  onClose,
}: EnhancedSkillsCardProps) {
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
      <div className="p-4 sm:p-5 h-full flex flex-col">
        <h2 className="text-xl font-bold mb-4 text-foreground">
          Technical Skills
        </h2>

        <div className="space-y-4">
          {Object.entries(skillCategories).map(([category, skills]) => (
            <div key={category}>
              <h3 className="font-semibold text-sm mb-2 text-foreground">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 pb-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            In general, I&apos;m always learning and staying up-to-date with
            most technologies.
          </p>
        </div>
      </div>
    </EnhancedWindow>
  );
}
