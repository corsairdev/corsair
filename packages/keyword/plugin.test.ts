import { AuthMissingError } from 'corsair/core';
import { keyword, keywordEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof keyword>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'account.get',
	'keywords.add',
	'keywords.bulkDelete',
	'keywords.bulkUpdate',
	'keywords.delete',
	'keywords.get',
	'keywords.list',
	'keywords.refresh',
	'keywords.update',
	'metrics.competitors',
	'metrics.get',
	'mindshare.history',
	'projects.archive',
	'projects.create',
	'projects.delete',
	'projects.get',
	'projects.list',
	'projects.restore',
	'rankChart.get',
	'rankingUrls.list',
	'regions.list',
	'sharing.get',
	'sharing.update',
];

describe('keyword plugin definition', () => {
	const plugin = keyword();

	it('registers as keyword with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('keyword');
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
			'projects.list': 'read',
			'projects.get': 'read',
			'projects.create': 'write',
			'projects.archive': 'write',
			'projects.delete': 'destructive',
			'projects.restore': 'write',
			'sharing.get': 'read',
			'sharing.update': 'write',
			'keywords.list': 'read',
			'keywords.get': 'read',
			'keywords.add': 'write',
			'keywords.update': 'write',
			'keywords.delete': 'destructive',
			'keywords.bulkDelete': 'destructive',
			'keywords.bulkUpdate': 'write',
			'keywords.refresh': 'destructive',
			'metrics.get': 'read',
			'metrics.competitors': 'read',
			'rankChart.get': 'read',
			'regions.list': 'read',
			'rankingUrls.list': 'read',
			'mindshare.history': 'read',
			'account.get': 'read',
		});
	});

	it('marks every delete irreversible, and nothing else', () => {
		const irreversible = Object.entries(plugin.endpointMeta ?? {})
			.filter(([, entry]) => entry.irreversible)
			.map(([name]) => name)
			.sort();

		expect(irreversible).toEqual([
			'keywords.bulkDelete',
			'keywords.delete',
			'projects.delete',
		]);
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(keywordEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(keywordEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = keyword({
			errorHandlers: {
				UPSTREAM_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('UPSTREAM_ERROR');
		expect(names).toContain('QUOTA_ERROR');
	});
});

describe('keyword key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(buildKey(keyword({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(buildKey(keyword(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(buildKey(keyword(), keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('refuses webhook keys', async () => {
		await expect(
			keyword().keyBuilder?.(keyContext('stored-key') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
