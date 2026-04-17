# Ammar Hatiya — Portfolio

A personal portfolio site for a Cloud & Automation Engineer, built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

**Live:** [ammar.cloud](https://www.perplexity.ai/computer/a/ammar-hatiya-portfolio-fybJ330hSzCcoJ1PY2k6_g)

---

## Tech Stack

- **Framework:** Next.js 14 (App Router, static export)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3.4, shadcn/ui v4
- **Content:** MDX via gray-matter + next-mdx-remote
- **Icons:** Lucide React + custom SVG components
- **Theming:** next-themes (dark/light mode, class strategy)
- **Typography:** Geist Sans + Geist Mono (local fonts)

## Routes

| Route | Description |
|---|---|
| `/` | Home — hero, skills grid, featured projects |
| `/projects` | All projects with tag filtering and grid/list toggle |
| `/experience` | Timeline with expandable accordion details |
| `/about` | Professional summary, approach, contact info |
| `/blog` | Blog index with article cards |
| `/blog/[slug]` | Individual blog post (MDX rendered) |
| `/resume` | Redirects to `/resume.pdf` |

## Prerequisites

- **Node.js** 18.17 or later — [download](https://nodejs.org/)
- **npm** (comes with Node.js)

## Getting Started

### 1. Clone or extract the project

```bash
unzip ammar-hatiya-portfolio.zip
cd portfolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production

```bash
npm run build
```

This generates a static export in the `out/` directory. All 13 pages are pre-rendered as static HTML.

### 5. Preview the production build locally

```bash
npx serve out
```

## Project Structure

```
portfolio/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout (providers, nav, footer)
│   │   ├── page.tsx            # Home page
│   │   ├── globals.css         # Tailwind + CSS custom properties
│   │   ├── fonts/              # Geist font files
│   │   ├── about/page.tsx
│   │   ├── blog/page.tsx
│   │   ├── blog/[slug]/page.tsx
│   │   ├── experience/page.tsx
│   │   ├── projects/page.tsx
│   │   └── resume/page.tsx
│   ├── components/             # React components
│   │   ├── nav.tsx             # Sticky nav with mobile hamburger
│   │   ├── footer.tsx          # Social links footer
│   │   ├── icons.tsx           # Custom GitHub/LinkedIn SVGs
│   │   ├── providers.tsx       # ThemeProvider wrapper
│   │   ├── projects-client.tsx # Client-side tag filter + view toggle
│   │   ├── experience-timeline.tsx # Vertical timeline with accordion
│   │   ├── mdx-content.tsx     # MDX renderer with prose styling
│   │   └── ui/                 # shadcn/ui primitives
│   ├── lib/
│   │   ├── content.ts          # MDX file reader (gray-matter)
│   │   └── utils.ts            # cn() utility
│   └── content/                # All site content (MDX + JSON)
│       ├── skills.json
│       ├── about.mdx
│       ├── blog/               # 3 blog posts
│       ├── experience/         # 3 work experiences
│       └── projects/           # 5 projects
├── public/
│   └── resume.pdf
├── tailwind.config.ts
├── tsconfig.json
├── next.config.mjs
├── components.json             # shadcn/ui config
├── postcss.config.mjs
└── package.json
```

## Customization

### Content

All content lives in `src/content/` as MDX files with YAML frontmatter. Edit these to update projects, experience, blog posts, and skills.

### Styling

- **Colors:** HSL custom properties in `src/app/globals.css` (light and dark themes)
- **Primary accent:** Teal — change the `--primary` variable to rebrand
- **Tailwind config:** `tailwind.config.ts` has the full shadcn color mapping

### Personal Info

Update these files to personalize:

- `src/components/nav.tsx` — logo text
- `src/components/footer.tsx` — social links and copyright
- `src/app/about/page.tsx` — contact details
- `src/app/layout.tsx` — metadata (title, OG tags)
- All page files — `metadata` exports contain name references

## Deployment

The site is configured for static export (`output: "export"` in `next.config.mjs`). After `npm run build`, the `out/` directory can be deployed to any static host:

- **Vercel:** `npx vercel --prod` (auto-detects Next.js)
- **Netlify:** Set build command to `npm run build`, publish directory to `out`
- **AWS S3 / CloudFront:** Upload `out/` contents to an S3 bucket
- **GitHub Pages:** Push `out/` to a `gh-pages` branch

## License

MIT
