import { z } from 'zod';
import { defineOperation } from './operation';

// FreeAgent accounting reports and category records have optional, account-specific response fields that vary by report and company configuration.
const EmptyResponse = z.union([z.object({}).strict(), z.undefined()]);
const Decimal = z.union([z.string(), z.number()]);
const PageQuery = z
	.object({
		page: z.number().int().positive().optional(),
		per_page: z.number().int().min(1).max(100).optional(),
	})
	.strict();
const Pagination = z.object({
	link: z.string().nullable(),
	total_count: z.string().regex(/^\d+$/).nullable(),
});

const Category = z
	.object({
		url: z.string().url().optional(),
		description: z.string().optional(),
		nominal_code: z.string().optional(),
		group_description: z.string().optional(),
		allowable_for_tax: z.union([z.boolean(), z.string()]).optional(),
		tax_reporting_name: z.string().optional(),
		auto_sales_tax_rate: z.string().optional(),
		bank_account: z.string().url().optional(),
		capital_asset_type: z.string().url().optional(),
		stock_item: z.string().url().optional(),
		hire_purchase: z.string().url().optional(),
		user: z.string().url().optional(),
	})
	.passthrough();
const CategoryEnvelope = z
	.object({
		admin_expenses_categories: z
			.union([Category, z.array(Category)])
			.optional(),
		cost_of_sales_categories: z.union([Category, z.array(Category)]).optional(),
		income_categories: z.union([Category, z.array(Category)]).optional(),
		general_categories: z.union([Category, z.array(Category)]).optional(),
	})
	.passthrough();
const CategoryListOutput = CategoryEnvelope.extend({
	pagination: Pagination,
}).passthrough();
const CategoryFields = z
	.object({
		description: z.string().min(1).optional(),
		nominal_code: z
			.string()
			.regex(/^\d{3}(?:-\d+)?$/)
			.optional(),
		category_group: z
			.enum([
				'income',
				'cost_of_sales',
				'admin_expenses',
				'current_assets',
				'liabilities',
				'equities',
			])
			.optional(),
		tax_reporting_name: z.string().optional(),
		allowable_for_tax: z.boolean().optional(),
		auto_sales_tax_rate: z
			.enum([
				'Outside of the scope of VAT',
				'Zero rate',
				'Reduced rate',
				'Standard rate',
				'Exempt',
			])
			.optional(),
	})
	.strict();
const CategoryCreate = CategoryFields.extend({
	description: z.string().min(1),
	nominal_code: z.string().regex(/^\d{3}(?:-\d+)?$/),
	category_group: z.enum([
		'income',
		'cost_of_sales',
		'admin_expenses',
		'current_assets',
		'liabilities',
		'equities',
	]),
}).superRefine((value, context) => {
	const nominal = Number(value.nominal_code.split('-')[0]);
	const validRange =
		(value.category_group === 'income' && nominal >= 1 && nominal <= 49) ||
		(value.category_group === 'cost_of_sales' &&
			nominal >= 96 &&
			nominal <= 199) ||
		(value.category_group === 'admin_expenses' &&
			nominal >= 200 &&
			nominal <= 399) ||
		(value.category_group === 'current_assets' &&
			nominal >= 671 &&
			nominal <= 720) ||
		(value.category_group === 'liabilities' &&
			nominal >= 731 &&
			nominal <= 780) ||
		(value.category_group === 'equities' && nominal >= 921 && nominal <= 960);
	if (!validRange) {
		context.addIssue({
			code: 'custom',
			path: ['nominal_code'],
			message: 'nominal_code is outside the documented category_group range',
		});
	}
});
const CategoryUpdate = CategoryFields.refine(
	(value) => Object.keys(value).length > 0,
	{ message: 'Provide at least one category field to update' },
);
const CategoryListInput = z
	.object({
		query: PageQuery.extend({
			sub_accounts: z.boolean().optional(),
		}).optional(),
	})
	.strict();
const CategoryGetInput = z.object({ nominal_code: z.string().min(1) }).strict();
const CategoryCreateInput = z.object({ category: CategoryCreate }).strict();
const CategoryUpdateInput = z
	.object({ nominal_code: z.string().min(1), category: CategoryUpdate })
	.strict();
const CategoryDeleteInput = CategoryGetInput;

const ReportDateQuery = z
	.object({
		from_date: z.string().date().optional(),
		to_date: z.string().date().optional(),
	})
	.strict();
const BalanceSheetInput = z
	.object({
		query: z
			.object({ as_at_date: z.string().date().optional() })
			.strict()
			.optional(),
	})
	.strict();
const BalanceAccount = z
	.object({
		name: z.string(),
		nominal_code: z.string(),
		total_debit_value: z.number(),
	})
	.passthrough();
const BalanceSheet = z
	.object({
		accounting_period_start_date: z.string().date().optional(),
		as_at_date: z.string().date().optional(),
		currency: z.string().optional(),
		capital_assets: z
			.object({
				accounts: z.array(BalanceAccount),
				net_book_value: z.number().optional(),
			})
			.passthrough()
			.optional(),
		current_assets: z
			.object({ accounts: z.array(BalanceAccount) })
			.passthrough()
			.optional(),
		current_liabilities: z
			.object({ accounts: z.array(BalanceAccount) })
			.passthrough()
			.optional(),
		net_current_assets: z.number().optional(),
		total_assets: z.number().optional(),
		owners_equity: z
			.object({
				accounts: z.array(BalanceAccount),
				retained_profit: z.number().optional(),
			})
			.passthrough()
			.optional(),
		total_owners_equity: z.number().optional(),
	})
	.passthrough();
const BalanceSheetOutput = z
	.object({ balance_sheet: BalanceSheet })
	.passthrough();
const TrialBalanceInput = z
	.object({ query: ReportDateQuery.optional() })
	.strict();
const TrialBalanceEntry = z
	.object({
		category: z.string().url().optional(),
		nominal_code: z.string().optional(),
		display_nominal_code: z.string().optional(),
		name: z.string().optional(),
		total: Decimal.optional(),
		bank_account: z.string().url().optional(),
		user: z.string().url().optional(),
	})
	.passthrough();
const TrialBalanceOutput = z
	.object({ trial_balance_summary: z.array(TrialBalanceEntry) })
	.passthrough();
const ProfitLossInput = z
	.object({
		query: ReportDateQuery.extend({
			accounting_period: z
				.string()
				.regex(/^\d{4}\/\d{2}$/)
				.optional(),
		}).optional(),
	})
	.strict();
const ProfitLossOutput = z
	.object({
		profit_and_loss_summary: z
			.object({
				from: z.string().date().optional(),
				to: z.string().date().optional(),
				income: Decimal.optional(),
				expenses: Decimal.optional(),
				operating_profit: Decimal.optional(),
				less: z
					.array(z.object({ title: z.string(), total: Decimal }).passthrough())
					.optional(),
				retained_profit: Decimal.optional(),
				retained_profit_brought_forward: Decimal.optional(),
				retained_profit_carried_forward: Decimal.optional(),
			})
			.passthrough(),
	})
	.passthrough();
const CashflowInput = z
	.object({
		query: z
			.object({ from_date: z.string().date(), to_date: z.string().date() })
			.strict(),
	})
	.strict();
const CashflowMonth = z
	.object({
		month: z.number().int().min(1).max(12),
		year: z.number().int(),
		total: Decimal,
	})
	.passthrough();
const CashflowPeriod = z
	.object({ total: Decimal, months: z.array(CashflowMonth) })
	.passthrough();
const CashflowOutput = z
	.object({
		cashflow: z
			.object({
				from: z.string().date(),
				to: z.string().date(),
				incoming: CashflowPeriod,
				outgoing: CashflowPeriod,
				balance: Decimal,
			})
			.passthrough(),
	})
	.passthrough();

const ForeignCurrencyData = z
	.object({
		currency_code: z.string().optional(),
		debit_value: Decimal.optional(),
	})
	.passthrough();
const Transaction = z
	.object({
		url: z.string().url().optional(),
		dated_on: z.string().date().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		description: z.string().optional(),
		category: z.string().url().optional(),
		category_name: z.string().optional(),
		nominal_code: z.string().optional(),
		debit_value: Decimal.optional(),
		source_item_url: z.string().url().optional(),
		foreign_currency_data: ForeignCurrencyData.optional(),
	})
	.passthrough();
const TransactionListInput = z
	.object({
		query: ReportDateQuery.extend({
			nominal_code: z.string().optional(),
		}).optional(),
	})
	.strict();
const TransactionListData = z
	.object({ transactions: z.array(Transaction) })
	.passthrough();
const TransactionListOutput = TransactionListData.extend({
	pagination: Pagination,
}).passthrough();
const TransactionGetInput = z.object({ id: z.string().min(1) }).strict();
const TransactionGetOutput = z
	.object({ transaction: Transaction })
	.passthrough();

const CisBand = z
	.object({
		name: z.enum(['cis_gross', 'cis_standard', 'cis_higher']),
		deduction_rate: Decimal,
		income_description: z.string(),
		deduction_description: z.string(),
		nominal_code: z.string(),
	})
	.passthrough();
const CisBandsInput = z.object({}).strict();
const CisBandsOutput = z
	.object({ available_bands: z.array(CisBand) })
	.passthrough();
const PriorDeductions = z
	.object({ start_date: z.string().date(), initial_balance: Decimal })
	.strict();
const ContractorDetails = z
	.object({
		reporting_starts_on: z.string().date().optional(),
		paye_ni_period: z.enum(['Monthly', 'Quarterly']).optional(),
	})
	.strict();
const SubcontractorDetails = z
	.object({
		cis_deduction_rates: z
			.array(z.enum(['cis_gross', 'cis_standard', 'cis_higher']))
			.optional(),
		prior_deductions: PriorDeductions.nullable().optional(),
	})
	.strict();
const CisSettingsShape = z
	.object({
		contractor_details: ContractorDetails.nullable(),
		subcontractor_details: SubcontractorDetails.nullable(),
	})
	.strict();
const CisSettingsInput = z.object({}).strict();
const CisSettingsUpdateInput = z
	.object({
		cis_settings: z
			.object({
				contractor_details: ContractorDetails.nullable().optional(),
				subcontractor_details: SubcontractorDetails.nullable().optional(),
			})
			.strict(),
	})
	.strict();
const CisSettingsOutput = z
	.object({ cis_settings: CisSettingsShape })
	.passthrough();

const JournalEntry = z
	.object({
		url: z.string().optional(),
		category: z.string().url().optional(),
		debit_value: Decimal.optional(),
		description: z.string().optional(),
		capital_asset_type: z.string().url().optional(),
		user: z.string().url().optional(),
		stock_item: z.string().url().optional(),
		stock_altering_quantity: z.number().int().optional(),
		bank_account: z.string().url().optional(),
		property: z.string().url().optional(),
		contact: z.string().url().optional(),
	})
	.passthrough();
const JournalEntryInput = z
	.object({
		category: z.string().url(),
		debit_value: Decimal,
		description: z.string().optional(),
		capital_asset_type: z.string().url().optional(),
		user: z.string().url().optional(),
		stock_item: z.string().url().optional(),
		stock_altering_quantity: z.number().int().optional(),
		bank_account: z.string().url().optional(),
		property: z.string().url().optional(),
		contact: z.string().url().optional(),
	})
	.strict();
const JournalSet = z
	.object({
		url: z.string().url().optional(),
		dated_on: z.string().date().optional(),
		description: z.string().optional(),
		updated_at: z.string().optional(),
		tag: z.string().optional(),
		journal_entries: z.array(JournalEntry).optional(),
		bank_accounts: z
			.array(
				z
					.object({
						url: z.string().url(),
						description: z.string(),
						debit_value: Decimal,
					})
					.passthrough(),
			)
			.optional(),
		stock_items: z
			.array(
				z
					.object({
						url: z.string().url(),
						description: z.string(),
						debit_value: Decimal,
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();
const JournalSetFields = z
	.object({
		dated_on: z.string().date().optional(),
		description: z.string().min(1).optional(),
		tag: z.string().optional(),
		journal_entries: z.array(JournalEntryInput).min(2),
	})
	.strict();
const JournalSetCreate = JournalSetFields.extend({
	dated_on: z.string().date(),
	description: z.string().min(1),
});
const JournalSetListInput = z
	.object({
		query: PageQuery.extend({
			from_date: z.string().date().optional(),
			to_date: z.string().date().optional(),
			updated_since: z.string().datetime({ offset: true }).optional(),
			tag: z.string().optional(),
		}).optional(),
	})
	.strict();
const JournalSetListData = z
	.object({ journal_sets: z.array(JournalSet) })
	.passthrough();
const JournalSetListOutput = JournalSetListData.extend({
	pagination: Pagination,
}).passthrough();
const JournalSetGetInput = z.object({ id: z.string().min(1) }).strict();
const JournalSetGetOutput = z.object({ journal_set: JournalSet }).passthrough();
const JournalSetBodyInput = z
	.object({ journal_set: JournalSetCreate })
	.strict();
const JournalSetBodyOutput = JournalSetGetOutput;
const JournalSetUpdateInput = z
	.object({ id: z.string().min(1), journal_set: JournalSetFields })
	.strict();
const JournalSetDeleteInput = JournalSetGetInput;

const Categories = {
	list: defineOperation(CategoryListInput, CategoryListOutput, {
		method: 'GET',
		path: () => '/v2/categories',
		query: (input) => input.query ?? {},
		paginated: {
			data: CategoryEnvelope,
			combine: (data, pagination) => ({ ...data, pagination }),
		},
	}),
	get: defineOperation(CategoryGetInput, CategoryEnvelope, {
		method: 'GET',
		path: (input) => `/v2/categories/${encodeURIComponent(input.nominal_code)}`,
	}),
	create: defineOperation(CategoryCreateInput, CategoryEnvelope, {
		method: 'POST',
		path: () => '/v2/categories',
		body: (input) => ({ category: input.category }),
	}),
	update: defineOperation(CategoryUpdateInput, CategoryEnvelope, {
		method: 'PUT',
		path: (input) => `/v2/categories/${encodeURIComponent(input.nominal_code)}`,
		body: (input) => ({ category: input.category }),
	}),
	delete: defineOperation(CategoryDeleteInput, CategoryEnvelope, {
		method: 'DELETE',
		path: (input) => `/v2/categories/${encodeURIComponent(input.nominal_code)}`,
	}),
};
const BalanceSheets = {
	get: defineOperation(BalanceSheetInput, BalanceSheetOutput, {
		method: 'GET',
		path: () => '/v2/accounting/balance_sheet',
		query: (input) => input.query ?? {},
	}),
	openingBalances: defineOperation(z.object({}).strict(), BalanceSheetOutput, {
		method: 'GET',
		path: () => '/v2/accounting/balance_sheet/opening_balances',
	}),
};
const Cis = {
	bands: defineOperation(CisBandsInput, CisBandsOutput, {
		method: 'GET',
		path: () => '/v2/cis_bands',
	}),
	getSettings: defineOperation(CisSettingsInput, CisSettingsOutput, {
		method: 'GET',
		path: () => '/v2/cis_settings',
	}),
	updateSettings: defineOperation(CisSettingsUpdateInput, CisSettingsOutput, {
		method: 'PUT',
		path: () => '/v2/cis_settings',
		body: (input) => ({ cis_settings: input.cis_settings }),
	}),
};
const FinancialReports = {
	cashflow: defineOperation(CashflowInput, CashflowOutput, {
		method: 'GET',
		path: () => '/v2/cashflow',
		query: (input) => input.query,
	}),
	profitAndLoss: defineOperation(ProfitLossInput, ProfitLossOutput, {
		method: 'GET',
		path: () => '/v2/accounting/profit_and_loss/summary',
		query: (input) => input.query ?? {},
	}),
	trialBalance: defineOperation(TrialBalanceInput, TrialBalanceOutput, {
		method: 'GET',
		path: () => '/v2/accounting/trial_balance/summary',
		query: (input) => input.query ?? {},
	}),
	trialBalanceOpeningBalances: defineOperation(
		z.object({}).strict(),
		TrialBalanceOutput,
		{
			method: 'GET',
			path: () => '/v2/accounting/trial_balance/summary/opening_balances',
		},
	),
	transactionsList: defineOperation(
		TransactionListInput,
		TransactionListOutput,
		{
			method: 'GET',
			path: () => '/v2/accounting/transactions',
			query: (input) => input.query ?? {},
			paginated: {
				data: TransactionListData,
				combine: (data, pagination) => ({ ...data, pagination }),
			},
		},
	),
	transactionsGet: defineOperation(TransactionGetInput, TransactionGetOutput, {
		method: 'GET',
		path: (input) =>
			`/v2/accounting/transactions/${encodeURIComponent(input.id)}`,
	}),
};
const JournalSets = {
	list: defineOperation(JournalSetListInput, JournalSetListOutput, {
		method: 'GET',
		path: () => '/v2/journal_sets',
		query: (input) => input.query ?? {},
		paginated: {
			data: JournalSetListData,
			combine: (data, pagination) => ({ ...data, pagination }),
		},
	}),
	get: defineOperation(JournalSetGetInput, JournalSetGetOutput, {
		method: 'GET',
		path: (input) => `/v2/journal_sets/${encodeURIComponent(input.id)}`,
	}),
	openingBalances: defineOperation(z.object({}).strict(), JournalSetGetOutput, {
		method: 'GET',
		path: () => '/v2/journal_sets/opening_balances',
	}),
	create: defineOperation(JournalSetBodyInput, JournalSetBodyOutput, {
		method: 'POST',
		path: () => '/v2/journal_sets',
		body: (input) => ({ journal_set: input.journal_set }),
	}),
	update: defineOperation(JournalSetUpdateInput, JournalSetBodyOutput, {
		method: 'PUT',
		path: (input) => `/v2/journal_sets/${encodeURIComponent(input.id)}`,
		body: (input) => ({ journal_set: input.journal_set }),
	}),
	delete: defineOperation(JournalSetDeleteInput, EmptyResponse, {
		method: 'DELETE',
		path: (input) => `/v2/journal_sets/${encodeURIComponent(input.id)}`,
	}),
};

export const AccountingEndpoints = {
	categories: Categories,
	balanceSheet: BalanceSheets,
	cis: Cis,
	financialReports: FinancialReports,
	journalSets: JournalSets,
} as const;

export const AccountingEndpointSchemas = {
	'categories.list': { input: CategoryListInput, output: CategoryListOutput },
	'categories.get': { input: CategoryGetInput, output: CategoryEnvelope },
	'categories.create': { input: CategoryCreateInput, output: CategoryEnvelope },
	'categories.update': { input: CategoryUpdateInput, output: CategoryEnvelope },
	'categories.delete': { input: CategoryDeleteInput, output: CategoryEnvelope },
	'balanceSheet.get': { input: BalanceSheetInput, output: BalanceSheetOutput },
	'balanceSheet.openingBalances': {
		input: z.object({}).strict(),
		output: BalanceSheetOutput,
	},
	'cis.bands': { input: CisBandsInput, output: CisBandsOutput },
	'cis.getSettings': { input: CisSettingsInput, output: CisSettingsOutput },
	'cis.updateSettings': {
		input: CisSettingsUpdateInput,
		output: CisSettingsOutput,
	},
	'financialReports.cashflow': { input: CashflowInput, output: CashflowOutput },
	'financialReports.profitAndLoss': {
		input: ProfitLossInput,
		output: ProfitLossOutput,
	},
	'financialReports.trialBalance': {
		input: TrialBalanceInput,
		output: TrialBalanceOutput,
	},
	'financialReports.trialBalanceOpeningBalances': {
		input: z.object({}).strict(),
		output: TrialBalanceOutput,
	},
	'financialReports.transactionsList': {
		input: TransactionListInput,
		output: TransactionListOutput,
	},
	'financialReports.transactionsGet': {
		input: TransactionGetInput,
		output: TransactionGetOutput,
	},
	'journalSets.list': {
		input: JournalSetListInput,
		output: JournalSetListOutput,
	},
	'journalSets.get': { input: JournalSetGetInput, output: JournalSetGetOutput },
	'journalSets.openingBalances': {
		input: z.object({}).strict(),
		output: JournalSetGetOutput,
	},
	'journalSets.create': {
		input: JournalSetBodyInput,
		output: JournalSetBodyOutput,
	},
	'journalSets.update': {
		input: JournalSetUpdateInput,
		output: JournalSetBodyOutput,
	},
	'journalSets.delete': { input: JournalSetDeleteInput, output: EmptyResponse },
} as const;

export const AccountingEndpointMeta = {
	'categories.list': {
		riskLevel: 'read',
		description: 'List company accounting categories and subaccounts',
	},
	'categories.get': {
		riskLevel: 'read',
		description: 'Get an accounting category by nominal code',
	},
	'categories.create': {
		riskLevel: 'write',
		description: 'Create a user-defined accounting category',
	},
	'categories.update': {
		riskLevel: 'write',
		description: 'Update an unused user-defined accounting category',
	},
	'categories.delete': {
		riskLevel: 'destructive',
		description: 'Delete an unused user-defined accounting category',
	},
	'balanceSheet.get': {
		riskLevel: 'read',
		description: 'Get the company balance sheet for an optional as-at date',
	},
	'balanceSheet.openingBalances': {
		riskLevel: 'read',
		description: 'Get balance-sheet opening balances',
	},
	'cis.bands': {
		riskLevel: 'read',
		description: 'List company Construction Industry Scheme deduction bands',
	},
	'cis.getSettings': {
		riskLevel: 'read',
		description: 'Get the company Construction Industry Scheme settings',
	},
	'cis.updateSettings': {
		riskLevel: 'write',
		description:
			'Update or deregister company Construction Industry Scheme settings',
	},
	'financialReports.cashflow': {
		riskLevel: 'read',
		description: 'Get historic cashflow for a date range',
	},
	'financialReports.profitAndLoss': {
		riskLevel: 'read',
		description: 'Get the profit and loss summary for a period',
	},
	'financialReports.trialBalance': {
		riskLevel: 'read',
		description: 'Get the trial balance for an optional date range',
	},
	'financialReports.trialBalanceOpeningBalances': {
		riskLevel: 'read',
		description: 'Get trial-balance opening balances',
	},
	'financialReports.transactionsList': {
		riskLevel: 'read',
		description: 'List accounting transactions in a period',
	},
	'financialReports.transactionsGet': {
		riskLevel: 'read',
		description: 'Get an accounting transaction by ID',
	},
	'journalSets.list': {
		riskLevel: 'read',
		description: 'List journal sets with date, tag and pagination filters',
	},
	'journalSets.get': {
		riskLevel: 'read',
		description: 'Get a journal set and its entries',
	},
	'journalSets.openingBalances': {
		riskLevel: 'read',
		description: 'Get opening-balance journal entries',
	},
	'journalSets.create': {
		riskLevel: 'write',
		description: 'Create a balanced journal set',
	},
	'journalSets.update': {
		riskLevel: 'write',
		description: 'Update a journal set',
	},
	'journalSets.delete': {
		riskLevel: 'destructive',
		description: 'Delete a journal set',
	},
} as const;
