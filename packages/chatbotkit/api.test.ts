import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { ChatbotkitAPIError, makeChatbotkitRequest } from './client';
import { errorHandlers } from './error-handlers';
import type { ChatbotkitContext } from './index';
import { chatbotkit, chatbotkitEndpointSchemas } from './index';

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

function countLeaves(tree: Record<string, unknown>): number {
	return Object.values(tree).reduce<number>((count, value) => {
		if (typeof value === 'function') return count + 1;
		if (value && typeof value === 'object') {
			return count + countLeaves(value as Record<string, unknown>);
		}
		return count;
	}, 0);
}

function endpointPaths(tree: Record<string, unknown>, prefix = ''): string[] {
	return Object.entries(tree).flatMap(([key, value]) => {
		const path = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') return [path];
		if (value && typeof value === 'object') {
			return endpointPaths(value as Record<string, unknown>, path);
		}
		return [];
	});
}

const mockCtx = {
	key: 'sk-test-api-key',
	$getAccountId: () => 'test-account-id',
	options: {},
	logEvent: jest.fn(),
	db: {},
	keyBuilder: async () => 'sk-test-api-key',
} as unknown as ChatbotkitContext;

const bot = { id: 'bot_1', name: 'Support Bot', description: 'A test bot' };

type BotsList = (
	ctx: ChatbotkitContext,
	input: { cursor?: string; limit?: number; order?: 'asc' | 'desc' },
) => Promise<unknown>;
type BotsGet = (
	ctx: ChatbotkitContext,
	input: { id: string },
) => Promise<unknown>;

function getEndpoints(): { list: BotsList; get: BotsGet } {
	const plugin = chatbotkit({ key: 'sk-test-api-key' });
	const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints> & {
		bots: { list: BotsList; get: BotsGet };
	};
	return endpoints.bots;
}

function classify(error: Error): string {
	const name = (
		Object.keys(errorHandlers) as Array<keyof typeof errorHandlers>
	).find((key) => errorHandlers[key].match(error));
	return name ?? 'none';
}

function httpError(status: number, message: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: 'https://api.chatbotkit.com/api/v1/bot/list' },
		{
			url: 'https://api.chatbotkit.com/api/v1/bot/list',
			ok: false,
			status,
			statusText: 'Error',
			body: { message },
		},
		message,
	);
}

describe('Chatbotkit plugin shape', () => {
	it('exposes the implemented operations with schemas and no webhooks', () => {
		const plugin = chatbotkit();
		const endpoints = plugin.endpoints as Record<string, unknown>;
		const paths = endpointPaths(endpoints).sort();

		expect(countLeaves(endpoints)).toBe(2);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(paths);
		expect(Object.keys(chatbotkitEndpointSchemas).sort()).toEqual(paths);
		expect(plugin.webhooks).toEqual({});
		expect(typeof plugin.pluginWebhookMatcher).toBe('function');
	});

	it('supports api key auth configuration', () => {
		const plugin = chatbotkit();
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['tenant_external_id'] },
		});
	});
});

describe('Chatbotkit request client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ success: true, data: bot });
	});

	it('sends a bearer Authorization header and the v1 base URL', async () => {
		await makeChatbotkitRequest('bot/bot_1/fetch', 'sk-test-api-key', {
			method: 'GET',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.chatbotkit.com/api/v1',
				TOKEN: 'sk-test-api-key',
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer sk-test-api-key',
				}),
			}),
			expect.objectContaining({ method: 'GET', url: 'bot/bot_1/fetch' }),
		);
	});

	it('unwraps a successful envelope into { data, meta }', async () => {
		await expect(
			makeChatbotkitRequest('bot/bot_1/fetch', 'sk-test-api-key'),
		).resolves.toEqual({ data: bot, meta: undefined });
	});

	it('throws on an unsuccessful envelope', async () => {
		mockRequest.mockResolvedValue({ success: false, error: 'Bot not found' });

		await expect(
			makeChatbotkitRequest('bot/missing/fetch', 'sk-test-api-key'),
		).rejects.toBeInstanceOf(ChatbotkitAPIError);
	});
});

describe('Chatbotkit bots endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
	});

	it('lists bots with cursor pagination query params', async () => {
		mockRequest.mockResolvedValue({
			success: true,
			data: [bot],
			meta: { cursor: 'next-page' },
		});

		const result = await getEndpoints().list(mockCtx, {
			cursor: 'abc',
			limit: 10,
			order: 'desc',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'bot/list',
				query: { cursor: 'abc', limit: 10, order: 'desc' },
			}),
		);
		expect(result).toEqual({ data: [bot], meta: { cursor: 'next-page' } });
		expect(mockLog).toHaveBeenCalledWith(
			mockCtx,
			'chatbotkit.bots.list',
			{ cursor: 'abc', limit: 10, order: 'desc' },
			'completed',
		);
	});

	it('omits undefined query params when listing without filters', async () => {
		mockRequest.mockResolvedValue({ success: true, data: [] });

		await getEndpoints().list(mockCtx, {});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ query: {} }),
		);
	});

	it('fetches a single bot by id', async () => {
		mockRequest.mockResolvedValue({ success: true, data: bot });

		const result = await getEndpoints().get(mockCtx, { id: 'bot_1' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ method: 'GET', url: 'bot/bot_1/fetch' }),
		);
		expect(result).toMatchObject(bot);
		expect(mockLog).toHaveBeenCalledWith(
			mockCtx,
			'chatbotkit.bots.get',
			{ id: 'bot_1' },
			'completed',
		);
	});

	it('URL-encodes the bot id path segment', async () => {
		mockRequest.mockResolvedValue({ success: true, data: bot });

		await getEndpoints().get(mockCtx, { id: 'bot/weird id' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ url: 'bot/bot%2Fweird%20id/fetch' }),
		);
	});

	it('propagates a not-found error without logging completion', async () => {
		mockRequest.mockResolvedValue({ success: false, error: 'Bot not found' });

		await expect(
			getEndpoints().get(mockCtx, { id: 'missing' }),
		).rejects.toBeInstanceOf(ChatbotkitAPIError);
		expect(mockLog).not.toHaveBeenCalled();
	});
});

describe('error handler classification', () => {
	it('classifies auth, rate-limit, and not-found responses', () => {
		expect(classify(httpError(401, 'Invalid secret key'))).toBe('AUTH_ERROR');
		expect(classify(httpError(429, 'Too many requests'))).toBe(
			'RATE_LIMIT_ERROR',
		);
		expect(classify(httpError(404, 'Bot not found'))).toBe('NOT_FOUND_ERROR');
	});

	it('does not retry auth or not-found failures, but retries rate limits', async () => {
		expect((await errorHandlers.AUTH_ERROR.handler()).maxRetries).toBe(0);
		expect((await errorHandlers.NOT_FOUND_ERROR.handler()).maxRetries).toBe(0);
		expect(
			(
				await errorHandlers.RATE_LIMIT_ERROR.handler(
					httpError(429, 'slow down'),
				)
			).maxRetries,
		).toBeGreaterThan(0);
	});
});
