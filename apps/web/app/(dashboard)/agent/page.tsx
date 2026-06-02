"use client";

import { useState, useRef, useEffect } from "react";
import { TerminalWindow } from "@/components/cyberdeck/terminal-window";
import { CyberButton } from "@/components/cyberdeck/cyber-button";
import { Send, Bot, User } from "lucide-react";
import { GuestBanner } from "@/components/cyberdeck/auth-gate";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AgentPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "AURA AGENT ONLINE.\n\nI'm your AI command center. I can help you manage YouTube channels, schedule posts, monitor your servers, generate content, and more.\n\nWhat would you like to do?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: text },
    ];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = (await res.json()) as { text?: string; error?: string };
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: data.text ?? data.error ?? "No response",
        },
      ]);
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "ERROR: Failed to connect to agent." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 h-[calc(100vh-8rem)] flex flex-col">
      <GuestBanner message="You're in guest mode — sign in to save agent sessions and tool permissions." />
      <div>
        <h1 className="text-xl font-bold tracking-widest text-[var(--cyber-green)] uppercase">
          ▸ AGENT
        </h1>
        <p className="text-xs text-[var(--cyber-text-dim)] mt-1">
          AURA AI — your command center assistant
        </p>
      </div>

      <TerminalWindow
        title="AURA AGENT v1.0"
        statusDot="online"
        className="flex-1 flex flex-col"
      >
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-0 max-h-[calc(100vh-20rem)]">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-7 h-7 rounded flex items-center justify-center flex-shrink-0 ${
                  msg.role === "assistant"
                    ? "bg-[rgba(0,255,136,0.15)] text-[var(--cyber-green)]"
                    : "bg-[rgba(0,212,255,0.15)] text-[var(--cyber-cyan)]"
                }`}
              >
                {msg.role === "assistant" ? (
                  <Bot size={14} />
                ) : (
                  <User size={14} />
                )}
              </div>
              <div
                className={`max-w-[80%] px-3 py-2 rounded text-sm font-mono leading-relaxed whitespace-pre-wrap ${
                  msg.role === "assistant"
                    ? "bg-[var(--cyber-surface-2)] text-[var(--cyber-text)]"
                    : "bg-[rgba(0,212,255,0.08)] text-[var(--cyber-text)] border border-[rgba(0,212,255,0.2)]"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded bg-[rgba(0,255,136,0.15)] text-[var(--cyber-green)] flex items-center justify-center">
                <Bot size={14} />
              </div>
              <div className="px-3 py-2 rounded bg-[var(--cyber-surface-2)] text-[var(--cyber-green)]">
                <span className="cursor-blink" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="flex gap-3 border-t border-[var(--cyber-border)] pt-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            placeholder="Send a command to AURA..."
            className="flex-1 bg-[var(--cyber-surface-2)] border border-[var(--cyber-border)] rounded px-3 py-2 text-sm font-mono text-[var(--cyber-text)] placeholder-[var(--cyber-text-dim)] outline-none focus:border-[var(--cyber-green)] transition-colors"
            disabled={loading}
          />
          <CyberButton
            onClick={() => void send()}
            disabled={loading || !input.trim()}
          >
            <Send size={14} />
          </CyberButton>
        </div>
      </TerminalWindow>
    </div>
  );
}
