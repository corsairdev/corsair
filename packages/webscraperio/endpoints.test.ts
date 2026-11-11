import { logEventFromContext } from 'corsair/core';
import { WebscraperioAPIError } from './client';
import { Sitemaps } from './endpoints';
import {
	accountResponse,
	invalidToken,
	sitemapResponse,
	sitemapsListResponse,
	sitemapsPaginatedResponse,
} from './test-fixtures';
import {
	expectAuthenticated,
	installFetchMock,
	invoke,
	lastRequest,
	respond,
} from './test-support';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const fetchMock = installFetchMock();

beforeEach(() => {
	mockLog.mockClear();
});

describe('sitemaps', () => {
	it('lists sitemaps, counting a flat array', async () => {
		respond(fetchMock, sitemapsListResponse);

		const result = await invoke(Sitemaps.list, {});

		expect(result).toEqual(sitemapsListResponse);
		expectAuthenticated(fetchMock);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe('/api/v1/sitemaps');
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'webscraperio.sitemaps.list',
			{ count: 1 },
			'completed',
		);
	});

	it('counts a paginated list too, which nests the array', async () => {
		respond(fetchMock, sitemapsPaginatedResponse);

		const result = await invoke(Sitemaps.list, {});

		expect(result).toEqual(sitemapsPaginatedResponse);
		// The response shape has two documented forms; both count the same.
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'webscraperio.sitemaps.list',
			{ count: 1 },
			'completed',
		);
	});

	it('reads one sitemap with its selectors', async () => {
		respond(fetchMock, sitemapResponse);

		const result = (await invoke(Sitemaps.get, { id: 42 })) as {
			data?: { selectors?: unknown[]; name?: string };
		};

		expect(result.data?.name).toBe('Product catalogue');
		expect(result.data?.selectors).toHaveLength(2);
		expect(lastRequest(fetchMock).path).toBe('/api/v1/sitemap/42');
	});

	it('logs the id, name and status for one sitemap', async () => {
		respond(fetchMock, sitemapResponse);

		await invoke(Sitemaps.get, { id: 42 });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'webscraperio.sitemaps.get',
			{ id: 42, name: 'Product catalogue', status: 'idle' },
			'completed',
		);
	});

	it('rejects a non-positive sitemap id', async () => {
		await expect(invoke(Sitemaps.get, { id: 0 })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('creates a sitemap from an exported definition', async () => {
		respond(fetchMock, sitemapResponse);

		const definition = {
			_id: 'product_catalogue',
			name: 'Product catalogue',
			startUrl: 'https://acme.example/products',
			selectors: [{ id: 'name', selector: 'h1.title', type: 'text' }],
		};

		const result = await invoke(Sitemaps.create, { sitemap: definition });

		expect(result).toEqual(sitemapResponse);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/api/v1/sitemap');
		// The definition is passed through unchanged; its shape belongs to the
		// builder, not to the plugin.
		expect(sent.body).toEqual(definition);
	});

	it('requires a sitemap definition', async () => {
		await expect(invoke(Sitemaps.create, {})).rejects.toThrow();
	});

	it('reads the account with its plan and allowance', async () => {
		respond(fetchMock, accountResponse);

		const result = (await invoke(Sitemaps.account, {})) as {
			data?: { plan?: string; pages_used?: number };
		};

		expect(result.data?.plan).toBe('professional');
		expect(lastRequest(fetchMock).path).toBe('/api/v1/account');
	});

	it('logs the plan and usage, which is what a quota check needs', async () => {
		respond(fetchMock, accountResponse);

		await invoke(Sitemaps.account, {});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'webscraperio.account.get',
			{ plan: 'professional', pagesUsed: 12_345, pagesAllowed: 500_000 },
			'completed',
		);
	});

	it('surfaces a bad token as a WebscraperioAPIError', async () => {
		respond(fetchMock, invalidToken, 401);

		const error = (await invoke(Sitemaps.list, {}).catch(
			(thrown: unknown) => thrown,
		)) as WebscraperioAPIError;

		expect(error).toBeInstanceOf(WebscraperioAPIError);
		expect(error.isAuthError).toBe(true);
		expect(error.handled).toBe(true);
	});
});
