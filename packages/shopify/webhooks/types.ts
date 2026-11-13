import { createHmac, timingSafeEqual } from 'node:crypto';
import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { z } from 'zod';

/**
 * Header carrying the HMAC. Shopify sends it base64-encoded SHA-256 over the
 * exact bytes received, so verification must run on the raw body string. A
 * delivery parsed and re-serialised first will not match: JSON key order,
 * whitespace and unicode escaping all change.
 */
export const SHOPIFY_HMAC_HEADER = 'x-shopify-hmac-sha256';

/** Topic header, e.g. `orders/create`. It selects which payload schema runs. */
export const SHOPIFY_TOPIC_HEADER = 'x-shopify-topic';

/** Shop that sent the delivery, e.g. `my-store.myshopify.com`. */
export const SHOPIFY_SHOP_DOMAIN_HEADER = 'x-shopify-shop-domain';

/** A unique id per delivery, useful for de-duplicating retries. */
export const SHOPIFY_WEBHOOK_ID_HEADER = 'x-shopify-webhook-id';

export function headerValue(
	// Adapters hand header values through as string, string[] or undefined.
	headers: RawWebhookRequest['headers'],
	name: string,
): string | undefined {
	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() !== name) continue;
		return Array.isArray(value) ? value[0] : value;
	}
	return undefined;
}

/**
 * Compares in constant time. Both values are base64 strings of equal length
 * for the same body, but a tampered header may differ in length, which
 * `timingSafeEqual` throws on, so the length check comes first.
 */
export function verifyShopifySignature(
	rawBody: string | undefined,
	providedHmac: string | undefined,
	secret: string | undefined,
): { valid: boolean; error?: string } {
	const expectedSecret = secret?.trim();
	if (!expectedSecret) {
		return {
			valid: false,
			error:
				'No Shopify webhook secret is set (plugin option webhookSecret or keys.set_webhook_signature)',
		};
	}
	if (!providedHmac) {
		return { valid: false, error: 'Missing X-Shopify-Hmac-Sha256 header' };
	}
	if (rawBody === undefined) {
		return {
			valid: false,
			error:
				'Raw body is required to verify a Shopify signature; the body was already parsed',
		};
	}

	const digest = createHmac('sha256', expectedSecret)
		.update(rawBody, 'utf8')
		.digest('base64');
	const a = Buffer.from(digest);
	const b = Buffer.from(providedHmac.trim());
	if (a.length !== b.length || !timingSafeEqual(a, b)) {
		return { valid: false, error: 'Signature does not match' };
	}
	return { valid: true };
}

/** Runs verification for one delivery, honouring a Hub-verified request. */
export function verifyShopifyWebhook(
	// unknown: the payload is not narrowed until the topic header selects a
	// schema, so only the headers and raw body are read here.
	request: WebhookRequest<unknown>,
	secret: string | undefined,
): { valid: boolean; error?: string } {
	if (request.hubVerified) return { valid: true };
	return verifyShopifySignature(
		request.rawBody,
		headerValue(request.headers, SHOPIFY_HMAC_HEADER),
		secret,
	);
}

// ── Payload schemas ───────────────────────────────────────────────────────
//
// Shopify sends the resource itself, not an envelope with an event name: the
// topic lives only in the header. The payload is therefore validated per
// topic, and a topic with no schema is rejected rather than stored unparsed.

const idSchema = z.union([z.string(), z.number()]).transform(String);

/** Every delivery carries this much, whatever the topic. */
export const ShopifyDeliveryMetaSchema = z
	.object({
		topic: z.string(),
		shopDomain: z.string().optional(),
		webhookId: z.string().optional(),
	})
	.loose();

export const OrderWebhookSchema = z
	.object({
		id: idSchema,
		admin_graphql_api_id: z.string().optional(),
		name: z.string().nullish(),
		email: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		currency: z.string().nullish(),
		financial_status: z.string().nullish(),
		fulfillment_status: z.string().nullish(),
		cancelled_at: z.string().nullish(),
		current_total_price: z.string().nullish(),
		total_price: z.string().nullish(),
		order_number: z.number().nullish(),
		line_items: z
			.array(
				z
					.object({
						id: idSchema.optional(),
						title: z.string().nullish(),
						quantity: z.number().nullish(),
						sku: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		customer: z
			.object({
				id: idSchema.nullish(),
				email: z.string().nullish(),
				first_name: z.string().nullish(),
				last_name: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export const ProductWebhookSchema = z
	.object({
		id: idSchema,
		admin_graphql_api_id: z.string().optional(),
		title: z.string().nullish(),
		handle: z.string().nullish(),
		status: z.string().nullish(),
		vendor: z.string().nullish(),
		product_type: z.string().nullish(),
		tags: z.union([z.string(), z.array(z.string())]).nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		variants: z
			.array(
				z
					.object({
						id: idSchema.optional(),
						title: z.string().nullish(),
						sku: z.string().nullish(),
						price: z.string().nullish(),
						inventory_quantity: z.number().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export const CustomerWebhookSchema = z
	.object({
		id: idSchema,
		admin_graphql_api_id: z.string().optional(),
		email: z.string().nullish(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		phone: z.string().nullish(),
		state: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		orders_count: z.number().nullish(),
		tags: z.union([z.string(), z.array(z.string())]).nullish(),
	})
	.loose();

/** Which schema validates each supported topic. */
export const SHOPIFY_WEBHOOK_SCHEMAS = {
	'orders/create': OrderWebhookSchema,
	'orders/updated': OrderWebhookSchema,
	'orders/cancelled': OrderWebhookSchema,
	'orders/fulfilled': OrderWebhookSchema,
	'orders/paid': OrderWebhookSchema,
	'products/create': ProductWebhookSchema,
	'products/update': ProductWebhookSchema,
	'products/delete': ProductWebhookSchema,
	'customers/create': CustomerWebhookSchema,
	'customers/update': CustomerWebhookSchema,
} as const;

export type ShopifyWebhookTopic = keyof typeof SHOPIFY_WEBHOOK_SCHEMAS;

export function isSupportedTopic(topic: string): topic is ShopifyWebhookTopic {
	return topic in SHOPIFY_WEBHOOK_SCHEMAS;
}

/** Resource family for a topic, or null when the topic is not handled. */
export function topicFamily(topic: string): string | null {
	const [family] = topic.split('/');
	if (!family) return null;
	return isSupportedTopic(topic) ? family : null;
}
