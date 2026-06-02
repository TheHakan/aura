"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "@/lib/auth/client";
import { CyberButton } from "@/components/cyberdeck/cyber-button";
import { TerminalWindow } from "@/components/cyberdeck/terminal-window";
import { Zap } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn.email({
      email,
      password,
      callbackURL: "/channels",
    });
    if (result.error) {
      setError(result.error.message ?? "Login failed");
    }
    setLoading(false);
  }

  return (
    <TerminalWindow title="AUTH — LOGIN">
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 rounded bg-[var(--cyber-green)] flex items-center justify-center mb-3">
          <Zap size={24} className="text-[var(--cyber-bg)]" />
        </div>
        <h1 className="text-lg font-bold tracking-[0.3em] text-[var(--cyber-green)] glow-green">
          AURA
        </h1>
        <p className="text-xs text-[var(--cyber-text-dim)] mt-1">
          Cyberdeck Command Center
        </p>
      </div>

      <form onSubmit={(e) => void handleLogin(e)} className="space-y-4">
        <div>
          <label className="block text-xs text-[var(--cyber-text-dim)] mb-1 uppercase tracking-widest">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-[var(--cyber-surface-2)] border border-[var(--cyber-border)] rounded px-3 py-2 text-sm font-mono text-[var(--cyber-text)] outline-none focus:border-[var(--cyber-green)] transition-colors"
            placeholder="operator@aura.dev"
          />
        </div>
        <div>
          <label className="block text-xs text-[var(--cyber-text-dim)] mb-1 uppercase tracking-widest">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-[var(--cyber-surface-2)] border border-[var(--cyber-border)] rounded px-3 py-2 text-sm font-mono text-[var(--cyber-text)] outline-none focus:border-[var(--cyber-green)] transition-colors"
          />
        </div>

        {error && (
          <p className="text-xs text-[var(--cyber-red)] font-mono">
            ERR: {error}
          </p>
        )}

        <CyberButton
          type="submit"
          disabled={loading}
          className="w-full justify-center"
        >
          {loading ? "AUTHENTICATING..." : "LOGIN"}
        </CyberButton>
      </form>

      <p className="text-xs text-center text-[var(--cyber-text-dim)] mt-4">
        No account?{" "}
        <Link
          href="/register"
          className="text-[var(--cyber-cyan)] hover:underline"
        >
          Register
        </Link>
      </p>
    </TerminalWindow>
  );
}
