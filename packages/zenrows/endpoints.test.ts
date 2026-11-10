import {
	ZenRowsEndpointInputSchemas,
	ZenRowsEndpointOutputSchemas,
	ZenrowsProblemSchema,
} from './endpoints/types';
import {
	bareNotFound,
	crawlPage,
	crawlStarted,
	crawlSummary,
	extractAllowance,
	extractPreparation,
	extractServedDomain,
	jsonResponseEnvelope,
	productsExtract,
	selectorsResult,
	subscriptionDetails,
	textPage,
	usageExceeded,
} from './test-fixtures';

describe('output schemas parse real answers', () => {
	it('fetch.page keeps the text and the mode', () => {
		const output = ZenRowsEndpointOutputSchemas.fetchPage.parse({
			body: textPage.markdown,
			contentType: 'text/plain',
			responseType: 'markdown',
		});
		expect(output.body).toBe(textPage.markdown);
		expect(output.responseType).toBe('markdown');
	});

	it('fetch.extract keeps the open parsed object', () => {
		const output =
			ZenRowsEndpointOutputSchemas.fetchExtract.parse(productsExtract);
		expect(output.parsed).toEqual(productsExtract.parsed);
		expect(output.html).toBe(productsExtract.html);
	});

	it('fetch.extract accepts an answer with no html field', () => {
		const output = ZenRowsEndpointOutputSchemas.fetchExtract.parse({
			parsed: { product: { name: 'Hoodie' } },
		});
		expect(output.html).toBeUndefined();
	});

	it('fetch.cssExtract keeps the keys and a null selector result', () => {
		expect(
			ZenRowsEndpointOutputSchemas.fetchCssExtract.parse(selectorsResult),
		).toEqual(selectorsResult);
		expect(
			ZenRowsEndpointOutputSchemas.fetchCssExtract.parse({ missing: '' }),
		).toEqual({ missing: '' });
	});

	it('fetch.outputs keeps a null and an empty filter result', () => {
		const payload = {
			emails: null,
			phone_numbers: [],
			links: ['https://a.test'],
		};
		expect(ZenRowsEndpointOutputSchemas.fetchOutputs.parse(payload)).toEqual(
			payload,
		);
	});

	it('fetch.jsonResponse reads the envelope and tolerates a missing report', () => {
		const output =
			ZenRowsEndpointOutputSchemas.fetchJsonResponse.parse(
				jsonResponseEnvelope,
			);
		expect(output.html).toBe(jsonResponseEnvelope.html);
		expect(output.xhr).toEqual([]);
		expect(output.js_instructions_report).toBeNull();

		const withoutReport = ZenRowsEndpointOutputSchemas.fetchJsonResponse.parse({
			html: '<html></html>',
			xhr: [],
		});
		expect(withoutReport.js_instructions_report).toBeUndefined();
	});

	it('fetch.post keeps a forwarded text answer', () => {
		const output = ZenRowsEndpointOutputSchemas.fetchPost.parse({
			body: 'ok',
			contentType: 'text/plain',
		});
		expect(output).toEqual({ body: 'ok', contentType: 'text/plain' });
	});

	it('crawl.start reads the running crawl with an empty result page', () => {
		const output = ZenRowsEndpointOutputSchemas.crawlStart.parse(crawlStarted);
		expect(output.crawl_id).toBe(crawlStarted.crawl_id);
		expect(output.status).toBe('running');
		expect(output.results).toEqual([]);
	});

	it('crawl.list reads a page and a last page with no cursor', () => {
		const page = ZenRowsEndpointOutputSchemas.crawlList.parse({
			crawls: [crawlSummary],
			next_cursor: 'cur_2',
		});
		expect(page.crawls[0]?.status).toBe('completed');
		expect(page.next_cursor).toBe('cur_2');

		const last = ZenRowsEndpointOutputSchemas.crawlList.parse({
			crawls: [crawlSummary],
		});
		expect(last.next_cursor).toBeUndefined();
	});

	it('crawl.get reads results and a null cursor', () => {
		const output = ZenRowsEndpointOutputSchemas.crawlGet.parse(crawlPage);
		expect(output.results?.[0]?.content_url).toContain('/contents/');
		expect(output.next_cursor).toBeNull();
	});

	it('crawl.getContent reads an HTML page served as text', () => {
		const output = ZenRowsEndpointOutputSchemas.crawlGetContent.parse({
			body: '<!doctype html><html></html>',
			contentType: 'text/html; charset=utf-8',
		});
		expect(output.body).toContain('doctype');
	});

	it('crawl.stop reads only the four fields the stop answers', () => {
		const output = ZenRowsEndpointOutputSchemas.crawlStop.parse({
			crawl_id: 'c_01M72F709NDF8XFBYKBXRZ3QFA',
			status: 'completed',
			stop_reason: 'max_pages',
			finished_at: '2026-11-10T10:14:20.445560976Z',
		});
		expect(output.stop_reason).toBe('max_pages');
	});

	it('extract.domains reads a domain with its verticals', () => {
		const output = ZenRowsEndpointOutputSchemas.extractDomains.parse({
			domains: [extractServedDomain],
		});
		expect(output.domains[0]?.verticals).toEqual(['Shopping']);
	});

	it('extract.prepareDomain reads a record with roles and no failure', () => {
		const output =
			ZenRowsEndpointOutputSchemas.extractPrepareDomain.parse(
				extractPreparation,
			);
		expect(output.status).toBe('preparing');
		expect(output.roles).toHaveLength(1);
	});

	it('extract.prepareDomain reads a failed preparation with its failure', () => {
		const output = ZenRowsEndpointOutputSchemas.extractPrepareDomain.parse({
			...extractPreparation,
			status: 'failed',
			state: 'failed',
			failure: {
				code: 'unpreparable',
				detail: 'The site blocks automated access.',
				slot_consumed: false,
			},
		});
		expect(output.failure?.code).toBe('unpreparable');
		expect(output.failure?.slot_consumed).toBe(false);
	});

	it('extract.listPreparedDomains reads the allowance beside the submissions', () => {
		const output =
			ZenRowsEndpointOutputSchemas.extractListPreparedDomains.parse({
				allowance: extractAllowance,
				domains: [],
			});
		expect(output.allowance?.month).toBe('2026-11');
		expect(output.domains).toEqual([]);
	});

	it('extract.allowance reads the four counts', () => {
		expect(
			ZenRowsEndpointOutputSchemas.extractAllowance.parse(extractAllowance),
		).toEqual(extractAllowance);
	});

	it('account.subscription reads per-product usage and concurrency', () => {
		const output =
			ZenRowsEndpointOutputSchemas.accountSubscription.parse(
				subscriptionDetails,
			);
		expect(output.plan?.products?.api?.concurrency?.limit).toBe(5);
		expect(output.credit_limit).toBe(5000);
		expect(output.api_key?.caps).toEqual([]);
	});

	it('reads a problem body', () => {
		expect(ZenrowsProblemSchema.parse(usageExceeded).code).toBe('AUTH004');
		expect(ZenrowsProblemSchema.parse(bareNotFound).code).toBeUndefined();
	});
});

describe('output schemas reject the wrong shape', () => {
	it('rejects a crawl page whose results are not objects', () => {
		expect(() =>
			ZenRowsEndpointOutputSchemas.crawlGet.parse({
				crawl_id: 'c_1',
				status: 'completed',
				results: ['https://example.com'],
			}),
		).toThrow();
	});

	it('rejects a crawl row with no id, rather than inventing one', () => {
		expect(() =>
			ZenRowsEndpointOutputSchemas.crawlList.parse({
				crawls: [{ status: 'x' }],
			}),
		).toThrow();
	});

	it('rejects a subscription whose usage is a string', () => {
		expect(() =>
			ZenRowsEndpointOutputSchemas.accountSubscription.parse({
				...subscriptionDetails,
				usage_credits: '10',
			}),
		).toThrow();
	});

	it('rejects a text answer with no body', () => {
		expect(() =>
			ZenRowsEndpointOutputSchemas.fetchPage.parse({
				contentType: 'text/plain',
				responseType: 'html',
			}),
		).toThrow();
	});

	it('rejects a cssExtract answer that is an array', () => {
		expect(() =>
			ZenRowsEndpointOutputSchemas.fetchCssExtract.parse([{ title: 'x' }]),
		).toThrow();
	});
});

describe('input schemas pin the provider rules', () => {
	it('rejects a crawl page size over the documented maximum', () => {
		expect(() =>
			ZenRowsEndpointInputSchemas.crawlList.parse({ limit: 101 }),
		).toThrow();
		expect(
			ZenRowsEndpointInputSchemas.crawlList.parse({ limit: 100 }).limit,
		).toBe(100);
	});

	it('rejects a crawl result page size over 10000', () => {
		expect(() =>
			ZenRowsEndpointInputSchemas.crawlGet.parse({
				crawlId: 'c_1',
				limit: 10001,
			}),
		).toThrow();
	});

	it('rejects an unknown block resource and accepts every documented one', () => {
		expect(() =>
			ZenRowsEndpointInputSchemas.fetchPage.parse({
				url: 'https://example.com',
				// `document` answers 400 from the live API.
				blockResources: ['document'],
			}),
		).toThrow();
		expect(
			ZenRowsEndpointInputSchemas.fetchPage.parse({
				url: 'https://example.com',
				blockResources: ['image', 'font', 'texttrack'],
			}).blockResources,
		).toEqual(['image', 'font', 'texttrack']);
	});

	it('rejects a country code that is not two letters', () => {
		expect(() =>
			ZenRowsEndpointInputSchemas.fetchPage.parse({
				url: 'https://example.com',
				jsRender: true,
				premiumProxy: true,
				proxyCountry: 'usa',
			}),
		).toThrow(/two-letter/);
	});

	it('rejects a session id that is not a positive integer', () => {
		expect(() =>
			ZenRowsEndpointInputSchemas.fetchPage.parse({
				url: 'https://example.com',
				sessionId: 0,
			}),
		).toThrow();
		expect(() =>
			ZenRowsEndpointInputSchemas.fetchPage.parse({
				url: 'https://example.com',
				sessionId: 1.5,
			}),
		).toThrow();
	});

	it('rejects an example URL list over five and accepts one', () => {
		expect(() =>
			ZenRowsEndpointInputSchemas.extractPrepareDomain.parse({
				domain: 'example.com',
				exampleUrls: Array.from(
					{ length: 6 },
					(_value, index) => `https://example.com/${index}`,
				),
			}),
		).toThrow();
		expect(
			ZenRowsEndpointInputSchemas.extractPrepareDomain.parse({
				domain: 'example.com',
				exampleUrls: ['https://example.com/1'],
			}).exampleUrls,
		).toHaveLength(1);
	});

	it('rejects a malformed problem body field it does read', () => {
		expect(() => ZenrowsProblemSchema.parse({ status: '404' })).toThrow();
		expect(() =>
			ZenRowsEndpointOutputSchemas.crawlStart.parse({
				...crawlStarted,
				coverage: { pages_fetched: 'many' },
			}),
		).toThrow();
	});
});
