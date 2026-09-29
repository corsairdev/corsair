import { ApiError, request } from 'corsair/http';
import { makePlainRequest, PLAIN_API_BASE, PlainAPIError } from './client';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

const mockRequest = jest.mocked(request);

function apiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'POST', url: '' },
		{
			url: PLAIN_API_BASE,
			ok: false,
			status,
			statusText: status === 429 ? 'Too Many Requests' : 'Error',
			body: { errors: [{ message: 'boom' }] },
		},
		`request failed with ${status}`,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('makePlainRequest', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('posts GraphQL to the Plain base URL with a Bearer key', async () => {
		mockRequest.mockResolvedValue({ data: { id: 'cus_123' } });
		const result = await makePlainRequest<{ id: string }>(
			'query GetCustomerById($customerId: ID!) { customer(customerId: $customerId) { id } }',
			'live_key_123',
			{ customerId: 'cus_123' },
			'GetCustomerById',
		);

		expect(result).toEqual({ id: 'cus_123' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: PLAIN_API_BASE,
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer live_key_123',
					'Content-Type': 'application/json',
				}),
			}),
			expect.objectContaining({
				method: 'POST',
				// The corsair builder composes `${BASE}/${url}`; `v1` yields the
				// documented endpoint verbatim. An empty path produced a trailing
				// slash (`.../v1/`), which Plain answers with HTTP 404.
				url: 'v1',
				body: {
					query: expect.stringContaining('GetCustomerById'),
					variables: { customerId: 'cus_123' },
					operationName: 'GetCustomerById',
				},
			}),
		);
	});

	it('defaults variables to an empty object', async () => {
		mockRequest.mockResolvedValue({ data: {} });
		await makePlainRequest('query { myWorkspace { id } }', 'live_key_123');

		const firstCall = mockRequest.mock.calls[0];
		expect(firstCall?.[1]).toMatchObject({
			body: expect.objectContaining({ variables: {} }),
		});
	});

	it('throws PlainAPIError with the code for GraphQL errors', async () => {
		mockRequest.mockResolvedValue({
			errors: [{ message: 'Invalid auth', extensions: { code: 'AUTH_ERROR' } }],
		});

		await expect(
			makePlainRequest('query { myWorkspace { id } }', 'bad_key'),
		).rejects.toMatchObject({
			name: 'PlainAPIError',
			message: 'Invalid auth',
			code: 'AUTH_ERROR',
		});
	});

	it('throws when the response has no data and no errors', async () => {
		mockRequest.mockResolvedValue({});
		await expect(
			makePlainRequest('query { myWorkspace { id } }', 'live_key_123'),
		).rejects.toThrow('No data returned from Plain API');
	});

	it('rethrows PlainAPIError unchanged', async () => {
		const original = new PlainAPIError('UpsertCustomer: nope', {
			code: 'BAD_INPUT',
		});
		mockRequest.mockRejectedValue(original);

		await expect(
			makePlainRequest('mutation { upsertCustomer }', 'k'),
		).rejects.toBe(original);
	});

	it('wraps ApiError preserving status and retryAfter', async () => {
		mockRequest.mockRejectedValue(apiError(429, 1500));

		// JUSTIFY(unknown): the rejection reason is untyped by definition, so
		// it is captured as `unknown` and only read after `instanceof`.
		const seen: unknown = await makePlainRequest(
			'query { myWorkspace { id } }',
			'k',
		).catch((error: unknown) => error);
		expect(seen).toBeInstanceOf(PlainAPIError);
		// JUSTIFY(instanceof): required to read `status`/`retryAfter` off the
		// typed `Error` union member; nothing is cast.
		if (seen instanceof PlainAPIError) {
			expect(seen.status).toBe(429);
			expect(seen.retryAfter).toBe(1500);
		}
	});

	it('wraps generic errors', async () => {
		mockRequest.mockRejectedValue(new Error('socket hang up'));
		await expect(
			makePlainRequest('query { myWorkspace { id } }', 'k'),
		).rejects.toMatchObject({
			name: 'PlainAPIError',
			message: 'socket hang up',
		});
	});

	it('wraps non-error throws as unknown errors', async () => {
		mockRequest.mockRejectedValue('string failure');
		await expect(
			makePlainRequest('query { myWorkspace { id } }', 'k'),
		).rejects.toThrow('Unknown error');
	});
});

describe('PlainAPIError', () => {
	it('exposes code without status when there is no cause', () => {
		const error = new PlainAPIError('msg', { code: 'X' });
		expect(error.code).toBe('X');
		expect(error.status).toBeUndefined();
		expect(error.name).toBe('PlainAPIError');
	});

	it('copies status and retryAfter from an ApiError cause', () => {
		const error = new PlainAPIError('msg', { cause: apiError(401) });
		expect(error.status).toBe(401);
		expect(error.retryAfter).toBeUndefined();
	});
});
