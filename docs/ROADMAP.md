# AURA — Open Source Cyberdeck Command Center

## Self-Hosted · AI-Powered · All-in-One Platform for Creators & Developers

> **Vision**: A single, cyberdeck-aesthetic, self-hosted platform to manage your entire digital operation — YouTube channels, social media, DevOps infrastructure, AI automation, and growth analytics — all from one terminal-inspired command center.

---

## Table of Contents

1. [What is AURA?](#what-is-aura)
2. [Tech Stack](#tech-stack)
3. [MVP Features](#mvp-features)
4. [Project Structure](#project-structure)
5. [CLI Quickstart](#cli-quickstart)
6. [Phase Roadmap](#phase-roadmap)
7. [Self-Hosting on Coolify / Hetzner](#self-hosting-on-coolify--hetzner)
8. [SaaS Monetization Plan](#saas-monetization-plan)
9. [Contributing](#contributing)
10. [License](#license)

---

## What is AURA?

AURA is a **self-hosted, open source, cyberdeck-aesthetic command center** for AI content creators and indie developers. It combines:

- 📺 **Multi-channel YouTube & Shorts management**
- 📅 **Social media scheduling** across all platforms
- 🤖 **AI automation workflows** (n8n-powered)
- 🖥️ **DevOps monitoring** (Coolify, Hetzner, uptime)
- 🧠 **AI Studio** (Claude/GPT script writing, titles, thumbnails)
- 💻 **Built-in web terminal** for SSH access
- 🔐 **Vault** for API key management
- 📊 **Unified analytics dashboard**

**Philosophy**: Own your stack. No vendor lock-in. No per-seat fees. Deploy on your server in minutes.

---

## Tech Stack

```text
┌─────────────────────────────────────────────────────────┐
│                     AURA STACK                          │
├─────────────────────────────────────────────────────────┤
│  Frontend    →  Next.js 15 (App Router) + TypeScript    │
│  Styling     →  Tailwind CSS + shadcn/ui                │
│  Theme       →  Cyberdeck — dark, monospace, grid-based │
│  State       →  Zustand + React Query                   │
│  Backend     →  Next.js API Routes + tRPC               │
│  Database    →  PostgreSQL (via Drizzle ORM)            │
│  Auth        →  Better Auth (self-hostable)             │
│  Automation  →  n8n (embedded via API)                  │
│  Scheduling  →  Postiz (embedded via API)               │
│  AI          →  Claude API + OpenAI (BYOK)              │
│  Terminal    →  xterm.js + node-pty + WebSockets        │
│  Queue       →  BullMQ + Redis                          │
│  Deploy      →  Docker Compose → Coolify                │
│  Payments    →  Stripe (for SaaS cloud tier)            │
│  Docs        →  Mintlify                                │
└─────────────────────────────────────────────────────────┘
```

---

## MVP Features

### Module 1 — CHANNELS (YouTube Management)

- [ ] Connect multiple YouTube channels via OAuth
- [ ] Dashboard showing all channels at a glance (subs, views, revenue)
- [ ] Shorts performance feed (per video: views, retention, CTR)
- [ ] Bulk metadata editor (titles, descriptions, tags)
- [ ] Upload queue with scheduling
- [ ] Channel comparison analytics
- [ ] YouTube quota tracker

### Module 2 — BROADCAST (Social Scheduling)

- [ ] Connect: YouTube, TikTok, Instagram, X, Threads, LinkedIn, Facebook
- [ ] Upload once → publish everywhere
- [ ] Visual content calendar (week/month view)
- [ ] Per-platform caption customization
- [ ] Optimal posting time suggestions (AI-powered)
- [ ] Post status tracking (scheduled → posted → analytics)
- [ ] Postiz API integration under the hood

### Module 3 — FLOW (Automation Workflows)

- [ ] Visual workflow builder (n8n embedded)
- [ ] Pre-built templates:
  - Auto cross-post when YouTube video uploads
  - Notify Telegram on engagement spike
  - Weekly analytics digest email
  - Auto-generate description from transcript
  - Repost top content monthly
- [ ] Webhook management
- [ ] Workflow run history + logs
- [ ] Schedule-based triggers

### Module 4 — OPS (DevOps Monitor)

- [ ] Coolify integration — view/manage deployments
- [ ] Server resource monitor (CPU, RAM, disk — Hetzner)
- [ ] Uptime monitoring for your services (ping check)
- [ ] Container logs viewer
- [ ] One-click service restart
- [ ] Deployment history timeline
- [ ] Alert rules (email/Telegram on downtime)

### Module 5 — STUDIO (AI Assistant)

- [ ] Script writer for Shorts (hook → content → CTA)
- [ ] Title & description generator (with SEO scoring)
- [ ] Thumbnail prompt generator (for Midjourney/FLUX)
- [ ] Hashtag & tag recommender
- [ ] Repurpose long video → Short transcript
- [ ] Bring Your Own Key (BYOK): Claude, OpenAI, Gemini
- [ ] Chat history per project

### Module 6 — TERMINAL (Web SSH)

- [ ] Browser-based terminal (xterm.js)
- [ ] SSH into saved servers
- [ ] Multi-tab terminal sessions
- [ ] Command history
- [ ] Secure credential storage

### Module 7 — VAULT (Secrets Manager)

- [ ] Encrypted API key storage
- [ ] Per-module key assignment
- [ ] Key rotation reminders
- [ ] Environment variable export (for Coolify deployments)

### Module 8 — GRID (Analytics Hub)

- [ ] Unified analytics across all channels + platforms
- [ ] Growth rate tracking (daily/weekly/monthly)
- [ ] Revenue tracking (if monetized)
- [ ] Top performing content leaderboard
- [ ] Engagement heatmap by day/time
- [ ] Export reports (CSV, PDF)

---

## Project Structure

```text
aura/
├── apps/
│   └── web/                        # Next.js frontend
│       ├── app/
│       │   ├── (auth)/             # Login, register
│       │   ├── (dashboard)/        # All modules
│       │   │   ├── channels/       # Module 1
│       │   │   ├── broadcast/      # Module 2
│       │   │   ├── flow/           # Module 3
│       │   │   ├── ops/            # Module 4
│       │   │   ├── studio/         # Module 5
│       │   │   ├── terminal/       # Module 6
│       │   │   ├── vault/          # Module 7
│       │   │   └── grid/           # Module 8
│       │   └── api/                # API routes + tRPC
│       ├── components/
│       │   ├── ui/                 # shadcn/ui components
│       │   ├── cyberdeck/          # Custom cyberdeck theme components
│       │   └── modules/            # Module-specific components
│       └── lib/
│           ├── db/                 # Drizzle ORM schema
│           ├── auth/               # Better Auth config
│           ├── integrations/       # YouTube, Postiz, n8n, Coolify APIs
│           └── ai/                 # Claude/OpenAI wrappers
├── packages/
│   ├── ui/                         # Shared component library
│   ├── db/                         # Shared DB schema + migrations
│   └── config/                     # Shared config (eslint, ts, tailwind)
├── docker/
│   ├── docker-compose.yml          # Full self-host stack
│   ├── docker-compose.dev.yml      # Dev environment
│   └── Dockerfile                  # Production image
├── docs/                           # Mintlify documentation
├── scripts/
│   └── setup.sh                    # CLI setup script
├── .env.example                    # Environment variable template
├── turbo.json                      # Turborepo config
└── package.json                    # Root workspace
```

---

## CLI Quickstart

### Prerequisites

- Node.js 20+
- Docker + Docker Compose
- Git
- VS Code (recommended)

---

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/aura.git
cd aura
```

### 2. Install dependencies

```bash
# Install pnpm globally if you don't have it
npm install -g pnpm

# Install all workspace dependencies
pnpm install
```

### 3. Set up environment variables

```bash
# Copy the example env file
cp .env.example .env

# Open in VS Code and fill in your values
code .env
```

**Required `.env` values for MVP:**

```env
# Database
DATABASE_URL="postgresql://aura:aura@localhost:5432/aura"

# Auth (Better Auth)
BETTER_AUTH_SECRET="your-secret-here-min-32-chars"
BETTER_AUTH_URL="http://localhost:3000"

# Redis
REDIS_URL="redis://localhost:6379"

# YouTube (Google Cloud Console)
YOUTUBE_CLIENT_ID=""
YOUTUBE_CLIENT_SECRET=""

# AI (BYOK — users provide their own, but you need one for default)
ANTHROPIC_API_KEY=""
OPENAI_API_KEY=""

# n8n (self-hosted instance)
N8N_URL="http://localhost:5678"
N8N_API_KEY=""

# Postiz (self-hosted instance)
POSTIZ_URL="http://localhost:3000"
POSTIZ_API_KEY=""

# Coolify (your Hetzner server)
COOLIFY_URL="https://coolify.yourdomain.com"
COOLIFY_API_KEY=""

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### 4. Start the development database

```bash
# Start PostgreSQL + Redis via Docker
docker compose -f docker/docker-compose.dev.yml up -d

# Run database migrations
pnpm db:migrate

# Seed with demo data (optional)
pnpm db:seed
```

### 5. Start the development server

```bash
# Start all apps (Next.js + any background workers)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the AURA dashboard.

---

### VS Code Setup

Install recommended extensions (`.vscode/extensions.json` included):

```bash
# Install all recommended extensions automatically
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension prisma.prisma
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension ms-azuretools.vscode-docker
```

Workspace settings (`.vscode/settings.json`) configure:

- Format on save with Prettier
- Tailwind intellisense
- TypeScript strict mode
- Path aliases (`@/` → `apps/web/`)

---

### Useful Dev Commands

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm lint             # Run ESLint
pnpm typecheck        # Run TypeScript checks
pnpm db:migrate       # Run DB migrations
pnpm db:studio        # Open Drizzle Studio (DB GUI)
pnpm db:seed          # Seed database
pnpm test             # Run tests
pnpm format           # Format with Prettier
```

---

## Phase Roadmap

### Phase 0 — Foundation (Weeks 1–2)

## **Goal: Get something running on your domain**

- [ ] Initialize Turborepo monorepo
- [ ] Set up Next.js 15 with TypeScript
- [ ] Implement cyberdeck theme (dark, monospace, terminal aesthetic)
- [ ] Set up Drizzle ORM + PostgreSQL schema
- [ ] Implement auth (Better Auth — email + OAuth)
- [ ] Basic dashboard shell with module navigation
- [ ] Docker Compose for local dev
- [ ] Deploy skeleton to Coolify

**Milestone**: Login works, empty dashboard loads on your domain.

---

### Phase 1 — Core Modules (Weeks 3–6)

## **Goal: Your daily driver is working**

- [ ] **CHANNELS**: YouTube OAuth, multi-channel dashboard, Shorts analytics
- [ ] **BROADCAST**: Connect socials, Postiz integration, content calendar
- [ ] **OPS**: Coolify API integration, server monitoring, uptime pings
- [ ] **VAULT**: Encrypted key storage (libsodium)

**Milestone**: You can manage all your channels and schedule posts from AURA.

---

### Phase 2 — AI & Automation (Weeks 7–9)

## **Goal: Intelligent automation running 24/7**

- [ ] **STUDIO**: Script writer, title generator, thumbnail prompts (Claude API)
- [ ] **FLOW**: n8n integration, pre-built workflow templates
- [ ] **TERMINAL**: xterm.js SSH terminal
- [ ] BYOK support (user provides own API keys)
- [ ] Telegram notification integration

**Milestone**: Workflows auto-cross-post your Shorts everywhere with zero manual effort.

---

### Phase 3 — Analytics & Polish (Week 10–11)

## **Goal: Insights that drive growth decisions**

- [ ] **GRID**: Unified analytics across all platforms
- [ ] Growth charts, top content leaderboard
- [ ] Export to CSV + PDF reports
- [ ] Mobile responsive layout
- [ ] Dark/light mode toggle
- [ ] Full documentation site (Mintlify)

**Milestone**: Full MVP complete. You use AURA every single day.

---

### Phase 4 — Open Source Launch (Week 12)

## **Goal: Get the community involved**

- [ ] Clean up codebase, add inline comments
- [ ] Write comprehensive README
- [ ] GitHub Actions CI/CD pipeline
- [ ] Coolify one-click deploy template
- [ ] `docker compose up` self-host in under 5 minutes
- [ ] Product Hunt launch
- [ ] Launch post on X/LinkedIn

**Milestone**: Public GitHub repo. First 100 GitHub stars.

---

### Phase 5 — SaaS Layer (Weeks 13–16)

## **Goal: Turn AURA into a revenue-generating product**

- [ ] Multi-tenant workspace system
- [ ] Stripe billing integration
- [ ] Cloud-hosted version (your Hetzner)
- [ ] Landing page with waitlist
- [ ] Onboarding flow for new users
- [ ] Usage limits per tier
- [ ] Admin dashboard

**Milestone**: First paying customer.

---

## Self-Hosting on Coolify / Hetzner

### Full production stack via Docker Compose

```yaml
# docker/docker-compose.yml
version: "3.8"

services:
  aura:
    image: ghcr.io/yourusername/aura:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: aura
      POSTGRES_USER: aura
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis_data:/data

  n8n:
    image: n8nio/n8n:latest
    restart: unless-stopped
    ports:
      - "5678:5678"
    volumes:
      - n8n_data:/home/node/.n8n

  postiz:
    image: ghcr.io/gitroomhq/postiz-app:latest
    restart: unless-stopped
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
  redis_data:
  n8n_data:
```

### Deploy to Coolify

1. In Coolify → **New Resource → Docker Compose**
2. Paste the `docker-compose.yml`
3. Add environment variables in the Coolify UI
4. Assign your domain (e.g. `aura.yourdomain.com`)
5. Enable SSL (Coolify handles it automatically via Traefik)
6. Click **Deploy**

---

## SaaS Monetization Plan

### Pricing Tiers

| Tier | Price | Channels | Workspaces | AI Credits | Self-host |
| --- | --- | --- | --- | --- | --- |
| **Free** | $0 | — | — | — | ✅ Unlimited |
| **Solo** | $19/mo | 5 | 1 | 100/mo | ❌ |
| **Creator** | $49/mo | Unlimited | 3 | 500/mo | ❌ |
| **Agency** | $99/mo | Unlimited | Unlimited | Unlimited | ❌ |

### Revenue Strategy

- **Open source = free marketing** — GitHub stars → organic discovery
- **Self-host free** builds trust and removes barrier to try it
- **Cloud hosted = convenience tax** — users pay for not managing their own server
- **AI credits** are the upsell — cheap to offer, high perceived value
- **Market through your own Shorts** — build in public, show the product working

---

## Contributing

AURA is built in public. All contributions welcome.

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
# Make your changes
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
# Open a Pull Request
```

**Good first issues**: UI components, integration connectors, workflow templates, documentation.

Join the Discord: [discord.gg/aura](https://discord.gg/9NXHqZJpkz) *(set up when you launch)*

---

## License

AGPL-3.0 License — free to use, modify, and distribute under the same license.

```text
Copyright (c) 2026 AURA Contributors

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
```

---

*Built by creators, for creators. Own your stack. Own your growth.*

**GitHub**: [github.com/TheHakan/aura](https://github.com/TheHakan/aura)
**Docs**: [docs.aura.dev](https://docs.aura.dev)
