import { writeFileSync } from 'node:fs';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { crawl4aiOperations } from './endpoints/manifest';
import { crawl4ai } from './index';

/**
 * Live run. Server part, against a local Docker server:
 *
 *   docker run -d -p 127.0.0.1:11235:11235 --shm-size=1g \
 *     -e CRAWL4AI_API_TOKEN=<token> unclecode/crawl4ai:latest
 *   CRAWL4AI_SERVER_URL=http://localhost:11235 CRAWL4AI_SERVER_TOKEN=<token> npx jest api.test.ts
 *
 * Cloud part with CRAWL4AI_API_KEY (a Cloud key; the run spends about 40 of
 * the free plan's 1,000 monthly credits). Each part skips without its env
 * (CI never runs files named api.test.ts). Never run: cloud.billing.topup and
 * cloud.billing.subscribe (they spend money) and cloud.report (it files a
 * report with Crawl4AI's team). CRAWL4AI_LIVE_REPORT=<file> writes every
 * operation's result.
 */
const serverUrl = process.env.CRAWL4AI_SERVER_URL;
const serverToken = process.env.CRAWL4AI_SERVER_TOKEN;
const cloudKey = process.env.CRAWL4AI_API_KEY;
if (!serverUrl || !serverToken) {
	console.warn(
		'Skipping Crawl4AI server run: set CRAWL4AI_SERVER_URL and CRAWL4AI_SERVER_TOKEN.',
	);
}
if (!cloudKey)
	console.warn('Skipping Crawl4AI Cloud run: set CRAWL4AI_API_KEY.');
const describeIf = serverUrl || cloudKey ? describe : describe.skip;

type Result = { ok: boolean; expected?: string; error?: string };
// `any` because the live run walks responses of many operations by field name.
type Json = any;
const NOT_RUN = [
	'cloud.billing.topup',
	'cloud.billing.subscribe',
	'cloud.report',
];

describeIf('crawl4ai live', () => {
	jest.setTimeout(900_000);
	const results: Record<string, Result> = {};

	async function client(key: string, url?: string) {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'crawl4ai', 'default');
		const corsair = createCorsair({
			plugins: [crawl4ai({ key, ...(url ? { serverUrl: url } : {}) })],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});
		return { api: corsair.crawl4ai.api as Json, testDb };
	}

	function runner(api: Json) {
		return async (id: string, input: object = {}, expected?: RegExp) => {
			let node = api;
			for (const part of id.split('.')) node = node?.[part];
			try {
				const out = await node(input);
				if (results[id]?.ok !== false) results[id] = { ok: true };
				return out;
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				if (!expected?.test(message))
					results[id] = { ok: false, error: message.slice(0, 300) };
				else if (results[id]?.ok !== false)
					results[id] = { ok: true, expected: message.slice(0, 160) };
				return undefined;
			}
		};
	}

	afterAll(() => {
		const ran = Object.keys(results);
		const report = {
			operations: crawl4aiOperations.length,
			ran: ran.length,
			ok: Object.values(results).filter((v) => v.ok && !v.expected).length,
			expected: Object.values(results).filter((v) => v.expected).length,
			failed: Object.values(results).filter((v) => !v.ok).length,
			notRun: crawl4aiOperations
				.map((o) => o.id)
				.filter((id) => !ran.includes(id)),
			results,
		};
		if (process.env.CRAWL4AI_LIVE_REPORT) {
			writeFileSync(
				process.env.CRAWL4AI_LIVE_REPORT,
				JSON.stringify(report, null, 2),
			);
		}
		console.log(
			`Crawl4AI live: ${report.ok} ok, ${report.expected} expected errors, ${report.failed} failed, not run: ${report.notRun.join(', ') || 'none'}`,
		);
	});

	(serverUrl && serverToken ? it : it.skip)(
		'runs every server route',
		async () => {
			const { api, testDb } = await client(serverToken as string, serverUrl);
			const r = runner(api);
			await r('server.health');
			await r('server.schema');
			await r('server.hooks');
			await r('server.metrics');
			await r('server.mcpSchema');
			await r('server.configDump', {
				type: 'CrawlerRunConfig',
				params: { word_count_threshold: 10 },
			});
			await r('server.markdown', { url: 'https://example.com', f: 'fit' });
			await r('server.monitor.health');
			await r('server.monitor.requests', { status: 'all', limit: 5 });
			const browsers = await r('server.monitor.browsers');
			await r('server.monitor.endpointStats');
			await r('server.monitor.timeline', { metric: 'memory', window: '5m' });
			await r('server.monitor.janitorLog', { limit: 5 });
			await r('server.monitor.errorLog', { limit: 5 });
			const sig: string | undefined = browsers?.browsers?.[0]?.sig;
			// The permanent browser can't be killed (400). Restarting it holds the
			// pool lock on 0.9.6 and stalls later calls, so restart is asked for a
			// browser that isn't in the pool (404).
			await r(
				'server.monitor.killBrowser',
				{ sig: sig ?? 'no-such-browser' },
				/Crawl4AI 4\d\d/,
			);
			await r(
				'server.monitor.restartBrowser',
				{ sig: 'nosuchsig' },
				/Crawl4AI 4\d\d/,
			);
			await r('server.monitor.cleanup');
			await r('server.monitor.resetStats');

			await r('server.html', { url: 'https://example.com' });
			const crawled = await r('server.crawl', {
				urls: ['https://example.com'],
				crawler_config: {
					type: 'CrawlerRunConfig',
					params: { cache_mode: 'bypass' },
				},
			});
			expect(crawled?.results?.[0]?.success).toBe(true);
			const stream = await r('server.crawlStream', {
				urls: ['https://example.com', 'https://example.org'],
			});
			expect(stream?.items?.length).toBeGreaterThan(0);
			await r('server.screenshot', { url: 'https://example.com' });
			await r('server.pdf', { url: 'https://example.com' });
			await r('server.executeJs', {
				url: 'https://example.com',
				scripts: ['document.title'],
			});
			await r('server.ask', { query: 'markdown generator', max_results: 3 });
			const job = await r('server.crawlJobs.create', {
				urls: ['https://example.com'],
			});
			let state: Json;
			for (let i = 0; i < 60; i++) {
				state = await r('server.crawlJobs.get', { task_id: job?.task_id });
				if (state?.status !== 'processing' && state?.status !== 'pending')
					break;
				await new Promise((done) => setTimeout(done, 2000));
			}
			expect(state?.status).toBe('completed');
			await r(
				'server.artifacts.get',
				{ artifact_id: 'not-an-artifact' },
				/404|not found|400/i,
			);
			// JWT issuing is off on a token-auth server.
			await r('server.token', { email: 'ada@example.com' }, /4\d\d/);
			// Last: an LLM job without a provider key can hold the browser pool's lock.
			// No LLM provider key on the test server: the server says so.
			await r(
				'server.llm',
				{ url: 'https://example.com', q: 'the title' },
				/Crawl4AI 5\d\d|LLM|api key|provider/i,
			);
			const llmJob = await r('server.llmJobs.create', {
				url: 'https://example.com',
				q: 'the title',
			});
			await r(
				'server.llmJobs.get',
				{ task_id: llmJob?.task_id ?? 'llm_missing' },
				/404|not found/i,
			);
			await testDb.cleanup?.();
		},
	);

	(cloudKey ? it : it.skip)(
		'runs the Cloud operations within a small credit budget',
		async () => {
			const { api, testDb } = await client(cloudKey as string);
			const run = runner(api);
			// The free plan allows 10 calls a minute: space them out.
			const r: typeof run = async (...args) => {
				await new Promise((done) => setTimeout(done, 6500));
				return run(...args);
			};
			await r('cloud.prices');
			await r('cloud.billing.balance');
			await r('cloud.billing.topups', { limit: 5 });
			await r('cloud.tools.list', { q: 'github repository', limit: 5 });
			await r('cloud.tools.get', { id: 'github-repo' });
			await r('cloud.tools.status', { id: 'scrape' });
			// Before the LLM-backed tools: they keep a concurrency slot (the free plan has 2) a while after answering.
			await r('cloud.scan', { domain: 'example.com', max_urls: 20 });
			await r('cloud.tools.estimate', {
				id: 'scrape',
				input: { url: 'https://example.com' },
			});
			await r(
				'cloud.tools.run',
				{ id: 'github-repo', input: { repo: 'unclecode/crawl4ai' } },
				/4\d\d/,
			);
			const page = await r('cloud.scrape', {
				url: 'https://example.com',
				format: 'md',
			});
			expect(page?.data?.markdown).toContain('documentation examples');
			await r('cloud.search', { q: 'crawl4ai web crawler' });
			await r('cloud.answer', {
				q: 'What is the capital of France?',
				deep: false,
			});
			await r('cloud.serp', { q: 'crawl4ai', country: 'us' });
			await r('cloud.extract', {
				url: 'https://example.com',
				instruction: 'the page heading and the link text',
			});
			await r('cloud.price', { sites: ['crawl4ai.com'] });
			await r('cloud.priceHistory', { domain: 'crawl4ai.com' });
			await r('cloud.verify', { check: 'domain', domain: 'example.com' });
			await r(
				'cloud.lead',
				{ find: 'industries', where: { q: 'dentists' } },
				/4\d\d/,
			);
			const site = await r('cloud.site', {
				url: 'https://example.com',
				depth: 0,
				max_pages: 1,
			});
			const siteJob = site?.data?.job_id;
			for (let i = 0; i < 40 && siteJob; i++) {
				const state = await r('cloud.jobs.get', { job_id: siteJob });
				if (state?.status === 'done' || state?.status === 'paused') break;
				await new Promise((done) => setTimeout(done, 3000));
			}
			await r('cloud.jobs.results', {
				job_id: siteJob ?? 'j_missing',
				after: 0,
			});
			await r('cloud.jobs.retry', { job_id: siteJob ?? 'j_missing' }, /4\d\d/);
			const batch = await r('cloud.batch', {
				tool: 'scrape',
				inputs: [
					{ url: 'https://example.com' },
					{ url: 'https://example.org' },
				],
				idempotency_key: `corsair-live-${Date.now()}`,
			});
			await r(
				'cloud.jobs.cancel',
				{ job_id: batch?.data?.job_id ?? 'j_missing' },
				/4\d\d/,
			);
			const watch = await r('cloud.watch', {
				url: 'https://example.com',
				watch: 'the page heading changes',
				every: '1d',
				name: 'corsair live run',
			});
			const watchId = watch?.data?.id;
			await r('cloud.monitors.list');
			await r('cloud.monitors.get', { id: watchId ?? 'm_missing' });
			await r('cloud.monitors.update', {
				id: watchId ?? 'm_missing',
				fields: { name: 'corsair live run v2' },
			});
			await r('cloud.monitors.events', { id: watchId ?? 'm_missing' });
			await r('cloud.monitors.changes');
			await r('cloud.monitors.delete', { id: watchId ?? 'm_missing' });
			await testDb.cleanup?.();
		},
	);

	it('records every result', () => {
		const failed = Object.entries(results).filter(([, v]) => !v.ok);
		expect(failed.map(([id, v]) => `${id}: ${v.error}`)).toEqual([]);
		for (const id of NOT_RUN) expect(results[id]).toBeUndefined();
	});
});
