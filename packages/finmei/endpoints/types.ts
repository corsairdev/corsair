import { z } from 'zod';

/**
 * Shared pagination metadata returned by Finmei list endpoints.
 */
export const FinmeiPaginationMetaSchema = z.object({
	current_page: z.number().optional().nullable(),
	from: z.number().optional().nullable(),
	last_page: z.number().optional().nullable(),
	path: z.string().optional().nullable(),
	per_page: z.number().optional().nullable(),
	to: z.number().optional().nullable(),
	total: z.number().optional().nullable(),
});
export type FinmeiPaginationMeta = z.infer<typeof FinmeiPaginationMetaSchema>;

/**
 * Binary response schema for file/PDF downloads.
 */
export const FinmeiBinaryResponseSchema = z.object({
	kind: z.literal('binary'),
	contentType: z.string(),
	base64: z.string(),
	size: z.number().optional(),
});
export type FinmeiBinaryResponse = z.infer<typeof FinmeiBinaryResponseSchema>;

/**
 * Delete response schema: Finmei returns empty body, null, or a status object.
 * // `passthrough` because provider delete response may contain arbitrary status flags.
 */
export const FinmeiDeleteResponseSchema = z
	.object({
		success: z.boolean().optional(),
	})
	.passthrough()
	.or(z.null())
	.optional();
export type FinmeiDeleteResponse = z.infer<typeof FinmeiDeleteResponseSchema>;

/**
 * Currency item schema.
 */
export const FinmeiCurrencySchema = z.object({
	code: z.string(),
	title: z.string().optional(),
});
export type FinmeiCurrency = z.infer<typeof FinmeiCurrencySchema>;

/**
 * Business profile schema.
 */
export const FinmeiProfileSchema = z.object({
	business_id: z.string(),
	business_title: z.string().nullable().optional(),
	business_type: z.string().nullable().optional(),
	address: z.string().nullable().optional(),
	vat_code: z.string().nullable().optional(),
	company_name: z.string().nullable().optional(),
	company_code: z.string().nullable().optional(),
	individual_tax_id: z.string().nullable().optional(),
	first_name: z.string().nullable().optional(),
	last_name: z.string().nullable().optional(),
});
export type FinmeiProfile = z.infer<typeof FinmeiProfileSchema>;

/**
 * Expense entity schema.
 */
export const FinmeiExpenseSchema = z.object({
	id: z.string(),
	date: z.string().nullable().optional(),
	total: z.number(),
	currency: z.string(),
	seller: z.string().nullable().optional(),
	created_at: z.union([z.number(), z.string()]).nullable().optional(),
	updated_at: z.union([z.number(), z.string()]).nullable().optional(),
});
export type FinmeiExpense = z.infer<typeof FinmeiExpenseSchema>;

/**
 * Invoice line item schema.
 */
export const FinmeiInvoiceItemSchema = z.object({
	id: z.string().optional(),
	name: z.string(),
	price: z.number(),
	vat_percentage: z.number().nullable().optional(),
	quantity: z.number(),
	units: z.string().nullable().optional(),
});
export type FinmeiInvoiceItem = z.infer<typeof FinmeiInvoiceItemSchema>;

/**
 * Seller information schema.
 */
export const FinmeiSellerSchema = z.object({
	business_type: z.string().nullable().optional(),
	first_name: z.string().nullable().optional(),
	last_name: z.string().nullable().optional(),
	company_name: z.string().nullable().optional(),
	company_code: z.string().nullable().optional(),
	individual_tax_id: z.string().nullable().optional(),
	vat_code: z.string().nullable().optional(),
	address: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	phone: z.string().nullable().optional(),
	custom_fields: z
		.array(
			z.object({
				label: z.string(),
				value: z.string(),
			}),
		)
		.nullable()
		.optional(),
});
export type FinmeiSeller = z.infer<typeof FinmeiSellerSchema>;

/**
 * Buyer information schema.
 */
export const FinmeiBuyerSchema = z.object({
	type: z.string().nullable().optional(),
	first_name: z.string().nullable().optional(),
	last_name: z.string().nullable().optional(),
	company_name: z.string().nullable().optional(),
	company_code: z.string().nullable().optional(),
	individual_tax_id: z.string().nullable().optional(),
	vat_code: z.string().nullable().optional(),
	address: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	phone: z.string().nullable().optional(),
	country: z.string().nullable().optional(),
	custom_fields: z
		.array(
			z.object({
				label: z.string(),
				value: z.string(),
			}),
		)
		.nullable()
		.optional(),
});
export type FinmeiBuyer = z.infer<typeof FinmeiBuyerSchema>;

/**
 * Payment options schema.
 */
export const FinmeiPaymentOptionSchema = z.object({
	type: z.string().optional(),
	bank_account: z.string().nullable().optional(),
	bank_name: z.string().nullable().optional(),
	routing_or_sort_number: z.string().nullable().optional(),
	swift_bic_code: z.string().nullable().optional(),
	fields: z
		.array(
			z.object({
				label: z.string(),
				value: z.string(),
			}),
		)
		.nullable()
		.optional(),
});
export type FinmeiPaymentOption = z.infer<typeof FinmeiPaymentOptionSchema>;

/**
 * Invoice entity schema.
 */
export const FinmeiInvoiceSchema = z.object({
	id: z.string(),
	business_id: z.string().nullable().optional(),
	invoice_type: z.string().nullable().optional(),
	series: z.string().nullable().optional(),
	invoice_number: z.string().nullable().optional(),
	invoice_date: z.string().nullable().optional(),
	pay_until_date: z.string().nullable().optional(),
	language: z.string().nullable().optional(),
	subtotal: z.number().nullable().optional(),
	vat: z.number().nullable().optional(),
	total_incl_vat: z.number().nullable().optional(),
	currency: z.string(),
	payment_status: z.string().nullable().optional(),
	notes: z.string().nullable().optional(),
	share_link: z.string().nullable().optional(),
	seller: FinmeiSellerSchema.nullable().optional(),
	buyer: FinmeiBuyerSchema.nullable().optional(),
	items: z.array(FinmeiInvoiceItemSchema).optional(),
	payment_options: z.array(FinmeiPaymentOptionSchema).optional(),
	bank_accounts: z
		.array(
			z.object({
				account: z.string().nullable().optional(),
				bank_name: z.string().nullable().optional(),
			}),
		)
		.optional(),
	created_at: z.union([z.number(), z.string()]).nullable().optional(),
	updated_at: z.union([z.number(), z.string()]).nullable().optional(),
});
export type FinmeiInvoice = z.infer<typeof FinmeiInvoiceSchema>;

/**
 * Customer entity schema.
 */
export const FinmeiCustomerSchema = z.object({
	id: z.string(),
	name: z.string().nullable().optional(),
	first_name: z.string().nullable().optional(),
	last_name: z.string().nullable().optional(),
	company_name: z.string().nullable().optional(),
	company_code: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	phone: z.string().nullable().optional(),
	// `unknown` because customer address can be a freeform string or structured address object.
	address: z
		.union([z.string(), z.record(z.string(), z.unknown())])
		.nullable()
		.optional(),
	vat_code: z.string().nullable().optional(),
	created_at: z.union([z.number(), z.string()]).nullable().optional(),
	updated_at: z.union([z.number(), z.string()]).nullable().optional(),
});
export type FinmeiCustomer = z.infer<typeof FinmeiCustomerSchema>;

/**
 * Product entity schema.
 */
export const FinmeiProductSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable().optional(),
	price: z.number(),
	currency: z.string(),
	vat_percentage: z.number().nullable().optional(),
	units: z.string().nullable().optional(),
	status: z.string().nullable().optional(),
	created_at: z.union([z.number(), z.string()]).nullable().optional(),
	updated_at: z.union([z.number(), z.string()]).nullable().optional(),
});
export type FinmeiProduct = z.infer<typeof FinmeiProductSchema>;

/**
 * Payment entity schema.
 */
export const FinmeiPaymentSchema = z.object({
	id: z.string(),
	invoice_id: z.string().nullable().optional(),
	amount: z.number(),
	currency: z.string(),
	payment_date: z.string().nullable().optional(),
	payment_method: z.string().nullable().optional(),
	status: z.string().nullable().optional(),
	created_at: z.union([z.number(), z.string()]).nullable().optional(),
	updated_at: z.union([z.number(), z.string()]).nullable().optional(),
});
export type FinmeiPayment = z.infer<typeof FinmeiPaymentSchema>;

// ==========================================
// Endpoint Input Schemas (Strict)
// ==========================================

export const FinmeiListInvoicesInputSchema = z
	.object({
		page: z.number().int().positive().optional(),
		per_page: z.number().int().positive().optional(),
	})
	.strict();

export const FinmeiCreateInvoiceInputSchema = z
	.object({
		type: z
			.enum([
				'regular_invoice',
				'vat_invoice',
				'preliminary_invoice',
				'preliminary_vat_invoice',
				'credit_invoice',
				'credit_vat_invoice',
			])
			.optional(),
		invoice_date: z.string().optional(),
		pay_until_date: z.string().optional(),
		series: z.string().optional(),
		currency: z.string().min(1),
		payment_status: z.enum(['paid', 'not_paid']).optional(),
		language: z.string().optional(),
		notes: z.string().optional(),
		use_default_seller_info: z.boolean().optional(),
		seller: z
			.object({
				company_name: z.string().optional(),
				company_code: z.string().optional(),
				vat_code: z.string().optional(),
				address: z.string().optional(),
				email: z.string().optional(),
				phone: z.string().optional(),
				custom_fields: z
					.array(
						z.object({
							label: z.string(),
							value: z.string(),
						}),
					)
					.optional(),
			})
			.optional(),
		buyer: z
			.object({
				type: z.string().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				company_name: z.string().optional(),
				company_code: z.string().optional(),
				vat_code: z.string().optional(),
				country: z.string().optional(),
				address: z.string().optional(),
				email: z.string().optional(),
				phone: z.string().optional(),
				custom_fields: z
					.array(
						z.object({
							label: z.string(),
							value: z.string(),
						}),
					)
					.optional(),
			})
			.optional(),
		products: z
			.array(
				z.object({
					name: z.string(),
					price: z.number(),
					quantity: z.number(),
					units: z.string().optional(),
					vat_percentage: z.number().optional(),
				}),
			)
			.optional(),
		payment_options: z
			.array(
				z.object({
					type: z.string(),
					bank_account: z.string().optional(),
					bank_name: z.string().optional(),
					routing_or_sort_number: z.string().optional(),
					swift_bic_code: z.string().optional(),
					fields: z
						.array(
							z.object({
								label: z.string(),
								value: z.string(),
							}),
						)
						.optional(),
				}),
			)
			.optional(),
	})
	.strict();

export const FinmeiGetInvoiceInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();

export const FinmeiUpdateInvoiceInputSchema =
	FinmeiCreateInvoiceInputSchema.extend({
		id: z.string().min(1),
	}).strict();

export const FinmeiDeleteInvoiceInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();

export const FinmeiDownloadInvoiceInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();

export const FinmeiListExpensesInputSchema = z
	.object({
		page: z.number().int().positive().optional(),
		per_page: z.number().int().positive().optional(),
	})
	.strict();

export const FinmeiCreateExpenseInputSchema = z
	.object({
		seller: z.string().min(1),
		total: z.number(),
		currency: z.string().min(1),
		date: z.string().min(1),
		file: z.string().optional(),
		fileType: z.string().optional(),
	})
	.strict();

export const FinmeiGetExpenseInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();

export const FinmeiUpdateExpenseInputSchema = z
	.object({
		id: z.string().min(1),
		seller: z.string().optional(),
		total: z.number().optional(),
		currency: z.string().optional(),
		date: z.string().optional(),
	})
	.strict();

export const FinmeiDeleteExpenseInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();

export const FinmeiUpdateExpenseFileInputSchema = z
	.object({
		id: z.string().min(1),
		file: z.string().min(1),
		fileType: z.string().optional(),
	})
	.strict();

export const FinmeiDownloadExpenseInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();

export const FinmeiListCustomersInputSchema = z
	.object({
		page: z.number().int().positive().optional(),
		per_page: z.number().int().positive().optional(),
		search: z.string().optional(),
		sort: z.string().optional(),
	})
	.strict();

export const FinmeiCreateCustomerInputSchema = z
	.object({
		name: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		company_name: z.string().optional(),
		company_code: z.string().optional(),
		email: z.string().optional(),
		phone: z.string().optional(),
		address: z.string().optional(),
		vat_code: z.string().optional(),
	})
	.strict();

export const FinmeiGetCustomerInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();

export const FinmeiUpdateCustomerInputSchema =
	FinmeiCreateCustomerInputSchema.extend({
		id: z.string().min(1),
	}).strict();

export const FinmeiDeleteCustomerInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();

export const FinmeiListProductsInputSchema = z
	.object({
		page: z.number().int().positive().optional(),
		per_page: z.number().int().positive().optional(),
		search: z.string().optional(),
		name: z.string().optional(),
		status: z.enum(['active', 'inactive']).optional(),
	})
	.strict();

export const FinmeiCreateProductInputSchema = z
	.object({
		name: z.string().min(1),
		price: z.number(),
		currency: z.string().min(1),
		description: z.string().optional(),
		vat_percentage: z.number().optional(),
		units: z.string().optional(),
		status: z.enum(['active', 'inactive']).optional(),
	})
	.strict();

export const FinmeiGetProductInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();

export const FinmeiUpdateProductInputSchema = z
	.object({
		id: z.string().min(1),
		name: z.string().optional(),
		price: z.number().optional(),
		currency: z.string().optional(),
		description: z.string().optional(),
		vat_percentage: z.number().optional(),
		units: z.string().optional(),
		status: z.enum(['active', 'inactive']).optional(),
	})
	.strict();

export const FinmeiDeleteProductInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();

export const FinmeiListPaymentsInputSchema = z
	.object({
		page: z.number().int().positive().optional(),
		per_page: z.number().int().positive().optional(),
		limit: z.number().int().positive().optional(),
		offset: z.number().int().nonnegative().optional(),
		status: z.enum(['pending', 'completed', 'failed']).optional(),
		start_date: z.string().optional(),
		end_date: z.string().optional(),
	})
	.strict();

export const FinmeiCreatePaymentInputSchema = z
	.object({
		invoice_id: z.string().optional(),
		amount: z.number(),
		currency: z.string().min(1),
		payment_date: z.string().optional(),
		payment_method: z.string().optional(),
		status: z.enum(['pending', 'completed', 'failed']).optional(),
	})
	.strict();

export const FinmeiGetPaymentInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();

export const FinmeiDeletePaymentInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();

export const FinmeiListCurrenciesInputSchema = z.object({}).strict();
export const FinmeiGetProfileInputSchema = z.object({}).strict();

export type FinmeiCreateCustomerInput = z.infer<
	typeof FinmeiCreateCustomerInputSchema
>;
export type FinmeiCreateExpenseInput = z.infer<
	typeof FinmeiCreateExpenseInputSchema
>;
export type FinmeiCreateInvoiceInput = z.infer<
	typeof FinmeiCreateInvoiceInputSchema
>;
export type FinmeiCreatePaymentInput = z.infer<
	typeof FinmeiCreatePaymentInputSchema
>;
export type FinmeiCreateProductInput = z.infer<
	typeof FinmeiCreateProductInputSchema
>;

// ==========================================
// Endpoint Output Schemas
// ==========================================

export const FinmeiListInvoicesOutputSchema = z.object({
	data: z.array(FinmeiInvoiceSchema),
	meta: FinmeiPaginationMetaSchema.optional(),
});

export const FinmeiInvoiceOutputSchema = z.object({
	data: FinmeiInvoiceSchema,
});

export const FinmeiListExpensesOutputSchema = z.object({
	data: z.array(FinmeiExpenseSchema),
	meta: FinmeiPaginationMetaSchema.optional(),
});

export const FinmeiExpenseOutputSchema = z.object({
	data: FinmeiExpenseSchema,
});

export const FinmeiListCustomersOutputSchema = z.object({
	data: z.array(FinmeiCustomerSchema),
	meta: FinmeiPaginationMetaSchema.optional(),
});

export const FinmeiCustomerOutputSchema = z.object({
	data: FinmeiCustomerSchema,
});

export const FinmeiListProductsOutputSchema = z.object({
	data: z.array(FinmeiProductSchema),
	meta: FinmeiPaginationMetaSchema.optional(),
});

export const FinmeiProductOutputSchema = z.object({
	data: FinmeiProductSchema,
});

export const FinmeiListPaymentsOutputSchema = z.object({
	data: z.array(FinmeiPaymentSchema),
	meta: FinmeiPaginationMetaSchema.optional(),
});

export const FinmeiPaymentOutputSchema = z.object({
	data: FinmeiPaymentSchema,
});

export const FinmeiListCurrenciesOutputSchema = z.object({
	data: z.array(FinmeiCurrencySchema),
});

export const FinmeiProfileOutputSchema = z.object({
	data: FinmeiProfileSchema,
});

// ==========================================
// Maps for Corsair Registration
// ==========================================

export const FinmeiEndpointInputSchemas = {
	'invoices.list': FinmeiListInvoicesInputSchema,
	'invoices.create': FinmeiCreateInvoiceInputSchema,
	'invoices.get': FinmeiGetInvoiceInputSchema,
	'invoices.update': FinmeiUpdateInvoiceInputSchema,
	'invoices.delete': FinmeiDeleteInvoiceInputSchema,
	'invoices.download': FinmeiDownloadInvoiceInputSchema,
	'expenses.list': FinmeiListExpensesInputSchema,
	'expenses.create': FinmeiCreateExpenseInputSchema,
	'expenses.get': FinmeiGetExpenseInputSchema,
	'expenses.update': FinmeiUpdateExpenseInputSchema,
	'expenses.delete': FinmeiDeleteExpenseInputSchema,
	'expenses.updateFile': FinmeiUpdateExpenseFileInputSchema,
	'expenses.download': FinmeiDownloadExpenseInputSchema,
	'customers.list': FinmeiListCustomersInputSchema,
	'customers.create': FinmeiCreateCustomerInputSchema,
	'customers.get': FinmeiGetCustomerInputSchema,
	'customers.update': FinmeiUpdateCustomerInputSchema,
	'customers.delete': FinmeiDeleteCustomerInputSchema,
	'products.list': FinmeiListProductsInputSchema,
	'products.create': FinmeiCreateProductInputSchema,
	'products.get': FinmeiGetProductInputSchema,
	'products.update': FinmeiUpdateProductInputSchema,
	'products.delete': FinmeiDeleteProductInputSchema,
	'payments.list': FinmeiListPaymentsInputSchema,
	'payments.create': FinmeiCreatePaymentInputSchema,
	'payments.get': FinmeiGetPaymentInputSchema,
	'payments.delete': FinmeiDeletePaymentInputSchema,
	'currencies.list': FinmeiListCurrenciesInputSchema,
	'profile.get': FinmeiGetProfileInputSchema,
} as const;

export const FinmeiEndpointOutputSchemas = {
	'invoices.list': FinmeiListInvoicesOutputSchema,
	'invoices.create': FinmeiInvoiceOutputSchema,
	'invoices.get': FinmeiInvoiceOutputSchema,
	'invoices.update': FinmeiInvoiceOutputSchema,
	'invoices.delete': FinmeiDeleteResponseSchema,
	'invoices.download': FinmeiBinaryResponseSchema,
	'expenses.list': FinmeiListExpensesOutputSchema,
	'expenses.create': FinmeiExpenseOutputSchema,
	'expenses.get': FinmeiExpenseOutputSchema,
	'expenses.update': FinmeiExpenseOutputSchema,
	'expenses.delete': FinmeiDeleteResponseSchema,
	'expenses.updateFile': FinmeiExpenseOutputSchema,
	'expenses.download': FinmeiBinaryResponseSchema,
	'customers.list': FinmeiListCustomersOutputSchema,
	'customers.create': FinmeiCustomerOutputSchema,
	'customers.get': FinmeiCustomerOutputSchema,
	'customers.update': FinmeiCustomerOutputSchema,
	'customers.delete': FinmeiDeleteResponseSchema,
	'products.list': FinmeiListProductsOutputSchema,
	'products.create': FinmeiProductOutputSchema,
	'products.get': FinmeiProductOutputSchema,
	'products.update': FinmeiProductOutputSchema,
	'products.delete': FinmeiDeleteResponseSchema,
	'payments.list': FinmeiListPaymentsOutputSchema,
	'payments.create': FinmeiPaymentOutputSchema,
	'payments.get': FinmeiPaymentOutputSchema,
	'payments.delete': FinmeiDeleteResponseSchema,
	'currencies.list': FinmeiListCurrenciesOutputSchema,
	'profile.get': FinmeiProfileOutputSchema,
} as const;

export type FinmeiEndpointInputs = {
	'invoices.list': z.infer<typeof FinmeiListInvoicesInputSchema>;
	'invoices.create': z.infer<typeof FinmeiCreateInvoiceInputSchema>;
	'invoices.get': z.infer<typeof FinmeiGetInvoiceInputSchema>;
	'invoices.update': z.infer<typeof FinmeiUpdateInvoiceInputSchema>;
	'invoices.delete': z.infer<typeof FinmeiDeleteInvoiceInputSchema>;
	'invoices.download': z.infer<typeof FinmeiDownloadInvoiceInputSchema>;
	'expenses.list': z.infer<typeof FinmeiListExpensesInputSchema>;
	'expenses.create': z.infer<typeof FinmeiCreateExpenseInputSchema>;
	'expenses.get': z.infer<typeof FinmeiGetExpenseInputSchema>;
	'expenses.update': z.infer<typeof FinmeiUpdateExpenseInputSchema>;
	'expenses.delete': z.infer<typeof FinmeiDeleteExpenseInputSchema>;
	'expenses.updateFile': z.infer<typeof FinmeiUpdateExpenseFileInputSchema>;
	'expenses.download': z.infer<typeof FinmeiDownloadExpenseInputSchema>;
	'customers.list': z.infer<typeof FinmeiListCustomersInputSchema>;
	'customers.create': z.infer<typeof FinmeiCreateCustomerInputSchema>;
	'customers.get': z.infer<typeof FinmeiGetCustomerInputSchema>;
	'customers.update': z.infer<typeof FinmeiUpdateCustomerInputSchema>;
	'customers.delete': z.infer<typeof FinmeiDeleteCustomerInputSchema>;
	'products.list': z.infer<typeof FinmeiListProductsInputSchema>;
	'products.create': z.infer<typeof FinmeiCreateProductInputSchema>;
	'products.get': z.infer<typeof FinmeiGetProductInputSchema>;
	'products.update': z.infer<typeof FinmeiUpdateProductInputSchema>;
	'products.delete': z.infer<typeof FinmeiDeleteProductInputSchema>;
	'payments.list': z.infer<typeof FinmeiListPaymentsInputSchema>;
	'payments.create': z.infer<typeof FinmeiCreatePaymentInputSchema>;
	'payments.get': z.infer<typeof FinmeiGetPaymentInputSchema>;
	'payments.delete': z.infer<typeof FinmeiDeletePaymentInputSchema>;
	'currencies.list': z.infer<typeof FinmeiListCurrenciesInputSchema>;
	'profile.get': z.infer<typeof FinmeiGetProfileInputSchema>;
};

export type FinmeiEndpointOutputs = {
	'invoices.list': z.infer<typeof FinmeiListInvoicesOutputSchema>;
	'invoices.create': z.infer<typeof FinmeiInvoiceOutputSchema>;
	'invoices.get': z.infer<typeof FinmeiInvoiceOutputSchema>;
	'invoices.update': z.infer<typeof FinmeiInvoiceOutputSchema>;
	'invoices.delete': z.infer<typeof FinmeiDeleteResponseSchema>;
	'invoices.download': z.infer<typeof FinmeiBinaryResponseSchema>;
	'expenses.list': z.infer<typeof FinmeiListExpensesOutputSchema>;
	'expenses.create': z.infer<typeof FinmeiExpenseOutputSchema>;
	'expenses.get': z.infer<typeof FinmeiExpenseOutputSchema>;
	'expenses.update': z.infer<typeof FinmeiExpenseOutputSchema>;
	'expenses.delete': z.infer<typeof FinmeiDeleteResponseSchema>;
	'expenses.updateFile': z.infer<typeof FinmeiExpenseOutputSchema>;
	'expenses.download': z.infer<typeof FinmeiBinaryResponseSchema>;
	'customers.list': z.infer<typeof FinmeiListCustomersOutputSchema>;
	'customers.create': z.infer<typeof FinmeiCustomerOutputSchema>;
	'customers.get': z.infer<typeof FinmeiCustomerOutputSchema>;
	'customers.update': z.infer<typeof FinmeiCustomerOutputSchema>;
	'customers.delete': z.infer<typeof FinmeiDeleteResponseSchema>;
	'products.list': z.infer<typeof FinmeiListProductsOutputSchema>;
	'products.create': z.infer<typeof FinmeiProductOutputSchema>;
	'products.get': z.infer<typeof FinmeiProductOutputSchema>;
	'products.update': z.infer<typeof FinmeiProductOutputSchema>;
	'products.delete': z.infer<typeof FinmeiDeleteResponseSchema>;
	'payments.list': z.infer<typeof FinmeiListPaymentsOutputSchema>;
	'payments.create': z.infer<typeof FinmeiPaymentOutputSchema>;
	'payments.get': z.infer<typeof FinmeiPaymentOutputSchema>;
	'payments.delete': z.infer<typeof FinmeiDeleteResponseSchema>;
	'currencies.list': z.infer<typeof FinmeiListCurrenciesOutputSchema>;
	'profile.get': z.infer<typeof FinmeiProfileOutputSchema>;
};
