import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas = {
	account_id: {
		description: 'ID of the chart of accounts account.',
		type: 'string',
	},
	account_name: { description: 'Name of the account.', type: 'string' },
	account_type: {
		description: 'Account type of the register.',
		type: 'string',
	},
	action_type: {
		description: 'Type of bulk action performed.',
		type: 'string',
	},
	applied_filter: {
		description: 'Filter applied to the list.',
		type: 'string',
	},
	branch_id: { description: 'ID of the branch or location.', type: 'string' },
	budget_id: { description: 'ID of the budget.', type: 'string' },
	budget_name: { description: 'Name of the budget.', type: 'string' },
	'bulk-delete-register-transactions-request': {
		allOf: [
			{
				$ref: '#/components/schemas/bulk-update-register-transactions-request',
			},
		],
	},
	'bulk-delete-register-transactions-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'bulk-update-register-entity': {
		type: 'object',
		properties: {
			entity_id: { $ref: '#/components/schemas/entity_id' },
			entity_type: { $ref: '#/components/schemas/entity_type' },
		},
	},
	'bulk-update-register-transactions-request': {
		type: 'object',
		properties: {
			account_id: { $ref: '#/components/schemas/account_id' },
			branch_id: { $ref: '#/components/schemas/branch_id' },
			date: { $ref: '#/components/schemas/date' },
			bulk_update_reason: { $ref: '#/components/schemas/bulk_update_reason' },
			entities: { $ref: '#/components/schemas/entities' },
		},
	},
	'bulk-update-register-transactions-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	bulk_action_id: {
		description: 'ID of the bulk action history record.',
		type: 'string',
	},
	bulk_update_reason: {
		description: 'Reason for the bulk update.',
		type: 'string',
	},
	date: { description: 'Date and time of the bulk action.', type: 'string' },
	description: {
		description: 'Description of the bulk action.',
		type: 'string',
	},
	entities: {
		description:
			'list of json object with contains entity id and Type of entity.',
		type: 'array',
		items: { $ref: '#/components/schemas/bulk-update-register-entity' },
	},
	entity_id: {
		description: 'ID of the entity (transaction source record).',
		type: 'string',
	},
	entity_status: {
		description: 'Status of the entity update in the bulk action.',
		type: 'string',
	},
	entity_type: {
		description:
			'Type of entity. sample include <code>invoice</code>, <code>bill</code>, <code>journal</code>, and <code>expense</code>.',
		type: 'string',
	},
	generalledger_id: {
		description: 'ID of the general ledger account.',
		type: 'string',
	},
	generalledger_name: {
		description: 'Name of the general ledger account.',
		type: 'string',
	},
	'get-register-budget-vs-actuals-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			register_budget_vs_actual: {
				type: 'object',
				properties: {
					budget_info_list: {
						type: 'array',
						items: { $ref: '#/components/schemas/register-budget-info' },
					},
					budget_vs_actuals: {
						$ref: '#/components/schemas/register-budget-vs-actuals-detail',
					},
				},
			},
		},
	},
	'get-register-bulk-action-history-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			bulk_action_details: {
				$ref: '#/components/schemas/register-bulk-action-details',
			},
			page_context: { $ref: '#/components/schemas/page_context' },
		},
	},
	'get-register-bulk-update-editpage-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			fields: {
				type: 'array',
				items: { $ref: '#/components/schemas/register-bulk-update-field' },
			},
		},
	},
	has_more_page: {
		description: 'Whether more pages are available.',
		type: 'boolean',
	},
	'list-register-bulk-action-history-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			bulk_actions_history: {
				type: 'array',
				items: { $ref: '#/components/schemas/register-bulk-action' },
			},
			page_context: { $ref: '#/components/schemas/page_context' },
		},
	},
	'list-register-transactions-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			register_transactions: {
				$ref: '#/components/schemas/register-transactions',
			},
			page_context: { $ref: '#/components/schemas/page_context' },
		},
	},
	page: { description: 'Current page number.', type: 'integer' },
	page_context: {
		type: 'object',
		properties: {
			page: { $ref: '#/components/schemas/page' },
			per_page: { $ref: '#/components/schemas/per_page' },
			has_more_page: { $ref: '#/components/schemas/has_more_page' },
			report_name: { $ref: '#/components/schemas/report_name' },
			applied_filter: { $ref: '#/components/schemas/applied_filter' },
			sort_column: { $ref: '#/components/schemas/sort_column' },
			sort_order: { $ref: '#/components/schemas/sort_order' },
		},
	},
	per_page: { description: 'Records per page.', type: 'integer' },
	'register-budget-info': {
		type: 'object',
		properties: {
			budget_id: { $ref: '#/components/schemas/budget_id' },
			budget_name: { $ref: '#/components/schemas/budget_name' },
		},
	},
	'register-budget-vs-actuals-detail': {
		type: 'object',
		properties: {
			generalledger_info: {
				type: 'object',
				properties: {
					generalledger_id: { $ref: '#/components/schemas/generalledger_id' },
					generalledger_name: {
						$ref: '#/components/schemas/generalledger_name',
					},
				},
			},
			budget_info: { $ref: '#/components/schemas/register-budget-info' },
			detailed_budget_vs_actual: { type: 'array', items: { type: 'object' } },
		},
	},
	'register-bulk-action': {
		type: 'object',
		properties: {
			bulk_action_id: { $ref: '#/components/schemas/bulk_action_id' },
			account_id: { $ref: '#/components/schemas/account_id' },
			description: { $ref: '#/components/schemas/description' },
			action_type: { $ref: '#/components/schemas/action_type' },
			status: { $ref: '#/components/schemas/status' },
			date: { $ref: '#/components/schemas/date' },
			user_id: { $ref: '#/components/schemas/user_id' },
			user_name: { $ref: '#/components/schemas/user_name' },
			txn_count: { $ref: '#/components/schemas/txn_count' },
			updated_field: { $ref: '#/components/schemas/updated_field' },
			updated_value: { $ref: '#/components/schemas/updated_value' },
			updated_reason: { $ref: '#/components/schemas/updated_reason' },
		},
	},
	'register-bulk-action-details': {
		type: 'object',
		properties: {
			bulk_action_id: { $ref: '#/components/schemas/bulk_action_id' },
			action_type: { $ref: '#/components/schemas/action_type' },
			account_id: { $ref: '#/components/schemas/account_id' },
			account_name: { $ref: '#/components/schemas/account_name' },
			description: { $ref: '#/components/schemas/description' },
			status: { $ref: '#/components/schemas/status' },
			date: { $ref: '#/components/schemas/date' },
			updated_field: { $ref: '#/components/schemas/updated_field' },
			updated_value: { $ref: '#/components/schemas/updated_value' },
			updated_reason: { $ref: '#/components/schemas/updated_reason' },
			transactions: {
				type: 'array',
				items: {
					$ref: '#/components/schemas/register-bulk-action-entity-transaction',
				},
			},
		},
	},
	'register-bulk-action-entity-transaction': {
		type: 'object',
		properties: {
			entity_id: { $ref: '#/components/schemas/entity_id' },
			transaction_number: { $ref: '#/components/schemas/transaction_number' },
			transaction_type: { $ref: '#/components/schemas/transaction_type' },
			entity_status: { $ref: '#/components/schemas/entity_status' },
		},
	},
	'register-bulk-update-field': {
		type: 'object',
		properties: {
			can_show_field: { type: 'boolean' },
			data_type: { type: 'string' },
			field: { type: 'string' },
			label: { type: 'string' },
			option_label: { type: 'string' },
			option_value: { type: 'string' },
			values: { type: 'array', items: { type: 'object' } },
		},
	},
	'register-transaction': {
		type: 'object',
		description: 'A transaction line in the account register report.',
		properties: {
			transaction_id: { type: 'string' },
			transaction_date: { type: 'string', format: 'date' },
			transaction_type: { $ref: '#/components/schemas/transaction_type' },
			transaction_type_formatted: { type: 'string' },
			account_id: { $ref: '#/components/schemas/account_id' },
			debit_amount: { type: 'number', format: 'double' },
			credit_amount: { type: 'number', format: 'double' },
		},
	},
	'register-transactions': {
		type: 'object',
		properties: {
			account_transactions: {
				type: 'array',
				items: { $ref: '#/components/schemas/register-transaction' },
			},
			account_type: { $ref: '#/components/schemas/account_type' },
			gl_closing_balance: { type: 'number', format: 'double' },
		},
	},
	report_name: { description: 'Internal report name.', type: 'string' },
	sort_column: { description: 'Column used for sorting.', type: 'string' },
	sort_order: { description: 'Sort order applied.', type: 'string' },
	status: {
		description: 'Status of the bulk action or entity update.',
		type: 'string',
	},
	transaction_number: {
		description: 'Transaction or document number.',
		type: 'string',
	},
	transaction_type: { description: 'Type of transaction.', type: 'string' },
	txn_count: {
		description: 'Number of transactions affected.',
		type: 'string',
	},
	updated_field: {
		description: 'Field that was updated in the bulk action.',
		type: 'string',
	},
	updated_reason: {
		description: 'Reason provided for the bulk update.',
		type: 'string',
	},
	updated_value: {
		description: 'Value applied in the bulk update.',
		type: 'string',
	},
	user_id: {
		description: 'ID of the user who performed the bulk action.',
		type: 'string',
	},
	user_name: {
		description: 'Name of the user who performed the bulk action.',
		type: 'string',
	},
} as const satisfies Record<string, JsonValue>;

export const operations = [
	{
		id: 'list_register_transactions',
		group: 'registers',
		groupSlug: 'registers',
		name: 'listRegisterTransactions',
		method: 'GET',
		path: '/registers/{account_id}/transactions',
		summary: 'List register transactions',
		description:
			'Retrieve transactions for a chart of accounts register (account) as a report view with optional grouping, column selection, and print preferences.',
		docsUrl: 'https://www.zoho.com/books/api/v3/registers/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the chart of accounts register (general ledger account).',
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
				name: 'filter_by',
				in: 'query',
				required: false,
				description:
					'Filter transactions by date. Allowed Values: <code>TransactionDate.Today</code>, <code>TransactionDate.ThisWeek</code>, <code>TransactionDate.ThisMonth</code>, <code>TransactionDate.ThisQuarter</code>, <code>TransactionDate.ThisYear</code>, <code>TransactionDate.PreviousDay</code>, <code>TransactionDate.PreviousWeek</code>, <code>TransactionDate.PreviousMonth</code>, <code>TransactionDate.PreviousQuarter</code>, <code>TransactionDate.PreviousYear</code>, and <code>TransactionDate.CustomDate</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'from_date',
				in: 'query',
				required: false,
				description:
					'Start date when using a custom date range. Format <code>yyyy-mm-dd</code>.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'to_date',
				in: 'query',
				required: false,
				description:
					'End date when using a custom date range. Format <code>yyyy-mm-dd</code>.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'cash_based',
				in: 'query',
				required: false,
				description: 'When <code>true</code>, returns cash-based amounts.',
				schema: { type: 'boolean' },
			},
			{
				name: 'account_id',
				in: 'query',
				required: false,
				description: 'Comma-separated account IDs to include (max 50).',
				schema: { type: 'string' },
			},
			{
				name: 'group_by',
				in: 'query',
				required: false,
				description: 'JSONArray of report select columns for grouping.',
				schema: { type: 'string' },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description:
					'Sort column. Allowed Values: <code>date</code>, <code>transaction_type</code>, <code>account_type</code>, <code>account_name</code>, and <code>account_code</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'optional_columns',
				in: 'query',
				required: false,
				description:
					'Optional columns to include. Allowed Values: <code>account_code</code>, <code>running_balance</code>, and <code>net_amount</code> (comma-separated).',
				schema: { type: 'string' },
			},
			{
				name: 'show_fcy',
				in: 'query',
				required: false,
				description:
					'When <code>true</code>, includes foreign currency amounts.',
				schema: { type: 'boolean' },
			},
			{
				name: 'is_select_column_enabled',
				in: 'query',
				required: false,
				description:
					'When <code>true</code>, enables select-column report flow.',
				schema: { type: 'boolean' },
			},
			{
				name: 'is_new_flow',
				in: 'query',
				required: false,
				description: 'When <code>true</code>, uses the new report pipeline.',
				schema: { type: 'boolean' },
			},
			{
				name: 'is_account_code_column_enabled',
				in: 'query',
				required: false,
				description:
					'When <code>true</code>, includes the account code column.',
				schema: { type: 'boolean' },
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
				description:
					'Number of records to be fetched per page. Default value is 10.',
				schema: { type: 'integer', default: 10 },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/list-register-transactions-response',
				},
			},
		],
		scopes: ['ZohoBooks.accountants.READ'],
		riskLevel: 'read',
	},
	{
		id: 'list_register_bulk_action_history',
		group: 'registers',
		groupSlug: 'registers',
		name: 'listRegisterBulkActionHistory',
		method: 'GET',
		path: '/registers/{account_id}/bulkhistory',
		summary: 'List register bulk action history',
		description:
			'List bulk update and bulk delete history for the given account register.',
		docsUrl: 'https://www.zoho.com/books/api/v3/registers/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the chart of accounts register (general ledger account).',
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
				description:
					'Number of records to be fetched per page. Default value is 10.',
				schema: { type: 'integer', default: 10 },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description: 'Sort column. Allowed Values: <code>created_time</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'sort_order',
				in: 'query',
				required: false,
				description:
					'Sort order. Allowed Values: <code>A</code> and <code>D</code>.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/list-register-bulk-action-history-response',
				},
			},
		],
		scopes: ['ZohoBooks.accountants.READ'],
		riskLevel: 'read',
	},
	{
		id: 'get_register_bulk_action_history',
		group: 'registers',
		groupSlug: 'registers',
		name: 'getRegisterBulkActionHistory',
		method: 'GET',
		path: '/registers/{account_id}/bulkhistory/{comment_id}',
		summary: 'Get register bulk action history details',
		description:
			'Retrieve details of a single bulk action on the account register, including affected transactions.',
		docsUrl: 'https://www.zoho.com/books/api/v3/registers/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the chart of accounts register (general ledger account).',
				schema: { type: 'string' },
			},
			{
				name: 'comment_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bulk action history comment.',
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
				description:
					'Number of records to be fetched per page. Default value is 10.',
				schema: { type: 'integer', default: 10 },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description: 'Sort column. Allowed Values: <code>created_time</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'sort_order',
				in: 'query',
				required: false,
				description:
					'Sort order. Allowed Values: <code>A</code> and <code>D</code>.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/get-register-bulk-action-history-response',
				},
			},
		],
		scopes: ['ZohoBooks.accountants.READ'],
		riskLevel: 'read',
	},
	{
		id: 'get_register_bulk_update_editpage',
		group: 'registers',
		groupSlug: 'registers',
		name: 'getRegisterBulkUpdateEditpage',
		method: 'GET',
		path: '/registers/{account_id}/bulkupdate/editpage',
		summary: 'Get register bulk update edit page',
		description:
			'Returns metadata for fields supported when bulk updating transactions on an account register.',
		docsUrl: 'https://www.zoho.com/books/api/v3/registers/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the chart of accounts register (general ledger account).',
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
					$ref: '#/components/schemas/get-register-bulk-update-editpage-response',
				},
			},
		],
		scopes: ['ZohoBooks.accountants.READ'],
		riskLevel: 'read',
	},
	{
		id: 'get_register_budget_vs_actuals',
		group: 'registers',
		groupSlug: 'registers',
		name: 'getRegisterBudgetVsActuals',
		method: 'GET',
		path: '/registers/{account_id}/budgetvsactuals',
		summary: 'Get register budget vs actuals',
		description:
			'Retrieve budget versus actuals for an account register. When <code>budget_id</code> is provided, returns detailed period breakdown.',
		docsUrl: 'https://www.zoho.com/books/api/v3/registers/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the chart of accounts register (general ledger account).',
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
				name: 'budget_id',
				in: 'query',
				required: false,
				description:
					'ID of the budget. When provided, returns detailed <code>budget_vs_actuals</code> for that budget.',
				schema: { type: 'string' },
			},
			{
				name: 'filter_by',
				in: 'query',
				required: false,
				description:
					'Filter by transaction date. Allowed Values: <code>TransactionDate.Today</code>, <code>TransactionDate.ThisWeek</code>, <code>TransactionDate.ThisMonth</code>, <code>TransactionDate.ThisQuarter</code>, <code>TransactionDate.ThisYear</code>, <code>TransactionDate.PreviousDay</code>, <code>TransactionDate.PreviousWeek</code>, <code>TransactionDate.PreviousMonth</code>, <code>TransactionDate.PreviousQuarter</code>, <code>TransactionDate.PreviousYear</code>, and <code>TransactionDate.CustomDate</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'cash_based',
				in: 'query',
				required: false,
				description: 'When <code>true</code>, uses cash-based accounting.',
				schema: { type: 'boolean' },
			},
			{
				name: 'from_date',
				in: 'query',
				required: false,
				description:
					'Start date for the comparison period. Format <code>yyyy-mm-dd</code>.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'to_date',
				in: 'query',
				required: false,
				description:
					'End date for the comparison period. Format <code>yyyy-mm-dd</code>.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'period',
				in: 'query',
				required: false,
				description:
					'Period granularity. Allowed Values: <code>monthly</code>, <code>half-yearly</code>, <code>yearly</code>, and <code>quarterly</code>. Default value is <code>monthly</code>.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/get-register-budget-vs-actuals-response',
				},
			},
		],
		scopes: ['ZohoBooks.accountants.READ'],
		riskLevel: 'read',
	},
	{
		id: 'bulk_update_register_transactions',
		group: 'registers',
		groupSlug: 'registers',
		name: 'bulkUpdateRegisterTransactions',
		method: 'PUT',
		path: '/registers/{account_id}/transactions/bulkupdate',
		summary: 'Bulk update register transactions',
		description:
			'Bulk update transactions on the account register (for sample, change account, branch, or date on selected entities).',
		docsUrl: 'https://www.zoho.com/books/api/v3/registers/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the chart of accounts register (general ledger account).',
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
				name: 'from_account_id',
				in: 'query',
				required: false,
				description:
					'When <code>true</code>, indicates the update is initiated from another account context.',
				schema: { type: 'boolean' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: {
				$ref: '#/components/schemas/bulk-update-register-transactions-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/bulk-update-register-transactions-response',
				},
			},
		],
		scopes: ['ZohoBooks.accountants.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'bulk_delete_register_transactions',
		group: 'registers',
		groupSlug: 'registers',
		name: 'bulkDeleteRegisterTransactions',
		method: 'PUT',
		path: '/registers/{account_id}/transactions/bulkdelete',
		summary: 'Bulk delete register transactions',
		description: 'Bulk delete selected transactions on the account register.',
		docsUrl: 'https://www.zoho.com/books/api/v3/registers/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the chart of accounts register (general ledger account).',
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
				$ref: '#/components/schemas/bulk-delete-register-transactions-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/bulk-delete-register-transactions-response',
				},
			},
		],
		scopes: ['ZohoBooks.accountants.UPDATE'],
		riskLevel: 'destructive',
	},
] as const satisfies readonly ZohoBooksOperationDefinition[];
