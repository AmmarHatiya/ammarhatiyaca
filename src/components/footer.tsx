import { Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";

const socialLinks = [
  {
    href: "https://github.com/ammarhatiya",
    label: "GitHub",
    icon: GitHubIcon,
  },
  {
    href: "https://linkedin.com/in/ammar-hatiya",
    label: "LinkedIn",
    icon: LinkedInIcon,
  },
  {
    href: "mailto:ammar.hatiya@gmail.com",
    label: "Email",
    icon: Mail,
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/40" aria-label="Site footer">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6 sm:px-6">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Ammar Hatiya. All rights reserved.
        </p>
        <div className="flex items-center gap-3">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <link.icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
