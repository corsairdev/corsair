import { AuthMissingError, logEventFromContext } from 'corsair/core';
import {
	BrowserUseAPIError,
	BrowserUseRateLimitError,
	browserUseUrl,
	requestBrowserUse,
} from './client';
import {
	browsersCreate,
	browsersGet,
	browsersList,
	browsersStop,
	runsCancel,
	runsCreate,
	runsGet,
} from './endpoints';
import { BrowserUseEndpointInputSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { browseruse } from './index';

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

const upsertBrowser = jest.fn();
const upsertRun = jest.fn();

beforeEach(() => {
	mockFetch.mockReset();
	upsertBrowser.mockReset();
	upsertRun.mockReset();
	jest.mocked(logEventFromContext).mockReset();
});

const mockCtx = {
	key: 'bu_test',
	db: {
		browsers: { upsertByEntityId: upsertBrowser },
		runs: { upsertByEntityId: upsertRun },
	},
	$getAccountId: async () => 'test-account',
} as never;

const BROWSER_ID = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
const RUN_ID = '7c9e6679-7425-40de-944b-e07fc1f90ae7';
const SESSION_ID = '9b2f1c3e-1111-4a2b-8c3d-123456789abc';
const WORKSPACE_ID = 'a1b2c3d4-2222-4a2b-8c3d-123456789abc';

const browser = {
	id: BROWSER_ID,
	status: 'active',
	liveUrl: 'https://live.browser-use.com/abc',
	cdpUrl: 'https://cdp.browser-use.com/abc',
	timeoutAt: '2026-10-20T12:15:00Z',
	startedAt: '2026-10-20T12:00:00Z',
	finishedAt: null,
	proxyUsedMb: '0',
	proxyCost: '0',
	browserCost: '0',
	agentSessionId: null,
	recordingUrl: null,
	metadata: {},
	extensions: [],
};

const runSummary = {
	id: RUN_ID,
	task: 'Find the top 3 trending repos on GitHub today',
	title: 'Trending repos',
	model: 'gpt-6-luna',
	contextLimit: 400000,
	status: 'completed',
	result: '1. a 2. b 3. c',
	output: null,
	error: null,
	sessionId: SESSION_ID,
	workspaceId: WORKSPACE_ID,
	totalInputTokens: 100,
	totalOutputTokens: 20,
	totalCostUsd: '0.01',
	createdAt: '2026-10-20T12:00:00Z',
	updatedAt: '2026-10-20T12:01:00Z',
};

function json(body: unknown, init: ResponseInit = {}): Response {
	return new Response(JSON.stringify(body), {
		...init,
		headers: { 'Content-Type': 'application/json', ...init.headers },
	});
}

function lastCall(): { url: string; init: RequestInit } {
	expect(mockFetch).toHaveBeenCalled();
	const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];
	return { url, init };
}

describe('Browser Use plugin & client tests', () => {
	it('creates plugin instance with browsers and runs ops', () => {
		const plugin = browseruse({ key: 'bu_test' });
		expect(plugin.id).toBe('browseruse');
		expect(plugin.authConfig?.api_key?.account).toEqual(['one']);
		expect(plugin.endpoints?.browsers.create).toBeDefined();
		expect(plugin.endpoints?.browsers.get).toBeDefined();
		expect(plugin.endpoints?.browsers.list).toBeDefined();
		expect(plugin.endpoints?.browsers.stop).toBeDefined();
		expect(plugin.endpoints?.runs.create).toBeDefined();
		expect(plugin.endpoints?.runs.get).toBeDefined();
		expect(plugin.endpoints?.runs.cancel).toBeDefined();
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		const plugin = browseruse();
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

	it('builds v4 URLs and drops undefined query params', () => {
		expect(
			browserUseUrl('/browsers', { pageSize: 5, filterBy: undefined }),
		).toBe('https://api.browser-use.com/api/v4/browsers?pageSize=5');
	});

	it('sends the API key as X-Browser-Use-API-Key', async () => {
		mockFetch.mockResolvedValue(json(browser));
		await browsersGet(mockCtx, { id: BROWSER_ID });
		expect(lastCall().init.headers).toMatchObject({
			'X-Browser-Use-API-Key': 'bu_test',
		});
	});

	it('POSTs /browsers and saves the browser', async () => {
		mockFetch.mockResolvedValue(json(browser, { status: 201 }));
		const result = await browsersCreate(mockCtx, {
			proxyCountryCode: 'us',
			timeout: 15,
		});
		expect(result.cdpUrl).toBe(browser.cdpUrl);
		const req = lastCall();
		expect(req.url).toBe('https://api.browser-use.com/api/v4/browsers');
		expect(req.init.method).toBe('POST');
		expect(JSON.parse(String(req.init.body))).toEqual({
			proxyCountryCode: 'us',
			timeout: 15,
		});
		expect(upsertBrowser).toHaveBeenCalledWith(BROWSER_ID, result);
		expect(logEventFromContext).toHaveBeenCalledWith(
			mockCtx,
			'browseruse.browsers.create',
			{},
			'completed',
		);
	});

	it('GETs /browsers/{id}', async () => {
		mockFetch.mockResolvedValue(json(browser));
		const result = await browsersGet(mockCtx, { id: BROWSER_ID });
		expect(result.status).toBe('active');
		expect(lastCall().url).toBe(
			`https://api.browser-use.com/api/v4/browsers/${BROWSER_ID}`,
		);
		expect(lastCall().init.method).toBe('GET');
		expect(lastCall().init.body).toBeUndefined();
	});

	it('GETs /browsers with pagination and filter', async () => {
		mockFetch.mockResolvedValue(
			json({ items: [browser], totalItems: 1, pageNumber: 2, pageSize: 20 }),
		);
		const result = await browsersList(mockCtx, {
			pageSize: 20,
			pageNumber: 2,
			filterBy: 'active',
		});
		expect(result.items).toHaveLength(1);
		expect(lastCall().url).toBe(
			'https://api.browser-use.com/api/v4/browsers?pageSize=20&pageNumber=2&filterBy=active',
		);
		expect(upsertBrowser).toHaveBeenCalledTimes(1);
	});

	it('PATCHes /browsers/{id} with action stop', async () => {
		mockFetch.mockResolvedValue(
			json({
				...browser,
				status: 'stopped',
				finishedAt: '2026-10-20T12:05:00Z',
			}),
		);
		const result = await browsersStop(mockCtx, { id: BROWSER_ID });
		expect(result.status).toBe('stopped');
		expect(lastCall().init.method).toBe('PATCH');
		expect(JSON.parse(String(lastCall().init.body))).toEqual({
			action: 'stop',
		});
	});

	it('POSTs /runs and saves the queued run', async () => {
		mockFetch.mockResolvedValue(
			json({
				id: RUN_ID,
				status: 'queued',
				model: 'gpt-6-luna',
				sessionId: SESSION_ID,
				workspaceId: WORKSPACE_ID,
				eventsUrl: `/api/v4/runs/${RUN_ID}/events`,
			}),
		);
		const result = await runsCreate(mockCtx, {
			task: runSummary.task,
			outputSchema: { type: 'object' },
		});
		expect(result.status).toBe('queued');
		expect(lastCall().url).toBe('https://api.browser-use.com/api/v4/runs');
		expect(JSON.parse(String(lastCall().init.body))).toEqual({
			task: runSummary.task,
			outputSchema: { type: 'object' },
		});
		expect(upsertRun).toHaveBeenCalledWith(
			RUN_ID,
			expect.objectContaining({ status: 'queued', task: runSummary.task }),
		);
	});

	it('GETs /runs/{id} and returns the result', async () => {
		mockFetch.mockResolvedValue(json(runSummary));
		const result = await runsGet(mockCtx, { id: RUN_ID });
		expect(result.result).toBe('1. a 2. b 3. c');
		expect(lastCall().url).toBe(
			`https://api.browser-use.com/api/v4/runs/${RUN_ID}`,
		);
		expect(upsertRun).toHaveBeenCalledWith(RUN_ID, result);
	});

	it('POSTs /runs/{id}/cancel', async () => {
		mockFetch.mockResolvedValue(json({ ...runSummary, status: 'cancelled' }));
		const result = await runsCancel(mockCtx, { id: RUN_ID });
		expect(result.status).toBe('cancelled');
		expect(lastCall().url).toBe(
			`https://api.browser-use.com/api/v4/runs/${RUN_ID}/cancel`,
		);
		expect(lastCall().init.method).toBe('POST');
	});

	it('still returns when the database write fails', async () => {
		upsertRun.mockRejectedValue(new Error('db down'));
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		mockFetch.mockResolvedValue(json(runSummary));
		await expect(runsGet(mockCtx, { id: RUN_ID })).resolves.toMatchObject({
			id: RUN_ID,
		});
		warn.mockRestore();
	});

	it('rejects invalid inputs', () => {
		expect(() =>
			BrowserUseEndpointInputSchemas.browsersCreate.parse({ timeout: 500 }),
		).toThrow();
		expect(() =>
			BrowserUseEndpointInputSchemas.browsersCreate.parse({
				proxyCountryCode: 'USA',
			}),
		).toThrow();
		expect(() =>
			BrowserUseEndpointInputSchemas.runsCreate.parse({ task: '' }),
		).toThrow();
		expect(() =>
			BrowserUseEndpointInputSchemas.runsGet.parse({ id: 'not-a-uuid' }),
		).toThrow();
	});

	it('rejects responses that do not match the API shape', async () => {
		mockFetch.mockResolvedValue(json({ id: BROWSER_ID }));
		await expect(browsersGet(mockCtx, { id: BROWSER_ID })).rejects.toThrow();
	});

	it('maps 401 with FastAPI detail to BrowserUseAPIError', async () => {
		mockFetch.mockResolvedValue(
			json({ detail: 'Invalid API key' }, { status: 401 }),
		);
		const err = await requestBrowserUse('/browsers', 'bad').catch(
			(e: unknown) => e,
		);
		expect(err).toBeInstanceOf(BrowserUseAPIError);
		expect(err).toMatchObject({ status: 401, message: 'Invalid API key' });
		expect(errorHandlers.AUTH_ERROR.match(err as Error)).toBe(true);
	});

	it('maps 429 to BrowserUseRateLimitError with Retry-After', async () => {
		mockFetch.mockResolvedValue(
			json(
				{ detail: 'Too many concurrent active sessions' },
				{ status: 429, headers: { 'Retry-After': '3' } },
			),
		);
		const err = await requestBrowserUse('/browsers', 'bu_test', {
			method: 'POST',
		}).catch((e: unknown) => e);
		expect(err).toBeInstanceOf(BrowserUseRateLimitError);
		expect((err as BrowserUseRateLimitError).retryAfterMs).toBe(3000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err as Error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(err as Error),
		).resolves.toEqual({ maxRetries: 5, headersRetryAfterMs: 3000 });
	});
});
