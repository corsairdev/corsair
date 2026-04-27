import type { PluginDef, PluginsConfig, PermissionMode } from "./codegen.js";
import { renderArgsSnippet } from "@corsair-dev/ui";

export function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;").replace(/"/g, "&quot;")
    .replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const NAV = [
  { href: "/plugins",     label: "Plugins"     },
  { href: "/connect",     label: "Connect"     },
  { href: "/permissions", label: "Permissions" },
];

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, -apple-system, sans-serif; display: flex;
         min-height: 100vh; background: #f8fafc; color: #1e293b; }
  nav { width: 210px; min-height: 100vh; background: #0f172a; display: flex;
        flex-direction: column; padding: 1.5rem 1rem; gap: 0.25rem; flex-shrink: 0; }
  .logo { color: #f8fafc; font-weight: 700; padding: 0 0.5rem; margin-bottom: 1.25rem; }
  nav a { color: #94a3b8; text-decoration: none; padding: 0.5rem 0.75rem;
          border-radius: 6px; font-size: 0.875rem; display: block; }
  nav a:hover, nav a.active { color: #f8fafc; background: #1e293b; }
  .spacer { flex: 1; }
  .logout-btn { background: none; border: none; color: #64748b; font-size: 0.875rem;
                cursor: pointer; padding: 0.5rem 0.75rem; border-radius: 6px; width: 100%; text-align: left; }
  .logout-btn:hover { color: #f8fafc; background: #1e293b; }
  main { flex: 1; padding: 2rem 2.5rem; max-width: 860px; }
  h1 { font-size: 1.125rem; font-weight: 600; margin-bottom: 1.5rem; }
  h2 { font-size: 0.9375rem; font-weight: 600; margin-bottom: 0.75rem; color: #475569; }
  /* Cards */
  .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.25rem; margin-bottom: 0.75rem; }
  .card-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
  .card-title { font-weight: 600; font-size: 0.9375rem; }
  .card-sub { font-size: 0.8125rem; color: #64748b; margin-top: 0.125rem; }
  /* Plugin grid */
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem; }
  .plugin-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem;
                 display: flex; flex-direction: column; gap: 0.5rem; }
  .plugin-card.installed { border-color: #6366f1; }
  /* Forms */
  .row { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
  input[type=text], input[type=password], select {
    border: 1px solid #cbd5e1; border-radius: 6px; padding: 0.4375rem 0.75rem;
    font-size: 0.875rem; outline: none; background: #fff; }
  input[type=text]:focus, input[type=password]:focus { border-color: #6366f1; box-shadow: 0 0 0 2px #6366f120; }
  input.full { width: 100%; }
  /* Buttons */
  .btn { padding: 0.4375rem 0.875rem; border-radius: 6px; font-size: 0.875rem;
         font-weight: 500; cursor: pointer; border: none; white-space: nowrap; }
  .btn-primary { background: #1e293b; color: #fff; }
  .btn-primary:hover { background: #0f172a; }
  .btn-outline { background: #fff; color: #374151; border: 1px solid #d1d5db; }
  .btn-outline:hover { background: #f9fafb; }
  .btn-ghost  { background: transparent; color: #6366f1; border: none; font-size: 0.875rem; font-weight:500; cursor:pointer; padding: 0.375rem 0; }
  .btn-danger { background: #fff; color: #dc2626; border: 1px solid #fca5a5; }
  .btn-danger:hover { background: #fef2f2; }
  .btn-sm { padding: 0.3125rem 0.75rem; font-size: 0.8125rem; }
  .btn-full { width: 100%; }
  /* Badges */
  .badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; }
  .badge-purple { background: #ede9fe; color: #5b21b6; }
  .badge-blue   { background: #dbeafe; color: #1e40af; }
  .badge-gray   { background: #f1f5f9; color: #475569; }
  .badge-yellow { background: #fef9c3; color: #854d0e; }
  /* Alerts */
  .alert { padding: 1rem 1.25rem; border-radius: 8px; margin-bottom: 1.25rem; font-size: 0.875rem; line-height: 1.5; }
  .alert-green { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; }
  .alert-blue  { background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; }
  /* Misc */
  .mono { font-family: ui-monospace, monospace; font-size: 0.8125rem; }
  .label { font-size: 0.75rem; font-weight: 500; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem; }
  .empty { color: #94a3b8; font-size: 0.875rem; padding: 2rem; text-align: center; border: 1px dashed #e2e8f0; border-radius: 8px; }
  .sep { border: none; border-top: 1px solid #e2e8f0; margin: 1.25rem 0; }
  pre.args { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 0.75rem;
             font-size: 0.75rem; white-space: pre-wrap; word-break: break-all;
             max-height: 150px; overflow-y: auto; margin-bottom: 0.75rem; }
  .status-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 6px; }
  .dot-green  { background: #22c55e; }
  .dot-yellow { background: #f59e0b; }
  .dot-red    { background: #ef4444; }
`;

export function layout(active: string, title: string, body: string, flash?: string): string {
  const links = NAV.map(({ href, label }) =>
    `<a href="${href}"${active === href ? ' class="active"' : ""}>${label}</a>`
  ).join("\n    ");
  const flashHtml = flash ? `<div class="alert alert-blue" style="margin-bottom:1.5rem">${esc(flash)}</div>` : "";

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} — Corsair</title>
<style>${CSS}</style></head>
<body>
<nav>
  <div class="logo">Corsair</div>
  ${links}
  <div class="spacer"></div>
  <form method="POST" action="/logout"><button class="logout-btn">Log out</button></form>
</nav>
<main>
  <h1>${esc(title)}</h1>
  ${flashHtml}${body}
</main>
</body></html>`;
}

export function loginPage(error = false): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<title>Login — Corsair</title>
<style>*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f8fafc}
.card{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:2rem;width:320px;display:flex;flex-direction:column;gap:1rem}
h1{font-size:1.125rem;font-weight:600}p{font-size:.875rem;color:#64748b}
input{width:100%;border:1px solid #cbd5e1;border-radius:6px;padding:.5rem .75rem;font-size:.875rem;outline:none}
input:focus{border-color:#6366f1}button{width:100%;padding:.5rem;border-radius:6px;background:#1e293b;color:#fff;border:none;font-size:.875rem;font-weight:500;cursor:pointer}
button:hover{background:#0f172a}.err{color:#dc2626;font-size:.8125rem}</style></head>
<body><div class="card">
<h1>Corsair</h1>
<p>Enter your password to access the dashboard.</p>
${error ? '<p class="err">Incorrect password.</p>' : ""}
<form method="POST" action="/login">
<input type="password" name="password" placeholder="Password" autofocus>
<br><br>
<button type="submit">Sign in</button>
</form></div></body></html>`;
}

// Plugins page
export function pluginsPage(
  installed: PluginsConfig,
  catalog: PluginDef[],
  runtimeStatus: string,
): string {
  const installedIds = new Set(Object.keys(installed));

  const statusDot = runtimeStatus === "running"
    ? `<span class="status-dot dot-green"></span>Runtime running`
    : runtimeStatus === "restarting" || runtimeStatus === "starting"
    ? `<span class="status-dot dot-yellow"></span>Runtime restarting…`
    : `<span class="status-dot dot-red"></span>Runtime ${runtimeStatus}`;

  const installedCards = installedIds.size === 0
    ? `<p class="empty">No plugins installed yet. Add one from the catalog below.</p>`
    : [...installedIds].map(id => {
        const def = catalog.find(p => p.id === id);
        if (!def) return "";
        const mode = installed[id]!.mode;
        return `<div class="card">
<div class="card-row">
  <div>
    <div class="card-title">${esc(def.label)}</div>
    <div class="card-sub">${esc(def.description)}</div>
  </div>
  <div style="display:flex;gap:.5rem;align-items:center;flex-shrink:0">
    <form method="POST" action="/api/plugins/${esc(id)}/mode" style="display:flex;gap:.5rem;align-items:center">
      <select name="mode" class="btn btn-sm btn-outline" onchange="this.form.submit()">
        ${["open","cautious","strict","readonly"].map(m =>
          `<option value="${m}"${m === mode ? " selected" : ""}>${m}</option>`
        ).join("")}
      </select>
    </form>
    <a href="/credentials/${esc(id)}" class="btn btn-sm btn-outline">Credentials</a>
    <form method="POST" action="/api/plugins/remove" onsubmit="return confirm('Remove ${esc(def.label)}?')">
      <input type="hidden" name="plugin" value="${esc(id)}">
      <button type="submit" class="btn btn-sm btn-danger">Remove</button>
    </form>
  </div>
</div></div>`;
      }).join("\n");

  const availableCards = catalog
    .filter(p => !installedIds.has(p.id))
    .map(p => {
      const authBadge = p.authType === "oauth" ? "OAuth" : p.authType === "api_key" ? "API Key" : "Bot Token";
      const badgeClass = p.authType === "oauth" ? "badge-purple" : p.authType === "api_key" ? "badge-blue" : "badge-gray";
      return `<div class="plugin-card">
<div style="display:flex;justify-content:space-between;align-items:flex-start">
  <div class="card-title">${esc(p.label)}</div>
  <span class="badge ${badgeClass}">${authBadge}</span>
</div>
<div class="card-sub">${esc(p.description)}</div>
<form method="POST" action="/api/plugins/add" style="margin-top:auto;padding-top:.5rem">
  <input type="hidden" name="plugin" value="${esc(p.id)}">
  <button type="submit" class="btn btn-sm btn-outline btn-full">Add</button>
</form></div>`;
    }).join("\n");

  return layout("/plugins", "Plugins", `
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem">
  <h2 style="margin:0">Installed</h2>
  <span style="font-size:.8125rem;color:#64748b">${statusDot}</span>
</div>
${installedCards}
<hr class="sep">
<h2>Available</h2>
<div class="grid">${availableCards}</div>`);
}

// Credentials page for a single plugin
export function credentialsPage(
  pluginId: string,
  label: string,
  authType: string,
  rootKeys: Record<string, string>,
  accountKeys: Record<string, string>,
): string {
  const isOAuth = authType === "oauth";
  const hasClientCreds = !!(rootKeys.client_id && rootKeys.client_secret);
  const isConnected = isOAuth ? !!accountKeys.access_token : Object.values(accountKeys).some(Boolean);

  let body = `<a href="/plugins" style="font-size:.875rem;color:#6366f1;text-decoration:none">← Back to Plugins</a>
<div style="margin-top:1.25rem">`;

  if (isOAuth) {
    body += `<div class="card" style="margin-bottom:.75rem">
<div class="card-title" style="margin-bottom:.75rem">OAuth App Credentials</div>
<div class="card-sub" style="margin-bottom:1rem">Create an OAuth app in the provider's developer console and paste the credentials here.</div>
<form method="POST" action="/api/credentials/${esc(pluginId)}/root">
<div style="display:flex;flex-direction:column;gap:.5rem">
  <input type="text" name="client_id"     class="full" placeholder="Client ID"     value="${esc(rootKeys.client_id ?? "")}">
  <input type="text" name="client_secret" class="full" placeholder="Client Secret" value="${esc(rootKeys.client_secret ?? "")}">
  <div><button type="submit" class="btn btn-primary btn-sm">Save</button></div>
</div></form></div>

<div class="card">
<div class="card-row" style="margin-bottom:${isConnected ? "0" : ".75rem"}">
  <div>
    <div class="card-title">Account Connection</div>
    ${isConnected ? '<div class="card-sub" style="color:#16a34a">Connected</div>' : '<div class="card-sub">Not connected</div>'}
  </div>
  ${isConnected ? '<span class="badge badge-green" style="background:#dcfce7;color:#166534">Active</span>' : ""}
</div>
${!isConnected ? `<form method="POST" action="/api/credentials/${esc(pluginId)}/oauth">
<button type="submit" class="btn btn-primary btn-sm" ${hasClientCreds ? "" : 'disabled title="Save OAuth credentials first"'}>Connect with OAuth</button>
</form>` : `<form method="POST" action="/api/credentials/${esc(pluginId)}/oauth" style="margin-top:.75rem">
<button type="submit" class="btn btn-outline btn-sm">Reconnect</button>
</form>`}</div>`;
  } else {
    const fields = Object.keys(accountKeys).length ? Object.keys(accountKeys) : ["api_key"];
    body += `<div class="card">
<div class="card-title" style="margin-bottom:.75rem">
  ${authType === "bot_token" ? "Bot Token" : "API Key"}
</div>
${fields.map(field => `
<form method="POST" action="/api/credentials/${esc(pluginId)}/key" style="margin-bottom:.5rem">
<input type="hidden" name="key" value="${esc(field)}">
<div class="row">
  <input type="text" name="value" placeholder="${esc(field)}" value="${esc(accountKeys[field] ?? "")}" style="flex:1">
  <button type="submit" class="btn btn-primary btn-sm">Save</button>
</div></form>`).join("")}
</div>`;
  }

  body += `</div>`;
  return layout("/plugins", `${label} — Credentials`, body);
}

// Connect page (MCP keys)
export function connectPage(
  publicUrl: string,
  keys: { id: string; name: string; clientId: string; keyPrefix: string; createdAt: Date; lastUsedAt: Date | null }[],
  newKey?: { clientId: string; clientSecret: string },
): string {
  const newKeyHtml = newKey ? `
<div class="alert alert-green" style="margin-bottom:1.25rem">
  <strong>Key created — save these now. The client secret is shown only once.</strong>
  <div style="margin-top:.75rem;display:flex;flex-direction:column;gap:.5rem">
    <div><div class="label">MCP URL</div><div class="mono">${esc(publicUrl)}/mcp</div></div>
    <div><div class="label">Client ID</div><div class="mono">${esc(newKey.clientId)}</div></div>
    <div><div class="label">Client Secret</div><div class="mono">${esc(newKey.clientSecret)}</div></div>
  </div>
</div>` : "";

  const keyRows = keys.length
    ? keys.map(k => {
        const fmt = (d: Date | null) => d ? new Date(d).toLocaleDateString() : "Never";
        return `<div class="card">
<div class="card-row">
  <div>
    <div class="card-title">${esc(k.name)}</div>
    <div class="card-sub mono">${esc(k.clientId.slice(0, 8))}… · Created ${fmt(k.createdAt)} · Last used ${fmt(k.lastUsedAt)}</div>
  </div>
  <form method="POST" action="/api/mcp-keys/${esc(k.id)}/revoke">
    <button class="btn btn-sm btn-danger" onclick="return confirm('Revoke this key?')">Revoke</button>
  </form>
</div></div>`;
      }).join("\n")
    : `<div class="empty">No keys yet. Create one below.</div>`;

  return layout("/connect", "Connect", `
${newKeyHtml}
<div class="card" style="margin-bottom:1.25rem">
  <div class="label">MCP URL</div>
  <div class="mono" style="margin-top:.25rem">${esc(publicUrl)}/mcp</div>
</div>
<h2>API Keys</h2>
${keyRows}
<div class="card" style="margin-top:.75rem">
  <div class="card-title" style="margin-bottom:.5rem">Create a new key</div>
  <form method="POST" action="/api/mcp-keys">
    <div class="row">
      <input type="text" name="name" placeholder="e.g. Claude Desktop" maxlength="100" required style="flex:1">
      <button type="submit" class="btn btn-primary">Create key</button>
    </div>
  </form>
</div>`);
}

// Permissions page
export function permissionsPage(
  perms: { id: string; plugin: string; endpoint: string; args: unknown; expires_at: string }[],
): string {
  const cards = perms.length
    ? perms.map(p => {
        return `<div class="card">
<div class="card-row" style="margin-bottom:.75rem">
  <div>
    <div class="card-title">${esc(p.plugin)} · ${esc(p.endpoint)}</div>
    <div class="card-sub">Expires ${new Date(p.expires_at).toLocaleTimeString()}</div>
  </div>
  <span class="badge badge-yellow">Pending</span>
</div>
<div style="margin-bottom:.75rem">${renderArgsSnippet(p.plugin, p.endpoint, p.args)}</div>
<div style="display:flex;gap:.5rem">
  <form method="POST" action="/api/permissions/${esc(p.id)}/approve">
    <button class="btn btn-primary btn-sm">Approve</button>
  </form>
  <form method="POST" action="/api/permissions/${esc(p.id)}/deny">
    <button class="btn btn-danger btn-sm">Deny</button>
  </form>
</div></div>`;
      }).join("\n")
    : `<div class="empty">No pending approvals.</div>`;

  return layout("/permissions", "Permissions",
    cards + `<script>setTimeout(() => location.reload(), 10000)</script>`
  );
}
