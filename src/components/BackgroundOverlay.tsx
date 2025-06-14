interface BackgroundOverlayProps {
  hasApod: boolean;
  isLoading: boolean;
}

export function BackgroundOverlay({
  hasApod,
  isLoading,
}: BackgroundOverlayProps) {
  if (!hasApod || isLoading) return null;

  return <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />;
}
