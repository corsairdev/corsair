jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import { ApiError } from 'corsair/http';
import {
	adsError,
	endpoints,
	installFetchMock,
	jsonResponse,
	makeCtx,
	mockFetch,
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

const query = 'SELECT campaign.id FROM campaign';

describe('response parsing', () => {
	it('keeps a row as the query shaped it', async () => {
		// A row is keyed by resource, so the plugin must not flatten or rename.
		mockFetch(
			jsonResponse({
				results: [
					{
						campaign: { id: '111', name: 'Brand', status: 'ENABLED' },
						metrics: { clicks: '12', costMicros: '42000000' },
					},
				],
				fieldMask: 'campaign.id,campaign.name,metrics.clicks',
			}),
		);

		const result = await endpoints.reporting.search(makeCtx(), {
			customerId: '1234567890',
			query,
		});

		expect(result.results?.[0]).toEqual({
			campaign: { id: '111', name: 'Brand', status: 'ENABLED' },
			metrics: { clicks: '12', costMicros: '42000000' },
		});
		expect(result.fieldMask).toBe('campaign.id,campaign.name,metrics.clicks');
	});

	it('accepts an empty result set as no rows, not an error', async () => {
		mockFetch(jsonResponse({ results: [] }));

		const result = await endpoints.reporting.search(makeCtx(), {
			customerId: '1234567890',
			query,
		});

		expect(result.results).toEqual([]);
	});

	it('rejects a results field that is not an array', async () => {
		// A bare object would otherwise be walked as if it were a row.
		mockFetch(jsonResponse({ results: { campaign: { id: '1' } } }));

		const error = await failure(
			endpoints.reporting.search(makeCtx(), {
				customerId: '1234567890',
				query,
			}),
		);

		expect(error.name).toBe('ZodError');
	});

	it('rejects a mutate response whose results are not objects', async () => {
		mockFetch(jsonResponse({ results: ['customers/1/campaigns/2'] }));

		const error = await failure(
			endpoints.campaigns.remove(makeCtx(), {
				customerId: '1234567890',
				campaignId: '111',
			}),
		);

		expect(error.name).toBe('ZodError');
	});

	it('keeps a partial failure instead of reporting success', async () => {
		mockFetch(
			jsonResponse({
				results: [{}],
				partialFailureError: {
					errors: [
						{
							errorCode: { campaignError: 'DUPLICATE_CAMPAIGN_NAME' },
							message: 'The campaign name is already in use',
						},
					],
					requestId: 'req-1',
				},
			}),
		);

		const result = await endpoints.campaigns.create(makeCtx(), {
			customerId: '1234567890',
			campaign: {
				name: 'Duplicate',
				advertisingChannelType: 'SEARCH',
				campaignBudget: 'customers/1/campaignBudgets/2',
				manualCpc: {},
			},
		});

		expect(result.partialFailureError?.errors?.[0]?.errorCode).toEqual({
			campaignError: 'DUPLICATE_CAMPAIGN_NAME',
		});
	});
});

describe('refused input, before any request', () => {
	it('rejects a missing query', async () => {
		await expect(
			endpoints.reporting.search(makeCtx(), {
				customerId: '1234567890',
				query: '',
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
		expect(globalThis.fetch).not.toHaveBeenCalled();
	});

	it('rejects an advertising channel the enum does not list', async () => {
		await expect(
			endpoints.campaigns.create(makeCtx(), {
				customerId: '1234567890',
				campaign: {
					name: 'Bad channel',
					// The enum refuses this at the type level too.
					advertisingChannelType: 'BANNER' as never,
					campaignBudget: 'customers/1/campaignBudgets/2',
					manualCpc: {},
				},
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('rejects an operation carrying both create and update', async () => {
		const { MutateOperationSchema } = await import('./endpoints/types');

		expect(
			MutateOperationSchema.safeParse({
				create: { name: 'x' },
				update: { resourceName: 'customers/1/campaigns/2' },
			}).success,
		).toBe(false);
	});

	it('rejects an operation carrying nothing', async () => {
		const { MutateOperationSchema } = await import('./endpoints/types');

		expect(MutateOperationSchema.safeParse({}).success).toBe(false);
	});

	it('rejects an updateMask with no update', async () => {
		const { MutateOperationSchema } = await import('./endpoints/types');

		expect(
			MutateOperationSchema.safeParse({
				remove: 'customers/1/campaigns/2',
				updateMask: 'status',
			}).success,
		).toBe(false);
	});

	it('rejects a customer id that is not digits', async () => {
		await expect(
			endpoints.reporting.search(makeCtx(), {
				customerId: 'not-an-id',
				query,
			}),
		).rejects.toThrow(/Invalid Google Ads customer ID/);
		expect(globalThis.fetch).not.toHaveBeenCalled();
	});
});

describe('Google Ads error envelopes', () => {
	it('keeps the provider body, including the GoogleAdsFailure detail', async () => {
		mockFetch(
			adsError(400, 'INVALID_ARGUMENT', {
				queryError: 'UNEXPECTED_END_OF_QUERY',
			}),
		);

		const error = await failure(
			endpoints.reporting.search(makeCtx(), {
				customerId: '1234567890',
				query: 'SELECT',
			}),
		);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) throw error;
		expect(error.status).toBe(400);
		expect(JSON.stringify(error.body)).toContain('UNEXPECTED_END_OF_QUERY');
	});

	it('does not put the bearer token in the error', async () => {
		mockFetch(adsError(401, 'UNAUTHENTICATED'));

		const error = await failure(
			endpoints.reporting.search(makeCtx(), {
				customerId: '1234567890',
				query,
			}),
		);

		expect(error.message).not.toContain('test-token');
		if (error instanceof ApiError) {
			expect(error.url).not.toContain('test-token');
		}
	});
});
