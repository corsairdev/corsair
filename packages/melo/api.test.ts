/**
 * Live Melo (Stream Estate) API tests, run through createCorsair so the
 * keyBuilder, the zod input schemas and the zod OUTPUT schemas are all
 * exercised: every endpoint here parses the live answer, so a field typed
 * wrongly in the schema fails this suite instead of a caller.
 *
 * First run against the real API on 11-11, on a pay-as-you-go account (free
 * starting credit, then a charge per returned item), so every read asks for as
 * few items as it can. See packages/melo/plugin-docs.yaml for what the run
 * found and what is still unverified.
 *
 * Reads need `MELO_API_KEY` (an API key from https://stream.estate/console,
 * API Keys page). Without it nothing here runs, and a warning says so, so a
 * skipped run is never mistaken for a green one.
 *
 * The write round trip also needs `MELO_LIVE_WRITES=1`. It creates one search
 * with notifications switched off and no webhook, updates it, and deletes it in
 * a `finally`. `webhooks.simulate` makes Melo send a request to a URL, so it
 * only runs when `MELO_SIMULATE_ENDPOINT` names an endpoint you control.
 */
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { melo } from './index';

const KEY = process.env.MELO_API_KEY ?? '';
const RUN_LIVE = KEY.length > 0;
const RUN_WRITES = RUN_LIVE && process.env.MELO_LIVE_WRITES === '1';
const SIMULATE_ENDPOINT = process.env.MELO_SIMULATE_ENDPOINT ?? '';
const RUN_SIMULATE = RUN_LIVE && SIMULATE_ENDPOINT.length > 0;

const describeLive = RUN_LIVE ? describe : describe.skip;
const describeWrites = RUN_WRITES ? describe : describe.skip;
const describeSimulate = RUN_SIMULATE ? describe : describe.skip;

if (!RUN_LIVE) {
	console.warn(
		'[melo api.test] MELO_API_KEY is not set: the LIVE Melo suite did NOT run, so no response was checked against the real API. Passing offline suites say nothing about live behaviour.',
	);
} else {
	if (!RUN_WRITES) {
		console.warn(
			'[melo api.test] MELO_LIVE_WRITES is not 1: the create/update/delete search round trip did NOT run.',
		);
	}
	if (!RUN_SIMULATE) {
		console.warn(
			'[melo api.test] MELO_SIMULATE_ENDPOINT is not set: webhooks.simulate did NOT run.',
		);
	}
}

// Melo documents a 429 but no limit; keep the read count small anyway.
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'melo', 'default');
	const corsair = createCorsair({
		plugins: [melo()],
		database: testDb.db,
		kek: '0123456789abcdef0123456789abcdef',
	});
	await corsair.melo.keys.issue_new_dek();
	await corsair.melo.keys.set_api_key(KEY);
	return { corsair, testDb };
}

type Client = Awaited<ReturnType<typeof createClient>>;
let client: Client;

beforeAll(async () => {
	if (!RUN_LIVE) return;
	client = await createClient();
});

afterAll(() => {
	client?.testDb.cleanup();
});

beforeEach(() => {
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describeLive('Melo live reads', () => {
	it('indicators.locations finds Paris and returns IRIs for the filters', async () => {
		const result = await client.corsair.melo.api.indicators.locations({
			query: 'paris',
		});

		expect(result['hydra:member'].length).toBeGreaterThan(0);
		const iris = result['hydra:member'].map((item) => item['@id']);
		expect(iris).toContain('/departments/77');
	});

	it('properties.list returns a page of houses for sale, with a next page when there are more', async () => {
		const result = await client.corsair.melo.api.properties.list({
			includedDepartments: ['/departments/77'],
			propertyTypes: [1],
			transactionType: 0,
			withCoherentPrice: true,
			itemsPerPage: 2,
		});

		expect(result['hydra:member'].length).toBeLessThanOrEqual(2);
		expect(result['hydra:totalItems']).toBeGreaterThan(0);
		expect(result.nextPage === null || Number.isInteger(result.nextPage)).toBe(
			true,
		);
	});

	it('properties.get and properties.listSimilar read the first property', async () => {
		const page = await client.corsair.melo.api.properties.list({
			propertyTypes: [0],
			transactionType: 0,
			itemsPerPage: 1,
		});
		const uuid = page['hydra:member'][0]?.uuid;
		if (!uuid) throw new Error('The account returned no property to read.');

		const property = await client.corsair.melo.api.properties.get({ id: uuid });
		expect(property.uuid).toBe(uuid);

		const similar = await client.corsair.melo.api.properties.listSimilar({
			id: uuid,
			itemsPerPage: 2,
		});
		expect(Array.isArray(similar['hydra:member'])).toBe(true);
	});

	it('indicators.pricePerMeter returns an average, a median and a series', async () => {
		const result = await client.corsair.melo.api.indicators.pricePerMeter({
			includedDepartments: ['/departments/77'],
			propertyTypes: [0],
			transactionType: 0,
			withCoherentPrice: true,
			aggregationInterval: 'year',
		});

		expect(result['hydra:member'].length).toBeGreaterThan(0);
		expect(typeof result['hydra:member'][0]?.average).toBe('number');
	});

	it('indicators.pointsOfInterest answers a collection for schools around Paris', async () => {
		const result = await client.corsair.melo.api.indicators.pointsOfInterest({
			facilities: ['school'],
			lat: 48.8803424,
			lon: 2.333215,
			radius: 0.5,
		});

		// On 11-11 Melo answered an empty collection to every query tried (school,
		// restaurant and kindergarten, radius up to 2 km, two points in central
		// Paris), so the test cannot require members. Any it returns are schools.
		expect(Array.isArray(result['hydra:member'])).toBe(true);
		for (const poi of result['hydra:member']) {
			expect(poi.type).toBe('school');
		}
		// The same route sometimes took 30 to 40 s to answer on 11-11, past the
		// 20 s request timeout, so leave room for the plugin's retries.
	}, 90_000);

	it('indicators.cities finds a city by INSEE code', async () => {
		const result = await client.corsair.melo.api.indicators.cities({
			insee: '75056',
		});

		expect(result['hydra:member'].length).toBeGreaterThan(0);
		expect(result['hydra:member'][0]?.insee).toBe('75056');
	});

	it('searches.list reads the saved searches of the account', async () => {
		const result = await client.corsair.melo.api.searches.list({});

		expect(Array.isArray(result['hydra:member'])).toBe(true);
	});
});

describeWrites('Melo live search round trip', () => {
	it('creates, reads, updates and deletes one search with notifications off', async () => {
		const title = `corsair-plugin-test-${Date.now()}`;
		// Melo refuses a search without a location and a budget or price per
		// meter (400), although the spec marks neither as required.
		const created = await client.corsair.melo.api.searches.create({
			title,
			transactionType: 0,
			propertyTypes: [0],
			includedDepartments: ['/departments/77'],
			budgetMax: 400000,
			notificationEnabled: false,
		});
		const iri = created['@id'];
		const id = iri?.split('/').pop();
		if (!id) throw new Error(`Create returned no search id: ${String(iri)}`);

		// A cleanup that throws inside `finally` replaces the body's error, so a
		// failed delete would be reported as the cause of an unrelated assertion
		// failure. The flag lets cleanup stay an assertion while the body passes,
		// and only a warning while it does not.
		let bodyFailed = false;
		try {
			expect(created.title).toBe(title);

			const fetched = await client.corsair.melo.api.searches.get({ id });
			expect(fetched.title).toBe(title);

			const updated = await client.corsair.melo.api.searches.update({
				id,
				title: `${title}-updated`,
				transactionType: 0,
				propertyTypes: [0, 1],
				notificationEnabled: false,
			});
			// A 200 is not proof of a write: read it back and compare.
			const reread = await client.corsair.melo.api.searches.get({ id });
			expect(updated.title).toBe(`${title}-updated`);
			expect(reread.title).toBe(`${title}-updated`);
			expect(reread.propertyTypes).toEqual([0, 1]);
		} catch (error) {
			bodyFailed = true;
			throw error;
		} finally {
			try {
				const removed = await client.corsair.melo.api.searches.delete({ id });
				expect(removed).toEqual({ id, deleted: true });
			} catch (cleanupError) {
				if (!bodyFailed) throw cleanupError;
				// Name the leftover search: the account still holds it, and whoever
				// reads the real failure needs the id to delete it by hand.
				console.warn(
					`[melo api.test] cleanup did not delete saved search ${id}: ${String(cleanupError)}`,
				);
			}
		}
	});
});

describeSimulate('Melo live webhook simulation', () => {
	it('webhooks.simulate asks Melo to send a test match to the endpoint', async () => {
		const result = await client.corsair.melo.api.webhooks.simulate({
			endpoint: SIMULATE_ENDPOINT,
		});

		expect(result.sent).toBe(true);
		expect(result.simulated).toBe('match');
	});
});
