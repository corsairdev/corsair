import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Accounts,
	Budgets,
	Categories,
	Months,
	Payees,
	Transactions,
	User,
} from './endpoints';
import type {
	YnabEndpointInputs,
	YnabEndpointOutputs,
} from './endpoints/types';
import {
	YnabEndpointInputSchemas,
	YnabEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { YnabSchema } from './schema';

export type YnabPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalYnabPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ynabEndpointsNested>;
};

export type YnabContext = CorsairPluginContext<
	typeof YnabSchema,
	YnabPluginOptions
>;

export type YnabKeyBuilderContext = KeyBuilderContext<YnabPluginOptions>;

export type YnabBoundEndpoints = BindEndpoints<typeof ynabEndpointsNested>;

type YnabEndpoint<K extends keyof YnabEndpointOutputs> = CorsairEndpoint<
	YnabContext,
	YnabEndpointInputs[K],
	YnabEndpointOutputs[K]
>;

export type YnabEndpoints = {
	budgetsList: YnabEndpoint<'budgetsList'>;
	budgetsGet: YnabEndpoint<'budgetsGet'>;
	accountsList: YnabEndpoint<'accountsList'>;
	accountsGet: YnabEndpoint<'accountsGet'>;
	accountsCreate: YnabEndpoint<'accountsCreate'>;
	categoriesList: YnabEndpoint<'categoriesList'>;
	categoriesGet: YnabEndpoint<'categoriesGet'>;
	categoriesUpdate: YnabEndpoint<'categoriesUpdate'>;
	payeesList: YnabEndpoint<'payeesList'>;
	payeesGet: YnabEndpoint<'payeesGet'>;
	payeesCreate: YnabEndpoint<'payeesCreate'>;
	payeesUpdate: YnabEndpoint<'payeesUpdate'>;
	monthsList: YnabEndpoint<'monthsList'>;
	monthsGet: YnabEndpoint<'monthsGet'>;
	transactionsList: YnabEndpoint<'transactionsList'>;
	transactionsGet: YnabEndpoint<'transactionsGet'>;
	transactionsCreate: YnabEndpoint<'transactionsCreate'>;
	transactionsUpdate: YnabEndpoint<'transactionsUpdate'>;
	transactionsDelete: YnabEndpoint<'transactionsDelete'>;
	scheduledList: YnabEndpoint<'scheduledList'>;
	scheduledGet: YnabEndpoint<'scheduledGet'>;
	scheduledCreate: YnabEndpoint<'scheduledCreate'>;
	scheduledDelete: YnabEndpoint<'scheduledDelete'>;
	userGet: YnabEndpoint<'userGet'>;
};

const ynabEndpointsNested = {
	budgets: {
		list: Budgets.list,
		get: Budgets.get,
	},
	accounts: {
		list: Accounts.list,
		get: Accounts.get,
		create: Accounts.create,
	},
	categories: {
		list: Categories.list,
		get: Categories.get,
		update: Categories.update,
	},
	payees: {
		list: Payees.list,
		get: Payees.get,
		create: Payees.create,
		update: Payees.update,
	},
	months: {
		list: Months.list,
		get: Months.get,
	},
	transactions: {
		list: Transactions.list,
		get: Transactions.get,
		create: Transactions.create,
		update: Transactions.update,
		delete: Transactions.remove,
		scheduledList: Transactions.scheduledList,
		scheduledGet: Transactions.scheduledGet,
		scheduledCreate: Transactions.scheduledCreate,
		scheduledDelete: Transactions.scheduledDelete,
	},
	user: {
		get: User.get,
	},
} as const;

export const ynabEndpointSchemas = {
	'budgets.list': {
		input: YnabEndpointInputSchemas.budgetsList,
		output: YnabEndpointOutputSchemas.budgetsList,
	},
	'budgets.get': {
		input: YnabEndpointInputSchemas.budgetsGet,
		output: YnabEndpointOutputSchemas.budgetsGet,
	},
	'accounts.list': {
		input: YnabEndpointInputSchemas.accountsList,
		output: YnabEndpointOutputSchemas.accountsList,
	},
	'accounts.get': {
		input: YnabEndpointInputSchemas.accountsGet,
		output: YnabEndpointOutputSchemas.accountsGet,
	},
	'accounts.create': {
		input: YnabEndpointInputSchemas.accountsCreate,
		output: YnabEndpointOutputSchemas.accountsCreate,
	},
	'categories.list': {
		input: YnabEndpointInputSchemas.categoriesList,
		output: YnabEndpointOutputSchemas.categoriesList,
	},
	'categories.get': {
		input: YnabEndpointInputSchemas.categoriesGet,
		output: YnabEndpointOutputSchemas.categoriesGet,
	},
	'categories.update': {
		input: YnabEndpointInputSchemas.categoriesUpdate,
		output: YnabEndpointOutputSchemas.categoriesUpdate,
	},
	'payees.list': {
		input: YnabEndpointInputSchemas.payeesList,
		output: YnabEndpointOutputSchemas.payeesList,
	},
	'payees.get': {
		input: YnabEndpointInputSchemas.payeesGet,
		output: YnabEndpointOutputSchemas.payeesGet,
	},
	'payees.create': {
		input: YnabEndpointInputSchemas.payeesCreate,
		output: YnabEndpointOutputSchemas.payeesCreate,
	},
	'payees.update': {
		input: YnabEndpointInputSchemas.payeesUpdate,
		output: YnabEndpointOutputSchemas.payeesUpdate,
	},
	'months.list': {
		input: YnabEndpointInputSchemas.monthsList,
		output: YnabEndpointOutputSchemas.monthsList,
	},
	'months.get': {
		input: YnabEndpointInputSchemas.monthsGet,
		output: YnabEndpointOutputSchemas.monthsGet,
	},
	'transactions.list': {
		input: YnabEndpointInputSchemas.transactionsList,
		output: YnabEndpointOutputSchemas.transactionsList,
	},
	'transactions.get': {
		input: YnabEndpointInputSchemas.transactionsGet,
		output: YnabEndpointOutputSchemas.transactionsGet,
	},
	'transactions.create': {
		input: YnabEndpointInputSchemas.transactionsCreate,
		output: YnabEndpointOutputSchemas.transactionsCreate,
	},
	'transactions.update': {
		input: YnabEndpointInputSchemas.transactionsUpdate,
		output: YnabEndpointOutputSchemas.transactionsUpdate,
	},
	'transactions.delete': {
		input: YnabEndpointInputSchemas.transactionsDelete,
		output: YnabEndpointOutputSchemas.transactionsDelete,
	},
	'transactions.scheduledList': {
		input: YnabEndpointInputSchemas.scheduledList,
		output: YnabEndpointOutputSchemas.scheduledList,
	},
	'transactions.scheduledGet': {
		input: YnabEndpointInputSchemas.scheduledGet,
		output: YnabEndpointOutputSchemas.scheduledGet,
	},
	'transactions.scheduledCreate': {
		input: YnabEndpointInputSchemas.scheduledCreate,
		output: YnabEndpointOutputSchemas.scheduledCreate,
	},
	'transactions.scheduledDelete': {
		input: YnabEndpointInputSchemas.scheduledDelete,
		output: YnabEndpointOutputSchemas.scheduledDelete,
	},
	'user.get': {
		input: YnabEndpointInputSchemas.userGet,
		output: YnabEndpointOutputSchemas.userGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof ynabEndpointsNested>;

const defaultAuthType = 'api_key' as const;

const ynabEndpointMeta = {
	'budgets.list': {
		riskLevel: 'read',
		description: 'List the budgets the token can see, with their date ranges',
	},
	'budgets.get': {
		riskLevel: 'read',
		description:
			'Read a whole budget: every account, category, payee, month and transaction; `last-used` reaches the most recent',
	},
	'accounts.list': {
		riskLevel: 'read',
		description:
			'List the accounts in a budget with their cleared and uncleared balances',
	},
	'accounts.get': {
		riskLevel: 'read',
		description: 'Read one account with its balance and on-budget flag',
	},
	'accounts.create': {
		riskLevel: 'write',
		description:
			'Create an account with a type and an opening balance, given in milliunits',
	},
	'categories.list': {
		riskLevel: 'read',
		description:
			'List the category groups and categories with their budgeted, activity and balance amounts',
	},
	'categories.get': {
		riskLevel: 'read',
		description: 'Read one category with its budgeted and balance amounts',
	},
	'categories.update': {
		riskLevel: 'write',
		description:
			'Set the amount assigned to a category for a month; the value replaces rather than adds, in milliunits',
	},
	'payees.list': {
		riskLevel: 'read',
		description: 'List the payees in a budget',
	},
	'payees.get': {
		riskLevel: 'read',
		description: 'Read one payee',
	},
	'payees.create': {
		riskLevel: 'write',
		description: 'Create a payee',
	},
	'payees.update': {
		riskLevel: 'write',
		description: 'Rename a payee',
	},
	'months.list': {
		riskLevel: 'read',
		description:
			'List the budget months with their income, budgeted and to-be-budgeted totals',
	},
	'months.get': {
		riskLevel: 'read',
		description:
			'Read one month with its categories, income and how much is still unassigned',
	},
	'transactions.list': {
		riskLevel: 'read',
		description:
			'List transactions, optionally since a date or only the uncategorized or unapproved ones',
	},
	'transactions.get': {
		riskLevel: 'read',
		description:
			'Read one transaction with its amount, splits and cleared state',
	},
	'transactions.create': {
		riskLevel: 'write',
		description:
			'Create up to 500 transactions in one call; an import_id makes a repeat update rather than duplicate',
	},
	'transactions.update': {
		riskLevel: 'write',
		description:
			'Change a transaction amount, date, payee, category, memo or cleared state',
	},
	'transactions.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a transaction, which answers the transaction as it was',
	},
	'transactions.scheduledList': {
		riskLevel: 'read',
		description:
			'List scheduled transactions with their frequency and next date',
	},
	'transactions.scheduledGet': {
		riskLevel: 'read',
		description: 'Read one scheduled transaction',
	},
	'transactions.scheduledCreate': {
		riskLevel: 'write',
		description:
			'Create a scheduled transaction that repeats on a given frequency',
	},
	'transactions.scheduledDelete': {
		riskLevel: 'destructive',
		description: 'Delete a scheduled transaction',
	},
	'user.get': {
		riskLevel: 'read',
		description:
			'Read the user behind the token, which is the cheapest way to check it',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof ynabEndpointsNested>;

export type BaseYnabPlugin<T extends YnabPluginOptions> = CorsairPlugin<
	'ynab',
	typeof YnabSchema,
	typeof ynabEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalYnabPlugin = BaseYnabPlugin<YnabPluginOptions>;

export type ExternalYnabPlugin<T extends YnabPluginOptions> = BaseYnabPlugin<T>;

export function ynab<const T extends YnabPluginOptions>(
	incomingOptions: YnabPluginOptions & T = {} as YnabPluginOptions & T,
): ExternalYnabPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'ynab',
		schema: YnabSchema,
		options: options,
		hooks: options.hooks,
		endpoints: ynabEndpointsNested,
		webhooks: {},
		endpointMeta: ynabEndpointMeta,
		endpointSchemas: ynabEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: YnabKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('ynab', ctx.authType ?? 'api_key');
		},
	} satisfies InternalYnabPlugin;
}

export {
	isYnabFailure,
	segment,
	YNAB_API_BASE,
	YNAB_DATE_PATTERN,
	YnabAPIError,
} from './client';

export type {
	AccountsCreateInput,
	AccountsCreateResponse,
	AccountsGetInput,
	AccountsGetResponse,
	AccountsListInput,
	AccountsListResponse,
	BudgetsGetInput,
	BudgetsGetResponse,
	BudgetsListInput,
	BudgetsListResponse,
	CategoriesGetInput,
	CategoriesGetResponse,
	CategoriesListInput,
	CategoriesListResponse,
	CategoriesUpdateInput,
	CategoriesUpdateResponse,
	MonthsGetInput,
	MonthsGetResponse,
	MonthsListInput,
	MonthsListResponse,
	PayeesCreateInput,
	PayeesCreateResponse,
	PayeesGetInput,
	PayeesGetResponse,
	PayeesListInput,
	PayeesListResponse,
	PayeesUpdateInput,
	PayeesUpdateResponse,
	ScheduledCreateInput,
	ScheduledCreateResponse,
	ScheduledDeleteInput,
	ScheduledDeleteResponse,
	ScheduledGetInput,
	ScheduledGetResponse,
	ScheduledListInput,
	ScheduledListResponse,
	TransactionsCreateInput,
	TransactionsCreateResponse,
	TransactionsDeleteInput,
	TransactionsDeleteResponse,
	TransactionsGetInput,
	TransactionsGetResponse,
	TransactionsListInput,
	TransactionsListResponse,
	TransactionsUpdateInput,
	TransactionsUpdateResponse,
	UserGetInput,
	UserGetResponse,
	YnabAccount,
	YnabBudgetDetail,
	YnabBudgetSummary,
	YnabCategory,
	YnabCategoryGroup,
	YnabEndpointInputs,
	YnabEndpointOutputs,
	YnabMonthSummary,
	YnabPayee,
	YnabScheduledTransaction,
	YnabSubtransaction,
	YnabTransaction,
	YnabUser,
} from './endpoints/types';
