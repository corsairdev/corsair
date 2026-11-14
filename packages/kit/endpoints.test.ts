import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { KitAPIError } from './client';
import { Account, CustomFields, Forms, Subscribers, Tags } from './endpoints';
import {
	account,
	customFieldResponse,
	customFields,
	forbidden,
	formSubscriber,
	forms,
	invalidKey,
	missingKey,
	notFound,
	subscriber,
	subscriberCreated,
	subscriberDetail,
	subscribers,
	tag,
	tagResponse,
	tags,
	unprocessable,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'kit-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type, so
// the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts. The result is
// unknown too, so a test that reads it casts to the fixture it just made fetch
// answer with, which the output schema has already accepted.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read (ctx.key).
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

function respondEmpty(status = 204) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
}

function lastRequest() {
	// jest types mock.calls as any[]; every call here is fetch(url, init) from
	// corsair/http, so the last one is that pair.
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.kit.com');
	expect(sent.headers.get('x-kit-api-key')).toBe(API_KEY);
	// An API key is not a Bearer token; that header is the OAuth path.
	expect(sent.headers.get('authorization')).toBeNull();
}

/** The caught rejection, without a cast at each call site. */
// unknown: a promise can reject with any value, so the rejection reason has no
// static type; each caller asserts only on the fields it checks.
async function caught(promise: Promise<unknown>): Promise<unknown> {
	return promise.catch((error: unknown) => error);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('account.get', () => {
	it('GETs the account with the key in X-Kit-Api-Key', async () => {
		respond(account);

		await expect(invoke(Account.get, {})).resolves.toMatchObject({
			account: { id: 900, name: 'Acme', plan_type: 'creator' },
		});
		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v4/account',
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'kit.account.get',
			{ accountId: 900 },
			'completed',
		);
	});

	it('rejects a body that carries no account', async () => {
		respond({ unexpected: true });

		// The route always answers an account, so a body without one is a
		// failure rather than a sparse read.
		await expect(invoke(Account.get, {})).rejects.toMatchObject({
			name: 'ZodError',
		});
		expect(mockLog).not.toHaveBeenCalled();
	});
});

describe('subscribers.list', () => {
	it('GETs the first page with no filters', async () => {
		respond(subscribers);

		const result = (await invoke(Subscribers.list, {})) as typeof subscribers;

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v4/subscribers',
			query: {},
		});
		expect(result.subscribers).toHaveLength(2);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'kit.subscribers.list',
			{ count: 2 },
			'completed',
		);
	});

	it('sends every filter the caller asked for', async () => {
		respond(subscribers);

		await invoke(Subscribers.list, {
			status: 'all',
			email_address: 'jordan@acme.example',
			include: ['attribution', 'tags'],
			include_total_count: true,
			slim: true,
			sort_field: 'created_at',
			sort_order: 'desc',
			created_after: '2026-01-01',
			created_before: '2026-12-01',
			updated_after: '2026-02-01',
			updated_before: '2026-12-01',
			after: 'WzIwMDBd',
			per_page: 100,
		});

		expect(lastRequest().query).toEqual({
			status: 'all',
			email_address: 'jordan@acme.example',
			include: 'attribution,tags',
			include_total_count: 'true',
			slim: 'true',
			sort_field: 'created_at',
			sort_order: 'desc',
			created_after: '2026-01-01',
			created_before: '2026-12-01',
			updated_after: '2026-02-01',
			updated_before: '2026-12-01',
			after: 'WzIwMDBd',
			per_page: '100',
		});
	});

	it('keeps the cursor and the has_next_page flag', async () => {
		respond(subscribers);

		const result = (await invoke(Subscribers.list, {})) as typeof subscribers;

		expect(result.pagination.end_cursor).toBe('WzIwMDBd');
		expect(result.pagination.has_next_page).toBe(true);
	});

	it('keeps fields it does not know', async () => {
		respond({
			subscribers: [
				{
					id: 1,
					email_address: 'a@b.example',
					state: 'active',
					brandNew: 'kept',
				},
			],
		});

		await expect(invoke(Subscribers.list, {})).resolves.toMatchObject({
			subscribers: [{ id: 1, brandNew: 'kept' }],
		});
	});

	it('sends an engagement sort Kit documents', async () => {
		respond(subscribers);

		await invoke(Subscribers.list, {
			sort_field: 'engagement__opens',
			sort_order: 'desc',
		});

		expect(lastRequest().query).toMatchObject({
			sort_field: 'engagement__opens',
			sort_order: 'desc',
		});
	});

	it('rejects an include that pairs canceled_at with another status', async () => {
		respond(subscribers);

		// Kit documents a 422 for this pairing, so the plugin refuses it first.
		const error = await caught(
			invoke(Subscribers.list, { include: ['canceled_at'], status: 'active' }),
		);

		expect(error).toMatchObject({ name: 'ZodError' });
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it.each([
		[{ status: 'everyone' }],
		[{ include: [] }],
		[{ include: ['everything'] }],
		[{ sort_field: 'engagement__nothing' }],
		[{ sort_field: 'engagement__opens', email_address: 'a@b.example' }],
		[{ sort_order: 'newest' }],
		[{ per_page: 0 }],
		[{ per_page: 1001 }],
	])('rejects %j before calling Kit', async (input) => {
		await expect(invoke(Subscribers.list, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('subscribers.get', () => {
	it('GETs one subscriber with location, attribution and tags', async () => {
		respond(subscriberDetail);

		await expect(
			invoke(Subscribers.get, { subscriberId: 1001 }),
		).resolves.toMatchObject({
			subscriber: {
				id: 1001,
				location: { city: 'Austin' },
				tags: [{ id: 31, name: 'customer' }],
			},
		});
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v4/subscribers/1001',
		});
	});

	it('surfaces a subscriber that is not there', async () => {
		respond(notFound, 404);

		await expect(
			invoke(Subscribers.get, { subscriberId: 999 }),
		).rejects.toMatchObject({ status: 404, message: 'Kit 404: Not Found' });
	});

	it.each([[{}], [{ subscriberId: 0 }], [{ subscriberId: '1001' }]])(
		'rejects %j before calling Kit',
		async (input) => {
			await expect(invoke(Subscribers.get, input)).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
});

describe('subscribers.create', () => {
	it('POSTs the address, name and custom fields', async () => {
		respond(subscriberCreated, 201);

		const result = (await invoke(Subscribers.create, {
			email_address: 'jordan@acme.example',
			first_name: 'Jordan',
			fields: { last_name: 'Lee', company: 'Acme' },
		})) as typeof subscriberCreated;

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v4/subscribers',
			body: {
				email_address: 'jordan@acme.example',
				first_name: 'Jordan',
				fields: { last_name: 'Lee', company: 'Acme' },
			},
		});
		expect(lastRequest().headers.get('content-type')).toBe('application/json');
		expect(result.subscriber.id).toBe(1001);
		// A field key Kit did not recognise comes back in `warnings`.
		expect(result.warnings).toEqual(['unknown_field']);
	});

	it('sends only the address when that is all it is given', async () => {
		respond(subscriberCreated, 201);

		await invoke(Subscribers.create, { email_address: 'a@b.example' });

		expect(lastRequest().body).toEqual({ email_address: 'a@b.example' });
	});

	it('logs the subscriber ID and the warning count, never the address', async () => {
		respond(subscriberCreated, 201);

		await invoke(Subscribers.create, { email_address: 'jordan@acme.example' });

		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('@');
	});

	it.each([
		[{}],
		[{ email_address: '' }],
		[{ email_address: 'ab' }],
		[{ email_address: 'a@b.example', state: 'subscribed' }],
	])('rejects %j before calling Kit', async (input) => {
		await expect(invoke(Subscribers.create, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('subscribers.update', () => {
	it('PUTs the address and the changed fields', async () => {
		respond({
			subscriber: { ...subscriberDetail.subscriber, first_name: 'Jordy' },
		});

		await invoke(Subscribers.update, {
			subscriberId: 1001,
			email_address: 'jordan@acme.example',
			first_name: 'Jordy',
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v4/subscribers/1001',
			body: { email_address: 'jordan@acme.example', first_name: 'Jordy' },
		});
	});

	it('rejects a call with no address, which Kit requires', async () => {
		await expect(
			invoke(Subscribers.update, { subscriberId: 1001 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('subscribers.unsubscribe', () => {
	it('POSTs the unsubscribe and reports it', async () => {
		respondEmpty(204);

		await expect(
			invoke(Subscribers.unsubscribe, { subscriberId: 1001 }),
		).resolves.toEqual({ success: true, subscriber_id: 1001 });
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v4/subscribers/1001/unsubscribe',
		});
	});

	it('throws on an unknown subscriber rather than reporting success', async () => {
		respond(notFound, 404);

		await expect(
			invoke(Subscribers.unsubscribe, { subscriberId: 999 }),
		).rejects.toMatchObject({ status: 404 });
		expect(mockLog).not.toHaveBeenCalled();
	});
});

describe('tags.list', () => {
	it('GETs the tags with their counts', async () => {
		respond(tags);

		const result = (await invoke(Tags.list, {
			include: ['subscriber_count'],
		})) as typeof tags;

		expect(lastRequest()).toMatchObject({ method: 'GET', path: '/v4/tags' });
		expect(lastRequest().query.include).toBe('subscriber_count');
		expect(result.tags[0]?.subscriber_count).toBe(128);
	});

	it('sends no name filter, which Kit does not document for this route', async () => {
		respond(tags);

		await invoke(Tags.list, { name: 'vip' });

		expect(lastRequest().query).not.toHaveProperty('name');
	});
});

describe('tags.create', () => {
	it('POSTs a tag name', async () => {
		respond(tagResponse, 201);

		await expect(
			invoke(Tags.create, { name: 'customer' }),
		).resolves.toMatchObject({
			tag: { id: 31, name: 'customer' },
		});
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v4/tags',
			body: { name: 'customer' },
		});
	});

	it('rejects an empty name before calling Kit', async () => {
		await expect(invoke(Tags.create, { name: '' })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('tags.update', () => {
	it('PUTs the new name', async () => {
		respond({ tag: { ...tag, name: 'vip' } });

		await invoke(Tags.update, { tagId: 31, name: 'vip' });

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v4/tags/31',
			body: { name: 'vip' },
		});
	});
});

describe('tags.tagSubscriber', () => {
	it('POSTs the address to the tag and reports it', async () => {
		respond(
			{ subscriber: { ...subscriber, tagged_at: '2026-11-12T10:00:00Z' } },
			201,
		);

		await expect(
			invoke(Tags.tagSubscriber, {
				tagId: 31,
				email_address: 'jordan@acme.example',
			}),
		).resolves.toEqual({
			success: true,
			tag_id: 31,
			email_address: 'jordan@acme.example',
			subscriber_id: 1001,
		});
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v4/tags/31/subscribers',
			body: { email_address: 'jordan@acme.example' },
		});
	});

	it.each([
		['no subscriber', {}],
		['a non-numeric ID', { subscriber: { id: 'invalid' } }],
	])('fails on a 200 with %s instead of reporting success', async (_, body) => {
		respond(body, 200);

		await expect(
			invoke(Tags.tagSubscriber, {
				tagId: 31,
				email_address: 'jordan@acme.example',
			}),
		).rejects.toThrow('Kit answered the tagging without a subscriber ID');
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('logs the tag and never the address', async () => {
		respond({ subscriber }, 200);

		await invoke(Tags.tagSubscriber, {
			tagId: 31,
			email_address: 'jordan@acme.example',
		});

		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('@');
	});
});

describe('tags.untagSubscriber', () => {
	it('DELETEs with the address in the query', async () => {
		respondEmpty(204);

		await expect(
			invoke(Tags.untagSubscriber, {
				tagId: 31,
				email_address: 'jordan@acme.example',
			}),
		).resolves.toMatchObject({ success: true, tag_id: 31 });
		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v4/tags/31/subscribers',
			query: { email_address: 'jordan@acme.example' },
		});
	});
});

describe('customFields', () => {
	it('lists the fields with their keys', async () => {
		respond(customFields);

		const result = (await invoke(CustomFields.list, {})) as typeof customFields;

		expect(result.custom_fields[0]?.key).toBe('last_name');
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v4/custom_fields',
		});
	});

	it('creates a field from a label', async () => {
		respond(customFieldResponse, 201);

		await invoke(CustomFields.create, { label: 'Last name' });

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v4/custom_fields',
			body: { label: 'Last name' },
		});
	});

	it('updates a field label', async () => {
		respond(customFieldResponse);

		await invoke(CustomFields.update, { customFieldId: 7, label: 'Surname' });

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v4/custom_fields/7',
			body: { label: 'Surname' },
		});
	});
});

describe('forms', () => {
	it('lists the forms, optionally with counts', async () => {
		respond(forms);

		const result = (await invoke(Forms.list, {
			include: ['subscriber_count'],
			status: 'active',
		})) as typeof forms;

		expect(result.forms[0]?.subscriber_count).toBe(540);
		expect(lastRequest().query).toEqual({
			include: 'subscriber_count',
			status: 'active',
		});
	});

	it('subscribes an address through a form', async () => {
		respond(formSubscriber);

		await expect(
			invoke(Forms.subscribe, {
				form_id: 12,
				email_address: 'jordan@acme.example',
				referrer: 'https://acme.example/blog',
			}),
		).resolves.toMatchObject({
			subscriber: { id: 1001, added_at: '2026-11-12T10:00:00Z' },
		});
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v4/forms/12/subscribers',
			body: {
				email_address: 'jordan@acme.example',
				referrer: 'https://acme.example/blog',
			},
		});
	});

	it('logs the form and subscriber, never the address', async () => {
		respond(formSubscriber);

		await invoke(Forms.subscribe, {
			form_id: 12,
			email_address: 'jordan@acme.example',
		});

		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('@');
	});

	it.each([
		[{ form_id: 12 }],
		[{ email_address: 'a@b.example' }],
		[{ form_id: 0, email_address: 'a@b.example' }],
	])('rejects %j before calling Kit', async (input) => {
		await expect(invoke(Forms.subscribe, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('error envelopes', () => {
	it('reads the message out of a 401', async () => {
		respond(invalidKey, 401);

		await expect(invoke(Account.get, {})).rejects.toMatchObject({
			status: 401,
			body: { errors: ['The API key is invalid'] },
			message: 'Kit 401: The API key is invalid',
			request: { method: 'GET' },
		});
	});

	it('reads the missing-key message', async () => {
		respond(missingKey, 401);

		await expect(invoke(Account.get, {})).rejects.toMatchObject({
			message: 'Kit 401: Authentication Failed',
		});
	});

	it('joins every reason Kit gave into one message', async () => {
		respond(unprocessable, 422);

		await expect(
			invoke(Subscribers.create, { email_address: 'not-an-address' }),
		).rejects.toMatchObject({
			status: 422,
			body: {
				errors: [
					'Email address is invalid',
					'Custom field last_name does not exist',
				],
			},
			message:
				'Kit 422: Email address is invalid; Custom field last_name does not exist',
		});
	});

	it('reads a forbidden call as a permission failure', async () => {
		respond(forbidden, 403);

		await expect(invoke(Account.get, {})).rejects.toMatchObject({
			status: 403,
		});
	});

	it('keeps the key out of the error', async () => {
		respond(invalidKey, 401);

		const error = await caught(invoke(Account.get, {}));

		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(String(error)).not.toContain(API_KEY);
	});

	it('keeps the address off the error, so it cannot follow it into a log', async () => {
		respond({ errors: ['a@b.example is already taken'] }, 422);

		const error = await caught(
			invoke(Subscribers.create, { email_address: 'a@b.example' }),
		);

		expect(JSON.stringify(error)).not.toContain('a@b.example');
		expect((error as ApiError).message).not.toContain('a@b.example');
	});

	it('marks a transport failure and keeps the method', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		await expect(
			invoke(Subscribers.create, { email_address: 'a@b.example' }),
		).rejects.toMatchObject({
			transport: true,
			method: 'POST',
			message: 'fetch failed',
		});
	});
});

describe('the error an HTTP failure arrives as', () => {
	it('is core ApiError with the status and the reasons', async () => {
		respond(unprocessable, 422);

		const error = await caught(invoke(Account.get, {}));

		expect(error).toBeInstanceOf(ApiError);
		expect(error).not.toBeInstanceOf(KitAPIError);
		expect(error).toMatchObject({ status: 422 });
		expect((error as ApiError).body.errors).toHaveLength(2);
	});
});
