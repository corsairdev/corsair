import { z } from 'zod';

// Inputs use YNAB's own field names, which are snake_case. Outputs are
// `.loose()` and their documented fields nullish.
// Reference: https://api.ynab.com (v1), whose responses are all wrapped in a
// `{ data }` envelope with a `{ data, included }` shape for changes.
//
// YNAB stores money in **milliunits**: an amount is the currency value times
// 1,000, so $12.34 is 12,340. Every amount field here is a milliunit integer,
// and reading it as a decimal is the most common mistake with this API.

/** A milliunit amount, which is the currency value times 1,000. */
const MilliunitsSchema = z
	.number()
	.int()
	.describe('An amount in milliunits: the currency value times 1,000.');

/**
 * A calendar date, `yyyy-MM-dd`. YNAB rejects anything else, and a malformed date
 * would otherwise be sent and come back as a 400 that names no field.
 */
const DateSchema = z
	.string()
	.date('Use `yyyy-MM-dd` with a valid calendar date, with no time or zone.')
	.describe('A date as `yyyy-MM-dd`, with no time or zone.');

/** A month, `yyyy-MM-01`: YNAB only accepts the first day of the month. */
const MonthSchema = z
	.string()
	.regex(
		/^\d{4}-(0[1-9]|1[0-2])-01$/,
		'Use `yyyy-MM-01`: month requests start on the 1st.',
	)
	.describe('A month as `yyyy-MM-01`.');

/** YNAB wraps every answer in `{ data }`. */
function envelope<T extends z.ZodType>(item: T) {
	return z.object({ data: item }).loose();
}

// ── the models ────────────────────────────────────────────────────────────

const BudgetSummarySchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		last_modified_on: z.string().nullish(),
		first_month: z.string().nullish(),
		last_month: z.string().nullish(),
		// unknown: the format object names separators and patterns YNAB can extend;
		// it is passed through rather than pinned to today's keys.
		date_format: z.record(z.string(), z.unknown()).nullish(),
		// unknown: same as date_format; the keys belong to YNAB.
		currency_format: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type YnabBudgetSummary = z.infer<typeof BudgetSummarySchema>;

/**
 * An account. Its `balance` and `cleared_balance` are milliunits, and
 * `balance` includes uncleared transactions while `cleared_balance` does not.
 */
const AccountSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		type: z
			.string()
			.nullish()
			.describe(
				'checking, savings, cash, creditCard, lineOfCredit, otherAsset, otherLiability, or a loan or debt type such as mortgage or studentLoan.',
			),
		on_budget: z
			.boolean()
			.nullish()
			.describe('Whether the account counts towards the budget balances.'),
		closed: z.boolean().nullish(),
		note: z.string().nullish(),
		balance: MilliunitsSchema.nullish(),
		cleared_balance: MilliunitsSchema.nullish(),
		uncleared_balance: MilliunitsSchema.nullish(),
		transfer_payee_id: z.string().nullish(),
		deleted: z.boolean().nullish(),
	})
	.loose();

export type YnabAccount = z.infer<typeof AccountSchema>;

/** A category group holds categories; both carry budgeted and activity totals. */
const CategorySchema = z
	.object({
		id: z.string().nullish(),
		category_group_id: z.string().nullish(),
		category_group_name: z.string().nullish(),
		name: z.string().nullish(),
		hidden: z.boolean().nullish(),
		// The amounts, all in milliunits.
		budgeted: MilliunitsSchema.nullish(),
		activity: MilliunitsSchema.nullish(),
		balance: MilliunitsSchema.nullish(),
		goal_type: z.string().nullish(),
		goal_target: MilliunitsSchema.nullish(),
		goal_percentage_complete: z.number().nullish(),
		deleted: z.boolean().nullish(),
		note: z.string().nullish(),
	})
	.loose();

export type YnabCategory = z.infer<typeof CategorySchema>;

const CategoryGroupSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		hidden: z.boolean().nullish(),
		deleted: z.boolean().nullish(),
		categories: z.array(CategorySchema).nullish(),
	})
	.loose();

export type YnabCategoryGroup = z.infer<typeof CategoryGroupSchema>;

const PayeeSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		transfer_account_id: z
			.string()
			.nullish()
			.describe('Set when the payee is the other side of a transfer.'),
		deleted: z.boolean().nullish(),
	})
	.loose();

export type YnabPayee = z.infer<typeof PayeeSchema>;

/**
 * A transaction. `amount` is negative for an outflow and positive for an
 * inflow, in milliunits — so a $12.34 purchase is -12,340.
 *
 * `subtransactions` splits one transaction across categories, and when it is
 * non-empty the parent's category fields are null.
 */
const SubtransactionSchema = z
	.object({
		id: z.string().nullish(),
		transaction_id: z.string().nullish(),
		amount: MilliunitsSchema.nullish(),
		memo: z.string().nullish(),
		payee_id: z.string().nullish(),
		payee_name: z.string().nullish(),
		category_id: z.string().nullish(),
		category_name: z.string().nullish(),
		transfer_account_id: z.string().nullish(),
		deleted: z.boolean().nullish(),
	})
	.loose();

export type YnabSubtransaction = z.infer<typeof SubtransactionSchema>;

const TransactionSchema = z
	.object({
		id: z.string().nullish(),
		date: z.string().nullish(),
		amount: MilliunitsSchema.nullish(),
		memo: z.string().nullish(),
		cleared: z.string().nullish(),
		approved: z.boolean().nullish(),
		flag_color: z.string().nullable().optional(),
		account_id: z.string().nullish(),
		account_name: z.string().nullish(),
		payee_id: z.string().nullish(),
		payee_name: z.string().nullish(),
		category_id: z.string().nullish(),
		category_name: z.string().nullish(),
		transfer_account_id: z.string().nullish(),
		transfer_transaction_id: z.string().nullish(),
		matched_transaction_id: z.string().nullish(),
		import_id: z.string().nullish(),
		import_payee_name: z.string().nullish(),
		deleted: z.boolean().nullish(),
		subtransactions: z.array(SubtransactionSchema).nullish(),
	})
	.loose();

export type YnabTransaction = z.infer<typeof TransactionSchema>;

/**
 * A scheduled transaction. Its `frequency` is how often it repeats and
 * `next_date` is when it next fires; the rest matches a transaction.
 */
const ScheduledTransactionSchema = z
	.object({
		id: z.string().nullish(),
		date_first: z.string().nullish(),
		date_next: z.string().nullish(),
		frequency: z
			.string()
			.nullish()
			.describe(
				'never, daily, weekly, everyOtherWeek, twiceAMonth, every4Weeks, monthly, everyOtherMonth, every3Months, every4Months, twiceAYear, yearly, or everyOtherYear.',
			),
		amount: MilliunitsSchema.nullish(),
		memo: z.string().nullish(),
		flag_color: z.string().nullable().optional(),
		account_id: z.string().nullish(),
		account_name: z.string().nullish(),
		payee_id: z.string().nullish(),
		payee_name: z.string().nullish(),
		category_id: z.string().nullish(),
		category_name: z.string().nullish(),
		transfer_account_id: z.string().nullish(),
		deleted: z.boolean().nullish(),
		subtransactions: z.array(SubtransactionSchema).nullish(),
	})
	.loose();

export type YnabScheduledTransaction = z.infer<
	typeof ScheduledTransactionSchema
>;

/** The plan for one month: its categories and the month's totals. */
const MonthSummarySchema = z
	.object({
		month: MonthSchema.nullish(),
		note: z.string().nullish(),
		income: MilliunitsSchema.nullish(),
		budgeted: MilliunitsSchema.nullish(),
		activity: MilliunitsSchema.nullish(),
		to_be_budgeted: MilliunitsSchema.nullish(),
		age_of_money: z.number().nullish(),
		deleted: z.boolean().nullish(),
		categories: z.array(CategorySchema).nullish(),
	})
	.loose();

export type YnabMonthSummary = z.infer<typeof MonthSummarySchema>;

/** The user behind the token. */
const UserSchema = z
	.object({
		id: z.string().nullish(),
	})
	.loose();

export type YnabUser = z.infer<typeof UserSchema>;

// ── shared inputs ─────────────────────────────────────────────────────────

const BudgetIdSchema = z
	.string()
	.min(1)
	.describe('The budget id, or `last-used` for the one most recently opened.');

const IdSchema = z.string().min(1);

/**
 * A delta request. YNAB's `last_knowledge_of_server` is a counter from a
 * previous response's `server_knowledge`; passing it returns only what changed.
 * It is worth using because a full budget is large.
 */
const DeltaSchema = {
	last_knowledge_of_server: z
		.number()
		.int()
		.optional()
		.describe(
			'A previous response server_knowledge, to return only what changed since.',
		),
};

/** A response that may carry the server counter for a later delta request. */
const ServerKnowledgeSchema = z.number().nullish();

// ── budgets ───────────────────────────────────────────────────────────────

const BudgetsListInputSchema = z.object({
	include_accounts: z
		.boolean()
		.optional()
		.describe('Also list each budget accounts, which makes the answer large.'),
});

export type BudgetsListInput = z.infer<typeof BudgetsListInputSchema>;

const BudgetsListResponseSchema = envelope(
	z
		.object({
			budgets: z.array(BudgetSummarySchema).nullish(),
			default_budget: BudgetSummarySchema.nullish(),
		})
		.loose(),
);

export type BudgetsListResponse = z.infer<typeof BudgetsListResponseSchema>;

const BudgetsGetInputSchema = z.object({ budgetId: BudgetIdSchema });

export type BudgetsGetInput = z.infer<typeof BudgetsGetInputSchema>;

/** A full budget: its accounts, categories, payees, months and transactions. */
const BudgetDetailSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		last_modified_on: z.string().nullish(),
		first_month: z.string().nullish(),
		last_month: z.string().nullish(),
		accounts: z.array(AccountSchema).nullish(),
		payees: z.array(PayeeSchema).nullish(),
		category_groups: z.array(CategoryGroupSchema).nullish(),
		categories: z.array(CategorySchema).nullish(),
		months: z.array(MonthSummarySchema).nullish(),
		transactions: z.array(TransactionSchema).nullish(),
		scheduled_transactions: z.array(ScheduledTransactionSchema).nullish(),
	})
	.loose();

export type YnabBudgetDetail = z.infer<typeof BudgetDetailSchema>;

const BudgetsGetResponseSchema = envelope(
	z
		.object({
			budget: BudgetDetailSchema.nullish(),
			server_knowledge: ServerKnowledgeSchema,
		})
		.loose(),
);

export type BudgetsGetResponse = z.infer<typeof BudgetsGetResponseSchema>;

// ── accounts ──────────────────────────────────────────────────────────────

const AccountsListInputSchema = z.object({
	budgetId: BudgetIdSchema,
	...DeltaSchema,
});

export type AccountsListInput = z.infer<typeof AccountsListInputSchema>;

const AccountsListResponseSchema = envelope(
	z
		.object({
			accounts: z.array(AccountSchema).nullish(),
			server_knowledge: ServerKnowledgeSchema,
		})
		.loose(),
);

export type AccountsListResponse = z.infer<typeof AccountsListResponseSchema>;

const AccountsGetInputSchema = z.object({
	budgetId: BudgetIdSchema,
	accountId: IdSchema,
});

export type AccountsGetInput = z.infer<typeof AccountsGetInputSchema>;

const AccountsGetResponseSchema = envelope(
	z.object({ account: AccountSchema.nullish() }).loose(),
);

export type AccountsGetResponse = z.infer<typeof AccountsGetResponseSchema>;

/** Creates an account. `balance` is in milliunits, like every amount. */
const AccountsCreateInputSchema = z
	.object({
		budgetId: BudgetIdSchema,
		name: z.string().min(1),
		// Only the six write-side types are valid here. The read-side enum also has
		// lineOfCredit and the loan and debt types, which YNAB rejects on create.
		type: z.enum([
			'checking',
			'savings',
			'cash',
			'creditCard',
			'otherAsset',
			'otherLiability',
		]),
		balance: MilliunitsSchema,
	})
	.superRefine((value, ctx) => {
		if (!Number.isInteger(value.balance)) {
			ctx.addIssue({
				code: 'custom',
				path: ['balance'],
				message: 'balance must be a whole number of milliunits.',
			});
		}
	});

export type AccountsCreateInput = z.infer<typeof AccountsCreateInputSchema>;

const AccountsCreateResponseSchema = envelope(
	z.object({ account: AccountSchema.nullish() }).loose(),
);

export type AccountsCreateResponse = z.infer<
	typeof AccountsCreateResponseSchema
>;

// ── categories ────────────────────────────────────────────────────────────

const CategoriesListInputSchema = z.object({
	budgetId: BudgetIdSchema,
	...DeltaSchema,
});

export type CategoriesListInput = z.infer<typeof CategoriesListInputSchema>;

const CategoriesListResponseSchema = envelope(
	z
		.object({
			category_groups: z.array(CategoryGroupSchema).nullish(),
			categories: z.array(CategorySchema).nullish(),
			server_knowledge: ServerKnowledgeSchema,
		})
		.loose(),
);

export type CategoriesListResponse = z.infer<
	typeof CategoriesListResponseSchema
>;

const CategoriesGetInputSchema = z.object({
	budgetId: BudgetIdSchema,
	categoryId: IdSchema,
});

export type CategoriesGetInput = z.infer<typeof CategoriesGetInputSchema>;

const CategoriesGetResponseSchema = envelope(
	z.object({ category: CategorySchema.nullish() }).loose(),
);

export type CategoriesGetResponse = z.infer<typeof CategoriesGetResponseSchema>;

/**
 * Assigns an amount to a category for a month. `budgeted` is the new total for
 * the month, not an increment — so sending 50,000 sets the month to $50, not
 * adds $50.
 */
const CategoriesUpdateInputSchema = z.object({
	budgetId: BudgetIdSchema,
	month: MonthSchema.describe('The month, as the first day: `yyyy-MM-01`.'),
	categoryId: IdSchema,
	budgeted: MilliunitsSchema.describe(
		'The new budgeted amount for the month, in milliunits. This replaces the value rather than adding to it.',
	),
});

export type CategoriesUpdateInput = z.infer<typeof CategoriesUpdateInputSchema>;

const CategoriesUpdateResponseSchema = envelope(
	z.object({ category: CategorySchema.nullish() }).loose(),
);

export type CategoriesUpdateResponse = z.infer<
	typeof CategoriesUpdateResponseSchema
>;

// ── payees ────────────────────────────────────────────────────────────────

const PayeesListInputSchema = z.object({
	budgetId: BudgetIdSchema,
	...DeltaSchema,
});

export type PayeesListInput = z.infer<typeof PayeesListInputSchema>;

const PayeesListResponseSchema = envelope(
	z
		.object({
			payees: z.array(PayeeSchema).nullish(),
			server_knowledge: ServerKnowledgeSchema,
		})
		.loose(),
);

export type PayeesListResponse = z.infer<typeof PayeesListResponseSchema>;

const PayeesGetInputSchema = z.object({
	budgetId: BudgetIdSchema,
	payeeId: IdSchema,
});

export type PayeesGetInput = z.infer<typeof PayeesGetInputSchema>;

const PayeesGetResponseSchema = envelope(
	z.object({ payee: PayeeSchema.nullish() }).loose(),
);

export type PayeesGetResponse = z.infer<typeof PayeesGetResponseSchema>;

const PayeesCreateInputSchema = z.object({
	budgetId: BudgetIdSchema,
	name: z.string().min(1),
});

export type PayeesCreateInput = z.infer<typeof PayeesCreateInputSchema>;

const PayeesCreateResponseSchema = envelope(
	z.object({ payee: PayeeSchema.nullish() }).loose(),
);

export type PayeesCreateResponse = z.infer<typeof PayeesCreateResponseSchema>;

const PayeesUpdateInputSchema = z.object({
	budgetId: BudgetIdSchema,
	payeeId: IdSchema,
	name: z.string().min(1),
});

export type PayeesUpdateInput = z.infer<typeof PayeesUpdateInputSchema>;

const PayeesUpdateResponseSchema = PayeesCreateResponseSchema;

export type PayeesUpdateResponse = z.infer<typeof PayeesUpdateResponseSchema>;

// ── months ────────────────────────────────────────────────────────────────

const MonthsListInputSchema = z.object({
	budgetId: BudgetIdSchema,
	...DeltaSchema,
});

export type MonthsListInput = z.infer<typeof MonthsListInputSchema>;

const MonthsListResponseSchema = envelope(
	z
		.object({
			months: z.array(MonthSummarySchema).nullish(),
			server_knowledge: ServerKnowledgeSchema,
		})
		.loose(),
);

export type MonthsListResponse = z.infer<typeof MonthsListResponseSchema>;

const MonthsGetInputSchema = z.object({
	budgetId: BudgetIdSchema,
	month: MonthSchema.describe('The month, as the first day: `yyyy-MM-01`.'),
});

export type MonthsGetInput = z.infer<typeof MonthsGetInputSchema>;

const MonthsGetResponseSchema = envelope(
	z.object({ month: MonthSummarySchema.nullish() }).loose(),
);

export type MonthsGetResponse = z.infer<typeof MonthsGetResponseSchema>;

// ── transactions ──────────────────────────────────────────────────────────

const TransactionsListInputSchema = z.object({
	budgetId: BudgetIdSchema,
	since_date: DateSchema.optional(),
	type: z
		.enum(['uncategorized', 'unapproved'])
		.optional()
		.describe('Only transactions matching this kind.'),
	...DeltaSchema,
});

export type TransactionsListInput = z.infer<typeof TransactionsListInputSchema>;

const TransactionsListResponseSchema = envelope(
	z
		.object({
			transactions: z.array(TransactionSchema).nullish(),
			server_knowledge: ServerKnowledgeSchema,
		})
		.loose(),
);

export type TransactionsListResponse = z.infer<
	typeof TransactionsListResponseSchema
>;

const TransactionsGetInputSchema = z.object({
	budgetId: BudgetIdSchema,
	transactionId: IdSchema,
});

export type TransactionsGetInput = z.infer<typeof TransactionsGetInputSchema>;

const TransactionsGetResponseSchema = envelope(
	z.object({ transaction: TransactionSchema.nullish() }).loose(),
);

export type TransactionsGetResponse = z.infer<
	typeof TransactionsGetResponseSchema
>;

/** One transaction to create, in the shape a bulk create takes. */
const TransactionInputShape = {
	account_id: IdSchema,
	date: DateSchema,
	amount: MilliunitsSchema.describe(
		'Negative for an outflow, positive for an inflow, in milliunits.',
	),
	payee_id: z.string().nullish(),
	payee_name: z
		.string()
		.nullish()
		.describe('A new payee, created if it does not already exist.'),
	category_id: z
		.string()
		.nullish()
		.describe('The category, or null to clear it.'),
	memo: z.string().nullish().describe('The memo, or null to clear it.'),
	cleared: z.enum(['cleared', 'uncleared', 'reconciled']).optional(),
	approved: z.boolean().optional(),
	flag_color: z.string().nullish().describe('The flag, or null to clear it.'),
	import_id: z
		.string()
		.optional()
		.describe(
			'An idempotency key. A transaction whose import_id already exists on the same account is skipped, not updated, and is reported in `duplicate_import_ids`.',
		),
};

/** Creates one or more transactions in a single call. */
const TransactionsCreateInputSchema = z.object({
	budgetId: BudgetIdSchema,
	transactions: z
		.array(z.object(TransactionInputShape).loose())
		.min(1)
		.max(500),
});

export type TransactionsCreateInput = z.infer<
	typeof TransactionsCreateInputSchema
>;

const TransactionsCreateResponseSchema = envelope(
	z
		.object({
			transaction_ids: z.array(z.string()).nullish(),
			transactions: z.array(TransactionSchema).nullish(),
			duplicate_import_ids: z.array(z.string()).nullish(),
		})
		.loose(),
);

export type TransactionsCreateResponse = z.infer<
	typeof TransactionsCreateResponseSchema
>;

const TransactionsUpdateInputSchema = z.object({
	budgetId: BudgetIdSchema,
	transactionId: IdSchema,
	account_id: IdSchema.optional(),
	date: DateSchema.optional(),
	amount: MilliunitsSchema.optional(),
	payee_id: z.string().nullish(),
	payee_name: z.string().nullish(),
	category_id: z
		.string()
		.nullish()
		.describe('The category, or null to clear it.'),
	memo: z.string().nullish().describe('The memo, or null to clear it.'),
	cleared: z.enum(['cleared', 'uncleared', 'reconciled']).optional(),
	approved: z.boolean().optional(),
	flag_color: z.string().nullish().describe('The flag, or null to clear it.'),
});

export type TransactionsUpdateInput = z.infer<
	typeof TransactionsUpdateInputSchema
>;

const TransactionsUpdateResponseSchema = envelope(
	z.object({ transaction: TransactionSchema.nullish() }).loose(),
);

export type TransactionsUpdateResponse = z.infer<
	typeof TransactionsUpdateResponseSchema
>;

const TransactionsDeleteInputSchema = z.object({
	budgetId: BudgetIdSchema,
	transactionId: IdSchema,
});

export type TransactionsDeleteInput = z.infer<
	typeof TransactionsDeleteInputSchema
>;

const TransactionsDeleteResponseSchema = envelope(
	z.object({ transaction: TransactionSchema.nullish() }).loose(),
);

export type TransactionsDeleteResponse = z.infer<
	typeof TransactionsDeleteResponseSchema
>;

// ── scheduled transactions ────────────────────────────────────────────────

const ScheduledListInputSchema = z.object({
	budgetId: BudgetIdSchema,
	...DeltaSchema,
});

export type ScheduledListInput = z.infer<typeof ScheduledListInputSchema>;

const ScheduledListResponseSchema = envelope(
	z
		.object({
			scheduled_transactions: z.array(ScheduledTransactionSchema).nullish(),
			server_knowledge: ServerKnowledgeSchema,
		})
		.loose(),
);

export type ScheduledListResponse = z.infer<typeof ScheduledListResponseSchema>;

const ScheduledGetInputSchema = z.object({
	budgetId: BudgetIdSchema,
	scheduledTransactionId: IdSchema,
});

export type ScheduledGetInput = z.infer<typeof ScheduledGetInputSchema>;

const ScheduledGetResponseSchema = envelope(
	z
		.object({ scheduled_transaction: ScheduledTransactionSchema.nullish() })
		.loose(),
);

export type ScheduledGetResponse = z.infer<typeof ScheduledGetResponseSchema>;

// A scheduled transaction takes the transaction fields except cleared, approved
// and import_id, which YNAB's SaveScheduledTransaction does not have.
const {
	cleared: _cleared,
	approved: _approved,
	import_id: _importId,
	...ScheduledTransactionInputShape
} = TransactionInputShape;

const ScheduledCreateInputSchema = z.object({
	budgetId: BudgetIdSchema,
	scheduled_transaction: z
		.object({
			...ScheduledTransactionInputShape,
			date: DateSchema.describe(
				'The first date, as `yyyy-MM-dd`: a future date no more than 5 years ahead.',
			),
			frequency: z.enum([
				'never',
				'daily',
				'weekly',
				'everyOtherWeek',
				'twiceAMonth',
				'every4Weeks',
				'monthly',
				'everyOtherMonth',
				'every3Months',
				'every4Months',
				'twiceAYear',
				'yearly',
				'everyOtherYear',
			]),
		})
		.loose(),
});

export type ScheduledCreateInput = z.infer<typeof ScheduledCreateInputSchema>;

const ScheduledCreateResponseSchema = envelope(
	z
		.object({ scheduled_transaction: ScheduledTransactionSchema.nullish() })
		.loose(),
);

export type ScheduledCreateResponse = z.infer<
	typeof ScheduledCreateResponseSchema
>;

const ScheduledDeleteInputSchema = z.object({
	budgetId: BudgetIdSchema,
	scheduledTransactionId: IdSchema,
});

export type ScheduledDeleteInput = z.infer<typeof ScheduledDeleteInputSchema>;

const ScheduledDeleteResponseSchema = ScheduledCreateResponseSchema;

export type ScheduledDeleteResponse = z.infer<
	typeof ScheduledDeleteResponseSchema
>;

// ── user ──────────────────────────────────────────────────────────────────

const UserGetInputSchema = z.object({});

export type UserGetInput = z.infer<typeof UserGetInputSchema>;

const UserGetResponseSchema = envelope(
	z.object({ user: UserSchema.nullish() }).loose(),
);

export type UserGetResponse = z.infer<typeof UserGetResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type YnabEndpointInputs = {
	budgetsList: BudgetsListInput;
	budgetsGet: BudgetsGetInput;
	accountsList: AccountsListInput;
	accountsGet: AccountsGetInput;
	accountsCreate: AccountsCreateInput;
	categoriesList: CategoriesListInput;
	categoriesGet: CategoriesGetInput;
	categoriesUpdate: CategoriesUpdateInput;
	payeesList: PayeesListInput;
	payeesGet: PayeesGetInput;
	payeesCreate: PayeesCreateInput;
	payeesUpdate: PayeesUpdateInput;
	monthsList: MonthsListInput;
	monthsGet: MonthsGetInput;
	transactionsList: TransactionsListInput;
	transactionsGet: TransactionsGetInput;
	transactionsCreate: TransactionsCreateInput;
	transactionsUpdate: TransactionsUpdateInput;
	transactionsDelete: TransactionsDeleteInput;
	scheduledList: ScheduledListInput;
	scheduledGet: ScheduledGetInput;
	scheduledCreate: ScheduledCreateInput;
	scheduledDelete: ScheduledDeleteInput;
	userGet: UserGetInput;
};

export type YnabEndpointOutputs = {
	budgetsList: BudgetsListResponse;
	budgetsGet: BudgetsGetResponse;
	accountsList: AccountsListResponse;
	accountsGet: AccountsGetResponse;
	accountsCreate: AccountsCreateResponse;
	categoriesList: CategoriesListResponse;
	categoriesGet: CategoriesGetResponse;
	categoriesUpdate: CategoriesUpdateResponse;
	payeesList: PayeesListResponse;
	payeesGet: PayeesGetResponse;
	payeesCreate: PayeesCreateResponse;
	payeesUpdate: PayeesUpdateResponse;
	monthsList: MonthsListResponse;
	monthsGet: MonthsGetResponse;
	transactionsList: TransactionsListResponse;
	transactionsGet: TransactionsGetResponse;
	transactionsCreate: TransactionsCreateResponse;
	transactionsUpdate: TransactionsUpdateResponse;
	transactionsDelete: TransactionsDeleteResponse;
	scheduledList: ScheduledListResponse;
	scheduledGet: ScheduledGetResponse;
	scheduledCreate: ScheduledCreateResponse;
	scheduledDelete: ScheduledDeleteResponse;
	userGet: UserGetResponse;
};

export const YnabEndpointInputSchemas = {
	budgetsList: BudgetsListInputSchema,
	budgetsGet: BudgetsGetInputSchema,
	accountsList: AccountsListInputSchema,
	accountsGet: AccountsGetInputSchema,
	accountsCreate: AccountsCreateInputSchema,
	categoriesList: CategoriesListInputSchema,
	categoriesGet: CategoriesGetInputSchema,
	categoriesUpdate: CategoriesUpdateInputSchema,
	payeesList: PayeesListInputSchema,
	payeesGet: PayeesGetInputSchema,
	payeesCreate: PayeesCreateInputSchema,
	payeesUpdate: PayeesUpdateInputSchema,
	monthsList: MonthsListInputSchema,
	monthsGet: MonthsGetInputSchema,
	transactionsList: TransactionsListInputSchema,
	transactionsGet: TransactionsGetInputSchema,
	transactionsCreate: TransactionsCreateInputSchema,
	transactionsUpdate: TransactionsUpdateInputSchema,
	transactionsDelete: TransactionsDeleteInputSchema,
	scheduledList: ScheduledListInputSchema,
	scheduledGet: ScheduledGetInputSchema,
	scheduledCreate: ScheduledCreateInputSchema,
	scheduledDelete: ScheduledDeleteInputSchema,
	userGet: UserGetInputSchema,
} as const;

export const YnabEndpointOutputSchemas = {
	budgetsList: BudgetsListResponseSchema,
	budgetsGet: BudgetsGetResponseSchema,
	accountsList: AccountsListResponseSchema,
	accountsGet: AccountsGetResponseSchema,
	accountsCreate: AccountsCreateResponseSchema,
	categoriesList: CategoriesListResponseSchema,
	categoriesGet: CategoriesGetResponseSchema,
	categoriesUpdate: CategoriesUpdateResponseSchema,
	payeesList: PayeesListResponseSchema,
	payeesGet: PayeesGetResponseSchema,
	payeesCreate: PayeesCreateResponseSchema,
	payeesUpdate: PayeesUpdateResponseSchema,
	monthsList: MonthsListResponseSchema,
	monthsGet: MonthsGetResponseSchema,
	transactionsList: TransactionsListResponseSchema,
	transactionsGet: TransactionsGetResponseSchema,
	transactionsCreate: TransactionsCreateResponseSchema,
	transactionsUpdate: TransactionsUpdateResponseSchema,
	transactionsDelete: TransactionsDeleteResponseSchema,
	scheduledList: ScheduledListResponseSchema,
	scheduledGet: ScheduledGetResponseSchema,
	scheduledCreate: ScheduledCreateResponseSchema,
	scheduledDelete: ScheduledDeleteResponseSchema,
	userGet: UserGetResponseSchema,
} as const;
