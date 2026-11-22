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
		description:
			'Name of the chart of accounts entry. Displays the account name for reference and reporting purposes. Should match the account_id provided.',
		type: 'string',
	},
	'add-a-comment-request': {
		type: 'object',
		properties: {
			description: {
				description: 'A small description about the item.',
				type: 'string',
			},
		},
	},
	'add-a-comment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'add-credit-note-attachment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'add-credit-note-digital-signature-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	address: { description: 'Billing address for the invoice', type: 'string' },
	amount: {
		description: 'Amount paid for the invoice.',
		type: 'number',
		format: 'double',
	},
	amount_applied: {
		description: 'The total amount applied form the credit note on an invoice.',
		type: 'number',
		format: 'double',
	},
	amount_bcy: { type: 'integer' },
	amount_fcy: { type: 'integer' },
	'apply-credit-note-substatus-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'approve-a-credit-note-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'approve-credit-notes-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	attention: { type: 'string' },
	avatax_exempt_no: {
		description:
			'Exemption certificate number of the customer. Max-length [25]',
		type: 'string',
		'x-node_available_in': ['Avalara Integration'],
		'x-node_unavailable_in': [],
	},
	avatax_tax_code: {
		description:
			'A tax code is a unique label used to group Items (products, services, or charges) together. Refer the [link][2] for more deails. Max-length [25]',
		type: 'string',
		'x-node_available_in': ['Avalara Integration'],
		'x-node_unavailable_in': [],
	},
	avatax_use_code: {
		description:
			'Used to group like customers for exemption purposes. It is a custom value that links customers to a tax rule. Select from Avalara [standard codes][1] or enter a custom code. Max-length [25]',
		type: 'string',
		'x-node_available_in': ['Avalara Integration'],
		'x-node_unavailable_in': [],
	},
	balance: {
		description: 'The unapplied credits.',
		type: 'number',
		format: 'double',
	},
	body: {
		description: 'The body of the email. Max-length [5000]',
		type: 'string',
	},
	'cancel-credit-note-einvoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'cancel-credit-notes-einvoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'cancel-einvoice-credit-note-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	cc_mail_ids: {
		description:
			'The email IDs that have to be copied when the credit note is to be mailed.',
		type: 'array',
		items: { type: 'string' },
	},
	cfdi_reference_type: {
		description:
			'Choose CFDI Reference Type.</br>Allowed values: <code>credit_note</code>, <code>debit_note</code>, <code>return_of_merchandise</code>, <code>substitution_previous_cfdi</code>, <code>transfer_of_goods</code>, <code>invoice_generated_from_order</code>, <code>cfdi_for_advance</code>.',
		type: 'string',
		'x-node_available_in': ['mx'],
		'x-node_unavailable_in': [],
	},
	cfdi_usage: {
		description:
			'Choose CFDI Usage.</br>Allowed values: <code>acquisition_of_merchandise</code>, <code>return_discount_bonus</code>, <code>general_expense</code>, <code>buildings</code>, <code>furniture_office_equipment</code>, <code>transport_equipment</code>, <code>computer_equipmentdye_molds_tools</code>, <code>telephone_communication</code>, <code>satellite_communication</code>, <code>other_machinery_equipment</code>, <code>hospital_expense</code>, <code>medical_expense_disability</code>, <code>funeral_expense</code>, <code>donation</code>, <code>interest_mortage_loans</code>, <code>contribution_sar</code>, <code>medical_expense_insurance_pormium</code>, <code>school_transportation_expense</code>, <code>deposit_saving_account</code>, <code>payment_educational_service</code>, <code>no_tax_effect</code>, <code>payment</code>, <code>payroll</code>.',
		type: 'string',
		'x-node_available_in': ['mx'],
		'x-node_unavailable_in': [],
	},
	city: {
		description: "City of the customer's billing address.",
		type: 'string',
	},
	code: {
		description:
			'Unique code or SKU for the line item. Used for product identification and inventory tracking. Helps distinguish between different variants of the same product.',
		type: 'string',
	},
	comment_id: {
		description: 'The unique ID for the comment generated by the server.',
		type: 'string',
	},
	comment_type: { type: 'string' },
	commented_by: {
		description: 'The name of the user who commented.',
		type: 'string',
	},
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
	contact_person_email: {
		description: 'Email ID of the Contact Person.',
		type: 'string',
	},
	contact_person_id: {
		description: 'Unique ID of the Contact Person.',
		type: 'string',
		format: 'int64',
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
	'convert-credit-note-to-draft-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'convert-to-open-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	country: {
		description: "Country of the customer's billing address.",
		type: 'string',
	},
	'create-a-credit-note-request': {
		required: ['customer_id', 'date', 'line_items'],
		type: 'object',
		properties: {
			customer_id: { $ref: '#/components/schemas/customer_id' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			contact_persons_associated: {
				$ref: '#/components/schemas/contact_persons_associated_payload',
			},
			date: { $ref: '#/components/schemas/date' },
			is_draft: { $ref: '#/components/schemas/is_draft' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			line_items: {
				description:
					'Array of line items for the credit note. Each line item represents a product or service being credited to the customer.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						item_id: { $ref: '#/components/schemas/item_id' },
						invoice_id: { $ref: '#/components/schemas/invoice_id' },
						invoice_item_id: {
							description:
								'Unique identifier of the invoice line item that this credit note line item references. Use this when creating a credit note for a specific invoice line item.',
							type: 'string',
						},
						description: { $ref: '#/components/schemas/description' },
						code: { $ref: '#/components/schemas/code' },
						name: { $ref: '#/components/schemas/name' },
						type: { $ref: '#/components/schemas/type' },
						account_id: { $ref: '#/components/schemas/account_id' },
						account_name: { $ref: '#/components/schemas/account_name' },
						quantity: { $ref: '#/components/schemas/quantity' },
						tax_id: { $ref: '#/components/schemas/tax_id' },
						product_tax_category: {
							$ref: '#/components/schemas/product_tax_category',
						},
						tds_tax_id: { $ref: '#/components/schemas/tds_tax_id' },
						tax_treatment_code: {
							$ref: '#/components/schemas/tax_treatment_code',
						},
						reverse_charge_tax_id: {
							$ref: '#/components/schemas/reverse_charge_tax_id',
						},
						product_type: { $ref: '#/components/schemas/product_type' },
						hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
						sat_item_key_code: {
							$ref: '#/components/schemas/sat_item_key_code',
						},
						unitkey_code: { $ref: '#/components/schemas/unitkey_code' },
						discount_code: { $ref: '#/components/schemas/discount_code' },
						serial_numbers: { $ref: '#/components/schemas/serial_numbers' },
						location_id: { $ref: '#/components/schemas/location_id' },
						project_id: { $ref: '#/components/schemas/project_id' },
						tags: { $ref: '#/components/schemas/tags' },
						line_item_category: {
							$ref: '#/components/schemas/line_item_category',
						},
					},
				},
			},
			location_id: { $ref: '#/components/schemas/location_id' },
			creditnote_number: { $ref: '#/components/schemas/creditnote_number' },
			gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			tax_reg_no: { $ref: '#/components/schemas/tax_reg_no' },
			reason_for_credit_debit_note: {
				$ref: '#/components/schemas/reason_for_credit_debit_note',
			},
			registration_details: {
				$ref: '#/components/schemas/registration_details',
			},
			is_reverse_charge_applied: {
				$ref: '#/components/schemas/is_reverse_charge_applied',
			},
			gst_no: { $ref: '#/components/schemas/gst_no' },
			shipping_gst_no: { $ref: '#/components/schemas/shipping_gst_no' },
			shipping_trader_name: {
				$ref: '#/components/schemas/shipping_trader_name',
			},
			shipping_legal_name: { $ref: '#/components/schemas/shipping_legal_name' },
			shipping_address: {
				type: 'object',
				description:
					'Address of the party the goods are shipped to. Use this field to provide a one-time shipping address that is not saved under the customer. When using this field, do not provide <code>shipping_address_id</code> in the same request.',
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
			cfdi_usage: { $ref: '#/components/schemas/cfdi_usage' },
			cfdi_reference_type: { $ref: '#/components/schemas/cfdi_reference_type' },
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			ignore_auto_number_generation: {
				$ref: '#/components/schemas/ignore_auto_number_generation',
			},
			reference_number: { $ref: '#/components/schemas/reference_number' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			tags: { $ref: '#/components/schemas/tags' },
			notes: { $ref: '#/components/schemas/notes' },
			terms: { $ref: '#/components/schemas/terms' },
			template_id: { $ref: '#/components/schemas/template_id' },
			tax_id: { $ref: '#/components/schemas/tax_id' },
			tax_authority_id: { $ref: '#/components/schemas/tax_authority_id' },
			tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
			avatax_use_code: { $ref: '#/components/schemas/avatax_use_code' },
			avatax_exempt_no: { $ref: '#/components/schemas/avatax_exempt_no' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			avatax_tax_code: { $ref: '#/components/schemas/avatax_tax_code' },
			discount_code: { $ref: '#/components/schemas/discount_code' },
		},
	},
	'create-a-credit-note-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			creditnote: { $ref: '#/components/schemas/creditnote-response' },
		},
	},
	created_time: {
		description: 'Time at which the credit note was created.',
		type: 'string',
	},
	'credit-to-an-invoice-request': {
		required: ['invoice_id', 'amount_applied'],
		type: 'object',
		properties: {
			invoices: {
				description:
					'List of invoices for which the credit note has been raised. Each entry contains <code>invoice_id</code> and <code>amount</code>.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						invoice_id: { $ref: '#/components/schemas/invoice_id' },
						amount_applied: { $ref: '#/components/schemas/amount_applied' },
					},
				},
			},
			invoice_id: { $ref: '#/components/schemas/invoice_id' },
			amount_applied: { $ref: '#/components/schemas/amount_applied' },
		},
	},
	'credit-to-an-invoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	credited_amount: {
		description: 'The total amount that is credited.',
		type: 'number',
		format: 'double',
	},
	'creditnote-response': {
		type: 'object',
		properties: {
			creditnote_id: { $ref: '#/components/schemas/creditnote_id' },
			creditnote_number: { $ref: '#/components/schemas/creditnote_number' },
			date: { $ref: '#/components/schemas/date' },
			is_pre_gst: { $ref: '#/components/schemas/is_pre_gst' },
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			vat_reg_no: { $ref: '#/components/schemas/vat_reg_no' },
			gst_no: { $ref: '#/components/schemas/gst_no' },
			shipping_gst_no: { $ref: '#/components/schemas/shipping_gst_no' },
			shipping_trader_name: {
				$ref: '#/components/schemas/shipping_trader_name',
			},
			shipping_legal_name: { $ref: '#/components/schemas/shipping_legal_name' },
			cfdi_usage: { $ref: '#/components/schemas/cfdi_usage' },
			cfdi_reference_type: { $ref: '#/components/schemas/cfdi_reference_type' },
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
			custom_fields: {
				description: 'Additional fields for the Credit-Notes.',
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
			tags: { $ref: '#/components/schemas/tags_response' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			email: { $ref: '#/components/schemas/email' },
			total: { $ref: '#/components/schemas/total' },
			balance: { $ref: '#/components/schemas/balance' },
			location_id: { $ref: '#/components/schemas/location_id' },
			location_name: { $ref: '#/components/schemas/location_name' },
			line_items: { $ref: '#/components/schemas/line_items' },
			invoices: {
				description:
					'List of invoices for which the credit note has been raised. Each entry contains <code>invoice_id</code> and <code>amount</code>.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						invoice_id: { $ref: '#/components/schemas/invoice_id' },
						invoice_number: { $ref: '#/components/schemas/invoice_number' },
						amount: { $ref: '#/components/schemas/amount' },
					},
				},
			},
			taxes: {
				description: 'Taxes associated wit the subscription.',
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
			currency_code: { $ref: '#/components/schemas/currency_code' },
			currency_symbol: { $ref: '#/components/schemas/currency_symbol' },
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
				},
			},
			created_time: { $ref: '#/components/schemas/created_time' },
			updated_time: { $ref: '#/components/schemas/updated_time' },
			template_id: { $ref: '#/components/schemas/template_id' },
			template_name: { $ref: '#/components/schemas/template_name' },
			notes: { $ref: '#/components/schemas/notes' },
			terms: { $ref: '#/components/schemas/terms' },
		},
	},
	creditnote_id: {
		description: 'Unique ID of the credit note generated by the server.',
		type: 'string',
	},
	creditnote_invoice_id: { type: 'string' },
	creditnote_number: {
		description:
			'Unique credit note number displayed in the interface. Auto-generated with CN prefix unless ignore_auto_number_generation is true. Max-Length [100]',
		type: 'string',
	},
	creditnote_refund_id: { type: 'string' },
	currency_code: {
		description:
			"Customer's currency code. This currency code is used in credit notes.",
		type: 'string',
	},
	currency_id: {
		description:
			'Unique identifier for the currency used in the credit note. Can differ from customer currency if multi-currency is enabled. Retrieve currency IDs from the List Currencies API endpoint in the currency section.',
		type: 'string',
	},
	currency_symbol: {
		description: "Customer's currency symbol.",
		type: 'string',
	},
	custom_fields: {
		description: 'Additional fields for the Credit-Notes.',
		type: 'array',
		items: { type: 'string' },
	},
	customer_id: {
		description:
			'Unique identifier for the customer contact. Retrieve customer IDs from the Get Customers API endpoint in the contacts section. This ID links the credit note to the specific customer record.',
		type: 'string',
	},
	customer_name: {
		description:
			'Name of the customer to whom the credit note is raised. Max-Length [100]',
		type: 'string',
	},
	data_type: { description: 'Data type of the custom field.', type: 'string' },
	date: {
		description:
			'The date on which the credit note is raised. Must be in yyyy-mm-dd format. This date determines the accounting period and affects tax calculations.',
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
	'delete-a-credit-note-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-credit-note-document-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-credit-note-einvoice-status-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-credit-note-refund-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-credit-note-substatus-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-invoices-credited-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	description: {
		description:
			'Detailed description of the line item. Provides additional information about the product or service being credited. Displayed on the credit note document.',
		type: 'string',
	},
	discount: {
		description:
			'Discount applied to the credit note, which can be either a percentage or a flat amount. For percentage discounts, the value should include the % symbol (e.g., 10%). For sample, on Rs.1000, a 10% discount results in Rs.900, while a flat Rs.200 discount results in Rs.800.',
		type: 'number',
		format: 'double',
	},
	discount_code: {
		description:
			'Discount reason code for the discount applied to the credit note or line item. Used for UAE E-Invoicing to specify the basis of a special discount. Maximum length: 200 characters.',
		type: 'string',
		'x-node_available_in': ['uae'],
		'x-node_unavailable_in': [],
	},
	email: { description: 'Email address of the customer.', type: 'string' },
	'email-a-credit-note-request': {
		required: ['to_mail_ids', 'subject', 'body'],
		type: 'object',
		properties: {
			to_mail_ids: { $ref: '#/components/schemas/to_mail_ids' },
			cc_mail_ids: { $ref: '#/components/schemas/cc_mail_ids' },
			subject: { $ref: '#/components/schemas/subject' },
			body: { $ref: '#/components/schemas/body' },
		},
	},
	'email-a-credit-note-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'email-history-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			email_history: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						mailhistory_id: { $ref: '#/components/schemas/mailhistory_id' },
						from: { $ref: '#/components/schemas/from' },
						to_mail_ids: { $ref: '#/components/schemas/to_mail_ids' },
						subject: { $ref: '#/components/schemas/subject' },
						date: { $ref: '#/components/schemas/date' },
					},
				},
			},
		},
	},
	exchange_rate: {
		description:
			'Exchange rate for converting the credit note currency to base currency. Required when currency differs from base currency. Retrieve rates from currency exchange rate APIs.',
		type: 'string',
	},
	fax: { description: "Customer's fax number.", type: 'string' },
	'fetch-credit-note-einvoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'finalize-credit-note-approval-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	first_name: {
		description: 'First Name of the Contact Person.',
		type: 'string',
	},
	from: {
		description: 'The email ID from which the credit note is to be mailed.',
		type: 'string',
	},
	from_account_id: {
		description: 'The account from which credit note is refunded.',
		type: 'string',
	},
	'get-a-credit-note-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			creditnote: {
				type: 'object',
				properties: {
					creditnote_id: { $ref: '#/components/schemas/creditnote_id' },
					creditnote_number: { $ref: '#/components/schemas/creditnote_number' },
					date: { $ref: '#/components/schemas/date' },
					is_pre_gst: { $ref: '#/components/schemas/is_pre_gst' },
					place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
					vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
					vat_reg_no: { $ref: '#/components/schemas/vat_reg_no' },
					gst_no: { $ref: '#/components/schemas/gst_no' },
					shipping_gst_no: { $ref: '#/components/schemas/shipping_gst_no' },
					shipping_trader_name: {
						$ref: '#/components/schemas/shipping_trader_name',
					},
					shipping_legal_name: {
						$ref: '#/components/schemas/shipping_legal_name',
					},
					cfdi_usage: { $ref: '#/components/schemas/cfdi_usage' },
					cfdi_reference_type: {
						$ref: '#/components/schemas/cfdi_reference_type',
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
					custom_fields: {
						description: 'Additional fields for the Credit-Notes.',
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
					reference_number: { $ref: '#/components/schemas/reference_number' },
					email: { $ref: '#/components/schemas/email' },
					total: { $ref: '#/components/schemas/total' },
					balance: { $ref: '#/components/schemas/balance' },
					location_id: { $ref: '#/components/schemas/location_id' },
					location_name: { $ref: '#/components/schemas/location_name' },
					line_items: {
						description: 'Line items of a credit note.',
						type: 'array',
						items: {
							type: 'object',
							properties: {
								item_id: { $ref: '#/components/schemas/item_id' },
								description: { $ref: '#/components/schemas/description' },
								code: { $ref: '#/components/schemas/code' },
								name: { $ref: '#/components/schemas/name' },
								type: { $ref: '#/components/schemas/type' },
								account_id: { $ref: '#/components/schemas/account_id' },
								account_name: { $ref: '#/components/schemas/account_name' },
								quantity: { $ref: '#/components/schemas/quantity' },
								tax_id: { $ref: '#/components/schemas/tax_id' },
								tax_treatment_code: {
									$ref: '#/components/schemas/tax_treatment_code',
								},
								product_type: { $ref: '#/components/schemas/product_type' },
								serial_numbers: { $ref: '#/components/schemas/serial_numbers' },
								location_id: { $ref: '#/components/schemas/location_id' },
								location_name: { $ref: '#/components/schemas/location_name' },
								project_id: { $ref: '#/components/schemas/project_id' },
								project_name: { $ref: '#/components/schemas/project_name' },
								tags: { $ref: '#/components/schemas/tags_response' },
								line_item_category: {
									$ref: '#/components/schemas/line_item_category',
								},
							},
						},
					},
					invoices: {
						description:
							'List of invoices for which the credit note has been raised. Each entry contains <code>invoice_id</code> and <code>amount</code>.',
						type: 'array',
						items: {
							type: 'object',
							properties: {
								invoice_id: { $ref: '#/components/schemas/invoice_id' },
								invoice_number: { $ref: '#/components/schemas/invoice_number' },
								amount: { $ref: '#/components/schemas/amount' },
							},
						},
					},
					taxes: {
						description: 'Taxes associated wit the subscription.',
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
					currency_code: { $ref: '#/components/schemas/currency_code' },
					currency_symbol: { $ref: '#/components/schemas/currency_symbol' },
					created_time: { $ref: '#/components/schemas/created_time' },
					updated_time: { $ref: '#/components/schemas/updated_time' },
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
					template_id: { $ref: '#/components/schemas/template_id' },
					template_name: { $ref: '#/components/schemas/template_name' },
					notes: { $ref: '#/components/schemas/notes' },
					terms: { $ref: '#/components/schemas/terms' },
					tags: { $ref: '#/components/schemas/tags_response' },
				},
			},
		},
	},
	'get-credit-note-custom-fields-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			custom_fields: { type: 'array', items: { type: 'object' } },
		},
	},
	'get-credit-note-document-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-credit-note-einvoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-credit-note-mail-content-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-credit-note-refund-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			creditnote_refund: {
				type: 'object',
				properties: {
					creditnote_refund_id: {
						$ref: '#/components/schemas/creditnote_refund_id',
					},
					creditnote_id: { $ref: '#/components/schemas/creditnote_id' },
					date: { $ref: '#/components/schemas/date' },
					refund_mode: { $ref: '#/components/schemas/refund_mode' },
					payment_form: { $ref: '#/components/schemas/payment_form' },
					reference_number: { $ref: '#/components/schemas/reference_number' },
					amount: { $ref: '#/components/schemas/amount' },
					customer_name: { $ref: '#/components/schemas/customer_name' },
					description: { $ref: '#/components/schemas/description' },
				},
			},
		},
	},
	'get-credit-note-signature-template-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-email-content-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			data: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						body: { description: 'Body of the mail.', type: 'string' },
						error_list: {
							description: 'Array that consists of errors.',
							type: 'array',
							items: { type: 'string' },
						},
						subject: { description: 'Subject of the email.', type: 'string' },
						emailtemplates: {
							description: 'Templates of the email.',
							type: 'array',
							items: {
								type: 'object',
								properties: {
									selected: { type: 'boolean' },
									name: { description: 'Name of the credit', type: 'string' },
									email_template_id: {
										description:
											'Get the email content based on a specific email template. If this param is not inputted, then the content will be based on the email template associated with the customer. If no template is associated with the customer, then default template will be used.',
										type: 'string',
									},
								},
							},
						},
						to_contacts: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									first_name: { type: 'string' },
									selected: { type: 'boolean' },
									phone: { type: 'string' },
									email: {
										description: 'Email address of the customer.',
										type: 'string',
									},
									contact_person_id: { type: 'string' },
									last_name: { type: 'string' },
									salutation: { type: 'string' },
									mobile: { type: 'string' },
								},
							},
						},
						file_name: { type: 'string' },
						from_emails: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									user_name: { type: 'string' },
									selected: { type: 'boolean' },
									email: {
										description: 'Email address of the customer.',
										type: 'string',
									},
								},
							},
						},
						customer_id: {
							description:
								'Customer ID of the customer for whom the credit note is raised.',
							type: 'string',
						},
					},
				},
			},
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
	has_more_page: { type: 'boolean' },
	hsn_or_sac: {
		description: 'Add HSN/SAC code for your goods/services',
		type: 'string',
		'x-node_available_in': ['uae', 'in', 'ke', 'za'],
		'x-node_unavailable_in': [],
	},
	ignore_auto_number_generation: {
		description:
			'Set to true to provide a custom credit note number instead of auto-generated CN prefix. When true, you must specify creditnote_number manually.',
		type: 'boolean',
	},
	index: {
		description:
			'Index of the custom field. It can hold any value from 1 to 10.',
		type: 'integer',
	},
	invoice_id: {
		description: 'Invoice ID of the required invoice.',
		type: 'string',
	},
	invoice_number: {
		description: 'Invoice number of the required invoice.',
		type: 'string',
	},
	is_draft: {
		description:
			'Set to true to create the credit note in draft status. Draft credit notes are not finalized and can be modified before sending to customers.',
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
		'x-node_available_in': ['gcc', 'za', 'uae'],
		'x-node_unavailable_in': [],
	},
	is_tag_mandatory: {
		description: 'Used to check if the tag is mandatory',
		type: 'boolean',
	},
	is_whatsapp_enabled: {
		description:
			'Used to check if WhatsApp communication preference is enabled for the contact person at transaction level.',
		type: 'boolean',
		'x-node_available_in': ['WhatsApp integration'],
	},
	item_custom_fields: {
		description: 'Enter custom field information',
		type: 'array',
		items: { type: 'string' },
	},
	item_id: {
		description:
			'Unique identifier for the item in the line item. Retrieve item IDs from the List Items API endpoint in the items section. Links the line item to a specific product or service.',
		type: 'string',
	},
	item_order: { description: 'Enter order of the item', type: 'integer' },
	label: { description: 'Label of the custom field.', type: 'string' },
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
		description: 'Search credit notes by credit note line item id.',
		type: 'string',
	},
	line_items: {
		description: 'Line items of a credit note.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				item_id: { $ref: '#/components/schemas/item_id' },
				line_item_id: { $ref: '#/components/schemas/line_item_id' },
				account_id: { $ref: '#/components/schemas/account_id' },
				name: { $ref: '#/components/schemas/name' },
				description: { $ref: '#/components/schemas/description' },
				item_order: { $ref: '#/components/schemas/item_order' },
				rate: { $ref: '#/components/schemas/rate' },
				quantity: { $ref: '#/components/schemas/quantity' },
				unit: { $ref: '#/components/schemas/unit' },
				discount: { $ref: '#/components/schemas/discount' },
				discount_code: { $ref: '#/components/schemas/discount_code' },
				tax_id: { $ref: '#/components/schemas/tax_id' },
				tds_tax_id: { $ref: '#/components/schemas/tds_tax_id' },
				tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
				tax_exemption_code: { $ref: '#/components/schemas/tax_exemption_code' },
				tax_treatment_code: { $ref: '#/components/schemas/tax_treatment_code' },
				reverse_charge_tax_id: {
					$ref: '#/components/schemas/reverse_charge_tax_id',
				},
				avatax_use_code: { $ref: '#/components/schemas/avatax_use_code' },
				avatax_tax_code: { $ref: '#/components/schemas/avatax_tax_code' },
				product_type: { $ref: '#/components/schemas/product_type' },
				hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
				sat_item_key_code: { $ref: '#/components/schemas/sat_item_key_code' },
				unitkey_code: { $ref: '#/components/schemas/unitkey_code' },
				item_custom_fields: { $ref: '#/components/schemas/item_custom_fields' },
				location_id: { $ref: '#/components/schemas/location_id' },
				location_name: { $ref: '#/components/schemas/location_name' },
				serial_numbers: { $ref: '#/components/schemas/serial_numbers' },
				project_id: { $ref: '#/components/schemas/project_id' },
				tags: { $ref: '#/components/schemas/tags_response' },
				line_item_category: { $ref: '#/components/schemas/line_item_category' },
			},
		},
	},
	'list-all-credit-notes-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			creditnotes: {
				type: 'object',
				properties: {
					creditnote_id: { $ref: '#/components/schemas/creditnote_id' },
					creditnote_number: { $ref: '#/components/schemas/creditnote_number' },
					status: { $ref: '#/components/schemas/status' },
					reference_number: { $ref: '#/components/schemas/reference_number' },
					date: { $ref: '#/components/schemas/date' },
					total: { $ref: '#/components/schemas/total' },
					balance: { $ref: '#/components/schemas/balance' },
					location_id: { $ref: '#/components/schemas/location_id' },
					location_name: { $ref: '#/components/schemas/location_name' },
					customer_id: { $ref: '#/components/schemas/customer_id' },
					customer_name: { $ref: '#/components/schemas/customer_name' },
					currency_id: { $ref: '#/components/schemas/currency_id' },
					currency_code: { $ref: '#/components/schemas/currency_code' },
					created_time: { $ref: '#/components/schemas/created_time' },
					last_modified_time: { type: 'string' },
					is_emailed: { type: 'boolean' },
				},
			},
		},
	},
	'list-credit-note-comments-and-history-response': {
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
						creditnote_id: { $ref: '#/components/schemas/creditnote_id' },
						description: {
							description: 'A small description about the item.',
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
	'list-credit-note-refunds-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			creditnote_refunds: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						creditnote_refund_id: {
							$ref: '#/components/schemas/creditnote_refund_id',
						},
						creditnote_id: { $ref: '#/components/schemas/creditnote_id' },
						date: { $ref: '#/components/schemas/date' },
						refund_mode: { $ref: '#/components/schemas/refund_mode' },
						payment_form: { $ref: '#/components/schemas/payment_form' },
						reference_number: { $ref: '#/components/schemas/reference_number' },
						creditnote_number: {
							$ref: '#/components/schemas/creditnote_number',
						},
						customer_name: { $ref: '#/components/schemas/customer_name' },
						description: {
							description: 'A small description about the item.',
							type: 'string',
						},
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
	'list-credit-note-template-response': {
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
	'list-credit-notes-einvoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'list-invoices-credited-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			invoices_credited: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						creditnote_id: { $ref: '#/components/schemas/creditnote_id' },
						invoice_id: { $ref: '#/components/schemas/invoice_id' },
						creditnote_invoice_id: {
							$ref: '#/components/schemas/creditnote_invoice_id',
						},
						date: { $ref: '#/components/schemas/date' },
						invoice_number: { $ref: '#/components/schemas/invoice_number' },
						creditnote_number: {
							$ref: '#/components/schemas/creditnote_number',
						},
						credited_amount: { $ref: '#/components/schemas/credited_amount' },
					},
				},
			},
		},
	},
	'list-refunds-of-a-credit-note-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			creditnote_refunds: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						creditnote_refund_id: {
							$ref: '#/components/schemas/creditnote_refund_id',
						},
						creditnote_id: { $ref: '#/components/schemas/creditnote_id' },
						date: { $ref: '#/components/schemas/date' },
						refund_mode: { $ref: '#/components/schemas/refund_mode' },
						payment_form: { $ref: '#/components/schemas/payment_form' },
						reference_number: { $ref: '#/components/schemas/reference_number' },
						creditnote_number: {
							$ref: '#/components/schemas/creditnote_number',
						},
						customer_name: { $ref: '#/components/schemas/customer_name' },
						description: {
							description: 'A small description about the item.',
							type: 'string',
						},
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
			'Unique identifier for the business location associated with the line item. Retrieve location IDs from the List Locations API endpoint in the locations section. Determines tax settings and business rules for this line item.',
		type: 'string',
	},
	location_name: { description: 'Name of the location.', type: 'string' },
	mailhistory_id: { type: 'string' },
	'mark-credit-note-einvoice-cancelled-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'mark-credit-note-einvoice-pushed-request': {
		type: 'object',
		properties: {
			uuid: {
				type: 'string',
				description:
					'Unique identifier of the e-invoice (UUID) on the Invoice Registration Portal.',
			},
			ack_date: {
				type: 'string',
				description:
					'Acknowledgement date returned by the Invoice Registration Portal. Format [yyyy-mm-dd].',
			},
			ack_no: {
				type: 'string',
				description:
					'Acknowledgement number returned by the Invoice Registration Portal.',
			},
			signed_qr_code: {
				type: 'string',
				description:
					'Signed QR code returned by the Invoice Registration Portal.',
			},
			internal_data: {
				type: 'string',
				description: 'Additional internal data associated with the e-invoice.',
			},
		},
	},
	'mark-credit-note-einvoice-pushed-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'mark-credit-note-ready-to-push-response': {
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
			'Name or title of the line item. Describes the product or service being credited. This name is displayed on the credit note document.',
		type: 'string',
	},
	notes: {
		description:
			'Additional notes or comments for the credit note. Displayed on the credit note document for customer reference. Max-length [5000]',
		type: 'string',
	},
	operation_type: { type: 'string' },
	page: { type: 'integer' },
	payment_form: {
		description: 'Mode of Vendor Payment',
		type: 'string',
		'x-node_available_in': ['mx'],
		'x-node_unavailable_in': [],
	},
	per_page: { type: 'integer' },
	phone: { description: 'Phone Number of the Contact Person.', type: 'string' },
	place_of_supply: {
		description:
			'Place where the goods/services are supplied to. (If not given, <code>place of contact</code> given for the contact will be taken)<br/>Supported codes for UAE emirates are : </br>Abu Dhabi - <code>AB</code>,</br>Ajman - <code>AJ</code>,</br>Dubai - <code>DU</code>,</br>Fujairah - <code>FU</code>,</br>Ras al-Khaimah - <code>RA</code>,</br>Sharjah - <code>SH</code>,</br>Umm al-Quwain - <code>UM</code><br/>Supported codes for the GCC countries are : </br>United Arab Emirates - <code>AE</code>,</br>Saudi Arabia - <code>SA</code>,</br>Bahrain - <code>BH</code>,</br>Kuwait - <code>KW</code>,</br>Oman - <code>OM</code>,</br>Qatar - <code>QA</code>.',
		type: 'string',
		'x-node_available_in': ['in', 'gcc', 'uae'],
		'x-node_unavailable_in': [],
	},
	'print-credit-notes-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
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
	product_type: {
		description:
			'Type of product or service for the line item. Standard values: <code>goods</code> or <code>services</code>. For South Africa: <code>service</code>, <code>goods</code>, <code>capital_service</code>, and <code>capital_goods</code>.',
		type: 'string',
	},
	project_id: {
		description:
			'Unique identifier for the project associated with the line item. Links the credit to a specific project for project-based accounting and reporting.',
		type: 'string',
	},
	project_name: { description: 'Name of the project.', type: 'string' },
	'push-credit-note-einvoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'push-credit-note-refund-einvoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'push-credit-notes-einvoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	quantity: {
		description:
			'Number of units being credited for this line item. Must be a positive number. Used to calculate the total amount for the line item.',
		type: 'integer',
		format: 'int32',
	},
	rate: {
		description: 'Rate of the line item.',
		type: 'number',
		format: 'double',
	},
	reason_for_credit_debit_note: {
		description:
			'Reason for issuing the credit note. For UAE Edition, this field is required. Allowed values: <code>tax_treatment_error</code>, <code>supply_cancellation</code>, <code>change_of_tax_treatment</code>, <code>consideration_adjustment</code>, <code>return_of_goods_or_services</code>, <code>volume_discount</code>, <code>others</code>. Max-length [200].',
		type: 'string',
		'x-node_available_in': ['uae'],
		'x-node_unavailable_in': [],
	},
	'recall-credit-note-einvoice-status-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	reference_number: {
		description:
			'Optional reference number for tracking purposes. Can be any custom string or auto-generated. Useful for linking to external systems or internal tracking. Max-Length [100]',
		type: 'string',
	},
	'refund-credit-note-request': {
		type: 'object',
		properties: {
			date: { $ref: '#/components/schemas/date' },
			refund_mode: { $ref: '#/components/schemas/refund_mode' },
			payment_form: { $ref: '#/components/schemas/payment_form' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			amount: { $ref: '#/components/schemas/amount' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			from_account_id: { $ref: '#/components/schemas/from_account_id' },
			description: { $ref: '#/components/schemas/description' },
		},
	},
	'refund-credit-note-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			creditnote_refund: {
				type: 'object',
				properties: {
					creditnote_refund_id: {
						$ref: '#/components/schemas/creditnote_refund_id',
					},
					creditnote_id: { $ref: '#/components/schemas/creditnote_id' },
					date: { $ref: '#/components/schemas/date' },
					refund_mode: { $ref: '#/components/schemas/refund_mode' },
					payment_form: { $ref: '#/components/schemas/payment_form' },
					reference_number: { $ref: '#/components/schemas/reference_number' },
					amount: { $ref: '#/components/schemas/amount' },
					customer_name: { $ref: '#/components/schemas/customer_name' },
					description: { $ref: '#/components/schemas/description' },
				},
			},
		},
	},
	refund_mode: { description: 'The method of refund.', type: 'string' },
	registration_details: {
		description:
			'Registration details of the customer. For UAE Edition, includes buyer identification, tax registration, and legal information used for E-Invoicing.',
		type: 'object',
		properties: {
			company_registration_no: {
				description:
					'Company registration number (Commercial Registration number). Max-length [200].',
				type: 'string',
			},
			indirect_tax_no: {
				description:
					'Tax Identification Number (TIN) of the contact. Used as the VAT registration number for UAE E-Invoicing. Maximum length: 200 characters.',
				type: 'string',
			},
			zone_type: {
				description:
					'Location code type identifying the economic zone or region. Used for UAE E-Invoicing compliance (e.g. <code>TL</code> for Territory of Land). Maximum length: 200 characters.',
				type: 'string',
			},
			einvoice_identifier_label: {
				description:
					'Label for the buyer identifier used in E-Invoicing (Buyer ID label). Allowed values: <code>TL</code>, <code>EID</code>, <code>PAS</code>, <code>CD</code>. Maximum length: 200 characters.',
				type: 'string',
			},
			einvoice_identifier_value: {
				description:
					'Value of the buyer identifier used in E-Invoicing (Buyer ID value). Max-length [200].',
				type: 'string',
			},
			additionalfield1: {
				description:
					'Authority or scheme that issued the buyer identifier (Buyer ID authority, e.g. Department of Economy and Tourism). Max-length [200].',
				type: 'string',
			},
			business_classification_type: {
				description:
					'Type of business classification scheme (e.g. <code>DUNS</code>, <code>GLN</code>). Max-length [200].',
				type: 'string',
			},
			business_classification_value: {
				description:
					'Value of the business classification identifier. Max-length [200].',
				type: 'string',
			},
			trader_name: {
				description: 'Trade name of the contact. Max-length [500].',
				type: 'string',
			},
			legal_name: {
				description: 'Legal registered name of the contact. Max-length [500].',
				type: 'string',
			},
			location_identifier_value: {
				description:
					'Value of the location identifier used in E-Invoicing. Maximum length: 200 characters.',
				type: 'string',
			},
			location_identifier_type: {
				description:
					'Type of the location identifier scheme. Max-length [200].',
				type: 'string',
			},
			electronic_address_value: {
				description:
					'Electronic address (Peppol ID or similar) of the contact used for E-Invoicing routing. Maximum length: 200 characters.',
				type: 'string',
			},
		},
		'x-node_available_in': ['uae'],
		'x-node_unavailable_in': [],
	},
	'reject-credit-note-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	report_name: { type: 'string' },
	reverse_charge_tax_id: {
		description:
			'Tax ID for the reverse charge mechanism applied to the line item. Required for GCC VAT-registered transactions where reverse charge applies.',
		type: 'string',
		'x-node_available_in': ['gcc', 'uae'],
		'x-node_unavailable_in': [],
	},
	sat_item_key_code: {
		description:
			'Add SAT Item Key Code for your goods/services. Download the <a href= http://omawww.sat.gob.mx/tramitesyservicios/Paginas/documentos/catCFDI_V_4_07122022.xls  >CFDI Catalogs.</a>',
		type: 'string',
		'x-node_available_in': ['mx'],
		'x-node_unavailable_in': [],
	},
	serial_numbers: {
		description:
			'Serial numbers of the items being credited. Used for tracking specific units of inventory or equipment. Important for warranty and return tracking.',
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
	sort_column: {
		description:
			'Sort credit notes by following columns customer_name, creditnote_number, balance, total, date and created_time. Allowed Values <code>customer_name</code> <code>creditnote_number</code> <code>balance</code> <code>total</code> <code>date</code> and <code>created_time</code>',
		type: 'string',
	},
	sort_order: { type: 'string' },
	state: {
		description: "State of the customer's billing address.",
		type: 'string',
	},
	status: {
		description:
			'Status of the credit note. This can be <code>open</code>, <code>closed</code> or <code>void</code>.',
		type: 'string',
	},
	street2: { description: 'Second street/address line.', type: 'string' },
	subject: {
		description: 'The subject of the email. Max-length [1000]',
		type: 'string',
	},
	'submit-a-credit-note-for-approval-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'submit-credit-notes-response': {
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
		description: 'Tax amount applied to the subscription.',
		type: 'string',
	},
	tax_authority_id: {
		description:
			'Unique ID of the tax authority. Tax authority depends on the location of the customer. For sample, if the customer is located in NY, then the tax authority is NY tax authority.',
		type: 'string',
		'x-node_available_in': ['us'],
		'x-node_unavailable_in': [],
	},
	tax_exemption_code: {
		description: 'Unique code of the tax exemption.',
		type: 'string',
		'x-node_available_in': ['in', 'us', 'au', 'ca', 'mx'],
		'x-node_unavailable_in': [],
	},
	tax_exemption_id: {
		description: 'Unique ID of the tax exemption.',
		type: 'string',
		'x-node_available_in': ['in', 'us', 'au', 'ca'],
		'x-node_unavailable_in': [],
	},
	tax_id: {
		description:
			'Unique identifier for the tax applied to the line item. Retrieve tax IDs from the List Taxes API endpoint in the taxes section. Determines tax calculations for this specific line item.',
		type: 'string',
	},
	tax_name: { description: 'Unique name for tax.', type: 'string' },
	tax_reg_no: {
		description:
			'Tax Registration Number (TRN) of the customer for the credit note. Required for GCC VAT-registered transactions.',
		type: 'string',
		'x-node_available_in': ['gcc'],
		'x-node_unavailable_in': [],
	},
	tax_treatment: {
		description:
			'VAT treatment for the credit note. Choose whether the contact falls under: <code>vat_registered</code>,<code>vat_not_registered</code>,<code>gcc_vat_not_registered</code>,<code>gcc_vat_registered</code>,<code>non_gcc</code>.</br><b>For UAE Edition:</b> also <code>dz_vat_registered</code>, <code>dz_vat_not_registered</code>, <code>out_of_scope</code>, <code>gcc_non_vat</code>, <code>fz_vat_registered</code>, and <code>fz_vat_not_registered</code>.</br><code>home_country_mexico</code>,<code>border_region_mexico</code>,<code>non_mexico</code> supported only for <b>MX</b>. <br/><b>For Kenya Edition:</b> <code>vat_registered</code> ,<code>vat_not_registered</code> ,<code>non_kenya</code>(A business that is located outside Kenya).<br/><b>For SouthAfrica Edition:</b> <code>vat_registered</code>, <code>vat_not_registered</code>, <code>overseas</code>(A business that is located outside SouthAfrica).',
		type: 'string',
		'x-node_available_in': ['gcc', 'mx', 'ke', 'za', 'uae'],
		'x-node_unavailable_in': [],
	},
	tax_treatment_code: {
		description:
			'Specify a reason for using the out of scope VAT treatment.</br>Supported values for UAE are <code>uae_same_tax_group</code>, <code>uae_reimbursed_expense</code>, <code>uae_others</code>, <code>uae_financial_services</code>, <code>uae_residential_units</code>, <code>uae_bare_land</code>, <code>uae_local_transportation</code>, <code>uae_financial_services_exempt</code>, <code>uae_residential_units_exempt</code>, <code>uae_bare_land_exempt</code>, and <code>uae_local_transportation_exempt</code>.</br> Supported values for Bahrain are <code>bahrain_same_tax_group</code>, <code>bahrain_transfer_of_concern</code>, <code>bahrain_disbursement</code>, <code>bahrain_head_to_branch_transaction</code>, <code>bahrain_warranty_repair_services</code> and <code>bahrain_others</code>.</br>Supported values for Saudi Arabia are <code>ksa_pvt_health</code>, <code>ksa_pvt_edu</code>, <code>ksa_reimbursed_expense</code> and <code>ksa_house_sales</code>.',
		type: 'string',
		'x-node_available_in': ['gcc', 'uae'],
		'x-node_unavailable_in': [],
	},
	tds_tax_id: {
		description: 'Unique ID to denote the TDS tax associated to the creditnote',
		type: 'string',
		'x-node_available_in': ['mx'],
		'x-node_unavailable_in': [],
	},
	template_id: {
		description:
			'Unique identifier for the credit note PDF template. Retrieve template IDs from the List Credit Note Templates API endpoint. Determines the visual layout and branding of the credit note document.',
		type: 'string',
	},
	template_name: {
		description: 'Name of the default template of the creditnote.',
		type: 'string',
	},
	template_type: { type: 'string' },
	terms: {
		description:
			'Terms and conditions displayed on the credit note document. Include payment terms, return policies, or other business conditions. Max-length [10000]',
		type: 'string',
	},
	time: { type: 'string' },
	to_mail_ids: {
		description: 'The email IDs to which the credit note is to be mailed.',
		type: 'array',
		items: { type: 'string' },
	},
	total: {
		description: 'Total credits raised in this credit note.',
		type: 'number',
		format: 'double',
	},
	transaction_id: {
		description:
			'The transaction ID associated with the involved credit notes.',
		type: 'string',
	},
	transaction_type: { type: 'string' },
	type: {
		description:
			'Type of the credit note line item. Numeric value indicating the line item type (e.g., 1 for product, 2 for service). Used for categorization and reporting purposes.',
		type: 'integer',
	},
	unit: {
		description: 'Unit of the line item. E.g: kgs, Nos.',
		type: 'string',
	},
	unitkey_code: {
		description:
			'Unit code for the goods or services.<br/><b>For Mexico Edition:</b> use the SAT unit key code. Download the <a href="http://omawww.sat.gob.mx/tramitesyservicios/Paginas/documentos/catCFDI_V_4_07122022.xls">CFDI Catalogs</a>.<br/><b>For UAE Edition:</b> use the UN/CEFACT unit code (for sample <code>H87</code> for piece, <code>KGM</code> for kilogram). Maximum length: 10 characters.',
		type: 'string',
		maxLength: 10,
		'x-node_available_in': ['uae', 'mx'],
		'x-node_unavailable_in': [],
	},
	'update-a-credit-note-line-items': {
		description: 'Line items of a credit note.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				item_id: { $ref: '#/components/schemas/item_id' },
				line_item_id: { $ref: '#/components/schemas/line_item_id' },
				account_id: { $ref: '#/components/schemas/account_id' },
				name: { $ref: '#/components/schemas/name' },
				description: { $ref: '#/components/schemas/description' },
				item_order: { $ref: '#/components/schemas/item_order' },
				rate: { $ref: '#/components/schemas/rate' },
				quantity: { $ref: '#/components/schemas/quantity' },
				unit: { $ref: '#/components/schemas/unit' },
				discount: { $ref: '#/components/schemas/discount' },
				discount_code: { $ref: '#/components/schemas/discount_code' },
				tax_id: { $ref: '#/components/schemas/tax_id' },
				tds_tax_id: { $ref: '#/components/schemas/tds_tax_id' },
				tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
				tax_exemption_code: { $ref: '#/components/schemas/tax_exemption_code' },
				tax_treatment_code: { $ref: '#/components/schemas/tax_treatment_code' },
				reverse_charge_tax_id: {
					$ref: '#/components/schemas/reverse_charge_tax_id',
				},
				avatax_use_code: { $ref: '#/components/schemas/avatax_use_code' },
				avatax_tax_code: { $ref: '#/components/schemas/avatax_tax_code' },
				product_tax_category: {
					$ref: '#/components/schemas/product_tax_category',
				},
				product_type: { $ref: '#/components/schemas/product_type' },
				hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
				sat_item_key_code: { $ref: '#/components/schemas/sat_item_key_code' },
				unitkey_code: { $ref: '#/components/schemas/unitkey_code' },
				item_custom_fields: { $ref: '#/components/schemas/item_custom_fields' },
				location_id: { $ref: '#/components/schemas/location_id' },
				location_name: { $ref: '#/components/schemas/location_name' },
				serial_numbers: { $ref: '#/components/schemas/serial_numbers' },
				project_id: { $ref: '#/components/schemas/project_id' },
				tags: { $ref: '#/components/schemas/tags_response' },
				line_item_category: { $ref: '#/components/schemas/line_item_category' },
			},
		},
	},
	'update-a-credit-note-request': {
		required: ['customer_id', 'date', 'line_items'],
		type: 'object',
		properties: {
			customer_id: { $ref: '#/components/schemas/customer_id' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			contact_persons_associated: {
				$ref: '#/components/schemas/contact_persons_associated_payload',
			},
			date: { $ref: '#/components/schemas/date' },
			is_draft: { $ref: '#/components/schemas/is_draft' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			line_items: {
				$ref: '#/components/schemas/update-a-credit-note-line-items',
			},
			location_id: { $ref: '#/components/schemas/location_id' },
			creditnote_number: { $ref: '#/components/schemas/creditnote_number' },
			gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			tax_reg_no: { $ref: '#/components/schemas/tax_reg_no' },
			reason_for_credit_debit_note: {
				$ref: '#/components/schemas/reason_for_credit_debit_note',
			},
			registration_details: {
				$ref: '#/components/schemas/registration_details',
			},
			is_reverse_charge_applied: {
				$ref: '#/components/schemas/is_reverse_charge_applied',
			},
			gst_no: { $ref: '#/components/schemas/gst_no' },
			shipping_gst_no: { $ref: '#/components/schemas/shipping_gst_no' },
			shipping_trader_name: {
				$ref: '#/components/schemas/shipping_trader_name',
			},
			shipping_legal_name: { $ref: '#/components/schemas/shipping_legal_name' },
			cfdi_usage: { $ref: '#/components/schemas/cfdi_usage' },
			cfdi_reference_type: { $ref: '#/components/schemas/cfdi_reference_type' },
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			ignore_auto_number_generation: {
				$ref: '#/components/schemas/ignore_auto_number_generation',
			},
			reference_number: { $ref: '#/components/schemas/reference_number' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			tags: { $ref: '#/components/schemas/tags' },
			notes: { $ref: '#/components/schemas/notes' },
			terms: { $ref: '#/components/schemas/terms' },
			template_id: { $ref: '#/components/schemas/template_id' },
			tax_id: { $ref: '#/components/schemas/tax_id' },
			tax_authority_id: { $ref: '#/components/schemas/tax_authority_id' },
			tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
			avatax_use_code: { $ref: '#/components/schemas/avatax_use_code' },
			avatax_exempt_no: { $ref: '#/components/schemas/avatax_exempt_no' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			item_id: { $ref: '#/components/schemas/item_id' },
			account_id: { $ref: '#/components/schemas/account_id' },
			name: { $ref: '#/components/schemas/name' },
			avatax_tax_code: { $ref: '#/components/schemas/avatax_tax_code' },
			description: { $ref: '#/components/schemas/description' },
			unit: { $ref: '#/components/schemas/unit' },
			rate: { $ref: '#/components/schemas/rate' },
			quantity: { $ref: '#/components/schemas/quantity' },
			discount_code: { $ref: '#/components/schemas/discount_code' },
		},
	},
	'update-a-credit-note-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			creditnote: {
				type: 'object',
				properties: {
					creditnote_id: { $ref: '#/components/schemas/creditnote_id' },
					creditnote_number: { $ref: '#/components/schemas/creditnote_number' },
					date: { $ref: '#/components/schemas/date' },
					is_pre_gst: { $ref: '#/components/schemas/is_pre_gst' },
					place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
					vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
					vat_reg_no: { $ref: '#/components/schemas/vat_reg_no' },
					gst_no: { $ref: '#/components/schemas/gst_no' },
					shipping_gst_no: { $ref: '#/components/schemas/shipping_gst_no' },
					shipping_trader_name: {
						$ref: '#/components/schemas/shipping_trader_name',
					},
					shipping_legal_name: {
						$ref: '#/components/schemas/shipping_legal_name',
					},
					cfdi_usage: { $ref: '#/components/schemas/cfdi_usage' },
					cfdi_reference_type: {
						$ref: '#/components/schemas/cfdi_reference_type',
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
					custom_fields: {
						description: 'Additional fields for the Credit-Notes.',
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
					tags: { $ref: '#/components/schemas/tags' },
					reference_number: { $ref: '#/components/schemas/reference_number' },
					email: { $ref: '#/components/schemas/email' },
					total: { $ref: '#/components/schemas/total' },
					balance: { $ref: '#/components/schemas/balance' },
					line_items: {
						description: 'Line items of a credit note.',
						type: 'array',
						items: {
							type: 'object',
							properties: {
								item_id: { $ref: '#/components/schemas/item_id' },
								description: { $ref: '#/components/schemas/description' },
								code: { $ref: '#/components/schemas/code' },
								name: { $ref: '#/components/schemas/name' },
								type: { $ref: '#/components/schemas/type' },
								account_id: { $ref: '#/components/schemas/account_id' },
								account_name: { $ref: '#/components/schemas/account_name' },
								quantity: { $ref: '#/components/schemas/quantity' },
								tax_id: { $ref: '#/components/schemas/tax_id' },
								tax_treatment_code: {
									$ref: '#/components/schemas/tax_treatment_code',
								},
								product_type: { $ref: '#/components/schemas/product_type' },
								serial_numbers: { $ref: '#/components/schemas/serial_numbers' },
								location_id: { $ref: '#/components/schemas/location_id' },
								location_name: { $ref: '#/components/schemas/location_name' },
								project_id: { $ref: '#/components/schemas/project_id' },
								tags: { $ref: '#/components/schemas/tags_response' },
								line_item_category: {
									$ref: '#/components/schemas/line_item_category',
								},
							},
						},
					},
					invoices: {
						description:
							'List of invoices for which the credit note has been raised. Each entry contains <code>invoice_id</code> and <code>amount</code>.',
						type: 'array',
						items: {
							type: 'object',
							properties: {
								invoice_id: { $ref: '#/components/schemas/invoice_id' },
								invoice_number: { $ref: '#/components/schemas/invoice_number' },
								amount: { $ref: '#/components/schemas/amount' },
							},
						},
					},
					taxes: {
						description: 'Taxes associated wit the subscription.',
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
					currency_code: { $ref: '#/components/schemas/currency_code' },
					currency_symbol: { $ref: '#/components/schemas/currency_symbol' },
					location_id: { $ref: '#/components/schemas/location_id' },
					location_name: { $ref: '#/components/schemas/location_name' },
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
					created_time: { $ref: '#/components/schemas/created_time' },
					updated_time: { $ref: '#/components/schemas/updated_time' },
					template_id: { $ref: '#/components/schemas/template_id' },
					template_name: { $ref: '#/components/schemas/template_name' },
					notes: { $ref: '#/components/schemas/notes' },
					terms: { $ref: '#/components/schemas/terms' },
				},
			},
		},
	},
	'update-a-credit-note-template-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'update-billing-address-request': {
		type: 'object',
		properties: {
			address: {
				description: 'Billing address for the invoice',
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
	'update-credit-note-cfdi-status-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'update-credit-note-custom-fields-request': {
		type: 'object',
		properties: {
			custom_fields: {
				type: 'array',
				description: 'Custom fields to update on the credit note.',
				items: {
					type: 'object',
					properties: {
						index: {
							type: 'integer',
							description: 'Index of the custom field, ranging from 1 to 46.',
						},
						value: {
							type: 'string',
							description: 'Value of the custom field.',
						},
					},
				},
			},
		},
	},
	'update-credit-note-custom-fields-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'update-credit-note-document-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'update-credit-note-refund-request': {
		type: 'object',
		properties: {
			date: { $ref: '#/components/schemas/date' },
			refund_mode: { $ref: '#/components/schemas/refund_mode' },
			payment_form: { $ref: '#/components/schemas/payment_form' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			amount: { $ref: '#/components/schemas/amount' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			from_account_id: { $ref: '#/components/schemas/from_account_id' },
			description: { $ref: '#/components/schemas/description' },
		},
	},
	'update-credit-note-refund-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			creditnote_refund: {
				type: 'object',
				properties: {
					creditnote_refund_id: {
						$ref: '#/components/schemas/creditnote_refund_id',
					},
					creditnote_id: { $ref: '#/components/schemas/creditnote_id' },
					date: { $ref: '#/components/schemas/date' },
					refund_mode: { $ref: '#/components/schemas/refund_mode' },
					payment_form: { $ref: '#/components/schemas/payment_form' },
					reference_number: { $ref: '#/components/schemas/reference_number' },
					amount: { $ref: '#/components/schemas/amount' },
					customer_name: { $ref: '#/components/schemas/customer_name' },
					description: { $ref: '#/components/schemas/description' },
				},
			},
		},
	},
	'update-shipping-address-request': {
		type: 'object',
		properties: {
			address: {
				description: 'Billing address for the invoice',
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
	'update-shipping-address-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	updated_time: {
		description: 'Time at which the credit note details were last updated.',
		type: 'string',
	},
	'upload-credit-note-digital-signature-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	value: { description: 'Value of the custom field.', type: 'string' },
	vat_reg_no: { description: 'Enter VAT registration number.', type: 'string' },
	vat_treatment: {
		description:
			'(Optional) VAT treatment for the invoices. VAT treatment denotes the location of the customer, if the customer resides in UK then the VAT treatment is <code>uk</code>. If the customer is in an EU country & VAT registered, you are resides in Northen Ireland and selling Goods then his VAT treatment is <code>eu_vat_registered</code>, if he resides outside of the UK then his VAT treatment is <code>overseas</code> (For Pre Brexit, this can be split as <code>eu_vat_registered</code>, <code>eu_vat_not_registered</code> and <code>non_eu</code>).',
		type: 'string',
		'x-node_available_in': ['uk'],
		'x-node_unavailable_in': [],
	},
	'void-a-credit-note-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	zip: {
		description: "Zip code of the customer's billing address.",
		type: 'string',
	},
} as const satisfies Record<string, JsonValue>;

export const operations = [
	{
		id: 'create_credit_note',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'createCreditNote',
		method: 'POST',
		path: '/creditnotes',
		summary: 'Create a credit note',
		description:
			'Create a new credit note to record credits issued to customers for returned items, overpayments, or adjustments. Supports multi-currency transactions, custom line items, tax calculations, and workflows.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'invoice_id',
				in: 'query',
				required: false,
				description: 'Invoice ID of the required invoice.',
				schema: { type: 'string' },
			},
			{
				name: 'ignore_auto_number_generation',
				in: 'query',
				required: false,
				description:
					'Set to true if you need to provide your own credit note number.',
				schema: { type: 'boolean' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/create-a-credit-note-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/create-a-credit-note-response' },
			},
		],
		scopes: ['ZohoBooks.creditnotes.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_credit_notes',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'listCreditNotes',
		method: 'GET',
		path: '/creditnotes',
		summary: 'List all Credit Notes',
		description:
			'Retrieve a paginated list of credit notes with comprehensive filtering, sorting, and search capabilities. Use query parameters to filter by date, status, amount, customer details, items, taxes, and custom fields.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'creditnote_number',
				in: 'query',
				required: false,
				description:
					'Filter credit notes by specific credit note number. Use this parameter to search for a particular credit note by its unique number. Max-Length [100]',
				schema: { type: 'string' },
			},
			{
				name: 'date',
				in: 'query',
				required: false,
				description:
					'Search credit notes by credit note date. Use yyyy-mm-dd format. Supports variants: <code>date_start</code>, <code>date_end</code>, <code>date_before</code> and <code>date_after</code>. Useful for finding credit notes within date ranges or specific time periods.',
				schema: { type: 'string' },
			},
			{
				name: 'status',
				in: 'query',
				required: false,
				description:
					'Filter credit notes by their current status. Allowed values: <code>open</code>, <code>closed</code>, <code>void</code>, or <code>draft</code>.',
				schema: {
					type: 'string',
					enum: [
						'draft',
						'pending_approval',
						'approved',
						'open',
						'closed',
						'void',
						'rejected',
						'signed',
						'pending_signature',
						'unsigned_all',
						'unsigned_draft',
						'unsigned_sent',
						'unsigned_approved',
					],
				},
			},
			{
				name: 'total',
				in: 'query',
				required: false,
				description:
					'Search credit notes by total amount. Filters credit notes based on the final credit note amount including taxes, discounts, and adjustments. Useful for finding credit notes within specific price ranges or identifying high-value transactions.',
				schema: { type: 'string' },
			},
			{
				name: 'reference_number',
				in: 'query',
				required: false,
				description:
					'Filter credit notes by their reference number. Use this parameter to search for credit notes with a specific reference number. Max-Length [100]',
				schema: { type: 'string' },
			},
			{
				name: 'customer_name',
				in: 'query',
				required: false,
				description:
					'Filter credit notes by customer name. Use this parameter to search for credit notes associated with a specific customer. Max-Length [100]',
				schema: { type: 'string' },
			},
			{
				name: 'item_name',
				in: 'query',
				required: false,
				description:
					'Search credit notes by item name. Filters credit notes based on product or service names in credit note line items. Supports <code>item_name_startswith</code> and <code>item_name_contains</code> variants. Maximum length is 100 characters. Useful for finding credit notes with specific products or services.',
				schema: { type: 'string' },
			},
			{
				name: 'customer_id',
				in: 'query',
				required: false,
				description:
					'Filter credit notes by customer ID. Use this parameter to search for credit notes associated with a specific customer. Retrieve customer IDs from the contacts API.',
				schema: { type: 'string' },
			},
			{
				name: 'item_description',
				in: 'query',
				required: false,
				description:
					'Search credit notes by item description. Filters credit notes based on detailed descriptions of products or services in line items. Supports <code>item_description_startswith</code> and <code>item_description_contains</code> variants. Maximum length is 100 characters. Useful for finding credit notes with specific item descriptions or technical specifications.',
				schema: { type: 'string' },
			},
			{
				name: 'item_id',
				in: 'query',
				required: false,
				description:
					'Filter credit notes by item ID. Use this parameter to search for credit notes containing a specific item. Retrieve item IDs from the items API.',
				schema: { type: 'string' },
			},
			{
				name: 'line_item_id',
				in: 'query',
				required: false,
				description:
					'Filter credit notes by line item ID. Use this parameter to search for credit notes containing a specific line item within the credit note.',
				schema: { type: 'string' },
			},
			{
				name: 'tax_id',
				in: 'query',
				required: false,
				description:
					'Filter credit notes by tax ID. Use this parameter to search for credit notes with a specific tax applied. Retrieve tax IDs from the taxes API.',
				schema: { type: 'string' },
			},
			{
				name: 'filter_by',
				in: 'query',
				required: false,
				description:
					'Filter credit notes by status using predefined status values. Allowed values: <code>Status.All</code>, <code>Status.Open</code>, <code>Status.Draft</code>, <code>Status.Closed</code>, and <code>Status.Void</code>.',
				schema: {
					type: 'string',
					enum: [
						'Status.All',
						'Status.Open',
						'Status.Closed',
						'Status.Void',
						'Status.Draft',
						'Status.Pending',
						'Status.Approved',
						'Status.Locked',
						'Status.AvalaraSyncFailed',
						'Status.TaxAutomationFailed',
						'Status.MyApprovals',
						'Status.Pushed',
						'Status.YetToBePushed',
						'Status.Failed',
						'Status.CancelInitiated',
						'Status.Signed',
						'Status.PendingSignature',
						'Status.UnsignedAll',
						'Status.UnsignedDraft',
						'Status.UnsignedApproved',
						'Status.UnsignedSent',
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
						'Type.CancellationInvoice',
						'Type.DirectReturns',
						'WithOutInvoiceNumber',
						'ExceptionList',
						'MissingAdvancedTrackingDetails',
						'InconsistentList',
						'Type.All',
						'Type.Invoice',
					],
				},
			},
			{
				name: 'search_text',
				in: 'query',
				required: false,
				description:
					'Search credit notes using text search across multiple fields. Searches credit note number, customer name, and reference number. Max-length [100]',
				schema: { type: 'string' },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description:
					'Sort credit notes by specified column. Allowed values: <code>customer_name</code>, <code>creditnote_number</code>, <code>balance</code>, <code>total</code>, <code>date</code>, and <code>created_time</code>.',
				schema: {
					type: 'string',
					enum: [
						'customer_name',
						'creditnote_number',
						'balance',
						'total',
						'date',
						'txn_posting_date',
						'created_time',
						'last_modified_time',
						'cf_(\\w+)',
					],
				},
			},
			{
				name: 'last_modified_time',
				in: 'query',
				required: false,
				description:
					'Search credit notes modified after a specific time. Filters credit notes based on their last modification timestamp. Use YYYY-MM-DDTHH:MM:SS-UTC format. Useful for finding recently updated credit notes or syncing data changes. sample : 2023-11-18T02:02:51-0800, 2025-19-19T02:02:51%2B0800',
				schema: { type: 'string' },
			},
			{
				name: 'location_ids',
				in: 'query',
				required: false,
				description:
					'List of location IDs to filter credit notes by their associated locations. Use this parameter to retrieve credit notes linked to specific business locations. Note: This value is a comma-separated list of numeric location IDs.',
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
					'Number of records per page for pagination. Controls how many credit notes are returned in each page.',
				schema: { type: 'integer', default: 10 },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/list-all-credit-notes-response' },
			},
		],
		scopes: ['ZohoBooks.creditnotes.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_credit_note_using_custom_field',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'updateCreditNoteUsingCustomField',
		method: 'PUT',
		path: '/creditnotes',
		summary: "Update a credit note using a custom field's unique value",
		description:
			"A custom field will have unique values if it's configured to not accept duplicate values. Now, you can use that custom field's value to update a credit note by providing its API name in the X-Unique-Identifier-Key header and its value in the X-Unique-Identifier-Value header. Based on this value, the corresponding credit note will be retrieved and updated. Additionally, there is an optional X-Upsert header. If the X-Upsert header is true and the custom field's unique value is not found in any of the existing credit notes, a new credit note will be created if the necessary payload details are available",
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
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
			schema: { $ref: '#/components/schemas/update-a-credit-note-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-a-credit-note-response' },
			},
		],
		scopes: ['ZohoBooks.creditnotes.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_credit_note',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'updateCreditNote',
		method: 'PUT',
		path: '/creditnotes/{creditnote_id}',
		summary: 'Update a credit note',
		description: 'Details of an existing creditnote.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the credit note.',
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
				name: 'ignore_auto_number_generation',
				in: 'query',
				required: false,
				description:
					'Set to true if you need to provide your own credit note number.',
				schema: { type: 'boolean' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/update-a-credit-note-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-a-credit-note-response' },
			},
		],
		scopes: ['ZohoBooks.creditnotes.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_credit_note',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'getCreditNote',
		method: 'GET',
		path: '/creditnotes/{creditnote_id}',
		summary: 'Get a credit note',
		description: 'Details of an existing creditnote.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the credit note.',
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
					'Export credit note pdf with default print option. Allowed Values: <code>true</code>, <code>false</code>, <code>on</code> and <code>off</code>',
				schema: { type: 'boolean' },
			},
			{
				name: 'accept',
				in: 'query',
				required: false,
				description:
					'You can get credit note details as json/pdf/html. Default format is html. Allowed Values: <code>json</code>, <code>pdf</code> and <code>html</code>',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/get-a-credit-note-response' },
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
		scopes: ['ZohoBooks.creditnotes.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_credit_note',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'deleteCreditNote',
		method: 'DELETE',
		path: '/creditnotes/{creditnote_id}',
		summary: 'Delete a credit note',
		description: 'Delete an existing credit note.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the credit note.',
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
				schema: { $ref: '#/components/schemas/delete-a-credit-note-response' },
			},
		],
		scopes: ['ZohoBooks.creditnotes.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'email_credit_note',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'emailCreditNote',
		method: 'POST',
		path: '/creditnotes/{creditnote_id}/email',
		summary: 'Email a credit note',
		description: 'Email a credit note.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the credit note.',
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
				name: 'customer_id',
				in: 'query',
				required: false,
				description:
					'Customer ID of the customer for whom the credit note is raised.',
				schema: { type: 'string' },
			},
			{
				name: 'attachments',
				in: 'query',
				required: false,
				description: 'The files to be attached with the email.',
				schema: { type: 'string', format: 'binary' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/email-a-credit-note-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/email-a-credit-note-response' },
			},
		],
		scopes: ['ZohoBooks.creditnotes.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_credit_note_email',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'getCreditNoteEmail',
		method: 'GET',
		path: '/creditnotes/{creditnote_id}/email',
		summary: 'Get email content',
		description: 'Get email content of a credit note.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the credit note.',
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
				name: 'email_template_id',
				in: 'query',
				required: false,
				description:
					'Get the email content based on a specific email template. If this param is not inputted, then the content will be based on the email template associated with the customer. If no template is associated with the customer, then default template will be used.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/get-email-content-response' },
			},
		],
		scopes: ['ZohoBooks.creditnotes.READ'],
		riskLevel: 'read',
	},
	{
		id: 'mark_credit_note_void',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'markCreditNoteVoid',
		method: 'POST',
		path: '/creditnotes/{creditnote_id}/status/void',
		summary: 'Void a Credit Note',
		description: 'Mark the credit note as Void.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the credit note.',
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
				schema: { $ref: '#/components/schemas/void-a-credit-note-response' },
			},
		],
		scopes: ['ZohoBooks.creditnotes.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'mark_credit_note_draft',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'markCreditNoteDraft',
		method: 'POST',
		path: '/creditnotes/{creditnote_id}/status/draft',
		summary: 'Convert Credit Note to Draft.',
		description: 'Convert a voided credit note to Draft.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the credit note.',
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
					$ref: '#/components/schemas/convert-credit-note-to-draft-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_credit_note_open',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'markCreditNoteOpen',
		method: 'POST',
		path: '/creditnotes/{creditnote_id}/status/open',
		summary: 'Convert to Open',
		description: 'Convert a credit note in Draft status to Open.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the credit note.',
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
				schema: { $ref: '#/components/schemas/convert-to-open-response' },
			},
		],
		scopes: ['ZohoBooks.creditnotes.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'submit_credit_note',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'submitCreditNote',
		method: 'POST',
		path: '/creditnotes/{creditnote_id}/submit',
		summary: 'Submit a credit note for approval',
		description: 'Submit an estimate for approval.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the credit note.',
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
					$ref: '#/components/schemas/submit-a-credit-note-for-approval-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'approve_credit_note',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'approveCreditNote',
		method: 'POST',
		path: '/creditnotes/{creditnote_id}/approve',
		summary: 'Approve a credit note.',
		description: 'Approve a credit note.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the credit note.',
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
				schema: { $ref: '#/components/schemas/approve-a-credit-note-response' },
			},
		],
		scopes: ['ZohoBooks.creditnotes.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_credit_note_email_history',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'getCreditNoteEmailHistory',
		method: 'GET',
		path: '/creditnotes/{creditnote_id}/emailhistory',
		summary: 'Email history',
		description: 'Get email history of a credit code.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the credit note.',
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
				schema: { $ref: '#/components/schemas/email-history-response' },
			},
		],
		scopes: ['ZohoBooks.creditnotes.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_credit_note_billing_address',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'updateCreditNoteBillingAddress',
		method: 'PUT',
		path: '/creditnotes/{creditnote_id}/address/billing',
		summary: 'Update billing address',
		description:
			'Updates the billing address for an existing credit note alone.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the credit note.',
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
		scopes: ['ZohoBooks.creditnotes.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_credit_note_shipping_address',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'updateCreditNoteShippingAddress',
		method: 'PUT',
		path: '/creditnotes/{creditnote_id}/address/shipping',
		summary: 'Update Shipping address',
		description:
			'Updates the shipping address for an existing credit note alone.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the credit note.',
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
		scopes: ['ZohoBooks.creditnotes.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_credit_note_templates',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'listCreditNoteTemplates',
		method: 'GET',
		path: '/creditnotes/templates',
		summary: 'List credit note template',
		description: 'Get all credit note pdf templates.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
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
					$ref: '#/components/schemas/list-credit-note-template-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_credit_note_template',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'updateCreditNoteTemplate',
		method: 'PUT',
		path: '/creditnotes/{creditnote_id}/templates/{template_id}',
		summary: 'Update a credit note template',
		description: 'Update the pdf template associated with the credit note.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the credit note.',
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
				name: 'template_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the credit note template.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-a-credit-note-template-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_invoices_of_credit_note',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'listInvoicesOfCreditNote',
		method: 'GET',
		path: '/creditnotes/{creditnote_id}/invoices',
		summary: 'List invoices credited',
		description: 'List invoices to which the credit note is applied.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the credit note.',
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
					$ref: '#/components/schemas/list-invoices-credited-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.READ'],
		riskLevel: 'read',
	},
	{
		id: 'apply_credit_note_to_invoice',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'applyCreditNoteToInvoice',
		method: 'POST',
		path: '/creditnotes/{creditnote_id}/invoices',
		summary: 'Credit to an invoice',
		description: 'Apply credit note to existing invoices.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the credit note.',
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
			schema: { $ref: '#/components/schemas/credit-to-an-invoice-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/credit-to-an-invoice-response' },
			},
		],
		scopes: ['ZohoBooks.creditnotes.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_invoice_of_credit_note',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'deleteInvoiceOfCreditNote',
		method: 'DELETE',
		path: '/creditnotes/{creditnote_id}/invoices/{creditnote_invoice_id}',
		summary: 'Delete invoices credited',
		description: 'Delete the credits applied to an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the credit note.',
				schema: { type: 'string' },
			},
			{
				name: 'creditnote_invoice_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the credit note invoice.',
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
					$ref: '#/components/schemas/delete-invoices-credited-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'list_credit_note_comments',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'listCreditNoteComments',
		method: 'GET',
		path: '/creditnotes/{creditnote_id}/comments',
		summary: 'List credit note comments & history',
		description: 'Get history and comments of a credit note.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the credit note.',
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
					$ref: '#/components/schemas/list-credit-note-comments-and-history-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.READ'],
		riskLevel: 'read',
	},
	{
		id: 'add_credit_note_comment',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'addCreditNoteComment',
		method: 'POST',
		path: '/creditnotes/{creditnote_id}/comments',
		summary: 'Add a comment',
		description: 'Add a comment to an existing credit note.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the credit note.',
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
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/add-a-comment-response' },
			},
		],
		scopes: ['ZohoBooks.creditnotes.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_credit_note_comment',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'deleteCreditNoteComment',
		method: 'DELETE',
		path: '/creditnotes/{creditnote_id}/comments/{comment_id}',
		summary: 'Delete a Comment',
		description: 'Delete a credit note comment.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the credit note.',
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
		scopes: ['ZohoBooks.creditnotes.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'list_credit_note_refunds_of_all_credit_notes',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'listCreditNoteRefundsOfAllCreditNotes',
		method: 'GET',
		path: '/creditnotes/refunds',
		summary: 'List credit note refunds',
		description: 'List all refunds with pagination.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
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
				description:
					'Customer ID of the customer for whom the credit note is raised.',
				schema: { type: 'string' },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description:
					'Sort refunds list. Allowed Values: <code>refund_mode</code>, <code>reference_number</code>, <code>date</code>, <code>creditnote_number</code>, <code>customer_name</code>, <code>amount_bcy</code> and <code>amount_fcy</code>',
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
					'Number of records per page for pagination. Controls how many credit notes are returned in each page.',
				schema: { type: 'integer', default: 10 },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/list-credit-note-refunds-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.READ'],
		riskLevel: 'read',
	},
	{
		id: 'list_credit_note_refunds_of_a_credit_note',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'listCreditNoteRefundsOfACreditNote',
		method: 'GET',
		path: '/creditnotes/{creditnote_id}/refunds',
		summary: 'List refunds of a credit note',
		description: 'List all refunds of an existing credit note.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the credit note.',
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
					'Number of records per page for pagination. Controls how many credit notes are returned in each page.',
				schema: { type: 'integer', default: 10 },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/list-refunds-of-a-credit-note-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.READ'],
		riskLevel: 'read',
	},
	{
		id: 'create_credit_note_refund',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'createCreditNoteRefund',
		method: 'POST',
		path: '/creditnotes/{creditnote_id}/refunds',
		summary: 'Refund credit note',
		description: 'Refund credit note amount.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the credit note.',
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
			schema: { $ref: '#/components/schemas/refund-credit-note-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/refund-credit-note-response' },
			},
		],
		scopes: ['ZohoBooks.creditnotes.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_credit_note_refund',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'getCreditNoteRefund',
		method: 'GET',
		path: '/creditnotes/{creditnote_id}/refunds/{creditnote_refund_id}',
		summary: 'Get credit note refund',
		description: 'Get refund of a particular credit note.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the credit note.',
				schema: { type: 'string' },
			},
			{
				name: 'creditnote_refund_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the credit note refund.',
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
					$ref: '#/components/schemas/get-credit-note-refund-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_credit_note_refund',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'updateCreditNoteRefund',
		method: 'PUT',
		path: '/creditnotes/{creditnote_id}/refunds/{creditnote_refund_id}',
		summary: 'Update credit note refund',
		description: 'Update the refunded transaction.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the credit note.',
				schema: { type: 'string' },
			},
			{
				name: 'creditnote_refund_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the credit note refund.',
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
				$ref: '#/components/schemas/update-credit-note-refund-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-credit-note-refund-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.UPDATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'delete_credit_note_refund',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'deleteCreditNoteRefund',
		method: 'DELETE',
		path: '/creditnotes/{creditnote_id}/refunds/{creditnote_refund_id}',
		summary: 'Delete credit note refund',
		description: 'Delete a credit note refund.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the credit note.',
				schema: { type: 'string' },
			},
			{
				name: 'creditnote_refund_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the credit note refund.',
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
					$ref: '#/components/schemas/delete-credit-note-refund-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'approve_credit_notes',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'approveCreditNotes',
		method: 'POST',
		path: '/creditnotes/approve',
		summary: 'Approve credit notes',
		description:
			'Approve multiple credit notes in a single request. Use this to approve credit notes that are pending approval in bulk.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'creditnote_ids',
				in: 'query',
				required: true,
				description:
					'Comma-separated IDs of the credit notes to approve. Note: This value is a set of numeric characters separated by comma.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/approve-credit-notes-response' },
			},
		],
		scopes: ['ZohoBooks.creditnotes.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'submit_credit_notes',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'submitCreditNotes',
		method: 'POST',
		path: '/creditnotes/submit',
		summary: 'Submit credit notes for approval',
		description:
			'Submit multiple credit notes for approval in a single request. Use this to send credit notes for approval in bulk.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'creditnote_ids',
				in: 'query',
				required: true,
				description:
					'Comma-separated IDs of the credit notes to submit for approval. Note: This value is a set of numeric characters separated by comma.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/submit-credit-notes-response' },
			},
		],
		scopes: ['ZohoBooks.creditnotes.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'finalize_credit_note_approval',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'finalizeCreditNoteApproval',
		method: 'POST',
		path: '/creditnotes/{creditnote_id}/approve/final',
		summary: 'Finalize approval of a credit note',
		description:
			'Give the final approval for a credit note in a multi-level approval flow. Use this when a credit note requires a final approval step after the initial approval.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the credit note. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/finalize-credit-note-approval-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'reject_credit_note',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'rejectCreditNote',
		method: 'POST',
		path: '/creditnotes/{creditnote_id}/reject',
		summary: 'Reject a credit note',
		description:
			'Reject a credit note that is pending approval. Optionally provide a reason for the rejection.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the credit note. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'reason',
				in: 'query',
				required: false,
				description: 'Reason for rejecting the credit note.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/reject-credit-note-response' },
			},
		],
		scopes: ['ZohoBooks.creditnotes.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_credit_note_signature_template',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'getCreditNoteSignatureTemplate',
		method: 'GET',
		path: '/creditnotes/{creditnote_id}/dsign/template',
		summary: 'Get the digital signature template of a credit note',
		description:
			'Retrieve the digital signature template details associated with a credit note.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the credit note. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/get-credit-note-signature-template-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.READ'],
		riskLevel: 'read',
	},
	{
		id: 'print_credit_notes',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'printCreditNotes',
		method: 'GET',
		path: '/creditnotes/print',
		summary: 'Print credit notes',
		description:
			'Export the selected credit notes as a single PDF file. Use this to print or download one or more credit notes together.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_ids',
				in: 'query',
				required: true,
				description:
					'Comma-separated IDs of the credit notes to print. A maximum of 200 credit notes can be printed at a time. Note: This value is a set of numeric characters separated by comma.',
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
				schema: { $ref: '#/components/schemas/print-credit-notes-response' },
			},
			{
				status: '200',
				contentType: 'application/pdf',
				schema: { type: 'string', format: 'binary' },
			},
		],
		scopes: ['ZohoBooks.creditnotes.READ'],
		riskLevel: 'read',
	},
	{
		id: 'add_credit_note_attachment',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'addCreditNoteAttachment',
		method: 'POST',
		path: '/creditnotes/{creditnote_id}/attachment',
		summary: 'Add attachment to a credit note',
		description: 'Attach a file to a credit note.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the credit note. Note: This value is a set of numeric characters.',
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
				name: 'can_send_in_mail',
				in: 'query',
				required: false,
				description:
					'True to send the attachment with the credit note when it is emailed.',
				schema: { type: 'boolean' },
			},
			{
				name: 'attachment',
				in: 'query',
				required: false,
				description:
					'The file to be attached. Allowed extensions: <code>gif</code>, <code>png</code>, <code>jpeg</code>, <code>jpg</code>, <code>bmp</code> and <code>pdf</code>.',
				schema: { type: 'string', format: 'binary' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/add-credit-note-attachment-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_credit_note_document',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'getCreditNoteDocument',
		method: 'GET',
		path: '/creditnotes/{creditnote_id}/documents/{document_id}',
		summary: 'Retrieve a credit note document',
		description:
			'Retrieve a specific document attached to a credit note. The document can be returned as JSON metadata or as the raw file (PDF or image).',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the credit note. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'document_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the document. Note: This value is a set of numeric characters.',
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
				name: 'responseformat',
				in: 'query',
				required: false,
				description:
					'Format in which the document is returned. Allowed values: <code>json</code>, <code>pdf</code>.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/get-credit-note-document-response',
				},
			},
			{
				status: '200',
				contentType: 'application/pdf',
				schema: { type: 'string', format: 'binary' },
			},
			{
				status: '200',
				contentType: 'image/jpeg',
				schema: { type: 'string', format: 'binary' },
			},
			{
				status: '200',
				contentType: 'image/png',
				schema: { type: 'string', format: 'binary' },
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_credit_note_document',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'updateCreditNoteDocument',
		method: 'PUT',
		path: '/creditnotes/{creditnote_id}/documents/{document_id}',
		summary: 'Update a credit note document',
		description: 'Update a document attached to a credit note.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the credit note. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'document_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the document. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/update-credit-note-document-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_credit_note_document',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'deleteCreditNoteDocument',
		method: 'DELETE',
		path: '/creditnotes/{creditnote_id}/documents/{document_id}',
		summary: 'Delete a credit note document',
		description: 'Delete a document attached to a credit note.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the credit note. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'document_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the document. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/delete-credit-note-document-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_credit_note_custom_fields',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'getCreditNoteCustomFields',
		method: 'GET',
		path: '/creditnotes/{creditnote_id}/customfields',
		summary: 'Get credit note custom fields',
		description: 'Retrieve the custom fields configured for a credit note.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the credit note. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/get-credit-note-custom-fields-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_credit_note_custom_fields',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'updateCreditNoteCustomFields',
		method: 'POST',
		path: '/creditnotes/{creditnote_id}/customfields',
		summary: 'Update credit note custom fields',
		description:
			'Update the values of the custom fields associated with a credit note.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the credit note. Note: This value is a set of numeric characters.',
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
				$ref: '#/components/schemas/update-credit-note-custom-fields-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-credit-note-custom-fields-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_credit_note_mail_content',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'getCreditNoteMailContent',
		method: 'GET',
		path: '/creditnotes/{creditnote_id}/mailcontent',
		summary: 'Get credit note email content',
		description:
			'Retrieve the default email content (subject and body) used when emailing a credit note.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the credit note. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/get-credit-note-mail-content-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.READ'],
		riskLevel: 'read',
	},
	{
		id: 'add_credit_note_digital_signature',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'addCreditNoteDigitalSignature',
		method: 'POST',
		path: '/creditnotes/{creditnote_id}/dsign',
		summary: 'Add a digital signature to a credit note',
		description: 'Send a credit note for digital signature.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the credit note. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/add-credit-note-digital-signature-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'upload_credit_note_digital_signature',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'uploadCreditNoteDigitalSignature',
		method: 'POST',
		path: '/creditnotes/{creditnote_id}/dsign/upload',
		summary: 'Upload a signed credit note',
		description: 'Upload the digitally signed copy of a credit note.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the credit note. Note: This value is a set of numeric characters.',
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
				description: 'The signed file to be uploaded.',
				schema: { type: 'string', format: 'binary' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/upload-credit-note-digital-signature-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_credit_note_refund_by_id',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'getCreditNoteRefundById',
		method: 'GET',
		path: '/creditnotes/refunds/{refund_id}',
		summary: 'Get a credit note refund',
		description:
			'Retrieve the details of a specific credit note refund using its refund ID.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'refund_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the credit note refund. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/get-credit-note-refund-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.READ'],
		riskLevel: 'read',
	},
	{
		id: 'apply_credit_note_substatus',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'applyCreditNoteSubstatus',
		method: 'POST',
		path: '/creditnotes/{creditnote_id}/substatus/{substatus_id}',
		summary: 'Apply a sub-status to a credit note',
		description: 'Apply a custom sub-status to a credit note.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the credit note. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'substatus_id',
				in: 'path',
				required: true,
				description: 'Identifier of the sub-status to apply or remove.',
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
					$ref: '#/components/schemas/apply-credit-note-substatus-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_credit_note_substatus',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'deleteCreditNoteSubstatus',
		method: 'DELETE',
		path: '/creditnotes/{creditnote_id}/substatus/{substatus_id}',
		summary: 'Delete a credit note sub-status',
		description: 'Remove a custom sub-status applied to a credit note.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the credit note. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'substatus_id',
				in: 'path',
				required: true,
				description: 'Identifier of the sub-status to apply or remove.',
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
					$ref: '#/components/schemas/delete-credit-note-substatus-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'list_credit_notes_einvoice',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'listCreditNotesEinvoice',
		method: 'GET',
		path: '/creditnotes/einvoice',
		summary: 'List credit note e-invoices',
		description: 'Retrieve the e-invoice details of credit notes.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'creditnote_ids',
				in: 'query',
				required: true,
				description:
					'Comma-separated credit note IDs. Required by the API, though the Zoho OpenAPI leaves it out.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/list-credit-notes-einvoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.READ'],
		riskLevel: 'read',
	},
	{
		id: 'push_credit_notes_einvoice',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'pushCreditNotesEinvoice',
		method: 'POST',
		path: '/creditnotes/einvoice/push',
		summary: 'Push credit note e-invoices',
		description:
			'Push the e-invoices of multiple credit notes to the Invoice Registration Portal (IRP) for India or the Peppol network for UAE.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
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
					$ref: '#/components/schemas/push-credit-notes-einvoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'cancel_credit_notes_einvoice',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'cancelCreditNotesEinvoice',
		method: 'POST',
		path: '/creditnotes/einvoice/cancel',
		summary: 'Cancel credit note e-invoices',
		description:
			'Cancel the e-invoices of multiple credit notes on the Invoice Registration Portal (IRP).',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
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
					$ref: '#/components/schemas/cancel-credit-notes-einvoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_credit_note_einvoice',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'getCreditNoteEinvoice',
		method: 'GET',
		path: '/creditnotes/{creditnote_id}/einvoice',
		summary: 'Get a credit note e-invoice',
		description:
			'Retrieve the e-invoice JSON data generated for a credit note.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the credit note. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/get-credit-note-einvoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.READ'],
		riskLevel: 'read',
	},
	{
		id: 'push_credit_note_einvoice',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'pushCreditNoteEinvoice',
		method: 'POST',
		path: '/creditnotes/{creditnote_id}/einvoice/push',
		summary: 'Push a credit note e-invoice',
		description:
			'Push the e-invoice of a credit note to the Invoice Registration Portal (IRP) for India or the Peppol network for UAE.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the credit note. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/push-credit-note-einvoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'cancel_credit_note_einvoice',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'cancelCreditNoteEinvoice',
		method: 'POST',
		path: '/creditnotes/{creditnote_id}/einvoice/cancel',
		summary: 'Cancel a credit note e-invoice',
		description:
			'Cancel the e-invoice of a credit note on the Invoice Registration Portal (IRP).',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the credit note. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/cancel-credit-note-einvoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'fetch_credit_note_einvoice',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'fetchCreditNoteEinvoice',
		method: 'POST',
		path: '/creditnotes/{creditnote_id}/einvoice/fetch',
		summary: 'Fetch a credit note e-invoice',
		description:
			'Fetch the latest e-invoice status of a credit note from the Invoice Registration Portal (IRP).',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the credit note. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/fetch-credit-note-einvoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_credit_note_einvoice_status',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'deleteCreditNoteEinvoiceStatus',
		method: 'DELETE',
		path: '/creditnotes/{creditnote_id}/einvoice/status',
		summary: 'Delete a credit note e-invoice status',
		description: 'Delete the locally stored e-invoice status of a credit note.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the credit note. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/delete-credit-note-einvoice-status-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'mark_credit_note_einvoice_pushed',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'markCreditNoteEinvoicePushed',
		method: 'POST',
		path: '/creditnotes/{creditnote_id}/einvoice/status/push',
		summary: 'Mark a credit note e-invoice as manually pushed',
		description:
			'Record that a credit note e-invoice was pushed to the Invoice Registration Portal (IRP) outside of Zoho Books, by supplying the acknowledgement details.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the credit note. Note: This value is a set of numeric characters.',
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
				$ref: '#/components/schemas/mark-credit-note-einvoice-pushed-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/mark-credit-note-einvoice-pushed-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_credit_note_einvoice_cancelled',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'markCreditNoteEinvoiceCancelled',
		method: 'POST',
		path: '/creditnotes/{creditnote_id}/einvoice/status/cancel',
		summary: 'Mark a credit note e-invoice as cancelled',
		description:
			'Record that a credit note e-invoice was cancelled on the Invoice Registration Portal (IRP) outside of Zoho Books.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the credit note. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/mark-credit-note-einvoice-cancelled-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'recall_credit_note_einvoice_status',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'recallCreditNoteEinvoiceStatus',
		method: 'POST',
		path: '/creditnotes/{creditnote_id}/einvoice/status/recall',
		summary: 'Recall a credit note e-invoice status',
		description:
			'Revert the manually updated e-invoice status of a credit note.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the credit note. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/recall-credit-note-einvoice-status-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'push_credit_note_refund_einvoice',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'pushCreditNoteRefundEinvoice',
		method: 'POST',
		path: '/creditnotes/{creditnote_id}/refunds/einvoice/push',
		summary: 'Push a credit note refund e-invoice',
		description:
			'Push the e-invoice of a credit note refund to the Invoice Registration Portal (IRP).',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the credit note. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/push-credit-note-refund-einvoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'mark_credit_note_ready_to_push',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'markCreditNoteReadyToPush',
		method: 'POST',
		path: '/creditnotes/{creditnote_id}/status/readytopush',
		summary: 'Mark a credit note as ready to push',
		description:
			'Mark a credit note e-invoice as ready to be pushed to the Invoice Registration Portal (IRP).',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the credit note. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/mark-credit-note-ready-to-push-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_credit_note_cfdi_status',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'updateCreditNoteCfdiStatus',
		method: 'POST',
		path: '/creditnotes/{creditnote_id}/cfdi/status',
		summary: 'Update a credit note CFDI status',
		description:
			'Update the CFDI (Comprobante Fiscal Digital por Internet) status of a credit note for the Mexico edition.',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the credit note. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/update-credit-note-cfdi-status-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'cancel_einvoice_credit_note',
		group: 'creditNotes',
		groupSlug: 'credit-notes',
		name: 'cancelEinvoiceCreditNote',
		method: 'POST',
		path: '/einvoices/creditnotes/{creditnote_id}/cancel',
		summary: 'Cancel an e-invoice credit note',
		description:
			'Cancel the e-invoice generated for a credit note on the Invoice Registration Portal (IRP).',
		docsUrl: 'https://www.zoho.com/books/api/v3/credit-notes/',
		parameters: [
			{
				name: 'creditnote_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the credit note. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/cancel-einvoice-credit-note-response',
				},
			},
		],
		scopes: ['ZohoBooks.creditnotes.CREATE'],
		riskLevel: 'destructive',
	},
] as const satisfies readonly ZohoBooksOperationDefinition[];
