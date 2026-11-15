import { z } from 'zod';

// Inputs use Tapfiliate's own parameter names. Outputs are `.loose()` and
// their optional fields nullish, because Tapfiliate sends `null` for most
// optional columns. Lists answer a bare array, and the next page is in the
// `Link` header rather than the body, so the page is a caller input.
// Field reference: https://developers.tapfiliate.com/api-reference/introduction

const AffiliateIdSchema = z
	.string()
	.min(1)
	.describe('The affiliate ID, an `id` from `affiliates.list`.');
const ProgramIdSchema = z
	.string()
	.min(1)
	.describe('The program ID, an `id` from `programs.list`.');
const ConversionIdSchema = z
	.number()
	.int()
	.positive()
	.describe('The numeric conversion ID.');
const CommissionIdSchema = z
	.number()
	.int()
	.positive()
	.describe('The numeric commission ID.');
const PaymentIdSchema = z
	.string()
	.min(1)
	.describe('The payment ID, a `pa_...` value.');
const CustomerIdSchema = z
	.string()
	.min(1)
	.describe('The customer ID, a `cu_...` value.');
const ClickIdSchema = z
	.string()
	.min(1)
	.describe('The click ID, the `id` that `clicks.create` returned.');

/**
 * Listing routes take `page` and fix the size at 25 items, the only paging the
 * docs define. The next page number is in the `Link` header, which the HTTP
 * client cannot return with the body, so the caller passes it back in.
 */
const PageSchema = z
	.number()
	.int()
	.min(1)
	.optional()
	.describe('Page number, starting at 1. Each page holds 25 items.');

const IsoDateSchema = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD.')
	.describe('A date as "YYYY-MM-DD".');

// ── Shared output pieces ──────────────────────────────────────────────────

const AffiliateNameSchema = z
	.object({
		id: z.string().nullish(),
		firstname: z.string().nullish(),
		lastname: z.string().nullish(),
	})
	.loose();

const ProgramRefSchema = z
	.object({
		id: z.string().nullish(),
		title: z.string().nullish(),
		currency: z.string().nullish(),
	})
	.loose();

const ClickRefSchema = z
	.object({
		created_at: z.string().nullish(),
		referrer: z.string().nullish(),
		landing_page: z.string().nullish(),
	})
	.loose();

const CustomerRefSchema = z
	.object({
		id: z.string().nullish(),
		customer_id: z.string().nullish(),
		status: z.string().nullish(),
	})
	.loose();

const AddressSchema = z
	.object({
		address: z.string().nullish(),
		address_two: z.string().nullish(),
		postal_code: z.string().nullish(),
		city: z.string().nullish(),
		state: z.string().nullish(),
		country: z
			.object({ code: z.string().nullish(), name: z.string().nullish() })
			.loose()
			.nullish(),
	})
	.loose();

export const AffiliateSchema = z
	.object({
		id: z.string(),
		firstname: z.string().nullish(),
		lastname: z.string().nullish(),
		email: z.string().nullish(),
		company: z
			.object({
				name: z.string().nullish(),
				description: z.string().nullish(),
			})
			.loose()
			.nullish(),
		address: AddressSchema.nullish(),
		meta_data: z.record(z.string(), z.string()).nullish(),
		parent_id: z.string().nullish(),
		affiliate_group_id: z.string().nullish(),
		created_at: z.string().nullish(),
		promoted_at: z.string().nullish(),
		promotion_method: z.string().nullish(),
		custom_fields: z.record(z.string(), z.string()).nullish(),
		fraud: z.boolean().nullish(),
	})
	.loose();

export type TapfiliateAffiliate = z.infer<typeof AffiliateSchema>;

export const CommissionSchema = z
	.object({
		id: z.number(),
		conversion_sub_amount: z.number().nullish(),
		amount: z.number().nullish(),
		commission_type: z.string().nullish(),
		approved: z.boolean().nullish(),
		affiliate: AffiliateNameSchema.nullish(),
		conversion: z.object({ id: z.number().nullish() }).loose().nullish(),
		kind: z.string().nullish(),
		currency: z.string().nullish(),
		created_at: z.string().nullish(),
		payout: z.boolean().nullish(),
		comment: z.string().nullish(),
		final: z.boolean().nullish(),
		finalization_date: z.string().nullish(),
		commission_name: z.string().nullish(),
	})
	.loose();

export type TapfiliateCommission = z.infer<typeof CommissionSchema>;

export const ConversionSchema = z
	.object({
		id: z.number(),
		external_id: z.string().nullish(),
		amount: z.number().nullish(),
		click: ClickRefSchema.nullish(),
		commissions: z.array(CommissionSchema).nullish(),
		program: ProgramRefSchema.nullish(),
		affiliate: AffiliateNameSchema.nullish(),
		customer: CustomerRefSchema.nullish(),
		affiliate_meta_data: z.record(z.string(), z.string()).nullish(),
		meta_data: z.record(z.string(), z.string()).nullish(),
		created_at: z.string().nullish(),
	})
	.loose();

export type TapfiliateConversion = z.infer<typeof ConversionSchema>;

const CustomerSchema = z
	.object({
		id: z.string(),
		customer_id: z.string().nullish(),
		status: z.string().nullish(),
		created_at: z.string().nullish(),
		click: ClickRefSchema.nullish(),
		program: ProgramRefSchema.nullish(),
		affiliate: AffiliateNameSchema.nullish(),
		affiliate_meta_data: z.record(z.string(), z.string()).nullish(),
		meta_data: z.record(z.string(), z.string()).nullish(),
		warnings: z.string().nullish(),
	})
	.loose();

export type TapfiliateCustomer = z.infer<typeof CustomerSchema>;

const ProgramSchema = z
	.object({
		id: z.string(),
		currency: z.string().nullish(),
		title: z.string().nullish(),
		cookie_time: z.number().nullish(),
		default_landing_page_url: z.string().nullish(),
		recurring: z.boolean().nullish(),
		status: z.string().nullish(),
	})
	.loose();

export type TapfiliateProgram = z.infer<typeof ProgramSchema>;

export const BalancesSchema = z.record(z.string(), z.number());

const PaymentSchema = z
	.object({
		id: z.string(),
		created_at: z.string().nullish(),
		affiliate: AffiliateNameSchema.nullish(),
		amount: z.number().nullish(),
		currency: z.string().nullish(),
	})
	.loose();

export type TapfiliatePayment = z.infer<typeof PaymentSchema>;

const ReferralLinkSchema = z
	.object({
		asset_id: z.string().nullish(),
		link: z.string().nullish(),
		source_id: z.string().nullish(),
	})
	.loose();

const AffiliationSchema = z
	.object({
		applied_at: z.string().nullish(),
		approved: z.boolean().nullish(),
		coupon: z.string().nullish(),
		id: z.string().nullish(),
		referral_link: ReferralLinkSchema.nullish(),
	})
	.loose();

export type TapfiliateAffiliation = z.infer<typeof AffiliationSchema>;

// A 204 delete carries no body, so the endpoint reports what it did instead of
// inventing a provider field.
export const DeletedResponseSchema = z.object({ success: z.literal(true) });

export type DeletedResponse = z.infer<typeof DeletedResponseSchema>;

// ── affiliates ────────────────────────────────────────────────────────────

export const AffiliatesListInputSchema = z.object({
	page: PageSchema,
	click_id: z.string().optional().describe('Only affiliates for this click.'),
	source_id: z
		.string()
		.optional()
		.describe('Only affiliates for this click source.'),
	email: z.string().optional().describe('Only affiliates with this email.'),
	referral_code: z
		.string()
		.optional()
		.describe('Only the affiliate whose referral code this is.'),
	parent_id: z
		.string()
		.optional()
		.describe('Only affiliates under this parent.'),
	affiliate_group_id: z
		.string()
		.optional()
		.describe('Only affiliates in this group.'),
});

export type AffiliatesListInput = z.infer<typeof AffiliatesListInputSchema>;

export const AffiliatesListResponseSchema = z.array(AffiliateSchema);

export type AffiliatesListResponse = z.infer<
	typeof AffiliatesListResponseSchema
>;

export const AffiliatesGetInputSchema = z.object({
	affiliateId: AffiliateIdSchema,
});

export type AffiliatesGetInput = z.infer<typeof AffiliatesGetInputSchema>;

export const AffiliatesGetResponseSchema = AffiliateSchema;

export type AffiliatesGetResponse = z.infer<typeof AffiliatesGetResponseSchema>;

export const AffiliatesCreateInputSchema = z.object({
	email: z.string().min(1).describe("The affiliate's email."),
	password: z
		.string()
		.optional()
		.describe(
			'The account password. Tapfiliate generates one and returns it when this is omitted.',
		),
	firstname: z.string().optional().describe("The affiliate's first name."),
	lastname: z.string().optional().describe("The affiliate's last name."),
	company: z
		.object({
			name: z.string().optional(),
			description: z.string().optional(),
		})
		.optional()
		.describe("The affiliate's company."),
	// Tapfiliate saves the address only when all four of these are present and
	// silently ignores a partial one, so the requirement is enforced here.
	address: z
		.object({
			address: z.string(),
			postal_code: z.string(),
			city: z.string(),
			country: z.object({ code: z.string() }).loose(),
			address_two: z.string().optional(),
			state: z.string().optional(),
		})
		.optional()
		.describe(
			'The address. `address`, `postal_code`, `city` and `country.code` are required together, because Tapfiliate drops a partial address without an error.',
		),
	custom_fields: z
		.record(z.string(), z.string())
		.optional()
		.describe(
			'Custom field values keyed by the field ID from `affiliates.customFields`.',
		),
});

export type AffiliatesCreateInput = z.input<typeof AffiliatesCreateInputSchema>;

// Tapfiliate returns the created affiliate plus a `password` when it generated
// one, so the password is typed here rather than left off the output.
export const AffiliatesCreateResponseSchema = AffiliateSchema.extend({
	password: z.string().nullish(),
});

export type AffiliatesCreateResponse = z.infer<
	typeof AffiliatesCreateResponseSchema
>;

export const AffiliatesRemoveInputSchema = z.object({
	affiliateId: AffiliateIdSchema,
});

export type AffiliatesRemoveInput = z.infer<typeof AffiliatesRemoveInputSchema>;

export const AffiliatesBalancesInputSchema = z.object({
	affiliateId: AffiliateIdSchema,
});

export type AffiliatesBalancesInput = z.infer<
	typeof AffiliatesBalancesInputSchema
>;

export const AffiliatesBalancesResponseSchema = BalancesSchema;

export type AffiliatesBalancesResponse = z.infer<
	typeof AffiliatesBalancesResponseSchema
>;

export const AffiliatesPaymentsInputSchema = z.object({
	affiliateId: AffiliateIdSchema,
});

export type AffiliatesPaymentsInput = z.infer<
	typeof AffiliatesPaymentsInputSchema
>;

export const AffiliatesPaymentsResponseSchema = z.array(PaymentSchema);

export type AffiliatesPaymentsResponse = z.infer<
	typeof AffiliatesPaymentsResponseSchema
>;

export const AffiliatesProgramsInputSchema = z.object({
	affiliateId: AffiliateIdSchema,
});

export type AffiliatesProgramsInput = z.infer<
	typeof AffiliatesProgramsInputSchema
>;

export const AffiliatesProgramsResponseSchema = z.array(AffiliationSchema);

export type AffiliatesProgramsResponse = z.infer<
	typeof AffiliatesProgramsResponseSchema
>;

export const AffiliatesCustomFieldsInputSchema = z.object({});

export type AffiliatesCustomFieldsInput = z.infer<
	typeof AffiliatesCustomFieldsInputSchema
>;

export const CustomFieldSchema = z
	.object({
		id: z.string(),
		title: z.string().nullish(),
		// A custom field's choices are plain strings when the field is a select.
		choices: z.array(z.string()).nullish(),
	})
	.loose();

export const AffiliatesCustomFieldsResponseSchema = z.array(CustomFieldSchema);

export type AffiliatesCustomFieldsResponse = z.infer<
	typeof AffiliatesCustomFieldsResponseSchema
>;

// ── programs ──────────────────────────────────────────────────────────────

export const ProgramsListInputSchema = z.object({
	page: PageSchema,
	asset_id: z
		.string()
		.optional()
		.describe(
			'An `<id>-<secret>` asset ID from a tracking link. Tapfiliate returns only the program that owns it, or every program when the value is not in that two-part form.',
		),
});

export type ProgramsListInput = z.infer<typeof ProgramsListInputSchema>;

export const ProgramsListResponseSchema = z.array(ProgramSchema);

export type ProgramsListResponse = z.infer<typeof ProgramsListResponseSchema>;

export const ProgramsGetInputSchema = z.object({ programId: ProgramIdSchema });

export type ProgramsGetInput = z.infer<typeof ProgramsGetInputSchema>;

export const ProgramsGetResponseSchema = ProgramSchema;

export type ProgramsGetResponse = z.infer<typeof ProgramsGetResponseSchema>;

export const ProgramsAffiliatesInputSchema = z.object({
	programId: ProgramIdSchema,
	page: PageSchema,
	source_id: z.string().optional(),
	email: z.string().optional(),
	parent_id: z.string().optional(),
	group_id: z.string().optional(),
});

export type ProgramsAffiliatesInput = z.infer<
	typeof ProgramsAffiliatesInputSchema
>;

/**
 * A program affiliate adds the program-specific fields to the affiliate
 * record: its coupon, whether it is approved (`null` while pending) and when
 * it joined.
 */
const ProgramAffiliateSchema = AffiliateSchema.extend({
	coupon: z.string().nullish(),
	approved: z.boolean().nullish(),
	applied_at: z.string().nullish(),
	referral_link: ReferralLinkSchema.nullish(),
});

export type TapfiliateProgramAffiliate = z.infer<typeof ProgramAffiliateSchema>;

export const ProgramsAffiliatesResponseSchema = z.array(ProgramAffiliateSchema);

export type ProgramsAffiliatesResponse = z.infer<
	typeof ProgramsAffiliatesResponseSchema
>;

export const ProgramsAddAffiliateInputSchema = z.object({
	programId: ProgramIdSchema,
	affiliateId: AffiliateIdSchema,
	approved: z
		.boolean()
		.nullable()
		.optional()
		.describe(
			'The approval state: true approves, false disapproves, and `null` leaves it pending. Tapfiliate approves by default and does not apply the program auto-approve setting.',
		),
	coupon: z
		.string()
		.optional()
		.describe(
			'A coupon for this affiliate. It must be unique across all programs.',
		),
});

export type ProgramsAddAffiliateInput = z.input<
	typeof ProgramsAddAffiliateInputSchema
>;

export const ProgramsAddAffiliateResponseSchema = ProgramAffiliateSchema;

export type ProgramsAddAffiliateResponse = z.infer<
	typeof ProgramsAddAffiliateResponseSchema
>;

export const ProgramsGetAffiliateInputSchema = z.object({
	programId: ProgramIdSchema,
	affiliateId: AffiliateIdSchema,
});

export type ProgramsGetAffiliateInput = z.infer<
	typeof ProgramsGetAffiliateInputSchema
>;

export const ProgramsGetAffiliateResponseSchema = ProgramAffiliateSchema;

export type ProgramsGetAffiliateResponse = z.infer<
	typeof ProgramsGetAffiliateResponseSchema
>;

export const ProgramsUpdateAffiliateInputSchema = z.object({
	programId: ProgramIdSchema,
	affiliateId: AffiliateIdSchema,
	// `null` removes the coupon and leaving the field out changes nothing, so
	// the distinction matters and the value has to be optional AND nullable.
	coupon: z
		.string()
		.nullable()
		.optional()
		.describe(
			'The new coupon for this program. `null` removes it, and leaving the field out changes nothing. An empty string is rejected.',
		),
});

export type ProgramsUpdateAffiliateInput = z.input<
	typeof ProgramsUpdateAffiliateInputSchema
>;

export const ProgramsUpdateAffiliateResponseSchema = ProgramAffiliateSchema;

export type ProgramsUpdateAffiliateResponse = z.infer<
	typeof ProgramsUpdateAffiliateResponseSchema
>;

export const ProgramsAffiliateApprovalInputSchema = z.object({
	programId: ProgramIdSchema,
	affiliateId: AffiliateIdSchema,
});

export type ProgramsAffiliateApprovalInput = z.infer<
	typeof ProgramsAffiliateApprovalInputSchema
>;

export const ProgramsAffiliateApprovalResponseSchema = ProgramAffiliateSchema;

export type ProgramsAffiliateApprovalResponse = z.infer<
	typeof ProgramsAffiliateApprovalResponseSchema
>;

// ── conversions ───────────────────────────────────────────────────────────

/**
 * Tapfiliate attributes a conversion through one of these references. The docs
 * rank them (coupon, click id, referral code, asset id plus source id,
 * tracking id) and say at least one is required, which `.superRefine` enforces
 * so a request cannot fail at the provider.
 */
const TrackingReferenceShape = {
	referral_code: z
		.string()
		.optional()
		.describe("An affiliate's referral code, the `ref=` value in their link."),
	tracking_id: z
		.string()
		.optional()
		.describe('The tracking ID from the Tapfiliate JavaScript library.'),
	click_id: z.string().optional().describe('A click ID from `clicks.create`.'),
	coupon: z.string().optional().describe('A coupon code to attribute by.'),
	asset_id: z.string().optional().describe('The tracking asset ID.'),
	source_id: z
		.string()
		.optional()
		.describe('The click source ID. Pair it with `asset_id`.'),
} as const;

function requireTrackingReference(
	value: {
		referral_code?: string;
		tracking_id?: string;
		click_id?: string;
		coupon?: string;
		asset_id?: string;
		source_id?: string;
	},
	ctx: z.RefinementCtx,
) {
	const hasOne =
		value.referral_code !== undefined ||
		value.tracking_id !== undefined ||
		value.click_id !== undefined ||
		value.coupon !== undefined ||
		value.asset_id !== undefined;
	if (!hasOne) {
		ctx.addIssue({
			code: 'custom',
			message:
				'Provide at least one tracking reference: coupon, click_id, referral_code, asset_id or tracking_id.',
			path: ['referral_code'],
		});
	}
	if (value.source_id !== undefined && value.asset_id === undefined) {
		ctx.addIssue({
			code: 'custom',
			message: 'source_id is only read together with asset_id.',
			path: ['source_id'],
		});
	}
}

export const ConversionsListInputSchema = z.object({
	page: PageSchema,
	program_id: z.string().optional(),
	external_id: z.string().optional(),
	affiliate_id: z.string().optional(),
	pending: z
		.boolean()
		.optional()
		.describe('Only conversions that have at least one pending commission.'),
	date_from: IsoDateSchema.optional(),
	date_to: IsoDateSchema.optional(),
	use_profile_timezone: z
		.boolean()
		.optional()
		.describe("Read the dates in the account's timezone instead of UTC."),
});

export type ConversionsListInput = z.infer<typeof ConversionsListInputSchema>;

export const ConversionsListResponseSchema = z.array(ConversionSchema);

export type ConversionsListResponse = z.infer<
	typeof ConversionsListResponseSchema
>;

export const ConversionsGetInputSchema = z.object({
	conversionId: ConversionIdSchema,
});

export type ConversionsGetInput = z.infer<typeof ConversionsGetInputSchema>;

export const ConversionsGetResponseSchema = ConversionSchema;

export type ConversionsGetResponse = z.infer<
	typeof ConversionsGetResponseSchema
>;

export const ConversionsCreateInputSchema = z
	.object({
		...TrackingReferenceShape,
		amount: z.number().describe('The conversion amount.'),
		currency: z
			.string()
			.optional()
			.describe('The three-letter ISO currency code.'),
		external_id: z
			.string()
			.optional()
			.describe('An ID meaningful to you, such as an order number.'),
		customer_id: z
			.string()
			.optional()
			.describe('The `cu_...` customer to attribute the conversion to.'),
		commissions: z
			.array(
				z
					.object({
						sub_amount: z.number(),
						commission_type: z.string().optional(),
						comment: z.string().optional(),
					})
					.loose(),
			)
			.optional()
			.describe(
				'One commission per entry, whose `sub_amount`s must add up to `amount`. When omitted, Tapfiliate creates the single commission the program defines.',
			),
		meta_data: z
			.record(z.string(), z.string())
			.optional()
			.describe('Up to 40 key/value pairs.'),
	})
	.superRefine(requireTrackingReference);

export type ConversionsCreateInput = z.input<
	typeof ConversionsCreateInputSchema
>;

export const ConversionsCreateResponseSchema = ConversionSchema;

export type ConversionsCreateResponse = z.infer<
	typeof ConversionsCreateResponseSchema
>;

export const ConversionsUpdateInputSchema = z
	.object({
		conversionId: ConversionIdSchema,
		amount: z.number().optional().describe('The new conversion amount.'),
		external_id: z.string().optional(),
		meta_data: z
			.record(z.string(), z.string())
			.optional()
			.describe('Replaces the whole set. Up to 40 keys.'),
		recalculate_commissions: z
			.boolean()
			.optional()
			.describe(
				'Recalculate the commission amounts from the new amount. Without this, `amount` changes but the commissions do not.',
			),
	})
	.superRefine((value, ctx) => {
		if (value.recalculate_commissions === true && value.amount === undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'recalculate_commissions needs an amount to recalculate from.',
				path: ['recalculate_commissions'],
			});
		}
	});

export type ConversionsUpdateInput = z.input<
	typeof ConversionsUpdateInputSchema
>;

export const ConversionsUpdateResponseSchema = ConversionSchema;

export type ConversionsUpdateResponse = z.infer<
	typeof ConversionsUpdateResponseSchema
>;

export const ConversionsRemoveInputSchema = z.object({
	conversionId: ConversionIdSchema,
});

export type ConversionsRemoveInput = z.infer<
	typeof ConversionsRemoveInputSchema
>;

// ── commissions ───────────────────────────────────────────────────────────

export const CommissionsListInputSchema = z.object({
	page: PageSchema,
	affiliate_id: z.string().optional(),
	status: z.string().optional().describe('Only commissions in this status.'),
	paid: z
		.boolean()
		.optional()
		.describe('Only paid, or only unpaid commissions.'),
});

export type CommissionsListInput = z.infer<typeof CommissionsListInputSchema>;

export const CommissionsListResponseSchema = z.array(CommissionSchema);

export type CommissionsListResponse = z.infer<
	typeof CommissionsListResponseSchema
>;

export const CommissionsGetInputSchema = z.object({
	commissionId: CommissionIdSchema,
});

export type CommissionsGetInput = z.infer<typeof CommissionsGetInputSchema>;

export const CommissionsGetResponseSchema = CommissionSchema;

export type CommissionsGetResponse = z.infer<
	typeof CommissionsGetResponseSchema
>;

export const CommissionsUpdateInputSchema = z.object({
	commissionId: CommissionIdSchema,
	amount: z.number().optional().describe('The new commission amount.'),
	comment: z.string().optional().describe('A comment on the commission.'),
});

export type CommissionsUpdateInput = z.input<
	typeof CommissionsUpdateInputSchema
>;

export const CommissionsUpdateResponseSchema = CommissionSchema;

export type CommissionsUpdateResponse = z.infer<
	typeof CommissionsUpdateResponseSchema
>;

export const CommissionsApproveInputSchema = z.object({
	commissionId: CommissionIdSchema,
});

export type CommissionsApproveInput = z.infer<
	typeof CommissionsApproveInputSchema
>;

export const CommissionsApproveResponseSchema = CommissionSchema;

export type CommissionsApproveResponse = z.infer<
	typeof CommissionsApproveResponseSchema
>;

export const CommissionsDisapproveInputSchema = z.object({
	commissionId: CommissionIdSchema,
});

export type CommissionsDisapproveInput = z.infer<
	typeof CommissionsDisapproveInputSchema
>;

export const CommissionsDisapproveResponseSchema = CommissionSchema;

export type CommissionsDisapproveResponse = z.infer<
	typeof CommissionsDisapproveResponseSchema
>;

// ── customers ─────────────────────────────────────────────────────────────

export const CustomersListInputSchema = z.object({
	page: PageSchema,
	program_id: z.string().optional(),
	customer_id: z.string().optional(),
	affiliate_id: z.string().optional(),
	date_from: IsoDateSchema.optional(),
	date_to: IsoDateSchema.optional(),
});

export type CustomersListInput = z.infer<typeof CustomersListInputSchema>;

export const CustomersListResponseSchema = z.array(CustomerSchema);

export type CustomersListResponse = z.infer<typeof CustomersListResponseSchema>;

export const CustomersGetInputSchema = z.object({
	customerId: CustomerIdSchema,
});

export type CustomersGetInput = z.infer<typeof CustomersGetInputSchema>;

export const CustomersGetResponseSchema = CustomerSchema;

export type CustomersGetResponse = z.infer<typeof CustomersGetResponseSchema>;

export const CustomersCreateInputSchema = z
	.object({
		...TrackingReferenceShape,
		customer_id: z
			.string()
			.min(1)
			.describe('Your own customer ID. It must be unique in the account.'),
	})
	.superRefine(requireTrackingReference);

export type CustomersCreateInput = z.input<typeof CustomersCreateInputSchema>;

export const CustomersCreateResponseSchema = CustomerSchema;

export type CustomersCreateResponse = z.infer<
	typeof CustomersCreateResponseSchema
>;

export const CustomersUpdateInputSchema = z.object({
	customerId: CustomerIdSchema,
	customer_id: z.string().optional().describe('The new customer ID.'),
	meta_data: z
		.record(z.string(), z.string())
		.optional()
		.describe('Replaces the whole set.'),
});

export type CustomersUpdateInput = z.input<typeof CustomersUpdateInputSchema>;

export const CustomersUpdateResponseSchema = CustomerSchema;

export type CustomersUpdateResponse = z.infer<
	typeof CustomersUpdateResponseSchema
>;

export const CustomersRemoveInputSchema = z.object({
	customerId: CustomerIdSchema,
});

export type CustomersRemoveInput = z.infer<typeof CustomersRemoveInputSchema>;

export const CustomersCancelInputSchema = z.object({
	customerId: CustomerIdSchema,
});

export type CustomersCancelInput = z.infer<typeof CustomersCancelInputSchema>;

export const CustomersCancelResponseSchema = CustomerSchema;

export type CustomersCancelResponse = z.infer<
	typeof CustomersCancelResponseSchema
>;

export const CustomersUncancelInputSchema = z.object({
	customerId: CustomerIdSchema,
});

export type CustomersUncancelInput = z.infer<
	typeof CustomersUncancelInputSchema
>;

export const CustomersUncancelResponseSchema = CustomerSchema;

export type CustomersUncancelResponse = z.infer<
	typeof CustomersUncancelResponseSchema
>;

// ── payments ──────────────────────────────────────────────────────────────

export const PaymentsListInputSchema = z.object({ page: PageSchema });

export type PaymentsListInput = z.infer<typeof PaymentsListInputSchema>;

export const PaymentsListResponseSchema = z.array(PaymentSchema);

export type PaymentsListResponse = z.infer<typeof PaymentsListResponseSchema>;

export const PaymentsGetInputSchema = z.object({ paymentId: PaymentIdSchema });

export type PaymentsGetInput = z.infer<typeof PaymentsGetInputSchema>;

export const PaymentsGetResponseSchema = PaymentSchema;

export type PaymentsGetResponse = z.infer<typeof PaymentsGetResponseSchema>;

export const PaymentsCreateInputSchema = z
	.union([
		z.object({
			affiliate_id: AffiliateIdSchema,
			amount: z.number().positive().describe('The payment amount, above 0.'),
			currency: z.string().min(1).describe('A currency Tapfiliate supports.'),
		}),
		z
			.array(
				z.object({
					affiliate_id: AffiliateIdSchema,
					amount: z.number().positive(),
					currency: z.string().min(1),
				}),
			)
			.min(1),
	])
	.describe(
		'One payment, or an array of payments. Tapfiliate creates none if any entry is invalid.',
	);

export type PaymentsCreateInput = z.input<typeof PaymentsCreateInputSchema>;

export const PaymentsCreateResponseSchema = z.array(PaymentSchema);

export type PaymentsCreateResponse = z.infer<
	typeof PaymentsCreateResponseSchema
>;

export const PaymentsCancelInputSchema = z.object({
	paymentId: PaymentIdSchema,
});

export type PaymentsCancelInput = z.infer<typeof PaymentsCancelInputSchema>;

// ── balances ──────────────────────────────────────────────────────────────

export const BalancesListInputSchema = z.object({
	page: PageSchema,
	include_fraud: z
		.boolean()
		.optional()
		.describe('Include balances held back for suspected fraud.'),
});

export type BalancesListInput = z.infer<typeof BalancesListInputSchema>;

export const AffiliateBalanceSchema = z
	.object({ affiliate_id: z.string(), balances: BalancesSchema })
	.loose();

export const BalancesListResponseSchema = z.array(AffiliateBalanceSchema);

export type BalancesListResponse = z.infer<typeof BalancesListResponseSchema>;

// ── clicks ────────────────────────────────────────────────────────────────

export const ClicksListInputSchema = z.object({
	page: PageSchema,
	program_id: z.string().optional(),
	affiliate_id: z.string().optional(),
	date_from: IsoDateSchema.optional(),
	date_to: IsoDateSchema.optional(),
	meta_data: z.string().optional().describe('Filter by click meta data.'),
});

export type ClicksListInput = z.infer<typeof ClicksListInputSchema>;

export const ClickSchema = z
	.object({
		id: z.string(),
		created_at: z.string().nullish(),
		meta_data: z
			.array(
				z
					.object({ key: z.string().nullish(), value: z.string().nullish() })
					.loose(),
			)
			.nullish(),
		details: z.record(z.string(), z.string()).nullish(),
	})
	.loose();

export const ClicksListResponseSchema = z.array(ClickSchema);

export type ClicksListResponse = z.infer<typeof ClicksListResponseSchema>;

export const ClicksCreateInputSchema = z
	.object({
		...TrackingReferenceShape,
		ip: z.string().optional().describe('Stored as sent.'),
		user_agent: z.string().optional().describe('Stored as sent.'),
		referrer: z.string().optional().describe('Stored as sent.'),
		landing_page: z.string().optional().describe('Stored as sent.'),
	})
	.superRefine(requireTrackingReference);

export type ClicksCreateInput = z.input<typeof ClicksCreateInputSchema>;

// The docs say a click create answers `{ id }` and nothing else.
export const ClicksCreateResponseSchema = z.object({ id: z.string() }).loose();

export type ClicksCreateResponse = z.infer<typeof ClicksCreateResponseSchema>;

export const ClicksGetInputSchema = z.object({ clickId: ClickIdSchema });

export type ClicksGetInput = z.infer<typeof ClicksGetInputSchema>;

export const ClicksGetResponseSchema = ClickSchema.extend({
	affiliate: AffiliateNameSchema.nullish(),
	program: ProgramRefSchema.nullish(),
	asset_id: z.string().nullish(),
	source_id: z.string().nullish(),
});

export type ClicksGetResponse = z.infer<typeof ClicksGetResponseSchema>;

// ── registry ──────────────────────────────────────────────────────────────

export type TapfiliateEndpointInputs = {
	affiliatesList: AffiliatesListInput;
	affiliatesGet: AffiliatesGetInput;
	affiliatesCreate: AffiliatesCreateInput;
	affiliatesRemove: AffiliatesRemoveInput;
	affiliatesBalances: AffiliatesBalancesInput;
	affiliatesPayments: AffiliatesPaymentsInput;
	affiliatesPrograms: AffiliatesProgramsInput;
	affiliatesCustomFields: AffiliatesCustomFieldsInput;
	programsList: ProgramsListInput;
	programsGet: ProgramsGetInput;
	programsAffiliates: ProgramsAffiliatesInput;
	programsAddAffiliate: ProgramsAddAffiliateInput;
	programsGetAffiliate: ProgramsGetAffiliateInput;
	programsUpdateAffiliate: ProgramsUpdateAffiliateInput;
	programsApproveAffiliate: ProgramsAffiliateApprovalInput;
	programsDisapproveAffiliate: ProgramsAffiliateApprovalInput;
	conversionsList: ConversionsListInput;
	conversionsGet: ConversionsGetInput;
	conversionsCreate: ConversionsCreateInput;
	conversionsUpdate: ConversionsUpdateInput;
	conversionsRemove: ConversionsRemoveInput;
	commissionsList: CommissionsListInput;
	commissionsGet: CommissionsGetInput;
	commissionsUpdate: CommissionsUpdateInput;
	commissionsApprove: CommissionsApproveInput;
	commissionsDisapprove: CommissionsDisapproveInput;
	customersList: CustomersListInput;
	customersGet: CustomersGetInput;
	customersCreate: CustomersCreateInput;
	customersUpdate: CustomersUpdateInput;
	customersRemove: CustomersRemoveInput;
	customersCancel: CustomersCancelInput;
	customersUncancel: CustomersUncancelInput;
	paymentsList: PaymentsListInput;
	paymentsGet: PaymentsGetInput;
	paymentsCreate: PaymentsCreateInput;
	paymentsCancel: PaymentsCancelInput;
	balancesList: BalancesListInput;
	clicksList: ClicksListInput;
	clicksCreate: ClicksCreateInput;
	clicksGet: ClicksGetInput;
};

export type TapfiliateEndpointOutputs = {
	affiliatesList: AffiliatesListResponse;
	affiliatesGet: AffiliatesGetResponse;
	affiliatesCreate: AffiliatesCreateResponse;
	affiliatesRemove: DeletedResponse;
	affiliatesBalances: AffiliatesBalancesResponse;
	affiliatesPayments: AffiliatesPaymentsResponse;
	affiliatesPrograms: AffiliatesProgramsResponse;
	affiliatesCustomFields: AffiliatesCustomFieldsResponse;
	programsList: ProgramsListResponse;
	programsGet: ProgramsGetResponse;
	programsAffiliates: ProgramsAffiliatesResponse;
	programsAddAffiliate: ProgramsAddAffiliateResponse;
	programsGetAffiliate: ProgramsGetAffiliateResponse;
	programsUpdateAffiliate: ProgramsUpdateAffiliateResponse;
	programsApproveAffiliate: ProgramsAffiliateApprovalResponse;
	programsDisapproveAffiliate: ProgramsAffiliateApprovalResponse;
	conversionsList: ConversionsListResponse;
	conversionsGet: ConversionsGetResponse;
	conversionsCreate: ConversionsCreateResponse;
	conversionsUpdate: ConversionsUpdateResponse;
	conversionsRemove: DeletedResponse;
	commissionsList: CommissionsListResponse;
	commissionsGet: CommissionsGetResponse;
	commissionsUpdate: CommissionsUpdateResponse;
	commissionsApprove: CommissionsApproveResponse;
	commissionsDisapprove: CommissionsDisapproveResponse;
	customersList: CustomersListResponse;
	customersGet: CustomersGetResponse;
	customersCreate: CustomersCreateResponse;
	customersUpdate: CustomersUpdateResponse;
	customersRemove: DeletedResponse;
	customersCancel: CustomersCancelResponse;
	customersUncancel: CustomersUncancelResponse;
	paymentsList: PaymentsListResponse;
	paymentsGet: PaymentsGetResponse;
	paymentsCreate: PaymentsCreateResponse;
	paymentsCancel: DeletedResponse;
	balancesList: BalancesListResponse;
	clicksList: ClicksListResponse;
	clicksCreate: ClicksCreateResponse;
	clicksGet: ClicksGetResponse;
};

export const TapfiliateEndpointInputSchemas = {
	affiliatesList: AffiliatesListInputSchema,
	affiliatesGet: AffiliatesGetInputSchema,
	affiliatesCreate: AffiliatesCreateInputSchema,
	affiliatesRemove: AffiliatesRemoveInputSchema,
	affiliatesBalances: AffiliatesBalancesInputSchema,
	affiliatesPayments: AffiliatesPaymentsInputSchema,
	affiliatesPrograms: AffiliatesProgramsInputSchema,
	affiliatesCustomFields: AffiliatesCustomFieldsInputSchema,
	programsList: ProgramsListInputSchema,
	programsGet: ProgramsGetInputSchema,
	programsAffiliates: ProgramsAffiliatesInputSchema,
	programsAddAffiliate: ProgramsAddAffiliateInputSchema,
	programsGetAffiliate: ProgramsGetAffiliateInputSchema,
	programsUpdateAffiliate: ProgramsUpdateAffiliateInputSchema,
	programsApproveAffiliate: ProgramsAffiliateApprovalInputSchema,
	programsDisapproveAffiliate: ProgramsAffiliateApprovalInputSchema,
	conversionsList: ConversionsListInputSchema,
	conversionsGet: ConversionsGetInputSchema,
	conversionsCreate: ConversionsCreateInputSchema,
	conversionsUpdate: ConversionsUpdateInputSchema,
	conversionsRemove: ConversionsRemoveInputSchema,
	commissionsList: CommissionsListInputSchema,
	commissionsGet: CommissionsGetInputSchema,
	commissionsUpdate: CommissionsUpdateInputSchema,
	commissionsApprove: CommissionsApproveInputSchema,
	commissionsDisapprove: CommissionsDisapproveInputSchema,
	customersList: CustomersListInputSchema,
	customersGet: CustomersGetInputSchema,
	customersCreate: CustomersCreateInputSchema,
	customersUpdate: CustomersUpdateInputSchema,
	customersRemove: CustomersRemoveInputSchema,
	customersCancel: CustomersCancelInputSchema,
	customersUncancel: CustomersUncancelInputSchema,
	paymentsList: PaymentsListInputSchema,
	paymentsGet: PaymentsGetInputSchema,
	paymentsCreate: PaymentsCreateInputSchema,
	paymentsCancel: PaymentsCancelInputSchema,
	balancesList: BalancesListInputSchema,
	clicksList: ClicksListInputSchema,
	clicksCreate: ClicksCreateInputSchema,
	clicksGet: ClicksGetInputSchema,
} as const;

export const TapfiliateEndpointOutputSchemas = {
	affiliatesList: AffiliatesListResponseSchema,
	affiliatesGet: AffiliatesGetResponseSchema,
	affiliatesCreate: AffiliatesCreateResponseSchema,
	affiliatesRemove: DeletedResponseSchema,
	affiliatesBalances: AffiliatesBalancesResponseSchema,
	affiliatesPayments: AffiliatesPaymentsResponseSchema,
	affiliatesPrograms: AffiliatesProgramsResponseSchema,
	affiliatesCustomFields: AffiliatesCustomFieldsResponseSchema,
	programsList: ProgramsListResponseSchema,
	programsGet: ProgramsGetResponseSchema,
	programsAffiliates: ProgramsAffiliatesResponseSchema,
	programsAddAffiliate: ProgramsAddAffiliateResponseSchema,
	programsGetAffiliate: ProgramsGetAffiliateResponseSchema,
	programsUpdateAffiliate: ProgramsUpdateAffiliateResponseSchema,
	programsApproveAffiliate: ProgramsAffiliateApprovalResponseSchema,
	programsDisapproveAffiliate: ProgramsAffiliateApprovalResponseSchema,
	conversionsList: ConversionsListResponseSchema,
	conversionsGet: ConversionsGetResponseSchema,
	conversionsCreate: ConversionsCreateResponseSchema,
	conversionsUpdate: ConversionsUpdateResponseSchema,
	conversionsRemove: DeletedResponseSchema,
	commissionsList: CommissionsListResponseSchema,
	commissionsGet: CommissionsGetResponseSchema,
	commissionsUpdate: CommissionsUpdateResponseSchema,
	commissionsApprove: CommissionsApproveResponseSchema,
	commissionsDisapprove: CommissionsDisapproveResponseSchema,
	customersList: CustomersListResponseSchema,
	customersGet: CustomersGetResponseSchema,
	customersCreate: CustomersCreateResponseSchema,
	customersUpdate: CustomersUpdateResponseSchema,
	customersRemove: DeletedResponseSchema,
	customersCancel: CustomersCancelResponseSchema,
	customersUncancel: CustomersUncancelResponseSchema,
	paymentsList: PaymentsListResponseSchema,
	paymentsGet: PaymentsGetResponseSchema,
	paymentsCreate: PaymentsCreateResponseSchema,
	paymentsCancel: DeletedResponseSchema,
	balancesList: BalancesListResponseSchema,
	clicksList: ClicksListResponseSchema,
	clicksCreate: ClicksCreateResponseSchema,
	clicksGet: ClicksGetResponseSchema,
} as const;
