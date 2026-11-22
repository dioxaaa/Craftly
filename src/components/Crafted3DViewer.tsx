import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Camera, Box as CubeIcon, RotateCcw } from "lucide-react";
import type { AssemblyPart3D, PartMaterialFinish } from "../types/invention";
import { requestStudioPhotoRender } from "../services/inventionService";

interface Crafted3DViewerProps {
  title: string;
  parts: AssemblyPart3D[];
  studioPrompt: string;
  onToast?: (msg: string, tone?: "success" | "info") => void;
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface ProjectedPart {
  part: AssemblyPart3D;
  screenX: number;
  screenY: number;
  depth: number;
  rx: number;
  ry: number;
  rz: number;
  scalePx: number;
}

const DEFAULT_YAW = 0.58;
const DEFAULT_PITCH = 0.42;

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return { r: 217, g: 138, b: 108 };
  const num = parseInt(clean, 16);
  if (Number.isNaN(num)) return { r: 217, g: 138, b: 108 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function shadeHex(hex: string, factor: number, alpha = 1): string {
  const { r, g, b } = hexToRgb(hex);
  const nr = clamp(Math.round(r * factor), 0, 255);
  const ng = clamp(Math.round(g * factor), 0, 255);
  const nb = clamp(Math.round(b * factor), 0, 255);
  return `rgba(${nr}, ${ng}, ${nb}, ${alpha})`;
}

function defaultColorForMaterial(material: PartMaterialFinish): string {
  switch (material) {
    case "pet_plastic":
      return "#CBE6E1";
    case "cardboard":
      return "#CFAF84";
    case "brushed_metal":
      return "#A3AAB0";
    case "wood_grain":
      return "#B6885E";
    case "terracotta":
      return "#D98A6C";
    case "woven_fabric":
      return "#7C8B6A";
    case "ceramic":
      return "#EDE5D8";
    case "rubber":
      return "#383532";
  }
}

function rotatePoint(p: Vec3, yaw: number, pitch: number): Vec3 {
  const cosY = Math.cos(yaw);
  const sinY = Math.sin(yaw);
  const x1 = p.x * cosY - p.z * sinY;
  const z1 = p.x * sinY + p.z * cosY;

  const cosP = Math.cos(pitch);
  const sinP = Math.sin(pitch);
  const y2 = p.y * cosP - z1 * sinP;
  const z2 = p.y * sinP + z1 * cosP;

  return { x: x1, y: y2, z: z2 };
}

export const Crafted3DViewer: React.FC<Crafted3DViewerProps> = ({
  title,
  parts,
  studioPrompt,
  onToast,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dragStateRef = useRef<{
    active: boolean;
    pointerId: number | null;
    lastX: number;
    lastY: number;
  }>({ active: false, pointerId: null, lastX: 0, lastY: 0 });

  const [yaw, setYaw] = useState(DEFAULT_YAW);
  const [pitch, setPitch] = useState(DEFAULT_PITCH);
  const [activeCallout, setActiveCallout] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"3d" | "studio">("3d");
  const [studioImageUrl, setStudioImageUrl] = useState<string | null>(null);
  const [isGeneratingPhoto, setIsGeneratingPhoto] = useState(false);

  const sortedCallouts = useMemo(
    () =>
      [...parts].sort((a, b) => a.calloutIndex - b.calloutIndex),
    [parts]
  );

  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cssWidth = Math.max(200, Math.floor(container.clientWidth));
    const cssHeight = cssWidth < 420 ? 260 : 320;
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

    const isStudioLit = viewMode === "studio" && !studioImageUrl;

    // Warm studio backdrop
    const bgGrad = ctx.createRadialGradient(
      cssWidth * 0.5,
      cssHeight * 0.42,
      20,
      cssWidth * 0.5,
      cssHeight * 0.5,
      cssWidth * 0.72
    );
    if (isStudioLit) {
      bgGrad.addColorStop(0, "#FFF9EE");
      bgGrad.addColorStop(0.6, "#EFE5D4");
      bgGrad.addColorStop(1, "#DCCFBC");
    } else {
      bgGrad.addColorStop(0, "#FFFDF8");
      bgGrad.addColorStop(1, "#F2EADF");
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    const cx = cssWidth * 0.5;
    const cy = cssHeight * 0.56;
    const unitScale = Math.min(cssWidth, cssHeight) * 0.255;

    const project = (p: Vec3) => {
      const r = rotatePoint(p, yaw, pitch);
      const perspective = 4.2 / (4.2 - r.z * 0.55);
      return {
        sx: cx + r.x * unitScale * perspective,
        sy: cy - r.y * unitScale * perspective,
        depth: r.z,
        perspective,
      };
    };

    // Turntable base disc
    const baseCenter = project({ x: 0, y: -0.92, z: 0 });
    const turntableRadiusX = unitScale * 1.48;
    const turntableRadiusY = unitScale * 0.42 * Math.max(0.38, Math.sin(pitch) + 0.35);

    // Ground cast shadow
    ctx.save();
    ctx.fillStyle = isStudioLit ? "rgba(28, 27, 25, 0.16)" : "rgba(74, 53, 40, 0.11)";
    ctx.beginPath();
    ctx.ellipse(
      baseCenter.sx + 6,
      baseCenter.sy + 14,
      turntableRadiusX * 1.05,
      turntableRadiusY * 1.08,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.restore();

    // Turntable plinth side thickness
    ctx.save();
    ctx.fillStyle = "#C7B59B";
    ctx.strokeStyle = "#4A3528";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(
      baseCenter.sx,
      baseCenter.sy + 10,
      turntableRadiusX,
      turntableRadiusY,
      0,
      0,
      Math.PI
    );
    ctx.lineTo(baseCenter.sx - turntableRadiusX, baseCenter.sy);
    ctx.ellipse(
      baseCenter.sx,
      baseCenter.sy,
      turntableRadiusX,
      turntableRadiusY,
      0,
      Math.PI,
      0,
      true
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Turntable top face
    const topGrad = ctx.createLinearGradient(
      baseCenter.sx - turntableRadiusX,
      baseCenter.sy,
      baseCenter.sx + turntableRadiusX,
      baseCenter.sy
    );
    topGrad.addColorStop(0, "#E7DAC6");
    topGrad.addColorStop(0.5, "#F6EFE3");
    topGrad.addColorStop(1, "#DCCBB2");
    ctx.fillStyle = topGrad;
    ctx.beginPath();
    ctx.ellipse(
      baseCenter.sx,
      baseCenter.sy,
      turntableRadiusX,
      turntableRadiusY,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.stroke();

    // Turntable degree ring ticks
    ctx.strokeStyle = "rgba(74, 53, 40, 0.25)";
    ctx.lineWidth = 1;
    for (let deg = 0; deg < 360; deg += 30) {
      const rad = (deg * Math.PI) / 180 + yaw;
      const x1 = baseCenter.sx + Math.cos(rad) * turntableRadiusX * 0.88;
      const y1 = baseCenter.sy + Math.sin(rad) * turntableRadiusY * 0.88;
      const x2 = baseCenter.sx + Math.cos(rad) * turntableRadiusX * 0.96;
      const y2 = baseCenter.sy + Math.sin(rad) * turntableRadiusY * 0.96;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    ctx.restore();

    // Project and depth-sort 3D parts
    const projectedParts: ProjectedPart[] = parts.map((part) => {
      const pos: Vec3 = {
        x: part.position[0] ?? 0,
        y: (part.position[1] ?? 0) - 0.1,
        z: part.position[2] ?? 0,
      };
      const proj = project(pos);
      return {
        part,
        screenX: proj.sx,
        screenY: proj.sy,
        depth: proj.depth,
        rx: (part.scale[0] ?? 0.5) * unitScale * 0.44 * proj.perspective,
        ry: (part.scale[1] ?? 0.5) * unitScale * 0.44 * proj.perspective,
        rz: (part.scale[2] ?? 0.5) * unitScale * 0.44 * proj.perspective,
        scalePx: unitScale * proj.perspective,
      };
    });

    projectedParts.sort((a, b) => a.depth - b.depth);

    // Draw each 3D primitive with material texture & lighting
    for (const item of projectedParts) {
      const { part, screenX, screenY, rx, ry, rz } = item;
      const baseColor = part.colorHex || defaultColorForMaterial(part.material);
      const isTranslucent = part.material === "pet_plastic";
      const alpha = isTranslucent ? 0.72 : 1;
      const highlighted = activeCallout === part.calloutIndex;

      ctx.save();

      const strokeCol = highlighted ? "#D98A6C" : "#4A3528";
      const strokeW = highlighted ? 2.4 : 1.35;

      if (part.shape === "cylinder") {
        const w = Math.max(12, rx);
        const h = Math.max(18, ry * 2);
        const capH = Math.max(5, Math.min(18, w * 0.34));
        const topY = screenY - h * 0.5;
        const botY = screenY + h * 0.5;

        const bodyGrad = ctx.createLinearGradient(screenX - w, 0, screenX + w, 0);
        bodyGrad.addColorStop(0, shadeHex(baseColor, 0.78, alpha));
        bodyGrad.addColorStop(0.35, shadeHex(baseColor, 1.08, alpha));
        bodyGrad.addColorStop(0.75, shadeHex(baseColor, 0.92, alpha));
        bodyGrad.addColorStop(1, shadeHex(baseColor, 0.7, alpha));

        ctx.fillStyle = bodyGrad;
        ctx.strokeStyle = strokeCol;
        ctx.lineWidth = strokeW;

        ctx.beginPath();
        ctx.moveTo(screenX - w, topY);
        ctx.lineTo(screenX - w, botY);
        ctx.ellipse(screenX, botY, w, capH, 0, Math.PI, 0, true);
        ctx.lineTo(screenX + w, topY);
        ctx.ellipse(screenX, topY, w, capH, 0, 0, Math.PI, true);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Top ellipse face
        ctx.fillStyle = shadeHex(baseColor, 1.12, isTranslucent ? 0.62 : 1);
        ctx.beginPath();
        ctx.ellipse(screenX, topY, w, capH, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Specular stripe for PET plastic or brushed metal
        if (isTranslucent || part.material === "brushed_metal" || part.material === "ceramic") {
          ctx.fillStyle = "rgba(255, 255, 255, 0.38)";
          ctx.fillRect(screenX - w * 0.55, topY + capH * 0.4, w * 0.22, h - capH * 0.4);
        }
      } else if (part.shape === "cone") {
        const w = Math.max(12, rx);
        const h = Math.max(18, ry * 2);
        const capH = Math.max(5, Math.min(16, w * 0.32));
        const topY = screenY - h * 0.5;
        const botY = screenY + h * 0.5;

        const coneGrad = ctx.createLinearGradient(screenX - w, 0, screenX + w, 0);
        coneGrad.addColorStop(0, shadeHex(baseColor, 0.82, alpha));
        coneGrad.addColorStop(0.4, shadeHex(baseColor, 1.1, alpha));
        coneGrad.addColorStop(1, shadeHex(baseColor, 0.72, alpha));

        ctx.fillStyle = coneGrad;
        ctx.strokeStyle = strokeCol;
        ctx.lineWidth = strokeW;

        ctx.beginPath();
        ctx.moveTo(screenX - w * 0.3, topY);
        ctx.lineTo(screenX - w, botY);
        ctx.ellipse(screenX, botY, w, capH, 0, Math.PI, 0, true);
        ctx.lineTo(screenX + w * 0.3, topY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (part.shape === "dome") {
        const w = Math.max(16, rx * 1.1);
        const h = Math.max(16, ry * 1.25);
        const capH = Math.max(6, w * 0.3);

        const domeGrad = ctx.createRadialGradient(
          screenX - w * 0.3,
          screenY - h * 0.3,
          4,
          screenX,
          screenY,
          w * 1.2
        );
        domeGrad.addColorStop(0, shadeHex(baseColor, 1.16, alpha));
        domeGrad.addColorStop(0.6, shadeHex(baseColor, 0.96, alpha));
        domeGrad.addColorStop(1, shadeHex(baseColor, 0.74, alpha));

        ctx.fillStyle = domeGrad;
        ctx.strokeStyle = strokeCol;
        ctx.lineWidth = strokeW;

        ctx.beginPath();
        ctx.ellipse(screenX, screenY + h * 0.2, w, h * 0.85, 0, Math.PI, 0, false);
        ctx.ellipse(screenX, screenY + h * 0.2, w, capH, 0, 0, Math.PI, false);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (part.shape === "ring") {
        const w = Math.max(14, rx);
        const h = Math.max(12, ry);
        ctx.strokeStyle = shadeHex(baseColor, 0.95, 1);
        ctx.lineWidth = Math.max(6, Math.min(12, w * 0.22));
        ctx.beginPath();
        ctx.ellipse(screenX, screenY, w * 0.8, h * 0.75, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = strokeCol;
        ctx.lineWidth = strokeW;
        ctx.beginPath();
        ctx.ellipse(screenX, screenY, w * 0.8 + 4, h * 0.75 + 4, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (part.shape === "rod") {
        const w = Math.max(10, rx * 1.15);
        const h = Math.max(10, ry * 1.15);
        const isHorizontal = rx > ry;
        ctx.fillStyle = shadeHex(baseColor, 0.98, 1);
        ctx.strokeStyle = strokeCol;
        ctx.lineWidth = strokeW;

        if (isHorizontal) {
          const barH = Math.max(8, Math.min(16, ry * 0.9));
          ctx.beginPath();
          ctx.roundRect(screenX - w, screenY - barH * 0.5, w * 2, barH, barH * 0.45);
          ctx.fill();
          ctx.stroke();
        } else {
          const barW = Math.max(8, Math.min(16, rx * 0.9));
          ctx.beginPath();
          ctx.roundRect(screenX - barW * 0.5, screenY - h, barW, h * 2, barW * 0.45);
          ctx.fill();
          ctx.stroke();
        }
      } else {
        // Isometric box / panel
        const bx = Math.max(14, rx);
        const by = Math.max(12, ry * 1.4);
        const bz = Math.max(10, rz * 0.55);

        // Top face
        ctx.fillStyle = shadeHex(baseColor, 1.12, alpha);
        ctx.strokeStyle = strokeCol;
        ctx.lineWidth = strokeW;
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - by * 0.65 - bz * 0.45);
        ctx.lineTo(screenX + bx, screenY - by * 0.65 + bz * 0.2);
        ctx.lineTo(screenX, screenY - by * 0.65 + bz * 0.85);
        ctx.lineTo(screenX - bx, screenY - by * 0.65 + bz * 0.2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Left face
        ctx.fillStyle = shadeHex(baseColor, 0.94, alpha);
        ctx.beginPath();
        ctx.moveTo(screenX - bx, screenY - by * 0.65 + bz * 0.2);
        ctx.lineTo(screenX, screenY - by * 0.65 + bz * 0.85);
        ctx.lineTo(screenX, screenY + by * 0.65 + bz * 0.85);
        ctx.lineTo(screenX - bx, screenY + by * 0.65 + bz * 0.2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Right face
        ctx.fillStyle = shadeHex(baseColor, 0.78, alpha);
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - by * 0.65 + bz * 0.85);
        ctx.lineTo(screenX + bx, screenY - by * 0.65 + bz * 0.2);
        ctx.lineTo(screenX + bx, screenY + by * 0.65 + bz * 0.2);
        ctx.lineTo(screenX, screenY + by * 0.65 + bz * 0.85);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Material texture overlay (wood grain or corrugated cardboard flutes)
        if (part.material === "wood_grain") {
          ctx.strokeStyle = "rgba(74, 53, 40, 0.24)";
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(screenX - bx * 0.7, screenY - by * 0.2);
          ctx.lineTo(screenX - bx * 0.2, screenY);
          ctx.moveTo(screenX - bx * 0.7, screenY + by * 0.25);
          ctx.lineTo(screenX - bx * 0.15, screenY + by * 0.45);
          ctx.stroke();
        } else if (part.material === "cardboard") {
          ctx.strokeStyle = "rgba(74, 53, 40, 0.26)";
          ctx.lineWidth = 0.9;
          for (let i = -3; i <= 3; i += 2) {
            ctx.beginPath();
            ctx.moveTo(screenX + i * 5, screenY + by * 0.48);
            ctx.lineTo(screenX + i * 5 + 3, screenY + by * 0.56);
            ctx.stroke();
          }
        }
      }

      ctx.restore();
    }

    // Draw concise numbered callout pins strictly clamped within safe viewport bounds
    const padX = 28;
    const padY = 28;
    const placedPins: Array<{ x: number; y: number }> = [];

    for (const item of projectedParts) {
      const targetX = clamp(item.screenX, padX, cssWidth - padX);
      const targetY = clamp(item.screenY, padY, cssHeight - padY);

      const angleOffset = (item.part.calloutIndex % 2 === 0 ? 1 : -1) * 26;
      let pinX = clamp(targetX + angleOffset, padX, cssWidth - padX);
      let pinY = clamp(targetY - 24, padY, cssHeight - padY);

      // Simple collision separation so pins never overlap
      for (const existing of placedPins) {
        const dx = pinX - existing.x;
        const dy = pinY - existing.y;
        if (Math.hypot(dx, dy) < 26) {
          pinY = clamp(pinY - 26, padY, cssHeight - padY);
          pinX = clamp(pinX + 18, padX, cssWidth - padX);
        }
      }
      placedPins.push({ x: pinX, y: pinY });

      const isActive = activeCallout === item.part.calloutIndex;

      ctx.save();
      ctx.strokeStyle = isActive ? "#D98A6C" : "#4A3528";
      ctx.lineWidth = isActive ? 2 : 1.25;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(targetX, targetY);
      ctx.lineTo(pinX, pinY);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.fillStyle = isActive ? "#D98A6C" : "#4A3528";
      ctx.strokeStyle = "#FFFDF9";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pinX, pinY, 11.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isActive ? "#1C1B19" : "#FFFDF9";
      ctx.font = '700 11px "JetBrains Mono", monospace';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(item.part.calloutIndex), pinX, pinY + 0.5);
      ctx.restore();
    }
  }, [activeCallout, parts, pitch, studioImageUrl, viewMode, yaw]);

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

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStateRef.current = {
      active: true,
      pointerId: e.pointerId,
      lastX: e.clientX,
      lastY: e.clientY,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const state = dragStateRef.current;
    if (!state.active || state.pointerId !== e.pointerId) return;
    const dx = e.clientX - state.lastX;
    const dy = e.clientY - state.lastY;
    state.lastX = e.clientX;
    state.lastY = e.clientY;
    setYaw((prev) => prev + dx * 0.011);
    setPitch((prev) => clamp(prev + dy * 0.008, 0.14, 1.05));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragStateRef.current.pointerId !== e.pointerId) return;
    dragStateRef.current.active = false;
    dragStateRef.current.pointerId = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  const handleToggleStudioView = async () => {
    if (viewMode === "studio") {
      setViewMode("3d");
      return;
    }
    setViewMode("studio");
    if (!studioImageUrl && !isGeneratingPhoto) {
      setIsGeneratingPhoto(true);
      const url = await requestStudioPhotoRender(studioPrompt);
      setIsGeneratingPhoto(false);
      if (url) {
        setStudioImageUrl(url);
      } else {
        onToast?.(
          "Showing enhanced local studio-lit craft render (cloud image model unavailable).",
          "info"
        );
      }
    }
  };

  return (
    <section
      aria-label="3D Crafted Output Visual Reference"
      className="rounded-2xl border-[1.5px] border-[#D8CFC0] bg-[#F2EADF] p-4 sm:p-5"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-mono-tech text-xs font-medium uppercase tracking-wider text-[#7C8B6A]">
            Crafted Output Reference
          </p>
          <h3 className="font-display text-lg font-semibold text-[#4A3528]">
            {title}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleToggleStudioView}
            className={`flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${
              viewMode === "studio"
                ? "border-[#4A3528] bg-[#4A3528] text-[#F9F6F0]"
                : "border-[#D8CFC0] bg-[#FFFDF9] text-[#4A3528] hover:bg-[#EAE0D0]"
            }`}
          >
            {viewMode === "studio" ? (
              <>
                <CubeIcon className="h-3.5 w-3.5" />
                <span>Interactive 3D Model</span>
              </>
            ) : (
              <>
                <Camera className="h-3.5 w-3.5" />
                <span>
                  {isGeneratingPhoto ? "Rendering Studio..." : "Studio Photo View"}
                </span>
              </>
            )}
          </button>

          {(!studioImageUrl || viewMode === "3d") && (
            <button
              type="button"
              onClick={() => {
                setYaw(DEFAULT_YAW);
                setPitch(DEFAULT_PITCH);
                setActiveCallout(null);
              }}
              className="flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#D8CFC0] bg-[#FFFDF9] px-3 py-1.5 text-xs font-semibold text-[#4A3528] hover:bg-[#EAE0D0]"
              aria-label="Reset 3D view"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset View</span>
            </button>
          )}
        </div>
      </div>

      {/* Viewport */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl border-[1.5px] border-[#D8CFC0] bg-[#FFFDF8]"
      >
        {viewMode === "studio" && studioImageUrl ? (
          <img
            src={studioImageUrl}
            alt={`Studio product render of ${title}`}
            referrerPolicy="no-referrer"
            className="h-[260px] w-full object-cover sm:h-80"
          />
        ) : (
          <>
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="block h-[260px] w-full cursor-grab touch-none active:cursor-grabbing sm:h-80"
              aria-label={`Interactive 3D model of ${title}. Drag to rotate.`}
            />
            <div className="pointer-events-none absolute bottom-2.5 right-3 rounded-lg bg-[#FFFDF9]/90 px-2.5 py-1 text-[11px] font-medium text-[#4A3528]/75">
              Drag or swipe to rotate 3D model
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
                <p className="text-xs font-bold leading-snug text-[#4A3528] break-words">
                  {part.label}
                </p>
                <p className="mt-0.5 text-xs leading-snug text-[#4A3528]/75 break-words">
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
