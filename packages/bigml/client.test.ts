/** Covers `makeBigmlRequest`'s transport behaviour, independent of any endpoint. */
import { BIGML_API_BASE, BigmlAPIError, makeBigmlRequest } from './client';

let lastUrl = '';
let lastMethod = '';
let lastBody: string | undefined;

beforeEach(() => {
	lastUrl = '';
	lastMethod = '';
	lastBody = undefined;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		lastUrl = String(url);
		lastMethod = init?.method ?? 'GET';
		lastBody = typeof init?.body === 'string' ? init.body : undefined;
		return {
			ok: true,
			status: 200,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => ({ resource: 'source/e1' }),
			text: async () => JSON.stringify({ resource: 'source/e1' }),
		};
	}) as unknown as typeof global.fetch;
});

describe('makeBigmlRequest', () => {
	it('targets the documented andromeda API host', async () => {
		await makeBigmlRequest('source', 'testuser', 'testkey');
		const url = new URL(lastUrl);
		// `startsWith(BIGML_API_BASE)` would false-pass a typo like
		// `/andromeda2/source` - parse and check the exact pathname instead.
		expect(url.origin).toBe(new URL(BIGML_API_BASE).origin);
		expect(url.pathname).toBe('/andromeda/source');
	});

	it('sends username and api_key as query parameters, not headers', async () => {
		await makeBigmlRequest('source', 'testuser', 'testkey');
		const url = new URL(lastUrl);
		expect(url.searchParams.get('username')).toBe('testuser');
		expect(url.searchParams.get('api_key')).toBe('testkey');
	});

	it('refuses to call out without both a username and an api key', async () => {
		await expect(makeBigmlRequest('source', '', 'testkey')).rejects.toThrow(
			BigmlAPIError,
		);
		await expect(makeBigmlRequest('source', 'testuser', '')).rejects.toThrow(
			BigmlAPIError,
		);
	});

	it('sends a body on POST and PUT but not on GET or DELETE', async () => {
		await makeBigmlRequest('project', 'u', 'k', {
			method: 'POST',
			body: { name: 'x' },
		});
		expect(lastMethod).toBe('POST');
		expect(lastBody).toBe(JSON.stringify({ name: 'x' }));

		await makeBigmlRequest('project/p1', 'u', 'k', { method: 'DELETE' });
		expect(lastMethod).toBe('DELETE');
		expect(lastBody).toBeUndefined();
	});

	it('wraps a transport error carrying a status into a BigmlAPIError', async () => {
		global.fetch = (async () => {
			throw Object.assign(new Error('not found'), { status: 404 });
		}) as unknown as typeof global.fetch;

		let failure: { error: unknown } | undefined;
		try {
			await makeBigmlRequest('project/missing', 'u', 'k');
		} catch (error) {
			failure = { error };
		}
		expect(failure).toBeDefined();
		expect(failure?.error).toBeInstanceOf(BigmlAPIError);
		expect((failure?.error as BigmlAPIError).status).toBe(404);
	});

	/**
	 * BigML embeds this account's live `username`/`api_key` directly in
	 * `meta.next`/`meta.previous` pagination links - confirmed live against a
	 * real account. Left unredacted, that URL would carry the credentials into
	 * whatever the caller does with the response next.
	 */
	it('strips username and api_key from meta.next and meta.previous pagination links', async () => {
		global.fetch = (async () => ({
			ok: true,
			status: 200,
			statusText: 'OK',
			url: 'x',
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => ({
				meta: {
					limit: 1,
					offset: 0,
					total_count: 2,
					next: '/andromeda/source?username=realuser&api_key=realsecret&limit=1&offset=1',
					previous: null,
				},
				objects: [],
			}),
			text: async () => '',
		})) as unknown as typeof global.fetch;

		const result = await makeBigmlRequest<{
			meta: { next: string | null; previous: string | null };
		}>('source', 'u', 'k');

		expect(result.meta.next).not.toContain('realsecret');
		expect(result.meta.next).not.toContain('realuser');
		expect(result.meta.next).not.toBeNull();
		expect(result.meta.next).toBe('/andromeda/source?limit=1&offset=1');
	});
});
