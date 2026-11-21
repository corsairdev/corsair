import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas: Record<string, JsonValue> = {
	abn: {
		description: 'Australian Business Number (ABN) of the vendor.',
		type: 'string',
		'x-node_available_in': ['au'],
		'x-node_unavailable_in': [],
	},
	account_id: {
		description: 'ID of the account associated with the line item.',
		type: 'string',
	},
	account_name: { description: 'Name of the Account', type: 'string' },
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
	bcy_rate: {
		description: 'Rate in Base Currency of the Organization',
		type: 'integer',
	},
	'create-a-recurring-bill-request': {
		required: [
			'vendor_id',
			'recurrence_name',
			'start_date',
			'repeat_every',
			'recurrence_frequency',
		],
		type: 'object',
		properties: {
			vendor_id: { $ref: '#/components/schemas/vendor_id' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			recurrence_name: { $ref: '#/components/schemas/recurrence_name' },
			start_date: { $ref: '#/components/schemas/start_date' },
			end_date: { $ref: '#/components/schemas/end_date' },
			source_of_supply: { $ref: '#/components/schemas/source_of_supply' },
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			destination_of_supply: {
				$ref: '#/components/schemas/destination_of_supply',
			},
			gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
			gst_no: { $ref: '#/components/schemas/gst_no' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			vat_reg_no: { $ref: '#/components/schemas/vat_reg_no' },
			is_abn_quoted: { $ref: '#/components/schemas/is_abn_quoted' },
			abn: { $ref: '#/components/schemas/abn' },
			is_reverse_charge_applied: {
				$ref: '#/components/schemas/is_reverse_charge_applied',
			},
			pricebook_id: { $ref: '#/components/schemas/pricebook_id' },
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			location_id: { $ref: '#/components/schemas/location_id' },
			line_items: {
				description: 'Line items of a recurrence bill.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						line_item_id: { $ref: '#/components/schemas/line_item_id' },
						item_id: { $ref: '#/components/schemas/item_id' },
						name: { $ref: '#/components/schemas/name' },
						account_id: { $ref: '#/components/schemas/account_id' },
						description: { $ref: '#/components/schemas/description' },
						rate: { $ref: '#/components/schemas/rate' },
						hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
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
			is_tds_applied: { $ref: '#/components/schemas/is_tds_applied' },
			notes: { $ref: '#/components/schemas/notes' },
			terms: { $ref: '#/components/schemas/terms' },
			payment_terms: { $ref: '#/components/schemas/payment_terms' },
			payment_terms_label: { $ref: '#/components/schemas/payment_terms_label' },
			custom_fields: {
				type: 'array',
				description: 'List of custom fields for the recurring bill.',
				items: {
					type: 'object',
					properties: {
						index: { $ref: '#/components/schemas/index' },
						value: { $ref: '#/components/schemas/value' },
					},
				},
			},
			discount: { $ref: '#/components/schemas/discount' },
			discount_account_id: { $ref: '#/components/schemas/discount_account_id' },
			is_discount_before_tax: {
				$ref: '#/components/schemas/is_discount_before_tax',
			},
			repeat_every: {
				description: 'Description for repeat_every',
				type: 'string',
			},
			recurrence_frequency: {
				description: 'Description for recurrence_frequency',
				type: 'string',
			},
			tags: { $ref: '#/components/schemas/tags' },
		},
	},
	'create-a-recurring-bill-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			recurring_bill: { $ref: '#/components/schemas/recurring_bill' },
		},
	},
	created_by_id: {
		description: 'Name of User who created the Bill',
		type: 'string',
	},
	created_time: { description: 'Created time of the bill', type: 'string' },
	currency_code: { description: 'Code of the Currency', type: 'string' },
	currency_id: { description: 'ID of the Currency', type: 'string' },
	currency_symbol: { description: 'Symbol of the Currency', type: 'string' },
	custom_field_id: {
		description: 'Unique ID of the custom field.',
		type: 'string',
	},
	custom_fields: {
		description: 'List of custom fields for the recurring bill.',
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
	customer_id: { description: 'ID of the Customer', type: 'string' },
	customer_name: { description: 'Name of the Customer', type: 'string' },
	'delete-a-recurring-bill-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	description: { description: 'Description of the line item.', type: 'string' },
	destination_of_supply: {
		description:
			"Place where the goods/services are supplied to. (If not given, organisation's home state will be taken)",
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	discount: {
		description:
			'Discount applied to the recurring bill, which can be either a percentage or a flat amount. For percentage discounts, the value should include the % symbol (e.g., 10%). For sample, on Rs.1000, a 10% discount results in Rs.900, while a flat Rs.200 discount results in Rs.800.',
		type: 'string',
	},
	discount_account_id: {
		description: 'ID of the account associated with the discount account.',
		type: 'string',
	},
	end_date: {
		description:
			'Date on which recurring bill has to expire. Can be left as empty to run forever. Format [yyyy-mm-dd].',
		type: 'string',
	},
	'get-a-recurring-bill-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			recurring_bill: { $ref: '#/components/schemas/recurring_bill' },
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
	hsn_or_sac: {
		description: 'Add HSN/SAC code for your goods/services',
		type: 'string',
		'x-node_available_in': ['in', 'ke', 'za'],
		'x-node_unavailable_in': [],
	},
	image_document_id: {
		description: 'ID of the image document',
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	index: { description: 'Index of the custom field', type: 'integer' },
	is_abn_quoted: {
		description: 'Whether the ABN is quoted for the recurring bill.',
		type: 'string',
		'x-node_available_in': ['au'],
		'x-node_unavailable_in': [],
	},
	is_billable: { description: 'Check if entity is Billable', type: 'boolean' },
	is_discount_before_tax: {
		description: 'To specify discount applied in before /after tax.',
		type: 'boolean',
	},
	is_inclusive_tax: {
		description:
			'Used to specify whether the line item rates are inclusive or exclusive of tax.',
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
	is_tds_applied: {
		description: 'Check if TDS is applied',
		type: 'boolean',
		'x-node_available_in': ['in', 'global', 'au'],
		'x-node_unavailable_in': [],
	},
	item_custom_fields: {
		description: 'List of custom fields for the line item.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				custom_field_id: { $ref: '#/components/schemas/custom_field_id' },
				index: { $ref: '#/components/schemas/index' },
				value: { $ref: '#/components/schemas/value' },
				label: { $ref: '#/components/schemas/label' },
			},
		},
	},
	item_id: { description: 'ID of the Item', type: 'string' },
	item_order: { description: 'Order of the line item.', type: 'integer' },
	item_total: { description: 'Total of the Item', type: 'integer' },
	item_total_inclusive_of_tax: {
		description: 'Total of the Item Inclusive of Tax',
		type: 'number',
		format: 'double',
	},
	label: { description: 'Label of the Custom Field', type: 'string' },
	last_modified_time: {
		description: 'Last Modified Time of the Bill',
		type: 'string',
	},
	line_item_category: {
		description:
			'Category of the line item. Allowed values are <code>line_item</code>, <code>header</code> and <code>subtotal</code>. Use <code>line_item</code> for regular line items, <code>header</code> for header titles and <code>subtotal</code> for intermediate subtotal rows. For regular line items, you can send line_item or omit this field',
		type: 'string',
	},
	line_item_id: { description: 'ID of the Line Item', type: 'string' },
	line_items: {
		description: 'Line items of a recurrence bill.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
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
				item_custom_fields: { $ref: '#/components/schemas/item_custom_fields' },
			},
		},
	},
	'list-recurring-bill-history-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'list-recurring-bills-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			recurringbills: {
				type: 'array',
				items: { $ref: '#/components/schemas/recurring_bill' },
			},
		},
	},
	location_id: { description: 'Location ID', type: 'string' },
	location_name: { description: 'Name of the location', type: 'string' },
	name: { description: 'Name of the line item.', type: 'string' },
	notes: { description: 'Notes for the Bill', type: 'string' },
	payment_terms: {
		description: 'Number Referring to Payment Terms',
		type: 'integer',
	},
	payment_terms_label: {
		description: 'Label of the Payment Terms',
		type: 'string',
	},
	place_of_supply: {
		description:
			'The place of supply is where a transaction is considered to have occurred for VAT purposes. For the supply of goods, the place of supply is the location of the goods when the supply occurs. For the supply of services, the place of supply should be where the supplier is established. (If not given, <code>place of contact</code> given for the contact will be taken)<br/>Supported codes for UAE emirates are : </br>Abu Dhabi - <code>AB</code>,</br>Ajman - <code>AJ</code>,</br>Dubai - <code>DU</code>,</br>Fujairah - <code>FU</code>,</br>Ras al-Khaimah - <code>RA</code>,</br>Sharjah - <code>SH</code>,</br>Umm al-Quwain - <code>UM</code>.<br/>Supported codes for the GCC countries are : </br>United Arab Emirates - <code>AE</code>,</br>Saudi Arabia - <code>SA</code>,</br>Bahrain - <code>BH</code>,</br>Kuwait - <code>KW</code>,</br>Oman - <code>OM</code>,</br>Qatar - <code>QA</code>.',
		type: 'string',
		'x-node_available_in': ['gcc'],
		'x-node_unavailable_in': [],
	},
	pricebook_id: { description: 'Enter ID of the price book.', type: 'string' },
	pricebook_name: { description: 'Name of the price book', type: 'string' },
	product_type: {
		description:
			'Type of the bill. This denotes whether the bill line item is to be treated as a goods or service purchase. This only need to be specified in case purchase order is not enabled. Allowed Values: <code> digital_service</code>, <code>goods</code> and <code>service</code>.',
		type: 'string',
		'x-node_available_in': ['eu', 'uk'],
		'x-node_unavailable_in': [],
	},
	project_id: { description: 'ID of the Project', type: 'string' },
	project_name: { description: 'Name of the Project', type: 'string' },
	quantity: {
		description: 'Quantity of the line item.',
		type: 'number',
		format: 'double',
	},
	rate: {
		description: 'Rate of the line item.',
		type: 'number',
		format: 'double',
	},
	recurrence_name: {
		description: 'Name of the Recurring Bill. Max-length [100]',
		type: 'string',
	},
	recurring_bill: {
		type: 'object',
		properties: {
			recurring_bill_id: { $ref: '#/components/schemas/recurring_bill_id' },
			vendor_id: { $ref: '#/components/schemas/vendor_id' },
			vendor_name: { $ref: '#/components/schemas/vendor_name' },
			status: { $ref: '#/components/schemas/status' },
			recurrence_name: { $ref: '#/components/schemas/recurrence_name' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			currency_code: { $ref: '#/components/schemas/currency_code' },
			currency_symbol: { $ref: '#/components/schemas/currency_symbol' },
			start_date: { $ref: '#/components/schemas/start_date' },
			end_date: { $ref: '#/components/schemas/end_date' },
			source_of_supply: { $ref: '#/components/schemas/source_of_supply' },
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			destination_of_supply: {
				$ref: '#/components/schemas/destination_of_supply',
			},
			gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
			gst_no: { $ref: '#/components/schemas/gst_no' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			vat_reg_no: { $ref: '#/components/schemas/vat_reg_no' },
			is_abn_quoted: { $ref: '#/components/schemas/is_abn_quoted' },
			abn: { $ref: '#/components/schemas/abn' },
			is_reverse_charge_applied: {
				$ref: '#/components/schemas/is_reverse_charge_applied',
			},
			pricebook_id: { $ref: '#/components/schemas/pricebook_id' },
			pricebook_name: { $ref: '#/components/schemas/pricebook_name' },
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			location_id: { $ref: '#/components/schemas/location_id' },
			location_name: { $ref: '#/components/schemas/location_name' },
			line_items: { $ref: '#/components/schemas/line_items' },
			is_tds_applied: { $ref: '#/components/schemas/is_tds_applied' },
			notes: { $ref: '#/components/schemas/notes' },
			terms: { $ref: '#/components/schemas/terms' },
			payment_terms: { $ref: '#/components/schemas/payment_terms' },
			payment_terms_label: { $ref: '#/components/schemas/payment_terms_label' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			acquisition_vat_summary: {
				$ref: '#/components/schemas/acquisition_vat_summary',
			},
			reverse_charge_vat_summary: {
				$ref: '#/components/schemas/reverse_charge_vat_summary',
			},
			acquisition_vat_total: {
				$ref: '#/components/schemas/acquisition_vat_total',
			},
			reverse_charge_vat_total: {
				$ref: '#/components/schemas/reverse_charge_vat_total',
			},
			created_time: { $ref: '#/components/schemas/created_time' },
			created_by_id: { $ref: '#/components/schemas/created_by_id' },
			last_modified_time: { $ref: '#/components/schemas/last_modified_time' },
			discount: { $ref: '#/components/schemas/discount' },
			discount_account_id: { $ref: '#/components/schemas/discount_account_id' },
			is_discount_before_tax: {
				$ref: '#/components/schemas/is_discount_before_tax',
			},
			tags: { $ref: '#/components/schemas/tags_response' },
		},
	},
	recurring_bill_id: {
		description: 'Unique ID of the recurring bill.',
		type: 'string',
	},
	'resume-a-recurring-bill-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
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
		description: 'List of serial numbers for the line item.',
		type: 'array',
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
	start_date: {
		description:
			'Start date of the recurring bill. Bills will not be generated for dates prior to the current date. Format [yyyy-mm-dd].',
		type: 'string',
	},
	status: { description: 'Status of the Recurring Bill', type: 'string' },
	'stop-a-recurring-bill-response': {
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
		'x-node_available_in': ['in', 'au', 'ca'],
		'x-node_unavailable_in': [],
	},
	tax_exemption_id: {
		description: 'ID of the Tax Exemption Applied',
		type: 'string',
		'x-node_available_in': ['in', 'au', 'ca'],
		'x-node_unavailable_in': [],
	},
	tax_id: {
		description: 'ID of the tax or tax group applied to the line item.',
		type: 'string',
		'x-node_available_in': [],
		'x-node_unavailable_in': ['us'],
	},
	tax_name: { description: 'Name of the Tax', type: 'string' },
	tax_percentage: { description: 'Percentage of Tax', type: 'integer' },
	tax_treatment: {
		description:
			'VAT treatment for the bill. Choose whether the vendor falls under: <code>vat_registered</code>,<code>vat_not_registered</code>,<code>gcc_vat_not_registered</code>,<code>gcc_vat_registered</code>,<code>non_gcc</code>.</br><code>dz_vat_registered</code> and <code>dz_vat_not_registered</code> are supported only for <b>UAE</b>.</b></br><code>home_country_mexico</code>,<code>border_region_mexico</code>,<code>non_mexico</code> supported only for <b>MX</b>.<br/><b>For Kenya Edition:</b> <code>vat_registered</code> ,<code>vat_not_registered</code> ,<code>non_kenya</code>(A business that is located outside Kenya).<br/><b>For SouthAfrica Edition:</b> <code>vat_registered</code>, <code>vat_not_registered</code>, <code>overseas</code>(A business that is located outside SouthAfrica).',
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
	tax_type: { description: 'Type of tax', type: 'string' },
	tds_tax_id: {
		description: 'TDS ID of the tax group applied to the line item',
		type: 'string',
		'x-node_available_in': ['mx'],
		'x-node_unavailable_in': [],
	},
	terms: { description: 'Terms and Conditions for the Bill', type: 'string' },
	unit: { description: 'Unit of the Item', type: 'string' },
	'update-a-recurring-bill-request': {
		required: [
			'vendor_id',
			'recurrence_name',
			'start_date',
			'repeat_every',
			'recurrence_frequency',
		],
		type: 'object',
		properties: {
			recurring_bill_id: { $ref: '#/components/schemas/recurring_bill_id' },
			vendor_id: { $ref: '#/components/schemas/vendor_id' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			status: { $ref: '#/components/schemas/status' },
			recurrence_name: { $ref: '#/components/schemas/recurrence_name' },
			start_date: { $ref: '#/components/schemas/start_date' },
			end_date: { $ref: '#/components/schemas/end_date' },
			source_of_supply: { $ref: '#/components/schemas/source_of_supply' },
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			destination_of_supply: {
				$ref: '#/components/schemas/destination_of_supply',
			},
			gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
			gst_no: { $ref: '#/components/schemas/gst_no' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			vat_reg_no: { $ref: '#/components/schemas/vat_reg_no' },
			is_abn_quoted: { $ref: '#/components/schemas/is_abn_quoted' },
			abn: { $ref: '#/components/schemas/abn' },
			is_reverse_charge_applied: {
				$ref: '#/components/schemas/is_reverse_charge_applied',
			},
			pricebook_id: { $ref: '#/components/schemas/pricebook_id' },
			pricebook_name: { $ref: '#/components/schemas/pricebook_name' },
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			location_id: { $ref: '#/components/schemas/location_id' },
			line_items: {
				description: 'Line items of a recurrence bill.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						line_item_id: { $ref: '#/components/schemas/line_item_id' },
						item_id: { $ref: '#/components/schemas/item_id' },
						name: { $ref: '#/components/schemas/name' },
						account_id: { $ref: '#/components/schemas/account_id' },
						description: { $ref: '#/components/schemas/description' },
						rate: { $ref: '#/components/schemas/rate' },
						hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
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
			is_tds_applied: { $ref: '#/components/schemas/is_tds_applied' },
			notes: { $ref: '#/components/schemas/notes' },
			terms: { $ref: '#/components/schemas/terms' },
			payment_terms: { $ref: '#/components/schemas/payment_terms' },
			payment_terms_label: { $ref: '#/components/schemas/payment_terms_label' },
			custom_fields: {
				type: 'array',
				description: 'List of custom fields for the recurring bill.',
				items: {
					type: 'object',
					properties: {
						index: { $ref: '#/components/schemas/index' },
						value: { $ref: '#/components/schemas/value' },
					},
				},
			},
			discount: { $ref: '#/components/schemas/discount' },
			discount_account_id: { $ref: '#/components/schemas/discount_account_id' },
			is_discount_before_tax: {
				$ref: '#/components/schemas/is_discount_before_tax',
			},
			repeat_every: {
				description: 'Description for repeat_every',
				type: 'string',
			},
			recurrence_frequency: {
				description: 'Description for recurrence_frequency',
				type: 'string',
			},
			tags: { $ref: '#/components/schemas/tags' },
		},
	},
	'update-a-recurring-bill-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	value: { description: 'Value of the Custom Field', type: 'string' },
	vat_reg_no: {
		description:
			'<b>For UK Edition:</b> VAT Registration number of a contact with length should be between 2 and 12 characters.<br/> <b>For Avalara:</b> If you are doing sales in the European Union (EU) then provide VAT Registration Number of your customers here. This is used to calculate VAT for B2B sales, from Avalara.',
		type: 'string',
		'x-node_available_in': ['uk', 'Avalara Integration'],
		'x-node_unavailable_in': [],
	},
	vat_treatment: {
		description:
			'(Optional) VAT treatment for the bill. VAT treatment denotes the location of the vendor, if the vendor resides in UK then the VAT treatment is <code>uk</code>. If the vendor is in an EU country & VAT registered, you are resides in Northen Ireland and purchasing Goods then his VAT treatment is <code>eu_vat_registered</code> and if he resides outside the UK then his VAT treatment is <code>overseas</code>(For Pre Brexit, this can be split as <code>eu_vat_registered</code>, <code>eu_vat_not_registered</code> and <code>non_eu</code>).',
		type: 'string',
		'x-node_available_in': ['uk'],
		'x-node_unavailable_in': [],
	},
	vendor_id: {
		description: 'ID of the vendor the bill has to be created.',
		type: 'string',
	},
	vendor_name: { description: 'Name of the Vendor', type: 'string' },
};

export const operations: readonly ZohoBooksOperationDefinition[] = [
	{
		id: 'create_recurring_bill',
		group: 'recurringBills',
		groupSlug: 'recurring-bills',
		name: 'createRecurringBill',
		method: 'POST',
		path: '/recurringbills',
		summary: 'Create a recurring bill',
		description: 'Create a recurring bill.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-bills/',
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
			schema: { $ref: '#/components/schemas/create-a-recurring-bill-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/create-a-recurring-bill-response',
				},
			},
		],
		scopes: ['ZohoBooks.bills.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_recurring_bills',
		group: 'recurringBills',
		groupSlug: 'recurring-bills',
		name: 'listRecurringBills',
		method: 'GET',
		path: '/recurringbills',
		summary: 'List recurring bills',
		description: 'List all recurring bills with pagination.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-bills/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'recurring_bill_id',
				in: 'query',
				required: false,
				description: 'Unique identifier of the recurring bill.',
				schema: { type: 'string' },
			},
			{
				name: 'vendor_id',
				in: 'query',
				required: false,
				description: 'Search recurring bills by Vendor ID',
				schema: { type: 'string' },
			},
			{
				name: 'vendor_name',
				in: 'query',
				required: false,
				description:
					'Search recurring bills by vendor name. Variants: <code>vendor_name_startswith</code> and <code>vendor_name_contains</code>',
				schema: { type: 'string' },
			},
			{
				name: 'status',
				in: 'query',
				required: false,
				description:
					'Search recurring bills by recurring bill status. Allowed Values: <code>active</code>, <code>stopped</code>, <code>expired</code>',
				schema: { type: 'string' },
			},
			{
				name: 'recurrence_name',
				in: 'query',
				required: false,
				description:
					'Search recurring bills by recurrence number. Variants: <code>recurrence_name_startswith</code> and <code>recurrence_name_contains</code>',
				schema: { type: 'string' },
			},
			{
				name: 'currency_id',
				in: 'query',
				required: false,
				description: 'ID of the Currency',
				schema: { type: 'string' },
			},
			{
				name: 'currency_code',
				in: 'query',
				required: false,
				description: 'Code of the Currency',
				schema: { type: 'string' },
			},
			{
				name: 'currency_symbol',
				in: 'query',
				required: false,
				description: 'Symbol of the Currency',
				schema: { type: 'string' },
			},
			{
				name: 'start_date',
				in: 'query',
				required: false,
				description:
					'Search recurring bills by recurring bill start date. Variants: <code>start_date_start</code>, <code>start_date_end</code>, <code>start_date_before</code> and <code>start_date_after</code>',
				schema: { type: 'string' },
			},
			{
				name: 'end_date',
				in: 'query',
				required: false,
				description:
					'Date on which recurring bill has to expire. Can be left as empty to run forever. Format [yyyy-mm-dd].',
				schema: { type: 'string' },
			},
			{
				name: 'source_of_supply',
				in: 'query',
				required: false,
				description:
					'Place from where the goods/services are supplied. (If not given, <code>place of contact</code> given for the contact will be taken)',
				schema: { type: 'string' },
			},
			{
				name: 'place_of_supply',
				in: 'query',
				required: false,
				description:
					'The place of supply is where a transaction is considered to have occurred for VAT purposes. For the supply of goods, the place of supply is the location of the goods when the supply occurs. For the supply of services, the place of supply should be where the supplier is established. (If not given, <code>place of contact</code> given for the contact will be taken)<br/>Supported codes for UAE emirates are : </br>Abu Dhabi - <code>AB</code>,</br>Ajman - <code>AJ</code>,</br>Dubai - <code>DU</code>,</br>Fujairah - <code>FU</code>,</br>Ras al-Khaimah - <code>RA</code>,</br>Sharjah - <code>SH</code>,</br>Umm al-Quwain - <code>UM</code>.<br/>Supported codes for the GCC countries are : </br>United Arab Emirates - <code>AE</code>,</br>Saudi Arabia - <code>SA</code>,</br>Bahrain - <code>BH</code>,</br>Kuwait - <code>KW</code>,</br>Oman - <code>OM</code>,</br>Qatar - <code>QA</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'destination_of_supply',
				in: 'query',
				required: false,
				description:
					"Place where the goods/services are supplied to. (If not given, organisation's home state will be taken)",
				schema: { type: 'string' },
			},
			{
				name: 'gst_treatment',
				in: 'query',
				required: false,
				description:
					'Choose whether the contact is GST registered/unregistered/consumer/overseas. Allowed values are <code> business_gst </code> , <code> business_none </code> , <code> overseas </code> , <code> consumer </code>.',
				schema: { type: 'string' },
			},
			{
				name: 'gst_no',
				in: 'query',
				required: false,
				description: '15 digit GST identification number of the vendor.',
				schema: { type: 'string' },
			},
			{
				name: 'tax_treatment',
				in: 'query',
				required: false,
				description:
					'VAT treatment for the bill. Choose whether the vendor falls under: <code>vat_registered</code>,<code>vat_not_registered</code>,<code>gcc_vat_not_registered</code>,<code>gcc_vat_registered</code>,<code>non_gcc</code>.</br><code>dz_vat_registered</code> and <code>dz_vat_not_registered</code> are supported only for <b>UAE</b>.',
				schema: { type: 'string' },
			},
			{
				name: 'vat_treatment',
				in: 'query',
				required: false,
				description:
					'(Optional) VAT treatment for the bill. VAT treatment denotes the location of the vendor, if the vendor resides in UK then the VAT treatment is <code>uk</code>. If the vendor is in an EU country & VAT registered, you are resides in Northen Ireland and purchasing Goods then his VAT treatment is <code>eu_vat_registered</code> and if he resides outside the UK then his VAT treatment is <code>overseas</code>(For Pre Brexit, this can be split as <code>eu_vat_registered</code>, <code>eu_vat_not_registered</code> and <code>non_eu</code>).',
				schema: { type: 'string' },
			},
			{
				name: 'vat_reg_no',
				in: 'query',
				required: false,
				description:
					'<b>For UK Edition:</b> VAT Registration number of a contact with length should be between 2 and 12 characters.<br/> <b>For Avalara:</b> If you are doing sales in the European Union (EU) then provide VAT Registration Number of your customers here. This is used to calculate VAT for B2B sales, from Avalara.',
				schema: { type: 'string' },
			},
			{
				name: 'is_abn_quoted',
				in: 'query',
				required: false,
				description: 'Whether the ABN is quoted for the recurring bill.',
				schema: { type: 'string' },
			},
			{
				name: 'abn',
				in: 'query',
				required: false,
				description: 'Australian Business Number (ABN) of the vendor.',
				schema: { type: 'string' },
			},
			{
				name: 'is_reverse_charge_applied',
				in: 'query',
				required: false,
				description: 'Applicable for transactions where you pay reverse charge',
				schema: { type: 'boolean' },
			},
			{
				name: 'pricebook_id',
				in: 'query',
				required: false,
				description: 'Enter ID of the price book.',
				schema: { type: 'string' },
			},
			{
				name: 'pricebook_name',
				in: 'query',
				required: false,
				description: 'Name of the price book',
				schema: { type: 'string' },
			},
			{
				name: 'is_inclusive_tax',
				in: 'query',
				required: false,
				description:
					'Used to specify whether the line item rates are inclusive or exclusive of tax.',
				schema: { type: 'boolean' },
			},
			{
				name: 'line_items',
				in: 'query',
				required: false,
				description: 'Line items of a recurrence bill.',
				schema: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							description: { $ref: '#/components/schemas/description' },
							sku: { $ref: '#/components/schemas/sku' },
							name: { $ref: '#/components/schemas/name' },
							account_id: { $ref: '#/components/schemas/account_id' },
							account_name: { $ref: '#/components/schemas/account_name' },
							image_document_id: {
								$ref: '#/components/schemas/image_document_id',
							},
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
							bcy_rate: { $ref: '#/components/schemas/bcy_rate' },
							rate: { $ref: '#/components/schemas/rate' },
							tags: { $ref: '#/components/schemas/tags' },
							quantity: { $ref: '#/components/schemas/quantity' },
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
							item_order: { $ref: '#/components/schemas/item_order' },
							unit: { $ref: '#/components/schemas/unit' },
							product_type: { $ref: '#/components/schemas/product_type' },
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
							is_billable: { $ref: '#/components/schemas/is_billable' },
							customer_id: { $ref: '#/components/schemas/customer_id' },
							customer_name: { $ref: '#/components/schemas/customer_name' },
							project_id: { $ref: '#/components/schemas/project_id' },
							project_name: { $ref: '#/components/schemas/project_name' },
							item_custom_fields: {
								$ref: '#/components/schemas/item_custom_fields',
							},
						},
					},
				},
			},
			{
				name: 'is_tds_applied',
				in: 'query',
				required: false,
				description: 'Check if TDS is applied',
				schema: { type: 'boolean' },
			},
			{
				name: 'notes',
				in: 'query',
				required: false,
				description: 'Notes for the Bill',
				schema: { type: 'string' },
			},
			{
				name: 'terms',
				in: 'query',
				required: false,
				description: 'Terms and Conditions for the Bill',
				schema: { type: 'string' },
			},
			{
				name: 'payment_terms',
				in: 'query',
				required: false,
				description: 'Number Referring to Payment Terms',
				schema: { type: 'integer' },
			},
			{
				name: 'payment_terms_label',
				in: 'query',
				required: false,
				description: 'Label of the Payment Terms',
				schema: { type: 'string' },
			},
			{
				name: 'custom_fields',
				in: 'query',
				required: false,
				description: 'List of custom fields for the recurring bill.',
				schema: {
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
			},
			{
				name: 'acquisition_vat_summary',
				in: 'query',
				required: false,
				description: 'Summary of the VAT Acquistion',
				schema: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							tax_name: { $ref: '#/components/schemas/tax_name' },
							tax_amount: { $ref: '#/components/schemas/tax_amount' },
						},
					},
				},
			},
			{
				name: 'reverse_charge_vat_summary',
				in: 'query',
				required: false,
				description: 'Summary of the Reverse Charge',
				schema: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							tax_name: { $ref: '#/components/schemas/tax_name' },
							tax_amount: { $ref: '#/components/schemas/tax_amount' },
						},
					},
				},
			},
			{
				name: 'acquisition_vat_total',
				in: 'query',
				required: false,
				description: 'Total of the VAT Acquistion',
				schema: { type: 'number', format: 'double' },
			},
			{
				name: 'reverse_charge_vat_total',
				in: 'query',
				required: false,
				description: 'Total of the Reverse Charge',
				schema: { type: 'number', format: 'double' },
			},
			{
				name: 'created_time',
				in: 'query',
				required: false,
				description: 'Created time of the bill',
				schema: { type: 'string' },
			},
			{
				name: 'created_by_id',
				in: 'query',
				required: false,
				description: 'Name of User who created the Bill',
				schema: { type: 'string' },
			},
			{
				name: 'last_modified_time',
				in: 'query',
				required: false,
				description: 'Last Modified Time of the Bill',
				schema: { type: 'string' },
			},
			{
				name: 'discount',
				in: 'query',
				required: false,
				description:
					'Discount applied to the recurring bill, which can be either a percentage or a flat amount. For percentage discounts, the value should include the % symbol (e.g., 10%). For sample, on Rs.1000, a 10% discount results in Rs.900, while a flat Rs.200 discount results in Rs.800.',
				schema: { type: 'string' },
			},
			{
				name: 'discount_account_id',
				in: 'query',
				required: false,
				description: 'ID of the account associated with the discount account.',
				schema: { type: 'string' },
			},
			{
				name: 'is_discount_before_tax',
				in: 'query',
				required: false,
				description: 'To specify discount applied in before /after tax.',
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
				schema: { $ref: '#/components/schemas/list-recurring-bills-response' },
			},
		],
		scopes: ['ZohoBooks.bills.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_recurring_bill_using_custom_field',
		group: 'recurringBills',
		groupSlug: 'recurring-bills',
		name: 'updateRecurringBillUsingCustomField',
		method: 'PUT',
		path: '/recurringbills',
		summary: "Update a recurring bill using a custom field's unique value",
		description:
			"A custom field will have unique values if it's configured to not accept duplicate values. Now, you can use that custom field's value to update a recurring bill by providing its API name in the X-Unique-Identifier-Key header and its value in the X-Unique-Identifier-Value header. Based on this value, the corresponding recurring bill will be retrieved and updated. Additionally, there is an optional X-Upsert header. If the X-Upsert header is true and the custom field's unique value is not found in any of the existing recurring bills, a new recurring bill will be created if the necessary payload details are available",
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-bills/',
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
			schema: { $ref: '#/components/schemas/update-a-recurring-bill-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-a-recurring-bill-response',
				},
			},
		],
		scopes: ['ZohoBooks.bills.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_recurring_bill',
		group: 'recurringBills',
		groupSlug: 'recurring-bills',
		name: 'updateRecurringBill',
		method: 'PUT',
		path: '/recurringbills/{recurring_bill_id}',
		summary: 'Update a recurring bill',
		description:
			'Update a recurring bill. To delete a line item just remove it from the line_items list.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-bills/',
		parameters: [
			{
				name: 'recurring_bill_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the recurring bill.',
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
			schema: { $ref: '#/components/schemas/update-a-recurring-bill-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-a-recurring-bill-response',
				},
			},
		],
		scopes: ['ZohoBooks.bills.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_recurring_bill',
		group: 'recurringBills',
		groupSlug: 'recurring-bills',
		name: 'getRecurringBill',
		method: 'GET',
		path: '/recurring_bills/{recurring_bill_id}',
		summary: 'Get a recurring bill',
		description: 'Get the details of a recurring bill.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-bills/',
		parameters: [
			{
				name: 'recurring_bill_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the recurring bill.',
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
				schema: { $ref: '#/components/schemas/get-a-recurring-bill-response' },
			},
		],
		scopes: ['ZohoBooks.bills.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_recurring_bill',
		group: 'recurringBills',
		groupSlug: 'recurring-bills',
		name: 'deleteRecurringBill',
		method: 'DELETE',
		path: '/recurring_bills/{recurring_bill_id}',
		summary: 'Delete a recurring bill',
		description: 'Delete an existing recurring bill.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-bills/',
		parameters: [
			{
				name: 'recurring_bill_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the recurring bill.',
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
					$ref: '#/components/schemas/delete-a-recurring-bill-response',
				},
			},
		],
		scopes: ['ZohoBooks.bills.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'stop_recurring_bill',
		group: 'recurringBills',
		groupSlug: 'recurring-bills',
		name: 'stopRecurringBill',
		method: 'POST',
		path: '/recurringbills/{recurring_bill_id}/status/stop',
		summary: 'Stop a recurring bill',
		description: 'Stop an active recurring bill.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-bills/',
		parameters: [
			{
				name: 'recurring_bill_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the recurring bill.',
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
				schema: { $ref: '#/components/schemas/stop-a-recurring-bill-response' },
			},
		],
		scopes: ['ZohoBooks.bills.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'resume_recurring_bill',
		group: 'recurringBills',
		groupSlug: 'recurring-bills',
		name: 'resumeRecurringBill',
		method: 'POST',
		path: '/recurringbills/{recurring_bill_id}/status/resume',
		summary: 'Resume a recurring Bill',
		description: 'Resume a stopped recurring bill.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-bills/',
		parameters: [
			{
				name: 'recurring_bill_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the recurring bill.',
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
					$ref: '#/components/schemas/resume-a-recurring-bill-response',
				},
			},
		],
		scopes: ['ZohoBooks.bills.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_recurring_bill_history',
		group: 'recurringBills',
		groupSlug: 'recurring-bills',
		name: 'listRecurringBillHistory',
		method: 'GET',
		path: '/recurringbills/{recurring_bill_id}/comments',
		summary: 'List recurring bill history',
		description: 'Get history and comments of a recurring bill.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-bills/',
		parameters: [
			{
				name: 'recurring_bill_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the recurring bill.',
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
					$ref: '#/components/schemas/list-recurring-bill-history-response',
				},
			},
		],
		scopes: ['ZohoBooks.bills.READ'],
		riskLevel: 'read',
	},
];
