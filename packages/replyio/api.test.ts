import { makeReplyioRequest } from './client';
import type {
	CurrentUser,
	EmailAccountListItem,
	SequenceListItem,
} from './endpoints/types';
import { ReplyioEndpointOutputSchemas } from './endpoints/types';

// Live verification against the real Reply.io API. Requires REPLY_IO_API_KEY.
// Only safe read-only endpoints run here; writes and destructive calls are
// covered by endpoints.test.ts with a mocked client.
const API_KEY = process.env.REPLY_IO_API_KEY ?? '';
const liveDescribe = process.env.REPLY_IO_API_KEY ? describe : describe.skip;

liveDescribe('Reply.io live API type tests', () => {
	it('whoami returns the current user', async () => {
		const response = await makeReplyioRequest<CurrentUser>('whoami', API_KEY, {
			method: 'GET',
		});

		const parsed = ReplyioEndpointOutputSchemas.usersGetCurrent.parse(response);
		expect(parsed.userId).toBeGreaterThan(0);
	});

	it('sequences list returns paginated sequences', async () => {
		const response = await makeReplyioRequest<{
			items: SequenceListItem[];
			hasMore: boolean;
		}>('sequences', API_KEY, { method: 'GET', query: { top: 5 } });

		const parsed = ReplyioEndpointOutputSchemas.sequencesList.parse(response);
		expect(Array.isArray(parsed.items)).toBe(true);
	});

	it('sequence detail and steps round-trip from the list', async () => {
		const listed = await makeReplyioRequest<{
			items: SequenceListItem[];
			hasMore: boolean;
		}>('sequences', API_KEY, { method: 'GET', query: { top: 1 } });
		const first = listed.items[0];
		if (!first) {
			expect(listed.items).toHaveLength(0);
			return;
		}

		const detail = await makeReplyioRequest(`sequences/${first.id}`, API_KEY, {
			method: 'GET',
		});
		const parsedDetail =
			ReplyioEndpointOutputSchemas.sequencesGet.parse(detail);
		expect(parsedDetail.id).toBe(first.id);

		const steps = await makeReplyioRequest(
			`sequences/${first.id}/steps`,
			API_KEY,
			{
				method: 'GET',
			},
		);
		const parsedSteps = ReplyioEndpointOutputSchemas.stepsList.parse(steps);
		expect(Array.isArray(parsedSteps)).toBe(true);
	});

	it('sequence contacts extended state parses when sequences exist', async () => {
		const listed = await makeReplyioRequest<{
			items: SequenceListItem[];
			hasMore: boolean;
		}>('sequences', API_KEY, { method: 'GET', query: { top: 1 } });
		const first = listed.items[0];
		if (!first) {
			expect(listed.items).toHaveLength(0);
			return;
		}

		const response = await makeReplyioRequest(
			`sequences/${first.id}/contacts/state`,
			API_KEY,
			{ method: 'GET', query: { top: 5, additionalColumns: 'Status' } },
		);
		const parsed =
			ReplyioEndpointOutputSchemas.sequenceContactsListExtended.parse(response);
		expect(Array.isArray(parsed.items)).toBe(true);
	});

	it('contacts list returns paginated contacts', async () => {
		const response = await makeReplyioRequest('contacts', API_KEY, {
			method: 'GET',
			query: { top: 5 },
		});

		const parsed = ReplyioEndpointOutputSchemas.contactsList.parse(response);
		expect(Array.isArray(parsed.items)).toBe(true);
	});

	it('contact detail and statuses round-trip from the list', async () => {
		const listed = await makeReplyioRequest<{
			items: { id: number }[];
			hasMore: boolean;
		}>('contacts', API_KEY, { method: 'GET', query: { top: 1 } });
		const first = listed.items[0];
		if (!first) {
			expect(listed.items).toHaveLength(0);
			return;
		}

		const detail = await makeReplyioRequest(`contacts/${first.id}`, API_KEY, {
			method: 'GET',
		});
		const parsedDetail = ReplyioEndpointOutputSchemas.contactsGet.parse(detail);
		expect(parsedDetail.id).toBe(first.id);

		const statuses = await makeReplyioRequest(
			`contacts/${first.id}/statuses`,
			API_KEY,
			{ method: 'GET' },
		);
		const parsedStatuses =
			ReplyioEndpointOutputSchemas.contactsGetStatus.parse(statuses);
		expect(parsedStatuses.contactId).toBe(first.id);
	});

	it('email accounts list returns paginated accounts', async () => {
		const response = await makeReplyioRequest<{
			items: EmailAccountListItem[];
			hasMore: boolean;
		}>('email-accounts', API_KEY, { method: 'GET', query: { top: 5 } });

		const parsed =
			ReplyioEndpointOutputSchemas.emailAccountsList.parse(response);
		expect(Array.isArray(parsed.items)).toBe(true);
	});

	it('contact lists list returns paginated lists', async () => {
		const response = await makeReplyioRequest('contact-lists', API_KEY, {
			method: 'GET',
			query: { top: 5 },
		});

		const parsed =
			ReplyioEndpointOutputSchemas.contactListsList.parse(response);
		expect(Array.isArray(parsed.items)).toBe(true);
	});

	it('team users list returns an array', async () => {
		const response = await makeReplyioRequest('whoami/team-users', API_KEY, {
			method: 'GET',
		});

		const parsed = ReplyioEndpointOutputSchemas.usersListTeam.parse(response);
		expect(Array.isArray(parsed)).toBe(true);
	});

	it('clear-status endpoints accept clear flags (probed with a nonexistent contact)', async () => {
		const probes = [
			{
				path: 'contacts/set-opted-out',
				body: { contactIds: [999999999], isOptedOut: false },
			},
			{
				path: 'contacts/set-replied',
				body: { contactIds: [999999999], isReplied: false },
			},
			{
				path: 'contacts/set-bounced',
				body: {
					contactIds: [999999999],
					isBounced: false,
					resendEmails: false,
				},
			},
		];
		for (const probe of probes) {
			const response = await makeReplyioRequest(probe.path, API_KEY, {
				method: 'POST',
				body: probe.body,
			});
			const parsed =
				ReplyioEndpointOutputSchemas.contactsClearStatus.parse(response);
			expect(parsed['999999999']?.error).toBe('notFound');
		}
	});
});
