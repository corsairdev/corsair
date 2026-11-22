import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas = {
	accept_retainer: {
		description:
			'Boolean flag indicating whether a retainer invoice should be automatically created if the customer accepts this estimate. When set to <code>true</code>, a retainer invoice is generated upon acceptance, streamlining the process for upfront payments or deposits. Allowed values: <code>true</code> and <code>false</code>.',
		type: 'boolean',
	},
	accepted_date: {
		description: 'The date of acceptance of the estimates',
		type: 'string',
	},
	'add-comments-request': {
		type: 'object',
		properties: {
			description: {
				description: 'The description of the line items',
				type: 'string',
			},
			show_comment_to_clients: {
				$ref: '#/components/schemas/show_comment_to_clients',
			},
		},
	},
	'add-comments-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	address: { description: 'Billing address for the estimate', type: 'string' },
	adjustment: {
		description:
			'Additional charge or credit amount applied to the estimate total. This can be used for rounding adjustments, handling fees, or any other one-time charges/credits. Positive values add to the total, negative values reduce the total. This amount is applied after tax calculation and affects the final estimate total.',
		type: 'number',
		format: 'double',
	},
	adjustment_description: {
		description:
			'Text description explaining the reason for the adjustment amount. This description appears on the estimate document to explain why the adjustment was applied. Common sample include "Rounding adjustment", "Handling fee", "Early payment discount", or "Late payment fee". This helps customers understand the purpose of the adjustment.',
		type: 'string',
	},
	'approve-an-estimate-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	avatax_exempt_no: {
		description: 'Exemption certificate number of the customer.',
		type: 'string',
		'x-node_available_in': ['Avalara Integration'],
		'x-node_unavailable_in': [],
	},
	avatax_use_code: {
		description:
			'Used to group like customers for exemption purposes. It is a custom value that links customers to a tax rule. Select from Avalara [standard codes][1] or enter a custom code.',
		type: 'string',
		'x-node_available_in': ['Avalara Integration'],
		'x-node_unavailable_in': [],
	},
	bcy_rate: {
		description:
			'Exchange rate between the base currency and the transaction currency for this line item. Used for currency conversion and reporting.',
		type: 'number',
		format: 'float',
	},
	billing_address: {
		description: 'The billing address',
		type: 'object',
		properties: {
			address: { $ref: '#/components/schemas/address' },
			city: { $ref: '#/components/schemas/city' },
			state: { $ref: '#/components/schemas/state' },
			zip: { $ref: '#/components/schemas/zip' },
			country: { $ref: '#/components/schemas/country' },
			fax: { $ref: '#/components/schemas/fax' },
		},
	},
	body: { description: 'Body of an email has to be sent.', type: 'string' },
	'bulk-export-estimates-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'bulk-print-estimates-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	cc_mail_ids: {
		description: 'Array of email address of the recipients to be cced.',
		type: 'array',
		items: { type: 'string' },
	},
	city: {
		description: "City of the customer's billing address.",
		type: 'string',
	},
	client_viewed_time: { type: 'string' },
	comment_id: {
		description:
			'The id of the comment id. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	comment_type: { type: 'string' },
	commented_by: { type: 'string' },
	commented_by_id: {
		type: 'string',
		description:
			'Unique identifier of the user who added the comment. Note: This value is a set of numeric characters.',
	},
	communication_preference: {
		description:
			'Preferred modes of communication for the contact person at transaction level.',
		type: 'object',
		properties: {
			is_email_enabled: { $ref: '#/components/schemas/is_email_enabled' },
			is_sms_enabled: { $ref: '#/components/schemas/is_sms_enabled' },
			is_whatsapp_enabled: { $ref: '#/components/schemas/is_whatsapp_enabled' },
		},
	},
	contact_person_email: {
		description: 'Email ID of the Contact Person.',
		type: 'string',
	},
	contact_person_id: {
		description:
			'Unique ID of the Contact Person. Note: This value is a set of numeric characters.',
		type: 'string',
		format: 'int64',
	},
	contact_person_name: {
		description: 'Name of the Contact Person',
		type: 'string',
	},
	contact_persons_associated: {
		description: 'Contact Persons associated with the estimate.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				contact_person_id: { $ref: '#/components/schemas/contact_person_id' },
				contact_person_name: {
					$ref: '#/components/schemas/contact_person_name',
				},
				first_name: { $ref: '#/components/schemas/first_name' },
				last_name: { $ref: '#/components/schemas/last_name' },
				contact_person_email: {
					$ref: '#/components/schemas/contact_person_email',
				},
				phone: { $ref: '#/components/schemas/phone' },
				mobile: { $ref: '#/components/schemas/mobile' },
				communication_preference: {
					$ref: '#/components/schemas/communication_preference',
				},
			},
		},
	},
	contact_persons_associated_payload: {
		description: 'Contact Persons associated with the estimate.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				contact_person_id: { $ref: '#/components/schemas/contact_person_id' },
				communication_preference: {
					$ref: '#/components/schemas/communication_preference',
				},
			},
		},
	},
	country: {
		description: "Country of the customer's billing address.",
		type: 'string',
	},
	'create-an-estimate-request': {
		required: ['customer_id', 'line_items'],
		type: 'object',
		properties: {
			customer_id: { $ref: '#/components/schemas/customer_id' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			contact_persons_associated: {
				$ref: '#/components/schemas/contact_persons_associated_payload',
			},
			template_id: { $ref: '#/components/schemas/template_id' },
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
			gst_no: { $ref: '#/components/schemas/gst_no' },
			shipping_gst_no: { $ref: '#/components/schemas/shipping_gst_no' },
			shipping_trader_name: {
				$ref: '#/components/schemas/shipping_trader_name',
			},
			shipping_legal_name: { $ref: '#/components/schemas/shipping_legal_name' },
			shipping_address: {
				description:
					'Address of the party the goods are shipped to. Use this field to provide a one-time shipping address that is not saved under the customer. When using this field, do not provide <code>shipping_address_id</code> in the same request.',
				$ref: '#/components/schemas/shipping_address',
			},
			estimate_number: {
				description:
					'Unique identifier for the estimate. If not provided, the system auto-generates one. This number is used for tracking, referencing, and communicating the estimate to customers. It appears on the estimate PDF and in all customer communications.',
				$ref: '#/components/schemas/estimate_number',
			},
			reference_number: {
				description:
					'External reference associated with the estimate. Use this field to link the estimate to external systems, customer requests, or internal workflows. The reference number appears on the estimate document for customer and internal tracking.',
				$ref: '#/components/schemas/reference_number',
			},
			date: {
				description:
					'Date the estimate is created. This date appears on the estimate document and is used for record-keeping, reporting, and determining the validity period. Format: YYYY-MM-DD.',
				$ref: '#/components/schemas/date',
			},
			expiry_date: {
				description:
					'Date when the estimate expires. After this date, the estimate is no longer valid for acceptance. Used to set deadlines for customer response and manage time-sensitive offers. Format: YYYY-MM-DD.',
				$ref: '#/components/schemas/expiry_date',
			},
			exchange_rate: {
				description:
					'Exchange rate used to convert the estimate amount to the base currency of your organization. Required for multi-currency transactions. The exchange rate affects the total amount and reporting in the base currency.',
				$ref: '#/components/schemas/exchange_rate',
			},
			discount: {
				description:
					'Discount applied to the estimate, which can be either a percentage or a flat amount. For percentage discounts, the value should include the % symbol (e.g., 10%). For sample, on Rs.1000, a 10% discount results in Rs.900, while a flat Rs.200 discount results in Rs.800.',
				$ref: '#/components/schemas/discount',
			},
			is_discount_before_tax: {
				description:
					'Indicates whether the discount is applied before or after tax calculation. When true, the discount is applied to the subtotal before tax. When false, the discount is applied after tax is calculated.',
				$ref: '#/components/schemas/is_discount_before_tax',
			},
			discount_type: {
				description:
					'Specifies how the discount is applied: at the entity (entire estimate) level or item (line item) level. Allowed values: "entity_level", "item_level". This setting determines whether the discount is distributed across all items or applied to specific items only.',
				$ref: '#/components/schemas/discount_type',
			},
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			custom_body: { $ref: '#/components/schemas/custom_body' },
			custom_subject: { $ref: '#/components/schemas/custom_subject' },
			salesperson_name: { $ref: '#/components/schemas/salesperson_name' },
			custom_fields: {
				description: 'Custom fields for an estimate.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						index: { $ref: '#/components/schemas/index' },
						value: { $ref: '#/components/schemas/value' },
					},
				},
			},
			line_items: {
				description: 'Line items of an estimate.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						item_id: { $ref: '#/components/schemas/item_id' },
						line_item_id: { $ref: '#/components/schemas/line_item_id' },
						name: { $ref: '#/components/schemas/name' },
						description: { $ref: '#/components/schemas/description' },
						product_type: { $ref: '#/components/schemas/product_type' },
						hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
						sat_item_key_code: {
							$ref: '#/components/schemas/sat_item_key_code',
						},
						unitkey_code: { $ref: '#/components/schemas/unitkey_code' },
						item_order: { $ref: '#/components/schemas/item_order' },
						bcy_rate: { $ref: '#/components/schemas/bcy_rate' },
						rate: { $ref: '#/components/schemas/rate' },
						quantity: { $ref: '#/components/schemas/quantity' },
						unit: { $ref: '#/components/schemas/unit' },
						discount_amount: { $ref: '#/components/schemas/discount_amount' },
						discount: { $ref: '#/components/schemas/discount' },
						tax_id: { $ref: '#/components/schemas/tax_id' },
						product_tax_category: {
							$ref: '#/components/schemas/product_tax_category',
						},
						tds_tax_id: { $ref: '#/components/schemas/tds_tax_id' },
						tax_name: { $ref: '#/components/schemas/tax_name' },
						tax_type: { $ref: '#/components/schemas/tax_type' },
						tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
						tax_treatment_code: {
							$ref: '#/components/schemas/tax_treatment_code',
						},
						item_total: { $ref: '#/components/schemas/item_total' },
						location_id: { $ref: '#/components/schemas/location_id' },
						tags: { $ref: '#/components/schemas/tags' },
						line_item_category: {
							$ref: '#/components/schemas/line_item_category',
						},
					},
				},
			},
			location_id: { $ref: '#/components/schemas/location_id' },
			notes: { $ref: '#/components/schemas/notes' },
			terms: { $ref: '#/components/schemas/terms' },
			shipping_charge: { $ref: '#/components/schemas/shipping_charge' },
			adjustment: { $ref: '#/components/schemas/adjustment' },
			adjustment_description: {
				$ref: '#/components/schemas/adjustment_description',
			},
			tax_id: { $ref: '#/components/schemas/tax_id' },
			tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
			tax_authority_id: { $ref: '#/components/schemas/tax_authority_id' },
			avatax_use_code: { $ref: '#/components/schemas/avatax_use_code' },
			avatax_exempt_no: { $ref: '#/components/schemas/avatax_exempt_no' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			is_reverse_charge_applied: {
				$ref: '#/components/schemas/is_reverse_charge_applied',
			},
			item_id: { $ref: '#/components/schemas/item_id' },
			line_item_id: { $ref: '#/components/schemas/line_item_id' },
			name: { $ref: '#/components/schemas/name' },
			description: { $ref: '#/components/schemas/description' },
			rate: { $ref: '#/components/schemas/rate' },
			unit: { $ref: '#/components/schemas/unit' },
			quantity: { $ref: '#/components/schemas/quantity' },
			project_id: { $ref: '#/components/schemas/project_id' },
			accept_retainer: { $ref: '#/components/schemas/accept_retainer' },
			retainer_percentage: { $ref: '#/components/schemas/retainer_percentage' },
			tags: { $ref: '#/components/schemas/tags' },
		},
	},
	'create-an-estimate-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			estimate: { $ref: '#/components/schemas/estimate-response' },
		},
	},
	created_time: {
		description: 'The time of creation of the estimates',
		type: 'string',
	},
	currency_code: {
		description:
			'Currency code of the currency in which the customer wants to pay. If currency_code is not specified here, the currency chosen in your Zoho Subscriptions organization will be used for billing. currency_id and currency_symbol are set automatically in accordance to the currency_code.',
		type: 'string',
	},
	currency_id: {
		description:
			"The ID of the currency in which the estimate will be created. Use this to specify the customer's preferred currency for transactions. Fetch valid currency IDs using the Currency API (GET /currencies). Note: This value is a set of numeric characters.",
		type: 'string',
	},
	custom_body: {
		type: 'string',
		description: 'Custom body for the email to be sent.',
	},
	custom_fields: {
		description: 'Custom fields for an estimate.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				index: { $ref: '#/components/schemas/index' },
				show_on_pdf: { $ref: '#/components/schemas/show_on_pdf' },
				value: { $ref: '#/components/schemas/value' },
				label: { $ref: '#/components/schemas/label' },
			},
		},
	},
	custom_fields_update: {
		description: 'Custom fields for an invoice.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				customfield_id: {
					type: 'string',
					description:
						'Unique identifier of the custom field. Note: This value is a set of numeric characters.',
				},
				value: { $ref: '#/components/schemas/value' },
			},
		},
	},
	custom_subject: {
		type: 'string',
		description: 'Custom subject for the email to be sent.',
	},
	customer_id: {
		description:
			'The ID of the customer (contact) for whom the estimate is created. This must be a valid contact ID from your organization; obtain it using the Contacts API (GET /contacts) or the Create Contact response. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	customer_name: {
		description:
			'Search estimates by customer name.Variants <code>customer_name_startswith</code> and <code>customer_name_contains</code>',
		type: 'string',
	},
	date: {
		description:
			'Search estimates by estimate date.Variants <code>date_start</code>, <code>date_end</code>, <code>date_before</code> and <code>date_after</code>',
		type: 'string',
	},
	date_description: { type: 'string' },
	declined_date: {
		description: 'The date of declination of the estimates',
		type: 'string',
	},
	'delete-a-comment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-an-estimate-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	description: {
		description:
			'Detailed description of the product or service in this line item. Use this field to provide specifications, features, or any other relevant information that helps the customer understand about the line item.',
		type: 'string',
	},
	discount: {
		description:
			'Discount applied to the estimate, which can be either a percentage or a flat amount. For percentage discounts, the value should include the % symbol (e.g., 10%). For sample, on Rs.1000, a 10% discount results in Rs.900, while a flat Rs.200 discount results in Rs.800.',
		type: 'number',
		format: 'double',
	},
	discount_amount: {
		description:
			'Discount amount applied to this line item. This value reduces the line item total before tax calculation.',
		type: 'number',
		format: 'float',
	},
	discount_type: {
		description:
			'How the discount is specified. Allowed values are entity_level or item_level.Allowed Values: <code>entity_level</code> and <code>item_level</code>',
		type: 'string',
	},
	email: { description: 'Search contacts by email id', type: 'string' },
	'email-an-estimate-request': {
		required: ['to_mail_ids'],
		type: 'object',
		properties: {
			send_from_org_email_id: {
				$ref: '#/components/schemas/send_from_org_email_id',
			},
			to_mail_ids: { $ref: '#/components/schemas/to_mail_ids' },
			cc_mail_ids: { $ref: '#/components/schemas/cc_mail_ids' },
			subject: { $ref: '#/components/schemas/subject' },
			body: { $ref: '#/components/schemas/body' },
			mail_documents: { $ref: '#/components/schemas/mail_documents' },
		},
	},
	'email-an-estimate-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'email-multiple-estimates-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	error_list: {
		description: 'Error list',
		type: 'array',
		items: { type: 'string' },
	},
	'estimate-response': {
		type: 'object',
		properties: {
			estimate_id: { $ref: '#/components/schemas/estimate_id' },
			estimate_number: { $ref: '#/components/schemas/estimate_number' },
			date: { $ref: '#/components/schemas/date' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			is_pre_gst: { $ref: '#/components/schemas/is_pre_gst' },
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			gst_no: { $ref: '#/components/schemas/gst_no' },
			shipping_gst_no: { $ref: '#/components/schemas/shipping_gst_no' },
			shipping_trader_name: {
				$ref: '#/components/schemas/shipping_trader_name',
			},
			shipping_legal_name: { $ref: '#/components/schemas/shipping_legal_name' },
			gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			is_reverse_charge_applied: {
				$ref: '#/components/schemas/is_reverse_charge_applied',
			},
			status: { $ref: '#/components/schemas/status' },
			customer_id: { $ref: '#/components/schemas/customer_id' },
			customer_name: { $ref: '#/components/schemas/customer_name' },
			contact_persons_associated: {
				$ref: '#/components/schemas/contact_persons_associated',
			},
			currency_id: { $ref: '#/components/schemas/currency_id' },
			currency_code: { $ref: '#/components/schemas/currency_code' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			expiry_date: { $ref: '#/components/schemas/expiry_date' },
			discount: { $ref: '#/components/schemas/discount' },
			is_discount_before_tax: {
				$ref: '#/components/schemas/is_discount_before_tax',
			},
			discount_type: { $ref: '#/components/schemas/discount_type' },
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			line_items: { $ref: '#/components/schemas/line_items' },
			location_id: { $ref: '#/components/schemas/location_id' },
			location_name: { $ref: '#/components/schemas/location_name' },
			shipping_charge: { $ref: '#/components/schemas/shipping_charge' },
			adjustment: { $ref: '#/components/schemas/adjustment' },
			adjustment_description: {
				$ref: '#/components/schemas/adjustment_description',
			},
			sub_total: { $ref: '#/components/schemas/sub_total' },
			total: { $ref: '#/components/schemas/total' },
			tax_total: { $ref: '#/components/schemas/tax_total' },
			price_precision: { $ref: '#/components/schemas/price_precision' },
			taxes: { $ref: '#/components/schemas/taxes' },
			billing_address: { $ref: '#/components/schemas/billing_address' },
			shipping_address: { $ref: '#/components/schemas/shipping_address' },
			notes: { $ref: '#/components/schemas/notes' },
			terms: { $ref: '#/components/schemas/terms' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			template_id: { $ref: '#/components/schemas/template_id' },
			template_name: { $ref: '#/components/schemas/template_name' },
			created_time: { $ref: '#/components/schemas/created_time' },
			last_modified_time: { $ref: '#/components/schemas/last_modified_time' },
			salesperson_id: { $ref: '#/components/schemas/salesperson_id' },
			salesperson_name: { $ref: '#/components/schemas/salesperson_name' },
			project: { $ref: '#/components/schemas/project' },
			tags: { $ref: '#/components/schemas/tags_response' },
		},
	},
	estimate_id: {
		description:
			'The  unique id of a particular estimate. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	estimate_number: {
		description:
			'Search estimates by estimate number.Variants<code>estimate_number_startswith</code> and <code>estimate_number_contains</code>',
		type: 'string',
	},
	exchange_rate: {
		description: 'Exchange rate of the currency.',
		type: 'number',
		format: 'double',
	},
	expiry_date: {
		description: 'The date of expiration of the estimates',
		type: 'string',
	},
	fax: { description: "Customer's fax number.", type: 'string' },
	file_name: {
		description: 'The name of the file to be attached',
		type: 'string',
	},
	first_name: {
		description: 'First Name of the Contact Person.',
		type: 'string',
	},
	'get-an-estimate-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			estimate: {
				type: 'object',
				properties: {
					estimate_id: { $ref: '#/components/schemas/estimate_id' },
					estimate_number: { $ref: '#/components/schemas/estimate_number' },
					date: { $ref: '#/components/schemas/date' },
					reference_number: { $ref: '#/components/schemas/reference_number' },
					is_pre_gst: { $ref: '#/components/schemas/is_pre_gst' },
					place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
					gst_no: { $ref: '#/components/schemas/gst_no' },
					shipping_gst_no: { $ref: '#/components/schemas/shipping_gst_no' },
					shipping_trader_name: {
						$ref: '#/components/schemas/shipping_trader_name',
					},
					shipping_legal_name: {
						$ref: '#/components/schemas/shipping_legal_name',
					},
					gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
					tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
					is_reverse_charge_applied: {
						$ref: '#/components/schemas/is_reverse_charge_applied',
					},
					status: { $ref: '#/components/schemas/status' },
					customer_id: { $ref: '#/components/schemas/customer_id' },
					customer_name: { $ref: '#/components/schemas/customer_name' },
					contact_persons_associated: {
						$ref: '#/components/schemas/contact_persons_associated',
					},
					currency_id: { $ref: '#/components/schemas/currency_id' },
					currency_code: { $ref: '#/components/schemas/currency_code' },
					exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
					expiry_date: { $ref: '#/components/schemas/expiry_date' },
					discount: { $ref: '#/components/schemas/discount' },
					is_discount_before_tax: {
						$ref: '#/components/schemas/is_discount_before_tax',
					},
					discount_type: { $ref: '#/components/schemas/discount_type' },
					is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
					is_viewed_by_client: {
						$ref: '#/components/schemas/is_viewed_by_client',
					},
					client_viewed_time: {
						$ref: '#/components/schemas/client_viewed_time',
					},
					line_items: { $ref: '#/components/schemas/line_items' },
					location_id: { $ref: '#/components/schemas/location_id' },
					location_name: { $ref: '#/components/schemas/location_name' },
					shipping_charge: { $ref: '#/components/schemas/shipping_charge' },
					adjustment: { $ref: '#/components/schemas/adjustment' },
					adjustment_description: {
						$ref: '#/components/schemas/adjustment_description',
					},
					sub_total: { $ref: '#/components/schemas/sub_total' },
					total: { $ref: '#/components/schemas/total' },
					tax_total: { $ref: '#/components/schemas/tax_total' },
					price_precision: { $ref: '#/components/schemas/price_precision' },
					taxes: { $ref: '#/components/schemas/taxes' },
					billing_address: { $ref: '#/components/schemas/billing_address' },
					shipping_address: { $ref: '#/components/schemas/shipping_address' },
					custom_fields: { $ref: '#/components/schemas/custom_fields' },
					template_id: { $ref: '#/components/schemas/template_id' },
					template_name: { $ref: '#/components/schemas/template_name' },
					created_time: { $ref: '#/components/schemas/created_time' },
					last_modified_time: {
						$ref: '#/components/schemas/last_modified_time',
					},
					salesperson_id: { $ref: '#/components/schemas/salesperson_id' },
					salesperson_name: { $ref: '#/components/schemas/salesperson_name' },
					project: { $ref: '#/components/schemas/project' },
					tags: { $ref: '#/components/schemas/tags_response' },
				},
			},
		},
	},
	'get-estimate-email-content-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			body: { $ref: '#/components/schemas/body' },
			error_list: { $ref: '#/components/schemas/error_list' },
			subject: { $ref: '#/components/schemas/subject' },
			emailtemplates: {
				description: 'The email template information',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						selected: {
							description: 'Boolean check for the email template',
							type: 'boolean',
						},
						name: { description: 'The name of the line item', type: 'string' },
						email_template_id: {
							description:
								'Get the email content based on a specific email template. If this param is not inputted, then the content will be based on the email template associated with the customer. If no template is associated with the customer, then default template will be used. Note: This value is a set of numeric characters.',
							type: 'string',
						},
					},
				},
			},
			to_contacts: {
				description: 'The list of contacts the mail to be sent',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						first_name: { $ref: '#/components/schemas/first_name' },
						selected: { $ref: '#/components/schemas/selected' },
						phone: { $ref: '#/components/schemas/phone' },
						email: { $ref: '#/components/schemas/email' },
						last_name: { $ref: '#/components/schemas/last_name' },
						salutation: { $ref: '#/components/schemas/salutation' },
						contact_person_id: {
							$ref: '#/components/schemas/contact_person_id',
						},
						mobile: { $ref: '#/components/schemas/mobile' },
					},
				},
			},
			file_name: { $ref: '#/components/schemas/file_name' },
			from_emails: {
				description: 'The list of from email ids',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						user_name: { type: 'string' },
						selected: {
							description: 'Boolean check for the email template',
							type: 'boolean',
						},
						email: { $ref: '#/components/schemas/email' },
					},
				},
			},
			customer_id: { $ref: '#/components/schemas/customer_id' },
		},
	},
	gst_no: {
		description: '15 digit GST identification number of the customer.',
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
	has_attachment: { type: 'boolean' },
	hsn_or_sac: {
		description: 'Add HSN/SAC code for your goods/services',
		type: 'string',
		'x-node_available_in': ['in', 'ke', 'za'],
		'x-node_unavailable_in': [],
	},
	index: { type: 'integer', description: 'The index of the custom field.' },
	is_discount_before_tax: {
		description:
			'Used to specify how the discount has to applied. Either before or after the calculation of tax.',
		type: 'boolean',
	},
	is_email_enabled: {
		description:
			'Used to check if Email communication preference is enabled for the contact person at transaction level.',
		type: 'boolean',
	},
	is_inclusive_tax: {
		description:
			'Used to specify whether the line item rates are inclusive or exclusive of tax.',
		type: 'boolean',
		'x-node_available_in': [],
		'x-node_unavailable_in': ['us', 'ca'],
	},
	is_pre_gst: {
		description: 'Applicable for transactions that fall before july 1, 2017',
		type: 'boolean',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	is_reverse_charge_applied: {
		description:
			'(Required if customer tax treatment is <code>vat_registered</code>)<br/>Used to specify whether the transaction is applicable for Domestic Reverse Charge (DRC) or not.',
		type: 'boolean',
		'x-node_available_in': ['za'],
		'x-node_unavailable_in': [],
	},
	is_sms_enabled: {
		description:
			'Used to check if SMS communication preference is enabled for the contact person at transaction level.',
		type: 'boolean',
		'x-node_available_in': ['SMS integration'],
	},
	is_tag_mandatory: {
		description: 'Used to check if the tag is mandatory',
		type: 'boolean',
	},
	is_viewed_by_client: { type: 'boolean' },
	is_whatsapp_enabled: {
		description:
			'Used to check if WhatsApp communication preference is enabled for the contact person at transaction level.',
		type: 'boolean',
		'x-node_available_in': ['WhatsApp integration'],
	},
	item_id: {
		description:
			'Unique identifier of the item (product or service) being quoted in this line item. Use the `item_id` returned by the Items API for the same organization. This links the line item to a specific product or service in your catalog. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	item_order: {
		description:
			'Sequential order number for this line item on the estimate. Determines the display order of line items in the estimate document - lower values appear first. Use this field to organize line items in a specific sequence.',
		type: 'integer',
	},
	item_total: {
		description:
			'Total amount for this line item after applying quantity, rate, discounts, and taxes. This value contributes to the overall estimate total.',
		type: 'number',
		format: 'float',
	},
	label: { type: 'string' },
	last_modified_time: { type: 'string' },
	last_name: {
		description: 'Last Name of the Contact Person.',
		type: 'string',
	},
	line_item_category: {
		description:
			'Category of the line item. Allowed values are <code>line_item</code>, <code>header</code> and <code>subtotal</code>. Use <code>line_item</code> for regular line items, <code>header</code> for header titles and <code>subtotal</code> for intermediate subtotal rows. For regular line items, you can send line_item or omit this field',
		type: 'string',
	},
	line_item_id: {
		description:
			'Unique identifier of the line item within the estimate. Required when updating or referencing a specific line item. If omitted during creation, a new line item will be added. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	line_items: {
		description:
			'Array of line items included in the estimate. Each line item represents a product or service being quoted, with details such as item ID, name, description, quantity, rate, taxes, and discounts. Line items determine the total amount of the estimate and are displayed on the estimate document.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				item_id: { $ref: '#/components/schemas/item_id' },
				line_item_id: { $ref: '#/components/schemas/line_item_id' },
				name: { $ref: '#/components/schemas/name' },
				description: { $ref: '#/components/schemas/description' },
				item_order: { $ref: '#/components/schemas/item_order' },
				product_type: { $ref: '#/components/schemas/product_type' },
				sat_item_key_code: { $ref: '#/components/schemas/sat_item_key_code' },
				unitkey_code: { $ref: '#/components/schemas/unitkey_code' },
				bcy_rate: { $ref: '#/components/schemas/bcy_rate' },
				rate: { $ref: '#/components/schemas/rate' },
				quantity: { $ref: '#/components/schemas/quantity' },
				unit: { $ref: '#/components/schemas/unit' },
				discount_amount: { $ref: '#/components/schemas/discount_amount' },
				discount: { $ref: '#/components/schemas/discount' },
				tax_id: { $ref: '#/components/schemas/tax_id' },
				tds_tax_id: { $ref: '#/components/schemas/tds_tax_id' },
				tax_name: { $ref: '#/components/schemas/tax_name' },
				tax_type: { $ref: '#/components/schemas/tax_type' },
				tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
				tax_treatment_code: { $ref: '#/components/schemas/tax_treatment_code' },
				item_total: { $ref: '#/components/schemas/item_total' },
				location_id: { $ref: '#/components/schemas/location_id' },
				location_name: { $ref: '#/components/schemas/location_name' },
				tags: { $ref: '#/components/schemas/tags_response' },
				line_item_category: { $ref: '#/components/schemas/line_item_category' },
			},
		},
	},
	'list-estimate-comments-and-history-response': {
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
						estimate_id: { $ref: '#/components/schemas/estimate_id' },
						description: {
							description: 'The description of the line items',
							type: 'string',
						},
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
		},
	},
	'list-estimate-template-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			templates: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						template_name: { $ref: '#/components/schemas/template_name' },
						template_id: { $ref: '#/components/schemas/template_id' },
						template_type: { $ref: '#/components/schemas/template_type' },
					},
				},
			},
		},
	},
	'list-estimates-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			estimates: {
				description: 'The list of all estimates',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						estimate_id: { $ref: '#/components/schemas/estimate_id' },
						customer_name: { $ref: '#/components/schemas/customer_name' },
						customer_id: { $ref: '#/components/schemas/customer_id' },
						status: { $ref: '#/components/schemas/status' },
						estimate_number: { $ref: '#/components/schemas/estimate_number' },
						reference_number: { $ref: '#/components/schemas/reference_number' },
						date: { $ref: '#/components/schemas/date' },
						currency_id: { $ref: '#/components/schemas/currency_id' },
						currency_code: { $ref: '#/components/schemas/currency_code' },
						total: { $ref: '#/components/schemas/total' },
						location_id: { $ref: '#/components/schemas/location_id' },
						location_name: { $ref: '#/components/schemas/location_name' },
						created_time: { $ref: '#/components/schemas/created_time' },
						last_modified_time: {
							$ref: '#/components/schemas/last_modified_time',
						},
						accepted_date: { $ref: '#/components/schemas/accepted_date' },
						declined_date: { $ref: '#/components/schemas/declined_date' },
						expiry_date: { $ref: '#/components/schemas/expiry_date' },
						has_attachment: { $ref: '#/components/schemas/has_attachment' },
						is_viewed_by_client: {
							$ref: '#/components/schemas/is_viewed_by_client',
						},
						client_viewed_time: {
							$ref: '#/components/schemas/client_viewed_time',
						},
					},
				},
			},
			page_context: {
				description: 'The context of a particular page.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						page: { description: 'Number of pages', type: 'integer' },
						per_page: { description: 'Per page values', type: 'integer' },
						has_more_page: {
							description: 'Check if has more pages',
							type: 'boolean',
						},
						report_name: { description: 'The report name', type: 'string' },
						applied_filter: {
							description: 'The filer applied for sorting',
							type: 'string',
						},
						sort_column: { description: 'Sort estimates.', type: 'string' },
						sort_order: {
							description: 'The order for sorting',
							type: 'string',
						},
					},
				},
			},
		},
	},
	location_id: {
		description:
			'Unique identifier of the business location associated with the estimate. Use the `location_id` returned by the Locations API for the same organization. This links the estimate to a specific business location, which may affect tax calculations, reporting, and business operations. Required if your organization has multiple locations configured. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	location_name: { description: 'Name of the location.', type: 'string' },
	mail_documents: {
		description: 'Array of Documents ids, which is attached into email',
		type: 'array',
		items: { type: 'string' },
	},
	'mark-an-estimate-as-accepted-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'mark-an-estimate-as-declined-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'mark-an-estimate-as-sent-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	mobile: {
		description: 'Mobile Number of the Contact Person.',
		type: 'string',
	},
	name: {
		description:
			'Name of the product or service for this line item. This is displayed on the estimate document and helps the customer identify what is being quoted.',
		type: 'string',
	},
	notes: {
		description:
			'Additional information or comments to be displayed on the estimate document. This field is typically used for thank you messages, special instructions, or any other information you want to communicate to the customer. The notes appear on the estimate PDF and are visible to customers.',
		type: 'string',
	},
	operation_type: { type: 'string' },
	phone: { description: 'Phone Number of the Contact Person.', type: 'string' },
	place_of_supply: {
		description:
			'Place where the goods/services are supplied to. (If not given, <code>place of contact</code> given for the contact will be taken)<br/>Supported codes for UAE emirates are : </br>Abu Dhabi - <code>AB</code>,</br>Ajman - <code>AJ</code>,</br>Dubai - <code>DU</code>,</br>Fujairah - <code>FU</code>,</br>Ras al-Khaimah - <code>RA</code>,</br>Sharjah - <code>SH</code>,</br>Umm al-Quwain - <code>UM</code><br/>Supported codes for the GCC countries are : </br>United Arab Emirates - <code>AE</code>,</br>Saudi Arabia - <code>SA</code>,</br>Bahrain - <code>BH</code>,</br>Kuwait - <code>KW</code>,</br>Oman - <code>OM</code>,</br>Qatar - <code>QA</code>.',
		type: 'string',
		'x-node_available_in': ['in', 'gcc'],
		'x-node_unavailable_in': [],
	},
	price_precision: {
		description: 'The precision value on the price',
		type: 'integer',
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
	product_type: {
		description:
			"Type of product or service for this line item. Allowed values: <code>goods</code> or <code>services</code>. For South Africa Edition, additional values include <code>capital_service</code> and <code>capital_goods</code>. This classification affects tax calculations, reporting, and compliance requirements based on your organization's location and tax regulations.",
		type: 'string',
	},
	project: {
		type: 'object',
		properties: {
			project_id: { $ref: '#/components/schemas/project_id' },
			project_name: { $ref: '#/components/schemas/project_name' },
		},
	},
	project_id: {
		description:
			'Unique identifier of the project associated with this estimate. Use the <code>project_id</code> returned by the Projects API for the same organization. Linking an estimate to a project helps with project-based billing, tracking, and reporting. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	project_name: { description: 'Name of the project.', type: 'string' },
	quantity: {
		description:
			'Number of units of the product or service being quoted in this line item. This value is multiplied by the rate to calculate the line item total.',
		type: 'number',
		format: 'double',
	},
	rate: {
		description:
			'Unit price or rate for the product or service in this line item. This value is multiplied by the quantity to determine the line item total before taxes and discounts.',
		type: 'number',
		format: 'double',
	},
	reference_number: {
		description:
			'Optional external identifier used to associate the estimate with other systems or workflows. Helps improve traceability and integration during estimate creation.',
		type: 'string',
	},
	retainer_percentage: {
		description:
			'Percentage of the estimate amount to be collected as a retainer (upfront payment) when the estimate is accepted. Specify a value between 0 and 100. This determines the portion of the total estimate that will be invoiced as a retainer.',
		type: 'integer',
	},
	salesperson_id: {
		type: 'string',
		description:
			'Unique identifier of the salesperson associated with this estimate. Note: This value is a set of numeric characters.',
	},
	salesperson_name: {
		description: 'Name of the sales person.',
		type: 'string',
	},
	salutation: {
		description: 'Salutation of the Contact Person.',
		type: 'string',
	},
	sat_item_key_code: {
		description:
			'Add SAT Item Key Code for your goods/services. Download the <a href= http://omawww.sat.gob.mx/tramitesyservicios/Paginas/documentos/catCFDI_V_4_07122022.xls  >CFDI Catalogs.</a>',
		type: 'string',
		'x-node_available_in': ['mx'],
		'x-node_unavailable_in': [],
	},
	selected: {
		description: 'Boolean check for the email template',
		type: 'boolean',
	},
	send_from_org_email_id: {
		description:
			"Boolean to trigger the email from the organization's email address",
		type: 'boolean',
	},
	shipping_address: {
		description: 'The shipping address',
		type: 'object',
		properties: {
			address: { $ref: '#/components/schemas/address' },
			city: { $ref: '#/components/schemas/city' },
			state: { $ref: '#/components/schemas/state' },
			zip: { $ref: '#/components/schemas/zip' },
			country: { $ref: '#/components/schemas/country' },
			fax: { $ref: '#/components/schemas/fax' },
		},
	},
	shipping_charge: {
		description:
			'Additional shipping or delivery charges applied to the estimate. Must be specified as a fixed amount (e.g., "25.00"). This amount is added to the estimate total and is subject to tax calculation.',
		type: 'string',
	},
	shipping_gst_no: {
		description:
			'GSTIN of the shipping party, when it differs from the billed customer. Used for e-Way Bill and e-Invoice compliance. Max-length [15].',
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	shipping_legal_name: {
		description:
			'Legal name of the shipping party, when it differs from the billed customer. Used for e-Invoice compliance. Max-length [100].',
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	shipping_trader_name: {
		description:
			'Trade name of the shipping party, when it differs from the billed customer. Used for e-Way Bill and e-Invoice compliance. Max-length [100].',
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	show_comment_to_clients: {
		description: 'Boolean to show the comments to contacts in portal.',
		type: 'boolean',
	},
	show_on_pdf: { type: 'boolean' },
	state: {
		description: "State of the customer's billing address.",
		type: 'string',
	},
	status: {
		description:
			'Search estimates by status.Allowed Values<code>draft</code>, <code>sent</code>,<code> invoiced </code>, <code>accepted</code>, <code>declined</code> and <code>expired</code>',
		type: 'string',
	},
	sub_total: {
		description: 'The sub total of the all items',
		type: 'number',
		format: 'float',
	},
	subject: {
		description: 'Subject of an email has to be sent.',
		type: 'string',
	},
	'submit-an-estimate-for-approval-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
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
	tax_amount: {
		description: 'The amount of the tax levied',
		type: 'number',
		format: 'float',
	},
	tax_authority_id: {
		description:
			'ID of the tax authority. Tax authority depends on the location of the customer. For sample, if the customer is located in NY, then the tax authority is NY tax authority. Note: This value is a set of numeric characters.',
		type: 'string',
		'x-node_available_in': ['us'],
		'x-node_unavailable_in': [],
	},
	tax_exemption_id: {
		description:
			'ID of the tax exemption. Note: This value is a set of numeric characters.',
		type: 'string',
		'x-node_available_in': ['in', 'us'],
		'x-node_unavailable_in': [],
	},
	tax_id: {
		description:
			'Unique identifier of the tax to be applied to this line item. Use the `tax_id` returned by the Taxes API for the same organization. This determines which tax rate and rules are applied to the line item, affecting the final tax calculation and compliance reporting. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	tax_name: { description: 'The name of the tax', type: 'string' },
	tax_percentage: {
		description: 'The  percentage of tax levied',
		type: 'number',
		format: 'float',
	},
	tax_total: {
		description: 'The total amount of the tax levied',
		type: 'number',
		format: 'double',
	},
	tax_treatment: {
		description:
			'VAT treatment for the Estimate. Allowed Values: <code>vat_registered</code>,<code>vat_not_registered</code>,<code>gcc_vat_not_registered</code>,<code>gcc_vat_registered</code>,<code>non_gcc</code>.</br><code>dz_vat_registered</code> and <code>dz_vat_not_registered</code> supported only for <b>UAE.</b></br><code>home_country_mexico</code>,<code>border_region_mexico</code>,<code>non_mexico</code> supported only for <b>MX</b>. <br/><b>For Kenya Edition:</b> <code>vat_registered</code> ,<code>vat_not_registered</code> ,<code>non_kenya</code>(A business that is located outside Kenya).<br/><b>For SouthAfrica Edition:</b> <code>vat_registered</code>, <code>vat_not_registered</code>, <code>overseas</code>(A business that is located outside SouthAfrica).',
		type: 'string',
		'x-node_available_in': ['gcc', 'mx', 'ke', 'za'],
		'x-node_unavailable_in': [],
	},
	tax_treatment_code: {
		description:
			'Specify reason for using out of scope.</br>Supported values for <b>UAE</b> are <code>uae_same_tax_group</code>, <code>uae_reimbursed_expense</code> and <code>uae_others</code>.</br> Supported values for <b>Bahrain</b> are <code>bahrain_same_tax_group</code>, <code>bahrain_transfer_of_concern</code>, <code>bahrain_disbursement</code>, <code>bahrain_head_to_branch_transaction</code>, <code>bahrain_warranty_repair_services</code> and <code>bahrain_others</code>.</br>Supported values for <b>Saudi Arabia</b> are <code>ksa_pvt_health</code>, <code>ksa_pvt_edu</code>, <code>ksa_reimbursed_expense</code> and <code>ksa_house_sales</code>.',
		type: 'string',
		'x-node_available_in': ['gcc'],
		'x-node_unavailable_in': [],
	},
	tax_type: { description: 'The type of the tax', type: 'string' },
	taxes: {
		description: 'List of the taxes levied',
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
		description:
			'ID of the TDS tax. Note: This value is a set of numeric characters.',
		type: 'string',
		'x-node_available_in': ['mx'],
		'x-node_unavailable_in': [],
	},
	template_id: {
		description:
			'The ID of the template used for generating the estimate PDF. Use this to apply custom branding or formats. Fetch template IDs using the Templates API (GET /estimates/templates). Note: This value is a set of numeric characters.',
		type: 'string',
	},
	template_name: { type: 'string' },
	template_type: { description: 'The type of template type', type: 'string' },
	terms: {
		description:
			'Defines the terms and conditions to be included in the estimate document. This field can be used to specify payment terms, delivery schedules, return policies, or other transactional details. The terms appear on the estimate PDF and helps communicate key conditions related to the estimate.',
		type: 'string',
	},
	time: { type: 'string' },
	to_mail_ids: {
		description: 'Array of email address of the recipients.',
		type: 'array',
		items: { type: 'string' },
	},
	total: {
		description:
			'Search estimates by estimate total.Variants <code>total_less_than</code>, <code>total_less_equals</code>, <code>total_greater_than</code> and <code>total_greater_equals</code>',
		type: 'number',
		format: 'double',
	},
	transaction_id: {
		type: 'string',
		description:
			'Unique identifier of the transaction associated with the comment. Note: This value is a set of numeric characters.',
	},
	transaction_type: { type: 'string' },
	unit: {
		description:
			'Unit of measurement for the product or service in this line item (e.g., kgs, Nos., hours). Helps clarify the quantity being quoted.',
		type: 'string',
	},
	unitkey_code: {
		description:
			'Add SAT Unit Key Code for your goods/services. Download the <a href= http://omawww.sat.gob.mx/tramitesyservicios/Paginas/documentos/catCFDI_V_4_07122022.xls  >CFDI Catalogs.</a>',
		type: 'string',
		'x-node_available_in': ['mx'],
		'x-node_unavailable_in': [],
	},
	'update-an-estimate-customfield-request': {
		description: 'Update the custom fields of an estimate.',
		type: 'object',
		properties: {
			custom_fields: { $ref: '#/components/schemas/custom_fields_update' },
		},
	},
	'update-an-estimate-customfield-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'update-an-estimate-request': {
		required: ['customer_id', 'custom_fields'],
		type: 'object',
		properties: {
			customer_id: { $ref: '#/components/schemas/customer_id' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			contact_persons_associated: {
				$ref: '#/components/schemas/contact_persons_associated_payload',
			},
			template_id: { $ref: '#/components/schemas/template_id' },
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
			gst_no: { $ref: '#/components/schemas/gst_no' },
			shipping_gst_no: { $ref: '#/components/schemas/shipping_gst_no' },
			shipping_trader_name: {
				$ref: '#/components/schemas/shipping_trader_name',
			},
			shipping_legal_name: { $ref: '#/components/schemas/shipping_legal_name' },
			estimate_number: {
				description:
					'Unique identifier for the estimate. If not provided, the system auto-generates one. This number is used for tracking, referencing, and communicating the estimate to customers. It appears on the estimate PDF and in all customer communications.',
				$ref: '#/components/schemas/estimate_number',
			},
			reference_number: {
				description:
					'External reference associated with the estimate. Use this field to link the estimate to external systems, customer requests, or internal workflows. The reference number appears on the estimate document for customer and internal tracking.',
				$ref: '#/components/schemas/reference_number',
			},
			date: {
				description:
					'Date the estimate is created. This date appears on the estimate document and is used for record-keeping, reporting, and determining the validity period. Format: YYYY-MM-DD.',
				$ref: '#/components/schemas/date',
			},
			expiry_date: {
				description:
					'Date when the estimate expires. After this date, the estimate is no longer valid for acceptance. Used to set deadlines for customer response and manage time-sensitive offers. Format: YYYY-MM-DD.',
				$ref: '#/components/schemas/expiry_date',
			},
			exchange_rate: {
				description:
					'Exchange rate used to convert the estimate amount to the base currency of your organization. Required for multi-currency transactions. The exchange rate affects the total amount and reporting in the base currency.',
				$ref: '#/components/schemas/exchange_rate',
			},
			discount: { $ref: '#/components/schemas/discount' },
			is_discount_before_tax: {
				$ref: '#/components/schemas/is_discount_before_tax',
			},
			discount_type: { $ref: '#/components/schemas/discount_type' },
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			custom_body: { $ref: '#/components/schemas/custom_body' },
			custom_subject: { $ref: '#/components/schemas/custom_subject' },
			salesperson_name: { $ref: '#/components/schemas/salesperson_name' },
			custom_fields: {
				description: 'Custom fields for an estimate.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						index: { $ref: '#/components/schemas/index' },
						value: { $ref: '#/components/schemas/value' },
					},
				},
			},
			line_items: {
				description: 'Line items of an estimate.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						item_id: { $ref: '#/components/schemas/item_id' },
						line_item_id: { $ref: '#/components/schemas/line_item_id' },
						name: { $ref: '#/components/schemas/name' },
						description: { $ref: '#/components/schemas/description' },
						product_type: { $ref: '#/components/schemas/product_type' },
						hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
						sat_item_key_code: {
							$ref: '#/components/schemas/sat_item_key_code',
						},
						unitkey_code: { $ref: '#/components/schemas/unitkey_code' },
						item_order: { $ref: '#/components/schemas/item_order' },
						bcy_rate: { $ref: '#/components/schemas/bcy_rate' },
						rate: { $ref: '#/components/schemas/rate' },
						quantity: { $ref: '#/components/schemas/quantity' },
						unit: { $ref: '#/components/schemas/unit' },
						discount_amount: { $ref: '#/components/schemas/discount_amount' },
						discount: { $ref: '#/components/schemas/discount' },
						tax_id: { $ref: '#/components/schemas/tax_id' },
						product_tax_category: {
							$ref: '#/components/schemas/product_tax_category',
						},
						tds_tax_id: { $ref: '#/components/schemas/tds_tax_id' },
						tax_name: { $ref: '#/components/schemas/tax_name' },
						tax_type: { $ref: '#/components/schemas/tax_type' },
						tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
						tax_treatment_code: {
							$ref: '#/components/schemas/tax_treatment_code',
						},
						item_total: { $ref: '#/components/schemas/item_total' },
						location_id: { $ref: '#/components/schemas/location_id' },
						tags: { $ref: '#/components/schemas/tags' },
						line_item_category: {
							$ref: '#/components/schemas/line_item_category',
						},
					},
				},
			},
			location_id: { $ref: '#/components/schemas/location_id' },
			notes: { $ref: '#/components/schemas/notes' },
			terms: { $ref: '#/components/schemas/terms' },
			shipping_charge: { $ref: '#/components/schemas/shipping_charge' },
			adjustment: { $ref: '#/components/schemas/adjustment' },
			adjustment_description: {
				$ref: '#/components/schemas/adjustment_description',
			},
			tax_id: { $ref: '#/components/schemas/tax_id' },
			tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
			tax_authority_id: { $ref: '#/components/schemas/tax_authority_id' },
			avatax_use_code: { $ref: '#/components/schemas/avatax_use_code' },
			avatax_exempt_no: { $ref: '#/components/schemas/avatax_exempt_no' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			is_reverse_charge_applied: {
				$ref: '#/components/schemas/is_reverse_charge_applied',
			},
			item_id: { $ref: '#/components/schemas/item_id' },
			line_item_id: { $ref: '#/components/schemas/line_item_id' },
			name: { $ref: '#/components/schemas/name' },
			description: { $ref: '#/components/schemas/description' },
			rate: { $ref: '#/components/schemas/rate' },
			unit: { $ref: '#/components/schemas/unit' },
			quantity: { $ref: '#/components/schemas/quantity' },
			project_id: { $ref: '#/components/schemas/project_id' },
			accept_retainer: { $ref: '#/components/schemas/accept_retainer' },
			retainer_percentage: { $ref: '#/components/schemas/retainer_percentage' },
			tags: { $ref: '#/components/schemas/tags' },
		},
	},
	'update-an-estimate-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			estimate: {
				type: 'object',
				properties: {
					estimate_id: { $ref: '#/components/schemas/estimate_id' },
					estimate_number: { $ref: '#/components/schemas/estimate_number' },
					date: { $ref: '#/components/schemas/date' },
					reference_number: { $ref: '#/components/schemas/reference_number' },
					is_pre_gst: { $ref: '#/components/schemas/is_pre_gst' },
					place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
					gst_no: { $ref: '#/components/schemas/gst_no' },
					shipping_gst_no: { $ref: '#/components/schemas/shipping_gst_no' },
					shipping_trader_name: {
						$ref: '#/components/schemas/shipping_trader_name',
					},
					shipping_legal_name: {
						$ref: '#/components/schemas/shipping_legal_name',
					},
					gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
					tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
					is_reverse_charge_applied: {
						$ref: '#/components/schemas/is_reverse_charge_applied',
					},
					status: { $ref: '#/components/schemas/status' },
					customer_id: { $ref: '#/components/schemas/customer_id' },
					customer_name: { $ref: '#/components/schemas/customer_name' },
					contact_persons_associated: {
						$ref: '#/components/schemas/contact_persons_associated',
					},
					currency_id: { $ref: '#/components/schemas/currency_id' },
					currency_code: { $ref: '#/components/schemas/currency_code' },
					exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
					expiry_date: { $ref: '#/components/schemas/expiry_date' },
					discount: { $ref: '#/components/schemas/discount' },
					is_discount_before_tax: {
						$ref: '#/components/schemas/is_discount_before_tax',
					},
					discount_type: { $ref: '#/components/schemas/discount_type' },
					is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
					line_items: { $ref: '#/components/schemas/line_items' },
					location_id: { $ref: '#/components/schemas/location_id' },
					location_name: { $ref: '#/components/schemas/location_name' },
					shipping_charge: { $ref: '#/components/schemas/shipping_charge' },
					adjustment: { $ref: '#/components/schemas/adjustment' },
					adjustment_description: {
						$ref: '#/components/schemas/adjustment_description',
					},
					sub_total: { $ref: '#/components/schemas/sub_total' },
					total: { $ref: '#/components/schemas/total' },
					tax_total: { $ref: '#/components/schemas/tax_total' },
					price_precision: { $ref: '#/components/schemas/price_precision' },
					taxes: { $ref: '#/components/schemas/taxes' },
					billing_address: { $ref: '#/components/schemas/billing_address' },
					shipping_address: { $ref: '#/components/schemas/shipping_address' },
					notes: { $ref: '#/components/schemas/notes' },
					terms: { $ref: '#/components/schemas/terms' },
					custom_fields: { $ref: '#/components/schemas/custom_fields' },
					template_id: { $ref: '#/components/schemas/template_id' },
					template_name: { $ref: '#/components/schemas/template_name' },
					created_time: { $ref: '#/components/schemas/created_time' },
					last_modified_time: {
						$ref: '#/components/schemas/last_modified_time',
					},
					salesperson_id: { $ref: '#/components/schemas/salesperson_id' },
					salesperson_name: { $ref: '#/components/schemas/salesperson_name' },
					project: { $ref: '#/components/schemas/project' },
					tags: { $ref: '#/components/schemas/tags_response' },
				},
			},
		},
	},
	'update-billing-address-request': {
		type: 'object',
		properties: {
			address: {
				description: 'Billing address for the estimate',
				type: 'string',
			},
			city: {
				description: "City of the customer's billing address.",
				type: 'string',
			},
			state: {
				description: "State of the customer's billing address.",
				type: 'string',
			},
			zip: {
				description: "Zip code of the customer's billing address.",
				type: 'string',
			},
			country: {
				description: "Country of the customer's billing address.",
				type: 'string',
			},
			fax: { description: "Customer's fax number.", type: 'string' },
		},
	},
	'update-billing-address-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'update-comment-request': {
		type: 'object',
		properties: {
			description: {
				description: 'The description of the line items',
				type: 'string',
			},
			show_comment_to_clients: {
				description: 'Boolean to show the comments to contacts in portal.',
				type: 'boolean',
			},
		},
	},
	'update-comment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			comment: {
				type: 'object',
				properties: {
					comment_id: { $ref: '#/components/schemas/comment_id' },
					estimate_id: { $ref: '#/components/schemas/estimate_id' },
					description: { $ref: '#/components/schemas/description' },
					commented_by_id: { $ref: '#/components/schemas/commented_by_id' },
					commented_by: { $ref: '#/components/schemas/commented_by' },
					date: { $ref: '#/components/schemas/date' },
					date_description: { $ref: '#/components/schemas/date_description' },
					time: { $ref: '#/components/schemas/time' },
					comment_type: { $ref: '#/components/schemas/comment_type' },
				},
			},
		},
	},
	'update-estimate-template-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'update-shipping-address-request': {
		type: 'object',
		properties: {
			address: { $ref: '#/components/schemas/address' },
			city: { $ref: '#/components/schemas/city' },
			state: { $ref: '#/components/schemas/state' },
			zip: { $ref: '#/components/schemas/zip' },
			country: { $ref: '#/components/schemas/country' },
			fax: { $ref: '#/components/schemas/fax' },
		},
	},
	'update-shipping-address-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	value: { type: 'string', description: 'The value of the custom field.' },
	vat_treatment: {
		description:
			'(Optional) VAT treatment for the estimates. VAT treatment denotes the location of the customer, if the customer resides in UK then the VAT treatment is <code>uk</code>. If the customer is in an EU country & VAT registered, you are resides in Northen Ireland and selling Goods then his VAT treatment is <code>eu_vat_registered</code>, if he resides outside of the UK then his VAT treatment is <code>overseas</code> (For Pre Brexit, this can be split as <code>eu_vat_registered</code>, <code>eu_vat_not_registered</code> and <code>non_eu</code>).',
		type: 'string',
		'x-node_available_in': ['uk'],
		'x-node_unavailable_in': [],
	},
	zip: {
		description: "Zip code of the customer's billing address.",
		type: 'string',
	},
} as const satisfies Record<string, JsonValue>;

export const operations = [
	{
		id: 'create_estimate',
		group: 'estimates',
		groupSlug: 'estimates',
		name: 'createEstimate',
		method: 'POST',
		path: '/estimates',
		summary: 'Create an Estimate',
		description: 'Create an estimate for your customer.',
		docsUrl: 'https://www.zoho.com/books/api/v3/estimates/',
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
				name: 'send',
				in: 'query',
				required: false,
				description:
					'Send the estimate to the contact person(s) associated with the estimate.Allowed Values: <code>true</code> and <code>false</code>',
				schema: { type: 'boolean' },
			},
			{
				name: 'ignore_auto_number_generation',
				in: 'query',
				required: false,
				description:
					'Ignore auto estimate number generation for this estimate. This mandates the estimate number.',
				schema: { type: 'boolean' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/create-an-estimate-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/create-an-estimate-response' },
			},
		],
		scopes: ['ZohoBooks.estimates.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_estimates',
		group: 'estimates',
		groupSlug: 'estimates',
		name: 'listEstimates',
		method: 'GET',
		path: '/estimates',
		summary: 'List estimates',
		description: 'List all estimates with pagination.',
		docsUrl: 'https://www.zoho.com/books/api/v3/estimates/',
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
				name: 'estimate_number',
				in: 'query',
				required: false,
				description:
					'Filter or search estimates by their unique estimate number. Supports variants such as <code>estimate_number_startswith</code> and <code>estimate_number_contains</code> for partial matches. Useful for quickly locating a specific estimate or a group of estimates with similar numbering.',
				schema: { type: 'string' },
			},
			{
				name: 'reference_number',
				in: 'query',
				required: false,
				description:
					'Search estimates by reference number. Filters estimates based on external reference identifiers like purchase order numbers, contract numbers, or project codes. Useful for finding estimates associated with specific projects or business transactions.',
				schema: { type: 'string' },
			},
			{
				name: 'customer_name',
				in: 'query',
				required: false,
				description:
					'Search estimates by customer name. Filters estimates based on the business or individual name associated with the estimate. Maximum length is 100 characters. Useful for finding all estimates for a specific customer or generating customer reports.',
				schema: { type: 'string' },
			},
			{
				name: 'total',
				in: 'query',
				required: false,
				description:
					'Search estimates by total amount. Filters estimates based on the final estimate amount including taxes, discounts, and adjustments. Useful for finding estimates within specific price ranges or identifying high-value transactions.',
				schema: { type: 'string' },
			},
			{
				name: 'customer_id',
				in: 'query',
				required: false,
				description:
					'Filter or search estimates by the unique customer ID. Use the <code>customer_id</code> returned by the Contacts API for the same organization. This helps you retrieve all estimates linked to a specific customer. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'item_id',
				in: 'query',
				required: false,
				description:
					'Search estimates by item ID. Filters estimates based on the unique identifier of specific products or services in line items. Use the GET `/items` API to find available item IDs. Useful for finding all estimates containing a specific product or service. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'item_name',
				in: 'query',
				required: false,
				description:
					'Search estimates by item name. Filters estimates based on product or service names in estimate line items. Supports <code>item_name_startswith</code> and <code>item_name_contains</code> variants. Maximum length is 100 characters. Useful for finding estimates with specific products or services.',
				schema: { type: 'string' },
			},
			{
				name: 'item_description',
				in: 'query',
				required: false,
				description:
					'Search estimates by item description. Filters estimates based on detailed descriptions of products or services in line items. Supports <code>item_description_startswith</code> and <code>item_description_contains</code> variants. Maximum length is 100 characters. Useful for finding estimates with specific item descriptions or technical specifications.',
				schema: { type: 'string' },
			},
			{
				name: 'custom_field',
				in: 'query',
				required: false,
				description:
					'Search estimates by custom fields.Variants: <code>custom_field_startswith</code> and <code>custom_field_contains</code>',
				schema: { type: 'string' },
			},
			{
				name: 'expiry_date',
				in: 'query',
				required: false,
				description: 'The date of expiration of the estimates',
				schema: { type: 'string' },
			},
			{
				name: 'expiry_date_start',
				in: 'query',
				required: false,
				description:
					'Filter estimates with an expiry date on or after the specified date. Useful for defining the start of a date range. Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'expiry_date_end',
				in: 'query',
				required: false,
				description:
					'Filter estimates with an expiry date on or before the specified date. Useful for defining the end of a date range. Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'expiry_date_before',
				in: 'query',
				required: false,
				description:
					'Filter estimates with an expiry date strictly before the specified date (exclusive). Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'expiry_date_after',
				in: 'query',
				required: false,
				description:
					'Filter estimates with an expiry date strictly after the specified date (exclusive). Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'date',
				in: 'query',
				required: false,
				description:
					'Search estimates by estimate date. Filters estimates based on the date they were created. Use yyyy-mm-dd format. Supports variants: <code>date_start</code>, <code>date_end</code>, <code>date_before</code> and <code>date_after</code>. Useful for finding estimates within date ranges or specific time periods.',
				schema: { type: 'string' },
			},
			{
				name: 'last_modified_time',
				in: 'query',
				required: false,
				description:
					'Search estimates modified after a specific time. Filters estimates based on their last modification timestamp. Use YYYY-MM-DDTHH:MM:SS-UTC format. Useful for finding recently updated estimates or syncing data changes. sample : 2023-11-18T02:02:51-0800, 2025-19-19T02:02:51%2B0800',
				schema: { type: 'string' },
			},
			{
				name: 'status',
				in: 'query',
				required: false,
				description:
					'Search estimates by status.Allowed Values<code>draft</code>, <code>sent</code>,<code> invoiced </code>, <code>accepted</code>, <code>declined</code> and <code>expired</code>',
				schema: {
					type: 'string',
					enum: [
						'draft',
						'pending_approval',
						'approved',
						'sent',
						'invoiced',
						'accepted',
						'declined',
						'expired',
						'viewed',
						'signed',
						'rejected',
						'partially_invoiced',
						'pending_signature',
					],
				},
			},
			{
				name: 'filter_by',
				in: 'query',
				required: false,
				description:
					'Filter estimates by status.Allowed Values <code>Status.All</code>, <code>Status.Sent</code>, <code>Status.Draft</code>, <code>Status.Invoiced</code>, <code>Status.Accepted</code>, <code>Status.Declined</code> and <code>Status.Expired</code>',
				schema: {
					type: 'string',
					enum: [
						'Status.All',
						'Status.Sent',
						'Status.Pending',
						'Status.Approved',
						'Status.Draft',
						'Status.Invoiced',
						'Status.Accepted',
						'Status.Declined',
						'Status.Expired',
						'Status.Viewed',
						'Status.AvalaraSyncFailed',
						'Status.TaxAutomationFailed',
						'Status.MyApprovals',
						'WithAttachment',
						'WithoutAttachment',
						'ExceptionList',
						'EmailScheduled',
						'Type.NewSubscription',
						'Type.Invoice',
					],
				},
			},
			{
				name: 'search_text',
				in: 'query',
				required: false,
				description:
					'Perform a keyword search across estimate number, reference number, or customer name. Use this parameter to quickly find estimates that match any of these fields, making it easier to locate relevant records with minimal input.',
				schema: { type: 'string' },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description:
					'Sort estimates. Allowed Values <code>customer_name</code>, <code>estimate_number</code>, <code>date</code>, <code>total</code> and <code>created_time</code>',
				schema: {
					type: 'string',
					enum: [
						'customer_name',
						'estimate_number',
						'date',
						'total',
						'created_time',
						'last_modified_time',
						'cf_(\\w+)',
					],
				},
			},
			{
				name: 'zcrm_potential_id',
				in: 'query',
				required: false,
				description:
					'Potential ID of a Deal in CRM. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'location_ids',
				in: 'query',
				required: false,
				description:
					'List of location IDs to filter estimates by their associated locations. Use this parameter to retrieve estimates linked to specific business locations. Note: This value is a comma-separated list of numeric location IDs.',
				schema: { type: 'string' },
			},
			{
				name: 'page',
				in: 'query',
				required: false,
				description:
					'Page number to be fetched from the paginated results. Default value is 1. Use this parameter along with per_page to navigate through large sets of estimate data. Useful for implementing pagination in your application.',
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
				schema: { $ref: '#/components/schemas/list-estimates-response' },
			},
		],
		scopes: ['ZohoBooks.estimates.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_estimate_using_custom_field',
		group: 'estimates',
		groupSlug: 'estimates',
		name: 'updateEstimateUsingCustomField',
		method: 'PUT',
		path: '/estimates',
		summary: "update an Estimate using a custom field's unique value",
		description:
			"A custom field will have unique values if it's configured to not accept duplicate values. Now, you can use that custom field's value to update an estimate by providing its API name in the X-Unique-Identifier-Key header and its value in the X-Unique-Identifier-Value header. Based on this value, the corresponding estimate will be retrieved and updated. Additionally, there is an optional X-Upsert header. If the X-Upsert header is true and the custom field's unique value is not found in any of the existing estimates, a new estimate will be created if the necessary payload details are available",
		docsUrl: 'https://www.zoho.com/books/api/v3/estimates/',
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
			schema: { $ref: '#/components/schemas/update-an-estimate-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-an-estimate-response' },
			},
		],
		scopes: ['ZohoBooks.estimates.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_estimate',
		group: 'estimates',
		groupSlug: 'estimates',
		name: 'updateEstimate',
		method: 'PUT',
		path: '/estimates/{estimate_id}',
		summary: 'Update an Estimate',
		description:
			'Update an existing estimate. To delete a line item just remove it from the line_items list.',
		docsUrl: 'https://www.zoho.com/books/api/v3/estimates/',
		parameters: [
			{
				name: 'estimate_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the estimate. Note: This value is a set of numeric characters.',
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
				name: 'ignore_auto_number_generation',
				in: 'query',
				required: false,
				description:
					'Ignore auto estimate number generation for this estimate. This mandates the estimate number.',
				schema: { type: 'boolean' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/update-an-estimate-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-an-estimate-response' },
			},
		],
		scopes: ['ZohoBooks.estimates.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_estimate',
		group: 'estimates',
		groupSlug: 'estimates',
		name: 'getEstimate',
		method: 'GET',
		path: '/estimates/{estimate_id}',
		summary: 'Get an estimate',
		description: 'Get the details of an estimate.',
		docsUrl: 'https://www.zoho.com/books/api/v3/estimates/',
		parameters: [
			{
				name: 'estimate_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the estimate. Note: This value is a set of numeric characters.',
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
					'Get the details of a particular estimate in formats such as json/ pdf/ html. Default format is json.Allowed Values: <code>json</code>, <code>pdf</code> and <code>html</code>',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/get-an-estimate-response' },
			},
		],
		scopes: ['ZohoBooks.estimates.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_estimate',
		group: 'estimates',
		groupSlug: 'estimates',
		name: 'deleteEstimate',
		method: 'DELETE',
		path: '/estimates/{estimate_id}',
		summary: 'Delete an Estimate',
		description: 'Delete an existing estimate.',
		docsUrl: 'https://www.zoho.com/books/api/v3/estimates/',
		parameters: [
			{
				name: 'estimate_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the estimate. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/delete-an-estimate-response' },
			},
		],
		scopes: ['ZohoBooks.estimates.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'update_custom_fields_in_estimate',
		group: 'estimates',
		groupSlug: 'estimates',
		name: 'updateCustomFieldsInEstimate',
		method: 'PUT',
		path: '/estimate/{estimate_id}/customfields',
		summary: 'Update custom field in existing estimates',
		description: 'Update the value of the custom field in existing estimates.',
		docsUrl: 'https://www.zoho.com/books/api/v3/estimates/',
		parameters: [
			{
				name: 'estimate_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the estimate. Note: This value is a set of numeric characters.',
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
				$ref: '#/components/schemas/update-an-estimate-customfield-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-an-estimate-customfield-response',
				},
			},
		],
		scopes: ['ZohoBooks.estimates.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_estimate_sent',
		group: 'estimates',
		groupSlug: 'estimates',
		name: 'markEstimateSent',
		method: 'POST',
		path: '/estimates/{estimate_id}/status/sent',
		summary: 'Mark an estimate as sent',
		description: 'Mark a draft estimate as sent.',
		docsUrl: 'https://www.zoho.com/books/api/v3/estimates/',
		parameters: [
			{
				name: 'estimate_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the estimate. Note: This value is a set of numeric characters.',
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
				schema: {
					$ref: '#/components/schemas/mark-an-estimate-as-sent-response',
				},
			},
		],
		scopes: ['ZohoBooks.estimates.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_estimate_accepted',
		group: 'estimates',
		groupSlug: 'estimates',
		name: 'markEstimateAccepted',
		method: 'POST',
		path: '/estimates/{estimate_id}/status/accepted',
		summary: 'Mark an estimate as accepted',
		description:
			'Mark a sent estimate as accepted if the customer has accepted it.',
		docsUrl: 'https://www.zoho.com/books/api/v3/estimates/',
		parameters: [
			{
				name: 'estimate_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the estimate. Note: This value is a set of numeric characters.',
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
				schema: {
					$ref: '#/components/schemas/mark-an-estimate-as-accepted-response',
				},
			},
		],
		scopes: ['ZohoBooks.estimates.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_estimate_declined',
		group: 'estimates',
		groupSlug: 'estimates',
		name: 'markEstimateDeclined',
		method: 'POST',
		path: '/estimates/{estimate_id}/status/declined',
		summary: 'Mark an estimate as declined',
		description:
			'Mark a sent estimate as declined if the customer has rejected it.',
		docsUrl: 'https://www.zoho.com/books/api/v3/estimates/',
		parameters: [
			{
				name: 'estimate_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the estimate. Note: This value is a set of numeric characters.',
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
				schema: {
					$ref: '#/components/schemas/mark-an-estimate-as-declined-response',
				},
			},
		],
		scopes: ['ZohoBooks.estimates.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'submit_estimate',
		group: 'estimates',
		groupSlug: 'estimates',
		name: 'submitEstimate',
		method: 'POST',
		path: '/estimates/{estimate_id}/submit',
		summary: 'Submit an estimate for approval',
		description: 'Submit an estimate for approval.',
		docsUrl: 'https://www.zoho.com/books/api/v3/estimates/',
		parameters: [
			{
				name: 'estimate_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the estimate. Note: This value is a set of numeric characters.',
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
				schema: {
					$ref: '#/components/schemas/submit-an-estimate-for-approval-response',
				},
			},
		],
		scopes: ['ZohoBooks.estimates.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'approve_estimate',
		group: 'estimates',
		groupSlug: 'estimates',
		name: 'approveEstimate',
		method: 'POST',
		path: '/estimates/{estimate_id}/approve',
		summary: 'Approve an estimate.',
		description: 'Approve an estimate.',
		docsUrl: 'https://www.zoho.com/books/api/v3/estimates/',
		parameters: [
			{
				name: 'estimate_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the estimate. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/approve-an-estimate-response' },
			},
		],
		scopes: ['ZohoBooks.estimates.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'email_estimate',
		group: 'estimates',
		groupSlug: 'estimates',
		name: 'emailEstimate',
		method: 'POST',
		path: '/estimates/{estimate_id}/email',
		summary: 'Email an estimate',
		description:
			'Email an estimate to the customer. Input json string is not mandatory. If input json string is empty, mail will be send with default mail content.',
		docsUrl: 'https://www.zoho.com/books/api/v3/estimates/',
		parameters: [
			{
				name: 'estimate_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the estimate. Note: This value is a set of numeric characters.',
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
				name: 'attachments',
				in: 'query',
				required: false,
				description: 'Files to be attached to the email',
				schema: { type: 'string', format: 'binary' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/email-an-estimate-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/email-an-estimate-response' },
			},
		],
		scopes: ['ZohoBooks.estimates.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_estimate_email',
		group: 'estimates',
		groupSlug: 'estimates',
		name: 'getEstimateEmail',
		method: 'GET',
		path: '/estimates/{estimate_id}/email',
		summary: 'Get estimate email content',
		description: 'Get the email content of an estimate.',
		docsUrl: 'https://www.zoho.com/books/api/v3/estimates/',
		parameters: [
			{
				name: 'estimate_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the estimate. Note: This value is a set of numeric characters.',
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
				name: 'email_template_id',
				in: 'query',
				required: true,
				description:
					'Get the email content based on a specific email template. If this param is not inputted, then the content will be based on the email template associated with the customer. If no template is associated with the customer, then default template will be used. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/get-estimate-email-content-response',
				},
			},
		],
		scopes: ['ZohoBooks.estimates.READ'],
		riskLevel: 'read',
	},
	{
		id: 'email_multiple_estimates',
		group: 'estimates',
		groupSlug: 'estimates',
		name: 'emailMultipleEstimates',
		method: 'POST',
		path: '/estimates/email',
		summary: 'Email multiple estimates',
		description:
			'Send estimates to your customers by email. Maximum of 10 estimates can be sent at once.',
		docsUrl: 'https://www.zoho.com/books/api/v3/estimates/',
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
				name: 'estimate_ids',
				in: 'query',
				required: true,
				description:
					'Comma separated estimate ids which are to be emailed. Note: This value is a set of numeric characters separated by comma.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/email-multiple-estimates-response',
				},
			},
		],
		scopes: ['ZohoBooks.estimates.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'bulk_export_estimates_as_pdf',
		group: 'estimates',
		groupSlug: 'estimates',
		name: 'bulkExportEstimatesAsPdf',
		method: 'GET',
		path: '/estimates/pdf',
		summary: 'Bulk export estimates',
		description: 'Maximum of 25 estimates can be exported in a single pdf.',
		docsUrl: 'https://www.zoho.com/books/api/v3/estimates/',
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
				name: 'estimate_ids',
				in: 'query',
				required: true,
				description:
					'Comma separated estimate ids which are to be emailed. Note: This value is a set of numeric characters separated by comma.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/bulk-export-estimates-response' },
			},
			{
				status: '200',
				contentType: 'application/pdf',
				schema: { type: 'string', format: 'binary' },
			},
		],
		scopes: ['ZohoBooks.estimates.READ'],
		riskLevel: 'read',
	},
	{
		id: 'bulk_print_estimates',
		group: 'estimates',
		groupSlug: 'estimates',
		name: 'bulkPrintEstimates',
		method: 'GET',
		path: '/estimates/print',
		summary: 'Bulk print estimates',
		description:
			'Export estimates as pdf and print them. Maximum of 25 estimates can be printed.',
		docsUrl: 'https://www.zoho.com/books/api/v3/estimates/',
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
				name: 'estimate_ids',
				in: 'query',
				required: true,
				description:
					'Comma separated estimate ids which are to be emailed. Note: This value is a set of numeric characters separated by comma.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/bulk-print-estimates-response' },
			},
			{
				status: '200',
				contentType: 'application/pdf',
				schema: { type: 'string', format: 'binary' },
			},
		],
		scopes: ['ZohoBooks.estimates.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_estimate_billing_address',
		group: 'estimates',
		groupSlug: 'estimates',
		name: 'updateEstimateBillingAddress',
		method: 'PUT',
		path: '/estimates/{estimate_id}/address/billing',
		summary: 'Update billing address',
		description: 'Updates the billing address for this estimate alone.',
		docsUrl: 'https://www.zoho.com/books/api/v3/estimates/',
		parameters: [
			{
				name: 'estimate_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the estimate. Note: This value is a set of numeric characters.',
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
		scopes: ['ZohoBooks.estimates.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_estimate_shipping_address',
		group: 'estimates',
		groupSlug: 'estimates',
		name: 'updateEstimateShippingAddress',
		method: 'PUT',
		path: '/estimates/{estimate_id}/address/shipping',
		summary: 'Update shipping address',
		description: 'Updates the shipping address for an existing estimate alone.',
		docsUrl: 'https://www.zoho.com/books/api/v3/estimates/',
		parameters: [
			{
				name: 'estimate_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the estimate. Note: This value is a set of numeric characters.',
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
			schema: { $ref: '#/components/schemas/update-shipping-address-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-shipping-address-response',
				},
			},
		],
		scopes: ['ZohoBooks.estimates.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_estimate_templates',
		group: 'estimates',
		groupSlug: 'estimates',
		name: 'listEstimateTemplates',
		method: 'GET',
		path: '/estimates/templates',
		summary: 'List estimate template',
		description: 'Get all estimate pdf templates.',
		docsUrl: 'https://www.zoho.com/books/api/v3/estimates/',
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
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/list-estimate-template-response',
				},
			},
		],
		scopes: ['ZohoBooks.estimates.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_estimate_template',
		group: 'estimates',
		groupSlug: 'estimates',
		name: 'updateEstimateTemplate',
		method: 'PUT',
		path: '/estimates/{estimate_id}/templates/{template_id}',
		summary: 'Update estimate template',
		description: 'Update the pdf template associated with the estimate.',
		docsUrl: 'https://www.zoho.com/books/api/v3/estimates/',
		parameters: [
			{
				name: 'estimate_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the estimate. Note: This value is a set of numeric characters.',
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
				name: 'template_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the estimate template. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-estimate-template-response',
				},
			},
		],
		scopes: ['ZohoBooks.estimates.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_estimate_comments',
		group: 'estimates',
		groupSlug: 'estimates',
		name: 'listEstimateComments',
		method: 'GET',
		path: '/estimates/{estimate_id}/comments',
		summary: 'List estimate comments & history',
		description: 'Get the complete history and comments of an estimate.',
		docsUrl: 'https://www.zoho.com/books/api/v3/estimates/',
		parameters: [
			{
				name: 'estimate_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the estimate. Note: This value is a set of numeric characters.',
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
				schema: {
					$ref: '#/components/schemas/list-estimate-comments-and-history-response',
				},
			},
		],
		scopes: ['ZohoBooks.estimates.READ'],
		riskLevel: 'read',
	},
	{
		id: 'create_estimate_comment',
		group: 'estimates',
		groupSlug: 'estimates',
		name: 'createEstimateComment',
		method: 'POST',
		path: '/estimates/{estimate_id}/comments',
		summary: 'Add Comments',
		description: 'Add a comment for an estimate.',
		docsUrl: 'https://www.zoho.com/books/api/v3/estimates/',
		parameters: [
			{
				name: 'estimate_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the estimate. Note: This value is a set of numeric characters.',
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
			schema: { $ref: '#/components/schemas/add-comments-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/add-comments-response' },
			},
		],
		scopes: ['ZohoBooks.estimates.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_estimate_comment',
		group: 'estimates',
		groupSlug: 'estimates',
		name: 'updateEstimateComment',
		method: 'PUT',
		path: '/estimates/{estimate_id}/comments/{comment_id}',
		summary: 'Update comment',
		description: 'Update an existing comment of an estimate.',
		docsUrl: 'https://www.zoho.com/books/api/v3/estimates/',
		parameters: [
			{
				name: 'estimate_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the estimate. Note: This value is a set of numeric characters.',
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
				name: 'comment_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the comment. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/update-comment-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-comment-response' },
			},
		],
		scopes: ['ZohoBooks.estimates.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_estimate_comment',
		group: 'estimates',
		groupSlug: 'estimates',
		name: 'deleteEstimateComment',
		method: 'DELETE',
		path: '/estimates/{estimate_id}/comments/{comment_id}',
		summary: 'Delete a comment',
		description: 'Delete an estimate comment.',
		docsUrl: 'https://www.zoho.com/books/api/v3/estimates/',
		parameters: [
			{
				name: 'estimate_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the estimate. Note: This value is a set of numeric characters.',
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
				name: 'comment_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the comment. Note: This value is a set of numeric characters.',
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
		scopes: ['ZohoBooks.estimates.DELETE'],
		riskLevel: 'destructive',
	},
] as const satisfies readonly ZohoBooksOperationDefinition[];
