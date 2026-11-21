import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas: Record<string, JsonValue> = {
	account_id: {
		description:
			'Unique identifier for the chart of accounts entry. Can be fetched from the Chart of Accounts API. Determines how this expense is categorized in financial reports and general ledger. Required for proper expense classification and accounting compliance.',
		type: 'string',
	},
	account_name: { description: 'Name of the Account', type: 'string' },
	ach_gw_transaction_id: {
		description: 'ID of the ACH Payment Transaction',
		type: 'string',
	},
	ach_payment_status: {
		description: 'Status of the ACH Payment',
		type: 'string',
	},
	acquisition_vat_amount: {
		description: 'Amount of the VAT Acquistion',
		type: 'string',
		'x-node_available_in': ['uk', 'eu'],
		'x-node_unavailable_in': [],
	},
	acquisition_vat_id: {
		description:
			'(Optional) This is the ID of the tax applied in case this is an EU - goods purchase and acquisition VAT needs to be reported.',
		type: 'string',
		'x-node_available_in': ['uk'],
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
	acquisition_vat_summary: {
		description: 'Summary of the VAT Acquistion',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				tax_name: { $ref: '#/components/schemas/tax_name' },
				tax_amount: { $ref: '#/components/schemas/tax_amount' },
			},
		},
		'x-node_available_in': ['uk', 'eu'],
		'x-node_unavailable_in': [],
	},
	acquisition_vat_total: {
		description: 'Total of the VAT Acquistion',
		type: 'number',
		format: 'double',
		'x-node_available_in': ['uk', 'eu'],
		'x-node_unavailable_in': [],
	},
	'add-attachment-to-a-bill-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'add-comment-request': {
		required: ['description'],
		type: 'object',
		properties: { description: { $ref: '#/components/schemas/description' } },
	},
	'add-comment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			comment: { $ref: '#/components/schemas/comment' },
		},
	},
	address: { description: 'Address involved in the Bill', type: 'string' },
	adjustment: {
		description:
			'Additional amount added to or subtracted from bill total. Positive values increase total, negative values decrease total. Used for discounts, surcharges, rounding adjustments, or other modifications. Affects final bill amount, tax calculations, and payment processing.',
		type: 'number',
		format: 'double',
	},
	adjustment_description: {
		description:
			'Text description explaining the reason for bill adjustment. sample: "Early payment discount", "Volume discount", "Rounding adjustment", "Handling fee". Helps in audit trails and reporting. Required when adjustment amount is non-zero. Used in financial reports, tax returns, and vendor communications. Should be clear and specific for compliance purposes.',
		type: 'string',
	},
	amount: { type: 'number', format: 'double' },
	amount_applied: {
		description: 'Amount applied to the bill.',
		type: 'number',
		format: 'double',
	},
	applied_filter: { description: 'Filter that is applied', type: 'string' },
	'apply-credits-request': {
		type: 'object',
		properties: {
			bill_payments: { $ref: '#/components/schemas/bill_payments' },
			apply_vendor_credits: {
				$ref: '#/components/schemas/apply_vendor_credits',
			},
		},
	},
	'apply-credits-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	apply_vendor_credits: {
		description: 'List of vendor credits applied to the bill.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				vendor_credit_id: { $ref: '#/components/schemas/vendor_credit_id' },
				amount_applied: { $ref: '#/components/schemas/amount_applied' },
			},
		},
	},
	'approve-a-bill-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	approver_id: { description: 'ID of the Approver', type: 'string' },
	approvers: {
		description: 'List of approvers for the bill.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				approver_id: { $ref: '#/components/schemas/approver_id' },
				order: { $ref: '#/components/schemas/order' },
			},
		},
	},
	attachment_name: { description: 'Name of the Attachment', type: 'string' },
	attention: {
		description: 'Attention field for the billing address.',
		type: 'string',
	},
	balance: { description: 'Balance in the Bill', type: 'integer' },
	bank_account_id: {
		description:
			'Unique identifier of the bank account for expected payment. Used for UAE E-Invoicing. Note: This value is a set of numeric characters.',
		type: 'string',
		'x-node_available_in': ['uae'],
		'x-node_unavailable_in': [],
	},
	bcy_rate: {
		description: 'Rate in Base Currency of the Organization',
		type: 'integer',
	},
	bill: {
		type: 'object',
		properties: {
			bill_id: { $ref: '#/components/schemas/bill_id' },
			entity_type: { $ref: '#/components/schemas/entity_type' },
			purchaseorder_ids: { $ref: '#/components/schemas/purchaseorder_ids' },
			vendor_id: { $ref: '#/components/schemas/vendor_id' },
			vendor_name: { $ref: '#/components/schemas/vendor_name' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			vat_reg_no: { $ref: '#/components/schemas/vat_reg_no' },
			source_of_supply: { $ref: '#/components/schemas/source_of_supply' },
			destination_of_supply: {
				$ref: '#/components/schemas/destination_of_supply',
			},
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			permit_number: { $ref: '#/components/schemas/permit_number' },
			gst_no: { $ref: '#/components/schemas/gst_no' },
			gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			tax_reg_no: { $ref: '#/components/schemas/tax_reg_no' },
			registration_details: {
				$ref: '#/components/schemas/registration_details',
			},
			is_pre_gst: { $ref: '#/components/schemas/is_pre_gst' },
			pricebook_id: { $ref: '#/components/schemas/pricebook_id' },
			pricebook_name: { $ref: '#/components/schemas/pricebook_name' },
			is_reverse_charge_applied: {
				$ref: '#/components/schemas/is_reverse_charge_applied',
			},
			unused_credits_payable_amount: {
				$ref: '#/components/schemas/unused_credits_payable_amount',
			},
			status: { $ref: '#/components/schemas/status' },
			bill_number: { $ref: '#/components/schemas/bill_number' },
			date: { $ref: '#/components/schemas/date' },
			due_date: { $ref: '#/components/schemas/due_date' },
			payment_terms: { $ref: '#/components/schemas/payment_terms' },
			payment_terms_label: { $ref: '#/components/schemas/payment_terms_label' },
			payment_expected_date: {
				$ref: '#/components/schemas/payment_expected_date',
			},
			reference_number: { $ref: '#/components/schemas/reference_number' },
			recurring_bill_id: { $ref: '#/components/schemas/recurring_bill_id' },
			due_by_days: { $ref: '#/components/schemas/due_by_days' },
			due_in_days: { $ref: '#/components/schemas/due_in_days' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			currency_code: { $ref: '#/components/schemas/currency_code' },
			currency_symbol: { $ref: '#/components/schemas/currency_symbol' },
			documents: { $ref: '#/components/schemas/documents' },
			price_precision: { $ref: '#/components/schemas/price_precision' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			adjustment: { $ref: '#/components/schemas/adjustment' },
			adjustment_description: {
				$ref: '#/components/schemas/adjustment_description',
			},
			discount_code: { $ref: '#/components/schemas/discount_code' },
			bank_account_id: { $ref: '#/components/schemas/bank_account_id' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			tags: { $ref: '#/components/schemas/tags_response' },
			is_tds_applied: { $ref: '#/components/schemas/is_tds_applied' },
			is_item_level_tax_calc: {
				$ref: '#/components/schemas/is_item_level_tax_calc',
			},
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			filed_in_vat_return_id: {
				$ref: '#/components/schemas/filed_in_vat_return_id',
			},
			filed_in_vat_return_name: {
				$ref: '#/components/schemas/filed_in_vat_return_name',
			},
			filed_in_vat_return_type: {
				$ref: '#/components/schemas/filed_in_vat_return_type',
			},
			is_abn_quoted: { $ref: '#/components/schemas/is_abn_quoted' },
			line_items: { $ref: '#/components/schemas/line_items' },
			location_id: { $ref: '#/components/schemas/location_id' },
			location_name: { $ref: '#/components/schemas/location_name' },
			sub_total: { $ref: '#/components/schemas/sub_total' },
			tax_total: { $ref: '#/components/schemas/tax_total' },
			total: { $ref: '#/components/schemas/total' },
			payment_made: { $ref: '#/components/schemas/payment_made' },
			vendor_credits_applied: {
				$ref: '#/components/schemas/vendor_credits_applied',
			},
			is_line_item_invoiced: {
				$ref: '#/components/schemas/is_line_item_invoiced',
			},
			purchaseorders: { $ref: '#/components/schemas/purchaseorders' },
			taxes: { $ref: '#/components/schemas/taxes' },
			acquisition_vat_summary: {
				$ref: '#/components/schemas/acquisition_vat_summary',
			},
			acquisition_vat_total: {
				$ref: '#/components/schemas/acquisition_vat_total',
			},
			reverse_charge_vat_summary: {
				$ref: '#/components/schemas/reverse_charge_vat_summary',
			},
			reverse_charge_vat_total: {
				$ref: '#/components/schemas/reverse_charge_vat_total',
			},
			balance: { $ref: '#/components/schemas/balance' },
			billing_address: { $ref: '#/components/schemas/billing_address' },
			payments: { $ref: '#/components/schemas/payments' },
			vendor_credits: { $ref: '#/components/schemas/vendor_credits' },
			created_time: { $ref: '#/components/schemas/created_time' },
			created_by_id: { $ref: '#/components/schemas/created_by_id' },
			last_modified_time: { $ref: '#/components/schemas/last_modified_time' },
			reference_id: { $ref: '#/components/schemas/reference_id' },
			notes: { $ref: '#/components/schemas/notes' },
			terms: { $ref: '#/components/schemas/terms' },
			attachment_name: { $ref: '#/components/schemas/attachment_name' },
			open_purchaseorders_count: {
				$ref: '#/components/schemas/open_purchaseorders_count',
			},
			einvoice_status: { $ref: '#/components/schemas/einvoice_status' },
			is_peppol_supported: { $ref: '#/components/schemas/is_peppol_supported' },
			source: { $ref: '#/components/schemas/source' },
		},
	},
	bill_id: { description: 'ID of the Bill', type: 'string' },
	bill_number: {
		description:
			'Unique sequential identifier for the bill. Used for tracking and reference purposes. Format varies by organization settings. Can be auto-generated or manually entered. Must be unique within the organization.',
		type: 'string',
	},
	bill_payment_id: { description: 'ID of the Bill Payment', type: 'string' },
	bill_payments: {
		description: 'List of payments applied to the bill.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				payment_id: { $ref: '#/components/schemas/payment_id' },
				amount_applied: { $ref: '#/components/schemas/amount_applied' },
			},
		},
	},
	billing_address: {
		type: 'object',
		properties: {
			address: { $ref: '#/components/schemas/address' },
			street2: { $ref: '#/components/schemas/street2' },
			city: { $ref: '#/components/schemas/city' },
			state: { $ref: '#/components/schemas/state' },
			zip: { $ref: '#/components/schemas/zip' },
			country: { $ref: '#/components/schemas/country' },
			fax: { $ref: '#/components/schemas/fax' },
			attention: { $ref: '#/components/schemas/attention' },
		},
	},
	check_details: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				check_status: { $ref: '#/components/schemas/check_status' },
				check_number: { $ref: '#/components/schemas/check_number' },
			},
		},
		'x-node_available_in': ['us', 'ca'],
		'x-node_unavailable_in': [],
	},
	check_number: {
		description: 'Check Number that is printed',
		type: 'string',
		'x-node_available_in': ['us', 'ca'],
		'x-node_unavailable_in': [],
	},
	check_status: {
		description: 'Status of the Check',
		type: 'string',
		'x-node_available_in': ['us', 'ca'],
		'x-node_unavailable_in': [],
	},
	city: { description: 'City in the Address', type: 'string' },
	comment: {
		type: 'object',
		properties: {
			comment_id: { $ref: '#/components/schemas/comment_id' },
			bill_id: { $ref: '#/components/schemas/bill_id' },
			description: { $ref: '#/components/schemas/description' },
			commented_by_id: { $ref: '#/components/schemas/commented_by_id' },
			commented_by: { $ref: '#/components/schemas/commented_by' },
			comment_type: { $ref: '#/components/schemas/comment_type' },
			date: { $ref: '#/components/schemas/date' },
			date_description: { $ref: '#/components/schemas/date_description' },
			time: { $ref: '#/components/schemas/time' },
		},
	},
	comment_id: { description: 'ID of the Comment', type: 'string' },
	comment_type: { description: 'Type of Comment', type: 'string' },
	commented_by: {
		description: 'Name of the User who Caused the Comment',
		type: 'string',
	},
	commented_by_id: {
		description: 'ID of the User who caused the Comment',
		type: 'string',
	},
	'convert-po-to-bill-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			purchaseorder_ids: { $ref: '#/components/schemas/purchaseorder_ids' },
			bill: { $ref: '#/components/schemas/bill' },
		},
	},
	country: { description: 'Country Involved in the Address', type: 'string' },
	'create-a-bill-request': {
		required: ['vendor_id', 'bill_number'],
		type: 'object',
		properties: {
			vendor_id: { $ref: '#/components/schemas/vendor_id' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			is_update_customer: { $ref: '#/components/schemas/is_update_customer' },
			purchaseorder_ids: { $ref: '#/components/schemas/purchaseorder_ids' },
			bill_number: { $ref: '#/components/schemas/bill_number' },
			entity_type: { $ref: '#/components/schemas/entity_type' },
			documents: { $ref: '#/components/schemas/documents' },
			source_of_supply: { $ref: '#/components/schemas/source_of_supply' },
			destination_of_supply: {
				$ref: '#/components/schemas/destination_of_supply',
			},
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			permit_number: { $ref: '#/components/schemas/permit_number' },
			gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			is_reverse_charge_applied: {
				$ref: '#/components/schemas/is_reverse_charge_applied',
			},
			gst_no: { $ref: '#/components/schemas/gst_no' },
			tax_reg_no: { $ref: '#/components/schemas/tax_reg_no' },
			registration_details: {
				$ref: '#/components/schemas/registration_details',
			},
			pricebook_id: { $ref: '#/components/schemas/pricebook_id' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			date: { $ref: '#/components/schemas/date' },
			due_date: { $ref: '#/components/schemas/due_date' },
			payment_terms: { $ref: '#/components/schemas/payment_terms' },
			payment_terms_label: { $ref: '#/components/schemas/payment_terms_label' },
			bank_account_id: { $ref: '#/components/schemas/bank_account_id' },
			recurring_bill_id: { $ref: '#/components/schemas/recurring_bill_id' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			is_item_level_tax_calc: {
				$ref: '#/components/schemas/is_item_level_tax_calc',
			},
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			adjustment: { $ref: '#/components/schemas/adjustment' },
			adjustment_description: {
				$ref: '#/components/schemas/adjustment_description',
			},
			discount_code: { $ref: '#/components/schemas/discount_code' },
			location_id: { $ref: '#/components/schemas/location_id' },
			custom_fields: {
				type: 'array',
				description: 'List of custom fields for the bill.',
				items: {
					type: 'object',
					properties: {
						index: { $ref: '#/components/schemas/index' },
						value: { $ref: '#/components/schemas/value' },
					},
				},
			},
			tags: { $ref: '#/components/schemas/tags' },
			line_items: {
				description: 'Line items of a bill.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						purchaseorder_item_id: {
							$ref: '#/components/schemas/purchaseorder_item_id',
						},
						line_item_id: { $ref: '#/components/schemas/line_item_id' },
						item_id: { $ref: '#/components/schemas/item_id' },
						name: { $ref: '#/components/schemas/name' },
						account_id: { $ref: '#/components/schemas/account_id' },
						description: { $ref: '#/components/schemas/description' },
						rate: { $ref: '#/components/schemas/rate' },
						hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
						unitkey_code: { $ref: '#/components/schemas/unitkey_code' },
						discount_code: { $ref: '#/components/schemas/discount_code' },
						reverse_charge_tax_id: {
							$ref: '#/components/schemas/reverse_charge_tax_id',
						},
						location_id: { $ref: '#/components/schemas/location_id' },
						quantity: { $ref: '#/components/schemas/quantity' },
						tax_id: { $ref: '#/components/schemas/tax_id' },
						tds_tax_id: { $ref: '#/components/schemas/tds_tax_id' },
						tax_treatment_code: {
							$ref: '#/components/schemas/tax_treatment_code',
						},
						tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
						tax_exemption_code: {
							$ref: '#/components/schemas/tax_exemption_code',
						},
						item_order: { $ref: '#/components/schemas/item_order' },
						product_type: { $ref: '#/components/schemas/product_type' },
						acquisition_vat_id: {
							$ref: '#/components/schemas/acquisition_vat_id',
						},
						reverse_charge_vat_id: {
							$ref: '#/components/schemas/reverse_charge_vat_id',
						},
						unit: { $ref: '#/components/schemas/unit' },
						tags: { $ref: '#/components/schemas/tags' },
						line_item_category: {
							$ref: '#/components/schemas/line_item_category',
						},
						is_billable: { $ref: '#/components/schemas/is_billable' },
						project_id: { $ref: '#/components/schemas/project_id' },
						customer_id: { $ref: '#/components/schemas/customer_id' },
						item_custom_fields: {
							$ref: '#/components/schemas/item_custom_fields',
						},
						serial_numbers: { $ref: '#/components/schemas/serial_numbers' },
					},
				},
			},
			taxes: {
				type: 'array',
				description: 'List of taxes applied to the bill.',
				items: {
					type: 'object',
					properties: {
						tax_id: { $ref: '#/components/schemas/tax_id' },
						tax_name: { $ref: '#/components/schemas/tax_name' },
						tax_amount: { $ref: '#/components/schemas/tax_amount' },
					},
				},
			},
			notes: { $ref: '#/components/schemas/notes' },
			terms: { $ref: '#/components/schemas/terms' },
			approvers: { $ref: '#/components/schemas/approvers' },
		},
	},
	'create-a-bill-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			bill: { $ref: '#/components/schemas/bill' },
		},
	},
	created_by_id: {
		description: 'Name of User who created the Bill',
		type: 'string',
	},
	created_time: { description: 'Created time of the bill', type: 'string' },
	currency_code: { description: 'Code of the Currency', type: 'string' },
	currency_id: {
		description:
			'Unique identifier for the currency used in the bill transaction. Can be fetched from the Currencies API if multi-currency is enabled.',
		type: 'string',
	},
	currency_symbol: { description: 'Symbol of the Currency', type: 'string' },
	custom_field_id: {
		description: 'ID of the custom field.',
		type: 'string',
		format: 'int64',
	},
	custom_fields: {
		description: 'List of custom fields for the bill.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				custom_field_id: { $ref: '#/components/schemas/custom_field_id' },
				value: { $ref: '#/components/schemas/value' },
			},
		},
	},
	customer_id: { description: 'ID of the Customer', type: 'string' },
	customer_name: { description: 'Name of the Customer', type: 'string' },
	date: {
		description:
			'Date when the bill was issued by the vendor. Format: yyyy-mm-dd. Used for payment terms and aging calculations. This date determines when payment terms begin and affects aging reports, late payment calculations, and financial reporting.',
		type: 'string',
	},
	date_description: {
		description: 'Description of the Date of Comment',
		type: 'string',
	},
	'delete-a-bill-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-a-comment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-a-payment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-an-attachment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	description: {
		description:
			'Detailed description of the line item. Provides additional context about the product, service, or expense. Used for vendor communication, internal documentation, and expense justification. Can include specifications, requirements, or special instructions.',
		type: 'string',
	},
	destination_of_supply: {
		description:
			'State code where goods/services are delivered. Used for GST calculations in India. Defaults to organization home state if not specified. Supports 2-letter state codes (e.g., AP for Andhra Pradesh, TN for Tamil Nadu).',
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	discount_code: {
		description:
			'Discount reason code for the entity-level discount. Used for UAE E-Invoicing. Maximum length: 200 characters.',
		type: 'string',
		maxLength: 200,
		'x-node_available_in': ['uae'],
		'x-node_unavailable_in': [],
	},
	document_id: {
		description: 'ID of the Document',
		type: 'string',
		format: 'int64',
	},
	documents: {
		description: 'List of documents attached to the bill.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				document_id: { $ref: '#/components/schemas/document_id' },
				file_name: { $ref: '#/components/schemas/file_name' },
			},
		},
	},
	due_by_days: { description: 'Days by which Bill is Due', type: 'string' },
	due_date: {
		description:
			'Date when payment is due for the bill. Used for payment tracking, aging reports, and overdue calculations. Calculated based on bill date and payment terms. Bills become overdue after this date, affecting vendor relationships and cash flow planning.',
		type: 'string',
	},
	due_days: { type: 'string' },
	due_in_days: {
		description: 'Days in which Bill will be Due',
		type: 'integer',
	},
	einvoice_status: {
		description:
			'E-invoice status of the bill. Peppol-pulled bills use <code>einvoice_received</code>.',
		type: 'string',
		readOnly: true,
		'x-node_available_in': ['uae'],
		'x-node_unavailable_in': [],
	},
	entity_type: {
		description:
			'Type of the bill entity. Allowed values: <code>bill</code>, <code>self_billed_invoice</code>.',
		type: 'string',
	},
	exchange_rate: {
		description:
			'Exchange rate from bill currency to organization base currency. Used for multi-currency transactions. 1.0 indicates same as base currency. Required when currency differs from organization default. Affects financial reporting, profit/loss calculations, and tax computations. Can be manually set or auto-fetched from currency exchange services.',
		type: 'number',
		format: 'double',
	},
	fax: { description: 'Fax of the Vendor', type: 'string' },
	file_name: { description: 'Name of the file', type: 'string' },
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
	'get-a-bill-attachment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-a-bill-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			bill: { $ref: '#/components/schemas/bill' },
		},
	},
	gst_no: {
		description: '15 digit GST identification number of the vendor.',
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	gst_treatment: {
		description:
			'Choose whether the contact is GST registered/unregistered/consumer/overseas. Allowed values are <code> business_gst </code> , <code> business_none </code> , <code> overseas </code> , <code> consumer </code>.',
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	has_attachment: {
		description: 'Check if Bill hase Attachment',
		type: 'boolean',
	},
	has_more_page: { type: 'boolean' },
	hsn_or_sac: {
		description: 'Add HSN/SAC code for your goods/services',
		type: 'string',
		'x-node_available_in': ['in', 'ke', 'za', 'uae'],
		'x-node_unavailable_in': [],
	},
	image_document_id: {
		description: 'ID of the image document',
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	index: { description: 'Index of the custom field', type: 'integer' },
	invoice_id: { description: 'ID of the Invoice', type: 'string' },
	invoice_number: {
		description: 'Number associated with the Invoice',
		type: 'string',
	},
	is_abn_quoted: {
		type: 'string',
		'x-node_available_in': ['au'],
		'x-node_unavailable_in': [],
	},
	is_ach_payment: {
		description: 'Check If Vendor Payment ACH',
		type: 'boolean',
	},
	is_billable: {
		description:
			'Boolean flag indicating whether the line item or entity can be billed to customers or clients. Determines if costs are recoverable through customer billing, affects project profitability calculations, and controls expense allocation for client projects and service delivery.',
		type: 'boolean',
	},
	is_inclusive_tax: {
		description:
			'Flag indicating whether line item rates include tax amounts. When true, tax is calculated on top of displayed rates. When false, tax is added separately. Affects total calculations and tax reporting. Common in countries where tax-inclusive pricing is standard. Impacts customer-facing documents and tax return preparation.',
		type: 'boolean',
		'x-node_unavailable_in': ['us'],
	},
	is_item_level_tax_calc: {
		description:
			'Flag indicating whether taxes are calculated at individual line item level rather than bill total. Enables different tax rates for different items. Provides more accurate tax calculations for mixed tax scenarios. When enabled, each line item can have different tax rates based on item type, location, or tax rules. Improves tax compliance and reporting accuracy.',
		type: 'boolean',
	},
	is_line_item_invoiced: {
		description: 'Check if line item is invoiced',
		type: 'boolean',
	},
	is_paid_via_print_check: {
		description: 'Check if the Bill Payment is paid Via Print Check Option',
		type: 'boolean',
		'x-node_available_in': ['us', 'ca'],
		'x-node_unavailable_in': [],
	},
	is_peppol_supported: {
		description:
			'Indicates whether the vendor supports receiving bills over the E-Invoicing network.',
		type: 'boolean',
		readOnly: true,
		'x-node_available_in': ['uae'],
		'x-node_unavailable_in': [],
	},
	is_pre_gst: {
		description: 'Applicable for transactions that fall before july 1, 2017',
		type: 'boolean',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	is_reverse_charge_applied: {
		description: 'Applicable for transactions where you pay reverse charge',
		type: 'boolean',
		'x-node_available_in': ['in', 'gcc'],
		'x-node_unavailable_in': [],
	},
	is_single_bill_payment: {
		description: 'Check if it is a Single Bill Payment',
		type: 'boolean',
	},
	is_tag_mandatory: {
		description: 'Used to check if the tag is mandatory',
		type: 'boolean',
	},
	is_tds_applied: {
		description: 'Check if TDS is applied',
		type: 'boolean',
		'x-node_available_in': ['in', 'global', 'au'],
		'x-node_unavailable_in': [],
	},
	is_update_customer: {
		description:
			'Flag to determine if customer information should be updated when creating the bill.',
		type: 'boolean',
	},
	item_custom_fields: {
		description: 'List of custom fields for the line item.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				custom_field_id: { $ref: '#/components/schemas/custom_field_id' },
				value: { $ref: '#/components/schemas/value' },
			},
		},
	},
	item_id: {
		description:
			'Unique identifier for the product or service item. Can be fetched from the Items API. When specified, automatically populates item details like name, description, and default rates. Required for inventory tracking and item-based reporting.',
		type: 'string',
	},
	item_order: {
		description: 'Order of the line item in the bill.',
		type: 'integer',
	},
	item_total: {
		description:
			'Calculated total for the line item (quantity x rate + taxes - discounts). Auto-calculated based on line item details. Used for bill totals, financial reporting, and payment processing. Cannot be manually edited.',
		type: 'integer',
	},
	item_total_inclusive_of_tax: {
		description: 'Total of the Item Inclusive of Tax',
		type: 'number',
		format: 'double',
	},
	last_modified_time: {
		description: 'Last Modified Time of the Bill',
		type: 'string',
	},
	line_item_category: {
		description:
			'Category of the line item. Allowed values are <code>line_item</code>, <code>header</code> and <code>subtotal</code>. Use <code>line_item</code> for regular line items, <code>header</code> for header titles and <code>subtotal</code> for intermediate subtotal rows. For regular line items, you can send line_item or omit this field',
		type: 'string',
	},
	line_item_id: {
		description:
			'Unique identifier for this specific line item within the bill. Auto-generated when line item is created. Used for updating, deleting, or referencing specific line items in API operations.',
		type: 'string',
	},
	line_items: {
		description:
			'Individual items, services, or expenses included in the bill. Each line item represents a specific product, service, or expense with its own quantity, rate, and tax calculations. Required for detailed billing, inventory tracking, and expense categorization.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				purchaseorder_item_id: {
					$ref: '#/components/schemas/purchaseorder_item_id',
				},
				line_item_id: { $ref: '#/components/schemas/line_item_id' },
				item_id: { $ref: '#/components/schemas/item_id' },
				sku: { $ref: '#/components/schemas/sku' },
				name: { $ref: '#/components/schemas/name' },
				account_id: { $ref: '#/components/schemas/account_id' },
				account_name: { $ref: '#/components/schemas/account_name' },
				image_document_id: { $ref: '#/components/schemas/image_document_id' },
				location_id: { $ref: '#/components/schemas/location_id' },
				location_name: { $ref: '#/components/schemas/location_name' },
				reverse_charge_tax_id: {
					$ref: '#/components/schemas/reverse_charge_tax_id',
				},
				reverse_charge_tax_name: {
					$ref: '#/components/schemas/reverse_charge_tax_name',
				},
				reverse_charge_tax_percentage: {
					$ref: '#/components/schemas/reverse_charge_tax_percentage',
				},
				reverse_charge_tax_amount: {
					$ref: '#/components/schemas/reverse_charge_tax_amount',
				},
				description: { $ref: '#/components/schemas/description' },
				bcy_rate: { $ref: '#/components/schemas/bcy_rate' },
				rate: { $ref: '#/components/schemas/rate' },
				tags: { $ref: '#/components/schemas/tags' },
				line_item_category: { $ref: '#/components/schemas/line_item_category' },
				quantity: { $ref: '#/components/schemas/quantity' },
				tax_id: { $ref: '#/components/schemas/tax_id' },
				tds_tax_id: { $ref: '#/components/schemas/tds_tax_id' },
				tax_treatment_code: { $ref: '#/components/schemas/tax_treatment_code' },
				tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
				tax_exemption_code: { $ref: '#/components/schemas/tax_exemption_code' },
				tax_name: { $ref: '#/components/schemas/tax_name' },
				tax_type: { $ref: '#/components/schemas/tax_type' },
				tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
				item_total: { $ref: '#/components/schemas/item_total' },
				item_total_inclusive_of_tax: {
					$ref: '#/components/schemas/item_total_inclusive_of_tax',
				},
				item_order: { $ref: '#/components/schemas/item_order' },
				unit: { $ref: '#/components/schemas/unit' },
				product_type: { $ref: '#/components/schemas/product_type' },
				hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
				unitkey_code: { $ref: '#/components/schemas/unitkey_code' },
				discount_code: { $ref: '#/components/schemas/discount_code' },
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
				is_billable: { $ref: '#/components/schemas/is_billable' },
				customer_id: { $ref: '#/components/schemas/customer_id' },
				customer_name: { $ref: '#/components/schemas/customer_name' },
				project_id: { $ref: '#/components/schemas/project_id' },
				project_name: { $ref: '#/components/schemas/project_name' },
				invoice_id: { $ref: '#/components/schemas/invoice_id' },
				invoice_number: { $ref: '#/components/schemas/invoice_number' },
				item_custom_fields: { $ref: '#/components/schemas/item_custom_fields' },
			},
		},
	},
	'list-bill-comments-and-history-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			comments: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						comment_id: { $ref: '#/components/schemas/comment_id' },
						bill_id: { $ref: '#/components/schemas/bill_id' },
						description: { $ref: '#/components/schemas/description' },
						commented_by_id: { $ref: '#/components/schemas/commented_by_id' },
						commented_by: { $ref: '#/components/schemas/commented_by' },
						comment_type: { $ref: '#/components/schemas/comment_type' },
						date: { description: 'Date of the Comment', type: 'string' },
						date_description: { $ref: '#/components/schemas/date_description' },
						time: { $ref: '#/components/schemas/time' },
						operation_type: { $ref: '#/components/schemas/operation_type' },
						transaction_id: { $ref: '#/components/schemas/transaction_id' },
						transaction_type: { $ref: '#/components/schemas/transaction_type' },
					},
				},
			},
		},
	},
	'list-bill-payments-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			payments: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						payment_id: { $ref: '#/components/schemas/payment_id' },
						bill_id: { $ref: '#/components/schemas/bill_id' },
						bill_payment_id: { $ref: '#/components/schemas/bill_payment_id' },
						vendor_id: { $ref: '#/components/schemas/vendor_id' },
						vendor_name: { $ref: '#/components/schemas/vendor_name' },
						payment_mode: { $ref: '#/components/schemas/payment_mode' },
						description: { $ref: '#/components/schemas/description' },
						date: { $ref: '#/components/schemas/date' },
						reference_number: { $ref: '#/components/schemas/reference_number' },
						exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
						amount: { $ref: '#/components/schemas/amount' },
						paid_through: { $ref: '#/components/schemas/paid_through' },
						is_single_bill_payment: {
							$ref: '#/components/schemas/is_single_bill_payment',
						},
					},
				},
			},
		},
	},
	'list-bills-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			bills: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						bill_id: { $ref: '#/components/schemas/bill_id' },
						vendor_id: { $ref: '#/components/schemas/vendor_id' },
						vendor_name: { $ref: '#/components/schemas/vendor_name' },
						status: { $ref: '#/components/schemas/status' },
						bill_number: { $ref: '#/components/schemas/bill_number' },
						reference_number: { $ref: '#/components/schemas/reference_number' },
						date: { $ref: '#/components/schemas/date' },
						due_date: { $ref: '#/components/schemas/due_date' },
						due_days: { $ref: '#/components/schemas/due_days' },
						currency_id: { $ref: '#/components/schemas/currency_id' },
						currency_code: { $ref: '#/components/schemas/currency_code' },
						price_precision: { $ref: '#/components/schemas/price_precision' },
						exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
						total: { $ref: '#/components/schemas/total' },
						balance: { $ref: '#/components/schemas/balance' },
						location_id: { $ref: '#/components/schemas/location_id' },
						location_name: { $ref: '#/components/schemas/location_name' },
						created_time: { $ref: '#/components/schemas/created_time' },
						last_modified_time: {
							$ref: '#/components/schemas/last_modified_time',
						},
						attachment_name: { $ref: '#/components/schemas/attachment_name' },
						has_attachment: { $ref: '#/components/schemas/has_attachment' },
						is_tds_applied: { $ref: '#/components/schemas/is_tds_applied' },
						is_abn_quoted: { $ref: '#/components/schemas/is_abn_quoted' },
						einvoice_status: { $ref: '#/components/schemas/einvoice_status' },
						is_peppol_supported: {
							$ref: '#/components/schemas/is_peppol_supported',
						},
						source: { $ref: '#/components/schemas/source' },
					},
				},
			},
			page_context: { $ref: '#/components/schemas/page_context' },
		},
	},
	location_id: {
		description:
			'Unique identifier for the business location where the bill transaction occurs. Used for multi-location organizations to track expenses by location. Affects reporting and tax calculations based on location-specific rules. Can be fetched from the Locations API. Required for organizations with multiple locations. Influences tax rates, reporting structures, and approval workflows based on location-specific configurations.',
		type: 'string',
	},
	location_name: { description: 'Name of the location', type: 'string' },
	'mark-a-bill-as-open-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	name: {
		description:
			'Name or description of the line item. Can be manually entered or auto-populated from item details. Should clearly describe the product, service, or expense for vendor and accounting purposes.',
		type: 'string',
	},
	notes: {
		description:
			'Additional information or comments about the bill. Used for internal communication, vendor instructions, or special handling requirements. Visible to vendors and included in bill communications. Useful for tracking special arrangements or payment instructions.',
		type: 'string',
	},
	open_purchaseorders_count: {
		description: 'Number of Open Purchase Orders',
		type: 'integer',
	},
	operation_type: {
		description: 'Type of Operation that Caused the Comment',
		type: 'string',
	},
	order: { description: 'Order of the Approver', type: 'integer' },
	page: { type: 'integer' },
	page_context: {
		type: 'object',
		properties: {
			page: { $ref: '#/components/schemas/page' },
			per_page: { $ref: '#/components/schemas/per_page' },
			has_more_page: { $ref: '#/components/schemas/has_more_page' },
			report_name: { $ref: '#/components/schemas/report_name' },
			applied_filter: { $ref: '#/components/schemas/applied_filter' },
			sort_column: { $ref: '#/components/schemas/sort_column' },
			sort_order: { $ref: '#/components/schemas/sort_order' },
		},
	},
	paid_through: {
		description: 'Account through which Bill is paid',
		type: 'string',
	},
	paid_through_account_id: {
		description: 'ID of the Account through which Bill is Paid',
		type: 'string',
	},
	paid_through_account_name: {
		description: 'Name of the Account through which Bill is Paid',
		type: 'string',
	},
	payment_expected_date: {
		description: 'Expected Payment date of the Bill',
		type: 'string',
	},
	payment_id: { description: 'ID of the Payment', type: 'string' },
	payment_made: { description: 'Amount of Payment made', type: 'integer' },
	payment_mode: { description: 'Mode of Payment', type: 'string' },
	payment_number: { description: 'Number of the Payment Made', type: 'string' },
	payment_terms: {
		description:
			'Numeric identifier for payment terms configuration. Defines when payment is due relative to bill date. 0 = Due on Receipt, positive numbers = days after bill date, negative numbers = days before bill date. Common values: 0 (Due on Receipt), 15 (Net 15), 30 (Net 30), 45 (Net 45). Affects due date calculation and aging reports.',
		type: 'integer',
	},
	payment_terms_label: {
		description: 'Label of the Payment Terms',
		type: 'string',
	},
	payments: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				payment_id: { $ref: '#/components/schemas/payment_id' },
				bill_id: { $ref: '#/components/schemas/bill_id' },
				bill_payment_id: { $ref: '#/components/schemas/bill_payment_id' },
				payment_mode: { $ref: '#/components/schemas/payment_mode' },
				payment_number: { $ref: '#/components/schemas/payment_number' },
				description: { $ref: '#/components/schemas/description' },
				date: { $ref: '#/components/schemas/date' },
				reference_number: { $ref: '#/components/schemas/reference_number' },
				exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
				amount: { $ref: '#/components/schemas/amount' },
				paid_through_account_id: {
					$ref: '#/components/schemas/paid_through_account_id',
				},
				paid_through_account_name: {
					$ref: '#/components/schemas/paid_through_account_name',
				},
				is_single_bill_payment: {
					$ref: '#/components/schemas/is_single_bill_payment',
				},
				is_paid_via_print_check: {
					$ref: '#/components/schemas/is_paid_via_print_check',
				},
				check_details: { $ref: '#/components/schemas/check_details' },
				is_ach_payment: { $ref: '#/components/schemas/is_ach_payment' },
				ach_payment_status: { $ref: '#/components/schemas/ach_payment_status' },
				ach_gw_transaction_id: {
					$ref: '#/components/schemas/ach_gw_transaction_id',
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
			},
		},
	},
	per_page: { type: 'integer' },
	permit_number: {
		description: 'The permit number for the bill.',
		type: 'string',
		'x-node_available_in': ['uae'],
		'x-node_unavailable_in': [],
	},
	place_of_supply: {
		description:
			'The place of supply is where a transaction is considered to have occurred for VAT purposes. For the supply of goods, the place of supply is the location of the goods when the supply occurs. For the supply of services, the place of supply should be where the supplier is established. (If not given, <code>place of contact</code> given for the contact will be taken)<br/>Supported codes for UAE emirates are : </br>Abu Dhabi - <code>AB</code>,</br>Ajman - <code>AJ</code>,</br>Dubai - <code>DU</code>,</br>Fujairah - <code>FU</code>,</br>Ras al-Khaimah - <code>RA</code>,</br>Sharjah - <code>SH</code>,</br>Umm al-Quwain - <code>UM</code>.<br/>Supported codes for the GCC countries are : </br>United Arab Emirates - <code>AE</code>,</br>Saudi Arabia - <code>SA</code>,</br>Bahrain - <code>BH</code>,</br>Kuwait - <code>KW</code>,</br>Oman - <code>OM</code>,</br>Qatar - <code>QA</code>.',
		type: 'string',
		'x-node_available_in': ['gcc'],
		'x-node_unavailable_in': [],
	},
	price_precision: { description: 'Precision for the values', type: 'integer' },
	pricebook_id: {
		description:
			'Identifier for the price book containing item rates and pricing rules. Used to apply standardized pricing across bills. If not specified, default pricing from items will be used. Helps maintain consistent pricing across multiple transactions.',
		type: 'string',
	},
	pricebook_name: { description: 'Name of the price book', type: 'string' },
	product_type: {
		description:
			'Type of the bill. This denotes whether the bill line item is to be treated as a goods or service purchase. This only need to be specified in case purchase order is not enabled. Allowed Values: <code>digital_service</code>, <code>goods</code> and <code>service</code>.',
		type: 'string',
		'x-node_available_in': ['eu', 'uk', 'uae'],
		'x-node_unavailable_in': [],
	},
	project_id: { description: 'ID of the Project', type: 'string' },
	project_name: { description: 'Name of the Project', type: 'string' },
	purchaseorder_date: {
		description: 'Date of the Purchase Order',
		type: 'string',
	},
	purchaseorder_id: { description: 'ID of the Purchase Order', type: 'string' },
	purchaseorder_ids: {
		description:
			'Array of purchase order identifiers linked to this bill for tracking purposes.',
		type: 'array',
		items: { type: 'string' },
	},
	purchaseorder_item_id: {
		description:
			'Unique identifier linking this line item to a specific item in the purchase order. Used for tracking PO-to-bill conversions and maintaining audit trails. Required when converting purchase orders to bills.',
		type: 'string',
	},
	purchaseorder_number: {
		description: 'Number of the Purchase Order',
		type: 'string',
	},
	purchaseorder_status: {
		description: 'Status of the Purchase Order',
		type: 'string',
	},
	purchaseorders: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				purchaseorder_id: { $ref: '#/components/schemas/purchaseorder_id' },
				purchaseorder_number: {
					$ref: '#/components/schemas/purchaseorder_number',
				},
				purchaseorder_date: { $ref: '#/components/schemas/purchaseorder_date' },
				purchaseorder_status: {
					$ref: '#/components/schemas/purchaseorder_status',
				},
			},
		},
	},
	quantity: {
		description:
			'Number of units for the line item. Used to calculate line item totals (quantity x rate). Supports decimal quantities for items sold by weight, length, or other non-whole units. Required for accurate billing and inventory tracking.',
		type: 'number',
		format: 'double',
	},
	rate: {
		description:
			'Unit price or rate for the line item. Can be manually entered or auto-populated from item details or price books. Used to calculate line item totals. Supports decimal precision based on currency settings.',
		type: 'number',
		format: 'double',
	},
	recurring_bill_id: {
		description:
			'Identifier linking this bill to a recurring bill template. Used for bills that are automatically generated on a schedule (weekly, monthly, quarterly, etc.). Enables automated bill generation, consistent billing cycles, and reduces manual data entry. Can be modified to change recurring schedule.',
		type: 'string',
	},
	reference_id: { type: 'string' },
	reference_number: {
		description:
			'External reference number from vendor invoice or purchase order. Used for cross-referencing with vendor documents. Helps in reconciliation and tracking payments. Can include invoice numbers, PO references, or any vendor-specific identifiers.',
		type: 'string',
	},
	registration_details: {
		description:
			'Registration details of the vendor. Includes buyer identification, tax registration, and legal information used for E-Invoicing.',
		type: 'object',
		properties: {
			company_registration_no: {
				description:
					'Company registration number (Commercial Registration number). Maximum length: 200 characters.',
				type: 'string',
				maxLength: 200,
			},
			einvoice_identifier_label: {
				description:
					'Label for the buyer identifier used in E-Invoicing (Buyer ID label). Allowed values: <code>TL</code>, <code>EID</code>, <code>PAS</code>, <code>CD</code>. Maximum length: 200 characters.',
				type: 'string',
				maxLength: 200,
			},
			einvoice_identifier_value: {
				description:
					'Value of the buyer identifier used in E-Invoicing (Buyer ID value). Maximum length: 200 characters.',
				type: 'string',
				maxLength: 200,
			},
			additionalfield1: {
				description:
					'Authority or scheme that issued the buyer identifier (Buyer ID authority, for sample Department of Economy and Tourism). Maximum length: 200 characters.',
				type: 'string',
				maxLength: 200,
			},
			legal_name: {
				description: 'Legal registered name of the vendor.',
				type: 'string',
				maxLength: 500,
			},
			electronic_address_value: {
				description:
					'Electronic address (Peppol ID or similar) of the vendor used for E-Invoicing routing. Maximum length: 200 characters.',
				type: 'string',
				maxLength: 200,
			},
		},
		'x-node_available_in': ['uae'],
		'x-node_unavailable_in': [],
	},
	report_name: { description: 'Name of the report', type: 'string' },
	reverse_charge_tax_amount: {
		description: 'Enter reverse charge amount',
		type: 'number',
		format: 'double',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	reverse_charge_tax_id: {
		description: 'Reverse charge tax ID',
		type: 'string',
		'x-node_available_in': ['in', 'gcc', 'za'],
		'x-node_unavailable_in': [],
	},
	reverse_charge_tax_name: {
		description: 'Name of the reverse charge tax',
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	reverse_charge_tax_percentage: {
		description: 'Enter reverse charge percentage',
		type: 'number',
		format: 'double',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	reverse_charge_vat_amount: {
		description: 'Percentage of the Reverse Charge',
		type: 'string',
		'x-node_available_in': ['uk', 'eu'],
		'x-node_unavailable_in': [],
	},
	reverse_charge_vat_id: {
		description:
			'(Optional) This is the ID of the tax applied in case this is a non UK - service purchase and reverse charge VAT needs to be reported.',
		type: 'string',
		'x-node_available_in': ['uk'],
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
	reverse_charge_vat_summary: {
		description: 'Summary of the Reverse Charge',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				tax_name: { $ref: '#/components/schemas/tax_name' },
				tax_amount: { $ref: '#/components/schemas/tax_amount' },
			},
		},
		'x-node_available_in': ['uk', 'eu'],
		'x-node_unavailable_in': [],
	},
	reverse_charge_vat_total: {
		description: 'Total of the Reverse Charge',
		type: 'number',
		format: 'double',
		'x-node_available_in': ['uk', 'eu'],
		'x-node_unavailable_in': [],
	},
	serial_numbers: {
		description: 'List of serial numbers associated with the line item.',
		type: 'array',
		items: { type: 'string' },
	},
	sku: {
		description:
			'Stock Keeping Unit identifier for the item. Used for inventory management, product identification, and vendor communications. Auto-populated when item_id is specified. Helps track specific product variants and manage stock levels.',
		type: 'string',
	},
	sort_column: {
		description:
			'Sort bills. Allowed Values: <code>vendor_name</code>, <code>bill_number</code>, <code>date</code>, <code>due_date</code>, <code>total</code>, <code>balance</code> and <code>created_time</code>.',
		type: 'string',
	},
	sort_order: { type: 'string' },
	source: {
		description:
			'Source of the bill. Indicates how the bill was created or received. <code>e-invoice</code> indicates the bill was pulled via Peppol. Allowed values: <code>Api</code> and <code>e-invoice</code>.',
		type: 'string',
		readOnly: true,
		'x-node_available_in': ['uae'],
		'x-node_unavailable_in': [],
	},
	source_of_supply: {
		description:
			'State code where goods/services originate. Used for GST calculations in India. Defaults to vendor contact location if not specified. Supports 2-letter state codes (e.g., AP for Andhra Pradesh, TN for Tamil Nadu).',
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	state: { description: 'State involved in the Address', type: 'string' },
	status: { description: 'Status of the Bill', type: 'string' },
	street2: { description: 'Address details', type: 'string' },
	sub_total: { description: 'Sub Total of the Bill', type: 'integer' },
	'submit-a-bill-for-approval-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
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
	tax_amount: { description: 'Amount of Tax in the Bill', type: 'string' },
	tax_exemption_code: {
		description: 'Code of the Tax Exemption Applied',
		type: 'string',
		'x-node_available_in': ['in', 'au', 'ca', 'mx'],
		'x-node_unavailable_in': [],
	},
	tax_exemption_id: {
		description: 'ID of the Tax Exemption Applied',
		type: 'string',
		'x-node_available_in': ['in', 'au', 'ca'],
		'x-node_unavailable_in': [],
	},
	tax_id: {
		description:
			'Unique identifier for the tax or tax group applied to this line item. Can be fetched from the Taxes API. Determines tax rate and calculations for the line item. Required when tax calculations are enabled. Affects final line item total and tax reporting.',
		type: 'string',
		'x-node_available_in': [],
		'x-node_unavailable_in': ['us'],
	},
	tax_name: { description: 'Name of the Tax', type: 'string' },
	tax_percentage: { description: 'Percentage of Tax', type: 'integer' },
	tax_reg_no: {
		description: 'Tax Registration Number (TRN) of the vendor.',
		type: 'string',
		'x-node_available_in': ['gcc'],
		'x-node_unavailable_in': [],
	},
	tax_total: { description: 'Tax Total of the Bill', type: 'integer' },
	tax_treatment: {
		description:
			'VAT treatment for the bill. Choose whether the vendor falls under: <code>vat_registered</code>,<code>vat_not_registered</code>,<code>gcc_vat_not_registered</code>,<code>gcc_vat_registered</code>,<code>non_gcc</code>.</br><b>For UAE Edition:</b> also <code>dz_vat_registered</code>, <code>dz_vat_not_registered</code>, <code>out_of_scope</code>, <code>gcc_non_vat</code>, <code>fz_vat_registered</code>, and <code>fz_vat_not_registered</code>.</br><code>home_country_mexico</code>,<code>border_region_mexico</code>,<code>non_mexico</code> supported only for <b>MX</b>.<br/><b>For Kenya Edition:</b> <code>vat_registered</code> ,<code>vat_not_registered</code> ,<code>non_kenya</code>(A business that is located outside Kenya).<br/><b>For SouthAfrica Edition:</b> <code>vat_registered</code>, <code>vat_not_registered</code>, <code>overseas</code>(A business that is located outside SouthAfrica).',
		type: 'string',
		'x-node_available_in': ['gcc', 'mx', 'ke', 'za', 'uae'],
		'x-node_unavailable_in': [],
	},
	tax_treatment_code: {
		description:
			'Specify a reason for using the out of scope VAT treatment.</br>Supported values for <b>UAE</b> are <code>uae_same_tax_group</code>, <code>uae_reimbursed_expense</code>, <code>uae_others</code>, <code>uae_financial_services</code>, <code>uae_residential_units</code>, <code>uae_bare_land</code>, <code>uae_local_transportation</code>, <code>uae_financial_services_exempt</code>, <code>uae_residential_units_exempt</code>, <code>uae_bare_land_exempt</code>, and <code>uae_local_transportation_exempt</code>.</br> Supported values for <b>Bahrain</b> are <code>bahrain_same_tax_group</code>, <code>bahrain_transfer_of_concern</code>, <code>bahrain_disbursement</code>, <code>bahrain_head_to_branch_transaction</code> and <code>bahrain_others</code>.</br> Supported values for <b>KSA</b> are <code>ksa_reimbursed_expense</code>.',
		type: 'string',
		'x-node_available_in': ['gcc', 'uae'],
		'x-node_unavailable_in': [],
	},
	tax_type: { description: 'Type of tax', type: 'string' },
	taxes: {
		description: 'List of taxes applied to the bill.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				tax_name: { $ref: '#/components/schemas/tax_name' },
				tax_amount: { $ref: '#/components/schemas/tax_amount' },
			},
		},
	},
	tds_tax_id: {
		description: 'TDS ID of the tax or tax group applied to the line item',
		type: 'string',
		'x-node_available_in': ['mx'],
		'x-node_unavailable_in': [],
	},
	terms: {
		description:
			'Terms and conditions that apply to the bill transaction. Includes payment terms, delivery conditions, warranty information, or other contractual obligations. Displayed on bill documents and vendor communications. Important for legal compliance and vendor relationship management.',
		type: 'string',
	},
	time: { description: 'Time of Comment', type: 'string' },
	total: { description: 'Total of the Bill', type: 'integer' },
	transaction_id: {
		description: 'ID of the Transaction that Caused the Comment',
		type: 'string',
	},
	transaction_type: {
		description: 'Type of Transaction that caused the comment',
		type: 'string',
	},
	unit: {
		description:
			'Unit of measurement for the item quantity. sample: pieces, kgs, liters, hours, days. Used for accurate billing and inventory tracking. Auto-populated when item_id is specified. Important for vendor communication and expense categorization.',
		type: 'string',
	},
	unitkey_code: {
		description:
			'Unit code for the goods or services.<br/><b>For UAE Edition:</b> use the UN/CEFACT unit code (for sample <code>H87</code> for piece, <code>KGM</code> for kilogram). Maximum length: 10 characters.',
		type: 'string',
		maxLength: 10,
		'x-node_available_in': ['uae'],
		'x-node_unavailable_in': [],
	},
	unused_credits_payable_amount: {
		description: 'Unused Credits for this Vendor',
		type: 'integer',
	},
	'update-a-bill-customfield-request': {
		description: 'Update the custom fields of a bill.',
		type: 'object',
		properties: {
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
		},
	},
	'update-a-bill-request': {
		required: ['vendor_id', 'bill_number'],
		type: 'object',
		properties: {
			vendor_id: { $ref: '#/components/schemas/vendor_id' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			is_update_customer: { $ref: '#/components/schemas/is_update_customer' },
			purchaseorder_ids: { $ref: '#/components/schemas/purchaseorder_ids' },
			bill_number: { $ref: '#/components/schemas/bill_number' },
			entity_type: { $ref: '#/components/schemas/entity_type' },
			documents: { $ref: '#/components/schemas/documents' },
			source_of_supply: { $ref: '#/components/schemas/source_of_supply' },
			destination_of_supply: {
				$ref: '#/components/schemas/destination_of_supply',
			},
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			permit_number: { $ref: '#/components/schemas/permit_number' },
			gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			is_reverse_charge_applied: {
				$ref: '#/components/schemas/is_reverse_charge_applied',
			},
			gst_no: { $ref: '#/components/schemas/gst_no' },
			tax_reg_no: { $ref: '#/components/schemas/tax_reg_no' },
			registration_details: {
				$ref: '#/components/schemas/registration_details',
			},
			pricebook_id: { $ref: '#/components/schemas/pricebook_id' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			date: { $ref: '#/components/schemas/date' },
			due_date: { $ref: '#/components/schemas/due_date' },
			payment_terms: { $ref: '#/components/schemas/payment_terms' },
			payment_terms_label: { $ref: '#/components/schemas/payment_terms_label' },
			bank_account_id: { $ref: '#/components/schemas/bank_account_id' },
			recurring_bill_id: { $ref: '#/components/schemas/recurring_bill_id' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			is_item_level_tax_calc: {
				$ref: '#/components/schemas/is_item_level_tax_calc',
			},
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			adjustment: { $ref: '#/components/schemas/adjustment' },
			adjustment_description: {
				$ref: '#/components/schemas/adjustment_description',
			},
			discount_code: { $ref: '#/components/schemas/discount_code' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			tags: { $ref: '#/components/schemas/tags' },
			line_items: {
				description: 'Line items of a bill.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						purchaseorder_item_id: {
							$ref: '#/components/schemas/purchaseorder_item_id',
						},
						line_item_id: { $ref: '#/components/schemas/line_item_id' },
						item_id: { $ref: '#/components/schemas/item_id' },
						name: { $ref: '#/components/schemas/name' },
						account_id: { $ref: '#/components/schemas/account_id' },
						description: { $ref: '#/components/schemas/description' },
						rate: { $ref: '#/components/schemas/rate' },
						hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
						unitkey_code: { $ref: '#/components/schemas/unitkey_code' },
						discount_code: { $ref: '#/components/schemas/discount_code' },
						reverse_charge_tax_id: {
							$ref: '#/components/schemas/reverse_charge_tax_id',
						},
						location_id: { $ref: '#/components/schemas/location_id' },
						quantity: { $ref: '#/components/schemas/quantity' },
						tax_id: { $ref: '#/components/schemas/tax_id' },
						tds_tax_id: { $ref: '#/components/schemas/tds_tax_id' },
						tax_treatment_code: {
							$ref: '#/components/schemas/tax_treatment_code',
						},
						tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
						tax_exemption_code: {
							$ref: '#/components/schemas/tax_exemption_code',
						},
						item_order: { $ref: '#/components/schemas/item_order' },
						product_type: { $ref: '#/components/schemas/product_type' },
						acquisition_vat_id: {
							$ref: '#/components/schemas/acquisition_vat_id',
						},
						reverse_charge_vat_id: {
							$ref: '#/components/schemas/reverse_charge_vat_id',
						},
						unit: { $ref: '#/components/schemas/unit' },
						tags: { $ref: '#/components/schemas/tags' },
						line_item_category: {
							$ref: '#/components/schemas/line_item_category',
						},
						is_billable: { $ref: '#/components/schemas/is_billable' },
						project_id: { $ref: '#/components/schemas/project_id' },
						customer_id: { $ref: '#/components/schemas/customer_id' },
						item_custom_fields: {
							$ref: '#/components/schemas/item_custom_fields',
						},
						serial_numbers: { $ref: '#/components/schemas/serial_numbers' },
					},
				},
			},
			location_id: { $ref: '#/components/schemas/location_id' },
			taxes: {
				type: 'array',
				description: 'List of taxes applied to the bill.',
				items: {
					type: 'object',
					properties: {
						tax_id: { $ref: '#/components/schemas/tax_id' },
						tax_name: { $ref: '#/components/schemas/tax_name' },
						tax_amount: { $ref: '#/components/schemas/tax_amount' },
					},
				},
			},
			notes: { $ref: '#/components/schemas/notes' },
			terms: { $ref: '#/components/schemas/terms' },
			approvers: { $ref: '#/components/schemas/approvers' },
		},
	},
	'update-a-bill-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			bill: { $ref: '#/components/schemas/bill' },
		},
	},
	'update-an-bill-customfield-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'update-billing-address-request': {
		type: 'object',
		properties: {
			address: { $ref: '#/components/schemas/address' },
			city: { $ref: '#/components/schemas/city' },
			state: { $ref: '#/components/schemas/state' },
			zip: { $ref: '#/components/schemas/zip' },
			country: { $ref: '#/components/schemas/country' },
			fax: { $ref: '#/components/schemas/fax' },
			attention: { $ref: '#/components/schemas/attention' },
			is_update_customer: { $ref: '#/components/schemas/is_update_customer' },
		},
	},
	'update-billing-address-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			billing_address: { $ref: '#/components/schemas/billing_address' },
		},
	},
	value: { description: 'Value of the Custom Field', type: 'string' },
	vat_reg_no: {
		description:
			'<b>For UK Edition:</b> VAT Registration number of a contact with Length should be between 2 and 12 characters.<br/> <b>For Avalara:</b> If you are doing sales in the European Union (EU) then provide VAT Registration Number of your customers here. This is used to calculate VAT for B2B sales, from Avalara.',
		type: 'string',
		'x-node_available_in': ['uk', 'Avalara Integration'],
		'x-node_unavailable_in': [],
	},
	vat_treatment: {
		description:
			'(Optional) VAT treatment for the bill. VAT treatment denotes the location of the vendor, if the vendor resides in UK then the VAT treatment is <code>uk</code>. If the vendor is in an EU country & VAT registered, you are resides in Northen Ireland and purchasing Goods then his VAT treatment is <code>eu_vat_registered</code>, if he resides outside of the UK then his VAT treatment is <code>overseas</code> (For Pre Brexit, this can be split as <code>eu_vat_registered</code>, <code>eu_vat_not_registered</code> and <code>non_eu</code>).',
		type: 'string',
		'x-node_available_in': ['uk'],
		'x-node_unavailable_in': [],
	},
	vendor_credit_bill_id: {
		description: 'ID of the Bill Credited using the Vendor Credit',
		type: 'string',
	},
	vendor_credit_id: { description: 'ID of the Vendor Credit', type: 'string' },
	vendor_credit_number: {
		description: 'Number of the Vendor Credit',
		type: 'string',
	},
	vendor_credits: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				vendor_credit_id: { $ref: '#/components/schemas/vendor_credit_id' },
				vendor_credit_bill_id: {
					$ref: '#/components/schemas/vendor_credit_bill_id',
				},
				vendor_credit_number: {
					$ref: '#/components/schemas/vendor_credit_number',
				},
				date: { description: 'Date Vendor Credit was applied', type: 'string' },
				amount: {
					description: 'Amount of Credit applied to the Bill',
					type: 'number',
					format: 'double',
				},
			},
		},
	},
	vendor_credits_applied: {
		description: 'Amount of credits applied',
		type: 'integer',
	},
	vendor_id: {
		description:
			'Unique identifier for the vendor who supplied the goods/services. Can be fetched from the Get Contacts API.',
		type: 'string',
	},
	vendor_name: { description: 'Name of the Vendor', type: 'string' },
	'void-a-bill-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	zip: { description: 'ZIP Code involved in the Address', type: 'string' },
};

export const operations: readonly ZohoBooksOperationDefinition[] = [
	{
		id: 'create_bill',
		group: 'bills',
		groupSlug: 'bills',
		name: 'createBill',
		method: 'POST',
		path: '/bills',
		summary: 'Create a bill',
		description: 'Create a bill received from your vendor.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bills/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'attachment',
				in: 'query',
				required: false,
				description:
					'File to attach. Allowed Extensions: <code>gif</code>, <code>png</code>, <code>jpeg</code>, <code>jpg</code>, <code>bmp</code> and <code>pdf</code>.',
				schema: { type: 'string', format: 'binary' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/create-a-bill-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/create-a-bill-response' },
			},
		],
		scopes: ['ZohoBooks.bills.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_bills',
		group: 'bills',
		groupSlug: 'bills',
		name: 'listBills',
		method: 'GET',
		path: '/bills',
		summary: 'List bills',
		description: 'List all bills with pagination.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bills/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'bill_number',
				in: 'query',
				required: false,
				description:
					'Filter bills by bill number. Accepts exact matches or use <code>bill_number_startswith</code> for prefix matching and <code>bill_number_contains</code> for substring matching. Useful for finding bills by unique identifier or partial patterns.',
				schema: { type: 'string' },
			},
			{
				name: 'reference_number',
				in: 'query',
				required: false,
				description:
					'Filter bills by reference number. Accepts exact matches or use <code>reference_number_startswith</code> for prefix matching and <code>reference_number_contains</code> for substring matching. Useful for finding bills by external references or vendor invoice numbers.',
				schema: { type: 'string' },
			},
			{
				name: 'date',
				in: 'query',
				required: false,
				description:
					'Filter bills by bill date in YYYY-MM-DD format. Use <code>date_start</code>/<code>date_end</code> for ranges, <code>date_before</code>/<code>date_after</code> for relative dates. Useful for billing periods and due date management.',
				schema: { type: 'string' },
			},
			{
				name: 'due_date',
				in: 'query',
				required: false,
				description:
					'Search bills by due date. Filters bills based on the payment due date. Use yyyy-mm-dd format. Supports variants: <code>due_date_start</code>, <code>due_date_end</code>, <code>due_date_before</code> and <code>due_date_after</code>. Useful for finding overdue bills or bills due within specific periods.',
				schema: { type: 'string' },
			},
			{
				name: 'created_date',
				in: 'query',
				required: false,
				description:
					'Search bills by creation date. Filters bills based on the date they were created. Use yyyy-mm-dd format. Supports variants: <code>created_date_start</code> and <code>created_date_end</code>. Useful for finding bills created within specific time periods or date ranges.',
				schema: { type: 'string' },
			},
			{
				name: 'status',
				in: 'query',
				required: false,
				description:
					'Filter bills by status: <code>paid</code>, <code>open</code>, <code>overdue</code>, <code>void</code>, or <code>partially_paid</code>. Useful for payment status filtering, accounts payable management, and status-specific reporting.',
				schema: {
					type: 'string',
					enum: [
						'paid',
						'open',
						'overdue',
						'void',
						'partially_paid',
						'unpaid',
						'draft',
						'pending_approval',
						'approval_overdue',
						'my_approvals',
						'rejected',
						'approved',
					],
				},
			},
			{
				name: 'description',
				in: 'query',
				required: false,
				description:
					'Filter bills by description text. Accepts exact matches or use <code>description_startswith</code> for prefix matching and <code>description_contains</code> for substring matching. Useful for finding bills by line item descriptions or vendor notes.',
				schema: { type: 'string' },
			},
			{
				name: 'vendor_name',
				in: 'query',
				required: false,
				description:
					'Filter bills by vendor name. Use <code>vendor_name_startswith</code> for prefix matching or <code>vendor_name_contains</code> for substring matching. Useful for finding bills from specific suppliers.',
				schema: { type: 'string' },
			},
			{
				name: 'total',
				in: 'query',
				required: false,
				description:
					'Search bills by total amount. Filters bills based on the final bill amount including taxes, discounts, and adjustments. Useful for finding bills within specific price ranges or identifying high-value transactions.',
				schema: { type: 'string' },
			},
			{
				name: 'vendor_id',
				in: 'query',
				required: false,
				description:
					'Filter bills by specific vendor ID. Accepts the unique identifier for a vendor to retrieve all bills associated with that particular supplier or vendor account.',
				schema: { type: 'string' },
			},
			{
				name: 'project_id',
				in: 'query',
				required: false,
				description:
					'Filter bills by specific project ID. Accepts the unique identifier for a project to retrieve all bills associated with that particular project.',
				schema: { type: 'string' },
			},
			{
				name: 'item_name',
				in: 'query',
				required: false,
				description:
					'Search bills by item name. Filters bills based on product or service names in bill line items. Supports <code>item_name_startswith</code> and <code>item_name_contains</code> variants. Maximum length is 100 characters. Useful for finding bills with specific products or services.',
				schema: { type: 'string' },
			},
			{
				name: 'item_description',
				in: 'query',
				required: false,
				description:
					'Search bills by item description. Filters bills based on detailed descriptions of products or services in line items. Supports <code>item_description_startswith</code> and <code>item_description_contains</code> variants. Maximum length is 100 characters. Useful for finding bills with specific item descriptions or technical specifications.',
				schema: { type: 'string' },
			},
			{
				name: 'item_id',
				in: 'query',
				required: false,
				description:
					'Filter bills by specific item ID. Retrieves all bills containing a particular product or service item based on its unique identifier.',
				schema: { type: 'string' },
			},
			{
				name: 'recurring_bill_id',
				in: 'query',
				required: false,
				description:
					'Filter bills by recurring bill ID. Retrieves all bills generated from a specific recurring bill template or schedule.',
				schema: { type: 'string' },
			},
			{
				name: 'purchaseorder_id',
				in: 'query',
				required: false,
				description:
					'Filter bills by purchase order ID. Retrieves all bills associated with a specific purchase order for tracking procurement workflows.',
				schema: { type: 'string' },
			},
			{
				name: 'last_modified_time',
				in: 'query',
				required: false,
				description:
					'Search bills modified after a specific time. Filters bills based on their last modification timestamp. Use YYYY-MM-DDTHH:MM:SS-UTC format. Useful for finding recently updated bills or syncing data changes. sample : 2023-11-18T02:02:51-0800, 2025-19-19T02:02:51%2B0800',
				schema: { type: 'string' },
			},
			{
				name: 'customer_id',
				in: 'query',
				required: false,
				description:
					'Search bills by customer ID. Filters bills based on the unique identifier of the customer associated with the bill. Use the customer ID returned by the Contacts API to find bills for a specific customer. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'filter_by',
				in: 'query',
				required: false,
				description:
					'Filter bills by status using predefined status constants. Options include <code>Status.All</code>, <code>Status.PartiallyPaid</code>, <code>Status.Paid</code>, <code>Status.Overdue</code>, <code>Status.Void</code>, and <code>Status.Open</code>.',
				schema: {
					type: 'string',
					enum: [
						'Status.All',
						'Status.Paid',
						'Status.Open',
						'Status.Overdue',
						'Status.Void',
						'Status.PartiallyPaid',
						'Status.Unpaid',
						'Status.Draft',
						'Status.Pending',
						'Status.ApprovalOverdue',
						'Status.CreditNotes',
						'Status.MyApprovals',
						'Status.Network',
						'Status.NetworkPending',
						'Status.EInvoicedBills',
						'Status.EInvoicePendingBills',
						'Status.MSMEDueBills',
						'Status.TDSInvoices',
						'Status.BBPSPendingApproval',
						'Status.BBPSAccepted',
						'Status.BBPSAcceptFailed',
						'Status.BBPSRejected',
						'Status.BBPSRejectFailed',
						'Status.BBPSReturned',
						'Status.BBPSReturnFailed',
						'Status.PMSAppliedBills',
						'Status.ViolatedBills',
						'YetToBeReceived',
						'Received',
						'ExceptionList',
						'WithAttachment',
						'WithoutAttachment',
						'Source.TallyConnector',
						'MissingAdvancedTrackingDetails',
						'TDSCalculationExceptionList',
						'Type.All',
						'Type.Bills',
						'Type.SelfBilled',
						'Type.MyRecentBills',
					],
				},
			},
			{
				name: 'search_text',
				in: 'query',
				required: false,
				description:
					'Filter bills using general search text. Searches across bill number, reference number, and vendor name fields to find matching bills. Useful for quick searches when you know part of the bill information.',
				schema: { type: 'string' },
			},
			{
				name: 'page',
				in: 'query',
				required: false,
				description:
					'Specify the page number for pagination. Use this parameter to navigate through multiple pages of bills when the total number of bills exceeds the per_page limit.',
				schema: { type: 'integer' },
			},
			{
				name: 'per_page',
				in: 'query',
				required: false,
				description: 'Specify the number of bills to retrieve per page.',
				schema: { type: 'integer', default: 10 },
			},
			{
				name: 'location_ids',
				in: 'query',
				required: false,
				description:
					'List of location IDs to filter bills by their associated locations. Use this parameter to retrieve bills linked to specific business locations. Note: This value is a comma-separated list of numeric location IDs.',
				schema: { type: 'string' },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description:
					'Specify the column to sort bills by. Available options include <code>vendor_name</code>, <code>bill_number</code>, <code>date</code>, <code>due_date</code>, <code>total</code>, <code>balance</code>, and <code>created_time</code>.',
				schema: {
					type: 'string',
					enum: [
						'vendor_name',
						'bill_number',
						'date',
						'due_date',
						'total',
						'balance',
						'created_time',
						'last_modified_time',
						'txn_value_date',
						'total_retention_amount',
					],
				},
			},
			{
				name: 'sort_order',
				in: 'query',
				required: false,
				description:
					'Specify the sorting order for bills. Use <code>A</code> for ascending order (A-Z, 0-9, earliest to latest) or <code>D</code> for descending order (Z-A, 9-0, latest to earliest).',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/list-bills-response' },
			},
		],
		scopes: ['ZohoBooks.bills.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_bill_using_custom_field',
		group: 'bills',
		groupSlug: 'bills',
		name: 'updateBillUsingCustomField',
		method: 'PUT',
		path: '/bills',
		summary: "Update a bill using a custom field's unique value",
		description:
			"A custom field will have unique values if it's configured to not accept duplicate values. Now, you can use that custom field's value to update a bill by providing its API name in the X-Unique-Identifier-Key header and its value in the X-Unique-Identifier-Value header. Based on this value, the corresponding bill will be retrieved and updated. Additionally, there is an optional X-Upsert header. If the X-Upsert header is true and the custom field's unique value is not found in any of the existing bills, a new bill will be created if the necessary payload details are available",
		docsUrl: 'https://www.zoho.com/books/api/v3/bills/',
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
				description:
					'Specify the API name of the custom field that contains unique values. This field must be configured to not accept duplicate values for the upsert functionality to work properly.',
				schema: { type: 'string' },
			},
			{
				name: 'X-Unique-Identifier-Value',
				in: 'header',
				required: true,
				description:
					'Provide the unique value from the custom field that identifies the specific bill to update. This value will be used to locate the existing bill record in the system.',
				schema: { type: 'string' },
			},
			{
				name: 'X-Upsert',
				in: 'header',
				required: false,
				description:
					'When set to true, this header enables upsert functionality. If no bill is found with the specified custom field value, a new bill will be created using the provided payload data.',
				schema: { type: 'boolean' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/update-a-bill-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-a-bill-response' },
			},
		],
		scopes: ['ZohoBooks.bills.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_bill',
		group: 'bills',
		groupSlug: 'bills',
		name: 'updateBill',
		method: 'PUT',
		path: '/bills/{bill_id}',
		summary: 'Update a bill',
		description:
			'Update a bill. To delete a line item just remove it from the line_items list.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bills/',
		parameters: [
			{
				name: 'bill_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bill.',
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
				name: 'attachment',
				in: 'query',
				required: false,
				description:
					'File to attach. Allowed Extensions: <code>gif</code>, <code>png</code>, <code>jpeg</code>, <code>jpg</code>, <code>bmp</code> and <code>pdf</code>.',
				schema: { type: 'string', format: 'binary' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/update-a-bill-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-a-bill-response' },
			},
		],
		scopes: ['ZohoBooks.bills.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_bill',
		group: 'bills',
		groupSlug: 'bills',
		name: 'getBill',
		method: 'GET',
		path: '/bills/{bill_id}',
		summary: 'Get a bill',
		description: 'Get the details of a bill.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bills/',
		parameters: [
			{
				name: 'bill_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bill.',
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
				schema: { $ref: '#/components/schemas/get-a-bill-response' },
			},
		],
		scopes: ['ZohoBooks.bills.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_bill',
		group: 'bills',
		groupSlug: 'bills',
		name: 'deleteBill',
		method: 'DELETE',
		path: '/bills/{bill_id}',
		summary: 'Delete a bill',
		description:
			'Delete an existing bill. Bills which have payments applied cannot be deleted.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bills/',
		parameters: [
			{
				name: 'bill_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bill.',
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
				schema: { $ref: '#/components/schemas/delete-a-bill-response' },
			},
		],
		scopes: ['ZohoBooks.bills.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'update_custom_fields_in_bill',
		group: 'bills',
		groupSlug: 'bills',
		name: 'updateCustomFieldsInBill',
		method: 'PUT',
		path: '/bill/{bill_id}/customfields',
		summary: 'Update custom field in existing bills',
		description: 'Update the value of the custom field in existing bills.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bills/',
		parameters: [
			{
				name: 'bill_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bill.',
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
				$ref: '#/components/schemas/update-a-bill-customfield-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-an-bill-customfield-response',
				},
			},
		],
		scopes: ['ZohoBooks.bills.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_bill_void',
		group: 'bills',
		groupSlug: 'bills',
		name: 'markBillVoid',
		method: 'POST',
		path: '/bills/{bill_id}/status/void',
		summary: 'Void a bill',
		description: 'Mark a bill status as void.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bills/',
		parameters: [
			{
				name: 'bill_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bill.',
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
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/void-a-bill-response' },
			},
		],
		scopes: ['ZohoBooks.bills.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'mark_bill_open',
		group: 'bills',
		groupSlug: 'bills',
		name: 'markBillOpen',
		method: 'POST',
		path: '/bills/{bill_id}/status/open',
		summary: 'Mark a bill as open',
		description: 'Mark a void bill as open.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bills/',
		parameters: [
			{
				name: 'bill_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bill.',
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
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/mark-a-bill-as-open-response' },
			},
		],
		scopes: ['ZohoBooks.bills.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'submit_bill',
		group: 'bills',
		groupSlug: 'bills',
		name: 'submitBill',
		method: 'POST',
		path: '/bills/{bill_id}/submit',
		summary: 'Submit a bill for approval',
		description: 'Submit a bill for approval.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bills/',
		parameters: [
			{
				name: 'bill_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bill.',
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
					$ref: '#/components/schemas/submit-a-bill-for-approval-response',
				},
			},
		],
		scopes: ['ZohoBooks.bills.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'approve_bill',
		group: 'bills',
		groupSlug: 'bills',
		name: 'approveBill',
		method: 'POST',
		path: '/bills/{bill_id}/approve',
		summary: 'Approve a bill',
		description: 'Approve a bill.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bills/',
		parameters: [
			{
				name: 'bill_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bill.',
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
				schema: { $ref: '#/components/schemas/approve-a-bill-response' },
			},
		],
		scopes: ['ZohoBooks.bills.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'update_bill_billing_address',
		group: 'bills',
		groupSlug: 'bills',
		name: 'updateBillBillingAddress',
		method: 'PUT',
		path: '/bills/{bill_id}/address/billing',
		summary: 'Update billing address',
		description: 'Updates the billing address for this bill.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bills/',
		parameters: [
			{
				name: 'bill_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bill.',
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
			schema: { $ref: '#/components/schemas/update-billing-address-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-billing-address-response',
				},
			},
		],
		scopes: ['ZohoBooks.bills.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_bill_payments',
		group: 'bills',
		groupSlug: 'bills',
		name: 'listBillPayments',
		method: 'GET',
		path: '/bills/{bill_id}/payments',
		summary: 'List bill payments',
		description: 'Get the list of payments made for a bill.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bills/',
		parameters: [
			{
				name: 'bill_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bill.',
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
				schema: { $ref: '#/components/schemas/list-bill-payments-response' },
			},
		],
		scopes: ['ZohoBooks.bills.READ'],
		riskLevel: 'read',
	},
	{
		id: 'apply_credits_to_bill',
		group: 'bills',
		groupSlug: 'bills',
		name: 'applyCreditsToBill',
		method: 'POST',
		path: '/bills/{bill_id}/credits',
		summary: 'Apply credits',
		description:
			'Apply the vendor credits from excess vendor payments to a bill. Multiple credits can be applied at once.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bills/',
		parameters: [
			{
				name: 'bill_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bill.',
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
			schema: { $ref: '#/components/schemas/apply-credits-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/apply-credits-response' },
			},
		],
		scopes: ['ZohoBooks.bills.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_bill_payment',
		group: 'bills',
		groupSlug: 'bills',
		name: 'deleteBillPayment',
		method: 'DELETE',
		path: '/bills/{bill_id}/payments/{bill_payment_id}',
		summary: 'Delete a payment',
		description: 'Delete a payment made to a bill.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bills/',
		parameters: [
			{
				name: 'bill_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bill.',
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
				name: 'bill_payment_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bill payment.',
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
		scopes: ['ZohoBooks.bills.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_bill_attachment',
		group: 'bills',
		groupSlug: 'bills',
		name: 'getBillAttachment',
		method: 'GET',
		path: '/bills/{bill_id}/attachment',
		summary: 'Get a bill attachment',
		description: 'Returns the file attached to the bill.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bills/',
		parameters: [
			{
				name: 'bill_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bill.',
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
				name: 'preview',
				in: 'query',
				required: false,
				description: 'Get the thumbnail of the attachment.',
				schema: { type: 'boolean' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/get-a-bill-attachment-response' },
			},
		],
		scopes: ['ZohoBooks.bills.READ'],
		riskLevel: 'read',
	},
	{
		id: 'add_bill_attachment',
		group: 'bills',
		groupSlug: 'bills',
		name: 'addBillAttachment',
		method: 'POST',
		path: '/bills/{bill_id}/attachment',
		summary: 'Add attachment to a bill',
		description: 'Attach a file to a bill.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bills/',
		parameters: [
			{
				name: 'bill_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bill.',
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
				name: 'attachment',
				in: 'query',
				required: false,
				description:
					'File to attach. Allowed Extensions: <code>gif</code>, <code>png</code>, <code>jpeg</code>, <code>jpg</code>, <code>bmp</code> and <code>pdf</code>.',
				schema: { type: 'string', format: 'binary' },
			},
		],
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/add-attachment-to-a-bill-response',
				},
			},
		],
		scopes: ['ZohoBooks.bills.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_bill_attachment',
		group: 'bills',
		groupSlug: 'bills',
		name: 'deleteBillAttachment',
		method: 'DELETE',
		path: '/bills/{bill_id}/attachment',
		summary: 'Delete an attachment',
		description: 'Delete the file attached to a bill.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bills/',
		parameters: [
			{
				name: 'bill_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bill.',
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
				schema: { $ref: '#/components/schemas/delete-an-attachment-response' },
			},
		],
		scopes: ['ZohoBooks.bills.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_bill_comments',
		group: 'bills',
		groupSlug: 'bills',
		name: 'getBillComments',
		method: 'GET',
		path: '/bills/{bill_id}/comments',
		summary: 'List bill comments & history',
		description: 'Get the complete history and comments of a bill.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bills/',
		parameters: [
			{
				name: 'bill_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bill.',
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
					$ref: '#/components/schemas/list-bill-comments-and-history-response',
				},
			},
		],
		scopes: ['ZohoBooks.bills.READ'],
		riskLevel: 'read',
	},
	{
		id: 'add_bill_comment',
		group: 'bills',
		groupSlug: 'bills',
		name: 'addBillComment',
		method: 'POST',
		path: '/bills/{bill_id}/comments',
		summary: 'Add comment',
		description: 'Add a comment for a bill.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bills/',
		parameters: [
			{
				name: 'bill_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bill.',
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
			schema: { $ref: '#/components/schemas/add-comment-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/add-comment-response' },
			},
		],
		scopes: ['ZohoBooks.bills.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_bill_comment',
		group: 'bills',
		groupSlug: 'bills',
		name: 'deleteBillComment',
		method: 'DELETE',
		path: '/bills/{bill_id}/comments/{comment_id}',
		summary: 'Delete a comment',
		description: 'Delete a bill comment.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bills/',
		parameters: [
			{
				name: 'bill_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bill.',
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
				name: 'comment_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the comment.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/delete-a-comment-response' },
			},
		],
		scopes: ['ZohoBooks.bills.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'convert_purchase_order_to_bill',
		group: 'bills',
		groupSlug: 'bills',
		name: 'convertPurchaseOrderToBill',
		method: 'GET',
		path: '/bills/editpage/frompurchaseorders',
		summary: 'Convert PO to Bill',
		description:
			'Create a bill for the selected purchase orders. Use this api to fetch the Bill payload by passing the purchaseorder_ids in the query parameters and then use the create bill api and pass the payload to create a bill <br> <a href=/books/api/v3/bills/#create-a-bill>Create bill API Endpoint</a>.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bills/',
		parameters: [
			{
				name: 'purchaseorder_ids',
				in: 'query',
				required: true,
				description: 'ID of the purchase order',
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
				name: 'purchaseorder_ids',
				in: 'query',
				required: true,
				description: 'ID of the purchase order',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/convert-po-to-bill-response' },
			},
		],
		scopes: ['ZohoBooks.bills.READ'],
		riskLevel: 'read',
	},
];
