import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas = {
	'add-attachment-to-a-sales-order-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'add-comment-request': {
		type: 'object',
		properties: {
			description: {
				description: 'The description of the comment.',
				type: 'string',
			},
		},
	},
	'add-comment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			comment: { $ref: '#/components/schemas/comment' },
		},
	},
	address: { description: 'Address', type: 'string' },
	adjustment: {
		description:
			'Manual modification amount applied to the sales order total for rounding corrections, special pricing arrangements, or other business-specific adjustments. Supports positive and negative values for additions or deductions from the order total.',
		type: 'number',
		format: 'double',
	},
	adjustment_description: {
		description:
			'Textual explanation for the adjustment amount applied to the sales order. Provides audit trail documentation, justification for pricing modifications, and contextual information for financial reporting and compliance verification purposes.',
		type: 'string',
	},
	'approve-a-sales-order-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	attachment_name: { type: 'string' },
	attention: {
		type: 'string',
		description: 'Attention name or department for the shipping address.',
	},
	avatax_exempt_no: {
		description: 'Exemption certificate number of the customer.',
		type: 'string',
		'x-node_available_in': ['Avalara Integration'],
		'x-node_unavailable_in': [],
	},
	avatax_tax_code_desc: {
		description: 'Description of the Ava Tax Code Used',
		type: 'string',
		'x-node_available_in': ['Avalara Integration'],
		'x-node_unavailable_in': [],
	},
	avatax_tax_code_id: {
		description:
			'ID of the Ava Tax Code Used. Note: This value is a set of numeric characters.',
		type: 'string',
		'x-node_available_in': ['Avalara Integration'],
		'x-node_unavailable_in': [],
	},
	avatax_use_code: {
		description:
			'Used to group like customers for exemption purposes. It is a custom value that links customers to a tax rule.',
		type: 'string',
		'x-node_available_in': ['Avalara Integration'],
		'x-node_unavailable_in': [],
	},
	avatax_use_code_desc: {
		description: 'Description of the Avalra Use Code Used.',
		type: 'string',
		'x-node_available_in': ['Avalara Integration'],
		'x-node_unavailable_in': [],
	},
	avatax_use_code_id: {
		description:
			'ID of Avalara Tax Code Used. Note: This value is a set of numeric characters.',
		type: 'string',
		'x-node_available_in': ['Avalara Integration'],
		'x-node_unavailable_in': [],
	},
	bcc_mail_ids: {
		description: 'Array of email address of the recipients to be BCC ed.',
		type: 'array',
		items: { type: 'string' },
	},
	bcc_mails: { type: 'array', items: { type: 'string' } },
	bcc_mails_str: { type: 'string' },
	bcy_rate: {
		description: 'Rate of the line item in Base Currency',
		type: 'number',
		format: 'double',
	},
	bcy_total: {
		description: 'Total of Sales Order in Base Currency.',
		type: 'number',
		format: 'double',
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
	billing_address_id: {
		description:
			'Unique identifier referencing the customer billing address entity. Determines the address used for invoice generation, payment processing, tax jurisdiction calculations, and financial record-keeping. Must correspond to a valid address record associated with the specified customer account. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	body: { description: 'Body of the mail.', type: 'string' },
	'bulk-export-sales-orders-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'bulk-print-sales-orders-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	can_send_in_mail: {
		description: 'Can the file be sent in mail.',
		type: 'boolean',
	},
	cc_mail_ids: {
		description: 'Array of email address of the recipients to be CC ed.',
		type: 'array',
		items: { type: 'string' },
	},
	cc_mails_list: { type: 'array', items: { type: 'string' } },
	cc_mails_str: { type: 'string' },
	city: { description: 'City of the address', type: 'string' },
	comment: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				salesorder_id: { $ref: '#/components/schemas/salesorder_id' },
				comment_id: { $ref: '#/components/schemas/comment_id' },
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
	comment_id: {
		type: 'string',
		description:
			'Unique identifier for the comment associated with the sales order. Note: This value is a set of numeric characters.',
	},
	comment_type: { description: 'Type of the Comment', type: 'string' },
	commented_by: {
		description: 'The name of User who caused the comment.',
		type: 'string',
	},
	commented_by_id: {
		description:
			'The ID of customer who caused the commented. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	communication_preference: {
		description:
			'Preferred modes of communication for the contact person at transaction level.',
		type: 'object',
		properties: {
			is_email_enabled: { $ref: '#/components/schemas/is_email_enabled' },
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
	},
	contact_person_name: {
		description: 'Name of the Contact Person',
		type: 'string',
	},
	contact_persons_associated: {
		description: 'Contact Persons associated with the transaction.',
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
		description: 'Contact Persons associated with the transaction.',
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
	country: { description: 'Country of the Address', type: 'string' },
	'create-a-sales-order-request': {
		required: ['customer_id'],
		type: 'object',
		properties: {
			customer_id: { $ref: '#/components/schemas/customer_id' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			contact_persons_associated: {
				$ref: '#/components/schemas/contact_persons_associated_payload',
			},
			date: { $ref: '#/components/schemas/date' },
			shipment_date: { $ref: '#/components/schemas/shipment_date' },
			custom_fields: {
				description: 'Custom fields for a sales order.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						customfield_id: { $ref: '#/components/schemas/customfield_id' },
						value: { $ref: '#/components/schemas/value' },
					},
				},
			},
			tags: { $ref: '#/components/schemas/tags' },
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			salesperson_id: { $ref: '#/components/schemas/salesperson_id' },
			merchant_id: { $ref: '#/components/schemas/merchant_id' },
			gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
			gst_no: { $ref: '#/components/schemas/gst_no' },
			shipping_gst_no: { $ref: '#/components/schemas/shipping_gst_no' },
			shipping_trader_name: {
				$ref: '#/components/schemas/shipping_trader_name',
			},
			shipping_legal_name: { $ref: '#/components/schemas/shipping_legal_name' },
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			location_id: { $ref: '#/components/schemas/location_id' },
			line_items: {
				description: 'Line items of a sales order.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						item_order: { $ref: '#/components/schemas/item_order' },
						item_id: { $ref: '#/components/schemas/item_id' },
						rate: { $ref: '#/components/schemas/rate' },
						name: { $ref: '#/components/schemas/name' },
						description: { $ref: '#/components/schemas/description' },
						quantity: { $ref: '#/components/schemas/quantity' },
						product_type: { $ref: '#/components/schemas/product_type' },
						hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
						sat_item_key_code: {
							$ref: '#/components/schemas/sat_item_key_code',
						},
						unitkey_code: { $ref: '#/components/schemas/unitkey_code' },
						location_id: { $ref: '#/components/schemas/location_id' },
						discount: { $ref: '#/components/schemas/discount' },
						tax_id: { $ref: '#/components/schemas/tax_id' },
						product_tax_category: {
							$ref: '#/components/schemas/product_tax_category',
						},
						tds_tax_id: { $ref: '#/components/schemas/tds_tax_id' },
						tags: { $ref: '#/components/schemas/tags' },
						unit: { $ref: '#/components/schemas/unit' },
						item_custom_fields: {
							description: 'Custom fields for a sales order items.',
							type: 'array',
							items: {
								type: 'object',
								properties: {
									customfield_id: {
										$ref: '#/components/schemas/customfield_id',
									},
									value: { $ref: '#/components/schemas/value' },
								},
							},
						},
						tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
						tax_exemption_code: {
							$ref: '#/components/schemas/tax_exemption_code',
						},
						tax_treatment_code: {
							$ref: '#/components/schemas/tax_treatment_code',
						},
						avatax_exempt_no: { $ref: '#/components/schemas/avatax_exempt_no' },
						avatax_use_code: { $ref: '#/components/schemas/avatax_use_code' },
						project_id: { $ref: '#/components/schemas/project_id' },
						line_item_category: {
							$ref: '#/components/schemas/line_item_category',
						},
					},
				},
			},
			notes: { $ref: '#/components/schemas/notes' },
			terms: { $ref: '#/components/schemas/terms' },
			billing_address_id: { $ref: '#/components/schemas/billing_address_id' },
			shipping_address_id: { $ref: '#/components/schemas/shipping_address_id' },
			crm_owner_id: { $ref: '#/components/schemas/crm_owner_id' },
			crm_custom_reference_id: {
				$ref: '#/components/schemas/crm_custom_reference_id',
			},
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			is_reverse_charge_applied: {
				$ref: '#/components/schemas/is_reverse_charge_applied',
			},
			salesorder_number: { $ref: '#/components/schemas/salesorder_number' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			is_update_customer: { $ref: '#/components/schemas/is_update_customer' },
			discount: { $ref: '#/components/schemas/discount' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			salesperson_name: { $ref: '#/components/schemas/salesperson_name' },
			notes_default: { $ref: '#/components/schemas/notes_default' },
			terms_default: { $ref: '#/components/schemas/terms_default' },
			tax_id: {
				description:
					'Tax ID for the Sales Order. Note: This value is a set of numeric characters.',
				type: 'string',
			},
			tax_authority_id: { $ref: '#/components/schemas/tax_authority_id' },
			tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
			tax_authority_name: { $ref: '#/components/schemas/tax_authority_name' },
			tax_exemption_code: { $ref: '#/components/schemas/tax_exemption_code' },
			avatax_exempt_no: { $ref: '#/components/schemas/avatax_exempt_no' },
			avatax_use_code: { $ref: '#/components/schemas/avatax_use_code' },
			shipping_charge: { $ref: '#/components/schemas/shipping_charge' },
			adjustment: { $ref: '#/components/schemas/adjustment' },
			delivery_method: { $ref: '#/components/schemas/delivery_method' },
			estimate_id: {
				description:
					'ID of the estimate associated with the Sales Order. Note: This value is a set of numeric characters.',
				type: 'string',
			},
			is_discount_before_tax: {
				$ref: '#/components/schemas/is_discount_before_tax',
			},
			discount_type: { $ref: '#/components/schemas/discount_type' },
			adjustment_description: {
				$ref: '#/components/schemas/adjustment_description',
			},
			pricebook_id: { $ref: '#/components/schemas/pricebook_id' },
			template_id: { $ref: '#/components/schemas/template_id' },
			documents: { $ref: '#/components/schemas/documents' },
			zcrm_potential_id: { $ref: '#/components/schemas/zcrm_potential_id' },
			zcrm_potential_name: { $ref: '#/components/schemas/zcrm_potential_name' },
		},
	},
	'create-a-sales-order-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			salesorder: { $ref: '#/components/schemas/salesorder' },
		},
	},
	created_by_id: {
		type: 'string',
		description:
			'Unique identifier for the user who created the sales order. Note: This value is a set of numeric characters.',
	},
	created_time: {
		description: 'Creation Time of the Sales Order',
		type: 'string',
	},
	crm_custom_reference_id: {
		type: 'string',
		description:
			'Custom reference identifier for CRM integration purposes. Note: This value is a set of numeric characters.',
	},
	crm_owner_id: {
		type: 'string',
		description:
			'Unique identifier for the CRM owner associated with the sales order. Note: This value is a set of numeric characters.',
	},
	currency_code: {
		description: 'Code of the Currency involved in the Sales Order',
		type: 'string',
	},
	currency_id: {
		description:
			'Unique identifier for the currency used in the sales order transaction. Determines pricing display, exchange rate calculations, and affects financial reporting. If not specified, the organization default currency will be used automatically. Can be fetched from the Get Currencies API or retrieved from your organization currency settings. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	currency_symbol: { type: 'string' },
	custom_fields: {
		description: 'Custom fields for a sales order.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				customfield_id: { $ref: '#/components/schemas/customfield_id' },
				index: { $ref: '#/components/schemas/index' },
				value: { $ref: '#/components/schemas/value' },
				label: { $ref: '#/components/schemas/label' },
			},
		},
	},
	customer_id: {
		description:
			'Unique identifier for the customer receiving the sales order. This ID links the order to a specific customer account and determines billing information, payment terms, pricing rules, and tax calculations based on customer settings. Can be fetched from the Get Contacts API or retrieved from existing customer records in your organization. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	customer_name: {
		description: 'Name of the customer associated with the Sales Order',
		type: 'string',
	},
	customfield_id: {
		description:
			'ID of the Custom Field. Note: This value is a set of numeric characters.',
		type: 'string',
		format: 'int64',
	},
	data: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				bcc_mails: { $ref: '#/components/schemas/bcc_mails' },
				body: { $ref: '#/components/schemas/body' },
				error_list: { $ref: '#/components/schemas/error_list' },
				bcc_mails_str: { $ref: '#/components/schemas/bcc_mails_str' },
				documents: { $ref: '#/components/schemas/documents' },
				subject: { $ref: '#/components/schemas/subject' },
				customer_name: { $ref: '#/components/schemas/customer_name' },
				entity_id: { $ref: '#/components/schemas/entity_id' },
				cc_mails_list: { $ref: '#/components/schemas/cc_mails_list' },
				file_name: { $ref: '#/components/schemas/file_name' },
				from_emails: { $ref: '#/components/schemas/from_emails' },
				file_name_without_extension: {
					$ref: '#/components/schemas/file_name_without_extension',
				},
				to_mails_str: { $ref: '#/components/schemas/to_mails_str' },
				cc_mails_str: { $ref: '#/components/schemas/cc_mails_str' },
				from_email: { $ref: '#/components/schemas/from_email' },
				from_address: { $ref: '#/components/schemas/from_address' },
				emailtemplates: { $ref: '#/components/schemas/emailtemplates' },
				to_contacts: { $ref: '#/components/schemas/to_contacts' },
				attachment_name: { $ref: '#/components/schemas/attachment_name' },
				emailtemplate_documents: {
					$ref: '#/components/schemas/emailtemplate_documents',
				},
				customer_id: { $ref: '#/components/schemas/customer_id' },
			},
		},
	},
	date: {
		description:
			'Date when the sales order was created in YYYY-MM-DD format. This date affects order processing timelines, delivery schedules, payment terms calculation, and appears on customer-facing documents and internal reports.',
		type: 'string',
	},
	date_description: { description: 'Description of the Date', type: 'string' },
	'delete-a-comment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-a-sales-order-response': {
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
	delivery_method: {
		description:
			'Specification of the transportation and delivery mechanism for order fulfillment. Determines shipping costs, delivery timelines, carrier selection, and customer communication regarding order status and tracking information.',
		type: 'string',
	},
	delivery_method_id: {
		type: 'string',
		description:
			'Unique identifier for the delivery method. Note: This value is a set of numeric characters.',
	},
	description: { description: 'Description of the line item.', type: 'string' },
	discount: {
		description:
			'Discount applied to the sales order, which can be either a percentage or a flat amount. For percentage discounts, the value should include the % symbol (e.g., 10%). For sample, on Rs.1000, a 10% discount results in Rs.900, while a flat Rs.200 discount results in Rs.800.',
		type: 'string',
	},
	discount_amount: { type: 'number', format: 'double' },
	discount_applied_on_amount: { type: 'integer' },
	discount_type: {
		description:
			'Classification of discount application scope within the sales order. <code>entity_level</code> applies discount to the entire order total, while <code>item_level</code> applies discount to individual line items. Determines discount calculation methodology and affects pricing structure.',
		type: 'string',
	},
	documents: {
		type: 'array',
		description: 'Documents attached to the sales order.',
		items: { type: 'string' },
	},
	email: { type: 'string' },
	'email-a-sales-order-request': {
		required: ['to_mail_ids', 'subject', 'body'],
		type: 'object',
		properties: {
			from_address_id: { $ref: '#/components/schemas/from_address_id' },
			send_from_org_email_id: {
				$ref: '#/components/schemas/send_from_org_email_id',
			},
			to_mail_ids: { $ref: '#/components/schemas/to_mail_ids' },
			cc_mail_ids: { $ref: '#/components/schemas/cc_mail_ids' },
			bcc_mail_ids: { $ref: '#/components/schemas/bcc_mail_ids' },
			subject: { $ref: '#/components/schemas/subject' },
			documents: {
				description: 'Documents of the Sales Order',
				type: 'string',
				format: 'binary',
			},
			invoice_id: { $ref: '#/components/schemas/invoice_id' },
			body: { $ref: '#/components/schemas/body' },
		},
	},
	'email-a-sales-order-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	email_template_id: {
		description:
			'Get the email content based on a specific email template. If this param is not inputted, then the content will be based on the email template associated with the customer. If no template is associated with the customer, then default template will be used. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	emailtemplate_documents: { type: 'array', items: { type: 'string' } },
	emailtemplates: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				selected: { $ref: '#/components/schemas/selected' },
				name: { $ref: '#/components/schemas/name' },
				email_template_id: { $ref: '#/components/schemas/email_template_id' },
			},
		},
	},
	entity_id: {
		type: 'string',
		description:
			'Unique identifier for the entity associated with the sales order. Note: This value is a set of numeric characters.',
	},
	error_list: { type: 'array', items: { type: 'string' } },
	estimate_id: {
		description:
			'Unique identifier linking this sales order to its originating estimate document. Establishes audit trail continuity, enables estimate-to-order conversion tracking, and maintains historical reference for customer approval workflows and business process documentation. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	exchange_rate: {
		description:
			'Currency conversion rate from the transaction currency to the organization base currency. Required for multi-currency transactions to ensure accurate financial reporting, profit calculations, and tax computations in the base currency denomination.',
		type: 'number',
		format: 'double',
	},
	fax: { description: 'Fax Number', type: 'string' },
	file_name: { description: 'Name of the file.', type: 'string' },
	file_name_without_extension: { type: 'string' },
	first_name: {
		description: 'First Name of the Contact Person.',
		type: 'string',
	},
	from_address: { type: 'string' },
	from_address_id: {
		description: 'From Address of the Email Address',
		type: 'string',
	},
	from_email: { type: 'string' },
	from_emails: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				organization_contact_id: {
					$ref: '#/components/schemas/organization_contact_id',
				},
				user_name: { $ref: '#/components/schemas/user_name' },
				selected: { $ref: '#/components/schemas/selected' },
				email: { $ref: '#/components/schemas/email' },
				is_org_email_id: { $ref: '#/components/schemas/is_org_email_id' },
			},
		},
	},
	'get-a-sales-order-attachment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-a-sales-order-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			salesorder: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						customer_id: { $ref: '#/components/schemas/customer_id' },
						billing_address_id: {
							$ref: '#/components/schemas/billing_address_id',
						},
						shipping_address_id: {
							$ref: '#/components/schemas/shipping_address_id',
						},
						is_pre_gst: { $ref: '#/components/schemas/is_pre_gst' },
						gst_no: { $ref: '#/components/schemas/gst_no' },
						shipping_gst_no: { $ref: '#/components/schemas/shipping_gst_no' },
						shipping_trader_name: {
							$ref: '#/components/schemas/shipping_trader_name',
						},
						shipping_legal_name: {
							$ref: '#/components/schemas/shipping_legal_name',
						},
						gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
						place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
						crm_owner_id: { $ref: '#/components/schemas/crm_owner_id' },
						crm_custom_reference_id: {
							$ref: '#/components/schemas/crm_custom_reference_id',
						},
						zcrm_potential_id: {
							$ref: '#/components/schemas/zcrm_potential_id',
						},
						vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
						tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
						is_reverse_charge_applied: {
							$ref: '#/components/schemas/is_reverse_charge_applied',
						},
						is_update_customer: {
							$ref: '#/components/schemas/is_update_customer',
						},
						contact_persons_associated: {
							$ref: '#/components/schemas/contact_persons_associated',
						},
						salesorder_number: {
							$ref: '#/components/schemas/salesorder_number',
						},
						reference_number: { $ref: '#/components/schemas/reference_number' },
						template_id: { $ref: '#/components/schemas/template_id' },
						date: { description: 'Date of the comment', type: 'string' },
						documents: { $ref: '#/components/schemas/documents' },
						shipment_date: { $ref: '#/components/schemas/shipment_date' },
						exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
						discount: { $ref: '#/components/schemas/discount' },
						is_discount_before_tax: {
							$ref: '#/components/schemas/is_discount_before_tax',
						},
						discount_type: { $ref: '#/components/schemas/discount_type' },
						salesperson_id: { $ref: '#/components/schemas/salesperson_id' },
						salesperson_name: { $ref: '#/components/schemas/salesperson_name' },
						merchant_id: { $ref: '#/components/schemas/merchant_id' },
						merchant_name: { $ref: '#/components/schemas/merchant_name' },
						estimate_id: { $ref: '#/components/schemas/estimate_id' },
						tax_id: { $ref: '#/components/schemas/tax_id' },
						tax_authority_id: { $ref: '#/components/schemas/tax_authority_id' },
						tax_authority_name: {
							$ref: '#/components/schemas/tax_authority_name',
						},
						tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
						tax_exemption_code: {
							$ref: '#/components/schemas/tax_exemption_code',
						},
						avatax_exempt_no: { $ref: '#/components/schemas/avatax_exempt_no' },
						avatax_use_code: { $ref: '#/components/schemas/avatax_use_code' },
						is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
						sub_statuses: { $ref: '#/components/schemas/sub_statuses' },
						custom_fields: { $ref: '#/components/schemas/custom_fields' },
						location_id: { $ref: '#/components/schemas/location_id' },
						location_name: { $ref: '#/components/schemas/location_name' },
						line_items: {
							description: 'Details of the line items in the Sales Order',
							type: 'array',
							items: {
								type: 'object',
								properties: {
									line_item_id: {
										description:
											'ID of the line item. Note: This value is a set of numeric characters.',
										type: 'string',
									},
									sku: { $ref: '#/components/schemas/sku' },
									bcy_rate: { $ref: '#/components/schemas/bcy_rate' },
									tax_name: { $ref: '#/components/schemas/tax_name' },
									tax_type: { $ref: '#/components/schemas/tax_type' },
									tax_percentage: {
										$ref: '#/components/schemas/tax_percentage',
									},
									tax_id: { $ref: '#/components/schemas/tax_id' },
									tds_tax_id: { $ref: '#/components/schemas/tds_tax_id' },
									tax_treatment_code: {
										$ref: '#/components/schemas/tax_treatment_code',
									},
									is_taxable: {
										description: 'Check if the Sales Order is taxable.',
										type: 'boolean',
										'x-node_available_in': ['us'],
										'x-node_unavailable_in': [],
									},
									product_exemption_id: {
										$ref: '#/components/schemas/product_exemption_id',
									},
									product_exemption_code: {
										$ref: '#/components/schemas/product_exemption_code',
									},
									avatax_use_code_id: {
										$ref: '#/components/schemas/avatax_use_code_id',
									},
									avatax_use_code_desc: {
										$ref: '#/components/schemas/avatax_use_code_desc',
									},
									avatax_tax_code_id: {
										$ref: '#/components/schemas/avatax_tax_code_id',
									},
									avatax_tax_code_desc: {
										$ref: '#/components/schemas/avatax_tax_code_desc',
									},
									item_total_inclusive_of_tax: {
										$ref: '#/components/schemas/item_total_inclusive_of_tax',
									},
									product_type: { $ref: '#/components/schemas/product_type' },
									hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
									sat_item_key_code: {
										$ref: '#/components/schemas/sat_item_key_code',
									},
									unitkey_code: { $ref: '#/components/schemas/unitkey_code' },
									is_invoiced: { $ref: '#/components/schemas/is_invoiced' },
									stock_on_hand: { $ref: '#/components/schemas/stock_on_hand' },
									image_id: { $ref: '#/components/schemas/image_id' },
									image_name: { $ref: '#/components/schemas/image_name' },
									image_type: { $ref: '#/components/schemas/image_type' },
									project_id: { $ref: '#/components/schemas/project_id' },
									project_name: { $ref: '#/components/schemas/project_name' },
									location_id: { $ref: '#/components/schemas/location_id' },
									location_name: { $ref: '#/components/schemas/location_name' },
									tags: { $ref: '#/components/schemas/tags_response' },
									line_item_category: {
										$ref: '#/components/schemas/line_item_category',
									},
								},
							},
						},
						pricebook_id: { $ref: '#/components/schemas/pricebook_id' },
						shipping_charge: { $ref: '#/components/schemas/shipping_charge' },
						adjustment: { $ref: '#/components/schemas/adjustment' },
						adjustment_description: {
							$ref: '#/components/schemas/adjustment_description',
						},
						delivery_method: { $ref: '#/components/schemas/delivery_method' },
						notes: { $ref: '#/components/schemas/notes' },
						notes_default: { $ref: '#/components/schemas/notes_default' },
						terms: { $ref: '#/components/schemas/terms' },
						terms_default: { $ref: '#/components/schemas/terms_default' },
						tags: { $ref: '#/components/schemas/tags_response' },
					},
				},
			},
		},
	},
	'get-sales-order-email-content-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			data: { $ref: '#/components/schemas/data' },
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
	has_attachment: {
		description: 'Check if the Sales Order has attachment.',
		type: 'boolean',
	},
	hsn_or_sac: {
		description: 'Add HSN/SAC code for your goods/services',
		type: 'string',
		'x-node_available_in': ['in', 'za', 'ke'],
		'x-node_unavailable_in': [],
	},
	image_id: {
		description:
			'ID of the Image of the Item. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	image_name: { description: 'Name of the Image of the Item.', type: 'string' },
	image_type: { description: 'Type of the image of the item', type: 'string' },
	index: {
		type: 'integer',
		description: 'Position index of the custom field in the sales order.',
	},
	invoice_id: {
		description:
			'ID of the invoice. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	is_discount_before_tax: {
		description:
			'Boolean flag determining the sequence of discount application in tax calculations. When true, discount is applied before tax computation; when false, discount is applied after tax calculation. Affects final pricing accuracy and tax compliance reporting.',
		type: 'boolean',
	},
	is_email_enabled: {
		description:
			'Used to check if Email communication preference is enabled for the contact person at transaction level.',
		type: 'boolean',
	},
	is_emailed: {
		description: 'Check if the Sales Order is emailed to the customer',
		type: 'boolean',
	},
	is_inclusive_tax: {
		description:
			'Used to specify whether the line item rates are inclusive or exclusive of tax.',
		type: 'boolean',
		'x-node_available_in': [],
		'x-node_unavailable_in': ['us', 'ca'],
	},
	is_invoiced: { description: 'Check if it is Invoiced', type: 'boolean' },
	is_one_off_address: {
		type: 'boolean',
		description:
			'Indicates whether the address is a one-time address not saved to the customer record.',
	},
	is_org_email_id: { type: 'boolean' },
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
	is_tag_mandatory: {
		description: 'Used to check if the tag is mandatory',
		type: 'boolean',
	},
	is_update_customer: {
		description:
			'Boolean flag indicating whether customer billing address information should be synchronized with the sales order data. When enabled, updates the customer master record with address modifications, ensuring data consistency across customer relationship management systems.',
		type: 'boolean',
	},
	is_verified: {
		description: 'Check if the Address is verified',
		type: 'boolean',
		'x-node_available_in': ['Avalara Integration'],
		'x-node_unavailable_in': [],
	},
	is_whatsapp_enabled: {
		description:
			'Used to check if WhatsApp communication preference is enabled for the contact person at transaction level.',
		type: 'boolean',
		'x-node_available_in': ['WhatsApp integration'],
	},
	item_custom_fields: {
		description: 'Custom fields for a sales order items.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				customfield_id: { $ref: '#/components/schemas/customfield_id' },
				index: { $ref: '#/components/schemas/index' },
				value: { $ref: '#/components/schemas/value' },
				label: { $ref: '#/components/schemas/label' },
			},
		},
	},
	item_id: {
		description:
			'ID of the item. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	item_order: {
		type: 'integer',
		description: 'Order of the line item in the sales order.',
	},
	item_total_inclusive_of_tax: {
		description: 'Total of the Line Item, inclusive of tax.',
		type: 'number',
		format: 'double',
	},
	label: { type: 'string', description: 'Display label of the custom field.' },
	last_modified_time: {
		description: 'Last Modified time of the Sales Order',
		type: 'string',
	},
	last_name: {
		description: 'Last name of the Contact Person.',
		type: 'string',
	},
	line_item_category: {
		description:
			'Category of the line item. Allowed values are <code>line_item</code>, <code>header</code> and <code>subtotal</code>. Use <code>line_item</code> for regular line items, <code>header</code> for header titles and <code>subtotal</code> for intermediate subtotal rows. For regular line items, you can send line_item or omit this field',
		type: 'string',
	},
	line_item_id: {
		description:
			'ID of the line item. Mandatory if the existing line item has to be updated. If empty, a new line item will be created. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	line_items: {
		description: 'Line items of a sales order.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				item_order: { $ref: '#/components/schemas/item_order' },
				item_id: { $ref: '#/components/schemas/item_id' },
				rate: { $ref: '#/components/schemas/rate' },
				name: { $ref: '#/components/schemas/name' },
				description: { $ref: '#/components/schemas/description' },
				quantity: { $ref: '#/components/schemas/quantity' },
				product_type: { $ref: '#/components/schemas/product_type' },
				hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
				sat_item_key_code: { $ref: '#/components/schemas/sat_item_key_code' },
				unitkey_code: { $ref: '#/components/schemas/unitkey_code' },
				location_id: { $ref: '#/components/schemas/location_id' },
				location_name: { $ref: '#/components/schemas/location_name' },
				discount: { $ref: '#/components/schemas/discount' },
				tax_id: { $ref: '#/components/schemas/tax_id' },
				tds_tax_id: { $ref: '#/components/schemas/tds_tax_id' },
				tags: { $ref: '#/components/schemas/tags' },
				unit: { $ref: '#/components/schemas/unit' },
				item_custom_fields: { $ref: '#/components/schemas/item_custom_fields' },
				tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
				tax_exemption_code: { $ref: '#/components/schemas/tax_exemption_code' },
				tax_treatment_code: { $ref: '#/components/schemas/tax_treatment_code' },
				avatax_exempt_no: { $ref: '#/components/schemas/avatax_exempt_no' },
				avatax_use_code: { $ref: '#/components/schemas/avatax_use_code' },
				project_id: { $ref: '#/components/schemas/project_id' },
				line_item_category: { $ref: '#/components/schemas/line_item_category' },
			},
		},
	},
	'list-sales-order-comments-and-history-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			comments: {},
		},
	},
	'list-sales-order-templates-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			templates: { $ref: '#/components/schemas/templates' },
		},
	},
	'list-sales-orders-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			salesorders: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						salesorder_id: { $ref: '#/components/schemas/salesorder_id' },
						zcrm_potential_id: {
							$ref: '#/components/schemas/zcrm_potential_id',
						},
						zcrm_potential_name: {
							$ref: '#/components/schemas/zcrm_potential_name',
						},
						customer_name: { $ref: '#/components/schemas/customer_name' },
						customer_id: { $ref: '#/components/schemas/customer_id' },
						status: { $ref: '#/components/schemas/status' },
						salesorder_number: {
							$ref: '#/components/schemas/salesorder_number',
						},
						reference_number: { $ref: '#/components/schemas/reference_number' },
						date: { $ref: '#/components/schemas/date' },
						shipment_date: { $ref: '#/components/schemas/shipment_date' },
						shipment_days: { $ref: '#/components/schemas/shipment_days' },
						currency_id: { $ref: '#/components/schemas/currency_id' },
						currency_code: { $ref: '#/components/schemas/currency_code' },
						total: { $ref: '#/components/schemas/total' },
						sub_total: { $ref: '#/components/schemas/sub_total' },
						bcy_total: { $ref: '#/components/schemas/bcy_total' },
						created_time: { $ref: '#/components/schemas/created_time' },
						last_modified_time: {
							$ref: '#/components/schemas/last_modified_time',
						},
						is_emailed: { $ref: '#/components/schemas/is_emailed' },
						has_attachment: { $ref: '#/components/schemas/has_attachment' },
						custom_fields: { $ref: '#/components/schemas/custom_fields' },
					},
				},
			},
		},
	},
	location_id: {
		description:
			'Unique identifier for the business location entity. Specifies the organizational location where the sales order transaction is processed, affecting tax jurisdiction calculations, inventory allocation, reporting segmentation, and location-specific business rules enforcement. Can be retrieved from the Locations API. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	location_name: { description: 'Name of the location.', type: 'string' },
	'mark-a-sales-order-as-open-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'mark-a-sales-order-as-void-request': {
		type: 'object',
		properties: { reason: { $ref: '#/components/schemas/reason' } },
	},
	'mark-a-sales-order-as-void-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	merchant_id: {
		description:
			'ID of the merchant. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	merchant_name: { description: 'Name of the merchant', type: 'string' },
	mobile: {
		description: 'Mobile Number of the Contact Person.',
		type: 'string',
	},
	name: { description: 'Name of the line item.', type: 'string' },
	notes: {
		description:
			'Free-form text field containing additional information, instructions, or comments related to the sales order. This field supports internal documentation, customer-specific requirements, special handling instructions, and inter-departmental communication for order processing workflows.',
		type: 'string',
	},
	notes_default: {
		description: 'Default Notes for the Sales Order',
		type: 'string',
	},
	operation_type: {
		description: 'Type of Operation that caused the comment',
		type: 'string',
	},
	organization_contact_id: {
		type: 'string',
		description:
			'Unique identifier for the organization contact associated with the sales order. Note: This value is a set of numeric characters.',
	},
	orientation: { type: 'string' },
	page_height: { type: 'string' },
	page_width: { type: 'string' },
	phone: { description: 'Phone Number of the Contact Person.', type: 'string' },
	place_of_supply: {
		description:
			'Place where the goods/services are supplied to. (If not given, <code>place of contact</code> given for the contact will be taken)<br/>Supported codes for UAE emirates are : </br>Abu Dhabi - <code>AB</code>,</br>Ajman - <code>AJ</code>,</br>Dubai - <code>DU</code>,</br>Fujairah - <code>FU</code>,</br>Ras al-Khaimah - <code>RA</code>,</br>Sharjah - <code>SH</code>,</br>Umm al-Quwain - <code>UM</code><br/>Supported codes for the GCC countries are : </br>United Arab Emirates - <code>AE</code>,</br>Saudi Arabia - <code>SA</code>,</br>Bahrain - <code>BH</code>,</br>Kuwait - <code>KW</code>,</br>Oman - <code>OM</code>,</br>Qatar - <code>QA</code>.',
		type: 'string',
		'x-node_available_in': ['in', 'gcc'],
		'x-node_unavailable_in': [],
	},
	price_precision: { type: 'integer' },
	pricebook_id: {
		description:
			'Unique identifier for the pricing structure applied to the sales order. Determines item rates, discount rules, and pricing policies based on customer segments, volume tiers, or promotional campaigns. Can be retrieved from the Pricebooks API. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	product_exemption_code: {
		description: 'Code of the Exemption of the line item in the Sales Order',
		type: 'string',
		'x-node_available_in': ['us'],
		'x-node_unavailable_in': [],
	},
	product_exemption_id: {
		description:
			'ID of the Exemption of the line item in the Sales Order. Note: This value is a set of numeric characters.',
		type: 'string',
		'x-node_available_in': ['us'],
		'x-node_unavailable_in': [],
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
			'Enter <code>goods</code> or <code>services</code> .<br/><b>For SouthAfrica Edition:</b> <code>service</code>, <code>goods</code>, <code>capital_service</code> and <code>capital_goods</code>',
		type: 'string',
	},
	project_id: {
		description:
			'ID of the project. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	project_name: { description: 'Name of the project.', type: 'string' },
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
	reason: {
		description:
			'Reason to convert sales order as void . <code>Maximum Length: 500 </code>',
		type: 'string',
	},
	reference_number: {
		description:
			'External reference identifier for cross-referencing with customer purchase orders, internal tracking systems, or third-party applications. Used for order reconciliation, customer communication, and integration with external business systems and workflows.',
		type: 'string',
	},
	salesorder: {
		type: 'array',
		items: { $ref: '#/components/schemas/salesorder-response' },
	},
	'salesorder-response': {
		type: 'object',
		properties: {
			salesorder_id: { $ref: '#/components/schemas/salesorder_id' },
			documents: { $ref: '#/components/schemas/documents' },
			is_pre_gst: { $ref: '#/components/schemas/is_pre_gst' },
			gst_no: { $ref: '#/components/schemas/gst_no' },
			shipping_gst_no: { $ref: '#/components/schemas/shipping_gst_no' },
			shipping_trader_name: {
				$ref: '#/components/schemas/shipping_trader_name',
			},
			shipping_legal_name: { $ref: '#/components/schemas/shipping_legal_name' },
			gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			zcrm_potential_id: { $ref: '#/components/schemas/zcrm_potential_id' },
			zcrm_potential_name: { $ref: '#/components/schemas/zcrm_potential_name' },
			salesorder_number: { $ref: '#/components/schemas/salesorder_number' },
			date: { $ref: '#/components/schemas/date' },
			status: { $ref: '#/components/schemas/status' },
			shipment_date: { $ref: '#/components/schemas/shipment_date' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			customer_id: { $ref: '#/components/schemas/customer_id' },
			customer_name: { $ref: '#/components/schemas/customer_name' },
			contact_persons_associated: {
				$ref: '#/components/schemas/contact_persons_associated',
			},
			currency_id: { $ref: '#/components/schemas/currency_id' },
			currency_code: { $ref: '#/components/schemas/currency_code' },
			currency_symbol: { $ref: '#/components/schemas/currency_symbol' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			discount_amount: { $ref: '#/components/schemas/discount_amount' },
			discount: { $ref: '#/components/schemas/discount' },
			discount_applied_on_amount: {
				$ref: '#/components/schemas/discount_applied_on_amount',
			},
			is_discount_before_tax: {
				$ref: '#/components/schemas/is_discount_before_tax',
			},
			discount_type: { $ref: '#/components/schemas/discount_type' },
			estimate_id: { $ref: '#/components/schemas/estimate_id' },
			delivery_method: { $ref: '#/components/schemas/delivery_method' },
			delivery_method_id: { $ref: '#/components/schemas/delivery_method_id' },
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			location_id: { $ref: '#/components/schemas/location_id' },
			location_name: { $ref: '#/components/schemas/location_name' },
			line_items: { $ref: '#/components/schemas/line_items' },
			shipping_charge: { $ref: '#/components/schemas/shipping_charge' },
			adjustment: { $ref: '#/components/schemas/adjustment' },
			adjustment_description: {
				$ref: '#/components/schemas/adjustment_description',
			},
			sub_total: { $ref: '#/components/schemas/sub_total' },
			tax_total: { $ref: '#/components/schemas/tax_total' },
			total: { $ref: '#/components/schemas/total' },
			taxes: { $ref: '#/components/schemas/taxes' },
			price_precision: { $ref: '#/components/schemas/price_precision' },
			is_emailed: { $ref: '#/components/schemas/is_emailed' },
			billing_address: { $ref: '#/components/schemas/billing_address' },
			shipping_address: { $ref: '#/components/schemas/shipping_address' },
			notes: { $ref: '#/components/schemas/notes' },
			terms: { $ref: '#/components/schemas/terms' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			tags: { $ref: '#/components/schemas/tags_response' },
			template_id: { $ref: '#/components/schemas/template_id' },
			template_name: { $ref: '#/components/schemas/template_name' },
			page_width: { $ref: '#/components/schemas/page_width' },
			page_height: { $ref: '#/components/schemas/page_height' },
			orientation: { $ref: '#/components/schemas/orientation' },
			template_type: { $ref: '#/components/schemas/template_type' },
			created_time: { $ref: '#/components/schemas/created_time' },
			last_modified_time: { $ref: '#/components/schemas/last_modified_time' },
			created_by_id: { $ref: '#/components/schemas/created_by_id' },
			attachment_name: { $ref: '#/components/schemas/attachment_name' },
			can_send_in_mail: { $ref: '#/components/schemas/can_send_in_mail' },
			salesperson_id: { $ref: '#/components/schemas/salesperson_id' },
			salesperson_name: { $ref: '#/components/schemas/salesperson_name' },
			merchant_id: { $ref: '#/components/schemas/merchant_id' },
			merchant_name: { $ref: '#/components/schemas/merchant_name' },
		},
	},
	salesorder_id: {
		description:
			'ID of the Sales Order. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	salesorder_number: {
		description:
			'Unique alphanumeric identifier for the sales order entity. Required when automatic numbering is disabled in organization settings. Must be unique within the organization and follows the configured numbering sequence pattern for sales order identification and tracking.',
		type: 'string',
	},
	salesperson_id: {
		description:
			'Unique identifier for the salesperson responsible for this sales order. Links the order to a specific sales representative customer relationship management, and sales reporting purposes. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	salesperson_name: {
		description:
			'Full name of the sales representative assigned to this sales order. Automatically populated when salesperson_id is specified.',
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
	selected: { type: 'boolean' },
	send_from_org_email_id: {
		description:
			"Boolean to trigger the email from the organization's email address.",
		type: 'boolean',
	},
	shipment_date: {
		description:
			'Expected or actual date when goods will be shipped to the customer in YYYY-MM-DD format. Used for delivery planning, customer communication, inventory management, and tracking order fulfillment timelines.',
		type: 'string',
	},
	shipment_days: {
		description: 'Days of Shipment for the Order',
		type: 'integer',
	},
	shipping_address: {
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
	shipping_address_id: {
		description:
			'Unique identifier referencing the customer shipping address entity. Specifies the delivery destination for goods fulfillment, logistics planning, shipping cost calculations, and delivery confirmation processes. Must correspond to a valid address record within the customer address registry. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	shipping_charge: {
		description:
			'Additional cost associated with product delivery and logistics services. Applied to the sales order total and affects final pricing calculations, profit margins, and customer billing. Supports decimal precision for accurate cost allocation.',
		type: 'number',
		format: 'double',
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
	sku: { description: 'SKU of the product', type: 'string' },
	state: { description: 'State of the Address', type: 'string' },
	status: { description: 'Status of the Sales Order', type: 'string' },
	stock_on_hand: { description: 'Stock on hand for the Item.', type: 'string' },
	street2: { type: 'string' },
	sub_statuses: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				status_id: {
					type: 'string',
					description:
						'Unique identifier for the sales order status. Note: This value is a set of numeric characters.',
				},
				status_code: { type: 'string' },
				parent_status: { $ref: '#/components/schemas/status' },
				description: { type: 'string' },
				display_name: { type: 'string' },
				label_name: { type: 'string' },
				color_code: { type: 'string' },
			},
		},
	},
	sub_total: {
		description: 'Sub Total of the Sales Order',
		type: 'number',
		format: 'double',
	},
	subject: { description: 'Subject of the mail.', type: 'string' },
	'submit-a-sales-order-for-approval-response': {
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
	tax_amount: { type: 'number', format: 'double' },
	tax_authority_id: {
		description:
			'ID of the tax authority. Tax authority depends on the location of the customer. Note: This value is a set of numeric characters.',
		type: 'string',
		'x-node_available_in': ['us'],
		'x-node_unavailable_in': [],
	},
	tax_authority_name: {
		description: "Tax Authority's name.",
		type: 'string',
		'x-node_available_in': ['us', 'mx'],
		'x-node_unavailable_in': [],
	},
	tax_exemption_code: {
		description: 'Code of Tax Exemption that is applied',
		type: 'string',
		'x-node_available_in': ['in', 'us', 'mx'],
		'x-node_unavailable_in': [],
	},
	tax_exemption_id: {
		description:
			'ID of the tax exemption applied. Note: This value is a set of numeric characters.',
		type: 'string',
		'x-node_available_in': ['in', 'us'],
		'x-node_unavailable_in': [],
	},
	tax_id: {
		description:
			'ID of the tax or tax group applied. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	tax_name: { type: 'string' },
	tax_percentage: {
		description: 'Tax Percentage of the tax that is applied',
		type: 'number',
		format: 'double',
	},
	tax_total: { type: 'number', format: 'double' },
	tax_treatment: {
		description:
			'VAT treatment for the sales order.Allowed Values: <code>vat_registered</code>,<code>vat_not_registered</code>,<code>gcc_vat_not_registered</code>,<code>gcc_vat_registered</code>,<code>non_gcc</code>.</br><code>dz_vat_registered</code> and <code>dz_vat_not_registered</code> supported only for <b>UAE</b>.</b></br><code>home_country_mexico</code>,<code>border_region_mexico</code>,<code>non_mexico</code> supported only for <b>MX</b>. <br/><b>For Kenya Edition:</b> <code>vat_registered</code> ,<code>vat_not_registered</code> ,<code>non_kenya</code>(A business that is located outside Kenya).<br/><b>For SouthAfrica Edition:</b> <code>vat_registered</code>, <code>vat_not_registered</code>, <code>overseas</code>(A business that is located outside SouthAfrica).',
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
	tax_type: { description: 'Type of the tax that is applied', type: 'string' },
	taxes: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				tax_id: { $ref: '#/components/schemas/tax_id' },
				tax_name: { $ref: '#/components/schemas/tax_name' },
				tax_amount: { $ref: '#/components/schemas/tax_amount' },
			},
		},
	},
	tds_tax_id: {
		description:
			'ID of the TDS tax or TDS tax group applied. Note: This value is a set of numeric characters.',
		type: 'string',
		'x-node_available_in': ['mx'],
		'x-node_unavailable_in': [],
	},
	template_id: {
		description:
			'Unique identifier for the PDF document template used for sales order presentation. Determines document layout, branding elements, formatting specifications, and visual presentation standards for customer-facing documents and printed materials. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	template_name: { description: 'Name of the template', type: 'string' },
	template_type: { description: 'Type of the template', type: 'string' },
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
	terms: {
		description:
			'Contractual terms and conditions governing the sales order transaction. Defines payment obligations, delivery specifications, warranty provisions, liability limitations, and other legal stipulations that establish the binding agreement between the organization and customer for this specific transaction.',
		type: 'string',
	},
	terms_default: {
		description: 'Default Terms of the Sales Order',
		type: 'string',
	},
	time: { description: 'Time of the Comment', type: 'string' },
	to_contacts: {
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
				contact_person_id: { $ref: '#/components/schemas/contact_person_id' },
				mobile: { $ref: '#/components/schemas/mobile' },
			},
		},
	},
	to_mail_ids: {
		description: 'Array of email address of the recipients.',
		type: 'array',
		items: { type: 'string' },
	},
	to_mails_str: { type: 'string' },
	total: {
		description: 'Total of the Sales Order',
		type: 'number',
		format: 'double',
	},
	transaction_id: {
		description:
			'ID of the transaction that caused the comment. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	transaction_type: {
		description: 'Type of Transaction that caused the comment.',
		type: 'string',
	},
	unit: { description: 'Unit of the line item e.g. kgs, Nos.', type: 'string' },
	unitkey_code: {
		description:
			'Add SAT Unit Key Code for your goods/services. Download the <a href= http://omawww.sat.gob.mx/tramitesyservicios/Paginas/documentos/catCFDI_V_4_07122022.xls  >CFDI Catalogs.</a>',
		type: 'string',
		'x-node_available_in': ['mx'],
		'x-node_unavailable_in': [],
	},
	'update-a-sales-order-request': {
		required: ['customer_id'],
		type: 'object',
		properties: {
			customer_id: { $ref: '#/components/schemas/customer_id' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			contact_persons_associated: {
				$ref: '#/components/schemas/contact_persons_associated_payload',
			},
			date: { $ref: '#/components/schemas/date' },
			shipment_date: { $ref: '#/components/schemas/shipment_date' },
			custom_fields: {
				description: 'Custom fields for a sales order.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						customfield_id: { $ref: '#/components/schemas/customfield_id' },
						value: { $ref: '#/components/schemas/value' },
					},
				},
			},
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			salesperson_id: { $ref: '#/components/schemas/salesperson_id' },
			merchant_id: { $ref: '#/components/schemas/merchant_id' },
			gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
			gst_no: { $ref: '#/components/schemas/gst_no' },
			shipping_gst_no: { $ref: '#/components/schemas/shipping_gst_no' },
			shipping_trader_name: {
				$ref: '#/components/schemas/shipping_trader_name',
			},
			shipping_legal_name: { $ref: '#/components/schemas/shipping_legal_name' },
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			location_id: { $ref: '#/components/schemas/location_id' },
			line_items: {
				description: 'Line items of a sales order.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						item_order: { $ref: '#/components/schemas/item_order' },
						line_item_id: { $ref: '#/components/schemas/line_item_id' },
						item_id: { $ref: '#/components/schemas/item_id' },
						rate: { $ref: '#/components/schemas/rate' },
						name: { $ref: '#/components/schemas/name' },
						description: { $ref: '#/components/schemas/description' },
						quantity: { $ref: '#/components/schemas/quantity' },
						discount: { $ref: '#/components/schemas/discount' },
						tax_id: {
							description:
								'Tax ID for the Sales Order. Note: This value is a set of numeric characters.',
							type: 'string',
						},
						product_tax_category: {
							$ref: '#/components/schemas/product_tax_category',
						},
						tds_tax_id: { $ref: '#/components/schemas/tds_tax_id' },
						tags: { $ref: '#/components/schemas/tags' },
						unit: { $ref: '#/components/schemas/unit' },
						item_custom_fields: {
							description: 'Custom fields for a sales order items.',
							type: 'array',
							items: {
								type: 'object',
								properties: {
									customfield_id: {
										$ref: '#/components/schemas/customfield_id',
									},
									value: { $ref: '#/components/schemas/value' },
								},
							},
						},
						tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
						tax_exemption_code: {
							$ref: '#/components/schemas/tax_exemption_code',
						},
						tax_treatment_code: {
							$ref: '#/components/schemas/tax_treatment_code',
						},
						avatax_exempt_no: { $ref: '#/components/schemas/avatax_exempt_no' },
						avatax_use_code: { $ref: '#/components/schemas/avatax_use_code' },
						project_id: { $ref: '#/components/schemas/project_id' },
						location_id: { $ref: '#/components/schemas/location_id' },
						line_item_category: {
							$ref: '#/components/schemas/line_item_category',
						},
					},
				},
			},
			notes: { $ref: '#/components/schemas/notes' },
			terms: { $ref: '#/components/schemas/terms' },
			billing_address_id: { $ref: '#/components/schemas/billing_address_id' },
			shipping_address_id: { $ref: '#/components/schemas/shipping_address_id' },
			crm_owner_id: { $ref: '#/components/schemas/crm_owner_id' },
			crm_custom_reference_id: {
				$ref: '#/components/schemas/crm_custom_reference_id',
			},
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			is_reverse_charge_applied: {
				$ref: '#/components/schemas/is_reverse_charge_applied',
			},
			salesorder_number: { $ref: '#/components/schemas/salesorder_number' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			is_update_customer: { $ref: '#/components/schemas/is_update_customer' },
			discount: { $ref: '#/components/schemas/discount' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			salesperson_name: { $ref: '#/components/schemas/salesperson_name' },
			notes_default: { $ref: '#/components/schemas/notes_default' },
			terms_default: { $ref: '#/components/schemas/terms_default' },
			tax_id: {
				description:
					'Tax ID for the Sales Order. Note: This value is a set of numeric characters.',
				type: 'string',
			},
			tax_authority_id: { $ref: '#/components/schemas/tax_authority_id' },
			tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
			tax_authority_name: { $ref: '#/components/schemas/tax_authority_name' },
			tax_exemption_code: { $ref: '#/components/schemas/tax_exemption_code' },
			avatax_exempt_no: { $ref: '#/components/schemas/avatax_exempt_no' },
			avatax_use_code: { $ref: '#/components/schemas/avatax_use_code' },
			shipping_charge: { $ref: '#/components/schemas/shipping_charge' },
			adjustment: { $ref: '#/components/schemas/adjustment' },
			delivery_method: { $ref: '#/components/schemas/delivery_method' },
			is_discount_before_tax: {
				$ref: '#/components/schemas/is_discount_before_tax',
			},
			discount_type: { $ref: '#/components/schemas/discount_type' },
			adjustment_description: {
				$ref: '#/components/schemas/adjustment_description',
			},
			pricebook_id: { $ref: '#/components/schemas/pricebook_id' },
			template_id: { $ref: '#/components/schemas/template_id' },
			documents: { $ref: '#/components/schemas/documents' },
			zcrm_potential_id: { $ref: '#/components/schemas/zcrm_potential_id' },
			zcrm_potential_name: { $ref: '#/components/schemas/zcrm_potential_name' },
			tags: { $ref: '#/components/schemas/tags' },
		},
	},
	'update-a-sales-order-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			salesorder: { $ref: '#/components/schemas/salesorder' },
		},
	},
	'update-a-salesorder-customfield-request': {
		description: 'Update the custom fields of a sales order.',
		type: 'object',
		properties: {
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
		},
	},
	'update-an-salesorder-customfield-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'update-attachment-preference-response': {
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
			phone: { $ref: '#/components/schemas/phone' },
			fax: { $ref: '#/components/schemas/fax' },
			attention: { $ref: '#/components/schemas/attention' },
			is_one_off_address: { $ref: '#/components/schemas/is_one_off_address' },
			is_update_customer: { $ref: '#/components/schemas/is_update_customer' },
			is_verified: { $ref: '#/components/schemas/is_verified' },
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
				description: 'The description of the comment.',
				type: 'string',
			},
		},
	},
	'update-comment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			comment: { $ref: '#/components/schemas/comment' },
		},
	},
	'update-sales-order-template-response': {
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
			attention: { $ref: '#/components/schemas/attention' },
			is_one_off_address: { $ref: '#/components/schemas/is_one_off_address' },
			is_update_customer: { $ref: '#/components/schemas/is_update_customer' },
			is_verified: { $ref: '#/components/schemas/is_verified' },
		},
	},
	'update-shipping-address-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	user_name: { type: 'string' },
	value: { description: 'Value of the Custom Field', type: 'string' },
	vat_treatment: {
		description:
			'(Optional) VAT treatment for the sales order. VAT treatment denotes the location of the customer, if the customer resides in UK then the VAT treatment is <code>uk</code>. If the customer is in an EU country & VAT registered, you are resides in Northen Ireland and purchasing Goods then his VAT treatment is <code>eu_vat_registered</code> and if he resides outside the UK then his VAT treatment is <code>overseas</code>(For Pre Brexit, this can be split as <code>eu_vat_registered</code>, <code>eu_vat_not_registered</code> and <code>non_eu</code>).',
		type: 'string',
		'x-node_available_in': ['uk'],
		'x-node_unavailable_in': [],
	},
	zcrm_potential_id: {
		description:
			'Unique identifier linking the sales order to a Zoho CRM potential record. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	zcrm_potential_name: {
		description:
			'Descriptive name of the Zoho CRM potential record associated with this sales order.',
		type: 'string',
	},
	zip: { description: 'ZIP Code of the Address', type: 'string' },
} as const satisfies Record<string, JsonValue>;

export const operations = [
	{
		id: 'create_sales_order',
		group: 'salesOrder',
		groupSlug: 'sales-order',
		name: 'createSalesOrder',
		method: 'POST',
		path: '/salesorders',
		summary: 'Create a sales order',
		description: 'Create a sales order for your customer.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-order/',
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
				name: 'ignore_auto_number_generation',
				in: 'query',
				required: false,
				description:
					'Ignore auto sales order number generation for this sales order. This mandates the sales order number.',
				schema: { type: 'boolean' },
			},
			{
				name: 'can_send_in_mail',
				in: 'query',
				required: false,
				description: 'Can the file be sent in mail.',
				schema: { type: 'boolean' },
			},
			{
				name: 'totalFiles',
				in: 'query',
				required: false,
				description: 'Total number of files.',
				schema: { type: 'integer' },
			},
			{
				name: 'doc',
				in: 'query',
				required: false,
				description: 'Document that is to be attached',
				schema: { type: 'string', format: 'binary' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/create-a-sales-order-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/create-a-sales-order-response' },
			},
		],
		scopes: ['ZohoBooks.salesorders.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_sales_orders',
		group: 'salesOrder',
		groupSlug: 'sales-order',
		name: 'listSalesOrders',
		method: 'GET',
		path: '/salesorders',
		summary: 'List sales orders',
		description: 'List all sales orders.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-order/',
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
				name: 'sort_column',
				in: 'query',
				required: false,
				description:
					'Specify the column field for sorting sales order results. Available options include <code>customer_name</code>, <code>salesorder_number</code>, <code>shipment_date</code>, <code>last_modified_time</code>, <code>reference_number</code>, <code>total</code>, <code>date</code>, and <code>created_time</code>.',
				schema: {
					type: 'string',
					enum: [
						'customer_name',
						'salesorder_number',
						'reference_number',
						'shipment_date',
						'total',
						'date',
						'created_time',
						'last_modified_time',
						'subscription_number',
						'first_name',
						'company_name',
						'cf_(\\w+)',
					],
				},
			},
			{
				name: 'search_text',
				in: 'query',
				required: false,
				description:
					'General search parameter for cross-field text matching across sales order number, reference number, and customer name fields. Enables unified search functionality for quick order identification and customer order lookup operations.',
				schema: { type: 'string' },
			},
			{
				name: 'filter_by',
				in: 'query',
				required: false,
				description:
					'Filter sales order by status. Allowed Values: <code>Status.All</code>, <code>Status.Open</code>, <code>Status.Draft</code>, <code>Status.OverDue</code>, <code>Status.PartiallyInvoiced</code>, <code>Status.Invoiced</code>, <code>Status.Void</code> and <code>Status.Closed</code>',
				schema: {
					type: 'string',
					enum: [
						'Status.All',
						'Status.Draft',
						'Status.Open',
						'Status.Invoiced',
						'Status.InvoicedNotShipped',
						'Status.Confirmed',
						'Status.UnFulfilled',
						'Status.MarketPlaceSalesOrder',
						'Status.ThisCycle',
						'Status.PreviousCycle',
						'Status.PartiallyInvoiced',
						'Status.Void',
						'Status.Closed',
						'Status.Pending',
						'Status.Approved',
						'Status.OverDue',
						'Status.Shipped',
						'Status.ShippedNotInvoiced',
						'Status.ToBeShipped',
						'Status.ToBeInvoiced',
						'Status.Fulfilled',
						'Status.ManuallyFulfilled',
						'Status.BackOrdered',
						'Status.OnHold',
						'Status.DropShipped',
						'Status.ToBePacked',
						'Status.AvalaraSyncFailed',
						'Status.TaxAutomationFailed',
						'Status.Network',
						'Status.NetworkPending',
						'Status.MyApprovals',
						'Status.Unconfirmed',
						'Status.Portal',
						'Status.Cancelled',
						'Status.NotConfirmed',
						'Status.PendingOrders',
						'Status.ShippedNotCancelledOrFailed',
						'Status.Delivered',
						'Status.CancelledOrFailed',
						'Status.Viewed',
						'Status.BBPSPendingApproval',
						'Status.BBPSAccepted',
						'Status.BBPSAcceptFailed',
						'Status.BBPSRejected',
						'Status.BBPSRejectFailed',
						'Status.BBPSReturned',
						'Status.BBPSReturnFailed',
						'WithAttachment',
						'WithoutAttachment',
						'ExceptionList',
					],
				},
			},
			{
				name: 'salesorder_number',
				in: 'query',
				required: false,
				description:
					'Filter sales orders by sales order number using various matching operators. Available variants include <code>salesorder_number_startswith</code>, <code>salesorder_number_not_in</code>, <code>salesorder_number_in</code>, and <code>salesorder_number_contains</code>. Maximum search length: 100 characters.',
				schema: { type: 'string' },
			},
			{
				name: 'item_name',
				in: 'query',
				required: false,
				description:
					'Search sales orders by item name. Filters sales orders based on product or service names in sales order line items. Supports <code>item_name_startswith</code> and <code>item_name_contains</code> variants. Maximum length is 100 characters. Useful for finding sales orders with specific products or services.',
				schema: { type: 'string' },
			},
			{
				name: 'item_id',
				in: 'query',
				required: false,
				description:
					'Filter sales orders by specific line item identifier. Retrieves all sales orders containing a particular product or service item based on its unique identifier for inventory tracking and item-based reporting purposes. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'item_description',
				in: 'query',
				required: false,
				description:
					'Search sales orders by item description. Filters sales orders based on detailed descriptions of products or services in line items. Supports <code>item_description_startswith</code> and <code>item_description_contains</code> variants. Maximum length is 100 characters. Useful for finding sales orders with specific item descriptions or technical specifications.',
				schema: { type: 'string' },
			},
			{
				name: 'reference_number',
				in: 'query',
				required: false,
				description:
					'Filter sales orders by external reference number using various matching operators. Available variants include <code>reference_number_startswith</code>, <code>reference_number_not_in</code>, <code>reference_number_in</code>, and <code>reference_number_contains</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'customer_name',
				in: 'query',
				required: false,
				description:
					'Filter sales orders by customer name using various matching operators. Available variants include <code>customer_name_startswith</code>, <code>customer_name_not_in</code>, <code>customer_name_in</code>, and <code>customer_name_contains</code>. Maximum search length: 100 characters.',
				schema: { type: 'string' },
			},
			{
				name: 'email',
				in: 'query',
				required: false,
				description:
					'Search sales orders by customer email address. Filters sales orders based on the email address of the customer or contact person. Maximum length is 100 characters. Useful for finding sales orders for specific customers or generating customer segment reports.',
				schema: { type: 'string' },
			},
			{
				name: 'total',
				in: 'query',
				required: false,
				description:
					'Search sales orders by total amount. Filters sales orders based on the final sales order amount including taxes, discounts, and adjustments. Useful for finding sales orders within specific price ranges or identifying high-value transactions.',
				schema: { type: 'string' },
			},
			{
				name: 'date',
				in: 'query',
				required: false,
				description:
					'Search sales orders by sales order date. Filters sales orders based on the date they were created. Use yyyy-mm-dd format. Supports variants: <code>date_start</code>, <code>date_end</code>, <code>date_before</code> and <code>date_after</code>. Useful for finding sales orders within date ranges or specific time periods.',
				schema: { type: 'string' },
			},
			{
				name: 'created_date',
				in: 'query',
				required: false,
				description:
					'Search sales orders by creation date. Filters sales orders based on the date they were created. Use yyyy-mm-dd format. Supports variants: <code>created_date_start</code>, <code>created_date_end</code>. Useful for finding sales orders created within specific time periods or date ranges.',
				schema: { type: 'string' },
			},
			{
				name: 'shipment_date',
				in: 'query',
				required: false,
				description:
					'Search sales order by sales order shipment date. Variants: <code>shipment_date_start</code>, <code>shipment_date_end</code>, <code>shipment_date_before</code> and <code>shipment_date_after</code>. Default date format : <code>yyyy-mm-dd</code>',
				schema: { type: 'string' },
			},
			{
				name: 'expiry_date_start',
				in: 'query',
				required: false,
				description:
					'Filter sales orders by sales order shipment date on or after the specified date. Useful for defining the start of a date range. Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'expiry_date_end',
				in: 'query',
				required: false,
				description:
					'Filter sales orders by sales order shipment date on or before the specified date. Useful for defining the end of a date range. Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'expiry_date_before',
				in: 'query',
				required: false,
				description:
					'Filter sales orders by sales order shipment date strictly before the specified date (exclusive). Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'expiry_date_after',
				in: 'query',
				required: false,
				description:
					'Filter sales orders by sales order shipment date strictly after the specified date (exclusive). Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'status',
				in: 'query',
				required: false,
				description:
					'Search sales order by sales order status. Allowed Values: <code>draft</code>, <code>open</code>, <code>invoiced</code>, <code>partially_invoiced</code>, <code>void</code> and <code>overdue</code>.',
				schema: {
					type: 'string',
					enum: [
						'draft',
						'pending_approval',
						'approved',
						'open',
						'invoiced',
						'invoiced_not_shipped',
						'shipped_not_invoiced',
						'partially_invoiced',
						'not_invoiced',
						'to_be_invoiced',
						'paid',
						'partially_paid',
						'unpaid',
						'cancelled',
						'void',
						'pending',
						'overdue',
						'closed',
						'confirmed',
						'onhold',
						'network_pending_approval',
						'rejected',
					],
				},
			},
			{
				name: 'customer_id',
				in: 'query',
				required: false,
				description:
					'Filter sales orders by specific customer identifier. Retrieves all sales orders associated with a particular customer account for customer relationship management, order history tracking, and customer-specific reporting and analysis purposes. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'salesperson_id',
				in: 'query',
				required: false,
				description:
					'Filter sales orders by specific sales representative identifier. Retrieves all sales orders assigned to a particular salesperson for performance tracking, commission calculations, sales territory management, and individual sales reporting purposes. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'salesorder_ids',
				in: 'query',
				required: false,
				description:
					"ID's of the salesorder [Comma seperated values] . <code>Maximum Length : 200</code>. Note: This value is a set of numeric characters separated by comma.",
				schema: { type: 'string' },
			},
			{
				name: 'zcrm_potential_id',
				in: 'query',
				required: false,
				description:
					'Unique identifier of the potential in CRM. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'last_modified_time',
				in: 'query',
				required: false,
				description: 'Last Modified time of the Sales Order',
				schema: { type: 'string' },
			},
			{
				name: 'accept',
				in: 'query',
				required: false,
				description:
					'Get the details of a particular sales order in formats such as json/ pdf/ html. Default format is json. Allowed Values: <code>json</code>, <code>csv</code> , <code>xml</code>, <code>xls</code>, <code>xlsx</code>, <code>pdf</code>, <code>jhtml</code> and <code>html</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'print',
				in: 'query',
				required: false,
				description:
					'Print the exported pdf. <code> It will be used when accept = pdf and atleast one value in salesorder_ids  </code>',
				schema: { type: 'boolean' },
			},
			{
				name: 'customview_id',
				in: 'query',
				required: false,
				description:
					'ID of the customview. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'location_ids',
				in: 'query',
				required: false,
				description:
					'List of location IDs to filter sales orders by their associated locations. Use this parameter to retrieve sales orders linked to specific business locations. Note: This value is a comma-separated list of numeric location IDs.',
				schema: { type: 'string' },
			},
			{
				name: 'page',
				in: 'query',
				required: false,
				description:
					'Specify the page number for paginated results retrieval. Controls which subset of sales order records to return, enabling efficient data handling for large result sets. Default value is 1 for the first page.',
				schema: { type: 'integer', default: 1 },
			},
			{
				name: 'per_page',
				in: 'query',
				required: false,
				description:
					'Specify the maximum number of sales order records to return per page. Controls result set size for optimal performance, memory usage, and user experience.',
				schema: { type: 'integer', default: 10 },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/list-sales-orders-response' },
			},
		],
		scopes: ['ZohoBooks.salesorders.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_sales_order_using_custom_field',
		group: 'salesOrder',
		groupSlug: 'sales-order',
		name: 'updateSalesOrderUsingCustomField',
		method: 'PUT',
		path: '/salesorders',
		summary: "Update a sales order using a custom field's unique value",
		description:
			"A custom field will have unique values if it's configured to not accept duplicate values. Now, you can use that custom field's value to update a sales order by providing its API name in the X-Unique-Identifier-Key header and its value in the X-Unique-Identifier-Value header. Based on this value, the corresponding sales order will be retrieved and updated. Additionally, there is an optional X-Upsert header. If the X-Upsert header is true and the custom field's unique value is not found in any of the existing sales orders, a new sales order will be created if the necessary payload details are available",
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-order/',
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
			schema: { $ref: '#/components/schemas/update-a-sales-order-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-a-sales-order-response' },
			},
		],
		scopes: ['ZohoBooks.salesorders.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_sales_order',
		group: 'salesOrder',
		groupSlug: 'sales-order',
		name: 'updateSalesOrder',
		method: 'PUT',
		path: '/salesorders/{salesorder_id}',
		summary: 'Update a sales order',
		description:
			'Update an existing sales order. To delete a line item just remove it from the line_items list.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-order/',
		parameters: [
			{
				name: 'salesorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the sales order. Note: This value is a set of numeric characters.',
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
					'Ignore auto sales order number generation for this sales order. This mandates the sales order number.',
				schema: { type: 'boolean' },
			},
			{
				name: 'can_send_in_mail',
				in: 'query',
				required: false,
				description: 'Can the file be sent in mail.',
				schema: { type: 'boolean' },
			},
			{
				name: 'totalFiles',
				in: 'query',
				required: false,
				description: 'Total number of files.',
				schema: { type: 'integer' },
			},
			{
				name: 'doc',
				in: 'query',
				required: false,
				description: 'Document that is to be attached',
				schema: { type: 'string', format: 'binary' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/update-a-sales-order-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-a-sales-order-response' },
			},
		],
		scopes: ['ZohoBooks.salesorders.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_sales_order',
		group: 'salesOrder',
		groupSlug: 'sales-order',
		name: 'getSalesOrder',
		method: 'GET',
		path: '/salesorders/{salesorder_id}',
		summary: 'Get a sales order',
		description: 'Get the details of a sales order.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-order/',
		parameters: [
			{
				name: 'salesorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the sales order. Note: This value is a set of numeric characters.',
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
					'Get the details of a particular sales order in formats such as json/ pdf/ html. Default format is json. Allowed Values: <code>json</code>, <code>csv</code> , <code>xml</code>, <code>xls</code>, <code>xlsx</code>, <code>pdf</code>, <code>jhtml</code> and <code>html</code>.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/get-a-sales-order-response' },
			},
		],
		scopes: ['ZohoBooks.salesorders.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_sales_order',
		group: 'salesOrder',
		groupSlug: 'sales-order',
		name: 'deleteSalesOrder',
		method: 'DELETE',
		path: '/salesorders/{salesorder_id}',
		summary: 'Delete a sales order',
		description:
			'Delete an existing sales order. Invoiced sales order cannot be deleted.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-order/',
		parameters: [
			{
				name: 'salesorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the sales order. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/delete-a-sales-order-response' },
			},
		],
		scopes: ['ZohoBooks.salesorders.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'update_salesorder_customfields',
		group: 'salesOrder',
		groupSlug: 'sales-order',
		name: 'updateSalesorderCustomfields',
		method: 'PUT',
		path: '/salesorder/{salesorder_id}/customfields',
		summary: 'Update custom field in existing salesorders',
		description:
			'Update the value of the custom field in existing salesorders.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-order/',
		parameters: [
			{
				name: 'salesorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the sales order. Note: This value is a set of numeric characters.',
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
				$ref: '#/components/schemas/update-a-salesorder-customfield-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-an-salesorder-customfield-response',
				},
			},
		],
		scopes: ['ZohoBooks.salesorders.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_sales_order_as_open',
		group: 'salesOrder',
		groupSlug: 'sales-order',
		name: 'markSalesOrderAsOpen',
		method: 'POST',
		path: '/salesorders/{salesorder_id}/status/open',
		summary: 'Mark a sales order as open',
		description: 'Mark a draft sales order as open.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-order/',
		parameters: [
			{
				name: 'salesorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the sales order. Note: This value is a set of numeric characters.',
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
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/mark-a-sales-order-as-open-response',
				},
			},
		],
		scopes: ['ZohoBooks.salesorders.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_sales_order_as_void',
		group: 'salesOrder',
		groupSlug: 'sales-order',
		name: 'markSalesOrderAsVoid',
		method: 'POST',
		path: '/salesorders/{salesorder_id}/status/void',
		summary: 'Mark a sales order as void',
		description: 'Mark a sales order as void.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-order/',
		parameters: [
			{
				name: 'salesorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the sales order. Note: This value is a set of numeric characters.',
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
				$ref: '#/components/schemas/mark-a-sales-order-as-void-request',
			},
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/mark-a-sales-order-as-void-response',
				},
			},
		],
		scopes: ['ZohoBooks.salesorders.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'update_sales_order_sub_status',
		group: 'salesOrder',
		groupSlug: 'sales-order',
		name: 'updateSalesOrderSubStatus',
		method: 'POST',
		path: '/salesorders/{salesorder_id}/substatus/{status_code}',
		summary: 'Update a sales order sub status',
		description: 'Update a sales order sub status.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-order/',
		parameters: [
			{
				name: 'salesorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the sales order. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'status_code',
				in: 'path',
				required: true,
				description: 'Unique code of the status of a sales order.',
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
					type: 'object',
					properties: {
						code: { type: 'integer', readOnly: true },
						message: { type: 'string', readOnly: true },
					},
				},
			},
		],
		scopes: ['ZohoBooks.salesorders.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'email_sales_order',
		group: 'salesOrder',
		groupSlug: 'sales-order',
		name: 'emailSalesOrder',
		method: 'POST',
		path: '/salesorders/{salesorder_id}/email',
		summary: 'Email a sales order',
		description:
			'Email a sales order to the customer. Input json string is not mandatory. If input json string is empty, mail will be send with default mail content.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-order/',
		parameters: [
			{
				name: 'salesorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the sales order. Note: This value is a set of numeric characters.',
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
				name: 'salesorder_id',
				in: 'query',
				required: false,
				description:
					'ID of the Sales Order. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'attachments',
				in: 'query',
				required: false,
				description: 'Attachments of the Sales Order',
				schema: { type: 'string', format: 'binary' },
			},
			{
				name: 'send_attachment',
				in: 'query',
				required: false,
				description: 'Send the sales order attachment a with the email.',
				schema: { type: 'boolean' },
			},
			{
				name: 'file_name',
				in: 'query',
				required: false,
				description: 'Name of the file.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/email-a-sales-order-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/email-a-sales-order-response' },
			},
		],
		scopes: ['ZohoBooks.salesorders.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_sales_order_email',
		group: 'salesOrder',
		groupSlug: 'sales-order',
		name: 'getSalesOrderEmail',
		method: 'GET',
		path: '/salesorders/{salesorder_id}/email',
		summary: 'Get sales order email content',
		description: 'Get the email content of a sales order.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-order/',
		parameters: [
			{
				name: 'salesorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the sales order. Note: This value is a set of numeric characters.',
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
				required: false,
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
					$ref: '#/components/schemas/get-sales-order-email-content-response',
				},
			},
		],
		scopes: ['ZohoBooks.salesorders.READ'],
		riskLevel: 'read',
	},
	{
		id: 'submit_sales_order',
		group: 'salesOrder',
		groupSlug: 'sales-order',
		name: 'submitSalesOrder',
		method: 'POST',
		path: '/salesorders/{salesorder_id}/submit',
		summary: 'Submit a sales order for approval',
		description: 'Submit a sales order for approval.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-order/',
		parameters: [
			{
				name: 'salesorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the sales order. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/submit-a-sales-order-for-approval-response',
				},
			},
		],
		scopes: ['ZohoBooks.salesorders.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'approve_sales_order',
		group: 'salesOrder',
		groupSlug: 'sales-order',
		name: 'approveSalesOrder',
		method: 'POST',
		path: '/salesorders/{salesorder_id}/approve',
		summary: 'Approve a sales order.',
		description: 'Approve a sales order.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-order/',
		parameters: [
			{
				name: 'salesorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the sales order. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/approve-a-sales-order-response' },
			},
		],
		scopes: ['ZohoBooks.salesorders.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'bulk_export_sales_orders_as_pdf',
		group: 'salesOrder',
		groupSlug: 'sales-order',
		name: 'bulkExportSalesOrdersAsPdf',
		method: 'GET',
		path: '/salesorders/pdf',
		summary: 'Bulk export sales orders',
		description: 'Maximum of 25 sales orders can be exported in a single pdf.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-order/',
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
				name: 'salesorder_ids',
				in: 'query',
				required: true,
				description:
					'Comma-separated sales order IDs to export as one PDF. Required by the API, though the Zoho OpenAPI leaves it out.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/bulk-export-sales-orders-response',
				},
			},
			{
				status: '200',
				contentType: 'application/pdf',
				schema: { type: 'string', format: 'binary' },
			},
		],
		scopes: ['ZohoBooks.salesorders.READ'],
		riskLevel: 'read',
	},
	{
		id: 'bulk_print_sales_orders',
		group: 'salesOrder',
		groupSlug: 'sales-order',
		name: 'bulkPrintSalesOrders',
		method: 'GET',
		path: '/salesorders/print',
		summary: 'Bulk print sales orders',
		description:
			'Export sales orders as pdf and print them. Maximum of 25 sales orders can be printed.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-order/',
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
				name: 'salesorder_ids',
				in: 'query',
				required: true,
				description:
					'Comma-separated sales order IDs to print. Required by the API, though the Zoho OpenAPI leaves it out.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/bulk-print-sales-orders-response',
				},
			},
			{
				status: '200',
				contentType: 'application/pdf',
				schema: { type: 'string', format: 'binary' },
			},
		],
		scopes: ['ZohoBooks.salesorders.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_sales_order_billing_address',
		group: 'salesOrder',
		groupSlug: 'sales-order',
		name: 'updateSalesOrderBillingAddress',
		method: 'PUT',
		path: '/salesorders/{salesorder_id}/address/billing',
		summary: 'Update billing address',
		description: 'Updates the billing address for this sales order alone.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-order/',
		parameters: [
			{
				name: 'salesorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the sales order. Note: This value is a set of numeric characters.',
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
		scopes: ['ZohoBooks.salesorders.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_sales_order_shipping_address',
		group: 'salesOrder',
		groupSlug: 'sales-order',
		name: 'updateSalesOrderShippingAddress',
		method: 'PUT',
		path: '/salesorders/{salesorder_id}/address/shipping',
		summary: 'Update shipping address',
		description: 'Updates the shipping address for this sales order alone.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-order/',
		parameters: [
			{
				name: 'salesorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the sales order. Note: This value is a set of numeric characters.',
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
		scopes: ['ZohoBooks.salesorders.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_sales_order_templates',
		group: 'salesOrder',
		groupSlug: 'sales-order',
		name: 'listSalesOrderTemplates',
		method: 'GET',
		path: '/salesorders/templates',
		summary: 'List sales order templates',
		description: 'Get all sales order pdf templates.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-order/',
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
					$ref: '#/components/schemas/list-sales-order-templates-response',
				},
			},
		],
		scopes: ['ZohoBooks.salesorders.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_sales_order_template',
		group: 'salesOrder',
		groupSlug: 'sales-order',
		name: 'updateSalesOrderTemplate',
		method: 'PUT',
		path: '/salesorders/{salesorder_id}/templates/{template_id}',
		summary: 'Update sales order template',
		description: 'Update the pdf template associated with the sales order.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-order/',
		parameters: [
			{
				name: 'salesorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the sales order. Note: This value is a set of numeric characters.',
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
					'Unique identifier of the sales order template. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-sales-order-template-response',
				},
			},
		],
		scopes: ['ZohoBooks.salesorders.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_sales_order_attachment',
		group: 'salesOrder',
		groupSlug: 'sales-order',
		name: 'getSalesOrderAttachment',
		method: 'GET',
		path: '/salesorders/{salesorder_id}/attachment',
		summary: 'Get a sales order attachment',
		description: 'Returns the file attached to the sales order.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-order/',
		parameters: [
			{
				name: 'salesorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the sales order. Note: This value is a set of numeric characters.',
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
				name: 'preview',
				in: 'query',
				required: false,
				description: 'Check if preview of the Sales Order is required',
				schema: { type: 'boolean' },
			},
			{
				name: 'inline',
				in: 'query',
				required: false,
				description: 'Check if inline response is required',
				schema: { type: 'boolean' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/get-a-sales-order-attachment-response',
				},
			},
			{ status: '200', contentType: '*/*' },
		],
		scopes: ['ZohoBooks.salesorders.READ'],
		riskLevel: 'read',
	},
	{
		id: 'add_sales_order_attachment',
		group: 'salesOrder',
		groupSlug: 'sales-order',
		name: 'addSalesOrderAttachment',
		method: 'POST',
		path: '/salesorders/{salesorder_id}/attachment',
		summary: 'Add attachment to a sales order',
		description: 'Attach a file to a sales order.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-order/',
		parameters: [
			{
				name: 'salesorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the sales order. Note: This value is a set of numeric characters.',
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
				name: 'attachment',
				in: 'query',
				required: false,
				description:
					'The file that is to be added as an Attachment in the Sales Order',
				schema: { type: 'string', format: 'binary' },
			},
			{
				name: 'can_send_in_mail',
				in: 'query',
				required: false,
				description: 'Can the file be sent in mail.',
				schema: { type: 'boolean' },
			},
			{
				name: 'doc',
				in: 'query',
				required: false,
				description: 'Document that is to be attached',
				schema: { type: 'string', format: 'binary' },
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
					"ID's of the document. Note: This value is a set of numeric characters characters separated by comma.",
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/add-attachment-to-a-sales-order-response',
				},
			},
		],
		scopes: ['ZohoBooks.salesorders.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_sales_order_attachment_preference',
		group: 'salesOrder',
		groupSlug: 'sales-order',
		name: 'updateSalesOrderAttachmentPreference',
		method: 'PUT',
		path: '/salesorders/{salesorder_id}/attachment',
		summary: 'Update attachment preference',
		description:
			'Set whether you want to send the attached file while emailing the sales order.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-order/',
		parameters: [
			{
				name: 'salesorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the sales order. Note: This value is a set of numeric characters.',
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
				name: 'can_send_in_mail',
				in: 'query',
				required: true,
				description: 'Can the file be sent in mail.',
				schema: { type: 'boolean' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-attachment-preference-response',
				},
			},
		],
		scopes: ['ZohoBooks.salesorders.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_sales_order_attachment',
		group: 'salesOrder',
		groupSlug: 'sales-order',
		name: 'deleteSalesOrderAttachment',
		method: 'DELETE',
		path: '/salesorders/{salesorder_id}/attachment',
		summary: 'Delete an attachment',
		description: 'Delete the file attached to the sales order.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-order/',
		parameters: [
			{
				name: 'salesorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the sales order. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/delete-an-attachment-response' },
			},
		],
		scopes: ['ZohoBooks.salesorders.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'list_sales_order_comments',
		group: 'salesOrder',
		groupSlug: 'sales-order',
		name: 'listSalesOrderComments',
		method: 'GET',
		path: '/salesorders/{salesorder_id}/comments',
		summary: 'List sales order comments & history',
		description: 'Get the complete history and comments of sales order.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-order/',
		parameters: [
			{
				name: 'salesorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the sales order. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/list-sales-order-comments-and-history-response',
				},
			},
		],
		scopes: ['ZohoBooks.salesorders.READ'],
		riskLevel: 'read',
	},
	{
		id: 'add_sales_order_comment',
		group: 'salesOrder',
		groupSlug: 'sales-order',
		name: 'addSalesOrderComment',
		method: 'POST',
		path: '/salesorders/{salesorder_id}/comments',
		summary: 'Add comment',
		description: 'Add a comment for a sales order.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-order/',
		parameters: [
			{
				name: 'salesorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the sales order. Note: This value is a set of numeric characters.',
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
			schema: { $ref: '#/components/schemas/add-comment-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/add-comment-response' },
			},
		],
		scopes: ['ZohoBooks.salesorders.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_sales_order_comment',
		group: 'salesOrder',
		groupSlug: 'sales-order',
		name: 'updateSalesOrderComment',
		method: 'PUT',
		path: '/salesorders/{salesorder_id}/comments/{comment_id}',
		summary: 'Update comment',
		description: 'Update existing comment of a sales order.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-order/',
		parameters: [
			{
				name: 'salesorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the sales order. Note: This value is a set of numeric characters.',
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
		scopes: ['ZohoBooks.salesorders.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_sales_order_comment',
		group: 'salesOrder',
		groupSlug: 'sales-order',
		name: 'deleteSalesOrderComment',
		method: 'DELETE',
		path: '/salesorders/{salesorder_id}/comments/{comment_id}',
		summary: 'Delete a comment',
		description: 'Delete a sales order comment.',
		docsUrl: 'https://www.zoho.com/books/api/v3/sales-order/',
		parameters: [
			{
				name: 'salesorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the sales order. Note: This value is a set of numeric characters.',
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
		scopes: ['ZohoBooks.salesorders.DELETE'],
		riskLevel: 'destructive',
	},
] as const satisfies readonly ZohoBooksOperationDefinition[];
