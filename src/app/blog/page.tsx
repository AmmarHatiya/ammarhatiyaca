import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts, calculateReadTime } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Clock } from "lucide-react";
import { AspectImage } from "@/components/aspect-image";
import { BlogCards } from "@/components/blog-cards";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Technical articles on cloud architecture, Kubernetes, Terraform, and infrastructure engineering.",
  openGraph: {
    title: "Blog | Ammar Hatiya",
    description:
      "Technical articles on cloud architecture, Kubernetes, Terraform, and infrastructure engineering.",
  },
};

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Blog</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Writing about things I&apos;m learning, building and passionate about.
      </p>

      <BlogCards>
        {posts.map((post) => {
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
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="flex h-full flex-col overflow-hidden transition-colors hover:bg-accent/50">
                {/* INVARIANT A: No coverImage → card renders cleanly without image slot
                    INVARIANT B: 16:9 enforced via AspectImage */}
                <AspectImage
                  src={post.frontmatter.coverImage}
                  alt={post.frontmatter.title}
                  aspect="16/9"
                  className="rounded-t-lg"
                />
                <CardHeader>
                  <CardTitle className="text-base font-semibold">
                    {post.frontmatter.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <span>{formattedDate}</span>
                    <span className="text-border">&middot;</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {readTime} min read
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.frontmatter.summary}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {post.frontmatter.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </BlogCards>

      {posts.length === 0 && (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          No posts yet. Check back soon.
        </p>
      )}
    </main>
  );
}
