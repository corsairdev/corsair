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
 * The calls are kept to three reads: the free plan allows one request at a time
 * and a small monthly allowance, and each scrape spends credits (10 for the
 * documented defaults).
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

	it('scrapes a page as HTML with its target status', async () => {
		const raw = await makeScrapingAntRequest(key, '/v2/general', {
			query: { url: 'https://example.com/', browser: false },
		});
		const result = Outputs.scrapeHtml.parse({
			html: raw.body,
			page_status: raw.pageStatus,
			credits_cost: raw.creditsCost,
		});

		expect(result.html).toContain('Example Domain');
		expect(result.page_status).toBe(200);
	});

	it('scrapes a page as Markdown', async () => {
		const raw = await makeScrapingAntRequest(key, '/v2/markdown', {
			query: { url: 'https://example.com/', browser: false },
		});
		// parseJsonObject narrows the body to the object the envelope is before
		// the output schema types each field.
		const result = Outputs.scrapeMarkdown.parse({
			...parseJsonObject(raw),
			credits_cost: raw.creditsCost,
		});

		expect(result.markdown).toContain('#');
		expect(result.url).toContain('example.com');
	});
});
