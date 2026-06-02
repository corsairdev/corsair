import 'dotenv/config';
import { createCorsair } from 'corsair/core';
import { createCorsairOrm } from 'corsair/orm';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { zendesk } from './index';

async function createZendeskClient() {
	const apiKey = process.env.ZENDESK_API_KEY;
	const subdomain = process.env.ZENDESK_SUBDOMAIN;
	if (!apiKey || !subdomain) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'zendesk');

	const corsair = createCorsair({
		plugins: [
			zendesk({
				authType: 'api_key',
				key: apiKey,
				subdomain,
			}),
		],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK!,
	});

	return { corsair, testDb };
}

describe('Zendesk plugin integration', () => {
	it('tickets endpoints interact with API and DB', async () => {
		const setup = await createZendeskClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;
		const orm = createCorsairOrm(testDb.database);

		const createInput = {
			subject: `Corsair integration test ${Date.now()}`,
			comment: {
				body: 'Integration test ticket',
			},
			status: 'new',
			priority: 'normal',
		};

		const created = await corsair.zendesk.api.tickets.create(createInput);

		expect(created).toBeDefined();
		expect(created.ticket.id).toBeDefined();

		const ticketId = created.ticket.id!;

		const createEvents = await orm.events.findMany({
			where: { event_type: 'zendesk.tickets.create' },
		});
		expect(createEvents.length).toBeGreaterThan(0);

		const ticketFromDb = await corsair.zendesk.db.tickets.findByEntityId(
			String(ticketId),
		);
		expect(ticketFromDb).not.toBeNull();
		expect(ticketFromDb?.data.id).toBe(ticketId);
		expect(ticketFromDb?.data.subject).toBe(createInput.subject);

		const getInput = { id: ticketId };
		const fetched = await corsair.zendesk.api.tickets.get(getInput);
		expect(fetched.ticket.id).toBe(ticketId);

		const getEvents = await orm.events.findMany({
			where: { event_type: 'zendesk.tickets.get' },
		});
		expect(getEvents.length).toBeGreaterThan(0);

		const updateInput = {
			id: ticketId,
			subject: `Updated integration ticket ${Date.now()}`,
		};
		const updated = await corsair.zendesk.api.tickets.update(updateInput);
		expect(updated.ticket.subject).toBe(updateInput.subject);

		const ticketFromDbAfterUpdate =
			await corsair.zendesk.db.tickets.findByEntityId(String(ticketId));
		expect(ticketFromDbAfterUpdate?.data.subject).toBe(updateInput.subject);

		const listInput = { per_page: 10 };
		const listed = await corsair.zendesk.api.tickets.list(listInput);
		expect(listed.tickets.length).toBeGreaterThan(0);

		const deleteInput = { id: ticketId };
		const deleted = await corsair.zendesk.api.tickets.delete(deleteInput);
		expect(deleted.id).toBe(ticketId);

		testDb.cleanup();
	});

	it('users endpoints interact with API and DB', async () => {
		const setup = await createZendeskClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;
		const orm = createCorsairOrm(testDb.database);

		const createInput = {
			name: 'Corsair Integration User',
			email: `corsair-integration-${Date.now()}@example.com`,
			role: 'end-user',
		};

		const created = await corsair.zendesk.api.users.create(createInput);

		expect(created.user.id).toBeDefined();
		const userId = created.user.id!;

		const createEvents = await orm.events.findMany({
			where: { event_type: 'zendesk.users.create' },
		});
		expect(createEvents.length).toBeGreaterThan(0);

		const userFromDb = await corsair.zendesk.db.users.findByEntityId(
			String(userId),
		);
		expect(userFromDb).not.toBeNull();
		expect(userFromDb?.data.id).toBe(userId);
		expect(userFromDb?.data.name).toBe(createInput.name);

		const getInput = { id: userId };
		const fetched = await corsair.zendesk.api.users.get(getInput);
		expect(fetched.user.id).toBe(userId);

		const updateInput = {
			id: userId,
			name: 'Corsair Updated Integration User',
		};
		const updated = await corsair.zendesk.api.users.update(updateInput);
		expect(updated.user.name).toBe(updateInput.name);

		const userFromDbAfterUpdate = await corsair.zendesk.db.users.findByEntityId(
			String(userId),
		);
		expect(userFromDbAfterUpdate?.data.name).toBe(updateInput.name);

		const listInput = { per_page: 10 };
		const listed = await corsair.zendesk.api.users.list(listInput);
		expect(listed.users.length).toBeGreaterThan(0);

		const deleteInput = { id: userId };
		const deleted = await corsair.zendesk.api.users.delete(deleteInput);
		expect(deleted.id).toBe(userId);

		testDb.cleanup();
	});

	it('comments endpoints interact with API and DB', async () => {
		const setup = await createZendeskClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;
		const orm = createCorsairOrm(testDb.database);

		const createdTicket = await corsair.zendesk.api.tickets.create({
			subject: `Corsair comments integration ${Date.now()}`,
			comment: {
				body: 'Comment for integration test',
			},
		});
		const ticketId = createdTicket.ticket.id!;

		const listInput = { ticket_id: ticketId };
		const listed = await corsair.zendesk.api.comments.list(listInput);
		expect(listed.comments.length).toBeGreaterThan(0);

		const listEvents = await orm.events.findMany({
			where: { event_type: 'zendesk.comments.list' },
		});
		expect(listEvents.length).toBeGreaterThan(0);

		const commentId = listed.comments[0]?.id;
		if (commentId) {
			const commentFromDb = await corsair.zendesk.db.comments.findByEntityId(
				String(commentId),
			);
			expect(commentFromDb).not.toBeNull();
			expect(commentFromDb?.data.id).toBe(commentId);
		}

		await corsair.zendesk.api.tickets.delete({ id: ticketId });

		testDb.cleanup();
	});
});
