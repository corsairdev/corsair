/**
 * Transport: Bearer token, JSON POST, official v2 base.
 * Credentials here are fictional.
 */
import { z } from 'zod';
import { BROWSEAI_API_BASE, makeBrowseaiRequest } from './client';

const AnyObject = z.object({}).loose();

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

let fetchCalls = 0;

function mockFetch(payload: unknown, status = 200) {
	captured = undefined;
	fetchCalls = 0;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		fetchCalls += 1;
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
	}) as typeof global.fetch;
}

describe('makeBrowseaiRequest', () => {
	it('hits the documented v2 base', async () => {
		mockFetch({ tasksQueueStatus: 'OK' });
		await makeBrowseaiRequest('status', 'tok', { schema: AnyObject });
		expect(captured?.url.startsWith(`${BROWSEAI_API_BASE}/status`)).toBe(true);
	});

	it('sends the API key as Bearer', async () => {
		mockFetch({});
		await makeBrowseaiRequest('robots', 'secret-key', { schema: AnyObject });
		expect(captured?.headers.authorization).toBe('Bearer secret-key');
	});

	it('POSTs JSON bodies', async () => {
		mockFetch({ statusCode: 200, result: { id: 't1' } });
		await makeBrowseaiRequest('robots/r1/tasks', 'tok', {
			method: 'POST',
			body: { recordVideo: false },
			schema: AnyObject,
		});
		expect(captured?.method).toBe('POST');
		expect(captured?.headers['content-type']).toContain('application/json');
		expect(captured?.body).toBe('{"recordVideo":false}');
	});

	it('parses the response with the given schema', async () => {
		mockFetch({ tasksQueueStatus: 'OK' });
		const out = await makeBrowseaiRequest('status', 'tok', {
			schema: z.object({ tasksQueueStatus: z.string() }),
		});
		expect(out.tasksQueueStatus).toBe('OK');
	});

	it('rejects a response that misses the schema', async () => {
		mockFetch({ nope: true });
		await expect(
			makeBrowseaiRequest('status', 'tok', {
				schema: z.object({ tasksQueueStatus: z.string() }),
			}),
		).rejects.toThrow();
	});

	it('does not retry POST on 429', async () => {
		mockFetch({ messageCode: 'rate_limited' }, 429);
		await expect(
			makeBrowseaiRequest('robots/r1/tasks', 'tok', {
				method: 'POST',
				body: { recordVideo: false },
				schema: AnyObject,
			}),
		).rejects.toThrow();
		expect(fetchCalls).toBe(1);
	});
});
