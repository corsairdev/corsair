import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas: Record<string, JsonValue> = {
	contact_id: { description: 'Contact ID of the contact', type: 'string' },
	data: {
		type: 'object',
		properties: { contact_id: { $ref: '#/components/schemas/contact_id' } },
	},
	'import-a-customer-using-crm-contact-id-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			data: { $ref: '#/components/schemas/data' },
		},
	},
	'import-a-customer-using-the-crm-account-id-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			data: { $ref: '#/components/schemas/data' },
		},
	},
	'import-a-vendor-using-the-crm-vendor-id-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			data: { $ref: '#/components/schemas/data' },
		},
	},
	'import-an-item-using-the-crm-product-id-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			data: { $ref: '#/components/schemas/product_data' },
		},
	},
	item_id: { description: 'Item ID of the product', type: 'string' },
	product_data: {
		type: 'object',
		properties: { item_id: { $ref: '#/components/schemas/item_id' } },
	},
};

export const operations: readonly ZohoBooksOperationDefinition[] = [
	{
		id: 'import_customer_using_crm_account_id',
		group: 'integration',
		groupSlug: 'integration',
		name: 'importCustomerUsingCrmAccountId',
		method: 'POST',
		path: '/crm/account/{crm_account_id}/import',
		summary: 'Import a customer using the CRM account ID',
		description:
			'Zoho Books must be integrated with Zoho CRM using Accounts and Contacts sync or using Accounts only sync to import a customer from CRM with its CRM account ID. <br> Note: You can get a contact by CRM account ID by using this <a href=/books/api/v3/contacts/#list-contacts/zcrm_account_id>API Endpoint</a>',
		docsUrl: 'https://www.zoho.com/books/api/v3/integration/',
		parameters: [
			{
				name: 'crm_account_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the zoho crm account.',
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
					$ref: '#/components/schemas/import-a-customer-using-the-crm-account-id-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'import_customer_using_crm_contact_id',
		group: 'integration',
		groupSlug: 'integration',
		name: 'importCustomerUsingCrmContactId',
		method: 'POST',
		path: '/crm/contact/{crm_contact_id}/import',
		summary: 'Import a customer using CRM contact ID',
		description:
			'Zoho Books must be integrated with Zoho CRM using <code>Contacts only sync</code> or <code>Accounts & their Contacts and Include contacts that are not associated to any accounts </code> sync type contacts that are not associated to any accounts in Zoho CRM to import a customer from CRM with its CRM contact ID. <br> Note: You can get a contact by CRM contact ID by using this <a href=/books/api/v3/contacts/#list-contacts/zcrm_contact_id>API Endpoint</a>',
		docsUrl: 'https://www.zoho.com/books/api/v3/integration/',
		parameters: [
			{
				name: 'crm_contact_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the zoho crm contact.',
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
					$ref: '#/components/schemas/import-a-customer-using-crm-contact-id-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'import_vendor_using_crm_vendor_id',
		group: 'integration',
		groupSlug: 'integration',
		name: 'importVendorUsingCrmVendorId',
		method: 'POST',
		path: '/crm/vendor/{crm_vendor_id}/import',
		summary: 'Import a vendor using the CRM vendor ID',
		description:
			'Zoho Books must be integrated with Zoho CRM using Vendor only sync to import a vendor from CRM with its CRM vendor ID.',
		docsUrl: 'https://www.zoho.com/books/api/v3/integration/',
		parameters: [
			{
				name: 'crm_vendor_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the zoho crm vendor.',
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
					$ref: '#/components/schemas/import-a-vendor-using-the-crm-vendor-id-response',
				},
			},
		],
		scopes: ['ZohoBooks.contacts.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'import_item_using_crm_product_id',
		group: 'integration',
		groupSlug: 'integration',
		name: 'importItemUsingCrmProductId',
		method: 'POST',
		path: '/crm/item/{crm_product_id}/import',
		summary: 'Import an item using the CRM product ID',
		description:
			'Zoho Books must be integrated with Zoho CRM using Products only sync to import an item from CRM with its CRM product ID.',
		docsUrl: 'https://www.zoho.com/books/api/v3/integration/',
		parameters: [
			{
				name: 'crm_product_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the zoho crm product.',
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
					$ref: '#/components/schemas/import-an-item-using-the-crm-product-id-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'write',
	},
];
