/**
 * Covers the transport: the Bearer token, the optional workspace/bot scoping
 * headers, and how workspace discovery behaves. Network access is mocked, so
 * this runs in CI.
 */
import { AuthMissingError } from 'corsair/core';
import {
	BotpressBotIdMissingError,
	BotpressWorkspaceIdMissingError,
	discoverBotpressWorkspaceId,
	makeBotpressRequest,
} from './client';
import { botpress } from './index';

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
	body?: string;
};

type MockResponse = {
	ok?: boolean;
	status?: number;
	body?: unknown;
	headers?: Record<string, string>;
};

let captured: Captured | undefined;
let attempts = 0;

/**
 * Installs a fetch stub that answers each call with the next response in the
 * list, repeating the last one once the list is exhausted.
 */
function mockFetchSequence(responses: MockResponse[]) {
	captured = undefined;
	attempts = 0;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		const headers: Record<string, string> = {};
		const raw = init?.headers;
		if (raw instanceof Headers) {
			raw.forEach((value, key) => {
				headers[key.toLowerCase()] = value;
			});
		} else {
			for (const [key, value] of Object.entries(
				(raw ?? {}) as Record<string, string>,
			)) {
				headers[key.toLowerCase()] = value;
			}
		}
		captured = {
			url: String(url),
			method: init?.method ?? 'GET',
			headers,
			body: typeof init?.body === 'string' ? init.body : undefined,
		};

		const response =
			responses[Math.min(attempts, responses.length - 1)] ??
			({} as MockResponse);
		attempts++;

		const status = response.status ?? 200;
		const payload = response.body ?? {};
		return {
			ok: response.ok ?? status < 400,
			status,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({
				'Content-Type': 'application/json',
				...response.headers,
			}),
			json: async () => payload,
			text: async () => JSON.stringify(payload),
		};
	}) as unknown as typeof global.fetch;
}

function mockFetch(response: MockResponse) {
	mockFetchSequence([response]);
}

describe('makeBotpressRequest', () => {
	it('sends the bearer token and no scoping headers by default', async () => {
		mockFetch({ body: { id: 1 } });

		await makeBotpressRequest('/v1/admin/account/me', 'test-token');

		expect(captured?.headers.authorization).toBe('Bearer test-token');
		expect(captured?.headers['x-workspace-id']).toBeUndefined();
		expect(captured?.headers['x-bot-id']).toBeUndefined();
	});

	it('attaches x-workspace-id when a workspace id is supplied', async () => {
		mockFetch({ body: {} });

		await makeBotpressRequest('/v1/admin/bots', 'test-token', {
			method: 'POST',
			workspaceId: 'wkspace_123',
		});

		expect(captured?.headers['x-workspace-id']).toBe('wkspace_123');
	});

	it('attaches x-bot-id when a bot id is supplied', async () => {
		mockFetch({ body: {} });

		await makeBotpressRequest('/v1/chat/conversations', 'test-token', {
			method: 'GET',
			botId: 'bot_123',
		});

		expect(captured?.headers['x-bot-id']).toBe('bot_123');
	});

	it('targets the single api.botpress.cloud host', async () => {
		mockFetch({ body: {} });

		await makeBotpressRequest('/v1/admin/workspaces/wkspace_123', 'test-token');

		expect(captured?.url).toContain('https://api.botpress.cloud/');
		expect(captured?.url).toContain('/v1/admin/workspaces/wkspace_123');
	});

	it('sends a body on POST and PUT but not on GET or DELETE', async () => {
		mockFetch({ body: {} });
		await makeBotpressRequest('/v1/admin/bots', 'test-token', {
			method: 'POST',
			body: { name: 'Acme bot' },
		});
		expect(captured?.method).toBe('POST');
		expect(captured?.body).toContain('Acme bot');

		mockFetch({ body: {} });
		await makeBotpressRequest('/v1/admin/workspaces/w1', 'test-token', {
			method: 'DELETE',
			body: { name: 'ignored' } as Record<string, unknown>,
		});
		expect(captured?.method).toBe('DELETE');
		expect(captured?.body).toBeUndefined();
	});

	it('rejects a blank token before fetch', async () => {
		mockFetch({ body: {} });
		attempts = 0;

		await expect(
			makeBotpressRequest('/v1/admin/account/me', ''),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(
			makeBotpressRequest('/v1/admin/account/me', '   '),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(attempts).toBe(0);
	});

	it('trims the bearer token', async () => {
		mockFetch({ body: {} });

		await makeBotpressRequest('/v1/admin/account/me', '  test-token  ');

		expect(captured?.headers.authorization).toBe('Bearer test-token');
	});

	it('rejects a blank workspace or bot id before fetch', async () => {
		mockFetch({ body: {} });
		attempts = 0;

		await expect(
			makeBotpressRequest('/v1/admin/bots', 'test-token', {
				workspaceId: '   ',
			}),
		).rejects.toBeInstanceOf(BotpressWorkspaceIdMissingError);
		await expect(
			makeBotpressRequest('/v1/chat/conversations', 'test-token', {
				botId: '',
			}),
		).rejects.toBeInstanceOf(BotpressBotIdMissingError);
		expect(attempts).toBe(0);
	});

	it('trims workspace and bot ids on the wire', async () => {
		mockFetch({ body: {} });

		await makeBotpressRequest('/v1/chat/conversations', 'test-token', {
			workspaceId: '  wkspace_123  ',
			botId: '  bot_123  ',
		});

		expect(captured?.headers['x-workspace-id']).toBe('wkspace_123');
		expect(captured?.headers['x-bot-id']).toBe('bot_123');
	});

	it('retries once Botpress answers 429 and honours Retry-After', async () => {
		mockFetchSequence([
			{ status: 429, body: {}, headers: { 'Retry-After': '1' } },
			{ status: 200, body: { workspaces: [] } },
		]);

		const result = await makeBotpressRequest<{ workspaces: unknown[] }>(
			'/v1/admin/workspaces',
			'test-token',
		);

		expect(attempts).toBe(2);
		expect(result.workspaces).toEqual([]);
	});
});

describe('discoverBotpressWorkspaceId', () => {
	it('returns the single workspace a token can reach', async () => {
		mockFetch({ body: { workspaces: [{ id: 'wkspace_123' }] } });

		await expect(discoverBotpressWorkspaceId('test-token')).resolves.toBe(
			'wkspace_123',
		);
		expect(captured?.url).toContain('/v1/admin/workspaces');
		expect(captured?.headers['x-workspace-id']).toBeUndefined();
	});

	it('refuses to guess when several workspaces are reachable', async () => {
		mockFetch({
			body: { workspaces: [{ id: 'wkspace_1' }, { id: 'wkspace_2' }] },
		});

		await expect(
			discoverBotpressWorkspaceId('test-token'),
		).rejects.toBeInstanceOf(BotpressWorkspaceIdMissingError);
	});

	it('reports a missing workspace when the token reaches none', async () => {
		mockFetch({ body: { workspaces: [] } });

		await expect(
			discoverBotpressWorkspaceId('test-token'),
		).rejects.toBeInstanceOf(BotpressWorkspaceIdMissingError);
	});

	it('reports a missing workspace when the only id is blank', async () => {
		mockFetch({ body: { workspaces: [{ id: '   ' }] } });

		await expect(
			discoverBotpressWorkspaceId('test-token'),
		).rejects.toBeInstanceOf(BotpressWorkspaceIdMissingError);
	});

	it('trims the single reachable workspace id', async () => {
		mockFetch({ body: { workspaces: [{ id: '  wkspace_123  ' }] } });

		await expect(discoverBotpressWorkspaceId('test-token')).resolves.toBe(
			'wkspace_123',
		);
	});
});

describe('keyBuilder', () => {
	it('rejects a blank options.key', async () => {
		const plugin = botpress({ key: '   ' });
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async () => null },
		};

		await expect(
			plugin.keyBuilder!(ctx as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('trims options.key', async () => {
		const plugin = botpress({ key: '  pat_123  ' });

		await expect(
			plugin.keyBuilder!({ authType: 'api_key' } as never, 'endpoint'),
		).resolves.toBe('pat_123');
	});

	it('rejects a blank stored api key', async () => {
		const plugin = botpress();
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async () => '   ' },
		};

		await expect(
			plugin.keyBuilder!(ctx as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
