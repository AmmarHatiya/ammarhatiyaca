"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Moon, Sun, Menu, X, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
];

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ── Global Cmd+K / Ctrl+K shortcut to open search ── */
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (pathname === "/search") {
          // Already on search page - dispatch focus event for search input
          window.dispatchEvent(new CustomEvent("focus-search"));
        } else {
          // Navigate to search page
          router.push("/search");
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <nav
        className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6"
        aria-label="Main navigation"
      >
        {/* Logo / Name */}
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight"
          aria-label="Home"
        >
          <span className="text-foreground">ammar</span>
          <span className="text-[hsl(var(--primary))]">.cloud</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "inline-flex h-8 items-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname === link.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          {/* Search */}
          <Link href="/search" aria-label="Search">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              tabIndex={-1}
            >
              <Search className="h-4 w-4" />
            </Button>
          </Link>

          {/* GitHub */}
          <a
            href="https://github.com/ammarhatiya"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
          >
            <Button
              variant="ghost"
              size="icon"
              className="hidden h-8 w-8 sm:inline-flex"
              tabIndex={-1}
            >
              <GitHubIcon className="h-4 w-4" />
            </Button>
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com/in/ammar-hatiya"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
          >
            <Button
              variant="ghost"
              size="icon"
              className="hidden h-8 w-8 sm:inline-flex"
              tabIndex={-1}
            >
              <LinkedInIcon className="h-4 w-4" />
            </Button>
          </a>

          {/* Theme toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="h-8 w-8"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border/40 md:hidden">
          <ul className="mx-auto max-w-5xl space-y-1 px-4 py-3 sm:px-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                    pathname === link.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
