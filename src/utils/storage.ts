import type {
  InventionConcept,
  ObjectAnalysis,
  SavedCreation,
} from "../types/invention";

export const SAVED_CREATIONS_STORAGE_KEY = "craftly-creations-v1";
const CURRENT_SCHEMA_VERSION = 1;

interface StorageEnvelope {
  version: number;
  items: SavedCreation[];
}

function isNonEmptyString(val: unknown): val is string {
  return typeof val === "string";
}

function isStringArray(val: unknown): val is string[] {
  return Array.isArray(val) && val.every((item) => typeof item === "string");
}

function isValidInvention(val: unknown): val is InventionConcept {
  if (!val || typeof val !== "object") return false;
  const candidate = val as Record<string, unknown>;
  return (
    isNonEmptyString(candidate.id) &&
    isNonEmptyString(candidate.name) &&
    isNonEmptyString(candidate.direction) &&
    Array.isArray(candidate.steps) &&
    Array.isArray(candidate.assemblyParts)
  );
}

function isValidAnalysis(val: unknown): val is ObjectAnalysis {
  if (!val || typeof val !== "object") return false;
  const candidate = val as Record<string, unknown>;
  return (
    isNonEmptyString(candidate.objectName) &&
    isStringArray(candidate.materials) &&
    isStringArray(candidate.reusableParts)
  );
}

function isValidSavedCreation(val: unknown): val is SavedCreation {
  if (!val || typeof val !== "object") return false;
  const candidate = val as Record<string, unknown>;
  return (
    isNonEmptyString(candidate.id) &&
    isNonEmptyString(candidate.savedAt) &&
    typeof candidate.isFavorite === "boolean" &&
    isStringArray(candidate.completedStepIds) &&
    isValidInvention(candidate.invention) &&
    isValidAnalysis(candidate.analysis)
  );
}

export function loadSavedCreations(): SavedCreation[] {
  try {
    const raw = window.localStorage.getItem(SAVED_CREATIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);

    if (
      parsed &&
      typeof parsed === "object" &&
      "version" in parsed &&
      "items" in parsed
    ) {
      const envelope = parsed as Partial<StorageEnvelope>;
      if (Array.isArray(envelope.items)) {
        return envelope.items.filter(isValidSavedCreation);
      }
    }

    if (Array.isArray(parsed)) {
      return parsed.filter(isValidSavedCreation);
    }

    return [];
  } catch {
    return [];
  }
}

function persistSavedCreations(items: SavedCreation[]): boolean {
  try {
    const envelope: StorageEnvelope = {
      version: CURRENT_SCHEMA_VERSION,
      items,
    };
    window.localStorage.setItem(
      SAVED_CREATIONS_STORAGE_KEY,
      JSON.stringify(envelope)
    );
    return true;
  } catch {
    return false;
  }
}

export function upsertSavedCreation(
  invention: InventionConcept,
  analysis: ObjectAnalysis,
  completedStepIds: string[] = []
): { items: SavedCreation[]; ok: boolean } {
  const existing = loadSavedCreations();
  const idx = existing.findIndex(
    (entry) => entry.id === invention.id || entry.invention.id === invention.id
  );

  let next: SavedCreation[];
  if (idx >= 0) {
    const current = existing[idx];
    const updated: SavedCreation = {
      ...current,
      invention,
      analysis,
      completedStepIds:
        completedStepIds.length > 0 ? completedStepIds : current.completedStepIds,
    };
    next = [...existing];
    next[idx] = updated;
  } else {
    const created: SavedCreation = {
      id: invention.id,
      invention,
      analysis,
      savedAt: new Date().toISOString(),
      isFavorite: false,
      completedStepIds,
    };
    next = [created, ...existing];
  }

  const ok = persistSavedCreations(next);
  return { items: ok ? next : existing, ok };
}

export function removeSavedCreationById(id: string): {
  items: SavedCreation[];
  ok: boolean;
} {
  const existing = loadSavedCreations();
  const next = existing.filter(
    (entry) => entry.id !== id && entry.invention.id !== id
  );
  const ok = persistSavedCreations(next);
  return { items: ok ? next : existing, ok };
}

export function toggleFavoriteCreationById(id: string): {
  items: SavedCreation[];
  ok: boolean;
} {
  const existing = loadSavedCreations();
  const next = existing.map((entry) =>
    entry.id === id || entry.invention.id === id
      ? { ...entry, isFavorite: !entry.isFavorite }
      : entry
  );
  const ok = persistSavedCreations(next);
  return { items: ok ? next : existing, ok };
}

export function updateCreationChecklist(
  id: string,
  completedStepIds: string[]
): { items: SavedCreation[]; ok: boolean } {
  const existing = loadSavedCreations();
  const idx = existing.findIndex(
    (entry) => entry.id === id || entry.invention.id === id
  );
  if (idx < 0) {
    return { items: existing, ok: true };
  }
  const next = [...existing];
  next[idx] = {
    ...next[idx],
    completedStepIds,
  };
  const ok = persistSavedCreations(next);
  return { items: ok ? next : existing, ok };
}
