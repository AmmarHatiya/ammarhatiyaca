"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { VisuallyHidden } from "@/components/visually-hidden";

export interface LightboxImage {
  src: string;
  alt: string;
}

interface Props {
  images: LightboxImage[];
  initialIndex?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * ImageLightbox — full-screen image viewer built on shadcn Dialog.
 * Supports keyboard navigation (ArrowLeft/Right, Escape), prev/next
 * arrows, close on overlay click, and alt text as caption.
 */
export function ImageLightbox({
  images,
  initialIndex = 0,
  open,
  onOpenChange,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Reset index when lightbox opens with a new initial position
  useEffect(() => {
    if (open) setCurrentIndex(initialIndex);
  }, [open, initialIndex]);

  const hasMultiple = images.length > 1;

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!open || !hasMultiple) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, hasMultiple, goNext, goPrev]);

  if (images.length === 0) return null;

  const current = images[currentIndex];
  if (!current) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* BUG 1 FIX: Use inline style for max-width/max-height to guarantee
          they override the base DialogContent defaults (sm:max-w-sm).
          showCloseButton={false} prevents the duplicate close button. */}
      <DialogContent
        showCloseButton={false}
        className="flex flex-col items-center gap-0 border-none bg-background/95 p-6 backdrop-blur-sm sm:rounded-lg"
        style={{ maxWidth: "90vw", maxHeight: "85vh" }}
      >
        {/* Accessible title (visually hidden since the image IS the content) */}
        <VisuallyHidden>
          <DialogTitle>Image viewer</DialogTitle>
          <DialogDescription>
            {current.alt || "Image"} — {currentIndex + 1} of {images.length}
          </DialogDescription>
        </VisuallyHidden>

        {/* Single close button — top-right */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full"
          onClick={() => onOpenChange(false)}
          aria-label="Close lightbox"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Image container — scrolls vertically for tall images */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-y-auto">
          {/* Prev arrow */}
          {hasMultiple && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 z-10 h-10 w-10 rounded-full bg-background/60 backdrop-blur-sm"
              onClick={goPrev}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}

          <Image
            src={current.src}
            alt={current.alt || ""}
            width={1200}
            height={800}
            className="max-h-[calc(85vh-8rem)] w-auto rounded-md object-contain"
            priority
          />

          {/* Next arrow */}
          {hasMultiple && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 z-10 h-10 w-10 rounded-full bg-background/60 backdrop-blur-sm"
              onClick={goNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* BUG 2 FIX: Caption + counter in a fixed-height row.
            Alt text is clamped to 2 lines with title tooltip fallback.
            Counter is flex-shrink-0 so it never wraps. */}
        <div className="flex w-full items-start justify-between gap-4 border-t border-border/50 px-4 py-2.5">
          <p
            className="line-clamp-2 min-w-0 flex-1 text-sm text-muted-foreground"
            title={current.alt || "Image"}
          >
            {current.alt || "Image"}
          </p>
          {hasMultiple && (
            <span className="flex-shrink-0 whitespace-nowrap text-sm text-muted-foreground">
              {currentIndex + 1} / {images.length}
            </span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
