import type { ElementType, ReactNode } from "react";
import { useReveal } from "@/hooks/use-reveal";

type RevealProps = {
  children: ReactNode;
  /** Animation variant: fade+slide up (default), from left, from right, or scale in. */
  variant?: "up" | "left" | "right" | "scale";
  /** Delay in ms before the animation plays, for staggering groups of items. */
  delay?: number;
  className?: string;
  as?: ElementType;
};

const variantClass: Record<NonNullable<RevealProps["variant"]>, string> = {
  up: "",
  left: "reveal-left",
  right: "reveal-right",
  scale: "reveal-scale",
};

/**
 * Wraps content that should fade/slide in smoothly the first time it
 * scrolls into view. Purely presentational — no layout impact once visible.
 */
export function Reveal({ children, variant = "up", delay = 0, className = "", as: Tag = "div" }: RevealProps) {
  const { ref, isVisible } = useReveal<HTMLDivElement>();

  return (
    <Tag
      ref={ref}
      className={`reveal ${variantClass[variant]} ${isVisible ? "reveal-in" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
