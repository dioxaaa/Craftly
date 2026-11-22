import React, { useCallback, useEffect, useRef, useState } from "react";
import { Download, Eraser, Pen, RotateCcw, Trash2 } from "lucide-react";

const PALETTE_COLORS = [
  { label: "Espresso Ink", hex: "#4A3528" },
  { label: "Terracotta", hex: "#D98A6C" },
  { label: "Workshop Sage", hex: "#7C8B6A" },
  { label: "Golden Ochre", hex: "#E0A952" },
  { label: "Deep Charcoal", hex: "#1C1B19" },
];

interface SketchCanvasProps {
  initialDataUrl?: string;
  onChange: (dataUrl: string | undefined) => void;
  onToast?: (message: string) => void;
}

export const SketchCanvas: React.FC<SketchCanvasProps> = ({
  initialDataUrl,
  onChange,
  onToast,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const activePointerIdRef = useRef<number | null>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const historyRef = useRef<string[]>([]);
  const restoredInitialRef = useRef(false);

  const [brushColor, setBrushColor] = useState("#4A3528");
  const [brushSize, setBrushSize] = useState(4);
  const [isEraser, setIsEraser] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [hasStrokes, setHasStrokes] = useState(Boolean(initialDataUrl));

  const paintPaperBackdrop = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = "#FFFDF9";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.restore();

      // Subtle drafting dot grid
      ctx.save();
      ctx.fillStyle = "#D8CFC0";
      for (let x = 20; x < width; x += 24) {
        for (let y = 20; y < height; y += 24) {
          ctx.beginPath();
          ctx.arc(x, y, 0.9, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    },
    []
  );

  const restoreFromDataUrl = useCallback(
    (dataUrl: string) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = Math.max(240, Math.round(rect.width));
      const cssH = Math.max(220, Math.round(rect.height));

      const img = new Image();
      img.onload = () => {
        ctx.save();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        paintPaperBackdrop(ctx, cssW, cssH);
        ctx.drawImage(img, 0, 0, cssW, cssH);
        ctx.restore();
      };
      img.src = dataUrl;
    },
    [paintPaperBackdrop]
  );

  const syncCanvasDimensions = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cssWidth = Math.max(200, Math.floor(container.clientWidth));
    const cssHeight = cssWidth < 420 ? 230 : 280;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const existingSnapshot =
      canvas.width > 0 && canvas.height > 0 && historyRef.current.length > 0
        ? canvas.toDataURL("image/png")
        : initialDataUrl && !restoredInitialRef.current
          ? initialDataUrl
          : null;

    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintPaperBackdrop(ctx, cssWidth, cssHeight);

    if (existingSnapshot) {
      restoredInitialRef.current = true;
      restoreFromDataUrl(existingSnapshot);
    }
  }, [initialDataUrl, paintPaperBackdrop, restoreFromDataUrl]);

  useEffect(() => {
    syncCanvasDimensions();
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      syncCanvasDimensions();
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [syncCanvasDimensions]);

  const getPointerPosition = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const pushSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const snapshot = canvas.toDataURL("image/png");
    historyRef.current = [...historyRef.current.slice(-24), snapshot];
    setCanUndo(historyRef.current.length > 0);
    setHasStrokes(true);
    onChange(snapshot);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    activePointerIdRef.current = e.pointerId;
    isDrawingRef.current = true;

    const pt = getPointerPosition(e);
    lastPointRef.current = pt;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = isEraser ? "#FFFDF9" : brushColor;
    ctx.lineWidth = isEraser ? brushSize * 2.2 : brushSize;
    ctx.beginPath();
    ctx.moveTo(pt.x, pt.y);
    ctx.lineTo(pt.x + 0.01, pt.y + 0.01);
    ctx.stroke();
    ctx.restore();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || activePointerIdRef.current !== e.pointerId) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx || !lastPointRef.current) return;

    e.preventDefault();
    const pt = getPointerPosition(e);

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = isEraser ? "#FFFDF9" : brushColor;
    ctx.lineWidth = isEraser ? brushSize * 2.2 : brushSize;
    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
    ctx.restore();

    lastPointRef.current = pt;
  };

  const finishStroke = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || activePointerIdRef.current !== e.pointerId) return;
    isDrawingRef.current = false;
    activePointerIdRef.current = null;
    lastPointRef.current = null;
    try {
      canvasRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture already released
    }
    pushSnapshot();
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const stack = [...historyRef.current];
    stack.pop();
    historyRef.current = stack;
    setCanUndo(stack.length > 0);

    const rect = canvas.getBoundingClientRect();
    const cssW = Math.max(240, Math.round(rect.width));
    const cssH = Math.max(220, Math.round(rect.height));

    if (stack.length === 0) {
      paintPaperBackdrop(ctx, cssW, cssH);
      setHasStrokes(false);
      onChange(undefined);
    } else {
      const prev = stack[stack.length - 1];
      restoreFromDataUrl(prev);
      setHasStrokes(true);
      onChange(prev);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    paintPaperBackdrop(ctx, Math.round(rect.width), Math.round(rect.height));
    historyRef.current = [];
    setCanUndo(false);
    setHasStrokes(false);
    onChange(undefined);
  };

  const handleExportPng = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasStrokes) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = "craftly-object-sketch.png";
    link.click();
    onToast?.("Sketch exported as PNG.");
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border-[1.5px] border-[#D8CFC0] bg-[#F2EADF] p-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsEraser(false)}
            className={`flex min-h-[40px] items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
              !isEraser
                ? "bg-[#4A3528] text-[#F9F6F0]"
                : "bg-[#F9F6F0] text-[#4A3528] hover:bg-[#EAE0D0]"
            }`}
          >
            <Pen className="h-3.5 w-3.5" />
            Pen
          </button>

          <button
            type="button"
            onClick={() => setIsEraser(true)}
            className={`flex min-h-[40px] items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
              isEraser
                ? "bg-[#4A3528] text-[#F9F6F0]"
                : "bg-[#F9F6F0] text-[#4A3528] hover:bg-[#EAE0D0]"
            }`}
          >
            <Eraser className="h-3.5 w-3.5" />
            Eraser
          </button>

          <div className="mx-1 flex items-center gap-1.5" role="group" aria-label="Ink colors">
            {PALETTE_COLORS.map((swatch) => (
              <button
                key={swatch.hex}
                type="button"
                onClick={() => {
                  setBrushColor(swatch.hex);
                  setIsEraser(false);
                }}
                title={swatch.label}
                aria-label={swatch.label}
                className={`h-7 w-7 rounded-full border-2 transition-transform ${
                  !isEraser && brushColor === swatch.hex
                    ? "scale-110 border-[#4A3528] ring-2 ring-[#D98A6C]/50"
                    : "border-[#D8CFC0]"
                }`}
                style={{ backgroundColor: swatch.hex }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-[#4A3528]">
            <span>Size</span>
            <input
              type="range"
              min={2}
              max={16}
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-20 accent-[#D98A6C]"
              aria-label="Brush size"
            />
            <span className="font-mono-tech w-5 text-right text-xs">
              {brushSize}
            </span>
          </label>

          <button
            type="button"
            onClick={handleUndo}
            disabled={!canUndo}
            className="flex min-h-[40px] items-center gap-1 rounded-xl border border-[#D8CFC0] bg-[#F9F6F0] px-2.5 py-1.5 text-xs font-semibold text-[#4A3528] transition-colors hover:bg-[#EAE0D0] disabled:opacity-40"
            aria-label="Undo last stroke"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Undo
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={!hasStrokes}
            className="flex min-h-[40px] items-center gap-1 rounded-xl border border-[#D8CFC0] bg-[#F9F6F0] px-2.5 py-1.5 text-xs font-semibold text-[#4A3528] transition-colors hover:bg-[#EAE0D0] disabled:opacity-40"
            aria-label="Clear sketch"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </button>

          <button
            type="button"
            onClick={handleExportPng}
            disabled={!hasStrokes}
            className="flex min-h-[40px] items-center gap-1 rounded-xl border border-[#D8CFC0] bg-[#F9F6F0] px-2.5 py-1.5 text-xs font-semibold text-[#4A3528] transition-colors hover:bg-[#EAE0D0] disabled:opacity-40"
            aria-label="Download sketch PNG"
          >
            <Download className="h-3.5 w-3.5" />
            PNG
          </button>
        </div>
      </div>

      {/* Drawing Canvas */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl border-[1.5px] border-[#D8CFC0] bg-[#FFFDF9]"
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishStroke}
          onPointerCancel={finishStroke}
          className="block w-full cursor-crosshair touch-none"
          aria-label="Object sketch drawing pad"
        />
        {!hasStrokes && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4 text-center">
            <p className="rounded-xl bg-[#F9F6F0]/90 px-3 py-1.5 text-xs font-medium text-[#4A3528]/65">
              Draw the rough silhouette or broken parts of your object here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
