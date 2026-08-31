import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	ChatfaiAPIError,
	ChatfaiRateLimitError,
	makeChatfaiRequest,
} from './client';
import { get, search } from './endpoints/characters';
import { list } from './endpoints/conversations';
import {
	ChatfaiEndpointInputSchemas,
	ChatfaiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { chatfai } from './index';

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
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.MockedFunction<typeof request>;

beforeEach(() => {
	mockRequest.mockReset();
	jest.mocked(logEventFromContext).mockReset();
});

const ctx = {
	key: 'test-api-key',
	$getAccountId: async () => 'test-account',
} as never;

const officialCharacter = {
	id: 'u9L8cPOYsVf9Ky7hTCqc',
	uid: 'hv3cU8Ditrcsa5CZ7lrsXcTWpAE3',
	name: 'Gandalf the Grey',
	nickname: 'Ólorin',
	publicDescription: 'A wizard.',
	image: 'https://cdn.chatfai.com/public_characters/example.jpg',
	visibility: 'public',
	categories: ['book'],
	featured: false,
	firstMessage: null,
	voiceEnabled: false,
	likes: 1,
	installs: 40,
	createdAt: '2023-10-24T11:42:54.183Z',
	updatedAt: '2023-10-24T11:42:54.183Z',
};

function lastCall() {
	expect(mockRequest).toHaveBeenCalled();
	return mockRequest.mock.calls[0]?.[1];
}

describe('Chatfai plugin', () => {
	it('registers the three official ops and api_key auth', () => {
		const plugin = chatfai({ key: 'k' });
		expect(plugin.id).toBe('chatfai');
		expect(plugin.authConfig?.api_key?.account).toEqual(['one']);
		expect(plugin.endpoints?.characters.search).toBeDefined();
		expect(plugin.endpoints?.characters.get).toBeDefined();
		expect(plugin.endpoints?.conversations.list).toBeDefined();
		expect(Object.keys(plugin.endpointSchemas ?? {})).toEqual([
			'characters.search',
			'characters.get',
			'conversations.list',
		]);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		const plugin = chatfai();
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

	it('searches public characters via GET /characters/search', async () => {
		mockRequest.mockResolvedValue([officialCharacter] as never);
		const input = ChatfaiEndpointInputSchemas.charactersSearch.parse({
			q: 'gandalf',
		});
		const result = await search(ctx, input);
		expect(result.characters[0]?.id).toBe('u9L8cPOYsVf9Ky7hTCqc');
		ChatfaiEndpointOutputSchemas.charactersSearch.parse(result);
		const opts = lastCall();
		expect(opts?.url).toBe('/characters/search');
		expect(opts?.query).toEqual({ q: 'gandalf' });
	});

	it('gets a public character via GET /characters/{id}', async () => {
		mockRequest.mockResolvedValue(officialCharacter as never);
		const result = await get(ctx, { id: 'u9L8cPOYsVf9Ky7hTCqc' });
		expect(result.name).toBe('Gandalf the Grey');
		ChatfaiEndpointOutputSchemas.charactersGet.parse(result);
		expect(lastCall()?.url).toBe('/characters/u9L8cPOYsVf9Ky7hTCqc');
	});

	it('lists conversations and maps official data/nextCursor', async () => {
		mockRequest.mockResolvedValue({
			data: [{ id: 'conv_1', character_id: 'u9L8cPOYsVf9Ky7hTCqc' }],
			nextCursor: 'page-2',
		} as never);
		const result = await list(ctx, { limit: 10 });
		expect(result.conversations[0]?.id).toBe('conv_1');
		expect(result.nextCursor).toBe('page-2');
		ChatfaiEndpointOutputSchemas.conversationsList.parse(result);
		expect(lastCall()?.url).toBe('/conversations');
		expect(lastCall()?.query).toEqual({ limit: 10, cursor: undefined });
	});

	it('accepts a bare conversation array', async () => {
		mockRequest.mockResolvedValue([{ id: 'conv_2' }] as never);
		const result = await list(ctx, {});
		expect(result.conversations).toEqual([{ id: 'conv_2' }]);
	});

	it('preserves Retry-After on HTTP 429', async () => {
		mockRequest.mockRejectedValue(
			new ApiError(
				{ method: 'GET', url: '/conversations' },
				{
					url: 'https://api.chatfai.com/v1/conversations',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: { error: 'Too Many Requests' },
				},
				'Too Many Requests',
				{ retryAfter: 1500 },
			),
		);
		const err = await makeChatfaiRequest('/conversations', 'k').catch(
			(error: unknown) => error,
		);
		expect(err).toBeInstanceOf(ChatfaiRateLimitError);
		expect((err as ChatfaiRateLimitError).retryAfterMs).toBe(1500);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err as Error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(err as Error),
		).resolves.toEqual({ maxRetries: 5, headersRetryAfterMs: 1500 });
	});

	it('maps 401 Unauthorized to AUTH_ERROR', async () => {
		mockRequest.mockRejectedValue(
			new ApiError(
				{ method: 'GET', url: '/conversations' },
				{
					url: 'https://api.chatfai.com/v1/conversations',
					ok: false,
					status: 401,
					statusText: 'Unauthorized',
					body: { error: 'Unauthorized' },
				},
				'Unauthorized',
			),
		);
		const err = await makeChatfaiRequest('/conversations', 'bad').catch(
			(error: unknown) => error,
		);
		expect(err).toBeInstanceOf(ChatfaiAPIError);
		expect((err as ChatfaiAPIError).status).toBe(401);
		expect(errorHandlers.AUTH_ERROR.match(err as Error)).toBe(true);
	});
});
