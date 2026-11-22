import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import type { InventionConcept, ObjectAnalysis } from "../types/invention";
import { requestStudioPhotoRender } from "../services/inventionService";
import { drawRealisticOutputScene } from "../utils/realisticCraftRenderer";

interface Crafted3DViewerProps {
  invention: InventionConcept;
  analysis: ObjectAnalysis;
  onStudioPhotoAvailable?: () => void;
}

export const Crafted3DViewer: React.FC<Crafted3DViewerProps> = ({
  invention,
  analysis,
  onStudioPhotoAvailable,
}) => {
  const { name: title, assemblyParts: parts, studioPrompt } = invention;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [activeCallout, setActiveCallout] = useState<number | null>(null);
  const [studioImageUrl, setStudioImageUrl] = useState<string | null>(null);
  const [isGeneratingPhoto, setIsGeneratingPhoto] = useState(false);

  const sortedCallouts = useMemo(
    () => [...parts].sort((a, b) => a.calloutIndex - b.calloutIndex),
    [parts]
  );

  // Automatically request realistic studio photograph on blueprint open
  useEffect(() => {
    let cancelled = false;
    setStudioImageUrl(null);
    setIsGeneratingPhoto(true);

    requestStudioPhotoRender(studioPrompt, {
      cacheKey: `output:${invention.id}`,
      aspectRatio: "4:3",
      referenceType: "output",
      objectName: analysis.objectName,
      inventionName: invention.name,
      materials: [
        ...invention.materialsReused.slice(0, 2),
        ...invention.additionalMaterials.slice(0, 2),
      ],
    }).then((url) => {
      if (cancelled) return;
      setIsGeneratingPhoto(false);
      if (url) {
        setStudioImageUrl(url);
        onStudioPhotoAvailable?.();
      }
    });

    return () => {
      cancelled = true;
    };
  }, [
    analysis.objectName,
    invention.additionalMaterials,
    invention.id,
    invention.materialsReused,
    invention.name,
    onStudioPhotoAvailable,
    studioPrompt,
  ]);

  const drawScene = useCallback(() => {
    if (studioImageUrl) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cssWidth = Math.max(200, Math.floor(container.clientWidth));
    const cssHeight = cssWidth < 420 ? 270 : 340;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    if (
      canvas.width !== Math.round(cssWidth * dpr) ||
      canvas.height !== Math.round(cssHeight * dpr)
    ) {
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;
      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawRealisticOutputScene(
      ctx,
      cssWidth,
      cssHeight,
      invention,
      analysis,
      activeCallout
    );
  }, [activeCallout, analysis, invention, studioImageUrl]);

  useEffect(() => {
    drawScene();
  }, [drawScene]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => drawScene());
    observer.observe(container);
    return () => observer.disconnect();
  }, [drawScene]);

  return (
    <section
      aria-label="Crafted Output Visual Reference"
      className="rounded-2xl border-[1.5px] border-[#D8CFC0] bg-[#F2EADF] p-4 sm:p-5"
    >
      <div className="mb-3">
        <p className="font-mono-tech text-xs font-medium uppercase tracking-wider text-[#7C8B6A]">
          Crafted Output Reference
        </p>
        <h3 className="font-display text-lg font-semibold text-[#4A3528]">
          {title}
        </h3>
      </div>

      {/* Viewport */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl border-[1.5px] border-[#D8CFC0] bg-[#FFFDF8]"
      >
        {studioImageUrl ? (
          <div className="relative">
            <img
              src={studioImageUrl}
              alt={`Realistic studio render of ${title} built from ${analysis.objectName}`}
              referrerPolicy="no-referrer"
              className="h-[270px] w-full object-cover sm:h-[340px]"
            />
            <div className="pointer-events-none absolute bottom-2.5 left-3 flex items-center gap-1.5 rounded-lg bg-[#FFFDF9]/90 px-2.5 py-1 text-[11px] font-semibold text-[#4A3528]">
              <Sparkles className="h-3 w-3 text-[#D98A6C]" />
              <span>Studio Photo Preview · Built from {analysis.objectName}</span>
            </div>
          </div>
        ) : (
          <>
            <canvas
              ref={canvasRef}
              className="block h-[270px] w-full sm:h-[340px]"
              aria-label={`Realistic workshop render of ${title}.`}
            />
            <div className="pointer-events-none absolute bottom-2.5 right-3 rounded-lg bg-[#FFFDF9]/92 px-2.5 py-1 text-[11px] font-medium text-[#4A3528]/80">
              {isGeneratingPhoto
                ? "Rendering studio photo..."
                : `Realistic Workbench Preview · ${analysis.objectName}`}
            </div>
          </>
        )}
      </div>

      {/* Unclipped Responsive HTML Callout Badges */}
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {sortedCallouts.map((part) => {
          const active = activeCallout === part.calloutIndex;
          return (
            <button
              key={part.id}
              type="button"
              onClick={() =>
                setActiveCallout((prev) =>
                  prev === part.calloutIndex ? null : part.calloutIndex
                )
              }
              onMouseEnter={() => setActiveCallout(part.calloutIndex)}
              onMouseLeave={() => setActiveCallout(null)}
              className={`flex items-start gap-2.5 rounded-xl border p-2.5 text-left transition-colors ${
                active
                  ? "border-[#D98A6C] bg-[#FFFDF9]"
                  : "border-[#D8CFC0] bg-[#F9F6F0] hover:border-[#4A3528]/40"
              }`}
            >
              <span
                className={`font-mono-tech flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  active
                    ? "bg-[#D98A6C] text-[#1C1B19]"
                    : "bg-[#4A3528] text-[#F9F6F0]"
                }`}
              >
                {part.calloutIndex}
              </span>
              <div className="min-w-0 flex-1">
                <p className="break-words text-xs font-bold leading-snug text-[#4A3528]">
                  {part.label}
                </p>
                <p className="mt-0.5 break-words text-xs leading-snug text-[#4A3528]/75">
                  {part.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
