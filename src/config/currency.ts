import type { CurrencyCode } from "../types/invention";

export interface CurrencyConfig {
  code: CurrencyCode;
  label: string;
  locale: string;
  rateFromPhp: number;
  decimals: number;
}

export const CURRENCY_STORAGE_KEY = "craftly-currency";

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  PHP: {
    code: "PHP",
    label: "PHP",
    locale: "en-PH",
    rateFromPhp: 1,
    decimals: 0,
  },
  USD: {
    code: "USD",
    label: "USD",
    locale: "en-US",
    rateFromPhp: 0.0175,
    decimals: 2,
  },
  EUR: {
    code: "EUR",
    label: "EUR",
    locale: "en-IE",
    rateFromPhp: 0.0162,
    decimals: 2,
  },
  GBP: {
    code: "GBP",
    label: "GBP",
    locale: "en-GB",
    rateFromPhp: 0.0138,
    decimals: 2,
  },
  JPY: {
    code: "JPY",
    label: "JPY",
    locale: "ja-JP",
    rateFromPhp: 2.68,
    decimals: 0,
  },
};

export const CURRENCY_ORDER: CurrencyCode[] = ["PHP", "USD", "EUR", "GBP", "JPY"];

export function isValidCurrencyCode(value: unknown): value is CurrencyCode {
  return typeof value === "string" && value in CURRENCIES;
}

export function loadStoredCurrency(): CurrencyCode {
  try {
    const raw = window.localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (isValidCurrencyCode(raw)) {
      return raw;
    }
  } catch {
    // Storage unavailable or blocked; default cleanly to PHP
  }
  return "PHP";
}

export function persistCurrency(code: CurrencyCode): void {
  try {
    window.localStorage.setItem(CURRENCY_STORAGE_KEY, code);
  } catch {
    // Ignore storage quota or private-mode restrictions
  }
}

export function formatEstimatedCost(
  amountPhp: number,
  currency: CurrencyCode
): string {
  const safePhp = Number.isFinite(amountPhp) ? Math.max(0, amountPhp) : 0;
  const config = CURRENCIES[currency];
  const converted = safePhp * config.rateFromPhp;

  if (converted === 0) {
    return new Intl.NumberFormat(config.locale, {
      style: "currency",
      currency: config.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(0);
  }

  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.code,
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  }).format(converted);
}
