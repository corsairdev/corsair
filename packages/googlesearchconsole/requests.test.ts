jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import {
	DOMAIN_PROPERTY,
	emptyResponse,
	endpoints,
	FEED,
	installFetchMock,
	jsonResponse,
	lastCall,
	makeCtx,
	mockFetch,
	PROPERTY,
	restoreFetchMock,
	sentBody,
	sentHeader,
} from './test-helpers';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

describe('request shape', () => {
	it('sends the OAuth token as a bearer', async () => {
		mockFetch(jsonResponse({ siteEntry: [] }));

		await endpoints.sites.list(makeCtx(), {});

		expect(sentHeader('authorization')).toBe('Bearer test-token');
	});

	it('lists sites with a GET and no body', async () => {
		mockFetch(
			jsonResponse({
				siteEntry: [{ siteUrl: PROPERTY, permissionLevel: 'SITE_OWNER' }],
			}),
		);

		const result = await endpoints.sites.list(makeCtx(), {});

		expect(lastCall().init.method).toBe('GET');
		expect(lastCall().url).toBe(
			'https://searchconsole.googleapis.com/webmasters/v3/sites',
		);
		expect(lastCall().init.body).toBeUndefined();
		expect(result.siteEntry?.[0]?.permissionLevel).toBe('SITE_OWNER');
	});

	it('reads one site with the property encoded into the path', async () => {
		mockFetch(jsonResponse({ siteUrl: PROPERTY }));

		await endpoints.sites.get(makeCtx(), { siteUrl: PROPERTY });

		expect(lastCall().url).toBe(
			'https://searchconsole.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fexample.com%2F',
		);
	});

	it('keeps a sc-domain property intact through encoding', async () => {
		mockFetch(jsonResponse({ siteUrl: DOMAIN_PROPERTY }));

		await endpoints.sites.get(makeCtx(), { siteUrl: DOMAIN_PROPERTY });

		expect(lastCall().url).toBe(
			'https://searchconsole.googleapis.com/webmasters/v3/sites/sc-domain%3Aexample.com',
		);
	});

	it('adds a site with a PUT and no body', async () => {
		mockFetch(emptyResponse());

		await endpoints.sites.add(makeCtx(), { siteUrl: PROPERTY });

		expect(lastCall().init.method).toBe('PUT');
		expect(lastCall().init.body).toBeUndefined();
	});

	it('removes a site with a DELETE', async () => {
		mockFetch(emptyResponse());

		await endpoints.sites.delete(makeCtx(), { siteUrl: PROPERTY });

		expect(lastCall().init.method).toBe('DELETE');
	});
});

describe('searchanalytics.query', () => {
	it('posts the query under the encoded property', async () => {
		mockFetch(
			jsonResponse({
				rows: [
					{
						keys: ['2024-06-01'],
						clicks: 12,
						impressions: 340,
						ctr: 0.0353,
						position: 8.2,
					},
				],
			}),
		);

		const result = await endpoints.searchanalytics.query(makeCtx(), {
			siteUrl: PROPERTY,
			startDate: '2024-06-01',
			endDate: '2024-06-30',
			dimensions: ['DATE'],
		});

		expect(lastCall().init.method).toBe('POST');
		expect(lastCall().url).toBe(
			'https://searchconsole.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fexample.com%2F/searchAnalytics/query',
		);
		expect(sentBody()).toEqual({
			startDate: '2024-06-01',
			endDate: '2024-06-30',
			dimensions: ['DATE'],
		});
		expect(result.rows?.[0]?.clicks).toBe(12);
	});

	it('sends the filter groups, row limit and aggregation when asked', async () => {
		mockFetch(jsonResponse({ rows: [] }));

		await endpoints.searchanalytics.query(makeCtx(), {
			siteUrl: PROPERTY,
			startDate: '2024-06-01',
			endDate: '2024-06-30',
			dimensions: ['QUERY', 'DEVICE'],
			rowLimit: 25_000,
			startRow: 100,
			aggregationType: 'BY_PAGE',
			dimensionFilterGroups: [
				{
					groupType: 'AND',
					filters: [
						{ dimension: 'COUNTRY', operator: 'EQUALS', expression: 'usa' },
					],
				},
			],
		});

		expect(sentBody()).toEqual({
			startDate: '2024-06-01',
			endDate: '2024-06-30',
			dimensions: ['QUERY', 'DEVICE'],
			rowLimit: 25_000,
			startRow: 100,
			aggregationType: 'BY_PAGE',
			dimensionFilterGroups: [
				{
					groupType: 'AND',
					filters: [
						{ dimension: 'COUNTRY', operator: 'EQUALS', expression: 'usa' },
					],
				},
			],
		});
	});

	it('omits an unset row limit instead of sending zero', async () => {
		mockFetch(jsonResponse({ rows: [] }));

		await endpoints.searchanalytics.query(makeCtx(), {
			siteUrl: PROPERTY,
			startDate: '2024-06-01',
			endDate: '2024-06-02',
		});

		expect(sentBody()).toEqual({
			startDate: '2024-06-01',
			endDate: '2024-06-02',
		});
	});
});

describe('sitemaps', () => {
	it('lists sitemaps for a property', async () => {
		mockFetch(
			jsonResponse({
				sitemap: [
					{
						path: FEED,
						type: 'SITEMAP',
						errors: '0',
						warnings: '2',
						isPending: false,
					},
				],
			}),
		);

		const result = await endpoints.sitemaps.list(makeCtx(), {
			siteUrl: PROPERTY,
		});

		expect(lastCall().url).toBe(
			`https://searchconsole.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fexample.com%2F/sitemaps`,
		);
		// int64 counts stay strings, which is what the API sends.
		expect(result.sitemap?.[0]?.errors).toBe('0');
		expect(result.sitemap?.[0]?.warnings).toBe('2');
	});

	it('lists sitemaps inside an index when asked', async () => {
		mockFetch(jsonResponse({ sitemap: [] }));

		await endpoints.sitemaps.list(makeCtx(), {
			siteUrl: PROPERTY,
			sitemapIndex: 'https://example.com/sitemapindex.xml',
		});

		expect(lastCall().url).toContain('?sitemapIndex=');
		expect(lastCall().url).toContain(
			encodeURIComponent('https://example.com/sitemapindex.xml'),
		);
	});

	it('reads one sitemap, with its URL encoded as a path segment', async () => {
		mockFetch(jsonResponse({ path: FEED, type: 'SITEMAP' }));

		await endpoints.sitemaps.get(makeCtx(), {
			siteUrl: PROPERTY,
			feedpath: FEED,
		});

		expect(lastCall().url).toBe(
			`https://searchconsole.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fexample.com%2F/sitemaps/https%3A%2F%2Fexample.com%2Fsitemap.xml`,
		);
	});

	it('submits a sitemap with a PUT and no body', async () => {
		mockFetch(emptyResponse());

		await endpoints.sitemaps.submit(makeCtx(), {
			siteUrl: PROPERTY,
			feedpath: FEED,
		});

		expect(lastCall().init.method).toBe('PUT');
		expect(lastCall().init.body).toBeUndefined();
	});

	it('removes a sitemap with a DELETE', async () => {
		mockFetch(emptyResponse());

		await endpoints.sitemaps.delete(makeCtx(), {
			siteUrl: PROPERTY,
			feedpath: FEED,
		});

		expect(lastCall().init.method).toBe('DELETE');
	});

	it('refuses a feedpath that is not a URL', async () => {
		await expect(
			endpoints.sitemaps.submit(makeCtx(), {
				siteUrl: PROPERTY,
				feedpath: '/sitemap.xml',
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
		expect(globalThis.fetch).not.toHaveBeenCalled();
	});
});

describe('urlInspection.inspect', () => {
	it('posts to the v1 inspection route with the property in the body', async () => {
		mockFetch(
			jsonResponse({
				inspectionResult: {
					inspectionResultLink:
						'https://search.google.com/search-console/inspect',
					indexStatusResult: {
						verdict: 'PASS',
						coverageState: 'Submitted and indexed',
						robotsTxtState: 'ALLOWED',
						indexingState: 'INDEXING_ALLOWED',
						pageFetchState: 'SUCCESSFUL',
						googleCanonical: 'https://example.com/a',
						userCanonical: 'https://example.com/a',
					},
				},
			}),
		);

		const result = await endpoints.urlInspection.inspect(makeCtx(), {
			siteUrl: PROPERTY,
			inspectionUrl: 'https://example.com/a',
		});

		expect(lastCall().init.method).toBe('POST');
		expect(lastCall().url).toBe(
			'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',
		);
		expect(sentBody()).toEqual({
			siteUrl: PROPERTY,
			inspectionUrl: 'https://example.com/a',
		});
		expect(result.inspectionResult?.indexStatusResult?.verdict).toBe('PASS');
	});

	it('passes the language code when asked', async () => {
		mockFetch(jsonResponse({}));

		await endpoints.urlInspection.inspect(makeCtx(), {
			siteUrl: DOMAIN_PROPERTY,
			inspectionUrl: 'https://example.com/a',
			languageCode: 'en-US',
		});

		expect(sentBody()).toEqual({
			siteUrl: DOMAIN_PROPERTY,
			inspectionUrl: 'https://example.com/a',
			languageCode: 'en-US',
		});
	});
});
