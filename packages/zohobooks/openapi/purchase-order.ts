import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas = {
	account_id: {
		description:
			'Unique identifier of the accounting account for the line item. Mandatory for non-inventory items/services. Determines expense categorization in general ledger. Note: This value is a set of numeric characters.',
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
			'ID of the VAT Acquistion. Note: This value is a set of numeric characters.',
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
	'add-attachment-to-a-purchase-order-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'add-comment-request': {
		required: ['description', 'expected_delivery_date'],
		type: 'object',
		properties: {
			description: {
				description: 'The description of the comment.',
				type: 'string',
			},
			expected_delivery_date: {
				$ref: '#/components/schemas/expected_delivery_date',
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
	address: {
		description: 'Address associated with the Purchase Order',
		type: 'string',
	},
	address1: { type: 'string' },
	address2: { type: 'string' },
	'approve-a-purchase-order-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	attachment_name: { description: 'Name of the Attachment', type: 'string' },
	attention: {
		description:
			'The name or designation of the specific person who should be contacted or notified regarding the delivery of goods or services from this purchase order. This field is typically used to specify the primary contact person at the delivery location, such as a warehouse manager, office administrator, or project coordinator who will receive and process the delivered items.',
		type: 'string',
	},
	bcc_mail_ids: {
		description: 'Array of email address of the recipients to be BCC ed.',
		type: 'array',
		items: { type: 'string' },
	},
	bcy_rate: { description: 'Rate in Base Currency', type: 'integer' },
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
			'Unique identifier of the billing address to be used for this purchase order. The billing address determines where invoices and related documents will be sent. This field is optional and if not specified, the default billing address from your organization settings will be used. You can obtain the billing address ID by listing all available addresses in your organization. Ensure the address exists and contains the correct billing information before referencing its ID here. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	body: { description: 'Body of the mail', type: 'string' },
	can_mark_as_bill: { type: 'boolean' },
	can_mark_as_unbill: { type: 'boolean' },
	can_send_in_mail: {
		description:
			'Boolean to send the attachment with the purchase order when emailed.',
		type: 'boolean',
	},
	'cancel-a-purchase-order-response': {
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
	city: { description: 'City involved in the Address', type: 'string' },
	comment: {
		type: 'object',
		properties: {
			comment_id: { $ref: '#/components/schemas/comment_id' },
			purchaseorder_id: { $ref: '#/components/schemas/purchaseorder_id' },
			description: { $ref: '#/components/schemas/description' },
			commented_by_id: { $ref: '#/components/schemas/commented_by_id' },
			commented_by: { $ref: '#/components/schemas/commented_by' },
			comment_type: { $ref: '#/components/schemas/comment_type' },
			date: { $ref: '#/components/schemas/date' },
			date_description: { $ref: '#/components/schemas/date_description' },
			time: { $ref: '#/components/schemas/time' },
		},
	},
	comment_id: {
		description:
			'ID of the Comment. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	comment_type: { description: 'Type of the Comment', type: 'string' },
	commented_by: {
		description: 'Name of the Customer who caused the Comment',
		type: 'string',
	},
	commented_by_id: {
		description:
			'ID of the User who caused the Comment. Note: This value is a set of numeric characters.',
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
	country: { description: 'Country involved in the Address', type: 'string' },
	'create-a-purchase-order-request': {
		required: ['vendor_id', 'line_items'],
		type: 'object',
		properties: {
			vendor_id: { $ref: '#/components/schemas/vendor_id' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			contact_persons_associated: {
				$ref: '#/components/schemas/contact_persons_associated_payload',
			},
			purchaseorder_number: {
				$ref: '#/components/schemas/purchaseorder_number',
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
			billing_address_id: { $ref: '#/components/schemas/billing_address_id' },
			crm_owner_id: { $ref: '#/components/schemas/crm_owner_id' },
			crm_custom_reference_id: {
				$ref: '#/components/schemas/crm_custom_reference_id',
			},
			template_id: { $ref: '#/components/schemas/template_id' },
			date: { $ref: '#/components/schemas/date' },
			delivery_date: { $ref: '#/components/schemas/delivery_date' },
			due_date: { $ref: '#/components/schemas/due_date' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			discount: { $ref: '#/components/schemas/discount' },
			discount_account_id: { $ref: '#/components/schemas/discount_account_id' },
			is_discount_before_tax: {
				$ref: '#/components/schemas/is_discount_before_tax',
			},
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			notes: { $ref: '#/components/schemas/notes' },
			notes_default: { $ref: '#/components/schemas/notes_default' },
			terms: { $ref: '#/components/schemas/terms' },
			terms_default: { $ref: '#/components/schemas/terms_default' },
			ship_via: { $ref: '#/components/schemas/ship_via' },
			delivery_org_address_id: {
				$ref: '#/components/schemas/delivery_org_address_id',
			},
			delivery_customer_id: {
				$ref: '#/components/schemas/delivery_customer_id',
			},
			attention: { $ref: '#/components/schemas/attention' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			is_update_customer: { $ref: '#/components/schemas/is_update_customer' },
			salesorder_id: { $ref: '#/components/schemas/salesorder_id' },
			location_id: { $ref: '#/components/schemas/location_id' },
			line_items: {
				description: 'Line items of purchase order.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						item_id: { $ref: '#/components/schemas/item_id' },
						account_id: { $ref: '#/components/schemas/account_id' },
						name: { $ref: '#/components/schemas/name' },
						description: { $ref: '#/components/schemas/description' },
						unit: { $ref: '#/components/schemas/unit' },
						location_id: { $ref: '#/components/schemas/location_id' },
						hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
						reverse_charge_tax_id: {
							$ref: '#/components/schemas/reverse_charge_tax_id',
						},
						rate: { $ref: '#/components/schemas/rate' },
						quantity: { $ref: '#/components/schemas/quantity' },
						item_order: { $ref: '#/components/schemas/item_order' },
						tax_id: { $ref: '#/components/schemas/tax_id' },
						tds_tax_id: { $ref: '#/components/schemas/tds_tax_id' },
						tax_treatment_code: {
							$ref: '#/components/schemas/tax_treatment_code',
						},
						tax_exemption_code: {
							$ref: '#/components/schemas/tax_exemption_code',
						},
						tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
						acquisition_vat_id: {
							$ref: '#/components/schemas/acquisition_vat_id',
						},
						reverse_charge_vat_id: {
							$ref: '#/components/schemas/reverse_charge_vat_id',
						},
						item_custom_fields: {
							type: 'array',
							description: 'Custom fields for the line item.',
							items: {
								type: 'object',
								properties: {
									index: { $ref: '#/components/schemas/index' },
									value: { $ref: '#/components/schemas/value' },
								},
							},
						},
						tags: { $ref: '#/components/schemas/tags' },
						line_item_category: {
							$ref: '#/components/schemas/line_item_category',
						},
						project_id: { $ref: '#/components/schemas/project_id' },
					},
				},
			},
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			documents: { $ref: '#/components/schemas/documents' },
			tags: { $ref: '#/components/schemas/tags' },
		},
	},
	'create-a-purchase-order-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			purchaseorder: { $ref: '#/components/schemas/purchaseorder' },
		},
	},
	created_by_id: {
		description:
			'ID of the User who created the Purchase Order. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	created_time: {
		description: 'Created Time of the Purchase Order',
		type: 'string',
	},
	crm_custom_reference_id: {
		description:
			'ID of CRM Custom Reference. Note: This value is a set of numeric characters.',
		type: 'string',
		format: 'int64',
	},
	crm_owner_id: {
		description:
			'Unique identifier of the CRM owner assigned to this purchase order. This field links the purchase order to a specific CRM user who is responsible for managing the vendor relationship and overseeing the procurement process. The CRM owner can track, follow up, and manage all aspects of this purchase order within the CRM system. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	currency_code: { description: 'Code of the Currency', type: 'string' },
	currency_id: {
		description:
			'Unique identifier of the currency for the purchase order. This value is mandatory to specify the currency in which the purchase order amounts will be displayed and processed. You can obtain the currency ID by listing all available currencies using the GET /settings/currencies API. Ensure the currency exists and is properly configured in your organization before referencing its ID here. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	currency_symbol: { description: 'Symbol of the Currency', type: 'string' },
	custom_fields: {
		description: 'Custom fields for purchase order.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				customfield_id: { $ref: '#/components/schemas/customfield_id' },
				value: { $ref: '#/components/schemas/value' },
			},
		},
	},
	customfield_id: {
		type: 'string',
		description:
			'Unique identifier of the Custom Field. Note: This value is a set of numeric characters.',
	},
	date: {
		description:
			'The date when the purchase order was created or issued. This is the official date that appears on the purchase order document and is used for record-keeping, reporting, and tracking purposes. The date should be in YYYY-MM-DD format and typically represents when the purchase order was authorized and sent to the vendor.',
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
	'delete-an-attachment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-purchase-order-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	delivery_address: {
		type: 'object',
		properties: {
			zip: { $ref: '#/components/schemas/zip' },
			is_verifiable: { $ref: '#/components/schemas/is_verifiable' },
			state: { $ref: '#/components/schemas/state' },
			address1: { $ref: '#/components/schemas/address1' },
			address2: { $ref: '#/components/schemas/address2' },
			is_valid: { $ref: '#/components/schemas/is_valid' },
			city: { $ref: '#/components/schemas/city' },
			country: { $ref: '#/components/schemas/country' },
			address: { $ref: '#/components/schemas/address' },
			email: { $ref: '#/components/schemas/email' },
			is_primary: { $ref: '#/components/schemas/is_primary' },
			organization_address_id: {
				$ref: '#/components/schemas/organization_address_id',
			},
			phone: { $ref: '#/components/schemas/phone' },
			is_verified: { $ref: '#/components/schemas/is_verified' },
		},
	},
	delivery_customer_id: {
		description:
			'Unique identifier of the customer for whom the goods or services in this purchase order are being procured. This field is used when the purchase order is created on behalf of a customer, such as in drop-shipping scenarios or when procuring items for specific customer projects. The customer information may be displayed on the purchase order for vendor reference. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	delivery_date: {
		description:
			'The expected delivery date when the goods or services ordered in this purchase order should be received. This date is used for planning, scheduling, and tracking deliveries. It helps in managing inventory, coordinating with vendors, and ensuring timely receipt of ordered items. The date should be in YYYY-MM-DD format and is typically communicated to the vendor as part of the purchase order terms.',
		type: 'string',
	},
	delivery_org_address_id: {
		description:
			"Unique identifier of the organization address where the goods or services from this purchase order should be delivered. This field specifies the delivery location within your organization, such as a warehouse, office, or branch location. The address details are retrieved from your organization's address book and displayed on the purchase order for vendor reference. Note: This value is a set of numeric characters.",
		type: 'string',
	},
	description: {
		description:
			'Additional details, specifications, or notes about the line item. Can include technical specs, requirements, delivery instructions. Appears on purchase order document for vendor reference.',
		type: 'string',
	},
	destination_of_supply: {
		description:
			"Place where the goods/services are supplied to. (If not given, organisation's home state will be taken)",
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	discount: {
		description:
			'Discount applied to the purchase order, which can be either a percentage or a flat amount. For percentage discounts, the value should include the % symbol (e.g., 10%). For sample, on Rs.1000, a 10% discount results in Rs.900, while a flat Rs.200 discount results in Rs.800.',
		type: 'string',
	},
	discount_account_id: {
		description:
			'Unique identifier of the accounting account where the discount amount will be recorded. This account is used to track and categorize discount expenses in your general ledger. The discount account should be configured as an expense or contra-revenue account to properly reflect the impact of discounts on your financial statements. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	document_id: {
		description:
			'ID of the Document. Note: This value is a set of numeric characters.',
		type: 'string',
		format: 'int64',
	},
	documents: {
		description: 'Array of documents attached to the purchase order.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				document_id: { $ref: '#/components/schemas/document_id' },
				file_name: { $ref: '#/components/schemas/file_name' },
			},
		},
	},
	due_date: {
		description:
			'The expected delivery date when the goods or services ordered in this purchase order should be received. This date is used for planning, scheduling, and tracking deliveries. It helps in managing inventory, coordinating with vendors, and ensuring timely receipt of ordered items. The date should be in YYYY-MM-DD format.',
		type: 'string',
	},
	email: { description: 'Email ID of the Vendor', type: 'string' },
	'email-a-purchase-order-request': {
		required: ['to_mail_ids', 'body'],
		type: 'object',
		properties: {
			send_from_org_email_id: {
				$ref: '#/components/schemas/send_from_org_email_id',
			},
			from_address_id: { $ref: '#/components/schemas/from_address_id' },
			to_mail_ids: { $ref: '#/components/schemas/to_mail_ids' },
			cc_mail_ids: { $ref: '#/components/schemas/cc_mail_ids' },
			bcc_mail_ids: { $ref: '#/components/schemas/bcc_mail_ids' },
			subject: { $ref: '#/components/schemas/subject' },
			body: { $ref: '#/components/schemas/body' },
			mail_documents: { $ref: '#/components/schemas/mail_documents' },
		},
	},
	'email-a-purchase-order-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	exchange_rate: {
		description:
			"The currency exchange rate used to convert the purchase order amounts from the vendor's currency to your organization's base currency. This rate is applied when the purchase order is created in a foreign currency. A value of 1 indicates the same currency as your base currency. This rate affects all monetary calculations and reporting for this purchase order.",
		type: 'number',
		format: 'double',
	},
	expected_delivery_date: {
		description:
			'The expected delivery date when the goods or services ordered in this purchase order should be received. This date is used for planning, scheduling, and tracking deliveries. It helps in managing inventory, coordinating with vendors, and ensuring timely receipt of ordered items. The date should be in YYYY-MM-DD format.',
		type: 'string',
	},
	fax: { description: 'Fax Number', type: 'string' },
	file_name: {
		description:
			'Name of the attached document file. Includes file extension and represents the original filename as uploaded. Used for display purposes and file identification in the system.',
		type: 'string',
	},
	first_name: {
		description: 'First Name of the Contact Person.',
		type: 'string',
	},
	from_address_id: {
		description:
			'ID of From Address of the Email Address. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	'get-a-purchase-order-attachment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-a-purchase-order-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			purchaseorder: { $ref: '#/components/schemas/purchaseorder' },
		},
	},
	'get-purchase-order-email-content-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
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
	has_attachment: { type: 'boolean' },
	hsn_or_sac: {
		description: 'HSN or SAC Code for the Item',
		type: 'string',
		'x-node_available_in': ['in', 'ke', 'za'],
		'x-node_unavailable_in': [],
	},
	index: { description: 'Index of the Custom Field', type: 'integer' },
	is_discount_before_tax: {
		description:
			'Boolean flag that determines whether the discount is applied before or after tax calculations. When set to true, the discount is applied to the subtotal before tax is calculated, resulting in tax being calculated on the discounted amount. When set to false, the discount is applied after tax calculations, which may affect the final total differently depending on your tax configuration.',
		type: 'boolean',
	},
	is_email_enabled: {
		description:
			'Used to check if Email communication preference is enabled for the contact person at transaction level.',
		type: 'boolean',
	},
	is_emailed: {
		description: 'Check if the purchase order is emailed',
		type: 'boolean',
	},
	is_inclusive_tax: {
		description:
			'Boolean flag that specifies whether the line item rates include or exclude tax amounts. When set to true, the specified rates are inclusive of tax, meaning the tax amount is already included in the rate. When set to false, the rates are exclusive of tax, and tax will be calculated and added separately. This setting affects how tax calculations are performed and displayed on the purchase order.',
		type: 'boolean',
		'x-node_available_in': [],
		'x-node_unavailable_in': ['us'],
	},
	is_pre_gst: {
		description: 'Applicable for transactions that fall before july 1, 2017',
		type: 'boolean',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	is_primary: { type: 'string' },
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
		description: 'Check if customer should be updated',
		type: 'string',
	},
	is_valid: { type: 'string' },
	is_verifiable: { type: 'boolean' },
	is_verified: { type: 'boolean' },
	is_whatsapp_enabled: {
		description:
			'Used to check if WhatsApp communication preference is enabled for the contact person at transaction level.',
		type: 'boolean',
		'x-node_available_in': ['WhatsApp integration'],
	},
	item_custom_fields: {
		type: 'array',
		description: 'Custom fields for purchase order line item.',
		items: {
			type: 'object',
			properties: {
				customfield_id: { $ref: '#/components/schemas/customfield_id' },
				value: { $ref: '#/components/schemas/value' },
			},
		},
	},
	item_id: {
		description:
			'Unique identifier of the item or service in the line item. Mandatory field that links to the item catalog. Determines item details, pricing, and inventory tracking. Obtain from GET /items API. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	item_order: {
		description:
			'Sequential order of line item within purchase order. Determines display order on documents and reports. Typically numbered sequentially from 0 or 1. Maintains consistency across related documents.',
		type: 'integer',
	},
	item_total: { description: 'Total of the Item', type: 'integer' },
	item_total_inclusive_of_tax: {
		description: 'Total of the Item inclusive tax',
		type: 'integer',
	},
	last_modified_time: {
		description: 'Last Modified Time of the Purchase Order',
		type: 'string',
	},
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
			'ID of the line item. Mandatory if the existing line item has to be updated. If empty, a new line item will be created. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	line_items: {
		description: 'Line items of purchase order.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				item_id: { $ref: '#/components/schemas/item_id' },
				line_item_id: { $ref: '#/components/schemas/line_item_id' },
				sku: { $ref: '#/components/schemas/sku' },
				location_id: { $ref: '#/components/schemas/location_id' },
				location_name: { $ref: '#/components/schemas/location_name' },
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
				account_id: { $ref: '#/components/schemas/account_id' },
				account_name: { $ref: '#/components/schemas/account_name' },
				name: { $ref: '#/components/schemas/name' },
				description: { $ref: '#/components/schemas/description' },
				item_order: { $ref: '#/components/schemas/item_order' },
				bcy_rate: { $ref: '#/components/schemas/bcy_rate' },
				unit: { $ref: '#/components/schemas/unit' },
				rate: { $ref: '#/components/schemas/rate' },
				quantity: { $ref: '#/components/schemas/quantity' },
				item_total: { $ref: '#/components/schemas/item_total' },
				item_total_inclusive_of_tax: {
					$ref: '#/components/schemas/item_total_inclusive_of_tax',
				},
				tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
				tax_exemption_code: { $ref: '#/components/schemas/tax_exemption_code' },
				tax_id: { $ref: '#/components/schemas/tax_id' },
				tax_treatment_code: { $ref: '#/components/schemas/tax_treatment_code' },
				tax_name: { $ref: '#/components/schemas/tax_name' },
				tax_type: { $ref: '#/components/schemas/tax_type' },
				tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
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
				tags: { $ref: '#/components/schemas/tags_response' },
				line_item_category: { $ref: '#/components/schemas/line_item_category' },
				item_custom_fields: { $ref: '#/components/schemas/item_custom_fields' },
				project_id: { $ref: '#/components/schemas/project_id' },
				project_name: { $ref: '#/components/schemas/project_name' },
			},
		},
	},
	'list-purchase-order-comments-and-history-response': {
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
		},
	},
	'list-purchase-order-templates-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			templates: { $ref: '#/components/schemas/templates' },
		},
	},
	'list-purchase-orders-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			purchaseorders: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						purchaseorder_id: { $ref: '#/components/schemas/purchaseorder_id' },
						vendor_id: { $ref: '#/components/schemas/vendor_id' },
						vendor_name: { $ref: '#/components/schemas/vendor_name' },
						status: { $ref: '#/components/schemas/status' },
						purchaseorder_number: {
							$ref: '#/components/schemas/purchaseorder_number',
						},
						reference_number: { $ref: '#/components/schemas/reference_number' },
						date: { $ref: '#/components/schemas/date' },
						delivery_date: { $ref: '#/components/schemas/delivery_date' },
						currency_id: { $ref: '#/components/schemas/currency_id' },
						currency_code: { $ref: '#/components/schemas/currency_code' },
						price_precision: { $ref: '#/components/schemas/price_precision' },
						total: { $ref: '#/components/schemas/total' },
						has_attachment: { $ref: '#/components/schemas/has_attachment' },
						created_time: { $ref: '#/components/schemas/created_time' },
						last_modified_time: {
							$ref: '#/components/schemas/last_modified_time',
						},
						custom_fields: { $ref: '#/components/schemas/custom_fields' },
					},
				},
			},
		},
	},
	location_id: {
		description:
			'Unique identifier of the business location or branch where this purchase order is being created and managed. This field is used to associate the purchase order with a specific location within your organization, enabling location-based reporting, inventory tracking, and multi-location business operations. The location information affects how the purchase order is processed and where inventory is received. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	location_name: { description: 'Name of the location', type: 'string' },
	mail_documents: {
		description: 'List of documents to be attached to the email.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				document_id: { $ref: '#/components/schemas/document_id' },
				file_name: { $ref: '#/components/schemas/file_name' },
			},
		},
	},
	'mark-a-purchase-order-as-open-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'mark-as-billed-response': {
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
			'Display name of the line item on the purchase order. Auto-populated from item catalog when item_id is specified. Can be customized. Used for vendor reference and documentation.',
		type: 'string',
	},
	notes: {
		description:
			'Additional information, instructions, or comments to be displayed on the purchase order document. This field is typically used for delivery instructions, special requirements, vendor communications, or any other information relevant to the purchase order. The notes appear on the purchase order PDF and are visible to the vendor.',
		type: 'string',
	},
	notes_default: {
		description: 'Default notes for purchase order',
		type: 'string',
	},
	operation_type: {
		description: 'Type of the Operation that caused the comment',
		type: 'string',
	},
	organization_address_id: {
		description:
			'ID of organization address. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	orientation: { description: 'Orientation of the Page', type: 'string' },
	page_height: { description: 'Height of the Page', type: 'string' },
	page_width: { description: 'Width of the Page', type: 'string' },
	phone: { description: 'Phone Number of the Contact Person.', type: 'string' },
	place_of_supply: {
		description:
			'The place of supply is where a transaction is considered to have occurred for VAT purposes. For the supply of goods, the place of supply is the location of the goods when the supply occurs. For the supply of services, the place of supply should be where the supplier is established. (If not given, <code>place of contact</code> given for the contact will be taken)<br/>Supported codes for UAE emirates are : </br>Abu Dhabi - <code>AB</code>,</br>Ajman - <code>AJ</code>,</br>Dubai - <code>DU</code>,</br>Fujairah - <code>FU</code>,</br>Ras al-Khaimah - <code>RA</code>,</br>Sharjah - <code>SH</code>,</br>Umm al-Quwain - <code>UM</code>.<br/>Supported codes for the GCC countries are : </br>United Arab Emirates - <code>AE</code>,</br>Saudi Arabia - <code>SA</code>,</br>Bahrain - <code>BH</code>,</br>Kuwait - <code>KW</code>,</br>Oman - <code>OM</code>,</br>Qatar - <code>QA</code>.',
		type: 'string',
		'x-node_available_in': ['gcc'],
		'x-node_unavailable_in': [],
	},
	price_precision: {
		description: 'Price Precision for the Values',
		type: 'integer',
	},
	pricebook_id: {
		description:
			'Unique identifier of the pricebook to be used for this purchase order. The pricebook contains predefined pricing information for items and services. This field is optional and if not specified, the default pricebook will be used. You can obtain the pricebook ID by listing all available pricebooks in your organization. Ensure the pricebook exists and contains the relevant pricing information before referencing its ID here. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	pricebook_name: { description: 'Enter pricebook name', type: 'string' },
	product_type: {
		description:
			'This denotes whether the Purchase Order line item is to be treated as a goods or service purchase. This only need to be specified in case purchase order is not enabled. Allowed Values: <code>goods</code>, <code>digital_service</code> and <code>service</code>.',
		type: 'string',
		'x-node_available_in': ['uk'],
		'x-node_unavailable_in': [],
	},
	project_id: {
		description:
			'ID of the project. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	project_name: { description: 'Name of the project.', type: 'string' },
	purchaseorder: {
		type: 'object',
		properties: {
			purchaseorder_id: { $ref: '#/components/schemas/purchaseorder_id' },
			documents: { $ref: '#/components/schemas/documents' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			gst_no: { $ref: '#/components/schemas/gst_no' },
			gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			is_pre_gst: { $ref: '#/components/schemas/is_pre_gst' },
			source_of_supply: { $ref: '#/components/schemas/source_of_supply' },
			destination_of_supply: {
				$ref: '#/components/schemas/destination_of_supply',
			},
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			pricebook_id: { $ref: '#/components/schemas/pricebook_id' },
			pricebook_name: { $ref: '#/components/schemas/pricebook_name' },
			is_reverse_charge_applied: {
				$ref: '#/components/schemas/is_reverse_charge_applied',
			},
			purchaseorder_number: {
				$ref: '#/components/schemas/purchaseorder_number',
			},
			date: { $ref: '#/components/schemas/date' },
			expected_delivery_date: {
				$ref: '#/components/schemas/expected_delivery_date',
			},
			discount: { $ref: '#/components/schemas/discount' },
			discount_account_id: { $ref: '#/components/schemas/discount_account_id' },
			is_discount_before_tax: {
				$ref: '#/components/schemas/is_discount_before_tax',
			},
			reference_number: { $ref: '#/components/schemas/reference_number' },
			status: { $ref: '#/components/schemas/status' },
			vendor_id: { $ref: '#/components/schemas/vendor_id' },
			vendor_name: { $ref: '#/components/schemas/vendor_name' },
			crm_owner_id: { $ref: '#/components/schemas/crm_owner_id' },
			contact_persons_associated: {
				$ref: '#/components/schemas/contact_persons_associated',
			},
			currency_id: { $ref: '#/components/schemas/currency_id' },
			currency_code: { $ref: '#/components/schemas/currency_code' },
			currency_symbol: { $ref: '#/components/schemas/currency_symbol' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			delivery_date: { $ref: '#/components/schemas/delivery_date' },
			is_emailed: { $ref: '#/components/schemas/is_emailed' },
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			location_id: { $ref: '#/components/schemas/location_id' },
			location_name: { $ref: '#/components/schemas/location_name' },
			line_items: { $ref: '#/components/schemas/line_items' },
			sub_total: { $ref: '#/components/schemas/sub_total' },
			tax_total: { $ref: '#/components/schemas/tax_total' },
			total: { $ref: '#/components/schemas/total' },
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
			billing_address: { $ref: '#/components/schemas/billing_address' },
			notes: { $ref: '#/components/schemas/notes' },
			terms: { $ref: '#/components/schemas/terms' },
			ship_via: { $ref: '#/components/schemas/ship_via' },
			ship_via_id: { $ref: '#/components/schemas/ship_via_id' },
			attention: { $ref: '#/components/schemas/attention' },
			delivery_org_address_id: {
				$ref: '#/components/schemas/delivery_org_address_id',
			},
			delivery_customer_id: {
				$ref: '#/components/schemas/delivery_customer_id',
			},
			delivery_address: { $ref: '#/components/schemas/delivery_address' },
			price_precision: { $ref: '#/components/schemas/price_precision' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			attachment_name: { $ref: '#/components/schemas/attachment_name' },
			can_send_in_mail: { $ref: '#/components/schemas/can_send_in_mail' },
			template_id: { $ref: '#/components/schemas/template_id' },
			template_name: { $ref: '#/components/schemas/template_name' },
			page_width: { $ref: '#/components/schemas/page_width' },
			page_height: { $ref: '#/components/schemas/page_height' },
			orientation: { $ref: '#/components/schemas/orientation' },
			template_type: { $ref: '#/components/schemas/template_type' },
			created_time: { $ref: '#/components/schemas/created_time' },
			created_by_id: { $ref: '#/components/schemas/created_by_id' },
			last_modified_time: { $ref: '#/components/schemas/last_modified_time' },
			can_mark_as_bill: { $ref: '#/components/schemas/can_mark_as_bill' },
			can_mark_as_unbill: { $ref: '#/components/schemas/can_mark_as_unbill' },
			tags: { $ref: '#/components/schemas/tags_response' },
		},
	},
	purchaseorder_id: {
		type: 'string',
		description:
			'Unique identifier of the purchase order. Note: This value is a set of numeric characters.',
	},
	purchaseorder_number: {
		description:
			"Unique identifier for the purchase order. This field is mandatory when auto number generation is disabled for your organization. If auto numbering is enabled, this field can be left empty as the system will automatically generate a sequential purchase order number. When manually specifying a number, ensure it follows your organization's numbering convention and is unique across all purchase orders.",
		type: 'string',
	},
	quantity: {
		description:
			'Number of units being ordered. Used with rate to calculate total line item amount. Must match unit of measurement. Represents actual order quantity for delivery.',
		type: 'string',
	},
	rate: {
		description:
			'Unit price per item/service. Used to calculate total line item amount. Must be in purchase order currency. Tax inclusion depends on is_inclusive_tax setting. Affects pricing calculations and vendor billing.',
		type: 'number',
		format: 'double',
	},
	reference_number: {
		description:
			'External reference number or identifier for the purchase order. This field is optional and can be used to store additional reference information such as vendor order numbers, internal tracking codes, or any other external system identifiers. This reference number will be displayed on the purchase order document and can be used for cross-referencing with external systems or internal tracking purposes.',
		type: 'string',
	},
	reject_purchase_order: {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	reverse_charge_tax_amount: {
		description: 'Tax amount for the reverse charge.',
		type: 'number',
		format: 'double',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	reverse_charge_tax_id: {
		description:
			'Unique identifier of the reverse charge tax for the line item. Used when buyer is responsible for paying tax instead of vendor. Applicable for unregistered vendors or specific tax regulations. Must reference valid reverse charge tax configuration. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	reverse_charge_tax_name: {
		description: 'Enter reverse charge tax name',
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	reverse_charge_tax_percentage: {
		description: 'Enter reverse charge tax percentage',
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
			'ID of the Reverse Charge. Note: This value is a set of numeric characters.',
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
	salesorder_id: {
		description:
			"Unique identifier of the sales order that is linked to this purchase order. This field establishes a connection between the sales order and purchase order, typically used in drop-shipping scenarios where you need to procure items to fulfill a customer's sales order. The linked sales order information may be displayed on the purchase order for vendor reference and internal tracking purposes. Note: This value is a set of numeric characters.",
		type: 'string',
		format: 'int64',
	},
	send_from_org_email_id: {
		description:
			"Boolean to trigger the email from the organization's email address.",
		type: 'boolean',
	},
	ship_via: { description: 'Shipment Preference', type: 'string' },
	ship_via_id: {
		description:
			'ID of the Shipment Preference. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	sku: { description: 'SKU of the Item', type: 'string' },
	source_of_supply: {
		description:
			'Place from where the goods/services are supplied. (If not given, <code>place of contact</code> given for the contact will be taken)',
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	state: { description: 'State Involved in the Address', type: 'string' },
	status: { description: 'Status of the Purchase Order', type: 'string' },
	street2: { type: 'string' },
	sub_total: {
		description: 'Sub Total of the Purchase Order',
		type: 'number',
		format: 'double',
	},
	subject: { description: 'Subject of the mail.', type: 'string' },
	'submit-a-purchase-order-for-approval-response': {
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
		description: 'Amount of Tax',
		type: 'number',
		format: 'double',
	},
	tax_exemption_code: {
		description: 'Code of the Tax Exemption',
		type: 'string',
		'x-node_available_in': ['in', 'au', 'ca', 'mx'],
		'x-node_unavailable_in': [],
	},
	tax_exemption_id: {
		description:
			'ID of the Tax Exemption. Note: This value is a set of numeric characters.',
		type: 'string',
		'x-node_available_in': ['in', 'au', 'ca'],
		'x-node_unavailable_in': [],
	},
	tax_id: {
		description:
			'Unique identifier of the tax for the line item. Determines tax rate, name, and treatment for calculations. Used in tax amount computation and display on purchase order. Obtain from taxes API. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	tax_name: { description: 'Name of the Tax', type: 'string' },
	tax_percentage: { description: 'Percentage of the Tax', type: 'integer' },
	tax_total: {
		description: 'Total of the Tax',
		type: 'number',
		format: 'double',
	},
	tax_treatment: {
		description:
			'VAT treatment for the purchase order. Choose whether the vendor falls under: <code>vat_registered</code>,<code>vat_not_registered</code>,<code>gcc_vat_not_registered</code>,<code>gcc_vat_registered</code>,<code>non_gcc</code>.</br><code>dz_vat_registered</code> and <code>dz_vat_not_registered</code> are supported only for <b>UAE</b>.</b></br><code>home_country_mexico</code>,<code>border_region_mexico</code>,<code>non_mexico</code> supported only for <b>MX</b>.<br/><b>For Kenya Edition:</b> <code>vat_registered</code> ,<code>vat_not_registered</code> ,<code>non_kenya</code>(A business that is located outside Kenya).<br/><b>For SouthAfrica Edition:</b> <code>vat_registered</code>, <code>vat_not_registered</code>, <code>overseas</code>(A business that is located outside SouthAfrica).',
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
	taxes: { type: 'array', items: { type: 'string' } },
	tds_tax_id: {
		type: 'string',
		description:
			'Unique identifier of the TDS tax for the line item. Determines TDS tax rate, name, and treatment for calculations. Used in TDS tax amount computation and display on purchase order. Obtain from taxes API. Note: This value is a set of numeric characters.',
		'x-node_available_in': ['mx'],
		'x-node_unavailable_in': [],
	},
	template_id: {
		description:
			'Unique identifier of the PDF template linked to the purchase order. Obtain this value from the `template_id` field in the response of the GET `/purchaseorders/templates` API for your organization. Determines which template is used for the purchase order PDF document, controlling the layout, formatting, and visual appearance of the generated purchase order. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	template_name: { description: 'Name of the template', type: 'string' },
	template_type: { description: 'Type of the Template', type: 'string' },
	templates: {
		description: 'List of available templates for the purchase order.',
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
			'Terms and conditions text to be displayed on the purchase order document. This field is used to specify payment terms, delivery conditions, return policies, warranty information, or any other legal or business terms that apply to this transaction. The terms appear on the purchase order PDF and form part of the contractual agreement with the vendor.',
		type: 'string',
	},
	terms_default: {
		description: 'Default terms for Purchase Orders',
		type: 'string',
	},
	time: { description: 'Time of the Comment', type: 'string' },
	to_mail_ids: {
		description: 'Array of email address of the recipients.',
		type: 'array',
		items: { type: 'string' },
	},
	total: {
		description: 'Total of the Purchase Order',
		type: 'number',
		format: 'double',
	},
	transaction_id: {
		description:
			'ID of the Transaction. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	transaction_type: { description: 'Type of the transaction', type: 'string' },
	unit: {
		description:
			'Unit of measurement for the quantity (e.g., Nos, kgs, hours, meters). Should match vendor pricing structure. Used for quantity calculations and pricing.',
		type: 'string',
	},
	'update-a-purchase-order-request': {
		required: ['vendor_id', 'line_items'],
		type: 'object',
		properties: {
			vendor_id: { $ref: '#/components/schemas/vendor_id' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			contact_persons_associated: {
				$ref: '#/components/schemas/contact_persons_associated_payload',
			},
			purchaseorder_number: {
				$ref: '#/components/schemas/purchaseorder_number',
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
			discount: { $ref: '#/components/schemas/discount' },
			discount_account_id: { $ref: '#/components/schemas/discount_account_id' },
			is_discount_before_tax: {
				$ref: '#/components/schemas/is_discount_before_tax',
			},
			billing_address_id: { $ref: '#/components/schemas/billing_address_id' },
			crm_owner_id: { $ref: '#/components/schemas/crm_owner_id' },
			crm_custom_reference_id: {
				$ref: '#/components/schemas/crm_custom_reference_id',
			},
			template_id: { $ref: '#/components/schemas/template_id' },
			date: { $ref: '#/components/schemas/date' },
			delivery_date: { $ref: '#/components/schemas/delivery_date' },
			due_date: { $ref: '#/components/schemas/due_date' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			notes: { $ref: '#/components/schemas/notes' },
			notes_default: { $ref: '#/components/schemas/notes_default' },
			terms: { $ref: '#/components/schemas/terms' },
			terms_default: { $ref: '#/components/schemas/terms_default' },
			ship_via: { $ref: '#/components/schemas/ship_via' },
			delivery_org_address_id: {
				$ref: '#/components/schemas/delivery_org_address_id',
			},
			delivery_customer_id: {
				$ref: '#/components/schemas/delivery_customer_id',
			},
			attention: { $ref: '#/components/schemas/attention' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			is_update_customer: { $ref: '#/components/schemas/is_update_customer' },
			salesorder_id: { $ref: '#/components/schemas/salesorder_id' },
			location_id: { $ref: '#/components/schemas/location_id' },
			line_items: {
				description: 'Line items of purchase order.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						line_item_id: { $ref: '#/components/schemas/line_item_id' },
						item_id: { $ref: '#/components/schemas/item_id' },
						account_id: { $ref: '#/components/schemas/account_id' },
						name: { $ref: '#/components/schemas/name' },
						description: { $ref: '#/components/schemas/description' },
						unit: { $ref: '#/components/schemas/unit' },
						location_id: { $ref: '#/components/schemas/location_id' },
						hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
						reverse_charge_tax_id: {
							$ref: '#/components/schemas/reverse_charge_tax_id',
						},
						rate: { $ref: '#/components/schemas/rate' },
						quantity: { $ref: '#/components/schemas/quantity' },
						item_order: { $ref: '#/components/schemas/item_order' },
						tax_id: { $ref: '#/components/schemas/tax_id' },
						tds_tax_id: { $ref: '#/components/schemas/tds_tax_id' },
						tax_treatment_code: {
							$ref: '#/components/schemas/tax_treatment_code',
						},
						tax_exemption_code: {
							$ref: '#/components/schemas/tax_exemption_code',
						},
						tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
						acquisition_vat_id: {
							$ref: '#/components/schemas/acquisition_vat_id',
						},
						reverse_charge_vat_id: {
							$ref: '#/components/schemas/reverse_charge_vat_id',
						},
						item_custom_fields: {
							type: 'array',
							description: 'Custom fields for the line item.',
							items: {
								type: 'object',
								properties: {
									index: { $ref: '#/components/schemas/index' },
									value: { $ref: '#/components/schemas/value' },
								},
							},
						},
						tags: { $ref: '#/components/schemas/tags' },
						line_item_category: {
							$ref: '#/components/schemas/line_item_category',
						},
						project_id: { $ref: '#/components/schemas/project_id' },
					},
				},
			},
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			documents: { $ref: '#/components/schemas/documents' },
			tags: { $ref: '#/components/schemas/tags' },
		},
	},
	'update-a-purchase-order-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			purchaseorder: { $ref: '#/components/schemas/purchaseorder' },
		},
	},
	'update-a-purchaseorder-customfield-request': {
		description: 'Update the custom fields of a purchase order.',
		type: 'object',
		properties: {
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
		},
	},
	'update-an-purchaseorder-customfield-response': {
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
		},
	},
	'update-comment-request': {
		type: 'object',
		properties: {
			description: {
				description: 'The description of the comment.',
				type: 'string',
			},
			expected_delivery_date: {
				$ref: '#/components/schemas/expected_delivery_date',
			},
		},
	},
	'update-comment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'update-purchase-order-template-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	value: { description: 'Value of the Custom Field', type: 'string' },
	vat_treatment: {
		description:
			'(Optional) VAT treatment for the purchase order. VAT treatment denotes the location of the vendor, if the vendor resides in UK then the VAT treatment is <code>uk</code>. If the vendor is in an EU country & VAT registered, you are resides in Northen Ireland and purchasing Goods then his VAT treatment is <code>eu_vat_registered</code> and if he resides outside the UK then his VAT treatment is <code>overseas</code>(For Pre Brexit, this can be split as <code>eu_vat_registered</code>, <code>eu_vat_not_registered</code> and <code>non_eu</code>).',
		type: 'string',
		'x-node_available_in': ['uk'],
		'x-node_unavailable_in': [],
	},
	vendor_id: {
		description:
			'Unique identifier of the vendor for whom the purchase order is being created. This value is mandatory to associate the purchase order with a specific vendor in your organization. You can obtain the vendor ID by listing all vendors using the contacts API. Ensure the vendor exists before referencing their ID here. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	vendor_name: {
		description: 'Name of the Vendor in Purchase Order',
		type: 'string',
	},
	zip: { description: 'ZIP Code of the Address', type: 'string' },
} as const satisfies Record<string, JsonValue>;

export const operations = [
	{
		id: 'create_purchase_order',
		group: 'purchaseOrder',
		groupSlug: 'purchase-order',
		name: 'createPurchaseOrder',
		method: 'POST',
		path: '/purchaseorders',
		summary: 'Create a purchase order',
		description: 'Create a purchase order for your vendor.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-order/',
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
				name: 'attachment',
				in: 'query',
				required: false,
				description:
					'Allowed Extensions: <code>gif</code>, <code>png</code>, <code>jpeg</code>, <code>jpg</code>, <code>bmp</code>, <code>pdf</code>, <code>xls</code>, <code>xlsx</code>, <code>doc</code> and <code>docx</code>.',
				schema: { type: 'string', format: 'binary' },
			},
			{
				name: 'ignore_auto_number_generation',
				in: 'query',
				required: false,
				description:
					'Ignore auto purchase order number generation for this purchase order. This mandates the purchase order number.',
				schema: { type: 'boolean' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/create-a-purchase-order-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/create-a-purchase-order-response',
				},
			},
		],
		scopes: ['ZohoBooks.purchaseorders.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_purchase_orders',
		group: 'purchaseOrder',
		groupSlug: 'purchase-order',
		name: 'listPurchaseOrders',
		method: 'GET',
		path: '/purchaseorders',
		summary: 'List purchase orders',
		description: 'List all purchase orders.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-order/',
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
				name: 'purchaseorder_number',
				in: 'query',
				required: false,
				description:
					'Search purchase order by purchase order number. Variants: <code>purchaseorder_number_startswith</code> and <code>purchaseorder_number_contains</code>. sample: Locate specific PO by number or partial match.',
				schema: { type: 'string' },
			},
			{
				name: 'reference_number',
				in: 'query',
				required: false,
				description:
					'Search purchase order by reference number. Variants: <code>reference_number_startswith</code> and <code>reference_number_contains</code>. sample: Monitor external vendor order numbers.',
				schema: { type: 'string' },
			},
			{
				name: 'date',
				in: 'query',
				required: false,
				description:
					'Search purchase orders by creation date. Use YYYY-MM-DD format for exact date matching. Supports variants: <code>date_start</code>, <code>date_end</code>, <code>date_before</code> and <code>date_after</code>. Useful for finding purchase orders within date ranges or specific time periods.',
				schema: { type: 'string' },
			},
			{
				name: 'status',
				in: 'query',
				required: false,
				description:
					'Search purchase order by status. Allowed values: <code>draft</code>, <code>open</code>, <code>billed</code>, <code>cancelled</code>. sample: Filter POs by current workflow state.',
				schema: {
					type: 'string',
					enum: [
						'draft',
						'pending_approval',
						'approval_overdue',
						'approved',
						'rejected',
						'open',
						'billed',
						'billed_not_received',
						'cancelled',
						'partially_billed',
						'issued',
						'partially_received',
						'received',
						'received_not_billed',
						'manually_received',
						'drop_shipped',
						'closed',
						'accepted',
						'signed',
						'pending_signature',
						'to_be_received',
						'to_be_billed',
						'in_transit',
					],
				},
			},
			{
				name: 'item_name',
				in: 'query',
				required: false,
				description:
					'Search purchase orders by item name. Filters purchase orders based on product or service names in purchase order line items. Supports <code>item_name_startswith</code> and <code>item_name_contains</code> variants. Maximum length is 100 characters. Useful for finding purchase orders with specific products or services.',
				schema: { type: 'string' },
			},
			{
				name: 'item_description',
				in: 'query',
				required: false,
				description:
					'Search purchase orders by item description. Filters purchase orders based on detailed descriptions of products or services in line items. Supports <code>item_description_startswith</code> and <code>item_description_contains</code> variants. Maximum length is 100 characters. Useful for finding purchase orders with specific item descriptions or technical specifications.',
				schema: { type: 'string' },
			},
			{
				name: 'vendor_name',
				in: 'query',
				required: false,
				description:
					'Search purchase order by vendor name. Variants: <code>vendor_name_startswith</code> and <code>vendor_name_contains</code>',
				schema: { type: 'string' },
			},
			{
				name: 'total',
				in: 'query',
				required: false,
				description:
					'Search purchase orders by total amount. Filters purchase orders based on the final purchase order amount including taxes, discounts, and adjustments. Useful for finding purchase orders within specific price ranges or identifying high-value transactions.',
				schema: { type: 'string' },
			},
			{
				name: 'vendor_id',
				in: 'query',
				required: false,
				description:
					'Search purchase order by vendor ID. Use the unique identifier of the vendor to filter purchase orders. sample: Group POs by specific vendor. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'last_modified_time',
				in: 'query',
				required: false,
				description:
					'Search purchase orders modified after a specific time. Filters purchase orders based on their last modification timestamp. Use YYYY-MM-DDTHH:MM:SS-UTC format. Useful for finding recently updated purchase orders or syncing data changes. sample : 2023-11-18T02:02:51-0800, 2025-19-19T02:02:51%2B0800',
				schema: { type: 'string' },
			},
			{
				name: 'item_id',
				in: 'query',
				required: false,
				description:
					'Search purchase orders by item ID. Use the unique identifier of the specific item. sample: Locate all POs containing particular item. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'filter_by',
				in: 'query',
				required: false,
				description:
					'Filter purchase order by status. Allowed values: <code>Status.All</code>, <code>Status.Draft</code>, <code>Status.Open</code>, <code>Status.Billed</code>, <code>Status.Cancelled</code>. sample: Bulk status filtering for reporting.',
				schema: {
					type: 'string',
					enum: [
						'Status.All',
						'Status.Draft',
						'Status.Issued',
						'Status.Billed',
						'Status.PartiallyBilled',
						'Status.BilledNotReceived',
						'Status.Received',
						'Status.ReceivedNotBilled',
						'Status.PartiallyReceived',
						'Status.Cancelled',
						'Status.DropShipped',
						'Status.BackOrdered',
						'Status.ReplenishedOrder',
						'Status.Closed',
						'Status.UnbilledBackOrder',
						'Status.ToBeReceived',
						'Status.Pending',
						'Status.Approved',
						'Status.ApprovalOverdue',
						'Status.MyApprovals',
						'Status.Accepted',
						'Status.CancelledByVendor',
						'Status.CancelledByUser',
						'ExceptionList',
					],
				},
			},
			{
				name: 'search_text',
				in: 'query',
				required: false,
				description:
					'Search purchase order by number, reference, or vendor name. General search across multiple fields. sample: Quick PO lookup without specific field.',
				schema: { type: 'string' },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description:
					'Sort purchase orders by column. Allowed values: <code>vendor_name</code>, <code>purchaseorder_number</code>, <code>date</code>, <code>delivery_date</code>, <code>total</code>, <code>created_time</code>. sample: Organize results for analysis.',
				schema: {
					type: 'string',
					enum: [
						'vendor_name',
						'purchaseorder_number',
						'date',
						'delivery_date',
						'expected_delivery_date',
						'total',
						'created_time',
						'last_modified_time',
					],
				},
			},
			{
				name: 'custom_field',
				in: 'query',
				required: false,
				description:
					"Search purchase order by purchase order's custom field. Variants: <code>custom_field_startswith</code>, <code>custom_field_contains</code>",
				schema: { type: 'string' },
			},
			{
				name: 'created_date',
				in: 'query',
				required: false,
				description:
					'Search purchase orders by creation date. Filters purchase orders based on the date they were created. Use yyyy-mm-dd format. Supports variants: <code>created_date_start</code>, <code>created_date_end</code>. Useful for finding purchase orders created within specific time periods or date ranges.',
				schema: { type: 'string' },
			},
			{
				name: 'location_ids',
				in: 'query',
				required: false,
				description:
					'List of location IDs to filter purchase orders by their associated locations. Use this parameter to retrieve purchase orders linked to specific business locations. Note: This value is a comma-separated list of numeric location IDs.',
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
				schema: { $ref: '#/components/schemas/list-purchase-orders-response' },
			},
		],
		scopes: ['ZohoBooks.purchaseorders.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_purchase_order_using_custom_field',
		group: 'purchaseOrder',
		groupSlug: 'purchase-order',
		name: 'updatePurchaseOrderUsingCustomField',
		method: 'PUT',
		path: '/purchaseorders',
		summary: "Update a purchase order using a custom field's unique value",
		description:
			"A custom field will have unique values if it's configured to not accept duplicate values. Now, you can use that custom field's value to update a purchase order by providing its API name in the X-Unique-Identifier-Key header and its value in the X-Unique-Identifier-Value header. Based on this value, the corresponding purchase order will be retrieved and updated. Additionally, there is an optional X-Upsert header. If the X-Upsert header is true and the custom field's unique value is not found in any of the existing purchase orders, a new purchase order will be created if the necessary payload details are available",
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-order/',
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
			schema: { $ref: '#/components/schemas/update-a-purchase-order-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-a-purchase-order-response',
				},
			},
		],
		scopes: ['ZohoBooks.purchaseorders.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_purchase_order',
		group: 'purchaseOrder',
		groupSlug: 'purchase-order',
		name: 'updatePurchaseOrder',
		method: 'PUT',
		path: '/purchaseorders/{purchaseorder_id}',
		summary: 'Update a purchase order',
		description: 'Update an existing purchase order.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-order/',
		parameters: [
			{
				name: 'purchaseorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the purchase order. Note: This value is a set of numeric characters.',
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
					'Allowed Extensions: <code>gif</code>, <code>png</code>, <code>jpeg</code>, <code>jpg</code>, <code>bmp</code>, <code>pdf</code>, <code>xls</code>, <code>xlsx</code>, <code>doc</code> and <code>docx</code>.',
				schema: { type: 'string', format: 'binary' },
			},
			{
				name: 'ignore_auto_number_generation',
				in: 'query',
				required: false,
				description:
					'Ignore auto purchase order number generation for this purchase order. This mandates the purchase order number.',
				schema: { type: 'boolean' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/update-a-purchase-order-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-a-purchase-order-response',
				},
			},
		],
		scopes: ['ZohoBooks.purchaseorders.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_purchase_order',
		group: 'purchaseOrder',
		groupSlug: 'purchase-order',
		name: 'getPurchaseOrder',
		method: 'GET',
		path: '/purchaseorders/{purchaseorder_id}',
		summary: 'Get a purchase order',
		description: 'Get the details of a purchase order.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-order/',
		parameters: [
			{
				name: 'purchaseorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the purchase order. Note: This value is a set of numeric characters.',
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
					'Get the details of a particular purchase order in formats such as json/ pdf/ html. Default format is json. Allowed Values: <code>json</code>, <code>pdf</code> and <code>html</code>.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/get-a-purchase-order-response' },
			},
		],
		scopes: ['ZohoBooks.purchaseorders.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_purchase_order',
		group: 'purchaseOrder',
		groupSlug: 'purchase-order',
		name: 'deletePurchaseOrder',
		method: 'DELETE',
		path: '/purchaseorders/{purchaseorder_id}',
		summary: 'Delete purchase order',
		description: 'Delete an existing purchase order.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-order/',
		parameters: [
			{
				name: 'purchaseorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the purchase order. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/delete-purchase-order-response' },
			},
		],
		scopes: ['ZohoBooks.purchaseorders.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'update_custom_fields_in_purchase_order',
		group: 'purchaseOrder',
		groupSlug: 'purchase-order',
		name: 'updateCustomFieldsInPurchaseOrder',
		method: 'PUT',
		path: '/purchaseorder/{purchaseorder_id}/customfields',
		summary: 'Update custom field in existing purchaseorders',
		description:
			'Update the value of the custom field in existing purchaseorders.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-order/',
		parameters: [
			{
				name: 'purchaseorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the purchase order. Note: This value is a set of numeric characters.',
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
				$ref: '#/components/schemas/update-a-purchaseorder-customfield-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-an-purchaseorder-customfield-response',
				},
			},
		],
		scopes: ['ZohoBooks.purchaseorders.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_purchase_order_open',
		group: 'purchaseOrder',
		groupSlug: 'purchase-order',
		name: 'markPurchaseOrderOpen',
		method: 'POST',
		path: '/purchaseorders/{purchaseorder_id}/status/open',
		summary: 'Mark a purchase order as open',
		description: 'Mark a draft purchase order as open.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-order/',
		parameters: [
			{
				name: 'purchaseorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the purchase order. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/mark-a-purchase-order-as-open-response',
				},
			},
		],
		scopes: ['ZohoBooks.purchaseorders.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_purchase_order_billed',
		group: 'purchaseOrder',
		groupSlug: 'purchase-order',
		name: 'markPurchaseOrderBilled',
		method: 'POST',
		path: '/purchaseorders/{purchaseorder_id}/status/billed',
		summary: 'Mark as billed',
		description: 'Mark a purchase order as billed.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-order/',
		parameters: [
			{
				name: 'purchaseorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the purchase order. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/mark-as-billed-response' },
			},
		],
		scopes: ['ZohoBooks.purchaseorders.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_purchase_order_cancelled',
		group: 'purchaseOrder',
		groupSlug: 'purchase-order',
		name: 'markPurchaseOrderCancelled',
		method: 'POST',
		path: '/purchaseorders/{purchaseorder_id}/status/cancelled',
		summary: 'Cancel a purchase order',
		description: 'Mark a purchase order as cancelled.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-order/',
		parameters: [
			{
				name: 'purchaseorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the purchase order. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/cancel-a-purchase-order-response',
				},
			},
		],
		scopes: ['ZohoBooks.purchaseorders.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'submit_purchase_order',
		group: 'purchaseOrder',
		groupSlug: 'purchase-order',
		name: 'submitPurchaseOrder',
		method: 'POST',
		path: '/purchaseorders/{purchaseorder_id}/submit',
		summary: 'Submit a purchase order for approval',
		description: 'Submit a purchase order for approval.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-order/',
		parameters: [
			{
				name: 'purchaseorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the purchase order. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/submit-a-purchase-order-for-approval-response',
				},
			},
		],
		scopes: ['ZohoBooks.purchaseorders.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'approve_purchase_order',
		group: 'purchaseOrder',
		groupSlug: 'purchase-order',
		name: 'approvePurchaseOrder',
		method: 'POST',
		path: '/purchaseorders/{purchaseorder_id}/approve',
		summary: 'Approve a purchase order',
		description: 'Approve a purchase order.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-order/',
		parameters: [
			{
				name: 'purchaseorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the purchase order. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/approve-a-purchase-order-response',
				},
			},
		],
		scopes: ['ZohoBooks.purchaseorders.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'email_purchase_order',
		group: 'purchaseOrder',
		groupSlug: 'purchase-order',
		name: 'emailPurchaseOrder',
		method: 'POST',
		path: '/purchaseorders/{purchaseorder_id}/email',
		summary: 'Email a purchase order',
		description:
			'Email a purchase order to the vendor. Input json string is not mandatory. If input json string is empty, mail will be send with default mail content.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-order/',
		parameters: [
			{
				name: 'purchaseorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the purchase order. Note: This value is a set of numeric characters.',
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
				description: 'The files to be attached with the email.',
				schema: { type: 'string', format: 'binary' },
			},
			{
				name: 'send_attachment',
				in: 'query',
				required: false,
				description: 'Send the purchase order attachment a with the email.',
				schema: { type: 'boolean' },
			},
			{
				name: 'file_name',
				in: 'query',
				required: false,
				description: 'Name of the file',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/email-a-purchase-order-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/email-a-purchase-order-response',
				},
			},
		],
		scopes: ['ZohoBooks.purchaseorders.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_purchase_order_email',
		group: 'purchaseOrder',
		groupSlug: 'purchase-order',
		name: 'getPurchaseOrderEmail',
		method: 'GET',
		path: '/purchaseorders/{purchaseorder_id}/email',
		summary: 'Get purchase order email content',
		description: 'Get the email content of a purchase order.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-order/',
		parameters: [
			{
				name: 'purchaseorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the purchase order. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/get-purchase-order-email-content-response',
				},
			},
		],
		scopes: ['ZohoBooks.purchaseorders.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_purchase_order_billing_address',
		group: 'purchaseOrder',
		groupSlug: 'purchase-order',
		name: 'updatePurchaseOrderBillingAddress',
		method: 'PUT',
		path: '/purchaseorders/{purchaseorder_id}/address/billing',
		summary: 'Update billing address',
		description: 'Updates the billing address for this purchase order alone.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-order/',
		parameters: [
			{
				name: 'purchaseorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the purchase order. Note: This value is a set of numeric characters.',
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
		scopes: ['ZohoBooks.purchaseorders.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_purchase_order_templates',
		group: 'purchaseOrder',
		groupSlug: 'purchase-order',
		name: 'listPurchaseOrderTemplates',
		method: 'GET',
		path: '/purchaseorders/templates',
		summary: 'List purchase order templates',
		description: 'Get all purchase order pdf templates.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-order/',
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
					$ref: '#/components/schemas/list-purchase-order-templates-response',
				},
			},
		],
		scopes: ['ZohoBooks.purchaseorders.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_purchase_order_template',
		group: 'purchaseOrder',
		groupSlug: 'purchase-order',
		name: 'updatePurchaseOrderTemplate',
		method: 'PUT',
		path: '/purchaseorders/{purchaseorder_id}/templates/{template_id}',
		summary: 'Update purchase order template',
		description: 'Update the pdf template associated with the purchase order.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-order/',
		parameters: [
			{
				name: 'purchaseorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the purchase order. Note: This value is a set of numeric characters.',
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
					'Unique identifier of the purchase order template. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'templates',
				in: 'query',
				required: false,
				description: 'List of available templates for the purchase order.',
				schema: {
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
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-purchase-order-template-response',
				},
			},
		],
		scopes: ['ZohoBooks.purchaseorders.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_purchase_order_attachment',
		group: 'purchaseOrder',
		groupSlug: 'purchase-order',
		name: 'getPurchaseOrderAttachment',
		method: 'GET',
		path: '/purchaseorders/{purchaseorder_id}/attachment',
		summary: 'Get a purchase order attachment',
		description: 'Returns the file attached to the purchase order.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-order/',
		parameters: [
			{
				name: 'purchaseorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the purchase order. Note: This value is a set of numeric characters.',
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
				description: 'Get the thumbnail of the attachment.',
				schema: { type: 'boolean' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/get-a-purchase-order-attachment-response',
				},
			},
			{ status: '200', contentType: '*/*' },
		],
		scopes: ['ZohoBooks.purchaseorders.READ'],
		riskLevel: 'read',
	},
	{
		id: 'add_purchase_order_attachment',
		group: 'purchaseOrder',
		groupSlug: 'purchase-order',
		name: 'addPurchaseOrderAttachment',
		method: 'POST',
		path: '/purchaseorders/{purchaseorder_id}/attachment',
		summary: 'Add attachment to a purchase order',
		description: 'Attach a file to a purchase order.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-order/',
		parameters: [
			{
				name: 'purchaseorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the purchase order. Note: This value is a set of numeric characters.',
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
					'Allowed Extensions: <code>gif</code>, <code>png</code>, <code>jpeg</code>, <code>jpg</code>, <code>bmp</code>, <code>pdf</code>, <code>xls</code>, <code>xlsx</code>, <code>doc</code> and <code>docx</code>.',
				schema: { type: 'string', format: 'binary' },
			},
		],
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/add-attachment-to-a-purchase-order-response',
				},
			},
		],
		scopes: ['ZohoBooks.purchaseorders.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_purchase_order_attachment',
		group: 'purchaseOrder',
		groupSlug: 'purchase-order',
		name: 'updatePurchaseOrderAttachment',
		method: 'PUT',
		path: '/purchaseorders/{purchaseorder_id}/attachment',
		summary: 'Update attachment preference',
		description:
			'Set whether you want to send the attached file while emailing the purchase order.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-order/',
		parameters: [
			{
				name: 'purchaseorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the purchase order. Note: This value is a set of numeric characters.',
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
				description:
					'Boolean to send the attachment with the purchase order when emailed.',
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
		scopes: ['ZohoBooks.purchaseorders.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_purchase_order_attachment',
		group: 'purchaseOrder',
		groupSlug: 'purchase-order',
		name: 'deletePurchaseOrderAttachment',
		method: 'DELETE',
		path: '/purchaseorders/{purchaseorder_id}/attachment',
		summary: 'Delete an attachment',
		description: 'Delete the file attached to the purchase order.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-order/',
		parameters: [
			{
				name: 'purchaseorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the purchase order. Note: This value is a set of numeric characters.',
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
		scopes: ['ZohoBooks.purchaseorders.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'list_purchase_order_comments',
		group: 'purchaseOrder',
		groupSlug: 'purchase-order',
		name: 'listPurchaseOrderComments',
		method: 'GET',
		path: '/purchaseorders/{purchaseorder_id}/comments',
		summary: 'List purchase order comments & history',
		description: 'Get the complete history and comments of purchase order.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-order/',
		parameters: [
			{
				name: 'purchaseorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the purchase order. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/list-purchase-order-comments-and-history-response',
				},
			},
		],
		scopes: ['ZohoBooks.purchaseorders.READ'],
		riskLevel: 'read',
	},
	{
		id: 'add_purchase_order_comment',
		group: 'purchaseOrder',
		groupSlug: 'purchase-order',
		name: 'addPurchaseOrderComment',
		method: 'POST',
		path: '/purchaseorders/{purchaseorder_id}/comments',
		summary: 'Add comment',
		description: 'Add a comment for a purchase order.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-order/',
		parameters: [
			{
				name: 'purchaseorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the purchase order. Note: This value is a set of numeric characters.',
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
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/add-comment-response' },
			},
		],
		scopes: ['ZohoBooks.purchaseorders.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_purchase_order_comment',
		group: 'purchaseOrder',
		groupSlug: 'purchase-order',
		name: 'updatePurchaseOrderComment',
		method: 'PUT',
		path: '/purchaseorders/{purchaseorder_id}/comments/{comment_id}',
		summary: 'Update comment',
		description: 'Update an existing comment of a purchase order.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-order/',
		parameters: [
			{
				name: 'purchaseorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the purchase order. Note: This value is a set of numeric characters.',
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
		scopes: ['ZohoBooks.purchaseorders.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_purchase_order_comment',
		group: 'purchaseOrder',
		groupSlug: 'purchase-order',
		name: 'deletePurchaseOrderComment',
		method: 'DELETE',
		path: '/purchaseorders/{purchaseorder_id}/comments/{comment_id}',
		summary: 'Delete a comment',
		description: 'Delete a purchase order comment.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-order/',
		parameters: [
			{
				name: 'purchaseorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the purchase order. Note: This value is a set of numeric characters.',
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
		scopes: ['ZohoBooks.purchaseorders.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'reject_purchase_orders',
		group: 'purchaseOrder',
		groupSlug: 'purchase-order',
		name: 'rejectPurchaseOrders',
		method: 'POST',
		path: '/purchaseorders/{purchaseorder_id}/reject',
		summary: 'Reject Purchase Order',
		description: 'Reject a purchase order.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-order/',
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
				name: 'purchaseorder_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the purchase order. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/reject_purchase_order' },
			},
		],
		scopes: ['ZohoBooks.purchaseorders.UPDATE'],
		riskLevel: 'destructive',
	},
] as const satisfies readonly ZohoBooksOperationDefinition[];
