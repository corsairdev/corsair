/**
 * Exercises all 49 endpoint wrappers: the HTTP method and path each one
 * builds, account-id path scoping, the cache writes they perform, and what
 * reaches the event log. Network access is mocked, so this runs in CI.
 */
import { logEventFromContext } from 'corsair/core';
import {
	Account,
	ContactFields,
	ContactLists,
	Contacts,
	EmailTemplates,
	Inboxes,
	Messages,
	Projects,
	SendingDomains,
	Stats,
	Suppressions,
} from './endpoints';
import { isNonIdempotent } from './error-handlers';
import { mailtrapEndpointSchemas } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

type Store = { upsertByEntityId: jest.Mock; deleteByEntityId: jest.Mock };

function makeStore(): Store {
	return {
		upsertByEntityId: jest.fn(async () => undefined),
		deleteByEntityId: jest.fn(async () => true),
	};
}

type Ctx = Parameters<typeof Account.listAccounts>[0];

function makeCtx() {
	const db = {
		contacts: makeStore(),
		contactLists: makeStore(),
		contactFields: makeStore(),
		emailTemplates: makeStore(),
		sendingDomains: makeStore(),
		projects: makeStore(),
		inboxes: makeStore(),
	};
	// Cast, not a claim that this satisfies the real Ctx shape: only the
	// fields every endpoint under test actually reads (`key`, `options`,
	// `db`) are built, matching the same minimal-mock pattern `client.test.ts`
	// uses for `Response`.
	const ctx = {
		key: 'test-mailtrap-token',
		options: { accountId: '123' },
		db,
	} as unknown as Ctx;
	return { ctx, db };
}

let lastUrl = '';
let lastMethod = '';
let lastBody: string | undefined;

/**
 * A single fixture serves every operation below despite Mailtrap's response
 * envelopes being genuinely inconsistent per resource (see `types.ts`):
 * some operations read the top-level body as an array, others read it as an
 * object, `sendingDomains.list` reads a `.data` array, `contacts.create`/
 * `get`/`update` read a `.data` object. Since a JS array is also an object,
 * it can carry named properties alongside its indexed elements — so the top
 * level and `.data` are each built as "an array with extra properties",
 * satisfying both access patterns at once rather than needing a fixture per
 * operation.
 */
const contactLike = {
	id: 'c1',
	email: 'a@example.com',
	created_at: 1700000000000,
	updated_at: 1700000000000,
	list_ids: [1],
	status: 'subscribed',
	fields: { first_name: 'A' },
};
const domainListItem = {
	id: 2,
	domain_name: 'nested.example.com',
	demo: false,
	inbound_enabled: false,
	inbound_verified: false,
	open_tracking_enabled: true,
	click_tracking_enabled: false,
};
const dataValue = Object.assign([domainListItem], contactLike);

const listItem = {
	id: 1,
	name: 'Listed',
	domain_name: 'listed.example.com',
	email_username: 'listed-inbox',
	merge_tag: 'listed_field',
	data_type: 'text',
	subject: 'Listed subject',
	category: 'listed',
	body_html: '<p>listed</p>',
};

const RESPONSE_BODY = Object.assign([listItem], {
	id: 1,
	name: 'Listed',
	domain_name: 'listed.example.com',
	demo: false,
	inbound_enabled: false,
	inbound_verified: false,
	open_tracking_enabled: true,
	click_tracking_enabled: false,
	email_username: 'listed-inbox',
	project_id: 1,
	domain: 'sandbox.smtp.mailtrap.io',
	status: 'active',
	merge_tag: 'listed_field',
	data_type: 'text',
	subject: 'Listed subject',
	category: 'listed',
	body_html: '<p>listed</p>',
	body_text: null,
	data: dataValue,
});

/**
 * Per-test override for the mocked response, reset to a 200 JSON success in
 * `beforeEach`. Tests that need a different status/body (a real 204, a
 * validation failure) mutate this rather than the fetch stub itself. `body`
 * is `unknown`, not `RESPONSE_BODY`'s type, because individual tests also
 * hand it `undefined` (204) and error-shaped objects (`{ errors: ... }`).
 */
let mockResponse: { status: number; ok?: boolean; body: unknown } = {
	status: 200,
	body: RESPONSE_BODY,
};

beforeEach(() => {
	mockLogEvent.mockClear();
	lastUrl = '';
	lastMethod = '';
	lastBody = undefined;
	mockResponse = { status: 200, body: RESPONSE_BODY };
	// `url` is `unknown` rather than `RequestInfo | URL`; see client.test.ts.
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		lastUrl = String(url);
		lastMethod = init?.method ?? 'GET';
		lastBody = typeof init?.body === 'string' ? init.body : undefined;
		const status = mockResponse.status;
		return {
			ok: mockResponse.ok ?? status < 400,
			status,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => mockResponse.body,
			text: async () => JSON.stringify(mockResponse.body),
			// Partial `Response` stub; see client.test.ts for why this cast.
		};
	}) as unknown as typeof global.fetch;
});

/**
 * [registry path, invocation, expected method, expected path]. The
 * invocation returns `Promise<unknown>` because the 49 operations return 49
 * different shapes and every consumer below (the routing/scoping/coverage
 * loops) only awaits the call — none reads the resolved value.
 */
const OPERATIONS: [string, (ctx: Ctx) => Promise<unknown>, string, string][] = [
	[
		'account.listAccounts',
		(c) => Account.listAccounts(c, {}),
		'GET',
		'/api/accounts',
	],
	[
		'account.getPermissionResources',
		(c) => Account.getPermissionResources(c, {}),
		'GET',
		'/api/accounts/123/account_accesses',
	],
	[
		'account.getBillingUsage',
		(c) => Account.getBillingUsage(c, {}),
		'GET',
		'/api/accounts/123/billing/usage',
	],

	[
		'contacts.create',
		(c) => Contacts.create(c, { email: 'a@example.com' }),
		'POST',
		'/api/accounts/123/contacts',
	],
	[
		'contacts.get',
		(c) => Contacts.get(c, { identifier: 'c1' }),
		'GET',
		'/api/accounts/123/contacts/c1',
	],
	[
		'contacts.update',
		(c) => Contacts.update(c, { identifier: 'c1', email: 'b@example.com' }),
		'PATCH',
		'/api/accounts/123/contacts/c1',
	],
	[
		'contacts.delete',
		(c) => Contacts.delete(c, { identifier: 'c1' }),
		'DELETE',
		'/api/accounts/123/contacts/c1',
	],
	[
		'contacts.createEvent',
		(c) => Contacts.createEvent(c, { identifier: 'c1', name: 'signup' }),
		'POST',
		'/api/accounts/123/contacts/c1/events',
	],
	[
		'contacts.createExport',
		(c) =>
			Contacts.createExport(c, {
				filters: [{ name: 'email', operator: 'equal', value: 'a@example.com' }],
			}),
		'POST',
		'/api/accounts/123/contacts/exports',
	],
	[
		'contacts.getExport',
		(c) => Contacts.getExport(c, { export_id: 1 }),
		'GET',
		'/api/accounts/123/contacts/exports/1',
	],
	[
		'contacts.import',
		(c) => Contacts.import(c, { contacts: [{ email: 'a@example.com' }] }),
		'POST',
		'/api/accounts/123/contacts/imports',
	],
	[
		'contacts.getImport',
		(c) => Contacts.getImport(c, { import_id: 1 }),
		'GET',
		'/api/accounts/123/contacts/imports/1',
	],

	[
		'contactLists.list',
		(c) => ContactLists.list(c, {}),
		'GET',
		'/api/accounts/123/contacts/lists',
	],
	[
		'contactLists.create',
		(c) => ContactLists.create(c, { name: 'L' }),
		'POST',
		'/api/accounts/123/contacts/lists',
	],
	[
		'contactLists.get',
		(c) => ContactLists.get(c, { list_id: 1 }),
		'GET',
		'/api/accounts/123/contacts/lists/1',
	],
	[
		'contactLists.update',
		(c) => ContactLists.update(c, { list_id: 1, name: 'L2' }),
		'PATCH',
		'/api/accounts/123/contacts/lists/1',
	],
	[
		'contactLists.delete',
		(c) => ContactLists.delete(c, { list_id: 1 }),
		'DELETE',
		'/api/accounts/123/contacts/lists/1',
	],

	[
		'contactFields.list',
		(c) => ContactFields.list(c, {}),
		'GET',
		'/api/accounts/123/contacts/fields',
	],
	[
		'contactFields.create',
		(c) =>
			ContactFields.create(c, { name: 'F', merge_tag: 'f', data_type: 'text' }),
		'POST',
		'/api/accounts/123/contacts/fields',
	],
	[
		'contactFields.get',
		(c) => ContactFields.get(c, { field_id: 1 }),
		'GET',
		'/api/accounts/123/contacts/fields/1',
	],
	[
		'contactFields.update',
		(c) => ContactFields.update(c, { field_id: 1, name: 'F2' }),
		'PATCH',
		'/api/accounts/123/contacts/fields/1',
	],
	[
		'contactFields.delete',
		(c) => ContactFields.delete(c, { field_id: 1 }),
		'DELETE',
		'/api/accounts/123/contacts/fields/1',
	],

	[
		'suppressions.list',
		(c) => Suppressions.list(c, {}),
		'GET',
		'/api/accounts/123/suppressions',
	],

	[
		'emailTemplates.list',
		(c) => EmailTemplates.list(c, {}),
		'GET',
		'/api/accounts/123/email_templates',
	],
	[
		'emailTemplates.create',
		(c) =>
			EmailTemplates.create(c, {
				name: 'T',
				subject: 'S',
				category: 'cat',
				body_html: '<p>x</p>',
			}),
		'POST',
		'/api/accounts/123/email_templates',
	],
	[
		'emailTemplates.get',
		(c) => EmailTemplates.get(c, { template_id: 1 }),
		'GET',
		'/api/accounts/123/email_templates/1',
	],
	[
		'emailTemplates.update',
		(c) => EmailTemplates.update(c, { template_id: 1, subject: 'S2' }),
		'PATCH',
		'/api/accounts/123/email_templates/1',
	],
	[
		'emailTemplates.delete',
		(c) => EmailTemplates.delete(c, { template_id: 1 }),
		'DELETE',
		'/api/accounts/123/email_templates/1',
	],

	[
		'sendingDomains.list',
		(c) => SendingDomains.list(c, {}),
		'GET',
		'/api/accounts/123/sending_domains',
	],
	[
		'sendingDomains.create',
		(c) => SendingDomains.create(c, { domain_name: 'example.com' }),
		'POST',
		'/api/accounts/123/sending_domains',
	],
	[
		'sendingDomains.get',
		(c) => SendingDomains.get(c, { domain_id: 1 }),
		'GET',
		'/api/accounts/123/sending_domains/1',
	],
	[
		'sendingDomains.delete',
		(c) => SendingDomains.delete(c, { domain_id: 1 }),
		'DELETE',
		'/api/accounts/123/sending_domains/1',
	],

	[
		'stats.get',
		(c) => Stats.get(c, { start_date: '2026-01-01', end_date: '2026-01-31' }),
		'GET',
		'/api/accounts/123/stats',
	],
	[
		'stats.byDate',
		(c) =>
			Stats.byDate(c, { start_date: '2026-01-01', end_date: '2026-01-31' }),
		'GET',
		'/api/accounts/123/stats/date',
	],
	[
		'stats.byDomains',
		(c) =>
			Stats.byDomains(c, { start_date: '2026-01-01', end_date: '2026-01-31' }),
		'GET',
		'/api/accounts/123/stats/domains',
	],
	[
		'stats.byCategories',
		(c) =>
			Stats.byCategories(c, {
				start_date: '2026-01-01',
				end_date: '2026-01-31',
			}),
		'GET',
		'/api/accounts/123/stats/categories',
	],
	[
		'stats.byEsp',
		(c) => Stats.byEsp(c, { start_date: '2026-01-01', end_date: '2026-01-31' }),
		'GET',
		'/api/accounts/123/stats/email_service_providers',
	],

	[
		'projects.list',
		(c) => Projects.list(c, {}),
		'GET',
		'/api/accounts/123/projects',
	],
	[
		'projects.get',
		(c) => Projects.get(c, { project_id: 1 }),
		'GET',
		'/api/accounts/123/projects/1',
	],
	[
		'projects.update',
		(c) => Projects.update(c, { project_id: 1, name: 'P2' }),
		'PATCH',
		'/api/accounts/123/projects/1',
	],
	[
		'projects.delete',
		(c) => Projects.delete(c, { project_id: 1 }),
		'DELETE',
		'/api/accounts/123/projects/1',
	],

	[
		'inboxes.list',
		(c) => Inboxes.list(c, {}),
		'GET',
		'/api/accounts/123/inboxes',
	],
	[
		'inboxes.get',
		(c) => Inboxes.get(c, { inbox_id: 1 }),
		'GET',
		'/api/accounts/123/inboxes/1',
	],
	[
		'inboxes.update',
		(c) => Inboxes.update(c, { inbox_id: 1, name: 'I2' }),
		'PATCH',
		'/api/accounts/123/inboxes/1',
	],
	[
		'inboxes.clean',
		(c) => Inboxes.clean(c, { inbox_id: 1 }),
		'PATCH',
		'/api/accounts/123/inboxes/1/clean',
	],
	[
		'inboxes.markAsRead',
		(c) => Inboxes.markAsRead(c, { inbox_id: 1 }),
		'PATCH',
		'/api/accounts/123/inboxes/1/all_read',
	],
	[
		'inboxes.resetCredentials',
		(c) => Inboxes.resetCredentials(c, { inbox_id: 1 }),
		'PATCH',
		'/api/accounts/123/inboxes/1/reset_credentials',
	],

	[
		'messages.list',
		(c) => Messages.list(c, { inbox_id: 1 }),
		'GET',
		'/api/accounts/123/inboxes/1/messages',
	],
	[
		'messages.getHtml',
		(c) => Messages.getHtml(c, { inbox_id: 1, message_id: 1 }),
		'GET',
		'/api/accounts/123/inboxes/1/messages/1/body.html',
	],
];

describe('operation routing', () => {
	for (const [path, invoke, method, expectedPath] of OPERATIONS) {
		it(`${path} issues ${method} ${expectedPath}`, async () => {
			const { ctx } = makeCtx();
			await invoke(ctx);

			expect(lastMethod).toBe(method);
			expect(new URL(lastUrl).pathname).toBe(expectedPath);
		});
	}
});

describe('account scoping', () => {
	it('is the only operation that needs no account id in the path', async () => {
		const { ctx } = makeCtx();
		await Account.listAccounts(ctx, {});

		expect(new URL(lastUrl).pathname).not.toContain('/accounts/123');
	});

	it('embeds the configured account id in every other operation', async () => {
		const others = OPERATIONS.filter(([p]) => p !== 'account.listAccounts');
		// Without this, a renamed/removed operation would silently shrink the
		// loop below to zero iterations and the test would still pass.
		expect(others).toHaveLength(48);

		for (const [, invoke] of others) {
			const { ctx } = makeCtx();
			await invoke(ctx);
			expect(new URL(lastUrl).pathname).toContain('/accounts/123/');
		}
	});
});

describe('operation coverage', () => {
	it('exercises every operation the plugin registers', () => {
		const registered = Object.keys(mailtrapEndpointSchemas).sort();
		const exercised = OPERATIONS.map(([path]) => path).sort();

		expect(exercised).toEqual(registered);
		expect(registered).toHaveLength(49);
	});

	it('treats the confirmed non-idempotent POSTs, and only those, as unsafe to retry', () => {
		// `contacts.createEvent` is POST but excluded in `error-handlers.ts`
		// (an append-only event log entry, not a duplicate resource) — this
		// asserts the predicate against the routing table including that
		// carve-out, so it cannot drift unnoticed.
		const posts = OPERATIONS.filter(([, , method]) => method === 'POST')
			.map(([path]) => path)
			.sort();
		const idempotentPosts = ['contacts.createEvent'];
		const expectedNonIdempotent = posts
			.filter((path) => !idempotentPosts.includes(path))
			.sort();
		const nonIdempotent = OPERATIONS.map(([path]) => path)
			.filter(isNonIdempotent)
			.sort();

		expect(nonIdempotent).toEqual(expectedNonIdempotent);
		expect(posts).toHaveLength(8);
		expect(nonIdempotent).toHaveLength(7);
	});
});

describe('pagination', () => {
	/**
	 * No operation in this catalog returns a continuation token — confirmed
	 * against every list method in `mailtrap@4.8.0`, none of which reads a
	 * `meta`/`next_token` field (see `MAILTRAP-PLAN.md`). `messages.list` is
	 * the one operation with pagination at all, and it uses a numbered
	 * `page` query param instead.
	 */
	it('forwards messages.list’s numbered page instead of a continuation token', async () => {
		const { ctx } = makeCtx();
		await Messages.list(ctx, { inbox_id: 1, page: 2 });

		expect(new URL(lastUrl).searchParams.get('page')).toBe('2');
	});
});

describe('caching', () => {
	it('mirrors a contact on create, get and update', async () => {
		const { ctx, db } = makeCtx();

		await Contacts.create(ctx, { email: 'a@example.com' });
		await Contacts.get(ctx, { identifier: 'c1' });
		await Contacts.update(ctx, { identifier: 'c1', email: 'b@example.com' });

		expect(db.contacts.upsertByEntityId).toHaveBeenCalledTimes(3);
	});

	it('evicts a contact on delete', async () => {
		const { ctx, db } = makeCtx();

		await Contacts.delete(ctx, { identifier: 'c1' });

		expect(db.contacts.deleteByEntityId).toHaveBeenCalledWith('c1');
	});

	it('mirrors a contact list on list and evicts it on delete', async () => {
		const { ctx, db } = makeCtx();

		await ContactLists.list(ctx, {});
		expect(db.contactLists.upsertByEntityId).toHaveBeenCalledTimes(1);

		await ContactLists.delete(ctx, { list_id: 1 });
		expect(db.contactLists.deleteByEntityId).toHaveBeenCalledWith('1');
	});

	it('mirrors a contact field on create and evicts it on delete', async () => {
		const { ctx, db } = makeCtx();

		await ContactFields.create(ctx, {
			name: 'F',
			merge_tag: 'f',
			data_type: 'text',
		});
		expect(db.contactFields.upsertByEntityId).toHaveBeenCalledTimes(1);

		await ContactFields.delete(ctx, { field_id: 1 });
		expect(db.contactFields.deleteByEntityId).toHaveBeenCalledWith('1');
	});

	it('mirrors an email template on create and evicts it on delete', async () => {
		const { ctx, db } = makeCtx();

		await EmailTemplates.create(ctx, {
			name: 'T',
			subject: 'S',
			category: 'cat',
			body_html: '<p>x</p>',
		});
		expect(db.emailTemplates.upsertByEntityId).toHaveBeenCalledTimes(1);

		await EmailTemplates.delete(ctx, { template_id: 1 });
		expect(db.emailTemplates.deleteByEntityId).toHaveBeenCalledWith('1');
	});

	it('mirrors a sending domain on create and evicts it on delete', async () => {
		const { ctx, db } = makeCtx();

		await SendingDomains.create(ctx, { domain_name: 'example.com' });
		expect(db.sendingDomains.upsertByEntityId).toHaveBeenCalledTimes(1);

		await SendingDomains.delete(ctx, { domain_id: 1 });
		expect(db.sendingDomains.deleteByEntityId).toHaveBeenCalledWith('1');
	});

	it('mirrors a project on list and evicts it on delete', async () => {
		const { ctx, db } = makeCtx();

		await Projects.list(ctx, {});
		expect(db.projects.upsertByEntityId).toHaveBeenCalledTimes(1);

		await Projects.delete(ctx, { project_id: 1 });
		expect(db.projects.deleteByEntityId).toHaveBeenCalledWith('1');
	});

	it('mirrors an inbox on list and get', async () => {
		const { ctx, db } = makeCtx();

		await Inboxes.list(ctx, {});
		await Inboxes.get(ctx, { inbox_id: 1 });

		expect(db.inboxes.upsertByEntityId).toHaveBeenCalledTimes(2);
	});
});

describe('event log', () => {
	it('keeps free text out of the payload when auditPayload names the fields', async () => {
		const { ctx } = makeCtx();
		await ContactLists.update(ctx, { list_id: 1, name: 'Renamed' });

		// `logEventFromContext`'s payload parameter type does not narrow past
		// what the mock captures; cast to the shape every payload in this
		// plugin actually is (see `logging.ts`) so `.toEqual()` can compare it.
		const payload = mockLogEvent.mock.calls.at(-1)?.[2] as
			| Record<string, unknown>
			| undefined;
		expect(payload).toEqual({ list_id: 1, fields: ['list_id', 'name'] });
	});

	it('never logs a contact email or its custom field values', async () => {
		const { ctx } = makeCtx();
		await Contacts.create(ctx, {
			email: 'secret@example.com',
			fields: { ssn: '000-00-0000' },
		});

		const payload = mockLogEvent.mock.calls.at(-1)?.[2] as
			| Record<string, unknown>
			| undefined;
		expect(payload).toEqual({ contact_id: 'c1' });
		expect(JSON.stringify(payload)).not.toContain('secret@example.com');
		expect(JSON.stringify(payload)).not.toContain('000-00-0000');
	});

	it('logs the contact count, not the email addresses, for an import', async () => {
		const { ctx } = makeCtx();
		await Contacts.import(ctx, {
			contacts: [{ email: 'a@example.com' }, { email: 'b@example.com' }],
		});

		const payload = mockLogEvent.mock.calls.at(-1)?.[2] as
			| Record<string, unknown>
			| undefined;
		expect(payload).toEqual({ contact_count: 2, import_id: 1 });
	});
});

describe('request bodies', () => {
	it('omits fields the caller did not supply', async () => {
		const { ctx } = makeCtx();
		await ContactFields.update(ctx, { field_id: 1, name: 'Renamed' });

		const body = JSON.parse(lastBody ?? '{}');
		expect(body).toEqual({ name: 'Renamed' });
		expect(body).not.toHaveProperty('merge_tag');
		expect(body).not.toHaveProperty('data_type');
	});

	it('sends no body on a delete', async () => {
		const { ctx } = makeCtx();
		await ContactLists.delete(ctx, { list_id: 1 });

		expect(lastBody).toBeUndefined();
	});

	it('wraps the contact create body under a top-level "contact" key', async () => {
		const { ctx } = makeCtx();
		await Contacts.create(ctx, { email: 'a@example.com' });

		const body = JSON.parse(lastBody ?? '{}');
		expect(body).toEqual({ contact: { email: 'a@example.com' } });
	});

	it('sends the contact list create body unwrapped', async () => {
		const { ctx } = makeCtx();
		await ContactLists.create(ctx, { name: 'L' });

		const body = JSON.parse(lastBody ?? '{}');
		expect(body).toEqual({ name: 'L' });
	});
});

describe('delete results', () => {
	it('reports an empty object rather than the provider-empty body', async () => {
		const { ctx } = makeCtx();

		await expect(ContactLists.delete(ctx, { list_id: 1 })).resolves.toEqual({});
		await expect(Contacts.delete(ctx, { identifier: 'c1' })).resolves.toEqual(
			{},
		);
	});

	/**
	 * Every other test in this file exercises a 200 JSON response. Mailtrap
	 * actually answers a delete with 204 and no body (confirmed live) - this
	 * asserts the endpoint handles that real shape too, not just the mock's
	 * default stand-in.
	 */
	it('handles a real 204 empty response', async () => {
		const { ctx } = makeCtx();
		mockResponse = { status: 204, body: undefined };

		await expect(Contacts.delete(ctx, { identifier: 'c1' })).resolves.toEqual(
			{},
		);
	});

	/**
	 * Unlike every other delete in this catalog, the OSS catalog documents
	 * `DELETE_PROJECT` as returning the deleted project's id rather than an
	 * empty body (see `endpoints/types.ts`).
	 */
	it('reports the deleted project id, per the catalog description', async () => {
		const { ctx } = makeCtx();

		await expect(Projects.delete(ctx, { project_id: 42 })).resolves.toEqual({
			id: 42,
		});
	});
});

describe('contact field update', () => {
	/**
	 * Confirmed live: `PATCH .../contacts/fields/{id}` with a `data_type`
	 * silently ignores it (200, unchanged) rather than rejecting the
	 * request — so it must never be sent at all, not merely left untested.
	 */
	it('never sends data_type, which the live API silently ignores', async () => {
		const { ctx } = makeCtx();
		await ContactFields.update(ctx, { field_id: 1, name: 'Renamed' });

		const body = JSON.parse(lastBody ?? '{}');
		expect(body).not.toHaveProperty('data_type');
	});
});

describe('contact export filters', () => {
	/**
	 * Confirmed live 2026-08-17: `subscription_status` and `list_id` are
	 * real filterable fields (both produced a `finished` export with a
	 * download url); an earlier attempt using `email` as the filter name
	 * 422'd, which had looked like the endpoint was broken rather than one
	 * invalid field name.
	 */
	it('sends the filters through unmodified', async () => {
		const { ctx } = makeCtx();
		await Contacts.createExport(ctx, {
			filters: [
				{ name: 'subscription_status', operator: 'equal', value: 'subscribed' },
			],
		});

		const body = JSON.parse(lastBody ?? '{}');
		expect(body).toEqual({
			filters: [
				{ name: 'subscription_status', operator: 'equal', value: 'subscribed' },
			],
		});
	});
});

describe('account discovery', () => {
	/**
	 * `mailtrapAuthConfig.api_key.account` declares `account_id`, which the
	 * framework uses to generate both `get_account_id` and `set_account_id`
	 * on `ctx.keys`. `resolveAccountId` only reaches discovery when both the
	 * option and the stored key are absent, then persists what it finds so
	 * the next call's `get_account_id` short-circuits back to it.
	 */
	it('discovers the account id and persists it via set_account_id', async () => {
		const setAccountId = jest.fn(async () => undefined);
		const ctx = {
			key: 'test-mailtrap-token',
			options: {},
			keys: {
				get_account_id: async () => null,
				set_account_id: setAccountId,
			},
			db: { contactLists: makeStore() },
		} as unknown as Ctx;

		global.fetch = (async (url: unknown) => {
			const isDiscovery = String(url).endsWith('/api/accounts');
			const body = isDiscovery ? [{ id: 999, name: 'Only' }] : [];
			return {
				ok: true,
				status: 200,
				statusText: 'OK',
				url: String(url),
				headers: new Headers({ 'Content-Type': 'application/json' }),
				json: async () => body,
				text: async () => JSON.stringify(body),
			};
		}) as unknown as typeof global.fetch;

		await ContactLists.list(ctx, {});

		expect(setAccountId).toHaveBeenCalledWith('999');
	});

	it('does not discover or persist when an account id is already configured', async () => {
		const setAccountId = jest.fn(async () => undefined);
		const ctx = {
			key: 'test-mailtrap-token',
			options: { accountId: '123' },
			keys: { set_account_id: setAccountId },
			db: { contactLists: makeStore() },
		} as unknown as Ctx;

		await ContactLists.list(ctx, {});

		expect(setAccountId).not.toHaveBeenCalled();
	});
});

describe('error paths', () => {
	/**
	 * `completed` asserts the call actually finished. Every other test in
	 * this file exercises the success path only; this confirms a failed
	 * call rejects instead of quietly logging `completed` anyway.
	 */
	it('does not log a completed event when the request fails', async () => {
		const { ctx } = makeCtx();
		mockResponse = { status: 422, ok: false, body: { errors: 'invalid' } };

		await expect(ContactLists.create(ctx, { name: 'L' })).rejects.toBeDefined();

		expect(mockLogEvent).not.toHaveBeenCalled();
	});
});
