import { ApiError } from 'corsair/http';
import {
	FINERWORKS_API_BASE,
	FinerWorksAPIError,
	makeFinerWorksRequest,
} from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { request } = require('corsair/http') as { request: jest.Mock };

const credentials = { webApiKey: 'web-key', appKey: 'app-key' };

/** Build an ApiError the way `corsair/http` does for a failed response. */
function apiError(status: number, body: unknown): ApiError {
	return new ApiError(
		{ method: 'POST', url: 'v3/list_images' },
		{ url: '', ok: false, status, statusText: 'Bad Request', body },
		'Request failed',
	);
}

beforeEach(() => {
	request.mockReset();
});

describe('makeFinerWorksRequest', () => {
	it('targets the documented base URL and sends both credential headers', async () => {
		request.mockResolvedValue({ ok: true });

		await makeFinerWorksRequest('v3/list_images', credentials, {
			method: 'POST',
			body: { library: { name: 'inventory' } },
		});

		const [config, options] = request.mock.calls[0];
		expect(config.BASE).toBe(FINERWORKS_API_BASE);
		expect(config.HEADERS.web_api_key).toBe('web-key');
		expect(config.HEADERS.app_key).toBe('app-key');
		expect(config.HEADERS['Content-Type']).toBe('application/json');
		expect(options.method).toBe('POST');
		expect(options.url).toBe('v3/list_images');
	});

	it('never falls back to a bearer token', async () => {
		request.mockResolvedValue({});

		await makeFinerWorksRequest('v3/get_company_info', credentials, {
			method: 'GET',
		});

		const [config] = request.mock.calls[0];
		expect(config.TOKEN).toBeUndefined();
		expect(config.HEADERS.Authorization).toBeUndefined();
	});

	it('strips a leading slash so the base URL is not escaped', async () => {
		request.mockResolvedValue({});

		await makeFinerWorksRequest('/v3/list_mats', credentials);

		expect(request.mock.calls[0][1].url).toBe('v3/list_mats');
	});

	it('defaults to POST, the verb most FinerWorks routes use', async () => {
		request.mockResolvedValue({});

		await makeFinerWorksRequest('v3/list_mats', credentials);

		expect(request.mock.calls[0][1].method).toBe('POST');
	});

	it('keeps the body on DELETE, which FinerWorks requires for filters', async () => {
		request.mockResolvedValue({});

		await makeFinerWorksRequest('v3/delete_images', credentials, {
			method: 'DELETE',
			body: { guids: ['g-1'] },
		});

		expect(request.mock.calls[0][1].body).toEqual({ guids: ['g-1'] });
	});

	it('surfaces the nested ModelState message FinerWorks returns on 400', async () => {
		// This is the exact body the live API returns for an unauthorized key pair.
		request.mockRejectedValue(
			apiError(400, {
				Message: 'The request is invalid.',
				ModelState: {
					'ApiC.Models.authorization_credentials': [
						'Missing or unauthorized api credentials',
					],
				},
			}),
		);

		await expect(
			makeFinerWorksRequest('v3/test_my_credentials', credentials),
		).rejects.toThrow(/Missing or unauthorized api credentials/);
	});

	it('preserves the HTTP status on the thrown error', async () => {
		request.mockRejectedValue(apiError(429, { message: 'Too many requests' }));

		await expect(
			makeFinerWorksRequest('v3/list_images', credentials),
		).rejects.toMatchObject({
			name: 'FinerWorksAPIError',
			status: 429,
		});
	});

	it('falls back to the plain message shape when there is no ModelState', async () => {
		request.mockRejectedValue(apiError(404, { message: 'Not found' }));

		await expect(
			makeFinerWorksRequest('v3/list_images', credentials),
		).rejects.toThrow(/Not found/);
	});

	it('wraps non-API failures as FinerWorksAPIError', async () => {
		request.mockRejectedValue(new Error('socket hang up'));

		await expect(
			makeFinerWorksRequest('v3/list_images', credentials),
		).rejects.toBeInstanceOf(FinerWorksAPIError);
	});
});

describe('errorHandlers', () => {
	/**
	 * The client rethrows as FinerWorksAPIError, so the handlers must still see
	 * the status and Retry-After. These go through makeFinerWorksRequest rather
	 * than hand-building an error, so the wrapping itself is under test.
	 */
	async function wrappedError(
		status: number,
		body: unknown,
		retryAfter?: number,
	): Promise<Error> {
		const err = apiError(status, body);
		if (retryAfter !== undefined) {
			(err as { retryAfter?: number }).retryAfter = retryAfter;
		}
		request.mockRejectedValue(err);
		try {
			await makeFinerWorksRequest('v3/list_images', credentials);
			throw new Error('expected the request to reject');
		} catch (caught) {
			return caught as Error;
		}
	}

	it('classifies a wrapped 429 and preserves the provider delay', async () => {
		const err = await wrappedError(429, { message: 'Too Many Requests' }, 2000);

		expect(err).toBeInstanceOf(FinerWorksAPIError);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err)).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler(err)).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 2000,
		});
	});

	it('retries a wrapped 5xx instead of falling through to DEFAULT', async () => {
		const err = await wrappedError(503, { message: 'Service Unavailable' });

		expect(errorHandlers.RATE_LIMIT_ERROR.match(err)).toBe(false);
		expect(errorHandlers.SERVER_ERROR.match(err)).toBe(true);
		await expect(errorHandlers.SERVER_ERROR.handler()).resolves.toEqual({
			maxRetries: 3,
		});
	});

	it('classifies a wrapped 401 as an auth error', async () => {
		const err = await wrappedError(401, { message: 'Unauthorized' });

		expect(errorHandlers.AUTH_ERROR.match(err)).toBe(true);
	});

	it('still matches a raw ApiError, for callers that do not wrap', async () => {
		const err = apiError(429, {});
		(err as { retryAfter?: number }).retryAfter = 1500;

		expect(errorHandlers.RATE_LIMIT_ERROR.match(err)).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler(err)).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 1500,
		});
	});

	it('treats the FinerWorks 400 credential failure as an auth error', async () => {
		const err = await wrappedError(400, {
			Message: 'The request is invalid.',
			ModelState: {
				'ApiC.Models.authorization_credentials': [
					'Missing or unauthorized api credentials',
				],
			},
		});

		// FinerWorks answers 400 here, not 401, so the message drives the match.
		expect(errorHandlers.AUTH_ERROR.match(err)).toBe(true);
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('does not classify a plain 404 as retryable', async () => {
		const err = await wrappedError(404, { message: 'Not found' });

		expect(errorHandlers.RATE_LIMIT_ERROR.match(err)).toBe(false);
		expect(errorHandlers.SERVER_ERROR.match(err)).toBe(false);
		expect(errorHandlers.AUTH_ERROR.match(err)).toBe(false);
		expect(errorHandlers.DEFAULT.match()).toBe(true);
	});

	it('does not retry by default', async () => {
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
