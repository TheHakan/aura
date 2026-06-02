"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/settings/keys", label: "API KEYS" },
  { href: "/settings/ai", label: "AI MODELS" },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-widest text-[var(--cyber-green)] uppercase">
          ▸ SETTINGS
        </h1>
        <p className="text-xs text-[var(--cyber-text-dim)] mt-1">
          Configure AURA — API keys, AI models, and preferences
        </p>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 border-b border-[var(--cyber-border)]">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "px-4 py-2 text-xs font-mono tracking-widest border-b-2 transition-colors duration-150",
                active
                  ? "border-[var(--cyber-green)] text-[var(--cyber-green)]"
                  : "border-transparent text-[var(--cyber-text-dim)] hover:text-[var(--cyber-text)]",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {children}
    </div>
  );
}
