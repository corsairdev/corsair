import "dotenv/config";
import { createHash, randomBytes } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cookieSession from "cookie-session";
import {
  APP_PASSWORD, CONTROL_PORT, INTERNAL_KEY,
  PUBLIC_URL, RUNTIME_PORT, SESSION_SECRET,
} from "./config.js";
import { CATALOG_BY_ID, PLUGIN_CATALOG, readPluginsConfig, writeCorsairFile, writePluginsConfig } from "./codegen.js";
import { initDb, pool } from "./db.js";
import { getRuntimeStatus, restartRuntime, startRuntime } from "./manager.js";
import { initWorkspace } from "./workspace.js";
import { corsairPermissions } from "@corsair-dev/ui";
import type { PermissionLike } from "@corsair-dev/ui";
import {
  connectPage, credentialsPage,
  esc, loginPage, permissionsPage, pluginsPage,
} from "./ui.js";

const exec = promisify(execFile);
const app = express();
app.set("trust proxy", 1);

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`[http] ${req.method} ${req.path} → ${res.statusCode} (${ms}ms)`);
  });
  next();
});

// ─────────────────────────────────────────────────────────────────────────────
// Proxy OAuth/MCP routes to runtime — BEFORE body parsers so the stream
// isn't consumed, and before session auth since the runtime handles its own auth
// ─────────────────────────────────────────────────────────────────────────────

const runtimeProxy = createProxyMiddleware({
  target: `http://localhost:${RUNTIME_PORT}`,
  changeOrigin: true,
  on: {
    proxyReq: (proxyReq) => {
      proxyReq.setHeader("x-admin-key", INTERNAL_KEY);
    },
    error: (err, req, res) => {
      console.error(`[proxy] runtime error on ${(req as express.Request).path}: ${(err as Error).message}`);
      (res as express.Response)
        .status(503)
        .json({ error: "Runtime is restarting — try again in a moment" });
    },
  },
});

const RUNTIME_BYPASS = ["/mcp", "/.well-known", "/authorize", "/oauth"];
app.use((req, res, next) => {
  if (RUNTIME_BYPASS.some(p => req.path === p || req.path.startsWith(p + "/"))) {
    return runtimeProxy(req, res, next);
  }
  next();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieSession({
  name: "corsair",
  secret: SESSION_SECRET,
  maxAge: 30 * 24 * 60 * 60 * 1000,
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
  sameSite: "lax",
}));

app.get("/health", (_req, res) => res.json({ ok: true, runtime: getRuntimeStatus().status }));

// ─────────────────────────────────────────────────────────────────────────────
// Approval pages — token-gated, no session needed
// ─────────────────────────────────────────────────────────────────────────────

app.get("/approve/:token", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, plugin, endpoint, args, status, token, created_at, expires_at FROM corsair_permissions WHERE token = $1`,
    [req.params.token],
  );
  const p = rows[0];
  if (!p) { res.status(404).send("Not found"); return; }
  const status = p.status === "pending" && new Date(p.expires_at) < new Date() ? "expired" : p.status;
  const html = corsairPermissions(
    { ...p, status, tenant_id: "default", updated_at: p.created_at } as PermissionLike,
    (perm) => ({ method: "POST" as const, url: `/approve/${perm.token}/approve` }),
    (perm) => ({ method: "POST" as const, url: `/approve/${perm.token}/deny` }),
  );
  res.setHeader("Content-Type", "text/html");
  res.send(html);
});

async function doApproval(token: string, action: "approve" | "deny", res: express.Response): Promise<void> {
  const { rows } = await pool.query(`SELECT id, status FROM corsair_permissions WHERE token = $1`, [token]);
  const p = rows[0];
  if (!p) { res.status(404).json({ message: "Not found" }); return; }
  if (p.status !== "pending") { res.json({ message: `This request was already ${p.status}.` }); return; }
  await pool.query(
    `UPDATE corsair_permissions SET status = $1, updated_at = NOW() WHERE id = $2`,
    [action === "approve" ? "approved" : "denied", p.id],
  );
  res.json({ message: action === "approve" ? "Approved!" : "Declined." });
}

app.post("/approve/:token/approve", (req, res) => void doApproval(req.params.token, "approve", res));
app.post("/approve/:token/deny",    (req, res) => void doApproval(req.params.token, "deny",    res));

// ─────────────────────────────────────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────────────────────────────────────

app.get("/login",  (_req, res) => { res.setHeader("Content-Type", "text/html"); res.send(loginPage()); });
app.post("/login", (req, res) => {
  const { password } = req.body as { password: string };
  if (password === APP_PASSWORD) {
    console.log(`[auth] login success from ${req.ip}`);
    req.session!.authenticated = true;
    console.log(`[auth] session set: ${JSON.stringify(req.session)}`);
    const dest = (req.query.next as string) || "/plugins";
    console.log(`[auth] redirecting to ${dest}`);
    res.redirect(dest);
  } else {
    console.warn(`[auth] login failed from ${req.ip} — wrong password`);
    res.setHeader("Content-Type", "text/html");
    res.send(loginPage(true));
  }
});
app.post("/logout", (req, res) => { req.session = null; res.redirect("/login"); });

// ─────────────────────────────────────────────────────────────────────────────
// Require session for everything below
// ─────────────────────────────────────────────────────────────────────────────

app.use((req, res, next) => {
  if (req.session?.authenticated) return next();
  console.log(`[auth] unauthenticated — session: ${JSON.stringify(req.session)}, cookie header: ${req.headers.cookie ?? "(none)"}`);
  res.redirect(`/login?next=${encodeURIComponent(req.path)}`);
});

app.get("/", (_req, res) => res.redirect("/plugins"));

// ─────────────────────────────────────────────────────────────────────────────
// Plugins page
// ─────────────────────────────────────────────────────────────────────────────

app.get("/plugins", async (_req, res) => {
  const installed = await readPluginsConfig();
  const { status } = getRuntimeStatus();
  res.setHeader("Content-Type", "text/html");
  res.send(pluginsPage(installed, PLUGIN_CATALOG, status));
});

// Add a plugin
app.post("/api/plugins/add", async (req, res) => {
  const { plugin } = req.body as { plugin: string };
  if (!CATALOG_BY_ID[plugin]) { res.status(400).send("Unknown plugin"); return; }

  const config = await readPluginsConfig();
  if (config[plugin]) { res.redirect("/plugins"); return; }

  config[plugin] = { mode: "cautious" };
  await writePluginsConfig(config);
  await writeCorsairFile(config);

  const pkg = CATALOG_BY_ID[plugin]!.package;
  console.log(`[plugins] installing ${pkg}`);
  try {
    await exec("npm", ["install", pkg], { cwd: process.env.WORKSPACE_DIR || "/workspace", timeout: 120_000 });
    console.log(`[plugins] installed ${pkg}`);
  } catch (err: any) {
    console.error(`[plugins] npm install failed for ${pkg}: ${err.message}`);
  }

  console.log(`[plugins] restarting runtime after adding ${plugin}`);
  void restartRuntime();
  res.redirect(`/credentials/${encodeURIComponent(plugin)}?installed=1`);
});

// Remove a plugin
app.post("/api/plugins/remove", async (req, res) => {
  const { plugin } = req.body as { plugin: string };
  const config = await readPluginsConfig();
  if (!config[plugin]) { res.redirect("/plugins"); return; }

  delete config[plugin];
  await writePluginsConfig(config);
  await writeCorsairFile(config);

  const pkg = CATALOG_BY_ID[plugin]?.package ?? `@corsair-dev/${plugin}`;
  console.log(`[plugins] uninstalling ${pkg}`);
  try {
    await exec("npm", ["uninstall", pkg], { cwd: process.env.WORKSPACE_DIR || "/workspace", timeout: 60_000 });
    console.log(`[plugins] uninstalled ${pkg}`);
  } catch (err: any) {
    console.error(`[plugins] npm uninstall failed for ${pkg}: ${err.message}`);
  }

  console.log(`[plugins] restarting runtime after removing ${plugin}`);
  void restartRuntime();
  res.redirect("/plugins");
});

// Change permission mode — just regenerate and restart, no npm needed
app.post("/api/plugins/:id/mode", async (req, res) => {
  const id = req.params.id;
  const { mode } = req.body as { mode: string };
  const validModes = ["open", "cautious", "strict", "readonly"];
  if (!validModes.includes(mode)) { res.status(400).send("Invalid mode"); return; }

  const config = await readPluginsConfig();
  if (!config[id]) { res.redirect("/plugins"); return; }

  config[id]!.mode = mode as any;
  await writePluginsConfig(config);
  await writeCorsairFile(config);
  void restartRuntime();
  res.redirect("/plugins");
});

// ─────────────────────────────────────────────────────────────────────────────
// Credentials pages — proxied to runtime's /api/keys + /api/root-keys
// ─────────────────────────────────────────────────────────────────────────────

async function runtimeFetch(path: string, opts?: RequestInit): Promise<any> {
  const res = await fetch(`http://localhost:${RUNTIME_PORT}${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", "x-admin-key": INTERNAL_KEY, ...(opts?.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`Runtime ${res.status}: ${await res.text()}`);
  return res.json();
}

app.get("/credentials/:plugin", async (req, res) => {
  const { plugin } = req.params;
  const config = await readPluginsConfig();
  if (!config[plugin]) { res.redirect("/plugins"); return; }

  const def = CATALOG_BY_ID[plugin];
  if (!def) { res.redirect("/plugins"); return; }

  let rootKeys: Record<string, string> = {};
  let accountKeys: Record<string, string> = {};

  try {
    const r = await runtimeFetch("/api/root-keys", {
      method: "POST", body: JSON.stringify({ plugins: [plugin] }),
    });
    rootKeys = r[plugin] ?? {};
  } catch {}

  try {
    const r = await runtimeFetch("/api/keys", {
      method: "POST", body: JSON.stringify({ plugins: [plugin] }),
    });
    accountKeys = r[plugin] ?? {};
  } catch {}

  const flash = req.query.installed ? `${def.label} installed. Now set up your credentials.` : undefined;

  res.setHeader("Content-Type", "text/html");
  res.send(credentialsPage(plugin, def.label, def.authType, rootKeys, accountKeys));
  // Note: flash is passed via query param, rendered by credentialsPage via the layout
  void flash; // handled in page HTML via query
});

// Save account-level key (API key, bot token)
app.post("/api/credentials/:plugin/key", async (req, res) => {
  const { plugin } = req.params;
  const { key, value } = req.body as { key: string; value: string };
  await runtimeFetch("/api/keys", { method: "PATCH", body: JSON.stringify({ plugin, key, value }) });
  res.redirect(`/credentials/${plugin}`);
});

// Save root-level OAuth credentials (client_id / client_secret)
app.post("/api/credentials/:plugin/root", async (req, res) => {
  const { plugin } = req.params;
  const { client_id, client_secret } = req.body as Record<string, string>;
  await runtimeFetch("/api/root-keys", { method: "PATCH", body: JSON.stringify({ plugin, key: "client_id",     value: client_id     }) });
  await runtimeFetch("/api/root-keys", { method: "PATCH", body: JSON.stringify({ plugin, key: "client_secret", value: client_secret }) });
  res.redirect(`/credentials/${plugin}`);
});

// Kick off OAuth flow for an integration
app.post("/api/credentials/:plugin/oauth", async (req, res) => {
  const { plugin } = req.params;
  try {
    const { url } = await runtimeFetch("/api/oauth/start", {
      method: "POST", body: JSON.stringify({ plugin, tenantId: "default" }),
    });
    res.redirect(url);
  } catch (err: any) {
    res.status(500).send(`OAuth start failed: ${err.message}`);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Connect page — MCP API keys (stored in control server's DB directly)
// ─────────────────────────────────────────────────────────────────────────────

app.get("/connect", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, name, client_id, key_prefix, created_at, last_used_at FROM mcp_api_keys ORDER BY created_at DESC`,
  );
  const keys = rows.map(r => ({
    id: r.id,
    name: r.name,
    clientId: r.client_id,
    keyPrefix: r.key_prefix,
    createdAt: r.created_at,
    lastUsedAt: r.last_used_at,
  }));
  const newKey = req.session?.newKey as { clientId: string; clientSecret: string } | undefined;
  if (req.session?.newKey) delete req.session!.newKey;

  res.setHeader("Content-Type", "text/html");
  res.send(connectPage(PUBLIC_URL, keys, newKey));
});

app.post("/api/mcp-keys", async (req, res) => {
  const { name } = req.body as { name: string };
  const secret    = `cors_${randomBytes(32).toString("base64url")}`;
  const keyHash   = createHash("sha256").update(secret).digest("hex");
  const keyPrefix = secret.slice(0, 12);
  const clientId  = crypto.randomUUID();

  await pool.query(
    `INSERT INTO mcp_api_keys (name, client_id, key_hash, key_prefix) VALUES ($1, $2, $3, $4)`,
    [name, clientId, keyHash, keyPrefix],
  );
  req.session!.newKey = { clientId, clientSecret: secret };
  res.redirect("/connect");
});

app.post("/api/mcp-keys/:id/revoke", async (req, res) => {
  await pool.query(`DELETE FROM mcp_api_keys WHERE id = $1`, [req.params.id]);
  res.redirect("/connect");
});

// ─────────────────────────────────────────────────────────────────────────────
// Permissions page — reads DB directly, no proxy needed
// ─────────────────────────────────────────────────────────────────────────────

app.get("/permissions", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, plugin, endpoint, args, expires_at FROM corsair_permissions
       WHERE tenant_id = 'default' AND status = 'pending' AND expires_at > NOW()
       ORDER BY created_at ASC`,
    );
    res.setHeader("Content-Type", "text/html");
    res.send(permissionsPage(rows));
  } catch {
    // permissions table doesn't exist yet (runtime hasn't started)
    res.setHeader("Content-Type", "text/html");
    res.send(permissionsPage([]));
  }
});

app.post("/api/permissions/:id/approve", async (req, res) => {
  await pool.query(
    `UPDATE corsair_permissions SET status = 'approved', updated_at = NOW()
     WHERE id = $1 AND tenant_id = 'default' AND status = 'pending'`,
    [req.params.id],
  );
  res.redirect("/permissions");
});

app.post("/api/permissions/:id/deny", async (req, res) => {
  await pool.query(
    `UPDATE corsair_permissions SET status = 'denied', updated_at = NOW()
     WHERE id = $1 AND tenant_id = 'default' AND status = 'pending'`,
    [req.params.id],
  );
  res.redirect("/permissions");
});

// ─────────────────────────────────────────────────────────────────────────────
// Proxy remaining session-protected runtime routes (/api/keys, /api/oauth/*)
// ─────────────────────────────────────────────────────────────────────────────

app.use(
  createProxyMiddleware({
    target: `http://localhost:${RUNTIME_PORT}`,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq) => {
        // Give the runtime an internal auth key so it can trust admin-level calls.
        proxyReq.setHeader("x-admin-key", INTERNAL_KEY);
      },
      error: (err, req, res) => {
        console.error(`[proxy] runtime error on ${(req as express.Request).path}: ${(err as Error).message}`);
        (res as express.Response)
          .status(503)
          .json({ error: "Runtime is restarting — try again in a moment" });
      },
    },
  }),
);

// ─────────────────────────────────────────────────────────────────────────────
// Start
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  await initWorkspace();
  await initDb();
  await startRuntime();
  app.listen(CONTROL_PORT, () => {
    console.log(`[control] Listening on ${PUBLIC_URL}`);
  });
}

main().catch(err => { console.error(err); process.exit(1); });
