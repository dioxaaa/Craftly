import { AI_REQUEST_TIMEOUT_MS } from "../config/ai";
import type {
  InventionConcept,
  ObjectAnalysis,
  RefinementMode,
  SynthesisInput,
  SynthesisResult,
} from "../types/invention";
import {
  refineLocalInvention,
  synthesizeLocalInventions,
} from "../utils/localSynthesisEngine";

export const LOADING_PHRASES = [
  "Looking at the possibilities",
  "Finding unexpected connections",
  "Reimagining the materials",
  "Sketching a new purpose",
  "Exploring what else it could be",
];

function isValidInventionConcept(value: unknown): value is InventionConcept {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    typeof obj.name === "string" &&
    typeof obj.oneLineDescription === "string" &&
    Array.isArray(obj.steps) &&
    obj.steps.length > 0 &&
    Array.isArray(obj.assemblyParts) &&
    obj.assemblyParts.length > 0
  );
}

async function postJsonWithTimeout<T>(
  url: string,
  payload: unknown,
  timeoutMs = AI_REQUEST_TIMEOUT_MS
): Promise<T | null> {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return null;
  }

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timer);
  }
}

export async function generateInventions(
  input: SynthesisInput,
  options?: { excludeNames?: string[]; batchSeed?: number }
): Promise<SynthesisResult> {
  const apiResponse = await postJsonWithTimeout<{
    fallback?: boolean;
    result?: SynthesisResult;
  }>("/api/inventions/synthesize", {
    input,
    excludeNames: options?.excludeNames ?? [],
  });

  if (
    apiResponse &&
    !apiResponse.fallback &&
    apiResponse.result &&
    Array.isArray(apiResponse.result.concepts) &&
    apiResponse.result.concepts.length === 3 &&
    apiResponse.result.concepts.every(isValidInventionConcept)
  ) {
    return apiResponse.result;
  }

  return synthesizeLocalInventions(input, options);
}

export async function refineSingleInvention(
  invention: InventionConcept,
  analysis: ObjectAnalysis,
  mode: RefinementMode
): Promise<InventionConcept> {
  const apiResponse = await postJsonWithTimeout<{
    fallback?: boolean;
    invention?: InventionConcept;
  }>("/api/inventions/refine", {
    invention,
    analysis,
    mode,
  });

  if (
    apiResponse &&
    !apiResponse.fallback &&
    apiResponse.invention &&
    isValidInventionConcept(apiResponse.invention)
  ) {
    return apiResponse.invention;
  }

  return refineLocalInvention(invention, analysis, mode);
}

export async function requestStudioPhotoRender(
  studioPrompt: string
): Promise<string | null> {
  const apiResponse = await postJsonWithTimeout<{
    fallback?: boolean;
    imageUrl?: string;
  }>("/api/inventions/render-photo", { studioPrompt }, 18000);

  if (apiResponse && !apiResponse.fallback && apiResponse.imageUrl) {
    return apiResponse.imageUrl;
  }
  return null;
}
