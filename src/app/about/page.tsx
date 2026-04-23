import type { Metadata } from "next";
import { AboutContent } from "@/components/about-content";
import {
  getAbout,
  getEducation,
  getCertifications,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Cloud Infrastructure Engineer with 6+ years of experience in AWS, Kubernetes, and infrastructure-as-code. Based in Toronto, Canada.",
  openGraph: {
    title: "About | Ammar Hatiya",
    description:
      "Cloud Infrastructure Engineer with 6+ years of experience in AWS, Kubernetes, and infrastructure-as-code.",
  },
};

/**
 * Parse the MDX body into named sections using HTML comment dividers.
 * Pattern: <!-- section: <name> -->
 * Returns a map of section name → array of paragraph strings.
 */
function parseSections(content: string): Record<string, string[]> {
  const sections: Record<string, string[]> = {};
  let currentSection = "default";

  for (const line of content.split("\n")) {
    const match = line.match(/<!--\s*section:\s*(\w+)\s*-->/);
    if (match) {
      currentSection = match[1];
      if (!sections[currentSection]) sections[currentSection] = [];
      continue;
    }
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      if (!sections[currentSection]) sections[currentSection] = [];
      sections[currentSection].push(trimmed);
    }
  }

  return sections;
}

export default function AboutPage() {
  const about = getAbout();
  const education = getEducation();
  const certifications = getCertifications();

  /* Parse MDX sections for summary, interests, and personal note */
  const sections = about ? parseSections(about.content) : {};
  const summaryParagraphs = sections["summary"] || [];
  const interests = (sections["interests"] || [])
    .join(", ")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const personalParagraphs = sections["personal"] || [];

  return (
    <AboutContent
      summaryParagraphs={summaryParagraphs}
      interests={interests}
      education={education?.frontmatter}
      certifications={certifications}
      personalParagraphs={personalParagraphs}
    />
  );
}
