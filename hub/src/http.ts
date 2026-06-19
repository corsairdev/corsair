import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { PluginWebhookMatchers } from 'corsair/core';
import { matchWebhookPluginAndTenant } from 'corsair/core';
import express, { type Express, type Request, type Response } from 'express';
import { deliverToProject } from './delivery';
import { InMemoryHubStore } from './store';
import type {
	Project,
	ProjectTargets,
	TargetEnvironment,
	TunnelAck,
	TunnelType,
} from './types';

export interface CreateHubAppOptions {
	store?: InMemoryHubStore;
	publicBaseUrl?: string;
	seedDemoProject?: boolean;
	pluginMatchers?: Record<string, PluginWebhookMatchers>;
}

export interface HubApp {
	app: Express;
	store: InMemoryHubStore;
}

const validEnvironments = new Set<TargetEnvironment>([
	'dev',
	'staging',
	'production',
]);
const publicDir = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	'../public',
);

export function createHubApp(options: CreateHubAppOptions = {}): HubApp {
	const app = express();
	const store = options.store ?? new InMemoryHubStore();

	if (options.seedDemoProject ?? true) {
		seedDemoProject(store);
	}

	app.disable('x-powered-by');

	app.post(
		'/hooks/:hubKey',
		express.raw({ limit: '5mb', type: '*/*' }),
		async (req, res) => {
			const hubKey = req.params.hubKey;
			const tenantMatch = store.resolveTenantHubKey(hubKey);
			if (tenantMatch) {
				await relayTenantWebhook(store, req, res, tenantMatch);
				return;
			}

			const project = store.resolveProjectWebhookHubKey(hubKey);
			if (!project) {
				res.status(404).json({ error: 'Unknown webhook hub key' });
				return;
			}

			await relayProjectWebhook(
				store,
				req,
				res,
				project,
				options.pluginMatchers,
			);
		},
	);

	app.use(express.json({ limit: '1mb' }));
	app.use('/assets', express.static(publicDir, { maxAge: '1h' }));

	app.get('/api/status', (_req, res) => {
		res.json({
			ok: true,
			service: 'corsair-hub',
			publicBaseUrl: getPublicBaseUrl(_req, options.publicBaseUrl),
			projects: store.listProjects().length,
			auditEvents: store.listAudit().length,
		});
	});

	app.get('/api/projects', (req, res) => {
		const publicBaseUrl = getPublicBaseUrl(req, options.publicBaseUrl);
		res.json({
			projects: store
				.listProjects()
				.map((project) => serializeProject(project, publicBaseUrl)),
		});
	});

	app.post('/api/projects', (req, res) => {
		const project = store.createProject({
			name:
				typeof req.body?.name === 'string' ? req.body.name : 'Untitled project',
			targets: parseTargets(req.body?.targets),
			preferredEnvironment:
				parseEnvironment(req.body?.preferredEnvironment) ?? 'production',
		});
		res.status(201).json({
			project: serializeProject(
				project,
				getPublicBaseUrl(req, options.publicBaseUrl),
			),
		});
	});

	app.patch('/api/projects/:projectId/targets', (req, res) => {
		const project = store.updateTargets(req.params.projectId, {
			targets: parseTargets(req.body?.targets),
			preferredEnvironment: parseEnvironment(req.body?.preferredEnvironment),
		});
		if (!project) {
			res.status(404).json({ error: 'Project not found' });
			return;
		}
		res.json({
			project: serializeProject(
				project,
				getPublicBaseUrl(req, options.publicBaseUrl),
			),
		});
	});

	app.post('/api/projects/:projectId/tenants', (req, res) => {
		const tenantId =
			typeof req.body?.tenantId === 'string' ? req.body.tenantId.trim() : '';
		if (!tenantId) {
			res.status(400).json({ error: 'tenantId is required' });
			return;
		}

		const tenantHubKey = store.registerTenant(req.params.projectId, tenantId);
		if (!tenantHubKey) {
			res.status(404).json({ error: 'Project not found' });
			return;
		}

		const publicBaseUrl = getPublicBaseUrl(req, options.publicBaseUrl);
		res.status(201).json({
			tenantHubKey,
			webhookUrl: `${publicBaseUrl}/hooks/${tenantHubKey.key}`,
		});
	});

	app.get('/api/projects/:projectId/audit', (req, res) => {
		const project = store.getProject(req.params.projectId);
		if (!project) {
			res.status(404).json({ error: 'Project not found' });
			return;
		}
		res.json({ events: store.listAudit(project.id) });
	});

	app.post('/api/projects/:projectId/test-delivery', async (req, res) => {
		const project = store.getProject(req.params.projectId);
		if (!project) {
			res.status(404).json({ error: 'Project not found' });
			return;
		}

		const result = await deliverToProject(project, 'run', {
			message: 'Hello from Corsair Hub',
			sentAt: new Date().toISOString(),
		});
		store.recordAudit({
			projectId: project.id,
			type: 'run',
			status: result.ack.status === 'ok' ? 'success' : 'failed',
			environment: result.environment,
			targetUrl: result.targetUrl,
			statusCode: result.statusCode,
			error: result.ack.error,
		});
		res.status(result.ack.status === 'ok' ? 200 : 502).json(result);
	});

	app.get('/oauth/callback/:hubKey', async (req, res) => {
		const project = store.resolveProjectHubKey(req.params.hubKey);
		if (!project) {
			renderResultPage(
				res.status(404),
				'Unknown OAuth URL',
				'This project hub key was not found.',
			);
			return;
		}

		const redirectUri = `${getPublicBaseUrl(req, options.publicBaseUrl)}${req.path}`;
		const payload = {
			code: asString(req.query.code),
			state: asString(req.query.state),
			error: asString(req.query.error),
			errorDescription: asString(req.query.error_description),
			redirectUri,
		};

		const result = await deliverToProject(project, 'oauth.callback', payload);
		store.recordAudit({
			projectId: project.id,
			type: 'oauth.callback',
			status: result.ack.status === 'ok' ? 'success' : 'failed',
			environment: result.environment,
			targetUrl: result.targetUrl,
			statusCode: result.statusCode,
			error: result.ack.error,
		});

		if (result.ack.status === 'ok') {
			renderResultPage(
				res,
				'Connected',
				'You can close this tab and return to your app.',
			);
			return;
		}

		renderResultPage(
			res.status(502),
			'Connection needs attention',
			result.ack.error ??
				'The developer target did not accept the OAuth callback.',
		);
	});

	app.get(['/auth/:token', '/permissions/:token', '/'], (_req, res) => {
		res.sendFile(path.join(publicDir, 'index.html'));
	});

	app.post('/api/auth/:token/credentials', async (req, res) => {
		const project = resolveProjectForToken(
			store,
			req.params.token,
			req.body?.projectHubKey,
		);
		if (!project) {
			res.status(404).json({ error: 'Project hub key is required or invalid' });
			return;
		}

		await deliverUiAction(store, res, project, 'auth.credentials', {
			token: req.params.token,
			plugin: req.body?.plugin,
			tenantId: req.body?.tenantId,
			credentials: req.body?.credentials,
		});
	});

	app.post('/api/permissions/:token/:decision', async (req, res) => {
		const decision = req.params.decision;
		if (decision !== 'approve' && decision !== 'deny') {
			res.status(404).json({ error: 'Unknown permission decision' });
			return;
		}

		const project = resolveProjectForToken(
			store,
			req.params.token,
			req.body?.projectHubKey,
		);
		if (!project) {
			res.status(404).json({ error: 'Project hub key is required or invalid' });
			return;
		}

		const type: TunnelType =
			decision === 'approve' ? 'permission.approve' : 'permission.deny';
		await deliverUiAction(store, res, project, type, {
			token: req.params.token,
		});
	});

	return { app, store };
}

async function relayTenantWebhook(
	store: InMemoryHubStore,
	req: Request,
	res: Response,
	match: { project: Project; tenantId: string },
) {
	const body = Buffer.isBuffer(req.body) ? req.body : Buffer.from('');
	const payload = {
		headers: normalizeHeaders(req.headers),
		body: body.toString('utf8'),
		bodyBase64: body.toString('base64'),
		bodyEncoding: 'utf8',
		query: {
			...req.query,
			tenantId: match.tenantId,
		},
		tenantId: match.tenantId,
	};

	const result = await deliverToProject(match.project, 'webhook', payload);
	store.recordAudit({
		projectId: match.project.id,
		tenantId: match.tenantId,
		type: 'webhook',
		status: result.ack.status === 'ok' ? 'success' : 'failed',
		environment: result.environment,
		targetUrl: result.targetUrl,
		statusCode: result.statusCode,
		error: result.ack.error,
	});

	sendWebhookResponse(res, result.ack);
}

async function relayProjectWebhook(
	store: InMemoryHubStore,
	req: Request,
	res: Response,
	project: Project,
	pluginMatchers?: Record<string, PluginWebhookMatchers>,
) {
	const body = Buffer.isBuffer(req.body) ? req.body : Buffer.from('');
	const rawBody = body.toString('utf8');
	const headers = normalizeHeaders(req.headers);
	const webhookRequest = {
		headers,
		body: parseWebhookBody(rawBody, headers['content-type']),
		rawBody,
		query: req.query as Record<string, string | string[] | undefined>,
	};

	const match = pluginMatchers
		? matchWebhookPluginAndTenant(pluginMatchers, webhookRequest)
		: null;

	const payload = {
		headers,
		body: rawBody,
		bodyBase64: body.toString('base64'),
		bodyEncoding: 'utf8',
		query: req.query,
		plugin: match?.plugin,
		linkType: match?.tenantMatch.linkType,
		externalId: match?.tenantMatch.externalId,
	};

	const result = await deliverToProject(project, 'webhook', payload);
	store.recordAudit({
		projectId: project.id,
		plugin: match?.plugin,
		type: 'webhook',
		status: result.ack.status === 'ok' ? 'success' : 'failed',
		environment: result.environment,
		targetUrl: result.targetUrl,
		statusCode: result.statusCode,
		error: result.ack.error,
	});

	sendWebhookResponse(res, result.ack);
}

function parseWebhookBody(
	rawBody: string,
	contentType: string | undefined,
): unknown {
	if (!rawBody) return undefined;

	if (contentType?.includes('application/json')) {
		try {
			return JSON.parse(rawBody) as unknown;
		} catch {
			return rawBody;
		}
	}

	return rawBody;
}

async function deliverUiAction(
	store: InMemoryHubStore,
	res: Response,
	project: Project,
	type: TunnelType,
	payload: unknown,
) {
	const result = await deliverToProject(project, type, payload);
	store.recordAudit({
		projectId: project.id,
		type,
		status: result.ack.status === 'ok' ? 'success' : 'failed',
		environment: result.environment,
		targetUrl: result.targetUrl,
		statusCode: result.statusCode,
		error: result.ack.error,
	});
	res.status(result.ack.status === 'ok' ? 200 : 502).json(result);
}

function sendWebhookResponse(res: Response, ack: TunnelAck) {
	if (ack.status !== 'ok') {
		res.status(502).json({
			error: ack.error ?? 'Webhook delivery failed',
			retryable: ack.retryable ?? true,
		});
		return;
	}

	const webhookResponse = ack.webhookResponse;
	if (!webhookResponse) {
		res.status(204).end();
		return;
	}

	for (const [key, value] of Object.entries(webhookResponse.headers ?? {})) {
		res.setHeader(key, value);
	}

	const status = webhookResponse.status ?? 200;
	if (
		webhookResponse.body &&
		typeof webhookResponse.body === 'object' &&
		!Buffer.isBuffer(webhookResponse.body)
	) {
		res.status(status).json(webhookResponse.body);
		return;
	}

	res.status(status).send(webhookResponse.body ?? '');
}

function seedDemoProject(store: InMemoryHubStore) {
	if (store.listProjects().length > 0) return;
	const project = store.createProject({
		name: 'Local demo project',
		targets: {
			dev: 'http://127.0.0.1:3000/api/corsair',
		},
		preferredEnvironment: 'dev',
	});
	store.registerTenant(project.id, 'user_123');
}

function normalizeHeaders(headers: Request['headers']): Record<string, string> {
	const result: Record<string, string> = {};
	for (const [key, value] of Object.entries(headers)) {
		if (key === 'host' || key === 'content-length') continue;
		if (Array.isArray(value)) result[key] = value.join(', ');
		else if (typeof value === 'string') result[key] = value;
	}
	return result;
}

function serializeProject(project: Project, publicBaseUrl: string) {
	const activeProjectHubKey = project.hubKeys.find((key) => !key.revokedAt);
	const activeWebhookHubKey = project.webhookHubKeys.find(
		(key) => !key.revokedAt,
	);
	return {
		...project,
		oauthRedirectUrl: activeProjectHubKey
			? `${publicBaseUrl}/oauth/callback/${activeProjectHubKey.key}`
			: null,
		webhookUrl: activeWebhookHubKey
			? `${publicBaseUrl}/hooks/${activeWebhookHubKey.key}`
			: null,
		tenantHubKeys: project.tenantHubKeys.map((tenantHubKey) => ({
			...tenantHubKey,
			webhookUrl: `${publicBaseUrl}/hooks/${tenantHubKey.key}`,
		})),
	};
}

function parseTargets(value: unknown): ProjectTargets | undefined {
	if (!value || typeof value !== 'object') return undefined;
	const input = value as Record<string, unknown>;
	const targets: ProjectTargets = {};
	for (const environment of validEnvironments) {
		const target = input[environment];
		if (typeof target === 'string')
			targets[environment] = target.trim() || undefined;
	}
	return targets;
}

function parseEnvironment(value: unknown): TargetEnvironment | undefined {
	return typeof value === 'string' &&
		validEnvironments.has(value as TargetEnvironment)
		? (value as TargetEnvironment)
		: undefined;
}

function getPublicBaseUrl(req: Request, configured?: string): string {
	if (configured) return configured.replace(/\/$/, '');
	const protocol = req.get('x-forwarded-proto') ?? req.protocol;
	const host = req.get('x-forwarded-host') ?? req.get('host') ?? 'localhost';
	return `${protocol}://${host}`;
}

function asString(value: unknown): string | undefined {
	return typeof value === 'string' ? value : undefined;
}

function resolveProjectForToken(
	store: InMemoryHubStore,
	token: string,
	projectHubKeyInput: unknown,
) {
	const decoded = decodeToken(token);
	const projectHubKey =
		typeof decoded?.hubKey === 'string'
			? decoded.hubKey
			: typeof decoded?.projectHubKey === 'string'
				? decoded.projectHubKey
				: typeof projectHubKeyInput === 'string'
					? projectHubKeyInput
					: undefined;

	return projectHubKey ? store.resolveProjectHubKey(projectHubKey) : undefined;
}

function decodeToken(token: string): Record<string, unknown> | undefined {
	try {
		const normalized = token.replace(/-/g, '+').replace(/_/g, '/');
		const json = Buffer.from(normalized, 'base64').toString('utf8');
		const parsed = JSON.parse(json);
		return parsed && typeof parsed === 'object' ? parsed : undefined;
	} catch {
		return undefined;
	}
}

function renderResultPage(res: Response, title: string, message: string) {
	res.type('html').send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} - Corsair Hub</title>
  <link rel="stylesheet" href="/assets/styles.css">
</head>
<body class="result-page">
  <main class="result-panel">
    <p class="eyebrow">Corsair Hub</p>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(message)}</p>
    <a class="button secondary" href="/">Open dashboard</a>
  </main>
</body>
</html>`);
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}
