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
import { Org, Spend, Transactions } from './endpoints';
import type {
	RampEndpointInputs,
	RampEndpointOutputs,
} from './endpoints/types';
import {
	RampEndpointInputSchemas,
	RampEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { RampSchema } from './schema';

export type RampPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRampPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof rampEndpointsNested>;
};

export type RampContext = CorsairPluginContext<
	typeof RampSchema,
	RampPluginOptions
>;

export type RampKeyBuilderContext = KeyBuilderContext<RampPluginOptions>;

export type RampBoundEndpoints = BindEndpoints<typeof rampEndpointsNested>;

type RampEndpoint<K extends keyof RampEndpointOutputs> = CorsairEndpoint<
	RampContext,
	RampEndpointInputs[K],
	RampEndpointOutputs[K]
>;

export type RampEndpoints = {
	transactionsList: RampEndpoint<'transactionsList'>;
	transactionsGet: RampEndpoint<'transactionsGet'>;
	transactionsUpdate: RampEndpoint<'transactionsUpdate'>;
	merchantsList: RampEndpoint<'merchantsList'>;
	cardsListVirtual: RampEndpoint<'cardsListVirtual'>;
	billsList: RampEndpoint<'billsList'>;
	billsGet: RampEndpoint<'billsGet'>;
	billsUpdate: RampEndpoint<'billsUpdate'>;
	reimbursementsList: RampEndpoint<'reimbursementsList'>;
	memosGet: RampEndpoint<'memosGet'>;
	memosCreate: RampEndpoint<'memosCreate'>;
	departmentsList: RampEndpoint<'departmentsList'>;
	departmentsCreate: RampEndpoint<'departmentsCreate'>;
	usersList: RampEndpoint<'usersList'>;
	usersGet: RampEndpoint<'usersGet'>;
	businessGet: RampEndpoint<'businessGet'>;
};

const rampEndpointsNested = {
	transactions: {
		list: Transactions.list,
		get: Transactions.get,
		update: Transactions.update,
	},
	merchants: {
		list: Spend.list,
	},
	cards: {
		listVirtual: Spend.listVirtual,
	},
	bills: {
		list: Spend.billsList,
		get: Spend.billsGet,
		update: Spend.billsUpdate,
	},
	reimbursements: {
		list: Org.list,
	},
	memos: {
		get: Org.memoGet,
		create: Org.memoCreate,
	},
	departments: {
		list: Org.departmentsList,
		create: Org.departmentsCreate,
	},
	users: {
		list: Org.usersList,
		get: Org.usersGet,
	},
	business: {
		get: Org.businessGet,
	},
} as const;

export const rampEndpointSchemas = {
	'transactions.list': {
		input: RampEndpointInputSchemas.transactionsList,
		output: RampEndpointOutputSchemas.transactionsList,
	},
	'transactions.get': {
		input: RampEndpointInputSchemas.transactionsGet,
		output: RampEndpointOutputSchemas.transactionsGet,
	},
	'transactions.update': {
		input: RampEndpointInputSchemas.transactionsUpdate,
		output: RampEndpointOutputSchemas.transactionsUpdate,
	},
	'merchants.list': {
		input: RampEndpointInputSchemas.merchantsList,
		output: RampEndpointOutputSchemas.merchantsList,
	},
	'cards.listVirtual': {
		input: RampEndpointInputSchemas.cardsListVirtual,
		output: RampEndpointOutputSchemas.cardsListVirtual,
	},
	'bills.list': {
		input: RampEndpointInputSchemas.billsList,
		output: RampEndpointOutputSchemas.billsList,
	},
	'bills.get': {
		input: RampEndpointInputSchemas.billsGet,
		output: RampEndpointOutputSchemas.billsGet,
	},
	'bills.update': {
		input: RampEndpointInputSchemas.billsUpdate,
		output: RampEndpointOutputSchemas.billsUpdate,
	},
	'reimbursements.list': {
		input: RampEndpointInputSchemas.reimbursementsList,
		output: RampEndpointOutputSchemas.reimbursementsList,
	},
	'memos.get': {
		input: RampEndpointInputSchemas.memosGet,
		output: RampEndpointOutputSchemas.memosGet,
	},
	'memos.create': {
		input: RampEndpointInputSchemas.memosCreate,
		output: RampEndpointOutputSchemas.memosCreate,
	},
	'departments.list': {
		input: RampEndpointInputSchemas.departmentsList,
		output: RampEndpointOutputSchemas.departmentsList,
	},
	'departments.create': {
		input: RampEndpointInputSchemas.departmentsCreate,
		output: RampEndpointOutputSchemas.departmentsCreate,
	},
	'users.list': {
		input: RampEndpointInputSchemas.usersList,
		output: RampEndpointOutputSchemas.usersList,
	},
	'users.get': {
		input: RampEndpointInputSchemas.usersGet,
		output: RampEndpointOutputSchemas.usersGet,
	},
	'business.get': {
		input: RampEndpointInputSchemas.businessGet,
		output: RampEndpointOutputSchemas.businessGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof rampEndpointsNested>;

const defaultAuthType = 'api_key' as const;

const rampEndpointMeta = {
	'transactions.list': {
		riskLevel: 'read',
		description:
			'List card transactions with filters for date, merchant, cardholder, state and approval, plus sorting and cursor paging',
	},
	'transactions.get': {
		riskLevel: 'read',
		description:
			'Fetch one transaction by id, including its cardholder, merchant location, line items and approval state',
	},
	'transactions.update': {
		riskLevel: 'write',
		description:
			"Replace or remove a transaction's line items: the amounts, split into minor units, must sum to the transaction amount",
	},
	'merchants.list': {
		riskLevel: 'read',
		description:
			'List merchants the business has transacted with, optionally filtered by name, domain or transaction date',
	},
	'cards.listVirtual': {
		riskLevel: 'read',
		description:
			'List virtual cards with their fund, owner and suspension state; a terminated card is excluded unless asked for',
	},
	'bills.list': {
		riskLevel: 'read',
		description:
			'List bills with filters for vendor, status, approval, payment and date ranges, plus cursor paging',
	},
	'bills.get': {
		riskLevel: 'read',
		description:
			'Fetch one bill by id, including its vendor, payment details, line items and attachment URLs',
	},
	'bills.update': {
		riskLevel: 'write',
		description:
			'Update a bill: its internal memo, the memo shown to the vendor, the invoice number or the due date',
	},
	'reimbursements.list': {
		riskLevel: 'read',
		description:
			'List reimbursements and repayments with filters for state, direction, user, entity and date ranges',
	},
	'memos.get': {
		riskLevel: 'read',
		description: 'Read the memo attached to a transaction',
	},
	'memos.create': {
		riskLevel: 'write',
		description:
			'Attach a memo of up to 255 characters to a transaction, replacing the existing one',
	},
	'departments.list': {
		riskLevel: 'read',
		description: 'List the departments configured for the business',
	},
	'departments.create': {
		riskLevel: 'write',
		description: 'Create a department with the given name',
	},
	'users.list': {
		riskLevel: 'read',
		description:
			'List users with filters for email, role, status, department, location and entity',
	},
	'users.get': {
		riskLevel: 'read',
		description:
			'Fetch one user by id, including their role, department and manager',
	},
	'business.get': {
		riskLevel: 'read',
		description:
			'Fetch the business profile: legal and card names, billing address, SSO and reimbursement settings',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof rampEndpointsNested>;

export type BaseRampPlugin<T extends RampPluginOptions> = CorsairPlugin<
	'ramp',
	typeof RampSchema,
	typeof rampEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalRampPlugin = BaseRampPlugin<RampPluginOptions>;

export type ExternalRampPlugin<T extends RampPluginOptions> = BaseRampPlugin<T>;

export function ramp<const T extends RampPluginOptions>(
	incomingOptions: RampPluginOptions & T = {} as RampPluginOptions & T,
): ExternalRampPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'ramp',
		schema: RampSchema,
		options: options,
		hooks: options.hooks,
		endpoints: rampEndpointsNested,
		webhooks: {},
		endpointMeta: rampEndpointMeta,
		endpointSchemas: rampEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: RampKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('ramp', ctx.authType ?? 'api_key');
		},
	} satisfies InternalRampPlugin;
}

export { RampAPIError } from './client';

export type {
	BillsGetInput,
	BillsGetResponse,
	BillsListInput,
	BillsListResponse,
	BillsUpdateInput,
	BillsUpdateResponse,
	BusinessGetInput,
	BusinessGetResponse,
	CardsListVirtualInput,
	CardsListVirtualResponse,
	DepartmentsCreateInput,
	DepartmentsCreateResponse,
	DepartmentsListInput,
	DepartmentsListResponse,
	MemosCreateInput,
	MemosCreateResponse,
	MemosGetInput,
	MemosGetResponse,
	MerchantsListInput,
	MerchantsListResponse,
	RampBill,
	RampBusiness,
	RampDepartment,
	RampEndpointInputs,
	RampEndpointOutputs,
	RampMemo,
	RampMerchant,
	RampReimbursement,
	RampTransaction,
	RampUser,
	RampVirtualCard,
	ReimbursementsListInput,
	ReimbursementsListResponse,
	TransactionsGetInput,
	TransactionsGetResponse,
	TransactionsListInput,
	TransactionsListResponse,
	TransactionsUpdateInput,
	TransactionsUpdateResponse,
	UsersGetInput,
	UsersGetResponse,
	UsersListInput,
	UsersListResponse,
} from './endpoints/types';
