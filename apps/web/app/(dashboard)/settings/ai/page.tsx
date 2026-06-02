"use client";

import { useEffect, useState, useCallback } from "react";
import { TerminalWindow } from "@/components/cyberdeck/terminal-window";
import { CyberButton } from "@/components/cyberdeck/cyber-button";
import {
  Bot,
  Cpu,
  Cloud,
  CheckCircle2,
  Circle,
  Download,
  Loader2,
  ExternalLink,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Ollama model catalog ───────────────────────────────────────────────────
const OLLAMA_CATALOG = [
  {
    name: "llama3.2",
    label: "Llama 3.2 3B",
    provider: "Meta",
    size: "~2 GB",
    desc: "Fast, general-purpose. Best default choice.",
    tags: ["recommended", "fast"],
  },
  {
    name: "llama3.2:1b",
    label: "Llama 3.2 1B",
    provider: "Meta",
    size: "~800 MB",
    desc: "Smallest model. Runs on any hardware.",
    tags: ["fastest", "low-ram"],
  },
  {
    name: "llama3.1:8b",
    label: "Llama 3.1 8B",
    provider: "Meta",
    size: "~5 GB",
    desc: "Balanced quality and speed.",
    tags: [],
  },
  {
    name: "mistral:7b",
    label: "Mistral 7B",
    provider: "Mistral AI",
    size: "~4 GB",
    desc: "Excellent at following instructions.",
    tags: [],
  },
  {
    name: "qwen2.5:7b",
    label: "Qwen 2.5 7B",
    provider: "Alibaba",
    size: "~5 GB",
    desc: "Strong multilingual model.",
    tags: [],
  },
  {
    name: "deepseek-r1:7b",
    label: "DeepSeek R1 7B",
    provider: "DeepSeek",
    size: "~5 GB",
    desc: "Chain-of-thought reasoning model.",
    tags: ["reasoning"],
  },
  {
    name: "phi4:14b",
    label: "Phi-4 14B",
    provider: "Microsoft",
    size: "~9 GB",
    desc: "Compact yet highly capable.",
    tags: [],
  },
  {
    name: "codellama:7b",
    label: "CodeLlama 7B",
    provider: "Meta",
    size: "~4 GB",
    desc: "Specialized for code generation.",
    tags: ["code"],
  },
  {
    name: "llava:7b",
    label: "LLaVA 7B",
    provider: "Community",
    size: "~4 GB",
    desc: "Multimodal — understands images.",
    tags: ["vision"],
  },
  {
    name: "gemma3:4b",
    label: "Gemma 3 4B",
    provider: "Google",
    size: "~3 GB",
    desc: "Compact Google model.",
    tags: [],
  },
] as const;

// ─── Cloud provider catalog ─────────────────────────────────────────────────
const CLOUD_PROVIDERS = [
  {
    id: "anthropic",
    label: "Anthropic",
    color: "text-[var(--cyber-purple)]",
    border: "border-[var(--cyber-purple)]",
    models: ["claude-sonnet-4-20250514", "claude-haiku-3-5"],
    envVar: "ANTHROPIC_API_KEY",
    keyUrl: "https://console.anthropic.com/settings/keys",
    desc: "Best reasoning & writing quality.",
  },
  {
    id: "openai",
    label: "OpenAI",
    color: "text-[var(--cyber-green)]",
    border: "border-[var(--cyber-green)]",
    models: ["gpt-4o", "gpt-4o-mini", "o3"],
    envVar: "OPENAI_API_KEY",
    keyUrl: "https://platform.openai.com/api-keys",
    desc: "GPT-4o and o3 reasoning models.",
  },
  {
    id: "groq",
    label: "Groq",
    color: "text-[var(--cyber-cyan)]",
    border: "border-[var(--cyber-cyan)]",
    models: ["llama-3.3-70b-versatile", "deepseek-r1-distill-llama-70b"],
    envVar: "GROQ_API_KEY",
    keyUrl: "https://console.groq.com/keys",
    desc: "Fastest inference. Free tier available.",
    badge: "fastest",
  },
  {
    id: "google",
    label: "Google Gemini",
    color: "text-[var(--cyber-yellow)]",
    border: "border-[var(--cyber-yellow)]",
    models: ["gemini-2.0-flash", "gemini-1.5-pro"],
    envVar: "GOOGLE_API_KEY",
    keyUrl: "https://aistudio.google.com/apikey",
    desc: "Google's multimodal AI models.",
  },
  {
    id: "mistral",
    label: "Mistral AI",
    color: "text-[var(--cyber-red)]",
    border: "border-[var(--cyber-red)]",
    models: ["mistral-large-latest", "mistral-small-latest"],
    envVar: "MISTRAL_API_KEY",
    keyUrl: "https://console.mistral.ai/api-keys",
    desc: "European AI, strong at code + EU data.",
  },
] as const;

// ─── Types ──────────────────────────────────────────────────────────────────
interface ProvidersData {
  active: string;
  ollama: {
    running: boolean;
    url: string;
    model: string;
    installedModels: Array<{ name: string; size: number; modifiedAt: string }>;
  };
  cloud: Record<string, boolean>;
}

const TAG_STYLES: Record<string, string> = {
  recommended: "bg-[rgba(0,255,136,0.15)] text-[var(--cyber-green)]",
  fastest: "bg-[rgba(0,212,255,0.15)] text-[var(--cyber-cyan)]",
  fast: "bg-[rgba(0,212,255,0.15)] text-[var(--cyber-cyan)]",
  "low-ram": "bg-[rgba(124,58,237,0.15)] text-[var(--cyber-purple)]",
  reasoning: "bg-[rgba(124,58,237,0.15)] text-[var(--cyber-purple)]",
  code: "bg-[rgba(255,215,0,0.15)] text-[var(--cyber-yellow)]",
  vision: "bg-[rgba(255,68,68,0.15)] text-[var(--cyber-red)]",
};

export default function AIProvidersPage() {
  const [data, setData] = useState<ProvidersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [pulling, setPulling] = useState<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/ai/providers");
    if (res.ok) setData(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Poll when a pull is in-progress
  useEffect(() => {
    if (pulling.size === 0) return;
    const id = setInterval(async () => {
      const res = await fetch("/api/ai/providers");
      if (!res.ok) return;
      const next: ProvidersData = await res.json();
      setData(next);
      // Check if any pulling model now appears in installed list
      const installedNames = new Set(
        next.ollama.installedModels.map((m) => m.name.split(":")[0]),
      );
      setPulling((prev) => {
        const updated = new Set(prev);
        for (const m of prev) {
          if (installedNames.has(m.split(":")[0])) updated.delete(m);
        }
        return updated;
      });
    }, 5_000);
    return () => clearInterval(id);
  }, [pulling]);

  async function pullModel(model: string) {
    setPulling((prev) => new Set(prev).add(model));
    await fetch("/api/ai/ollama/pull", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model }),
    });
  }

  const installedNames = new Set(
    data?.ollama.installedModels.map((m) => m.name.split(":")[0]) ?? [],
  );

  function isInstalled(modelName: string) {
    const base = modelName.split(":")[0];
    return (
      installedNames.has(modelName) ||
      installedNames.has(base) ||
      data?.ollama.installedModels.some((m) => m.name.startsWith(base)) === true
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-widest text-[var(--cyber-green)] uppercase">
            ▸ AI PROVIDERS
          </h1>
          <p className="text-xs text-[var(--cyber-text-dim)] mt-1">
            Manage local and cloud AI models for STUDIO and AGENT
          </p>
        </div>
        <div className="flex items-center gap-3">
          {data && (
            <span className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded border border-[var(--cyber-green)] text-[var(--cyber-green)] bg-[rgba(0,255,136,0.08)]">
              <Bot size={12} />
              ACTIVE: {data.active}
            </span>
          )}
          <button
            onClick={refresh}
            className="p-1.5 rounded text-[var(--cyber-text-dim)] hover:text-[var(--cyber-text)] hover:bg-[var(--cyber-dim)] transition-all"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* ── LOCAL AI — OLLAMA ─────────────────────────────────────────────── */}
      <TerminalWindow
        title="LOCAL AI — OLLAMA"
        statusDot={
          loading ? "offline" : data?.ollama.running ? "online" : "offline"
        }
      >
        <div className="space-y-6 p-1">
          {/* Status */}
          <div className="flex items-center gap-3">
            <Cpu size={16} className="text-[var(--cyber-green)]" />
            <span className="text-xs font-mono text-[var(--cyber-text-dim)]">
              {data?.ollama.url ?? "http://localhost:11434"}
            </span>
            <span
              className={cn(
                "ml-auto text-xs font-mono px-2 py-0.5 rounded",
                data?.ollama.running
                  ? "text-[var(--cyber-green)] bg-[rgba(0,255,136,0.1)]"
                  : "text-[var(--cyber-red)] bg-[rgba(255,68,68,0.1)]",
              )}
            >
              {loading
                ? "CHECKING..."
                : data?.ollama.running
                  ? "● RUNNING"
                  : "○ NOT RUNNING"}
            </span>
          </div>

          {!data?.ollama.running && !loading && (
            <div className="rounded border border-[rgba(255,215,0,0.3)] bg-[rgba(255,215,0,0.05)] px-4 py-3 text-xs font-mono text-[var(--cyber-yellow)] space-y-1">
              <p className="font-bold">Ollama is not running</p>
              <p className="opacity-70">Start it with:</p>
              <p className="font-mono bg-[var(--cyber-dim)] px-2 py-1 rounded text-[var(--cyber-text)]">
                docker compose -f docker/docker-compose.dev.yml up -d
              </p>
              <p className="opacity-70">Then pull a model:</p>
              <p className="font-mono bg-[var(--cyber-dim)] px-2 py-1 rounded text-[var(--cyber-text)]">
                docker exec &lt;ollama-container&gt; ollama pull llama3.2
              </p>
            </div>
          )}

          {/* Installed models */}
          {(data?.ollama.installedModels.length ?? 0) > 0 && (
            <div>
              <p className="text-xs font-mono text-[var(--cyber-text-dim)] mb-2 uppercase tracking-wider">
                Installed ({data!.ollama.installedModels.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {data!.ollama.installedModels.map((m) => (
                  <span
                    key={m.name}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono bg-[rgba(0,255,136,0.1)] text-[var(--cyber-green)] border border-[rgba(0,255,136,0.2)]"
                  >
                    <CheckCircle2 size={10} />
                    {m.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Model catalog */}
          <div>
            <p className="text-xs font-mono text-[var(--cyber-text-dim)] mb-3 uppercase tracking-wider">
              Available Models — click Pull to download
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {OLLAMA_CATALOG.map((model) => {
                const installed = isInstalled(model.name);
                const isPulling = pulling.has(model.name);
                return (
                  <div
                    key={model.name}
                    className={cn(
                      "rounded border p-3 space-y-2 transition-all",
                      installed
                        ? "border-[rgba(0,255,136,0.3)] bg-[rgba(0,255,136,0.04)]"
                        : "border-[var(--cyber-border)] bg-[var(--cyber-surface-2)] hover:border-[rgba(255,255,255,0.15)]",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-mono font-bold text-[var(--cyber-text)]">
                          {model.label}
                        </p>
                        <p className="text-[10px] text-[var(--cyber-text-dim)] font-mono">
                          {model.provider} · {model.size}
                        </p>
                      </div>
                      {installed && (
                        <CheckCircle2
                          size={14}
                          className="text-[var(--cyber-green)] flex-shrink-0 mt-0.5"
                        />
                      )}
                    </div>
                    <p className="text-[10px] text-[var(--cyber-text-dim)]">
                      {model.desc}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex gap-1 flex-wrap">
                        {model.tags.map((tag) => (
                          <span
                            key={tag}
                            className={cn(
                              "text-[9px] font-mono px-1.5 py-0.5 rounded uppercase",
                              TAG_STYLES[tag] ??
                                "bg-[var(--cyber-dim)] text-[var(--cyber-text-dim)]",
                            )}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      {!installed && (
                        <button
                          onClick={() => pullModel(model.name)}
                          disabled={isPulling || !data?.ollama.running}
                          className={cn(
                            "flex items-center gap-1 px-2 py-1 text-[10px] font-mono rounded border transition-all flex-shrink-0",
                            isPulling
                              ? "border-[var(--cyber-border)] text-[var(--cyber-text-dim)] cursor-wait"
                              : "border-[var(--cyber-cyan)] text-[var(--cyber-cyan)] hover:bg-[rgba(0,212,255,0.1)] disabled:opacity-40 disabled:cursor-not-allowed",
                          )}
                        >
                          {isPulling ? (
                            <Loader2 size={10} className="animate-spin" />
                          ) : (
                            <Download size={10} />
                          )}
                          {isPulling ? "Pulling..." : "Pull"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </TerminalWindow>

      {/* ── CLOUD AI ─────────────────────────────────────────────────────── */}
      <TerminalWindow title="CLOUD AI — BRING YOUR OWN KEY">
        <div className="space-y-4 p-1">
          <p className="text-xs text-[var(--cyber-text-dim)] font-mono">
            Cloud keys are used only when{" "}
            <code className="text-[var(--cyber-yellow)]">OLLAMA_BASE_URL</code>{" "}
            is not set. Set env vars in{" "}
            <code className="text-[var(--cyber-cyan)]">.env</code> and restart
            the dev server.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CLOUD_PROVIDERS.map((p) => {
              const configured = data?.cloud[p.id] ?? false;
              return (
                <div
                  key={p.id}
                  className={cn(
                    "rounded border p-4 space-y-3 transition-all",
                    configured
                      ? `${p.border} bg-[rgba(255,255,255,0.02)]`
                      : "border-[var(--cyber-border)] hover:border-[rgba(255,255,255,0.15)]",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cloud size={14} className={p.color} />
                      <span
                        className={cn("text-xs font-mono font-bold", p.color)}
                      >
                        {p.label}
                      </span>
                    </div>
                    {configured ? (
                      <CheckCircle2
                        size={14}
                        className="text-[var(--cyber-green)]"
                      />
                    ) : (
                      <Circle
                        size={14}
                        className="text-[var(--cyber-text-dim)] opacity-30"
                      />
                    )}
                  </div>

                  {"badge" in p && p.badge && (
                    <span className="inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-[rgba(0,212,255,0.15)] text-[var(--cyber-cyan)] uppercase">
                      {p.badge}
                    </span>
                  )}

                  <p className="text-[10px] text-[var(--cyber-text-dim)]">
                    {p.desc}
                  </p>

                  <div className="space-y-1">
                    {p.models.map((m) => (
                      <p
                        key={m}
                        className="text-[10px] font-mono text-[var(--cyber-text-dim)] opacity-70"
                      >
                        · {m}
                      </p>
                    ))}
                  </div>

                  <div className="pt-1 space-y-2">
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded border border-[var(--cyber-border)] bg-[var(--cyber-dim)]">
                      <code className="text-[10px] font-mono text-[var(--cyber-yellow)] flex-1 truncate">
                        {p.envVar}
                      </code>
                      <span
                        className={cn(
                          "text-[9px] font-mono",
                          configured
                            ? "text-[var(--cyber-green)]"
                            : "text-[var(--cyber-text-dim)] opacity-50",
                        )}
                      >
                        {configured ? "SET ✓" : "NOT SET"}
                      </span>
                    </div>
                    <a
                      href={p.keyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] font-mono text-[var(--cyber-text-dim)] hover:text-[var(--cyber-cyan)] transition-colors"
                    >
                      <ExternalLink size={10} />
                      Get API key →
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </TerminalWindow>

      {/* Priority explanation */}
      <div className="rounded border border-[var(--cyber-border)] px-4 py-3 text-xs font-mono text-[var(--cyber-text-dim)] space-y-1">
        <p className="text-[var(--cyber-text)] font-bold uppercase tracking-wider text-[10px] mb-2">
          Provider Priority
        </p>
        <p>
          1. <span className="text-[var(--cyber-green)]">Ollama (local)</span> —
          if <code className="text-[var(--cyber-yellow)]">OLLAMA_BASE_URL</code>{" "}
          is set, or no cloud keys exist
        </p>
        <p>
          2. <span className="text-[var(--cyber-purple)]">Anthropic</span> — if{" "}
          <code className="text-[var(--cyber-yellow)]">ANTHROPIC_API_KEY</code>{" "}
          is set
        </p>
        <p>
          3. <span className="text-[var(--cyber-green)]">OpenAI</span> — if{" "}
          <code className="text-[var(--cyber-yellow)]">OPENAI_API_KEY</code> is
          set
        </p>
        <p>
          4. <span className="text-[var(--cyber-cyan)]">Groq</span> — if{" "}
          <code className="text-[var(--cyber-yellow)]">GROQ_API_KEY</code> is
          set
        </p>
      </div>
    </div>
  );
}
