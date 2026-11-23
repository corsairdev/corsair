import { z } from 'zod';
import { lazyModule } from './lazy-module';
import { defineOperation } from './operation';

// Schemas and handlers are built the first time one of these operations runs.
function build() {
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

	// Tax-return response fields are omitted when not applicable to that year or filing/payment state.
	const Decimal = z.union([z.string(), z.number()]);

	const CorporationTaxReturn = z
		.object({
			url: z.string().url().optional(),
			period_ends_on: z.string().date().optional(),
			period_starts_on: z.string().date().optional(),
			amount_due: Decimal.optional(),
			payment_due_on: z.string().date().optional(),
			payment_status: z.enum(['unpaid', 'paid', 'marked_as_paid']).optional(),
			filing_due_on: z.string().date().optional(),
			filing_status: z
				.enum([
					'draft',
					'unfiled',
					'pending',
					'rejected',
					'filed',
					'marked_as_filed',
				])
				.optional(),
			filed_at: z.string().optional(),
			filed_reference: z.string().optional(),
		})
		.passthrough();
	const CorporationTaxListInput = z
		.object({ query: PageQuery.optional() })
		.strict();
	const CorporationTaxListData = z
		.object({ corporation_tax_returns: z.array(CorporationTaxReturn) })
		.passthrough();
	const CorporationTaxListOutput = CorporationTaxListData.extend({
		pagination: Pagination,
	}).passthrough();
	const PeriodEndInput = z
		.object({ period_ends_on: z.string().date() })
		.strict();
	const CorporationTaxOutput = z
		.object({ corporation_tax_return: CorporationTaxReturn })
		.passthrough();

	const FinalAccountsReport = z
		.object({
			url: z.string().url().optional(),
			period_ends_on: z.string().date().optional(),
			period_starts_on: z.string().date().optional(),
			filing_due_on: z.string().date().optional(),
			filing_status: z
				.enum([
					'draft',
					'unfiled',
					'pending',
					'rejected',
					'filed',
					'marked_as_filed',
				])
				.optional(),
			filed_at: z.string().optional(),
			filed_reference: z.string().optional(),
		})
		.passthrough();
	const FinalAccountsListInput = z
		.object({ query: PageQuery.optional() })
		.strict();
	const FinalAccountsListData = z
		.object({ final_accounts_reports: z.array(FinalAccountsReport) })
		.passthrough();
	const FinalAccountsListOutput = FinalAccountsListData.extend({
		pagination: Pagination,
	}).passthrough();
	const FinalAccountsOutput = z
		.object({ final_accounts_report: FinalAccountsReport })
		.passthrough();

	const IncomeTaxPayment = z
		.object({
			label: z.string(),
			due_on: z.string().date(),
			amount_due: Decimal,
			status: z.enum(['unpaid', 'paid', 'marked_as_paid']).optional(),
		})
		.passthrough();
	const IncomeTaxReturn = z
		.object({
			url: z.string().url().optional(),
			period_ends_on: z.string().date().optional(),
			period_starts_on: z.string().date().optional(),
			payments: z.array(IncomeTaxPayment).optional(),
			filing_due_on: z.string().date().optional(),
			filing_status: z
				.enum([
					'unfiled',
					'pending',
					'rejected',
					'provisionally_filed',
					'filed',
					'marked_as_filed',
				])
				.optional(),
			filed_at: z.string().optional(),
			filed_reference: z.string().optional(),
		})
		.passthrough();
	const IncomeTaxListInput = z
		.object({ user_id: z.string().min(1), query: PageQuery.optional() })
		.strict();
	const IncomeTaxListData = z
		.object({ self_assessment_returns: z.array(IncomeTaxReturn) })
		.passthrough();
	const IncomeTaxListOutput = IncomeTaxListData.extend({
		pagination: Pagination,
	}).passthrough();
	const IncomeTaxGetInput = z
		.object({ user_id: z.string().min(1), period_ends_on: z.string().date() })
		.strict();
	const IncomeTaxOutput = z
		.object({ self_assessment_return: IncomeTaxReturn })
		.passthrough();
	const IncomeTaxPaymentActionInput = z
		.object({
			user_id: z.string().min(1),
			period_ends_on: z.string().date(),
			payment_date: z.string().date(),
		})
		.strict();

	const VatPayment = z
		.object({
			label: z.string(),
			due_on: z.string().date(),
			amount_due: Decimal,
			status: z.enum(['unpaid', 'paid', 'marked_as_paid']).optional(),
		})
		.passthrough();
	const VatBreakdownRow = z
		.object({
			title: z.string(),
			value: Decimal,
			key: z.string(),
			box_number: z.number().int(),
		})
		.passthrough();
	const VatReturn = z
		.object({
			url: z.string().url().optional(),
			period_ends_on: z.string().date().optional(),
			period_starts_on: z.string().date().optional(),
			payments: z.array(VatPayment).optional(),
			filing_due_on: z.string().date().optional(),
			filing_status: z
				.enum(['unfiled', 'pending', 'rejected', 'filed', 'marked_as_filed'])
				.optional(),
			filed_at: z.string().optional(),
			filed_reference: z.string().optional(),
			breakdown: z
				.object({ title: z.string(), rows: z.array(VatBreakdownRow) })
				.passthrough()
				.optional(),
		})
		.passthrough();
	const VatReturnListInput = z.object({ query: PageQuery.optional() }).strict();
	const VatReturnListData = z
		.object({ vat_returns: z.array(VatReturn) })
		.passthrough();
	const VatReturnListOutput = VatReturnListData.extend({
		pagination: Pagination,
	}).passthrough();
	const VatReturnGetInput = PeriodEndInput;
	const VatReturnOutput = z.object({ vat_return: VatReturn }).passthrough();

	const CorporationTaxReturns = {
		list: defineOperation(CorporationTaxListInput, CorporationTaxListOutput, {
			method: 'GET',
			path: () => '/v2/corporation_tax_returns',
			query: (input) => input.query ?? {},
			paginated: {
				data: CorporationTaxListData,
				combine: (data, pagination) => ({ ...data, pagination }),
			},
		}),
		get: defineOperation(PeriodEndInput, CorporationTaxOutput, {
			method: 'GET',
			path: (input) =>
				`/v2/corporation_tax_returns/${encodeURIComponent(input.period_ends_on)}`,
		}),
		markAsFiled: defineOperation(PeriodEndInput, CorporationTaxOutput, {
			method: 'PUT',
			path: (input) =>
				`/v2/corporation_tax_returns/${encodeURIComponent(input.period_ends_on)}/mark_as_filed`,
		}),
		markAsUnfiled: defineOperation(PeriodEndInput, CorporationTaxOutput, {
			method: 'PUT',
			path: (input) =>
				`/v2/corporation_tax_returns/${encodeURIComponent(input.period_ends_on)}/mark_as_unfiled`,
		}),
		markAsPaid: defineOperation(PeriodEndInput, CorporationTaxOutput, {
			method: 'PUT',
			path: (input) =>
				`/v2/corporation_tax_returns/${encodeURIComponent(input.period_ends_on)}/mark_as_paid`,
		}),
		markAsUnpaid: defineOperation(PeriodEndInput, CorporationTaxOutput, {
			method: 'PUT',
			path: (input) =>
				`/v2/corporation_tax_returns/${encodeURIComponent(input.period_ends_on)}/mark_as_unpaid`,
		}),
	};
	const FinalAccountsReports = {
		list: defineOperation(FinalAccountsListInput, FinalAccountsListOutput, {
			method: 'GET',
			path: () => '/v2/final_accounts_reports',
			query: (input) => input.query ?? {},
			paginated: {
				data: FinalAccountsListData,
				combine: (data, pagination) => ({ ...data, pagination }),
			},
		}),
		get: defineOperation(PeriodEndInput, FinalAccountsOutput, {
			method: 'GET',
			path: (input) =>
				`/v2/final_accounts_reports/${encodeURIComponent(input.period_ends_on)}`,
		}),
		markAsFiled: defineOperation(PeriodEndInput, FinalAccountsOutput, {
			method: 'PUT',
			path: (input) =>
				`/v2/final_accounts_reports/${encodeURIComponent(input.period_ends_on)}/mark_as_filed`,
		}),
		markAsUnfiled: defineOperation(PeriodEndInput, FinalAccountsOutput, {
			method: 'PUT',
			path: (input) =>
				`/v2/final_accounts_reports/${encodeURIComponent(input.period_ends_on)}/mark_as_unfiled`,
		}),
	};
	const IncomeTaxReturns = {
		list: defineOperation(IncomeTaxListInput, IncomeTaxListOutput, {
			method: 'GET',
			path: (input) =>
				`/v2/users/${encodeURIComponent(input.user_id)}/self_assessment_returns`,
			query: (input) => input.query ?? {},
			paginated: {
				data: IncomeTaxListData,
				combine: (data, pagination) => ({ ...data, pagination }),
			},
		}),
		get: defineOperation(IncomeTaxGetInput, IncomeTaxOutput, {
			method: 'GET',
			path: (input) =>
				`/v2/users/${encodeURIComponent(input.user_id)}/self_assessment_returns/${encodeURIComponent(input.period_ends_on)}`,
		}),
		markAsFiled: defineOperation(IncomeTaxGetInput, IncomeTaxOutput, {
			method: 'PUT',
			path: (input) =>
				`/v2/users/${encodeURIComponent(input.user_id)}/self_assessment_returns/${encodeURIComponent(input.period_ends_on)}/mark_as_filed`,
		}),
		markAsUnfiled: defineOperation(IncomeTaxGetInput, IncomeTaxOutput, {
			method: 'PUT',
			path: (input) =>
				`/v2/users/${encodeURIComponent(input.user_id)}/self_assessment_returns/${encodeURIComponent(input.period_ends_on)}/mark_as_unfiled`,
		}),
		markPaymentAsPaid: defineOperation(
			IncomeTaxPaymentActionInput,
			IncomeTaxOutput,
			{
				method: 'PUT',
				path: (input) =>
					`/v2/users/${encodeURIComponent(input.user_id)}/self_assessment_returns/${encodeURIComponent(input.period_ends_on)}/payments/${encodeURIComponent(input.payment_date)}/mark_as_paid`,
			},
		),
		markPaymentAsUnpaid: defineOperation(
			IncomeTaxPaymentActionInput,
			IncomeTaxOutput,
			{
				method: 'PUT',
				path: (input) =>
					`/v2/users/${encodeURIComponent(input.user_id)}/self_assessment_returns/${encodeURIComponent(input.period_ends_on)}/payments/${encodeURIComponent(input.payment_date)}/mark_as_unpaid`,
			},
		),
	};
	const VatReturns = {
		list: defineOperation(VatReturnListInput, VatReturnListOutput, {
			method: 'GET',
			path: () => '/v2/vat_returns',
			query: (input) => input.query ?? {},
			paginated: {
				data: VatReturnListData,
				combine: (data, pagination) => ({ ...data, pagination }),
			},
		}),
		get: defineOperation(VatReturnGetInput, VatReturnOutput, {
			method: 'GET',
			path: (input) =>
				`/v2/vat_returns/${encodeURIComponent(input.period_ends_on)}`,
		}),
		markAsFiled: defineOperation(VatReturnGetInput, VatReturnOutput, {
			method: 'PUT',
			path: (input) =>
				`/v2/vat_returns/${encodeURIComponent(input.period_ends_on)}/mark_as_filed`,
		}),
		markAsUnfiled: defineOperation(VatReturnGetInput, VatReturnOutput, {
			method: 'PUT',
			path: (input) =>
				`/v2/vat_returns/${encodeURIComponent(input.period_ends_on)}/mark_as_unfiled`,
		}),
		markPaymentAsPaid: defineOperation(
			z
				.object({
					period_ends_on: z.string().date(),
					payment_date: z.string().date(),
				})
				.strict(),
			VatReturnOutput,
			{
				method: 'PUT',
				path: (input) =>
					`/v2/vat_returns/${encodeURIComponent(input.period_ends_on)}/payments/${encodeURIComponent(input.payment_date)}/mark_as_paid`,
			},
		),
		markPaymentAsUnpaid: defineOperation(
			z
				.object({
					period_ends_on: z.string().date(),
					payment_date: z.string().date(),
				})
				.strict(),
			VatReturnOutput,
			{
				method: 'PUT',
				path: (input) =>
					`/v2/vat_returns/${encodeURIComponent(input.period_ends_on)}/payments/${encodeURIComponent(input.payment_date)}/mark_as_unpaid`,
			},
		),
	};

	const TaxReturnEndpoints = {
		corporationTaxReturns: CorporationTaxReturns,
		finalAccountsReports: FinalAccountsReports,
		incomeTaxReturns: IncomeTaxReturns,
		vatReturns: VatReturns,
	} as const;

	const TaxReturnEndpointSchemas = {
		'corporationTaxReturns.list': {
			input: CorporationTaxListInput,
			output: CorporationTaxListOutput,
		},
		'corporationTaxReturns.get': {
			input: PeriodEndInput,
			output: CorporationTaxOutput,
		},
		'corporationTaxReturns.markAsFiled': {
			input: PeriodEndInput,
			output: CorporationTaxOutput,
		},
		'corporationTaxReturns.markAsUnfiled': {
			input: PeriodEndInput,
			output: CorporationTaxOutput,
		},
		'corporationTaxReturns.markAsPaid': {
			input: PeriodEndInput,
			output: CorporationTaxOutput,
		},
		'corporationTaxReturns.markAsUnpaid': {
			input: PeriodEndInput,
			output: CorporationTaxOutput,
		},
		'finalAccountsReports.list': {
			input: FinalAccountsListInput,
			output: FinalAccountsListOutput,
		},
		'finalAccountsReports.get': {
			input: PeriodEndInput,
			output: FinalAccountsOutput,
		},
		'finalAccountsReports.markAsFiled': {
			input: PeriodEndInput,
			output: FinalAccountsOutput,
		},
		'finalAccountsReports.markAsUnfiled': {
			input: PeriodEndInput,
			output: FinalAccountsOutput,
		},
		'incomeTaxReturns.list': {
			input: IncomeTaxListInput,
			output: IncomeTaxListOutput,
		},
		'incomeTaxReturns.get': {
			input: IncomeTaxGetInput,
			output: IncomeTaxOutput,
		},
		'incomeTaxReturns.markAsFiled': {
			input: IncomeTaxGetInput,
			output: IncomeTaxOutput,
		},
		'incomeTaxReturns.markAsUnfiled': {
			input: IncomeTaxGetInput,
			output: IncomeTaxOutput,
		},
		'incomeTaxReturns.markPaymentAsPaid': {
			input: IncomeTaxPaymentActionInput,
			output: IncomeTaxOutput,
		},
		'incomeTaxReturns.markPaymentAsUnpaid': {
			input: IncomeTaxPaymentActionInput,
			output: IncomeTaxOutput,
		},
		'vatReturns.list': {
			input: VatReturnListInput,
			output: VatReturnListOutput,
		},
		'vatReturns.get': { input: VatReturnGetInput, output: VatReturnOutput },
		'vatReturns.markAsFiled': {
			input: VatReturnGetInput,
			output: VatReturnOutput,
		},
		'vatReturns.markAsUnfiled': {
			input: VatReturnGetInput,
			output: VatReturnOutput,
		},
		'vatReturns.markPaymentAsPaid': {
			input: z
				.object({
					period_ends_on: z.string().date(),
					payment_date: z.string().date(),
				})
				.strict(),
			output: VatReturnOutput,
		},
		'vatReturns.markPaymentAsUnpaid': {
			input: z
				.object({
					period_ends_on: z.string().date(),
					payment_date: z.string().date(),
				})
				.strict(),
			output: VatReturnOutput,
		},
	} as const;
	return { TaxReturnEndpoints, TaxReturnEndpointSchemas };
}

export const TaxReturnEndpointMeta = {
	'corporationTaxReturns.list': {
		riskLevel: 'read',
		description: 'List company Corporation Tax returns',
	},
	'corporationTaxReturns.get': {
		riskLevel: 'read',
		description: 'Get a Corporation Tax return by period end date',
	},
	'corporationTaxReturns.markAsFiled': {
		riskLevel: 'destructive',
		description: 'Mark a Corporation Tax return as filed',
	},
	'corporationTaxReturns.markAsUnfiled': {
		riskLevel: 'write',
		description: 'Mark a Corporation Tax return as unfiled',
	},
	'corporationTaxReturns.markAsPaid': {
		riskLevel: 'destructive',
		description: 'Mark a Corporation Tax payment as paid',
	},
	'corporationTaxReturns.markAsUnpaid': {
		riskLevel: 'write',
		description: 'Mark a Corporation Tax payment as unpaid',
	},
	'finalAccountsReports.list': {
		riskLevel: 'read',
		description: 'List company final accounts reports',
	},
	'finalAccountsReports.get': {
		riskLevel: 'read',
		description: 'Get a final accounts report by period end date',
	},
	'finalAccountsReports.markAsFiled': {
		riskLevel: 'destructive',
		description: 'Mark a final accounts report as filed',
	},
	'finalAccountsReports.markAsUnfiled': {
		riskLevel: 'write',
		description: 'Mark a final accounts report as unfiled',
	},
	'incomeTaxReturns.list': {
		riskLevel: 'read',
		description: 'List a user’s Self Assessment returns',
	},
	'incomeTaxReturns.get': {
		riskLevel: 'read',
		description: 'Get a user’s Self Assessment return',
	},
	'incomeTaxReturns.markAsFiled': {
		riskLevel: 'destructive',
		description: 'Mark a Self Assessment return as filed',
	},
	'incomeTaxReturns.markAsUnfiled': {
		riskLevel: 'write',
		description: 'Mark a Self Assessment return as unfiled',
	},
	'incomeTaxReturns.markPaymentAsPaid': {
		riskLevel: 'destructive',
		description: 'Mark a Self Assessment payment as paid',
	},
	'incomeTaxReturns.markPaymentAsUnpaid': {
		riskLevel: 'write',
		description: 'Mark a Self Assessment payment as unpaid',
	},
	'vatReturns.list': {
		riskLevel: 'read',
		description: 'List company VAT returns and payment details',
	},
	'vatReturns.get': {
		riskLevel: 'read',
		description: 'Get a VAT return and its filing breakdown',
	},
	'vatReturns.markAsFiled': {
		riskLevel: 'destructive',
		description: 'Mark a VAT return as filed',
	},
	'vatReturns.markAsUnfiled': {
		riskLevel: 'write',
		description: 'Mark a VAT return as unfiled',
	},
	'vatReturns.markPaymentAsPaid': {
		riskLevel: 'destructive',
		description: 'Mark a VAT return payment as paid',
	},
	'vatReturns.markPaymentAsUnpaid': {
		riskLevel: 'write',
		description: 'Mark a VAT return payment as unpaid',
	},
} as const;

const lazy = lazyModule(build, TaxReturnEndpointMeta);
export const TaxReturnEndpoints = lazy.endpoints(
	(module) => module.TaxReturnEndpoints,
);
export const TaxReturnEndpointSchemas = lazy.schemas(
	(module) => module.TaxReturnEndpointSchemas,
);
