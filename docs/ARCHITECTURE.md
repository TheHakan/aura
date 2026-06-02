# AURA — Architecture

## Web App vs Desktop App

**Build web app first.** Reasons:

- Deploy once on Coolify, access from any device (phone, tablet, laptop)
- Your AI agent is reachable from anywhere — phone browser, phone app later
- Easier to share with beta users / SaaS customers
- Desktop app (Tauri/Electron) can wrap it later with zero code rewrite
- n8n, Postiz, and all integrations are web-native anyway

**Desktop app later (Phase 5+):** Use Tauri (Rust-based, tiny binary) to wrap the Next.js frontend for an offline-capable desktop experience. Not the MVP.

---

## Ubuntu vs Windows

**Use Ubuntu (22.04 LTS or 24.04 LTS).** Reasons:

- Docker runs natively — no WSL2 overhead or networking quirks
- Node.js, pnpm, PostgreSQL tooling all work without compatibility shims
- Your Hetzner/Coolify server is Ubuntu — same environment locally
- SSH, bash scripts, cron jobs all work the same in dev and prod
- VS Code on Ubuntu is identical in experience to Windows

**Windows:** Use only if you have no choice. If you must, use WSL2 (Ubuntu distro) and develop entirely inside WSL2. Do not develop on native Windows paths.

---

## System Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                        AURA PLATFORM                            │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Next.js    │  │  tRPC API    │  │   Background Workers │  │
│  │  (Frontend)  │◄─┤  (Backend)   │◄─┤   BullMQ + Redis     │  │
│  │  Port 3000   │  │  API Routes  │  │   (scheduled jobs)   │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────────┘  │
│         │                 │                                     │
│  ┌──────▼─────────────────▼──────────────────────────────────┐  │
│  │                   PostgreSQL (Drizzle ORM)                 │  │
│  │        users · workspaces · channels · posts · logs       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  n8n         │  │  Postiz      │  │  AURA AI Agent       │  │
│  │  (workflows) │  │  (social)    │  │  (Claude API)        │  │
│  │  Port 5678   │  │  Port 3001   │  │  WebSocket + HTTP    │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  xterm.js    │  │  Coolify API │  │  Vault (libsodium)   │  │
│  │  Web SSH     │  │  DevOps      │  │  Encrypted secrets   │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
         │                   │                    │
         ▼                   ▼                    ▼
   YouTube API         TikTok API          Hetzner Server
   Google OAuth        Instagram API       Coolify Instance
   Analytics API       X (Twitter) API     Telegram Bot
```

---

## Module Map

| Module | Route | Description |
| --- | --- | --- |
| CHANNELS | `/channels` | YouTube multi-channel management |
| BROADCAST | `/broadcast` | Social scheduling via Postiz |
| FLOW | `/flow` | Automation workflows via n8n |
| OPS | `/ops` | DevOps / Coolify / server monitoring |
| STUDIO | `/studio` | AI content creation (Claude API) |
| TERMINAL | `/terminal` | Web SSH (xterm.js) |
| VAULT | `/vault` | Encrypted API key storage |
| GRID | `/grid` | Unified analytics dashboard |
| AGENT | `/agent` | AURA AI chat agent |

---

## Data Flow — Publishing a Short

```text
User uploads video
       │
       ▼
AURA BROADCAST module
       │
       ├──► Postiz API ──► YouTube Shorts
       │                ──► TikTok
       │                ──► Instagram Reels
       │                ──► X (Twitter)
       │                ──► Threads
       │
       ▼
BullMQ job created (scheduled publish time)
       │
       ▼
n8n webhook fires on success
       │
       ├──► Telegram notification to phone
       ├──► Analytics recorded to PostgreSQL
       └──► AURA Agent notifies you in chat
```

---

## Data Flow — AURA Agent Decision

```text
User sends message in /agent
       │
       ▼
Claude API (claude-sonnet-4-20250514)
System prompt: AURA context + current workspace state
       │
       ├── Needs YouTube data?    ──► YouTube API tool call
       ├── Needs to post?         ──► Postiz API tool call
       ├── Needs server info?     ──► Coolify API tool call
       ├── Needs to run workflow? ──► n8n API tool call
       └── Needs permission?      ──► Push notification to phone
                                      (Telegram / PWA push)
                                      User approves/denies
                                      Agent proceeds or stops
```

---

## Database Schema (Drizzle ORM)

```typescript
// Core tables
users              // auth, profile, BYOK API keys
workspaces         // multi-tenant isolation
workspace_members  // user ↔ workspace roles

// Content
channels           // YouTube channel connections
posts              // scheduled/published posts
post_platforms     // per-platform status of each post

// Automation
workflows          // n8n workflow references
workflow_runs      // execution history + logs

// Infrastructure
servers            // Coolify server connections
services           // Coolify service references
uptime_checks      // ping history

// Agent
agent_sessions     // chat history per workspace
agent_permissions  // pending/approved permission requests

// Vault
vault_items        // encrypted API keys + credentials
```

---

## Tech Stack

| Layer | Technology | Why |
| --- | --- | --- |
| Frontend | Next.js 15 (App Router) | SSR, file-based routing, API routes |
| Language | TypeScript (strict) | Type safety across full stack |
| Styling | Tailwind CSS + shadcn/ui | Fast, consistent, customizable |
| State | Zustand + TanStack Query | Client state + server cache |
| API | tRPC | End-to-end type-safe API |
| ORM | Drizzle ORM | Lightweight, SQL-first, great DX |
| Database | PostgreSQL 16 | Reliable, self-hostable |
| Cache/Queue | Redis + BullMQ | Background jobs, pub/sub |
| Auth | Better Auth | Self-hostable, multi-provider |
| AI | Claude API (Anthropic) | Agent, Studio, automations |
| Social | Postiz API | Multi-platform scheduling |
| Automation | n8n | Visual workflow builder |
| Terminal | xterm.js + node-pty | Web SSH terminal |
| Encryption | libsodium-wrappers | Vault secrets |
| Deploy | Docker Compose + Coolify | Self-hosted, 1-click |
| Payments | Stripe | SaaS subscriptions |
| Monorepo | Turborepo + pnpm | Fast builds, shared packages |

---

## Project Structure

```text
aura/
├── apps/
│   └── web/                          # Next.js app
│       ├── app/
│       │   ├── (auth)/               # /login /register /verify
│       │   ├── (dashboard)/          # All modules (layout.tsx wraps all)
│       │   │   ├── layout.tsx        # Sidebar + top nav
│       │   │   ├── page.tsx          # Dashboard home /
│       │   │   ├── channels/         # Module: CHANNELS
│       │   │   ├── broadcast/        # Module: BROADCAST
│       │   │   ├── flow/             # Module: FLOW
│       │   │   ├── ops/              # Module: OPS
│       │   │   ├── studio/           # Module: STUDIO
│       │   │   ├── terminal/         # Module: TERMINAL
│       │   │   ├── vault/            # Module: VAULT
│       │   │   ├── grid/             # Module: GRID
│       │   │   └── agent/            # Module: AGENT
│       │   └── api/
│       │       ├── trpc/             # tRPC handler
│       │       ├── auth/             # Better Auth handler
│       │       └── webhooks/         # n8n, Postiz, YouTube webhooks
│       ├── components/
│       │   ├── ui/                   # shadcn/ui base components
│       │   ├── cyberdeck/            # Cyberdeck theme components
│       │   │   ├── terminal-window.tsx
│       │   │   ├── status-bar.tsx
│       │   │   ├── grid-panel.tsx
│       │   │   └── scan-line.tsx
│       │   └── modules/              # Module-specific components
│       ├── lib/
│       │   ├── db/                   # Drizzle schema + migrations
│       │   ├── auth/                 # Better Auth config
│       │   ├── trpc/                 # tRPC router + procedures
│       │   ├── integrations/
│       │   │   ├── youtube.ts
│       │   │   ├── postiz.ts
│       │   │   ├── n8n.ts
│       │   │   ├── coolify.ts
│       │   │   └── claude.ts
│       │   ├── agent/                # AURA AI agent
│       │   │   ├── index.ts          # Agent orchestrator
│       │   │   ├── tools.ts          # Tool definitions
│       │   │   ├── permissions.ts    # Phone approval flow
│       │   │   └── system-prompt.ts  # Agent system prompt
│       │   ├── vault/                # Encryption utils
│       │   └── queue/                # BullMQ job definitions
│       └── styles/
│           ├── globals.css           # Cyberdeck CSS variables
│           └── cyberdeck.css         # Theme-specific styles
├── packages/
│   ├── ui/                           # Shared component library
│   ├── db/                           # Shared schema (for future services)
│   └── config/                       # Shared eslint, tsconfig, tailwind
├── docker/
│   ├── docker-compose.yml            # Production stack
│   ├── docker-compose.dev.yml        # Dev stack (DB + Redis only)
│   └── Dockerfile                    # Production image
├── docs/                             # Mintlify docs
├── scripts/
│   └── setup.sh                      # One-command dev setup
├── .env.example
├── .vscode/
│   ├── settings.json
│   ├── extensions.json
│   └── launch.json
├── turbo.json
└── package.json
```

---

## Security Model

- All secrets stored encrypted (libsodium) in Vault module
- API keys never exposed in frontend — server-side only
- Better Auth handles sessions with httpOnly cookies
- Multi-tenant: workspace isolation at DB query level (row-level filtering)
- Agent permission system: destructive actions require phone approval
- SSH private keys for Terminal stored encrypted per user
- Stripe webhooks validated by signature
