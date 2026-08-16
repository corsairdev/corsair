/**
 * Exercises every one of the 57 catalog endpoint wrappers: the HTTP method
 * and path each one builds, the cache writes/evictions they perform, and
 * what reaches the event log. Network access is mocked, so this runs in CI.
 */
import { logEventFromContext } from 'corsair/core';
import {
	Auth,
	BrandProperties,
	Brands,
	BulkCampaigns,
	Connections,
	Contacts,
	Fields,
	Lists,
	MessageTypes,
	Segments,
	Senders,
	SuppressionLists,
	Templates,
	TransactionalCampaigns,
	Users,
} from './endpoints';
import { bigmailerEndpointMeta } from './index';

// The event-log payload is asserted directly further down: it is the one
// place caller-supplied text could leak into durable storage, so it needs to
// be inspected rather than inferred.
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

type Ctx = Parameters<typeof Brands.list>[0];

function makeCtx() {
	const db = {
		brands: makeStore(),
		brandProperties: makeStore(),
		fields: makeStore(),
		lists: makeStore(),
		connections: makeStore(),
		messageTypes: makeStore(),
		senders: makeStore(),
		contacts: makeStore(),
		segments: makeStore(),
		suppressionLists: makeStore(),
		templates: makeStore(),
		bulkCampaigns: makeStore(),
		transactionalCampaigns: makeStore(),
	};
	const ctx = {
		key: 'test-bigmailer-key',
		db,
		database: undefined,
		$getAccountId: async () => 'test-account',
	} as unknown as Ctx;
	return { ctx, db };
}

let lastUrl = '';
let lastMethod = '';
let lastBody: string | undefined;
let lastFormData: FormData | undefined;

/**
 * One response body serving every operation: it carries every entity's
 * fields plus every list envelope's array key (`data`/`connections`), so the
 * table below stays about routing rather than per-operation fixtures. Every
 * entity schema is `.loose()` with only `id` required, so unrelated extra
 * fields on this shared body are harmless.
 */
const ENTITY = {
	id: 'e1',
	name: 'Acme',
	from_name: 'Acme Support',
	from_email: 'support@example.com',
	merge_tag_name: 'ACME',
	is_html: false,
	string_value: 'value',
	type: 'text',
	sample_value: 'sample',
	all: false,
	num_contacts: 3,
	identity_type: 'domain',
	Identity: 'example.com',
	verified: true,
	email: 'contact@example.com',
	operator: 'all',
	conditions: [],
	file_name: 'suppressed.csv',
	file_size: 1024,
	subject: 'Hello',
	from: { email: 'sender@example.com', name: 'Sender' },
	status: 'draft',
	role: 'admin',
	allowed_brands: [],
	created: 1700000000,
};

const RESPONSE_BODY = {
	...ENTITY,
	data: [ENTITY],
	connections: [ENTITY],
	has_more: false,
	cursor: null,
	total: 1,
};

beforeEach(() => {
	mockLogEvent.mockClear();
	lastUrl = '';
	lastMethod = '';
	lastBody = undefined;
	lastFormData = undefined;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		lastUrl = String(url);
		lastMethod = init?.method ?? 'GET';
		lastBody = typeof init?.body === 'string' ? init.body : undefined;
		lastFormData = init?.body instanceof FormData ? init.body : undefined;
		return {
			ok: true,
			status: 200,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => RESPONSE_BODY,
			text: async () => JSON.stringify(RESPONSE_BODY),
		};
	}) as unknown as typeof global.fetch;
});

/** [registry path, invocation, expected method, expected path] */
const OPERATIONS: [string, (ctx: Ctx) => Promise<unknown>, string, string][] = [
	['brands.list', (c) => Brands.list(c, {}), 'GET', '/v1/brands'],
	[
		'brands.create',
		(c) => Brands.create(c, { name: 'Acme' }),
		'POST',
		'/v1/brands',
	],
	[
		'brands.get',
		(c) => Brands.get(c, { brandId: 'b1' }),
		'GET',
		'/v1/brands/b1',
	],
	[
		'brands.update',
		(c) => Brands.update(c, { brandId: 'b1', name: 'Acme2' }),
		'PUT',
		'/v1/brands/b1',
	],

	[
		'brandProperties.list',
		(c) => BrandProperties.list(c, { brandId: 'b1' }),
		'GET',
		'/v1/brands/b1/properties',
	],
	[
		'brandProperties.create',
		(c) => BrandProperties.create(c, { brandId: 'b1', name: 'P' }),
		'POST',
		'/v1/brands/b1/properties',
	],
	[
		'brandProperties.get',
		(c) => BrandProperties.get(c, { brandId: 'b1', brandPropertyId: 'p1' }),
		'GET',
		'/v1/brands/b1/properties/p1',
	],
	[
		'brandProperties.update',
		(c) =>
			BrandProperties.update(c, {
				brandId: 'b1',
				brandPropertyId: 'p1',
				name: 'P2',
			}),
		'PUT',
		'/v1/brands/b1/properties/p1',
	],
	[
		'brandProperties.delete',
		(c) => BrandProperties.remove(c, { brandId: 'b1', brandPropertyId: 'p1' }),
		'DELETE',
		'/v1/brands/b1/properties/p1',
	],

	[
		'fields.list',
		(c) => Fields.list(c, { brandId: 'b1' }),
		'GET',
		'/v1/brands/b1/fields',
	],
	[
		'fields.create',
		(c) => Fields.create(c, { brandId: 'b1', name: 'F', type: 'text' }),
		'POST',
		'/v1/brands/b1/fields',
	],
	[
		'fields.get',
		(c) => Fields.get(c, { brandId: 'b1', fieldId: 'f1' }),
		'GET',
		'/v1/brands/b1/fields/f1',
	],
	[
		'fields.update',
		(c) => Fields.update(c, { brandId: 'b1', fieldId: 'f1', name: 'F2' }),
		'PUT',
		'/v1/brands/b1/fields/f1',
	],
	[
		'fields.delete',
		(c) => Fields.remove(c, { brandId: 'b1', fieldId: 'f1' }),
		'DELETE',
		'/v1/brands/b1/fields/f1',
	],

	[
		'lists.list',
		(c) => Lists.list(c, { brandId: 'b1' }),
		'GET',
		'/v1/brands/b1/lists',
	],
	[
		'lists.create',
		(c) => Lists.create(c, { brandId: 'b1', name: 'L' }),
		'POST',
		'/v1/brands/b1/lists',
	],
	[
		'lists.get',
		(c) => Lists.get(c, { brandId: 'b1', listId: 'l1' }),
		'GET',
		'/v1/brands/b1/lists/l1',
	],
	[
		'lists.update',
		(c) => Lists.update(c, { brandId: 'b1', listId: 'l1', name: 'L2' }),
		'PUT',
		'/v1/brands/b1/lists/l1',
	],
	[
		'lists.delete',
		(c) => Lists.remove(c, { brandId: 'b1', listId: 'l1' }),
		'DELETE',
		'/v1/brands/b1/lists/l1',
	],

	[
		'connections.list',
		(c) => Connections.list(c, { brandId: 'b1' }),
		'GET',
		'/v1/brands/b1/connections',
	],

	[
		'messageTypes.list',
		(c) => MessageTypes.list(c, { brandId: 'b1' }),
		'GET',
		'/v1/brands/b1/message_types',
	],

	[
		'senders.list',
		(c) => Senders.list(c, { brandId: 'b1' }),
		'GET',
		'/v1/brands/b1/senders',
	],

	[
		'contacts.list',
		(c) => Contacts.list(c, { brandId: 'b1' }),
		'GET',
		'/v1/brands/b1/contacts',
	],
	[
		'contacts.create',
		(c) => Contacts.create(c, { brandId: 'b1', email: 'a@example.com' }),
		'POST',
		'/v1/brands/b1/contacts',
	],
	[
		'contacts.get',
		(c) => Contacts.get(c, { brandId: 'b1', contactId: 'c1' }),
		'GET',
		'/v1/brands/b1/contacts/c1',
	],
	[
		'contacts.update',
		(c) => Contacts.update(c, { brandId: 'b1', contactId: 'c1' }),
		'POST',
		'/v1/brands/b1/contacts/c1',
	],
	[
		'contacts.delete',
		(c) => Contacts.remove(c, { brandId: 'b1', contactId: 'c1' }),
		'DELETE',
		'/v1/brands/b1/contacts/c1',
	],
	[
		'contacts.upsert',
		(c) => Contacts.upsert(c, { brandId: 'b1', email: 'a@example.com' }),
		'POST',
		'/v1/brands/b1/contacts/upsert',
	],
	[
		'contacts.createBatch',
		(c) =>
			Contacts.createBatch(c, {
				brandId: 'b1',
				contacts: [{ email: 'a@example.com' }],
			}),
		'POST',
		'/v1/brands/b1/contacts/batches',
	],
	[
		'contacts.getBatch',
		(c) => Contacts.getBatch(c, { brandId: 'b1', batchId: 'batch1' }),
		'GET',
		'/v1/brands/b1/contacts/batches/batch1',
	],

	[
		'segments.list',
		(c) => Segments.list(c, { brandId: 'b1' }),
		'GET',
		'/v1/brands/b1/segments',
	],
	[
		'segments.create',
		(c) =>
			Segments.create(c, {
				brandId: 'b1',
				name: 'Engaged',
				operator: 'all',
				conditions: [],
			}),
		'POST',
		'/v1/brands/b1/segments',
	],
	[
		'segments.get',
		(c) => Segments.get(c, { brandId: 'b1', segmentId: 's1' }),
		'GET',
		'/v1/brands/b1/segments/s1',
	],
	[
		'segments.update',
		(c) => Segments.update(c, { brandId: 'b1', segmentId: 's1', name: 'S2' }),
		'POST',
		'/v1/brands/b1/segments/s1',
	],
	[
		'segments.delete',
		(c) => Segments.remove(c, { brandId: 'b1', segmentId: 's1' }),
		'DELETE',
		'/v1/brands/b1/segments/s1',
	],

	[
		'suppressionLists.list',
		(c) => SuppressionLists.list(c, { brandId: 'b1' }),
		'GET',
		'/v1/brands/b1/suppression-lists',
	],
	[
		'suppressionLists.create',
		(c) => SuppressionLists.create(c, { brandId: 'b1', file: 'YQ==' }),
		'POST',
		'/v1/brands/b1/suppression-lists',
	],
	[
		'suppressionLists.get',
		(c) => SuppressionLists.get(c, { brandId: 'b1', suppressionListId: 'sl1' }),
		'GET',
		'/v1/brands/b1/suppression-lists/sl1',
	],

	[
		'templates.list',
		(c) => Templates.list(c, { brandId: 'b1' }),
		'GET',
		'/v1/brands/b1/templates',
	],
	[
		'templates.create',
		(c) =>
			Templates.create(c, { brandId: 'b1', name: 'Newsletter', type: 'email' }),
		'POST',
		'/v1/brands/b1/templates',
	],
	[
		'templates.get',
		(c) => Templates.get(c, { brandId: 'b1', templateId: 't1' }),
		'GET',
		'/v1/brands/b1/templates/t1',
	],
	[
		'templates.update',
		(c) => Templates.update(c, { brandId: 'b1', templateId: 't1', name: 'T2' }),
		'POST',
		'/v1/brands/b1/templates/t1',
	],
	[
		'templates.delete',
		(c) => Templates.remove(c, { brandId: 'b1', templateId: 't1' }),
		'DELETE',
		'/v1/brands/b1/templates/t1',
	],

	[
		'bulkCampaigns.list',
		(c) => BulkCampaigns.list(c, { brandId: 'b1' }),
		'GET',
		'/v1/brands/b1/campaigns/bulk',
	],
	[
		'bulkCampaigns.create',
		(c) => BulkCampaigns.create(c, { brandId: 'b1', name: 'Promo' }),
		'POST',
		'/v1/brands/b1/campaigns/bulk',
	],
	[
		'bulkCampaigns.get',
		(c) => BulkCampaigns.get(c, { brandId: 'b1', campaignId: 'bc1' }),
		'GET',
		'/v1/brands/b1/campaigns/bulk/bc1',
	],
	[
		'bulkCampaigns.update',
		(c) => BulkCampaigns.update(c, { brandId: 'b1', campaignId: 'bc1' }),
		'PATCH',
		'/v1/brands/b1/campaigns/bulk/bc1',
	],

	[
		'transactionalCampaigns.list',
		(c) => TransactionalCampaigns.list(c, { brandId: 'b1' }),
		'GET',
		'/v1/brands/b1/campaigns/transactional',
	],
	[
		'transactionalCampaigns.create',
		(c) => TransactionalCampaigns.create(c, { brandId: 'b1', name: 'Welcome' }),
		'POST',
		'/v1/brands/b1/campaigns/transactional',
	],
	[
		'transactionalCampaigns.get',
		(c) => TransactionalCampaigns.get(c, { brandId: 'b1', campaignId: 'tc1' }),
		'GET',
		'/v1/brands/b1/campaigns/transactional/tc1',
	],
	[
		'transactionalCampaigns.update',
		(c) =>
			TransactionalCampaigns.update(c, { brandId: 'b1', campaignId: 'tc1' }),
		'PATCH',
		'/v1/brands/b1/campaigns/transactional/tc1',
	],

	['users.list', (c) => Users.list(c, {}), 'GET', '/v1/users'],
	[
		'users.create',
		(c) => Users.create(c, { email: 'u@example.com', role: 'admin' }),
		'POST',
		'/v1/users',
	],
	['users.get', (c) => Users.get(c, { userId: 'u1' }), 'GET', '/v1/users/u1'],
	[
		'users.update',
		(c) => Users.update(c, { userId: 'u1', role: 'admin' }),
		'PUT',
		'/v1/users/u1',
	],
	[
		'users.delete',
		(c) => Users.remove(c, { userId: 'u1' }),
		'DELETE',
		'/v1/users/u1',
	],

	['auth.me', (c) => Auth.me(c, {}), 'GET', '/v1/me'],
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

describe('operation coverage', () => {
	it('exercises every catalog operation the plugin registers', () => {
		const registered = Object.keys(bigmailerEndpointMeta).sort();
		const exercised = OPERATIONS.map(([path]) => path).sort();

		expect(exercised).toEqual(registered);
		expect(registered).toHaveLength(57);
	});

	it('marks every delete operation destructive', () => {
		const deletes = Object.entries(bigmailerEndpointMeta).filter(([path]) =>
			path.toLowerCase().includes('delete'),
		);

		expect(deletes.length).toBe(7);
		for (const [, meta] of deletes) {
			expect(meta.riskLevel).toBe('destructive');
		}
	});
});

describe('caching', () => {
	it('mirrors a fetched brand under its bare id (brands are not brand-scoped)', async () => {
		const { ctx, db } = makeCtx();
		await Brands.get(ctx, { brandId: 'e1' });

		expect(db.brands.upsertByEntityId).toHaveBeenCalledWith(
			'e1',
			expect.objectContaining({ id: 'e1' }),
		);
	});

	it('mirrors a scoped resource under a composite brand:id key, not the bare id', async () => {
		const { ctx, db } = makeCtx();
		await BrandProperties.get(ctx, { brandId: 'b1', brandPropertyId: 'e1' });
		await Fields.get(ctx, { brandId: 'b1', fieldId: 'e1' });
		await Lists.get(ctx, { brandId: 'b1', listId: 'e1' });

		expect(db.brandProperties.upsertByEntityId).toHaveBeenCalledWith(
			'b1:e1',
			expect.anything(),
		);
		expect(db.fields.upsertByEntityId).toHaveBeenCalledWith(
			'b1:e1',
			expect.anything(),
		);
		expect(db.lists.upsertByEntityId).toHaveBeenCalledWith(
			'b1:e1',
			expect.anything(),
		);
	});

	it('caches every item returned by a scoped list under its brand:id key', async () => {
		const { ctx, db } = makeCtx();
		await Connections.list(ctx, { brandId: 'b1' });
		await MessageTypes.list(ctx, { brandId: 'b1' });
		await Senders.list(ctx, { brandId: 'b1' });

		expect(db.connections.upsertByEntityId).toHaveBeenCalledWith(
			'b1:e1',
			expect.anything(),
		);
		expect(db.messageTypes.upsertByEntityId).toHaveBeenCalledWith(
			'b1:e1',
			expect.anything(),
		);
		expect(db.senders.upsertByEntityId).toHaveBeenCalledWith(
			'b1:e1',
			expect.anything(),
		);
	});

	/**
	 * A cache-then-delete round trip, not two independent literal assertions:
	 * proves the key `remove` evicts by is the *same* key `get` cached under,
	 * by comparing the two recorded calls to each other rather than to a
	 * hardcoded string that could drift out of sync with the code on both
	 * sides at once and still pass.
	 */
	it('evicts a brand property using the exact key it was cached under', async () => {
		const { ctx, db } = makeCtx();
		await BrandProperties.get(ctx, {
			brandId: 'b1',
			brandPropertyId: 'round-trip',
		});
		const cachedKey = db.brandProperties.upsertByEntityId.mock.calls[0]?.[0];
		expect(cachedKey).toBe('b1:e1');

		await BrandProperties.remove(ctx, {
			brandId: 'b1',
			brandPropertyId: 'e1',
		});
		expect(db.brandProperties.deleteByEntityId).toHaveBeenCalledWith(cachedKey);
	});

	it('evicts on every delete that has a mirrored entity', async () => {
		const { ctx, db } = makeCtx();

		await BrandProperties.remove(ctx, { brandId: 'b1', brandPropertyId: 'p1' });
		await Fields.remove(ctx, { brandId: 'b1', fieldId: 'f1' });
		await Lists.remove(ctx, { brandId: 'b1', listId: 'l1' });
		await Segments.remove(ctx, { brandId: 'b1', segmentId: 's1' });
		await Templates.remove(ctx, { brandId: 'b1', templateId: 't1' });

		expect(db.brandProperties.deleteByEntityId).toHaveBeenCalledWith('b1:p1');
		expect(db.fields.deleteByEntityId).toHaveBeenCalledWith('b1:f1');
		expect(db.lists.deleteByEntityId).toHaveBeenCalledWith('b1:l1');
		expect(db.segments.deleteByEntityId).toHaveBeenCalledWith('b1:s1');
		expect(db.templates.deleteByEntityId).toHaveBeenCalledWith('b1:t1');
	});

	it('mirrors contacts, campaigns and other Phase 2/3 resources under their brand:id key', async () => {
		const { ctx, db } = makeCtx();
		await Contacts.get(ctx, { brandId: 'b1', contactId: 'e1' });
		await SuppressionLists.get(ctx, { brandId: 'b1', suppressionListId: 'e1' });
		await BulkCampaigns.get(ctx, { brandId: 'b1', campaignId: 'e1' });
		await TransactionalCampaigns.get(ctx, { brandId: 'b1', campaignId: 'e1' });

		expect(db.contacts.upsertByEntityId).toHaveBeenCalledWith(
			'b1:e1',
			expect.anything(),
		);
		expect(db.suppressionLists.upsertByEntityId).toHaveBeenCalledWith(
			'b1:e1',
			expect.anything(),
		);
		expect(db.bulkCampaigns.upsertByEntityId).toHaveBeenCalledWith(
			'b1:e1',
			expect.anything(),
		);
		expect(db.transactionalCampaigns.upsertByEntityId).toHaveBeenCalledWith(
			'b1:e1',
			expect.anything(),
		);
	});

	it('does not cache account users, an identity/access record rather than configuration', async () => {
		const { ctx, db } = makeCtx();
		await Users.get(ctx, { userId: 'u1' });
		await Users.list(ctx, {});

		for (const store of Object.values(db)) {
			expect(store.upsertByEntityId).not.toHaveBeenCalled();
		}
	});

	it('does not cache a contact batch, a transactional processing status rather than durable configuration', async () => {
		const { ctx, db } = makeCtx();
		await Contacts.createBatch(ctx, {
			brandId: 'b1',
			contacts: [{ email: 'a@example.com' }],
		});
		await Contacts.getBatch(ctx, { brandId: 'b1', batchId: 'batch1' });

		expect(db.contacts.upsertByEntityId).not.toHaveBeenCalled();
	});
});

describe('event log', () => {
	it('records a brand property by id without its value', async () => {
		const { ctx } = makeCtx();
		await BrandProperties.create(ctx, {
			brandId: 'b1',
			name: 'Address',
			stringValue: '123 Main St',
		});

		const [, , payload] = mockLogEvent.mock.calls[0] ?? [];
		expect(payload).toEqual(
			expect.objectContaining({ brandId: 'b1', name: 'Address' }),
		);
		expect(JSON.stringify(payload)).not.toContain('123 Main St');
	});

	it('never logs a brand logo, even when supplied', async () => {
		const { ctx } = makeCtx();
		await Brands.create(ctx, {
			name: 'Acme',
			logo: 'base64-image-data-should-never-be-logged',
		});

		const [, , payload] = mockLogEvent.mock.calls[0] ?? [];
		expect(JSON.stringify(payload)).not.toContain(
			'base64-image-data-should-never-be-logged',
		);
	});

	/**
	 * A contact's email is personal data and is deny-listed by
	 * `logging.ts`'s `NEVER_LOG_VALUE` - never logged, even though `create`
	 * lists it as the operation's one real identifier. `contactId` on
	 * get/update/delete is deny-listed too, since it may itself be an email
	 * address (see `contacts.ts`'s own comments).
	 */
	it('never logs a contact email, even though it is the operation identifier', async () => {
		const { ctx } = makeCtx();
		await Contacts.create(ctx, {
			brandId: 'b1',
			email: 'a@example.com',
			fieldValues: [{ name: 'ssn', string: '123-45-6789' }],
		});

		const [, , payload] = mockLogEvent.mock.calls[0] ?? [];
		expect(payload).toEqual(expect.objectContaining({ brandId: 'b1' }));
		expect(JSON.stringify(payload)).not.toContain('a@example.com');
		expect(JSON.stringify(payload)).not.toContain('123-45-6789');
	});
});

describe('request bodies', () => {
	it('sends brand creation fields snake_cased, dropping unset optionals', async () => {
		const { ctx } = makeCtx();
		await Brands.create(ctx, { name: 'Acme', fromEmail: 'a@example.com' });

		const body = JSON.parse(lastBody ?? '{}');
		expect(body).toEqual({ name: 'Acme', from_email: 'a@example.com' });
	});

	it('never lets field type be changed via update', async () => {
		const { ctx } = makeCtx();
		await Fields.update(ctx, { brandId: 'b1', fieldId: 'f1', name: 'F2' });

		const body = JSON.parse(lastBody ?? '{}');
		expect(body).not.toHaveProperty('type');
	});

	/**
	 * `ready` is what activates sending/scheduling on a campaign - omitting it
	 * must leave the campaign a draft, not silently default to sending. This
	 * proves the field is dropped by `compact()`, not sent as a false `false`
	 * (which would itself be a hidden decision the caller never made).
	 */
	it('omits ready entirely on a bulk campaign create when not supplied, rather than defaulting it', async () => {
		const { ctx } = makeCtx();
		await BulkCampaigns.create(ctx, { brandId: 'b1', name: 'Promo' });

		const body = JSON.parse(lastBody ?? '{}');
		expect(body).not.toHaveProperty('ready');
	});

	it('sends ready:true on a bulk campaign only when the caller explicitly asks for it', async () => {
		const { ctx } = makeCtx();
		await BulkCampaigns.update(ctx, {
			brandId: 'b1',
			campaignId: 'bc1',
			ready: true,
		});

		const body = JSON.parse(lastBody ?? '{}');
		expect(body).toEqual({ ready: true });
	});

	it('sends suppression list uploads as multipart form data, decoded from the base64 input', async () => {
		const { ctx } = makeCtx();
		await SuppressionLists.create(ctx, {
			brandId: 'b1',
			file: Buffer.from('email@example.com').toString('base64'),
		});

		expect(lastFormData).toBeInstanceOf(FormData);
		const file = lastFormData?.get('file');
		expect(file).toBeInstanceOf(Blob);
		expect(await (file as Blob).text()).toBe('email@example.com');
		// A multipart body must never carry an application/json Content-Type -
		// fetch derives the multipart boundary header itself only when no
		// Content-Type (or body) is preset by the caller.
		expect(lastBody).toBeUndefined();
	});
});
