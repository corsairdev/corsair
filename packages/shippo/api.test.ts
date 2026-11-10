import { makeShippoRequest, ShippoAPIError } from './client';
import { ShippoEndpointOutputSchemas } from './endpoints/types';
import { createHarness } from './test-helpers';

/**
 * Live smoke tests against the real Shippo API. CI skips this file by name
 * (`api.test.ts`), so it is opt-in:
 *
 * ```bash
 * SHIPPO_API_KEY=shippo_test_… pnpm --filter @corsair-dev/shippo test:live
 * ```
 *
 * These matter more here than usual: the offline fixtures were built from the
 * OpenAPI spec's examples, not from captured responses, because no token was
 * available while the plugin was written. This suite is what checks the spec
 * against the wire.
 *
 * Read-only, and few calls: test mode allows 10 list requests a minute.
 */
const KEY = process.env.SHIPPO_API_KEY;
const describeIfKey = KEY ? describe : describe.skip;

const h = createHarness();

if (!KEY) {
	// A skipped run must not read as a green one.
	console.warn(
		'[shippo] SHIPPO_API_KEY is not set; live smoke tests are skipped.',
	);
}

describeIfKey('Shippo live smoke', () => {
	it('lists addresses and parses the paging envelope', async () => {
		const raw = await makeShippoRequest(KEY as string, {
			method: 'GET',
			path: '/addresses',
			query: { results: 5 },
		});

		const page = ShippoEndpointOutputSchemas.addressesList.parse(raw);
		expect(Array.isArray(page.results)).toBe(true);
		// `next` is either a URL or null; a number here would mean a different shape.
		expect(page.next === null || typeof page.next === 'string').toBe(true);
	});

	it('lists shipments, which is the shape the rate flow depends on', async () => {
		const raw = await makeShippoRequest(KEY as string, {
			method: 'GET',
			path: '/shipments',
			query: { results: 5 },
		});

		const page = ShippoEndpointOutputSchemas.shipmentsList.parse(raw);
		expect(Array.isArray(page.results)).toBe(true);
		if (page.results.length > 0) {
			// Confirms the status enum and the address nesting on real data.
			const first = page.results[0];
			expect(typeof first?.object_id).toBe('string');
			expect(['WAITING', 'QUEUED', 'SUCCESS', 'ERROR']).toContain(
				first?.status,
			);
		}
	});

	it('lists transactions and reads a label status', async () => {
		const raw = await makeShippoRequest(KEY as string, {
			method: 'GET',
			path: '/transactions',
			query: { results: 5 },
		});

		const page = ShippoEndpointOutputSchemas.transactionsList.parse(raw);
		expect(Array.isArray(page.results)).toBe(true);
	});

	it('lists carrier accounts, which every rate request depends on', async () => {
		const raw = await makeShippoRequest(KEY as string, {
			method: 'GET',
			path: '/carrier_accounts',
		});

		const page = ShippoEndpointOutputSchemas.carrierAccountsList.parse(raw);
		expect(Array.isArray(page.results)).toBe(true);
	});

	it('lists carrier parcel templates, whose response has no paging block', async () => {
		const raw = await makeShippoRequest(KEY as string, {
			method: 'GET',
			path: '/parcel-templates',
		});

		// This route answers `{ results }` without `next`/`previous`, unlike the
		// account-level lists — the schema accounts for that.
		const parsed =
			ShippoEndpointOutputSchemas.carrierParcelTemplatesList.parse(raw);
		expect(Array.isArray(parsed.results)).toBe(true);
		expect(parsed.results.length).toBeGreaterThan(0);
	});

	it('lists webhooks', async () => {
		const raw = await makeShippoRequest(KEY as string, {
			method: 'GET',
			path: '/webhooks',
		});

		const page = ShippoEndpointOutputSchemas.webhooksList.parse(raw);
		expect(Array.isArray(page.results)).toBe(true);
	});

	it('reports an unknown object as a 404 with `detail`', async () => {
		const error = await h.failure<ShippoAPIError>(
			makeShippoRequest(KEY as string, {
				method: 'GET',
				path: '/addresses/doesnotexist',
			}),
		);

		expect(error).toBeInstanceOf(ShippoAPIError);
		expect(error.status).toBe(404);
		expect(error.fieldErrors).toBeUndefined();
		expect(error.message).toContain('404');
	});

	it('rejects a bad token with 401 `Token does not exist`', async () => {
		const error = await h.failure<ShippoAPIError>(
			makeShippoRequest('shippo_test_invalid_token', {
				method: 'GET',
				path: '/addresses',
			}),
		);

		expect(error.status).toBe(401);
		expect(error.code).toBe('INVALID_TOKEN');
		expect(error.message).toContain('Token does not exist');
	});

	it('confirms auth is checked before routing, as the client assumes', async () => {
		// A route that does not exist answers 401 with a bad token, not 404. The
		// error handler relies on this: 401 means "token", never "bad path".
		const error = await h.failure<ShippoAPIError>(
			makeShippoRequest('shippo_test_invalid_token', {
				method: 'GET',
				path: '/definitely-not-a-route',
			}),
		);

		expect(error.status).toBe(401);
	});
});

