import { TerminalWindow } from "@/components/cyberdeck/terminal-window";
import {
  Calendar,
  ExternalLink,
  Youtube,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Globe,
} from "lucide-react";

const PLATFORMS = [
  { id: "youtube", label: "YouTube", icon: Youtube, color: "var(--cyber-red)" },
  {
    id: "instagram",
    label: "Instagram",
    icon: Instagram,
    color: "var(--cyber-purple)",
  },
  {
    id: "twitter",
    label: "X / Twitter",
    icon: Twitter,
    color: "var(--cyber-cyan)",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: Linkedin,
    color: "var(--cyber-cyan)",
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: Facebook,
    color: "var(--cyber-cyan)",
  },
  { id: "tiktok", label: "TikTok", icon: Globe, color: "var(--cyber-text)" },
  { id: "threads", label: "Threads", icon: Globe, color: "var(--cyber-text)" },
] as const;

export default function BroadcastPage() {
  const postizUrl = process.env["NEXT_PUBLIC_POSTIZ_URL"] ?? "";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-widest text-[var(--cyber-cyan)] uppercase">
            ▸ BROADCAST
          </h1>
          <p className="text-xs text-[var(--cyber-text-dim)] mt-1">
            Social media scheduling via Postiz (self-hosted)
          </p>
        </div>
        {postizUrl && (
          <a
            href={postizUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono uppercase rounded border border-[var(--cyber-cyan)] text-[var(--cyber-cyan)] hover:bg-[rgba(0,212,255,0.1)] transition-all"
          >
            <ExternalLink size={12} /> Open Postiz
          </a>
        )}
      </div>

      {/* Postiz Setup */}
      <TerminalWindow title="POSTIZ CONFIGURATION">
        <div className="p-4 space-y-4">
          {postizUrl ? (
            <div className="flex items-center gap-3 px-4 py-3 rounded border border-[rgba(0,255,136,0.3)] bg-[rgba(0,255,136,0.05)]">
              <span className="w-2 h-2 rounded-full bg-[var(--cyber-green)] shadow-[0_0_6px_var(--cyber-green)]" />
              <p className="text-xs font-mono text-[var(--cyber-green)]">
                Postiz connected at{" "}
                <a
                  href={postizUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                >
                  {postizUrl}
                </a>
              </p>
            </div>
          ) : (
            <div className="space-y-3 text-xs font-mono">
              <p className="text-[var(--cyber-text-dim)]">
                Postiz is not configured. Add these env vars to{" "}
                <code className="text-[var(--cyber-yellow)]">.env</code>:
              </p>
              <div className="rounded border border-[var(--cyber-border)] bg-[var(--cyber-dim)] p-3 space-y-1 text-[var(--cyber-text)]">
                <p>
                  <span className="text-[var(--cyber-yellow)]">
                    NEXT_PUBLIC_POSTIZ_URL
                  </span>
                  =http://localhost:5000
                </p>
                <p>
                  <span className="text-[var(--cyber-yellow)]">
                    POSTIZ_API_KEY
                  </span>
                  =your-postiz-api-key
                </p>
              </div>
              <div className="rounded border border-[rgba(255,215,0,0.25)] bg-[rgba(255,215,0,0.04)] p-3 space-y-1">
                <p className="text-[var(--cyber-yellow)] font-bold">
                  Start Postiz:
                </p>
                <code className="text-[var(--cyber-text)]">
                  docker compose -f docker/docker-compose.dev.yml up postiz -d
                </code>
              </div>
              <a
                href="https://postiz.com/docs/self-hosting"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[var(--cyber-cyan)] hover:underline"
              >
                <ExternalLink size={10} /> Postiz self-hosting docs →
              </a>
            </div>
          )}
        </div>
      </TerminalWindow>

      {/* Platforms */}
      <TerminalWindow
        title="SUPPORTED PLATFORMS"
        statusDot={postizUrl ? "online" : "offline"}
      >
        <div className="p-4">
          <p className="text-xs text-[var(--cyber-text-dim)] font-mono mb-4">
            Connect platforms inside the Postiz dashboard. Aura uses Postiz as
            its scheduling engine.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {PLATFORMS.map(({ id, label, icon: Icon, color }) => (
              <div
                key={id}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded border border-[var(--cyber-border)] bg-[var(--cyber-surface-2)] hover:border-[rgba(255,255,255,0.15)] transition-all"
              >
                <Icon size={14} style={{ color }} />
                <span className="text-xs font-mono text-[var(--cyber-text)]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </TerminalWindow>

      {/* Content calendar placeholder */}
      <TerminalWindow
        title="CONTENT CALENDAR"
        statusDot={postizUrl ? "pending" : "offline"}
      >
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Calendar size={48} className="text-[var(--cyber-cyan)] opacity-30" />
          <p className="text-sm text-[var(--cyber-text-dim)]">
            {postizUrl
              ? "Open Postiz to schedule and manage posts."
              : "Configure Postiz to enable the content calendar."}
          </p>
          {postizUrl && (
            <a
              href={postizUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase rounded border border-[var(--cyber-cyan)] text-[var(--cyber-cyan)] hover:bg-[rgba(0,212,255,0.1)] transition-all"
            >
              <ExternalLink size={12} /> Open Postiz Dashboard
            </a>
          )}
        </div>
      </TerminalWindow>
    </div>
  );
}
