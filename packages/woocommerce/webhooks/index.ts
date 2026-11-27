import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhook,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { getHeader, logEventFromContext } from 'corsair/core';
import {
	getWoocommerceWebhookPayloadSchema,
	woocommerceWebhookFor,
} from '../endpoints/openapi-schema';
import type { WoocommerceWebhookPayloads } from '../endpoints/operation-types';
import type { WoocommerceContext } from '../index';

/**
 * WooCommerce signs every delivery of a webhook that has a secret
 * (webhooks.create with `secret`; WooCommerce makes one up when it is left
 * out):
 *
 *   X-WC-Webhook-Signature: base64(HMAC-SHA256(raw body, secret))
 *
 * and says what happened in X-WC-Webhook-Topic (`order.created`,
 * `action.woocommerce_add_to_cart`), X-WC-Webhook-Resource (`order`) and
 * X-WC-Webhook-Event (`created`). X-WC-Webhook-Delivery-ID identifies the
 * delivery. Checked against real deliveries from WooCommerce 11.3 (live 11-27).
 * https://woocommerce.github.io/woocommerce-rest-api-docs/#webhooks
 */
function safeEqual(left: string, right: string): boolean {
	const a = Buffer.from(left);
	const b = Buffer.from(right);
	return a.length === b.length && timingSafeEqual(a, b);
}

export type WoocommerceWebhookVerification =
	| { valid: true }
	| { valid: false; error: string };

export function verifyWoocommerceWebhook(
	// `unknown` payload: the signature covers the raw body, so verification never reads the parsed payload.
	request: WebhookRequest<unknown>,
	secret: string | undefined,
): WoocommerceWebhookVerification {
	if (request.hubVerified) return { valid: true };
	if (!secret) {
		return {
			valid: false,
			error:
				'No WooCommerce webhook secret is set (plugin option webhookSecret or keys.set_webhook_signature)',
		};
	}
	if (request.rawBody === undefined) {
		return { valid: false, error: 'Missing raw body' };
	}
	const signature = getHeader(request.headers, 'x-wc-webhook-signature');
	if (!signature) {
		return { valid: false, error: 'Missing X-WC-Webhook-Signature header' };
	}
	const expected = createHmac('sha256', secret)
		.update(request.rawBody)
		.digest('base64');
	return safeEqual(signature.trim(), expected)
		? { valid: true }
		: { valid: false, error: 'Invalid WooCommerce webhook signature' };
}

export type WoocommerceWebhookId = keyof WoocommerceWebhookPayloads;

const WEBHOOK_IDS = [
	'action',
	'coupon',
	'customer',
	'order',
	'product',
] as const satisfies readonly WoocommerceWebhookId[];

/** The delivery's topic (`order.created`), from X-WC-Webhook-Topic. */
export function woocommerceTopicOf(
	request: Pick<RawWebhookRequest, 'headers'>,
): string | undefined {
	return getHeader(request.headers, 'x-wc-webhook-topic') || undefined;
}

/** Which webhook handles a topic (`order.updated` → `order`, `action.x` → `action`). */
export function webhookIdFor(topic: string): WoocommerceWebhookId | undefined {
	if (topic.startsWith('action.')) return 'action';
	return WEBHOOK_IDS.find((id) =>
		woocommerceWebhookFor(id).eventTypes.includes(topic),
	);
}

/**
 * Any WooCommerce delivery this plugin handles (the plugin's webhook
 * matcher). WooCommerce's ping when a webhook is created or re-activated is a
 * form body `webhook_id=<id>` with no topic: not a store event, so it isn't
 * matched.
 */
export function isWoocommerceDelivery(request: RawWebhookRequest): boolean {
	const topic = woocommerceTopicOf(request);
	return topic !== undefined && webhookIdFor(topic) !== undefined;
}

export type WoocommerceWebhook<Id extends WoocommerceWebhookId> =
	CorsairWebhook<
		WoocommerceContext,
		WoocommerceWebhookPayloads[Id],
		WoocommerceWebhookPayloads[Id]
	>;

/**
 * One webhook per resource. It matches its topics, checks the signature with
 * the webhook's secret, and returns the delivery parsed leniently against the
 * REST schema of the resource (a deleted record comes as `{ id }`). Use
 * X-WC-Webhook-Delivery-ID to skip a delivery already handled.
 */
function woocommerceWebhook<Id extends WoocommerceWebhookId>(
	id: Id,
): WoocommerceWebhook<Id> {
	return {
		match: (request) => {
			const topic = woocommerceTopicOf(request);
			return topic !== undefined && webhookIdFor(topic) === id;
		},
		handler: async (ctx, request) => {
			const verification = verifyWoocommerceWebhook(request, ctx.key);
			if (!verification.valid) {
				return { success: false, statusCode: 401, error: verification.error };
			}
			const parsed = getWoocommerceWebhookPayloadSchema(id).safeParse(
				request.payload,
			);
			if (!parsed.success) {
				// Paths only: the payload holds customers' names and addresses.
				const where = parsed.error.issues
					.slice(0, 3)
					.map((issue) => issue.path.join('.') || 'payload')
					.join(', ');
				return {
					success: false,
					statusCode: 400,
					error: `WooCommerce ${id} payload did not match its documented schema (${where})`,
				};
			}
			const event = parsed.data as WoocommerceWebhookPayloads[Id];
			await logEventFromContext(
				ctx,
				`woocommerce.webhook.${id}`,
				// The topic and delivery id only: the payload holds customer data.
				{
					topic: woocommerceTopicOf(request),
					deliveryId: getHeader(request.headers, 'x-wc-webhook-delivery-id'),
				},
				'completed',
			);
			return { success: true, data: event };
		},
	};
}

export const woocommerceWebhooksNested = {
	action: woocommerceWebhook('action'),
	coupon: woocommerceWebhook('coupon'),
	customer: woocommerceWebhook('customer'),
	order: woocommerceWebhook('order'),
	product: woocommerceWebhook('product'),
} as const;

function describe(id: WoocommerceWebhookId): string {
	const webhook = woocommerceWebhookFor(id);
	return `${webhook.summary} (X-WC-Webhook-Topic ${id === 'action' ? 'action.<hook>' : webhook.eventTypes.join(', ')})`;
}

/** Schemas are getters, so a payload schema is built only when something reads it. */
function webhookSchemaEntry(id: WoocommerceWebhookId) {
	return {
		description: describe(id),
		get payload() {
			return getWoocommerceWebhookPayloadSchema(id);
		},
		get response() {
			return getWoocommerceWebhookPayloadSchema(id);
		},
	};
}

export const woocommerceWebhookSchemas = Object.fromEntries(
	WEBHOOK_IDS.map((id) => [id, webhookSchemaEntry(id)]),
) as { [Id in WoocommerceWebhookId]: ReturnType<typeof webhookSchemaEntry> };
