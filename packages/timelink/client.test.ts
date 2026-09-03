import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { makeTimelinkRequest, TIMELINK_API_BASE } from './client';

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

function apiError(status: number): ApiError {
	return new ApiError(
		{ method: 'DELETE', url: 'clients/1' },
		{
			url: `${TIMELINK_API_BASE}/clients/1`,
			ok: false,
			status,
			statusText: 'Error',
			body: { message: 'failed' },
		},
		'Timelink request failed',
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makeTimelinkRequest', () => {
	it('authenticates with a Bearer token and the base URL is correct', async () => {
		mockRequest.mockResolvedValue({} as never);

		await makeTimelinkRequest('clients/1', 'secret-key');

		const [config] = lastCall();
		expect(config.BASE).toBe(TIMELINK_API_BASE);
		expect(config.TOKEN).toBe('secret-key');
		expect(config.HEADERS).toEqual({
			'Content-Type': 'application/json',
		});
	});

	it('issues a GET by default with query parameters passed through', async () => {
		mockRequest.mockResolvedValue({} as never);

		await makeTimelinkRequest('clients', 'k', {
			query: { active: true, limit: 10 },
		});

		const [, options] = lastCall();
		expect(options.method).toBe('GET');
		expect(options.url).toBe('clients');
		expect(options.query).toEqual({ active: true, limit: 10 });
		expect(options.body).toBeUndefined();
	});

	it('sends a JSON body only for write methods (POST/PUT/PATCH)', async () => {
		mockRequest.mockResolvedValue({} as never);
		const body = { name: 'Jane Doe' };

		await makeTimelinkRequest('clients', 'k', { method: 'POST', body });

		const [, options] = lastCall();
		expect(options.method).toBe('POST');
		expect(options.body).toEqual(body);
		expect(options.mediaType).toBe('application/json; charset=utf-8');
	});

	it('does not attach a body to DELETE requests', async () => {
		mockRequest.mockResolvedValue({} as never);

		await makeTimelinkRequest('clients/1', 'k', {
			method: 'DELETE',
			body: { unexpected: true },
		});

		const [, options] = lastCall();
		expect(options.method).toBe('DELETE');
		expect(options.body).toBeUndefined();
	});

	it('does not attach query parameters to non-GET requests', async () => {
		mockRequest.mockResolvedValue({} as never);

		await makeTimelinkRequest('clients', 'k', {
			method: 'POST',
			body: { name: 'x' },
			query: { leaked: true },
		});

		const [, options] = lastCall();
		expect(options.query).toBeUndefined();
	});

	it('returns the parsed body on success', async () => {
		mockRequest.mockResolvedValue({ id: 'abc' } as never);

		const result = await makeTimelinkRequest<{ id: string }>(
			'clients/abc',
			'k',
		);

		expect(result).toEqual({ id: 'abc' });
	});

	it('wraps ApiError into TimelinkAPIError preserving the status', async () => {
		mockRequest.mockRejectedValue(apiError(404));

		await expect(
			makeTimelinkRequest('clients/1', 'k', { method: 'DELETE' }),
		).rejects.toMatchObject({
			name: 'TimelinkAPIError',
			status: 404,
		});
	});

	it('wraps non-ApiError failures without a status', async () => {
		mockRequest.mockRejectedValue(new TypeError('network down'));

		await expect(makeTimelinkRequest('clients/1', 'k')).rejects.toMatchObject({
			name: 'TimelinkAPIError',
			status: undefined,
		});
	});
});
