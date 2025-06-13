import { WindowMac } from "@/components/WindowMac";

interface AboutMeCardProps {
  draggableId: string;
  index: number;
}

export function AboutMeCard({ draggableId, index }: AboutMeCardProps) {
  return (
    <WindowMac title="About Me" draggableId={draggableId} index={index}>
      <h2 className="text-xl font-bold mb-2 text-foreground">About Me</h2>
      <p className="text-base text-muted-foreground">
        This card will become an interactive About Me mini app.
      </p>
    </WindowMac>
  );
}
