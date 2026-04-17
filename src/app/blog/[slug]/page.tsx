import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getBlogPosts, getBlogPost, calculateReadTime } from "@/lib/content";
import { MDXContent } from "@/components/mdx-content";
import { AspectImage } from "@/components/aspect-image";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) return {};

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.summary,
    openGraph: {
      title: `${post.frontmatter.title} | Ammar Hatiya`,
      description: post.frontmatter.summary,
      type: "article",
      publishedTime: post.frontmatter.date,
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPost(params.slug);

  if (!post || !post.frontmatter.published) {
    notFound();
  }

  const readTime = calculateReadTime(post.content);
  const formattedDate = new Date(post.frontmatter.date).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Breadcrumb */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Back to blog"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Blog
      </Link>

      {/* Post header */}
      <header className="mt-6">
        {/* INVARIANT A: No coverImage → header renders without image (clean)
            INVARIANT B: 16:9 enforced via AspectImage, priority for LCP */}
        <AspectImage
          src={post.frontmatter.coverImage}
          alt={post.frontmatter.title}
          aspect="16/9"
          className="mb-6 rounded-lg"
          priority
        />
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {post.frontmatter.title}
        </h1>
        <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
          <time dateTime={post.frontmatter.date}>{formattedDate}</time>
          <span className="text-border">&middot;</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {readTime} min read
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.frontmatter.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </header>

      {/* Post body */}
      <div className="mt-8">
        <MDXContent source={post.content} />
      </div>
    </article>
  );
}
