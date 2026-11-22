import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookmarkCheck, Compass, PenTool, SlidersHorizontal, X } from "lucide-react";

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  {
    code: "01",
    title: "Capture Your Object",
    description:
      "Describe an unused, damaged, or everyday item, upload a photo, or sketch it directly on the canvas.",
    icon: PenTool,
  },
  {
    code: "02",
    title: "Set Your Goal & Constraints",
    description:
      "Optionally define what you want it to become, available tools, materials, or budget.",
    icon: SlidersHorizontal,
  },
  {
    code: "03",
    title: "Explore Three Directions",
    description:
      "Receive three distinct buildable concepts—Practical, Unexpected, and Experimental—or click \"What else?\" for fresh angles.",
    icon: Compass,
  },
  {
    code: "04",
    title: "Build & Save Blueprints",
    description:
      "View the interactive 3D crafted visual reference, follow illustrated step-by-step checklists, switch currencies, refine concepts, and save builds to My Workshop.",
    icon: BookmarkCheck,
  },
];

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1B19]/45 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="how-it-works-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border-[1.5px] border-[#D8CFC0] bg-[#F2EADF] p-5 shadow-xl sm:p-7"
          >
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-[#D8CFC0] pb-4">
              <div>
                <p className="font-mono-tech text-xs font-medium uppercase tracking-wider text-[#7C8B6A]">
                  Studio Guide
                </p>
                <h2
                  id="how-it-works-title"
                  className="font-display mt-1 text-2xl font-semibold text-[#4A3528]"
                >
                  How Craftly Works
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border-[1.5px] border-[#D8CFC0] bg-[#F9F6F0] text-[#4A3528] transition-colors hover:border-[#4A3528] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A3528]"
                aria-label="Close How It Works"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {STEPS.map((step) => {
                const IconComponent = step.icon;
                return (
                  <div
                    key={step.code}
                    className="rounded-2xl border-[1.5px] border-[#D8CFC0] bg-[#F9F6F0] p-4"
                  >
                    <div className="mb-2.5 flex items-center justify-between">
                      <span className="font-mono-tech rounded-lg border border-[#D8CFC0] bg-[#F2EADF] px-2 py-0.5 text-xs font-medium text-[#4A3528]">
                        {step.code}
                      </span>
                      <IconComponent className="h-4 w-4 text-[#D98A6C]" />
                    </div>
                    <h3 className="text-base font-bold text-[#4A3528]">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#4A3528]/80">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#D8CFC0] pt-4">
              <p className="text-xs text-[#4A3528]/70">
                Works immediately offline or online—your creations save locally in your browser.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] shrink-0 rounded-xl bg-[#D98A6C] px-5 py-2 text-sm font-semibold text-[#1C1B19] transition-colors hover:bg-[#C67658] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A3528]"
              >
                Start Crafting
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
