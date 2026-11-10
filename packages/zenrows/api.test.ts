import { makeZenrowsRequest, parseJsonBody } from './client';
import { ZenRowsEndpointOutputSchemas } from './endpoints/types';
import { captureError } from './test-fixtures';

// Live smoke tests. CI skips `api.test.ts` by design, and so does the plugin
// gate; run it with `pnpm --filter @corsair-dev/zenrows test:live`.
//
// Every call here is read-only and cheap: one Fetch of example.com, one crawl
// list, two Extract reads that cost no credits, and the plan. A crawl is not
// started, because each page it opens is billed.
const KEY = process.env.ZENROWS_API_KEY;
const describeIfKey = KEY ? describe : describe.skip;

if (!KEY) {
	console.warn('ZENROWS_API_KEY is not set; the live Zenrows suite is skipped');
}

describeIfKey('Zenrows live', () => {
	const apiKey = KEY as string;

	it('fetches a page as markdown', async () => {
		const response = await makeZenrowsRequest(apiKey, {
			method: 'GET',
			path: '/v1/',
			query: { url: 'https://example.com', response_type: 'markdown' },
		});
		// Zenrows labels every text mode text/plain, including Markdown.
		expect(response.bodyFormat).toBe('text');
		// The converter drops the page's <title> and <h1>, so the body of the
		// paragraph is what proves a real page came back.
		expect(response.text).toContain('documentation examples');
		expect(response.text.trim().length).toBeGreaterThan(20);
	});

	it('returns structured fields from a prepared domain', async () => {
		const response = await makeZenrowsRequest(apiKey, {
			method: 'GET',
			path: '/v1/',
			query: {
				url: 'https://www.scrapingcourse.com/ecommerce/product/abominable-hoodie/',
				extract: 'native',
			},
		});
		const body = ZenRowsEndpointOutputSchemas.fetchExtract.parse(
			parseJsonBody(response, '/v1/'),
		);
		expect(typeof body.html).toBe('string');
		expect(body.parsed).toBeDefined();
		expect(Object.keys(body.parsed ?? {}).length).toBeGreaterThan(0);
	});

	it('pulls emails and links out of a page with output filters', async () => {
		const response = await makeZenrowsRequest(apiKey, {
			method: 'GET',
			path: '/v1/',
			query: { url: 'https://example.com', outputs: 'emails,links' },
		});
		const body = ZenRowsEndpointOutputSchemas.fetchOutputs.parse(
			parseJsonBody(response, '/v1/'),
		);
		expect(body).toHaveProperty('emails');
		expect(Array.isArray(body.links)).toBe(true);
	});

	it('lists crawls', async () => {
		const response = await makeZenrowsRequest(apiKey, {
			method: 'GET',
			path: '/v1/crawls',
			query: { limit: 2 },
		});
		const body = ZenRowsEndpointOutputSchemas.crawlList.parse(
			parseJsonBody(response, '/v1/crawls'),
		);
		expect(Array.isArray(body.crawls)).toBe(true);
	});

	it('reads the plan behind the key', async () => {
		const response = await makeZenrowsRequest(apiKey, {
			method: 'GET',
			path: '/v1/subscriptions/self/details',
		});
		const body = ZenRowsEndpointOutputSchemas.accountSubscription.parse(
			parseJsonBody(response, '/v1/subscriptions/self/details'),
		);
		expect(typeof body.status).toBe('string');
		expect(typeof body.credit_limit).toBe('number');
	});

	it('reads the Extract preparation allowance without spending credits', async () => {
		const response = await makeZenrowsRequest(apiKey, {
			method: 'GET',
			path: '/v1/extract/prepared-domains/allowance',
		});
		const body = ZenRowsEndpointOutputSchemas.extractAllowance.parse(
			parseJsonBody(response, '/v1/extract/prepared-domains/allowance'),
		);
		expect(typeof body.limit).toBe('number');
		expect(body.month).toMatch(/^\d{4}-\d{2}$/);
	});

	it('rejects a bad key with Zenrows own code', async () => {
		const error = await captureError(
			makeZenrowsRequest('bogus-key', {
				method: 'GET',
				path: '/v1/crawls',
			}),
		);
		expect((error as { code?: string }).code).toBe('AUTH002');
		expect((error as { status?: number }).status).toBe(401);
	});
});
