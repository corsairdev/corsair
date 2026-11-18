/**
 * Live smoke tests against the Search Console API. They run only when
 * GOOGLE_SEARCH_CONSOLE_ACCESS_TOKEN is set (CI has none, so they skip).
 *
 * GOOGLE_SEARCH_CONSOLE_SITE is the property to query, written the way Search
 * Console names it: `https://example.com/` or `sc-domain:example.com`. Without
 * it the suite calls sites.list and picks the first property whose permission
 * level is not UNVERIFIED.
 *
 * Read-only: sites.list, one analytics query over a two-day window, and a
 * sitemaps list. URL inspection is left out because it has its own 2,000 per
 * day quota, and a smoke test should not spend part of it.
 */
import { query as analyticsQuery } from './endpoints/search-analytics';
import { list as sitemapsList } from './endpoints/sitemaps';
import { list as sitesList } from './endpoints/sites';
import { GoogleSearchConsoleEndpointOutputSchemas } from './endpoints/types';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const TOKEN = process.env.GOOGLE_SEARCH_CONSOLE_ACCESS_TOKEN?.trim();
const SITE = process.env.GOOGLE_SEARCH_CONSOLE_SITE?.trim();
const describeLive = TOKEN ? describe : describe.skip;

if (!TOKEN) {
	console.warn(
		'[googlesearchconsole] skipping live tests: GOOGLE_SEARCH_CONSOLE_ACCESS_TOKEN is not set',
	);
}

// unknown: the endpoints read only `key` from the context.
const ctx = { key: TOKEN ?? '' } as unknown as Parameters<typeof sitesList>[0];

/** The property to query: the explicit one, else the first verified one. */
async function resolveSite(): Promise<string> {
	if (SITE) return SITE;
	const page = await sitesList(ctx, {});
	const verified = (page.siteEntry ?? []).find(
		(entry) =>
			entry.permissionLevel &&
			entry.permissionLevel !== 'SITE_UNVERIFIED_USER' &&
			entry.permissionLevel !== 'SITE_PERMISSION_LEVEL_UNSPECIFIED',
	);
	if (!verified?.siteUrl) {
		throw new Error(
			'No property: set GOOGLE_SEARCH_CONSOLE_SITE, or the token can reach no verified property',
		);
	}
	return verified.siteUrl;
}

/** Yesterday in Pacific Time, which is the API's own zone. */
function ptDate(daysAgo: number): string {
	const now = new Date();
	// The API reads dates in PT, so shifting by a fixed offset is wrong across
	// DST. Intl gives the PT calendar date directly.
	const parts = new Intl.DateTimeFormat('en-CA', {
		timeZone: 'America/Los_Angeles',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).format(new Date(now.getTime() - daysAgo * 86_400_000));
	return parts;
}

describeLive('googlesearchconsole live API', () => {
	jest.setTimeout(60_000);

	it('sites.list returns a parseable list', async () => {
		const page = await sitesList(ctx, {});

		expect(page.siteEntry === undefined || Array.isArray(page.siteEntry)).toBe(
			true,
		);
		expect(
			GoogleSearchConsoleEndpointOutputSchemas.sitesList.safeParse(page)
				.success,
		).toBe(true);
	});

	it('searchanalytics.query returns parseable rows for a two-day window', async () => {
		const siteUrl = await resolveSite();

		// Finalized data lags a couple of days, so asking for it yesterday can
		// legitimately answer with no rows. The window is recent but finalized.
		const page = await analyticsQuery(ctx, {
			siteUrl,
			startDate: ptDate(4),
			endDate: ptDate(3),
			dimensions: ['DATE'],
			rowLimit: 10,
		});

		expect(page.rows === undefined || Array.isArray(page.rows)).toBe(true);
		expect(
			GoogleSearchConsoleEndpointOutputSchemas.searchanalyticsQuery.safeParse(
				page,
			).success,
		).toBe(true);
		for (const row of page.rows ?? []) {
			// ctr is a fraction and position is an average rank, both numbers.
			if (row.ctr !== undefined && row.ctr !== null) {
				expect(typeof row.ctr).toBe('number');
			}
			if (row.position !== undefined && row.position !== null) {
				expect(typeof row.position).toBe('number');
			}
		}
	});

	it('sitemaps.list returns a parseable list for the property', async () => {
		const siteUrl = await resolveSite();

		const page = await sitemapsList(ctx, { siteUrl });

		expect(page.sitemap === undefined || Array.isArray(page.sitemap)).toBe(
			true,
		);
		// The error and warning counts are int64s, which arrive as strings.
		for (const sitemap of page.sitemap ?? []) {
			if (sitemap.errors !== undefined && sitemap.errors !== null) {
				expect(typeof sitemap.errors).toBe('string');
			}
		}
	});
});
