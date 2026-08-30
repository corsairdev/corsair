import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import {
	BETTERCONTACT_API_BASE,
	BetterContactAPIError,
	makeBetterContactRequest,
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
		{ method: 'GET', url: 'account' },
		{
			url: `${BETTERCONTACT_API_BASE}/account`,
			ok: false,
			status,
			statusText: 'Error',
			body: { message: 'failed' },
		},
		'BetterContact request failed',
		{ retryAfter },
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makeBetterContactRequest', () => {
	it('sends the API key in X-API-Key header and never as a bearer token', async () => {
		mockRequest.mockResolvedValue({
			success: true,
			credits_left: 100,
			email: 'x@x.com',
		});

		await makeBetterContactRequest('account', 'secret-key', { method: 'GET' });

		const [config] = lastCall();
		expect(config.BASE).toBe(BETTERCONTACT_API_BASE);
		expect(config.HEADERS).toMatchObject({ 'X-API-Key': 'secret-key' });
		// BetterContact authenticates via X-API-Key header only; TOKEN must not
		// be set as that would send a Bearer token header as well.
		expect(config.TOKEN).toBeUndefined();
	});

	it('issues a GET with the endpoint path', async () => {
		mockRequest.mockResolvedValue({});

		await makeBetterContactRequest('account', 'k', { method: 'GET' });

		const [, options] = lastCall();
		expect(options.method).toBe('GET');
		expect(options.url).toBe('account');
	});

	it('passes query parameters on GET requests', async () => {
		mockRequest.mockResolvedValue({});

		await makeBetterContactRequest('lead_finder/async/req_1', 'k', {
			method: 'GET',
		});

		const [, options] = lastCall();
		expect(options.method).toBe('GET');
		expect(options.url).toBe('lead_finder/async/req_1');
	});

	it('sends body on POST and omits query', async () => {
		mockRequest.mockResolvedValue({ success: true, id: 'batch_1' });

		const body = { data: [{ first_name: 'Jane' }] };
		await makeBetterContactRequest('async', 'k', { method: 'POST', body });

		const [, options] = lastCall();
		expect(options.method).toBe('POST');
		expect(options.body).toEqual(body);
		expect(options.query).toBeUndefined();
	});

	it('returns the parsed body on success', async () => {
		const payload = { success: true, credits_left: 500, email: 'a@b.com' };
		mockRequest.mockResolvedValue(payload);

		const result = await makeBetterContactRequest('account', 'k', {
			method: 'GET',
		});

		expect(result).toEqual(payload);
	});

	it('wraps an ApiError in BetterContactAPIError, preserving status and cause', async () => {
		const original = apiError(429, 60_000);
		mockRequest.mockRejectedValue(original);

		await expect(
			makeBetterContactRequest('account', 'k'),
		).rejects.toMatchObject({
			name: 'BetterContactAPIError',
			status: 429,
		});

		try {
			await makeBetterContactRequest('account', 'k');
		} catch (error) {
			const e = error as BetterContactAPIError;
			expect(e).toBeInstanceOf(BetterContactAPIError);
			expect(e.status).toBe(429);
			expect(e.retryAfter).toBe(60_000);
			expect(e.cause).toBe(original);
		}
	});

	it('wraps a non-ApiError failure without inventing a status', async () => {
		mockRequest.mockRejectedValue(new Error('socket hang up'));

		try {
			await makeBetterContactRequest('account', 'k');
		} catch (error) {
			const e = error as BetterContactAPIError;
			expect(e).toBeInstanceOf(BetterContactAPIError);
			expect(e.message).toBe('socket hang up');
			expect(e.status).toBeUndefined();
		}
	});

	it('does not set mediaType for GET requests', async () => {
		mockRequest.mockResolvedValue({});

		await makeBetterContactRequest('account', 'k', { method: 'GET' });

		const [, options] = lastCall();
		// GET requests should use application/json, not form-encoded
		expect(options.mediaType).toBe('application/json');
	});
});
