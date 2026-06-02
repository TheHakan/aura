#!/usr/bin/env bash
set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}"
echo "  █████╗ ██╗   ██╗██████╗  █████╗ "
echo " ██╔══██╗██║   ██║██╔══██╗██╔══██╗"
echo " ███████║██║   ██║██████╔╝███████║"
echo " ██╔══██║██║   ██║██╔══██╗██╔══██║"
echo " ██║  ██║╚██████╔╝██║  ██║██║  ██║"
echo " ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝"
echo -e "${NC}"
echo -e "${CYAN}Cyberdeck Command Center — Setup Script${NC}"
echo ""

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo -e "${RED}Node.js 20+ required${NC}"; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo -e "${YELLOW}Installing pnpm...${NC}"; npm install -g pnpm; }
command -v docker >/dev/null 2>&1 || echo -e "${YELLOW}Docker not found — skipping DB start${NC}"

# Copy env
if [ ! -f .env ]; then
  cp .env.example .env
  echo -e "${GREEN}✓ Created .env from .env.example${NC}"
  echo -e "${YELLOW}  → Edit .env and fill in your values before running pnpm dev${NC}"
fi

# Install deps
echo -e "${CYAN}Installing dependencies...${NC}"
pnpm install

# Start DB if docker available
if command -v docker >/dev/null 2>&1; then
  echo -e "${CYAN}Starting PostgreSQL + Redis...${NC}"
  docker compose -f docker/docker-compose.dev.yml up -d
  echo -e "${GREEN}✓ Database running on localhost:5432${NC}"
fi

echo ""
echo -e "${GREEN}✓ Setup complete!${NC}"
echo ""
echo -e "  ${CYAN}1.${NC} Edit ${YELLOW}.env${NC} and fill in your API keys"
echo -e "  ${CYAN}2.${NC} Run ${YELLOW}pnpm db:migrate${NC} to run database migrations"
echo -e "  ${CYAN}3.${NC} Run ${YELLOW}pnpm dev${NC} to start the development server"
echo -e "  ${CYAN}4.${NC} Open ${YELLOW}http://localhost:3000${NC}"
echo ""
