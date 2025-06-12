
import { WindowWin } from "@/components/WindowWin";
import { Button } from "@/components/ui/button";

export function FeaturedProjectCard() {
  return (
    <WindowWin title="Featured Project">
      <h2 className="text-xl font-bold mb-2">Featured Project</h2>
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
