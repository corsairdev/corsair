import {
	ScrapeCreatorsManifestSchema,
	scrapeCreatorsManifest,
	scrapeCreatorsOperations,
} from './endpoints/manifest';
import { SCRAPECREATORS_OPERATION_IDS } from './endpoints/operation-types';
import {
	getScrapeCreatorsInputSchema,
	getScrapeCreatorsOutputSchema,
} from './endpoints/schemas';
import { scrapecreators } from './index';

const ids = scrapeCreatorsOperations.map((operation) => operation.id);

describe('scrapecreators manifest', () => {
	it('matches its schema', () => {
		expect(
			ScrapeCreatorsManifestSchema.safeParse(scrapeCreatorsManifest).error
				?.issues ?? [],
		).toEqual([]);
	});

	it('has one operation per route, 198 in all', () => {
		expect(ids).toHaveLength(198);
		expect(new Set(ids).size).toBe(ids.length);
		const paths = scrapeCreatorsOperations.map((operation) => operation.path);
		expect(new Set(paths).size).toBe(paths.length);
	});

	it('lists the same ids as the generated types', () => {
		expect([...SCRAPECREATORS_OPERATION_IDS].sort()).toEqual([...ids].sort());
	});

	it('marks only the three routes ScrapeCreators also takes as POST', () => {
		expect(
			scrapeCreatorsOperations
				.filter((operation) => operation.postFallback)
				.map((operation) => operation.path)
				.sort(),
		).toEqual([
			'/v1/facebook/adLibrary/company/ads',
			'/v1/facebook/adLibrary/search/ads',
			'/v1/reddit/post/comments',
		]);
	});
});

describe('scrapecreators plugin wiring', () => {
	const plugin = scrapecreators({ key: 'k' });
	// unknown: the nested tree is walked generically here.
	const nested = plugin.endpoints as unknown as Record<
		string,
		Record<string, unknown>
	>;

	it.each(ids)('%s has an endpoint, meta and schemas', (id) => {
		const [group, action] = id.split('.') as [string, string];
		expect(typeof nested[group]?.[action]).toBe('function');
		const meta = (
			plugin.endpointMeta as Record<
				string,
				{ riskLevel: string; description: string }
			>
		)[id];
		expect(meta?.riskLevel).toBe('read');
		expect(meta?.description.length).toBeGreaterThan(10);
		const entry = (
			plugin.endpointSchemas as Record<
				string,
				{ input: unknown; output: unknown }
			>
		)[id];
		expect(entry?.input).toBe(getScrapeCreatorsInputSchema(id));
		expect(entry?.output).toBe(getScrapeCreatorsOutputSchema(id));
	});

	it('has no endpoints the manifest does not list', () => {
		const tree = Object.entries(nested).flatMap(([group, actions]) =>
			Object.keys(actions).map((action) => `${group}.${action}`),
		);
		expect(tree.sort()).toEqual([...ids].sort());
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(
			[...ids].sort(),
		);
	});

	it('builds schemas only when they are read, and once', () => {
		const first = getScrapeCreatorsInputSchema('tiktok.profile');
		expect(getScrapeCreatorsInputSchema('tiktok.profile')).toBe(first);
	});

	it('requires the fields the spec requires', () => {
		const input = getScrapeCreatorsInputSchema('youtube.videoTranscript');
		expect(input.safeParse({}).success).toBe(false);
		expect(
			input.safeParse({ url: 'https://www.youtube.com/watch?v=x' }).success,
		).toBe(true);
	});

	it('parses the envelope and the documented fields leniently', () => {
		const output = getScrapeCreatorsOutputSchema('tiktok.profile');
		expect(
			output.safeParse({
				success: true,
				credits_remaining: null,
				credits_charged: 0,
				cached: true,
				cached_at: '2026-11-27T00:00:00Z',
				user: null,
			}).success,
		).toBe(true);
		expect(output.safeParse({ credits_charged: 'one' }).success).toBe(false);
	});

	it('has no webhooks', () => {
		expect(plugin.webhooks).toEqual({});
	});
});
