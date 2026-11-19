/**
 * Live smoke tests against the Search Console API. They run only when
 * GOOGLE_SEARCH_CONSOLE_ACCESS_TOKEN is set (CI has none, so they skip).
 *
 * GOOGLE_SEARCH_CONSOLE_SITE is the property to query, written the way Search
 * Console names it: `https://example.com/` or `sc-domain:example.com`. Without
 * it the suite calls sites.list and picks the first property whose permission
 * level is not UNVERIFIED.
 *
 * Default run, read-only: sites.list and sites.get, one analytics query over a
 * two-day window, sitemaps.list and sitemaps.get, and one URL inspection (its
 * quota is 2,000 a day per site, so one call is fine).
 *
 * GSC_LIVE_WRITES=1 adds the writes, on throwaway entries the test creates
 * itself and removes again: sitemaps.submit + delete on a made-up sitemap URL,
 * and sites.add + delete on a made-up URL-prefix property under the site. Each
 * refuses to run if its entry already exists, so a real one is never removed.
 */
import { query as analyticsQuery } from './endpoints/search-analytics';
import {
	get as sitemapsGet,
	list as sitemapsList,
	remove as sitemapsRemove,
	submit as sitemapsSubmit,
} from './endpoints/sitemaps';
import {
	add as sitesAdd,
	get as sitesGet,
	list as sitesList,
	remove as sitesRemove,
} from './endpoints/sites';
import { GoogleSearchConsoleEndpointOutputSchemas } from './endpoints/types';
import { inspect as urlInspect } from './endpoints/url-inspection';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const TOKEN = process.env.GOOGLE_SEARCH_CONSOLE_ACCESS_TOKEN?.trim();
const SITE = process.env.GOOGLE_SEARCH_CONSOLE_SITE?.trim();
const describeLive = TOKEN ? describe : describe.skip;
const liveWrite = TOKEN && process.env.GSC_LIVE_WRITES === '1' ? it : it.skip;

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
	const verified = (page.siteEntry ?? []).find((entry) =>
		['siteowner', 'sitefulluser'].includes(
			(entry.permissionLevel ?? '').replace(/_/g, '').toLowerCase(),
		),
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

	it('sites.get returns the property', async () => {
		const siteUrl = await resolveSite();

		const site = await sitesGet(ctx, { siteUrl });

		expect(site.siteUrl).toBe(siteUrl);
		expect(typeof site.permissionLevel).toBe('string');
	});

	it('sitemaps.get returns one listed sitemap', async () => {
		const siteUrl = await resolveSite();
		const first = (await sitemapsList(ctx, { siteUrl })).sitemap?.[0]?.path;
		if (!first) return; // A property with no sitemap has nothing to read.

		const sitemap = await sitemapsGet(ctx, { siteUrl, feedpath: first });

		expect(sitemap.path).toBe(first);
	});

	it('urlInspection.inspect reports the index state of the home page', async () => {
		const siteUrl = await resolveSite();
		const home = siteUrl.startsWith('sc-domain:')
			? `https://${siteUrl.slice('sc-domain:'.length)}/`
			: siteUrl;

		const result = await urlInspect(ctx, { siteUrl, inspectionUrl: home });

		expect(result.inspectionResult?.indexStatusResult).toBeDefined();
	});

	liveWrite(
		'sitemaps.submit then sitemaps.delete a throwaway sitemap URL',
		async () => {
			const siteUrl = await resolveSite();
			const host = siteUrl.startsWith('sc-domain:')
				? `https://${siteUrl.slice('sc-domain:'.length)}/`
				: siteUrl;
			const feedpath = `${host}corsair-live-test-sitemap.xml`;
			const listed = (await sitemapsList(ctx, { siteUrl })).sitemap ?? [];
			if (listed.some((entry) => entry.path === feedpath)) {
				throw new Error(`${feedpath} is already listed; not touching it`);
			}

			await sitemapsSubmit(ctx, { siteUrl, feedpath });
			const after = (await sitemapsList(ctx, { siteUrl })).sitemap ?? [];
			expect(after.some((entry) => entry.path === feedpath)).toBe(true);

			await sitemapsRemove(ctx, { siteUrl, feedpath });
			const gone = (await sitemapsList(ctx, { siteUrl })).sitemap ?? [];
			expect(gone.some((entry) => entry.path === feedpath)).toBe(false);
		},
	);

	liveWrite(
		'sites.add then sites.delete a throwaway URL-prefix property',
		async () => {
			const siteUrl = await resolveSite();
			const host = siteUrl.startsWith('sc-domain:')
				? `https://${siteUrl.slice('sc-domain:'.length)}/`
				: siteUrl;
			const property = `${host}corsair-live-test/`;
			const before = (await sitesList(ctx, {})).siteEntry ?? [];
			if (before.some((entry) => entry.siteUrl === property)) {
				throw new Error(`${property} already exists; not touching it`);
			}

			await sitesAdd(ctx, { siteUrl: property });
			const added = await sitesGet(ctx, { siteUrl: property });
			expect(added.siteUrl).toBe(property);

			await sitesRemove(ctx, { siteUrl: property });
			const after = (await sitesList(ctx, {})).siteEntry ?? [];
			expect(after.some((entry) => entry.siteUrl === property)).toBe(false);
		},
	);
});
