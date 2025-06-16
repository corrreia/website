export function DesktopInstructions() {
  return (
    <div className="absolute bottom-4 left-4 z-5">
      <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-sm">
        <h3 className="font-semibold text-sm mb-2">Desktop Features:</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Click desktop icons to open windows</li>
          <li>• Drag title bar to move windows</li>
          <li>• Drag edges/corners to resize</li>
          <li>• Double-click title to maximize</li>
          <li>• Close button to close windows</li>
        </ul>
      </div>
    </div>
  );
}
