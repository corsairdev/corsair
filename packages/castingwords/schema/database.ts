import { z } from 'zod';

/**
 * POST /store/API4/order_url
 * Official: https://castingwords.com/docs/developer/SimpleAPI.html#order_url
 */
export const CastingwordsOrder = z
	.object({
		audiofiles: z.array(z.union([z.string(), z.number()])),
		order: z.union([z.string(), z.number()]),
		message: z.string().optional(),
		hold: z.string().optional(),
	})
	.loose();
export type CastingwordsOrder = z.infer<typeof CastingwordsOrder>;

/**
 * GET /store/API4/audiofile/#ID
 * Official: https://castingwords.com/docs/developer/SimpleAPI.html#audiofileid
 */
export const CastingwordsAudiofile = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		statename: z.string().optional(),
		names: z.string().optional(),
		notes: z.string().optional(),
		originallink: z.string().optional(),
		title: z.string().optional(),
		duration: z.union([z.string(), z.number()]).optional(),
		description: z.string().optional(),
		quality_stars: z.union([z.string(), z.number()]).optional(),
	})
	.loose();
export type CastingwordsAudiofile = z.infer<typeof CastingwordsAudiofile>;

/**
 * GET /store/API4/invoice/#ID items[]
 * Official: https://castingwords.com/docs/developer/SimpleAPI.html#invoiceid
 */
export const CastingwordsInvoiceItem = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		sku: z.string().optional(),
		quantity: z.union([z.string(), z.number()]).optional(),
		price: z.union([z.string(), z.number()]).optional(),
		audiofile: z.union([z.string(), z.number()]).optional(),
		total: z.union([z.string(), z.number()]).optional(),
	})
	.loose();
export type CastingwordsInvoiceItem = z.infer<typeof CastingwordsInvoiceItem>;

/**
 * GET /store/API4/invoice/#ID
 * Official: https://castingwords.com/docs/developer/SimpleAPI.html#invoiceid
 */
export const CastingwordsInvoice = z
	.object({
		id: z.union([z.string(), z.number()]),
		purchase_order: z.union([z.string(), z.number()]).nullable().optional(),
		createtime: z.string().optional(),
		paidtime: z.string().nullable().optional(),
		total: z.union([z.string(), z.number()]).optional(),
		items: z.array(CastingwordsInvoiceItem).optional(),
		state: z.enum(['PAID', 'SUBMITTED', 'OPEN', 'CREATED']).optional(),
	})
	.loose();
export type CastingwordsInvoice = z.infer<typeof CastingwordsInvoice>;

/**
 * GET /store/API4/prepay_balance
 * Official: https://castingwords.com/docs/developer/SimpleAPI.html#prepay_balance
 */
export const CastingwordsPrepayBalance = z
	.object({
		balance: z.coerce.number(),
	})
	.loose();
export type CastingwordsPrepayBalance = z.infer<
	typeof CastingwordsPrepayBalance
>;

/**
 * GET|POST /store/API4/webhook
 * Official: https://castingwords.com/docs/developer/SimpleAPI.html#webhook
 */
export const CastingwordsWebhook = z
	.object({
		webhook: z
			.union([z.string(), z.literal('')])
			.nullable()
			.optional(),
	})
	.loose();
export type CastingwordsWebhook = z.infer<typeof CastingwordsWebhook>;

/**
 * Documented SKUs from Store API v4 order_url / upgrade
 * Official: https://castingwords.com/docs/developer/SimpleAPI.html
 */
export const CastingwordsSku = z.object({
	sku: z.string(),
	kind: z.enum(['order', 'upgrade']),
	description: z.string(),
});
export type CastingwordsSku = z.infer<typeof CastingwordsSku>;
