import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HumanMessage } from '@langchain/core/messages';
import cors from 'cors';
import express from 'express';
import multer from 'multer';
import {
	getAgent,
	setFadePort,
	setPhantomBusterKey,
} from '../fade-agent/index.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, 'public');

const FADE_PORT = Number(process.env['FADE_PORT'] ?? 8000);
const UI_PORT = Number(process.env['UI_PORT'] ?? 3099);

setFadePort(FADE_PORT);
if (process.env['PHANTOMBUSTER_API_KEY']) {
	setPhantomBusterKey(process.env['PHANTOMBUSTER_API_KEY']);
}

const FADE_BASE = `http://localhost:${FADE_PORT}`;
const fadeGet = async <T>(path: string): Promise<T> => {
	const r = await fetch(`${FADE_BASE}${path}`);
	if (!r.ok) throw new Error(`Fade ${path} → ${r.status}`);
	return r.json() as T;
};
const fadePost = async <T>(path: string, body: unknown): Promise<T> => {
	const r = await fetch(`${FADE_BASE}${path}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});
	if (!r.ok) throw new Error(`Fade ${path} → ${r.status}`);
	return r.json() as T;
};

const upload = multer({ dest: path.join(__dirname, '.uploads') });
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(PUBLIC));

// In-memory thread (per-server-run conversation history)
const threadMessages: { role: 'user' | 'assistant'; content: string }[] = [];

// ── Chat (SSE streaming) ───────────────────────────────────────────────────────
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
		const agent = getAgent(FADE_PORT);
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

// ── Asset list ─────────────────────────────────────────────────────────────────
app.get('/api/assets', async (_req, res) => {
	try {
		const data = await fadeGet('/library/assets/rich');
		res.json(data);
	} catch (e) {
		res.status(502).json({ error: String(e) });
	}
});

// ── Asset upload ───────────────────────────────────────────────────────────────
app.post('/api/assets/upload', upload.single('file'), async (req, res) => {
	if (!req.file) return res.status(400).json({ error: 'No file' });
	try {
		const formData = new FormData();
		const blob = new Blob([fs.readFileSync(req.file.path)]);
		formData.append('file', blob, req.file.originalname);

		const r = await fetch(`${FADE_BASE}/library/import`, {
			method: 'POST',
			body: formData,
		});
		const result = await r.json();
		fs.unlinkSync(req.file.path);
		res.json(result);
	} catch (e) {
		res.status(502).json({ error: String(e) });
	}
});

// ── Preview render (low quality) ───────────────────────────────────────────────
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

// ── Clear conversation ─────────────────────────────────────────────────────────
app.post('/api/chat/clear', (_req, res) => {
	threadMessages.length = 0;
	res.json({ ok: true });
});

// Ensure dirs exist
fs.mkdirSync(path.join(__dirname, '.uploads'), { recursive: true });
fs.mkdirSync(path.join(__dirname, '.preview'), { recursive: true });

app.listen(UI_PORT, () => {
	console.log(`\n🎬 Fade Agent UI → http://localhost:${UI_PORT}`);
	console.log(`   Fade backend  → http://localhost:${FADE_PORT}\n`);
});
