import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { googleads } from './index';

/**
 * The integration and account setters this test writes through.
 *
 * unknown: core generates these at runtime from the auth config; the manager
 * types only name the auth type's own accessors, so the cast is how the test
 * reaches the generated ones.
 */
type GoogleAdsTestKeys = {
	issue_new_dek: () => Promise<void>;
	set_client_id: (value: string) => Promise<void>;
	set_client_secret: (value: string) => Promise<void>;
	set_developer_token: (value: string) => Promise<void>;
	set_login_customer_id: (value: string) => Promise<void>;
	set_access_token: (value: string) => Promise<void>;
	set_refresh_token: (value: string) => Promise<void>;
	set_expires_at: (value: string) => Promise<void>;
};

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'googleads', 'default');
	const corsair = createCorsair({
		plugins: [googleads()],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	// unknown: core generates these setters; only the auth type's own are typed.
	const integrationKeys = corsair.keys
		.googleads as unknown as GoogleAdsTestKeys; // unknown: generated setters.
	await integrationKeys.issue_new_dek();
	await integrationKeys.set_client_id('client-id');
	await integrationKeys.set_client_secret('client-secret');
	await integrationKeys.set_developer_token('dev-token');
	await integrationKeys.set_login_customer_id('9999999999');
	// unknown: same generated setters, on the account level.
	const keys = corsair.googleads.keys as unknown as GoogleAdsTestKeys; // unknown: setters.
	await keys.issue_new_dek();
	await keys.set_access_token('stored-token');
	await keys.set_refresh_token('stored-refresh');
	// Far future, so the resolver serves the stored token and never refreshes.
	await keys.set_expires_at(String(Math.floor(Date.now() / 1000) + 3600));
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

function respond(
	body: unknown, // unknown: arbitrary JSON until a schema reads it.
	status = 200,
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

const rows = { results: [{ campaign: { id: '111' } }] };
const query = 'SELECT campaign.id FROM campaign';

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('googleads through the bound client', () => {
	it('sends both headers the API needs, from the two levels of storage', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(rows);

			await corsair.googleads.api.reporting.search({
				customerId: '1234567890',
				query,
			});

			const [, init] = fetchMock.mock.calls[0]!;
			const headers = new Headers(init!.headers);
			expect(headers.get('authorization')).toBe('Bearer stored-token');
			expect(headers.get('developer-token')).toBe('dev-token');
			expect(headers.get('login-customer-id')).toBe('9999999999');
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 429 on a search', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{
					error: { code: 429, message: 'quota', status: 'RESOURCE_EXHAUSTED' },
				},
				429,
			);
			respond(rows);

			const result = await corsair.googleads.api.reporting.search({
				customerId: '1234567890',
				query,
			});

			expect(result.results).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 429 for the exhausted daily quota', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{
					error: {
						code: 429,
						message: 'quota',
						status: 'RESOURCE_EXHAUSTED',
						details: [
							{
								'@type':
									'type.googleapis.com/google.ads.googleads.v26.errors.GoogleAdsFailure',
								errors: [{ errorCode: { quotaError: 'RESOURCE_EXHAUSTED' } }],
							},
						],
					},
				},
				429,
			);

			await expect(
				corsair.googleads.api.reporting.search({
					customerId: '1234567890',
					query,
				}),
			).rejects.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 503 on a search, which is a POST that only reads', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{ error: { code: 503, message: 'unavailable', status: 'UNAVAILABLE' } },
				503,
			);
			respond(rows);

			const result = await corsair.googleads.api.reporting.search({
				customerId: '1234567890',
				query,
			});

			expect(result.results).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a dropped connection on a search', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
			respond(rows);

			const result = await corsair.googleads.api.reporting.search({
				customerId: '1234567890',
				query,
			});

			expect(result.results).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a mutate after a dropped connection', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

			await expect(
				corsair.googleads.api.campaignBudgets.create({
					customerId: '1234567890',
					campaignBudget: { name: 'B', amountMicros: '1000000' },
				}),
			).rejects.toBeDefined();
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a mutate after a 5xx, which may have landed', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{ error: { code: 500, message: 'internal', status: 'INTERNAL' } },
				500,
			);

			await expect(
				corsair.googleads.api.campaigns.create({
					customerId: '1234567890',
					campaign: {
						name: 'New',
						advertisingChannelType: 'SEARCH',
						campaignBudget: 'customers/1234567890/campaignBudgets/1',
						containsEuPoliticalAdvertising:
							'DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING',
						manualCpc: {},
					},
				}),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a refused input, because no request is sent', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await expect(
				corsair.googleads.api.reporting.search({
					customerId: '1234567890',
					query: '',
				}),
			).rejects.toBeDefined();
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});
});
