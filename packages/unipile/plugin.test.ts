import { AuthMissingError } from 'corsair/core';
import { UNIPILE_WRITE_OPERATIONS } from './endpoints/types';
import {
	PROFILE_VIEW_OPERATIONS,
	RETRY_SAFE_OPERATIONS,
} from './error-handlers';
import { unipile, unipileEndpointSchemas } from './index';

const READ = [
	'accounts.list',
	'accounts.get',
	'users.getProfile',
	'users.listRelations',
	'users.getChat',
	'users.listReactions',
	'users.listComments',
	'relationRequests.list',
	'chats.list',
	'chats.get',
	'messages.list',
	'posts.list',
	'posts.listReactions',
	'posts.listComments',
	'webhookEndpoints.list',
	'webhookEndpoints.get',
];

const WRITE = [
	'accounts.createAuthLink',
	'users.visitProfile',
	'relationRequests.create',
	'relationRequests.accept',
	'chats.start',
	'messages.send',
	'webhookEndpoints.create',
	'webhookEndpoints.update',
];

const DESTRUCTIVE = [
	'accounts.remove',
	'relationRequests.cancel',
	'webhookEndpoints.delete',
];

const OPERATIONS = [...READ, ...WRITE, ...DESTRUCTIVE];

const WEBHOOKS = [
	'relations.new',
	'messages.new',
	'messages.receiptRead',
	'accounts.statusRunning',
	'accounts.statusPartial',
	'accounts.statusDegraded',
	'accounts.statusErrored',
	'accounts.statusDisconnected',
	'accounts.add',
	'accounts.reconnect',
	'accounts.remove',
	'accounts.locked',
	'accounts.unlocked',
];

// The key builder only reads authType and keys.
function keyContext(
	fields: { apiKey?: string | null; webhookSecret?: string | null } = {},
) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: {
			get_api_key: jest.fn().mockResolvedValue(fields.apiKey ?? null),
			get_webhook_signature: jest
				.fn()
				.mockResolvedValue(fields.webhookSecret ?? null),
		},
	};
}

function buildKey(
	plugin: ReturnType<typeof unipile>,
	ctx: ReturnType<typeof keyContext>,
	source: 'endpoint' | 'webhook' = 'endpoint',
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, source);
}

function paths(tree: Record<string, Record<string, unknown>>): string[] {
	return Object.entries(tree).flatMap(([group, entries]) =>
		Object.keys(entries).map((name) => `${group}.${name}`),
	);
}

describe('unipile plugin definition', () => {
	const plugin = unipile();

	it('registers as unipile with API key auth routed by application_id', () => {
		expect(plugin.id).toBe('unipile');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['application_id'] },
		});
	});

	it('exposes all 27 operations', () => {
		expect(paths(plugin.endpoints ?? {}).sort()).toEqual(
			[...OPERATIONS].sort(),
		);
		expect(Object.keys(unipileEndpointSchemas).sort()).toEqual(
			[...OPERATIONS].sort(),
		);
		for (const schemas of Object.values(unipileEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it.each([
		['read', READ],
		['write', WRITE],
		['destructive', DESTRUCTIVE],
	])('marks the %s operations', (level, operations) => {
		const meta = plugin.endpointMeta ?? {};
		for (const op of operations) {
			expect([op, meta[op as keyof typeof meta]?.riskLevel]).toEqual([
				op,
				level,
			]);
		}
	});

	it('marks every removal, cancel and delete destructive', () => {
		const meta = plugin.endpointMeta ?? {};
		for (const [path, entry] of Object.entries(meta)) {
			if (/\.(remove|cancel|delete)$/.test(path)) {
				expect([path, entry.riskLevel]).toEqual([path, 'destructive']);
			}
			expect(entry.description?.length).toBeGreaterThan(20);
		}
	});

	it('retries after a 5xx or timeout only for reads that are not profile views', () => {
		expect([...PROFILE_VIEW_OPERATIONS].sort()).toEqual([
			'users.getProfile',
			'users.visitProfile',
		]);
		expect([...RETRY_SAFE_OPERATIONS].sort()).toEqual(
			READ.filter((op) => op !== 'users.getProfile').sort(),
		);
	});

	it('lists exactly the write and destructive operations as writes', () => {
		// accountsCreateAuthLink -> accounts.createAuthLink
		const dotted = UNIPILE_WRITE_OPERATIONS.map((key) => {
			const path = Object.keys(unipileEndpointSchemas).find(
				(candidate) =>
					candidate.replace('.', '').toLowerCase() === key.toLowerCase(),
			);
			if (!path) throw new Error(`no endpoint for ${key}`);
			return path;
		});
		expect(dotted.sort()).toEqual([...WRITE, ...DESTRUCTIVE].sort());
	});

	it('declares the 13 webhook events with schemas', () => {
		expect(
			paths(
				(plugin.webhooks ?? {}) as Record<string, Record<string, unknown>>,
			).sort(),
		).toEqual([...WEBHOOKS].sort());
		expect(Object.keys(plugin.webhookSchemas ?? {}).sort()).toEqual(
			[...WEBHOOKS].sort(),
		);
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = unipile({
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
		expect(names[0]).toBe('UNIPILE_LINKEDIN_LIMIT');
		expect(names.indexOf('QUOTA_ERROR')).toBe(names.length - 2);
	});
});

describe('unipile key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext({ apiKey: 'stored-key' });
		await expect(buildKey(unipile({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(
			buildKey(unipile(), keyContext({ apiKey: 'stored-key' })),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(buildKey(unipile(), keyContext())).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('uses the webhookSecret option, then the stored signature', async () => {
		await expect(
			buildKey(
				unipile({ webhookSecret: 'option-secret' }),
				keyContext({ webhookSecret: 'stored' }),
				'webhook',
			),
		).resolves.toBe('option-secret');
		await expect(
			buildKey(unipile(), keyContext({ webhookSecret: 'stored' }), 'webhook'),
		).resolves.toBe('stored');
	});

	it('returns an empty webhook secret, so verification fails closed', async () => {
		await expect(
			buildKey(unipile({ key: 'option-key' }), keyContext(), 'webhook'),
		).resolves.toBe('');
	});
});
