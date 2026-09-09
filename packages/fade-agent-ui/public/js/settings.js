/* Full Settings panel — covers AI, Integration & YouTube keys */

const overlay = document.getElementById('settings-overlay');
const btnOpen = document.getElementById('btn-settings');
const btnClose = document.getElementById('settings-close');
const btnSave = document.getElementById('settings-save');
const statusEl = document.getElementById('settings-status');

/* ── field definitions grouped by section ───────────────────────── */
const SECTIONS = [
	{
		title: 'AI Provider',
		fields: [
			{
				key: 'provider',
				label: 'Provider',
				type: 'select',
				options: ['google', 'openai', 'anthropic', 'groq', 'tabi'],
				mask: false,
			},
			{
				key: 'model',
				label: 'Model name',
				type: 'text',
				placeholder: 'e.g. gemini-1.5-flash, gpt-4o, claude-opus-4-5',
				mask: false,
			},
		],
	},
	{
		title: 'API Keys',
		fields: [
			{
				key: 'googleApiKey',
				label: 'Google API Key',
				type: 'password',
				placeholder: 'AIza… or AQ.…',
				mask: true,
			},
			{
				key: 'openaiApiKey',
				label: 'OpenAI API Key',
				type: 'password',
				placeholder: 'sk-…',
				mask: true,
			},
			{
				key: 'anthropicApiKey',
				label: 'Anthropic API Key',
				type: 'password',
				placeholder: 'sk-ant-…',
				mask: true,
			},
			{
				key: 'groqApiKey',
				label: 'Groq API Key',
				type: 'password',
				placeholder: 'gsk_…',
				mask: true,
			},
			{
				key: 'tabiApiKey',
				label: 'Tabi API Key',
				type: 'password',
				placeholder: 'sk-…',
				mask: true,
			},
			{
				key: 'tabiBaseUrl',
				label: 'Tabi Base URL',
				type: 'text',
				placeholder: 'https://tabitoken.com/v1',
				mask: false,
			},
		],
	},
	{
		title: 'Integrations',
		fields: [
			{
				key: 'stabilityApiKey',
				label: 'Stability AI Key',
				type: 'password',
				placeholder: 'sk-…',
				mask: true,
			},
			{
				key: 'phantomBusterApiKey',
				label: 'PhantomBuster API Key',
				type: 'password',
				placeholder: 'your-pb-key',
				mask: true,
			},
		],
	},
	{
		title: 'YouTube',
		fields: [
			{
				key: 'youtubeClientId',
				label: 'YouTube Client ID',
				type: 'text',
				placeholder: '…apps.googleusercontent.com',
				mask: false,
			},
			{
				key: 'youtubeClientSecret',
				label: 'YouTube Client Secret',
				type: 'password',
				placeholder: 'GOCSPX-…',
				mask: true,
			},
		],
	},
];

/* ── render modal HTML ───────────────────────────────────────────── */
function buildModal() {
	const body = document.getElementById('settings-body');
	if (!body) return;
	body.innerHTML = '';
	for (const sec of SECTIONS) {
		const wrap = document.createElement('div');
		wrap.className = 's-section';
		wrap.innerHTML = `<p class="s-section-title">${sec.title}</p>`;
		for (const f of sec.fields) {
			const grp = document.createElement('div');
			grp.className = 's-group';
			if (f.type === 'select') {
				grp.innerHTML = `
					<label for="s-${f.key}">${f.label}</label>
					<select id="s-${f.key}">
						${f.options.map((o) => `<option value="${o}">${o}</option>`).join('')}
					</select>`;
			} else {
				grp.innerHTML = `
					<label for="s-${f.key}">${f.label}</label>
					<input id="s-${f.key}" type="${f.type}" placeholder="${f.placeholder ?? ''}" autocomplete="off" />`;
			}
			wrap.appendChild(grp);
		}
		body.appendChild(wrap);
	}
}

/* ── load current values from server ────────────────────────────── */
async function loadSettings() {
	try {
		const d = await fetch('/api/settings').then((r) => r.json());
		for (const sec of SECTIONS) {
			for (const f of sec.fields) {
				const el = document.getElementById(`s-${f.key}`);
				if (!el) continue;
				const val = d[f.key] ?? '';
				if (f.type === 'select') {
					el.value = val;
				} else if (f.mask && val) {
					el.placeholder = val; // show ••••xxxx as placeholder
					el.value = '';
				} else {
					el.value = val;
				}
			}
		}
	} catch {
		/* server may not be ready */
	}
}

/* ── save ────────────────────────────────────────────────────────── */
async function saveSettings() {
	const body = {};
	for (const sec of SECTIONS) {
		for (const f of sec.fields) {
			const el = document.getElementById(`s-${f.key}`);
			if (!el) continue;
			const val = el.value.trim();
			if (val) body[f.key] = val;
		}
	}
	try {
		btnSave.disabled = true;
		statusEl.textContent = 'Saving…';
		const d = await fetch('/api/settings', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		}).then((r) => r.json());
		statusEl.textContent = d.ok
			? `✅ Saved — ${d.provider || 'google'} / ${d.model}`
			: `❌ ${d.error}`;
		statusEl.style.color = d.ok ? '#34d399' : '#f87171';
		if (d.ok) {
			await loadSettings();
			setTimeout(closeSettings, 1500);
		}
	} catch (e) {
		statusEl.textContent = `❌ ${e.message}`;
		statusEl.style.color = '#f87171';
	} finally {
		btnSave.disabled = false;
	}
}

function openSettings() {
	overlay.classList.add('open');
	loadSettings();
}
function closeSettings() {
	overlay.classList.remove('open');
	statusEl.textContent = '';
}

btnOpen?.addEventListener('click', openSettings);
btnClose?.addEventListener('click', closeSettings);
btnSave?.addEventListener('click', saveSettings);
overlay?.addEventListener('click', (e) => {
	if (e.target === overlay) closeSettings();
});

// Keyboard shortcut: Ctrl+, opens settings
document.addEventListener('keydown', (e) => {
	if ((e.ctrlKey || e.metaKey) && e.key === ',') {
		e.preventDefault();
		openSettings();
	}
});

buildModal();
