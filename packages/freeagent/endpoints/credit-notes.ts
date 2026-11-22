import { z } from 'zod';
import { defineOperation } from './operation';

// Credit-note response fields include account-specific tax data and optional provider-calculated totals.
// Updates and status changes answer with the changed record; deletes answer with no body.
const EmptyResponse = z.union([z.object({}).passthrough(), z.undefined()]);
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
const EmailAttachment = z
	.object({
		content_type: z.string().min(1),
		data: z
			.string()
			.min(1)
			.max(6_990_508)
			.regex(/^[A-Za-z0-9+/]*={0,2}$/),
		file_name: z.string().min(1),
	})
	.strict()
	.superRefine((attachment, context) => {
		if (attachment.data.length % 4 !== 0)
			context.addIssue({
				code: 'custom',
				path: ['data'],
				message: 'Attachment data must be valid base64',
			});
		const padding = attachment.data.endsWith('==')
			? 2
			: attachment.data.endsWith('=')
				? 1
				: 0;
		if ((attachment.data.length * 3) / 4 - padding > 5 * 1024 * 1024)
			context.addIssue({
				code: 'custom',
				path: ['data'],
				message: 'Each email attachment must be 5 MiB or smaller',
			});
	});

const CreditNoteItemFields = z
	.object({
		position: z.number().optional(),
		item_type: z
			.enum([
				'Hours',
				'Days',
				'Weeks',
				'Months',
				'Years',
				'Products',
				'Services',
				'Training',
				'Expenses',
				'Comment',
				'Bills',
				'Discount',
				'Credit',
				'VAT',
			])
			.optional(),
		quantity: Decimal.optional(),
		description: z.string().optional(),
		price: Decimal.optional(),
		sales_tax_rate: Decimal.optional(),
		second_sales_tax_rate: Decimal.optional(),
		sales_tax_status: z.enum(['TAXABLE', 'EXEMPT', 'OUT_OF_SCOPE']).optional(),
		second_sales_tax_status: z.string().optional(),
		stock_item: z.string().url().optional(),
		category: z.string().url().optional(),
		project: z.string().url().optional(),
	})
	.strict();
const CreditNoteItemInput = z.union([
	CreditNoteItemFields.extend({
		id: z.union([z.string().min(1), z.number().int()]),
	}).strict(),
	z
		.object({
			id: z.union([z.string().min(1), z.number().int()]),
			_destroy: z.literal(1),
		})
		.strict(),
	CreditNoteItemFields.extend({ description: z.string() }).strict(),
]);
const CreditNoteItem = z
	.object({
		url: z.string().url().optional(),
		position: Decimal.optional(),
		description: z.string().optional(),
		item_type: z.string().optional(),
		price: Decimal.optional(),
		quantity: Decimal.optional(),
		sales_tax_rate: Decimal.optional(),
		second_sales_tax_rate: Decimal.optional(),
		suffers_cis_deduction: z.boolean().optional(),
		sales_tax_status: z.string().optional(),
		second_sales_tax_status: z.string().optional(),
		stock_item: z.string().url().optional(),
		category: z.string().url().optional(),
		project: z.string().url().optional(),
	})
	.passthrough();
const CreditNote = z
	.object({
		url: z.string().url().optional(),
		status: z
			.enum(['Draft', 'Open', 'Overdue', 'Refunded', 'Written-off'])
			.optional(),
		long_status: z.string().optional(),
		contact: z.string().url().optional(),
		project: z.string().url().optional(),
		property: z.string().url().optional(),
		reference: z.string().optional(),
		dated_on: z.string().date().optional(),
		due_on: z.string().date().nullable().optional(),
		payment_terms_in_days: z.number().int().optional(),
		currency: z.string().optional(),
		cis_rate: z.string().nullable().optional(),
		cis_deduction_rate: Decimal.optional(),
		cis_deduction: Decimal.optional(),
		cis_deduction_suffered: Decimal.optional(),
		comments: z.string().optional(),
		discount_percent: Decimal.optional(),
		client_contact_name: z.string().optional(),
		payment_terms: z.string().optional(),
		po_reference: z.string().optional(),
		bank_account: z.string().url().optional(),
		omit_header: z.boolean().optional(),
		show_project_name: z.boolean().optional(),
		ec_status: z.string().optional(),
		place_of_supply: z.string().optional(),
		net_value: Decimal.optional(),
		exchange_rate: Decimal.optional(),
		involves_sales_tax: z.boolean().optional(),
		sales_tax_value: Decimal.optional(),
		second_sales_tax_value: Decimal.optional(),
		total_value: Decimal.optional(),
		refunded_value: Decimal.optional(),
		due_value: Decimal.optional(),
		is_interim_uk_vat: z.boolean().optional(),
		refunded_on: z.string().date().optional(),
		written_off_date: z.string().date().optional(),
		credit_note_items: z.array(CreditNoteItem).optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();
const CreditNoteFields = z
	.object({
		contact: z.string().url().optional(),
		project: z.string().url().optional(),
		property: z.string().url().optional(),
		reference: z.string().optional(),
		dated_on: z.string().date().optional(),
		due_on: z.string().date().optional(),
		payment_terms_in_days: z.number().int().optional(),
		currency: z.string().optional(),
		cis_rate: z.string().nullable().optional(),
		cis_deduction_rate: Decimal.optional(),
		comments: z.string().optional(),
		discount_percent: Decimal.optional(),
		client_contact_name: z.string().optional(),
		payment_terms: z.string().optional(),
		po_reference: z.string().optional(),
		bank_account: z.string().url().optional(),
		omit_header: z.boolean().optional(),
		show_project_name: z.boolean().optional(),
		ec_status: z
			.enum([
				'UK/Non-EC',
				'EC Goods',
				'EC Services',
				'Reverse Charge',
				'EC VAT MOSS',
			])
			.optional(),
		place_of_supply: z.string().optional(),
		credit_note_items: z.array(CreditNoteItemFields).optional(),
	})
	.strict();
const CreditNoteCreateInput = z
	.object({
		credit_note: CreditNoteFields.extend({
			contact: z.string().url(),
			dated_on: z.string().date(),
			payment_terms_in_days: z.number().int(),
		}),
	})
	.strict();
const CreditNoteUpdateInput = z
	.object({
		id: z.string().min(1),
		credit_note: CreditNoteFields.extend({
			credit_note_items: z.array(CreditNoteItemInput).optional(),
		}),
	})
	.strict();
const CreditNoteGetInput = z.object({ id: z.string().min(1) }).strict();
const CreditNoteListInput = z
	.object({
		query: PageQuery.extend({
			view: z
				.enum([
					'all',
					'recent_open_or_overdue',
					'open',
					'overdue',
					'open_or_overdue',
					'draft',
					'refunded',
				])
				.or(z.string().regex(/^last_\d+_months$/))
				.optional(),
			updated_since: z.string().datetime({ offset: true }).optional(),
			sort: z
				.enum(['created_at', '-created_at', 'updated_at', '-updated_at'])
				.optional(),
			contact: z.string().url().optional(),
			project: z.string().url().optional(),
			nested_credit_note_items: z.boolean().optional(),
		}).optional(),
	})
	.strict();
const CreditNoteListData = z
	.object({ credit_notes: z.array(CreditNote) })
	.passthrough();
const CreditNoteListOutput = CreditNoteListData.extend({
	pagination: Pagination,
}).passthrough();
const CreditNoteOutput = z.object({ credit_note: CreditNote }).passthrough();
const CreditNotePdfOutput = z
	.object({ pdf: z.object({ content: z.string().min(1) }).strict() })
	.passthrough();
const CreditNoteEmailInput = z
	.object({
		to: z.string().optional(),
		from: z.string().optional(),
		subject: z.string().optional(),
		body: z.string().optional(),
		email_to_sender: z.boolean().optional(),
		use_template: z.boolean().optional(),
		attachments: z.array(EmailAttachment).optional(),
	})
	.strict();
const CreditNoteSendEmailInput = z
	.object({ id: z.string().min(1), email: CreditNoteEmailInput })
	.strict();

const CreditNoteReconciliation = z
	.object({
		url: z.string().url().optional(),
		gross_value: Decimal.optional(),
		dated_on: z.string().date().optional(),
		exchange_rate: Decimal.optional(),
		currency: z.string().optional(),
		invoice: z.string().url().optional(),
		credit_note: z.string().url().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();
const CreditNoteReconciliationFields = z
	.object({
		gross_value: Decimal.optional(),
		dated_on: z.string().date().optional(),
		exchange_rate: Decimal.optional(),
		currency: z.string().optional(),
		invoice: z.string().url().optional(),
		credit_note: z.string().url().optional(),
	})
	.strict();
const CreditNoteReconciliationCreateInput = z
	.object({
		credit_note_reconciliation: CreditNoteReconciliationFields.extend({
			gross_value: Decimal,
			invoice: z.string().url(),
			credit_note: z.string().url(),
		}),
	})
	.strict();
const CreditNoteReconciliationUpdateInput = z
	.object({
		id: z.string().min(1),
		credit_note_reconciliation: CreditNoteReconciliationFields,
	})
	.strict();
const CreditNoteReconciliationListInput = z
	.object({
		query: PageQuery.extend({
			updated_since: z.string().datetime({ offset: true }).optional(),
			from_date: z.string().date().optional(),
			to_date: z.string().date().optional(),
		}).optional(),
	})
	.strict();
const CreditNoteReconciliationListData = z
	.object({ credit_note_reconciliations: z.array(CreditNoteReconciliation) })
	.passthrough();
const CreditNoteReconciliationListOutput =
	CreditNoteReconciliationListData.extend({
		pagination: Pagination,
	}).passthrough();
const CreditNoteReconciliationGetOutput = z
	.object({ credit_note_reconciliations: CreditNoteReconciliation })
	.passthrough();
const CreditNoteReconciliationCreateOutput = z
	.object({ credit_note_reconciliation: CreditNoteReconciliation })
	.passthrough();

const CreditNotes = {
	list: defineOperation(CreditNoteListInput, CreditNoteListOutput, {
		method: 'GET',
		path: () => '/v2/credit_notes',
		query: (input) => input.query ?? {},
		paginated: {
			data: CreditNoteListData,
			combine: (data, pagination) => ({ ...data, pagination }),
		},
	}),
	get: defineOperation(CreditNoteGetInput, CreditNoteOutput, {
		method: 'GET',
		path: (input) => `/v2/credit_notes/${encodeURIComponent(input.id)}`,
	}),
	pdf: defineOperation(CreditNoteGetInput, CreditNotePdfOutput, {
		method: 'GET',
		path: (input) => `/v2/credit_notes/${encodeURIComponent(input.id)}/pdf`,
	}),
	create: defineOperation(CreditNoteCreateInput, CreditNoteOutput, {
		method: 'POST',
		path: () => '/v2/credit_notes',
		body: (input) => ({ credit_note: input.credit_note }),
	}),
	update: defineOperation(CreditNoteUpdateInput, EmptyResponse, {
		method: 'PUT',
		path: (input) => `/v2/credit_notes/${encodeURIComponent(input.id)}`,
		body: (input) => ({ credit_note: input.credit_note }),
	}),
	delete: defineOperation(CreditNoteGetInput, EmptyResponse, {
		method: 'DELETE',
		path: (input) => `/v2/credit_notes/${encodeURIComponent(input.id)}`,
	}),
	sendEmail: defineOperation(CreditNoteSendEmailInput, EmptyResponse, {
		method: 'POST',
		path: (input) =>
			`/v2/credit_notes/${encodeURIComponent(input.id)}/send_email`,
		body: (input) => ({ credit_note: { email: input.email } }),
	}),
	markSent: defineOperation(CreditNoteGetInput, EmptyResponse, {
		method: 'PUT',
		path: (input) =>
			`/v2/credit_notes/${encodeURIComponent(input.id)}/transitions/mark_as_sent`,
	}),
	markDraft: defineOperation(CreditNoteGetInput, EmptyResponse, {
		method: 'PUT',
		path: (input) =>
			`/v2/credit_notes/${encodeURIComponent(input.id)}/transitions/mark_as_draft`,
	}),
};
const CreditNoteReconciliations = {
	list: defineOperation(
		CreditNoteReconciliationListInput,
		CreditNoteReconciliationListOutput,
		{
			method: 'GET',
			path: () => '/v2/credit_note_reconciliations',
			query: (input) => input.query ?? {},
			paginated: {
				data: CreditNoteReconciliationListData,
				combine: (data, pagination) => ({ ...data, pagination }),
			},
		},
	),
	get: defineOperation(CreditNoteGetInput, CreditNoteReconciliationGetOutput, {
		method: 'GET',
		path: (input) =>
			`/v2/credit_note_reconciliations/${encodeURIComponent(input.id)}`,
	}),
	create: defineOperation(
		CreditNoteReconciliationCreateInput,
		CreditNoteReconciliationCreateOutput,
		{
			method: 'POST',
			path: () => '/v2/credit_note_reconciliations',
			body: (input) => ({
				credit_note_reconciliation: input.credit_note_reconciliation,
			}),
		},
	),
	update: defineOperation(CreditNoteReconciliationUpdateInput, EmptyResponse, {
		method: 'PUT',
		path: (input) =>
			`/v2/credit_note_reconciliations/${encodeURIComponent(input.id)}`,
		body: (input) => ({
			credit_note_reconciliation: input.credit_note_reconciliation,
		}),
	}),
	delete: defineOperation(CreditNoteGetInput, EmptyResponse, {
		method: 'DELETE',
		path: (input) =>
			`/v2/credit_note_reconciliations/${encodeURIComponent(input.id)}`,
	}),
};

export const CreditNoteEndpoints = {
	creditNotes: CreditNotes,
	creditNoteReconciliations: CreditNoteReconciliations,
} as const;

export const CreditNoteEndpointSchemas = {
	'creditNotes.list': {
		input: CreditNoteListInput,
		output: CreditNoteListOutput,
	},
	'creditNotes.get': { input: CreditNoteGetInput, output: CreditNoteOutput },
	'creditNotes.pdf': { input: CreditNoteGetInput, output: CreditNotePdfOutput },
	'creditNotes.create': {
		input: CreditNoteCreateInput,
		output: CreditNoteOutput,
	},
	'creditNotes.update': { input: CreditNoteUpdateInput, output: EmptyResponse },
	'creditNotes.delete': { input: CreditNoteGetInput, output: EmptyResponse },
	'creditNotes.sendEmail': {
		input: CreditNoteSendEmailInput,
		output: EmptyResponse,
	},
	'creditNotes.markSent': { input: CreditNoteGetInput, output: EmptyResponse },
	'creditNotes.markDraft': { input: CreditNoteGetInput, output: EmptyResponse },
	'creditNoteReconciliations.list': {
		input: CreditNoteReconciliationListInput,
		output: CreditNoteReconciliationListOutput,
	},
	'creditNoteReconciliations.get': {
		input: CreditNoteGetInput,
		output: CreditNoteReconciliationGetOutput,
	},
	'creditNoteReconciliations.create': {
		input: CreditNoteReconciliationCreateInput,
		output: CreditNoteReconciliationCreateOutput,
	},
	'creditNoteReconciliations.update': {
		input: CreditNoteReconciliationUpdateInput,
		output: EmptyResponse,
	},
	'creditNoteReconciliations.delete': {
		input: CreditNoteGetInput,
		output: EmptyResponse,
	},
} as const;

export const CreditNoteEndpointMeta = {
	'creditNotes.list': {
		riskLevel: 'read',
		description: 'List credit notes with filters, nested items and pagination',
	},
	'creditNotes.get': {
		riskLevel: 'read',
		description: 'Get a credit note and its line items',
	},
	'creditNotes.pdf': {
		riskLevel: 'read',
		description: 'Get base64-encoded credit note PDF content',
	},
	'creditNotes.create': {
		riskLevel: 'write',
		description: 'Create a draft credit note',
	},
	'creditNotes.update': {
		riskLevel: 'destructive',
		description:
			'Update credit note fields and items, including irreversible item deletion',
	},
	'creditNotes.delete': {
		riskLevel: 'destructive',
		description: 'Delete a credit note',
	},
	'creditNotes.sendEmail': {
		riskLevel: 'destructive',
		description: 'Email a credit note and optional attachments',
	},
	'creditNotes.markSent': {
		riskLevel: 'destructive',
		description: 'Mark a credit note as sent or reopen a cancelled one',
	},
	'creditNotes.markDraft': {
		riskLevel: 'write',
		description: 'Mark a credit note as draft',
	},
	'creditNoteReconciliations.list': {
		riskLevel: 'read',
		description:
			'List credit note reconciliations with date filters and pagination',
	},
	'creditNoteReconciliations.get': {
		riskLevel: 'read',
		description: 'Get a credit note reconciliation',
	},
	'creditNoteReconciliations.create': {
		riskLevel: 'write',
		description: 'Reconcile an invoice and credit note',
	},
	'creditNoteReconciliations.update': {
		riskLevel: 'write',
		description: 'Update a credit note reconciliation',
	},
	'creditNoteReconciliations.delete': {
		riskLevel: 'destructive',
		description: 'Delete a credit note reconciliation',
	},
} as const;
