import { logEventFromContext } from 'corsair/core';
import { CustomjsAPIError, SCRAPE_TIMEOUT_MS } from './client';
import {
	AuthEndpoints,
	Javascript,
	Pages,
	Pdf,
	Scrape,
	Screenshot,
} from './endpoints';
import {
	CustomjsEndpointInputSchemas,
	CustomjsEndpointOutputSchemas,
} from './endpoints/types';
import {
	authResponse,
	emptyFailure,
	invalidKey,
	pageCreated,
	pageListed,
	pageNotFound,
	pagesInvalidKey,
	pageUpdated,
	scrapeAgentResponse,
	scrapeCommandResponse,
	scriptThrew,
	tooManyRequests,
} from './test-fixtures';
import { captureError } from './test-helpers';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'cjs-test-key';

/**
 * `never` parameters: every concrete endpoint is assignable to this because
 * parameters are contravariant. Each endpoint returns its own output type, so the
 * shared return stays open, and each test asserts on the type it expects.
 */
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>; // unknown: differs per operation, asserted per test

/** Negative cases pass values no schema accepts. */
function invoke(
	endpoint: AnyEndpoint,
	input: unknown, // unknown: a bad input is the point of these cases
) {
	// The fake context only carries what the endpoints read.
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

/** Response bodies are arbitrary JSON, as the real API's are. */
function respondJson(
	body: unknown, // unknown: a fixture holds whatever a test wants to send
	status = 200,
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function respondText(body: string, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(body, {
			status,
			headers: { 'Content-Type': 'text/plain' },
		}),
	);
}

function respondBytes(body: Uint8Array, contentType: string, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(body, { status, headers: { 'Content-Type': contentType } }),
	);
}

/** The bytes every real PDF starts with, so a test proves real bytes moved. */
const PDF_BYTES = new Uint8Array([
	0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37,
]);
/** PNG magic bytes. */
const PNG_BYTES = new Uint8Array([
	0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		method: init.method,
		headers: new Headers(init.headers),
		// The request body is whatever the endpoint serialized, and each test
		// compares it against the shape it expects.
		body: init.body
			? (JSON.parse(String(init.body)) as object) // unknown: serialized body, compared per test
			: undefined,
	};
}

beforeEach(() => {
	// A spy with no queued response would fall through to the real fetch and send
	// a live request, so an unstubbed call fails instead.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(async () => {
		throw new Error('unmocked fetch: queue a response first');
	});
	mockLog.mockClear();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('auth.check', () => {
	it('GETs the key on the pages host and drops the credential fields', async () => {
		respondJson(authResponse);

		const result = await invoke(AuthEndpoints.check, {});

		const sent = lastRequest();
		expect(sent.origin).toBe('https://api.app.customjs.io');
		expect(sent.path).toBe(`/core/api-key/${API_KEY}`);
		expect(sent.method).toBe('GET');
		expect(sent.headers.get('x-api-key')).toBe(API_KEY);
		expect(sent.body).toBeUndefined();
		expect(result).toEqual({
			workspaceId: authResponse.workspaceId,
			name: 'Default',
			maxRequestCount: 20,
			inActive: false,
			createdAt: authResponse.createdAt,
			utmSource: authResponse.utmSource,
		});
	});

	// A read that returns a credential lets a read-only caller mint one.
	it('never returns the key or the JWT', async () => {
		respondJson(authResponse);

		const result = CustomjsEndpointOutputSchemas.authCheck.parse(
			await invoke(AuthEndpoints.check, {}),
		);

		expect(JSON.stringify(result)).not.toContain(API_KEY);
		expect(result).not.toHaveProperty('apiKey');
		expect(result).not.toHaveProperty('apiKeyData');
		expect(result).not.toHaveProperty('jwt');
	});

	// The live key lookup answers an unknown key with 404 and `{}`, not 401/403.
	it('reports an unknown key as an auth failure, not a missing route', async () => {
		respondJson({}, 404);

		const error = await captureError(invoke(AuthEndpoints.check, {}));

		expect(error).toBeInstanceOf(CustomjsAPIError);
		expect(error).toMatchObject({ status: 404, isAuthError: true });
		expect((error as Error).message).not.toContain(API_KEY);
	});

	it('surfaces an invalid key on the pages envelope', async () => {
		respondJson(pagesInvalidKey, 403);

		await expect(invoke(AuthEndpoints.check, {})).rejects.toMatchObject({
			status: 403,
			isAuthError: true,
			providerMessage: 'Invalid API Key',
		});
	});
});

describe('pdf.fromHtml', () => {
	it('POSTs the html and returns the bytes base64 encoded', async () => {
		respondBytes(PDF_BYTES, 'application/pdf');

		const result = await invoke(Pdf.fromHtml, { html: '<h1>Hello</h1>' });

		const sent = lastRequest();
		expect(sent.origin).toBe('https://e.customjs.io');
		expect(sent.path).toBe('/html2pdf');
		expect(sent.method).toBe('POST');
		expect(sent.headers.get('x-api-key')).toBe(API_KEY);
		expect(sent.headers.get('content-type')).toBe('application/json');
		expect(sent.body).toEqual({ input: { html: '<h1>Hello</h1>' } });
		expect(result).toEqual({
			base64: Buffer.from(PDF_BYTES).toString('base64'),
			contentType: 'application/pdf',
			byteLength: PDF_BYTES.length,
		});
	});

	it('sends data and page config only when they are given', async () => {
		respondBytes(PDF_BYTES, 'application/pdf');

		await invoke(Pdf.fromHtml, {
			html: '<h1>{{ name }}</h1>',
			data: { name: 'Jon' },
			config: { pdfWidthMm: 150, pdfHeightMm: 150 },
		});

		expect(lastRequest().body).toEqual({
			input: {
				html: '<h1>{{ name }}</h1>',
				data: { name: 'Jon' },
				config: { pdfWidthMm: 150, pdfHeightMm: 150 },
			},
		});
	});

	// The live route answers 200 with a blank PDF when html is missing, which
	// would look like a successful render.
	it.each([[{}], [{ html: '' }]])(
		'rejects %j before calling CustomJS',
		async (input) => {
			await expect(invoke(Pdf.fromHtml, input)).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);

	it('refuses to treat an empty body as a rendered file', async () => {
		respondBytes(new Uint8Array(), 'application/pdf');

		await expect(
			invoke(Pdf.fromHtml, { html: '<h1>Hello</h1>' }),
		).rejects.toMatchObject({
			status: 200,
			message: 'CustomJS returned an empty file',
		});
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('logs lengths and never the HTML itself', async () => {
		respondBytes(PDF_BYTES, 'application/pdf');

		await invoke(Pdf.fromHtml, {
			html: '<h1>Invoice for jordan@acme.example</h1>',
			data: { total: 100 },
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'customjs.pdf.fromHtml',
			{ htmlLength: 40, templated: true, byteLength: PDF_BYTES.length },
			'completed',
		);
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('@');
	});
});

describe('pdf.fromMarkdown', () => {
	it('POSTs the markdown under its own field name', async () => {
		respondBytes(PDF_BYTES, 'application/pdf');

		const result = await invoke(Pdf.fromMarkdown, { markdown: '# Report' });

		const sent = lastRequest();
		expect(sent.path).toBe('/markdown2pdf');
		expect(sent.body).toEqual({ input: { markdown: '# Report' } });
		expect(result).toEqual({
			base64: Buffer.from(PDF_BYTES).toString('base64'),
			contentType: 'application/pdf',
			byteLength: PDF_BYTES.length,
		});
	});

	it.each([[{}], [{ markdown: '' }]])(
		'rejects %j before calling CustomJS',
		async (input) => {
			await expect(invoke(Pdf.fromMarkdown, input)).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
});

describe('screenshot.capture', () => {
	it('POSTs the url and returns a PNG', async () => {
		respondBytes(PNG_BYTES, 'image/png');

		const result = await invoke(Screenshot.capture, {
			url: 'https://example.com',
		});

		const sent = lastRequest();
		expect(sent.path).toBe('/screenshot');
		expect(sent.body).toEqual({ input: { url: 'https://example.com' } });
		expect(result).toMatchObject({
			contentType: 'image/png',
			byteLength: PNG_BYTES.length,
		});
		expect(
			Buffer.from((result as { base64: string }).base64, 'base64'),
		).toEqual(Buffer.from(PNG_BYTES));
	});

	it('sends automation commands and the crop box in order', async () => {
		respondBytes(PNG_BYTES, 'image/png');

		await invoke(Screenshot.capture, {
			url: 'https://example.com',
			commands: [
				{ action: 'click', selector: '#accept-cookies' },
				{ action: 'type', selector: '#email', value: 'me@example.com' },
				{ action: 'wait', value: 1000 },
				{ action: 'scroll', value: 500 },
			],
			box: { x: 0, y: 0, width: 1200, height: 800 },
		});

		expect(lastRequest().body).toEqual({
			input: {
				url: 'https://example.com',
				commands: [
					{ action: 'click', selector: '#accept-cookies' },
					{ action: 'type', selector: '#email', value: 'me@example.com' },
					{ action: 'wait', value: 1000 },
					{ action: 'scroll', value: 500 },
				],
				box: { x: 0, y: 0, width: 1200, height: 800 },
			},
		});
	});

	it.each([
		[{}],
		[{ url: 'not-a-url' }],
		[{ url: 'https://example.com', commands: [{ action: 'hover' }] }],
		[{ url: 'https://example.com', commands: [{ action: 'click' }] }],
		[{ url: 'https://example.com', box: { x: 0, y: 0, width: 0, height: 10 } }],
	])('rejects %j before calling CustomJS', async (input) => {
		await expect(invoke(Screenshot.capture, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	// A URL can carry an access token in its query or path, so only the host is
	// logged.
	it('logs the host and step count, never the full URL or typed values', async () => {
		respondBytes(PNG_BYTES, 'image/png');

		await invoke(Screenshot.capture, {
			url: 'https://example.com/report?token=secret-token',
			commands: [{ action: 'type', selector: '#password', value: 'hunter2' }],
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'customjs.screenshot.capture',
			{
				host: 'example.com',
				commands: 1,
				cropped: false,
				byteLength: PNG_BYTES.length,
			},
			'completed',
		);
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('hunter2');
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('secret-token');
	});
});

describe('javascript.run', () => {
	it('POSTs the code and returns the text answer', async () => {
		respondText('Jon Doe');

		const result = await invoke(Javascript.run, {
			input: { name: 'Jon Doe' },
			code: 'return input.name',
		});

		const sent = lastRequest();
		expect(sent.path).toBe('/__js1-');
		expect(sent.headers.get('x-api-key')).toBe(API_KEY);
		expect(sent.body).toEqual({
			code: 'return input.name',
			input: { name: 'Jon Doe' },
		});
		expect(result).toEqual({ output: 'Jon Doe' });
	});

	// The route always answers text/plain, so an object return is JSON text.
	it('returns an object result as the JSON text CustomJS sent', async () => {
		respondText('{"sum":2,"ok":true}');

		const result = await invoke(Javascript.run, {
			input: { n: 1 },
			code: 'return { sum: input.n + 1, ok: true }',
		});

		expect(result).toEqual({ output: '{"sum":2,"ok":true}' });
	});

	it('returns an empty string for a script with no return', async () => {
		respondText('');

		await expect(
			invoke(Javascript.run, { code: 'const x = 1;' }),
		).resolves.toEqual({ output: '' });
	});

	it('returns the text null for a script returning null', async () => {
		respondText('null');

		await expect(
			invoke(Javascript.run, { code: 'return null' }),
		).resolves.toEqual({ output: 'null' });
	});

	it('omits input when the script needs none', async () => {
		respondText('1');

		await invoke(Javascript.run, { code: 'return 1' });

		expect(lastRequest().body).toEqual({ code: 'return 1' });
	});

	it('surfaces a thrown script error with its message', async () => {
		respondText(scriptThrew, 500);

		const error = await captureError(
			invoke(Javascript.run, { code: 'throw new Error("boom from script")' }),
		);

		expect(error).toBeInstanceOf(CustomjsAPIError);
		expect(error).toMatchObject({
			status: 500,
			providerMessage: 'boom from script',
			// The code may already have written something, so a 5xx is never replayed.
			replayable: false,
		});
		expect((error as CustomjsAPIError).message).toBe(
			'CustomJS 500: boom from script',
		);
	});

	it.each([[{}], [{ code: '' }]])(
		'rejects %j before calling CustomJS',
		async (input) => {
			await expect(invoke(Javascript.run, input)).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);

	// The code can hold a credential, so it is never logged.
	it('logs the code length and not the code', async () => {
		respondText('ok');

		await invoke(Javascript.run, {
			code: 'const key = "secret-value"; return key',
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'customjs.javascript.run',
			{ codeLength: 38, outputLength: 2 },
			'completed',
		);
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('secret-value');
	});
});

describe('javascript.runBinary', () => {
	it('sends returnBinary and returns the bytes', async () => {
		respondBytes(PDF_BYTES, 'application/pdf');

		const result = await invoke(Javascript.runBinary, {
			input: { html: '<h1>Hello</h1>' },
			code: 'const { HTML2PDF } = require("./utils"); return HTML2PDF(input.html);',
		});

		expect(lastRequest().body).toEqual({
			code: 'const { HTML2PDF } = require("./utils"); return HTML2PDF(input.html);',
			returnBinary: 'true',
			input: { html: '<h1>Hello</h1>' },
		});
		expect(result).toEqual({
			base64: Buffer.from(PDF_BYTES).toString('base64'),
			contentType: 'application/pdf',
			byteLength: PDF_BYTES.length,
		});
	});
});

describe('scrape.page', () => {
	it('logs the host, never the full URL', async () => {
		respondJson(scrapeCommandResponse);

		await invoke(Scrape.page, {
			url: 'https://example.com/private?token=secret-token',
			commands: [{ action: 'extract', selector: 'h1', as: 'heading' }],
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'customjs.scrape.page',
			expect.objectContaining({ host: 'example.com', commands: 1 }),
			'completed',
		);
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('secret-token');
	});

	it('POSTs the commands and returns the extractions', async () => {
		respondJson(scrapeCommandResponse);

		const result = await invoke(Scrape.page, {
			url: 'https://example.com',
			commands: [{ action: 'extract', selector: 'h1', as: 'heading' }],
			returnType: 'json',
		});

		const sent = lastRequest();
		expect(sent.path).toBe('/ai-scraper');
		expect(sent.body).toEqual({
			input: {
				url: 'https://example.com',
				commands: [{ action: 'extract', selector: 'h1', as: 'heading' }],
				returnType: 'json',
			},
		});
		expect(result).toEqual(scrapeCommandResponse);
	});

	// The docs mark `as` optional on extract, screenshot and evaluate.
	it('accepts extract, screenshot and evaluate steps without `as`', async () => {
		respondJson(scrapeCommandResponse);
		const commands = [
			{ action: 'extract', selector: 'h1' },
			{ action: 'screenshot' },
			{ action: 'evaluate', expression: 'document.title' },
		];

		await invoke(Scrape.page, {
			url: 'https://example.com',
			commands,
			returnType: 'screenshot',
		});

		expect(lastRequest().body).toEqual({
			input: {
				url: 'https://example.com',
				commands,
				returnType: 'screenshot',
			},
		});
	});

	it('sends every step type the docs list', async () => {
		respondJson(scrapeCommandResponse);

		await invoke(Scrape.page, {
			url: 'https://example.com',
			commands: [
				{ action: 'navigate', url: 'https://example.com/search' },
				{ action: 'type', selector: 'input[name=q]', value: 'customjs' },
				{ action: 'click', selector: 'button[type=submit]' },
				{ action: 'wait', ms: 1500 },
				{ action: 'scroll', direction: 'down', amount: 500 },
				{ action: 'screenshot', as: 'final' },
				{ action: 'evaluate', expression: 'document.title', as: 'title' },
				{
					action: 'extract',
					selector: '.price',
					multiple: true,
					attribute: 'data-price',
					as: 'prices',
				},
			],
		});

		// The schema accepts all eight, and all eight reach the request.
		const sent = CustomjsEndpointInputSchemas.scrapePage.parse({
			url: 'https://example.com',
			commands: [
				{ action: 'navigate', url: 'https://example.com/search' },
				{ action: 'type', selector: 'input[name=q]', value: 'customjs' },
				{ action: 'click', selector: 'button[type=submit]' },
				{ action: 'wait', ms: 1500 },
				{ action: 'scroll', direction: 'down', amount: 500 },
				{ action: 'screenshot', as: 'final' },
				{ action: 'evaluate', expression: 'document.title', as: 'title' },
				{
					action: 'extract',
					selector: '.price',
					multiple: true,
					attribute: 'data-price',
					as: 'prices',
				},
			],
		} as never);

		expect(sent.commands).toHaveLength(8);
	});

	// A wait takes `ms` here and `value` on the screenshot route, so the wrong
	// field has to fail before the request.
	it('rejects a wait written with the screenshot route field', async () => {
		await expect(
			invoke(Scrape.page, {
				url: 'https://example.com',
				commands: [{ action: 'wait', value: 500 }],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it.each([
		[{ commands: [] }],
		[{}],
		[
			{
				url: 'https://example.com',
				commands: [{ action: 'extract', selector: 'h1', as: '' }],
			},
		],
		[
			{
				url: 'https://example.com',
				commands: [{ action: 'extract', selector: 'h1', as: 'x' }],
				returnType: 'pdf',
			},
		],
	])('rejects %j before calling CustomJS', async (input) => {
		await expect(invoke(Scrape.page, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a response that is not a scrape result', async () => {
		respondJson({ unexpected: true });

		await expect(
			invoke(Scrape.page, {
				url: 'https://example.com',
				commands: [{ action: 'extract', selector: 'h1', as: 'h' }],
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
		expect(mockLog).not.toHaveBeenCalled();
	});

	// The scraper drives a browser through every step before it answers, so it
	// gets a longer budget than a single render.
	it('allows longer than a render', async () => {
		respondJson(scrapeCommandResponse);

		await invoke(Scrape.page, {
			url: 'https://example.com',
			commands: [{ action: 'extract', selector: 'h1', as: 'h' }],
		});

		expect(SCRAPE_TIMEOUT_MS).toBeGreaterThan(120_000);
	});
});

describe('scrape.agent', () => {
	it('POSTs the goal and returns the result with its token usage', async () => {
		respondJson(scrapeAgentResponse);

		const result = await invoke(Scrape.agent, {
			goal: 'Go to shop.example.com and list every product name and price',
		});

		const sent = lastRequest();
		expect(sent.path).toBe('/ai-scraper');
		expect(sent.body).toEqual({
			input: {
				goal: 'Go to shop.example.com and list every product name and price',
			},
		});
		expect(result).toEqual(scrapeAgentResponse);
	});

	it('sends the starting URL, step budget, output and credentials', async () => {
		respondJson(scrapeAgentResponse);

		await invoke(Scrape.agent, {
			goal: 'Open the dashboard and screenshot the chart',
			url: 'https://dashboard.example.com',
			maxSteps: 12,
			output: 'screenshot',
			credentials: { username: 'me@example.com', password: 'hunter2' },
		});

		expect(lastRequest().body).toEqual({
			input: {
				goal: 'Open the dashboard and screenshot the chart',
				url: 'https://dashboard.example.com',
				maxSteps: 12,
				output: 'screenshot',
				credentials: { username: 'me@example.com', password: 'hunter2' },
			},
		});
	});

	// Credentials are passwords, so they stay out of the event log. The goal is
	// also withheld because it can name a private URL.
	it('logs the shape of the call and never the goal or credentials', async () => {
		respondJson(scrapeAgentResponse);

		await invoke(Scrape.agent, {
			goal: 'Log into https://internal.example.test with the password hunter2',
			credentials: { password: 'hunter2' },
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'customjs.scrape.agent',
			{
				goalLength: 64,
				maxSteps: 10,
				output: 'ai_extract',
				usedCredentials: true,
				steps: 4,
				totalTokens: 4280,
			},
			'completed',
		);
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('hunter2');
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('internal');
	});

	it.each([
		[{}],
		[{ goal: '' }],
		[{ goal: 'x', maxSteps: 0 }],
		[{ goal: 'x', output: 'pdf' }],
		[{ goal: 'x', credentials: { password: 7 } }],
	])('rejects %j before calling CustomJS', async (input) => {
		await expect(invoke(Scrape.agent, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('pages.list', () => {
	it('GETs the pages host and names the bare array', async () => {
		respondJson([pageListed]);

		const result = await invoke(Pages.list, {});

		const sent = lastRequest();
		expect(sent.origin).toBe('https://api.app.customjs.io');
		expect(sent.path).toBe('/pages/api/page');
		expect(sent.method).toBe('GET');
		expect(sent.headers.get('x-api-key')).toBe(API_KEY);
		expect(result).toEqual({ pages: [pageListed] });
	});

	it('treats a workspace with no pages as an empty list', async () => {
		respondJson([]);

		await expect(invoke(Pages.list, {})).resolves.toEqual({ pages: [] });
	});

	it('rejects a null body instead of reporting an empty workspace', async () => {
		respondJson(null);

		await expect(invoke(Pages.list, {})).rejects.toMatchObject({
			name: 'ZodError',
		});
	});

	it('rejects a body that is not a page list', async () => {
		respondJson({ pages: [] });

		await expect(invoke(Pages.list, {})).rejects.toMatchObject({
			name: 'ZodError',
		});
	});
});

describe('pages.create', () => {
	// The page name is free text and can name a customer, so it stays out of the
	// event log.
	it('logs the page ID and HTML length, never the name', async () => {
		respondJson(pageCreated, 201);

		await invoke(Pages.create, {
			name: 'Quote for jane@example.com',
			htmlContent: '<h1>hi</h1>',
		});

		const fields = mockLog.mock.calls.at(-1)?.[2];
		expect(fields).toEqual({
			pageId: pageCreated.pageId,
			htmlLength: '<h1>hi</h1>'.length,
		});
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('jane');
	});

	it('POSTs the page and accepts the 201 with shortId', async () => {
		respondJson(pageCreated, 201);

		const result = await invoke(Pages.create, {
			name: 'corsair probe page',
			htmlContent: '<h1>hi</h1>',
		});

		const sent = lastRequest();
		expect(sent.origin).toBe('https://api.app.customjs.io');
		expect(sent.path).toBe('/pages/page/upload-html');
		expect(sent.method).toBe('POST');
		expect(sent.body).toEqual({
			name: 'corsair probe page',
			htmlContent: '<h1>hi</h1>',
		});
		expect(result).toEqual(pageCreated);
	});

	it('sends a slug when one is given', async () => {
		respondJson(pageCreated, 201);

		await invoke(Pages.create, {
			name: 'Launch',
			htmlContent: '<h1>hi</h1>',
			slug: 'launch-2026',
		});

		expect(lastRequest().body).toEqual({
			name: 'Launch',
			htmlContent: '<h1>hi</h1>',
			slug: 'launch-2026',
		});
	});

	it.each([
		[{}],
		[{ name: 'Launch' }],
		[{ htmlContent: '<h1>hi</h1>' }],
		[{ name: '', htmlContent: '<h1>hi</h1>' }],
	])('rejects %j before calling CustomJS', async (input) => {
		await expect(invoke(Pages.create, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('surfaces an invalid key on the pages envelope', async () => {
		respondJson(pagesInvalidKey, 403);

		await expect(
			invoke(Pages.create, { name: 'a', htmlContent: '<p>x</p>' }),
		).rejects.toMatchObject({
			status: 403,
			isAuthError: true,
			providerMessage: 'Invalid API Key',
		});
	});
});

describe('pages.update', () => {
	it('PUTs the new HTML to the page path', async () => {
		respondJson(pageUpdated);

		const result = await invoke(Pages.update, {
			pageId: pageUpdated.pageId,
			htmlContent: '<h1>v2</h1>',
		});

		const sent = lastRequest();
		expect(sent.path).toBe(
			`/pages/api/page/id/${pageUpdated.pageId}/update-html`,
		);
		expect(sent.method).toBe('PUT');
		expect(sent.body).toEqual({ htmlContent: '<h1>v2</h1>' });
		expect(result).toEqual(pageUpdated);
	});

	it('renames only when a name is given', async () => {
		respondJson(pageUpdated);

		await invoke(Pages.update, {
			pageId: 'pg_1',
			htmlContent: '<h1>v2</h1>',
			name: 'Renamed',
		});

		expect(lastRequest().body).toEqual({
			htmlContent: '<h1>v2</h1>',
			name: 'Renamed',
		});
	});

	it('encodes the page ID into one path segment', async () => {
		respondJson(pageUpdated);

		await invoke(Pages.update, {
			pageId: '../../me',
			htmlContent: '<h1>v2</h1>',
		});

		const [url] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
		expect(url).toBe(
			'https://api.app.customjs.io/pages/api/page/id/..%2F..%2Fme/update-html',
		);
	});

	it('surfaces an unknown page', async () => {
		respondJson(pageNotFound, 404);

		await expect(
			invoke(Pages.update, { pageId: 'nope', htmlContent: '<p>x</p>' }),
		).rejects.toMatchObject({
			status: 404,
			providerMessage: 'Page not found',
		});
		expect(mockLog).not.toHaveBeenCalled();
	});

	it.each([[{}], [{ pageId: 'pg_1' }], [{ htmlContent: '<p>x</p>' }]])(
		'rejects %j before calling CustomJS',
		async (input) => {
			await expect(invoke(Pages.update, input)).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
});

describe('pages.delete', () => {
	it('DELETEs the page and reports the ID it removed', async () => {
		respondJson(emptyFailure);

		const result = await invoke(Pages.remove, { pageId: 'pg_1' });

		const sent = lastRequest();
		expect(sent.path).toBe('/pages/api/page/id/pg_1');
		expect(sent.method).toBe('DELETE');
		expect(result).toEqual({ success: true, pageId: 'pg_1' });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'customjs.pages.delete',
			{ pageId: 'pg_1' },
			'completed',
		);
	});

	// The live route answers 404 for an ID that does not exist (checked 11-14),
	// so an unknown page fails instead of reading as a delete.
	it('surfaces an unknown page ID as a 404', async () => {
		respondJson({ message: 'Not Found' }, 404);

		await expect(
			invoke(Pages.remove, { pageId: 'never-existed' }),
		).rejects.toMatchObject({ status: 404 });
		expect(mockLog).not.toHaveBeenCalled();
	});

	it.each([[{}], [{ pageId: '' }]])(
		'rejects %j before calling CustomJS',
		async (input) => {
			await expect(invoke(Pages.remove, input)).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
});

describe('error envelopes', () => {
	// The render host and the pages host use different shapes for the same
	// condition, so one shared reader has to know both.
	it.each([
		['render host', invalidKey, 'Api Key is invalid'],
		['pages host', pagesInvalidKey, 'Invalid API Key'],
		['pages not-found', pageNotFound, 'Page not found'],
		['page rate limit', tooManyRequests, 'Too Many Requests'],
	])('reads the %s envelope', async (_, body, message) => {
		respondJson(body, 403);

		const error = await captureError(invoke(Pages.list, {}));

		expect(error).toBeInstanceOf(CustomjsAPIError);
		expect((error as CustomjsAPIError).providerMessage).toBe(message);
	});

	it('carries a Retry-After header onto the error', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify(tooManyRequests), {
				status: 403,
				headers: { 'Content-Type': 'application/json', 'Retry-After': '30' },
			}),
		);

		const error = await captureError(
			invoke(Javascript.run, { code: 'return 1' }),
		);

		expect(error).toMatchObject({ retryAfter: 30_000, isRateLimit: true });
	});

	// A 2xx that is not JSON would otherwise parse as a plausible-looking
	// undefined result.
	it('throws when a JSON route answers with something else', async () => {
		respondText('<html>gateway</html>');

		await expect(
			invoke(Scrape.agent, { goal: 'anything' }),
		).rejects.toMatchObject({
			status: 200,
			message: 'CustomJS answered 200 with a non-JSON body',
		});
	});

	// A dropped connection never carried a status, which is what marks it as safe
	// to replay for a read.
	it('wraps a connection failure in the plugin error', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await captureError(
			invoke(Pdf.fromHtml, { html: '<h1>x</h1>' }),
		);

		expect(error).toBeInstanceOf(CustomjsAPIError);
		expect(error).toMatchObject({
			isTransportError: true,
			replayable: true,
			message: 'fetch failed',
		});
	});

	it('names a timeout with the budget it waited', async () => {
		const timeout = new Error('The operation timed out.');
		timeout.name = 'TimeoutError';
		fetchMock.mockRejectedValueOnce(timeout);

		const error = await captureError(
			invoke(Javascript.run, { code: 'return 1' }),
		);

		expect(error).toMatchObject({
			isTransportError: true,
			message: 'CustomJS request timed out after 120s',
		});
	});

	it('names the pages host budget when a page call times out', async () => {
		const timeout = new Error('The operation timed out.');
		timeout.name = 'TimeoutError';
		fetchMock.mockRejectedValueOnce(timeout);

		const error = await captureError(invoke(Pages.list, {}));

		expect(error).toMatchObject({
			isTransportError: true,
			message: 'CustomJS request timed out after 30s',
		});
	});

	it('names the pages host budget when reading a page response times out', async () => {
		const timeout = new Error('The operation timed out.');
		timeout.name = 'TimeoutError';
		const res = new Response('[]', {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
		jest.spyOn(res, 'text').mockRejectedValueOnce(timeout);
		fetchMock.mockResolvedValueOnce(res);

		const error = await captureError(invoke(Pages.list, {}));

		expect(error).toMatchObject({
			isTransportError: true,
			message: 'CustomJS request timed out after 30s',
		});
	});

	// Publishing a page a second time is a second page, so its failures must never
	// look replayable.
	it('marks a page creation as not replayable', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await captureError(
			invoke(Pages.create, { name: 'a', htmlContent: '<p>x</p>' }),
		);

		expect(error).toMatchObject({
			isTransportError: true,
			replayable: false,
		});
	});

	// A 200 whose body is cut off rejects from the body read, after the headers
	// arrived. Without wrapping that read, a native error escapes and no retry
	// handler matches it.
	it.each([
		['a PDF', () => Pdf.fromHtml, { html: '<h1>x</h1>' }],
		['a text answer', () => Javascript.run, { code: 'return 1' }],
		['a JSON answer', () => Pages.list, {}],
	])('wraps an interrupted %s body', async (_, endpoint, input) => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				new ReadableStream({
					start(controller) {
						// One chunk, then a failure, so the headers are fine and the
						// body dies mid-transfer.
						controller.enqueue(new Uint8Array([1, 2, 3]));
						controller.error(new TypeError('terminated'));
					},
				}),
				{ status: 200, headers: { 'Content-Type': 'application/pdf' } },
			),
		);

		const error = await captureError(invoke(endpoint(), input));

		expect(error).toBeInstanceOf(CustomjsAPIError);
		expect(error).toMatchObject({
			isTransportError: true,
			message: 'terminated',
		});
	});

	// A render leaves nothing behind, so an interrupted body may be fetched again.
	it('marks an interrupted render as replayable', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				new ReadableStream({
					start(controller) {
						controller.error(new TypeError('terminated'));
					},
				}),
				{ status: 200, headers: { 'Content-Type': 'application/pdf' } },
			),
		);

		const error = await captureError(
			invoke(Pdf.fromHtml, { html: '<h1>x</h1>' }),
		);

		expect(error).toMatchObject({ isTransportError: true, replayable: true });
	});
});
