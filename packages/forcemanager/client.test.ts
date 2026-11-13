import { AuthMissingError } from 'corsair/core';
import {
	ForceManagerAPIError,
	forceManagerBaseUrl,
	makeForceManagerRequest,
} from './client';

describe('ForceManager HTTP client', () => {
	afterEach(() => jest.restoreAllMocks());

	it('uses the official production and sandbox v4 base URLs', () => {
		expect(forceManagerBaseUrl('production')).toBe(
			'https://api.forcemanager.com/api/v4',
		);
		expect(forceManagerBaseUrl('sandbox')).toBe(
			'https://sandbox-api.forcemanager.com/api/v4',
		);
	});

	it('sends the session key and request fields through the shared transport', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(new Response('{"ok":true}', { status: 200 }));

		await makeForceManagerRequest('/accounts', 'session-key', {
			method: 'POST',
			body: { name: 'Sample account' },
			query: { page: 2, active: true },
			headers: { Count: '15' },
		});

		const [requestUrl, requestInit] = fetchMock.mock.calls[0] ?? [];
		const url = new URL(String(requestUrl));

		expect(`${url.origin}${url.pathname}`).toBe(
			'https://api.forcemanager.com/api/v4/accounts',
		);
		expect(url.searchParams.get('page')).toBe('2');
		expect(url.searchParams.get('active')).toBe('true');
		expect(requestInit?.method).toBe('POST');
		expect(new Headers(requestInit?.headers).get('X-Session-Key')).toBe(
			'session-key',
		);
		expect(new Headers(requestInit?.headers).get('Count')).toBe('15');
		expect(JSON.parse(String(requestInit?.body))).toEqual({
			name: 'Sample account',
		});
	});

	it('supports the documented sandbox host', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(new Response('[]', { status: 200 }));

		await makeForceManagerRequest(
			'/timezones',
			'session-key',
			{ method: 'GET' },
			'sandbox',
		);

		const [requestUrl] = fetchMock.mock.calls[0] ?? [];
		expect(new URL(String(requestUrl)).origin).toBe(
			'https://sandbox-api.forcemanager.com',
		);
	});

	it.each([undefined, ''])(
		'fails before network I/O when the session key is %s',
		async (key) => {
			const fetchMock = jest.spyOn(globalThis, 'fetch');

			await expect(
				makeForceManagerRequest('/timezones', key, { method: 'GET' }),
			).rejects.toBeInstanceOf(AuthMissingError);
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);

	it('does not expose provider error bodies or request credentials', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(
				new Response('{"password":"private-value"}', { status: 401 }),
			);

		// `unknown` because a rejected promise has no reliable runtime error type until narrowed.
		const error = await makeForceManagerRequest(
			'/accounts',
			'private-session-key',
			{
				method: 'GET',
			},
		).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ForceManagerAPIError);
		if (!(error instanceof Error))
			throw new Error('Expected a safe ForceManager error');
		expect(error.message).not.toContain('private-value');
		expect(error.message).not.toContain('private-session-key');
	});

	it('preserves Retry-After without retrying undocumented provider policy', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response('{"message":"slow down"}', {
				status: 429,
				headers: { 'Retry-After': '4' },
			}),
		);

		// `unknown` because a rejected promise has no reliable runtime error type until narrowed.
		const error = await makeForceManagerRequest('/timezones', 'session-key', {
			method: 'GET',
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ForceManagerAPIError);
		if (!(error instanceof ForceManagerAPIError))
			throw new Error('Expected a rate-limit error');
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(4000);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});
