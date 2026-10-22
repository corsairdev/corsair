import { ApiError, request } from 'corsair/http';
import {
	DNSFILTER_API_BASE,
	DnsfilterAPIError,
	makeDnsfilterRequest,
} from './client';

jest.mock('corsair/http', () => {
	class MockApiError extends Error {
		public readonly status: number;
		public readonly body: unknown;
		public readonly retryAfter?: number;

		constructor(
			message: string,
			status = 500,
			body?: unknown,
			retryAfter?: number,
		) {
			super(message);
			this.name = 'ApiError';
			this.status = status;
			this.body = body;
			this.retryAfter = retryAfter;
		}
	}

	return { request: jest.fn(), ApiError: MockApiError };
});

const requestMock = request as unknown as jest.Mock;

const MockApiError = ApiError as unknown as new (
	message: string,
	status?: number,
	body?: unknown,
	retryAfter?: number,
) => Error;

function lastRequestCall() {
	const calls = requestMock.mock.calls;
	return calls[calls.length - 1] as [
		{
			BASE: string;
			HEADERS: Record<string, string>;
		},
		{
			method: string;
			url: string;
			path?: Record<string, unknown>;
			query?: Record<string, unknown>;
			body?: unknown;
		},
	];
}

describe('makeDnsfilterRequest', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		requestMock.mockResolvedValue({ data: [] });
	});

	it('sends the raw API key in the Authorization header', async () => {
		await makeDnsfilterRequest('/v1/networks', 'secret-key');

		const [config, options] = lastRequestCall();
		expect(config.BASE).toBe(DNSFILTER_API_BASE);
		expect(config.HEADERS.Authorization).toBe('secret-key');
		expect(config.HEADERS.Authorization).not.toMatch(/^Bearer /);
		expect(options.url).toBe('/v1/networks');
		expect(options.method).toBe('GET');
		expect(config.HEADERS['Content-Type']).toBe('application/json');
	});

	it('passes path parameters separately from the template', async () => {
		await makeDnsfilterRequest('/v1/networks/{id}', 'secret-key', {
			path: { id: 42 },
		});

		const [, options] = lastRequestCall();
		expect(options.url).toBe('/v1/networks/{id}');
		expect(options.path).toEqual({ id: 42 });
	});

	it('keeps nested pagination objects for the shared serializer', async () => {
		await makeDnsfilterRequest('/v1/networks', 'secret-key', {
			query: { page: { number: 2, size: 50 }, search: 'hq' },
		});

		const [, options] = lastRequestCall();
		expect(options.query).toEqual({
			page: { number: 2, size: 50 },
			search: 'hq',
		});
	});

	it('drops undefined query and body values', async () => {
		await makeDnsfilterRequest('/v1/networks', 'secret-key', {
			method: 'POST',
			query: { search: undefined, protected: false },
			body: { name: 'HQ', organization_id: undefined },
		});

		const [, options] = lastRequestCall();
		expect(options.query).toEqual({ protected: false });
		expect(options.body).toEqual({ name: 'HQ' });
	});

	it('normalises v1 error bodies', async () => {
		requestMock.mockRejectedValueOnce(
			new MockApiError('Request failed', 401, {
				error: 'Invalid API key',
				type: 'unauthorized',
			}),
		);

		await expect(
			makeDnsfilterRequest('/v1/networks', 'bad-key'),
		).rejects.toMatchObject({
			name: 'DnsfilterAPIError',
			message: 'Invalid API key',
			status: 401,
			type: 'unauthorized',
		});
	});

	it('normalises v2 nested error bodies', async () => {
		requestMock.mockRejectedValueOnce(
			new MockApiError('Request failed', 409, {
				error: { message: 'Already resolved', type: 'conflict' },
			}),
		);

		await expect(
			makeDnsfilterRequest('/v2/unblock_requests/{id}/decision', 'key', {
				method: 'POST',
				path: { id: 'abc' },
			}),
		).rejects.toBeInstanceOf(DnsfilterAPIError);
	});

	it('preserves Retry-After metadata on 429 responses', async () => {
		requestMock.mockRejectedValueOnce(
			new MockApiError('Too many requests', 429, { error: 'Slow down' }, 1500),
		);

		const error = await makeDnsfilterRequest('/v1/networks', 'key').catch(
			(caught: unknown) => caught,
		);

		expect(error).toBeInstanceOf(DnsfilterAPIError);
		expect((error as DnsfilterAPIError).isRateLimitError()).toBe(true);
		expect((error as DnsfilterAPIError).retryAfter).toBe(1500);
	});

	it('wraps non-HTTP failures too', async () => {
		requestMock.mockRejectedValueOnce(new Error('socket hang up'));

		await expect(
			makeDnsfilterRequest('/v1/networks', 'key'),
		).rejects.toMatchObject({ message: 'socket hang up' });
	});
});
