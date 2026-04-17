# Changelog

## [3.0.0] - 2026-04-09

### Full-Text Search Page + Navigation Enhancements

#### New: /search Page with Fuse.js Client-Side Search

- **New files:**
  - `scripts/build-search-index.ts` — Node.js script that reads all MDX content files (blog, projects, experience), extracts frontmatter fields, and writes `public/search-index.json`. Runs automatically via `prebuild` npm script.
  - `src/app/search/page.tsx` — Client component with full-text fuzzy search powered by Fuse.js. Features: debounced input (150ms), `?q=` query param sync via `router.replace`, Cmd+K / Ctrl+K keyboard shortcut, Suspense boundary for static export compatibility.
  - `src/components/search-result-card.tsx` — Polymorphic result card component handling blog, project, and experience result types. Highlights matched terms with `<mark>` elements styled for light and dark mode.
  - `src/components/ui/input.tsx` — shadcn Input component (installed via `npx shadcn@latest add input`).
  - `src/components/ui/skeleton.tsx` — shadcn Skeleton component (installed via `npx shadcn@latest add skeleton`).

- **Modified files:**
  - `package.json` — Added `"prebuild": "npx tsx scripts/build-search-index.ts"` script and `fuse.js` dependency.

- **Search features:**
  - Build-time index generation (11 entries across 3 content types)
  - Fuse.js fuzzy search with per-type weighted keys (title 0.5, description 0.3, tags 0.2)
  - Three separate Fuse instances cached in a ref (no recreation on keystrokes)
  - Results grouped by type: Articles, Projects, Experience
  - States: empty input (clean), loading (skeleton bars), no results (SearchX icon), error (AlertCircle icon)
  - Yellow highlight on matched text via `<mark>` with `bg-yellow-100 dark:bg-yellow-900`

#### New: GitHub & LinkedIn Icons in Navigation Bar

- **Modified file:** `src/components/nav.tsx`
- Added GitHub icon linking to `https://github.com/ammarhatiya` (new tab)
- Added LinkedIn icon linking to `https://linkedin.com/in/ammar-hatiya` (new tab)
- Added Search icon linking to `/search`
- Icons are hidden on mobile (`hidden sm:inline-flex`) to keep the nav clean on small screens; the search icon is always visible
- Uses existing `GitHubIcon` and `LinkedInIcon` from `@/components/icons`
- Icon order (left to right): Search, GitHub, LinkedIn, theme toggle, mobile menu

---

## [2.3.0] - 2026-04-08

### Bug Fixes — Lightbox Sizing, Caption Layout, Project Card Anchoring

---

## [2.2.0] - 2026-04-08

### Bug Fixes — 6 bugs across experience, projects, and home pages

---

## [2.1.0] - 2026-04-08

### Comprehensive Image Support

---

## [2.0.0] - 2026-04-08

### About Page Restructure & Site-Wide Audit

---

## [1.0.0] - 2026-04-07

### Initial Release
