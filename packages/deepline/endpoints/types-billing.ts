import { z } from 'zod';

// Deepline SDK client-core billing methods (deepline CLI bundle, 2026-11-17)
// plus live GET reads of the same paths. Money-moving inputs require a
// caller-owned idempotency key so a retry can never become a second charge.

const nullableString = z.union([z.string(), z.null()]).nullish();
const nullableNumber = z.union([z.number(), z.null()]).nullish();

/** The SDK's billing key rule: 1-200 chars, no surrounding whitespace, header-safe. */
export const BillingIdempotencyKeySchema = z
	.string()
	.min(1)
	.max(200)
	.regex(/^[\x21-\x7e](?:[\x20-\x7e]*[\x21-\x7e])?$/, {
		message:
			'Idempotency key must be printable ASCII with no leading or trailing whitespace',
	});
function idempotencyKey(description: string) {
	return BillingIdempotencyKeySchema.describe(description);
}
const NEW_KEY_DESCRIPTION =
	'Required caller-owned key, 1-200 printable ASCII characters with no surrounding whitespace (a UUID works). Persist it before calling. Retrying with the same key and the same input replays the original operation instead of charging again; never generate a fresh key to retry an uncertain call.';

const PositiveCreditsSchema = z.number().int().positive().max(9007199254740991);

export const BillingOperationSchema = z.looseObject({
	id: z.string(),
	state: z.string(),
	version: z.number(),
	next_action: nullableString,
});
/** Durable commercial operation envelope shared by purchases and plan changes. */
export const BillingMutationResultSchema = z.looseObject({
	data: z.record(z.string(), z.unknown()),
	operation: BillingOperationSchema,
	request_id: z.string().nullish(),
});

// ---- Reads -----------------------------------------------------------------

export const GetBillingCatalogInputSchema = z.strictObject({});
export const GetBillingCatalogOutputSchema = z.looseObject({
	catalog_id: z.string(),
	catalog_version: z.string(),
	active_plan: z.looseObject({
		plan_family_id: z.string(),
		plan_version_id: z.string(),
		public_name: z.string(),
		display_name: z.string().nullish(),
		rate_card_id: z.string().nullish(),
		assigned_by: z.string().nullish(),
		assigned_at: nullableString,
		has_subscription: z.boolean().nullish(),
	}),
	plans: z.array(
		z.looseObject({
			plan_family_id: z.string(),
			plan_version_id: z.string(),
			public_name: z.string(),
			display_name: z.string().nullish(),
			price_usd: nullableNumber,
			price_interval: nullableString,
			monthly_grant_credits: z.number(),
			rollover: z
				.looseObject({ mode: z.string(), max_credits: z.number().nullish() })
				.nullish(),
			acquirable: z.boolean(),
		}),
	),
	meters: z
		.array(z.looseObject({ id: z.string(), name: z.string() }))
		.nullish(),
});

export const GetBillingPlansInputSchema = z.strictObject({
	promo_code: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Optional plan promo code to evaluate; the response reports its status (applied, unknown, expired, already_redeemed, unavailable). Reading never redeems it.',
		),
});
export const GetBillingPlansOutputSchema = z.looseObject({
	org_id: z.string(),
	plans: z.array(
		z.looseObject({
			sku: z.string(),
			name: z.string(),
			display_name: z.string().nullish(),
			recurring_price_usd: z.number(),
			first_month_price_usd: nullableNumber,
			bonus_credits: nullableNumber,
			interval: z.string(),
			included_credits: z.number(),
			benefits: z.record(z.string(), z.unknown()).nullish(),
			purchased_credit_price_usd: z.number(),
			acquisition_enabled: z.boolean(),
		}),
	),
	current_plan_sku: z.string(),
	pending_plan_sku: nullableString,
	pending_plan_display_name: nullableString,
	acquisition_enabled: z.boolean(),
	enabled_offer_keys: z.array(z.string()).nullish(),
	promo_code: z
		.union([
			z.looseObject({
				code: z.string(),
				status: z.string(),
				plan_skus: z.array(z.string()),
				expires_at: nullableString,
			}),
			z.null(),
		])
		.nullish(),
});

export const GetBillingStatusInputSchema = z.strictObject({});
export const GetBillingStatusOutputSchema = z.looseObject({
	org_id: z.string(),
	plan: z.looseObject({
		sku: z.string(),
		name: z.string(),
		display_name: z.string().nullish(),
		recurring_price_usd: nullableNumber,
		interval: nullableString,
		included_credits: nullableNumber,
	}),
	state: z.string(),
	changes_allowed: z.boolean(),
	payment_state: z.string(),
	recharge_state: z.string(),
	billing_email: nullableString,
	billing_address: z
		.union([z.record(z.string(), z.unknown()), z.null()])
		.nullish(),
	collection_method: z.string().nullish(),
	payment_access_policy: z.string().nullish(),
	plan_invoice: z
		.union([z.record(z.string(), z.unknown()), z.null()])
		.nullish(),
	outstanding_invoice: z
		.union([z.record(z.string(), z.unknown()), z.null()])
		.nullish(),
	next_action: nullableString,
	pending_plan_sku: nullableString,
	pending_plan_starts_at: nullableString,
	current_period_end: nullableString,
	as_of: nullableString,
});

export const GetBillingSubscriptionStatusInputSchema = z.strictObject({});
export const GetBillingSubscriptionStatusOutputSchema = z.looseObject({
	org_id: z.string(),
	plan_version_id: z.string(),
	plan_name: z.string(),
	plan_display_name: z.string().nullish(),
	plan_family_id: z.string(),
	subscribed: z.boolean(),
	price_usd: nullableNumber,
	price_interval: nullableString,
	monthly_grant_credits: z.number(),
	assigned_by: z.string().nullish(),
	assigned_at: nullableString,
	credit_pools: z.array(
		z.looseObject({
			grant_id: z.string().nullish(),
			pool: z.string(),
			credits_remaining: z.number(),
			credits_granted: z.number(),
			source: z.string(),
			cycle_key: nullableString,
			effective_at: z.string(),
		}),
	),
	pooled_credits_remaining: z.number(),
	current_period_end: nullableString,
	cancel_at_period_end: z.union([z.boolean(), z.null()]).nullish(),
	stripe_status: nullableString,
});

export const ListBillingInvoicesInputSchema = z.strictObject({
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Maximum entries, 1-100; the server default is 24.'),
});
export const ListBillingInvoicesOutputSchema = z.looseObject({
	org_id: z.string(),
	entries: z.array(
		z.looseObject({
			kind: z.string(),
			id: z.string(),
			created_at: z.string(),
			description: z.string(),
			amount_cents: z.number(),
			currency: z.string(),
			status: z.string(),
			url: nullableString,
			pdf_url: nullableString,
			invoice_url: nullableString,
			receipt_url: nullableString,
		}),
	),
});

export const BillingAutoRechargeSchema = z.looseObject({
	org_id: z.string(),
	enabled: z.boolean(),
	available: z.boolean(),
	reason: nullableString,
	threshold_credits: nullableNumber,
	refill_to_credits: nullableNumber,
	rolling_limit_cents: nullableNumber,
	purchase_limit_cents: nullableNumber,
	purchase_limit_credits: nullableNumber,
	rolling_committed_cents: z.number().nullish(),
	rolling_committed_credits: z.number().nullish(),
});
export const GetBillingAutoRechargeInputSchema = z.strictObject({});
export const GetBillingAutoRechargeOutputSchema = BillingAutoRechargeSchema;

const UsageEventFieldsSchema = {
	id: nullableString,
	provider: z.string(),
	operation: z.string(),
	status: z.string(),
	request_id: z.string(),
	billing_outcome_reason: nullableString,
	credits: nullableNumber,
	billing_mode: nullableString,
	pricing_model: nullableString,
	policy_id: nullableString,
	created_at: z.string(),
	run_id: nullableString,
	charge_state: z.unknown().optional(),
	charge_finality: z.unknown().optional(),
};
export const ListBillingUsageEventsInputSchema = z
	.strictObject({
		request_id: z
			.string()
			.min(1)
			.max(200)
			.regex(/^\S(?:.*\S)?$/)
			.optional()
			.describe(
				'Exact lookup of one execution by the request_id/job_id from a tool execution, 1-200 characters. Cannot be combined with limit, cursor or run_id. An unknown request_id is a 404 error.',
			),
		limit: z
			.number()
			.int()
			.min(1)
			.max(500)
			.optional()
			.describe('Page size, 1-500; the server default is 200.'),
		cursor: z
			.string()
			.min(1)
			.optional()
			.describe(
				'Opaque next_cursor from the preceding page. Follow next_cursor until it is null, even when a page is empty.',
			),
		run_id: z
			.string()
			.min(1)
			.optional()
			.describe('Only events attributed to this exact public run ID.'),
	})
	.refine(
		(v) =>
			v.request_id === undefined ||
			(v.limit === undefined &&
				v.cursor === undefined &&
				v.run_id === undefined),
		{ message: 'request_id cannot be combined with limit, cursor or run_id' },
	);
export const ListBillingUsageEventsOutputSchema = z.looseObject({
	org_id: z.string(),
	run_id: nullableString,
	next_cursor: nullableString,
	entries: z.array(z.looseObject(UsageEventFieldsSchema)),
});

export const GetBillingIncludedComputeInputSchema = z.strictObject({
	include_overage: z
		.boolean()
		.optional()
		.describe(
			'true also returns overage_credits: settled plan-rate sandbox credits paid beyond included compute this period.',
		),
});
export const GetBillingIncludedComputeOutputSchema = z.looseObject({
	status: z.string(),
	credits_per_minute: nullableNumber,
	included_minutes: z.number(),
	plan: z.looseObject({
		included_minutes: z.number(),
		credits_per_minute: z.number(),
	}),
	period_start_at: z.string(),
	period_end_at: z.string(),
	resets_on: z.string(),
	included_minutes_used: z.number(),
	included_credits_used: z.number().nullish(),
	overage_credits: z.number().nullish(),
	minutes_used: z.number(),
	days: z.array(z.looseObject({ day: z.string(), minutes: z.number() })),
});

export const GetBillingQuoteInputSchema = z.strictObject({
	quantity: z
		.number()
		.int()
		.positive()
		.describe('Number of Play sandbox sessions to quote.'),
	sandbox_runtime: z
		.strictObject({
			timeout: z
				.string()
				.regex(/^\d+\s*[mh]$/i)
				.optional()
				.describe('Session timeout such as 30m or 2h; defaults to 30m.'),
			size: z
				.enum(['standard', 'large', 'xlarge', '1gb', '4gb', '8gb'])
				.optional()
				.describe('Sandbox size profile; defaults to standard.'),
		})
		.optional()
		.describe('Runtime declaration for each session; omit for defaults.'),
});
export const GetBillingQuoteOutputSchema = z.looseObject({
	scope: z.string(),
	quantity: z.number(),
	resources: z.looseObject({
		timeoutSeconds: z.number(),
		memoryGiB: z.number(),
		cpu: z.number(),
		diskGiB: z.number(),
	}),
	maximum_backend: z.string().nullish(),
	priced_backends: z.array(z.string()).nullish(),
	maximum_credits: z.number(),
	maximum_billing_seconds: z.number(),
	total_play_credits: nullableNumber,
	total_budget_supported: z.boolean().nullish(),
	unbounded_components: z.array(z.string()),
	explanation: z.string(),
	plan_version_id: z.string().nullish(),
	rate_card_id: z.string().nullish(),
});

// ---- Writes ----------------------------------------------------------------

export const CancelBillingSubscriptionInputSchema = z.strictObject({
	action: z
		.enum(['cancel', 'undo_cancel'])
		.describe(
			'cancel schedules cancellation at the end of the paid period (credits are kept); undo_cancel reverses a pending cancellation before the period ends.',
		),
});
export const CancelBillingSubscriptionOutputSchema = z.looseObject({
	org_id: z.string(),
	subscription_id: z.string(),
	cancel_at_period_end: z.boolean(),
	current_period_end: nullableString,
	status: z.string(),
	message: z.string(),
});

export const UpdateBillingAutoRechargeInputSchema = z
	.strictObject({
		enabled: z
			.boolean()
			.describe(
				'true turns automatic recharge on (the saved card is charged whenever the balance drops below threshold_credits); false turns it off.',
			),
		threshold_credits: z
			.number()
			.int()
			.nonnegative()
			.optional()
			.describe(
				'Required when enabled is true: recharge when the balance drops below this many credits.',
			),
		refill_to_credits: z
			.number()
			.int()
			.positive()
			.optional()
			.describe(
				'Required when enabled is true: buy enough credits to bring the balance back to this amount.',
			),
		purchase_limit_credits: z
			.union([z.number().int().nonnegative(), z.null()])
			.optional()
			.describe(
				'Only with enabled true: maximum credits bought automatically over a rolling 30 days; 0 stops purchases, null removes the cap.',
			),
		idempotencyKey: idempotencyKey(NEW_KEY_DESCRIPTION),
	})
	.superRefine((v, issue) => {
		if (v.enabled) {
			if (
				v.threshold_credits === undefined ||
				v.refill_to_credits === undefined
			)
				issue.addIssue({
					code: 'custom',
					message:
						'threshold_credits and refill_to_credits are required when enabled is true',
				});
		} else if (
			v.threshold_credits !== undefined ||
			v.refill_to_credits !== undefined ||
			v.purchase_limit_credits !== undefined
		) {
			issue.addIssue({
				code: 'custom',
				message: 'Recharge settings are only accepted when enabled is true',
			});
		}
	});
export const UpdateBillingAutoRechargeOutputSchema = BillingAutoRechargeSchema;

export const TopUpBillingInputSchema = z.strictObject({
	credits: PositiveCreditsSchema.describe(
		'Deepline credits to buy and charge to the saved payment method.',
	),
	idempotencyKey: idempotencyKey(NEW_KEY_DESCRIPTION),
	receipt: z
		.boolean()
		.optional()
		.describe(
			'true requests a durable operation receipt (status pending or applied) instead of waiting for the charge result; a pending receipt does not mean payment or credits have landed.',
		),
});
const TopUpChargeSchema = z.looseObject({
	ok: z.literal(true),
	credits: z.number(),
	amount_cents: z.number(),
	currency: z.string(),
	balance: z.number(),
	stripe_payment_intent_id: z.string(),
	payment_method: z
		.union([z.record(z.string(), z.unknown()), z.null()])
		.nullish(),
});
export const TopUpBillingOutputSchema = z.union([
	z.looseObject({
		status: z.literal('pending'),
		operation_id: z.string(),
		operation_state: z.string(),
		requested_credits: z.number(),
		amount_cents: z.number(),
		currency: z.string(),
	}),
	z.looseObject({
		status: z.literal('applied'),
		operation_id: z.string(),
		operation_state: z.string(),
		applied_credits: z.number(),
		amount_cents: z.number(),
		currency: z.string(),
		balance: z.number().nullish(),
		stripe_payment_intent_id: z.string().nullish(),
	}),
	TopUpChargeSchema,
]);

export const CreateBillingCreditPurchaseInputSchema = z.strictObject({
	credits: PositiveCreditsSchema.describe(
		'Deepline credits to buy through the payment-gated commercial purchase flow.',
	),
	idempotencyKey: idempotencyKey(NEW_KEY_DESCRIPTION),
});
export const CreateBillingCreditPurchaseOutputSchema =
	BillingMutationResultSchema;

export const RecoverBillingCreditPurchaseInputSchema = z.strictObject({
	credits: PositiveCreditsSchema.describe(
		'The exact credit amount of the original purchase.',
	),
	org_id: z
		.string()
		.min(1)
		.regex(/^\S(?:.*\S)?$/)
		.describe(
			'The original workspace org_id; must match the authenticated workspace.',
		),
	idempotencyKey: idempotencyKey(
		'The ORIGINAL purchase idempotency key. Never generate a new key for recovery.',
	),
});
export const RecoverBillingCreditPurchaseOutputSchema =
	BillingMutationResultSchema;

export const CreateBillingPlanTransitionInputSchema = z
	.strictObject({
		action: z
			.enum(['start_or_change', 'cancel', 'undo_cancel'])
			.describe(
				'start_or_change starts or changes the plan; cancel ends it at period end; undo_cancel restores a pending cancellation.',
			),
		target_plan_sku: z
			.string()
			.min(1)
			.optional()
			.describe(
				'Required for start_or_change: plan SKU from billing.plans, e.g. payg-v1, builder-v1, growth-v1, team-v2.',
			),
		billing_email: z
			.string()
			.min(3)
			.optional()
			.describe('Only for start_or_change: billing email for plan invoices.'),
		promo_code: z
			.string()
			.min(1)
			.optional()
			.describe(
				'Only for start_or_change: plan promo code; an unknown, expired or used code refuses the change.',
			),
		idempotencyKey: idempotencyKey(NEW_KEY_DESCRIPTION),
	})
	.superRefine((v, issue) => {
		if (v.action === 'start_or_change') {
			if (!v.target_plan_sku)
				issue.addIssue({
					code: 'custom',
					message: 'target_plan_sku is required for start_or_change',
				});
		} else if (
			v.target_plan_sku !== undefined ||
			v.billing_email !== undefined ||
			v.promo_code !== undefined
		) {
			issue.addIssue({
				code: 'custom',
				message:
					'target_plan_sku, billing_email and promo_code only apply to start_or_change',
			});
		}
	});
export const CreateBillingPlanTransitionOutputSchema =
	BillingMutationResultSchema;

export const CreateBillingPortalSessionInputSchema = z.strictObject({
	flow: z
		.enum(['customer_update'])
		.optional()
		.describe(
			'customer_update opens the billing address editor directly; omit for the general portal (payment recovery and invoices).',
		),
});
export const CreateBillingPortalSessionOutputSchema = z.looseObject({
	url: z.url(),
});
