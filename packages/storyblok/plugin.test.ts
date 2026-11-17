import { AuthMissingError } from 'corsair/core';
import type { StoryblokKeyBuilderContext } from './index';
import { storyblok, storyblokEndpointSchemas } from './index';

/** The key builder only reads authType and keys. */
function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof storyblok>,
	ctx: ReturnType<typeof keyContext>,
	source: 'endpoint' | 'webhook' = 'endpoint',
) {
	// A test fixture cannot be a full AccountKeyManager, which also needs
	// get_dek and issue_new_dek; only get_api_key is read here.
	return plugin.keyBuilder?.(
		ctx as unknown as StoryblokKeyBuilderContext, // unknown: partial fixture
		source,
	);
}

const operations = [
	'assets.bulkDelete',
	'assets.delete',
	'assets.get',
	'assets.list',
	'assets.update',
	'components.create',
	'components.delete',
	'components.list',
	'components.update',
	'datasourceEntries.create',
	'datasourceEntries.delete',
	'datasourceEntries.get',
	'datasourceEntries.list',
	'datasourceEntries.update',
	'datasources.create',
	'datasources.delete',
	'datasources.get',
	'datasources.list',
	'datasources.update',
	'releases.create',
	'releases.delete',
	'releases.get',
	'releases.list',
	'releases.update',
	'spaces.get',
	'spaces.list',
	'stories.create',
	'stories.delete',
	'stories.get',
	'stories.list',
	'stories.publish',
	'stories.unpublish',
	'stories.update',
	'tags.create',
	'tags.delete',
	'tags.list',
	'tags.update',
	'webhooks.create',
	'webhooks.delete',
	'webhooks.get',
	'webhooks.list',
	'webhooks.listActions',
	'webhooks.update',
];

describe('storyblok plugin definition', () => {
	const plugin = storyblok();

	it('registers as storyblok with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('storyblok');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('declares the space and region as account-level credentials', () => {
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['space_id', 'region'] },
		});
	});

	it('exposes exactly the forty-three catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
		expect(nested).toHaveLength(43);
	});

	it('gives every endpoint a description and a risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(20);
			expect(['read', 'write', 'destructive']).toContain(entry.riskLevel);
		}
	});

	it('marks every delete irreversible and destructive', () => {
		const meta = plugin.endpointMeta ?? {};
		const deletes = Object.entries(meta)
			.filter(([name]) => name.endsWith('.delete'))
			.map(([name, entry]) => ({
				name,
				riskLevel: entry.riskLevel,
				irreversible: entry.irreversible,
			}));
		// Eight routes end in `.delete`; `assets.bulkDelete` is the ninth delete
		// and does not match the suffix, which is why it is asserted separately.
		expect(deletes.length).toBe(8);
		for (const entry of deletes) {
			expect(entry.riskLevel).toBe('destructive');
			expect(entry.irreversible).toBe(true);
		}
		// The bulk delete is destructive too, and has its own name.
		expect(meta['assets.bulkDelete' as keyof typeof meta]?.riskLevel).toBe(
			'destructive',
		);
	});

	it('marks publish and unpublish as writes even though Storyblok serves them as GETs', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(meta['stories.publish' as keyof typeof meta]?.riskLevel).toBe(
			'write',
		);
		expect(meta['stories.unpublish' as keyof typeof meta]?.riskLevel).toBe(
			'write',
		);
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(storyblokEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(storyblokEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last and puts caller handlers first', () => {
		const custom = storyblok({
			errorHandlers: {
				QUOTA_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names[0]).toBe('QUOTA_ERROR');
		expect(names).toContain('RATE_LIMIT_ERROR');
		expect(names).toContain('AUTH_ERROR');
		expect(names).toContain('NOT_FOUND_ERROR');
	});
});

describe('storyblok key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(buildKey(storyblok({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(buildKey(storyblok(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(
			buildKey(storyblok(), keyContext(null)),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('refuses webhook keys', async () => {
		await expect(
			buildKey(storyblok(), keyContext('stored-key'), 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
