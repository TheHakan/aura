"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface TerminalWindowProps {
  title?: string;
  children: ReactNode;
  className?: string;
  statusDot?: "online" | "offline" | "pending";
}

export function TerminalWindow({
  title,
  children,
  className,
  statusDot,
}: TerminalWindowProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-[var(--cyber-border)] bg-[var(--cyber-surface)] overflow-hidden",
        className,
      )}
      style={{
        boxShadow:
          "0 0 0 1px rgba(0,212,255,0.1), inset 0 0 40px rgba(0,212,255,0.02)",
      }}
    >
      {title && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--cyber-border)] bg-[var(--cyber-surface-2)]">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[var(--cyber-red)] opacity-70" />
            <span className="w-3 h-3 rounded-full bg-[var(--cyber-yellow)] opacity-70" />
            <span className="w-3 h-3 rounded-full bg-[var(--cyber-green)] opacity-70" />
          </div>
          {statusDot && <span className={`status-dot ${statusDot} ml-1`} />}
          <span className="ml-2 text-xs text-[var(--cyber-text-dim)] font-mono tracking-wider uppercase">
            {title}
          </span>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
