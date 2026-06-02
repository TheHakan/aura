"use client";

import { useEffect, useState, useCallback } from "react";
import { TerminalWindow } from "@/components/cyberdeck/terminal-window";
import { CyberButton } from "@/components/cyberdeck/cyber-button";
import {
  Server,
  Activity,
  Plus,
  Trash2,
  X,
  Loader2,
  RefreshCw,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthGate } from "@/components/cyberdeck/auth-gate";

const OPS_BENEFITS = [
  "Persistent server registry with Coolify integration",
  "Uptime monitors with response-time history",
  "One-click manual ping + scheduled auto-pings (Phase 2)",
  "SSH key storage — encrypted in your vault",
];

interface ServerEntry {
  id: string;
  name: string;
  host: string | null;
  coolifyServerId: string | null;
  createdAt: string;
}
interface UptimeCheck {
  id: string;
  name: string;
  url: string;
  isUp: boolean | null;
  responseTimeMs: string | null;
  lastCheckedAt: string | null;
}

export default function OpsPage() {
  return (
    <AuthGate feature="OPS" color="var(--cyber-yellow)" benefits={OPS_BENEFITS}>
      <OpsContent />
    </AuthGate>
  );
}

function OpsContent() {
  const [servers, setServers] = useState<ServerEntry[]>([]);
  const [checks, setChecks] = useState<UptimeCheck[]>([]);
  const [loading, setLoading] = useState(true);

  const [serverModal, setServerModal] = useState(false);
  const [uptimeModal, setUptimeModal] = useState(false);

  const [serverForm, setServerForm] = useState({
    name: "",
    host: "",
    coolifyServerId: "",
  });
  const [uptimeForm, setUptimeForm] = useState({ name: "", url: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [pingingId, setPingingId] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [sr, ur] = await Promise.all([
      fetch("/api/ops/servers"),
      fetch("/api/ops/uptime"),
    ]);
    if (sr.ok) setServers((await sr.json()).servers ?? []);
    if (ur.ok) setChecks((await ur.json()).checks ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function addServer() {
    if (!serverForm.name.trim()) return;
    setSubmitting(true);
    setFormError("");
    const res = await fetch("/api/ops/servers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(serverForm),
    });
    if (res.ok) {
      const { server } = await res.json();
      setServers((prev) => [server, ...prev]);
      setServerModal(false);
      setServerForm({ name: "", host: "", coolifyServerId: "" });
    } else {
      const data = await res.json();
      setFormError(data.error ?? "Failed");
    }
    setSubmitting(false);
  }

  async function deleteServer(id: string) {
    if (!confirm("Remove server?")) return;
    if ((await fetch(`/api/ops/servers/${id}`, { method: "DELETE" })).ok)
      setServers((prev) => prev.filter((s) => s.id !== id));
  }

  async function addUptime() {
    if (!uptimeForm.name.trim() || !uptimeForm.url.trim()) return;
    setSubmitting(true);
    setFormError("");
    const res = await fetch("/api/ops/uptime", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(uptimeForm),
    });
    if (res.ok) {
      const { check } = await res.json();
      setChecks((prev) => [check, ...prev]);
      setUptimeModal(false);
      setUptimeForm({ name: "", url: "" });
    } else {
      const data = await res.json();
      setFormError(data.error ?? "Failed");
    }
    setSubmitting(false);
  }

  async function deleteUptime(id: string) {
    if (!confirm("Remove monitor?")) return;
    if ((await fetch(`/api/ops/uptime/${id}`, { method: "DELETE" })).ok)
      setChecks((prev) => prev.filter((c) => c.id !== id));
  }

  async function pingNow(id: string) {
    setPingingId(id);
    const res = await fetch(`/api/ops/uptime/${id}/ping`, { method: "POST" });
    if (res.ok) {
      const { check } = await res.json();
      setChecks((prev) => prev.map((c) => (c.id === id ? check : c)));
    }
    setPingingId(null);
  }

  const upCount = checks.filter((c) => c.isUp === true).length;
  const downCount = checks.filter((c) => c.isUp === false).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-widest text-[var(--cyber-yellow)] uppercase">
            ▸ OPS
          </h1>
          <p className="text-xs text-[var(--cyber-text-dim)] mt-1">
            DevOps monitoring — Coolify, Hetzner, uptime
          </p>
        </div>
        <button
          onClick={fetchAll}
          className="p-1.5 rounded text-[var(--cyber-text-dim)] hover:text-[var(--cyber-text)] hover:bg-[var(--cyber-dim)] transition-all"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Servers",
            value: servers.length,
            color: "var(--cyber-yellow)",
          },
          { label: "Up", value: upCount, color: "var(--cyber-green)" },
          { label: "Down", value: downCount, color: "var(--cyber-red)" },
          {
            label: "Monitors",
            value: checks.length,
            color: "var(--cyber-cyan)",
          },
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

      {/* Servers */}
      <TerminalWindow
        title="SERVERS"
        statusDot={servers.length > 0 ? "online" : "offline"}
      >
        <div className="p-4 space-y-3">
          <div className="flex justify-end">
            <CyberButton
              variant="secondary"
              size="sm"
              onClick={() => {
                setFormError("");
                setServerModal(true);
              }}
              className="flex items-center gap-1.5 border-[var(--cyber-yellow)] !text-[var(--cyber-yellow)] hover:bg-[rgba(255,215,0,0.08)]"
            >
              <Plus size={12} /> Add Server
            </CyberButton>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2
                size={18}
                className="animate-spin text-[var(--cyber-text-dim)]"
              />
            </div>
          ) : servers.length === 0 ? (
            <div className="flex flex-col items-center py-8 gap-2">
              <Server
                size={36}
                className="text-[var(--cyber-yellow)] opacity-30"
              />
              <p className="text-xs text-[var(--cyber-text-dim)]">
                No servers added yet.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {servers.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded border border-[var(--cyber-border)] bg-[var(--cyber-surface-2)] hover:border-[rgba(255,255,255,0.15)] transition-all"
                >
                  <Server
                    size={14}
                    className="text-[var(--cyber-yellow)] flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono font-bold text-[var(--cyber-text)]">
                      {s.name}
                    </p>
                    {s.host && (
                      <p className="text-[10px] font-mono text-[var(--cyber-text-dim)]">
                        {s.host}
                      </p>
                    )}
                    {s.coolifyServerId && (
                      <p className="text-[10px] font-mono text-[var(--cyber-text-dim)] opacity-60">
                        Coolify: {s.coolifyServerId}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteServer(s.id)}
                    className="p-1.5 rounded text-[var(--cyber-text-dim)] hover:text-[var(--cyber-red)] hover:bg-[var(--cyber-dim)] transition-all flex-shrink-0"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </TerminalWindow>

      {/* Uptime Monitors */}
      <TerminalWindow
        title="UPTIME MONITORS"
        statusDot={
          checks.some((c) => c.isUp === false)
            ? "offline"
            : checks.length > 0
              ? "online"
              : "pending"
        }
      >
        <div className="p-4 space-y-3">
          <div className="flex justify-end">
            <CyberButton
              variant="secondary"
              size="sm"
              onClick={() => {
                setFormError("");
                setUptimeModal(true);
              }}
              className="flex items-center gap-1.5 border-[var(--cyber-cyan)] !text-[var(--cyber-cyan)] hover:bg-[rgba(0,212,255,0.08)]"
            >
              <Plus size={12} /> Add Monitor
            </CyberButton>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2
                size={18}
                className="animate-spin text-[var(--cyber-text-dim)]"
              />
            </div>
          ) : checks.length === 0 ? (
            <div className="flex flex-col items-center py-8 gap-2">
              <Activity
                size={36}
                className="text-[var(--cyber-cyan)] opacity-30"
              />
              <p className="text-xs text-[var(--cyber-text-dim)]">
                No uptime monitors configured.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {checks.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded border border-[var(--cyber-border)] bg-[var(--cyber-surface-2)] hover:border-[rgba(255,255,255,0.15)] transition-all"
                >
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full flex-shrink-0",
                      c.isUp === null
                        ? "bg-[var(--cyber-text-dim)]"
                        : c.isUp
                          ? "bg-[var(--cyber-green)] shadow-[0_0_6px_var(--cyber-green)]"
                          : "bg-[var(--cyber-red)] shadow-[0_0_6px_var(--cyber-red)]",
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono font-bold text-[var(--cyber-text)]">
                      {c.name}
                    </p>
                    <p className="text-[10px] font-mono text-[var(--cyber-text-dim)] truncate">
                      {c.url}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono flex-shrink-0">
                    {c.responseTimeMs && (
                      <span className="text-[var(--cyber-green)]">
                        {c.responseTimeMs}ms
                      </span>
                    )}
                    {c.lastCheckedAt && (
                      <span className="text-[var(--cyber-text-dim)]">
                        {new Date(c.lastCheckedAt).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => pingNow(c.id)}
                    disabled={pingingId === c.id}
                    className="p-1.5 rounded text-[var(--cyber-text-dim)] hover:text-[var(--cyber-cyan)] hover:bg-[var(--cyber-dim)] transition-all flex-shrink-0"
                    title="Ping now"
                  >
                    {pingingId === c.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Zap size={12} />
                    )}
                  </button>
                  <button
                    onClick={() => deleteUptime(c.id)}
                    className="p-1.5 rounded text-[var(--cyber-text-dim)] hover:text-[var(--cyber-red)] hover:bg-[var(--cyber-dim)] transition-all flex-shrink-0"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </TerminalWindow>

      {/* Server Modal */}
      {serverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-lg border border-[var(--cyber-border)] bg-[var(--cyber-surface)] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-mono font-bold text-[var(--cyber-yellow)] uppercase tracking-widest">
                Add Server
              </h2>
              <button
                onClick={() => setServerModal(false)}
                className="p-1 rounded text-[var(--cyber-text-dim)] hover:text-[var(--cyber-text)]"
              >
                <X size={14} />
              </button>
            </div>
            {formError && (
              <p className="text-xs text-[var(--cyber-red)] font-mono">
                {formError}
              </p>
            )}
            <div className="space-y-3">
              {[
                { label: "Name *", key: "name", placeholder: "production-1" },
                { label: "Host / IP", key: "host", placeholder: "192.168.1.1" },
                {
                  label: "Coolify Server ID",
                  key: "coolifyServerId",
                  placeholder: "optional",
                },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-[10px] font-mono text-[var(--cyber-text-dim)] uppercase tracking-wider mb-1">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={serverForm[key as keyof typeof serverForm]}
                    onChange={(e) =>
                      setServerForm({ ...serverForm, [key]: e.target.value })
                    }
                    placeholder={placeholder}
                    className="w-full px-3 py-2 text-xs font-mono rounded border border-[var(--cyber-border)] bg-[var(--cyber-surface-2)] text-[var(--cyber-text)] placeholder:text-[var(--cyber-text-dim)] focus:outline-none focus:border-[var(--cyber-yellow)] transition-colors"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <CyberButton
                variant="ghost"
                size="sm"
                onClick={() => setServerModal(false)}
                className="flex-1"
              >
                Cancel
              </CyberButton>
              <button
                onClick={addServer}
                disabled={submitting || !serverForm.name.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-1.5 text-xs font-mono uppercase rounded bg-[var(--cyber-yellow)] hover:opacity-90 text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {submitting && <Loader2 size={12} className="animate-spin" />}
                {submitting ? "Adding..." : "Add Server"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Uptime Modal */}
      {uptimeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-lg border border-[var(--cyber-border)] bg-[var(--cyber-surface)] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-mono font-bold text-[var(--cyber-cyan)] uppercase tracking-widest">
                Add Monitor
              </h2>
              <button
                onClick={() => setUptimeModal(false)}
                className="p-1 rounded text-[var(--cyber-text-dim)] hover:text-[var(--cyber-text)]"
              >
                <X size={14} />
              </button>
            </div>
            {formError && (
              <p className="text-xs text-[var(--cyber-red)] font-mono">
                {formError}
              </p>
            )}
            <div className="space-y-3">
              {[
                {
                  label: "Name *",
                  key: "name",
                  placeholder: "My Website",
                  type: "text",
                },
                {
                  label: "URL *",
                  key: "url",
                  placeholder: "https://example.com",
                  type: "url",
                },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-[10px] font-mono text-[var(--cyber-text-dim)] uppercase tracking-wider mb-1">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={uptimeForm[key as keyof typeof uptimeForm]}
                    onChange={(e) =>
                      setUptimeForm({ ...uptimeForm, [key]: e.target.value })
                    }
                    placeholder={placeholder}
                    className="w-full px-3 py-2 text-xs font-mono rounded border border-[var(--cyber-border)] bg-[var(--cyber-surface-2)] text-[var(--cyber-text)] placeholder:text-[var(--cyber-text-dim)] focus:outline-none focus:border-[var(--cyber-cyan)] transition-colors"
                  />
                </div>
              ))}
              <p className="text-[10px] text-[var(--cyber-text-dim)] font-mono">
                A ping will run immediately on creation.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <CyberButton
                variant="ghost"
                size="sm"
                onClick={() => setUptimeModal(false)}
                className="flex-1"
              >
                Cancel
              </CyberButton>
              <button
                onClick={addUptime}
                disabled={
                  submitting ||
                  !uptimeForm.name.trim() ||
                  !uptimeForm.url.trim()
                }
                className="flex-1 flex items-center justify-center gap-2 px-4 py-1.5 text-xs font-mono uppercase rounded border border-[var(--cyber-cyan)] text-[var(--cyber-cyan)] hover:bg-[rgba(0,212,255,0.1)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {submitting && <Loader2 size={12} className="animate-spin" />}
                {submitting ? "Adding..." : "Add Monitor"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
