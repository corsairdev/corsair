import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';
import {
	BASECAMP_API_BASE,
	BASECAMP_AUTH_BASE,
	BasecampAccountIdMissingError,
	BasecampOAuthError,
	compactObject,
	discoverBasecampAccountId,
	getValidBasecampAccessToken,
	makeBasecampRequest,
	refreshBasecampAccessToken,
	validateAccountId,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});
const mockRequest = request as jest.MockedFunction<typeof request>;

function lastCall(): [
	OpenAPIConfig,
	ApiRequestOptions,
	{ rateLimitConfig?: { maxRetries?: number } },
] {
	const call = mockRequest.mock.calls.at(-1);
	if (!call) throw new Error('request was not called');
	return call as unknown as [
		OpenAPIConfig,
		ApiRequestOptions,
		{ rateLimitConfig?: { maxRetries?: number } },
	];
}

beforeEach(() => mockRequest.mockReset());

describe('Basecamp client', () => {
	it('sends bearer auth and the required identifying User-Agent', async () => {
		mockRequest.mockResolvedValue({ id: 1 });
		await makeBasecampRequest(
			'/42/projects.json',
			'token',
			'Corsair Test (test@example.com)',
			{
				method: 'GET',
				retrySafe: true,
			},
		);
		const [config, options, transport] = lastCall();
		expect(config.BASE).toBe(BASECAMP_API_BASE);
		expect(config.TOKEN).toBeUndefined();
		expect(config.HEADERS).toMatchObject({
			Authorization: 'Bearer token',
			'User-Agent': 'Corsair Test (test@example.com)',
		});
		expect(options.url).toBe('/42/projects.json');
		expect(transport.rateLimitConfig?.maxRetries).toBe(3);
	});

	it('omits OAuth auth for keyed chatbot posting and disables retries', async () => {
		mockRequest.mockResolvedValue(undefined);
		await makeBasecampRequest(
			'/42/integrations/secret/lines.json',
			'token',
			'UA',
			{
				method: 'POST',
				body: { content: 'hello' },
				authenticated: false,
				retrySafe: false,
			},
		);
		const [config, , transport] = lastCall();
		expect(config.HEADERS).not.toHaveProperty('Authorization');
		expect(transport.rateLimitConfig?.maxRetries).toBe(0);
	});

	it('discovers exactly one current Basecamp account', async () => {
		mockRequest.mockResolvedValue({
			accounts: [
				{ id: 42, product: 'bc3', href: 'https://3.basecampapi.com/42' },
			],
		});
		await expect(discoverBasecampAccountId('token')).resolves.toBe('42');
		expect(lastCall()[0].BASE).toBe(BASECAMP_AUTH_BASE);
		expect(lastCall()[1].url).toBe('/authorization.json');
	});

	it('requires explicit selection when discovery is ambiguous', async () => {
		mockRequest.mockResolvedValue({
			accounts: [
				{ id: 1, product: 'bc3', href: 'https://3.basecampapi.com/1' },
				{ id: 2, product: 'bc3', href: 'https://3.basecampapi.com/2' },
			],
		});
		await expect(discoverBasecampAccountId('token')).rejects.toBeInstanceOf(
			BasecampAccountIdMissingError,
		);
	});

	it('refreshes with a form body and preserves a non-rotated refresh token', async () => {
		mockRequest.mockResolvedValue({
			access_token: 'new-access',
			expires_in: 1209600,
		});
		const token = await refreshBasecampAccessToken(
			'client',
			'secret',
			'refresh',
		);
		expect(token.access_token).toBe('new-access');
		const [, options] = lastCall();
		expect(options.url).toBe('/authorization/token');
		expect(options.mediaType).toBe('application/x-www-form-urlencoded');
		expect(String(options.body)).toContain('grant_type=refresh_token');

		mockRequest.mockResolvedValueOnce({
			access_token: 'next',
			expires_in: 1209600,
		});
		const valid = await getValidBasecampAccessToken({
			refreshToken: 'refresh',
			clientId: 'client',
			clientSecret: 'secret',
			forceRefresh: true,
		});
		expect(valid.refreshToken).toBe('refresh');
		expect(valid.refreshed).toBe(true);
	});

	it('uses an unexpired token without network access', async () => {
		const valid = await getValidBasecampAccessToken({
			accessToken: 'still-valid',
			expiresAt: String(Math.floor(Date.now() / 1000) + 3600),
		});
		expect(valid).toMatchObject({
			accessToken: 'still-valid',
			refreshed: false,
		});
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('validates account ids and compacts undefined recursively', () => {
		expect(validateAccountId('123')).toBe('123');
		expect(() => validateAccountId('../secret')).toThrow(
			BasecampAccountIdMissingError,
		);
		expect(
			compactObject({ a: 0, b: false, c: undefined, d: { e: undefined } }),
		).toEqual({
			a: 0,
			b: false,
			d: {},
		});
	});
});

describe('Basecamp concurrent token refresh', () => {
	function deferred<T>() {
		let resolve!: (value: T) => void;
		let reject!: (error: unknown) => void;
		const promise = new Promise<T>((res, rej) => {
			resolve = res;
			reject = rej;
		});
		return { promise, resolve, reject };
	}

	it('coalesces concurrent exchanges of the same refresh token', async () => {
		const gate = deferred<{ access_token: string; expires_in: number }>();
		mockRequest.mockReturnValue(gate.promise as never);

		const both = Promise.all([
			refreshBasecampAccessToken('client', 'secret', 'R1'),
			refreshBasecampAccessToken('client', 'secret', 'R1'),
		]);
		gate.resolve({ access_token: 'A2', expires_in: 1209600 });
		const [first, second] = await both;

		// One exchange on the wire: the second caller never submits R1, which the
		// first has by then spent.
		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(first.access_token).toBe('A2');
		expect(second).toBe(first);
	});

	it('keeps exchanges for different accounts independent', async () => {
		mockRequest.mockResolvedValue({ access_token: 'A2', expires_in: 1209600 });
		await Promise.all([
			refreshBasecampAccessToken('client', 'secret', 'R1'),
			refreshBasecampAccessToken('client', 'secret', 'R-other'),
		]);
		expect(mockRequest).toHaveBeenCalledTimes(2);
	});

	it('starts a new exchange once the previous one has settled', async () => {
		mockRequest.mockResolvedValue({ access_token: 'A2', expires_in: 1209600 });
		await refreshBasecampAccessToken('client', 'secret', 'R1');
		await refreshBasecampAccessToken('client', 'secret', 'R1');
		expect(mockRequest).toHaveBeenCalledTimes(2);
	});

	it('rejects every joiner and caches no failure', async () => {
		const gate = deferred<never>();
		mockRequest.mockReturnValueOnce(gate.promise as never);
		const both = Promise.all([
			refreshBasecampAccessToken('client', 'secret', 'R1'),
			refreshBasecampAccessToken('client', 'secret', 'R1'),
		]).catch((error) => error);
		gate.reject(new Error('boom'));
		expect(await both).toBeInstanceOf(BasecampOAuthError);
		expect(mockRequest).toHaveBeenCalledTimes(1);

		// The failed exchange must not be left in the map as a poisoned entry.
		mockRequest.mockResolvedValueOnce({
			access_token: 'A2',
			expires_in: 1209600,
		});
		await expect(
			refreshBasecampAccessToken('client', 'secret', 'R1'),
		).resolves.toMatchObject({ access_token: 'A2' });
		expect(mockRequest).toHaveBeenCalledTimes(2);
	});
});
