import { AuthMissingError, logEventFromContext } from 'corsair/core';
import {
	makeVestaboardRequest,
	packVestaboardCredentials,
	VestaboardRateLimitError,
} from './client';
import { list, postMessage } from './endpoints/subscriptions';
import {
	VestaboardEndpointInputSchemas,
	VestaboardEndpointOutputSchemas,
} from './endpoints/types';
import { vestaboard } from './index';

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
const packed = packVestaboardCredentials('test-key', 'test-secret');
const blankRow = Array.from({ length: 22 }, () => 0);
const blankGrid = Array.from({ length: 6 }, () => [...blankRow]);

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

function lastCall(): {
	url: string;
	key: string | null;
	secret: string | null;
	init: RequestInit;
} {
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
	const headers = new Headers(init?.headers);
	return {
		url,
		key: headers.get('X-Vestaboard-Api-Key'),
		secret: headers.get('X-Vestaboard-Api-Secret'),
		init: init ?? {},
	};
}

const mockCtx = {
	key: packed,
	$getAccountId: async () => 'test-account',
} as never;

const officialSubscription = {
	id: 'e599aa61-8e3d-4f90-a5f1-826983a3d67a',
	boardId: '46c06290-7961-49e0-a6fd-7874bb40a0de',
};

const officialMessage = {
	id: '1125e36d-4e3a-40fb-a87b-1aa90f0997a1',
	text: 'Test',
	created: '1577839720478',
	muted: false,
};

describe('Vestaboard plugin & client tests', () => {
	it('creates plugin instance with the two official ops', () => {
		const plugin = vestaboard({ key: 'test-key', apiSecret: 'test-secret' });
		expect(plugin.id).toBe('vestaboard');
		expect(plugin.authConfig?.api_key?.account).toEqual(['api_secret']);
		expect(plugin.endpoints?.subscriptions.list).toBeDefined();
		expect(plugin.endpoints?.subscriptions.postMessage).toBeDefined();
		expect(plugin.webhooks).toEqual({});
	});

	it('throws AuthMissingError when the secret is missing', async () => {
		const plugin = vestaboard({ key: 'test-key' });
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: {
						get_api_key: async () => 'stored-key',
						get_api_secret: async () => undefined,
					},
				} as never,
				'endpoint',
			),
		).rejects.toThrow(AuthMissingError);
	});

	it('packs account-scoped key and secret', async () => {
		const plugin = vestaboard();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: {
						get_api_key: async () => 'stored-key',
						get_api_secret: async () => 'stored-secret',
					},
				} as never,
				'endpoint',
			),
		).resolves.toBe(packVestaboardCredentials('stored-key', 'stored-secret'));
	});

	it('lists subscriptions from GET /subscriptions', async () => {
		mockFetch.mockResolvedValue(jsonResponse([officialSubscription]));

		const input = VestaboardEndpointInputSchemas.subscriptionsList.parse({});
		const result = await list(mockCtx, input);
		expect(result.subscriptions).toEqual([officialSubscription]);
		VestaboardEndpointOutputSchemas.subscriptionsList.parse(result);

		const req = lastCall();
		expect(req.url).toBe('https://subscriptions.vestaboard.com/subscriptions');
		expect(req.key).toBe('test-key');
		expect(req.secret).toBe('test-secret');
		expect(req.init.redirect).toBe('error');
	});

	it('posts text as { text } to POST /subscriptions/{id}/message', async () => {
		mockFetch.mockResolvedValue(jsonResponse(officialMessage));

		const input = VestaboardEndpointInputSchemas.subscriptionsPostMessage.parse(
			{
				subscriptionId: officialSubscription.id,
				text: 'Hello World',
			},
		);
		const result = await postMessage(mockCtx, input);
		expect(result).toEqual(officialMessage);
		VestaboardEndpointOutputSchemas.subscriptionsPostMessage.parse(result);

		const req = lastCall();
		expect(req.url).toBe(
			`https://subscriptions.vestaboard.com/subscriptions/${officialSubscription.id}/message`,
		);
		expect(req.init.method).toBe('POST');
		expect(req.init.body).toBe(JSON.stringify({ text: 'Hello World' }));
	});

	it('posts a 6x22 grid as { characters }', async () => {
		mockFetch.mockResolvedValue(jsonResponse(officialMessage));

		const input = VestaboardEndpointInputSchemas.subscriptionsPostMessage.parse(
			{
				subscriptionId: officialSubscription.id,
				characters: blankGrid,
			},
		);
		await postMessage(mockCtx, input);
		expect(lastCall().init.body).toBe(
			JSON.stringify({ characters: blankGrid }),
		);
	});

	it('rejects missing, empty, both, and wrong-size payloads', () => {
		expect(() =>
			VestaboardEndpointInputSchemas.subscriptionsPostMessage.parse({
				subscriptionId: officialSubscription.id,
			}),
		).toThrow();
		expect(() =>
			VestaboardEndpointInputSchemas.subscriptionsPostMessage.parse({
				subscriptionId: officialSubscription.id,
				text: '',
			}),
		).toThrow();
		expect(() =>
			VestaboardEndpointInputSchemas.subscriptionsPostMessage.parse({
				subscriptionId: officialSubscription.id,
				text: 'Hello',
				characters: blankGrid,
			}),
		).toThrow();
		expect(() =>
			VestaboardEndpointInputSchemas.subscriptionsPostMessage.parse({
				subscriptionId: officialSubscription.id,
				characters: [[0]],
			}),
		).toThrow();
	});

	it('maps 401 to VestaboardAPIError', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({ message: 'Unauthorized' }, { status: 401 }),
		);

		await expect(
			makeVestaboardRequest('/subscriptions', packed),
		).rejects.toMatchObject({
			name: 'VestaboardAPIError',
			status: 401,
		});
	});

	it('maps 429 to VestaboardRateLimitError', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse(
				{ message: 'Too many requests' },
				{ status: 429, headers: { 'Retry-After': '2' } },
			),
		);

		const err = await makeVestaboardRequest('/subscriptions', packed).catch(
			(error: unknown) => error,
		);
		expect(err).toBeInstanceOf(VestaboardRateLimitError);
		expect((err as VestaboardRateLimitError).retryAfterMs).toBe(2000);
	});
});
