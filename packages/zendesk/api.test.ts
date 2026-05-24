import 'dotenv/config';
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

const TEST_API_KEY = process.env.ZENDESK_API_KEY ?? '';
const TEST_SUBDOMAIN = process.env.ZENDESK_SUBDOMAIN ?? '';
const hasCredentials = TEST_API_KEY.length > 0 && TEST_SUBDOMAIN.length > 0;

describe('Zendesk API Type Tests', () => {
	describe('tickets', () => {
		it('ticketsList returns correct type', async () => {
			if (!hasCredentials) return;
			const response = await makeZendeskRequest<TicketsListResponse>(
				'tickets.json',
				TEST_API_KEY,
				TEST_SUBDOMAIN,
				{ method: 'GET', query: { per_page: 10 } },
			);

			ZendeskEndpointOutputSchemas.ticketsList.parse(response);
		});

		it('ticketsCreate returns correct type', async () => {
			if (!hasCredentials) return;
			const response = await makeZendeskRequest<TicketsCreateResponse>(
				'tickets.json',
				TEST_API_KEY,
				TEST_SUBDOMAIN,
				{
					method: 'POST',
					body: {
						ticket: {
							subject: `Corsair API test ${Date.now()}`,
							comment: {
								body: 'Test ticket created by the API test suite',
							},
						},
					},
				},
			);

			ZendeskEndpointOutputSchemas.ticketsCreate.parse(response);

			const ticketId = response.ticket.id;
			if (ticketId) {
				await makeZendeskRequest<TicketsDeleteResponse>(
					`tickets/${ticketId}.json`,
					TEST_API_KEY,
					TEST_SUBDOMAIN,
					{ method: 'DELETE' },
				);
			}
		});

		it('ticketsGet returns correct type', async () => {
			if (!hasCredentials) return;
			const created = await makeZendeskRequest<TicketsCreateResponse>(
				'tickets.json',
				TEST_API_KEY,
				TEST_SUBDOMAIN,
				{
					method: 'POST',
					body: {
						ticket: {
							subject: `Corsair API test get ${Date.now()}`,
							comment: {
								body: 'Test ticket for get endpoint',
							},
						},
					},
				},
			);
			const ticketId = created.ticket.id;

			const response = await makeZendeskRequest<TicketsGetResponse>(
				`tickets/${ticketId}.json`,
				TEST_API_KEY,
				TEST_SUBDOMAIN,
				{ method: 'GET' },
			);

			ZendeskEndpointOutputSchemas.ticketsGet.parse(response);

			await makeZendeskRequest<TicketsDeleteResponse>(
				`tickets/${ticketId}.json`,
				TEST_API_KEY,
				TEST_SUBDOMAIN,
				{ method: 'DELETE' },
			);
		});

		it('ticketsUpdate returns correct type', async () => {
			if (!hasCredentials) return;
			const created = await makeZendeskRequest<TicketsCreateResponse>(
				'tickets.json',
				TEST_API_KEY,
				TEST_SUBDOMAIN,
				{
					method: 'POST',
					body: {
						ticket: {
							subject: `Corsair API test update ${Date.now()}`,
							comment: {
								body: 'Test ticket for update endpoint',
							},
						},
					},
				},
			);
			const ticketId = created.ticket.id;

			const response = await makeZendeskRequest<TicketsUpdateResponse>(
				`tickets/${ticketId}.json`,
				TEST_API_KEY,
				TEST_SUBDOMAIN,
				{
					method: 'PUT',
					body: {
						ticket: {
							status: 'open',
						},
					},
				},
			);

			ZendeskEndpointOutputSchemas.ticketsUpdate.parse(response);

			await makeZendeskRequest<TicketsDeleteResponse>(
				`tickets/${ticketId}.json`,
				TEST_API_KEY,
				TEST_SUBDOMAIN,
				{ method: 'DELETE' },
			);
		});

		it('ticketsDelete returns correct type', async () => {
			if (!hasCredentials) return;
			const created = await makeZendeskRequest<TicketsCreateResponse>(
				'tickets.json',
				TEST_API_KEY,
				TEST_SUBDOMAIN,
				{
					method: 'POST',
					body: {
						ticket: {
							subject: `Corsair API test delete ${Date.now()}`,
							comment: {
								body: 'Test ticket for delete endpoint',
							},
						},
					},
				},
			);
			const ticketId = created.ticket.id;

			const response = await makeZendeskRequest<TicketsDeleteResponse>(
				`tickets/${ticketId}.json`,
				TEST_API_KEY,
				TEST_SUBDOMAIN,
				{ method: 'DELETE' },
			);

			ZendeskEndpointOutputSchemas.ticketsDelete.parse(response);
		});
	});

	describe('users', () => {
		it('usersList returns correct type', async () => {
			if (!hasCredentials) return;
			const response = await makeZendeskRequest<UsersListResponse>(
				'users.json',
				TEST_API_KEY,
				TEST_SUBDOMAIN,
				{ method: 'GET', query: { per_page: 10 } },
			);

			ZendeskEndpointOutputSchemas.usersList.parse(response);
		});

		it('usersCreate returns correct type', async () => {
			if (!hasCredentials) return;
			const email = `corsair-test-${Date.now()}@example.com`;
			const response = await makeZendeskRequest<UsersCreateResponse>(
				'users.json',
				TEST_API_KEY,
				TEST_SUBDOMAIN,
				{
					method: 'POST',
					body: {
						user: {
							name: 'Corsair Test User',
							email,
							role: 'end-user',
						},
					},
				},
			);

			ZendeskEndpointOutputSchemas.usersCreate.parse(response);

			const userId = response.user.id;
			if (userId) {
				await makeZendeskRequest<UsersDeleteResponse>(
					`users/${userId}.json`,
					TEST_API_KEY,
					TEST_SUBDOMAIN,
					{ method: 'DELETE' },
				);
			}
		});

		it('usersGet returns correct type', async () => {
			if (!hasCredentials) return;
			const email = `corsair-test-get-${Date.now()}@example.com`;
			const created = await makeZendeskRequest<UsersCreateResponse>(
				'users.json',
				TEST_API_KEY,
				TEST_SUBDOMAIN,
				{
					method: 'POST',
					body: {
						user: {
							name: 'Corsair Test User',
							email,
							role: 'end-user',
						},
					},
				},
			);
			const userId = created.user.id;

			const response = await makeZendeskRequest<UsersGetResponse>(
				`users/${userId}.json`,
				TEST_API_KEY,
				TEST_SUBDOMAIN,
				{ method: 'GET' },
			);

			ZendeskEndpointOutputSchemas.usersGet.parse(response);

			await makeZendeskRequest<UsersDeleteResponse>(
				`users/${userId}.json`,
				TEST_API_KEY,
				TEST_SUBDOMAIN,
				{ method: 'DELETE' },
			);
		});

		it('usersUpdate returns correct type', async () => {
			if (!hasCredentials) return;
			const email = `corsair-test-update-${Date.now()}@example.com`;
			const created = await makeZendeskRequest<UsersCreateResponse>(
				'users.json',
				TEST_API_KEY,
				TEST_SUBDOMAIN,
				{
					method: 'POST',
					body: {
						user: {
							name: 'Corsair Test User',
							email,
							role: 'end-user',
						},
					},
				},
			);
			const userId = created.user.id;

			const response = await makeZendeskRequest<UsersUpdateResponse>(
				`users/${userId}.json`,
				TEST_API_KEY,
				TEST_SUBDOMAIN,
				{
					method: 'PUT',
					body: {
						user: {
							name: 'Corsair Updated User',
						},
					},
				},
			);

			ZendeskEndpointOutputSchemas.usersUpdate.parse(response);

			await makeZendeskRequest<UsersDeleteResponse>(
				`users/${userId}.json`,
				TEST_API_KEY,
				TEST_SUBDOMAIN,
				{ method: 'DELETE' },
			);
		});

		it('usersDelete returns correct type', async () => {
			if (!hasCredentials) return;
			const email = `corsair-test-delete-${Date.now()}@example.com`;
			const created = await makeZendeskRequest<UsersCreateResponse>(
				'users.json',
				TEST_API_KEY,
				TEST_SUBDOMAIN,
				{
					method: 'POST',
					body: {
						user: {
							name: 'Corsair Test User',
							email,
							role: 'end-user',
						},
					},
				},
			);
			const userId = created.user.id;

			const response = await makeZendeskRequest<UsersDeleteResponse>(
				`users/${userId}.json`,
				TEST_API_KEY,
				TEST_SUBDOMAIN,
				{ method: 'DELETE' },
			);

			ZendeskEndpointOutputSchemas.usersDelete.parse(response);
		});
	});

	describe('comments', () => {
		it('commentsList returns correct type', async () => {
			if (!hasCredentials) return;
			const created = await makeZendeskRequest<TicketsCreateResponse>(
				'tickets.json',
				TEST_API_KEY,
				TEST_SUBDOMAIN,
				{
					method: 'POST',
					body: {
						ticket: {
							subject: `Corsair API test comments ${Date.now()}`,
							comment: {
								body: 'Initial comment for comments list test',
							},
						},
					},
				},
			);
			const ticketId = created.ticket.id;

			const response = await makeZendeskRequest<CommentsListResponse>(
				`tickets/${ticketId}/comments.json`,
				TEST_API_KEY,
				TEST_SUBDOMAIN,
				{ method: 'GET' },
			);

			ZendeskEndpointOutputSchemas.commentsList.parse(response);

			await makeZendeskRequest<TicketsDeleteResponse>(
				`tickets/${ticketId}.json`,
				TEST_API_KEY,
				TEST_SUBDOMAIN,
				{ method: 'DELETE' },
			);
		});
	});
});
