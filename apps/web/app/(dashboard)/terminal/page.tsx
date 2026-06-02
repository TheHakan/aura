import { TerminalWindow } from "@/components/cyberdeck/terminal-window";
import { Terminal as TerminalIcon } from "lucide-react";

export default function TerminalPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-widest text-[var(--cyber-cyan)] uppercase">
          ▸ TERMINAL
        </h1>
        <p className="text-xs text-[var(--cyber-text-dim)] mt-1">
          Web SSH — browser-based terminal access
        </p>
      </div>

      <TerminalWindow title="SSH TERMINAL" statusDot="offline">
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <TerminalIcon
            size={48}
            className="text-[var(--cyber-cyan)] opacity-30"
          />
          <p className="text-sm text-[var(--cyber-text-dim)]">
            Terminal requires xterm.js + node-pty (Phase 2).
          </p>
          <p className="text-xs text-[var(--cyber-text-dim)] opacity-60">
            Add your servers in OPS module first.
          </p>
        </div>
      </TerminalWindow>
    </div>
  );
}
