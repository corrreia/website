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
  Frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML5", "CSS3"],
  Backend: ["Node.js", "Express", "Python", "PostgreSQL", "MongoDB"],
  Tools: ["Git", "Docker", "Linux", "VS Code", "Figma", "Webpack"],
  Concepts: ["Responsive Design", "Performance", "Accessibility", "Testing"],
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

      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Always learning and staying up-to-date with the latest technologies
          and best practices in web development.
        </p>
      </div>
    </EnhancedWindow>
  );
}
