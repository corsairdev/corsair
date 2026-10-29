import { AuthMissingError, logEventFromContext } from 'corsair/core';
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

function jsonResponse(body: unknown, init?: ResponseInit): Response {
	const headers = new Headers({
		'Content-Type': 'application/json',
		...(init?.headers as Record<string, string>),
	});
	return new Response(JSON.stringify(body), {
		status: 200,
		...init,
		headers,
	});
}

function lastCall(): { url: string; auth: string | null } {
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
	return { url, auth: new Headers(init?.headers).get('Authorization') };
}

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
		mockFetch.mockResolvedValue(jsonResponse([officialCharacter]));
		const input = ChatfaiEndpointInputSchemas.charactersSearch.parse({
			q: 'gandalf',
		});
		const result = await search(ctx, input);
		expect(result.characters[0]?.id).toBe('u9L8cPOYsVf9Ky7hTCqc');
		ChatfaiEndpointOutputSchemas.charactersSearch.parse(result);
		const req = lastCall();
		expect(req.url).toBe(
			'https://api.chatfai.com/v1/characters/search?q=gandalf',
		);
		expect(req.auth).toBe('Bearer test-api-key');
	});

	it('gets a public character by id', async () => {
		mockFetch.mockResolvedValue(jsonResponse(officialCharacter));
		const result = await get(ctx, { id: 'u9L8cPOYsVf9Ky7hTCqc' });
		expect(result.name).toBe('Gandalf the Grey');
		ChatfaiEndpointOutputSchemas.charactersGet.parse(result);
		expect(lastCall().url).toBe(
			'https://api.chatfai.com/v1/characters/u9L8cPOYsVf9Ky7hTCqc',
		);
	});

	it('lists conversations and maps official data/nextCursor', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				data: [{ id: 'conv_1', character_id: 'u9L8cPOYsVf9Ky7hTCqc' }],
				nextCursor: 'page-2',
			}),
		);
		const result = await list(ctx, { limit: 10 });
		expect(result.conversations[0]?.id).toBe('conv_1');
		expect(result.nextCursor).toBe('page-2');
		ChatfaiEndpointOutputSchemas.conversationsList.parse(result);
		expect(lastCall().url).toBe(
			'https://api.chatfai.com/v1/conversations?limit=10',
		);
	});

	it('accepts a bare conversation array', async () => {
		mockFetch.mockResolvedValue(jsonResponse([{ id: 'conv_2' }]));
		const result = await list(ctx, {});
		expect(result.conversations).toEqual([{ id: 'conv_2' }]);
	});

	it('preserves Retry-After on HTTP 429', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse(
				{ error: 'Too Many Requests' },
				{ status: 429, headers: { 'Retry-After': '2' } },
			),
		);
		const err = await makeChatfaiRequest('/conversations', 'k').catch(
			(error: unknown) => error,
		);
		expect(err).toBeInstanceOf(ChatfaiRateLimitError);
		expect((err as ChatfaiRateLimitError).retryAfterMs).toBe(2000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err as Error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(err as Error),
		).resolves.toEqual({ maxRetries: 5, headersRetryAfterMs: 2000 });
	});

	it('maps 401 Unauthorized to AUTH_ERROR', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({ error: 'Unauthorized' }, { status: 401 }),
		);
		const err = await makeChatfaiRequest('/conversations', 'bad').catch(
			(error: unknown) => error,
		);
		expect(err).toBeInstanceOf(ChatfaiAPIError);
		expect((err as ChatfaiAPIError).status).toBe(401);
		expect(errorHandlers.AUTH_ERROR.match(err as Error)).toBe(true);
	});
});
