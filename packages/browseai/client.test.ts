/**
 * Transport: Bearer token, JSON POST, official v2 base.
 * Credentials here are fictional.
 */
import { BROWSEAI_API_BASE, makeBrowseaiRequest } from './client';

let captured:
	| {
			url: string;
			method: string;
			headers: Record<string, string>;
			body?: string;
	  }
	| undefined;

const realFetch = global.fetch;
afterEach(() => {
	global.fetch = realFetch;
});

function mockFetch(payload: unknown, status = 200) {
	captured = undefined;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		const headers: Record<string, string> = {};
		const raw = init?.headers;
		if (raw instanceof Headers) {
			raw.forEach((value, key) => {
				headers[key.toLowerCase()] = value;
			});
		}
		captured = {
			url: String(url),
			method: init?.method ?? 'GET',
			headers,
			body: typeof init?.body === 'string' ? init.body : undefined,
		};
		return {
			ok: status < 400,
			status,
			statusText: status < 400 ? 'OK' : 'Error',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => payload,
			text: async () => JSON.stringify(payload),
		};
	}) as unknown as typeof global.fetch;
}

describe('makeBrowseaiRequest', () => {
	it('hits the documented v2 base', async () => {
		mockFetch({ tasksQueueStatus: 'OK' });
		await makeBrowseaiRequest('status', 'tok');
		expect(captured?.url.startsWith(`${BROWSEAI_API_BASE}/status`)).toBe(true);
	});

	it('sends the API key as Bearer', async () => {
		mockFetch({});
		await makeBrowseaiRequest('robots', 'secret-key');
		expect(captured?.headers.authorization).toBe('Bearer secret-key');
	});

	it('POSTs JSON bodies', async () => {
		mockFetch({ statusCode: 200, result: { id: 't1' } });
		await makeBrowseaiRequest('robots/r1/tasks', 'tok', {
			method: 'POST',
			body: { recordVideo: false },
		});
		expect(captured?.method).toBe('POST');
		expect(captured?.headers['content-type']).toContain('application/json');
		expect(captured?.body).toBe('{"recordVideo":false}');
	});
});
