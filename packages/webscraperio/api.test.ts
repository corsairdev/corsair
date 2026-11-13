/**
 * Live smoke tests. CI skips this file by name, and it skips itself without a key.
 * Every read goes through its operation's output schema, so a wrong field type
 * fails here rather than in a caller's code.
 *
 * Run with `WEBSCRAPERIO_API_KEY=... pnpm --filter @corsair-dev/webscraperio test:live`.
 * Read-only: nothing here creates a sitemap.
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

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant, and Output is inferred from the endpoint. The
// endpoints read only `key` off the context, and each input below fits its
// operation's schema, which parses it again.
function live<Output>(
	endpoint: (ctx: never, input: never) => Promise<Output>,
	input: object,
): Promise<Output> {
	return endpoint(liveContext() as never, input as never);
}

describeIfKey('live Web Scraper Cloud API', () => {
	it('lists sitemaps through the output schema', async () => {
		const result = await live(Sitemaps.list, {
			page: 1,
		});

		expect(result).toBeDefined();
	});

	it('reads the account user and page credits', async () => {
		const result = await live(Sitemaps.account, {});

		expect(typeof result.data?.page_credits).toBe('number');
	});

	it('reads one sitemap by id when the account has any', async () => {
		const list = await live(Sitemaps.list, {
			page: 1,
		});
		expect(Array.isArray(list.data)).toBe(true);
		expect(typeof list.last_page).toBe('number');
		const id = list.data?.[0]?.id;
		if (id === undefined || id === null) return;

		const one = await live(Sitemaps.get, { id });

		expect(typeof one.data?.sitemap).toBe('string');
	});

	it('never exposes the API token in a returned object', async () => {
		const result = await live(Sitemaps.list, {
			page: 1,
		});

		// describeIfKey runs this only when WEBSCRAPERIO_API_KEY is set.
		expect(JSON.stringify(result)).not.toContain(apiKey as string);
	});
});
