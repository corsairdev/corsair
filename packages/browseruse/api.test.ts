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
	runsGetStatus,
} from './endpoints';
import type { BrowserUseSaveContext } from './endpoints/save';
import { saveRun } from './endpoints/save';
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

// unknown is necessary: mock rows are open JSON. A stricter row type is not practical.
type JsonRecord = Record<string, unknown>;

const mockFetch = jest.fn();
const originalFetch = globalThis.fetch;

beforeAll(() => {
	globalThis.fetch = (
		input: Parameters<typeof fetch>[0],
		init?: Parameters<typeof fetch>[1],
	) => mockFetch(input, init);
});

afterAll(() => {
	globalThis.fetch = originalFetch;
});

const upsertBrowser = jest.fn();
const upsertRun = jest.fn();
const findBrowser = jest.fn();
const findRun = jest.fn();

beforeEach(() => {
	mockFetch.mockReset();
	upsertBrowser.mockReset();
	upsertRun.mockReset();
	findBrowser.mockReset();
	findRun.mockReset();
	findBrowser.mockResolvedValue(undefined);
	findRun.mockResolvedValue(undefined);
	jest.mocked(logEventFromContext).mockReset();
});

const mockCtx: BrowserUseSaveContext = {
	key: 'bu_test',
	database: {},
	db: {
		browsers: {
			upsertByEntityId: upsertBrowser,
			findByEntityId: findBrowser,
		},
		runs: { upsertByEntityId: upsertRun, findByEntityId: findRun },
	},
	$getAccountId: async () => 'test-account',
};

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
	recordingAvailable: false,
	metadata: {},
	extensions: [
		{
			id: '11111111-1111-4111-8111-111111111111',
			runtimeId: 'abcd',
			version: '1.0.0',
		},
	],
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

// unknown is necessary: each test passes a different JSON body. A stricter body type is not practical.
function json(body: unknown, init: ResponseInit = {}): Response {
	return new Response(JSON.stringify(body), {
		...init,
		headers: { 'Content-Type': 'application/json', ...init.headers },
	});
}

// unknown is necessary: a rejected promise is untyped. A stricter rejection type is not practical.
function caught(value: unknown): Error {
	if (value instanceof Error) return value;
	throw new Error('expected an Error');
}

// unknown is necessary: the call under test may reject or resolve. A stricter promise type is not practical.
async function expectFail(run: Promise<unknown>): Promise<Error> {
	try {
		await run;
	} catch (error) {
		return caught(error);
	}
	throw new Error('expected failure');
}

function lastCall(): { url: string; init: RequestInit } {
	expect(mockFetch).toHaveBeenCalled();
	const call = mockFetch.mock.calls[0];
	const url = call?.[0];
	const init = call?.[1];
	if (typeof url !== 'string' || !init || typeof init !== 'object') {
		throw new Error('expected a fetch url and init');
	}
	return { url, init };
}

describe('Browser Use plugin & client tests', () => {
	it('creates plugin instance with browsers and runs ops', () => {
		const plugin = browseruse({ key: 'bu_test' });
		expect(plugin.id).toBe('browseruse');
		expect(plugin.authConfig?.api_key?.account).toEqual([]);
		expect(plugin.endpoints?.runs.getStatus).toBeDefined();
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
					// as is necessary: keyBuilder only reads authType and get_api_key. A full plugin context is not practical here.
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
		expect(result.extensions?.[0]?.runtimeId).toBe('abcd');
		const req = lastCall();
		expect(req.url).toBe('https://api.browser-use.com/api/v4/browsers');
		expect(req.init.method).toBe('POST');
		expect(JSON.parse(String(req.init.body))).toEqual({
			proxyCountryCode: 'us',
			timeout: 15,
		});
		expect(upsertBrowser).toHaveBeenCalledWith(BROWSER_ID, result);
		expect(logEventFromContext).toHaveBeenCalledWith(
			{ $getAccountId: mockCtx.$getAccountId, database: undefined },
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
		expect(result.contextLimit).toBe(400000);
		expect(result.totalInputTokens).toBe(100);
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
		expect(lastCall().init.body).toBeUndefined();
	});

	it('polls GET /runs/{id}/status and keeps fields the status body omits', async () => {
		findRun.mockResolvedValue({
			data: { id: RUN_ID, status: 'running', task: runSummary.task },
		});
		mockFetch.mockResolvedValue(json({ status: 'completed' }));
		const result = await runsGetStatus(mockCtx, { id: RUN_ID });
		expect(result.status).toBe('completed');
		expect(lastCall().url).toBe(
			`https://api.browser-use.com/api/v4/runs/${RUN_ID}/status`,
		);
		expect(upsertRun).toHaveBeenCalledWith(
			RUN_ID,
			expect.objectContaining({
				status: 'completed',
				task: runSummary.task,
			}),
		);
	});

	it('keeps a full run when a status poll overlaps the get', async () => {
		// unknown is necessary: the mock row is open JSON. A stricter row type is not practical.
		let stored: JsonRecord = {
			id: RUN_ID,
			status: 'running',
			task: runSummary.task,
		};
		findRun.mockImplementation(async () => ({ data: { ...stored } }));
		// upsert replaces the row. A merge-style mock would hide a stale write.
		upsertRun.mockImplementation(async (_id: string, data: JsonRecord) => {
			stored = { ...data };
		});
		mockFetch.mockImplementation(async (url: string) => {
			if (url.endsWith('/status')) return json({ status: 'completed' });
			return json(runSummary);
		});
		await Promise.all([
			runsGet(mockCtx, { id: RUN_ID }),
			runsGetStatus(mockCtx, { id: RUN_ID }),
		]);
		expect(stored).toMatchObject({
			status: 'completed',
			task: runSummary.task,
			result: runSummary.result,
			totalInputTokens: 100,
		});
	});

	it('does not let a stale running response rewind a completed run', async () => {
		// unknown is necessary: the mock row is open JSON. A stricter row type is not practical.
		let stored: JsonRecord = {
			id: RUN_ID,
			status: 'completed',
			task: runSummary.task,
			result: 'done',
		};
		findRun.mockImplementation(async () => ({ data: { ...stored } }));
		upsertRun.mockImplementation(async (_id: string, data: JsonRecord) => {
			stored = { ...data };
		});
		await saveRun(mockCtx, {
			id: RUN_ID,
			status: 'running',
			result: 'later detail',
		});
		expect(stored.status).toBe('completed');
		expect(stored.result).toBe('later detail');
		expect(stored.task).toBe(runSummary.task);
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

	it('rejects an invalid browser before any request', async () => {
		await expect(browsersCreate(mockCtx, { timeout: 500 })).rejects.toThrow();
		expect(mockFetch).not.toHaveBeenCalled();
	});

	it('rejects a country code the spec does not list', () => {
		expect(() =>
			BrowserUseEndpointInputSchemas.browsersCreate.parse({
				proxyCountryCode: 'zz',
			}),
		).toThrow();
	});

	it('repeats metadata query params', () => {
		expect(
			browserUseUrl('/browsers', {
				metadata: ['team=growth', 'env'],
			}),
		).toBe(
			'https://api.browser-use.com/api/v4/browsers?metadata=team%3Dgrowth&metadata=env',
		);
	});

	it('keeps a caller error handler ahead of the catch-all default', () => {
		const plugin = browseruse({
			errorHandlers: {
				zzzUser: {
					match: () => true,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(plugin.errorHandlers ?? {});
		expect(names.indexOf('zzzUser')).toBeLessThan(names.indexOf('DEFAULT'));
		expect(names.at(-1)).toBe('DEFAULT');
	});

	it('does not write when no database is configured', async () => {
		mockFetch.mockResolvedValue(json(runSummary));
		const ctx: BrowserUseSaveContext = { ...mockCtx, database: undefined };
		await runsGet(ctx, { id: RUN_ID });
		expect(upsertRun).not.toHaveBeenCalled();
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
		const err = await expectFail(requestBrowserUse('/browsers', 'bad'));
		expect(err).toBeInstanceOf(BrowserUseAPIError);
		expect(err).toMatchObject({ status: 401, message: 'Invalid API key' });
		expect(errorHandlers.AUTH_ERROR.match(err)).toBe(true);
	});

	it('maps 429 to BrowserUseRateLimitError with Retry-After', async () => {
		mockFetch.mockResolvedValue(
			json(
				{ detail: 'Too many concurrent active sessions' },
				{ status: 429, headers: { 'Retry-After': '3' } },
			),
		);
		const err = await expectFail(
			requestBrowserUse('/browsers', 'bu_test', {
				method: 'POST',
			}),
		);
		expect(err).toBeInstanceOf(BrowserUseRateLimitError);
		if (!(err instanceof BrowserUseRateLimitError)) {
			throw new Error('expected BrowserUseRateLimitError');
		}
		expect(err.retryAfterMs).toBe(3000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(err),
		).resolves.toMatchObject({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff_jitter',
		});
		const retry = await errorHandlers.RATE_LIMIT_ERROR.handler(err);
		expect(retry.headersRetryAfterMs).toBeGreaterThanOrEqual(3000);
		expect(retry.headersRetryAfterMs).toBeLessThan(3250);
	});

	it('retries a 503 cancel after a capped Retry-After', async () => {
		mockFetch.mockResolvedValue(
			json(
				{ detail: 'The run is finishing' },
				{ status: 503, headers: { 'Retry-After': '3600' } },
			),
		);
		const err = await expectFail(
			requestBrowserUse(`/runs/${RUN_ID}/cancel`, 'bu_test', {
				method: 'POST',
			}),
		);
		expect(errorHandlers.FINISHING_ERROR.match(err)).toBe(true);
		const retry = await errorHandlers.FINISHING_ERROR.handler(err);
		expect(retry.maxRetries).toBe(2);
		expect(retry.headersRetryAfterMs).toBeGreaterThanOrEqual(60_000);
		expect(retry.headersRetryAfterMs).toBeLessThan(60_250);
	});

	it('does not retry a 503 from creating a browser', async () => {
		mockFetch.mockResolvedValue(
			json({ detail: 'unavailable' }, { status: 503 }),
		);
		const err = await expectFail(
			requestBrowserUse('/browsers', 'bu_test', {
				method: 'POST',
				body: {},
			}),
		);
		expect(errorHandlers.FINISHING_ERROR.match(err)).toBe(false);
	});
});
