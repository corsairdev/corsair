import { request } from 'corsair/http';
import { makeHookdeckRequest } from './client';
import type { ConnectionsListResponse } from './endpoints/types';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = jest.mocked(request);

function lastCall() {
	const calls = mockRequest.mock.calls;
	const first = calls[0];
	if (first === undefined) {
		throw new Error('expected corsair/http request to be called');
	}
	return { config: first[0], options: first[1] };
}

describe('Hookdeck client', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('targets the dated Hookdeck base with Bearer auth', async () => {
		mockRequest.mockResolvedValue({ id: 'web_1' });
		await makeHookdeckRequest<Record<string, string>>(
			'connections/web_1',
			'live-key-123',
			{ method: 'GET' },
		);

		const { config, options } = lastCall();
		expect(config.BASE).toBe('https://api.hookdeck.com/2025-07-01');
		expect(options.url).toBe('connections/web_1');
		const headers = config.HEADERS;
		if (typeof headers === 'function' || headers === undefined) {
			throw new Error('expected static request headers');
		}
		expect(headers.Authorization).toBe('Bearer live-key-123');
	});

	it('passes query params on GET and omits the body', async () => {
		mockRequest.mockResolvedValue({ models: [], count: 0 });
		await makeHookdeckRequest<ConnectionsListResponse>('connections', 'k', {
			method: 'GET',
			query: { limit: 50, dir: 'desc' },
		});

		const { options } = lastCall();
		expect(options.method).toBe('GET');
		expect(options.query).toEqual({ limit: 50, dir: 'desc' });
		expect(options.body).toBeUndefined();
	});

	it('sends a JSON body on POST', async () => {
		mockRequest.mockResolvedValue({ id: 'web_new' });
		await makeHookdeckRequest<{ id: string }>('connections', 'k', {
			method: 'POST',
			body: { name: 'shopify-my-api' },
		});

		const { options } = lastCall();
		expect(options.method).toBe('POST');
		expect(options.body).toEqual({ name: 'shopify-my-api' });
	});

	it('sends a JSON body on PUT', async () => {
		mockRequest.mockResolvedValue({ id: 'web_1' });
		await makeHookdeckRequest<{ id: string }>('connections/web_1', 'k', {
			method: 'PUT',
			body: { name: 'renamed' },
		});

		const { options } = lastCall();
		expect(options.method).toBe('PUT');
		expect(options.body).toEqual({ name: 'renamed' });
	});

	it('omits body and query on DELETE', async () => {
		mockRequest.mockResolvedValue({ id: 'web_1' });
		await makeHookdeckRequest<{ id: string }>('connections/web_1', 'k', {
			method: 'DELETE',
		});

		const { options } = lastCall();
		expect(options.method).toBe('DELETE');
		expect(options.body).toBeUndefined();
		expect(options.query).toBeUndefined();
	});
});
