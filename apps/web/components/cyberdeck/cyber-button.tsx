"use client";

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface CyberButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary:
    "bg-[var(--cyber-green)] text-[var(--cyber-bg)] hover:bg-[var(--cyber-green-dim)] shadow-[0_0_15px_rgba(0,255,136,0.3)] hover:shadow-[0_0_25px_rgba(0,255,136,0.5)]",
  secondary:
    "bg-transparent border border-[var(--cyber-cyan)] text-[var(--cyber-cyan)] hover:bg-[rgba(0,212,255,0.1)] hover:shadow-[0_0_15px_rgba(0,212,255,0.2)]",
  danger:
    "bg-transparent border border-[var(--cyber-red)] text-[var(--cyber-red)] hover:bg-[rgba(255,45,85,0.1)]",
  ghost:
    "bg-transparent text-[var(--cyber-text-dim)] hover:text-[var(--cyber-text)] hover:bg-[var(--cyber-dim)]",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function CyberButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CyberButtonProps) {
  return (
    <button
      className={cn(
        "font-mono font-medium rounded tracking-wider uppercase transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
