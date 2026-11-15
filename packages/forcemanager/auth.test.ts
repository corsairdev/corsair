import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	clearForceManagerSessionCache,
	makeForceManagerRequest,
	packForceManagerCredentials,
	parseForceManagerCredentials,
} from './client';
import { representativeResponseFixtures } from './endpoints/definitions';
import { executeForceManagerOperation } from './endpoints/runtime';
import type {
	ForceManagerEndpointOutputs,
	ForceManagerKeyBuilderContext,
} from './index';
import { forcemanager } from './index';

const PACKED = packForceManagerCredentials({
	publicKey: 'public-key',
	privateKey: 'private-key',
});

function json(body: unknown, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

function urlOf(call: Parameters<typeof fetch> | undefined): URL {
	return new URL(String(call?.[0]));
}

function headerOf(
	call: Parameters<typeof fetch> | undefined,
	name: string,
): string | null {
	return new Headers(call?.[1]?.headers).get(name);
}

describe('ForceManager session login', () => {
	afterEach(() => {
		jest.restoreAllMocks();
		clearForceManagerSessionCache();
	});

	it('packs and parses the public/private key pair', () => {
		expect(parseForceManagerCredentials(PACKED)).toEqual({
			publicKey: 'public-key',
			privateKey: 'private-key',
		});
		expect(parseForceManagerCredentials('bare-session-token')).toBeUndefined();
		expect(parseForceManagerCredentials('a\nb\nc')).toBeUndefined();
	});

	it('logs in with the key pair and sends the returned session token', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(json({ token: 'session-1' }))
			.mockResolvedValueOnce(json([]));

		await makeForceManagerRequest('/accounts', PACKED, { method: 'GET' });

		const [loginCall, apiCall] = fetchMock.mock.calls;
		expect(urlOf(loginCall).pathname).toBe('/api/v4/login');
		expect(loginCall?.[1]?.method).toBe('POST');
		expect(JSON.parse(String(loginCall?.[1]?.body))).toEqual({
			username: 'public-key',
			password: 'private-key',
		});
		expect(headerOf(loginCall, 'X-Session-Key')).toBeNull();
		expect(urlOf(apiCall).pathname).toBe('/api/v4/accounts');
		expect(headerOf(apiCall, 'X-Session-Key')).toBe('session-1');
	});

	it('reuses a cached session token until it ages out', async () => {
		let clock = 0;
		const now = () => clock;
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(json({ token: 'session-1' }))
			.mockResolvedValueOnce(json([]))
			.mockResolvedValueOnce(json([]))
			.mockResolvedValueOnce(json({ token: 'session-2' }))
			.mockResolvedValueOnce(json([]));

		await makeForceManagerRequest(
			'/accounts',
			PACKED,
			{ method: 'GET' },
			'production',
			now,
		);
		clock = 10 * 60 * 1000;
		await makeForceManagerRequest(
			'/contacts',
			PACKED,
			{ method: 'GET' },
			'production',
			now,
		);
		clock = 31 * 60 * 1000;
		await makeForceManagerRequest(
			'/contacts',
			PACKED,
			{ method: 'GET' },
			'production',
			now,
		);

		const paths = fetchMock.mock.calls.map((call) => urlOf(call).pathname);
		expect(paths).toEqual([
			'/api/v4/login',
			'/api/v4/accounts',
			'/api/v4/contacts',
			'/api/v4/login',
			'/api/v4/contacts',
		]);
		expect(headerOf(fetchMock.mock.calls[4], 'X-Session-Key')).toBe(
			'session-2',
		);
	});

	it('logs in again once when ForceManager answers 401 expired token', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(json({ token: 'session-1' }))
			.mockResolvedValueOnce(json({ code: '2', error: 'expired token.' }, 401))
			.mockResolvedValueOnce(json({ token: 'session-2' }))
			.mockResolvedValueOnce(json([{ id: 1 }]));

		await expect(
			makeForceManagerRequest('/accounts', PACKED, { method: 'GET' }),
		).resolves.toEqual([{ id: 1 }]);
		expect(fetchMock).toHaveBeenCalledTimes(4);
		expect(headerOf(fetchMock.mock.calls[3], 'X-Session-Key')).toBe(
			'session-2',
		);
	});

	it('does not loop when the fresh token is rejected too', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(json({ token: 'session-1' }))
			.mockResolvedValueOnce(json({ code: '2', error: 'expired token.' }, 401))
			.mockResolvedValueOnce(json({ token: 'session-2' }))
			.mockResolvedValueOnce(json({ code: '2', error: 'expired token.' }, 401));

		await expect(
			makeForceManagerRequest('/accounts', PACKED, { method: 'GET' }),
		).rejects.toMatchObject({ status: 401 });
		expect(fetchMock).toHaveBeenCalledTimes(4);
	});

	it('reports a rejected login with the provider message and no keys', async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
			json(
				{
					code: 100,
					error: 'invalid credentials.',
					message: 'invalid credentials.',
				},
				400,
			),
		);

		// `unknown` because a rejected promise has no reliable runtime error type until narrowed.
		const error = await makeForceManagerRequest('/accounts', PACKED, {
			method: 'GET',
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) throw new Error('Expected an ApiError');
		expect(error.status).toBe(400);
		expect(error.message).toBe(
			'ForceManager login failed with HTTP 400: invalid credentials.',
		);
		// The login body carries the private key, so the error drops it.
		expect(error.request.body).toBeUndefined();
		expect(JSON.stringify(error)).not.toContain('private-key');
		expect(error.message).not.toContain('private-key');
		expect(error.message).not.toContain('public-key');
	});

	it('keeps the provider error text on API failures', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(json({ error: 'branchId is required' }, 400));

		await expect(
			makeForceManagerRequest('/accounts', 'session-token', {
				method: 'POST',
				body: {},
			}),
		).rejects.toThrow(
			'ForceManager request failed with HTTP 400: branchId is required',
		);
	});

	it('sends a bare session token as is, without a login', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(json([]));

		await makeForceManagerRequest('/timezones', 'session-token', {
			method: 'GET',
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(headerOf(fetchMock.mock.calls[0], 'X-Session-Key')).toBe(
			'session-token',
		);
	});
});

describe('ForceManager keyBuilder', () => {
	type KeyBuilder = (
		ctx: ForceManagerKeyBuilderContext,
		source: 'endpoint' | 'webhook',
	) => Promise<string>;

	// `unknown` because the fixture implements only the two accessors the key builder reads.
	const keyContext = (privateKey?: string, publicKey?: string) =>
		({
			authType: 'api_key',
			keys: {
				get_api_key: async () => privateKey,
				get_public_key: async () => publicKey,
			},
		}) as unknown as ForceManagerKeyBuilderContext;

	const keyBuilderOf = (plugin: ReturnType<typeof forcemanager>) =>
		plugin.keyBuilder as KeyBuilder;

	it('packs the stored private key and public key for the login', async () => {
		await expect(
			keyBuilderOf(forcemanager())(
				keyContext('private-key', 'public-key'),
				'endpoint',
			),
		).resolves.toBe(PACKED);
	});

	it.each([
		[undefined, 'public-key'],
		['private-key', undefined],
		[undefined, undefined],
	])(
		'throws AuthMissingError when a half of the pair is missing (%s, %s)',
		async (privateKey, publicKey) => {
			await expect(
				keyBuilderOf(forcemanager())(
					keyContext(privateKey, publicKey),
					'endpoint',
				),
			).rejects.toBeInstanceOf(AuthMissingError);
		},
	);

	it('returns an explicitly configured key unchanged', async () => {
		await expect(
			keyBuilderOf(forcemanager({ key: PACKED }))(keyContext(), 'endpoint'),
		).resolves.toBe(PACKED);
	});
});

describe('ForceManager response parsing', () => {
	afterEach(() => jest.restoreAllMocks());

	it('accepts nulls and numbers where the documented example had strings', async () => {
		const account = {
			...representativeResponseFixtures.getAccount,
			address1: null,
			email: null,
			phone: 5550100,
			branchId: null,
			unknownNewField: 'kept',
		};
		jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce(json(account));

		await expect(
			executeForceManagerOperation(
				'getAccount',
				{ path: { id: 1 } },
				'session-token',
			),
		).resolves.toEqual(account);
	});

	it('still rejects a response with the wrong overall shape', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(json({ not: 'a list' }));

		await expect(
			executeForceManagerOperation('listAccounts', {}, 'session-token'),
		).rejects.toThrow();
	});

	it('types a response the way it is checked', async () => {
		const account: ForceManagerEndpointOutputs['getAccount'] = {
			address1: 5,
			address2: null,
			unknownNewField: 'kept',
		};
		jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce(json(account));

		const result = await executeForceManagerOperation(
			'getAccount',
			{ path: { id: 1 } },
			'session-token',
		);
		const address1: string | number | boolean | null | undefined =
			result.address1;
		expect(address1).toBe(5);
	});

	it('keeps path values such as a phone number out of errors', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(json({ error: 'not found' }, 404));

		// `unknown` because a rejected promise has no reliable runtime error type until narrowed.
		const error = await executeForceManagerOperation(
			'getResourcesByPhoneNumber',
			{ path: { value: '+15555550123' } },
			'session-token',
		).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) throw new Error('Expected an ApiError');
		expect(error.status).toBe(404);
		expect(error.url).toBe(
			'https://api.forcemanager.com/api/v4/calls/phone/VALUE',
		);
		expect(JSON.stringify(error)).not.toContain('5555550123');
	});
});
