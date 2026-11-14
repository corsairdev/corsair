import { z } from 'zod';
import { KOFI_PAYMENT_TYPES } from './verify';

// The payment JSON Ko-fi carries in the `data` form field. Field presence
// varies by type: `shop_items` and `shipping` only on a Shop Order, `tier_name`
// only on a membership. Reference: https://help.ko-fi.com/hc/en-us/articles/360004162298

const ShopItemSchema = z
	.object({
		direct_link_code: z.string().nullish(),
		variation_name: z.string().nullish(),
		quantity: z.number().nullish(),
	})
	.loose();

const ShippingSchema = z
	.object({
		full_name: z.string().nullish(),
		street_address: z.string().nullish(),
		city: z.string().nullish(),
		state_or_province: z.string().nullish(),
		postal_code: z.string().nullish(),
		country: z.string().nullish(),
		country_code: z.string().nullish(),
		telephone: z.string().nullish(),
	})
	.loose();

export const KofiPaymentSchema = z
	.object({
		verification_token: z
			.string()
			.describe(
				'The token from your Ko-fi webhooks page; the plugin handler compares it before accepting the payment.',
			),
		message_id: z
			.string()
			.describe('Unique per delivery, and stable across a retry.'),
		timestamp: z
			.string()
			.describe(
				'When the payment happened, ISO 8601. Ko-fi documents it as required.',
			),
		type: z.enum(KOFI_PAYMENT_TYPES),
		is_public: z.boolean().nullish(),
		from_name: z
			.string()
			.nullish()
			.describe('The supporter’s display name, or `Anonymous`.'),
		message: z.string().nullish(),
		amount: z
			.string()
			.describe(
				'A decimal string, such as `5.00`, not a number. Ko-fi documents it as required.',
			),
		url: z.string().nullish().describe('A link to the transaction on Ko-fi.'),
		email: z
			.string()
			.nullish()
			.describe('Present only when the supporter shared it with the creator.'),
		currency: z
			.string()
			.describe('ISO 4217, such as `USD`. Ko-fi documents it as required.'),
		is_subscription_payment: z.boolean().nullish(),
		is_first_subscription_payment: z.boolean().nullish(),
		kofi_transaction_id: z
			.string()
			.describe(
				'Ko-fi’s transaction identifier. Ko-fi documents it as required.',
			),
		tier_name: z
			.string()
			.nullish()
			.describe('The membership tier, on a Subscription only.'),
		shop_items: z
			.array(ShopItemSchema)
			.nullish()
			.describe('On a Shop Order only.'),
		shipping: ShippingSchema.nullish().describe(
			'On a physical Shop Order only.',
		),
	})
	.loose();

export type KofiPayment = z.infer<typeof KofiPaymentSchema>;

// ── webhook paths ─────────────────────────────────────────────────────────

/** One path per documented payment type, so a caller can subscribe per type. */
export const kofiWebhookEventNames = {
	donation: 'Donation',
	subscription: 'Subscription',
	shopOrder: 'Shop Order',
	commission: 'Commission',
} as const;

export type KofiWebhookOutputs = {
	donation: KofiPayment;
	subscription: KofiPayment;
	shopOrder: KofiPayment;
	commission: KofiPayment;
};

// ── the catalog operation ─────────────────────────────────────────────────

// There is nothing to call, so the only honest operation is one that returns
// the documented event types. This mirrors `woodpeckerco`'s `webhooks.listEvents`.
export const KofiWebhookEventSchema = z.object({
	type: z.string(),
	description: z.string(),
	docs_url: z.string(),
});

export type KofiWebhookEvent = z.infer<typeof KofiWebhookEventSchema>;

export const KOFI_WEBHOOK_EVENTS: readonly KofiWebhookEvent[] = [
	{
		type: 'Donation',
		description:
			'A one-off tip or donation to the page. `amount` is a decimal string and `message` is the note left with it.',
		docs_url:
			'https://help.ko-fi.com/hc/en-us/articles/360004162298-Does-Ko-fi-have-an-API-or-webhook',
	},
	{
		type: 'Subscription',
		description:
			'A membership payment, which fires on every payment including the first. `tier_name` names the tier and `is_first_subscription_payment` marks the first.',
		docs_url:
			'https://help.ko-fi.com/hc/en-us/articles/360004162298-Does-Ko-fi-have-an-API-or-webhook',
	},
	{
		type: 'Shop Order',
		description:
			'A purchase from the shop, with `shop_items`, and `shipping` when the goods are physical.',
		docs_url:
			'https://help.ko-fi.com/hc/en-us/articles/360004162298-Does-Ko-fi-have-an-API-or-webhook',
	},
	{
		type: 'Commission',
		description:
			'A paid commission request. Ko-fi documents the type but publishes no example payload, so the fields follow the same base shape.',
		docs_url:
			'https://help.ko-fi.com/hc/en-us/articles/360004162298-Does-Ko-fi-have-an-API-or-webhook',
	},
];
