import { AuthMissingError, logEventFromContext } from 'corsair/core';
import {
	BrowserlessRateLimitError,
	browserlessUrl,
	requestAbortMs,
	requestBrowserlessJson,
} from './client';
import {
	contentGet,
	downloadCreate,
	functionRun,
	pdfCreate,
	scrapeCreate,
	screenshotCreate,
	unblockCreate,
} from './endpoints/rest';
import {
	BrowserlessEndpointInputSchemas,
	BrowserlessEndpointOutputSchemas,
} from './endpoints/types';
import { browserless } from './index';

jest.mock('corsair/core', () => {
	class AuthMissingError extends Error {
		constructor(plugin: string, authType: string) {
			super(`Missing ${authType} for ${plugin}`);
			this.name = 'AuthMissingError';
		}
	}
	return {
		AuthMissingError,
		logEventFromContext: jest.fn(),
	};
});

const mockFetch = jest.fn();
const originalFetch = globalThis.fetch;

beforeAll(() => {
	globalThis.fetch = mockFetch as typeof fetch;
});

afterAll(() => {
	globalThis.fetch = originalFetch;
});

beforeEach(() => {
	mockFetch.mockReset();
	jest.mocked(logEventFromContext).mockReset();
});

const mockCtx = {
	key: 'tok-test',
	$getAccountId: async () => 'test-account',
} as never;

function lastCall(): { url: string; init: RequestInit } {
	expect(mockFetch).toHaveBeenCalled();
	const [input, init] = mockFetch.mock.calls[0] as [
		string | URL | Request,
		RequestInit | undefined,
	];
	const url =
		typeof input === 'string'
			? input
			: input instanceof URL
				? input.toString()
				: input.url;
	return { url, init: init ?? {} };
}

describe('Browserless plugin & client tests', () => {
	it('creates plugin instance with the seven official REST ops', () => {
		const plugin = browserless({ key: 'tok-test' });
		expect(plugin.id).toBe('browserless');
		expect(plugin.authConfig?.api_key?.account).toEqual(['one']);
		expect(plugin.endpoints?.content.get).toBeDefined();
		expect(plugin.endpoints?.screenshot.create).toBeDefined();
		expect(plugin.endpoints?.pdf.create).toBeDefined();
		expect(plugin.endpoints?.scrape.create).toBeDefined();
		expect(plugin.endpoints?.function.run).toBeDefined();
		expect(plugin.endpoints?.unblock.create).toBeDefined();
		expect(plugin.endpoints?.download.create).toBeDefined();
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		const plugin = browserless();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => undefined },
				} as never,
				'endpoint',
			),
		).rejects.toThrow(AuthMissingError);
	});

	it('puts the token on the official query string', () => {
		expect(browserlessUrl('/content', 'tok-test', { stealth: true })).toBe(
			'https://production-sfo.browserless.io/content?token=tok-test&stealth=true',
		);
	});

	it('aborts after official timeout plus transfer grace', () => {
		expect(requestAbortMs()).toBe(90_000);
		expect(requestAbortMs({ timeout: 180_000 })).toBe(190_000);
	});

	it('POSTs /content and returns text/html', async () => {
		mockFetch.mockResolvedValue(
			new Response('<html><h1>Example</h1></html>', {
				headers: { 'Content-Type': 'text/html' },
			}),
		);
		const input = BrowserlessEndpointInputSchemas.contentGet.parse({
			url: 'https://example.com/',
		});
		const result = await contentGet(mockCtx, input);
		expect(result.html).toContain('Example');
		BrowserlessEndpointOutputSchemas.contentGet.parse(result);
		expect(lastCall().url).toContain(
			'https://production-sfo.browserless.io/content?token=tok-test',
		);
		expect(lastCall().init.method).toBe('POST');
	});

	it('POSTs /screenshot and returns base64', async () => {
		mockFetch.mockResolvedValue(
			new Response(Buffer.from('png-bytes'), {
				headers: { 'Content-Type': 'image/png' },
			}),
		);
		const result = await screenshotCreate(mockCtx, {
			url: 'https://example.com/',
			options: { fullPage: true, type: 'png' },
		});
		expect(result.contentType).toBe('image/png');
		expect(result.base64.length).toBeGreaterThan(0);
		expect(lastCall().url).toContain('/screenshot?token=tok-test');
	});

	it('POSTs /pdf and returns application/pdf', async () => {
		mockFetch.mockResolvedValue(
			new Response(Buffer.from('%PDF-1.4'), {
				headers: {
					'Content-Type': 'application/pdf',
					'Content-Disposition': 'attachment; filename="output.pdf"',
				},
			}),
		);
		const result = await pdfCreate(mockCtx, {
			url: 'https://example.com/',
			options: { format: 'A4' },
		});
		expect(result.filename).toBe('output.pdf');
		expect(lastCall().url).toContain('/pdf?token=tok-test');
	});

	it('POSTs /scrape and parses official data[]', async () => {
		mockFetch.mockResolvedValue(
			new Response(
				JSON.stringify({
					data: [
						{
							selector: 'h1',
							results: [{ text: 'Hello', html: '<h1>Hello</h1>' }],
						},
					],
				}),
				{ headers: { 'Content-Type': 'application/json' } },
			),
		);
		const result = await scrapeCreate(mockCtx, {
			url: 'https://example.com/',
			elements: [{ selector: 'h1' }],
		});
		expect(result.data[0]?.results[0]?.text).toBe('Hello');
		BrowserlessEndpointOutputSchemas.scrapeCreate.parse(result);
		expect(lastCall().url).toContain('/scrape?token=tok-test');
	});

	it('POSTs /function as JSON { code }', async () => {
		mockFetch.mockResolvedValue(
			new Response(
				JSON.stringify({ data: { ok: true }, type: 'application/json' }),
				{
					headers: { 'Content-Type': 'application/json' },
				},
			),
		);
		const result = await functionRun(mockCtx, {
			code: 'export default async ({ page }) => ({ data: { ok: true }, type: "application/json" });',
		});
		expect(result.data).toEqual({
			data: { ok: true },
			type: 'application/json',
		});
		const req = lastCall();
		expect(req.url).toContain('/function?token=tok-test');
		expect(JSON.parse(String(req.init.body))).toEqual({
			code: expect.any(String),
		});
	});

	it('POSTs /unblock and parses official fields', async () => {
		mockFetch.mockResolvedValue(
			new Response(
				JSON.stringify({
					content: '<html></html>',
					cookies: [],
					screenshot: null,
					browserWSEndpoint: null,
				}),
				{ headers: { 'Content-Type': 'application/json' } },
			),
		);
		const result = await unblockCreate(mockCtx, {
			url: 'https://example.com/',
			content: true,
			stealth: true,
		});
		expect(result.content).toBe('<html></html>');
		expect(lastCall().url).toContain('stealth=true');
		expect(JSON.parse(String(lastCall().init.body)).stealth).toBeUndefined();
	});

	it('POSTs /download as application/javascript when there is no context', async () => {
		mockFetch.mockResolvedValue(
			new Response('a,b\n1,2', {
				headers: {
					'Content-Type': 'text/csv',
					'Content-Disposition': 'attachment; filename="books.csv"',
				},
			}),
		);
		const result = await downloadCreate(mockCtx, {
			code: 'export default async ({ page }) => {};',
		});
		expect(result.filename).toBe('books.csv');
		expect(lastCall().init.headers).toMatchObject({
			'Content-Type': 'application/javascript',
		});
	});

	it('rejects unofficial scrape payloads', async () => {
		mockFetch.mockResolvedValue(
			new Response(JSON.stringify({ items: [] }), {
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		await expect(
			scrapeCreate(mockCtx, {
				url: 'https://example.com/',
				elements: [{ selector: 'h1' }],
			}),
		).rejects.toThrow();
	});

	it('maps 401 to BrowserlessAPIError', async () => {
		mockFetch.mockResolvedValue(
			new Response(JSON.stringify({ message: 'Unauthorized' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		await expect(
			requestBrowserlessJson('/scrape', 'bad'),
		).rejects.toMatchObject({
			name: 'BrowserlessAPIError',
			status: 401,
		});
	});

	it('maps 429 to BrowserlessRateLimitError', async () => {
		mockFetch.mockResolvedValue(
			new Response('rate limited', {
				status: 429,
				headers: { 'Retry-After': '3' },
			}),
		);
		const err = await requestBrowserlessJson('/scrape', 'tok-test').catch(
			(e: unknown) => e,
		);
		expect(err).toBeInstanceOf(BrowserlessRateLimitError);
		expect((err as BrowserlessRateLimitError).retryAfterMs).toBe(3000);
	});
});
