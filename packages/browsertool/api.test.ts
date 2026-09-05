import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	BROWSERTOOL_API_BASE,
	BrowserToolAPIError,
	executeBrowserTool,
} from './client';
import {
	BrowserToolEndpointInputSchemas,
	BrowserToolEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { BrowserToolContext, BrowserToolKeyBuilderContext } from './index';
import { browserToolEndpointSchemas, browsertool } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;
const mockLog = jest.mocked(logEventFromContext);

const execution = {
	data: { taskId: 'task_1', sessionId: 'sess_1', status: 'started' },
	error: null,
	successful: true,
	log_id: 'log_1',
};

const mockCtx = {
	key: 'ck_test',
	$getAccountId: () => 'test-account-id',
	options: {},
	logEvent: jest.fn(),
	db: {},
	keyBuilder: async () => 'ck_test',
} as unknown as BrowserToolContext;

function pluginEndpoints() {
	const endpoints = browsertool({ key: 'ck_test' }).endpoints;
	if (!endpoints) throw new Error('missing endpoints');
	return endpoints;
}

function classify(error: Error): string {
	const name = (
		Object.keys(errorHandlers) as Array<keyof typeof errorHandlers>
	).find((key) => errorHandlers[key].match(error));
	return name ?? 'none';
}

function httpError(status: number, message: string): ApiError {
	return new ApiError(
		{
			method: 'POST',
			url: 'https://backend.composio.dev/api/v3.1/tools/execute/BROWSER_TOOL_CREATE_TASK',
		},
		{
			url: 'https://backend.composio.dev/api/v3.1/tools/execute/BROWSER_TOOL_CREATE_TASK',
			ok: false,
			status,
			statusText: 'Error',
			body: { error: message },
		},
		message,
	);
}

describe('browsertool plugin shape', () => {
	it('registers five official ops and no webhooks', () => {
		const plugin = browsertool();
		expect(plugin.id).toBe('browsertool');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: {} });
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
		expect(Object.keys(browserToolEndpointSchemas).sort()).toEqual([
			'files.get',
			'sessions.get',
			'tasks.create',
			'tasks.stop',
			'tasks.watch',
		]);
	});
});

describe('browsertool keyBuilder', () => {
	it('returns options.key for endpoint calls', async () => {
		const plugin = browsertool({ key: 'ck_test' });
		await expect(
			(plugin.keyBuilder as (ctx: unknown, source: string) => Promise<string>)(
				{ authType: 'api_key' },
				'endpoint',
			),
		).resolves.toBe('ck_test');
	});

	it('throws AuthMissingError when the api key is absent', async () => {
		const plugin = browsertool();
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async (): Promise<string | null> => null },
		} as unknown as BrowserToolKeyBuilderContext;

		await expect(
			(plugin.keyBuilder as (ctx: unknown, source: string) => Promise<string>)(
				ctx,
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});

describe('executeBrowserTool', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue(execution);
	});

	it('POSTs arguments to the v3.1 execute URL with x-api-key', async () => {
		await executeBrowserTool('BROWSER_TOOL_CREATE_TASK', 'ck_test', {
			task: 'Open example.com',
			startUrl: 'https://example.com',
			sessionId: undefined,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: BROWSERTOOL_API_BASE,
				HEADERS: expect.objectContaining({ 'x-api-key': 'ck_test' }),
			}),
			expect.objectContaining({
				method: 'POST',
				url: 'api/v3.1/tools/execute/BROWSER_TOOL_CREATE_TASK',
				body: {
					arguments: {
						task: 'Open example.com',
						startUrl: 'https://example.com',
					},
				},
			}),
			expect.objectContaining({
				rateLimitConfig: expect.objectContaining({
					enabled: true,
					maxRetries: 0,
				}),
			}),
		);
	});

	it('rethrows ApiError so 429 metadata is kept', async () => {
		const err = httpError(429, 'Too Many Requests');
		mockRequest.mockRejectedValue(err);
		await expect(
			executeBrowserTool('BROWSER_TOOL_WATCH_TASK', 'ck_test', {
				taskId: 't1',
			}),
		).rejects.toBe(err);
	});

	it('wraps unknown failures', async () => {
		mockRequest.mockRejectedValue(new Error('boom'));
		await expect(
			executeBrowserTool('BROWSER_TOOL_STOP_TASK', 'ck_test', {
				taskId: 't1',
			}),
		).rejects.toBeInstanceOf(BrowserToolAPIError);
	});
});

describe('official endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
		mockRequest.mockResolvedValue(execution);
	});

	it('tasks.create sends BROWSER_TOOL_CREATE_TASK', async () => {
		const result = await pluginEndpoints().tasks.create(mockCtx, {
			task: 'Open https://example.com and return the title',
			startUrl: 'https://example.com',
		});
		expect(mockRequest.mock.calls[0][1].url).toBe(
			'api/v3.1/tools/execute/BROWSER_TOOL_CREATE_TASK',
		);
		expect(mockRequest.mock.calls[0][1].body.arguments).toEqual({
			task: 'Open https://example.com and return the title',
			startUrl: 'https://example.com',
		});
		expect(result.successful).toBe(true);
		expect(mockLog).toHaveBeenCalledWith(
			mockCtx,
			'browsertool.tasks.create',
			expect.objectContaining({ startUrl: 'https://example.com' }),
			'completed',
		);
	});

	it('tasks.watch sends BROWSER_TOOL_WATCH_TASK', async () => {
		await pluginEndpoints().tasks.watch(mockCtx, {
			taskId: 'task_1',
			lastStepSeen: 2,
		});
		expect(mockRequest.mock.calls[0][1].url).toBe(
			'api/v3.1/tools/execute/BROWSER_TOOL_WATCH_TASK',
		);
		expect(mockRequest.mock.calls[0][1].body.arguments).toEqual({
			taskId: 'task_1',
			lastStepSeen: 2,
		});
	});

	it('tasks.stop sends BROWSER_TOOL_STOP_TASK', async () => {
		await pluginEndpoints().tasks.stop(mockCtx, { taskId: 'task_1' });
		expect(mockRequest.mock.calls[0][1].url).toBe(
			'api/v3.1/tools/execute/BROWSER_TOOL_STOP_TASK',
		);
	});

	it('sessions.get sends BROWSER_TOOL_GET_SESSION', async () => {
		await pluginEndpoints().sessions.get(mockCtx, { sessionId: 'sess_1' });
		expect(mockRequest.mock.calls[0][1].url).toBe(
			'api/v3.1/tools/execute/BROWSER_TOOL_GET_SESSION',
		);
	});

	it('files.get sends BROWSER_TOOL_GET_OUTPUT_FILE', async () => {
		await pluginEndpoints().files.get(mockCtx, {
			fileId: 'file_1',
			taskId: 'task_1',
		});
		expect(mockRequest.mock.calls[0][1].url).toBe(
			'api/v3.1/tools/execute/BROWSER_TOOL_GET_OUTPUT_FILE',
		);
	});

	it('rejects an empty task before calling the API', async () => {
		await expect(
			pluginEndpoints().tasks.create(mockCtx, { task: '' }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('does not log create-task secrets', async () => {
		await pluginEndpoints().tasks.create(mockCtx, {
			task: 'Log in',
			secrets: { 'https://example.com': 'user:pass' },
		});
		expect(mockRequest.mock.calls[0][1].body.arguments.secrets).toEqual({
			'https://example.com': 'user:pass',
		});
		expect(mockLog.mock.calls[0]?.[2]).toEqual({ task: 'Log in' });
	});
});

describe('official schemas', () => {
	it('accepts the documented execution envelope', () => {
		expect(
			BrowserToolEndpointOutputSchemas.createTask.parse({
				data: 'ok',
				successful: true,
			}),
		).toEqual({ data: 'ok', successful: true });
	});

	it('requires official camelCase create inputs', () => {
		expect(() =>
			BrowserToolEndpointInputSchemas.createTask.parse({
				task: 'x',
				start_url: 'https://example.com',
			}),
		).toThrow();
		expect(
			BrowserToolEndpointInputSchemas.createTask.parse({
				task: 'x',
				startUrl: 'https://example.com',
			}).startUrl,
		).toBe('https://example.com');
	});
});

describe('error handlers', () => {
	it('matches ApiError 429 as RATE_LIMIT_ERROR', () => {
		expect(classify(httpError(429, 'Too Many Requests'))).toBe(
			'RATE_LIMIT_ERROR',
		);
	});

	it('does not retry mutating ops on 429', async () => {
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
			httpError(429, 'Too Many Requests'),
			{ operation: 'tasks.create' } as never,
		);
		expect(result.maxRetries).toBe(0);
	});

	it('retries watch on 429', async () => {
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
			httpError(429, 'Too Many Requests'),
			{ operation: 'tasks.watch' } as never,
		);
		expect(result.maxRetries).toBe(3);
	});
});
