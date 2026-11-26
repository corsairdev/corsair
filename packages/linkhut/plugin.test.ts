import { AuthMissingError } from 'corsair/core';
import { linkhut, linkhutEndpointSchemas } from './index';

// The key builder only reads authType and keys.
function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof linkhut>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'posts.add',
	'posts.all',
	'posts.allHashes',
	'posts.dates',
	'posts.delete',
	'posts.get',
	'posts.lastUpdated',
	'posts.recent',
	'posts.suggest',
	'tags.delete',
	'tags.get',
	'tags.rename',
];

describe('linkhut plugin definition', () => {
	const plugin = linkhut();

	it('registers as linkhut with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('linkhut');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the twelve operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('gives every endpoint a description and the risk of its real side effect', () => {
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
			'posts.add': 'write',
			'posts.all': 'read',
			'posts.allHashes': 'read',
			'posts.dates': 'read',
			'posts.delete': 'destructive',
			'posts.get': 'read',
			'posts.lastUpdated': 'read',
			'posts.recent': 'read',
			'posts.suggest': 'read',
			'tags.delete': 'destructive',
			'tags.get': 'read',
			'tags.rename': 'write',
		});
	});

	it('marks both deletes irreversible: every request is a GET, so there is no undo anywhere in the API', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(meta['posts.delete']?.irreversible).toBe(true);
		expect(meta['tags.delete']?.irreversible).toBe(true);
		for (const [name, entry] of Object.entries(meta)) {
			if (entry.riskLevel !== 'destructive') {
				expect(entry.irreversible).toBeUndefined();
			}
			expect(name).toBeTruthy();
		}
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(linkhutEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(linkhutEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = linkhut({
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

describe('linkhut key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-token');

		await expect(buildKey(linkhut({ key: 'option-token' }), ctx)).resolves.toBe(
			'option-token',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored personal access token', async () => {
		await expect(buildKey(linkhut(), keyContext('stored-token'))).resolves.toBe(
			'stored-token',
		);
	});

	it('throws AuthMissingError when no token is stored', async () => {
		await expect(buildKey(linkhut(), keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('refuses webhook keys', async () => {
		await expect(
			linkhut().keyBuilder?.(keyContext('stored-token') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
