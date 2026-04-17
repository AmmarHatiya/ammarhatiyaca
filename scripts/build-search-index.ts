/**
 * scripts/build-search-index.ts
 *
 * BUILD-TIME search index generator. Reads all MDX content files,
 * extracts frontmatter fields, and writes a single JSON file to
 * public/search-index.json. Runs as a "prebuild" step so the index
 * is always fresh on every deployment.
 *
 * Uses only Node.js built-ins + gray-matter (already installed).
 * Run: npx tsx scripts/build-search-index.ts
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "src", "content");
const OUTPUT_PATH = path.join(process.cwd(), "public", "search-index.json");

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

type SearchEntry = BlogEntry | ProjectEntry | ExperienceEntry;

function readMdxFiles(dir: string): { slug: string; data: Record<string, unknown> }[] {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(dir, filename), "utf-8");
      const { data } = matter(raw);
      return { slug: filename.replace(/\.mdx$/, ""), data };
    });
}

function buildIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  // Blog entries
  const blogs = readMdxFiles(path.join(CONTENT_DIR, "blog"));
  for (const { slug, data } of blogs) {
    if (data.published === false) continue;
    entries.push({
      type: "blog",
      slug,
      title: (data.title as string) || "",
      summary: (data.summary as string) || "",
      tags: (data.tags as string[]) || [],
      date: (data.date as string) || "",
    });
  }

  // Project entries
  const projects = readMdxFiles(path.join(CONTENT_DIR, "projects"));
  for (const { slug, data } of projects) {
    entries.push({
      type: "project",
      slug,
      title: (data.title as string) || "",
      summary: (data.summary as string) || "",
      stack: (data.stack as string[]) || [],
      impact: (data.impact as string) || "",
    });
  }

  // Experience entries
  const experiences = readMdxFiles(path.join(CONTENT_DIR, "experience"));
  for (const { slug, data } of experiences) {
    entries.push({
      type: "experience",
      slug,
      title: (data.title as string) || "",
      company: (data.company as string) || "",
      technologies: (data.technologies as string[]) || [],
    });
  }

  return entries;
}

const index = buildIndex();
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(index, null, 2), "utf-8");
console.log(`✓ Search index built: ${index.length} entries → ${OUTPUT_PATH}`);
