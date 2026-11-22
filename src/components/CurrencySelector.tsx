import React from "react";
import { CURRENCY_ORDER } from "../config/currency";
import type { CurrencyCode } from "../types/invention";

interface CurrencySelectorProps {
  currency: CurrencyCode;
  onChange: (currency: CurrencyCode) => void;
  showDisclaimer?: boolean;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  currency,
  onChange,
  showDisclaimer = true,
}) => {
  return (
    <div className="flex max-w-full flex-wrap items-center gap-2.5">
      <div className="inline-flex max-w-full flex-wrap items-center gap-1 rounded-xl border-[1.5px] border-[#D8CFC0] bg-[#F9F6F0] p-1">
        <span className="px-2 text-xs font-semibold text-[#4A3528]/75">
          Currency
        </span>
        {CURRENCY_ORDER.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => onChange(code)}
            className={`font-mono-tech min-h-[36px] rounded-lg px-2 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#4A3528] sm:px-2.5 ${
              currency === code
                ? "bg-[#4A3528] text-[#F9F6F0]"
                : "text-[#4A3528] hover:bg-[#F2EADF]"
            }`}
          >
            {code}
          </button>
        ))}
      </div>
      {showDisclaimer && (
        <span className="text-xs text-[#4A3528]/65">
          Cost estimates & conversion rates are approximate.
        </span>
      )}
    </div>
  );
};
