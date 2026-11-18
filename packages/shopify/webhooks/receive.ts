import type { CorsairWebhook, WebhookRequest } from 'corsair/core';
import type { z } from 'zod';
import type { ShopifyContext } from '..';
import { normaliseShopDomain } from '../client';
import type { ShopifyWebhookOutputSchema, ShopifyWebhookTopic } from './types';
import {
	headerValue,
	isSupportedTopic,
	SHOPIFY_HMAC_HEADER,
	SHOPIFY_SHOP_DOMAIN_HEADER,
	SHOPIFY_TOPIC_HEADER,
	SHOPIFY_WEBHOOK_SCHEMAS,
	verifyShopifyWebhook,
} from './types';

export type ShopifyWebhookOutput = z.output<typeof ShopifyWebhookOutputSchema>;

/**
 * Rejects a delivery by throwing. `processWebhook` builds its result as
 * `{ ...returnToSender, success: true }`, so a returned `success: false` is
 * overwritten and the caller is told a forged delivery succeeded.
 */
function refuse(reason: string): never {
	throw new Error(`Shopify webhook rejected: ${reason}`);
}

/**
 * The secret that verifies this delivery.
 *
 * Core runs the handler on the tenant-scoped instance, so `ctx.key` is the
 * secret the key builder resolved for that tenant (R8: the binder's value,
 * after hooks and the per-tenant lookup). Verifying with it binds the delivery
 * to the tenant whose hooks process it: a secret that belongs to another
 * tenant fails here, rather than being accepted because two tenants happen to
 * share a value. The option is only a fallback for a context with no resolved
 * key, which is what a direct unit call looks like.
 */
function readSecret(ctx: ShopifyContext): string | undefined {
	const resolved = typeof ctx.key === 'string' ? ctx.key.trim() : '';
	if (resolved) return resolved;
	return typeof ctx.options?.webhookSecret === 'string'
		? ctx.options.webhookSecret
		: undefined;
}

/**
 * The shop domain this tenant is configured for, normalised for comparison.
 *
 * Reads the same sources in the same order as the endpoints: the plugin
 * `shopDomain` option first, then the stored account value. Reading only the
 * stored value would reject valid deliveries for an instance that overrides an
 * old stored domain, while its API calls used the override.
 *
 * Reading can fail on a tenant that never configured one; that is not a reason
 * to reject a delivery, so a failure reads as "unknown" and the check is
 * skipped.
 */
async function readTenantDomain(
	ctx: ShopifyContext,
): Promise<string | undefined> {
	const option =
		typeof ctx.options?.shopDomain === 'string'
			? ctx.options.shopDomain.trim()
			: '';
	if (option) return normaliseShopDomain(option);
	try {
		const stored = await ctx.keys?.get_shop_domain?.();
		const value = stored?.trim();
		return value ? normaliseShopDomain(value) : undefined;
	} catch {
		return undefined;
	}
}

/**
 * One verified entry point for every topic. Shopify puts the topic in a
 * header, not the body, so there is nothing in the payload for a per-topic
 * matcher to read before this runs.
 */
// unknown: the payload differs per topic, and the topic header is what selects
// the schema inside the handler, so it cannot be typed at declaration.
export const receive: CorsairWebhook<
	ShopifyContext,
	unknown,
	ShopifyWebhookOutput
> = {
	match: (request) =>
		// A Shopify delivery always names its topic and signs the body. The
		// topic header alone is enough to claim it, and the handler verifies
		// the signature before parsing anything.
		headerValue(request.headers, SHOPIFY_TOPIC_HEADER) !== undefined &&
		headerValue(request.headers, SHOPIFY_HMAC_HEADER) !== undefined,

	handler: async (ctx, request) => {
		const verification = verifyShopifyWebhook(
			// unknown: see the declaration above; the handler types itself.
			request as WebhookRequest<unknown>,
			readSecret(ctx),
		);
		if (!verification.valid) {
			refuse(verification.error ?? 'invalid signature');
		}

		const topic = headerValue(request.headers, SHOPIFY_TOPIC_HEADER) ?? '';
		if (!isSupportedTopic(topic)) {
			// An unsubscribed topic is a configuration error, not a forged
			// request: throwing makes the sender retry while it is fixed.
			refuse(
				`topic "${topic}" is not supported by this plugin; expected one of ${Object.keys(
					SHOPIFY_WEBHOOK_SCHEMAS,
				).join(', ')}`,
			);
		}

		const schema = SHOPIFY_WEBHOOK_SCHEMAS[topic as ShopifyWebhookTopic];
		const parsed = schema.safeParse(request.payload);
		if (!parsed.success) {
			refuse(
				`payload for ${topic} does not match its schema: ${parsed.error.message}`,
			);
		}

		const resourceId = String(parsed.data.id);
		const shopDomain =
			headerValue(request.headers, SHOPIFY_SHOP_DOMAIN_HEADER) ?? null;

		// The shop-domain header is not covered by the HMAC, so it cannot prove
		// which shop sent a delivery. It is checked against the domain stored
		// for this tenant instead: a delivery signed with this tenant's secret
		// but claiming another shop is a config mistake or a replay, and either
		// way its hooks must not run against this tenant's data. A tenant with
		// no stored domain cannot be checked, so the value is read back as
		// reported rather than trusted.
		const tenantDomain = await readTenantDomain(ctx);
		if (tenantDomain && shopDomain && tenantDomain !== shopDomain) {
			refuse(
				`the delivery names shop "${shopDomain}" but this tenant is configured for "${tenantDomain}"`,
			);
		}

		const data: ShopifyWebhookOutput = {
			topic,
			shopDomain,
			resourceId,
			signatureVerified: request.hubVerified ? false : true,
		};

		return {
			success: true,
			data,
			// The body is Shopify's own format; the caller reads the parsed
			// resource from `data`. Nothing is stored here because the delivery
			// may arrive for a tenant with no local row for that resource.
		};
	},
};

export const ShopifyWebhookHandlers = {
	receive,
};
