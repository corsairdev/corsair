// Live ScrapeCreators API tests. Excluded from the default run by
// `testPathIgnorePatterns` in `jest.config.cjs`; run them with:
//
//   SCRAPE_CREATORS_API_KEY=... pnpm test:live
//   SCRAPE_CREATORS_LIVE_ONLY=tiktok.profile,youtube.video ... (a list)
//
// Most calls spend one ScrapeCreators credit (errors are free), so this file
// never runs on an exported key by accident. Calls go through createCorsair,
// so the plugin's error handlers and core's retries apply as in production.
import { createCorsair } from 'corsair/core';
import { scrapecreators } from './index';

const key = process.env.SCRAPE_CREATORS_API_KEY?.trim() ?? '';
const hasKey = key.length > 0;
if (!hasKey) {
	console.warn(
		'[scrapecreators] live API tests skipped: set SCRAPE_CREATORS_API_KEY to enable them.',
	);
}
const live = hasKey ? describe : describe.skip;
const only = (process.env.SCRAPE_CREATORS_LIVE_ONLY ?? '')
	.split(',')
	.map((id) => id.trim())
	.filter(Boolean);

// jest-yaml-transform turns the yaml into a plain object.
const docs = require('./plugin-docs.yaml') as {
	// `unknown` because example args are free-form YAML values.
	apiExamples: Record<string, { args: Record<string, unknown> }>;
};

// `unknown` because the table calls every operation through one signature.
type AnyEndpoint = (input: unknown) => Promise<unknown>;

// One cheap call per big platform, on brand accounts (@nasa, OpenAI ...).
const SAMPLE = [
	'tiktok.profile',
	'instagram.profile',
	'youtube.channel',
	'twitter.profile',
	'reddit.subredditDetails',
	'linkedin.company',
	'github.repository',
];

live('ScrapeCreators live API', () => {
	jest.setTimeout(5 * 60_000);
	const api = createCorsair({
		plugins: [scrapecreators({ key, permissions: { mode: 'readonly' } })],
		// `unknown` is necessary because the bound API tree is indexed by operation names from the manifest at runtime.
	}).scrapecreators.api as unknown as Record<
		string,
		Record<string, AnyEndpoint>
	> & {
		account: {
			creditBalance: (input: object) => Promise<{ creditCount?: number }>;
		};
	};

	it('account.creditBalance reports the credits left (free)', async () => {
		const balance = await api.account.creditBalance({});
		expect(typeof balance.creditCount).toBe('number');
	});

	const ids = only.length > 0 ? only : SAMPLE;
	it.each(ids)(
		'%s returns a response that matches its schema',
		async (id) => {
			const args = docs.apiExamples[id]?.args;
			expect(args).toBeDefined();
			const [group, action] = id.split('.') as [string, string];
			const result = (await api[group]?.[action]?.(args)) as {
				success?: boolean;
				credits_charged?: number;
			};
			expect(result.success).toBe(true);
			expect(typeof result.credits_charged).toBe('number');
		},
		3 * 60_000,
	);
});
