jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import {
	BASE,
	endpoints,
	installFetchMock,
	jsonResponse,
	lastCall,
	makeCtx,
	makeCtxWithoutDeveloperToken,
	mockFetch,
	restoreFetchMock,
	sentBody,
	sentHeader,
} from './test-helpers';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

const row = {
	campaign: { id: '111', name: 'Search - Brand', status: 'ENABLED' },
	metrics: { clicks: '12', costMicros: '42000000' },
};

const mutateResult = {
	results: [{ resourceName: 'customers/1234567890/campaigns/111' }],
};

describe('request headers', () => {
	it('sends the OAuth token as a bearer', async () => {
		mockFetch(jsonResponse({ results: [row] }));

		await endpoints.reporting.search(makeCtx(), {
			customerId: '1234567890',
			query: 'SELECT campaign.id FROM campaign',
		});

		expect(sentHeader('authorization')).toBe('Bearer test-token');
	});

	it('sends the developer token, which every call needs', async () => {
		mockFetch(jsonResponse({ results: [row] }));

		await endpoints.reporting.search(makeCtx(), {
			customerId: '1234567890',
			query: 'SELECT campaign.id FROM campaign',
		});

		expect(sentHeader('developer-token')).toBe('dev-token');
	});

	it('sends login-customer-id when the integration stores one', async () => {
		mockFetch(jsonResponse({ results: [row] }));

		await endpoints.reporting.search(makeCtx(), {
			customerId: '1234567890',
			query: 'SELECT campaign.id FROM campaign',
		});

		expect(sentHeader('login-customer-id')).toBe('9999999999');
	});

	it('refuses to send a call with no developer token', async () => {
		await expect(
			endpoints.reporting.search(makeCtxWithoutDeveloperToken(), {
				customerId: '1234567890',
				query: 'SELECT campaign.id FROM campaign',
			}),
		).rejects.toThrow(/developer token/i);
		expect(globalThis.fetch).not.toHaveBeenCalled();
	});
});

describe('reporting.search', () => {
	it('posts the query to googleAds:search', async () => {
		mockFetch(jsonResponse({ results: [row] }));

		const result = await endpoints.reporting.search(makeCtx(), {
			customerId: '1234567890',
			query: 'SELECT campaign.id FROM campaign',
			pageSize: 500,
		});

		expect(lastCall().init.method).toBe('POST');
		expect(lastCall().url).toBe(
			`${BASE}/customers/1234567890/googleAds:search`,
		);
		expect(sentBody()).toEqual({
			query: 'SELECT campaign.id FROM campaign',
			pageSize: 500,
		});
		expect(result.results).toHaveLength(1);
	});

	it('strips hyphens from a hyphenated customer id', async () => {
		mockFetch(jsonResponse({ results: [] }));

		await endpoints.reporting.search(makeCtx(), {
			customerId: '123-456-7890',
			query: 'SELECT campaign.id FROM campaign',
		});

		expect(lastCall().url).toBe(
			`${BASE}/customers/1234567890/googleAds:search`,
		);
	});

	it('returns the next page token and omits nothing it was not sent', async () => {
		mockFetch(jsonResponse({ results: [], nextPageToken: 'tok' }));

		const result = await endpoints.reporting.search(makeCtx(), {
			customerId: '1234567890',
			query: 'SELECT campaign.id FROM campaign',
		});

		expect(result.nextPageToken).toBe('tok');
		expect(sentBody()).toEqual({ query: 'SELECT campaign.id FROM campaign' });
	});

	it('passes validateOnly through', async () => {
		mockFetch(jsonResponse({}));

		await endpoints.reporting.search(makeCtx(), {
			customerId: '1234567890',
			query: 'SELECT campaign.id FROM campaign',
			validateOnly: true,
		});

		expect(sentBody()).toEqual({
			query: 'SELECT campaign.id FROM campaign',
			validateOnly: true,
		});
	});

	it('rejects a page size above the documented 10,000 rows', async () => {
		await expect(
			endpoints.reporting.search(makeCtx(), {
				customerId: '1234567890',
				query: 'SELECT campaign.id FROM campaign',
				pageSize: 10_001,
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
		expect(globalThis.fetch).not.toHaveBeenCalled();
	});
});

describe('reporting.searchStream', () => {
	it('flattens the array of response objects into one result list', async () => {
		mockFetch(
			jsonResponse([
				{ results: [row], fieldMask: 'campaign.id' },
				{ results: [{ campaign: { id: '222' } }] },
			]),
		);

		const result = await endpoints.reporting.searchStream(makeCtx(), {
			customerId: '1234567890',
			query: 'SELECT campaign.id FROM campaign',
		});

		expect(lastCall().url).toBe(
			`${BASE}/customers/1234567890/googleAds:searchStream`,
		);
		expect(result.results).toHaveLength(2);
		expect(result.fieldMask).toBe('campaign.id');
	});

	it('keeps an empty stream as an empty result list', async () => {
		mockFetch(jsonResponse([]));

		const result = await endpoints.reporting.searchStream(makeCtx(), {
			customerId: '1234567890',
			query: 'SELECT campaign.id FROM campaign',
		});

		expect(result.results).toEqual([]);
	});
});

describe('campaigns', () => {
	it('creates a campaign with one create operation', async () => {
		mockFetch(jsonResponse(mutateResult));

		await endpoints.campaigns.create(makeCtx(), {
			customerId: '1234567890',
			campaign: {
				name: 'Search - Brand',
				advertisingChannelType: 'SEARCH',
				campaignBudget: 'customers/1234567890/campaignBudgets/789',
				manualCpc: {},
			},
		});

		expect(lastCall().url).toBe(
			`${BASE}/customers/1234567890/campaigns:mutate`,
		);
		expect(sentBody()).toEqual({
			operations: [
				{
					create: {
						name: 'Search - Brand',
						advertisingChannelType: 'SEARCH',
						campaignBudget: 'customers/1234567890/campaignBudgets/789',
						manualCpc: {},
					},
				},
			],
		});
	});

	it('refuses a campaign with no bidding strategy', async () => {
		await expect(
			endpoints.campaigns.create(makeCtx(), {
				customerId: '1234567890',
				campaign: {
					name: 'No strategy',
					advertisingChannelType: 'SEARCH',
					campaignBudget: 'customers/1234567890/campaignBudgets/789',
				},
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('refuses two bidding strategies on one campaign', async () => {
		await expect(
			endpoints.campaigns.create(makeCtx(), {
				customerId: '1234567890',
				campaign: {
					name: 'Two strategies',
					advertisingChannelType: 'SEARCH',
					campaignBudget: 'customers/1234567890/campaignBudgets/789',
					manualCpc: {},
					targetSpend: {},
				},
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('updates a campaign with a resource name and an update mask', async () => {
		mockFetch(jsonResponse(mutateResult));

		await endpoints.campaigns.update(makeCtx(), {
			customerId: '1234567890',
			campaignId: '111',
			campaign: { name: 'Renamed', status: 'PAUSED' },
			updateMask: 'name,status',
		});

		expect(sentBody()).toEqual({
			operations: [
				{
					update: {
						resourceName: 'customers/1234567890/campaigns/111',
						name: 'Renamed',
						status: 'PAUSED',
					},
					updateMask: 'name,status',
				},
			],
		});
	});

	it('accepts a full resource name as the campaign id', async () => {
		mockFetch(jsonResponse(mutateResult));

		await endpoints.campaigns.update(makeCtx(), {
			customerId: '1234567890',
			campaignId: 'customers/1234567890/campaigns/111',
			campaign: { status: 'PAUSED' },
			updateMask: 'status',
		});

		expect(sentBody()).toMatchObject({
			operations: [
				{
					update: { resourceName: 'customers/1234567890/campaigns/111' },
				},
			],
		});
	});

	it('refuses an update with no update mask', async () => {
		await expect(
			endpoints.campaigns.update(makeCtx(), {
				customerId: '1234567890',
				campaignId: '111',
				campaign: { status: 'PAUSED' },
				updateMask: '',
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('removes a campaign by resource name only', async () => {
		mockFetch(jsonResponse(mutateResult));

		await endpoints.campaigns.remove(makeCtx(), {
			customerId: '1234567890',
			campaignId: '111',
		});

		expect(sentBody()).toEqual({
			operations: [{ remove: 'customers/1234567890/campaigns/111' }],
		});
	});

	it('rejects a badly formed campaign resource name', async () => {
		await expect(
			endpoints.campaigns.remove(makeCtx(), {
				customerId: '1234567890',
				campaignId: 'customers/1234567890/adGroups/1',
			}),
		).rejects.toThrow(/Invalid campaign resource name/);
		expect(globalThis.fetch).not.toHaveBeenCalled();
	});
});

describe('campaign budgets', () => {
	it('creates a budget with the amount in micros', async () => {
		mockFetch(jsonResponse({ results: [{ resourceName: 'budgets/1' }] }));

		await endpoints.campaignBudgets.create(makeCtx(), {
			customerId: '1234567890',
			campaignBudget: {
				name: 'Brand budget',
				amountMicros: '5000000',
				deliveryMethod: 'STANDARD',
			},
		});

		expect(lastCall().url).toBe(
			`${BASE}/customers/1234567890/campaignBudgets:mutate`,
		);
		expect(sentBody()).toEqual({
			operations: [
				{
					create: {
						name: 'Brand budget',
						amountMicros: '5000000',
						deliveryMethod: 'STANDARD',
					},
				},
			],
		});
	});

	it('updates the amount with a resource name and mask', async () => {
		mockFetch(jsonResponse({ results: [{ resourceName: 'budgets/1' }] }));

		await endpoints.campaignBudgets.update(makeCtx(), {
			customerId: '1234567890',
			campaignBudgetId: '789',
			campaignBudget: { amountMicros: '7500000' },
			updateMask: 'amountMicros',
		});

		expect(sentBody()).toEqual({
			operations: [
				{
					update: {
						resourceName: 'customers/1234567890/campaignBudgets/789',
						amountMicros: '7500000',
					},
					updateMask: 'amountMicros',
				},
			],
		});
	});
});

describe('ad groups', () => {
	it('creates an ad group inside a campaign', async () => {
		mockFetch(jsonResponse({ results: [{ resourceName: 'adGroups/1' }] }));

		await endpoints.adGroups.create(makeCtx(), {
			customerId: '1234567890',
			adGroup: {
				name: 'Brand keywords',
				campaign: 'customers/1234567890/campaigns/111',
				type: 'SEARCH_STANDARD',
				cpcBidMicros: '1000000',
			},
		});

		expect(lastCall().url).toBe(`${BASE}/customers/1234567890/adGroups:mutate`);
		expect(sentBody()).toEqual({
			operations: [
				{
					create: {
						name: 'Brand keywords',
						campaign: 'customers/1234567890/campaigns/111',
						type: 'SEARCH_STANDARD',
						cpcBidMicros: '1000000',
					},
				},
			],
		});
	});

	it('pauses an ad group through an update', async () => {
		mockFetch(jsonResponse({ results: [{ resourceName: 'adGroups/1' }] }));

		await endpoints.adGroups.update(makeCtx(), {
			customerId: '1234567890',
			adGroupId: '222',
			adGroup: { status: 'PAUSED' },
			updateMask: 'status',
		});

		expect(sentBody()).toEqual({
			operations: [
				{
					update: {
						resourceName: 'customers/1234567890/adGroups/222',
						status: 'PAUSED',
					},
					updateMask: 'status',
				},
			],
		});
	});
});

describe('customers', () => {
	it('lists accessible customers with a GET and no customer path', async () => {
		mockFetch(jsonResponse({ resourceNames: ['customers/1234567890'] }));

		const result = await endpoints.customers.listAccessible(makeCtx(), {});

		expect(lastCall().init.method).toBe('GET');
		expect(lastCall().url).toBe(`${BASE}/customers:listAccessibleCustomers`);
		expect(result.resourceNames).toEqual(['customers/1234567890']);
	});

	it('updates the customer record with one operation and one result', async () => {
		mockFetch(
			jsonResponse({ result: { resourceName: 'customers/1234567890' } }),
		);

		const result = await endpoints.customers.update(makeCtx(), {
			customerId: '1234567890',
			customer: { autoTaggingEnabled: true },
			updateMask: 'autoTaggingEnabled',
		});

		expect(lastCall().url).toBe(`${BASE}/customers/1234567890:mutate`);
		// customers:mutate takes `operation`, not `operations`.
		expect(sentBody()).toEqual({
			operation: {
				update: {
					resourceName: 'customers/1234567890',
					autoTaggingEnabled: true,
				},
				updateMask: 'autoTaggingEnabled',
			},
		});
		expect(result.result?.resourceName).toBe('customers/1234567890');
	});
});

describe('googleAdsFields', () => {
	it('searches the queryable fields with no customer path', async () => {
		mockFetch(jsonResponse({ results: [{ name: 'campaign.id' }] }));

		const result = await endpoints.googleAdsFields.search(makeCtx(), {
			query: "SELECT name FROM google_ads_field WHERE name = 'campaign.id'",
		});

		expect(lastCall().url).toBe(`${BASE}/googleAdsFields:search`);
		expect(result.results).toHaveLength(1);
	});
});

describe('reporting.mutate', () => {
	it('passes several entity operations in one mutateOperations array', async () => {
		mockFetch(
			jsonResponse({ results: [{ resourceName: 'a' }, { resourceName: 'b' }] }),
		);

		const result = await endpoints.reporting.mutate(makeCtx(), {
			customerId: '1234567890',
			mutateOperations: [
				{ campaignOperation: { remove: 'customers/1/campaigns/2' } },
				{ adGroupOperation: { remove: 'customers/1/adGroups/3' } },
			],
			partialFailure: true,
		});

		expect(lastCall().url).toBe(
			`${BASE}/customers/1234567890/googleAds:mutate`,
		);
		expect(sentBody()).toEqual({
			mutateOperations: [
				{ campaignOperation: { remove: 'customers/1/campaigns/2' } },
				{ adGroupOperation: { remove: 'customers/1/adGroups/3' } },
			],
			partialFailure: true,
		});
		expect(result.results).toHaveLength(2);
	});

	it('refuses an empty operation list', async () => {
		await expect(
			endpoints.reporting.mutate(makeCtx(), {
				customerId: '1234567890',
				mutateOperations: [],
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
	});
});
