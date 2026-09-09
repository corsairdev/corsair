import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HumanMessage } from '@langchain/core/messages';
import cors from 'cors';
import express from 'express';
import multer from 'multer';
import {
	agentConfig,
	getAgent,
	resetAgent,
	setFadePort,
	setPhantomBusterKey,
} from '../fade-agent/index.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, 'public');
const SETTINGS_FILE = path.join(__dirname, '.settings.json');

const FADE_PORT = Number(process.env['FADE_PORT'] ?? 8000);
const UI_PORT = Number(process.env['UI_PORT'] ?? 3099);

// ── Persistent settings ──────────────────────────────────────────────────────
// All writable keys with their env-var fallback
const ALL_SETTING_KEYS = [
	'provider',
	'model',
	'googleApiKey',
	'openaiApiKey',
	'anthropicApiKey',
	'groqApiKey',
	'tabiApiKey',
	'tabiBaseUrl',
	'stabilityApiKey',
	'phantomBusterApiKey',
	'youtubeClientId',
	'youtubeClientSecret',
] as const;
type SettingKey = (typeof ALL_SETTING_KEYS)[number];

/** In-memory runtime config, initialised from env then overridden by .settings.json */
const runtimeConfig: Record<SettingKey, string> = {
	provider: agentConfig.provider,
	model: agentConfig.model,
	googleApiKey: agentConfig.googleApiKey,
	openaiApiKey: agentConfig.openaiApiKey,
	anthropicApiKey: agentConfig.anthropicApiKey,
	groqApiKey: agentConfig.groqApiKey,
	tabiApiKey: agentConfig.tabiApiKey,
	tabiBaseUrl: agentConfig.tabiBaseUrl,
	stabilityApiKey: process.env['STABILITY_API_KEY'] ?? '',
	phantomBusterApiKey: process.env['PHANTOMBUSTER_API_KEY'] ?? '',
	youtubeClientId: process.env['YOUTUBE_CLIENT_ID'] ?? '',
	youtubeClientSecret: process.env['YOUTUBE_CLIENT_SECRET'] ?? '',
};

function loadPersistedSettings() {
	try {
		if (!fs.existsSync(SETTINGS_FILE)) return;
		const saved = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8')) as Partial<
			Record<SettingKey, string>
		>;
		for (const k of ALL_SETTING_KEYS) {
			if (saved[k] !== undefined && saved[k] !== '')
				runtimeConfig[k] = saved[k]!;
		}
		console.log('[settings] Loaded persisted settings from .settings.json');
	} catch {
		/* ignore corrupt file */
	}
}

function applyToAgentConfig() {
	(agentConfig as Record<string, string>).provider = runtimeConfig.provider;
	(agentConfig as Record<string, string>).model = runtimeConfig.model;
	(agentConfig as Record<string, string>).googleApiKey =
		runtimeConfig.googleApiKey;
	(agentConfig as Record<string, string>).openaiApiKey =
		runtimeConfig.openaiApiKey;
	(agentConfig as Record<string, string>).anthropicApiKey =
		runtimeConfig.anthropicApiKey;
	(agentConfig as Record<string, string>).groqApiKey = runtimeConfig.groqApiKey;
	(agentConfig as Record<string, string>).tabiApiKey = runtimeConfig.tabiApiKey;
	(agentConfig as Record<string, string>).tabiBaseUrl =
		runtimeConfig.tabiBaseUrl;
	if (runtimeConfig.phantomBusterApiKey)
		setPhantomBusterKey(runtimeConfig.phantomBusterApiKey);
}

function saveSettings() {
	try {
		fs.writeFileSync(
			SETTINGS_FILE,
			JSON.stringify(runtimeConfig, null, 2),
			'utf8',
		);
	} catch {}
}

// Boot: load file → apply to agent
loadPersistedSettings();
applyToAgentConfig();

setFadePort(FADE_PORT);
if (runtimeConfig.phantomBusterApiKey)
	setPhantomBusterKey(runtimeConfig.phantomBusterApiKey);

const FADE_BASE = `http://localhost:${FADE_PORT}`;

async function fadeFetch(
	method: string,
	p: string,
	body?: unknown,
): Promise<unknown> {
	try {
		const r = await fetch(`${FADE_BASE}${p}`, {
			method,
			headers: body ? { 'Content-Type': 'application/json' } : {},
			body: body ? JSON.stringify(body) : undefined,
		});
		const json = await r.json();
		if (!r.ok)
			throw new Error(json?.detail ?? json?.error ?? `HTTP ${r.status}`);
		return json;
	} catch (e: unknown) {
		const msg = e instanceof Error ? e.message : String(e);
		if (msg.includes('ECONNREFUSED') || msg.includes('fetch failed')) {
			throw new Error(
				`Fade backend is offline (port ${FADE_PORT}). Start it first.`,
			);
		}
		throw e;
	}
}

const fadeGet = <T>(p: string) => fadeFetch('GET', p) as Promise<T>;
const fadePost = <T>(p: string, body: unknown) =>
	fadeFetch('POST', p, body) as Promise<T>;

const upload = multer({ dest: path.join(__dirname, '.uploads') });
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(PUBLIC));

// Connectivity check
app.get('/api/health', async (_req, res) => {
	try {
		await fetch(`${FADE_BASE}/health`, { signal: AbortSignal.timeout(2000) });
		res.json({ fadeOnline: true, fadePort: FADE_PORT });
	} catch {
		res.json({ fadeOnline: false, fadePort: FADE_PORT });
	}
});

// In-memory thread
const threadMessages: { role: 'user' | 'assistant'; content: string }[] = [];

// SSE event bus (asset change notifications)
const sseClients = new Set<import('express').Response>();

function broadcastAssetChange() {
	for (const client of sseClients) {
		client.write('event: asset:changed\ndata: {}\n\n');
	}
}

app.get('/api/events', (_req, res) => {
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	res.flushHeaders();
	sseClients.add(res);
	// Heartbeat every 25s to keep connection alive
	const hb = setInterval(() => res.write(': heartbeat\n\n'), 25_000);
	res.on('close', () => {
		clearInterval(hb);
		sseClients.delete(res);
	});
});

let _lastAssetCount = -1;
setInterval(async () => {
	try {
		const data = await fadeGet<unknown[]>('/library/assets/rich').catch(
			() => null,
		);
		if (!data) return;
		const count = Array.isArray(data)
			? data.length
			: ((data as { assets?: unknown[] }).assets?.length ?? 0);
		if (_lastAssetCount !== -1 && count !== _lastAssetCount)
			broadcastAssetChange();
		_lastAssetCount = count;
	} catch {}
}, 4_000);

//   Chat (SSE streaming)
app.post('/api/chat', async (req, res) => {
	const { message } = req.body as { message: string };
	if (!message) return res.status(400).json({ error: 'message required' });

	threadMessages.push({ role: 'user', content: message });

	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	res.flushHeaders();

	const send = (event: string, data: unknown) => {
		res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
	};

	try {
		const agent = await getAgent(FADE_PORT);
		const stream = await agent.stream({
			messages: threadMessages.map((m) =>
				m.role === 'user'
					? new HumanMessage(m.content)
					: { role: 'assistant', content: m.content },
			),
		});

		let assistantText = '';

		for await (const chunk of stream) {
			// agent node output
			if (chunk.agent?.messages) {
				for (const msg of chunk.agent.messages) {
					if (
						'content' in msg &&
						typeof msg.content === 'string' &&
						msg.content
					) {
						assistantText += msg.content;
						send('text', { delta: msg.content });
					}
					// tool calls
					if ('tool_calls' in msg && Array.isArray(msg.tool_calls)) {
						for (const tc of msg.tool_calls) {
							send('tool_call', {
								name: tc.name,
								args: tc.args,
								id: tc.id,
							});
						}
					}
				}
			}
			// tool results
			if (chunk.tools?.messages) {
				for (const msg of chunk.tools.messages) {
					if ('name' in msg && 'content' in msg) {
						send('tool_result', {
							name: msg.name,
							content:
								typeof msg.content === 'string'
									? msg.content
									: JSON.stringify(msg.content),
							tool_call_id: msg.tool_call_id,
						});
					}
				}
			}
		}

		if (assistantText)
			threadMessages.push({ role: 'assistant', content: assistantText });
		send('done', {});
	} catch (e) {
		send('error', { message: String(e) });
	}
	res.end();
});

//   Asset list — always returns a plain array
app.get('/api/assets', async (_req, res) => {
	try {
		const raw = await fadeGet<unknown>('/library/assets/rich').catch(() =>
			fadeGet<unknown>('/library/assets'),
		);

		let list: unknown[] = [];
		if (Array.isArray(raw)) list = raw;
		else if (raw && typeof raw === 'object') {
			const obj = raw as Record<string, unknown>;
			list = (
				Array.isArray(obj['assets'])
					? obj['assets']
					: Array.isArray(obj['items'])
						? obj['items']
						: []
			) as unknown[];
		}
		res.json(list);
	} catch (e) {
		res.status(502).json({ error: String(e) });
	}
});

//   Asset upload
app.post('/api/assets/upload', upload.single('file'), async (req, res) => {
	if (!req.file) return res.status(400).json({ error: 'No file' });

	const destDir = path.join(__dirname, '.imports');
	fs.mkdirSync(destDir, { recursive: true });
	const destPath = path.join(destDir, req.file.originalname);

	try {
		fs.copyFileSync(req.file.path, destPath);
		fs.unlinkSync(req.file.path);

		const r = await fetch(`${FADE_BASE}/library/import`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ filepath: destPath }),
		});

		const result = await r.json();
		if (!r.ok) throw new Error(result.detail ?? r.statusText);

		res.json(result);
		broadcastAssetChange();
	} catch (e) {
		console.error('[upload]', e);
		res.status(502).json({ error: String(e) });
	}
});

//   Preview render
app.post('/api/preview', async (_req, res) => {
	try {
		const result = await fadePost<{ jobId: string; total: number }>(
			'/export/start',
			{
				outputPath: path.join(__dirname, '.preview', 'preview.mp4'),
				width: 960,
				height: 540,
				fps: 30,
				codec: 'libx264',
				crf: 35,
				preset: 'ultrafast',
				videoBitrate: '2M',
				audioBitrate: '96k',
				audioSampleRate: 44100,
				audioChannels: 2,
				formatId: 'mp4-720',
			},
		);
		res.json(result);
	} catch (e) {
		res.status(502).json({ error: String(e) });
	}
});

app.get('/api/preview/:jobId/status', async (req, res) => {
	try {
		const data = await fadeGet(`/export/status/${req.params['jobId']}`);
		res.json(data);
	} catch (e) {
		res.status(502).json({ error: String(e) });
	}
});

app.get('/api/preview/video', (_req, res) => {
	const file = path.join(__dirname, '.preview', 'preview.mp4');
	if (!fs.existsSync(file))
		return res.status(404).json({ error: 'No preview yet' });
	res.sendFile(file);
});

//   Clear conversation
app.post('/api/chat/clear', (_req, res) => {
	threadMessages.length = 0;
	res.json({ ok: true });
});

// Ensure dirs exist
fs.mkdirSync(path.join(__dirname, '.uploads'), { recursive: true });
fs.mkdirSync(path.join(__dirname, '.preview'), { recursive: true });
fs.mkdirSync(path.join(__dirname, '.imports'), { recursive: true });

// ── /api/settings ────────────────────────────────────────────────────────────
const MASKED_KEYS: SettingKey[] = [
	'googleApiKey',
	'openaiApiKey',
	'anthropicApiKey',
	'groqApiKey',
	'tabiApiKey',
	'stabilityApiKey',
	'phantomBusterApiKey',
	'youtubeClientId',
	'youtubeClientSecret',
];

app.get('/api/settings', (_req, res) => {
	const out: Record<string, string> = {};
	for (const k of ALL_SETTING_KEYS) {
		const v = runtimeConfig[k];
		out[k] = MASKED_KEYS.includes(k) && v ? '••••' + v.slice(-4) : v;
	}
	res.json(out);
});

app.post('/api/settings', (req, res) => {
	const body = req.body as Partial<Record<SettingKey, string>>;
	for (const k of ALL_SETTING_KEYS) {
		if (k in body && typeof body[k] === 'string' && body[k] !== '') {
			runtimeConfig[k] = body[k]!;
		}
	}
	saveSettings();
	applyToAgentConfig();
	resetAgent();
	res.json({
		ok: true,
		provider: runtimeConfig.provider,
		model: runtimeConfig.model,
	});
});

type Lead = {
	name?: string;
	firstName?: string;
	company?: string;
	topic?: string;
	[k: string]: unknown;
};

const jobQueue: string[] = [];
let jobRunning = false;

async function processNextJob() {
	if (jobRunning || jobQueue.length === 0) return;
	jobRunning = true;
	const prompt = jobQueue.shift()!;
	try {
		console.log(`[webhook] Processing job: ${prompt.slice(0, 80)}…`);
		const agent = await getAgent(FADE_PORT);
		await agent.invoke({ messages: [new HumanMessage(prompt)] });
		console.log('[webhook] Job done.');
	} catch (e) {
		console.error('[webhook] Job failed:', e);
	}
	jobRunning = false;
	void processNextJob();
}

function leadToPrompt(lead: Lead, phantomId?: string): string {
	const who = lead.firstName ?? lead.name ?? 'the lead';
	const org = lead.company ? ` at ${lead.company}` : '';
	const topic = lead.topic ?? 'a product introduction';
	const post = phantomId
		? ` Then post the finished video back via PhantomBuster phantom ${phantomId}.`
		: '';
	return `
New lead received: ${who}${org}.
Create a short 30-second video about "${topic}".
Steps:
1. Check the library for relevant clips (list_library_assets).
2. Build a timeline with clips, captions, and a transition.
3. Export the video (export_video then wait_for_export).
4. Post it to the appropriate platform (post_to_platform).${post}
Lead metadata: ${JSON.stringify(lead)}
`.trim();
}

app.post('/api/webhook', (req, res) => {
	const secret = process.env['WEBHOOK_SECRET'];
	if (secret && req.headers['x-webhook-secret'] !== secret) {
		return res.status(401).json({ error: 'Invalid webhook secret' });
	}

	const body = req.body as {
		phantomId?: string;
		leads?: Lead[];
		data?: Lead | Lead[];
	};

	const rawLeads: Lead[] =
		body.leads ??
		(Array.isArray(body.data)
			? body.data
			: body.data
				? [body.data]
				: [body as Lead]);
	const leads = rawLeads.filter((l) => typeof l === 'object' && l !== null);

	if (leads.length === 0)
		return res.status(400).json({ error: 'No leads in payload' });

	for (const lead of leads) {
		jobQueue.push(leadToPrompt(lead, body.phantomId));
	}
	void processNextJob();

	res.json({ ok: true, queued: leads.length, queueLength: jobQueue.length });
	console.log(
		`[webhook] Queued ${leads.length} lead(s). Total queue: ${jobQueue.length}`,
	);
});

app.post('/api/poll', async (req, res) => {
	const { phantomId } = req.body as { phantomId: string };
	const pbKey = process.env['PHANTOMBUSTER_API_KEY'];
	if (!pbKey)
		return res.status(500).json({ error: 'PHANTOMBUSTER_API_KEY not set' });
	if (!phantomId) return res.status(400).json({ error: 'phantomId required' });

	try {
		const r = await fetch(
			`https://api.phantombuster.com/api/v2/containers/fetch-result-object?id=${phantomId}`,
			{ headers: { 'X-Phantombuster-Key': pbKey } },
		);
		const data = (await r.json()) as { resultObject?: string };
		const leads: Lead[] = JSON.parse(data.resultObject ?? '[]');
		for (const lead of leads) jobQueue.push(leadToPrompt(lead, phantomId));
		void processNextJob();
		res.json({ ok: true, queued: leads.length });
	} catch (e) {
		res.status(502).json({ error: String(e) });
	}
});

//   Job queue status
app.get('/api/jobs', (_req, res) => {
	res.json({ queued: jobQueue.length, running: jobRunning });
});

function startServer(port: number, retries = 5) {
	const server = app.listen(port, () => {
		console.log(`\n🎬 Fade Agent UI   → http://localhost:${port}`);
		console.log(`   Fade backend    → http://localhost:${FADE_PORT}`);
		console.log(`   Webhook URL     → http://localhost:${port}/api/webhook`);
		console.log(`   Poll endpoint   → POST /api/poll  { phantomId }`);
		console.log(`   Job queue       → GET  /api/jobs\n`);
	});
	server.on('error', (err: NodeJS.ErrnoException) => {
		if (err.code === 'EADDRINUSE' && retries > 0) {
			console.warn(`Port ${port} busy, retrying in 1s… (${retries} left)`);
			setTimeout(() => {
				server.close();
				startServer(port, retries - 1);
			}, 1000);
		} else {
			throw err;
		}
	});
}

startServer(UI_PORT);
