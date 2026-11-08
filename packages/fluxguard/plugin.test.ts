import { AuthMissingError } from 'corsair/core';
import type { FluxguardKeyBuilderContext } from './index';
import {
	fluxguard,
	fluxguardAuthConfig,
	fluxguardEndpointSchemas,
} from './index';

const OPERATIONS = [
	'account.get',
	'categories.create',
	'categories.list',
	'monitoring.addPage',
	'monitoring.deletePage',
	'monitoring.deleteSite',
	'monitoring.getPage',
	'monitoring.startCrawl',
	'webhooks.create',
	'webhooks.delete',
	'webhooks.list',
	'webhooks.sample',
] as const;

type EndpointMeta = {
	riskLevel: string;
	description: string;
	irreversible?: boolean;
};
type ErrorHandler = {
	match: (error: Error) => boolean;
	handler: (error: Error) => Promise<{ maxRetries: number }>;
};
type KeyBuilder = (
	ctx: FluxguardKeyBuilderContext,
	source: 'endpoint' | 'webhook',
) => Promise<string>;

/**
 * Nested `group -> function` maps, as the plugin registers them.
 * unknown: the values are endpoint handlers whose exact signatures come from
 * the plugin's own types; this only walks the keys, so the leaf type is unused.
 */
type Nested = Record<string, Record<string, unknown>>;

function flatten(endpoints: Nested): string[] {
	const paths: string[] = [];
	for (const [group, members] of Object.entries(endpoints)) {
		for (const name of Object.keys(members)) paths.push(`${group}.${name}`);
	}
	return paths.sort();
}

/**
 * The key builder reads only `authType` and `keys`. A full KeyBuilderContext
 * needs a whole AccountKeyManager (get_dek, issue_new_dek and the rest), so the
 * fixture implements the two lookups this plugin calls and casts.
 */
function keyContext(
	apiKey: string | null,
	webhookSecret: string | null = null,
): {
	ctx: FluxguardKeyBuilderContext;
	keys: {
		get_api_key: jest.Mock;
		get_webhook_signature: jest.Mock;
	};
} {
	const keys = {
		get_api_key: jest.fn().mockResolvedValue(apiKey),
		get_webhook_signature: jest.fn().mockResolvedValue(webhookSecret),
	};
	// unknown: the cast above is the point of this fixture; `keys` is not an
	// AccountKeyManager, and typing it as one would need every method stubbed.
	const ctx = {
		authType: 'api_key',
		options: {},
		tenantId: 'default',
		keys,
	} as unknown as FluxguardKeyBuilderContext;
	return { ctx, keys };
}

// unknown: the plugin's own types expose `keyBuilder` and `endpointMeta` as
// optionals, so the helpers narrow them one cast at a time. Typing them
// precisely here would mean restating the whole plugin surface in the test.
function keyBuilderOf(plugin: { keyBuilder?: unknown }): KeyBuilder {
	return plugin.keyBuilder as KeyBuilder;
}

describe('fluxguard plugin definition', () => {
	const plugin = fluxguard();
	const meta = plugin.endpointMeta as unknown as Record<string, EndpointMeta>;

	it('registers as fluxguard with api_key auth only', () => {
		expect(plugin.id).toBe('fluxguard');
		expect(plugin.options?.authType).toBe('api_key');
		// Fluxguard issues a static org key; an oauth_2 flow cannot complete.
		expect(Object.keys(fluxguardAuthConfig)).toEqual(['api_key']);
	});

	it('exposes exactly the change.detected webhook', () => {
		expect(flatten(plugin.webhooks as unknown as Nested)).toEqual([
			'change.detected',
		]);
	});

	it('matches a delivery carrying fluxguard-signature and rejects one without', () => {
		const matcher = plugin.pluginWebhookMatcher;

		expect(
			matcher?.({
				headers: { 'fluxguard-signature': 't=1234567890,v1=0a1b2c' },
				body: '{}',
			}),
		).toBe(true);

		// No header and no change fields: not ours.
		expect(matcher?.({ headers: {}, body: '{}' })).toBe(false);
	});

	it('registers exactly the twelve operations', () => {
		expect(flatten(plugin.endpoints as unknown as Nested)).toEqual([
			...OPERATIONS,
		]);
	});

	it('gives every operation the risk level its side effect calls for', () => {
		expect(
			Object.fromEntries(
				Object.entries(meta).map(([name, entry]) => [name, entry.riskLevel]),
			),
		).toEqual({
			'account.get': 'read',
			'categories.create': 'write',
			'categories.list': 'read',
			'monitoring.addPage': 'write',
			'monitoring.deletePage': 'destructive',
			'monitoring.deleteSite': 'destructive',
			'monitoring.getPage': 'read',
			'monitoring.startCrawl': 'write',
			'webhooks.create': 'write',
			'webhooks.delete': 'destructive',
			'webhooks.list': 'read',
			'webhooks.sample': 'read',
		});
	});

	it('describes every operation', () => {
		expect(Object.keys(meta).sort()).toEqual([...OPERATIONS]);
		for (const [name, entry] of Object.entries(meta)) {
			expect(entry.description.length).toBeGreaterThan(10);
			expect(entry.description).toBe(entry.description.trim());
			expect(name).toBe(name.trim());
		}
	});

	it('marks the deletes that cannot be recreated as irreversible', () => {
		// A deleted page or site and its captured versions are gone for good.
		expect(meta['monitoring.deletePage']?.irreversible).toBe(true);
		expect(meta['monitoring.deleteSite']?.irreversible).toBe(true);
		// A webhook is recreated by adding the same URL again, so it is
		// destructive but reversible.
		expect(meta['webhooks.delete']?.irreversible).toBeUndefined();
	});

	it('has an input and output schema for every operation', () => {
		expect(Object.keys(fluxguardEndpointSchemas).sort()).toEqual([
			...OPERATIONS,
		]);
		for (const [name, schemas] of Object.entries(fluxguardEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
			expect(name).toBe(name.trim());
		}
	});

	it('validates input with the registered schema', () => {
		const addPage = fluxguardEndpointSchemas['monitoring.addPage'];
		expect(
			addPage.input.safeParse({ url: 'https://example.org/' }).success,
		).toBe(true);
		expect(addPage.input.safeParse({}).success).toBe(false);
		expect(
			addPage.input.safeParse({
				url: 'https://example.org/',
				siteId: 's1',
			}).success,
		).toBe(false);
	});

	it('keeps DEFAULT last when a caller adds a handler', () => {
		const custom = fluxguard({
			errorHandlers: {
				QUOTA_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(
			custom.errorHandlers as unknown as Record<string, ErrorHandler>,
		);

		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('QUOTA_ERROR');
		// A caller handler runs before the catch-all, or it never runs at all.
		expect(names.indexOf('QUOTA_ERROR')).toBeLessThan(names.indexOf('DEFAULT'));
		expect(names).toContain('RATE_LIMIT_ERROR');
		expect(names).toContain('SERVER_ERROR');
	});
});

describe('fluxguard key builder', () => {
	const build = (
		// unknown: same optional-`keyBuilder` widening as `keyBuilderOf`.
		plugin: { keyBuilder?: unknown },
		ctx: FluxguardKeyBuilderContext,
	) => keyBuilderOf(plugin)(ctx, 'endpoint');

	it('prefers an explicit key option without reading the store', async () => {
		const { ctx, keys } = keyContext('stored-key');

		await expect(build(fluxguard({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(keys.get_api_key).not.toHaveBeenCalled();
	});

	it('falls back to the stored API key', async () => {
		const { ctx } = keyContext('stored-key');

		await expect(build(fluxguard(), ctx)).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when no key is configured or stored', async () => {
		const { ctx } = keyContext(null);

		await expect(build(fluxguard(), ctx)).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('resolves the webhook secret, not the API key, for a delivery', async () => {
		const { ctx, keys } = keyContext('stored-key', 'stored-secret');

		await expect(
			keyBuilderOf(fluxguard({ key: 'option-key' }))(ctx, 'webhook'),
		).resolves.toBe('stored-secret');
		expect(keys.get_api_key).not.toHaveBeenCalled();
	});

	it('prefers the webhookSecret option over the stored secret', async () => {
		const { ctx, keys } = keyContext('stored-key', 'stored-secret');

		await expect(
			keyBuilderOf(fluxguard({ webhookSecret: 'option-secret' }))(
				ctx,
				'webhook',
			),
		).resolves.toBe('option-secret');
		expect(keys.get_webhook_signature).not.toHaveBeenCalled();
	});

	it('returns an empty secret so verification fails closed', async () => {
		const { ctx } = keyContext('stored-key', null);

		await expect(keyBuilderOf(fluxguard())(ctx, 'webhook')).resolves.toBe('');
	});
});
