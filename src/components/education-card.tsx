import Image from "next/image";
import { GraduationCap, BookOpen } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { EducationFrontmatter } from "@/lib/content";

interface Props {
  education: EducationFrontmatter;
}

export function EducationCard({ education }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          {/* INVARIANT A: No logoSrc → GraduationCap icon fallback
              INVARIANT B: 48×48px fixed, objectFit contain */}
          {education.logoSrc ? (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-border bg-background">
              <Image
                src={education.logoSrc}
                alt={`${education.institution} logo`}
                width={48}
                height={48}
                className="rounded-md object-contain"
              />
            </div>
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[hsl(var(--primary))]/10">
              <GraduationCap className="h-4.5 w-4.5 text-[hsl(var(--primary))]" />
            </div>
          )}
          <div className="min-w-0">
            <CardTitle className="text-base font-semibold">
              {education.degree}
            </CardTitle>
            <CardDescription className="mt-0.5">
              {education.institution} &middot; {education.graduationYear}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {education.honors && education.honors.length > 0 && (
          <div className="flex items-center gap-2">
            {education.honors?.map((course) => (
                <Badge variant="secondary" key={course}>
                  {course}
                </Badge>
              ))}
          </div>
        )}
        {education.coursework && education.coursework.length > 0 && (
          <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <BookOpen className="h-3 w-3" />
              Relevant Coursework
            </p>
            <div className="flex flex-wrap gap-1.5">
              {education.coursework.map((course) => (
                <Badge key={course} variant="outline">
                  {course}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
