"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GridPanelProps {
  children: ReactNode;
  className?: string;
  highlight?: "green" | "cyan" | "purple" | "red" | "yellow";
}

const highlightStyles = {
  green: "border-[var(--cyber-green)] shadow-[0_0_20px_rgba(0,255,136,0.15)]",
  cyan: "border-[var(--cyber-cyan)] shadow-[0_0_20px_rgba(0,212,255,0.15)]",
  purple:
    "border-[var(--cyber-purple)] shadow-[0_0_20px_rgba(123,47,255,0.15)]",
  red: "border-[var(--cyber-red)] shadow-[0_0_20px_rgba(255,45,85,0.15)]",
  yellow: "border-[var(--cyber-yellow)] shadow-[0_0_20px_rgba(255,204,0,0.15)]",
};

export function GridPanel({ children, className, highlight }: GridPanelProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-[var(--cyber-surface)] p-4 transition-all duration-200",
        highlight
          ? highlightStyles[highlight]
          : "border-[var(--cyber-border)] hover:border-[var(--cyber-border-2)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  color?: "green" | "cyan" | "purple" | "yellow";
}

const colorMap = {
  green: "text-[var(--cyber-green)]",
  cyan: "text-[var(--cyber-cyan)]",
  purple: "text-[var(--cyber-purple)]",
  yellow: "text-[var(--cyber-yellow)]",
};

export function StatCard({
  label,
  value,
  change,
  positive,
  color = "cyan",
}: StatCardProps) {
  return (
    <GridPanel>
      <p className="text-xs text-[var(--cyber-text-dim)] uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className={cn("text-3xl font-bold tabular-nums", colorMap[color])}>
        {value}
      </p>
      {change && (
        <p
          className={cn(
            "text-xs mt-1",
            positive ? "text-[var(--cyber-green)]" : "text-[var(--cyber-red)]",
          )}
        >
          {positive ? "▲" : "▼"} {change}
        </p>
      )}
    </GridPanel>
  );
}
