interface WindowState {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  isVisible: boolean;
  zIndex: number;
}

interface RestorePanelProps {
  closedWindows: Record<string, WindowState>;
  onRestoreWindow: (id: string) => void;
}

export function RestorePanel({
  closedWindows,
  onRestoreWindow,
}: RestorePanelProps) {
  const windowCount = Object.keys(closedWindows).length;

  if (windowCount === 0) return null;

  return (
    <div className="absolute top-4 right-4 z-15">
      <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-white/20 min-w-[200px]">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></div>
          <h4 className="text-sm font-semibold text-foreground">
            Hidden Windows
          </h4>
        </div>
        <div className="space-y-2">
          {Object.entries(closedWindows).map(([id, window]) => (
            <button
              key={id}
              onClick={() => onRestoreWindow(id)}
              className="w-full flex items-center gap-3 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-200 group border border-transparent hover:border-border"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-md bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium">
                {window.title.charAt(0)}
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {window.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  Click to restore
                </div>
              </div>
              <div className="flex-shrink-0">
                <svg
                  className="w-4 h-4 text-muted-foreground group-hover:text-blue-500 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            {windowCount} window{windowCount !== 1 ? "s" : ""} hidden
          </div>
        </div>
      </div>
    </div>
  );
}
