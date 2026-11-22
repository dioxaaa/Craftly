import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  ChevronDown,
  ChevronUp,
  ImagePlus,
  PenTool,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  Type as TypeIcon,
  X,
} from "lucide-react";
import type { InputMode, SynthesisInput, UserConstraints } from "../types/invention";
import { SketchCanvas } from "./SketchCanvas";

const EXAMPLE_PROMPTS = [
  "A broken umbrella with a bent metal frame.",
  "Empty plastic bottles and old cardboard.",
  "A worn-out electric fan that no longer spins.",
  "A cracked mug with a missing handle.",
  "Old clothes that I don't use anymore.",
];

const GOAL_PRESETS = [
  "Make it useful for my desk",
  "Turn it into something for plants",
  "Make something I can sell",
  "Create something for small spaces",
  "Make it useful for students",
  "Make something sustainable",
  "Make something unexpected",
];

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;

interface InputWorkspaceProps {
  input: SynthesisInput;
  isLoading: boolean;
  loadingPhrase: string;
  onChange: (next: SynthesisInput) => void;
  onSubmit: () => void;
  onToast: (message: string, tone?: "success" | "info") => void;
}

export const InputWorkspace: React.FC<InputWorkspaceProps> = ({
  input,
  isLoading,
  loadingPhrase,
  onChange,
  onSubmit,
  onToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [constraintsOpen, setConstraintsOpen] = useState(false);

  const updateField = <K extends keyof SynthesisInput>(
    key: K,
    value: SynthesisInput[K]
  ) => {
    onChange({ ...input, [key]: value });
  };

  const updateConstraint = <K extends keyof UserConstraints>(
    key: K,
    value: string
  ) => {
    onChange({
      ...input,
      constraints: {
        ...input.constraints,
        [key]: value,
      },
    });
  };

  const handlePhotoFile = (file: File) => {
    setPhotoError(null);
    if (!ACCEPTED_TYPES.includes(file.type.toLowerCase())) {
      setPhotoError(
        "Unsupported image format. Please choose a JPG, JPEG, PNG, or WEBP photo."
      );
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setPhotoError(
        "Photo exceeds 8 MB. Please select a smaller image file."
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange({
          ...input,
          mode: "photo",
          photoFileName: file.name,
          photoMimeType: file.type,
          photoDataUrl: reader.result,
        });
      }
    };
    reader.onerror = () => {
      setPhotoError("Could not read that image file. Try another photo.");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handlePhotoFile(file);
    }
  };

  const clearPhoto = () => {
    setPhotoError(null);
    onChange({
      ...input,
      photoFileName: undefined,
      photoMimeType: undefined,
      photoDataUrl: undefined,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const hasValidInput =
    input.textDescription.trim().length >= 3 ||
    Boolean(input.photoDataUrl) ||
    Boolean(input.sketchDataUrl);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasValidInput) {
      onToast(
        "Describe your object, upload a photo, or draw a quick sketch first.",
        "info"
      );
      return;
    }
    onSubmit();
  };

  const modes: Array<{ id: InputMode; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: "text", label: "Describe Object", icon: TypeIcon },
    { id: "photo", label: "Upload Photo", icon: Camera },
    { id: "sketch", label: "Draw Sketch", icon: PenTool },
  ];

  return (
    <form
      onSubmit={handleFormSubmit}
      className="rounded-2xl border-[1.5px] border-[#D8CFC0] bg-[#FFFDF9] p-4 shadow-sm sm:p-6 lg:p-8"
    >
      {/* Mode Switcher */}
      <div className="mb-5 flex flex-col gap-3 border-b border-[#D8CFC0] pb-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="Object input mode"
          className="grid w-full grid-cols-3 gap-1 rounded-xl border-[1.5px] border-[#D8CFC0] bg-[#F2EADF] p-1 sm:inline-flex sm:w-auto sm:gap-1.5"
        >
          {modes.map((m) => {
            const Icon = m.icon;
            const active = input.mode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => updateField("mode", m.id)}
                className={`flex min-h-[44px] flex-col items-center justify-center gap-1 rounded-lg px-1.5 py-1.5 text-[11px] font-semibold leading-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A3528] sm:min-h-[40px] sm:flex-row sm:gap-1.5 sm:whitespace-nowrap sm:px-4 sm:text-sm ${
                  active
                    ? "bg-[#4A3528] text-[#F9F6F0]"
                    : "text-[#4A3528] hover:bg-[#E7DDD0]"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="text-center">{m.label}</span>
              </button>
            );
          })}
        </div>

        <span className="font-mono-tech text-xs text-[#4A3528]/65">
          Step 01 — Material & Object Intake
        </span>
      </div>

      {/* Mode 1: Text Description */}
      {input.mode === "text" && (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="craftly-object-text"
              className="block text-sm font-bold text-[#4A3528]"
            >
              What object do you have on your workbench?
            </label>
            <p className="mt-0.5 text-xs text-[#4A3528]/70">
              Mention its materials, damage, or any parts that still feel sturdy.
            </p>
            <textarea
              id="craftly-object-text"
              rows={3}
              value={input.textDescription}
              onChange={(e) => updateField("textDescription", e.target.value)}
              placeholder="e.g., A broken umbrella with a bent metal frame and clean waterproof canopy..."
              className="mt-2.5 w-full rounded-2xl border-[1.5px] border-[#D8CFC0] bg-[#F9F6F0] px-4 py-3 text-base text-[#1C1B19] placeholder:text-[#4A3528]/45 focus:border-[#D98A6C] focus:bg-[#FFFDF9] focus:outline-none"
            />
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold text-[#4A3528]/75">
              Or start from a real household discard:
            </p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => updateField("textDescription", example)}
                  className="min-h-[38px] rounded-xl border border-[#D8CFC0] bg-[#F2EADF] px-3 py-1.5 text-left text-xs font-medium text-[#4A3528] transition-colors hover:border-[#D98A6C] hover:bg-[#EFE2D0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A3528]"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Photo Upload */}
      {input.mode === "photo" && (
        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handlePhotoFile(file);
            }}
            className="hidden"
            aria-label="Upload object photo"
          />

          {!input.photoDataUrl ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
                isDragging
                  ? "border-[#D98A6C] bg-[#F2EADF]"
                  : "border-[#D8CFC0] bg-[#F9F6F0] hover:border-[#D98A6C]"
              }`}
            >
              <ImagePlus className="h-9 w-9 text-[#D98A6C]" />
              <p className="mt-3 text-sm font-bold text-[#4A3528]">
                Drop a photo of your object here, or click to browse
              </p>
              <p className="mt-1 text-xs text-[#4A3528]/65">
                Supports JPG, JPEG, PNG, and WEBP up to 8 MB
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border-[1.5px] border-[#D8CFC0] bg-[#F9F6F0] p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <img
                  src={input.photoDataUrl}
                  alt={input.photoFileName || "Uploaded object"}
                  referrerPolicy="no-referrer"
                  className="h-36 w-full rounded-xl border border-[#D8CFC0] object-cover sm:w-44"
                />
                <div className="flex-1 space-y-2">
                  <p className="font-mono-tech text-xs text-[#7C8B6A]">
                    Photo attached
                  </p>
                  <p className="text-sm font-bold text-[#4A3528] break-all">
                    {input.photoFileName}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#D8CFC0] bg-[#FFFDF9] px-3 py-1.5 text-xs font-semibold text-[#4A3528] hover:bg-[#F2EADF]"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Replace Photo
                    </button>
                    <button
                      type="button"
                      onClick={clearPhoto}
                      className="flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#D8CFC0] bg-[#FFFDF9] px-3 py-1.5 text-xs font-semibold text-[#4A3528] hover:bg-[#F2EADF]"
                    >
                      <X className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {photoError && (
            <p
              role="alert"
              className="rounded-xl border border-[#D98A6C] bg-[#D98A6C]/15 px-3.5 py-2.5 text-xs font-medium text-[#4A3528]"
            >
              {photoError}
            </p>
          )}

          <div>
            <label
              htmlFor="craftly-photo-notes"
              className="block text-xs font-bold text-[#4A3528]"
            >
              Add notes about size, damage, or material (recommended)
            </label>
            <input
              id="craftly-photo-notes"
              type="text"
              value={input.textDescription}
              onChange={(e) => updateField("textDescription", e.target.value)}
              placeholder="e.g., Cracked ceramic mug, thick base is still solid"
              className="mt-1.5 w-full rounded-xl border-[1.5px] border-[#D8CFC0] bg-[#F9F6F0] px-3.5 py-2.5 text-sm text-[#1C1B19] placeholder:text-[#4A3528]/45 focus:border-[#D98A6C] focus:bg-[#FFFDF9] focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Mode 3: Sketch Drawing */}
      {input.mode === "sketch" && (
        <div className="space-y-4">
          <SketchCanvas
            initialDataUrl={input.sketchDataUrl}
            onChange={(url) => updateField("sketchDataUrl", url)}
            onToast={(msg) => onToast(msg, "success")}
          />

          <div>
            <label
              htmlFor="craftly-sketch-notes"
              className="block text-xs font-bold text-[#4A3528]"
            >
              What did you sketch, and what is it made of?
            </label>
            <input
              id="craftly-sketch-notes"
              type="text"
              value={input.textDescription}
              onChange={(e) => updateField("textDescription", e.target.value)}
              placeholder="e.g., Wooden crate with two broken slats"
              className="mt-1.5 w-full rounded-xl border-[1.5px] border-[#D8CFC0] bg-[#F9F6F0] px-3.5 py-2.5 text-sm text-[#1C1B19] placeholder:text-[#4A3528]/45 focus:border-[#D98A6C] focus:bg-[#FFFDF9] focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Goal Section */}
      <div className="mt-6 border-t border-[#D8CFC0] pt-5">
        <label
          htmlFor="craftly-goal"
          className="block text-sm font-bold text-[#4A3528]"
        >
          What should it become? <span className="font-normal text-[#4A3528]/60">(Optional)</span>
        </label>
        <input
          id="craftly-goal"
          type="text"
          value={input.goal}
          onChange={(e) => updateField("goal", e.target.value)}
          placeholder="e.g., Something practical for a small desk, or a self-watering herb stand"
          className="mt-2 w-full rounded-xl border-[1.5px] border-[#D8CFC0] bg-[#F9F6F0] px-4 py-2.5 text-sm text-[#1C1B19] placeholder:text-[#4A3528]/45 focus:border-[#D98A6C] focus:bg-[#FFFDF9] focus:outline-none"
        />

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {GOAL_PRESETS.map((preset) => {
            const selected = input.goal === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => updateField("goal", selected ? "" : preset)}
                className={`min-h-[36px] rounded-xl border px-3 py-1 text-xs font-semibold transition-colors ${
                  selected
                    ? "border-[#4A3528] bg-[#4A3528] text-[#F9F6F0]"
                    : "border-[#D8CFC0] bg-[#F9F6F0] text-[#4A3528] hover:border-[#D98A6C] hover:bg-[#F2EADF]"
                }`}
              >
                {preset}
              </button>
            );
          })}
        </div>
      </div>

      {/* Collapsible Optional Constraints */}
      <div className="mt-5 border-t border-[#D8CFC0] pt-4">
        <button
          type="button"
          onClick={() => setConstraintsOpen((prev) => !prev)}
          aria-expanded={constraintsOpen}
          className="flex min-h-[44px] w-full items-center justify-between rounded-xl px-2 py-1 text-left text-sm font-semibold text-[#4A3528] hover:bg-[#F2EADF]"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-[#7C8B6A]" />
            <span>Workshop Constraints (Tools, Budget, Skill, Space)</span>
          </span>
          {constraintsOpen ? (
            <ChevronUp className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" />
          )}
        </button>

        <AnimatePresence initial={false}>
          {constraintsOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <div className="mt-3 grid grid-cols-1 gap-3 rounded-2xl border border-[#D8CFC0] bg-[#F9F6F0] p-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A3528]">
                    Tools available
                  </label>
                  <input
                    type="text"
                    value={input.constraints.tools}
                    onChange={(e) => updateConstraint("tools", e.target.value)}
                    placeholder="Scissors, pliers, tape"
                    className="mt-1 w-full rounded-lg border border-[#D8CFC0] bg-[#FFFDF9] px-3 py-2 text-xs text-[#1C1B19]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A3528]">
                    Extra materials on hand
                  </label>
                  <input
                    type="text"
                    value={input.constraints.availableMaterials}
                    onChange={(e) =>
                      updateConstraint("availableMaterials", e.target.value)
                    }
                    placeholder="Twine, wood scraps, glue"
                    className="mt-1 w-full rounded-lg border border-[#D8CFC0] bg-[#FFFDF9] px-3 py-2 text-xs text-[#1C1B19]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A3528]">
                    Max budget (PHP)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={input.constraints.budgetPhp}
                    onChange={(e) => updateConstraint("budgetPhp", e.target.value)}
                    placeholder="100"
                    className="mt-1 w-full rounded-lg border border-[#D8CFC0] bg-[#FFFDF9] px-3 py-2 text-xs text-[#1C1B19]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A3528]">
                    Skill level
                  </label>
                  <select
                    value={input.constraints.skillLevel}
                    onChange={(e) =>
                      updateConstraint("skillLevel", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-[#D8CFC0] bg-[#FFFDF9] px-3 py-2 text-xs text-[#1C1B19]"
                  >
                    <option value="">Any level</option>
                    <option value="Beginner">Beginner (no power tools)</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced maker</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A3528]">
                    Space limitation
                  </label>
                  <input
                    type="text"
                    value={input.constraints.spaceLimitation}
                    onChange={(e) =>
                      updateConstraint("spaceLimitation", e.target.value)
                    }
                    placeholder="Small dorm desk, balcony"
                    className="mt-1 w-full rounded-lg border border-[#D8CFC0] bg-[#FFFDF9] px-3 py-2 text-xs text-[#1C1B19]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A3528]">
                    Intended user / function
                  </label>
                  <input
                    type="text"
                    value={input.constraints.intendedUser}
                    onChange={(e) =>
                      updateConstraint("intendedUser", e.target.value)
                    }
                    placeholder="Student, gardener, studio"
                    className="mt-1 w-full rounded-lg border border-[#D8CFC0] bg-[#FFFDF9] px-3 py-2 text-xs text-[#1C1B19]"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Primary Action */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[#4A3528]/70">
          Generates 3 distinct concepts—Practical, Unexpected, and Experimental—with 3D assembly references.
        </p>

        <button
          type="submit"
          disabled={isLoading}
          className="flex min-h-[48px] w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#D98A6C] px-6 py-3 text-center text-sm font-bold text-[#1C1B19] shadow-sm transition-colors hover:bg-[#C67658] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A3528] disabled:cursor-wait disabled:opacity-80 sm:w-auto"
        >
          <Sparkles className="h-4 w-4 shrink-0" />
          <span>{isLoading ? loadingPhrase : "See what else it could be"}</span>
        </button>
      </div>
    </form>
  );
};
