import 'dotenv/config';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { codacy } from './index';

const API_TOKEN = process.env.CODACY_API_TOKEN;
const PROVIDER = process.env.CODACY_PROVIDER ?? 'gh';
const ORGANIZATION = process.env.CODACY_ORGANIZATION;

const describeWhenCreds = API_TOKEN && ORGANIZATION ? describe : describe.skip;

describe('Codacy plugin integration', () => {
	it('fails fast with AuthMissingError when no key is configured anywhere', async () => {
		// No env keys needed — this never reaches the network.
		const testDb = createTestDatabase();

		try {
			await createIntegrationAndAccount(testDb.db, 'codacy', 'default');

			const corsair = createCorsair({
				plugins: [codacy({})],
				database: testDb.db,
				kek: '0123456789abcdef0123456789abcdef',
			});

			await expect(corsair.codacy.api.Account.get({})).rejects.toThrow(
				/auth-missing/,
			);
		} finally {
			testDb.cleanup();
		}
	});

	describeWhenCreds('live organization reads', () => {
		it('lists organizations and persists them to the database', async () => {
			const testDb = createTestDatabase();

			try {
				await createIntegrationAndAccount(testDb.db, 'codacy', 'default');

				const corsair = createCorsair({
					plugins: [
						codacy({
							key: API_TOKEN,
						}),
					],
					database: testDb.db,
					kek: '0123456789abcdef0123456789abcdef',
				});

				const result = await corsair.codacy.api.Organizations.list({
					limit: 5,
				});

				expect(result).toBeDefined();
				expect(Array.isArray(result.data)).toBe(true);

				if (result.data.length > 0) {
					const first = result.data[0];
					if (first) {
						const fromDb = await corsair.codacy.db.organizations.findByEntityId(
							`${first.provider}/${first.name}`,
						);
						expect(fromDb).not.toBeNull();
						expect(fromDb?.data.name).toBe(first.name);
					}
				}

				expect(PROVIDER).toBeDefined();
				expect(ORGANIZATION).toBeDefined();
			} finally {
				testDb.cleanup();
			}
		});
	});
});
