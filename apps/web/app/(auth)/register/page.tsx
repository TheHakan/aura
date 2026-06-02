"use client";

import { useState } from "react";
import Link from "next/link";
import { signUp } from "@/lib/auth/client";
import { CyberButton } from "@/components/cyberdeck/cyber-button";
import { TerminalWindow } from "@/components/cyberdeck/terminal-window";
import { Zap } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signUp.email({
      name,
      email,
      password,
      callbackURL: "/channels",
    });
    if (result.error) {
      setError(result.error.message ?? "Registration failed");
    }
    setLoading(false);
  }

  return (
    <TerminalWindow title="AUTH — REGISTER">
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 rounded bg-[var(--cyber-green)] flex items-center justify-center mb-3">
          <Zap size={24} className="text-[var(--cyber-bg)]" />
        </div>
        <h1 className="text-lg font-bold tracking-[0.3em] text-[var(--cyber-green)] glow-green">
          AURA
        </h1>
        <p className="text-xs text-[var(--cyber-text-dim)] mt-1">
          Create your operator account
        </p>
      </div>

      <form onSubmit={(e) => void handleRegister(e)} className="space-y-4">
        <div>
          <label className="block text-xs text-[var(--cyber-text-dim)] mb-1 uppercase tracking-widest">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-[var(--cyber-surface-2)] border border-[var(--cyber-border)] rounded px-3 py-2 text-sm font-mono text-[var(--cyber-text)] outline-none focus:border-[var(--cyber-green)] transition-colors"
            placeholder="Your Name"
          />
        </div>
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
            minLength={8}
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
          {loading ? "CREATING ACCOUNT..." : "REGISTER"}
        </CyberButton>
      </form>

      <p className="text-xs text-center text-[var(--cyber-text-dim)] mt-4">
        Already registered?{" "}
        <Link
          href="/login"
          className="text-[var(--cyber-cyan)] hover:underline"
        >
          Login
        </Link>
      </p>
    </TerminalWindow>
  );
}
