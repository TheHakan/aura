"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Youtube,
  Calendar,
  Workflow,
  Server,
  Sparkles,
  Terminal,
  KeyRound,
  BarChart3,
  Bot,
  Zap,
  Settings,
  LogOut,
} from "lucide-react";

const modules = [
  {
    href: "/channels",
    label: "CHANNELS",
    icon: Youtube,
    color: "text-[var(--cyber-red)]",
  },
  {
    href: "/broadcast",
    label: "BROADCAST",
    icon: Calendar,
    color: "text-[var(--cyber-cyan)]",
  },
  {
    href: "/flow",
    label: "FLOW",
    icon: Workflow,
    color: "text-[var(--cyber-purple)]",
  },
  {
    href: "/ops",
    label: "OPS",
    icon: Server,
    color: "text-[var(--cyber-yellow)]",
  },
  {
    href: "/studio",
    label: "STUDIO",
    icon: Sparkles,
    color: "text-[var(--cyber-green)]",
  },
  {
    href: "/terminal",
    label: "TERMINAL",
    icon: Terminal,
    color: "text-[var(--cyber-cyan)]",
  },
  {
    href: "/vault",
    label: "VAULT",
    icon: KeyRound,
    color: "text-[var(--cyber-purple)]",
  },
  {
    href: "/grid",
    label: "GRID",
    icon: BarChart3,
    color: "text-[var(--cyber-yellow)]",
  },
  {
    href: "/agent",
    label: "AGENT",
    icon: Bot,
    color: "text-[var(--cyber-green)]",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-16 lg:w-56 flex flex-col border-r border-[var(--cyber-border)] bg-[var(--cyber-surface)] z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-[var(--cyber-border)]">
        <div className="w-8 h-8 rounded bg-[var(--cyber-green)] flex items-center justify-center flex-shrink-0">
          <Zap size={16} className="text-[var(--cyber-bg)]" />
        </div>
        <span className="hidden lg:block text-sm font-bold tracking-[0.3em] text-[var(--cyber-green)] glow-green">
          AURA
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {modules.map((mod) => {
            const isActive = pathname.startsWith(mod.href);
            return (
              <li key={mod.href}>
                <Link
                  href={mod.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded text-xs font-mono tracking-wider transition-all duration-150",
                    isActive
                      ? "bg-[var(--cyber-dim)] text-[var(--cyber-text)]"
                      : "text-[var(--cyber-text-dim)] hover:text-[var(--cyber-text)] hover:bg-[var(--cyber-dim)]",
                  )}
                >
                  <mod.icon
                    size={16}
                    className={cn("flex-shrink-0", isActive ? mod.color : "")}
                  />
                  <span className="hidden lg:block">{mod.label}</span>
                  {isActive && (
                    <span className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-[var(--cyber-green)]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="border-t border-[var(--cyber-border)] px-2 py-3 space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded text-xs font-mono text-[var(--cyber-text-dim)] hover:text-[var(--cyber-text)] hover:bg-[var(--cyber-dim)] transition-all duration-150"
        >
          <Settings size={16} className="flex-shrink-0" />
          <span className="hidden lg:block">SETTINGS</span>
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-mono text-[var(--cyber-text-dim)] hover:text-[var(--cyber-red)] hover:bg-[rgba(255,45,85,0.1)] transition-all duration-150">
          <LogOut size={16} className="flex-shrink-0" />
          <span className="hidden lg:block">LOGOUT</span>
        </button>
      </div>
    </aside>
  );
}
