import { TerminalWindow } from "@/components/cyberdeck/terminal-window";
import { StatCard } from "@/components/cyberdeck/grid-panel";
import { BarChart3 } from "lucide-react";

export default function GridPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-widest text-[var(--cyber-yellow)] uppercase">
          ▸ GRID
        </h1>
        <p className="text-xs text-[var(--cyber-text-dim)] mt-1">
          Unified analytics across all platforms
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Reach" value="—" color="yellow" />
        <StatCard label="Engagements" value="—" color="cyan" />
        <StatCard label="New Followers" value="—" color="green" />
        <StatCard label="Top Platform" value="—" color="purple" />
      </div>

      <TerminalWindow title="ANALYTICS OVERVIEW">
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <BarChart3
            size={48}
            className="text-[var(--cyber-yellow)] opacity-30"
          />
          <p className="text-sm text-[var(--cyber-text-dim)]">
            Connect your channels and platforms to see unified analytics.
          </p>
        </div>
      </TerminalWindow>
    </div>
  );
}
