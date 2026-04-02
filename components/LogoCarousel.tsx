"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

interface LogoCarouselProps {
    cards: ReactNode[];
    visibleCount: number;
    label: string;
    maxWidthClassName?: string;
}

const BUTTON_CLASS = "flex size-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition disabled:cursor-not-allowed disabled:opacity-35 enabled:hover:border-blue-300 enabled:hover:text-blue-600";

export function LogoCarousel({
    cards,
    visibleCount,
    label,
    maxWidthClassName = "max-w-[780px]",
}: LogoCarouselProps) {
    const [startIndex, setStartIndex] = useState(0);

    const maxStartIndex = Math.max(0, cards.length - visibleCount);
    const showControls = cards.length > visibleCount;
    const safeStartIndex = Math.min(startIndex, maxStartIndex);

    const visibleCards = useMemo(
        () => cards.slice(safeStartIndex, safeStartIndex + visibleCount),
        [cards, safeStartIndex, visibleCount]
    );

    if (cards.length === 0) {
        return null;
    }

    return (
        <div className={`mx-auto flex w-full items-center justify-center gap-2 sm:gap-4 ${maxWidthClassName}`}>
            {showControls && (
                <button
                    type="button"
                    aria-label={`Show previous ${label}`}
                    className={BUTTON_CLASS}
                    disabled={safeStartIndex === 0}
                    onClick={() => setStartIndex((current) => Math.max(0, current - 1))}
                >
                    <ChevronLeft className="size-5" />
                </button>
            )}

            <div
                className="grid min-w-0 flex-1 gap-4 sm:gap-5"
                style={{ gridTemplateColumns: `repeat(${visibleCount}, minmax(0, 1fr))` }}
            >
                {visibleCards.map((card, index) => (
                    <div key={`${safeStartIndex}-${index}`} className="min-w-0">
                        {card}
                    </div>
                ))}
            </div>

            {showControls && (
                <button
                    type="button"
                    aria-label={`Show next ${label}`}
                    className={BUTTON_CLASS}
                    disabled={safeStartIndex >= maxStartIndex}
                    onClick={() => setStartIndex((current) => Math.min(maxStartIndex, current + 1))}
                >
                    <ChevronRight className="size-5" />
                </button>
            )}
        </div>
    );
}