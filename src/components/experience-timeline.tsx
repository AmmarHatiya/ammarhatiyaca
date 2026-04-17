"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { AspectImage } from "@/components/aspect-image";
import { ImageLightbox, type LightboxImage } from "@/components/image-lightbox";
import { useTheme } from "next-themes";

interface ContentImage {
  src: string;
  alt: string;
}

interface ExperienceItem {
  slug: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  technologies: string[];
  duration: string;
  content: string;
  logoSrc?: string;
  logoDark?: string;
  images?: ContentImage[];
}

interface Props {
  items: ExperienceItem[];
}

export function ExperienceTimeline({ items }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<LightboxImage[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function openLightbox(images: ContentImage[], index: number) {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border sm:left-6" />

      <div className="space-y-8">
        {items.map((item, index) => (
          <div key={item.slug} className="relative pl-10 sm:pl-14">
            {/* Timeline dot */}
            <div className="absolute left-2.5 top-1 flex h-3 w-3 items-center justify-center rounded-full border-2 border-[hsl(var(--primary))] bg-background sm:left-[18px]">
              <div
                className={`h-1.5 w-1.5 rounded-full ${
                  index === 0
                    ? "bg-[hsl(var(--primary))]"
                    : "bg-muted-foreground/40"
                }`}
              />
            </div>

            {/* Content */}
            <div>
              <div className="flex flex-col gap-1">
                {/* INVARIANT A: No logoSrc → no gap, company name left-aligns cleanly
                    INVARIANT B: 40×40px fixed, objectFit contain */}
                <div className="flex items-center gap-2">
                  {item.logoSrc && (
                    <Image
                      src={mounted && (resolvedTheme === "dark") && item.logoDark ? item.logoDark : item.logoSrc}
                      alt={`${item.company} logo`}
                      width={40}
                      height={40}
                      className="rounded-md object-contain"
                    />
                  )}
                  <h3 className="text-base font-semibold">{item.title}</h3>
                </div>
                <span className="text-md text-muted-foreground">
                  {item.company}
                </span>
              </div>

              <p className="mt-0.5 text-xs text-muted-foreground">
                {item.startDate} – {item.endDate} &middot; {item.duration}{" "}
                &middot; {item.location}
              </p>

              {/* Technologies */}
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {item.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>

              {/* Bullet points — first item expanded, rest in accordion */}
              {index === 0 ? (
                <div className="mt-3">
                  <BulletList content={item.content} />
                  {/* INVARIANT A: No images → section does not render */}
                  {item.images && item.images.length > 0 && (
                    <div className="mt-4">
                      <p className="mb-2 text-xs font-medium text-muted-foreground">
                        Project gallery
                      </p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {item.images.map((img, imgIdx) => (
                          <AspectImage
                            key={img.src}
                            src={img.src}
                            alt={img.alt}
                            aspect="4/3"
                            className="rounded-md"
                            onClick={() => openLightbox(item.images!, imgIdx)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Accordion>
                  <AccordionItem value={item.slug} className="border-none">
                    <AccordionTrigger className="py-2 text-s text-muted-foreground hover:underline">
                      View details
                    </AccordionTrigger>
                    <AccordionContent>
                      <BulletList content={item.content} />
                      {/* INVARIANT A: No images → section does not render */}
                      {item.images && item.images.length > 0 && (
                        <div className="mt-4">
                          <p className="mb-2 text-xs font-medium text-muted-foreground">
                            Project gallery
                          </p>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {item.images.map((img, imgIdx) => (
                              <AspectImage
                                key={img.src}
                                src={img.src}
                                alt={img.alt}
                                aspect="4/3"
                                className="rounded-md"
                                onClick={() => openLightbox(item.images!, imgIdx)}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </div>

            {index < items.length - 1 && (
              <Separator className="mt-6" />
            )}
          </div>
        ))}
      </div>

      {/* Shared lightbox instance */}
      <ImageLightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
    </div>
  );
}

/** Renders MDX bullet content as an HTML list */
function BulletList({ content }: { content: string }) {
  const bullets = content
    .split("\n")
    .map((line) => line.replace(/^-\s*/, "").trim())
    .filter(Boolean);

  return (
    <ul className="space-y-1.5">
      {bullets.map((bullet, i) => (
        <li
          key={i}
          className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
        >
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
          {bullet}
        </li>
      ))}
    </ul>
  );
}
