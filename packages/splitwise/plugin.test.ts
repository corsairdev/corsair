import { AuthMissingError } from 'corsair/core';
import { splitwise, splitwiseEndpointSchemas } from './index';

// The key builder only reads authType and keys.
function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof splitwise>,
	ctx: ReturnType<typeof keyContext>,
) {
	// unknown: the fake context is not a full KeyBuilderContext, and the key
	// builder only reads authType and keys.get_api_key.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'categories.list',
	'comments.create',
	'comments.delete',
	'comments.list',
	'currencies.list',
	'expenses.create',
	'expenses.delete',
	'expenses.get',
	'expenses.list',
	'expenses.undelete',
	'expenses.update',
	'friends.add',
	'friends.addMany',
	'friends.delete',
	'friends.get',
	'friends.list',
	'groups.addUser',
	'groups.create',
	'groups.delete',
	'groups.get',
	'groups.list',
	'groups.removeUser',
	'groups.undelete',
	'notifications.list',
	'users.get',
	'users.getCurrentUser',
	'users.update',
];

describe('splitwise plugin definition', () => {
	const plugin = splitwise();

	it('registers as splitwise with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('splitwise');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('gives every endpoint a description and the right risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(10);
		}
		expect(
			Object.fromEntries(
				Object.entries(meta).map(([name, entry]) => [name, entry.riskLevel]),
			),
		).toEqual({
			'categories.list': 'read',
			'comments.create': 'write',
			'comments.delete': 'destructive',
			'comments.list': 'read',
			'currencies.list': 'read',
			'expenses.create': 'write',
			'expenses.delete': 'destructive',
			'expenses.get': 'read',
			'expenses.list': 'read',
			'expenses.undelete': 'write',
			'expenses.update': 'write',
			'friends.add': 'write',
			'friends.addMany': 'write',
			'friends.delete': 'destructive',
			'friends.get': 'read',
			'friends.list': 'read',
			'groups.addUser': 'write',
			'groups.create': 'write',
			'groups.delete': 'destructive',
			'groups.get': 'read',
			'groups.list': 'read',
			'groups.removeUser': 'write',
			'groups.undelete': 'write',
			'notifications.list': 'read',
			'users.get': 'read',
			'users.getCurrentUser': 'read',
			'users.update': 'write',
		});
	});

	it('marks as irreversible only the deletes that cannot be undone', () => {
		const meta = plugin.endpointMeta ?? {};
		const irreversible = Object.entries(meta)
			.filter(([, entry]) => entry.irreversible)
			.map(([name]) => name)
			.sort();
		// A deleted comment is gone for good. Expenses and groups can be
		// restored with their `undelete` operation, so they are not irreversible.
		expect(irreversible).toEqual(['comments.delete', 'friends.delete']);
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(splitwiseEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(splitwiseEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('names no route twice', () => {
		const nested = Object.values(plugin.endpoints ?? {}).flatMap((group) =>
			Object.values(group),
		);
		expect(new Set(nested).size).toBe(nested.length);
	});
});

describe('splitwise key builder', () => {
	it('prefers the inline key', async () => {
		const plugin = splitwise({ key: 'inline-key' });
		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'inline-key',
		);
	});

	it('falls back to the stored key', async () => {
		const plugin = splitwise();
		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when neither key exists', async () => {
		const plugin = splitwise();
		await expect(buildKey(plugin, keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});
});
