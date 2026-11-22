import type {
  AssemblyPart3D,
  ConstructionStep,
  InventionConcept,
  ObjectAnalysis,
  PartMaterialFinish,
  StepActionType,
} from "../types/invention";

export type CraftObjectKind =
  | "pet_bottle"
  | "umbrella"
  | "cardboard"
  | "electric_fan"
  | "ceramic_mug"
  | "garment_denim"
  | "tin_jar"
  | "wood_crate"
  | "slipper_rubber"
  | "generic";

export type CraftOutputKind =
  | "planter_hydro"
  | "lamp_lantern"
  | "easel_stand"
  | "bag_sling"
  | "desk_organizer";

export interface CraftVisualSpec {
  objectKind: CraftObjectKind;
  outputKind: CraftOutputKind;
  primaryColor: string;
  accentColor: string;
}

export function inferCraftVisualSpec(
  invention: InventionConcept,
  analysis: ObjectAnalysis
): CraftVisualSpec {
  const sourceBlob = [
    analysis.objectName,
    analysis.category,
    ...analysis.materials,
    ...invention.materialsReused,
  ]
    .join(" ")
    .toLowerCase();

  let objectKind: CraftObjectKind = "generic";
  if (/slipper|flip-flop|flip flop|sandal|tsinelas|eva|foam sole|footwear/.test(sourceBlob)) {
    objectKind = "slipper_rubber";
  } else if (/bottle|pet |soda|water bottle|jug/.test(sourceBlob)) {
    objectKind = "pet_bottle";
  } else if (/umbrella|parasol|canopy|pongee|rib/.test(sourceBlob)) {
    objectKind = "umbrella";
  } else if (/cardboard|carton|corrugated|shoebox|parcel|box/.test(sourceBlob)) {
    objectKind = "cardboard";
  } else if (/fan|grille|impeller|blade|appliance/.test(sourceBlob)) {
    objectKind = "electric_fan";
  } else if (/mug|cup|ceramic|stoneware|porcelain|teacup/.test(sourceBlob)) {
    objectKind = "ceramic_mug";
  } else if (/denim|jeans|shirt|garment|fabric|cloth|twill|sweater|jacket/.test(sourceBlob)) {
    objectKind = "garment_denim";
  } else if (/tin|can|jar|mason|glass|steel food/.test(sourceBlob)) {
    objectKind = "tin_jar";
  } else if (/wood|crate|pallet|plank|timber|dowel|bamboo/.test(sourceBlob)) {
    objectKind = "wood_crate";
  }

  const outputBlob = [
    invention.name,
    invention.category,
    invention.purpose,
    invention.oneLineDescription,
  ]
    .join(" ")
    .toLowerCase();

  let outputKind: CraftOutputKind = "desk_organizer";
  if (/planter|herb|plant|hydro|cloche|greenhouse|irrigation|trellis|sprout|succulent|garden/.test(outputBlob)) {
    outputKind = "planter_hydro";
  } else if (/lamp|lantern|light|diffuser|fresnel|sconce|glow|shade/.test(outputBlob)) {
    outputKind = "lamp_lantern";
  } else if (/easel|stand|lectern|cradle|tilt|tablet|laptop|phone/.test(outputBlob)) {
    outputKind = "easel_stand";
  } else if (/tote|sling|bag|wrap|pouch|roll/.test(outputBlob)) {
    outputKind = "bag_sling";
  }

  const primaryColor =
    invention.assemblyParts[0]?.colorHex || "#D98A6C";
  const accentColor =
    invention.assemblyParts[1]?.colorHex || "#7C8B6A";

  return { objectKind, outputKind, primaryColor, accentColor };
}

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

export function shadeHex(hex: string, factor: number, alpha = 1): string {
  const { r, g, b } = hexToRgb(hex);
  const nr = clamp(Math.round(r * factor), 0, 255);
  const ng = clamp(Math.round(g * factor), 0, 255);
  const nb = clamp(Math.round(b * factor), 0, 255);
  return `rgba(${nr}, ${ng}, ${nb}, ${alpha})`;
}

export function drawWorkshopBackdrop(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  horizonRatio = 0.64
): void {
  const horizonY = h * horizonRatio;

  // Soft daylight plaster studio wall
  const wallGrad = ctx.createLinearGradient(0, 0, w, horizonY);
  wallGrad.addColorStop(0, "#FAF6EE");
  wallGrad.addColorStop(0.55, "#F2EAE0");
  wallGrad.addColorStop(1, "#E5DAC8");
  ctx.fillStyle = wallGrad;
  ctx.fillRect(0, 0, w, horizonY);

  // Diagonal morning window light beam
  ctx.save();
  const beamGrad = ctx.createLinearGradient(0, 0, w * 0.72, horizonY);
  beamGrad.addColorStop(0, "rgba(255, 252, 242, 0.58)");
  beamGrad.addColorStop(1, "rgba(255, 252, 242, 0)");
  ctx.fillStyle = beamGrad;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(w * 0.48, 0);
  ctx.lineTo(w * 0.88, horizonY);
  ctx.lineTo(0, horizonY);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Natural oak workbench surface
  const deskGrad = ctx.createLinearGradient(0, horizonY, 0, h);
  deskGrad.addColorStop(0, "#D6B792");
  deskGrad.addColorStop(0.35, "#C7A37A");
  deskGrad.addColorStop(0.92, "#B28B60");
  deskGrad.addColorStop(1, "#8D6843");
  ctx.fillStyle = deskGrad;
  ctx.fillRect(0, horizonY, w, h - horizonY);

  // Wall-workbench crease line
  ctx.strokeStyle = "rgba(74, 53, 40, 0.22)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  ctx.lineTo(w, horizonY);
  ctx.stroke();

  // Subtle horizontal oak grain lines & plank seams
  ctx.save();
  ctx.strokeStyle = "rgba(96, 65, 38, 0.14)";
  ctx.lineWidth = 1;
  for (let i = 1; i <= 5; i++) {
    const y = horizonY + ((h - horizonY) * i) / 6;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(w * 0.3, y - 1.5, w * 0.7, y + 1.5, w, y);
    ctx.stroke();
  }
  // Subtle perspective plank joints
  ctx.strokeStyle = "rgba(74, 53, 40, 0.12)";
  for (const px of [0.22, 0.52, 0.81]) {
    ctx.beginPath();
    ctx.moveTo(w * px, horizonY);
    ctx.lineTo(w * (px + (px - 0.5) * 0.14), h);
    ctx.stroke();
  }
  ctx.restore();
}

function drawContactShadow(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  strength = 0.26
): void {
  ctx.save();
  // Soft directional cast shadow to bottom-right
  const castGrad = ctx.createRadialGradient(
    cx + rx * 0.18,
    cy + ry * 0.15,
    rx * 0.1,
    cx + rx * 0.18,
    cy + ry * 0.15,
    rx * 1.35
  );
  castGrad.addColorStop(0, `rgba(42, 28, 18, ${strength})`);
  castGrad.addColorStop(0.6, `rgba(42, 28, 18, ${strength * 0.4})`);
  castGrad.addColorStop(1, "rgba(42, 28, 18, 0)");
  ctx.fillStyle = castGrad;
  ctx.beginPath();
  ctx.ellipse(cx + rx * 0.18, cy + ry * 0.15, rx * 1.32, ry * 1.15, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tight ambient occlusion directly beneath object
  ctx.fillStyle = `rgba(34, 22, 14, ${strength * 0.9})`;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx * 0.88, ry * 0.65, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBotanicalFoliage(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  scale: number
): void {
  ctx.save();
  const stems = [
    { dx: -16, h: 36, tilt: -0.38 },
    { dx: 0, h: 46, tilt: 0.04 },
    { dx: 15, h: 34, tilt: 0.36 },
  ];
  for (const stem of stems) {
    ctx.strokeStyle = "#4E683B";
    ctx.lineWidth = Math.max(1.8, 2.5 * scale);
    ctx.lineCap = "round";
    const topX = cx + stem.dx * scale + Math.sin(stem.tilt) * 10 * scale;
    const topY = baseY - stem.h * scale;
    ctx.beginPath();
    ctx.moveTo(cx + stem.dx * 0.35 * scale, baseY);
    ctx.quadraticCurveTo(
      cx + stem.dx * 0.7 * scale,
      baseY - stem.h * 0.55 * scale,
      topX,
      topY
    );
    ctx.stroke();

    // Leaf pair + crown leaf
    const leaves = [
      { x: topX, y: topY, angle: stem.tilt - 0.15, rx: 14, ry: 7.5, col: "#6E8F52" },
      {
        x: topX - 8 * scale,
        y: topY + 11 * scale,
        angle: stem.tilt - 0.85,
        rx: 12,
        ry: 6.5,
        col: "#577541",
      },
      {
        x: topX + 9 * scale,
        y: topY + 13 * scale,
        angle: stem.tilt + 0.82,
        rx: 12,
        ry: 6.5,
        col: "#7FA162",
      },
    ];
    for (const leaf of leaves) {
      ctx.save();
      ctx.translate(leaf.x, leaf.y);
      ctx.rotate(leaf.angle);
      const lGrad = ctx.createLinearGradient(-leaf.rx * scale, 0, leaf.rx * scale, 0);
      lGrad.addColorStop(0, shadeHex(leaf.col, 0.84));
      lGrad.addColorStop(0.5, shadeHex(leaf.col, 1.12));
      lGrad.addColorStop(1, shadeHex(leaf.col, 0.92));
      ctx.fillStyle = lGrad;
      ctx.strokeStyle = "#3B512B";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, 0, leaf.rx * scale, leaf.ry * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Midrib vein
      ctx.strokeStyle = "rgba(235, 245, 218, 0.5)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(-leaf.rx * 0.7 * scale, 0);
      ctx.lineTo(leaf.rx * 0.7 * scale, 0);
      ctx.stroke();
      ctx.restore();
    }
  }
  ctx.restore();
}

function drawDeskTools(
  ctx: CanvasRenderingContext2D,
  cx: number,
  topY: number,
  scale: number
): void {
  ctx.save();
  // Yellow/ochre graphite pencil
  ctx.save();
  ctx.translate(cx - 12 * scale, topY);
  ctx.rotate(-0.22);
  ctx.fillStyle = "#E0A952";
  ctx.strokeStyle = "#4A3528";
  ctx.lineWidth = 1.1;
  ctx.fillRect(-3.5 * scale, -44 * scale, 7 * scale, 48 * scale);
  ctx.strokeRect(-3.5 * scale, -44 * scale, 7 * scale, 48 * scale);
  // Wood cone + graphite tip
  ctx.fillStyle = "#E9CFA9";
  ctx.beginPath();
  ctx.moveTo(-3.5 * scale, -44 * scale);
  ctx.lineTo(0, -54 * scale);
  ctx.lineTo(3.5 * scale, -44 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#2C2A29";
  ctx.beginPath();
  ctx.moveTo(-1.3 * scale, -50 * scale);
  ctx.lineTo(0, -54 * scale);
  ctx.lineTo(1.3 * scale, -50 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Terracotta studio pen
  ctx.save();
  ctx.translate(cx + 6 * scale, topY + 2 * scale);
  ctx.rotate(0.14);
  ctx.fillStyle = "#D98A6C";
  ctx.strokeStyle = "#4A3528";
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.roundRect(-4 * scale, -48 * scale, 8 * scale, 52 * scale, 3 * scale);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#B8BDC2";
  ctx.fillRect(3.2 * scale, -40 * scale, 2.4 * scale, 14 * scale);
  ctx.restore();

  // Steel scissors handle poking out
  ctx.save();
  ctx.translate(cx + 22 * scale, topY + 3 * scale);
  ctx.rotate(0.32);
  ctx.strokeStyle = "#4A3528";
  ctx.lineWidth = 2.6 * scale;
  ctx.beginPath();
  ctx.ellipse(-4 * scale, -34 * scale, 5 * scale, 7 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(5 * scale, -32 * scale, 5 * scale, 7 * scale, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
  ctx.restore();
}

function drawWarmLampGlow(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number
): void {
  ctx.save();
  const glow = ctx.createRadialGradient(cx, cy, radius * 0.08, cx, cy, radius);
  glow.addColorStop(0, "rgba(255, 246, 204, 0.95)");
  glow.addColorStop(0.28, "rgba(247, 198, 102, 0.55)");
  glow.addColorStop(0.65, "rgba(224, 154, 62, 0.18)");
  glow.addColorStop(1, "rgba(224, 154, 62, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// =========================================================================
// SPECIFIC REALISTIC FINISHED OBJECT RENDERERS
// =========================================================================

function drawRealisticPetBottleOutput(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  scale: number,
  outputKind: CraftOutputKind
): void {
  const bw = 46 * scale;
  const bh = 112 * scale;
  drawContactShadow(ctx, cx, baseY + 6 * scale, bw * 1.15, 16 * scale, 0.28);

  if (outputKind === "lamp_lantern") {
    drawWarmLampGlow(ctx, cx, baseY - bh * 0.55, 96 * scale);
  }

  // Wooden base ring / coaster
  ctx.save();
  const baseGrad = ctx.createLinearGradient(cx - bw * 1.1, 0, cx + bw * 1.1, 0);
  baseGrad.addColorStop(0, "#8E6542");
  baseGrad.addColorStop(0.45, "#C5986A");
  baseGrad.addColorStop(1, "#7B5535");
  ctx.fillStyle = baseGrad;
  ctx.strokeStyle = "#4A3528";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.ellipse(cx, baseY + 4 * scale, bw * 1.06, 14 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Lower PET chamber (translucent reservoir)
  const lowerTop = baseY - bh * 0.52;
  const petGrad = ctx.createLinearGradient(cx - bw, 0, cx + bw, 0);
  petGrad.addColorStop(0, "rgba(176, 214, 210, 0.72)");
  petGrad.addColorStop(0.28, "rgba(235, 249, 248, 0.85)");
  petGrad.addColorStop(0.72, "rgba(189, 224, 220, 0.65)");
  petGrad.addColorStop(1, "rgba(138, 184, 180, 0.76)");

  // Visible water inside lower chamber
  const waterTop = baseY - bh * 0.34;
  ctx.save();
  const waterGrad = ctx.createLinearGradient(cx, waterTop, cx, baseY);
  waterGrad.addColorStop(0, "rgba(128, 194, 212, 0.72)");
  waterGrad.addColorStop(1, "rgba(85, 152, 174, 0.84)");
  ctx.fillStyle = waterGrad;
  ctx.beginPath();
  ctx.moveTo(cx - bw * 0.94, waterTop);
  ctx.lineTo(cx - bw * 0.94, baseY - 2 * scale);
  ctx.ellipse(cx, baseY - 2 * scale, bw * 0.94, 12 * scale, 0, Math.PI, 0, true);
  ctx.lineTo(cx + bw * 0.94, waterTop);
  ctx.ellipse(cx, waterTop, bw * 0.94, 10 * scale, 0, 0, Math.PI, true);
  ctx.closePath();
  ctx.fill();

  // Water meniscus highlight
  ctx.strokeStyle = "rgba(240, 252, 255, 0.85)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.ellipse(cx, waterTop, bw * 0.93, 9.5 * scale, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Braided cotton capillary wick dipping into water
  if (outputKind === "planter_hydro") {
    ctx.save();
    ctx.strokeStyle = "#EFE3CC";
    ctx.lineWidth = 5 * scale;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx, lowerTop + 14 * scale);
    ctx.quadraticCurveTo(cx - 5 * scale, baseY - 18 * scale, cx + 6 * scale, baseY - 6 * scale);
    ctx.stroke();
    ctx.strokeStyle = "#8C765A";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 3]);
    ctx.stroke();
    ctx.restore();
  }

  // Outer lower PET shell + cut rim
  ctx.save();
  ctx.fillStyle = petGrad;
  ctx.strokeStyle = "#5B7878";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - bw, lowerTop);
  ctx.lineTo(cx - bw, baseY);
  ctx.ellipse(cx, baseY, bw, 13 * scale, 0, Math.PI, 0, true);
  ctx.lineTo(cx + bw, lowerTop);
  ctx.ellipse(cx, lowerTop, bw, 11 * scale, 0, 0, Math.PI, true);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  if (outputKind === "planter_hydro") {
    // Inverted upper PET funnel nested inside
    const rimY = lowerTop - 38 * scale;
    // Inverted bottle cap + neck at bottom of funnel
    ctx.fillStyle = "#D98A6C";
    ctx.strokeStyle = "#4A3528";
    ctx.beginPath();
    ctx.roundRect(cx - 10 * scale, lowerTop + 8 * scale, 20 * scale, 13 * scale, 3 * scale);
    ctx.fill();
    ctx.stroke();

    // Rich dark soil inside inverted cone
    const soilGrad = ctx.createLinearGradient(cx, rimY, cx, lowerTop + 8 * scale);
    soilGrad.addColorStop(0, "#5B4333");
    soilGrad.addColorStop(1, "#3A291E");
    ctx.fillStyle = soilGrad;
    ctx.beginPath();
    ctx.moveTo(cx - bw * 0.94, rimY + 6 * scale);
    ctx.lineTo(cx - 12 * scale, lowerTop + 8 * scale);
    ctx.lineTo(cx + 12 * scale, lowerTop + 8 * scale);
    ctx.lineTo(cx + bw * 0.94, rimY + 6 * scale);
    ctx.closePath();
    ctx.fill();

    // Perlite / soil grain specks
    ctx.fillStyle = "#D8CFC0";
    for (const [sx, sy] of [
      [-16, -24],
      [11, -18],
      [-5, -10],
      [18, -28],
    ]) {
      ctx.beginPath();
      ctx.arc(cx + sx * scale, lowerTop + sy * scale, 1.5 * scale, 0, Math.PI * 2);
      ctx.fill();
    }

    // Translucent funnel cone shell
    ctx.fillStyle = "rgba(218, 242, 240, 0.36)";
    ctx.strokeStyle = "#5B7878";
    ctx.beginPath();
    ctx.moveTo(cx - bw * 0.98, rimY);
    ctx.lineTo(cx - 13 * scale, lowerTop + 10 * scale);
    ctx.lineTo(cx + 13 * scale, lowerTop + 10 * scale);
    ctx.lineTo(cx + bw * 0.98, rimY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Top soil ellipse & botanical herb sprout
    ctx.fillStyle = "#4E382A";
    ctx.beginPath();
    ctx.ellipse(cx, rimY, bw * 0.98, 12 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#C67658";
    ctx.lineWidth = 2;
    ctx.stroke();

    drawBotanicalFoliage(ctx, cx, rimY, scale * 1.08);
  } else {
    // Desk caddy / organizer / lantern PET upper body
    const topY = lowerTop - 36 * scale;
    ctx.fillStyle = petGrad;
    ctx.strokeStyle = "#5B7878";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - bw * 0.92, topY);
    ctx.lineTo(cx - bw, lowerTop);
    ctx.ellipse(cx, lowerTop, bw, 11 * scale, 0, Math.PI, 0, true);
    ctx.lineTo(cx + bw * 0.92, topY);
    ctx.ellipse(cx, topY, bw * 0.92, 10 * scale, 0, 0, Math.PI, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Terracotta bias-tape trim collar
    ctx.strokeStyle = "#D98A6C";
    ctx.lineWidth = 3.2 * scale;
    ctx.beginPath();
    ctx.ellipse(cx, topY, bw * 0.92, 10 * scale, 0, 0, Math.PI * 2);
    ctx.stroke();

    if (outputKind === "lamp_lantern") {
      // Warm glowing LED bulb inside water diffuser
      drawWarmLampGlow(ctx, cx, topY + 26 * scale, 48 * scale);
      ctx.fillStyle = "#FFF7CC";
      ctx.beginPath();
      ctx.arc(cx, topY + 18 * scale, 11 * scale, 0, Math.PI * 2);
      ctx.fill();
    } else {
      drawDeskTools(ctx, cx, topY, scale);
    }
  }

  // Crisp glossy vertical plastic highlight streak
  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.beginPath();
  ctx.roundRect(cx - bw * 0.65, lowerTop + 4 * scale, 7 * scale, bh * 0.42, 3 * scale);
  ctx.fill();
  ctx.restore();
}

function drawRealisticUmbrellaOutput(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  scale: number,
  outputKind: CraftOutputKind
): void {
  drawContactShadow(ctx, cx, baseY + 6 * scale, 72 * scale, 15 * scale, 0.25);

  if (outputKind === "planter_hydro") {
    // Terracotta plant tray + soil + arched umbrella-rib micro-greenhouse dome
    const tw = 64 * scale;
    ctx.fillStyle = "#C67658";
    ctx.strokeStyle = "#4A3528";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - tw, baseY - 18 * scale);
    ctx.lineTo(cx - tw * 0.85, baseY);
    ctx.ellipse(cx, baseY, tw * 0.85, 11 * scale, 0, Math.PI, 0, true);
    ctx.lineTo(cx + tw, baseY - 18 * scale);
    ctx.ellipse(cx, baseY - 18 * scale, tw, 13 * scale, 0, 0, Math.PI, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#4A3528";
    ctx.beginPath();
    ctx.ellipse(cx, baseY - 18 * scale, tw, 13 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    drawBotanicalFoliage(ctx, cx, baseY - 18 * scale, scale * 0.95);

    // Arched spring-steel umbrella ribs + taut translucent ripstop cloche hood
    ctx.save();
    ctx.fillStyle = "rgba(204, 224, 210, 0.42)";
    ctx.strokeStyle = "#5B646B";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(cx, baseY - 18 * scale, tw * 0.96, 76 * scale, 0, Math.PI, 0, false);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Radial ribs
    for (const rx of [-0.55, 0, 0.55]) {
      ctx.beginPath();
      ctx.moveTo(cx, baseY - 94 * scale);
      ctx.quadraticCurveTo(cx + tw * rx * 1.15, baseY - 68 * scale, cx + tw * rx, baseY - 15 * scale);
      ctx.stroke();
    }
    ctx.restore();
    return;
  }

  // Hanging ripstop gear caddy or diffused lamp canopy
  // Horizontal wooden hanging dowel at top
  const topY = baseY - 118 * scale;
  ctx.save();
  ctx.fillStyle = "#B98A5C";
  ctx.strokeStyle = "#4A3528";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.roundRect(cx - 64 * scale, topY, 128 * scale, 9 * scale, 4 * scale);
  ctx.fill();
  ctx.stroke();

  // Braided cord hanger
  ctx.strokeStyle = "#6F5A45";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 48 * scale, topY);
  ctx.lineTo(cx, topY - 22 * scale);
  ctx.lineTo(cx + 48 * scale, topY);
  ctx.stroke();
  ctx.fillStyle = "#E0A952";
  ctx.beginPath();
  ctx.arc(cx, topY - 22 * scale, 4 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  if (outputKind === "lamp_lantern") {
    drawWarmLampGlow(ctx, cx, baseY - 56 * scale, 90 * scale);
  }

  // Ripstop waterproof fabric panel with stitched pockets
  const fabGrad = ctx.createLinearGradient(cx - 54 * scale, topY, cx + 54 * scale, baseY);
  fabGrad.addColorStop(0, "#7C8B6A");
  fabGrad.addColorStop(0.5, "#6C7C5B");
  fabGrad.addColorStop(1, "#556347");
  ctx.fillStyle = fabGrad;
  ctx.strokeStyle = "#3E4735";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(cx - 52 * scale, topY + 9 * scale, 104 * scale, 102 * scale, 8 * scale);
  ctx.fill();
  ctx.stroke();

  // Two terraced stitched pockets in contrasting terracotta & cream
  const pockets = [
    { y: topY + 26 * scale, h: 34 * scale, col: "#D98A6C" },
    { y: topY + 66 * scale, h: 38 * scale, col: "#E8DAC4" },
  ];
  for (const p of pockets) {
    ctx.fillStyle = p.col;
    ctx.strokeStyle = "#4A3528";
    ctx.beginPath();
    ctx.roundRect(cx - 44 * scale, p.y, 88 * scale, p.h, 5 * scale);
    ctx.fill();
    ctx.stroke();
    // Stitched seam
    ctx.strokeStyle = "rgba(74, 53, 40, 0.45)";
    ctx.setLineDash([3, 3]);
    ctx.strokeRect(cx - 40 * scale, p.y + 4 * scale, 80 * scale, p.h - 8 * scale);
    ctx.setLineDash([]);
  }
  // Curved J-handle hook suspended cleanly at bottom
  ctx.strokeStyle = "#8C5D3C";
  ctx.lineWidth = 6.5 * scale;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx + 28 * scale, topY + 86 * scale);
  ctx.lineTo(cx + 28 * scale, baseY - 8 * scale);
  ctx.arc(cx + 16 * scale, baseY - 8 * scale, 12 * scale, 0, Math.PI, false);
  ctx.stroke();

  drawDeskTools(ctx, cx - 8 * scale, topY + 26 * scale, scale * 0.8);
  ctx.restore();
}

function drawRealisticCardboardOutput(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  scale: number,
  outputKind: CraftOutputKind
): void {
  drawContactShadow(ctx, cx, baseY + 6 * scale, 78 * scale, 16 * scale, 0.28);

  if (outputKind === "lamp_lantern") {
    drawWarmLampGlow(ctx, cx, baseY - 56 * scale, 92 * scale);
  }

  ctx.save();
  // Isometric 3D tiered corrugated kraft desk organizer / easel
  const w = 68 * scale;
  const d = 24 * scale;

  // Back tall tier
  const drawKraftBlock = (
    x: number,
    y: number,
    bw: number,
    bh: number,
    bd: number,
    tint = "#CFAF84"
  ) => {
    // Top face
    ctx.fillStyle = shadeHex(tint, 1.12);
    ctx.strokeStyle = "#4A3528";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(x, y - bh);
    ctx.lineTo(x + bw, y - bh - bd * 0.45);
    ctx.lineTo(x + bw * 0.35, y - bh - bd * 0.9);
    ctx.lineTo(x - bw * 0.65, y - bh - bd * 0.45);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Front-left face
    ctx.fillStyle = shadeHex(tint, 0.98);
    ctx.beginPath();
    ctx.moveTo(x - bw * 0.65, y - bh - bd * 0.45);
    ctx.lineTo(x, y - bh);
    ctx.lineTo(x, y);
    ctx.lineTo(x - bw * 0.65, y - bd * 0.45);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Front-right face
    ctx.fillStyle = shadeHex(tint, 0.82);
    ctx.beginPath();
    ctx.moveTo(x, y - bh);
    ctx.lineTo(x + bw, y - bh - bd * 0.45);
    ctx.lineTo(x + bw, y - bd * 0.45);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Visible corrugated edge flutes along top-right lip
    ctx.strokeStyle = "rgba(74, 53, 40, 0.35)";
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      const fx = x + (bw * i) / 6;
      const fy = y - bh - (bd * 0.45 * i) / 6;
      ctx.beginPath();
      ctx.arc(fx, fy + 2, 1.6, 0, Math.PI);
      ctx.stroke();
    }
  };

  // Back tall slot tier
  drawKraftBlock(cx - 6 * scale, baseY - 6 * scale, w * 0.72, 92 * scale, d * 1.1, "#CFAF84");
  // Tools inside back tier
  drawDeskTools(ctx, cx - 2 * scale, baseY - 96 * scale, scale * 0.92);
  // Mid angled caddy tier
  drawKraftBlock(cx + 12 * scale, baseY + 2 * scale, w * 0.64, 58 * scale, d, "#DFC29A");
  // Front terracotta accent tray
  drawKraftBlock(cx - 12 * scale, baseY + 8 * scale, w * 0.56, 30 * scale, d * 0.9, "#D98A6C");

  // Brass paper-fastener pins on front corners
  ctx.fillStyle = "#E0A952";
  ctx.strokeStyle = "#4A3528";
  ctx.lineWidth = 1;
  for (const [px, py] of [
    [cx - 32 * scale, baseY - 10 * scale],
    [cx + 18 * scale, baseY - 12 * scale],
  ]) {
    ctx.beginPath();
    ctx.arc(px, py, 3 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function drawRealisticElectricFanOutput(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  scale: number,
  outputKind: CraftOutputKind
): void {
  drawContactShadow(ctx, cx, baseY + 6 * scale, 64 * scale, 14 * scale, 0.28);

  ctx.save();
  // Weighted fan pedestal base
  const baseGrad = ctx.createLinearGradient(cx - 48 * scale, 0, cx + 48 * scale, 0);
  baseGrad.addColorStop(0, "#3D3A36");
  baseGrad.addColorStop(0.5, "#65605B");
  baseGrad.addColorStop(1, "#2E2B28");
  ctx.fillStyle = baseGrad;
  ctx.strokeStyle = "#1C1B19";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(cx, baseY, 48 * scale, 13 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Articulated neck post
  ctx.fillStyle = "#8D9399";
  ctx.fillRect(cx - 6 * scale, baseY - 46 * scale, 12 * scale, 44 * scale);
  ctx.strokeRect(cx - 6 * scale, baseY - 46 * scale, 12 * scale, 44 * scale);

  // Domed radial wire fan grille
  const cageCy = baseY - 82 * scale;
  const cageR = 54 * scale;

  if (outputKind === "lamp_lantern") {
    drawWarmLampGlow(ctx, cx, cageCy, 95 * scale);
  }

  // Back hemisphere translucent/shadowed cage
  ctx.fillStyle = "rgba(245, 240, 232, 0.55)";
  ctx.strokeStyle = "#5B6268";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(cx, cageCy, cageR, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Concentric steel wire rings
  for (const rFrac of [0.32, 0.56, 0.78]) {
    ctx.strokeStyle = "rgba(75, 82, 88, 0.65)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(cx, cageCy, cageR * rFrac, 0, Math.PI * 2);
    ctx.stroke();
  }
  // Radial spokes
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * 8 * scale, cageCy + Math.sin(a) * 8 * scale);
    ctx.lineTo(cx + Math.cos(a) * cageR, cageCy + Math.sin(a) * cageR);
    ctx.stroke();
  }

  // Center brushed-metal emblem hub
  ctx.fillStyle = "#D98A6C";
  ctx.strokeStyle = "#4A3528";
  ctx.beginPath();
  ctx.arc(cx, cageCy, 11 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  if (outputKind === "planter_hydro") {
    // Potted herb resting inside wire dome cradle
    drawBotanicalFoliage(ctx, cx, cageCy + 10 * scale, scale * 0.95);
  } else {
    // Hanging brass S-hooks & tools clipped on grille
    drawDeskTools(ctx, cx, cageCy + 14 * scale, scale * 0.78);
  }
  ctx.restore();
}

function drawRealisticCeramicMugOutput(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  scale: number,
  outputKind: CraftOutputKind
): void {
  const mw = 42 * scale;
  const mh = 76 * scale;
  drawContactShadow(ctx, cx, baseY + 6 * scale, mw * 1.25, 14 * scale, 0.28);

  ctx.save();
  // Turned oak coaster plinth
  ctx.fillStyle = "#B6885E";
  ctx.strokeStyle = "#4A3528";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.ellipse(cx, baseY + 2 * scale, mw * 1.12, 12 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  const topY = baseY - mh;

  // Contents rising out of mug
  if (outputKind === "planter_hydro") {
    drawBotanicalFoliage(ctx, cx, topY + 6 * scale, scale * 1.05);
  } else {
    drawDeskTools(ctx, cx, topY + 8 * scale, scale * 0.96);
  }

  // Mug handle on right
  ctx.strokeStyle = "#EDE5D8";
  ctx.lineWidth = 9 * scale;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(cx + mw - 2 * scale, topY + mh * 0.5, 19 * scale, -Math.PI * 0.45, Math.PI * 0.45);
  ctx.stroke();
  ctx.strokeStyle = "#4A3528";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(cx + mw - 2 * scale, topY + mh * 0.5, 23 * scale, -Math.PI * 0.45, Math.PI * 0.45);
  ctx.stroke();

  // Stoneware cylinder body
  const mugGrad = ctx.createLinearGradient(cx - mw, 0, cx + mw, 0);
  mugGrad.addColorStop(0, "#D8CEBE");
  mugGrad.addColorStop(0.28, "#FFFDF9");
  mugGrad.addColorStop(0.75, "#E8DEC9");
  mugGrad.addColorStop(1, "#C5B8A5");
  ctx.fillStyle = mugGrad;
  ctx.strokeStyle = "#4A3528";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - mw, topY);
  ctx.lineTo(cx - mw * 0.92, baseY - 2 * scale);
  ctx.ellipse(cx, baseY - 2 * scale, mw * 0.92, 10 * scale, 0, Math.PI, 0, true);
  ctx.lineTo(cx + mw, topY);
  ctx.ellipse(cx, topY, mw, 10 * scale, 0, 0, Math.PI, true);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Golden kintsugi repair vein on cracked mug
  ctx.strokeStyle = "#E0A952";
  ctx.lineWidth = 2.2 * scale;
  ctx.beginPath();
  ctx.moveTo(cx - 12 * scale, topY + 4 * scale);
  ctx.lineTo(cx - 5 * scale, topY + 26 * scale);
  ctx.lineTo(cx - 14 * scale, topY + 46 * scale);
  ctx.stroke();

  // Glazed rim ellipse
  ctx.fillStyle = outputKind === "planter_hydro" ? "#4E382A" : "#C7B8A3";
  ctx.beginPath();
  ctx.ellipse(cx, topY, mw, 10 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#4A3528";
  ctx.stroke();

  // Unglazed terracotta foot band
  ctx.fillStyle = "#D98A6C";
  ctx.fillRect(cx - mw * 0.89, baseY - 10 * scale, mw * 1.78, 7 * scale);
  ctx.restore();
}

function drawRealisticGarmentOutput(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  scale: number
): void {
  drawContactShadow(ctx, cx, baseY + 6 * scale, 66 * scale, 14 * scale, 0.25);

  ctx.save();
  const topY = baseY - 114 * scale;
  // Wooden dowel bar + jute cord
  ctx.strokeStyle = "#7D644C";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 46 * scale, topY);
  ctx.lineTo(cx, topY - 22 * scale);
  ctx.lineTo(cx + 46 * scale, topY);
  ctx.stroke();

  ctx.fillStyle = "#B6885E";
  ctx.strokeStyle = "#4A3528";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.roundRect(cx - 58 * scale, topY, 116 * scale, 8 * scale, 4 * scale);
  ctx.fill();
  ctx.stroke();

  // Indigo denim hanging organizer body
  const denimGrad = ctx.createLinearGradient(cx - 48 * scale, topY, cx + 48 * scale, baseY);
  denimGrad.addColorStop(0, "#4B627A");
  denimGrad.addColorStop(0.5, "#3E5369");
  denimGrad.addColorStop(1, "#304154");
  ctx.fillStyle = denimGrad;
  ctx.strokeStyle = "#24303D";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(cx - 48 * scale, topY + 8 * scale, 96 * scale, 100 * scale, 6 * scale);
  ctx.fill();
  ctx.stroke();

  // Real stitched back-pocket panels with copper rivets
  for (const [px, py, pw, ph] of [
    [cx - 38 * scale, topY + 22 * scale, 34 * scale, 36 * scale],
    [cx + 4 * scale, topY + 22 * scale, 34 * scale, 36 * scale],
    [cx - 34 * scale, topY + 64 * scale, 68 * scale, 36 * scale],
  ]) {
    ctx.fillStyle = "#546D87";
    ctx.strokeStyle = "#E0A952";
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.roundRect(px, py, pw, ph, 4 * scale);
    ctx.fill();
    ctx.setLineDash([3, 2]);
    ctx.stroke();
    ctx.setLineDash([]);
    // Copper rivets
    ctx.fillStyle = "#D98A6C";
    ctx.beginPath();
    ctx.arc(px + 4 * scale, py + 4 * scale, 2.2 * scale, 0, Math.PI * 2);
    ctx.arc(px + pw - 4 * scale, py + 4 * scale, 2.2 * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  drawDeskTools(ctx, cx - 14 * scale, topY + 24 * scale, scale * 0.78);
  ctx.restore();
}

function drawRealisticTinJarOutput(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  scale: number,
  outputKind: CraftOutputKind
): void {
  const tw = 42 * scale;
  const th = 82 * scale;
  drawContactShadow(ctx, cx, baseY + 6 * scale, tw * 1.2, 14 * scale, 0.28);

  if (outputKind === "lamp_lantern") {
    drawWarmLampGlow(ctx, cx, baseY - th * 0.55, 95 * scale);
  }

  ctx.save();
  const topY = baseY - th;

  if (outputKind === "planter_hydro") {
    drawBotanicalFoliage(ctx, cx, topY + 4 * scale, scale * 1.0);
  } else if (outputKind === "desk_organizer") {
    drawDeskTools(ctx, cx, topY + 6 * scale, scale * 0.92);
  }

  // Brushed steel ribbed tin shell
  const tinGrad = ctx.createLinearGradient(cx - tw, 0, cx + tw, 0);
  tinGrad.addColorStop(0, "#7E868C");
  tinGrad.addColorStop(0.32, "#D2D7DB");
  tinGrad.addColorStop(0.65, "#9BA2A8");
  tinGrad.addColorStop(1, "#697075");
  ctx.fillStyle = tinGrad;
  ctx.strokeStyle = "#3E4347";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - tw, topY);
  ctx.lineTo(cx - tw, baseY);
  ctx.ellipse(cx, baseY, tw, 11 * scale, 0, Math.PI, 0, true);
  ctx.lineTo(cx + tw, topY);
  ctx.ellipse(cx, topY, tw, 10 * scale, 0, 0, Math.PI, true);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Horizontal tin corrugation ribs
  ctx.strokeStyle = "rgba(50, 55, 60, 0.35)";
  ctx.lineWidth = 1.2;
  for (const ry of [0.28, 0.46, 0.64, 0.8]) {
    ctx.beginPath();
    ctx.ellipse(cx, topY + th * ry, tw, 7 * scale, 0, 0, Math.PI);
    ctx.stroke();
  }

  // Perforated warm lantern holes if lamp
  if (outputKind === "lamp_lantern") {
    ctx.fillStyle = "#FFF4B8";
    for (let row = 0; row < 3; row++) {
      for (let col = -2; col <= 2; col++) {
        ctx.beginPath();
        ctx.arc(
          cx + col * 13 * scale,
          topY + (22 + row * 18) * scale,
          2.6 * scale,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }
  }

  // Warm woven leather / kraft belly band
  ctx.fillStyle = "#D98A6C";
  ctx.fillRect(cx - tw, baseY - 26 * scale, tw * 2, 16 * scale);
  ctx.strokeStyle = "#4A3528";
  ctx.strokeRect(cx - tw, baseY - 26 * scale, tw * 2, 16 * scale);

  // Rolled top rim
  ctx.fillStyle = outputKind === "lamp_lantern" ? "#FFE49C" : "#5B6065";
  ctx.beginPath();
  ctx.ellipse(cx, topY, tw, 10 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#3E4347";
  ctx.stroke();
  ctx.restore();
}

function drawRealisticWoodCrateOutput(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  scale: number,
  outputKind: CraftOutputKind
): void {
  drawContactShadow(ctx, cx, baseY + 6 * scale, 82 * scale, 16 * scale, 0.28);

  ctx.save();
  // Cantilevered wooden desk shelf / herb ladder
  const w = 78 * scale;
  // Side upright rails
  for (const sx of [-w * 0.72, w * 0.62]) {
    const railGrad = ctx.createLinearGradient(cx + sx, 0, cx + sx + 12 * scale, 0);
    railGrad.addColorStop(0, "#9E7248");
    railGrad.addColorStop(0.5, "#C5976A");
    railGrad.addColorStop(1, "#7F5936");
    ctx.fillStyle = railGrad;
    ctx.strokeStyle = "#4A3528";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(cx + sx, baseY - 104 * scale, 12 * scale, 104 * scale, 2 * scale);
    ctx.fill();
    ctx.stroke();
  }

  // Two horizontal planed pine shelves
  for (const sy of [baseY - 46 * scale, baseY - 88 * scale]) {
    ctx.fillStyle = "#CFA477";
    ctx.strokeStyle = "#4A3528";
    ctx.beginPath();
    ctx.roundRect(cx - w * 0.85, sy, w * 1.7, 13 * scale, 2 * scale);
    ctx.fill();
    ctx.stroke();
    // Brass screw heads
    ctx.fillStyle = "#E0A952";
    ctx.beginPath();
    ctx.arc(cx - w * 0.66, sy + 6.5 * scale, 2.2 * scale, 0, Math.PI * 2);
    ctx.arc(cx + w * 0.68, sy + 6.5 * scale, 2.2 * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  if (outputKind === "planter_hydro") {
    // Little terracotta pot + herb on top shelf
    ctx.fillStyle = "#D98A6C";
    ctx.strokeStyle = "#4A3528";
    ctx.beginPath();
    ctx.roundRect(cx - 18 * scale, baseY - 114 * scale, 36 * scale, 26 * scale, 3 * scale);
    ctx.fill();
    ctx.stroke();
    drawBotanicalFoliage(ctx, cx, baseY - 114 * scale, scale * 0.72);
  } else {
    // Stacked kraft notebooks & pencils on shelves
    ctx.fillStyle = "#7C8B6A";
    ctx.strokeStyle = "#4A3528";
    ctx.fillRect(cx - 42 * scale, baseY - 101 * scale, 48 * scale, 13 * scale);
    ctx.strokeRect(cx - 42 * scale, baseY - 101 * scale, 48 * scale, 13 * scale);
    ctx.fillStyle = "#F2EADF";
    ctx.fillRect(cx - 38 * scale, baseY - 111 * scale, 44 * scale, 10 * scale);
    ctx.strokeRect(cx - 38 * scale, baseY - 111 * scale, 44 * scale, 10 * scale);
    drawDeskTools(ctx, cx + 26 * scale, baseY - 46 * scale, scale * 0.72);
  }
  ctx.restore();
}

function drawRealisticGenericAssembly(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  scale: number,
  parts: AssemblyPart3D[],
  outputKind: CraftOutputKind
): void {
  drawContactShadow(ctx, cx, baseY + 6 * scale, 74 * scale, 15 * scale, 0.28);

  if (outputKind === "lamp_lantern") {
    drawWarmLampGlow(ctx, cx, baseY - 62 * scale, 92 * scale);
  }

  const unit = 56 * scale;
  const sorted = [...parts].sort((a, b) => (a.position[2] ?? 0) - (b.position[2] ?? 0));

  for (const part of sorted) {
    const px = cx + (part.position[0] ?? 0) * unit;
    const py = baseY - 52 * scale - (part.position[1] ?? 0) * unit;
    const pw = Math.max(16, (part.scale[0] ?? 0.5) * unit * 0.85);
    const ph = Math.max(16, (part.scale[1] ?? 0.5) * unit * 0.95);
    const col = part.colorHex || "#D98A6C";
    const alpha = part.material === "pet_plastic" ? 0.75 : 1;

    ctx.save();
    const grad = ctx.createLinearGradient(px - pw, py - ph, px + pw, py + ph);
    grad.addColorStop(0, shadeHex(col, 1.15, alpha));
    grad.addColorStop(0.55, shadeHex(col, 0.96, alpha));
    grad.addColorStop(1, shadeHex(col, 0.74, alpha));
    ctx.fillStyle = grad;
    ctx.strokeStyle = "#4A3528";
    ctx.lineWidth = 1.4;

    if (part.shape === "cylinder" || part.shape === "dome" || part.shape === "cone") {
      ctx.beginPath();
      ctx.roundRect(px - pw * 0.55, py - ph * 0.55, pw * 1.1, ph * 1.1, pw * 0.28);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = shadeHex(col, 1.18, alpha);
      ctx.beginPath();
      ctx.ellipse(px, py - ph * 0.52, pw * 0.55, 8 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (part.shape === "ring") {
      ctx.strokeStyle = shadeHex(col, 0.92, 1);
      ctx.lineWidth = Math.max(6, pw * 0.2);
      ctx.beginPath();
      ctx.ellipse(px, py, pw * 0.65, ph * 0.45, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.roundRect(px - pw * 0.65, py - ph * 0.5, pw * 1.3, ph, 5 * scale);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  if (outputKind === "planter_hydro") {
    drawBotanicalFoliage(ctx, cx, baseY - 82 * scale, scale * 0.85);
  } else if (outputKind === "desk_organizer") {
    drawDeskTools(ctx, cx, baseY - 76 * scale, scale * 0.82);
  }
}

function drawRealisticSlipperOutput(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  scale: number,
  inventionName: string
): void {
  drawContactShadow(ctx, cx, baseY + 6 * scale, 82 * scale, 15 * scale, 0.28);
  const lowerName = inventionName.toLowerCase();

  ctx.save();
  if (lowerName.includes("stamp") || lowerName.includes("print")) {
    // Hand-carved EVA rubber relief print stamp mounted on oak wood block + stamped botanical card
    // Kraft card on workbench
    ctx.fillStyle = "#F7F1E5";
    ctx.strokeStyle = "#4A3528";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(cx - 76 * scale, baseY - 22 * scale, 84 * scale, 30 * scale, 3 * scale);
    ctx.fill();
    ctx.stroke();

    // Printed botanical leaf stamp impression in terracotta ink
    ctx.fillStyle = "#D98A6C";
    ctx.beginPath();
    ctx.ellipse(cx - 38 * scale, baseY - 7 * scale, 16 * scale, 7 * scale, -0.15, 0, Math.PI * 2);
    ctx.fill();

    // Carved blue-slate EVA rubber sole plate + wood grip block resting beside card
    const sx = cx + 22 * scale;
    const sy = baseY - 12 * scale;
    // Wooden backing block
    ctx.fillStyle = "#C5976A";
    ctx.strokeStyle = "#4A3528";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(sx - 34 * scale, sy - 42 * scale, 68 * scale, 28 * scale, 4 * scale);
    ctx.fill();
    ctx.stroke();
    // Wooden knob handle
    ctx.fillStyle = "#A4764B";
    ctx.beginPath();
    ctx.roundRect(sx - 12 * scale, sy - 64 * scale, 24 * scale, 22 * scale, 5 * scale);
    ctx.fill();
    ctx.stroke();
    // Blue-teal EVA rubber stamp pad bonded underneath
    ctx.fillStyle = "#2E6A85";
    ctx.beginPath();
    ctx.roundRect(sx - 32 * scale, sy - 14 * scale, 64 * scale, 14 * scale, 3 * scale);
    ctx.fill();
    ctx.stroke();
    // Carved relief ridges visible on edge
    ctx.strokeStyle = "#193F52";
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(sx + i * 10 * scale, sy - 6 * scale);
      ctx.lineTo(sx + i * 10 * scale, sy);
      ctx.stroke();
    }
  } else if (lowerName.includes("rack") || lowerName.includes("grip") || lowerName.includes("cable")) {
    // Wall-mounted wooden cleat + slotted blue EVA rubber sole clamping handles/cables
    ctx.fillStyle = "#C5976A";
    ctx.strokeStyle = "#4A3528";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(cx - 74 * scale, baseY - 62 * scale, 148 * scale, 42 * scale, 5 * scale);
    ctx.fill();
    ctx.stroke();

    // Ribbed blue rubber sole insert with 3 friction star-slits
    ctx.fillStyle = "#2E6A85";
    ctx.beginPath();
    ctx.roundRect(cx - 62 * scale, baseY - 54 * scale, 124 * scale, 26 * scale, 10 * scale);
    ctx.fill();
    ctx.stroke();

    // Clamped brush/broom dowel + dark cord gripped cleanly
    for (const [gx, col] of [
      [cx - 32 * scale, "#E0A952"],
      [cx + 4 * scale, "#4A3528"],
      [cx + 38 * scale, "#D98A6C"],
    ] as const) {
      ctx.strokeStyle = "#193F52";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(gx - 8 * scale, baseY - 41 * scale);
      ctx.lineTo(gx + 8 * scale, baseY - 41 * scale);
      ctx.moveTo(gx, baseY - 49 * scale);
      ctx.lineTo(gx, baseY - 33 * scale);
      ctx.stroke();

      ctx.fillStyle = col;
      ctx.strokeStyle = "#1C1B19";
      ctx.beginPath();
      ctx.roundRect(gx - 4.5 * scale, baseY - 96 * scale, 9 * scale, 96 * scale, 4 * scale);
      ctx.fill();
      ctx.stroke();
    }
  } else {
    // Ribbed EVA Rubber Doorstop Wedge + 4 Non-Slip Furniture/Appliance Pads
    // Beveled blue-teal ribbed doorstop wedge
    const wGrad = ctx.createLinearGradient(cx - 64 * scale, 0, cx + 22 * scale, 0);
    wGrad.addColorStop(0, "#24576E");
    wGrad.addColorStop(0.55, "#377C9B");
    wGrad.addColorStop(1, "#1D475B");
    ctx.fillStyle = wGrad;
    ctx.strokeStyle = "#173442";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 66 * scale, baseY);
    ctx.lineTo(cx + 16 * scale, baseY);
    ctx.lineTo(cx + 16 * scale, baseY - 34 * scale);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Ribbed grip grooves along top slope
    ctx.strokeStyle = "rgba(215, 240, 250, 0.45)";
    ctx.lineWidth = 1.2;
    for (let i = 1; i <= 5; i++) {
      const t = i / 6;
      const gx = cx - 66 * scale + 82 * scale * t;
      const gy = baseY - 34 * scale * t;
      ctx.beginPath();
      ctx.moveTo(gx, gy + 2 * scale);
      ctx.lineTo(gx + 6 * scale, gy + 9 * scale);
      ctx.stroke();
    }

    // Reused dark navy strap pull-loop on back of wedge
    ctx.strokeStyle = "#1F2933";
    ctx.lineWidth = 4.5 * scale;
    ctx.beginPath();
    ctx.arc(cx + 19 * scale, baseY - 17 * scale, 10 * scale, -Math.PI * 0.45, Math.PI * 0.45);
    ctx.stroke();

    // Stacked cut circular non-slip furniture/appliance pads beside wedge
    for (const [px, py] of [
      [cx + 52 * scale, baseY - 2 * scale],
      [cx + 52 * scale, baseY - 12 * scale],
      [cx + 52 * scale, baseY - 22 * scale],
    ]) {
      ctx.fillStyle = "#316F8B";
      ctx.strokeStyle = "#173442";
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.ellipse(px, py, 20 * scale, 7 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }
  ctx.restore();
}

export function drawRealisticOutputScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  invention: InventionConcept,
  analysis: ObjectAnalysis,
  activeCallout: number | null = null
): void {
  drawWorkshopBackdrop(ctx, width, height, 0.62);

  const spec = inferCraftVisualSpec(invention, analysis);
  const cx = width * 0.5;
  const baseY = height * 0.78;
  const scale = Math.min(width / 380, height / 260) * 1.18;

  switch (spec.objectKind) {
    case "slipper_rubber":
      drawRealisticSlipperOutput(ctx, cx, baseY, scale, invention.name);
      break;
    case "pet_bottle":
      drawRealisticPetBottleOutput(ctx, cx, baseY, scale, spec.outputKind);
      break;
    case "umbrella":
      drawRealisticUmbrellaOutput(ctx, cx, baseY, scale, spec.outputKind);
      break;
    case "cardboard":
      drawRealisticCardboardOutput(ctx, cx, baseY, scale, spec.outputKind);
      break;
    case "electric_fan":
      drawRealisticElectricFanOutput(ctx, cx, baseY, scale, spec.outputKind);
      break;
    case "ceramic_mug":
      drawRealisticCeramicMugOutput(ctx, cx, baseY, scale, spec.outputKind);
      break;
    case "garment_denim":
      drawRealisticGarmentOutput(ctx, cx, baseY, scale);
      break;
    case "tin_jar":
      drawRealisticTinJarOutput(ctx, cx, baseY, scale, spec.outputKind);
      break;
    case "wood_crate":
      drawRealisticWoodCrateOutput(ctx, cx, baseY, scale, spec.outputKind);
      break;
    default:
      drawRealisticGenericAssembly(
        ctx,
        cx,
        baseY,
        scale,
        invention.assemblyParts,
        spec.outputKind
      );
      break;
  }

  // Optional clean callout indicators mapped smoothly around the crafted object
  if (activeCallout !== null) {
    const part = invention.assemblyParts.find((p) => p.calloutIndex === activeCallout);
    if (part) {
      const px = clamp(cx + (part.position[0] ?? 0) * 58 * scale, 36, width - 36);
      const py = clamp(baseY - 62 * scale - (part.position[1] ?? 0) * 50 * scale, 36, height - 36);
      ctx.save();
      ctx.strokeStyle = "#D98A6C";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(px, py, 16, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#D98A6C";
      ctx.beginPath();
      ctx.arc(px, py, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#1C1B19";
      ctx.font = '700 11px "JetBrains Mono", monospace';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(part.calloutIndex), px, py + 0.5);
      ctx.restore();
    }
  }
}

// =========================================================================
// REALISTIC STEP-BY-STEP WORKSHOP SCENE RENDERER
// =========================================================================

function drawWorkshopRuler(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  scale: number
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  const rw = 88 * scale;
  const rh = 16 * scale;
  const rGrad = ctx.createLinearGradient(0, 0, 0, rh);
  rGrad.addColorStop(0, "#EBC074");
  rGrad.addColorStop(1, "#C99342");
  ctx.fillStyle = rGrad;
  ctx.strokeStyle = "#4A3528";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(0, 0, rw, rh, 2);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "#4A3528";
  ctx.lineWidth = 1;
  for (let i = 1; i < 11; i++) {
    const tx = (rw * i) / 11;
    ctx.beginPath();
    ctx.moveTo(tx, 0);
    ctx.lineTo(tx, i % 2 === 0 ? rh * 0.48 : rh * 0.3);
    ctx.stroke();
  }
  ctx.restore();
}

function drawCraftScissors(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  scale: number
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  // Steel blades
  ctx.fillStyle = "#C7CED4";
  ctx.strokeStyle = "#3E454B";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(38 * scale, -6 * scale);
  ctx.lineTo(6 * scale, 4 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(36 * scale, 10 * scale);
  ctx.lineTo(6 * scale, -2 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Pivot screw
  ctx.fillStyle = "#E0A952";
  ctx.beginPath();
  ctx.arc(4 * scale, 1 * scale, 2.2 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Terracotta ergonomic handles
  ctx.strokeStyle = "#C67658";
  ctx.lineWidth = 3.2 * scale;
  ctx.beginPath();
  ctx.ellipse(-12 * scale, -7 * scale, 9 * scale, 5.5 * scale, -0.2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(-12 * scale, 8 * scale, 9 * scale, 5.5 * scale, 0.2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawWoodAwl(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(0.24);
  // Steel needle shaft
  ctx.fillStyle = "#B4BCC2";
  ctx.strokeStyle = "#3A4046";
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(-2.5 * scale, 0);
  ctx.lineTo(2.5 * scale, 0);
  ctx.lineTo(0, 26 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Turned walnut handle
  const hGrad = ctx.createLinearGradient(-7 * scale, 0, 7 * scale, 0);
  hGrad.addColorStop(0, "#7E5336");
  hGrad.addColorStop(0.5, "#B58159");
  hGrad.addColorStop(1, "#5F3D26");
  ctx.fillStyle = hGrad;
  ctx.strokeStyle = "#3B2618";
  ctx.beginPath();
  ctx.roundRect(-7 * scale, -30 * scale, 14 * scale, 30 * scale, 6 * scale);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawRawSalvagedBase(
  ctx: CanvasRenderingContext2D,
  objectKind: CraftObjectKind,
  cx: number,
  cy: number,
  scale: number,
  split: boolean
): void {
  drawContactShadow(ctx, cx, cy + 26 * scale, 58 * scale, 11 * scale, 0.22);

  if (objectKind === "pet_bottle") {
    // Realistic horizontal or upright PET bottle being worked on
    ctx.save();
    const bottleGrad = ctx.createLinearGradient(cx - 56 * scale, cy - 22 * scale, cx - 56 * scale, cy + 22 * scale);
    bottleGrad.addColorStop(0, "rgba(220, 245, 244, 0.86)");
    bottleGrad.addColorStop(0.45, "rgba(182, 222, 220, 0.72)");
    bottleGrad.addColorStop(1, "rgba(138, 186, 184, 0.8)");
    ctx.fillStyle = bottleGrad;
    ctx.strokeStyle = "#5B7878";
    ctx.lineWidth = 1.4;

    if (!split) {
      ctx.beginPath();
      ctx.roundRect(cx - 56 * scale, cy - 22 * scale, 84 * scale, 44 * scale, 8 * scale);
      ctx.fill();
      ctx.stroke();
      // Tapered shoulder + cap
      ctx.beginPath();
      ctx.moveTo(cx + 28 * scale, cy - 20 * scale);
      ctx.lineTo(cx + 46 * scale, cy - 8 * scale);
      ctx.lineTo(cx + 46 * scale, cy + 8 * scale);
      ctx.lineTo(cx + 28 * scale, cy + 20 * scale);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#D98A6C";
      ctx.fillRect(cx + 46 * scale, cy - 9 * scale, 10 * scale, 18 * scale);
      ctx.strokeRect(cx + 46 * scale, cy - 9 * scale, 10 * scale, 18 * scale);
    } else {
      // Separated lower cup + upper funnel
      ctx.beginPath();
      ctx.roundRect(cx - 60 * scale, cy - 22 * scale, 48 * scale, 44 * scale, 7 * scale);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + 4 * scale, cy - 22 * scale);
      ctx.lineTo(cx + 34 * scale, cy - 22 * scale);
      ctx.lineTo(cx + 52 * scale, cy - 8 * scale);
      ctx.lineTo(cx + 52 * scale, cy + 8 * scale);
      ctx.lineTo(cx + 34 * scale, cy + 22 * scale);
      ctx.lineTo(cx + 4 * scale, cy + 22 * scale);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
    return;
  }

  if (objectKind === "umbrella") {
    ctx.save();
    // Spread ripstop umbrella gore fabric + steel ribs
    ctx.fillStyle = "#7C8B6A";
    ctx.strokeStyle = "#3E4735";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(cx - 56 * scale, cy + 16 * scale);
    ctx.quadraticCurveTo(cx, cy - 42 * scale, cx + 56 * scale, cy + 16 * scale);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "#4A5258";
    ctx.beginPath();
    ctx.moveTo(cx, cy - 14 * scale);
    ctx.lineTo(cx - 28 * scale, cy + 16 * scale);
    ctx.moveTo(cx, cy - 14 * scale);
    ctx.lineTo(cx + 28 * scale, cy + 16 * scale);
    ctx.stroke();
    ctx.restore();
    return;
  }

  if (objectKind === "electric_fan") {
    ctx.save();
    ctx.fillStyle = "rgba(240, 236, 228, 0.65)";
    ctx.strokeStyle = "#5A6268";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(cx, cy, 34 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 20 * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    return;
  }

  if (objectKind === "ceramic_mug") {
    ctx.save();
    ctx.fillStyle = "#F5EFE4";
    ctx.strokeStyle = "#4A3528";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(cx - 26 * scale, cy - 26 * scale, 52 * scale, 52 * scale, 6 * scale);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "#E0A952";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(cx - 8 * scale, cy - 24 * scale);
    ctx.lineTo(cx - 2 * scale, cy + 4 * scale);
    ctx.stroke();
    ctx.restore();
    return;
  }

  if (objectKind === "garment_denim") {
    ctx.save();
    ctx.fillStyle = "#465E76";
    ctx.strokeStyle = "#263442";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(cx - 50 * scale, cy - 24 * scale, 100 * scale, 48 * scale, 4 * scale);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "#E0A952";
    ctx.setLineDash([4, 3]);
    ctx.strokeRect(cx - 42 * scale, cy - 16 * scale, 84 * scale, 32 * scale);
    ctx.setLineDash([]);
    ctx.restore();
    return;
  }

  if (objectKind === "tin_jar") {
    ctx.save();
    const tinG = ctx.createLinearGradient(cx - 28 * scale, 0, cx + 28 * scale, 0);
    tinG.addColorStop(0, "#7C8388");
    tinG.addColorStop(0.4, "#D5DADF");
    tinG.addColorStop(1, "#6A7075");
    ctx.fillStyle = tinG;
    ctx.strokeStyle = "#3E4347";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(cx - 28 * scale, cy - 28 * scale, 56 * scale, 56 * scale, 5 * scale);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    return;
  }

  if (objectKind === "slipper_rubber") {
    ctx.save();
    // Ribbed blue rubber flip-flop sole silhouette + snapped dark navy strap
    const sGrad = ctx.createLinearGradient(cx - 58 * scale, cy - 22 * scale, cx + 58 * scale, cy + 22 * scale);
    sGrad.addColorStop(0, "#2C6B88");
    sGrad.addColorStop(0.5, "#3A82A3");
    sGrad.addColorStop(1, "#21536B");
    ctx.fillStyle = sGrad;
    ctx.strokeStyle = "#173442";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(cx - 56 * scale, cy - 22 * scale, 112 * scale, 44 * scale, 20 * scale);
    ctx.fill();
    ctx.stroke();

    // Ribbed footbed lines
    ctx.strokeStyle = "rgba(20, 50, 66, 0.35)";
    ctx.lineWidth = 1.1;
    for (let rx = -36; rx <= 36; rx += 12) {
      ctx.beginPath();
      ctx.moveTo(cx + rx * scale, cy - 18 * scale);
      ctx.lineTo(cx + rx * scale, cy + 18 * scale);
      ctx.stroke();
    }

    // Broken Y-strap nubs
    ctx.strokeStyle = "#1B242E";
    ctx.lineWidth = 4.5 * scale;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx - 24 * scale, cy - 12 * scale);
    ctx.lineTo(cx + 8 * scale, cy - 2 * scale);
    ctx.moveTo(cx - 24 * scale, cy + 12 * scale);
    ctx.lineTo(cx + 2 * scale, cy + 3 * scale);
    ctx.stroke();
    ctx.restore();
    return;
  }

  // Cardboard / wood crate / generic sheet
  ctx.save();
  const matColor = objectKind === "wood_crate" ? "#C5976A" : "#D3B387";
  ctx.fillStyle = matColor;
  ctx.strokeStyle = "#4A3528";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(cx - 56 * scale, cy + 8 * scale);
  ctx.lineTo(cx + 12 * scale, cy - 26 * scale);
  ctx.lineTo(cx + 60 * scale, cy - 2 * scale);
  ctx.lineTo(cx - 8 * scale, cy + 32 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

export function drawRealisticStepScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  step: ConstructionStep,
  stepIndex: number,
  totalSteps: number,
  invention: InventionConcept,
  analysis: ObjectAnalysis
): void {
  drawWorkshopBackdrop(ctx, width, height, 0.56);
  const spec = inferCraftVisualSpec(invention, analysis);
  const cx = width * 0.5;
  const cy = height * 0.62;
  const scale = Math.min(width / 220, height / 155);
  const action: StepActionType = step.actionType;

  // Final test/validation step shows the completed realistic invention!
  if (action === "test" || stepIndex === totalSteps - 1) {
    drawRealisticOutputScene(ctx, width, height, invention, analysis, null);
    return;
  }

  const isSplitStage =
    action === "join" || action === "mount" || action === "finish" || stepIndex >= Math.floor(totalSteps / 2);

  drawRawSalvagedBase(ctx, spec.objectKind, cx, cy, scale, isSplitStage);

  if (action === "measure") {
    // Red grease-pencil mark line + wooden ruler
    ctx.save();
    ctx.strokeStyle = "#D98A6C";
    ctx.lineWidth = 2.2;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(cx - 4 * scale, cy - 26 * scale);
    ctx.lineTo(cx - 4 * scale, cy + 26 * scale);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
    drawWorkshopRuler(ctx, cx - 44 * scale, cy - 38 * scale, 0.12, scale);
  } else if (action === "cut") {
    ctx.save();
    ctx.strokeStyle = "#D98A6C";
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(cx - 2 * scale, cy - 25 * scale);
    ctx.lineTo(cx - 2 * scale, cy + 25 * scale);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
    drawCraftScissors(ctx, cx + 6 * scale, cy - 26 * scale, 1.05, scale);
  } else if (action === "puncture") {
    ctx.fillStyle = "#2E251F";
    ctx.beginPath();
    ctx.arc(cx - 12 * scale, cy + 2 * scale, 3.2 * scale, 0, Math.PI * 2);
    ctx.arc(cx + 14 * scale, cy + 2 * scale, 3.2 * scale, 0, Math.PI * 2);
    ctx.fill();
    drawWoodAwl(ctx, cx + 2 * scale, cy - 22 * scale, scale);
  } else if (action === "fold") {
    ctx.save();
    ctx.strokeStyle = "#7C8B6A";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(cx, cy - 20 * scale, 22 * scale, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    ctx.fillStyle = "#7C8B6A";
    ctx.beginPath();
    ctx.moveTo(cx + 22 * scale, cy - 26 * scale);
    ctx.lineTo(cx + 15 * scale, cy - 30 * scale);
    ctx.lineTo(cx + 17 * scale, cy - 21 * scale);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  } else if (action === "thread") {
    // Braided cotton cord / capillary wick passing through
    ctx.save();
    ctx.strokeStyle = "#EFE3CC";
    ctx.lineWidth = 4.2 * scale;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx - 48 * scale, cy - 26 * scale);
    ctx.bezierCurveTo(cx - 18 * scale, cy - 12 * scale, cx + 10 * scale, cy + 16 * scale, cx + 48 * scale, cy - 8 * scale);
    ctx.stroke();
    ctx.strokeStyle = "#D98A6C";
    ctx.lineWidth = 1.6;
    ctx.setLineDash([4, 3]);
    ctx.stroke();
    ctx.restore();
  } else if (action === "join") {
    // Join alignment arrow + brass fastener pin
    ctx.save();
    ctx.strokeStyle = "#7C8B6A";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(cx - 12 * scale, cy);
    ctx.lineTo(cx + 6 * scale, cy);
    ctx.stroke();
    ctx.fillStyle = "#E0A952";
    ctx.strokeStyle = "#4A3528";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(cx, cy - 22 * scale, 4 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  } else if (action === "mount") {
    // Wooden base block / cradle seated below
    ctx.save();
    ctx.fillStyle = "#B6885E";
    ctx.strokeStyle = "#4A3528";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(cx - 46 * scale, cy + 16 * scale, 92 * scale, 14 * scale, 4 * scale);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "#D98A6C";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 36 * scale);
    ctx.lineTo(cx, cy - 16 * scale);
    ctx.stroke();
    ctx.restore();
  } else if (action === "finish") {
    // Cork sanding block smoothing edge
    ctx.save();
    ctx.translate(cx - 8 * scale, cy - 30 * scale);
    ctx.rotate(-0.15);
    ctx.fillStyle = "#D98A6C";
    ctx.strokeStyle = "#4A3528";
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.roundRect(-18 * scale, -8 * scale, 36 * scale, 16 * scale, 3 * scale);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#4A3528";
    ctx.fillRect(-18 * scale, 5 * scale, 36 * scale, 3 * scale);
    ctx.restore();
  }
}

export function drawMaterialTextureOverlay(
  ctx: CanvasRenderingContext2D,
  material: PartMaterialFinish,
  x: number,
  y: number,
  w: number,
  h: number
): void {
  ctx.save();
  if (material === "wood_grain") {
    ctx.strokeStyle = "rgba(74, 53, 40, 0.24)";
    ctx.lineWidth = 1;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(x - w * 0.65, y + i * h * 0.28);
      ctx.bezierCurveTo(
        x - w * 0.2,
        y + i * h * 0.28 - 4,
        x + w * 0.2,
        y + i * h * 0.28 + 4,
        x + w * 0.65,
        y + i * h * 0.28
      );
      ctx.stroke();
    }
  } else if (material === "woven_fabric") {
    ctx.strokeStyle = "rgba(255, 250, 240, 0.28)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.strokeRect(x - w * 0.65, y - h * 0.42, w * 1.3, h * 0.84);
    ctx.setLineDash([]);
  } else if (material === "brushed_metal") {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - w * 0.5, y - h * 0.25);
    ctx.lineTo(x + w * 0.5, y - h * 0.25);
    ctx.moveTo(x - w * 0.5, y + h * 0.15);
    ctx.lineTo(x + w * 0.5, y + h * 0.15);
    ctx.stroke();
  }
  ctx.restore();
}
