# AURA — Cyberdeck Command Center

> Self-hosted · Open Source · AI-Powered · All-in-One platform for creators & developers

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](LICENSE)
[![Discord](https://img.shields.io/badge/Discord-Join-7289da)](https://discord.gg/aura)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](docker/docker-compose.yml)

---

AURA is a **single self-hosted platform** that combines YouTube channel management, social media scheduling, DevOps monitoring, AI automation, and an AI agent you talk to — all wrapped in a cyberdeck terminal aesthetic.

## Quick Start (CLI)

```bash
git clone https://github.com/yourusername/aura.git && cd aura
cp .env.example .env && code .env   # fill in your keys
pnpm install
docker compose -f docker/docker-compose.dev.yml up -d
pnpm db:migrate
pnpm dev
```

Open <http://localhost:3000>

## Documentation

| File | Description |
| --- | --- |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design, data flow, module map |
| [FEATURES.md](FEATURES.md) | Full MVP feature spec with acceptance criteria |
| [ROADMAP.md](ROADMAP.md) | Phase-by-phase build plan with milestones |
| [SETUP.md](SETUP.md) | Full CLI setup guide for VS Code on Ubuntu |
| [COOLIFY_DEPLOY.md](COOLIFY_DEPLOY.md) | Deploy to Hetzner via Coolify |
| [AGENT.md](AGENT.md) | AURA AI Agent — how it works, how to talk to it |
| [SAAS.md](SAAS.md) | Monetization plan, multi-tenancy, Stripe |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute |

## Platform Decision

**Ubuntu > Windows** for this project. See [SETUP.md](SETUP.md#ubuntu-vs-windows).

**Web app first, then desktop.** See [ARCHITECTURE.md](ARCHITECTURE.md#web-vs-desktop).

## License

AGPL-3.0 — free to self-host, fork, and build on under the same license.
