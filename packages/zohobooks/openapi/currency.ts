import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas: Record<string, JsonValue> = {
	'create-a-currency-request': {
		required: ['currency_code', 'currency_format'],
		type: 'object',
		properties: {
			currency_code: { $ref: '#/components/schemas/currency_code' },
			currency_symbol: { $ref: '#/components/schemas/currency_symbol' },
			price_precision: { $ref: '#/components/schemas/price_precision' },
			currency_format: { $ref: '#/components/schemas/currency_format' },
		},
	},
	'create-a-currency-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			currency: { $ref: '#/components/schemas/currency' },
		},
	},
	'create-an-exchange-rate-request': {
		type: 'object',
		properties: {
			effective_date: { $ref: '#/components/schemas/effective_date' },
			rate: { $ref: '#/components/schemas/rate' },
		},
	},
	'create-an-exchange-rate-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
		},
	},
	currency: {
		type: 'object',
		properties: {
			currency_id: { $ref: '#/components/schemas/currency_id' },
			currency_code: { $ref: '#/components/schemas/currency_code' },
			currency_name: { $ref: '#/components/schemas/currency_name' },
			currency_symbol: { $ref: '#/components/schemas/currency_symbol' },
			price_precision: { $ref: '#/components/schemas/price_precision' },
			currency_format: { $ref: '#/components/schemas/currency_format' },
			is_base_currency: { $ref: '#/components/schemas/is_base_currency' },
		},
	},
	currency_code: {
		description: 'A unique standard code for the currency. Max-len [100]',
		type: 'string',
	},
	currency_format: {
		description: 'The format for the currency to be displayed. Max-len [100]',
		type: 'string',
	},
	currency_id: { description: 'A unique ID for the currency.', type: 'string' },
	currency_name: { description: 'The name for the currency.', type: 'string' },
	currency_symbol: {
		description: 'A unique symbol for the currency. Max-len [4]',
		type: 'string',
	},
	'delete-a-currency-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-an-exchage-rate-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	effective_date: {
		description: 'Date which the exchange rate is applicable for the currency.',
		type: 'string',
	},
	exchange_rate: {
		description: 'Exchange rate for the currency.',
		type: 'number',
		format: 'double',
	},
	exchange_rate_id: { description: 'ID of the exchange rate', type: 'string' },
	'get-a-currency-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			currency: { $ref: '#/components/schemas/currency' },
		},
	},
	'get-an-exchange-rate-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
		},
	},
	is_base_currency: {
		description: 'Is it the base currency of the organization.',
		type: 'boolean',
	},
	'list-currencies-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			currencies: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						currency_id: { $ref: '#/components/schemas/currency_id' },
						currency_code: { $ref: '#/components/schemas/currency_code' },
						currency_name: { $ref: '#/components/schemas/currency_name' },
						currency_symbol: { $ref: '#/components/schemas/currency_symbol' },
						price_precision: { $ref: '#/components/schemas/price_precision' },
						currency_format: { $ref: '#/components/schemas/currency_format' },
						is_base_currency: { $ref: '#/components/schemas/is_base_currency' },
						exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
						effective_date: { $ref: '#/components/schemas/effective_date' },
					},
				},
			},
		},
	},
	'list-exchange-rates-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			exchange_rates: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						exchange_rate_id: { $ref: '#/components/schemas/exchange_rate_id' },
						currency_id: { $ref: '#/components/schemas/currency_id' },
						currency_code: { $ref: '#/components/schemas/currency_code' },
						effective_date: { $ref: '#/components/schemas/effective_date' },
						rate: { $ref: '#/components/schemas/rate' },
					},
				},
			},
		},
	},
	price_precision: {
		description: 'The precision for the price',
		type: 'integer',
	},
	rate: {
		description:
			'Rate of exchange for the currency with respect to base currency.',
		type: 'number',
		format: 'double',
	},
	'update-a-currency-request': {
		required: ['currency_code', 'currency_format'],
		type: 'object',
		properties: {
			currency_code: { $ref: '#/components/schemas/currency_code' },
			currency_symbol: { $ref: '#/components/schemas/currency_symbol' },
			price_precision: { $ref: '#/components/schemas/price_precision' },
			currency_format: { $ref: '#/components/schemas/currency_format' },
		},
	},
	'update-a-currency-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			currency: { $ref: '#/components/schemas/currency' },
		},
	},
	'update-an-exchange-rate-request': {
		type: 'object',
		properties: {
			effective_date: { $ref: '#/components/schemas/effective_date' },
			rate: { $ref: '#/components/schemas/rate' },
		},
	},
	'update-an-exchange-rate-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
};

export const operations: readonly ZohoBooksOperationDefinition[] = [
	{
		id: 'create_currency',
		group: 'currency',
		groupSlug: 'currency',
		name: 'createCurrency',
		method: 'POST',
		path: '/settings/currencies',
		summary: 'Create a Currency',
		description: 'Create a currency for transaction.',
		docsUrl: 'https://www.zoho.com/books/api/v3/currency/',
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
			schema: { $ref: '#/components/schemas/create-a-currency-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/create-a-currency-response' },
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_currencies',
		group: 'currency',
		groupSlug: 'currency',
		name: 'listCurrencies',
		method: 'GET',
		path: '/settings/currencies',
		summary: 'List Currencies',
		description: 'Get list of currencies configured.',
		docsUrl: 'https://www.zoho.com/books/api/v3/currency/',
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
					'Filter currencies excluding base currency. Allowed Values: <code>Currencies.ExcludeBaseCurrency</code>',
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
				schema: { $ref: '#/components/schemas/list-currencies-response' },
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_currency',
		group: 'currency',
		groupSlug: 'currency',
		name: 'updateCurrency',
		method: 'PUT',
		path: '/settings/currencies/{currency_id}',
		summary: 'Update a Currency',
		description: 'Update the details of a currency.',
		docsUrl: 'https://www.zoho.com/books/api/v3/currency/',
		parameters: [
			{
				name: 'currency_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the currency.',
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
			schema: { $ref: '#/components/schemas/update-a-currency-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-a-currency-response' },
			},
		],
		scopes: ['ZohoBooks.settings.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_currency',
		group: 'currency',
		groupSlug: 'currency',
		name: 'getCurrency',
		method: 'GET',
		path: '/settings/currencies/{currency_id}',
		summary: 'Get a Currency',
		description: 'Get the details of a currency.',
		docsUrl: 'https://www.zoho.com/books/api/v3/currency/',
		parameters: [
			{
				name: 'currency_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the currency.',
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
				schema: { $ref: '#/components/schemas/get-a-currency-response' },
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_currency',
		group: 'currency',
		groupSlug: 'currency',
		name: 'deleteCurrency',
		method: 'DELETE',
		path: '/settings/currencies/{currency_id}',
		summary: 'Delete a currency',
		description:
			'Delete a currency. Currency that is associated to transactions cannot be deleted.',
		docsUrl: 'https://www.zoho.com/books/api/v3/currency/',
		parameters: [
			{
				name: 'currency_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the currency.',
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
				schema: { $ref: '#/components/schemas/delete-a-currency-response' },
			},
		],
		scopes: ['ZohoBooks.settings.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'list_exchange_rates',
		group: 'currency',
		groupSlug: 'currency',
		name: 'listExchangeRates',
		method: 'GET',
		path: '/settings/currencies/{currency_id}/exchangerates',
		summary: 'List exchange rates',
		description: 'List of exchange rates configured for the currency.',
		docsUrl: 'https://www.zoho.com/books/api/v3/currency/',
		parameters: [
			{
				name: 'currency_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the currency.',
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
				name: 'from_date',
				in: 'query',
				required: false,
				description:
					'Returns the exchange rate details from the given date or from previous closest match in the absence of the exchange rate on the given date.',
				schema: { type: 'string' },
			},
			{
				name: 'is_current_date',
				in: 'query',
				required: false,
				description:
					'To return the exchange rate only if available for current date.',
				schema: { type: 'boolean' },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description:
					'Sorts the exchange rate according to this column. Allowed Values : <code>effective_date</code>',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/list-exchange-rates-response' },
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'read',
	},
	{
		id: 'create_exchange_rate',
		group: 'currency',
		groupSlug: 'currency',
		name: 'createExchangeRate',
		method: 'POST',
		path: '/settings/currencies/{currency_id}/exchangerates',
		summary: 'Create an exchange rate',
		description: 'Create an exchange rate for the specified currency.',
		docsUrl: 'https://www.zoho.com/books/api/v3/currency/',
		parameters: [
			{
				name: 'currency_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the currency.',
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
			schema: { $ref: '#/components/schemas/create-an-exchange-rate-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/create-an-exchange-rate-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_exchange_rate',
		group: 'currency',
		groupSlug: 'currency',
		name: 'getExchangeRate',
		method: 'GET',
		path: '/settings/currencies/{currency_id}/exchangerates/{exchange_rate_id}',
		summary: 'Get an exchange rate.',
		description:
			'Get the details of an exchange rate that has been asscoiated to the currency.',
		docsUrl: 'https://www.zoho.com/books/api/v3/currency/',
		parameters: [
			{
				name: 'currency_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the currency.',
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
				name: 'exchange_rate_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the exchange rate.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/get-an-exchange-rate-response' },
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_exchange_rate',
		group: 'currency',
		groupSlug: 'currency',
		name: 'updateExchangeRate',
		method: 'PUT',
		path: '/settings/currencies/{currency_id}/exchangerates/{exchange_rate_id}',
		summary: 'Update an exchange rate',
		description: 'Update the details of exchange rate for a currency.',
		docsUrl: 'https://www.zoho.com/books/api/v3/currency/',
		parameters: [
			{
				name: 'currency_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the currency.',
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
				name: 'exchange_rate_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the exchange rate.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/update-an-exchange-rate-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-an-exchange-rate-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_exchange_rate',
		group: 'currency',
		groupSlug: 'currency',
		name: 'deleteExchangeRate',
		method: 'DELETE',
		path: '/settings/currencies/{currency_id}/exchangerates/{exchange_rate_id}',
		summary: 'Delete an exchage rate',
		description: 'Delete an exchange rate for the specified currency.',
		docsUrl: 'https://www.zoho.com/books/api/v3/currency/',
		parameters: [
			{
				name: 'currency_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the currency.',
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
				name: 'exchange_rate_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the exchange rate.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/delete-an-exchage-rate-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.DELETE'],
		riskLevel: 'destructive',
	},
];
