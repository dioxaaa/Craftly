import type {
  AssemblyPart3D,
  ConstructionStep,
  DifficultyLevel,
  DirectionType,
  InventionConcept,
  ObjectAnalysis,
  PartMaterialFinish,
  RefinementMode,
  StepActionType,
  SynthesisInput,
  SynthesisResult,
} from "../types/invention";

interface ObjectProfile {
  key: string;
  keywords: string[];
  objectName: string;
  category: string;
  originalFunction: string;
  defaultCondition: string[];
  physicalProperties: string[];
  shapeProfile: string;
  components: string[];
  materials: string[];
  reusableParts: string[];
  potentialFunctions: string[];
  limitations: string[];
  primaryFinish: PartMaterialFinish;
  secondaryFinish: PartMaterialFinish;
}

const OBJECT_PROFILES: ObjectProfile[] = [
  {
    key: "umbrella",
    keywords: ["umbrella", "parasol", "canopy", "rib", "ribs"],
    objectName: "Broken Umbrella",
    category: "Weather Gear & Structural Textile",
    originalFunction: "Overhead rain and sun shielding via a tensioned folding frame",
    defaultCondition: ["bent frame", "intact waterproof fabric"],
    physicalProperties: [
      "waterproof ripstop fabric",
      "lightweight tubular shaft",
      "flexible steel ribs",
      "ergonomic hooked or straight handle",
    ],
    shapeProfile: "Radial tensioned dome with central spine",
    components: ["waterproof canopy", "8-rib metal spider", "central shaft", "handle", "ferrule tip"],
    materials: ["coated polyester pongee", "spring steel wire", "aluminum or hardwood handle"],
    reusableParts: ["curved waterproof gores", "spring-steel struts", "telescoping tube", "curved grip handle"],
    potentialFunctions: ["water-resistant containment", "lightweight tensioned shade", "flexible hanging armature", "collapsible drying rack"],
    limitations: ["hinge joints lose alignment under heavy wind", "thin fabric tears near sharp metal burs"],
    primaryFinish: "woven_fabric",
    secondaryFinish: "brushed_metal",
  },
  {
    key: "bottle_plastic",
    keywords: ["plastic bottle", "pet bottle", "water bottle", "soda bottle", "plastic bottles", "bottles"],
    objectName: "Empty PET Plastic Bottles",
    category: "Food-Grade Polymer Packaging",
    originalFunction: "Pressurized or sealed liquid containment",
    defaultCondition: ["empty", "cleanable", "structurally intact"],
    physicalProperties: [
      "waterproof",
      "translucent",
      "lightweight",
      "thermo-formable edge",
      "threaded neck seal",
    ],
    shapeProfile: "Hollow cylindrical chamber tapering to a threaded neck",
    components: ["domed shoulder", "smooth cylinder barrel", "ribbed base", "screw cap"],
    materials: ["PET #1 translucent polymer", "HDPE screw cap"],
    reusableParts: ["curved optical reservoir", "precision funnel cone", "waterproof base cup", "threaded dispenser nozzle"],
    potentialFunctions: ["capillary plant irrigation", "layered desk sorting", "optical light diffusion", "gravity-fed dry storage"],
    limitations: ["softens above 65C", "thin wall buckles unless braced or ringed"],
    primaryFinish: "pet_plastic",
    secondaryFinish: "terracotta",
  },
  {
    key: "cardboard",
    keywords: ["cardboard", "box", "carton", "corrugated", "parcel", "shipping box", "shoebox"],
    objectName: "Corrugated Cardboard & Boxes",
    category: "Structural Paperboard Packaging",
    originalFunction: "Impact-absorbing shipping and dry storage enclosure",
    defaultCondition: ["flattened or creased", "dry structural flutes"],
    physicalProperties: [
      "high strength-to-weight ratio",
      "insulating fluted core",
      "score-and-fold precision",
      "breathable fiber surface",
    ],
    shapeProfile: "Layered planar sheets with internal sinusoidal fluting",
    components: ["outer kraft liner", "fluted medium core", "folded corner flaps"],
    materials: ["recycled kraft paperboard", "starch adhesive"],
    reusableParts: ["rigid double-walled dividers", "angled wedge braces", "laminated base plates", "hinged lid panels"],
    potentialFunctions: ["modular desktop architecture", "angled ergonomic stand", "acoustic or thermal baffle", "slot-together organizer"],
    limitations: ["loses rigidity when soaked unless sealed", "raw edges fray without kraft tape"],
    primaryFinish: "cardboard",
    secondaryFinish: "wood_grain",
  },
  {
    key: "electric_fan",
    keywords: ["fan", "electric fan", "desk fan", "stand fan", "cooling fan", "fan blades"],
    objectName: "Worn-Out Electric Fan",
    category: "Small Household Appliance",
    originalFunction: "Motorized airflow circulation",
    defaultCondition: ["non-spinning motor", "intact safety grille and base"],
    physicalProperties: [
      "rigid powder-coated wire cage",
      "weighted anti-tip base",
      "curved aerodynamic blades",
      "pivoting neck joint",
    ],
    shapeProfile: "Hemispherical wire basket mounted on an articulated pedestal",
    components: ["front/rear wire grille", "three-blade impeller", "weighted base", "tilt neck", "motor housing"],
    materials: ["powder-coated steel wire", "ABS polymer", "cast ballast base"],
    reusableParts: ["domed wire basket", "weighted pivot stand", "aerodynamic blade hub", "protective rim ring"],
    potentialFunctions: ["suspended botanical trellis", "angled studio tool carousel", "hanging drying dome", "kinetic wind-driven spinner"],
    limitations: ["dead motor coil should be safely disconnected and removed", "wire spacing requires mesh liner for small items"],
    primaryFinish: "brushed_metal",
    secondaryFinish: "wood_grain",
  },
  {
    key: "mug",
    keywords: ["mug", "cup", "ceramic", "porcelain", "stoneware", "teacup"],
    objectName: "Cracked Ceramic Mug",
    category: "Glazed Stoneware Tableware",
    originalFunction: "Insulated hot beverage vessel",
    defaultCondition: ["hairline crack or missing handle", "solid thick base"],
    physicalProperties: [
      "heavy stable base",
      "smooth glazed surface",
      "heat resistant",
      "matte porous fracture rim",
    ],
    shapeProfile: "Thick-walled cylinder with flat bottom foot",
    components: ["glazed body", "rimmed lip", "un-glazed foot ring", "handle stub"],
    materials: ["kiln-fired stoneware ceramic", "vitreous glaze"],
    reusableParts: ["weighted cylinder cup", "ceramic sharpening foot-ring", "vertical pen/brush well"],
    potentialFunctions: ["weighted desk tool caddy", "self-draining succulent vessel", "knife-honing & utensil station", "warm ambient lamp shade base"],
    limitations: ["not food-safe for hot liquids if cracked", "brittle against sharp impacts or standard steel drill bits"],
    primaryFinish: "ceramic",
    secondaryFinish: "wood_grain",
  },
  {
    key: "clothes",
    keywords: ["clothes", "shirt", "t-shirt", "jeans", "denim", "jacket", "pants", "fabric", "cloth", "sweater", "sock"],
    objectName: "Unused Garments & Denim",
    category: "Woven & Knit Textiles",
    originalFunction: "Wearable thermal and protective clothing",
    defaultCondition: ["outgrown or worn", "strong intact seams and panels"],
    physicalProperties: [
      "flexible tensile weave",
      "breathable",
      "washable",
      "reinforced double-stitched pockets and cuffs",
    ],
    shapeProfile: "Tubular sleeves/legs and flat torso panels with hardware",
    components: ["woven panels", "reinforced pockets", "waistband/collar", "buttons or zippers"],
    materials: ["cotton twill or jersey", "poly-cotton thread", "metal rivets/buttons"],
    reusableParts: ["pre-hemmed pockets", "sturdy belt-loop strips", "double-layer cuff tubes", "drawstring cord"],
    potentialFunctions: ["roll-up tool wrap", "hanging pocket organizer", "braided insulating pot trivet", "washable produce sling"],
    limitations: ["stretchy knits sag under heavy weight unless backed with canvas or webbing"],
    primaryFinish: "woven_fabric",
    secondaryFinish: "wood_grain",
  },
  {
    key: "slipper_rubber",
    keywords: [
      "slipper",
      "flip-flop",
      "flip flop",
      "flipflop",
      "sandal",
      "tsinelas",
      "eva",
      "foam sole",
      "rubber sole",
      "footwear",
      "crocs",
      "shoe sole",
    ],
    objectName: "Damaged Rubber Slipper",
    category: "Closed-Cell EVA Foam & Rubber Footwear",
    originalFunction: "Cushioned everyday sole with toe-post strap",
    defaultCondition: ["snapped toe strap", "intact ribbed EVA rubber sole"],
    physicalProperties: [
      "high-friction grooved tread",
      "shock-absorbing closed-cell foam",
      "waterproof & buoyant",
      "easy to carve or bevel cleanly with a craft knife",
    ],
    shapeProfile: "Contoured thick flat sole (1.5–2 cm thick) with snapped strap plugs",
    components: ["ribbed rubber footbed", "patterned outsole", "detached Y-strap", "toe-post anchor"],
    materials: ["closed-cell EVA foam / vulcanized rubber", "molded PVC strap"],
    reusableParts: [
      "thick grooved rubber sole slab",
      "firm heel wedge section",
      "flexible PVC strap strips",
    ],
    potentialFunctions: [
      "hand-carved relief printing stamp",
      "non-slip doorstop wedge & vibration pads",
      "compression-slit cable & broom grip rack",
      "cushioned desk wrist rest or sanding block",
    ],
    limitations: [
      "EVA foam melts near open flames or hot irons",
      "standard white school glue does not bond rubber—use contact cement or mechanical wood screws/twine",
    ],
    primaryFinish: "rubber",
    secondaryFinish: "wood_grain",
  },
  {
    key: "tin_can",
    keywords: ["tin can", "tin", "coffee tin", "cookie tin", "metal can", "can"],
    objectName: "Empty Metal Tin Can",
    category: "Rigid Steel Container",
    originalFunction: "Airtight pantry preservation",
    defaultCondition: ["empty", "clean rigid walls"],
    physicalProperties: [
      "rigid vertical steel wall",
      "non-flammable & heat-resistant",
      "magnetic steel body",
      "watertight base seam",
    ],
    shapeProfile: "Open-top rigid ribbed cylinder",
    components: ["rolled rim", "ribbed cylinder wall", "stamped base"],
    materials: ["tin-plated steel"],
    reusableParts: ["cylindrical steel shell", "rolled rim collar", "stamped base"],
    potentialFunctions: [
      "magnetic wall spice/tool pod",
      "punched-pattern lantern sconce",
      "gravity-fed twine dispenser",
      "cylindrical utensil caddy",
    ],
    limitations: [
      "freshly cut metal edges must be crimped flat or taped",
      "uncoated steel rusts if left standing in water",
    ],
    primaryFinish: "brushed_metal",
    secondaryFinish: "terracotta",
  },
  {
    key: "glass_jar",
    keywords: ["jar", "mason jar", "glass jar", "jam jar", "pickle jar", "glass bottle"],
    objectName: "Empty Glass Jar",
    category: "Reusable Glassware",
    originalFunction: "Sealed pantry preserve jar",
    defaultCondition: ["empty", "clean glass chamber with screw lid"],
    physicalProperties: [
      "crystal clear optical walls",
      "100% waterproof & non-porous",
      "heat tolerant",
      "threaded metal screw lid",
    ],
    shapeProfile: "Clear cylinder with threaded rim and metal lid",
    components: ["clear glass body", "threaded glass neck", "twist-off metal lid"],
    materials: ["soda-lime glass", "lacquered steel twist lid"],
    reusableParts: ["clear optical vessel", "anchored metal screw lid", "wide mouth collar"],
    potentialFunctions: [
      "under-shelf twist-lock hardware storage",
      "closed moss & fern micro-terrarium",
      "water-magnified botanical LED globe",
      "gravity-fed dry craft jar",
    ],
    limitations: [
      "never attempt standard steel-bit drilling on glass",
      "handle gently on hard stone surfaces",
    ],
    primaryFinish: "pet_plastic",
    secondaryFinish: "brushed_metal",
  },
  {
    key: "wood_crate",
    keywords: ["wood", "crate", "pallet", "plank", "board", "broomstick", "dowel", "bamboo"],
    objectName: "Reclaimed Wood Slats / Crate",
    category: "Natural Timber & Framing",
    originalFunction: "Load-bearing transport or structural framing",
    defaultCondition: ["weathered grain", "solid load-bearing slats"],
    physicalProperties: [
      "rigid structural stiffness",
      "accepts screws, glue, and sanding",
      "warm tactile grain",
    ],
    shapeProfile: "Modular rectangular slats and corner cleats",
    components: ["slat rails", "corner blocks", "base runners"],
    materials: ["pine or hardwood slats", "steel brads"],
    reusableParts: ["planed parallel slats", "corner bracing blocks", "natural frame tray"],
    potentialFunctions: [
      "cantilevered desk shelf",
      "vertical herb ladder",
      "modular pegboard caddy",
      "angled laptop & book lectern",
    ],
    limitations: [
      "splinters require 120-grit sanding",
      "unsealed timber warps in standing water",
    ],
    primaryFinish: "wood_grain",
    secondaryFinish: "brushed_metal",
  },
];

interface DirectionArchetype {
  direction: DirectionType;
  label: string;
  strategy: string;
  buildMinutesBase: number;
  costPhpBase: number;
  difficulty: DifficultyLevel;
  makeability: number;
}

const DIRECTION_ARCHETYPES: DirectionArchetype[] = [
  {
    direction: "PRACTICAL",
    label: "Workspace & Everyday Utility",
    strategy: "structural conversion",
    buildMinutesBase: 25,
    costPhpBase: 45,
    difficulty: "Beginner",
    makeability: 92,
  },
  {
    direction: "UNEXPECTED",
    label: "Botanical & Living System",
    strategy: "functional inversion",
    buildMinutesBase: 40,
    costPhpBase: 85,
    difficulty: "Intermediate",
    makeability: 84,
  },
  {
    direction: "EXPERIMENTAL",
    label: "Kinetic & Energy-Free Mechanism",
    strategy: "mechanical transformation",
    buildMinutesBase: 55,
    costPhpBase: 120,
    difficulty: "Intermediate",
    makeability: 76,
  },
];

function normalizeText(input: string): string {
  return input.toLowerCase().trim();
}

function hashSeed(text: string): number {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

function extractConditionSignals(rawText: string, defaults: string[]): string[] {
  const lower = normalizeText(rawText);
  const detected: string[] = [];
  const checks: Array<[string, string]> = [
    ["broken", "broken assembly"],
    ["bent", "bent frame"],
    ["cracked", "cracked vessel wall"],
    ["missing handle", "missing handle"],
    ["no longer spins", "non-functional motor"],
    ["worn", "surface wear"],
    ["empty", "empty hollow interior"],
    ["torn", "localized tear"],
    ["rust", "light oxidation"],
    ["old", "aged material"],
    ["unused", "surplus idle item"],
    ["scratch", "cosmetic surface scuffs"],
  ];

  for (const [needle, label] of checks) {
    if (lower.includes(needle)) {
      detected.push(label);
    }
  }
  return detected.length > 0 ? detected : defaults;
}

function cleanPhotoFileName(photoFileName?: string): string {
  if (!photoFileName) return "";
  const withoutExt = photoFileName.replace(/\.[^.]+$/, "");
  const withoutHashes = withoutExt
    .replace(/[-_][0-9a-f]{6,}$/i, "")
    .replace(/^(img|dsc|pxl|mvimg|screenshot|photo|image)[-_]?\d{4,}[-_]?/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\d{6,}\b/g, "")
    .trim();
  return withoutHashes;
}

function cleanObjectPhrase(rawText: string, photoFileName?: string): string {
  const trimmed = rawText.trim();
  if (trimmed.length > 0) {
    const firstSentence = trimmed.split(/[.!?\n]/)[0].trim();
    const cleaned = firstSentence
      .replace(/^(a|an|the|my|some|old|broken|empty|unused|worn-out)\s+/i, "")
      .trim();
    if (cleaned.length >= 3) {
      return cleaned.length > 44 ? `${cleaned.slice(0, 41)}...` : titleCase(cleaned);
    }
  }

  const cleanedPhoto = cleanPhotoFileName(photoFileName);
  if (cleanedPhoto.length >= 3) {
    return titleCase(cleanedPhoto);
  }

  return "Everyday Salvaged Object";
}

function titleCase(str: string): string {
  return str
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function inferMaterialFinish(text: string): {
  primary: PartMaterialFinish;
  secondary: PartMaterialFinish;
  materials: string[];
  properties: string[];
  reusableParts: string[];
} {
  const lower = normalizeText(text);
  if (lower.includes("wood") || lower.includes("bamboo") || lower.includes("guitar") || lower.includes("chair")) {
    return {
      primary: "wood_grain",
      secondary: "brushed_metal",
      materials: ["seasoned timber or bamboo", "metal fasteners"],
      properties: ["rigid structural grain", "sandable and drillable", "warm tactile finish"],
      reusableParts: ["load-bearing flat panels", "straight rails", "corner joinery"],
    };
  }
  if (lower.includes("metal") || lower.includes("wire") || lower.includes("steel") || lower.includes("aluminum") || lower.includes("bike") || lower.includes("bicycle")) {
    return {
      primary: "brushed_metal",
      secondary: "rubber",
      materials: ["formed steel or aluminum", "protective trim"],
      properties: ["high tensile rigidity", "heat tolerant", "bend-resistant armature"],
      reusableParts: ["tubular frame members", "mounting brackets", "rim rings"],
    };
  }
  if (lower.includes("fabric") || lower.includes("cloth") || lower.includes("bag") || lower.includes("backpack") || lower.includes("canvas")) {
    return {
      primary: "woven_fabric",
      secondary: "wood_grain",
      materials: ["heavy woven textile", "stitched webbing straps"],
      properties: ["flexible foldability", "tear-resistant weave", "lightweight suspension"],
      reusableParts: ["reinforced seams", "zippered compartments", "adjustable straps"],
    };
  }
  if (lower.includes("ceramic") || lower.includes("clay") || lower.includes("pot") || lower.includes("plate")) {
    return {
      primary: "terracotta",
      secondary: "wood_grain",
      materials: ["fired ceramic or terracotta", "natural wood collar"],
      properties: ["thermal mass", "heavy stable base", "moisture-regulating body"],
      reusableParts: ["weighted vessel shell", "flat base disc", "curved rim shards"],
    };
  }
  if (lower.includes("rubber") || lower.includes("tire") || lower.includes("tube") || lower.includes("boot")) {
    return {
      primary: "rubber",
      secondary: "brushed_metal",
      materials: ["vulcanized rubber", "reinforced tread wall"],
      properties: ["high friction grip", "waterproof", "shock absorbing"],
      reusableParts: ["elastic tension bands", "non-slip base pads", "curved bumper strips"],
    };
  }
  return {
    primary: "pet_plastic",
    secondary: "cardboard",
    materials: ["molded composite shell", "secondary structural trim"],
    properties: ["lightweight", "water-resistant exterior", "modular geometry"],
    reusableParts: ["primary outer shell", "flat mounting surface", "fastening tabs"],
  };
}

function getActiveModeText(input: SynthesisInput): string {
  if (input.mode === "photo") {
    return (input.photoNotes ?? "").trim();
  }
  if (input.mode === "sketch") {
    return (input.sketchNotes ?? "").trim();
  }
  return input.textDescription.trim();
}

export function analyzeObjectInput(input: SynthesisInput): ObjectAnalysis {
  const activeText = getActiveModeText(input);
  const cleanedFilename = input.mode === "photo" ? cleanPhotoFileName(input.photoFileName) : "";
  const combinedSource = [activeText, cleanedFilename].filter(Boolean).join(" ");

  const lower = normalizeText(combinedSource);
  const matchedProfile = OBJECT_PROFILES.find((profile) =>
    profile.keywords.some((kw) => lower.includes(kw))
  );

  const goalSummary =
    input.goal.trim() ||
    input.constraints.desiredFunction.trim() ||
    "Everyday functional second life";

  let analysisNote: string | undefined;
  if (input.mode === "photo" && !activeText) {
    analysisNote = cleanedFilename
      ? `Inferred from uploaded image (${cleanedFilename}). Add brief photo notes if you want even more tailored measurements.`
      : "Inferred in offline mode without visual pixel inspection—add brief notes about the object and material for exact tailoring.";
  } else if (input.mode === "sketch" && !activeText) {
    analysisNote =
      "Inferred from your sketch in offline mode—add a short note naming the material (e.g. wood, rubber, metal) for exact material steps.";
  }

  if (matchedProfile) {
    return {
      objectName:
        activeText.length > 0
          ? cleanObjectPhrase(activeText, cleanedFilename)
          : cleanedFilename.length >= 3
            ? titleCase(cleanedFilename)
            : matchedProfile.objectName,
      category: matchedProfile.category,
      originalFunction: matchedProfile.originalFunction,
      condition: extractConditionSignals(combinedSource, matchedProfile.defaultCondition),
      physicalProperties: matchedProfile.physicalProperties,
      shapeProfile: matchedProfile.shapeProfile,
      components: matchedProfile.components,
      materials: matchedProfile.materials,
      reusableParts: matchedProfile.reusableParts,
      potentialFunctions: matchedProfile.potentialFunctions,
      limitations: matchedProfile.limitations,
      goalSummary,
      analysisNote,
    };
  }

  const inferred = inferMaterialFinish(combinedSource);
  const fallbackLabel =
    activeText.length >= 3
      ? cleanObjectPhrase(activeText, cleanedFilename)
      : cleanedFilename.length >= 3
        ? titleCase(cleanedFilename)
        : input.mode === "photo"
          ? "Photographed Salvaged Object"
          : input.mode === "sketch"
            ? "Sketched Salvaged Object"
            : "Everyday Salvaged Object";

  return {
    objectName: fallbackLabel,
    category: "Salvaged Everyday Object",
    originalFunction: `Original household utility of ${fallbackLabel.toLowerCase()}`,
    condition: extractConditionSignals(combinedSource, [
      "unused or partially worn",
      "reusable core structure",
    ]),
    physicalProperties: inferred.properties,
    shapeProfile: "Composite functional geometry with separable housing and mounts",
    components: ["outer body", "structural frame", "contact base", "fastening edges"],
    materials: inferred.materials,
    reusableParts: inferred.reusableParts,
    potentialFunctions: [
      "modular storage & sorting",
      "botanical support or shelter",
      "passive ergonomic elevation",
    ],
    limitations: [
      "clean surface thoroughly and smooth any rough fracture edges before assembly",
    ],
    goalSummary,
    analysisNote,
  };
}

interface BlueprintRecipe {
  name: string;
  category: string;
  oneLineDescription: string;
  purpose: string;
  originalObjectContribution: string;
  materialsReused: string[];
  additionalMaterials: string[];
  requiredTools: string[];
  functionalityExplanation: string;
  dimensions: string;
  sustainabilityValue: string;
  safetyConsiderations: string[];
  testingValidation: string[];
  possibleImprovements: string[];
  steps: Array<{
    title: string;
    instruction: string;
    actionType: StepActionType;
    tip: string;
    diagramCaption: string;
  }>;
  assemblyParts: AssemblyPart3D[];
}

function buildCuratedRecipes(
  profileKey: string,
  analysis: ObjectAnalysis,
  goalText: string,
  batchSeed: number
): Record<DirectionType, BlueprintRecipe> {
  const goalLower = normalizeText(goalText);
  const forPlants = goalLower.includes("plant") || goalLower.includes("garden");
  const forDesk = goalLower.includes("desk") || goalLower.includes("student") || goalLower.includes("work");
  const forSell = goalLower.includes("sell") || goalLower.includes("market");

  if (profileKey === "umbrella" && batchSeed % 2 === 0) {
    return {
      PRACTICAL: {
        name: "Tensioned Ripstop Gear & Desk Hanging Caddy",
        category: "Modular Storage",
        oneLineDescription:
          "Converts the waterproof umbrella canopy and intact steel ribs into a multi-pocket wall or desk-edge hanging organizer.",
        purpose: forDesk
          ? "Keeps notebooks, cables, headphones, and stationery visible and off a crowded desk."
          : forPlants
            ? "Stores pruning shears, seed packets, plant ties, and misting bottles neatly beside your garden bench."
            : "Turns curved waterproof fabric panels into structured vertical pockets for entryways or workshops.",
        originalObjectContribution:
          "The curved gores already have reinforced radial seams that naturally cup items, while the handle forms a ready-made hanging hook.",
        materialsReused: [
          "Waterproof umbrella canopy gores",
          "2 straight spring-steel rib rods",
          "Original curved handle hook",
        ],
        additionalMaterials: [
          "Heavy cotton thread or paracord (2 m)",
          "Wooden dowel crossbar (35 cm)",
          "2 brass eyelets or snap buttons",
        ],
        requiredTools: ["Fabric scissors", "Sewing needle or awl", "Ruler & chalk marker"],
        functionalityExplanation:
          "By tensioning two canopy triangles across a salvaged dowel and threading two straight umbrella ribs horizontally as stiffeners, the fabric forms deep gusseted pockets that hang cleanly from the original umbrella handle.",
        dimensions: "38 cm W × 52 cm H × 9 cm D",
        sustainabilityValue:
          "Diverts coated synthetic fabric—which rarely degrades in landfills—into a wipe-clean organizer lasting years.",
        safetyConsiderations: [
          "File or cap cut ends of steel umbrella ribs with heat-shrink or tape so tips cannot poke through fabric.",
          "Check sewing tension before loading heavy tools.",
        ],
        testingValidation: [
          "Load each pocket with 500 g of notebooks or hand tools for 10 minutes to verify seam hold.",
          "Splash-test outer pocket to confirm water resistance near entryways.",
        ],
        possibleImprovements: [
          "Add a transparent card window from scrap packaging for labeling.",
          "Sew a loop at the bottom hem to clip keys.",
        ],
        steps: [
          {
            title: "Strip canopy cleanly from bent frame",
            instruction:
              "Snip the small tacking threads holding the canopy to each metal rib tip and slide the central ferrule collar off.",
            actionType: "cut",
            tip: "Work slowly at the rib tips so you keep the reinforced corner tabs intact.",
            diagramCaption: "Release radial stitches and remove canopy intact",
          },
          {
            title: "Measure & trim three graduated pocket panels",
            instruction:
              "Fold two adjacent gores into a 36 cm wide rectangle and mark two overlapping horizontal pocket bands at 14 cm and 24 cm.",
            actionType: "measure",
            tip: "Use the original factory hem as the top pocket edge for zero fraying.",
            diagramCaption: "Mark 14 cm and 24 cm pocket tiers on canopy",
          },
          {
            title: "Insert steel rib stiffeners into top hems",
            instruction:
              "Slide two straight salvaged steel ribs through the folded top pocket channels and cap both ends with folded tape.",
            actionType: "thread",
            tip: "This stops the pockets from sagging forward when loaded.",
            diagramCaption: "Thread steel ribs horizontally as rigid lips",
          },
          {
            title: "Stitch vertical divider channels",
            instruction:
              "Backstitch two vertical lines down the pocket face to create three sized compartments for pens, cables, and small tools.",
            actionType: "join",
            tip: "Double-knot at the top lip where stress concentrates.",
            diagramCaption: "Stitch vertical dividers into pocket body",
          },
          {
            title: "Mount dowel & original umbrella handle",
            instruction:
              "Loop the top sleeve over the wooden dowel and tie paracord from both dowel ends up to the original umbrella handle hook.",
            actionType: "mount",
            tip: "Hang over a closet rod, desk clamp, or wall peg.",
            diagramCaption: "Suspend dowel cradle from hooked handle",
          },
        ],
        assemblyParts: [
          {
            id: "p1",
            label: "Hooked Umbrella Handle",
            shape: "ring",
            material: "wood_grain",
            position: [0, 1.45, 0],
            scale: [0.32, 0.32, 0.14],
            colorHex: "#7A5238",
            calloutIndex: 1,
            description: "Original curved handle repurposed as suspension hook",
          },
          {
            id: "p2",
            label: "Dowel Crossbar",
            shape: "rod",
            material: "wood_grain",
            position: [0, 0.95, 0],
            scale: [1.5, 0.12, 0.12],
            colorHex: "#B58A62",
            calloutIndex: 2,
            description: "Distributes load evenly across the fabric width",
          },
          {
            id: "p3",
            label: "Ripstop Canopy Backplate",
            shape: "panel",
            material: "woven_fabric",
            position: [0, 0.15, -0.06],
            scale: [1.3, 1.45, 0.08],
            colorHex: "#5B6D52",
            calloutIndex: 3,
            description: "Waterproof umbrella gores forming main back panel",
          },
          {
            id: "p4",
            label: "Rib-Stiffened Pocket Tier",
            shape: "box",
            material: "woven_fabric",
            position: [0, -0.22, 0.08],
            scale: [1.22, 0.62, 0.18],
            colorHex: "#D98A6C",
            calloutIndex: 4,
            description: "Steel-rib reinforced gusseted pocket compartments",
          },
        ],
      },
      UNEXPECTED: {
        name: "Micro-Greenhouse Dome & Rain Catcher Cloche",
        category: "Urban Gardening",
        oneLineDescription:
          "Re-tensions the waterproof canopy over bent ribs to form a translucent frost-shield and mist-retaining plant dome.",
        purpose:
          "Protects seedlings from heavy downpours, wind gusts, and nocturnal chill on balconies or small garden beds.",
        originalObjectContribution:
          "Uses the umbrella's curved rib geometry and water-shedding textile as a collapsible tensioned mini-greenhouse.",
        materialsReused: [
          "Umbrella waterproof fabric dome",
          "4 curved spring-steel ribs",
          "Central ferrule cap",
        ],
        additionalMaterials: [
          "4 bamboo stakes or thick wire pegs",
          "Clear scrap plastic strip (optional light window)",
          "Twine (1.5 m)",
        ],
        requiredTools: ["Pliers", "Scissors", "Garden trowel or mallet"],
        functionalityExplanation:
          "Shortening four paired ribs into arched hoops creates a low-profile geodesic cloche anchored into soil or a planter rim, trapping daytime warmth while shedding excess storm water.",
        dimensions: "54 cm Diameter × 34 cm H",
        sustainabilityValue:
          "Eliminates single-use plastic seedling covers by transforming broken storm gear into reusable season-extension hardware.",
        safetyConsiderations: [
          "Wear eye protection when bending or snipping spring-steel ribs with pliers.",
          "Push sharp wire ends at least 8 cm deep into soil or wooden planter corners.",
        ],
        testingValidation: [
          "Mist water over the canopy to ensure droplets roll cleanly down the outer skirt rather than pooling.",
          "Check interior temperature vs. ambient air after 1 hour of morning sun.",
        ],
        possibleImprovements: [
          "Cut a roll-up ventilation flap with a wooden toggle for hot afternoons.",
          "Attach a small saucer under the rim to collect runoff condensation.",
        ],
        steps: [
          {
            title: "Detach broken hub & straighten 4 ribs",
            instruction:
              "Use pliers to detach four unbroken ribs from the damaged slider hub and inspect for sharp burrs.",
            actionType: "puncture",
            tip: "Pick opposing rib pairs so arc tension stays balanced.",
            diagramCaption: "Select 4 unbroken ribs with pliers",
          },
          {
            title: "Form crossing arch hoops",
            instruction:
              "Cross two pairs of ribs at their center and lash the apex firmly with twine to create an X-shaped dome skeleton.",
            actionType: "join",
            tip: "Keep the arch span matched to your planter or bed width.",
            diagramCaption: "Lash crossing rib arches at apex",
          },
          {
            title: "Trim canopy skirt for ground ventilation",
            instruction:
              "Measure 32 cm down from the umbrella peak and trim excess frayed edge, leaving 4 tie tabs along the perimeter.",
            actionType: "measure",
            tip: "Leave a 3 cm breathable gap near the soil line to prevent mold.",
            diagramCaption: "Measure 32 cm dome skirt and tie tabs",
          },
          {
            title: "Drape & tie canopy onto arch frame",
            instruction:
              "Fit the original ferrule cap over the crossed apex and tie the canopy perimeter tabs tightly to the four arch legs.",
            actionType: "mount",
            tip: "Rotate seams toward the prevailing wind direction.",
            diagramCaption: "Mount canopy dome over arched ribs",
          },
          {
            title: "Anchor into planter & mist-test",
            instruction:
              "Press the four arch tips into soil or zip-tie to planter corners and pour water gently over the crown to verify runoff.",
            actionType: "test",
            tip: "Lift one side slightly on sunny afternoons for airflow.",
            diagramCaption: "Anchor dome and test rain runoff",
          },
        ],
        assemblyParts: [
          {
            id: "p1",
            label: "Terracotta Planter Base",
            shape: "cylinder",
            material: "terracotta",
            position: [0, -0.55, 0],
            scale: [1.3, 0.55, 1.3],
            colorHex: "#C97A57",
            calloutIndex: 1,
            description: "Planter rim or garden soil bed anchoring the arch legs",
          },
          {
            id: "p2",
            label: "Crossed Steel Rib Arches",
            shape: "ring",
            material: "brushed_metal",
            position: [0, 0.12, 0],
            scale: [1.22, 0.9, 1.22],
            colorHex: "#8B9094",
            calloutIndex: 2,
            description: "Spring-steel umbrella ribs forming geodesic hoops",
          },
          {
            id: "p3",
            label: "Tensioned Canopy Dome",
            shape: "dome",
            material: "woven_fabric",
            position: [0, 0.28, 0],
            scale: [1.26, 0.85, 1.26],
            colorHex: "#7C8B6A",
            calloutIndex: 3,
            description: "Waterproof umbrella fabric shedding heavy rain",
          },
          {
            id: "p4",
            label: "Apex Ferrule Vent Cap",
            shape: "cone",
            material: "wood_grain",
            position: [0, 0.78, 0],
            scale: [0.24, 0.25, 0.24],
            colorHex: "#4A3528",
            calloutIndex: 4,
            description: "Original umbrella ferrule sealing the top junction",
          },
        ],
      },
      EXPERIMENTAL: {
        name: "Telescoping Studio Diffuser & Overhead Boom Arm",
        category: "Creative Studio Hardware",
        oneLineDescription:
          "Repurposes the telescoping shaft and ribbed canopy into an energy-free tabletop softbox reflector and overhead clamp boom.",
        purpose:
          "Softens harsh desk lamps or window glare for sketching, product photography, or reading without glare.",
        originalObjectContribution:
          "Takes advantage of the umbrella's parabolic curve and collapsible telescoping tube—the exact geometry used in photography modifiers.",
        materialsReused: [
          "Telescoping central aluminum shaft",
          "Intact umbrella rib spider",
          "Canopy panels (lined or plain)",
        ],
        additionalMaterials: [
          "White baking parchment or scrap foil liner",
          "C-clamp or heavy mug counterweight",
          "Rubber band or hose clamp",
        ],
        requiredTools: ["Scissors", "Pliers", "Double-sided tape or fabric glue"],
        functionalityExplanation:
          "Clamping the shaft to a desk edge positions the parabolic canopy above a workspace. Lining the underside with matte white parchment turns any directional lamp into soft, shadowless studio light.",
        dimensions: "65 cm Boom Reach × 48 cm Parabolic Shade",
        sustainabilityValue:
          "Replaces commercial $40+ studio light modifiers using an object discarded purely for one snapped hinge.",
        safetyConsiderations: [
          "Keep fabric and paper liners at least 20 cm clear of hot incandescent bulbs; use cool LED lamps only.",
          "Counterweight the clamp base before extending the boom fully.",
        ],
        testingValidation: [
          "Extend shaft to 55 cm and verify tilt lock holds without drooping.",
          "Shine an LED desk lamp into the parabolic interior and check shadow softness on paper.",
        ],
        possibleImprovements: [
          "Add an aluminum foil bounce strip on the upper rim for extra fill light.",
          "Sew a slip-on unbleached muslin diffuser cover across the front face.",
        ],
        steps: [
          {
            title: "Isolate telescoping shaft & intact ribs",
            instruction:
              "Remove broken short struts while preserving the main telescoping pole and at least 6 evenly spaced canopy ribs.",
            actionType: "cut",
            tip: "Bind any loose slider collar with a strip of rubber inner tube for friction.",
            diagramCaption: "Prepare telescoping pole and 6-rib spider",
          },
          {
            title: "Cut parabolic white diffuser liner",
            instruction:
              "Trace two canopy gores onto matte white paper or clean white fabric and trim 1 cm inside the rib pockets.",
            actionType: "measure",
            tip: "Matte white gives soft neutral bounce; foil creates crisp directional fill.",
            diagramCaption: "Trace triangular reflector panels",
          },
          {
            title: "Bond reflector liner inside canopy",
            instruction:
              "Attach the white liner panels inside the canopy ribs with small strips of double-sided tape along the seams.",
            actionType: "finish",
            tip: "Leave small slack pockets so the umbrella can still fold flat for storage.",
            diagramCaption: "Attach matte diffuser liner inside dome",
          },
          {
            title: "Fit desk clamp collar onto handle",
            instruction:
              "Wrap a grip band around the umbrella handle and lock it into a desk C-clamp or weighted base socket.",
            actionType: "mount",
            tip: "Angle the boom 35 degrees above your drawing or photo surface.",
            diagramCaption: "Clamp handle boom to desk edge",
          },
          {
            title: "Test LED bounce & lock angle",
            instruction:
              "Aim a cool LED lamp into the concave reflector and adjust shaft extension until workspace shadows soften evenly.",
            actionType: "test",
            tip: "Verify lamp clearance remains at least 20 cm from fabric.",
            diagramCaption: "Calibrate parabolic bounce angle",
          },
        ],
        assemblyParts: [
          {
            id: "p1",
            label: "Weighted Desk Clamp Base",
            shape: "box",
            material: "brushed_metal",
            position: [-0.6, -0.55, 0],
            scale: [0.55, 0.35, 0.55],
            colorHex: "#4A4E54",
            calloutIndex: 1,
            description: "Anchors the telescoping boom to a tabletop",
          },
          {
            id: "p2",
            label: "Telescoping Aluminum Shaft",
            shape: "rod",
            material: "brushed_metal",
            position: [-0.25, 0.15, 0],
            scale: [0.12, 1.45, 0.12],
            rotation: [0, 0, -0.35],
            colorHex: "#A4ABB0",
            calloutIndex: 2,
            description: "Adjustable height & extension arm",
          },
          {
            id: "p3",
            label: "Parabolic Reflector Canopy",
            shape: "dome",
            material: "woven_fabric",
            position: [0.25, 0.62, 0],
            scale: [1.15, 0.72, 1.15],
            colorHex: "#EFE9DF",
            calloutIndex: 3,
            description: "Lined umbrella dome bouncing soft studio light",
          },
          {
            id: "p4",
            label: "Rib Spider Tension Hub",
            shape: "cylinder",
            material: "terracotta",
            position: [0.25, 0.42, 0],
            scale: [0.25, 0.18, 0.25],
            colorHex: "#D98A6C",
            calloutIndex: 4,
            description: "Locks parabolic arc curvature cleanly",
          },
        ],
      },
    };
  }

  if (profileKey === "bottle_plastic" && batchSeed % 2 === 0) {
    return {
      PRACTICAL: {
        name: "Gravity-Fed Modular Desk & Pantry Dispenser",
        category: "Workspace & Pantry Organization",
        oneLineDescription:
          "Stacks precision-cut PET bottle collars into interlocking clear silos with flip-cap pouring nozzles.",
        purpose: forSell
          ? "Creates uniform zero-waste refill canisters or craft bead dispensers ideal for local craft markets."
          : "Organizes rubber bands, paperclips, dry grains, or screws while keeping contents 100% visible.",
        originalObjectContribution:
          "Uses the bottle's built-in screw funnel neck as a controlled pour spout and the rigid ribbed base as a stable foot.",
        materialsReused: [
          "2 clean PET plastic bottles (500 ml–1.5 L)",
          "Original threaded screw caps",
        ],
        additionalMaterials: [
          "Cardboard or scrap wood riser strip",
          "Masking tape for cutting guide",
          "Washi or kraft label strip",
        ],
        requiredTools: ["Craft knife or sharp scissors", "Fine marker", "Warm iron or sandpaper (edge smoothing)"],
        functionalityExplanation:
          "Trimming the middle cylinder and nesting the tapered funnel shoulder inverted inside a matching bottle base turns two bottles into a stackable, dust-sealed storage silo with a precision pour cap.",
        dimensions: "9 cm Diameter × 21 cm H",
        sustainabilityValue:
          "Extends single-use PET lifecycle by replacing bought acrylic organizer jars.",
        safetyConsiderations: [
          "Always cut away from your body on a cutting mat.",
          "Smooth cut plastic rims with fine sandpaper or warm parchment so fingers never catch.",
        ],
        testingValidation: [
          "Fill with dry lentils or paperclips and shake gently to verify friction fit between stacked collars.",
          "Test cap pour speed for single-handed dispensing.",
        ],
        possibleImprovements: [
          "Wrap a strip of cork or kraft paper around the middle seam for warm desk aesthetics.",
          "Add a magnetic strip to the rear wall for refrigerator mounting.",
        ],
        steps: [
          {
            title: "Wash, dry & wrap cutting tape guide",
            instruction:
              "Remove labels with warm soapy water and wrap a level ring of masking tape 11 cm up from the bottle base.",
            actionType: "measure",
            tip: "Tape gives a crisp straight guide line for your blade.",
            diagramCaption: "Mark straight 11 cm perimeter line with tape",
          },
          {
            title: "Trim base cup & funnel shoulder cleanly",
            instruction:
              "Pierce a starter slit with a craft knife along the tape edge and cut cleanly all the way around with sharp scissors.",
            actionType: "cut",
            tip: "Make a second 1 cm vertical relief notch if nesting tight diameters.",
            diagramCaption: "Cut clean horizontal ring along tape guide",
          },
          {
            title: "Smooth cut plastic rim",
            instruction:
              "Lightly kiss the freshly cut PET rim with 220-grit sandpaper or press briefly against warm parchment over a flat surface to curl the sharp edge.",
            actionType: "finish",
            tip: "Never overheat—two seconds of warmth rounds the edge smoothly.",
            diagramCaption: "De-burr and round cut PET rim",
          },
          {
            title: "Nest funnel collar & mount base tray",
            instruction:
              "Press the upper funnel section into the base cup for an airtight friction seam and seat both units onto a cardboard or wood desk tray.",
            actionType: "join",
            tip: "Keep caps accessible on top or invert as a funnel stand.",
            diagramCaption: "Snap PET collar sections into slotted tray",
          },
          {
            title: "Label & dispense-test contents",
            instruction:
              "Add a kraft strip label on the base collar, load dry supplies, and verify smooth cap opening and closing.",
            actionType: "test",
            tip: "Keep heavy metal fasteners in the lower tier for stability.",
            diagramCaption: "Load dry goods and test screw-cap flow",
          },
        ],
        assemblyParts: [
          {
            id: "p1",
            label: "Kraft Base Tray",
            shape: "box",
            material: "cardboard",
            position: [0, -0.78, 0],
            scale: [1.5, 0.18, 0.85],
            colorHex: "#C9A87E",
            calloutIndex: 1,
            description: "Stabilizes twin PET canisters upright on a desk",
          },
          {
            id: "p2",
            label: "Lower PET Reservoir Cup",
            shape: "cylinder",
            material: "pet_plastic",
            position: [-0.36, -0.15, 0],
            scale: [0.58, 1.05, 0.58],
            colorHex: "#D9ECE8",
            calloutIndex: 2,
            description: "Translucent bottle base storing visible small parts",
          },
          {
            id: "p3",
            label: "Inverted Funnel Collar",
            shape: "cone",
            material: "pet_plastic",
            position: [0.36, 0.15, 0],
            scale: [0.58, 0.72, 0.58],
            colorHex: "#CFE5E0",
            calloutIndex: 3,
            description: "Tapered bottle shoulder directing smooth pour flow",
          },
          {
            id: "p4",
            label: "Threaded Dispenser Cap",
            shape: "cylinder",
            material: "terracotta",
            position: [0.36, 0.6, 0],
            scale: [0.22, 0.18, 0.22],
            colorHex: "#D98A6C",
            calloutIndex: 4,
            description: "Original HDPE screw cap sealing moisture out",
          },
        ],
      },
      UNEXPECTED: {
        name: "Capillary Self-Watering Terracotta-Style Planter",
        category: "Smart Plant Care",
        oneLineDescription:
          "Turns a split PET bottle and cotton shoelace into a 14-day passive capillary irrigation vessel for herbs and desk plants.",
        purpose:
          "Keeps basil, pothos, or desk greens evenly hydrated without daily watering or electricity.",
        originalObjectContribution:
          "Exploits the watertight lower chamber as a visible water gauge and the inverted neck as a drainage funnel.",
        materialsReused: [
          "1 clear or green 1.5 L PET bottle",
          "Bottle neck funnel cone",
        ],
        additionalMaterials: [
          "100% cotton cord or scrap cotton strip (25 cm)",
          "Potting soil & herb cutting",
          "Small pebbles for drainage",
        ],
        requiredTools: ["Scissors or craft knife", "Pushpin or nail (for air vents)", "Marker"],
        functionalityExplanation:
          "A cotton wick passes through the bottle neck from the lower reservoir into the upper soil cone. Capillary action draws water upward strictly as soil dries, preventing root rot.",
        dimensions: "10 cm Diameter × 22 cm H",
        sustainabilityValue:
          "Eliminates plastic nursery pots and cuts household plant water waste by up to 50%.",
        safetyConsiderations: [
          "Smooth the cut bottle rim before packing soil by hand.",
          "Ensure two pin-sized air vents exist just below the upper rim so suction never locks water flow.",
        ],
        testingValidation: [
          "Pre-wet the cotton wick and confirm soil surface dampens within 30 minutes.",
          "Check water level drop after 48 hours to calibrate refill cadence.",
        ],
        possibleImprovements: [
          "Wrap the lower reservoir in removable kraft paper sleeve to block sunlight and prevent algae.",
          "Paint geometric ochre stripes on the upper collar.",
        ],
        steps: [
          {
            title: "Mark & slice bottle at upper third",
            instruction:
              "Measure 11 cm down from the bottle cap and slice horizontally around the cylinder into an upper funnel and lower reservoir.",
            actionType: "cut",
            tip: "A serrated bread knife or sharp craft blade starts cleanly.",
            diagramCaption: "Divide PET bottle into top funnel & base tank",
          },
          {
            title: "Puncture 2 micro air-relief vents",
            instruction:
              "Poke two tiny 2 mm vent holes 1.5 cm below the reservoir rim and optionally one hole in the cap.",
            actionType: "puncture",
            tip: "Vent holes equalize air pressure so water wicks consistently.",
            diagramCaption: "Pierce dual ventilation pinholes on collar",
          },
          {
            title: "Thread absorbent cotton capillary wick",
            instruction:
              "Fold a 25 cm cotton shoelace or T-shirt strip through the bottle neck, leaving 10 cm coiled in the upper cone and 12 cm dangling down.",
            actionType: "thread",
            tip: "Avoid synthetic nylon—pure cotton absorbs water reliably.",
            diagramCaption: "Thread cotton wick through inverted neck",
          },
          {
            title: "Seat inverted funnel & add soil core",
            instruction:
              "Fill the lower cup 60% with water, invert the top funnel inside it, add pebbles over the neck, and pack moistened potting soil around the wick.",
            actionType: "join",
            tip: "Leave a 1 cm air gap between water surface and bottle neck.",
            diagramCaption: "Seat soil cone above lower water tank",
          },
          {
            title: "Transplant herb & test capillary draw",
            instruction:
              "Plant your cutting into the soil crown and verify the cotton tail remains submerged while top soil stays lightly damp.",
            actionType: "test",
            tip: "Refill reservoir every 10–14 days through the top edge.",
            diagramCaption: "Verify capillary moisture transfer to soil",
          },
        ],
        assemblyParts: [
          {
            id: "p1",
            label: "Lower Water Reservoir",
            shape: "cylinder",
            material: "pet_plastic",
            position: [0, -0.48, 0],
            scale: [0.88, 0.92, 0.88],
            colorHex: "#B7DFD8",
            calloutIndex: 1,
            description: "Visible lower tank holding 14-day water supply",
          },
          {
            id: "p2",
            label: "Cotton Capillary Wick",
            shape: "rod",
            material: "woven_fabric",
            position: [0, -0.15, 0],
            scale: [0.1, 0.85, 0.1],
            colorHex: "#F2EADF",
            calloutIndex: 2,
            description: "Draws moisture upward passively into root zone",
          },
          {
            id: "p3",
            label: "Inverted Soil Funnel",
            shape: "cone",
            material: "terracotta",
            position: [0, 0.24, 0],
            scale: [0.84, 0.72, 0.84],
            colorHex: "#8C5D42",
            calloutIndex: 3,
            description: "Inverted bottle shoulder cradling aerated soil",
          },
          {
            id: "p4",
            label: "Botanical Canopy Crown",
            shape: "dome",
            material: "woven_fabric",
            position: [0, 0.72, 0],
            scale: [0.76, 0.52, 0.76],
            colorHex: "#7C8B6A",
            calloutIndex: 4,
            description: "Thriving desk herb or trailing foliage",
          },
        ],
      },
      EXPERIMENTAL: {
        name: "Fresnel Solar Water & Desk Light Diffuser Lantern",
        category: "Off-Grid Lighting & Optics",
        oneLineDescription:
          "Combines ribbed PET bottle refraction with a cardboard collar to amplify a tiny pocket flashlight or sunlight into warm 360-degree room glow.",
        purpose:
          "Turns a harsh pinpoint phone torch or solar garden puck into soft ambient camping, emergency, or desk illumination.",
        originalObjectContribution:
          "Uses water-filled or frosted PET refraction rings to scatter directional beams omnidirectionally.",
        materialsReused: [
          "1 clear textured PET bottle",
          "Original bottle cap",
        ],
        additionalMaterials: [
          "Corrugated cardboard base ring",
          "Water + 1 drop soap (or fine sandpaper for dry frost)",
          "Rechargeable LED puck or phone flashlight",
        ],
        requiredTools: ["Scissors", "Sandpaper (180-grit)", "Ruler"],
        functionalityExplanation:
          "Sanding the outer PET surface (or filling with lightly milky water) creates millions of micro-facets that scatter concentrated vertical LED photons evenly out through the ribbed walls, multiplying usable area light.",
        dimensions: "9.5 cm Diameter × 24 cm H",
        sustainabilityValue:
          "Replaces battery-wasting decorative lamps and builds an emergency blackout lantern from trash.",
        safetyConsiderations: [
          "Use cool LED light sources only—never place open flames or candles near plastic.",
          "If using water-filled refraction mode, keep electronics below a sealed watertight collar.",
        ],
        testingValidation: [
          "Place an LED torch inside the cardboard base dock and compare beam spread against bare torch light in a dim room.",
          "Test tipping stability on uneven surfaces.",
        ],
        possibleImprovements: [
          "Add a warm golden parchment insert inside the lid for sunset-amber color temperature.",
          "Tie a twine bail handle around the neck for tent hanging.",
        ],
        steps: [
          {
            title: "Frost bottle barrel or prep water lens",
            instruction:
              "Sand the outer cylinder evenly in circular motions with 180-grit sandpaper until the clear PET turns satin-frosted.",
            actionType: "finish",
            tip: "Dry sanding gives a permanent warm matte glow with zero leak risk.",
            diagramCaption: "Frost PET body evenly for omnidirectional scatter",
          },
          {
            title: "Cut lower optical entry ring",
            instruction:
              "Trim the bottom 2 cm of the bottle cleanly so the LED puck or phone sits flush inside a recessed base collar.",
            actionType: "cut",
            tip: "Save the cut base ring as a top handle cap if desired.",
            diagramCaption: "Open base aperture for LED light dock",
          },
          {
            title: "Build slotted cardboard light plinth",
            instruction:
              "Fold a 4 cm tall corrugated ring notched to cradle the bottle rim above a recessed LED cradle.",
            actionType: "fold",
            tip: "Line the bottom inside of the plinth with shiny foil from a snack wrapper for +30% brightness.",
            diagramCaption: "Fold notched cardboard plinth with foil bounce",
          },
          {
            title: "Seat lantern & twist top reflector",
            instruction:
              "Press the frosted bottle onto the plinth, line the inside of the screw cap with white paper, and screw it shut.",
            actionType: "mount",
            tip: "White cap lining bounces upward stray light back down.",
            diagramCaption: "Lock frosted dome onto notched base plinth",
          },
          {
            title: "Dim-room brightness & stability test",
            instruction:
              "Switch on the LED puck inside the dock and verify uniform 360-degree glow without harsh glare.",
            actionType: "test",
            tip: "Works wonderfully as a warm bedside nightlight.",
            diagramCaption: "Verify 360-degree diffused optical output",
          },
        ],
        assemblyParts: [
          {
            id: "p1",
            label: "Notched Cardboard Plinth",
            shape: "cylinder",
            material: "cardboard",
            position: [0, -0.68, 0],
            scale: [1.05, 0.34, 1.05],
            colorHex: "#C7A67B",
            calloutIndex: 1,
            description: "Elevates light source & anchors bottle collar",
          },
          {
            id: "p2",
            label: "LED Optical Cradle",
            shape: "cylinder",
            material: "brushed_metal",
            position: [0, -0.48, 0],
            scale: [0.5, 0.14, 0.5],
            colorHex: "#E0A952",
            calloutIndex: 2,
            description: "Foil-lined emitter recess projecting upward",
          },
          {
            id: "p3",
            label: "Frosted PET Diffuser Column",
            shape: "cylinder",
            material: "pet_plastic",
            position: [0, 0.15, 0],
            scale: [0.85, 1.15, 0.85],
            colorHex: "#F4EFE4",
            calloutIndex: 3,
            description: "Micro-sanded bottle barrel scattering soft light",
          },
          {
            id: "p4",
            label: "Reflective Cap Crown",
            shape: "cone",
            material: "terracotta",
            position: [0, 0.82, 0],
            scale: [0.55, 0.28, 0.55],
            colorHex: "#D98A6C",
            calloutIndex: 4,
            description: "Bounces stray vertical rays down across the desk",
          },
        ],
      },
    };
  }

  if (profileKey === "slipper_rubber") {
    return {
      PRACTICAL: {
        name: "Ribbed EVA Doorstop Wedge & Appliance Anti-Vibration Kit",
        category: "Home Hardware & Ergonomics",
        oneLineDescription:
          "Carves the thick closed-cell rubber sole into a high-grip ribbed doorstop wedge plus 4 shock-absorbing chair or appliance foot pads.",
        purpose: forDesk
          ? "Stops desk chairs, speakers, or table fans from rattling and scratching smooth floors."
          : "Holds heavy interior doors open silently while cushioning washing machines, stools, or furniture legs.",
        originalObjectContribution:
          "Reuses the tapered heel height, grooved non-slip footbed tread, and detached strap loop as a ready-to-pull wedge handle.",
        materialsReused: [
          "Thick EVA rubber heel & midfoot sole",
          "Broken strap stub (pull-tab loop)",
        ],
        additionalMaterials: [
          "Contact cement or double-sided carpet tape (optional)",
          "Fine chalk or pen for cut lines",
        ],
        requiredTools: ["Sharp utility knife or box cutter", "Metal ruler", "120-grit sandpaper"],
        functionalityExplanation:
          "Slicing the heel section at a gradual 12-degree taper turns the compressible ribbed outsole tread into a self-wedging doorstop that grips tile and wood without scuffing; the remaining forefoot yields four circular damping pads.",
        dimensions: "14 cm L × 6.5 cm W × 2.2 cm H",
        sustainabilityValue:
          "Keeps non-biodegradable EVA footwear foam out of landfills by turning it into durable hardware cushions.",
        safetyConsiderations: [
          "Always slice rubber against a thick cardboard cutting mat using controlled shallow passes—never force a dull blade.",
          "Keep fingers behind the metal straightedge.",
        ],
        testingValidation: [
          "Slide wedge beneath a swinging door and push gently to confirm non-slip floor grip.",
          "Place four cut pads beneath a vibrating desk fan or stool to test rattle reduction.",
        ],
        possibleImprovements: [
          "Loop paracord through the original toe-post hole so the doorstop hangs on the doorknob when unused.",
          "Stack two heel halves with contact cement for extra-tall door gaps.",
        ],
        steps: [
          {
            title: "Wash sole & pull out loose strap stubs",
            instruction:
              "Scrub grit off the outsole grooves with soapy water, dry completely, and pull out the snapped toe-post plug.",
            actionType: "finish",
            tip: "Clean rubber slices much more smoothly and preserves blade sharpness.",
            diagramCaption: "Clean grooved rubber sole and remove snapped straps",
          },
          {
            title: "Measure 12-degree wedge & 4 foot pads",
            instruction:
              "Mark a 13 cm tapered wedge block across the thick heel zone and trace four 4 cm circles on the flat forefoot.",
            actionType: "measure",
            tip: "Keep the ribbed footbed facing up so the wedge grips both floor and door bottom.",
            diagramCaption: "Mark beveled doorstop wedge and circular pads",
          },
          {
            title: "Slice beveled wedge & pads in shallow passes",
            instruction:
              "Using a metal ruler guide, draw a sharp utility knife in 3–4 light passes to bevel the wedge ramp cleanly and cut out the pads.",
            actionType: "cut",
            tip: "Dab a drop of soapy water on the knife blade to cut EVA foam effortlessly.",
            diagramCaption: "Slice clean 12-degree ramp and damping pads",
          },
          {
            title: "Thread pull-loop cord through strap hole",
            instruction:
              "Thread a short 12 cm twine loop or reused strap strip through the rear strap socket and knot it inside the underside recess.",
            actionType: "thread",
            tip: "Makes pulling the wedged doorstop out effortless without bending low.",
            diagramCaption: "Fit pull-tab loop into rear sole hole",
          },
          {
            title: "Test floor grip under door & furniture",
            instruction:
              "Wedge the ribbed slope under an open door and seat the 4 pads under chair or speaker feet to verify zero slip.",
            actionType: "test",
            tip: "Sand bottom slightly with coarse grit if floors are glossy marble.",
            diagramCaption: "Verify non-slip doorstop wedge and pad grip",
          },
        ],
        assemblyParts: [
          {
            id: "p1",
            label: "Beveled EVA Doorstop Wedge",
            shape: "cone",
            material: "rubber",
            position: [-0.25, -0.25, 0],
            scale: [1.15, 0.55, 0.72],
            colorHex: "#2E6A85",
            calloutIndex: 1,
            description: "Ribbed rubber wedge sliced from thick heel section",
          },
          {
            id: "p2",
            label: "Strap Pull-Tab Loop",
            shape: "ring",
            material: "rubber",
            position: [-0.75, -0.15, 0],
            scale: [0.24, 0.24, 0.14],
            colorHex: "#1F2933",
            calloutIndex: 2,
            description: "Reused heel anchor for easy doorknob hanging",
          },
          {
            id: "p3",
            label: "4× Anti-Vibration Foot Pads",
            shape: "cylinder",
            material: "rubber",
            position: [0.55, -0.32, 0.1],
            scale: [0.52, 0.25, 0.52],
            colorHex: "#3A82A3",
            calloutIndex: 3,
            description: "Circular forefoot cushions for chairs & desk gear",
          },
        ],
      },
      UNEXPECTED: {
        name: "Hand-Carved EVA Relief Print Stamp & Ink Block",
        category: "Printmaking & Textile Craft",
        oneLineDescription:
          "Transforms the soft-carving EVA slipper sole into a linocut-style botanical relief stamp mounted on a wood grip block.",
        purpose: forSell
          ? "Prints custom handmade wrapping paper, kraft tags, and cotton tote bags you can craft and sell."
          : "Lets you hand-stamp personalized greeting cards, fabric patches, notebook covers, and gift wrap cleanly.",
        originalObjectContribution:
          "Closed-cell EVA foam carves as smoothly as expensive art-store Speedball linoleum while remaining springy enough to print crisp solids on uneven paper or cloth.",
        materialsReused: [
          "Flat sanded EVA slipper sole slab",
          "Heel plug strip (small texture accent stamp)",
        ],
        additionalMaterials: [
          "Scrap pine block or stacked cardboard handle (8 × 8 cm)",
          "Contact cement or strong double-sided mounting tape",
          "Water-based acrylic paint or stamp ink pad",
        ],
        requiredTools: ["Sharp craft scalpel or utility knife", "Sandpaper (180-grit)", "Pencil"],
        functionalityExplanation:
          "Sanding off surface dirt reveals fresh closed-cell foam. Carving away negative space around a drawn leaf or geometric motif leaves crisp raised islands that transfer ink evenly onto paper or cotton canvas.",
        dimensions: "9 cm L × 7 cm W × 3.8 cm H",
        sustainabilityValue:
          "Replaces virgin rubber carving blocks with discarded footwear foam that holds fine ink detail for hundreds of prints.",
        safetyConsiderations: [
          "Always carve away from your holding hand; rest the slab flat on a non-slip mat.",
          "Remember lettering must be drawn mirrored in reverse before carving.",
        ],
        testingValidation: [
          "Dab light paint onto the raised motif and press firmly onto scrap kraft paper to spot any high unwanted ridges.",
          "Trim stray background nibs until test prints come out crisp.",
        ],
        possibleImprovements: [
          "Carve a matching border stamp from the leftover heel curve.",
          "Seal wood grip block with beeswax for comfortable studio ink sessions.",
        ],
        steps: [
          {
            title: "Sand footbed smooth & trace block footprint",
            instruction:
              "Sand a 9 × 7 cm flat zone on the slipper footbed with 180-grit paper until smooth and trace a bold botanical leaf or geometric pattern in pencil.",
            actionType: "measure",
            tip: "Bold shapes with 3 mm line thickness print cleanest on textured paper and tote bags.",
            diagramCaption: "Sand sole flat and sketch relief motif",
          },
          {
            title: "Carve 3 mm negative relief channels",
            instruction:
              "Trace your motif outline at a slight outward angle with a craft knife, then pare away the surrounding background foam 3 mm deep.",
            actionType: "cut",
            tip: "Angling cuts slightly outward gives raised stamp lines sturdy wide bases.",
            diagramCaption: "Carve negative space around raised print motif",
          },
          {
            title: "Cut matching hardwood or kraft handle block",
            instruction:
              "Cut a scrap wood block (or laminate 4 layers of corrugated cardboard) slightly larger than your carved rubber pad.",
            actionType: "join",
            tip: "Glue a small wood knob or cork on the back for easy lifting.",
            diagramCaption: "Bond carved rubber pad onto wood grip block",
          },
          {
            title: "Smooth edge chamfers & seal handle",
            instruction:
              "Trim excess foam cleanly around the block edges and wipe dust off the carved printing face with a damp cloth.",
            actionType: "finish",
            tip: "Check there are no tall ink-catching islands around the outer rim.",
            diagramCaption: "Trim edges flush and dust carved relief face",
          },
          {
            title: "Ink & test-print on kraft card or fabric",
            instruction:
              "Tap an ink pad or thin foam-brushed acrylic paint across the carved face and press straight down onto kraft paper.",
            actionType: "test",
            tip: "Less paint gives sharper botanical edges than heavy puddles.",
            diagramCaption: "Pull crisp test print on kraft stationery",
          },
        ],
        assemblyParts: [
          {
            id: "p1",
            label: "Carved EVA Relief Plate",
            shape: "box",
            material: "rubber",
            position: [0, -0.32, 0],
            scale: [1.1, 0.24, 0.85],
            colorHex: "#2E6A85",
            calloutIndex: 1,
            description: "Hand-carved botanical motif cut into rubber sole",
          },
          {
            id: "p2",
            label: "Oak Mounting Block",
            shape: "box",
            material: "wood_grain",
            position: [0, 0.05, 0],
            scale: [1.14, 0.38, 0.88],
            colorHex: "#C5976A",
            calloutIndex: 2,
            description: "Rigid backing distributing even hand pressure",
          },
          {
            id: "p3",
            label: "Turned Grip Handle",
            shape: "cylinder",
            material: "wood_grain",
            position: [0, 0.48, 0],
            scale: [0.4, 0.45, 0.4],
            colorHex: "#A4764B",
            calloutIndex: 3,
            description: "Ergonomic lift knob for clean straight impressions",
          },
        ],
      },
      EXPERIMENTAL: {
        name: "Compression-Slit Broom, Brush & Cable Wall Grip Rack",
        category: "Kinetic Friction Hardware",
        oneLineDescription:
          "Slices springy star-slit jaws into the contoured rubber sole mounted on a wall cleat to clamp brooms, mops, paintbrushes, or thick cables by pure elasticity.",
        purpose:
          "Keeps long-handled brooms, craft rulers, and charging cords snapped vertically against a wall without buying spring-loaded plastic clips.",
        originalObjectContribution:
          "Uses the 1.8 cm thick elastic memory of EVA/rubber soles—slotted flaps flex open when a handle pushes in and bite tightly downward under gravity.",
        materialsReused: [
          "Full-length contoured EVA rubber sole",
          "Reused strap pieces as side bumpers",
        ],
        additionalMaterials: [
          "26 cm scrap wood backing batten (or triple-layered cardboard)",
          "4 flat-head wood screws & washers (or heavy Command strips)",
        ],
        requiredTools: ["Sharp utility knife", "Awl or drill", "Screwdriver & ruler"],
        functionalityExplanation:
          "Cutting three star-shaped cross slits spaced along the sole creates flexible rubber petals inside a recessed channel. When a broom handle or thick cord pushes into a slit, the compressed foam petals grip it via static friction.",
        dimensions: "26 cm W × 9.5 cm H × 4.2 cm D",
        sustainabilityValue:
          "Replaces brittle plastic broom-holder clips that snap after months, using resilient footwear elastomer.",
        safetyConsiderations: [
          "Use wide fender washers under screw heads so screws never pull through soft EVA foam.",
          "Drill pilot holes slightly smaller than handle diameter before slicing radial star slits.",
        ],
        testingValidation: [
          "Press a wooden broomstick and thick USB-C cable into separate slots and tug downward gently to verify grip hold.",
          "Check wall cleat security after 24 hours.",
        ],
        possibleImprovements: [
          "Add smaller 8 mm star slits on one end specifically for artist brushes and screwdrivers.",
          "Paint the wood batten in warm sage to frame the teal-blue rubber insert.",
        ],
        steps: [
          {
            title: "Cut wood cleat & mark 3 grip centers",
            instruction:
              "Cut a 26 × 9.5 cm scrap wood batten and mark three evenly spaced grip stations 7 cm apart along the slipper sole centerline.",
            actionType: "measure",
            tip: "Leave 3 cm solid rubber around outer edges so the sole stays rigid.",
            diagramCaption: "Mark three evenly spaced grip centers on sole",
          },
          {
            title: "Cut circular openings & 6-petal star slits",
            instruction:
              "Punch or cut a 12 mm starter hole at each mark, then slice six 15 mm radial star cuts outward from each hole edge.",
            actionType: "cut",
            tip: "Keep radial cuts symmetrical so clamping pressure stays centered.",
            diagramCaption: "Slice radial star-slits for elastic clamping",
          },
          {
            title: "Space sole off wall cleat with strap shims",
            instruction:
              "Place cut strips of the discarded PVC strap behind the top and bottom edges of the sole so the center star slits have room behind them to flex inward.",
            actionType: "join",
            tip: "That 6 mm rear air gap is what lets handles push cleanly through the jaws.",
            diagramCaption: "Add 6 mm rear shim spacers for petal flex",
          },
          {
            title: "Bolt sole onto wood cleat with washers",
            instruction:
              "Drive four screws with wide washers between the star slots through the rubber sole and strap shims into the wood cleat.",
            actionType: "mount",
            tip: "Snug screws until rubber just begins to dimple—do not crush flat.",
            diagramCaption: "Fasten slotted rubber grip bar onto wood batten",
          },
          {
            title: "Snap brooms, brushes & cords into jaws",
            instruction:
              "Mount cleat securely and test pushing broom handles, rulers, and thick power cables straight into the star jaws.",
            actionType: "test",
            tip: "Lift slightly upward and pull forward for effortless one-hand release.",
            diagramCaption: "Test compression grip with handles and cords",
          },
        ],
        assemblyParts: [
          {
            id: "p1",
            label: "Wood Wall Mounting Cleat",
            shape: "box",
            material: "wood_grain",
            position: [0, 0, -0.25],
            scale: [1.55, 0.65, 0.18],
            colorHex: "#C5976A",
            calloutIndex: 1,
            description: "Rigid backing rail anchoring rack cleanly to wall",
          },
          {
            id: "p2",
            label: "Slotted EVA Grip Insert",
            shape: "panel",
            material: "rubber",
            position: [0, 0, 0.05],
            scale: [1.35, 0.52, 0.22],
            colorHex: "#2E6A85",
            calloutIndex: 2,
            description: "Elastic rubber sole with 3 radial star-slit jaws",
          },
          {
            id: "p3",
            label: "PVC Strap Flex Shims",
            shape: "rod",
            material: "rubber",
            position: [0, 0.22, -0.08],
            scale: [1.25, 0.1, 0.12],
            colorHex: "#1F2933",
            calloutIndex: 3,
            description: "Creates rear clearance for rubber petals to flex",
          },
        ],
      },
    };
  }

  if (profileKey === "mug") {
    return {
      PRACTICAL: {
        name: "Stoneware Knife-Honing Station & Heavy Tool Caddy",
        category: "Workshop & Kitchen Utility",
        oneLineDescription:
          "Turns the cracked mug's unglazed ceramic foot-ring into a real blade-honing stone while organizing brushes and workshop shears inside.",
        purpose:
          "Keeps paring knives, craft blades, and studio brushes sharp and upright in one tip-proof stoneware station.",
        originalObjectContribution:
          "Kiln-fired unglazed ceramic foot-rings have ~1000-grit micro-abrasive texture—the exact traditional secret chefs use to hone dull knives.",
        materialsReused: [
          "Cracked ceramic mug body",
          "Unglazed bottom stoneware foot-ring",
        ],
        additionalMaterials: [
          "Cork coaster or non-slip rubber base ring",
          "Dry rice or coarse sand ballast (optional bottom layer)",
        ],
        requiredTools: ["Sandpaper (220-grit)", "Warm soapy sponge", "Permanent paint marker or cord"],
        functionalityExplanation:
          "Stabilizing the weighted mug on a cork ring protects desks while providing an upright tool well; flipping the mug momentarily exposes its raw ceramic bottom rim for safe 20-degree knife edge honing.",
        dimensions: "9.5 cm Diameter × 10.5 cm H",
        sustainabilityValue:
          "Gives cracked mugs that are unsafe for boiling drinks a permanent mechanical workshop purpose.",
        safetyConsiderations: [
          "Never use a cracked mug for hot liquids or food storage.",
          "Wrap any chipped handle stub cleanly with hemp twine or sand sharp glaze edges smooth under water.",
        ],
        testingValidation: [
          "Draw a dull kitchen paring knife at a 20-degree angle across the bottom unglazed ceramic ring 6 times per side and test paper slicing.",
          "Fill cup with scissors and rulers to confirm tip-proof balance.",
        ],
        possibleImprovements: [
          "Wrap jute twine tightly around the mug waist to cover any hairline crack cleanly.",
          "Divide top opening with two crossed rubber bands for brush spacing.",
        ],
        steps: [
          {
            title: "Wet-sand chipped glaze edges smooth",
            instruction:
              "Under running water, gently round any sharp ceramic chips or broken handle nubs using 220-grit wet/dry sandpaper.",
            actionType: "finish",
            tip: "Wet-sanding prevents fine ceramic dust from becoming airborne.",
            diagramCaption: "Wet-sand chipped glaze edges completely smooth",
          },
          {
            title: "Wrap protective twine collar around crack",
            instruction:
              "Coil tight jute twine around the midsection of the mug with a dab of wood glue to reinforce the hairline crack against widening.",
            actionType: "thread",
            tip: "Adds warm tactile grip when flipping the mug over to hone blades.",
            diagramCaption: "Reinforce vessel wall with coiled jute wrap",
          },
          {
            title: "Cut non-slip cork bench pad",
            instruction:
              "Trace the mug base onto a thin cork or scrap rubber sheet and cut a 9 cm coaster ring.",
            actionType: "cut",
            tip: "Keeps the mug quiet on desk surfaces and collects honing dust.",
            diagramCaption: "Trim non-slip cork base coaster",
          },
          {
            title: "Test bottom stoneware ring knife-honing",
            instruction:
              "Flip the dry mug upside down on a damp cloth and sweep a kitchen knife blade gently at 20 degrees along the raw unglazed ring.",
            actionType: "test",
            tip: "Wipe dark metal streaks off the ceramic ring afterward with a kitchen eraser.",
            diagramCaption: "Hone dull blade along unglazed foot-ring",
          },
        ],
        assemblyParts: [
          {
            id: "p1",
            label: "Non-Slip Cork Base",
            shape: "cylinder",
            material: "wood_grain",
            position: [0, -0.58, 0],
            scale: [1.05, 0.14, 1.05],
            colorHex: "#B6885E",
            calloutIndex: 1,
            description: "Cushions stoneware foot and grips desktop cleanly",
          },
          {
            id: "p2",
            label: "Twine-Reinforced Ceramic Vessel",
            shape: "cylinder",
            material: "ceramic",
            position: [0, 0.05, 0],
            scale: [0.92, 1.08, 0.92],
            colorHex: "#EDE5D8",
            calloutIndex: 2,
            description: "Heavy stoneware body + raw bottom honing ring",
          },
        ],
      },
      UNEXPECTED: {
        name: "Kintsugi-Inspired Succulent & Charcoal Air-Garden Dish",
        category: "Botanical & Ceramics",
        oneLineDescription:
          "Highlights the hairline crack with a golden ochre seal line and turns the heavy stoneware mug into a healthy pebble-drained succulent planter.",
        purpose:
          "Transforms a broken keepsake mug into a calm windowsill succulent planter with proper root drainage.",
        originalObjectContribution:
          "Heavy glazed stoneware insulates roots from midday heat swings while the crack line becomes an intentional aesthetic feature.",
        materialsReused: ["Cracked ceramic mug"],
        additionalMaterials: [
          "1 tbsp activated charcoal + small aquarium pebbles",
          "Cactus/succulent potting mix",
          "Golden ochre craft paint or waterproof epoxy dab",
        ],
        requiredTools: ["Small brush", "Spoon", "Dry cloth"],
        functionalityExplanation:
          "Layering 2.5 cm of pebbles and crushed charcoal below gritty succulent soil creates an internal perched drainage sump so roots never sit wet even without a drilled bottom hole.",
        dimensions: "9.5 cm Diameter × 14 cm H",
        sustainabilityValue:
          "Preserves sentimental ceramic keepsakes rather than tossing them when a crack appears.",
        safetyConsiderations: [
          "Do not attempt to drill a stoneware mug with regular wood/metal bits—it will shatter; use the charcoal-pebble drainage layer instead.",
        ],
        testingValidation: [
          "Mist or spoon-water only 2 tablespoons into the soil and verify zero weeping through the sealed exterior crack.",
        ],
        possibleImprovements: [
          "Nest a small wooden tag bearing the plant's species and watering schedule.",
        ],
        steps: [
          {
            title: "Seal interior crack & trace ochre accent vein",
            instruction:
              "Brush waterproof craft sealer along the inside crack, let dry, and trace the outer fracture delicately with golden ochre paint.",
            actionType: "finish",
            tip: "Celebrates the mug's history in true kintsugi spirit.",
            diagramCaption: "Seal inside crack and highlight outer vein",
          },
          {
            title: "Layer 2.5 cm pebble & charcoal sump",
            instruction:
              "Spoon 2 cm of clean gravel topped with 0.5 cm crushed horticultural charcoal into the bottom of the mug.",
            actionType: "mount",
            tip: "Charcoal keeps stagnant moisture fresh and odor-free.",
            diagramCaption: "Build gravel and charcoal drainage layer",
          },
          {
            title: "Pack gritty soil & plant succulent",
            instruction:
              "Fill with porous cactus mix, nest a haworthia or jade rosette, and top-dress with pale river stones.",
            actionType: "join",
            tip: "Wait 3 days after potting before the first light watering.",
            diagramCaption: "Seat succulent and mineral top-dressing",
          },
          {
            title: "Verify crack dryness after light watering",
            instruction:
              "Add 2 tablespoons of water near the roots and inspect the exterior wall after 30 minutes.",
            actionType: "test",
            tip: "Succulents thrive best on a bright windowsill.",
            diagramCaption: "Confirm dry crack seal and healthy balance",
          },
        ],
        assemblyParts: [
          {
            id: "p1",
            label: "Kintsugi-Sealed Ceramic Cup",
            shape: "cylinder",
            material: "ceramic",
            position: [0, -0.1, 0],
            scale: [0.95, 1.0, 0.95],
            colorHex: "#F0E8DA",
            calloutIndex: 1,
            description: "Glazed stoneware body with golden repair accent",
          },
          {
            id: "p2",
            label: "Succulent Crown",
            shape: "dome",
            material: "woven_fabric",
            position: [0, 0.55, 0],
            scale: [0.85, 0.5, 0.85],
            colorHex: "#7C8B6A",
            calloutIndex: 2,
            description: "Low-water jade or haworthia nestled above gravel",
          },
        ],
      },
      EXPERIMENTAL: {
        name: "Passive Ceramic Parabolic Desk Speaker Amplifier",
        category: "Passive Acoustics",
        oneLineDescription:
          "Couples a notched cardboard or bamboo phone cradle into the glazed stoneware mug bell to amplify desk audio naturally with zero power.",
        purpose:
          "Boosts vocal clarity and mid-range volume for study podcasts, video calls, or ambient music.",
        originalObjectContribution:
          "Smooth vitrified porcelain/stoneware walls reflect sound waves far more crisply than soft cardboard tubes.",
        materialsReused: ["Thick-walled ceramic mug"],
        additionalMaterials: [
          "Small cardboard or scrap wood collar sleeve",
          "Felt or folded paper wedge",
        ],
        requiredTools: ["Scissors or craft knife", "Ruler & pencil"],
        functionalityExplanation:
          "Sliding your phone's bottom speaker port into a snug felt-lined collar aimed into the curved mug interior turns the rigid ceramic cup into an acoustic horn resonator.",
        dimensions: "12 cm W × 14 cm H × 10 cm D",
        sustainabilityValue:
          "Eliminates battery-powered mini desk speakers using pure geometric acoustics.",
        safetyConsiderations: [
          "Line cardboard phone slot edges with soft felt or paper tape so glass phone backs never scratch against ceramic.",
        ],
        testingValidation: [
          "Play voice audio inside and outside the cradle and measure clear directional projection forward across the desk.",
        ],
        possibleImprovements: [
          "Angle the mug slightly upward on a folded cardboard chock toward your ears.",
        ],
        steps: [
          {
            title: "Measure phone width & bottom speaker port",
            instruction:
              "Measure the width and thickness of your phone plus where the speaker grille sits along its bottom edge.",
            actionType: "measure",
            tip: "Leave a small notch for the charging cable if you dock while plugged in.",
            diagramCaption: "Measure phone slot and speaker port opening",
          },
          {
            title: "Cut felt-lined cardboard acoustic bridge",
            instruction:
              "Cut a stiff rectangular cardboard bridge with a snug rectangular cutout that channels the phone speaker cleanly into the open mug mouth.",
            actionType: "cut",
            tip: "Keep the bridge flush against the mug rim so sound cannot leak sideways.",
            diagramCaption: "Cut snug acoustic channel bridge",
          },
          {
            title: "Seat mug upright or angled on foam wedge",
            instruction:
              "Tilt the mug 20 degrees upward on a folded kraft wedge and slip the phone cradle onto the upper rim.",
            actionType: "mount",
            tip: "Aiming the ceramic mouth toward your face boosts clarity noticeably.",
            diagramCaption: "Angle mug resonator and lock bridge",
          },
          {
            title: "Audio projection & stability test",
            instruction:
              "Dock phone, play spoken audio at 50% volume, and verify clear horn amplification without rattling.",
            actionType: "test",
            tip: "Tuck a tissue inside the mug bottom if resonance sounds overly bright.",
            diagramCaption: "Test passive ceramic horn projection",
          },
        ],
        assemblyParts: [
          {
            id: "p1",
            label: "Ceramic Horn Chamber",
            shape: "cylinder",
            material: "ceramic",
            position: [-0.15, -0.15, 0],
            scale: [0.95, 1.05, 0.95],
            colorHex: "#EDE5D8",
            calloutIndex: 1,
            description: "Glazed stoneware bell reflecting mid-range sound",
          },
          {
            id: "p2",
            label: "Notched Phone Dock Bridge",
            shape: "box",
            material: "cardboard",
            position: [0.35, 0.25, 0],
            scale: [0.65, 0.65, 0.28],
            colorHex: "#D98A6C",
            calloutIndex: 2,
            description: "Directs speaker port cleanly into ceramic cavity",
          },
        ],
      },
    };
  }

  if (profileKey === "electric_fan") {
    return {
      PRACTICAL: {
        name: "Rotating Steel-Grille Tool & Drying Carousel",
        category: "Workshop & Craft Studio",
        oneLineDescription:
          "Strips the broken motor coil and converts the circular powder-coated fan cage and weighted tilt stand into an upright hanging tool and herb-drying carousel.",
        purpose:
          "Holds craft brushes, pliers, tape rolls, or air-drying culinary herbs on a tip-proof rotating desk stand.",
        originalObjectContribution:
          "Uses the heavy weighted base, tilt neck, and concentric wire spacing that naturally hooks S-hooks and tool clips.",
        materialsReused: [
          "Weighted anti-tip fan pedestal",
          "Articulating tilt neck",
          "Powder-coated steel wire fan cage",
        ],
        additionalMaterials: [
          "6–8 bent paperclip or wire S-hooks",
          "Small cardboard or tin center tray",
        ],
        requiredTools: ["Screwdriver", "Pliers", "Wire cutters (for dead cord removal)"],
        functionalityExplanation:
          "Removing the heavy dead copper motor lightens the head while keeping the cast weighted base and wire cage intact. S-hooks snap anywhere onto the radial ribs.",
        dimensions: "36 cm Diameter × 48 cm H",
        sustainabilityValue:
          "Keeps bulky metal appliance frames out of scrap piles without complex electronics repair.",
        safetyConsiderations: [
          "Always unplug and completely remove the dead electrical cord and motor coil before repurposing.",
          "Tape or cap any cut wire ends inside the neck joint.",
        ],
        testingValidation: [
          "Hang 1 kg of hand tools or herb bundles evenly around the perimeter and test tilt neck lock.",
        ],
        possibleImprovements: [
          "Bolt a shallow tin lid into the center grille hub as a screw & paperclip dish.",
        ],
        steps: [
          {
            title: "Unscrew cage & safely remove dead motor/cord",
            instruction:
              "Unclip the front grille ring, unscrew the blade nut, and remove the non-working motor block and electrical cord completely.",
            actionType: "cut",
            tip: "Keep the steel mounting plate and pivot neck bolt intact.",
            diagramCaption: "Strip dead motor and cord, keep wire cage",
          },
          {
            title: "Re-attach empty wire cage to tilt pedestal",
            instruction:
              "Lock the rear and front wire grilles back together using the perimeter clips and mount cleanly onto the weighted neck.",
            actionType: "mount",
            tip: "Leave the center emblem hub on for a finished look.",
            diagramCaption: "Mount clean radial wire cage onto weighted stand",
          },
          {
            title: "Bend S-hooks & clip center tray",
            instruction:
              "Form six sturdy S-hooks from heavy wire or jumbo paperclips and clip them across concentric grille rings.",
            actionType: "join",
            tip: "Space hooks evenly across left and right quadrants.",
            diagramCaption: "Attach S-hooks along concentric steel rings",
          },
          {
            title: "Load tools or herb bundles & test tilt",
            instruction:
              "Hang scissors, brushes, tape, or herbs and angle the tilt neck 20 degrees upward for easy reach.",
            actionType: "test",
            tip: "Check base balance before adding heavier pliers.",
            diagramCaption: "Balance-test loaded carousel stand",
          },
        ],
        assemblyParts: [
          {
            id: "p1",
            label: "Weighted Ballast Pedestal",
            shape: "cylinder",
            material: "rubber",
            position: [0, -0.72, 0],
            scale: [1.1, 0.25, 1.1],
            colorHex: "#383532",
            calloutIndex: 1,
            description: "Heavy anti-tip base stabilizing upright rack",
          },
          {
            id: "p2",
            label: "Radial Steel Wire Cage",
            shape: "ring",
            material: "brushed_metal",
            position: [0, 0.22, 0],
            scale: [1.28, 1.28, 0.45],
            colorHex: "#8D9399",
            calloutIndex: 2,
            description: "Concentric steel wire rungs for S-hooks & clips",
          },
        ],
      },
      UNEXPECTED: {
        name: "Domed Wire-Cage Moss Basket & Trailing Vine Trellis",
        category: "Vertical Urban Gardening",
        oneLineDescription:
          "Lines the hemispherical steel fan grille with burlap or coconut coir to create a sculptural tabletop moss basket and climbing plant trellis.",
        purpose:
          "Elevates trailing pothos, strawberries, or ferns toward window light with 360-degree root aeration.",
        originalObjectContribution:
          "Powder-coated fan baskets naturally form an ideal rust-resistant geodesic trellis dome.",
        materialsReused: ["Hemispherical wire fan grille", "Weighted tilt base"],
        additionalMaterials: [
          "Burlap sack, old cotton shirt, or coco-coir liner",
          "Potting soil & trailing plant cutting",
        ],
        requiredTools: ["Scissors", "Screwdriver", "Twine"],
        functionalityExplanation:
          "Lining the lower half of the wire bowl with breathable burlap holds moist soil while the upper wire dome supports climbing tendrils cleanly.",
        dimensions: "35 cm Diameter × 46 cm H",
        sustainabilityValue:
          "Replaces wire hanging baskets sold at garden centers using broken home appliances.",
        safetyConsiderations: [
          "Disconnect and discard all internal wiring and motor parts before adding soil or watering.",
        ],
        testingValidation: [
          "Water lightly over a sink first to verify burlap holds soil particles securely.",
        ],
        possibleImprovements: [
          "Place a wide ceramic plate under the base to catch drips.",
        ],
        steps: [
          {
            title: "Detach electrical motor & clean wire basket",
            instruction:
              "Remove the dead motor, cord, and plastic impeller so only the clean steel wire cage and pedestal remain.",
            actionType: "cut",
            tip: "Wash grilles in warm soapy water for clean metal finish.",
            diagramCaption: "Isolate clean wire hemisphere and stand",
          },
          {
            title: "Line lower hemisphere with breathable fabric",
            instruction:
              "Press a square of burlap or doubled scrap cotton fabric inside the lower dome bowl and lash edges to the perimeter wire with twine.",
            actionType: "thread",
            tip: "Double-layer fabric prevents fine soil from washing out.",
            diagramCaption: "Tie breathable burlap liner inside lower bowl",
          },
          {
            title: "Fill soil & weave vine stems across ribs",
            instruction:
              "Add light potting mix, plant a trailing vine, and snap the top wire cage dome gently over the crown as a climbing trellis.",
            actionType: "mount",
            tip: "Guide young tendrils through outer grille rings.",
            diagramCaption: "Plant vine and mount upper wire trellis dome",
          },
          {
            title: "Tilt toward window light & check drip catch",
            instruction:
              "Angle the articulating neck toward morning sun and place a shallow saucer beneath the base.",
            actionType: "test",
            tip: "Rotate 90 degrees weekly for even growth.",
            diagramCaption: "Test tilt balance and root drainage",
          },
        ],
        assemblyParts: [
          {
            id: "p1",
            label: "Tilt Stand Base",
            shape: "cylinder",
            material: "rubber",
            position: [0, -0.72, 0],
            scale: [1.05, 0.24, 1.05],
            colorHex: "#383532",
            calloutIndex: 1,
            description: "Weighted base supporting elevated trellis",
          },
          {
            id: "p2",
            label: "Burlap-Lined Wire Bowl",
            shape: "dome",
            material: "brushed_metal",
            position: [0, 0.18, 0],
            scale: [1.22, 1.1, 0.72],
            colorHex: "#8D9399",
            calloutIndex: 2,
            description: "Aerated hemispherical plant cradle & trellis",
          },
        ],
      },
      EXPERIMENTAL: {
        name: "Pleated Parchment Pendant & Articulated Studio Lamp",
        category: "Upcycled Lighting",
        oneLineDescription:
          "Wraps folded origami parchment strips across the radial steel fan cage over a cool LED bulb for an architectural sculptural desk lamp.",
        purpose:
          "Casts warm diffused directional light across drawing desks or reading corners with adjustable tilt.",
        originalObjectContribution:
          "Uses the fan's articulating tilt neck and radial concentric cage as an instant mid-century wireframe shade skeleton.",
        materialsReused: ["Wire fan grille dome", "Weighted articulating stand"],
        additionalMaterials: [
          "Baking parchment or heavy tracing paper strips",
          "Battery LED puck or cool clip-on LED bulb",
          "Double-sided craft tape",
        ],
        requiredTools: ["Scissors", "Ruler", "Screwdriver"],
        functionalityExplanation:
          "Weaving accordion-folded paper louvers between the wire cage spokes diffuses harsh LED glare into soft layered shadow bands.",
        dimensions: "35 cm Diameter × 46 cm H",
        sustainabilityValue:
          "Creates a bespoke architectural lamp from zero-value appliance scrap.",
        safetyConsiderations: [
          "Use cool low-wattage LED bulbs or battery LED pucks ONLY—never incandescent bulbs near paper.",
        ],
        testingValidation: [
          "Run LED light inside closed paper-wrapped dome for 30 minutes and confirm all surfaces remain cool to touch.",
        ],
        possibleImprovements: [
          "Leave bottom quadrant unshaded for focused reading light on the desk.",
        ],
        steps: [
          {
            title: "Remove dead motor & clean radial cage",
            instruction:
              "Dismantle broken motor parts and wipe the steel cage ribs clean.",
            actionType: "cut",
            tip: "Keep the rear protective hub plate to clip an LED puck.",
            diagramCaption: "Strip old motor and prep clean wire frame",
          },
          {
            title: "Cut & accordion-fold parchment louvers",
            instruction:
              "Cut 6 cm wide strips of baking parchment and fold sharp 1.5 cm zig-zag pleats.",
            actionType: "fold",
            tip: "Bone-folding creases sharp makes crisp light shadows.",
            diagramCaption: "Accordion-fold warm parchment diffuser strips",
          },
          {
            title: "Weave pleated bands around steel spokes",
            instruction:
              "Weave the pleated paper strips in and out of the radial grille bars and secure ends cleanly with small tape tabs.",
            actionType: "thread",
            tip: "Leave a gap at the front center hub for easy LED access.",
            diagramCaption: "Weave pleated diffuser bands across cage",
          },
          {
            title: "Clip cool LED puck & test articulated glow",
            instruction:
              "Seat a cool battery LED puck inside the rear hub, close the front grille, and tilt toward your desk.",
            actionType: "test",
            tip: "Verify cool temperature and glare-free diffusion.",
            diagramCaption: "Test diffused directional studio lighting",
          },
        ],
        assemblyParts: [
          {
            id: "p1",
            label: "Weighted Articulating Base",
            shape: "cylinder",
            material: "rubber",
            position: [0, -0.72, 0],
            scale: [1.05, 0.24, 1.05],
            colorHex: "#383532",
            calloutIndex: 1,
            description: "Heavy swivel desk stand",
          },
          {
            id: "p2",
            label: "Pleated Parchment Shade Cage",
            shape: "dome",
            material: "cardboard",
            position: [0, 0.2, 0],
            scale: [1.24, 1.2, 0.6],
            colorHex: "#F2EADF",
            calloutIndex: 2,
            description: "Wire fan grille woven with glowing paper louvers",
          },
        ],
      },
    };
  }

  if (profileKey === "clothes") {
    return {
      PRACTICAL: {
        name: "Pocketed Denim Roll-Up Craft Tool & Brush Wrap",
        category: "Portable Workshop Storage",
        oneLineDescription:
          "Turns sturdy denim legs, hemmed cuffs, and intact back pockets into a tie-up roll protecting scissors, chisels, rulers, and brushes.",
        purpose:
          "Keeps sharp craft tools organized and cushioned inside a backpack or studio drawer.",
        originalObjectContribution:
          "Reuses factory-reinforced double-stitched pockets, belt loops, and heavy twill seams that handle metal tool tips effortlessly.",
        materialsReused: ["Denim trouser legs or heavy shirt panels", "Original back pockets", "Waistband tie strip"],
        additionalMaterials: ["Heavy cotton sewing thread", "Fabric chalk"],
        requiredTools: ["Fabric scissors", "Sewing needle (or sewing machine)", "Ruler"],
        functionalityExplanation:
          "Laying two rectangular panels flat with a stitched multi-slot pocket band across the lower half lets tools slip upright into individual sleeves, folding top flap down before rolling shut.",
        dimensions: "42 cm W × 28 cm H (open) / 9 cm Rolled",
        sustainabilityValue:
          "Diverts durable woven denim from textile waste into heirloom-grade workshop gear.",
        safetyConsiderations: [
          "Use double-layer denim at the bottom fold so sharp chisel or scissor tips never poke through.",
        ],
        testingValidation: [
          "Load 6 craft tools, fold protective top flap down, tie strap tightly, and shake gently to verify zero tool slip.",
        ],
        possibleImprovements: [
          "Sew a mini zipper pouch from old jacket pockets for screws and erasers.",
        ],
        steps: [
          {
            title: "Cut intact denim leg & pocket panels",
            instruction:
              "Cut a 42 × 28 cm main backing rectangle plus a 42 × 16 cm pocket strip from sturdy un-torn denim sections.",
            actionType: "cut",
            tip: "Use an original finished pant hem as the upper lip of your pocket strip.",
            diagramCaption: "Cut main backing sheet and hemmed pocket strip",
          },
          {
            title: "Mark graded tool slots (3 cm to 7 cm wide)",
            instruction:
              "Lay your actual scissors, pens, rulers, and brushes across the pocket strip and chalk vertical stitch lines around each.",
            actionType: "measure",
            tip: "Leave 1 cm finger clearance inside wider tool bays.",
            diagramCaption: "Mark custom vertical dividers for tools",
          },
          {
            title: "Backstitch bottom & divider channels",
            instruction:
              "Sew the pocket strip along the bottom edge and stitch up each chalked divider line, locking top corners with extra bar-tack stitches.",
            actionType: "join",
            tip: "Double-stitch top pocket corners where tools slide in daily.",
            diagramCaption: "Stitch reinforced vertical tool pockets",
          },
          {
            title: "Attach waistband tie cords & load tools",
            instruction:
              "Sew two 45 cm waistband or shoelace strips onto the outer right edge, load your tools, roll snugly, and tie shut.",
            actionType: "test",
            tip: "Fold the top 5 cm flap down first before rolling to keep tools captured.",
            diagramCaption: "Roll tool wrap and test tie retention",
          },
        ],
        assemblyParts: [
          {
            id: "p1",
            label: "Stitched Denim Backing",
            shape: "panel",
            material: "woven_fabric",
            position: [0, 0, -0.05],
            scale: [1.45, 1.05, 0.1],
            colorHex: "#3E5369",
            calloutIndex: 1,
            description: "Heavy cotton twill backing with top protective flap",
          },
          {
            id: "p2",
            label: "Slotted Tool Pocket Tier",
            shape: "box",
            material: "woven_fabric",
            position: [0, -0.25, 0.08],
            scale: [1.38, 0.55, 0.16],
            colorHex: "#546D87",
            calloutIndex: 2,
            description: "Custom-stitched sleeves for brushes, rulers & shears",
          },
        ],
      },
      UNEXPECTED: {
        name: "Braided T-Shirt Yarn Thermal Pot Trivet & Coaster Set",
        category: "Tableware & Textile Craft",
        oneLineDescription:
          "Slices old knit T-shirts into continuous t-shirt yarn, braids three strands, and coils them into thick heat-insulating trivets.",
        purpose:
          "Protects wooden dining tables and desks from hot kettles, mugs, and baking dishes with zero retail fabric.",
        originalObjectContribution:
          "Cotton jersey knit curls naturally into plush rounded yarn cords when cut across the grain and stretched.",
        materialsReused: ["2–3 worn cotton T-shirts"],
        additionalMaterials: ["Heavy upholstery or crochet cotton thread"],
        requiredTools: ["Sharp fabric scissors", "Tapestry needle", "Safety pin"],
        functionalityExplanation:
          "Coiling a thick 3-strand knit braid spirally and whip-stitching underneath builds a dense 1.5 cm thermal cushion with natural cotton heat tolerance.",
        dimensions: "22 cm Diameter Trivet + Two 10 cm Coasters",
        sustainabilityValue:
          "Upcycles stained or faded cotton tees that cannot be donated into washable, plastic-free kitchenware.",
        safetyConsiderations: [
          "Use 100% cotton garments only for hot-pot trivets—avoid polyester blends that soften under boiling pans.",
        ],
        testingValidation: [
          "Place a hot kettle on the finished trivet for 2 minutes and feel underside wood temperature.",
        ],
        possibleImprovements: [
          "Mix terracotta, cream, and navy tees for a tricolor marled spiral.",
        ],
        steps: [
          {
            title: "Cut continuous 3 cm T-shirt yarn strips",
            instruction:
              "Slice below the armpits into 3 cm rings, connect diagonally, and stretch firmly so strips curl into smooth rounded jersey yarn.",
            actionType: "cut",
            tip: "Stretching curls raw fabric edges inward automatically.",
            diagramCaption: "Slice and stretch jersey into smooth yarn cords",
          },
          {
            title: "Anchor & braid 3 thick yarn strands",
            instruction:
              "Knot three strands together, pin to a cushion or clamp, and braid evenly for 2.5 meters.",
            actionType: "thread",
            tip: "Keep braiding tension consistent so the spiral coil lies flat.",
            diagramCaption: "Braid three jersey strands into flat cord",
          },
          {
            title: "Coil spiral & whip-stitch underside",
            instruction:
              "Coil the braid flat on a table and whip-stitch adjacent braid edges from the underside using heavy cotton thread.",
            actionType: "join",
            tip: "Work flat on a tabletop—holding it in air causes cupping.",
            diagramCaption: "Whip-stitch spiral coils cleanly from underside",
          },
          {
            title: "Steam-press flat & test heat barrier",
            instruction:
              "Tuck final tails neatly into the underside seam and rest a warm kettle or mug on top to confirm flat stability.",
            actionType: "test",
            tip: "Machine-washable on cold gentle cycle.",
            diagramCaption: "Verify flat lay and thermal insulation",
          },
        ],
        assemblyParts: [
          {
            id: "p1",
            label: "Coiled Cotton Braid Pad",
            shape: "cylinder",
            material: "woven_fabric",
            position: [0, -0.35, 0],
            scale: [1.35, 0.22, 1.35],
            colorHex: "#7C8B6A",
            calloutIndex: 1,
            description: "Plush spiraled 3-strand knit trivet cushion",
          },
        ],
      },
      EXPERIMENTAL: {
        name: "Tensioned Dowel Door-Back Denim Pocket Matrix",
        category: "Vertical Organization",
        oneLineDescription:
          "Suspends stitched jeans pockets and belt-loop tool hooks from a wooden crossbar for modular entryway or desk-side storage.",
        purpose:
          "Turns unused closet doors or narrow wall strips into grab-and-go pockets for notebooks, chargers, and scissors.",
        originalObjectContribution:
          "Copper-riveted jeans pockets handle far heavier loads than thin plastic over-door organizers.",
        materialsReused: ["Old jeans panels", "Original riveted back pockets", "Belt loops"],
        additionalMaterials: ["40 cm wooden dowel or bamboo pole", "Jute cord (1.2 m)"],
        requiredTools: ["Fabric scissors", "Needle & heavy thread", "Ruler"],
        functionalityExplanation:
          "Sewing top casing loops over a rigid wooden dowel distributes load evenly across the hanging cord, while belt loops act as clip-on carabiner/tool tabs.",
        dimensions: "40 cm W × 58 cm H",
        sustainabilityValue: "Replaces disposable synthetic hanging organizers.",
        safetyConsiderations: ["Knot jute hanger securely with a bowline or square knot."],
        testingValidation: ["Load pockets with notebooks and small hand tools for 10 minutes."],
        possibleImprovements: ["Slip a stiff cardboard sheet into a rear sleeve for extra wall flatness."],
        steps: [
          {
            title: "Trim denim leg backplate & salvage 4 pockets",
            instruction: "Cut a 36 × 52 cm denim rectangle and harvest four intact pockets leaving 1.5 cm seam margins.",
            actionType: "cut",
            tip: "Leave copper rivets intact on corners for authentic strength.",
            diagramCaption: "Harvest intact riveted jeans pockets",
          },
          {
            title: "Stitch wooden dowel top sleeve",
            instruction: "Fold top 5 cm backward and stitch across to form a sturdy dowel rod tunnel.",
            actionType: "fold",
            tip: "Test dowel sliding fit before stitching final corner.",
            diagramCaption: "Fold and stitch top dowel suspension tunnel",
          },
          {
            title: "Sew tiered pockets & belt-loop tool tabs",
            instruction: "Pin pockets in two neat rows and sew around three sides, tucking salvaged belt loops along bottom hem.",
            actionType: "join",
            tip: "Reinforce top left/right pocket corners with X-stitches.",
            diagramCaption: "Mount riveted pockets and belt loops",
          },
          {
            title: "Insert dowel, tie cord & load-test",
            instruction: "Thread dowel and hanging cord, hang on a hook, and stock pockets with studio tools.",
            actionType: "test",
            tip: "Keep heaviest items in lower pockets.",
            diagramCaption: "Verify level suspension under full load",
          },
        ],
        assemblyParts: [
          {
            id: "p1",
            label: "Dowel Crossbar",
            shape: "rod",
            material: "wood_grain",
            position: [0, 0.85, 0],
            scale: [1.45, 0.12, 0.12],
            colorHex: "#B6885E",
            calloutIndex: 1,
            description: "Supports pocket matrix cleanly without sagging",
          },
          {
            id: "p2",
            label: "Riveted Denim Pocket Panel",
            shape: "panel",
            material: "woven_fabric",
            position: [0, 0, 0],
            scale: [1.25, 1.4, 0.12],
            colorHex: "#465E76",
            calloutIndex: 2,
            description: "Multi-pocket hanging organizer with belt loops",
          },
        ],
      },
    };
  }

  if (profileKey === "tin_can") {
    return {
      PRACTICAL: {
        name: "Magnetic Steel-Tin Wall Spice & Hardware Pods",
        category: "Vertical Pantry & Bench Storage",
        oneLineDescription:
          "Turns empty rolled-rim steel tins into magnetic or oak-rail mounted storage pods for screws, spices, or markers.",
        purpose: "Frees countertop and desk space using vertical steel surfaces or a narrow wood strip.",
        originalObjectContribution:
          "Tin-plated steel cans are naturally ferromagnetic and already have stiffrolled safety rims.",
        materialsReused: ["2–3 clean empty steel tin cans"],
        additionalMaterials: ["Strong neodymium disc magnets or oak batten + screws", "Kraft paper labels"],
        requiredTools: ["Screwdriver", "Sandpaper (120-grit)", "Strong adhesive or tape"],
        functionalityExplanation:
          "Mounting tins upright onto a horizontal oak cleat (or bonding magnets to the stamped base) snaps metal containers onto fridges, tool boards, or shelf edges.",
        dimensions: "30 cm W × 11 cm H × 9 cm D",
        sustainabilityValue: "Diverts steel cans directly into durable workshop hardware bins.",
        safetyConsiderations: ["Ensure original can-opener edge is smooth or taped with kraft tape before reaching inside."],
        testingValidation: ["Load tins with 250 g of hardware or pens and verify magnet/screw grip."],
        possibleImprovements: ["Wrap a strip of terracotta or kraft cardstock around the middle ribs."],
        steps: [
          {
            title: "Wash tins & smooth top inner seam",
            instruction: "Soak off paper labels, dry thoroughly to prevent rust, and press down any sharp opener tabs with pliers.",
            actionType: "finish",
            tip: "Hairdryer warms stubborn label glue for clean peeling.",
            diagramCaption: "Clean steel tins and flatten inner rim burr",
          },
          {
            title: "Mount magnets or drill oak rail holes",
            instruction: "Glue two strong magnets to the flat tin base OR drill 2 screw holes near the back rim to bolt onto an oak batten.",
            actionType: "puncture",
            tip: "Use a center punch or nail dimple so drill bits never skate on curved tin.",
            diagramCaption: "Prepare magnetic base or rear oak mount holes",
          },
          {
            title: "Wrap tactile kraft grip band & labels",
            instruction: "Wrap a 3 cm kraft or leatherette strip around the waist and label contents cleanly.",
            actionType: "mount",
            tip: "Leaves shiny brushed steel ribs visible top and bottom.",
            diagramCaption: "Add kraft label band and mount pods",
          },
          {
            title: "Load hardware & test holding shear",
            instruction: "Snap pods onto a steel tool board or fridge and verify zero downward slide.",
            actionType: "test",
            tip: "Rough up glossy magnet backs with sandpaper before gluing.",
            diagramCaption: "Test full-load vertical hold",
          },
        ],
        assemblyParts: [
          {
            id: "p1",
            label: "Brushed Steel Tin Shell",
            shape: "cylinder",
            material: "brushed_metal",
            position: [0, 0, 0],
            scale: [0.95, 1.05, 0.95],
            colorHex: "#9BA2A8",
            calloutIndex: 1,
            description: "Ribbed magnetic steel container with rolled rim",
          },
          {
            id: "p2",
            label: "Kraft Grip Label Band",
            shape: "cylinder",
            material: "terracotta",
            position: [0, -0.2, 0],
            scale: [0.98, 0.3, 0.98],
            colorHex: "#D98A6C",
            calloutIndex: 2,
            description: "Tactile label band covering center ribs",
          },
        ],
      },
      UNEXPECTED: {
        name: "Ice-Frozen Punched Constellation Lantern Sconce",
        category: "Ambient Craft Lighting",
        oneLineDescription:
          "Freezes water solid inside a tin can so nail-punched star patterns create crisp light beams without crushing the metal walls.",
        purpose: "Casts cozy speckled geometric light across patios, balconies, or bedside tables.",
        originalObjectContribution:
          "Steel tin walls withstand outdoor warmth safely, while the ice-block trick lets anyone punch crisp pinholes cleanly at home.",
        materialsReused: ["Empty ribbed steel tin can"],
        additionalMaterials: ["Paper pattern wrap", "Wire bail handle", "Battery LED tea-light"],
        requiredTools: ["Hammer", "Nail or awl", "Pliers"],
        functionalityExplanation:
          "Solid ice supports the thin steel cylinder from inside while hammering nail holes, leaving zero dents. Melting the ice reveals clean starlight apertures.",
        dimensions: "8.5 cm Diameter × 11.5 cm H",
        sustainabilityValue: "Creates artisanal patio lighting from kitchen pantry tins.",
        safetyConsiderations: ["Dry tin completely after ice melts to avoid rust; prefer cool LED tea-lights indoors."],
        testingValidation: ["Switch on LED tea-light inside in a dim room to inspect crisp starry projections."],
        possibleImprovements: ["Brush exterior with matte charcoal or terracotta spray paint."],
        steps: [
          {
            title: "Freeze water solid inside clean tin",
            instruction: "Fill clean tin with water leaving 1 cm headspace and freeze solid overnight.",
            actionType: "measure",
            tip: "Solid ice prevents the thin steel cylinder from collapsing under hammer taps.",
            diagramCaption: "Freeze solid ice core inside tin can",
          },
          {
            title: "Tape constellation pattern & nail-punch",
            instruction: "Wrap a dotted paper template around the frozen tin and tap 1–2 mm pinholes sharply with a nail and hammer.",
            actionType: "puncture",
            tip: "Vary small and medium nails for starry depth.",
            diagramCaption: "Hammer starry pinhole pattern into frozen wall",
          },
          {
            title: "Melt ice, dry & fit wire bail handle",
            instruction: "Run warm water to slip the ice out, dry thoroughly, punch two top rim holes, and twist a stiff wire hanging bail.",
            actionType: "thread",
            tip: "Keep bail height above 14 cm for easy carrying.",
            diagramCaption: "Dry tin and attach twisted wire handle",
          },
          {
            title: "Illuminate & test pattern projection",
            instruction: "Drop a glowing LED tea-light inside and test light speckles on nearby walls.",
            actionType: "test",
            tip: "Works beautifully hung along balcony railings.",
            diagramCaption: "Test starry ambient projection in dim room",
          },
        ],
        assemblyParts: [
          {
            id: "p1",
            label: "Perforated Steel Sconce",
            shape: "cylinder",
            material: "brushed_metal",
            position: [0, -0.05, 0],
            scale: [0.95, 1.05, 0.95],
            colorHex: "#8D9399",
            calloutIndex: 1,
            description: "Dent-free steel wall punched with starry apertures",
          },
        ],
      },
      EXPERIMENTAL: {
        name: "Slotted Twine, Ribbon & Tape Bench Dispenser",
        category: "Studio Dispenser",
        oneLineDescription:
          "Suspends a twine or tape spool on a dowel axle inside a tin can with a side feed port and fold-down serrated cutter tab.",
        purpose: "Stops craft twine and masking tape rolls from unraveling across your workbench.",
        originalObjectContribution:
          "Stiff steel cylinder encloses spools cleanly while the rolled rim and wooden lid keep dust out.",
        materialsReused: ["Tall coffee or food tin can"],
        additionalMaterials: ["12 cm thin wood dowel", "Scrap cardboard top lid", "Serrated foil-box blade strip"],
        requiredTools: ["Nail & hammer", "Tin snips or heavy scissors", "Masking tape"],
        functionalityExplanation:
          "Thread a wooden axle horizontally across two opposite nail holes; twine feeds cleanly out a taped grommet port on the front wall.",
        dimensions: "10 cm Diameter × 13 cm H",
        sustainabilityValue: "Replaces plastic desktop tape and string dispensers.",
        safetyConsiderations: ["Tape over any cut metal side-slot edges thoroughly so twine never frays and fingers stay safe."],
        testingValidation: ["Pull 1 meter of twine steadily to confirm smooth snag-free rotation."],
        possibleImprovements: ["Weight bottom with marbles or pebbles for single-handed tearing."],
        steps: [
          {
            title: "Mark & punch axle + feed port holes",
            instruction: "Mark opposing center holes 6 cm up for the dowel axle and one front exit hole 3 cm up.",
            actionType: "measure",
            tip: "Line the front twine exit hole with a folded ring of masking tape.",
            diagramCaption: "Mark dowel axle holes and front twine exit",
          },
          {
            title: "Load spool onto wooden axle inside tin",
            instruction: "Slide wooden dowel through one side, thread twine spool inside, and push dowel through the far wall.",
            actionType: "thread",
            tip: "Cap dowel ends with tight rubber bands so axle cannot slide out.",
            diagramCaption: "Mount twine spool on dowel axle inside tin",
          },
          {
            title: "Tape-seal exit port & attach cutter tab",
            instruction: "Pull twine tail through front exit hole and mount a cardboard top dust cap.",
            actionType: "mount",
            tip: "Add pebbles in the bottom base for crisp one-hand pulls.",
            diagramCaption: "Seat dust lid and feed port collar",
          },
          {
            title: "Test smooth tangle-free pulling",
            instruction: "Pull several lengths of twine to confirm low friction and zero unraveling.",
            actionType: "test",
            tip: "Swap spools in 10 seconds by slipping the dowel out.",
            diagramCaption: "Verify snag-free bench dispensing",
          },
        ],
        assemblyParts: [
          {
            id: "p1",
            label: "Steel Dispenser Drum",
            shape: "cylinder",
            material: "brushed_metal",
            position: [0, -0.05, 0],
            scale: [0.95, 1.05, 0.95],
            colorHex: "#9BA2A8",
            calloutIndex: 1,
            description: "Enclosed cylinder housing twine spool",
          },
          {
            id: "p2",
            label: "Dowel Spool Axle",
            shape: "rod",
            material: "wood_grain",
            position: [0, 0, 0],
            scale: [1.25, 0.14, 0.14],
            colorHex: "#B6885E",
            calloutIndex: 2,
            description: "Removable axle letting spool spin cleanly",
          },
        ],
      },
    };
  }

  if (profileKey === "glass_jar") {
    return {
      PRACTICAL: {
        name: "Under-Shelf Twist-Lock Hardware & Spice Jars",
        category: "Zero-Footprint Storage",
        oneLineDescription:
          "Screws metal jar lids directly beneath a wooden shelf or desk underside so clear glass jars twist on/off suspended overhead.",
        purpose: "Keeps screws, beads, spices, or tea visible while freeing 100% of desk or counter space.",
        originalObjectContribution:
          "Clear glass makes contents instantly identifiable without opening, while factory screw threads support weight cleanly.",
        materialsReused: ["Clean glass jars", "Original threaded metal screw lids"],
        additionalMaterials: ["2 small pan-head wood screws per lid", "Scrap wood shelf cleat"],
        requiredTools: ["Hammer & small nail (for lid starter holes)", "Screwdriver"],
        functionalityExplanation:
          "Driving two spaced screws through the metal lid into a shelf underside prevents the lid from spinning when you twist the glass jar on or off with one hand.",
        dimensions: "9 cm Diameter × 14 cm H (per jar)",
        sustainabilityValue: "Turns pantry jars into zero-plastic modular workshop drawers.",
        safetyConsiderations: [
          "Never drill or puncture glass—only screw through the metal lids.",
          "Use two screws per lid so torque cannot loosen a single center screw.",
        ],
        testingValidation: [
          "Fill jar with 300 g of metal screws, twist up onto mounted lid, and verify snug quarter-turn lock.",
        ],
        possibleImprovements: ["Label lid rims for quick seated identification."],
        steps: [
          {
            title: "Wash jars & punch 2 screw holes per metal lid",
            instruction: "Lay metal lid face-down on scrap wood and tap two nail holes 3 cm apart through the lid.",
            actionType: "puncture",
            tip: "Using two spaced screws stops the lid from rotating when twisting the jar.",
            diagramCaption: "Punch two spaced mounting holes in metal lid",
          },
          {
            title: "Screw lids beneath wooden shelf lip",
            instruction: "Space lid positions 12 cm apart under a shelf or workbench overhang and drive two short wood screws per lid.",
            actionType: "mount",
            tip: "Verify jar glass clears the back wall before driving screws.",
            diagramCaption: "Screw metal lids beneath shelf underside",
          },
          {
            title: "Fill glass jars & twist-lock overhead",
            instruction: "Sort screws, craft beads, or dry pantry spices into the clean jars and twist snugly into mounted lids.",
            actionType: "test",
            tip: "Keep heaviest jars under thick solid wood shelves only.",
            diagramCaption: "Twist-lock loaded jars and test thread grip",
          },
        ],
        assemblyParts: [
          {
            id: "p1",
            label: "Mounted Steel Screw Lid",
            shape: "cylinder",
            material: "brushed_metal",
            position: [0, 0.55, 0],
            scale: [0.88, 0.16, 0.88],
            colorHex: "#D98A6C",
            calloutIndex: 1,
            description: "Dual-screw anchored metal lid beneath shelf",
          },
          {
            id: "p2",
            label: "Clear Glass Storage Jar",
            shape: "cylinder",
            material: "pet_plastic",
            position: [0, -0.1, 0],
            scale: [0.85, 1.05, 0.85],
            colorHex: "#CBE6E1",
            calloutIndex: 2,
            description: "Visible glass body twisting cleanly overhead",
          },
        ],
      },
      UNEXPECTED: {
        name: "Self-Sustaining Charcoal & Moss Closed Micro-Terrarium",
        category: "Botanical Ecology",
        oneLineDescription:
          "Layers gravel, charcoal, moss, and ferns inside a clear glass jar to create a self-watering miniature forest ecosystem.",
        purpose: "Brings low-maintenance living greenery to desks using trapped condensation cycles.",
        originalObjectContribution:
          "Crystal-clear glass lets sunlight enter while locking humidity cleanly inside.",
        materialsReused: ["Clear glass jar with tight screw lid"],
        additionalMaterials: ["Washed pebbles", "Activated charcoal", "Potting soil & woodland moss"],
        requiredTools: ["Long spoon or chopsticks", "Spray mist bottle"],
        functionalityExplanation:
          "Moisture evaporates from damp soil, condenses on glass walls, and drips back down to moss roots—requiring watering only every few months.",
        dimensions: "10 cm Diameter × 16 cm H",
        sustainabilityValue: "Turns recycled glassware into living educational science vessels.",
        safetyConsiderations: ["Place in bright indirect light—direct midday sun overheats sealed glass."],
        testingValidation: ["Check morning glass fogging; wipe excess if heavy droplets obscure view for days."],
        possibleImprovements: ["Add a small river stone landscape accent."],
        steps: [
          {
            title: "Sterilize jar & layer 2 cm drainage pebbles",
            instruction: "Wash jar with warm soapy water, dry, and spoon 2 cm clean pebbles across the base.",
            actionType: "mount",
            tip: "Rinse pebbles well so glass stays crystal clear.",
            diagramCaption: "Build clean pebble drainage base",
          },
          {
            title: "Add thin charcoal filter & 3 cm soil",
            instruction: "Sprinkle 0.5 cm activated charcoal over stones followed by 3 cm moist potting soil.",
            actionType: "join",
            tip: "Charcoal prevents stale smells inside closed glass.",
            diagramCaption: "Layer charcoal filter and potting soil",
          },
          {
            title: "Tuck moss & mini fern with chopsticks",
            instruction: "Press cushions of green moss gently onto soil, mist lightly, and seal lid.",
            actionType: "test",
            tip: "Crack lid open 1 hour if heavy condensation persists.",
            diagramCaption: "Plant moss canopy and balance humidity",
          },
        ],
        assemblyParts: [
          {
            id: "p1",
            label: "Optical Glass Chamber",
            shape: "cylinder",
            material: "pet_plastic",
            position: [0, 0, 0],
            scale: [0.92, 1.15, 0.92],
            colorHex: "#D5ECE7",
            calloutIndex: 1,
            description: "Crystal clear sealed terrarium jar",
          },
          {
            id: "p2",
            label: "Moss Ecosystem Core",
            shape: "dome",
            material: "woven_fabric",
            position: [0, -0.2, 0],
            scale: [0.8, 0.45, 0.8],
            colorHex: "#7C8B6A",
            calloutIndex: 2,
            description: "Self-cycling moss over gravel & charcoal",
          },
        ],
      },
      EXPERIMENTAL: {
        name: "Water-Lens Botanical Specimen & Warm LED Desk Globe",
        category: "Optics & Ambient Decor",
        oneLineDescription:
          "Illuminates a water-filled glass jar holding preserved botanical sprigs from beneath via a recessed wood plinth and cool LED puck.",
        purpose: "Magnifies leaves and stems into a warm glowing ambient desk lamp.",
        originalObjectContribution:
          "Curved water-filled glass acts as a cylindrical magnifying lens.",
        materialsReused: ["Clear glass jar & metal lid"],
        additionalMaterials: ["Notched cardboard or wood ring base", "LED tea-light puck", "Fresh rosemary or fern sprig"],
        requiredTools: ["Scissors", "Ruler"],
        functionalityExplanation:
          "A battery LED puck recessed beneath the jar projects soft upward rays through refracting water and backlit leaves.",
        dimensions: "10 cm Diameter × 17 cm H",
        sustainabilityValue: "Creates artisanal studio lighting from kitchen glass.",
        safetyConsiderations: ["Use sealed battery LED puck underneath—never mains wires near water."],
        testingValidation: ["Confirm jar sits stably inside base collar before filling water."],
        possibleImprovements: ["Add one drop of glycerin to slow water bubbles."],
        steps: [
          {
            title: "Build recessed LED ring plinth",
            instruction: "Cut two 10 cm cardboard or wood rings with a 4.5 cm center pocket holding the LED puck.",
            actionType: "cut",
            tip: "Line pocket bottom with foil for extra upward bounce.",
            diagramCaption: "Cut recessed plinth pocket for LED puck",
          },
          {
            title: "Arrange botanical sprig & fill clear water",
            instruction: "Tuck a clean fern frond inside the jar, fill with water, and tighten lid.",
            actionType: "mount",
            tip: "Let tap water sit 1 hour first to minimize micro-bubbles.",
            diagramCaption: "Seal botanical sprig inside water lens jar",
          },
          {
            title: "Seat jar onto glowing LED base",
            instruction: "Switch on LED puck, seat jar cleanly into collar, and test glow in dim studio light.",
            actionType: "test",
            tip: "Replace water weekly if using fresh cuttings.",
            diagramCaption: "Verify optical refraction and base stability",
          },
        ],
        assemblyParts: [
          {
            id: "p1",
            label: "LED Plinth Collar",
            shape: "cylinder",
            material: "wood_grain",
            position: [0, -0.6, 0],
            scale: [1.0, 0.25, 1.0],
            colorHex: "#B6885E",
            calloutIndex: 1,
            description: "Elevates jar over recessed LED light",
          },
          {
            id: "p2",
            label: "Water-Magnified Specimen Jar",
            shape: "cylinder",
            material: "pet_plastic",
            position: [0, 0.1, 0],
            scale: [0.88, 1.1, 0.88],
            colorHex: "#CBE6E1",
            calloutIndex: 2,
            description: "Backlit glass lens magnifying botanicals",
          },
        ],
      },
    };
  }

  return buildContextualArchetypes(analysis, goalText, batchSeed);
}

function buildContextualArchetypes(
  analysis: ObjectAnalysis,
  goalText: string,
  batchSeed: number
): Record<DirectionType, BlueprintRecipe> {
  const name = analysis.objectName;
  const primaryPart = analysis.reusableParts[0] ?? "primary outer shell";
  const secondaryPart = analysis.reusableParts[1] ?? "structural frame";
  const material = analysis.materials[0] ?? "salvaged composite";
  const inferred = inferMaterialFinish(`${name} ${analysis.materials.join(" ")}`);
  const goalPhrase = goalText.trim() || "daily hands-on utility";

  const rotationOffset = batchSeed % 3;

  const titlesByMaterial: Record<
    PartMaterialFinish,
    { practical: string[]; unexpected: string[]; experimental: string[] }
  > = {
    rubber: {
      practical: [
        `Non-Slip ${name} Anti-Vibration Pads & Wedge`,
        `Bench-Grip ${name} Tool Cushion Mat`,
        `Protective ${name} Cabinet & Door Bumper Set`,
      ],
      unexpected: [
        `Hand-Carved ${name} Relief Print Stamp`,
        `Waterproof ${name} Floating Key & Tag Fob`,
        `Textured ${name} Clay & Pottery Pattern Roller`,
      ],
      experimental: [
        `Friction-Slit ${name} Cable & Brush Wall Grip`,
        `Spring-Tensioned ${name} Desk Cord Anchor`,
        `Modular ${name} Squeegee & Bench Scraper`,
      ],
    },
    woven_fabric: {
      practical: [
        `Stitched ${name} Roll-Up Tool & Brush Wrap`,
        `Reinforced ${name} Produce & Market Sling`,
        `Pocketed ${name} Bedside & Desk Caddy`,
      ],
      unexpected: [
        `Braided ${name} Thermal Pot Trivet`,
        `Upcycled ${name} Pressed-Leaf Book Cover`,
        `Hanging ${name} Herb & Onion Air-Sack`,
      ],
      experimental: [
        `Tensioned Dowel ${name} Door-Back Organizer`,
        `Weighted ${name} Draft-Stopper & Wrist Rest`,
        `Modular ${name} Acoustic Wall Pin-Panel`,
      ],
    },
    wood_grain: {
      practical: [
        `Cantilevered ${name} Two-Tier Desk Riser`,
        `Slotted ${name} Tablet, Mail & Key Dock`,
        `Mortised ${name} Bench Clamp & Tool Tray`,
      ],
      unexpected: [
        `Vertical ${name} Kitchen Herb & Utensil Ladder`,
        `Carved ${name} Tea-Light & Planter Plinth`,
        `Peg-Board ${name} Yarn & Spool Winding Frame`,
      ],
      experimental: [
        `Pin-Locked ${name} Adjustable Drafting Lectern`,
        `Counterbalanced ${name} Overhead Task Stand`,
        `Folding ${name} Acoustic Phone Horn Cradle`,
      ],
    },
    brushed_metal: {
      practical: [
        `Magnetic ${name} Wall Hardware & Tool Bar`,
        `Weighted ${name} Soldering & Craft Third-Hand`,
        `Riveted ${name} Desk Tray & Cable Guide`,
      ],
      unexpected: [
        `Perforated ${name} Starlight LED Sconce`,
        `Suspended ${name} Trailing Vine Trellis`,
        `Chimed ${name} Wind & Balcony Garden Bell`,
      ],
      experimental: [
        `Articulated ${name} Overhead Phone Copy-Stand`,
        `Slotted ${name} Twine & Tape Bench Dispenser`,
        `Parabolic ${name} Desk Lamp Reflector Shade`,
      ],
    },
    terracotta: {
      practical: [
        `Weighted ${name} Brush, Tool & Honing Station`,
        `Porous ${name} Evaporative Bread & Herb Keeper`,
        `Stabilized ${name} Desk Instrument Cup`,
      ],
      unexpected: [
        `Kintsugi-Style ${name} Succulent & Charcoal Dish`,
        `Buried ${name} Olla Slow-Drip Garden Irrigator`,
        `Scent-Diffusing ${name} Essential Oil Stone`,
      ],
      experimental: [
        `Passive ${name} Ceramic Sound-Horn Dock`,
        `Stacked ${name} Micro-Green Sprout Tower`,
        `Pin-Hole ${name} Warm Clay Candle Lantern`,
      ],
    },
    ceramic: {
      practical: [
        `Weighted ${name} Brush & Knife-Honing Caddy`,
        `Glazed ${name} Paint-Water & Studio Well`,
        `Heavy ${name} Bookend & Desk Tool Anchor`,
      ],
      unexpected: [
        `Kintsugi-Accented ${name} Succulent Dish`,
        `Charcoal-Bed ${name} Moss & Pebble Planter`,
        `Layered ${name} Mosaic Coaster Tray`,
      ],
      experimental: [
        `Passive ${name} Parabolic Phone Amplifier`,
        `Acoustic ${name} Bell Chime & Desk Resonance Cup`,
        `Inverted ${name} LED Ambient Rim Diffuser`,
      ],
    },
    cardboard: {
      practical: [
        `Cross-Slotted ${name} Desk & Charging Dock`,
        `Notched ${name} Drawer & Notebook Divider Grid`,
        `Reinforced ${name} Cable-Hiding Monitor Riser`,
      ],
      unexpected: [
        `Laminated ${name} Acoustic Study Partition`,
        `Corrugated ${name} Cat Scratcher & Lounge Tray`,
        `Layered ${name} Relief Stamp & Stencil Press`,
      ],
      experimental: [
        `Gear-Notched ${name} 5-Angle Sketchbook Easel`,
        `Louvered ${name} Warm LED Architectural Shade`,
        `Slot-Together ${name} Zero-Glue Laptop Stand`,
      ],
    },
    pet_plastic: {
      practical: [
        `Trimmed ${name} Clear Parts & Cable Bin`,
        `Nested ${name} Stackable Desk Supply Cups`,
        `Cut-Collar ${name} Paint & Brush Rinse Station`,
      ],
      unexpected: [
        `Capillary ${name} Self-Watering Herb Vessel`,
        `Mini-Cloche ${name} Seedling Humidity Dome`,
        `Bird-Safe ${name} Gravity Seed Dispenser`,
      ],
      experimental: [
        `Sanded ${name} 360-Degree LED Night Lantern`,
        `Water-Lens ${name} Magnifying Specimen Stand`,
        `Slotted ${name} Vertical Wall Planter Pocket`,
      ],
    },
  };

  const bucket = titlesByMaterial[inferred.primary] ?? titlesByMaterial.pet_plastic;
  const practicalName = bucket.practical[rotationOffset];
  const unexpectedName = bucket.unexpected[rotationOffset];
  const experimentalName = bucket.experimental[rotationOffset];

  return {
    PRACTICAL: {
      name: practicalName,
      category: "Workspace Organization",
      oneLineDescription: `Transforms the ${primaryPart} of ${name.toLowerCase()} into a sturdy, compartmentalized organizer built for ${goalPhrase.toLowerCase()}.`,
      purpose: `Eliminates bench clutter by giving ${name.toLowerCase()} a clean second life holding everyday essentials.`,
      originalObjectContribution: `Preserves the ${primaryPart} and ${secondaryPart} from ${name.toLowerCase()}, requiring minimal cutting and zero specialized hardware.`,
      materialsReused: [
        `${name} (${primaryPart})`,
        `Salvaged ${secondaryPart}`,
      ],
      additionalMaterials: [
        "Kraft cardboard or scrap wood divider strip",
        "Wood glue or twine lashing",
        "Felt or rubber non-slip foot pads",
      ],
      requiredTools: ["Scissors or utility knife", "Ruler & pencil", "Sandpaper (150-grit)"],
      functionalityExplanation: `By stabilizing the ${primaryPart} on a wide flat base and slotting internal ${material} dividers, vertical space is divided into grab-and-go bays tailored to ${goalPhrase.toLowerCase()}.`,
      dimensions: "26 cm W × 18 cm H × 14 cm D",
      sustainabilityValue: `Keeps intact ${material} out of landfill while replacing molded plastic organizers.`,
      safetyConsiderations: [
        "Sand or tape any cut or fractured edges smooth before handling.",
        "Ensure base footprint is wider than top compartments to prevent tipping.",
      ],
      testingValidation: [
        "Load compartments with daily notebooks, brushes, or cables and nudge sideways to check stability.",
        "Verify dividers remain snug after 20 item insertions.",
      ],
      possibleImprovements: [
        "Coat exposed edges with beeswax or matte craft varnish for moisture protection.",
        "Add a front notch for charging cable routing.",
      ],
      steps: [
        {
          title: "Clean & isolate sound structural sections",
          instruction: `Wipe down ${name.toLowerCase()} and separate the intact ${primaryPart} from any damaged or loose pieces.`,
          actionType: "measure",
          tip: "Mark your keep-lines with removable masking tape before making any cuts.",
          diagramCaption: "Inspect and mark usable structural zones",
        },
        {
          title: "Trim & smooth mounting edges",
          instruction: `Trim protruding damaged tabs and sand raw ${material} edges smoothly with 150-grit paper.`,
          actionType: "cut",
          tip: "Wrap sandpaper around a flat scrap block for crisp straight edges.",
          diagramCaption: "Trim damaged tabs and sand rims smooth",
        },
        {
          title: "Cut interlocking internal dividers",
          instruction: "Cut two notched divider strips from scrap cardboard or wood to fit snugly inside the main cavity.",
          actionType: "fold",
          tip: "Cut notch slots half the divider height for rigid cross-bracing.",
          diagramCaption: "Slot cross-braced internal divider grid",
        },
        {
          title: "Seat assembly onto non-slip plinth",
          instruction: `Bond or lash the ${primaryPart} onto a weighted base pad and wedge the ${secondaryPart} as a rear riser.`,
          actionType: "join",
          tip: "Clamp or weigh down glued joints for 20 minutes while curing.",
          diagramCaption: "Mount body onto weighted base plinth",
        },
        {
          title: "Load-test & label bays",
          instruction: "Stock compartments with daily tools and test single-handed retrieval without the base shifting.",
          actionType: "test",
          tip: "Keep heaviest objects toward the rear spine.",
          diagramCaption: "Perform full-load balance check",
        },
      ],
      assemblyParts: [
        {
          id: "p1",
          label: "Weighted Plinth Base",
          shape: "box",
          material: inferred.secondary,
          position: [0, -0.68, 0],
          scale: [1.55, 0.22, 1.05],
          colorHex: "#B58A62",
          calloutIndex: 1,
          description: "Stabilizes organizer against tipping on desk",
        },
        {
          id: "p2",
          label: `Primary ${name} Shell`,
          shape: "cylinder",
          material: inferred.primary,
          position: [-0.32, 0.05, 0],
          scale: [0.78, 1.12, 0.78],
          colorHex: "#D98A6C",
          calloutIndex: 2,
          description: `Main salvaged ${primaryPart} forming deep tool bay`,
        },
        {
          id: "p3",
          label: "Cross-Slotted Divider Grid",
          shape: "box",
          material: "cardboard",
          position: [0.42, -0.15, 0],
          scale: [0.68, 0.78, 0.72],
          colorHex: "#DFC9A6",
          calloutIndex: 3,
          description: "Interlocking compartments for small accessories",
        },
        {
          id: "p4",
          label: "Rear Support Rail",
          shape: "rod",
          material: inferred.secondary,
          position: [0, 0.32, -0.35],
          scale: [1.35, 0.14, 0.14],
          colorHex: "#4A3528",
          calloutIndex: 4,
          description: "Locks back wall and prevents lateral wobble",
        },
      ],
    },
    UNEXPECTED: {
      name: unexpectedName,
      category: "Botanical & Home Craft",
      oneLineDescription: `Reimagines ${name.toLowerCase()} as a breathable botanical cradle and passive moisture-regulating planter station.`,
      purpose: `Pairs the natural geometry of ${name.toLowerCase()} with living greenery for balconies, windowsills, or calm study corners.`,
      originalObjectContribution: `Uses the ${primaryPart} as a structural planter cradle while the ${secondaryPart} elevates foliage toward sunlight.`,
      materialsReused: [
        `${name} (${primaryPart})`,
        `Salvaged ${secondaryPart}`,
      ],
      additionalMaterials: [
        "Recycled plastic yogurt cup or terracotta liner",
        "Cotton twine (2 m)",
        "Coarse gravel & potting mix",
      ],
      requiredTools: ["Scissors", "Awl or drill bit", "Measuring tape"],
      functionalityExplanation: `Nesting a waterproof liner inside the salvaged ${primaryPart} protects the ${material} from rot while turning the object's original silhouette into an elevated botanical sculpture.`,
      dimensions: "22 cm Diameter × 30 cm H",
      sustainabilityValue:
        "Turns household discards into indoor biophilic infrastructure without buying new ceramic pots.",
      safetyConsiderations: [
        "Line porous or metallic surfaces with a watertight cup to prevent rust or water damage on tables.",
        "Keep drainage saucers beneath hanging or elevated planters.",
      ],
      testingValidation: [
        "Water plant lightly and inspect beneath base after 15 minutes to confirm zero seepage.",
        "Tug suspension cords firmly to verify balanced center of gravity.",
      ],
      possibleImprovements: [
        "Braid three strands of twine for a stronger macrame-style cradle.",
        "Add a small brass or wooden plant care tag.",
      ],
      steps: [
        {
          title: "Prepare waterproof inner liner",
          instruction: `Measure the internal cavity of ${name.toLowerCase()} and trim a recycled cup or jar to sit 1 cm below the rim.`,
          actionType: "measure",
          tip: "A hidden liner keeps organic materials dry and stain-free.",
          diagramCaption: "Size inner liner to sit flush below rim",
        },
        {
          title: "Puncture 3-point suspension or vent holes",
          instruction: "Mark three equidistant points around the upper rim (120 degrees apart) and pierce clean cord holes.",
          actionType: "puncture",
          tip: "Equal 120-degree spacing guarantees the cradle hangs level.",
          diagramCaption: "Pierce three balanced rim anchor points",
        },
        {
          title: "Thread & knot lifting cradle",
          instruction: "Thread three 65 cm twine cords through the holes, tie stopper knots underneath, and join at an upper ring.",
          actionType: "thread",
          tip: "Adjust knot height while holding the vessel over a table.",
          diagramCaption: "Thread 3-point twine cradle through rim",
        },
        {
          title: "Layer pebbles, soil & liner inside",
          instruction: `Seat the waterproof liner inside the ${primaryPart}, add 2 cm of gravel for root aeration, and fill with potting soil.`,
          actionType: "join",
          tip: "Leave 2 cm headspace at the rim for clean watering.",
          diagramCaption: "Assemble gravel drainage and soil core",
        },
        {
          title: "Plant cutting & check level balance",
          instruction: "Tuck a hardy pothos or culinary herb into the center and test hang balance plus drip containment.",
          actionType: "test",
          tip: "Mist leaves weekly and rotate quarter-turns for even growth.",
          diagramCaption: "Verify level suspension and drip seal",
        },
      ],
      assemblyParts: [
        {
          id: "p1",
          label: "Outer Salvaged Cradle",
          shape: "cylinder",
          material: inferred.primary,
          position: [0, -0.25, 0],
          scale: [1.02, 0.86, 1.02],
          colorHex: "#C97A57",
          calloutIndex: 1,
          description: `Structural body of ${name.toLowerCase()} cradling liner`,
        },
        {
          id: "p2",
          label: "Watertight Inner Cup",
          shape: "cylinder",
          material: "pet_plastic",
          position: [0, -0.15, 0],
          scale: [0.84, 0.78, 0.84],
          colorHex: "#D9ECE8",
          calloutIndex: 2,
          description: "Moisture barrier protecting salvaged material",
        },
        {
          id: "p3",
          label: "3-Point Cord Harness",
          shape: "cone",
          material: "woven_fabric",
          position: [0, 0.65, 0],
          scale: [0.72, 0.95, 0.72],
          colorHex: "#E0A952",
          calloutIndex: 3,
          description: "Balanced 120-degree suspension cords",
        },
        {
          id: "p4",
          label: "Foliage Crown",
          shape: "dome",
          material: "woven_fabric",
          position: [0, 0.35, 0],
          scale: [0.85, 0.52, 0.85],
          colorHex: "#7C8B6A",
          calloutIndex: 4,
          description: "Living herb or trailing indoor plant",
        },
      ],
    },
    EXPERIMENTAL: {
      name: experimentalName,
      category: "Kinetic & Mechanical Craft",
      oneLineDescription: `Uses counterbalanced geometry and the ${secondaryPart} of ${name.toLowerCase()} to create an articulated tilt-adjustable reading easel & ambient reflector.`,
      purpose:
        "Holds sketchbooks, tablets, or diffused task lighting at ergonomic angles using pure mechanical friction—no electronics or motors required.",
      originalObjectContribution: `Turns the ${secondaryPart} into a pivot spine and the ${primaryPart} into a counterweighted tilt surface.`,
      materialsReused: [
        `${name} (${primaryPart})`,
        `Rigid ${secondaryPart}`,
      ],
      additionalMaterials: [
        "1 bolt + wingnut (or notched wooden peg)",
        "Scrap rubber strip for friction washer",
        "Corrugated backing board (A4 size)",
      ],
      requiredTools: ["Screwdriver or pliers", "Craft knife", "Ruler"],
      functionalityExplanation:
        "Pinning the salvaged body at its center of mass with a rubber friction washer lets you tilt the platform smoothly between 15 and 75 degrees and lock position with hand tension alone.",
      dimensions: "28 cm W × 32 cm H × 19 cm D",
      sustainabilityValue:
        "Demonstrates repairable mechanical design using zero glue-locked joints—every part can be dismantled or upgraded later.",
      safetyConsiderations: [
        "Do not exceed 1.5 kg load on cantilevered friction pivots.",
        "Tighten wingnut firmly before resting tablets or glass items.",
      ],
      testingValidation: [
        "Adjust tilt angle through 5 positions with a 600 g sketchbook to ensure zero slip.",
        "Confirm rear strut stops the frame cleanly at maximum 75-degree inclination.",
      ],
      possibleImprovements: [
        "Add a lower wooden lip ledge to hold pens and styluses.",
        "Glue white parchment on the back face so flipping the easel turns it into a soft window-light bounce card.",
      ],
      steps: [
        {
          title: "Find balance center & mark pivot axis",
          instruction: `Balance the ${primaryPart} across a pencil to find its center of mass and mark opposing pivot holes.`,
          actionType: "measure",
          tip: "Placing the pivot slightly below center makes tilting effortless.",
          diagramCaption: "Locate balance axis and mark pivot holes",
        },
        {
          title: "Cut A-frame side struts & rubber washers",
          instruction: "Cut two sturdy side legs from scrap wood or layered cardboard plus two 2 cm rubber friction washers.",
          actionType: "cut",
          tip: "Rubber washers triple holding torque without straining the nut.",
          diagramCaption: "Cut side struts and high-friction washers",
        },
        {
          title: "Assemble articulated pivot joint",
          instruction: `Thread the bolt through side strut, rubber washer, ${primaryPart}, second washer, and wingnut.`,
          actionType: "join",
          tip: "Keep tension snug enough to hold angle yet easy to adjust by hand.",
          diagramCaption: "Assemble friction-damped wingnut hinge",
        },
        {
          title: "Mount lower book ledge & rear stop",
          instruction: "Attach a 2.5 cm bottom lip bar and tie a limiting cord between front and rear legs.",
          actionType: "mount",
          tip: "The limiting cord acts as a fail-safe against splaying.",
          diagramCaption: "Fit bottom shelf ledge and splay limiter",
        },
        {
          title: "Calibrate tilt angles under load",
          instruction: "Place a sketchbook or tablet on the cradle and cycle from flat drafting angle to upright reading tilt.",
          actionType: "test",
          tip: "Quarter-turn the wingnut to fine-tune resistance.",
          diagramCaption: "Test 15–75 degree friction hold under load",
        },
      ],
      assemblyParts: [
        {
          id: "p1",
          label: "A-Frame Side Struts",
          shape: "box",
          material: "wood_grain",
          position: [0, -0.35, 0],
          scale: [1.35, 0.95, 0.25],
          colorHex: "#7A5238",
          calloutIndex: 1,
          description: "Twin angled side legs providing wide footprint",
        },
        {
          id: "p2",
          label: "Friction Pivot & Wingnut",
          shape: "cylinder",
          material: "brushed_metal",
          position: [0, 0.02, 0.22],
          scale: [0.24, 0.35, 0.24],
          colorHex: "#8D9399",
          calloutIndex: 2,
          description: "Rubber-damped bolt locking tilt angle smoothly",
        },
        {
          id: "p3",
          label: `Articulated ${name} Cradle`,
          shape: "panel",
          material: inferred.primary,
          position: [0, 0.25, 0.08],
          scale: [1.2, 1.05, 0.14],
          colorHex: "#D98A6C",
          calloutIndex: 3,
          description: "Tilting workspace panel built from salvaged body",
        },
        {
          id: "p4",
          label: "Bottom Rest Ledge",
          shape: "rod",
          material: "wood_grain",
          position: [0, -0.22, 0.32],
          scale: [1.22, 0.14, 0.22],
          colorHex: "#E0A952",
          calloutIndex: 4,
          description: "Supports sketchbooks, tablets, or tools cleanly",
        },
      ],
    },
  };
}

function applyConstraintsToCostAndTime(
  basePhp: number,
  baseMinutes: number,
  input: SynthesisInput,
  archetype: DirectionArchetype
): { costPhp: number; buildMinutes: number; difficulty: DifficultyLevel } {
  let costPhp = basePhp;
  let buildMinutes = baseMinutes;
  let difficulty = archetype.difficulty;

  const rawBudget = input.constraints.budgetPhp.trim();
  const budgetVal = Number(rawBudget);
  if (rawBudget !== "" && Number.isFinite(budgetVal) && budgetVal >= 0 && costPhp > budgetVal) {
    costPhp = budgetVal === 0 ? 0 : Math.max(0, Math.round(budgetVal * 0.85));
  }

  const skill = normalizeText(input.constraints.skillLevel);
  if (skill.includes("beginner")) {
    difficulty = "Beginner";
    buildMinutes = Math.max(15, buildMinutes - 10);
  } else if (skill.includes("advanced")) {
    buildMinutes += 10;
  }

  return { costPhp, buildMinutes, difficulty };
}

function makeSteps(
  recipeSteps: BlueprintRecipe["steps"],
  prefixId: string
): ConstructionStep[] {
  return recipeSteps.map((step, idx) => ({
    id: `${prefixId}-step-${idx + 1}`,
    stepNumber: idx + 1,
    title: step.title,
    instruction: step.instruction,
    actionType: step.actionType,
    tip: step.tip,
    diagramCaption: step.diagramCaption,
  }));
}

export function synthesizeLocalInventions(
  input: SynthesisInput,
  options?: { excludeNames?: string[]; batchSeed?: number }
): SynthesisResult {
  const analysis = analyzeObjectInput(input);
  const activeText = getActiveModeText(input);
  const cleanedFilename = input.mode === "photo" ? cleanPhotoFileName(input.photoFileName) : "";
  const combinedSource = normalizeText(`${activeText} ${cleanedFilename}`);
  const matchedProfile = OBJECT_PROFILES.find((p) =>
    p.keywords.some((kw) => combinedSource.includes(kw))
  );

  const excludeSet = new Set(
    (options?.excludeNames ?? []).map((n) => n.toLowerCase().trim())
  );
  const seed =
    (options?.batchSeed ?? 0) +
    (hashSeed(combinedSource + (input.goal || "")) % 7);

  const recipes = buildCuratedRecipes(
    matchedProfile?.key ?? "generic",
    analysis,
    input.goal || input.constraints.desiredFunction,
    seed
  );

  const concepts = DIRECTION_ARCHETYPES.map((archetype, idx) => {
    const recipe = recipes[archetype.direction];
    let finalName = recipe.name;

    if (excludeSet.has(finalName.toLowerCase())) {
      const altSuffixes = ["Edition II", "Compact Studio", "Modular Build", "Field Version"];
      finalName = `${recipe.name} (${altSuffixes[(seed + idx) % altSuffixes.length]})`;
    }

    const adjusted = applyConstraintsToCostAndTime(
      archetype.costPhpBase,
      archetype.buildMinutesBase,
      input,
      archetype
    );

    const uniqueId = `craftly-${archetype.direction.toLowerCase()}-${Date.now().toString(36)}-${idx}-${seed}`;

    const concept: InventionConcept = {
      id: uniqueId,
      direction: archetype.direction,
      name: finalName,
      category: recipe.category,
      oneLineDescription: recipe.oneLineDescription,
      purpose: recipe.purpose,
      originalObjectContribution: recipe.originalObjectContribution,
      materialsReused: recipe.materialsReused,
      additionalMaterials: recipe.additionalMaterials,
      requiredTools:
        input.constraints.tools.trim().length > 0
          ? [...recipe.requiredTools, `User tool: ${input.constraints.tools.trim()}`]
          : recipe.requiredTools,
      difficulty: adjusted.difficulty,
      buildTimeMinutes: adjusted.buildMinutes,
      estimatedCostPhp: adjusted.costPhp,
      functionalityExplanation: recipe.functionalityExplanation,
      dimensions: recipe.dimensions,
      steps: makeSteps(recipe.steps, uniqueId),
      safetyConsiderations: recipe.safetyConsiderations,
      makeabilityScore: archetype.makeability,
      sustainabilityValue: recipe.sustainabilityValue,
      testingValidation: recipe.testingValidation,
      possibleImprovements: recipe.possibleImprovements,
      assemblyParts: recipe.assemblyParts,
      studioPrompt: `Finished handmade ${finalName} crafted from ${analysis.objectName}, featuring ${recipe.materialsReused.slice(0, 2).join(" and ")} joined with ${recipe.additionalMaterials.slice(0, 2).join(" and ")}. Shown in realistic everyday use (${recipe.purpose.toLowerCase()}) on a natural oak studio workbench`,
      sourceSummary: analysis.objectName,
      generatedBy: "local",
    };

    return concept;
  }) as [InventionConcept, InventionConcept, InventionConcept];

  return {
    analysis,
    concepts,
    source: "local",
  };
}

export function refineLocalInvention(
  invention: InventionConcept,
  analysis: ObjectAnalysis,
  mode: RefinementMode
): InventionConcept {
  const newId = `${invention.id}-ref-${mode}-${Date.now().toString(36)}`;

  if (mode === "practical") {
    return {
      ...invention,
      id: newId,
      name: `${invention.name} — Streamlined Build`,
      oneLineDescription: `Simplified everyday edition using fewer parts, common household tools, and faster snap-fit assembly from ${analysis.objectName}.`,
      additionalMaterials: invention.additionalMaterials.slice(0, 2).concat([
        "Standard masking or kraft tape for fast jig alignment",
      ]),
      requiredTools: ["Scissors", "Ruler", "Masking tape"],
      difficulty: "Beginner",
      buildTimeMinutes: Math.max(15, Math.round(invention.buildTimeMinutes * 0.65)),
      estimatedCostPhp: Math.max(0, Math.round(invention.estimatedCostPhp * 0.7)),
      makeabilityScore: Math.min(98, invention.makeabilityScore + 6),
      functionalityExplanation: `${invention.functionalityExplanation} Redesigned with simplified straight-edge cuts and tool-free locking joints for reliable daily use.`,
      steps: invention.steps.slice(0, 4).map((s, idx) => ({
        ...s,
        id: `${newId}-step-${idx + 1}`,
        stepNumber: idx + 1,
        instruction: `${s.instruction} (Simplified jig method—no specialist clamps required.)`,
      })),
      generatedBy: "local",
    };
  }

  if (mode === "creative") {
    return {
      ...invention,
      id: newId,
      direction: "EXPERIMENTAL",
      name: `${invention.name} — Convertible Kinetic Edition`,
      oneLineDescription: `Re-engineers ${analysis.objectName} with a dual-mode folding mechanism and tactile contrasting joinery.`,
      purpose: `${invention.purpose} Adds a flip-orientation latch so one build performs two distinct studio functions.`,
      additionalMaterials: [
        ...invention.additionalMaterials,
        "Brass split-pin or wooden toggle latch",
        "Contrasting cotton cord accent",
      ],
      difficulty: invention.difficulty === "Beginner" ? "Intermediate" : "Advanced",
      buildTimeMinutes: invention.buildTimeMinutes + 15,
      estimatedCostPhp: invention.estimatedCostPhp + 30,
      makeabilityScore: Math.max(68, invention.makeabilityScore - 4),
      functionalityExplanation: `${invention.functionalityExplanation} Incorporates an articulated secondary pivot so the primary shell rotates smoothly between upright storage and angled display modes.`,
      steps: [
        ...invention.steps.map((s, idx) => ({
          ...s,
          id: `${newId}-step-${idx + 1}`,
        })),
        {
          id: `${newId}-step-${invention.steps.length + 1}`,
          stepNumber: invention.steps.length + 1,
          title: "Install convertible toggle & dual-angle stop",
          instruction:
            "Thread a knotted cotton cord through a wooden toggle button to lock the body in either vertical or 45-degree tilted display mode.",
          actionType: "thread",
          tip: "Use contrasting ochre or terracotta cord as a visual pull-tab.",
          diagramCaption: "Add dual-mode toggle pivot latch",
        },
      ],
      possibleImprovements: [
        ...invention.possibleImprovements,
        "Stamp or stencil measurement markings directly onto the wood brace.",
      ],
      generatedBy: "local",
    };
  }

  // mode === "cheaper"
  return {
    ...invention,
    id: newId,
    name: `${invention.name} — Zero-Buy Salvage Build`,
    oneLineDescription: `Maximizes 100% reuse of ${analysis.objectName} and household pantry scraps to eliminate store-bought hardware.`,
    materialsReused: [
      ...invention.materialsReused,
      "Scrap shipping box strips (instead of purchased dowels)",
    ],
    additionalMaterials: [
      "Reused grocery twine or torn T-shirt strip",
      "Flour-and-water paste or salvaged tape",
    ],
    requiredTools: ["Kitchen scissors", "Pencil or butter knife for creasing"],
    difficulty: "Beginner",
    buildTimeMinutes: Math.max(15, invention.buildTimeMinutes - 5),
    estimatedCostPhp: 0,
    makeabilityScore: Math.min(96, invention.makeabilityScore + 4),
    functionalityExplanation: `${invention.functionalityExplanation} Every purchased fastener is replaced with folded cardboard tabs, friction slots, and knotted scrap textile lashing.`,
    sustainabilityValue: `Zero-cost circular build: 100% salvaged materials with zero new retail packaging.`,
    steps: invention.steps.map((s, idx) => ({
      ...s,
      id: `${newId}-step-${idx + 1}`,
      instruction: s.instruction
        .replace(/wooden dowel/gi, "tightly rolled corrugated cardboard tube")
        .replace(/paracord/gi, "twisted scrap T-shirt strip")
        .replace(/brass eyelets/gi, "reinforced tape-backed punch holes")
        .replace(/bolt \+ wingnut/gi, "notched cardboard lock pin"),
    })),
    generatedBy: "local",
  };
}
