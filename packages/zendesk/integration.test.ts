import 'dotenv/config';
import { createCorsair } from 'corsair/core';
import { request } from 'corsair/http';
import { createCorsairOrm } from 'corsair/orm';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { zendesk } from './index';

jest.mock('corsair/http', () => ({
	request: jest.fn(),
}));

const mockedRequest = request as jest.MockedFunction<typeof request>;

async function createZendeskClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'zendesk');

	const corsair = createCorsair({
		plugins: [
			zendesk({
				authType: 'api_key',
				key: 'test_token',
				subdomain: 'test_subdomain',
			}),
		],
		database: testDb.db,
		kek: 'test_kek',
	});

	return { corsair, testDb };
}

describe('Zendesk plugin integration', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('tickets endpoints interact with API and DB', async () => {
		const { corsair, testDb } = await createZendeskClient();

		const mockTicket = {
			id: 101,
			subject: 'Integration Test Ticket',
			description: 'Description here',
			status: 'new',
			priority: 'high',
			created_at: '2026-05-22T12:00:00Z',
			updated_at: '2026-05-22T12:00:00Z',
		};

		// 1. Test Create Ticket
		mockedRequest.mockResolvedValueOnce({ ticket: mockTicket });

		const created = await corsair.zendesk.api.tickets.create({
			subject: 'Integration Test Ticket',
			description: 'Description here',
			status: 'new',
			priority: 'high',
		});

		expect(created).toBeDefined();
		expect(created.ticket.id).toBe(101);

		// Verify event is logged
		const orm = createCorsairOrm(testDb.database);
		const createEvents = await orm.events.findMany({
			where: { event_type: 'zendesk.tickets.create' },
		});
		expect(createEvents.length).toBeGreaterThan(0);

		// Verify database entity is populated
		const ticketFromDb = await corsair.zendesk.db.tickets.findByEntityId('101');
		expect(ticketFromDb).not.toBeNull();
		expect(ticketFromDb?.data.id).toBe(101);
		expect(ticketFromDb?.data.subject).toBe('Integration Test Ticket');

		// 2. Test Get Ticket
		mockedRequest.mockResolvedValueOnce({ ticket: mockTicket });

		const fetched = await corsair.zendesk.api.tickets.get({ id: 101 });
		expect(fetched.ticket.id).toBe(101);

		const getEvents = await orm.events.findMany({
			where: { event_type: 'zendesk.tickets.get' },
		});
		expect(getEvents.length).toBeGreaterThan(0);

		// 3. Test Update Ticket
		const updatedTicket = {
			...mockTicket,
			subject: 'Updated Integration Ticket',
		};
		mockedRequest.mockResolvedValueOnce({ ticket: updatedTicket });

		const updated = await corsair.zendesk.api.tickets.update({
			id: 101,
			subject: 'Updated Integration Ticket',
		});
		expect(updated.ticket.subject).toBe('Updated Integration Ticket');

		const ticketFromDbAfterUpdate =
			await corsair.zendesk.db.tickets.findByEntityId('101');
		expect(ticketFromDbAfterUpdate?.data.subject).toBe(
			'Updated Integration Ticket',
		);

		// 4. Test List Tickets
		mockedRequest.mockResolvedValueOnce({
			tickets: [updatedTicket],
			count: 1,
		});

		const listed = await corsair.zendesk.api.tickets.list({});
		expect(listed.tickets).toHaveLength(1);
		expect(listed.tickets[0]?.id).toBe(101);

		// 5. Test Delete Ticket
		mockedRequest.mockResolvedValueOnce({ id: 101 });

		const deleted = await corsair.zendesk.api.tickets.delete({ id: 101 });
		expect(deleted.id).toBe(101);

		testDb.cleanup();
	});

	it('users endpoints interact with API and DB', async () => {
		const { corsair, testDb } = await createZendeskClient();

		const mockUser = {
			id: 201,
			name: 'Alice Smith',
			email: 'alice@example.com',
			role: 'agent',
			active: true,
			created_at: '2026-05-22T12:00:00Z',
			updated_at: '2026-05-22T12:00:00Z',
		};

		// 1. Test Create User
		mockedRequest.mockResolvedValueOnce({ user: mockUser });

		const created = await corsair.zendesk.api.users.create({
			name: 'Alice Smith',
			email: 'alice@example.com',
			role: 'agent',
		});

		expect(created.user.id).toBe(201);

		// Verify event is logged
		const orm = createCorsairOrm(testDb.database);
		const createEvents = await orm.events.findMany({
			where: { event_type: 'zendesk.users.create' },
		});
		expect(createEvents.length).toBeGreaterThan(0);

		// Verify database entity is populated
		const userFromDb = await corsair.zendesk.db.users.findByEntityId('201');
		expect(userFromDb).not.toBeNull();
		expect(userFromDb?.data.id).toBe(201);
		expect(userFromDb?.data.name).toBe('Alice Smith');

		// 2. Test Get User
		mockedRequest.mockResolvedValueOnce({ user: mockUser });

		const fetched = await corsair.zendesk.api.users.get({ id: 201 });
		expect(fetched.user.id).toBe(201);

		// 3. Test Update User
		const updatedUser = { ...mockUser, name: 'Alice Jones' };
		mockedRequest.mockResolvedValueOnce({ user: updatedUser });

		const updated = await corsair.zendesk.api.users.update({
			id: 201,
			name: 'Alice Jones',
		});
		expect(updated.user.name).toBe('Alice Jones');

		const userFromDbAfterUpdate =
			await corsair.zendesk.db.users.findByEntityId('201');
		expect(userFromDbAfterUpdate?.data.name).toBe('Alice Jones');

		// 4. Test List Users
		mockedRequest.mockResolvedValueOnce({
			users: [updatedUser],
			count: 1,
		});

		const listed = await corsair.zendesk.api.users.list({});
		expect(listed.users).toHaveLength(1);
		expect(listed.users[0]?.id).toBe(201);

		// 5. Test Delete User
		mockedRequest.mockResolvedValueOnce({ id: 201 });

		const deleted = await corsair.zendesk.api.users.delete({ id: 201 });
		expect(deleted.id).toBe(201);

		testDb.cleanup();
	});

	it('comments endpoints interact with API and DB', async () => {
		const { corsair, testDb } = await createZendeskClient();

		const mockComment = {
			id: 301,
			body: 'This is a ticket comment',
			public: true,
			author_id: 201,
			created_at: '2026-05-22T12:00:00Z',
		};

		mockedRequest.mockResolvedValueOnce({
			comments: [mockComment],
			count: 1,
		});

		const listed = await corsair.zendesk.api.comments.list({ ticket_id: 101 });
		expect(listed.comments).toHaveLength(1);
		expect(listed.comments[0]?.id).toBe(301);

		// Verify event is logged
		const orm = createCorsairOrm(testDb.database);
		const listEvents = await orm.events.findMany({
			where: { event_type: 'zendesk.comments.list' },
		});
		expect(listEvents.length).toBeGreaterThan(0);

		// Verify database entity is populated
		const commentFromDb =
			await corsair.zendesk.db.comments.findByEntityId('301');
		expect(commentFromDb).not.toBeNull();
		expect(commentFromDb?.data.id).toBe(301);
		expect(commentFromDb?.data.body).toBe('This is a ticket comment');

		testDb.cleanup();
	});
});
