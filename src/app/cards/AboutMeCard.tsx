
import { WindowMac } from "@/components/WindowMac";

export function AboutMeCard() {
  return (
    <WindowMac title="About Me">
      <h2 className="text-xl font-bold mb-2">About Me</h2>
      <p className="text-base text-muted-foreground">
        This card will become an interactive About Me mini app.
      </p>
    </WindowMac>
  );
}
