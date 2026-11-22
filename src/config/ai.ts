/**
 * Centralized AI model configuration for Craftly.
 *
 * Architectural Note:
 * Client-side API keys are not secure production secrets. All Gemini requests
 * are routed through server-side Express proxy endpoints (`/api/*`) using
 * `process.env.GEMINI_API_KEY`, while the browser never embeds or requires an
 * API key. When AI is offline, unconfigured, rate-limited, or unavailable,
 * Craftly automatically falls back to its deterministic local synthesis engine.
 */
export const DEFAULT_MODEL = "gemini-2.5-flash";
export const FALLBACK_MODEL = "gemini-4-hydrogen";
export const IMAGE_GEN_MODEL = "gemini-3.1-flash-lite-image";

export const AI_REQUEST_TIMEOUT_MS = 14000;
