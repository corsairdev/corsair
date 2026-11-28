import { AuthMissingError } from 'corsair/core';
import type { ShotstackKeyBuilderContext } from './index';
import { shotstack, shotstackEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof shotstack>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(
		ctx as unknown as ShotstackKeyBuilderContext,
		'endpoint',
	);
}

const operations = [
	'assets.delete',
	'assets.get',
	'assets.getByRenderId',
	'assets.transfer',
	'generations.create',
	'generations.get',
	'generations.getModel',
	'generations.listModels',
	'generations.quote',
	'media.probe',
	'renders.create',
	'renders.get',
	'sources.delete',
	'sources.fetch',
	'sources.get',
	'sources.list',
	'templates.create',
	'templates.delete',
	'templates.get',
	'templates.list',
	'templates.render',
	'templates.update',
	'uploads.create',
];

const riskLevels: Record<string, string> = {
	'renders.create': 'destructive',
	'renders.get': 'read',
	'templates.list': 'read',
	'templates.get': 'read',
	'templates.create': 'write',
	'templates.update': 'write',
	'templates.delete': 'destructive',
	'templates.render': 'destructive',
	'generations.create': 'destructive',
	'generations.get': 'read',
	'generations.quote': 'read',
	'generations.listModels': 'read',
	'generations.getModel': 'read',
	'media.probe': 'read',
	'sources.fetch': 'destructive',
	'sources.list': 'read',
	'sources.get': 'read',
	'sources.delete': 'destructive',
	'uploads.create': 'write',
	'assets.get': 'read',
	'assets.getByRenderId': 'read',
	'assets.transfer': 'destructive',
	'assets.delete': 'destructive',
};

describe('shotstack plugin definition', () => {
	const plugin = shotstack();

	it('registers as shotstack with api_key auth, an environment field and three callbacks', () => {
		expect(plugin.id).toBe('shotstack');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['environment'] },
		});
		expect(Object.keys(plugin.webhooks ?? {}).sort()).toEqual([
			'render',
			'serve',
			'source',
		]);
		expect(Object.keys(plugin.webhookSchemas ?? {}).sort()).toEqual([
			'render',
			'serve',
			'source',
		]);
		// A delivery with no Shotstack header or user agent is not Shotstack's.
		const delivery = { headers: {}, body: { type: 'edit' } } as never;
		expect(plugin.pluginWebhookMatcher?.(delivery)).toBe(false);
	});

	it('refuses an unknown environment option at setup', () => {
		expect(() => shotstack({ environment: 'prod-eu' as never })).toThrow(
			'environment must be v1 (production) or stage (sandbox)',
		);
	});

	it('exposes exactly the 23 catalog operations across 7 groups', () => {
		const groups = Object.entries(plugin.endpoints ?? {}).map(
			([group, fns]) => group,
		);
		expect(groups.sort()).toEqual(
			[
				'assets',
				'generations',
				'media',
				'renders',
				'sources',
				'templates',
				'uploads',
			].sort(),
		);
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
		).toEqual(riskLevels);
	});

	it('marks the three deletes irreversible and exposes no other irreversible op', () => {
		const meta = plugin.endpointMeta ?? {};
		const irreversible = Object.entries(meta)
			.filter(([, entry]) => entry.irreversible)
			.map(([name]) => name);
		expect(irreversible.sort()).toEqual(
			['assets.delete', 'sources.delete', 'templates.delete'].sort(),
		);
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(shotstackEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(shotstackEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = shotstack({
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

describe('shotstack key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(buildKey(shotstack({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(buildKey(shotstack(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(
			buildKey(shotstack(), keyContext(null)),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('gives callbacks the API key, which checks them against the API', async () => {
		await expect(
			shotstack().keyBuilder?.(
				keyContext('stored-key') as unknown as ShotstackKeyBuilderContext,
				'webhook',
			),
		).resolves.toBe('stored-key');
	});

	it('gives callbacks an empty key when none is stored, so the handler refuses them', async () => {
		await expect(
			shotstack().keyBuilder?.(
				keyContext(null) as unknown as ShotstackKeyBuilderContext,
				'webhook',
			),
		).resolves.toBe('');
	});
});
