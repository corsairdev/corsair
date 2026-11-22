import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas = {
	'add-additional-address-request': {
		type: 'object',
		properties: {
			attention: { $ref: '#/components/schemas/attention' },
			address: { $ref: '#/components/schemas/address' },
			street2: { $ref: '#/components/schemas/street2' },
			city: { $ref: '#/components/schemas/city' },
			state: { $ref: '#/components/schemas/state' },
			zip: { $ref: '#/components/schemas/zip' },
			country: { $ref: '#/components/schemas/country' },
			fax: { $ref: '#/components/schemas/fax' },
			phone: {
				description:
					'The contact phone number associated with the address. Max-length [50]',
				type: 'string',
			},
		},
	},
	'add-additional-address-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			address_info: { $ref: '#/components/schemas/address_info' },
		},
	},
	'add-contact-attachment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'add-contact-bank-account-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'add-contact-card-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'add-contact-comment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'add-contact-tax-info-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	address: {
		description: 'Street 1 address for the contact. Max-length [500].',
		type: 'string',
	},
	address_id: {
		description:
			'Address id of the address. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	address_info: {
		description: 'Additional address information for the contact.',
		type: 'object',
		properties: {
			address_id: { $ref: '#/components/schemas/address_id' },
			attention: { $ref: '#/components/schemas/attention' },
			address: { $ref: '#/components/schemas/address' },
			street2: { $ref: '#/components/schemas/street2' },
			city: { $ref: '#/components/schemas/city' },
			state: { $ref: '#/components/schemas/state' },
			zip: { $ref: '#/components/schemas/zip' },
			country: { $ref: '#/components/schemas/country' },
			fax: { $ref: '#/components/schemas/fax' },
			phone: {
				description:
					'The contact phone number associated with the address. Max-length [50]',
				type: 'string',
			},
		},
	},
	applied_filter: { description: 'The filer applied', type: 'string' },
	'approve-contact-bank-account-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	attachments: {
		description:
			'Files to be attached to the email. It has to be sent in multipart/formdata',
		type: 'string',
		format: 'binary',
	},
	attention: {
		description:
			'Attention for proper delivery and routing of business correspondence. Max-length [100].',
		type: 'string',
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
	bill_template_id: {
		description:
			'Default bill template id used for this vendor while creating bill. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	billing_address: {
		description: 'Billing address information for the contact.',
		type: 'object',
		properties: {
			attention: { $ref: '#/components/schemas/attention' },
			address: { $ref: '#/components/schemas/address' },
			street2: { $ref: '#/components/schemas/street2' },
			state_code: { $ref: '#/components/schemas/state_code' },
			city: { $ref: '#/components/schemas/city' },
			state: { $ref: '#/components/schemas/state' },
			zip: { $ref: '#/components/schemas/zip' },
			country: { $ref: '#/components/schemas/country' },
			fax: { $ref: '#/components/schemas/fax' },
			phone: {
				description:
					'The contact phone number associated with the address. Max-length [50]',
				type: 'string',
			},
		},
	},
	body: {
		description: 'Body of an email has to be sent. Max-length [5000]',
		type: 'string',
	},
	cc_mail_ids: {
		description: 'Array of email address of the recipients to be cced.',
		type: 'array',
		items: { type: 'string' },
	},
	city: {
		description: 'City name for the address. Max-length [100].',
		type: 'string',
	},
	comment_id: {
		description:
			'ID of the comment. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	commented_by: {
		description: 'The name of the individual to whom the comment belongs',
		type: 'string',
	},
	commented_by_id: {
		description:
			'ID of the commented by individual. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	communication_preference: {
		description: 'Preferred modes of communication for the contact person.',
		type: 'object',
		properties: {
			is_sms_enabled: {
				description:
					'Whether SMS text messages are allowed for the contact person.',
				type: 'boolean',
				'x-node_available_in': ['SMS integration'],
			},
			is_whatsapp_enabled: {
				description:
					'Whether WhatsApp messaging is allowed for the contact person.',
				type: 'boolean',
				'x-node_available_in': ['WhatsApp integration'],
			},
		},
	},
	company_name: {
		description:
			"Legal or registered contact's company name. Used for legal documents and formal communications. Max-length [200].",
		type: 'string',
	},
	'contact-1099-tracking-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'contact-bank-account-request': {
		type: 'object',
		properties: {
			gateway: {
				type: 'string',
				description:
					'Payment gateway through which the bank account is processed.',
			},
			account_number: { type: 'string', description: 'Bank account number.' },
			account_type: {
				type: 'string',
				description: 'Type of the bank account.',
			},
			routing_number: {
				type: 'string',
				description: 'Routing number of the bank account.',
			},
			check_number: {
				type: 'string',
				description: 'Check number associated with the bank account.',
			},
			bank_name: { type: 'string', description: 'Name of the bank.' },
			name: { type: 'string', description: 'Name on the bank account.' },
			first_name: {
				type: 'string',
				description: 'First name of the account holder.',
			},
			last_name: {
				type: 'string',
				description: 'Last name of the account holder.',
			},
			beneficiary_name: {
				type: 'string',
				description: 'Name of the beneficiary.',
			},
			street: {
				type: 'string',
				description: 'Street of the account holder address.',
			},
			city: {
				type: 'string',
				description: 'City of the account holder address.',
			},
			state: {
				type: 'string',
				description: 'State of the account holder address.',
			},
			country: {
				type: 'string',
				description: 'Country of the account holder address.',
			},
			zip: {
				type: 'string',
				description: 'ZIP or postal code of the account holder address.',
			},
			accept_license: {
				type: 'boolean',
				description: 'Whether the ACH authorization terms are accepted.',
			},
		},
	},
	'contact-card-request': {
		type: 'object',
		properties: {
			card_token: {
				type: 'string',
				description: 'Token of the card returned by the payment gateway.',
			},
			gateway: {
				type: 'string',
				description: 'Payment gateway through which the card is processed.',
			},
			card_number: { type: 'string', description: 'Card number.' },
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
			zip: {
				type: 'string',
				description: 'Billing ZIP or postal code of the card holder.',
			},
			expire_month: {
				type: 'integer',
				description: 'Expiry month of the card.',
			},
			expire_year: { type: 'integer', description: 'Expiry year of the card.' },
			is_primary: {
				type: 'boolean',
				description: 'Whether this is the primary card.',
			},
			is_backup: {
				type: 'boolean',
				description: 'Whether this is the backup card.',
			},
		},
	},
	'contact-comment-request': {
		type: 'object',
		properties: {
			description: { type: 'string', description: 'Content of the comment.' },
		},
	},
	'contact-owner-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'contact-response': {
		type: 'object',
		properties: {
			contact_id: { $ref: '#/components/schemas/contact_id' },
			contact_name: { $ref: '#/components/schemas/contact_name' },
			company_name: { $ref: '#/components/schemas/company_name' },
			has_transaction: { $ref: '#/components/schemas/has_transaction' },
			contact_type: { $ref: '#/components/schemas/contact_type' },
			customer_sub_type: { $ref: '#/components/schemas/customer_sub_type' },
			credit_limit: { $ref: '#/components/schemas/credit_limit' },
			is_portal_enabled: { $ref: '#/components/schemas/is_portal_enabled' },
			language_code: { $ref: '#/components/schemas/language_code' },
			is_taxable: { $ref: '#/components/schemas/is_taxable' },
			tax_id: { $ref: '#/components/schemas/tax_id' },
			tds_tax_id: { $ref: '#/components/schemas/tds_tax_id' },
			tax_name: { $ref: '#/components/schemas/tax_name' },
			tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
			tax_authority_id: { $ref: '#/components/schemas/tax_authority_id' },
			tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
			tax_authority_name: { $ref: '#/components/schemas/tax_authority_name' },
			tax_exemption_code: { $ref: '#/components/schemas/tax_exemption_code' },
			place_of_contact: { $ref: '#/components/schemas/place_of_contact' },
			gst_no: { $ref: '#/components/schemas/gst_no' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			tax_exemption_certificate_number: {
				$ref: '#/components/schemas/tax_exemption_certificate_number',
			},
			tax_regime: { $ref: '#/components/schemas/tax_regime' },
			legal_name: { $ref: '#/components/schemas/legal_name' },
			is_tds_registered: { $ref: '#/components/schemas/is_tds_registered' },
			gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
			is_linked_with_zohocrm: {
				$ref: '#/components/schemas/is_linked_with_zohocrm',
			},
			website: { $ref: '#/components/schemas/website' },
			owner_id: { $ref: '#/components/schemas/owner_id' },
			primary_contact_id: { $ref: '#/components/schemas/primary_contact_id' },
			pricebook_id: { $ref: '#/components/schemas/pricebook_id' },
			contact_number: { $ref: '#/components/schemas/contact_number' },
			ignore_auto_number_generation: {
				$ref: '#/components/schemas/ignore_auto_number_generation',
			},
			payment_terms: { $ref: '#/components/schemas/payment_terms' },
			payment_terms_label: { $ref: '#/components/schemas/payment_terms_label' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			currency_code: { $ref: '#/components/schemas/currency_code' },
			currency_symbol: { $ref: '#/components/schemas/currency_symbol' },
			opening_balances: { $ref: '#/components/schemas/opening_balances' },
			outstanding_receivable_amount: {
				$ref: '#/components/schemas/outstanding_receivable_amount',
			},
			outstanding_receivable_amount_bcy: {
				$ref: '#/components/schemas/outstanding_receivable_amount_bcy',
			},
			unused_credits_receivable_amount: {
				$ref: '#/components/schemas/unused_credits_receivable_amount',
			},
			unused_credits_receivable_amount_bcy: {
				$ref: '#/components/schemas/unused_credits_receivable_amount_bcy',
			},
			status: { $ref: '#/components/schemas/status' },
			payment_reminder_enabled: {
				$ref: '#/components/schemas/payment_reminder_enabled',
			},
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			billing_address: { $ref: '#/components/schemas/billing_address' },
			shipping_address: { $ref: '#/components/schemas/shipping_address' },
			facebook: { $ref: '#/components/schemas/facebook' },
			twitter: { $ref: '#/components/schemas/twitter' },
			contact_persons: {
				type: 'array',
				description: 'The list of contact persons associated with the contact.',
				items: {
					type: 'object',
					properties: {
						contact_person_id: {
							$ref: '#/components/schemas/contact_person_id',
						},
						salutation: { $ref: '#/components/schemas/salutation' },
						first_name: { $ref: '#/components/schemas/first_name' },
						last_name: { $ref: '#/components/schemas/last_name' },
						email: { $ref: '#/components/schemas/email' },
						phone: { $ref: '#/components/schemas/phone' },
						mobile: { $ref: '#/components/schemas/mobile' },
						designation: { $ref: '#/components/schemas/designation' },
						department: { $ref: '#/components/schemas/department' },
						skype: { $ref: '#/components/schemas/skype' },
						is_primary_contact: {
							$ref: '#/components/schemas/is_primary_contact',
						},
						communication_preference: {
							$ref: '#/components/schemas/communication_preference',
						},
						enable_portal: { $ref: '#/components/schemas/enable_portal' },
					},
				},
			},
			default_templates: { $ref: '#/components/schemas/default_templates' },
			notes: { $ref: '#/components/schemas/notes' },
			created_time: { $ref: '#/components/schemas/created_time' },
			last_modified_time: { $ref: '#/components/schemas/last_modified_time' },
		},
	},
	'contact-tags-request': {
		type: 'object',
		description: 'Reporting tags to associate with the contact.',
	},
	'contact-tax-info-request': {
		type: 'object',
		description: 'Tax information details for the contact.',
	},
	contact_comments: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				comment_id: { $ref: '#/components/schemas/comment_id' },
				contact_id: { $ref: '#/components/schemas/contact_id' },
				contact_name: { $ref: '#/components/schemas/contact_name' },
				description: { $ref: '#/components/schemas/description' },
				commented_by_id: { $ref: '#/components/schemas/commented_by_id' },
				commented_by: { $ref: '#/components/schemas/commented_by' },
				date: { $ref: '#/components/schemas/date' },
				date_description: { $ref: '#/components/schemas/date_description' },
				time: { $ref: '#/components/schemas/time' },
				transaction_id: { $ref: '#/components/schemas/transaction_id' },
				transaction_type: { $ref: '#/components/schemas/transaction_type' },
				is_entity_deleted: { $ref: '#/components/schemas/is_entity_deleted' },
				operation_type: { $ref: '#/components/schemas/operation_type' },
			},
		},
	},
	contact_id: {
		description:
			'Unique identifier for the contact. System-generated ID used for API operations. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	contact_name: {
		description:
			'Display name for the contact. It is used for searching and displaying contacts.',
		type: 'string',
	},
	contact_number: {
		description:
			'Contact number associated with the contact for internal tracking and identification purposes. Max-length [50].',
		type: 'string',
	},
	contact_person_id: {
		description:
			'Unique identifier for the contact person. System-generated ID for API operations. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	contact_persons: {
		type: 'array',
		description: 'The list of contact persons associated with the contact.',
		items: {
			type: 'object',
			properties: {
				salutation: { $ref: '#/components/schemas/salutation' },
				first_name: { $ref: '#/components/schemas/first_name' },
				last_name: { $ref: '#/components/schemas/last_name' },
				email: { $ref: '#/components/schemas/email' },
				phone: { $ref: '#/components/schemas/phone' },
				mobile: { $ref: '#/components/schemas/mobile' },
				designation: { $ref: '#/components/schemas/designation' },
				department: { $ref: '#/components/schemas/department' },
				skype: { $ref: '#/components/schemas/skype' },
				is_primary_contact: { $ref: '#/components/schemas/is_primary_contact' },
				communication_preference: {
					$ref: '#/components/schemas/communication_preference',
				},
				enable_portal: { $ref: '#/components/schemas/enable_portal' },
			},
		},
	},
	contact_type: {
		description:
			'Determines how the contact is treated in the system. Allowed values: <code>customer</code>, <code>vendor</code>.',
		type: 'string',
	},
	country: {
		description: 'Country name for the address. Max-length [100].',
		type: 'string',
	},
	country_code: {
		description:
			'<b>For UK Edition:</b> Two letter country code of a contact<br/> <b>For Avalara:</b> Two letter country code for the customer country, if your customer is not in US. Refer [AvaTax Codes for Countries and States][2].<br/> <b>For GCC Editions :</b> Two Letter country code for the GCC Country or the UAE emirate of the contact which will be considered as <b>place of supply</b>.<br/>Supported codes for UAE emirates are : </br>Abu Dhabi - <code>AB</code>,</br>Ajman - <code>AJ</code>,</br>Dubai - <code>DU</code>,</br>Fujairah - <code>FU</code>,</br>Ras al-Khaimah - <code>RA</code>,</br>Sharjah - <code>SH</code>,</br>Umm al-Quwain - <code>UM</code>.<br/>Supported codes for the GCC countries are : </br>United Arab Emirates - <code>AE</code>,</br>Saudi Arabia - <code>SA</code>,</br>Bahrain - <code>BH</code>,</br>Kuwait - <code>KW</code>,</br>Oman - <code>OM</code>,</br>Qatar - <code>QA</code>.',
		type: 'string',
		'x-node_available_in': ['uk', 'gcc', 'Avalara Integration'],
		'x-node_unavailable_in': [],
	},
	'create-a-contact-request': {
		required: ['contact_name'],
		type: 'object',
		properties: {
			contact_name: { $ref: '#/components/schemas/contact_name' },
			company_name: { $ref: '#/components/schemas/company_name' },
			website: { $ref: '#/components/schemas/website' },
			language_code: { $ref: '#/components/schemas/language_code' },
			contact_type: { $ref: '#/components/schemas/contact_type' },
			customer_sub_type: { $ref: '#/components/schemas/customer_sub_type' },
			credit_limit: { $ref: '#/components/schemas/credit_limit' },
			pricebook_id: { $ref: '#/components/schemas/pricebook_id' },
			contact_number: { $ref: '#/components/schemas/contact_number' },
			ignore_auto_number_generation: {
				$ref: '#/components/schemas/ignore_auto_number_generation',
			},
			tags: { $ref: '#/components/schemas/tags' },
			is_portal_enabled: { $ref: '#/components/schemas/is_portal_enabled' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			payment_terms: { $ref: '#/components/schemas/payment_terms' },
			payment_terms_label: { $ref: '#/components/schemas/payment_terms_label' },
			notes: { $ref: '#/components/schemas/notes' },
			billing_address: { $ref: '#/components/schemas/billing_address' },
			shipping_address: { $ref: '#/components/schemas/shipping_address' },
			contact_persons: { $ref: '#/components/schemas/contact_persons' },
			default_templates: { $ref: '#/components/schemas/default_templates' },
			custom_fields: {
				description: 'Custom fields of the contact.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						index: { $ref: '#/components/schemas/index' },
						value: { $ref: '#/components/schemas/value' },
					},
				},
			},
			opening_balances: { $ref: '#/components/schemas/opening_balances' },
			vat_reg_no: { $ref: '#/components/schemas/vat_reg_no' },
			owner_id: { $ref: '#/components/schemas/owner_id' },
			tax_reg_no: { $ref: '#/components/schemas/tax_reg_no' },
			tax_exemption_certificate_number: {
				$ref: '#/components/schemas/tax_exemption_certificate_number',
			},
			country_code: { $ref: '#/components/schemas/country_code' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			tax_regime: { $ref: '#/components/schemas/tax_regime' },
			legal_name: { $ref: '#/components/schemas/legal_name' },
			registration_details: {
				$ref: '#/components/schemas/registration_details',
			},
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			is_tds_registered: { $ref: '#/components/schemas/is_tds_registered' },
			place_of_contact: { $ref: '#/components/schemas/place_of_contact' },
			gst_no: { $ref: '#/components/schemas/gst_no' },
			gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
			tax_authority_name: { $ref: '#/components/schemas/tax_authority_name' },
			avatax_exempt_no: { $ref: '#/components/schemas/avatax_exempt_no' },
			avatax_use_code: { $ref: '#/components/schemas/avatax_use_code' },
			tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
			tax_exemption_code: { $ref: '#/components/schemas/tax_exemption_code' },
			tax_authority_id: { $ref: '#/components/schemas/tax_authority_id' },
			tax_id: { $ref: '#/components/schemas/tax_id' },
			tds_tax_id: { $ref: '#/components/schemas/tds_tax_id' },
			is_taxable: { $ref: '#/components/schemas/is_taxable' },
			facebook: { $ref: '#/components/schemas/facebook' },
			twitter: { $ref: '#/components/schemas/twitter' },
			track_1099: { $ref: '#/components/schemas/track_1099' },
			tax_id_type: { $ref: '#/components/schemas/tax_id_type' },
			tax_id_value: { $ref: '#/components/schemas/tax_id_value' },
		},
	},
	'create-a-contact-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			contact: { $ref: '#/components/schemas/contact-response' },
		},
	},
	created_time: {
		description:
			'Timestamp when the contact was initially created in the system.',
		type: 'string',
	},
	credit_limit: {
		description:
			"<b>For Customer Only :</b> The maximum credit amount that can be allowed for the customer. Once the customer's outstanding receivables reach this limit, the system will restrict the customer from creating any further transactions.",
		type: 'number',
		format: 'double',
	},
	creditnote_email_template_id: {
		description:
			'Default credit note email template id used for this customer while sending credit notes. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	creditnote_template_id: {
		description:
			'Default credit note template id used for this customer while creating credit note. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	currency_code: {
		description:
			"Three-letter ISO currency code for the currency assigned to this contact. If not specified, the organization's default currency will be used.",
		type: 'string',
	},
	currency_id: {
		description:
			'Unique identifier for the currency assigned to this contact. The currency_id must correspond to a valid currency configuration in the system. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	currency_symbol: {
		description:
			'Currency symbol that represents the currency assigned to this contact.',
		type: 'string',
	},
	custom_fields: {
		type: 'array',
		description: 'List of custom fields for the contact.',
		items: {
			type: 'object',
			properties: {
				index: { $ref: '#/components/schemas/index' },
				value: { $ref: '#/components/schemas/value' },
				label: { $ref: '#/components/schemas/label' },
			},
		},
	},
	customer_sub_type: {
		description:
			'<b>For Customer Only :</b> Additional classification for customers. Allowed values: <code>individual</code>, <code>business</code>.',
		type: 'string',
	},
	date: { type: 'string' },
	date_description: {
		description: 'Specifies in days when the comment was made',
		type: 'string',
	},
	'decline-contact-bank-account-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	default_templates: {
		type: 'object',
		properties: {
			invoice_template_id: { $ref: '#/components/schemas/invoice_template_id' },
			estimate_template_id: {
				$ref: '#/components/schemas/estimate_template_id',
			},
			creditnote_template_id: {
				$ref: '#/components/schemas/creditnote_template_id',
			},
			purchaseorder_template_id: {
				$ref: '#/components/schemas/purchaseorder_template_id',
			},
			salesorder_template_id: {
				$ref: '#/components/schemas/salesorder_template_id',
			},
			retainerinvoice_template_id: {
				$ref: '#/components/schemas/retainerinvoice_template_id',
			},
			paymentthankyou_template_id: {
				$ref: '#/components/schemas/paymentthankyou_template_id',
			},
			retainerinvoice_paymentthankyou_template_id: {
				$ref: '#/components/schemas/retainerinvoice_paymentthankyou_template_id',
			},
			invoice_email_template_id: {
				$ref: '#/components/schemas/invoice_email_template_id',
			},
			estimate_email_template_id: {
				$ref: '#/components/schemas/estimate_email_template_id',
			},
			creditnote_email_template_id: {
				$ref: '#/components/schemas/creditnote_email_template_id',
			},
			purchaseorder_email_template_id: {
				$ref: '#/components/schemas/purchaseorder_email_template_id',
			},
			salesorder_email_template_id: {
				$ref: '#/components/schemas/salesorder_email_template_id',
			},
			retainerinvoice_email_template_id: {
				$ref: '#/components/schemas/retainerinvoice_email_template_id',
			},
			paymentthankyou_email_template_id: {
				$ref: '#/components/schemas/paymentthankyou_email_template_id',
			},
			retainerinvoice_paymentthankyou_email_template_id: {
				$ref: '#/components/schemas/retainerinvoice_paymentthankyou_email_template_id',
			},
			statement_template_id: {
				$ref: '#/components/schemas/statement_template_id',
			},
			payment_remittance_email_template_id: {
				$ref: '#/components/schemas/payment_remittance_email_template_id',
			},
			bill_template_id: { $ref: '#/components/schemas/bill_template_id' },
		},
	},
	'delete-a-contact-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-additional-address-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-contact-bank-account-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-contact-card-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-contact-comment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-contact-document-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-contact-tag-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-contact-tax-info-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-contacts-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	department: {
		description:
			"Department of the contact person within the contact's company. Max-length [50].",
		type: 'string',
	},
	description: { type: 'string' },
	designation: {
		description:
			"Designation of the contact person within the contact's company. Max-length [100].",
		type: 'string',
	},
	'disable-contact-person-sms-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'disable-contact-portal-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'disable-payment-reminders-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'edit-additional-address-request': {
		required: ['address_id'],
		type: 'object',
		properties: {
			attention: { $ref: '#/components/schemas/attention' },
			address: { $ref: '#/components/schemas/address' },
			street2: { $ref: '#/components/schemas/street2' },
			city: { $ref: '#/components/schemas/city' },
			state: { $ref: '#/components/schemas/state' },
			zip: { $ref: '#/components/schemas/zip' },
			country: { $ref: '#/components/schemas/country' },
			fax: { $ref: '#/components/schemas/fax' },
			phone: {
				description:
					'The contact phone number associated with the address. Max-length [50]',
				type: 'string',
			},
			address_id: {
				description:
					'Address id of the address. Note: This value is a set of numeric characters.',
				type: 'string',
			},
		},
	},
	'edit-additional-address-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			address_info: { $ref: '#/components/schemas/address_info' },
		},
	},
	email: {
		description:
			'Email address of the contact person for business communications. Max-length [100].',
		type: 'string',
	},
	'email-contact-request': {
		required: ['to_mail_ids', 'subject', 'body'],
		type: 'object',
		properties: {
			to_mail_ids: { $ref: '#/components/schemas/to_mail_ids' },
			subject: {
				description: 'Subject of an email has to be sent. Max-length [1000]',
				type: 'string',
			},
			body: { $ref: '#/components/schemas/body' },
			attachments: { $ref: '#/components/schemas/attachments' },
		},
	},
	'email-contact-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'email-statement-request': {
		required: ['to_mail_ids', 'subject', 'body'],
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
	'email-statement-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'enable-contact-person-sms-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'enable-payment-reminders-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'enable-portal-access-request': {
		required: ['contact_persons'],
		type: 'object',
		properties: {
			contact_persons: {
				type: 'array',
				description: 'The list of contact persons associated with the contact.',
				items: {
					type: 'object',
					properties: {
						contact_person_id: {
							$ref: '#/components/schemas/contact_person_id',
						},
					},
				},
			},
		},
	},
	'enable-portal-access-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	enable_portal: {
		description:
			'Indicates whether the contact person should have access to the client portal. Allowed values: <code>true</code> and <code>false</code>.',
		type: 'boolean',
	},
	estimate_email_template_id: {
		description:
			'Default estimate email template id used for this customer while sending estimates. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	estimate_template_id: {
		description:
			'Default estimate template id used for this customer while creating estimate. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	exchange_rate: {
		description:
			"Currency exchange rate used to convert opening balance to organization's base currency.",
		type: 'number',
		format: 'double',
	},
	facebook: {
		description: 'Facebook profile URL for the contact. Max-length [100].',
		type: 'string',
	},
	fax: {
		description: 'Fax number for the address. Max-length [50].',
		type: 'string',
	},
	file_name: {
		description: 'The appropriate name of the file_name',
		type: 'string',
	},
	first_name: {
		description: 'First name of the contact person. Max-length [100].',
		type: 'string',
	},
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
	'get-contact-addresses-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			addresses: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						address_id: { $ref: '#/components/schemas/address_id' },
						attention: { $ref: '#/components/schemas/attention' },
						address: { $ref: '#/components/schemas/address' },
						street2: { $ref: '#/components/schemas/street2' },
						city: { $ref: '#/components/schemas/city' },
						state: { $ref: '#/components/schemas/state' },
						zip: { $ref: '#/components/schemas/zip' },
						country: { $ref: '#/components/schemas/country' },
						fax: { $ref: '#/components/schemas/fax' },
						phone: {
							description:
								'The contact phone number associated with the address. Max-length [50]',
							type: 'string',
						},
					},
				},
			},
		},
	},
	'get-contact-bank-account-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-contact-by-reference-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-contact-card-count-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-contact-card-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-contact-client-review-email-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-contact-contact-person-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-contact-document-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-contact-email-content-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-contact-income-and-expense-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-contact-inventory-summary-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-contact-opening-balances-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-contact-payment-method-email-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-contact-profit-and-loss-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-contact-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			contact: {
				type: 'object',
				properties: {
					contact_id: { $ref: '#/components/schemas/contact_id' },
					contact_name: { $ref: '#/components/schemas/contact_name' },
					company_name: { $ref: '#/components/schemas/company_name' },
					has_transaction: { $ref: '#/components/schemas/has_transaction' },
					contact_type: { $ref: '#/components/schemas/contact_type' },
					customer_sub_type: { $ref: '#/components/schemas/customer_sub_type' },
					credit_limit: { $ref: '#/components/schemas/credit_limit' },
					pricebook_id: { $ref: '#/components/schemas/pricebook_id' },
					contact_number: { $ref: '#/components/schemas/contact_number' },
					ignore_auto_number_generation: {
						$ref: '#/components/schemas/ignore_auto_number_generation',
					},
					is_taxable: { $ref: '#/components/schemas/is_taxable' },
					tax_id: { $ref: '#/components/schemas/tax_id' },
					tax_name: { $ref: '#/components/schemas/tax_name' },
					tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
					tax_authority_id: { $ref: '#/components/schemas/tax_authority_id' },
					tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
					tax_authority_name: {
						$ref: '#/components/schemas/tax_authority_name',
					},
					tax_exemption_code: {
						$ref: '#/components/schemas/tax_exemption_code',
					},
					place_of_contact: { $ref: '#/components/schemas/place_of_contact' },
					gst_no: { $ref: '#/components/schemas/gst_no' },
					tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
					tax_regime: { $ref: '#/components/schemas/tax_regime' },
					legal_name: { $ref: '#/components/schemas/legal_name' },
					is_tds_registered: { $ref: '#/components/schemas/is_tds_registered' },
					vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
					gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
					is_linked_with_zohocrm: {
						$ref: '#/components/schemas/is_linked_with_zohocrm',
					},
					website: { $ref: '#/components/schemas/website' },
					owner_id: { $ref: '#/components/schemas/owner_id' },
					primary_contact_id: {
						$ref: '#/components/schemas/primary_contact_id',
					},
					payment_terms: { $ref: '#/components/schemas/payment_terms' },
					payment_terms_label: {
						$ref: '#/components/schemas/payment_terms_label',
					},
					currency_id: { $ref: '#/components/schemas/currency_id' },
					currency_code: { $ref: '#/components/schemas/currency_code' },
					currency_symbol: { $ref: '#/components/schemas/currency_symbol' },
					opening_balances: { $ref: '#/components/schemas/opening_balances' },
					outstanding_receivable_amount: {
						$ref: '#/components/schemas/outstanding_receivable_amount',
					},
					outstanding_receivable_amount_bcy: {
						$ref: '#/components/schemas/outstanding_receivable_amount_bcy',
					},
					unused_credits_receivable_amount: {
						$ref: '#/components/schemas/unused_credits_receivable_amount',
					},
					unused_credits_receivable_amount_bcy: {
						$ref: '#/components/schemas/unused_credits_receivable_amount_bcy',
					},
					status: { $ref: '#/components/schemas/status' },
					facebook: { $ref: '#/components/schemas/facebook' },
					twitter: { $ref: '#/components/schemas/twitter' },
					payment_reminder_enabled: {
						$ref: '#/components/schemas/payment_reminder_enabled',
					},
					custom_fields: { $ref: '#/components/schemas/custom_fields' },
					billing_address: { $ref: '#/components/schemas/billing_address' },
					shipping_address: { $ref: '#/components/schemas/shipping_address' },
					contact_persons: {
						type: 'array',
						description:
							'The list of contact persons associated with the contact.',
						items: {
							type: 'object',
							properties: {
								contact_person_id: {
									$ref: '#/components/schemas/contact_person_id',
								},
								salutation: { $ref: '#/components/schemas/salutation' },
								first_name: { $ref: '#/components/schemas/first_name' },
								last_name: { $ref: '#/components/schemas/last_name' },
								email: { $ref: '#/components/schemas/email' },
								phone: { $ref: '#/components/schemas/phone' },
								mobile: { $ref: '#/components/schemas/mobile' },
								designation: { $ref: '#/components/schemas/designation' },
								department: { $ref: '#/components/schemas/department' },
								skype: { $ref: '#/components/schemas/skype' },
								is_primary_contact: {
									$ref: '#/components/schemas/is_primary_contact',
								},
								communication_preference: {
									$ref: '#/components/schemas/communication_preference',
								},
								enable_portal: { $ref: '#/components/schemas/enable_portal' },
							},
						},
					},
					default_templates: { $ref: '#/components/schemas/default_templates' },
					notes: { $ref: '#/components/schemas/notes' },
					created_time: { $ref: '#/components/schemas/created_time' },
					last_modified_time: {
						$ref: '#/components/schemas/last_modified_time',
					},
				},
			},
		},
	},
	'get-contact-sms-content-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-contact-statement-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-contact-unused-credits-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-contact-vendor-statement-email-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-contacts-sms-content-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-statement-mail-content-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			data: {
				type: 'object',
				properties: {
					body: { $ref: '#/components/schemas/body' },
					subject: { $ref: '#/components/schemas/subject' },
					to_contacts: { $ref: '#/components/schemas/to_contacts' },
					file_name: { $ref: '#/components/schemas/file_name' },
					from_emails: { $ref: '#/components/schemas/from_emails' },
					contact_id: { $ref: '#/components/schemas/contact_id' },
				},
			},
		},
	},
	'get-unused-retainer-payments-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			unused_credits_receivable: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						payment_id: {
							description:
								'Unique identifier for the retainer payment. Note: This value is a set of numeric characters.',
							type: 'string',
						},
						payment_number: {
							description: 'Payment reference number.',
							type: 'string',
						},
						date: {
							description: 'Date when the retainer payment was made.',
							type: 'string',
						},
						amount: {
							description: 'Total amount of the retainer payment.',
							type: 'number',
							format: 'double',
						},
						unused_amount: {
							description:
								'Amount that remains unused from the retainer payment.',
							type: 'number',
							format: 'double',
						},
						currency_id: {
							description:
								'Currency ID of the payment. Note: This value is a set of numeric characters.',
							type: 'string',
						},
						currency_code: {
							description: 'Currency code of the payment.',
							type: 'string',
						},
						currency_symbol: {
							description: 'Currency symbol of the payment.',
							type: 'string',
						},
						reference_number: {
							description: 'External reference number for the payment.',
							type: 'string',
						},
						payment_mode: {
							description: 'Mode of payment used.',
							type: 'string',
						},
						description: {
							description: 'Additional notes or description for the payment.',
							type: 'string',
						},
					},
				},
			},
		},
	},
	gst_no: {
		description:
			'15-digit GST identification number of the contact as issued by the Indian tax authorities.',
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
	has_more_page: { description: 'Check if has more pages', type: 'boolean' },
	has_transaction: {
		description:
			'Indicates whether the contact has \u0061ny transaction history in the system.',
		type: 'boolean',
	},
	ignore_auto_number_generation: {
		description:
			'Indicates whether the auto generation contact_number is ignored or not for the contact. Allowed values: <code>true</code>, <code>false</code>.',
		type: 'boolean',
	},
	index: {
		description:
			'Index of the custom field. It can hold any value from 1 to 10.',
		type: 'integer',
	},
	'invite-contact-person-to-portal-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	invoice_email_template_id: {
		description:
			'Default invoice email template id used for this customer while sending invoices. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	invoice_template_id: {
		description:
			'Default invoice template id used for this customer while creating invoice. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	is_entity_deleted: { description: 'Boolean check', type: 'boolean' },
	is_linked_with_zohocrm: {
		description: 'Indicates whether this contact is linked with Zoho CRM.',
		type: 'boolean',
	},
	is_portal_enabled: {
		description:
			'Indicates whether portal access is enabled for the primary contact person. Allowed value: <code>true</code> and <code>false</code>.',
		type: 'boolean',
	},
	is_primary_contact: {
		description:
			'Indicates whether this contact person is the primary contact. Only one per contact. Allowed values: <code>true</code> and <code>false</code>.',
		type: 'boolean',
	},
	is_taxable: {
		description:
			'Indicates whether the customer is subject to tax collection. Tax-related fields are only available when this field is set to true. Allowed values: <code>true</code> and <code>false</code>.',
		type: 'boolean',
		'x-node_available_in': ['us', 'ca', 'au', 'in', 'mx', 'ke', 'za'],
		'x-node_unavailable_in': [],
	},
	is_tds_registered: {
		description:
			'Indicates whether the contact is registered for Tax Deducted at Source (TDS) in Mexico.',
		type: 'boolean',
		'x-node_available_in': ['mx'],
		'x-node_unavailable_in': [],
	},
	label: { description: 'Label of the custom field.', type: 'string' },
	language_code: {
		description:
			'Preferred language for the contact. Determines portal language. Allowed values: <code>de,en,es,fr,it,ja,nl,pt,pt_br,sv,zh,en_gb</code>',
		type: 'string',
	},
	last_modified_time: {
		description:
			'Timestamp when the contact was last updated or modified in the system.',
		type: 'string',
	},
	last_name: {
		description: 'Last name of the contact person. Max-length [100].',
		type: 'string',
	},
	legal_name: {
		description:
			'Legal name of the contact as registered with the tax authority.',
		type: 'string',
		'x-node_available_in': ['mx', 'uae'],
		'x-node_unavailable_in': [],
	},
	'list-all-contact-bank-accounts-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'list-all-contact-persons-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'list-comments-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			contact_comments: { $ref: '#/components/schemas/contact_comments' },
			page_context: { $ref: '#/components/schemas/page_context' },
		},
	},
	'list-contact-addresses-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'list-contact-autobill-recurring-invoices-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			recurring_invoices: {
				description:
					'The list of recurring invoices auto-billed against the contact card.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						recurring_invoice_id: {
							description: 'ID of the recurring invoice.',
							type: 'string',
						},
						recurrence_name: {
							description: 'Name of the recurrence.',
							type: 'string',
						},
					},
				},
			},
		},
	},
	'list-contact-bank-accounts-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'list-contact-cards-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'list-contact-payment-refunds-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'list-contact-tax-info-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'list-contacts-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			contacts: {
				description: 'The list of all contacts.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						contact_id: { $ref: '#/components/schemas/contact_id' },
						contact_name: { $ref: '#/components/schemas/contact_name' },
						company_name: { $ref: '#/components/schemas/company_name' },
						contact_type: { $ref: '#/components/schemas/contact_type' },
						status: { $ref: '#/components/schemas/status' },
						payment_terms: { $ref: '#/components/schemas/payment_terms' },
						payment_terms_label: {
							$ref: '#/components/schemas/payment_terms_label',
						},
						currency_id: { $ref: '#/components/schemas/currency_id' },
						currency_code: { $ref: '#/components/schemas/currency_code' },
						outstanding_receivable_amount: {
							$ref: '#/components/schemas/outstanding_receivable_amount',
						},
						unused_credits_receivable_amount: {
							$ref: '#/components/schemas/unused_credits_receivable_amount',
						},
						first_name: { $ref: '#/components/schemas/first_name' },
						last_name: { $ref: '#/components/schemas/last_name' },
						email: { $ref: '#/components/schemas/email' },
						phone: { $ref: '#/components/schemas/phone' },
						mobile: { $ref: '#/components/schemas/mobile' },
						created_time: { $ref: '#/components/schemas/created_time' },
						last_modified_time: {
							$ref: '#/components/schemas/last_modified_time',
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
					applied_filter: { $ref: '#/components/schemas/applied_filter' },
					sort_column: { $ref: '#/components/schemas/sort_column' },
					sort_order: { $ref: '#/components/schemas/sort_order' },
				},
			},
		},
	},
	'list-refunds-response': {
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
							type: 'string',
							description:
								'Unique identifier for the credit note refund. Note: This value is a set of numeric characters.',
						},
						creditnote_id: {
							type: 'string',
							description:
								'Unique identifier for the credit note associated with the refund. Note: This value is a set of numeric characters.',
						},
						date: { type: 'string' },
						refund_mode: { type: 'string' },
						reference_number: { type: 'string' },
						creditnote_number: { type: 'string' },
						customer_name: { type: 'string' },
						description: { type: 'string' },
						amount_bcy: { type: 'string' },
						amount_fcy: { type: 'string' },
					},
				},
			},
			page_context: {
				description: 'The context of a particular page.',
				type: 'object',
				properties: {
					page: { description: 'Number of pages', type: 'integer' },
					per_page: { description: 'Per page values', type: 'integer' },
					has_more_page: {
						description: 'Check if has more pages',
						type: 'boolean',
					},
					report_name: {
						description: 'The displaying the  report name',
						type: 'string',
					},
					sort_column: { description: 'Param Description.', type: 'string' },
					sort_order: { description: 'The order for sorting', type: 'string' },
				},
			},
		},
	},
	location_id: {
		description:
			'Unique identifier for the business location associated with this opening balance. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	'mark-as-active-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'mark-as-inactive-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'mark-contact-address-as-billing-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'mark-contact-address-as-shipping-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'merge-contact-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	mobile: {
		description: 'Mobile number of the contact person. Max-length [50].',
		type: 'string',
	},
	notes: {
		description: 'Additional comments or notes about the contact.',
		type: 'string',
	},
	opening_balance_amount: {
		description:
			'Initial balance amount for the contact at the time of creation.',
		type: 'number',
		format: 'double',
	},
	opening_balances: {
		type: 'array',
		description: 'List of opening balances for the contact.',
		items: {
			type: 'object',
			properties: {
				location_id: { $ref: '#/components/schemas/location_id' },
				exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
				opening_balance_amount: {
					$ref: '#/components/schemas/opening_balance_amount',
				},
			},
		},
	},
	operation_type: {
		description: 'The type of operation carried out',
		type: 'string',
	},
	outstanding_receivable_amount: {
		description:
			'Total amount owed by the customer for all outstanding invoices and transactions.',
		type: 'integer',
	},
	outstanding_receivable_amount_bcy: {
		description:
			"Total amount owed by the customer in the organization's base currency.",
		type: 'integer',
	},
	owner_id: {
		description:
			'<b>For Customer Only :</b> Unique identifier for the user assigned as the owner of the contact. This field specifies which user in the organization is responsible for managing the business relationship with this contact. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	page: { description: 'Number of pages', type: 'integer' },
	page_context: {
		type: 'object',
		properties: {
			page: { $ref: '#/components/schemas/page' },
			per_page: { $ref: '#/components/schemas/per_page' },
			has_more_page: { $ref: '#/components/schemas/has_more_page' },
			applied_filter: { $ref: '#/components/schemas/applied_filter' },
			sort_column: { $ref: '#/components/schemas/sort_column' },
			sort_order: { $ref: '#/components/schemas/sort_order' },
		},
	},
	payment_reminder_enabled: {
		description:
			'Indicates whether automated payment reminders are enabled for this contact.',
		type: 'boolean',
	},
	payment_remittance_email_template_id: {
		description:
			'Default payment remittance email template id used for this contact while sending payment remittances. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	payment_terms: {
		description: 'Number of days allowed for payment after the invoice date.',
		type: 'integer',
	},
	payment_terms_label: {
		description:
			'Human-readable label of payment terms displayed on invoices and other transactions. Max-length [200].',
		type: 'string',
	},
	paymentthankyou_email_template_id: {
		description:
			'Default payment thank you email template id used for this contact while sending payment acknowledgment. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	paymentthankyou_template_id: {
		description:
			'Default payment thank you template id used for this contact while sending payment acknowledgment. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	per_page: { description: 'Per page values', type: 'integer' },
	phone: {
		description: 'Phone number of the contact person. Max-length [50].',
		type: 'string',
	},
	place_of_contact: {
		description:
			'State or union territory code where the contact is located for Indian tax purposes. (This node identifies the place of supply and source of supply when invoices/bills are raised for the customer/vendor respectively. This is not applicable for Overseas contacts)',
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	place_of_supply: {
		description:
			'Two-letter GCC country code indicating the place of supply for VAT purposes. Supported codes: United Arab Emirates - <code>AE</code>, Saudi Arabia - <code>SA</code>, Bahrain - <code>BH</code>, Kuwait - <code>KW</code>, Oman - <code>OM</code>, Qatar - <code>QA</code>.',
		type: 'string',
		'x-node_available_in': ['gcc'],
		'x-node_unavailable_in': [],
	},
	pricebook_id: {
		description:
			'Pricebook id which is associated with the contact. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	primary_contact_id: {
		description:
			'Unique identifier for the primary contact person of the contact. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	purchaseorder_email_template_id: {
		description:
			'Default purchase order email template id used for this vendor while sending purchase order. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	purchaseorder_template_id: {
		description:
			'Default purchase order template id used for this vendor while creating purchase order. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	registration_details: {
		description:
			'Registration details for UAE E-Invoicing compliance. Contains buyer identification, tax registration, and legal information required for Peppol E-Invoicing.',
		type: 'object',
		properties: {
			company_registration_no: {
				description:
					'Company registration number (Commercial Registration number). Maximum length: 200 characters.',
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
					'Value of the buyer identifier used in E-Invoicing (Buyer ID value). Maximum length: 200 characters.',
				type: 'string',
			},
			additionalfield1: {
				description:
					'Authority or scheme that issued the buyer identifier (Buyer ID authority, e.g. Department of Economy and Tourism). Maximum length: 200 characters.',
				type: 'string',
			},
			business_classification_type: {
				description:
					'Type of business classification scheme (e.g. <code>DUNS</code>, <code>GLN</code>). Maximum length: 200 characters.',
				type: 'string',
			},
			business_classification_value: {
				description:
					'Value of the business classification identifier. Maximum length: 200 characters.',
				type: 'string',
			},
			trader_name: {
				description:
					'Trade name of the contact. Maximum length: 500 characters.',
				type: 'string',
			},
			legal_name: {
				description:
					'Legal registered name of the contact. Required for UAE E-Invoicing. Maximum length: 500 characters.',
				type: 'string',
			},
			location_identifier_value: {
				description:
					'Value of the location identifier used in E-Invoicing. Maximum length: 200 characters.',
				type: 'string',
			},
			location_identifier_type: {
				description:
					'Type of the location identifier scheme. Maximum length: 200 characters.',
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
	'resend-contact-person-portal-invite-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'restore-contact-documents-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	retainerinvoice_email_template_id: {
		description:
			'Default retainer invoice email template id used for this contact while sending retainer invoice. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	retainerinvoice_paymentthankyou_email_template_id: {
		description:
			'Default retainer invoice payment thank you email template id used for this customer while sending payment acknowledgment for retainer invoices. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	retainerinvoice_paymentthankyou_template_id: {
		description:
			'Default retainer invoice payment thank you template id used for this customer while sending payment acknowledgment for retainer invoices. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	retainerinvoice_template_id: {
		description:
			'Default retainer invoice template id used for this customer while creating retainer invoice. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	salesorder_email_template_id: {
		description:
			'Default sales order email template id used for this customer while sending sales order. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	salesorder_template_id: {
		description:
			'Default sales order template id used for this customer while creating sales order. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	salutation: {
		description: 'Salutation for the contact. Max-length [25]',
		type: 'string',
	},
	selected: { description: 'Boolean to check for selection', type: 'boolean' },
	'send-contact-client-review-email-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'send-contact-payment-method-email-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'send-contact-sms-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'send-contact-vendor-statement-email-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'send-contacts-sms-response': {
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
	shipping_address: {
		description: 'Shipping address information for the contact.',
		type: 'object',
		properties: {
			attention: { $ref: '#/components/schemas/attention' },
			address: { $ref: '#/components/schemas/address' },
			street2: { $ref: '#/components/schemas/street2' },
			state_code: { $ref: '#/components/schemas/state_code' },
			city: { $ref: '#/components/schemas/city' },
			state: { $ref: '#/components/schemas/state' },
			zip: { $ref: '#/components/schemas/zip' },
			country: { $ref: '#/components/schemas/country' },
			fax: { $ref: '#/components/schemas/fax' },
			phone: {
				description:
					'The contact phone number associated with the address. Max-length [50]',
				type: 'string',
			},
		},
	},
	skype: {
		description: 'Skype username of the contact person. Max-length [50].',
		type: 'string',
	},
	sort_column: {
		description:
			'Param Description.Allowed Values: <code>contact_person_id</code>',
		type: 'string',
	},
	sort_order: { description: 'The order for sorting', type: 'string' },
	state: {
		description: 'State for the address. Max-length [100].',
		type: 'string',
	},
	state_code: {
		description: 'State or province code for the address. Max-length [100].',
		type: 'string',
	},
	statement_template_id: {
		description:
			'Default statement template id used for this contact while creating statement. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	status: {
		description:
			'Indicates whether the contact is active or inactive. Allowed values: active, inactive.',
		type: 'string',
	},
	street2: {
		description: 'Street 2 address for the contact. Max-length [255].',
		type: 'string',
	},
	subject: {
		description: 'Subject of an email has to be sent. Max-length [1000]',
		type: 'string',
	},
	tag_id: {
		description: "Tag's ID. Note: This value is a set of numeric characters.",
		type: 'string',
	},
	tag_option_id: {
		description:
			"Tag Option's ID. Note: This value is a set of numeric characters.",
		type: 'string',
	},
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
	tax_authority_id: {
		description:
			"Unique identifier for the tax authority responsible for the customer's tax jurisdiction. Tax authority depends on the location of the customer. For sample, if the customer is located in NY, then the tax authority is NY tax authority. Note: This value is a set of numeric characters.",
		type: 'string',
		'x-node_available_in': ['us'],
		'x-node_unavailable_in': [],
	},
	tax_authority_name: {
		description:
			"Display name of the tax authority responsible for the customer's tax jurisdiction.",
		type: 'string',
	},
	tax_exemption_certificate_number: {
		description:
			'Tax Exemption Certificate number is issued by the Kenya Revenue Authority (KRA) to organizations or individuals who qualify for tax exemption',
		type: 'string',
		'x-node_available_in': ['ke'],
		'x-node_unavailable_in': [],
	},
	tax_exemption_code: {
		description:
			'Code identifier for the tax exemption assigned to the contact.',
		type: 'string',
		'x-node_available_in': ['us', 'ca', 'au', 'in'],
		'x-node_unavailable_in': [],
	},
	tax_exemption_id: {
		description:
			'Unique identifier for the tax exemption configuration assigned to this contact. Note: This value is a set of numeric characters.',
		type: 'string',
		'x-node_available_in': ['us', 'ca', 'au', 'in'],
		'x-node_unavailable_in': [],
	},
	tax_id: {
		description:
			'Unique identifier for the tax or tax group assigned to the contact. Available only when <code>is_taxable</code> is <code>true</code>. Note: This value is a set of numeric characters.',
		type: 'string',
		'x-node_available_in': ['in', 'us'],
		'x-node_unavailable_in': [],
	},
	tax_id_type: {
		description:
			'Tax ID type of the contact, it can be SSN, ATIN, ITIN or EIN.',
		type: 'string',
		'x-node_available_in': ['us'],
		'x-node_unavailable_in': [],
	},
	tax_id_value: {
		description: 'Tax ID of the contact.',
		type: 'string',
		'x-node_available_in': ['us'],
		'x-node_unavailable_in': [],
	},
	tax_name: {
		description: 'Display name of the tax assigned to the contact.',
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	tax_percentage: {
		description: 'Tax percentage assigned to the contact.',
		type: 'number',
		format: 'double',
	},
	tax_reg_no: {
		description:
			'<b>For GCC Edition:</b> 15 digit Tax Registration number of a contact with Tax treatment as <code>vat_registered</code>,<code>gcc_vat_registered</code>,<code>dz_vat_registered</code>.<br/><b>For Mexico Edition:</b> 12 digit Tax Registration number of a contact with Tax treatment as </br> <code>home_country_mexico</code>, <code>border_region_mexico</code>, <code>non_mexico</code>.</br> Consumers generic RFC: <code>XAXX010101000</code>, Overseas generic RFC: <code>XEXX010101000</code>.<br/><b>For Kenya Edition:</b> 11 digit Tax Registration number of a contact with Tax treatment as <code>vat_registered</code><br/><b>For SouthAfrica Edition:</b> 10 digit Tax Registration number of a contact with Tax treatment as <code>vat_registered</code>',
		type: 'string',
		'x-node_available_in': ['gcc', 'mx', 'ke', 'za'],
		'x-node_unavailable_in': [],
	},
	tax_regime: {
		description:
			'Tax Regime of the contact.Allowed Values: <code>general_legal_person</code>, <code>legal_entities_non_profit</code>, <code>resident_abroad</code>, <code>production_cooperative_societies</code>, <code>agricultural_livestock</code>, <code>optional_group_of_companies</code>, <code>coordinated</code>, <code>simplified_trust</code>, <code>wages_salaries_income</code>, <code>lease</code>, <code>property_disposal_acquisition</code>, <code>other_income</code>, <code>resident_abroad</code>, <code>divident_income</code>, <code>individual_business_professional</code>, <code>interest_income</code>, <code>income_obtaining_price</code>, <code>no_tax_obligation</code>, <code>tax_incorporation</code>, <code>income_through_technology_platform</code>, <code>simplified_trust</code>.',
		type: 'string',
		'x-node_available_in': ['mx'],
		'x-node_unavailable_in': [],
	},
	tax_treatment: {
		description:
			'Tax treatment of the contact. Allowed values for GCC/UAE: <code>vat_registered</code>, <code>vat_not_registered</code>, <code>gcc_vat_not_registered</code>, <code>gcc_vat_registered</code>, <code>non_gcc</code>, <code>dz_vat_registered</code>, <code>dz_vat_not_registered</code>, <code>out_of_scope</code>, <code>gcc_non_vat</code>, <code>fz_vat_registered</code>, and <code>fz_vat_not_registered</code>. For Mexico Edition: <code>home_country_mexico</code>, <code>border_region_mexico</code>, and <code>non_mexico</code>. For Kenya Edition: <code>vat_registered</code>, <code>vat_not_registered</code>, and <code>non_kenya</code>. For South Africa Edition: <code>vat_registered</code>, <code>vat_not_registered</code>, and <code>overseas</code>.',
		type: 'string',
		default: 'vat_not_registered',
		'x-node_available_in': ['gcc', 'mx', 'ke', 'za', 'uae'],
		'x-node_unavailable_in': [],
	},
	tds_tax_id: {
		description:
			'Unique identifier for the Tax Deducted at Source (TDS) tax configuration assigned to the contact. Note: This value is a set of numeric characters.',
		type: 'string',
		'x-node_available_in': ['mx'],
		'x-node_unavailable_in': [],
	},
	time: { description: 'The time of the comment', type: 'string' },
	to_contacts: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				first_name: { $ref: '#/components/schemas/first_name' },
				selected: { $ref: '#/components/schemas/selected' },
				phone: { $ref: '#/components/schemas/phone' },
				email: { $ref: '#/components/schemas/email' },
				contact_person_id: { $ref: '#/components/schemas/contact_person_id' },
				last_name: { $ref: '#/components/schemas/last_name' },
				salutation: { $ref: '#/components/schemas/salutation' },
				mobile: { $ref: '#/components/schemas/mobile' },
			},
		},
	},
	to_mail_ids: {
		description: 'Array of email address of the recipients.',
		type: 'array',
		items: { type: 'string' },
	},
	'track-1099-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	track_1099: {
		description: 'Boolean to track a contact for 1099 reporting.',
		type: 'boolean',
		'x-node_available_in': ['us'],
		'x-node_unavailable_in': [],
	},
	transaction_id: {
		description:
			'ID of the transaction made. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	transaction_type: {
		description: 'The type of the trasnaction made',
		type: 'string',
	},
	twitter: {
		description: 'X profile URL for the contact. Max-length [100].',
		type: 'string',
	},
	'untrack-1099-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	unused_credits_receivable_amount: {
		description: 'Total amount of unused credits available for the customer.',
		type: 'integer',
	},
	unused_credits_receivable_amount_bcy: {
		description:
			'Total amount of unused credits available for the customer in base currency.',
		type: 'integer',
	},
	'update-a-contact-request': {
		required: ['contact_name', 'contact_type'],
		type: 'object',
		properties: {
			contact_name: { $ref: '#/components/schemas/contact_name' },
			company_name: { $ref: '#/components/schemas/company_name' },
			payment_terms: { $ref: '#/components/schemas/payment_terms' },
			payment_terms_label: { $ref: '#/components/schemas/payment_terms_label' },
			contact_type: { $ref: '#/components/schemas/contact_type' },
			customer_sub_type: { $ref: '#/components/schemas/customer_sub_type' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			opening_balances: { $ref: '#/components/schemas/opening_balances' },
			credit_limit: { $ref: '#/components/schemas/credit_limit' },
			pricebook_id: { $ref: '#/components/schemas/pricebook_id' },
			contact_number: { $ref: '#/components/schemas/contact_number' },
			ignore_auto_number_generation: {
				$ref: '#/components/schemas/ignore_auto_number_generation',
			},
			tags: { $ref: '#/components/schemas/tags' },
			website: { $ref: '#/components/schemas/website' },
			owner_id: { $ref: '#/components/schemas/owner_id' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			billing_address: { $ref: '#/components/schemas/billing_address' },
			shipping_address: { $ref: '#/components/schemas/shipping_address' },
			contact_persons: {
				type: 'array',
				description: 'The list of contact persons associated with the contact.',
				items: {
					type: 'object',
					properties: {
						contact_person_id: {
							description:
								'ID of the contact person. For an existing contact person, pass the <code>contact_person_id</code>. Note: This value is a set of numeric characters.',
							type: 'string',
						},
						salutation: { $ref: '#/components/schemas/salutation' },
						first_name: { $ref: '#/components/schemas/first_name' },
						last_name: { $ref: '#/components/schemas/last_name' },
						email: { $ref: '#/components/schemas/email' },
						phone: { $ref: '#/components/schemas/phone' },
						mobile: { $ref: '#/components/schemas/mobile' },
						designation: { $ref: '#/components/schemas/designation' },
						department: { $ref: '#/components/schemas/department' },
						skype: { $ref: '#/components/schemas/skype' },
						is_primary_contact: {
							$ref: '#/components/schemas/is_primary_contact',
						},
						enable_portal: { $ref: '#/components/schemas/enable_portal' },
						communication_preference: {
							$ref: '#/components/schemas/communication_preference',
						},
					},
				},
			},
			default_templates: { $ref: '#/components/schemas/default_templates' },
			notes: { $ref: '#/components/schemas/notes' },
			vat_reg_no: { $ref: '#/components/schemas/vat_reg_no' },
			tax_reg_no: { $ref: '#/components/schemas/tax_reg_no' },
			country_code: { $ref: '#/components/schemas/country_code' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			tax_exemption_certificate_number: {
				$ref: '#/components/schemas/tax_exemption_certificate_number',
			},
			tax_regime: { $ref: '#/components/schemas/tax_regime' },
			legal_name: { $ref: '#/components/schemas/legal_name' },
			registration_details: {
				$ref: '#/components/schemas/registration_details',
			},
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			is_tds_registered: { $ref: '#/components/schemas/is_tds_registered' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			place_of_contact: { $ref: '#/components/schemas/place_of_contact' },
			gst_no: { $ref: '#/components/schemas/gst_no' },
			gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
			tax_authority_name: { $ref: '#/components/schemas/tax_authority_name' },
			avatax_exempt_no: { $ref: '#/components/schemas/avatax_exempt_no' },
			avatax_use_code: { $ref: '#/components/schemas/avatax_use_code' },
			tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
			tax_exemption_code: { $ref: '#/components/schemas/tax_exemption_code' },
			tax_authority_id: { $ref: '#/components/schemas/tax_authority_id' },
			tax_id: { $ref: '#/components/schemas/tax_id' },
			is_taxable: { $ref: '#/components/schemas/is_taxable' },
			facebook: { $ref: '#/components/schemas/facebook' },
			twitter: { $ref: '#/components/schemas/twitter' },
			track_1099: { $ref: '#/components/schemas/track_1099' },
			tax_id_type: { $ref: '#/components/schemas/tax_id_type' },
			tax_id_value: { $ref: '#/components/schemas/tax_id_value' },
		},
	},
	'update-a-contact-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			contact: {
				type: 'object',
				properties: {
					contact_id: { $ref: '#/components/schemas/contact_id' },
					contact_name: { $ref: '#/components/schemas/contact_name' },
					company_name: { $ref: '#/components/schemas/company_name' },
					has_transaction: { $ref: '#/components/schemas/has_transaction' },
					contact_type: { $ref: '#/components/schemas/contact_type' },
					customer_sub_type: { $ref: '#/components/schemas/customer_sub_type' },
					credit_limit: { $ref: '#/components/schemas/credit_limit' },
					pricebook_id: { $ref: '#/components/schemas/pricebook_id' },
					contact_number: { $ref: '#/components/schemas/contact_number' },
					ignore_auto_number_generation: {
						$ref: '#/components/schemas/ignore_auto_number_generation',
					},
					is_taxable: { $ref: '#/components/schemas/is_taxable' },
					tax_id: { $ref: '#/components/schemas/tax_id' },
					tax_name: { $ref: '#/components/schemas/tax_name' },
					tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
					tax_authority_id: { $ref: '#/components/schemas/tax_authority_id' },
					tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
					tax_authority_name: {
						$ref: '#/components/schemas/tax_authority_name',
					},
					tax_exemption_code: {
						$ref: '#/components/schemas/tax_exemption_code',
					},
					place_of_contact: { $ref: '#/components/schemas/place_of_contact' },
					gst_no: { $ref: '#/components/schemas/gst_no' },
					tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
					tax_regime: { $ref: '#/components/schemas/tax_regime' },
					legal_name: { $ref: '#/components/schemas/legal_name' },
					is_tds_registered: { $ref: '#/components/schemas/is_tds_registered' },
					vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
					gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
					is_linked_with_zohocrm: {
						$ref: '#/components/schemas/is_linked_with_zohocrm',
					},
					website: { $ref: '#/components/schemas/website' },
					owner_id: { $ref: '#/components/schemas/owner_id' },
					primary_contact_id: {
						$ref: '#/components/schemas/primary_contact_id',
					},
					payment_terms: { $ref: '#/components/schemas/payment_terms' },
					payment_terms_label: {
						$ref: '#/components/schemas/payment_terms_label',
					},
					currency_id: { $ref: '#/components/schemas/currency_id' },
					currency_code: { $ref: '#/components/schemas/currency_code' },
					currency_symbol: { $ref: '#/components/schemas/currency_symbol' },
					opening_balances: { $ref: '#/components/schemas/opening_balances' },
					outstanding_receivable_amount: {
						$ref: '#/components/schemas/outstanding_receivable_amount',
					},
					outstanding_receivable_amount_bcy: {
						$ref: '#/components/schemas/outstanding_receivable_amount_bcy',
					},
					unused_credits_receivable_amount: {
						$ref: '#/components/schemas/unused_credits_receivable_amount',
					},
					unused_credits_receivable_amount_bcy: {
						$ref: '#/components/schemas/unused_credits_receivable_amount_bcy',
					},
					status: { $ref: '#/components/schemas/status' },
					payment_reminder_enabled: {
						$ref: '#/components/schemas/payment_reminder_enabled',
					},
					custom_fields: { $ref: '#/components/schemas/custom_fields' },
					billing_address: { $ref: '#/components/schemas/billing_address' },
					shipping_address: { $ref: '#/components/schemas/shipping_address' },
					facebook: { $ref: '#/components/schemas/facebook' },
					twitter: { $ref: '#/components/schemas/twitter' },
					contact_persons: {
						type: 'array',
						description:
							'The list of contact persons associated with the contact.',
						items: {
							type: 'object',
							properties: {
								contact_person_id: {
									$ref: '#/components/schemas/contact_person_id',
								},
								salutation: { $ref: '#/components/schemas/salutation' },
								first_name: { $ref: '#/components/schemas/first_name' },
								last_name: { $ref: '#/components/schemas/last_name' },
								email: { $ref: '#/components/schemas/email' },
								phone: { $ref: '#/components/schemas/phone' },
								mobile: { $ref: '#/components/schemas/mobile' },
								designation: { $ref: '#/components/schemas/designation' },
								department: { $ref: '#/components/schemas/department' },
								skype: { $ref: '#/components/schemas/skype' },
								is_primary_contact: {
									$ref: '#/components/schemas/is_primary_contact',
								},
								enable_portal: { $ref: '#/components/schemas/enable_portal' },
								communication_preference: {
									$ref: '#/components/schemas/communication_preference',
								},
							},
						},
					},
					default_templates: { $ref: '#/components/schemas/default_templates' },
					notes: { $ref: '#/components/schemas/notes' },
					created_time: { $ref: '#/components/schemas/created_time' },
					last_modified_time: {
						$ref: '#/components/schemas/last_modified_time',
					},
				},
			},
		},
	},
	'update-contact-bank-account-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'update-contact-card-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'update-contact-document-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'update-contact-tags-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'update-contact-tax-info-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'update-contact-trn-status-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	user_name: { description: 'The appropriate user name', type: 'string' },
	value: { description: 'Value of the custom field.', type: 'string' },
	vat_reg_no: {
		description:
			'<b>For UK Edition:</b> VAT Registration number of a contact with length should be between 2 and 12 characters.<br/> <b>For Avalara:</b> If you are doing sales in the European Union (EU) then provide VAT Registration Number of your customers here. This is used to calculate VAT for B2B sales, from Avalara.',
		type: 'string',
		'x-node_available_in': ['uk', 'Avalara Integration'],
		'x-node_unavailable_in': [],
	},
	vat_treatment: {
		description:
			'VAT treatment of the contact.Allowed Values: <br/><code>uk</code> (A business that is located in the UK.),<br/><code>eu_vat_registered</code> (A business that is reg for VAT and trade goods between Northern Ireland and EU. This node is available only for organizations enabled for NI protocal in VAT Settings.) and<br/><code>overseas</code> (A business that is located outside UK. Pre Brexit, this was split as <code>eu_vat_registered</code>, <code>eu_vat_not_registered</code> and <code>non_eu</code> ).',
		type: 'string',
		'x-node_available_in': ['uk'],
		'x-node_unavailable_in': [],
	},
	'verify-address-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'verify-bank-account-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'verify-contact-address-by-id-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'verify-contact-einvoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			data: {
				type: 'object',
				description: 'E-invoice verification result.',
				'x-node_available_in': ['uae'],
				readOnly: true,
				properties: {
					code: {
						type: 'integer',
						description: 'E-invoice verification response code.',
						readOnly: true,
					},
					message: {
						type: 'string',
						description:
							'Human-readable message describing the e-invoice verification result.',
						readOnly: true,
					},
					status: {
						type: 'string',
						description:
							'E-invoice registration status of the contact. Allowed values: <code>eligible</code>, <code>not_eligible</code>.',
						readOnly: true,
					},
					status_formatted: {
						type: 'string',
						description: 'Display-friendly e-invoice registration status.',
						readOnly: true,
					},
				},
			},
		},
	},
	website: {
		description: 'Official website URL of the contact.',
		type: 'string',
	},
	zip: {
		description: 'Postal or ZIP code for the address. Max-length [50].',
		type: 'string',
	},
} as const satisfies Record<string, JsonValue>;

export const operations = [
	{
		id: 'create_contact',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'createContact',
		method: 'POST',
		path: '/contacts',
		summary: 'Create a Contact',
		description:
			'Create a new contact with comprehensive business information. This operation allows you to create a customer or vendor by providing details such as contact name, company information, addresses, contact persons, payment terms, tax settings, and custom fields. The created contact can be used for generating invoices, bills, estimates, and other business transactions. The system automatically assigns a unique contact ID.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
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
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/create-a-contact-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/create-a-contact-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_contacts',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'listContacts',
		method: 'GET',
		path: '/contacts',
		summary: 'List Contacts',
		description:
			'Retrieve a comprehensive list of all contacts with advanced filters. This operation supports multiple search criteria including contact name, company name, address, email, phone, and general text search. You can filter contacts by status (active, inactive, duplicate, CRM) and sort by various fields. The response includes essential contact information, financial data including outstanding amounts and credit limits, and pagination details for efficient data retrieval.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
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
				name: 'contact_type',
				in: 'query',
				required: false,
				description:
					'Search contacts by contact type. Allowed Values: <code>customer</code>, <code>vendor</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'contact_name',
				in: 'query',
				required: false,
				description:
					'Search contacts by contact name. Max-length [100] Variants: <code>contact_name_startswith</code> and <code>contact_name_contains</code>. Max-length [100]',
				schema: { type: 'string' },
			},
			{
				name: 'company_name',
				in: 'query',
				required: false,
				description:
					'Search contacts by company name. Max-length [100] Variants: <code>company_name_startswith</code> and <code>company_name_contains</code>',
				schema: { type: 'string' },
			},
			{
				name: 'first_name',
				in: 'query',
				required: false,
				description:
					'Search contacts by first name of the primary contact person. Max-length [100] Variants: <code>first_name_startswith</code> and <code>first_name_contains</code>',
				schema: { type: 'string' },
			},
			{
				name: 'last_name',
				in: 'query',
				required: false,
				description:
					'Search contacts by last name of the primary contact person. Max-length [100] Variants: <code>last_name_startswith</code> and <code>last_name_contains</code>',
				schema: { type: 'string' },
			},
			{
				name: 'address',
				in: 'query',
				required: false,
				description:
					'Search contacts by any of the address fields. Max-length [100] Variants: <code>address_startswith</code> and <code>address_contains</code>',
				schema: { type: 'string' },
			},
			{
				name: 'email',
				in: 'query',
				required: false,
				description:
					'Search contacts by email of the primary contact person. Max-length [100] Variants: <code>email_startswith</code> and <code>email_contains</code>',
				schema: { type: 'string' },
			},
			{
				name: 'phone',
				in: 'query',
				required: false,
				description:
					'Search contacts by phone number of the primary contact person. Max-length [100] Variants: <code>phone_startswith</code> and <code>phone_contains</code>',
				schema: { type: 'string' },
			},
			{
				name: 'filter_by',
				in: 'query',
				required: false,
				description:
					'Filter contacts by status. Allowed Values: <code>Status.All, Status.Active, Status.Inactive, Status.Duplicate, Status.PortalEnabled, Status.PortalDisabled, Invoice.OverDue, Invoice.Unpaid, Status.CreditLimitExceed and Status.Crm</code>',
				schema: { type: 'string' },
			},
			{
				name: 'search_text',
				in: 'query',
				required: false,
				description:
					'Search contacts by contact name or notes. Max-length [100]',
				schema: { type: 'string' },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description:
					'Sort contacts. Allowed Values: <code>contact_name, first_name, last_name, email, outstanding_receivable_amount, created_time and last_modified_time</code>',
				schema: { type: 'string' },
			},
			{
				name: 'zcrm_contact_id',
				in: 'query',
				required: false,
				description:
					'CRM Contact ID for the contact. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'zcrm_account_id',
				in: 'query',
				required: false,
				description:
					'CRM Account ID for the contact. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'zcrm_vendor_id',
				in: 'query',
				required: false,
				description:
					'CRM Vendor ID for the contact. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/list-contacts-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_contact_using_custom_field',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'updateContactUsingCustomField',
		method: 'PUT',
		path: '/contacts',
		summary: "Update a contact using a custom field's unique value",
		description:
			"A custom field will have unique values if it's configured to not accept duplicate values. Now, you can use that custom field's value to update a contact by providing its API name in the X-Unique-Identifier-Key header and its value in the X-Unique-Identifier-Value header. Based on this value, the corresponding contact will be retrieved and updated. Additionally, there is an optional X-Upsert header. If the X-Upsert header is true and the custom field's unique value is not found in any of the existing contacts, a new contact will be created if the necessary payload details are available",
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
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
			schema: { $ref: '#/components/schemas/update-a-contact-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-a-contact-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_contacts',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'deleteContacts',
		method: 'DELETE',
		path: '/contacts',
		summary: 'Delete contacts',
		description: 'Delete one or more contacts.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
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
				name: 'contact_ids',
				in: 'query',
				required: true,
				description:
					'Comma-separated IDs of the contacts to delete. Note: This value is a set of numeric characters separated by comma.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/delete-contacts-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'assign_contact_owner',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'assignContactOwner',
		method: 'POST',
		path: '/contacts/{contact_id}/owner',
		summary: 'Assign an Owner to a Contact',
		description:
			'Assign a user as the owner of a specific contact. Use this when a contact must be associated with a particular user for ownership and access purposes.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
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
				name: 'contact_id',
				in: 'path',
				required: true,
				description: 'ID of the contact.',
				schema: { type: 'string' },
			},
			{
				name: 'owner_id',
				in: 'query',
				required: false,
				description: 'ID of the user to assign as the contact owner.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/contact-owner-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'assign_owner_to_contacts',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'assignOwnerToContacts',
		method: 'POST',
		path: '/contacts/owner',
		summary: 'Assign an Owner to Multiple Contacts',
		description:
			'Assign a user as the owner of multiple contacts in a single request. Use this to bulk-assign ownership for a set of contacts.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
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
				name: 'contact_ids',
				in: 'query',
				required: true,
				description:
					'Comma-separated IDs of the contacts to assign the owner to. Maximum of 200 contacts per request.',
				schema: { type: 'string' },
			},
			{
				name: 'owner_id',
				in: 'query',
				required: false,
				description: 'ID of the user to assign as the contact owner.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/contact-owner-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_contacts_for_1099_tracking',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'markContactsFor1099Tracking',
		method: 'POST',
		path: '/contacts/track1099',
		summary: 'Mark Multiple Contacts for 1099 Tracking',
		description:
			'Enable 1099 tracking for multiple contacts in a single request. Applicable to organizations in the United States edition that report vendor payments for 1099 purposes.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
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
				name: 'contact_ids',
				in: 'query',
				required: false,
				description:
					'Comma-separated IDs of the contacts to mark for 1099 tracking. Maximum of 200 contacts per request.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/contact-1099-tracking-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'verify_contact_bank_account',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'verifyContactBankAccount',
		method: 'POST',
		path: '/contacts/{contact_id}/bankaccount/{bank_account_id}/verify',
		summary: 'Verify a Contact Bank Account',
		description:
			'Verify a contact bank account using the two micro-deposit amounts credited to the account. Provide the deposit amounts to confirm ownership of the bank account.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
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
				name: 'contact_id',
				in: 'path',
				required: true,
				description: 'ID of the contact.',
				schema: { type: 'string' },
			},
			{
				name: 'bank_account_id',
				in: 'path',
				required: true,
				description: 'ID of the contact bank account to verify.',
				schema: { type: 'string' },
			},
			{
				name: 'first_deposit_amount',
				in: 'query',
				required: false,
				description: 'First micro-deposit amount credited to the bank account.',
				schema: { type: 'integer' },
			},
			{
				name: 'second_deposit_amount',
				in: 'query',
				required: false,
				description:
					'Second micro-deposit amount credited to the bank account.',
				schema: { type: 'integer' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/verify-bank-account-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'verify_contact_address',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'verifyContactAddress',
		method: 'GET',
		path: '/contacts/address/verify',
		summary: 'Verify a Contact Address',
		description:
			'Validate a contact address against the provided address fields. Use this before creating or updating a contact to confirm that the address is valid.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
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
				name: 'line1',
				in: 'query',
				required: true,
				description: 'First line of the address. Max-length [60].',
				schema: { type: 'string' },
			},
			{
				name: 'city',
				in: 'query',
				required: false,
				description: 'City of the address. Max-length [50].',
				schema: { type: 'string' },
			},
			{
				name: 'region',
				in: 'query',
				required: false,
				description: 'State or region of the address. Max-length [50].',
				schema: { type: 'string' },
			},
			{
				name: 'country',
				in: 'query',
				required: false,
				description: 'Country of the address. Max-length [50].',
				schema: { type: 'string' },
			},
			{
				name: 'postal_code',
				in: 'query',
				required: false,
				description: 'Postal code of the address. Max-length [30].',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/verify-address-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'list_contact_autobill_recurring_invoices',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'listContactAutobillRecurringInvoices',
		method: 'GET',
		path: '/contacts/{contact_id}/card/{card_id}/recurringinvoices',
		summary: 'List Auto-bill Recurring Invoices for a Contact Card',
		description:
			'Retrieve the recurring invoices set to be auto-billed against a specific card of a contact. Use this to review which recurring invoices are linked to a contact card for automatic payment.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
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
				name: 'contact_id',
				in: 'path',
				required: true,
				description: 'ID of the contact.',
				schema: { type: 'string' },
			},
			{
				name: 'card_id',
				in: 'path',
				required: true,
				description: 'ID of the contact card.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/list-contact-autobill-recurring-invoices-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_contact',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'updateContact',
		method: 'PUT',
		path: '/contacts/{contact_id}',
		summary: 'Update a Contact',
		description:
			'Update an existing contact with comprehensive business information. This operation allows you to modify all contact details including basic information, addresses, contact persons, payment terms, tax settings, and custom fields. For contact person, you can add new contact persons, update existing ones, or remove them by excluding them from the contact_persons list.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
			schema: { $ref: '#/components/schemas/update-a-contact-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-a-contact-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_contact',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'getContact',
		method: 'GET',
		path: '/contacts/{contact_id}',
		summary: 'Get Contact',
		description:
			'Retrieve comprehensive details of a specific contact. This operation provides complete contact details such as basic information, addresses, contact persons, payment terms, tax settings, custom fields, and financial data including outstanding amounts, credit limits, and transaction history.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/get-contact-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_contact',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'deleteContact',
		method: 'DELETE',
		path: '/contacts/{contact_id}',
		summary: 'Delete a Contact',
		description: 'Delete an existing contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/delete-a-contact-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'mark_contact_active',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'markContactActive',
		method: 'POST',
		path: '/contacts/{contact_id}/active',
		summary: 'Mark as Active',
		description: 'Mark a contact as active.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/mark-as-active-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_contact_inactive',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'markContactInactive',
		method: 'POST',
		path: '/contacts/{contact_id}/inactive',
		summary: 'Mark as Inactive',
		description: 'Mark a contact as inactive.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/mark-as-inactive-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'enable_contact_portal',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'enableContactPortal',
		method: 'POST',
		path: '/contacts/{contact_id}/portal/enable',
		summary: 'Enable Portal Access',
		description: 'Enable portal access for a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
			schema: { $ref: '#/components/schemas/enable-portal-access-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/enable-portal-access-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'enable_contact_payment_reminder',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'enableContactPaymentReminder',
		method: 'POST',
		path: '/contacts/{contact_id}/paymentreminder/enable',
		summary: 'Enable Payment Reminders',
		description: 'Enable automated payment reminders for a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/enable-payment-reminders-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'disable_contact_payment_reminder',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'disableContactPaymentReminder',
		method: 'POST',
		path: '/contacts/{contact_id}/paymentreminder/disable',
		summary: 'Disable Payment Reminders',
		description: 'Disable automated payment reminders for a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/disable-payment-reminders-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'email_contact_statement',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'emailContactStatement',
		method: 'POST',
		path: '/contacts/{contact_id}/statements/email',
		summary: 'Email Statement',
		description:
			'Email statement to the contact. If JSONString is not inputted, mail will be sent with the default mail content.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
				name: 'start_date',
				in: 'query',
				required: false,
				description:
					"If start_date and end_date are not given, current month's statement will be sent to contact. Date format [yyyy-mm-dd]",
				schema: { type: 'string' },
			},
			{
				name: 'end_date',
				in: 'query',
				required: false,
				description: 'End date for the statement. Date format [yyyy-mm-dd]',
				schema: { type: 'string' },
			},
			{
				name: 'multipart_or_formdata',
				in: 'query',
				required: false,
				description: 'Files to be attached along with the statement.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/email-statement-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/email-statement-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_contact_statement_mail',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'getContactStatementMail',
		method: 'GET',
		path: '/contacts/{contact_id}/statements/email',
		summary: 'Get Statement Mail Content',
		description: 'Get the statement mail content.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
				name: 'start_date',
				in: 'query',
				required: false,
				description:
					"If start_date and end_date are not given, current month's statement will be sent to contact. Date format [yyyy-mm-dd]",
				schema: { type: 'string' },
			},
			{
				name: 'end_date',
				in: 'query',
				required: false,
				description: 'End date for the statement. Date format [yyyy-mm-dd]',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/get-statement-mail-content-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'get_contact_email_content',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'getContactEmailContent',
		method: 'GET',
		path: '/contacts/{contact_id}/email',
		summary: 'Get contact email content',
		description:
			'Retrieve the default email content used when emailing a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/get-contact-email-content-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'email_contact',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'emailContact',
		method: 'POST',
		path: '/contacts/{contact_id}/email',
		summary: 'Email Contact',
		description: 'Send email to contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
				name: 'send_customer_statement',
				in: 'query',
				required: false,
				description: 'Send customer statement pdf with email.',
				schema: { type: 'boolean' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/email-contact-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/email-contact-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'list_contact_comments',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'listContactComments',
		method: 'GET',
		path: '/contacts/{contact_id}/comments',
		summary: 'List Comments',
		description: 'List recent activities of a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/list-comments-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'add_contact_comment',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'addContactComment',
		method: 'POST',
		path: '/contacts/{contact_id}/comments',
		summary: 'Add a comment to a contact',
		description: 'Add a comment to a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
			schema: { $ref: '#/components/schemas/contact-comment-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/add-contact-comment-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_contact_address',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'getContactAddress',
		method: 'GET',
		path: '/contacts/{contact_id}/address',
		summary: 'Get Contact Addresses',
		description:
			'Get addresses of a contact including its Shipping Address, Billing Address and other additional addresses.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/get-contact-addresses-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'add_contact_address',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'addContactAddress',
		method: 'POST',
		path: '/contacts/{contact_id}/address',
		summary: 'Add Additional Address',
		description:
			'Add an additional address for a contact using the arguments below.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
			schema: { $ref: '#/components/schemas/add-additional-address-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/add-additional-address-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_contact_address',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'updateContactAddress',
		method: 'PUT',
		path: '/contacts/{contact_id}/address/{address_id}',
		summary: 'Edit Additional Address',
		description:
			'Edit the additional address of a contact using the arguments below.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
				name: 'address_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the address. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/edit-additional-address-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/edit-additional-address-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_contact_address',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'deleteContactAddress',
		method: 'DELETE',
		path: '/contacts/{contact_id}/address/{address_id}',
		summary: 'Delete Additional Address',
		description: 'Delete the additional address of a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
				name: 'address_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the address. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/delete-additional-address-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'list_contact_credit_note_refunds',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'listContactCreditNoteRefunds',
		method: 'GET',
		path: '/contacts/{contact_id}/refunds',
		summary: 'List credit note refunds for a contact',
		description: 'List the credit note refunds issued to a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/list-refunds-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'track_contact_1099',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'trackContact1099',
		method: 'POST',
		path: '/contacts/{contact_id}/track1099',
		summary: 'Track 1099',
		description:
			"Track a contact for 1099 reporting: (Note: This API is only available when the organization's country is U.S.A).",
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/track-1099-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'untrack_contact_1099',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'untrackContact1099',
		method: 'POST',
		path: '/contacts/{contact_id}/untrack1099',
		summary: 'Untrack 1099',
		description:
			"Use this API to stop tracking payments to a vendor for 1099 reporting. (Note: This API is only available when the organization's country is U.S.A).",
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/untrack-1099-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_unused_retainer_payments',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'getUnusedRetainerPayments',
		method: 'GET',
		path: '/contacts/{contact_id}/receivables/unusedretainerpayments',
		summary: 'Get Unused Retainer Payments',
		description:
			'Retrieve information about unused retainer payments for a specific contact. This endpoint returns details of retainer payments that have been made but not yet applied to invoices, providing insight into available credit balances from retainer payments.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
				name: 'currency_id',
				in: 'query',
				required: false,
				description:
					'Currency ID to filter unused retainer payments by specific currency. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/get-unused-retainer-payments-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'add_contact_bank_account',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'addContactBankAccount',
		method: 'POST',
		path: '/contacts/{contact_id}/bankaccount',
		summary: 'Add a bank account to a contact',
		description:
			'Add a bank account for a contact to enable automatic payment collection through ACH or bank transfer.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
			schema: { $ref: '#/components/schemas/contact-bank-account-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/add-contact-bank-account-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_contact_bank_account',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'getContactBankAccount',
		method: 'GET',
		path: '/contacts/{contact_id}/bankaccount/{bank_account_id}',
		summary: 'Get a contact bank account',
		description:
			'Retrieve the details of a bank account associated with a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'bank_account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact bank account. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/get-contact-bank-account-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_contact_bank_account',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'updateContactBankAccount',
		method: 'PUT',
		path: '/contacts/{contact_id}/bankaccount/{bank_account_id}',
		summary: 'Update a contact bank account',
		description:
			'Update the details of a bank account associated with a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'bank_account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact bank account. Note: This value is a set of numeric characters.',
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
			schema: { $ref: '#/components/schemas/contact-bank-account-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-contact-bank-account-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_contact_bank_account',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'deleteContactBankAccount',
		method: 'DELETE',
		path: '/contacts/{contact_id}/bankaccount/{bank_account_id}',
		summary: 'Delete a contact bank account',
		description: 'Delete a bank account associated with a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'bank_account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact bank account. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/delete-contact-bank-account-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'approve_contact_bank_account',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'approveContactBankAccount',
		method: 'POST',
		path: '/contacts/{contact_id}/bankaccount/{bank_account_id}/approve',
		summary: 'Approve a contact bank account',
		description: 'Approve a bank account added for a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'bank_account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact bank account. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/approve-contact-bank-account-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'decline_contact_bank_account',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'declineContactBankAccount',
		method: 'POST',
		path: '/contacts/{contact_id}/bankaccount/{bank_account_id}/decline',
		summary: 'Decline a contact bank account',
		description: 'Decline a bank account added for a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'bank_account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact bank account. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/decline-contact-bank-account-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_contact_bank_accounts',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'listContactBankAccounts',
		method: 'GET',
		path: '/contacts/{contact_id}/bankaccounts',
		summary: 'List contact bank accounts',
		description: 'List all bank accounts associated with a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/list-contact-bank-accounts-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'list_all_contact_bank_accounts',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'listAllContactBankAccounts',
		method: 'GET',
		path: '/contacts/bankaccounts',
		summary: 'List all contact bank accounts',
		description: 'List bank accounts across all contacts in the organization.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
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
					$ref: '#/components/schemas/list-all-contact-bank-accounts-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'add_contact_card',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'addContactCard',
		method: 'POST',
		path: '/contacts/{contact_id}/card',
		summary: 'Add a card to a contact',
		description:
			'Add a credit or debit card for a contact to enable automatic payment collection.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
			schema: { $ref: '#/components/schemas/contact-card-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/add-contact-card-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_contact_card',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'getContactCard',
		method: 'GET',
		path: '/contacts/{contact_id}/card/{card_id}',
		summary: 'Get a contact card',
		description: 'Retrieve the details of a card associated with a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'card_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact card. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/get-contact-card-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_contact_card',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'updateContactCard',
		method: 'PUT',
		path: '/contacts/{contact_id}/card/{card_id}',
		summary: 'Update a contact card',
		description: 'Update the details of a card associated with a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'card_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact card. Note: This value is a set of numeric characters.',
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
			schema: { $ref: '#/components/schemas/contact-card-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-contact-card-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_contact_card',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'deleteContactCard',
		method: 'DELETE',
		path: '/contacts/{contact_id}/card/{card_id}',
		summary: 'Delete a contact card',
		description: 'Delete a card associated with a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'card_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact card. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/delete-contact-card-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'list_contact_cards',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'listContactCards',
		method: 'GET',
		path: '/contacts/{contact_id}/cards',
		summary: 'List contact cards',
		description: 'List all cards associated with a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/list-contact-cards-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'get_contact_card_count',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'getContactCardCount',
		method: 'GET',
		path: '/contacts/cardcount',
		summary: 'Get contact card count',
		description:
			'Retrieve the number of saved cards across contacts in the organization.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
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
					$ref: '#/components/schemas/get-contact-card-count-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'list_all_contact_persons',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'listAllContactPersons',
		method: 'GET',
		path: '/contacts/contactpersons',
		summary: 'List all contact persons',
		description:
			'List contact persons across all contacts in the organization.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
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
					$ref: '#/components/schemas/list-all-contact-persons-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'get_contact_contact_person',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'getContactContactPerson',
		method: 'GET',
		path: '/contacts/{contact_id}/contactpersons/{contactperson_id}',
		summary: 'Get a contact person of a contact',
		description: 'Retrieve a specific contact person of a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'contactperson_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact person. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/get-contact-contact-person-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'invite_contact_person_to_portal',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'inviteContactPersonToPortal',
		method: 'POST',
		path: '/contacts/contactpersons/{contactperson_id}/portal/invite',
		summary: 'Invite a contact person to the portal',
		description: 'Send a client portal invitation to a contact person.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contactperson_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact person. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/invite-contact-person-to-portal-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'resend_contact_person_portal_invite',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'resendContactPersonPortalInvite',
		method: 'POST',
		path: '/contacts/contactpersons/{contactperson_id}/portal/invite/resend',
		summary: 'Resend a portal invite',
		description: 'Resend the client portal invitation to a contact person.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contactperson_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact person. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/resend-contact-person-portal-invite-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'enable_contact_person_sms',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'enableContactPersonSms',
		method: 'POST',
		path: '/contacts/contactpersons/{contactperson_id}/sms/enable',
		summary: 'Enable SMS for a contact person',
		description: 'Enable SMS notifications for a contact person.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contactperson_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact person. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/enable-contact-person-sms-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'disable_contact_person_sms',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'disableContactPersonSms',
		method: 'POST',
		path: '/contacts/contactpersons/{contactperson_id}/sms/disable',
		summary: 'Disable SMS for a contact person',
		description: 'Disable SMS notifications for a contact person.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contactperson_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact person. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/disable-contact-person-sms-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'delete_contact_comment',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'deleteContactComment',
		method: 'DELETE',
		path: '/contacts/{contact_id}/comments/{comment_id}',
		summary: 'Delete a contact comment',
		description: 'Delete a comment added to a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
					'ID of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/delete-contact-comment-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_contact_document',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'getContactDocument',
		method: 'GET',
		path: '/contacts/{contact_id}/documents/{document_id}',
		summary: 'Get a contact document',
		description: 'Retrieve a document attached to a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
					'ID of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/get-contact-document-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_contact_document',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'updateContactDocument',
		method: 'PUT',
		path: '/contacts/{contact_id}/documents/{document_id}',
		summary: 'Update a contact document',
		description: 'Update a document attached to a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
					'ID of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-contact-document-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_contact_document',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'deleteContactDocument',
		method: 'DELETE',
		path: '/contacts/{contact_id}/documents/{document_id}',
		summary: 'Delete a contact document',
		description: 'Delete a document attached to a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
					'ID of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/delete-contact-document-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'restore_contact_documents',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'restoreContactDocuments',
		method: 'POST',
		path: '/contacts/documents/restore',
		summary: 'Restore contact documents',
		description: 'Restore previously deleted contact documents.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
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
					$ref: '#/components/schemas/restore-contact-documents-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_contact_tags',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'updateContactTags',
		method: 'PUT',
		path: '/contacts/{contact_id}/tags',
		summary: 'Update contact tags',
		description: 'Update the reporting tags associated with a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
			schema: { $ref: '#/components/schemas/contact-tags-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-contact-tags-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_contact_tag',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'deleteContactTag',
		method: 'DELETE',
		path: '/contacts/{contact_id}/tags/{tag_id}',
		summary: 'Delete a contact tag',
		description: 'Remove a reporting tag from a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'tag_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the reporting tag. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/delete-contact-tag-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'list_contact_tax_info',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'listContactTaxInfo',
		method: 'GET',
		path: '/contacts/{contact_id}/taxinfo',
		summary: 'List contact tax information',
		description: 'List the tax information records of a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/list-contact-tax-info-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'add_contact_tax_info',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'addContactTaxInfo',
		method: 'POST',
		path: '/contacts/{contact_id}/taxinfo',
		summary: 'Add contact tax information',
		description: 'Add a tax information record to a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
			schema: { $ref: '#/components/schemas/contact-tax-info-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/add-contact-tax-info-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_contact_tax_info',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'updateContactTaxInfo',
		method: 'PUT',
		path: '/contacts/{contact_id}/taxinfo/{tax_info_id}',
		summary: 'Update contact tax information',
		description: 'Update a tax information record of a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'tax_info_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the tax information. Note: This value is a set of numeric characters.',
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
			schema: { $ref: '#/components/schemas/contact-tax-info-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-contact-tax-info-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_contact_tax_info',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'deleteContactTaxInfo',
		method: 'DELETE',
		path: '/contacts/{contact_id}/taxinfo/{tax_info_id}',
		summary: 'Delete contact tax information',
		description: 'Delete a tax information record of a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'tax_info_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the tax information. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/delete-contact-tax-info-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'list_contact_addresses',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'listContactAddresses',
		method: 'GET',
		path: '/contacts/address',
		summary: 'List contact addresses',
		description: 'List addresses across contacts in the organization.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
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
					$ref: '#/components/schemas/list-contact-addresses-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'mark_contact_address_as_billing',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'markContactAddressAsBilling',
		method: 'POST',
		path: '/contacts/{contact_id}/address/{address_id}/markasbilling',
		summary: 'Mark an address as billing',
		description: 'Set a contact address as the billing address.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'address_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the address. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/mark-contact-address-as-billing-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_contact_address_as_shipping',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'markContactAddressAsShipping',
		method: 'POST',
		path: '/contacts/{contact_id}/address/{address_id}/markasshipping',
		summary: 'Mark an address as shipping',
		description: 'Set a contact address as the shipping address.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'address_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the address. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/mark-contact-address-as-shipping-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'verify_contact_address_by_id',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'verifyContactAddressById',
		method: 'POST',
		path: '/contacts/{contact_id}/address/{address_id}/verify',
		summary: 'Verify a contact address',
		description: 'Verify a specific address of a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'address_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the address. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/verify-contact-address-by-id-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'add_contact_attachment',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'addContactAttachment',
		method: 'POST',
		path: '/contacts/{contact_id}/attachment',
		summary: 'Add an attachment to a contact',
		description: 'Attach a file to a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/add-contact-attachment-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'merge_contact',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'mergeContact',
		method: 'POST',
		path: '/contacts/{contact_id}/merge',
		summary: 'Merge contacts',
		description: 'Merge a duplicate contact into another contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/merge-contact-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'verify_contact_einvoice',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'verifyContactEinvoice',
		method: 'POST',
		path: '/contacts/{contact_id}/einvoice/verify',
		summary: 'Verify contact e-invoice details',
		description:
			'Verify the e-invoice details of a contact. <br> For India: verifies GST registration on the IRP. <br>For UAE: verifies Peppol network registration status.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/verify-contact-einvoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'disable_contact_portal',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'disableContactPortal',
		method: 'POST',
		path: '/contacts/{contact_id}/portal/disable',
		summary: 'Disable the contact portal',
		description: 'Disable client portal access for a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/disable-contact-portal-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_contacts_sms_content',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'getContactsSmsContent',
		method: 'GET',
		path: '/contacts/sms',
		summary: 'Get bulk contact SMS content',
		description:
			'Retrieve the SMS content used when notifying multiple contacts.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
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
					$ref: '#/components/schemas/get-contacts-sms-content-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'send_contacts_sms',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'sendContactsSms',
		method: 'POST',
		path: '/contacts/sms',
		summary: 'Send SMS to contacts',
		description: 'Send an SMS notification to multiple contacts.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
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
				schema: { $ref: '#/components/schemas/send-contacts-sms-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_contact_sms_content',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'getContactSmsContent',
		method: 'GET',
		path: '/contacts/{contact_id}/sms',
		summary: 'Get contact SMS content',
		description: 'Retrieve the SMS content used when notifying a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/get-contact-sms-content-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'send_contact_sms',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'sendContactSms',
		method: 'POST',
		path: '/contacts/{contact_id}/sms',
		summary: 'Send SMS to a contact',
		description: 'Send an SMS notification to a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/send-contact-sms-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_contact_by_reference',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'getContactByReference',
		method: 'GET',
		path: '/contacts/reference/{reference_id}',
		summary: 'Get a contact by reference',
		description:
			'Retrieve a contact using its reference ID from an external system.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'reference_id',
				in: 'path',
				required: true,
				description:
					'Reference identifier of the contact. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/get-contact-by-reference-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'get_contact_statement',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'getContactStatement',
		method: 'GET',
		path: '/contacts/{contact_id}/statements',
		summary: 'Get a contact statement',
		description: 'Retrieve the account statement of a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/get-contact-statement-response' },
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'get_contact_unused_credits',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'getContactUnusedCredits',
		method: 'GET',
		path: '/contacts/{contact_id}/receivables/unusedcredits',
		summary: 'Get unused credits of a contact',
		description:
			'Retrieve the unused customer credits available for a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/get-contact-unused-credits-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'list_contact_payment_refunds',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'listContactPaymentRefunds',
		method: 'GET',
		path: '/contacts/{contact_id}/paymentrefunds',
		summary: 'List payment refunds of a contact',
		description: 'List the payment refunds issued to a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/list-contact-payment-refunds-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'get_contact_income_and_expense',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'getContactIncomeAndExpense',
		method: 'GET',
		path: '/contacts/{contact_id}/incomeandexpense',
		summary: 'Get contact income and expense',
		description: 'Retrieve the income and expense summary of a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/get-contact-income-and-expense-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'get_contact_profit_and_loss',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'getContactProfitAndLoss',
		method: 'GET',
		path: '/contacts/{contact_id}/profitandloss',
		summary: 'Get contact profit and loss',
		description: 'Retrieve the profit and loss summary of a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/get-contact-profit-and-loss-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'get_contact_inventory_summary',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'getContactInventorySummary',
		method: 'GET',
		path: '/contacts/{contact_id}/inventorysummary',
		summary: 'Get contact inventory summary',
		description: 'Retrieve the inventory summary for a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/get-contact-inventory-summary-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'get_contact_opening_balances',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'getContactOpeningBalances',
		method: 'GET',
		path: '/contacts/{contact_id}/openingbalances',
		summary: 'Get contact opening balances',
		description: 'Retrieve the opening balances of a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/get-contact-opening-balances-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_contact_trn_status',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'updateContactTrnStatus',
		method: 'POST',
		path: '/contacts/{contact_id}/trnstatus',
		summary: 'Update contact TRN status',
		description:
			'Update the tax registration number (TRN) verification status of a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/update-contact-trn-status-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_contact_client_review_email',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'getContactClientReviewEmail',
		method: 'GET',
		path: '/contacts/{contact_id}/clientreviews/email',
		summary: 'Get client review email content',
		description: 'Retrieve the email content for a contact client review.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/get-contact-client-review-email-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'send_contact_client_review_email',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'sendContactClientReviewEmail',
		method: 'POST',
		path: '/contacts/{contact_id}/clientreviews/email',
		summary: 'Send a client review email',
		description: 'Send the client review email to a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/send-contact-client-review-email-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_contact_payment_method_email',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'getContactPaymentMethodEmail',
		method: 'GET',
		path: '/contacts/{contact_id}/paymentmethod/email',
		summary: 'Get payment method email content',
		description:
			'Retrieve the email content requesting a payment method from a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/get-contact-payment-method-email-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'send_contact_payment_method_email',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'sendContactPaymentMethodEmail',
		method: 'POST',
		path: '/contacts/{contact_id}/paymentmethod/email',
		summary: 'Send a payment method request email',
		description: 'Send an email requesting a payment method from a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/send-contact-payment-method-email-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_contact_vendor_statement_email',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'getContactVendorStatementEmail',
		method: 'GET',
		path: '/contacts/{contact_id}/vendorstatements/email',
		summary: 'Get vendor statement email content',
		description: 'Retrieve the email content for a vendor statement.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/get-contact-vendor-statement-email-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.READ'],
		riskLevel: 'read',
	},
	{
		id: 'send_contact_vendor_statement_email',
		group: 'contacts',
		groupSlug: 'contacts',
		name: 'sendContactVendorStatementEmail',
		method: 'POST',
		path: '/contacts/{contact_id}/vendorstatements/email',
		summary: 'Send a vendor statement email',
		description: 'Send the vendor statement email to a contact.',
		docsUrl: 'https://www.zoho.com/books/api/v3/contacts/',
		parameters: [
			{
				name: 'contact_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the contact. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/send-contact-vendor-statement-email-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'destructive',
	},
] as const satisfies readonly ZohoBooksOperationDefinition[];
