import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	Contacts,
	Conversations,
	CustomFields,
	Inboxes,
	Messages,
	Notes,
	Reports,
	Tags,
	Users,
	Whatsapp,
} from './endpoints';
import type { HelpwiseContext } from './index';

jest.mock('corsair/core', () => {
	// `unknown` because jest.requireActual returns an untyped module record.
	const actual = jest.requireActual<Record<string, unknown>>('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	// `unknown` because jest.requireActual returns an untyped module record.
	const actual = jest.requireActual<Record<string, unknown>>('./client');
	return { ...actual, makeHelpwiseRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeHelpwiseRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

function buildCtx(): HelpwiseContext {
	const ctx: HelpwiseContext = {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test_key:test_secret',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test_key'),
			set_api_key: () => Promise.resolve(),
			get_api_secret: () => Promise.resolve('test_secret'),
			set_api_secret: () => Promise.resolve(),
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

describe('Conversations endpoints', () => {
	it('close calls PUT /conversations/action/close and logs safe event', async () => {
		mockedRequest.mockResolvedValue({
			status: 'success',
			message: 'Closed',
		});
		const result = await Conversations.close(ctx, { ids: [101, 102] });
		expect(result).toEqual({ status: 'success', message: 'Closed' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/conversations/action/close',
			'test_key:test_secret',
			{ method: 'PUT', body: { ids: [101, 102] } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'helpwise.conversations.close',
			{ count: 2 },
			'completed',
		);
	});

	it('moveToInbox calls PUT /conversations/action/moveToInbox', async () => {
		mockedRequest.mockResolvedValue({ status: 'success' });
		await Conversations.moveToInbox(ctx, { ids: [201] });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/conversations/action/moveToInbox',
			'test_key:test_secret',
			{ method: 'PUT', body: { ids: [201] } },
		);
	});

	it('spam calls PUT /conversations/action/spam', async () => {
		mockedRequest.mockResolvedValue({ status: 'success' });
		await Conversations.spam(ctx, { ids: [301] });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/conversations/action/spam',
			'test_key:test_secret',
			{ method: 'PUT', body: { ids: [301] } },
		);
	});

	it('trash calls PUT /conversations/action/trash', async () => {
		mockedRequest.mockResolvedValue({ status: 'success' });
		await Conversations.trash(ctx, { ids: [401] });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/conversations/action/trash',
			'test_key:test_secret',
			{ method: 'PUT', body: { ids: [401] } },
		);
	});

	it('delete calls PUT /conversations/action/delete', async () => {
		mockedRequest.mockResolvedValue({ status: 'success' });
		await Conversations.deleteConversation(ctx, { ids: [501] });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/conversations/action/delete',
			'test_key:test_secret',
			{ method: 'PUT', body: { ids: [501] } },
		);
	});

	it('list calls GET /conversations with query parameters', async () => {
		mockedRequest.mockResolvedValue({
			nextPageToken: 'token123',
			threads: [{ id: 10, subject: 'Inquiry', isRead: true }],
		});
		const result = await Conversations.list(ctx, {
			inboxIds: [1, 2],
			limit: 50,
			pageToken: 'prev',
		});
		expect(result.threads).toHaveLength(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/conversations',
			'test_key:test_secret',
			{
				method: 'GET',
				query: {
					'inboxIds[]': [1, 2],
					limit: 50,
					pageToken: 'prev',
				},
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'helpwise.conversations.list',
			{ count: 1 },
			'completed',
		);
	});

	it('get calls GET /inboxes/:inboxId/conversations/:conversationId', async () => {
		mockedRequest.mockResolvedValue({ id: 100, subject: 'Support' });
		const result = await Conversations.get(ctx, {
			inboxId: 10,
			conversationId: 100,
		});
		expect(result.id).toBe(100);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/inboxes/10/conversations/100',
			'test_key:test_secret',
			{ method: 'GET', query: {} },
		);
	});

	it('assign calls POST /dev-apis/threads/assign on app base', async () => {
		mockedRequest.mockResolvedValue({ status: 'success' });
		await Conversations.assign(ctx, {
			mailbox_id: 1,
			thread_id: 2,
			assigned_to: 3,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/dev-apis/threads/assign',
			'test_key:test_secret',
			{
				method: 'POST',
				baseUrl: client.HELPWISE_APP_BASE,
				body: { mailbox_id: 1, thread_id: 2, assigned_to: 3 },
			},
		);
	});

	it('rejects invalid action input without calling network', async () => {
		await expect(Conversations.close(ctx, { ids: [] })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('Messages endpoints', () => {
	it('sendEmail sends email payload to /dev-apis/emails/send_mail and redacts body from logs', async () => {
		mockedRequest.mockResolvedValue({
			status: 'success',
			thread_id: 1,
			message_id: 2,
		});
		const result = await Messages.sendEmail(ctx, {
			mailbox_id: 10,
			to: 'customer@example.com',
			subject: 'Test Subject',
			body: '<p>Secret content</p>',
		});
		expect(result.status).toBe('success');
		expect(mockedRequest).toHaveBeenCalledWith(
			'/dev-apis/emails/send_mail',
			'test_key:test_secret',
			expect.objectContaining({
				method: 'POST',
				baseUrl: client.HELPWISE_APP_BASE,
				body: expect.objectContaining({
					mailbox_id: 10,
					to: 'customer@example.com',
					subject: 'Test Subject',
					body: '<p>Secret content</p>',
				}),
			}),
		);
		// Asserts logEvent never receives email body or customer address.
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'helpwise.messages.sendEmail',
			{ mailboxId: 10 },
			'completed',
		);
	});

	it('listEmails calls POST /dev-apis/emails/list', async () => {
		mockedRequest.mockResolvedValue({ status: 'success', data: [] });
		await Messages.listEmails(ctx, {
			mailboxId: 10,
			threadId: 20,
			page: 1,
			limit: 10,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/dev-apis/emails/list',
			'test_key:test_secret',
			{
				method: 'POST',
				baseUrl: client.HELPWISE_APP_BASE,
				body: { mailboxId: 10, threadId: 20, page: 1, limit: 10 },
			},
		);
	});

	it('sendSms calls POST /smsWhatsApp/sendMsg', async () => {
		mockedRequest.mockResolvedValue({ status: 'success' });
		await Messages.sendSms(ctx, {
			inboxId: 10,
			clientNumber: '+1234567890',
			body: 'Hello SMS',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/smsWhatsApp/sendMsg',
			'test_key:test_secret',
			{
				method: 'POST',
				body: {
					inboxId: 10,
					clientNumber: '+1234567890',
					body: 'Hello SMS',
				},
			},
		);
	});

	it('sendWhatsApp calls POST /smsWhatsApp/sendMsg with template', async () => {
		mockedRequest.mockResolvedValue({ status: 'success' });
		await Messages.sendWhatsApp(ctx, {
			inboxId: 10,
			clientNumber: '+1234567890',
			body: 'Hello WhatsApp',
			template: { templateId: 44, templateVariables: ['A', 'B'] },
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/smsWhatsApp/sendMsg',
			'test_key:test_secret',
			{
				method: 'POST',
				body: {
					inboxId: 10,
					clientNumber: '+1234567890',
					body: 'Hello WhatsApp',
					template: { templateId: 44, templateVariables: ['A', 'B'] },
				},
			},
		);
	});

	it('sendChat calls POST /dev-apis/chat/send', async () => {
		mockedRequest.mockResolvedValue({ status: 'success' });
		await Messages.sendChat(ctx, {
			mailbox_id: 1,
			thread_id: 2,
			message: 'Chat reply',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/dev-apis/chat/send',
			'test_key:test_secret',
			{
				method: 'POST',
				baseUrl: client.HELPWISE_APP_BASE,
				body: { mailbox_id: 1, thread_id: 2, message: 'Chat reply' },
			},
		);
	});
});

describe('Inboxes endpoints', () => {
	it('list calls POST /dev-apis/mailboxes/list', async () => {
		mockedRequest.mockResolvedValue({
			status: 'success',
			mailboxes: [{ id: 1, name: 'Support' }],
		});
		const result = await Inboxes.list(ctx, { page: 1, limit: 10 });
		expect(result.mailboxes).toHaveLength(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/dev-apis/mailboxes/list',
			'test_key:test_secret',
			{
				method: 'POST',
				baseUrl: client.HELPWISE_APP_BASE,
				body: { page: 1, limit: 10 },
			},
		);
	});

	it('get calls POST /dev-apis/mailboxes/get', async () => {
		mockedRequest.mockResolvedValue({
			status: 'success',
			mailbox: { id: 5, name: 'Sales' },
		});
		const result = await Inboxes.get(ctx, { id: 5 });
		expect(result.status).toBe('success');
		expect(mockedRequest).toHaveBeenCalledWith(
			'/dev-apis/mailboxes/get',
			'test_key:test_secret',
			{
				method: 'POST',
				baseUrl: client.HELPWISE_APP_BASE,
				body: { id: 5 },
			},
		);
	});
});

describe('Contacts endpoints', () => {
	it('list calls GET /contacts with limit and offset', async () => {
		mockedRequest.mockResolvedValue({
			nextPage: null,
			results: [{ id: 1, firstname: 'John' }],
		});
		const result = await Contacts.list(ctx, { limit: 10, offset: 20 });
		expect(result.results).toHaveLength(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/contacts',
			'test_key:test_secret',
			{
				method: 'GET',
				query: { limit: 10, offset: 20 },
			},
		);
	});

	it('get calls GET /contacts/:contactId', async () => {
		mockedRequest.mockResolvedValue({ id: 12, firstname: 'John' });
		const result = await Contacts.get(ctx, { contactId: 12 });
		expect(result.id).toBe(12);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/contacts/12',
			'test_key:test_secret',
			{ method: 'GET' },
		);
	});

	it('create calls POST /contacts', async () => {
		mockedRequest.mockResolvedValue({ id: 13, firstname: 'Alice' });
		const result = await Contacts.create(ctx, {
			firstname: 'Alice',
			lastname: 'Smith',
		});
		expect(result.id).toBe(13);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/contacts',
			'test_key:test_secret',
			{
				method: 'POST',
				body: { firstname: 'Alice', lastname: 'Smith' },
			},
		);
	});

	it('update calls PUT /contacts/:contactId', async () => {
		mockedRequest.mockResolvedValue({ id: 13, firstname: 'AliceUpdated' });
		const result = await Contacts.update(ctx, {
			contactId: 13,
			firstname: 'AliceUpdated',
		});
		expect(result.id).toBe(13);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/contacts/13',
			'test_key:test_secret',
			{
				method: 'PUT',
				body: { firstname: 'AliceUpdated' },
			},
		);
	});

	it('search calls GET /contacts/search', async () => {
		mockedRequest.mockResolvedValue({
			nextPage: null,
			result: [{ id: 1, firstname: 'John' }],
		});
		const result = await Contacts.search(ctx, { term: 'John', limit: 5 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/contacts/search',
			'test_key:test_secret',
			{
				method: 'GET',
				query: { term: 'John', limit: 5 },
			},
		);
	});
});

describe('Tags endpoints', () => {
	it('list calls GET /tags', async () => {
		mockedRequest.mockResolvedValue([{ id: 1, name: 'Billing' }]);
		const result = await Tags.list(ctx, {});
		expect(result).toHaveLength(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/tags',
			'test_key:test_secret',
			{
				method: 'GET',
			},
		);
	});

	it('get calls GET /tags/:tagId', async () => {
		mockedRequest.mockResolvedValue({ id: 2, name: 'Tech' });
		const result = await Tags.get(ctx, { tagId: 2 });
		expect(result.id).toBe(2);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/tags/2',
			'test_key:test_secret',
			{ method: 'GET' },
		);
	});

	it('apply calls POST /tags/apply', async () => {
		mockedRequest.mockResolvedValue({
			status: 'success',
			message: 'Applied',
		});
		await Tags.apply(ctx, { threadIds: [1], tagIds: [10] });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/tags/apply',
			'test_key:test_secret',
			{
				method: 'POST',
				body: { threadIds: [1], tagIds: [10] },
			},
		);
	});

	it('remove calls POST /tags/remove', async () => {
		mockedRequest.mockResolvedValue({
			status: 'success',
			message: 'Removed',
		});
		await Tags.remove(ctx, { threadIds: [1], tagIds: [10] });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/tags/remove',
			'test_key:test_secret',
			{
				method: 'POST',
				body: { threadIds: [1], tagIds: [10] },
			},
		);
	});
});

describe('CustomFields endpoints', () => {
	it('list calls GET /customFields', async () => {
		mockedRequest.mockResolvedValue({ data: [] });
		await CustomFields.list(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/customFields',
			'test_key:test_secret',
			{ method: 'GET' },
		);
	});

	it('get calls GET /customFields/:fieldId', async () => {
		mockedRequest.mockResolvedValue({ data: { id: 1 } });
		await CustomFields.get(ctx, { fieldId: 1 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/customFields/1',
			'test_key:test_secret',
			{ method: 'GET' },
		);
	});

	it('create calls POST /customFields', async () => {
		mockedRequest.mockResolvedValue({ status: 'success' });
		await CustomFields.create(ctx, {
			name: 'VIP',
			description: 'VIP status',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/customFields',
			'test_key:test_secret',
			{
				method: 'POST',
				body: { name: 'VIP', description: 'VIP status' },
			},
		);
	});

	it('update calls PUT /customFields/:fieldId', async () => {
		mockedRequest.mockResolvedValue({ status: 'success' });
		await CustomFields.update(ctx, { fieldId: 2, name: 'VIP Updated' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/customFields/2',
			'test_key:test_secret',
			{
				method: 'PUT',
				body: { name: 'VIP Updated' },
			},
		);
	});

	it('deleteField calls DELETE /customFields/:fieldId', async () => {
		mockedRequest.mockResolvedValue({ status: 'success' });
		await CustomFields.deleteField(ctx, { fieldId: 2 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/customFields/2',
			'test_key:test_secret',
			{ method: 'DELETE' },
		);
	});

	it('listByInbox calls GET /customFields/inbox/:inboxId', async () => {
		mockedRequest.mockResolvedValue({ data: [] });
		await CustomFields.listByInbox(ctx, { inboxId: 10 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/customFields/inbox/10',
			'test_key:test_secret',
			{ method: 'GET' },
		);
	});

	it('updateByInbox calls PUT /customFields/inbox/:inboxId', async () => {
		mockedRequest.mockResolvedValue({ status: 'success' });
		await CustomFields.updateByInbox(ctx, {
			inboxId: 10,
			hideIds: [1],
			unHideIds: [2],
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/customFields/inbox/10',
			'test_key:test_secret',
			{
				method: 'PUT',
				body: { hideIds: [1], unHideIds: [2] },
			},
		);
	});
});

describe('Users, Notes, WhatsApp and Reports endpoints', () => {
	it('users.getMe calls POST /dev-apis/users/me', async () => {
		mockedRequest.mockResolvedValue({ status: 'success', data: { id: 1 } });
		await Users.getMe(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/dev-apis/users/me',
			'test_key:test_secret',
			{
				method: 'POST',
				baseUrl: client.HELPWISE_APP_BASE,
				body: {},
			},
		);
	});

	it('users.list calls POST /dev-apis/users/list', async () => {
		mockedRequest.mockResolvedValue({ status: 'success', data: [] });
		await Users.list(ctx, { mailbox_id: 10 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/dev-apis/users/list',
			'test_key:test_secret',
			{
				method: 'POST',
				baseUrl: client.HELPWISE_APP_BASE,
				body: { mailbox_id: 10 },
			},
		);
	});

	it('notes.create calls POST /dev-apis/notes/add', async () => {
		mockedRequest.mockResolvedValue({ status: 'success', note_id: 101 });
		await Notes.create(ctx, {
			mailbox_id: 1,
			thread_id: 2,
			message: 'Note body',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/dev-apis/notes/add',
			'test_key:test_secret',
			{
				method: 'POST',
				baseUrl: client.HELPWISE_APP_BASE,
				body: { mailbox_id: 1, thread_id: 2, message: 'Note body' },
			},
		);
	});

	it('whatsapp.listTemplates calls POST /dev-apis/whatsapp/templates/list', async () => {
		mockedRequest.mockResolvedValue({ status: 'success', templates: [] });
		await Whatsapp.listTemplates(ctx, { mailbox_id: 10 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/dev-apis/whatsapp/templates/list',
			'test_key:test_secret',
			{
				method: 'POST',
				baseUrl: client.HELPWISE_APP_BASE,
				body: { mailbox_id: 10 },
			},
		);
	});

	it('reports.getOverall calls GET /reports', async () => {
		mockedRequest.mockResolvedValue({ total: 100 });
		await Reports.getOverall(ctx, {
			start: '2025-01-01',
			end: '2025-01-31',
			inboxId: 10,
			tagId: [1, 2],
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/reports',
			'test_key:test_secret',
			{
				method: 'GET',
				query: {
					start: '2025-01-01',
					end: '2025-01-31',
					inboxId: 10,
					'tagId[]': [1, 2],
				},
			},
		);
	});

	it('reports.getTags calls GET /inboxes/:inboxId/reports/tags', async () => {
		mockedRequest.mockResolvedValue({ tagReportsOutput: [] });
		await Reports.getTags(ctx, {
			inboxId: 10,
			start: '2025-01-01',
			end: '2025-01-31',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/inboxes/10/reports/tags',
			'test_key:test_secret',
			{
				method: 'GET',
				query: {
					start: '2025-01-01',
					end: '2025-01-31',
				},
			},
		);
	});
});
