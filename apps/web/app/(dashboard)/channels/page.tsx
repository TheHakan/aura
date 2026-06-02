import { TerminalWindow } from "@/components/cyberdeck/terminal-window";
import { StatCard } from "@/components/cyberdeck/grid-panel";
import { Youtube, TrendingUp, Eye, DollarSign } from "lucide-react";

export default function ChannelsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-widest text-[var(--cyber-red)] uppercase">
          ▸ CHANNELS
        </h1>
        <p className="text-xs text-[var(--cyber-text-dim)] mt-1">
          YouTube multi-channel management
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Subscribers" value="—" color="cyan" />
        <StatCard label="Total Views" value="—" color="green" />
        <StatCard label="Channels" value="0" color="purple" />
        <StatCard label="Est. Revenue" value="—" color="yellow" />
      </div>

      <TerminalWindow title="CONNECTED CHANNELS" statusDot="offline">
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Youtube size={48} className="text-[var(--cyber-red)] opacity-30" />
          <p className="text-sm text-[var(--cyber-text-dim)]">
            No channels connected yet.
          </p>
          <a
            href="/api/auth/signin/google"
            className="px-4 py-2 text-xs font-mono uppercase tracking-wider rounded border border-[var(--cyber-red)] text-[var(--cyber-red)] hover:bg-[rgba(255,45,85,0.1)] transition-all"
          >
            + Connect YouTube Channel
          </a>
        </div>
      </TerminalWindow>
    </div>
  );
}
