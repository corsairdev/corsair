jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import { ApiError } from 'corsair/http';
import {
	consoleError,
	endpoints,
	installFetchMock,
	jsonResponse,
	makeCtx,
	mockFetch,
	PROPERTY,
	restoreFetchMock,
} from './test-helpers';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

/** The error a call rejects with. Callers narrow it to the class they assert on. */
async function failure(
	promise: Promise<unknown>, // unknown: a promise can reject with any value.
): Promise<Error> {
	try {
		await promise;
	} catch (error) {
		if (error instanceof Error) return error;
		throw error;
	}
	throw new Error('Expected the call to reject, but it resolved.');
}

const query = {
	siteUrl: PROPERTY,
	startDate: '2024-06-01',
	endDate: '2024-06-02',
};

describe('response parsing', () => {
	it('keeps an empty rows array as an empty result, not an error', async () => {
		mockFetch(jsonResponse({ rows: [] }));

		const result = await endpoints.searchanalytics.query(makeCtx(), query);

		expect(result.rows).toEqual([]);
	});

	it('accepts a response with no rows key at all', async () => {
		// The API omits rows when a query matched nothing.
		mockFetch(jsonResponse({ responseAggregationType: 'AUTO' }));

		const result = await endpoints.searchanalytics.query(makeCtx(), query);

		expect(result.rows).toBeUndefined();
	});

	it('rejects a row whose keys are not strings', async () => {
		mockFetch(jsonResponse({ rows: [{ keys: [1, 2], clicks: 1 }] }));

		const error = await failure(
			endpoints.searchanalytics.query(makeCtx(), query),
		);

		expect(error.name).toBe('ZodError');
	});

	it('rejects an unknown permission level on a site', async () => {
		mockFetch(
			jsonResponse({
				siteEntry: [{ siteUrl: PROPERTY, permissionLevel: 'OWNER' }],
			}),
		);

		const error = await failure(endpoints.sites.list(makeCtx(), {}));

		expect(error.name).toBe('ZodError');
	});

	it('keeps an unknown inspection verdict out rather than guessing', async () => {
		mockFetch(
			jsonResponse({
				inspectionResult: { indexStatusResult: { verdict: 'MAYBE' } },
			}),
		);

		const error = await failure(
			endpoints.urlInspection.inspect(makeCtx(), {
				siteUrl: PROPERTY,
				inspectionUrl: 'https://example.com/a',
			}),
		);

		expect(error.name).toBe('ZodError');
	});

	it('keeps a page that was not indexed, with its reason', async () => {
		mockFetch(
			jsonResponse({
				inspectionResult: {
					indexStatusResult: {
						verdict: 'FAIL',
						coverageState: 'Excluded by noindex tag',
						indexingState: 'BLOCKED_BY_META_TAG',
						pageFetchState: 'SUCCESSFUL',
					},
				},
			}),
		);

		const result = await endpoints.urlInspection.inspect(makeCtx(), {
			siteUrl: PROPERTY,
			inspectionUrl: 'https://example.com/a',
		});

		expect(result.inspectionResult?.indexStatusResult?.verdict).toBe('FAIL');
		expect(result.inspectionResult?.indexStatusResult?.coverageState).toBe(
			'Excluded by noindex tag',
		);
	});

	it('accepts a bodyless success on a sitemap submit', async () => {
		mockFetch(new Response(null, { status: 204 }));

		await expect(
			endpoints.sitemaps.submit(makeCtx(), {
				siteUrl: PROPERTY,
				feedpath: 'https://example.com/sitemap.xml',
			}),
		).resolves.toBeUndefined();
	});
});

describe('refused input, before any request', () => {
	it('rejects a row limit above the documented 25,000', async () => {
		await expect(
			endpoints.searchanalytics.query(makeCtx(), {
				...query,
				rowLimit: 25_001,
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
		expect(globalThis.fetch).not.toHaveBeenCalled();
	});

	it('rejects a negative start row', async () => {
		await expect(
			endpoints.searchanalytics.query(makeCtx(), { ...query, startRow: -1 }),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('rejects both type and searchType in one query', async () => {
		await expect(
			endpoints.searchanalytics.query(makeCtx(), {
				...query,
				type: 'WEB',
				searchType: 'WEB',
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('rejects the HOUR dimension without HOURLY_ALL, which the API refuses', async () => {
		await expect(
			endpoints.searchanalytics.query(makeCtx(), {
				...query,
				dimensions: ['HOUR'],
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('accepts the HOUR dimension with HOURLY_ALL', async () => {
		mockFetch(jsonResponse({ rows: [] }));

		await endpoints.searchanalytics.query(makeCtx(), {
			...query,
			dimensions: ['HOUR'],
			dataState: 'HOURLY_ALL',
		});

		expect(globalThis.fetch).toHaveBeenCalledTimes(1);
	});

	it('rejects a date that is not YYYY-MM-DD', async () => {
		await expect(
			endpoints.searchanalytics.query(makeCtx(), {
				...query,
				startDate: '01/06/2024',
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('rejects an unknown dimension rather than sending it', async () => {
		await expect(
			endpoints.searchanalytics.query(makeCtx(), {
				...query,
				// The enum refuses this at the type level too.
				dimensions: ['LANDING_PAGE' as never],
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('rejects an unknown filter operator', async () => {
		await expect(
			endpoints.searchanalytics.query(makeCtx(), {
				...query,
				dimensionFilterGroups: [
					{
						filters: [
							{
								dimension: 'DEVICE',
								operator: 'MATCHES' as never,
								expression: 'MOBILE',
							},
						],
					},
				],
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
	});
});

describe('Google error envelopes', () => {
	it('keeps the provider body and status', async () => {
		mockFetch(
			consoleError(403, 'PERMISSION_DENIED', 'forbidden', 'Not authorized'),
		);

		const error = await failure(endpoints.sites.list(makeCtx(), {}));

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) throw error;
		expect(error.status).toBe(403);
		expect(JSON.stringify(error.body)).toContain('Not authorized');
	});

	it('does not put the bearer token in the error', async () => {
		mockFetch(consoleError(401, 'UNAUTHENTICATED', 'authError'));

		const error = await failure(endpoints.sites.list(makeCtx(), {}));

		expect(error.message).not.toContain('test-token');
		if (error instanceof ApiError) {
			expect(error.url).not.toContain('test-token');
		}
	});
});
