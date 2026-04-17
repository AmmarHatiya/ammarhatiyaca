import type { Metadata } from "next";
import { getExperience, calculateDuration } from "@/lib/content";
import { ExperienceTimeline } from "@/components/experience-timeline";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Professional experience in cloud engineering, DevOps, and infrastructure automation.",
  openGraph: {
    title: "Experience | Ammar Hatiya",
    description:
      "Professional experience in cloud engineering, DevOps, and infrastructure automation.",
  },
};

export default function ExperiencePage() {
  const experience = getExperience();

  const experienceData = experience.map((exp) => ({
    slug: exp.slug,
    company: exp.frontmatter.company,
    title: exp.frontmatter.title,
    startDate: exp.frontmatter.startDate,
    endDate: exp.frontmatter.endDate,
    location: exp.frontmatter.location,
    technologies: exp.frontmatter.technologies,
    duration: calculateDuration(
      exp.frontmatter.startDate,
      exp.frontmatter.endDate
    ),
    content: exp.content,
    logoSrc: exp.frontmatter.logoSrc,
    logoDark: exp.frontmatter.logoDark,
    images: exp.frontmatter.images,
  }));

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Experience
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        A timeline of my professional journey in cloud and platform engineering.
      </p>
      <div className="mt-10">
        <ExperienceTimeline items={experienceData} />
      </div>
    </main>
  );
}
