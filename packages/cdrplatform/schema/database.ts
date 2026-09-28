import { z } from 'zod';

/**
 * GET /v1/certificate/{id}/
 * Official: https://github.com/Climacrux/api.cdrplatform.com/blob/main/cdrplatform/core/api/certificate/retrieve.py
 */
export const CdrPlatformCertificate = z
	.object({
		certificate_id: z.string(),
		display_name: z.string(),
		issued_date: z.string(),
		removal_amount_kg: z.number().int().nonnegative(),
	})
	.loose();
export type CdrPlatformCertificate = z.infer<typeof CdrPlatformCertificate>;

/**
 * POST /v1/cdr/
 * Official: https://docs.cdrplatform.com/docs/removal-request
 */
export const CdrPlatformRemovalRequest = z
	.object({
		transaction_uuid: z.string(),
		weight_unit: z.enum(['g', 'kg', 't']).optional(),
		currency: z.enum(['usd', 'eur', 'gbp', 'chf']).optional(),
		client_reference_id: z.string().optional(),
		certificate_display_name: z.string().optional(),
	})
	.loose();
export type CdrPlatformRemovalRequest = z.infer<
	typeof CdrPlatformRemovalRequest
>;

/**
 * POST /v1/cdr/price/
 * Official: https://docs.cdrplatform.com/docs/getting-started
 */
export const CdrPlatformPriceQuote = z
	.object({
		cost: z.object({
			items: z.array(
				z.object({
					method_type: z.string(),
					cdr_amount: z.number(),
					cost: z.number(),
				}),
			),
			removal: z.number(),
			variable_fees: z.number(),
			total: z.number(),
		}),
		currency: z.enum(['usd', 'eur', 'gbp', 'chf']),
		weight_unit: z.enum(['g', 'kg', 't']),
	})
	.loose();
export type CdrPlatformPriceQuote = z.infer<typeof CdrPlatformPriceQuote>;
