import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas = {
	ach_gw_transaction_id: {
		description: 'ID of the ACH Payment Transaction',
		type: 'string',
	},
	ach_payment_status: {
		description: 'Status of the ACH Payment',
		type: 'string',
	},
	amount: {
		description: 'Total Amount of Vendor Payment',
		type: 'number',
		format: 'double',
	},
	amount_applied: {
		description: 'Amount applied to the bill.',
		type: 'number',
		format: 'double',
	},
	amount_in_words: { description: 'Check Amount in Words', type: 'string' },
	balance: {
		description: 'Balance due for the Bill',
		type: 'number',
		format: 'double',
	},
	bcy_amount: { description: 'Amount in Base Currency', type: 'integer' },
	bcy_balance: { description: 'Balance in Base Currency', type: 'integer' },
	bill_id: {
		description: 'ID of the bill the payment is to be applied.',
		type: 'string',
	},
	bill_number: {
		description: 'Number associated with the Bill',
		type: 'string',
	},
	bill_numbers: { description: 'Numbers of the bill', type: 'string' },
	bill_payment_id: { description: 'ID of the Bill Payment', type: 'string' },
	billing_address: { type: 'array', items: { type: 'string' } },
	bills: {
		description: 'Individual bill payment details as array.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				bill_payment_id: { $ref: '#/components/schemas/bill_payment_id' },
				bill_id: { $ref: '#/components/schemas/bill_id' },
				amount_applied: { $ref: '#/components/schemas/amount_applied' },
				tax_amount_withheld: {
					$ref: '#/components/schemas/tax_amount_withheld',
				},
			},
		},
	},
	'bulk-delete-vendor-payments-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	check_details: {
		type: 'array',
		description: 'Details of the check when the payment mode is Check.',
		items: { type: 'string' },
		'x-node_available_in': ['us', 'ca'],
		'x-node_unavailable_in': [],
	},
	check_id: { description: 'ID of the Check Printed', type: 'string' },
	check_number: { description: 'Check Number that is printed', type: 'string' },
	check_status: { description: 'Status of the Check', type: 'string' },
	comments: { description: 'Description of the Comment', type: 'string' },
	'create-a-vendor-payment-request': {
		required: ['amount'],
		type: 'object',
		properties: {
			vendor_id: { $ref: '#/components/schemas/vendor_id' },
			bills: { $ref: '#/components/schemas/bills' },
			date: { $ref: '#/components/schemas/date' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			amount: { $ref: '#/components/schemas/amount' },
			paid_through_account_id: {
				$ref: '#/components/schemas/paid_through_account_id',
			},
			payment_mode: { $ref: '#/components/schemas/payment_mode' },
			description: { $ref: '#/components/schemas/description' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			check_details: { $ref: '#/components/schemas/check_details' },
			is_paid_via_print_check: {
				$ref: '#/components/schemas/is_paid_via_print_check',
			},
			location_id: { $ref: '#/components/schemas/location_id' },
			tags: { $ref: '#/components/schemas/tags' },
			custom_fields: {
				type: 'array',
				description: 'Custom fields associated with the vendor payment.',
				items: {
					type: 'object',
					properties: {
						index: { $ref: '#/components/schemas/index' },
						value: { $ref: '#/components/schemas/value' },
					},
				},
			},
		},
	},
	'create-a-vendor-payment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			ach_payment_status: { $ref: '#/components/schemas/ach_payment_status' },
			amount: { $ref: '#/components/schemas/amount' },
			balance: { $ref: '#/components/schemas/balance' },
			billing_address: { $ref: '#/components/schemas/billing_address' },
			bills: {
				description: 'Individual bill payment details as list.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						bill_payment_id: { $ref: '#/components/schemas/bill_payment_id' },
						bill_id: { $ref: '#/components/schemas/bill_id' },
						amount_applied: { $ref: '#/components/schemas/amount_applied' },
						tax_amount_withheld: {
							$ref: '#/components/schemas/tax_amount_withheld',
						},
						balance: { $ref: '#/components/schemas/balance' },
						bill_number: { $ref: '#/components/schemas/bill_number' },
						date: { $ref: '#/components/schemas/date' },
						due_date: { $ref: '#/components/schemas/due_date' },
						price_precision: { $ref: '#/components/schemas/price_precision' },
						total: { $ref: '#/components/schemas/total' },
					},
				},
			},
			check_details: {
				type: 'object',
				description: 'Details of the check when the payment mode is Check.',
				properties: {
					amount_in_words: { $ref: '#/components/schemas/amount_in_words' },
					check_id: { $ref: '#/components/schemas/check_id' },
					check_number: { $ref: '#/components/schemas/check_number' },
					check_status: { $ref: '#/components/schemas/check_status' },
					memo: { $ref: '#/components/schemas/memo' },
				},
			},
			comments: { $ref: '#/components/schemas/comments' },
			created_time: { $ref: '#/components/schemas/created_time' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			currency_symbol: { $ref: '#/components/schemas/currency_symbol' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			date: { $ref: '#/components/schemas/date' },
			description: { $ref: '#/components/schemas/description' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			imported_transactions: {
				$ref: '#/components/schemas/imported_transactions',
			},
			documents: { $ref: '#/components/schemas/documents' },
			is_ach_payment: { $ref: '#/components/schemas/is_ach_payment' },
			is_paid_via_print_check: {
				$ref: '#/components/schemas/is_paid_via_print_check',
			},
			last_modified_time: { $ref: '#/components/schemas/last_modified_time' },
			paid_through_account_id: {
				$ref: '#/components/schemas/paid_through_account_id',
			},
			paid_through_account_name: {
				$ref: '#/components/schemas/paid_through_account_name',
			},
			paid_through_account_type: {
				$ref: '#/components/schemas/paid_through_account_type',
			},
			payment_id: { $ref: '#/components/schemas/payment_id' },
			payment_mode: { $ref: '#/components/schemas/payment_mode' },
			payment_number: { $ref: '#/components/schemas/payment_number' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			tags: { $ref: '#/components/schemas/tags_response' },
			tax_account_name: { $ref: '#/components/schemas/tax_account_name' },
			tax_amount_withheld: { $ref: '#/components/schemas/tax_amount_withheld' },
			location_id: { $ref: '#/components/schemas/location_id' },
			location_name: { $ref: '#/components/schemas/location_name' },
			vendor_id: { $ref: '#/components/schemas/vendor_id' },
			vendor_name: { $ref: '#/components/schemas/vendor_name' },
			vendorpayment_refunds: {
				$ref: '#/components/schemas/vendorpayment_refunds',
			},
		},
	},
	created_time: {
		description: 'Creation Time of the Vendor Payment',
		type: 'string',
	},
	currency_id: { description: 'ID of the Currency.', type: 'string' },
	currency_symbol: { description: 'Symbol of the Currency', type: 'string' },
	custom_field_id: { description: 'ID of the Custom Field', type: 'string' },
	custom_fields: {
		type: 'array',
		description: 'Custom fields associated with the vendor payment.',
		items: {
			type: 'object',
			properties: {
				custom_field_id: { $ref: '#/components/schemas/custom_field_id' },
				index: { $ref: '#/components/schemas/index' },
				label: { $ref: '#/components/schemas/label' },
				value: { $ref: '#/components/schemas/value' },
			},
		},
	},
	date: { description: 'Date the payment is made.', type: 'string' },
	'delete-a-refund-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-a-vendor-payment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	description: {
		description: 'Description for the Vendor Payment recorded.',
		type: 'string',
	},
	'details-of-a-refund-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			vendorpayment_refund: {
				$ref: '#/components/schemas/vendorpayment_refund',
			},
		},
	},
	documents: { type: 'array', items: { type: 'string' } },
	due_date: { description: 'Due date of the Bill', type: 'string' },
	'email-a-vendor-payment-request': {
		required: ['to_mail_ids', 'subject', 'body'],
		type: 'object',
		properties: {
			send_from_org_email_id: {
				description:
					"Boolean to trigger the email from the organization's email address",
				type: 'boolean',
			},
			from_address_id: { description: 'From email address id', type: 'string' },
			to_mail_ids: {
				description: 'Array of email address of the recipients.',
				type: 'array',
				items: { type: 'string' },
			},
			cc_mail_ids: {
				description: "Array of email address of the recipients to be CC'd.",
				type: 'array',
				items: { type: 'string' },
			},
			subject: { description: 'Subject of the email', type: 'string' },
			body: { description: 'Body of the email', type: 'string' },
			email_template_id: {
				description:
					'Get the email content based on a specific email template. If this param is not inputted, then the content will be based on the email template associated with the vendor. If no template is associated with the vendor, then default template will be used.',
				type: 'string',
			},
		},
	},
	'email-a-vendor-payment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	exchange_rate: {
		description: 'Exchange rate of the currency.',
		type: 'number',
		format: 'double',
	},
	'get-a-vendor-payment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			vendorpayment: {
				type: 'object',
				properties: {
					payment_id: { $ref: '#/components/schemas/payment_id' },
					vendor_id: { $ref: '#/components/schemas/vendor_id' },
					vendor_name: { $ref: '#/components/schemas/vendor_name' },
					payment_mode: { $ref: '#/components/schemas/payment_mode' },
					payment_number: { $ref: '#/components/schemas/payment_number' },
					description: { $ref: '#/components/schemas/description' },
					date: { $ref: '#/components/schemas/date' },
					reference_number: { $ref: '#/components/schemas/reference_number' },
					exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
					tax_account_name: { $ref: '#/components/schemas/tax_account_name' },
					tax_amount_withheld: {
						$ref: '#/components/schemas/tax_amount_withheld',
					},
					amount: { $ref: '#/components/schemas/amount' },
					balance: { $ref: '#/components/schemas/balance' },
					currency_id: { $ref: '#/components/schemas/currency_id' },
					currency_symbol: { $ref: '#/components/schemas/currency_symbol' },
					created_time: { $ref: '#/components/schemas/created_time' },
					last_modified_time: {
						$ref: '#/components/schemas/last_modified_time',
					},
					paid_through_account_id: {
						$ref: '#/components/schemas/paid_through_account_id',
					},
					paid_through_account_name: {
						$ref: '#/components/schemas/paid_through_account_name',
					},
					paid_through_account_type: {
						$ref: '#/components/schemas/paid_through_account_type',
					},
					is_paid_via_print_check: {
						$ref: '#/components/schemas/is_paid_via_print_check',
					},
					is_ach_payment: { $ref: '#/components/schemas/is_ach_payment' },
					ach_payment_status: {
						$ref: '#/components/schemas/ach_payment_status',
					},
					check_details: {
						type: 'object',
						description: 'Details of the check when the payment mode is Check.',
						properties: {
							amount_in_words: { $ref: '#/components/schemas/amount_in_words' },
							check_id: { $ref: '#/components/schemas/check_id' },
							check_number: { $ref: '#/components/schemas/check_number' },
							check_status: { $ref: '#/components/schemas/check_status' },
							memo: { $ref: '#/components/schemas/memo' },
						},
					},
					billing_address: { $ref: '#/components/schemas/billing_address' },
					comments: { $ref: '#/components/schemas/comments' },
					vendorpayment_refunds: {
						$ref: '#/components/schemas/vendorpayment_refunds',
					},
					bills: { $ref: '#/components/schemas/bills' },
					location_id: { $ref: '#/components/schemas/location_id' },
					location_name: { $ref: '#/components/schemas/location_name' },
					documents: { $ref: '#/components/schemas/documents' },
					custom_fields: { $ref: '#/components/schemas/custom_fields' },
					tags: { $ref: '#/components/schemas/tags_response' },
				},
			},
		},
	},
	'get-vendor-payment-email-content-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			body: { description: 'The body of the email', type: 'string' },
			subject: { description: 'Subject of the email', type: 'string' },
			to_contacts: {
				description: 'Recipients of the email',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						first_name: {
							description: 'First name of the contact person',
							type: 'string',
						},
						last_name: {
							description: 'Last name of the contact person',
							type: 'string',
						},
						email: {
							description: 'Email address of the contact person',
							type: 'string',
						},
						phone: {
							description: 'Phone number of the contact person',
							type: 'string',
						},
						mobile: {
							description: 'Mobile number of the contact person',
							type: 'string',
						},
						selected: {
							description: 'Whether this contact is selected as recipient',
							type: 'boolean',
						},
						contact_person_id: {
							description: 'ID of the contact person',
							type: 'string',
						},
						salutation: {
							description: 'Salutation for the contact person',
							type: 'string',
						},
					},
				},
			},
			attachment_name: {
				description: 'Name of the attachment file',
				type: 'string',
			},
			email_template_id: {
				description: 'ID of the email template used',
				type: 'string',
			},
			file_name: { description: 'Name of the file', type: 'string' },
			from_emails: {
				description: 'Sender email addresses available',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						user_name: { description: 'Name of the sender', type: 'string' },
						selected: {
							description: 'Whether this email is selected as sender',
							type: 'boolean',
						},
						email: {
							description: 'Email address of the sender',
							type: 'string',
						},
					},
				},
			},
			gateways_configured: {
				description: 'Whether payment gateways are configured',
				type: 'boolean',
			},
			'deprecated_place\u0068olders_used': {
				description:
					'List of deprecated place\u0068olders used in the template',
				type: 'array',
				items: { type: 'string' },
			},
			error_list: {
				description: 'List of errors if any',
				type: 'array',
				items: { type: 'string' },
			},
		},
	},
	has_attachment: {
		description: 'Check if Vendor Payment has attachment',
		type: 'boolean',
	},
	imported_transactions: { type: 'array', items: { type: 'string' } },
	index: { description: 'Index of the Custom Field', type: 'integer' },
	is_ach_payment: {
		description: 'Check If Vendor Payment ACH',
		type: 'boolean',
	},
	is_paid_via_print_check: {
		description: 'Check if the Bill Payment is paid Via Print Check Option',
		type: 'boolean',
		'x-node_available_in': ['us', 'ca', 'mx'],
		'x-node_unavailable_in': [],
	},
	is_tag_mandatory: {
		description: 'Used to check if the tag is mandatory',
		type: 'boolean',
	},
	label: { description: 'Label of the Custom Field', type: 'string' },
	last_modified_time: {
		description: 'The Last Modified Time of the Vendor Payment',
		type: 'string',
	},
	'list-refunds-of-a-vendor-payment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			vendorpayment_refunds: {
				$ref: '#/components/schemas/vendorpayment_refunds',
			},
		},
	},
	'list-vendor-payments-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			vendorpayments: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						payment_id: { $ref: '#/components/schemas/payment_id' },
						vendor_id: { $ref: '#/components/schemas/vendor_id' },
						vendor_name: { $ref: '#/components/schemas/vendor_name' },
						bill_numbers: { $ref: '#/components/schemas/bill_numbers' },
						payment_mode: { $ref: '#/components/schemas/payment_mode' },
						payment_number: { $ref: '#/components/schemas/payment_number' },
						description: { $ref: '#/components/schemas/description' },
						date: { $ref: '#/components/schemas/date' },
						reference_number: { $ref: '#/components/schemas/reference_number' },
						exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
						amount: { $ref: '#/components/schemas/amount' },
						bcy_amount: { $ref: '#/components/schemas/bcy_amount' },
						paid_through_account_id: {
							$ref: '#/components/schemas/paid_through_account_id',
						},
						paid_through_account_name: {
							$ref: '#/components/schemas/paid_through_account_name',
						},
						balance: { $ref: '#/components/schemas/balance' },
						bcy_balance: { $ref: '#/components/schemas/bcy_balance' },
						created_time: { $ref: '#/components/schemas/created_time' },
						last_modified_time: {
							$ref: '#/components/schemas/last_modified_time',
						},
						is_paid_via_print_check: {
							$ref: '#/components/schemas/is_paid_via_print_check',
						},
						has_attachment: { $ref: '#/components/schemas/has_attachment' },
						is_ach_payment: { $ref: '#/components/schemas/is_ach_payment' },
						ach_payment_status: {
							$ref: '#/components/schemas/ach_payment_status',
						},
						ach_gw_transaction_id: {
							$ref: '#/components/schemas/ach_gw_transaction_id',
						},
						tags: { $ref: '#/components/schemas/tags_response' },
						check_details: {
							type: 'array',
							description:
								'Details of the check when the payment mode is Check.',
							items: {
								type: 'object',
								properties: {
									check_id: { $ref: '#/components/schemas/check_id' },
									check_status: { $ref: '#/components/schemas/check_status' },
									check_number: { $ref: '#/components/schemas/check_number' },
									memo: { $ref: '#/components/schemas/memo' },
								},
							},
						},
					},
				},
			},
		},
	},
	location_id: { description: 'Location ID', type: 'string' },
	location_name: { description: 'Name of the location.', type: 'string' },
	memo: { description: 'Memo of the Check', type: 'string' },
	paid_through_account_id: {
		description: 'ID of the cash/ bank account from which the payment is made.',
		type: 'string',
	},
	paid_through_account_name: {
		description:
			'Name of the Cash/Bank Account through which the Vendor Payment is made.',
		type: 'string',
	},
	paid_through_account_type: {
		description: 'The type of Paid Through Account',
		type: 'string',
	},
	payment_id: { description: 'ID of the Payment', type: 'string' },
	payment_mode: { description: 'Mode of Vendor Payment', type: 'string' },
	payment_number: {
		description: 'Number of the Vendor Payment',
		type: 'integer',
	},
	price_precision: { description: 'Precision of the Amount', type: 'integer' },
	reference_number: {
		description: 'Reference number for the Vendor Payment recorded.',
		type: 'string',
	},
	'refund-an-excess-vendor-payment-request': {
		required: ['date', 'amount', 'to_account_id'],
		type: 'object',
		properties: {
			date: {
				description: 'Date of the Vendor Payment Refund.',
				type: 'string',
			},
			refund_mode: { $ref: '#/components/schemas/refund_mode' },
			reference_number: {
				description: 'Reference Number of the Payment Refund',
				type: 'string',
			},
			amount: { $ref: '#/components/schemas/amount' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			to_account_id: { $ref: '#/components/schemas/to_account_id' },
			description: {
				description: 'Description of the Payment Refund',
				type: 'string',
			},
		},
	},
	'refund-an-excess-vendor-payment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			vendorpayment_refund: {
				$ref: '#/components/schemas/vendorpayment_refund',
			},
		},
	},
	refund_mode: { description: 'Mode in which refund is made.', type: 'string' },
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
	tax_account_name: { description: 'Name of the tax Account', type: 'string' },
	tax_amount_withheld: {
		description: 'Tax Amount Withheld during Bill Payment',
		type: 'number',
		format: 'double',
		'x-node_available_in': ['global', 'in', 'au'],
		'x-node_unavailable_in': [],
	},
	to_account_id: {
		description: 'The account to which payment is refunded.',
		type: 'string',
	},
	to_account_name: { type: 'string' },
	total: {
		description: 'Total Bill Payment Amount',
		type: 'number',
		format: 'double',
	},
	'update-a-refund-request': {
		required: ['date', 'amount', 'to_account_id'],
		type: 'object',
		properties: {
			date: {
				description: 'Date of the Vendor Payment Refund.',
				type: 'string',
			},
			refund_mode: { $ref: '#/components/schemas/refund_mode' },
			reference_number: {
				description: 'Reference Number of the Payment Refund',
				type: 'string',
			},
			amount: { $ref: '#/components/schemas/amount' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			to_account_id: { $ref: '#/components/schemas/to_account_id' },
			description: {
				description: 'Description of the Payment Refund',
				type: 'string',
			},
		},
	},
	'update-a-refund-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			vendorpayment_refund: {
				$ref: '#/components/schemas/vendorpayment_refund',
			},
		},
	},
	'update-a-vendor-payment-request': {
		required: ['amount'],
		type: 'object',
		properties: {
			vendor_id: { $ref: '#/components/schemas/vendor_id' },
			bills: { $ref: '#/components/schemas/bills' },
			date: { $ref: '#/components/schemas/date' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			amount: { $ref: '#/components/schemas/amount' },
			paid_through_account_id: {
				$ref: '#/components/schemas/paid_through_account_id',
			},
			payment_mode: { $ref: '#/components/schemas/payment_mode' },
			description: { $ref: '#/components/schemas/description' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			is_paid_via_print_check: {
				$ref: '#/components/schemas/is_paid_via_print_check',
			},
			check_details: { $ref: '#/components/schemas/check_details' },
			location_id: { $ref: '#/components/schemas/location_id' },
			tags: { $ref: '#/components/schemas/tags' },
			custom_fields: {
				type: 'array',
				description: 'Custom fields associated with the vendor payment.',
				items: {
					type: 'object',
					properties: {
						index: { $ref: '#/components/schemas/index' },
						value: { $ref: '#/components/schemas/value' },
					},
				},
			},
		},
	},
	'update-a-vendor-payment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			vendorpayment: { $ref: '#/components/schemas/vendorpayment' },
		},
	},
	value: { description: 'Value for the Custom Field', type: 'string' },
	vendor_id: {
		description: 'ID of the vendor associated with the Vendor Payment.',
		type: 'string',
	},
	vendor_name: {
		description: 'Name of the Vendor Associated with the Vendor Payment',
		type: 'string',
	},
	vendorpayment: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				payment_id: { $ref: '#/components/schemas/payment_id' },
				vendor_id: { $ref: '#/components/schemas/vendor_id' },
				vendor_name: { $ref: '#/components/schemas/vendor_name' },
				payment_mode: { $ref: '#/components/schemas/payment_mode' },
				payment_number: { $ref: '#/components/schemas/payment_number' },
				custom_fields: { $ref: '#/components/schemas/custom_fields' },
				description: { $ref: '#/components/schemas/description' },
				documents: { $ref: '#/components/schemas/documents' },
				date: { $ref: '#/components/schemas/date' },
				reference_number: { $ref: '#/components/schemas/reference_number' },
				exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
				tax_account_name: { $ref: '#/components/schemas/tax_account_name' },
				tax_amount_withheld: {
					$ref: '#/components/schemas/tax_amount_withheld',
				},
				amount: { $ref: '#/components/schemas/amount' },
				balance: { $ref: '#/components/schemas/balance' },
				currency_id: { $ref: '#/components/schemas/currency_id' },
				currency_symbol: { $ref: '#/components/schemas/currency_symbol' },
				location_id: { $ref: '#/components/schemas/location_id' },
				location_name: { $ref: '#/components/schemas/location_name' },
				created_time: { $ref: '#/components/schemas/created_time' },
				last_modified_time: { $ref: '#/components/schemas/last_modified_time' },
				paid_through_account_id: {
					$ref: '#/components/schemas/paid_through_account_id',
				},
				paid_through_account_name: {
					$ref: '#/components/schemas/paid_through_account_name',
				},
				paid_through_account_type: {
					$ref: '#/components/schemas/paid_through_account_type',
				},
				is_paid_via_print_check: {
					$ref: '#/components/schemas/is_paid_via_print_check',
				},
				is_ach_payment: { $ref: '#/components/schemas/is_ach_payment' },
				ach_payment_status: { $ref: '#/components/schemas/ach_payment_status' },
				check_details: { $ref: '#/components/schemas/check_details' },
				billing_address: { $ref: '#/components/schemas/billing_address' },
				bills: { $ref: '#/components/schemas/bills' },
				vendorpayment_refunds: {
					$ref: '#/components/schemas/vendorpayment_refunds',
				},
				imported_transactions: {
					$ref: '#/components/schemas/imported_transactions',
				},
				tags: { $ref: '#/components/schemas/tags_response' },
			},
		},
	},
	vendorpayment_id: { type: 'string' },
	vendorpayment_refund: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				vendorpayment_refund_id: {
					$ref: '#/components/schemas/vendorpayment_refund_id',
				},
				vendorpayment_id: { $ref: '#/components/schemas/vendorpayment_id' },
				date: { $ref: '#/components/schemas/date' },
				refund_mode: { $ref: '#/components/schemas/refund_mode' },
				reference_number: { $ref: '#/components/schemas/reference_number' },
				amount: { $ref: '#/components/schemas/amount' },
				exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
				to_account_id: { $ref: '#/components/schemas/to_account_id' },
				to_account_name: { $ref: '#/components/schemas/to_account_name' },
				description: { $ref: '#/components/schemas/description' },
			},
		},
	},
	vendorpayment_refund_id: {
		description: 'ID of the Vendor Payment Refund',
		type: 'string',
	},
	vendorpayment_refunds: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				vendorpayment_refund_id: {
					$ref: '#/components/schemas/vendorpayment_refund_id',
				},
				date: {
					description: 'Date of the Vendor Payment Refund.',
					type: 'string',
				},
				refund_mode: { $ref: '#/components/schemas/refund_mode' },
				reference_number: {
					description: 'Reference Number of the Payment Refund',
					type: 'string',
				},
				description: {
					description: 'Description of the Payment Refund',
					type: 'string',
				},
				amount_bcy: {
					description: 'Payment Refund Amount in Base Currency',
					type: 'number',
					format: 'double',
				},
				amount_fcy: {
					description: 'Payment Refund Amount in Foreign Currency',
					type: 'number',
					format: 'double',
				},
			},
		},
	},
} as const satisfies Record<string, JsonValue>;

export const operations = [
	{
		id: 'create_vendor_payment',
		group: 'vendorPayments',
		groupSlug: 'vendor-payments',
		name: 'createVendorPayment',
		method: 'POST',
		path: '/vendorpayments',
		summary: 'Create a vendor payment',
		description:
			'Create a payment made to your vendor and you can also apply them to bills either partially or fully.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-payments/',
		parameters: [
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
			schema: { $ref: '#/components/schemas/create-a-vendor-payment-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/create-a-vendor-payment-response',
				},
			},
		],
		scopes: ['ZohoBooks.vendorpayments.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'list_vendor_payments',
		group: 'vendorPayments',
		groupSlug: 'vendor-payments',
		name: 'listVendorPayments',
		method: 'GET',
		path: '/vendorpayments',
		summary: 'List vendor payments',
		description: 'List all the payments made to your vendor.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-payments/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'vendor_name',
				in: 'query',
				required: false,
				description:
					'Search payments by vendor name. Variants: <code>vendor_name_startswith</code> and <code>vendor_name_contains</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'reference_number',
				in: 'query',
				required: false,
				description:
					'Search payments by reference number. Variants: <code>reference_number_startswith</code> and <code>reference_number_contains</code>. In refunds, reference number for the refund recorded.',
				schema: { type: 'string' },
			},
			{
				name: 'payment_number',
				in: 'query',
				required: false,
				description:
					'Search with Payment Number. Variant: <code>payment_number_startswith</code>, <code>payment_number_contains</code>',
				schema: { type: 'string' },
			},
			{
				name: 'date',
				in: 'query',
				required: false,
				description:
					'Date the payment is made. Search payments by payment made date. Variants: <code>date_start</code>, <code>date_end</code>, <code>date_before</code> and <code>date_after</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'amount',
				in: 'query',
				required: false,
				description:
					'Payment amount made to the vendor. Search payments by payment amount. Variants: <code>amount_less_than</code>, <code>amount_less_equals</code>, <code>amount_greater_than</code> and <code>amount_greater_equals</code>. In refunds, Amount refunded from the vendor payment.',
				schema: { type: 'number', format: 'double' },
			},
			{
				name: 'payment_mode',
				in: 'query',
				required: false,
				description:
					'Search payments by payment mode. Variants: <code>payment_mode_startswith</code> and <code>payment_mode_contains</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'notes',
				in: 'query',
				required: false,
				description:
					'Search with Payment Notes. Variant: <code>notes_startswith</code>, <code>notes_contains</code>',
				schema: { type: 'string' },
			},
			{
				name: 'vendor_id',
				in: 'query',
				required: false,
				description: 'ID of the vendor. Search payments by vendor id.',
				schema: { type: 'string' },
			},
			{
				name: 'last_modified_time',
				in: 'query',
				required: false,
				description: 'Search with the Last Modified Time of the Vendor Payment',
				schema: { type: 'string' },
			},
			{
				name: 'bill_id',
				in: 'query',
				required: false,
				description: 'Search payments by Bill ID.',
				schema: { type: 'string' },
			},
			{
				name: 'description',
				in: 'query',
				required: false,
				description:
					'Search payments by description. Variants: <code>description_startswith</code> and <code>description_contains</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'filter_by',
				in: 'query',
				required: false,
				description:
					'Filter payments by mode. Allowed Values: <code>PaymentMode.All</code>, <code>PaymentMode.Check</code>, <code>PaymentMode.Cash</code>, <code>PaymentMode.BankTransfer</code>, <code>PaymentMode.Paypal</code>, <code>PaymentMode.CreditCard</code>, <code>PaymentMode.GoogleCheckout</code>, <code>PaymentMode.Credit</code>, <code>PaymentMode.Authorizenet</code>, <code>PaymentMode.BankRemittance</code>, <code>PaymentMode.Payflowpro</code> and <code>PaymentMode.Others</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'search_text',
				in: 'query',
				required: false,
				description:
					'Search payments by reference number or vendor name or payment description.',
				schema: { type: 'string' },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description:
					'Sort the payment list. Allowed Values: <code>vendor_name</code>, <code>date</code>, <code>reference_number</code>, <code>amount</code> and <code>balance</code>.',
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
				schema: { $ref: '#/components/schemas/list-vendor-payments-response' },
			},
		],
		scopes: ['ZohoBooks.vendorpayments.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_vendor_payment_using_custom_field',
		group: 'vendorPayments',
		groupSlug: 'vendor-payments',
		name: 'updateVendorPaymentUsingCustomField',
		method: 'PUT',
		path: '/vendorpayments',
		summary: "Update an vendor payment using a custom field's unique value",
		description:
			"A custom field will have unique values if it's configured to not accept duplicate values. Now, you can use that custom field's value to update a vendor payment by providing its API name in the X-Unique-Identifier-Key header and its value in the X-Unique-Identifier-Value header. Based on this value, the corresponding vendor payment will be retrieved and updated. Additionally, there is an optional X-Upsert header. If the X-Upsert header is true and the custom field's unique value is not found in any of the existing vendor payments, a new vendor payment will be created if the necessary payload details are available",
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-payments/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
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
			schema: { $ref: '#/components/schemas/update-a-vendor-payment-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-a-vendor-payment-response',
				},
			},
		],
		scopes: ['ZohoBooks.vendorpayments.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'bulk_delete_vendor_payments',
		group: 'vendorPayments',
		groupSlug: 'vendor-payments',
		name: 'bulkDeleteVendorPayments',
		method: 'DELETE',
		path: '/vendorpayments',
		summary: 'Bulk delete vendor payments',
		description: 'Delete multiple vendor payments.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-payments/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'vendorpayment_id',
				in: 'query',
				required: true,
				description: 'Comma-separated list of vendor payment IDs to be deleted',
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
					$ref: '#/components/schemas/bulk-delete-vendor-payments-response',
				},
			},
		],
		scopes: ['ZohoBooks.vendorpayments.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'update_vendor_payment',
		group: 'vendorPayments',
		groupSlug: 'vendor-payments',
		name: 'updateVendorPayment',
		method: 'PUT',
		path: '/vendorpayments/{payment_id}',
		summary: 'Update a vendor payment',
		description:
			'Update an existing vendor payment. You can also modify the amount applied to the bills.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-payments/',
		parameters: [
			{
				name: 'payment_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the payment.',
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
			schema: { $ref: '#/components/schemas/update-a-vendor-payment-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-a-vendor-payment-response',
				},
			},
		],
		scopes: ['ZohoBooks.vendorpayments.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_vendor_payment',
		group: 'vendorPayments',
		groupSlug: 'vendor-payments',
		name: 'getVendorPayment',
		method: 'GET',
		path: '/vendorpayments/{payment_id}',
		summary: 'Get a vendor payment',
		description: 'Get the details of a vendor payment.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-payments/',
		parameters: [
			{
				name: 'payment_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the payment.',
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
				name: 'fetchTaxInfo',
				in: 'query',
				required: false,
				description: 'Check if tax information should be fetched',
				schema: { type: 'boolean' },
			},
			{
				name: 'fetchstatementlineinfo',
				in: 'query',
				required: false,
				description:
					'Check is Statement Line Information for Vendor Payment be fetched',
				schema: { type: 'boolean' },
			},
			{
				name: 'print',
				in: 'query',
				required: false,
				description: 'Check if Vendor Payment must be printed.',
				schema: { type: 'boolean' },
			},
			{
				name: 'is_bill_payment_id',
				in: 'query',
				required: false,
				description: 'Check if the ID is Bill Payment or Vendor Payment',
				schema: { type: 'boolean' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/get-a-vendor-payment-response' },
			},
		],
		scopes: ['ZohoBooks.vendorpayments.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_vendor_payment',
		group: 'vendorPayments',
		groupSlug: 'vendor-payments',
		name: 'deleteVendorPayment',
		method: 'DELETE',
		path: '/vendorpayments/{payment_id}',
		summary: 'Delete a vendor payment',
		description: 'Delete an existing vendor payment.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-payments/',
		parameters: [
			{
				name: 'payment_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the payment.',
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
					$ref: '#/components/schemas/delete-a-vendor-payment-response',
				},
			},
		],
		scopes: ['ZohoBooks.vendorpayments.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'list_vendor_payment_refunds',
		group: 'vendorPayments',
		groupSlug: 'vendor-payments',
		name: 'listVendorPaymentRefunds',
		method: 'GET',
		path: '/vendorpayments/{payment_id}/refunds',
		summary: 'List refunds of a vendor payment',
		description:
			'List all the refunds pertaining to an existing vendor payment.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-payments/',
		parameters: [
			{
				name: 'payment_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the payment.',
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
					$ref: '#/components/schemas/list-refunds-of-a-vendor-payment-response',
				},
			},
		],
		scopes: ['ZohoBooks.vendorpayments.READ'],
		riskLevel: 'read',
	},
	{
		id: 'refund_excess_vendor_payment',
		group: 'vendorPayments',
		groupSlug: 'vendor-payments',
		name: 'refundExcessVendorPayment',
		method: 'POST',
		path: '/vendorpayments/{payment_id}/refunds',
		summary: 'Refund an excess vendor payment',
		description: 'Refund the excess amount paid to the vendor.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-payments/',
		parameters: [
			{
				name: 'payment_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the payment.',
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
			schema: {
				$ref: '#/components/schemas/refund-an-excess-vendor-payment-request',
			},
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/refund-an-excess-vendor-payment-response',
				},
			},
		],
		scopes: ['ZohoBooks.vendorpayments.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_vendor_payment_refund',
		group: 'vendorPayments',
		groupSlug: 'vendor-payments',
		name: 'getVendorPaymentRefund',
		method: 'GET',
		path: '/vendorpayments/{payment_id}/refunds/{vendorpayment_refund_id}',
		summary: 'Details of a refund',
		description: 'Obtain details of a particular refund of a vendor payment.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-payments/',
		parameters: [
			{
				name: 'payment_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the payment.',
				schema: { type: 'string' },
			},
			{
				name: 'vendorpayment_refund_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the vendor payment refund.',
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
				schema: { $ref: '#/components/schemas/details-of-a-refund-response' },
			},
		],
		scopes: ['ZohoBooks.vendorpayments.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_vendor_payment_refund',
		group: 'vendorPayments',
		groupSlug: 'vendor-payments',
		name: 'updateVendorPaymentRefund',
		method: 'PUT',
		path: '/vendorpayments/{payment_id}/refunds/{vendorpayment_refund_id}',
		summary: 'Update a refund',
		description: 'Update the refunded transaction.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-payments/',
		parameters: [
			{
				name: 'payment_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the payment.',
				schema: { type: 'string' },
			},
			{
				name: 'vendorpayment_refund_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the vendor payment refund.',
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
			schema: { $ref: '#/components/schemas/update-a-refund-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-a-refund-response' },
			},
		],
		scopes: ['ZohoBooks.vendorpayments.UPDATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'delete_vendor_payment_refund',
		group: 'vendorPayments',
		groupSlug: 'vendor-payments',
		name: 'deleteVendorPaymentRefund',
		method: 'DELETE',
		path: '/vendorpayments/{payment_id}/refunds/{vendorpayment_refund_id}',
		summary: 'Delete a refund',
		description: 'Delete refund pertaining to an existing vendor payment.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-payments/',
		parameters: [
			{
				name: 'payment_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the payment.',
				schema: { type: 'string' },
			},
			{
				name: 'vendorpayment_refund_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the vendor payment refund.',
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
				schema: { $ref: '#/components/schemas/delete-a-refund-response' },
			},
		],
		scopes: ['ZohoBooks.vendorpayments.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'email_vendor_payment',
		group: 'vendorPayments',
		groupSlug: 'vendor-payments',
		name: 'emailVendorPayment',
		method: 'POST',
		path: '/vendorpayments/{payment_id}/email',
		summary: 'Email a vendor payment',
		description:
			'Send a vendor payment receipt to the vendor via email. You can customize the email content, attach files, and control sender preferences. If the request body is empty, the email will be sent with default content based on the email template associated with the vendor or the default template.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-payments/',
		parameters: [
			{
				name: 'payment_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the payment.',
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
				name: 'send_attachment',
				in: 'query',
				required: false,
				description: 'Send the vendor payment attachment with the email.',
				schema: { type: 'boolean' },
			},
			{
				name: 'attachments',
				in: 'query',
				required: false,
				description: 'Files to be attached to the email',
				schema: { type: 'string', format: 'binary' },
			},
			{
				name: 'file_name',
				in: 'query',
				required: false,
				description: 'Name of the file to be attached',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/email-a-vendor-payment-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/email-a-vendor-payment-response',
				},
			},
		],
		scopes: ['ZohoBooks.vendorpayments.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_vendor_payment_email_content',
		group: 'vendorPayments',
		groupSlug: 'vendor-payments',
		name: 'getVendorPaymentEmailContent',
		method: 'GET',
		path: '/vendorpayments/{payment_id}/email',
		summary: 'Get vendor payment email content',
		description:
			'Retrieve the pre-populated email content for a vendor payment, including subject, body, recipient contacts, sender options, and attachment details. This endpoint provides all the necessary information to compose and send a vendor payment receipt email.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-payments/',
		parameters: [
			{
				name: 'payment_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the payment.',
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
					$ref: '#/components/schemas/get-vendor-payment-email-content-response',
				},
			},
		],
		scopes: ['ZohoBooks.vendorpayments.READ'],
		riskLevel: 'read',
	},
] as const satisfies readonly ZohoBooksOperationDefinition[];
