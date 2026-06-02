import { TerminalWindow } from "@/components/cyberdeck/terminal-window";
import { StatCard } from "@/components/cyberdeck/grid-panel";
import { KeyRound, Plus } from "lucide-react";

export default function VaultPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-widest text-[var(--cyber-purple)] uppercase">
            ▸ VAULT
          </h1>
          <p className="text-xs text-[var(--cyber-text-dim)] mt-1">
            Encrypted API key & secret storage
          </p>
        </div>
        <a
          href="#"
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded border border-[var(--cyber-purple)] text-[var(--cyber-purple)] hover:bg-[rgba(123,47,255,0.1)] transition-all"
        >
          <Plus size={12} /> Add Secret
        </a>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Stored Secrets" value="0" color="purple" />
        <StatCard label="Modules Covered" value="0" color="cyan" />
        <StatCard label="Expiring Soon" value="0" color="yellow" />
        <StatCard label="Encryption" value="AES-256" color="green" />
      </div>

      <TerminalWindow title="SECRETS" statusDot="online">
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <KeyRound
            size={48}
            className="text-[var(--cyber-purple)] opacity-30"
          />
          <p className="text-sm text-[var(--cyber-text-dim)]">
            No secrets stored. All secrets are encrypted with libsodium.
          </p>
        </div>
      </TerminalWindow>
    </div>
  );
}
