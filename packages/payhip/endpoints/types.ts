import { z } from 'zod';

// ── Shared building blocks ─────────────────────────────────────────────────

/** The license key object, as the reference documents it. */
export const LicenseKeySchema = z
	.object({
		license_key: z.string().min(1).describe('The license key'),
		enabled: z.boolean().describe('Whether the license key is valid'),
		product_link: z
			.string()
			.nullish()
			.describe('Product key this license belongs to'),
		product_name: z.string().nullish().describe('Product name'),
		variant_name: z.string().nullish().describe('License variant name'),
		variant_id: z.string().nullish().describe('License variant id'),
		buyer_email: z
			.string()
			.nullish()
			.describe('Email the customer bought the license with'),
		uses: z.number().nullish().describe('Number of times the license was used'),
	})
	.loose()
	.describe('A Payhip license key');
export type LicenseKey = z.infer<typeof LicenseKeySchema>;

/** The coupon object, as the reference documents it. */
export const CouponSchema = z
	.object({
		id: z.number().describe('Coupon id'),
		code: z.string().nullish().describe('Code the customer enters at checkout'),
		coupon_type: z
			.enum(['single', 'multi', 'collection'])
			.nullish()
			.describe('What the coupon applies to'),
		percent_off: z.number().nullish().describe('Percentage discount, 0-100'),
		amount_off: z.number().nullish().describe('Fixed discount in cents'),
		start_date: z
			.string()
			.nullish()
			.describe('RFC 3339 datetime the coupon becomes valid'),
		end_date: z
			.string()
			.nullish()
			.describe('RFC 3339 datetime the coupon expires'),
		product_key: z
			.string()
			.nullish()
			.describe('Product key when coupon_type is single'),
		collection_id: z
			.string()
			.nullish()
			.describe('Collection id when coupon_type is collection'),
		minimum_purchase_amount: z
			.number()
			.nullish()
			.describe('Minimum cart total in cents before redemption'),
		usage_limit: z
			.number()
			.nullish()
			.describe('Maximum redemptions before the coupon becomes invalid'),
		notes: z
			.string()
			.nullish()
			.describe('Administrative note, not visible to customers'),
	})
	.loose()
	.describe('A Payhip coupon');
export type Coupon = z.infer<typeof CouponSchema>;

// ── coupons ────────────────────────────────────────────────────────────────

const RFC3339_REGEX =
	/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
const rfc3339 = z
	.string()
	.regex(
		RFC3339_REGEX,
		'Expected an RFC 3339 datetime like 2025-06-01T00:00:00Z',
	);

export const CreateCouponInputSchema = z
	.object({
		code: z.string().min(1).describe('Code the customer enters at checkout'),
		coupon_type: z
			.enum(['single', 'multi', 'collection'])
			.describe('What the coupon applies to'),
		percent_off: z
			.number()
			.gt(0)
			.lte(100)
			.optional()
			.describe('Percentage discount; required unless amount_off is passed'),
		amount_off: z
			.number()
			.int()
			.positive()
			.optional()
			.describe(
				'Fixed discount in cents; required unless percent_off is passed',
			),
		product_key: z
			.string()
			.optional()
			.describe('Product key; required when coupon_type is single'),
		collection_id: z
			.string()
			.optional()
			.describe('Collection id; required when coupon_type is collection'),
		start_date: rfc3339.optional().describe('When the coupon becomes valid'),
		end_date: rfc3339.optional().describe('When the coupon expires'),
		minimum_purchase_amount: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('Minimum cart total in cents before redemption'),
		usage_limit: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('Maximum redemptions'),
		notes: z
			.string()
			.optional()
			.describe('Administrative note, not visible to customers'),
	})
	.superRefine((input, ctx) => {
		// Exactly one of percent_off / amount_off is required, as the coupon
		// object documents.
		if (input.percent_off === undefined && input.amount_off === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['percent_off'],
				message: 'Give percent_off or amount_off',
			});
		}
		if (input.percent_off !== undefined && input.amount_off !== undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['percent_off'],
				message: 'Give percent_off or amount_off, not both',
			});
		}
		if (input.coupon_type === 'single' && !input.product_key) {
			ctx.addIssue({
				code: 'custom',
				path: ['product_key'],
				message: 'product_key is required when coupon_type is single',
			});
		}
		if (input.coupon_type === 'collection' && !input.collection_id) {
			ctx.addIssue({
				code: 'custom',
				path: ['collection_id'],
				message: 'collection_id is required when coupon_type is collection',
			});
		}
	})
	.describe('Create a coupon (form-encoded)');
export type CreateCouponInput = z.infer<typeof CreateCouponInputSchema>;

export const CreateCouponOutputSchema = z
	.object({ data: CouponSchema })
	.loose()
	.describe('The coupon as created');
export type CreateCouponOutput = z.infer<typeof CreateCouponOutputSchema>;

export const ListCouponsInputSchema = z
	.object({
		limit: z
			.number()
			.int()
			.min(1)
			.max(100)
			.optional()
			.describe('Results per page'),
		offset: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe('Offset of the first result'),
	})
	.describe('Query parameters for listing coupons');
export type ListCouponsInput = z.infer<typeof ListCouponsInputSchema>;

export const ListCouponsOutputSchema = z
	.object({
		data: z
			.object({
				coupons: z.array(CouponSchema).describe('Coupons on this page'),
			})
			.loose(),
	})
	.loose()
	.describe('A page of coupons');
export type ListCouponsOutput = z.infer<typeof ListCouponsOutputSchema>;

export const GetCouponInputSchema = z
	.object({ couponId: z.number().int().describe('Coupon id') })
	.describe('Input for reading one coupon');
export type GetCouponInput = z.infer<typeof GetCouponInputSchema>;

export const GetCouponOutputSchema = z
	.object({ data: CouponSchema })
	.loose()
	.describe('The coupon');
export type GetCouponOutput = z.infer<typeof GetCouponOutputSchema>;

// ── license keys ───────────────────────────────────────────────────────────

export const VerifyLicenseInputSchema = z
	.object({
		license_key: z.string().min(1).describe('The license key to verify'),
	})
	.describe('Verify a license key against the product secret');
export type VerifyLicenseInput = z.infer<typeof VerifyLicenseInputSchema>;

export const VerifyLicenseOutputSchema = z
	.object({ data: LicenseKeySchema })
	.loose()
	.describe('The license key with its current state');
export type VerifyLicenseOutput = z.infer<typeof VerifyLicenseOutputSchema>;

export const SetLicenseStateInputSchema = z
	.object({
		license_key: z.string().min(1).describe('The license key to change'),
	})
	.describe('Input for disabling or enabling a license key');
export type SetLicenseStateInput = z.infer<typeof SetLicenseStateInputSchema>;

export const DisableLicenseOutputSchema = z
	.object({ data: LicenseKeySchema })
	.loose()
	.describe('The license key with enabled false');
export type DisableLicenseOutput = z.infer<typeof DisableLicenseOutputSchema>;

export const EnableLicenseOutputSchema = z
	.object({ data: LicenseKeySchema })
	.loose()
	.describe('The license key with enabled true');
export type EnableLicenseOutput = z.infer<typeof EnableLicenseOutputSchema>;

export const ChangeLicenseUsageInputSchema = z
	.object({
		license_key: z.string().min(1).describe('The license key to change'),
	})
	.describe('Input for increasing or decreasing license usage');
export type ChangeLicenseUsageInput = z.infer<
	typeof ChangeLicenseUsageInputSchema
>;

export const ChangeLicenseUsageOutputSchema = z
	.object({ data: LicenseKeySchema })
	.loose()
	.describe('The license key with its updated uses count');
export type ChangeLicenseUsageOutput = z.infer<
	typeof ChangeLicenseUsageOutputSchema
>;

// ── Operation registry ─────────────────────────────────────────────────────

export const PayhipEndpointInputSchemas = {
	couponsCreate: CreateCouponInputSchema,
	couponsList: ListCouponsInputSchema,
	couponsGet: GetCouponInputSchema,
	licenseVerify: VerifyLicenseInputSchema,
	licenseDisable: SetLicenseStateInputSchema,
	licenseEnable: SetLicenseStateInputSchema,
	licenseIncreaseUsage: ChangeLicenseUsageInputSchema,
	licenseDecreaseUsage: ChangeLicenseUsageInputSchema,
};

export const PayhipEndpointOutputSchemas = {
	couponsCreate: CreateCouponOutputSchema,
	couponsList: ListCouponsOutputSchema,
	couponsGet: GetCouponOutputSchema,
	licenseVerify: VerifyLicenseOutputSchema,
	licenseDisable: DisableLicenseOutputSchema,
	licenseEnable: EnableLicenseOutputSchema,
	licenseIncreaseUsage: ChangeLicenseUsageOutputSchema,
	licenseDecreaseUsage: ChangeLicenseUsageOutputSchema,
};

export type PayhipEndpointInputs = {
	[K in keyof typeof PayhipEndpointInputSchemas]: z.input<
		(typeof PayhipEndpointInputSchemas)[K]
	>;
};

export type PayhipEndpointOutputs = {
	[K in keyof typeof PayhipEndpointOutputSchemas]: z.infer<
		(typeof PayhipEndpointOutputSchemas)[K]
	>;
};
