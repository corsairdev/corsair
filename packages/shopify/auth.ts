import { AuthMissingError } from 'corsair/core';

/**
 * Shopify needs two values per shop: the `*.myshopify.com` host and an Admin
 * API access token. Both live on the account, not the integration, because a
 * token is scoped to one shop. `get_integration_credentials` only exists for
 * `oauth_2` (core/auth/key-manager.ts), so an `api_key` account that put the
 * domain there would throw on the first call.
 */
export type ShopifyAuthContext = {
	authType?: string;
	keys: {
		get_api_key: () => Promise<string | null | undefined>;
		get_shop_domain: () => Promise<string | null | undefined>;
	};
};

export type ShopifyCredentials = {
	/** `<shop>.myshopify.com`, normalised. */
	shopDomain: string;
	accessToken: string;
};

/**
 * Resolves both credentials, preferring the plugin options so a caller can
 * point one instance at a specific shop. A fixture-based test that supplies a
 * method the runtime never creates would hide a bad authConfig, so the shape
 * here is exactly what `createAccountKeyManager` builds.
 */
export async function resolveShopifyCredentials(
	ctx: ShopifyAuthContext,
	options: { key?: string; shopDomain?: string } = {},
): Promise<ShopifyCredentials> {
	const accessToken = options.key?.trim() || (await ctx.keys.get_api_key());
	const shopDomain =
		options.shopDomain?.trim() || (await ctx.keys.get_shop_domain());

	if (!accessToken) {
		throw new AuthMissingError('shopify', ctx.authType ?? 'api_key');
	}
	if (!shopDomain) {
		// The token alone is not usable: every request URL is built from the
		// shop host, so a missing domain would become a request to `https://`.
		throw new AuthMissingError('shopify', ctx.authType ?? 'api_key');
	}

	return { accessToken: accessToken.trim(), shopDomain: shopDomain.trim() };
}
