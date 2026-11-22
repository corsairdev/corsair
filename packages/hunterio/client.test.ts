import { request } from 'corsair/http';
import {
	HUNTERIO_API_BASE,
	HUNTERIO_RATE_LIMIT_CONFIG,
	HunterioAPIError,
	makeHunterioRequest,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);

beforeEach(() => {
	mockedRequest.mockReset();
});

describe('makeHunterioRequest', () => {
	it('sends the key as a Bearer token and never in the query parameter', async () => {
		mockedRequest.mockResolvedValue({ data: {} });

		await makeHunterioRequest('/leads', 'test-key-123', {
			method: 'GET',
			query: { limit: 10 },
		});

		expect(mockedRequest).toHaveBeenCalledTimes(1);
		const [config, requestOptions] = mockedRequest.mock.calls[0] ?? [];
		expect(config).toMatchObject({ BASE: HUNTERIO_API_BASE });
		expect(config?.HEADERS).toEqual({
			Authorization: 'Bearer test-key-123',
		});
		expect(config?.HEADERS).not.toHaveProperty('X-API-KEY');
		expect(config?.HEADERS).not.toHaveProperty('TOKEN');
		expect(requestOptions).toMatchObject({
			method: 'GET',
			url: '/leads',
			query: { limit: 10 },
		});
		expect(requestOptions?.query).not.toHaveProperty('api_key');
	});

	it('passes the rate limit config to the shared transport', async () => {
		mockedRequest.mockResolvedValue({ data: {} });

		await makeHunterioRequest('/account', 'test-key-123');

		const [, , options] = mockedRequest.mock.calls[0] ?? [];
		expect(options).toEqual({ rateLimitConfig: HUNTERIO_RATE_LIMIT_CONFIG });
		expect(HUNTERIO_RATE_LIMIT_CONFIG.maxRetries).toBe(0);
		expect(HUNTERIO_RATE_LIMIT_CONFIG.isRateLimitError?.(403, {})).toBe(true);
		expect(
			HUNTERIO_RATE_LIMIT_CONFIG.isRateLimitError?.(403, {
				errors: [{ id: 'too_many_requests', code: 403 }],
			}),
		).toBe(true);
		// Permanent refusals share the 403 status but are not throttles.
		for (const id of [
			'no_signals_access',
			'no_opportunities_access',
			'optional_ai_features_off',
		]) {
			expect(
				HUNTERIO_RATE_LIMIT_CONFIG.isRateLimitError?.(403, {
					errors: [{ id, code: 403, details: 'Not on your plan.' }],
				}),
			).toBe(false);
		}
		expect(HUNTERIO_RATE_LIMIT_CONFIG.isRateLimitError?.(429, {})).toBe(false);
	});

	it('omits the key header and query when no key is given', async () => {
		mockedRequest.mockResolvedValue({ data: {} });

		await makeHunterioRequest('/account');

		const [config, requestOptions] = mockedRequest.mock.calls[0] ?? [];
		expect(config?.HEADERS).not.toHaveProperty('Authorization');
		expect(requestOptions?.query).not.toHaveProperty('api_key');
		expect(mockedRequest).toHaveBeenCalledTimes(1);
	});

	it('throws AuthMissingError for an explicitly empty key without a request', async () => {
		await expect(makeHunterioRequest('/account', '')).rejects.toMatchObject({
			name: 'AuthMissingError',
		});

		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('forwards a JSON body on DELETE requests', async () => {
		mockedRequest.mockResolvedValue(undefined);

		await makeHunterioRequest('/sequences/1/recipients', 'test-key-123', {
			method: 'DELETE',
			body: { lead_ids: [1, 2] },
		});

		const [, requestOptions] = mockedRequest.mock.calls[0] ?? [];
		expect(requestOptions).toMatchObject({
			method: 'DELETE',
			url: '/sequences/1/recipients',
			body: { lead_ids: [1, 2] },
		});
	});

	it('rethrows transport errors unchanged', async () => {
		const transportError = new Error('boom');
		mockedRequest.mockRejectedValue(transportError);

		await expect(makeHunterioRequest('/account', 'test-key-123')).rejects.toBe(
			transportError,
		);
	});

	it('wraps non-Error rejections in HunterioAPIError', async () => {
		mockedRequest.mockRejectedValue('boom');

		await expect(
			makeHunterioRequest('/account', 'test-key-123'),
		).rejects.toBeInstanceOf(HunterioAPIError);
	});
});
