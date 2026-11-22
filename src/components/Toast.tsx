import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Info } from "lucide-react";

export interface ToastMessage {
  id: number;
  text: string;
  tone?: "success" | "info";
}

interface ToastProps {
  toast: ToastMessage | null;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 left-1/2 z-50 w-full max-w-md -translate-x-1/2 px-4"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.16 }}
            className="pointer-events-auto flex items-center gap-2.5 rounded-2xl border-[1.5px] border-[#4A3528]/25 bg-[#1C1B19] px-4 py-3 text-sm font-medium text-[#F9F6F0] shadow-lg"
          >
            {toast.tone === "info" ? (
              <Info className="h-4 w-4 shrink-0 text-[#E0A952]" />
            ) : (
              <Check className="h-4 w-4 shrink-0 text-[#7C8B6A]" />
            )}
            <span>{toast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
