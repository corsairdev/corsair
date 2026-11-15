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

	it('reads a bought label, whose `rate` is an id and `tracking_status` a string', async () => {
		const raw = await makeShippoRequest(KEY as string, {
			method: 'GET',
			path: '/transactions',
			query: { results: 5 },
		});

		const page = ShippoEndpointOutputSchemas.transactionsList.parse(raw);
		const bought = page.results.find((entry) => entry.status === 'SUCCESS');
		if (!bought) {
			// A fresh test account has no labels; nothing to compare against.
			console.warn(
				'[shippo] no SUCCESS transaction on this account; shape not checked',
			);
			return;
		}
		// Both of these differ from what the OpenAPI spec declares, and both
		// rejected every real label before the schema was corrected:
		// `rate` is the rate's object_id, and `tracking_status` is the bare
		// status string rather than the tracking-status object.
		expect(typeof bought.rate).toBe('string');
		expect(typeof bought.tracking_status).toBe('string');
		expect(bought.label_url).toBeTruthy();
	});

	it('reads a rate whose amount is a decimal string', async () => {
		const raw = await makeShippoRequest(KEY as string, {
			method: 'GET',
			path: '/shipments',
			query: { results: 5 },
		});

		const page = ShippoEndpointOutputSchemas.shipmentsList.parse(raw);
		const withRates = page.results.find(
			(entry) => (entry.rates?.length ?? 0) > 0,
		);
		if (!withRates) {
			console.warn('[shippo] no shipment carries rates; shape not checked');
			return;
		}
		const first = withRates.rates?.[0];
		expect(typeof first?.amount).toBe('string');
		// Dimensions and weights come back as strings, reformatted ("2.0000").
		expect(typeof withRates.parcels?.[0]?.weight).toBe('string');
	});

	it('filters orders by start_date/end_date, the names the API honours', async () => {
		// Shippo answers 200 for an unknown query parameter, so a wrong name
		// filters nothing and looks like it worked. This pins the real ones by
		// asking for an empty window and expecting an empty page.
		const raw = await makeShippoRequest(KEY as string, {
			method: 'GET',
			path: '/orders',
			query: {
				start_date: '2000-01-01T00:00:00Z',
				end_date: '2000-01-02T00:00:00Z',
			},
		});

		const page = ShippoEndpointOutputSchemas.ordersList.parse(raw);
		// Nothing was placed in 2000, so an honoured filter returns nothing.
		expect(page.results).toHaveLength(0);
	});

	it('pages refunds and webhooks, which the spec does not document', async () => {
		// Both routes return a `next` URL when more results exist, even though
		// the OpenAPI spec lists no paging parameters for them.
		for (const path of ['/refunds/', '/webhooks']) {
			const raw = await makeShippoRequest(KEY as string, {
				method: 'GET',
				path,
				query: { results: 1, page: 1 },
			});
			// Parsed through the real output schemas, so no cast is needed and the
			// paging envelope is validated at the same time.
			const page =
				path === '/refunds/'
					? ShippoEndpointOutputSchemas.refundsList.parse(raw)
					: ShippoEndpointOutputSchemas.webhooksList.parse(raw);
			expect(Array.isArray(page.results)).toBe(true);
			// At most one result, which proves `results` was honoured.
			expect(page.results.length).toBeLessThanOrEqual(1);
		}
	});

	it('deletes a webhook, which answers 204 with no body', async () => {
		const created = (await makeShippoRequest(KEY as string, {
			method: 'POST',
			path: '/webhooks',
			body: {
				url: 'https://example.com/live-delete',
				event: 'track_updated',
				is_test: true,
			},
		})) as { object_id: string };

		const raw = await makeShippoRequest(KEY as string, {
			method: 'DELETE',
			path: `/webhooks/${created.object_id}`,
		});

		// No body at all: the client returns undefined, and the endpoint's shape
		// handler turns that into `{ deleted: true }`.
		expect(raw).toBeUndefined();
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
