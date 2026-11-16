import { logEventFromContext } from 'corsair/core';
import { makeFolkRequest } from './client';
import {
	Companies,
	Credits,
	GroupMembers,
	Groups,
	Interactions,
	Notes,
	People,
	Users,
} from './endpoints';
import type { FolkContext } from './index';

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeFolkRequest: jest.fn(),
	};
});

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

const mockMakeRequest = jest.mocked(makeFolkRequest);
const mockLogEvent = jest.mocked(logEventFromContext);

function createMockContext(): FolkContext {
	return {
		key: 'test-api-key-123',
		options: {},
		endpoints: {} as FolkContext['endpoints'],
		db: {},
		keys: {
			get_api_key: async () => 'test-api-key-123',
			set_api_key: async () => undefined,
			get_webhook_signature: async () => null,
			set_webhook_signature: async () => undefined,
			get_dek: async () => 'mock-dek',
			issue_new_dek: async () => 'mock-dek',
		},
		$getAccountId: async () => 'acc_123',
	};
}

describe('Folk endpoints', () => {
	const ctx = createMockContext();

	beforeEach(() => {
		mockMakeRequest.mockReset();
		mockLogEvent.mockReset();
	});

	describe('People endpoints', () => {
		it('people.list requests GET /people with query parameters', async () => {
			mockMakeRequest.mockResolvedValue({
				data: {
					items: [{ id: 'per_1', fullName: 'Alice' }],
					pagination: {
						nextLink: 'https://api.folk.app/v1/people?cursor=cur2',
					},
				},
			});

			const result = await People.list(ctx, {
				limit: 10,
				cursor: 'cur1',
				combinator: 'and',
			});

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/people',
				'test-api-key-123',
				{
					method: 'GET',
					query: { limit: 10, cursor: 'cur1', combinator: 'and' },
				},
			);
			expect(result.data.items).toHaveLength(1);
			expect(mockLogEvent).toHaveBeenCalledWith(
				ctx,
				'folk.people.list',
				{ count: 1 },
				'completed',
			);
		});

		it('people.list forwards nested filter parameters into query', async () => {
			mockMakeRequest.mockResolvedValue({
				data: {
					items: [{ id: 'per_1', fullName: 'Alice' }],
					pagination: {},
				},
				deprecations: [],
			});

			await People.list(ctx, {
				limit: 20,
				combinator: 'and',
				filter: {
					status: { eq: 'active' },
					email: { contains: '@example.com' },
				},
			});

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/people',
				'test-api-key-123',
				{
					method: 'GET',
					query: {
						limit: 20,
						combinator: 'and',
						'filter[status][eq]': 'active',
						'filter[email][contains]': '@example.com',
					},
				},
			);
		});

		it('people.get requests GET /people/:id', async () => {
			mockMakeRequest.mockResolvedValue({
				data: { id: 'per_123', fullName: 'Bob' },
			});

			const result = await People.get(ctx, {
				personId: 'per_123',
			});

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/people/per_123',
				'test-api-key-123',
				{ method: 'GET' },
			);
			expect(result.data.id).toBe('per_123');
		});

		it('people.create requests POST /people with Idempotency-Key and body', async () => {
			mockMakeRequest.mockResolvedValue({
				data: { id: 'per_created', firstName: 'Charlie' },
			});

			const result = await People.create(ctx, {
				firstName: 'Charlie',
				idempotencyKey: 'idemp-1',
			});

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/people',
				'test-api-key-123',
				{
					method: 'POST',
					body: { firstName: 'Charlie' },
					headers: { 'Idempotency-Key': 'idemp-1' },
				},
			);
			expect(result.data.id).toBe('per_created');
		});

		it('people.update requests PATCH /people/:id with body', async () => {
			mockMakeRequest.mockResolvedValue({
				data: { id: 'per_123', jobTitle: 'Lead Architect' },
			});

			const result = await People.update(ctx, {
				personId: 'per_123',
				jobTitle: 'Lead Architect',
			});

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/people/per_123',
				'test-api-key-123',
				{
					method: 'PATCH',
					body: { jobTitle: 'Lead Architect' },
					headers: {},
				},
			);
			expect(result.data.id).toBe('per_123');
		});

		it('people.delete requests DELETE /people/:id', async () => {
			mockMakeRequest.mockResolvedValue({
				data: { id: 'per_123' },
			});

			const result = await People.delete(ctx, {
				personId: 'per_123',
			});

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/people/per_123',
				'test-api-key-123',
				{
					method: 'DELETE',
					headers: {},
				},
			);
			expect(result.data.id).toBe('per_123');
		});

		it('people operations reject invalid inputs without triggering network requests', async () => {
			// `unknown` because catch blocks receive an untyped rejection value before assertion.
			const err: unknown = await People.list(ctx, { limit: 999 }).catch(
				(e: unknown) => e,
			);

			expect(err).toBeDefined();
			expect(mockMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('Companies endpoints', () => {
		it('companies.list requests GET /companies', async () => {
			mockMakeRequest.mockResolvedValue({
				data: {
					items: [{ id: 'com_1', name: 'Acme' }],
					pagination: {},
				},
			});

			const result = await Companies.list(ctx, { limit: 5 });

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/companies',
				'test-api-key-123',
				{
					method: 'GET',
					query: { limit: 5 },
				},
			);
			expect(result.data.items[0]?.name).toBe('Acme');
		});

		it('companies.list forwards nested filter parameters into query', async () => {
			mockMakeRequest.mockResolvedValue({
				data: {
					items: [{ id: 'com_1', name: 'Acme' }],
					pagination: {},
				},
				deprecations: [],
			});

			await Companies.list(ctx, {
				limit: 15,
				combinator: 'or',
				filter: {
					domain: { eq: 'acme.com' },
					tags: { contains: 'enterprise' },
				},
			});

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/companies',
				'test-api-key-123',
				{
					method: 'GET',
					query: {
						limit: 15,
						combinator: 'or',
						'filter[domain][eq]': 'acme.com',
						'filter[tags][contains]': 'enterprise',
					},
				},
			);
		});

		it('companies.get requests GET /companies/:id', async () => {
			mockMakeRequest.mockResolvedValue({
				data: { id: 'com_1', name: 'Acme' },
			});

			const result = await Companies.get(ctx, {
				companyId: 'com_1',
			});

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/companies/com_1',
				'test-api-key-123',
				{ method: 'GET' },
			);
			expect(result.data.id).toBe('com_1');
		});

		it('companies.create requests POST /companies', async () => {
			mockMakeRequest.mockResolvedValue({
				data: { id: 'com_new', name: 'NewCo' },
			});

			const result = await Companies.create(ctx, {
				name: 'NewCo',
			});

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/companies',
				'test-api-key-123',
				{
					method: 'POST',
					body: { name: 'NewCo' },
					headers: {},
				},
			);
			expect(result.data.id).toBe('com_new');
		});

		it('companies.update requests PATCH /companies/:id', async () => {
			mockMakeRequest.mockResolvedValue({
				data: { id: 'com_1', name: 'UpdatedCo' },
			});

			const result = await Companies.update(ctx, {
				companyId: 'com_1',
				name: 'UpdatedCo',
			});

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/companies/com_1',
				'test-api-key-123',
				{
					method: 'PATCH',
					body: { name: 'UpdatedCo' },
					headers: {},
				},
			);
			expect(result.data.name).toBe('UpdatedCo');
		});

		it('companies.delete requests DELETE /companies/:id', async () => {
			mockMakeRequest.mockResolvedValue({
				data: { id: 'com_1' },
			});

			const result = await Companies.delete(ctx, {
				companyId: 'com_1',
			});

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/companies/com_1',
				'test-api-key-123',
				{
					method: 'DELETE',
					headers: {},
				},
			);
			expect(result.data.id).toBe('com_1');
		});
	});

	describe('Groups endpoints', () => {
		it('groups.list requests GET /groups', async () => {
			mockMakeRequest.mockResolvedValue({
				data: {
					items: [{ id: 'grp_1', name: 'Design', visibility: 'public' }],
					pagination: {},
				},
			});

			const result = await Groups.list(ctx, {});
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/groups',
				'test-api-key-123',
				{
					method: 'GET',
					query: {},
				},
			);
			expect(result.data.items).toHaveLength(1);
		});

		it('groups.create requests POST /groups', async () => {
			mockMakeRequest.mockResolvedValue({
				data: { id: 'grp_new', name: 'Sales', visibility: 'private' },
			});

			const result = await Groups.create(ctx, {
				name: 'Sales',
				visibility: 'private',
			});

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/groups',
				'test-api-key-123',
				{
					method: 'POST',
					body: { name: 'Sales', visibility: 'private' },
					headers: {},
				},
			);
			expect(result.data.id).toBe('grp_new');
		});

		it('groups.update requests PATCH /groups/:id', async () => {
			mockMakeRequest.mockResolvedValue({
				data: { id: 'grp_1', name: 'Enterprise Sales', visibility: 'private' },
			});

			const result = await Groups.update(ctx, {
				groupId: 'grp_1',
				name: 'Enterprise Sales',
			});

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/groups/grp_1',
				'test-api-key-123',
				{
					method: 'PATCH',
					body: { name: 'Enterprise Sales' },
					headers: {},
				},
			);
			expect(result.data.name).toBe('Enterprise Sales');
		});
	});

	describe('Group Members endpoints', () => {
		it('groupMembers.list requests GET /groups/:groupId/members', async () => {
			mockMakeRequest.mockResolvedValue({
				data: {
					items: [{ id: 'usr_1', role: 'admin' }],
					pagination: {},
				},
			});

			const result = await GroupMembers.list(ctx, {
				groupId: 'grp_1',
			});

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/groups/grp_1/members',
				'test-api-key-123',
				{ method: 'GET', query: {} },
			);
			expect(result.data.items[0]?.role).toBe('admin');
		});

		it('groupMembers.add requests POST /groups/:groupId/members', async () => {
			mockMakeRequest.mockResolvedValue({
				data: { id: 'usr_2', role: 'contributor' },
			});

			const result = await GroupMembers.add(ctx, {
				groupId: 'grp_1',
				id: 'usr_2',
				role: 'contributor',
			});

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/groups/grp_1/members',
				'test-api-key-123',
				{
					method: 'POST',
					body: { id: 'usr_2', role: 'contributor' },
					headers: {},
				},
			);
			expect(result.data.id).toBe('usr_2');
		});

		it('groupMembers.update requests PATCH /groups/:groupId/members/:userId', async () => {
			mockMakeRequest.mockResolvedValue({
				data: { id: 'usr_2', role: 'reader' },
			});

			const result = await GroupMembers.update(ctx, {
				groupId: 'grp_1',
				userId: 'usr_2',
				role: 'reader',
			});

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/groups/grp_1/members/usr_2',
				'test-api-key-123',
				{
					method: 'PATCH',
					body: { role: 'reader' },
					headers: {},
				},
			);
			expect(result.data.role).toBe('reader');
		});

		it('groupMembers.remove requests DELETE /groups/:groupId/members/:userId', async () => {
			mockMakeRequest.mockResolvedValue({
				data: { id: 'usr_2' },
			});

			const result = await GroupMembers.remove(ctx, {
				groupId: 'grp_1',
				userId: 'usr_2',
			});

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/groups/grp_1/members/usr_2',
				'test-api-key-123',
				{
					method: 'DELETE',
					headers: {},
				},
			);
			expect(result.data.id).toBe('usr_2');
		});
	});

	describe('Interactions endpoints', () => {
		it('interactions.list requests GET /interactions', async () => {
			mockMakeRequest.mockResolvedValue({
				data: { items: [{ id: 'int_1' }], pagination: {} },
			});

			const result = await Interactions.list(ctx, {
				entityId: 'per_1',
				timeframe: 'past',
				cursor: 'cur1',
			});

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/interactions',
				'test-api-key-123',
				{
					method: 'GET',
					query: { 'entity.id': 'per_1', timeframe: 'past', cursor: 'cur1' },
				},
			);
			expect(result.data.items).toHaveLength(1);
		});

		it('interactions.listPast requests GET /interactions/past', async () => {
			mockMakeRequest.mockResolvedValue({
				data: { items: [], pagination: {} },
			});

			await Interactions.listPast(ctx, { entityId: 'per_1' });
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/interactions/past',
				'test-api-key-123',
				{ method: 'GET', query: { 'entity.id': 'per_1' } },
			);
		});

		it('interaction reads require entityId and list requires timeframe, as Folk does', async () => {
			await expect(
				// @ts-expect-error entityId is required
				Interactions.listPast(ctx, {}),
			).rejects.toThrow();
			await expect(
				// @ts-expect-error timeframe is required
				Interactions.list(ctx, { entityId: 'per_1' }),
			).rejects.toThrow();
			await expect(
				// @ts-expect-error entityId is required
				Interactions.get(ctx, { interactionId: 'int_1' }),
			).rejects.toThrow();
			expect(mockMakeRequest).not.toHaveBeenCalled();
		});

		it('interactions.listUpcoming requests GET /interactions/upcoming', async () => {
			mockMakeRequest.mockResolvedValue({
				data: { items: [], pagination: {} },
			});

			await Interactions.listUpcoming(ctx, { entityId: 'com_1' });
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/interactions/upcoming',
				'test-api-key-123',
				{ method: 'GET', query: { 'entity.id': 'com_1' } },
			);
		});

		it('interactions.get requests GET /interactions/:id', async () => {
			mockMakeRequest.mockResolvedValue({
				data: { id: 'int_123', title: 'Intro' },
			});

			const result = await Interactions.get(ctx, {
				interactionId: 'int_123',
				entityId: 'per_1',
			});

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/interactions/int_123',
				'test-api-key-123',
				{ method: 'GET', query: { 'entity.id': 'per_1' } },
			);
			expect(result.data.id).toBe('int_123');
		});

		it('interactions.create requests POST /interactions', async () => {
			mockMakeRequest.mockResolvedValue({
				data: { id: 'int_new', title: 'Call' },
			});

			const result = await Interactions.create(ctx, {
				entity: { id: 'per_1' },
				dateTime: '2025-01-01T10:00:00Z',
				title: 'Call',
				content: 'Notes from call',
			});

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/interactions',
				'test-api-key-123',
				{
					method: 'POST',
					body: {
						entity: { id: 'per_1' },
						dateTime: '2025-01-01T10:00:00Z',
						title: 'Call',
						content: 'Notes from call',
					},
					headers: {},
				},
			);
			expect(result.data.id).toBe('int_new');
		});

		it('interactions.update requests PATCH /interactions/:id', async () => {
			mockMakeRequest.mockResolvedValue({
				data: { id: 'int_123', title: 'Updated Call' },
			});

			const result = await Interactions.update(ctx, {
				interactionId: 'int_123',
				entity: { id: 'per_1' },
				title: 'Updated Call',
			});

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/interactions/int_123',
				'test-api-key-123',
				{
					method: 'PATCH',
					body: {
						entity: { id: 'per_1' },
						title: 'Updated Call',
					},
					headers: {},
				},
			);
			expect(result.data.id).toBe('int_123');
		});

		it('interactions.delete requests DELETE /interactions/:id', async () => {
			mockMakeRequest.mockResolvedValue({
				data: { id: 'int_123' },
			});

			const result = await Interactions.delete(ctx, {
				interactionId: 'int_123',
				entityId: 'per_1',
			});

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/interactions/int_123',
				'test-api-key-123',
				{
					method: 'DELETE',
					query: { 'entity.id': 'per_1' },
					headers: {},
				},
			);
			expect(result.data.id).toBe('int_123');
		});
	});

	describe('Notes endpoints', () => {
		it('notes.list requests GET /notes', async () => {
			mockMakeRequest.mockResolvedValue({
				data: { items: [], pagination: {} },
			});

			await Notes.list(ctx, {
				entityId: 'per_1',
				query: 'kickoff',
				createdAfter: '2025-01-01',
				createdBefore: '2025-02-01',
			});

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/notes',
				'test-api-key-123',
				{
					method: 'GET',
					query: {
						'entity.id': 'per_1',
						query: 'kickoff',
						createdAfter: '2025-01-01',
						createdBefore: '2025-02-01',
					},
				},
			);
		});

		it('notes.get requests GET /notes/:id', async () => {
			mockMakeRequest.mockResolvedValue({
				data: { id: 'nte_1', content: 'note text', visibility: 'public' },
			});

			const result = await Notes.get(ctx, { noteId: 'nte_1' });
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/notes/nte_1',
				'test-api-key-123',
				{ method: 'GET' },
			);
			expect(result.data.id).toBe('nte_1');
		});

		it('notes.create requests POST /notes', async () => {
			mockMakeRequest.mockResolvedValue({
				data: { id: 'nte_new', content: 'Hello', visibility: 'private' },
			});

			const result = await Notes.create(ctx, {
				entity: { id: 'per_1' },
				content: 'Hello',
				visibility: 'private',
			});

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/notes',
				'test-api-key-123',
				{
					method: 'POST',
					body: {
						entity: { id: 'per_1' },
						content: 'Hello',
						visibility: 'private',
					},
					headers: {},
				},
			);
			expect(result.data.id).toBe('nte_new');
		});

		it('notes.update requests PATCH /notes/:id', async () => {
			mockMakeRequest.mockResolvedValue({
				data: { id: 'nte_1', content: 'New text', visibility: 'public' },
			});

			const result = await Notes.update(ctx, {
				noteId: 'nte_1',
				content: 'New text',
			});

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/notes/nte_1',
				'test-api-key-123',
				{
					method: 'PATCH',
					body: { content: 'New text' },
					headers: {},
				},
			);
			expect(result.data.content).toBe('New text');
		});

		it('notes.delete requests DELETE /notes/:id', async () => {
			mockMakeRequest.mockResolvedValue({
				data: { id: 'nte_1' },
			});

			const result = await Notes.delete(ctx, {
				noteId: 'nte_1',
			});

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/notes/nte_1',
				'test-api-key-123',
				{
					method: 'DELETE',
					headers: {},
				},
			);
			expect(result.data.id).toBe('nte_1');
		});
	});

	describe('Users endpoints', () => {
		it('users.list requests GET /users', async () => {
			mockMakeRequest.mockResolvedValue({
				data: { items: [{ id: 'usr_1' }], pagination: {} },
			});

			await Users.list(ctx, {});
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/users',
				'test-api-key-123',
				{
					method: 'GET',
					query: {},
				},
			);
		});

		it('users.getCurrentUser requests GET /users/me', async () => {
			mockMakeRequest.mockResolvedValue({
				data: {
					id: 'usr_me',
					fullName: 'Current User',
					email: 'me@example.com',
				},
			});

			const result = await Users.getCurrentUser(ctx, {});
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/users/me',
				'test-api-key-123',
				{ method: 'GET' },
			);
			expect(result.data.id).toBe('usr_me');
		});

		it('users.get requests GET /users/:id', async () => {
			mockMakeRequest.mockResolvedValue({
				data: { id: 'usr_123', fullName: 'User 123' },
			});

			const result = await Users.get(ctx, {
				userId: 'usr_123',
			});
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/users/usr_123',
				'test-api-key-123',
				{ method: 'GET' },
			);
			expect(result.data.id).toBe('usr_123');
		});
	});

	describe('Credits endpoint', () => {
		it('credits.get requests GET /credits', async () => {
			mockMakeRequest.mockResolvedValue({
				data: {
					items: [
						{
							feature: 'person_enrichment',
							scope: 'workspace',
							used: 10,
							limit: 100,
							periodStart: '2026-01-01',
							periodEnd: '2026-02-01',
						},
					],
				},
			});

			const result = await Credits.get(ctx, {});
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/credits',
				'test-api-key-123',
				{ method: 'GET' },
			);
			expect(result.data.items).toHaveLength(1);
		});
	});
});
