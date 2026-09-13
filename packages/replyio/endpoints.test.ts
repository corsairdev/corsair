import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	ContactLists,
	Contacts,
	EmailAccounts,
	Schedules,
	SequenceContacts,
	Sequences,
	Steps,
	Users,
} from './endpoints';
import type { ReplyioEndpointContext } from './endpoints/context';
import { ReplyioEndpointOutputSchemas } from './endpoints/types';

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeReplyioRequest: jest.fn(),
	};
});

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

const mockMakeReplyioRequest = jest.mocked(client.makeReplyioRequest);
const mockLogEventFromContext = jest.mocked(logEventFromContext);

const ctx: ReplyioEndpointContext = {
	key: 'test-api-key',
	$getAccountId: async () => 'test-account-id',
};

beforeEach(() => {
	jest.clearAllMocks();
});

describe('contacts endpoints', () => {
	it('create issues POST /contacts and logs the event', async () => {
		const fixture = ReplyioEndpointOutputSchemas.contactsCreate.parse({
			id: 1,
			email: 'prospect@example.com',
			firstName: 'Ada',
		});
		mockMakeReplyioRequest.mockResolvedValue(fixture);

		const result = await Contacts.create(ctx, {
			email: 'prospect@example.com',
			firstName: 'Ada',
		});

		expect(result).toEqual(fixture);
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'contacts',
			'test-api-key',
			expect.objectContaining({ method: 'POST' }),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.contacts.create',
			expect.any(Object),
			'completed',
		);
	});

	it('get issues GET /contacts/:id', async () => {
		const fixture = ReplyioEndpointOutputSchemas.contactsGet.parse({
			id: 1,
			email: 'prospect@example.com',
		});
		mockMakeReplyioRequest.mockResolvedValue(fixture);

		const result = await Contacts.get(ctx, { id: 1 });

		expect(result).toEqual(fixture);
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'contacts/1',
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.contacts.get',
			expect.any(Object),
			'completed',
		);
	});

	it('update issues PATCH /contacts/:id', async () => {
		const fixture = ReplyioEndpointOutputSchemas.contactsUpdate.parse({
			id: 1,
			firstName: 'Grace',
		});
		mockMakeReplyioRequest.mockResolvedValue(fixture);

		const result = await Contacts.update(ctx, { id: 1, firstName: 'Grace' });

		expect(result).toEqual(fixture);
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'contacts/1',
			'test-api-key',
			expect.objectContaining({ method: 'PATCH' }),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.contacts.update',
			expect.any(Object),
			'completed',
		);
	});

	it('delete issues DELETE /contacts/:id and returns a success envelope', async () => {
		mockMakeReplyioRequest.mockResolvedValue(undefined);

		const result = await Contacts.delete(ctx, { id: 1 });

		expect(result).toEqual({ success: true });
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'contacts/1',
			'test-api-key',
			expect.objectContaining({ method: 'DELETE' }),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.contacts.delete',
			expect.any(Object),
			'completed',
		);
	});

	it('list issues GET /contacts with pagination query', async () => {
		const fixture = ReplyioEndpointOutputSchemas.contactsList.parse({
			items: [{ id: 1, email: 'prospect@example.com' }],
			hasMore: false,
		});
		mockMakeReplyioRequest.mockResolvedValue(fixture);

		const result = await Contacts.list(ctx, { top: 25, skip: 0 });

		expect(result).toEqual(fixture);
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'contacts',
			'test-api-key',
			expect.objectContaining({
				method: 'GET',
				query: { top: 25, skip: 0 },
			}),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.contacts.list',
			expect.any(Object),
			'completed',
		);
	});

	it('searchByEmail issues GET /contacts with the exact email', async () => {
		const fixture = ReplyioEndpointOutputSchemas.contactsSearchByEmail.parse({
			items: [{ id: 1, email: 'prospect@example.com' }],
			hasMore: false,
		});
		mockMakeReplyioRequest.mockResolvedValue(fixture);

		const result = await Contacts.searchByEmail(ctx, {
			email: 'prospect@example.com',
		});

		expect(result).toEqual(fixture);
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'contacts',
			'test-api-key',
			expect.objectContaining({
				method: 'GET',
				query: expect.objectContaining({ email: 'prospect@example.com' }),
			}),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.contacts.searchByEmail',
			expect.any(Object),
			'completed',
		);
	});

	it('getStatus issues GET /contacts/:id/statuses', async () => {
		const fixture = ReplyioEndpointOutputSchemas.contactsGetStatus.parse({
			contactId: 1,
			isOptedOut: false,
			callStatus: 'none',
			meetingStatus: 'none',
			sequences: [],
		});
		mockMakeReplyioRequest.mockResolvedValue(fixture);

		const result = await Contacts.getStatus(ctx, { id: 1 });

		expect(result).toEqual(fixture);
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'contacts/1/statuses',
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.contacts.getStatus',
			expect.any(Object),
			'completed',
		);
	});

	it('setStatus issues POST /contacts/set-status-in-sequence', async () => {
		const fixture = ReplyioEndpointOutputSchemas.contactsSetStatus.parse({});
		mockMakeReplyioRequest.mockResolvedValue(fixture);

		const result = await Contacts.setStatus(ctx, {
			contactIds: [1, 2],
			statusInSequence: 'paused',
		});

		expect(result).toEqual(fixture);
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'contacts/set-status-in-sequence',
			'test-api-key',
			expect.objectContaining({
				method: 'POST',
				body: { contactIds: [1, 2], statusInSequence: 'paused' },
			}),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.contacts.setStatus',
			expect.any(Object),
			'completed',
		);
	});

	it('clearStatus fans out to all three clear endpoints by default', async () => {
		const fixture = ReplyioEndpointOutputSchemas.contactsClearStatus.parse({});
		mockMakeReplyioRequest.mockResolvedValue(fixture);

		const result = await Contacts.clearStatus(ctx, { contactIds: [1] });

		expect(result).toEqual(fixture);
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'contacts/set-opted-out',
			'test-api-key',
			expect.objectContaining({
				method: 'POST',
				body: { contactIds: [1], isOptedOut: false },
			}),
		);
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'contacts/set-replied',
			'test-api-key',
			expect.objectContaining({
				method: 'POST',
				body: { contactIds: [1], isReplied: false },
			}),
		);
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'contacts/set-bounced',
			'test-api-key',
			expect.objectContaining({
				method: 'POST',
				body: { contactIds: [1], isBounced: false, resendEmails: false },
			}),
		);
		expect(mockMakeReplyioRequest).toHaveBeenCalledTimes(3);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.contacts.clearStatus',
			expect.any(Object),
			'completed',
		);
	});

	it('clearStatus only calls the selected statuses', async () => {
		const fixture = ReplyioEndpointOutputSchemas.contactsClearStatus.parse({});
		mockMakeReplyioRequest.mockResolvedValue(fixture);

		const result = await Contacts.clearStatus(ctx, {
			contactIds: [1],
			statuses: ['optedOut'],
		});

		expect(result).toEqual(fixture);
		expect(mockMakeReplyioRequest).toHaveBeenCalledTimes(1);
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'contacts/set-opted-out',
			'test-api-key',
			expect.objectContaining({ method: 'POST' }),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.contacts.clearStatus',
			expect.any(Object),
			'completed',
		);
	});
});

describe('sequences endpoints', () => {
	it('list issues GET /sequences with pagination query', async () => {
		const fixture = ReplyioEndpointOutputSchemas.sequencesList.parse({
			items: [{ id: 1, name: 'Outbound', status: 'new', isArchived: false }],
			hasMore: false,
		});
		mockMakeReplyioRequest.mockResolvedValue(fixture);

		const result = await Sequences.list(ctx, { top: 25 });

		expect(result).toEqual(fixture);
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'sequences',
			'test-api-key',
			expect.objectContaining({
				method: 'GET',
				query: expect.objectContaining({ top: 25 }),
			}),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.sequences.list',
			expect.any(Object),
			'completed',
		);
	});

	it('get issues GET /sequences/:id', async () => {
		const fixture = ReplyioEndpointOutputSchemas.sequencesGet.parse({
			id: 1,
			name: 'Outbound',
			status: 'active',
			isArchived: false,
		});
		mockMakeReplyioRequest.mockResolvedValue(fixture);

		const result = await Sequences.get(ctx, { sequenceId: 1 });

		expect(result).toEqual(fixture);
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'sequences/1',
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.sequences.get',
			expect.any(Object),
			'completed',
		);
	});

	it('delete issues DELETE /sequences/:id and returns a success envelope', async () => {
		mockMakeReplyioRequest.mockResolvedValue(undefined);

		const result = await Sequences.delete(ctx, { sequenceId: 1 });

		expect(result).toEqual({ success: true });
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'sequences/1',
			'test-api-key',
			expect.objectContaining({ method: 'DELETE' }),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.sequences.delete',
			expect.any(Object),
			'completed',
		);
	});

	it('start issues POST /sequences/:id/start', async () => {
		const fixture = ReplyioEndpointOutputSchemas.sequencesStart.parse({
			id: 1,
			name: 'Outbound',
			status: 'active',
			isArchived: false,
		});
		mockMakeReplyioRequest.mockResolvedValue(fixture);

		const result = await Sequences.start(ctx, { sequenceId: 1 });

		expect(result).toEqual(fixture);
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'sequences/1/start',
			'test-api-key',
			expect.objectContaining({ method: 'POST' }),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.sequences.start',
			expect.any(Object),
			'completed',
		);
	});

	it('pause issues POST /sequences/:id/pause', async () => {
		const fixture = ReplyioEndpointOutputSchemas.sequencesPause.parse({
			id: 1,
			name: 'Outbound',
			status: 'paused',
			isArchived: false,
		});
		mockMakeReplyioRequest.mockResolvedValue(fixture);

		const result = await Sequences.pause(ctx, { sequenceId: 1 });

		expect(result).toEqual(fixture);
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'sequences/1/pause',
			'test-api-key',
			expect.objectContaining({ method: 'POST' }),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.sequences.pause',
			expect.any(Object),
			'completed',
		);
	});

	it('archive issues POST /sequences/:id/archive', async () => {
		const fixture = ReplyioEndpointOutputSchemas.sequencesArchive.parse({
			id: 1,
			name: 'Outbound',
			status: 'paused',
			isArchived: true,
		});
		mockMakeReplyioRequest.mockResolvedValue(fixture);

		const result = await Sequences.archive(ctx, { sequenceId: 1 });

		expect(result).toEqual(fixture);
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'sequences/1/archive',
			'test-api-key',
			expect.objectContaining({ method: 'POST' }),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.sequences.archive',
			expect.any(Object),
			'completed',
		);
	});
});

describe('steps endpoints', () => {
	it('list issues GET /sequences/:id/steps', async () => {
		const fixture = ReplyioEndpointOutputSchemas.stepsList.parse([
			{ id: 10, type: 'email' },
		]);
		mockMakeReplyioRequest.mockResolvedValue(fixture);

		const result = await Steps.list(ctx, { sequenceId: 1 });

		expect(result).toEqual(fixture);
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'sequences/1/steps',
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.steps.list',
			expect.any(Object),
			'completed',
		);
	});

	it('get issues GET /sequences/:id/steps/:stepId', async () => {
		const fixture = ReplyioEndpointOutputSchemas.stepsGet.parse({
			id: 10,
			type: 'email',
		});
		mockMakeReplyioRequest.mockResolvedValue(fixture);

		const result = await Steps.get(ctx, { sequenceId: 1, stepId: 10 });

		expect(result).toEqual(fixture);
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'sequences/1/steps/10',
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.steps.get',
			expect.any(Object),
			'completed',
		);
	});

	it('create issues POST /sequences/:id/steps', async () => {
		const fixture = ReplyioEndpointOutputSchemas.stepsCreate.parse({
			id: 11,
			type: 'call',
		});
		mockMakeReplyioRequest.mockResolvedValue(fixture);

		const result = await Steps.create(ctx, {
			sequenceId: 1,
			step: { type: 'call', delayInMinutes: 60 },
		});

		expect(result).toEqual(fixture);
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'sequences/1/steps',
			'test-api-key',
			expect.objectContaining({
				method: 'POST',
				body: { type: 'call', delayInMinutes: 60 },
			}),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.steps.create',
			expect.any(Object),
			'completed',
		);
	});
});

describe('sequenceContacts endpoints', () => {
	it('add issues POST /sequences/:id/contact-links/bulk', async () => {
		const fixture = ReplyioEndpointOutputSchemas.sequenceContactsAdd.parse({
			added: [2],
			notProcessed: {},
		});
		mockMakeReplyioRequest.mockResolvedValue(fixture);

		const result = await SequenceContacts.add(ctx, {
			sequenceId: 1,
			contactIds: [2],
		});

		expect(result).toEqual(fixture);
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'sequences/1/contact-links/bulk',
			'test-api-key',
			expect.objectContaining({
				method: 'POST',
				body: expect.objectContaining({ contactIds: [2] }),
			}),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.sequenceContacts.add',
			expect.any(Object),
			'completed',
		);
	});

	it('remove issues DELETE on the contact link and returns a success envelope', async () => {
		mockMakeReplyioRequest.mockResolvedValue(undefined);

		const result = await SequenceContacts.remove(ctx, {
			sequenceId: 1,
			contactId: 2,
		});

		expect(result).toEqual({ success: true });
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'sequences/1/contact-links/2',
			'test-api-key',
			expect.objectContaining({ method: 'DELETE' }),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.sequenceContacts.remove',
			expect.any(Object),
			'completed',
		);
	});

	it('bulkRemove issues POST /sequences/:id/contact-links/bulk-delete', async () => {
		const fixture =
			ReplyioEndpointOutputSchemas.sequenceContactsBulkRemove.parse({
				requested: 2,
				removed: 1,
				notFound: 0,
				notInSequence: 1,
				removedIds: [2],
			});
		mockMakeReplyioRequest.mockResolvedValue(fixture);

		const result = await SequenceContacts.bulkRemove(ctx, {
			sequenceId: 1,
			contactIds: [2, 3],
		});

		expect(result).toEqual(fixture);
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'sequences/1/contact-links/bulk-delete',
			'test-api-key',
			expect.objectContaining({
				method: 'POST',
				body: { contactIds: [2, 3] },
			}),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.sequenceContacts.bulkRemove',
			expect.any(Object),
			'completed',
		);
	});

	it('listExtended issues GET /sequences/:id/contacts/state', async () => {
		const fixture =
			ReplyioEndpointOutputSchemas.sequenceContactsListExtended.parse({
				items: [{ contactId: 2, email: 'prospect@example.com' }],
				hasMore: false,
			});
		mockMakeReplyioRequest.mockResolvedValue(fixture);

		const result = await SequenceContacts.listExtended(ctx, {
			sequenceId: 1,
			additionalColumns: ['Status'],
		});

		expect(result).toEqual(fixture);
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'sequences/1/contacts/state',
			'test-api-key',
			expect.objectContaining({
				method: 'GET',
				query: expect.objectContaining({ additionalColumns: 'Status' }),
			}),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.sequenceContacts.listExtended',
			expect.any(Object),
			'completed',
		);
	});

	it('setStatus issues POST /sequences/:id/contacts/set-status-in-sequence', async () => {
		const fixture =
			ReplyioEndpointOutputSchemas.sequenceContactsSetStatus.parse({});
		mockMakeReplyioRequest.mockResolvedValue(fixture);

		const result = await SequenceContacts.setStatus(ctx, {
			sequenceId: 1,
			contactIds: [2],
			statusInSequence: 'paused',
		});

		expect(result).toEqual(fixture);
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'sequences/1/contacts/set-status-in-sequence',
			'test-api-key',
			expect.objectContaining({
				method: 'POST',
				body: { contactIds: [2], statusInSequence: 'paused' },
			}),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.sequenceContacts.setStatus',
			expect.any(Object),
			'completed',
		);
	});
});

describe('emailAccounts endpoints', () => {
	it('list issues GET /email-accounts with pagination query', async () => {
		const fixture = ReplyioEndpointOutputSchemas.emailAccountsList.parse({
			items: [
				{
					id: 1,
					email: 'sender@example.com',
					emailAccountType: 'gmail',
					connectionStatus: 'connected',
				},
			],
			hasMore: false,
		});
		mockMakeReplyioRequest.mockResolvedValue(fixture);

		const result = await EmailAccounts.list(ctx, { top: 25 });

		expect(result).toEqual(fixture);
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'email-accounts',
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.emailAccounts.list',
			expect.any(Object),
			'completed',
		);
	});

	it('listDisconnected filters by disconnected status', async () => {
		const fixture =
			ReplyioEndpointOutputSchemas.emailAccountsListDisconnected.parse({
				items: [
					{
						id: 2,
						email: 'broken@example.com',
						emailAccountType: 'custom',
						connectionStatus: 'disconnected',
					},
				],
				hasMore: false,
			});
		mockMakeReplyioRequest.mockResolvedValue(fixture);

		const result = await EmailAccounts.listDisconnected(ctx, {});

		expect(result).toEqual(fixture);
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'email-accounts/filter',
			'test-api-key',
			expect.objectContaining({
				method: 'POST',
				body: { status: 'disconnected' },
			}),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.emailAccounts.listDisconnected',
			expect.any(Object),
			'completed',
		);
	});

	it('update issues PATCH /email-accounts/:id', async () => {
		const fixture = ReplyioEndpointOutputSchemas.emailAccountsUpdate.parse({
			id: 1,
			email: 'sender@example.com',
			emailAccountType: 'custom',
			connectionStatus: 'connected',
		});
		mockMakeReplyioRequest.mockResolvedValue(fixture);

		const result = await EmailAccounts.update(ctx, {
			id: 1,
			safety: { dailyLimit: 50 },
		});

		expect(result).toEqual(fixture);
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'email-accounts/1',
			'test-api-key',
			expect.objectContaining({
				method: 'PATCH',
				body: { safety: { dailyLimit: 50 } },
			}),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.emailAccounts.update',
			expect.any(Object),
			'completed',
		);
	});

	it('delete issues DELETE /email-accounts/:id and returns a success envelope', async () => {
		mockMakeReplyioRequest.mockResolvedValue(undefined);

		const result = await EmailAccounts.delete(ctx, { id: 1 });

		expect(result).toEqual({ success: true });
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'email-accounts/1',
			'test-api-key',
			expect.objectContaining({ method: 'DELETE' }),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.emailAccounts.delete',
			expect.any(Object),
			'completed',
		);
	});

	it('connectGmail captures the Google consent redirect without following it', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(null, {
				status: 302,
				headers: { Location: 'https://accounts.google.com/consent?x=1' },
			}),
		);

		const result = await EmailAccounts.connectGmail(ctx, {});

		expect(result).toEqual({
			url: 'https://accounts.google.com/consent?x=1',
			provider: 'gmail',
		});
		expect(fetchSpy).toHaveBeenCalledWith(
			'https://api.reply.io/v3/email-accounts/connect/gmail',
			expect.objectContaining({
				method: 'GET',
				redirect: 'manual',
				headers: expect.objectContaining({
					Authorization: 'Bearer test-api-key',
				}),
			}),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.emailAccounts.connectGmail',
			expect.any(Object),
			'completed',
		);
		fetchSpy.mockRestore();
	});

	it('connectOffice365 captures the Microsoft consent redirect without following it', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(null, {
				status: 302,
				headers: { Location: 'https://login.microsoftonline.com/consent?x=1' },
			}),
		);

		const result = await EmailAccounts.connectOffice365(ctx, {});

		expect(result).toEqual({
			url: 'https://login.microsoftonline.com/consent?x=1',
			provider: 'office-365',
		});
		expect(fetchSpy).toHaveBeenCalledWith(
			'https://api.reply.io/v3/email-accounts/connect/office-365',
			expect.objectContaining({
				method: 'GET',
				redirect: 'manual',
				headers: expect.objectContaining({
					Authorization: 'Bearer test-api-key',
				}),
			}),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.emailAccounts.connectOffice365',
			expect.any(Object),
			'completed',
		);
		fetchSpy.mockRestore();
	});
});

describe('schedules, users and contactLists endpoints', () => {
	it('schedules.delete issues DELETE /schedules/:id and returns a success envelope', async () => {
		mockMakeReplyioRequest.mockResolvedValue(undefined);

		const result = await Schedules.delete(ctx, { id: 1 });

		expect(result).toEqual({ success: true });
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'schedules/1',
			'test-api-key',
			expect.objectContaining({ method: 'DELETE' }),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.schedules.delete',
			expect.any(Object),
			'completed',
		);
	});

	it('users.getCurrent issues GET /whoami', async () => {
		const fixture = ReplyioEndpointOutputSchemas.usersGetCurrent.parse({
			userId: 7,
			username: 'agent',
			teamId: 3,
		});
		mockMakeReplyioRequest.mockResolvedValue(fixture);

		const result = await Users.getCurrent(ctx, {});

		expect(result).toEqual(fixture);
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'whoami',
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.users.getCurrent',
			expect.any(Object),
			'completed',
		);
	});

	it('users.listTeam issues GET /whoami/team-users', async () => {
		const fixture = ReplyioEndpointOutputSchemas.usersListTeam.parse([
			{
				teamId: 3,
				teamName: 'Sales',
				userId: 7,
				userName: 'agent',
				userEmail: 'agent@example.com',
			},
		]);
		mockMakeReplyioRequest.mockResolvedValue(fixture);

		const result = await Users.listTeam(ctx, {});

		expect(result).toEqual(fixture);
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'whoami/team-users',
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.users.listTeam',
			expect.any(Object),
			'completed',
		);
	});

	it('contactLists.list issues GET /contact-lists with search query', async () => {
		const fixture = ReplyioEndpointOutputSchemas.contactListsList.parse({
			items: [{ id: 2, name: 'Q3 Prospects', isShared: false }],
			hasMore: false,
		});
		mockMakeReplyioRequest.mockResolvedValue(fixture);

		const result = await ContactLists.list(ctx, { search: 'Q3' });

		expect(result).toEqual(fixture);
		expect(mockMakeReplyioRequest).toHaveBeenCalledWith(
			'contact-lists',
			'test-api-key',
			expect.objectContaining({
				method: 'GET',
				query: expect.objectContaining({ search: 'Q3' }),
			}),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'replyio.contactLists.list',
			expect.any(Object),
			'completed',
		);
	});
});
