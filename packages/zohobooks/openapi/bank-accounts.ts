import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas = {
	account_code: { description: 'Code of the Account', type: 'string' },
	account_id: {
		description: 'ID of the Bank/Credit Card account',
		type: 'string',
	},
	account_name: { description: 'Name of the account', type: 'string' },
	account_number: {
		description: 'Number associated with the Bank Account',
		type: 'string',
	},
	account_type: { description: 'Type of the account', type: 'string' },
	'activate-account-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'add-bank-reconciliation-attachment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	amount: {
		description: 'Amount involved in the transaction',
		type: 'number',
		format: 'double',
	},
	balance: {
		description: 'Balance present in the account',
		type: 'number',
		format: 'double',
	},
	bank_balance: { description: 'Balance present in the Bank', type: 'integer' },
	bank_name: { description: 'Name of the Bank', type: 'string' },
	bankaccount: {
		type: 'object',
		properties: {
			account_id: { $ref: '#/components/schemas/account_id' },
			account_name: { $ref: '#/components/schemas/account_name' },
			account_code: { $ref: '#/components/schemas/account_code' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			currency_code: { $ref: '#/components/schemas/currency_code' },
			currency_symbol: { $ref: '#/components/schemas/currency_symbol' },
			price_precision: { $ref: '#/components/schemas/price_precision' },
			account_type: { $ref: '#/components/schemas/account_type' },
			account_number: { $ref: '#/components/schemas/account_number' },
			uncategorized_transactions: {
				$ref: '#/components/schemas/uncategorized_transactions',
			},
			total_unprinted_checks: {
				$ref: '#/components/schemas/total_unprinted_checks',
			},
			is_active: { $ref: '#/components/schemas/is_active' },
			is_feeds_subscribed: { $ref: '#/components/schemas/is_feeds_subscribed' },
			is_feeds_active: { $ref: '#/components/schemas/is_feeds_active' },
			balance: { $ref: '#/components/schemas/balance' },
			bank_balance: { $ref: '#/components/schemas/bank_balance' },
			bcy_balance: { $ref: '#/components/schemas/bcy_balance' },
			bank_name: { $ref: '#/components/schemas/bank_name' },
			routing_number: { $ref: '#/components/schemas/routing_number' },
			is_primary_account: { $ref: '#/components/schemas/is_primary_account' },
			is_paypal_account: { $ref: '#/components/schemas/is_paypal_account' },
			description: { $ref: '#/components/schemas/description' },
			refresh_status_code: { $ref: '#/components/schemas/refresh_status_code' },
			feeds_last_refresh_date: {
				$ref: '#/components/schemas/feeds_last_refresh_date',
			},
			service_id: { $ref: '#/components/schemas/service_id' },
			is_system_account: { $ref: '#/components/schemas/is_system_account' },
			is_show_warning_for_feeds_refresh: {
				$ref: '#/components/schemas/is_show_warning_for_feeds_refresh',
			},
		},
	},
	bcy_balance: {
		description: 'Balance in Base Currency',
		type: 'number',
		format: 'double',
	},
	'create-a-bank-account-request': {
		required: ['account_name', 'account_type'],
		type: 'object',
		properties: {
			account_name: { $ref: '#/components/schemas/account_name' },
			account_type: { $ref: '#/components/schemas/account_type' },
			account_number: { $ref: '#/components/schemas/account_number' },
			account_code: { $ref: '#/components/schemas/account_code' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			currency_code: { $ref: '#/components/schemas/currency_code' },
			description: { $ref: '#/components/schemas/description' },
			bank_name: { $ref: '#/components/schemas/bank_name' },
			routing_number: { $ref: '#/components/schemas/routing_number' },
			is_primary_account: { $ref: '#/components/schemas/is_primary_account' },
			is_paypal_account: { $ref: '#/components/schemas/is_paypal_account' },
			paypal_type: { $ref: '#/components/schemas/paypal_type' },
			paypal_email_address: {
				$ref: '#/components/schemas/paypal_email_address',
			},
		},
	},
	'create-a-bank-account-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			bankaccount: { $ref: '#/components/schemas/bankaccount' },
		},
	},
	'create-bank-reconciliation-request': {
		type: 'object',
		properties: {
			start_date: {
				type: 'string',
				description: 'Start date of the statement period. Format [yyyy-mm-dd].',
			},
			end_date: {
				type: 'string',
				description: 'End date of the statement period. Format [yyyy-mm-dd].',
			},
			closing_balance: {
				type: 'number',
				description: 'Closing balance as per the bank statement.',
			},
			save_option: {
				type: 'string',
				description:
					'Whether to save the reconciliation as a draft or reconcile it.',
			},
			transactions_to_be_reconciled: {
				type: 'array',
				description: 'Transactions to mark as reconciled.',
				items: {
					type: 'object',
					properties: {
						transaction_id: {
							type: 'string',
							description: 'Unique identifier of the transaction to reconcile.',
						},
					},
				},
			},
		},
	},
	'create-bank-reconciliation-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	currency_code: {
		description: 'Code of the currency associated with the Bank Account',
		type: 'string',
	},
	currency_id: {
		description: 'ID of the Currency associated with the Account',
		type: 'string',
	},
	currency_symbol: {
		description: 'Symbol of the Currency associated with the Account',
		type: 'string',
	},
	customer_id: {
		description: 'ID of the Customer involved in the transaction',
		type: 'string',
	},
	date: { description: 'Date of the transaction', type: 'string' },
	'deactivate-account-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	debit_or_credit: {
		description: 'Indicates if transaction is  Debit or Credit',
		type: 'string',
	},
	'delete-an-account-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-bank-reconciliation-document-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-bank-reconciliation-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-last-imported-statement-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	description: { description: 'Description of the Account', type: 'string' },
	end_date: {
		description: 'Greatest date in the transaction set',
		type: 'string',
	},
	feeds_last_refresh_date: {
		description: 'Last Refreshed Date of the Feeds',
		type: 'string',
	},
	from_date: { description: 'From Date of the Last Import', type: 'string' },
	'get-account-details-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			bankaccount: { $ref: '#/components/schemas/bankaccount' },
		},
	},
	'get-bank-account-balance-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-bank-account-balances-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-bank-account-insights-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-bank-account-overview-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-bank-account-preferences-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-bank-account-statement-summary-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-bank-accounts-overview-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-bank-reconciliation-document-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-bank-reconciliation-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-bank-statement-import-encryption-key-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-last-imported-statement-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			statement: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						statement_id: { $ref: '#/components/schemas/statement_id' },
						from_date: { $ref: '#/components/schemas/from_date' },
						to_date: { $ref: '#/components/schemas/to_date' },
						source: { $ref: '#/components/schemas/source' },
						transactions: { $ref: '#/components/schemas/transactions' },
					},
				},
			},
		},
	},
	'import-a-bankcredit-card-statement-request': {
		required: ['account_id', 'transactions'],
		type: 'object',
		properties: {
			account_id: { $ref: '#/components/schemas/account_id' },
			start_date: { $ref: '#/components/schemas/start_date' },
			end_date: { $ref: '#/components/schemas/end_date' },
			transactions: {
				type: 'array',
				description: 'List of bank statement transactions to be imported.',
				items: {
					type: 'object',
					required: ['date', 'debit_or_credit', 'amount'],
					properties: {
						transaction_id: {
							description: 'Unique ID that is specific to the transaction',
							type: 'string',
						},
						date: { $ref: '#/components/schemas/date' },
						debit_or_credit: { $ref: '#/components/schemas/debit_or_credit' },
						amount: { $ref: '#/components/schemas/amount' },
						payee: { $ref: '#/components/schemas/payee' },
						description: {
							description: 'Transaction description',
							type: 'string',
						},
						reference_number: { $ref: '#/components/schemas/reference_number' },
					},
				},
			},
		},
	},
	'import-a-bankcredit-card-statement-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	is_active: { description: 'Check if Account is Active', type: 'boolean' },
	is_feeds_active: {
		description: 'Check if feeds are active',
		type: 'boolean',
	},
	is_feeds_subscribed: {
		description: 'Check is feeds are subscribed',
		type: 'boolean',
	},
	is_paypal_account: {
		description: 'Check if the Account is Paypal Account',
		type: 'boolean',
	},
	is_primary_account: {
		description: 'Check if the Account is Primary Account in Zoho Books',
		type: 'boolean',
	},
	is_show_warning_for_feeds_refresh: {
		description: 'Check if warning should be shown for refreshing Bank Feeds',
		type: 'boolean',
	},
	is_system_account: {
		description: 'Check if the account is a system account',
		type: 'boolean',
	},
	'list-bank-account-balances-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'list-bank-account-statements-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'list-bank-account-subaccounts-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'list-bank-account-transactions-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'list-bank-reconciliations-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'list-unreviewed-bank-statements-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'list-view-of-accounts-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			bankaccounts: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						account_id: { $ref: '#/components/schemas/account_id' },
						account_name: { $ref: '#/components/schemas/account_name' },
						account_code: { $ref: '#/components/schemas/account_code' },
						currency_id: { $ref: '#/components/schemas/currency_id' },
						currency_code: { $ref: '#/components/schemas/currency_code' },
						account_type: { $ref: '#/components/schemas/account_type' },
						account_number: { $ref: '#/components/schemas/account_number' },
						uncategorized_transactions: {
							$ref: '#/components/schemas/uncategorized_transactions',
						},
						total_unprinted_checks: {
							$ref: '#/components/schemas/total_unprinted_checks',
						},
						is_active: { $ref: '#/components/schemas/is_active' },
						balance: { $ref: '#/components/schemas/balance' },
						bank_balance: { $ref: '#/components/schemas/bank_balance' },
						bcy_balance: { $ref: '#/components/schemas/bcy_balance' },
						bank_name: { $ref: '#/components/schemas/bank_name' },
						routing_number: { $ref: '#/components/schemas/routing_number' },
						is_primary_account: {
							$ref: '#/components/schemas/is_primary_account',
						},
						is_paypal_account: {
							$ref: '#/components/schemas/is_paypal_account',
						},
					},
				},
			},
		},
	},
	payee: { description: 'Payee involved in the transaction', type: 'string' },
	paypal_email_address: {
		description: 'Email Address of the Paypal account.',
		type: 'string',
	},
	paypal_type: {
		description:
			'The type of Payment for the Paypal Account. Allowed Values : <code>standard</code> and <code>adaptive</code>',
		type: 'string',
	},
	price_precision: {
		description: 'Precision of the Price Values',
		type: 'integer',
	},
	reference_number: {
		description: 'Reference Number of the transaction',
		type: 'string',
	},
	refresh_status_code: {
		description: 'Refresh Status Code of the Bank',
		type: 'string',
	},
	routing_number: {
		description: 'Routing Number of the Account',
		type: 'string',
	},
	'save-bank-reconciliation-draft-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	service_id: { description: 'Service ID of the Account', type: 'string' },
	source: { description: 'Source of the Import', type: 'string' },
	start_date: {
		description: 'Least date in the transaction set',
		type: 'string',
	},
	statement_id: { description: 'ID of the Statement Imported', type: 'string' },
	status: { description: 'Status of the transaction', type: 'string' },
	to_date: { description: 'To Date of the Last Import', type: 'string' },
	total_unprinted_checks: {
		description: 'Number of unprinted checks.',
		type: 'integer',
	},
	transaction_id: { description: 'ID of the transaction', type: 'string' },
	transaction_type: {
		description: 'Transaction Type of the transaction',
		type: 'string',
	},
	transactions: {
		type: 'array',
		description: 'List of transactions imported through the statement',
		items: {
			type: 'object',
			properties: {
				transaction_id: { $ref: '#/components/schemas/transaction_id' },
				debit_or_credit: { $ref: '#/components/schemas/debit_or_credit' },
				date: { $ref: '#/components/schemas/date' },
				customer_id: { $ref: '#/components/schemas/customer_id' },
				payee: { $ref: '#/components/schemas/payee' },
				reference_number: { $ref: '#/components/schemas/reference_number' },
				transaction_type: { $ref: '#/components/schemas/transaction_type' },
				amount: { $ref: '#/components/schemas/amount' },
				status: { $ref: '#/components/schemas/status' },
			},
		},
	},
	uncategorized_transactions: {
		description: 'Number of uncategorized transactions',
		type: 'integer',
	},
	'update-bank-account-preferences-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'update-bank-account-request': {
		required: ['account_name', 'account_type'],
		type: 'object',
		properties: {
			account_name: { $ref: '#/components/schemas/account_name' },
			account_type: { $ref: '#/components/schemas/account_type' },
			account_number: { $ref: '#/components/schemas/account_number' },
			account_code: { $ref: '#/components/schemas/account_code' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			currency_code: { $ref: '#/components/schemas/currency_code' },
			description: { $ref: '#/components/schemas/description' },
			bank_name: { $ref: '#/components/schemas/bank_name' },
			routing_number: { $ref: '#/components/schemas/routing_number' },
			is_primary_account: { $ref: '#/components/schemas/is_primary_account' },
			is_paypal_account: { $ref: '#/components/schemas/is_paypal_account' },
			paypal_type: { $ref: '#/components/schemas/paypal_type' },
			paypal_email_address: {
				$ref: '#/components/schemas/paypal_email_address',
			},
		},
	},
	'update-bank-account-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			bankaccount: { $ref: '#/components/schemas/bankaccount' },
		},
	},
	'update-bank-reconciliation-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
} as const satisfies Record<string, JsonValue>;

export const operations = [
	{
		id: 'create_bank_account',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'createBankAccount',
		method: 'POST',
		path: '/bankaccounts',
		summary: 'Create a bank account',
		description:
			'Create a bank account or a credit card account for your organization.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
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
			schema: { $ref: '#/components/schemas/create-a-bank-account-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/create-a-bank-account-response' },
			},
		],
		scopes: ['ZohoBooks.banking.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_bank_accounts',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'listBankAccounts',
		method: 'GET',
		path: '/bankaccounts',
		summary: 'List view of accounts',
		description:
			'List all bank and credit card accounts for your organization.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
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
					'Filter the account by their status. Allowed Values: <code>Status.All</code>, <code>Status.Active</code> and <code>Status.Inactive</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description:
					'Sort the values based on the allowed values. Allowed Values: <code>account_name</code>,<code>account_type</code> and <code>account_code</code>.',
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
				schema: { $ref: '#/components/schemas/list-view-of-accounts-response' },
			},
		],
		scopes: ['ZohoBooks.banking.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_bank_account',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'updateBankAccount',
		method: 'PUT',
		path: '/bankaccounts/{account_id}',
		summary: 'Update bank account',
		description: 'Modify the account that was created.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bank account.',
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
			schema: { $ref: '#/components/schemas/update-bank-account-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-bank-account-response' },
			},
		],
		scopes: ['ZohoBooks.banking.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_bank_account',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'getBankAccount',
		method: 'GET',
		path: '/bankaccounts/{account_id}',
		summary: 'Get account details',
		description: 'Get a detailed look of the account specified.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bank account.',
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
				schema: { $ref: '#/components/schemas/get-account-details-response' },
			},
		],
		scopes: ['ZohoBooks.banking.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_bank_account',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'deleteBankAccount',
		method: 'DELETE',
		path: '/bankaccounts/{account_id}',
		summary: 'Delete an account',
		description: 'Delete a bank account from your organization.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bank account.',
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
		scopes: ['ZohoBooks.banking.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'mark_bank_account_inactive',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'markBankAccountInactive',
		method: 'POST',
		path: '/bankaccounts/{account_id}/inactive',
		summary: 'Deactivate account.',
		description: 'Make an account inactive.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bank account.',
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
				schema: { $ref: '#/components/schemas/deactivate-account-response' },
			},
		],
		scopes: ['ZohoBooks.banking.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_bank_account_active',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'markBankAccountActive',
		method: 'POST',
		path: '/bankaccounts/{account_id}/active',
		summary: 'Activate account',
		description: 'Make an account active.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bank account.',
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
				schema: { $ref: '#/components/schemas/activate-account-response' },
			},
		],
		scopes: ['ZohoBooks.banking.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'import_bank_statements',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'importBankStatements',
		method: 'POST',
		path: '/bankstatements',
		summary: 'Import a Bank/Credit Card Statement',
		description: 'Import your bank/credit card feeds into your account.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
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
			schema: {
				$ref: '#/components/schemas/import-a-bankcredit-card-statement-request',
			},
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/import-a-bankcredit-card-statement-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_last_imported_bank_statement',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'getLastImportedBankStatement',
		method: 'GET',
		path: '/bankaccounts/{account_id}/statement/lastimported',
		summary: 'Get last imported statement',
		description:
			'Get the details of previously imported statement for the account.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bank account.',
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
					$ref: '#/components/schemas/get-last-imported-statement-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_last_imported_bank_statement',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'deleteLastImportedBankStatement',
		method: 'DELETE',
		path: '/bankaccounts/{account_id}/statement/{statement_id}',
		summary: 'Delete last imported statement',
		description: 'Delete the statement that was previously imported.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bank account.',
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
				name: 'statement_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bank statement.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/delete-last-imported-statement-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'list_bank_reconciliations',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'listBankReconciliations',
		method: 'GET',
		path: '/bankaccounts/{account_id}/reconciliations',
		summary: 'List bank reconciliations',
		description: 'List the reconciliations of a bank account.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the bank account. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/list-bank-reconciliations-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.READ'],
		riskLevel: 'read',
	},
	{
		id: 'create_bank_reconciliation',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'createBankReconciliation',
		method: 'POST',
		path: '/bankaccounts/{account_id}/reconciliations',
		summary: 'Create a bank reconciliation',
		description:
			'Reconcile the transactions of a bank account for a statement period.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the bank account. Note: This value is a set of numeric characters.',
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
			schema: {
				$ref: '#/components/schemas/create-bank-reconciliation-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/create-bank-reconciliation-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_bank_reconciliation',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'getBankReconciliation',
		method: 'GET',
		path: '/bankaccounts/{account_id}/reconciliations/{reconciliation_id}',
		summary: 'Get a bank reconciliation',
		description: 'Retrieve the details of a bank reconciliation.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the bank account. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'reconciliation_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the reconciliation. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/get-bank-reconciliation-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_bank_reconciliation',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'updateBankReconciliation',
		method: 'PUT',
		path: '/bankaccounts/{account_id}/reconciliations/{reconciliation_id}',
		summary: 'Update a bank reconciliation',
		description: 'Update a bank reconciliation.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the bank account. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'reconciliation_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the reconciliation. Note: This value is a set of numeric characters.',
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
			schema: {
				$ref: '#/components/schemas/create-bank-reconciliation-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-bank-reconciliation-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_bank_reconciliation',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'deleteBankReconciliation',
		method: 'DELETE',
		path: '/bankaccounts/{account_id}/reconciliations/{reconciliation_id}',
		summary: 'Delete a bank reconciliation',
		description: 'Delete a bank reconciliation.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the bank account. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'reconciliation_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the reconciliation. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/delete-bank-reconciliation-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'save_bank_reconciliation_draft',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'saveBankReconciliationDraft',
		method: 'PUT',
		path: '/bankaccounts/{account_id}/reconciliations/{reconciliation_id}/draft',
		summary: 'Save a bank reconciliation as draft',
		description: 'Save the progress of a bank reconciliation as a draft.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the bank account. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'reconciliation_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the reconciliation. Note: This value is a set of numeric characters.',
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
			schema: {
				$ref: '#/components/schemas/create-bank-reconciliation-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/save-bank-reconciliation-draft-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'add_bank_reconciliation_attachment',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'addBankReconciliationAttachment',
		method: 'POST',
		path: '/bankaccounts/{account_id}/reconciliations/{reconciliation_id}/attachment',
		summary: 'Add a reconciliation attachment',
		description: 'Attach a file to a bank reconciliation.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the bank account. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'reconciliation_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the reconciliation. Note: This value is a set of numeric characters.',
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
				name: 'attachment',
				in: 'query',
				required: false,
				description: 'The file to attach, sent as a multipart part.',
				schema: { type: 'string', format: 'binary' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/add-bank-reconciliation-attachment-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_bank_reconciliation_document',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'getBankReconciliationDocument',
		method: 'GET',
		path: '/bankaccounts/{account_id}/reconciliations/{reconciliation_id}/documents/{document_id}',
		summary: 'Get a reconciliation document',
		description: 'Retrieve a document attached to a bank reconciliation.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the bank account. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'reconciliation_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the reconciliation. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'document_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the document. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/get-bank-reconciliation-document-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_bank_reconciliation_document',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'deleteBankReconciliationDocument',
		method: 'DELETE',
		path: '/bankaccounts/{account_id}/reconciliations/{reconciliation_id}/documents/{document_id}',
		summary: 'Delete a reconciliation document',
		description: 'Delete a document attached to a bank reconciliation.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the bank account. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'reconciliation_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the reconciliation. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'document_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the document. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/delete-bank-reconciliation-document-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'list_bank_account_balances',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'listBankAccountBalances',
		method: 'GET',
		path: '/bankaccounts/balances',
		summary: 'List bank account balances',
		description: 'Retrieve the balances of all bank accounts.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
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
					$ref: '#/components/schemas/list-bank-account-balances-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.READ'],
		riskLevel: 'read',
	},
	{
		id: 'get_bank_accounts_overview',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'getBankAccountsOverview',
		method: 'GET',
		path: '/bankaccounts/overview',
		summary: 'Get bank accounts overview',
		description: 'Retrieve an overview of all bank accounts.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
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
					$ref: '#/components/schemas/get-bank-accounts-overview-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.READ'],
		riskLevel: 'read',
	},
	{
		id: 'get_bank_account_balance',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'getBankAccountBalance',
		method: 'GET',
		path: '/bankaccounts/{account_id}/balance',
		summary: 'Get a bank account balance',
		description: 'Retrieve the balance of a bank account.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the bank account. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/get-bank-account-balance-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.READ'],
		riskLevel: 'read',
	},
	{
		id: 'get_bank_account_balances',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'getBankAccountBalances',
		method: 'GET',
		path: '/bankaccounts/{account_id}/balances',
		summary: 'Get bank account balances',
		description: 'Retrieve the balance breakdown of a bank account.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the bank account. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/get-bank-account-balances-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.READ'],
		riskLevel: 'read',
	},
	{
		id: 'get_bank_account_insights',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'getBankAccountInsights',
		method: 'GET',
		path: '/bankaccounts/{account_id}/insights',
		summary: 'Get bank account insights',
		description: 'Retrieve cash-flow insights for a bank account.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the bank account. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/get-bank-account-insights-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.READ'],
		riskLevel: 'read',
	},
	{
		id: 'get_bank_account_overview',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'getBankAccountOverview',
		method: 'GET',
		path: '/bankaccounts/{account_id}/overview',
		summary: 'Get a bank account overview',
		description: 'Retrieve an overview of a bank account.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the bank account. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/get-bank-account-overview-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.READ'],
		riskLevel: 'read',
	},
	{
		id: 'get_bank_account_statement_summary',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'getBankAccountStatementSummary',
		method: 'GET',
		path: '/bankaccounts/{account_id}/statementsummary',
		summary: 'Get a bank statement summary',
		description: 'Retrieve the statement summary of a bank account.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the bank account. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/get-bank-account-statement-summary-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.READ'],
		riskLevel: 'read',
	},
	{
		id: 'list_bank_account_subaccounts',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'listBankAccountSubaccounts',
		method: 'GET',
		path: '/bankaccounts/{account_id}/subaccounts',
		summary: 'List bank account sub-accounts',
		description: 'List the sub-accounts of a bank account.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the bank account. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/list-bank-account-subaccounts-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.READ'],
		riskLevel: 'read',
	},
	{
		id: 'list_bank_account_statements',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'listBankAccountStatements',
		method: 'GET',
		path: '/bankaccounts/{account_id}/statements',
		summary: 'List bank account statements',
		description: 'List the imported statements of a bank account.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the bank account. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/list-bank-account-statements-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.READ'],
		riskLevel: 'read',
	},
	{
		id: 'list_unreviewed_bank_statements',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'listUnreviewedBankStatements',
		method: 'GET',
		path: '/bankaccounts/{account_id}/statements/unreviewed',
		summary: 'List unreviewed bank statements',
		description:
			'List the unreviewed statement transactions of a bank account.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the bank account. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/list-unreviewed-bank-statements-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.READ'],
		riskLevel: 'read',
	},
	{
		id: 'list_bank_account_transactions',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'listBankAccountTransactions',
		method: 'GET',
		path: '/bankaccounts/{account_id}/transactions',
		summary: 'List bank account transactions',
		description: 'List the transactions of a bank account.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the bank account. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/list-bank-account-transactions-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.READ'],
		riskLevel: 'read',
	},
	{
		id: 'get_bank_account_preferences',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'getBankAccountPreferences',
		method: 'GET',
		path: '/bankaccounts/{account_id}/preferences',
		summary: 'Get bank account preferences',
		description: 'Retrieve the preferences of a bank account.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the bank account. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/get-bank-account-preferences-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_bank_account_preferences',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'updateBankAccountPreferences',
		method: 'PUT',
		path: '/bankaccounts/{account_id}/preferences',
		summary: 'Update bank account preferences',
		description: 'Update the preferences of a bank account.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
		parameters: [
			{
				name: 'account_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the bank account. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/update-bank-account-preferences-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_bank_statement_import_encryption_key',
		group: 'bankAccounts',
		groupSlug: 'bank-accounts',
		name: 'getBankStatementImportEncryptionKey',
		method: 'GET',
		path: '/bankaccounts/import/encryptionkey',
		summary: 'Get bank statement import encryption key',
		description:
			'Retrieve the public key used to encrypt bank statement files before import.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-accounts/',
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
					$ref: '#/components/schemas/get-bank-statement-import-encryption-key-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.READ'],
		riskLevel: 'read',
	},
] as const satisfies readonly ZohoBooksOperationDefinition[];
