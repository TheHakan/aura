"use client";

import { useEffect, useState, useCallback } from "react";
import { TerminalWindow } from "@/components/cyberdeck/terminal-window";
import { Youtube, Users, RefreshCw, Loader2, ExternalLink } from "lucide-react";
import { AuthGate } from "@/components/cyberdeck/auth-gate";

const CHANNELS_BENEFITS = [
  "Connect multiple YouTube channels via Google OAuth",
  "Subscriber count, view analytics & channel metadata",
  "Secure OAuth token storage — encrypted in your vault",
  "Foundation for BROADCAST scheduling & STUDIO analytics",
];

interface Channel {
  id: string;
  name: string;
  handle: string | null;
  thumbnailUrl: string | null;
  subscriberCount: string | null;
  youtubeChannelId: string;
  updatedAt: string;
}

function fmtSubs(n: string | null) {
  if (!n) return "—";
  const num = Number(n);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
}

export default function ChannelsPage() {
  return (
    <AuthGate
      feature="CHANNELS"
      color="var(--cyber-red)"
      benefits={CHANNELS_BENEFITS}
    >
      <ChannelsContent />
    </AuthGate>
  );
}

function ChannelsContent() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChannels = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/channels");
    if (res.ok) setChannels((await res.json()).channels ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  const totalSubs = channels.reduce(
    (acc, c) => acc + (Number(c.subscriberCount) || 0),
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-widest text-[var(--cyber-red)] uppercase">
            ▸ CHANNELS
          </h1>
          <p className="text-xs text-[var(--cyber-text-dim)] mt-1">
            YouTube multi-channel management
          </p>
        </div>
        <button
          onClick={fetchChannels}
          className="p-1.5 rounded text-[var(--cyber-text-dim)] hover:text-[var(--cyber-text)] hover:bg-[var(--cyber-dim)] transition-all"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Subscribers",
            value: totalSubs > 0 ? fmtSubs(String(totalSubs)) : "—",
            color: "var(--cyber-cyan)",
          },
          {
            label: "Channels",
            value: channels.length,
            color: "var(--cyber-purple)",
          },
          { label: "Total Views", value: "—", color: "var(--cyber-green)" },
          { label: "Est. Revenue", value: "—", color: "var(--cyber-yellow)" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded border border-[var(--cyber-border)] bg-[var(--cyber-surface-2)] px-4 py-3 space-y-1"
          >
            <p className="text-xs text-[var(--cyber-text-dim)] font-mono uppercase tracking-wider">
              {s.label}
            </p>
            <p
              className="text-2xl font-mono font-bold"
              style={{ color: s.color }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <TerminalWindow
        title="CONNECTED CHANNELS"
        statusDot={channels.length > 0 ? "online" : "offline"}
      >
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2
              size={20}
              className="animate-spin text-[var(--cyber-text-dim)]"
            />
          </div>
        ) : channels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Youtube size={48} className="text-[var(--cyber-red)] opacity-30" />
            <p className="text-sm text-[var(--cyber-text-dim)]">
              No channels connected yet.
            </p>
            <a
              href="/api/auth/callback/google"
              className="px-4 py-2 text-xs font-mono uppercase tracking-wider rounded border border-[var(--cyber-red)] text-[var(--cyber-red)] hover:bg-[rgba(255,45,85,0.1)] transition-all"
            >
              + Connect YouTube Channel
            </a>
            <p className="text-[10px] text-[var(--cyber-text-dim)] text-center max-w-xs">
              Connect your Google account with YouTube scope to manage channels.
              Configure{" "}
              <code className="text-[var(--cyber-yellow)]">
                GOOGLE_CLIENT_ID
              </code>{" "}
              and{" "}
              <code className="text-[var(--cyber-yellow)]">
                GOOGLE_CLIENT_SECRET
              </code>{" "}
              in <code>.env</code> first.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {channels.map((ch) => (
              <div
                key={ch.id}
                className="rounded border border-[var(--cyber-border)] bg-[var(--cyber-surface-2)] p-4 space-y-3 hover:border-[rgba(255,255,255,0.15)] transition-all"
              >
                <div className="flex items-center gap-3">
                  {ch.thumbnailUrl ? (
                    <img
                      src={ch.thumbnailUrl}
                      alt={ch.name}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[var(--cyber-dim)] flex items-center justify-center">
                      <Youtube size={20} className="text-[var(--cyber-red)]" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-mono font-bold text-[var(--cyber-text)] truncate">
                      {ch.name}
                    </p>
                    {ch.handle && (
                      <p className="text-xs text-[var(--cyber-text-dim)] font-mono">
                        {ch.handle}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--cyber-text-dim)]">
                  <Users size={12} />
                  <span>{fmtSubs(ch.subscriberCount)} subscribers</span>
                </div>
                <a
                  href={`https://youtube.com/channel/${ch.youtubeChannelId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] font-mono text-[var(--cyber-text-dim)] hover:text-[var(--cyber-red)] transition-colors"
                >
                  <ExternalLink size={10} /> View on YouTube
                </a>
              </div>
            ))}
          </div>
        )}
      </TerminalWindow>
    </div>
  );
}
