"use client";

import { useSession } from "@/lib/auth/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, CheckCircle2, Loader2, X, UserCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// ─── AuthGate ────────────────────────────────────────────────────────────────
// Wraps content that requires a session. Shows benefits + CTA when guest.

interface AuthGateProps {
  children: React.ReactNode;
  /** Short display name shown in the heading, e.g. "VAULT" */
  feature: string;
  /** Accent CSS variable name, e.g. "var(--cyber-purple)" */
  color?: string;
  benefits: string[];
}

export function AuthGate({
  children,
  feature,
  color = "var(--cyber-green)",
  benefits,
}: AuthGateProps) {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2
          size={20}
          className="animate-spin text-[var(--cyber-text-dim)]"
        />
      </div>
    );
  }

  if (!session?.user) {
    const loginHref = `/login?next=${encodeURIComponent(pathname)}`;
    const registerHref = `/register?next=${encodeURIComponent(pathname)}`;

    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 gap-8 max-w-lg mx-auto">
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-full border flex items-center justify-center"
          style={{
            borderColor: `color-mix(in srgb, ${color} 30%, transparent)`,
            background: `color-mix(in srgb, ${color} 6%, transparent)`,
          }}
        >
          <Lock size={32} style={{ color }} className="opacity-70" />
        </div>

        {/* Heading */}
        <div className="text-center space-y-2">
          <p
            className="text-sm font-mono font-bold uppercase tracking-[0.2em]"
            style={{ color }}
          >
            {feature}
          </p>
          <p className="text-base font-mono font-bold text-[var(--cyber-text)]">
            Sign in to use this module
          </p>
          <p className="text-xs text-[var(--cyber-text-dim)] max-w-xs mx-auto">
            This module stores data in your personal workspace. Create a free
            account to get started.
          </p>
        </div>

        {/* Benefits */}
        <div
          className="w-full rounded-lg border p-5 space-y-3"
          style={{
            borderColor: `color-mix(in srgb, ${color} 20%, transparent)`,
          }}
        >
          <p className="text-[10px] font-mono text-[var(--cyber-text-dim)] uppercase tracking-widest mb-1">
            What you get with an account
          </p>
          {benefits.map((b) => (
            <div key={b} className="flex items-start gap-2.5">
              <CheckCircle2
                size={13}
                className="flex-shrink-0 mt-0.5"
                style={{ color }}
              />
              <p className="text-xs font-mono text-[var(--cyber-text)]">{b}</p>
            </div>
          ))}
          <div className="pt-2 border-t border-[var(--cyber-border)] flex items-start gap-2.5">
            <CheckCircle2
              size={13}
              className="flex-shrink-0 mt-0.5 text-[var(--cyber-text-dim)] opacity-50"
            />
            <p className="text-xs font-mono text-[var(--cyber-text-dim)]">
              STUDIO &amp; AGENT work without an account — AI chat is always
              available as a guest
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex gap-3 w-full max-w-xs">
          <Link
            href={registerHref}
            className="flex-1 text-center py-2.5 text-xs font-mono uppercase tracking-wider rounded transition-all shadow-[0_0_15px_rgba(0,255,136,0.2)] hover:shadow-[0_0_20px_rgba(0,255,136,0.4)]"
            style={{
              background: color,
              color: "var(--cyber-bg)",
            }}
          >
            Create Account
          </Link>
          <Link
            href={loginHref}
            className="flex-1 text-center py-2.5 text-xs font-mono uppercase tracking-wider rounded border border-[var(--cyber-border)] text-[var(--cyber-text-dim)] hover:text-[var(--cyber-text)] hover:bg-[var(--cyber-dim)] transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// ─── GuestBanner ─────────────────────────────────────────────────────────────
// Soft, dismissible banner for modules that work in guest mode but benefit
// from being signed in (STUDIO, AGENT, etc.)

interface GuestBannerProps {
  message?: string;
}

export function GuestBanner({
  message = "You're in guest mode — sign in to save session history across devices.",
}: GuestBannerProps) {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);

  if (isPending || session?.user || dismissed) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-[rgba(255,215,0,0.2)] bg-[rgba(255,215,0,0.04)] text-xs font-mono">
      <UserCircle2
        size={14}
        className="text-[var(--cyber-yellow)] flex-shrink-0"
      />
      <p className="flex-1 text-[var(--cyber-text-dim)]">{message}</p>
      <Link
        href={`/login?next=${encodeURIComponent(pathname)}`}
        className="flex-shrink-0 text-[var(--cyber-yellow)] hover:underline underline-offset-2"
      >
        Sign in →
      </Link>
      <button
        onClick={() => setDismissed(true)}
        className="flex-shrink-0 p-0.5 rounded text-[var(--cyber-text-dim)] hover:text-[var(--cyber-text)] transition-colors"
        aria-label="Dismiss"
      >
        <X size={12} />
      </button>
    </div>
  );
}

// ─── SessionBadge ─────────────────────────────────────────────────────────────
// Tiny reusable chip used in the sidebar.

export function SessionBadge() {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();

  if (isPending) {
    return (
      <div className="px-3 py-2 flex items-center gap-2">
        <Loader2
          size={14}
          className="animate-spin text-[var(--cyber-text-dim)]"
        />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <Link
        href={`/login?next=${encodeURIComponent(pathname)}`}
        className="flex items-center gap-2 px-3 py-2 rounded text-xs font-mono border border-[var(--cyber-green)] text-[var(--cyber-green)] hover:bg-[rgba(0,255,136,0.08)] transition-all"
      >
        <UserCircle2 size={14} className="flex-shrink-0" />
        <span className="hidden lg:block">SIGN IN</span>
      </Link>
    );
  }

  const initial = (session.user.name ??
    session.user.email ??
    "?")[0].toUpperCase();
  const label = session.user.name ?? session.user.email ?? "User";

  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <div className="w-5 h-5 rounded-full bg-[rgba(0,255,136,0.15)] border border-[rgba(0,255,136,0.3)] flex items-center justify-center text-[9px] font-mono font-bold text-[var(--cyber-green)] flex-shrink-0">
        {initial}
      </div>
      <span
        className={cn(
          "hidden lg:block text-[10px] font-mono text-[var(--cyber-text-dim)] truncate",
          "max-w-[120px]",
        )}
        title={label}
      >
        {label}
      </span>
    </div>
  );
}
