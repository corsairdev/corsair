import { logEventFromContext } from 'corsair/core';
import { OpengraphAPIError } from './client';
import {
	Brand,
	Extract,
	Markdown,
	Oembed,
	Query,
	Scrape,
	Screenshot,
	Site,
} from './endpoints';
import {
	blockedError,
	brandResponse,
	extractResponse,
	extractSanitizedResponse,
	flatError,
	markdownChunkedResponse,
	markdownResponse,
	oembedResponse,
	queryResponse,
	scrapeLiveHtml,
	scrapeResponse,
	screenshotResponse,
	siteResponse,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const APP_ID = 'og-test-id';

// Parameters are contravariant, so every concrete endpoint is assignable to
// the never-parameter function type; T keeps each call's own output type.
// unknown: negative cases pass values no schema accepts.
function invoke<T>(
	endpoint: (ctx: never, input: never) => Promise<T>,
	input: unknown,
): Promise<T> {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint({ key: APP_ID } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://opengraph.io');
	expect(sent.query.app_id).toBe(APP_ID);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function rejectsWith(
	promise: Promise<unknown>,
): Promise<OpengraphAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(OpengraphAPIError);
	if (!(error instanceof OpengraphAPIError)) throw error;
	return error;
}

beforeEach(() => {
	// An unqueued call must fail instead of reaching the network.
	fetchMock = jest
		.spyOn(globalThis, 'fetch')
		.mockRejectedValue(new Error('unmocked fetch'));
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('site.get', () => {
	it('GETs 3.0/site with the encoded URL and passes filters', async () => {
		respond(siteResponse);

		const result = await invoke(Site.get, {
			url: 'https://github.com/',
			use_proxy: true,
			max_cache_age: 3600,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/3.0/site/https%3A%2F%2Fgithub.com%2F',
			body: undefined,
		});
		expect(lastRequest().query).toEqual({
			app_id: APP_ID,
			use_proxy: 'true',
			max_cache_age: '3600',
		});
		expect(result.hybridGraph?.title).toBe("GitHub: Let's build from here");
		expect(result.openGraph?.image).toEqual({ url: expect.any(String) });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'opengraph.site.get',
			{ url: 'https://github.com/' },
			'completed',
		);
	});

	it('keeps fields it does not know', async () => {
		respond({ hybridGraph: { title: 't', brand_new: 'kept' } });

		const result = await invoke(Site.get, { url: 'https://example.com' });

		expect(result.hybridGraph).toEqual({ title: 't', brand_new: 'kept' });
	});

	it('surfaces a flat 401 as OpengraphAPIError', async () => {
		respond(flatError, 401);

		const error = await rejectsWith(
			invoke(Site.get, {
				url: 'https://example.com',
			}),
		);
		expect(error.status).toBe(401);
		expect(error.code).toBe('INVALID_APP_ID');
	});

	it.each([[{}], [{ url: '' }], [{ url: 'x', proxy_country: 'usa' }]])(
		'rejects input %j',
		async (input) => {
			await expect(invoke(Site.get, input)).rejects.toBeInstanceOf(Error);
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
});

describe('scrape.fetch', () => {
	it('GETs 3.0/scrape and returns the HTML', async () => {
		respond(scrapeResponse);

		const result = await invoke(Scrape.fetch, {
			url: 'https://example.com',
			full_render: true,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/3.0/scrape/https%3A%2F%2Fexample.com',
		});
		expect(lastRequest().query.full_render).toBe('true');
		expect(result.htmlContent).toBe('<!DOCTYPE html><html>...</html>');
		expect(result.requestInfo?.responseContentType).toBe('text/html');
	});

	it('wraps the text/plain HTML the live API returns', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(scrapeLiveHtml, {
				status: 200,
				headers: { 'Content-Type': 'text/plain; charset=utf-8' },
			}),
		);

		const result = await invoke(Scrape.fetch, { url: 'https://example.com' });

		expect(result.htmlContent).toBe(scrapeLiveHtml);
		expect(result.requestInfo).toBeUndefined();
	});

	it('surfaces a blocked target as a 403', async () => {
		respond(blockedError, 403);

		const error = await rejectsWith(
			invoke(Scrape.fetch, {
				url: 'https://example.com',
			}),
		);
		expect(error.status).toBe(403);
	});

	it('rejects a missing url', async () => {
		await expect(invoke(Scrape.fetch, {})).rejects.toBeInstanceOf(Error);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('screenshot.capture', () => {
	it('GETs 3.0/screenshot with capture options', async () => {
		respond(screenshotResponse);

		const result = await invoke(Screenshot.capture, {
			url: 'https://example.com',
			format: 'webp',
			quality: 80,
			dimensions: 'lg',
			full_page: true,
			exclude_selectors: '.header,.footer',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/3.0/screenshot/https%3A%2F%2Fexample.com',
		});
		expect(lastRequest().query).toMatchObject({
			format: 'webp',
			quality: '80',
			dimensions: 'lg',
			full_page: 'true',
			exclude_selectors: '.header,.footer',
		});
		expect(result.screenshotUrl).toBe(
			'https://cdn.opengraph.io/screenshots/abc123.png',
		);
		expect(result.dimensions).toEqual({ width: 1280, height: 800 });
	});

	it('rejects an out-of-range quality', async () => {
		await expect(
			invoke(Screenshot.capture, { url: 'https://example.com', quality: 90 }),
		).rejects.toBeInstanceOf(Error);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('extract.run', () => {
	it('POSTs 3.0/extract with selectors in the body and options in the query', async () => {
		respond(extractResponse);

		const result = await invoke(Extract.run, {
			site: 'https://example.com',
			selectors: {
				heading: { selector: 'h1', type: 'text' },
				allLinks: { selector: 'a', multiple: true, type: 'attr', attr: 'href' },
			},
			load_more_clicks: 3,
			ai_sanitize: true,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/3.0/extract',
		});
		expect(lastRequest().body).toEqual({
			site: 'https://example.com',
			selectors: {
				heading: { selector: 'h1', type: 'text' },
				allLinks: { selector: 'a', multiple: true, type: 'attr', attr: 'href' },
			},
			load_more_clicks: 3,
		});
		expect(lastRequest().query).toEqual({
			app_id: APP_ID,
			ai_sanitize: 'true',
		});
		expect(result.data).toEqual({
			heading: 'Example Domain',
			allLinks: ['https://www.iana.org/domains/example'],
		});
		expect(result.concatenatedText).toContain('Example Domain');
	});

	it('accepts a sanitized response, whose signals come back as an object', async () => {
		respond(extractSanitizedResponse);

		const result = await invoke(Extract.run, {
			site: 'https://example.com',
			ai_sanitize: true,
		});

		expect(lastRequest().query.ai_sanitize).toBe('true');
		expect(result.ai_safety).toEqual({
			risk_score: 0.02,
			risk_level: 'low',
			signals: {},
		});
	});

	it('rejects a selector config without a selector', async () => {
		await expect(
			invoke(Extract.run, {
				site: 'https://example.com',
				selectors: { a: {} },
			}),
		).rejects.toBeInstanceOf(Error);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an attr selector without the attribute to read', async () => {
		await expect(
			invoke(Extract.run, {
				site: 'https://example.com',
				selectors: { links: { selector: 'a', type: 'attr' } },
			}),
		).rejects.toBeInstanceOf(Error);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('query.run', () => {
	it('POSTs 3.0/query with the question and structure in the body', async () => {
		respond(queryResponse);

		const result = await invoke(Query.run, {
			url: 'https://example.com',
			query: 'What does this page offer?',
			responseStructure: { products: ['string'] },
			modelSize: 'mini',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/3.0/query/https%3A%2F%2Fexample.com',
		});
		expect(lastRequest().body).toEqual({
			query: 'What does this page offer?',
			responseStructure: { products: ['string'] },
			modelSize: 'mini',
		});
		expect(result.answer).toEqual({
			headline: 'Welcome to Example',
			products: ['Product A', 'Product B', 'Product C'],
		});
	});

	it('rejects a missing question', async () => {
		await expect(
			invoke(Query.run, { url: 'https://example.com' }),
		).rejects.toBeInstanceOf(Error);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('oembed.get', () => {
	it('GETs 3.0/oembed with sizing and styling options', async () => {
		respond(oembedResponse);

		const result = await invoke(Oembed.get, {
			url: 'https://example.com/article',
			maxwidth: 640,
			theme: 'dark',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/3.0/oembed/https%3A%2F%2Fexample.com%2Farticle',
		});
		expect(lastRequest().query).toMatchObject({
			maxwidth: '640',
			theme: 'dark',
		});
		expect(result.source).toBe('og_frame');
		expect(result.html).toContain('<iframe');
	});

	it('surfaces a resolution failure as a 422', async () => {
		respond(
			{
				success: false,
				error: {
					code: 'oembed_resolution_failed',
					message: 'Unable to resolve an embed for this URL.',
					stage: 'fallback',
					details: null,
				},
			},
			422,
		);

		const error = await rejectsWith(
			invoke(Oembed.get, {
				url: 'https://example.com',
			}),
		);
		expect(error.status).toBe(422);
		expect(error.code).toBe('oembed_resolution_failed');
	});
});

describe('markdown.get', () => {
	it('GETs 3.0/markdown and always asks for the JSON envelope', async () => {
		respond(markdownChunkedResponse);

		const result = await invoke(Markdown.get, {
			url: 'https://en.wikipedia.org/wiki/Web_scraping',
			chunking: true,
			chunk_size: 1200,
			query: 'legal issues',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/3.0/markdown/https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FWeb_scraping',
		});
		expect(lastRequest().query).toMatchObject({
			format: 'json',
			chunking: 'true',
			chunk_size: '1200',
			query: 'legal issues',
		});
		expect(result.markdown).toContain('# Example Article');
		expect(result.chunks?.[0]?.heading_path).toEqual([
			'Getting Started',
			'Installation',
		]);
		expect(result.usage?.chunk_count).toBe(12);
	});

	it('parses the plain envelope without chunks', async () => {
		respond(markdownResponse);

		const result = await invoke(Markdown.get, {
			url: 'https://example.com/article',
		});

		expect(result.chunks).toBeUndefined();
		expect(result.metadata?.canonical_url).toBe('https://example.com/article');
		expect(result.debug?.full_render_used).toBe(false);
	});

	it('rejects a chunk size out of range', async () => {
		await expect(
			invoke(Markdown.get, { url: 'https://example.com', chunk_size: 100 }),
		).rejects.toBeInstanceOf(Error);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it.each([
		[{ chunk_size: 200, chunk_overlap: 101 }],
		[{ chunk_overlap: 1001 }],
	])('rejects an overlap above half the chunk size: %j', async (options) => {
		await expect(
			invoke(Markdown.get, { url: 'https://example.com', ...options }),
		).rejects.toBeInstanceOf(Error);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('sends the retry controls', async () => {
		respond(markdownResponse);

		await invoke(Markdown.get, {
			url: 'https://example.com',
			retry: true,
			max_retries: 2,
			retry_escalate: false,
		});

		expect(lastRequest().query).toMatchObject({
			retry: 'true',
			max_retries: '2',
			retry_escalate: 'false',
		});
	});

	it('rejects max_retries outside 1-4', async () => {
		await expect(
			invoke(Markdown.get, { url: 'https://example.com', max_retries: 5 }),
		).rejects.toBeInstanceOf(Error);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts an overlap of exactly half the default chunk size', async () => {
		respond(markdownChunkedResponse);

		await invoke(Markdown.get, {
			url: 'https://example.com',
			chunking: true,
			chunk_overlap: 1000,
		});

		expect(lastRequest().query.chunk_overlap).toBe('1000');
	});
});

describe('brand.analyze', () => {
	it('GETs 1.1/brand for a plain request', async () => {
		respond(brandResponse);

		const result = await invoke(Brand.analyze, {
			url: 'https://asana.com',
			include_meta: true,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/1.1/brand/https%3A%2F%2Fasana.com',
			body: undefined,
		});
		expect(lastRequest().query).toEqual({
			app_id: APP_ID,
			include_meta: 'true',
		});
		expect(result.brand?.name).toBe('Asana');
		expect(result.identity?.colors?.[0]).toEqual({
			hex: '#690031',
			role: 'primary',
		});
	});

	it('POSTs sections and questions in a JSON body', async () => {
		respond({
			...brandResponse,
			custom: { buying_triggers: ['end of quarter'] },
		});

		const result = await invoke(Brand.analyze, {
			url: 'https://asana.com',
			sections: { visual: false, links: false },
			questions: [
				{
					key: 'buying_triggers',
					question:
						'What situations would make someone likely to buy from this company?',
					type: 'string[]',
				},
			],
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/1.1/brand/https%3A%2F%2Fasana.com',
		});
		expect(lastRequest().body).toEqual({
			sections: { visual: false, links: false },
			questions: [
				{
					key: 'buying_triggers',
					question:
						'What situations would make someone likely to buy from this company?',
					type: 'string[]',
				},
			],
		});
		expect(result.custom).toEqual({ buying_triggers: ['end of quarter'] });
	});

	it('keeps null sections, which brand sends when analysis failed', async () => {
		respond({
			brand: brandResponse.brand,
			identity: null,
			products: [],
			audiences: [],
		});

		const result = await invoke(Brand.analyze, { url: 'https://asana.com' });

		expect(result.brand?.name).toBe('Asana');
		expect(result.identity).toBeNull();
		expect(result.products).toEqual([]);
	});

	it.each([
		[
			'a repeated key',
			[
				{ key: 'pricing', question: 'What does it cost?' },
				{ key: 'pricing', question: 'Is there a free plan?' },
			],
		],
		...['__proto__', 'constructor', 'prototype'].map((key) => [
			`the reserved key ${key}`,
			[{ key, question: 'Anything?' }],
		]),
	])('rejects %s in questions', async (_label, questions) => {
		await expect(
			invoke(Brand.analyze, { url: 'https://asana.com', questions }),
		).rejects.toBeInstanceOf(Error);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects more than three questions', async () => {
		await expect(
			invoke(Brand.analyze, {
				url: 'https://asana.com',
				questions: [1, 2, 3, 4].map((i) => ({
					key: `q${i}`,
					question: `Question ${i}?`,
				})),
			}),
		).rejects.toBeInstanceOf(Error);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
