import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas: Record<string, JsonValue> = {
	'add-attachment-to-a-retainer-invoice-request': {
		type: 'object',
		properties: {
			can_send_in_mail: { $ref: '#/components/schemas/can_send_in_mail' },
			attachment: { $ref: '#/components/schemas/attachment' },
		},
	},
	'add-attachment-to-a-retainer-invoice-response': {
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
				description: 'The description of the comment. Max-length [2000]',
				type: 'string',
			},
			payment_expected_date: {
				$ref: '#/components/schemas/payment_expected_date',
			},
			show_comment_to_clients: {
				$ref: '#/components/schemas/show_comment_to_clients',
			},
		},
	},
	'add-comment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	additional_field1: {
		description:
			'Paypal payment method. Allowed Values: <code>standard</code> and <code>adaptive</code>',
		type: 'string',
	},
	address: { type: 'string' },
	allow_partial_payments: {
		description:
			'Boolean to check if partial payments are allowed for the contact',
		type: 'boolean',
	},
	applied_filter: {
		description: 'The filer applied for sorting',
		type: 'string',
	},
	'apply-retainer-payments-to-invoices-request': {
		type: 'object',
		properties: {
			invoice_payments: {
				type: 'array',
				description:
					'Invoices to which the retainer invoice payments are applied, along with the amount applied to each.',
				items: {
					type: 'object',
					properties: {
						invoice_id: {
							type: 'string',
							description:
								'Unique identifier of the invoice to which the retainer payment is applied.',
						},
						amount_applied: {
							type: 'number',
							description:
								'Amount of the retainer payment applied to the invoice.',
						},
						apply_date: {
							type: 'string',
							description:
								'Date on which the retainer payment is applied to the invoice. Format [yyyy-mm-dd].',
						},
					},
				},
			},
		},
	},
	'apply-retainer-payments-to-invoices-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'approve-a-retainer-invoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	attachment: {
		description:
			'The file to be attached. It has to be sent in multipart/formdata',
		type: 'string',
		format: 'binary',
	},
	attachment_name: { type: 'string' },
	balance: { description: 'The unpaid amount', type: 'string' },
	bcy_rate: {
		description: 'base currency rate',
		type: 'number',
		format: 'float',
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
		},
	},
	body: { description: 'The body of the mail', type: 'string' },
	can_send_in_mail: {
		type: 'boolean',
		description:
			'Indicates whether the attachment can be included when sending the invoice via email.',
	},
	cc_mail_ids: {
		description: 'Array of email address of the recipients to be cced.',
		type: 'array',
		items: { type: 'string' },
	},
	city: { type: 'string' },
	client_viewed_time: {
		description: 'client viewed time for retainer invoice in client portal.',
		type: 'boolean',
	},
	comment_id: { description: 'ID of the comment', type: 'string' },
	comment_type: { type: 'string' },
	commented_by: { type: 'string' },
	commented_by_id: { type: 'string' },
	communication_preference: {
		description:
			'Preferred modes of communication for the contact person at transaction level.',
		type: 'object',
		properties: {
			is_email_enabled: { $ref: '#/components/schemas/is_email_enabled' },
			is_whatsapp_enabled: { $ref: '#/components/schemas/is_whatsapp_enabled' },
		},
	},
	configured: {
		description:
			'Boolean check to see if a payment gateway ahs been configured',
		type: 'boolean',
	},
	contact_person_email: {
		description: 'Email ID of the Contact Person.',
		type: 'string',
	},
	contact_person_id: {
		description: 'Unique ID of the Contact Person.',
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
	country: { type: 'string' },
	'create-a-retainerinvoice-request': {
		required: ['customer_id', 'line_items'],
		type: 'object',
		properties: {
			customer_id: { $ref: '#/components/schemas/customer_id' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			date: { $ref: '#/components/schemas/date' },
			contact_persons_associated: {
				$ref: '#/components/schemas/contact_persons_associated_payload',
			},
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			notes: { $ref: '#/components/schemas/notes' },
			terms: { $ref: '#/components/schemas/terms' },
			location_id: { $ref: '#/components/schemas/location_id' },
			line_items: {
				description: 'Line items of an invoice.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						description: { $ref: '#/components/schemas/description' },
						item_order: { $ref: '#/components/schemas/item_order' },
						rate: { $ref: '#/components/schemas/rate' },
					},
				},
			},
			payment_options: { $ref: '#/components/schemas/payment_options' },
			template_id: { $ref: '#/components/schemas/template_id' },
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			tags: { $ref: '#/components/schemas/tags' },
		},
	},
	'create-a-retainerinvoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			retainerinvoice: {
				$ref: '#/components/schemas/retainerinvoice-response',
			},
		},
	},
	'create-retainer-invoice-async-online-payment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	created_by_id: { type: 'string' },
	created_time: {
		description: 'The time of creation of the retainer invoice',
		type: 'string',
	},
	currency_code: {
		description: 'The currency code in which the retainer invoice is created.',
		type: 'string',
	},
	currency_id: {
		description: 'The currenct id of the currency',
		type: 'string',
	},
	currency_symbol: {
		description:
			'The currency symbol in which the retainer invoice is created.',
		type: 'string',
	},
	custom_fields: {
		description: 'Custom fields for a retainer invoice.',
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
	customer_id: {
		description: 'ID of the customer the retainer invoice has to be created.',
		type: 'string',
	},
	customer_name: {
		description: 'The name of the customer. Max-length [100]',
		type: 'string',
	},
	date: {
		description: 'The date of creation of the retainer invoice.',
		type: 'string',
	},
	date_description: { type: 'string' },
	'delete-a-comment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-a-retainer-invoice-response': {
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
	'delete-applied-retainer-payment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'deprecated_place\u0068olders_used': {
		type: 'array',
		items: { type: 'string' },
	},
	description: {
		description: 'The description of the line items. Max-length [2000]',
		type: 'string',
	},
	documents: {
		description: 'documents attached to the retainer invoice',
		type: 'array',
		items: { type: 'string' },
	},
	email: {
		description:
			'Search retainer invoices by customer contact persons email. Max-length [100]',
		type: 'string',
	},
	'email-a-retainer-invoice-request': {
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
		},
	},
	'email-a-retainer-invoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	email_template_id: {
		description:
			'Get the email content based on a specific email template. If this param is not inputted, then the content will be based on the email template associated with the customer. If no template is associated with the customer, then default template will be used.',
		type: 'string',
	},
	error_list: { type: 'array', items: { type: 'string' } },
	exchange_rate: {
		description: 'Exchange rate of the currency.',
		type: 'number',
		format: 'float',
	},
	fax: { type: 'string' },
	file_name: { type: 'string' },
	first_name: {
		description: 'First Name of the Contact Person.',
		type: 'string',
	},
	gateway_name: {
		description:
			'Name of the payment gateway associated with the retainer invoice. E.g. paypal, stripe.Allowed Values: <code>paypal</code>, <code>authorize_net</code>, <code>payflow_pro</code>, <code>stripe</code>, <code>2checkout</code> and <code>braintree</code>',
		type: 'string',
	},
	gateways_configured: { type: 'boolean' },
	'get-a-retainer-invoice-attachment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-a-retainer-invoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			retainerinvoice: {
				type: 'object',
				properties: {
					retainerinvoice_id: {
						$ref: '#/components/schemas/retainerinvoice_id',
					},
					retainerinvoice_number: {
						$ref: '#/components/schemas/retainerinvoice_number',
					},
					date: { $ref: '#/components/schemas/date' },
					status: { $ref: '#/components/schemas/status' },
					is_pre_gst: { $ref: '#/components/schemas/is_pre_gst' },
					place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
					project_id: { $ref: '#/components/schemas/project_id' },
					project_name: { $ref: '#/components/schemas/project_name' },
					last_payment_date: { $ref: '#/components/schemas/last_payment_date' },
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
					is_viewed_by_client: {
						$ref: '#/components/schemas/is_viewed_by_client',
					},
					client_viewed_time: {
						$ref: '#/components/schemas/client_viewed_time',
					},
					is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
					location_id: { $ref: '#/components/schemas/location_id' },
					location_name: { $ref: '#/components/schemas/location_name' },
					tags: { $ref: '#/components/schemas/tags' },
					line_items: {
						description: 'Line items of a retainer invoice.',
						type: 'array',
						items: {
							type: 'object',
							properties: {
								line_item_id: { $ref: '#/components/schemas/line_item_id' },
								description: { $ref: '#/components/schemas/description' },
								item_order: { $ref: '#/components/schemas/item_order' },
								rate: { $ref: '#/components/schemas/rate' },
								bcy_rate: { $ref: '#/components/schemas/bcy_rate' },
								tax_id: { $ref: '#/components/schemas/tax_id' },
								tax_name: { $ref: '#/components/schemas/tax_name' },
								tax_type: { $ref: '#/components/schemas/tax_type' },
								tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
								item_total: { $ref: '#/components/schemas/item_total' },
								location_id: { $ref: '#/components/schemas/location_id' },
								location_name: { $ref: '#/components/schemas/location_name' },
							},
						},
					},
					sub_total: { $ref: '#/components/schemas/sub_total' },
					total: { $ref: '#/components/schemas/total' },
					taxes: { $ref: '#/components/schemas/taxes' },
					payment_made: { $ref: '#/components/schemas/payment_made' },
					payment_drawn: { $ref: '#/components/schemas/payment_drawn' },
					balance: { $ref: '#/components/schemas/balance' },
					allow_partial_payments: {
						$ref: '#/components/schemas/allow_partial_payments',
					},
					price_precision: { $ref: '#/components/schemas/price_precision' },
					payment_options: { $ref: '#/components/schemas/payment_options' },
					is_emailed: { $ref: '#/components/schemas/is_emailed' },
					documents: { $ref: '#/components/schemas/documents' },
					billing_address: { $ref: '#/components/schemas/billing_address' },
					shipping_address: { $ref: '#/components/schemas/shipping_address' },
					notes: { $ref: '#/components/schemas/notes' },
					terms: { $ref: '#/components/schemas/terms' },
					custom_fields: { $ref: '#/components/schemas/custom_fields' },
					template_id: { $ref: '#/components/schemas/template_id' },
					template_name: { $ref: '#/components/schemas/template_name' },
					page_width: { $ref: '#/components/schemas/page_width' },
					page_height: { $ref: '#/components/schemas/page_height' },
					orientation: { $ref: '#/components/schemas/orientation' },
					template_type: { $ref: '#/components/schemas/template_type' },
					created_time: { $ref: '#/components/schemas/created_time' },
					last_modified_time: {
						$ref: '#/components/schemas/last_modified_time',
					},
					created_by_id: { $ref: '#/components/schemas/created_by_id' },
					attachment_name: { $ref: '#/components/schemas/attachment_name' },
					can_send_in_mail: { $ref: '#/components/schemas/can_send_in_mail' },
					invoice_url: { $ref: '#/components/schemas/invoice_url' },
				},
			},
		},
	},
	'get-retainer-invoice-email-content-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			gateways_configured: { $ref: '#/components/schemas/gateways_configured' },
			'deprecated_place\u0068olders_used': {
				$ref: '#/components/schemas/deprecated_place\u0068olders_used',
			},
			body: { $ref: '#/components/schemas/body' },
			error_list: { $ref: '#/components/schemas/error_list' },
			subject: { $ref: '#/components/schemas/subject' },
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
						contact_person_id: {
							$ref: '#/components/schemas/contact_person_id',
						},
						mobile: { $ref: '#/components/schemas/mobile' },
					},
				},
			},
			attachment_name: { $ref: '#/components/schemas/attachment_name' },
			email_template_id: { $ref: '#/components/schemas/email_template_id' },
			file_name: { $ref: '#/components/schemas/file_name' },
			from_emails: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						user_name: { $ref: '#/components/schemas/user_name' },
						selected: { $ref: '#/components/schemas/selected' },
						email: { $ref: '#/components/schemas/email' },
					},
				},
			},
			customer_id: { $ref: '#/components/schemas/customer_id' },
		},
	},
	has_attachment: {
		description: 'Boolean retainer invoice has attachment',
		type: 'boolean',
	},
	has_more_page: { description: 'Check if has more pages', type: 'boolean' },
	index: { description: 'The index of the custom field', type: 'integer' },
	invoice_url: { type: 'string' },
	is_email_enabled: {
		description:
			'Used to check if Email communication preference is enabled for the contact person at transaction level.',
		type: 'boolean',
	},
	is_emailed: {
		description: 'Boolean check to if the email was sent',
		type: 'string',
	},
	is_inclusive_tax: { type: 'boolean' },
	is_pre_gst: {
		description: 'Applicable for transactions that fall before july 1, 2017',
		type: 'string',
	},
	is_tag_mandatory: {
		description: 'Used to check if the tag is mandatory',
		type: 'boolean',
	},
	is_viewed_by_client: {
		description:
			'Boolean is retainer invoice viewed by client in client portal.',
		type: 'boolean',
	},
	is_whatsapp_enabled: {
		description:
			'Used to check if WhatsApp communication preference is enabled for the contact person at transaction level.',
		type: 'boolean',
		'x-node_available_in': ['WhatsApp integration'],
	},
	item_order: {
		description: 'The order of the line item_order',
		type: 'integer',
	},
	item_total: {
		description: 'The total amount of the line items',
		type: 'number',
		format: 'float',
	},
	label: { description: 'The label of the custom field.', type: 'string' },
	last_modified_time: {
		description: 'The time of last modification of the retainer invoice',
		type: 'string',
	},
	last_name: {
		description: 'Last Name of the Contact Person.',
		type: 'string',
	},
	last_payment_date: {
		description: 'The last payment date of the retainer invoice',
		type: 'string',
	},
	line_item_id: { description: 'The line item id', type: 'string' },
	'list-a-retainer-invoices-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			retainerinvoices: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						retainerinvoice_id: {
							$ref: '#/components/schemas/retainerinvoice_id',
						},
						customer_name: { $ref: '#/components/schemas/customer_name' },
						retainerinvoice_number: {
							$ref: '#/components/schemas/retainerinvoice_number',
						},
						customer_id: { $ref: '#/components/schemas/customer_id' },
						status: { $ref: '#/components/schemas/status' },
						reference_number: { $ref: '#/components/schemas/reference_number' },
						project_or_estimate_name: {
							$ref: '#/components/schemas/project_or_estimate_name',
						},
						date: { $ref: '#/components/schemas/date' },
						currency_id: { $ref: '#/components/schemas/currency_id' },
						currency_code: { $ref: '#/components/schemas/currency_code' },
						is_viewed_by_client: {
							$ref: '#/components/schemas/is_viewed_by_client',
						},
						client_viewed_time: {
							$ref: '#/components/schemas/client_viewed_time',
						},
						total: { $ref: '#/components/schemas/total' },
						balance: { $ref: '#/components/schemas/balance' },
						created_time: { $ref: '#/components/schemas/created_time' },
						last_modified_time: {
							$ref: '#/components/schemas/last_modified_time',
						},
						is_emailed: { $ref: '#/components/schemas/is_emailed' },
						last_payment_date: {
							$ref: '#/components/schemas/last_payment_date',
						},
						has_attachment: { $ref: '#/components/schemas/has_attachment' },
						tags: { $ref: '#/components/schemas/tags' },
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
					applied_filter: { $ref: '#/components/schemas/applied_filter' },
					sort_column: { $ref: '#/components/schemas/sort_column' },
					sort_order: { $ref: '#/components/schemas/sort_order' },
				},
			},
		},
	},
	'list-retainer-invoice-comments-and-history-response': {
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
						retainerinvoice_id: {
							$ref: '#/components/schemas/retainerinvoice_id',
						},
						description: { $ref: '#/components/schemas/description' },
						commented_by_id: { $ref: '#/components/schemas/commented_by_id' },
						commented_by: { $ref: '#/components/schemas/commented_by' },
						comment_type: { $ref: '#/components/schemas/comment_type' },
						operation_type: { $ref: '#/components/schemas/operation_type' },
						date: { $ref: '#/components/schemas/date' },
						date_description: { $ref: '#/components/schemas/date_description' },
						time: { $ref: '#/components/schemas/time' },
						transaction_id: { $ref: '#/components/schemas/transaction_id' },
						transaction_type: { $ref: '#/components/schemas/transaction_type' },
					},
				},
			},
		},
	},
	'list-retainer-invoice-templates-response': {
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
	location_id: { description: 'Location ID', type: 'string' },
	location_name: { description: 'Name of the location.', type: 'string' },
	'mark-a-retainer-invoice-as-sent-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'mark-as-draft-response': {
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
	notes: {
		description:
			'The notes added below expressing gratitude or for conveying some information.',
		type: 'string',
	},
	operation_type: { type: 'string' },
	orientation: { type: 'string' },
	page: { description: 'Number of pages', type: 'integer' },
	page_height: { type: 'string' },
	page_width: { type: 'string' },
	payment_drawn: {
		description: 'The amount drawn',
		type: 'number',
		format: 'float',
	},
	payment_expected_date: {
		type: 'string',
		description: 'Expected date of payment for the retainer invoice.',
	},
	payment_gateways: {
		description: 'Online payment gateways through which payment can be made.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				configured: { $ref: '#/components/schemas/configured' },
				additional_field1: { $ref: '#/components/schemas/additional_field1' },
				gateway_name: { $ref: '#/components/schemas/gateway_name' },
			},
		},
	},
	payment_made: {
		description: 'The amount paid',
		type: 'number',
		format: 'float',
	},
	payment_options: {
		description:
			'Payment options for the retainer invoice, online payment gateways and bank accounts. Will be displayed in the pdf.',
		type: 'object',
		properties: {
			payment_gateways: { $ref: '#/components/schemas/payment_gateways' },
		},
	},
	per_page: { description: 'Per page values', type: 'integer' },
	phone: { description: 'Phone Number of the Contact Person.', type: 'string' },
	place_of_supply: {
		description:
			'Place where the goods/services are supplied to. (If not given, <code>place of contact</code> given for the contact will be taken)',
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	price_precision: {
		description: 'The precision value on the price',
		type: 'integer',
	},
	project_id: { description: 'ID of the project', type: 'string' },
	project_name: { description: 'Name of the project', type: 'string' },
	project_or_estimate_name: { type: 'string' },
	rate: {
		description: 'Rate of the line item.',
		type: 'number',
		format: 'double',
	},
	reference_number: {
		description:
			'The reference number of the retainer invoice. Max-length [100]',
		type: 'string',
	},
	report_name: { description: 'The report name', type: 'string' },
	'retainerinvoice-response': {
		type: 'object',
		properties: {
			retainerinvoice_id: { $ref: '#/components/schemas/retainerinvoice_id' },
			retainerinvoice_number: {
				$ref: '#/components/schemas/retainerinvoice_number',
			},
			date: { $ref: '#/components/schemas/date' },
			status: { $ref: '#/components/schemas/status' },
			is_pre_gst: { $ref: '#/components/schemas/is_pre_gst' },
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			project_id: { $ref: '#/components/schemas/project_id' },
			project_name: { $ref: '#/components/schemas/project_name' },
			last_payment_date: { $ref: '#/components/schemas/last_payment_date' },
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
			is_viewed_by_client: { $ref: '#/components/schemas/is_viewed_by_client' },
			client_viewed_time: { $ref: '#/components/schemas/client_viewed_time' },
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			location_id: { $ref: '#/components/schemas/location_id' },
			location_name: { $ref: '#/components/schemas/location_name' },
			tags: { $ref: '#/components/schemas/tags_response' },
			line_items: {
				description: 'Line items of a retainer invoice.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						line_item_id: { $ref: '#/components/schemas/line_item_id' },
						description: { $ref: '#/components/schemas/description' },
						item_order: { $ref: '#/components/schemas/item_order' },
						rate: { $ref: '#/components/schemas/rate' },
						bcy_rate: { $ref: '#/components/schemas/bcy_rate' },
						tax_id: { $ref: '#/components/schemas/tax_id' },
						tax_name: { $ref: '#/components/schemas/tax_name' },
						tax_type: { $ref: '#/components/schemas/tax_type' },
						tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
						item_total: { $ref: '#/components/schemas/item_total' },
						location_id: { $ref: '#/components/schemas/location_id' },
						location_name: { $ref: '#/components/schemas/location_name' },
					},
				},
			},
			sub_total: { $ref: '#/components/schemas/sub_total' },
			total: { $ref: '#/components/schemas/total' },
			taxes: { $ref: '#/components/schemas/taxes' },
			payment_made: { $ref: '#/components/schemas/payment_made' },
			payment_drawn: { $ref: '#/components/schemas/payment_drawn' },
			balance: { $ref: '#/components/schemas/balance' },
			allow_partial_payments: {
				$ref: '#/components/schemas/allow_partial_payments',
			},
			price_precision: { $ref: '#/components/schemas/price_precision' },
			payment_options: { $ref: '#/components/schemas/payment_options' },
			is_emailed: { $ref: '#/components/schemas/is_emailed' },
			documents: { $ref: '#/components/schemas/documents' },
			billing_address: { $ref: '#/components/schemas/billing_address' },
			shipping_address: { $ref: '#/components/schemas/shipping_address' },
			notes: { $ref: '#/components/schemas/notes' },
			terms: { $ref: '#/components/schemas/terms' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
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
			invoice_url: { $ref: '#/components/schemas/invoice_url' },
		},
	},
	retainerinvoice_id: {
		description: 'ID of the retainerinvoice',
		type: 'string',
	},
	retainerinvoice_number: {
		description:
			'number of the retainer invoice.Variants: <code>retainerinvoice_number_startswith</code> and <code>retainerinvoice_number_contains</code>. Max-length [100]',
		type: 'string',
	},
	salutation: {
		description: 'Salutation of the Contact Person.',
		type: 'string',
	},
	selected: { type: 'string' },
	send_from_org_email_id: {
		description:
			"Boolean to trigger the email from the organization's email address",
		type: 'boolean',
	},
	shipping_address: {
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
	show_comment_to_clients: {
		description: 'Boolean to check if the comment to be shown to the clients',
		type: 'boolean',
	},
	show_on_pdf: {
		description:
			'Boolean value to check if the custom field is to be dispplayed on the pdf.',
		type: 'boolean',
	},
	sort_column: {
		description:
			'Sort retainer invoices.Allowed Values: <code>customer_name</code>, <code>retainer invoice_number</code>, <code>date</code>, <code> due_date</code>, <code>total</code>, <code>balance</code> and  <code>created_time</code>',
		type: 'string',
	},
	sort_order: { description: 'The order for sorting', type: 'string' },
	state: { type: 'string' },
	status: {
		description:
			'retainer invoice status.Allowed Values: <code>sent</code>, <code>draft</code>, <code>overdue</code>, <code>paid</code>, <code>void</code>, <code>unpaid</code>, <code>partially_paid</code> and <code>viewed</code>',
		type: 'string',
	},
	street2: { type: 'string' },
	sub_total: {
		description: 'The sub total of the all items',
		type: 'number',
		format: 'float',
	},
	subject: { description: 'The subject of the mail', type: 'string' },
	'submit-a-retainer-invoice-for-approval-response': {
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
	tax_amount: {
		description: 'The amount of the tax levied',
		type: 'number',
		format: 'float',
	},
	tax_id: {
		description: 'ID of the tax or tax group applied to the estimate',
		type: 'string',
	},
	tax_name: { description: 'The name of the tax', type: 'string' },
	tax_percentage: {
		description: 'The  percentage of tax levied',
		type: 'number',
		format: 'float',
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
	template_id: {
		description: 'ID of the pdf template associated with the retainer invoice.',
		type: 'string',
	},
	template_name: { type: 'string' },
	template_type: { description: 'The type of template type', type: 'string' },
	terms: {
		description:
			'The terms added below expressing gratitude or for conveying some information.',
		type: 'string',
	},
	time: { type: 'string' },
	to_mail_ids: {
		description: 'Array of email address of the recipients.',
		type: 'array',
		items: { type: 'string' },
	},
	total: { description: 'The total amount to be paid', type: 'string' },
	transaction_id: { type: 'string' },
	transaction_type: { type: 'string' },
	'update-a-retainerinvoice-request': {
		required: ['customer_id', 'line_items'],
		type: 'object',
		properties: {
			customer_id: { $ref: '#/components/schemas/customer_id' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			date: { $ref: '#/components/schemas/date' },
			contact_persons_associated: {
				$ref: '#/components/schemas/contact_persons_associated_payload',
			},
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			notes: { $ref: '#/components/schemas/notes' },
			terms: { $ref: '#/components/schemas/terms' },
			location_id: { $ref: '#/components/schemas/location_id' },
			tags: { $ref: '#/components/schemas/tags' },
			line_items: {
				description: 'Line items of a retainer invoice.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						description: { $ref: '#/components/schemas/description' },
						item_order: { $ref: '#/components/schemas/item_order' },
						rate: { $ref: '#/components/schemas/rate' },
					},
				},
			},
			payment_options: { $ref: '#/components/schemas/payment_options' },
			template_id: { $ref: '#/components/schemas/template_id' },
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			project_id: { $ref: '#/components/schemas/project_id' },
		},
	},
	'update-a-retainerinvoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			retainerinvoice: {
				type: 'object',
				properties: {
					retainerinvoice_id: {
						$ref: '#/components/schemas/retainerinvoice_id',
					},
					retainerinvoice_number: {
						$ref: '#/components/schemas/retainerinvoice_number',
					},
					date: { $ref: '#/components/schemas/date' },
					status: { $ref: '#/components/schemas/status' },
					is_pre_gst: { $ref: '#/components/schemas/is_pre_gst' },
					place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
					project_id: { $ref: '#/components/schemas/project_id' },
					project_name: { $ref: '#/components/schemas/project_name' },
					last_payment_date: { $ref: '#/components/schemas/last_payment_date' },
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
					is_viewed_by_client: {
						$ref: '#/components/schemas/is_viewed_by_client',
					},
					client_viewed_time: {
						$ref: '#/components/schemas/client_viewed_time',
					},
					is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
					location_id: { $ref: '#/components/schemas/location_id' },
					location_name: { $ref: '#/components/schemas/location_name' },
					tags: { $ref: '#/components/schemas/tags' },
					line_items: {
						description: 'Line items of an invoice.',
						type: 'array',
						items: {
							type: 'object',
							properties: {
								line_item_id: { $ref: '#/components/schemas/line_item_id' },
								description: { $ref: '#/components/schemas/description' },
								item_order: { $ref: '#/components/schemas/item_order' },
								rate: { $ref: '#/components/schemas/rate' },
								bcy_rate: { $ref: '#/components/schemas/bcy_rate' },
								tax_id: { $ref: '#/components/schemas/tax_id' },
								tax_name: { $ref: '#/components/schemas/tax_name' },
								tax_type: { $ref: '#/components/schemas/tax_type' },
								tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
								item_total: { $ref: '#/components/schemas/item_total' },
								location_id: { $ref: '#/components/schemas/location_id' },
								location_name: { $ref: '#/components/schemas/location_name' },
							},
						},
					},
					sub_total: { $ref: '#/components/schemas/sub_total' },
					total: { $ref: '#/components/schemas/total' },
					taxes: { $ref: '#/components/schemas/taxes' },
					payment_made: { $ref: '#/components/schemas/payment_made' },
					payment_drawn: { $ref: '#/components/schemas/payment_drawn' },
					balance: { $ref: '#/components/schemas/balance' },
					allow_partial_payments: {
						$ref: '#/components/schemas/allow_partial_payments',
					},
					price_precision: { $ref: '#/components/schemas/price_precision' },
					payment_options: { $ref: '#/components/schemas/payment_options' },
					is_emailed: { $ref: '#/components/schemas/is_emailed' },
					documents: { $ref: '#/components/schemas/documents' },
					billing_address: { $ref: '#/components/schemas/billing_address' },
					shipping_address: { $ref: '#/components/schemas/shipping_address' },
					notes: { $ref: '#/components/schemas/notes' },
					terms: { $ref: '#/components/schemas/terms' },
					custom_fields: { $ref: '#/components/schemas/custom_fields' },
					template_id: { $ref: '#/components/schemas/template_id' },
					template_name: { $ref: '#/components/schemas/template_name' },
					page_width: { $ref: '#/components/schemas/page_width' },
					page_height: { $ref: '#/components/schemas/page_height' },
					orientation: { $ref: '#/components/schemas/orientation' },
					template_type: { $ref: '#/components/schemas/template_type' },
					created_time: { $ref: '#/components/schemas/created_time' },
					last_modified_time: {
						$ref: '#/components/schemas/last_modified_time',
					},
					created_by_id: { $ref: '#/components/schemas/created_by_id' },
					attachment_name: { $ref: '#/components/schemas/attachment_name' },
					can_send_in_mail: { $ref: '#/components/schemas/can_send_in_mail' },
					invoice_url: { $ref: '#/components/schemas/invoice_url' },
				},
			},
		},
	},
	'update-billing-address-request': {
		type: 'object',
		properties: {
			address: { description: 'address of the customer', type: 'string' },
			city: { description: 'city of the customer', type: 'string' },
			state: { description: 'state of the customer', type: 'string' },
			zip: { description: 'zip of the customer', type: 'string' },
			country: { description: 'country of the customer', type: 'string' },
			fax: { description: 'fax of the customer', type: 'string' },
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
				description: 'The comment on a retainer invoice',
				type: 'string',
			},
			show_comment_to_clients: {
				$ref: '#/components/schemas/show_comment_to_clients',
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
					retainerinvoice_id: {
						$ref: '#/components/schemas/retainerinvoice_id',
					},
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
	'update-retainer-invoice-template-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	user_name: { type: 'array', items: { type: 'string' } },
	value: { type: 'string', description: 'The value of the custom field' },
	'void-a-retainer-invoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	zip: { type: 'string' },
};

export const operations: readonly ZohoBooksOperationDefinition[] = [
	{
		id: 'create_retainer_invoice',
		group: 'retainerInvoices',
		groupSlug: 'retainer-invoices',
		name: 'createRetainerInvoice',
		method: 'POST',
		path: '/retainerinvoices',
		summary: 'Create a retainerinvoice',
		description: 'Create a retainer invoice for your customer.',
		docsUrl: 'https://www.zoho.com/books/api/v3/retainer-invoices/',
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
					'Ignore auto invoice number generation for this invoice. This mandates the invoice number. Allowed values <code>true</code> and <code>false</code>',
				schema: { type: 'boolean' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/create-a-retainerinvoice-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/create-a-retainerinvoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_retainer_invoices',
		group: 'retainerInvoices',
		groupSlug: 'retainer-invoices',
		name: 'listRetainerInvoices',
		method: 'GET',
		path: '/retainerinvoices',
		summary: 'List a retainer invoices',
		description: 'List all retainer invoices with pagination.',
		docsUrl: 'https://www.zoho.com/books/api/v3/retainer-invoices/',
		parameters: [
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
				description: 'Print the exported pdf.',
				schema: { type: 'boolean' },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description:
					'Sort retainer invoices.Allowed Values: <code>customer_name</code>, <code>retainer invoice_number</code>, <code>date</code>, <code> due_date</code>, <code>total</code>, <code>balance</code> and  <code>created_time</code>',
				schema: { type: 'string' },
			},
			{
				name: 'filter_by',
				in: 'query',
				required: false,
				description:
					'Filter invoices by any status or payment expected date.Allowed Values: <code> Status.All</code>, <code>Status.Sent</code>, <code> Status.Draft</code>, <code>Status.OverDue</code>, <code>Status.Paid</code>, <code>Status.Void</code>, <code>Status.Unpaid</code>, <code>Status.PartiallyPaid</code>,<code> Status.Viewed</code> and <code>Date.PaymentExpectedDate</code>',
				schema: { type: 'string' },
			},
			{
				name: 'sort_order',
				in: 'query',
				required: false,
				description: 'The order for sorting',
				schema: { type: 'string' },
			},
			{
				name: 'page',
				in: 'query',
				required: false,
				description: 'Number of pages',
				schema: { type: 'integer' },
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
					$ref: '#/components/schemas/list-a-retainer-invoices-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_retainer_invoice',
		group: 'retainerInvoices',
		groupSlug: 'retainer-invoices',
		name: 'updateRetainerInvoice',
		method: 'PUT',
		path: '/retainerinvoices/{retainerinvoice_id}',
		summary: 'update a retainerinvoice',
		description: 'Update an existing invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/retainer-invoices/',
		parameters: [
			{
				name: 'retainerinvoice_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the retainer invoice.',
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
			schema: { $ref: '#/components/schemas/update-a-retainerinvoice-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-a-retainerinvoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_retainer_invoice',
		group: 'retainerInvoices',
		groupSlug: 'retainer-invoices',
		name: 'getRetainerInvoice',
		method: 'GET',
		path: '/retainerinvoices/{retainerinvoice_id}',
		summary: 'Get a retainer invoice',
		description: 'Get the details of a retainer invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/retainer-invoices/',
		parameters: [
			{
				name: 'retainerinvoice_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the retainer invoice.',
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
					$ref: '#/components/schemas/get-a-retainer-invoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_retainer_invoice',
		group: 'retainerInvoices',
		groupSlug: 'retainer-invoices',
		name: 'deleteRetainerInvoice',
		method: 'DELETE',
		path: '/retainerinvoices/{retainerinvoice_id}',
		summary: 'Delete a retainer invoice',
		description:
			'Delete an existing retainer invoice. Invoices which have payment or credits note applied cannot be deleted.',
		docsUrl: 'https://www.zoho.com/books/api/v3/retainer-invoices/',
		parameters: [
			{
				name: 'retainerinvoice_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the retainer invoice.',
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
					$ref: '#/components/schemas/delete-a-retainer-invoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'mark_retainer_invoice_sent',
		group: 'retainerInvoices',
		groupSlug: 'retainer-invoices',
		name: 'markRetainerInvoiceSent',
		method: 'POST',
		path: '/retainerinvoices/{retainerinvoice_id}/status/sent',
		summary: 'Mark a retainer invoice as sent',
		description: 'Mark a draft retainer invoice as sent.',
		docsUrl: 'https://www.zoho.com/books/api/v3/retainer-invoices/',
		parameters: [
			{
				name: 'retainerinvoice_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the retainer invoice.',
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
					$ref: '#/components/schemas/mark-a-retainer-invoice-as-sent-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_retainer_invoice_template',
		group: 'retainerInvoices',
		groupSlug: 'retainer-invoices',
		name: 'updateRetainerInvoiceTemplate',
		method: 'PUT',
		path: '/retainerinvoices/{retainerinvoice_id}/templates/{template_id}',
		summary: 'Update retainer invoice template',
		description:
			'Update the pdf template associated with the retainer invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/retainer-invoices/',
		parameters: [
			{
				name: 'retainerinvoice_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the retainer invoice.',
				schema: { type: 'string' },
			},
			{
				name: 'template_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the retainer invoice template.',
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
					$ref: '#/components/schemas/update-retainer-invoice-template-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_retainer_invoice_void',
		group: 'retainerInvoices',
		groupSlug: 'retainer-invoices',
		name: 'markRetainerInvoiceVoid',
		method: 'POST',
		path: '/retainerinvoices/{retainerinvoice_id}/status/void',
		summary: 'Void a retainer invoice',
		description:
			'Mark an invoice status as void. Upon voiding, the payments and credits associated with the retainer invoices will be unassociated and will be under customer credits.',
		docsUrl: 'https://www.zoho.com/books/api/v3/retainer-invoices/',
		parameters: [
			{
				name: 'retainerinvoice_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the retainer invoice.',
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
					$ref: '#/components/schemas/void-a-retainer-invoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'mark_retainer_invoice_draft',
		group: 'retainerInvoices',
		groupSlug: 'retainer-invoices',
		name: 'markRetainerInvoiceDraft',
		method: 'POST',
		path: '/retainerinvoices/{retainerinvoice_id}/status/draft',
		summary: 'Mark as draft',
		description: 'Mark a voided retainer invoice as draft. ',
		docsUrl: 'https://www.zoho.com/books/api/v3/retainer-invoices/',
		parameters: [
			{
				name: 'retainerinvoice_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the retainer invoice.',
				schema: { type: 'string' },
			},
			{
				name: 'reason',
				in: 'query',
				required: false,
				description: 'Reason for marking the retainer invoice as draft.',
				schema: { type: 'string', maxLength: 500 },
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
				schema: { $ref: '#/components/schemas/mark-as-draft-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'submit_retainer_invoice',
		group: 'retainerInvoices',
		groupSlug: 'retainer-invoices',
		name: 'submitRetainerInvoice',
		method: 'POST',
		path: '/retainerinvoices/{retainerinvoice_id}/submit',
		summary: 'Submit a retainer invoice for approval',
		description: 'Submit a retainer invoice for approval.',
		docsUrl: 'https://www.zoho.com/books/api/v3/retainer-invoices/',
		parameters: [
			{
				name: 'retainerinvoice_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the retainer invoice.',
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
					$ref: '#/components/schemas/submit-a-retainer-invoice-for-approval-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'approve_retainer_invoice',
		group: 'retainerInvoices',
		groupSlug: 'retainer-invoices',
		name: 'approveRetainerInvoice',
		method: 'POST',
		path: '/retainerinvoices/{retainerinvoice_id}/approve',
		summary: 'Approve a retainer invoice.',
		description: 'Approve a retainer invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/retainer-invoices/',
		parameters: [
			{
				name: 'retainerinvoice_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the retainer invoice.',
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
					$ref: '#/components/schemas/approve-a-retainer-invoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'email_retainer_invoice',
		group: 'retainerInvoices',
		groupSlug: 'retainer-invoices',
		name: 'emailRetainerInvoice',
		method: 'POST',
		path: '/retainerinvoices/{retainerinvoice_id}/email',
		summary: 'Email a retainer invoice',
		description:
			'Email a retainer invoice to the customer. Input json string is not mandatory. If input json string is empty, mail will be send with default mail content.',
		docsUrl: 'https://www.zoho.com/books/api/v3/retainer-invoices/',
		parameters: [
			{
				name: 'retainerinvoice_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the retainer invoice.',
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
				name: 'send_customer_statement',
				in: 'query',
				required: false,
				description: 'Send customer statement pdf a with email.',
				schema: { type: 'boolean' },
			},
			{
				name: 'send_attachment',
				in: 'query',
				required: false,
				description: 'Send the retainer invoice attachment a with the email.',
				schema: { type: 'boolean' },
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
			schema: { $ref: '#/components/schemas/email-a-retainer-invoice-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/email-a-retainer-invoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_retainer_invoice_email',
		group: 'retainerInvoices',
		groupSlug: 'retainer-invoices',
		name: 'getRetainerInvoiceEmail',
		method: 'GET',
		path: '/retainerinvoices/{retainerinvoice_id}/email',
		summary: 'Get retainer invoice email content',
		description: 'Get the email content of a retainer invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/retainer-invoices/',
		parameters: [
			{
				name: 'retainerinvoice_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the retainer invoice.',
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
					$ref: '#/components/schemas/get-retainer-invoice-email-content-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_retainer_invoice_billing_address',
		group: 'retainerInvoices',
		groupSlug: 'retainer-invoices',
		name: 'updateRetainerInvoiceBillingAddress',
		method: 'PUT',
		path: '/retainerinvoices/{retainerinvoice_id}/address/billing',
		summary: 'Update billing address',
		description: 'Updates the billing address for this retainer invoice alone.',
		docsUrl: 'https://www.zoho.com/books/api/v3/retainer-invoices/',
		parameters: [
			{
				name: 'retainerinvoice_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the retainer invoice.',
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
		scopes: ['ZohoBooks.invoices.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_retainer_invoice_templates',
		group: 'retainerInvoices',
		groupSlug: 'retainer-invoices',
		name: 'listRetainerInvoiceTemplates',
		method: 'GET',
		path: '/retainerinvoices/templates',
		summary: 'List retainer invoice templates',
		description: 'Get all retainer invoice pdf templates.',
		docsUrl: 'https://www.zoho.com/books/api/v3/retainer-invoices/',
		parameters: [
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
					$ref: '#/components/schemas/list-retainer-invoice-templates-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'get_retainer_invoice_attachment',
		group: 'retainerInvoices',
		groupSlug: 'retainer-invoices',
		name: 'getRetainerInvoiceAttachment',
		method: 'GET',
		path: '/retainerinvoices/{retainerinvoice_id}/attachment',
		summary: 'Get a retainer invoice attachment',
		description: 'Returns the file attached to the retainer invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/retainer-invoices/',
		parameters: [
			{
				name: 'retainerinvoice_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the retainer invoice.',
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
					$ref: '#/components/schemas/get-a-retainer-invoice-attachment-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'add_retainer_invoice_attachment',
		group: 'retainerInvoices',
		groupSlug: 'retainer-invoices',
		name: 'addRetainerInvoiceAttachment',
		method: 'POST',
		path: '/retainerinvoices/{retainerinvoice_id}/attachment',
		summary: 'Add attachment to a retainer invoice',
		description: 'Attach a file to an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/retainer-invoices/',
		parameters: [
			{
				name: 'retainerinvoice_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the retainer invoice.',
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
				$ref: '#/components/schemas/add-attachment-to-a-retainer-invoice-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/add-attachment-to-a-retainer-invoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_retainer_invoice_attachment',
		group: 'retainerInvoices',
		groupSlug: 'retainer-invoices',
		name: 'deleteRetainerInvoiceAttachment',
		method: 'DELETE',
		path: '/retainerinvoices/{retainerinvoice_id}/documents/{document_id}',
		summary: 'Delete an attachment',
		description: 'Delete the file attached to the retainer invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/retainer-invoices/',
		parameters: [
			{
				name: 'retainerinvoice_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the retainer invoice.',
				schema: { type: 'string' },
			},
			{
				name: 'document_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the retainer invoice document.',
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
		scopes: ['ZohoBooks.invoices.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'list_retainer_invoice',
		group: 'retainerInvoices',
		groupSlug: 'retainer-invoices',
		name: 'listRetainerInvoice',
		method: 'GET',
		path: '/retainerinvoices/{retainerinvoice_id}/comments',
		summary: 'List retainer invoice comments & history',
		description: 'Get the complete history and comments of a retainer invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/retainer-invoices/',
		parameters: [
			{
				name: 'retainerinvoice_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the retainer invoice.',
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
					$ref: '#/components/schemas/list-retainer-invoice-comments-and-history-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'add_retainer_invoice_comment',
		group: 'retainerInvoices',
		groupSlug: 'retainer-invoices',
		name: 'addRetainerInvoiceComment',
		method: 'POST',
		path: '/retainerinvoices/{retainerinvoice_id}/comments',
		summary: 'Add comment',
		description: 'Add a comment for a retainer invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/retainer-invoices/',
		parameters: [
			{
				name: 'retainerinvoice_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the retainer invoice.',
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
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/add-comment-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_retainer_invoice_comment',
		group: 'retainerInvoices',
		groupSlug: 'retainer-invoices',
		name: 'deleteRetainerInvoiceComment',
		method: 'DELETE',
		path: '/retainerinvoices/{retainerinvoice_id}/comments/{comment_id}',
		summary: 'Delete a comment',
		description: 'Delete a retainer invoice comment.',
		docsUrl: 'https://www.zoho.com/books/api/v3/retainer-invoices/',
		parameters: [
			{
				name: 'retainerinvoice_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the retainer invoice.',
				schema: { type: 'string' },
			},
			{
				name: 'comment_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the comment.',
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
				schema: { $ref: '#/components/schemas/delete-a-comment-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'update_retainer_invoice_comment',
		group: 'retainerInvoices',
		groupSlug: 'retainer-invoices',
		name: 'updateRetainerInvoiceComment',
		method: 'PUT',
		path: '/retainerinvoices/{retainerinvoice_id}/comments/{comment_id}',
		summary: 'Update comment',
		description: 'Update an existing comment of a retainer invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/retainer-invoices/',
		parameters: [
			{
				name: 'retainerinvoice_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the retainer invoice.',
				schema: { type: 'string' },
			},
			{
				name: 'comment_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the comment.',
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
			schema: { $ref: '#/components/schemas/update-comment-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-comment-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'apply_retainer_payments_to_invoices',
		group: 'retainerInvoices',
		groupSlug: 'retainer-invoices',
		name: 'applyRetainerPaymentsToInvoices',
		method: 'POST',
		path: '/retainerinvoices/{retainerinvoice_id}/invoices',
		summary: 'Apply retainer invoice payments to invoices',
		description:
			'Apply the advance payments collected against a retainer invoice to one or more invoices.',
		docsUrl: 'https://www.zoho.com/books/api/v3/retainer-invoices/',
		parameters: [
			{
				name: 'retainerinvoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the retainer invoice. Note: This value is a set of numeric characters.',
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
				$ref: '#/components/schemas/apply-retainer-payments-to-invoices-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/apply-retainer-payments-to-invoices-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_applied_retainer_payment',
		group: 'retainerInvoices',
		groupSlug: 'retainer-invoices',
		name: 'deleteAppliedRetainerPayment',
		method: 'DELETE',
		path: '/retainerinvoices/{retainerinvoice_id}/invoices/{invoice_id}',
		summary: 'Delete a retainer payment applied to an invoice',
		description:
			'Delete a retainer invoice payment that was applied to an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/retainer-invoices/',
		parameters: [
			{
				name: 'retainerinvoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the retainer invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice to disassociate. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/delete-applied-retainer-payment-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'create_retainer_invoice_async_online_payment',
		group: 'retainerInvoices',
		groupSlug: 'retainer-invoices',
		name: 'createRetainerInvoiceAsyncOnlinePayment',
		method: 'POST',
		path: '/retainerinvoices/{retainerinvoice_id}/onlinepayments/asynchronous',
		summary: 'Record an asynchronous online payment for a retainer invoice',
		description:
			'Record an online payment for a retainer invoice and process it asynchronously.',
		docsUrl: 'https://www.zoho.com/books/api/v3/retainer-invoices/',
		parameters: [
			{
				name: 'retainerinvoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the retainer invoice. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/create-retainer-invoice-async-online-payment-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
];
