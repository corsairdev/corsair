import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { segment } from './client';
import {
	Channels,
	ContactLists,
	Contacts,
	Conversations,
	Inboxes,
	Messages,
} from './endpoints';
import type { UnknownJson } from './json';
import {
	channel,
	channelsPage,
	contact,
	contactList,
	contactListsPage,
	contactsPage,
	conversation,
	conversationsPage,
	inbox,
	inboxesPage,
	message,
	messagesPage,
	missingKeyProblem,
} from './test-fixtures';
import { lastRequest, respond, respondEmpty } from './test-helpers';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'superchat-api-token';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return type is the widest one.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>; // unknown: per endpoint

function invoke(endpoint: AnyEndpoint, input: UnknownJson) {
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

/** The base carries the `v1.0` segment; `/v1` answers 405. */
function expectBaseAndKey() {
	const sent = lastRequest(fetchMock);
	expect(sent.origin).toBe('https://api.superchat.com');
	expect(sent.path.startsWith('/v1.0/')).toBe(true);
	expect(sent.headers.get('x-api-key')).toBe(API_KEY);
	expect(sent.headers.get('authorization')).toBeNull();
}

describe('contacts', () => {
	it('lists with the cursor query and returns the paged envelope', async () => {
		respond(fetchMock, contactsPage);

		const result = await invoke(Contacts.list, { limit: 10 });

		expectBaseAndKey();
		expect(lastRequest(fetchMock).path).toBe('/v1.0/contacts');
		expect(lastRequest(fetchMock).query).toEqual({ limit: '10' });
		expect(result).toMatchObject({ results: [contact] });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'superchat.contacts.list',
			{ count: 1 },
			'completed',
		);
	});

	it('rejects a request that sets both cursors, which Superchat refuses', async () => {
		await expect(
			invoke(Contacts.list, { after: 'a', before: 'b' }),
		).rejects.toThrow(/Send after or before, not both/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a limit above the documented maximum of 100', async () => {
		await expect(invoke(Contacts.list, { limit: 101 })).rejects.toThrow(
			/limit/,
		);
	});

	it('gets one contact', async () => {
		respond(fetchMock, contact);

		expect(await invoke(Contacts.get, { contactId: 'ct_1' })).toEqual(contact);
		expect(lastRequest(fetchMock).path).toBe('/v1.0/contacts/ct_1');
	});

	it('creates a contact with its handles', async () => {
		respond(fetchMock, contact);

		await invoke(Contacts.create, {
			first_name: 'Jane',
			last_name: 'Smith',
			gender: 'diverse',
			handles: [{ id: null, type: 'mail', value: 'jane@example.com' }],
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.body).toMatchObject({
			handles: [{ id: null, type: 'mail', value: 'jane@example.com' }],
		});
	});

	it('rejects a contact with no handle, which could not be identified', async () => {
		await expect(
			invoke(Contacts.create, { first_name: 'Jane', handles: [] }),
		).rejects.toThrow(/handles/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('requires the three fields the PATCH route insists on', async () => {
		respond(fetchMock, contact);

		await invoke(Contacts.update, {
			contactId: 'ct_1',
			first_name: 'Jane',
			last_name: 'Smith',
			gender: 'diverse',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PATCH');
		expect(sent.path).toBe('/v1.0/contacts/ct_1');
		expect(sent.body).toMatchObject({
			first_name: 'Jane',
			last_name: 'Smith',
			gender: 'diverse',
		});
	});

	it('rejects an update that omits gender, which the route requires', async () => {
		await expect(
			invoke(Contacts.update, {
				contactId: 'ct_1',
				first_name: 'Jane',
				last_name: 'Smith',
			}),
		).rejects.toThrow(/gender/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts an explicit null gender, which the route allows', async () => {
		respond(fetchMock, contact);

		await invoke(Contacts.update, {
			contactId: 'ct_1',
			first_name: 'Jane',
			last_name: 'Smith',
			gender: null,
		});

		expect(lastRequest(fetchMock).body).toMatchObject({ gender: null });
	});

	it('searches with expressions and the cursor query', async () => {
		respond(fetchMock, contactsPage);

		await invoke(Contacts.search, {
			query: {
				value: [{ field: 'mail', operator: '=', value: 'jane@example.com' }],
			},
			limit: 5,
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v1.0/contacts/search');
		expect(sent.query).toEqual({ limit: '5' });
		expect(sent.body).toEqual({
			query: {
				value: [{ field: 'mail', operator: '=', value: 'jane@example.com' }],
			},
		});
	});

	it('requires an identifier for a custom attribute search', async () => {
		await expect(
			invoke(Contacts.search, {
				query: {
					value: [{ field: 'custom_attribute', operator: '=', value: 'pro' }],
				},
			}),
		).rejects.toThrow(/identifier is required when field is custom_attribute/);
	});

	it('deletes a contact and reports the id', async () => {
		respondEmpty(fetchMock);

		const result = await invoke(Contacts.remove, { contactId: 'ct_1' });

		expect(lastRequest(fetchMock)).toMatchObject({
			method: 'DELETE',
			path: '/v1.0/contacts/ct_1',
		});
		expect(result).toEqual({ id: 'ct_1', deleted: true });
	});

	it('throws when a delete answers a body, so a failure is not read as success', async () => {
		respond(fetchMock, { exception: 'ApplicationException' });

		await expect(
			invoke(Contacts.remove, { contactId: 'ct_1' }),
		).rejects.toThrow(/answered a delete with a body/);
	});
});

describe('contactLists', () => {
	it('lists and creates', async () => {
		respond(fetchMock, contactListsPage);
		expect(await invoke(ContactLists.list, {})).toMatchObject({
			results: [contactList],
		});

		respond(fetchMock, contactList);
		await invoke(ContactLists.create, {
			name: 'Newsletter Subscribers',
			description: 'Contacts subscribed to the newsletter',
		});
		expect(lastRequest(fetchMock).body).toEqual({
			name: 'Newsletter Subscribers',
			description: 'Contacts subscribed to the newsletter',
		});
	});

	it('deletes a list and returns the id Superchat answers', async () => {
		respond(fetchMock, { id: contactList.id });

		const result = await invoke(ContactLists.remove, { contactListId: 'cl_1' });

		expect(lastRequest(fetchMock)).toMatchObject({
			method: 'DELETE',
			path: '/v1.0/contact-lists/cl_1',
		});
		expect(result).toMatchObject({ id: contactList.id });
	});

	it('pages the lists a contact belongs to', async () => {
		respond(fetchMock, contactListsPage);

		const result = await invoke(ContactLists.forContact, {
			contactId: 'ct_1',
			after: 'cl_0',
			limit: 10,
		});

		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/v1.0/contacts/ct_1/contact-lists');
		expect(sent.query).toMatchObject({ after: 'cl_0', limit: '10' });
		expect(result).toMatchObject({ results: [contactList] });
	});

	it('adds a contact with the list id in the body, not the path', async () => {
		respond(fetchMock, contactList);

		await invoke(ContactLists.addContact, {
			contactId: 'ct_1',
			contactListId: 'cl_1',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v1.0/contacts/ct_1/contact-lists');
		expect(sent.body).toEqual({ id: 'cl_1' });
	});

	it('removes a contact with the list id in the path', async () => {
		respond(fetchMock, contactList);

		await invoke(ContactLists.removeContact, {
			contactId: 'ct_1',
			contactListId: 'cl_1',
		});

		expect(lastRequest(fetchMock)).toMatchObject({
			method: 'DELETE',
			path: '/v1.0/contacts/ct_1/contact-lists/cl_1',
		});
	});
});

describe('conversations', () => {
	it('lists and gets', async () => {
		respond(fetchMock, conversationsPage);
		await invoke(Conversations.list, {});
		expect(lastRequest(fetchMock).path).toBe('/v1.0/conversations');

		respond(fetchMock, conversation);
		expect(await invoke(Conversations.get, { id: 'cv_1' })).toEqual(
			conversation,
		);
		expect(lastRequest(fetchMock).path).toBe('/v1.0/conversations/cv_1');
	});

	it('updates a conversation', async () => {
		respond(fetchMock, conversation);

		await invoke(Conversations.update, { id: 'cv_1', status: 'closed' });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PATCH');
		expect(sent.body).toEqual({ status: 'closed' });
	});

	it('rejects a snooze with no time, which the API refuses', async () => {
		await expect(
			invoke(Conversations.update, { id: 'cv_1', status: 'snoozed' }),
		).rejects.toThrow(/Snoozing needs a snoozed_until timestamp/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts a snooze that carries a time', async () => {
		respond(fetchMock, conversation);

		await invoke(Conversations.update, {
			id: 'cv_1',
			status: 'snoozed',
			snoozed_until: '2026-03-20T09:00:00Z',
		});

		expect(lastRequest(fetchMock).body).toEqual({
			status: 'snoozed',
			snoozed_until: '2026-03-20T09:00:00Z',
		});
	});

	it('lists the messages in a conversation', async () => {
		respond(fetchMock, messagesPage);

		const result = await invoke(Conversations.messages, {
			id: 'cv_1',
			after: 'ms_0',
			limit: 50,
		});

		expect(lastRequest(fetchMock).path).toBe(
			'/v1.0/conversations/cv_1/messages',
		);
		expect(lastRequest(fetchMock).query).toMatchObject({
			after: 'ms_0',
			limit: '50',
		});
		expect(result).toMatchObject({ results: [message] });
	});
});

describe('messages', () => {
	it('sends a text message with the channel and one recipient', async () => {
		respond(fetchMock, message);

		const result = await invoke(Messages.send, {
			to: [{ identifier: 'jane@example.com' }],
			from: { channel_id: 'mc_1', name: 'Acme Support' },
			content: { type: 'text', body: 'Hello!' },
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v1.0/messages');
		expect(sent.body).toEqual({
			to: [{ identifier: 'jane@example.com' }],
			from: { channel_id: 'mc_1', name: 'Acme Support' },
			content: { type: 'text', body: 'Hello!' },
		});
		expect(result).toMatchObject({ id: message.id });
		// The recipient handle is an email, so it must not reach the log.
		const logged = JSON.stringify(mockLog.mock.calls);
		expect(logged).not.toContain('jane@example.com');
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'superchat.messages.send',
			expect.objectContaining({ messageId: message.id, channelId: 'mc_1' }),
			'completed',
		);
	});

	it('rejects more than one recipient, which the spec caps at one', async () => {
		await expect(
			invoke(Messages.send, {
				to: [{ identifier: 'a' }, { identifier: 'b' }],
				from: { channel_id: 'mc_1', name: 'Acme' },
				content: { type: 'text', body: 'Hi' },
			}),
		).rejects.toThrow(/to/);
	});

	it('rejects an empty body', async () => {
		await expect(
			invoke(Messages.send, {
				to: [{ identifier: 'a' }],
				from: { channel_id: 'mc_1', name: 'Acme' },
				content: { type: 'text', body: '' },
			}),
		).rejects.toThrow(/body/);
	});

	it('gets one message', async () => {
		respond(fetchMock, message);

		expect(await invoke(Messages.get, { id: 'me_1' })).toEqual(message);
		expect(lastRequest(fetchMock).path).toBe('/v1.0/messages/me_1');
	});
});

describe('channels and inboxes', () => {
	it('lists and gets channels', async () => {
		respond(fetchMock, channelsPage);
		await invoke(Channels.list, { inbox_id: 'in_1' });
		expect(lastRequest(fetchMock).path).toBe('/v1.0/channels');
		expect(lastRequest(fetchMock).query).toEqual({ inbox_id: 'in_1' });

		respond(fetchMock, channel);
		expect(await invoke(Channels.get, { channelId: 'mc_1' })).toEqual(channel);
	});

	it('lists and gets inboxes', async () => {
		respond(fetchMock, inboxesPage);
		await invoke(Inboxes.list, {});
		expect(lastRequest(fetchMock).path).toBe('/v1.0/inboxes');

		respond(fetchMock, inbox);
		expect(await invoke(Inboxes.get, { inboxId: 'in_1' })).toEqual(inbox);
	});
});

describe('client error handling', () => {
	it('reads an exception envelope and keeps the key out of util.inspect', async () => {
		respond(fetchMock, missingKeyProblem, 401);
		const util = await import('node:util');

		const error = await invoke(Contacts.list, {}).catch(
			// unknown: a rejection reason has no static type; narrowed below.
			(caught: UnknownJson) => caught,
		);

		expect(error).toBeInstanceOf(ApiError);
		const failure = error as ApiError;
		expect(failure.status).toBe(401);
		// Both the localised message and the code are kept, with the code leading.
		expect(failure.message).toContain('MethodNotAllowedException');
		expect(failure.message).toContain('Methode nicht erlaubt');
		expect(util.inspect(error)).not.toContain(API_KEY);
		expect(failure.message).not.toContain(API_KEY);
	});

	it('treats a 403 as an auth error, because that is a wrong key here', async () => {
		respond(fetchMock, missingKeyProblem, 403);

		const error = await invoke(Contacts.list, {}).catch(
			// unknown: a rejection reason has no static type; narrowed below.
			(caught: UnknownJson) => caught,
		);

		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(403);
	});

	it('encodes a path segment', () => {
		expect(segment('a/b')).toBe('a%2Fb');
	});
});
