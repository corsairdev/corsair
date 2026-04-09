import 'dotenv/config';
import { makeOutlookRequest } from './client';
import type {
	CalendarsCreateResponse,
	CalendarsGetResponse,
	CalendarsListResponse,
	ContactsCreateResponse,
	ContactsListResponse,
	ContactsUpdateResponse,
	EventsCreateResponse,
	EventsGetResponse,
	EventsListResponse,
	EventsUpdateResponse,
	FoldersCreateResponse,
	FoldersGetResponse,
	FoldersListResponse,
	FoldersUpdateResponse,
	MessagesCreateDraftResponse,
	MessagesGetResponse,
	MessagesListResponse,
	MessagesMoveResponse,
	MessagesQueryResponse,
	MessagesSearchResponse,
	MessagesSendResponse,
	MessagesUpdateResponse,
} from './endpoints/types';
import { OutlookEndpointOutputSchemas } from './endpoints/types';

const ACCESS_TOKEN = process.env.OUTLOOK_ACCESS_TOKEN!;

// ── Shared test helpers ───────────────────────────────────────────────────────

const toUTCSlot = (date: Date) => ({
	dateTime: date.toISOString(),
	timeZone: 'UTC',
});

const makeDraftBody = (label: string) => ({
	subject: `Test Draft for ${label} ${Date.now()}`,
	body: { contentType: 'Text' as const, content: label },
});

describe('Outlook API Type Tests', () => {
	describe('messages', () => {
		let testMessageId: string | undefined;
		let testDraftId: string | undefined;
		let testFolderId: string | undefined;

		beforeAll(async () => {
			// Create a test mail folder to use for move operations
			const folderResult = await makeOutlookRequest<FoldersCreateResponse>(
				'/me/mailFolders',
				ACCESS_TOKEN,
				{
					method: 'POST',
					body: { displayName: `test-folder-${Date.now()}` },
				},
			);
			testFolderId = folderResult.id;
		});

		afterAll(async () => {
			if (testDraftId) {
				try {
					await makeOutlookRequest<void>(
						`/me/messages/${testDraftId}`,
						ACCESS_TOKEN,
						{ method: 'DELETE' },
					);
				} catch {}
			}
			if (testFolderId) {
				try {
					await makeOutlookRequest<void>(
						`/me/mailFolders/${testFolderId}`,
						ACCESS_TOKEN,
						{ method: 'DELETE' },
					);
				} catch {}
			}
		});

		it('messagesList returns correct type', async () => {
			const result = await makeOutlookRequest<MessagesListResponse>(
				'/me/messages',
				ACCESS_TOKEN,
				{ query: { $top: 10 } },
			);
			OutlookEndpointOutputSchemas.messagesList.parse(result);
			if (result.value?.length && result.value[0]?.id) {
				testMessageId = result.value[0].id;
			}
		});

		it('messagesGet returns correct type', async () => {
			if (!testMessageId) {
				const listResult = await makeOutlookRequest<MessagesListResponse>(
					'/me/messages',
					ACCESS_TOKEN,
					{ query: { $top: 1 } },
				);
				testMessageId = listResult.value?.[0]?.id;
				if (!testMessageId) throw new Error('No messages found');
			}

			const result = await makeOutlookRequest<MessagesGetResponse>(
				`/me/messages/${testMessageId}`,
				ACCESS_TOKEN,
			);
			OutlookEndpointOutputSchemas.messagesGet.parse(result);
		});

		it('messagesQuery returns correct type', async () => {
			const result = await makeOutlookRequest<MessagesQueryResponse>(
				'/me/messages',
				ACCESS_TOKEN,
				{ query: { $top: 5, $filter: 'isRead eq false' } },
			);
			OutlookEndpointOutputSchemas.messagesQuery.parse(result);
		});

		it('messagesSearch returns correct type', async () => {
			const result = await makeOutlookRequest<MessagesSearchResponse>(
				'/me/messages',
				ACCESS_TOKEN,
				{ query: { $search: '"test"', $top: 5 } },
			);
			OutlookEndpointOutputSchemas.messagesSearch.parse(result);
		});

		it('messagesCreateDraft returns correct type', async () => {
			const result = await makeOutlookRequest<MessagesCreateDraftResponse>(
				'/me/messages',
				ACCESS_TOKEN,
				{
					method: 'POST',
					body: {
						subject: `Test Draft ${Date.now()}`,
						body: { contentType: 'Text', content: 'Test draft body' },
						toRecipients: [{ emailAddress: { address: 'test@example.com' } }],
					},
				},
			);
			OutlookEndpointOutputSchemas.messagesCreateDraft.parse(result);
			testDraftId = result.id;
		});

		it('messagesUpdate returns correct type', async () => {
			if (!testDraftId) {
				const draft = await makeOutlookRequest<MessagesCreateDraftResponse>(
					'/me/messages',
					ACCESS_TOKEN,
					{ method: 'POST', body: makeDraftBody('Update') },
				);
				testDraftId = draft.id;
				if (!testDraftId) throw new Error('Failed to create draft');
			}

			const result = await makeOutlookRequest<MessagesUpdateResponse>(
				`/me/messages/${testDraftId}`,
				ACCESS_TOKEN,
				{
					method: 'PATCH',
					body: { isRead: true },
				},
			);
			OutlookEndpointOutputSchemas.messagesUpdate.parse(result);
		});

		it('messagesMove returns correct type', async () => {
			// Create a draft to move
			const draft = await makeOutlookRequest<MessagesCreateDraftResponse>(
				'/me/messages',
				ACCESS_TOKEN,
				{ method: 'POST', body: makeDraftBody('Move') },
			);
			if (!draft.id) throw new Error('Failed to create draft for move');
			if (!testFolderId) throw new Error('No test folder available');

			const result = await makeOutlookRequest<MessagesMoveResponse>(
				`/me/messages/${draft.id}/move`,
				ACCESS_TOKEN,
				{
					method: 'POST',
					body: { destinationId: testFolderId },
				},
			);
			OutlookEndpointOutputSchemas.messagesMove.parse(result);

			// Cleanup
			if (result.id) {
				try {
					await makeOutlookRequest<void>(
						`/me/messages/${result.id}`,
						ACCESS_TOKEN,
						{ method: 'DELETE' },
					);
				} catch {}
			}
		});
	});

	describe('calendars', () => {
		let testCalendarId: string | undefined;

		afterAll(async () => {
			if (testCalendarId) {
				try {
					await makeOutlookRequest<void>(
						`/me/calendars/${testCalendarId}`,
						ACCESS_TOKEN,
						{ method: 'DELETE' },
					);
				} catch {}
			}
		});

		it('calendarsList returns correct type', async () => {
			const result = await makeOutlookRequest<CalendarsListResponse>(
				'/me/calendars',
				ACCESS_TOKEN,
				{ query: { $top: 10 } },
			);
			OutlookEndpointOutputSchemas.calendarsList.parse(result);
		});

		it('calendarsCreate returns correct type', async () => {
			const result = await makeOutlookRequest<CalendarsCreateResponse>(
				'/me/calendars',
				ACCESS_TOKEN,
				{
					method: 'POST',
					body: { name: `Test Calendar ${Date.now()}` },
				},
			);
			OutlookEndpointOutputSchemas.calendarsCreate.parse(result);
			testCalendarId = result.id;
		});

		it('calendarsGet returns correct type', async () => {
			if (!testCalendarId) {
				const list = await makeOutlookRequest<CalendarsListResponse>(
					'/me/calendars',
					ACCESS_TOKEN,
					{ query: { $top: 1 } },
				);
				testCalendarId = list.value?.[0]?.id;
				if (!testCalendarId) throw new Error('No calendars found');
			}

			const result = await makeOutlookRequest<CalendarsGetResponse>(
				`/me/calendars/${testCalendarId}`,
				ACCESS_TOKEN,
			);
			OutlookEndpointOutputSchemas.calendarsGet.parse(result);
		});
	});

	describe('events', () => {
		let testCalendarId: string | undefined;
		let testEventId: string | undefined;

		beforeAll(async () => {
			const list = await makeOutlookRequest<CalendarsListResponse>(
				'/me/calendars',
				ACCESS_TOKEN,
				{ query: { $top: 1 } },
			);
			testCalendarId = list.value?.[0]?.id;
		});

		afterAll(async () => {
			if (testCalendarId && testEventId) {
				try {
					await makeOutlookRequest<void>(
						`/me/calendars/${testCalendarId}/events/${testEventId}`,
						ACCESS_TOKEN,
						{ method: 'DELETE' },
					);
				} catch {}
			}
		});

		it('eventsList returns correct type', async () => {
			if (!testCalendarId) throw new Error('No calendar available');

			const result = await makeOutlookRequest<EventsListResponse>(
				`/me/calendars/${testCalendarId}/events`,
				ACCESS_TOKEN,
				{ query: { $top: 5 } },
			);
			OutlookEndpointOutputSchemas.eventsList.parse(result);
		});

		it('eventsCreate returns correct type', async () => {
			if (!testCalendarId) throw new Error('No calendar available');

			const now = new Date();
			const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

			const result = await makeOutlookRequest<EventsCreateResponse>(
				`/me/calendars/${testCalendarId}/events`,
				ACCESS_TOKEN,
				{
					method: 'POST',
					body: {
						subject: `Test Event ${Date.now()}`,
						start: toUTCSlot(now),
						end: toUTCSlot(oneHourLater),
					},
				},
			);
			OutlookEndpointOutputSchemas.eventsCreate.parse(result);
			testEventId = result.id;
		});

		it('eventsGet returns correct type', async () => {
			if (!testCalendarId || !testEventId) {
				throw new Error('No calendar or event available');
			}

			const result = await makeOutlookRequest<EventsGetResponse>(
				`/me/calendars/${testCalendarId}/events/${testEventId}`,
				ACCESS_TOKEN,
			);
			OutlookEndpointOutputSchemas.eventsGet.parse(result);
		});

		it('eventsUpdate returns correct type', async () => {
			if (!testCalendarId || !testEventId) {
				throw new Error('No calendar or event available');
			}

			const result = await makeOutlookRequest<EventsUpdateResponse>(
				`/me/events/${testEventId}`,
				ACCESS_TOKEN,
				{
					method: 'PATCH',
					body: { subject: `Updated Test Event ${Date.now()}` },
				},
			);
			OutlookEndpointOutputSchemas.eventsUpdate.parse(result);
		});
	});

	describe('contacts', () => {
		let testContactId: string | undefined;

		afterAll(async () => {
			if (testContactId) {
				try {
					await makeOutlookRequest<void>(
						`/me/contacts/${testContactId}`,
						ACCESS_TOKEN,
						{ method: 'DELETE' },
					);
				} catch {}
			}
		});

		it('contactsList returns correct type', async () => {
			const result = await makeOutlookRequest<ContactsListResponse>(
				'/me/contacts',
				ACCESS_TOKEN,
				{ query: { $top: 10 } },
			);
			OutlookEndpointOutputSchemas.contactsList.parse(result);
		});

		it('contactsCreate returns correct type', async () => {
			const result = await makeOutlookRequest<ContactsCreateResponse>(
				'/me/contacts',
				ACCESS_TOKEN,
				{
					method: 'POST',
					body: {
						givenName: 'Test',
						surname: `Contact ${Date.now()}`,
						emailAddresses: [
							{
								address: `testcontact${Date.now()}@example.com`,
								name: 'Test Contact',
							},
						],
					},
				},
			);
			OutlookEndpointOutputSchemas.contactsCreate.parse(result);
			testContactId = result.id;
		});

		it('contactsUpdate returns correct type', async () => {
			if (!testContactId) {
				const created = await makeOutlookRequest<ContactsCreateResponse>(
					'/me/contacts',
					ACCESS_TOKEN,
					{
						method: 'POST',
						body: { givenName: 'Update', surname: `Contact ${Date.now()}` },
					},
				);
				testContactId = created.id;
				if (!testContactId) throw new Error('Failed to create contact');
			}

			const result = await makeOutlookRequest<ContactsUpdateResponse>(
				`/me/contacts/${testContactId}`,
				ACCESS_TOKEN,
				{
					method: 'PATCH',
					body: { jobTitle: 'Test Engineer' },
				},
			);
			OutlookEndpointOutputSchemas.contactsUpdate.parse(result);
		});
	});

	describe('folders', () => {
		let testFolderId: string | undefined;

		afterAll(async () => {
			if (testFolderId) {
				try {
					await makeOutlookRequest<void>(
						`/me/mailFolders/${testFolderId}`,
						ACCESS_TOKEN,
						{ method: 'DELETE' },
					);
				} catch {}
			}
		});

		it('foldersList returns correct type', async () => {
			const result = await makeOutlookRequest<FoldersListResponse>(
				'/me/mailFolders',
				ACCESS_TOKEN,
				{ query: { $top: 10 } },
			);
			OutlookEndpointOutputSchemas.foldersList.parse(result);
		});

		it('foldersCreate returns correct type', async () => {
			const result = await makeOutlookRequest<FoldersCreateResponse>(
				'/me/mailFolders',
				ACCESS_TOKEN,
				{
					method: 'POST',
					body: { displayName: `Test Folder ${Date.now()}` },
				},
			);
			OutlookEndpointOutputSchemas.foldersCreate.parse(result);
			testFolderId = result.id;
		});

		it('foldersGet returns correct type', async () => {
			if (!testFolderId) {
				const list = await makeOutlookRequest<FoldersListResponse>(
					'/me/mailFolders',
					ACCESS_TOKEN,
					{ query: { $top: 1 } },
				);
				testFolderId = list.value?.[0]?.id;
				if (!testFolderId) throw new Error('No folders found');
			}

			const result = await makeOutlookRequest<FoldersGetResponse>(
				`/me/mailFolders/${testFolderId}`,
				ACCESS_TOKEN,
			);
			OutlookEndpointOutputSchemas.foldersGet.parse(result);
		});

		it('foldersUpdate returns correct type', async () => {
			if (!testFolderId) {
				const created = await makeOutlookRequest<FoldersCreateResponse>(
					'/me/mailFolders',
					ACCESS_TOKEN,
					{
						method: 'POST',
						body: { displayName: `Test Folder Update ${Date.now()}` },
					},
				);
				testFolderId = created.id;
				if (!testFolderId) throw new Error('Failed to create folder');
			}

			const result = await makeOutlookRequest<FoldersUpdateResponse>(
				`/me/mailFolders/${testFolderId}`,
				ACCESS_TOKEN,
				{
					method: 'PATCH',
					body: { displayName: `Updated Folder ${Date.now()}` },
				},
			);
			OutlookEndpointOutputSchemas.foldersUpdate.parse(result);
		});

		it('messagesSend returns correct type', async () => {
			const result = await makeOutlookRequest<MessagesSendResponse>(
				'/me/sendMail',
				ACCESS_TOKEN,
				{
					method: 'POST',
					body: {
						message: {
							subject: `Test Email ${Date.now()}`,
							body: {
								contentType: 'Text',
								content: 'Test email body from API test',
							},
							toRecipients: [{ emailAddress: { address: 'test@example.com' } }],
						},
						saveToSentItems: false,
					},
				},
			);
			OutlookEndpointOutputSchemas.messagesSend.parse(result);
		});
	});
});
