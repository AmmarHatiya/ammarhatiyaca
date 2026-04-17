"use client";

import { useEffect } from "react";

export default function ResumePage() {
  useEffect(() => {
    window.location.href = "/resume.pdf";
  }, []);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-sm text-muted-foreground">
        Redirecting to resume...
      </p>
    </div>
  );
}
