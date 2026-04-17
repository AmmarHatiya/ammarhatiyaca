/**
 * SearchResultCard — A single polymorphic component handles all three
 * content types (blog, project, experience). This avoids code duplication
 * since the card structure (title link → description → badges) is nearly
 * identical across types; only the specific fields and link targets differ.
 */

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ReactNode } from "react";

/* ── Shared types ── */

interface BlogResult {
  type: "blog";
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  date: string;
}

interface ProjectResult {
  type: "project";
  slug: string;
  title: string;
  summary: string;
  stack: string[];
  impact: string;
}

interface ExperienceResult {
  type: "experience";
  slug: string;
  title: string;
  company: string;
  technologies: string[];
}

export type SearchResult = BlogResult | ProjectResult | ExperienceResult;

interface Props {
  result: SearchResult;
  query: string;
}

/* ── Highlight helper ──
   Wraps matched substrings in <mark> with appropriate styling.
   Uses a case-insensitive split so the original casing is preserved.
   The full original text stays in the DOM (WCAG: line-clamp does not
   remove content, mark does not alter semantics). */

function highlightMatch(text: string, query: string): ReactNode {
  if (!query || query.length < 2) return text;

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  if (parts.length === 1) return text;

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="rounded-sm bg-yellow-100 px-0.5 dark:bg-yellow-900"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

/* ── Card component ── */

export function SearchResultCard({ result, query }: Props) {
  switch (result.type) {
    case "blog": {
      const formattedDate = new Date(result.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      return (
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="min-w-0">
              <CardTitle className="text-base font-semibold">
                <Link
                  href={`/blog/${result.slug}`}
                  className="hover:underline"
                  aria-label={`Read article: ${result.title}`}
                >
                  {highlightMatch(result.title, query)}
                </Link>
              </CardTitle>
            </div>
            <span className="flex-shrink-0 text-xs text-muted-foreground">
              {formattedDate}
            </span>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {highlightMatch(result.summary, query)}
            </p>
            {result.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {result.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {highlightMatch(tag, query)}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      );
    }

    case "project":
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              <Link
                href={`/projects`}
                className="hover:underline"
                aria-label={`View project: ${result.title}`}
              >
                {highlightMatch(result.title, query)}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {highlightMatch(result.summary, query)}
            </p>
            {result.stack.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {result.stack.map((tech) => (
                  <Badge key={tech} variant="outline">
                    {highlightMatch(tech, query)}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      );

    case "experience":
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              <Link
                href={`/experience#${result.slug}`}
                className="hover:underline"
                aria-label={`View experience: ${result.title} at ${result.company}`}
              >
                {highlightMatch(result.title, query)}
                <span className="ml-1.5 font-normal text-muted-foreground">
                  at {highlightMatch(result.company, query)}
                </span>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {result.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {highlightMatch(tech, query)}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      );
  }
}
