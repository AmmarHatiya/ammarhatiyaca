import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "src", "content");

/* ────────────────────────────────────────────
   Generic MDX file reader
   ──────────────────────────────────────────── */

export interface MDXFile<T = Record<string, unknown>> {
  slug: string;
  frontmatter: T;
  content: string;
}

function getMDXFiles<T>(dir: string): MDXFile<T>[] {
  const fullPath = path.join(contentDirectory, dir);
  if (!fs.existsSync(fullPath)) return [];

  const files = fs.readdirSync(fullPath).filter((f) => f.endsWith(".mdx"));

  return files.map((filename) => {
    const filePath = path.join(fullPath, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    return {
      slug: filename.replace(/\.mdx$/, ""),
      frontmatter: data as T,
      content,
    };
  });
}

/* ────────────────────────────────────────────
   Projects
   ──────────────────────────────────────────── */

export interface ContentImage {
  src: string;
  alt: string;
}

export interface ProjectFrontmatter {
  title: string;
  summary: string;
  stack: string[];
  impact: string;
  codeUrl?: string;
  demoUrl?: string;
  featured: boolean;
  date: string;
  thumbnail?: string;
  images?: ContentImage[];
}

export function getProjects(): MDXFile<ProjectFrontmatter>[] {
  return getMDXFiles<ProjectFrontmatter>("projects").sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}

export function getFeaturedProjects(): MDXFile<ProjectFrontmatter>[] {
  return getProjects().filter((p) => p.frontmatter.featured);
}

/* ────────────────────────────────────────────
   Experience
   ──────────────────────────────────────────── */

export interface ExperienceFrontmatter {
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  technologies: string[];
  logoSrc?: string;
  logoDark?: string;
  images?: ContentImage[];
}

export function getExperience(): MDXFile<ExperienceFrontmatter>[] {
  return getMDXFiles<ExperienceFrontmatter>("experience").sort((a, b) => {
    // Sort by whether "Present" is in endDate (current job first), then by date
    if (a.frontmatter.endDate === "Present") return -1;
    if (b.frontmatter.endDate === "Present") return 1;
    return (
      parseDate(b.frontmatter.startDate).getTime() -
      parseDate(a.frontmatter.startDate).getTime()
    );
  });
}

function parseDate(dateStr: string): Date {
  // Parse "Mon YYYY" format
  const parts = dateStr.split(" ");
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  return new Date(parseInt(parts[1]), months[parts[0]] || 0);
}

/** Calculate duration string like "2 yrs 3 mos" */
export function calculateDuration(start: string, end: string): string {
  const startDate = parseDate(start);
  const endDate = end === "Present" ? new Date() : parseDate(end);

  let months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());

  if (months < 0) months = 0;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (remainingMonths > 0)
    parts.push(`${remainingMonths} mo${remainingMonths > 1 ? "s" : ""}`);

  return parts.join(" ") || "< 1 mo";
}

/* ────────────────────────────────────────────
   Blog
   ──────────────────────────────────────────── */

export interface BlogFrontmatter {
  title: string;
  date: string;
  summary: string;
  tags: string[];
  published: boolean;
  coverImage?: string;
}

export function getBlogPosts(): MDXFile<BlogFrontmatter>[] {
  return getMDXFiles<BlogFrontmatter>("blog")
    .filter((p) => p.frontmatter.published)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
}

export function getBlogPost(slug: string): MDXFile<BlogFrontmatter> | null {
  const posts = getMDXFiles<BlogFrontmatter>("blog");
  return posts.find((p) => p.slug === slug) || null;
}

/** Estimate read time from word count */
export function calculateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
}

/* ────────────────────────────────────────────
   About
   ──────────────────────────────────────────── */

export function getAbout(): MDXFile | null {
  const filePath = path.join(contentDirectory, "about.mdx");
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug: "about",
    frontmatter: data,
    content,
  };
}

/* ────────────────────────────────────────────
   Skills
   ──────────────────────────────────────────── */

export function getSkills(): Record<string, string[]> {
  const filePath = path.join(contentDirectory, "skills.json");
  if (!fs.existsSync(filePath)) return {};
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

/* ────────────────────────────────────────────
   Education
   ──────────────────────────────────────────── */

export interface EducationFrontmatter {
  degree: string;
  institution: string;
  graduationYear: string;
  honors?: string[];
  coursework?: string[];
  logoSrc?: string;
}

export function getEducation(): MDXFile<EducationFrontmatter> | null {
  const filePath = path.join(contentDirectory, "education.mdx");
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug: "education",
    frontmatter: data as EducationFrontmatter,
    content,
  };
}

/* ────────────────────────────────────────────
   Certifications
   ──────────────────────────────────────────── */

export interface CertificationFrontmatter {
  name: string;
  issuer: string;
  dateEarned: string;
  expiryDate?: string;
  verifyUrl?: string;
  badgeSrc?: string;
}

export function getCertifications(): MDXFile<CertificationFrontmatter>[] {
  return getMDXFiles<CertificationFrontmatter>("certifications").sort(
    (a, b) =>
      new Date(b.frontmatter.dateEarned).getTime() -
      new Date(a.frontmatter.dateEarned).getTime()
  );
}

/* ────────────────────────────────────────────
   Timeline
   ──────────────────────────────────────────── */

export interface TimelineEntry {
  date: string;
  type: "education" | "certification" | "career";
  title: string;
  subtitle: string;
}

export function getTimeline(): TimelineEntry[] {
  const filePath = path.join(contentDirectory, "timeline.json");
  if (!fs.existsSync(filePath)) return [];
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8")) as TimelineEntry[];
  return data.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}
