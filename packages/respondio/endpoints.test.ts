import { logEventFromContext } from 'corsair/core';
import { Contacts, Conversations, Messages, Space } from './endpoints';
import {
	ACK,
	CHANNELS,
	CLOSING_NOTES,
	COMMENT,
	CONTACT,
	CONTACT_CHANNELS,
	CONTACT_ID,
	CONTACTS,
	CUSTOM_FIELDS,
	LIFECYCLE_ACK,
	MESSAGE,
	MESSAGE_SENT,
	MESSAGES,
	MESSAGES_EMPTY_PAGE_WITH_NEXT,
	MESSAGES_WITH_COMMENTS,
	TEMPLATES,
	UNPROCESSABLE,
	USERS,
	VALIDATION_ERROR,
} from './test-fixtures';
import { invoke, lastRequest, respond } from './test-support';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('contacts.get', () => {
	it('reads a contact by prefixed identifier', async () => {
		respond(fetchMock, CONTACT);

		const result = (await invoke(Contacts.get, {
			identifier: 'id:12345',
		})) as { id?: number; status?: string; lifecycle?: string };

		expect(lastRequest(fetchMock).path).toBe('/v2/contact/id%3A12345');
		expect(result.id).toBe(12345);
		expect(result.status).toBe('open');
		expect(result.lifecycle).toBe('Hot Lead');
	});

	it('treats a bare value as an ID', async () => {
		respond(fetchMock, CONTACT);

		await invoke(Contacts.get, { identifier: '12345' });

		expect(lastRequest(fetchMock).path).toBe('/v2/contact/id%3A12345');
	});

	it('accepts an email identifier', async () => {
		respond(fetchMock, CONTACT);

		await invoke(Contacts.get, { identifier: 'email:a@b.com' });

		expect(lastRequest(fetchMock).path).toBe('/v2/contact/email%3Aa%40b.com');
	});

	it('keeps the custom fields and tags', async () => {
		respond(fetchMock, CONTACT);

		const result = (await invoke(Contacts.get, { identifier: 'id:1' })) as {
			// unknown: only the fields asserted below are read from the result.
			custom_fields?: { name?: string; value?: unknown }[];
			tags?: string[];
			assignee?: { email?: string };
		};

		expect(result.custom_fields?.[0]?.name).toBe('Company Website');
		expect(result.tags).toEqual(['new_customer', 'sales']);
		expect(result.assignee?.email).toBe('jane@example.com');
	});

	it('logs the contact ID and status, never the email', async () => {
		respond(fetchMock, CONTACT);

		await invoke(Contacts.get, { identifier: 'email:test@example.com' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'respondio.contact.get',
			{ contactId: 12345, status: 'open', tags: 2 },
			'completed',
		);
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain(
			'test@example.com',
		);
	});

	it('rejects an empty identifier', async () => {
		await expect(invoke(Contacts.get, { identifier: '' })).rejects.toThrow();
	});
});

describe('contacts.create', () => {
	it('posts the fields to the contact identifier', async () => {
		respond(fetchMock, ACK);

		const result = (await invoke(Contacts.create, {
			identifier: 'phone:+60123456789',
			firstName: 'Muhammad',
			email: 'test@example.com',
			countryCode: 'MY',
		})) as { code?: string | number; message?: string };

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.path).toBe('/v2/contact/phone%3A%2B60123456789');
		expect(request.bodyRecord).toMatchObject({
			firstName: 'Muhammad',
			email: 'test@example.com',
			countryCode: 'MY',
		});
		// The docs call this code a string; the live API sends the number 200.
		expect(result.code).toBe(200);
	});

	it('keeps custom_fields with their formatted values', async () => {
		respond(fetchMock, ACK);

		await invoke(Contacts.create, {
			identifier: 'id:1',
			firstName: 'A',
			custom_fields: [
				{ name: 'Company Website', value: 'https://example.com' },
				{ name: 'Renewal', value: '2025-01-01' },
				{ name: 'Seats', value: 10 },
			],
		});

		expect(lastRequest(fetchMock).bodyRecord?.custom_fields).toEqual([
			{ name: 'Company Website', value: 'https://example.com' },
			{ name: 'Renewal', value: '2025-01-01' },
			{ name: 'Seats', value: 10 },
		]);
	});

	it('rejects a create with no firstName, which respond.io requires', async () => {
		await expect(
			invoke(Contacts.create, { identifier: 'id:1' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('contacts.update', () => {
	it('puts the changed fields and returns the contact ID', async () => {
		respond(fetchMock, CONTACT_ID);

		const result = (await invoke(Contacts.update, {
			identifier: 'id:12345',
			firstName: 'Updated',
		})) as { contactId?: number };

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('PUT');
		expect(request.path).toBe('/v2/contact/id%3A12345');
		expect(request.bodyRecord).toEqual({ firstName: 'Updated' });
		expect(result.contactId).toBe(12345);
	});

	it('rejects an empty identifier', async () => {
		await expect(
			invoke(Contacts.update, { identifier: '', firstName: 'x' }),
		).rejects.toThrow();
	});
});

describe('contacts.delete', () => {
	it('deletes by identifier', async () => {
		respond(fetchMock, CONTACT_ID);

		await invoke(Contacts.remove, { identifier: 'id:12345' });

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('DELETE');
		expect(request.path).toBe('/v2/contact/id%3A12345');
	});
});

describe('contacts.upsert', () => {
	it('uses the create_or_update route, not create', async () => {
		respond(fetchMock, CONTACT_ID);

		await invoke(Contacts.upsert, {
			identifier: 'email:a@b.com',
			firstName: 'A',
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.path).toBe('/v2/contact/create_or_update/email%3Aa%40b.com');
	});

	it('logs the identifier kind, never the email itself', async () => {
		respond(fetchMock, CONTACT_ID);

		await invoke(Contacts.upsert, {
			identifier: 'email:test@example.com',
			firstName: 'A',
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'respondio.contact.upsert',
			{ identifierKind: 'email' },
			'completed',
		);
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain(
			'test@example.com',
		);
	});
});

describe('contacts.merge', () => {
	it('posts both contact IDs and the merged fields, as the docs specify', async () => {
		respond(fetchMock, CONTACT_ID);

		const result = (await invoke(Contacts.merge, {
			contactIds: [1, 2],
			firstName: 'Muhammad',
			email: 'test@example.com',
		})) as { contactId?: number };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v2/contact/merge');
		expect(request.bodyRecord).toEqual({
			contactIds: [1, 2],
			firstName: 'Muhammad',
			email: 'test@example.com',
		});
		expect(result.contactId).toBe(12345);
	});

	it('rejects a merge with one contact ID', async () => {
		await expect(
			invoke(Contacts.merge, { contactIds: [1], firstName: 'A' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects prefixed identifiers, which the merge route does not take', async () => {
		await expect(
			invoke(Contacts.merge, {
				contactIds: ['id:1', 'id:2'],
				firstName: 'A',
			}),
		).rejects.toThrow();
	});
});

describe('contacts.list', () => {
	it('posts an $and filter', async () => {
		respond(fetchMock, CONTACTS);

		const result = (await invoke(Contacts.list, {
			filter: {
				$and: [
					{
						category: 'contactTag',
						field: 'vip',
						operator: 'hasAnyOf',
						value: ['vip'],
					},
				],
			},
		})) as { items?: { id?: number }[]; pagination?: { next?: string } };

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.path).toBe('/v2/contact/list');
		expect(result.items).toHaveLength(2);
		expect(result.pagination?.next).toBeDefined();
	});

	it('accepts an $or filter', async () => {
		respond(fetchMock, CONTACTS);

		await invoke(Contacts.list, {
			filter: {
				$or: [
					{
						category: 'contactField',
						field: 'countryCode',
						operator: 'isEqualTo',
						value: 'MY',
					},
					{ category: 'lifecycle', field: 'Hot Lead', operator: 'isEqualTo' },
				],
			},
		});

		expect(fetchMock).toHaveBeenCalled();
	});

	it('fills in the filter and timezone respond.io requires with a search', async () => {
		respond(fetchMock, CONTACTS);

		await invoke(Contacts.list, { search: 'jane' });

		expect(lastRequest(fetchMock).bodyRecord).toEqual({
			search: 'jane',
			filter: { $and: [] },
			timezone: 'UTC',
		});
	});

	it('rejects a filter with both $and and $or', async () => {
		await expect(
			invoke(Contacts.list, {
				filter: {
					$and: [{ category: 'lifecycle', field: 'x', operator: 'exists' }],
					$or: [{ category: 'lifecycle', field: 'y', operator: 'exists' }],
				},
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('sends an empty search, an empty filter and UTC when given nothing', async () => {
		respond(fetchMock, CONTACTS);

		await invoke(Contacts.list, {});

		// respond.io answers 400 when any of the three is missing.
		expect(lastRequest(fetchMock).bodyRecord).toEqual({
			search: '',
			filter: { $and: [] },
			timezone: 'UTC',
		});
	});

	it('rejects an operator respond.io does not document', async () => {
		await expect(
			invoke(Contacts.list, {
				filter: {
					$and: [{ category: 'lifecycle', field: 'x', operator: 'contains' }],
				},
			}),
		).rejects.toThrow();
	});

	it('sends the page in the query and the timezone in the body', async () => {
		respond(fetchMock, CONTACTS);

		await invoke(Contacts.list, {
			search: 'x',
			timezone: 'Asia/Kuala_Lumpur',
			cursorId: 10,
			limit: 50,
		});

		const request = lastRequest(fetchMock);
		expect(request.query).toEqual({ limit: '50', cursorId: '10' });
		expect(request.bodyRecord).toEqual({
			search: 'x',
			filter: { $and: [] },
			timezone: 'Asia/Kuala_Lumpur',
		});
	});

	it('takes the previous pagination.next URL as the cursor', async () => {
		respond(fetchMock, CONTACTS);

		await invoke(Contacts.list, {
			cursorId: 'https://api.respond.io/contact/list?limit=10&cursorId=-10',
		});

		expect(lastRequest(fetchMock).query.cursorId).toBe('-10');
	});

	it('rejects a page size of 100, which respond.io refuses', async () => {
		await expect(invoke(Contacts.list, { limit: 100 })).rejects.toThrow();
	});
});

describe('contact tags', () => {
	it('adds tags with POST, sending the bare array respond.io expects', async () => {
		respond(fetchMock, CONTACT_ID);

		const result = (await invoke(Contacts.addTags, {
			identifier: 'id:1',
			tags: ['vip', 'renewal'],
		})) as { contactId?: number };

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.path).toBe('/v2/contact/id%3A1/tag');
		// `{ tags: [...] }` is answered with 400 "Tags: Cannot be empty".
		expect(request.body).toEqual(['vip', 'renewal']);
		expect(result.contactId).toBe(12345);
	});

	it('removes tags with DELETE on the same path and the same bare array', async () => {
		respond(fetchMock, CONTACT_ID);

		await invoke(Contacts.deleteTags, { identifier: 'id:1', tags: ['vip'] });

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('DELETE');
		expect(request.path).toBe('/v2/contact/id%3A1/tag');
		expect(request.body).toEqual(['vip']);
	});

	it('rejects more than 10 tags', async () => {
		await expect(
			invoke(Contacts.addTags, {
				identifier: 'id:1',
				tags: Array.from({ length: 11 }, (_, i) => `t${i}`),
			}),
		).rejects.toThrow();
	});

	it('rejects an empty tag list', async () => {
		await expect(
			invoke(Contacts.addTags, { identifier: 'id:1', tags: [] }),
		).rejects.toThrow();
	});
});

describe('contacts.channels', () => {
	it('uses the plural channels path, unlike every other sub-route', async () => {
		respond(fetchMock, CONTACT_CHANNELS);

		const result = (await invoke(Contacts.channels, {
			identifier: 'id:1',
		})) as { items?: { id?: number }[] };

		expect(lastRequest(fetchMock).path).toBe('/v2/contact/id%3A1/channels');
		expect(result.items?.[0]?.id).toBe(42);
	});

	it('pages with limit and cursorId in the query', async () => {
		respond(fetchMock, CONTACT_CHANNELS);

		await invoke(Contacts.channels, {
			identifier: 'id:1',
			limit: 20,
			cursorId:
				'https://api.respond.io/contact/{identifier}/channels?limit=10&cursorId=10',
		});

		expect(lastRequest(fetchMock).query).toEqual({
			limit: '20',
			cursorId: '10',
		});
	});
});

describe('contacts.lifecycle', () => {
	it('moves the contact to a stage, sending it as name', async () => {
		respond(fetchMock, LIFECYCLE_ACK);

		const result = (await invoke(Contacts.lifecycle, {
			identifier: 'id:1',
			name: 'Hot Lead',
		})) as { code?: number | string };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v2/contact/id%3A1/lifecycle/update');
		// respond.io answers 400 "check if name is provided" to { lifecycle }.
		expect(request.bodyRecord).toEqual({ name: 'Hot Lead' });
		// A number here, which the old string-only ack schema rejected.
		expect(result.code).toBe(200);
	});

	it('clears the stage with a null name', async () => {
		respond(fetchMock, LIFECYCLE_ACK);

		await invoke(Contacts.lifecycle, { identifier: 'id:1', name: null });

		expect(lastRequest(fetchMock).bodyRecord).toEqual({ name: null });
	});
});

describe('conversations.assign', () => {
	it('assigns a user', async () => {
		respond(fetchMock, CONTACT_ID);

		const result = (await invoke(Conversations.assign, {
			identifier: 'id:1',
			assignee: 'jane@example.com',
		})) as { contactId?: number };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v2/contact/id%3A1/conversation/assignee');
		expect(request.bodyRecord).toEqual({ assignee: 'jane@example.com' });
		expect(result.contactId).toBe(12345);
	});

	it('sends a user ID as a number, since respond.io rejects a string ID', async () => {
		respond(fetchMock, CONTACT_ID);

		await invoke(Conversations.assign, { identifier: 'id:1', assignee: 76 });
		expect(lastRequest(fetchMock).bodyRecord).toEqual({ assignee: 76 });

		respond(fetchMock, CONTACT_ID);
		await invoke(Conversations.assign, { identifier: 'id:1', assignee: '76' });
		expect(lastRequest(fetchMock).bodyRecord).toEqual({ assignee: 76 });
	});

	it('unassigns by sending null, which is what the docs require', async () => {
		respond(fetchMock, CONTACT_ID);

		await invoke(Conversations.assign, { identifier: 'id:1' });

		// The key is present and null, not absent.
		expect(lastRequest(fetchMock).bodyRecord).toEqual({ assignee: null });
	});

	it('treats an explicit null the same as omitted', async () => {
		respond(fetchMock, CONTACT_ID);

		await invoke(Conversations.assign, { identifier: 'id:1', assignee: null });

		expect(lastRequest(fetchMock).bodyRecord).toEqual({ assignee: null });
	});
});

describe('conversations.status', () => {
	it('closes a conversation with a closing note and summary', async () => {
		respond(fetchMock, CONTACT_ID);

		await invoke(Conversations.status, {
			identifier: 'id:1',
			status: 'close',
			category: 'Resolved',
			summary: 'Handled in one call.',
		});

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v2/contact/id%3A1/conversation/status');
		expect(request.bodyRecord).toMatchObject({
			status: 'close',
			category: 'Resolved',
			summary: 'Handled in one call.',
		});
	});

	it('opens a conversation', async () => {
		respond(fetchMock, CONTACT_ID);

		await invoke(Conversations.status, { identifier: 'id:1', status: 'open' });

		expect(lastRequest(fetchMock).bodyRecord?.status).toBe('open');
	});

	it('rejects a status respond.io does not document', async () => {
		await expect(
			invoke(Conversations.status, { identifier: 'id:1', status: 'pending' }),
		).rejects.toThrow();
	});
});

describe('messages.send', () => {
	it('sends a text message', async () => {
		respond(fetchMock, MESSAGE_SENT);

		const result = (await invoke(Messages.send, {
			identifier: 'id:12345',
			channelId: 42,
			message: { type: 'text', text: 'There has been an update...' },
		})) as { messageId?: number };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v2/contact/id%3A12345/message');
		expect(request.bodyRecord).toMatchObject({
			channelId: 42,
			message: { type: 'text', text: 'There has been an update...' },
		});
		expect(result.messageId).toBe(1262965213);
	});

	it('omits channelId, which makes respond.io use the last channel', async () => {
		respond(fetchMock, MESSAGE_SENT);

		await invoke(Messages.send, {
			identifier: 'id:1',
			message: { type: 'text', text: 'hi' },
		});

		expect(lastRequest(fetchMock).bodyRecord?.channelId).toBeUndefined();
	});

	it('passes a messageTag for an out-of-window Facebook message', async () => {
		respond(fetchMock, MESSAGE_SENT);

		await invoke(Messages.send, {
			identifier: 'id:1',
			message: {
				type: 'text',
				text: 'hi',
				messageTag: 'ACCOUNT_UPDATE',
			},
		});

		expect(
			(lastRequest(fetchMock).bodyRecord?.message as { messageTag?: string })
				.messageTag,
		).toBe('ACCOUNT_UPDATE');
	});

	it('surfaces a 449 when the message cannot be delivered', async () => {
		respond(fetchMock, UNPROCESSABLE, 449);

		await expect(
			invoke(Messages.send, {
				identifier: 'id:1',
				message: { type: 'text', text: 'hi' },
			}),
		).rejects.toThrow('24 hour window');
	});

	it('sends the snake_case type respond.io documents', async () => {
		respond(fetchMock, MESSAGE_SENT);

		await invoke(Messages.send, {
			identifier: 'id:1',
			channelId: 42,
			message: { type: 'quick_reply', title: 'Pick one', replies: ['A', 'B'] },
		});

		expect(lastRequest(fetchMock).bodyRecord?.message).toEqual({
			type: 'quick_reply',
			title: 'Pick one',
			replies: ['A', 'B'],
		});
	});

	it('rejects a camelCase type, which is not the wire value', async () => {
		await expect(
			invoke(Messages.send, {
				identifier: 'id:1',
				channelId: 42,
				message: { type: 'customPayload', payload: {} },
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a text message with no text before any request', async () => {
		await expect(
			invoke(Messages.send, { identifier: 'id:1', message: { type: 'text' } }),
		).rejects.toThrow();
		await expect(
			invoke(Messages.send, {
				identifier: 'id:1',
				message: { type: 'text', text: '' },
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a message type respond.io does not document', async () => {
		await expect(
			invoke(Messages.send, {
				identifier: 'id:1',
				message: { type: 'video', text: 'x' },
			}),
		).rejects.toThrow();
	});

	it('logs the message type and channel, never the text', async () => {
		respond(fetchMock, MESSAGE_SENT);

		await invoke(Messages.send, {
			identifier: 'id:1',
			channelId: 42,
			message: { type: 'text', text: 'a secret' },
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'respondio.messages.send',
			{ messageId: 1262965213, type: 'text', channelId: 42 },
			'completed',
		);
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('a secret');
	});
});

describe('messages.get', () => {
	it('reads one message', async () => {
		respond(fetchMock, MESSAGE);

		const result = (await invoke(Messages.get, {
			identifier: 'id:1',
			messageId: 1262965213,
		})) as { traffic?: string; channelId?: number };

		expect(lastRequest(fetchMock).path).toBe(
			'/v2/contact/id%3A1/message/1262965213',
		);
		expect(result.traffic).toBe('outgoing');
		expect(result.channelId).toBe(42);
	});

	it('keeps the delivery statuses', async () => {
		respond(fetchMock, MESSAGE);

		const result = (await invoke(Messages.get, {
			identifier: 'id:1',
			messageId: 1,
		})) as { status?: { value?: string }[]; sender?: { source?: string } };

		expect(result.status?.[0]?.value).toBe('delivered');
		expect(result.sender?.source).toBe('api');
	});
});

describe('messages.list', () => {
	it('lists messages with the cursor', async () => {
		respond(fetchMock, MESSAGES);

		const result = (await invoke(Messages.list, {
			identifier: 'id:1',
			limit: 2,
			// unknown: only the fields asserted below are read from the result.
		})) as { items?: unknown[]; pagination?: { next?: string } };

		expect(lastRequest(fetchMock).path).toBe('/v2/contact/id%3A1/message/list');
		expect(result.items).toHaveLength(2);
		expect(result.pagination?.next).toBeDefined();
	});

	it('requests the next page from the previous pagination.next URL', async () => {
		respond(fetchMock, MESSAGES);
		const first = (await invoke(Messages.list, { identifier: 'id:1' })) as {
			pagination?: { next?: string };
		};

		respond(fetchMock, MESSAGES);
		await invoke(Messages.list, {
			identifier: 'id:1',
			cursorId: first.pagination?.next,
		});

		// The cursor is read out of the URL rather than sent as the whole URL.
		expect(lastRequest(fetchMock).query.cursorId).toBe('10');
	});

	it('passes includeComments', async () => {
		respond(fetchMock, MESSAGES_WITH_COMMENTS);

		await invoke(Messages.list, {
			identifier: 'id:1',
			includeComments: true,
		});

		expect(lastRequest(fetchMock).query.includeComments).toBe('true');
	});

	it('keeps the item type when comments are mixed in', async () => {
		respond(fetchMock, MESSAGES_WITH_COMMENTS);

		const result = (await invoke(Messages.list, {
			identifier: 'id:1',
			includeComments: true,
			// unknown: only the fields asserted below are read from the result.
		})) as { items?: Record<string, unknown>[] };

		expect(result.items?.[0]?.type).toBe('message');
		expect(result.items?.[1]?.type).toBe('comment');
	});

	it('keeps paging while next is set even when a page is empty', async () => {
		respond(fetchMock, MESSAGES_EMPTY_PAGE_WITH_NEXT);

		const result = (await invoke(Messages.list, {
			identifier: 'id:1',
			includeComments: true,
			// unknown: only the fields asserted below are read from the result.
		})) as { items?: unknown[]; pagination?: { next?: string } };

		// The docs warn that an empty page can still have more to come.
		expect(result.items).toHaveLength(0);
		expect(result.pagination?.next).toBeDefined();
	});

	it('rejects a limit over the documented 50', async () => {
		await expect(
			invoke(Messages.list, { identifier: 'id:1', limit: 51 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('messages.comment', () => {
	it('posts an internal comment', async () => {
		respond(fetchMock, COMMENT);

		const result = (await invoke(Messages.comment, {
			identifier: 'id:1',
			text: 'This is a comment',
		})) as { contactId?: number; text?: string; created_at?: number };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v2/contact/id%3A1/comment');
		expect(request.bodyRecord).toEqual({ text: 'This is a comment' });
		expect(result.contactId).toBe(12345);
		expect(result.created_at).toBe(1662979868);
	});

	it('rejects an empty comment', async () => {
		await expect(
			invoke(Messages.comment, { identifier: 'id:1', text: '' }),
		).rejects.toThrow();
	});
});

describe('space', () => {
	it('lists users', async () => {
		respond(fetchMock, USERS);

		const result = (await invoke(Space.listUsers, {})) as {
			items?: { email?: string }[];
		};

		expect(lastRequest(fetchMock).path).toBe('/v2/space/user');
		expect(result.items?.[0]?.email).toBe('jane@example.com');
	});

	it('reads one user', async () => {
		respond(fetchMock, USERS.items[0]);

		const result = (await invoke(Space.getUser, { id: 67890 })) as {
			email?: string;
			role?: string;
		};

		expect(lastRequest(fetchMock).path).toBe('/v2/space/user/67890');
		expect(result.email).toBe('jane@example.com');
		expect(result.role).toBe('owner');
	});

	it('logs the user ID, never the email', async () => {
		respond(fetchMock, USERS.items[0]);

		await invoke(Space.getUser, { id: 67890 });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'respondio.space.getUser',
			{ userId: 67890 },
			'completed',
		);
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain(
			'jane@example.com',
		);
	});

	it('lists the connected channels', async () => {
		respond(fetchMock, CHANNELS);

		const result = (await invoke(Space.listChannels, {})) as {
			items?: { source?: string; id?: number }[];
		};

		expect(lastRequest(fetchMock).path).toBe('/v2/space/channel');
		expect(result.items?.[0]?.source).toBe('whatsapp');
		expect(result.items?.[0]?.id).toBe(42);
	});

	it('lists one channel’s templates', async () => {
		respond(fetchMock, TEMPLATES);

		const result = (await invoke(Space.listTemplates, {
			channelId: 42,
			limit: 20,
		})) as { items?: { name?: string; languageCode?: string }[] };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v2/space/channel/42/template');
		expect(request.query).toEqual({ limit: '20' });
		expect(result.items?.[0]?.name).toBe('order_update');
		expect(result.items?.[0]?.languageCode).toBe('en');
	});

	it('lists closing notes', async () => {
		respond(fetchMock, CLOSING_NOTES);

		const result = (await invoke(Space.listClosingNotes, {
			cursorId:
				'https://api.respond.io/space/closing_notes?limit=10&cursorId=10',
		})) as { items?: { category?: string; description?: string }[] };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v2/space/closing_notes');
		expect(request.query).toEqual({ cursorId: '10' });
		expect(result.items).toHaveLength(2);
		expect(result.items?.[0]?.category).toBe('General Inquiry');
	});

	it('lists custom fields with their types', async () => {
		respond(fetchMock, CUSTOM_FIELDS);

		const result = (await invoke(Space.listCustomFields, { limit: 50 })) as {
			items?: { name?: string; dataType?: string; allowedValues?: string[] }[];
		};

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v2/space/custom_field');
		expect(request.query).toEqual({ limit: '50' });
		expect(result.items?.[0]?.dataType).toBe('url');
		expect(result.items?.[1]?.allowedValues).toEqual(['free', 'pro']);
	});
});

describe('error propagation', () => {
	it('surfaces a 400 with its message', async () => {
		respond(fetchMock, VALIDATION_ERROR, 400);

		await expect(
			invoke(Contacts.create, { identifier: 'id:1', firstName: 'A' }),
		).rejects.toThrow('Validation error.');
	});
});
