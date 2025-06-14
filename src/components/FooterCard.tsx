import profile from "../app/profile.json";

export function FooterCard() {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-5">
      <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-white/20 max-w-lg">
        <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground text-center">
          <span>
            © {new Date().getFullYear()} {profile.name}. All source code is
            available on{" "}
            <a
              href="https://github.com/corrreia/website"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              GitHub
            </a>
            .
          </span>
          <span className="group cursor-pointer relative inline-block">
            Built with <span className="text-red-500">❤</span>
            <span className="absolute left-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-1 whitespace-nowrap">
              by ChatGPT
            </span>
          </span>
          <span>
            🐧 Linux VM powered by{" "}
            <a
              href="https://leaningtech.com/cheerpx/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              CheerpX
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
