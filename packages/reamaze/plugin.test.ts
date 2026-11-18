import { AuthMissingError } from 'corsair/core';
import { reamaze, reamazeAuthConfig, reamazeEndpointSchemas } from './index';

const OPERATIONS = [
	'articles.create',
	'articles.get',
	'articles.list',
	'articles.update',
	'channels.get',
	'channels.list',
	'contacts.create',
	'contacts.list',
	'contacts.update',
	'conversations.create',
	'conversations.get',
	'conversations.list',
	'conversations.update',
	'identities.create',
	'identities.list',
	'incidents.create',
	'incidents.get',
	'incidents.list',
	'incidents.update',
	'messages.create',
	'messages.list',
	'notes.create',
	'notes.delete',
	'notes.list',
	'notes.update',
	'reports.channelSummary',
	'reports.responseTime',
	'reports.staff',
	'reports.tags',
	'reports.volume',
	'responseTemplates.create',
	'responseTemplates.get',
	'responseTemplates.list',
	'responseTemplates.update',
	'satisfaction.list',
	'staff.create',
	'staff.list',
	'systems.list',
] as const;

/**
 * Nested `group -> function` maps, as the plugin registers them.
 * unknown: only the keys are walked, so the handler leaf type is never used.
 */
type NestedMap = Record<string, Record<string, unknown>>;

function flatten(tree: NestedMap): string[] {
	const paths: string[] = [];
	for (const [group, members] of Object.entries(tree)) {
		for (const name of Object.keys(members)) paths.push(`${group}.${name}`);
	}
	return paths.sort();
}

/**
 * unknown: `endpoints` and `endpointMeta` are optionals on `CorsairPlugin`, so
 * the assertions widen them one cast at a time.
 */
function asNested(value: unknown): NestedMap {
	return value as NestedMap;
}

describe('reamaze plugin definition', () => {
	const plugin = reamaze();
	// unknown: same widening as `asNested`, for the meta map.
	const meta = plugin.endpointMeta as unknown as Record<
		string,
		{ riskLevel: string; description: string; irreversible?: boolean }
	>;

	it('registers as reamaze with api_key auth', () => {
		expect(plugin.id).toBe('reamaze');
		expect(plugin.options?.authType).toBe('api_key');
		expect(Object.keys(reamazeAuthConfig)).toEqual(['api_key']);
	});

	it('declares the brand host as an account field', () => {
		// Re:amaze has no shared API host, so the resolver reads it per account.
		expect([...reamazeAuthConfig.api_key.account]).toContain('host');
	});

	it('declares no inbound webhooks', () => {
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {}, body: {} })).toBe(
			false,
		);
	});

	it('registers exactly the 38 operations', () => {
		expect(flatten(asNested(plugin.endpoints))).toEqual([...OPERATIONS]);
	});

	it('gives every operation a risk level', () => {
		expect(Object.keys(meta).sort()).toEqual([...OPERATIONS]);
		const risks = Object.fromEntries(
			Object.entries(meta).map(([name, entry]) => [name, entry.riskLevel]),
		);

		expect(risks).toEqual({
			'articles.create': 'write',
			'articles.get': 'read',
			'articles.list': 'read',
			'articles.update': 'write',
			'channels.get': 'read',
			'channels.list': 'read',
			'contacts.create': 'write',
			'contacts.list': 'read',
			'contacts.update': 'write',
			'conversations.create': 'write',
			'conversations.get': 'read',
			'conversations.list': 'read',
			'conversations.update': 'write',
			'identities.create': 'write',
			'identities.list': 'read',
			'incidents.create': 'write',
			'incidents.get': 'read',
			'incidents.list': 'read',
			'incidents.update': 'write',
			'messages.create': 'write',
			'messages.list': 'read',
			'notes.create': 'write',
			'notes.delete': 'destructive',
			'notes.list': 'read',
			'notes.update': 'write',
			'reports.channelSummary': 'read',
			'reports.responseTime': 'read',
			'reports.staff': 'read',
			'reports.tags': 'read',
			'reports.volume': 'read',
			'responseTemplates.create': 'write',
			'responseTemplates.get': 'read',
			'responseTemplates.list': 'read',
			'responseTemplates.update': 'write',
			'satisfaction.list': 'read',
			'staff.create': 'write',
			'staff.list': 'read',
			'systems.list': 'read',
		});
	});

	it('marks only the note delete destructive and irreversible', () => {
		expect(meta['notes.delete']?.irreversible).toBe(true);
		// Every other write is undone by another call, so none is irreversible.
		const irreversible = Object.entries(meta)
			.filter(([, entry]) => entry.irreversible)
			.map(([name]) => name);
		expect(irreversible).toEqual(['notes.delete']);
	});

	it('says that a reply reaches a real customer', () => {
		// Sending a message is `write`, like every other send in the catalog, so
		// the description is where an agent learns that it leaves the building.
		expect(meta['messages.create']?.riskLevel).toBe('write');
		expect(meta['messages.create']?.description).toMatch(/real customer/);
		expect(meta['messages.create']?.description).toMatch(/internal note/);
	});

	it('describes every operation', () => {
		for (const entry of Object.values(meta)) {
			expect(entry.description.length).toBeGreaterThan(10);
		}
	});

	it('has an input and output schema for every operation', () => {
		expect(Object.keys(reamazeEndpointSchemas).sort()).toEqual([...OPERATIONS]);
		for (const schemas of Object.values(reamazeEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('rejects a conversation filter the vendor does not accept', () => {
		const list = reamazeEndpointSchemas['conversations.list'];
		expect(list.input.safeParse({ filter: 'all' }).success).toBe(true);
		expect(list.input.safeParse({ filter: 'unassigned' }).success).toBe(true);
		expect(list.input.safeParse({ filter: 'deleted' }).success).toBe(false);
	});

	it('rejects a non-positive page number', () => {
		const list = reamazeEndpointSchemas['conversations.list'];
		expect(list.input.safeParse({ page: 1 }).success).toBe(true);
		expect(list.input.safeParse({ page: 0 }).success).toBe(false);
		expect(list.input.safeParse({ page: -1 }).success).toBe(false);
	});

	it('requires a body and a conversation on message create', () => {
		const create = reamazeEndpointSchemas['messages.create'];
		expect(create.input.safeParse({ slug: 'x', body: 'hi' }).success).toBe(
			true,
		);
		expect(create.input.safeParse({ slug: 'x' }).success).toBe(false);
		expect(create.input.safeParse({ body: 'hi' }).success).toBe(false);
	});

	it('requires the message and user on conversation create', () => {
		const create = reamazeEndpointSchemas['conversations.create'];
		expect(
			create.input.safeParse({
				subject: 'foo',
				category: 'support',
				message: { body: 'bar' },
				user: { name: 'bob', email: 'bob@example.com' },
			}).success,
		).toBe(true);
		expect(
			create.input.safeParse({ subject: 'foo', category: 'support' }).success,
		).toBe(false);
	});

	it('takes an email or a mobile number on contact create', () => {
		// The vendor requires one of the two, so a phone-only contact is valid.
		const create = reamazeEndpointSchemas['contacts.create'];
		expect(
			create.input.safeParse({ name: 'bob', email: 'bob@example.com' }).success,
		).toBe(true);
		expect(
			create.input.safeParse({ name: 'bob', mobile: '+12223334444' }).success,
		).toBe(true);
		expect(create.input.safeParse({ name: 'bob' }).success).toBe(false);
	});

	it('accepts only the documented article statuses', () => {
		const create = reamazeEndpointSchemas['articles.create'];
		const base = { topic: 'faq', title: 'foo', body: 'support' };
		expect(create.input.safeParse({ ...base, status: 0 }).success).toBe(true);
		expect(create.input.safeParse({ ...base, status: 4 }).success).toBe(true);
		expect(create.input.safeParse({ ...base, status: 2 }).success).toBe(false);
	});

	it('keeps DEFAULT last when a caller adds a handler', () => {
		const custom = reamaze({
			errorHandlers: {
				QUOTA_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});

		expect(names.at(-1)).toBe('DEFAULT');
		expect(names.indexOf('QUOTA_ERROR')).toBeLessThan(names.indexOf('DEFAULT'));
	});
});

describe('reamaze key builder', () => {
	function ctx(stored: string | null, host: string | null = 'acme') {
		return {
			authType: 'api_key' as const,
			options: {},
			tenantId: 'default',
			keys: {
				get_api_key: jest.fn().mockResolvedValue(stored),
				get_host: jest.fn().mockResolvedValue(host),
			},
		};
	}

	const PAIR = JSON.stringify({ email: 'admin@example.com', token: 'tok' });

	it('prefers an explicit key without reading the store', async () => {
		const fixture = ctx(PAIR);

		const key = await reamaze({ key: 'explicit' }).keyBuilder?.(
			fixture as never,
			'endpoint',
		);

		expect(key).toBe('explicit');
		expect(fixture.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('falls back to the stored credential pair', async () => {
		await expect(
			reamaze().keyBuilder?.(ctx(PAIR) as never, 'endpoint'),
		).resolves.toBe(PAIR);
	});

	it('throws AuthMissingError when a pair is stored without a brand host', async () => {
		// The host is the other half of a connection. Only an AuthMissingError
		// from the key builder gets the tenant a connect link, so a missing host
		// must not surface later as a plain error from the endpoint.
		await expect(
			reamaze().keyBuilder?.(ctx(PAIR, null) as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(
			reamaze().keyBuilder?.(ctx(PAIR, '  ') as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('takes the brand host from the plugin option without reading the store', async () => {
		const fixture = ctx(PAIR, null);

		await expect(
			reamaze({ host: 'acme' }).keyBuilder?.(fixture as never, 'endpoint'),
		).resolves.toBe(PAIR);
		expect(fixture.keys.get_host).not.toHaveBeenCalled();
	});

	it('throws AuthMissingError when no pair is stored', async () => {
		await expect(
			reamaze().keyBuilder?.(ctx(null) as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError, not a TypeError, with no key manager', async () => {
		// A context built without a key manager has no `keys` at all, so reading
		// it would TypeError before the auth error could be raised.
		const bare = {
			authType: 'api_key' as const,
			options: {},
			tenantId: 'default',
		};

		await expect(
			reamaze().keyBuilder?.(bare as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('refuses a webhook source, because there are no webhooks', async () => {
		await expect(
			reamaze().keyBuilder?.(ctx(PAIR) as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
