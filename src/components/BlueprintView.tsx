import React, { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  CheckSquare,
  Copy,
  Heart,
  Leaf,
  ShieldAlert,
  Sliders,
  Square,
  Wrench,
} from "lucide-react";
import { formatEstimatedCost } from "../config/currency";
import { requestStepPhotoRender } from "../services/inventionService";
import type {
  CurrencyCode,
  InventionConcept,
  ObjectAnalysis,
  RefinementMode,
} from "../types/invention";
import { Crafted3DViewer } from "./Crafted3DViewer";
import { CurrencySelector } from "./CurrencySelector";
import { StepIllustration } from "./StepIllustration";

interface BlueprintViewProps {
  invention: InventionConcept;
  analysis: ObjectAnalysis;
  currency: CurrencyCode;
  isSaved: boolean;
  isFavorite: boolean;
  completedStepIds: string[];
  isRefining: boolean;
  onBack: () => void;
  onCurrencyChange: (code: CurrencyCode) => void;
  onToggleSave: () => void;
  onToggleFavorite: () => void;
  onToggleStep: (stepId: string) => void;
  onRefine: (mode: RefinementMode) => void;
  onToast: (message: string, tone?: "success" | "info") => void;
}

function buildClipboardText(
  invention: InventionConcept,
  analysis: ObjectAnalysis,
  currency: CurrencyCode
): string {
  const lines = [
    `CRAFTLY BLUEPRINT: ${invention.name}`,
    `Direction: ${invention.direction} | Category: ${invention.category}`,
    `Built From: ${analysis.objectName}`,
    "",
    `Overview: ${invention.oneLineDescription}`,
    `Purpose: ${invention.purpose}`,
    `How It Works: ${invention.functionalityExplanation}`,
    `Dimensions: ${invention.dimensions}`,
    `Build Time: ${invention.buildTimeMinutes} min | Difficulty: ${invention.difficulty}`,
    `Estimated Cost (approx.): ${formatEstimatedCost(invention.estimatedCostPhp, currency)}`,
    "",
    "MATERIALS REUSED:",
    ...invention.materialsReused.map((m) => `- ${m}`),
    "",
    "ADDITIONAL MATERIALS:",
    ...invention.additionalMaterials.map((m) => `- ${m}`),
    "",
    "REQUIRED TOOLS:",
    ...invention.requiredTools.map((t) => `- ${t}`),
    "",
    "STEP-BY-STEP BUILD GUIDE:",
    ...invention.steps.map(
      (s) => `${s.stepNumber}. ${s.title}: ${s.instruction}`
    ),
    "",
    "SAFETY CONSIDERATIONS:",
    ...invention.safetyConsiderations.map((s) => `- ${s}`),
    "",
    `Sustainability Value: ${invention.sustainabilityValue}`,
  ];
  return lines.join("\n");
}

export const BlueprintView: React.FC<BlueprintViewProps> = ({
  invention,
  analysis,
  currency,
  isSaved,
  isFavorite,
  completedStepIds,
  isRefining,
  onBack,
  onCurrencyChange,
  onToggleSave,
  onToggleFavorite,
  onToggleStep,
  onRefine,
  onToast,
}) => {
  const [studioCloudActive, setStudioCloudActive] = useState(false);
  const [stepPhotos, setStepPhotos] = useState<Record<string, string>>({});
  const [activeStepPhotoId, setActiveStepPhotoId] = useState<string | null>(null);

  useEffect(() => {
    setStudioCloudActive(false);
    setStepPhotos({});
    setActiveStepPhotoId(null);
  }, [invention.id]);

  const handleStudioPhotoAvailable = useCallback(() => {
    setStudioCloudActive(true);
  }, []);

  useEffect(() => {
    if (!studioCloudActive) return;
    let cancelled = false;
    const materials = [
      ...invention.materialsReused.slice(0, 2),
      ...invention.additionalMaterials.slice(0, 2),
    ];

    (async () => {
      for (const step of invention.steps) {
        if (cancelled) break;
        setActiveStepPhotoId(step.id);
        const url = await requestStepPhotoRender(
          step.title,
          step.instruction,
          invention.name,
          analysis.objectName,
          materials,
          `step:${invention.id}:${step.id}`
        );
        if (cancelled) break;
        if (!url) {
          break;
        }
        setStepPhotos((prev) => ({ ...prev, [step.id]: url }));
      }
      if (!cancelled) {
        setActiveStepPhotoId(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    analysis.objectName,
    invention.additionalMaterials,
    invention.id,
    invention.materialsReused,
    invention.name,
    invention.steps,
    studioCloudActive,
  ]);

  const totalSteps = invention.steps.length;
  const completedCount = invention.steps.filter((s) =>
    completedStepIds.includes(s.id)
  ).length;
  const progressPercent =
    totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  const handleCopyBlueprint = async () => {
    const formatted = buildClipboardText(invention, analysis, currency);
    let copied = false;

    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      try {
        await navigator.clipboard.writeText(formatted);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (!copied) {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = formatted;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        copied = document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch {
        copied = false;
      }
    }

    if (copied) {
      onToast("Blueprint copied to clipboard.", "success");
    } else {
      onToast("Unable to copy automatically on this browser.", "info");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border-[1.5px] border-[#D8CFC0] bg-[#FFFDF9] p-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex min-h-[44px] w-fit items-center gap-2 rounded-xl border border-[#D8CFC0] bg-[#F2EADF] px-3.5 py-2 text-sm font-semibold text-[#4A3528] transition-colors hover:bg-[#EAE0D0]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyBlueprint}
            className="flex min-h-[44px] items-center gap-1.5 rounded-xl border border-[#D8CFC0] bg-[#F9F6F0] px-3.5 py-2 text-xs font-semibold text-[#4A3528] transition-colors hover:bg-[#F2EADF]"
          >
            <Copy className="h-4 w-4" />
            <span>Copy Blueprint</span>
          </button>

          <button
            type="button"
            onClick={onToggleFavorite}
            className="flex min-h-[44px] items-center gap-1.5 rounded-xl border border-[#D8CFC0] bg-[#F9F6F0] px-3.5 py-2 text-xs font-semibold text-[#4A3528] transition-colors hover:bg-[#F2EADF]"
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorite ? "fill-[#D98A6C] text-[#D98A6C]" : ""
              }`}
            />
            <span>{isFavorite ? "Favorited" : "Favorite"}</span>
          </button>

          <button
            type="button"
            onClick={onToggleSave}
            className={`flex min-h-[44px] items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
              isSaved
                ? "border border-[#7C8B6A] bg-[#7C8B6A] text-[#F9F6F0]"
                : "bg-[#D98A6C] text-[#1C1B19] hover:bg-[#C67658]"
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="h-4 w-4" />
                <span>Saved in Workshop</span>
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4" />
                <span>Save Blueprint</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editorial Blueprint Header + Specs */}
      <div className="rounded-2xl border-[1.5px] border-[#D8CFC0] bg-[#FFFDF9] p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-mono-tech font-semibold text-[#D98A6C]">
            {invention.direction}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold text-[#4A3528]/75">
            {invention.category}
          </span>
          <span aria-hidden="true">·</span>
          <span className="text-[#4A3528]/70">
            From: {analysis.objectName}
          </span>
        </div>

        <h1 className="font-display mt-2 text-2xl font-bold text-[#1C1B19] sm:text-4xl">
          {invention.name}
        </h1>
        <p className="mt-2.5 max-w-3xl text-base leading-relaxed text-[#4A3528]/85">
          {invention.oneLineDescription}
        </p>

        {/* Technical Metadata Bar */}
        <dl className="mt-5 grid grid-cols-2 gap-4 border-y border-[#D8CFC0] py-4 sm:grid-cols-4">
          <div>
            <dt className="text-xs text-[#4A3528]/65">Estimated Cost</dt>
            <dd className="font-mono-tech mt-0.5 text-lg font-semibold text-[#1C1B19]">
              {formatEstimatedCost(invention.estimatedCostPhp, currency)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-[#4A3528]/65">Build Duration</dt>
            <dd className="font-mono-tech mt-0.5 text-lg font-semibold text-[#1C1B19]">
              {invention.buildTimeMinutes} min
            </dd>
          </div>
          <div>
            <dt className="text-xs text-[#4A3528]/65">Difficulty</dt>
            <dd className="font-mono-tech mt-0.5 text-lg font-semibold text-[#1C1B19]">
              {invention.difficulty}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs text-[#4A3528]/65">Dimensions</dt>
            <dd className="font-mono-tech mt-0.5 break-words text-sm font-semibold text-[#1C1B19]">
              {invention.dimensions}
            </dd>
          </div>
        </dl>

        {/* Inline Currency Selector + Refinement Controls */}
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <CurrencySelector currency={currency} onChange={onCurrencyChange} />

          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-semibold text-[#4A3528]/75">
              <Sliders className="h-3.5 w-3.5" />
              <span>{isRefining ? "Refining..." : "Refine:"}</span>
            </span>
            <button
              type="button"
              disabled={isRefining}
              onClick={() => onRefine("practical")}
              className="min-h-[38px] rounded-xl border border-[#D8CFC0] bg-[#F2EADF] px-3 py-1 text-xs font-semibold text-[#4A3528] hover:border-[#4A3528]"
            >
              More Practical
            </button>
            <button
              type="button"
              disabled={isRefining}
              onClick={() => onRefine("creative")}
              className="min-h-[38px] rounded-xl border border-[#D8CFC0] bg-[#F2EADF] px-3 py-1 text-xs font-semibold text-[#4A3528] hover:border-[#4A3528]"
            >
              More Creative
            </button>
            <button
              type="button"
              disabled={isRefining}
              onClick={() => onRefine("cheaper")}
              className="min-h-[38px] rounded-xl border border-[#D8CFC0] bg-[#F2EADF] px-3 py-1 text-xs font-semibold text-[#4A3528] hover:border-[#4A3528]"
            >
              Cheaper
            </button>
          </div>
        </div>
      </div>

      {/* Realistic Crafted Output Reference */}
      <Crafted3DViewer
        invention={invention}
        analysis={analysis}
        onStudioPhotoAvailable={handleStudioPhotoAvailable}
      />

      {/* Functional Overview & Original Object Contribution */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border-[1.5px] border-[#D8CFC0] bg-[#FFFDF9] p-5">
          <h2 className="font-display text-lg font-semibold text-[#4A3528]">
            Purpose & How It Works
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#4A3528]/85">
            {invention.purpose}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#4A3528]/80">
            {invention.functionalityExplanation}
          </p>
        </section>

        <section className="rounded-2xl border-[1.5px] border-[#D8CFC0] bg-[#F2EADF] p-5">
          <h2 className="font-display text-lg font-semibold text-[#4A3528]">
            Original Object Contribution
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#4A3528]/85">
            {invention.originalObjectContribution}
          </p>
          <div className="mt-4 flex items-start gap-2.5 border-t border-[#D8CFC0] pt-3">
            <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-[#7C8B6A]" />
            <p className="text-xs leading-relaxed text-[#4A3528]/80">
              <strong className="text-[#4A3528]">Sustainability Impact:</strong>{" "}
              {invention.sustainabilityValue}
            </p>
          </div>
        </section>
      </div>

      {/* Materials & Tools */}
      <section className="grid grid-cols-1 gap-5 rounded-2xl border-[1.5px] border-[#D8CFC0] bg-[#FFFDF9] p-5 md:grid-cols-3">
        <div>
          <h3 className="text-sm font-bold text-[#7C8B6A]">
            Reused from Original Object
          </h3>
          <ul className="mt-2.5 space-y-1.5 text-sm text-[#4A3528]">
            {invention.materialsReused.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7C8B6A]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-[#D98A6C]">
            Additional Materials
          </h3>
          <ul className="mt-2.5 space-y-1.5 text-sm text-[#4A3528]">
            {invention.additionalMaterials.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D98A6C]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="flex items-center gap-1.5 text-sm font-bold text-[#4A3528]">
            <Wrench className="h-4 w-4 text-[#E0A952]" />
            <span>Required Tools</span>
          </h3>
          <ul className="mt-2.5 space-y-1.5 text-sm text-[#4A3528]">
            {invention.requiredTools.map((tool) => (
              <li key={tool} className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E0A952]" />
                <span>{tool}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Illustrated Interactive Construction Checklist */}
      <section className="rounded-2xl border-[1.5px] border-[#D8CFC0] bg-[#FFFDF9] p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 border-b border-[#D8CFC0] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono-tech text-xs font-medium uppercase tracking-wider text-[#7C8B6A]">
              Illustrated Build Checklist
            </p>
            <h2 className="font-display mt-0.5 text-xl font-semibold text-[#4A3528]">
              Step-by-Step Construction Guide
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-2.5 w-28 overflow-hidden rounded-full bg-[#F2EADF]">
              <div
                className="h-full rounded-full bg-[#7C8B6A] transition-all duration-200"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-mono-tech text-xs font-semibold text-[#4A3528]">
              {completedCount}/{totalSteps} done
            </span>
          </div>
        </div>

        <ol className="space-y-4">
          {invention.steps.map((step, stepIndex) => {
            const done = completedStepIds.includes(step.id);
            return (
              <li
                key={step.id}
                className={`flex flex-col gap-4 rounded-2xl border-[1.5px] p-4 transition-colors sm:flex-row sm:items-start ${
                  done
                    ? "border-[#7C8B6A]/60 bg-[#F2EADF]/70"
                    : "border-[#D8CFC0] bg-[#F9F6F0]"
                }`}
              >
                <StepIllustration
                  step={step}
                  stepIndex={stepIndex}
                  totalSteps={totalSteps}
                  invention={invention}
                  analysis={analysis}
                  photoUrl={stepPhotos[step.id]}
                  isRenderingPhoto={activeStepPhotoId === step.id}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => onToggleStep(step.id)}
                      className="flex min-h-[44px] items-start gap-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A3528]"
                    >
                      {done ? (
                        <CheckSquare className="mt-0.5 h-5 w-5 shrink-0 text-[#7C8B6A]" />
                      ) : (
                        <Square className="mt-0.5 h-5 w-5 shrink-0 text-[#4A3528]/60" />
                      )}
                      <span>
                        <span className="font-mono-tech mr-2 text-xs font-semibold text-[#D98A6C]">
                          STEP {String(step.stepNumber).padStart(2, "0")}
                        </span>
                        <span
                          className={`text-base font-bold ${
                            done
                              ? "text-[#4A3528]/60 line-through"
                              : "text-[#1C1B19]"
                          }`}
                        >
                          {step.title}
                        </span>
                      </span>
                    </button>
                  </div>

                  <p className="mt-1.5 text-sm leading-relaxed text-[#4A3528]/85 sm:pl-7">
                    {step.instruction}
                  </p>

                  {step.tip && (
                    <p className="mt-2 text-xs font-medium text-[#7C8B6A] sm:pl-7">
                      Workshop tip: {step.tip}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Safety, Testing & Possible Improvements */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <section className="rounded-2xl border-[1.5px] border-[#D8CFC0] bg-[#F2EADF] p-5">
          <h3 className="flex items-center gap-2 text-sm font-bold text-[#4A3528]">
            <ShieldAlert className="h-4 w-4 text-[#D98A6C]" />
            <span>Safety Considerations</span>
          </h3>
          <ul className="mt-2.5 space-y-2 text-xs leading-relaxed text-[#4A3528]/85">
            {invention.safetyConsiderations.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border-[1.5px] border-[#D8CFC0] bg-[#FFFDF9] p-5">
          <h3 className="text-sm font-bold text-[#4A3528]">
            Testing & Validation
          </h3>
          <ul className="mt-2.5 space-y-2 text-xs leading-relaxed text-[#4A3528]/85">
            {invention.testingValidation.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border-[1.5px] border-[#D8CFC0] bg-[#FFFDF9] p-5">
          <h3 className="text-sm font-bold text-[#4A3528]">
            Possible Improvements
          </h3>
          <ul className="mt-2.5 space-y-2 text-xs leading-relaxed text-[#4A3528]/85">
            {invention.possibleImprovements.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};
