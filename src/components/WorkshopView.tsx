import React, { useMemo, useState } from "react";
import { ArrowRight, Filter, Heart, Search, Trash2 } from "lucide-react";
import { formatEstimatedCost } from "../config/currency";
import type {
  CurrencyCode,
  DirectionType,
  SavedCreation,
} from "../types/invention";
import { CurrencySelector } from "./CurrencySelector";

interface WorkshopViewProps {
  creations: SavedCreation[];
  currency: CurrencyCode;
  onCurrencyChange: (code: CurrencyCode) => void;
  onOpenCreation: (entry: SavedCreation) => void;
  onToggleFavorite: (id: string) => void;
  onDeleteCreation: (id: string) => void;
  onGoDiscover: () => void;
}

export type DirectionFilter = "ALL" | DirectionType;

export const WorkshopView: React.FC<WorkshopViewProps> = ({
  creations,
  currency,
  onCurrencyChange,
  onOpenCreation,
  onToggleFavorite,
  onDeleteCreation,
  onGoDiscover,
}) => {
  const [query, setQuery] = useState("");
  const [directionFilter, setDirectionFilter] = useState<DirectionFilter>("ALL");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return creations.filter((entry) => {
      if (favoritesOnly && !entry.isFavorite) return false;
      if (
        directionFilter !== "ALL" &&
        entry.invention.direction !== directionFilter
      ) {
        return false;
      }
      if (!q) return true;
      return (
        entry.invention.name.toLowerCase().includes(q) ||
        entry.invention.category.toLowerCase().includes(q) ||
        entry.analysis.objectName.toLowerCase().includes(q)
      );
    });
  }, [creations, directionFilter, favoritesOnly, query]);

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border-[1.5px] border-[#D8CFC0] bg-[#FFFDF9] p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono-tech text-xs font-medium uppercase tracking-wider text-[#7C8B6A]">
              Saved Blueprints
            </p>
            <h1 className="font-display mt-1 text-2xl font-bold text-[#4A3528] sm:text-3xl">
              My Workshop
            </h1>
            <p className="mt-1 text-sm text-[#4A3528]/75">
              Reopen saved blueprints, track build steps, and compare material costs.
            </p>
          </div>

          <CurrencySelector
            currency={currency}
            onChange={onCurrencyChange}
            showDisclaimer={false}
          />
        </div>

        {creations.length > 0 && (
          <div className="mt-5 flex flex-col gap-3 border-t border-[#D8CFC0] pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:min-w-[220px] sm:max-w-sm">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4A3528]/50" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search saved creations or objects..."
                aria-label="Search saved creations"
                className="min-h-[44px] w-full rounded-xl border-[1.5px] border-[#D8CFC0] bg-[#F9F6F0] pl-10 pr-3.5 text-sm text-[#1C1B19] placeholder:text-[#4A3528]/45 focus:border-[#D98A6C] focus:bg-[#FFFDF9] focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative flex flex-1 items-center sm:flex-initial">
                <Filter className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-[#7C8B6A]" />
                <select
                  value={directionFilter}
                  onChange={(e) =>
                    setDirectionFilter(e.target.value as DirectionFilter)
                  }
                  aria-label="Filter by invention category"
                  className="min-h-[44px] w-full cursor-pointer rounded-xl border-[1.5px] border-[#D8CFC0] bg-[#F9F6F0] pl-8 pr-8 text-xs font-semibold text-[#4A3528] transition-colors hover:border-[#4A3528]/40 focus:border-[#D98A6C] focus:bg-[#FFFDF9] focus:outline-none sm:w-auto"
                >
                  <option value="ALL">All Categories</option>
                  <option value="PRACTICAL">Practical</option>
                  <option value="UNEXPECTED">Unexpected</option>
                  <option value="EXPERIMENTAL">Experimental</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setFavoritesOnly((prev) => !prev)}
                className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl border px-4 py-2 text-xs font-semibold transition-colors sm:flex-initial ${
                  favoritesOnly
                    ? "border-[#D98A6C] bg-[#D98A6C] text-[#1C1B19]"
                    : "border-[#D8CFC0] bg-[#F2EADF] text-[#4A3528] hover:bg-[#EAE0D0]"
                }`}
              >
                <Heart
                  className={`h-4 w-4 ${favoritesOnly ? "fill-[#1C1B19]" : ""}`}
                />
                <span>Favorites Only</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {creations.length === 0 ? (
        <div className="rounded-2xl border-[1.5px] border-dashed border-[#D8CFC0] bg-[#F2EADF]/70 p-10 text-center">
          <h2 className="font-display text-xl font-semibold text-[#4A3528]">
            Your workshop bench is empty
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#4A3528]/75">
            Describe an everyday discard, upload a photo, or sketch a broken item to save your favorite invention blueprints here.
          </p>
          <button
            type="button"
            onClick={onGoDiscover}
            className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#D98A6C] px-5 py-2.5 text-sm font-bold text-[#1C1B19] hover:bg-[#C67658]"
          >
            <span>Explore Inventions</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border-[1.5px] border-[#D8CFC0] bg-[#FFFDF9] p-8 text-center">
          <p className="text-sm font-medium text-[#4A3528]/75">
            No saved creations match your current search or filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setDirectionFilter("ALL");
              setFavoritesOnly(false);
            }}
            className="mt-3 min-h-[40px] rounded-xl border border-[#D8CFC0] bg-[#F2EADF] px-4 py-1.5 text-xs font-semibold text-[#4A3528] hover:bg-[#EAE0D0]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((entry) => {
            const totalSteps = entry.invention.steps.length;
            const doneCount = entry.invention.steps.filter((s) =>
              entry.completedStepIds.includes(s.id)
            ).length;
            const pct =
              totalSteps > 0 ? Math.round((doneCount / totalSteps) * 100) : 0;
            const isConfirmingDelete = pendingDeleteId === entry.id;

            return (
              <article
                key={entry.id}
                className="flex flex-col justify-between rounded-2xl border-[1.5px] border-[#D8CFC0] bg-[#FFFDF9] p-5 shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 border-b border-[#D8CFC0] pb-3">
                    <div>
                      <span className="font-mono-tech text-xs font-semibold text-[#D98A6C]">
                        {entry.invention.direction}
                      </span>
                      <p className="text-xs text-[#4A3528]/65">
                        From: {entry.analysis.objectName}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(entry.id)}
                      aria-label={
                        entry.isFavorite
                          ? "Remove favorite"
                          : "Favorite creation"
                      }
                      className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl hover:bg-[#F2EADF]"
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          entry.isFavorite
                            ? "fill-[#D98A6C] text-[#D98A6C]"
                            : "text-[#4A3528]/60"
                        }`}
                      />
                    </button>
                  </div>

                  <h2 className="font-display mt-3 text-lg font-semibold text-[#1C1B19]">
                    {entry.invention.name}
                  </h2>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#4A3528]/80">
                    {entry.invention.oneLineDescription}
                  </p>

                  {/* Checklist Progress */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#4A3528]">
                        Build Progress
                      </span>
                      <span className="font-mono-tech text-[#4A3528]/75">
                        {doneCount}/{totalSteps} steps ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#F2EADF]">
                      <div
                        className="h-full rounded-full bg-[#7C8B6A]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="font-mono-tech mt-3 flex items-center justify-between text-xs text-[#4A3528]/75">
                    <span>
                      {formatEstimatedCost(
                        entry.invention.estimatedCostPhp,
                        currency
                      )}
                    </span>
                    <span>{entry.invention.buildTimeMinutes} min</span>
                  </div>
                </div>

                <div className="mt-5 space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => onOpenCreation(entry)}
                    className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#4A3528] px-4 py-2 text-xs font-bold text-[#F9F6F0] transition-colors hover:bg-[#1C1B19]"
                  >
                    <span>Open Blueprint</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                  {isConfirmingDelete ? (
                    <div className="flex items-center gap-2 rounded-xl border border-[#D98A6C] bg-[#F2EADF] p-2">
                      <span className="flex-1 text-xs font-semibold text-[#4A3528]">
                        Remove blueprint?
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteCreation(entry.id);
                          setPendingDeleteId(null);
                        }}
                        className="min-h-[34px] rounded-lg bg-[#D98A6C] px-2.5 py-1 text-xs font-bold text-[#1C1B19]"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDeleteId(null)}
                        className="min-h-[34px] rounded-lg bg-[#FFFDF9] px-2.5 py-1 text-xs font-semibold text-[#4A3528]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPendingDeleteId(entry.id)}
                      className="flex min-h-[38px] w-full items-center justify-center gap-1.5 rounded-xl border border-[#D8CFC0] bg-[#F9F6F0] px-3 py-1.5 text-xs font-semibold text-[#4A3528]/80 hover:border-[#D98A6C] hover:text-[#4A3528]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
