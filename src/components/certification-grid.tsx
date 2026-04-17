import Image from "next/image";
import { BadgeCheck, ExternalLink } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CertificationFrontmatter, MDXFile } from "@/lib/content";

interface Props {
  certifications: MDXFile<CertificationFrontmatter>[];
}

/** Format "YYYY-MM" to "Mon YYYY" */
function formatDate(dateStr: string): string {
  const [year, month] = dateStr.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function CertificationGrid({ certifications }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {certifications.map((cert) => {
        const { name, issuer, dateEarned, expiryDate, verifyUrl, badgeSrc } =
          cert.frontmatter;

        return (
          <Card key={cert.slug} className="relative">
            <CardHeader className="pb-2">
              <div className="flex items-start gap-2.5">
                {/* INVARIANT A: No badgeSrc → BadgeCheck icon fallback
                    INVARIANT B: 56×56px fixed, objectFit contain, top-right position */}
                {badgeSrc ? (
                  <div className="absolute right-3 top-3 flex h-14 w-14 shrink-0 items-center justify-center">
                    <Image
                      src={badgeSrc}
                      alt={`${name} badge`}
                      width={56}
                      height={56}
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--primary))]" />
                )}
                <div className={badgeSrc ? "min-w-0 pr-16" : "min-w-0"}>
                  <CardTitle className="text-sm font-semibold leading-snug">
                    {name}
                  </CardTitle>
                  <CardDescription className="mt-0.5 text-xs">
                    {issuer}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Earned {formatDate(dateEarned)}
                {expiryDate && <> &middot; Expires {formatDate(expiryDate)}</>}
              </p>
              {verifyUrl && (
                <a
                  href={verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block"
                >
                  <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs">
                    Verify
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </a>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
