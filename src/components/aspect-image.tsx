import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * AspectImage — thin wrapper around next/image that enforces an aspect-ratio
 * slot. Handles graceful degradation: if src is null/undefined, renders nothing
 * (no placeholder box) unless showPlaceholder is explicitly true.
 */

interface Props {
  src?: string | null;
  alt: string;
  /** Aspect ratio as "w/h" — maps to Tailwind aspect-[w/h] */
  aspect?: "16/9" | "4/3" | "1/1";
  /** Fixed pixel dimensions — used for small logos/badges */
  width?: number;
  height?: number;
  /** If true, show a muted placeholder when src is absent */
  showPlaceholder?: boolean;
  /** Additional classes on the outer wrapper */
  className?: string;
  /** next/image priority prop for LCP images */
  priority?: boolean;
  /** Object-fit mode */
  objectFit?: "cover" | "contain";
  /** Optional click handler for lightbox integration */
  onClick?: () => void;
}

export function AspectImage({
  src,
  alt,
  aspect,
  width,
  height,
  showPlaceholder = false,
  className,
  priority = false,
  objectFit = "cover",
  onClick,
}: Props) {
  /* ── INVARIANT A: Graceful degradation ──
     No src and no placeholder requested → render nothing */
  if (!src && !showPlaceholder) return null;

  /* ── Fixed-size mode (logos, badges) ── */
  if (width && height && !aspect) {
    if (!src) return null; // No placeholder for tiny fixed-size images
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          objectFit === "contain" ? "object-contain" : "object-cover",
          className
        )}
        priority={priority}
      />
    );
  }

  /* ── Aspect-ratio mode ── */
  // Build Tailwind aspect class — can't use dynamic template with JIT,
  // so we map to known utility classes
  const aspectMap: Record<string, string> = {
    "16/9": "aspect-video",          // Tailwind built-in 16:9
    "4/3": "aspect-[4/3]",
    "1/1": "aspect-square",          // Tailwind built-in 1:1
  };
  const resolvedAspect = aspectMap[aspect || "16/9"] || "aspect-video";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        resolvedAspect,
        !src && "bg-muted",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") onClick(); } : undefined}
      aria-label={onClick ? `View ${alt}` : undefined}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className={cn(
            objectFit === "contain" ? "object-contain" : "object-cover"
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
        />
      ) : (
        /* Placeholder: subtle muted background — no broken image feel */
        <div className="flex h-full w-full items-center justify-center">
          <svg
            className="h-8 w-8 text-muted-foreground/30"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        </div>
      )}
    </div>
  );
}
