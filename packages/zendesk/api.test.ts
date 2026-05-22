import 'dotenv/config';
import { request } from 'corsair/http';
import { makeZendeskRequest } from './client';
import type {
	CommentsListResponse,
	TicketsCreateResponse,
	TicketsDeleteResponse,
	TicketsGetResponse,
	TicketsListResponse,
	TicketsUpdateResponse,
	UsersCreateResponse,
	UsersDeleteResponse,
	UsersGetResponse,
	UsersListResponse,
	UsersUpdateResponse,
} from './endpoints/types';
import { ZendeskEndpointOutputSchemas } from './endpoints/types';

jest.mock('corsair/http', () => ({
	request: jest.fn(),
}));

const mockedRequest = request as jest.MockedFunction<typeof request>;

describe('Zendesk API Type Tests', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('makeZendeskRequest client', () => {
		it('sends the correct headers and constructs the correct URL', async () => {
			mockedRequest.mockResolvedValueOnce({
				ticket: { id: 123, subject: 'Test' },
			});

			const response = await makeZendeskRequest<TicketsGetResponse>(
				'tickets/123.json',
				'user@domain.com/token:myapikey',
				'mysubdomain',
				{ method: 'GET' },
			);

			expect(mockedRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					BASE: 'https://mysubdomain.zendesk.com/api/v2',
					HEADERS: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
						Authorization: `Basic ${Buffer.from('user@domain.com/token:myapikey').toString('base64')}`,
					},
				}),
				expect.objectContaining({
					method: 'GET',
					url: 'tickets/123.json',
				}),
			);
			expect(response).toEqual({ ticket: { id: 123, subject: 'Test' } });
		});
	});

	describe('tickets', () => {
		it('ticketsCreate returns correct parsed structure', async () => {
			const mockResponse: TicketsCreateResponse = {
				ticket: {
					id: 123,
					subject: 'Test Ticket',
					description: 'Test Description',
					status: 'new',
					priority: 'normal',
					created_at: '2026-05-22T00:00:00Z',
					updated_at: '2026-05-22T00:00:00Z',
				},
			};
			mockedRequest.mockResolvedValueOnce(mockResponse);

			const response = await makeZendeskRequest<TicketsCreateResponse>(
				'tickets.json',
				'key',
				'subdomain',
				{ method: 'POST', body: { ticket: { subject: 'Test Ticket' } } },
			);

			const parsed = ZendeskEndpointOutputSchemas.ticketsCreate.parse(response);
			expect(parsed.ticket.id).toBe(123);
			expect(parsed.ticket.subject).toBe('Test Ticket');
		});

		it('ticketsGet returns correct parsed structure', async () => {
			const mockResponse: TicketsGetResponse = {
				ticket: {
					id: 123,
					subject: 'Test Ticket',
					description: 'Test Description',
					status: 'new',
					created_at: '2026-05-22T00:00:00Z',
				},
			};
			mockedRequest.mockResolvedValueOnce(mockResponse);

			const response = await makeZendeskRequest<TicketsGetResponse>(
				'tickets/123.json',
				'key',
				'subdomain',
				{ method: 'GET' },
			);

			const parsed = ZendeskEndpointOutputSchemas.ticketsGet.parse(response);
			expect(parsed.ticket.id).toBe(123);
		});

		it('ticketsUpdate returns correct parsed structure', async () => {
			const mockResponse: TicketsUpdateResponse = {
				ticket: {
					id: 123,
					subject: 'Updated Ticket',
					status: 'open',
				},
			};
			mockedRequest.mockResolvedValueOnce(mockResponse);

			const response = await makeZendeskRequest<TicketsUpdateResponse>(
				'tickets/123.json',
				'key',
				'subdomain',
				{ method: 'PUT', body: { ticket: { status: 'open' } } },
			);

			const parsed = ZendeskEndpointOutputSchemas.ticketsUpdate.parse(response);
			expect(parsed.ticket.status).toBe('open');
		});

		it('ticketsDelete returns correct parsed structure', async () => {
			const mockResponse: TicketsDeleteResponse = {
				id: 123,
			};
			mockedRequest.mockResolvedValueOnce(mockResponse);

			const response = await makeZendeskRequest<TicketsDeleteResponse>(
				'tickets/123.json',
				'key',
				'subdomain',
				{ method: 'DELETE' },
			);

			const parsed = ZendeskEndpointOutputSchemas.ticketsDelete.parse(response);
			expect(parsed.id).toBe(123);
		});

		it('ticketsList returns correct parsed structure', async () => {
			const mockResponse: TicketsListResponse = {
				tickets: [
					{
						id: 123,
						subject: 'Ticket 1',
					},
					{
						id: 124,
						subject: 'Ticket 2',
					},
				],
				count: 2,
			};
			mockedRequest.mockResolvedValueOnce(mockResponse);

			const response = await makeZendeskRequest<TicketsListResponse>(
				'tickets.json',
				'key',
				'subdomain',
				{ method: 'GET' },
			);

			const parsed = ZendeskEndpointOutputSchemas.ticketsList.parse(response);
			expect(parsed.tickets).toHaveLength(2);
			expect(parsed.count).toBe(2);
		});
	});

	describe('users', () => {
		it('usersCreate returns correct parsed structure', async () => {
			const mockResponse: UsersCreateResponse = {
				user: {
					id: 456,
					name: 'Test User',
					email: 'test@user.com',
					role: 'end-user',
					active: true,
				},
			};
			mockedRequest.mockResolvedValueOnce(mockResponse);

			const response = await makeZendeskRequest<UsersCreateResponse>(
				'users.json',
				'key',
				'subdomain',
				{
					method: 'POST',
					body: { user: { name: 'Test User', email: 'test@user.com' } },
				},
			);

			const parsed = ZendeskEndpointOutputSchemas.usersCreate.parse(response);
			expect(parsed.user.id).toBe(456);
			expect(parsed.user.name).toBe('Test User');
		});

		it('usersGet returns correct parsed structure', async () => {
			const mockResponse: UsersGetResponse = {
				user: {
					id: 456,
					name: 'Test User',
					role: 'agent',
				},
			};
			mockedRequest.mockResolvedValueOnce(mockResponse);

			const response = await makeZendeskRequest<UsersGetResponse>(
				'users/456.json',
				'key',
				'subdomain',
				{ method: 'GET' },
			);

			const parsed = ZendeskEndpointOutputSchemas.usersGet.parse(response);
			expect(parsed.user.id).toBe(456);
		});

		it('usersUpdate returns correct parsed structure', async () => {
			const mockResponse: UsersUpdateResponse = {
				user: {
					id: 456,
					name: 'Updated User',
				},
			};
			mockedRequest.mockResolvedValueOnce(mockResponse);

			const response = await makeZendeskRequest<UsersUpdateResponse>(
				'users/456.json',
				'key',
				'subdomain',
				{ method: 'PUT', body: { user: { name: 'Updated User' } } },
			);

			const parsed = ZendeskEndpointOutputSchemas.usersUpdate.parse(response);
			expect(parsed.user.name).toBe('Updated User');
		});

		it('usersDelete returns correct parsed structure', async () => {
			const mockResponse: UsersDeleteResponse = {
				id: 456,
			};
			mockedRequest.mockResolvedValueOnce(mockResponse);

			const response = await makeZendeskRequest<UsersDeleteResponse>(
				'users/456.json',
				'key',
				'subdomain',
				{ method: 'DELETE' },
			);

			const parsed = ZendeskEndpointOutputSchemas.usersDelete.parse(response);
			expect(parsed.id).toBe(456);
		});

		it('usersList returns correct parsed structure', async () => {
			const mockResponse: UsersListResponse = {
				users: [
					{
						id: 456,
						name: 'User 1',
					},
					{
						id: 457,
						name: 'User 2',
					},
				],
				count: 2,
			};
			mockedRequest.mockResolvedValueOnce(mockResponse);

			const response = await makeZendeskRequest<UsersListResponse>(
				'users.json',
				'key',
				'subdomain',
				{ method: 'GET' },
			);

			const parsed = ZendeskEndpointOutputSchemas.usersList.parse(response);
			expect(parsed.users).toHaveLength(2);
		});
	});

	describe('comments', () => {
		it('commentsList returns correct parsed structure', async () => {
			const mockResponse: CommentsListResponse = {
				comments: [
					{
						id: 789,
						body: 'Comment 1',
						public: true,
						author_id: 456,
						created_at: '2026-05-22T00:00:00Z',
					},
				],
				count: 1,
			};
			mockedRequest.mockResolvedValueOnce(mockResponse);

			const response = await makeZendeskRequest<CommentsListResponse>(
				'tickets/123/comments.json',
				'key',
				'subdomain',
				{ method: 'GET' },
			);

			const parsed = ZendeskEndpointOutputSchemas.commentsList.parse(response);
			expect(parsed.comments).toHaveLength(1);
			expect(parsed.comments[0]!.id).toBe(789);
		});
	});
});
