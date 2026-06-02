"use client";

import { useEffect, useState, useCallback } from "react";
import { CyberButton } from "@/components/cyberdeck/cyber-button";
import { AuthGate } from "@/components/cyberdeck/auth-gate";
import {
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  Circle,
  Loader2,
  Trash2,
  Save,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProviderDef {
  key: string;
  label: string;
  description: string;
  placeholder: string;
  docsUrl: string;
  color: string;
}

const PROVIDERS: ProviderDef[] = [
  {
    key: "ANTHROPIC_API_KEY",
    label: "Anthropic",
    description: "Claude Sonnet, Haiku, Opus — best for reasoning & writing",
    placeholder: "sk-ant-api03-…",
    docsUrl: "https://console.anthropic.com/keys",
    color: "var(--cyber-green)",
  },
  {
    key: "OPENAI_API_KEY",
    label: "OpenAI",
    description: "GPT-4o, o1, o3 — versatile general-purpose models",
    placeholder: "sk-proj-…",
    docsUrl: "https://platform.openai.com/api-keys",
    color: "var(--cyber-cyan)",
  },
  {
    key: "GROQ_API_KEY",
    label: "Groq",
    description: "Llama 3.3 70B at 500+ tok/s — fastest cloud inference",
    placeholder: "gsk_…",
    docsUrl: "https://console.groq.com/keys",
    color: "var(--cyber-purple)",
  },
  {
    key: "GEMINI_API_KEY",
    label: "Google Gemini",
    description: "Gemini 2.0 Flash, Pro — multimodal Google models",
    placeholder: "AIzaSy…",
    docsUrl: "https://aistudio.google.com/app/apikey",
    color: "var(--cyber-yellow)",
  },
  {
    key: "MISTRAL_API_KEY",
    label: "Mistral",
    description: "Mistral Large, Codestral — European AI models",
    placeholder: "…",
    docsUrl: "https://console.mistral.ai/api-keys",
    color: "var(--cyber-red)",
  },
];

const LOCAL_SETTINGS: ProviderDef[] = [
  {
    key: "OLLAMA_BASE_URL",
    label: "Ollama Base URL",
    description: "URL of your local Ollama instance",
    placeholder: "http://localhost:11434",
    docsUrl: "https://ollama.com",
    color: "var(--cyber-green)",
  },
  {
    key: "OLLAMA_MODEL",
    label: "Ollama Default Model",
    description: "Model name to use when no cloud key is configured",
    placeholder: "llama3.2",
    docsUrl: "https://ollama.com/library",
    color: "var(--cyber-green)",
  },
];

interface KeyStatus {
  key: string;
  isSetInDb: boolean;
  isSetInEnv: boolean;
}

function ProviderCard({
  def,
  status,
  onSave,
  onDelete,
}: {
  def: ProviderDef;
  status: KeyStatus | undefined;
  onSave: (key: string, value: string) => Promise<void>;
  onDelete: (key: string) => Promise<void>;
}) {
  const [value, setValue] = useState("");
  const [showValue, setShowValue] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const isActive = status?.isSetInDb || status?.isSetInEnv;

  async function handleSave() {
    if (!value.trim()) return;
    setSaving(true);
    setError("");
    try {
      await onSave(def.key, value.trim());
      setValue("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setError("");
    try {
      await onDelete(def.key);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div
      className={cn(
        "border rounded-lg p-4 space-y-3 transition-colors",
        isActive
          ? "border-[var(--cyber-border)] bg-[var(--cyber-surface)]"
          : "border-[var(--cyber-border)] bg-[var(--cyber-surface)]",
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <KeyRound
            size={16}
            className="flex-shrink-0"
            style={{ color: def.color }}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold text-[var(--cyber-text)]">
                {def.label}
              </span>
              {status?.isSetInDb && (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-[rgba(0,255,136,0.3)] text-[var(--cyber-green)] bg-[rgba(0,255,136,0.08)]">
                  SAVED
                </span>
              )}
              {status?.isSetInEnv && !status.isSetInDb && (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-[rgba(0,255,255,0.3)] text-[var(--cyber-cyan)] bg-[rgba(0,255,255,0.08)]">
                  ENV
                </span>
              )}
              {!isActive && (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-[var(--cyber-border)] text-[var(--cyber-text-dim)]">
                  NOT SET
                </span>
              )}
            </div>
            <p className="text-[11px] text-[var(--cyber-text-dim)] mt-0.5">
              {def.description}
            </p>
          </div>
        </div>
        <a
          href={def.docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--cyber-text-dim)] hover:text-[var(--cyber-text)] transition-colors flex-shrink-0"
          title="Get API key"
        >
          <ExternalLink size={13} />
        </a>
      </div>

      {/* Input row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type={showValue ? "text" : "password"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            placeholder={
              status?.isSetInDb ? "Enter new value to update…" : def.placeholder
            }
            className="w-full bg-[var(--cyber-bg)] border border-[var(--cyber-border)] rounded px-3 py-2 text-xs font-mono text-[var(--cyber-text)] placeholder:text-[var(--cyber-text-dim)] focus:outline-none focus:border-[var(--cyber-green)] pr-9 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowValue((v) => !v)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--cyber-text-dim)] hover:text-[var(--cyber-text)]"
          >
            {showValue ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
        </div>

        <CyberButton
          size="sm"
          onClick={handleSave}
          disabled={!value.trim() || saving}
        >
          {saving ? (
            <Loader2 size={13} className="animate-spin" />
          ) : saved ? (
            <CheckCircle2 size={13} className="text-[var(--cyber-green)]" />
          ) : (
            <Save size={13} />
          )}
          <span>{saved ? "SAVED" : "SAVE"}</span>
        </CyberButton>

        {status?.isSetInDb && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono text-[var(--cyber-text-dim)] hover:text-[var(--cyber-red)] hover:bg-[rgba(255,45,85,0.1)] border border-[var(--cyber-border)] hover:border-[rgba(255,45,85,0.3)] transition-all"
            title="Remove saved key"
          >
            {deleting ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Trash2 size={13} />
            )}
          </button>
        )}
      </div>

      {error && <p className="text-[11px] text-[var(--cyber-red)]">{error}</p>}
    </div>
  );
}

function KeysContent() {
  const [statuses, setStatuses] = useState<KeyStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStatuses = useCallback(async () => {
    try {
      const res = await fetch("/api/settings/keys");
      if (res.ok) {
        const data = (await res.json()) as { keys: KeyStatus[] };
        setStatuses(data.keys);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStatuses();
  }, [fetchStatuses]);

  async function handleSave(key: string, value: string) {
    const res = await fetch("/api/settings/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      throw new Error(data.error ?? "Failed to save");
    }
    await fetchStatuses();
  }

  async function handleDelete(key: string) {
    const res = await fetch("/api/settings/keys", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      throw new Error(data.error ?? "Failed to delete");
    }
    await fetchStatuses();
  }

  function getStatus(key: string) {
    return statuses.find((s) => s.key === key);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2
          size={20}
          className="animate-spin text-[var(--cyber-text-dim)]"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Info banner */}
      <div className="flex items-start gap-3 px-4 py-3 rounded border border-[rgba(0,255,136,0.2)] bg-[rgba(0,255,136,0.05)] text-xs font-mono text-[var(--cyber-text-dim)]">
        <CheckCircle2
          size={14}
          className="flex-shrink-0 mt-0.5 text-[var(--cyber-green)]"
        />
        <span>
          Keys are encrypted with XSalsa20-Poly1305 and stored in your personal
          vault. They override{" "}
          <code className="text-[var(--cyber-cyan)]">.env</code> values and are
          used automatically for all AI requests.
        </span>
      </div>

      {/* Cloud providers */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Circle
            size={6}
            className="fill-[var(--cyber-green)] text-[var(--cyber-green)]"
          />
          <h2 className="text-xs font-mono font-bold tracking-widest text-[var(--cyber-text-dim)] uppercase">
            Cloud AI Providers
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {PROVIDERS.map((def) => (
            <ProviderCard
              key={def.key}
              def={def}
              status={getStatus(def.key)}
              onSave={handleSave}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </section>

      {/* Local inference */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Circle
            size={6}
            className="fill-[var(--cyber-cyan)] text-[var(--cyber-cyan)]"
          />
          <h2 className="text-xs font-mono font-bold tracking-widest text-[var(--cyber-text-dim)] uppercase">
            Local Inference (Ollama)
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {LOCAL_SETTINGS.map((def) => (
            <ProviderCard
              key={def.key}
              def={def}
              status={getStatus(def.key)}
              onSave={handleSave}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default function KeysPage() {
  return (
    <AuthGate
      feature="API KEYS"
      color="var(--cyber-green)"
      benefits={[
        "Store API keys encrypted — never in plaintext",
        "Per-user keys override .env for multi-user setups",
        "Keys used automatically by STUDIO, AGENT, and all AI features",
        "Update or rotate keys any time without touching .env",
      ]}
    >
      <KeysContent />
    </AuthGate>
  );
}
