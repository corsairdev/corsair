import "dotenv/config";
import { createHash, randomBytes } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
import { createBaseMcpServer, createMcpRouter } from "@corsair-dev/mcp";
import express, { type NextFunction, type Request, type Response } from "express";
import { setupCorsair } from "corsair";
import { CORSAIR_INTERNAL, encryptDEK, generateDEK } from "corsair/core";
import { createCorsairOrm } from "corsair/orm";
import { corsair } from "./corsair.js";
import { pool } from "./db.js";

const PORT      = Number(process.env.RUNTIME_PORT) || 3000;
const ADMIN_KEY = process.env.CONTROL_API_KEY || process.env.x_admin_key || "";
const PUBLIC_URL = process.env.PUBLIC_URL ?? "http://localhost:8080";

// ── Per-request tenant context ────────────────────────────────────────────────
// Single user instance — tenant is always "default".
const als = new AsyncLocalStorage<{ tenantId: string }>();

// ── Helpers ───────────────────────────────────────────────────────────────────

function requireAdminKey(req: Request, res: Response, next: NextFunction): void {
  const key = req.headers["x-admin-key"] as string | undefined;
  if (!ADMIN_KEY || key === ADMIN_KEY) { next(); return; }
  res.status(401).json({ error: "Unauthorized" });
}

// Walks prototype chain for get_* methods on a key manager.
function getterNames(obj: any): string[] {
  const names = new Set<string>();
  let cur = obj;
  while (cur && cur !== Object.prototype) {
    Object.getOwnPropertyNames(cur)
      .filter(k => k.startsWith("get_") && typeof obj[k] === "function")
      .forEach(k => names.add(k));
    cur = Object.getPrototypeOf(cur);
  }
  return [...names];
}

const SKIP_KEYS = new Set(["dek", "redirect_url", "integration_credentials"]);

async function readKeys(keysObj: any): Promise<Record<string, string>> {
  if (!keysObj) return {};
  const entries = await Promise.all(
    getterNames(keysObj)
      .filter(m => !SKIP_KEYS.has(m.slice(4)))
      .map(async m => {
        const val = await Promise.resolve(keysObj[m]()).catch(() => "");
        return [m.slice(4), val ?? ""] as const;
      }),
  );
  return Object.fromEntries(entries);
}

async function setKey(keysObj: any, key: string, value: string): Promise<void> {
  const method = `set_${key}`;
  if (typeof keysObj?.[method] !== "function") throw new Error(`'${method}' not found`);
  await keysObj[method](value);
}

// Ensures DB rows for integration + account exist before key operations.
async function ensureAccount(pluginId: string): Promise<void> {
  const internal = (corsair as any)[CORSAIR_INTERNAL] as { database: any; kek: string };
  const orm = createCorsairOrm(internal.database);

  let integration = await orm.integrations.findByName(pluginId);
  if (!integration) {
    const dek = await encryptDEK(generateDEK(), internal.kek);
    integration = await orm.integrations.create({ name: pluginId, config: {}, dek });
  }

  const existing = await orm.accounts.findOne({ tenant_id: "default", integration_id: integration.id });
  if (!existing) {
    const dek = await encryptDEK(generateDEK(), internal.kek);
    await orm.accounts.create({ tenant_id: "default", integration_id: integration.id, config: {}, dek });
  }
}

function getOAuthConfig(pluginId: string): any | null {
  const internal = (corsair as any)[CORSAIR_INTERNAL] as { plugins: any[] };
  const plugin = internal.plugins?.find((p: any) => p.id === pluginId);
  return plugin?.oauthConfig ?? null;
}

// ── In-memory OAuth state (cleared on runtime restart — users re-auth) ─────────

const authCodes  = new Map<string, { clientId: string; redirectUri: string; codeChallenge: string; codeChallengeMethod: string; expiresAt: number }>();
const oauthTokens = new Map<string, { expiresAt: number }>();

setInterval(() => {
  const now = Date.now();
  for (const [k, v] of authCodes)   if (v.expiresAt < now) authCodes.delete(k);
  for (const [k, v] of oauthTokens) if (v.expiresAt < now) oauthTokens.delete(k);
}, 60_000);

// ── MCP auth ──────────────────────────────────────────────────────────────────

async function verifyMcpAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const auth = req.headers.authorization;

  if (auth?.startsWith("Bearer cors_")) {
    const keyHash = createHash("sha256").update(auth.slice(7)).digest("hex");
    const { rows } = await pool.query(`SELECT id FROM mcp_api_keys WHERE key_hash = $1`, [keyHash]);
    if (!rows[0]) { res.status(401).json({ error: "Invalid API key" }); return; }
    pool.query(`UPDATE mcp_api_keys SET last_used_at = NOW() WHERE key_hash = $1`, [keyHash]).catch(() => {});
    als.run({ tenantId: "default" }, next);
    return;
  }

  if (auth?.startsWith("Bearer ")) {
    const entry = oauthTokens.get(auth.slice(7));
    if (!entry || entry.expiresAt < Date.now()) { res.status(401).json({ error: "Invalid token" }); return; }
    als.run({ tenantId: "default" }, next);
    return;
  }

  res.status(401).json({ error: "Unauthorized" });
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ── App ───────────────────────────────────────────────────────────────────────

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS — needed for browser-side PKCE token exchange
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, mcp-session-id");
  if (req.method === "OPTIONS") { res.sendStatus(204); return; }
  next();
});

app.get("/health", (_req, res) => res.json({ ok: true }));

// ── MCP ───────────────────────────────────────────────────────────────────────

app.use("/mcp", verifyMcpAuth);
app.use("/mcp", createMcpRouter(() => {
  return createBaseMcpServer({ corsair });
}));

// ── OAuth discovery ───────────────────────────────────────────────────────────

const oauthMeta = {
  issuer: PUBLIC_URL,
  authorization_endpoint: `${PUBLIC_URL}/authorize`,
  token_endpoint: `${PUBLIC_URL}/oauth/token`,
  grant_types_supported: ["authorization_code"],
  code_challenge_methods_supported: ["S256"],
  token_endpoint_auth_methods_supported: ["none"],
};

app.get("/.well-known/oauth-authorization-server",  (_req, res) => res.json(oauthMeta));
app.get("/.well-known/oauth-protected-resource",     (_req, res) => res.json({ resource: `${PUBLIC_URL}/mcp`, authorization_servers: [PUBLIC_URL] }));
app.get("/.well-known/oauth-protected-resource/mcp", (_req, res) => res.json({ resource: `${PUBLIC_URL}/mcp`, authorization_servers: [PUBLIC_URL] }));

// ── MCP OAuth authorize ───────────────────────────────────────────────────────

app.get("/authorize", async (req, res) => {
  const { client_id, redirect_uri, code_challenge, code_challenge_method, state, response_type } = req.query as Record<string, string>;
  if (response_type !== "code") { res.status(400).send("unsupported_response_type"); return; }

  const { rows } = await pool.query(`SELECT id FROM mcp_api_keys WHERE client_id = $1`, [client_id]);
  if (!rows[0]) { res.status(401).send("Unknown client_id"); return; }

  const e = escapeHtml;
  res.setHeader("Content-Type", "text/html");
  res.send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Authorize — Corsair</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f8fafc;padding:1rem}
.card{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:2rem;max-width:400px;width:100%;display:flex;flex-direction:column;gap:1.25rem}
h1{font-size:1.125rem;font-weight:600}p{font-size:.875rem;color:#64748b;line-height:1.5}
button{width:100%;padding:.5625rem 1rem;border-radius:8px;background:#1e293b;color:#fff;border:none;font-size:.875rem;font-weight:500;cursor:pointer}
button:hover{background:#0f172a}.meta{font-size:.75rem;color:#94a3b8;word-break:break-all}</style></head>
<body><div class="card"><h1>Connect to Corsair</h1>
<p>Allow this application to access your Corsair tools.</p>
<form method="POST" action="/authorize">
<input type="hidden" name="client_id" value="${e(client_id)}">
<input type="hidden" name="redirect_uri" value="${e(redirect_uri)}">
<input type="hidden" name="code_challenge" value="${e(code_challenge)}">
<input type="hidden" name="code_challenge_method" value="${e(code_challenge_method ?? "S256")}">
<input type="hidden" name="state" value="${e(state ?? "")}">
<button type="submit">Allow access</button></form>
<p class="meta">Redirecting to: ${e(redirect_uri)}</p>
</div></body></html>`);
});

app.post("/authorize", async (req, res) => {
  const { client_id, redirect_uri, code_challenge, code_challenge_method, state } = req.body as Record<string, string>;
  const { rows } = await pool.query(`SELECT id FROM mcp_api_keys WHERE client_id = $1`, [client_id]);
  if (!rows[0]) { res.status(401).send("Unknown client_id"); return; }

  const code = createHash("sha256").update(randomBytes(32)).digest("base64url");
  authCodes.set(code, { clientId: client_id, redirectUri: redirect_uri, codeChallenge: code_challenge, codeChallengeMethod: code_challenge_method ?? "S256", expiresAt: Date.now() + 10 * 60_000 });

  const url = new URL(redirect_uri);
  url.searchParams.set("code", code);
  if (state) url.searchParams.set("state", state);
  res.redirect(url.toString());
});

app.post("/oauth/token", (req, res) => {
  const { grant_type, code, code_verifier, client_id, redirect_uri } = req.body as Record<string, string>;
  if (grant_type !== "authorization_code") { res.status(400).json({ error: "unsupported_grant_type" }); return; }

  const entry = authCodes.get(code);
  if (!entry || entry.expiresAt < Date.now()) { res.status(400).json({ error: "invalid_grant", error_description: "Code expired" }); return; }
  if (client_id && entry.clientId !== client_id) { res.status(400).json({ error: "invalid_grant", error_description: "client_id mismatch" }); return; }
  if (redirect_uri && entry.redirectUri !== redirect_uri) { res.status(400).json({ error: "invalid_grant", error_description: "redirect_uri mismatch" }); return; }

  if (entry.codeChallengeMethod === "S256") {
    const computed = createHash("sha256").update(code_verifier ?? "").digest("base64url");
    if (computed !== entry.codeChallenge) { res.status(400).json({ error: "invalid_grant", error_description: "PKCE failed" }); return; }
  }
  authCodes.delete(code);

  const token = randomBytes(32).toString("base64url");
  oauthTokens.set(token, { expiresAt: Date.now() + 24 * 60 * 60_000 });
  pool.query(`UPDATE mcp_api_keys SET last_used_at = NOW() WHERE client_id = $1`, [entry.clientId]).catch(() => {});
  res.json({ access_token: token, token_type: "Bearer", expires_in: 86400 });
});

// ── Integration key management (called by control server via proxy) ────────────

// GET /api/keys { plugins: ["gmail"] } → { gmail: { api_key: "..." } }
app.post("/api/keys", requireAdminKey, async (req, res) => {
  const { plugins } = req.body as { plugins: string[] };
  const result: Record<string, Record<string, string>> = {};
  await Promise.all(plugins.map(async id => {
    result[id] = await readKeys((corsair as any)[id]?.keys).catch(() => ({}));
  }));
  res.json(result);
});

// PATCH /api/keys { plugin, key, value }
app.patch("/api/keys", requireAdminKey, async (req, res) => {
  const { plugin, key, value } = req.body as { plugin: string; key: string; value: string };
  await ensureAccount(plugin);
  await setKey((corsair as any)[plugin]?.keys, key, value);
  res.json({ ok: true });
});

// POST /api/root-keys { plugins: ["gmail"] } → { gmail: { client_id: "...", client_secret: "..." } }
app.post("/api/root-keys", requireAdminKey, async (req, res) => {
  const { plugins } = req.body as { plugins: string[] };
  const result: Record<string, Record<string, string>> = {};
  await Promise.all(plugins.map(async id => {
    result[id] = await readKeys((corsair as any).keys?.[id]).catch(() => ({}));
  }));
  res.json(result);
});

// PATCH /api/root-keys { plugin, key, value }
app.patch("/api/root-keys", requireAdminKey, async (req, res) => {
  const { plugin, key, value } = req.body as { plugin: string; key: string; value: string };
  await setKey((corsair as any).keys?.[plugin], key, value);
  res.json({ ok: true });
});

// ── Integration OAuth flows ───────────────────────────────────────────────────

const OAUTH_REDIRECT = `${PUBLIC_URL}/api/oauth/callback`;

app.post("/api/oauth/start", requireAdminKey, async (req, res) => {
  const { plugin: pluginId } = req.body as { plugin: string };
  const oauthCfg = getOAuthConfig(pluginId);
  if (!oauthCfg) { res.status(400).json({ error: `${pluginId} has no OAuth config` }); return; }

  const rootKeys = (corsair as any).keys?.[pluginId];
  const clientId = await Promise.resolve(rootKeys?.get_client_id?.()).catch(() => null);
  if (!clientId) { res.status(400).json({ error: "client_id not set" }); return; }

  const state = Buffer.from(JSON.stringify({ plugin: pluginId })).toString("base64url");
  const params = new URLSearchParams({ client_id: clientId, redirect_uri: OAUTH_REDIRECT, response_type: "code", scope: oauthCfg.scopes.join(" "), state, ...(oauthCfg.authParams ?? {}) });
  res.json({ url: `${oauthCfg.authUrl}?${params}` });
});

app.get("/api/oauth/callback", async (req, res) => {
  const { code, state, error } = req.query as Record<string, string>;
  if (error) { res.status(400).json({ error }); return; }

  const { plugin: pluginId } = JSON.parse(Buffer.from(state, "base64url").toString()) as { plugin: string };
  const oauthCfg = getOAuthConfig(pluginId);
  if (!oauthCfg) { res.status(400).send("Plugin not found"); return; }

  const rootKeys = (corsair as any).keys?.[pluginId];
  const clientId     = await Promise.resolve(rootKeys?.get_client_id?.()).catch(() => null);
  const clientSecret = await Promise.resolve(rootKeys?.get_client_secret?.()).catch(() => null);
  if (!clientId || !clientSecret) { res.status(400).send("Missing client credentials"); return; }

  const useBasicAuth = oauthCfg.tokenAuthMethod === "basic";
  const body = new URLSearchParams({ code, redirect_uri: OAUTH_REDIRECT, grant_type: "authorization_code" });
  if (!useBasicAuth) { body.set("client_id", clientId); body.set("client_secret", clientSecret); }
  const headers: Record<string, string> = { "Content-Type": "application/x-www-form-urlencoded" };
  if (useBasicAuth) headers.Authorization = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;

  const tokenRes = await fetch(oauthCfg.tokenUrl, { method: "POST", headers, body: body.toString() });
  if (!tokenRes.ok) { res.status(502).send(`Token exchange failed: ${await tokenRes.text()}`); return; }
  const tokens = await tokenRes.json() as Record<string, unknown>;

  await ensureAccount(pluginId);
  const accountKeys = (corsair as any)[pluginId]?.keys;
  if (tokens.access_token)  await accountKeys?.set_access_token(tokens.access_token as string);
  if (tokens.refresh_token) await accountKeys?.set_refresh_token(tokens.refresh_token as string);
  if (typeof tokens.expires_in === "number") {
    await accountKeys?.set_expires_at((Math.floor(Date.now() / 1000) + tokens.expires_in).toString());
  }

  res.redirect("/credentials/" + encodeURIComponent(pluginId));
});

// ── Sync DB rows for all plugins × default tenant ─────────────────────────────

app.post("/api/setup", requireAdminKey, async (_req, res) => {
  const logs = await setupCorsair(corsair);
  for (const line of logs) console.log(line);
  res.json({ ok: true, logs });
});

// ── Start ─────────────────────────────────────────────────────────────────────

process.on("uncaughtException", (err) => {
  console.error("[runtime] uncaughtException:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("[runtime] unhandledRejection:", reason);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`[runtime] Listening on port ${PORT}`);
  setupCorsair(corsair).then(logs => {
    for (const line of logs) console.log(line);
  }).catch(err => {
    console.error(`[runtime] setupCorsair failed: ${err.message}`);
  });
});
