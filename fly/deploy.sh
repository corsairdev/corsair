#!/usr/bin/env bash
set -euo pipefail

# Deploy Corsair to Fly.io. Run from the fly/ directory.

GREEN="\033[0;32m" CYAN="\033[0;36m" BOLD="\033[1m" RESET="\033[0m"
info()    { echo -e "${CYAN}→ $*${RESET}"; }
success() { echo -e "${GREEN}✓ $*${RESET}"; }
header()  { echo -e "\n${BOLD}$*${RESET}"; }

if ! command -v fly &>/dev/null; then echo "Install fly CLI: https://fly.io/docs/hands-on/install-flyctl/"; exit 1; fi
if ! fly auth whoami &>/dev/null; then echo "Run: fly auth login"; exit 1; fi

header "App name"
read -rp "Fly app name [corsair]: " APP_NAME; APP_NAME="${APP_NAME:-corsair}"
read -rp "Postgres cluster [corsair-db]: " DB_NAME; DB_NAME="${DB_NAME:-corsair-db}"
read -rp "Region [iad]: " REGION; REGION="${REGION:-iad}"

PUBLIC_URL="https://${APP_NAME}.fly.dev"
sed -i.bak "s|^app = .*|app = \"${APP_NAME}\"|"             fly.toml && rm -f fly.toml.bak
sed -i.bak "s|^primary_region = .*|primary_region = \"${REGION}\"|" fly.toml && rm -f fly.toml.bak
success "URL will be: ${PUBLIC_URL}"

header "Generating secrets"
SESSION_SECRET=$(openssl rand -hex 32)
CONTROL_API_KEY=$(openssl rand -hex 32)
CORSAIR_KEK=$(openssl rand -base64 32)
success "SESSION_SECRET, CONTROL_API_KEY, CORSAIR_KEK generated"

header "Dashboard password"
read -rsp "  APP_PASSWORD: " APP_PASSWORD; echo ""

header "Database"
if ! fly postgres list 2>/dev/null | grep -q "$DB_NAME"; then
  info "Creating Fly Postgres..."
  fly postgres create --name "$DB_NAME" --region "$REGION" \
    --initial-cluster-size 1 --vm-size shared-cpu-1x --volume-size 10
fi

header "Creating app"
fly apps create "$APP_NAME" --org personal 2>/dev/null || true

info "Attaching Postgres..."
fly postgres attach "$DB_NAME" -a "$APP_NAME" 2>/dev/null || true

info "Creating workspace volume..."
fly volumes create corsair_workspace -a "$APP_NAME" --region "$REGION" --size 10 2>/dev/null || true

header "Setting secrets"
fly secrets set -a "$APP_NAME" \
  PUBLIC_URL="$PUBLIC_URL" \
  APP_PASSWORD="$APP_PASSWORD" \
  SESSION_SECRET="$SESSION_SECRET" \
  CONTROL_API_KEY="$CONTROL_API_KEY" \
  CORSAIR_KEK="$CORSAIR_KEK"
success "Secrets set"

header "Deploying"
fly deploy --remote-only
success "Deployed → ${PUBLIC_URL}"

echo ""
echo -e "${GREEN}${BOLD}══════════════════════════════${RESET}"
echo -e "${GREEN}${BOLD}  Done!${RESET}"
echo -e "${GREEN}${BOLD}══════════════════════════════${RESET}"
echo ""
echo -e "  Dashboard: ${BOLD}${PUBLIC_URL}${RESET}"
echo -e "  MCP URL:   ${BOLD}${PUBLIC_URL}/mcp${RESET}"
echo ""
echo "Next:"
echo "  1. Sign in at ${PUBLIC_URL} with your APP_PASSWORD"
echo "  2. Go to /plugins — click Add to install integrations"
echo "  3. Click Credentials to connect each integration"
echo "  4. Go to /connect to create an MCP key for Claude.ai"
echo ""
echo -e "${BOLD}Save these generated secrets:${RESET}"
echo "  CORSAIR_KEK:     $CORSAIR_KEK"
echo "  SESSION_SECRET:  $SESSION_SECRET"
echo "  CONTROL_API_KEY: $CONTROL_API_KEY"
