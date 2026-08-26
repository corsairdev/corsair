import { getValidAccessToken } from './client';

function okToken(overrides: Record<string, unknown> = {}): Response {
	return new Response(
		JSON.stringify({
			access_token: 'fresh',
			expires_in: 3600,
			...overrides,
		}),
		{ status: 200, headers: { 'Content-Type': 'application/json' } },
	);
}

function rateLimited(retryAfter = '0'): Response {
	return new Response('slow down', {
		status: 429,
		headers: { 'Retry-After': retryAfter },
	});
}

describe('getValidAccessToken', () => {
	const creds = {
		clientId: 'client',
		clientSecret: 'secret',
		refreshToken: 'refresh',
	};

	let fetchMock: jest.SpyInstance;

	beforeEach(() => {
		fetchMock = jest.spyOn(globalThis, 'fetch');
	});

	afterEach(() => {
		fetchMock.mockRestore();
	});

	it('reuses an access token outside the expiry skew without refreshing', async () => {
		const expiresAt = String(Math.floor(Date.now() / 1000) + 3600);
		const result = await getValidAccessToken({
			...creds,
			accessToken: 'cached',
			expiresAt,
		});
		expect(result).toEqual({
			accessToken: 'cached',
			expiresAt: Number(expiresAt),
			refreshed: false,
		});
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('treats an ISO expiresAt that is still in the future as valid', async () => {
		const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
		const result = await getValidAccessToken({
			...creds,
			accessToken: 'cached',
			expiresAt,
		});
		expect(result.accessToken).toBe('cached');
		expect(result.refreshed).toBe(false);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('refreshes when expiresAt is not a unix timestamp or ISO date', async () => {
		fetchMock.mockResolvedValueOnce(okToken());
		const result = await getValidAccessToken({
			...creds,
			accessToken: 'cached',
			expiresAt: 'not-a-date',
		});
		expect(result.accessToken).toBe('fresh');
		expect(result.refreshed).toBe(true);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('sends the refresh grant with a timeout signal', async () => {
		fetchMock.mockResolvedValueOnce(okToken());
		await getValidAccessToken(creds);
		const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
		expect(init.signal).toBeInstanceOf(AbortSignal);
	});

	it('retries a 429 refresh using Retry-After then returns the token', async () => {
		fetchMock
			.mockResolvedValueOnce(rateLimited())
			.mockResolvedValueOnce(okToken());
		const result = await getValidAccessToken(creds);
		expect(result.accessToken).toBe('fresh');
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it('gives up after repeated 429 refresh responses and keeps Retry-After', async () => {
		fetchMock.mockImplementation(() => Promise.resolve(rateLimited()));
		await expect(getValidAccessToken(creds)).rejects.toMatchObject({
			name: 'GoogleAnalyticsAPIError',
			code: 429,
			retryAfter: 0,
		});
		expect(fetchMock).toHaveBeenCalledTimes(6);
	});

	it('rejects a 200 token payload that is missing access_token', async () => {
		fetchMock.mockResolvedValueOnce(okToken({ access_token: undefined }));
		await expect(getValidAccessToken(creds)).rejects.toMatchObject({
			name: 'GoogleAnalyticsAPIError',
		});
	});

	it('rejects a 200 token payload with a non-finite expires_in', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({ access_token: 'fresh', expires_in: 'nope' }),
				{
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				},
			),
		);
		await expect(getValidAccessToken(creds)).rejects.toMatchObject({
			name: 'GoogleAnalyticsAPIError',
		});
	});

	it('accepts expires_in when the token endpoint returns it as a numeric string', async () => {
		fetchMock.mockResolvedValueOnce(okToken({ expires_in: '3600' }));
		const result = await getValidAccessToken(creds);
		expect(result.accessToken).toBe('fresh');
		expect(result.refreshed).toBe(true);
		expect(result.expiresAt).toBeGreaterThan(Math.floor(Date.now() / 1000));
	});
});

describe('callMeasurementProtocol', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('passes a timeout signal on the collect request', async () => {
		const { callMeasurementProtocol } = await import('./client');
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(new Response('', { status: 200 }));
		await callMeasurementProtocol(
			{ events: [{ name: 'login' }] },
			{
				validate: false,
				apiSecret: 'secret',
				measurementId: 'G-XXXX',
			},
		);
		const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
		expect(init.signal).toBeInstanceOf(AbortSignal);
	});
});
