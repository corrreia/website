import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import profile from "../app/profile.json";

interface HeaderCardProps {
  onContactClick: () => void;
}

export function HeaderCard({ onContactClick }: HeaderCardProps) {
  return (
    <div className="absolute top-4 left-4 z-5">
      <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-lg border border-white/20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full lg:w-auto">
            <Avatar className="size-12 sm:size-14 lg:size-16 flex-shrink-0">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback>
                {profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center sm:items-start w-full lg:w-auto min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-center sm:text-left lg:truncate">
                {profile.name}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base text-center sm:text-left mt-0.5">
                {profile.title}
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 sm:gap-2 mt-2 sm:mt-1">
                {profile.badges.map((badge: string) => (
                  <Badge
                    key={badge}
                    variant="secondary"
                    className="text-xs px-2 py-0.5"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto lg:flex-shrink-0">
            <Button
              size="default"
              className="w-full sm:w-auto min-w-[120px]"
              onClick={onContactClick}
            >
              Contact Me
            </Button>
            <ThemeToggle size="default" />
          </div>
        </div>
      </div>
    </div>
  );
}
