import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas = {
	account_code: {
		description: 'Code Associated with the Account',
		type: 'string',
	},
	account_id: { description: 'ID of the Account', type: 'string' },
	account_name: { description: 'Name of the account', type: 'string' },
	account_type: {
		description:
			'Type of the account. Allowed Values: <code>other_asset</code>, <code>other_current_asset</code>, <code>cash</code>, <code>bank</code>, <code>fixed_asset</code>, <code>other_current_liability</code>, <code>credit_card</code>, <code>long_term_liability</code>, <code>equity</code>, <code>income</code>, <code>other_income</code>, <code>expense</code>, <code>cost_of_goods_sold</code>, <code>other_expense</code>, <code>accounts_receivable</code>, <code>accounts_payable</code> and more.',
		type: 'string',
	},
	can_show_in_ze: {
		description: 'Whether the account can be shown in Zoho Expense.',
		type: 'boolean',
	},
	categorized_transaction_id: { type: 'string' },
	chart_of_account: {
		type: 'object',
		properties: {
			account_id: { $ref: '#/components/schemas/account_id' },
			account_name: { $ref: '#/components/schemas/account_name' },
			account_code: { $ref: '#/components/schemas/account_code' },
			is_active: { $ref: '#/components/schemas/is_active' },
			account_type: { $ref: '#/components/schemas/account_type' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			currency_code: { $ref: '#/components/schemas/currency_code' },
			description: { $ref: '#/components/schemas/description' },
			is_system_account: { $ref: '#/components/schemas/is_system_account' },
			is_involved_in_transaction: {
				$ref: '#/components/schemas/is_involved_in_transaction',
			},
			can_show_in_ze: { $ref: '#/components/schemas/can_show_in_ze' },
			include_in_vat_return: {
				$ref: '#/components/schemas/include_in_vat_return',
			},
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			parent_account_id: { $ref: '#/components/schemas/parent_account_id' },
			documents: { $ref: '#/components/schemas/documents' },
			created_time: { $ref: '#/components/schemas/created_time' },
			last_modified_time: { $ref: '#/components/schemas/last_modified_time' },
		},
	},
	child_count: { type: 'string' },
	closing_balance: {
		description: 'Closing balances of the account',
		type: 'number',
		format: 'double',
	},
	'create-an-account-request': {
		type: 'object',
		properties: {
			account_name: { $ref: '#/components/schemas/account_name' },
			account_code: { $ref: '#/components/schemas/account_code' },
			account_type: { $ref: '#/components/schemas/account_type' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			description: { $ref: '#/components/schemas/description' },
			show_on_dashboard: { $ref: '#/components/schemas/show_on_dashboard' },
			can_show_in_ze: { $ref: '#/components/schemas/can_show_in_ze' },
			include_in_vat_return: {
				$ref: '#/components/schemas/include_in_vat_return',
			},
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			parent_account_id: { $ref: '#/components/schemas/parent_account_id' },
		},
	},
	'create-an-account-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			chart_of_account: { $ref: '#/components/schemas/chart_of_account' },
		},
	},
	created_time: {
		description: 'Created Time associated with the Entity',
		type: 'string',
	},
	credit_amount: { type: 'number', format: 'double' },
	currency_code: {
		description: 'Code of the Currency Associated with the Account',
		type: 'string',
	},
	currency_id: { description: 'ID of the account currency.', type: 'string' },
	current_balance: { description: 'Current Balance in the account' },
	custom_fields: {
		description: 'List of custom fields for the account.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				customfield_id: { $ref: '#/components/schemas/customfield_id' },
				value: { $ref: '#/components/schemas/value' },
			},
		},
	},
	customer_id: { type: 'string' },
	customfield_id: { description: 'ID of the Custom Field', type: 'string' },
	debit_amount: { type: 'string' },
	debit_or_credit: { type: 'string' },
	'delete-a-transaction-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-an-account-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	depth: { type: 'integer' },
	description: { description: 'Description of the account', type: 'string' },
	documents: { type: 'array', items: { type: 'string' } },
	entry_number: { type: 'string' },
	'get-an-account-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			account_id: { $ref: '#/components/schemas/account_id' },
			account_name: { $ref: '#/components/schemas/account_name' },
			account_code: { $ref: '#/components/schemas/account_code' },
			is_active: { $ref: '#/components/schemas/is_active' },
			account_type: { $ref: '#/components/schemas/account_type' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			currency_code: { $ref: '#/components/schemas/currency_code' },
			description: { $ref: '#/components/schemas/description' },
			is_system_account: { $ref: '#/components/schemas/is_system_account' },
			is_involved_in_transaction: {
				$ref: '#/components/schemas/is_involved_in_transaction',
			},
			can_show_in_ze: { $ref: '#/components/schemas/can_show_in_ze' },
			include_in_vat_return: {
				$ref: '#/components/schemas/include_in_vat_return',
			},
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			closing_balance: { $ref: '#/components/schemas/closing_balance' },
			parent_account_id: { $ref: '#/components/schemas/parent_account_id' },
			documents: { $ref: '#/components/schemas/documents' },
			created_time: { $ref: '#/components/schemas/created_time' },
			last_modified_time: { $ref: '#/components/schemas/last_modified_time' },
		},
	},
	has_attachment: {
		description: 'Check if the entity has attachment',
		type: 'boolean',
	},
	include_in_vat_return: {
		description: 'Boolean to include an account in VAT returns.',
		type: 'boolean',
		'x-node_available_in': ['uk'],
		'x-node_unavailable_in': [],
	},
	is_active: {
		description: 'Check if account is Active or Inactive',
		type: 'boolean',
	},
	is_child_present: {
		description: 'Check if a child account is present for the Account',
		type: 'boolean',
	},
	is_involved_in_transaction: {
		description: 'Check if account is involved in transaction',
		type: 'boolean',
	},
	is_standalone_account: {
		description: 'Check if it is an Standalone Account',
		type: 'boolean',
	},
	is_system_account: {
		description: 'Check if it is an System Account',
		type: 'boolean',
	},
	is_user_created: {
		description: 'Check if it is an User Created Account',
		type: 'boolean',
	},
	last_modified_time: {
		description: 'Last Modified time associated with the entity',
		type: 'string',
	},
	'list-chart-of-accounts-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			chartofaccounts: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						account_id: { $ref: '#/components/schemas/account_id' },
						account_name: { $ref: '#/components/schemas/account_name' },
						account_code: { $ref: '#/components/schemas/account_code' },
						account_type: { $ref: '#/components/schemas/account_type' },
						is_user_created: { $ref: '#/components/schemas/is_user_created' },
						is_system_account: {
							$ref: '#/components/schemas/is_system_account',
						},
						is_standalone_account: {
							$ref: '#/components/schemas/is_standalone_account',
						},
						is_active: { $ref: '#/components/schemas/is_active' },
						can_show_in_ze: { $ref: '#/components/schemas/can_show_in_ze' },
						is_involved_in_transaction: {
							$ref: '#/components/schemas/is_involved_in_transaction',
						},
						current_balance: { $ref: '#/components/schemas/current_balance' },
						parent_account_id: {
							$ref: '#/components/schemas/parent_account_id',
						},
						parent_account_name: {
							$ref: '#/components/schemas/parent_account_name',
						},
						depth: { $ref: '#/components/schemas/depth' },
						has_attachment: { $ref: '#/components/schemas/has_attachment' },
						is_child_present: { $ref: '#/components/schemas/is_child_present' },
						child_count: { $ref: '#/components/schemas/child_count' },
						documents: { $ref: '#/components/schemas/documents' },
						created_time: { $ref: '#/components/schemas/created_time' },
						last_modified_time: {
							$ref: '#/components/schemas/last_modified_time',
						},
					},
				},
			},
		},
	},
	'list-of-transactions-for-an-account-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			transactions: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						categorized_transaction_id: {
							$ref: '#/components/schemas/categorized_transaction_id',
						},
						transaction_type: { $ref: '#/components/schemas/transaction_type' },
						transaction_status: {
							$ref: '#/components/schemas/transaction_status',
						},
						transaction_source: {
							$ref: '#/components/schemas/transaction_source',
						},
						transaction_id: { $ref: '#/components/schemas/transaction_id' },
						transaction_date: { $ref: '#/components/schemas/transaction_date' },
						account_id: { $ref: '#/components/schemas/account_id' },
						customer_id: { $ref: '#/components/schemas/customer_id' },
						payee: { $ref: '#/components/schemas/payee' },
						description: { $ref: '#/components/schemas/description' },
						entry_number: { $ref: '#/components/schemas/entry_number' },
						currency_id: { $ref: '#/components/schemas/currency_id' },
						currency_code: { $ref: '#/components/schemas/currency_code' },
						debit_or_credit: { $ref: '#/components/schemas/debit_or_credit' },
						offset_account_name: {
							$ref: '#/components/schemas/offset_account_name',
						},
						reference_number: { $ref: '#/components/schemas/reference_number' },
						reconcile_status: { $ref: '#/components/schemas/reconcile_status' },
						debit_amount: { $ref: '#/components/schemas/debit_amount' },
						credit_amount: { $ref: '#/components/schemas/credit_amount' },
					},
				},
			},
		},
	},
	'mark-an-account-as-active-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'mark-an-account-as-inactive-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	offset_account_name: {
		description: 'Name of the Offset Account',
		type: 'string',
	},
	parent_account_id: {
		description: 'ID of the Parent Account',
		type: 'string',
	},
	parent_account_name: {
		description: 'Name of the Parent Account',
		type: 'string',
	},
	payee: { type: 'string' },
	reconcile_status: { type: 'string' },
	reference_number: {
		description: 'Reference Number of the Transaction',
		type: 'string',
	},
	show_on_dashboard: {
		description: 'Whether to show the account balance on the dashboard.',
		type: 'boolean',
	},
	transaction_date: { type: 'string' },
	transaction_id: { type: 'string' },
	transaction_source: {
		description: 'Source of the transaction',
		type: 'string',
	},
	transaction_status: {
		description: 'Status of the Transaction',
		type: 'string',
	},
	transaction_type: {
		description:
			'Search transactions based on the given transaction type. Allowed Values: <code>invoice</code>, <code>customer_payment</code>, <code>bills</code>, <code>vendor_payment</code>, <code>credit_notes</code>, <code>creditnote_refund</code>, <code>expense</code>, <code>card_payment</code>, <code>purchase_or_charges</code>, <code>journal</code>, <code>deposit</code>, <code>refund</code>, <code>transfer_fund</code>, <code>base_currency_adjustment</code>, <code>opening_balance</code>, <code>sales_without_invoices</code>, <code>expense_refund</code>, <code>tax_refund</code>, <code>receipt_from_initial_debtors</code>, <code>owner_contribution</code>, <code>interest_income</code>, <code>other_income</code>, <code>owner_drawings</code> and <code>payment_to_initial_creditors</code>.',
		type: 'string',
	},
	'update-an-account-request': {
		type: 'object',
		properties: {
			account_name: { $ref: '#/components/schemas/account_name' },
			account_code: { $ref: '#/components/schemas/account_code' },
			account_type: { $ref: '#/components/schemas/account_type' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			description: { $ref: '#/components/schemas/description' },
			show_on_dashboard: { $ref: '#/components/schemas/show_on_dashboard' },
			can_show_in_ze: { $ref: '#/components/schemas/can_show_in_ze' },
			include_in_vat_return: {
				$ref: '#/components/schemas/include_in_vat_return',
			},
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			parent_account_id: { $ref: '#/components/schemas/parent_account_id' },
		},
	},
	'update-an-account-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			chart_of_account: { $ref: '#/components/schemas/chart_of_account' },
		},
	},
	value: { description: 'Value of the Custom Field', type: 'string' },
} as const satisfies Record<string, JsonValue>;

export const operations = [
	{
		id: 'create_chart_of_account',
		group: 'chartOfAccounts',
		groupSlug: 'chart-of-accounts',
		name: 'createChartOfAccount',
		method: 'POST',
		path: '/chartofaccounts',
		summary: 'Create an account',
		description: 'Creates an account with the given account type.',
		docsUrl: 'https://www.zoho.com/books/api/v3/chart-of-accounts/',
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
			schema: { $ref: '#/components/schemas/create-an-account-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/create-an-account-response' },
			},
		],
		scopes: ['ZohoBooks.accountants.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_chart_of_accounts',
		group: 'chartOfAccounts',
		groupSlug: 'chart-of-accounts',
		name: 'listChartOfAccounts',
		method: 'GET',
		path: '/chartofaccounts',
		summary: 'List chart of accounts',
		description: 'List all chart of accounts along with pagination.',
		docsUrl: 'https://www.zoho.com/books/api/v3/chart-of-accounts/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'showbalance',
				in: 'query',
				required: false,
				description: 'Boolean to get current balance of accounts.',
				schema: { type: 'boolean' },
			},
			{
				name: 'filter_by',
				in: 'query',
				required: false,
				description:
					'Filter accounts based on its account type and status. Allowed Values: <code>AccountType.All</code>, <code>AccountType.Active</code>, <code>AccountType.Inactive</code>, <code>AccountType.Asset</code>, <code>AccountType.Liability</code>, <code>AccountType.Equity</code>, <code>AccountType.Income</code> and <code>AccountType.Expense</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description:
					'Sort accounts. Allowed Values: <code>account_name</code>, <code>account_type</code> and <code>account_code</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'last_modified_time',
				in: 'query',
				required: false,
				description: 'List accounts modified after the given date and time.',
				schema: { type: 'string' },
			},
			{
				name: 'customview_id',
				in: 'query',
				required: false,
				description: 'ID of the custom view.',
				schema: { type: 'string' },
			},
			{
				name: 'account_id',
				in: 'query',
				required: false,
				description:
					'Search by account ID. Variants: <code>account_id_equal</code>, <code>account_id_not_equal</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'account_code',
				in: 'query',
				required: false,
				description:
					'Search by account code. Variants: <code>account_code_contains</code>, <code>account_code_starts_with</code>, <code>account_code_ends_with</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'account_name',
				in: 'query',
				required: false,
				description:
					'Search by account name. Variants: <code>account_name_contains</code>, <code>account_name_starts_with</code>, <code>account_name_ends_with</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'search_text',
				in: 'query',
				required: false,
				description: 'Search accounts by account name or code.',
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
					$ref: '#/components/schemas/list-chart-of-accounts-response',
				},
			},
		],
		scopes: ['ZohoBooks.accountants.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_chart_of_account',
		group: 'chartOfAccounts',
		groupSlug: 'chart-of-accounts',
		name: 'updateChartOfAccount',
		method: 'PUT',
		path: '/chartofaccounts/{account_id}',
		summary: 'Update an account',
		description: 'Updates the account information.',
		docsUrl: 'https://www.zoho.com/books/api/v3/chart-of-accounts/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the account.',
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
			schema: { $ref: '#/components/schemas/update-an-account-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-an-account-response' },
			},
		],
		scopes: ['ZohoBooks.accountants.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_chart_of_account',
		group: 'chartOfAccounts',
		groupSlug: 'chart-of-accounts',
		name: 'getChartOfAccount',
		method: 'GET',
		path: '/chartofaccounts/{account_id}',
		summary: 'Get an account',
		description: 'Gets the details of an account.',
		docsUrl: 'https://www.zoho.com/books/api/v3/chart-of-accounts/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the account.',
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
				schema: { $ref: '#/components/schemas/get-an-account-response' },
			},
		],
		scopes: ['ZohoBooks.accountants.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_chart_of_account',
		group: 'chartOfAccounts',
		groupSlug: 'chart-of-accounts',
		name: 'deleteChartOfAccount',
		method: 'DELETE',
		path: '/chartofaccounts/{account_id}',
		summary: 'Delete an account',
		description:
			'Deletes the given account. Accounts associated in any transaction/products could not be deleted.',
		docsUrl: 'https://www.zoho.com/books/api/v3/chart-of-accounts/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the account.',
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
				schema: { $ref: '#/components/schemas/delete-an-account-response' },
			},
		],
		scopes: ['ZohoBooks.accountants.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'mark_chart_of_account_active',
		group: 'chartOfAccounts',
		groupSlug: 'chart-of-accounts',
		name: 'markChartOfAccountActive',
		method: 'POST',
		path: '/chartofaccounts/{account_id}/active',
		summary: 'Mark an account as active',
		description: 'Updates the account status as active.',
		docsUrl: 'https://www.zoho.com/books/api/v3/chart-of-accounts/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the account.',
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
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/mark-an-account-as-active-response',
				},
			},
		],
		scopes: ['ZohoBooks.accountants.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_chart_of_account_inactive',
		group: 'chartOfAccounts',
		groupSlug: 'chart-of-accounts',
		name: 'markChartOfAccountInactive',
		method: 'POST',
		path: '/chartofaccounts/{account_id}/inactive',
		summary: 'Mark an account as inactive',
		description: 'Updates the account status as inactive.',
		docsUrl: 'https://www.zoho.com/books/api/v3/chart-of-accounts/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the account.',
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
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/mark-an-account-as-inactive-response',
				},
			},
		],
		scopes: ['ZohoBooks.accountants.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'bulk_mark_chart_of_accounts_active',
		group: 'chartOfAccounts',
		groupSlug: 'chart-of-accounts',
		name: 'bulkMarkChartOfAccountsActive',
		method: 'POST',
		path: '/chartofaccounts/active',
		summary: 'Bulk mark accounts as active',
		description: 'Marks multiple accounts as active.',
		docsUrl: 'https://www.zoho.com/books/api/v3/chart-of-accounts/',
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
				description: 'Comma separated account IDs to be marked as active.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/mark-an-account-as-active-response',
				},
			},
		],
		scopes: ['ZohoBooks.accountants.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'bulk_mark_chart_of_accounts_inactive',
		group: 'chartOfAccounts',
		groupSlug: 'chart-of-accounts',
		name: 'bulkMarkChartOfAccountsInactive',
		method: 'POST',
		path: '/chartofaccounts/inactive',
		summary: 'Bulk mark accounts as inactive',
		description: 'Marks multiple accounts as inactive.',
		docsUrl: 'https://www.zoho.com/books/api/v3/chart-of-accounts/',
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
				description: 'Comma separated account IDs to be marked as inactive.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/mark-an-account-as-inactive-response',
				},
			},
		],
		scopes: ['ZohoBooks.accountants.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'bulk_delete_chart_of_accounts',
		group: 'chartOfAccounts',
		groupSlug: 'chart-of-accounts',
		name: 'bulkDeleteChartOfAccounts',
		method: 'DELETE',
		path: '/chartofaccounts/bulkdelete',
		summary: 'Bulk delete accounts',
		description: 'Deletes multiple accounts.',
		docsUrl: 'https://www.zoho.com/books/api/v3/chart-of-accounts/',
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
				description: 'Comma separated account IDs to be deleted.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/delete-an-account-response' },
			},
		],
		scopes: ['ZohoBooks.accountants.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'list_chart_of_account_transactions',
		group: 'chartOfAccounts',
		groupSlug: 'chart-of-accounts',
		name: 'listChartOfAccountTransactions',
		method: 'GET',
		path: '/chartofaccounts/accounttransactions',
		summary: 'List of transactions for an account',
		description: 'List all involved transactions for the given account.',
		docsUrl: 'https://www.zoho.com/books/api/v3/chart-of-accounts/',
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
				description: 'ID of the Account',
				schema: { type: 'string' },
			},
			{
				name: 'date',
				in: 'query',
				required: false,
				description:
					'Filter account transactions for an exact transaction date. Returns transactions on the specified date. Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'date_start',
				in: 'query',
				required: false,
				description:
					'Filter account transactions with a transaction date on or after the specified date. Useful for defining the start of a date range. Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'date_end',
				in: 'query',
				required: false,
				description:
					'Filter account transactions with a transaction date on or before the specified date. Useful for defining the end of a date range. Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'date_before',
				in: 'query',
				required: false,
				description:
					'Filter account transactions with a transaction date strictly before the specified date (exclusive). Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'date_after',
				in: 'query',
				required: false,
				description:
					'Filter account transactions with a transaction date strictly after the specified date (exclusive). Use yyyy-mm-dd format.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'amount',
				in: 'query',
				required: false,
				description: 'Filter account transactions for an exact amount.',
				schema: { type: 'number', format: 'double' },
			},
			{
				name: 'amount_less_than',
				in: 'query',
				required: false,
				description:
					'Filter account transactions with an amount less than the specified value.',
				schema: { type: 'number', format: 'double' },
			},
			{
				name: 'amount_less_equals',
				in: 'query',
				required: false,
				description:
					'Filter account transactions with an amount less than or equal to the specified value.',
				schema: { type: 'number', format: 'double' },
			},
			{
				name: 'amount_greater_than',
				in: 'query',
				required: false,
				description:
					'Filter account transactions with an amount greater than the specified value.',
				schema: { type: 'number', format: 'double' },
			},
			{
				name: 'amount_greater_equals',
				in: 'query',
				required: false,
				description:
					'Filter account transactions with an amount greater than or equal to the specified value.',
				schema: { type: 'number', format: 'double' },
			},
			{
				name: 'filter_by',
				in: 'query',
				required: false,
				description:
					'Filter transactions. Allowed Values: <code>TransactionType.All</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'transaction_type',
				in: 'query',
				required: false,
				description:
					'Search transactions based on the given transaction type. Allowed Values: <code>invoice</code>, <code>customer_payment</code>, <code>bills</code>, <code>vendor_payment</code>, <code>credit_notes</code>, <code>creditnote_refund</code>, <code>expense</code>, <code>card_payment</code>, <code>purchase_or_charges</code>, <code>journal</code>, <code>deposit</code>, <code>refund</code>, <code>transfer_fund</code>, <code>base_currency_adjustment</code>, <code>opening_balance</code>, <code>sales_without_invoices</code>, <code>expense_refund</code>, <code>tax_refund</code>, <code>receipt_from_initial_debtors</code>, <code>owner_contribution</code>, <code>interest_income</code>, <code>other_income</code>, <code>owner_drawings</code> and <code>payment_to_initial_creditors</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description:
					'Sort transactions. Allowed Values: <code>transaction_date</code>, <code>payee</code>, <code>glname</code>, <code>transaction_type_formatted</code>, <code>reconcile_status</code>, <code>debit_amount</code> and <code>credit_amount</code>.',
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
					$ref: '#/components/schemas/list-of-transactions-for-an-account-response',
				},
			},
		],
		scopes: ['ZohoBooks.accountants.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_chart_of_account_transaction',
		group: 'chartOfAccounts',
		groupSlug: 'chart-of-accounts',
		name: 'deleteChartOfAccountTransaction',
		method: 'DELETE',
		path: '/chartofaccounts/transactions/{transaction_id}',
		summary: 'Delete a transaction',
		description: 'Deletes the transaction.',
		docsUrl: 'https://www.zoho.com/books/api/v3/chart-of-accounts/',
		parameters: [
			{
				name: 'transaction_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the transaction.',
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
				schema: { $ref: '#/components/schemas/delete-a-transaction-response' },
			},
		],
		scopes: ['ZohoBooks.accountants.DELETE'],
		riskLevel: 'destructive',
	},
] as const satisfies readonly ZohoBooksOperationDefinition[];
