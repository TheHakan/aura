import { TerminalWindow } from "@/components/cyberdeck/terminal-window";
import { StatCard } from "@/components/cyberdeck/grid-panel";
import { Calendar } from "lucide-react";

export default function BroadcastPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-widest text-[var(--cyber-cyan)] uppercase">
          ▸ BROADCAST
        </h1>
        <p className="text-xs text-[var(--cyber-text-dim)] mt-1">
          Social media scheduling across all platforms
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Scheduled Posts" value="0" color="cyan" />
        <StatCard label="Published Today" value="0" color="green" />
        <StatCard label="Platforms" value="0" color="purple" />
        <StatCard label="Pending" value="0" color="yellow" />
      </div>

      <TerminalWindow title="CONTENT CALENDAR" statusDot="offline">
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Calendar size={48} className="text-[var(--cyber-cyan)] opacity-30" />
          <p className="text-sm text-[var(--cyber-text-dim)]">
            No posts scheduled. Connect platforms to get started.
          </p>
        </div>
      </TerminalWindow>
    </div>
  );
}
