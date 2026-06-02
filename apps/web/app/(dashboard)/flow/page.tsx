import { TerminalWindow } from "@/components/cyberdeck/terminal-window";
import { StatCard } from "@/components/cyberdeck/grid-panel";
import { Workflow } from "lucide-react";

export default function FlowPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-widest text-[var(--cyber-purple)] uppercase">
          ▸ FLOW
        </h1>
        <p className="text-xs text-[var(--cyber-text-dim)] mt-1">
          Automation workflows via n8n
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Workflows" value="0" color="purple" />
        <StatCard label="Runs Today" value="0" color="cyan" />
        <StatCard label="Failed" value="0" color="green" />
        <StatCard label="Pending" value="0" color="yellow" />
      </div>

      <TerminalWindow title="WORKFLOWS">
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Workflow
            size={48}
            className="text-[var(--cyber-purple)] opacity-30"
          />
          <p className="text-sm text-[var(--cyber-text-dim)]">
            No workflows configured. Set your n8n URL in settings.
          </p>
        </div>
      </TerminalWindow>
    </div>
  );
}
