import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas = {
	account_id: {
		description:
			'Unique identifier for the chart of accounts entry. Retrieve account IDs from the List Chart of Accounts API endpoint. Determines which account the line item affects for accounting purposes.',
		type: 'string',
	},
	account_name: {
		description: 'Name of the account the line item is associated with',
		type: 'string',
	},
	acquisition_vat_amount: {
		description: 'Amount of the VAT Acquistion',
		type: 'string',
		'x-node_available_in': ['uk', 'eu'],
		'x-node_unavailable_in': [],
	},
	acquisition_vat_id: {
		description: 'ID of the VAT Acquistion',
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
	acquisition_vat_summary: {
		description: 'Summary of the VAT Acquistion',
		type: 'array',
		items: {
			type: 'object',
			properties: { tax: { $ref: '#/components/schemas/tax' } },
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
	'add-a-comment-request': {
		required: ['description'],
		type: 'object',
		properties: {
			description: {
				description: 'Description of the Comment',
				type: 'string',
			},
		},
	},
	'add-a-comment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			comment: {
				type: 'object',
				properties: {
					comment_id: { $ref: '#/components/schemas/comment_id' },
					vendor_credit_id: { $ref: '#/components/schemas/vendor_credit_id' },
					description: {
						description: 'Description of the Comment',
						type: 'string',
					},
					commented_by_id: { $ref: '#/components/schemas/commented_by_id' },
					commented_by: { $ref: '#/components/schemas/commented_by' },
					date: { description: 'Date of the Comment', type: 'string' },
				},
			},
		},
	},
	amount: {
		type: 'number',
		description: 'Amount to be refunded from the vendor credit.',
		format: 'double',
	},
	amount_bcy: {
		description: 'Refund Amount in Base Currency',
		type: 'number',
		format: 'double',
	},
	amount_fcy: {
		description: 'Refund Amount in Foreign Currency',
		type: 'number',
		format: 'double',
	},
	'apply-credits-to-a-bill-request': {
		required: ['bills'],
		type: 'object',
		properties: {
			bills: {
				description: 'Amount applied from vendor credits to specified bills.',
				type: 'array',
				items: {
					type: 'object',
					required: ['bill_id', 'amount_applied'],
					properties: {
						bill_id: {
							description: 'Bill Associated with the Vendor Credit',
							type: 'string',
						},
						amount_applied: {
							description: 'Amount applied to the bill.',
							type: 'number',
							format: 'double',
						},
					},
				},
			},
		},
	},
	'apply-credits-to-a-bill-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			bills: {
				description: 'Amount applied from vendor credits to specified bills.',
			},
		},
	},
	'approve-a-vendor-credit-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	balance: {
		description: 'Balance in the Vendor Credit',
		type: 'number',
		format: 'double',
	},
	bcy_rate: {
		description: 'Rate of the Item in Base Currency',
		type: 'number',
		format: 'double',
	},
	bill_id: {
		description: 'Bill Associated with the Vendor Credit',
		type: 'string',
	},
	bill_number: { type: 'string' },
	bills_credited: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				bill_id: { description: 'ID of the Bill Credited', type: 'string' },
				vendor_credit_bill_id: {
					$ref: '#/components/schemas/vendor_credit_bill_id',
				},
				date: { description: 'Date of the Bill Credit', type: 'string' },
				bill_number: {
					description: 'Number of the Bill Credited',
					type: 'string',
				},
				amount: {
					description: 'Amount that is credited in the bill',
					type: 'number',
					format: 'double',
				},
			},
		},
	},
	comment_id: { description: 'ID of the Comment', type: 'string' },
	comment_type: { description: 'Type of the comment', type: 'string' },
	commented_by: {
		description: 'Name of the User who caused the comment',
		type: 'string',
	},
	commented_by_id: {
		description: 'ID of the User who caused the comment',
		type: 'string',
	},
	comments: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				comment_id: { $ref: '#/components/schemas/comment_id' },
				vendor_credit_id: { $ref: '#/components/schemas/vendor_credit_id' },
				description: { $ref: '#/components/schemas/description' },
				commented_by_id: { $ref: '#/components/schemas/commented_by_id' },
				commented_by: { $ref: '#/components/schemas/commented_by' },
				comment_type: { $ref: '#/components/schemas/comment_type' },
				date: { $ref: '#/components/schemas/date' },
				date_description: { $ref: '#/components/schemas/date_description' },
				time: { $ref: '#/components/schemas/time' },
				operation_type: { $ref: '#/components/schemas/operation_type' },
				transaction_id: { $ref: '#/components/schemas/transaction_id' },
				transaction_type: { $ref: '#/components/schemas/transaction_type' },
			},
		},
	},
	'convert-to-open-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'create-a-vendor-credit-request': {
		required: ['vendor_id'],
		type: 'object',
		properties: {
			vendor_id: { $ref: '#/components/schemas/vendor_id' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			vendor_credit_number: {
				description: 'Mandatory if auto number generation is disabled.',
				type: 'string',
			},
			gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			gst_no: { $ref: '#/components/schemas/gst_no' },
			source_of_supply: { $ref: '#/components/schemas/source_of_supply' },
			destination_of_supply: {
				$ref: '#/components/schemas/destination_of_supply',
			},
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			pricebook_id: { $ref: '#/components/schemas/pricebook_id' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			is_update_customer: { $ref: '#/components/schemas/is_update_customer' },
			date: { $ref: '#/components/schemas/date' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			location_id: { $ref: '#/components/schemas/location_id' },
			line_items: { $ref: '#/components/schemas/line_items' },
			notes: { $ref: '#/components/schemas/notes' },
			documents: { $ref: '#/components/schemas/documents' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			tags: { $ref: '#/components/schemas/tags' },
		},
	},
	'create-a-vendor-credit-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			vendor_credit: { $ref: '#/components/schemas/vendor_credit-response' },
		},
	},
	created_time: {
		description: 'Time of Vendor Credit Creation',
		type: 'string',
	},
	currency_code: {
		description: 'Code of the Currency Involved in the Vendor Credit',
		type: 'string',
	},
	currency_id: {
		description:
			'Unique identifier for the currency used in the vendor credit. Can differ from vendor currency if multi-currency is enabled. Retrieve currency IDs from the List Currencies API endpoint in the currency section.',
		type: 'string',
	},
	custom_field_id: {
		description: 'ID of the Custom Field',
		type: 'string',
		format: 'int64',
	},
	custom_fields: {
		type: 'array',
		description: 'Custom fields associated with the vendor credit.',
		items: {
			type: 'object',
			properties: {
				custom_field_id: { $ref: '#/components/schemas/custom_field_id' },
				label: { $ref: '#/components/schemas/label' },
				value: { $ref: '#/components/schemas/value' },
				index: { $ref: '#/components/schemas/index' },
			},
		},
	},
	customer_name: {
		description: 'Vendor associated with the Entity',
		type: 'string',
	},
	date: {
		description:
			'The date on which the vendor credit is created. Must be in yyyy-mm-dd format. This date determines the accounting period and affects tax calculations.',
		type: 'string',
	},
	date_description: {
		description: 'Description of the Date of the Comment',
		type: 'string',
	},
	'delete-a-comment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-bills-credited-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-vendor-credit-refund-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-vendor-credit-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	description: {
		description:
			'Detailed description of the line item. Provides additional information about the product or service being credited. Displayed on the vendor credit document.',
		type: 'string',
	},
	destination_of_supply: {
		description:
			"Place where the goods/services are supplied to. (If not given, organisation's home state will be taken)",
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	document_id: {
		description: 'ID of the Document',
		type: 'string',
		format: 'int64',
	},
	documents: {
		type: 'array',
		description: 'List of documents attached to the vendor credit.',
		items: {
			type: 'object',
			properties: {
				document_id: { $ref: '#/components/schemas/document_id' },
				file_name: { $ref: '#/components/schemas/file_name' },
			},
		},
	},
	exchange_rate: {
		description:
			'Exchange rate for converting the vendor credit currency to base currency. Required when currency differs from base currency. Retrieve rates from currency exchange rate APIs.',
		type: 'number',
		format: 'double',
	},
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
	'get-vendor-credit-refund-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			vendor_credit_refund: {
				$ref: '#/components/schemas/vendor_credit_refund',
			},
		},
	},
	'get-vendor-credit-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			vendor_credit: {
				type: 'object',
				properties: {
					vendor_credit_id: { $ref: '#/components/schemas/vendor_credit_id' },
					vendor_credit_number: {
						$ref: '#/components/schemas/vendor_credit_number',
					},
					date: { $ref: '#/components/schemas/date' },
					status: { $ref: '#/components/schemas/status' },
					reference_number: { $ref: '#/components/schemas/reference_number' },
					source_of_supply: { $ref: '#/components/schemas/source_of_supply' },
					destination_of_supply: {
						$ref: '#/components/schemas/destination_of_supply',
					},
					place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
					gst_no: { $ref: '#/components/schemas/gst_no' },
					gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
					tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
					pricebook_id: { $ref: '#/components/schemas/pricebook_id' },
					is_reverse_charge_applied: {
						$ref: '#/components/schemas/is_reverse_charge_applied',
					},
					vendor_id: { $ref: '#/components/schemas/vendor_id' },
					vendor_name: { $ref: '#/components/schemas/vendor_name' },
					currency_id: { $ref: '#/components/schemas/currency_id' },
					currency_code: { $ref: '#/components/schemas/currency_code' },
					exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
					price_precision: { $ref: '#/components/schemas/price_precision' },
					vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
					filed_in_vat_return_id: {
						$ref: '#/components/schemas/filed_in_vat_return_id',
					},
					filed_in_vat_return_name: {
						$ref: '#/components/schemas/filed_in_vat_return_name',
					},
					filed_in_vat_return_type: {
						$ref: '#/components/schemas/filed_in_vat_return_type',
					},
					is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
					location_id: { $ref: '#/components/schemas/location_id' },
					location_name: { $ref: '#/components/schemas/location_name' },
					tags: { $ref: '#/components/schemas/tags_response' },
					line_items: {
						description: 'Line items of a vendor credit.',
						type: 'object',
						properties: {
							item_id: { $ref: '#/components/schemas/item_id' },
							line_item_id: { $ref: '#/components/schemas/line_item_id' },
							sku: { $ref: '#/components/schemas/sku' },
							account_id: { $ref: '#/components/schemas/account_id' },
							product_type: { $ref: '#/components/schemas/product_type' },
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
							account_name: { $ref: '#/components/schemas/account_name' },
							location_id: { $ref: '#/components/schemas/location_id' },
							location_name: { $ref: '#/components/schemas/location_name' },
							name: { $ref: '#/components/schemas/name' },
							description: { $ref: '#/components/schemas/description' },
							item_order: { $ref: '#/components/schemas/item_order' },
							quantity: { $ref: '#/components/schemas/quantity' },
							unit: { $ref: '#/components/schemas/unit' },
							bcy_rate: { $ref: '#/components/schemas/bcy_rate' },
							rate: { $ref: '#/components/schemas/rate' },
							tax_id: { $ref: '#/components/schemas/tax_id' },
							tax_treatment_code: {
								$ref: '#/components/schemas/tax_treatment_code',
							},
							tax_exemption_id: {
								$ref: '#/components/schemas/tax_exemption_id',
							},
							tax_exemption_code: {
								$ref: '#/components/schemas/tax_exemption_code',
							},
							tax_name: { $ref: '#/components/schemas/tax_name' },
							tax_type: { $ref: '#/components/schemas/tax_type' },
							tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
							item_total: { $ref: '#/components/schemas/item_total' },
							item_total_inclusive_of_tax: {
								$ref: '#/components/schemas/item_total_inclusive_of_tax',
							},
							hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
							acquisition_vat_id: {
								$ref: '#/components/schemas/acquisition_vat_id',
							},
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
							stock_on_hand: { $ref: '#/components/schemas/stock_on_hand' },
							tags: { $ref: '#/components/schemas/tags' },
							line_item_category: {
								$ref: '#/components/schemas/line_item_category',
							},
							item_custom_fields: {
								$ref: '#/components/schemas/item_custom_fields',
							},
							project_id: { $ref: '#/components/schemas/project_id' },
							project_name: { $ref: '#/components/schemas/project_name' },
						},
					},
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
					documents: { $ref: '#/components/schemas/documents' },
					custom_fields: { $ref: '#/components/schemas/custom_fields' },
					sub_total: { $ref: '#/components/schemas/sub_total' },
					total: { $ref: '#/components/schemas/total' },
					total_credits_used: {
						$ref: '#/components/schemas/total_credits_used',
					},
					total_refunded_amount: {
						$ref: '#/components/schemas/total_refunded_amount',
					},
					balance: { $ref: '#/components/schemas/balance' },
					notes: { $ref: '#/components/schemas/notes' },
					comments: { $ref: '#/components/schemas/comments' },
					vendor_credit_refunds: {
						$ref: '#/components/schemas/vendor_credit_refunds',
					},
					bills_credited: { $ref: '#/components/schemas/bills_credited' },
					created_time: { $ref: '#/components/schemas/created_time' },
					last_modified_time: {
						$ref: '#/components/schemas/last_modified_time',
					},
				},
			},
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
		description: 'Check if Vendor Credit has attachment',
		type: 'boolean',
	},
	hsn_or_sac: {
		description: 'HSN Code',
		type: 'string',
		'x-node_available_in': ['in', 'ke', 'za'],
		'x-node_unavailable_in': [],
	},
	imported_transaction_id: {
		description: 'ID of the Imported Transaction',
		type: 'string',
		format: 'int64',
	},
	imported_transactions: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				imported_transaction_id: {
					$ref: '#/components/schemas/imported_transaction_id',
				},
				date: { $ref: '#/components/schemas/date' },
				amount: { $ref: '#/components/schemas/amount' },
				payee: { $ref: '#/components/schemas/payee' },
				description: { $ref: '#/components/schemas/description' },
				reference_number: { $ref: '#/components/schemas/reference_number' },
				status: { $ref: '#/components/schemas/status' },
				account_id: { $ref: '#/components/schemas/account_id' },
			},
		},
	},
	index: { description: 'Index of the Custom Field', type: 'integer' },
	is_inclusive_tax: {
		description:
			'Set to true if line item rates include tax amounts. When true, tax is already included in the item rates. When false, tax will be calculated and added to the rates.',
		type: 'boolean',
		'x-node_available_in': [],
		'x-node_unavailable_in': ['us'],
	},
	is_reverse_charge_applied: {
		description: 'Applicable for transactions where you pay reverse charge',
		type: 'boolean',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	is_tag_mandatory: {
		description: 'Used to check if the tag is mandatory',
		type: 'boolean',
	},
	is_update_customer: {
		description:
			'Set to true to update customer information when creating the vendor credit. This will modify the associated customer record with new details from the vendor credit.',
		type: 'boolean',
	},
	item_custom_fields: {
		type: 'array',
		description: 'Custom fields associated with the specific line item.',
		items: {
			type: 'object',
			properties: {
				custom_field_id: { $ref: '#/components/schemas/custom_field_id' },
				label: { $ref: '#/components/schemas/label' },
				value: { $ref: '#/components/schemas/value' },
				index: { $ref: '#/components/schemas/index' },
			},
		},
	},
	item_id: {
		description:
			'Unique identifier for the item in the line item. Retrieve item IDs from the List Items API endpoint in the items section. Links the line item to a specific product or service.',
		type: 'string',
	},
	item_order: {
		description:
			'Sequential order number for the line item. Determines the display order of line items on the vendor credit document. Lower numbers appear first.',
		type: 'integer',
	},
	item_total: {
		description: 'Total price of the Item',
		type: 'number',
		format: 'double',
	},
	item_total_inclusive_of_tax: {
		description: 'Total price of the Item inclusive of Tax',
		type: 'number',
		format: 'double',
	},
	label: { description: 'Label of the Custom Field', type: 'string' },
	last_modified_time: {
		description: 'Last Modified Time of Vendor Credit',
		type: 'string',
	},
	line_item_category: {
		description:
			'Category of the line item. Allowed values are <code>line_item</code>, <code>header</code> and <code>subtotal</code>. Use <code>line_item</code> for regular line items, <code>header</code> for header titles and <code>subtotal</code> for intermediate subtotal rows. For regular line items, you can send line_item or omit this field',
		type: 'string',
	},
	line_item_id: {
		description:
			'Unique identifier for the line item within the vendor credit. System-generated ID used for identifying and referencing specific line items in the vendor credit.',
		type: 'string',
	},
	line_items: {
		description: 'Line items of a vendor credit.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				item_id: { $ref: '#/components/schemas/item_id' },
				line_item_id: { $ref: '#/components/schemas/line_item_id' },
				account_id: { $ref: '#/components/schemas/account_id' },
				name: { $ref: '#/components/schemas/name' },
				hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
				reverse_charge_tax_id: {
					$ref: '#/components/schemas/reverse_charge_tax_id',
				},
				location_id: { $ref: '#/components/schemas/location_id' },
				description: { $ref: '#/components/schemas/description' },
				item_order: { $ref: '#/components/schemas/item_order' },
				quantity: { $ref: '#/components/schemas/quantity' },
				unit: { $ref: '#/components/schemas/unit' },
				rate: { $ref: '#/components/schemas/rate' },
				tax_id: { $ref: '#/components/schemas/tax_id' },
				tds_tax_id: { $ref: '#/components/schemas/tds_tax_id' },
				tax_treatment_code: { $ref: '#/components/schemas/tax_treatment_code' },
				tags: { $ref: '#/components/schemas/tags' },
				line_item_category: { $ref: '#/components/schemas/line_item_category' },
				item_custom_fields: { $ref: '#/components/schemas/item_custom_fields' },
				serial_numbers: { $ref: '#/components/schemas/serial_numbers' },
				project_id: { $ref: '#/components/schemas/project_id' },
			},
		},
	},
	'list-bills-credited-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			bills_credited: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						vendor_credit_id: { $ref: '#/components/schemas/vendor_credit_id' },
						bill_id: { $ref: '#/components/schemas/bill_id' },
						vendor_credit_bill_id: {
							$ref: '#/components/schemas/vendor_credit_bill_id',
						},
						date: { $ref: '#/components/schemas/date' },
						bill_number: { $ref: '#/components/schemas/bill_number' },
					},
				},
			},
		},
	},
	'list-refunds-of-a-vendor-credit-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			vendor_credit_refunds: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						vendor_credit_refund_id: {
							$ref: '#/components/schemas/vendor_credit_refund_id',
						},
						vendor_credit_id: { $ref: '#/components/schemas/vendor_credit_id' },
						date: {
							description: 'Date of the Vendor Credit Refund',
							type: 'string',
						},
						refund_mode: { $ref: '#/components/schemas/refund_mode' },
						reference_number: { $ref: '#/components/schemas/reference_number' },
						amount: { $ref: '#/components/schemas/amount' },
						vendor_credit_number: {
							$ref: '#/components/schemas/vendor_credit_number',
						},
						customer_name: { $ref: '#/components/schemas/customer_name' },
						description: {
							description: 'Description of the Vendor Credit Refund',
							type: 'string',
						},
						amount_bcy: { $ref: '#/components/schemas/amount_bcy' },
						amount_fcy: { $ref: '#/components/schemas/amount_fcy' },
					},
				},
			},
		},
	},
	'list-vendor-credit-comments-and-history-response': {
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
						vendor_credit_id: { $ref: '#/components/schemas/vendor_credit_id' },
						description: {
							description: 'Description of the Comment',
							type: 'string',
						},
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
	'list-vendor-credit-refunds-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			vendor_credit_refunds: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						vendor_credit_refund_id: {
							$ref: '#/components/schemas/vendor_credit_refund_id',
						},
						vendor_credit_id: { $ref: '#/components/schemas/vendor_credit_id' },
						date: {
							description: 'Date of the Vendor Credit Refund',
							type: 'string',
						},
						refund_mode: { $ref: '#/components/schemas/refund_mode' },
						reference_number: { $ref: '#/components/schemas/reference_number' },
						amount: { $ref: '#/components/schemas/amount' },
						vendor_credit_number: {
							$ref: '#/components/schemas/vendor_credit_number',
						},
						customer_name: { $ref: '#/components/schemas/customer_name' },
						description: {
							description: 'Description of the Vendor Credit Refund',
							type: 'string',
						},
						amount_bcy: { $ref: '#/components/schemas/amount_bcy' },
						amount_fcy: { $ref: '#/components/schemas/amount_fcy' },
					},
				},
			},
		},
	},
	'list-vendor-credits-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			vendorcredits: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						vendor_credit_id: { $ref: '#/components/schemas/vendor_credit_id' },
						vendor_credit_number: {
							$ref: '#/components/schemas/vendor_credit_number',
						},
						status: { $ref: '#/components/schemas/status' },
						reference_number: { $ref: '#/components/schemas/reference_number' },
						date: { $ref: '#/components/schemas/date' },
						total: { $ref: '#/components/schemas/total' },
						balance: { $ref: '#/components/schemas/balance' },
						vendor_id: { $ref: '#/components/schemas/vendor_id' },
						vendor_name: { $ref: '#/components/schemas/vendor_name' },
						currency_id: { $ref: '#/components/schemas/currency_id' },
						currency_code: { $ref: '#/components/schemas/currency_code' },
						created_time: { $ref: '#/components/schemas/created_time' },
						last_modified_time: {
							$ref: '#/components/schemas/last_modified_time',
						},
						has_attachment: { $ref: '#/components/schemas/has_attachment' },
						exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
						tags: { $ref: '#/components/schemas/tags_response' },
					},
				},
			},
		},
	},
	location_id: {
		description:
			'Unique identifier for the business location. Retrieve location IDs from the List Locations API endpoint in the locations section. Determines tax settings and business rules.',
		type: 'string',
	},
	location_name: { description: 'Name of the location' },
	name: {
		description:
			'Name or title of the line item. Describes the product or service being credited. This name is displayed on the vendor credit document.',
		type: 'string',
	},
	notes: {
		description:
			'Additional notes or comments for the vendor credit. Displayed on the vendor credit document for vendor reference. Max-length [5000]',
		type: 'string',
	},
	operation_type: {
		description: 'Type of operation that caused the Comment',
		type: 'string',
	},
	payee: { description: 'Payee of the Transaction', type: 'string' },
	place_of_supply: {
		description:
			'The place of supply is where a transaction is considered to have occurred for VAT purposes. For the supply of goods, the place of supply is the location of the goods when the supply occurs. For the supply of services, the place of supply should be where the supplier is established. (If not given, <code>place of contact</code> given for the contact will be taken)<br/>Supported codes for UAE emirates are : </br>Abu Dhabi - <code>AB</code>,</br>Ajman - <code>AJ</code>,</br>Dubai - <code>DU</code>,</br>Fujairah - <code>FU</code>,</br>Ras al-Khaimah - <code>RA</code>,</br>Sharjah - <code>SH</code>,</br>Umm al-Quwain - <code>UM</code>.<br/>Supported codes for the GCC countries are : </br>United Arab Emirates - <code>AE</code>,</br>Saudi Arabia - <code>SA</code>,</br>Bahrain - <code>BH</code>,</br>Kuwait - <code>KW</code>,</br>Oman - <code>OM</code>,</br>Qatar - <code>QA</code>.',
		type: 'string',
		'x-node_available_in': ['gcc'],
		'x-node_unavailable_in': [],
	},
	price_precision: { type: 'integer' },
	pricebook_id: {
		description:
			'Unique identifier for the pricebook used for pricing items in the vendor credit. Retrieve pricebook IDs from the pricebooks API endpoint.',
		type: 'string',
	},
	product_type: {
		description:
			'Type of the product.  Allowed Values: <code>goods</code>, <code>digital_service</code> and <code>service</code>.',
		type: 'string',
		'x-node_available_in': ['uk', 'eu'],
		'x-node_unavailable_in': [],
	},
	project_id: { description: 'ID of the project', type: 'string' },
	project_name: { description: 'Name of the project.', type: 'string' },
	quantity: {
		description:
			'Number of units being credited for this line item. Must be a positive number. Used to calculate the total amount for the line item.',
		type: 'number',
		format: 'double',
	},
	rate: {
		description:
			'Unit price or rate for the line item. The amount per unit before taxes and discounts. Used with quantity to calculate the line total.',
		type: 'number',
		format: 'double',
	},
	reference_number: {
		description:
			'Optional reference number for tracking purposes. Can be any custom string or auto-generated. Useful for linking to external systems or internal tracking. Max-Length [100]',
		type: 'string',
	},
	'refund-a-vendor-credit-request': {
		required: ['date', 'amount', 'account_id'],
		type: 'object',
		properties: {
			date: { description: 'Date of Vendor Credit Refund', type: 'string' },
			refund_mode: { $ref: '#/components/schemas/refund_mode' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			amount: { $ref: '#/components/schemas/amount' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			account_id: { $ref: '#/components/schemas/account_id' },
			description: { $ref: '#/components/schemas/description' },
		},
	},
	'refund-a-vendor-credit-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			vendor_credit_refund: {
				$ref: '#/components/schemas/vendor_credit_refund',
			},
		},
	},
	refund_mode: { description: 'Mode of Refund', type: 'string' },
	reverse_charge_tax_amount: {
		description: 'Tax amount of the reverse charge',
		type: 'number',
		format: 'double',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	reverse_charge_tax_id: {
		description: 'ID of the reverse charge tax',
		type: 'string',
		'x-node_available_in': ['in', 'gcc', 'za'],
		'x-node_unavailable_in': [],
	},
	reverse_charge_tax_name: {
		description: 'Enter the tax name of the reverse charge',
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	reverse_charge_tax_percentage: {
		description: 'Tax percentage of the reverse charge',
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
		description: 'ID of the Reverse Charge',
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
	reverse_charge_vat_summary: {
		description: 'Summary of the Reverse Charge',
		type: 'array',
		items: {
			type: 'object',
			properties: { tax: { $ref: '#/components/schemas/tax' } },
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
		type: 'array',
		description:
			'Serial numbers associated with the inventory item in the line item.',
		items: { type: 'string' },
	},
	sku: { description: 'SKU of the Item', type: 'string' },
	source_of_supply: {
		description:
			'Place from where the goods/services are supplied. (If not given, <code>place of contact</code> given for the contact will be taken)',
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	status: { type: 'string' },
	stock_on_hand: { description: 'Stock on Hand for that Item', type: 'string' },
	sub_total: { type: 'number', format: 'double' },
	'submit-a-vendor-credit-for-approval-response': {
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
	tax: {
		type: 'object',
		properties: {
			tax_name: { $ref: '#/components/schemas/tax_name' },
			tax_amount: { $ref: '#/components/schemas/tax_amount' },
		},
	},
	tax_amount: {
		description: 'Amount of the Tax',
		type: 'number',
		format: 'double',
	},
	tax_exemption_code: {
		description: 'Code of the Tax Exemption associated',
		type: 'string',
		'x-node_available_in': ['in', 'au'],
		'x-node_unavailable_in': [],
	},
	tax_exemption_id: {
		description: 'ID of the Tax Exemption associated',
		type: 'string',
		'x-node_available_in': ['in', 'au'],
		'x-node_unavailable_in': [],
	},
	tax_id: {
		description:
			'Unique identifier for the tax applied to the line item. Retrieve tax IDs from the List Taxes API endpoint in the taxes section. Determines tax calculations for this line item.',
		type: 'string',
	},
	tax_name: { description: 'Name of the Tax', type: 'string' },
	tax_percentage: {
		description: 'Percentage of Tax',
		type: 'number',
		format: 'double',
	},
	tax_treatment: {
		description:
			'VAT treatment for the vendor credit. Choose whether the vendor falls under: <code>vat_registered</code>,<code>vat_not_registered</code>,<code>gcc_vat_not_registered</code>,<code>gcc_vat_registered</code>,<code>non_gcc</code>.</br><code>dz_vat_registered</code> and <code>dz_vat_not_registered</code> are supported only for <b>UAE</b>.</b></br><code>home_country_mexico</code>,<code>border_region_mexico</code>,<code>non_mexico</code> supported only for <b>MX</b>.<br/><b>For Kenya Edition:</b> <code>vat_registered</code> ,<code>vat_not_registered</code> ,<code>non_kenya</code>(A business that is located outside Kenya).<br/><b>For SouthAfrica Edition:</b> <code>vat_registered</code>, <code>vat_not_registered</code>, <code>overseas</code>(A business that is located outside SouthAfrica).',
		type: 'string',
		'x-node_available_in': ['gcc', 'mx', 'ke', 'za'],
		'x-node_unavailable_in': [],
	},
	tax_treatment_code: {
		description:
			'Specify reason for using out of scope.</br>Supported values for <b>UAE</b> are <code>uae_same_tax_group</code>, <code>uae_reimbursed_expense</code> and <code>uae_others</code>.</br> Supported values for <b>Bahrain</b> are <code>bahrain_same_tax_group</code>, <code>bahrain_transfer_of_concern</code>, <code>bahrain_disbursement</code>, <code>bahrain_head_to_branch_transaction</code>, <code>bahrain_warranty_repair_services</code> and <code>bahrain_others</code>.</br> Supported values for <b>KSA</b> are <code>ksa_reimbursed_expense</code>.',
		type: 'string',
		'x-node_available_in': ['gcc'],
		'x-node_unavailable_in': [],
	},
	tax_type: { description: 'Type of the Tax', type: 'string' },
	taxes: {
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
		description: 'TDS Tax ID of the Tax associated with the Vendor Credit',
		type: 'string',
		'x-node_available_in': ['mx'],
		'x-node_unavailable_in': [],
	},
	time: { description: 'Time of the Comment', type: 'string' },
	total: { type: 'number', format: 'double' },
	total_credits_used: { type: 'number', format: 'double' },
	total_refunded_amount: { type: 'number', format: 'double' },
	transaction_id: {
		description: 'Transaction ID that caused the Comment',
		type: 'string',
	},
	transaction_type: {
		description: 'Transaction Type that caused the Comment',
		type: 'string',
	},
	unit: {
		description:
			'Unit of measurement for the line item quantity. sample: kgs, Nos, hours, pieces. Used to specify how the quantity is measured.',
		type: 'string',
	},
	'update-vendor-credit-refund-request': {
		required: ['date', 'amount', 'account_id'],
		type: 'object',
		properties: {
			date: { $ref: '#/components/schemas/date' },
			refund_mode: { $ref: '#/components/schemas/refund_mode' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			amount: { $ref: '#/components/schemas/amount' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			account_id: { $ref: '#/components/schemas/account_id' },
			description: { $ref: '#/components/schemas/description' },
		},
	},
	'update-vendor-credit-refund-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			vendor_credit_refund: {
				$ref: '#/components/schemas/vendor_credit_refund',
			},
		},
	},
	'update-vendor-credit-request': {
		required: ['vendor_id'],
		type: 'object',
		properties: {
			vendor_id: { $ref: '#/components/schemas/vendor_id' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			vendor_credit_number: {
				description: 'Mandatory if auto number generation is disabled.',
				type: 'string',
			},
			gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			gst_no: { $ref: '#/components/schemas/gst_no' },
			source_of_supply: { $ref: '#/components/schemas/source_of_supply' },
			destination_of_supply: {
				$ref: '#/components/schemas/destination_of_supply',
			},
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			pricebook_id: { $ref: '#/components/schemas/pricebook_id' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			is_update_customer: { $ref: '#/components/schemas/is_update_customer' },
			date: { $ref: '#/components/schemas/date' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			location_id: { $ref: '#/components/schemas/location_id' },
			line_items: { $ref: '#/components/schemas/line_items' },
			notes: { $ref: '#/components/schemas/notes' },
			documents: { $ref: '#/components/schemas/documents' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			tags: { $ref: '#/components/schemas/tags' },
		},
	},
	'update-vendor-credit-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			vendor_credit: {
				type: 'object',
				properties: {
					vendor_credit_id: { $ref: '#/components/schemas/vendor_credit_id' },
					vendor_credit_number: {
						$ref: '#/components/schemas/vendor_credit_number',
					},
					date: { $ref: '#/components/schemas/date' },
					source_of_supply: { $ref: '#/components/schemas/source_of_supply' },
					destination_of_supply: {
						$ref: '#/components/schemas/destination_of_supply',
					},
					place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
					gst_no: { $ref: '#/components/schemas/gst_no' },
					gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
					tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
					pricebook_id: { $ref: '#/components/schemas/pricebook_id' },
					is_reverse_charge_applied: {
						$ref: '#/components/schemas/is_reverse_charge_applied',
					},
					status: { $ref: '#/components/schemas/status' },
					reference_number: { $ref: '#/components/schemas/reference_number' },
					vendor_id: { $ref: '#/components/schemas/vendor_id' },
					vendor_name: { $ref: '#/components/schemas/vendor_name' },
					currency_id: { $ref: '#/components/schemas/currency_id' },
					currency_code: { $ref: '#/components/schemas/currency_code' },
					exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
					price_precision: { $ref: '#/components/schemas/price_precision' },
					vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
					taxes: { $ref: '#/components/schemas/taxes' },
					is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
					location_id: { $ref: '#/components/schemas/location_id' },
					location_name: { $ref: '#/components/schemas/location_name' },
					line_items: {
						description: 'Line items of a vendor credit.',
						type: 'object',
						properties: {
							item_id: { $ref: '#/components/schemas/item_id' },
							line_item_id: { $ref: '#/components/schemas/line_item_id' },
							sku: { $ref: '#/components/schemas/sku' },
							account_id: { $ref: '#/components/schemas/account_id' },
							product_type: { $ref: '#/components/schemas/product_type' },
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
							account_name: { $ref: '#/components/schemas/account_name' },
							name: { $ref: '#/components/schemas/name' },
							description: { $ref: '#/components/schemas/description' },
							item_order: { $ref: '#/components/schemas/item_order' },
							quantity: { $ref: '#/components/schemas/quantity' },
							unit: { $ref: '#/components/schemas/unit' },
							bcy_rate: { $ref: '#/components/schemas/bcy_rate' },
							rate: { $ref: '#/components/schemas/rate' },
							tax_id: { $ref: '#/components/schemas/tax_id' },
							tds_tax_id: { $ref: '#/components/schemas/tds_tax_id' },
							tax_treatment_code: {
								$ref: '#/components/schemas/tax_treatment_code',
							},
							tax_exemption_id: {
								$ref: '#/components/schemas/tax_exemption_id',
							},
							tax_exemption_code: {
								$ref: '#/components/schemas/tax_exemption_code',
							},
							tax_name: { $ref: '#/components/schemas/tax_name' },
							tax_type: { $ref: '#/components/schemas/tax_type' },
							tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
							project_id: { $ref: '#/components/schemas/project_id' },
							project_name: { $ref: '#/components/schemas/project_name' },
							item_total: { $ref: '#/components/schemas/item_total' },
							item_total_inclusive_of_tax: {
								$ref: '#/components/schemas/item_total_inclusive_of_tax',
							},
							hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
							acquisition_vat_id: {
								$ref: '#/components/schemas/acquisition_vat_id',
							},
							acquisition_vat_name: {
								$ref: '#/components/schemas/acquisition_vat_name',
							},
							acquisition_vat_percentage: {
								$ref: '#/components/schemas/acquisition_vat_percentage',
							},
							acquisition_vat_amount: {
								$ref: '#/components/schemas/acquisition_vat_amount',
							},
							location_id: { $ref: '#/components/schemas/location_id' },
							location_name: { $ref: '#/components/schemas/location_name' },
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
							stock_on_hand: { $ref: '#/components/schemas/stock_on_hand' },
							tags: { $ref: '#/components/schemas/tags_response' },
							line_item_category: {
								$ref: '#/components/schemas/line_item_category',
							},
							item_custom_fields: {
								$ref: '#/components/schemas/item_custom_fields',
							},
						},
					},
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
					documents: { $ref: '#/components/schemas/documents' },
					custom_fields: { $ref: '#/components/schemas/custom_fields' },
					sub_total: { $ref: '#/components/schemas/sub_total' },
					total: { $ref: '#/components/schemas/total' },
					total_credits_used: {
						$ref: '#/components/schemas/total_credits_used',
					},
					total_refunded_amount: {
						$ref: '#/components/schemas/total_refunded_amount',
					},
					balance: { $ref: '#/components/schemas/balance' },
					notes: { $ref: '#/components/schemas/notes' },
					comments: { $ref: '#/components/schemas/comments' },
					vendor_credit_refunds: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								vendor_credit_refund_id: {
									$ref: '#/components/schemas/vendor_credit_refund_id',
								},
								vendor_credit_id: {
									$ref: '#/components/schemas/vendor_credit_id',
								},
								date: {
									description: 'Date of the Vendor Credit Refund',
									type: 'string',
								},
								refund_mode: { $ref: '#/components/schemas/refund_mode' },
								reference_number: {
									$ref: '#/components/schemas/reference_number',
								},
								description: { $ref: '#/components/schemas/description' },
								amount_bcy: { $ref: '#/components/schemas/amount_bcy' },
								amount_fcy: { $ref: '#/components/schemas/amount_fcy' },
							},
						},
					},
					bills_credited: { $ref: '#/components/schemas/bills_credited' },
					created_time: { $ref: '#/components/schemas/created_time' },
					last_modified_time: {
						$ref: '#/components/schemas/last_modified_time',
					},
					tags: { $ref: '#/components/schemas/tags_response' },
				},
			},
		},
	},
	value: { description: 'Value of the Custom Field', type: 'string' },
	vat_treatment: {
		description:
			'VAT treatment for the vendor credits. VAT treatment denotes the location of the customer, if the customer resides in UK then the VAT treatment is <code>uk</code>. If the vendor is in an EU country & VAT registered, you are resides in Northen Ireland and purchasing Goods then his VAT treatment is <code>eu_vat_registered</code>and if he resides outside the EU then his VAT treatment is <code>overseas</code>(For Pre Brexit, this can be split as <code>eu_vat_registered</code>, <code>eu_vat_not_registered</code> and <code>non_eu</code>).',
		type: 'string',
		'x-node_available_in': ['uk'],
		'x-node_unavailable_in': [],
	},
	'vendor_credit-response': {
		type: 'object',
		properties: {
			vendor_credit_id: { $ref: '#/components/schemas/vendor_credit_id' },
			vendor_credit_number: {
				$ref: '#/components/schemas/vendor_credit_number',
			},
			date: { $ref: '#/components/schemas/date' },
			source_of_supply: { $ref: '#/components/schemas/source_of_supply' },
			destination_of_supply: {
				$ref: '#/components/schemas/destination_of_supply',
			},
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			gst_no: { $ref: '#/components/schemas/gst_no' },
			gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			pricebook_id: { $ref: '#/components/schemas/pricebook_id' },
			is_reverse_charge_applied: {
				$ref: '#/components/schemas/is_reverse_charge_applied',
			},
			status: { $ref: '#/components/schemas/status' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			vendor_id: { $ref: '#/components/schemas/vendor_id' },
			vendor_name: { $ref: '#/components/schemas/vendor_name' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			currency_code: { $ref: '#/components/schemas/currency_code' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			price_precision: { $ref: '#/components/schemas/price_precision' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			filed_in_vat_return_id: {
				$ref: '#/components/schemas/filed_in_vat_return_id',
			},
			filed_in_vat_return_name: {
				$ref: '#/components/schemas/filed_in_vat_return_name',
			},
			filed_in_vat_return_type: {
				$ref: '#/components/schemas/filed_in_vat_return_type',
			},
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			location_id: { $ref: '#/components/schemas/location_id' },
			location_name: { $ref: '#/components/schemas/location_name' },
			tags: { $ref: '#/components/schemas/tags_response' },
			line_items: {
				description: 'Line items of a vendor credit.',
				type: 'object',
				properties: {
					item_id: { $ref: '#/components/schemas/item_id' },
					line_item_id: { $ref: '#/components/schemas/line_item_id' },
					sku: { $ref: '#/components/schemas/sku' },
					account_id: { $ref: '#/components/schemas/account_id' },
					product_type: { $ref: '#/components/schemas/product_type' },
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
					account_name: { $ref: '#/components/schemas/account_name' },
					name: { $ref: '#/components/schemas/name' },
					description: { $ref: '#/components/schemas/description' },
					item_order: { $ref: '#/components/schemas/item_order' },
					quantity: { $ref: '#/components/schemas/quantity' },
					unit: { $ref: '#/components/schemas/unit' },
					bcy_rate: { $ref: '#/components/schemas/bcy_rate' },
					rate: { $ref: '#/components/schemas/rate' },
					tax_id: { $ref: '#/components/schemas/tax_id' },
					tds_tax_id: { $ref: '#/components/schemas/tds_tax_id' },
					tax_treatment_code: {
						$ref: '#/components/schemas/tax_treatment_code',
					},
					tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
					tax_exemption_code: {
						$ref: '#/components/schemas/tax_exemption_code',
					},
					tax_name: { $ref: '#/components/schemas/tax_name' },
					tax_type: { $ref: '#/components/schemas/tax_type' },
					tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
					project_id: { $ref: '#/components/schemas/project_id' },
					project_name: { $ref: '#/components/schemas/project_name' },
					item_total: { $ref: '#/components/schemas/item_total' },
					item_total_inclusive_of_tax: {
						$ref: '#/components/schemas/item_total_inclusive_of_tax',
					},
					hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
					acquisition_vat_id: {
						$ref: '#/components/schemas/acquisition_vat_id',
					},
					acquisition_vat_name: {
						$ref: '#/components/schemas/acquisition_vat_name',
					},
					acquisition_vat_percentage: {
						$ref: '#/components/schemas/acquisition_vat_percentage',
					},
					acquisition_vat_amount: {
						$ref: '#/components/schemas/acquisition_vat_amount',
					},
					location_id: { $ref: '#/components/schemas/location_id' },
					location_name: { $ref: '#/components/schemas/location_name' },
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
					stock_on_hand: { $ref: '#/components/schemas/stock_on_hand' },
					tags: { $ref: '#/components/schemas/tags' },
					line_item_category: {
						$ref: '#/components/schemas/line_item_category',
					},
					item_custom_fields: {
						$ref: '#/components/schemas/item_custom_fields',
					},
				},
			},
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
			documents: { $ref: '#/components/schemas/documents' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			sub_total: { $ref: '#/components/schemas/sub_total' },
			total: { $ref: '#/components/schemas/total' },
			total_credits_used: { $ref: '#/components/schemas/total_credits_used' },
			total_refunded_amount: {
				$ref: '#/components/schemas/total_refunded_amount',
			},
			balance: { $ref: '#/components/schemas/balance' },
			notes: { $ref: '#/components/schemas/notes' },
			comments: { $ref: '#/components/schemas/comments' },
			vendor_credit_refunds: {
				$ref: '#/components/schemas/vendor_credit_refunds',
			},
			bills_credited: { $ref: '#/components/schemas/bills_credited' },
			created_time: { $ref: '#/components/schemas/created_time' },
			last_modified_time: { $ref: '#/components/schemas/last_modified_time' },
		},
	},
	vendor_credit_bill_id: {
		description: 'ID of the Vendor Credited Bill ID',
		type: 'string',
	},
	vendor_credit_id: { description: 'ID of the Vendor Credit', type: 'string' },
	vendor_credit_number: {
		description:
			'Unique vendor credit number displayed in the interface. Auto-generated with DN prefix unless auto number generation is disabled. Max-Length [100]',
		type: 'string',
	},
	vendor_credit_refund: {
		type: 'object',
		properties: {
			vendor_credit_refund_id: {
				$ref: '#/components/schemas/vendor_credit_refund_id',
			},
			vendor_credit_id: { $ref: '#/components/schemas/vendor_credit_id' },
			date: { $ref: '#/components/schemas/date' },
			refund_mode: { $ref: '#/components/schemas/refund_mode' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			amount: { $ref: '#/components/schemas/amount' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			account_id: { $ref: '#/components/schemas/account_id' },
			account_name: { $ref: '#/components/schemas/account_name' },
			description: { $ref: '#/components/schemas/description' },
			imported_transactions: {
				$ref: '#/components/schemas/imported_transactions',
			},
		},
	},
	vendor_credit_refund_id: {
		description: 'ID of the Vendor Credit Refund',
		type: 'string',
	},
	vendor_credit_refunds: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				vendor_credit_refund_id: {
					$ref: '#/components/schemas/vendor_credit_refund_id',
				},
				vendor_credit_id: { $ref: '#/components/schemas/vendor_credit_id' },
				date: { $ref: '#/components/schemas/date' },
				refund_mode: { $ref: '#/components/schemas/refund_mode' },
				reference_number: { $ref: '#/components/schemas/reference_number' },
				description: { $ref: '#/components/schemas/description' },
				amount_bcy: { $ref: '#/components/schemas/amount_bcy' },
				amount_fcy: { $ref: '#/components/schemas/amount_fcy' },
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
	vendor_id: {
		description:
			'Unique identifier for the vendor contact. Retrieve vendor IDs from the Get Contacts API endpoint in the contacts section. This ID links the vendor credit to the specific vendor record.',
		type: 'string',
	},
	vendor_name: {
		description: 'Name of the Vendor Associated with the Vendor Credit',
		type: 'string',
	},
	'void-vendor-credit-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
} as const satisfies Record<string, JsonValue>;

export const operations = [
	{
		id: 'create_vendor_credit',
		group: 'vendorCredits',
		groupSlug: 'vendor-credits',
		name: 'createVendorCredit',
		method: 'POST',
		path: '/vendorcredits',
		summary: 'Create a vendor credit',
		description:
			'Create a new vendor credit to record credits issued by vendors for returned items, overpayments, or adjustments. Supports multi-currency transactions, custom line items, tax calculations, and workflows.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-credits/',
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
					'Ignore auto number generation for this vendor credit only. On enabling this option vendor credit number is mandatory.',
				schema: { type: 'boolean' },
			},
			{
				name: 'bill_id',
				in: 'query',
				required: false,
				description: 'Bill Associated with the Vendor Credit',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/create-a-vendor-credit-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/create-a-vendor-credit-response',
				},
			},
		],
		scopes: ['ZohoBooks.debitnotes.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_vendor_credits',
		group: 'vendorCredits',
		groupSlug: 'vendor-credits',
		name: 'listVendorCredits',
		method: 'GET',
		path: '/vendorcredits',
		summary: 'List vendor credits',
		description:
			'Retrieve a paginated list of vendor credits with comprehensive filtering, sorting, and search capabilities. Use query parameters to filter by date, status, amount, vendor details, items, taxes, and custom fields.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-credits/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'vendor_credit_number',
				in: 'query',
				required: false,
				description:
					'Filter vendor credits by specific vendor credit number. Supports variants <code>vendor_credit_number_startswith</code> and <code>vendor_credit_number_contains</code> for partial matching.',
				schema: { type: 'string' },
			},
			{
				name: 'date',
				in: 'query',
				required: false,
				description:
					'Filter vendor credits by creation date. Use yyyy-mm-dd format. Supports variants: <code>date_start</code>, <code>date_end</code>, <code>date_before</code> and <code>date_after</code> for range-based filtering.',
				schema: { type: 'string' },
			},
			{
				name: 'status',
				in: 'query',
				required: false,
				description:
					'Filter vendor credits by their current status. Allowed values: <code>open</code>, <code>closed</code>, <code>void</code>, or <code>draft</code>.',
				schema: {
					type: 'string',
					enum: [
						'open',
						'draft',
						'void',
						'closed',
						'pending_approval',
						'approval_overdue',
						'rejected',
						'approved',
					],
				},
			},
			{
				name: 'total',
				in: 'query',
				required: false,
				description:
					'Search vendor credits by total amount. Filters vendor credits based on the final vendor credit amount including taxes, discounts, and adjustments. Useful for finding vendor credits within specific price ranges or identifying high-value transactions.',
				schema: { type: 'string' },
			},
			{
				name: 'reference_number',
				in: 'query',
				required: false,
				description:
					'Search vendor credits by reference number. Filters vendor credits based on external reference identifiers like purchase order numbers, contract numbers, or project codes. Useful for finding vendor credits associated with specific projects or business transactions.',
				schema: { type: 'string' },
			},
			{
				name: 'customer_name',
				in: 'query',
				required: false,
				description:
					'Search vendor credits by customer name. Filters vendor credits based on the business or individual name associated with the vendor credit. Maximum length is 100 characters. Useful for finding all vendor credits for a specific contact or generating contact reports.',
				schema: { type: 'string' },
			},
			{
				name: 'item_name',
				in: 'query',
				required: false,
				description:
					'Search vendor credits by item name. Filters vendor credits based on product or service names in vendor credit line items. Supports <code>item_name_startswith</code> and <code>item_name_contains</code> variants. Maximum length is 100 characters. Useful for finding vendor credits with specific products or services.',
				schema: { type: 'string' },
			},
			{
				name: 'item_description',
				in: 'query',
				required: false,
				description:
					'Search vendor credits by item description. Filters vendor credits based on detailed descriptions of products or services in line items. Supports <code>item_description_startswith</code> and <code>item_description_contains</code> variants. Maximum length is 100 characters. Useful for finding vendor credits with specific item descriptions or technical specifications.',
				schema: { type: 'string' },
			},
			{
				name: 'notes',
				in: 'query',
				required: false,
				description:
					'Filter vendor credits by notes content. Supports variants: <code>notes_startswith</code> and <code>notes_contains</code> for partial matching.',
				schema: { type: 'string' },
			},
			{
				name: 'custom_field',
				in: 'query',
				required: false,
				description:
					'Filter vendor credits by custom field values. Supports variants: <code>custom_field_startswith</code> and <code>custom_field_contains</code> for partial matching.',
				schema: { type: 'string' },
			},
			{
				name: 'last_modified_time',
				in: 'query',
				required: false,
				description:
					'Search vendor credits modified after a specific time. Filters vendor credits based on their last modification timestamp. Use YYYY-MM-DDTHH:MM:SS-UTC format. Useful for finding recently updated vendor credits or syncing data changes. sample : 2023-11-18T02:02:51-0800, 2025-19-19T02:02:51%2B0800',
				schema: { type: 'string' },
			},
			{
				name: 'customer_id',
				in: 'query',
				required: false,
				description:
					'Search vendor credits by customer ID. Filters vendor credits based on the unique identifier of the customer for whom the vendor credit was created. Use the customer ID returned by the Contacts API to find all vendor credits for a specific customer. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'line_item_id',
				in: 'query',
				required: false,
				description:
					'Filter vendor credits by line item ID. Use this parameter to search for vendor credits containing a specific line item within the vendor credit.',
				schema: { type: 'string' },
			},
			{
				name: 'item_id',
				in: 'query',
				required: false,
				description:
					'Filter vendor credits by item ID. Use this parameter to search for vendor credits containing a specific item. Retrieve item IDs from the items API.',
				schema: { type: 'string' },
			},
			{
				name: 'tax_id',
				in: 'query',
				required: false,
				description:
					'Filter vendor credits by tax ID. Use this parameter to search for vendor credits with a specific tax applied. Retrieve tax IDs from the taxes API.',
				schema: { type: 'string' },
			},
			{
				name: 'filter_by',
				in: 'query',
				required: false,
				description:
					'Filter vendor credits by status using predefined status values. Allowed values: <code>Status.All</code>, <code>Status.Open</code>, <code>Status.Draft</code>, <code>Status.Closed</code>, and <code>Status.Void</code>.',
				schema: {
					type: 'string',
					enum: [
						'Status.All',
						'Status.Open',
						'Status.Closed',
						'Status.Void',
						'Status.Draft',
						'Status.Pending',
						'Status.ApprovalOverdue',
						'Status.MyApprovals',
						'Status.EInvoicedDebitnotes',
						'Status.EInvoicePendingDebitnotes',
						'Status.BBPSYetToBePushed',
						'Status.BBPSPushed',
						'Status.BBPSPushFailed',
						'Status.BBPSPendingApproval',
						'Status.BBPSAccepted',
						'Status.BBPSAcceptFailed',
						'Status.BBPSRejected',
						'Status.BBPSRejectFailed',
						'Status.BBPSReturned',
						'Status.BBPSReturnFailed',
						'ExceptionList',
						'MissingAdvancedTrackingDetails',
					],
				},
			},
			{
				name: 'search_text',
				in: 'query',
				required: false,
				description:
					'Search vendor credits using text search across multiple fields. Searches vendor credit number, vendor name, and reference number.',
				schema: { type: 'string' },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description:
					'Sort vendor credits by specified column. Allowed values: <code>vendor_name</code>, <code>vendor_credit_number</code>, <code>balance</code>, <code>total</code>, <code>date</code>, <code>created_time</code>, <code>last_modified_time</code>, and <code>reference_number</code>.',
				schema: {
					type: 'string',
					enum: [
						'vendor_name',
						'vendor_credit_number',
						'balance',
						'total',
						'date',
						'created_time',
						'last_modified_time',
						'reference_number',
						'txn_posting_date',
					],
				},
			},
			{
				name: 'page',
				in: 'query',
				required: false,
				description:
					'Page number for pagination. Specify which page of results to retrieve. Default value is 1.',
				schema: { type: 'integer', default: 1 },
			},
			{
				name: 'per_page',
				in: 'query',
				required: false,
				description:
					'Number of records per page for pagination. Controls how many vendor credits are returned in each page.',
				schema: { type: 'integer', default: 10 },
			},
			{
				name: 'location_ids',
				in: 'query',
				required: false,
				description:
					'List of location IDs to filter vendor credits by their associated locations. Use this parameter to retrieve vendor credits linked to specific business locations. Note: This value is a comma-separated list of numeric location IDs.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/list-vendor-credits-response' },
			},
		],
		scopes: ['ZohoBooks.debitnotes.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_vendor_credit',
		group: 'vendorCredits',
		groupSlug: 'vendor-credits',
		name: 'updateVendorCredit',
		method: 'PUT',
		path: '/vendorcredits/{vendor_credit_id}',
		summary: 'Update vendor credit',
		description: 'Update an existing vendor credit.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-credits/',
		parameters: [
			{
				name: 'vendor_credit_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the vendor credit.',
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
			schema: { $ref: '#/components/schemas/update-vendor-credit-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-vendor-credit-response' },
			},
		],
		scopes: ['ZohoBooks.debitnotes.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_vendor_credit',
		group: 'vendorCredits',
		groupSlug: 'vendor-credits',
		name: 'getVendorCredit',
		method: 'GET',
		path: '/vendorcredits/{vendor_credit_id}',
		summary: 'Get vendor credit',
		description: 'Get details of a vendor credit.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-credits/',
		parameters: [
			{
				name: 'vendor_credit_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the vendor credit.',
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
				name: 'print',
				in: 'query',
				required: false,
				description:
					'Export vendor credit pdf with default print option. Allowed Values: <code>true</code>, <code>false</code>, <code>on</code> and <code>off</code>.',
				schema: { type: 'boolean' },
			},
			{
				name: 'accept',
				in: 'query',
				required: false,
				description:
					'You can get vendor credit details as json/pdf/html. Default format is html. Allowed Values: <code>json</code>, <code>xml</code>, <code>csv</code>, <code>xls</code>, <code>pdf</code>, <code>html</code> and <code>jhtml</code>.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/get-vendor-credit-response' },
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
		scopes: ['ZohoBooks.debitnotes.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_vendor_credit',
		group: 'vendorCredits',
		groupSlug: 'vendor-credits',
		name: 'deleteVendorCredit',
		method: 'DELETE',
		path: '/vendorcredits/{vendor_credit_id}',
		summary: 'Delete vendor credit',
		description: 'Delete a vendor credit.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-credits/',
		parameters: [
			{
				name: 'vendor_credit_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the vendor credit.',
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
				schema: { $ref: '#/components/schemas/delete-vendor-credit-response' },
			},
		],
		scopes: ['ZohoBooks.debitnotes.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'mark_vendor_credit_open',
		group: 'vendorCredits',
		groupSlug: 'vendor-credits',
		name: 'markVendorCreditOpen',
		method: 'POST',
		path: '/vendorcredits/{vendor_credit_id}/status/open',
		summary: 'Convert to open',
		description: 'Change an existing vendor credit status to open.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-credits/',
		parameters: [
			{
				name: 'vendor_credit_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the vendor credit.',
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
				schema: { $ref: '#/components/schemas/convert-to-open-response' },
			},
		],
		scopes: ['ZohoBooks.debitnotes.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_vendor_credit_void',
		group: 'vendorCredits',
		groupSlug: 'vendor-credits',
		name: 'markVendorCreditVoid',
		method: 'POST',
		path: '/vendorcredits/{vendor_credit_id}/status/void',
		summary: 'Void vendor credit',
		description: 'Mark an existing vendor credit as void.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-credits/',
		parameters: [
			{
				name: 'vendor_credit_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the vendor credit.',
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
				schema: { $ref: '#/components/schemas/void-vendor-credit-response' },
			},
		],
		scopes: ['ZohoBooks.debitnotes.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'submit_vendor_credit',
		group: 'vendorCredits',
		groupSlug: 'vendor-credits',
		name: 'submitVendorCredit',
		method: 'POST',
		path: '/vendorcredits/{vendor_credit_id}/submit',
		summary: 'Submit a Vendor credit for approval',
		description: 'Submit a Vendor credit for approval.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-credits/',
		parameters: [
			{
				name: 'vendor_credit_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the vendor credit.',
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
					$ref: '#/components/schemas/submit-a-vendor-credit-for-approval-response',
				},
			},
		],
		scopes: ['ZohoBooks.debitnotes.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'approve_vendor_credit',
		group: 'vendorCredits',
		groupSlug: 'vendor-credits',
		name: 'approveVendorCredit',
		method: 'POST',
		path: '/vendorcredits/{vendor_credit_id}/approve',
		summary: 'Approve a Vendor credit',
		description: 'Approve a Vendor credit.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-credits/',
		parameters: [
			{
				name: 'vendor_credit_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the vendor credit.',
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
					$ref: '#/components/schemas/approve-a-vendor-credit-response',
				},
			},
		],
		scopes: ['ZohoBooks.debitnotes.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'list_bills_credited',
		group: 'vendorCredits',
		groupSlug: 'vendor-credits',
		name: 'listBillsCredited',
		method: 'GET',
		path: '/vendorcredits/{vendor_credit_id}/bills',
		summary: 'List bills credited',
		description: 'List bills to which the vendor credit is applied.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-credits/',
		parameters: [
			{
				name: 'vendor_credit_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the vendor credit.',
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
				schema: { $ref: '#/components/schemas/list-bills-credited-response' },
			},
		],
		scopes: ['ZohoBooks.debitnotes.READ'],
		riskLevel: 'read',
	},
	{
		id: 'apply_credits_to_a_bill',
		group: 'vendorCredits',
		groupSlug: 'vendor-credits',
		name: 'applyCreditsToABill',
		method: 'POST',
		path: '/vendorcredits/{vendor_credit_id}/bills',
		summary: 'Apply credits to a bill',
		description: 'Apply vendor credit to existing bills.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-credits/',
		parameters: [
			{
				name: 'vendor_credit_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the vendor credit.',
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
			schema: { $ref: '#/components/schemas/apply-credits-to-a-bill-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/apply-credits-to-a-bill-response',
				},
			},
		],
		scopes: ['ZohoBooks.debitnotes.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_vendor_credit_bill',
		group: 'vendorCredits',
		groupSlug: 'vendor-credits',
		name: 'deleteVendorCreditBill',
		method: 'DELETE',
		path: '/vendorcredits/{vendor_credit_id}/bills/{vendor_credit_bill_id}',
		summary: 'Delete bills credited',
		description:
			'Delete the credits applied to a bill. <code>Note: </code>You should pass the vendor_credit_bill_id from "Get vendor credits > bills credited > vendor_credit_bill_id" section',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-credits/',
		parameters: [
			{
				name: 'vendor_credit_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the vendor credit.',
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
				name: 'vendor_credit_bill_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the vendor credit bill.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/delete-bills-credited-response' },
			},
		],
		scopes: ['ZohoBooks.debitnotes.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'refund_vendor_credit',
		group: 'vendorCredits',
		groupSlug: 'vendor-credits',
		name: 'refundVendorCredit',
		method: 'POST',
		path: '/vendorcredits/{vendor_credit_id}/refunds',
		summary: 'Refund a vendor credit',
		description: 'Refund vendor credit amount.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-credits/',
		parameters: [
			{
				name: 'vendor_credit_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the vendor credit.',
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
			schema: { $ref: '#/components/schemas/refund-a-vendor-credit-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/refund-a-vendor-credit-response',
				},
			},
		],
		scopes: ['ZohoBooks.debitnotes.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'list_vendor_credit_refunds_of_a_vendor_credit',
		group: 'vendorCredits',
		groupSlug: 'vendor-credits',
		name: 'listVendorCreditRefundsOfAVendorCredit',
		method: 'GET',
		path: '/vendorcredits/{vendor_credit_id}/refunds',
		summary: 'List refunds of a vendor credit',
		description: 'List all refunds of an existing vendor credit.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-credits/',
		parameters: [
			{
				name: 'vendor_credit_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the vendor credit.',
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
				description:
					'Page number for pagination. Specify which page of results to retrieve. Default value is 1.',
				schema: { type: 'integer', default: 1 },
			},
			{
				name: 'per_page',
				in: 'query',
				required: false,
				description:
					'Number of records per page for pagination. Controls how many vendor credits are returned in each page.',
				schema: { type: 'integer', default: 10 },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/list-refunds-of-a-vendor-credit-response',
				},
			},
		],
		scopes: ['ZohoBooks.debitnotes.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_vendor_credit_refund',
		group: 'vendorCredits',
		groupSlug: 'vendor-credits',
		name: 'updateVendorCreditRefund',
		method: 'PUT',
		path: '/vendorcredits/{vendor_credit_id}/refunds/{vendor_credit_refund_id}',
		summary: 'Update vendor credit refund',
		description: 'Update the refunded transaction.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-credits/',
		parameters: [
			{
				name: 'vendor_credit_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the vendor credit.',
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
				name: 'vendor_credit_refund_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the vendor credit refund.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: {
				$ref: '#/components/schemas/update-vendor-credit-refund-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-vendor-credit-refund-response',
				},
			},
		],
		scopes: ['ZohoBooks.debitnotes.UPDATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_vendor_credit_refund',
		group: 'vendorCredits',
		groupSlug: 'vendor-credits',
		name: 'getVendorCreditRefund',
		method: 'GET',
		path: '/vendorcredits/{vendor_credit_id}/refunds/{vendor_credit_refund_id}',
		summary: 'Get vendor credit refund',
		description: 'Get refund of a particular vendor credit.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-credits/',
		parameters: [
			{
				name: 'vendor_credit_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the vendor credit.',
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
				name: 'vendor_credit_refund_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the vendor credit refund.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/get-vendor-credit-refund-response',
				},
			},
		],
		scopes: ['ZohoBooks.debitnotes.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_vendor_credit_refund',
		group: 'vendorCredits',
		groupSlug: 'vendor-credits',
		name: 'deleteVendorCreditRefund',
		method: 'DELETE',
		path: '/vendorcredits/{vendor_credit_id}/refunds/{vendor_credit_refund_id}',
		summary: 'Delete vendor credit refund',
		description: 'Delete a vendor credit refund.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-credits/',
		parameters: [
			{
				name: 'vendor_credit_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the vendor credit.',
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
				name: 'vendor_credit_refund_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the vendor credit refund.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/delete-vendor-credit-refund-response',
				},
			},
		],
		scopes: ['ZohoBooks.debitnotes.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'list_vendor_credit_refunds_of_all_vendor_credits',
		group: 'vendorCredits',
		groupSlug: 'vendor-credits',
		name: 'listVendorCreditRefundsOfAllVendorCredits',
		method: 'GET',
		path: '/vendorcredits/refunds',
		summary: 'List vendor credit refunds',
		description: 'List all refunds with pagination.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-credits/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'customer_id',
				in: 'query',
				required: false,
				description: 'Search vendor credits by vendor credit customer ID',
				schema: { type: 'string' },
			},
			{
				name: 'last_modified_time',
				in: 'query',
				required: false,
				description:
					'Search vendor credits by vendor credit last modfified time',
				schema: { type: 'string' },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description:
					'Sort vendor credits by following columns vendor_name, vendorcredit_number, balance, total, date and created_time. Allowed Values: <code>vendor_name</code>, <code>vendor_credit_number</code>, <code>balance</code>, <code>total</code>, <code>date</code>, <code>created_time</code>, <code>last_modified_time</code> and <code>reference_number</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'page',
				in: 'query',
				required: false,
				description:
					'Page number for pagination. Specify which page of results to retrieve. Default value is 1.',
				schema: { type: 'integer', default: 1 },
			},
			{
				name: 'per_page',
				in: 'query',
				required: false,
				description:
					'Number of records per page for pagination. Controls how many vendor credits are returned in each page.',
				schema: { type: 'integer', default: 10 },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/list-vendor-credit-refunds-response',
				},
			},
		],
		scopes: ['ZohoBooks.debitnotes.READ'],
		riskLevel: 'read',
	},
	{
		id: 'add_vendor_credit_comment',
		group: 'vendorCredits',
		groupSlug: 'vendor-credits',
		name: 'addVendorCreditComment',
		method: 'POST',
		path: '/vendorcredits/{vendor_credit_id}/comments',
		summary: 'Add a comment',
		description: 'Add a comment to an existing vendor credit.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-credits/',
		parameters: [
			{
				name: 'vendor_credit_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the vendor credit.',
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
			schema: { $ref: '#/components/schemas/add-a-comment-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/add-a-comment-response' },
			},
		],
		scopes: ['ZohoBooks.debitnotes.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_vendor_credit_comments',
		group: 'vendorCredits',
		groupSlug: 'vendor-credits',
		name: 'listVendorCreditComments',
		method: 'GET',
		path: '/vendorcredits/{vendor_credit_id}/comments',
		summary: 'List vendor credit comments & history',
		description: 'Get history and comments of a vendor credit.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-credits/',
		parameters: [
			{
				name: 'vendor_credit_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the vendor credit.',
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
					$ref: '#/components/schemas/list-vendor-credit-comments-and-history-response',
				},
			},
		],
		scopes: ['ZohoBooks.debitnotes.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_vendor_credit_comment',
		group: 'vendorCredits',
		groupSlug: 'vendor-credits',
		name: 'deleteVendorCreditComment',
		method: 'DELETE',
		path: '/vendorcredits/{vendor_credit_id}/comments/{comment_id}',
		summary: 'Delete a comment',
		description: 'Delete a vendor credit comment.',
		docsUrl: 'https://www.zoho.com/books/api/v3/vendor-credits/',
		parameters: [
			{
				name: 'vendor_credit_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the vendor credit.',
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
		scopes: ['ZohoBooks.debitnotes.DELETE'],
		riskLevel: 'destructive',
	},
] as const satisfies readonly ZohoBooksOperationDefinition[];
