import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas = {
	account_id: {
		description:
			'ID of the cash/bank account the payment has to be deposited. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	amount: {
		description: 'Amount paid in the respective payment.',
		type: 'number',
		format: 'double',
	},
	amount_applied: {
		description: 'Amount paid for the invoice.',
		type: 'number',
		format: 'double',
	},
	amount_bcy: { type: 'integer' },
	amount_fcy: { type: 'integer' },
	amount_refunded: {
		description:
			'Amount that is refund. Refunds are applicable only for payments whose payment_mode is <code>autotransaction</code>. Refunds would be made to the respective card provided by the customer.',
		type: 'number',
		format: 'double',
	},
	balance_amount: {
		description: 'Unpaid amount of the invoice.',
		type: 'number',
		format: 'double',
	},
	bank_charges: {
		description: 'Denotes any additional bank charges.',
		type: 'number',
		format: 'double',
	},
	bcy_amount: { type: 'string' },
	'bulk-delete-customer-payments-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	contact_persons: {
		description:
			'IDs of the contact personsthe thank you mail has to be triggered.',
		type: 'array',
		items: { type: 'string' },
	},
	'create-a-payment-request': {
		required: [
			'customer_id',
			'payment_mode',
			'amount',
			'invoices',
			'date',
			'invoice_id',
			'amount_applied',
		],
		type: 'object',
		properties: {
			customer_id: { $ref: '#/components/schemas/customer_id' },
			payment_mode: { $ref: '#/components/schemas/payment_mode' },
			amount: { $ref: '#/components/schemas/amount' },
			date: { $ref: '#/components/schemas/date' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			description: { $ref: '#/components/schemas/description' },
			invoices: {
				description:
					'List of invoices associated with the payment. Each invoice object contains <code>invoice_id</code>, <code>invoice_number</code>, <code>date</code>, <code>invoice_amount</code>, <code>amount_applied</code> and <code>balance_amount</code>.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						invoice_id: { $ref: '#/components/schemas/invoice_id' },
						amount_applied: { $ref: '#/components/schemas/amount_applied' },
						tax_amount_withheld: {
							$ref: '#/components/schemas/tax_amount_withheld',
						},
					},
				},
			},
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			payment_form: { $ref: '#/components/schemas/payment_form' },
			bank_charges: { $ref: '#/components/schemas/bank_charges' },
			custom_fields: {
				description: 'Additional fields for the payments.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						label: { $ref: '#/components/schemas/label' },
						value: { $ref: '#/components/schemas/value' },
					},
				},
			},
			location_id: { $ref: '#/components/schemas/location_id' },
			invoice_id: { $ref: '#/components/schemas/invoice_id' },
			amount_applied: { $ref: '#/components/schemas/amount_applied' },
			account_id: { $ref: '#/components/schemas/account_id' },
			contact_persons: { $ref: '#/components/schemas/contact_persons' },
			retainerinvoice_id: { $ref: '#/components/schemas/retainerinvoice_id' },
			tags: { $ref: '#/components/schemas/tags' },
		},
	},
	'create-a-payment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			payment: { $ref: '#/components/schemas/payment-response' },
		},
	},
	currency_code: {
		description: 'Currency code in which the payment is made.',
		type: 'string',
	},
	currency_symbol: {
		description: "Customer's currency symbol.",
		type: 'string',
	},
	custom_fields: {
		description: 'Additional fields for the payments.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				value: { $ref: '#/components/schemas/value' },
				label: { $ref: '#/components/schemas/label' },
				data_type: { $ref: '#/components/schemas/data_type' },
			},
		},
	},
	customer_id: {
		description:
			'Customer ID of the customer involved in the payment. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	customer_name: {
		description:
			'Name of the customer to whom the invoice is raised. Max-length [100]',
		type: 'string',
	},
	data_type: { description: 'Data type of the custom field.', type: 'string' },
	date: {
		description: 'Date on which payment is made. Format [yyyy-mm-dd]',
		type: 'string',
	},
	'delete-a-payment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-a-refund-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	description: {
		description: 'Description about the payment.',
		type: 'string',
	},
	'details-of-a-refund-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			payment_refunds: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						payment_refund_id: {
							$ref: '#/components/schemas/payment_refund_id',
						},
						payment_id: { $ref: '#/components/schemas/payment_id' },
						date: { $ref: '#/components/schemas/date' },
						refund_mode: { $ref: '#/components/schemas/refund_mode' },
						reference_number: { $ref: '#/components/schemas/reference_number' },
						amount: { $ref: '#/components/schemas/amount' },
						exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
						payment_form: { $ref: '#/components/schemas/payment_form' },
						description: { $ref: '#/components/schemas/description' },
					},
				},
			},
		},
	},
	email: {
		description: 'Email address of the customer involved in the payment.',
		type: 'string',
	},
	exchange_rate: {
		description:
			"Exchange rate for the currency used in the invoices and customer's currency. The payment amount would be the multiplicative product of the original amount and the exchange rate.",
		type: 'number',
		format: 'double',
		default: 1,
	},
	from_account_id: {
		description:
			'The account from which payment is refunded. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	has_more_page: { type: 'boolean' },
	index: {
		description:
			'Index of the custom field. It can hold any value from 1 to 10.',
		type: 'integer',
	},
	invoice_amount: {
		description: 'Total amount raised for the invoice.',
		type: 'number',
		format: 'double',
	},
	invoice_id: {
		description:
			'Invoice ID of the required invoice. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	invoice_number: {
		description: 'Unique ID (starts with INV) of an invoice.',
		type: 'string',
	},
	is_tag_mandatory: {
		description: 'Used to check if the tag is mandatory',
		type: 'boolean',
	},
	label: { description: 'Label of the custom field.', type: 'string' },
	'list-customer-payments-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			customer_payments: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						payment_id: { $ref: '#/components/schemas/payment_id' },
						payment_number: { $ref: '#/components/schemas/payment_number' },
						invoice_number: { $ref: '#/components/schemas/invoice_number' },
						date: { $ref: '#/components/schemas/date' },
						payment_mode: { $ref: '#/components/schemas/payment_mode' },
						amount: { $ref: '#/components/schemas/amount' },
						bcy_amount: { $ref: '#/components/schemas/bcy_amount' },
						location_id: { $ref: '#/components/schemas/location_id' },
						location_name: { $ref: '#/components/schemas/location_name' },
						tags: { $ref: '#/components/schemas/tags_response' },
					},
				},
			},
			page_context: {},
		},
	},
	'list-refunds-of-a-customer-payment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			payment_refunds: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						payment_refund_id: {
							$ref: '#/components/schemas/payment_refund_id',
						},
						payment_id: { $ref: '#/components/schemas/payment_id' },
						date: { $ref: '#/components/schemas/date' },
						refund_mode: { $ref: '#/components/schemas/refund_mode' },
						reference_number: { $ref: '#/components/schemas/reference_number' },
						payment_number: { $ref: '#/components/schemas/payment_number' },
						customer_name: { $ref: '#/components/schemas/customer_name' },
						amount_bcy: { $ref: '#/components/schemas/amount_bcy' },
						amount_fcy: { $ref: '#/components/schemas/amount_fcy' },
					},
				},
			},
			page_context: {
				type: 'object',
				properties: {
					page: { $ref: '#/components/schemas/page' },
					per_page: { $ref: '#/components/schemas/per_page' },
					has_more_page: { $ref: '#/components/schemas/has_more_page' },
					report_name: { $ref: '#/components/schemas/report_name' },
					sort_column: { $ref: '#/components/schemas/sort_column' },
					sort_order: { $ref: '#/components/schemas/sort_order' },
				},
			},
		},
	},
	location_id: {
		description:
			'Location ID. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	location_name: { description: 'Name of the location.', type: 'string' },
	page: { type: 'integer' },
	'payment-response': {
		type: 'object',
		properties: {
			payment_id: { $ref: '#/components/schemas/payment_id' },
			payment_mode: { $ref: '#/components/schemas/payment_mode' },
			amount: { $ref: '#/components/schemas/amount' },
			amount_refunded: { $ref: '#/components/schemas/amount_refunded' },
			bank_charges: { $ref: '#/components/schemas/bank_charges' },
			date: { $ref: '#/components/schemas/date' },
			status: { $ref: '#/components/schemas/status' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			description: { $ref: '#/components/schemas/description' },
			customer_id: { $ref: '#/components/schemas/customer_id' },
			customer_name: { $ref: '#/components/schemas/customer_name' },
			email: { $ref: '#/components/schemas/email' },
			tags: { $ref: '#/components/schemas/tags_response' },
			invoices: {
				description:
					'List of invoices associated with the payment. Each invoice object contains <code>invoice_id</code>, <code>invoice_number</code>, <code>date</code>, <code>invoice_amount</code>, <code>amount_applied</code> and <code>balance_amount</code>.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						invoice_id: { $ref: '#/components/schemas/invoice_id' },
						invoice_number: { $ref: '#/components/schemas/invoice_number' },
						date: { description: 'Date on which the invoice was raised.' },
						invoice_amount: { $ref: '#/components/schemas/invoice_amount' },
						amount_applied: { $ref: '#/components/schemas/amount_applied' },
						balance_amount: { $ref: '#/components/schemas/balance_amount' },
						tax_amount_withheld: {
							$ref: '#/components/schemas/tax_amount_withheld',
						},
					},
				},
			},
			currency_code: { $ref: '#/components/schemas/currency_code' },
			currency_symbol: { $ref: '#/components/schemas/currency_symbol' },
			location_id: { $ref: '#/components/schemas/location_id' },
			location_name: { $ref: '#/components/schemas/location_name' },
			custom_fields: {
				description: 'Additional fields for the payments.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						index: { $ref: '#/components/schemas/index' },
						value: { $ref: '#/components/schemas/value' },
						label: { $ref: '#/components/schemas/label' },
						data_type: { $ref: '#/components/schemas/data_type' },
					},
				},
			},
		},
	},
	payment_form: {
		description: 'Mode of Vendor Payment',
		type: 'string',
		'x-node_available_in': ['mx'],
		'x-node_unavailable_in': [],
	},
	payment_id: {
		description:
			'Unique ID of the payment generated by the server. Max-length [2000]. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	payment_mode: {
		description:
			'Mode through which payment is made. This can be <code>check</code>, <code>cash</code>, <code>creditcard</code>, <code>banktransfer</code>, <code>bankremittance</code>, <code>autotransaction</code> or <code>others</code>. Max-length [100]',
		type: 'string',
	},
	payment_number: {
		description: 'The number for the payment.',
		type: 'string',
	},
	payment_refund_id: {
		description:
			'An unique ID for the payment refund generated by the server. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	per_page: { type: 'integer' },
	reference_number: {
		description:
			'Reference number generated for the payment. A string of your choice can also be used as the reference number. Max-length [100]',
		type: 'string',
	},
	'refund-an-excess-customer-payment-request': {
		required: ['date', 'amount', 'from_account_id'],
		type: 'object',
		properties: {
			date: { $ref: '#/components/schemas/date' },
			refund_mode: { $ref: '#/components/schemas/refund_mode' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			amount: { $ref: '#/components/schemas/amount' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			payment_form: { $ref: '#/components/schemas/payment_form' },
			from_account_id: { $ref: '#/components/schemas/from_account_id' },
			description: { $ref: '#/components/schemas/description' },
		},
	},
	'refund-an-excess-customer-payment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			payment_refunds: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						payment_refund_id: {
							$ref: '#/components/schemas/payment_refund_id',
						},
						payment_id: { $ref: '#/components/schemas/payment_id' },
						date: { $ref: '#/components/schemas/date' },
						refund_mode: { $ref: '#/components/schemas/refund_mode' },
						reference_number: { $ref: '#/components/schemas/reference_number' },
						amount: { $ref: '#/components/schemas/amount' },
						exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
						payment_form: { $ref: '#/components/schemas/payment_form' },
						description: { $ref: '#/components/schemas/description' },
					},
				},
			},
		},
	},
	refund_mode: {
		description: 'The method of refund. Max-length [50]',
		type: 'string',
	},
	report_name: { type: 'string' },
	retainerinvoice_id: {
		description:
			'ID of the retainer invoice associated with the payment. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	'retrieve-a-payment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			payment: {
				type: 'object',
				properties: {
					payment_id: { $ref: '#/components/schemas/payment_id' },
					payment_mode: { $ref: '#/components/schemas/payment_mode' },
					amount: { $ref: '#/components/schemas/amount' },
					amount_refunded: { $ref: '#/components/schemas/amount_refunded' },
					bank_charges: { $ref: '#/components/schemas/bank_charges' },
					date: { $ref: '#/components/schemas/date' },
					status: { $ref: '#/components/schemas/status' },
					reference_number: { $ref: '#/components/schemas/reference_number' },
					description: { $ref: '#/components/schemas/description' },
					customer_id: { $ref: '#/components/schemas/customer_id' },
					customer_name: { $ref: '#/components/schemas/customer_name' },
					email: { $ref: '#/components/schemas/email' },
					invoices: {
						description:
							'List of invoices associated with the payment. Each invoice object contains <code>invoice_id</code>, <code>invoice_number</code>, <code>date</code>, <code>invoice_amount</code>, <code>amount_applied</code> and <code>balance_amount</code>.',
						type: 'array',
						items: {
							type: 'object',
							properties: {
								invoice_id: { $ref: '#/components/schemas/invoice_id' },
								invoice_number: { $ref: '#/components/schemas/invoice_number' },
								date: { description: 'Date on which the invoice was raised.' },
								invoice_amount: { $ref: '#/components/schemas/invoice_amount' },
								amount_applied: { $ref: '#/components/schemas/amount_applied' },
								balance_amount: { $ref: '#/components/schemas/balance_amount' },
								tax_amount_withheld: {
									$ref: '#/components/schemas/tax_amount_withheld',
								},
							},
						},
					},
					currency_code: { $ref: '#/components/schemas/currency_code' },
					currency_symbol: { $ref: '#/components/schemas/currency_symbol' },
					location_id: { $ref: '#/components/schemas/location_id' },
					location_name: { $ref: '#/components/schemas/location_name' },
					tags: { $ref: '#/components/schemas/tags_response' },
					custom_fields: {
						description: 'Additional fields for the payments.',
						type: 'array',
						items: {
							type: 'object',
							properties: {
								index: { $ref: '#/components/schemas/index' },
								value: { $ref: '#/components/schemas/value' },
								label: { $ref: '#/components/schemas/label' },
								data_type: { $ref: '#/components/schemas/data_type' },
							},
						},
					},
				},
			},
		},
	},
	sort_column: { type: 'string' },
	sort_order: { type: 'string' },
	status: {
		description:
			'Status of the payment. It can either be <code>success</code> or <code>failure</code>.',
		type: 'string',
	},
	tag_id: {
		description: "Tag's ID. Note: This value is a set of numeric characters.",
		type: 'string',
	},
	tag_name: { description: "Tag's Name", type: 'string' },
	tag_option_id: {
		description:
			"Tag Option's ID. Note: This value is a set of numeric characters.",
		type: 'string',
	},
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
	tax_amount_withheld: {
		description: 'Amount withheld for tax.',
		type: 'number',
		format: 'double',
	},
	'update-a-customerpayment-customfield-request': {
		description: 'Update the custom fields of a customer payment.',
		type: 'object',
		properties: {
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
		},
	},
	'update-a-payment-request': {
		required: [
			'customer_id',
			'payment_mode',
			'amount',
			'invoices',
			'invoice_id',
			'amount_applied',
		],
		type: 'object',
		properties: {
			customer_id: { $ref: '#/components/schemas/customer_id' },
			payment_mode: { $ref: '#/components/schemas/payment_mode' },
			amount: { $ref: '#/components/schemas/amount' },
			date: { $ref: '#/components/schemas/date' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			description: { $ref: '#/components/schemas/description' },
			invoices: {
				description:
					'List of invoices associated with the payment. Each invoice object contains <code>invoice_id</code>, <code>invoice_number</code>, <code>date</code>, <code>invoice_amount</code>, <code>amount_applied</code> and <code>balance_amount</code>.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						invoice_id: { $ref: '#/components/schemas/invoice_id' },
						amount_applied: { $ref: '#/components/schemas/amount_applied' },
						tax_amount_withheld: {
							$ref: '#/components/schemas/tax_amount_withheld',
						},
					},
				},
			},
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			payment_form: { $ref: '#/components/schemas/payment_form' },
			bank_charges: { $ref: '#/components/schemas/bank_charges' },
			custom_fields: {
				description: 'Additional fields for the payments.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						label: { $ref: '#/components/schemas/label' },
						value: { $ref: '#/components/schemas/value' },
					},
				},
			},
			invoice_id: { $ref: '#/components/schemas/invoice_id' },
			amount_applied: { $ref: '#/components/schemas/amount_applied' },
			tax_amount_withheld: { $ref: '#/components/schemas/tax_amount_withheld' },
			location_id: { $ref: '#/components/schemas/location_id' },
			account_id: { $ref: '#/components/schemas/account_id' },
			retainerinvoice_id: { $ref: '#/components/schemas/retainerinvoice_id' },
			tags: { $ref: '#/components/schemas/tags' },
		},
	},
	'update-a-payment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			payment: {
				type: 'object',
				properties: {
					payment_id: { $ref: '#/components/schemas/payment_id' },
					payment_mode: { $ref: '#/components/schemas/payment_mode' },
					amount: { $ref: '#/components/schemas/amount' },
					amount_refunded: { $ref: '#/components/schemas/amount_refunded' },
					bank_charges: { $ref: '#/components/schemas/bank_charges' },
					date: { $ref: '#/components/schemas/date' },
					status: { $ref: '#/components/schemas/status' },
					reference_number: { $ref: '#/components/schemas/reference_number' },
					description: { $ref: '#/components/schemas/description' },
					customer_id: { $ref: '#/components/schemas/customer_id' },
					customer_name: { $ref: '#/components/schemas/customer_name' },
					email: { $ref: '#/components/schemas/email' },
					invoices: {
						description:
							'List of invoices associated with the payment. Each invoice object contains <code>invoice_id</code>, <code>invoice_number</code>, <code>date</code>, <code>invoice_amount</code>, <code>amount_applied</code> and <code>balance_amount</code>.',
						type: 'array',
						items: {
							type: 'object',
							properties: {
								invoice_id: { $ref: '#/components/schemas/invoice_id' },
								invoice_number: { $ref: '#/components/schemas/invoice_number' },
								date: { description: 'Date on which the invoice was raised.' },
								invoice_amount: { $ref: '#/components/schemas/invoice_amount' },
								amount_applied: { $ref: '#/components/schemas/amount_applied' },
								balance_amount: { $ref: '#/components/schemas/balance_amount' },
								tax_amount_withheld: {
									$ref: '#/components/schemas/tax_amount_withheld',
								},
							},
						},
					},
					currency_code: { $ref: '#/components/schemas/currency_code' },
					currency_symbol: { $ref: '#/components/schemas/currency_symbol' },
					location_id: { $ref: '#/components/schemas/location_id' },
					location_name: { $ref: '#/components/schemas/location_name' },
					tags: { $ref: '#/components/schemas/tags_response' },
					custom_fields: {
						description: 'Additional fields for the payments.',
						type: 'array',
						items: {
							type: 'object',
							properties: {
								index: { $ref: '#/components/schemas/index' },
								value: { $ref: '#/components/schemas/value' },
								label: { $ref: '#/components/schemas/label' },
								data_type: { $ref: '#/components/schemas/data_type' },
							},
						},
					},
				},
			},
		},
	},
	'update-a-refund-request': {
		required: ['date', 'amount', 'from_account_id'],
		type: 'object',
		properties: {
			date: { $ref: '#/components/schemas/date' },
			refund_mode: { $ref: '#/components/schemas/refund_mode' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			amount: { $ref: '#/components/schemas/amount' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			payment_form: { $ref: '#/components/schemas/payment_form' },
			description: { $ref: '#/components/schemas/description' },
			from_account_id: { $ref: '#/components/schemas/from_account_id' },
		},
	},
	'update-a-refund-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			payment_refunds: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						payment_refund_id: {
							$ref: '#/components/schemas/payment_refund_id',
						},
						payment_id: { $ref: '#/components/schemas/payment_id' },
						date: { $ref: '#/components/schemas/date' },
						refund_mode: { $ref: '#/components/schemas/refund_mode' },
						reference_number: { $ref: '#/components/schemas/reference_number' },
						amount: { $ref: '#/components/schemas/amount' },
						exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
						payment_form: { $ref: '#/components/schemas/payment_form' },
						description: { $ref: '#/components/schemas/description' },
					},
				},
			},
		},
	},
	'update-an-customerpayment-customfield-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	value: { description: 'Value of the custom field.', type: 'string' },
} as const satisfies Record<string, JsonValue>;

export const operations = [
	{
		id: 'create_customer_payment',
		group: 'customerPayments',
		groupSlug: 'customer-payments',
		name: 'createCustomerPayment',
		method: 'POST',
		path: '/customerpayments',
		summary: 'Create a payment',
		description: 'Create a new payment.',
		docsUrl: 'https://www.zoho.com/books/api/v3/customer-payments/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/create-a-payment-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/create-a-payment-response' },
			},
		],
		scopes: ['ZohoBooks.customerpayments.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_customer_payments',
		group: 'customerPayments',
		groupSlug: 'customer-payments',
		name: 'listCustomerPayments',
		method: 'GET',
		path: '/customerpayments',
		summary: 'List Customer Payments',
		description: 'List all the payments made by your customer.',
		docsUrl: 'https://www.zoho.com/books/api/v3/customer-payments/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'customer_name',
				in: 'query',
				required: false,
				description:
					'Search payments by customer name. Variants: <code>customer_name_startswith</code> and <code>customer_name_contains</code>. Max-len [100]',
				schema: { type: 'string' },
			},
			{
				name: 'reference_number',
				in: 'query',
				required: false,
				description:
					'Search payments by reference number. Variants: <code>reference_number_startswith</code> and <code>reference_number_contains</code>. Max-len [100]',
				schema: { type: 'string' },
			},
			{
				name: 'date',
				in: 'query',
				required: false,
				description: 'Search payments by payment date.',
				schema: { type: 'string' },
			},
			{
				name: 'amount',
				in: 'query',
				required: false,
				description:
					'Search payments by payment amount. Variants: <code>amount_less_than</code>, <code>amount_less_equals</code>, <code>amount_greater_than</code> and <code>amount_greater_equals</code>',
				schema: { type: 'number', format: 'double' },
			},
			{
				name: 'notes',
				in: 'query',
				required: false,
				description:
					'Search payments by customer notes. Variants: <code>notes_startswith</code> and <code>notes_contains</code>',
				schema: { type: 'string' },
			},
			{
				name: 'payment_mode',
				in: 'query',
				required: false,
				description:
					'Search payments by payment mode. Variants: <code>payment_mode_startswith</code> and <code>payment_mode_contains</code>',
				schema: { type: 'string' },
			},
			{
				name: 'filter_by',
				in: 'query',
				required: false,
				description:
					'Filter payments by mode.Allowed Values: <code>PaymentMode.All</code>, <code>PaymentMode.Check</code>, <code>PaymentMode.Cash</code>, <code>PaymentMode.BankTransfer</code>, <code>PaymentMode.Paypal</code>, <code>PaymentMode.CreditCard</code>, <code>PaymentMode.GoogleCheckout</code>, <code>PaymentMode.Credit</code>, <code>PaymentMode.Authorizenet</code>, <code>PaymentMode.BankRemittance</code>, <code>PaymentMode.Payflowpro</code>, <code>PaymentMode.Stripe</code>, <code>PaymentMode.TwoCheckout</code>, <code>PaymentMode.Braintree</code> and <code>PaymentMode.Others</code>',
				schema: { type: 'string' },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description: 'Sort the list of payments by the specified column.',
				schema: { type: 'string' },
			},
			{
				name: 'search_text',
				in: 'query',
				required: false,
				description:
					'Search payments by reference number or customer name or payment description. Max-length [100]',
				schema: { type: 'string' },
			},
			{
				name: 'customer_id',
				in: 'query',
				required: false,
				description:
					'Customer ID of the customer involved in the payment. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'page',
				in: 'query',
				required: false,
				description: 'Page number to be fetched. Default value is 1.',
				schema: { type: 'integer', default: 1 },
			},
			{
				name: 'per_page',
				in: 'query',
				required: false,
				description: 'Number of records to be fetched per page.',
				schema: { type: 'integer', default: 10 },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/list-customer-payments-response',
				},
			},
		],
		scopes: ['ZohoBooks.customerpayments.READ'],
		riskLevel: 'read',
	},
	{
		id: 'bulk_delete_customer_payments',
		group: 'customerPayments',
		groupSlug: 'customer-payments',
		name: 'bulkDeleteCustomerPayments',
		method: 'DELETE',
		path: '/customerpayments',
		summary: 'Bulk delete Customer payments',
		description: 'Delete multiple customer payments.',
		docsUrl: 'https://www.zoho.com/books/api/v3/customer-payments/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'payment_ids',
				in: 'query',
				required: true,
				description:
					'Comma-separated list of payment IDs to be deleted. Note: This value is a set of numeric characters separated by comma.',
				schema: { type: 'string' },
			},
			{
				name: 'bulk_delete',
				in: 'query',
				required: true,
				description: 'Flag to indicate bulk delete operation',
				schema: { type: 'boolean' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/bulk-delete-customer-payments-response',
				},
			},
		],
		scopes: ['ZohoBooks.customerpayments.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'update_customer_payment_using_custom_field',
		group: 'customerPayments',
		groupSlug: 'customer-payments',
		name: 'updateCustomerPaymentUsingCustomField',
		method: 'PUT',
		path: '/customerpayments',
		summary: "Update a payment using a custom field's unique value",
		description:
			"A custom field will have unique values if it's configured to not accept duplicate values. Now, you can use that custom field's value to update a payment by providing its API name in the X-Unique-Identifier-Key header and its value in the X-Unique-Identifier-Value header. Based on this value, the corresponding payment will be retrieved and updated. Additionally, there is an optional X-Upsert header. If the X-Upsert header is true and the custom field's unique value is not found in any of the existing payments, a new payment will be created if the necessary payload details are available",
		docsUrl: 'https://www.zoho.com/books/api/v3/customer-payments/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'X-Unique-Identifier-Key',
				in: 'header',
				required: true,
				description: 'Unique CustomField Api Name',
				schema: { type: 'string' },
			},
			{
				name: 'X-Unique-Identifier-Value',
				in: 'header',
				required: true,
				description: 'Unique CustomField Value',
				schema: { type: 'string' },
			},
			{
				name: 'X-Upsert',
				in: 'header',
				required: false,
				description:
					'If there is no record is found unique custom field value , will create new invoice',
				schema: { type: 'boolean' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/update-a-payment-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-a-payment-response' },
			},
		],
		scopes: ['ZohoBooks.customerpayments.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_customer_payment',
		group: 'customerPayments',
		groupSlug: 'customer-payments',
		name: 'updateCustomerPayment',
		method: 'PUT',
		path: '/customerpayments/{payment_id}',
		summary: 'Update a payment',
		description: 'Update an existing payment information.',
		docsUrl: 'https://www.zoho.com/books/api/v3/customer-payments/',
		parameters: [
			{
				name: 'payment_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the payment. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/update-a-payment-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-a-payment-response' },
			},
		],
		scopes: ['ZohoBooks.customerpayments.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_customer_payment',
		group: 'customerPayments',
		groupSlug: 'customer-payments',
		name: 'getCustomerPayment',
		method: 'GET',
		path: '/customerpayments/{payment_id}',
		summary: 'Retrieve a payment',
		description: 'Details of an existing payment.',
		docsUrl: 'https://www.zoho.com/books/api/v3/customer-payments/',
		parameters: [
			{
				name: 'payment_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the payment. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'accept',
				in: 'query',
				required: false,
				description:
					'Format of the response. Allowed values are <code>json</code> and <code>pdf</code>. Default is <code>json</code>.',
				schema: { type: 'string', enum: ['json', 'pdf'], default: 'json' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/retrieve-a-payment-response' },
			},
		],
		scopes: ['ZohoBooks.customerpayments.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_customer_payment',
		group: 'customerPayments',
		groupSlug: 'customer-payments',
		name: 'deleteCustomerPayment',
		method: 'DELETE',
		path: '/customerpayments/{payment_id}',
		summary: 'Delete a payment',
		description: 'Delete an existing payment.',
		docsUrl: 'https://www.zoho.com/books/api/v3/customer-payments/',
		parameters: [
			{
				name: 'payment_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the payment. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/delete-a-payment-response' },
			},
		],
		scopes: ['ZohoBooks.customerpayments.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'list_customer_payment_refunds',
		group: 'customerPayments',
		groupSlug: 'customer-payments',
		name: 'listCustomerPaymentRefunds',
		method: 'GET',
		path: '/customerpayments/{customer_payment_id}/refunds',
		summary: 'List refunds of a customer payment',
		description:
			'List all the refunds pertaining to an existing customer payment.',
		docsUrl: 'https://www.zoho.com/books/api/v3/customer-payments/',
		parameters: [
			{
				name: 'customer_payment_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the customer payment. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'page',
				in: 'query',
				required: false,
				description: 'Page number to be fetched. Default value is 1.',
				schema: { type: 'integer', default: 1 },
			},
			{
				name: 'per_page',
				in: 'query',
				required: false,
				description: 'Number of records to be fetched per page.',
				schema: { type: 'integer', default: 10 },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/list-refunds-of-a-customer-payment-response',
				},
			},
		],
		scopes: ['ZohoBooks.customerpayments.READ'],
		riskLevel: 'read',
	},
	{
		id: 'create_customer_payment_refund',
		group: 'customerPayments',
		groupSlug: 'customer-payments',
		name: 'createCustomerPaymentRefund',
		method: 'POST',
		path: '/customerpayments/{customer_payment_id}/refunds',
		summary: 'Refund an excess customer payment',
		description: 'Refund the excess amount paid by the customer.',
		docsUrl: 'https://www.zoho.com/books/api/v3/customer-payments/',
		parameters: [
			{
				name: 'customer_payment_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the customer payment. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: {
				$ref: '#/components/schemas/refund-an-excess-customer-payment-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/refund-an-excess-customer-payment-response',
				},
			},
		],
		scopes: ['ZohoBooks.customerpayments.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'update_custom_fields_in_customer_payment',
		group: 'customerPayments',
		groupSlug: 'customer-payments',
		name: 'updateCustomFieldsInCustomerPayment',
		method: 'PUT',
		path: '/customerpayment/{customer_payment_id}/customfields',
		summary: 'Update custom field in existing customerpayments',
		description:
			'Update the value of the custom field in existing customerpayments.',
		docsUrl: 'https://www.zoho.com/books/api/v3/customer-payments/',
		parameters: [
			{
				name: 'customer_payment_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the customer payment. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: {
				$ref: '#/components/schemas/update-a-customerpayment-customfield-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-an-customerpayment-customfield-response',
				},
			},
		],
		scopes: ['ZohoBooks.customerpayments.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_customer_payment_refund',
		group: 'customerPayments',
		groupSlug: 'customer-payments',
		name: 'getCustomerPaymentRefund',
		method: 'GET',
		path: '/customerpayments/{customer_payment_id}/refunds/{refund_id}',
		summary: 'Details of a refund',
		description: 'Obtain details of a particular refund of a customer payment.',
		docsUrl: 'https://www.zoho.com/books/api/v3/customer-payments/',
		parameters: [
			{
				name: 'customer_payment_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the customer payment. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'refund_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the refund. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/details-of-a-refund-response' },
			},
		],
		scopes: ['ZohoBooks.customerpayments.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_customer_payment_refund',
		group: 'customerPayments',
		groupSlug: 'customer-payments',
		name: 'updateCustomerPaymentRefund',
		method: 'PUT',
		path: '/customerpayments/{customer_payment_id}/refunds/{refund_id}',
		summary: 'Update a refund',
		description: 'Update the refunded transaction.',
		docsUrl: 'https://www.zoho.com/books/api/v3/customer-payments/',
		parameters: [
			{
				name: 'customer_payment_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the customer payment. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'refund_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the refund. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/update-a-refund-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-a-refund-response' },
			},
		],
		scopes: ['ZohoBooks.customerpayments.UPDATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'delete_customer_payment_refund',
		group: 'customerPayments',
		groupSlug: 'customer-payments',
		name: 'deleteCustomerPaymentRefund',
		method: 'DELETE',
		path: '/customerpayments/{customer_payment_id}/refunds/{refund_id}',
		summary: 'Delete a Refund',
		description: 'Delete refund pertaining to an existing customer payment.',
		docsUrl: 'https://www.zoho.com/books/api/v3/customer-payments/',
		parameters: [
			{
				name: 'customer_payment_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the customer payment. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'refund_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the refund. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/delete-a-refund-response' },
			},
		],
		scopes: ['ZohoBooks.customerpayments.DELETE'],
		riskLevel: 'destructive',
	},
] as const satisfies readonly ZohoBooksOperationDefinition[];
