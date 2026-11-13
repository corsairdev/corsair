import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	Boards,
	Companies,
	Feedback,
	Messages,
	Sessions,
	Teams,
	Tickets,
	Users,
} from './endpoints';
import type { GleapContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeGleapRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeGleapRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

function buildCtx(): GleapContext {
	const ctx: GleapContext = {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-api-key',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-api-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
	return ctx;
}

const ctx = buildCtx();

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

describe('Tickets endpoints', () => {
	it('tickets.list queries tickets and logs event', async () => {
		const mockTickets = [
			{ id: 't_1', title: 'Bug 1', status: 'OPEN' },
			{ id: 't_2', title: 'Bug 2', status: 'CLOSED' },
		];
		mockedRequest.mockResolvedValue(mockTickets);

		const result = await Tickets.list(ctx, {
			type: 'BUG',
			status: 'OPEN',
			limit: 10,
		});

		expect(result).toEqual(mockTickets);
		expect(mockedRequest).toHaveBeenCalledWith('/tickets', 'test-api-key', {
			method: 'GET',
			query: expect.objectContaining({
				type: 'BUG',
				status: 'OPEN',
				limit: 10,
			}),
			projectId: undefined,
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'gleap.tickets.list',
			{ count: 2 },
			'completed',
		);
	});

	it('tickets.get retrieves ticket by encoded ID', async () => {
		const mockTicket = { id: 't_1/special', title: 'Login issue' };
		mockedRequest.mockResolvedValue(mockTicket);

		const result = await Tickets.get(ctx, { ticketId: 't_1/special' });

		expect(result).toEqual(mockTicket);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/tickets/t_1%2Fspecial',
			'test-api-key',
			{
				method: 'GET',
				projectId: undefined,
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'gleap.tickets.get',
			{ ticketId: 't_1/special' },
			'completed',
		);
	});

	it('tickets.create creates ticket and sends body payload', async () => {
		const mockCreated = { id: 't_new', title: 'New ticket' };
		mockedRequest.mockResolvedValue(mockCreated);

		const result = await Tickets.create(ctx, {
			title: 'New ticket',
			type: 'BUG',
			priority: 'HIGH',
		});

		expect(result).toEqual(mockCreated);
		expect(mockedRequest).toHaveBeenCalledWith('/tickets', 'test-api-key', {
			method: 'POST',
			body: { title: 'New ticket', type: 'BUG', priority: 'HIGH' },
			projectId: undefined,
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'gleap.tickets.create',
			{ created: true },
			'completed',
		);
	});

	it('tickets.update updates ticket by ID', async () => {
		const mockUpdated = { id: 't_1', status: 'DONE' };
		mockedRequest.mockResolvedValue(mockUpdated);

		const result = await Tickets.update(ctx, {
			ticketId: 't_1',
			status: 'DONE',
		});

		expect(result).toEqual(mockUpdated);
		expect(mockedRequest).toHaveBeenCalledWith('/tickets/t_1', 'test-api-key', {
			method: 'PUT',
			body: { status: 'DONE' },
			projectId: undefined,
		});
	});

	it('tickets.delete deletes ticket by ID', async () => {
		mockedRequest.mockResolvedValue({ success: true });

		const result = await Tickets.del(ctx, { ticketId: 't_1' });

		expect(result).toEqual({ success: true });
		expect(mockedRequest).toHaveBeenCalledWith('/tickets/t_1', 'test-api-key', {
			method: 'DELETE',
			projectId: undefined,
		});
	});

	it('tickets.search performs full-text query', async () => {
		const mockHits = { hits: [{ ticket: { id: 't_1' }, score: 0.95 }] };
		mockedRequest.mockResolvedValue(mockHits);

		const result = await Tickets.search(ctx, { searchTerm: 'login' });

		expect(result).toEqual(mockHits);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/tickets/search',
			'test-api-key',
			{
				method: 'GET',
				query: expect.objectContaining({ searchTerm: 'login' }),
				projectId: undefined,
			},
		);
	});

	it('tickets.counts fetches ticket counts', async () => {
		const mockCounts = { OPEN: 12, DONE: 50 };
		mockedRequest.mockResolvedValue(mockCounts);

		const result = await Tickets.counts(ctx, {});

		expect(result).toEqual(mockCounts);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/tickets/ticketscount',
			'test-api-key',
			{
				method: 'GET',
				projectId: undefined,
			},
		);
	});

	it('tickets.get rejects empty ID before network call', async () => {
		await expect(Tickets.get(ctx, { ticketId: '' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('Messages endpoints', () => {
	it('messages.list queries messages in a ticket', async () => {
		const mockMessages = [{ id: 'm_1', ticket: 't_1', comment: 'Hi' }];
		mockedRequest.mockResolvedValue(mockMessages);

		const result = await Messages.list(ctx, { ticket: 't_1' });

		expect(result).toEqual(mockMessages);
		expect(mockedRequest).toHaveBeenCalledWith('/messages', 'test-api-key', {
			method: 'GET',
			query: expect.objectContaining({ ticket: 't_1' }),
			projectId: undefined,
		});
	});

	it('messages.create adds message to ticket', async () => {
		const mockMsg = { id: 'm_1', ticket: 't_1', comment: 'Hello' };
		mockedRequest.mockResolvedValue(mockMsg);

		const result = await Messages.create(ctx, {
			ticket: 't_1',
			content: 'Hello',
			isNote: true,
		});

		expect(result).toEqual(mockMsg);
		expect(mockedRequest).toHaveBeenCalledWith('/messages', 'test-api-key', {
			method: 'POST',
			body: { ticket: 't_1', content: 'Hello', isNote: true },
			projectId: undefined,
		});
	});

	it('messages.update updates message content', async () => {
		const mockUpdated = { id: 'm_1', comment: 'Edited' };
		mockedRequest.mockResolvedValue(mockUpdated);

		const result = await Messages.update(ctx, {
			messageId: 'm_1',
			content: 'Edited',
		});

		expect(result).toEqual(mockUpdated);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/messages/m_1',
			'test-api-key',
			{
				method: 'PUT',
				body: { content: 'Edited' },
				projectId: undefined,
			},
		);
	});

	it('messages.delete deletes message by ID', async () => {
		mockedRequest.mockResolvedValue({ success: true });

		const result = await Messages.del(ctx, { messageId: 'm_1' });

		expect(result).toEqual({ success: true });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/messages/m_1',
			'test-api-key',
			{
				method: 'DELETE',
				projectId: undefined,
			},
		);
	});

	it('messages.getThread and createThread manage message threads', async () => {
		const mockThread = [{ id: 'm_reply_1', comment: 'Reply' }];
		mockedRequest.mockResolvedValue(mockThread);

		const listRes = await Messages.getThread(ctx, { messageId: 'm_1' });
		expect(listRes).toEqual(mockThread);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/messages/m_1/thread',
			'test-api-key',
			{
				method: 'GET',
				projectId: undefined,
			},
		);

		const mockReply = { id: 'm_reply_2', comment: 'Another reply' };
		mockedRequest.mockResolvedValue(mockReply);

		const createRes = await Messages.createThread(ctx, {
			messageId: 'm_1',
			content: 'Another reply',
		});
		expect(createRes).toEqual(mockReply);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/messages/m_1/thread',
			'test-api-key',
			{
				method: 'POST',
				body: { content: 'Another reply' },
				projectId: undefined,
			},
		);
	});
});

describe('Sessions endpoints', () => {
	it('sessions.list lists contact sessions', async () => {
		const mockSessions = [{ id: 's_1', name: 'Alice' }];
		mockedRequest.mockResolvedValue(mockSessions);

		const result = await Sessions.list(ctx, { limit: 10 });
		expect(result).toEqual(mockSessions);
		expect(mockedRequest).toHaveBeenCalledWith('/sessions', 'test-api-key', {
			method: 'GET',
			query: expect.objectContaining({ limit: 10 }),
			projectId: undefined,
		});
	});

	it('sessions.get retrieves session by ID', async () => {
		const mockSession = { id: 's_1', name: 'Alice' };
		mockedRequest.mockResolvedValue(mockSession);

		const result = await Sessions.get(ctx, { sessionId: 's_1' });
		expect(result).toEqual(mockSession);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/sessions/s_1',
			'test-api-key',
			{
				method: 'GET',
				projectId: undefined,
			},
		);
	});

	it('sessions.getByUserId retrieves session by custom user ID', async () => {
		const mockSession = { id: 's_1', userId: 'custom_usr' };
		mockedRequest.mockResolvedValue(mockSession);

		const result = await Sessions.getByUserId(ctx, { userId: 'custom_usr' });
		expect(result).toEqual(mockSession);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/sessions/by-user-id/custom_usr',
			'test-api-key',
			{
				method: 'GET',
				projectId: undefined,
			},
		);
	});

	it('sessions.create creates new contact session', async () => {
		const mockCreated = { id: 's_1', userId: 'user_1', name: 'Bob' };
		mockedRequest.mockResolvedValue(mockCreated);

		const result = await Sessions.create(ctx, {
			userId: 'user_1',
			name: 'Bob',
			email: 'bob@example.com',
		});
		expect(result).toEqual(mockCreated);
		expect(mockedRequest).toHaveBeenCalledWith('/sessions', 'test-api-key', {
			method: 'POST',
			body: { userId: 'user_1', name: 'Bob', email: 'bob@example.com' },
			projectId: undefined,
		});
	});

	it('sessions.update updates contact session', async () => {
		const mockUpdated = { id: 's_1', name: 'Bobby' };
		mockedRequest.mockResolvedValue(mockUpdated);

		const result = await Sessions.update(ctx, {
			sessionId: 's_1',
			name: 'Bobby',
		});
		expect(result).toEqual(mockUpdated);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/sessions/s_1',
			'test-api-key',
			{
				method: 'PUT',
				body: { name: 'Bobby' },
				projectId: undefined,
			},
		);
	});

	it('sessions.delete deletes contact session', async () => {
		mockedRequest.mockResolvedValue({ success: true });

		const result = await Sessions.del(ctx, { sessionId: 's_1' });
		expect(result).toEqual({ success: true });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/sessions/s_1',
			'test-api-key',
			{
				method: 'DELETE',
				projectId: undefined,
			},
		);
	});

	it('sessions.search searches sessions', async () => {
		const mockResults = [{ id: 's_1', name: 'Bob' }];
		mockedRequest.mockResolvedValue(mockResults);

		const result = await Sessions.search(ctx, { query: 'Bob' });
		expect(result).toEqual(mockResults);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/sessions/search',
			'test-api-key',
			{
				method: 'GET',
				query: expect.objectContaining({ query: 'Bob' }),
				projectId: undefined,
			},
		);
	});

	it('sessions.activities retrieves session timeline activities', async () => {
		const mockActivities = [{ id: 'act_1', type: 'pageview' }];
		mockedRequest.mockResolvedValue(mockActivities);

		const result = await Sessions.activities(ctx, { sessionId: 's_1' });
		expect(result).toEqual(mockActivities);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/sessions/s_1/activities',
			'test-api-key',
			{
				method: 'GET',
				projectId: undefined,
			},
		);
	});
});

describe('Users endpoints', () => {
	it('users.getMe fetches current user', async () => {
		const mockUser = { id: 'u_me', name: 'Admin', role: 'ADMIN' };
		mockedRequest.mockResolvedValue(mockUser);

		const result = await Users.getMe(ctx, {});
		expect(result).toEqual(mockUser);
		expect(mockedRequest).toHaveBeenCalledWith('/users/me', 'test-api-key', {
			method: 'GET',
		});
	});

	it('users.list lists project members', async () => {
		const mockUsers = [{ id: 'u_1', name: 'Teammate' }];
		mockedRequest.mockResolvedValue(mockUsers);

		const result = await Users.list(ctx, {});
		expect(result).toEqual(mockUsers);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/projects/users',
			'test-api-key',
			{
				method: 'GET',
				projectId: undefined,
			},
		);
	});

	it('users.update updates user profile', async () => {
		const mockUpdated = { id: 'u_1', name: 'New Name' };
		mockedRequest.mockResolvedValue(mockUpdated);

		const result = await Users.update(ctx, {
			userId: 'u_1',
			name: 'New Name',
		});
		expect(result).toEqual(mockUpdated);
		expect(mockedRequest).toHaveBeenCalledWith('/users/u_1', 'test-api-key', {
			method: 'PUT',
			body: { name: 'New Name' },
		});
	});
});

describe('Feedback & Surveys endpoints', () => {
	it('feedback.rateConversation submits CSAT rating', async () => {
		mockedRequest.mockResolvedValue({ success: true });

		const result = await Feedback.rateConversation(ctx, {
			conversationId: 'conv_1',
			rating: 9,
		});
		expect(result).toEqual({ success: true });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/s2s/conversations/conv_1/rating',
			'test-api-key',
			{
				method: 'POST',
				body: { rating: 9 },
			},
		);
	});

	it('feedback.rateMessage submits message rating', async () => {
		mockedRequest.mockResolvedValue({ success: true });

		const result = await Feedback.rateMessage(ctx, {
			messageId: 'msg_1',
			rating: 'up',
		});
		expect(result).toEqual({ success: true });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/s2s/messages/msg_1/rating',
			'test-api-key',
			{
				method: 'POST',
				body: { rating: 'up' },
			},
		);
	});

	it('feedback.surveysList lists surveys', async () => {
		const mockSurveys = [{ id: 'srv_1', name: 'CSAT Survey' }];
		mockedRequest.mockResolvedValue(mockSurveys);

		const result = await Feedback.surveysList(ctx, { limit: 10 });
		expect(result).toEqual(mockSurveys);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/engagement/surveys',
			'test-api-key',
			{
				method: 'GET',
				query: expect.objectContaining({ limit: 10 }),
				projectId: undefined,
			},
		);
	});

	it('feedback.surveysGet retrieves survey by ID', async () => {
		const mockSurvey = { id: 'srv_1', name: 'Survey 1' };
		mockedRequest.mockResolvedValue(mockSurvey);

		const result = await Feedback.surveysGet(ctx, { surveyId: 'srv_1' });
		expect(result).toEqual(mockSurvey);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/engagement/surveys/srv_1',
			'test-api-key',
			{
				method: 'GET',
				projectId: undefined,
			},
		);
	});

	it('feedback.surveysResponses retrieves survey responses', async () => {
		const mockResponses = [{ id: 'resp_1', answers: { q1: 'Great' } }];
		mockedRequest.mockResolvedValue(mockResponses);

		const result = await Feedback.surveysResponses(ctx, {
			surveyId: 'srv_1',
		});
		expect(result).toEqual(mockResponses);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/engagement/surveys/srv_1/responses',
			'test-api-key',
			{
				method: 'GET',
				query: expect.objectContaining({}),
				projectId: undefined,
			},
		);
	});

	it('feedback.surveysStats retrieves survey metrics', async () => {
		const mockStats = { totals: { shown: 100, completed: 80 } };
		mockedRequest.mockResolvedValue(mockStats);

		const result = await Feedback.surveysStats(ctx, { surveyId: 'srv_1' });
		expect(result).toEqual(mockStats);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/engagement/surveys/srv_1/stats',
			'test-api-key',
			{
				method: 'GET',
				query: expect.objectContaining({}),
				projectId: undefined,
			},
		);
	});
});

describe('Teams endpoints', () => {
	it('teams.list, create, update, delete manage teams', async () => {
		const mockTeams = [{ id: 'tm_1', name: 'Support' }];
		mockedRequest.mockResolvedValue(mockTeams);

		const listRes = await Teams.list(ctx, {});
		expect(listRes).toEqual(mockTeams);
		expect(mockedRequest).toHaveBeenCalledWith('/teams', 'test-api-key', {
			method: 'GET',
			projectId: undefined,
		});

		const mockCreated = { id: 'tm_2', name: 'Success' };
		mockedRequest.mockResolvedValue(mockCreated);
		const createRes = await Teams.create(ctx, { name: 'Success' });
		expect(createRes).toEqual(mockCreated);
		expect(mockedRequest).toHaveBeenCalledWith('/teams', 'test-api-key', {
			method: 'POST',
			body: { name: 'Success' },
			projectId: undefined,
		});

		const mockUpdated = { id: 'tm_2', name: 'Customer Success' };
		mockedRequest.mockResolvedValue(mockUpdated);
		const updateRes = await Teams.update(ctx, {
			teamId: 'tm_2',
			name: 'Customer Success',
		});
		expect(updateRes).toEqual(mockUpdated);
		expect(mockedRequest).toHaveBeenCalledWith('/teams/tm_2', 'test-api-key', {
			method: 'PUT',
			body: { name: 'Customer Success' },
			projectId: undefined,
		});

		mockedRequest.mockResolvedValue({ success: true });
		const delRes = await Teams.del(ctx, { teamId: 'tm_2' });
		expect(delRes).toEqual({ success: true });
		expect(mockedRequest).toHaveBeenCalledWith('/teams/tm_2', 'test-api-key', {
			method: 'DELETE',
			projectId: undefined,
		});
	});
});

describe('Boards endpoints', () => {
	it('boards.list, create, update, delete manage boards', async () => {
		const mockBoards = [{ type: 'BUG', name: 'Bugs' }];
		mockedRequest.mockResolvedValue(mockBoards);

		const listRes = await Boards.list(ctx, {});
		expect(listRes).toEqual(mockBoards);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/ticket-types',
			'test-api-key',
			{
				method: 'GET',
				projectId: undefined,
			},
		);

		const mockCreated = { type: 'FEEDBACK', name: 'Feedback' };
		mockedRequest.mockResolvedValue(mockCreated);
		const createRes = await Boards.create(ctx, { name: 'Feedback' });
		expect(createRes).toEqual(mockCreated);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/ticket-types',
			'test-api-key',
			{
				method: 'POST',
				body: { name: 'Feedback' },
				projectId: undefined,
			},
		);

		const mockUpdated = { type: 'FEEDBACK', name: 'User Feedback' };
		mockedRequest.mockResolvedValue(mockUpdated);
		const updateRes = await Boards.update(ctx, {
			type: 'FEEDBACK',
			name: 'User Feedback',
		});
		expect(updateRes).toEqual(mockUpdated);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/ticket-types/FEEDBACK',
			'test-api-key',
			{
				method: 'PUT',
				body: { name: 'User Feedback' },
				projectId: undefined,
			},
		);

		mockedRequest.mockResolvedValue({ success: true });
		const delRes = await Boards.del(ctx, { type: 'FEEDBACK' });
		expect(delRes).toEqual({ success: true });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/ticket-types/FEEDBACK',
			'test-api-key',
			{
				method: 'DELETE',
				projectId: undefined,
			},
		);
	});
});

describe('Companies endpoints', () => {
	it('companies.list, get, createOrUpdate, delete manage companies', async () => {
		const mockCompanies = [{ companyId: 'c_1', name: 'Acme' }];
		mockedRequest.mockResolvedValue(mockCompanies);

		const listRes = await Companies.list(ctx, { limit: 10 });
		expect(listRes).toEqual(mockCompanies);
		expect(mockedRequest).toHaveBeenCalledWith('/companies', 'test-api-key', {
			method: 'GET',
			query: expect.objectContaining({ limit: 10 }),
			projectId: undefined,
		});

		const mockCompany = { companyId: 'c_1', name: 'Acme' };
		mockedRequest.mockResolvedValue(mockCompany);
		const getRes = await Companies.get(ctx, { companyId: 'c_1' });
		expect(getRes).toEqual(mockCompany);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/companies/c_1',
			'test-api-key',
			{
				method: 'GET',
				projectId: undefined,
			},
		);

		const mockUpdated = { companyId: 'c_1', name: 'Acme International' };
		mockedRequest.mockResolvedValue(mockUpdated);
		const updateRes = await Companies.createOrUpdate(ctx, {
			companyId: 'c_1',
			name: 'Acme International',
		});
		expect(updateRes).toEqual(mockUpdated);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/companies/c_1',
			'test-api-key',
			{
				method: 'PUT',
				body: { name: 'Acme International' },
				projectId: undefined,
			},
		);

		mockedRequest.mockResolvedValue({ success: true });
		const delRes = await Companies.del(ctx, { companyId: 'c_1' });
		expect(delRes).toEqual({ success: true });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/companies/c_1',
			'test-api-key',
			{
				method: 'DELETE',
				projectId: undefined,
			},
		);
	});
});
