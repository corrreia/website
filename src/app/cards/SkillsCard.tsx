import { WindowLinux } from "@/components/WindowLinux";
import { Badge } from "@/components/ui/badge";

interface SkillsCardProps {
  draggableId: string;
  index: number;
}

export function SkillsCard({ draggableId, index }: SkillsCardProps) {
  return (
    <WindowLinux title="Skills" draggableId={draggableId} index={index}>
      <h2 className="text-xl font-bold mb-2 text-foreground">Skills</h2>
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
        <Badge>JavaScript</Badge>
        <Badge>TypeScript</Badge>
        <Badge>React</Badge>
        <Badge>Next.js</Badge>
        <Badge>Tailwind CSS</Badge>
        <Badge>Node.js</Badge>
        <Badge>Git</Badge>
        <Badge>Linux</Badge>
        <Badge>Figma</Badge>
      </div>
    </WindowLinux>
  );
}
