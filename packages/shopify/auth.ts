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
	/** `<shop>.myshopify.com`, normalised by the client before use. */
	shopDomain: string;
	accessToken: string;
};

/**
 * The shop host: the plugin option when set, else the stored account value.
 *
 * Endpoints need this on its own. The token they send is `ctx.key`, the value
 * the binder resolved after hooks and the per-tenant lookup, so re-reading the
 * token from options or account storage here would ignore a hook that replaced
 * it (R8). This function deliberately reads only the domain.
 */
export async function resolveShopDomain(
	ctx: { keys: { get_shop_domain: () => Promise<string | null | undefined> } },
	options: { shopDomain?: string } = {},
): Promise<string> {
	const shopDomain =
		options.shopDomain?.trim() || (await ctx.keys.get_shop_domain());
	if (!shopDomain) {
		// The token alone is not usable: every request URL is built from the
		// shop host, so a missing domain would become a request to `https://`.
		throw new AuthMissingError('shopify', 'api_key');
	}
	return shopDomain.trim();
}

/**
 * Resolves both credentials. Used by `keyBuilder`, which has to produce the
 * token core assigns to `ctx.key`; endpoints call `resolveShopDomain` and read
 * the token from `ctx.key` instead.
 */
export async function resolveShopifyCredentials(
	ctx: ShopifyAuthContext,
	options: { key?: string; shopDomain?: string } = {},
): Promise<ShopifyCredentials> {
	const accessToken = options.key?.trim() || (await ctx.keys.get_api_key());
	const shopDomain = await resolveShopDomain(ctx, options);

	if (!accessToken) {
		throw new AuthMissingError('shopify', ctx.authType ?? 'api_key');
	}

	return { accessToken: accessToken.trim(), shopDomain };
}
