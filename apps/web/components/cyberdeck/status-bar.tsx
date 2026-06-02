"use client";

import { cn } from "@/lib/utils";

interface StatusBarProps {
  items: Array<{
    label: string;
    value: string;
    status?: "ok" | "warn" | "err";
  }>;
  className?: string;
}

const statusColors = {
  ok: "text-[var(--cyber-green)]",
  warn: "text-[var(--cyber-yellow)]",
  err: "text-[var(--cyber-red)]",
};

export function StatusBar({ items, className }: StatusBarProps) {
  const now = new Date().toLocaleTimeString("en-US", { hour12: false });

  return (
    <div
      className={cn(
        "flex items-center gap-4 px-4 py-1.5 text-xs font-mono border-b border-[var(--cyber-border)] bg-[var(--cyber-surface-2)] text-[var(--cyber-text-dim)] overflow-x-auto",
        className,
      )}
    >
      <span className="text-[var(--cyber-green)] glow-green flex-shrink-0">
        AURA
      </span>
      <span className="opacity-30">|</span>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5 flex-shrink-0">
          <span className="opacity-50">{item.label}:</span>
          <span className={item.status ? statusColors[item.status] : ""}>
            {item.value}
          </span>
        </span>
      ))}
      <span className="ml-auto flex-shrink-0 opacity-40">{now}</span>
    </div>
  );
}
