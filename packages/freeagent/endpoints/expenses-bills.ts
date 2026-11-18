import { z } from 'zod';
import { defineOperation } from './operation';

// Expense and bill responses conditionally include mileage, tax, attachment, CIS, stock, and asset fields.
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
const Attachment = z
	.object({
		url: z.string().url().optional(),
		content_src: z.string().url().optional(),
		content_src_medium: z.string().url().optional(),
		content_src_small: z.string().url().optional(),
		expires_at: z.string().optional(),
		content_type: z.string().optional(),
		file_name: z.string().optional(),
		file_size: z.number().int().nonnegative().optional(),
		description: z.string().optional(),
	})
	.passthrough();
const AttachmentInput = z
	.object({
		data: z
			.string()
			.min(1)
			.max(6_990_508)
			.regex(/^[A-Za-z0-9+/]*={0,2}$/),
		file_name: z.string().min(1),
		description: z.string().optional(),
		content_type: z.enum([
			'image/png',
			'image/x-png',
			'image/jpeg',
			'image/jpg',
			'image/gif',
			'application/x-pdf',
		]),
	})
	.strict()
	.superRefine((attachment, context) => {
		if (attachment.data.length % 4 !== 0) {
			context.addIssue({
				code: 'custom',
				path: ['data'],
				message: 'Attachment data must be valid base64',
			});
		}
		const padding = attachment.data.endsWith('==')
			? 2
			: attachment.data.endsWith('=')
				? 1
				: 0;
		if ((attachment.data.length * 3) / 4 - padding > 5 * 1024 * 1024) {
			context.addIssue({
				code: 'custom',
				path: ['data'],
				message: 'Expense attachment must not exceed 5 MiB',
			});
		}
	});
const TrackingGroupAssignment = z
	.object({
		url: z.string().url(),
		name: z.string(),
		status: z.enum(['active', 'hidden']),
		labels: z.array(
			z
				.object({
					url: z.string().url(),
					name: z.string(),
					status: z.enum(['active', 'hidden']),
				})
				.strict(),
		),
	})
	.strict();

const BillItemFields = z
	.object({
		category: z.string().url().optional(),
		description: z.string().optional(),
		total_value: Decimal.optional(),
		total_value_ex_tax: Decimal.optional(),
		manual_sales_tax_amount: Decimal.optional(),
		sales_tax_rate: Decimal.optional(),
		second_sales_tax_rate: Decimal.optional(),
		sales_tax_status: z.enum(['TAXABLE', 'EXEMPT', 'OUT_OF_SCOPE']).optional(),
		second_sales_tax_status: z.string().optional(),
		unit: z
			.enum([
				'-no unit-',
				'Hours',
				'Days',
				'Weeks',
				'Months',
				'Years',
				'Products',
				'Services',
				'Training',
				'Stock',
			])
			.optional(),
		quantity: Decimal.optional(),
		stock_item: z.string().url().optional(),
		stock_altering_quantity: Decimal.optional(),
		depreciation_schedule: z.string().optional(),
		capital_asset: z.string().url().optional(),
		project: z.string().url().optional(),
		cis_deduction_rate: Decimal.optional(),
	})
	.strict();
const BillItemCreate = BillItemFields.extend({
	category: z.string().url(),
}).superRefine((item, context) => {
	if (item.total_value === undefined && item.total_value_ex_tax === undefined) {
		context.addIssue({
			code: 'custom',
			message: 'Provide total_value or total_value_ex_tax',
		});
	}
});
const BillItemUpdate = z.union([
	z.object({ url: z.string().url(), _destroy: z.literal(1) }).strict(),
	BillItemFields.extend({ url: z.string().url() }).strict(),
	BillItemCreate.safeExtend({ url: z.literal('') }).strict(),
]);
const BillItem = z
	.object({
		url: z.string().url().optional(),
		bill: z.string().url().optional(),
		category: z.string().url().optional(),
		description: z.string().optional(),
		total_value: Decimal.optional(),
		total_value_ex_tax: Decimal.optional(),
		manual_sales_tax_amount: Decimal.optional(),
		sales_tax_rate: Decimal.optional(),
		second_sales_tax_rate: Decimal.optional(),
		sales_tax_status: z.string().optional(),
		second_sales_tax_status: z.string().optional(),
		unit: z.string().optional(),
		quantity: Decimal.optional(),
		stock_item: z.string().url().optional(),
		stock_item_description: z.string().optional(),
		stock_altering_quantity: Decimal.optional(),
		depreciation_schedule: z.string().optional(),
		capital_asset: z.string().url().optional(),
		project: z.string().url().optional(),
		cis_deduction_rate: Decimal.optional(),
	})
	.passthrough();
const Bill = z
	.object({
		url: z.string().url().optional(),
		contact: z.string().url().optional(),
		reference: z.string().optional(),
		dated_on: z.string().date().optional(),
		due_on: z.string().date().optional(),
		paid_on: z.string().date().optional(),
		status: z
			.enum(['Zero Value', 'Open', 'Paid', 'Overdue', 'Refunded'])
			.optional(),
		long_status: z.string().optional(),
		currency: z.string().optional(),
		input_total_values_inc_tax: z.boolean().optional(),
		total_value: Decimal.optional(),
		due_value: Decimal.optional(),
		native_due_value: Decimal.optional(),
		net_value: Decimal.optional(),
		exchange_rate: Decimal.optional(),
		sales_tax_value: Decimal.optional(),
		second_sales_tax_value: Decimal.optional(),
		is_paid_by_hire_purchase: z.boolean().optional(),
		ec_status: z.string().optional(),
		comments: z.string().optional(),
		project: z.string().url().optional(),
		rebill_type: z.enum(['cost', 'markup', 'price']).optional(),
		rebill_factor: Decimal.optional(),
		rebill_to_project: z.string().url().optional(),
		property: z.string().url().optional(),
		recurring: z.string().optional(),
		recurring_end_date: z.string().date().optional(),
		attachment: Attachment.optional(),
		cis_deduction_band: z.string().optional(),
		cis_deduction_rate: Decimal.optional(),
		cis_deduction: Decimal.optional(),
		cis_deduction_suffered: Decimal.optional(),
		bill_items: z.array(BillItem).optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();
const BillFields = z
	.object({
		contact: z.string().url().optional(),
		reference: z.string().optional(),
		dated_on: z.string().date().optional(),
		due_on: z.string().date().optional(),
		currency: z.string().optional(),
		input_total_values_inc_tax: z.boolean().optional(),
		ec_status: z
			.enum(['UK/Non-EC', 'EC Goods', 'EC Services', 'Reverse Charge'])
			.optional(),
		comments: z.string().optional(),
		project: z.string().url().optional(),
		rebill_type: z.enum(['cost', 'markup', 'price']).optional(),
		rebill_factor: Decimal.optional(),
		rebill_to_project: z.string().url().optional(),
		property: z.string().url().optional(),
		recurring: z
			.enum([
				'Weekly',
				'Two Weekly',
				'Four Weekly',
				'Two Monthly',
				'Quarterly',
				'Biannually',
				'Annually',
				'2-Yearly',
			])
			.optional(),
		recurring_end_date: z.string().date().optional(),
		attachment: AttachmentInput.optional(),
		is_paid_by_hire_purchase: z.boolean().optional(),
		bill_items: z.array(BillItemCreate).max(40).optional(),
	})
	.strict();
const BillCreateInput = z
	.object({
		bill: BillFields.extend({
			contact: z.string().url(),
			reference: z.string().min(1),
			dated_on: z.string().date(),
			due_on: z.string().date(),
			bill_items: z.array(BillItemCreate).min(1).max(40),
		}),
	})
	.strict();
const BillUpdateInput = z
	.object({
		id: z.string().min(1),
		bill: BillFields.extend({
			bill_items: z.array(BillItemUpdate).max(40).optional(),
		}),
	})
	.strict();
const BillGetInput = z.object({ id: z.string().min(1) }).strict();
const BillListInput = z
	.object({
		query: PageQuery.extend({
			view: z
				.enum([
					'all',
					'open',
					'overdue',
					'open_or_overdue',
					'open_or_overdue_payments',
					'open_or_overdue_refunds',
					'paid',
					'recurring',
					'hire_purchase',
					'cis',
				])
				.optional(),
			from_date: z.string().date().optional(),
			to_date: z.string().date().optional(),
			updated_since: z.string().datetime({ offset: true }).optional(),
			contact: z.string().url().optional(),
			project: z.string().url().optional(),
			nested_bill_items: z.boolean().optional(),
		}).optional(),
	})
	.strict();
const BillListData = z.object({ bills: z.array(Bill) }).passthrough();
const BillListOutput = BillListData.extend({
	pagination: Pagination,
}).passthrough();
const BillOutput = z.object({ bill: Bill }).passthrough();

const Expense = z
	.object({
		url: z.string().url().optional(),
		user: z.string().url().optional(),
		category: z.union([z.string().url(), z.literal('Mileage')]).optional(),
		dated_on: z.string().date().optional(),
		currency: z.string().optional(),
		gross_value: Decimal.optional(),
		native_gross_value: Decimal.optional(),
		sales_tax_rate: Decimal.optional(),
		sales_tax_value: Decimal.optional(),
		native_sales_tax_value: Decimal.optional(),
		second_sales_tax_rate: Decimal.optional(),
		manual_sales_tax_amount: Decimal.optional(),
		sales_tax_status: z.string().optional(),
		second_sales_tax_status: z.string().optional(),
		ec_status: z.string().optional(),
		description: z.string().optional(),
		receipt_reference: z.string().optional(),
		stock_item: z.string().url().optional(),
		stock_item_description: z.string().optional(),
		stock_altering_quantity: Decimal.optional(),
		project: z.string().url().optional(),
		rebill_type: z.string().optional(),
		rebill_factor: Decimal.optional(),
		rebill_to_project: z.string().url().optional(),
		rebilled_on_invoice: z.string().url().optional(),
		property: z.string().url().optional(),
		recurring: z.string().optional(),
		next_recurs_on: z.string().date().optional(),
		recurring_end_date: z.string().date().optional(),
		attachment: Attachment.optional(),
		file: z.string().url().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		mileage: Decimal.optional(),
		vehicle_type: z.string().optional(),
		engine_type: z.string().optional(),
		engine_size: z.string().optional(),
		reclaim_mileage: z.number().int().optional(),
		initial_rate_mileage: Decimal.optional(),
		reclaim_mileage_rate: Decimal.optional(),
		rebill_mileage_rate: Decimal.optional(),
		have_vat_receipt: z.boolean().optional(),
		capital_asset: z.string().url().optional(),
		depreciation_schedule: z.string().optional(),
		tracking_groups: z.array(TrackingGroupAssignment).optional(),
	})
	.passthrough();
const ExpenseFields = z
	.object({
		user: z.string().url().optional(),
		category: z.union([z.string().url(), z.literal('Mileage')]).optional(),
		dated_on: z.string().date().optional(),
		currency: z.string().optional(),
		gross_value: Decimal.optional(),
		native_gross_value: Decimal.optional(),
		sales_tax_rate: Decimal.optional(),
		second_sales_tax_rate: Decimal.optional(),
		manual_sales_tax_amount: Decimal.optional(),
		sales_tax_status: z.enum(['TAXABLE', 'EXEMPT', 'OUT_OF_SCOPE']).optional(),
		second_sales_tax_status: z.string().optional(),
		ec_status: z
			.enum(['UK/Non-EC', 'EC Goods', 'EC Services', 'Reverse Charge'])
			.optional(),
		description: z.string().optional(),
		receipt_reference: z.string().optional(),
		stock_item: z.string().url().optional(),
		stock_altering_quantity: Decimal.optional(),
		project: z.string().url().optional(),
		rebill_type: z.enum(['cost', 'markup', 'price']).optional(),
		rebill_factor: Decimal.optional(),
		rebill_to_project: z.string().url().optional(),
		property: z.string().url().optional(),
		recurring: z
			.enum([
				'Weekly',
				'Two Weekly',
				'Four Weekly',
				'Two Monthly',
				'Quarterly',
				'Biannually',
				'Annually',
				'2-Yearly',
			])
			.optional(),
		next_recurs_on: z.string().date().optional(),
		recurring_end_date: z.string().date().optional(),
		attachment: AttachmentInput.optional(),
		file: z.string().url().optional(),
		mileage: Decimal.optional(),
		vehicle_type: z.enum(['Car', 'Motorcycle', 'Bicycle']).optional(),
		engine_type: z
			.enum([
				'Petrol',
				'Diesel',
				'LPG',
				'Electric',
				'Electric (Home charger)',
				'Electric (Public charger)',
			])
			.optional(),
		engine_size: z.string().optional(),
		reclaim_mileage: z.union([z.literal(0), z.literal(1)]).optional(),
		initial_rate_mileage: Decimal.optional(),
		reclaim_mileage_rate: Decimal.optional(),
		rebill_mileage_rate: Decimal.optional(),
		have_vat_receipt: z.boolean().optional(),
		depreciation_schedule: z.string().optional(),
		tracking_group_labels: z.array(z.string().url()).optional(),
	})
	.strict();
const ExpenseCreateFields = ExpenseFields.extend({
	user: z.string().url(),
	category: z.union([z.string().url(), z.literal('Mileage')]),
	dated_on: z.string().date(),
	description: z.string().min(1),
}).superRefine((expense, context) => {
	if (expense.category === 'Mileage') {
		if (expense.mileage === undefined || expense.vehicle_type === undefined) {
			context.addIssue({
				code: 'custom',
				message: 'Mileage expenses require mileage and vehicle_type',
			});
		}
	} else if (expense.gross_value === undefined) {
		context.addIssue({
			code: 'custom',
			message: 'Non-mileage expenses require gross_value',
		});
	}
});
const ExpenseCreateInput = z.object({ expense: ExpenseCreateFields }).strict();
// FreeAgent's API forum documents the batch response envelope, input order, and all-or-nothing failures.
const ExpenseBatchCreateInput = z
	.object({ expenses: z.array(ExpenseCreateFields).min(1) })
	.strict();
const ExpenseBatchCreateOutput = z
	.object({ expenses: z.array(Expense) })
	.passthrough();
const ExpenseUpdateInput = z
	.object({ id: z.string().min(1), expense: ExpenseFields })
	.strict();
const ExpenseGetInput = z.object({ id: z.string().min(1) }).strict();
const ExpenseListInput = z
	.object({
		query: PageQuery.extend({
			view: z.enum(['all', 'recent', 'recurring']).optional(),
			from_date: z.string().date().optional(),
			to_date: z.string().date().optional(),
			updated_since: z.string().datetime({ offset: true }).optional(),
			project: z.string().url().optional(),
		}).optional(),
	})
	.strict();
const ExpenseListData = z.object({ expenses: z.array(Expense) }).passthrough();
const ExpenseListOutput = ExpenseListData.extend({
	pagination: Pagination,
}).passthrough();
const ExpenseOutput = z.object({ expense: Expense }).passthrough();
const MileageEngineOption = z
	.object({
		from: z.string().date(),
		to: z.string().date(),
		value: z.record(z.string(), z.array(z.string())),
	})
	.strict();
const MileageRateValue = z
	.object({
		Car: z
			.object({ basic_rate: Decimal, additional_rate: Decimal })
			.strict()
			.optional(),
		Motorcycle: z
			.object({ basic_rate: Decimal, additional_rate: Decimal })
			.strict()
			.optional(),
		Bicycle: z
			.object({ basic_rate: Decimal, additional_rate: Decimal })
			.strict()
			.optional(),
		basic_rate_limit: z.number().optional(),
	})
	.strict();
const MileageRateOption = z
	.object({
		from: z.string().date(),
		to: z.string().date(),
		value: MileageRateValue,
	})
	.strict();
const MileageSettingsOutput = z
	.object({
		mileage_settings: z
			.object({
				engine_type_and_size_options: z.array(MileageEngineOption),
				mileage_rates: z.array(MileageRateOption),
			})
			.strict(),
	})
	.strict();

const Bills = {
	list: defineOperation(BillListInput, BillListOutput, {
		method: 'GET',
		path: () => '/v2/bills',
		query: (input) => input.query ?? {},
		paginated: {
			data: BillListData,
			combine: (data, pagination) => ({ ...data, pagination }),
		},
	}),
	get: defineOperation(BillGetInput, BillOutput, {
		method: 'GET',
		path: (input) => `/v2/bills/${encodeURIComponent(input.id)}`,
	}),
	create: defineOperation(BillCreateInput, BillOutput, {
		method: 'POST',
		path: () => '/v2/bills',
		body: (input) => ({ bill: input.bill }),
	}),
	update: defineOperation(BillUpdateInput, EmptyResponse, {
		method: 'PUT',
		path: (input) => `/v2/bills/${encodeURIComponent(input.id)}`,
		body: (input) => ({ bill: input.bill }),
	}),
	delete: defineOperation(BillGetInput, EmptyResponse, {
		method: 'DELETE',
		path: (input) => `/v2/bills/${encodeURIComponent(input.id)}`,
	}),
};
const Expenses = {
	list: defineOperation(ExpenseListInput, ExpenseListOutput, {
		method: 'GET',
		path: () => '/v2/expenses',
		query: (input) => input.query ?? {},
		paginated: {
			data: ExpenseListData,
			combine: (data, pagination) => ({ ...data, pagination }),
		},
	}),
	get: defineOperation(ExpenseGetInput, ExpenseOutput, {
		method: 'GET',
		path: (input) => `/v2/expenses/${encodeURIComponent(input.id)}`,
	}),
	create: defineOperation(ExpenseCreateInput, ExpenseOutput, {
		method: 'POST',
		path: () => '/v2/expenses',
		body: (input) => ({ expense: input.expense }),
	}),
	batchCreate: defineOperation(
		ExpenseBatchCreateInput,
		ExpenseBatchCreateOutput,
		{
			method: 'POST',
			path: () => '/v2/expenses',
			body: (input) => ({ expenses: input.expenses }),
		},
	),
	update: defineOperation(ExpenseUpdateInput, EmptyResponse, {
		method: 'PUT',
		path: (input) => `/v2/expenses/${encodeURIComponent(input.id)}`,
		body: (input) => ({ expense: input.expense }),
	}),
	delete: defineOperation(ExpenseGetInput, EmptyResponse, {
		method: 'DELETE',
		path: (input) => `/v2/expenses/${encodeURIComponent(input.id)}`,
	}),
	mileageSettings: defineOperation(
		z.object({}).strict(),
		MileageSettingsOutput,
		{
			method: 'GET',
			path: () => '/v2/expenses/mileage_settings',
		},
	),
};

export const ExpensesBillsEndpoints = {
	bills: Bills,
	expenses: Expenses,
} as const;

export const ExpensesBillsEndpointSchemas = {
	'bills.list': { input: BillListInput, output: BillListOutput },
	'bills.get': { input: BillGetInput, output: BillOutput },
	'bills.create': { input: BillCreateInput, output: BillOutput },
	'bills.update': { input: BillUpdateInput, output: EmptyResponse },
	'bills.delete': { input: BillGetInput, output: EmptyResponse },
	'expenses.list': { input: ExpenseListInput, output: ExpenseListOutput },
	'expenses.get': { input: ExpenseGetInput, output: ExpenseOutput },
	'expenses.create': { input: ExpenseCreateInput, output: ExpenseOutput },
	'expenses.batchCreate': {
		input: ExpenseBatchCreateInput,
		output: ExpenseBatchCreateOutput,
	},
	'expenses.update': { input: ExpenseUpdateInput, output: EmptyResponse },
	'expenses.delete': { input: ExpenseGetInput, output: EmptyResponse },
	'expenses.mileageSettings': {
		input: z.object({}).strict(),
		output: MileageSettingsOutput,
	},
} as const;

export const ExpensesBillsEndpointMeta = {
	'bills.list': {
		riskLevel: 'read',
		description: 'List company bills with filters, nested items and pagination',
	},
	'bills.get': {
		riskLevel: 'read',
		description: 'Get a bill and its bill items',
	},
	'bills.create': {
		riskLevel: 'write',
		description: 'Create a bill with documented bill items',
	},
	'bills.update': {
		riskLevel: 'write',
		description: 'Update a bill and its identified bill items',
	},
	'bills.delete': { riskLevel: 'destructive', description: 'Delete a bill' },
	'expenses.list': {
		riskLevel: 'read',
		description: 'List expenses with documented filters and pagination',
	},
	'expenses.get': {
		riskLevel: 'read',
		description: 'Get an expense and its attachment metadata',
	},
	'expenses.create': {
		riskLevel: 'write',
		description: 'Create a regular or mileage expense',
	},
	'expenses.batchCreate': {
		riskLevel: 'write',
		description: 'Create expenses atomically in one documented batch request',
	},
	'expenses.update': {
		riskLevel: 'write',
		description: 'Update documented expense fields',
	},
	'expenses.delete': {
		riskLevel: 'destructive',
		description: 'Delete an expense',
	},
	'expenses.mileageSettings': {
		riskLevel: 'read',
		description:
			'Get mileage engine options and historical reimbursement rates',
	},
} as const;
