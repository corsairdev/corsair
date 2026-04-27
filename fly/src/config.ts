import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Project root = one level up from src/
const PROJECT_ROOT = path.resolve(__dirname, "..");

// ─────────────────────────────────────────────────────────────────────────────
// All constants live here. Edit this file to configure your instance.
// Sensitive values come from environment variables (set as Fly secrets in prod).
// ─────────────────────────────────────────────────────────────────────────────

// ── Ports & paths ─────────────────────────────────────────────────────────────

export const CONTROL_PORT = Number(process.env.CONTROL_PORT) || 8080;
export const RUNTIME_PORT  = Number(process.env.RUNTIME_PORT)  || 3000;

// In production these are Fly volume paths (/workspace, /workspace-defaults).
// Locally they default to directories inside the project root.
export const WORKSPACE_DIR          = process.env.WORKSPACE_DIR          || path.join(PROJECT_ROOT, ".workspace");
export const WORKSPACE_DEFAULTS_DIR = process.env.WORKSPACE_DEFAULTS_DIR || path.join(PROJECT_ROOT, "workspace-defaults");

// ── URLs ──────────────────────────────────────────────────────────────────────

// Public URL of this app — used in OAuth redirects, MCP metadata, and approval links.
// Set to https://<your-app>.fly.dev in production.
export const PUBLIC_URL = process.env.PUBLIC_URL || `http://localhost:${CONTROL_PORT}`;

// ── Auth ──────────────────────────────────────────────────────────────────────

// Password protecting the dashboard UI.
// Set APP_PASSWORD as a Fly secret: fly secrets set APP_PASSWORD=...
export const APP_PASSWORD = process.env.APP_PASSWORD || "changeme";

// Signs session cookies — generate: openssl rand -hex 32
export const SESSION_SECRET = process.env.SESSION_SECRET || "dev-secret-change-me";

// Shared key between control server and runtime for internal API calls.
// Auto-set to CONTROL_API_KEY; set as a Fly secret in production.
export const INTERNAL_KEY = process.env.CONTROL_API_KEY || "dev-internal-key";
