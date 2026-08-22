import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { makeChatbotkitRequest } from './client';
import {
	BotSchema,
	BotsGetInputSchema,
	BotsGetResponseSchema,
	BotsListInputSchema,
	BotsListResponseSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { ChatbotkitContext } from './index';
import { chatbotkit, chatbotkitEndpointSchemas } from './index';

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

const botFixture = {
	id: 'bot_1',
	name: 'Support Bot',
	description: 'A test bot',
	model: 'gpt-4o',
	backstory: 'Helpful support agent',
	visibility: 'private',
	createdAt: 1787397742217,
	updatedAt: 1787397742217,
};

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
		{ method: 'GET', url: 'https://api.chatbotkit.com/v1/bot/list' },
		{
			url: 'https://api.chatbotkit.com/v1/bot/list',
			ok: false,
			status,
			statusText: 'Error',
			body: { message },
		},
		message,
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Schema Unit Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('ChatBotKit Zod Schemas', () => {
	it('validates a complete Bot object', () => {
		const parsed = BotSchema.safeParse(botFixture);
		expect(parsed.success).toBe(true);
	});

	it('validates minimal Bot object with only required fields', () => {
		const parsed = BotSchema.safeParse({ id: 'b_123', name: 'Bot' });
		expect(parsed.success).toBe(true);
	});

	it('rejects Bot missing required id or name', () => {
		expect(BotSchema.safeParse({ name: 'Bot' }).success).toBe(false);
		expect(BotSchema.safeParse({ id: 'b_123' }).success).toBe(false);
	});

	it('validates BotsListInputSchema options', () => {
		expect(BotsListInputSchema.safeParse({}).success).toBe(true);
		expect(
			BotsListInputSchema.safeParse({
				cursor: 'c_1',
				limit: 50,
				order: 'asc',
			}).success,
		).toBe(true);
		expect(BotsListInputSchema.safeParse({ limit: 0 }).success).toBe(false);
		expect(BotsListInputSchema.safeParse({ limit: 101 }).success).toBe(false);
	});

	it('validates BotsListResponseSchema with items and cursor', () => {
		const parsed = BotsListResponseSchema.safeParse({
			items: [botFixture],
			cursor: 'c_next',
		});
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.items).toHaveLength(1);
			expect(parsed.data.cursor).toBe('c_next');
		}
	});

	it('validates BotsGetInputSchema and BotsGetResponseSchema', () => {
		expect(BotsGetInputSchema.safeParse({ id: 'bot_1' }).success).toBe(true);
		expect(BotsGetInputSchema.safeParse({}).success).toBe(false);
		expect(BotsGetResponseSchema.safeParse(botFixture).success).toBe(true);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Structure Tests
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// Request Client Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('Chatbotkit request client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue(botFixture);
	});

	it('sends a bearer Authorization header and the v1 base URL', async () => {
		await makeChatbotkitRequest('bot/bot_1/fetch', 'sk-test-api-key', {
			method: 'GET',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.chatbotkit.com/v1',
				TOKEN: 'sk-test-api-key',
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer sk-test-api-key',
				}),
			}),
			expect.objectContaining({ method: 'GET', url: 'bot/bot_1/fetch' }),
		);
	});

	it('passes through ApiError directly for error classification', async () => {
		mockRequest.mockRejectedValue(httpError(404, 'Bot not found'));

		await expect(
			makeChatbotkitRequest('bot/missing/fetch', 'sk-test-api-key'),
		).rejects.toBeInstanceOf(ApiError);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Mock Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('Chatbotkit bots endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
	});

	it('lists bots with cursor pagination query params', async () => {
		mockRequest.mockResolvedValue({
			items: [botFixture],
			cursor: 'next-page',
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
		expect(result).toEqual({ items: [botFixture], cursor: 'next-page' });
		expect(mockLog).toHaveBeenCalledWith(
			mockCtx,
			'chatbotkit.bots.list',
			{ cursor: 'abc', limit: 10, order: 'desc' },
			'completed',
		);
	});

	it('omits undefined query params when listing without filters', async () => {
		mockRequest.mockResolvedValue({ items: [] });

		await getEndpoints().list(mockCtx, {});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ query: {} }),
		);
	});

	it('fetches a single bot by id', async () => {
		mockRequest.mockResolvedValue(botFixture);

		const result = await getEndpoints().get(mockCtx, { id: 'bot_1' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ method: 'GET', url: 'bot/bot_1/fetch' }),
		);
		expect(result).toMatchObject(botFixture);
		expect(mockLog).toHaveBeenCalledWith(
			mockCtx,
			'chatbotkit.bots.get',
			{ id: 'bot_1' },
			'completed',
		);
	});

	it('URL-encodes the bot id path segment', async () => {
		mockRequest.mockResolvedValue(botFixture);

		await getEndpoints().get(mockCtx, { id: 'bot/weird id' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ url: 'bot/bot%2Fweird%20id/fetch' }),
		);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Error Handler Tests
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// Integration: Live API Tests (gated on CHATBOTKIT_API_KEY)
// ─────────────────────────────────────────────────────────────────────────────

const TEST_API_KEY = process.env.CHATBOTKIT_API_KEY ?? '';
const describeIfKey = TEST_API_KEY ? describe : describe.skip;

describeIfKey('ChatBotKit Live API integration', () => {
	const unmockedHttp = jest.requireActual('corsair/http');
	const liveCtx = {
		...mockCtx,
		key: TEST_API_KEY,
	};

	beforeEach(() => {
		mockRequest.mockImplementation(unmockedHttp.request);
	});

	it('fetches bots list from real ChatBotKit API', async () => {
		const plugin = chatbotkit({ key: TEST_API_KEY });
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			bots: { list: BotsList; get: BotsGet };
		};

		const result = (await endpoints.bots.list(liveCtx, {
			limit: 10,
		})) as { items: unknown[] };

		expect(result).toBeDefined();
		expect(Array.isArray(result.items)).toBe(true);
		expect(BotsListResponseSchema.safeParse(result).success).toBe(true);
	}, 20000);

	it('fetches single bot by ID from real ChatBotKit API', async () => {
		const plugin = chatbotkit({ key: TEST_API_KEY });
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			bots: { list: BotsList; get: BotsGet };
		};

		const listRes = (await endpoints.bots.list(liveCtx, { limit: 1 })) as {
			items: Array<{ id: string }>;
		};

		const firstBot = listRes.items?.[0];
		if (firstBot) {
			const botRes = await endpoints.bots.get(liveCtx, { id: firstBot.id });
			expect(botRes).toBeDefined();
			expect(BotsGetResponseSchema.safeParse(botRes).success).toBe(true);
		}
	}, 20000);
});
