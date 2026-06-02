"use client";

import { useState } from "react";
import { TerminalWindow } from "@/components/cyberdeck/terminal-window";
import { CyberButton } from "@/components/cyberdeck/cyber-button";
import { Sparkles, Send } from "lucide-react";

const TEMPLATES = [
  {
    label: "Script Writer",
    prompt: "Write a 60-second YouTube Short script about: ",
  },
  {
    label: "Title Generator",
    prompt: "Generate 10 viral YouTube titles for a video about: ",
  },
  {
    label: "Thumbnail Prompt",
    prompt: "Create a Midjourney prompt for a YouTube thumbnail about: ",
  },
  {
    label: "Hashtags",
    prompt: "Generate 30 relevant hashtags for a post about: ",
  },
  {
    label: "Repurpose",
    prompt: "Repurpose this long-form transcript into a Short script:\n\n",
  },
];

export default function StudioPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!input.trim()) return;
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/studio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = (await res.json()) as { text?: string; error?: string };
      setOutput(data.text ?? data.error ?? "No response");
    } catch {
      setOutput("Error: Failed to connect to AI service.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-widest text-[var(--cyber-green)] uppercase">
          ▸ STUDIO
        </h1>
        <p className="text-xs text-[var(--cyber-text-dim)] mt-1">
          AI content creation — scripts, titles, thumbnails
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TEMPLATES.map((t) => (
          <CyberButton
            key={t.label}
            variant="secondary"
            size="sm"
            onClick={() => setInput(t.prompt)}
          >
            {t.label}
          </CyberButton>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <TerminalWindow title="INPUT">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your prompt or pick a template above..."
            className="w-full h-48 bg-transparent text-sm text-[var(--cyber-text)] placeholder-[var(--cyber-text-dim)] resize-none outline-none font-mono"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey))
                void generate();
            }}
          />
          <div className="flex justify-end mt-3">
            <CyberButton onClick={() => void generate()} disabled={loading}>
              {loading ? (
                "GENERATING..."
              ) : (
                <span className="flex items-center gap-2">
                  <Send size={14} /> GENERATE
                </span>
              )}
            </CyberButton>
          </div>
        </TerminalWindow>

        <TerminalWindow
          title="OUTPUT"
          statusDot={output ? "online" : "pending"}
        >
          {output ? (
            <pre className="text-sm text-[var(--cyber-text)] whitespace-pre-wrap font-mono leading-relaxed h-48 overflow-y-auto">
              {output}
            </pre>
          ) : (
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <Sparkles
                  size={32}
                  className="text-[var(--cyber-green)] opacity-30 mx-auto mb-2"
                />
                <p className="text-xs text-[var(--cyber-text-dim)]">
                  Output will appear here
                </p>
              </div>
            </div>
          )}
        </TerminalWindow>
      </div>
    </div>
  );
}
