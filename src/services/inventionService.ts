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

const photoRenderCache = new Map<string, string>();

export interface StudioPhotoRenderOptions {
  cacheKey?: string;
  aspectRatio?: "1:1" | "4:3" | "16:9";
  referenceType?: "output" | "step";
  objectName?: string;
  inventionName?: string;
  materials?: string[];
}

export async function requestStudioPhotoRender(
  studioPrompt: string,
  options?: StudioPhotoRenderOptions
): Promise<string | null> {
  const key = options?.cacheKey ?? `${options?.referenceType ?? "output"}:${studioPrompt}`;
  const cached = photoRenderCache.get(key);
  if (cached) {
    return cached;
  }

  const apiResponse = await postJsonWithTimeout<{
    fallback?: boolean;
    imageUrl?: string;
  }>(
    "/api/inventions/render-photo",
    {
      studioPrompt,
      aspectRatio: options?.aspectRatio ?? "4:3",
      referenceType: options?.referenceType ?? "output",
      objectName: options?.objectName,
      inventionName: options?.inventionName,
      materials: options?.materials,
    },
    18000
  );

  if (apiResponse && !apiResponse.fallback && apiResponse.imageUrl) {
    photoRenderCache.set(key, apiResponse.imageUrl);
    return apiResponse.imageUrl;
  }
  return null;
}

export async function requestStepPhotoRender(
  stepTitle: string,
  stepInstruction: string,
  inventionName: string,
  objectName: string,
  materials: string[],
  cacheKey: string
): Promise<string | null> {
  const prompt = `${stepTitle}: ${stepInstruction} (for upcycled invention "${inventionName}")`;
  return requestStudioPhotoRender(prompt, {
    cacheKey,
    aspectRatio: "4:3",
    referenceType: "step",
    objectName,
    inventionName,
    materials,
  });
}
