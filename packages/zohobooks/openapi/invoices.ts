import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas = {
	ach_payment_initiated: {
		type: 'boolean',
		description:
			'Boolean value to check if ACH payment has been initiated for the invoice.',
	},
	'add-attachment-to-an-invoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'add-comment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'add-invoice-digital-signature-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'add-invoice-document-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'add-invoice-online-payment-bank-account-request': {
		type: 'object',
		properties: {
			invoice_ids: {
				type: 'string',
				description:
					'Comma-separated IDs of the invoices for which the online payment is processed.',
			},
			payment_amount: {
				type: 'number',
				description: 'Amount to be charged from the bank account.',
			},
			gateway: {
				type: 'string',
				description:
					'Payment gateway used to process the bank account payment.',
			},
			first_name: {
				type: 'string',
				description: 'First name of the bank account holder.',
			},
			last_name: {
				type: 'string',
				description: 'Last name of the bank account holder.',
			},
			account_number: {
				type: 'string',
				description: 'Bank account number from which the payment is collected.',
			},
			routing_number: {
				type: 'string',
				description: 'Routing number of the bank account.',
			},
			account_type: {
				type: 'string',
				description: 'Type of the bank account.',
			},
			bank_name: { type: 'string', description: 'Name of the bank.' },
			enable_autobilling: {
				type: 'boolean',
				description:
					'Whether to enable automatic billing using this bank account.',
			},
			account_id: {
				type: 'string',
				description: 'Unique identifier of the saved bank account.',
			},
			autobill_client_status: {
				type: 'string',
				description:
					'Auto-bill consent status of the client for this bank account.',
			},
		},
	},
	'add-invoice-online-payment-bank-account-response': {
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
	address: { description: 'Billing address for the invoice', type: 'string' },
	adjustment: {
		description:
			'Additional charge or credit amount applied to the invoice total. This can be used for rounding adjustments, handling fees, or any other one-time charges/credits. Positive values add to the total, negative values reduce the total. This amount is applied after tax calculation and affects the final invoice total.',
		type: 'number',
		format: 'double',
	},
	adjustment_description: {
		description:
			'Text description explaining the reason for the adjustment amount. This description appears on the invoice document to explain why the adjustment was applied. Common sample include "Rounding adjustment", "Handling fee", "Early payment discount", or "Late payment fee". This helps customers understand the purpose of the adjustment.',
		type: 'string',
	},
	allow_partial_payments: {
		description:
			'Boolean flag that determines whether customers can make partial payments against this invoice. When <code>true</code>, customers can pay less than the full invoice amount, and the invoice will remain open with a remaining balance. When <code>false</code>, customers must pay the full amount to complete the invoice. This setting affects payment processing and invoice status tracking.',
		type: 'boolean',
	},
	amount_applied: {
		description: 'The applied amount to the creditnote',
		type: 'number',
		format: 'float',
	},
	applied_filter: {
		description: 'The filer applied for sorting',
		type: 'string',
	},
	'apply-credits-request': {
		required: ['invoice_payments', 'apply_creditnotes'],
		type: 'object',
		properties: {
			invoice_payments: { $ref: '#/components/schemas/invoice_payments' },
			apply_creditnotes: { $ref: '#/components/schemas/apply_creditnotes' },
		},
	},
	'apply-credits-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'apply-invoice-substatus-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'apply-pricebook-to-invoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	apply_creditnotes: {
		description: 'List of credit notes to be applied to the invoice.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				creditnote_id: { $ref: '#/components/schemas/creditnote_id' },
				amount_applied: { $ref: '#/components/schemas/amount_applied' },
			},
		},
	},
	'approve-an-invoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'approve-invoices-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	attach_pdf: { type: 'boolean' },
	attachment_name: { type: 'string', description: 'Name of the attachment' },
	automatic_tax_enabled: {
		description:
			'Boolean flag that enables automated sales tax calculation for the invoice or line item. Set to <code>true</code> together with <code>tax_selection_mode</code> as <code>automated</code> on create or update. For manual tax, omit this field or set <code>tax_selection_mode</code> to <code>manual</code>. When this field and <code>tax_selection_mode</code> are both omitted on API create, the invoice defaults to manual tax mode.',
		type: 'boolean',
		'x-node_available_in': ['us'],
		'x-node_unavailable_in': [],
	},
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
	balance: { description: 'The unpaid amount', type: 'string' },
	bank_account_id: {
		description:
			'Unique identifier of the bank account used for payment. Used for UAE E-Invoicing to specify the expected payment method bank account. Note: This value is a set of numeric characters.',
		type: 'string',
		'x-node_available_in': ['uae'],
		'x-node_unavailable_in': [],
	},
	bcc_mails: { type: 'array', items: { type: 'string' } },
	bcc_mails_str: { type: 'string' },
	bcy_rate: {
		description:
			"Base currency rate for the line item. This is the rate in the organization's base currency before any currency conversion. Used for multi-currency scenarios where the invoice currency differs from the base currency.",
		type: 'number',
		format: 'float',
	},
	bill_id: {
		type: 'string',
		description:
			'Unique identifier of the specific bill line item to be converted to an invoice line item. This allows you to convert individual line items from a bill rather than the entire bill, providing granular control over bill-to-invoice conversion. Note: This value is a set of numeric characters.',
	},
	bill_item_id: {
		type: 'string',
		description:
			'Unique identifier of the specific bill line item to be converted to an invoice line item. This allows you to convert individual line items from a bill rather than the entire bill, providing granular control over bill-to-invoice conversion. Note: This value is a set of numeric characters.',
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
	billing_address_id: {
		description:
			"Unique identifier of the billing address to be used for this invoice. Use the `billing_address_id` returned by the Addresses API for the same customer and organization. This address appears on the invoice document and is used for billing purposes. If omitted, the customer's default billing address will be used. Note: This value is a set of numeric characters.",
		type: 'string',
	},
	body: { description: 'The body of the mail', type: 'string' },
	'bulk-export-invoices-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'bulk-invoice-reminder-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			info: {
				type: 'object',
				properties: {
					email_success_info: {
						type: 'object',
						properties: {
							message: { type: 'string' },
							sent_count: { type: 'integer' },
						},
					},
					email_errors_info: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								message: { type: 'string' },
								ids: { type: 'array', items: { type: 'string' } },
							},
						},
					},
					code: { type: 'integer' },
				},
			},
		},
	},
	'bulk-print-invoices-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	can_send_in_mail: {
		type: 'boolean',
		description: 'Boolean to check if the invoice can be sent in mail.',
	},
	'cancel-einvoice-invoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'cancel-invoice-einvoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'cancel-invoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'cancel-invoices-einvoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'cancel-scheduled-invoice-email-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'cancel-write-off-response': {
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
	cc_mails_str: { type: 'string' },
	cfdi_reference_type: {
		description:
			'Choose CFDI Reference Type. Allowed values:</br><code>return_of_merchandise</code>, <code>substitution_previous_cfdi</code>, <code>transfer_of_goods</code>, <code>invoice_generated_from_order</code>, <code>cfdi_for_advance</code>.',
		type: 'string',
		'x-node_available_in': ['mx'],
		'x-node_unavailable_in': [],
	},
	cfdi_usage: {
		description:
			'Choose CFDI Usage. Allowed values:</br><code>acquisition_of_merchandise</code>, <code>return_discount_bonus</code>, <code>general_expense</code>, <code>buildings</code>, <code>furniture_office_equipment</code>, <code>transport_equipment</code>, <code>computer_equipmentdye_molds_tools</code>, <code>telephone_communication</code>, <code>satellite_communication</code>, <code>other_machinery_equipment</code>, <code>hospital_expense</code>, <code>medical_expense_disability</code>, <code>funeral_expense</code>, <code>donation</code>, <code>interest_mortage_loans</code>, <code>contribution_sar</code>, <code>medical_expense_insurance_pormium</code>, <code>school_transportation_expense</code>, <code>deposit_saving_account</code>, <code>payment_educational_service</code>, <code>no_tax_effect</code>, <code>payment</code>, <code>payroll</code>.',
		type: 'string',
		'x-node_available_in': ['mx'],
		'x-node_unavailable_in': [],
	},
	city: {
		description: "City of the customer's billing address.",
		type: 'string',
	},
	client_viewed_time: {
		type: 'string',
		description: 'The time at which the invoice was viewed by the client.',
	},
	comment_id: {
		description:
			'ID of the comment. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	comment_type: { type: 'string' },
	commented_by: { type: 'string' },
	commented_by_id: {
		type: 'string',
		description:
			'Unique identifier of the user who commented. Note: This value is a set of numeric characters.',
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
	configured: {
		description:
			'Boolean check to see if a payment gateway has been configured',
		type: 'boolean',
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
	contact_persons: {
		description:
			"Array of contact person IDs associated with the specified customer. Provide the IDs of contact persons (from the Contacts/Contact Persons API) who should receive invoice communications (e.g., emails) for this invoice. Each ID must belong to the same customer and organization as the invoice. If omitted, the customer's primary contact may be used.",
		type: 'array',
		items: { type: 'string' },
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
	contacts: {
		description: 'Contacts for whom email or snail mail has to be sent.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				contact_id: {
					description:
						'ID of the Customer and mail will be sent to invoice associated contact persons. Note: This value is a set of numeric characters.',
					type: 'string',
				},
				email: { description: 'the boolean check for Email', type: 'boolean' },
				snail_mail: {
					description: 'the boolean check for snail mail',
					type: 'boolean',
				},
			},
		},
	},
	country: {
		description: "Country of the customer's billing address.",
		type: 'string',
	},
	'create-a-comment-request': {
		type: 'object',
		properties: {
			description: {
				description: 'The description of the comment.',
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
	'create-an-instant-invoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			invoice: {
				type: 'object',
				properties: {
					invoice_id: { $ref: '#/components/schemas/invoice_id' },
					ach_payment_initiated: {
						$ref: '#/components/schemas/ach_payment_initiated',
					},
					invoice_number: { $ref: '#/components/schemas/invoice_number' },
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
					cfdi_usage: { $ref: '#/components/schemas/cfdi_usage' },
					cfdi_reference_type: {
						$ref: '#/components/schemas/cfdi_reference_type',
					},
					reference_invoice_id: {
						description:
							'Associate the reference invoice. Note: This value is a set of numeric characters.',
						type: 'string',
						'x-node_available_in': ['mx'],
						'x-node_unavailable_in': [],
					},
					vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
					tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
					is_reverse_charge_applied: {
						$ref: '#/components/schemas/is_reverse_charge_applied',
					},
					vat_reg_no: { $ref: '#/components/schemas/vat_reg_no' },
					date: { $ref: '#/components/schemas/date' },
					status: { $ref: '#/components/schemas/status' },
					payment_terms: { $ref: '#/components/schemas/payment_terms' },
					payment_terms_label: {
						$ref: '#/components/schemas/payment_terms_label',
					},
					due_date: { $ref: '#/components/schemas/due_date' },
					payment_expected_date: {
						$ref: '#/components/schemas/payment_expected_date',
					},
					last_payment_date: { $ref: '#/components/schemas/last_payment_date' },
					reference_number: { $ref: '#/components/schemas/reference_number' },
					customer_id: { $ref: '#/components/schemas/customer_id' },
					customer_name: { $ref: '#/components/schemas/customer_name' },
					contact_persons_associated: {
						$ref: '#/components/schemas/contact_persons_associated',
					},
					currency_id: { $ref: '#/components/schemas/currency_id' },
					currency_code: { $ref: '#/components/schemas/currency_code' },
					exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
					discount: { $ref: '#/components/schemas/discount' },
					is_discount_before_tax: {
						$ref: '#/components/schemas/is_discount_before_tax',
					},
					discount_type: { $ref: '#/components/schemas/discount_type' },
					is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
					recurring_invoice_id: {
						$ref: '#/components/schemas/recurring_invoice_id',
					},
					is_viewed_by_client: {
						$ref: '#/components/schemas/is_viewed_by_client',
					},
					has_attachment: { $ref: '#/components/schemas/has_attachment' },
					client_viewed_time: {
						$ref: '#/components/schemas/client_viewed_time',
					},
					line_items: {
						type: 'array',
						description: 'List of line items in the invoice.',
						items: {
							type: 'object',
							properties: {
								line_item_id: { $ref: '#/components/schemas/line_item_id' },
								item_id: { $ref: '#/components/schemas/item_id' },
								project_id: { $ref: '#/components/schemas/project_id' },
								sat_item_key_code: {
									$ref: '#/components/schemas/sat_item_key_code',
								},
								unitkey_code: { $ref: '#/components/schemas/unitkey_code' },
								project_name: { $ref: '#/components/schemas/project_name' },
								time_entry_ids: { $ref: '#/components/schemas/time_entry_ids' },
								location_id: { $ref: '#/components/schemas/location_id' },
								location_name: { $ref: '#/components/schemas/location_name' },
								item_type: { $ref: '#/components/schemas/item_type' },
								product_type: { $ref: '#/components/schemas/product_type' },
								expense_id: { $ref: '#/components/schemas/expense_id' },
								expense_receipt_name: {
									$ref: '#/components/schemas/expense_receipt_name',
								},
								name: { $ref: '#/components/schemas/name' },
								description: { $ref: '#/components/schemas/description' },
								item_order: { $ref: '#/components/schemas/item_order' },
								bcy_rate: { $ref: '#/components/schemas/bcy_rate' },
								rate: { $ref: '#/components/schemas/rate' },
								quantity: { $ref: '#/components/schemas/quantity' },
								unit: { $ref: '#/components/schemas/unit' },
								discount_amount: {
									$ref: '#/components/schemas/discount_amount',
								},
								discount: { $ref: '#/components/schemas/discount' },
								tags: { $ref: '#/components/schemas/tags_response' },
								tax_id: { $ref: '#/components/schemas/tax_id' },
								tds_tax_id: { $ref: '#/components/schemas/tds_tax_id' },
								tax_name: { $ref: '#/components/schemas/tax_name' },
								tax_type: { $ref: '#/components/schemas/tax_type' },
								tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
								tax_treatment_code: {
									$ref: '#/components/schemas/tax_treatment_code',
								},
								item_total: { $ref: '#/components/schemas/item_total' },
								line_item_category: {
									$ref: '#/components/schemas/line_item_category',
								},
							},
						},
					},
					shipping_charge: { $ref: '#/components/schemas/shipping_charge' },
					adjustment: { $ref: '#/components/schemas/adjustment' },
					adjustment_description: {
						$ref: '#/components/schemas/adjustment_description',
					},
					sub_total: { $ref: '#/components/schemas/sub_total' },
					tax_total: { $ref: '#/components/schemas/tax_total' },
					total: { $ref: '#/components/schemas/total' },
					taxes: { $ref: '#/components/schemas/taxes' },
					payment_reminder_enabled: {
						$ref: '#/components/schemas/payment_reminder_enabled',
					},
					payment_made: { $ref: '#/components/schemas/payment_made' },
					credits_applied: { $ref: '#/components/schemas/credits_applied' },
					tax_amount_withheld: {
						$ref: '#/components/schemas/tax_amount_withheld',
					},
					balance: { $ref: '#/components/schemas/balance' },
					write_off_amount: { $ref: '#/components/schemas/write_off_amount' },
					allow_partial_payments: {
						$ref: '#/components/schemas/allow_partial_payments',
					},
					price_precision: { $ref: '#/components/schemas/price_precision' },
					payment_options: { $ref: '#/components/schemas/payment_options' },
					is_emailed: { $ref: '#/components/schemas/is_emailed' },
					location_id: { $ref: '#/components/schemas/location_id' },
					location_name: { $ref: '#/components/schemas/location_name' },
					reminders_sent: { $ref: '#/components/schemas/reminders_sent' },
					last_reminder_sent_date: {
						$ref: '#/components/schemas/last_reminder_sent_date',
					},
					billing_address: { $ref: '#/components/schemas/billing_address' },
					shipping_address: {
						$ref: '#/components/schemas/update-shipping-address-request',
					},
					notes: { $ref: '#/components/schemas/notes' },
					terms: { $ref: '#/components/schemas/terms' },
					custom_fields: { $ref: '#/components/schemas/custom_fields' },
					tags: { $ref: '#/components/schemas/tags_response' },
					template_id: { $ref: '#/components/schemas/template_id' },
					template_name: { $ref: '#/components/schemas/template_name' },
					created_time: { $ref: '#/components/schemas/created_time' },
					last_modified_time: {
						$ref: '#/components/schemas/last_modified_time',
					},
					attachment_name: { $ref: '#/components/schemas/attachment_name' },
					can_send_in_mail: { $ref: '#/components/schemas/can_send_in_mail' },
					salesperson_id: { $ref: '#/components/schemas/salesperson_id' },
					salesperson_name: { $ref: '#/components/schemas/salesperson_name' },
					salesorder_id: { $ref: '#/components/schemas/salesorder_id' },
					salesorder_number: { $ref: '#/components/schemas/salesorder_number' },
					salesorders: {
						type: 'object',
						properties: {
							salesorder_id: { $ref: '#/components/schemas/salesorder_id' },
							salesorder_number: {
								$ref: '#/components/schemas/salesorder_number',
							},
							reference_number: {
								$ref: '#/components/schemas/reference_number',
							},
							crm_custom_reference_id: {
								$ref: '#/components/schemas/crm_custom_reference_id',
							},
							salesorder_order_status: {
								$ref: '#/components/schemas/salesorder_order_status',
							},
							total: { $ref: '#/components/schemas/total' },
							total_formatted: { $ref: '#/components/schemas/total_formatted' },
							sub_total: { $ref: '#/components/schemas/sub_total' },
							sub_total_formatted: {
								$ref: '#/components/schemas/sub_total_formatted',
							},
							date: { $ref: '#/components/schemas/date' },
							shipment_date: { $ref: '#/components/schemas/shipment_date' },
						},
					},
					invoice_url: { $ref: '#/components/schemas/invoice_url' },
				},
			},
		},
	},
	'create-an-invoice-request': {
		required: ['customer_id', 'line_items'],
		type: 'object',
		properties: {
			customer_id: { $ref: '#/components/schemas/customer_id' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			contact_persons: { $ref: '#/components/schemas/contact_persons' },
			contact_persons_associated: {
				$ref: '#/components/schemas/contact_persons_associated_payload',
			},
			invoice_number: { $ref: '#/components/schemas/invoice_number' },
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			is_reverse_charge_applied: {
				$ref: '#/components/schemas/is_reverse_charge_applied',
			},
			bank_account_id: { $ref: '#/components/schemas/bank_account_id' },
			discount_code: { $ref: '#/components/schemas/discount_code' },
			registration_details: {
				$ref: '#/components/schemas/registration_details',
			},
			tax_reg_no: { $ref: '#/components/schemas/tax_reg_no' },
			gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
			gst_no: { $ref: '#/components/schemas/gst_no' },
			shipping_gst_no: { $ref: '#/components/schemas/shipping_gst_no' },
			shipping_trader_name: {
				$ref: '#/components/schemas/shipping_trader_name',
			},
			shipping_legal_name: { $ref: '#/components/schemas/shipping_legal_name' },
			cfdi_usage: { $ref: '#/components/schemas/cfdi_usage' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			template_id: { $ref: '#/components/schemas/template_id' },
			date: { $ref: '#/components/schemas/date' },
			payment_terms: { $ref: '#/components/schemas/payment_terms' },
			payment_terms_label: { $ref: '#/components/schemas/payment_terms_label' },
			due_date: { $ref: '#/components/schemas/due_date' },
			discount: { $ref: '#/components/schemas/discount' },
			is_discount_before_tax: {
				$ref: '#/components/schemas/is_discount_before_tax',
			},
			discount_type: { $ref: '#/components/schemas/discount_type' },
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			location_id: { $ref: '#/components/schemas/location_id' },
			recurring_invoice_id: {
				$ref: '#/components/schemas/recurring_invoice_id',
			},
			invoiced_estimate_id: {
				$ref: '#/components/schemas/invoiced_estimate_id',
			},
			salesperson_name: { $ref: '#/components/schemas/salesperson_name' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			tags: { $ref: '#/components/schemas/tags' },
			send: { $ref: '#/components/schemas/send' },
			line_items: {
				type: 'array',
				description: 'List of line items in the invoice.',
				items: {
					type: 'object',
					required: ['item_id'],
					properties: {
						item_id: { $ref: '#/components/schemas/item_id' },
						project_id: { $ref: '#/components/schemas/project_id' },
						time_entry_ids: { $ref: '#/components/schemas/time_entry_ids' },
						product_type: { $ref: '#/components/schemas/product_type' },
						hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
						sat_item_key_code: {
							$ref: '#/components/schemas/sat_item_key_code',
						},
						unitkey_code: { $ref: '#/components/schemas/unitkey_code' },
						location_id: { $ref: '#/components/schemas/location_id' },
						expense_id: { $ref: '#/components/schemas/expense_id' },
						bill_id: { $ref: '#/components/schemas/bill_id' },
						bill_item_id: { $ref: '#/components/schemas/bill_item_id' },
						expense_receipt_name: {
							$ref: '#/components/schemas/expense_receipt_name',
						},
						name: { $ref: '#/components/schemas/name' },
						description: { $ref: '#/components/schemas/description' },
						item_order: { $ref: '#/components/schemas/item_order' },
						bcy_rate: { $ref: '#/components/schemas/bcy_rate' },
						rate: { $ref: '#/components/schemas/rate' },
						quantity: { $ref: '#/components/schemas/quantity' },
						unit: { $ref: '#/components/schemas/unit' },
						discount_amount: { $ref: '#/components/schemas/discount_amount' },
						discount: { $ref: '#/components/schemas/discount' },
						tags: { $ref: '#/components/schemas/tags' },
						tax_id: { $ref: '#/components/schemas/tax_id' },
						tds_tax_id: { $ref: '#/components/schemas/tds_tax_id' },
						tax_name: { $ref: '#/components/schemas/tax_name' },
						tax_type: { $ref: '#/components/schemas/tax_type' },
						tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
						tax_treatment_code: {
							$ref: '#/components/schemas/tax_treatment_code',
						},
						reverse_charge_tax_id: {
							$ref: '#/components/schemas/reverse_charge_tax_id',
						},
						discount_code: { $ref: '#/components/schemas/discount_code' },
						salesorder_item_id: {
							$ref: '#/components/schemas/salesorder_item_id',
						},
						line_item_category: {
							$ref: '#/components/schemas/line_item_category',
						},
						tax_selection_mode: {
							$ref: '#/components/schemas/tax_selection_mode',
						},
						automatic_tax_enabled: {
							$ref: '#/components/schemas/automatic_tax_enabled',
						},
						tax_category_code: {
							$ref: '#/components/schemas/tax_category_code',
						},
						product_tax_category: {
							$ref: '#/components/schemas/product_tax_category',
						},
					},
				},
			},
			payment_options: { $ref: '#/components/schemas/payment_options' },
			allow_partial_payments: {
				$ref: '#/components/schemas/allow_partial_payments',
			},
			custom_body: { $ref: '#/components/schemas/custom_body' },
			custom_subject: { $ref: '#/components/schemas/custom_subject' },
			notes: { $ref: '#/components/schemas/notes' },
			terms: { $ref: '#/components/schemas/terms' },
			shipping_charge: { $ref: '#/components/schemas/shipping_charge' },
			shipping_charge_tax_category: {
				$ref: '#/components/schemas/shipping_charge_tax_category',
			},
			adjustment: { $ref: '#/components/schemas/adjustment' },
			adjustment_description: {
				$ref: '#/components/schemas/adjustment_description',
			},
			reason: { $ref: '#/components/schemas/reason' },
			tax_authority_id: { $ref: '#/components/schemas/tax_authority_id' },
			tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
			billing_address_id: { $ref: '#/components/schemas/billing_address_id' },
			shipping_address_id: { $ref: '#/components/schemas/shipping_address_id' },
			shipping_address: {
				description:
					'Address of the party the goods are shipped to. Use this field to provide a one-time shipping address that is not saved under the customer. When using this field, do not provide <code>shipping_address_id</code> in the same request.',
				$ref: '#/components/schemas/shipping_address',
			},
			automatic_tax_enabled: {
				$ref: '#/components/schemas/automatic_tax_enabled',
			},
			tax_selection_mode: { $ref: '#/components/schemas/tax_selection_mode' },
			avatax_use_code: { $ref: '#/components/schemas/avatax_use_code' },
			avatax_exempt_no: { $ref: '#/components/schemas/avatax_exempt_no' },
			tax_id: { $ref: '#/components/schemas/tax_id' },
			expense_id: { $ref: '#/components/schemas/expense_id' },
			salesorder_item_id: { $ref: '#/components/schemas/salesorder_item_id' },
			avatax_tax_code: { $ref: '#/components/schemas/avatax_tax_code' },
			time_entry_ids: { $ref: '#/components/schemas/time_entry_ids' },
			batch_payments: {
				description:
					'Array of batch payment details to be processed with the invoice. Each payment includes payment mode, amount, and account information for automated payment processing.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						payment_mode: {
							description: 'Mode of payment for this batch payment entry.',
							type: 'string',
						},
						amount: {
							description: 'Payment amount for this batch payment entry.',
							type: 'string',
						},
						account_id: {
							description:
								'Account ID where the payment will be recorded. Note: This value is a set of numeric characters.',
							type: 'string',
						},
					},
				},
			},
		},
	},
	'create-an-invoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			invoice: { $ref: '#/components/schemas/invoice-response' },
		},
	},
	'create-invoices-from-estimates-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'create-invoices-from-projects-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	created_time: {
		description: 'The time of creation of the invoices',
		type: 'string',
	},
	credited_date: { description: 'The date of credit', type: 'string' },
	creditnote_id: {
		description:
			'ID of the creditnote. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	creditnotes_invoice_id: {
		description:
			'The creditnotes invoice id. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	creditnotes_number: { description: 'The creditnotes Number', type: 'string' },
	credits_applied: {
		description: 'The credits applied',
		type: 'number',
		format: 'float',
	},
	crm_custom_reference_id: {
		type: 'string',
		description:
			'Custom reference ID to link the invoice with a record in your CRM system. Note: This value is a set of numeric characters.',
	},
	currency_code: {
		description: 'The currency code in which the invoice is created.',
		type: 'string',
	},
	currency_id: {
		description:
			"Unique identifier of the currency in which the invoice will be created for the customer. Use the `currency_id` returned by the Currencies API for the same organization. This sets the currency for all monetary amounts on the invoice; if it differs from the organization's base currency, an appropriate `exchange_rate` may be required. Note: This value is a set of numeric characters.",
		type: 'string',
	},
	custom_body: { type: 'string', description: 'The custom body of the email.' },
	custom_fields: {
		description: 'Custom fields for an invoice.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				customfield_id: { $ref: '#/components/schemas/customfield_id' },
				value: { $ref: '#/components/schemas/value' },
			},
		},
	},
	custom_subject: {
		type: 'string',
		description: 'The custom subject of the email.',
	},
	customer_id: {
		description:
			'Unique identifier of the customer in the current organization for whom this invoice is created. Required when creating an invoice. Use the `customer_id` returned by the get Customers API. Must belong to the organization specified by the `organization_id` parameter. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	customer_name: {
		description: 'The name of the customer. Max-length [100]',
		type: 'string',
	},
	customfield_id: {
		description:
			'Unique identifier of the Custom Field. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	date: {
		description:
			'The date on which the invoice is created. Use the format yyyy-mm-dd (e.g., 2013-11-17). This date appears on the invoice document and is used for accounting purposes. When searching invoices, supports variants: <code>date_start</code>, <code>date_end</code>, <code>date_before</code> and <code>date_after</code>.',
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
	'delete-an-invoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-applied-credit-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-invoice-document-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-invoice-einvoice-status-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-invoice-line-item-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-invoice-substatus-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-invoices-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-the-expense-receipt-response': {
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
		description:
			'Detailed description of the line item providing additional information about the product or service. This description appears on the invoice document and helps customers understand what they are being charged for. Maximum length is 2000 characters.',
		type: 'string',
	},
	'disable-payment-reminder-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	discount: {
		description:
			'Discount applied to the invoice, which can be either a percentage or a flat amount. For percentage discounts, the value should include the % symbol (e.g., 10%). For sample, on Rs.1000, a 10% discount results in Rs.900, while a flat Rs.200 discount results in Rs.800.',
		type: 'number',
		format: 'float',
	},
	discount_amount: {
		description:
			'Fixed discount amount applied to this specific line item. This is a monetary value that reduces the line item total. The discount is applied after the rate x quantity calculation but before tax calculation. Can be used for line-item specific discounts or promotions.',
		type: 'number',
		format: 'float',
	},
	discount_code: {
		description:
			'Discount reason code for the entity-level discount. Used for UAE E-Invoicing to specify the basis of a special discount applied to the invoice. Max-length [200].',
		type: 'string',
		'x-node_available_in': ['uae'],
		'x-node_unavailable_in': [],
	},
	discount_type: {
		description:
			'Specifies the scope of discount application. <code>entity_level</code> applies the discount to the entire invoice total. <code>item_level</code> applies the discount to individual line items. This determines how the discount amount is distributed across the invoice items.',
		type: 'string',
	},
	documents: {
		type: 'string',
		description: 'Documents associated with the invoice.',
	},
	due_date: {
		description:
			'The date by which payment is due for the invoice. Use the format yyyy-mm-dd (e.g., 2013-12-03). This date is typically calculated as invoice date + payment_terms days, but can be overridden with a custom date. When searching invoices, supports variants: <code>due_date_start</code>, <code>due_date_end</code>, <code>due_date_before</code> and <code>due_date_after</code>.',
		type: 'string',
	},
	due_days: {
		description:
			'Specifies the number of day in which the invoice would become overdue',
		type: 'string',
	},
	email: { description: 'Search contacts by email id. Max-length [100]' },
	'email-an-invoice-request': {
		required: ['to_mail_ids'],
		type: 'object',
		properties: {
			send_from_org_email_id: {
				$ref: '#/components/schemas/send_from_org_email_id',
			},
			from_address_id: { $ref: '#/components/schemas/from_address_id' },
			to_mail_ids: { $ref: '#/components/schemas/to_mail_ids' },
			cc_mail_ids: { $ref: '#/components/schemas/cc_mail_ids' },
			subject: { $ref: '#/components/schemas/subject' },
			body: { $ref: '#/components/schemas/body' },
		},
	},
	'email-an-invoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'email-invoices-request': {
		type: 'object',
		properties: { contacts: { $ref: '#/components/schemas/contacts' } },
	},
	'email-invoices-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	emailtemplate_documents: { type: 'array', items: { type: 'string' } },
	'enable-payment-reminder-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	entity_id: {
		type: 'string',
		description:
			'Unique identifier of the entity associated with the invoice. Note: This value is a set of numeric characters.',
	},
	error_list: { type: 'array', items: { type: 'string' } },
	exchange_rate: {
		description:
			"Exchange rate used to convert amounts from the invoice currency to the organization's base currency. Required when the invoice currency differs from the organization's base currency. For sample, if base currency is USD and invoice currency is EUR, set the EUR to USD exchange rate (e.g., 1.18). Default value is 1.0 when invoice currency matches base currency.",
		type: 'number',
		format: 'float',
	},
	expense_id: {
		type: 'string',
		description:
			'Unique identifier of the billable expense to be converted to an invoice line item. This converts a previously recorded expense into a billable line item on the invoice, enabling expense-to-invoice conversion. Note: This value is a set of numeric characters.',
	},
	expense_receipt_name: {
		type: 'string',
		description:
			'Name of the receipt image attached to the expense. This is used when converting a billable expense with an attached receipt into an invoice line item.',
	},
	fax: { description: "Customer's fax number.", type: 'string' },
	'fetch-invoice-einvoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	file_name: { type: 'string' },
	file_name_without_extension: { type: 'string' },
	'finalize-invoice-approval-response': {
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
	'force-pay-invoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	from_address: { type: 'string' },
	from_address_id: {
		description:
			'From email address id. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	from_email: { type: 'string' },
	gateway_name: {
		description:
			'Name of the payment gateway associated with the invoice. E.g. paypal, stripe.Allowed Values: <code>paypal</code>, <code>authorize_net</code>, <code>payflow_pro</code>, <code>stripe</code>, <code>2checkout</code> and <code>braintree</code>',
		type: 'string',
	},
	gateways_associated: { type: 'boolean' },
	gateways_configured: { type: 'boolean' },
	'get-an-invoice-attachment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-an-invoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			invoice: {
				type: 'object',
				properties: {
					invoice_id: { $ref: '#/components/schemas/invoice_id' },
					ach_payment_initiated: {
						$ref: '#/components/schemas/ach_payment_initiated',
					},
					invoice_number: { $ref: '#/components/schemas/invoice_number' },
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
					cfdi_usage: { $ref: '#/components/schemas/cfdi_usage' },
					vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
					tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
					is_reverse_charge_applied: {
						$ref: '#/components/schemas/is_reverse_charge_applied',
					},
					vat_reg_no: { $ref: '#/components/schemas/vat_reg_no' },
					date: { $ref: '#/components/schemas/date' },
					status: { $ref: '#/components/schemas/status' },
					payment_terms: { $ref: '#/components/schemas/payment_terms' },
					payment_terms_label: {
						$ref: '#/components/schemas/payment_terms_label',
					},
					due_date: { $ref: '#/components/schemas/due_date' },
					payment_expected_date: {
						$ref: '#/components/schemas/payment_expected_date',
					},
					last_payment_date: { $ref: '#/components/schemas/last_payment_date' },
					reference_number: { $ref: '#/components/schemas/reference_number' },
					customer_id: { $ref: '#/components/schemas/customer_id' },
					customer_name: { $ref: '#/components/schemas/customer_name' },
					contact_persons_associated: {
						$ref: '#/components/schemas/contact_persons_associated',
					},
					currency_id: { $ref: '#/components/schemas/currency_id' },
					currency_code: { $ref: '#/components/schemas/currency_code' },
					exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
					discount: { $ref: '#/components/schemas/discount' },
					is_discount_before_tax: {
						$ref: '#/components/schemas/is_discount_before_tax',
					},
					discount_type: { $ref: '#/components/schemas/discount_type' },
					is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
					recurring_invoice_id: {
						$ref: '#/components/schemas/recurring_invoice_id',
					},
					is_viewed_by_client: {
						$ref: '#/components/schemas/is_viewed_by_client',
					},
					has_attachment: { $ref: '#/components/schemas/has_attachment' },
					client_viewed_time: {
						$ref: '#/components/schemas/client_viewed_time',
					},
					location_id: { $ref: '#/components/schemas/location_id' },
					location_name: { $ref: '#/components/schemas/location_name' },
					tags: { $ref: '#/components/schemas/tags_response' },
					line_items: {
						type: 'array',
						description: 'List of line items in the invoice.',
						items: {
							type: 'object',
							properties: {
								line_item_id: { $ref: '#/components/schemas/line_item_id' },
								item_id: { $ref: '#/components/schemas/item_id' },
								project_id: { $ref: '#/components/schemas/project_id' },
								project_name: { $ref: '#/components/schemas/project_name' },
								time_entry_ids: { $ref: '#/components/schemas/time_entry_ids' },
								location_id: { $ref: '#/components/schemas/location_id' },
								location_name: { $ref: '#/components/schemas/location_name' },
								item_type: { $ref: '#/components/schemas/item_type' },
								product_type: { $ref: '#/components/schemas/product_type' },
								expense_id: { $ref: '#/components/schemas/expense_id' },
								expense_receipt_name: {
									$ref: '#/components/schemas/expense_receipt_name',
								},
								name: { $ref: '#/components/schemas/name' },
								description: { $ref: '#/components/schemas/description' },
								item_order: { $ref: '#/components/schemas/item_order' },
								bcy_rate: { $ref: '#/components/schemas/bcy_rate' },
								rate: { $ref: '#/components/schemas/rate' },
								quantity: { $ref: '#/components/schemas/quantity' },
								unit: { $ref: '#/components/schemas/unit' },
								discount_amount: {
									$ref: '#/components/schemas/discount_amount',
								},
								discount: { $ref: '#/components/schemas/discount' },
								tags: { $ref: '#/components/schemas/tags_response' },
								tax_id: { $ref: '#/components/schemas/tax_id' },
								tax_name: { $ref: '#/components/schemas/tax_name' },
								tax_type: { $ref: '#/components/schemas/tax_type' },
								tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
								tax_treatment_code: {
									$ref: '#/components/schemas/tax_treatment_code',
								},
								item_total: { $ref: '#/components/schemas/item_total' },
								line_item_category: {
									$ref: '#/components/schemas/line_item_category',
								},
							},
						},
					},
					shipping_charge: { $ref: '#/components/schemas/shipping_charge' },
					adjustment: { $ref: '#/components/schemas/adjustment' },
					adjustment_description: {
						$ref: '#/components/schemas/adjustment_description',
					},
					sub_total: { $ref: '#/components/schemas/sub_total' },
					tax_total: { $ref: '#/components/schemas/tax_total' },
					total: { $ref: '#/components/schemas/total' },
					taxes: { $ref: '#/components/schemas/taxes' },
					payment_reminder_enabled: {
						$ref: '#/components/schemas/payment_reminder_enabled',
					},
					payment_made: { $ref: '#/components/schemas/payment_made' },
					credits_applied: { $ref: '#/components/schemas/credits_applied' },
					tax_amount_withheld: {
						$ref: '#/components/schemas/tax_amount_withheld',
					},
					balance: { $ref: '#/components/schemas/balance' },
					write_off_amount: { $ref: '#/components/schemas/write_off_amount' },
					allow_partial_payments: {
						$ref: '#/components/schemas/allow_partial_payments',
					},
					price_precision: { $ref: '#/components/schemas/price_precision' },
					payment_options: { $ref: '#/components/schemas/payment_options' },
					is_emailed: { $ref: '#/components/schemas/is_emailed' },
					reminders_sent: { $ref: '#/components/schemas/reminders_sent' },
					last_reminder_sent_date: {
						$ref: '#/components/schemas/last_reminder_sent_date',
					},
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
					attachment_name: { $ref: '#/components/schemas/attachment_name' },
					can_send_in_mail: { $ref: '#/components/schemas/can_send_in_mail' },
					salesperson_id: { $ref: '#/components/schemas/salesperson_id' },
					salesperson_name: { $ref: '#/components/schemas/salesperson_name' },
					invoice_url: { $ref: '#/components/schemas/invoice_url' },
				},
			},
		},
	},
	'get-invoice-advanced-tracking-details-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-invoice-by-reference-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-invoice-custom-fields-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-invoice-dashboard-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-invoice-delivery-notes-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-invoice-document-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			document: {
				type: 'object',
				properties: {
					document_id: {
						description:
							'Unique identifier for the document. Note: This value is a set of numeric characters.',
						type: 'string',
					},
					document_name: {
						description: 'Name of the document file.',
						type: 'string',
					},
					file_name: {
						description: 'Original filename of the document.',
						type: 'string',
					},
					file_size: {
						description: 'Size of the document file in bytes.',
						type: 'integer',
					},
					file_type: { description: 'Type of the document.', type: 'string' },
					document_url: {
						description: 'URL to access the document.',
						type: 'string',
					},
					created_time: {
						description: 'Timestamp when the document was uploaded.',
						type: 'string',
					},
					last_modified_time: {
						description: 'Timestamp when the document was last modified.',
						type: 'string',
					},
				},
			},
		},
	},
	'get-invoice-einvoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-invoice-email-content-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			data: {
				type: 'object',
				properties: {
					bcc_mails: { $ref: '#/components/schemas/bcc_mails' },
					gateways_configured: {
						$ref: '#/components/schemas/gateways_configured',
					},
					gateways_associated: {
						$ref: '#/components/schemas/gateways_associated',
					},
					bcc_mails_str: { $ref: '#/components/schemas/bcc_mails_str' },
					body: { $ref: '#/components/schemas/body' },
					documents: { $ref: '#/components/schemas/documents' },
					customer_name: { $ref: '#/components/schemas/customer_name' },
					attach_pdf: { $ref: '#/components/schemas/attach_pdf' },
					entity_id: { $ref: '#/components/schemas/entity_id' },
					cc_mails_list: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								user_name: { $ref: '#/components/schemas/user_name' },
								email: { $ref: '#/components/schemas/email' },
							},
						},
					},
					file_name_without_extension: {
						$ref: '#/components/schemas/file_name_without_extension',
					},
					to_mails_str: { $ref: '#/components/schemas/to_mails_str' },
					cc_mails_str: { $ref: '#/components/schemas/cc_mails_str' },
					from_email: { $ref: '#/components/schemas/from_email' },
					from_address: { $ref: '#/components/schemas/from_address' },
					'deprecated_place\u0068olders_used': {
						$ref: '#/components/schemas/deprecated_place\u0068olders_used',
					},
					error_list: { $ref: '#/components/schemas/error_list' },
					subject: { $ref: '#/components/schemas/subject' },
					emailtemplates: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								selected: { type: 'boolean' },
								name: {
									description: 'The name of the line item. Max-length [100]',
									type: 'string',
								},
								email_template_id: {
									description:
										'Get the email content based on a specific email template. If this param is not inputted, then the content will be based on the email template associated with the customer. If no template is associated with the customer, then default template will be used. Note: This value is a set of numeric characters.',
									type: 'string',
								},
							},
						},
					},
					emailtemplate_documents: {
						$ref: '#/components/schemas/emailtemplate_documents',
					},
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
					file_name: { $ref: '#/components/schemas/file_name' },
					from_emails: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								user_name: { $ref: '#/components/schemas/user_name' },
								selected: { $ref: '#/components/schemas/selected' },
								email: { $ref: '#/components/schemas/email' },
								organization_contact_id: {
									$ref: '#/components/schemas/organization_contact_id',
								},
								is_org_email_id: {
									$ref: '#/components/schemas/is_org_email_id',
								},
							},
						},
					},
					customer_id: { $ref: '#/components/schemas/customer_id' },
				},
			},
		},
	},
	'get-invoice-metadata-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-invoice-packing-slips-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-invoice-payment-qr-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-invoice-payment-qr-status-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-invoice-qr-code-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-invoice-signature-template-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-invoice-sms-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-payment-reminder-mail-content-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			data: {
				type: 'object',
				properties: {
					bcc_mails: { $ref: '#/components/schemas/bcc_mails' },
					gateways_configured: {
						$ref: '#/components/schemas/gateways_configured',
					},
					gateways_associated: {
						$ref: '#/components/schemas/gateways_associated',
					},
					bcc_mails_str: { $ref: '#/components/schemas/bcc_mails_str' },
					body: { description: 'The body of the mail', type: 'string' },
					documents: { $ref: '#/components/schemas/documents' },
					customer_name: { $ref: '#/components/schemas/customer_name' },
					attach_pdf: { $ref: '#/components/schemas/attach_pdf' },
					entity_id: { $ref: '#/components/schemas/entity_id' },
					cc_mails_list: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								user_name: { $ref: '#/components/schemas/user_name' },
								email: { $ref: '#/components/schemas/email' },
							},
						},
					},
					file_name_without_extension: {
						$ref: '#/components/schemas/file_name_without_extension',
					},
					to_mails_str: { $ref: '#/components/schemas/to_mails_str' },
					cc_mails_str: { $ref: '#/components/schemas/cc_mails_str' },
					from_email: { $ref: '#/components/schemas/from_email' },
					from_address: { $ref: '#/components/schemas/from_address' },
					'deprecated_place\u0068olders_used': {
						$ref: '#/components/schemas/deprecated_place\u0068olders_used',
					},
					error_list: { $ref: '#/components/schemas/error_list' },
					subject: { $ref: '#/components/schemas/subject' },
					emailtemplates: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								selected: { type: 'boolean' },
								name: {
									description: 'The name of the line item. Max-length [100]',
									type: 'string',
								},
								email_template_id: {
									description:
										'Get the email content based on a specific email template. If this param is not inputted, then the content will be based on the email template associated with the customer. If no template is associated with the customer, then default template will be used. Note: This value is a set of numeric characters.',
									type: 'string',
								},
							},
						},
					},
					emailtemplate_documents: {
						$ref: '#/components/schemas/emailtemplate_documents',
					},
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
					file_name: { $ref: '#/components/schemas/file_name' },
					from_emails: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								user_name: { $ref: '#/components/schemas/user_name' },
								selected: { $ref: '#/components/schemas/selected' },
								email: { $ref: '#/components/schemas/email' },
								organization_contact_id: {
									$ref: '#/components/schemas/organization_contact_id',
								},
								is_org_email_id: {
									$ref: '#/components/schemas/is_org_email_id',
								},
							},
						},
					},
					customer_id: { $ref: '#/components/schemas/customer_id' },
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
	has_attachment: {
		type: 'boolean',
		description:
			'Boolean value to check if the invoice has \u0061ny attachments.',
	},
	has_more_page: { description: 'Check if has more pages', type: 'boolean' },
	hsn_or_sac: {
		description: 'Add HSN/SAC code for your goods/services',
		type: 'string',
		'x-node_available_in': ['in', 'ke', 'za', 'uae'],
		'x-node_unavailable_in': [],
	},
	'invoice-asynchronous-online-payment-request': {
		type: 'object',
		properties: {
			invoice_ids: {
				type: 'string',
				description:
					'Comma-separated IDs of the invoices for which the online payment is processed.',
			},
			payment_amount: {
				type: 'number',
				description: 'Amount to be collected.',
			},
			gateway: {
				type: 'string',
				description: 'Payment gateway used to process the payment.',
			},
		},
	},
	'invoice-asynchronous-online-payment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'invoice-response': {
		type: 'object',
		properties: {
			invoice_id: { $ref: '#/components/schemas/invoice_id' },
			ach_payment_initiated: {
				$ref: '#/components/schemas/ach_payment_initiated',
			},
			invoice_number: { $ref: '#/components/schemas/invoice_number' },
			is_pre_gst: { $ref: '#/components/schemas/is_pre_gst' },
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			gst_no: { $ref: '#/components/schemas/gst_no' },
			shipping_gst_no: { $ref: '#/components/schemas/shipping_gst_no' },
			shipping_trader_name: {
				$ref: '#/components/schemas/shipping_trader_name',
			},
			shipping_legal_name: { $ref: '#/components/schemas/shipping_legal_name' },
			gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
			cfdi_usage: { $ref: '#/components/schemas/cfdi_usage' },
			cfdi_reference_type: { $ref: '#/components/schemas/cfdi_reference_type' },
			reference_invoice_id: {
				description:
					'Associate the reference invoice. Note: This value is a set of numeric characters.',
				type: 'string',
				'x-node_available_in': ['mx'],
				'x-node_unavailable_in': [],
			},
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			is_reverse_charge_applied: {
				$ref: '#/components/schemas/is_reverse_charge_applied',
			},
			vat_reg_no: { $ref: '#/components/schemas/vat_reg_no' },
			date: { $ref: '#/components/schemas/date' },
			status: { $ref: '#/components/schemas/status' },
			payment_terms: { $ref: '#/components/schemas/payment_terms' },
			payment_terms_label: { $ref: '#/components/schemas/payment_terms_label' },
			due_date: { $ref: '#/components/schemas/due_date' },
			payment_expected_date: {
				$ref: '#/components/schemas/payment_expected_date',
			},
			last_payment_date: { $ref: '#/components/schemas/last_payment_date' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			customer_id: { $ref: '#/components/schemas/customer_id' },
			customer_name: { $ref: '#/components/schemas/customer_name' },
			contact_persons_associated: {
				$ref: '#/components/schemas/contact_persons_associated',
			},
			currency_id: { $ref: '#/components/schemas/currency_id' },
			currency_code: { $ref: '#/components/schemas/currency_code' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			discount: { $ref: '#/components/schemas/discount' },
			is_discount_before_tax: {
				$ref: '#/components/schemas/is_discount_before_tax',
			},
			discount_type: { $ref: '#/components/schemas/discount_type' },
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			recurring_invoice_id: {
				$ref: '#/components/schemas/recurring_invoice_id',
			},
			is_viewed_by_client: { $ref: '#/components/schemas/is_viewed_by_client' },
			has_attachment: { $ref: '#/components/schemas/has_attachment' },
			client_viewed_time: { $ref: '#/components/schemas/client_viewed_time' },
			line_items: {
				type: 'array',
				description: 'List of line items in the invoice.',
				items: {
					type: 'object',
					properties: {
						line_item_id: { $ref: '#/components/schemas/line_item_id' },
						item_id: { $ref: '#/components/schemas/item_id' },
						project_id: { $ref: '#/components/schemas/project_id' },
						sat_item_key_code: {
							$ref: '#/components/schemas/sat_item_key_code',
						},
						unitkey_code: { $ref: '#/components/schemas/unitkey_code' },
						project_name: { $ref: '#/components/schemas/project_name' },
						time_entry_ids: { $ref: '#/components/schemas/time_entry_ids' },
						location_id: { $ref: '#/components/schemas/location_id' },
						location_name: { $ref: '#/components/schemas/location_name' },
						item_type: { $ref: '#/components/schemas/item_type' },
						product_type: { $ref: '#/components/schemas/product_type' },
						expense_id: { $ref: '#/components/schemas/expense_id' },
						expense_receipt_name: {
							$ref: '#/components/schemas/expense_receipt_name',
						},
						name: { $ref: '#/components/schemas/name' },
						description: { $ref: '#/components/schemas/description' },
						item_order: { $ref: '#/components/schemas/item_order' },
						bcy_rate: { $ref: '#/components/schemas/bcy_rate' },
						rate: { $ref: '#/components/schemas/rate' },
						quantity: { $ref: '#/components/schemas/quantity' },
						unit: { $ref: '#/components/schemas/unit' },
						discount_amount: { $ref: '#/components/schemas/discount_amount' },
						discount: { $ref: '#/components/schemas/discount' },
						tags: { $ref: '#/components/schemas/tags_response' },
						tax_id: { $ref: '#/components/schemas/tax_id' },
						tds_tax_id: { $ref: '#/components/schemas/tds_tax_id' },
						tax_name: { $ref: '#/components/schemas/tax_name' },
						tax_type: { $ref: '#/components/schemas/tax_type' },
						tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
						tax_treatment_code: {
							$ref: '#/components/schemas/tax_treatment_code',
						},
						item_total: { $ref: '#/components/schemas/item_total' },
						line_item_category: {
							$ref: '#/components/schemas/line_item_category',
						},
					},
				},
			},
			shipping_charge: { $ref: '#/components/schemas/shipping_charge' },
			location_id: { $ref: '#/components/schemas/location_id' },
			location_name: { $ref: '#/components/schemas/location_name' },
			adjustment: { $ref: '#/components/schemas/adjustment' },
			adjustment_description: {
				$ref: '#/components/schemas/adjustment_description',
			},
			sub_total: { $ref: '#/components/schemas/sub_total' },
			tax_total: { $ref: '#/components/schemas/tax_total' },
			total: { $ref: '#/components/schemas/total' },
			taxes: { $ref: '#/components/schemas/taxes' },
			payment_reminder_enabled: {
				$ref: '#/components/schemas/payment_reminder_enabled',
			},
			payment_made: { $ref: '#/components/schemas/payment_made' },
			credits_applied: { $ref: '#/components/schemas/credits_applied' },
			tax_amount_withheld: { $ref: '#/components/schemas/tax_amount_withheld' },
			balance: { $ref: '#/components/schemas/balance' },
			write_off_amount: { $ref: '#/components/schemas/write_off_amount' },
			allow_partial_payments: {
				$ref: '#/components/schemas/allow_partial_payments',
			},
			price_precision: { $ref: '#/components/schemas/price_precision' },
			payment_options: { $ref: '#/components/schemas/payment_options' },
			is_emailed: { $ref: '#/components/schemas/is_emailed' },
			reminders_sent: { $ref: '#/components/schemas/reminders_sent' },
			last_reminder_sent_date: {
				$ref: '#/components/schemas/last_reminder_sent_date',
			},
			billing_address: { $ref: '#/components/schemas/billing_address' },
			shipping_address: {
				$ref: '#/components/schemas/update-shipping-address-request',
			},
			notes: { $ref: '#/components/schemas/notes' },
			terms: { $ref: '#/components/schemas/terms' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			template_id: { $ref: '#/components/schemas/template_id' },
			template_name: { $ref: '#/components/schemas/template_name' },
			created_time: { $ref: '#/components/schemas/created_time' },
			last_modified_time: { $ref: '#/components/schemas/last_modified_time' },
			attachment_name: { $ref: '#/components/schemas/attachment_name' },
			can_send_in_mail: { $ref: '#/components/schemas/can_send_in_mail' },
			salesperson_id: { $ref: '#/components/schemas/salesperson_id' },
			salesperson_name: { $ref: '#/components/schemas/salesperson_name' },
			invoice_url: { $ref: '#/components/schemas/invoice_url' },
			tags: { $ref: '#/components/schemas/tags_response' },
		},
	},
	'invoice-synchronous-online-payment-request': {
		type: 'object',
		properties: {
			card_token: {
				type: 'string',
				description: 'Token of the saved card used to process the payment.',
			},
			invoice_ids: {
				type: 'string',
				description:
					'Comma-separated IDs of the invoices for which the online payment is processed.',
			},
			payment_amount: { type: 'number', description: 'Amount to be charged.' },
			gateway: {
				type: 'string',
				description: 'Payment gateway used to process the payment.',
			},
			card_number: {
				type: 'string',
				description: 'Card number used to process the payment.',
			},
			cvv: { type: 'string', description: 'Card verification value.' },
			first_name: {
				type: 'string',
				description: 'First name of the card holder.',
			},
			last_name: {
				type: 'string',
				description: 'Last name of the card holder.',
			},
			address: {
				type: 'string',
				description: 'Billing address of the card holder.',
			},
			city: { type: 'string', description: 'Billing city of the card holder.' },
			state: {
				type: 'string',
				description: 'Billing state of the card holder.',
			},
			country: {
				type: 'string',
				description: 'Billing country of the card holder.',
			},
		},
	},
	'invoice-synchronous-online-payment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	invoice_id: {
		description:
			'ID of the invoice. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	invoice_number: {
		description:
			'Unique identifier or reference number for the invoice. When creating an invoice, this can be a custom number (requires `ignore_auto_number_generation=true` query parameter) or left empty for auto-generation. When searching invoices, supports variants: <code>invoice_number_startswith</code> and <code>invoice_number_contains</code>. Maximum length is 100 characters. Must be unique within the organization.',
		type: 'string',
	},
	invoice_payments: {
		description: 'List of payments to be applied to the invoice.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				payment_id: { $ref: '#/components/schemas/payment_id' },
				amount_applied: { $ref: '#/components/schemas/amount_applied' },
			},
		},
	},
	invoice_url: {
		type: 'string',
		description: 'The URL to view the invoice online.',
	},
	invoiced_estimate_id: {
		description:
			'Unique identifier of the estimate that was converted to create this invoice. Use this field when creating an invoice from an existing estimate. The `invoiced_estimate_id` links this invoice back to its source estimate, enabling tracking of the conversion process and maintaining the relationship between estimates and invoices. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	is_discount_before_tax: {
		description:
			'Boolean flag that determines when the discount is applied in relation to tax calculation. When <code>true</code>, discount is applied before tax calculation (discount reduces the taxable amount). When <code>false</code>, discount is applied after tax calculation (discount reduces the final total including tax). This affects the final invoice total and tax amounts.',
		type: 'boolean',
	},
	is_email_enabled: {
		description:
			'Used to check if Email communication preference is enabled for the contact person at transaction level.',
		type: 'boolean',
	},
	is_emailed: {
		description: 'Boolean check to see if the mail has been sent',
		type: 'boolean',
	},
	is_inclusive_tax: {
		description:
			'Boolean flag that indicates whether line item rates include tax. When <code>true</code>, the specified rates are inclusive of tax (tax is already included in the rate). When <code>false</code>, the rates are exclusive of tax (tax will be added to the rate). This affects how tax calculations are performed on line items.',
		type: 'boolean',
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
		'x-node_available_in': ['gcc', 'za', 'uae'],
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
	is_viewed_by_client: {
		type: 'boolean',
		description:
			'Boolean value to check if the invoice has been viewed by the client.',
	},
	is_whatsapp_enabled: {
		description:
			'Used to check if WhatsApp communication preference is enabled for the contact person at transaction level.',
		type: 'boolean',
		'x-node_available_in': ['WhatsApp integration'],
	},
	item_id: {
		description:
			'Unique identifier of the item (product or service) to be included in the invoice line item. Use the `item_id` returned by the Items API for the same organization. This field is required for each line item and determines the item details, pricing, and tax settings that will be applied to this line item. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	item_order: {
		description:
			'Sequential order number for this line item on the invoice. Determines the display order of line items on the invoice document. Lower numbers appear first. Used for organizing line items in a specific sequence.',
		type: 'integer',
	},
	item_total: {
		description: 'The total amount of the line items',
		type: 'number',
		format: 'float',
	},
	item_type: { description: 'Enter goods/services', type: 'string' },
	last_modified_time: {
		type: 'string',
		description: 'The time of last modification of the invoice',
	},
	last_name: {
		description: 'Last Name of the Contact Person.',
		type: 'string',
	},
	last_payment_date: {
		description: 'The last payment date of the invoice',
		type: 'string',
	},
	last_reminder_sent_date: {
		description: 'The date the last email was sent',
		type: 'string',
	},
	line_item_category: {
		description:
			'Category of the line item. Allowed values are <code>line_item</code>, <code>header</code> and <code>subtotal</code>. Use <code>line_item</code> for regular line items, <code>header</code> for header titles and <code>subtotal</code> for intermediate subtotal rows. For regular line items, you can send line_item or omit this field',
		type: 'string',
	},
	line_item_id: {
		description:
			'The line item id. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	'list-credits-applied-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			credits: {
				description: 'The list of credits',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						creditnote_id: { $ref: '#/components/schemas/creditnote_id' },
						creditnotes_invoice_id: {
							$ref: '#/components/schemas/creditnotes_invoice_id',
						},
						creditnotes_number: {
							$ref: '#/components/schemas/creditnotes_number',
						},
						credited_date: { $ref: '#/components/schemas/credited_date' },
						amount_applied: { $ref: '#/components/schemas/amount_applied' },
					},
				},
			},
		},
	},
	'list-invoice-comments-and-history-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			comments: {
				description: 'The details of the comments',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						comment_id: {
							description:
								'ID of the comment. Note: This value is a set of numeric characters.',
							type: 'string',
						},
						invoice_id: { $ref: '#/components/schemas/invoice_id' },
						description: { $ref: '#/components/schemas/description' },
						commented_by_id: { type: 'string' },
						commented_by: { type: 'string' },
						comment_type: { type: 'string' },
						operation_type: { type: 'string' },
						date: {
							description:
								'Search invoices by invoice date. Default date format is yyyy-mm-dd.<code> Variants: due_date_start, due_date_end, due_date_before and due_date_after</code>.',
							type: 'string',
						},
						date_description: { type: 'string' },
						time: { type: 'string' },
						transaction_id: {
							type: 'string',
							description:
								'The transaction ID associated with the comment. Note: This value is a set of numeric characters.',
						},
						transaction_type: { type: 'string' },
					},
				},
			},
		},
	},
	'list-invoice-payments-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			payments: {
				description: 'The list of payments',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						payment_id: {
							description:
								'ID of the payment. Note: This value is a set of numeric characters.',
							type: 'string',
						},
						payment_number: {
							description: 'The payment Number',
							type: 'integer',
						},
						invoice_id: {
							description:
								'ID of the invoice. Note: This value is a set of numeric characters.',
							type: 'string',
						},
						invoice_payment_id: {
							description:
								'The invoice payment id. Note: This value is a set of numeric characters.',
							type: 'string',
						},
						payment_mode: {
							description: 'The mode of payment for the invoice',
							type: 'string',
						},
						description: {
							description:
								'Detailed description of the line item providing additional information about the product or service. This description appears on the invoice document and helps customers understand what they are being charged for. Maximum length is 2000 characters.',
							type: 'string',
						},
						date: {
							description:
								'Search invoices by invoice date. Default date format is yyyy-mm-dd.<code> Variants: due_date_start, due_date_end, due_date_before and due_date_after</code>.',
							type: 'string',
						},
						reference_number: {
							description:
								'External reference number or identifier for the invoice, such as a purchase order number, contract number, or any other business reference. When converting from an estimate or sales order, this field can be used to reference the original document number.',
							type: 'string',
						},
						exchange_rate: {
							description: 'Exchange rate of the currency.',
							type: 'number',
							format: 'float',
						},
						amount: {
							description: 'The amount in the payment',
							type: 'number',
							format: 'float',
						},
						tax_amount_withheld: {
							description: 'The tax amount which has been withheld',
							type: 'number',
							format: 'float',
						},
						online_transaction_id: {
							$ref: '#/components/schemas/online_transaction_id',
						},
						is_single_invoice_payment: {
							description: 'boolean check',
							type: 'boolean',
						},
					},
				},
			},
		},
	},
	'list-invoice-templates-response': {
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
	'list-invoices-einvoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'list-invoices-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			invoices: {
				description: 'The invoices created by the user',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						invoice_id: { $ref: '#/components/schemas/invoice_id' },
						ach_payment_initiated: {
							$ref: '#/components/schemas/ach_payment_initiated',
						},
						customer_name: { $ref: '#/components/schemas/customer_name' },
						customer_id: { $ref: '#/components/schemas/customer_id' },
						status: { $ref: '#/components/schemas/status' },
						invoice_number: { $ref: '#/components/schemas/invoice_number' },
						reference_number: { $ref: '#/components/schemas/reference_number' },
						date: { $ref: '#/components/schemas/date' },
						due_date: { $ref: '#/components/schemas/due_date' },
						due_days: { $ref: '#/components/schemas/due_days' },
						currency_id: { $ref: '#/components/schemas/currency_id' },
						schedule_time: { $ref: '#/components/schemas/schedule_time' },
						currency_code: { $ref: '#/components/schemas/currency_code' },
						is_viewed_by_client: {
							$ref: '#/components/schemas/is_viewed_by_client',
						},
						has_attachment: { $ref: '#/components/schemas/has_attachment' },
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
						reminders_sent: { $ref: '#/components/schemas/reminders_sent' },
						last_reminder_sent_date: {
							$ref: '#/components/schemas/last_reminder_sent_date',
						},
						payment_expected_date: {
							$ref: '#/components/schemas/payment_expected_date',
						},
						last_payment_date: {
							$ref: '#/components/schemas/last_payment_date',
						},
						custom_fields: { $ref: '#/components/schemas/custom_fields' },
						documents: { $ref: '#/components/schemas/documents' },
						location_id: { $ref: '#/components/schemas/location_id' },
						location_name: { $ref: '#/components/schemas/location_name' },
						salesperson_id: { $ref: '#/components/schemas/salesperson_id' },
						salesperson_name: { $ref: '#/components/schemas/salesperson_name' },
						shipping_charge: { $ref: '#/components/schemas/shipping_charge' },
						adjustment: { $ref: '#/components/schemas/adjustment' },
						write_off_amount: { $ref: '#/components/schemas/write_off_amount' },
						exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
						tags: { $ref: '#/components/schemas/tags_response' },
					},
				},
			},
			page_context: {
				description: 'The context of a particular page.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						page: { $ref: '#/components/schemas/page' },
						per_page: { $ref: '#/components/schemas/per_page' },
						has_more_page: { $ref: '#/components/schemas/has_more_page' },
						report_name: { $ref: '#/components/schemas/report_name' },
						applied_filter: { $ref: '#/components/schemas/applied_filter' },
						sort_column: { $ref: '#/components/schemas/sort_column' },
						sort_order: { $ref: '#/components/schemas/sort_order' },
						response_option: { $ref: '#/components/schemas/response_option' },
					},
				},
			},
		},
	},
	location_id: {
		description:
			'Unique identifier of the business location associated with the invoice. Use the `location_id` returned by the Locations API for the same organization. This links the invoice to a specific business location, which may affect tax calculations, reporting, and business operations. Required if your organization has multiple locations configured. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	location_name: { description: 'Name of the location', type: 'string' },
	'mail-invoice-pdf-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'map-invoice-with-salesorder-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			errors: {
				description:
					'List of validation errors encountered during the mapping process. Each error contains details about which invoices failed and why.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						code: {
							description:
								'Error code indicating the type of validation failure',
							type: 'integer',
						},
						message: {
							description:
								'Human-readable error message explaining the validation failure',
							type: 'string',
						},
						ids: {
							description:
								'Array of invoice IDs that encountered this specific error',
							type: 'array',
							items: { type: 'string' },
						},
					},
				},
			},
		},
	},
	'mark-an-invoice-as-sent-response': {
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
	'mark-invoice-einvoice-cancelled-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'mark-invoice-einvoice-pushed-request': {
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
	'mark-invoice-einvoice-pushed-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'mark-invoice-ready-to-push-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'mark-invoices-sent-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'mark-invoices-shipped-response': {
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
			'Name or title of the line item as it appears on the invoice. Maximum length is 100 characters. Can be customized to override the default item name from the item catalog.',
		type: 'string',
	},
	notes: {
		description:
			'Additional information or comments to be displayed on the invoice document. This field is typically used for thank you messages, special instructions, or any other information you want to communicate to the customer. The notes appear on the invoice PDF and are visible to customers',
		type: 'string',
	},
	online_transaction_id: {
		type: 'string',
		description:
			'Unique identifier of the online transaction. Note: This value is a set of numeric characters.',
	},
	organization_contact_id: {
		type: 'string',
		description:
			'Unique identifier of the contact in the organization. Note: This value is a set of numeric characters.',
	},
	page: { description: 'Number of pages', type: 'integer' },
	'payment-link-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			data: {
				type: 'object',
				properties: { share_link: { type: 'string', readOnly: true } },
			},
		},
	},
	payment_expected_date: {
		description: 'The expected date of payment',
		type: 'string',
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
	payment_id: {
		description:
			'ID of the payment. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	payment_made: {
		description: 'The amount paid',
		type: 'number',
		format: 'float',
	},
	payment_options: {
		description:
			'Payment options for the invoice, online payment gateways and bank accounts. Will be displayed in the pdf.',
		type: 'object',
		properties: {
			payment_gateways: { $ref: '#/components/schemas/payment_gateways' },
		},
	},
	payment_reminder_enabled: {
		description: 'Boolean to check if reminders have been enabled',
		type: 'boolean',
	},
	payment_terms: {
		description:
			'Number of days allowed for payment (e.g., 15, 30, 60). This value determines the invoice due date by adding the specified number of days to the invoice date. For sample, if invoice date is 2023-11-17 and payment_terms is 15, the due_date will be 2023-12-02. Maximum value is 100 days.',
		type: 'integer',
	},
	payment_terms_label: {
		description:
			'Custom label for payment terms that appears on the invoice document. Used to override the default system-generated label. For sample, instead of the default "Net 15 Days", you can set this to "Net 15", "Due in 15 days", or any custom text. This label is displayed to customers on the invoice. Maximum length is 100 characters.',
		type: 'string',
	},
	per_page: { description: 'Per page values', type: 'integer' },
	phone: { description: 'Phone Number of the Contact Person.', type: 'string' },
	place_of_supply: {
		description:
			'Place where the goods/services are supplied to. (If not given, <code>place of contact</code> given for the contact will be taken)<br/>Supported codes for UAE emirates are : </br>Abu Dhabi - <code>AB</code>,</br>Ajman - <code>AJ</code>,</br>Dubai - <code>DU</code>,</br>Fujairah - <code>FU</code>,</br>Ras al-Khaimah - <code>RA</code>,</br>Sharjah - <code>SH</code>,</br>Umm al-Quwain - <code>UM</code><br/>Supported codes for the GCC countries are : </br>United Arab Emirates - <code>AE</code>,</br>Saudi Arabia - <code>SA</code>,</br>Bahrain - <code>BH</code>,</br>Kuwait - <code>KW</code>,</br>Oman - <code>OM</code>,</br>Qatar - <code>QA</code>.',
		type: 'string',
		'x-node_available_in': ['in', 'gcc', 'uae'],
		'x-node_unavailable_in': [],
	},
	'preview-invoice-coupons-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	price_precision: {
		description: 'The precision value on the price',
		type: 'integer',
	},
	'print-invoice-delivery-note-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'print-invoice-packing-slip-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	product_tax_category: {
		description:
			'Tax category of the product or service on the line item, used for automated sales tax. <code>tax_category_code</code> is required; <code>tax_category_name</code> and <code>description</code> can be omitted or empty. If the code already exists in the organization, the existing category is used; otherwise, a new category is created with the details sent. When omitted and automated sales tax is enabled, the line uses the tax category of the item in <code>item_id</code>. You can send flat <code>tax_category_code</code> on the line instead of this object.',
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
	project_id: {
		description:
			'Unique identifier of the project associated with this line item. Use the `project_id` returned by the Projects API for the same organization. This links the line item to a specific project for project-based billing, time tracking, and cost allocation. Optional field that enables project-specific invoicing and reporting. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	project_name: { description: 'Name of the project.', type: 'string' },
	'push-invoice-einvoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'push-invoices-einvoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	quantity: {
		description:
			'Number of units of the item being invoiced. This value is multiplied by the rate to calculate the line item total. Must be a positive number greater than zero.',
		type: 'number',
		format: 'float',
	},
	rate: {
		description:
			'Unit rate or price for the line item in the invoice currency. This is the amount charged per unit of the item. The rate is used to calculate the line item total (rate x quantity) and affects the final invoice amount.',
		type: 'number',
		format: 'double',
	},
	reason: {
		type: 'string',
		description: 'The reason for generating the invoice.',
	},
	'recall-invoice-einvoice-status-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	recurring_invoice_id: {
		description:
			'Unique identifier of the recurring invoice template that generated this invoice. Use this field when creating an invoice from a recurring invoice template. The `recurring_invoice_id` links this invoice back to its source recurring invoice, enabling tracking of which template generated it and maintaining the recurring invoice relationship. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	reference_invoice_id: {
		description:
			'Associate the reference invoice. Note: This value is a set of numeric characters.',
		type: 'string',
		'x-node_available_in': ['mx'],
		'x-node_unavailable_in': [],
	},
	reference_number: {
		description:
			'External reference number or identifier for the invoice, such as a purchase order number, contract number, or any other business reference. When converting from an estimate or sales order, this field can be used to reference the original document number.',
		type: 'string',
	},
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
					'Tax Identification Number (TIN) of the contact. Used as the VAT registration number for UAE E-Invoicing. Max-length [200].',
				type: 'string',
			},
			zone_type: {
				description:
					'Location code type identifying the economic zone or region. Used for UAE E-Invoicing compliance (e.g. <code>TL</code> for Territory of Land). Max-length [200].',
				type: 'string',
			},
			einvoice_identifier_label: {
				description:
					'Label for the buyer identifier used in E-Invoicing (Buyer ID label). Allowed values: <code>TL</code>, <code>EID</code>, <code>PAS</code>, <code>CD</code>. Max-length [200].',
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
					'Value of the location identifier used in E-Invoicing. Max-length [200].',
				type: 'string',
			},
			location_identifier_type: {
				description:
					'Type of the location identifier scheme. Max-length [200].',
				type: 'string',
			},
			electronic_address_value: {
				description:
					'Electronic address (Peppol ID or similar) of the contact used for E-Invoicing routing. Max-length [200].',
				type: 'string',
			},
		},
		'x-node_available_in': ['uae'],
		'x-node_unavailable_in': [],
	},
	'reject-invoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'remind-customer-request': {
		required: ['cc_mail_ids'],
		type: 'object',
		properties: {
			to_mail_ids: { $ref: '#/components/schemas/to_mail_ids' },
			cc_mail_ids: { $ref: '#/components/schemas/cc_mail_ids' },
			subject: { $ref: '#/components/schemas/subject' },
			body: { description: 'The body of the mail', type: 'string' },
			send_from_org_email_id: {
				$ref: '#/components/schemas/send_from_org_email_id',
			},
		},
	},
	'remind-customer-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	reminders_sent: { description: 'The no of reminders sent', type: 'integer' },
	report_name: { description: 'The report name', type: 'string' },
	response_option: { description: 'Transaction total count', type: 'integer' },
	reverse_charge_tax_id: {
		description:
			'Unique identifier of the reverse charge tax applied to the line item. Required when the reverse charge mechanism is applicable for the transaction. Note: This value is a set of numeric characters.',
		type: 'string',
		'x-node_available_in': ['gcc', 'uae'],
		'x-node_unavailable_in': [],
	},
	salesorder_id: {
		type: 'string',
		description:
			'Unique identifier of the sales order associated with the invoice. Note: This value is a set of numeric characters.',
	},
	salesorder_item_id: {
		description:
			'Unique identifier of the sales order line item that is being converted to this invoice line item. Use this field when creating an invoice from an existing sales order. The `salesorder_item_id` links this invoice line item back to its source sales order line item, enabling tracking of the conversion process and maintaining the relationship between sales orders and invoices. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	salesorder_number: { type: 'string' },
	salesorder_order_status: { type: 'string' },
	salesperson_id: {
		type: 'string',
		description:
			'Unique identifier of the salesperson associated with the invoice. Note: This value is a set of numeric characters.',
	},
	salesperson_name: {
		description: 'Name of the salesperson. Max-length [200]',
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
	'schedule-invoice-email-request': {
		type: 'object',
		properties: {
			schedule_time: {
				type: 'string',
				description:
					'Date and time at which the invoice email is scheduled to be sent. Format [yyyy-mm-dd HH:MM:SS].',
			},
		},
	},
	'schedule-invoice-email-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	schedule_time: {
		type: 'string',
		description:
			'The scheduled time for the invoice to be sent to the customer.',
	},
	selected: { type: 'boolean' },
	send: {
		description:
			'Send the invoice to the contact person(s) associated with the invoice. Allowed values <code>true</code> and <code>false</code>.',
		type: 'boolean',
	},
	'send-invoice-dunning-notifications-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'send-invoice-retry-sms-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'send-invoice-sms-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'send-invoice-snail-mail-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	send_from_org_email_id: {
		description:
			"Boolean to trigger the email from the organization's email address",
		type: 'boolean',
	},
	shipment_date: { type: 'string' },
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
	shipping_address_id: {
		description:
			"Unique identifier of the shipping address to be used for this invoice. Use the `shipping_address_id` returned by the Addresses API for the same customer and organization. This address appears on the invoice document and is used for delivery purposes. If omitted, the customer's default shipping address will be used. Note: This value is a set of numeric characters.",
		type: 'string',
	},
	shipping_charge: {
		description:
			'Additional shipping or delivery charges applied to the invoice. Must be specified as a fixed amount (e.g., "25.00"). This amount is added to the invoice total and is subject to tax calculation.',
		type: 'string',
	},
	shipping_charge_tax_category: {
		description:
			'Tax category applied to the shipping charge when automated sales tax is enabled (for sample, <code>FR020000</code>). Send when <code>shipping_charge</code> is greater than zero. Omit when there is no shipping charge.',
		type: 'object',
		properties: {
			tax_category_code: {
				description: 'Code of the shipping tax category. Max-length [25].',
				type: 'string',
			},
			tax_category_name: {
				description: 'Name of the shipping tax category.',
				type: 'string',
			},
			description: {
				description: 'Description of the shipping tax category.',
				type: 'string',
			},
		},
		'x-node_available_in': ['us'],
		'x-node_unavailable_in': [],
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
		description: 'Boolean to check if the comment to be shown to the clients',
		type: 'boolean',
	},
	sort_column: {
		description:
			'Sort invoices.Allowed Values: <code>customer_name</code>, <code>invoice_number</code>, <code>date</code>, <code> due_date</code>, <code>total</code>, <code>balance</code> and  <code>created_time</code>',
		type: 'string',
	},
	sort_order: { description: 'The order for sorting', type: 'string' },
	state: {
		description: "State of the customer's billing address.",
		type: 'string',
	},
	status: {
		description:
			'Search invoices by invoice status.Allowed Values: <code>sent</code>, <code>draft</code>, <code>overdue</code>, <code>paid</code>, <code>void</code>, <code>unpaid</code>, <code>partially_paid</code> and <code>viewed</code>',
		type: 'string',
	},
	street2: {
		type: 'string',
		description:
			'Additional address information such as suite number, apartment number, or floor.',
	},
	sub_total: {
		description: 'The sub total of the all items',
		type: 'number',
		format: 'float',
	},
	sub_total_formatted: { type: 'string' },
	subject: { description: 'The subject of the mail', type: 'string' },
	'submit-an-invoice-for-approval-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'submit-invoices-response': {
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
	tax_amount_withheld: {
		description: 'The tax amount which has been withheld',
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
	tax_category_code: {
		description:
			'Product tax category code for the line item used by automated sales tax (for sample, <code>PC040100</code> for Apparel). Max-length [25] characters. Maps to the line item tax category on create and update. When omitted and automated tax is enabled, the category configured on the item in Zoho Books is applied for lines that include <code>item_id</code>. Send this field to override or ensure a specific category.',
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
	tax_reg_no: {
		description:
			'Tax registration number of the customer or supplier. Used for GCC VAT compliance. Max-length [50].',
		type: 'string',
		'x-node_available_in': ['gcc'],
		'x-node_unavailable_in': [],
	},
	tax_selection_mode: {
		description:
			'Decides whether tax on the invoice is applied manually or by tax automation. Allowed values: <code>manual</code> and <code>automated</code>. Use <code>automated</code> with <code>automatic_tax_enabled</code> as <code>true</code> for US automated sales tax. Use <code>manual</code> when you select taxes yourself. Supported on the invoice and on line items when tax automation is enabled for the organization.',
		type: 'string',
		enum: ['manual', 'automated'],
		'x-node_available_in': ['us'],
		'x-node_unavailable_in': [],
	},
	tax_total: {
		description: 'The total amount of the tax levied',
		type: 'number',
		format: 'double',
	},
	tax_treatment: {
		description:
			'VAT treatment for the invoice. Choose whether the contact falls under: <code>vat_registered</code>,<code>vat_not_registered</code>,<code>gcc_vat_not_registered</code>,<code>gcc_vat_registered</code>,<code>non_gcc</code>.</br><b>For UAE Edition:</b> also <code>dz_vat_registered</code>, <code>dz_vat_not_registered</code>, <code>out_of_scope</code>, <code>gcc_non_vat</code>, <code>fz_vat_registered</code>, and <code>fz_vat_not_registered</code>.</br><code>home_country_mexico</code>,<code>border_region_mexico</code>,<code>non_mexico</code> supported only for <b>MX</b>.<br/><b>For Kenya Edition:</b> <code>vat_registered</code> ,<code>vat_not_registered</code> ,<code>non_kenya</code>(A business that is located outside Kenya).<br/><b>For SouthAfrica Edition:</b> <code>vat_registered</code>, <code>vat_not_registered</code>, <code>overseas</code>(A business that is located outside SouthAfrica).',
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
			'Unique identifier of the PDF template linked to the invoice. Obtain this value from the `template_id` field in the response of the GET `/invoices/templates` API for your organization. Determines which template is used for the invoice PDF. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	template_name: {
		type: 'string',
		description: 'Name of the PDF template linked to the invoice.',
	},
	template_type: { description: 'The type of template type', type: 'string' },
	terms: {
		description:
			'Terms and conditions text to be displayed on the invoice document. This field is used to specify payment terms, delivery conditions, return policies, or any other legal or business terms that apply to this transaction. The terms appear on the invoice PDF and are legally binding.',
		type: 'string',
	},
	time: { type: 'string' },
	time_entry_ids: {
		description:
			'Array of time entry IDs to be billed on this line item. This allows you to bill specific time entries against this line item, enabling detailed time-based invoicing and project cost tracking. Note: This value is a set of numeric characters separated by comma.',
		type: 'array',
		items: { type: 'string' },
	},
	to_mail_ids: {
		description: 'Array of email address of the recipients.',
		type: 'array',
		items: { type: 'string' },
	},
	to_mails_str: { type: 'string' },
	total: { description: 'The total amount to be paid', type: 'string' },
	total_formatted: { type: 'string' },
	unit: {
		description:
			'Unit of measurement for the line item quantity. sample include "Nos" (Numbers), "kgs" (Kilograms), "hrs" (Hours), "pcs" (Pieces), etc. This helps clarify what the quantity represents. Maximum length is 100 characters.',
		type: 'string',
	},
	unitkey_code: {
		description:
			'Unit code for the goods or services.<br/><b>For Mexico Edition:</b> use the SAT unit key code. Download the <a href="http://omawww.sat.gob.mx/tramitesyservicios/Paginas/documentos/catCFDI_V_4_07122022.xls">CFDI Catalogs</a>.<br/><b>For UAE Edition:</b> use the UN/CEFACT unit code (for sample <code>H87</code> for piece, <code>KGM</code> for kilogram). Max-length [10].',
		type: 'string',
		maxLength: 10,
		'x-node_available_in': ['mx', 'uae'],
		'x-node_unavailable_in': [],
	},
	'unmap-invoices-from-salesorders-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'unship-invoices-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'update-a-comment-request': {
		type: 'object',
		properties: {
			description: {
				description: 'The description of the comment.',
				type: 'string',
			},
			show_comment_to_clients: {
				$ref: '#/components/schemas/show_comment_to_clients',
			},
		},
	},
	'update-an-invoice-customfield-request': {
		description: 'Update the custom fields of an invoice.',
		type: 'object',
		properties: {
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
		},
	},
	'update-an-invoice-customfield-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'update-an-invoice-request': {
		required: ['customer_id', 'line_items'],
		type: 'object',
		properties: {
			customer_id: { $ref: '#/components/schemas/customer_id' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			contact_persons_associated: {
				$ref: '#/components/schemas/contact_persons_associated_payload',
			},
			invoice_number: { $ref: '#/components/schemas/invoice_number' },
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			is_reverse_charge_applied: {
				$ref: '#/components/schemas/is_reverse_charge_applied',
			},
			bank_account_id: { $ref: '#/components/schemas/bank_account_id' },
			discount_code: { $ref: '#/components/schemas/discount_code' },
			registration_details: {
				$ref: '#/components/schemas/registration_details',
			},
			tax_reg_no: { $ref: '#/components/schemas/tax_reg_no' },
			gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
			cfdi_usage: { $ref: '#/components/schemas/cfdi_usage' },
			cfdi_reference_type: { $ref: '#/components/schemas/cfdi_reference_type' },
			reference_invoice_id: {
				$ref: '#/components/schemas/reference_invoice_id',
			},
			gst_no: { $ref: '#/components/schemas/gst_no' },
			shipping_gst_no: { $ref: '#/components/schemas/shipping_gst_no' },
			shipping_trader_name: {
				$ref: '#/components/schemas/shipping_trader_name',
			},
			shipping_legal_name: { $ref: '#/components/schemas/shipping_legal_name' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			template_id: { $ref: '#/components/schemas/template_id' },
			date: { $ref: '#/components/schemas/date' },
			payment_terms: { $ref: '#/components/schemas/payment_terms' },
			payment_terms_label: { $ref: '#/components/schemas/payment_terms_label' },
			due_date: { $ref: '#/components/schemas/due_date' },
			discount: { $ref: '#/components/schemas/discount' },
			is_discount_before_tax: {
				$ref: '#/components/schemas/is_discount_before_tax',
			},
			discount_type: { $ref: '#/components/schemas/discount_type' },
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			recurring_invoice_id: {
				$ref: '#/components/schemas/recurring_invoice_id',
			},
			invoiced_estimate_id: {
				$ref: '#/components/schemas/invoiced_estimate_id',
			},
			salesperson_name: { $ref: '#/components/schemas/salesperson_name' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			tags: { $ref: '#/components/schemas/tags' },
			location_id: { $ref: '#/components/schemas/location_id' },
			line_items: {
				type: 'array',
				description: 'List of line items in the invoice.',
				items: {
					type: 'object',
					required: ['item_id'],
					properties: {
						item_id: { $ref: '#/components/schemas/item_id' },
						project_id: { $ref: '#/components/schemas/project_id' },
						time_entry_ids: { $ref: '#/components/schemas/time_entry_ids' },
						product_type: { $ref: '#/components/schemas/product_type' },
						hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
						sat_item_key_code: {
							$ref: '#/components/schemas/sat_item_key_code',
						},
						unitkey_code: { $ref: '#/components/schemas/unitkey_code' },
						location_id: { $ref: '#/components/schemas/location_id' },
						expense_id: { $ref: '#/components/schemas/expense_id' },
						expense_receipt_name: {
							$ref: '#/components/schemas/expense_receipt_name',
						},
						name: { $ref: '#/components/schemas/name' },
						description: { $ref: '#/components/schemas/description' },
						item_order: { $ref: '#/components/schemas/item_order' },
						bcy_rate: { $ref: '#/components/schemas/bcy_rate' },
						rate: { $ref: '#/components/schemas/rate' },
						quantity: { $ref: '#/components/schemas/quantity' },
						unit: { $ref: '#/components/schemas/unit' },
						discount_amount: { $ref: '#/components/schemas/discount_amount' },
						tags: { $ref: '#/components/schemas/tags' },
						discount: { $ref: '#/components/schemas/discount' },
						tax_id: { $ref: '#/components/schemas/tax_id' },
						tds_tax_id: { $ref: '#/components/schemas/tds_tax_id' },
						tax_name: { $ref: '#/components/schemas/tax_name' },
						tax_type: { $ref: '#/components/schemas/tax_type' },
						tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
						tax_treatment_code: {
							$ref: '#/components/schemas/tax_treatment_code',
						},
						reverse_charge_tax_id: {
							$ref: '#/components/schemas/reverse_charge_tax_id',
						},
						discount_code: { $ref: '#/components/schemas/discount_code' },
						line_item_category: {
							$ref: '#/components/schemas/line_item_category',
						},
						tax_selection_mode: {
							$ref: '#/components/schemas/tax_selection_mode',
						},
						automatic_tax_enabled: {
							$ref: '#/components/schemas/automatic_tax_enabled',
						},
						tax_category_code: {
							$ref: '#/components/schemas/tax_category_code',
						},
						product_tax_category: {
							$ref: '#/components/schemas/product_tax_category',
						},
					},
				},
			},
			payment_options: { $ref: '#/components/schemas/payment_options' },
			allow_partial_payments: {
				$ref: '#/components/schemas/allow_partial_payments',
			},
			custom_body: { $ref: '#/components/schemas/custom_body' },
			custom_subject: { $ref: '#/components/schemas/custom_subject' },
			notes: { $ref: '#/components/schemas/notes' },
			terms: { $ref: '#/components/schemas/terms' },
			shipping_charge: { $ref: '#/components/schemas/shipping_charge' },
			shipping_charge_tax_category: {
				$ref: '#/components/schemas/shipping_charge_tax_category',
			},
			adjustment: { $ref: '#/components/schemas/adjustment' },
			adjustment_description: {
				$ref: '#/components/schemas/adjustment_description',
			},
			reason: { $ref: '#/components/schemas/reason' },
			tax_authority_id: { $ref: '#/components/schemas/tax_authority_id' },
			tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
			automatic_tax_enabled: {
				$ref: '#/components/schemas/automatic_tax_enabled',
			},
			tax_selection_mode: { $ref: '#/components/schemas/tax_selection_mode' },
			avatax_use_code: { $ref: '#/components/schemas/avatax_use_code' },
			avatax_exempt_no: { $ref: '#/components/schemas/avatax_exempt_no' },
			tax_id: { $ref: '#/components/schemas/tax_id' },
			expense_id: { $ref: '#/components/schemas/expense_id' },
			salesorder_item_id: { $ref: '#/components/schemas/salesorder_item_id' },
			avatax_tax_code: { $ref: '#/components/schemas/avatax_tax_code' },
			line_item_id: { $ref: '#/components/schemas/line_item_id' },
		},
	},
	'update-an-invoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			invoice: {
				type: 'object',
				properties: {
					invoice_id: { $ref: '#/components/schemas/invoice_id' },
					ach_payment_initiated: {
						$ref: '#/components/schemas/ach_payment_initiated',
					},
					invoice_number: { $ref: '#/components/schemas/invoice_number' },
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
					cfdi_usage: { $ref: '#/components/schemas/cfdi_usage' },
					cfdi_reference_type: {
						$ref: '#/components/schemas/cfdi_reference_type',
					},
					reference_invoice_id: {
						$ref: '#/components/schemas/reference_invoice_id',
					},
					vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
					tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
					is_reverse_charge_applied: {
						$ref: '#/components/schemas/is_reverse_charge_applied',
					},
					vat_reg_no: { $ref: '#/components/schemas/vat_reg_no' },
					date: { $ref: '#/components/schemas/date' },
					status: { $ref: '#/components/schemas/status' },
					payment_terms: { $ref: '#/components/schemas/payment_terms' },
					payment_terms_label: {
						$ref: '#/components/schemas/payment_terms_label',
					},
					due_date: { $ref: '#/components/schemas/due_date' },
					payment_expected_date: {
						$ref: '#/components/schemas/payment_expected_date',
					},
					last_payment_date: { $ref: '#/components/schemas/last_payment_date' },
					reference_number: { $ref: '#/components/schemas/reference_number' },
					customer_id: { $ref: '#/components/schemas/customer_id' },
					customer_name: { $ref: '#/components/schemas/customer_name' },
					contact_persons_associated: {
						$ref: '#/components/schemas/contact_persons_associated',
					},
					currency_id: { $ref: '#/components/schemas/currency_id' },
					currency_code: { $ref: '#/components/schemas/currency_code' },
					exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
					discount: { $ref: '#/components/schemas/discount' },
					is_discount_before_tax: {
						$ref: '#/components/schemas/is_discount_before_tax',
					},
					discount_type: { $ref: '#/components/schemas/discount_type' },
					is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
					recurring_invoice_id: {
						$ref: '#/components/schemas/recurring_invoice_id',
					},
					is_viewed_by_client: {
						$ref: '#/components/schemas/is_viewed_by_client',
					},
					has_attachment: { $ref: '#/components/schemas/has_attachment' },
					client_viewed_time: {
						$ref: '#/components/schemas/client_viewed_time',
					},
					location_id: { $ref: '#/components/schemas/location_id' },
					location_name: { $ref: '#/components/schemas/location_name' },
					tags: { $ref: '#/components/schemas/tags_response' },
					line_items: {
						type: 'array',
						description: 'List of line items in the invoice.',
						items: {
							type: 'object',
							properties: {
								line_item_id: { $ref: '#/components/schemas/line_item_id' },
								item_id: { $ref: '#/components/schemas/item_id' },
								project_id: { $ref: '#/components/schemas/project_id' },
								project_name: { $ref: '#/components/schemas/project_name' },
								time_entry_ids: { $ref: '#/components/schemas/time_entry_ids' },
								location_id: { $ref: '#/components/schemas/location_id' },
								location_name: { $ref: '#/components/schemas/location_name' },
								item_type: { $ref: '#/components/schemas/item_type' },
								product_type: { $ref: '#/components/schemas/product_type' },
								sat_item_key_code: {
									$ref: '#/components/schemas/sat_item_key_code',
								},
								unitkey_code: { $ref: '#/components/schemas/unitkey_code' },
								expense_id: { $ref: '#/components/schemas/expense_id' },
								expense_receipt_name: {
									$ref: '#/components/schemas/expense_receipt_name',
								},
								name: { $ref: '#/components/schemas/name' },
								description: { $ref: '#/components/schemas/description' },
								item_order: { $ref: '#/components/schemas/item_order' },
								bcy_rate: { $ref: '#/components/schemas/bcy_rate' },
								rate: { $ref: '#/components/schemas/rate' },
								quantity: { $ref: '#/components/schemas/quantity' },
								unit: { $ref: '#/components/schemas/unit' },
								discount_amount: {
									$ref: '#/components/schemas/discount_amount',
								},
								discount: { $ref: '#/components/schemas/discount' },
								tags: { $ref: '#/components/schemas/tags_response' },
								tax_id: { $ref: '#/components/schemas/tax_id' },
								tds_tax_id: { $ref: '#/components/schemas/tds_tax_id' },
								tax_name: { $ref: '#/components/schemas/tax_name' },
								tax_type: { $ref: '#/components/schemas/tax_type' },
								tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
								tax_treatment_code: {
									$ref: '#/components/schemas/tax_treatment_code',
								},
								item_total: { $ref: '#/components/schemas/item_total' },
								line_item_category: {
									$ref: '#/components/schemas/line_item_category',
								},
							},
						},
					},
					shipping_charge: { $ref: '#/components/schemas/shipping_charge' },
					adjustment: { $ref: '#/components/schemas/adjustment' },
					adjustment_description: {
						$ref: '#/components/schemas/adjustment_description',
					},
					sub_total: { $ref: '#/components/schemas/sub_total' },
					tax_total: { $ref: '#/components/schemas/tax_total' },
					total: { $ref: '#/components/schemas/total' },
					taxes: { $ref: '#/components/schemas/taxes' },
					payment_reminder_enabled: {
						$ref: '#/components/schemas/payment_reminder_enabled',
					},
					payment_made: { $ref: '#/components/schemas/payment_made' },
					credits_applied: { $ref: '#/components/schemas/credits_applied' },
					tax_amount_withheld: {
						$ref: '#/components/schemas/tax_amount_withheld',
					},
					balance: { $ref: '#/components/schemas/balance' },
					write_off_amount: { $ref: '#/components/schemas/write_off_amount' },
					allow_partial_payments: {
						$ref: '#/components/schemas/allow_partial_payments',
					},
					price_precision: { $ref: '#/components/schemas/price_precision' },
					payment_options: { $ref: '#/components/schemas/payment_options' },
					is_emailed: { $ref: '#/components/schemas/is_emailed' },
					reminders_sent: { $ref: '#/components/schemas/reminders_sent' },
					last_reminder_sent_date: {
						$ref: '#/components/schemas/last_reminder_sent_date',
					},
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
					attachment_name: { $ref: '#/components/schemas/attachment_name' },
					can_send_in_mail: { $ref: '#/components/schemas/can_send_in_mail' },
					salesperson_id: { $ref: '#/components/schemas/salesperson_id' },
					salesperson_name: { $ref: '#/components/schemas/salesperson_name' },
					invoice_url: { $ref: '#/components/schemas/invoice_url' },
				},
			},
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
	'update-comment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			comment: {
				type: 'object',
				properties: {
					comment_id: { $ref: '#/components/schemas/comment_id' },
					invoice_id: { $ref: '#/components/schemas/invoice_id' },
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
	'update-invoice-advanced-tracking-details-request': {
		type: 'object',
		description:
			'Advanced inventory tracking details (batches or serial numbers) for the invoice line items.',
	},
	'update-invoice-advanced-tracking-details-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'update-invoice-cfdi-status-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'update-invoice-einvoice-payment-status-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'update-invoice-metadata-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'update-invoice-template-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'update-shipping-address-request': {
		type: 'object',
		properties: {
			address: {
				description: 'Shipping address for the invoice',
				type: 'string',
			},
			street2: { $ref: '#/components/schemas/street2' },
			city: {
				description: "City of the customer's Shipping address.",
				type: 'string',
			},
			state: {
				description: "State of the customer's Shipping address.",
				type: 'string',
			},
			zip: {
				description: "Zip code of the customer's Shipping address.",
				type: 'string',
			},
			country: {
				description: "Country of the customer's Shipping address.",
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
	'upload-invoice-digital-signature-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'upload-invoice-document-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	user_name: { type: 'string' },
	value: { description: 'Value of the Custom Field', type: 'string' },
	vat_reg_no: { description: 'Enter VAT registration number.', type: 'string' },
	vat_treatment: {
		description:
			'(Optional) VAT treatment for the invoices. VAT treatment denotes the location of the customer, if the customer resides in UK then the VAT treatment is <code>uk</code>. If the customer is in an EU country & VAT registered, you are resides in Northen Ireland and selling Goods then his VAT treatment is <code>eu_vat_registered</code>, if he resides outside of the UK then his VAT treatment is <code>overseas</code> (For Pre Brexit, this can be split as <code>eu_vat_registered</code>, <code>eu_vat_not_registered</code> and <code>non_eu</code>).',
		type: 'string',
		'x-node_available_in': ['uk'],
		'x-node_unavailable_in': [],
	},
	'void-an-invoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'void-invoices-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'write-off-invoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'write-off-invoices-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	write_off_amount: {
		description: 'The write off amount',
		type: 'number',
		format: 'float',
	},
	zip: {
		description: "Zip code of the customer's billing address.",
		type: 'string',
	},
} as const satisfies Record<string, JsonValue>;

export const operations = [
	{
		id: 'create_invoice',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'createInvoice',
		method: 'POST',
		path: '/invoices',
		summary: 'Create an invoice',
		description: 'Create an invoice for your customer.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'send',
				in: 'query',
				required: false,
				description:
					'Send the invoice to the contact person(s) associated with the invoice. Allowed values <code>true</code> and <code>false</code>.',
				schema: { type: 'boolean' },
			},
			{
				name: 'ignore_auto_number_generation',
				in: 'query',
				required: false,
				description:
					'Ignore auto invoice number generation for this invoice. This mandates the invoice number. Allowed values <code>true</code> and <code>false</code>',
				schema: { type: 'boolean' },
			},
			{
				name: 'is_quick_create',
				in: 'query',
				required: false,
				description:
					'Enable quick create mode for simplified invoice creation. When true, the invoice creation process is streamlined with minimal required fields. Allowed values <code>true</code> and <code>false</code>',
				schema: { type: 'boolean' },
			},
			{
				name: 'batch_payments',
				in: 'query',
				required: false,
				description:
					'Enable batch payment processing for the invoice. When true, the invoice can be included in batch payment operations. Allowed values <code>true</code> and <code>false</code> <br> Note :  <code>is_quick_create</code> needs to be true for batch payments to be processed and batch_payments vales need to pass in request body',
				schema: { type: 'boolean' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/create-an-invoice-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/create-an-invoice-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_invoices',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'listInvoices',
		method: 'GET',
		path: '/invoices',
		summary: 'List invoices',
		description:
			'Get a list of invoices with helpful pagination, filtering, search, and sorting features. Perfect for viewing your invoice data in organized ways, whether you need to find specific invoices or browse through your records.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'invoice_number',
				in: 'query',
				required: false,
				description:
					'Search invoices by invoice number. Filters invoices based on their unique identifier. Supports <code>invoice_number_startswith</code> and <code>invoice_number_contains</code> variants. Maximum length is 100 characters. Useful for finding specific invoices or invoices with similar numbering patterns.',
				schema: { type: 'string' },
			},
			{
				name: 'item_name',
				in: 'query',
				required: false,
				description:
					'Search invoices by item name. Filters invoices based on product or service names in invoice line items. Supports <code>item_name_startswith</code> and <code>item_name_contains</code> variants. Maximum length is 100 characters. Useful for finding invoices with specific products or services.',
				schema: { type: 'string' },
			},
			{
				name: 'item_id',
				in: 'query',
				required: false,
				description:
					'Search invoices by item ID. Filters invoices based on the unique identifier of specific products or services in line items. Use the GET `/items` API to find available item IDs. Useful for finding all invoices containing a specific product or service. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'item_description',
				in: 'query',
				required: false,
				description:
					'Search invoices by item description. Filters invoices based on detailed descriptions of products or services in line items. Supports <code>item_description_startswith</code> and <code>item_description_contains</code> variants. Maximum length is 100 characters. Useful for finding invoices with specific item descriptions or technical specifications.',
				schema: { type: 'string' },
			},
			{
				name: 'reference_number',
				in: 'query',
				required: false,
				description:
					'Search invoices by reference number. Filters invoices based on external reference identifiers like purchase order numbers, contract numbers, or project codes. Useful for finding invoices associated with specific projects or business transactions.',
				schema: { type: 'string' },
			},
			{
				name: 'customer_name',
				in: 'query',
				required: false,
				description:
					'Search invoices by customer name. Filters invoices based on the business or individual name associated with the invoice. Maximum length is 100 characters. Useful for finding all invoices for a specific customer or generating customer reports.',
				schema: { type: 'string' },
			},
			{
				name: 'recurring_invoice_id',
				in: 'query',
				required: false,
				description:
					'ID of the recurring invoice from which the invoice is created. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'email',
				in: 'query',
				required: false,
				description:
					'Search invoices by customer email address. Filters invoices based on the email address of the customer or contact person. Maximum length is 100 characters. Useful for finding invoices for specific customers or generating customer segment reports.',
				schema: { type: 'string' },
			},
			{
				name: 'total',
				in: 'query',
				required: false,
				description:
					'Search invoices by total amount. Filters invoices based on the final invoice amount including taxes, discounts, and adjustments. Useful for finding invoices within specific price ranges or identifying high-value transactions.',
				schema: { type: 'string' },
			},
			{
				name: 'balance',
				in: 'query',
				required: false,
				description:
					'Search invoices by outstanding balance. Filters invoices based on the remaining unpaid amount owed by the customer. Useful for finding overdue invoices, tracking receivables, or generating aging reports.',
				schema: { type: 'string' },
			},
			{
				name: 'custom_field',
				in: 'query',
				required: false,
				description:
					'Search invoices by custom fields.Variants: <code>custom_field_startswith</code> and <code>custom_field_contains</code>',
				schema: { type: 'string' },
			},
			{
				name: 'date',
				in: 'query',
				required: false,
				description:
					'Filter invoices for an exact invoice date. Returns invoices created on the specified date. Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'date_start',
				in: 'query',
				required: false,
				description:
					'Filter invoices with an invoice date on or after the specified date. Useful for defining the start of a date range. Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'date_end',
				in: 'query',
				required: false,
				description:
					'Filter invoices with an invoice date on or before the specified date. Useful for defining the end of a date range. Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'date_before',
				in: 'query',
				required: false,
				description:
					'Filter invoices with an invoice date strictly before the specified date (exclusive). Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'date_after',
				in: 'query',
				required: false,
				description:
					'Filter invoices with an invoice date strictly after the specified date (exclusive). Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'due_date',
				in: 'query',
				required: false,
				description:
					'Search invoices by due date. Filters invoices based on the payment due date. Use yyyy-mm-dd format. Supports variants: <code>due_date_start</code>, <code>due_date_end</code>, <code>due_date_before</code> and <code>due_date_after</code>. Useful for finding overdue invoices or invoices due within specific periods.',
				schema: { type: 'string' },
			},
			{
				name: 'due_date_start',
				in: 'query',
				required: false,
				description:
					'Filter invoices with due date on or after the specified date. Useful for defining the start of a date range. Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'due_date_end',
				in: 'query',
				required: false,
				description:
					'Filter invoices with due date on or before the specified date. Useful for defining the end of a date range. Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'due_date_before',
				in: 'query',
				required: false,
				description:
					'Filter invoices with due date strictly before the specified date (exclusive). Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'due_date_after',
				in: 'query',
				required: false,
				description:
					'Filter invoices with due date strictly after the specified date (exclusive). Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'created_date',
				in: 'query',
				required: false,
				description:
					'Search invoices by creation date. Filters invoices based on the date they were created. Use yyyy-mm-dd format. Supports variants: <code>created_date_start</code>, <code>created_date_end</code>, <code>created_date_before</code> and <code>created_date_after</code>. Useful for finding invoices created within specific time periods or date ranges.',
				schema: { type: 'string' },
			},
			{
				name: 'created_date_start',
				in: 'query',
				required: false,
				description:
					'Filter invoices with invoice created date on or after the specified date. Useful for defining the start of a date range. Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'created_date_end',
				in: 'query',
				required: false,
				description:
					'Filter invoices with invoice created date on or before the specified date. Useful for defining the end of a date range. Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'last_modified_time',
				in: 'query',
				required: false,
				description:
					'Search invoices modified after a specific time. Filters invoices based on their last modification timestamp. Use YYYY-MM-DDTHH:MM:SS-UTC format. Useful for finding recently updated invoices or syncing data changes. sample : 2023-11-18T02:02:51-0800, 2025-19-19T02:02:51%2B0800',
				schema: { type: 'string' },
			},
			{
				name: 'status',
				in: 'query',
				required: false,
				description:
					'Search invoices by status. Filters invoices based on their current state in the billing workflow. Allowed values: <code>sent</code>, <code>draft</code>, <code>overdue</code>, <code>paid</code>, <code>void</code>, <code>unpaid</code>, <code>partially_paid</code> and <code>viewed</code>. Useful for finding invoices in specific stages of the billing process.',
				schema: { type: 'string' },
			},
			{
				name: 'customer_id',
				in: 'query',
				required: false,
				description:
					'Search invoices by customer ID. Filters invoices based on the unique identifier of the customer for whom the invoice was created. Use the customer ID returned by the Contacts API to find all invoices for a specific customer. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'filter_by',
				in: 'query',
				required: false,
				description:
					'Filter invoices by status or payment expected date. Use <code>Status.*</code> for status-based filtering (e.g., Status.Sent, Status.Paid) or <code>Date.PaymentExpectedDate</code> for date-based filtering. Provides advanced filtering options beyond basic search parameters.',
				schema: { type: 'string' },
			},
			{
				name: 'search_text',
				in: 'query',
				required: false,
				description:
					'Search invoices by invoice number, purchase order, or customer name. This parameter performs a general search across multiple invoice fields. Maximum length is 100 characters. Useful for quick searches when you know part of the invoice information but are unsure which specific field to search.',
				schema: { type: 'string' },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description:
					'Sort invoices by specific column. Allowed values: <code>customer_name</code>, <code>invoice_number</code>, <code>date</code>, <code>due_date</code>, <code>total</code>, <code>balance</code> and <code>created_time</code>. Use this parameter to organize invoice results in a specific order for better data analysis and reporting.',
				schema: { type: 'string' },
			},
			{
				name: 'zcrm_potential_id',
				in: 'query',
				required: false,
				description:
					'Search invoices by CRM potential ID. This parameter allows you to find invoices associated with a specific deal or opportunity in your Zoho CRM system. Use the potential ID from your CRM to link invoices to sales opportunities and track revenue from specific deals. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'response_option',
				in: 'query',
				required: false,
				description:
					'To get desired response format. There are 5 formats of responses: 0 (Includes all invoices), 1 (Includes all invoices, the number of invoices, and the sum of their total and balance amounts), 2 (Includes only the number of invoices), 3 (Includes the number of invoices and the sum of their total and balance amounts), and 4 (Includes all invoices and the sum of their total and balance amounts).',
				schema: { type: 'integer' },
			},
			{
				name: 'page',
				in: 'query',
				required: false,
				description:
					'Page number to be fetched from the paginated results. Default value is 1. Use this parameter along with per_page to navigate through large sets of invoice data. Useful for implementing pagination in your application.',
				schema: { type: 'integer', default: 1 },
			},
			{
				name: 'per_page',
				in: 'query',
				required: false,
				description:
					'Number of records to be fetched per page. Use this parameter to control the size of each page of results. Maximum value is 200. Useful for optimizing data transfer and improving application performance.',
				schema: { type: 'integer', default: 10 },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/list-invoices-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_invoice_using_custom_field',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'updateInvoiceUsingCustomField',
		method: 'PUT',
		path: '/invoices',
		summary: "Update an invoice using a custom field's unique value",
		description:
			"A custom field will have unique values if it's configured to not accept duplicate values. Now, you can use that custom field's value to update an invoice by providing its API name in the X-Unique-Identifier-Key header and its value in the X-Unique-Identifier-Value header. Based on this value, the corresponding invoice will be retrieved and updated. Additionally, there is an optional X-Upsert header. If the X-Upsert header is true and the custom field's unique value is not found in any of the existing invoices, a new invoice will be created if the necessary payload details are available",
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
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
			schema: { $ref: '#/components/schemas/update-an-invoice-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-an-invoice-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_invoices',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'deleteInvoices',
		method: 'DELETE',
		path: '/invoices',
		summary: 'Delete invoices',
		description:
			'Delete one or more invoices. Only invoices that are not part of a closed accounting period can be deleted.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'invoice_ids',
				in: 'query',
				required: true,
				description:
					'Comma-separated IDs of the invoices to delete. Note: This value is a set of numeric characters separated by comma.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/delete-invoices-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'update_invoice',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'updateInvoice',
		method: 'PUT',
		path: '/invoices/{invoice_id}',
		summary: 'Update an invoice',
		description:
			'Update an existing invoice. To delete a line item just remove it from the line_items list.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
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
			schema: { $ref: '#/components/schemas/update-an-invoice-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-an-invoice-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_invoice',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'getInvoice',
		method: 'GET',
		path: '/invoices/{invoice_id}',
		summary: 'Get an invoice',
		description: 'Get the details of an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
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
					'Get the details of a particular invoice in formats such as json/ pdf/ html. Default format is json. Allowed values <code>json</code> <code>pdf</code> and <code>html</code>',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/get-an-invoice-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_invoice',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'deleteInvoice',
		method: 'DELETE',
		path: '/invoices/{invoice_id}',
		summary: 'Delete an invoice',
		description:
			'Delete an existing invoice. Invoices which have payment or credits note applied cannot be deleted.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/delete-an-invoice-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'mark_invoice_sent',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'markInvoiceSent',
		method: 'POST',
		path: '/invoices/{invoice_id}/status/sent',
		summary: 'Mark an invoice as sent',
		description: 'Mark a draft invoice as sent.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/mark-an-invoice-as-sent-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_invoice_void',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'markInvoiceVoid',
		method: 'POST',
		path: '/invoices/{invoice_id}/status/void',
		summary: 'Void an invoice',
		description:
			'Mark an invoice status as void. Upon voiding, the payments and credits associated with the invoices will be unassociated and will be under customer credits.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/void-an-invoice-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'mark_invoice_draft',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'markInvoiceDraft',
		method: 'POST',
		path: '/invoices/{invoice_id}/status/draft',
		summary: 'Mark as draft',
		description: 'Mark a voided invoice as draft.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
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
		id: 'email_invoices',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'emailInvoices',
		method: 'POST',
		path: '/invoices/email',
		summary: 'Email multiple invoices',
		description:
			'Send invoices to your customers by email. Maximum of 10 invoices can be sent at once.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'invoice_ids',
				in: 'query',
				required: true,
				description:
					'Comma separated invoice ids which are to be emailed. Note: This value is a set of numeric characters separated by comma.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/email-invoices-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/email-invoices-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'create_invoice_from_salesorder',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'createInvoiceFromSalesorder',
		method: 'POST',
		path: '/invoices/fromsalesorder',
		summary: 'Create an instant invoice',
		description:
			' Create an instant invoice for all the confirmed sales orders you have selected.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'salesorder_id',
				in: 'query',
				required: true,
				description:
					'Unique identifier of the sales order from which the invoice has to be created. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/create-an-instant-invoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'map_invoice_with_salesorder',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'mapInvoiceWithSalesorder',
		method: 'POST',
		path: '/invoices/mapwithorder',
		summary: 'Associate invoices with sales order',
		description: 'Associate one or more existing invoices with a sales orders.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_ids',
				in: 'query',
				required: true,
				description:
					'Array of invoice IDs to be associated with a sales order. Note: This value is a set of numeric characters separated by comma.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/map-invoice-with-salesorder-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'submit_invoice',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'submitInvoice',
		method: 'POST',
		path: '/invoices/{invoice_id}/submit',
		summary: 'Submit an invoice for approval',
		description: 'Submit an invoice for approval.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/submit-an-invoice-for-approval-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'approve_invoice',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'approveInvoice',
		method: 'POST',
		path: '/invoices/{invoice_id}/approve',
		summary: 'Approve an invoice.',
		description: 'Approve an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/approve-an-invoice-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_invoice_email',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'getInvoiceEmail',
		method: 'GET',
		path: '/invoices/{invoice_id}/email',
		summary: 'Get invoice email content',
		description: 'Get the email content of an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/get-invoice-email-content-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'email_invoice',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'emailInvoice',
		method: 'POST',
		path: '/invoices/{invoice_id}/email',
		summary: 'Email an invoice',
		description:
			'Email an invoice to the customer. Input json string is not mandatory. If input json string is empty, mail will be send with default mail content.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
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
				description: 'Send the invoice attachment a with the email.',
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
			schema: { $ref: '#/components/schemas/email-an-invoice-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/email-an-invoice-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'remind_customer_for_invoice_payment',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'remindCustomerForInvoicePayment',
		method: 'POST',
		path: '/invoices/{invoice_id}/paymentreminder',
		summary: 'Remind Customer',
		description:
			'Remind your customer about an unpaid invoice by email. Reminder will be sent, only for the invoices which are in open or overdue status.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
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
			schema: { $ref: '#/components/schemas/remind-customer-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/remind-customer-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_payment_reminder_mail_content_for_invoice',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'getPaymentReminderMailContentForInvoice',
		method: 'GET',
		path: '/invoices/{invoice_id}/paymentreminder',
		summary: 'Get payment reminder mail content',
		description: 'Get the mail content of the payment reminder.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/get-payment-reminder-mail-content-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'bulk_invoice_reminder',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'bulkInvoiceReminder',
		method: 'POST',
		path: '/invoices/paymentreminder',
		summary: 'Bulk invoice reminder',
		description:
			'Remind your customer about an unpaid invoices by email. Reminder mail will be send, only for the invoices is in open or overdue status. Maximum 10 invoices can be reminded at once.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'invoice_ids',
				in: 'query',
				required: true,
				description:
					'Array of invoice ids for which the reminder has to be sent. Note: This value is a set of numeric characters separated by comma.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/bulk-invoice-reminder-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'bulk_export_invoices_as_pdf',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'bulkExportInvoicesAsPdf',
		method: 'GET',
		path: '/invoices/pdf',
		summary: 'Bulk export Invoices',
		description: 'Maximum of 25 invoices can be exported in a single pdf.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'invoice_ids',
				in: 'query',
				required: true,
				description:
					'Comma separated invoice ids which are to be export as pdf. Note: This value is a set of numeric characters separated by comma.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/bulk-export-invoices-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'bulk_print_invoices',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'bulkPrintInvoices',
		method: 'GET',
		path: '/invoices/print',
		summary: 'Bulk print invoices',
		description:
			'Export invoices as pdf and print them. Maximum of 25 invoices can be printed.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'invoice_ids',
				in: 'query',
				required: true,
				description:
					'Export invoices as pdf and print them. Maximum of 25 invoices can be printed. Note: This value is a set of numeric characters separated by comma.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/bulk-print-invoices-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'disable_invoice_payment_reminder',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'disableInvoicePaymentReminder',
		method: 'POST',
		path: '/invoices/{invoice_id}/paymentreminder/disable',
		summary: 'Disable payment reminder',
		description: 'Disable automated payment reminders for an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the invoice.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/disable-payment-reminder-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'enable_invoice_payment_reminder',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'enableInvoicePaymentReminder',
		method: 'POST',
		path: '/invoices/{invoice_id}/paymentreminder/enable',
		summary: 'Enable payment reminder',
		description: 'Enable automated payment reminders for an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/enable-payment-reminder-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'write_off_invoice',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'writeOffInvoice',
		method: 'POST',
		path: '/invoices/{invoice_id}/writeoff',
		summary: 'Write off invoice',
		description: 'Write off the invoice balance amount of an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/write-off-invoice-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'cancel_write_off_invoice',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'cancelWriteOffInvoice',
		method: 'POST',
		path: '/invoices/{invoice_id}/writeoff/cancel',
		summary: 'Cancel write off',
		description: 'Cancel the write off amount of an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/cancel-write-off-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'update_invoice_billing_address',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'updateInvoiceBillingAddress',
		method: 'PUT',
		path: '/invoices/{invoice_id}/address/billing',
		summary: 'Update billing address',
		description: 'Updates the billing address for this invoice alone.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
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
		id: 'update_invoice_shipping_address',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'updateInvoiceShippingAddress',
		method: 'PUT',
		path: '/invoices/{invoice_id}/address/shipping',
		summary: 'Update shipping address',
		description: 'Updates the shipping address for this invoice alone.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
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
		scopes: ['ZohoBooks.invoices.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_invoice_templates',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'listInvoiceTemplates',
		method: 'GET',
		path: '/invoices/templates',
		summary: 'List invoice templates',
		description: 'Get all invoice pdf templates.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/list-invoice-templates-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_invoice_template',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'updateInvoiceTemplate',
		method: 'PUT',
		path: '/invoices/{invoice_id}/templates/{template_id}',
		summary: 'Update invoice template',
		description: 'Update the pdf template associated with the invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'template_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice template. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-invoice-template-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_invoice_payments',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'listInvoicePayments',
		method: 'GET',
		path: '/invoices/{invoice_id}/payments',
		summary: 'List invoice payments',
		description: 'Get the list of payments made for an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/list-invoice-payments-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'list_invoice_credits_applied',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'listInvoiceCreditsApplied',
		method: 'GET',
		path: '/invoices/{invoice_id}/creditsapplied',
		summary: 'List credits applied',
		description: 'Get the list of credits applied for an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/list-credits-applied-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'apply_credits_to_invoice',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'applyCreditsToInvoice',
		method: 'POST',
		path: '/invoices/{invoice_id}/credits',
		summary: 'Apply credits',
		description:
			'Apply the customer credits either from credit notes or excess customer payments to an invoice. Multiple credits can be applied at once.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
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
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/apply-credits-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_invoice_payment',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'deleteInvoicePayment',
		method: 'DELETE',
		path: '/invoices/{invoice_id}/payments/{invoice_payment_id}',
		summary: 'Delete a payment',
		description: 'Delete a payment made to an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'invoice_payment_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice payment. Note: This value is a set of numeric characters.',
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
		scopes: ['ZohoBooks.invoices.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'delete_invoice_applied_credit',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'deleteInvoiceAppliedCredit',
		method: 'DELETE',
		path: '/invoices/{invoice_id}/creditsapplied/{creditnotes_invoice_id}',
		summary: 'Delete applied credit',
		description: 'Delete a particular credit applied to an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'creditnotes_invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the credit note invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/delete-applied-credit-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_invoice_attachment',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'getInvoiceAttachment',
		method: 'GET',
		path: '/invoices/{invoice_id}/attachment',
		summary: 'Get last attached attachment',
		description: 'Returns the file attached to the invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
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
				schema: {
					$ref: '#/components/schemas/get-an-invoice-attachment-response',
				},
			},
			{ status: '200', contentType: '*/*' },
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'add_invoice_attachment',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'addInvoiceAttachment',
		method: 'POST',
		path: '/invoices/{invoice_id}/attachment',
		summary: 'Add attachment to an invoice',
		description: 'Attach a file to an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'can_send_in_mail',
				in: 'query',
				required: false,
				description:
					'True to send the attachment with the invoice when emailed.',
				schema: { type: 'boolean' },
			},
			{
				name: 'attachment',
				in: 'query',
				required: false,
				description:
					'The file to be attached.Allowed Extensions: <code>gif</code>, <code>png</code>, <code>jpeg</code>, <code>jpg</code>, <code>bmp</code> and <code>pdf</code>',
				schema: { type: 'string', format: 'binary' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/add-attachment-to-an-invoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_invoice_attachment_preference',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'updateInvoiceAttachmentPreference',
		method: 'PUT',
		path: '/invoices/{invoice_id}/attachment',
		summary: 'Update attachment preference',
		description:
			'Set whether you want to send the attached file while emailing the invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'can_send_in_mail',
				in: 'query',
				required: true,
				description:
					'Boolean to send the attachment with the invoice when emailed.',
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
		scopes: ['ZohoBooks.invoices.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_invoice_attachment',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'deleteInvoiceAttachment',
		method: 'DELETE',
		path: '/invoices/{invoice_id}/attachment',
		summary: 'Delete last attached attachment',
		description: 'Delete the file attached to the invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
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
		id: 'get_invoice_document_details',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'getInvoiceDocumentDetails',
		method: 'GET',
		path: '/invoices/{invoice_id}/documents/{document_id}',
		summary: 'Retrieve Invoice Document',
		description:
			'Retrieve a specific document attached to an invoice with advanced retrieval options.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
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
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
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
				name: 'responseformat',
				in: 'query',
				required: false,
				description: 'Specify the response format (e.g., json, pdf, html)',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/get-invoice-document-response' },
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
		id: 'delete_invoice_document',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'deleteInvoiceDocument',
		method: 'DELETE',
		path: '/invoices/{invoice_id}/documents/{document_id}',
		summary: 'Delete Invoice attachment',
		description:
			'Delete a specific document attached to an invoice. This operation permanently removes the document from the invoice and cannot be undone. Only documents that are not system-generated can be deleted.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
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
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/delete-invoice-document-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'add_invoice_document',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'addInvoiceDocument',
		method: 'POST',
		path: '/invoices/{invoice_id}/documents/{document_id}',
		summary: 'Add a document to an invoice',
		description: 'Attach a document to a specific document slot of an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
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
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/add-invoice-document-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_invoice_expense_receipt',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'deleteInvoiceExpenseReceipt',
		method: 'DELETE',
		path: '/invoices/expenses/{expense_id}/receipt',
		summary: 'Delete the expense receipt',
		description:
			'Delete the expense receipts attached to an invoice which is raised from an expense.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'expense_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the expense. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/delete-the-expense-receipt-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'update_custom_fields_in_invoice',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'updateCustomFieldsInInvoice',
		method: 'PUT',
		path: '/invoice/{invoice_id}/customfields',
		summary: 'Update custom field in existing invoices',
		description: 'Update the value of the custom field in existing invoices.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: {
				$ref: '#/components/schemas/update-an-invoice-customfield-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-an-invoice-customfield-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_invoice_comments',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'listInvoiceComments',
		method: 'GET',
		path: '/invoices/{invoice_id}/comments',
		summary: 'List invoice comments & history',
		description: 'Get the complete history and comments of an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/list-invoice-comments-and-history-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'add_invoice_comment',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'addInvoiceComment',
		method: 'POST',
		path: '/invoices/{invoice_id}/comments',
		summary: 'Add comment',
		description: 'Add a comment for an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/create-a-comment-request' },
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
		id: 'update_invoice_comment',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'updateInvoiceComment',
		method: 'PUT',
		path: '/invoices/{invoice_id}/comments/{comment_id}',
		summary: 'Update comment',
		description: 'Update an existing comment of an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
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
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/update-a-comment-request' },
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
		id: 'delete_invoice_comment',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'deleteInvoiceComment',
		method: 'DELETE',
		path: '/invoices/{invoice_id}/comments/{comment_id}',
		summary: 'Delete a comment',
		description: 'Delete an invoice comment.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
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
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
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
		scopes: ['ZohoBooks.invoices.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'generate_invoice_payment_link',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'generateInvoicePaymentLink',
		method: 'GET',
		path: '/share/paymentlink',
		summary: 'Generate payment link',
		description:
			'This API generates a payment link for the invoice with an expiry date.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'transaction_id',
				in: 'query',
				required: true,
				description:
					'The ID of the transaction (Invoice ID). Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'transaction_type',
				in: 'query',
				required: true,
				description: 'The type of the transaction (Invoice).',
				schema: { type: 'string' },
			},
			{
				name: 'link_type',
				in: 'query',
				required: true,
				description: 'The type of the link (Private or Public).',
				schema: { type: 'string' },
			},
			{
				name: 'expiry_time',
				in: 'query',
				required: true,
				description:
					'The expiry time of the payment link. Supported format : <code>yyyy-MM-dd</code>',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'transaction_id',
				in: 'query',
				required: true,
				description:
					'The ID of the transaction (Invoice ID). Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'transaction_type',
				in: 'query',
				required: true,
				description: 'The type of the transaction (Invoice).',
				schema: { type: 'string' },
			},
			{
				name: 'link_type',
				in: 'query',
				required: true,
				description: 'The type of the link (Private or Public).',
				schema: { type: 'string' },
			},
			{
				name: 'expiry_time',
				in: 'query',
				required: true,
				description:
					'The expiry time of the payment link. Supported format : <code>yyyy-MM-dd</code>',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/payment-link-response' },
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'read',
	},
	{
		id: 'approve_invoices',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'approveInvoices',
		method: 'POST',
		path: '/invoices/approve',
		summary: 'Approve invoices',
		description:
			'Approve multiple invoices in a single request. Use this to approve invoices that are pending approval in bulk.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'invoice_ids',
				in: 'query',
				required: true,
				description:
					'Comma-separated IDs of the invoices to approve. Note: This value is a set of numeric characters separated by comma.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/approve-invoices-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'void_invoices',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'voidInvoices',
		method: 'POST',
		path: '/invoices/status/void',
		summary: 'Mark invoices as void',
		description:
			'Mark multiple invoices as void in a single request. Voided invoices are retained for record-keeping but are excluded from receivables.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'invoice_ids',
				in: 'query',
				required: true,
				description:
					'Comma-separated IDs of the invoices to mark as void. Note: This value is a set of numeric characters separated by comma.',
				schema: { type: 'string' },
			},
			{
				name: 'can_create_network_entity',
				in: 'query',
				required: false,
				description:
					'Whether to create the corresponding network entity for the voided invoices.',
				schema: { type: 'boolean' },
			},
			{
				name: 'unmap_salesorder',
				in: 'query',
				required: false,
				description:
					'Whether to unmap the associated sales orders when voiding the invoices.',
				schema: { type: 'boolean' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/void-invoices-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'create_invoices_from_projects',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'createInvoicesFromProjects',
		method: 'POST',
		path: '/invoices/fromprojects',
		summary: 'Create invoices from projects',
		description:
			'Create invoices from one or more projects. Use this to bill unbilled project time and expenses by generating invoices directly from the selected projects.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'project_ids',
				in: 'query',
				required: false,
				description:
					'Comma-separated IDs of the projects to create invoices from. Note: This value is a set of numeric characters separated by comma.',
				schema: { type: 'string' },
			},
			{
				name: 'invoice_number',
				in: 'query',
				required: false,
				description:
					'Invoice number to assign to the created invoice. Max-length [30].',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/create-invoices-from-projects-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_invoice_delivery_notes',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'getInvoiceDeliveryNotes',
		method: 'GET',
		path: '/invoices/deliverynotes',
		summary: 'Get delivery notes for invoices',
		description:
			'Retrieve the delivery notes for one or more invoices. Use this to generate or print delivery notes for the specified invoices.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'invoice_ids',
				in: 'query',
				required: true,
				description:
					'Comma-separated IDs of the invoices to get delivery notes for. Note: This value is a set of numeric characters separated by comma.',
				schema: { type: 'string' },
			},
			{
				name: 'print',
				in: 'query',
				required: false,
				description:
					'Whether to return the delivery notes in a print-ready format.',
				schema: { type: 'boolean' },
			},
			{
				name: 'accept',
				in: 'query',
				required: true,
				description: 'Format in which the delivery notes are returned.',
				schema: { type: 'string' },
			},
			{
				name: 'no_of_copies',
				in: 'query',
				required: false,
				description: 'Number of copies to generate.',
				schema: { type: 'integer' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/get-invoice-delivery-notes-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'get_invoice_packing_slips',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'getInvoicePackingSlips',
		method: 'GET',
		path: '/invoices/packingslips',
		summary: 'Get packing slips for invoices',
		description:
			'Retrieve the packing slips for one or more invoices. Use this to generate or print packing slips for the specified invoices.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'invoice_ids',
				in: 'query',
				required: true,
				description:
					'Comma-separated IDs of the invoices to get packing slips for. Note: This value is a set of numeric characters separated by comma.',
				schema: { type: 'string' },
			},
			{
				name: 'print',
				in: 'query',
				required: false,
				description:
					'Whether to return the packing slips in a print-ready format.',
				schema: { type: 'boolean' },
			},
			{
				name: 'accept',
				in: 'query',
				required: true,
				description: 'Format in which the packing slips are returned.',
				schema: { type: 'string' },
			},
			{
				name: 'no_of_copies',
				in: 'query',
				required: false,
				description: 'Number of copies to generate.',
				schema: { type: 'integer' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/get-invoice-packing-slips-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'finalize_invoice_approval',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'finalizeInvoiceApproval',
		method: 'POST',
		path: '/invoices/{invoice_id}/approve/final',
		summary: 'Finalize approval of an invoice',
		description:
			'Give the final approval for an invoice in a multi-level approval flow. Use this when an invoice requires a final approval step after the initial approval.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/finalize-invoice-approval-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'reject_invoice',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'rejectInvoice',
		method: 'POST',
		path: '/invoices/{invoice_id}/reject',
		summary: 'Reject an invoice',
		description:
			'Reject an invoice that is pending approval. Optionally provide a reason for the rejection.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'reason',
				in: 'query',
				required: false,
				description: 'Reason for rejecting the invoice. Max-length [500].',
				schema: { type: 'string' },
			},
			{
				name: 'isCallForOEmbed',
				in: 'query',
				required: false,
				description: 'Whether the request originates from an oEmbed context.',
				schema: { type: 'boolean' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/reject-invoice-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'send_invoice_via_snail_mail',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'sendInvoiceViaSnailMail',
		method: 'POST',
		path: '/invoices/{invoice_id}/snailmail',
		summary: 'Send an invoice via snail mail',
		description:
			'Send a physical copy of an invoice to the customer through snail mail.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'contact_person_id',
				in: 'query',
				required: false,
				description: 'ID of the contact person to send the invoice to.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/send-invoice-snail-mail-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'add_invoice_online_payment_bank_account',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'addInvoiceOnlinePaymentBankAccount',
		method: 'POST',
		path: '/invoices/{invoice_id}/onlinepayments/bankaccount',
		summary: 'Add a bank account for invoice online payments',
		description:
			'Associate a bank account with an invoice to receive online payments. Use this to configure the bank account into which online payments for the invoice are deposited.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: {
				$ref: '#/components/schemas/add-invoice-online-payment-bank-account-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/add-invoice-online-payment-bank-account-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'apply_pricebook_to_invoice',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'applyPricebookToInvoice',
		method: 'PUT',
		path: '/invoices/{invoice_id}/pricebooks/{pricebook_id}',
		summary: 'Apply a price book to an invoice',
		description:
			'Apply a price book to an invoice so that the price book rates are used for the invoice line items.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'pricebook_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the price book to apply.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/apply-pricebook-to-invoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'submit_invoices',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'submitInvoices',
		method: 'POST',
		path: '/invoices/submit',
		summary: 'Submit invoices for approval',
		description: 'Submit one or more invoices for approval.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_ids',
				in: 'query',
				required: true,
				description:
					'Comma-separated IDs of the invoices to submit. Note: This value is a set of numeric characters separated by comma.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/submit-invoices-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_invoices_sent',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'markInvoicesSent',
		method: 'POST',
		path: '/invoices/status/sent',
		summary: 'Mark invoices as sent',
		description: 'Change the status of one or more invoices to sent.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_ids',
				in: 'query',
				required: true,
				description:
					'Comma-separated IDs of the invoices to mark as sent. Note: This value is a set of numeric characters separated by comma.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/mark-invoices-sent-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'write_off_invoices',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'writeOffInvoices',
		method: 'POST',
		path: '/invoices/writeoff',
		summary: 'Write off invoices',
		description: 'Write off the balance amount of one or more invoices.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_ids',
				in: 'query',
				required: true,
				description:
					'Comma-separated IDs of the invoices to write off. Note: This value is a set of numeric characters separated by comma.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/write-off-invoices-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'mark_invoices_shipped',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'markInvoicesShipped',
		method: 'POST',
		path: '/invoices/markasshipped',
		summary: 'Mark invoices as shipped',
		description: 'Mark one or more invoices as shipped.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_ids',
				in: 'query',
				required: true,
				description:
					'Comma-separated IDs of the invoices to mark as shipped. Note: This value is a set of numeric characters separated by comma.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/mark-invoices-shipped-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'unship_invoices',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'unshipInvoices',
		method: 'POST',
		path: '/invoices/unship',
		summary: 'Mark invoices as unshipped',
		description: 'Revert the shipped status of one or more invoices.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_ids',
				in: 'query',
				required: true,
				description:
					'Comma-separated IDs of the invoices to mark as unshipped. Note: This value is a set of numeric characters separated by comma.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/unship-invoices-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'create_invoices_from_estimates',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'createInvoicesFromEstimates',
		method: 'POST',
		path: '/invoices/fromestimates',
		summary: 'Create invoices from estimates',
		description: 'Create one or more invoices from the selected estimates.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'estimate_ids',
				in: 'query',
				required: true,
				description:
					'Comma-separated IDs of the estimates to create invoices from. Note: This value is a set of numeric characters separated by comma.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/create-invoices-from-estimates-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'preview_invoice_coupons',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'previewInvoiceCoupons',
		method: 'POST',
		path: '/invoices/coupons/preview',
		summary: 'Preview invoice with coupons',
		description:
			'Preview the effect of applying coupons to an invoice before it is created.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/create-an-invoice-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/preview-invoice-coupons-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'unmap_invoices_from_salesorders',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'unmapInvoicesFromSalesorders',
		method: 'PUT',
		path: '/invoices/unmap/salesorders',
		summary: 'Unmap invoices from sales orders',
		description:
			'Remove the mapping between invoices and their associated sales orders.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/unmap-invoices-from-salesorders-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_invoice_dashboard',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'getInvoiceDashboard',
		method: 'GET',
		path: '/invoices/dashboard',
		summary: 'Get invoice dashboard',
		description:
			'Retrieve the invoice dashboard with summary metrics for invoices.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_agent',
				in: 'query',
				required: false,
				description: 'Filter the dashboard data by the invoice agent.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/get-invoice-dashboard-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'get_invoice_by_reference',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'getInvoiceByReference',
		method: 'GET',
		path: '/invoices/reference/{reference_id}',
		summary: 'Get an invoice by reference',
		description:
			'Retrieve an invoice using its reference ID from an external system.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'reference_id',
				in: 'path',
				required: true,
				description:
					'Reference identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/get-invoice-by-reference-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'get_invoice_custom_fields',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'getInvoiceCustomFields',
		method: 'GET',
		path: '/invoices/{invoice_id}/customfields',
		summary: 'Get invoice custom fields',
		description: 'Retrieve the custom fields configured for an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/get-invoice-custom-fields-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'get_invoice_advanced_tracking_details',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'getInvoiceAdvancedTrackingDetails',
		method: 'GET',
		path: '/invoices/{invoice_id}/advancedtrackingdetails',
		summary: 'Get invoice advanced tracking details',
		description:
			'Retrieve the advanced inventory tracking details (batches or serial numbers) of the line items in an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/get-invoice-advanced-tracking-details-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_invoice_advanced_tracking_details',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'updateInvoiceAdvancedTrackingDetails',
		method: 'PUT',
		path: '/invoices/{invoice_id}/advancedtrackingdetails',
		summary: 'Update invoice advanced tracking details',
		description:
			'Update the advanced inventory tracking details (batches or serial numbers) of the line items in an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: {
				$ref: '#/components/schemas/update-invoice-advanced-tracking-details-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-invoice-advanced-tracking-details-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'print_invoice_delivery_note',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'printInvoiceDeliveryNote',
		method: 'GET',
		path: '/invoices/{invoice_id}/deliverynote/print',
		summary: 'Print invoice delivery note',
		description: 'Export the delivery note of an invoice as a PDF file.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/print-invoice-delivery-note-response',
				},
			},
			{
				status: '200',
				contentType: 'application/pdf',
				schema: { type: 'string', format: 'binary' },
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'print_invoice_packing_slip',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'printInvoicePackingSlip',
		method: 'GET',
		path: '/invoices/{invoice_id}/packingslip/print',
		summary: 'Print invoice packing slip',
		description: 'Export the packing slip of an invoice as a PDF file.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/print-invoice-packing-slip-response',
				},
			},
			{
				status: '200',
				contentType: 'application/pdf',
				schema: { type: 'string', format: 'binary' },
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'get_invoice_qr_code',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'getInvoiceQrCode',
		method: 'GET',
		path: '/invoices/{invoice_id}/qrcode',
		summary: 'Get invoice QR code',
		description: 'Retrieve the QR code generated for an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/get-invoice-qr-code-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'get_invoice_sms',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'getInvoiceSms',
		method: 'GET',
		path: '/invoices/{invoice_id}/sms',
		summary: 'Get invoice SMS content',
		description:
			'Retrieve the default SMS content used when sending an invoice notification by SMS.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/get-invoice-sms-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'send_invoice_sms',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'sendInvoiceSms',
		method: 'POST',
		path: '/invoices/{invoice_id}/sms',
		summary: 'Send invoice by SMS',
		description: 'Send an invoice notification to the customer by SMS.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/send-invoice-sms-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_invoice_signature_template',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'getInvoiceSignatureTemplate',
		method: 'GET',
		path: '/invoices/{invoice_id}/dsign/template',
		summary: 'Get invoice signature template',
		description:
			'Retrieve the digital signature template configured for an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/get-invoice-signature-template-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'add_invoice_digital_signature',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'addInvoiceDigitalSignature',
		method: 'POST',
		path: '/invoices/{invoice_id}/dsign',
		summary: 'Add a digital signature to an invoice',
		description: 'Send an invoice for digital signature.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/add-invoice-digital-signature-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'upload_invoice_digital_signature',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'uploadInvoiceDigitalSignature',
		method: 'POST',
		path: '/invoices/{invoice_id}/dsign/upload',
		summary: 'Upload a signed invoice',
		description: 'Upload the digitally signed copy of an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/upload-invoice-digital-signature-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'upload_invoice_document',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'uploadInvoiceDocument',
		method: 'POST',
		path: '/invoices/{invoice_id}/documents/{document_id}/upload',
		summary: 'Upload an invoice document file',
		description:
			'Upload the file content for a document attached to an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
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
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'attachment',
				in: 'query',
				required: false,
				description: 'The file to be uploaded.',
				schema: { type: 'string', format: 'binary' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/upload-invoice-document-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_invoice_cfdi_status',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'updateInvoiceCfdiStatus',
		method: 'POST',
		path: '/invoices/{invoice_id}/cfdi/status',
		summary: 'Update an invoice CFDI status',
		description:
			'Update the CFDI (Comprobante Fiscal Digital por Internet) status of an invoice for the Mexico edition.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-invoice-cfdi-status-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'cancel_invoice',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'cancelInvoice',
		method: 'POST',
		path: '/invoices/{invoice_id}/status/cancel',
		summary: 'Cancel an invoice',
		description: 'Change the status of an invoice to cancelled.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/cancel-invoice-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'mark_invoice_ready_to_push',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'markInvoiceReadyToPush',
		method: 'POST',
		path: '/invoices/{invoice_id}/status/readytopush',
		summary: 'Mark an invoice as ready to push',
		description:
			'Mark an invoice e-invoice as ready to be pushed to the Invoice Registration Portal (IRP).',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/mark-invoice-ready-to-push-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'apply_invoice_substatus',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'applyInvoiceSubstatus',
		method: 'POST',
		path: '/invoices/{invoice_id}/substatus/{substatus_id}',
		summary: 'Apply a sub-status to an invoice',
		description: 'Apply a custom sub-status to an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
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
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/apply-invoice-substatus-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_invoice_substatus',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'deleteInvoiceSubstatus',
		method: 'DELETE',
		path: '/invoices/{invoice_id}/substatus/{substatus_id}',
		summary: 'Delete an invoice sub-status',
		description: 'Remove a custom sub-status applied to an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
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
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/delete-invoice-substatus-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'delete_invoice_line_item',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'deleteInvoiceLineItem',
		method: 'DELETE',
		path: '/invoices/{invoice_id}/lineitems/{line_item_id}',
		summary: 'Delete an invoice line item',
		description: 'Delete a specific line item from an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'line_item_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the line item. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/delete-invoice-line-item-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'schedule_invoice_email',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'scheduleInvoiceEmail',
		method: 'POST',
		path: '/invoices/{invoice_id}/email/schedule',
		summary: 'Schedule an invoice email',
		description:
			'Schedule an invoice to be emailed to the customer at a future date and time.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/schedule-invoice-email-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/schedule-invoice-email-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'cancel_scheduled_invoice_email',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'cancelScheduledInvoiceEmail',
		method: 'DELETE',
		path: '/invoices/{invoice_id}/email/schedule',
		summary: 'Cancel a scheduled invoice email',
		description: 'Cancel a previously scheduled invoice email.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/cancel-scheduled-invoice-email-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'force_pay_invoice',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'forcePayInvoice',
		method: 'POST',
		path: '/invoices/{invoice_id}/forcepay',
		summary: 'Force pay an invoice',
		description:
			'Charge a saved payment method to collect payment for an invoice immediately.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/force-pay-invoice-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'mail_invoice_pdf',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'mailInvoicePdf',
		method: 'POST',
		path: '/invoices/{invoice_id}/mailpdf',
		summary: 'Email an invoice as PDF',
		description: 'Email the PDF copy of an invoice to the customer.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/mail-invoice-pdf-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'create_invoice_synchronous_online_payment',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'createInvoiceSynchronousOnlinePayment',
		method: 'POST',
		path: '/invoices/{invoice_id}/onlinepayments/synchronous',
		summary: 'Process a synchronous online payment for an invoice',
		description:
			'Charge a card synchronously to collect an online payment for an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: {
				$ref: '#/components/schemas/invoice-synchronous-online-payment-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/invoice-synchronous-online-payment-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'create_invoice_asynchronous_online_payment',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'createInvoiceAsynchronousOnlinePayment',
		method: 'POST',
		path: '/invoices/{invoice_id}/onlinepayments/asynchronous',
		summary: 'Process an asynchronous online payment for an invoice',
		description:
			'Collect an online payment for an invoice asynchronously through a payment gateway.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: {
				$ref: '#/components/schemas/invoice-asynchronous-online-payment-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/invoice-asynchronous-online-payment-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_invoice_payment_qr',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'getInvoicePaymentQr',
		method: 'GET',
		path: '/invoices/{invoice_id}/onlinepayments/qr',
		summary: 'Get invoice online payment QR code',
		description:
			'Retrieve the QR code that the customer can scan to pay an invoice online.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/get-invoice-payment-qr-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'get_invoice_payment_qr_status',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'getInvoicePaymentQrStatus',
		method: 'GET',
		path: '/invoices/{invoice_id}/onlinepayments/qr/status',
		summary: 'Get invoice online payment QR status',
		description:
			'Retrieve the payment status of an invoice online payment QR code.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/get-invoice-payment-qr-status-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'send_invoice_dunning_notifications',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'sendInvoiceDunningNotifications',
		method: 'POST',
		path: '/invoices/{invoice_id}/senddunningnotifications',
		summary: 'Send invoice dunning notifications',
		description:
			'Send dunning notifications to the customer for an overdue invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/send-invoice-dunning-notifications-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'send_invoice_retry_sms',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'sendInvoiceRetrySms',
		method: 'POST',
		path: '/invoices/{invoice_id}/sendretrysms',
		summary: 'Resend invoice payment SMS',
		description: 'Resend the online payment SMS notification for an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/send-invoice-retry-sms-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_invoice_metadata',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'getInvoiceMetadata',
		method: 'GET',
		path: '/invoices/{invoice_id}/metadata/{metadata_name}',
		summary: 'Get invoice metadata',
		description: 'Retrieve a metadata value stored against an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'metadata_name',
				in: 'path',
				required: true,
				description: 'Name of the metadata key.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/get-invoice-metadata-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_invoice_metadata',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'updateInvoiceMetadata',
		method: 'PUT',
		path: '/invoices/{invoice_id}/metadata/{metadata_name}',
		summary: 'Update invoice metadata',
		description: 'Update a metadata value stored against an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'metadata_name',
				in: 'path',
				required: true,
				description: 'Name of the metadata key.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-invoice-metadata-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_invoices_einvoice',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'listInvoicesEinvoice',
		method: 'GET',
		path: '/invoices/einvoice',
		summary: 'List invoice e-invoices',
		description: 'Retrieve the e-invoice details of invoices.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/list-invoices-einvoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'push_invoices_einvoice',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'pushInvoicesEinvoice',
		method: 'POST',
		path: '/invoices/einvoice/push',
		summary: 'Push invoice e-invoices',
		description:
			'Push the e-invoices of multiple invoices to the Invoice Registration Portal (IRP) for India or the Peppol network for UAE.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/push-invoices-einvoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'cancel_invoices_einvoice',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'cancelInvoicesEinvoice',
		method: 'POST',
		path: '/invoices/einvoice/cancel',
		summary: 'Cancel invoice e-invoices',
		description:
			'Cancel the e-invoices of multiple invoices on the Invoice Registration Portal (IRP).',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/cancel-invoices-einvoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_invoice_einvoice',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'getInvoiceEinvoice',
		method: 'GET',
		path: '/invoices/{invoice_id}/einvoice',
		summary: 'Get an invoice e-invoice',
		description: 'Retrieve the e-invoice JSON data generated for an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/get-invoice-einvoice-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'push_invoice_einvoice',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'pushInvoiceEinvoice',
		method: 'POST',
		path: '/invoices/{invoice_id}/einvoice/push',
		summary: 'Push an invoice e-invoice',
		description:
			'Push the e-invoice of an invoice to the Invoice Registration Portal (IRP) for India or the Peppol network for UAE.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/push-invoice-einvoice-response' },
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'cancel_invoice_einvoice',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'cancelInvoiceEinvoice',
		method: 'POST',
		path: '/invoices/{invoice_id}/einvoice/cancel',
		summary: 'Cancel an invoice e-invoice',
		description:
			'Cancel the e-invoice of an invoice on the Invoice Registration Portal (IRP).',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/cancel-invoice-einvoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'fetch_invoice_einvoice',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'fetchInvoiceEinvoice',
		method: 'POST',
		path: '/invoices/{invoice_id}/einvoice/fetch',
		summary: 'Fetch an invoice e-invoice',
		description:
			'Fetch the latest e-invoice status of an invoice from the Invoice Registration Portal (IRP).',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/fetch-invoice-einvoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_invoice_einvoice_status',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'deleteInvoiceEinvoiceStatus',
		method: 'DELETE',
		path: '/invoices/{invoice_id}/einvoice/status',
		summary: 'Delete an invoice e-invoice status',
		description: 'Delete the locally stored e-invoice status of an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/delete-invoice-einvoice-status-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'mark_invoice_einvoice_pushed',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'markInvoiceEinvoicePushed',
		method: 'POST',
		path: '/invoices/{invoice_id}/einvoice/status/push',
		summary: 'Mark an invoice e-invoice as manually pushed',
		description:
			'Record that an invoice e-invoice was pushed to the Invoice Registration Portal (IRP) outside of Zoho Books, by supplying the acknowledgement details.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: {
				$ref: '#/components/schemas/mark-invoice-einvoice-pushed-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/mark-invoice-einvoice-pushed-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_invoice_einvoice_cancelled',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'markInvoiceEinvoiceCancelled',
		method: 'POST',
		path: '/invoices/{invoice_id}/einvoice/status/cancel',
		summary: 'Mark an invoice e-invoice as cancelled',
		description:
			'Record that an invoice e-invoice was cancelled on the Invoice Registration Portal (IRP) outside of Zoho Books.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/mark-invoice-einvoice-cancelled-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'recall_invoice_einvoice_status',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'recallInvoiceEinvoiceStatus',
		method: 'POST',
		path: '/invoices/{invoice_id}/einvoice/status/recall',
		summary: 'Recall an invoice e-invoice status',
		description: 'Revert the manually updated e-invoice status of an invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/recall-invoice-einvoice-status-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'update_invoice_einvoice_payment_status',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'updateInvoiceEinvoicePaymentStatus',
		method: 'PUT',
		path: '/invoices/{invoice_id}/einvoice/paymentstatus',
		summary: 'Update an invoice e-invoice payment status',
		description:
			'Update the payment status of an invoice e-invoice on the Invoice Registration Portal (IRP).',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-invoice-einvoice-payment-status-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'cancel_einvoice_invoice',
		group: 'invoices',
		groupSlug: 'invoices',
		name: 'cancelEinvoiceInvoice',
		method: 'POST',
		path: '/einvoices/invoices/{invoice_id}/cancel',
		summary: 'Cancel an e-invoice invoice',
		description:
			'Cancel the e-invoice generated for an invoice on the Invoice Registration Portal (IRP).',
		docsUrl: 'https://www.zoho.com/books/api/v3/invoices/',
		parameters: [
			{
				name: 'invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization.  Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/cancel-einvoice-invoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
] as const satisfies readonly ZohoBooksOperationDefinition[];
