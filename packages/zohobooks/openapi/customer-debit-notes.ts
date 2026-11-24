import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas = {
	contact_persons: {
		type: 'array',
		items: { type: 'string' },
		description: 'List of contact person IDs',
	},
	'create-a-customer-debit-note-request': {
		required: ['customer_id', 'line_items', 'type', 'reference_invoice_id'],
		type: 'object',
		properties: {
			customer_id: { $ref: '#/components/schemas/customer_id' },
			type: {
				type: 'string',
				description:
					'Type of the document. For customer debit notes, this should be <code>debit_note</code>',
				enum: ['debit_note'],
			},
			currency_id: { $ref: '#/components/schemas/currency_id' },
			contact_persons: { $ref: '#/components/schemas/contact_persons' },
			invoice_number: { $ref: '#/components/schemas/invoice_number' },
			date: { $ref: '#/components/schemas/date' },
			payment_terms: { $ref: '#/components/schemas/payment_terms' },
			payment_terms_label: { $ref: '#/components/schemas/payment_terms_label' },
			due_date: { $ref: '#/components/schemas/due_date' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			location_id: { $ref: '#/components/schemas/location_id' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			reference_invoice_id: {
				$ref: '#/components/schemas/reference_invoice_id',
			},
			reference_invoice_type: {
				$ref: '#/components/schemas/reference_invoice_type',
			},
			tags: { $ref: '#/components/schemas/tags' },
			line_items: {
				description: 'List of line items in the debit note.',
				type: 'array',
				items: {
					type: 'object',
					required: ['item_id'],
					properties: {
						item_id: { $ref: '#/components/schemas/item_id' },
						hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
						location_id: { $ref: '#/components/schemas/location_id' },
						description: { $ref: '#/components/schemas/description' },
						rate: { $ref: '#/components/schemas/rate' },
						quantity: { $ref: '#/components/schemas/quantity' },
						tax_id: { $ref: '#/components/schemas/tax_id' },
						tags: { $ref: '#/components/schemas/tags' },
						line_item_category: {
							$ref: '#/components/schemas/line_item_category',
						},
					},
				},
			},
		},
	},
	'create-a-customer-debit-note-response': {
		type: 'object',
		properties: {
			code: { type: 'integer' },
			message: { type: 'string' },
			invoice: { $ref: '#/components/schemas/debit_note' },
		},
	},
	currency_id: {
		type: 'string',
		description: 'Unique identifier for the currency',
	},
	custom_fields: {
		description: 'List of custom fields for the debit note.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				customfield_id: {
					description: 'ID of the custom field.',
					type: 'string',
				},
				value: { description: 'Value of the custom field.', type: 'string' },
			},
		},
	},
	customer_id: {
		type: 'string',
		description: 'Unique identifier for the customer',
	},
	date: { type: 'string', description: 'Debit note date' },
	debit_note: {
		type: 'object',
		properties: {
			invoice_id: { type: 'string' },
			invoice_number: { type: 'string' },
			date: { type: 'string' },
			status: { type: 'string' },
			customer_id: { type: 'string' },
			customer_name: { type: 'string' },
			total: { type: 'number' },
			balance: { type: 'number' },
			created_time: { type: 'string' },
			last_modified_time: { type: 'string' },
			line_items: {
				type: 'array',
				items: { $ref: '#/components/schemas/line_item' },
			},
			reference_invoice: {
				$ref: '#/components/schemas/reference_invoice_data',
			},
			tags: { $ref: '#/components/schemas/tags_response' },
		},
	},
	'delete-a-customer-debit-note-response': {
		type: 'object',
		properties: { code: { type: 'integer' }, message: { type: 'string' } },
	},
	description: { type: 'string', description: 'Description' },
	discount: {
		type: 'number',
		description:
			'Discount applied to the debit note, which can be either a percentage or a flat amount. For percentage discounts, the value should include the % symbol (e.g., 10%). For sample, on Rs.1000, a 10% discount results in Rs.900, while a flat Rs.200 discount results in Rs.800.',
	},
	due_date: { type: 'string', description: 'Due date' },
	exchange_rate: { type: 'number', description: 'Exchange rate' },
	'get-a-customer-debit-note-response': {
		type: 'object',
		properties: {
			code: { type: 'integer' },
			message: { type: 'string' },
			invoice: { $ref: '#/components/schemas/debit_note' },
		},
	},
	hsn_or_sac: { type: 'string', description: 'HSN or SAC code' },
	invoice_number: { type: 'string', description: 'Debit note number' },
	is_tag_mandatory: {
		description: 'Used to check if the tag is mandatory',
		type: 'boolean',
	},
	item_id: { type: 'string', description: 'Item ID' },
	item_total: { type: 'number', description: 'Item total' },
	line_item: {
		type: 'object',
		properties: {
			line_item_id: { type: 'string' },
			item_id: { type: 'string' },
			item_name: { type: 'string' },
			description: { type: 'string' },
			rate: { type: 'number' },
			quantity: { type: 'number' },
			unit: { type: 'string' },
			item_total: { type: 'number' },
			tags: { $ref: '#/components/schemas/tags_response' },
			line_item_category: { $ref: '#/components/schemas/line_item_category' },
		},
	},
	line_item_category: {
		description:
			'Category of the line item. Allowed values are <code>line_item</code>, <code>header</code> and <code>subtotal</code>. Use <code>line_item</code> for regular line items, <code>header</code> for header titles and <code>subtotal</code> for intermediate subtotal rows. For regular line items, you can send line_item or omit this field',
		type: 'string',
	},
	'list-customer-debit-notes-response': {
		type: 'object',
		properties: {
			code: { type: 'integer' },
			message: { type: 'string' },
			debit_notes: {
				type: 'array',
				items: { $ref: '#/components/schemas/debit_note' },
			},
			page_context: { $ref: '#/components/schemas/page_context' },
		},
	},
	location_id: { type: 'string', description: 'Location ID' },
	page_context: {
		type: 'object',
		properties: {
			page: { type: 'integer' },
			per_page: { type: 'integer' },
			has_more_page: { type: 'boolean' },
			report_name: { type: 'string' },
			sort_column: { type: 'string' },
			sort_order: { type: 'string' },
		},
	},
	payment_terms: { type: 'integer', description: 'Payment terms in days' },
	payment_terms_label: { type: 'string', description: 'Payment terms label' },
	product_type: { type: 'string', description: 'Product type' },
	quantity: { type: 'number', description: 'Quantity' },
	rate: { type: 'number', description: 'Rate' },
	reference_invoice_data: {
		type: 'object',
		properties: {
			reference_invoice_number: { type: 'string' },
			reference_invoice_status: { type: 'string' },
			reference_invoice_amount: { type: 'number' },
			reference_invoice_id: { type: 'string' },
		},
	},
	reference_invoice_id: { type: 'string', description: 'Invoice ID' },
	reference_invoice_type: {
		type: 'string',
		description: 'Invoice type description',
	},
	tag_id: { description: "Tag's ID", type: 'string' },
	tag_name: { description: "Tag's Name", type: 'string' },
	tag_option_id: { description: "Tag Option's ID", type: 'string' },
	tag_option_name: { description: "Tag Option's Name", type: 'string' },
	tags: {
		description:
			'Reporting tags help organize and filter data across reports and enable detailed business intelligence analysis.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				tag_id: { $ref: '#/components/schemas/tag_id' },
				tag_option_id: { $ref: '#/components/schemas/tag_option_id' },
			},
		},
	},
	tags_response: {
		description:
			'Reporting tags help organize and filter data across reports and enable detailed business intelligence analysis.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				tag_id: { $ref: '#/components/schemas/tag_id' },
				tag_name: { $ref: '#/components/schemas/tag_name' },
				tag_option_id: { $ref: '#/components/schemas/tag_option_id' },
				tag_option_name: { $ref: '#/components/schemas/tag_option_name' },
				is_tag_mandatory: { $ref: '#/components/schemas/is_tag_mandatory' },
			},
		},
	},
	tax_id: { type: 'string', description: 'Tax ID' },
	template_id: { type: 'string', description: 'Template ID' },
	unit: { type: 'string', description: 'Unit' },
	'update-a-customer-debit-note-request': {
		required: ['customer_id', 'line_items'],
		type: 'object',
		properties: {
			customer_id: { $ref: '#/components/schemas/customer_id' },
			type: {
				type: 'string',
				description:
					'Type of the document. For customer debit notes, this should be debit_note',
				enum: ['debit_note'],
			},
			currency_id: { $ref: '#/components/schemas/currency_id' },
			invoice_number: { $ref: '#/components/schemas/invoice_number' },
			template_id: { $ref: '#/components/schemas/template_id' },
			date: { $ref: '#/components/schemas/date' },
			payment_terms: { $ref: '#/components/schemas/payment_terms' },
			payment_terms_label: { $ref: '#/components/schemas/payment_terms_label' },
			due_date: { $ref: '#/components/schemas/due_date' },
			discount: { $ref: '#/components/schemas/discount' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			location_id: { $ref: '#/components/schemas/location_id' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			tags: { $ref: '#/components/schemas/tags' },
			line_items: {
				description: 'List of line items in the debit note.',
				type: 'array',
				items: {
					type: 'object',
					required: ['item_id'],
					properties: {
						item_id: { $ref: '#/components/schemas/item_id' },
						product_type: { $ref: '#/components/schemas/product_type' },
						hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
						location_id: { $ref: '#/components/schemas/location_id' },
						description: { $ref: '#/components/schemas/description' },
						rate: { $ref: '#/components/schemas/rate' },
						quantity: { $ref: '#/components/schemas/quantity' },
						unit: { $ref: '#/components/schemas/unit' },
						tax_id: { $ref: '#/components/schemas/tax_id' },
						item_total: { $ref: '#/components/schemas/item_total' },
						tags: { $ref: '#/components/schemas/tags' },
						line_item_category: {
							$ref: '#/components/schemas/line_item_category',
						},
					},
				},
			},
		},
	},
	'update-a-customer-debit-note-response': {
		type: 'object',
		properties: {
			code: { type: 'integer' },
			message: { type: 'string' },
			invoice: { $ref: '#/components/schemas/debit_note' },
		},
	},
} as const satisfies Record<string, JsonValue>;

export const operations = [
	{
		id: 'create_customer_debit_note',
		group: 'customerDebitNotes',
		groupSlug: 'customer-debit-notes',
		name: 'createCustomerDebitNote',
		method: 'POST',
		path: '/invoices',
		summary: 'Create a customer debit note',
		description:
			'Create a customer debit note for additional charges or adjustments to be made to the original invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/customer-debit-notes/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'Organization ID for the request',
				schema: { type: 'string' },
			},
			{
				name: 'send',
				in: 'query',
				required: false,
				description:
					'Send the debit note to the contact person(s) associated with the debit note. Allowed values <code>true</code> and <code>false</code>.',
				schema: { type: 'boolean' },
			},
			{
				name: 'ignore_auto_number_generation',
				in: 'query',
				required: false,
				description:
					'Ignore auto debit note number generation for this debit note. This mandates the debit note number. Allowed values <code>true</code> and <code>false</code>',
				schema: { type: 'boolean' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: {
				$ref: '#/components/schemas/create-a-customer-debit-note-request',
			},
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/create-a-customer-debit-note-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_customer_debit_notes',
		group: 'customerDebitNotes',
		groupSlug: 'customer-debit-notes',
		name: 'listCustomerDebitNotes',
		method: 'GET',
		path: '/invoices',
		summary: 'List customer debit notes',
		description:
			'Get a list of customer debit notes with helpful pagination, filtering, search, and sorting features. Perfect for viewing your debit note data in organized ways, whether you need to find specific debit notes or browse through your records.',
		docsUrl: 'https://www.zoho.com/books/api/v3/customer-debit-notes/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'Organization ID for the request',
				schema: { type: 'string' },
			},
			{
				name: 'item_name',
				in: 'query',
				required: false,
				description:
					'Search debit notes by item name. Filters debit notes based on product or service names in debit note line items. Supports <code>item_name_startswith</code> and <code>item_name_contains</code> variants. Maximum length is 100 characters. Useful for finding debit notes with specific products or services.',
				schema: { type: 'string' },
			},
			{
				name: 'item_id',
				in: 'query',
				required: false,
				description:
					'Search debit notes by item ID. Filters debit notes based on the unique identifier of specific products or services in line items. Use the GET `/items` API to find available item IDs. Useful for finding all debit notes containing a specific product or service.',
				schema: { type: 'string' },
			},
			{
				name: 'item_description',
				in: 'query',
				required: false,
				description:
					'Search debit notes by item description. Filters debit notes based on detailed descriptions of products or services in line items. Supports <code>item_description_startswith</code> and <code>item_description_contains</code> variants. Maximum length is 100 characters. Useful for finding debit notes with specific item descriptions or technical specifications.',
				schema: { type: 'string' },
			},
			{
				name: 'customer_name',
				in: 'query',
				required: false,
				description:
					'Search debit notes by customer name. Filters debit notes based on the business or individual name associated with the debit note. Maximum length is 100 characters. Useful for finding all debit notes for a specific customer or generating customer reports.',
				schema: { type: 'string' },
			},
			{
				name: 'email',
				in: 'query',
				required: false,
				description:
					'Search debit notes by customer email address. Filters debit notes based on the email address of the customer or contact person. Maximum length is 100 characters. Useful for finding debit notes for specific customers or generating customer segment reports.',
				schema: { type: 'string' },
			},
			{
				name: 'total',
				in: 'query',
				required: false,
				description:
					'Search debit notes by total amount. Filters debit notes based on the final debit note amount including taxes, discounts, and adjustments. Useful for finding debit notes within specific price ranges or identifying high-value transactions.',
				schema: { type: 'string' },
			},
			{
				name: 'balance',
				in: 'query',
				required: false,
				description:
					'Search debit notes by outstanding balance. Filters debit notes based on the remaining unpaid amount owed by the customer. Useful for finding overdue debit notes, tracking receivables, or generating aging reports.',
				schema: { type: 'string' },
			},
			{
				name: 'custom_field',
				in: 'query',
				required: false,
				description:
					'Search debit notes by custom fields.Variants: <code>custom_field_startswith</code> and <code>custom_field_contains</code>',
				schema: { type: 'string' },
			},
			{
				name: 'date',
				in: 'query',
				required: false,
				description:
					'Search debit notes by debit note date. Filters debit notes based on the date they were created. Use yyyy-mm-dd format. Supports variants: <code>date_start</code>, <code>date_end</code>, <code>date_before</code> and <code>date_after</code>. Useful for finding debit notes within date ranges or specific time periods.',
				schema: { type: 'string' },
			},
			{
				name: 'due_date',
				in: 'query',
				required: false,
				description:
					'Search debit notes by due date. Filters debit notes based on the payment due date. Use yyyy-mm-dd format. Supports variants: <code>due_date_start</code>, <code>due_date_end</code>, <code>due_date_before</code> and <code>due_date_after</code>. Useful for finding overdue debit notes or debit notes due within specific periods.',
				schema: { type: 'string' },
			},
			{
				name: 'created_date',
				in: 'query',
				required: false,
				description:
					'Search debit notes by creation date. Filters debit notes based on the date they were created. Use yyyy-mm-dd format. Supports variants: <code>created_date_start</code>, <code>created_date_end</code>, <code>created_date_before</code> and <code>created_date_after</code>. Useful for finding debit notes created within specific time periods or date ranges.',
				schema: { type: 'string' },
			},
			{
				name: 'last_modified_time',
				in: 'query',
				required: false,
				description:
					'Search debit notes modified after a specific time. Filters debit notes based on their last modification timestamp. Use YYYY-MM-DDTHH:MM:SS-UTC format. Useful for finding recently updated debit notes or syncing data changes. sample : 2023-11-18T02:02:51-0800, 2025-19-19T02:02:51%2B0800',
				schema: { type: 'string' },
			},
			{
				name: 'status',
				in: 'query',
				required: false,
				description:
					'Search debit notes by status. Filters debit notes based on their current state in the billing workflow. Allowed values: <code>sent</code>, <code>draft</code>, <code>overdue</code>, <code>paid</code>, <code>void</code>, <code>unpaid</code>, <code>partially_paid</code> and <code>viewed</code>. Useful for finding debit notes in specific stages of the billing process.',
				schema: { type: 'string' },
			},
			{
				name: 'customer_id',
				in: 'query',
				required: false,
				description:
					'Search debit notes by customer ID. Filters debit notes based on the unique identifier of the customer for whom the debit note was created. Use the customer ID returned by the Contacts API to find all debit notes for a specific customer.',
				schema: { type: 'string' },
			},
			{
				name: 'filter_by',
				in: 'query',
				required: true,
				description: 'Filter needs to be  <code>Type.DebitNote</code>.',
				schema: { type: 'string', enum: ['Type.DebitNote'] },
			},
			{
				name: 'search_text',
				in: 'query',
				required: false,
				description:
					'Search debit notes by debit note number, purchase order, or customer name. This parameter performs a general search across multiple debit note fields. Maximum length is 100 characters. Useful for quick searches when you know part of the debit note information but are unsure which specific field to search.',
				schema: { type: 'string' },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description:
					'Sort debit notes by specific column. Allowed values: <code>customer_name</code>, <code>debit_note_number</code>, <code>date</code>, <code>due_date</code>, <code>total</code>, <code>balance</code> and <code>created_time</code>. Use this parameter to organize debit note results in a specific order for better data analysis and reporting.',
				schema: { type: 'string' },
			},
			{
				name: 'page',
				in: 'query',
				required: false,
				description:
					'Page number to be fetched from the paginated results. Default value is 1. Use this parameter along with per_page to navigate through large sets of debit note data. Useful for implementing pagination in your application.',
				schema: { type: 'integer', default: 1 },
			},
			{
				name: 'per_page',
				in: 'query',
				required: false,
				description:
					'Number of records to be fetched per page. Use this parameter to control the size of each page of results. Maximum value is 200. Useful for optimizing data transfer and improving application performance.',
				schema: { type: 'integer', default: 10 },
			},
			{
				name: 'invoice_number',
				in: 'query',
				required: false,
				description:
					'Search invoices by invoice number. Filters invoices based on their unique identifier. Supports <code>invoice_number_startswith</code> and <code>invoice_number_contains</code> variants. Maximum length is 100 characters. Useful for finding specific invoices or invoices with similar numbering patterns.',
				schema: { type: 'string' },
			},
			{
				name: 'reference_number',
				in: 'query',
				required: false,
				description:
					'Search invoices by reference number. Filters invoices based on external reference identifiers like purchase order numbers, contract numbers, or project codes. Useful for finding invoices associated with specific projects or business transactions.',
				schema: { type: 'string' },
			},
			{
				name: 'recurring_invoice_id',
				in: 'query',
				required: false,
				description:
					'ID of the recurring invoice from which the invoice is created. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'date_start',
				in: 'query',
				required: false,
				description:
					'Filter invoices with an invoice date on or after the specified date. Useful for defining the start of a date range. Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'date_end',
				in: 'query',
				required: false,
				description:
					'Filter invoices with an invoice date on or before the specified date. Useful for defining the end of a date range. Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'date_before',
				in: 'query',
				required: false,
				description:
					'Filter invoices with an invoice date strictly before the specified date (exclusive). Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'date_after',
				in: 'query',
				required: false,
				description:
					'Filter invoices with an invoice date strictly after the specified date (exclusive). Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'due_date_start',
				in: 'query',
				required: false,
				description:
					'Filter invoices with due date on or after the specified date. Useful for defining the start of a date range. Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'due_date_end',
				in: 'query',
				required: false,
				description:
					'Filter invoices with due date on or before the specified date. Useful for defining the end of a date range. Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'due_date_before',
				in: 'query',
				required: false,
				description:
					'Filter invoices with due date strictly before the specified date (exclusive). Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'due_date_after',
				in: 'query',
				required: false,
				description:
					'Filter invoices with due date strictly after the specified date (exclusive). Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'created_date_start',
				in: 'query',
				required: false,
				description:
					'Filter invoices with invoice created date on or after the specified date. Useful for defining the start of a date range. Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'created_date_end',
				in: 'query',
				required: false,
				description:
					'Filter invoices with invoice created date on or before the specified date. Useful for defining the end of a date range. Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'zcrm_potential_id',
				in: 'query',
				required: false,
				description:
					'Search invoices by CRM potential ID. This parameter allows you to find invoices associated with a specific deal or opportunity in your Zoho CRM system. Use the potential ID from your CRM to link invoices to sales opportunities and track revenue from specific deals. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'response_option',
				in: 'query',
				required: false,
				description:
					'To get desired response format. There are 5 formats of responses: 0 (Includes all invoices), 1 (Includes all invoices, the number of invoices, and the sum of their total and balance amounts), 2 (Includes only the number of invoices), 3 (Includes the number of invoices and the sum of their total and balance amounts), and 4 (Includes all invoices and the sum of their total and balance amounts).',
				schema: { type: 'integer' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/list-customer-debit-notes-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_customer_debit_note',
		group: 'customerDebitNotes',
		groupSlug: 'customer-debit-notes',
		name: 'updateCustomerDebitNote',
		method: 'PUT',
		path: '/invoices/{debit_note_id}',
		summary: 'Update a customer debit note',
		description:
			'Update an existing customer debit note. To delete a line item just remove it from the line_items list.',
		docsUrl: 'https://www.zoho.com/books/api/v3/customer-debit-notes/',
		parameters: [
			{
				name: 'debit_note_id',
				in: 'path',
				required: true,
				description: 'Unique identifier for the debit note',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'Organization ID for the request',
				schema: { type: 'string' },
			},
			{
				name: 'ignore_auto_number_generation',
				in: 'query',
				required: false,
				description:
					'Ignore auto debit note number generation for this debit note. This mandates the debit note number. Allowed values <code>true</code> and <code>false</code>',
				schema: { type: 'boolean' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: {
				$ref: '#/components/schemas/update-a-customer-debit-note-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-a-customer-debit-note-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_customer_debit_note',
		group: 'customerDebitNotes',
		groupSlug: 'customer-debit-notes',
		name: 'getCustomerDebitNote',
		method: 'GET',
		path: '/invoices/{debit_note_id}',
		summary: 'Get a customer debit note',
		description: 'Get the details of a customer debit note.',
		docsUrl: 'https://www.zoho.com/books/api/v3/customer-debit-notes/',
		parameters: [
			{
				name: 'debit_note_id',
				in: 'path',
				required: true,
				description: 'Unique identifier for the debit note',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'Organization ID for the request',
				schema: { type: 'string' },
			},
			{
				name: 'print',
				in: 'query',
				required: false,
				description: 'Print the exported pdf.',
				schema: { type: 'boolean' },
			},
			{
				name: 'accept',
				in: 'query',
				required: false,
				description:
					'Get the details of a particular debit note in formats such as json/ pdf/ html. Default format is json. Allowed values <code>json</code> <code>pdf</code> and <code>html</code>',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/get-a-customer-debit-note-response',
				},
			},
			{
				status: '200',
				contentType: 'application/pdf',
				schema: { type: 'string', format: 'binary' },
			},
			{
				status: '200',
				contentType: 'text/html',
				schema: { type: 'string', format: 'binary' },
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_customer_debit_note',
		group: 'customerDebitNotes',
		groupSlug: 'customer-debit-notes',
		name: 'deleteCustomerDebitNote',
		method: 'DELETE',
		path: '/invoices/{debit_note_id}',
		summary: 'Delete a customer debit note',
		description:
			'Delete an existing customer debit note. Debit notes which have payment or credits note applied cannot be deleted.',
		docsUrl: 'https://www.zoho.com/books/api/v3/customer-debit-notes/',
		parameters: [
			{
				name: 'debit_note_id',
				in: 'path',
				required: true,
				description: 'Unique identifier for the debit note',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'Organization ID for the request',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/delete-a-customer-debit-note-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.DELETE'],
		riskLevel: 'destructive',
	},
] as const satisfies readonly ZohoBooksOperationDefinition[];
