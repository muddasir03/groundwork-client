import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "dark" | "inverse";
export type ButtonSize = "sm" | "md" | "lg";

type StyleProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  /** Toggle buttons (Save, Compare) in their "on" state. Replaces the variant's colours. */
  pressed?: boolean;
};

// The "on" look for toggle buttons (Save, Compare): cobalt tint, as in the designs.
const pressedStyle = "border border-primary bg-primary-soft text-primary";

const variants: Record<ButtonVariant, string> = {
  // Main action on a page: cobalt.
  primary: "bg-primary text-white hover:bg-primary-hover",
  // Secondary actions: white with a border.
  secondary: "border border-line-strong bg-surface text-ink hover:bg-fill",
  // High-emphasis neutral action, e.g. "Compare selected".
  dark: "bg-ink text-white hover:bg-ink-muted",
  // Primary action on a dark (ink) panel.
  inverse: "bg-white text-ink hover:bg-fill",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-5 text-base",
};

export function buttonClasses({ variant = "primary", size = "md", fullWidth, pressed }: StyleProps = {}): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors",
    "disabled:pointer-events-none disabled:opacity-50",
    // Swap, don't stack: two utilities for the same property resolve by CSS order, not class order.
    pressed ? pressedStyle : variants[variant],
    sizes[size],
    fullWidth && "w-full",
  );
}

type ButtonProps = StyleProps & ComponentProps<"button">;

/** An action on the current page. For navigation use `ButtonLink`. */
export function Button({ variant, size, fullWidth, pressed, className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      aria-pressed={pressed}
      className={cn(buttonClasses({ variant, size, fullWidth, pressed }), className)}
      {...props}
    />
  );
}

type ButtonLinkProps = StyleProps & ComponentProps<typeof Link>;

/** Navigation styled as a button. */
export function ButtonLink({ variant, size, fullWidth, className, ...props }: Omit<ButtonLinkProps, "pressed">) {
  return <Link className={cn(buttonClasses({ variant, size, fullWidth }), className)} {...props} />;
}
