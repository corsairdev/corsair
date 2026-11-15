// Response bodies shaped like YNAB's v1 API, with made-up ids and amounts.
// Amounts are milliunits: 12,340 is $12.34.

export const budgetId = 'b1g00000-0000-0000-0000-000000000001';
export const accountId = 'acc00000-0000-0000-0000-000000000001';
export const categoryId = 'cat00000-0000-0000-0000-000000000001';
export const groupId = 'grp00000-0000-0000-0000-000000000001';
export const payeeId = 'pay00000-0000-0000-0000-000000000001';
export const transactionId = 'txn00000-0000-0000-0000-000000000001';
export const scheduledId = 'sch00000-0000-0000-0000-000000000001';
export const userId = 'usr00000-0000-0000-0000-000000000001';

export const budgetSummary = {
	id: budgetId,
	name: 'Household',
	last_modified_on: '2024-06-01T10:00:00Z',
	first_month: '2024-01-01',
	last_month: '2024-12-01',
	date_format: { format: 'MM/DD/YYYY' },
	currency_format: { iso_code: 'USD', example_format: '123,456.78' },
};

export const budgetsList = {
	data: {
		budgets: [budgetSummary],
		default_budget: null,
	},
};

export const account = {
	id: accountId,
	name: 'Checking',
	type: 'checking',
	on_budget: true,
	closed: false,
	note: null,
	// $1,234.56
	balance: 1_234_560,
	cleared_balance: 1_200_000,
	uncleared_balance: 34_560,
	transfer_payee_id: payeeId,
	deleted: false,
};

export const category = {
	id: categoryId,
	category_group_id: groupId,
	category_group_name: 'Everyday',
	name: 'Groceries',
	hidden: false,
	// $300 budgeted, $123.45 spent, $176.55 left.
	budgeted: 300_000,
	activity: -123_450,
	balance: 176_550,
	goal_type: null,
	deleted: false,
	note: null,
};

export const categoryGroup = {
	id: groupId,
	name: 'Everyday',
	hidden: false,
	deleted: false,
	categories: [category],
};

export const payee = {
	id: payeeId,
	name: 'Acme Grocer',
	transfer_account_id: null,
	deleted: false,
};

export const transaction = {
	id: transactionId,
	date: '2024-06-01',
	// -$123.45: negative is an outflow.
	amount: -123_450,
	memo: 'Weekly shop',
	cleared: 'cleared',
	approved: true,
	flag_color: null,
	account_id: accountId,
	account_name: 'Checking',
	payee_id: payeeId,
	payee_name: 'Acme Grocer',
	category_id: categoryId,
	category_name: 'Groceries',
	transfer_account_id: null,
	transfer_transaction_id: null,
	matched_transaction_id: null,
	import_id: null,
	deleted: false,
	subtransactions: [],
};

/** A transaction split across categories: the parent's category is null. */
export const splitTransaction = {
	...transaction,
	id: 'txn00000-0000-0000-0000-000000000002',
	category_id: null,
	category_name: null,
	amount: -200_000,
	subtransactions: [
		{
			id: 'sub1',
			transaction_id: 'txn00000-0000-0000-0000-000000000002',
			amount: -150_000,
			memo: 'Food',
			payee_id: payeeId,
			payee_name: 'Acme Grocer',
			category_id: categoryId,
			category_name: 'Groceries',
			transfer_account_id: null,
			deleted: false,
		},
		{
			id: 'sub2',
			transaction_id: 'txn00000-0000-0000-0000-000000000002',
			amount: -50_000,
			memo: 'Household',
			payee_id: payeeId,
			payee_name: 'Acme Grocer',
			category_id: null,
			category_name: 'Household',
			transfer_account_id: null,
			deleted: false,
		},
	],
};

export const month = {
	month: '2024-06-01',
	note: null,
	// $5,000 income, $4,200 budgeted, $800 still to assign.
	income: 5_000_000,
	budgeted: 4_200_000,
	activity: -3_100_000,
	to_be_budgeted: 800_000,
	age_of_money: 42,
	deleted: false,
	categories: [category],
};

export const scheduledTransaction = {
	id: scheduledId,
	date_first: '2024-01-01',
	date_next: '2024-07-01',
	frequency: 'monthly',
	amount: -150_000,
	memo: 'Rent',
	flag_color: null,
	account_id: accountId,
	account_name: 'Checking',
	payee_id: payeeId,
	payee_name: 'Landlord',
	category_id: categoryId,
	category_name: 'Rent',
	transfer_account_id: null,
	deleted: false,
	subtransactions: [],
};

export const user = { id: userId };

export const budgetDetail = {
	data: {
		budget: {
			id: budgetId,
			name: 'Household',
			last_modified_on: '2024-06-01T10:00:00Z',
			accounts: [account],
			payees: [payee],
			category_groups: [categoryGroup],
			categories: [category],
			months: [month],
			transactions: [transaction],
			scheduled_transactions: [scheduledTransaction],
		},
		server_knowledge: 1234,
	},
};

/** The error body the API sends. */
export const unauthorized = {
	error: {
		id: '401',
		name: 'unauthorized',
		detail: 'Unauthorized',
	},
};

export const notFound = {
	error: {
		id: '404.2',
		name: 'resource_not_found',
		detail: 'Resource not found',
	},
};

export const subscriptionLapsed = {
	error: {
		id: '403.1',
		name: 'subscription_lapsed',
		detail:
			'The subscription for this account has expired. Only read requests are allowed.',
	},
};

export const badRequest = {
	error: {
		id: '400',
		name: 'bad_request',
		detail: 'The request could not be understood.',
	},
};

export const rateLimited = {
	error: {
		id: '429',
		name: 'too_many_requests',
		detail: 'Too many requests',
	},
};
