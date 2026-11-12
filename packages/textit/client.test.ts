import { AuthMissingError } from 'corsair/core';
import { makeTextItRequest, TextItAPIError } from './client';
import { errorHandlers } from './error-handlers';

describe('TextIt transport', () => {
	let fetchMock: jest.SpyInstance;
	beforeEach(() => {
		fetchMock = jest.spyOn(globalThis, 'fetch');
	});
	afterEach(() => {
		fetchMock.mockRestore();
	});

	it('rejects missing credentials without a network request', async () => {
		await expect(
			makeTextItRequest('', { method: 'GET', path: '/workspace.json' }),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('preserves Retry-After and does not replay a rate-limited write', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify({ detail: 'Throttled' }), {
				status: 429,
				headers: { 'Content-Type': 'application/json', 'Retry-After': '12' },
			}),
		);
		const error = await makeTextItRequest('secret', {
			method: 'POST',
			path: '/messages.json',
			body: { contact: 'contact', text: 'Hello' },
		}).catch((e: unknown) => e);
		expect(error).toBeInstanceOf(TextItAPIError);
		if (!(error instanceof TextItAPIError))
			throw new Error('Expected TextItAPIError');
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(12000);
		expect(error.body).toEqual({ detail: 'Throttled' });
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler(error)).toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 12000,
		});
	});

	it('preserves an authentication failure', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify({ detail: 'Invalid token' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		await expect(
			makeTextItRequest('wrong', { method: 'GET', path: '/workspace.json' }),
		).rejects.toMatchObject({ status: 401, body: { detail: 'Invalid token' } });
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});
