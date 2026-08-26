import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import {
	ABUSEIPDB_API_BASE,
	AbuseIPDBAPIError,
	makeAbuseIPDBRequest,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = request as jest.MockedFunction<typeof request>;

function lastCall(): [OpenAPIConfig, ApiRequestOptions] {
	const call = mockRequest.mock.calls.at(-1);
	if (!call) throw new Error('request() was never called');
	return call as unknown as [OpenAPIConfig, ApiRequestOptions];
}

function apiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: 'check' },
		{
			url: `${ABUSEIPDB_API_BASE}/check`,
			ok: false,
			status,
			statusText: 'Error',
			body: { errors: [{ detail: 'failed', status }] },
		},
		'AbuseIPDB request failed',
		{ retryAfter },
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makeAbuseIPDBRequest', () => {
	it('sends the API key in the Key header and never as a bearer token', async () => {
		mockRequest.mockResolvedValue({ data: {} });

		await makeAbuseIPDBRequest('check', 'secret-key', {
			query: { ipAddress: '118.25.6.39' },
		});

		const [config] = lastCall();
		expect(config.BASE).toBe(ABUSEIPDB_API_BASE);
		expect(config.HEADERS).toMatchObject({ Key: 'secret-key' });
		// AbuseIPDB authenticates via the Key header; the `key` query
		// parameter is also supported but gets logged by the provider, so
		// it is deliberately avoided.
		expect(config.TOKEN).toBeUndefined();
	});

	it('issues a GET with the endpoint path and query parameters', async () => {
		mockRequest.mockResolvedValue({ data: {} });

		await makeAbuseIPDBRequest('check', 'k', {
			query: { ipAddress: '118.25.6.39', verbose: true },
		});

		const [, options] = lastCall();
		expect(options.method).toBe('GET');
		expect(options.url).toBe('check');
		expect(options.query).toEqual({
			ipAddress: '118.25.6.39',
			verbose: true,
		});
	});

	it('returns the parsed body on success', async () => {
		mockRequest.mockResolvedValue({ data: { isPublic: true } });

		const result = await makeAbuseIPDBRequest('check', 'k', {
			query: { ipAddress: '118.25.6.39' },
		});

		expect(result).toEqual({ data: { isPublic: true } });
	});

	it('POSTs a form-urlencoded body for the report endpoint', async () => {
		mockRequest.mockResolvedValue({ data: {} });

		await makeAbuseIPDBRequest('report', 'k', {
			method: 'POST',
			formBody: {
				ip: '118.25.6.39',
				categories: '18,21',
				comment: 'SSH brute force',
			},
		});

		const [, options] = lastCall();
		expect(options.method).toBe('POST');
		expect(options.mediaType).toBe('application/x-www-form-urlencoded');
		expect(options.body).toBe(
			'ip=118.25.6.39&categories=18%2C21&comment=SSH+brute+force',
		);
	});

	it('skips undefined form fields when serializing', async () => {
		mockRequest.mockResolvedValue({ data: {} });

		await makeAbuseIPDBRequest('report', 'k', {
			method: 'POST',
			formBody: {
				ip: '118.25.6.39',
				categories: '18',
				comment: undefined,
				timestamp: undefined,
			},
		});

		const [, options] = lastCall();
		expect(options.body).toBe('ip=118.25.6.39&categories=18');
	});

	it('supports DELETE requests with query parameters', async () => {
		mockRequest.mockResolvedValue({ data: {} });

		await makeAbuseIPDBRequest('clear-address', 'k', {
			method: 'DELETE',
			query: { ipAddress: '118.25.6.39' },
		});

		const [, options] = lastCall();
		expect(options.method).toBe('DELETE');
		expect(options.query).toEqual({ ipAddress: '118.25.6.39' });
	});

	it('wraps an ApiError in AbuseIPDBAPIError, preserving status and cause', async () => {
		const original = apiError(429, 1500);
		mockRequest.mockRejectedValue(original);

		try {
			await makeAbuseIPDBRequest('check', 'k', { retries: false });
			throw new Error('expected makeAbuseIPDBRequest to throw');
		} catch (error) {
			const abuseError = error as AbuseIPDBAPIError;
			expect(abuseError).toBeInstanceOf(AbuseIPDBAPIError);
			expect(abuseError.status).toBe(429);
			expect(abuseError.code).toBe(429);
			expect(abuseError.retryAfter).toBe(1500);
			expect(abuseError.cause).toBe(original);
		}
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});

	it('wraps a non-ApiError failure without inventing a status', async () => {
		mockRequest.mockRejectedValue(new Error('socket hang up'));

		try {
			await makeAbuseIPDBRequest('check', 'k', { retries: false });
			throw new Error('expected makeAbuseIPDBRequest to throw');
		} catch (error) {
			const abuseError = error as AbuseIPDBAPIError;
			expect(abuseError).toBeInstanceOf(AbuseIPDBAPIError);
			expect(abuseError.message).toBe('socket hang up');
			expect(abuseError.status).toBeUndefined();
		}
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});

	it('does not retry a 429 on GET', async () => {
		mockRequest.mockRejectedValue(apiError(429, 0));

		await expect(makeAbuseIPDBRequest('check', 'k')).rejects.toMatchObject({
			name: 'AbuseIPDBAPIError',
			status: 429,
		});
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});

	it('retries a 5xx on GET then returns the body', async () => {
		mockRequest
			.mockRejectedValueOnce(apiError(500, 0))
			.mockResolvedValueOnce({ data: { ipAddress: '1.1.1.1' } });

		await expect(makeAbuseIPDBRequest('check', 'k')).resolves.toEqual({
			data: { ipAddress: '1.1.1.1' },
		});
		expect(mockRequest).toHaveBeenCalledTimes(2);
	});

	it('does not retry a 429 on POST', async () => {
		mockRequest.mockRejectedValue(apiError(429, 0));

		await expect(
			makeAbuseIPDBRequest('report', 'k', {
				method: 'POST',
				formBody: { ip: '1.1.1.1', categories: '18' },
			}),
		).rejects.toMatchObject({ name: 'AbuseIPDBAPIError', status: 429 });
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});

	it('does not retry a 429 on DELETE', async () => {
		mockRequest.mockRejectedValue(apiError(429, 0));

		await expect(
			makeAbuseIPDBRequest('clear-address', 'k', {
				method: 'DELETE',
				query: { ipAddress: '1.1.1.1' },
			}),
		).rejects.toMatchObject({ name: 'AbuseIPDBAPIError', status: 429 });
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});

	it('rethrows after exhausting GET 5xx retries', async () => {
		mockRequest.mockRejectedValue(apiError(500, 0));

		await expect(makeAbuseIPDBRequest('check', 'k')).rejects.toMatchObject({
			name: 'AbuseIPDBAPIError',
			status: 500,
		});
		expect(mockRequest).toHaveBeenCalledTimes(6);
	});
});
