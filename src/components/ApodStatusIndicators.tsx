interface ApodStatusIndicatorsProps {
  isLoading: boolean;
  error: string | null;
}

export function ApodStatusIndicators({
  isLoading,
  error,
}: ApodStatusIndicatorsProps) {
  return (
    <>
      {/* Loading indicator for APOD */}
      {isLoading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs">
            Loading NASA Astronomy Picture...
          </div>
        </div>
      )}

      {/* Error indicator for APOD */}
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-red-100/90 dark:bg-red-900/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-red-800 dark:text-red-200">
            Failed to load NASA image
          </div>
        </div>
      )}
    </>
  );
}
