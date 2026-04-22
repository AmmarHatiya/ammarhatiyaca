import type { Metadata } from "next";
import { getProjects } from "@/lib/content";
import { ProjectsClient, type ProjectData } from "@/components/projects-client";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Cloud infrastructure, automation, and DevOps projects — from multi-cloud migrations to Kubernetes deployment platforms.",
  openGraph: {
    title: "Projects | Ammar Hatiya",
    description:
      "Cloud infrastructure, automation, and DevOps projects — from multi-cloud migrations to Kubernetes deployment platforms.",
  },
};

export default function ProjectsPage() {
  const projects = getProjects();

  // Flatten and deduplicate all stack tags for the filter
  const allTags = Array.from(
    new Set(projects.flatMap((p) => p.frontmatter.stack))
  ).sort();

  // Serialize for the client component
  const projectData: ProjectData[] = projects.map((p) => ({
    slug: p.slug,
    title: p.frontmatter.title,
    summary: p.frontmatter.summary,
    stack: p.frontmatter.stack,
    impact: p.frontmatter.impact,
    codeUrl: p.frontmatter.codeUrl,
    demoUrl: p.frontmatter.demoUrl,
    date: p.frontmatter.date,
    thumbnail: p.frontmatter.thumbnail,
  }));

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Projects
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        A curated collection of my infrastructure, software, and automation engineering work.
      </p>
      <div className="mt-8">
        <ProjectsClient projects={projectData} allTags={allTags} />
      </div>
    </main>
  );
}
