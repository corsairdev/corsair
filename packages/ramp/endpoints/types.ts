import { z } from 'zod';

/** True for a `YYYY-MM-DD` string that names a real day (no 2026-02-30). */
function isCalendarDate(value: string): boolean {
	const parsed = new Date(`${value}T00:00:00Z`);
	return (
		!Number.isNaN(parsed.getTime()) &&
		parsed.toISOString().slice(0, 10) === value
	);
}

/** Ramp pages cap at 100 and default to 20. */
export const RAMP_DEFAULT_PAGE_SIZE = 20;
export const RAMP_MAX_PAGE_SIZE = 100;

const PageSizeSchema = z
	.number()
	.int()
	.min(2)
	.max(RAMP_MAX_PAGE_SIZE)
	.optional()
	.describe(
		`Results per page, 2 to ${RAMP_MAX_PAGE_SIZE}. Defaults to ${RAMP_DEFAULT_PAGE_SIZE} when omitted.`,
	);

/**
 * Ramp's cursor is the id of the last record on the page, not an offset, so the
 * value is only meaningful for the same filter set that produced it.
 */
const StartSchema = z
	.string()
	.optional()
	.describe(
		'The id of the last record on the previous page. Read it from `next_cursor`, and keep the same filters: the id is only meaningful for the query that produced it.',
	);

const UuidSchema = z.string().uuid();

/**
 * Ramp accepts a decimal string or a JSON number for money filters. Both reach
 * the query string, so they stay a union rather than being coerced here.
 */
const AmountFilterSchema = z
	.union([z.string(), z.number()])
	.describe('A decimal amount, as a string or a number.');

/** Ramp documents `minor units`, so this is a whole number of cents. */
const MinorUnitAmountSchema = z
	.number()
	.int()
	.describe('Amount in minor units, so 5000 is $50.00.');

// ── shared output pieces ──────────────────────────────────────────────────

/**
 * Ramp's money object appears in two spellings. `amount`/`minor_unit_conversion_rate`
 * with a `currency_code` (transaction amounts), and `value` with a `currency`
 * (entity and merchant amounts). Both are modelled, because a transaction
 * response contains one of each.
 */
export const CurrencyAmountSchema = z
	.object({
		amount: z.number().nullish(),
		currency_code: z.string().nullish(),
		minor_unit_conversion_rate: z.number().nullish(),
	})
	.loose();

export type RampCurrencyAmount = z.infer<typeof CurrencyAmountSchema>;

export const SignedAmountSchema = z
	.object({
		currency: z.string().nullish(),
		value: z.number().nullish(),
	})
	.loose();

export type RampSignedAmount = z.infer<typeof SignedAmountSchema>;

/**
 * Ramp's page envelope. `next` is either an absolute URL that embeds `start`,
 * or null on the last page. The operation adds `next_cursor` and `next_page_url`
 * beside it rather than replacing it.
 */
export const PageSchema = z
	.object({
		next: z
			.string()
			.nullish()
			.describe(
				'Absolute URL for the next page, or null on the last page. Its `start` query is returned as `next_cursor`.',
			),
		total_count: z
			.number()
			.nullish()
			.describe(
				'Only present when the call sets `include_count`. Capped at 10,000.',
			),
		total_count_capped: z
			.boolean()
			.nullish()
			.describe('True when more than 10,000 records match.'),
	})
	.loose();

export type RampPage = z.infer<typeof PageSchema>;

/**
 * `next_cursor` is derived in the endpoint from `page.next`, so it is declared
 * here rather than added by a transform, which the docs generator cannot see.
 */
const pagingFields = {
	next: z.string().nullish(),
	next_cursor: z
		.string()
		.nullable()
		.describe(
			'Pass as `start` to read the next page. Null once `page.next` is null.',
		),
	next_page_url: z
		.string()
		.nullable()
		.describe('The absolute `page.next` URL, for callers that prefer it.'),
	total_count: z.number().nullish(),
	total_count_capped: z.boolean().nullish(),
};

// ── transactions.list ─────────────────────────────────────────────────────

const TransactionSortSchema = z
	.object({
		by: z.enum(['date', 'amount']).describe('The field to sort on.'),
		direction: z.enum(['asc', 'desc']).describe('The sort direction.'),
	})
	.optional()
	.describe(
		'Ramp takes one of four separate booleans and rejects more than one ordering parameter at once, so the pair is modelled as a single field.',
	);

const TransactionsListInputSchema = z.object({
	state: z
		.enum([
			'ALL',
			'CLEARED',
			'COMPLETION',
			'DECLINED',
			'ERROR',
			'PENDING',
			'PENDING_INITIATION',
		])
		.optional()
		.describe(
			'Transaction state. Ramp omits declined transactions unless this is `ALL`.',
		),
	sync_status: z.enum(['NOT_SYNC_READY', 'SYNCED', 'SYNC_READY']).optional(),
	from_date: z
		.string()
		.optional()
		.describe(
			'Only transactions whose `user_transaction_time` is after this ISO 8601 date.',
		),
	to_date: z
		.string()
		.optional()
		.describe(
			'Only transactions whose `user_transaction_time` is before this ISO 8601 date.',
		),
	user_id: UuidSchema.optional().describe('Only this cardholder.'),
	card_id: UuidSchema.optional().describe('Only this physical card.'),
	merchant_id: UuidSchema.optional(),
	department_id: UuidSchema.optional(),
	location_id: UuidSchema.optional(),
	entity_id: UuidSchema.optional().describe('Only this business entity.'),
	statement_id: UuidSchema.optional(),
	trip_id: UuidSchema.optional(),
	spend_program_id: UuidSchema.optional(),
	limit_id: UuidSchema.optional(),
	sk_category_id: z
		.number()
		.int()
		.optional()
		.describe("Ramp's own category code, for example 19 for restaurants."),
	has_been_approved: z.boolean().optional(),
	all_requirements_met_and_approved: z.boolean().optional(),
	requires_memo: z
		.literal(true)
		.optional()
		.describe(
			'Pass `true` for only transactions that require a memo and do not have one. Ramp accepts only `true` (`false` answers 422); leave it out for every transaction.',
		),
	has_statement: z.boolean().optional(),
	has_no_sync_commits: z.boolean().optional(),
	min_amount: AmountFilterSchema.optional(),
	max_amount: AmountFilterSchema.optional(),
	synced_after: z
		.string()
		.optional()
		.describe(
			'Only transactions with an accounting sync commit at or after this date. This is not an updated-at filter.',
		),
	sort: TransactionSortSchema,
	include_count: z
		.boolean()
		.optional()
		.describe(
			'Ask Ramp to count the matches. Adds latency and caps the count at 10,000.',
		),
	include_merchant_data: z.boolean().optional(),
	start: StartSchema,
	page_size: PageSizeSchema,
});

export type TransactionsListInput = z.input<typeof TransactionsListInputSchema>;

const CardHolderSchema = z
	.object({
		department_id: z.string().nullish(),
		department_name: z.string().nullish(),
		employee_id: z.string().nullish(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		location_id: z.string().nullish(),
		location_name: z.string().nullish(),
		user_id: z.string().nullish(),
	})
	.loose();

const MerchantLocationSchema = z
	.object({
		city: z.string().nullish(),
		country: z.string().nullish(),
		postal_code: z.string().nullish(),
		state: z.string().nullish(),
	})
	.loose();

/**
 * Ramp's coding selection, as it appears on a transaction or bill line item.
 * `category_info` is the underlying accounting field and `display_name` the
 * value chosen for it.
 */
const AccountingFieldSelectionSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		display_name: z.string().nullish(),
		type: z.string().nullish(),
		external_id: z.string().nullish(),
		external_code: z.string().nullish(),
		provider_name: z.string().nullish(),
		category_info: z
			.object({
				id: z.string().nullish(),
				name: z.string().nullish(),
				type: z.string().nullish(),
				external_id: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type RampAccountingFieldSelection = z.infer<
	typeof AccountingFieldSelectionSchema
>;

/** A dispute against a transaction, as Ramp reports it on the row. */
const TransactionDisputeSchema = z
	.object({
		id: z.string().nullish(),
		created_at: z.string().nullish(),
		memo: z.string().nullish(),
		type: z.string().nullish(),
	})
	.loose();

/** A policy violation raised against a transaction. Same row shape as a dispute. */
const TransactionPolicyViolationSchema = z
	.object({
		id: z.string().nullish(),
		created_at: z.string().nullish(),
		memo: z.string().nullish(),
		type: z.string().nullish(),
	})
	.loose();

const TransactionLineItemSchema = z
	.object({
		id: z.string().nullish(),
		memo: z.string().nullish(),
		accounting_field_selections: z
			.array(AccountingFieldSelectionSchema)
			.nullish(),
		amount: CurrencyAmountSchema.nullish(),
		converted_amount: CurrencyAmountSchema.nullish(),
	})
	.loose();

const TransactionSchema = z
	.object({
		id: z.string().nullish(),
		amount: z.number().nullish(),
		currency_code: z.string().nullish(),
		memo: z.string().nullish(),
		state: z.string().nullish(),
		sync_status: z.string().nullish(),
		sk_category_id: z.number().nullish(),
		sk_category_name: z.string().nullish(),
		merchant_id: z.string().nullish(),
		merchant_name: z.string().nullish(),
		merchant_descriptor: z.string().nullish(),
		merchant_category_code: z.string().nullish(),
		merchant_category_code_description: z.string().nullish(),
		merchant_location: MerchantLocationSchema.nullish(),
		card_id: z.string().nullish(),
		card_holder: CardHolderSchema.nullish(),
		card_present: z.boolean().nullish(),
		user_transaction_time: z.string().nullish(),
		accounting_date: z.string().nullish(),
		settlement_date: z.string().nullish(),
		updated_at: z.string().nullish(),
		synced_at: z.string().nullish(),
		entity_id: z.string().nullish(),
		statement_id: z.string().nullish(),
		trip_id: z.string().nullish(),
		trip_name: z.string().nullish(),
		fund_id: z.string().nullish(),
		limit_id: z.string().nullish(),
		spend_program_id: z.string().nullish(),
		original_transaction_id: z.string().nullish(),
		all_requirements_met_and_approved: z.boolean().nullish(),
		requires_accounting_vendor_creation_to_sync: z.boolean().nullish(),
		entity_amount: SignedAmountSchema.nullish(),
		merchant_amount: SignedAmountSchema.nullish(),
		original_transaction_amount: CurrencyAmountSchema.nullish(),
		line_items: z.array(TransactionLineItemSchema).nullish(),
		receipts: z.array(z.string()).nullish(),
		disputes: z.array(TransactionDisputeSchema).nullish(),
		policy_violations: z.array(TransactionPolicyViolationSchema).nullish(),
	})
	.loose();

export type RampTransaction = z.infer<typeof TransactionSchema>;

const TransactionsListResponseSchema = z.object({
	transactions: z.array(TransactionSchema),
	page: PageSchema.nullish(),
	...pagingFields,
});

export type TransactionsListResponse = z.infer<
	typeof TransactionsListResponseSchema
>;

// ── transactions.get ──────────────────────────────────────────────────────

const TransactionsGetInputSchema = z.object({
	transaction_id: z
		.string()
		.min(1)
		.describe('The transaction id, from `transactions.list`.'),
	include_merchant_data: z
		.boolean()
		.optional()
		.describe('Ask for the full purchase data the merchant sent.'),
});

export type TransactionsGetInput = z.input<typeof TransactionsGetInputSchema>;

const TransactionsGetResponseSchema = z.object({
	transaction: TransactionSchema,
});

export type TransactionsGetResponse = z.infer<
	typeof TransactionsGetResponseSchema
>;

// ── transactions.update ───────────────────────────────────────────────────

/**
 * Ramp identifies a coding selection by Ramp id or by the ERP's remote id, and
 * the option by one of three alternatives. Picking none, or one from each
 * group, is rejected by the API, so the choice is enforced here instead of
 * costing a request.
 */
const SplitFieldSelectionSchema = z
	.object({
		field_id: UuidSchema.optional().describe(
			'Ramp id of the accounting field.',
		),
		field_external_id: z
			.string()
			.optional()
			.describe("The field's id in the connected ERP."),
		field_option_id: UuidSchema.optional().describe('Ramp id of the option.'),
		field_option_external_id: z
			.string()
			.optional()
			.describe("The option's id in the connected ERP."),
		free_form_text: z
			.string()
			.optional()
			.describe('Free text, for a field that takes a typed value.'),
	})
	.superRefine((value, ctx) => {
		const fieldChoices = [value.field_id, value.field_external_id].filter(
			(part) => part !== undefined,
		);
		if (fieldChoices.length !== 1) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide exactly one of field_id or field_external_id.',
				path: ['field_id'],
			});
		}

		const optionChoices = [
			value.field_option_id,
			value.field_option_external_id,
			value.free_form_text,
		].filter((part) => part !== undefined);
		if (optionChoices.length !== 1) {
			ctx.addIssue({
				code: 'custom',
				message:
					'Provide exactly one of field_option_id, field_option_external_id or free_form_text.',
				path: ['field_option_id'],
			});
		}
	});

const SplitLineItemSchema = z.object({
	amount: MinorUnitAmountSchema,
	memo: z.string().optional(),
	accounting_field_selections: z
		.array(SplitFieldSelectionSchema)
		.optional()
		.describe('The coding selections for this line item.'),
});

const TransactionsUpdateInputSchema = z.object({
	transaction_id: z.string().min(1),
	line_items: z
		.array(SplitLineItemSchema)
		.describe(
			'The line items to split the transaction into. Send an empty array to remove an existing split.',
		),
});

export type TransactionsUpdateInput = z.input<
	typeof TransactionsUpdateInputSchema
>;

const TransactionsUpdateResponseSchema = z.object({
	transaction: TransactionSchema,
});

export type TransactionsUpdateResponse = z.infer<
	typeof TransactionsUpdateResponseSchema
>;

// ── merchants.list ────────────────────────────────────────────────────────

const MerchantsListInputSchema = z.object({
	merchant_name: z
		.string()
		.optional()
		.describe('A case-sensitive display-name prefix.'),
	merchant_url: z
		.string()
		.optional()
		.describe('A URL or domain, matched after normalisation.'),
	transaction_from_date: z.string().optional(),
	transaction_to_date: z.string().optional(),
	start: StartSchema,
	page_size: PageSizeSchema,
});

export type MerchantsListInput = z.input<typeof MerchantsListInputSchema>;

const MerchantSchema = z
	.object({
		id: z.string().nullish(),
		merchant_name: z.string().nullish(),
		sk_category_name: z.string().nullish(),
		is_auto_approved: z.boolean().nullish(),
	})
	.loose();

export type RampMerchant = z.infer<typeof MerchantSchema>;

const MerchantsListResponseSchema = z.object({
	merchants: z.array(MerchantSchema),
	page: PageSchema.nullish(),
	...pagingFields,
});

export type MerchantsListResponse = z.infer<typeof MerchantsListResponseSchema>;

// ── cards.listVirtual ─────────────────────────────────────────────────────

const CardsListVirtualInputSchema = z.object({
	entity_id: UuidSchema.optional().describe('Only cards for this entity.'),
	user_id: UuidSchema.optional().describe('Only cards owned by this user.'),
	is_terminated: z
		.boolean()
		.optional()
		.describe('Only terminated cards. Ramp defaults to excluding them.'),
	start: StartSchema,
	page_size: PageSizeSchema,
});

export type CardsListVirtualInput = z.input<typeof CardsListVirtualInputSchema>;

const VirtualCardSchema = z
	.object({
		id: z.string().nullish(),
		fund_id: z.string().nullish(),
		user_id: z.string().nullish(),
		is_card_suspended: z.boolean().nullish(),
		created_at: z.string().nullish(),
	})
	.loose();

export type RampVirtualCard = z.infer<typeof VirtualCardSchema>;

const CardsListVirtualResponseSchema = z.object({
	cards: z.array(VirtualCardSchema),
	page: PageSchema.nullish(),
	...pagingFields,
});

export type CardsListVirtualResponse = z.infer<
	typeof CardsListVirtualResponseSchema
>;

// ── bills.list ────────────────────────────────────────────────────────────

const BillsListInputSchema = z.object({
	vendor_id: UuidSchema.optional(),
	entity_id: UuidSchema.optional(),
	invoice_number: z.string().optional(),
	status_summaries: z
		.array(
			z.enum([
				'APPROVAL_PENDING',
				'APPROVAL_REJECTED',
				'ARCHIVED',
				'AWAITING_PAYMENT',
				'AWAITING_RELEASE',
				'BLOCKED',
				'HELD_BY_PROVIDER',
				'ON_HOLD',
				'PAYMENT_COMPLETED',
				'PAYMENT_DETAILS_MISSING',
				'PAYMENT_ERROR',
				'PAYMENT_NOT_INSTRUCTED',
				'PAYMENT_PROCESSING',
				'PAYMENT_READY',
				'PAYMENT_SCHEDULED',
				'PENDING_VENDOR_APPROVAL',
				'WAITING_FOR_TRANSACTION_MATCH',
				'WAITING_FOR_TRANSFER_MATCH',
				'WAITING_FOR_VENDOR',
			]),
		)
		.optional()
		.describe('Sent as a comma-separated list.'),
	approval_status: z
		.enum(['APPROVED', 'INITIALIZED', 'PENDING', 'REJECTED', 'TERMINATED'])
		.optional(),
	payment_status: z.enum(['OPEN', 'PAID']).optional(),
	sync_status: z
		.enum(['BILL_AND_PAYMENT_SYNCED', 'BILL_SYNCED', 'NOT_SYNCED'])
		.optional(),
	is_archived: z
		.boolean()
		.optional()
		.describe('Show archived bills instead of active ones.'),
	sync_ready: z.boolean().optional(),
	payment_details_missing: z.boolean().optional(),
	from_created_at: z.string().optional(),
	to_created_at: z.string().optional(),
	from_due_date: z.string().optional(),
	to_due_date: z.string().optional(),
	from_paid_at: z.string().optional(),
	to_paid_at: z.string().optional(),
	min_amount: AmountFilterSchema.optional(),
	max_amount: AmountFilterSchema.optional(),
	start: StartSchema,
	page_size: PageSizeSchema,
});

export type BillsListInput = z.input<typeof BillsListInputSchema>;

const BillVendorSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		remote_code: z.string().nullish(),
		remote_id: z.string().nullish(),
		remote_name: z.string().nullish(),
		type: z.string().nullish(),
	})
	.loose();

const BillOwnerSchema = z
	.object({
		id: z.string().nullish(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
	})
	.loose();

const BillLineItemSchema = z
	.object({
		id: z.string().nullish(),
		memo: z.string().nullish(),
		accounting_field_selections: z
			.array(AccountingFieldSelectionSchema)
			.nullish(),
		amount: CurrencyAmountSchema.nullish(),
		purchase_order_line_item_id: z.string().nullish(),
	})
	.loose();

const BillPaymentSchema = z
	.object({
		id: z.string().nullish(),
		customer_friendly_payment_id: z.string().nullish(),
		payment_method: z.string().nullish(),
		payment_date: z.string().nullish(),
		effective_date: z.string().nullish(),
		amount: CurrencyAmountSchema.nullish(),
	})
	.loose();

const BillSchema = z
	.object({
		id: z.string().nullish(),
		invoice_number: z.string().nullish(),
		memo: z.string().nullish(),
		vendor_memo: z.string().nullish(),
		status: z.string().nullish(),
		status_summary: z.string().nullish(),
		approval_status: z.string().nullish(),
		sync_status: z.string().nullish(),
		amount: CurrencyAmountSchema.nullish(),
		due_at: z.string().nullish(),
		issued_at: z.string().nullish(),
		created_at: z.string().nullish(),
		paid_at: z.string().nullish(),
		accounting_date: z.string().nullish(),
		posting_date: z.string().nullish(),
		archived_at: z.string().nullish(),
		entity_id: z.string().nullish(),
		draft_bill_id: z.string().nullish(),
		remote_id: z.string().nullish(),
		purchase_order_id: z.string().nullish(),
		vendor_contact_id: z.string().nullish(),
		deep_link_url: z.string().nullish(),
		is_payment_sync_ready: z.boolean().nullish(),
		fx_conversion_rate: z.string().nullish(),
		vendor: BillVendorSchema.nullish(),
		bill_owner: BillOwnerSchema.nullish(),
		payment: BillPaymentSchema.nullish(),
		line_items: z.array(BillLineItemSchema).nullish(),
		invoice_urls: z.array(z.string()).nullish(),
		item_receipt_ids: z.array(z.string()).nullish(),
	})
	.loose();

export type RampBill = z.infer<typeof BillSchema>;

const BillsListResponseSchema = z.object({
	bills: z.array(BillSchema),
	page: PageSchema.nullish(),
	...pagingFields,
});

export type BillsListResponse = z.infer<typeof BillsListResponseSchema>;

// ── bills.get ─────────────────────────────────────────────────────────────

const BillsGetInputSchema = z.object({
	bill_id: z.string().min(1).describe('The bill id, from `bills.list`.'),
});

export type BillsGetInput = z.input<typeof BillsGetInputSchema>;

const BillsGetResponseSchema = z.object({
	bill: BillSchema,
});

export type BillsGetResponse = z.infer<typeof BillsGetResponseSchema>;

// ── bills.update ──────────────────────────────────────────────────────────

const BillsUpdateInputSchema = z.object({
	bill_id: z.string().min(1),
	memo: z.string().optional().describe('Replaces the internal bill memo.'),
	vendor_memo: z
		.string()
		.optional()
		.describe('Replaces the memo shown to the vendor.'),
	invoice_number: z.string().optional(),
	due_at: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'due_at must be a YYYY-MM-DD date')
		.refine(isCalendarDate, 'due_at must be a real calendar date')
		.optional()
		.describe('A new due date, as a `YYYY-MM-DD` date.'),
});

export type BillsUpdateInput = z.input<typeof BillsUpdateInputSchema>;

const BillsUpdateResponseSchema = z.object({
	bill: BillSchema,
});

export type BillsUpdateResponse = z.infer<typeof BillsUpdateResponseSchema>;

// ── reimbursements.list ───────────────────────────────────────────────────

const ReimbursementsListInputSchema = z.object({
	direction: z
		.enum(['BUSINESS_TO_USER', 'USER_TO_BUSINESS'])
		.optional()
		.describe(
			'Ramp defaults to `BUSINESS_TO_USER`; `USER_TO_BUSINESS` reads repayments.',
		),
	state: z
		.enum([
			'APPROVED',
			'AWAITING_EXPORT',
			'AWAITING_PAYMENT',
			'AWAITING_PUSH_PAYMENT',
			'CANCELED',
			'DELETED',
			'DRAFT',
			'EXPORTED',
			'EXPORT_FAILED',
			'EXPORT_INITIATED',
			'EXPORT_MARKED_AS_FAILED',
			'EXPORT_SUCCESSFUL',
			'FAILED_REIMBURSEMENT',
			'INIT',
			'MANUALLY_REIMBURSED',
			'MISSING_ACH',
			'PAYROLL_FAILED',
			'PAYROLL_SUBMITTED',
			'PENDING',
			'PROCESSING',
			'PUSH_PAYMENT_FAILED',
			'PUSH_PAYMENT_INITIATED',
			'REIMBURSED',
			'REIMBURSED_VIA_PAYROLL',
			'REIMBURSED_VIA_PUSH',
			'REJECTED',
		])
		.optional(),
	sync_status: z.enum(['NOT_SYNC_READY', 'SYNCED', 'SYNC_READY']).optional(),
	user_id: UuidSchema.optional(),
	entity_id: UuidSchema.optional(),
	trip_id: UuidSchema.optional(),
	has_been_approved: z.boolean().optional(),
	sync_ready: z.boolean().optional(),
	has_no_sync_commits: z.boolean().optional(),
	from_date: z.string().optional(),
	to_date: z.string().optional(),
	from_submitted_at: z.string().optional(),
	to_submitted_at: z.string().optional(),
	from_transaction_date: z.string().optional(),
	to_transaction_date: z.string().optional(),
	updated_after: z.string().optional(),
	synced_after: z.string().optional(),
	start: StartSchema,
	page_size: PageSizeSchema,
});

export type ReimbursementsListInput = z.input<
	typeof ReimbursementsListInputSchema
>;

/**
 * Ramp's reimbursement money object: `value` in minor units with a `currency`,
 * unlike the `amount`/`currency_code` spelling used for `payee_amount`.
 */
const ReimbursementAmountSchema = z
	.object({
		currency: z.string().nullish(),
		value: z.number().nullish(),
		minor_unit_conversion_rate: z.number().nullish(),
	})
	.loose();

const ReimbursementLineItemSchema = z
	.object({
		memo: z.string().nullish(),
		accounting_field_selections: z
			.array(AccountingFieldSelectionSchema)
			.nullish(),
		amount: CurrencyAmountSchema.nullish(),
	})
	.loose();

const ReimbursementAttendeeSchema = z
	.object({
		name: z.string().nullish(),
		user_id: z.string().nullish(),
	})
	.loose();

const ReimbursementSchema = z
	.object({
		id: z.string().nullish(),
		type: z.string().nullish(),
		direction: z.string().nullish(),
		state: z.string().nullish(),
		sync_status: z.string().nullish(),
		memo: z.string().nullish(),
		merchant: z.string().nullish(),
		merchant_id: z.string().nullish(),
		user_id: z.string().nullish(),
		user_email: z.string().nullish(),
		user_full_name: z.string().nullish(),
		employee_id: z.string().nullish(),
		entity_id: z.string().nullish(),
		fund_id: z.string().nullish(),
		trip_id: z.string().nullish(),
		transaction_date: z.string().nullish(),
		accounting_date: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		submitted_at: z.string().nullish(),
		approved_at: z.string().nullish(),
		synced_at: z.string().nullish(),
		payment_processed_at: z.string().nullish(),
		distance: z.number().nullish(),
		payee_amount: CurrencyAmountSchema.nullish(),
		entity_amount: ReimbursementAmountSchema.nullish(),
		merchant_amount: ReimbursementAmountSchema.nullish(),
		receipts: z.array(z.string()).nullish(),
		line_items: z.array(ReimbursementLineItemSchema).nullish(),
		attendees: z.array(ReimbursementAttendeeSchema).nullish(),
		// Intermediate stops of a mileage trip, sent as plain strings.
		waypoints: z.array(z.string()).nullish(),
	})
	.loose();

export type RampReimbursement = z.infer<typeof ReimbursementSchema>;

const ReimbursementsListResponseSchema = z.object({
	reimbursements: z.array(ReimbursementSchema),
	page: PageSchema.nullish(),
	...pagingFields,
});

export type ReimbursementsListResponse = z.infer<
	typeof ReimbursementsListResponseSchema
>;

// ── memos.get / memos.create ──────────────────────────────────────────────

const MemosGetInputSchema = z.object({
	transaction_id: z.string().min(1),
});

export type MemosGetInput = z.input<typeof MemosGetInputSchema>;

const MemoSchema = z
	.object({
		id: z.string().nullish(),
		memo: z.string().nullish(),
	})
	.loose();

export type RampMemo = z.infer<typeof MemoSchema>;

const MemosGetResponseSchema = z.object({
	memo: MemoSchema,
});

export type MemosGetResponse = z.infer<typeof MemosGetResponseSchema>;

const MemosCreateInputSchema = z.object({
	transaction_id: z.string().min(1),
	memo: z
		.string()
		.min(1)
		.max(255)
		.describe('The memo text. Ramp caps it at 255 characters.'),
});

export type MemosCreateInput = z.input<typeof MemosCreateInputSchema>;

const MemosCreateResponseSchema = z.object({
	memo: MemoSchema,
});

export type MemosCreateResponse = z.infer<typeof MemosCreateResponseSchema>;

// ── departments.list / departments.create ─────────────────────────────────

const DepartmentsListInputSchema = z.object({
	start: StartSchema,
	page_size: PageSizeSchema,
});

export type DepartmentsListInput = z.input<typeof DepartmentsListInputSchema>;

const DepartmentSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
	})
	.loose();

export type RampDepartment = z.infer<typeof DepartmentSchema>;

const DepartmentsListResponseSchema = z.object({
	departments: z.array(DepartmentSchema),
	page: PageSchema.nullish(),
	...pagingFields,
});

export type DepartmentsListResponse = z.infer<
	typeof DepartmentsListResponseSchema
>;

const DepartmentsCreateInputSchema = z.object({
	name: z.string().min(1).describe('The department name.'),
});

export type DepartmentsCreateInput = z.input<
	typeof DepartmentsCreateInputSchema
>;

const DepartmentsCreateResponseSchema = z.object({
	department: DepartmentSchema,
});

export type DepartmentsCreateResponse = z.infer<
	typeof DepartmentsCreateResponseSchema
>;

// ── users.list / users.get ────────────────────────────────────────────────

const UserRoleSchema = z.enum([
	'AUDITOR',
	'BUSINESS_ADMIN',
	'BUSINESS_BOOKKEEPER',
	'BUSINESS_OWNER',
	'BUSINESS_USER',
	'GUEST_USER',
	'IT_ADMIN',
]);

const UserStatusSchema = z.enum([
	'USER_ACTIVE',
	'USER_DRAFT',
	'USER_INACTIVE',
	'USER_SUSPENDED',
]);

const UsersListInputSchema = z.object({
	email: z.string().optional(),
	role: UserRoleSchema.optional(),
	status: UserStatusSchema.optional(),
	employee_id: z.string().optional(),
	entity_id: UuidSchema.optional(),
	department_id: UuidSchema.optional(),
	location_id: UuidSchema.optional(),
	start: StartSchema,
	page_size: PageSizeSchema,
});

export type UsersListInput = z.input<typeof UsersListInputSchema>;

const UserCustomFieldSchema = z
	.object({
		name: z.string().nullish(),
		value: z.string().nullish(),
	})
	.loose();

const UserSchema = z
	.object({
		id: z.string().nullish(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		email: z.string().nullish(),
		role: z.string().nullish(),
		status: z.string().nullish(),
		employee_id: z.string().nullish(),
		business_id: z.string().nullish(),
		entity_id: z.string().nullish(),
		department_id: z.string().nullish(),
		location_id: z.string().nullish(),
		manager_id: z.string().nullish(),
		is_manager: z.boolean().nullish(),
		// Ramp's own OpenAPI example carries this as a bare number
		// (`phone: 8004559999`) while the field is documented as a string, so
		// both spellings are accepted rather than dropping a real user record.
		phone: z.union([z.string(), z.number()]).nullish(),
		scheduled_deactivation_date: z.string().nullish(),
		scheduled_invitation_date: z.string().nullish(),
		custom_fields: z.array(UserCustomFieldSchema).nullish(),
	})
	.loose();

export type RampUser = z.infer<typeof UserSchema>;

const UsersListResponseSchema = z.object({
	users: z.array(UserSchema),
	page: PageSchema.nullish(),
	...pagingFields,
});

export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;

const UsersGetInputSchema = z.object({
	user_id: z.string().min(1),
});

export type UsersGetInput = z.input<typeof UsersGetInputSchema>;

const UsersGetResponseSchema = z.object({
	user: UserSchema,
});

export type UsersGetResponse = z.infer<typeof UsersGetResponseSchema>;

// ── business.get ──────────────────────────────────────────────────────────

const BusinessGetInputSchema = z.object({});

export type BusinessGetInput = z.input<typeof BusinessGetInputSchema>;

const BusinessAddressSchema = z
	.object({
		address_line1: z.string().nullish(),
		address_line2: z.string().nullish(),
		city: z.string().nullish(),
		state: z.string().nullish(),
		postal_code: z.string().nullish(),
		country: z.string().nullish(),
	})
	.loose();

const BusinessSchema = z
	.object({
		id: z.string().nullish(),
		business_name_legal: z.string().nullish(),
		business_name_on_card: z.string().nullish(),
		active: z.boolean().nullish(),
		website: z.string().nullish(),
		phone: z.string().nullish(),
		created_time: z.string().nullish(),
		enforce_sso: z.boolean().nullish(),
		is_integrated_with_slack: z.boolean().nullish(),
		is_reimbursements_enabled: z.boolean().nullish(),
		limit_locked: z.boolean().nullish(),
		billing_address: BusinessAddressSchema.nullish(),
	})
	.loose();

export type RampBusiness = z.infer<typeof BusinessSchema>;

const BusinessGetResponseSchema = z.object({
	business: BusinessSchema,
});

export type BusinessGetResponse = z.infer<typeof BusinessGetResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type RampEndpointInputs = {
	transactionsList: TransactionsListInput;
	transactionsGet: TransactionsGetInput;
	transactionsUpdate: TransactionsUpdateInput;
	merchantsList: MerchantsListInput;
	cardsListVirtual: CardsListVirtualInput;
	billsList: BillsListInput;
	billsGet: BillsGetInput;
	billsUpdate: BillsUpdateInput;
	reimbursementsList: ReimbursementsListInput;
	memosGet: MemosGetInput;
	memosCreate: MemosCreateInput;
	departmentsList: DepartmentsListInput;
	departmentsCreate: DepartmentsCreateInput;
	usersList: UsersListInput;
	usersGet: UsersGetInput;
	businessGet: BusinessGetInput;
};

export type RampEndpointOutputs = {
	transactionsList: TransactionsListResponse;
	transactionsGet: TransactionsGetResponse;
	transactionsUpdate: TransactionsUpdateResponse;
	merchantsList: MerchantsListResponse;
	cardsListVirtual: CardsListVirtualResponse;
	billsList: BillsListResponse;
	billsGet: BillsGetResponse;
	billsUpdate: BillsUpdateResponse;
	reimbursementsList: ReimbursementsListResponse;
	memosGet: MemosGetResponse;
	memosCreate: MemosCreateResponse;
	departmentsList: DepartmentsListResponse;
	departmentsCreate: DepartmentsCreateResponse;
	usersList: UsersListResponse;
	usersGet: UsersGetResponse;
	businessGet: BusinessGetResponse;
};

export const RampEndpointInputSchemas = {
	transactionsList: TransactionsListInputSchema,
	transactionsGet: TransactionsGetInputSchema,
	transactionsUpdate: TransactionsUpdateInputSchema,
	merchantsList: MerchantsListInputSchema,
	cardsListVirtual: CardsListVirtualInputSchema,
	billsList: BillsListInputSchema,
	billsGet: BillsGetInputSchema,
	billsUpdate: BillsUpdateInputSchema,
	reimbursementsList: ReimbursementsListInputSchema,
	memosGet: MemosGetInputSchema,
	memosCreate: MemosCreateInputSchema,
	departmentsList: DepartmentsListInputSchema,
	departmentsCreate: DepartmentsCreateInputSchema,
	usersList: UsersListInputSchema,
	usersGet: UsersGetInputSchema,
	businessGet: BusinessGetInputSchema,
} as const;

export const RampEndpointOutputSchemas = {
	transactionsList: TransactionsListResponseSchema,
	transactionsGet: TransactionsGetResponseSchema,
	transactionsUpdate: TransactionsUpdateResponseSchema,
	merchantsList: MerchantsListResponseSchema,
	cardsListVirtual: CardsListVirtualResponseSchema,
	billsList: BillsListResponseSchema,
	billsGet: BillsGetResponseSchema,
	billsUpdate: BillsUpdateResponseSchema,
	reimbursementsList: ReimbursementsListResponseSchema,
	memosGet: MemosGetResponseSchema,
	memosCreate: MemosCreateResponseSchema,
	departmentsList: DepartmentsListResponseSchema,
	departmentsCreate: DepartmentsCreateResponseSchema,
	usersList: UsersListResponseSchema,
	usersGet: UsersGetResponseSchema,
	businessGet: BusinessGetResponseSchema,
} as const;
