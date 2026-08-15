import 'dotenv/config';
import { createCorsair } from 'corsair/core';
import { createCorsairOrm } from 'corsair/orm';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { clientary } from './index';

const API_KEY = process.env.CLIENTARY_API_KEY;
const DOMAIN = process.env.CLIENTARY_DOMAIN;
const describeWhenCreds = API_KEY && DOMAIN ? describe : describe.skip;

async function createClientaryClient() {
	if (!API_KEY || !DOMAIN) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'clientary', 'default');

	const corsair = createCorsair({
		plugins: [
			clientary({
				key: API_KEY,
				domain: DOMAIN,
			}),
		],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});

	return { corsair, testDb };
}

describeWhenCreds('Clientary plugin integration', () => {
	it('clients.list calls the API and logs the event', async () => {
		const setup = await createClientaryClient();
		if (!setup) {
			return;
		}
		const { corsair, testDb } = setup;

		try {
			const result = await corsair.clientary.api.clients.list({
				page_size: 5,
			});

			expect(result).toBeDefined();
			expect(Array.isArray(result.clients)).toBe(true);
			expect(typeof result.total_count).toBe('number');

			const orm = createCorsairOrm(testDb.database);
			const events = await orm.events.findMany({
				where: { event_type: 'clientary.clients.list' },
			});
			expect(events.length).toBeGreaterThan(0);
		} finally {
			testDb.cleanup();
		}
	});

	it('projects.list persists projects to the database', async () => {
		const setup = await createClientaryClient();
		if (!setup) {
			return;
		}
		const { corsair, testDb } = setup;

		try {
			const result = await corsair.clientary.api.projects.list({
				page_size: 5,
			});

			expect(result).toBeDefined();
			expect(Array.isArray(result.projects)).toBe(true);

			if (result.projects.length > 0) {
				const first = result.projects[0];
				if (first) {
					const fromDb = await corsair.clientary.db.projects.findByEntityId(
						String(first.id),
					);
					expect(fromDb).not.toBeNull();
					expect(fromDb?.data.id).toBe(first.id);
				}
			}
		} finally {
			testDb.cleanup();
		}
	});
});

describe('Clientary plugin integration (offline)', () => {
	it('fails fast with AuthMissingError when no key is configured anywhere', async () => {
		// No env keys needed — this never reaches the network.
		const testDb = createTestDatabase();

		try {
			await createIntegrationAndAccount(testDb.db, 'clientary', 'default');

			const corsair = createCorsair({
				plugins: [clientary({ domain: 'acme' })],
				database: testDb.db,
				kek: '0123456789abcdef0123456789abcdef',
			});

			await expect(corsair.clientary.api.clients.list({})).rejects.toThrow(
				/auth-missing/,
			);
		} finally {
			testDb.cleanup();
		}
	});
});
