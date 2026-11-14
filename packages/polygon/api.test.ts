// Live Polygon OMS smoke tests. Excluded from the default run; run with:
//
//   POLYGON_API_KEY=... POLYGON_API_SECRET=... pnpm test:live
//
// Every test is a read, and every answer is parsed through the same output
// schema a caller receives, so a field typed wrongly cannot pass silently.
// OMS issues sandbox keys as `sk_sdbx_`; a live `sk_live_` key moves real money,
// so this suite never creates a quote or a transaction.
import { ApiError } from 'corsair/http';
import {
	makePolygonRequest,
	POLYGON_HOSTS,
	readErrorCode,
	resetPolygonTokenCache,
	resolvePolygonToken,
} from './client';
import {
	PolygonEndpointOutputSchemas,
	SupportedNetworkSchema,
	WalletSchema,
} from './endpoints/types';
import { captureError } from './test-helpers';

const LIVE_KEY = process.env.POLYGON_API_KEY ?? '';
const LIVE_SECRET = process.env.POLYGON_API_SECRET ?? '';

const missing = [
	LIVE_KEY ? undefined : 'POLYGON_API_KEY',
	LIVE_SECRET ? undefined : 'POLYGON_API_SECRET',
].filter((name): name is string => name !== undefined);

if (missing.length > 0) {
	// Same wording the gate prints, so a skipped run cannot read as a green one.
	console.warn(
		`Skipping Polygon live API tests: ${missing.join(' and ')} not set.`,
	);
}
const describeLive = missing.length === 0 ? describe : describe.skip;

/** An `sk_sdbx_` key is a sandbox key; anything else is treated as live. */
const environment = LIVE_KEY.startsWith('sk_sdbx_') ? 'sandbox' : 'live';
const credentials = { apiKey: LIVE_KEY, apiSecret: LIVE_SECRET };

describeLive('Polygon OMS live API', () => {
	beforeAll(() => {
		resetPolygonTokenCache();
	});

	it('mints a bearer token and reports the project mode', async () => {
		const token = await resolvePolygonToken(environment, credentials);

		expect(typeof token).toBe('string');
		expect(token.length).toBeGreaterThan(0);
	});

	it('lists the networks this project can route, through the output schema', async () => {
		const token = await resolvePolygonToken(environment, credentials);
		const raw = await makePolygonRequest(environment, token, {
			method: 'GET',
			path: '/networks',
			query: { limit: 5 },
		});

		const page = PolygonEndpointOutputSchemas.networksList.parse(raw);
		expect(Array.isArray(page.data)).toBe(true);
		// A network the docs print as `{ network, chainId, assets, supportedBy }`
		// must parse, which proves the schema matches the wire format.
		for (const network of page.data) {
			expect(SupportedNetworkSchema.safeParse(network).success).toBe(true);
		}
	});

	it('lists wallets and parses one through its schema', async () => {
		const token = await resolvePolygonToken(environment, credentials);
		const raw = await makePolygonRequest(environment, token, {
			method: 'GET',
			path: '/wallets',
			query: { limit: 5 },
		});

		const page = PolygonEndpointOutputSchemas.walletsList.parse(raw);
		expect(Array.isArray(page.data)).toBe(true);
		for (const wallet of page.data) {
			expect(WalletSchema.safeParse(wallet).success).toBe(true);
		}
	});

	it('lists transactions through the output schema', async () => {
		const token = await resolvePolygonToken(environment, credentials);
		const raw = await makePolygonRequest(environment, token, {
			method: 'GET',
			path: '/transactions',
			query: { limit: 5 },
		});

		const page = PolygonEndpointOutputSchemas.transactionsList.parse(raw);
		expect(Array.isArray(page.data)).toBe(true);
	});

	it('lists customers through the output schema', async () => {
		const token = await resolvePolygonToken(environment, credentials);
		const raw = await makePolygonRequest(environment, token, {
			method: 'GET',
			path: '/customers',
			query: { limit: 5 },
		});

		const page = PolygonEndpointOutputSchemas.customersList.parse(raw);
		expect(Array.isArray(page.data)).toBe(true);
	});

	it('lists webhook endpoints through the output schema', async () => {
		const token = await resolvePolygonToken(environment, credentials);
		const raw = await makePolygonRequest(environment, token, {
			method: 'GET',
			path: '/webhooks',
			query: { limit: 5 },
		});

		const page = PolygonEndpointOutputSchemas.webhooksList.parse(raw);
		expect(Array.isArray(page.data)).toBe(true);
	});

	it('rejects a wrong secret with InvalidCredentials, keeping it off the error', async () => {
		resetPolygonTokenCache();
		const error = await captureError(
			resolvePolygonToken(environment, {
				apiKey: 'sk_sdbx_definitely-not-a-key',
				apiSecret: 'definitely-not-a-secret',
			}),
		);

		// A 401 is core's ApiError, passed through unchanged.
		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) return;
		expect(error.status).toBe(401);
		expect(readErrorCode(error.body)).toBe('InvalidCredentials');
		expect(JSON.stringify(error)).not.toContain('definitely-not-a-secret');
		expect(String(error.stack)).not.toContain('definitely-not-a-secret');
	});

	it('uses the documented hosts rather than one hardcoded base', () => {
		expect(POLYGON_HOSTS.sandbox).toBe(
			'https://sandbox-api.polygon.technology/v0.13',
		);
		expect(POLYGON_HOSTS.live).toBe('https://api.polygon.technology/v0.13');
	});
});
