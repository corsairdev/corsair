import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas = {
	additional_field1: {
		description:
			'Paypal payment method. Allowed Values: <code>standard</code> and <code>adaptive</code>',
		type: 'string',
	},
	address: { description: 'Billing address for the invoice', type: 'string' },
	adjustment: {
		description: 'Adjustments made to the invoice.',
		type: 'number',
		format: 'double',
	},
	adjustment_description: {
		description: 'Customize the adjustment description. E.g: Rounding off.',
		type: 'string',
	},
	allow_partial_payments: {
		description:
			'Choose <code>false</code> for PPU-Single Payments and <code>true</code> for PPD-Installment Payments',
		type: 'boolean',
		'x-node_available_in': ['mx'],
		'x-node_unavailable_in': [],
	},
	applied_filter: { type: 'string' },
	'associate-recurring-invoice-bank-account-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'associate-recurring-invoice-card-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	avatax_exempt_no: {
		description:
			'Exemption certificate number of the customer. Max-length [25]',
		type: 'string',
		'x-node_available_in': ['Avalara Integration'],
		'x-node_unavailable_in': [],
	},
	avatax_tax_code: {
		description: 'A tax code is a unique label used to group items together.',
		type: 'string',
	},
	avatax_use_code: {
		description:
			'Used to group like customers for exemption purposes. It is a custom value that links customers to a tax rule. Select from Avalara [standard codes][1] or enter a custom code. Max-length [25]',
		type: 'string',
		'x-node_available_in': ['Avalara Integration'],
		'x-node_unavailable_in': [],
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
	comment_description: {
		description: 'The description for comment.',
		type: 'string',
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
	company_name: {
		description: 'Name of the company with which the customer is associated.',
		type: 'string',
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
	country: {
		description: "Country of the customer's billing address.",
		type: 'string',
	},
	'create-a-recurring-invoice-request': {
		required: ['recurrence_name', 'customer_id', 'recurrence_frequency'],
		type: 'object',
		properties: {
			recurrence_name: { $ref: '#/components/schemas/recurrence_name' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			customer_id: { $ref: '#/components/schemas/customer_id' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			contact_persons_associated: {
				$ref: '#/components/schemas/contact_persons_associated_payload',
			},
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			is_reverse_charge_applied: {
				$ref: '#/components/schemas/is_reverse_charge_applied',
			},
			cfdi_usage: { $ref: '#/components/schemas/cfdi_usage' },
			allow_partial_payments: {
				$ref: '#/components/schemas/allow_partial_payments',
			},
			gst_no: { $ref: '#/components/schemas/gst_no' },
			shipping_gst_no: { $ref: '#/components/schemas/shipping_gst_no' },
			shipping_trader_name: {
				$ref: '#/components/schemas/shipping_trader_name',
			},
			shipping_legal_name: { $ref: '#/components/schemas/shipping_legal_name' },
			start_date: { $ref: '#/components/schemas/start_date' },
			end_date: { $ref: '#/components/schemas/end_date' },
			recurrence_frequency: {
				$ref: '#/components/schemas/recurrence_frequency',
			},
			repeat_every: { $ref: '#/components/schemas/repeat_every' },
			location_id: { $ref: '#/components/schemas/location_id' },
			tags: { $ref: '#/components/schemas/tags' },
			line_items: {
				description: 'Line items of an invoice.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						line_item_id: { $ref: '#/components/schemas/line_item_id' },
						quantity: { $ref: '#/components/schemas/quantity' },
						name: { $ref: '#/components/schemas/name' },
						item_total: { $ref: '#/components/schemas/item_total' },
						product_type: { $ref: '#/components/schemas/product_type' },
						hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
						sat_item_key_code: {
							$ref: '#/components/schemas/sat_item_key_code',
						},
						unitkey_code: { $ref: '#/components/schemas/unitkey_code' },
						tags: { $ref: '#/components/schemas/tags' },
						location_id: { $ref: '#/components/schemas/location_id' },
						tax_id: { $ref: '#/components/schemas/tax_id' },
						product_tax_category: {
							$ref: '#/components/schemas/product_tax_category',
						},
						tds_tax_id: { $ref: '#/components/schemas/tds_tax_id' },
						tax_treatment_code: {
							$ref: '#/components/schemas/tax_treatment_code',
						},
						project_id: { $ref: '#/components/schemas/project_id' },
						line_item_category: {
							$ref: '#/components/schemas/line_item_category',
						},
					},
				},
			},
			tax_id: { $ref: '#/components/schemas/tax_id' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			email: { $ref: '#/components/schemas/email' },
			billing_address: { $ref: '#/components/schemas/billing_address' },
			shipping_address: {
				description:
					'Address of the party the goods are shipped to. Use this field to provide a one-time shipping address that is not saved under the customer. When using this field, do not provide <code>shipping_address_id</code> in the same request.',
				$ref: '#/components/schemas/shipping_address',
			},
			avatax_use_code: { $ref: '#/components/schemas/avatax_use_code' },
			avatax_exempt_no: { $ref: '#/components/schemas/avatax_exempt_no' },
			template_id: { $ref: '#/components/schemas/template_id' },
			payment_terms: { $ref: '#/components/schemas/payment_terms' },
			payment_terms_label: { $ref: '#/components/schemas/payment_terms_label' },
			tax_authority_id: { $ref: '#/components/schemas/tax_authority_id' },
			tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			payment_options: { $ref: '#/components/schemas/payment_options' },
			discount: { $ref: '#/components/schemas/discount' },
			is_discount_before_tax: {
				$ref: '#/components/schemas/is_discount_before_tax',
			},
			discount_type: { $ref: '#/components/schemas/discount_type' },
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			item_id: { $ref: '#/components/schemas/item_id' },
			name: { $ref: '#/components/schemas/name' },
			description: { $ref: '#/components/schemas/description' },
			rate: { $ref: '#/components/schemas/rate' },
			quantity: { $ref: '#/components/schemas/quantity' },
			unit: { $ref: '#/components/schemas/unit' },
			avatax_tax_code: { $ref: '#/components/schemas/avatax_tax_code' },
			salesperson_name: { $ref: '#/components/schemas/salesperson_name' },
			shipping_charge: { $ref: '#/components/schemas/shipping_charge' },
			adjustment: { $ref: '#/components/schemas/adjustment' },
			adjustment_description: {
				$ref: '#/components/schemas/adjustment_description',
			},
		},
	},
	'create-a-recurring-invoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			recurring_invoice: {
				$ref: '#/components/schemas/recurring_invoice-response',
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
	currency_code: {
		description: 'The currency code in which the invoice is created.',
		type: 'string',
	},
	currency_id: {
		description: 'The currenct id of the currency',
		type: 'string',
	},
	custom_fields: {
		type: 'array',
		description: 'Custom fields associated with the recurring invoice.',
		items: {
			type: 'object',
			properties: {
				value: { $ref: '#/components/schemas/value' },
				label: { $ref: '#/components/schemas/label' },
				data_type: { $ref: '#/components/schemas/data_type' },
			},
		},
	},
	customer_email: {
		description:
			'Email address of the customer to whom the recurring invoice is raised.',
		type: 'string',
	},
	customer_id: {
		description:
			'Customer ID of the customer for whom the recurring invoice is raised.',
		type: 'string',
	},
	customer_mobile_phone: {
		description:
			'Mobile phone number of the customer to whom the recurring invoice is raised.',
		type: 'string',
	},
	customer_name: {
		description:
			'Name of the customer to whom the recurring invoice is raised.',
		type: 'string',
	},
	customer_phone: {
		description:
			'Phone number of the customer to whom the recurring invoice is raised.',
		type: 'string',
	},
	data_type: { description: 'Data type of the custom field.', type: 'string' },
	date: {
		description: 'The date on which recurring invoice is raised.',
		type: 'string',
	},
	date_description: { type: 'string' },
	'delete-a-recurring-invoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-recurring-invoice-bank-account-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-recurring-invoice-card-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	description: {
		description: 'A small description about the item. Max-length [2000]',
		type: 'string',
	},
	'disable-recurring-invoice-autobill-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	discount: {
		description:
			'Discount applied to the recurring invoice, which can be either a percentage or a flat amount. For percentage discounts, the value should include the % symbol (e.g., 10%). For sample, on Rs.1000, a 10% discount results in Rs.900, while a flat Rs.200 discount results in Rs.800.',
		type: 'string',
	},
	discount_type: {
		description:
			'How the discount is specified. Allowed values: <code>entity_level</code> and <code>item_level</code>.',
		type: 'string',
	},
	email: { description: 'Email address of the customer.', type: 'string' },
	'enable-recurring-invoice-autobill-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	end_date: {
		description: 'The date on which the recurring invoice expires.',
		type: 'string',
	},
	exchange_rate: {
		description: 'Exchange rate for the currency associated with the customer.',
		type: 'string',
	},
	fax: { description: "Customer's fax number.", type: 'string' },
	first_name: {
		description: 'First Name of the Contact Person.',
		type: 'string',
	},
	gateway_name: {
		description:
			'Name of the payment gateway associated with the invoice. E.g. paypal, stripe.Allowed Values: <code>paypal</code>, <code>authorize_net</code>, <code>payflow_pro</code>, <code>stripe</code>, <code>2checkout</code> and <code>braintree</code>',
		type: 'string',
	},
	'get-a-recurring-invoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			recurring_invoice: {
				type: 'object',
				properties: {
					recurring_invoice_id: {
						$ref: '#/components/schemas/recurring_invoice_id',
					},
					recurrence_name: { $ref: '#/components/schemas/recurrence_name' },
					reference_number: { $ref: '#/components/schemas/reference_number' },
					customer_name: { $ref: '#/components/schemas/customer_name' },
					customer_id: { $ref: '#/components/schemas/customer_id' },
					company_name: { $ref: '#/components/schemas/company_name' },
					contact_persons_associated: {
						$ref: '#/components/schemas/contact_persons_associated',
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
					tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
					is_reverse_charge_applied: {
						$ref: '#/components/schemas/is_reverse_charge_applied',
					},
					cfdi_usage: { $ref: '#/components/schemas/cfdi_usage' },
					vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
					place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
					customer_email: { $ref: '#/components/schemas/customer_email' },
					customer_mobile_phone: {
						$ref: '#/components/schemas/customer_mobile_phone',
					},
					customer_phone: { $ref: '#/components/schemas/customer_phone' },
					photo_url: { $ref: '#/components/schemas/photo_url' },
					currency_id: { $ref: '#/components/schemas/currency_id' },
					currency_code: { $ref: '#/components/schemas/currency_code' },
					start_date: { $ref: '#/components/schemas/start_date' },
					end_date: { $ref: '#/components/schemas/end_date' },
					last_sent_date: { $ref: '#/components/schemas/last_sent_date' },
					next_invoice_date: { $ref: '#/components/schemas/next_invoice_date' },
					location_id: { $ref: '#/components/schemas/location_id' },
					location_name: { $ref: '#/components/schemas/location_name' },
					tags: { $ref: '#/components/schemas/tags_response' },
					line_items: {
						description: 'Line items of an invoice.',
						type: 'array',
						items: {
							type: 'object',
							properties: {
								line_item_id: { $ref: '#/components/schemas/line_item_id' },
								quantity: { $ref: '#/components/schemas/quantity' },
								name: { $ref: '#/components/schemas/name' },
								item_total: { $ref: '#/components/schemas/item_total' },
								sku: { $ref: '#/components/schemas/sku' },
								product_type: { $ref: '#/components/schemas/product_type' },
								location_id: { $ref: '#/components/schemas/location_id' },
								location_name: { $ref: '#/components/schemas/location_name' },
								tags: { $ref: '#/components/schemas/tags_response' },
								tax_id: { $ref: '#/components/schemas/tax_id' },
								tax_treatment_code: {
									$ref: '#/components/schemas/tax_treatment_code',
								},
								project_id: { $ref: '#/components/schemas/project_id' },
								project_name: { $ref: '#/components/schemas/project_name' },
								line_item_category: {
									$ref: '#/components/schemas/line_item_category',
								},
							},
						},
					},
					paid_invoices_total: {
						$ref: '#/components/schemas/paid_invoices_total',
					},
					unpaid_invoices_balance: {
						$ref: '#/components/schemas/unpaid_invoices_balance',
					},
					billing_address: { $ref: '#/components/schemas/billing_address' },
					shipping_address: { $ref: '#/components/schemas/shipping_address' },
					payment_options: { $ref: '#/components/schemas/payment_options' },
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
	'get-recurring-invoice-dashboard-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
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
		'x-node_available_in': ['in', 'ke', 'za'],
		'x-node_unavailable_in': [],
	},
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
		type: 'string',
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
	is_whatsapp_enabled: {
		description:
			'Used to check if WhatsApp communication preference is enabled for the contact person at transaction level.',
		type: 'boolean',
		'x-node_available_in': ['WhatsApp integration'],
	},
	item_id: {
		description:
			'Unique string generated for the item for which invoice is to be sent.',
		type: 'string',
	},
	item_total: {
		description:
			'Total rate raised by this item. This would be the multiplicative product of item price and quantity.',
		type: 'number',
		format: 'double',
	},
	label: { description: 'Label of the custom field.', type: 'string' },
	last_name: {
		description: 'Last Name of the Contact Person.',
		type: 'string',
	},
	last_sent_date: {
		description: 'The date at which the last invoice was sent.',
		type: 'string',
	},
	line_item_category: {
		description:
			'Category of the line item. Allowed values are <code>line_item</code>, <code>header</code> and <code>subtotal</code>. Use <code>line_item</code> for regular line items, <code>header</code> for header titles and <code>subtotal</code> for intermediate subtotal rows. For regular line items, you can send line_item or omit this field',
		type: 'string',
	},
	line_item_id: { description: 'The line item id', type: 'string' },
	'list-all-recurring-invoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			recurring_invoices: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						recurring_invoice_id: {
							$ref: '#/components/schemas/recurring_invoice_id',
						},
						recurrence_name: { $ref: '#/components/schemas/recurrence_name' },
						customer_name: { $ref: '#/components/schemas/customer_name' },
						customer_id: { $ref: '#/components/schemas/customer_id' },
						currency_id: { $ref: '#/components/schemas/currency_id' },
						currency_code: { $ref: '#/components/schemas/currency_code' },
						start_date: { $ref: '#/components/schemas/start_date' },
						end_date: { $ref: '#/components/schemas/end_date' },
						last_sent_date: { $ref: '#/components/schemas/last_sent_date' },
						next_invoice_date: {
							$ref: '#/components/schemas/next_invoice_date',
						},
						custom_fields: { $ref: '#/components/schemas/custom_fields' },
						billing_address: { $ref: '#/components/schemas/billing_address' },
						shipping_address: { $ref: '#/components/schemas/shipping_address' },
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
	'list-recurring-invoice-child-invoices-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			invoice_history: {
				description:
					'The list of invoices generated from the recurring invoice.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						invoice_id: {
							description:
								'ID of the invoice. Note: This value is a set of numeric characters.',
							type: 'string',
						},
						invoice_number: {
							description: 'Number of the invoice.',
							type: 'string',
						},
						reference_number: {
							description: 'Reference number of the invoice.',
							type: 'string',
						},
						customer_name: {
							description: 'Name of the customer.',
							type: 'string',
						},
						date: { description: 'Date of the invoice.', type: 'string' },
						due_date: {
							description: 'Due date of the invoice.',
							type: 'string',
						},
						due_days: {
							description: 'Number of days until the invoice is due.',
							type: 'integer',
						},
						total: {
							description: 'Total amount of the invoice.',
							type: 'number',
						},
						balance: {
							description: 'Outstanding balance of the invoice.',
							type: 'number',
						},
						status: { description: 'Status of the invoice.', type: 'string' },
						allow_partial_payments: {
							description:
								'Whether partial payments are allowed for the invoice.',
							type: 'boolean',
						},
						source: {
							description: 'Source through which the invoice was created.',
							type: 'string',
						},
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
	'list-recurring-invoice-history-response': {
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
						comment_id: { $ref: '#/components/schemas/comment_id' },
						recurring_invoice_id: {
							$ref: '#/components/schemas/recurring_invoice_id',
						},
						comment_description: {
							$ref: '#/components/schemas/comment_description',
						},
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
	location_id: { description: 'Location ID', type: 'string' },
	location_name: { description: 'Name of the location', type: 'string' },
	mobile: {
		description: 'Mobile Number of the Contact Person.',
		type: 'string',
	},
	name: {
		description: 'The name of the line item. max-length [100]',
		type: 'string',
	},
	next_invoice_date: {
		description: 'The date at which next invoice is to be sent.',
		type: 'string',
	},
	operation_type: { type: 'string' },
	page: { type: 'integer' },
	paid_invoices_total: {
		description: 'Total of the all child invoices that have been paid.',
		type: 'number',
		format: 'double',
	},
	payment_gateways: {
		type: 'array',
		description:
			'List of payment gateways associated with the recurring invoice.',
		items: {
			type: 'object',
			properties: {
				configured: { $ref: '#/components/schemas/configured' },
				additional_field1: { $ref: '#/components/schemas/additional_field1' },
				gateway_name: { $ref: '#/components/schemas/gateway_name' },
			},
		},
	},
	payment_options: {
		type: 'object',
		properties: {
			payment_gateways: { $ref: '#/components/schemas/payment_gateways' },
		},
	},
	payment_terms: {
		description:
			'Payment terms in days. E.g: 15,30,60. Invoice due date will be calculated based on this.',
		type: 'integer',
	},
	payment_terms_label: {
		description:
			'Used to overridethe default payment terms label. Default value for 15 days is "Next 15 days".',
		type: 'string',
	},
	per_page: { type: 'integer' },
	phone: { description: 'Phone Number of the Contact Person.', type: 'string' },
	photo_url: {
		description: 'Gravatar photo url for the customer.',
		type: 'string',
	},
	place_of_supply: {
		description:
			'Place where the goods/services are supplied to. (If not given, <code>place of contact</code> given for the contact will be taken)<br/>Supported codes for UAE emirates are : </br>Abu Dhabi - <code>AB</code>,</br>Ajman - <code>AJ</code>,</br>Dubai - <code>DU</code>,</br>Fujairah - <code>FU</code>,</br>Ras al-Khaimah - <code>RA</code>,</br>Sharjah - <code>SH</code>,</br>Umm al-Quwain - <code>UM</code><br/>Supported codes for the GCC countries are : </br>United Arab Emirates - <code>AE</code>,</br>Saudi Arabia - <code>SA</code>,</br>Bahrain - <code>BH</code>,</br>Kuwait - <code>KW</code>,</br>Oman - <code>OM</code>,</br>Qatar - <code>QA</code>.',
		type: 'string',
		'x-node_available_in': ['in', 'gcc'],
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
	project_id: { description: 'ID of the project', type: 'string' },
	project_name: { description: 'Name of the project.', type: 'string' },
	quantity: {
		description: 'Quantity of the item included.',
		type: 'integer',
		format: 'int32',
	},
	rate: {
		description: 'Rate of the line item.',
		type: 'number',
		format: 'double',
	},
	recurrence_frequency: {
		description:
			'The frequency of time interval at which the invoice is to be generated. Allowed values: <code>days</code>, <code>weeks</code>, <code>months</code> and <code>years</code>.',
		type: 'string',
		enum: ['days', 'weeks', 'months', 'years'],
	},
	recurrence_name: {
		description:
			'Unique name for the recurring profile given by the user. Max-length [100]',
		type: 'string',
	},
	'recurring_invoice-response': {
		type: 'object',
		properties: {
			recurring_invoice_id: {
				$ref: '#/components/schemas/recurring_invoice_id',
			},
			recurrence_name: { $ref: '#/components/schemas/recurrence_name' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			customer_name: { $ref: '#/components/schemas/customer_name' },
			contact_persons_associated: {
				$ref: '#/components/schemas/contact_persons_associated',
			},
			is_pre_gst: { $ref: '#/components/schemas/is_pre_gst' },
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
			cfdi_usage: { $ref: '#/components/schemas/cfdi_usage' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			customer_id: { $ref: '#/components/schemas/customer_id' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			currency_code: { $ref: '#/components/schemas/currency_code' },
			start_date: { $ref: '#/components/schemas/start_date' },
			end_date: { $ref: '#/components/schemas/end_date' },
			last_sent_date: { $ref: '#/components/schemas/last_sent_date' },
			next_invoice_date: { $ref: '#/components/schemas/next_invoice_date' },
			location_id: { $ref: '#/components/schemas/location_id' },
			location_name: { $ref: '#/components/schemas/location_name' },
			tags: { $ref: '#/components/schemas/tags_response' },
			line_items: {
				description: 'Line items of an invoice.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						line_item_id: { $ref: '#/components/schemas/line_item_id' },
						quantity: { $ref: '#/components/schemas/quantity' },
						name: { $ref: '#/components/schemas/name' },
						item_total: { $ref: '#/components/schemas/item_total' },
						sku: { $ref: '#/components/schemas/sku' },
						product_type: { $ref: '#/components/schemas/product_type' },
						sat_item_key_code: {
							$ref: '#/components/schemas/sat_item_key_code',
						},
						unitkey_code: { $ref: '#/components/schemas/unitkey_code' },
						location_id: { $ref: '#/components/schemas/location_id' },
						location_name: { $ref: '#/components/schemas/location_name' },
						tags: { $ref: '#/components/schemas/tags_response' },
						tax_id: { $ref: '#/components/schemas/tax_id' },
						tax_treatment_code: {
							$ref: '#/components/schemas/tax_treatment_code',
						},
						project_id: { $ref: '#/components/schemas/project_id' },
						project_name: { $ref: '#/components/schemas/project_name' },
						line_item_category: {
							$ref: '#/components/schemas/line_item_category',
						},
					},
				},
			},
			billing_address: { $ref: '#/components/schemas/billing_address' },
			shipping_address: { $ref: '#/components/schemas/shipping_address' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			payment_options: { $ref: '#/components/schemas/payment_options' },
			avatax_exempt_no: { $ref: '#/components/schemas/avatax_exempt_no' },
			avatax_use_code: { $ref: '#/components/schemas/avatax_use_code' },
		},
	},
	recurring_invoice_id: {
		description: 'Unique ID of the recurring invoice generated by the server.',
		type: 'string',
	},
	reference_number: {
		description: 'The Order number of the Recurring Invoice.',
		type: 'string',
	},
	repeat_every: {
		description: 'The period between every recurrency frequency.',
		type: 'integer',
	},
	report_name: { type: 'string' },
	'resume-a-recurring-invoice-request': {
		type: 'object',
		properties: {
			recurring_invoice_id: {
				description:
					'Unique ID of the recurring invoice generated by the server.',
				type: 'string',
			},
		},
	},
	'resume-a-recurring-invoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'resume-recurring-invoices-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	salesperson_name: {
		description: 'Name of the sales person',
		type: 'string',
		'x-node_available_in': ['us', 'au', 'ca'],
		'x-node_unavailable_in': [],
	},
	sat_item_key_code: {
		description:
			'Add SAT Item Key Code for your goods/services. Download the <a href= http://omawww.sat.gob.mx/tramitesyservicios/Paginas/documentos/catCFDI_V_4_07122022.xls  >CFDI Catalogs.</a>',
		type: 'string',
		'x-node_available_in': ['mx'],
		'x-node_unavailable_in': [],
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
	shipping_charge: {
		description: 'Shipping charges applied to the invoice.',
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
	sku: { description: "Enter item's SKU information", type: 'string' },
	sort_column: {
		type: 'string',
		description: 'Column used to sort the recurring invoices list.',
	},
	sort_order: { type: 'string' },
	start_date: {
		description: 'The date on which the recurring invoice starts.',
		type: 'string',
	},
	state: {
		description: "State of the customer's billing address.",
		type: 'string',
	},
	'stop-a-recurring-invoice-request': {
		type: 'object',
		properties: {
			recurring_invoice_id: {
				description:
					'Unique ID of the recurring invoice generated by the server.',
				type: 'string',
			},
		},
	},
	'stop-a-recurring-invoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'stop-recurring-invoices-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	street2: {
		type: 'string',
		description: 'Additional street address information.',
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
	tax_authority_id: {
		description:
			'Unique ID of the tax authority. Tax authority depends on the location of the customer. For sample, if the customer is located in NY, then the tax authority is NY tax authority.',
		type: 'string',
		'x-node_available_in': ['us'],
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
			'ID of the tax or tax group associated to the recurring invoice.',
		type: 'string',
	},
	tax_treatment: {
		description:
			'Choose whether the vat treatment for the contact falls under: <code>vat_registered</code>,<code>vat_not_registered</code>,<code>gcc_vat_not_registered</code>,<code>gcc_vat_registered</code>,<code>non_gcc</code>.</br><code>dz_vat_registered</code> and <code>dz_vat_not_registered</code> supported only for <b>UAE</b>.</br><code>home_country_mexico</code>,<code>border_region_mexico</code>,<code>non_mexico</code> supported only for <b>MX</b>. <br/><b>For Kenya Edition:</b> <code>vat_registered</code> ,<code>vat_not_registered</code> ,<code>non_kenya</code>(A business that is located outside Kenya).<br/><b>For SouthAfrica Edition:</b> <code>vat_registered</code>, <code>vat_not_registered</code>, <code>overseas</code>(A business that is located outside SouthAfrica).',
		type: 'string',
		'x-node_available_in': ['gcc', 'mx', 'ke', 'za'],
		'x-node_unavailable_in': [],
	},
	tax_treatment_code: {
		description:
			'Specify reason for using out of scope.</br>Supported values for UAE are <code>uae_same_tax_group</code>, <code>uae_reimbursed_expense</code> and <code>uae_others</code>.</br> Supported values for Bahrain are <code>bahrain_same_tax_group</code>, <code>bahrain_transfer_of_concern</code>, <code>bahrain_disbursement</code>, <code>bahrain_head_to_branch_transaction</code>, <code>bahrain_warranty_repair_services</code> and <code>bahrain_others</code>.</br>Supported values for Saudi Arabia are <code>ksa_pvt_health</code>, <code>ksa_pvt_edu</code>, <code>ksa_reimbursed_expense</code> and <code>ksa_house_sales</code>.',
		type: 'string',
		'x-node_available_in': ['gcc'],
		'x-node_unavailable_in': [],
	},
	tds_tax_id: {
		description:
			'ID of the TDS tax or TDS tax group associated to the recurring invoice.',
		type: 'string',
		'x-node_available_in': ['mx'],
		'x-node_unavailable_in': [],
	},
	template_id: {
		description: 'Unique ID of the recurring invoice template.',
		type: 'string',
	},
	time: { type: 'string' },
	transaction_id: {
		description:
			'The transaction ID associated with the involved recurring invoices.',
		type: 'string',
	},
	transaction_type: { type: 'string' },
	unit: {
		description: 'Unit of the line item. E.g: kgs, Nos.',
		type: 'string',
	},
	unitkey_code: {
		description:
			'Add SAT Unit Key Code for your goods/services. Download the <a href= http://omawww.sat.gob.mx/tramitesyservicios/Paginas/documentos/catCFDI_V_4_07122022.xls  >CFDI Catalogs.</a>',
		type: 'string',
		'x-node_available_in': ['mx'],
		'x-node_unavailable_in': [],
	},
	unpaid_invoices_balance: {
		description: 'Balance of the all child invoices that have been raised.',
		type: 'number',
		format: 'double',
	},
	'update-recurring-invoice-request': {
		required: ['recurrence_name', 'customer_id', 'recurrence_frequency'],
		type: 'object',
		properties: {
			recurrence_name: { $ref: '#/components/schemas/recurrence_name' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			customer_id: { $ref: '#/components/schemas/customer_id' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			contact_persons_associated: {
				$ref: '#/components/schemas/contact_persons_associated_payload',
			},
			start_date: { $ref: '#/components/schemas/start_date' },
			end_date: { $ref: '#/components/schemas/end_date' },
			recurrence_frequency: {
				$ref: '#/components/schemas/recurrence_frequency',
			},
			repeat_every: { $ref: '#/components/schemas/repeat_every' },
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			is_reverse_charge_applied: {
				$ref: '#/components/schemas/is_reverse_charge_applied',
			},
			cfdi_usage: { $ref: '#/components/schemas/cfdi_usage' },
			allow_partial_payments: {
				$ref: '#/components/schemas/allow_partial_payments',
			},
			gst_no: { $ref: '#/components/schemas/gst_no' },
			shipping_gst_no: { $ref: '#/components/schemas/shipping_gst_no' },
			shipping_trader_name: {
				$ref: '#/components/schemas/shipping_trader_name',
			},
			shipping_legal_name: { $ref: '#/components/schemas/shipping_legal_name' },
			location_id: { $ref: '#/components/schemas/location_id' },
			tags: { $ref: '#/components/schemas/tags' },
			line_items: {
				description: 'Line items of an invoice.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						item_id: { $ref: '#/components/schemas/item_id' },
						name: { $ref: '#/components/schemas/name' },
						description: { $ref: '#/components/schemas/description' },
						rate: { $ref: '#/components/schemas/rate' },
						quantity: { $ref: '#/components/schemas/quantity' },
						discount: { $ref: '#/components/schemas/discount' },
						tags: { $ref: '#/components/schemas/tags' },
						tax_id: { $ref: '#/components/schemas/tax_id' },
						product_tax_category: {
							$ref: '#/components/schemas/product_tax_category',
						},
						tds_tax_id: { $ref: '#/components/schemas/tds_tax_id' },
						tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
						tax_treatment_code: {
							$ref: '#/components/schemas/tax_treatment_code',
						},
						avatax_tax_code: { $ref: '#/components/schemas/avatax_tax_code' },
						avatax_use_code: { $ref: '#/components/schemas/avatax_use_code' },
						item_total: { $ref: '#/components/schemas/item_total' },
						product_type: { $ref: '#/components/schemas/product_type' },
						hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
						sat_item_key_code: {
							$ref: '#/components/schemas/sat_item_key_code',
						},
						unitkey_code: { $ref: '#/components/schemas/unitkey_code' },
						location_id: { $ref: '#/components/schemas/location_id' },
						project_id: { $ref: '#/components/schemas/project_id' },
						line_item_category: {
							$ref: '#/components/schemas/line_item_category',
						},
					},
				},
			},
			email: { $ref: '#/components/schemas/email' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			tax_id: { $ref: '#/components/schemas/tax_id' },
			tax_authority_id: { $ref: '#/components/schemas/tax_authority_id' },
			payment_options: { $ref: '#/components/schemas/payment_options' },
			tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
			avatax_use_code: { $ref: '#/components/schemas/avatax_use_code' },
			avatax_exempt_no: { $ref: '#/components/schemas/avatax_exempt_no' },
		},
	},
	'update-recurring-invoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			recurring_invoice: {
				type: 'object',
				properties: {
					recurring_invoice_id: {
						$ref: '#/components/schemas/recurring_invoice_id',
					},
					recurrence_name: { $ref: '#/components/schemas/recurrence_name' },
					reference_number: { $ref: '#/components/schemas/reference_number' },
					customer_name: { $ref: '#/components/schemas/customer_name' },
					contact_persons_associated: {
						$ref: '#/components/schemas/contact_persons_associated',
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
					is_reverse_charge_applied: {
						$ref: '#/components/schemas/is_reverse_charge_applied',
					},
					tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
					cfdi_usage: { $ref: '#/components/schemas/cfdi_usage' },
					vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
					place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
					customer_id: { $ref: '#/components/schemas/customer_id' },
					currency_id: { $ref: '#/components/schemas/currency_id' },
					currency_code: { $ref: '#/components/schemas/currency_code' },
					start_date: { $ref: '#/components/schemas/start_date' },
					end_date: { $ref: '#/components/schemas/end_date' },
					last_sent_date: { $ref: '#/components/schemas/last_sent_date' },
					next_invoice_date: { $ref: '#/components/schemas/next_invoice_date' },
					location_id: { $ref: '#/components/schemas/location_id' },
					location_name: { $ref: '#/components/schemas/location_name' },
					tags: { $ref: '#/components/schemas/tags_response' },
					line_items: {
						description: 'Line items of an invoice.',
						type: 'array',
						items: {
							type: 'object',
							properties: {
								line_item_id: { $ref: '#/components/schemas/line_item_id' },
								quantity: { $ref: '#/components/schemas/quantity' },
								name: { $ref: '#/components/schemas/name' },
								item_total: { $ref: '#/components/schemas/item_total' },
								sku: { $ref: '#/components/schemas/sku' },
								product_type: { $ref: '#/components/schemas/product_type' },
								location_id: { $ref: '#/components/schemas/location_id' },
								location_name: { $ref: '#/components/schemas/location_name' },
								tags: { $ref: '#/components/schemas/tags_response' },
								tax_id: { $ref: '#/components/schemas/tax_id' },
								tax_treatment_code: {
									$ref: '#/components/schemas/tax_treatment_code',
								},
								project_id: { $ref: '#/components/schemas/project_id' },
								project_name: { $ref: '#/components/schemas/project_name' },
								line_item_category: {
									$ref: '#/components/schemas/line_item_category',
								},
							},
						},
					},
					billing_address: { $ref: '#/components/schemas/billing_address' },
					shipping_address: { $ref: '#/components/schemas/shipping_address' },
					payment_options: { $ref: '#/components/schemas/payment_options' },
					avatax_exempt_no: { $ref: '#/components/schemas/avatax_exempt_no' },
					avatax_use_code: { $ref: '#/components/schemas/avatax_use_code' },
				},
			},
		},
	},
	'update-recurring-invoice-template-request': {
		type: 'object',
		properties: {
			recurring_invoice_id: {
				description:
					'Unique ID of the recurring invoice generated by the server.',
				type: 'string',
			},
			template_id: {
				description: 'Unique ID of the recurring invoice template.',
				type: 'string',
			},
		},
	},
	'update-recurring-invoice-template-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	value: { description: 'Value of the custom field.', type: 'string' },
	vat_treatment: {
		description:
			'(Optional) VAT treatment for the invoices. VAT treatment denotes the location of the customer, if the customer resides in UK then the VAT treatment is <code>uk</code>. If the customer is in an EU country & VAT registered, you are resides in Northen Ireland and selling Goods then his VAT treatment is <code>eu_vat_registered</code>, if he resides outside of the UK then his VAT treatment is <code>overseas</code> (For Pre Brexit, this can be split as <code>eu_vat_registered</code>, <code>eu_vat_not_registered</code> and <code>non_eu</code>).',
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
		id: 'create_recurring_invoice',
		group: 'recurringInvoices',
		groupSlug: 'recurring-invoices',
		name: 'createRecurringInvoice',
		method: 'POST',
		path: '/recurringinvoices',
		summary: 'Create a Recurring Invoice',
		description: 'Creating a new recurring invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-invoices/',
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
				$ref: '#/components/schemas/create-a-recurring-invoice-request',
			},
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/create-a-recurring-invoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_recurring_invoices',
		group: 'recurringInvoices',
		groupSlug: 'recurring-invoices',
		name: 'listRecurringInvoices',
		method: 'GET',
		path: '/recurringinvoices',
		summary: 'List all  Recurring Invoice',
		description: 'List the details of all recurring invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-invoices/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'recurrence_name',
				in: 'query',
				required: false,
				description:
					'Unique name for the recurring profile given by the user. Max-length [100]',
				schema: { type: 'string' },
			},
			{
				name: 'item_name',
				in: 'query',
				required: false,
				description:
					'Search recurring invoices by item name. Variants: <code>item_name_startswith</code> and <code>profileitemname_contains</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'item_description',
				in: 'query',
				required: false,
				description:
					'Search recurring invoices by item description. Variants: <code>item_description_startswith</code> and <code>item_description_contains</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'customer_name',
				in: 'query',
				required: false,
				description:
					'Name of the customer to whom the recurring invoice is raised.',
				schema: { type: 'string' },
			},
			{
				name: 'line_item_id',
				in: 'query',
				required: false,
				description: 'The line item id',
				schema: { type: 'string' },
			},
			{
				name: 'item_id',
				in: 'query',
				required: false,
				description:
					'Unique string generated for the item for which invoice is to be sent.',
				schema: { type: 'string' },
			},
			{
				name: 'tax_id',
				in: 'query',
				required: false,
				description:
					'ID of the tax or tax group associated to the recurring invoice.',
				schema: { type: 'string' },
			},
			{
				name: 'notes',
				in: 'query',
				required: false,
				description: 'A short note for the recurring invoice.',
				schema: { type: 'string' },
			},
			{
				name: 'start_date',
				in: 'query',
				required: false,
				description: 'The date on which the recurring invoice starts.',
				schema: { type: 'string' },
			},
			{
				name: 'end_date',
				in: 'query',
				required: false,
				description: 'The date on which the recurring invoice expires.',
				schema: { type: 'string' },
			},
			{
				name: 'customer_id',
				in: 'query',
				required: false,
				description:
					'Customer ID of the customer for whom the recurring invoice is raised.',
				schema: { type: 'string' },
			},
			{
				name: 'status',
				in: 'query',
				required: false,
				description:
					'Status of the recurring invoice. This can be <code>active</code>, <code>stopped</code> or <code>expired</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'filter_by',
				in: 'query',
				required: false,
				description:
					'Filter  Recurring invoices by any status or payment expected date.Allowed Values: <code> Status.All</code>, <code>Status.Active</code>, <code> Status.Stopped</code>, <code>Status.Expired</code>',
				schema: { type: 'string' },
			},
			{
				name: 'search_text',
				in: 'query',
				required: false,
				description:
					'Search invoices by invoice number or purchase order or customer name. Max-length [100]',
				schema: { type: 'string' },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description: 'Column used to sort the recurring invoices list.',
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
					$ref: '#/components/schemas/list-all-recurring-invoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_recurring_invoice_using_custom_field',
		group: 'recurringInvoices',
		groupSlug: 'recurring-invoices',
		name: 'updateRecurringInvoiceUsingCustomField',
		method: 'PUT',
		path: '/recurringinvoices',
		summary: "Update a recurring invoice using a custom field's unique value",
		description:
			"A custom field will have unique values if it's configured to not accept duplicate values. Now, you can use that custom field's value to update a recurring invoice by providing its API name in the X-Unique-Identifier-Key header and its value in the X-Unique-Identifier-Value header. Based on this value, the corresponding recurring invoice will be retrieved and updated. Additionally, there is an optional X-Upsert header. If the X-Upsert header is true and the custom field's unique value is not found in any of the existing recurring invoices, a new recurring invoice will be created if the necessary payload details are available",
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-invoices/',
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
			schema: { $ref: '#/components/schemas/update-recurring-invoice-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-recurring-invoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_recurring_invoice',
		group: 'recurringInvoices',
		groupSlug: 'recurring-invoices',
		name: 'updateRecurringInvoice',
		method: 'PUT',
		path: '/recurringinvoices/{recurring_invoice_id}',
		summary: 'Update Recurring Invoice',
		description: 'Update the recurring invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-invoices/',
		parameters: [
			{
				name: 'recurring_invoice_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the recurring invoice.',
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
			schema: { $ref: '#/components/schemas/update-recurring-invoice-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-recurring-invoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_recurring_invoice',
		group: 'recurringInvoices',
		groupSlug: 'recurring-invoices',
		name: 'getRecurringInvoice',
		method: 'GET',
		path: '/recurringinvoices/{recurring_invoice_id}',
		summary: 'Get a Recurring Invoice',
		description: 'Get the details of a recurring invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-invoices/',
		parameters: [
			{
				name: 'recurring_invoice_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the recurring invoice.',
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
					$ref: '#/components/schemas/get-a-recurring-invoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_recurring_invoice',
		group: 'recurringInvoices',
		groupSlug: 'recurring-invoices',
		name: 'deleteRecurringInvoice',
		method: 'DELETE',
		path: '/recurringinvoices/{recurring_invoice_id}',
		summary: 'Delete a Recurring Invoice',
		description: 'Delete an existing recurring invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-invoices/',
		parameters: [
			{
				name: 'recurring_invoice_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the recurring invoice.',
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
					$ref: '#/components/schemas/delete-a-recurring-invoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'stop_recurring_invoice',
		group: 'recurringInvoices',
		groupSlug: 'recurring-invoices',
		name: 'stopRecurringInvoice',
		method: 'POST',
		path: '/recurringinvoices/{recurring_invoice_id}/status/stop',
		summary: 'Stop a Recurring Invoice',
		description: 'Stop an active recurring invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-invoices/',
		parameters: [
			{
				name: 'recurring_invoice_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the recurring invoice.',
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
			schema: { $ref: '#/components/schemas/stop-a-recurring-invoice-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/stop-a-recurring-invoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'resume_recurring_invoice',
		group: 'recurringInvoices',
		groupSlug: 'recurring-invoices',
		name: 'resumeRecurringInvoice',
		method: 'POST',
		path: '/recurringinvoices/{recurring_invoice_id}/status/resume',
		summary: 'Resume a Recurring Invoice',
		description: 'Resume a stopped recurring invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-invoices/',
		parameters: [
			{
				name: 'recurring_invoice_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the recurring invoice.',
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
				$ref: '#/components/schemas/resume-a-recurring-invoice-request',
			},
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/resume-a-recurring-invoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_recurring_invoice_template',
		group: 'recurringInvoices',
		groupSlug: 'recurring-invoices',
		name: 'updateRecurringInvoiceTemplate',
		method: 'PUT',
		path: '/recurringinvoices/{recurring_invoice_id}/templates/{template_id}',
		summary: 'Update Recurring Invoice template',
		description:
			'Update the pdf template associated with the recurring invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-invoices/',
		parameters: [
			{
				name: 'recurring_invoice_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the recurring invoice.',
				schema: { type: 'string' },
			},
			{
				name: 'template_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the recurring invoice template.',
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
				$ref: '#/components/schemas/update-recurring-invoice-template-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-recurring-invoice-template-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_recurring_invoice_history',
		group: 'recurringInvoices',
		groupSlug: 'recurring-invoices',
		name: 'listRecurringInvoiceHistory',
		method: 'GET',
		path: '/recurringinvoices/{recurring_invoice_id}/comments',
		summary: 'List Recurring Invoice History',
		description:
			'Get the complete history and comments of a recurring invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-invoices/',
		parameters: [
			{
				name: 'recurring_invoice_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the recurring invoice.',
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
					$ref: '#/components/schemas/list-recurring-invoice-history-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'resume_recurring_invoices',
		group: 'recurringInvoices',
		groupSlug: 'recurring-invoices',
		name: 'resumeRecurringInvoices',
		method: 'POST',
		path: '/recurringinvoices/status/resume',
		summary: 'Resume recurring invoices',
		description:
			'Resume multiple stopped recurring invoices in a single request. The recurring invoices resume generating child invoices on their schedule.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-invoices/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'recurring_invoice_ids',
				in: 'query',
				required: true,
				description:
					'Comma-separated IDs of the recurring invoices to resume. Note: This value is a set of numeric characters separated by comma.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/resume-recurring-invoices-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'stop_recurring_invoices',
		group: 'recurringInvoices',
		groupSlug: 'recurring-invoices',
		name: 'stopRecurringInvoices',
		method: 'POST',
		path: '/recurringinvoices/status/stop',
		summary: 'Stop recurring invoices',
		description:
			'Stop multiple active recurring invoices in a single request. The recurring invoices stop generating child invoices until they are resumed.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-invoices/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'recurring_invoice_ids',
				in: 'query',
				required: true,
				description:
					'Comma-separated IDs of the recurring invoices to stop. Note: This value is a set of numeric characters separated by comma.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/stop-recurring-invoices-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_recurring_invoice_dashboard',
		group: 'recurringInvoices',
		groupSlug: 'recurring-invoices',
		name: 'getRecurringInvoiceDashboard',
		method: 'GET',
		path: '/recurringinvoices/dashboard',
		summary: 'Get the recurring invoices dashboard',
		description:
			'Retrieve the dashboard summary for recurring invoices, including aggregated metrics for the recurring invoice profiles.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-invoices/',
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
					$ref: '#/components/schemas/get-recurring-invoice-dashboard-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'list_recurring_invoice_child_invoices',
		group: 'recurringInvoices',
		groupSlug: 'recurring-invoices',
		name: 'listRecurringInvoiceChildInvoices',
		method: 'GET',
		path: '/recurringinvoices/{recurring_invoice_id}/invoices',
		summary: 'List invoices created from a recurring invoice',
		description:
			'Retrieve the list of invoices generated from a recurring invoice profile. Use the filter and search parameters to narrow the results.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-invoices/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'recurring_invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the recurring invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'filter_by',
				in: 'query',
				required: false,
				description: 'Filter the child invoices by status.',
				schema: { type: 'string' },
			},
			{
				name: 'search_text',
				in: 'query',
				required: false,
				description: 'Search the child invoices by text.',
				schema: { type: 'string' },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description: 'Sort the child invoices by the specified column.',
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
				description:
					'Number of records to be fetched per page. Default value is 200.',
				schema: { type: 'integer', default: 200 },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/list-recurring-invoice-child-invoices-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.READ'],
		riskLevel: 'read',
	},
	{
		id: 'enable_recurring_invoice_autobill',
		group: 'recurringInvoices',
		groupSlug: 'recurring-invoices',
		name: 'enableRecurringInvoiceAutobill',
		method: 'POST',
		path: '/recurringinvoices/{recurring_invoice_id}/autobill/enable',
		summary: 'Enable auto-bill for a recurring invoice',
		description:
			'Enable auto-bill for a recurring invoice so that generated invoices are charged automatically to the associated card or bank account.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-invoices/',
		parameters: [
			{
				name: 'recurring_invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the recurring invoice. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/enable-recurring-invoice-autobill-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'disable_recurring_invoice_autobill',
		group: 'recurringInvoices',
		groupSlug: 'recurring-invoices',
		name: 'disableRecurringInvoiceAutobill',
		method: 'POST',
		path: '/recurringinvoices/{recurring_invoice_id}/autobill/disable',
		summary: 'Disable auto-bill for a recurring invoice',
		description:
			'Disable auto-bill for a recurring invoice so that generated invoices are no longer charged automatically.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-invoices/',
		parameters: [
			{
				name: 'recurring_invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the recurring invoice. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/disable-recurring-invoice-autobill-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_recurring_invoice_bank_account',
		group: 'recurringInvoices',
		groupSlug: 'recurring-invoices',
		name: 'deleteRecurringInvoiceBankAccount',
		method: 'DELETE',
		path: '/recurringinvoices/{recurring_invoice_id}/bankaccount',
		summary: 'Delete the bank account of a recurring invoice',
		description:
			'Remove the bank account associated with a recurring invoice for auto-bill.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-invoices/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'recurring_invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the recurring invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'can_delete_in_customer',
				in: 'query',
				required: false,
				description:
					'Whether to also remove the bank account from the associated customer.',
				schema: { type: 'boolean' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/delete-recurring-invoice-bank-account-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'delete_recurring_invoice_card',
		group: 'recurringInvoices',
		groupSlug: 'recurring-invoices',
		name: 'deleteRecurringInvoiceCard',
		method: 'DELETE',
		path: '/recurringinvoices/{recurring_invoice_id}/card',
		summary: 'Delete the card of a recurring invoice',
		description:
			'Remove the card associated with a recurring invoice for auto-bill.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-invoices/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'recurring_invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the recurring invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'can_delete_in_customer',
				in: 'query',
				required: false,
				description:
					'Whether to also remove the card from the associated customer.',
				schema: { type: 'boolean' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/delete-recurring-invoice-card-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'associate_recurring_invoice_bank_account',
		group: 'recurringInvoices',
		groupSlug: 'recurring-invoices',
		name: 'associateRecurringInvoiceBankAccount',
		method: 'POST',
		path: '/recurringinvoices/{recurring_invoice_id}/bankaccount/{account_id}',
		summary: 'Associate a bank account with a recurring invoice',
		description:
			'Associate a bank account with a recurring invoice for auto-bill so that generated invoices are charged to this bank account.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-invoices/',
		parameters: [
			{
				name: 'recurring_invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the recurring invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the bank account. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/associate-recurring-invoice-bank-account-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'associate_recurring_invoice_card',
		group: 'recurringInvoices',
		groupSlug: 'recurring-invoices',
		name: 'associateRecurringInvoiceCard',
		method: 'POST',
		path: '/recurringinvoices/{recurring_invoice_id}/card/{card_id}',
		summary: 'Associate a card with a recurring invoice',
		description:
			'Associate a card with a recurring invoice for auto-bill so that generated invoices are charged to this card.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-invoices/',
		parameters: [
			{
				name: 'recurring_invoice_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the recurring invoice. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'card_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the card. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/associate-recurring-invoice-card-response',
				},
			},
		],
		scopes: ['ZohoBooks.invoices.CREATE'],
		riskLevel: 'write',
	},
] as const satisfies readonly ZohoBooksOperationDefinition[];
