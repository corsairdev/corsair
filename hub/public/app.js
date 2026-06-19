const state = {
	status: null,
	projects: [],
	selectedProjectId: null,
	audit: [],
	toast: '',
};

const app = document.querySelector('#app');
const route = window.location.pathname;

init().catch((error) => showToast(error.message));

async function init() {
	if (route.startsWith('/permissions/')) {
		renderPermissionPage(route.split('/').pop());
		return;
	}

	if (route.startsWith('/auth/')) {
		renderAuthPage(route.split('/').pop());
		return;
	}

	await refreshDashboard();
}

async function refreshDashboard() {
	const [status, projects] = await Promise.all([
		api('/api/status'),
		api('/api/projects'),
	]);
	state.status = status;
	state.projects = projects.projects;
	if (
		!state.selectedProjectId ||
		!state.projects.some((project) => project.id === state.selectedProjectId)
	) {
		state.selectedProjectId = state.projects[0]?.id ?? null;
	}
	await loadAudit();
	renderDashboard();
}

async function loadAudit() {
	state.audit = [];
	if (!state.selectedProjectId) return;
	const response = await api(`/api/projects/${state.selectedProjectId}/audit`);
	state.audit = response.events;
}

function renderDashboard() {
	const selected = getSelectedProject();
	app.innerHTML = `
		<div class="app-shell">
			<aside class="sidebar">
				<div class="brand">
					<div class="brand-mark">C</div>
					<div>
						<h1>Corsair Hub</h1>
						<span>relay and hosted UI</span>
					</div>
				</div>
				<div class="sidebar-section">
					<h2>Projects</h2>
					<div class="project-list">
						${state.projects.map(projectButton).join('')}
					</div>
				</div>
				<div class="sidebar-section">
					<h2>Create</h2>
					<form class="stack" data-action="create-project">
						<div class="field">
							<label for="project-name">Project name</label>
							<input id="project-name" name="name" placeholder="Acme app" />
						</div>
						<button class="button" type="submit">Create project</button>
					</form>
				</div>
			</aside>
			<main class="main">
				<div class="topbar">
					<div>
						<p class="eyebrow">hub.corsair.dev</p>
						<h2>${escapeHtml(selected?.name ?? 'No project yet')}</h2>
						<p>Route OAuth callbacks, webhooks, auth forms, and permission decisions through one signed POST to the developer app.</p>
					</div>
					<div class="status-pill"><span class="status-dot"></span>${escapeHtml(state.status?.projects ?? 0)} project${state.status?.projects === 1 ? '' : 's'}</div>
				</div>
				${selected ? renderProject(selected) : '<div class="empty">Create a project to generate hub URLs.</div>'}
			</main>
		</div>
		${state.toast ? `<div class="toast">${escapeHtml(state.toast)}</div>` : ''}
	`;

	bindDashboardEvents();
}

function projectButton(project) {
	const active = project.id === state.selectedProjectId ? ' active' : '';
	return `
		<button class="project-button${active}" data-project-id="${escapeHtml(project.id)}">
			<strong>${escapeHtml(project.name)}</strong>
			<span>${escapeHtml(project.id)}</span>
		</button>
	`;
}

function renderProject(project) {
	return `
		<div class="grid">
			<section class="panel">
				<div class="panel-header">
					<div>
						<h3>Delivery targets</h3>
						<p>Hub chooses the preferred target first, then falls back to another configured environment.</p>
					</div>
				</div>
				<div class="panel-body">
					<form class="stack" data-action="save-targets">
						<div class="form-grid">
							<div class="field">
								<label for="target-env">Preferred</label>
								<select id="target-env" name="preferredEnvironment">
									${environmentOption('dev', project.preferredEnvironment)}
									${environmentOption('staging', project.preferredEnvironment)}
									${environmentOption('production', project.preferredEnvironment)}
								</select>
							</div>
							<div class="field">
								<label for="target-dev">Dev target</label>
								<input id="target-dev" name="dev" value="${escapeAttr(project.targets.dev ?? '')}" placeholder="http://127.0.0.1:3000/api/corsair" />
							</div>
							<div class="field">
								<label for="target-staging">Staging target</label>
								<input id="target-staging" name="staging" value="${escapeAttr(project.targets.staging ?? '')}" placeholder="https://staging.example.com/api/corsair" />
							</div>
							<div class="field">
								<label for="target-production">Production target</label>
								<input id="target-production" name="production" value="${escapeAttr(project.targets.production ?? '')}" placeholder="https://api.example.com/api/corsair" />
							</div>
						</div>
						<div class="button-row">
							<button class="button" type="submit">Save targets</button>
							<button class="button secondary" type="button" data-action="test-delivery">Send test delivery</button>
						</div>
					</form>
				</div>
			</section>

			<section class="panel">
				<div class="panel-header">
					<div>
						<h3>Project secrets</h3>
						<p>Use the signing secret to verify hub deliveries in the developer app.</p>
					</div>
				</div>
				<div class="panel-body stack">
					${copyBox('API key', project.apiKey)}
					${copyBox('Signing secret', project.signingSecret)}
				</div>
			</section>

			<section class="panel">
				<div class="panel-header">
					<div>
						<h3>Hub URLs</h3>
						<p>Copy the OAuth URL into provider consoles. Use one project webhook URL for all tenants.</p>
					</div>
				</div>
				<div class="panel-body stack">
					${copyBox('OAuth redirect URL', project.oauthRedirectUrl ?? '')}
					${copyBox('Project webhook URL', project.webhookUrl ?? '')}
					<details>
						<summary>Legacy per-tenant webhook URLs</summary>
						<form class="button-row" data-action="register-tenant">
							<div class="field" style="flex: 1 1 220px;">
								<label for="tenant-id">Tenant ID</label>
								<input id="tenant-id" name="tenantId" placeholder="user_123" />
							</div>
							<button class="button secondary" type="submit">Register tenant</button>
						</form>
						${renderTenantTable(project)}
					</details>
				</div>
			</section>

			<section class="panel">
				<div class="panel-header">
					<div>
						<h3>Audit log</h3>
						<p>Operational metadata only: type, target, tenant, timestamp, and outcome.</p>
					</div>
					<button class="button secondary" type="button" data-action="refresh-audit">Refresh</button>
				</div>
				<div class="panel-body">
					${renderAuditTable()}
				</div>
			</section>
		</div>
	`;
}

function environmentOption(value, selected) {
	return `<option value="${value}" ${value === selected ? 'selected' : ''}>${value}</option>`;
}

function copyBox(label, value) {
	return `
		<div class="url-box">
			<div class="field"><label>${escapeHtml(label)}</label></div>
			<div class="copy-row">
				<div class="code">${escapeHtml(value || 'Not available')}</div>
				<button class="button secondary" type="button" data-copy="${escapeAttr(value)}">Copy</button>
			</div>
		</div>
	`;
}

function renderTenantTable(project) {
	if (!project.tenantHubKeys.length) {
		return '<div class="empty">No tenant webhook URLs yet.</div>';
	}

	return `
		<table class="table">
			<thead><tr><th>Tenant</th><th>Webhook URL</th><th></th></tr></thead>
			<tbody>
				${project.tenantHubKeys
					.map(
						(tenant) => `
							<tr>
								<td>${escapeHtml(tenant.tenantId)}</td>
								<td><div class="code">${escapeHtml(tenant.webhookUrl)}</div></td>
								<td><button class="button secondary" type="button" data-copy="${escapeAttr(tenant.webhookUrl)}">Copy</button></td>
							</tr>
						`,
					)
					.join('')}
			</tbody>
		</table>
	`;
}

function renderAuditTable() {
	if (!state.audit.length) {
		return '<div class="empty">No deliveries yet.</div>';
	}

	return `
		<table class="table">
			<thead><tr><th>Time</th><th>Type</th><th>Status</th><th>Target</th><th>Tenant</th></tr></thead>
			<tbody>
				${state.audit
					.map(
						(event) => `
							<tr>
								<td>${escapeHtml(new Date(event.timestamp).toLocaleString())}</td>
								<td>${escapeHtml(event.type)}</td>
								<td>${escapeHtml(event.status)}${event.statusCode ? ` (${event.statusCode})` : ''}${event.error ? `<br>${escapeHtml(event.error)}` : ''}</td>
								<td>${escapeHtml(event.environment ?? '')}<br>${escapeHtml(event.targetUrl ?? '')}</td>
								<td>${escapeHtml(event.tenantId ?? '')}</td>
							</tr>
						`,
					)
					.join('')}
			</tbody>
		</table>
	`;
}

function bindDashboardEvents() {
	document.querySelectorAll('[data-project-id]').forEach((button) => {
		button.addEventListener('click', async () => {
			state.selectedProjectId = button.dataset.projectId;
			await loadAudit();
			renderDashboard();
		});
	});

	document
		.querySelector('[data-action="create-project"]')
		?.addEventListener('submit', async (event) => {
			event.preventDefault();
			const data = new FormData(event.currentTarget);
			const response = await api('/api/projects', {
				method: 'POST',
				body: {
					name: data.get('name'),
					targets: {},
					preferredEnvironment: 'production',
				},
			});
			state.selectedProjectId = response.project.id;
			showToast('Project created');
			await refreshDashboard();
		});

	document
		.querySelector('[data-action="save-targets"]')
		?.addEventListener('submit', async (event) => {
			event.preventDefault();
			const project = getSelectedProject();
			if (!project) return;
			const data = new FormData(event.currentTarget);
			await api(`/api/projects/${project.id}/targets`, {
				method: 'PATCH',
				body: {
					preferredEnvironment: data.get('preferredEnvironment'),
					targets: {
						dev: data.get('dev'),
						staging: data.get('staging'),
						production: data.get('production'),
					},
				},
			});
			showToast('Targets saved');
			await refreshDashboard();
		});

	document
		.querySelector('[data-action="register-tenant"]')
		?.addEventListener('submit', async (event) => {
			event.preventDefault();
			const project = getSelectedProject();
			if (!project) return;
			const data = new FormData(event.currentTarget);
			await api(`/api/projects/${project.id}/tenants`, {
				method: 'POST',
				body: { tenantId: data.get('tenantId') },
			});
			showToast('Tenant URL generated');
			await refreshDashboard();
		});

	document
		.querySelector('[data-action="test-delivery"]')
		?.addEventListener('click', async () => {
			const project = getSelectedProject();
			if (!project) return;
			try {
				await api(`/api/projects/${project.id}/test-delivery`, {
					method: 'POST',
					body: {},
				});
				showToast('Test delivery accepted');
			} catch (error) {
				showToast(error.message);
			}
			await refreshDashboard();
		});

	document
		.querySelector('[data-action="refresh-audit"]')
		?.addEventListener('click', async () => {
			await loadAudit();
			renderDashboard();
		});

	document.querySelectorAll('[data-copy]').forEach((button) => {
		button.addEventListener('click', async () => {
			await navigator.clipboard.writeText(button.dataset.copy);
			showToast('Copied');
		});
	});
}

function renderPermissionPage(token) {
	app.innerHTML = `
		<main class="result-page">
			<section class="result-panel stack">
				<div>
					<p class="eyebrow">Corsair permissions</p>
					<h1>Review action</h1>
					<p>This lightweight screen forwards the decision to the project target. Token metadata loading can be backed by the SDK next.</p>
				</div>
				<form class="stack" data-action="permission">
					<div class="field">
						<label for="permission-token">Token</label>
						<input id="permission-token" value="${escapeAttr(token)}" readonly />
					</div>
					<div class="field">
						<label for="permission-hub-key">Project hub key</label>
						<input id="permission-hub-key" name="projectHubKey" placeholder="hk_..." />
					</div>
					<div class="button-row">
						<button class="button" value="approve" name="decision" type="submit">Approve</button>
						<button class="button danger" value="deny" name="decision" type="submit">Deny</button>
						<a class="button secondary" href="/">Dashboard</a>
					</div>
				</form>
			</section>
		</main>
		${state.toast ? `<div class="toast">${escapeHtml(state.toast)}</div>` : ''}
	`;

	document
		.querySelector('[data-action="permission"]')
		.addEventListener('submit', async (event) => {
			event.preventDefault();
			const submitter = event.submitter;
			const data = new FormData(event.currentTarget);
			try {
				await api(
					`/api/permissions/${encodeURIComponent(token)}/${submitter.value}`,
					{
						method: 'POST',
						body: { projectHubKey: data.get('projectHubKey') },
					},
				);
				showToast(`Permission ${submitter.value}d`);
			} catch (error) {
				showToast(error.message);
			}
			renderPermissionPage(token);
		});
}

function renderAuthPage(token) {
	app.innerHTML = `
		<main class="result-page">
			<section class="result-panel stack">
				<div>
					<p class="eyebrow">Corsair auth</p>
					<h1>Connect credentials</h1>
					<p>Submit API credentials through the signed tunnel envelope. OAuth links still complete through the project callback URL.</p>
				</div>
				<form class="stack" data-action="auth">
					<div class="form-grid">
						<div class="field">
							<label for="auth-plugin">Plugin</label>
							<input id="auth-plugin" name="plugin" placeholder="resend" />
						</div>
						<div class="field">
							<label for="auth-tenant">Tenant ID</label>
							<input id="auth-tenant" name="tenantId" placeholder="user_123" />
						</div>
					</div>
					<div class="field">
						<label for="auth-hub-key">Project hub key</label>
						<input id="auth-hub-key" name="projectHubKey" placeholder="hk_..." />
					</div>
					<div class="field">
						<label for="auth-credentials">Credentials JSON</label>
						<textarea id="auth-credentials" name="credentials" placeholder='{"apiKey":"..."}'></textarea>
					</div>
					<div class="button-row">
						<button class="button" type="submit">Submit credentials</button>
						<a class="button secondary" href="/">Dashboard</a>
					</div>
				</form>
			</section>
		</main>
		${state.toast ? `<div class="toast">${escapeHtml(state.toast)}</div>` : ''}
	`;

	document
		.querySelector('[data-action="auth"]')
		.addEventListener('submit', async (event) => {
			event.preventDefault();
			const data = new FormData(event.currentTarget);
			let credentials = data.get('credentials');
			try {
				credentials = credentials ? JSON.parse(credentials) : {};
				await api(`/api/auth/${encodeURIComponent(token)}/credentials`, {
					method: 'POST',
					body: {
						projectHubKey: data.get('projectHubKey'),
						plugin: data.get('plugin'),
						tenantId: data.get('tenantId'),
						credentials,
					},
				});
				showToast('Credentials submitted');
			} catch (error) {
				showToast(error.message);
			}
			renderAuthPage(token);
		});
}

async function api(path, options = {}) {
	const response = await fetch(path, {
		method: options.method ?? 'GET',
		headers: options.body ? { 'content-type': 'application/json' } : undefined,
		body: options.body ? JSON.stringify(options.body) : undefined,
	});
	const text = await response.text();
	const json = text ? JSON.parse(text) : {};
	if (!response.ok) {
		throw new Error(
			json.error ?? json.ack?.error ?? `Request failed with ${response.status}`,
		);
	}
	return json;
}

function getSelectedProject() {
	return state.projects.find(
		(project) => project.id === state.selectedProjectId,
	);
}

function showToast(message) {
	state.toast = message;
	clearTimeout(showToast.timeout);
	showToast.timeout = setTimeout(() => {
		state.toast = '';
		if (route === '/') renderDashboard();
	}, 2600);
	if (route === '/') renderDashboard();
}

function escapeHtml(value) {
	return String(value ?? '')
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#039;');
}

function escapeAttr(value) {
	return escapeHtml(value).replaceAll('`', '&#096;');
}
