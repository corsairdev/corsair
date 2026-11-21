import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas: Record<string, JsonValue> = {
	'action-delivery-challan-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'address-detail': {
		type: 'object',
		properties: {
			address: { description: 'Address line.', type: 'string' },
			street2: { description: 'Second address line.', type: 'string' },
			city: { description: 'City.', type: 'string' },
			state: { description: 'State.', type: 'string' },
			zip: { description: 'Postal or ZIP code.', type: 'string' },
			country: { description: 'Country.', type: 'string' },
			fax: { description: 'Fax number.', type: 'string' },
			phone: { description: 'Phone number.', type: 'string' },
			attention: { description: 'Attention.', type: 'string' },
		},
	},
	'create-delivery-challan-request': {
		required: ['customer_id'],
		type: 'object',
		properties: {
			customer_id: {
				description: 'Unique identifier of the customer.',
				type: 'string',
			},
			currency_id: {
				description: 'Unique identifier of the currency.',
				type: 'string',
			},
			deliverychallan_number: {
				description: 'Delivery challan number. Max-length [50]',
				type: 'string',
				maxLength: 50,
			},
			reference_number: {
				description: 'Reference number. Max-length [50]',
				type: 'string',
				maxLength: 50,
			},
			template_id: {
				description: 'Unique identifier of the template.',
				type: 'string',
			},
			date: {
				description: 'Date of the delivery challan in YYYY-MM-DD format.',
				type: 'string',
			},
			challan_type: {
				description: 'Type of delivery challan. Max-length [200]',
				type: 'string',
				maxLength: 200,
			},
			discount: {
				description: 'Discount applied at the entity level.',
				type: 'string',
			},
			is_discount_before_tax: {
				description: 'Whether discount is applied before tax.',
				type: 'boolean',
			},
			discount_type: { description: 'Type of discount.', type: 'string' },
			place_of_supply: {
				description:
					'Place of supply state code (applicable for India edition). Max-length [5]',
				type: 'string',
				maxLength: 5,
			},
			exchange_rate: {
				description: 'Exchange rate for the currency.',
				type: 'number',
			},
			is_inclusive_tax: {
				description: 'Whether prices are inclusive of tax.',
				type: 'boolean',
			},
			gst_treatment: {
				description: 'GST treatment (applicable for India edition).',
				type: 'string',
			},
			tax_treatment: { description: 'Tax treatment.', type: 'string' },
			gst_no: {
				description:
					'GST number (applicable for India edition). Max-length [15]',
				type: 'string',
			},
			shipping_gst_no: {
				description:
					'GSTIN of the shipping party, when it differs from the billed customer. Used for e-Way Bill and e-Invoice compliance. Max-length [15].',
				type: 'string',
			},
			shipping_trader_name: {
				description:
					'Trade name of the shipping party, when it differs from the billed customer. Used for e-Way Bill and e-Invoice compliance. Max-length [100].',
				type: 'string',
			},
			shipping_legal_name: {
				description:
					'Legal name of the shipping party, when it differs from the billed customer. Used for e-Invoice compliance. Max-length [100].',
				type: 'string',
				maxLength: 15,
			},
			line_items: {
				description: 'Line items of the delivery challan.',
				type: 'array',
				items: { $ref: '#/components/schemas/line-item-request' },
			},
			notes: {
				description: 'Customer notes. Max-length [5000]',
				type: 'string',
				maxLength: 5000,
			},
			terms: {
				description: 'Terms and conditions. Max-length [10000]',
				type: 'string',
				maxLength: 10000,
			},
			adjustment: { description: 'Adjustment amount.', type: 'number' },
			adjustment_description: {
				description: 'Adjustment description. Max-length [200]',
				type: 'string',
				maxLength: 200,
			},
			tax_id: { description: 'Unique identifier of the tax.', type: 'string' },
			tax_authority_id: {
				description: 'Unique identifier of the tax authority.',
				type: 'string',
			},
			tax_exemption_id: {
				description: 'Unique identifier of the tax exemption.',
				type: 'string',
			},
			shipping_address_id: {
				description: 'Unique identifier of the shipping address.',
				type: 'string',
			},
			shipping_address: {
				description:
					'Address of the party the goods are shipped to. Use this field to provide a one-time shipping address that is not saved under the customer. When using this field, do not provide <code>shipping_address_id</code> in the same request.',
				$ref: '#/components/schemas/address-detail',
			},
			pricebook_id: {
				description: 'Unique identifier of the price book.',
				type: 'string',
			},
			branch_id: {
				description: 'Unique identifier of the branch.',
				type: 'string',
			},
			location_id: {
				description: 'Unique identifier of the location.',
				type: 'string',
			},
		},
	},
	'create-delivery-challan-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			deliverychallan: {
				$ref: '#/components/schemas/delivery-challan-response',
			},
		},
	},
	'delete-delivery-challan-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delivery-challan-response': {
		type: 'object',
		properties: {
			deliverychallan_id: {
				description: 'Unique identifier of the delivery challan.',
				type: 'string',
			},
			deliverychallan_number: {
				description: 'Delivery challan number.',
				type: 'string',
			},
			date: {
				description: 'Date of the delivery challan in YYYY-MM-DD format.',
				type: 'string',
			},
			challan_type: {
				description: 'Type of delivery challan.',
				type: 'string',
			},
			reference_number: { description: 'Reference number.', type: 'string' },
			status: {
				description: 'Status of the delivery challan.',
				type: 'string',
			},
			customer_id: {
				description: 'Unique identifier of the customer.',
				type: 'string',
			},
			customer_name: { description: 'Name of the customer.', type: 'string' },
			currency_id: {
				description: 'Unique identifier of the currency.',
				type: 'string',
			},
			currency_code: { description: 'Currency code.', type: 'string' },
			currency_symbol: { description: 'Currency symbol.', type: 'string' },
			exchange_rate: {
				description: 'Exchange rate for the currency.',
				type: 'number',
			},
			is_discount_before_tax: {
				description: 'Whether discount is applied before tax.',
				type: 'boolean',
			},
			discount_type: { description: 'Type of discount.', type: 'string' },
			is_inclusive_tax: {
				description: 'Whether prices are inclusive of tax.',
				type: 'boolean',
			},
			discount: { description: 'Discount applied.', type: 'number' },
			place_of_supply: {
				description: 'Place of supply (applicable for India edition).',
				type: 'string',
			},
			gst_no: {
				description: 'GST number (applicable for India edition).',
				type: 'string',
			},
			shipping_gst_no: {
				description:
					'GSTIN of the shipping party, when it differs from the billed customer. Used for e-Way Bill and e-Invoice compliance. Max-length [15].',
				type: 'string',
			},
			shipping_trader_name: {
				description:
					'Trade name of the shipping party, when it differs from the billed customer. Used for e-Way Bill and e-Invoice compliance. Max-length [100].',
				type: 'string',
			},
			shipping_legal_name: {
				description:
					'Legal name of the shipping party, when it differs from the billed customer. Used for e-Invoice compliance. Max-length [100].',
				type: 'string',
			},
			gst_treatment: {
				description: 'GST treatment (applicable for India edition).',
				type: 'string',
			},
			tax_treatment: { description: 'Tax treatment.', type: 'string' },
			line_items: {
				type: 'array',
				items: { $ref: '#/components/schemas/line-item-response' },
			},
			sub_total: {
				description: 'Sub total of the delivery challan.',
				type: 'number',
			},
			tax_total: { description: 'Total tax amount.', type: 'number' },
			total: {
				description: 'Total amount of the delivery challan.',
				type: 'number',
			},
			adjustment: { description: 'Adjustment amount.', type: 'number' },
			adjustment_description: {
				description: 'Description for the adjustment.',
				type: 'string',
			},
			shipping_address: { $ref: '#/components/schemas/address-detail' },
			notes: {
				description: 'Customer notes for the delivery challan.',
				type: 'string',
			},
			terms: { description: 'Terms and conditions.', type: 'string' },
			template_id: {
				description: 'Unique identifier of the template.',
				type: 'string',
			},
			template_name: { description: 'Name of the template.', type: 'string' },
			custom_fields: {
				description: 'Custom fields associated with the delivery challan.',
				type: 'string',
			},
			has_qty_returned: {
				description: 'Indicates whether any quantity has been returned.',
				type: 'boolean',
			},
			branch_id: {
				description: 'Unique identifier of the branch.',
				type: 'string',
			},
			branch_name: { description: 'Name of the branch.', type: 'string' },
			location_id: {
				description: 'Unique identifier of the location.',
				type: 'string',
			},
			location_name: { description: 'Name of the location.', type: 'string' },
			created_time: {
				description: 'Time at which the delivery challan was created.',
				type: 'string',
			},
			last_modified_time: {
				description: 'Time at which the delivery challan was last modified.',
				type: 'string',
			},
			created_by_id: {
				description:
					'Unique identifier of the user who created the delivery challan.',
				type: 'string',
			},
		},
	},
	'get-delivery-challan-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			deliverychallan: {
				$ref: '#/components/schemas/delivery-challan-response',
			},
		},
	},
	'line-item-request': {
		type: 'object',
		properties: {
			item_id: {
				description: 'Unique identifier of the item.',
				type: 'string',
			},
			line_item_id: {
				description: 'Unique identifier of the line item (for updates).',
				type: 'string',
			},
			name: {
				description: 'Name of the item. Max-length [200]',
				type: 'string',
				maxLength: 200,
			},
			sku: {
				description: 'SKU of the item. Max-length [200]',
				type: 'string',
				maxLength: 200,
			},
			description: {
				description: 'Description of the line item. Max-length [6000]',
				type: 'string',
				maxLength: 6000,
			},
			item_order: {
				description: 'Display order of the item.',
				type: 'integer',
			},
			rate: { description: 'Rate of the item.', type: 'number' },
			quantity: { description: 'Quantity.', type: 'number' },
			unit: {
				description: 'Unit of measurement. Max-length [120]',
				type: 'string',
				maxLength: 120,
			},
			discount: { description: 'Discount for this line item.', type: 'string' },
			tax_id: { description: 'Unique identifier of the tax.', type: 'string' },
			tax_exemption_id: {
				description: 'Unique identifier of the tax exemption.',
				type: 'string',
			},
			tax_exemption_code: {
				description: 'Tax exemption code. Max-length [50]',
				type: 'string',
				maxLength: 50,
			},
			hsn_or_sac: {
				description: 'HSN or SAC code (applicable for India edition).',
				type: 'string',
			},
			pricebook_id: {
				description: 'Unique identifier of the price book.',
				type: 'string',
			},
			warehouse_id: {
				description: 'Unique identifier of the warehouse.',
				type: 'string',
			},
			location_id: {
				description: 'Unique identifier of the location.',
				type: 'string',
			},
		},
	},
	'line-item-response': {
		type: 'object',
		properties: {
			line_item_id: {
				description: 'Unique identifier of the line item.',
				type: 'string',
			},
			item_id: {
				description: 'Unique identifier of the item.',
				type: 'string',
			},
			name: { description: 'Name of the item.', type: 'string' },
			sku: { description: 'SKU of the item.', type: 'string' },
			description: {
				description: 'Description of the line item.',
				type: 'string',
			},
			item_order: {
				description: 'Display order of the line item.',
				type: 'integer',
			},
			rate: { description: 'Rate of the item.', type: 'number' },
			bcy_rate: { description: 'Rate in base currency.', type: 'number' },
			quantity: { description: 'Quantity.', type: 'number' },
			unit: { description: 'Unit of measurement.', type: 'string' },
			discount: { description: 'Discount applied.', type: 'number' },
			tax_id: { description: 'Unique identifier of the tax.', type: 'string' },
			tax_name: { description: 'Name of the tax.', type: 'string' },
			tax_type: { description: 'Type of the tax.', type: 'string' },
			tax_percentage: { description: 'Tax percentage.', type: 'number' },
			item_total: { description: 'Total for this line item.', type: 'number' },
			hsn_or_sac: {
				description: 'HSN or SAC code (applicable for India edition).',
				type: 'string',
			},
			tax_exemption_id: {
				description: 'Unique identifier of the tax exemption.',
				type: 'string',
			},
			tax_exemption_code: {
				description: 'Tax exemption code.',
				type: 'string',
			},
			warehouse_id: {
				description: 'Unique identifier of the warehouse.',
				type: 'string',
			},
			warehouse_name: { description: 'Name of the warehouse.', type: 'string' },
			quantity_invoiced: {
				description: 'Quantity invoiced for this line item.',
				type: 'number',
			},
			quantity_returned: {
				description: 'Quantity returned for this line item.',
				type: 'number',
			},
			line_item_taxes: {
				type: 'array',
				items: { $ref: '#/components/schemas/line-item-tax' },
			},
		},
	},
	'line-item-tax': {
		type: 'object',
		properties: {
			tax_id: { description: 'Unique identifier of the tax.', type: 'string' },
			tax_name: { description: 'Name of the tax.', type: 'string' },
			tax_amount: { description: 'Tax amount.', type: 'number' },
		},
	},
	'list-delivery-challans-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			deliverychallans: {
				description: 'List of delivery challans.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						deliverychallan_id: {
							description: 'Unique identifier of the delivery challan.',
							type: 'string',
						},
						customer_name: {
							description: 'Name of the customer.',
							type: 'string',
						},
						customer_id: {
							description: 'Unique identifier of the customer.',
							type: 'string',
						},
						status: {
							description: 'Status of the delivery challan.',
							type: 'string',
						},
						deliverychallan_number: {
							description: 'Delivery challan number.',
							type: 'string',
						},
						reference_number: {
							description: 'Reference number.',
							type: 'string',
						},
						date: {
							description: 'Date of the delivery challan.',
							type: 'string',
						},
						currency_id: {
							description: 'Unique identifier of the currency.',
							type: 'string',
						},
						currency_code: { description: 'Currency code.', type: 'string' },
						total: { description: 'Total amount.', type: 'number' },
						bcy_total: {
							description: 'Total amount in base currency.',
							type: 'number',
						},
						created_time: {
							description: 'Time at which the delivery challan was created.',
							type: 'string',
						},
						last_modified_time: {
							description:
								'Time at which the delivery challan was last modified.',
							type: 'string',
						},
						has_attachment: {
							description: 'Whether the delivery challan has attachments.',
							type: 'boolean',
						},
					},
				},
			},
			page_context: { $ref: '#/components/schemas/page_context' },
		},
	},
	'list-templates-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			templates: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						template_id: {
							description: 'Unique identifier of the template.',
							type: 'string',
						},
						template_name: {
							description: 'Name of the template.',
							type: 'string',
						},
						template_type: {
							description: 'Type of the template.',
							type: 'string',
						},
					},
				},
			},
		},
	},
	page_context: {
		description: 'The context of a particular page.',
		type: 'object',
		properties: {
			page: { description: 'Current page number.', type: 'integer' },
			per_page: { description: 'Number of records per page.', type: 'integer' },
			has_more_page: {
				description: 'Whether more pages exist.',
				type: 'boolean',
			},
			report_name: { description: 'Report name.', type: 'string' },
			applied_filter: { description: 'Applied filter.', type: 'string' },
			sort_column: { description: 'Column used for sorting.', type: 'string' },
			sort_order: {
				description: 'Sort order (A for ascending, D for descending).',
				type: 'string',
			},
		},
	},
	'return-delivery-challan-request': {
		type: 'object',
		properties: {
			line_items: {
				description: 'Line items with return quantities.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						line_item_id: {
							description: 'Unique identifier of the line item.',
							type: 'string',
						},
						qty_returned: {
							description: 'Quantity to return.',
							type: 'number',
						},
					},
				},
			},
		},
	},
	'update-delivery-challan-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			deliverychallan: {
				$ref: '#/components/schemas/delivery-challan-response',
			},
		},
	},
	'update-shipping-address-request': {
		type: 'object',
		properties: {
			address: { description: 'Address line.', type: 'string' },
			street2: { description: 'Second address line.', type: 'string' },
			city: { description: 'City.', type: 'string' },
			state: { description: 'State.', type: 'string' },
			zip: { description: 'Postal or ZIP code.', type: 'string' },
			country: { description: 'Country.', type: 'string' },
			fax: { description: 'Fax number.', type: 'string' },
			phone: { description: 'Phone number.', type: 'string' },
			attention: { description: 'Attention.', type: 'string' },
		},
	},
};

export const operations: readonly ZohoBooksOperationDefinition[] = [
	{
		id: 'list_delivery_challans',
		group: 'deliveryChallans',
		groupSlug: 'delivery-challans',
		name: 'listDeliveryChallans',
		method: 'GET',
		path: '/deliverychallans',
		summary: 'List delivery challans',
		description:
			'Retrieve a list of delivery challans with pagination. Filter by status, customer, date, and more.',
		docsUrl: 'https://www.zoho.com/books/api/v3/delivery-challans/',
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
					'Specify the column to sort Delivery challans by. Allowed values <code>customer_name</code>, <code>deliverychallan_number</code>, <code>total</code>, <code>date</code>, <code>created_time</code>, <code>last_modified_time</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'sort_order',
				in: 'query',
				required: false,
				description:
					'Sort order (A for Ascending, D for Descending). Allowed values <code>A</code> (ascending), <code>D</code> (descending).',
				schema: { type: 'string' },
			},
			{
				name: 'filter_by',
				in: 'query',
				required: false,
				description:
					'Filter delivery challans by status. Allowed values <code>Status.All</code>, <code>Status.Draft</code>, <code>Status.Open</code>, <code>Status.Returned</code>, <code>Status.Delivered</code>, <code>Status.Invoiced</code>, <code>Status.PartiallyInvoiced</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'search_text',
				in: 'query',
				required: false,
				description:
					'Search delivery challans by challan number or customer name.',
				schema: { type: 'string' },
			},
			{
				name: 'customer_id',
				in: 'query',
				required: false,
				description:
					'Filter by ID of the Customer for whom the delivery challan is created.',
				schema: { type: 'string' },
			},
			{
				name: 'status',
				in: 'query',
				required: false,
				description:
					'Search Delivery challans by delivery challan status. Allowed values <code>draft</code>, <code>open</code>, <code>void</code>, <code>fulfilled</code>, <code>invoiced</code>, <code>partially_invoiced</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'page',
				in: 'query',
				required: false,
				description: 'Page number to be fetched.',
				schema: { type: 'integer' },
			},
			{
				name: 'per_page',
				in: 'query',
				required: false,
				description: 'Number of records to be fetched per page.',
				schema: { type: 'integer' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/list-delivery-challans-response',
				},
			},
		],
		scopes: ['ZohoBooks.deliverychallans.READ'],
		riskLevel: 'read',
	},
	{
		id: 'create_delivery_challan',
		group: 'deliveryChallans',
		groupSlug: 'delivery-challans',
		name: 'createDeliveryChallan',
		method: 'POST',
		path: '/deliverychallans',
		summary: 'Create a delivery challan',
		description:
			'Create a new delivery challan for a customer. The customer ID is required.',
		docsUrl: 'https://www.zoho.com/books/api/v3/delivery-challans/',
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
					'Ignore auto number generation for this delivery challan. Allowed values <code>true</code> and <code>false</code>.',
				schema: { type: 'boolean' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/create-delivery-challan-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/create-delivery-challan-response',
				},
			},
		],
		scopes: ['ZohoBooks.deliverychallans.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_delivery_challan',
		group: 'deliveryChallans',
		groupSlug: 'delivery-challans',
		name: 'getDeliveryChallan',
		method: 'GET',
		path: '/deliverychallans/{deliverychallan_id}',
		summary: 'Retrieve a delivery challan',
		description: 'Retrieve the details of an existing delivery challan.',
		docsUrl: 'https://www.zoho.com/books/api/v3/delivery-challans/',
		parameters: [
			{
				name: 'deliverychallan_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the delivery challan. Note: This value is a set of numeric characters.',
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
				description:
					'Print the delivery challan in PDF format. Allowed values <code>true</code> and <code>false</code>.',
				schema: { type: 'boolean' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/get-delivery-challan-response' },
			},
		],
		scopes: ['ZohoBooks.deliverychallans.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_delivery_challan',
		group: 'deliveryChallans',
		groupSlug: 'delivery-challans',
		name: 'updateDeliveryChallan',
		method: 'PUT',
		path: '/deliverychallans/{deliverychallan_id}',
		summary: 'Update a delivery challan',
		description: 'Update an existing delivery challan.',
		docsUrl: 'https://www.zoho.com/books/api/v3/delivery-challans/',
		parameters: [
			{
				name: 'deliverychallan_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the delivery challan. Note: This value is a set of numeric characters.',
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
			schema: { $ref: '#/components/schemas/create-delivery-challan-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-delivery-challan-response',
				},
			},
		],
		scopes: ['ZohoBooks.deliverychallans.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_delivery_challan',
		group: 'deliveryChallans',
		groupSlug: 'delivery-challans',
		name: 'deleteDeliveryChallan',
		method: 'DELETE',
		path: '/deliverychallans/{deliverychallan_id}',
		summary: 'Delete a delivery challan',
		description: 'Delete an existing delivery challan.',
		docsUrl: 'https://www.zoho.com/books/api/v3/delivery-challans/',
		parameters: [
			{
				name: 'deliverychallan_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the delivery challan. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/delete-delivery-challan-response',
				},
			},
		],
		scopes: ['ZohoBooks.deliverychallans.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'mark_delivery_challan_as_open',
		group: 'deliveryChallans',
		groupSlug: 'delivery-challans',
		name: 'markDeliveryChallanAsOpen',
		method: 'POST',
		path: '/deliverychallans/{deliverychallan_id}/status/open',
		summary: 'Mark a delivery challan as open',
		description: 'Change the status of a delivery challan to open.',
		docsUrl: 'https://www.zoho.com/books/api/v3/delivery-challans/',
		parameters: [
			{
				name: 'deliverychallan_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the delivery challan. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/action-delivery-challan-response',
				},
			},
		],
		scopes: ['ZohoBooks.deliverychallans.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_delivery_challan_as_delivered',
		group: 'deliveryChallans',
		groupSlug: 'delivery-challans',
		name: 'markDeliveryChallanAsDelivered',
		method: 'POST',
		path: '/deliverychallans/{deliverychallan_id}/status/delivered',
		summary: 'Mark a delivery challan as delivered',
		description: 'Change the status of a delivery challan to delivered.',
		docsUrl: 'https://www.zoho.com/books/api/v3/delivery-challans/',
		parameters: [
			{
				name: 'deliverychallan_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the delivery challan. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/action-delivery-challan-response',
				},
			},
		],
		scopes: ['ZohoBooks.deliverychallans.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_delivery_challan_as_returned',
		group: 'deliveryChallans',
		groupSlug: 'delivery-challans',
		name: 'markDeliveryChallanAsReturned',
		method: 'POST',
		path: '/deliverychallans/{deliverychallan_id}/status/returned',
		summary: 'Mark a delivery challan as returned',
		description: 'Change the status of a delivery challan to returned.',
		docsUrl: 'https://www.zoho.com/books/api/v3/delivery-challans/',
		parameters: [
			{
				name: 'deliverychallan_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the delivery challan. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/action-delivery-challan-response',
				},
			},
		],
		scopes: ['ZohoBooks.deliverychallans.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_delivery_challan_as_undelivered',
		group: 'deliveryChallans',
		groupSlug: 'delivery-challans',
		name: 'markDeliveryChallanAsUndelivered',
		method: 'POST',
		path: '/deliverychallans/{deliverychallan_id}/status/undelivered',
		summary: 'Mark a delivery challan as undelivered',
		description: 'Change the status of a delivery challan to undelivered.',
		docsUrl: 'https://www.zoho.com/books/api/v3/delivery-challans/',
		parameters: [
			{
				name: 'deliverychallan_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the delivery challan. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/action-delivery-challan-response',
				},
			},
		],
		scopes: ['ZohoBooks.deliverychallans.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'return_delivery_challans',
		group: 'deliveryChallans',
		groupSlug: 'delivery-challans',
		name: 'returnDeliveryChallans',
		method: 'PUT',
		path: '/deliverychallans/return',
		summary: 'Return delivery challans',
		description:
			'Partially return one or more delivery challans by specifying the line items and quantities to return.',
		docsUrl: 'https://www.zoho.com/books/api/v3/delivery-challans/',
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
				name: 'deliverychallan_ids',
				in: 'query',
				required: true,
				description:
					'Comma-separated IDs of delivery challans to mark as returned.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/return-delivery-challan-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/action-delivery-challan-response',
				},
			},
		],
		scopes: ['ZohoBooks.deliverychallans.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'undo_return_delivery_challans',
		group: 'deliveryChallans',
		groupSlug: 'delivery-challans',
		name: 'undoReturnDeliveryChallans',
		method: 'PUT',
		path: '/deliverychallans/undo/return',
		summary: 'Undo return of delivery challans',
		description:
			'Undo a previously applied return for one or more delivery challans.',
		docsUrl: 'https://www.zoho.com/books/api/v3/delivery-challans/',
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
				name: 'deliverychallan_ids',
				in: 'query',
				required: true,
				description: 'Comma-separated IDs of delivery challans to undo return.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/action-delivery-challan-response',
				},
			},
		],
		scopes: ['ZohoBooks.deliverychallans.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'add_attachment_to_delivery_challan',
		group: 'deliveryChallans',
		groupSlug: 'delivery-challans',
		name: 'addAttachmentToDeliveryChallan',
		method: 'POST',
		path: '/deliverychallans/{deliverychallan_id}/attachment',
		summary: 'Add attachment to a delivery challan',
		description:
			"Attach files to an existing delivery challan (maximum of 20 files).'",
		docsUrl: 'https://www.zoho.com/books/api/v3/delivery-challans/',
		parameters: [
			{
				name: 'deliverychallan_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the delivery challan. Note: This value is a set of numeric characters.',
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
			mediaType: 'multipart/form-data',
			required: false,
			schema: {
				type: 'object',
				properties: {
					attachment: {
						type: 'string',
						format: 'binary',
						description: 'File to attach. Max size 10 MB.',
					},
				},
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/action-delivery-challan-response',
				},
			},
		],
		scopes: ['ZohoBooks.deliverychallans.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_delivery_challan_attachment',
		group: 'deliveryChallans',
		groupSlug: 'delivery-challans',
		name: 'getDeliveryChallanAttachment',
		method: 'GET',
		path: '/deliverychallans/{deliverychallan_id}/documents/{document_id}',
		summary: 'Get a delivery challan attachment',
		description: 'Retrieve an attachment.',
		docsUrl: 'https://www.zoho.com/books/api/v3/delivery-challans/',
		parameters: [
			{
				name: 'deliverychallan_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the delivery challan. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'document_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the document.',
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
		responses: [{ status: '200', contentType: '*/*' }],
		scopes: ['ZohoBooks.deliverychallans.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_delivery_challan_attachment',
		group: 'deliveryChallans',
		groupSlug: 'delivery-challans',
		name: 'deleteDeliveryChallanAttachment',
		method: 'DELETE',
		path: '/deliverychallans/{deliverychallan_id}/documents/{document_id}',
		summary: 'Delete a delivery challan attachment',
		description: 'Delete an attachment.',
		docsUrl: 'https://www.zoho.com/books/api/v3/delivery-challans/',
		parameters: [
			{
				name: 'deliverychallan_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the delivery challan. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'document_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the document.',
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
					$ref: '#/components/schemas/action-delivery-challan-response',
				},
			},
		],
		scopes: ['ZohoBooks.deliverychallans.UPDATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'list_delivery_challan_templates',
		group: 'deliveryChallans',
		groupSlug: 'delivery-challans',
		name: 'listDeliveryChallanTemplates',
		method: 'GET',
		path: '/deliverychallans/templates',
		summary: 'List delivery challan templates',
		description:
			'Retrieve a list of available templates for delivery challans.',
		docsUrl: 'https://www.zoho.com/books/api/v3/delivery-challans/',
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
				schema: { $ref: '#/components/schemas/list-templates-response' },
			},
		],
		scopes: ['ZohoBooks.deliverychallans.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_delivery_challan_template',
		group: 'deliveryChallans',
		groupSlug: 'delivery-challans',
		name: 'updateDeliveryChallanTemplate',
		method: 'PUT',
		path: '/deliverychallans/{deliverychallan_id}/templates/{template_id}',
		summary: 'Update a delivery challan template',
		description: 'Assign a different template to an existing delivery challan.',
		docsUrl: 'https://www.zoho.com/books/api/v3/delivery-challans/',
		parameters: [
			{
				name: 'deliverychallan_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the delivery challan. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'template_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the template.',
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
					$ref: '#/components/schemas/action-delivery-challan-response',
				},
			},
		],
		scopes: ['ZohoBooks.deliverychallans.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_delivery_challan_shipping_address',
		group: 'deliveryChallans',
		groupSlug: 'delivery-challans',
		name: 'updateDeliveryChallanShippingAddress',
		method: 'PUT',
		path: '/deliverychallans/{deliverychallan_id}/address/shipping',
		summary: 'Update shipping address',
		description: 'Update the shipping address of an existing delivery challan.',
		docsUrl: 'https://www.zoho.com/books/api/v3/delivery-challans/',
		parameters: [
			{
				name: 'deliverychallan_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the delivery challan. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/action-delivery-challan-response',
				},
			},
		],
		scopes: ['ZohoBooks.deliverychallans.UPDATE'],
		riskLevel: 'write',
	},
];
