import { linksCreate, linksDeleteBulk, linksList } from './endpoints';
import type { ShortioContext } from './index';

const ctx = { key: 'secret-key' } as ShortioContext;
const link = {
	originalURL: 'https://example.com',
	path: 'a',
	idString: 'lnk_1',
	id: '1',
	shortURL: 'http://short.example/a',
	secureShortURL: 'https://short.example/a',
};

describe('Short.io HTTP transport', () => {
	afterEach(() => jest.restoreAllMocks());
	it('sends the raw authorization header and later-page query through fetch', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(
				new Response(
					JSON.stringify({ count: 1, links: [link], nextPageToken: null }),
					{ status: 200, headers: { 'Content-Type': 'application/json' } },
				),
			);
		await linksList(ctx, {
			domain_id: 5,
			pageToken: 'next token',
		});
		const [url, init] = fetchMock.mock.calls[0]!;
		expect(url).toBe(
			'https://api.short.io/api/links?domain_id=5&pageToken=next%20token',
		);
		expect(new Headers(init?.headers).get('authorization')).toBe('secret-key');
		expect(init?.method).toBe('GET');
		expect(init?.body).toBeUndefined();
	});
	it('serializes the bulk DELETE body', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ success: true }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		await linksDeleteBulk(ctx, { link_ids: ['lnk_1'] });
		const [url, init] = fetchMock.mock.calls[0]!;
		expect(url).toBe('https://api.short.io/links/delete_bulk');
		expect(init?.method).toBe('DELETE');
		expect(init?.body).toBe('{"link_ids":["lnk_1"]}');
		expect(new Headers(init?.headers).get('content-type')).toBe(
			'application/json',
		);
	});
	it('preserves numeric Retry-After on a 429 without replaying a write', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ error: 'rate limit' }), {
				status: 429,
				headers: { 'Content-Type': 'application/json', 'Retry-After': '3' },
			}),
		);
		await expect(
			linksCreate(ctx, {
				domain: 'short.example',
				originalURL: 'https://example.com',
			}),
		).rejects.toMatchObject({
			status: 429,
			retryAfter: 3000,
			body: { error: 'rate limit' },
		});
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});
