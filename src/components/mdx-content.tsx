import { MDXRemote } from "next-mdx-remote/rsc";

interface Props {
  source: string;
}

export function MDXContent({ source }: Props) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2 prose-p:text-sm prose-p:leading-relaxed prose-li:text-sm prose-code:text-xs prose-pre:text-xs prose-a:text-[hsl(var(--primary))] prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-blockquote:border-l-[hsl(var(--primary))]">
      <MDXRemote source={source} />
    </div>
  );
}
