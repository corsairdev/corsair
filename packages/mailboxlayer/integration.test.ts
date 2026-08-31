import 'dotenv/config';
import { createCorsair } from 'corsair/core';
import { createCorsairOrm } from 'corsair/orm';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { mailboxlayer } from './index';

const ACCESS_KEY = process.env.MAILBOXLAYER_API_KEY;
const describeIfKey = ACCESS_KEY ? describe : describe.skip;

async function createMailboxLayerClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'mailboxlayer', 'default');

	const corsair = createCorsair({
		plugins: [mailboxlayer({ key: ACCESS_KEY })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});

	return { corsair, testDb };
}

describeIfKey('MailboxLayer plugin integration', () => {
	it('email.check calls the API and persists to DB', async () => {
		const { corsair, testDb } = await createMailboxLayerClient();

		try {
			const input = { email: 'support@apilayer.net' };
			const result = await corsair.mailboxlayer.api.email.check(input);

			expect(result).toBeDefined();
			expect(result.email).toBe(input.email);
			expect(typeof result.format_valid).toBe('boolean');

			const orm = createCorsairOrm(testDb.database);
			const events = await orm.events.findMany({
				where: { event_type: 'mailboxlayer.email.check' },
			});
			expect(events.length).toBeGreaterThan(0);

			const fromDb = await corsair.mailboxlayer.db.emailChecks.findByEntityId(
				input.email,
			);
			expect(fromDb).not.toBeNull();
			expect(fromDb?.data.email).toBe(input.email);
			expect(fromDb?.data.formatValid).toBe(result.format_valid);
		} finally {
			testDb.cleanup();
		}
	});

	it('works with a key from plugin options and no database at all', async () => {
		const corsair = createCorsair({
			plugins: [mailboxlayer({ key: ACCESS_KEY })],
			kek: '0123456789abcdef0123456789abcdef',
		});

		const result = await corsair.mailboxlayer.api.email.check({
			email: 'support@apilayer.net',
		});

		expect(result.email).toBe('support@apilayer.net');
	});
});

describe('MailboxLayer plugin auth', () => {
	it('surfaces an auth error from the API when no key is configured anywhere', async () => {
		const testDb = createTestDatabase();

		try {
			await createIntegrationAndAccount(testDb.db, 'mailboxlayer', 'default');

			const corsair = createCorsair({
				plugins: [mailboxlayer({})],
				database: testDb.db,
				kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
			});

			await expect(
				corsair.mailboxlayer.api.email.check({ email: 'support@apilayer.net' }),
			).rejects.toThrow(/auth-missing/);
		} finally {
			testDb.cleanup();
		}
	});
});
