import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { GumroadAPIError } from './client';
import { gumroad } from './index';

const KEY = process.env.GUMROAD_API_KEY ?? '';
const describeIfKey = KEY ? describe : describe.skip;

jest.setTimeout(180_000);

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'gumroad', 'default');
	const corsair = createCorsair({
		plugins: [gumroad({ key: KEY })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

// The cheapest reads (all free to call): two lists and the documented 404
// from verifying a well-shaped license key that does not exist.
describeIfKey('Gumroad live API', () => {
	test('lists products', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.gumroad.api.products.list({});
			expect(result.success).toBe(true);
			expect(Array.isArray(result.products)).toBe(true);
		} finally {
			testDb.cleanup();
		}
	});

	test('lists sales', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.gumroad.api.sales.list({});
			expect(result.success).toBe(true);
			expect(Array.isArray(result.sales)).toBe(true);
		} finally {
			testDb.cleanup();
		}
	});

	test('reads a public profile from the username subdomain', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.gumroad.api.public.profile({
				username: 'sahil',
			});
			expect(result.api_version).toBe(1);
			expect(result.username).toBe('sahil');
		} finally {
			testDb.cleanup();
		}
	});

	test('answers the documented 404 for a nonexistent license', async () => {
		const { corsair, testDb } = await createClient();
		try {
			// unknown: a rejection's type is unknown until the instanceof
			// assertion narrows it.
			const error = await corsair.gumroad.api.licenses
				.verify({
					product_id: '32-nPAicqbLj8B_WswVlMw==',
					license_key: 'A1B2C3D4-E5F60718-9ABCDEF0-1234ABCD',
					increment_uses_count: 'false',
				})
				.catch((e: unknown) => e);

			expect(error).toBeInstanceOf(GumroadAPIError);
			expect(error).toMatchObject({ status: 404 });
		} finally {
			testDb.cleanup();
		}
	});
});
