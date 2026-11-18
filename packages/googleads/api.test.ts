/**
 * Live smoke tests against the Google Ads API. They run only when both
 * GOOGLE_ADS_ACCESS_TOKEN and GOOGLE_ADS_DEVELOPER_TOKEN are set (CI has none,
 * so they skip).
 *
 * A developer token is not optional: Google refuses every call without one,
 * even when the OAuth token is valid, so the suite gates on both and says
 * which one is missing rather than skipping silently.
 *
 * GOOGLE_ADS_CUSTOMER_ID is the account to query. Without it the suite reads
 * customers.listAccessible and takes the first id itself.
 *
 * Read-only: one accessible-customers call and one GAQL search. A search is
 * billed against the account's quota but changes nothing.
 */
import { logEventFromContext } from 'corsair/core';
import { search, searchStream } from './endpoints/reporting';
import { listAccessible as customersListAccessible } from './endpoints/customers';
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
} as unknown as Parameters<typeof search>[0];

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

	it('reporting.search returns parseable rows for a GAQL statement', async () => {
		const customerId = await resolveCustomerId();

		// The cheapest useful query: no metrics segment, so it costs the least
		// quota and still proves the query path end to end.
		const page = await search(ctx, {
			customerId,
			query: 'SELECT customer.id, customer.descriptive_name FROM customer',
			pageSize: 1,
		});

		// The endpoint parsed with the schema before returning; re-parsing pins
		// the contract the caller actually receives.
		expect(GoogleAdsEndpointOutputSchemas.search.safeParse(page).success).toBe(
			true,
		);
		expect(Array.isArray(page.results)).toBe(true);
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
		expect(
			GoogleAdsEndpointOutputSchemas.searchStream.safeParse(result).success,
		).toBe(true);
	});
});
