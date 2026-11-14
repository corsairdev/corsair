import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	Conversations,
	Customers,
	CustomFields,
	Folders,
	Mailboxes,
	Reports,
	SavedReplies,
	Tags,
	Threads,
} from './endpoints';
import type { HelpScoutContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeHelpscoutRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeHelpscoutRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

function buildCtx(): HelpScoutContext {
	const ctx: HelpScoutContext = {
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

describe('Help Scout Endpoints', () => {
	describe('Mailboxes Endpoints', () => {
		it('mailboxes.list sends GET /mailboxes with query and logs safe facts', async () => {
			const mockResp = {
				_embedded: {
					mailboxes: [
						{
							id: 101,
							name: 'Support',
							email: 'support@example.com',
						},
					],
				},
			};
			mockedRequest.mockResolvedValueOnce(mockResp);

			const result = await Mailboxes.list(ctx, { page: 1 });
			expect(result._embedded.mailboxes).toHaveLength(1);
			expect(mockedRequest).toHaveBeenCalledWith('/mailboxes', 'test-api-key', {
				method: 'GET',
				query: { page: 1 },
			});
			expect(mockedLogEvent).toHaveBeenCalledWith(
				ctx,
				'helpscout.mailboxes.list',
				{ count: 1 },
				'completed',
			);
		});

		it('mailboxes.get sends GET /mailboxes/{id}', async () => {
			const mockMailbox = {
				id: 101,
				name: 'Support',
				email: 'support@example.com',
			};
			mockedRequest.mockResolvedValueOnce(mockMailbox);

			const result = await Mailboxes.get(ctx, { mailboxId: 101 });
			expect(result.id).toBe(101);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/mailboxes/101',
				'test-api-key',
				{
					method: 'GET',
				},
			);
			expect(mockedLogEvent).toHaveBeenCalledWith(
				ctx,
				'helpscout.mailboxes.get',
				{ mailboxId: 101 },
				'completed',
			);
		});
	});

	describe('Folders & Custom Fields Endpoints', () => {
		it('folders.list sends GET /mailboxes/{id}/folders', async () => {
			const mockFolders = {
				_embedded: {
					folders: [
						{
							id: 5,
							name: 'Open',
							type: 'open',
						},
					],
				},
			};
			mockedRequest.mockResolvedValueOnce(mockFolders);

			const result = await Folders.list(ctx, { mailboxId: 101, page: 2 });
			expect(result._embedded.folders).toHaveLength(1);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/mailboxes/101/folders',
				'test-api-key',
				{
					method: 'GET',
					query: { page: 2 },
				},
			);
		});

		it('customFields.list sends GET /mailboxes/{id}/fields', async () => {
			const mockFields = {
				_embedded: {
					fields: [
						{
							id: 12,
							name: 'Priority',
							type: 'dropdown',
						},
					],
				},
			};
			mockedRequest.mockResolvedValueOnce(mockFields);

			const result = await CustomFields.list(ctx, { mailboxId: 101 });
			expect(result._embedded.fields).toHaveLength(1);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/mailboxes/101/fields',
				'test-api-key',
				{
					method: 'GET',
					query: { page: undefined },
				},
			);
		});
	});

	describe('Conversations Endpoints', () => {
		it('conversations.list sends GET /conversations with filters', async () => {
			const mockResp = {
				_embedded: {
					conversations: [
						{
							id: 1,
							subject: 'Need help',
							status: 'active',
						},
					],
				},
			};
			mockedRequest.mockResolvedValueOnce(mockResp);

			const result = await Conversations.list(ctx, {
				status: 'active',
				tag: 'vip',
				page: 1,
			});
			expect(result._embedded.conversations).toHaveLength(1);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/conversations',
				'test-api-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({
						status: 'active',
						tag: 'vip',
						page: 1,
					}),
				}),
			);
		});

		it('conversations.get sends GET /conversations/{id}', async () => {
			const mockConv = {
				id: 50,
				subject: 'Test Subject',
				status: 'closed',
			};
			mockedRequest.mockResolvedValueOnce(mockConv);

			const result = await Conversations.get(ctx, {
				conversationId: 50,
				embed: 'threads',
			});
			expect(result.id).toBe(50);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/conversations/50',
				'test-api-key',
				{
					method: 'GET',
					query: { embed: 'threads' },
				},
			);
		});

		it('conversations.create sends POST /conversations and redacts PII from logEvent', async () => {
			mockedRequest.mockResolvedValueOnce(undefined);

			const payload = {
				subject: 'Billing inquiry',
				type: 'email' as const,
				mailboxId: 101,
				customer: {
					email: 'customer@example.com',
					firstName: 'Alice',
				},
				threads: [
					{
						type: 'customer' as const,
						text: 'Sensitive billing question content',
					},
				],
			};

			await Conversations.create(ctx, payload);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/conversations',
				'test-api-key',
				{
					method: 'POST',
					body: payload,
				},
			);
			// Verifies privacy-safe logging: no customer email or text in logged facts
			expect(mockedLogEvent).toHaveBeenCalledWith(
				ctx,
				'helpscout.conversations.create',
				{ mailboxId: 101 },
				'completed',
			);
		});

		it('conversations.update sends PATCH /conversations/{id}', async () => {
			mockedRequest.mockResolvedValueOnce(undefined);

			await Conversations.update(ctx, {
				conversationId: 50,
				op: 'replace',
				path: '/status',
				value: 'closed',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/conversations/50',
				'test-api-key',
				{
					method: 'PATCH',
					body: {
						op: 'replace',
						path: '/status',
						value: 'closed',
					},
				},
			);
		});

		it('conversations.delete sends DELETE /conversations/{id}', async () => {
			mockedRequest.mockResolvedValueOnce(undefined);

			await Conversations.remove(ctx, { conversationId: 50 });
			expect(mockedRequest).toHaveBeenCalledWith(
				'/conversations/50',
				'test-api-key',
				{
					method: 'DELETE',
				},
			);
		});

		it('conversations.updateFields sends PUT /conversations/{id}/fields', async () => {
			mockedRequest.mockResolvedValueOnce(undefined);

			await Conversations.updateFields(ctx, {
				conversationId: 50,
				fields: [{ id: 1, value: 'High' }],
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/conversations/50/fields',
				'test-api-key',
				{
					method: 'PUT',
					body: { fields: [{ id: 1, value: 'High' }] },
				},
			);
		});

		it('conversations.updateTags sends PUT /conversations/{id}/tags', async () => {
			mockedRequest.mockResolvedValueOnce(undefined);

			await Conversations.updateTags(ctx, {
				conversationId: 50,
				tags: ['urgent', 'refund'],
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/conversations/50/tags',
				'test-api-key',
				{
					method: 'PUT',
					body: { tags: ['urgent', 'refund'] },
				},
			);
		});

		it('rejects invalid input before making any network call', async () => {
			const invalidInput = {
				subject: '',
				type: 'email' as const,
				mailboxId: 101,
				customer: { email: 'invalid-email' },
				threads: [
					{
						type: 'customer' as const,
						text: '',
					},
				],
			};

			// `unknown` because caught rejection value has no static type until narrowed.
			const err: unknown = await Conversations.create(ctx, invalidInput).catch(
				(e: unknown) => e,
			);

			expect(err).toBeInstanceOf(Error);
			expect(mockedRequest).not.toHaveBeenCalled();
		});
	});

	describe('Threads Endpoints', () => {
		it('threads.list sends GET /conversations/{id}/threads', async () => {
			const mockThreads = {
				_embedded: {
					threads: [{ id: 1, type: 'reply', body: 'Hello' }],
				},
			};
			mockedRequest.mockResolvedValueOnce(mockThreads);

			const result = await Threads.list(ctx, { conversationId: 50 });
			expect(result._embedded.threads).toHaveLength(1);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/conversations/50/threads',
				'test-api-key',
				{
					method: 'GET',
					query: { page: undefined },
				},
			);
		});

		it('threads.createReply sends POST /conversations/{id}/reply', async () => {
			mockedRequest.mockResolvedValueOnce(undefined);

			await Threads.createReply(ctx, {
				conversationId: 50,
				customer: { email: 'user@example.com' },
				text: 'Thank you for contacting us.',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/conversations/50/reply',
				'test-api-key',
				{
					method: 'POST',
					body: {
						customer: { email: 'user@example.com' },
						text: 'Thank you for contacting us.',
					},
				},
			);
		});

		it('threads.createNote sends POST /conversations/{id}/notes', async () => {
			mockedRequest.mockResolvedValueOnce(undefined);

			await Threads.createNote(ctx, {
				conversationId: 50,
				text: 'Internal note for team',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/conversations/50/notes',
				'test-api-key',
				{
					method: 'POST',
					body: { text: 'Internal note for team' },
				},
			);
		});

		it('threads.createChat sends POST /conversations/{id}/chats', async () => {
			mockedRequest.mockResolvedValueOnce(undefined);

			await Threads.createChat(ctx, {
				conversationId: 50,
				customer: { email: 'chatuser@example.com' },
				text: 'Live chat transcript',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/conversations/50/chats',
				'test-api-key',
				{
					method: 'POST',
					body: {
						customer: { email: 'chatuser@example.com' },
						text: 'Live chat transcript',
					},
				},
			);
		});

		it('threads.createPhone sends POST /conversations/{id}/phones', async () => {
			mockedRequest.mockResolvedValueOnce(undefined);

			await Threads.createPhone(ctx, {
				conversationId: 50,
				customer: { email: 'caller@example.com' },
				text: 'Inbound phone call notes',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/conversations/50/phones',
				'test-api-key',
				{
					method: 'POST',
					body: {
						customer: { email: 'caller@example.com' },
						text: 'Inbound phone call notes',
					},
				},
			);
		});

		it('threads.createCustomer sends POST /conversations/{id}/customer', async () => {
			mockedRequest.mockResolvedValueOnce(undefined);

			await Threads.createCustomer(ctx, {
				conversationId: 50,
				customer: { email: 'customer@example.com' },
				text: 'Follow-up customer message',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/conversations/50/customer',
				'test-api-key',
				{
					method: 'POST',
					body: {
						customer: { email: 'customer@example.com' },
						text: 'Follow-up customer message',
					},
				},
			);
		});

		it('threads.update sends PATCH /conversations/{id}/threads/{threadId}', async () => {
			mockedRequest.mockResolvedValueOnce(undefined);

			await Threads.update(ctx, {
				conversationId: 50,
				threadId: 2,
				op: 'replace',
				path: '/text',
				value: 'Updated note text',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/conversations/50/threads/2',
				'test-api-key',
				{
					method: 'PATCH',
					body: {
						op: 'replace',
						path: '/text',
						value: 'Updated note text',
					},
				},
			);
		});

		it('threads.getOriginalSource sends GET /conversations/{id}/threads/{threadId}/original-source', async () => {
			mockedRequest.mockResolvedValueOnce({ data: 'MIME email source' });

			const result = await Threads.getOriginalSource(ctx, {
				conversationId: 50,
				threadId: 2,
			});
			expect(result.data).toBe('MIME email source');
			expect(mockedRequest).toHaveBeenCalledWith(
				'/conversations/50/threads/2/original-source',
				'test-api-key',
				{
					method: 'GET',
				},
			);
		});
	});

	describe('Customers Endpoints', () => {
		it('customers.list sends GET /customers', async () => {
			const mockCusts = {
				_embedded: {
					customers: [{ id: 88, firstName: 'Jane' }],
				},
			};
			mockedRequest.mockResolvedValueOnce(mockCusts);

			const result = await Customers.list(ctx, { email: 'jane@example.com' });
			expect(result._embedded.customers).toHaveLength(1);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/customers',
				'test-api-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ email: 'jane@example.com' }),
				}),
			);
		});

		it('customers.get sends GET /customers/{id}', async () => {
			mockedRequest.mockResolvedValueOnce({ id: 88, firstName: 'Jane' });

			const result = await Customers.get(ctx, { customerId: 88 });
			expect(result.id).toBe(88);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/customers/88',
				'test-api-key',
				{
					method: 'GET',
				},
			);
		});

		it('customers.create sends POST /customers', async () => {
			mockedRequest.mockResolvedValueOnce(undefined);

			await Customers.create(ctx, {
				firstName: 'Bob',
				emails: [{ value: 'bob@example.com' }],
			});

			expect(mockedRequest).toHaveBeenCalledWith('/customers', 'test-api-key', {
				method: 'POST',
				body: {
					firstName: 'Bob',
					emails: [{ value: 'bob@example.com' }],
				},
			});
		});

		it('customers.update sends PUT /customers/{id}', async () => {
			mockedRequest.mockResolvedValueOnce(undefined);

			await Customers.update(ctx, {
				customerId: 88,
				firstName: 'Janet',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/customers/88',
				'test-api-key',
				{
					method: 'PUT',
					body: { firstName: 'Janet' },
				},
			);
		});

		it('customers.patch sends PATCH /customers/{id}', async () => {
			mockedRequest.mockResolvedValueOnce(undefined);

			await Customers.patch(ctx, {
				customerId: 88,
				op: 'replace',
				path: '/firstName',
				value: 'Janice',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/customers/88',
				'test-api-key',
				{
					method: 'PATCH',
					body: {
						op: 'replace',
						path: '/firstName',
						value: 'Janice',
					},
				},
			);
		});

		it('customers.delete sends DELETE /customers/{id}', async () => {
			mockedRequest.mockResolvedValueOnce(undefined);

			await Customers.remove(ctx, { customerId: 88 });
			expect(mockedRequest).toHaveBeenCalledWith(
				'/customers/88',
				'test-api-key',
				{
					method: 'DELETE',
				},
			);
		});

		it('manages customer address sub-resources', async () => {
			mockedRequest.mockResolvedValue(undefined);

			await Customers.createAddress(ctx, {
				customerId: 88,
				city: 'Austin',
				state: 'TX',
			});
			expect(mockedRequest).toHaveBeenCalledWith(
				'/customers/88/address',
				'test-api-key',
				{
					method: 'POST',
					body: { city: 'Austin', state: 'TX' },
				},
			);

			await Customers.updateAddress(ctx, {
				customerId: 88,
				city: 'Dallas',
			});
			expect(mockedRequest).toHaveBeenCalledWith(
				'/customers/88/address',
				'test-api-key',
				{
					method: 'PUT',
					body: { city: 'Dallas' },
				},
			);

			await Customers.deleteAddress(ctx, { customerId: 88 });
			expect(mockedRequest).toHaveBeenCalledWith(
				'/customers/88/address',
				'test-api-key',
				{
					method: 'DELETE',
				},
			);
		});

		it('manages customer email, phone, chat, social, and website sub-resources', async () => {
			mockedRequest.mockResolvedValue(undefined);

			// Email
			await Customers.createEmail(ctx, {
				customerId: 88,
				value: 'new@example.com',
			});
			expect(mockedRequest).toHaveBeenCalledWith(
				'/customers/88/emails',
				'test-api-key',
				{
					method: 'POST',
					body: { value: 'new@example.com' },
				},
			);

			await Customers.updateEmail(ctx, {
				customerId: 88,
				emailId: 1,
				value: 'updated@example.com',
			});
			expect(mockedRequest).toHaveBeenCalledWith(
				'/customers/88/emails/1',
				'test-api-key',
				{
					method: 'PUT',
					body: { value: 'updated@example.com' },
				},
			);

			await Customers.deleteEmail(ctx, { customerId: 88, emailId: 1 });
			expect(mockedRequest).toHaveBeenCalledWith(
				'/customers/88/emails/1',
				'test-api-key',
				{
					method: 'DELETE',
				},
			);

			// Phone
			await Customers.createPhone(ctx, {
				customerId: 88,
				value: '555-1234',
			});
			expect(mockedRequest).toHaveBeenCalledWith(
				'/customers/88/phones',
				'test-api-key',
				{
					method: 'POST',
					body: { value: '555-1234' },
				},
			);

			await Customers.updatePhone(ctx, {
				customerId: 88,
				phoneId: 2,
				value: '555-9876',
			});
			expect(mockedRequest).toHaveBeenCalledWith(
				'/customers/88/phones/2',
				'test-api-key',
				{
					method: 'PUT',
					body: { value: '555-9876' },
				},
			);

			await Customers.deletePhone(ctx, { customerId: 88, phoneId: 2 });
			expect(mockedRequest).toHaveBeenCalledWith(
				'/customers/88/phones/2',
				'test-api-key',
				{
					method: 'DELETE',
				},
			);

			// Chat
			await Customers.createChat(ctx, {
				customerId: 88,
				value: 'chat_handle',
			});
			expect(mockedRequest).toHaveBeenCalledWith(
				'/customers/88/chats',
				'test-api-key',
				{
					method: 'POST',
					body: { value: 'chat_handle' },
				},
			);

			await Customers.updateChat(ctx, {
				customerId: 88,
				chatId: 3,
				value: 'new_chat',
			});
			expect(mockedRequest).toHaveBeenCalledWith(
				'/customers/88/chats/3',
				'test-api-key',
				{
					method: 'PUT',
					body: { value: 'new_chat' },
				},
			);

			await Customers.deleteChat(ctx, { customerId: 88, chatId: 3 });
			expect(mockedRequest).toHaveBeenCalledWith(
				'/customers/88/chats/3',
				'test-api-key',
				{
					method: 'DELETE',
				},
			);

			// Social profile
			await Customers.createSocialProfile(ctx, {
				customerId: 88,
				value: 'twitter.com/acme',
			});
			expect(mockedRequest).toHaveBeenCalledWith(
				'/customers/88/social-profiles',
				'test-api-key',
				{
					method: 'POST',
					body: { value: 'twitter.com/acme' },
				},
			);

			await Customers.updateSocialProfile(ctx, {
				customerId: 88,
				profileId: 4,
				value: 'x.com/acme',
			});
			expect(mockedRequest).toHaveBeenCalledWith(
				'/customers/88/social-profiles/4',
				'test-api-key',
				{
					method: 'PUT',
					body: { value: 'x.com/acme' },
				},
			);

			await Customers.deleteSocialProfile(ctx, {
				customerId: 88,
				profileId: 4,
			});
			expect(mockedRequest).toHaveBeenCalledWith(
				'/customers/88/social-profiles/4',
				'test-api-key',
				{
					method: 'DELETE',
				},
			);

			// Website
			await Customers.createWebsite(ctx, {
				customerId: 88,
				value: 'https://example.com',
			});
			expect(mockedRequest).toHaveBeenCalledWith(
				'/customers/88/websites',
				'test-api-key',
				{
					method: 'POST',
					body: { value: 'https://example.com' },
				},
			);

			await Customers.updateWebsite(ctx, {
				customerId: 88,
				websiteId: 5,
				value: 'https://new.example.com',
			});
			expect(mockedRequest).toHaveBeenCalledWith(
				'/customers/88/websites/5',
				'test-api-key',
				{
					method: 'PUT',
					body: { value: 'https://new.example.com' },
				},
			);

			await Customers.deleteWebsite(ctx, { customerId: 88, websiteId: 5 });
			expect(mockedRequest).toHaveBeenCalledWith(
				'/customers/88/websites/5',
				'test-api-key',
				{
					method: 'DELETE',
				},
			);
		});
	});

	describe('Tags Endpoints', () => {
		it('tags.list sends GET /tags', async () => {
			mockedRequest.mockResolvedValueOnce({
				_embedded: { tags: [{ id: 1, tag: 'urgent' }] },
			});

			const result = await Tags.list(ctx, { page: 1 });
			expect(result._embedded.tags).toHaveLength(1);
			expect(mockedRequest).toHaveBeenCalledWith('/tags', 'test-api-key', {
				method: 'GET',
				query: { page: 1 },
			});
		});

		it('tags.get sends GET /tags/{id}', async () => {
			mockedRequest.mockResolvedValueOnce({ id: 1, tag: 'urgent' });

			const result = await Tags.get(ctx, { tagId: 1 });
			expect(result.id).toBe(1);
			expect(mockedRequest).toHaveBeenCalledWith('/tags/1', 'test-api-key', {
				method: 'GET',
			});
		});
	});

	describe('Saved Replies Endpoints', () => {
		it('savedReplies.list sends GET /mailboxes/{id}/saved-replies', async () => {
			mockedRequest.mockResolvedValueOnce([
				{ id: 10, name: 'Greeting', text: 'Hello!' },
			]);

			const result = await SavedReplies.list(ctx, { mailboxId: 101 });
			expect(result).toHaveLength(1);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/mailboxes/101/saved-replies',
				'test-api-key',
				{
					method: 'GET',
					query: {
						includeChatReplies: undefined,
						page: undefined,
					},
				},
			);
		});

		it('savedReplies.get sends GET /mailboxes/{id}/saved-replies/{replyId}', async () => {
			mockedRequest.mockResolvedValueOnce({
				id: 10,
				name: 'Greeting',
				text: 'Hello!',
			});

			const result = await SavedReplies.get(ctx, {
				mailboxId: 101,
				savedReplyId: 10,
			});
			expect(result.id).toBe(10);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/mailboxes/101/saved-replies/10',
				'test-api-key',
				{
					method: 'GET',
				},
			);
		});

		it('savedReplies.create sends POST /mailboxes/{id}/saved-replies', async () => {
			mockedRequest.mockResolvedValueOnce(undefined);

			await SavedReplies.create(ctx, {
				mailboxId: 101,
				name: 'Greeting',
				text: 'Hello there!',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/mailboxes/101/saved-replies',
				'test-api-key',
				{
					method: 'POST',
					body: {
						name: 'Greeting',
						text: 'Hello there!',
					},
				},
			);
		});

		it('savedReplies.update sends PUT /mailboxes/{id}/saved-replies/{replyId}', async () => {
			mockedRequest.mockResolvedValueOnce(undefined);

			await SavedReplies.update(ctx, {
				mailboxId: 101,
				savedReplyId: 10,
				name: 'New Greeting',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/mailboxes/101/saved-replies/10',
				'test-api-key',
				{
					method: 'PUT',
					body: { name: 'New Greeting' },
				},
			);
		});

		it('savedReplies.delete sends DELETE /mailboxes/{id}/saved-replies/{replyId}', async () => {
			mockedRequest.mockResolvedValueOnce(undefined);

			await SavedReplies.remove(ctx, {
				mailboxId: 101,
				savedReplyId: 10,
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/mailboxes/101/saved-replies/10',
				'test-api-key',
				{
					method: 'DELETE',
				},
			);
		});
	});

	describe('Reports Endpoints', () => {
		const reportInput = {
			start: '2026-01-01T00:00:00Z',
			end: '2026-01-31T23:59:59Z',
			mailboxes: '101',
		};

		it('reports.getConversations sends GET /reports/conversations', async () => {
			mockedRequest.mockResolvedValueOnce({ totalConversations: 42 });

			const result = await Reports.getConversations(ctx, reportInput);
			expect(result.totalConversations).toBe(42);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/reports/conversations',
				'test-api-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ mailboxes: '101' }),
				}),
			);
		});

		it('reports.getCompany sends GET /reports/company', async () => {
			mockedRequest.mockResolvedValueOnce({ customersHelped: 100 });

			const result = await Reports.getCompany(ctx, reportInput);
			expect(result.customersHelped).toBe(100);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/reports/company',
				'test-api-key',
				expect.objectContaining({ method: 'GET' }),
			);
		});

		it('reports.getEmail sends GET /reports/email', async () => {
			mockedRequest.mockResolvedValueOnce({ emailsSent: 85 });

			const result = await Reports.getEmail(ctx, reportInput);
			expect(result.emailsSent).toBe(85);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/reports/email',
				'test-api-key',
				expect.objectContaining({ method: 'GET' }),
			);
		});

		it('reports.getChat sends GET /reports/chat', async () => {
			mockedRequest.mockResolvedValueOnce({ chatsAccepted: 30 });

			const result = await Reports.getChat(ctx, reportInput);
			expect(result.chatsAccepted).toBe(30);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/reports/chat',
				'test-api-key',
				expect.objectContaining({ method: 'GET' }),
			);
		});

		it('reports.getDocs sends GET /reports/docs', async () => {
			mockedRequest.mockResolvedValueOnce({ searchesCount: 50 });

			const result = await Reports.getDocs(ctx, reportInput);
			expect(result.searchesCount).toBe(50);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/reports/docs',
				'test-api-key',
				expect.objectContaining({ method: 'GET' }),
			);
		});
	});
});
