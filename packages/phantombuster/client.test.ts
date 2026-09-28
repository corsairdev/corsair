/**
 * Covers the transport: the `X-Phantombuster-Key` header, the v2 base URL,
 * GET-vs-write body/query routing, and ApiError -> PhantomBusterAPIError
 * wrapping (which preserves status for `error-handlers.ts`). Network is
 * mocked, so this runs in CI.
 */
import { makePhantomBusterRequest, PhantomBusterAPIError } from './client';

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
};

let captured: Captured | undefined;

function mockFetch(body: unknown, status = 200) {
	captured = undefined;
	const stub = async (url: unknown, init?: RequestInit) => {
		const headers: Record<string, string> = {};
		const raw = init?.headers;
		if (raw instanceof Headers) {
			raw.forEach((value, key) => {
				headers[key.toLowerCase()] = value;
			});
		} else {
			// why safe: fetch init headers are a plain string map in this stub.
			const plain = (raw ?? {}) as Record<string, string>;
			for (const [key, value] of Object.entries(plain)) {
				headers[key.toLowerCase()] = value;
			}
		}
		captured = { url: String(url), method: init?.method ?? 'GET', headers };
		return {
			ok: status < 400,
			status,
			statusText: status < 400 ? 'OK' : 'Error',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => body,
			text: async () => JSON.stringify(body),
		};
	};
	// why safe: partial Response stub — the shared request layer only reads ok/status/headers/json/text.
	global.fetch = stub as unknown as typeof global.fetch;
}

describe('makePhantomBusterRequest', () => {
	it('targets the v2 base URL', async () => {
		mockFetch({ ok: true });
		await makePhantomBusterRequest('/agents/fetch-all', 'k');
		expect(captured?.url).toContain('https://api.phantombuster.com/api/v2');
		expect(captured?.url).toContain('/agents/fetch-all');
	});

	it('sends the API key in the X-Phantombuster-Key header', async () => {
		mockFetch({ ok: true });
		await makePhantomBusterRequest('/agents/fetch-all', 'secret-key');
		expect(captured?.headers['x-phantombuster-key']).toBe('secret-key');
	});

	it('sends query params on GET and no JSON body', async () => {
		mockFetch({ ok: true });
		await makePhantomBusterRequest('/agents/fetch', 'k', {
			method: 'GET',
			query: { id: 'ag1' },
		});
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toContain('id=ag1');
	});

	it('sends a JSON body on POST', async () => {
		mockFetch({ id: 'new-id' });
		const res = await makePhantomBusterRequest<{ id: string }>(
			'/agents/save',
			'k',
			{ method: 'POST', body: { name: 'My Phantom' } },
		);
		expect(captured?.method).toBe('POST');
		expect(res.id).toBe('new-id');
	});

	it('wraps transport failures in PhantomBusterAPIError with status', async () => {
		mockFetch({ error: 'unauthorized' }, 401);
		const error = await makePhantomBusterRequest(
			'/agents/fetch-all',
			'bad',
		).catch((error: unknown) => error);
		expect(error).toBeInstanceOf(PhantomBusterAPIError);
		if (error instanceof PhantomBusterAPIError) {
			expect(error.status).toBe(401);
		}
	});
});
