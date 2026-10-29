import { AuthMissingError } from 'corsair/core';
import { evictChildren } from './endpoints/persist';
import { resolveAccount } from './endpoints/shared';
import { activecampaign } from './index';

/**
 * Behavioural coverage for the things routing checks cannot see: what goes in
 * the request body, which store a response is mirrored into, and what reaches
 * the event log.
 *
 * `routing.test.ts` proves every operation hits the right URL with the right
 * method. This file proves a representative operation of each shape does the
 * right thing once it gets there - the write envelope, the cache target, the
 * audit payload - which is where a silent contract error would otherwise sit.
 */

const ACCOUNT = 'example';
const TOKEN = 'test-token-value';

interface Captured {
	url: string;
	method: string;
	body: unknown;
}

type SearchResult = Array<{ entity_id?: string } | undefined>;

type Store = {
	rows: Map<string, Record<string, unknown>>;
	upsertByEntityId: jest.Mock<Promise<unknown>, [string, unknown]>;
	deleteByEntityId: jest.Mock<Promise<boolean>, [string]>;
	search: jest.Mock<Promise<SearchResult>, [unknown]>;
};

function makeStore(seed: Array<Record<string, unknown>> = []): Store {
	const rows = new Map<string, Record<string, unknown>>();
	for (const row of seed) rows.set(String(row.id), row);
	return {
		rows,
		upsertByEntityId: jest.fn(async (id: string, data) => {
			rows.set(id, data as Record<string, unknown>);
			return data;
		}),
		deleteByEntityId: jest.fn(async (id: string) => rows.delete(id)),
		search: jest.fn<Promise<SearchResult>, [unknown]>(async (options) => {
			const { data } = options as { data: Record<string, unknown> };
			return [...rows.values()]
				.filter((r) => Object.entries(data).every(([k, v]) => r[k] === v))
				.map((r) => ({ entity_id: String(r.id) }));
		}),
	};
}

describe('request bodies, persistence and audit payloads', () => {
	const plugin = activecampaign({ key: TOKEN, account: ACCOUNT });
	const tree = plugin.endpoints as Record<
		string,
		Record<string, (ctx: unknown, input: unknown) => Promise<unknown>>
	>;

	/** Looks an operation up, failing loudly rather than silently skipping. */
	function op(group: string, leaf: string) {
		const fn = tree[group]?.[leaf];
		if (!fn) throw new Error(`No such operation: ${group}.${leaf}`);
		return fn;
	}

	/** The nth captured request, asserted to exist. */
	function call(index = 0): Captured {
		const c = calls[index];
		if (!c) throw new Error(`No request captured at index ${index}`);
		return c;
	}

	const originalFetch = globalThis.fetch;
	let calls: Captured[] = [];
	let warn: jest.SpyInstance;

	function makeCtx(db: Record<string, unknown> = {}) {
		return {
			key: TOKEN,
			options: { account: ACCOUNT },
			keys: { get_account: async () => ACCOUNT },
			db,
			$getAccountId: async () => 'test-account',
			database: undefined,
		};
	}

	function respondWith(body: unknown) {
		globalThis.fetch = (async (url: string, init?: RequestInit) => {
			calls.push({
				url: String(url),
				method: init?.method ?? 'GET',
				body:
					typeof init?.body === 'string' ? JSON.parse(init.body) : init?.body,
			});
			return new Response(JSON.stringify(body), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		}) as typeof fetch;
	}

	beforeEach(() => {
		calls = [];
		warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		respondWith({ meta: { total: '0' } });
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
		warn.mockRestore();
	});

	describe('write bodies', () => {
		it('wraps a create body in the resource envelope', async () => {
			respondWith({ tag: { id: '9', tag: 'vip' } });
			await op('tags', 'create')(makeCtx(), {
				tag: 'vip',
				tagType: 'contact',
			});

			expect(calls).toHaveLength(1);
			expect(call().method).toBe('POST');
			expect(call().body).toEqual({
				tag: { tag: 'vip', tagType: 'contact' },
			});
		});

		/**
		 * ActiveCampaign distinguishes an absent field from an explicit null, so
		 * an omitted optional must not be serialised at all.
		 */
		it('omits undefined optionals from the body rather than sending them', async () => {
			respondWith({ tag: { id: '9' } });
			await op('tags', 'create')(makeCtx(), { tag: 'vip', tagType: 'contact' });

			const body = call().body as { tag: Record<string, unknown> };
			expect(Object.keys(body.tag)).not.toContain('description');
		});

		/**
		 * Omitting this lets ActiveCampaign apply its own default of true, which
		 * mails the account's latest broadcast to every new subscriber.
		 */
		it('sends the fail-safe send_last_broadcast default explicitly', async () => {
			respondWith({ list: { id: '3' } });
			await op('lists', 'create')(makeCtx(), {
				name: 'Newsletter',
				stringid: 'newsletter',
				sender_url: 'https://example.com',
				sender_reminder: 'You signed up',
			});

			const body = call().body as { list: Record<string, unknown> };
			expect(body.list.send_last_broadcast).toBe(false);
		});

		/** Same reasoning, one API surface over: a bulk import can send a lot of mail. */
		it('excludes automations on bulk import unless asked otherwise', async () => {
			respondWith({ Success: 1 });
			await op('imports', 'createBulk')(makeCtx(), {
				contacts: [{ email: 'someone@example.com' }],
			});

			const body = call().body as Record<string, unknown>;
			expect(body.exclude_automations).toBe(true);
		});

		it('pages the account upsert lookup until an exact name match', async () => {
			const firstPage = Array.from({ length: 100 }, (_, i) => ({
				id: String(i + 1),
				name: `other-${i}`,
			}));
			const pages = [
				{ accounts: firstPage },
				{ accounts: [{ id: '101', name: 'Acme' }] },
				{ account: { id: '101', name: 'Acme' } },
			];
			globalThis.fetch = (async (url: string, init?: RequestInit) => {
				calls.push({
					url: String(url),
					method: init?.method ?? 'GET',
					body:
						typeof init?.body === 'string' ? JSON.parse(init.body) : init?.body,
				});
				return new Response(JSON.stringify(pages.shift() ?? {}), {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				});
			}) as typeof fetch;

			await op('accounts', 'upsert')(makeCtx(), { name: 'Acme' });

			const gets = calls.filter((c) => c.method.toUpperCase() === 'GET');
			expect(gets).toHaveLength(2);
			expect(gets[1]?.url).toContain('offset=100');
			expect(call(2).method.toUpperCase()).toBe('PUT');
			expect(call(2).url).toContain('/accounts/101');
		});
	});

	describe('persistence targets', () => {
		it('mirrors a created row into its own store and no other', async () => {
			respondWith({ tag: { id: '9', tag: 'vip' } });
			const tags = makeStore();
			const contacts = makeStore();
			await op('tags', 'create')(makeCtx({ tags, contacts }), {
				tag: 'vip',
				tagType: 'contact',
			});

			expect(tags.upsertByEntityId).toHaveBeenCalledTimes(1);
			expect(tags.upsertByEntityId.mock.calls[0]?.[0]).toBe('9');
			expect(contacts.upsertByEntityId).not.toHaveBeenCalled();
		});

		it('mirrors every row of a listed page', async () => {
			respondWith({
				tags: [{ id: '1' }, { id: '2' }, { id: '3' }],
				meta: { total: '3' },
			});
			const tags = makeStore();
			await op('tags', 'list')(makeCtx({ tags }), {});

			expect(tags.upsertByEntityId).toHaveBeenCalledTimes(3);
			expect([...tags.rows.keys()].sort()).toEqual(['1', '2', '3']);
		});

		/** A read must never remove a row: ActiveCampaign archives, it rarely deletes. */
		it('does not evict on a read', async () => {
			respondWith({ tags: [{ id: '1' }], meta: { total: '1' } });
			const tags = makeStore([{ id: '99' }]);
			await op('tags', 'list')(makeCtx({ tags }), {});

			expect(tags.deleteByEntityId).not.toHaveBeenCalled();
			expect(tags.rows.has('99')).toBe(true);
		});

		it('evicts on an explicit delete', async () => {
			respondWith({});
			const tags = makeStore([{ id: '5' }]);
			await op('tags', 'delete')(makeCtx({ tags }), { id: '5' });

			expect(tags.deleteByEntityId).toHaveBeenCalledWith('5');
			expect(tags.rows.has('5')).toBe(false);
		});

		/**
		 * Deleting a tag removes it from every contact upstream, so the cached
		 * associations must go too - otherwise the mirror keeps describing a
		 * link that no longer exists.
		 */
		it('evicts dependent contactTags when a tag is deleted', async () => {
			respondWith({});
			const tags = makeStore([{ id: '5' }]);
			const contactTags = makeStore([
				{ id: '100', tag: '5' },
				{ id: '101', tag: '5' },
				{ id: '102', tag: '6' },
			]);
			await op('tags', 'delete')(makeCtx({ tags, contactTags }), { id: '5' });

			expect(contactTags.deleteByEntityId).toHaveBeenCalledTimes(2);
			expect([...contactTags.rows.keys()]).toEqual(['102']);
		});

		it('evicts dependent fieldValues when a custom field is deleted', async () => {
			respondWith({});
			const fields = makeStore([{ id: '7' }]);
			const fieldValues = makeStore([
				{ id: '200', field: '7' },
				{ id: '201', field: '8' },
			]);
			await op('fields', 'delete')(makeCtx({ fields, fieldValues }), {
				id: '7',
			});

			expect(fieldValues.deleteByEntityId).toHaveBeenCalledWith('200');
			expect([...fieldValues.rows.keys()]).toEqual(['201']);
		});

		/** A mirror failure must never fail the API call that already succeeded. */
		it('still resolves when the store write throws', async () => {
			respondWith({ tag: { id: '9' } });
			const tags = makeStore();
			tags.upsertByEntityId.mockRejectedValueOnce(new Error('db down'));

			await expect(
				op('tags', 'create')(makeCtx({ tags }), {
					tag: 'vip',
					tagType: 'contact',
				}),
			).resolves.toBeDefined();
			expect(warn).toHaveBeenCalled();
		});
	});

	describe('credential resolution', () => {
		it('prefers the plugin option over stored key material', async () => {
			const account = await resolveAccount({
				options: { account: 'from-options' },
				keys: { get_account: async () => 'from-keys' },
			});
			expect(account).toBe('from-options');
		});

		it('falls back to stored key material', async () => {
			const account = await resolveAccount({
				options: {},
				keys: { get_account: async () => 'from-keys' },
			});
			expect(account).toBe('from-keys');
		});

		/**
		 * Returning '' here would build a request against `https://.api-us1.com`
		 * and surface a missing credential as a confusing transport failure.
		 */
		it.each([
			[{ options: {}, keys: { get_account: async () => null } }],
			[{ options: {}, keys: { get_account: async () => '' } }],
			[{ options: {}, keys: {} }],
			[{}],
		])(
			'raises AuthMissingError when the account is absent: %#',
			async (ctx) => {
				await expect(resolveAccount(ctx)).rejects.toBeInstanceOf(
					AuthMissingError,
				);
			},
		);

		it('names the plugin and the missing field on the error', async () => {
			await expect(resolveAccount({})).rejects.toMatchObject({
				pluginId: 'activecampaign',
				authType: 'account',
			});
		});
	});
});

describe('evictChildren', () => {
	let warn: jest.SpyInstance;
	beforeEach(() => {
		warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
	});
	afterEach(() => warn.mockRestore());

	it('does nothing when the store cannot search', async () => {
		const store = { upsertByEntityId: jest.fn(), deleteByEntityId: jest.fn() };
		await expect(
			evictChildren(store, 'tag', '5', 'contactTag'),
		).resolves.toBeUndefined();
		expect(store.deleteByEntityId).not.toHaveBeenCalled();
	});

	it('does nothing when the parent id is empty', async () => {
		const store = makeStoreForChildren();
		await evictChildren(store, 'tag', '', 'contactTag');
		expect(store.search).not.toHaveBeenCalled();
	});

	it('survives a search that throws', async () => {
		const store = makeStoreForChildren();
		store.search.mockRejectedValueOnce(new Error('query failed'));
		await expect(
			evictChildren(store, 'tag', '5', 'contactTag'),
		).resolves.toBeUndefined();
		expect(warn).toHaveBeenCalled();
	});

	it('keeps deleting after one child fails to evict', async () => {
		const store = makeStoreForChildren();
		store.search.mockResolvedValueOnce([
			{ entity_id: 'a' },
			{ entity_id: 'b' },
		]);
		store.deleteByEntityId.mockRejectedValueOnce(new Error('locked'));
		await evictChildren(store, 'tag', '5', 'contactTag');
		expect(store.deleteByEntityId).toHaveBeenCalledTimes(2);
		expect(warn).toHaveBeenCalled();
	});

	it('skips rows with no usable entity id', async () => {
		const store = makeStoreForChildren();
		store.search.mockResolvedValueOnce([{}, { entity_id: '' }, undefined]);
		await evictChildren(store, 'tag', '5', 'contactTag');
		expect(store.deleteByEntityId).not.toHaveBeenCalled();
	});
});

function makeStoreForChildren() {
	return {
		upsertByEntityId: jest.fn(),
		deleteByEntityId: jest.fn<Promise<boolean>, [string]>(async () => true),
		search: jest.fn<Promise<SearchResult>, [unknown]>(async () => []),
	};
}
