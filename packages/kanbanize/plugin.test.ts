import { AuthMissingError } from 'corsair/core';
import { kanbanize, kanbanizeEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof kanbanize>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'boards.create',
	'boards.delete',
	'boards.get',
	'boards.list',
	'boards.update',
	'cards.create',
	'cards.delete',
	'cards.get',
	'cards.list',
	'cards.update',
	'columns.create',
	'columns.delete',
	'columns.get',
	'columns.list',
	'columns.update',
	'comments.create',
	'comments.list',
	'lanes.create',
	'lanes.delete',
	'lanes.get',
	'lanes.list',
	'lanes.update',
	'limits.get',
	'me.get',
	'subtasks.create',
	'subtasks.delete',
	'subtasks.list',
	'subtasks.update',
	'tags.list',
	'users.list',
	'webhooks.create',
	'webhooks.delete',
	'webhooks.list',
	'webhooks.update',
	'workflows.create',
	'workflows.delete',
	'workflows.get',
	'workflows.list',
	'workflows.update',
];

describe('kanbanize plugin definition', () => {
	const plugin = kanbanize();

	it('registers as kanbanize with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('kanbanize');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('declares subdomain as an account credential field', () => {
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['subdomain'] },
		});
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
			'boards.list': 'read',
			'boards.get': 'read',
			'boards.create': 'write',
			'boards.update': 'write',
			'boards.delete': 'destructive',
			'workflows.list': 'read',
			'workflows.get': 'read',
			'workflows.create': 'write',
			'workflows.update': 'write',
			'workflows.delete': 'destructive',
			'columns.list': 'read',
			'columns.get': 'read',
			'columns.create': 'write',
			'columns.update': 'write',
			'columns.delete': 'destructive',
			'lanes.list': 'read',
			'lanes.get': 'read',
			'lanes.create': 'write',
			'lanes.update': 'write',
			'lanes.delete': 'destructive',
			'cards.list': 'read',
			'cards.get': 'read',
			'cards.create': 'write',
			'cards.update': 'write',
			'cards.delete': 'destructive',
			'comments.list': 'read',
			'comments.create': 'write',
			'subtasks.list': 'read',
			'subtasks.create': 'write',
			'subtasks.update': 'write',
			'subtasks.delete': 'destructive',
			'tags.list': 'read',
			'users.list': 'read',
			'me.get': 'read',
			'limits.get': 'read',
			'webhooks.list': 'read',
			'webhooks.create': 'write',
			'webhooks.update': 'write',
			'webhooks.delete': 'destructive',
		});
	});

	it('marks every delete irreversible, and nothing else', () => {
		const irreversible = Object.entries(plugin.endpointMeta ?? {})
			.filter(([, entry]) => entry.irreversible)
			.map(([name]) => name)
			.sort();

		expect(irreversible).toEqual(
			operations.filter((name) => name.endsWith('.delete')),
		);
		expect(irreversible).toHaveLength(7);
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(kanbanizeEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(kanbanizeEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = kanbanize({
			errorHandlers: {
				QUOTA_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('QUOTA_ERROR');
		expect(names).toContain('RATE_LIMIT_ERROR');
	});
});

describe('kanbanize key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(buildKey(kanbanize({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(buildKey(kanbanize(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(
			buildKey(kanbanize(), keyContext(null)),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('refuses webhook keys', async () => {
		await expect(
			kanbanize().keyBuilder?.(keyContext('stored-key') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
