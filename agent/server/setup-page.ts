/**
 * Single setup page served at GET /setup
 *
 * Query params (all optional):
 *   ?plugin=slack           → scroll to / highlight that plugin's section
 *   ?plugin=slack&field=api_key → show a focused single-field entry form
 *
 * The page fetches /api/plugins on load and renders everything client-side.
 * Credentials are submitted directly to the server by the browser and
 * never pass through the agent's context.
 */
export function getSetupPageHtml(): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Plugin Setup — Corsair Agent</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f0f11;
      color: #e2e2e2;
      min-height: 100vh;
      padding: 40px 16px;
    }

    .container { max-width: 680px; margin: 0 auto; }

    /* ── Header ── */
    header { margin-bottom: 36px; }
    header h1 { font-size: 1.5rem; font-weight: 600; color: #fff; letter-spacing: -0.02em; }
    header .subtitle { margin-top: 6px; font-size: 0.875rem; color: #71717a; line-height: 1.5; }

    /* ── Focused single-field mode ── */
    .focused-card {
      background: #18181b;
      border: 1px solid #3b82f6;
      border-radius: 14px;
      padding: 28px;
    }

    .focused-card .plugin-tag {
      display: inline-block;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 3px 9px;
      border-radius: 4px;
      background: #1d4ed822;
      color: #60a5fa;
      border: 1px solid #1d4ed844;
      margin-bottom: 14px;
    }

    .focused-card h2 { font-size: 1.25rem; font-weight: 600; color: #fff; margin-bottom: 6px; }
    .focused-card p { font-size: 0.875rem; color: #71717a; line-height: 1.5; margin-bottom: 22px; }

    /* ── Plugin cards ── */
    .plugin-card {
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 12px;
      margin-bottom: 12px;
      overflow: hidden;
    }

    .plugin-card.highlighted { border-color: #3b82f6; }

    .plugin-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px;
      cursor: pointer;
      user-select: none;
    }

    .plugin-name { font-size: 0.9375rem; font-weight: 600; color: #fff; flex: 1; }

    .badge {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 3px 9px;
      border-radius: 999px;
    }
    .badge.ready { background: #14532d22; color: #4ade80; border: 1px solid #16a34a44; }
    .badge.not-ready { background: #7f1d1d22; color: #f87171; border: 1px solid #dc262644; }

    .auth-tag {
      font-size: 0.65rem; font-weight: 500; text-transform: uppercase;
      letter-spacing: 0.06em; padding: 2px 7px; border-radius: 3px;
      background: #27272a; color: #71717a;
    }

    .chevron { color: #52525b; transition: transform 0.18s; font-size: 0.7rem; }
    .plugin-card.open .chevron { transform: rotate(180deg); }

    .plugin-body {
      display: none;
      padding: 0 20px 20px;
      border-top: 1px solid #27272a;
    }
    .plugin-card.open .plugin-body { display: block; }

    /* ── Field groups ── */
    .field-group { margin-top: 18px; }

    .field-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 5px;
    }

    .field-dot {
      width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
    }
    .field-dot.set { background: #4ade80; }
    .field-dot.missing { background: #f87171; }

    .field-name { font-size: 0.8125rem; font-weight: 500; color: #d4d4d8; }

    .level-tag {
      font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.06em;
      padding: 1px 5px; border-radius: 3px; background: #27272a; color: #71717a;
    }
    .opt-tag {
      font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.06em;
      padding: 1px 5px; border-radius: 3px; background: #1a1a1d; color: #52525b;
      border: 1px solid #27272a;
    }

    .field-desc { font-size: 0.75rem; color: #52525b; margin-bottom: 8px; line-height: 1.4; }

    .field-row { display: flex; gap: 8px; }

    .field-input {
      flex: 1;
      background: #09090b;
      border: 1px solid #3f3f46;
      border-radius: 8px;
      padding: 9px 12px;
      font-size: 0.875rem;
      color: #e2e2e2;
      font-family: 'SF Mono', 'Fira Code', monospace;
      outline: none;
      transition: border-color 0.15s;
    }
    .field-input:focus { border-color: #3b82f6; }
    .field-input.is-set { color: #4ade80; }
    .field-input::placeholder { color: #3f3f46; font-family: inherit; }

    .btn-save {
      background: #3b82f6; color: #fff; border: none;
      border-radius: 8px; padding: 9px 16px;
      font-size: 0.875rem; font-weight: 500;
      cursor: pointer; white-space: nowrap;
      transition: background 0.15s;
    }
    .btn-save:hover { background: #2563eb; }
    .btn-save:disabled { background: #27272a; color: #52525b; cursor: not-allowed; }

    .field-msg { margin-top: 5px; font-size: 0.75rem; min-height: 15px; }
    .field-msg.ok { color: #4ade80; }
    .field-msg.err { color: #f87171; }

    hr.sep { border: none; border-top: 1px solid #1f1f22; margin: 16px 0 0; }

    .loading { text-align: center; color: #52525b; padding: 60px 0; font-size: 0.875rem; }
    .err-state { text-align: center; color: #f87171; padding: 60px 0; }

    .view-all { display: inline-block; margin-top: 28px; font-size: 0.8125rem; color: #71717a; text-decoration: none; }
    .view-all:hover { color: #a1a1aa; }
  </style>
</head>
<body>
<div class="container">
  <header>
    <h1>Plugin Setup</h1>
    <p class="subtitle">Configure authentication for your Corsair plugins.<br>
       Values are saved directly to the server — they never appear in AI chat.</p>
  </header>
  <div id="root"><div class="loading">Loading…</div></div>
</div>

<script>
  const params = new URLSearchParams(location.search);
  const FOCUS_PLUGIN = params.get('plugin');
  const FOCUS_FIELD  = params.get('field');
  const PORT = location.port || '3001';
  const API  = location.protocol + '//' + location.hostname + ':' + PORT;

  // ── helpers ──────────────────────────────────────────────────────────────

  function esc(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  async function loadPlugins() {
    const res = await fetch(API + '/api/plugins');
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async function saveField(pluginName, field, level, uid) {
    const inp = document.getElementById('inp_' + uid);
    const btn = document.getElementById('btn_' + uid);
    const msg = document.getElementById('msg_' + uid);
    const val = inp.value.trim();
    if (!val) { msg.textContent = 'Please enter a value.'; msg.className = 'field-msg err'; return; }
    btn.disabled = true; btn.textContent = 'Saving…'; msg.textContent = '';
    try {
      const r = await fetch(API + '/api/plugins/' + pluginName + '/fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field, value: val, level }),
      });
      const d = await r.json();
      if (d.success) {
        msg.textContent = '✓ Saved'; msg.className = 'field-msg ok';
        inp.value = '';
        inp.placeholder = '••••••••  (already set — paste to replace)';
        inp.classList.add('is-set');
        const dot = document.getElementById('dot_' + uid);
        if (dot) { dot.className = 'field-dot set'; }
        // Refresh the card badge
        setTimeout(() => refreshBadge(pluginName), 400);
      } else {
        msg.textContent = '✗ ' + (d.error || 'Failed'); msg.className = 'field-msg err';
      }
    } catch(e) {
      msg.textContent = '✗ ' + e.message; msg.className = 'field-msg err';
    } finally {
      btn.disabled = false; btn.textContent = 'Save';
    }
  }

  async function refreshBadge(pluginName) {
    try {
      const r = await fetch(API + '/api/plugins/' + pluginName);
      if (!r.ok) return;
      const p = await r.json();
      const badge = document.getElementById('badge_' + pluginName);
      if (badge) {
        badge.className = 'badge ' + (p.isReady ? 'ready' : 'not-ready');
        badge.textContent = p.isReady ? '✓ Ready' : '✗ Needs setup';
      }
    } catch { /* ignore */ }
  }

  function toggleCard(name) {
    document.getElementById('card_' + name).classList.toggle('open');
  }

  // ── renderers ─────────────────────────────────────────────────────────────

  function renderField(plugin, f, alwaysShow) {
    if (!alwaysShow && FOCUS_FIELD && f.field !== FOCUS_FIELD) return '';
    const uid = plugin.name + '__' + f.field;
    const phSet = '••••••••  (already set — paste to replace)';
    const phEmpty = 'Paste value here…';
    return \`
      <div class="field-group">
        <div class="field-header">
          <span class="field-dot \${f.isSet ? 'set' : 'missing'}" id="dot_\${uid}"></span>
          <span class="field-name">\${esc(f.label)}</span>
          \${!f.required ? '<span class="opt-tag">optional</span>' : ''}
          <span class="level-tag">\${esc(f.level)}</span>
        </div>
        <div class="field-desc">\${esc(f.description)}</div>
        <div class="field-row">
          <input
            id="inp_\${uid}"
            class="field-input\${f.isSet ? ' is-set' : ''}"
            type="password" autocomplete="off"
            placeholder="\${f.isSet ? phSet : phEmpty}"
          />
          <button id="btn_\${uid}" class="btn-save"
            onclick="saveField('\${esc(plugin.name)}','\${esc(f.field)}','\${esc(f.level)}','\${uid}')">
            Save
          </button>
        </div>
        <div id="msg_\${uid}" class="field-msg"></div>
      </div>
    \`;
  }

  function renderFocusedCard(plugin) {
    const f = plugin.fields.find(x => x.field === FOCUS_FIELD) || plugin.fields[0];
    if (!f) return '<div class="loading">No fields found.</div>';
    const uid = plugin.name + '__' + f.field;
    const phSet = '••••••••  (already set — paste to replace)';
    return \`
      <div class="focused-card">
        <div class="plugin-tag">\${esc(plugin.name.toUpperCase())}</div>
        <h2>\${esc(f.label)}</h2>
        <p>\${esc(f.description)}</p>
        <div class="field-row">
          <input
            id="inp_\${uid}"
            class="field-input\${f.isSet ? ' is-set' : ''}"
            type="password" autocomplete="off"
            placeholder="\${f.isSet ? phSet : 'Paste value here…'}"
          />
          <button id="btn_\${uid}" class="btn-save"
            onclick="saveField('\${esc(plugin.name)}','\${esc(f.field)}','\${esc(f.level)}','\${uid}')">
            Save
          </button>
        </div>
        <div id="msg_\${uid}" class="field-msg"></div>
      </div>
      <a class="view-all" href="/setup">← View all plugins</a>
    \`;
  }

  function renderPluginCard(plugin) {
    const isOpen = FOCUS_PLUGIN === plugin.name || !plugin.isReady;
    const fields = plugin.fields.map(f => renderField(plugin, f, true)).join('<hr class="sep"/>');
    return \`
      <div class="plugin-card \${FOCUS_PLUGIN === plugin.name ? 'highlighted' : ''} \${isOpen ? 'open' : ''}"
           id="card_\${plugin.name}">
        <div class="plugin-header" onclick="toggleCard('\${plugin.name}')">
          <span class="plugin-name">\${esc(plugin.name)}</span>
          <span class="auth-tag">\${esc(plugin.authType.replace('_',' '))}</span>
          <span class="badge \${plugin.isReady ? 'ready' : 'not-ready'}" id="badge_\${plugin.name}">
            \${plugin.isReady ? '✓ Ready' : '✗ Needs setup'}
          </span>
          <span class="chevron">▼</span>
        </div>
        <div class="plugin-body">\${fields}</div>
      </div>
    \`;
  }

  // ── init ──────────────────────────────────────────────────────────────────

  async function init() {
    let plugins;
    try {
      plugins = await loadPlugins();
    } catch(e) {
      document.getElementById('root').innerHTML =
        '<div class="err-state">Failed to load plugins: ' + esc(e.message) + '</div>';
      return;
    }

    // Focused single-field mode: plugin + field both given
    if (FOCUS_PLUGIN && FOCUS_FIELD) {
      const plugin = plugins.find(p => p.name === FOCUS_PLUGIN);
      if (!plugin) {
        document.getElementById('root').innerHTML =
          '<div class="err-state">Plugin "' + esc(FOCUS_PLUGIN) + '" not found.</div>';
        return;
      }
      document.getElementById('root').innerHTML = renderFocusedCard(plugin);
      return;
    }

    // All-plugins or plugin-highlighted mode
    const ordered = FOCUS_PLUGIN
      ? [...plugins].sort((a, b) => (a.name === FOCUS_PLUGIN ? -1 : b.name === FOCUS_PLUGIN ? 1 : 0))
      : plugins;

    const html = ordered.map(renderPluginCard).join('');
    document.getElementById('root').innerHTML = html || '<div class="loading">No plugins configured.</div>';

    if (FOCUS_PLUGIN) {
      const el = document.getElementById('card_' + FOCUS_PLUGIN);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  init();
</script>
</body>
</html>`;
}
