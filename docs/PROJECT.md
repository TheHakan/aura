# AURA — Project Context & State

> **Single source of truth for AI assistants, contributors, and future-you.**  
> Last updated: 2026-06-02

---

## What Is AURA?

AURA is a **self-hosted, offline-capable, AI-powered cyberdeck command center** for content creators and indie developers. It runs entirely on your own hardware — no cloud vendor required. Every component is replaceable and ownable.

**Core philosophy**: Own your stack. Local AI first. No per-seat fees. No vendor lock-in. Deploy on your server in minutes with `docker compose up`.

---

## What Has Been Built (Current State)

### ✅ Monorepo Infrastructure

| Item                       | Status        | Notes                                                 |
| -------------------------- | ------------- | ----------------------------------------------------- |
| Turborepo 2.9.x monorepo   | ✅ Working    | `pnpm dev`, `build`, `typecheck`, `lint` all wired    |
| pnpm 10.x workspaces       | ✅ Working    | `apps/*` + `packages/*`                               |
| TypeScript strict (ES2022) | ✅ Passing    | Both `@aura/db` and `@aura/web` typecheck clean       |
| Next.js 16.2.7 + Turbopack | ✅ Running    | Dev server starts in ~740ms                           |
| Tailwind CSS 4             | ✅ Working    | CSS-first config, cyberdeck theme vars in globals.css |
| ESLint + Prettier          | ✅ Configured | Shared config in `packages/config/`                   |

### ✅ Database Layer (`packages/db`)

| Table               | Purpose                                          |
| ------------------- | ------------------------------------------------ |
| `users`             | Auth — email, name, avatar                       |
| `sessions`          | Better Auth session tokens                       |
| `accounts`          | OAuth accounts (Google/YouTube)                  |
| `verifications`     | Email verification tokens                        |
| `workspaces`        | Multi-tenant workspace root                      |
| `workspace_members` | User ↔ workspace with roles (owner/admin/member) |
| `channels`          | YouTube channel connections (OAuth tokens)       |
| `posts`             | Scheduled/published social posts                 |
| `vault_items`       | Encrypted API keys / credentials                 |
| `servers`           | Coolify server connections                       |
| `uptime_checks`     | Ping history for servers                         |
| `agent_sessions`    | AURA chat history per workspace                  |
| `agent_permissions` | Pending/approved destructive-action requests     |

Drizzle ORM + postgres.js. Migrations via `drizzle-kit`. Config: `apps/web/drizzle.config.ts`.

### ✅ Authentication (`lib/auth/`)

- **Better Auth** (self-hostable, no SaaS dependency)
- Email + password sign-up/sign-in
- Google OAuth with YouTube scopes (`youtube.readonly`, `youtube.force-ssl`)
- Drizzle adapter with explicit schema mapping
- Session cookie with 15-minute cache
- API catch-all: `app/api/auth/[...all]/route.ts`
- Client helper: `lib/auth/client.ts` — exports `signIn`, `signOut`, `signUp`, `useSession`

### ✅ AI Layer — Offline-First (`lib/ai/clients.ts`)

**Priority order** (automatic, no config needed for local):

1. **Ollama** (local, fully offline) — if `OLLAMA_BASE_URL` is set, or if no cloud keys exist
2. **Anthropic** (cloud fallback) — if `ANTHROPIC_API_KEY` is set
3. **OpenAI** (cloud fallback) — if `OPENAI_API_KEY` is set

```text
OLLAMA_BASE_URL=http://localhost:11434   ← local Ollama server
OLLAMA_MODEL=llama3.2                   ← default model (any Ollama model works)
```

Both API routes (`/api/studio/generate`, `/api/agent/chat`) use `getModel()` and return a `backend` field in the response so the UI can show which AI is active. Per-request BYOK keys are supported — pass `anthropicKey` / `openaiKey` in the POST body to override.

### ✅ Cyberdeck UI Components (`components/cyberdeck/`)

| Component             | Description                                                                                               |
| --------------------- | --------------------------------------------------------------------------------------------------------- |
| `sidebar.tsx`         | Fixed left nav — 9 modules, icons, active state with colored dot, collapses on mobile                     |
| `status-bar.tsx`      | Top bar — key/value status pairs with color coding (ok=green, warn=yellow, err=red) + live clock          |
| `terminal-window.tsx` | macOS-style terminal card with traffic light buttons, optional title + status dot                         |
| `grid-panel.tsx`      | `GridPanel` (bordered card) + `StatCard` (metric with label/value/change indicator)                       |
| `cyber-button.tsx`    | Variants: `primary` (green), `secondary` (cyan border), `danger` (red border), `ghost`; sizes: `sm/md/lg` |

CSS theme variables (in `app/globals.css`):

```css
--cyber-bg: #0a0a0f /* page background */ --cyber-green: #00ff88
  /* primary accent / success */ --cyber-cyan: #00d4ff
  /* secondary accent / links */ --cyber-purple: #7c3aed /* agent / AI */
  --cyber-yellow: #ffd700 /* warnings */ --cyber-red: #ff4444
  /* errors / danger */ --cyber-border: #1a1a2e /* panel borders */;
```

### ✅ Module Pages

All 9 modules exist as route-group pages under `app/(dashboard)/`:

| Module    | Route        | Status         | What's There Now                                                                                                                                        |
| --------- | ------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CHANNELS  | `/channels`  | 🟡 UI shell    | Stat cards (subs/views/revenue/videos), empty state, "Connect YouTube" button                                                                           |
| BROADCAST | `/broadcast` | 🟡 UI shell    | Stat cards (scheduled/published/platforms/reach), empty state                                                                                           |
| FLOW      | `/flow`      | 🟡 UI shell    | Stat cards (active/runs/success/triggers), empty state                                                                                                  |
| OPS       | `/ops`       | 🟡 UI shell    | Stat cards (servers/uptime/deploys/alerts), empty state                                                                                                 |
| STUDIO    | `/studio`    | 🟢 Functional  | Template buttons (Script, Title, Thumbnail, Hashtags, Repurpose), free-text prompt, calls `/api/studio/generate`, streams result. Ctrl+Enter to submit. |
| TERMINAL  | `/terminal`  | 🔴 Placeholder | "Phase 2" stub — xterm.js SSH not yet implemented                                                                                                       |
| VAULT     | `/vault`     | 🟡 UI shell    | Stat cards (secrets/expiring/platforms/active), empty state, "+ Add Secret" button                                                                      |
| GRID      | `/grid`      | 🟡 UI shell    | Stat cards (total views/followers/posts/revenue), empty state                                                                                           |
| AGENT     | `/agent`     | 🟢 Functional  | Full chat UI — message list, Bot/User avatars, streaming cursor, calls `/api/agent/chat`, Enter to send. Pre-loaded AURA greeting.                      |

### ✅ API Routes

| Route                  | Method | Description                                                                           |
| ---------------------- | ------ | ------------------------------------------------------------------------------------- |
| `/api/auth/[...all]`   | ALL    | Better Auth catch-all handler                                                         |
| `/api/studio/generate` | POST   | AI content generation — `{ prompt, anthropicKey?, openaiKey? }` → `{ text, backend }` |
| `/api/agent/chat`      | POST   | AURA agent — `{ messages, anthropicKey?, openaiKey? }` → `{ text, backend }`          |

### ✅ Vault Crypto (`lib/vault/crypto.ts`)

libsodium `secretbox` (XSalsa20-Poly1305) encryption. `VAULT_ENCRYPTION_KEY` env var (base64, 32 bytes). `encrypt(plaintext)` → `{ ciphertext, nonce }`, `decrypt(ciphertext, nonce)` → plaintext.

### ✅ Docker Stack

**Dev** (`docker/docker-compose.dev.yml`):

- PostgreSQL 16-alpine (port 5432)
- Redis 7-alpine (port 6379)
- **Ollama** (port 11434) — local LLM, pull models after start

**Production** (`docker/docker-compose.yml`):

- All of the above + n8n (port 5678) + Postiz (port 5000/5001)
- Ollama service included, GPU passthrough commented (uncomment to enable)
- AURA app with multi-stage Dockerfile (node:22-alpine)

---

## What Is NOT Yet Built

| Feature                    | Module     | Priority | Notes                                                    |
| -------------------------- | ---------- | -------- | -------------------------------------------------------- |
| YouTube OAuth connect flow | CHANNELS   | P0       | OAuth callback, token storage in `channels` table        |
| Channel analytics display  | CHANNELS   | P0       | Call YouTube Data API v3                                 |
| Social account connections | BROADCAST  | P0       | Postiz API integration                                   |
| Content calendar UI        | BROADCAST  | P1       | Week/month view                                          |
| n8n workflow browser       | FLOW       | P1       | Embed/proxy n8n API                                      |
| Coolify server list        | OPS        | P1       | Coolify REST API                                         |
| Uptime monitor             | OPS        | P1       | Ping scheduler + history chart                           |
| Vault CRUD                 | VAULT      | P0       | Add/view/delete encrypted secrets, per-module assignment |
| xterm.js SSH terminal      | TERMINAL   | P2       | node-pty + WebSocket relay                               |
| Analytics charts           | GRID       | P1       | Recharts or Victory                                      |
| BullMQ job queues          | Background | P1       | Scheduled posting, analytics sync                        |
| tRPC layer                 | API        | P1       | Replace raw fetch with end-to-end typed procedures       |
| Middleware (auth guard)    | All        | P0       | Redirect unauthenticated users from dashboard routes     |
| DB migrations (initial)    | DB         | P0       | Need PostgreSQL running first                            |
| DB seed                    | DB         | P2       | Demo workspace + channels                                |
| Mobile responsive polish   | UI         | P2       | Sidebar currently collapses icons only                   |
| Stripe billing             | SaaS       | P3       | Phase 5                                                  |

---

## Technology Stack

| Layer               | Choice                     | Version         | Why                                         |
| ------------------- | -------------------------- | --------------- | ------------------------------------------- |
| Framework           | Next.js App Router         | 16.2.7          | SSR, file routing, API routes, Turbopack    |
| Language            | TypeScript strict          | 5.9.3           | Full-stack type safety                      |
| Styling             | Tailwind CSS               | 4.x             | CSS-first, cyberdeck vars in globals        |
| State/Data          | (Zustand + TanStack Query) | planned         | Client state + server cache (not yet added) |
| API                 | (tRPC)                     | planned         | End-to-end typed API layer                  |
| ORM                 | Drizzle ORM                | 0.45.2          | SQL-first, lightweight, great DX            |
| Database            | PostgreSQL 16              | -               | Reliable, self-hostable                     |
| Cache/Queue         | (Redis + BullMQ)           | planned         | Background jobs, pub/sub                    |
| Auth                | Better Auth                | 1.6.x           | Self-hostable, multi-provider               |
| **Local AI**        | **Ollama**                 | latest          | **Fully offline, runs on your hardware**    |
| Cloud AI (optional) | Anthropic Claude           | claude-sonnet-4 | BYOK fallback                               |
| Cloud AI (optional) | OpenAI GPT-4o              | gpt-4o          | BYOK fallback                               |
| AI SDK              | Vercel AI SDK              | 4.x             | Unified interface for all AI providers      |
| Social              | Postiz                     | self-hosted     | Multi-platform scheduling                   |
| Automation          | n8n                        | self-hosted     | Visual workflow builder                     |
| Terminal            | (xterm.js + node-pty)      | planned         | Web SSH                                     |
| Encryption          | libsodium-wrappers         | 0.7.x           | Vault secrets (XSalsa20)                    |
| Deploy              | Docker Compose + Coolify   | -               | Self-hosted, 1-click                        |
| Payments            | (Stripe)                   | planned         | Phase 5 SaaS                                |
| Monorepo            | Turborepo + pnpm           | 2.9.x / 10.x    | Fast builds, workspace packages             |

---

## Project Structure

```text
aura/
├── apps/
│   └── web/                          # Next.js app (@aura/web)
│       ├── app/
│       │   ├── (auth)/               # login, register pages
│       │   ├── (dashboard)/          # All 9 module pages + shell layout
│       │   │   ├── layout.tsx        # Sidebar + StatusBar wrapper
│       │   │   ├── channels/page.tsx
│       │   │   ├── broadcast/page.tsx
│       │   │   ├── flow/page.tsx
│       │   │   ├── ops/page.tsx
│       │   │   ├── studio/page.tsx   ← Functional AI UI
│       │   │   ├── terminal/page.tsx ← Stub (Phase 2)
│       │   │   ├── vault/page.tsx
│       │   │   ├── grid/page.tsx
│       │   │   └── agent/page.tsx    ← Functional chat UI
│       │   ├── api/
│       │   │   ├── auth/[...all]/route.ts  ← Better Auth
│       │   │   ├── studio/generate/route.ts
│       │   │   └── agent/chat/route.ts
│       │   ├── layout.tsx            # Root layout (Geist Mono font, metadata)
│       │   ├── page.tsx              # Redirects → /channels
│       │   └── globals.css           # Cyberdeck CSS theme vars + keyframes
│       ├── components/
│       │   └── cyberdeck/            # 5 reusable theme components
│       ├── lib/
│       │   ├── ai/clients.ts         # Ollama-first model selector
│       │   ├── auth/server.ts        # Better Auth server config
│       │   ├── auth/client.ts        # Better Auth browser client
│       │   ├── db/index.ts           # Drizzle db instance
│       │   ├── vault/crypto.ts       # libsodium encrypt/decrypt
│       │   └── utils/index.ts        # cn(), formatNumber(), etc.
│       ├── drizzle.config.ts
│       └── package.json
│
├── packages/
│   ├── db/                           # Shared DB schema (@aura/db)
│   │   └── src/schema/
│   │       ├── auth.ts               # users, sessions, accounts, verifications
│   │       ├── workspaces.ts         # workspaces, workspace_members
│   │       ├── content.ts            # channels, posts
│   │       ├── ops.ts                # vault_items, servers, uptime_checks, agent_*
│   │       └── index.ts
│   └── config/                       # Shared configs (@aura/config)
│       ├── typescript.json
│       ├── tailwind.js
│       └── eslint.js
│
├── docker/
│   ├── docker-compose.yml            # Production: AURA + PG + Redis + Ollama + n8n + Postiz
│   ├── docker-compose.dev.yml        # Dev: PG + Redis + Ollama
│   └── Dockerfile                    # Multi-stage node:22-alpine
│
├── scripts/setup.sh                  # One-command bootstrap
├── .env.example                      # All required env vars (documented)
├── turbo.json
├── pnpm-workspace.yaml
└── docs/
    ├── PROJECT.md                    ← This file
    ├── README.md
    ├── ARCHITECTURE.md
    └── ROADMAP.md
```

---

## Offline / Local-First Setup

AURA is designed to run **100% offline** on local hardware. Here's what that means:

### AI — Local Models via Ollama

Ollama is included in both dev and production Docker stacks. No API key needed.

```bash
# Start local stack (includes Ollama)
docker compose -f docker/docker-compose.dev.yml up -d

# Pull your preferred model (run once)
docker exec <ollama-container> ollama pull llama3.2

# Other good models for AURA:
# ollama pull mistral          — fast, good at instructions
# ollama pull codellama        — better at code tasks
# ollama pull qwen2.5          — strong multilingual
# ollama pull deepseek-r1:8b  — reasoning (good for agent)
# ollama pull llava            — multimodal (future: thumbnail analysis)
```

Set in `.env`:

```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
# Leave ANTHROPIC_API_KEY and OPENAI_API_KEY empty
```

**Auto-detection**: If `OLLAMA_BASE_URL` is set (or both cloud keys are absent), Ollama is used automatically. No code changes needed.

### GPU Acceleration

Edit `docker-compose.dev.yml` or `docker-compose.yml` under the `ollama` service:

```yaml
deploy:
  resources:
    reservations:
      devices:
        - driver: nvidia
          count: all
          capabilities: [gpu]
```

Requires: `nvidia-container-toolkit` installed on host.

### All Services — Self-Hosted

| Service       | What It Does            | Self-Host              |
| ------------- | ----------------------- | ---------------------- |
| PostgreSQL 16 | Database                | Docker (included)      |
| Redis 7       | Cache + queue           | Docker (included)      |
| Ollama        | Local LLM server        | Docker (included)      |
| n8n           | Automation workflows    | Docker (included)      |
| Postiz        | Social media scheduling | Docker (included)      |
| Coolify       | App deployment manager  | Your server (separate) |
| AURA itself   | The app                 | Docker (included)      |

**The only things that require internet**: YouTube OAuth (requires Google Console app), optional Telegram notifications, optional cloud AI keys. Everything else works offline.

---

## Environment Variables Reference

```env
# ── DATABASE ──────────────────────────────────────────────
DATABASE_URL="postgresql://aura:aura@localhost:5432/aura"

# ── AUTH ──────────────────────────────────────────────────
BETTER_AUTH_SECRET="min-32-char-random-string"
BETTER_AUTH_URL="http://localhost:3000"

# ── LOCAL AI (offline-first) ──────────────────────────────
OLLAMA_BASE_URL="http://localhost:11434"   # Set this to use local AI
OLLAMA_MODEL="llama3.2"                   # Any model you've pulled

# ── CLOUD AI (optional BYOK fallback) ─────────────────────
ANTHROPIC_API_KEY=""    # Used only if OLLAMA_BASE_URL is not set
OPENAI_API_KEY=""       # Used only if Anthropic key also missing

# ── REDIS ─────────────────────────────────────────────────
REDIS_URL="redis://localhost:6379"

# ── YOUTUBE / GOOGLE ──────────────────────────────────────
YOUTUBE_CLIENT_ID=""
YOUTUBE_CLIENT_SECRET=""

# ── INTEGRATIONS (all optional for MVP) ───────────────────
N8N_URL="http://localhost:5678"
N8N_API_KEY=""
POSTIZ_URL="http://localhost:3001"
POSTIZ_API_KEY=""
COOLIFY_URL="https://coolify.yourdomain.com"
COOLIFY_API_KEY=""

# ── VAULT ─────────────────────────────────────────────────
VAULT_ENCRYPTION_KEY=""  # openssl rand -base64 32

# ── NOTIFICATIONS (optional) ──────────────────────────────
TELEGRAM_BOT_TOKEN=""
TELEGRAM_CHAT_ID=""

# ── APP ───────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

---

## Development Commands

```bash
pnpm dev              # Start Next.js dev server (Turbopack, ~740ms cold start)
pnpm build            # Production build
pnpm typecheck        # Run tsc --noEmit across all packages
pnpm lint             # ESLint across all packages
pnpm db:migrate       # Run Drizzle migrations (needs DB running)
pnpm db:studio        # Open Drizzle Studio (visual DB GUI)
pnpm db:seed          # Seed database with demo data
pnpm clean            # Remove all .next / dist folders

# Filter to one package:
pnpm --filter=@aura/web dev
pnpm --filter=@aura/db typecheck
```

---

## Quick Start

```bash
git clone https://github.com/TheHakan/aura.git && cd aura

# 1. Install dependencies
pnpm install

# 2. Configure environment
cp .env.example .env
# Edit .env — minimum required: DATABASE_URL, BETTER_AUTH_SECRET

# 3. Start local services (DB + Redis + Ollama)
docker compose -f docker/docker-compose.dev.yml up -d

# 4. Pull a local AI model (run once)
docker exec $(docker ps -qf "name=ollama") ollama pull llama3.2

# 5. Run DB migrations
pnpm db:migrate

# 6. Start app
pnpm dev
# → http://localhost:3000
```

---

## Phase Roadmap

### Phase 0 — Foundation ✅ COMPLETE

- [x] Turborepo monorepo with pnpm workspaces
- [x] Next.js 16.2.7 + TypeScript strict + Tailwind CSS 4
- [x] Cyberdeck theme (CSS vars, components, layout)
- [x] Drizzle ORM + PostgreSQL schema (all tables)
- [x] Better Auth (email + Google OAuth)
- [x] Dashboard shell — all 9 module routes
- [x] AI layer — **Ollama-first, offline capable**
- [x] STUDIO module — functional AI content generation
- [x] AGENT module — functional AI chat interface
- [x] Vault crypto (libsodium)
- [x] Docker Compose (dev + prod, includes Ollama)
- [x] TypeScript compiles clean, dev server runs

### Phase 1 — Core Modules ✅ COMPLETE

- [x] Auth middleware (`middleware.ts`) — protects all dashboard routes
- [x] `lib/db/index.ts` — lazy `getDb()` (no module-level throw)
- [x] `lib/workspace.ts` — auto-create personal workspace per user
- [x] VAULT: full CRUD — add/reveal/delete encrypted secrets, rotation reminders, module assignment
- [x] OPS: servers list + add/delete, uptime monitors + manual ping
- [x] CHANNELS: YouTube channel list from DB + "Connect YouTube" flow
- [x] BROADCAST: Postiz config UI + platform list + dashboard link
- [x] SETTINGS/AI: full AI provider management page — Ollama model catalog + pull, cloud provider cards
- [x] API routes: `/api/vault`, `/api/vault/[id]`, `/api/channels`, `/api/ops/servers`, `/api/ops/uptime`, `/api/ops/uptime/[id]/ping`, `/api/ai/providers`, `/api/ai/ollama/pull`
- [x] Groq support added to `getModel()` (OpenAI-compat at api.groq.com)
- [x] Sidebar: settings link → `/settings/ai`, logout button wired to `signOut()`

### Phase 2 — AI & Automation

- [ ] FLOW: n8n workflow browser (list, trigger, view runs)
- [ ] TERMINAL: xterm.js + node-pty + WebSocket relay
- [ ] STUDIO: chat history, BYOK key input in UI
- [ ] AGENT: tool calls (YouTube, Coolify, Postiz)
- [ ] Telegram notifications for agent decisions
- [ ] BullMQ background jobs (scheduled post publishing)

### Phase 3 — Analytics & Polish

- [ ] GRID: unified analytics charts (Recharts)
- [ ] Mobile responsive layout improvements
- [ ] tRPC layer (replace raw fetch)
- [ ] Full documentation (Mintlify)
- [ ] GitHub Actions CI/CD

### Phase 4 — Open Source Launch

- [ ] Comprehensive README + setup video
- [ ] Coolify one-click deploy template
- [ ] Product Hunt launch
- [ ] Discord community

### Phase 5 — SaaS

- [ ] Multi-tenant workspaces (UI)
- [ ] Stripe billing + usage limits
- [ ] Cloud-hosted instance
- [ ] Landing page + onboarding

---

## Known Issues & Constraints

| Issue                               | Status   | Notes                                                             |
| ----------------------------------- | -------- | ----------------------------------------------------------------- |
| No auth middleware yet              | ✅ Fixed | `middleware.ts` added in Phase 1 — all dashboard routes protected |
| DB migrations not run               | ⚠️       | Need PostgreSQL running first. Run `pnpm db:migrate`              |
| Ollama model not pre-pulled         | ⚠️       | Must `ollama pull llama3.2` after first `docker compose up`       |
| `better-call` peer dep wants zod v4 | ℹ️       | Non-blocking warning — app works fine with zod v3                 |
| TERMINAL is a stub                  | ℹ️       | xterm.js + node-pty planned for Phase 2                           |
| No tRPC yet                         | ℹ️       | API routes use raw fetch/`generateText`. tRPC is planned.         |

---

## Key Decisions & Rationale

**Ollama-first AI**: STUDIO and AGENT work with zero API keys or internet. Pull `llama3.2` once, everything works locally. Cloud keys (Anthropic/OpenAI) are optional BYOK upgrades. Detection is automatic — no code changes needed.

**Better Auth over NextAuth**: Self-hostable, first-class Drizzle adapter, supports all OAuth providers including YouTube scopes. No vendor dependency.

**Drizzle over Prisma**: SQL-first, no binary, works in edge runtimes, fast iteration. Better fit for monorepo shared schema.

**Tailwind CSS 4 (CSS-first)**: No `tailwind.config.js`. All theme values are CSS custom properties in `globals.css`. More portable, easier to override.

**Next.js App Router**: Colocation of UI + API in one `apps/web` package reduces complexity at MVP scale. tRPC will be added when the API surface grows.

**Turborepo**: Critical for the `packages/db` shared schema pattern. DB schema changes automatically cascade to the web app typecheck without manual syncing.

---

## Repository

- **GitHub**: `TheHakan/aura` (branch: `main`)
- **License**: AGPL-3.0
- **Stack**: TypeScript full-stack monorepo

## AI Context Notes

When continuing work on this project:

1. **Read this file first** — it's the ground truth of what exists
2. Key files to check before editing: `apps/web/package.json`, `packages/db/src/schema/`, `apps/web/lib/ai/clients.ts`
3. All paths are relative to `/home/hakan/Documents/Projects/aura/`
4. `pnpm typecheck` must pass before committing (currently passes clean)
5. The AI routing is in `lib/ai/clients.ts` — `getModel()` is the entry point
6. Cyberdeck theme is CSS variables, not Tailwind config — extend in `globals.css`
7. Better Auth schema mapping is explicit in `lib/auth/server.ts` — must match `packages/db/src/schema/auth.ts`
