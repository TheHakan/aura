"use client";

import { useState, useEffect, useCallback } from "react";
import { TerminalWindow } from "@/components/cyberdeck/terminal-window";
import { CyberButton } from "@/components/cyberdeck/cyber-button";
import { KeyRound, Plus, Eye, EyeOff, Trash2, X, Loader2 } from "lucide-react";
import { AuthGate } from "@/components/cyberdeck/auth-gate";

const VAULT_BENEFITS = [
  "End-to-end encrypted secret storage (XSalsa20-Poly1305)",
  "Per-module secret organisation — tag secrets to CHANNELS, OPS, AGENT, etc.",
  "Rotation reminders — get notified before API keys expire",
  "Sync across devices via your personal workspace",
];

const MODULES = [
  "GLOBAL",
  "CHANNELS",
  "BROADCAST",
  "FLOW",
  "OPS",
  "STUDIO",
  "TERMINAL",
  "GRID",
  "AGENT",
];

interface VaultItem {
  id: string;
  name: string;
  module: string;
  createdAt: string;
  rotationReminderAt: string | null;
}

export default function VaultPage() {
  return (
    <AuthGate
      feature="VAULT"
      color="var(--cyber-purple)"
      benefits={VAULT_BENEFITS}
    >
      <VaultContent />
    </AuthGate>
  );
}

function VaultContent() {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    module: "GLOBAL",
    value: "",
    rotationDays: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [revealId, setRevealId] = useState<string | null>(null);
  const [revealedValue, setRevealedValue] = useState<string | null>(null);
  const [revealing, setRevealing] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/vault");
    if (res.ok) setItems((await res.json()).items ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  async function addItem() {
    if (!form.name.trim() || !form.value.trim()) return;
    setSubmitting(true);
    setFormError("");
    const res = await fetch("/api/vault", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        module: form.module,
        value: form.value,
        rotationDays: form.rotationDays ? Number(form.rotationDays) : undefined,
      }),
    });
    if (res.ok) {
      const { item } = await res.json();
      setItems((prev) => [item, ...prev]);
      setShowModal(false);
      setForm({ name: "", module: "GLOBAL", value: "", rotationDays: "" });
    } else {
      setFormError((await res.json()).error ?? "Failed to save");
    }
    setSubmitting(false);
  }

  async function deleteItem(id: string) {
    if (!confirm("Permanently delete this secret?")) return;
    if ((await fetch(`/api/vault/${id}`, { method: "DELETE" })).ok)
      setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function toggleReveal(id: string) {
    if (revealId === id) {
      setRevealId(null);
      setRevealedValue(null);
      return;
    }
    setRevealing(true);
    const res = await fetch(`/api/vault/${id}`);
    if (res.ok) {
      setRevealId(id);
      setRevealedValue((await res.json()).value);
    }
    setRevealing(false);
  }

  const expiringSoon = items.filter(
    (i) =>
      i.rotationReminderAt &&
      new Date(i.rotationReminderAt) < new Date(Date.now() + 7 * 86400_000),
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-widest text-[var(--cyber-purple)] uppercase">
            ▸ VAULT
          </h1>
          <p className="text-xs text-[var(--cyber-text-dim)] mt-1">
            Encrypted API key &amp; secret storage (XSalsa20-Poly1305)
          </p>
        </div>
        <CyberButton
          variant="secondary"
          size="sm"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 border-[var(--cyber-purple)] !text-[var(--cyber-purple)] hover:bg-[rgba(123,47,255,0.1)]"
        >
          <Plus size={12} /> Add Secret
        </CyberButton>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Stored Secrets",
            value: items.length,
            color: "var(--cyber-purple)",
          },
          {
            label: "Modules Covered",
            value: new Set(items.map((i) => i.module)).size,
            color: "var(--cyber-cyan)",
          },
          {
            label: "Expiring Soon",
            value: expiringSoon,
            color: "var(--cyber-yellow)",
          },
          {
            label: "Encryption",
            value: "Poly1305",
            color: "var(--cyber-green)",
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

      <TerminalWindow title="SECRETS" statusDot="online">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2
              size={20}
              className="animate-spin text-[var(--cyber-text-dim)]"
            />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <KeyRound
              size={48}
              className="text-[var(--cyber-purple)] opacity-30"
            />
            <p className="text-sm text-[var(--cyber-text-dim)]">
              No secrets stored. Click &ldquo;Add Secret&rdquo; to get started.
            </p>
          </div>
        ) : (
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="text-[var(--cyber-text-dim)] border-b border-[var(--cyber-border)]">
                {["Name", "Module", "Created", "Value", ""].map((h) => (
                  <th
                    key={h}
                    className="text-left py-2 px-3 font-normal uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[var(--cyber-border)] last:border-0 hover:bg-[var(--cyber-surface-2)] transition-colors"
                >
                  <td className="py-2.5 px-3 text-[var(--cyber-text)]">
                    {item.name}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[9px] uppercase bg-[rgba(123,47,255,0.15)] text-[var(--cyber-purple)]">
                      {item.module}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[var(--cyber-text-dim)]">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2.5 px-3">
                    {revealId === item.id && revealedValue ? (
                      <span className="text-[var(--cyber-green)] bg-[rgba(0,255,136,0.08)] px-2 py-0.5 rounded select-all">
                        {revealedValue}
                      </span>
                    ) : (
                      <span className="text-[var(--cyber-text-dim)] tracking-widest">
                        ••••••••
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => toggleReveal(item.id)}
                        disabled={revealing && revealId !== item.id}
                        className="p-1.5 rounded text-[var(--cyber-text-dim)] hover:text-[var(--cyber-cyan)] hover:bg-[var(--cyber-dim)] transition-all"
                        title={revealId === item.id ? "Hide" : "Reveal"}
                      >
                        {revealId === item.id ? (
                          <EyeOff size={12} />
                        ) : (
                          <Eye size={12} />
                        )}
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-1.5 rounded text-[var(--cyber-text-dim)] hover:text-[var(--cyber-red)] hover:bg-[var(--cyber-dim)] transition-all"
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TerminalWindow>

      {/* Add Secret Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border border-[var(--cyber-border)] bg-[var(--cyber-surface)] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-mono font-bold text-[var(--cyber-purple)] uppercase tracking-widest">
                Add Secret
              </h2>
              <button
                onClick={() => setShowModal(false)}
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
                  label: "Name",
                  key: "name",
                  type: "text",
                  placeholder: "OPENAI_API_KEY",
                },
                {
                  label: "Value",
                  key: "value",
                  type: "password",
                  placeholder: "sk-...",
                },
                {
                  label: "Rotation Reminder (days, optional)",
                  key: "rotationDays",
                  type: "number",
                  placeholder: "90",
                },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-[10px] font-mono text-[var(--cyber-text-dim)] uppercase tracking-wider mb-1">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={form[key as keyof typeof form]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    placeholder={placeholder}
                    className="w-full px-3 py-2 text-xs font-mono rounded border border-[var(--cyber-border)] bg-[var(--cyber-surface-2)] text-[var(--cyber-text)] placeholder:text-[var(--cyber-text-dim)] focus:outline-none focus:border-[var(--cyber-purple)] transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="block text-[10px] font-mono text-[var(--cyber-text-dim)] uppercase tracking-wider mb-1">
                  Module
                </label>
                <select
                  value={form.module}
                  onChange={(e) => setForm({ ...form, module: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono rounded border border-[var(--cyber-border)] bg-[var(--cyber-surface-2)] text-[var(--cyber-text)] focus:outline-none focus:border-[var(--cyber-purple)] transition-colors"
                >
                  {MODULES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <CyberButton
                variant="ghost"
                size="sm"
                onClick={() => setShowModal(false)}
                className="flex-1"
              >
                Cancel
              </CyberButton>
              <button
                onClick={addItem}
                disabled={submitting || !form.name.trim() || !form.value.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-1.5 text-xs font-mono uppercase rounded bg-[var(--cyber-purple)] hover:bg-[rgba(123,47,255,0.9)] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(123,47,255,0.3)]"
              >
                {submitting && <Loader2 size={12} className="animate-spin" />}
                {submitting ? "Saving..." : "Save Secret"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
