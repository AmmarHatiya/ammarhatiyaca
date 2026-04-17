"use client";

import { useState } from "react";
import { Code2, ExternalLink, LayoutGrid, List } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectImage } from "@/components/aspect-image";
import { cn } from "@/lib/utils";

export interface ProjectData {
  slug: string;
  title: string;
  summary: string;
  stack: string[];
  impact: string;
  codeUrl?: string;
  demoUrl?: string;
  date: string;
  thumbnail?: string;
}

interface Props {
  projects: ProjectData[];
  allTags: string[];
}

export function ProjectsClient({ projects, allTags }: Props) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = activeTag
    ? projects.filter((p) => p.stack.includes(activeTag))
    : projects;

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          <Button
            variant={activeTag === null ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTag(null)}
            aria-label="Show all projects"
            className="h-7 text-xs"
          >
            All
          </Button>
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={activeTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTag(tag)}
              aria-label={`Filter by ${tag}`}
              className="h-7 text-xs"
            >
              {tag}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-1 rounded-md border border-border p-0.5">
          <Button
            variant={view === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-7 w-7"
            onClick={() => setView("grid")}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-7 w-7"
            onClick={() => setView("list")}
            aria-label="List view"
          >
            <List className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Project cards — BUG 3/4 FIX:
          Grid uses items-stretch (default) so cards with images in the
          same row share uniform height. Cards without images naturally
          collapse because AspectImage returns null (no min-h forced).
          mt-auto on impact block anchors it to the bottom in both cases. */}
      <div
        className={cn(
          "mt-6",
          view === "grid"
            ? "grid gap-4 sm:grid-cols-2"
            : "flex flex-col gap-3"
        )}
      >
        {filtered.map((project) => {
          const hasImage = !!project.thumbnail;

          return (
            <Card
              key={project.slug}
              className={cn(
                "flex overflow-hidden",
                view === "list" ? "flex-row items-start" : "flex-col"
              )}
            >
              {/* Image slot: only rendered in grid view AND only when
                  thumbnail exists. AspectImage returns null for absent
                  src, so image-less cards have no empty slot (BUG 4). */}
              {view === "grid" && hasImage && (
                project.codeUrl ? (
                  <a
                    href={project.codeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer"
                    aria-label={`View source code for ${project.title}`}
                  >
                    <AspectImage
                      src={project.thumbnail}
                      alt={project.title}
                      aspect="16/9"
                    />
                  </a>
                ) : (
                  <AspectImage
                    src={project.thumbnail}
                    alt={project.title}
                    aspect="16/9"
                  />
                )
              )}

              {/* Card body — flex-col fills the card.
                  BUG 3 FIX: mt-auto on the impact block pushes it and
                  the footer to the card bottom regardless of content above. */}
              <div className={cn(
                "flex flex-1 flex-col",
                view === "list" && "min-w-0"
              )}>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">
                    {project.title}
                  </CardTitle>
                  <CardDescription
                    className={view === "list" ? "line-clamp-1" : "line-clamp-2"}
                  >
                    {project.summary}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  {/* mt-auto pushes impact to the bottom of CardContent,
                      aligning it across cards of varying content height */}
                  <div className="mt-2 mb-2 pt-3 rounded-md bg-[hsl(var(--muted))] px-3 py-2 text-xs font-medium text-[hsl(var(--primary))]">
                    {project.impact}
                  </div>
                </CardContent>
                <CardFooter className="gap-3">
                  {project.codeUrl && (
                    <a
                      href={project.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View source code for ${project.title}`}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Code2 className="h-3.5 w-3.5" /> Code
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View live demo for ${project.title}`}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Demo
                    </a>
                  )}
                </CardFooter>
              </div>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          No projects match the selected filter.
        </p>
      )}
    </>
  );
}
