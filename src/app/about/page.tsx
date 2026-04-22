import type { Metadata } from "next";
import Link from "next/link";
import { Download, Mail, MapPin } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EducationCard } from "@/components/education-card";
import { CertificationGrid } from "@/components/certification-grid";
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

const contactItems = [
  {
    icon: Mail,
    label: "ammar.hatiya@gmail.com",
    href: "mailto:ammar.hatiya@gmail.com",
  },
  {
    icon: GitHubIcon,
    label: "github.com/ammarhatiya",
    href: "github.com/ammarhatiya",
  },
  {
    icon: LinkedInIcon,
    label: "linkedin.com/in/ammar-hatiya",
    href: "linkedin.com/in/ammar-hatiya",
  },
  {
    icon: MapPin,
    label: "Toronto, Canada — EST",
    href: null,
  },
];

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
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">About</h1>

      {/* ─── 1. PROFESSIONAL SUMMARY ─── */}
      <section aria-label="Professional summary" className="mt-8">
        <h2 className="text-lg font-semibold">Professional Summary</h2>
        <div className="mt-3 space-y-4 text-sm leading-relaxed text-muted-foreground">
          {summaryParagraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      {/* ─── 2. TECHNICAL INTERESTS & SPECIALIZATIONS ─── */}
      {interests.length > 0 && (
        <section aria-label="Technical interests" className="mt-10">
          <h2 className="text-lg font-semibold">
            Technical Interests &amp; Specializations
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {interests.map((interest) => (
              <Badge key={interest} variant="outline">
                {interest}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* ─── 3. EDUCATION ─── */}
      <section aria-label="Education and certifications" className="mt-10">
        <h2 className="text-lg font-semibold">Education</h2>

        {/* 3a. Undergraduate Degree */}
        {education && (
          <div className="mt-4">
            <EducationCard education={education.frontmatter} />
          </div>
        )}

        {/* 3b. Certifications */}
        {certifications.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              Professional Certifications
            </h3>
            <CertificationGrid certifications={certifications} />
          </div>
        )}
      </section>

      {/* ─── 4. PERSONAL NOTE ─── */}
      <section aria-label="Personal note" className="mt-10">
        <h2 className="text-lg font-semibold">Beyond the Terminal</h2>
        <div className="mt-3 space-y-4 text-sm leading-relaxed text-muted-foreground">
          {personalParagraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      {/* ─── 5. TIMELINE ─── */}
      {/* {timeline.length > 0 && (
        <section aria-label="Career timeline" className="mt-10">
          <h2 className="text-lg font-semibold">Timeline</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Education, certifications, and career milestones
          </p>
          <Separator className="my-4" />
          <Timeline entries={timeline} />
        </section>
      )} */}

      {/* ─── 6. RESUME DOWNLOAD ─── */}
      <section aria-label="Resume download" className="mt-10">
        <Link href="/resume">
          <Button size="lg">
            <Download className="mr-2 h-4 w-4" />
            Download Resume (PDF)
          </Button>
        </Link>
      </section>

      {/* ─── 7. CONTACT ─── */}
      <section aria-label="Contact information" className="mt-10">
        <h2 className="text-lg font-semibold">Contact</h2>
        <ul className="mt-4 space-y-3">
          {contactItems.map((item) => (
            <li key={item.label} className="flex items-center gap-3">
              <item.icon className="h-4 w-4 text-muted-foreground" />
              {item.href ? (
                <a
                  href={item.href}
                  target={item.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
