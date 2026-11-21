import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas: Record<string, JsonValue> = {
	account_exceptions: {
		description: 'List of accounts exempted from the transaction lock.',
		type: 'array',
		items: { type: 'string' },
	},
	account_exceptions_count: {
		description: 'Number of accounts exempted from the transaction lock.',
		type: 'integer',
	},
	account_ids: {
		description: 'List of account IDs to exempt from the lock.',
		type: 'array',
		items: { type: 'string' },
	},
	accounting_period_id: {
		description: 'ID of the accounting period.',
		type: 'string',
	},
	accounting_period_name: {
		description: 'Name of the accounting period.',
		type: 'string',
	},
	active_lock_summary: {
		description: 'Summary of the active transaction lock.',
		type: 'object',
	},
	applied_filter: { description: 'The filter applied', type: 'string' },
	'delete-transaction-lock-request': {
		type: 'object',
		properties: { reason: { $ref: '#/components/schemas/reason' } },
	},
	'delete-transaction-lock-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	end_date: {
		description: 'End date of the accounting period. [yyyy-MM-dd]',
		type: 'string',
	},
	fiscal_year_name: { description: 'Name of the fiscal year.', type: 'string' },
	'get-transaction-lock-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			transaction_lock: {
				$ref: '#/components/schemas/transaction-lock-response',
			},
		},
	},
	has_more_page: { description: 'Check if has more pages', type: 'boolean' },
	is_adjustment_period: {
		description: 'Whether the period is an adjustment period.',
		type: 'boolean',
	},
	is_enabled: {
		description: 'Whether partial unlock is enabled.',
		type: 'boolean',
	},
	'list-transaction-locks-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			transaction_locks: {
				type: 'array',
				items: { $ref: '#/components/schemas/transaction-lock-response' },
			},
			page_context: { $ref: '#/components/schemas/page_context' },
		},
	},
	lock_module: {
		description:
			'Module for partial unlock. Allowed Values: <code>all</code>, <code>sales</code>, <code>purchase</code>, <code>accountant</code>, <code>banking</code>.',
		type: 'string',
	},
	lock_scope: {
		description:
			'Scope of the lock. Allowed Values: <code>0</code>, <code>1</code>, <code>2</code>, <code>3</code>, <code>4</code>, <code>5</code>.',
		type: 'integer',
	},
	lock_scope_formatted: {
		description: 'Formatted display value of the lock scope.',
		type: 'string',
	},
	lock_status: {
		description: 'Lock status of the transaction lock.',
		type: 'string',
	},
	lock_status_formatted: {
		description: 'Formatted display value of the lock status.',
		type: 'string',
	},
	locked_by: {
		description: 'Name of the user who locked the period.',
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
	partial_lock_number: {
		description: 'Partial lock number for the transaction lock.',
		type: 'integer',
	},
	per_page: { description: 'Per page values', type: 'integer' },
	reason: {
		description: 'Reason for the transaction lock action. Max-length [500]',
		type: 'string',
	},
	sort_column: { description: 'Column used for sorting', type: 'string' },
	sort_order: { description: 'The order for sorting', type: 'string' },
	start_date: {
		description: 'Start date of the accounting period. [yyyy-MM-dd]',
		type: 'string',
	},
	status: {
		description: 'Status of the transaction lock entry.',
		type: 'string',
	},
	'transaction-lock-response': {
		type: 'object',
		properties: {
			transaction_lock_id: { $ref: '#/components/schemas/transaction_lock_id' },
			accounting_period_id: {
				$ref: '#/components/schemas/accounting_period_id',
			},
			transaction_lock_status: {
				$ref: '#/components/schemas/transaction_lock_status',
			},
			transaction_lock_date: {
				$ref: '#/components/schemas/transaction_lock_date',
			},
			lock_status: { $ref: '#/components/schemas/lock_status' },
			lock_scope: { $ref: '#/components/schemas/lock_scope' },
			lock_scope_formatted: {
				$ref: '#/components/schemas/lock_scope_formatted',
			},
			lock_status_formatted: {
				$ref: '#/components/schemas/lock_status_formatted',
			},
			partial_lock_number: { $ref: '#/components/schemas/partial_lock_number' },
			accounting_period_name: {
				$ref: '#/components/schemas/accounting_period_name',
			},
			fiscal_year_name: { $ref: '#/components/schemas/fiscal_year_name' },
			start_date: { $ref: '#/components/schemas/start_date' },
			end_date: { $ref: '#/components/schemas/end_date' },
			status: { $ref: '#/components/schemas/status' },
			is_adjustment_period: {
				$ref: '#/components/schemas/is_adjustment_period',
			},
			locked_by: { $ref: '#/components/schemas/locked_by' },
			user_exceptions: { $ref: '#/components/schemas/user_exceptions' },
			user_exceptions_count: {
				$ref: '#/components/schemas/user_exceptions_count',
			},
			account_exceptions: { $ref: '#/components/schemas/account_exceptions' },
			account_exceptions_count: {
				$ref: '#/components/schemas/account_exceptions_count',
			},
			reason: { $ref: '#/components/schemas/reason' },
			active_lock_summary: { $ref: '#/components/schemas/active_lock_summary' },
		},
	},
	transaction_lock_date: {
		description: 'Date up to which transactions are locked. [yyyy-MM-dd]',
		type: 'string',
	},
	transaction_lock_id: {
		description: 'ID of the transaction lock.',
		type: 'string',
	},
	transaction_lock_module: {
		description:
			'Module to which the transaction lock applies. Allowed Values: <code>sales</code>, <code>purchase</code>, <code>accountant</code>, <code>banking</code>, <code>inventory_adjustments</code>.',
		type: 'string',
	},
	transaction_lock_status: {
		description:
			'Status of the transaction lock. Allowed Values: <code>disabled</code>, <code>enabled</code>, <code>enabled_with_logging</code>.',
		type: 'string',
	},
	'update-partial-unlock-request': {
		type: 'object',
		properties: {
			is_enabled: { $ref: '#/components/schemas/is_enabled' },
			lock_module: { $ref: '#/components/schemas/lock_module' },
			start_date: { $ref: '#/components/schemas/start_date' },
			end_date: { $ref: '#/components/schemas/end_date' },
			reason: { $ref: '#/components/schemas/reason' },
		},
	},
	'update-partial-unlock-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			transaction_lock: {
				$ref: '#/components/schemas/transaction-lock-response',
			},
		},
	},
	'update-transaction-lock-request': {
		type: 'object',
		properties: {
			transaction_lock_status: {
				$ref: '#/components/schemas/transaction_lock_status',
			},
			transaction_lock_module: {
				$ref: '#/components/schemas/transaction_lock_module',
			},
			transaction_lock_date: {
				$ref: '#/components/schemas/transaction_lock_date',
			},
			accounting_period_id: {
				$ref: '#/components/schemas/accounting_period_id',
			},
			reason: { $ref: '#/components/schemas/reason' },
			user_ids: { $ref: '#/components/schemas/user_ids' },
			account_ids: { $ref: '#/components/schemas/account_ids' },
		},
	},
	'update-transaction-lock-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			transaction_lock: {
				$ref: '#/components/schemas/transaction-lock-response',
			},
		},
	},
	user_exceptions: {
		description: 'List of users exempted from the transaction lock.',
		type: 'array',
		items: { type: 'string' },
	},
	user_exceptions_count: {
		description: 'Number of users exempted from the transaction lock.',
		type: 'integer',
	},
	user_ids: {
		description: 'List of user IDs to exempt from the lock.',
		type: 'array',
		items: { type: 'string' },
	},
};

export const operations: readonly ZohoBooksOperationDefinition[] = [
	{
		id: 'get_transaction_lock',
		group: 'transactionLocking',
		groupSlug: 'transaction-locking',
		name: 'getTransactionLock',
		method: 'GET',
		path: '/transactionlock',
		summary: 'Get transaction lock details',
		description: 'Get the details of financial transaction locking.',
		docsUrl: 'https://www.zoho.com/books/api/v3/transaction-locking/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'accounting_period_id',
				in: 'query',
				required: false,
				description: 'ID of the accounting period.',
				schema: { type: 'string' },
			},
			{
				name: 'transaction_lock_id',
				in: 'query',
				required: false,
				description: 'ID of the transaction lock.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/get-transaction-lock-response' },
			},
		],
		scopes: ['ZohoBooks.accountants.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_transaction_lock',
		group: 'transactionLocking',
		groupSlug: 'transaction-locking',
		name: 'updateTransactionLock',
		method: 'PUT',
		path: '/transactionlock',
		summary: 'Update transaction lock',
		description: 'Update transaction lock settings.',
		docsUrl: 'https://www.zoho.com/books/api/v3/transaction-locking/',
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
			schema: { $ref: '#/components/schemas/update-transaction-lock-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-transaction-lock-response',
				},
			},
		],
		scopes: ['ZohoBooks.accountants.UPDATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'delete_transaction_lock',
		group: 'transactionLocking',
		groupSlug: 'transaction-locking',
		name: 'deleteTransactionLock',
		method: 'DELETE',
		path: '/transactionlock',
		summary: 'Delete a transaction lock',
		description: 'Delete a transaction lock entry.',
		docsUrl: 'https://www.zoho.com/books/api/v3/transaction-locking/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'transaction_lock_id',
				in: 'query',
				required: true,
				description: 'ID of the transaction lock to delete.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/delete-transaction-lock-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/delete-transaction-lock-response',
				},
			},
		],
		scopes: ['ZohoBooks.accountants.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_accounting_period_transaction_lock',
		group: 'transactionLocking',
		groupSlug: 'transaction-locking',
		name: 'getAccountingPeriodTransactionLock',
		method: 'GET',
		path: '/accountingperiods/transactionlock',
		summary: 'Get transaction lock for an accounting period',
		description: 'Get transaction locking details for an accounting period.',
		docsUrl: 'https://www.zoho.com/books/api/v3/transaction-locking/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'accounting_period_id',
				in: 'query',
				required: false,
				description: 'ID of the accounting period.',
				schema: { type: 'string' },
			},
			{
				name: 'transaction_lock_id',
				in: 'query',
				required: false,
				description: 'ID of the transaction lock.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/get-transaction-lock-response' },
			},
		],
		scopes: ['ZohoBooks.accountants.READ'],
		riskLevel: 'read',
	},
	{
		id: 'list_transaction_locks',
		group: 'transactionLocking',
		groupSlug: 'transaction-locking',
		name: 'listTransactionLocks',
		method: 'GET',
		path: '/transactionlocks',
		summary: 'List transaction locks',
		description: 'List all transaction locks with pagination.',
		docsUrl: 'https://www.zoho.com/books/api/v3/transaction-locking/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
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
			{
				name: 'accounting_period_id',
				in: 'query',
				required: false,
				description: 'ID of the accounting period to filter by.',
				schema: { type: 'string' },
			},
			{
				name: 'lock_scope',
				in: 'query',
				required: false,
				description:
					'Filter by lock scope. Allowed Values: <code>0</code>, <code>1</code>, <code>2</code>, <code>3</code>, <code>4</code>, <code>5</code>.',
				schema: { type: 'integer' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/list-transaction-locks-response',
				},
			},
		],
		scopes: ['ZohoBooks.accountants.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_partial_unlock',
		group: 'transactionLocking',
		groupSlug: 'transaction-locking',
		name: 'updatePartialUnlock',
		method: 'PUT',
		path: '/transactionlock/partialunlock',
		summary: 'Update partial unlock settings',
		description: 'Update partial unlock settings for transaction locking.',
		docsUrl: 'https://www.zoho.com/books/api/v3/transaction-locking/',
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
			schema: { $ref: '#/components/schemas/update-partial-unlock-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-partial-unlock-response' },
			},
		],
		scopes: ['ZohoBooks.accountants.UPDATE'],
		riskLevel: 'destructive',
	},
];
