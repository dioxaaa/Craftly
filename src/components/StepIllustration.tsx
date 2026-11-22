import React, { useCallback, useEffect, useRef } from "react";
import type {
  ConstructionStep,
  InventionConcept,
  ObjectAnalysis,
} from "../types/invention";
import { drawRealisticStepScene } from "../utils/realisticCraftRenderer";

interface StepIllustrationProps {
  step: ConstructionStep;
  stepIndex: number;
  totalSteps: number;
  invention: InventionConcept;
  analysis: ObjectAnalysis;
  photoUrl?: string;
  isRenderingPhoto?: boolean;
}

export const StepIllustration: React.FC<StepIllustrationProps> = ({
  step,
  stepIndex,
  totalSteps,
  invention,
  analysis,
  photoUrl,
  isRenderingPhoto = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const renderCanvas = useCallback(() => {
    if (photoUrl) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cssWidth = Math.max(180, Math.floor(container.clientWidth));
    const cssHeight = Math.round(cssWidth * 0.72);
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
    drawRealisticStepScene(
      ctx,
      cssWidth,
      cssHeight,
      step,
      stepIndex,
      totalSteps,
      invention,
      analysis
    );
  }, [analysis, invention, photoUrl, step, stepIndex, totalSteps]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => renderCanvas());
    observer.observe(container);
    return () => observer.disconnect();
  }, [renderCanvas]);

  return (
    <figure className="w-full shrink-0 rounded-xl border border-[#D8CFC0] bg-[#FFFDF9] p-2 sm:w-52 md:w-56">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg border border-[#D8CFC0]/80 bg-[#F9F6F0]"
      >
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={step.diagramCaption}
            referrerPolicy="no-referrer"
            className="aspect-[4/3] w-full object-cover"
          />
        ) : (
          <canvas
            ref={canvasRef}
            className="block aspect-[4/3] w-full"
            role="img"
            aria-label={step.diagramCaption}
          />
        )}
        {isRenderingPhoto && !photoUrl && (
          <span className="pointer-events-none absolute bottom-1.5 right-1.5 rounded bg-[#FFFDF9]/90 px-1.5 py-0.5 text-[10px] font-semibold text-[#4A3528]/80">
            Rendering photo...
          </span>
        )}
      </div>
      <figcaption className="mt-1.5 break-words text-center text-[11px] font-medium leading-snug text-[#4A3528]/80">
        {step.diagramCaption}
      </figcaption>
    </figure>
  );
};
