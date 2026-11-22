export type InputMode = "text" | "photo" | "sketch";

export type DirectionType = "PRACTICAL" | "UNEXPECTED" | "EXPERIMENTAL";

export type RefinementMode = "practical" | "creative" | "cheaper";

export type CurrencyCode = "PHP" | "USD" | "EUR" | "GBP" | "JPY";

export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";

export type StepActionType =
  | "measure"
  | "cut"
  | "puncture"
  | "fold"
  | "thread"
  | "join"
  | "mount"
  | "finish"
  | "test";

export type PartMaterialFinish =
  | "pet_plastic"
  | "cardboard"
  | "brushed_metal"
  | "wood_grain"
  | "terracotta"
  | "woven_fabric"
  | "ceramic"
  | "rubber";

export type PartShapeType =
  | "cylinder"
  | "box"
  | "cone"
  | "ring"
  | "rod"
  | "panel"
  | "dome";

export interface AssemblyPart3D {
  id: string;
  label: string;
  shape: PartShapeType;
  material: PartMaterialFinish;
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: [number, number, number];
  colorHex?: string;
  calloutIndex: number;
  description: string;
}

export interface ConstructionStep {
  id: string;
  stepNumber: number;
  title: string;
  instruction: string;
  actionType: StepActionType;
  tip?: string;
  diagramCaption: string;
}

export interface InventionConcept {
  id: string;
  direction: DirectionType;
  name: string;
  category: string;
  oneLineDescription: string;
  purpose: string;
  originalObjectContribution: string;
  materialsReused: string[];
  additionalMaterials: string[];
  requiredTools: string[];
  difficulty: DifficultyLevel;
  buildTimeMinutes: number;
  estimatedCostPhp: number;
  functionalityExplanation: string;
  dimensions: string;
  steps: ConstructionStep[];
  safetyConsiderations: string[];
  makeabilityScore: number;
  sustainabilityValue: string;
  testingValidation: string[];
  possibleImprovements: string[];
  assemblyParts: AssemblyPart3D[];
  studioPrompt: string;
  sourceSummary: string;
  generatedBy: "local" | "ai";
}

export interface ObjectAnalysis {
  objectName: string;
  category: string;
  originalFunction: string;
  condition: string[];
  physicalProperties: string[];
  shapeProfile: string;
  components: string[];
  materials: string[];
  reusableParts: string[];
  potentialFunctions: string[];
  limitations: string[];
  goalSummary: string;
  analysisNote?: string;
}

export interface UserConstraints {
  availableMaterials: string;
  budgetPhp: string;
  tools: string;
  spaceLimitation: string;
  skillLevel: string;
  intendedUser: string;
  desiredFunction: string;
}

export interface SynthesisInput {
  mode: InputMode;
  textDescription: string;
  photoNotes?: string;
  sketchNotes?: string;
  photoFileName?: string;
  photoMimeType?: string;
  photoDataUrl?: string;
  sketchDataUrl?: string;
  goal: string;
  constraints: UserConstraints;
}

export interface SynthesisResult {
  analysis: ObjectAnalysis;
  concepts: [InventionConcept, InventionConcept, InventionConcept];
  source: "local" | "ai";
}

export interface SavedCreation {
  id: string;
  invention: InventionConcept;
  analysis: ObjectAnalysis;
  savedAt: string;
  isFavorite: boolean;
  completedStepIds: string[];
}
