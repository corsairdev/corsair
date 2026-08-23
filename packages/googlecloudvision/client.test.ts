import { ApiError, request } from 'corsair/http';
import { makeGoogleCloudVisionRequest } from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockedRequest = request as jest.MockedFunction<typeof request>;

function apiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: 'ps' },
		{
			url: 'https://vision.googleapis.com/v1/ps',
			ok: false,
			status,
			statusText: 'Error',
			body: {},
		},
		'Error',
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('makeGoogleCloudVisionRequest', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockedRequest.mockResolvedValue({ ok: true });
	});

	it('sends api keys via x-goog-api-key and does not set TOKEN', async () => {
		await makeGoogleCloudVisionRequest('images:annotate', {
			key: 'vision-key',
			authType: 'api_key',
		});

		expect(mockedRequest).toHaveBeenCalledTimes(1);
		const config = mockedRequest.mock.calls[0]?.[0];
		expect(config?.TOKEN).toBeUndefined();
		expect(config?.HEADERS).toMatchObject({
			'x-goog-api-key': 'vision-key',
		});
		expect(config?.HEADERS).not.toHaveProperty('Authorization');
	});

	it('treats ya29 tokens as oauth when authType is omitted', async () => {
		await makeGoogleCloudVisionRequest('images:annotate', {
			key: 'ya29.access',
		});

		const config = mockedRequest.mock.calls[0]?.[0];
		expect(config?.HEADERS).toMatchObject({
			Authorization: 'Bearer ya29.access',
		});
		expect(config?.HEADERS).not.toHaveProperty('x-goog-api-key');
	});

	it('disables corsair/http transport retries', async () => {
		await makeGoogleCloudVisionRequest('ps', {
			key: 'vision-key',
			authType: 'api_key',
		});

		expect(mockedRequest.mock.calls[0]?.[2]).toEqual({
			rateLimitConfig: {
				enabled: false,
				maxRetries: 0,
				initialRetryDelay: 1000,
				backoffMultiplier: 2,
				headerNames: {},
			},
		});
	});

	it('sends oauth tokens as Bearer and does not set TOKEN', async () => {
		await makeGoogleCloudVisionRequest(
			'images:annotate',
			{ key: 'ya29.access', authType: 'oauth_2' },
			{ method: 'POST', body: { requests: [] } },
		);

		const config = mockedRequest.mock.calls[0]?.[0];
		expect(config?.TOKEN).toBeUndefined();
		expect(config?.HEADERS).toMatchObject({
			Authorization: 'Bearer ya29.access',
		});
		expect(config?.HEADERS).not.toHaveProperty('x-goog-api-key');
	});

	it('forwards query parameters on POST', async () => {
		await makeGoogleCloudVisionRequest(
			'projects/p/locations/l/productSets',
			{ key: 'vision-key', authType: 'api_key' },
			{
				method: 'POST',
				body: { displayName: 'set' },
				query: { productSetId: 'set-1' },
			},
		);

		const options = mockedRequest.mock.calls[0]?.[1];
		expect(options?.query).toEqual({ productSetId: 'set-1' });
		expect(options?.body).toEqual({ displayName: 'set' });
	});

	it('rethrows ApiError so retryAfter is preserved', async () => {
		const err = apiError(429, 1000);
		mockedRequest.mockRejectedValue(err);

		await expect(
			makeGoogleCloudVisionRequest(
				'ps',
				{ key: 'vision-key', authType: 'api_key' },
				{ method: 'POST' },
			),
		).rejects.toBe(err);
	});

	it('retries idempotent GET 429s then succeeds', async () => {
		const err = apiError(429, 1);
		mockedRequest
			.mockRejectedValueOnce(err)
			.mockResolvedValueOnce({ name: 'ps' });

		await expect(
			makeGoogleCloudVisionRequest('ps', {
				key: 'vision-key',
				authType: 'api_key',
			}),
		).resolves.toEqual({ name: 'ps' });
		expect(mockedRequest).toHaveBeenCalledTimes(2);
	});

	it('does not retry non-GET 429s', async () => {
		const err = apiError(429, 1);
		mockedRequest.mockRejectedValue(err);

		await expect(
			makeGoogleCloudVisionRequest(
				'images:annotate',
				{ key: 'vision-key', authType: 'api_key' },
				{ method: 'POST', body: { requests: [] } },
			),
		).rejects.toBe(err);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
	});
});

describe('errorHandlers', () => {
	it('matches ApiError 429 and disables binder retries', async () => {
		const err = apiError(429, 2500);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err)).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler(err)).resolves.toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 2500,
		});
	});
});
