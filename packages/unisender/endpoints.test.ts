import { logEventFromContext } from 'corsair/core';
import * as Api from './endpoints';
import {
	CAMPAIGN_CREATED,
	CAMPAIGNS,
	CONTACT,
	CONTACT_COUNT,
	CONTACT_INVITED,
	EMAIL_CREATED,
	EMAIL_SENT,
	EMAIL_STATUSES,
	EXCLUDED,
	EXPORT_REQUESTED,
	FIELD_CREATED,
	FIELD_DELETED,
	FIELDS,
	IMPORTED,
	INVALID_ARG,
	LIST_CREATED,
	LIST_DELETED,
	LISTS,
	SUBSCRIBED,
	TAGS,
	UNSUBSCRIBED,
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

describe('lists', () => {
	it('lists the contact lists', async () => {
		respond(fetchMock, LISTS);

		const result = (await invoke(Api.list, {})) as {
			result: { id?: number; title?: string }[];
		};

		expect(lastRequest(fetchMock).path).toBe('/en/api/getLists');
		expect(result.result).toHaveLength(2);
		expect(result.result[0]?.title).toBe('My list number 1');
	});

	it('creates a list and returns its id', async () => {
		respond(fetchMock, LIST_CREATED);

		const result = (await invoke(Api.create, {
			title: 'Spring 2026',
		})) as { result: { id?: number } };

		expect(lastRequest(fetchMock).form.title).toBe('Spring 2026');
		expect(result.result.id).toBe(910011);
	});

	it('rejects a list with no title', async () => {
		await expect(invoke(Api.create, {})).rejects.toThrow();
	});

	it('deletes a list by id', async () => {
		respond(fetchMock, LIST_DELETED);

		// The live answer is {"result":{}}; it must parse, the list is already gone.
		await expect(invoke(Api.remove, { list_id: 55688 })).resolves.toEqual({
			result: {},
		});

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/en/api/deleteList');
		expect(request.form.list_id).toBe('55688');
	});
});

describe('contacts', () => {
	it('reads a contact, whose email is an object with a status', async () => {
		respond(fetchMock, CONTACT);

		const result = (await invoke(Api.get, {
			email: 'test@example.org',
			include_lists: true,
		})) as {
			result: {
				email?: { email?: string; status?: string };
				lists?: unknown[];
			};
		};

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/en/api/getContact');
		expect(request.form.include_lists).toBe('1');
		expect(result.result.email?.status).toBe('active');
		expect(result.result.lists).toHaveLength(1);
	});

	it('sends a boolean flag as 1 or 0, not true or false', async () => {
		respond(fetchMock, CONTACT);

		await invoke(Api.get, { email: 'a@b.com', include_lists: false });

		expect(lastRequest(fetchMock).form.include_lists).toBe('0');
	});

	it('subscribes a contact to several lists', async () => {
		respond(fetchMock, SUBSCRIBED);

		const result = (await invoke(Api.subscribe, {
			list_ids: [134, 135],
			email: 'test@example.org',
			fields: { city: 'Berlin' },
		})) as { result: { email?: { status?: string } } };

		const form = lastRequest(fetchMock).form;
		expect(form.list_ids).toBe('134,135');
		// The email rides in the fields map, which is how subscribe takes it.
		expect(form['fields[email]']).toBe('test@example.org');
		expect(form['fields[city]']).toBe('Berlin');
		expect(result.result.email?.status).toBe('active');
	});

	it('reports an invited contact as not yet mailable', async () => {
		respond(fetchMock, CONTACT_INVITED);

		const result = (await invoke(Api.subscribe, {
			list_ids: [1],
			email: 'new@example.org',
		})) as { result: { email?: { status?: string } } };

		// The default double opt-in leaves the contact invited, not active.
		expect(result.result.email?.status).toBe('invited');
	});

	it('sends double_optin 3, which adds without any email', async () => {
		respond(fetchMock, SUBSCRIBED);

		await invoke(Api.subscribe, {
			list_ids: [1],
			email: 'a@b.com',
			double_optin: 3,
		});

		expect(lastRequest(fetchMock).form.double_optin).toBe('3');
	});

	it('rejects a double_optin value the docs do not list', async () => {
		await expect(
			invoke(Api.subscribe, {
				list_ids: [1],
				email: 'a@b.com',
				double_optin: 2,
			}),
		).rejects.toThrow();
	});

	it('rejects more than 10 tags', async () => {
		const tags = Array.from({ length: 11 }, (_, i) => `t${i}`);

		await expect(
			invoke(Api.subscribe, { list_ids: [1], email: 'a@b.com', tags }),
		).rejects.toThrow();
	});

	it('unsubscribes and reports the resulting status', async () => {
		respond(fetchMock, UNSUBSCRIBED);

		const result = (await invoke(Api.unsubscribe, {
			email: 'test@example.org',
			list_ids: [1, 2],
		})) as { result: { email?: { status?: string } } };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/en/api/unsubscribe');
		expect(request.form.contact).toBe('test@example.org');
		expect(request.form.contact_type).toBe('email');
		expect(result.result.email?.status).toBe('unsubscribed');
	});

	it('omits list_ids on an unsubscribe, which means every list', async () => {
		respond(fetchMock, UNSUBSCRIBED);

		await invoke(Api.unsubscribe, { email: 'test@example.org' });

		expect(lastRequest(fetchMock).form.list_ids).toBeUndefined();
	});

	it('excludes a contact without marking them unsubscribed', async () => {
		respond(fetchMock, EXCLUDED);

		await invoke(Api.exclude, { email: 'test@example.org' });

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/en/api/exclude');
		expect(request.form.contact).toBe('test@example.org');
	});

	it('imports contacts from columnar data with indexed keys', async () => {
		respond(fetchMock, IMPORTED);

		const result = (await invoke(Api.importContacts, {
			list_ids: [55688],
			field_names: ['email', 'name'],
			data: [
				['a@example.com', 'Ann'],
				['b@example.com', 'Bob'],
			],
		})) as {
			result: Record<string, { created?: number; skipped?: number }>;
		};

		const form = lastRequest(fetchMock).form;
		expect(form['field_names[0]']).toBe('email');
		// The row and column are both indexed, as the method documents.
		expect(form['data[0][0]']).toBe('a@example.com');
		expect(form['data[1][1]']).toBe('Bob');
		expect(result.result['55688']?.created).toBe(3);
	});

	it('surfaces a skipped role address from an import', async () => {
		respond(fetchMock, IMPORTED);

		const result = (await invoke(Api.importContacts, {
			list_ids: [55688],
			field_names: ['email'],
			data: [['sales@example.org']],
		})) as {
			result: Record<string, { errors?: string[]; skipped?: number }>;
		};

		// A role address is refused on purpose, so skipped is normal.
		expect(result.result['55688']?.skipped).toBe(1);
		expect(result.result['55688']?.errors?.[0]).toContain('role address');
	});

	it('rejects an import over the documented 500 contacts', async () => {
		const data = Array.from({ length: 501 }, (_, i) => [`a${i}@example.com`]);

		await expect(
			invoke(Api.importContacts, {
				list_ids: [1],
				field_names: ['email'],
				data,
			}),
		).rejects.toThrow();
	});

	it('counts the contacts in a list', async () => {
		respond(fetchMock, CONTACT_COUNT);

		const result = (await invoke(Api.count, {
			list_id: 55688,
			type: 'address',
		})) as { result: { count?: number } };

		expect(lastRequest(fetchMock).path).toBe('/en/api/getContactCount');
		expect(result.result.count).toBe(1234);
	});

	it('refuses a count with no filter before calling, since Unisender requires one', async () => {
		await expect(invoke(Api.count, { list_id: 55688 })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('requests an export on the async route', async () => {
		respond(fetchMock, EXPORT_REQUESTED);

		await invoke(Api.exportContacts, {
			list_id: 55688,
			notify_url: 'https://example.com/hook',
		});

		const request = lastRequest(fetchMock);
		// The export is asynchronous, so it lives under /async/.
		expect(request.path).toBe('/en/api/async/exportContacts');
		expect(request.form.notify_url).toBe('https://example.com/hook');
	});
});

describe('fields and tags', () => {
	it('lists the custom fields', async () => {
		respond(fetchMock, FIELDS);

		const result = (await invoke(Api.fields, {})) as {
			result: { name?: string; type?: string }[];
		};

		expect(result.result).toHaveLength(2);
		expect(result.result[0]?.type).toBe('string');
	});

	it('creates a field', async () => {
		respond(fetchMock, FIELD_CREATED);

		const result = (await invoke(Api.createField, {
			name: 'city',
			type: 'string',
		})) as { result: { id?: number } };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/en/api/createField');
		expect(request.form.name).toBe('city');
		expect(result.result.id).toBe(33110);
	});

	it('rejects a field type the docs do not list', async () => {
		await expect(
			invoke(Api.createField, { name: 'city', type: 'boolean' }),
		).rejects.toThrow();
	});

	it('deletes a field by id', async () => {
		respond(fetchMock, FIELD_DELETED);

		await expect(invoke(Api.deleteField, { id: 33110 })).resolves.toEqual({
			result: {},
		});

		expect(lastRequest(fetchMock).form.id).toBe('33110');
	});

	it('lists the tags', async () => {
		respond(fetchMock, TAGS);

		const result = (await invoke(Api.tags, {})) as {
			result: { id?: number; name?: string }[];
		};

		expect(result.result).toHaveLength(2);
		expect(result.result[0]?.name).toBe('important customers');
	});
});

describe('messages', () => {
	it('sends one transactional email and returns its email_id', async () => {
		respond(fetchMock, EMAIL_SENT);

		const result = (await invoke(Api.sendEmail, {
			email: 'test@example.org',
			sender_name: 'Example',
			sender_email: 'news@example.org',
			subject: 'Your order',
			body: '<p>Shipped</p>',
			list_id: 55688,
		})) as { result: { email_id?: number }[] };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/en/api/sendEmail');
		expect(request.form.subject).toBe('Your order');
		expect(result.result[0]?.email_id).toBe(8811223);
	});

	it('carries metadata as bracketed keys', async () => {
		respond(fetchMock, EMAIL_SENT);

		await invoke(Api.sendEmail, {
			email: 'a@b.com',
			sender_name: 'X',
			sender_email: 'x@y.com',
			subject: 's',
			body: 'b',
			list_id: 1,
			metadata: { order_id: 'ORD-1' },
		});

		expect(lastRequest(fetchMock).form['metadata[order_id]']).toBe('ORD-1');
	});

	it('rejects a send with no body', async () => {
		await expect(
			invoke(Api.sendEmail, {
				email: 'a@b.com',
				sender_name: 'X',
				sender_email: 'x@y.com',
				subject: 's',
				list_id: 1,
			}),
		).rejects.toThrow();
	});

	it('reads delivery statuses and counts the failures', async () => {
		respond(fetchMock, EMAIL_STATUSES);

		const result = (await invoke(Api.status, {
			email_id: [8811223, 8811224],
		})) as { result: { statuses?: { status?: string }[] } };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/en/api/checkEmail');
		// Up to 500 ids go as one comma-separated value.
		expect(request.form.email_id).toBe('8811223,8811224');
		expect(result.result.statuses).toHaveLength(3);
	});

	it('logs failed sends separately from the total checked', async () => {
		respond(fetchMock, EMAIL_STATUSES);

		await invoke(Api.status, { email_id: [8811223] });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'unisender.messages.status',
			{ checked: 3, failed: 1 },
			'completed',
		);
	});

	it('rejects more than the documented 500 ids', async () => {
		const ids = Array.from({ length: 501 }, (_, i) => i + 1);

		await expect(invoke(Api.status, { email_id: ids })).rejects.toThrow();
	});

	it('creates a campaign email without sending it', async () => {
		respond(fetchMock, EMAIL_CREATED);

		const result = (await invoke(Api.createEmail, {
			sender_name: 'Example',
			sender_email: 'news@example.org',
			subject: 'Spring',
			body: '<p>News</p>',
			list_id: 55688,
		})) as { result: { message_id?: number } };

		expect(lastRequest(fetchMock).path).toBe('/en/api/createEmailMessage');
		expect(result.result.message_id).toBe(7711223);
	});
});

describe('campaigns', () => {
	it('starts a campaign from a message', async () => {
		respond(fetchMock, CAMPAIGN_CREATED);

		const result = (await invoke(Api.campaign, {
			message_id: 7711223,
		})) as { result: { campaign_id?: number } };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/en/api/createCampaign');
		expect(request.form.message_id).toBe('7711223');
		// No start_time, which means it starts now.
		expect(request.form.start_time).toBeUndefined();
		expect(result.result.campaign_id).toBe(665544);
	});

	it('schedules a campaign with a start time and timezone', async () => {
		respond(fetchMock, CAMPAIGN_CREATED);

		await invoke(Api.campaign, {
			message_id: 1,
			start_time: '2026-05-01 10:00:00',
			timezone: 'Europe/Berlin',
		});

		expect(lastRequest(fetchMock).form).toMatchObject({
			start_time: '2026-05-01 10:00:00',
			timezone: 'Europe/Berlin',
		});
	});

	it('lists campaigns in a window', async () => {
		respond(fetchMock, CAMPAIGNS);

		const result = (await invoke(Api.campaigns, {
			from: '2026-05-01 00:00:00',
			limit: 100,
		})) as { result: { id?: number; status?: string }[] };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/en/api/getCampaigns');
		expect(request.form.from).toBe('2026-05-01 00:00:00');
		expect(result.result[0]?.status).toBe('scheduled');
	});

	it('rejects a limit over the documented 10,000', async () => {
		await expect(
			invoke(Api.campaigns, { from: '2026-05-01 00:00:00', limit: 10_001 }),
		).rejects.toThrow();
	});

	it('requires a from date', async () => {
		await expect(invoke(Api.campaigns, {})).rejects.toThrow();
	});
});

describe('error propagation', () => {
	it('surfaces an invalid argument', async () => {
		respond(fetchMock, INVALID_ARG, 400);

		await expect(invoke(Api.get, { email: 'not-an-email' })).rejects.toThrow(
			'Invalid email address',
		);
	});

	it('logs no contact address, subject or body', async () => {
		respond(fetchMock, SUBSCRIBED);

		await invoke(Api.subscribe, {
			list_ids: [1],
			email: 'private@example.org',
			fields: { name: 'A Private Person' },
		});

		const logged = JSON.stringify(mockLog.mock.calls);
		expect(logged).not.toContain('private@example.org');
		expect(logged).not.toContain('A Private Person');
	});
});
