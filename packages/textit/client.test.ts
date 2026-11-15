import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { makeTextItRequest } from './client';
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

	it('retries a 429 through core, honouring Retry-After', async () => {
		fetchMock
			.mockResolvedValueOnce(
				new Response(JSON.stringify({ detail: 'Throttled' }), {
					status: 429,
					headers: { 'Content-Type': 'application/json', 'Retry-After': '1' },
				}),
			)
			.mockResolvedValueOnce(
				new Response(JSON.stringify({ uuid: 'ws' }), {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				}),
			);
		await expect(
			makeTextItRequest('secret', { method: 'GET', path: '/workspace.json' }),
		).resolves.toEqual({ uuid: 'ws' });
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it("passes core's ApiError through with status, body and Retry-After", async () => {
		const throttled = () =>
			new Response(JSON.stringify({ detail: 'Throttled' }), {
				status: 429,
				headers: { 'Content-Type': 'application/json', 'Retry-After': '0' },
			});
		fetchMock.mockImplementation(async () => throttled());
		const error = await makeTextItRequest('secret', {
			method: 'POST',
			path: '/messages.json',
			body: { contact: 'contact', text: 'Hello' },
			// A rejected promise can carry any value; the instanceof assertion narrows it below.
		}).catch((e: unknown) => e);
		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) throw new Error('Expected ApiError');
		expect(error.status).toBe(429);
		expect(error.body).toEqual({ detail: 'Throttled' });
		expect(fetchMock).toHaveBeenCalledTimes(4);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler(error)).toMatchObject({
			maxRetries: 0,
		});
	}, 20000);

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
