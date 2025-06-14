import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ApodData {
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: "image" | "video";
  date: string;
  copyright?: string;
}

interface ApodInfoPanelProps {
  apod: ApodData;
  onPreviousDay: () => void;
  onNextDay: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
}

export function ApodInfoPanel({
  apod,
  onPreviousDay,
  onNextDay,
  canGoBack,
  canGoForward,
}: ApodInfoPanelProps) {
  return (
    <div className="absolute bottom-4 right-4 z-5">
      <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-sm">
        <div className="flex items-center justify-between gap-2 mb-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPreviousDay}
            disabled={!canGoBack}
            className="h-6 w-6 p-0 hover:bg-muted/50 disabled:opacity-30"
            title="Previous day"
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <a
            href={`https://apod.nasa.gov/apod/ap${apod.date
              .replace(/-/g, "")
              .substring(2)}.html`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-xs text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            <span className="font-medium">{apod.title}</span>
          </a>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNextDay}
            disabled={!canGoForward}
            className="h-6 w-6 p-0 hover:bg-muted/50 disabled:opacity-30"
            title="Next day"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
        <div className="text-[10px] text-muted-foreground text-center">
          {apod.date} - Click title to view on NASA APOD
        </div>
        {apod.copyright && (
          <div className="text-[10px] text-muted-foreground mt-2 opacity-75 text-center">
            © {apod.copyright}
          </div>
        )}
      </div>
    </div>
  );
}
