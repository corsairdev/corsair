import { resolveShopifyCredentials } from './auth';
import { shopify, shopifyAuthConfig } from './index';

type KeyBuilderFn = (
	// unknown: the real argument is a full AccountKeyManager, which a test
	// cannot build; each call below passes the accessors this plugin reads.
	ctx: unknown,
	source: 'endpoint' | 'webhook',
) => Promise<string>;

/**
 * The key builder's real argument is a full AccountKeyManager. A test only
 * implements the accessors this plugin reads, so the fixture is cast rather
 * than mocked wholesale, which is why the cast is spelled out here.
 */
function keyBuilderContext(
	keys: Record<string, () => Promise<string | null | undefined>>,
	// unknown: a partial key manager stands in for the runtime's, so the
	// concrete type is deliberately not claimed.
): unknown {
	return {
		authType: 'api_key',
		tenantId: 'default',
		options: {},
		keys,
	};
}

const plugin = shopify({ shopDomain: 'my-store.myshopify.com' });
// The plugin type marks both as optional. This plugin always declares them,
// so they are asserted once here rather than at each use.
type EndpointMeta = Record<
	string,
	{ riskLevel?: string; irreversible?: boolean }
>;
const endpointMeta = plugin.endpointMeta as EndpointMeta;
// unknown: webhook handlers are functions; only their names are asserted.
const webhooks = plugin.webhooks as Record<string, Record<string, unknown>>;
// unknown: the declared key builder takes a full key manager, so the
// narrower test signature is reached through the one necessary cast.
const build = plugin.keyBuilder as unknown as KeyBuilderFn;

describe('plugin shape', () => {
	it('is registered under the expected id and auth type', () => {
		expect(plugin.id).toBe('shopify');
		// The options type is the caller's object; authType is filled in by the
		// factory, so it is read through the runtime value.
		const options = plugin.options as { authType?: string } | undefined;
		expect(options?.authType).toBe('api_key');
	});

	it('declares the store domain as an account-level field', () => {
		// Account-level, not integration: get_integration_credentials is only
		// installed for oauth_2, so an api_key account reading from there would
		// throw on the first call.
		expect(shopifyAuthConfig.api_key.account).toContain('shop_domain');
		expect(shopifyAuthConfig.api_key).not.toHaveProperty('integration');
	});

	it('declares the full operation list', () => {
		expect(Object.keys(plugin.endpoints ?? {})).toEqual([
			'products',
			'variants',
			'inventory',
			'collections',
			'orders',
			'customers',
			'shop',
			'webhookSubscriptions',
		]);
	});

	it('marks deletes and cancels as destructive and irreversible', () => {
		expect(endpointMeta['products.delete']).toMatchObject({
			riskLevel: 'destructive',
			irreversible: true,
		});
		expect(endpointMeta['webhookSubscriptions.delete']).toMatchObject({
			riskLevel: 'destructive',
			irreversible: true,
		});
		expect(endpointMeta['orders.cancel']).toMatchObject({
			riskLevel: 'destructive',
			irreversible: true,
		});
	});

	it('treats every mutation as a write or a delete, never a read', () => {
		const mutations = [
			'products.create',
			'products.update',
			'products.delete',
			'variants.update',
			'inventory.adjust',
			'collections.create',
			'collections.addProducts',
			'orders.cancel',
			'orders.markAsPaid',
			'orders.close',
			'customers.create',
			'customers.update',
			'webhookSubscriptions.create',
			'webhookSubscriptions.delete',
		] as const;

		for (const op of mutations) {
			expect(endpointMeta[op]?.riskLevel).toBeDefined();
			expect(endpointMeta[op]?.riskLevel).not.toBe('read');
		}
	});

	it('declares the webhook entry point', () => {
		expect(Object.keys(webhooks.shopify ?? {})).toEqual(['receive']);
	});
});

describe('keyBuilder', () => {
	it('prefers the inline token over the stored one', async () => {
		const inline = shopify({
			key: 'inline-token',
			shopDomain: 'my-store.myshopify.com',
		});

		// unknown: same cast as `build`; see there.
		const token = await (inline.keyBuilder as unknown as KeyBuilderFn)(
			keyBuilderContext({ get_api_key: async () => 'stored-token' }),
			'endpoint',
		);

		expect(token).toBe('inline-token');
	});

	it('falls back to the stored token', async () => {
		const token = await build(
			keyBuilderContext({ get_api_key: async () => 'stored-token' }),
			'endpoint',
		);

		expect(token).toBe('stored-token');
	});

	it('uses the configured webhook secret for a delivery', async () => {
		const withSecret = shopify({ webhookSecret: 'shpss_secret' });

		// unknown: same cast as `build`; see there.
		const secret = await (withSecret.keyBuilder as unknown as KeyBuilderFn)(
			keyBuilderContext({}),
			'webhook',
		);

		expect(secret).toBe('shpss_secret');
	});

	it('falls back to the stored webhook signature', async () => {
		const secret = await build(
			keyBuilderContext({
				get_webhook_signature: async () => 'stored-signature',
			}),
			'webhook',
		);

		expect(secret).toBe('stored-signature');
	});

	it('throws AuthMissingError when neither credential exists', async () => {
		await expect(
			build(keyBuilderContext({ get_api_key: async () => null }), 'endpoint'),
		).rejects.toThrow(/shopify/i);
	});
});

describe('resolveShopifyCredentials', () => {
	it('reads both values from the account', async () => {
		const credentials = await resolveShopifyCredentials({
			authType: 'api_key',
			keys: {
				get_api_key: async () => 'stored-token',
				get_shop_domain: async () => 'stored.myshopify.com',
			},
		});

		expect(credentials).toEqual({
			accessToken: 'stored-token',
			shopDomain: 'stored.myshopify.com',
		});
	});

	it('prefers options over stored values', async () => {
		const credentials = await resolveShopifyCredentials(
			{
				authType: 'api_key',
				keys: {
					get_api_key: async () => 'stored-token',
					get_shop_domain: async () => 'stored.myshopify.com',
				},
			},
			{ key: 'inline-token', shopDomain: 'inline.myshopify.com' },
		);

		expect(credentials).toEqual({
			accessToken: 'inline-token',
			shopDomain: 'inline.myshopify.com',
		});
	});

	it('throws when the token exists but the domain does not', async () => {
		// A token without a domain cannot build a request URL, so this must
		// fail before the call rather than request `https://`.
		await expect(
			resolveShopifyCredentials({
				authType: 'api_key',
				keys: {
					get_api_key: async () => 'stored-token',
					get_shop_domain: async () => null,
				},
			}),
		).rejects.toThrow(/shopify/i);
	});
});
