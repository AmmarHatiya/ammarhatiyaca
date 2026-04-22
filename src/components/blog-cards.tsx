"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
}

interface ChildProps {
  className?: string;
  style?: React.CSSProperties;
}

export function BlogCards({ children }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          const childProps = child.props as ChildProps;
          return React.cloneElement(child as React.ReactElement<ChildProps>, {
            className: cn(
              childProps.className,
              "transition-all duration-200 ease-out",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            ),
            style: {
              ...childProps.style,
              transitionDelay: mounted ? `${index * 100}ms` : "0ms"
            }
          });
        }
        return child;
      })}
    </div>
  );
}
