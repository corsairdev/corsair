import { logEventFromContext } from 'corsair/core';
import { EmailOctopusAPIError } from './client';
import {
	Automations,
	Campaigns,
	Contacts,
	Fields,
	Lists,
	Tags,
} from './endpoints';
import {
	campaign,
	contact,
	field,
	list,
	page,
	problem,
	tag,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'eo-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function respondEmpty(status: number) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('emailoctopus endpoints', () => {
	it('lists lists with paging and a bearer token', async () => {
		await expect(invoke(Lists.list, { limit: 101 })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();

		respond(page(list));
		const pageResult = await invoke(Lists.list, {
			limit: 10,
			starting_after: 'cursor-1',
		});
		expect(pageResult).toMatchObject({ data: [list] });
		const sent = lastRequest();
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe('/lists');
		expect(sent.query).toEqual({ limit: '10', starting_after: 'cursor-1' });
		expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'emailoctopus.lists.list',
			{ count: 1 },
			'completed',
		);
	});

	it('gets, creates, renames and deletes a list', async () => {
		respond(list);
		await expect(
			invoke(Lists.get, { list_id: 'list-1' }),
		).resolves.toMatchObject({
			id: 'list-1',
		});
		expect(lastRequest().path).toBe('/lists/list-1');

		respond(list, 201);
		await invoke(Lists.create, { name: 'New clients list' });
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/lists',
			body: { name: 'New clients list' },
		});

		respond(list);
		await invoke(Lists.update, { list_id: 'list-1', name: 'Renamed' });
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/lists/list-1',
			body: { name: 'Renamed' },
		});

		respondEmpty(204);
		await expect(invoke(Lists.remove, { list_id: 'list-1' })).resolves.toEqual(
			{},
		);
		expect(lastRequest().method).toBe('DELETE');
	});

	it('rejects a list name over 255 characters before calling the API', async () => {
		await expect(
			invoke(Lists.create, { name: 'n'.repeat(256) }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('lists and reads contacts, including dotted time filters', async () => {
		respond(page(contact));
		await invoke(Contacts.list, {
			list_id: 'list-1',
			status: 'subscribed',
			'created_at.gte': '2026-01-01T00:00:00Z',
		});
		expect(lastRequest().query).toEqual({
			status: 'subscribed',
			'created_at.gte': '2026-01-01T00:00:00Z',
		});

		respond(contact);
		await expect(
			invoke(Contacts.get, { list_id: 'list-1', contact_id: 'contact-1' }),
		).resolves.toMatchObject({ email_address: 'otto@example.com' });
		expect(lastRequest().path).toBe('/lists/list-1/contacts/contact-1');
	});

	it('creates, upserts, updates, deletes and batches contacts', async () => {
		respond(contact, 201);
		await invoke(Contacts.create, {
			list_id: 'list-1',
			email_address: 'otto@example.com',
			tags: ['vip'],
			status: 'subscribed',
		});
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			body: {
				email_address: 'otto@example.com',
				tags: ['vip'],
				status: 'subscribed',
			},
		});

		respond(contact);
		await invoke(Contacts.upsert, {
			list_id: 'list-1',
			email_address: 'otto@example.com',
			tags: { vip: true },
		});
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/lists/list-1/contacts',
			body: { email_address: 'otto@example.com', tags: { vip: true } },
		});

		respond(contact);
		await invoke(Contacts.update, {
			list_id: 'list-1',
			contact_id: 'contact-1',
			status: 'unsubscribed',
		});
		expect(lastRequest().path).toBe('/lists/list-1/contacts/contact-1');

		respondEmpty(204);
		await expect(
			invoke(Contacts.remove, { list_id: 'list-1', contact_id: 'contact-1' }),
		).resolves.toEqual({});

		respond({ success: [{ success: true, data: contact }], errors: [] });
		const batched = await invoke(Contacts.batch, {
			list_id: 'list-1',
			contacts: [{ id: 'contact-1', status: 'subscribed' }],
		});
		expect(batched).toMatchObject({ success: [{ success: true }] });
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/lists/list-1/contacts/batch',
		});
	});

	it('rejects an unknown contact status before calling the API', async () => {
		await expect(
			invoke(Contacts.create, {
				list_id: 'list-1',
				email_address: 'otto@example.com',
				status: 'archived',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('creates, updates and deletes fields', async () => {
		respond(
			{
				label: 'Hometown',
				tag: 'Hometown',
				type: 'choice_single',
				choices: ['London', 'Paris'],
			},
			201,
		);
		const created = await invoke(Fields.create, {
			list_id: 'list-1',
			label: 'Hometown',
			tag: 'Hometown',
			type: 'choice_single',
			choices: ['London', 'Paris'],
		});
		expect(created).toMatchObject({
			type: 'choice_single',
			choices: ['London', 'Paris'],
		});
		expect(lastRequest().body).toEqual({
			label: 'Hometown',
			tag: 'Hometown',
			type: 'choice_single',
			choices: ['London', 'Paris'],
		});

		respond(field);
		await invoke(Fields.update, {
			list_id: 'list-1',
			label: 'Hometown',
			tag: 'Hometown',
			type: 'text',
			fallback: null,
		});
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/lists/list-1/fields/Hometown',
			body: {
				label: 'Hometown',
				tag: 'Hometown',
				type: 'text',
				fallback: null,
			},
		});

		respondEmpty(204);
		await expect(
			invoke(Fields.remove, { list_id: 'list-1', tag: 'Hometown' }),
		).resolves.toEqual({});
	});

	it('rejects a choice field with no choices', async () => {
		await expect(
			invoke(Fields.create, {
				list_id: 'list-1',
				label: 'Hometown',
				tag: 'Hometown',
				type: 'choice_single',
				choices: [],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('lists, creates, updates and deletes tags', async () => {
		respond(page(tag));
		await expect(
			invoke(Tags.list, { list_id: 'list-1' }),
		).resolves.toMatchObject({
			data: [tag],
		});

		respond(tag, 201);
		await invoke(Tags.create, { list_id: 'list-1', tag: 'vip' });
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/lists/list-1/tags',
			body: { tag: 'vip' },
		});

		respond(tag);
		await invoke(Tags.update, {
			list_id: 'list-1',
			tag: 'vip',
			name: 'customer',
		});
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/lists/list-1/tags/vip',
			body: { tag: 'customer' },
		});

		respondEmpty(204);
		await expect(
			invoke(Tags.remove, { list_id: 'list-1', tag: 'vip' }),
		).resolves.toEqual({});
	});

	it('reads campaigns and their reports', async () => {
		respond(page(campaign));
		await invoke(Campaigns.list, {});
		expect(lastRequest().path).toBe('/campaigns');

		respond(campaign);
		await expect(
			invoke(Campaigns.get, { campaign_id: 'campaign-1' }),
		).resolves.toMatchObject({ name: 'June newsletter' });

		respond({ status: 'opened', data: [], paging: { next: null } });
		await invoke(Campaigns.reportContacts, {
			campaign_id: 'campaign-1',
			status: 'opened',
		});
		expect(lastRequest().query).toEqual({ status: 'opened' });

		respond({
			data: [
				{ url: 'https://example.com', clicked_total: 1, clicked_unique: 1 },
			],
		});
		await expect(
			invoke(Campaigns.reportLinks, { campaign_id: 'campaign-1' }),
		).resolves.toMatchObject({ data: [{ clicked_total: 1 }] });
		expect(lastRequest().path).toBe('/campaigns/campaign-1/reports/links');

		respond({ id: 'campaign-1', sent: 10, complained: 0, unsubscribed: 1 });
		await expect(
			invoke(Campaigns.reportSummary, { campaign_id: 'campaign-1' }),
		).resolves.toMatchObject({ sent: 10 });
	});

	it('rejects an unknown report status', async () => {
		await expect(
			invoke(Campaigns.reportContacts, {
				campaign_id: 'campaign-1',
				status: 'deleted',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('queues a contact into an automation and treats 204 as success', async () => {
		respondEmpty(204);
		await expect(
			invoke(Automations.start, {
				automation_id: 'auto-1',
				contact_id: 'contact-1',
			}),
		).resolves.toEqual({});
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/automations/auto-1/queue',
			body: { contact_id: 'contact-1' },
		});
	});

	it('surfaces a problem+json body from a failed call', async () => {
		respond(problem, 400);
		await expect(
			invoke(Lists.get, { list_id: 'missing' }),
		).rejects.toBeInstanceOf(EmailOctopusAPIError);
	});

	it('accepts null timestamps and a null paging cursor', async () => {
		respond({
			data: [{ ...list, last_updated_at: null }],
			paging: { next: { url: null, starting_after: null } },
		});

		await expect(invoke(Lists.list, {})).resolves.toMatchObject({
			data: [{ id: 'list-1', last_updated_at: null }],
		});
	});

	it('rejects a success body of the wrong shape', async () => {
		respond({ data: 'nope' });
		await expect(invoke(Lists.list, {})).rejects.toThrow();
	});
});
