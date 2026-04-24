"use client";

import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  X,
  SearchX,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SearchResultCard,
  type SearchResult,
} from "@/components/search-result-card";
import Fuse, { type IFuseOptions } from "fuse.js";

/* ── Types for the search index ── */

interface BlogEntry {
  type: "blog";
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  date: string;
}

interface ProjectEntry {
  type: "project";
  slug: string;
  title: string;
  summary: string;
  stack: string[];
  impact: string;
}

interface ExperienceEntry {
  type: "experience";
  slug: string;
  title: string;
  company: string;
  technologies: string[];
}

type IndexEntry = BlogEntry | ProjectEntry | ExperienceEntry;

/* ── Fuse configuration per content type ── */

const FUSE_OPTIONS_BLOG: IFuseOptions<BlogEntry> = {
  threshold: 0.3,
  includeScore: true,
  ignoreLocation: true,
  keys: [
    { name: "title", weight: 0.5 },
    { name: "summary", weight: 0.3 },
    { name: "tags", weight: 0.2 },
  ],
};

const FUSE_OPTIONS_PROJECT: IFuseOptions<ProjectEntry> = {
  threshold: 0.3,
  includeScore: true,
  ignoreLocation: true,
  keys: [
    { name: "title", weight: 0.5 },
    { name: "summary", weight: 0.3 },
    { name: "stack", weight: 0.2 },
  ],
};

const FUSE_OPTIONS_EXPERIENCE: IFuseOptions<ExperienceEntry> = {
  threshold: 0.3,
  includeScore: true,
  ignoreLocation: true,
  keys: [
    { name: "title", weight: 0.5 },
    { name: "company", weight: 0.3 },
    { name: "technologies", weight: 0.2 },
  ],
};

/* ── Suspense wrapper (required for useSearchParams with static export) ── */

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Search</h1>
          <div className="mt-6">
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="mt-8 space-y-3">
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        </main>
      }
    >
      <SearchContent />
    </Suspense>
  );
}

/* ── Main search content ── */

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  /* Typed result arrays */
  const [blogResults, setBlogResults] = useState<BlogEntry[]>([]);
  const [projectResults, setProjectResults] = useState<ProjectEntry[]>([]);
  const [experienceResults, setExperienceResults] = useState<ExperienceEntry[]>([]);

  /* Fuse instances — cached in ref so they survive re-renders */
  const fuseRef = useRef<{
    blog: Fuse<BlogEntry>;
    project: Fuse<ProjectEntry>;
    experience: Fuse<ExperienceEntry>;
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  /* ── Fetch index on mount ── */
  useEffect(() => {
    fetch("/search-index.json")
      .then((res) => {
        if (!res.ok) throw new Error("fetch failed");
        return res.json() as Promise<IndexEntry[]>;
      })
      .then((entries) => {
        const blogs = entries.filter((e): e is BlogEntry => e.type === "blog");
        const projects = entries.filter((e): e is ProjectEntry => e.type === "project");
        const experiences = entries.filter((e): e is ExperienceEntry => e.type === "experience");

        fuseRef.current = {
          blog: new Fuse(blogs, FUSE_OPTIONS_BLOG),
          project: new Fuse(projects, FUSE_OPTIONS_PROJECT),
          experience: new Fuse(experiences, FUSE_OPTIONS_EXPERIENCE),
        };

        setLoading(false);

        /* If there's an initial ?q, run search immediately */
        if (initialQuery) {
          runSearch(initialQuery);
        }
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Search function ── */
  const runSearch = useCallback((q: string) => {
    if (!fuseRef.current || !q.trim()) {
      setBlogResults([]);
      setProjectResults([]);
      setExperienceResults([]);
      return;
    }

    const trimmed = q.trim();
    setBlogResults(fuseRef.current.blog.search(trimmed).map((r) => r.item));
    setProjectResults(fuseRef.current.project.search(trimmed).map((r) => r.item));
    setExperienceResults(fuseRef.current.experience.search(trimmed).map((r) => r.item));
  }, []);

  /* ── Debounced input handler ── */
  const handleInputChange = useCallback(
    (value: string) => {
      setQuery(value);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        setDebouncedQuery(value);
        runSearch(value);

        /* Update URL query param without adding history entries */
        if (value.trim()) {
          router.replace(`/search?q=${encodeURIComponent(value.trim())}`, {
            scroll: false,
          });
        } else {
          router.replace("/search", { scroll: false });
        }
      }, 150);
    },
    [runSearch, router]
  );

  /* ── Clear handler ── */
  const handleClear = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
    setBlogResults([]);
    setProjectResults([]);
    setExperienceResults([]);
    router.replace("/search", { scroll: false });
    inputRef.current?.focus();
  }, [router]);

  /* ── Auto-focus input on mount (for global Ctrl+K shortcut) ── */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /* ── Listen for focus-search event when already on search page ── */
  useEffect(() => {
    function handleFocusSearch() {
      inputRef.current?.focus();
    }

    window.addEventListener("focus-search", handleFocusSearch);
    return () => window.removeEventListener("focus-search", handleFocusSearch);
  }, []);

  /* ── Cleanup debounce on unmount ── */
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const hasResults =
    blogResults.length > 0 ||
    projectResults.length > 0 ||
    experienceResults.length > 0;
  const hasQuery = debouncedQuery.trim().length > 0;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Search</h1>

      {/* Search input */}
      <div className="relative mt-6">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Search articles, projects, experience..."
          aria-label="Search across all content"
          className="pl-9 pr-9"
        />
        {query.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Keyboard hint */}
      <p className="mt-2 text-xs text-muted-foreground">
        Press{" "}
        <kbd className="rounded border border-border bg-muted px-1 py-0.5 text-[10px] font-medium">
          ⌘K
        </kbd>{" "}
        to focus
      </p>

      {/* Results area */}
      <div className="mt-8">
        {/* Loading state */}
        {loading && (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
            <AlertCircle className="h-8 w-8" />
            <p className="text-sm">Search unavailable</p>
          </div>
        )}

        {/* No results */}
        {!loading && !error && hasQuery && !hasResults && (
          <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
            <SearchX className="h-8 w-8" />
            <p className="text-sm">
              No results for &ldquo;{debouncedQuery}&rdquo;
            </p>
          </div>
        )}

        {/* Grouped results */}
        {!loading && !error && hasResults && (
          <div className="space-y-8">
            {/* Articles */}
            {blogResults.length > 0 && (
              <section aria-label="Article results">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Articles
                </h2>
                <div className="space-y-3">
                  {blogResults.map((item) => (
                    <SearchResultCard
                      key={item.slug}
                      result={item as SearchResult}
                      query={debouncedQuery}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {projectResults.length > 0 && (
              <section aria-label="Project results">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Projects
                </h2>
                <div className="space-y-3">
                  {projectResults.map((item) => (
                    <SearchResultCard
                      key={item.slug}
                      result={item as SearchResult}
                      query={debouncedQuery}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Experience */}
            {experienceResults.length > 0 && (
              <section aria-label="Experience results">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Experience
                </h2>
                <div className="space-y-3">
                  {experienceResults.map((item) => (
                    <SearchResultCard
                      key={item.slug}
                      result={item as SearchResult}
                      query={debouncedQuery}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
