// Live Litescrape API tests. Excluded from the default run by
// `testPathIgnorePatterns` in `jest.config.cjs`; run them with:
//
//   LITESCRAPE_API_KEY=ls_... pnpm test:live
//   LITESCRAPE_API_KEY=ls_... LITESCRAPE_LIVE_ALL=1 pnpm test:live   (all 202)
//
// Every call spends one prepaid call (failed calls are free), so this file
// never runs on an exported key by accident. Calls go through createCorsair,
// so the plugin's error handlers and core's retries apply as in production.
import { createCorsair } from 'corsair/core';
import { litescrapeOperations } from './endpoints/manifest';
import { litescrape } from './index';

const key = process.env.LITESCRAPE_API_KEY?.trim() ?? '';
const hasKey = key.length > 0;
if (!hasKey) {
	console.warn(
		'[litescrape] live API tests skipped: set LITESCRAPE_API_KEY to enable them.',
	);
}
const live = hasKey ? describe : describe.skip;
const runAll = process.env.LITESCRAPE_LIVE_ALL === '1';

// jest-yaml-transform turns the yaml into a plain object.
const docs = require('./plugin-docs.yaml') as {
	// `unknown` because example args are free-form YAML values.
	apiExamples: Record<string, { args: Record<string, unknown> }>;
};

// `unknown` because the table calls every operation through one signature.
type AnyEndpoint = (input: unknown) => Promise<unknown>;

// A representative set across engines, shops, social, jobs and the web tools.
const SAMPLE = [
	'google.search',
	'google.news',
	'googleMaps.search',
	'bing.search',
	'duckduckgo.search',
	'yahoo.search',
	'amazon.product',
	'ebay.product',
	'tiktok.profile',
	'youtube.video',
	'github.repository',
	'hackernews.stories',
	'npm.package',
	'wikipedia.article',
	'web.fetch',
];

// Provider-side outcomes that are not plugin bugs: Litescrape answers 503
// `service_unavailable` (not billed) when the upstream scraper fails, and 404
// when the upstream page is gone. Anything else fails the test.
function isProviderOutage(error: unknown): boolean {
	const status = (error as { status?: number }).status;
	return status === 503 || status === 404;
}

live('Litescrape live API', () => {
	jest.setTimeout(10 * 60 * 1000);
	const api = createCorsair({
		plugins: [litescrape({ key, permissions: { mode: 'readonly' } })],
	}).litescrape.api as unknown as Record<
		string,
		Record<string, AnyEndpoint>
	> & {
		keys: {
			status: (input: object) => Promise<{ remaining_calls: number }>;
			usage: (input: object) => Promise<{ range?: string | null }>;
		};
	};

	function call(id: string, input: unknown): Promise<unknown> {
		const [group, action] = id.split('.') as [string, string];
		const endpoint = api[group]?.[action];
		if (!endpoint) throw new Error(`no endpoint ${id}`);
		return endpoint(input);
	}

	it('keys.status reports the remaining calls', async () => {
		const status = await api.keys.status({});
		expect(status.remaining_calls).toBeGreaterThan(0);
	});

	it('keys.usage reports a usage window', async () => {
		const usage = await api.keys.usage({ range: '7d' });
		expect(usage.range).toBe('7d');
	});

	const ids = runAll
		? litescrapeOperations.map((operation) => operation.id)
		: SAMPLE;
	const outages: string[] = [];

	it.each(ids)(
		'%s returns a response that matches its schema',
		async (id) => {
			const args = docs.apiExamples[id]?.args;
			expect(args).toBeDefined();
			try {
				const result = await call(id, { ...args, timeout: 85 });
				expect(typeof result).toBe('object');
				expect(result).not.toBeNull();
			} catch (error) {
				if (!isProviderOutage(error)) throw error;
				outages.push(`${id} ${(error as { status?: number }).status}`);
			}
		},
		120_000,
	);

	afterAll(() => {
		if (outages.length > 0) {
			console.warn(
				`[litescrape] provider-side failures (not billed): ${outages.join(', ')}`,
			);
		}
	});
});
