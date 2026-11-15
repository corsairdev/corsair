import { AuthMissingError } from 'corsair/core';
import { tomba, tombaAuthConfig, tombaEndpointSchemas } from './index';

// The key builder only reads authType, options and keys.
function keyContext(apiKey: string | null, apiSecret: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: {
			get_api_key: jest.fn().mockResolvedValue(apiKey),
			get_api_secret: jest.fn().mockResolvedValue(apiSecret),
		},
	};
}

function buildKey(
	plugin: ReturnType<typeof tomba>,
	ctx: ReturnType<typeof keyContext>,
) {
	// unknown: the fake context is not a full KeyBuilderContext, and the key
	// builder only reads authType and keys.get_api_key.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'account.get',
	'account.rateLimits',
	'combined.find',
	'company.find',
	'company.search',
	'domain.emailCount',
	'domain.emailFormat',
	'domain.emailSources',
	'domain.location',
	'domain.similar',
	'domain.status',
	'domain.suggestions',
	'domain.technology',
	'finder.author',
	'finder.domainSearch',
	'finder.email',
	'finder.enrich',
	'finder.linkedin',
	'finder.phone',
	'person.find',
	'verifier.email',
	'verifier.phone',
];

describe('tomba plugin definition', () => {
	const plugin = tomba();

	it('registers as tomba with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('tomba');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('declares the API secret on the account, not the integration', () => {
		// An api_key account has no get_integration_credentials, so a secret
		// declared under `integration` would throw on the first call.
		expect(tombaAuthConfig.api_key.account).toEqual(['api_secret']);
		expect(tombaAuthConfig.api_key).not.toHaveProperty('integration');
	});

	it('exposes exactly the catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('gives every endpoint a description and reads only', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry?.description?.length ?? 0).toBeGreaterThan(10);
			// Every wrapped route is a lookup over Tomba's data.
			expect(entry?.riskLevel).toBe('read');
		}
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(tombaEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(tombaEndpointSchemas)) {
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

describe('tomba key builder', () => {
	it('prefers the inline key', async () => {
		const plugin = tomba({ key: 'inline-key' });
		await expect(
			buildKey(plugin, keyContext('stored-key', 'secret')),
		).resolves.toBe('inline-key');
	});

	it('falls back to the stored key', async () => {
		const plugin = tomba();
		await expect(
			buildKey(plugin, keyContext('stored-key', 'secret')),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when the key is missing', async () => {
		const plugin = tomba();
		await expect(
			buildKey(plugin, keyContext(null, 'secret')),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('resolves the key even when the secret is missing, so the endpoint reports it', async () => {
		const plugin = tomba();
		await expect(
			buildKey(plugin, keyContext('stored-key', null)),
		).resolves.toBe('stored-key');
	});
});
