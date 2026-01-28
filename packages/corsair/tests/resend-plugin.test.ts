import { createCorsair } from '../core';
import { resend } from '../plugins/resend';
import { createTestDatabase } from './setup-db';
import { createIntegrationAndAccount } from './plugins-test-utils';

async function createResendClient() {
	const apiKey = process.env.RESEND_API_KEY;
	const from = process.env.RESEND_FROM_EMAIL;
	const to = process.env.RESEND_TO_EMAIL;
	if (!apiKey || !from || !to) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.adapter, 'resend');

	const corsair = createCorsair({
		plugins: [
			resend({
				authType: 'api_key' as any,
				credentials: {
					apiKey,
				} as any,
			}),
		],
		database: testDb.adapter,
	});

	return { corsair, testDb, from, to };
}

describe('Resend plugin integration', () => {
	it('emails endpoints interact with API and DB', async () => {
		const setup = await createResendClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb, from, to } = setup;

		const sent = await corsair.resend.api.emails.send({
			from,
			to: [to],
			subject: `Corsair Resend integration test ${Date.now()}`,
			html: '<p>Test</p>',
		} as any);

		expect(sent).toBeDefined();

		const sendEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'resend.emails.send' }],
		});

		expect(sendEvents.length).toBeGreaterThan(0);

		const emailsCount = await corsair.resend.db.emails.count();

		expect(emailsCount).toBeGreaterThan(0);

		if (sent.id) {
			const fetched = await corsair.resend.api.emails.get({
				id: sent.id,
			});

			expect(fetched).toBeDefined();

			const getEvents = await testDb.adapter.findMany({
				table: 'corsair_events',
				where: [{ field: 'event_type', value: 'resend.emails.get' }],
			});

			expect(getEvents.length).toBeGreaterThan(0);
		}

		const listResult = await corsair.resend.api.emails.list({
			limit: 10,
		});

		expect(listResult).toBeDefined();

		const listEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'resend.emails.list' }],
		});

		expect(listEvents.length).toBeGreaterThan(0);

		testDb.cleanup();
	});

	it('domains endpoints interact with API and DB when domain is available', async () => {
		const setup = await createResendClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const domainsList = await corsair.resend.api.domains.list({
			limit: 10,
		});

		expect(domainsList).toBeDefined();

		const listEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'resend.domains.list' }],
		});

		expect(listEvents.length).toBeGreaterThan(0);

		const domains = domainsList.data || [];

		if (domains.length === 0) {
			testDb.cleanup();
			return;
		}

		const firstDomain = domains[0]!;

		const domainFromDb = await corsair.resend.db.domains.findByEntityId(
			firstDomain.id,
		);

		expect(domainFromDb).not.toBeNull();

		const fetchedDomain = await corsair.resend.api.domains.get({
			id: firstDomain.id,
		});

		expect(fetchedDomain).toBeDefined();

		const getEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'resend.domains.get' }],
		});

		expect(getEvents.length).toBeGreaterThan(0);

		testDb.cleanup();
	});
});

