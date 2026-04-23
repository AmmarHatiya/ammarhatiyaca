import type { Metadata } from "next";
import { getSkills, getFeaturedProjects } from "@/lib/content";
import { HomeContent } from "@/components/home-content";

export const metadata: Metadata = {
  title: "Ammar Hatiya",
  description:
    "Cloud Infrastructure Engineer specializing in AWS, Kubernetes, and infrastructure-as-code.",
};

export default function HomePage() {
  const skills = getSkills();
  const featuredProjects = getFeaturedProjects();

  return <HomeContent skills={skills} featuredProjects={featuredProjects} />;
}
