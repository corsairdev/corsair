import type { CorsairWebhook, WebhookRequest } from 'corsair/core';
import type { ShopifyContext } from '..';
import type { ShopifyWebhookTopic } from './types';
import {
	headerValue,
	isSupportedTopic,
	SHOPIFY_HMAC_HEADER,
	SHOPIFY_SHOP_DOMAIN_HEADER,
	SHOPIFY_TOPIC_HEADER,
	SHOPIFY_WEBHOOK_SCHEMAS,
	verifyShopifyWebhook,
} from './types';

export type ShopifyWebhookOutput = {
	topic: string;
	shopDomain: string | null;
	/** Id of the resource the delivery describes (order, product, customer). */
	resourceId: string;
	/** False only when a Hub-verified delivery skipped local verification. */
	signatureVerified: boolean;
};

/**
 * Rejects a delivery by throwing. `processWebhook` builds its result as
 * `{ ...returnToSender, success: true }`, so a returned `success: false` is
 * overwritten and the caller is told a forged delivery succeeded.
 */
function refuse(reason: string): never {
	throw new Error(`Shopify webhook rejected: ${reason}`);
}

function readSecret(ctx: ShopifyContext): string | undefined {
	return typeof ctx.options?.webhookSecret === 'string'
		? ctx.options.webhookSecret
		: undefined;
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
