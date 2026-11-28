import { writeFileSync } from 'node:fs';
import { processWebhook } from 'corsair';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { shotstack } from './index';

/**
 * Live run of every operation against Shotstack's sandbox (the `stage`
 * paths: free, watermarked output). Needs a Sandbox key from
 * app.shotstack.io → API Keys:
 *
 *   SHOTSTACK_API_KEY=<sandbox key> npx jest api.test.ts
 *
 * Skipped without SHOTSTACK_API_KEY (CI never runs files named api.test.ts).
 * The run never calls the production paths with a write: the plugin is pinned
 * to `stage`, and the one unpinned client (which shows the 401 fallback from
 * production to the sandbox) only lists templates. It makes a template, two
 * small renders, one image generation with the cheapest model (generation is
 * charged in the sandbox too: the quote is checked first and the run skips
 * the create above SHOTSTACK_LIVE_MAX_CREDITS, default 1), an upload, a source
 * fetch and a transfer, and deletes everything it made in a finally block, so a failed step still
 * cleans up.
 *
 * With SHOTSTACK_HOOK_URL (a public URL that records requests) and
 * SHOTSTACK_HOOK_READ (a URL that returns them as webhook.site's
 * `/token/<id>/requests` does), the renders and the fetch get callback URLs,
 * and every callback Shotstack sent goes through processWebhook, once as sent
 * and once with a forged id, which must be refused.
 * SHOTSTACK_LIVE_REPORT=<file> writes every operation's result there.
 */
const key = process.env.SHOTSTACK_API_KEY;
const describeIfLive = key ? describe : describe.skip;
if (!key) {
	console.warn(
		'Skipping Shotstack live run: set SHOTSTACK_API_KEY (a Sandbox key).',
	);
}
const hookUrl = process.env.SHOTSTACK_HOOK_URL;
const hookRead = process.env.SHOTSTACK_HOOK_READ;
const maxCredits = Number(process.env.SHOTSTACK_LIVE_MAX_CREDITS ?? '1');

const STAMP = Date.now().toString(36);
const SAMPLE_VIDEO =
	'https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/beach-overhead.mp4';
const SAMPLE_IMAGE =
	'https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/images/earth.jpg';
const PNG = Buffer.from(
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
	'base64',
);

type Result = { ok: boolean; expected?: string; error?: string };
// `any`: the run walks responses of every operation by field name.
type Json = any;

const textEdit = (text: string) => ({
	timeline: {
		tracks: [
			{
				clips: [
					{
						asset: { type: 'text', text },
						start: 0,
						length: 1,
					},
				],
			},
		],
	},
	output: { format: 'jpg' as const, resolution: 'preview' as const },
});

// Every test database the run opens, closed in afterAll.
const databases: Array<ReturnType<typeof createTestDatabase>> = [];

async function client(environment?: 'stage') {
	const testDb = createTestDatabase();
	databases.push(testDb);
	await createIntegrationAndAccount(testDb.db, 'shotstack', 'default');
	const corsair = createCorsair({
		plugins: [shotstack({ key, ...(environment ? { environment } : {}) })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair: corsair as Json, testDb };
}

async function until<T>(
	what: string,
	read: () => Promise<T>,
	done: (value: T) => boolean,
	timeoutMs = 180_000,
): Promise<T> {
	const started = Date.now();
	for (;;) {
		const value = await read();
		if (done(value)) return value;
		if (Date.now() - started > timeoutMs) {
			throw new Error(`${what}: still not done after ${timeoutMs / 1000}s`);
		}
		await new Promise((resolve) => setTimeout(resolve, 4000));
	}
}

describeIfLive('shotstack live (stage)', () => {
	jest.setTimeout(900_000);
	const results: Record<string, Result> = {};
	let api: Json;
	// What the run created, deleted in the test's finally even when a step fails.
	const made = {
		templates: [] as string[],
		sources: [] as string[],
		// Render ids and transfer ids: assets.getByRenderId lists the hosted
		// copies made under either.
		hostedUnder: [] as string[],
	};

	async function cleanup() {
		for (const id of made.sources) await run('sources.delete', { id });
		for (const id of made.hostedUnder) {
			const hosted = await run('assets.getByRenderId', { id });
			for (const asset of hosted?.assets ?? []) {
				await run('assets.delete', { id: asset.id });
			}
		}
		for (const id of made.templates) {
			await run('templates.delete', { id });
			await run('templates.get', { id }, { expect: /404|not found/i });
		}
	}

	async function run(
		id: string,
		input: object = {},
		options: { expect?: RegExp; need?: boolean; on?: Json } = {},
	): Promise<Json> {
		let node = options.on ?? api;
		for (const part of id.split('.')) node = node?.[part];
		try {
			const out = await node(input);
			if (!results[id] || results[id].ok) {
				results[id] = options.expect
					? { ok: false, error: `expected ${options.expect} but it succeeded` }
					: { ok: true };
			}
			return out;
		} catch (error) {
			const message = (error as Error).message;
			if (options.expect?.test(message)) {
				results[`${id}:error`] = { ok: true, expected: message.slice(0, 200) };
				return undefined;
			}
			results[id] = { ok: false, error: message.slice(0, 300) };
			if (options.need) throw error;
			return undefined;
		}
	}

	afterAll(() => {
		for (const db of databases) db.cleanup();
		const failed = Object.entries(results).filter(([, r]) => !r.ok);
		const summary = {
			operations: Object.keys(results).filter((k) => !k.includes(':')).length,
			webhooks: Object.keys(results).filter((k) => k.startsWith('webhook:'))
				.length,
			steps: Object.keys(results).length,
			ok: Object.values(results).filter((r) => r.ok && !r.expected).length,
			expectedErrors: Object.values(results).filter((r) => r.expected).length,
			failed: failed.length,
		};
		console.log(`Shotstack live summary: ${JSON.stringify(summary)}`);
		for (const [id, r] of failed) console.log(`FAILED ${id}: ${r.error}`);
		if (process.env.SHOTSTACK_LIVE_REPORT) {
			writeFileSync(
				process.env.SHOTSTACK_LIVE_REPORT,
				JSON.stringify({ summary, results }, null, 2),
			);
		}
	});

	it('runs every operation on the sandbox', async () => {
		api = (await client('stage')).corsair.shotstack.api;
		try {
			await scenario();
		} finally {
			await cleanup();
		}
		const failed = Object.entries(results).filter(([, r]) => !r.ok);
		expect(failed).toEqual([]);
	});

	async function scenario() {
		// The unpinned client: production refuses a sandbox key (401), so the
		// plugin falls back to the sandbox and remembers it.
		const auto = (await client()).corsair.shotstack.api;
		const autoList = await run('templates.list', {}, { on: auto, need: true });
		results['environment:auto-detect'] = autoList?.success
			? { ok: true }
			: { ok: false, error: 'auto-detect did not reach the sandbox' };

		// templates
		const created = await run(
			'templates.create',
			{
				name: `corsair-live-${STAMP}`,
				template: textEdit('Hello {{NAME}}'),
			},
			{ need: true },
		);
		const templateId = created.response.id;
		made.templates.push(templateId);
		await run('templates.list');
		const got = await run('templates.get', { id: templateId });
		expect(got?.response.template.timeline).toBeDefined();
		await run('templates.update', {
			id: templateId,
			name: `corsair-live-${STAMP}-v2`,
			template: textEdit('Hi {{NAME}} from Corsair'),
		});
		const templateRender = await run('templates.render', {
			id: templateId,
			merge: [{ find: 'NAME', replace: 'Corsair' }],
		});

		// renders
		const rendered = await run(
			'renders.create',
			{
				...textEdit(`Corsair live ${STAMP}`),
				...(hookUrl ? { callback: `${hookUrl}?kind=render` } : {}),
			},
			{ need: true },
		);
		const renderId = rendered.response.id;
		made.hostedUnder.push(renderId);
		const render = await until(
			'render',
			() => run('renders.get', { id: renderId }),
			(r: Json) => ['done', 'failed'].includes(r?.response.status),
		);
		expect(render.response.status).toBe('done');
		const withData = await run('renders.get', {
			id: renderId,
			data: true,
			merged: true,
		});
		expect(withData?.response.data).toBeTruthy();
		if (templateRender) {
			made.hostedUnder.push(templateRender.response.id);
			await until(
				'template render',
				() => run('renders.get', { id: templateRender.response.id }),
				(r: Json) => ['done', 'failed'].includes(r?.response.status),
			);
		}

		// serve: the hosted copy of the render
		const hosted = await until(
			'hosted copy',
			() => run('assets.getByRenderId', { id: renderId }),
			(r: Json) => r?.assets?.some((a: Json) => a.status === 'ready'),
		);
		const assetId = hosted.assets[0].id;
		await run('assets.get', { id: assetId });
		made.hostedUnder.push(`corsair-live-${STAMP}`);
		const transfer = await run('assets.transfer', {
			url: SAMPLE_IMAGE,
			id: `corsair-live-${STAMP}`,
			destinations: [{ provider: 'shotstack' }],
		});
		expect(transfer?.status).toBe('queued');

		// media
		const probe = await run('media.probe', { url: SAMPLE_VIDEO });
		expect(probe?.response).toBeTruthy();

		// generations
		const models = await run('generations.listModels', { expand: 'options' });
		await run('generations.listModels');
		const image = models?.models.find(
			(m: Json) => m.type === 'image' && m.available,
		);
		const modelId = image?.model ?? 'flux-schnell';
		await run('generations.getModel', { id: modelId });
		await run(
			'generations.getModel',
			{ id: 'no-such-model' },
			{
				expect: /404|not found/i,
			},
		);
		const request = {
			asset: {
				type: 'image' as const,
				model: modelId,
				prompt: 'A small paper boat on a calm lake, flat illustration',
			},
		};
		const quote = await run('generations.quote', request);
		if (quote && quote.credits <= maxCredits) {
			const generation = await run('generations.create', {
				...request,
				idempotencyKey: `corsair-live-${STAMP}`,
			});
			if (generation) {
				const finished = await until(
					'generation',
					() => run('generations.get', { id: generation.id }),
					(g: Json) => ['done', 'failed'].includes(g?.status),
				);
				expect(finished.status).toBe('done');
			}
		} else {
			results['generations.create'] = {
				ok: false,
				error: `skipped: quote ${quote?.credits} credits > SHOTSTACK_LIVE_MAX_CREDITS ${maxCredits}`,
			};
		}

		// ingest: direct upload, then a fetch
		const upload = await run('uploads.create', {}, { need: true });
		made.sources.push(upload.id);
		const put = await fetch(upload.url, { method: 'PUT', body: PNG });
		results['uploads:put-bytes'] = put.ok
			? { ok: true }
			: { ok: false, error: `PUT ${put.status}` };
		const fetched = await run(
			'sources.fetch',
			{
				url: SAMPLE_IMAGE,
				...(hookUrl ? { callback: `${hookUrl}?kind=source` } : {}),
			},
			{ need: true },
		);
		made.sources.push(fetched.id);
		for (const id of [upload.id, fetched.id]) {
			const source = await until(
				`source ${id}`,
				() => run('sources.get', { id }),
				(s: Json) => ['ready', 'failed'].includes(s?.status),
			);
			expect(source.status).toBe('ready');
		}
		const listed = await run('sources.list');
		expect(listed?.sources.length).toBeGreaterThan(0);

		// callbacks
		if (hookUrl && hookRead) {
			await new Promise((resolve) => setTimeout(resolve, 15_000));
			const response = await fetch(`${hookRead}?sorting=oldest&size=50`);
			const captured: Json = await response.json();
			const corsair = (await client('stage')).corsair;
			let forgedRefused = 0;
			for (const item of captured.data ?? []) {
				const headers = Object.fromEntries(
					Object.entries(item.headers as Record<string, string[]>).map(
						([k, v]) => [k.toLowerCase(), Array.isArray(v) ? v[0] : v],
					),
				);
				const body = JSON.parse(item.content);
				if (!String(body.id ?? '').length) continue;
				const result = await processWebhook(corsair, headers, item.content);
				const event = headers['x-shotstack-event-type'];
				const id = `webhook:${event}`;
				if (result.plugin !== 'shotstack' || !result.response?.success) {
					results[id] = {
						ok: false,
						error: result.response?.error ?? 'not matched',
					};
					continue;
				}
				results[id] ??= { ok: true };
				const forged = await processWebhook(
					corsair,
					headers,
					JSON.stringify({ ...body, id: `${body.id}x` }),
				);
				if (forged.response?.statusCode === 401) forgedRefused++;
				else
					results[`${id}:forged`] = {
						ok: false,
						error: `a forged id was answered ${forged.response?.statusCode}`,
					};
			}
			results['webhook:forged-refused'] = forgedRefused
				? { ok: true }
				: { ok: false, error: 'no forged callback was refused' };
		}

		// The transfer's hosted copy, listed under the id passed to it.
		await until(
			'transferred copy',
			() => run('assets.getByRenderId', { id: `corsair-live-${STAMP}` }),
			(r: Json) => r?.assets?.some((a: Json) => a.status === 'ready'),
		);
	}
});
