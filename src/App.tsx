import { useCallback, useEffect, useRef, useState } from "react";
import { BlueprintView } from "./components/BlueprintView";
import { Header, type ActiveNavView } from "./components/Header";
import { HowItWorksModal } from "./components/HowItWorksModal";
import { InputWorkspace } from "./components/InputWorkspace";
import { InventionResults } from "./components/InventionResults";
import { Toast, type ToastMessage } from "./components/Toast";
import { WorkshopBackground } from "./components/WorkshopBackground";
import { WorkshopView } from "./components/WorkshopView";
import { loadStoredCurrency, persistCurrency } from "./config/currency";
import {
  generateInventions,
  LOADING_PHRASES,
  refineSingleInvention,
} from "./services/inventionService";
import type {
  CurrencyCode,
  InventionConcept,
  ObjectAnalysis,
  RefinementMode,
  SavedCreation,
  SynthesisInput,
  SynthesisResult,
} from "./types/invention";
import {
  loadSavedCreations,
  removeSavedCreationById,
  toggleFavoriteCreationById,
  updateCreationChecklist,
  upsertSavedCreation,
} from "./utils/storage";

const INITIAL_INPUT: SynthesisInput = {
  mode: "text",
  textDescription: "",
  photoNotes: "",
  sketchNotes: "",
  goal: "",
  constraints: {
    availableMaterials: "",
    budgetPhp: "",
    tools: "",
    spaceLimitation: "",
    skillLevel: "",
    intendedUser: "",
    desiredFunction: "",
  },
};

export default function App() {
  const [activeNav, setActiveNav] = useState<ActiveNavView>("discover");
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  const [currency, setCurrency] = useState<CurrencyCode>(() =>
    loadStoredCurrency()
  );
  const [input, setInput] = useState<SynthesisInput>(INITIAL_INPUT);
  const [synthesisResult, setSynthesisResult] =
    useState<SynthesisResult | null>(null);
  const [sessionHistoryNames, setSessionHistoryNames] = useState<string[]>([]);
  const [whatElseBatch, setWhatElseBatch] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);
  const [refiningId, setRefiningId] = useState<string | null>(null);
  const [loadingPhraseIdx, setLoadingPhraseIdx] = useState(0);

  const [savedCreations, setSavedCreations] = useState<SavedCreation[]>(() =>
    loadSavedCreations()
  );

  // Active blueprint state (either from current results or reopened from My Workshop)
  const [activeBlueprint, setActiveBlueprint] = useState<{
    invention: InventionConcept;
    analysis: ObjectAnalysis;
    returnTo: ActiveNavView;
  } | null>(null);

  // Transient checklist state for unsaved blueprints
  const [unsavedStepsById, setUnsavedStepsById] = useState<
    Record<string, string[]>
  >({});

  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const showToast = useCallback(
    (text: string, tone: "success" | "info" = "success") => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
      setToast({ id: Date.now(), text, tone });
      toastTimerRef.current = window.setTimeout(() => {
        setToast(null);
      }, 3200);
    },
    []
  );

  useEffect(() => {
    if (!isLoading && !isGeneratingMore) return;
    const timer = window.setInterval(() => {
      setLoadingPhraseIdx((prev) => (prev + 1) % LOADING_PHRASES.length);
    }, 1100);
    return () => window.clearInterval(timer);
  }, [isGeneratingMore, isLoading]);

  const handleCurrencyChange = (next: CurrencyCode) => {
    setCurrency(next);
    persistCurrency(next);
  };

  const handleSynthesize = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setLoadingPhraseIdx(0);

    try {
      const result = await generateInventions(input, { batchSeed: 0 });
      setSynthesisResult(result);
      setWhatElseBatch(1);
      setSessionHistoryNames(result.concepts.map((c) => c.name));
      setActiveBlueprint(null);

      window.requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatElse = async () => {
    if (isGeneratingMore || !synthesisResult) return;
    setIsGeneratingMore(true);
    setLoadingPhraseIdx(1);

    try {
      const nextBatch = whatElseBatch + 1;
      const result = await generateInventions(input, {
        excludeNames: sessionHistoryNames,
        batchSeed: nextBatch,
      });
      setSynthesisResult(result);
      setWhatElseBatch(nextBatch);
      setSessionHistoryNames((prev) => [
        ...prev,
        ...result.concepts.map((c) => c.name),
      ]);
      showToast("Explored three fresh invention angles.");
    } finally {
      setIsGeneratingMore(false);
    }
  };

  const handleRefineConcept = async (
    concept: InventionConcept,
    mode: RefinementMode
  ) => {
    const analysis =
      activeBlueprint?.analysis ?? synthesisResult?.analysis;
    if (!analysis || refiningId) return;

    setRefiningId(concept.id);
    try {
      const refined = await refineSingleInvention(concept, analysis, mode);

      if (synthesisResult) {
        const updatedConcepts = synthesisResult.concepts.map((c) =>
          c.id === concept.id ? refined : c
        ) as [InventionConcept, InventionConcept, InventionConcept];
        setSynthesisResult({
          ...synthesisResult,
          concepts: updatedConcepts,
        });
      }

      if (activeBlueprint && activeBlueprint.invention.id === concept.id) {
        setActiveBlueprint({
          ...activeBlueprint,
          invention: refined,
        });
      }

      const modeLabel =
        mode === "practical"
          ? "more practical"
          : mode === "creative"
            ? "more creative"
            : "cheaper";
      showToast(`Refined "${refined.name}" to be ${modeLabel}.`);
    } finally {
      setRefiningId(null);
    }
  };

  const handleToggleSaveConcept = (
    concept: InventionConcept,
    analysis: ObjectAnalysis
  ) => {
    const existing = savedCreations.find(
      (s) => s.id === concept.id || s.invention.id === concept.id
    );

    if (existing) {
      const res = removeSavedCreationById(existing.id);
      setSavedCreations(res.items);
      showToast("Removed from My Workshop.", "info");
    } else {
      const completed = unsavedStepsById[concept.id] ?? [];
      const res = upsertSavedCreation(concept, analysis, completed);
      setSavedCreations(res.items);
      showToast(
        res.ok
          ? "Saved blueprint to My Workshop."
          : "Storage full—could not save blueprint."
      );
    }
  };

  const handleToggleFavoriteConcept = (
    concept: InventionConcept,
    analysis: ObjectAnalysis
  ) => {
    const existing = savedCreations.find(
      (s) => s.id === concept.id || s.invention.id === concept.id
    );

    if (!existing) {
      const completed = unsavedStepsById[concept.id] ?? [];
      const saved = upsertSavedCreation(concept, analysis, completed);
      if (saved.ok) {
        const favRes = toggleFavoriteCreationById(concept.id);
        setSavedCreations(favRes.items);
        showToast("Saved and added to Favorites.");
      }
      return;
    }

    const res = toggleFavoriteCreationById(existing.id);
    setSavedCreations(res.items);
    const updated = res.items.find((i) => i.id === existing.id);
    showToast(
      updated?.isFavorite ? "Added to Favorites." : "Removed from Favorites.",
      updated?.isFavorite ? "success" : "info"
    );
  };

  const handleToggleStep = (inventionId: string, stepId: string) => {
    const savedEntry = savedCreations.find(
      (s) => s.id === inventionId || s.invention.id === inventionId
    );

    const currentSteps = savedEntry
      ? savedEntry.completedStepIds
      : unsavedStepsById[inventionId] ?? [];

    const nextSteps = currentSteps.includes(stepId)
      ? currentSteps.filter((id) => id !== stepId)
      : [...currentSteps, stepId];

    if (savedEntry) {
      const res = updateCreationChecklist(savedEntry.id, nextSteps);
      setSavedCreations(res.items);
    } else {
      setUnsavedStepsById((prev) => ({
        ...prev,
        [inventionId]: nextSteps,
      }));
    }
  };

  const handleNavigate = (view: ActiveNavView) => {
    setActiveNav(view);
    setActiveBlueprint(null);
  };

  const activeSavedEntry = activeBlueprint
    ? savedCreations.find(
        (s) =>
          s.id === activeBlueprint.invention.id ||
          s.invention.id === activeBlueprint.invention.id
      )
    : undefined;

  const activeCompletedSteps = activeBlueprint
    ? activeSavedEntry
      ? activeSavedEntry.completedStepIds
      : unsavedStepsById[activeBlueprint.invention.id] ?? []
    : [];

  return (
    <div className="relative min-h-screen overflow-x-hidden text-[#4A3528]">
      <WorkshopBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header
          activeView={activeNav}
          savedCount={savedCreations.length}
          onNavigate={handleNavigate}
          onOpenHowItWorks={() => setHowItWorksOpen(true)}
        />

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
          {activeBlueprint ? (
            <BlueprintView
              invention={activeBlueprint.invention}
              analysis={activeBlueprint.analysis}
              currency={currency}
              isSaved={Boolean(activeSavedEntry)}
              isFavorite={Boolean(activeSavedEntry?.isFavorite)}
              completedStepIds={activeCompletedSteps}
              isRefining={refiningId === activeBlueprint.invention.id}
              onBack={() => {
                setActiveNav(activeBlueprint.returnTo);
                setActiveBlueprint(null);
              }}
              onCurrencyChange={handleCurrencyChange}
              onToggleSave={() =>
                handleToggleSaveConcept(
                  activeBlueprint.invention,
                  activeBlueprint.analysis
                )
              }
              onToggleFavorite={() =>
                handleToggleFavoriteConcept(
                  activeBlueprint.invention,
                  activeBlueprint.analysis
                )
              }
              onToggleStep={(stepId) =>
                handleToggleStep(activeBlueprint.invention.id, stepId)
              }
              onRefine={(mode) =>
                handleRefineConcept(activeBlueprint.invention, mode)
              }
              onToast={showToast}
            />
          ) : activeNav === "workshop" ? (
            <WorkshopView
              creations={savedCreations}
              currency={currency}
              onCurrencyChange={handleCurrencyChange}
              onOpenCreation={(entry) =>
                setActiveBlueprint({
                  invention: entry.invention,
                  analysis: entry.analysis,
                  returnTo: "workshop",
                })
              }
              onToggleFavorite={(id) => {
                const res = toggleFavoriteCreationById(id);
                setSavedCreations(res.items);
              }}
              onDeleteCreation={(id) => {
                const res = removeSavedCreationById(id);
                setSavedCreations(res.items);
                showToast("Blueprint removed from My Workshop.", "info");
              }}
              onGoDiscover={() => setActiveNav("discover")}
            />
          ) : (
            <>
              {/* Editorial Hero (No duplicate logo here—header owns the logo) */}
              <section className="mb-8 max-w-3xl space-y-2.5">
                <p className="font-mono-tech text-xs font-medium uppercase tracking-wider text-[#7C8B6A]">
                  Imaginative Upcycling Studio
                </p>
                <h1 className="font-display text-3xl font-bold tracking-tight text-[#1C1B19] sm:text-5xl">
                  See what else it could be.
                </h1>
                <p className="text-base leading-relaxed text-[#4A3528]/80 sm:text-lg">
                  Bring an unused, broken, or overlooked object from around your home. Craftly examines its materials and structure to sketch three buildable inventions—from everyday fixes to unexpected studio builds.
                </p>
              </section>

              <InputWorkspace
                input={input}
                isLoading={isLoading}
                loadingPhrase={LOADING_PHRASES[loadingPhraseIdx]}
                onChange={setInput}
                onSubmit={handleSynthesize}
                onToast={showToast}
              />

              {synthesisResult && (
                <div ref={resultsRef}>
                  <InventionResults
                    analysis={synthesisResult.analysis}
                    concepts={synthesisResult.concepts}
                    currency={currency}
                    savedCreations={savedCreations}
                    isGeneratingMore={isGeneratingMore}
                    refiningId={refiningId}
                    loadingPhrase={LOADING_PHRASES[loadingPhraseIdx]}
                    onCurrencyChange={handleCurrencyChange}
                    onOpenBlueprint={(concept) =>
                      setActiveBlueprint({
                        invention: concept,
                        analysis: synthesisResult.analysis,
                        returnTo: "discover",
                      })
                    }
                    onToggleSave={(concept) =>
                      handleToggleSaveConcept(
                        concept,
                        synthesisResult.analysis
                      )
                    }
                    onToggleFavorite={(concept) =>
                      handleToggleFavoriteConcept(
                        concept,
                        synthesisResult.analysis
                      )
                    }
                    onRefine={handleRefineConcept}
                    onWhatElse={handleWhatElse}
                  />
                </div>
              )}
            </>
          )}
        </main>

        <footer className="border-t border-[#D8CFC0] bg-[#F2EADF]/70 py-5">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 text-xs text-[#4A3528]/70 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span>Craftly — Imaginative Invention Studio</span>
            <span>
              All blueprints save locally in your browser. Cost estimates are approximate.
            </span>
          </div>
        </footer>
      </div>

      <HowItWorksModal
        isOpen={howItWorksOpen}
        onClose={() => setHowItWorksOpen(false)}
      />

      <Toast toast={toast} />
    </div>
  );
}
