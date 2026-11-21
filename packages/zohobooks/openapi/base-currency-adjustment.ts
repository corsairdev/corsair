import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas: Record<string, JsonValue> = {
	account_id: {
		description: 'ID of the Account in Base Currency Adjustment',
		type: 'string',
	},
	account_name: {
		description: 'Name of the Account in Base Currency Adjustment',
		type: 'string',
	},
	accounts: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				account_id: { $ref: '#/components/schemas/account_id' },
				account_name: { $ref: '#/components/schemas/account_name' },
				bcy_balance: { $ref: '#/components/schemas/bcy_balance' },
				fcy_balance: { $ref: '#/components/schemas/fcy_balance' },
				adjusted_balance: { $ref: '#/components/schemas/adjusted_balance' },
				gain_or_loss: { $ref: '#/components/schemas/gain_or_loss' },
				gl_specific_type: { $ref: '#/components/schemas/gl_specific_type' },
			},
		},
	},
	adjusted_balance: {
		description: 'Adjusted Balance',
		type: 'number',
		format: 'double',
	},
	adjustment_date: { description: 'Date of adjustment.', type: 'string' },
	base_currency_adjustment_id: {
		description: 'ID of the Base Currency Adjustment',
		type: 'string',
	},
	bcy_balance: {
		description: 'Balance in Base Currency of the Organisation',
		type: 'number',
		format: 'double',
	},
	'create-a-base-currency-adjustment-request': {
		required: ['currency_id', 'adjustment_date', 'exchange_rate', 'notes'],
		type: 'object',
		properties: {
			currency_id: { $ref: '#/components/schemas/currency_id' },
			adjustment_date: { $ref: '#/components/schemas/adjustment_date' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			notes: { $ref: '#/components/schemas/notes' },
		},
	},
	'create-a-base-currency-adjustment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			data: { $ref: '#/components/schemas/data' },
		},
	},
	currency_code: {
		description: 'Currency Code involved in the Adjustment',
		type: 'string',
	},
	currency_id: {
		description: 'ID of currency for which we need to post adjustment.',
		type: 'string',
	},
	data: {
		type: 'object',
		properties: {
			base_currency_adjustment_id: {
				$ref: '#/components/schemas/base_currency_adjustment_id',
			},
			adjustment_date: { $ref: '#/components/schemas/adjustment_date' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			accounts: { $ref: '#/components/schemas/accounts' },
			notes: { $ref: '#/components/schemas/notes' },
			currency_code: { $ref: '#/components/schemas/currency_code' },
		},
	},
	'delete-a-base-currency-adjustment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	exchange_rate: {
		description: 'Exchange rate of the currency.',
		type: 'number',
		format: 'double',
	},
	fcy_balance: {
		description: 'Balance in Foreign Currency',
		type: 'number',
		format: 'double',
	},
	gain_or_loss: {
		description: 'Amount in Total Gain/Loss',
		type: 'number',
		format: 'double',
	},
	'get-a-base-currency-adjustment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			data: { $ref: '#/components/schemas/data' },
		},
	},
	gl_specific_type: {
		description: 'GL Specific Type of the Account Involved',
		type: 'integer',
	},
	'list-account-details-for-base-currency-adjustment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			data: {
				type: 'object',
				properties: {
					adjustment_date: { $ref: '#/components/schemas/adjustment_date' },
					exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
					currency_id: { $ref: '#/components/schemas/currency_id' },
					accounts: { $ref: '#/components/schemas/accounts' },
					notes: { $ref: '#/components/schemas/notes' },
					currency_code: { $ref: '#/components/schemas/currency_code' },
				},
			},
		},
	},
	'list-base-currency-adjustment-contacts-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			contacts: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						contact_id: { description: 'ID of the contact.', type: 'string' },
						contact_name: {
							description: 'Name of the contact.',
							type: 'string',
						},
						fcy_balance: { $ref: '#/components/schemas/fcy_balance' },
						bcy_balance: { $ref: '#/components/schemas/bcy_balance' },
						adjusted_balance: { $ref: '#/components/schemas/adjusted_balance' },
						gain_or_loss: { $ref: '#/components/schemas/gain_or_loss' },
					},
				},
			},
		},
	},
	'list-base-currency-adjustment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			base_currency_adjustments: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						base_currency_adjustment_id: {
							$ref: '#/components/schemas/base_currency_adjustment_id',
						},
						adjustment_date: { $ref: '#/components/schemas/adjustment_date' },
						exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
						currency_id: { $ref: '#/components/schemas/currency_id' },
						currency_code: { $ref: '#/components/schemas/currency_code' },
						notes: { $ref: '#/components/schemas/notes' },
						gain_or_loss: { $ref: '#/components/schemas/gain_or_loss' },
					},
				},
			},
		},
	},
	notes: { description: 'Notes for base currency adjustment.', type: 'string' },
	'reevaluate-base-currency-adjustment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			data: { $ref: '#/components/schemas/data' },
		},
	},
};

export const operations: readonly ZohoBooksOperationDefinition[] = [
	{
		id: 'create_base_currency_adjustment',
		group: 'baseCurrencyAdjustment',
		groupSlug: 'base-currency-adjustment',
		name: 'createBaseCurrencyAdjustment',
		method: 'POST',
		path: '/basecurrencyadjustment',
		summary: 'Create a base currency adjustment',
		description:
			'Creates a base currency adjustment for the given information.',
		docsUrl: 'https://www.zoho.com/books/api/v3/base-currency-adjustment/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'account_ids',
				in: 'query',
				required: true,
				description:
					'ID of the accounts for which base currency adjustments need to be posted.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: {
				$ref: '#/components/schemas/create-a-base-currency-adjustment-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/create-a-base-currency-adjustment-response',
				},
			},
		],
		scopes: ['ZohoBooks.accountants.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_base_currency_adjustments',
		group: 'baseCurrencyAdjustment',
		groupSlug: 'base-currency-adjustment',
		name: 'listBaseCurrencyAdjustments',
		method: 'GET',
		path: '/basecurrencyadjustment',
		summary: 'List base currency adjustment',
		description: 'Lists base currency adjustment.',
		docsUrl: 'https://www.zoho.com/books/api/v3/base-currency-adjustment/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'filter_by',
				in: 'query',
				required: false,
				description:
					'Filter base currency adjustment list. Allowed Values: <code>Date.All</code>, <code>Date.Today</code>, <code>Date.ThisWeek</code>, <code>Date.ThisMonth</code>, <code>Date.ThisQuarter</code> and <code>Date.ThisYear</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description:
					'Sort base currency adjustment list. Allowed Values: <code>adjustment_date</code>, <code>exchange_rate</code>, <code>currency_code</code>, <code>debit_or_credit</code> and <code>gain_or_loss</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'last_modified_time',
				in: 'query',
				required: false,
				description:
					'Search using the Last Modified Time of the Base Currency Adjustment',
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
					$ref: '#/components/schemas/list-base-currency-adjustment-response',
				},
			},
		],
		scopes: ['ZohoBooks.accountants.READ'],
		riskLevel: 'read',
	},
	{
		id: 'get_base_currency_adjustment',
		group: 'baseCurrencyAdjustment',
		groupSlug: 'base-currency-adjustment',
		name: 'getBaseCurrencyAdjustment',
		method: 'GET',
		path: '/basecurrencyadjustment/{base_currency_adjustment_id}',
		summary: 'Get a base currency adjustment',
		description: 'Get the base currency adjustment details.',
		docsUrl: 'https://www.zoho.com/books/api/v3/base-currency-adjustment/',
		parameters: [
			{
				name: 'base_currency_adjustment_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the base currency adjustment.',
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
					$ref: '#/components/schemas/get-a-base-currency-adjustment-response',
				},
			},
		],
		scopes: ['ZohoBooks.accountants.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_base_currency_adjustment',
		group: 'baseCurrencyAdjustment',
		groupSlug: 'base-currency-adjustment',
		name: 'deleteBaseCurrencyAdjustment',
		method: 'DELETE',
		path: '/basecurrencyadjustment/{base_currency_adjustment_id}',
		summary: 'Delete a base currency adjustment',
		description: 'Deletes the base currency adjustment.',
		docsUrl: 'https://www.zoho.com/books/api/v3/base-currency-adjustment/',
		parameters: [
			{
				name: 'base_currency_adjustment_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the base currency adjustment.',
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
					$ref: '#/components/schemas/delete-a-base-currency-adjustment-response',
				},
			},
		],
		scopes: ['ZohoBooks.accountants.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'bulk_delete_base_currency_adjustments',
		group: 'baseCurrencyAdjustment',
		groupSlug: 'base-currency-adjustment',
		name: 'bulkDeleteBaseCurrencyAdjustments',
		method: 'DELETE',
		path: '/basecurrencyadjustment/bulkdelete',
		summary: 'Bulk delete base currency adjustments',
		description: 'Deletes multiple base currency adjustments.',
		docsUrl: 'https://www.zoho.com/books/api/v3/base-currency-adjustment/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'base_currency_adjustment_ids',
				in: 'query',
				required: true,
				description:
					'Comma separated base currency adjustment IDs which are to be deleted.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/delete-a-base-currency-adjustment-response',
				},
			},
		],
		scopes: ['ZohoBooks.accountants.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'reevaluate_base_currency_adjustment',
		group: 'baseCurrencyAdjustment',
		groupSlug: 'base-currency-adjustment',
		name: 'reevaluateBaseCurrencyAdjustment',
		method: 'POST',
		path: '/basecurrencyadjustment/{base_currency_adjustment_id}/reevaluate',
		summary: 'Reevaluate a base currency adjustment',
		description: 'Reevaluates a base currency adjustment.',
		docsUrl: 'https://www.zoho.com/books/api/v3/base-currency-adjustment/',
		parameters: [
			{
				name: 'base_currency_adjustment_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the base currency adjustment.',
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
					$ref: '#/components/schemas/reevaluate-base-currency-adjustment-response',
				},
			},
		],
		scopes: ['ZohoBooks.accountants.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_base_currency_adjustment_accounts',
		group: 'baseCurrencyAdjustment',
		groupSlug: 'base-currency-adjustment',
		name: 'listBaseCurrencyAdjustmentAccounts',
		method: 'GET',
		path: '/basecurrencyadjustment/accounts',
		summary: 'List account details for base currency adjustment',
		description:
			'List of accounts having transaction with effect to the given exchange rate.',
		docsUrl: 'https://www.zoho.com/books/api/v3/base-currency-adjustment/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'currency_id',
				in: 'query',
				required: true,
				description: 'ID of currency for which we need to post adjustment.',
				schema: { type: 'string' },
			},
			{
				name: 'adjustment_date',
				in: 'query',
				required: true,
				description: 'Date of adjustment.',
				schema: { type: 'string' },
			},
			{
				name: 'exchange_rate',
				in: 'query',
				required: true,
				description: 'Exchange rate of the currency.',
				schema: { type: 'number', format: 'double' },
			},
			{
				name: 'notes',
				in: 'query',
				required: true,
				description: 'Notes for base currency adjustment.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/list-account-details-for-base-currency-adjustment-response',
				},
			},
		],
		scopes: ['ZohoBooks.accountants.READ'],
		riskLevel: 'read',
	},
	{
		id: 'list_base_currency_adjustment_contacts',
		group: 'baseCurrencyAdjustment',
		groupSlug: 'base-currency-adjustment',
		name: 'listBaseCurrencyAdjustmentContacts',
		method: 'GET',
		path: '/basecurrencyadjustment/contacts',
		summary: 'List contact details for base currency adjustment',
		description:
			'List contacts having transactions with effect to the given exchange rate for a specific account.',
		docsUrl: 'https://www.zoho.com/books/api/v3/base-currency-adjustment/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'currency_id',
				in: 'query',
				required: true,
				description: 'ID of currency for which we need to post adjustment.',
				schema: { type: 'string' },
			},
			{
				name: 'account_id',
				in: 'query',
				required: true,
				description: 'ID of the account.',
				schema: { type: 'string' },
			},
			{
				name: 'adjustment_date',
				in: 'query',
				required: true,
				description: 'Date of adjustment.',
				schema: { type: 'string' },
			},
			{
				name: 'exchange_rate',
				in: 'query',
				required: true,
				description: 'Exchange rate of the currency.',
				schema: { type: 'number', format: 'double' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/list-base-currency-adjustment-contacts-response',
				},
			},
		],
		scopes: ['ZohoBooks.accountants.READ'],
		riskLevel: 'read',
	},
];
