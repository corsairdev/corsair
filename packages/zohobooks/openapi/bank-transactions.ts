import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas = {
	account_id: {
		description:
			'Mandatory Account id for which transactions are to be listed.',
		type: 'string',
	},
	account_name: { description: 'Name of the Account', type: 'string' },
	account_type: { description: 'Type of the Account', type: 'string' },
	acquisition_vat_amount: {
		description: 'Amount of the VAT Acquistion',
		type: 'string',
		'x-node_available_in': ['uk', 'eu'],
		'x-node_unavailable_in': [],
	},
	acquisition_vat_id: {
		description:
			'(Optional) This is the ID of the tax applied in case this is an EU - goods purchase or expense and acquisition VAT needs to be reported.',
		type: 'string',
		'x-node_available_in': ['uk', 'eu'],
		'x-node_unavailable_in': [],
	},
	acquisition_vat_name: {
		description: 'Name of the VAT Acquistion',
		type: 'string',
		'x-node_available_in': ['uk', 'eu'],
		'x-node_unavailable_in': [],
	},
	acquisition_vat_percentage: {
		description: 'Percentage of the VAT Acquistion',
		type: 'string',
		'x-node_available_in': ['uk', 'eu'],
		'x-node_unavailable_in': [],
	},
	amount: {
		description: 'Amount of the transaction',
		type: 'number',
		format: 'double',
	},
	amount_applied: {
		description: 'Amount applied to the Entity',
		type: 'number',
		format: 'double',
	},
	bank_charges: {
		description: 'Bank Charges applied to the transaction',
		type: 'number',
		format: 'double',
	},
	banktransaction: {
		type: 'object',
		properties: {
			transaction_id: { $ref: '#/components/schemas/transaction_id' },
			from_account_id: { $ref: '#/components/schemas/from_account_id' },
			from_account_name: { $ref: '#/components/schemas/from_account_name' },
			to_account_id: { $ref: '#/components/schemas/to_account_id' },
			to_account_name: { $ref: '#/components/schemas/to_account_name' },
			transaction_type: { $ref: '#/components/schemas/transaction_type' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			currency_code: { $ref: '#/components/schemas/currency_code' },
			payment_mode: { $ref: '#/components/schemas/payment_mode' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			date: { $ref: '#/components/schemas/date' },
			customer_id: { $ref: '#/components/schemas/customer_id' },
			customer_name: { $ref: '#/components/schemas/customer_name' },
			vendor_id: { $ref: '#/components/schemas/vendor_id' },
			vendor_name: { $ref: '#/components/schemas/vendor_name' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			description: { $ref: '#/components/schemas/description' },
			bank_charges: { $ref: '#/components/schemas/bank_charges' },
			tax_id: { $ref: '#/components/schemas/tax_id' },
			documents: { $ref: '#/components/schemas/documents' },
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			tax_name: { $ref: '#/components/schemas/tax_name' },
			tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
			tax_amount: { $ref: '#/components/schemas/tax_amount' },
			sub_total: { $ref: '#/components/schemas/sub_total' },
			tax_authority_id: { $ref: '#/components/schemas/tax_authority_id' },
			tax_authority_name: { $ref: '#/components/schemas/tax_authority_name' },
			tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
			tax_exemption_code: { $ref: '#/components/schemas/tax_exemption_code' },
			total: { $ref: '#/components/schemas/total' },
			bcy_total: { $ref: '#/components/schemas/bcy_total' },
			amount: { $ref: '#/components/schemas/amount' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			product_type: { $ref: '#/components/schemas/product_type' },
			acquisition_vat_id: { $ref: '#/components/schemas/acquisition_vat_id' },
			acquisition_vat_name: {
				$ref: '#/components/schemas/acquisition_vat_name',
			},
			acquisition_vat_percentage: {
				$ref: '#/components/schemas/acquisition_vat_percentage',
			},
			acquisition_vat_amount: {
				$ref: '#/components/schemas/acquisition_vat_amount',
			},
			reverse_charge_vat_id: {
				$ref: '#/components/schemas/reverse_charge_vat_id',
			},
			reverse_charge_vat_name: {
				$ref: '#/components/schemas/reverse_charge_vat_name',
			},
			reverse_charge_vat_percentage: {
				$ref: '#/components/schemas/reverse_charge_vat_percentage',
			},
			reverse_charge_vat_amount: {
				$ref: '#/components/schemas/reverse_charge_vat_amount',
			},
			reverse_charge_tax_id: {
				$ref: '#/components/schemas/reverse_charge_tax_id',
			},
			filed_in_vat_return_id: {
				$ref: '#/components/schemas/filed_in_vat_return_id',
			},
			filed_in_vat_return_name: {
				$ref: '#/components/schemas/filed_in_vat_return_name',
			},
			filed_in_vat_return_type: {
				$ref: '#/components/schemas/filed_in_vat_return_type',
			},
			imported_transactions: {
				$ref: '#/components/schemas/imported_transactions',
			},
			tags: { $ref: '#/components/schemas/tags_response' },
			line_items: { $ref: '#/components/schemas/line_items' },
		},
	},
	bcy_total: {
		description: 'Total in Base Currency of the Organisation',
		type: 'integer',
	},
	bill_id: { description: 'ID of the Bill', type: 'string' },
	bill_payment_id: { description: 'ID of the Bill Payment', type: 'string' },
	bills: {
		description: 'List of bills associated with the vendor payment.',
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
	can_reclaim_vat_on_mileage: {
		description: 'Check if VAT can be reclaimed on mileage',
		type: 'boolean',
		'x-node_available_in': ['uk', 'eu'],
		'x-node_unavailable_in': [],
	},
	'categorize-a-vendor-payment-request': {
		type: 'object',
		properties: {
			vendor_id: { $ref: '#/components/schemas/vendor_id' },
			bills: { $ref: '#/components/schemas/bills' },
			payment_mode: { $ref: '#/components/schemas/payment_mode' },
			description: { $ref: '#/components/schemas/description' },
			date: { $ref: '#/components/schemas/date' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			paid_through_account_id: {
				$ref: '#/components/schemas/paid_through_account_id',
			},
			amount: { $ref: '#/components/schemas/amount' },
			custom_fields: {
				type: 'array',
				description: 'List of custom fields associated with the transaction.',
				items: {
					type: 'object',
					properties: {
						index: { $ref: '#/components/schemas/index' },
						value: { $ref: '#/components/schemas/value' },
					},
				},
			},
			is_paid_via_print_check: {
				$ref: '#/components/schemas/is_paid_via_print_check',
			},
			check_details: { $ref: '#/components/schemas/check_details' },
		},
	},
	'categorize-a-vendor-payment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'categorize-an-uncategorized-transaction-request': {
		required: ['transaction_type'],
		type: 'object',
		properties: {
			from_account_id: { $ref: '#/components/schemas/from_account_id' },
			to_account_id: { $ref: '#/components/schemas/to_account_id' },
			transaction_type: { $ref: '#/components/schemas/transaction_type' },
			amount: { $ref: '#/components/schemas/amount' },
			date: { $ref: '#/components/schemas/date' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			payment_mode: { $ref: '#/components/schemas/payment_mode' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			description: { $ref: '#/components/schemas/description' },
			customer_id: { $ref: '#/components/schemas/customer_id' },
			tags: { $ref: '#/components/schemas/tags' },
			documents: { $ref: '#/components/schemas/documents' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			tax_id: { $ref: '#/components/schemas/tax_id' },
			to_account_tags: { $ref: '#/components/schemas/tags' },
			from_account_tags: { $ref: '#/components/schemas/tags' },
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			bank_charges: { $ref: '#/components/schemas/bank_charges' },
			user_id: { $ref: '#/components/schemas/user_id' },
			tax_authority_id: { $ref: '#/components/schemas/tax_authority_id' },
			tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			line_items: {
				type: 'array',
				description:
					'List of expense line items associated with the transaction.',
				items: {
					type: 'object',
					properties: {
						line_id: { $ref: '#/components/schemas/line_id' },
						account_id: { $ref: '#/components/schemas/account_id' },
						account_name: { $ref: '#/components/schemas/account_name' },
						description: { $ref: '#/components/schemas/description' },
						tax_amount: { $ref: '#/components/schemas/tax_amount' },
						tax_id: { $ref: '#/components/schemas/tax_id' },
						tax_name: { $ref: '#/components/schemas/tax_name' },
						tax_type: { $ref: '#/components/schemas/tax_type' },
						tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
						item_total: { $ref: '#/components/schemas/item_total' },
						item_total_inclusive_of_tax: {
							$ref: '#/components/schemas/item_total_inclusive_of_tax',
						},
						item_order: { $ref: '#/components/schemas/item_order' },
						tags: { $ref: '#/components/schemas/tags' },
					},
				},
			},
		},
	},
	'categorize-an-uncategorized-transaction-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'categorize-as-credit-note-refunds-request': {
		required: ['creditnote_id', 'date'],
		type: 'object',
		properties: {
			creditnote_id: { $ref: '#/components/schemas/creditnote_id' },
			date: { $ref: '#/components/schemas/date' },
			refund_mode: { $ref: '#/components/schemas/refund_mode' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			amount: { $ref: '#/components/schemas/amount' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			from_account_id: { $ref: '#/components/schemas/from_account_id' },
			description: { $ref: '#/components/schemas/description' },
		},
	},
	'categorize-as-credit-note-refunds-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'categorize-as-customer-payment-refund-request': {
		required: ['date', 'amount', 'from_account_id'],
		type: 'object',
		properties: {
			date: { $ref: '#/components/schemas/date' },
			refund_mode: { $ref: '#/components/schemas/refund_mode' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			amount: { $ref: '#/components/schemas/amount' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			from_account_id: { $ref: '#/components/schemas/from_account_id' },
			description: { $ref: '#/components/schemas/description' },
		},
	},
	'categorize-as-customer-payment-refund-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'categorize-as-customer-payment-request': {
		type: 'object',
		properties: {
			customer_id: { $ref: '#/components/schemas/customer_id' },
			retainerinvoice_id: { $ref: '#/components/schemas/retainerinvoice_id' },
			invoices: { $ref: '#/components/schemas/invoices' },
			payment_mode: { $ref: '#/components/schemas/payment_mode' },
			description: { $ref: '#/components/schemas/description' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			amount: { $ref: '#/components/schemas/amount' },
			bank_charges: { $ref: '#/components/schemas/bank_charges' },
			account_id: { $ref: '#/components/schemas/account_id' },
			custom_fields: {
				type: 'array',
				description: 'List of custom fields associated with the transaction.',
				items: {
					type: 'object',
					properties: {
						index: { $ref: '#/components/schemas/index' },
						value: { $ref: '#/components/schemas/value' },
					},
				},
			},
			documents: { $ref: '#/components/schemas/documents' },
			date: { $ref: '#/components/schemas/date' },
			template_id: { $ref: '#/components/schemas/template_id' },
			contact_persons: { $ref: '#/components/schemas/contact_persons' },
		},
	},
	'categorize-as-customer-payment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'categorize-as-expense-request': {
		type: 'object',
		properties: {
			account_id: { $ref: '#/components/schemas/account_id' },
			paid_through_account_id: {
				$ref: '#/components/schemas/paid_through_account_id',
			},
			date: { $ref: '#/components/schemas/date' },
			tax_id: { $ref: '#/components/schemas/tax_id' },
			amount: { $ref: '#/components/schemas/amount' },
			project_id: { $ref: '#/components/schemas/project_id' },
			tax_exemption_code: { $ref: '#/components/schemas/tax_exemption_code' },
			tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			is_billable: { $ref: '#/components/schemas/is_billable' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			description: { $ref: '#/components/schemas/description' },
			customer_id: { $ref: '#/components/schemas/customer_id' },
			zp_project_id: { $ref: '#/components/schemas/zp_project_id' },
			zp_project_name: { $ref: '#/components/schemas/zp_project_name' },
			zp_client_id: { $ref: '#/components/schemas/zp_client_id' },
			vendor_id: { $ref: '#/components/schemas/vendor_id' },
			vehicle_id: { $ref: '#/components/schemas/vehicle_id' },
			mileage_unit: { $ref: '#/components/schemas/mileage_unit' },
			mileage_rate: { $ref: '#/components/schemas/mileage_rate' },
			can_reclaim_vat_on_mileage: {
				$ref: '#/components/schemas/can_reclaim_vat_on_mileage',
			},
			fuel_type: { $ref: '#/components/schemas/fuel_type' },
			engine_capacity_range: {
				$ref: '#/components/schemas/engine_capacity_range',
			},
			employee_id: { $ref: '#/components/schemas/employee_id' },
			mileage_type: { $ref: '#/components/schemas/mileage_type' },
			expense_type: { $ref: '#/components/schemas/expense_type' },
			distance: { $ref: '#/components/schemas/distance' },
			start_reading: { $ref: '#/components/schemas/start_reading' },
			end_reading: { $ref: '#/components/schemas/end_reading' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			custom_fields: {
				type: 'array',
				description: 'List of custom fields associated with the transaction.',
				items: {
					type: 'object',
					properties: {
						index: { $ref: '#/components/schemas/index' },
						value: { $ref: '#/components/schemas/value' },
					},
				},
			},
			tags: { $ref: '#/components/schemas/tags' },
			documents: { $ref: '#/components/schemas/documents' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			recurring_expense_id: {
				$ref: '#/components/schemas/recurring_expense_id',
			},
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			acquisition_vat_id: { $ref: '#/components/schemas/acquisition_vat_id' },
			reverse_charge_vat_id: {
				$ref: '#/components/schemas/reverse_charge_vat_id',
			},
			is_update_customer: { $ref: '#/components/schemas/is_update_customer' },
			product_type: { $ref: '#/components/schemas/product_type' },
			taxes: { $ref: '#/components/schemas/taxes' },
			reason: { $ref: '#/components/schemas/reason' },
			line_items: {
				type: 'array',
				description:
					'List of expense line items associated with the transaction.',
				items: {
					type: 'object',
					properties: {
						line_item_id: { $ref: '#/components/schemas/line_item_id' },
						account_id: { $ref: '#/components/schemas/account_id' },
						description: { $ref: '#/components/schemas/description' },
						amount: { $ref: '#/components/schemas/amount' },
						tax_id: { $ref: '#/components/schemas/tax_id' },
						item_order: { $ref: '#/components/schemas/item_order' },
						product_type: { $ref: '#/components/schemas/product_type' },
						acquisition_vat_id: {
							$ref: '#/components/schemas/acquisition_vat_id',
						},
						reverse_charge_vat_id: {
							$ref: '#/components/schemas/reverse_charge_vat_id',
						},
						tax_exemption_code: {
							$ref: '#/components/schemas/tax_exemption_code',
						},
						tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
						tags: { $ref: '#/components/schemas/tags' },
					},
				},
			},
			zcrm_potential_id: { $ref: '#/components/schemas/zcrm_potential_id' },
		},
	},
	'categorize-as-expense-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'categorize-as-vendor-credit-refunds-request': {
		required: ['vendor_credit_id', 'date'],
		type: 'object',
		properties: {
			vendor_credit_id: { $ref: '#/components/schemas/vendor_credit_id' },
			date: { $ref: '#/components/schemas/date' },
			refund_mode: { $ref: '#/components/schemas/refund_mode' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			amount: { $ref: '#/components/schemas/amount' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			account_id: { $ref: '#/components/schemas/account_id' },
			description: { $ref: '#/components/schemas/description' },
		},
	},
	'categorize-as-vendor-credit-refunds-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'categorize-as-vendor-payment-refund-request': {
		required: ['date', 'amount', 'to_account_id'],
		type: 'object',
		properties: {
			vendorpayment_id: { $ref: '#/components/schemas/vendorpayment_id' },
			date: { $ref: '#/components/schemas/date' },
			refund_mode: { $ref: '#/components/schemas/refund_mode' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			amount: { $ref: '#/components/schemas/amount' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			to_account_id: { $ref: '#/components/schemas/to_account_id' },
			description: { $ref: '#/components/schemas/description' },
		},
	},
	'categorize-as-vendor-payment-refund-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	check_details: {
		description: 'List of check details associated with the payment.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				memo: { $ref: '#/components/schemas/memo' },
				check_number: { $ref: '#/components/schemas/check_number' },
			},
		},
	},
	check_number: { description: 'Number of the Check Created', type: 'string' },
	contact_name: { description: 'Name of the Contact', type: 'string' },
	contact_persons: {
		description: 'Array of contact person(s) for whom invoice has to be sent.',
		type: 'array',
		items: { type: 'string' },
	},
	'create-a-transaction-for-an-account-request': {
		required: ['transaction_type'],
		type: 'object',
		properties: {
			from_account_id: { $ref: '#/components/schemas/from_account_id' },
			to_account_id: { $ref: '#/components/schemas/to_account_id' },
			transaction_type: { $ref: '#/components/schemas/transaction_type' },
			amount: { $ref: '#/components/schemas/amount' },
			payment_mode: { $ref: '#/components/schemas/payment_mode' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			date: { $ref: '#/components/schemas/date' },
			customer_id: { $ref: '#/components/schemas/customer_id' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			description: { $ref: '#/components/schemas/description' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			tax_id: { $ref: '#/components/schemas/tax_id' },
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			tags: { $ref: '#/components/schemas/tags' },
			from_account_tags: { $ref: '#/components/schemas/tags' },
			to_account_tags: { $ref: '#/components/schemas/tags' },
			documents: { $ref: '#/components/schemas/documents' },
			bank_charges: { $ref: '#/components/schemas/bank_charges' },
			user_id: { $ref: '#/components/schemas/user_id' },
			tax_authority_id: { $ref: '#/components/schemas/tax_authority_id' },
			tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
		},
	},
	'create-a-transaction-for-an-account-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			banktransaction: { $ref: '#/components/schemas/banktransaction' },
		},
	},
	creditnote_id: {
		description: 'ID of the credit note that has to be refunded.',
		type: 'string',
	},
	currency_code: {
		description: 'Code of the currency involved in the transaction',
		type: 'string',
	},
	currency_id: {
		description: 'The currency ID involved in the transaction.',
		type: 'string',
	},
	currency_symbol: {
		description: 'Symbol of the currency involved in the transaction',
		type: 'string',
	},
	custom_field_id: { description: 'ID of the custom field.', type: 'string' },
	custom_fields: {
		description: 'List of custom fields associated with the transaction.',
		type: 'array',
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
	customer_id: { description: 'ID of the customer or vendor.', type: 'string' },
	customer_name: { description: 'Name of the Customer', type: 'string' },
	date: { description: 'Transaction date.', type: 'string' },
	debit_or_credit: {
		description: 'Indicates if transaction is Credit or Debit',
		type: 'string',
	},
	'delete-a-transaction-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	description: {
		description: 'A brief description about the transaction.',
		type: 'string',
	},
	discount_amount: {
		description: 'Amount of discount in the Invoice',
		type: 'number',
		format: 'double',
	},
	distance: {
		description: 'Distance Covered',
		type: 'number',
		format: 'double',
	},
	document_id: {
		description: 'Unique ID of the attached file.',
		type: 'string',
	},
	documents: {
		description: 'List of files to be attached to a particular transaction.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				file_name: { $ref: '#/components/schemas/file_name' },
				document_id: { $ref: '#/components/schemas/document_id' },
			},
		},
	},
	employee_id: { description: 'ID of the Employee', type: 'string' },
	end_reading: { description: 'End Reading of the Odometer', type: 'string' },
	engine_capacity_range: {
		description:
			'Type of Fuel Used. Allowed Values : <code>less_than_1400cc</code>, <code>between_1401cc_and_1600cc</code>, <code>between_1601cc_and_2000cc</code> and <code>more_than_2000cc</code>',
		type: 'string',
		'x-node_available_in': ['uk', 'eu'],
		'x-node_unavailable_in': [],
	},
	exchange_rate: {
		description: 'The foreign currency exchange rate value.',
		type: 'integer',
	},
	'exclude-a-transaction-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	expense_type: { description: 'Type of Expense', type: 'string' },
	file_name: { description: 'Name of the attached file.', type: 'string' },
	filed_in_vat_return_id: {
		description: 'ID of the VAT Return the Vendor Credit is filed in',
		type: 'string',
		'x-node_available_in': ['uk'],
		'x-node_unavailable_in': [],
	},
	filed_in_vat_return_name: {
		description: 'Name of the VAT Return the Vendor Credit is filed in',
		type: 'string',
		'x-node_available_in': ['uk'],
		'x-node_unavailable_in': [],
	},
	filed_in_vat_return_type: {
		description: 'Type of the VAT Return the Vendor Credit is filed in',
		type: 'string',
		'x-node_available_in': ['uk'],
		'x-node_unavailable_in': [],
	},
	from_account_id: {
		description:
			'The account ID from which money will be transferred(Mandatory for specific type of transactions). These accounts differ with respect to transaction_type. Ex: To a bank account, from-account can be: bank , card, income, refund. To a card account, from account can be: bank, card, refund.',
		type: 'string',
	},
	from_account_name: {
		description: 'The account Name from which money will be transferred',
		type: 'string',
	},
	fuel_type: {
		description:
			'Type of Fuel Used. Allowed Values : <code>petrol</code>, <code>lpg</code>, <code>diesel</code>',
		type: 'string',
		'x-node_available_in': ['uk', 'eu'],
		'x-node_unavailable_in': [],
	},
	'get-matching-transactions-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			matching_transactions: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						transaction_id: { $ref: '#/components/schemas/transaction_id' },
						date: { $ref: '#/components/schemas/date' },
						transaction_type: { $ref: '#/components/schemas/transaction_type' },
						reference_number: { $ref: '#/components/schemas/reference_number' },
						amount: { $ref: '#/components/schemas/amount' },
						debit_or_credit: { $ref: '#/components/schemas/debit_or_credit' },
						transaction_number: {
							$ref: '#/components/schemas/transaction_number',
						},
						is_paid_via_print_check: {
							$ref: '#/components/schemas/is_paid_via_print_check',
						},
						contact_name: { $ref: '#/components/schemas/contact_name' },
						is_best_match: { $ref: '#/components/schemas/is_best_match' },
					},
				},
			},
		},
	},
	'get-transaction-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			banktransaction: { $ref: '#/components/schemas/banktransaction' },
		},
	},
	'get-transactions-list-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			banktransactions: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						transaction_id: { $ref: '#/components/schemas/transaction_id' },
						date: { $ref: '#/components/schemas/date' },
						amount: { $ref: '#/components/schemas/amount' },
						transaction_type: { $ref: '#/components/schemas/transaction_type' },
						status: { $ref: '#/components/schemas/status' },
						source: { $ref: '#/components/schemas/source' },
						account_id: { $ref: '#/components/schemas/account_id' },
						account_name: { $ref: '#/components/schemas/account_name' },
						account_type: { $ref: '#/components/schemas/account_type' },
						price_precision: { $ref: '#/components/schemas/price_precision' },
						customer_id: { $ref: '#/components/schemas/customer_id' },
						payee: { $ref: '#/components/schemas/payee' },
						is_paid_via_print_check: {
							$ref: '#/components/schemas/is_paid_via_print_check',
						},
						description: { $ref: '#/components/schemas/description' },
						currency_id: { $ref: '#/components/schemas/currency_id' },
						currency_code: { $ref: '#/components/schemas/currency_code' },
						currency_symbol: { $ref: '#/components/schemas/currency_symbol' },
						debit_or_credit: { $ref: '#/components/schemas/debit_or_credit' },
						offset_account_name: {
							$ref: '#/components/schemas/offset_account_name',
						},
						is_offsetaccount_matched: {
							$ref: '#/components/schemas/is_offsetaccount_matched',
						},
						reference_number: { $ref: '#/components/schemas/reference_number' },
						imported_transaction_id: {
							$ref: '#/components/schemas/imported_transaction_id',
						},
						is_rule_exist: { $ref: '#/components/schemas/is_rule_exist' },
						rule_details: { $ref: '#/components/schemas/rule_details' },
					},
				},
			},
		},
	},
	imported_transaction_id: {
		description: 'ID of the Imported Transaction',
		type: 'string',
	},
	imported_transactions: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				imported_transaction_id: {
					$ref: '#/components/schemas/imported_transaction_id',
				},
				date: {
					description: 'Date of the transaction Imported',
					type: 'string',
				},
				amount: {
					description: 'Amount in the transaction',
					type: 'number',
					format: 'double',
				},
				payee: { $ref: '#/components/schemas/payee' },
				description: {
					description: 'Description of the transaction',
					type: 'string',
				},
				reference_number: {
					description: 'Reference Number of the transaction',
					type: 'string',
				},
				status: { description: 'Status of the transaction', type: 'string' },
				account_id: {
					description: 'Account ID of the transaction',
					type: 'string',
				},
			},
		},
	},
	index: { description: 'Index of the custom field', type: 'integer' },
	invoice_id: { description: 'ID of the Invoice', type: 'string' },
	invoice_payment_id: {
		description: 'ID of the Invoice Payment',
		type: 'string',
	},
	invoices: {
		description: 'List of invoices associated with the customer payment.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				invoice_payment_id: { $ref: '#/components/schemas/invoice_payment_id' },
				invoice_id: { $ref: '#/components/schemas/invoice_id' },
				amount_applied: { $ref: '#/components/schemas/amount_applied' },
				tax_amount_withheld: {
					$ref: '#/components/schemas/tax_amount_withheld',
				},
				discount_amount: { $ref: '#/components/schemas/discount_amount' },
			},
		},
	},
	is_best_match: {
		description: 'Check if the transaction is the best match',
		type: 'boolean',
	},
	is_billable: {
		description: 'A boolean value to specify if the expense is billable.',
		type: 'boolean',
	},
	is_inclusive_tax: {
		description: 'Check if transaction is tax Inclusive',
		type: 'boolean',
	},
	is_offsetaccount_matched: {
		description: 'Check if Offset Account is matched',
		type: 'boolean',
	},
	is_paid_via_print_check: {
		description: 'Is the entity paid via print check',
		type: 'boolean',
		'x-node_available_in': ['us', 'ca'],
		'x-node_unavailable_in': [],
	},
	is_rule_exist: {
		description: 'Check if rule exists for the transaction',
		type: 'boolean',
	},
	is_tag_mandatory: {
		description: 'Used to check if the tag is mandatory',
		type: 'boolean',
	},
	is_update_customer: {
		description: 'Check if Customer should be updated',
		type: 'boolean',
	},
	item_order: { description: 'Order of the Item', type: 'integer' },
	item_total: {
		description: 'Total of the Item',
		type: 'number',
		format: 'double',
	},
	item_total_inclusive_of_tax: {
		description: 'Total of the Item inclusive of Tax',
		type: 'number',
		format: 'double',
	},
	label: { description: 'Label of the Custom Field', type: 'string' },
	line_id: {
		description: 'ID of the Line in Bank Transactions',
		type: 'string',
	},
	line_item_id: { description: 'ID of the Line Item', type: 'string' },
	line_items: {
		description: 'List of line items for the bank transaction.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				from_account_id: { $ref: '#/components/schemas/from_account_id' },
				from_account_name: { $ref: '#/components/schemas/from_account_name' },
				payment_mode: { $ref: '#/components/schemas/payment_mode' },
				customer_id: { $ref: '#/components/schemas/customer_id' },
				customer_name: { $ref: '#/components/schemas/customer_name' },
				vendor_id: { $ref: '#/components/schemas/vendor_id' },
				vendor_name: { $ref: '#/components/schemas/vendor_name' },
				sub_total: { $ref: '#/components/schemas/sub_total' },
				total: { $ref: '#/components/schemas/total' },
				bcy_total: { $ref: '#/components/schemas/bcy_total' },
				tags: { $ref: '#/components/schemas/tags' },
			},
		},
	},
	'match-a-transaction-request': {
		type: 'object',
		properties: {
			transactions_to_be_matched: {
				$ref: '#/components/schemas/transactions_to_be_matched',
			},
		},
	},
	'match-a-transaction-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	memo: {
		description: 'Memo or note associated with the check.',
		type: 'string',
	},
	mileage_rate: {
		description: 'Mileage Rate to be Applied',
		type: 'number',
		format: 'double',
	},
	mileage_type: {
		description:
			'Type of Mileage. Allowed Values : <code>gmaps</code>,<code>imaps</code>,<code>gps</code>,<code>odometer</code>,<code>wmaps</code>,<code>manual</code>,<code>non_mileage</code> and <code>per_diem</code>',
		type: 'string',
	},
	mileage_unit: { description: 'Unit of Mileage', type: 'string' },
	offset_account_name: {
		description: 'Name of the Offset Account',
		type: 'string',
	},
	paid_through_account_id: {
		description: 'ID of the credit/ bank account the payment is made.',
		type: 'string',
	},
	payee: { description: 'Payee involved in the transaction', type: 'string' },
	payment_mode: {
		description:
			'Mode of payment for the transaction. (not applicable for transfer_fund, card_payment, owner_drawings). Ex:cash, cheque, etc.,',
		type: 'string',
	},
	price_precision: {
		description: 'Price Precision of the Values',
		type: 'integer',
	},
	product_type: {
		description:
			'Type of the transaction. This denotes whether the transaction line item is to be treated as goods or as a service. Allowed Values: <br/> <b>For UK and Europe: </b><code>digital_service</code>, <code>goods</code> and <code>service</code>.<br/><b>For SouthAfrica Edition:</b> <code>service</code>, <code>goods</code>, <code>capital_service</code> and <code>capital_goods</code>',
		type: 'string',
		'x-node_available_in': ['uk', 'eu', 'za'],
		'x-node_unavailable_in': [],
	},
	project_id: {
		description: 'ID of the project associated with the expense.',
		type: 'string',
	},
	reason: { description: 'Reason', type: 'string' },
	recurring_expense_id: {
		description: 'ID of the Recurring Expense',
		type: 'string',
	},
	reference_number: {
		description: 'Reference Number of the transaction',
		type: 'string',
	},
	refund_mode: {
		description: 'Mode of refund. Ex - Cash, Cheque etc.,',
		type: 'string',
	},
	'restore-a-transaction-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	retainerinvoice_id: {
		description: 'ID of the Retainer Invoice',
		type: 'string',
	},
	reverse_charge_tax_id: {
		description: 'Enter reverse charge tax ID',
		type: 'string',
		'x-node_available_in': ['in', 'gcc', 'za'],
	},
	reverse_charge_vat_amount: {
		description: 'Percentage of the Reverse Charge',
		type: 'string',
		'x-node_available_in': ['uk', 'eu'],
		'x-node_unavailable_in': [],
	},
	reverse_charge_vat_id: {
		description:
			'(Optional) This is the ID of the tax applied in case this is a non UK - service purchase or expense and reverse charge VAT needs to be reported.',
		type: 'string',
		'x-node_available_in': ['uk', 'eu'],
		'x-node_unavailable_in': [],
	},
	reverse_charge_vat_name: {
		description: 'Name of the Reverse Charge',
		type: 'string',
		'x-node_available_in': ['uk', 'eu'],
		'x-node_unavailable_in': [],
	},
	reverse_charge_vat_percentage: {
		description: 'Percentage of the Reverse Charge',
		type: 'string',
		'x-node_available_in': ['uk', 'eu'],
		'x-node_unavailable_in': [],
	},
	rule_details: {
		description: 'Details of the Rule',
		type: 'array',
		items: { type: 'string' },
	},
	source: { description: 'Source of the transaction', type: 'string' },
	start_reading: {
		description: 'Start Reading of the Odometer',
		type: 'string',
	},
	status: {
		description:
			'Transaction status wise list view - All, uncategorized, manually_added, matched, excluded, categorized',
		type: 'string',
	},
	sub_total: { description: 'Sub Total of the transaction', type: 'integer' },
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
	tax_amount: {
		description: 'Amount of Tax',
		type: 'number',
		format: 'double',
	},
	tax_amount_withheld: {
		description: 'Amount of tax withheld for the transaction.',
		type: 'number',
		format: 'double',
	},
	tax_authority_id: {
		description: 'ID of the Tax Authority',
		type: 'string',
		'x-node_available_in': ['us', 'au', 'ca'],
		'x-node_unavailable_in': [],
	},
	tax_authority_name: {
		description: 'Name of the Tax Authority',
		type: 'string',
		'x-node_available_in': ['us', 'au', 'ca'],
		'x-node_unavailable_in': [],
	},
	tax_exemption_code: {
		description: 'Code of the Tax Exemption',
		type: 'string',
		'x-node_available_in': ['in', 'us', 'au', 'ca'],
		'x-node_unavailable_in': [],
	},
	tax_exemption_id: {
		description: 'ID of the Tax Exemption',
		type: 'string',
		'x-node_available_in': ['in', 'us', 'au', 'ca'],
		'x-node_unavailable_in': [],
	},
	tax_id: {
		description: 'ID of the tax or tax group applied',
		type: 'string',
		'x-node_available_in': [],
		'x-node_unavailable_in': ['us'],
	},
	tax_name: { description: 'Name of the Tax', type: 'string' },
	tax_percentage: {
		description: 'Percentage of the Tax',
		type: 'number',
		format: 'double',
	},
	tax_treatment: {
		description:
			'VAT treatment for the bank transaction.Choose whether the contact falls under: <code>vat_registered</code>,<code>vat_not_registered</code>,<code>gcc_vat_not_registered</code>,<code>gcc_vat_registered</code>,<code>non_gcc</code>.</br><code>dz_vat_registered</code> and <code>dz_vat_not_registered</code> are supported only for <b>UAE</b>.<br/><b>For Kenya Edition:</b> <code>vat_registered</code> ,<code>vat_not_registered</code> ,<code>non_kenya</code>(A business that is located outside Kenya).<br/><b>For SouthAfrica Edition:</b> <code>vat_registered</code>, <code>vat_not_registered</code>, <code>overseas</code>(A business that is located outside SouthAfrica).',
		type: 'string',
		'x-node_available_in': ['gcc', 'ke', 'za'],
		'x-node_unavailable_in': [],
	},
	tax_type: {
		description: 'Type of tax applied to the line item.',
		type: 'string',
	},
	taxes: {
		description: 'List of taxes applied to the transaction.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				tax_name: { $ref: '#/components/schemas/tax_name' },
				tax_amount: { $ref: '#/components/schemas/tax_amount' },
				tax_id: { $ref: '#/components/schemas/tax_id' },
			},
		},
	},
	template_id: { description: 'ID of the template', type: 'string' },
	to_account_id: {
		description:
			'ID of the account to which the money gets transferred(Mandatory for specific type of transactions). Ex: From a bank account, to-account can be: bank, card, drawings, expense,credit notes. From a card account, to-account can be: card, bank, expense.',
		type: 'string',
	},
	to_account_name: { type: 'string' },
	total: { description: 'Total of the transaction', type: 'integer' },
	transaction_id: { description: 'ID of the Transaction', type: 'string' },
	transaction_number: {
		description: 'Number of the transaction',
		type: 'string',
	},
	transaction_type: {
		description:
			'Type of the transaction. <br> <strong>Allowed transaction types</strong> : deposit, refund(*Supported only in Credit Card accounts), transfer_fund, card_payment, sales_without_invoices, expense_refund, owner_contribution, interest_income, other_income, owner_drawings, sales_return <br> <strong>Note:</strong> You will not be able to create the following module-specific transaction types under Bank Transaction endpoints :<div> <a href="#Expenses">Expense</a>, <a href="#Vendor-Payments">Vendor Advance/Vendor Payment/Bill Payment</a>, <a href="#Vendor-Credits_Refund_a_vendor_credit">Vendor Credit Refund</a>, <a href="#Vendor-Payments_Refund_an_excess_vendor_payment">Vendor Payment Refund</a>, <a href="#Customer-Payments">Customer Advance/Customer Payment</a>, <a href="#Credit-Notes_Refund_credit_note">Credit Note Refund</a>, <a href="#Customer-Payments_Refund_an_excess_customer_payment">Payment Refund</a>. Hence, refer them in their repective modules.</div>',
		type: 'string',
	},
	transactions_to_be_matched: {
		description:
			'List of transactions to be matched with the uncategorized transaction.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				transaction_id: { $ref: '#/components/schemas/transaction_id' },
				transaction_type: { $ref: '#/components/schemas/transaction_type' },
			},
		},
	},
	'uncategorize-a-categorized-transaction-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'unmatch-a-matched-transaction-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'update-a-transaction-request': {
		required: ['transaction_type'],
		type: 'object',
		properties: {
			from_account_id: { $ref: '#/components/schemas/from_account_id' },
			to_account_id: { $ref: '#/components/schemas/to_account_id' },
			transaction_type: { $ref: '#/components/schemas/transaction_type' },
			amount: { $ref: '#/components/schemas/amount' },
			payment_mode: { $ref: '#/components/schemas/payment_mode' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			date: { $ref: '#/components/schemas/date' },
			customer_id: { $ref: '#/components/schemas/customer_id' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			description: { $ref: '#/components/schemas/description' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			tax_id: { $ref: '#/components/schemas/tax_id' },
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			tags: { $ref: '#/components/schemas/tags' },
			from_account_tags: { $ref: '#/components/schemas/tags' },
			to_account_tags: { $ref: '#/components/schemas/tags' },
			documents: { $ref: '#/components/schemas/documents' },
			bank_charges: { $ref: '#/components/schemas/bank_charges' },
			user_id: { $ref: '#/components/schemas/user_id' },
			tax_authority_id: { $ref: '#/components/schemas/tax_authority_id' },
			tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			line_items: {
				type: 'array',
				description:
					'List of expense line items associated with the transaction.',
				items: {
					type: 'object',
					properties: {
						line_id: { $ref: '#/components/schemas/line_id' },
						account_id: { $ref: '#/components/schemas/account_id' },
						account_name: { $ref: '#/components/schemas/account_name' },
						description: { $ref: '#/components/schemas/description' },
						tax_amount: { $ref: '#/components/schemas/tax_amount' },
						tax_id: { $ref: '#/components/schemas/tax_id' },
						tax_name: { $ref: '#/components/schemas/tax_name' },
						tax_type: { $ref: '#/components/schemas/tax_type' },
						tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
						item_total: { $ref: '#/components/schemas/item_total' },
						item_total_inclusive_of_tax: {
							$ref: '#/components/schemas/item_total_inclusive_of_tax',
						},
						item_order: { $ref: '#/components/schemas/item_order' },
						tags: { $ref: '#/components/schemas/tags' },
					},
				},
			},
		},
	},
	'update-a-transaction-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			banktransaction: { $ref: '#/components/schemas/banktransaction' },
		},
	},
	user_id: {
		description: 'ID of the User involved in the Transaction',
		type: 'string',
	},
	value: { description: 'Value of the Custom Field', type: 'string' },
	vat_treatment: {
		description:
			'VAT treatment for the bank transaction. VAT treatment denotes the location of the customer or vendor. If the customer or vendor resides in the UK then the VAT treatment is <code>uk</code>. If the customer or vendor is in an EU country & VAT registered, you are resides in Northen Ireland and purchasing/selling Goods then his VAT treatment is <code>eu_vat_registered</code>. And, if he resides outside the UK then his VAT treatment is <code>overseas</code>.',
		type: 'string',
		'x-node_available_in': ['uk', 'eu'],
		'x-node_unavailable_in': [],
	},
	vehicle_id: { description: 'ID of the Vehicle', type: 'string' },
	vendor_credit_id: {
		description: 'ID of the vendor credit that has to be refunded.',
		type: 'string',
	},
	vendor_id: { description: 'ID of the Vendor', type: 'string' },
	vendor_name: { description: 'Name of the Vendor', type: 'string' },
	vendorpayment_id: {
		description: 'Vendor Payment to which you want to record the refund.',
		type: 'string',
	},
	zcrm_potential_id: {
		description: 'ID of the CRM potential associated with the transaction.',
		type: 'string',
	},
	zp_client_id: { description: 'ID of client', type: 'string' },
	zp_project_id: { description: 'ID of the Project', type: 'string' },
	zp_project_name: { description: 'Name of the Project', type: 'string' },
} as const satisfies Record<string, JsonValue>;

export const operations = [
	{
		id: 'create_bank_transaction',
		group: 'bankTransactions',
		groupSlug: 'bank-transactions',
		name: 'createBankTransaction',
		method: 'POST',
		path: '/banktransactions',
		summary: 'Create a transaction for an account',
		description:
			'Create a bank transaction based on the allowed transaction types.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-transactions/',
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
			schema: {
				$ref: '#/components/schemas/create-a-transaction-for-an-account-request',
			},
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/create-a-transaction-for-an-account-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_bank_transactions',
		group: 'bankTransactions',
		groupSlug: 'bank-transactions',
		name: 'listBankTransactions',
		method: 'GET',
		path: '/banktransactions',
		summary: 'Get transactions list',
		description: 'Get all the transaction details involved in an account.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-transactions/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'account_id',
				in: 'query',
				required: false,
				description: 'ID of the bank account to filter transactions.',
				schema: { type: 'string' },
			},
			{
				name: 'transaction_type',
				in: 'query',
				required: false,
				description:
					'Type of the bank transaction. Allowed Values: <code>sales_without_invoices</code>, <code>expense_refund</code>, <code>owner_drawings</code>, <code>owner_contribution</code>, <code>interest_income</code>, <code>other_income</code>, <code>expense</code>, <code>deposit</code>',
				schema: { type: 'string' },
			},
			{
				name: 'date',
				in: 'query',
				required: false,
				description:
					'Start and end date, to provide a range within which the transaction date exist. Variants: <code>date_start</code> and <code>date_end</code>',
				schema: { type: 'string' },
			},
			{
				name: 'amount',
				in: 'query',
				required: false,
				description:
					'Start and end amount, to provide a range within which the transaction amount exist. Variants: <code>amount_start</code> and <code>amount_end</code>',
				schema: { type: 'number', format: 'double' },
			},
			{
				name: 'status',
				in: 'query',
				required: false,
				description:
					'Transaction status wise list view - All, uncategorized, manually_added, matched, excluded, categorized',
				schema: { type: 'string' },
			},
			{
				name: 'reference_number',
				in: 'query',
				required: false,
				description: 'Search using Reference Number of the transaction',
				schema: { type: 'string' },
			},
			{
				name: 'filter_by',
				in: 'query',
				required: false,
				description:
					'Filters the transactions based on the allowed types. Allowed Values: <code>Status.All</code>, <code>Status.Uncategorized</code>, <code>Status.Categorized</code>, <code>Status.ManuallyAdded</code>, <code>Status.Excluded</code> and <code>Status.Matched</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description:
					'Sorts the transactions based on the allowed sort types. Allowed Values: <code>date</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'transaction_status',
				in: 'query',
				required: false,
				description:
					'Transaction status wise list view - All, uncategorized, manually_added, matched, excluded, categorized',
				schema: { type: 'string' },
			},
			{
				name: 'search_text',
				in: 'query',
				required: false,
				description: 'Search Transactions by contact name or description',
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
				schema: { $ref: '#/components/schemas/get-transactions-list-response' },
			},
		],
		scopes: ['ZohoBooks.banking.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_bank_transaction',
		group: 'bankTransactions',
		groupSlug: 'bank-transactions',
		name: 'updateBankTransaction',
		method: 'PUT',
		path: '/banktransactions/{bank_transaction_id}',
		summary: 'Update a transaction',
		description:
			'Make changes in the applicable fields of a transaction and update it.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-transactions/',
		parameters: [
			{
				name: 'bank_transaction_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bank transaction.',
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
			schema: { $ref: '#/components/schemas/update-a-transaction-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-a-transaction-response' },
			},
		],
		scopes: ['ZohoBooks.banking.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_bank_transaction',
		group: 'bankTransactions',
		groupSlug: 'bank-transactions',
		name: 'getBankTransaction',
		method: 'GET',
		path: '/banktransactions/{bank_transaction_id}',
		summary: 'Get transaction',
		description:
			'Fetch the details of a transaction by specifying the transaction_id.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-transactions/',
		parameters: [
			{
				name: 'bank_transaction_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bank transaction.',
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
				schema: { $ref: '#/components/schemas/get-transaction-response' },
			},
		],
		scopes: ['ZohoBooks.banking.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_bank_transaction',
		group: 'bankTransactions',
		groupSlug: 'bank-transactions',
		name: 'deleteBankTransaction',
		method: 'DELETE',
		path: '/banktransactions/{bank_transaction_id}',
		summary: 'Delete a transaction',
		description:
			'Delete a transaction from an account by specifying the transaction_id.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-transactions/',
		parameters: [
			{
				name: 'bank_transaction_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bank transaction.',
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
				schema: { $ref: '#/components/schemas/delete-a-transaction-response' },
			},
		],
		scopes: ['ZohoBooks.banking.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_matching_bank_transactions',
		group: 'bankTransactions',
		groupSlug: 'bank-transactions',
		name: 'getMatchingBankTransactions',
		method: 'GET',
		path: '/banktransactions/uncategorized/{transaction_id}/match',
		summary: 'Get matching transactions',
		description:
			'Provide criteria to search for matching uncategorised transactions. The list of transactions can also include invoices/bills/credit-notes which will not be matched directly. Instead, a new (payment/refund) transaction is recorded and matched.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-transactions/',
		parameters: [
			{
				name: 'transaction_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bank transaction.',
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
				name: 'transaction_id',
				in: 'query',
				required: false,
				description: 'ID of the Transaction',
				schema: { type: 'string' },
			},
			{
				name: 'transaction_type',
				in: 'query',
				required: false,
				description:
					'Type of the transaction. <br> <strong>Allowed transaction types</strong> : deposit, refund(*Supported only in Credit Card accounts), transfer_fund, card_payment, sales_without_invoices, expense_refund, owner_contribution, interest_income, other_income, owner_drawings, sales_return <br> <strong>Note:</strong> You will not be able to create the following module-specific transaction types under Bank Transaction endpoints :<div> <a href="#Expenses">Expense</a>, <a href="#Vendor-Payments">Vendor Advance/Vendor Payment/Bill Payment</a>, <a href="#Vendor-Credits_Refund_a_vendor_credit">Vendor Credit Refund</a>, <a href="#Vendor-Payments_Refund_an_excess_vendor_payment">Vendor Payment Refund</a>, <a href="#Customer-Payments">Customer Advance/Customer Payment</a>, <a href="#Credit-Notes_Refund_credit_note">Credit Note Refund</a>, <a href="#Customer-Payments_Refund_an_excess_customer_payment">Payment Refund</a>. Hence, refer them in their repective modules.</div>',
				schema: { type: 'string' },
			},
			{
				name: 'date_after',
				in: 'query',
				required: false,
				description: 'Date after which Transactions are to be filtered',
				schema: { type: 'string' },
			},
			{
				name: 'date_before',
				in: 'query',
				required: false,
				description: 'Date before which Transactions are to be filtered',
				schema: { type: 'string' },
			},
			{
				name: 'amount_start',
				in: 'query',
				required: false,
				description:
					'Starting amout with which transactions are to be filtered',
				schema: { type: 'number', format: 'double' },
			},
			{
				name: 'amount_end',
				in: 'query',
				required: false,
				description:
					'Starting amout with which transactions are to be filtered',
				schema: { type: 'number', format: 'double' },
			},
			{
				name: 'contact',
				in: 'query',
				required: false,
				description: 'Contact person name, involved in the transaction.',
				schema: { type: 'string' },
			},
			{
				name: 'reference_number',
				in: 'query',
				required: false,
				description: 'Reference Number of the transaction',
				schema: { type: 'string' },
			},
			{
				name: 'show_all_transactions',
				in: 'query',
				required: false,
				description: 'Check if all transactions must be shown',
				schema: { type: 'boolean' },
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
					$ref: '#/components/schemas/get-matching-transactions-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.READ'],
		riskLevel: 'read',
	},
	{
		id: 'match_bank_transaction',
		group: 'bankTransactions',
		groupSlug: 'bank-transactions',
		name: 'matchBankTransaction',
		method: 'POST',
		path: '/banktransactions/uncategorized/{transaction_id}/match',
		summary: 'Match a transaction',
		description:
			'Match an uncategorized transaction with an existing transaction in the account.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-transactions/',
		parameters: [
			{
				name: 'transaction_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bank transaction.',
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
				name: 'account_id',
				in: 'query',
				required: false,
				description:
					'Mandatory Account id for which transactions are to be listed.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/match-a-transaction-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/match-a-transaction-response' },
			},
		],
		scopes: ['ZohoBooks.banking.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'unmatch_bank_transaction',
		group: 'bankTransactions',
		groupSlug: 'bank-transactions',
		name: 'unmatchBankTransaction',
		method: 'POST',
		path: '/banktransactions/{transaction_id}/unmatch',
		summary: 'Unmatch a matched transaction',
		description:
			'Unmatch a transaction that was previously matched and make it uncategorized.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-transactions/',
		parameters: [
			{
				name: 'transaction_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bank transaction.',
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
				name: 'account_id',
				in: 'query',
				required: false,
				description:
					'Mandatory Account id for which transactions are to be listed.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/unmatch-a-matched-transaction-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'exclude_bank_transaction',
		group: 'bankTransactions',
		groupSlug: 'bank-transactions',
		name: 'excludeBankTransaction',
		method: 'POST',
		path: '/banktransactions/uncategorized/{transaction_id}/exclude',
		summary: 'Exclude a transaction',
		description: 'Exclude a transaction from your bank or credit card account.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-transactions/',
		parameters: [
			{
				name: 'transaction_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bank transaction.',
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
				name: 'account_id',
				in: 'query',
				required: false,
				description:
					'Mandatory Account id for which transactions are to be listed.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/exclude-a-transaction-response' },
			},
		],
		scopes: ['ZohoBooks.banking.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'restore_bank_transaction',
		group: 'bankTransactions',
		groupSlug: 'bank-transactions',
		name: 'restoreBankTransaction',
		method: 'POST',
		path: '/banktransactions/uncategorized/{transaction_id}/restore',
		summary: 'Restore a transaction',
		description: 'Restore an excluded transaction in your account.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-transactions/',
		parameters: [
			{
				name: 'transaction_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bank transaction.',
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
				name: 'account_id',
				in: 'query',
				required: false,
				description:
					'Mandatory Account id for which transactions are to be listed.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/restore-a-transaction-response' },
			},
		],
		scopes: ['ZohoBooks.banking.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'categorize_bank_transaction',
		group: 'bankTransactions',
		groupSlug: 'bank-transactions',
		name: 'categorizeBankTransaction',
		method: 'POST',
		path: '/banktransactions/uncategorized/{transaction_id}/categorize',
		summary: 'Categorize an uncategorized transaction',
		description:
			'Categorize an uncategorized transaction by creating a new transaction.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-transactions/',
		parameters: [
			{
				name: 'transaction_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bank transaction.',
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
				$ref: '#/components/schemas/categorize-an-uncategorized-transaction-request',
			},
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/categorize-an-uncategorized-transaction-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'categorize_bank_transaction_as_expense',
		group: 'bankTransactions',
		groupSlug: 'bank-transactions',
		name: 'categorizeBankTransactionAsExpense',
		method: 'POST',
		path: '/banktransactions/uncategorized/{transaction_id}/categorize/expenses',
		summary: 'Categorize as expense',
		description: 'Categorize an Uncategorized transaction as expense.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-transactions/',
		parameters: [
			{
				name: 'transaction_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bank transaction.',
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
				name: 'doc',
				in: 'query',
				required: false,
				description: 'Document that is to be attached',
				schema: { type: 'string' },
			},
			{
				name: 'totalFiles',
				in: 'query',
				required: false,
				description: 'Total number of files.',
				schema: { type: 'integer' },
			},
			{
				name: 'document_ids',
				in: 'query',
				required: false,
				description:
					'Comma-separated list of document IDs to be attached to the transaction.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/categorize-as-expense-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/categorize-as-expense-response' },
			},
		],
		scopes: ['ZohoBooks.banking.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'uncategorize_bank_transaction',
		group: 'bankTransactions',
		groupSlug: 'bank-transactions',
		name: 'uncategorizeBankTransaction',
		method: 'POST',
		path: '/banktransactions/{transaction_id}/uncategorize',
		summary: 'Uncategorize a categorized transaction',
		description: 'Revert a categorized transaction as uncategorized.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-transactions/',
		parameters: [
			{
				name: 'transaction_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bank transaction.',
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
				name: 'account_id',
				in: 'query',
				required: false,
				description:
					'Mandatory Account id for which transactions are to be listed.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/uncategorize-a-categorized-transaction-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'categorize_bank_transaction_as_vendor_payment',
		group: 'bankTransactions',
		groupSlug: 'bank-transactions',
		name: 'categorizeBankTransactionAsVendorPayment',
		method: 'POST',
		path: '/banktransactions/uncategorized/{transaction_id}/categorize/vendorpayments',
		summary: 'Categorize a vendor payment',
		description: 'Categorize an uncategorized transaction as Vendor Payment.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-transactions/',
		parameters: [
			{
				name: 'transaction_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bank transaction.',
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
				$ref: '#/components/schemas/categorize-a-vendor-payment-request',
			},
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/categorize-a-vendor-payment-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'categorize_bank_transaction_as_customer_payment',
		group: 'bankTransactions',
		groupSlug: 'bank-transactions',
		name: 'categorizeBankTransactionAsCustomerPayment',
		method: 'POST',
		path: '/banktransactions/uncategorized/{transaction_id}/categorize/customerpayments',
		summary: 'Categorize as customer payment',
		description: 'Categorize an uncategorized transaction as Customer Payment.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-transactions/',
		parameters: [
			{
				name: 'transaction_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bank transaction.',
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
				$ref: '#/components/schemas/categorize-as-customer-payment-request',
			},
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/categorize-as-customer-payment-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'categorize_as_credit_note_refunds',
		group: 'bankTransactions',
		groupSlug: 'bank-transactions',
		name: 'categorizeAsCreditNoteRefunds',
		method: 'POST',
		path: '/banktransactions/uncategorized/{transaction_id}/categorize/creditnoterefunds',
		summary: 'Categorize as credit note refunds',
		description:
			'Categorize an Uncategorized transaction as a refund from a credit note.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-transactions/',
		parameters: [
			{
				name: 'transaction_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bank transaction.',
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
				$ref: '#/components/schemas/categorize-as-credit-note-refunds-request',
			},
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/categorize-as-credit-note-refunds-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'categorize_as_vendor_credit_refunds',
		group: 'bankTransactions',
		groupSlug: 'bank-transactions',
		name: 'categorizeAsVendorCreditRefunds',
		method: 'POST',
		path: '/banktransactions/uncategorized/{transaction_id}/categorize/vendorcreditrefunds',
		summary: 'Categorize as vendor credit refunds',
		description:
			'Categorize an uncategorized transaction as a refund from a vendor credit.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-transactions/',
		parameters: [
			{
				name: 'transaction_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bank transaction.',
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
				$ref: '#/components/schemas/categorize-as-vendor-credit-refunds-request',
			},
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/categorize-as-vendor-credit-refunds-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'categorize_bank_transaction_as_payment_refund',
		group: 'bankTransactions',
		groupSlug: 'bank-transactions',
		name: 'categorizeBankTransactionAsPaymentRefund',
		method: 'POST',
		path: '/banktransactions/uncategorized/{statement_line_id}/categorize/paymentrefunds',
		summary: 'Categorize as Customer Payment refund',
		description: 'Categorizing bank transactions as Payment Refund.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-transactions/',
		parameters: [
			{
				name: 'statement_line_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bank statement line.',
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
				$ref: '#/components/schemas/categorize-as-customer-payment-refund-request',
			},
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/categorize-as-customer-payment-refund-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'categorize_as_vendor_payment_refund',
		group: 'bankTransactions',
		groupSlug: 'bank-transactions',
		name: 'categorizeAsVendorPaymentRefund',
		method: 'POST',
		path: '/banktransactions/uncategorized/{statement_line_id}/categorize/vendorpaymentrefunds',
		summary: 'Categorize as Vendor Payment refund',
		description: 'Categorizing bank transactions as Vendor Payment Refund.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-transactions/',
		parameters: [
			{
				name: 'statement_line_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bank statement line.',
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
				$ref: '#/components/schemas/categorize-as-vendor-payment-refund-request',
			},
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/categorize-as-vendor-payment-refund-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.CREATE'],
		riskLevel: 'destructive',
	},
] as const satisfies readonly ZohoBooksOperationDefinition[];
