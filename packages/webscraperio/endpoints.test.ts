import { logEventFromContext } from 'corsair/core';
import { WebscraperioAPIError } from './client';
import { Sitemaps } from './endpoints';
import {
	accountResponse,
	invalidToken,
	sitemapCreatedResponse,
	sitemapResponse,
	sitemapsListResponse,
} from './test-fixtures';
import {
	expectAuthenticated,
	installFetchMock,
	invoke,
	lastRequest,
	rejection,
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
	it('lists sitemaps and reads the page fields at the root', async () => {
		respond(fetchMock, sitemapsListResponse);

		const result = await invoke(Sitemaps.list, {});

		expect(result).toEqual(sitemapsListResponse);
		expect(result.last_page).toBe(3);
		expectAuthenticated(fetchMock);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe('/api/v1/sitemaps');
		expect(sent.queryPairs).toEqual([]);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'webscraperio.sitemaps.list',
			{ count: 1, page: 1, lastPage: 3 },
			'completed',
		);
	});

	it('sends the tag filter', async () => {
		respond(fetchMock, sitemapsListResponse);

		await invoke(Sitemaps.list, { tag: 'ecommerce', page: 2 });

		expect(lastRequest(fetchMock).query).toEqual({
			tag: 'ecommerce',
			page: '2',
		});
	});

	it('reads one sitemap with its definition as a JSON string', async () => {
		respond(fetchMock, sitemapResponse);

		const result = await invoke(Sitemaps.get, { id: 42 });

		expect(result.data?.name).toBe('product_catalogue');
		// The definition is a JSON string the schema does not parse; the test
		// reads only the selector ids out of it.
		const definition = JSON.parse(result.data?.sitemap ?? '{}') as {
			selectors?: { id: string }[];
		};
		expect(definition.selectors?.[0]?.id).toBe('name');
		expect(lastRequest(fetchMock).path).toBe('/api/v1/sitemap/42');
	});

	it('logs the id and name for one sitemap, not the definition', async () => {
		respond(fetchMock, sitemapResponse);

		await invoke(Sitemaps.get, { id: 42 });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'webscraperio.sitemaps.get',
			{ id: 42, name: 'product_catalogue' },
			'completed',
		);
	});

	it('rejects a non-positive sitemap id', async () => {
		await expect(invoke(Sitemaps.get, { id: 0 })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('creates a sitemap from an exported definition', async () => {
		respond(fetchMock, sitemapCreatedResponse);

		const definition = {
			_id: 'product_catalogue',
			name: 'Product catalogue',
			startUrl: 'https://acme.example/products',
			selectors: [{ id: 'name', selector: 'h1.title', type: 'text' }],
		};

		const result = await invoke(Sitemaps.create, { sitemap: definition });

		expect(result).toEqual(sitemapCreatedResponse);
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

	it('reads the account user and page credits', async () => {
		respond(fetchMock, accountResponse);

		const result = await invoke(Sitemaps.account, {});

		expect(result.data?.page_credits).toBe(4_850);
		expect(result.data?.firstname).toBe('Ada');
		expect(lastRequest(fetchMock).path).toBe('/api/v1/account');
	});

	it('logs the page credits and keeps the email and name out of the log', async () => {
		respond(fetchMock, accountResponse);

		await invoke(Sitemaps.account, {});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'webscraperio.account.get',
			{ pageCredits: 4_850 },
			'completed',
		);
	});

	it('surfaces a bad token as a WebscraperioAPIError', async () => {
		respond(fetchMock, invalidToken, 401);

		const error = await rejection(invoke(Sitemaps.list, {}));

		expect(error).toBeInstanceOf(WebscraperioAPIError);
		expect(error.isAuthError).toBe(true);
		expect(error.handled).toBe(true);
	});

	it('sends the requested page on a sitemap list', async () => {
		respond(fetchMock, sitemapsListResponse);

		await invoke(Sitemaps.list, { page: 3 });

		expect(lastRequest(fetchMock).query.page).toBe('3');
	});
});
