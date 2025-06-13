import { WindowWin } from "@/components/WindowWin";
import { Button } from "@/components/ui/button";

interface FeaturedProjectCardProps {
  draggableId: string;
  index: number;
}

export function FeaturedProjectCard({
  draggableId,
  index,
}: FeaturedProjectCardProps) {
  return (
    <WindowWin title="Featured Project" draggableId={draggableId} index={index}>
      <h2 className="text-xl font-bold mb-2 text-foreground">
        Featured Project
      </h2>
      <p className="text-base text-muted-foreground mb-4">
        This card will become a project showcase mini app.
      </p>
      <Button asChild variant="outline" className="w-full sm:w-auto">
        <a href="#" rel="noopener noreferrer">
          View Source
        </a>
      </Button>
    </WindowWin>
  );
}
