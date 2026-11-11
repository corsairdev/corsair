/**
 * Live smoke tests. CI skips this file by name, and it skips itself without a key.
 * Every read goes through its operation's output schema, so a wrong field type
 * fails here rather than in a caller's code.
 *
 * Run with `WEBSCRAPERIO_API_KEY=... pnpm --filter @corsair-dev/webscraperio test:live`.
 * Read-only: nothing here creates a sitemap, which would start a scraping job.
 */
import { Sitemaps } from './endpoints';
import type { WebscraperioContext } from './index';

const apiKey = process.env.WEBSCRAPERIO_API_KEY;

const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	// A skipped run must not read as a green one.
	console.warn(
		'WEBSCRAPERIO_API_KEY is not set: the live Web Scraper Cloud suite is skipped, not passing.',
	);
}

function liveContext(): WebscraperioContext {
	// unknown: a real context also carries the database, hooks and key manager;
	// the endpoints read only `key`, so the fixture is cast at this boundary.
	return { key: apiKey } as unknown as WebscraperioContext;
}

describeIfKey('live Web Scraper Cloud API', () => {
	it('lists sitemaps through the output schema', async () => {
		const result = await Sitemaps.list(
			liveContext() as never,
			{
				page: 1,
			} as never,
		);

		expect(result).toBeDefined();
	});

	it('reads the account plan and page allowance', async () => {
		const result = await Sitemaps.account(liveContext() as never, {} as never);

		expect(result).toBeDefined();
	});

	it('reads one sitemap by id when the account has any', async () => {
		const list = await Sitemaps.list(
			liveContext() as never,
			{
				page: 1,
			} as never,
		);
		// The list nests its rows under `data`, either bare or paginated.
		const body = list as {
			data?: { id?: number }[] | { data?: { id?: number }[] };
		};
		const rows = Array.isArray(body.data) ? body.data : body.data?.data;
		const id = rows?.[0]?.id;
		if (id === undefined) return;

		const one = await Sitemaps.get(liveContext() as never, { id } as never);

		expect(one).toBeDefined();
	});

	it('never exposes the API token in a returned object', async () => {
		const result = await Sitemaps.list(
			liveContext() as never,
			{
				page: 1,
			} as never,
		);

		expect(JSON.stringify(result)).not.toContain(apiKey as string);
	});
});
