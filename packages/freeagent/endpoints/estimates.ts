import { z } from 'zod';
import { defineOperation } from './operation';

// Estimate and line-item responses include optional calculated totals and tax fields from the provider.
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
	.superRefine((item, context) => {
		if (item.data.length % 4 !== 0)
			context.addIssue({
				code: 'custom',
				path: ['data'],
				message: 'Attachment data must be valid base64',
			});
		const padding = item.data.endsWith('==')
			? 2
			: item.data.endsWith('=')
				? 1
				: 0;
		if ((item.data.length * 3) / 4 - padding > 5 * 1024 * 1024)
			context.addIssue({
				code: 'custom',
				path: ['data'],
				message: 'Each email attachment must be 5 MiB or smaller',
			});
	});

const EstimateItemFields = z
	.object({
		item_type: z
			.enum([
				'Hours',
				'Days',
				'Weeks',
				'Months',
				'Years',
				'-no unit-',
				'Products',
				'Services',
				'Training',
				'Expenses',
				'Comments',
				'Bills',
				'Discount',
				'Credit',
			])
			.optional(),
		quantity: Decimal.optional(),
		price: Decimal.optional(),
		description: z.string().optional(),
		sales_tax_rate: Decimal.optional(),
		second_sales_tax_rate: Decimal.optional(),
		sales_tax_status: z.enum(['TAXABLE', 'EXEMPT']).optional(),
		second_sales_tax_status: z.string().optional(),
		category: z.string().url().optional(),
	})
	.strict();
const EstimateItemCreate = EstimateItemFields.extend({
	item_type: z.enum([
		'Hours',
		'Days',
		'Weeks',
		'Months',
		'Years',
		'-no unit-',
		'Products',
		'Services',
		'Training',
		'Expenses',
		'Comments',
		'Bills',
		'Discount',
		'Credit',
	]),
	quantity: Decimal,
	price: Decimal,
	description: z.string().min(1),
}).strict();
const EstimateItem = z
	.object({
		url: z.string().url().optional(),
		position: Decimal.optional(),
		item_type: z.string().optional(),
		quantity: Decimal.optional(),
		price: Decimal.optional(),
		description: z.string().optional(),
		sales_tax_rate: Decimal.optional(),
		sales_tax_value: Decimal.optional(),
		second_sales_tax_rate: Decimal.optional(),
		second_sales_tax_value: Decimal.optional(),
		sales_tax_status: z.string().optional(),
		second_sales_tax_status: z.string().optional(),
		category: z.string().url().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();
const Estimate = z
	.object({
		url: z.string().url().optional(),
		status: z
			.enum(['Draft', 'Sent', 'Open', 'Approved', 'Rejected', 'Invoiced'])
			.optional(),
		estimate_type: z.enum(['Estimate', 'Quote', 'Proposal']).optional(),
		contact: z.string().url().optional(),
		project: z.string().url().optional(),
		reference: z.string().optional(),
		dated_on: z.string().date().optional(),
		currency: z.string().optional(),
		notes: z.string().optional(),
		discount_percent: Decimal.optional(),
		client_contact_name: z.string().optional(),
		ec_status: z.string().optional(),
		place_of_supply: z.string().optional(),
		estimate_items: z.array(EstimateItem).optional(),
		net_value: Decimal.optional(),
		sales_tax_value: Decimal.optional(),
		sales_tax_status: z.string().optional(),
		include_sales_tax_on_total_value: z.boolean().optional(),
		invoice: z.string().url().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();
const EstimateFields = z
	.object({
		estimate_type: z.enum(['Estimate', 'Quote', 'Proposal']).optional(),
		contact: z.string().url().optional(),
		project: z.string().url().optional(),
		reference: z.string().optional(),
		dated_on: z.string().date().optional(),
		currency: z.string().optional(),
		notes: z.string().optional(),
		discount_percent: Decimal.optional(),
		client_contact_name: z.string().optional(),
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
		estimate_items: z.array(EstimateItemFields).optional(),
		include_sales_tax_on_total_value: z.boolean().optional(),
	})
	.strict();
const EstimateCreateInput = z
	.object({
		estimate: EstimateFields.extend({
			status: z.enum(['Draft', 'Approved', 'Rejected']),
			estimate_type: z.enum(['Estimate', 'Quote', 'Proposal']),
			contact: z.string().url(),
			reference: z.string().min(1),
			dated_on: z.string().date(),
			currency: z.string().min(1),
		}),
	})
	.strict();
const EstimateUpdateInput = z
	.object({ id: z.string().min(1), estimate: EstimateFields })
	.strict();
const EstimateGetInput = z.object({ id: z.string().min(1) }).strict();
const EstimateListInput = z
	.object({
		query: PageQuery.extend({
			view: z
				.enum([
					'all',
					'recent',
					'draft',
					'non_draft',
					'sent',
					'approved',
					'rejected',
					'invoiced',
				])
				.optional(),
			from_date: z.string().date().optional(),
			to_date: z.string().date().optional(),
			updated_since: z.string().datetime({ offset: true }).optional(),
			nested_estimate_items: z.boolean().optional(),
			contact: z.string().url().optional(),
			project: z.string().url().optional(),
			invoice: z.string().url().optional(),
		}).optional(),
	})
	.strict();
const EstimateListData = z
	.object({ estimates: z.array(Estimate) })
	.passthrough();
const EstimateListOutput = EstimateListData.extend({
	pagination: Pagination,
}).passthrough();
const EstimateOutput = z.object({ estimate: Estimate }).passthrough();
const EstimateItemOutput = z
	.object({ estimate_item: EstimateItem })
	.passthrough();
const EstimateItemCreateInput = z
	.object({ estimate: z.string().url(), estimate_item: EstimateItemCreate })
	.strict();
const EstimateItemUpdateInput = z
	.object({ id: z.string().min(1), estimate_item: EstimateItemFields })
	.strict();
const EstimateItemDeleteInput = z.object({ id: z.string().min(1) }).strict();
const EstimateSendEmailInput = z
	.object({
		id: z.string().min(1),
		email: z
			.object({
				to: z.string().optional(),
				from: z.string().optional(),
				subject: z.string().optional(),
				body: z.string().optional(),
				email_to_sender: z.boolean().optional(),
				use_template: z.boolean().optional(),
				attachments: z.array(EmailAttachment).optional(),
			})
			.strict(),
	})
	.strict();
const DefaultTextInput = z.object({}).strict();
const DefaultTextOutput = z
	.object({ default_additional_text: z.string().optional() })
	.passthrough();
const DefaultTextUpdateInput = z
	.object({ default_additional_text: z.string() })
	.strict();

const Estimates = {
	list: defineOperation(EstimateListInput, EstimateListOutput, {
		method: 'GET',
		path: () => '/v2/estimates',
		query: (input) => input.query ?? {},
		paginated: {
			data: EstimateListData,
			combine: (data, pagination) => ({ ...data, pagination }),
		},
	}),
	get: defineOperation(EstimateGetInput, EstimateOutput, {
		method: 'GET',
		path: (input) => `/v2/estimates/${encodeURIComponent(input.id)}`,
	}),
	pdf: defineOperation(
		EstimateGetInput,
		z
			.object({ pdf: z.object({ content: z.string().min(1) }).strict() })
			.passthrough(),
		{
			method: 'GET',
			path: (input) => `/v2/estimates/${encodeURIComponent(input.id)}/pdf`,
		},
	),
	create: defineOperation(EstimateCreateInput, EstimateOutput, {
		method: 'POST',
		path: () => '/v2/estimates',
		body: (input) => ({ estimate: input.estimate }),
	}),
	update: defineOperation(EstimateUpdateInput, EmptyResponse, {
		method: 'PUT',
		path: (input) => `/v2/estimates/${encodeURIComponent(input.id)}`,
		body: (input) => ({ estimate: input.estimate }),
	}),
	createItem: defineOperation(EstimateItemCreateInput, EstimateItemOutput, {
		method: 'POST',
		path: () => '/v2/estimate_items',
		body: (input) => ({
			estimate: input.estimate,
			estimate_item: input.estimate_item,
		}),
	}),
	updateItem: defineOperation(EstimateItemUpdateInput, EmptyResponse, {
		method: 'PUT',
		path: (input) => `/v2/estimate_items/${encodeURIComponent(input.id)}`,
		body: (input) => ({ estimate_item: input.estimate_item }),
	}),
	duplicate: defineOperation(EstimateGetInput, EstimateOutput, {
		method: 'POST',
		path: (input) => `/v2/estimates/${encodeURIComponent(input.id)}/duplicate`,
	}),
	deleteItem: defineOperation(EstimateItemDeleteInput, EmptyResponse, {
		method: 'DELETE',
		path: (input) => `/v2/estimate_items/${encodeURIComponent(input.id)}`,
	}),
	delete: defineOperation(EstimateGetInput, EmptyResponse, {
		method: 'DELETE',
		path: (input) => `/v2/estimates/${encodeURIComponent(input.id)}`,
	}),
	sendEmail: defineOperation(EstimateSendEmailInput, EmptyResponse, {
		method: 'POST',
		path: (input) => `/v2/estimates/${encodeURIComponent(input.id)}/send_email`,
		body: (input) => ({ estimate: { email: input.email } }),
	}),
	markSent: defineOperation(EstimateGetInput, EmptyResponse, {
		method: 'PUT',
		path: (input) =>
			`/v2/estimates/${encodeURIComponent(input.id)}/transitions/mark_as_sent`,
	}),
	markDraft: defineOperation(EstimateGetInput, EmptyResponse, {
		method: 'PUT',
		path: (input) =>
			`/v2/estimates/${encodeURIComponent(input.id)}/transitions/mark_as_draft`,
	}),
	markApproved: defineOperation(EstimateGetInput, EmptyResponse, {
		method: 'PUT',
		path: (input) =>
			`/v2/estimates/${encodeURIComponent(input.id)}/transitions/mark_as_approved`,
	}),
	markRejected: defineOperation(EstimateGetInput, EmptyResponse, {
		method: 'PUT',
		path: (input) =>
			`/v2/estimates/${encodeURIComponent(input.id)}/transitions/mark_as_rejected`,
	}),
	convertToInvoice: defineOperation(EstimateGetInput, EstimateOutput, {
		method: 'PUT',
		path: (input) =>
			`/v2/estimates/${encodeURIComponent(input.id)}/transitions/convert_to_invoice`,
	}),
	getDefaultAdditionalText: defineOperation(
		DefaultTextInput,
		DefaultTextOutput,
		{ method: 'GET', path: () => '/v2/estimates/default_additional_text' },
	),
	updateDefaultAdditionalText: defineOperation(
		DefaultTextUpdateInput,
		DefaultTextOutput,
		{
			method: 'PUT',
			path: () => '/v2/estimates/default_additional_text',
			body: (input) => ({
				default_additional_text: input.default_additional_text,
			}),
		},
	),
	deleteDefaultAdditionalText: defineOperation(
		DefaultTextInput,
		EmptyResponse,
		{ method: 'DELETE', path: () => '/v2/estimates/default_additional_text' },
	),
};

export const EstimateEndpoints = { estimates: Estimates } as const;
export const EstimateEndpointSchemas = {
	'estimates.list': { input: EstimateListInput, output: EstimateListOutput },
	'estimates.get': { input: EstimateGetInput, output: EstimateOutput },
	'estimates.pdf': {
		input: EstimateGetInput,
		output: z
			.object({ pdf: z.object({ content: z.string().min(1) }).strict() })
			.passthrough(),
	},
	'estimates.create': { input: EstimateCreateInput, output: EstimateOutput },
	'estimates.update': { input: EstimateUpdateInput, output: EmptyResponse },
	'estimates.createItem': {
		input: EstimateItemCreateInput,
		output: EstimateItemOutput,
	},
	'estimates.updateItem': {
		input: EstimateItemUpdateInput,
		output: EmptyResponse,
	},
	'estimates.duplicate': { input: EstimateGetInput, output: EstimateOutput },
	'estimates.deleteItem': {
		input: EstimateItemDeleteInput,
		output: EmptyResponse,
	},
	'estimates.delete': { input: EstimateGetInput, output: EmptyResponse },
	'estimates.sendEmail': {
		input: EstimateSendEmailInput,
		output: EmptyResponse,
	},
	'estimates.markSent': { input: EstimateGetInput, output: EmptyResponse },
	'estimates.markDraft': { input: EstimateGetInput, output: EmptyResponse },
	'estimates.markApproved': { input: EstimateGetInput, output: EmptyResponse },
	'estimates.markRejected': { input: EstimateGetInput, output: EmptyResponse },
	'estimates.convertToInvoice': {
		input: EstimateGetInput,
		output: EstimateOutput,
	},
	'estimates.getDefaultAdditionalText': {
		input: DefaultTextInput,
		output: DefaultTextOutput,
	},
	'estimates.updateDefaultAdditionalText': {
		input: DefaultTextUpdateInput,
		output: DefaultTextOutput,
	},
	'estimates.deleteDefaultAdditionalText': {
		input: DefaultTextInput,
		output: EmptyResponse,
	},
} as const;
export const EstimateEndpointMeta = {
	'estimates.list': {
		riskLevel: 'read',
		description: 'List estimates with filters, nested items and pagination',
	},
	'estimates.get': {
		riskLevel: 'read',
		description: 'Get an estimate and its line items',
	},
	'estimates.pdf': {
		riskLevel: 'read',
		description: 'Get an estimate PDF as base64 encoded JSON content',
	},
	'estimates.create': {
		riskLevel: 'write',
		description: 'Create a draft estimate',
	},
	'estimates.update': {
		riskLevel: 'write',
		description: 'Update estimate fields without changing status',
	},
	'estimates.createItem': {
		riskLevel: 'write',
		description: 'Add an item to an estimate',
	},
	'estimates.updateItem': {
		riskLevel: 'write',
		description: 'Update an estimate item',
	},
	'estimates.duplicate': {
		riskLevel: 'write',
		description: 'Duplicate an estimate as a draft',
	},
	'estimates.deleteItem': {
		riskLevel: 'destructive',
		description: 'Delete an estimate item',
	},
	'estimates.delete': {
		riskLevel: 'destructive',
		description: 'Delete an estimate',
	},
	'estimates.sendEmail': {
		riskLevel: 'destructive',
		description: 'Email an estimate and optional attachments',
	},
	'estimates.markSent': {
		riskLevel: 'destructive',
		description: 'Mark an estimate as sent',
	},
	'estimates.markDraft': {
		riskLevel: 'write',
		description: 'Mark an estimate as draft',
	},
	'estimates.markApproved': {
		riskLevel: 'write',
		description: 'Mark an estimate as approved',
	},
	'estimates.markRejected': {
		riskLevel: 'write',
		description: 'Mark an estimate as rejected',
	},
	'estimates.convertToInvoice': {
		riskLevel: 'destructive',
		description: 'Convert an estimate into an invoice',
	},
	'estimates.getDefaultAdditionalText': {
		riskLevel: 'read',
		description: 'Get default additional text for estimates',
	},
	'estimates.updateDefaultAdditionalText': {
		riskLevel: 'write',
		description: 'Update default additional text for estimates',
	},
	'estimates.deleteDefaultAdditionalText': {
		riskLevel: 'destructive',
		description: 'Delete default additional text for estimates',
	},
} as const;
