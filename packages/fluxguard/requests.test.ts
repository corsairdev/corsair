jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import type { FluxguardContext } from './index';
import { fluxguard } from './index';

const BASE = 'https://api.fluxguard.com';

function makeCtx(): FluxguardContext {
	const subset: Pick<FluxguardContext, 'key' | 'options'> = {
		key: 'fg-secret',
		options: {},
	};
	// Safe: the endpoints read only key, options and db from the context.
	// A narrower type is not practical because a full CorsairPluginContext needs the hub, keys and database.
	return { ...subset, db: {}, endpoints: {} } as FluxguardContext;
}

function jsonResponse(body: object, init: ResponseInit = {}): Response {
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		...init,
	});
}

describe('Fluxguard HTTP requests', () => {
	const endpoints = fluxguard({ key: 'fg-secret' }).endpoints!;
	let fetchMock: jest.SpyInstance<Promise<Response>, Parameters<typeof fetch>>;

	beforeEach(() => {
		fetchMock = jest.spyOn(globalThis, 'fetch');
	});
	afterEach(() => {
		fetchMock.mockRestore();
	});

	function lastCall() {
		const [url, init] = fetchMock.mock.calls[0]!;
		return { url: String(url), init: init! };
	}

	// unknown: the request body is JSON of whatever shape the operation sent,
	// so the assertion helper reads it as an open record rather than one type.
	function sentBody(): Record<string, unknown> {
		const body = lastCall().init.body;
		if (typeof body !== 'string') {
			throw new Error('expected a JSON string body');
		}
		return JSON.parse(body) as Record<string, unknown>;
	}

	function sentHeader(name: string): string | null {
		return new Headers(lastCall().init.headers).get(name);
	}

	it('sends the API key in the x-api-key header on every call', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ id: 'acct' }));

		await endpoints.account.get(makeCtx(), {});

		expect(sentHeader('x-api-key')).toBe('fg-secret');
		expect(sentHeader('accept')).toBe('application/json');
	});

	it('reads the account with GET /account', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ id: 'acct' }));

		const result = await endpoints.account.get(makeCtx(), {});

		expect(lastCall().url).toBe(`${BASE}/account`);
		expect(lastCall().init.method).toBe('GET');
		expect(lastCall().init.body).toBeUndefined();
		expect(result.id).toBe('acct');
	});

	it('posts the page to /add-page with only the fields given', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ siteId: 's1', sessionId: 'se1', pageId: 'p1' }),
		);

		await endpoints.monitoring.addPage(makeCtx(), {
			url: 'https://example.org/',
			siteNickname: 'Example',
		});

		expect(lastCall().url).toBe(`${BASE}/add-page`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toEqual({
			url: 'https://example.org/',
			siteNickname: 'Example',
		});
	});

	it('posts every add-page option when a category is named', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ siteId: 's1', sessionId: 'se1', pageId: 'p1' }),
		);

		await endpoints.monitoring.addPage(makeCtx(), {
			url: 'https://example.org/',
			categories: ['c1', 'c2'],
			categoryId: 'c1',
			categoryName: 'News',
		});

		expect(sentBody()).toEqual({
			url: 'https://example.org/',
			categories: ['c1', 'c2'],
			categoryId: 'c1',
			categoryName: 'News',
		});
	});

	it('adds a page to an existing site without new-site options', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ siteId: 's1', sessionId: 'se1', pageId: 'p1' }),
		);

		await endpoints.monitoring.addPage(makeCtx(), {
			url: 'https://example.org/',
			siteId: 's1',
			sessionId: 'se1',
		});

		expect(sentBody()).toEqual({
			url: 'https://example.org/',
			siteId: 's1',
			sessionId: 'se1',
		});
	});

	it('rejects siteId without sessionId before sending', async () => {
		await expect(
			endpoints.monitoring.addPage(makeCtx(), {
				url: 'https://example.org/',
				siteId: 's1',
			}),
		).rejects.toThrow(/siteId and sessionId/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects site settings on an existing site before sending', async () => {
		// The API answers 400 "Site settings (categories, nickname) cannot be
		// specified as the site already exists."
		await expect(
			endpoints.monitoring.addPage(makeCtx(), {
				url: 'https://example.org/',
				siteId: 's1',
				sessionId: 'se1',
				categoryName: 'News',
			}),
		).rejects.toThrow(/rejects site settings/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a nickname on an existing site before sending', async () => {
		await expect(
			endpoints.monitoring.addPage(makeCtx(), {
				url: 'https://example.org/',
				siteId: 's1',
				sessionId: 'se1',
				siteNickname: 'Nick',
			}),
		).rejects.toThrow(/rejects site settings/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts a scheme-less host, which the API also accepts', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ siteId: 's1', sessionId: 'se1', pageId: 'p1' }),
		);

		await endpoints.monitoring.addPage(makeCtx(), { url: 'example.net' });

		expect(sentBody()).toEqual({ url: 'example.net' });
	});

	it('posts a crawl to the session path and accepts the 204', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

		const result = await endpoints.monitoring.startCrawl(makeCtx(), {
			siteId: 's1',
			sessionId: 'se1',
		});

		expect(lastCall().url).toBe(`${BASE}/site/s1/session/se1/crawl`);
		expect(lastCall().init.method).toBe('POST');
		expect(result).toEqual({ siteId: 's1', sessionId: 'se1' });
	});

	it('reads a page with GET on the session path', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ id: 'p1' }));

		const result = await endpoints.monitoring.getPage(makeCtx(), {
			siteId: 's1',
			sessionId: 'se1',
			pageId: 'p1',
		});

		expect(lastCall().url).toBe(`${BASE}/site/s1/session/se1/page/p1`);
		expect(lastCall().init.method).toBe('GET');
		expect(result.id).toBe('p1');
	});

	it('encodes path segments so an id cannot change the route', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ id: 'p1' }));

		await endpoints.monitoring.getPage(makeCtx(), {
			siteId: 'a/b',
			sessionId: 'se1',
			pageId: 'p1',
		});

		expect(lastCall().url).toBe(`${BASE}/site/a%2Fb/session/se1/page/p1`);
	});

	it('deletes a page with DELETE on the session path', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

		const result = await endpoints.monitoring.deletePage(makeCtx(), {
			siteId: 's1',
			sessionId: 'se1',
			pageId: 'p1',
		});

		expect(lastCall().url).toBe(`${BASE}/site/s1/session/se1/page/p1`);
		expect(lastCall().init.method).toBe('DELETE');
		expect(result).toEqual({
			success: true,
			siteId: 's1',
			sessionId: 'se1',
			pageId: 'p1',
		});
	});

	it('deletes a site with DELETE /site/{siteId}', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

		const result = await endpoints.monitoring.deleteSite(makeCtx(), {
			siteId: 's1',
		});

		expect(lastCall().url).toBe(`${BASE}/site/s1`);
		expect(lastCall().init.method).toBe('DELETE');
		expect(result).toEqual({ success: true, siteId: 's1' });
	});

	it('lists webhooks with GET /account/webhook', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({}));

		await endpoints.webhooks.list(makeCtx(), {});

		expect(lastCall().url).toBe(`${BASE}/account/webhook`);
		expect(lastCall().init.method).toBe('GET');
	});

	it('creates a webhook with PUT /account/webhook', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ id: 'w1' }));

		const result = await endpoints.webhooks.create(makeCtx(), {
			url: 'https://example.org/hooks',
		});

		expect(lastCall().url).toBe(`${BASE}/account/webhook`);
		expect(lastCall().init.method).toBe('PUT');
		expect(sentBody()).toEqual({ url: 'https://example.org/hooks' });
		expect(result).toEqual({ id: 'w1', url: 'https://example.org/hooks' });
	});

	it('deletes a webhook by putting the id in the body', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

		const result = await endpoints.webhooks.delete(makeCtx(), { id: 'w1' });

		expect(lastCall().url).toBe(`${BASE}/account/webhook`);
		expect(lastCall().init.method).toBe('DELETE');
		// A query parameter is ignored by the API and an empty body is a 400,
		// so the id has to travel in the body.
		expect(sentBody()).toEqual({ id: 'w1' });
		expect(result).toEqual({ success: true, id: 'w1' });
	});

	it('reads the sample delivery with GET /account/webhook/sample', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse([{ url: 'https://example.org/' }]),
		);

		const result = await endpoints.webhooks.sample(makeCtx(), {});

		expect(lastCall().url).toBe(`${BASE}/account/webhook/sample`);
		expect(lastCall().init.method).toBe('GET');
		// The endpoint answers a bare array, so one sample in means one out.
		expect(result.samples).toHaveLength(1);
	});

	it('lists categories with GET /account/category', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({}));

		await endpoints.categories.list(makeCtx(), {});

		expect(lastCall().url).toBe(`${BASE}/account/category`);
		expect(lastCall().init.method).toBe('GET');
	});

	it('creates a category with POST /account/category', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ id: 'c1', name: 'News' }));

		const result = await endpoints.categories.create(makeCtx(), {
			name: 'News',
		});

		expect(lastCall().url).toBe(`${BASE}/account/category`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toEqual({ name: 'News' });
		expect(result.id).toBe('c1');
	});
});
