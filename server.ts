import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { DEFAULT_MODEL, FALLBACK_MODEL, IMAGE_GEN_MODEL } from "./src/config/ai.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

function createGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

function parseDataUrl(dataUrl?: string): { mimeType: string; data: string } | null {
  if (!dataUrl || typeof dataUrl !== "string") return null;
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;
  return { mimeType: match[1], data: match[2] };
}

const ASSEMBLY_PART_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    label: { type: Type.STRING },
    shape: {
      type: Type.STRING,
      description: "One of: cylinder, box, cone, ring, rod, panel, dome",
    },
    material: {
      type: Type.STRING,
      description:
        "One of: pet_plastic, cardboard, brushed_metal, wood_grain, terracotta, woven_fabric, ceramic, rubber",
    },
    position: {
      type: Type.ARRAY,
      items: { type: Type.NUMBER },
      description: "3-element [x, y, z] coordinates in range -1.0 to 1.0",
    },
    scale: {
      type: Type.ARRAY,
      items: { type: Type.NUMBER },
      description: "3-element [sx, sy, sz] dimensions in range 0.1 to 1.6",
    },
    colorHex: { type: Type.STRING },
    calloutIndex: { type: Type.INTEGER },
    description: { type: Type.STRING },
  },
  required: [
    "id",
    "label",
    "shape",
    "material",
    "position",
    "scale",
    "colorHex",
    "calloutIndex",
    "description",
  ],
};

const STEP_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    stepNumber: { type: Type.INTEGER },
    title: { type: Type.STRING },
    instruction: { type: Type.STRING },
    actionType: {
      type: Type.STRING,
      description:
        "One of: measure, cut, puncture, fold, thread, join, mount, finish, test",
    },
    tip: { type: Type.STRING },
    diagramCaption: { type: Type.STRING },
  },
  required: [
    "id",
    "stepNumber",
    "title",
    "instruction",
    "actionType",
    "diagramCaption",
  ],
};

const CONCEPT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    direction: {
      type: Type.STRING,
      description: "PRACTICAL, UNEXPECTED, or EXPERIMENTAL",
    },
    name: { type: Type.STRING },
    category: { type: Type.STRING },
    oneLineDescription: { type: Type.STRING },
    purpose: { type: Type.STRING },
    originalObjectContribution: { type: Type.STRING },
    materialsReused: { type: Type.ARRAY, items: { type: Type.STRING } },
    additionalMaterials: { type: Type.ARRAY, items: { type: Type.STRING } },
    requiredTools: { type: Type.ARRAY, items: { type: Type.STRING } },
    difficulty: {
      type: Type.STRING,
      description: "Beginner, Intermediate, or Advanced",
    },
    buildTimeMinutes: { type: Type.INTEGER },
    estimatedCostPhp: { type: Type.INTEGER },
    functionalityExplanation: { type: Type.STRING },
    dimensions: { type: Type.STRING },
    steps: { type: Type.ARRAY, items: STEP_SCHEMA },
    safetyConsiderations: { type: Type.ARRAY, items: { type: Type.STRING } },
    makeabilityScore: { type: Type.INTEGER },
    sustainabilityValue: { type: Type.STRING },
    testingValidation: { type: Type.ARRAY, items: { type: Type.STRING } },
    possibleImprovements: { type: Type.ARRAY, items: { type: Type.STRING } },
    assemblyParts: { type: Type.ARRAY, items: ASSEMBLY_PART_SCHEMA },
    studioPrompt: { type: Type.STRING },
    sourceSummary: { type: Type.STRING },
  },
  required: [
    "id",
    "direction",
    "name",
    "category",
    "oneLineDescription",
    "purpose",
    "originalObjectContribution",
    "materialsReused",
    "additionalMaterials",
    "requiredTools",
    "difficulty",
    "buildTimeMinutes",
    "estimatedCostPhp",
    "functionalityExplanation",
    "dimensions",
    "steps",
    "safetyConsiderations",
    "makeabilityScore",
    "sustainabilityValue",
    "testingValidation",
    "possibleImprovements",
    "assemblyParts",
    "studioPrompt",
    "sourceSummary",
  ],
};

const SYNTHESIS_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    analysis: {
      type: Type.OBJECT,
      properties: {
        objectName: { type: Type.STRING },
        category: { type: Type.STRING },
        originalFunction: { type: Type.STRING },
        condition: { type: Type.ARRAY, items: { type: Type.STRING } },
        physicalProperties: { type: Type.ARRAY, items: { type: Type.STRING } },
        shapeProfile: { type: Type.STRING },
        components: { type: Type.ARRAY, items: { type: Type.STRING } },
        materials: { type: Type.ARRAY, items: { type: Type.STRING } },
        reusableParts: { type: Type.ARRAY, items: { type: Type.STRING } },
        potentialFunctions: { type: Type.ARRAY, items: { type: Type.STRING } },
        limitations: { type: Type.ARRAY, items: { type: Type.STRING } },
        goalSummary: { type: Type.STRING },
      },
      required: [
        "objectName",
        "category",
        "originalFunction",
        "condition",
        "physicalProperties",
        "shapeProfile",
        "components",
        "materials",
        "reusableParts",
        "potentialFunctions",
        "limitations",
        "goalSummary",
      ],
    },
    concepts: {
      type: Type.ARRAY,
      items: CONCEPT_SCHEMA,
    },
  },
  required: ["analysis", "concepts"],
};

async function generateWithFallbackModel(
  ai: GoogleGenAI,
  contents: unknown,
  responseSchema: unknown,
  systemInstruction: string
): Promise<string | undefined> {
  const modelsToTry = [DEFAULT_MODEL, FALLBACK_MODEL];
  for (const modelName of modelsToTry) {
    try {
      const config: Record<string, unknown> = {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema as Record<string, unknown>,
      };
      if (modelName.startsWith("gemini-4")) {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents: contents as string,
        config,
      });
      if (response.text) {
        return response.text;
      }
    } catch {
      // Try next model or let outer handler return fallback: true
    }
  }
  return undefined;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "12mb" }));

  app.post("/api/inventions/synthesize", async (req, res) => {
    const ai = createGeminiClient();
    if (!ai) {
      res.json({ fallback: true });
      return;
    }

    try {
      const { input, excludeNames } = req.body as {
        input: {
          mode?: "text" | "photo" | "sketch";
          textDescription?: string;
          photoNotes?: string;
          sketchNotes?: string;
          photoFileName?: string;
          photoDataUrl?: string;
          sketchDataUrl?: string;
          goal?: string;
          constraints?: Record<string, string>;
        };
        excludeNames?: string[];
      };

      const activeMode =
        input?.mode === "photo" || input?.mode === "sketch"
          ? input.mode
          : "text";

      const systemInstruction =
        "You are Craftly, an authentic hands-on industrial craft & upcycling studio. " +
        "Analyze the exact salvaged object provided—respecting its true physical material (rubber/EVA foam, rigid plastic, glass, ceramic, metal wire, wood, woven textile, paperboard), surface texture, structural strengths, and damage. " +
        "Generate EXACTLY 3 genuinely distinct, hand-crafty, realistically buildable invention concepts: " +
        "1) PRACTICAL, 2) UNEXPECTED, and 3) EXPERIMENTAL. " +
        "CRITICAL ACCURACY & UNIQUENESS RULES: " +
        "- Never return generic cliché ideas ('desk organizer', 'terrarium', 'easel') unless genuinely tailored to that exact material's real-world mechanics. " +
        "- Exploit what makes THAT specific object unique (e.g., EVA rubber slipper sole -> carved relief-print stamp block, ribbed anti-vibration pad/doorstop, friction-slit broom/cable grip rack; cracked ceramic mug -> unglazed foot-ring knife honer or acoustic speaker bell; broken umbrella -> ripstop hanging gear caddy or parabolic diffuser; fan wire grille -> suspended moss basket or tool carousel). " +
        "- Every joint, cut, fastener, adhesive, and tool MUST physically work on that material (never suggest crimping glass, putting flames near plastic/foam, or drilling brittle stoneware with basic wood bits). " +
        "- Strictly honor the user's goal and constraints (budget cap in PHP, tools on hand, beginner/intermediate/advanced skill level, space limit). " +
        "- Never use emojis anywhere. Costs must be realistic Philippine Peso (PHP) estimates. " +
        "Each concept must have 4-5 clear steps with valid actionType (measure, cut, puncture, fold, thread, join, mount, finish, test) " +
        "and 3-4 assemblyParts with valid shape (cylinder, box, cone, ring, rod, panel, dome) and material " +
        "(pet_plastic, cardboard, brushed_metal, wood_grain, terracotta, woven_fabric, ceramic, rubber). " +
        "Keep coordinates in [-0.8, 0.8] and scales in [0.12, 1.5]. " +
        "Write studioPrompt as a vivid, concrete product photography prompt describing the finished physical object in realistic detail, visible salvaged parts, authentic handmade joinery, and real-world contents.";

      const modeDirective =
        activeMode === "photo"
          ? "[INPUT MODE: UPLOADED PHOTO] Inspect the attached photograph carefully FIRST to identify the exact object, material, color, texture, and damage. Treat user notes as supplementary context."
          : activeMode === "sketch"
            ? "[INPUT MODE: HAND-DRAWN SKETCH] Inspect the attached hand-drawn sketch carefully to interpret the drawn object silhouette, proportions, and parts alongside the user's sketch notes."
            : "[INPUT MODE: TEXT DESCRIPTION] Analyze the exact object, material, and condition described below.";

      const activeDescription =
        activeMode === "photo"
          ? (input?.photoNotes ?? "").trim()
          : activeMode === "sketch"
            ? (input?.sketchNotes ?? "").trim()
            : (input?.textDescription ?? "").trim();

      const textPrompt = [
        modeDirective,
        activeDescription
          ? `User object description/notes: ${activeDescription}`
          : activeMode === "text"
            ? "Object description: Everyday object"
            : "No text notes provided—rely directly on visual inspection of the attached image.",
        activeMode === "photo" && input?.photoFileName
          ? `Photo filename hint: ${input.photoFileName}`
          : "",
        `User goal: ${input?.goal || "Practical and imaginative everyday second life"}`,
        input?.constraints
          ? `Constraints: ${JSON.stringify(input.constraints)}`
          : "",
        Array.isArray(excludeNames) && excludeNames.length > 0
          ? `Avoid repeating these previous invention titles or mechanisms: ${excludeNames.join(", ")}`
          : "",
      ]
        .filter(Boolean)
        .join("\n");

      const parts: Array<Record<string, unknown>> = [{ text: textPrompt }];
      const imageAttachment =
        activeMode === "photo"
          ? parseDataUrl(input?.photoDataUrl)
          : activeMode === "sketch"
            ? parseDataUrl(input?.sketchDataUrl)
            : null;

      if (imageAttachment) {
        parts.unshift({
          inlineData: {
            mimeType: imageAttachment.mimeType,
            data: imageAttachment.data,
          },
        });
      }

      const rawText = await generateWithFallbackModel(
        ai,
        { parts },
        SYNTHESIS_RESPONSE_SCHEMA,
        systemInstruction
      );

      if (!rawText) {
        res.json({ fallback: true });
        return;
      }

      const parsed = JSON.parse(rawText) as {
        analysis?: Record<string, unknown>;
        concepts?: Array<Record<string, unknown>>;
      };

      if (
        !parsed.analysis ||
        !Array.isArray(parsed.concepts) ||
        parsed.concepts.length < 3
      ) {
        res.json({ fallback: true });
        return;
      }

      const directions = ["PRACTICAL", "UNEXPECTED", "EXPERIMENTAL"] as const;
      const normalizedConcepts = parsed.concepts.slice(0, 3).map((c, idx) => ({
        ...c,
        id: `craftly-ai-${Date.now().toString(36)}-${idx}`,
        direction: directions[idx],
        generatedBy: "ai",
      }));

      res.json({
        fallback: false,
        result: {
          analysis: parsed.analysis,
          concepts: normalizedConcepts,
          source: "ai",
        },
      });
    } catch {
      res.json({ fallback: true });
    }
  });

  app.post("/api/inventions/refine", async (req, res) => {
    const ai = createGeminiClient();
    if (!ai) {
      res.json({ fallback: true });
      return;
    }

    try {
      const { invention, analysis, mode } = req.body as {
        invention: Record<string, unknown>;
        analysis: Record<string, unknown>;
        mode: "practical" | "creative" | "cheaper";
      };

      const modeInstructions =
        mode === "practical"
          ? "Refine to be MORE PRACTICAL: fewer materials, simpler cuts, everyday household tools, reliable daily ergonomics."
          : mode === "creative"
            ? "Refine to be MORE CREATIVE: introduce an unexpected mechanical or dual-use twist while staying realistically buildable."
            : "Refine to be CHEAPER: maximize reuse of the original salvaged object, eliminate store-bought hardware, target near-zero PHP cost.";

      const systemInstruction =
        "You are Craftly, an industrial design studio refining a single invention blueprint. " +
        "Meaningfully update materials, tools, steps, mechanics, build time, and PHP cost—never just reword the title. Never use emojis.";

      const prompt = `Original object: ${JSON.stringify(analysis)}\nCurrent invention: ${JSON.stringify(invention)}\nRefinement direction: ${modeInstructions}`;

      const rawText = await generateWithFallbackModel(
        ai,
        prompt,
        CONCEPT_SCHEMA,
        systemInstruction
      );

      if (!rawText) {
        res.json({ fallback: true });
        return;
      }

      const parsed = JSON.parse(rawText) as Record<string, unknown>;
      if (!parsed.name || !Array.isArray(parsed.steps)) {
        res.json({ fallback: true });
        return;
      }

      res.json({
        fallback: false,
        invention: {
          ...parsed,
          id: `craftly-ai-ref-${Date.now().toString(36)}`,
          generatedBy: "ai",
        },
      });
    } catch {
      res.json({ fallback: true });
    }
  });

  app.post("/api/inventions/render-photo", async (req, res) => {
    const ai = createGeminiClient();
    if (!ai) {
      res.json({ fallback: true });
      return;
    }

    try {
      const {
        studioPrompt,
        aspectRatio,
        referenceType,
        objectName,
        inventionName,
        materials,
      } = req.body as {
        studioPrompt?: string;
        aspectRatio?: "1:1" | "4:3" | "16:9" | "3:4" | "9:16";
        referenceType?: "output" | "step";
        objectName?: string;
        inventionName?: string;
        materials?: string[];
      };

      if (!studioPrompt) {
        res.json({ fallback: true });
        return;
      }

      const validRatios = new Set(["1:1", "3:4", "4:3", "9:16", "16:9"]);
      const safeAspectRatio =
        aspectRatio && validRatios.has(aspectRatio) ? aspectRatio : "4:3";

      const materialContext =
        Array.isArray(materials) && materials.length > 0
          ? ` Visible physical materials: ${materials.slice(0, 4).join(", ")}.`
          : "";

      const fullPrompt =
        referenceType === "step"
          ? `Photorealistic overhead three-quarter workshop instructional photograph showing a craftsperson's hands and real household tools performing this build step: ${studioPrompt}.${
              objectName ? ` Salvaged base object: ${objectName}.` : ""
            }${materialContext} Placed on a warm natural oak workbench in crisp morning studio daylight, authentic physical textures, clear recognizable parts, shallow depth of field, 50mm lens photography, zero text, zero numbers, zero arrows, zero watermarks.`
          : `Photorealistic editorial product photograph of the finished handmade upcycled invention${
              inventionName ? ` "${inventionName}"` : ""
            }: ${studioPrompt}.${
              objectName ? ` Clearly built from salvaged ${objectName}.` : ""
            }${materialContext} Placed in real-world use on a sunlit natural oak studio workbench, soft directional window daylight, authentic handmade joinery and crisp physical textures, 50mm product photography, zero text, zero labels, zero watermarks.`;

      const response = await ai.models.generateContent({
        model: IMAGE_GEN_MODEL,
        contents: {
          parts: [{ text: fullPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: safeAspectRatio,
          },
        },
      });

      const parts = response.candidates?.[0]?.content?.parts ?? [];
      for (const part of parts) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType ?? "image/png";
          res.json({
            fallback: false,
            imageUrl: `data:${mime};base64,${part.inlineData.data}`,
          });
          return;
        }
      }

      res.json({ fallback: true });
    } catch {
      res.json({ fallback: true });
    }
  });

  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
        ws: {
          server: httpServer,
        },
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Craftly studio server running on http://localhost:${PORT}`);
  });
}

startServer();
