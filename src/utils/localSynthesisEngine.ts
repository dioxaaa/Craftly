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
    key: "tin_can",
    keywords: ["tin can", "can", "cans", "coffee tin", "cookie tin", "metal can", "jar", "mason jar", "glass jar"],
    objectName: "Metal Tin / Glass Jar",
    category: "Rigid Food Container",
    originalFunction: "Airtight pantry preservation",
    defaultCondition: ["empty", "clean rigid walls"],
    physicalProperties: [
      "rigid vertical wall",
      "non-flammable",
      "magnetic (if steel tin)",
      "watertight base",
    ],
    shapeProfile: "Open-top rigid cylinder",
    components: ["rolled rim", "ribbed cylinder wall", "stamped base"],
    materials: ["tin-plated steel or soda-lime glass"],
    reusableParts: ["cylindrical shell", "rolled rim collar", "removable lid"],
    potentialFunctions: ["magnetic wall spice/tool pod", "perforated lantern sconce", "gravity-fed twine dispenser", "modular desktop riser"],
    limitations: ["cut tin edges must be crimped or taped", "glass requires gentle handling when drilling"],
    primaryFinish: "brushed_metal",
    secondaryFinish: "terracotta",
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
    potentialFunctions: ["cantilevered desk shelf", "vertical herb ladder", "modular pegboard caddy", "angled laptop & book lectern"],
    limitations: ["splinters require 120-grit sanding", "unsealed timber warps in standing water"],
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

  if (photoFileName) {
    const base = photoFileName
      .replace(/\.[^.]+$/, "")
      .replace(/[-_]+/g, " ")
      .trim();
    if (base.length >= 3) {
      return titleCase(base);
    }
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

export function analyzeObjectInput(input: SynthesisInput): ObjectAnalysis {
  const combinedSource = [
    input.textDescription,
    input.photoFileName ? input.photoFileName.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ") : "",
  ]
    .filter(Boolean)
    .join(" ");

  const lower = normalizeText(combinedSource);
  const matchedProfile = OBJECT_PROFILES.find((profile) =>
    profile.keywords.some((kw) => lower.includes(kw))
  );

  const goalSummary = input.goal.trim() || input.constraints.desiredFunction.trim() || "Everyday functional second life";

  let analysisNote: string | undefined;
  if (input.mode === "photo" && input.photoFileName) {
    analysisNote =
      "Local studio synthesis uses your written description and image file metadata (" +
      input.photoFileName +
      ") rather than cloud vision pixel inspection.";
  } else if (input.mode === "sketch") {
    analysisNote =
      "Local studio synthesis combines your sketch geometry notes and object description to propose buildable structures.";
  }

  if (matchedProfile) {
    return {
      objectName:
        input.textDescription.trim().length > 0
          ? cleanObjectPhrase(input.textDescription, input.photoFileName)
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
  const objectName = cleanObjectPhrase(input.textDescription, input.photoFileName);

  return {
    objectName,
    category: "Salvaged Everyday Object",
    originalFunction: `Original household utility of ${objectName.toLowerCase()}`,
    condition: extractConditionSignals(combinedSource, ["unused or partially worn", "reusable core structure"]),
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

  // Dynamic contextual builder for all other object profiles (cardboard, electric_fan, mug, clothes, tin_can, wood_crate, or arbitrary unknown items)
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
  const goalPhrase = goalText.trim() || "daily creative workspace use";

  const rotationOffset = batchSeed % 3;

  const practicalTitles = [
    `Slotted ${name} Desk & Studio Organizer`,
    `Cantilevered ${name} Tool & Cable Station`,
    `Modular ${name} Tabletop Caddy & Tray`,
  ];
  const unexpectedTitles = [
    `Passive ${name} Botanical Terrarium & Wick Stand`,
    `Nested ${name} Acoustic & Shelf Pocket Dock`,
    `Suspended ${name} Micro-Herb & Supply Cradle`,
  ];
  const experimentalTitles = [
    `Counterbalanced ${name} Kinetic Lamp & Reflector`,
    `Gravity-Tensioned ${name} Articulated Easel`,
    `Zero-Power ${name} Cooling & Drying Carousel`,
  ];

  const practicalName = practicalTitles[rotationOffset];
  const unexpectedName = unexpectedTitles[rotationOffset];
  const experimentalName = experimentalTitles[rotationOffset];

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

  const budgetVal = Number(input.constraints.budgetPhp);
  if (Number.isFinite(budgetVal) && budgetVal > 0 && costPhp > budgetVal) {
    costPhp = Math.max(0, Math.round(budgetVal * 0.85));
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
  const combinedSource = normalizeText(
    `${input.textDescription} ${input.photoFileName ?? ""}`
  );
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
      studioPrompt: `Studio product photograph of ${finalName}, handmade upcycled craft built from ${analysis.objectName}, warm wooden workbench, soft daylight, architectural craft aesthetic`,
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
