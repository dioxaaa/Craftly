import React from "react";
import { HelpCircle } from "lucide-react";
import { CraftlyLogo } from "./CraftlyLogo";

export type ActiveNavView = "discover" | "workshop";

interface HeaderProps {
  activeView: ActiveNavView;
  savedCount: number;
  onNavigate: (view: ActiveNavView) => void;
  onOpenHowItWorks: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  savedCount,
  onNavigate,
  onOpenHowItWorks,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b-[1.5px] border-[#D8CFC0] bg-[#F9F6F0]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-1.5 px-2.5 py-2 sm:gap-6 sm:px-6 sm:py-3">
        <button
          type="button"
          onClick={() => onNavigate("discover")}
          className="flex min-h-[44px] shrink-0 items-center rounded-xl px-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A3528]"
          aria-label="Craftly Home"
        >
          <CraftlyLogo size="sm" />
        </button>

        <nav
          aria-label="Primary navigation"
          className="flex min-w-0 items-center gap-1 sm:gap-2"
        >
          <button
            type="button"
            onClick={() => onNavigate("discover")}
            className={`min-h-[44px] whitespace-nowrap shrink-0 rounded-xl px-2.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A3528] sm:px-4 sm:text-sm ${
              activeView === "discover"
                ? "bg-[#4A3528] text-[#F9F6F0]"
                : "text-[#4A3528] hover:bg-[#F2EADF]"
            }`}
          >
            Discover
          </button>

          <button
            type="button"
            onClick={() => onNavigate("workshop")}
            className={`min-h-[44px] whitespace-nowrap shrink-0 rounded-xl px-2.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A3528] sm:px-4 sm:text-sm ${
              activeView === "workshop"
                ? "bg-[#4A3528] text-[#F9F6F0]"
                : "text-[#4A3528] hover:bg-[#F2EADF]"
            }`}
          >
            <span className="sm:hidden">Workshop</span>
            <span className="hidden sm:inline">My Workshop</span>
            {savedCount > 0 && (
              <span className="font-mono-tech ml-1 text-[11px] opacity-80 sm:ml-1.5 sm:text-xs">
                ({savedCount})
              </span>
            )}
          </button>
        </nav>

        <button
          type="button"
          onClick={onOpenHowItWorks}
          title="How It Works"
          className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border-[1.5px] border-[#D8CFC0] bg-[#F2EADF] px-2.5 py-2 text-xs font-semibold text-[#4A3528] transition-colors hover:border-[#4A3528]/40 hover:bg-[#EAE0D0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A3528] md:px-3.5 md:text-sm"
          aria-label="How It Works"
        >
          <HelpCircle className="h-4 w-4 shrink-0 text-[#D98A6C]" />
          <span className="hidden md:inline">How It Works</span>
        </button>
      </div>
    </header>
  );
};
