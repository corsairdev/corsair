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
		type: z.enum([
			'regular_invoice',
			'vat_invoice',
			'preliminary_invoice',
			'preliminary_vat_invoice',
			'credit_invoice',
			'credit_vat_invoice',
		]),
		invoice_date: z.string().min(1),
		pay_until_date: z.string().optional(),
		series: z.string().min(1),
		invoice_number: z.union([z.string(), z.number()]).optional(),
		currency: z.string().min(1),
		payment_status: z.enum(['paid', 'not_paid']).optional(),
		language: z.string().optional(),
		notes: z.string().optional(),
		use_default_seller_info: z.boolean().optional(),
		seller: z
			.object({
				company_name: z.string().optional(),
				company_code: z.string().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				individual_tax_id: z.string().optional(),
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
		buyer: z.object({
			type: z.enum(['company', 'individual']),
			first_name: z.string().optional(),
			last_name: z.string().optional(),
			company_name: z.string().optional(),
			company_code: z.string().optional(),
			individual_tax_id: z.string().optional(),
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
		}),
		products: z
			.array(
				z.object({
					name: z.string(),
					price: z.number(),
					quantity: z.number(),
					units: z.string(),
					vat_percentage: z.number().optional(),
				}),
			)
			.min(1),
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

// PUT replaces the whole invoice: Finmei requires the same fields as create.
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
		// Base64-encoded bill (PDF or image); Finmei rejects an expense without one.
		file: z.string().min(1),
		fileType: z.string().optional(),
		// File name with extension, e.g. "bill.png"; Finmei rejects unknown extensions.
		fileName: z.string().optional(),
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
		// PUT replaces the expense: Finmei requires all four fields.
		seller: z.string().min(1),
		total: z.number(),
		currency: z.string().min(1),
		date: z.string().min(1),
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
		// File name with extension, e.g. "bill.png"; Finmei rejects unknown extensions.
		fileName: z.string().optional(),
	})
	.strict();

export const FinmeiDownloadExpenseInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();

export const FinmeiListCurrenciesInputSchema = z.object({}).strict();
export const FinmeiGetProfileInputSchema = z.object({}).strict();

export type FinmeiCreateExpenseInput = z.infer<
	typeof FinmeiCreateExpenseInputSchema
>;
export type FinmeiCreateInvoiceInput = z.infer<
	typeof FinmeiCreateInvoiceInputSchema
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
	'currencies.list': z.infer<typeof FinmeiListCurrenciesOutputSchema>;
	'profile.get': z.infer<typeof FinmeiProfileOutputSchema>;
};
