import 'dotenv/config';
import { createCorsair } from 'corsair/core';
import { createCorsairOrm } from 'corsair/orm';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { twittrapi } from './index';

const TEST_USERNAME = process.env.TEST_TWITTER_USERNAME || 'XDevelopers';

async function createTwittrApiClient() {
	const apiKey = process.env.TWITTRAPI_API_KEY;
	if (!apiKey) return null;

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'twittrapi');

	const corsair = createCorsair({
		plugins: [twittrapi({ authType: 'api_key', key: apiKey })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK!,
	});

	return { corsair, testDb };
}

describe('TwittrAPI plugin integration', () => {
	it('users.getByUsername interacts with API and DB', async () => {
		const setup = await createTwittrApiClient();
		if (!setup) return;

		const { corsair, testDb } = setup;
		const orm = createCorsairOrm(testDb.database);

		const input = { username: TEST_USERNAME };
		const result = await corsair.twittrapi.api.users.getByUsername(input);
		expect(result).toBeDefined();

		const events = await orm.events.findMany({
			where: { event_type: 'twittrapi.users.getByUsername' },
		});
		expect(events.length).toBeGreaterThan(0);
		const lastEvent = events[events.length - 1]!;
		const payload =
			typeof lastEvent.payload === 'string'
				? (JSON.parse(lastEvent.payload) as Record<string, unknown>)
				: lastEvent.payload;
		expect(payload).toMatchObject(input);

		if (result.data) {
			const fromDb = await corsair.twittrapi.db.users.findByEntityId(
				result.data.id,
			);
			expect(fromDb).not.toBeNull();
			expect(fromDb?.data.id).toBe(result.data.id);
		}

		testDb.cleanup();
	});

	it('tweets.search interacts with API and DB', async () => {
		const setup = await createTwittrApiClient();
		if (!setup) return;

		const { corsair, testDb } = setup;
		const orm = createCorsairOrm(testDb.database);

		const input = {
			searchItem: 'from:XDevelopers',
			category: 'Latest' as const,
		};
		const result = await corsair.twittrapi.api.tweets.search(input);
		expect(result).toBeDefined();
		expect(Array.isArray(result.data)).toBe(true);

		const events = await orm.events.findMany({
			where: { event_type: 'twittrapi.tweets.search' },
		});
		expect(events.length).toBeGreaterThan(0);

		if (result.data.length > 0 && !('unavailable' in result.data[0]!)) {
			const first = result.data[0] as { id: string };
			const fromDb = await corsair.twittrapi.db.tweets.findByEntityId(first.id);
			expect(fromDb).not.toBeNull();
		}

		testDb.cleanup();
	});

	it('balance.get reads the key balance', async () => {
		const setup = await createTwittrApiClient();
		if (!setup) return;

		const { corsair, testDb } = setup;
		const result = await corsair.twittrapi.api.balance.get({});
		expect(result).toBeDefined();

		testDb.cleanup();
	});

	it('trends.getByLocation interacts with API and DB', async () => {
		const setup = await createTwittrApiClient();
		if (!setup) return;

		const { corsair, testDb } = setup;
		const input = { locationId: '1' };
		const result = await corsair.twittrapi.api.trends.getByLocation(input);
		expect(result).toBeDefined();
		expect(Array.isArray(result.data)).toBe(true);

		if (result.data.length > 0) {
			const first = result.data[0]!;
			const fromDb = await corsair.twittrapi.db.trends.findByEntityId(
				`1:${first.name}`,
			);
			expect(fromDb).not.toBeNull();
		}

		testDb.cleanup();
	});

	it('monitors.getEvents reads the event feed', async () => {
		const setup = await createTwittrApiClient();
		if (!setup) return;

		const { corsair, testDb } = setup;
		const result = await corsair.twittrapi.api.monitors.getEvents({ limit: 5 });
		expect(result).toBeDefined();
		expect(Array.isArray(result.data)).toBe(true);

		testDb.cleanup();
	});
});
