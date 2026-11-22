import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Heart,
  RefreshCw,
  Sliders,
} from "lucide-react";
import { formatEstimatedCost } from "../config/currency";
import type {
  CurrencyCode,
  InventionConcept,
  ObjectAnalysis,
  RefinementMode,
  SavedCreation,
} from "../types/invention";
import { CurrencySelector } from "./CurrencySelector";

interface InventionResultsProps {
  analysis: ObjectAnalysis;
  concepts: [InventionConcept, InventionConcept, InventionConcept];
  currency: CurrencyCode;
  savedCreations: SavedCreation[];
  isGeneratingMore: boolean;
  refiningId: string | null;
  loadingPhrase: string;
  onCurrencyChange: (code: CurrencyCode) => void;
  onOpenBlueprint: (concept: InventionConcept) => void;
  onToggleSave: (concept: InventionConcept) => void;
  onToggleFavorite: (concept: InventionConcept) => void;
  onRefine: (concept: InventionConcept, mode: RefinementMode) => void;
  onWhatElse: () => void;
}

const DIRECTION_STYLES = {
  PRACTICAL: {
    kicker: "PRACTICAL",
    subtitle: "Reliable, straightforward build",
    cardClass: "bg-[#F2EADF] border-[#D8CFC0]",
    accentText: "text-[#4A3528]",
  },
  UNEXPECTED: {
    kicker: "UNEXPECTED",
    subtitle: "Surprising functional shift",
    cardClass: "bg-[#FFFDF9] border-[#D8CFC0] lg:mt-4",
    accentText: "text-[#7C8B6A]",
  },
  EXPERIMENTAL: {
    kicker: "EXPERIMENTAL",
    subtitle: "Inventive mechanical twist",
    cardClass: "bg-[#F7F1E7] border-[#D8CFC0] lg:mt-2",
    accentText: "text-[#D98A6C]",
  },
} as const;

export const InventionResults: React.FC<InventionResultsProps> = ({
  analysis,
  concepts,
  currency,
  savedCreations,
  isGeneratingMore,
  refiningId,
  loadingPhrase,
  onCurrencyChange,
  onOpenBlueprint,
  onToggleSave,
  onToggleFavorite,
  onRefine,
  onWhatElse,
}) => {
  return (
    <section
      aria-label="Generated invention directions"
      className="mt-10 space-y-6"
    >
      {/* Object Analysis Digest */}
      <div className="rounded-2xl border-[1.5px] border-[#D8CFC0] bg-[#FFFDF9] p-4 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1.5">
            <p className="font-mono-tech text-xs font-medium uppercase tracking-wider text-[#7C8B6A]">
              Object Analysis
            </p>
            <h2 className="font-display text-xl font-semibold text-[#4A3528] sm:text-2xl">
              {analysis.objectName}
            </h2>
            <p className="text-sm text-[#4A3528]/80">
              {analysis.category} · Goal: {analysis.goalSummary}
            </p>
            {analysis.analysisNote && (
              <p className="pt-1 text-xs text-[#4A3528]/65">
                {analysis.analysisNote}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 lg:max-w-lg">
            <div>
              <span className="font-bold text-[#4A3528]">Reusable Parts: </span>
              <span className="text-[#4A3528]/80">
                {analysis.reusableParts.slice(0, 3).join(", ")}
              </span>
            </div>
            <div>
              <span className="font-bold text-[#4A3528]">Properties: </span>
              <span className="text-[#4A3528]/80">
                {analysis.physicalProperties.slice(0, 3).join(", ")}
              </span>
            </div>
          </div>
        </div>

        {/* Workspace Controls: Currency & "What else?" */}
        <div className="mt-5 flex flex-col gap-3 border-t border-[#D8CFC0] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <CurrencySelector currency={currency} onChange={onCurrencyChange} />

          <button
            type="button"
            onClick={onWhatElse}
            disabled={isGeneratingMore}
            className="flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-xl border-[1.5px] border-[#4A3528] bg-[#FFFDF9] px-4 py-2 text-sm font-bold text-[#4A3528] transition-colors hover:bg-[#4A3528] hover:text-[#F9F6F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A3528] disabled:cursor-wait disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 shrink-0 ${isGeneratingMore ? "animate-spin" : ""}`}
            />
            <span>{isGeneratingMore ? loadingPhrase : "What else?"}</span>
          </button>
        </div>
      </div>

      {/* Three Asymmetric Editorial Concept Cards */}
      <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2 lg:grid-cols-3">
        {concepts.map((concept, idx) => {
          const style = DIRECTION_STYLES[concept.direction];
          const savedEntry = savedCreations.find(
            (s) => s.id === concept.id || s.invention.id === concept.id
          );
          const isSaved = Boolean(savedEntry);
          const isFav = Boolean(savedEntry?.isFavorite);
          const isRefining = refiningId === concept.id;

          return (
            <motion.article
              key={concept.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: idx * 0.05 }}
              className={`flex flex-col justify-between rounded-2xl border-[1.5px] p-5 shadow-sm ${style.cardClass}`}
            >
              <div>
                {/* Editorial Direction Header */}
                <div className="flex items-start justify-between gap-2 border-b border-[#D8CFC0] pb-3">
                  <div>
                    <span
                      className={`font-mono-tech text-xs font-semibold tracking-wider ${style.accentText}`}
                    >
                      {style.kicker}
                    </span>
                    <p className="text-xs text-[#4A3528]/65">
                      {concept.category} · {style.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(concept)}
                      aria-label={
                        isFav ? "Remove from favorites" : "Favorite invention"
                      }
                      className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl text-[#4A3528] transition-colors hover:bg-[#EAE0D0]"
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          isFav
                            ? "fill-[#D98A6C] text-[#D98A6C]"
                            : "text-[#4A3528]/70"
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleSave(concept)}
                      aria-label={isSaved ? "Unsave invention" : "Save invention"}
                      className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl text-[#4A3528] transition-colors hover:bg-[#EAE0D0]"
                    >
                      {isSaved ? (
                        <BookmarkCheck className="h-4 w-4 text-[#7C8B6A]" />
                      ) : (
                        <Bookmark className="h-4 w-4 text-[#4A3528]/70" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Title & Summary */}
                <h3 className="font-display mt-3.5 text-xl font-semibold leading-snug text-[#1C1B19]">
                  {concept.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4A3528]/85">
                  {concept.oneLineDescription}
                </p>

                {/* Original Object Connection */}
                <div className="mt-3.5 border-t border-[#D8CFC0]/80 pt-3">
                  <p className="text-xs font-bold text-[#4A3528]">
                    How it uses your object
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#4A3528]/75">
                    {concept.originalObjectContribution}
                  </p>
                </div>

                {/* Spec Strip (JetBrains Mono, Unboxed Clean Typography) */}
                <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 border-y border-[#D8CFC0]/80 py-3 text-xs">
                  <div>
                    <dt className="text-[#4A3528]/60">Est. Cost</dt>
                    <dd className="font-mono-tech font-semibold text-[#1C1B19]">
                      {formatEstimatedCost(concept.estimatedCostPhp, currency)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#4A3528]/60">Build Time</dt>
                    <dd className="font-mono-tech font-semibold text-[#1C1B19]">
                      {concept.buildTimeMinutes} min
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#4A3528]/60">Difficulty</dt>
                    <dd className="font-mono-tech font-semibold text-[#1C1B19]">
                      {concept.difficulty}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#4A3528]/60">Makeability</dt>
                    <dd className="font-mono-tech font-semibold text-[#1C1B19]">
                      {concept.makeabilityScore}/100
                    </dd>
                  </div>
                </dl>

                {/* Materials Preview */}
                <div className="mt-3">
                  <p className="text-xs font-bold text-[#4A3528]">
                    Materials preview
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#4A3528]/75">
                    {[
                      ...concept.materialsReused.slice(0, 2),
                      ...concept.additionalMaterials.slice(0, 1),
                    ].join(" · ")}
                  </p>
                </div>
              </div>

              {/* Card Actions & Single-Card Refinements */}
              <div className="mt-5 space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => onOpenBlueprint(concept)}
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#D98A6C] px-4 py-2.5 text-sm font-bold text-[#1C1B19] transition-colors hover:bg-[#C67658] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A3528]"
                >
                  <span>Open Blueprint</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#4A3528]/65">
                    <Sliders className="h-3 w-3" />
                    <span>{isRefining ? "Refining concept..." : "Refine this idea:"}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      disabled={isRefining}
                      onClick={() => onRefine(concept, "practical")}
                      className="min-h-[38px] flex-1 basis-[92px] rounded-lg border border-[#D8CFC0] bg-[#FFFDF9] px-2 py-1 text-[11px] font-semibold text-[#4A3528] transition-colors hover:border-[#4A3528] disabled:opacity-50"
                    >
                      More Practical
                    </button>
                    <button
                      type="button"
                      disabled={isRefining}
                      onClick={() => onRefine(concept, "creative")}
                      className="min-h-[38px] flex-1 basis-[92px] rounded-lg border border-[#D8CFC0] bg-[#FFFDF9] px-2 py-1 text-[11px] font-semibold text-[#4A3528] transition-colors hover:border-[#4A3528] disabled:opacity-50"
                    >
                      More Creative
                    </button>
                    <button
                      type="button"
                      disabled={isRefining}
                      onClick={() => onRefine(concept, "cheaper")}
                      className="min-h-[38px] flex-1 basis-[78px] rounded-lg border border-[#D8CFC0] bg-[#FFFDF9] px-2 py-1 text-[11px] font-semibold text-[#4A3528] transition-colors hover:border-[#4A3528] disabled:opacity-50"
                    >
                      Cheaper
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};
