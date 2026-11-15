/**
 * Live smoke test. CI skips this file by name (`api.test.ts` is in
 * `--testPathIgnorePatterns`), so it only runs through `pnpm test:live` with a
 * real key:
 *
 *   SCRAPINGANT_API_KEY=... pnpm --filter @corsair-dev/scrapingant test:live
 *
 * Every answer is parsed through its output schema before it is asserted on.
 * Calling the client with a hand-written type would skip the contract a caller
 * actually receives, so a field typed wrongly would pass here and throw for a
 * user on a successful call.
 *
 * Each call sends `browser: false`, which costs 1 credit instead of 10, and the
 * five operations together spend about 15 credits.
 */
import { makeScrapingAntRequest, parseJsonObject } from './client';
import { ScrapingAntEndpointOutputSchemas as Outputs } from './endpoints/types';

const API_KEY = process.env.SCRAPINGANT_API_KEY;
const describeIfKey = API_KEY ? describe : describe.skip;

if (!API_KEY) {
	console.warn(
		'scrapingant live smoke skipped: set SCRAPINGANT_API_KEY to run it',
	);
}

// example.com has been reduced to a single paragraph with no heading, so the
// assertions below check for its actual text rather than a Markdown heading.
const PAGE = 'https://example.com/';
const PAGE_TEXT = 'This domain is for use in documentation examples';

describeIfKey('live ScrapingAnt API', () => {
	const key = API_KEY ?? '';

	it('reads the account usage', async () => {
		const raw = await makeScrapingAntRequest(key, '/v2/usage');
		const result = Outputs.accountUsage.parse(parseJsonObject(raw));

		expect(result.plan_name.length).toBeGreaterThan(0);
		expect(result.plan_total_credits).toBeGreaterThanOrEqual(0);
		expect(result.remained_credits).toBeGreaterThanOrEqual(0);
		expect(result.start_date).toMatch(/^\d{4}-\d{2}-\d{2}T/);
	});

	it('scrapes a page as HTML with its target status and cost', async () => {
		const raw = await makeScrapingAntRequest(key, '/v2/general', {
			query: { url: PAGE, browser: false },
		});
		const result = Outputs.scrapeHtml.parse({
			html: raw.body,
			page_status: raw.pageStatus,
			credits_cost: raw.creditsCost,
		});

		expect(result.html).toContain(PAGE_TEXT);
		expect(result.page_status).toBe(200);
		// A plain fetch with no browser is the documented 1-credit case.
		expect(result.credits_cost).toBe(1);
	});

	it('scrapes a page as Markdown', async () => {
		const raw = await makeScrapingAntRequest(key, '/v2/markdown', {
			query: { url: PAGE, browser: false },
		});
		const result = Outputs.scrapeMarkdown.parse({
			...parseJsonObject(raw),
			credits_cost: raw.creditsCost,
		});

		expect(result.markdown).toContain(PAGE_TEXT);
		expect(result.url).toContain('example.com');
	});

	it('reads the extended envelope with the target status in its body', async () => {
		const raw = await makeScrapingAntRequest(key, '/v2/extended', {
			query: { url: PAGE, browser: false },
		});
		const result = Outputs.scrapeExtended.parse({
			...parseJsonObject(raw),
			credits_cost: raw.creditsCost,
		});

		expect(result.html).toContain(PAGE_TEXT);
		expect(result.text).toContain(PAGE_TEXT);
		// The status is a JSON field here; this route sends no
		// Ant-page-status-code header, which is why the schema reads the body.
		expect(result.status_code).toBe(200);
		expect(Array.isArray(result.headers)).toBe(true);
		// cookies is an empty string for a page that sets none, not null.
		expect(typeof result.cookies).toBe('string');
		// Without the browser both arrays arrive empty rather than absent.
		expect(result.xhrs).toEqual([]);
		expect(result.iframes).toEqual([]);
	});

	it('extracts requested properties as a JSON object', async () => {
		const raw = await makeScrapingAntRequest(key, '/v2/extract', {
			query: {
				url: PAGE,
				extract_properties: 'content',
				browser: false,
			},
		});
		const result = Outputs.extractData.parse(parseJsonObject(raw));

		// The key is the requested property name, and the value is its text.
		expect(typeof result.content).toBe('string');
		expect(String(result.content)).toContain(PAGE_TEXT);
	});
});
