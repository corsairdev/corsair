import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas: Record<string, JsonValue> = {
	account_id: {
		description: 'ID of account for which you need to record opening balance.',
		type: 'string',
	},
	account_name: { description: 'Name of the account.', type: 'string' },
	account_split_id: {
		description: 'ID of split account that you want to update.',
		type: 'string',
	},
	accounts: {
		description: 'List of accounts with their opening balance details.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				account_split_id: { $ref: '#/components/schemas/account_split_id' },
				account_id: { $ref: '#/components/schemas/account_id' },
				account_name: { $ref: '#/components/schemas/account_name' },
				debit_or_credit: { $ref: '#/components/schemas/debit_or_credit' },
				exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
				currency_id: { $ref: '#/components/schemas/currency_id' },
				currency_code: { $ref: '#/components/schemas/currency_code' },
				bcy_amount: { $ref: '#/components/schemas/bcy_amount' },
				amount: { $ref: '#/components/schemas/amount' },
			},
		},
	},
	amount: {
		description: 'Amount of the opening balance.',
		type: 'number',
		format: 'double',
	},
	bcy_amount: {
		description: 'Amount in Base Currency of the Organisation',
		type: 'number',
		format: 'double',
	},
	'cancel-writeoff-opening-balance-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'create-opening-balance-request': {
		required: ['date'],
		type: 'object',
		properties: {
			date: { $ref: '#/components/schemas/date' },
			location_id: { $ref: '#/components/schemas/location_id' },
			accounts: {
				type: 'array',
				description: 'List of accounts with their opening balance details.',
				items: {
					type: 'object',
					required: ['debit_or_credit'],
					properties: {
						account_id: { $ref: '#/components/schemas/account_id' },
						debit_or_credit: { $ref: '#/components/schemas/debit_or_credit' },
						exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
						currency_id: { $ref: '#/components/schemas/currency_id' },
						amount: { $ref: '#/components/schemas/amount' },
					},
				},
			},
		},
	},
	'create-opening-balance-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			opening_balance: { $ref: '#/components/schemas/opening_balance' },
		},
	},
	currency_code: {
		description: 'Currency code of the account.',
		type: 'string',
	},
	currency_id: { description: 'ID of account currency.', type: 'string' },
	date: {
		description:
			'Date on which the opening balance needs to be recorded. [yyyy-MM-dd]',
		type: 'string',
	},
	debit_or_credit: {
		description:
			'Debit or Credit for which the amount needs to be recorded. Allowed Values: <code>debit</code> and <code>credit</code>.',
		type: 'string',
	},
	'delete-opening-balance-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	exchange_rate: {
		description: 'Exchange rate for the foreign currencies if involved.',
		type: 'number',
		format: 'double',
	},
	'get-opening-balance-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			opening_balance: { $ref: '#/components/schemas/opening_balance' },
		},
	},
	'list-opening-balance-details-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			opening_balance: { $ref: '#/components/schemas/opening_balance' },
		},
	},
	'list-opening-balance-transactions-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			transactions: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						transaction_id: {
							description: 'ID of the transaction.',
							type: 'string',
						},
						transaction_date: {
							description: 'Date of the transaction.',
							type: 'string',
						},
						transaction_type: {
							description: 'Type of the transaction.',
							type: 'string',
						},
						amount: { $ref: '#/components/schemas/amount' },
						debit_or_credit: { $ref: '#/components/schemas/debit_or_credit' },
					},
				},
			},
		},
	},
	location_id: { description: 'Location ID', type: 'string' },
	opening_balance: {
		type: 'object',
		properties: {
			opening_balance_id: { $ref: '#/components/schemas/opening_balance_id' },
			date: { $ref: '#/components/schemas/date' },
			location_id: { $ref: '#/components/schemas/location_id' },
			price_precision: { $ref: '#/components/schemas/price_precision' },
			accounts: { $ref: '#/components/schemas/accounts' },
			total: { $ref: '#/components/schemas/total' },
		},
	},
	opening_balance_id: { description: 'ID of opening balance.', type: 'string' },
	price_precision: {
		description: 'Price Precision of the Values',
		type: 'integer',
	},
	total: {
		description: 'Total Amount from the Opening Balance',
		type: 'integer',
	},
	'update-opening-balance-request': {
		required: ['opening_balance_id'],
		type: 'object',
		properties: {
			date: { $ref: '#/components/schemas/date' },
			location_id: { $ref: '#/components/schemas/location_id' },
			accounts: { $ref: '#/components/schemas/accounts' },
			opening_balance_id: { $ref: '#/components/schemas/opening_balance_id' },
		},
	},
	'update-opening-balance-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			opening_balance: { $ref: '#/components/schemas/opening_balance' },
		},
	},
	'writeoff-opening-balance-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
};

export const operations: readonly ZohoBooksOperationDefinition[] = [
	{
		id: 'create_opening_balance',
		group: 'openingBalance',
		groupSlug: 'opening-balance',
		name: 'createOpeningBalance',
		method: 'POST',
		path: '/settings/openingbalances',
		summary: 'Create opening balance',
		description: 'Creates opening balance with the given information.',
		docsUrl: 'https://www.zoho.com/books/api/v3/opening-balance/',
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
			schema: { $ref: '#/components/schemas/create-opening-balance-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/create-opening-balance-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_opening_balance',
		group: 'openingBalance',
		groupSlug: 'opening-balance',
		name: 'updateOpeningBalance',
		method: 'PUT',
		path: '/settings/openingbalances',
		summary: 'Update opening balance',
		description: 'Updates the existing opening balance information.',
		docsUrl: 'https://www.zoho.com/books/api/v3/opening-balance/',
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
			schema: { $ref: '#/components/schemas/update-opening-balance-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-opening-balance-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_opening_balance',
		group: 'openingBalance',
		groupSlug: 'opening-balance',
		name: 'getOpeningBalance',
		method: 'GET',
		path: '/settings/openingbalances',
		summary: 'Get opening balance',
		description: 'Get opening balance.',
		docsUrl: 'https://www.zoho.com/books/api/v3/opening-balance/',
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
				schema: { $ref: '#/components/schemas/get-opening-balance-response' },
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_opening_balance',
		group: 'openingBalance',
		groupSlug: 'opening-balance',
		name: 'deleteOpeningBalance',
		method: 'DELETE',
		path: '/settings/openingbalances',
		summary: 'Delete opening balance',
		description: 'Delete the entered opening balance.',
		docsUrl: 'https://www.zoho.com/books/api/v3/opening-balance/',
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
					$ref: '#/components/schemas/delete-opening-balance-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'list_opening_balance_details',
		group: 'openingBalance',
		groupSlug: 'opening-balance',
		name: 'listOpeningBalanceDetails',
		method: 'GET',
		path: '/settings/openingbalancedetails',
		summary: 'List opening balance account details',
		description: 'Lists the opening balance details for a specific account.',
		docsUrl: 'https://www.zoho.com/books/api/v3/opening-balance/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'account_id',
				in: 'query',
				required: true,
				description: 'ID of the account.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/list-opening-balance-details-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'read',
	},
	{
		id: 'list_opening_balance_transactions',
		group: 'openingBalance',
		groupSlug: 'opening-balance',
		name: 'listOpeningBalanceTransactions',
		method: 'GET',
		path: '/openingbalances/transactions',
		summary: 'List opening balance transactions',
		description:
			'Lists the opening balance transactions for a specific account.',
		docsUrl: 'https://www.zoho.com/books/api/v3/opening-balance/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
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
				name: 'opening_balance_date',
				in: 'query',
				required: false,
				description: 'Date of the opening balance.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/list-opening-balance-transactions-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'read',
	},
	{
		id: 'writeoff_opening_balance',
		group: 'openingBalance',
		groupSlug: 'opening-balance',
		name: 'writeoffOpeningBalance',
		method: 'POST',
		path: '/openingbalances/{opening_balance_id}/writeoff',
		summary: 'Write off an opening balance',
		description: 'Writes off an opening balance entry.',
		docsUrl: 'https://www.zoho.com/books/api/v3/opening-balance/',
		parameters: [
			{
				name: 'opening_balance_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the opening balance.',
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
				name: 'writeoff_date',
				in: 'query',
				required: false,
				description: 'Date of the write-off.',
				schema: { type: 'string' },
			},
			{
				name: 'reason',
				in: 'query',
				required: false,
				description: 'Reason for writing off. Max-length [300].',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/writeoff-opening-balance-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.UPDATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'cancel_writeoff_opening_balance',
		group: 'openingBalance',
		groupSlug: 'opening-balance',
		name: 'cancelWriteoffOpeningBalance',
		method: 'POST',
		path: '/openingbalances/{opening_balance_id}/writeoff/cancel',
		summary: 'Cancel a write-off',
		description: 'Cancels a previously written-off opening balance.',
		docsUrl: 'https://www.zoho.com/books/api/v3/opening-balance/',
		parameters: [
			{
				name: 'opening_balance_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the opening balance.',
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
					$ref: '#/components/schemas/cancel-writeoff-opening-balance-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.UPDATE'],
		riskLevel: 'destructive',
	},
];
