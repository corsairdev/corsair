import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas: Record<string, JsonValue> = {
	'create-a-sales-receipt-request': {
		required: ['customer_id', 'payment_mode'],
		type: 'object',
		properties: {
			customer_id: {
				description: 'Unique identifier for the customer',
				type: 'string',
			},
			receipt_number: {
				description:
					'Sales receipt number (required if auto-numbering is disabled)',
				type: 'string',
			},
			date: { description: 'Date of the sales receipt', type: 'string' },
			payment_mode: {
				description:
					'Mode through which payment was received. Allowed values: cash, check, credit_card, bank_transfer, etc.',
				type: 'string',
			},
			line_items: {
				description: 'Line items for the sales receipt',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						item_id: { description: 'ID of the item', type: 'string' },
						rate: {
							description: 'Rate of the item',
							type: 'number',
							format: 'double',
						},
						quantity: {
							description: 'Quantity of the item',
							type: 'number',
							format: 'double',
						},
						tax_id: {
							description: 'ID of the tax to be applied',
							type: 'string',
						},
						product_tax_category: {
							$ref: '#/components/schemas/product_tax_category',
						},
						tags: { $ref: '#/components/schemas/tags' },
						line_item_category: {
							$ref: '#/components/schemas/line_item_category',
						},
					},
				},
			},
			notes: { description: 'Notes for the sales receipt', type: 'string' },
			terms: { description: 'Terms and conditions', type: 'string' },
			tags: { $ref: '#/components/schemas/tags' },
		},
	},
	'create-a-sales-receipt-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			salesreceipt: { $ref: '#/components/schemas/salesreceipt-response' },
		},
	},
	'delete-a-sales-receipt-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'email-a-sales-receipt-request': {
		required: ['to_mail_ids', 'subject', 'body'],
		type: 'object',
		properties: {
			to_mail_ids: {
				description: 'Array of email addresses of the recipients',
				type: 'array',
				items: { type: 'string' },
			},
			subject: { description: 'Subject of the mail', type: 'string' },
			body: { description: 'Body of the mail', type: 'string' },
		},
	},
	'email-a-sales-receipt-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-a-sales-receipt-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			salesreceipt: { $ref: '#/components/schemas/salesreceipt-response' },
		},
	},
	is_tag_mandatory: {
		description: 'Used to check if the tag is mandatory',
		type: 'boolean',
	},
	line_item_category: {
		description:
			'Category of the line item. Allowed values are <code>line_item</code>, <code>header</code> and <code>subtotal</code>. Use <code>line_item</code> for regular line items, <code>header</code> for header titles and <code>subtotal</code> for intermediate subtotal rows. For regular line items, you can send line_item or omit this field',
		type: 'string',
	},
	'list-sales-receipts-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			salesreceipts: {
				type: 'array',
				items: { $ref: '#/components/schemas/salesreceipt-response' },
			},
		},
	},
	product_tax_category: {
		description:
			'Tax category of the product or service on the line item, used for automated sales tax. <code>tax_category_code</code> is required; <code>tax_category_name</code> and <code>description</code> can be omitted or empty. If the code already exists in the organization, the existing category is used; otherwise, a new category is created with the details sent. When omitted and automated sales tax is enabled, the line uses the tax category of the item in <code>item_id</code>.',
		type: 'object',
		required: ['tax_category_code'],
		properties: {
			tax_category_code: {
				description:
					'Code of the tax category, as listed by the tax provider (for sample, <code>PC040100</code>). Maximum length: 1000 characters.',
				type: 'string',
			},
			tax_category_name: {
				description:
					'Name of the tax category (for sample, <code>Apparel</code>). Can be omitted or empty. Maximum length: 1000 characters.',
				type: 'string',
			},
			description: {
				description:
					'Description of the tax category. Can be omitted or empty. Max-length [8000]',
				type: 'string',
			},
		},
		'x-node_available_in': ['us', 'ca', 'sg', 'my', 'ng'],
		'x-node_unavailable_in': [],
	},
	'salesreceipt-response': {
		type: 'object',
		properties: {
			sales_receipt_id: {
				description: 'ID of the Sales Receipt',
				type: 'string',
			},
			receipt_number: {
				description:
					'Unique alphanumeric identifier for the sales receipt. Required when automatic numbering is disabled in organization settings.',
				type: 'string',
			},
			date: {
				description:
					'Date when the sales receipt was created in YYYY-MM-DD format.',
				type: 'string',
			},
			status: { description: 'Status of the Sales Receipt', type: 'string' },
			payment_mode: {
				description: 'Mode through which payment was received',
				type: 'string',
			},
			customer_id: {
				description: 'Unique identifier for the customer',
				type: 'string',
			},
			customer_name: { description: 'Name of the customer', type: 'string' },
			currency_id: {
				description: 'Currency ID for the sales receipt',
				type: 'string',
			},
			currency_code: { description: 'Currency code', type: 'string' },
			currency_symbol: { description: 'Currency symbol', type: 'string' },
			exchange_rate: {
				description: 'Exchange rate for multi-currency transactions',
				type: 'number',
				format: 'double',
			},
			tags: { $ref: '#/components/schemas/tags_response' },
			line_items: {
				description: 'Line items of the sales receipt',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						item_id: { description: 'ID of the item', type: 'string' },
						name: { description: 'Name of the line item', type: 'string' },
						description: {
							description: 'Description of the line item',
							type: 'string',
						},
						rate: {
							description: 'Rate of the line item',
							type: 'number',
							format: 'double',
						},
						quantity: {
							description: 'Quantity of the line item',
							type: 'number',
							format: 'double',
						},
						unit: { description: 'Unit of the line item', type: 'string' },
						item_total: {
							description: 'Total amount for the line item',
							type: 'number',
							format: 'double',
						},
						tax_id: { description: 'ID of the tax applied', type: 'string' },
						tax_name: { description: 'Name of the tax', type: 'string' },
						tax_percentage: {
							description: 'Tax percentage',
							type: 'number',
							format: 'double',
						},
						tags: { $ref: '#/components/schemas/tags_response' },
						line_item_category: {
							$ref: '#/components/schemas/line_item_category',
						},
					},
				},
			},
			sub_total: {
				description: 'Sub total of the sales receipt',
				type: 'number',
				format: 'double',
			},
			tax_total: {
				description: 'Total tax amount',
				type: 'number',
				format: 'double',
			},
			total: {
				description: 'Total amount of the sales receipt',
				type: 'number',
				format: 'double',
			},
			notes: { description: 'Notes for the sales receipt', type: 'string' },
			terms: { description: 'Terms and conditions', type: 'string' },
			created_time: {
				description: 'Creation time of the sales receipt',
				type: 'string',
			},
			last_modified_time: {
				description: 'Last modified time of the sales receipt',
				type: 'string',
			},
		},
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
	'update-a-sales-receipt-request': {
		required: ['customer_id'],
		type: 'object',
		properties: {
			customer_id: {
				description: 'Unique identifier for the customer',
				type: 'string',
			},
			receipt_number: { description: 'Sales receipt number', type: 'string' },
			date: { description: 'Date of the sales receipt', type: 'string' },
			payment_mode: {
				description: 'Mode through which payment was received',
				type: 'string',
			},
			line_items: {
				description: 'Line items for the sales receipt',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						item_id: { description: 'ID of the item', type: 'string' },
						rate: {
							description: 'Rate of the item',
							type: 'number',
							format: 'double',
						},
						quantity: {
							description: 'Quantity of the item',
							type: 'number',
							format: 'double',
						},
						product_tax_category: {
							$ref: '#/components/schemas/product_tax_category',
						},
						tags: { $ref: '#/components/schemas/tags' },
						line_item_category: {
							$ref: '#/components/schemas/line_item_category',
						},
					},
				},
			},
			notes: { description: 'Notes for the sales receipt', type: 'string' },
			tags: { $ref: '#/components/schemas/tags' },
		},
	},
	'update-a-sales-receipt-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			salesreceipt: { $ref: '#/components/schemas/salesreceipt-response' },
		},
	},
};

export const operations: readonly ZohoBooksOperationDefinition[] = [
	{
		id: 'create_sales_receipt',
		group: 'salesReceipt',
		groupSlug: 'sales-receipt',
		name: 'createSalesReceipt',
		method: 'POST',
		path: '/salesreceipts',
		summary: 'Create a sales receipt',
		description: 'Create a sales receipt for immediate payment transactions.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-receipt/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'ignore_auto_number_generation',
				in: 'query',
				required: false,
				description:
					'Ignore auto sales receipt number generation for this sales receipt. This mandates the sales receipt number.',
				schema: { type: 'boolean' },
			},
			{
				name: 'can_send_in_mail',
				in: 'query',
				required: false,
				description: 'Send the sales receipt to customer via email.',
				schema: { type: 'boolean' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/create-a-sales-receipt-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/create-a-sales-receipt-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_sales_receipts',
		group: 'salesReceipt',
		groupSlug: 'sales-receipt',
		name: 'listSalesReceipts',
		method: 'GET',
		path: '/salesreceipts',
		summary: 'List sales receipts',
		description: 'List all sales receipts.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-receipt/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'receipt_number',
				in: 'query',
				required: false,
				description:
					'Search receipt by receipt number. Filters receipts based on their unique identifier. Supports <code>receipt_number_startswith</code> and <code>receipt_number_contains</code> variants. Maximum length is 100 characters. Useful for finding specific receipts or receipts with similar numbering patterns.',
				schema: { type: 'string' },
			},
			{
				name: 'item_name',
				in: 'query',
				required: false,
				description:
					'Search receipt by item name. Supports <code>item_name_startswith</code> and <code>item_name_contains</code> variants. Maximum length is 100 characters.',
				schema: { type: 'string' },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description:
					'Specify the column field for sorting sales receipt results. Available options include <code>customer_name</code>, <code>receipt_number</code>, <code>date</code>, <code>total</code>, and <code>created_time</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'filter_by',
				in: 'query',
				required: false,
				description:
					'Filter sales receipts by status. Allowed Values: <code>ThisWeek</code>, <code>ThisMonth</code>, <code>ThisQuarter</code>, <code>ThisYear</code>,<code>PreviousDay</code>, <code>PreviousWeek</code>, <code>PreviousMonth</code>, <code>PreviousQuarter</code>, <code>PreviousYear</code>, <code>Status.All</code>, <code>Status.Draft</code>, <code>Status.Sent</code>',
				schema: { type: 'string' },
			},
			{
				name: 'customer_id',
				in: 'query',
				required: false,
				description: 'Filter sales receipts by specific customer identifier.',
				schema: { type: 'string' },
			},
			{
				name: 'date',
				in: 'query',
				required: false,
				description:
					'Filter sales receipts by date. Available variants include <code>date_start</code>, <code>date_end</code>, <code>date_before</code>, and <code>date_after</code>. Default date format: <code>yyyy-mm-dd</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'total',
				in: 'query',
				required: false,
				description:
					'Filter sales receipts by total amount using various range operators. Available variants include <code>total_start</code>, <code>total_end</code>, <code>total_less_than</code>, <code>total_greater_than</code>.',
				schema: { type: 'number', format: 'double' },
			},
			{
				name: 'page',
				in: 'query',
				required: false,
				description:
					'Specify the page number for paginated results retrieval. Default value is 1 for the first page.',
				schema: { type: 'integer', default: 1 },
			},
			{
				name: 'per_page',
				in: 'query',
				required: false,
				description:
					'Specify the maximum number of sales receipt records to return per page.',
				schema: { type: 'integer', default: 10 },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/list-sales-receipts-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_sales_receipt',
		group: 'salesReceipt',
		groupSlug: 'sales-receipt',
		name: 'updateSalesReceipt',
		method: 'PUT',
		path: '/salesreceipts/{sales_receipt_id}',
		summary: 'Update a sales receipt',
		description: 'Update an existing sales receipt.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-receipt/',
		parameters: [
			{
				name: 'sales_receipt_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the sales receipt.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/update-a-sales-receipt-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-a-sales-receipt-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_sales_receipt',
		group: 'salesReceipt',
		groupSlug: 'sales-receipt',
		name: 'getSalesReceipt',
		method: 'GET',
		path: '/salesreceipts/{sales_receipt_id}',
		summary: 'Get a sales receipt',
		description: 'Get the details of a sales receipt.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-receipt/',
		parameters: [
			{
				name: 'sales_receipt_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the sales receipt.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'accept',
				in: 'query',
				required: false,
				description:
					'Get the details of a particular sales receipt in formats such as json/ pdf/ html. Default format is json. Allowed Values: <code>json</code>, <code>pdf</code>, <code>html</code>.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/get-a-sales-receipt-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_sales_receipt',
		group: 'salesReceipt',
		groupSlug: 'sales-receipt',
		name: 'deleteSalesReceipt',
		method: 'DELETE',
		path: '/salesreceipts/{sales_receipt_id}',
		summary: 'Delete a sales receipt',
		description: 'Delete an existing sales receipt.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-receipt/',
		parameters: [
			{
				name: 'sales_receipt_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the sales receipt.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/delete-a-sales-receipt-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'email_sales_receipt',
		group: 'salesReceipt',
		groupSlug: 'sales-receipt',
		name: 'emailSalesReceipt',
		method: 'POST',
		path: '/salesreceipts/{sales_receipt_id}/email',
		summary: 'Email a sales receipt',
		description: 'Email a sales receipt to the customer.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-receipt/',
		parameters: [
			{
				name: 'attach_pdf',
				in: 'query',
				required: false,
				description: 'Send the sales receipt pdf with the email.',
				schema: { type: 'boolean' },
			},
			{
				name: 'sales_receipt_id',
				in: 'path',
				required: true,
				description: 'ID of the sales receipt to be emailed',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'Organization ID required by the Zoho Books API introduction.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/email-a-sales-receipt-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/email-a-sales-receipt-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
];
