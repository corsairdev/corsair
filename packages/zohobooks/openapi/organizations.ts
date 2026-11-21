import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas: Record<string, JsonValue> = {
	account_created_date: {
		description: 'Date of creation of the account',
		type: 'string',
	},
	account_created_date_formatted: {
		type: 'string',
		description: 'Formatted date of creation of the account.',
	},
	address: {
		description: 'Billing address of the organisation',
		type: 'object',
		properties: {
			street_address1: { $ref: '#/components/schemas/street_address1' },
			street_address2: { $ref: '#/components/schemas/street_address2' },
			city: { $ref: '#/components/schemas/city' },
			state: { $ref: '#/components/schemas/state' },
			country: { $ref: '#/components/schemas/country' },
			zip: { $ref: '#/components/schemas/zip' },
		},
	},
	city: { description: 'City of the organisation', type: 'string' },
	company_id_label: {
		description: 'Label denoting company ID',
		type: 'string',
	},
	company_id_value: {
		description: 'Value in the label "company ID"',
		type: 'string',
	},
	companyid_label: { description: 'Label " Company ID "', type: 'string' },
	companyid_value: {
		description: 'value in field "company ID"',
		type: 'string',
	},
	contact_name: {
		description: 'Name of the contact person of the organisation',
		type: 'string',
	},
	'copy-organization-settings-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	country: { description: 'Country of the Organisation', type: 'string' },
	'create-an-organization-request': {
		required: ['name', 'currency_code', 'time_zone', 'portal_name'],
		type: 'object',
		properties: {
			name: { description: 'Name of the project.', type: 'string' },
			fiscal_year_start_month: {
				description:
					'Fiscal or financial starting year of your business. Allowed Values: <code>january</code>, <code>february</code>, <code>march</code>, <code>april</code>,<code> may</code>, <code>june</code>, <code>july</code>, <code>august</code>, <code>september</code>, <code>october</code>, <code>november</code> and <code>december</code>',
				type: 'string',
			},
			currency_code: {
				description: 'Standard code for currency.',
				type: 'string',
			},
			time_zone: {
				description:
					'Time zone in with the organization is located geographically.',
				type: 'string',
			},
			date_format: {
				description: 'Format for representing the date.',
				type: 'string',
			},
			field_separator: {
				description: 'Field separator for components in date.',
				type: 'string',
			},
			language_code: {
				description:
					'language code for organization.For instance <code>en</code> represents english.',
				type: 'string',
			},
			industry_type: { $ref: '#/components/schemas/industry_type' },
			industry_size: { $ref: '#/components/schemas/industry_size' },
			portal_name: { $ref: '#/components/schemas/portal_name' },
			org_address: { $ref: '#/components/schemas/org_address' },
			remit_to_address: { $ref: '#/components/schemas/remit_to_address' },
			address: { $ref: '#/components/schemas/address' },
		},
	},
	'create-an-organization-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			organization: { $ref: '#/components/schemas/organization-response' },
		},
	},
	currency_code: {
		description: "Code of the organisation's base currency",
		type: 'string',
	},
	currency_format: {
		description: "Format of the organisation's currency",
		type: 'string',
	},
	currency_id: {
		description:
			'ID of the organisation curreency. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	currency_symbol: {
		description: 'Symbol used to denote currency of a country',
		type: 'string',
	},
	custom_fields: {
		description: 'Additional fields to describe an organisation',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				index: { $ref: '#/components/schemas/index' },
				value: { $ref: '#/components/schemas/value' },
				label: { $ref: '#/components/schemas/label' },
			},
		},
	},
	date_format: {
		type: 'string',
		description: 'Format for representing the date.',
	},
	'delete-organization-address-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'downgrade-organization-to-invoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	email: {
		description: 'email ID of the contact person of the organisation',
		type: 'string',
	},
	fax: { description: 'FAX number of the organisation', type: 'string' },
	field_separator: {
		description: 'Separator used to classify fields',
		type: 'string',
	},
	fiscal_year_start_month: {
		description: 'Starting month of the financial year',
		type: 'number',
		format: 'double',
	},
	'get-an-organization-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			organization: {
				description: 'List of Organisation - details',
				type: 'object',
				properties: {
					organization_id: { $ref: '#/components/schemas/organization_id' },
					name: { $ref: '#/components/schemas/name' },
					is_default_org: { $ref: '#/components/schemas/is_default_org' },
					account_created_date: {
						$ref: '#/components/schemas/account_created_date',
					},
					time_zone: { $ref: '#/components/schemas/time_zone' },
					language_code: { $ref: '#/components/schemas/language_code' },
					date_format: { $ref: '#/components/schemas/date_format' },
					field_separator: { $ref: '#/components/schemas/field_separator' },
					fiscal_year_start_month: {
						$ref: '#/components/schemas/fiscal_year_start_month',
					},
					contact_name: { $ref: '#/components/schemas/contact_name' },
					industry_type: { $ref: '#/components/schemas/industry_type' },
					industry_size: { $ref: '#/components/schemas/industry_size' },
					company_id_label: { $ref: '#/components/schemas/company_id_label' },
					company_id_value: { $ref: '#/components/schemas/company_id_value' },
					tax_id_label: { $ref: '#/components/schemas/tax_id_label' },
					tax_id_value: { $ref: '#/components/schemas/tax_id_value' },
					currency_id: { $ref: '#/components/schemas/currency_id' },
					currency_code: { $ref: '#/components/schemas/currency_code' },
					currency_symbol: { $ref: '#/components/schemas/currency_symbol' },
					currency_format: { $ref: '#/components/schemas/currency_format' },
					price_precision: { $ref: '#/components/schemas/price_precision' },
					org_address: { $ref: '#/components/schemas/org_address' },
					remit_to_address: { $ref: '#/components/schemas/remit_to_address' },
					phone: { $ref: '#/components/schemas/phone' },
					fax: { $ref: '#/components/schemas/fax' },
					website: { $ref: '#/components/schemas/website' },
					email: { $ref: '#/components/schemas/email' },
					is_org_active: { $ref: '#/components/schemas/is_org_active' },
					address: { $ref: '#/components/schemas/address' },
					custom_fields: { $ref: '#/components/schemas/custom_fields' },
				},
			},
		},
	},
	'get-organization-address-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	index: {
		description: 'Index used to list',
		type: 'number',
		format: 'double',
	},
	industry_size: {
		description:
			'The size of the industry. The possibe values could be "small scale", "medium scale", "large scale"',
		type: 'string',
	},
	industry_type: { description: 'Business type', type: 'string' },
	is_default_org: {
		type: 'boolean',
		description: 'Indicates whether the organization is default or not.',
	},
	is_logo_uploaded: {
		description: 'Boolean to check if logo of the organisation if available',
		type: 'string',
	},
	is_org_active: {
		type: 'boolean',
		description: 'Indicates whether the organization is active or not.',
	},
	label: { description: 'Label of each column', type: 'string' },
	language_code: { description: 'Language for use', type: 'string' },
	'list-organizations-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			organizations: {
				type: 'array',
				description: 'List of organisations.',
				items: {
					type: 'object',
					properties: {
						organization_id: { $ref: '#/components/schemas/organization_id' },
						name: { $ref: '#/components/schemas/name' },
						contact_name: { $ref: '#/components/schemas/contact_name' },
						email: { $ref: '#/components/schemas/email' },
						is_default_org: { $ref: '#/components/schemas/is_default_org' },
						plan_type: { $ref: '#/components/schemas/plan_type' },
						tax_group_enabled: {
							$ref: '#/components/schemas/tax_group_enabled',
						},
						zi_migration_status: {
							$ref: '#/components/schemas/zi_migration_status',
						},
						plan_name: { $ref: '#/components/schemas/plan_name' },
						plan_period: { $ref: '#/components/schemas/plan_period' },
						language_code: { $ref: '#/components/schemas/language_code' },
						fiscal_year_start_month: {
							$ref: '#/components/schemas/fiscal_year_start_month',
						},
						account_created_date: {
							$ref: '#/components/schemas/account_created_date',
						},
						account_created_date_formatted: {
							$ref: '#/components/schemas/account_created_date_formatted',
						},
						time_zone: { $ref: '#/components/schemas/time_zone' },
						is_org_active: { $ref: '#/components/schemas/is_org_active' },
						currency_id: { $ref: '#/components/schemas/currency_id' },
						currency_code: { $ref: '#/components/schemas/currency_code' },
						currency_symbol: { $ref: '#/components/schemas/currency_symbol' },
						currency_format: { $ref: '#/components/schemas/currency_format' },
						price_precision: { $ref: '#/components/schemas/price_precision' },
					},
				},
			},
		},
	},
	'mark-organization-inactive-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	name: { description: 'Name of the Organisation', type: 'string' },
	org_address: {
		description: 'Billing address of the organisation',
		type: 'string',
	},
	'organization-address-request': {
		type: 'object',
		properties: {
			attention: {
				description:
					'Name of the person to whose attention the address is directed.',
				type: 'string',
			},
			address1: {
				description: 'First line of the organization address.',
				type: 'string',
			},
			address2: {
				description: 'Second line of the organization address.',
				type: 'string',
			},
			city: {
				description: 'City of the organization address.',
				type: 'string',
			},
			state: {
				description: 'State of the organization address.',
				type: 'string',
			},
			state_code: {
				description: 'State code of the organization address.',
				type: 'string',
			},
			country: {
				description: 'Country of the organization address.',
				type: 'string',
			},
			zip: {
				description: 'ZIP or postal code of the organization address.',
				type: 'string',
			},
			phone: {
				description: 'Phone number associated with the organization address.',
				type: 'string',
			},
		},
	},
	'organization-address-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			organization_address: {
				type: 'object',
				properties: {
					organization_address_id: {
						description:
							'Unique identifier of the organization address. Note: This value is a set of numeric characters.',
						type: 'string',
					},
					attention: {
						description:
							'Name of the person to whose attention the address is directed.',
						type: 'string',
					},
					address1: {
						description: 'First line of the organization address.',
						type: 'string',
					},
					address2: {
						description: 'Second line of the organization address.',
						type: 'string',
					},
					city: {
						description: 'City of the organization address.',
						type: 'string',
					},
					state: {
						description: 'State of the organization address.',
						type: 'string',
					},
					country: {
						description: 'Country of the organization address.',
						type: 'string',
					},
					zip: {
						description: 'ZIP or postal code of the organization address.',
						type: 'string',
					},
					phone: {
						description:
							'Phone number associated with the organization address.',
						type: 'string',
					},
				},
			},
		},
	},
	'organization-response': {
		description: 'List of Organisation - details',
		type: 'object',
		properties: {
			organization_id: { $ref: '#/components/schemas/organization_id' },
			name: { $ref: '#/components/schemas/name' },
			is_logo_uploaded: { $ref: '#/components/schemas/is_logo_uploaded' },
			is_default_org: { $ref: '#/components/schemas/is_default_org' },
			user_role: { $ref: '#/components/schemas/user_role' },
			account_created_date: {
				$ref: '#/components/schemas/account_created_date',
			},
			time_zone: { $ref: '#/components/schemas/time_zone' },
			language_code: { $ref: '#/components/schemas/language_code' },
			date_format: { $ref: '#/components/schemas/date_format' },
			field_separator: { $ref: '#/components/schemas/field_separator' },
			fiscal_year_start_month: {
				$ref: '#/components/schemas/fiscal_year_start_month',
			},
			tax_group_enabled: { $ref: '#/components/schemas/tax_group_enabled' },
			user_status: { $ref: '#/components/schemas/user_status' },
			contact_name: { $ref: '#/components/schemas/contact_name' },
			industry_type: { $ref: '#/components/schemas/industry_type' },
			address: { $ref: '#/components/schemas/address' },
		},
	},
	organization_id: {
		description:
			'ID of the organisation generated by the server. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	phone: { description: 'Contact number of the organisation', type: 'string' },
	plan_name: { description: 'Name of the subscribed plan', type: 'string' },
	plan_period: {
		description: 'Duration/Cycle of the plan cycle',
		type: 'string',
	},
	plan_type: {
		description: 'Type of the plan subscribed',
		type: 'number',
		format: 'double',
	},
	portal_name: {
		description:
			'Poratal name for the organisation. Length of the portal name should be greater than 4 and less than 31. Allowed chars [a-z][A-Z][0-9]',
		type: 'string',
	},
	price_precision: {
		description: 'Precision of the number of places of decimal in price',
		type: 'number',
		format: 'double',
	},
	remit_to_address: {
		description: 'Shipping address of the organisation',
		type: 'string',
	},
	state: {
		description: 'State where the organisation is located',
		type: 'string',
	},
	street_address1: {
		description: 'Street name of the Billing address of the Organisation',
		type: 'string',
	},
	street_address2: {
		description: 'Continyed billing address of the organisation',
		type: 'string',
	},
	tax_group_enabled: {
		type: 'boolean',
		description: 'Indicates whether tax group is enabled for the organization.',
	},
	tax_id_label: { description: 'Label in "Tax ID" field', type: 'string' },
	tax_id_value: { description: 'Value in the  tax ID field', type: 'string' },
	taxid_label: { description: 'Label "tax ID"', type: 'string' },
	taxid_value: { description: 'Value in "tax ID"', type: 'string' },
	time_zone: {
		description: "Time Zone of the Organisation's country",
		type: 'string',
	},
	'update-an-organization-request': {
		type: 'object',
		properties: {
			name: { description: 'Name of the project.', type: 'string' },
			fiscal_year_start_month: {
				description:
					'Fiscal or financial starting year of your business. Allowed Values: <code>january</code>, <code>february</code>, <code>march</code>, <code>april</code>,<code> may</code>, <code>june</code>, <code>july</code>, <code>august</code>, <code>september</code>, <code>october</code>, <code>november</code> and <code>december</code>',
				type: 'string',
			},
			is_logo_uploaded: {
				description: 'To determine whether logo is uploaded.',
				type: 'boolean',
			},
			time_zone: {
				description:
					'Time zone in with the organization is located geographically.',
				type: 'string',
			},
			date_format: {
				description: 'Format for representing the date.',
				type: 'string',
			},
			field_separator: {
				description: 'Field separator for components in date.',
				type: 'string',
			},
			language_code: {
				description:
					'language code for organization.For instance <code>en</code> represents english.',
				type: 'string',
			},
			org_address: { $ref: '#/components/schemas/org_address' },
			remit_to_address: { $ref: '#/components/schemas/remit_to_address' },
			address: { $ref: '#/components/schemas/address' },
			contact_name: { $ref: '#/components/schemas/contact_name' },
			phone: { $ref: '#/components/schemas/phone' },
			fax: { $ref: '#/components/schemas/fax' },
			website: { $ref: '#/components/schemas/website' },
			email: { $ref: '#/components/schemas/email' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			companyid_label: { $ref: '#/components/schemas/companyid_label' },
			companyid_value: { $ref: '#/components/schemas/companyid_value' },
			taxid_label: { $ref: '#/components/schemas/taxid_label' },
			taxid_value: { $ref: '#/components/schemas/taxid_value' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
		},
	},
	'update-an-organization-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			organization: {
				description: 'List of Organisation - details',
				type: 'object',
				properties: {
					organization_id: { $ref: '#/components/schemas/organization_id' },
					name: { $ref: '#/components/schemas/name' },
					is_default_org: { $ref: '#/components/schemas/is_default_org' },
					account_created_date: {
						$ref: '#/components/schemas/account_created_date',
					},
					time_zone: { $ref: '#/components/schemas/time_zone' },
					language_code: { $ref: '#/components/schemas/language_code' },
					date_format: { $ref: '#/components/schemas/date_format' },
					field_separator: { $ref: '#/components/schemas/field_separator' },
					fiscal_year_start_month: {
						$ref: '#/components/schemas/fiscal_year_start_month',
					},
					contact_name: { $ref: '#/components/schemas/contact_name' },
					industry_type: { $ref: '#/components/schemas/industry_type' },
					industry_size: { $ref: '#/components/schemas/industry_size' },
					company_id_label: { $ref: '#/components/schemas/company_id_label' },
					company_id_value: { $ref: '#/components/schemas/company_id_value' },
					tax_id_label: { $ref: '#/components/schemas/tax_id_label' },
					tax_id_value: { $ref: '#/components/schemas/tax_id_value' },
					currency_id: { $ref: '#/components/schemas/currency_id' },
					currency_code: { $ref: '#/components/schemas/currency_code' },
					currency_symbol: { $ref: '#/components/schemas/currency_symbol' },
					currency_format: { $ref: '#/components/schemas/currency_format' },
					price_precision: { $ref: '#/components/schemas/price_precision' },
					org_address: { $ref: '#/components/schemas/org_address' },
					remit_to_address: { $ref: '#/components/schemas/remit_to_address' },
					phone: { $ref: '#/components/schemas/phone' },
					fax: { $ref: '#/components/schemas/fax' },
					website: { $ref: '#/components/schemas/website' },
					email: { $ref: '#/components/schemas/email' },
					is_org_active: { $ref: '#/components/schemas/is_org_active' },
					address: { $ref: '#/components/schemas/address' },
					custom_fields: { $ref: '#/components/schemas/custom_fields' },
				},
			},
		},
	},
	'upgrade-organization-to-books-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	user_role: {
		description:
			'Role of the user(s). A user can be an admin or a non-admin user, accountant, staff member, special user ( this includes custom users)',
		type: 'string',
	},
	user_status: { description: 'Status of the user', type: 'string' },
	value: { description: 'Value of the list', type: 'string' },
	website: { description: "Organisation's website", type: 'string' },
	zi_migration_status: {
		type: 'number',
		format: 'double',
		description:
			'Indicates the migration status of the organization to Zoho Invoice.',
	},
	zip: {
		description: "ZIP/Postal code of the organisation's location",
		type: 'string',
	},
};

export const operations: readonly ZohoBooksOperationDefinition[] = [
	{
		id: 'create_organization',
		group: 'organizations',
		groupSlug: 'organizations',
		name: 'createOrganization',
		method: 'POST',
		path: '/organizations',
		summary: 'Create an organization',
		description: 'Create an organization.',
		docsUrl: 'https://www.zoho.com/books/api/v3/organizations/',
		parameters: [],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/create-an-organization-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/create-an-organization-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_organizations',
		group: 'organizations',
		groupSlug: 'organizations',
		name: 'listOrganizations',
		method: 'GET',
		path: '/organizations',
		summary: 'List organizations',
		description: 'Get the list of organizations.',
		docsUrl: 'https://www.zoho.com/books/api/v3/organizations/',
		parameters: [],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/list-organizations-response' },
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_organization',
		group: 'organizations',
		groupSlug: 'organizations',
		name: 'updateOrganization',
		method: 'PUT',
		path: '/organizations/{organization_id}',
		summary: 'Update an organization',
		description: 'Update the details of an organization.',
		docsUrl: 'https://www.zoho.com/books/api/v3/organizations/',
		parameters: [
			{
				name: 'organization_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/update-an-organization-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-an-organization-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_organization',
		group: 'organizations',
		groupSlug: 'organizations',
		name: 'getOrganization',
		method: 'GET',
		path: '/organizations/{organization_id}',
		summary: 'Get an organization',
		description: 'Get the details of an organization.',
		docsUrl: 'https://www.zoho.com/books/api/v3/organizations/',
		parameters: [
			{
				name: 'organization_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/get-an-organization-response' },
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'read',
	},
	{
		id: 'list_organizations_for_user',
		group: 'organizations',
		groupSlug: 'organizations',
		name: 'listOrganizationsForUser',
		method: 'GET',
		path: '/organizations/user',
		summary: 'List organizations for a user',
		description:
			'Retrieve the list of organizations accessible to a user. Use the query parameters to filter the organizations returned.',
		docsUrl: 'https://www.zoho.com/books/api/v3/organizations/',
		parameters: [
			{
				name: 'email',
				in: 'query',
				required: false,
				description:
					'Email address of the user whose organizations are listed.',
				schema: { type: 'string' },
			},
			{
				name: 'show_same_currency_orgs_only',
				in: 'query',
				required: false,
				description:
					'Whether to list only organizations that use the same currency.',
				schema: { type: 'boolean' },
			},
			{
				name: 'show_admin_orgs_only',
				in: 'query',
				required: false,
				description:
					'Whether to list only organizations where the user is an admin.',
				schema: { type: 'boolean' },
			},
			{
				name: 'startTrial',
				in: 'query',
				required: false,
				description: 'Whether the request is part of starting a trial.',
				schema: { type: 'boolean' },
			},
			{
				name: 'show_active_orgs_only',
				in: 'query',
				required: false,
				description: 'Whether to list only active organizations.',
				schema: { type: 'boolean' },
			},
			{
				name: 'app_name',
				in: 'query',
				required: false,
				description: 'Name of the app for which the organizations are listed.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/list-organizations-response' },
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'read',
	},
	{
		id: 'get_organization_address',
		group: 'organizations',
		groupSlug: 'organizations',
		name: 'getOrganizationAddress',
		method: 'GET',
		path: '/organizations/address',
		summary: 'Get the organization address',
		description: 'Retrieve the address of the organization.',
		docsUrl: 'https://www.zoho.com/books/api/v3/organizations/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'Organization ID required by the Zoho Books API introduction.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/get-organization-address-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'read',
	},
	{
		id: 'create_organization_address',
		group: 'organizations',
		groupSlug: 'organizations',
		name: 'createOrganizationAddress',
		method: 'POST',
		path: '/organizations/address',
		summary: 'Create the organization address',
		description: 'Add an address for the organization.',
		docsUrl: 'https://www.zoho.com/books/api/v3/organizations/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'Organization ID required by the Zoho Books API introduction.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/organization-address-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/organization-address-response' },
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_organization_address',
		group: 'organizations',
		groupSlug: 'organizations',
		name: 'updateOrganizationAddress',
		method: 'PUT',
		path: '/organizations/address/{address_id}',
		summary: 'Update the organization address',
		description: 'Update an existing address of the organization.',
		docsUrl: 'https://www.zoho.com/books/api/v3/organizations/',
		parameters: [
			{
				name: 'address_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the organization address. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'Organization ID required by the Zoho Books API introduction.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/organization-address-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/organization-address-response' },
			},
		],
		scopes: ['ZohoBooks.settings.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_organization_address',
		group: 'organizations',
		groupSlug: 'organizations',
		name: 'deleteOrganizationAddress',
		method: 'DELETE',
		path: '/organizations/address/{address_id}',
		summary: 'Delete the organization address',
		description: 'Delete an existing address of the organization.',
		docsUrl: 'https://www.zoho.com/books/api/v3/organizations/',
		parameters: [
			{
				name: 'address_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the organization address. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'Organization ID required by the Zoho Books API introduction.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/delete-organization-address-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'copy_organization_settings',
		group: 'organizations',
		groupSlug: 'organizations',
		name: 'copyOrganizationSettings',
		method: 'POST',
		path: '/organizations/{organization_id}/copysettings',
		summary: 'Copy settings to an organization',
		description: 'Copy the specified settings to an organization.',
		docsUrl: 'https://www.zoho.com/books/api/v3/organizations/',
		parameters: [
			{
				name: 'organization_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'settings_to_copy',
				in: 'query',
				required: true,
				description: 'The settings to copy to the organization.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/copy-organization-settings-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'downgrade_organization_to_invoice',
		group: 'organizations',
		groupSlug: 'organizations',
		name: 'downgradeOrganizationToInvoice',
		method: 'POST',
		path: '/organizations/{organization_id}/downgradetoinvoice',
		summary: 'Downgrade an organization to Zoho Invoice',
		description: 'Downgrade an organization from Zoho Books to Zoho Invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/organizations/',
		parameters: [
			{
				name: 'organization_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/downgrade-organization-to-invoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'upgrade_organization_to_books',
		group: 'organizations',
		groupSlug: 'organizations',
		name: 'upgradeOrganizationToBooks',
		method: 'POST',
		path: '/organizations/{organization_id}/upgradetobooks',
		summary: 'Upgrade an organization to Zoho Books',
		description: 'Upgrade an organization from Zoho Invoice to Zoho Books.',
		docsUrl: 'https://www.zoho.com/books/api/v3/organizations/',
		parameters: [
			{
				name: 'organization_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/upgrade-organization-to-books-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_organization_inactive',
		group: 'organizations',
		groupSlug: 'organizations',
		name: 'markOrganizationInactive',
		method: 'POST',
		path: '/organizations/{organization_id}/inactive',
		summary: 'Mark an organization as inactive',
		description: 'Mark an organization as inactive.',
		docsUrl: 'https://www.zoho.com/books/api/v3/organizations/',
		parameters: [
			{
				name: 'organization_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/mark-organization-inactive-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'write',
	},
];
