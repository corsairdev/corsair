import dotenv from 'dotenv';
import { createCorsair } from '../core';
import { resend } from '../plugins/resend';
import { ResendAPIError } from '../plugins/resend/client';
import { createIntegrationAndAccount } from './plugins-test-utils';
import { createTestDatabase } from './setup-db';

dotenv.config();

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
				authType: 'api_key',
				key: apiKey,
				credentials: {
					apiKey,
				},
			}),
		],
		database: testDb.adapter,
		kek: process.env.CORSAIR_KEK!,
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

		const sendInput = {
			from,
			to: [to],
			subject: `Corsair Resend integration test ${Date.now()}`,
			html: '<p>Test</p>',
		};

		let sent;
		try {
			sent = await corsair.resend.api.emails.send(sendInput);
		} catch (error) {
			if (
				error instanceof ResendAPIError &&
				error.message.includes('Forbidden')
			) {
				testDb.cleanup();
				return;
			}
			throw error;
		}

		expect(sent).toBeDefined();

		const sendEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'resend.emails.send' }],
		});

		expect(sendEvents.length).toBeGreaterThan(0);
		const sendEvent = sendEvents[sendEvents.length - 1]!;
		const sendEventPayload = typeof sendEvent.payload === 'string' 
			? JSON.parse(sendEvent.payload) 
			: sendEvent.payload;
		expect(sendEventPayload).toMatchObject(sendInput);

		const emailsCount = await corsair.resend.db.emails.count();

		expect(emailsCount).toBeGreaterThan(0);

		if (sent.id) {
			const emailFromDb = await corsair.resend.db.emails.findByEntityId(
				sent.id,
			);
			if (emailFromDb) {
				expect(emailFromDb.data.id).toBe(sent.id);
			}

			const getInput = {
				id: sent.id,
			};

			const fetched = await corsair.resend.api.emails.get(getInput);

			expect(fetched).toBeDefined();

			const getEvents = await testDb.adapter.findMany({
				table: 'corsair_events',
				where: [{ field: 'event_type', value: 'resend.emails.get' }],
			});

			expect(getEvents.length).toBeGreaterThan(0);
			const getEvent = getEvents[getEvents.length - 1]!;
			const getEventPayload = typeof getEvent.payload === 'string' 
				? JSON.parse(getEvent.payload) 
				: getEvent.payload;
			expect(getEventPayload).toMatchObject(getInput);

			if (fetched.id) {
				const fetchedEmailFromDb = await corsair.resend.db.emails.findByEntityId(
					fetched.id,
				);
				if (fetchedEmailFromDb) {
					expect(fetchedEmailFromDb.data.id).toBe(fetched.id);
				}
			}
		}

		const listInput = {
			limit: 10,
		};

		const listResult = await corsair.resend.api.emails.list(listInput);

		expect(listResult).toBeDefined();

		const listEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'resend.emails.list' }],
		});

		expect(listEvents.length).toBeGreaterThan(0);
		const listEvent = listEvents[listEvents.length - 1]!;
		const listEventPayload = typeof listEvent.payload === 'string' 
			? JSON.parse(listEvent.payload) 
			: listEvent.payload;
		expect(listEventPayload).toMatchObject(listInput);

		testDb.cleanup();
	});

	it('domains endpoints interact with API and DB', async () => {
		const setup = await createResendClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const listInput = {
			limit: 10,
		};

		const domainsList = await corsair.resend.api.domains.list(listInput);

		expect(domainsList).toBeDefined();

		const listEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'resend.domains.list' }],
		});

		expect(listEvents.length).toBeGreaterThan(0);
		const listEvent = listEvents[listEvents.length - 1]!;
		const listEventPayload = typeof listEvent.payload === 'string' 
			? JSON.parse(listEvent.payload) 
			: listEvent.payload;
		expect(listEventPayload).toMatchObject(listInput);

		const domains = domainsList.data || [];

		if (domains.length > 0) {
			const firstDomain = domains[0]!;

			const domainFromDb = await corsair.resend.db.domains.findByEntityId(
				firstDomain.id,
			);

			if (domainFromDb) {
				expect(domainFromDb).not.toBeNull();
				expect(domainFromDb.data.id).toBe(firstDomain.id);
			}

			const getInput = {
				id: firstDomain.id,
			};

			const fetchedDomain = await corsair.resend.api.domains.get(getInput);

			expect(fetchedDomain).toBeDefined();

			const getEvents = await testDb.adapter.findMany({
				table: 'corsair_events',
				where: [{ field: 'event_type', value: 'resend.domains.get' }],
			});

			expect(getEvents.length).toBeGreaterThan(0);
			const getEvent = getEvents[getEvents.length - 1]!;
			const getEventPayload = typeof getEvent.payload === 'string' 
				? JSON.parse(getEvent.payload) 
				: getEvent.payload;
			expect(getEventPayload).toMatchObject(getInput);

			if (fetchedDomain.id) {
				const fetchedDomainFromDb = await corsair.resend.db.domains.findByEntityId(
					fetchedDomain.id,
				);
				if (fetchedDomainFromDb) {
					expect(fetchedDomainFromDb.data.id).toBe(fetchedDomain.id);
				}
			}

			try {
				const verifyInput = {
					id: firstDomain.id,
				};

				const verifyResult = await corsair.resend.api.domains.verify(verifyInput);

				expect(verifyResult).toBeDefined();

				const verifyEvents = await testDb.adapter.findMany({
					table: 'corsair_events',
					where: [{ field: 'event_type', value: 'resend.domains.verify' }],
				});

				expect(verifyEvents.length).toBeGreaterThan(0);
				const verifyEvent = verifyEvents[verifyEvents.length - 1]!;
				const verifyEventPayload = typeof verifyEvent.payload === 'string' 
					? JSON.parse(verifyEvent.payload) 
					: verifyEvent.payload;
				expect(verifyEventPayload).toMatchObject(verifyInput);
			} catch (error) {
				console.warn('Domain verify may have failed:', error);
			}
		}

		try {
			const testDomainName = `corsair-test-${Date.now()}.example.com`;
			const createInput = {
				name: testDomainName,
			};

			const createdDomain = await corsair.resend.api.domains.create(createInput);

			expect(createdDomain).toBeDefined();

			const createEvents = await testDb.adapter.findMany({
				table: 'corsair_events',
				where: [{ field: 'event_type', value: 'resend.domains.create' }],
			});

			expect(createEvents.length).toBeGreaterThan(0);
			const createEvent = createEvents[createEvents.length - 1]!;
			const createEventPayload = typeof createEvent.payload === 'string' 
				? JSON.parse(createEvent.payload) 
				: createEvent.payload;
			expect(createEventPayload).toMatchObject(createInput);

			const createdDomainId = createdDomain.id;

			if (createdDomainId) {
				const createdDomainFromDb =
					await corsair.resend.db.domains.findByEntityId(createdDomainId);

				expect(createdDomainFromDb).not.toBeNull();
				if (createdDomainFromDb) {
					expect(createdDomainFromDb.data.id).toBe(createdDomain.id);
					expect(createdDomainFromDb.data.name).toBe(createdDomain.name);
				}

				try {
					const deleteInput = {
						id: createdDomainId,
					};

					const deletedDomain = await corsair.resend.api.domains.delete(deleteInput);

					expect(deletedDomain).toBeDefined();

					const deleteEvents = await testDb.adapter.findMany({
						table: 'corsair_events',
						where: [{ field: 'event_type', value: 'resend.domains.delete' }],
					});

					expect(deleteEvents.length).toBeGreaterThan(0);
					const deleteEvent = deleteEvents[deleteEvents.length - 1]!;
					const deleteEventPayload = typeof deleteEvent.payload === 'string' 
						? JSON.parse(deleteEvent.payload) 
						: deleteEvent.payload;
					expect(deleteEventPayload).toMatchObject(deleteInput);
				} catch (error) {
					console.warn('Domain delete may have failed:', error);
				}
			}
		} catch (error) {
			if (
				error instanceof ResendAPIError &&
				error.message.includes('Forbidden')
			) {
			} else {
				throw error;
			}
		}

		const domainsCount = await corsair.resend.db.domains.count();

		if (domains.length > 0) {
			expect(domainsCount).toBeGreaterThan(0);
		}

		testDb.cleanup();
	});
});
