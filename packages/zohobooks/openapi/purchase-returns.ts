import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas = {
	'add-attachment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'address-object': {
		description: 'Address details.',
		type: 'object',
		properties: {
			address: { description: 'Street address.', type: 'string' },
			street2: { description: 'Additional street address.', type: 'string' },
			city: { description: 'City.', type: 'string' },
			state: { description: 'State or province.', type: 'string' },
			zip: { description: 'ZIP or postal code.', type: 'string' },
			country: { description: 'Country.', type: 'string' },
			fax: { description: 'Fax number.', type: 'string' },
			phone: { description: 'Phone number.', type: 'string' },
			attention: {
				description: 'Name of the attention person.',
				type: 'string',
			},
		},
	},
	bcy_sub_total: {
		description: 'Sub-total of the purchase return in base currency.',
		type: 'number',
		format: 'double',
	},
	can_create_vendorcredit: {
		description:
			'Whether a vendor credit can be created from this purchase return.',
		type: 'boolean',
	},
	'close-purchase-return-request': {
		type: 'object',
		properties: {
			line_items: {
				description: 'Line items with quantities to cancel.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						line_item_id: {
							description: 'Unique ID of the line item.',
							type: 'string',
						},
						qty_cancelled: {
							description: 'Quantity to cancel.',
							type: 'number',
							format: 'double',
						},
					},
				},
			},
		},
	},
	'close-purchase-return-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'confirm-purchase-return-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	contact: {
		description: 'Contact details of the vendor.',
		type: 'object',
		properties: {
			contact_id: { description: 'Unique ID of the contact.', type: 'string' },
			name: { description: 'Name of the contact.', type: 'string' },
		},
	},
	'create-purchase-return-request': {
		required: ['date', 'vendor_id', 'line_items'],
		type: 'object',
		properties: {
			purchasereturn_number: {
				description:
					'Unique number for the purchase return. Required when <code>ignore_auto_number_generation</code> is <code>true</code>. Max-length [50].',
				type: 'string',
			},
			reference_number: {
				description:
					'Reference number for the purchase return. Max-length [100].',
				type: 'string',
			},
			date: {
				description: 'Date of the purchase return. Format [yyyy-mm-dd].',
				type: 'string',
			},
			reason: {
				description:
					'Reason for creating the purchase return. Max-length [1000].',
				type: 'string',
			},
			vendor_id: { description: 'Unique ID of the vendor.', type: 'string' },
			is_inclusive_tax: {
				description: 'Whether the line item rates are inclusive of tax.',
				type: 'boolean',
			},
			line_items: {
				description: 'Line items in the purchase return.',
				type: 'array',
				items: {
					$ref: '#/components/schemas/purchase-return-line-item-request',
				},
			},
			terms: {
				description: 'Terms and conditions. Max-length [10000].',
				type: 'string',
			},
			gst_treatment: {
				description: 'GST treatment for the vendor.',
				type: 'string',
			},
			tax_treatment: {
				description: 'Tax treatment for the vendor.',
				type: 'string',
			},
			vat_treatment: {
				description: 'VAT treatment for the vendor.',
				type: 'string',
			},
			source_of_supply: {
				description: 'Source state code for GST. Max-length [5].',
				type: 'string',
			},
			destination_of_supply: {
				description: 'Destination state code for GST. Max-length [5].',
				type: 'string',
			},
			place_of_supply: {
				description: 'Place of supply state code. Max-length [5].',
				type: 'string',
			},
			discount: {
				description: 'Discount applied on the purchase return.',
				type: 'string',
			},
			is_discount_before_tax: {
				description: 'Whether the discount is applied before tax calculation.',
				type: 'boolean',
			},
			discount_type: {
				description:
					'Type of discount. Possible values: <code>entity_level</code>, <code>item_level</code>.',
				type: 'string',
			},
			shipping_charge: {
				description: 'Shipping charges for the purchase return.',
				type: 'number',
				format: 'double',
			},
			adjustment: {
				description: 'Adjustment amount (positive or negative).',
				type: 'number',
				format: 'double',
			},
			adjustment_description: {
				description: 'Description for the adjustment. Max-length [100].',
				type: 'string',
			},
			exchange_rate: {
				description: 'Exchange rate for the currency used.',
				type: 'number',
				format: 'double',
			},
			currency_id: {
				description: 'Unique ID of the currency.',
				type: 'string',
			},
			billing_address_id: {
				description: 'Unique ID of the billing address.',
				type: 'string',
			},
			shipping_address_id: {
				description: 'Unique ID of the shipping address.',
				type: 'string',
			},
			location_id: {
				description: 'Unique ID of the location.',
				type: 'string',
			},
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
		},
	},
	'create-purchase-return-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			purchasereturn: { $ref: '#/components/schemas/purchase-return-response' },
		},
	},
	currency_code: {
		description: 'Currency code (e.g. USD, INR).',
		type: 'string',
	},
	currency_id: {
		description: 'Unique ID of the currency used in the purchase return.',
		type: 'string',
	},
	currency_symbol: {
		description: 'Currency symbol (e.g. $, ₹).',
		type: 'string',
	},
	custom_fields: {
		description: 'Custom fields associated with the purchase return.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				customfield_id: {
					description: 'Unique ID of the custom field.',
					type: 'string',
				},
				value: { description: 'Value of the custom field.', type: 'string' },
			},
		},
	},
	date: {
		description: 'Date of the purchase return. Format [yyyy-mm-dd].',
		type: 'string',
	},
	'delete-attachment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-purchase-return-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	destination_of_supply: {
		description: 'Destination state code for GST.',
		type: 'string',
	},
	discount: {
		description:
			'Discount applied on the purchase return. Can be a percentage (e.g. <code>10%</code>) or a flat amount.',
		type: 'string',
	},
	discount_type: {
		description:
			'Type of discount applied. Possible values: <code>entity_level</code>, <code>item_level</code>.',
		type: 'string',
	},
	dn_status: {
		description:
			'Vendor credit (debit note) status of the purchase return. Possible values: <code>refunded</code>, <code>not_refunded</code>, <code>partially_refunded</code>.',
		type: 'string',
	},
	documents: {
		description: 'Documents attached to the purchase return.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				document_id: {
					description: 'Unique ID of the document.',
					type: 'string',
				},
				file_name: { description: 'Name of the file.', type: 'string' },
				file_type: { description: 'Type of the file.', type: 'string' },
				file_size: {
					description: 'Size of the file in bytes.',
					type: 'integer',
				},
			},
		},
	},
	'email-purchase-return-request': {
		type: 'object',
		properties: {
			to_mail_ids: {
				description: 'Array of recipient email addresses.',
				type: 'array',
				items: { type: 'string' },
			},
			cc_mail_ids: {
				description: 'Array of CC email addresses.',
				type: 'array',
				items: { type: 'string' },
			},
			bcc_mail_ids: {
				description: 'Array of BCC email addresses.',
				type: 'array',
				items: { type: 'string' },
			},
			subject: {
				description: 'Subject of the email. Max-length [1000].',
				type: 'string',
			},
			body: {
				description: 'Body of the email. Max-length [100000].',
				type: 'string',
			},
		},
	},
	'email-purchase-return-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	exchange_rate: {
		description: 'Exchange rate for the currency used.',
		type: 'number',
		format: 'double',
	},
	'fulfill-purchase-return-request': {
		type: 'object',
		properties: {
			line_items: {
				description: 'Line items to fulfill.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						purchasereturn_item_id: {
							description: 'Unique ID of the purchase return line item.',
							type: 'string',
						},
						quantity: { description: 'Quantity to fulfill.', type: 'integer' },
					},
				},
			},
		},
	},
	'fulfill-purchase-return-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-purchase-return-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			purchasereturn: { $ref: '#/components/schemas/purchase-return-response' },
		},
	},
	gst_no: {
		description: 'GST identification number. Max-length [15].',
		type: 'string',
	},
	gst_treatment: {
		description: 'GST treatment for the vendor.',
		type: 'string',
	},
	is_adv_tracking_in_package: {
		description:
			'Whether advanced tracking (serial/batch) is enabled for packaging in this purchase return.',
		type: 'boolean',
	},
	is_discount_before_tax: {
		description: 'Whether the discount is applied before tax calculation.',
		type: 'boolean',
	},
	is_inclusive_tax: {
		description: 'Whether the line item rates are inclusive of tax.',
		type: 'boolean',
	},
	line_items: {
		description: 'Line items in the purchase return.',
		type: 'array',
		items: { $ref: '#/components/schemas/purchase-return-line-item-response' },
	},
	'list-purchase-returns-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			purchasereturns: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						purchasereturn_id: {
							$ref: '#/components/schemas/purchasereturn_id',
						},
						purchasereturn_number: {
							$ref: '#/components/schemas/purchasereturn_number',
						},
						purchaseorder_number: {
							description:
								'Purchase order number associated with the purchase return.',
							type: 'string',
						},
						date: { $ref: '#/components/schemas/date' },
						reason: { $ref: '#/components/schemas/reason' },
						vendor_id: { $ref: '#/components/schemas/vendor_id' },
						vendor_name: { $ref: '#/components/schemas/vendor_name' },
						quantity: {
							description: 'Total return quantity.',
							type: 'number',
							format: 'double',
						},
						amount: {
							description: 'Total return amount.',
							type: 'number',
							format: 'double',
						},
						purchasereturn_status: {
							$ref: '#/components/schemas/purchasereturn_status',
						},
						shipment_status: {
							description:
								'Shipment status. Possible values: <code>shipped</code>, <code>not_shipped</code>, <code>partially_shipped</code>.',
							type: 'string',
						},
						package_status: {
							description:
								'Package status. Possible values: <code>packed</code>, <code>not_packed</code>, <code>partially_packed</code>.',
							type: 'string',
						},
						picked_status: {
							description:
								'Pick list status. Possible values: <code>picked</code>, <code>not_picked</code>, <code>partially_picked</code>.',
							type: 'string',
						},
						refund_status: {
							description:
								'Refund status. Possible values: <code>refunded</code>, <code>not_refunded</code>, <code>partially_refunded</code>.',
							type: 'string',
						},
						created_time: {
							description: 'Time at which the purchase return was created.',
							type: 'string',
						},
						last_modified_time: {
							description:
								'Time at which the purchase return was last modified.',
							type: 'string',
						},
					},
				},
			},
			page_context: { $ref: '#/components/schemas/page_context' },
		},
	},
	location_id: { description: 'Unique ID of the location.', type: 'string' },
	location_name: { description: 'Name of the location.', type: 'string' },
	page_context: {
		type: 'object',
		properties: {
			page: { description: 'Current page number.', type: 'integer' },
			per_page: { description: 'Number of records per page.', type: 'integer' },
			has_more_page: {
				description: 'Whether there are more pages.',
				type: 'boolean',
			},
			report_name: { description: 'Name of the report.', type: 'string' },
			applied_filter: {
				description: 'Filter applied to the list.',
				type: 'string',
			},
			sort_column: {
				description: 'Column by which the results are sorted.',
				type: 'string',
			},
			sort_order: {
				description:
					'Order of sorting. Possible values: <code>A</code> (ascending), <code>D</code> (descending).',
				type: 'string',
			},
		},
	},
	place_of_supply: {
		description: 'Place of supply state code.',
		type: 'string',
	},
	'purchase-return-line-item-request': {
		type: 'object',
		required: ['quantity'],
		properties: {
			item_id: { description: 'Unique ID of the item.', type: 'string' },
			po_item_id: {
				description: 'Unique ID of the corresponding purchase order line item.',
				type: 'string',
			},
			name: {
				description: 'Name of the item. Max-length [200].',
				type: 'string',
			},
			description: {
				description: 'Description of the line item. Max-length [1000].',
				type: 'string',
			},
			quantity: {
				description: 'Quantity being returned.',
				type: 'number',
				format: 'double',
			},
			unit: {
				description: 'Unit of measurement. Max-length [120].',
				type: 'string',
			},
			rate: {
				description: 'Rate (price) per unit of the item.',
				type: 'number',
				format: 'double',
			},
			item_order: {
				description: 'Display order of the line item.',
				type: 'integer',
			},
			tax_id: {
				description: 'Unique ID of the tax to apply to this line item.',
				type: 'string',
			},
			tax_exemption_id: {
				description: 'Unique ID of the tax exemption.',
				type: 'string',
			},
			hsn_or_sac: {
				description: 'HSN or SAC code for the item.',
				type: 'string',
			},
			location_id: {
				description: 'Unique ID of the location.',
				type: 'string',
			},
			discount: {
				description: 'Discount applied on the line item.',
				type: 'string',
			},
		},
	},
	'purchase-return-line-item-response': {
		type: 'object',
		properties: {
			line_item_id: {
				description: 'Unique ID of the line item.',
				type: 'string',
			},
			item_id: { description: 'Unique ID of the item.', type: 'string' },
			po_item_id: {
				description: 'Unique ID of the corresponding purchase order line item.',
				type: 'string',
			},
			item_order: {
				description: 'Display order of the line item.',
				type: 'integer',
			},
			name: { description: 'Name of the item.', type: 'string' },
			description: {
				description: 'Description of the line item.',
				type: 'string',
			},
			quantity: {
				description: 'Quantity being returned.',
				type: 'number',
				format: 'double',
			},
			quantity_remaining: {
				description: 'Remaining quantity to be processed.',
				type: 'number',
				format: 'double',
			},
			quantity_packed: {
				description: 'Quantity that has been packed.',
				type: 'number',
				format: 'double',
			},
			quantity_shipped: {
				description: 'Quantity that has been shipped.',
				type: 'number',
				format: 'double',
			},
			quantity_returned: {
				description: 'Total quantity returned.',
				type: 'number',
				format: 'double',
			},
			quantity_cancelled: {
				description: 'Quantity that has been cancelled.',
				type: 'number',
				format: 'double',
			},
			unit: {
				description: 'Unit of measurement for the item.',
				type: 'string',
			},
			rate: {
				description: 'Rate (price) per unit of the item.',
				type: 'number',
				format: 'double',
			},
			item_total: {
				description: 'Total amount for this line item.',
				type: 'number',
				format: 'double',
			},
			account_id: {
				description: 'Unique ID of the account associated with this line item.',
				type: 'string',
			},
			item_type: {
				description:
					'Type of item. Possible values: <code>inventory</code>, <code>sales</code>, <code>purchases</code>, <code>sales_and_purchases</code>, <code>service</code>.',
				type: 'string',
			},
			tax_id: {
				description: 'Unique ID of the tax applied to this line item.',
				type: 'string',
			},
			tax_name: { description: 'Name of the tax applied.', type: 'string' },
			tax_type: { description: 'Type of tax applied.', type: 'string' },
			tax_percentage: {
				description: 'Tax percentage applied to this line item.',
				type: 'number',
				format: 'double',
			},
			location_id: {
				description: 'Unique ID of the location for this line item.',
				type: 'string',
			},
			location_name: { description: 'Name of the location.', type: 'string' },
			discount: {
				description: 'Discount applied on the line item.',
				type: 'string',
			},
			line_item_taxes: {
				description: 'Taxes applied on the line item.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						tax_id: { description: 'Unique ID of the tax.', type: 'string' },
						tax_name: { description: 'Name of the tax.', type: 'string' },
						tax_amount: {
							description: 'Amount of tax applied.',
							type: 'number',
							format: 'double',
						},
					},
				},
			},
		},
	},
	'purchase-return-response': {
		type: 'object',
		properties: {
			purchasereturn_id: { $ref: '#/components/schemas/purchasereturn_id' },
			purchasereturn_number: {
				$ref: '#/components/schemas/purchasereturn_number',
			},
			reference_number: { $ref: '#/components/schemas/reference_number' },
			date: { $ref: '#/components/schemas/date' },
			reason: { $ref: '#/components/schemas/reason' },
			total_quantity: { $ref: '#/components/schemas/total_quantity' },
			sub_total: { $ref: '#/components/schemas/sub_total' },
			bcy_sub_total: { $ref: '#/components/schemas/bcy_sub_total' },
			total: { $ref: '#/components/schemas/total' },
			purchasereturn_status: {
				$ref: '#/components/schemas/purchasereturn_status',
			},
			shipped_status: { $ref: '#/components/schemas/shipped_status' },
			dn_status: { $ref: '#/components/schemas/dn_status' },
			vendor_id: { $ref: '#/components/schemas/vendor_id' },
			contact: { $ref: '#/components/schemas/contact' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			currency_code: { $ref: '#/components/schemas/currency_code' },
			currency_symbol: { $ref: '#/components/schemas/currency_symbol' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			line_items: { $ref: '#/components/schemas/line_items' },
			purchaseorders: { $ref: '#/components/schemas/purchaseorders' },
			vendorcredits: { $ref: '#/components/schemas/vendorcredits' },
			billing_address: { $ref: '#/components/schemas/address-object' },
			shipping_address: { $ref: '#/components/schemas/address-object' },
			terms: { $ref: '#/components/schemas/terms' },
			template_name: { $ref: '#/components/schemas/template_name' },
			template_id: { $ref: '#/components/schemas/template_id' },
			location_id: { $ref: '#/components/schemas/location_id' },
			location_name: { $ref: '#/components/schemas/location_name' },
			documents: { $ref: '#/components/schemas/documents' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			gst_no: { $ref: '#/components/schemas/gst_no' },
			tax_reg_no: { $ref: '#/components/schemas/tax_reg_no' },
			source_of_supply: { $ref: '#/components/schemas/source_of_supply' },
			destination_of_supply: {
				$ref: '#/components/schemas/destination_of_supply',
			},
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			discount: { $ref: '#/components/schemas/discount' },
			is_discount_before_tax: {
				$ref: '#/components/schemas/is_discount_before_tax',
			},
			discount_type: { $ref: '#/components/schemas/discount_type' },
			can_create_vendorcredit: {
				$ref: '#/components/schemas/can_create_vendorcredit',
			},
			is_adv_tracking_in_package: {
				$ref: '#/components/schemas/is_adv_tracking_in_package',
			},
		},
	},
	purchaseorders: {
		description: 'Purchase orders associated with this purchase return.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				purchaseorder_id: {
					description: 'Unique ID of the purchase order.',
					type: 'string',
				},
				purchaseorder_number: {
					description: 'Purchase order number.',
					type: 'string',
				},
				purchaseorder_date: {
					description: 'Date of the purchase order.',
					type: 'string',
				},
			},
		},
	},
	purchasereturn_id: {
		description: 'Unique ID generated by the server for the purchase return.',
		type: 'string',
	},
	purchasereturn_number: {
		description: 'Unique number assigned to the purchase return.',
		type: 'string',
	},
	purchasereturn_status: {
		description:
			'Status of the purchase return. Possible values: <code>draft</code>, <code>confirmed</code>, <code>void</code>, <code>closed</code>.',
		type: 'string',
	},
	reason: {
		description:
			'Reason for returning the items to the vendor. Max-length [1000].',
		type: 'string',
	},
	reference_number: {
		description: 'Reference number for the purchase return. Max-length [100].',
		type: 'string',
	},
	'reopen-purchase-return-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	shipped_status: {
		description:
			'Shipment status of the purchase return. Possible values: <code>shipped</code>, <code>not_shipped</code>, <code>partially_shipped</code>.',
		type: 'string',
	},
	source_of_supply: {
		description: 'Source state code for GST.',
		type: 'string',
	},
	sub_total: {
		description:
			'Sub-total of the purchase return (before taxes and adjustments).',
		type: 'number',
		format: 'double',
	},
	tax_reg_no: {
		description: 'Tax registration number of the vendor.',
		type: 'string',
	},
	tax_treatment: {
		description: 'Tax treatment for the vendor.',
		type: 'string',
	},
	template_id: {
		description:
			'Unique ID of the PDF template associated with the purchase return.',
		type: 'string',
	},
	template_name: {
		description:
			'Name of the PDF template associated with the purchase return.',
		type: 'string',
	},
	terms: {
		description:
			'Terms and conditions for the purchase return. Max-length [10000].',
		type: 'string',
	},
	total: {
		description: 'Total amount of the purchase return.',
		type: 'number',
		format: 'double',
	},
	total_quantity: {
		description: 'Total quantity of all items in the purchase return.',
		type: 'number',
		format: 'double',
	},
	'unfulfill-purchase-return-request': {
		type: 'object',
		properties: {
			line_items: {
				description: 'Line items to unfulfill.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						purchasereturn_item_id: {
							description: 'Unique ID of the purchase return line item.',
							type: 'string',
						},
						quantity: {
							description: 'Quantity to unfulfill.',
							type: 'integer',
						},
					},
				},
			},
		},
	},
	'unfulfill-purchase-return-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'update-address-request': {
		type: 'object',
		properties: {
			address: { description: 'Street address.', type: 'string' },
			street2: { description: 'Additional street address.', type: 'string' },
			city: { description: 'City.', type: 'string' },
			state: { description: 'State or province.', type: 'string' },
			zip: { description: 'ZIP or postal code.', type: 'string' },
			country: { description: 'Country.', type: 'string' },
			fax: { description: 'Fax number.', type: 'string' },
			phone: { description: 'Phone number.', type: 'string' },
			attention: { description: 'Attention person.', type: 'string' },
		},
	},
	'update-billing-address-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'update-purchase-return-request': {
		type: 'object',
		properties: {
			purchasereturn_number: {
				description: 'Unique number for the purchase return. Max-length [50].',
				type: 'string',
			},
			reference_number: {
				description:
					'Reference number for the purchase return. Max-length [100].',
				type: 'string',
			},
			date: {
				description: 'Date of the purchase return. Format [yyyy-mm-dd].',
				type: 'string',
			},
			reason: {
				description: 'Reason for the purchase return. Max-length [1000].',
				type: 'string',
			},
			vendor_id: { description: 'Unique ID of the vendor.', type: 'string' },
			is_inclusive_tax: {
				description: 'Whether the line item rates are inclusive of tax.',
				type: 'boolean',
			},
			line_items: {
				description: 'Line items in the purchase return.',
				type: 'array',
				items: {
					$ref: '#/components/schemas/purchase-return-line-item-request',
				},
			},
			terms: {
				description: 'Terms and conditions. Max-length [10000].',
				type: 'string',
			},
			gst_treatment: {
				description: 'GST treatment for the vendor.',
				type: 'string',
			},
			tax_treatment: {
				description: 'Tax treatment for the vendor.',
				type: 'string',
			},
			vat_treatment: {
				description: 'VAT treatment for the vendor.',
				type: 'string',
			},
			source_of_supply: {
				description: 'Source state code for GST. Max-length [5].',
				type: 'string',
			},
			destination_of_supply: {
				description: 'Destination state code for GST. Max-length [5].',
				type: 'string',
			},
			place_of_supply: {
				description: 'Place of supply state code. Max-length [5].',
				type: 'string',
			},
			discount: {
				description: 'Discount applied on the purchase return.',
				type: 'string',
			},
			is_discount_before_tax: {
				description: 'Whether the discount is applied before tax calculation.',
				type: 'boolean',
			},
			discount_type: {
				description:
					'Type of discount. Possible values: <code>entity_level</code>, <code>item_level</code>.',
				type: 'string',
			},
			shipping_charge: {
				description: 'Shipping charges for the purchase return.',
				type: 'number',
				format: 'double',
			},
			adjustment: {
				description: 'Adjustment amount (positive or negative).',
				type: 'number',
				format: 'double',
			},
			adjustment_description: {
				description: 'Description for the adjustment. Max-length [100].',
				type: 'string',
			},
			exchange_rate: {
				description: 'Exchange rate for the currency used.',
				type: 'number',
				format: 'double',
			},
			currency_id: {
				description: 'Unique ID of the currency.',
				type: 'string',
			},
			billing_address_id: {
				description: 'Unique ID of the billing address.',
				type: 'string',
			},
			shipping_address_id: {
				description: 'Unique ID of the shipping address.',
				type: 'string',
			},
			location_id: {
				description: 'Unique ID of the location.',
				type: 'string',
			},
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
		},
	},
	'update-purchase-return-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			purchasereturn: { $ref: '#/components/schemas/purchase-return-response' },
		},
	},
	'update-shipping-address-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	vat_treatment: {
		description: 'VAT treatment for the vendor.',
		type: 'string',
	},
	vendor_id: {
		description: 'Unique ID of the vendor associated with the purchase return.',
		type: 'string',
	},
	vendor_name: { description: 'Name of the vendor.', type: 'string' },
	vendorcredits: {
		description: 'Vendor credits associated with this purchase return.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				vendor_credit_id: {
					description: 'Unique ID of the vendor credit.',
					type: 'string',
				},
				vendor_credit_number: {
					description: 'Vendor credit number.',
					type: 'string',
				},
				date: { description: 'Date of the vendor credit.', type: 'string' },
				total: {
					description: 'Total amount of the vendor credit.',
					type: 'number',
					format: 'double',
				},
				status: { description: 'Status of the vendor credit.', type: 'string' },
			},
		},
	},
	'void-purchase-return-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
} as const satisfies Record<string, JsonValue>;

export const operations = [
	{
		id: 'create_purchase_return',
		group: 'purchaseReturns',
		groupSlug: 'purchase-returns',
		name: 'createPurchaseReturn',
		method: 'POST',
		path: '/purchasereturns',
		summary: 'Create a purchase return',
		description:
			'Create a new purchase return for a vendor. A purchase return can be created standalone or from a purchase order.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-returns/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. <code>Note</code>: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'ignore_auto_number_generation',
				in: 'query',
				required: false,
				description:
					'Ignore auto purchase return number generation for this purchase return. This mandates the purchase return number. Allowed values are <code>true</code> and <code>false</code>.',
				schema: { type: 'boolean' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/create-purchase-return-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/create-purchase-return-response',
				},
			},
		],
		scopes: ['ZohoBooks.purchasereturns.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_purchase_returns',
		group: 'purchaseReturns',
		groupSlug: 'purchase-returns',
		name: 'listPurchaseReturns',
		method: 'GET',
		path: '/purchasereturns',
		summary: 'List purchase returns',
		description:
			'List all purchase returns. Use query parameters to filter by status, vendor, date range, and other criteria.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-returns/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. <code>Note</code>: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'filter_by',
				in: 'query',
				required: false,
				description:
					'Filter purchase returns by status. Allowed values: <code>Status.All</code>, <code>Status.Draft</code>, <code>Status.Confirmed</code>, <code>Status.Void</code>, <code>Status.Closed</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'status',
				in: 'query',
				required: false,
				description:
					'Filter by purchase return status. Allowed values: <code>draft</code>, <code>confirmed</code>, <code>void</code>, <code>closed</code>, <code>shipped</code>, <code>refunded</code>, <code>not_shipped</code>, <code>not_refunded</code>, <code>partially_shipped</code>, <code>partially_refunded</code>, <code>packed</code>, <code>not_packed</code>, <code>partially_packed</code>, <code>picked</code>, <code>not_picked</code>, <code>partially_picked</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'search_text',
				in: 'query',
				required: false,
				description:
					'Search purchase returns by purchase return number, vendor name, or other searchable fields.',
				schema: { type: 'string' },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description:
					'Column by which the list should be sorted. Allowed values: <code>purchasereturn_number</code>, <code>vendor_name</code>, <code>purchaseorder_number</code>, <code>date</code>, <code>created_time</code>, <code>last_modified_time</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'purchasereturn_date',
				in: 'query',
				required: false,
				description:
					'Search purchase returns by date. Use YYYY-MM-DD format. Variants: <code>purchasereturn_date_start</code>, <code>purchasereturn_date_end</code>, <code>purchasereturn_date_before</code>, <code>purchasereturn_date_after</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'vendor_name',
				in: 'query',
				required: false,
				description:
					'Search purchase returns by vendor name. Variants: <code>vendor_name_startswith</code>, <code>vendor_name_contains</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'purchasereturn_number',
				in: 'query',
				required: false,
				description:
					'Search purchase returns by purchase return number. Variants: <code>purchasereturn_number_startswith</code>, <code>purchasereturn_number_contains</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'purchaseorder_number',
				in: 'query',
				required: false,
				description:
					'Search purchase returns by purchase order number. Variants: <code>purchaseorder_number_startswith</code>, <code>purchaseorder_number_contains</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'item_name',
				in: 'query',
				required: false,
				description:
					'Search purchase returns by item name. Variants: <code>item_name_startswith</code>, <code>item_name_contains</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'item_description',
				in: 'query',
				required: false,
				description:
					'Search purchase returns by item description. Variants: <code>item_description_startswith</code>, <code>item_description_contains</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'customview_id',
				in: 'query',
				required: false,
				description: 'Filter purchase returns by custom view.',
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
				schema: { $ref: '#/components/schemas/list-purchase-returns-response' },
			},
		],
		scopes: ['ZohoBooks.purchasereturns.READ'],
		riskLevel: 'read',
	},
	{
		id: 'get_purchase_return',
		group: 'purchaseReturns',
		groupSlug: 'purchase-returns',
		name: 'getPurchaseReturn',
		method: 'GET',
		path: '/purchasereturns/{purchase_return_id}',
		summary: 'Retrieve a purchase return',
		description: 'Retrieve the details of an existing purchase return.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-returns/',
		parameters: [
			{
				name: 'purchase_return_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the purchase return.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. <code>Note</code>: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'print',
				in: 'query',
				required: false,
				description:
					'Set to <code>true</code> to get the print-friendly version of the purchase return.',
				schema: { type: 'boolean' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/get-purchase-return-response' },
			},
		],
		scopes: ['ZohoBooks.purchasereturns.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_purchase_return',
		group: 'purchaseReturns',
		groupSlug: 'purchase-returns',
		name: 'updatePurchaseReturn',
		method: 'PUT',
		path: '/purchasereturns/{purchase_return_id}',
		summary: 'Update a purchase return',
		description: 'Update an existing purchase return.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-returns/',
		parameters: [
			{
				name: 'purchase_return_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the purchase return.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. <code>Note</code>: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/update-purchase-return-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-purchase-return-response',
				},
			},
		],
		scopes: ['ZohoBooks.purchasereturns.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_purchase_return',
		group: 'purchaseReturns',
		groupSlug: 'purchase-returns',
		name: 'deletePurchaseReturn',
		method: 'DELETE',
		path: '/purchasereturns/{purchase_return_id}',
		summary: 'Delete a purchase return',
		description: 'Delete an existing purchase return.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-returns/',
		parameters: [
			{
				name: 'purchase_return_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the purchase return.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. <code>Note</code>: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/delete-purchase-return-response',
				},
			},
		],
		scopes: ['ZohoBooks.purchasereturns.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'confirm_purchase_return',
		group: 'purchaseReturns',
		groupSlug: 'purchase-returns',
		name: 'confirmPurchaseReturn',
		method: 'POST',
		path: '/purchasereturns/{purchase_return_id}/status/open',
		summary: 'Confirm a purchase return',
		description: 'Change the status of a draft purchase return to confirmed.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-returns/',
		parameters: [
			{
				name: 'purchase_return_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the purchase return.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. <code>Note</code>: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/confirm-purchase-return-response',
				},
			},
		],
		scopes: ['ZohoBooks.purchasereturns.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'void_purchase_return',
		group: 'purchaseReturns',
		groupSlug: 'purchase-returns',
		name: 'voidPurchaseReturn',
		method: 'POST',
		path: '/purchasereturns/{purchase_return_id}/status/void',
		summary: 'Void a purchase return',
		description: 'Mark an existing purchase return as void.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-returns/',
		parameters: [
			{
				name: 'purchase_return_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the purchase return.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. <code>Note</code>: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'reason',
				in: 'query',
				required: false,
				description:
					'Reason for voiding the purchase return. Max-length [500].',
				schema: { type: 'string', maxLength: 500 },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/void-purchase-return-response' },
			},
		],
		scopes: ['ZohoBooks.purchasereturns.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'fulfill_purchase_return',
		group: 'purchaseReturns',
		groupSlug: 'purchase-returns',
		name: 'fulfillPurchaseReturn',
		method: 'POST',
		path: '/purchasereturns/{purchase_return_id}/status/fulfilled',
		summary: 'Fulfill a purchase return',
		description:
			'Mark the items in a purchase return as fulfilled (shipped back to the vendor).',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-returns/',
		parameters: [
			{
				name: 'purchase_return_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the purchase return.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. <code>Note</code>: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/fulfill-purchase-return-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/fulfill-purchase-return-response',
				},
			},
		],
		scopes: ['ZohoBooks.purchasereturns.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'unfulfill_purchase_return',
		group: 'purchaseReturns',
		groupSlug: 'purchase-returns',
		name: 'unfulfillPurchaseReturn',
		method: 'POST',
		path: '/purchasereturns/{purchase_return_id}/status/unfulfilled',
		summary: 'Unfulfill a purchase return',
		description: 'Reverse the fulfillment of items in a purchase return.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-returns/',
		parameters: [
			{
				name: 'purchase_return_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the purchase return.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. <code>Note</code>: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: {
				$ref: '#/components/schemas/unfulfill-purchase-return-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/unfulfill-purchase-return-response',
				},
			},
		],
		scopes: ['ZohoBooks.purchasereturns.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'email_purchase_return',
		group: 'purchaseReturns',
		groupSlug: 'purchase-returns',
		name: 'emailPurchaseReturn',
		method: 'POST',
		path: '/purchasereturns/{purchase_return_id}/email',
		summary: 'Email a purchase return',
		description:
			'Send a purchase return via email to the vendor or specified recipients.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-returns/',
		parameters: [
			{
				name: 'purchase_return_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the purchase return.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. <code>Note</code>: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'send_attachment',
				in: 'query',
				required: false,
				description: 'Send the purchase return attachment with the email.',
				schema: { type: 'boolean' },
			},
			{
				name: 'attach_pdf',
				in: 'query',
				required: false,
				description: 'Whether to attach the PDF of the purchase return.',
				schema: { type: 'boolean' },
			},
			{
				name: 'file_name',
				in: 'query',
				required: false,
				description:
					'Custom file name for the PDF attachment. Max-length [100].',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/email-purchase-return-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/email-purchase-return-response' },
			},
		],
		scopes: ['ZohoBooks.purchasereturns.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'add_attachment_to_purchase_return',
		group: 'purchaseReturns',
		groupSlug: 'purchase-returns',
		name: 'addAttachmentToPurchaseReturn',
		method: 'POST',
		path: '/purchasereturns/{purchase_return_id}/attachment',
		summary: 'Add attachment to a purchase return',
		description:
			'Attach a file to a purchase return. The file must be multipart/form-data. Allowed extensions: gif, png, jpeg, jpg, bmp, pdf, xls, xlsx, doc, docx, xml, csv, txt, tif, tiff, msg, eml, dwg. Maximum file size is 10 MB.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-returns/',
		parameters: [
			{
				name: 'purchase_return_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the purchase return.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. <code>Note</code>: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'multipart/form-data',
			required: false,
			schema: {
				type: 'object',
				properties: {
					attachment: {
						type: 'string',
						format: 'binary',
						description: 'File to attach to the purchase return.',
					},
					can_send_in_mail: {
						type: 'boolean',
						description:
							'Set to <code>true</code> to allow the attachment to be sent via email.',
					},
				},
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/add-attachment-response' },
			},
		],
		scopes: ['ZohoBooks.purchasereturns.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'close_purchase_return',
		group: 'purchaseReturns',
		groupSlug: 'purchase-returns',
		name: 'closePurchaseReturn',
		method: 'PUT',
		path: '/purchasereturns/status/closed',
		summary: 'Close a purchase return',
		description:
			'Mark one or more purchase returns as closed. Closing a purchase return cancels the remaining unfulfilled quantities.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-returns/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. <code>Note</code>: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'purchasereturn_ids',
				in: 'query',
				required: true,
				description:
					'Comma-separated list of purchase return IDs to close. Maximum 200 IDs.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/close-purchase-return-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/close-purchase-return-response' },
			},
		],
		scopes: ['ZohoBooks.purchasereturns.UPDATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'reopen_purchase_return',
		group: 'purchaseReturns',
		groupSlug: 'purchase-returns',
		name: 'reopenPurchaseReturn',
		method: 'PUT',
		path: '/purchasereturns/status/reopen',
		summary: 'Reopen a purchase return',
		description: 'Reopen one or more closed purchase returns.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-returns/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. <code>Note</code>: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'purchasereturn_ids',
				in: 'query',
				required: true,
				description:
					'Comma-separated list of purchase return IDs to reopen. Maximum 200 IDs.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/reopen-purchase-return-response',
				},
			},
		],
		scopes: ['ZohoBooks.purchasereturns.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_purchase_return_shipping_address',
		group: 'purchaseReturns',
		groupSlug: 'purchase-returns',
		name: 'updatePurchaseReturnShippingAddress',
		method: 'PUT',
		path: '/purchasereturns/{purchase_return_id}/address/shipping',
		summary: 'Update shipping address',
		description: 'Update the shipping address of a purchase return.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-returns/',
		parameters: [
			{
				name: 'purchase_return_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the purchase return.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. <code>Note</code>: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/update-address-request' },
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
		scopes: ['ZohoBooks.purchasereturns.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_purchase_return_billing_address',
		group: 'purchaseReturns',
		groupSlug: 'purchase-returns',
		name: 'updatePurchaseReturnBillingAddress',
		method: 'PUT',
		path: '/purchasereturns/{purchase_return_id}/address/billing',
		summary: 'Update billing address',
		description: 'Update the billing address of a purchase return.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-returns/',
		parameters: [
			{
				name: 'purchase_return_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the purchase return.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. <code>Note</code>: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/update-address-request' },
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
		scopes: ['ZohoBooks.purchasereturns.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_purchase_return_attachment',
		group: 'purchaseReturns',
		groupSlug: 'purchase-returns',
		name: 'deletePurchaseReturnAttachment',
		method: 'DELETE',
		path: '/purchasereturns/{purchase_return_id}/documents/{document_id}',
		summary: 'Delete an attachment',
		description: 'Delete a file attached to a purchase return.',
		docsUrl: 'https://www.zoho.com/books/api/v3/purchase-returns/',
		parameters: [
			{
				name: 'purchase_return_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the purchase return.',
				schema: { type: 'string' },
			},
			{
				name: 'document_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the document (attachment) to delete.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. <code>Note</code>: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/delete-attachment-response' },
			},
		],
		scopes: ['ZohoBooks.purchasereturns.DELETE'],
		riskLevel: 'destructive',
	},
] as const satisfies readonly ZohoBooksOperationDefinition[];
