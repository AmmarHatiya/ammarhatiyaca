/**
 * VisuallyHidden — renders children in a way that is visually hidden
 * but still accessible to screen readers. Used for accessible dialog
 * titles/descriptions that shouldn't be displayed visually.
 */
export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: 0,
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        borderWidth: 0,
      }}
    >
      {children}
    </span>
  );
}
