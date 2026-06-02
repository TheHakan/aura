import { TerminalWindow } from "@/components/cyberdeck/terminal-window";
import { StatCard } from "@/components/cyberdeck/grid-panel";
import { Server, Activity } from "lucide-react";

export default function OpsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-widest text-[var(--cyber-yellow)] uppercase">
          ▸ OPS
        </h1>
        <p className="text-xs text-[var(--cyber-text-dim)] mt-1">
          DevOps monitoring — Coolify, Hetzner, uptime
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Servers" value="0" color="yellow" />
        <StatCard label="Services Up" value="—" color="green" />
        <StatCard label="Services Down" value="—" color="cyan" />
        <StatCard label="Avg Uptime" value="—" color="purple" />
      </div>

      <TerminalWindow title="INFRASTRUCTURE" statusDot="offline">
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Server size={48} className="text-[var(--cyber-yellow)] opacity-30" />
          <p className="text-sm text-[var(--cyber-text-dim)]">
            No servers added. Connect your Coolify instance to begin.
          </p>
        </div>
      </TerminalWindow>
    </div>
  );
}
