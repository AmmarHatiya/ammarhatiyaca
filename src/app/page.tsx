import Link from "next/link";
import { ArrowRight, Download, ExternalLink, Code2 } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { AspectImage } from "@/components/aspect-image";
import { getSkills, getFeaturedProjects } from "@/lib/content";

export default function HomePage() {
  const skills = getSkills();
  const featuredProjects = getFeaturedProjects();

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6">
      {/* ── HERO ── */}
      <section
        aria-label="Introduction"
        className="flex flex-col items-start justify-center py-20 sm:py-28"
      >
        <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Ammar Hatiya
        </h1>
        <p className="mt-2 text-lg font-medium text-[hsl(var(--primary))]">
          Cloud &amp; Automation Engineer
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          I design and build scalable cloud infrastructure, deployment
          platforms, and automation systems that help engineering teams ship
          faster. Specializing in AWS, Kubernetes, and infrastructure-as-code,
          I turn complex cloud challenges into reliable, cost-efficient
          solutions.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/projects">
            <Button>
              View Projects <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/resume">
            <Button variant="outline">
              <Download className="mr-1 h-4 w-4" /> Download Resume
            </Button>
          </Link>
        </div>
      </section>

      {/* ── SKILLS GRID ── */}
      <section aria-label="Technical skills" className="pb-16">
        <h2 className="text-xl font-semibold tracking-tight">Skills</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category}>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                {category}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {items.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PROJECTS ── */}
      <section aria-label="Featured projects" className="pb-16">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">
            Featured Projects
          </h2>
          <Link
            href="/projects"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.slice(0, 3).map((project) => (
            <Card key={project.slug} className="flex flex-col overflow-hidden">
              {/* INVARIANT A: No thumbnail → card renders cleanly without image slot */}
              <AspectImage
                src={project.frontmatter.thumbnail}
                alt={project.frontmatter.title}
                aspect="16/9"
                className="rounded-t-lg"
              />
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  {project.frontmatter.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {project.frontmatter.summary}
                </CardDescription>
              </CardHeader>
              {/* BUG 6 FIX: flex-1 flex-col + spacer pins impact to bottom */}
              <CardContent className="flex flex-1 flex-col">
                <div className="flex flex-wrap gap-1.5">
                  {project.frontmatter.stack.slice(0, 4).map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="flex-1" />
                <div className="mt-3 rounded-md bg-[hsl(var(--muted))] px-3 py-2 text-xs font-medium text-[hsl(var(--primary))]">
                  {project.frontmatter.impact}
                </div>
              </CardContent>
              <CardFooter className="gap-3">
                {project.frontmatter.codeUrl && (
                  <a
                    href={project.frontmatter.codeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View source code for ${project.frontmatter.title}`}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Code2 className="h-3.5 w-3.5" /> Code
                  </a>
                )}
                {project.frontmatter.demoUrl && (
                  <a
                    href={project.frontmatter.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View live demo for ${project.frontmatter.title}`}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Demo
                  </a>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section
        aria-label="Connect"
        className="flex flex-col items-center gap-4 border-t border-border/40 py-16 text-center"
      >
        <h2 className="text-lg font-semibold">Let&apos;s connect</h2>
        <p className="text-sm text-muted-foreground">
          Open to discussing cloud architecture, infrastructure challenges, or
          new opportunities.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <GitHubIcon className="h-5 w-5" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <LinkedInIcon className="h-5 w-5" />
          </a>
        </div>
      </section>
    </main>
  );
}
