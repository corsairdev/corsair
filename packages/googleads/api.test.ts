/**
 * Live smoke tests against the Google Ads API. They run only when both
 * GOOGLE_ADS_ACCESS_TOKEN and GOOGLE_ADS_DEVELOPER_TOKEN are set (CI has none,
 * so they skip).
 *
 * Environment:
 *
 * - GOOGLE_ADS_ACCESS_TOKEN (required): an OAuth access token with the
 *   `https://www.googleapis.com/auth/adwords` scope, for a Google user that can
 *   reach at least one Ads account. Access tokens last an hour.
 * - GOOGLE_ADS_DEVELOPER_TOKEN (required): from the API Center of a manager
 *   account. A token at Test Account access only reaches test accounts;
 *   Explorer, Basic or Standard access reaches production accounts.
 * - GOOGLE_ADS_CUSTOMER_ID (optional for reads, required for the writes): the
 *   account to query, digits with or without hyphens. Without it the reads take
 *   the first id from customers.listAccessible and the writes skip.
 * - GOOGLE_ADS_LOGIN_CUSTOMER_ID (optional): the manager account id, needed
 *   when GOOGLE_ADS_CUSTOMER_ID is a client reached through that manager.
 *
 * A developer token is not optional: Google refuses every call without one,
 * even when the OAuth token is valid, so the suite gates on both and says
 * which one is missing rather than skipping silently.
 *
 * Nothing is created and no money is spent. The reads are listAccessible,
 * googleAdsFields.search, and two small GAQL queries on one account. The writes
 * send `validateOnly: true`, so Google checks the request and applies nothing.
 * Every call still counts against the developer token's daily operations quota.
 *
 * Run: pnpm --filter @corsair-dev/googleads test:live
 */

import { create as campaignBudgetsCreate } from './endpoints/campaign-budgets';
import { listAccessible as customersListAccessible } from './endpoints/customers';
import { search as googleAdsFieldsSearch } from './endpoints/google-ads-fields';
import { mutate, search, searchStream } from './endpoints/reporting';
import { GoogleAdsEndpointOutputSchemas } from './endpoints/types';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const TOKEN = process.env.GOOGLE_ADS_ACCESS_TOKEN?.trim();
const DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN?.trim();
const LOGIN_CUSTOMER_ID = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID?.trim();
const CUSTOMER_ID = process.env.GOOGLE_ADS_CUSTOMER_ID?.trim();

const missing: string[] = [];
if (!TOKEN) missing.push('GOOGLE_ADS_ACCESS_TOKEN');
if (!DEVELOPER_TOKEN) missing.push('GOOGLE_ADS_DEVELOPER_TOKEN');
const describeLive = missing.length === 0 ? describe : describe.skip;

if (missing.length > 0) {
	// Naming what is missing matters here: a skip with one variable absent reads
	// like a pass in the summary.
	console.warn(
		`[googleads] skipping live tests: ${missing.join(' and ')} not set`,
	);
}

// The validate-only writes need an account chosen on purpose: the first
// accessible id may be a manager account, which cannot hold a budget.
const describeWrites =
	missing.length === 0 && CUSTOMER_ID ? describe : describe.skip;

if (missing.length === 0 && !CUSTOMER_ID) {
	console.warn(
		'[googleads] skipping validate-only write tests: GOOGLE_ADS_CUSTOMER_ID not set',
	);
}

/**
 * The endpoints read `key` and call get_integration_credentials for the
 * developer token, so the fixture supplies exactly that.
 *
 * unknown: only those two things are read; the key manager's full surface is
 * not needed for a live call made outside the binder.
 */
const ctx = {
	key: TOKEN ?? '',
	keys: {
		get_integration_credentials: async () => ({
			client_id: null,
			client_secret: null,
			redirect_url: null,
			developer_token: DEVELOPER_TOKEN ?? null,
			login_customer_id: LOGIN_CUSTOMER_ID ?? null,
		}),
	},
} as unknown as Parameters<typeof search>[0]; // unknown: partial manager.

/** The account to query: the explicit one, else the first accessible one. */
async function resolveCustomerId(): Promise<string> {
	if (CUSTOMER_ID) return CUSTOMER_ID;
	const accessible = await customersListAccessible(ctx, {});
	const first = accessible.resourceNames?.[0];
	if (!first) {
		throw new Error(
			'No customer id: set GOOGLE_ADS_CUSTOMER_ID, or the token can reach no accounts',
		);
	}
	// A resource name is `customers/<id>`.
	return first.replace(/^customers\//, '');
}

describeLive('googleads live API', () => {
	jest.setTimeout(90_000);

	it('customers.listAccessible returns a parseable list', async () => {
		const result = await customersListAccessible(ctx, {});

		expect(Array.isArray(result.resourceNames)).toBe(true);
		for (const name of result.resourceNames ?? []) {
			expect(name).toMatch(/^customers\/\d+$/);
		}
	});

	it('googleAdsFields.search finds a field, with no FROM clause', async () => {
		const result = await googleAdsFieldsSearch(ctx, {
			query:
				"SELECT name, category, selectable, filterable WHERE name = 'campaign.id'",
		});

		expect(
			GoogleAdsEndpointOutputSchemas.googleAdsFieldsSearch.safeParse(result)
				.success,
		).toBe(true);
		expect(result.results?.[0]?.name).toBe('campaign.id');
		expect(result.results?.[0]?.selectable).toBe(true);
	});

	it('reporting.search returns parseable rows for a GAQL statement', async () => {
		const customerId = await resolveCustomerId();

		// The cheapest useful query: no metrics or segments, so it costs the
		// least quota and still proves the query path end to end. There is no
		// pageSize: v26 pages at a fixed 10,000 rows.
		const page = await search(ctx, {
			customerId,
			query: 'SELECT customer.id, customer.descriptive_name FROM customer',
		});

		// The endpoint parsed with the schema before returning; re-parsing pins
		// the contract the caller actually receives.
		expect(GoogleAdsEndpointOutputSchemas.search.safeParse(page).success).toBe(
			true,
		);
		expect(Array.isArray(page.results)).toBe(true);
		expect(page.results).toHaveLength(1);
	});

	it('reporting.searchStream flattens the chunk array', async () => {
		const customerId = await resolveCustomerId();

		const result = await searchStream(ctx, {
			customerId,
			query: 'SELECT customer.id FROM customer',
		});

		// searchStream answers an array of chunks; the endpoint flattens it to one
		// results list, which is what this checks.
		expect(Array.isArray(result.results)).toBe(true);
		expect(result.results).toHaveLength(1);
		expect(
			GoogleAdsEndpointOutputSchemas.searchStream.safeParse(result).success,
		).toBe(true);
	});
});

describeWrites('googleads live API, validate-only writes', () => {
	jest.setTimeout(90_000);

	// A unique name, so a validation failure is never DUPLICATE_NAME from an
	// earlier run. Nothing is created, so nothing needs cleaning up.
	const budgetName = `corsair-live-validate-${Date.now()}`;

	it('campaignBudgets.create validates without creating a budget', async () => {
		const result = await campaignBudgetsCreate(ctx, {
			customerId: CUSTOMER_ID!,
			campaignBudget: {
				name: budgetName,
				amountMicros: '1000000',
				deliveryMethod: 'STANDARD',
			},
			validateOnly: true,
		});

		// A validate-only mutate answers no results.
		expect(result.results ?? []).toEqual([]);
		expect(result.partialFailureError ?? null).toBeNull();
	});

	it('reporting.mutate validates a budget create through googleAds:mutate', async () => {
		const result = await mutate(ctx, {
			customerId: CUSTOMER_ID!,
			mutateOperations: [
				{
					campaignBudgetOperation: {
						create: {
							name: `${budgetName}-mutate`,
							amountMicros: '1000000',
						},
					},
				},
			],
			validateOnly: true,
		});

		expect(
			GoogleAdsEndpointOutputSchemas.mutate.safeParse(result).success,
		).toBe(true);
		expect(result.mutateOperationResponses ?? []).toEqual([]);
	});
});
