import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Currencies,
	Customers,
	Expenses,
	Invoices,
	Payments,
	Products,
	Profile,
} from './endpoints';
import type {
	FinmeiEndpointInputs,
	FinmeiEndpointOutputs,
} from './endpoints/types';
import {
	FinmeiEndpointInputSchemas,
	FinmeiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { FinmeiSchema } from './schema';

export type FinmeiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalFinmeiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof finmeiEndpointsNested>;
};

export type FinmeiContext = CorsairPluginContext<
	typeof FinmeiSchema,
	FinmeiPluginOptions
>;

export type FinmeiKeyBuilderContext = KeyBuilderContext<FinmeiPluginOptions>;

export type FinmeiBoundEndpoints = BindEndpoints<typeof finmeiEndpointsNested>;

type FinmeiEndpoint<Input, Output> = CorsairEndpoint<
	FinmeiContext,
	Input,
	Output
>;

export type FinmeiEndpoints = {
	invoicesList: FinmeiEndpoint<
		FinmeiEndpointInputs['invoices.list'],
		FinmeiEndpointOutputs['invoices.list']
	>;
	invoicesCreate: FinmeiEndpoint<
		FinmeiEndpointInputs['invoices.create'],
		FinmeiEndpointOutputs['invoices.create']
	>;
	invoicesGet: FinmeiEndpoint<
		FinmeiEndpointInputs['invoices.get'],
		FinmeiEndpointOutputs['invoices.get']
	>;
	invoicesUpdate: FinmeiEndpoint<
		FinmeiEndpointInputs['invoices.update'],
		FinmeiEndpointOutputs['invoices.update']
	>;
	invoicesDelete: FinmeiEndpoint<
		FinmeiEndpointInputs['invoices.delete'],
		FinmeiEndpointOutputs['invoices.delete']
	>;
	invoicesDownload: FinmeiEndpoint<
		FinmeiEndpointInputs['invoices.download'],
		FinmeiEndpointOutputs['invoices.download']
	>;
	expensesList: FinmeiEndpoint<
		FinmeiEndpointInputs['expenses.list'],
		FinmeiEndpointOutputs['expenses.list']
	>;
	expensesCreate: FinmeiEndpoint<
		FinmeiEndpointInputs['expenses.create'],
		FinmeiEndpointOutputs['expenses.create']
	>;
	expensesGet: FinmeiEndpoint<
		FinmeiEndpointInputs['expenses.get'],
		FinmeiEndpointOutputs['expenses.get']
	>;
	expensesUpdate: FinmeiEndpoint<
		FinmeiEndpointInputs['expenses.update'],
		FinmeiEndpointOutputs['expenses.update']
	>;
	expensesDelete: FinmeiEndpoint<
		FinmeiEndpointInputs['expenses.delete'],
		FinmeiEndpointOutputs['expenses.delete']
	>;
	expensesUpdateFile: FinmeiEndpoint<
		FinmeiEndpointInputs['expenses.updateFile'],
		FinmeiEndpointOutputs['expenses.updateFile']
	>;
	expensesDownload: FinmeiEndpoint<
		FinmeiEndpointInputs['expenses.download'],
		FinmeiEndpointOutputs['expenses.download']
	>;
	customersList: FinmeiEndpoint<
		FinmeiEndpointInputs['customers.list'],
		FinmeiEndpointOutputs['customers.list']
	>;
	customersCreate: FinmeiEndpoint<
		FinmeiEndpointInputs['customers.create'],
		FinmeiEndpointOutputs['customers.create']
	>;
	customersGet: FinmeiEndpoint<
		FinmeiEndpointInputs['customers.get'],
		FinmeiEndpointOutputs['customers.get']
	>;
	customersUpdate: FinmeiEndpoint<
		FinmeiEndpointInputs['customers.update'],
		FinmeiEndpointOutputs['customers.update']
	>;
	customersDelete: FinmeiEndpoint<
		FinmeiEndpointInputs['customers.delete'],
		FinmeiEndpointOutputs['customers.delete']
	>;
	productsList: FinmeiEndpoint<
		FinmeiEndpointInputs['products.list'],
		FinmeiEndpointOutputs['products.list']
	>;
	productsCreate: FinmeiEndpoint<
		FinmeiEndpointInputs['products.create'],
		FinmeiEndpointOutputs['products.create']
	>;
	productsGet: FinmeiEndpoint<
		FinmeiEndpointInputs['products.get'],
		FinmeiEndpointOutputs['products.get']
	>;
	productsUpdate: FinmeiEndpoint<
		FinmeiEndpointInputs['products.update'],
		FinmeiEndpointOutputs['products.update']
	>;
	productsDelete: FinmeiEndpoint<
		FinmeiEndpointInputs['products.delete'],
		FinmeiEndpointOutputs['products.delete']
	>;
	paymentsList: FinmeiEndpoint<
		FinmeiEndpointInputs['payments.list'],
		FinmeiEndpointOutputs['payments.list']
	>;
	paymentsCreate: FinmeiEndpoint<
		FinmeiEndpointInputs['payments.create'],
		FinmeiEndpointOutputs['payments.create']
	>;
	paymentsGet: FinmeiEndpoint<
		FinmeiEndpointInputs['payments.get'],
		FinmeiEndpointOutputs['payments.get']
	>;
	paymentsDelete: FinmeiEndpoint<
		FinmeiEndpointInputs['payments.delete'],
		FinmeiEndpointOutputs['payments.delete']
	>;
	currenciesList: FinmeiEndpoint<
		FinmeiEndpointInputs['currencies.list'],
		FinmeiEndpointOutputs['currencies.list']
	>;
	profileGet: FinmeiEndpoint<
		FinmeiEndpointInputs['profile.get'],
		FinmeiEndpointOutputs['profile.get']
	>;
};

const finmeiEndpointsNested = {
	invoices: {
		list: Invoices.list,
		create: Invoices.create,
		get: Invoices.get,
		update: Invoices.update,
		delete: Invoices.delete,
		download: Invoices.download,
	},
	expenses: {
		list: Expenses.list,
		create: Expenses.create,
		get: Expenses.get,
		update: Expenses.update,
		delete: Expenses.delete,
		updateFile: Expenses.updateFile,
		download: Expenses.download,
	},
	customers: {
		list: Customers.list,
		create: Customers.create,
		get: Customers.get,
		update: Customers.update,
		delete: Customers.delete,
	},
	products: {
		list: Products.list,
		create: Products.create,
		get: Products.get,
		update: Products.update,
		delete: Products.delete,
	},
	payments: {
		list: Payments.list,
		create: Payments.create,
		get: Payments.get,
		delete: Payments.delete,
	},
	currencies: {
		list: Currencies.list,
	},
	profile: {
		get: Profile.get,
	},
} as const;

export const finmeiEndpointSchemas = {
	'invoices.list': {
		input: FinmeiEndpointInputSchemas['invoices.list'],
		output: FinmeiEndpointOutputSchemas['invoices.list'],
	},
	'invoices.create': {
		input: FinmeiEndpointInputSchemas['invoices.create'],
		output: FinmeiEndpointOutputSchemas['invoices.create'],
	},
	'invoices.get': {
		input: FinmeiEndpointInputSchemas['invoices.get'],
		output: FinmeiEndpointOutputSchemas['invoices.get'],
	},
	'invoices.update': {
		input: FinmeiEndpointInputSchemas['invoices.update'],
		output: FinmeiEndpointOutputSchemas['invoices.update'],
	},
	'invoices.delete': {
		input: FinmeiEndpointInputSchemas['invoices.delete'],
		output: FinmeiEndpointOutputSchemas['invoices.delete'],
	},
	'invoices.download': {
		input: FinmeiEndpointInputSchemas['invoices.download'],
		output: FinmeiEndpointOutputSchemas['invoices.download'],
	},
	'expenses.list': {
		input: FinmeiEndpointInputSchemas['expenses.list'],
		output: FinmeiEndpointOutputSchemas['expenses.list'],
	},
	'expenses.create': {
		input: FinmeiEndpointInputSchemas['expenses.create'],
		output: FinmeiEndpointOutputSchemas['expenses.create'],
	},
	'expenses.get': {
		input: FinmeiEndpointInputSchemas['expenses.get'],
		output: FinmeiEndpointOutputSchemas['expenses.get'],
	},
	'expenses.update': {
		input: FinmeiEndpointInputSchemas['expenses.update'],
		output: FinmeiEndpointOutputSchemas['expenses.update'],
	},
	'expenses.delete': {
		input: FinmeiEndpointInputSchemas['expenses.delete'],
		output: FinmeiEndpointOutputSchemas['expenses.delete'],
	},
	'expenses.updateFile': {
		input: FinmeiEndpointInputSchemas['expenses.updateFile'],
		output: FinmeiEndpointOutputSchemas['expenses.updateFile'],
	},
	'expenses.download': {
		input: FinmeiEndpointInputSchemas['expenses.download'],
		output: FinmeiEndpointOutputSchemas['expenses.download'],
	},
	'customers.list': {
		input: FinmeiEndpointInputSchemas['customers.list'],
		output: FinmeiEndpointOutputSchemas['customers.list'],
	},
	'customers.create': {
		input: FinmeiEndpointInputSchemas['customers.create'],
		output: FinmeiEndpointOutputSchemas['customers.create'],
	},
	'customers.get': {
		input: FinmeiEndpointInputSchemas['customers.get'],
		output: FinmeiEndpointOutputSchemas['customers.get'],
	},
	'customers.update': {
		input: FinmeiEndpointInputSchemas['customers.update'],
		output: FinmeiEndpointOutputSchemas['customers.update'],
	},
	'customers.delete': {
		input: FinmeiEndpointInputSchemas['customers.delete'],
		output: FinmeiEndpointOutputSchemas['customers.delete'],
	},
	'products.list': {
		input: FinmeiEndpointInputSchemas['products.list'],
		output: FinmeiEndpointOutputSchemas['products.list'],
	},
	'products.create': {
		input: FinmeiEndpointInputSchemas['products.create'],
		output: FinmeiEndpointOutputSchemas['products.create'],
	},
	'products.get': {
		input: FinmeiEndpointInputSchemas['products.get'],
		output: FinmeiEndpointOutputSchemas['products.get'],
	},
	'products.update': {
		input: FinmeiEndpointInputSchemas['products.update'],
		output: FinmeiEndpointOutputSchemas['products.update'],
	},
	'products.delete': {
		input: FinmeiEndpointInputSchemas['products.delete'],
		output: FinmeiEndpointOutputSchemas['products.delete'],
	},
	'payments.list': {
		input: FinmeiEndpointInputSchemas['payments.list'],
		output: FinmeiEndpointOutputSchemas['payments.list'],
	},
	'payments.create': {
		input: FinmeiEndpointInputSchemas['payments.create'],
		output: FinmeiEndpointOutputSchemas['payments.create'],
	},
	'payments.get': {
		input: FinmeiEndpointInputSchemas['payments.get'],
		output: FinmeiEndpointOutputSchemas['payments.get'],
	},
	'payments.delete': {
		input: FinmeiEndpointInputSchemas['payments.delete'],
		output: FinmeiEndpointOutputSchemas['payments.delete'],
	},
	'currencies.list': {
		input: FinmeiEndpointInputSchemas['currencies.list'],
		output: FinmeiEndpointOutputSchemas['currencies.list'],
	},
	'profile.get': {
		input: FinmeiEndpointInputSchemas['profile.get'],
		output: FinmeiEndpointOutputSchemas['profile.get'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof finmeiEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const PUBLIC_ENDPOINTS = new Set<string>();

const finmeiEndpointMeta = {
	'invoices.list': {
		riskLevel: 'read',
		description: 'List invoices with optional pagination',
	},
	'invoices.create': {
		riskLevel: 'write',
		description:
			'Create a new invoice with line items, buyer and seller information',
	},
	'invoices.get': {
		riskLevel: 'read',
		description: 'Retrieve an invoice by ID',
	},
	'invoices.update': {
		riskLevel: 'write',
		description: 'Update an existing invoice',
	},
	'invoices.delete': {
		riskLevel: 'destructive',
		description: 'Delete an invoice by ID',
	},
	'invoices.download': {
		riskLevel: 'read',
		description: 'Download invoice PDF document as binary data',
	},
	'expenses.list': {
		riskLevel: 'read',
		description: 'List recorded expenses with optional pagination',
	},
	'expenses.create': {
		riskLevel: 'write',
		description: 'Create a new expense record with optional receipt file',
	},
	'expenses.get': {
		riskLevel: 'read',
		description: 'Retrieve an expense record by ID',
	},
	'expenses.update': {
		riskLevel: 'write',
		description: 'Update an existing expense record',
	},
	'expenses.delete': {
		riskLevel: 'destructive',
		description: 'Delete an expense record by ID',
	},
	'expenses.updateFile': {
		riskLevel: 'write',
		description: 'Update or replace an expense receipt file',
	},
	'expenses.download': {
		riskLevel: 'read',
		description: 'Download expense receipt file as binary data',
	},
	'customers.list': {
		riskLevel: 'read',
		description: 'List customers with optional search and pagination',
	},
	'customers.create': {
		riskLevel: 'write',
		description: 'Create a new customer profile',
	},
	'customers.get': {
		riskLevel: 'read',
		description: 'Retrieve a customer profile by ID',
	},
	'customers.update': {
		riskLevel: 'write',
		description: 'Update an existing customer profile',
	},
	'customers.delete': {
		riskLevel: 'destructive',
		description: 'Delete a customer profile by ID',
	},
	'products.list': {
		riskLevel: 'read',
		description:
			'List products in catalog with optional filters and pagination',
	},
	'products.create': {
		riskLevel: 'write',
		description: 'Create a new product in the catalog',
	},
	'products.get': {
		riskLevel: 'read',
		description: 'Retrieve a product by ID',
	},
	'products.update': {
		riskLevel: 'write',
		description: 'Update product details in the catalog',
	},
	'products.delete': {
		riskLevel: 'destructive',
		description: 'Delete a product from the catalog',
	},
	'payments.list': {
		riskLevel: 'read',
		description: 'List recorded payments with optional filters',
	},
	'payments.create': {
		riskLevel: 'write',
		description: 'Record a new payment for an invoice',
	},
	'payments.get': {
		riskLevel: 'read',
		description: 'Retrieve a payment record by ID',
	},
	'payments.delete': {
		riskLevel: 'destructive',
		description: 'Delete a payment record by ID',
	},
	'currencies.list': {
		riskLevel: 'read',
		description: 'List all currencies supported by Finmei',
	},
	'profile.get': {
		riskLevel: 'read',
		description: 'Get profile information for the authenticated business',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof finmeiEndpointsNested>;

export const finmeiAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseFinmeiPlugin<T extends FinmeiPluginOptions> = CorsairPlugin<
	'finmei',
	typeof FinmeiSchema,
	typeof finmeiEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalFinmeiPlugin = BaseFinmeiPlugin<FinmeiPluginOptions>;

export type ExternalFinmeiPlugin<T extends FinmeiPluginOptions> =
	BaseFinmeiPlugin<T>;

export function finmei<const T extends FinmeiPluginOptions>(
	incomingOptions: FinmeiPluginOptions & T = {} as FinmeiPluginOptions & T,
): ExternalFinmeiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'finmei',
		authConfig: finmeiAuthConfig,
		schema: FinmeiSchema,
		options,
		hooks: options.hooks,
		endpoints: finmeiEndpointsNested,
		webhooks: {},
		endpointMeta: finmeiEndpointMeta,
		endpointSchemas: finmeiEndpointSchemas,
		errorHandlers: (() => {
			const { DEFAULT: builtInDefault, ...builtIns } = errorHandlers;
			const { DEFAULT: callerDefault, ...callers } =
				options.errorHandlers ?? {};
			return {
				...callers,
				...builtIns,
				...callers,
				DEFAULT: callerDefault ?? builtInDefault,
			};
		})(),
		keyBuilder: async (ctx: FinmeiKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (PUBLIC_ENDPOINTS.has(ctx.meteredOperationId ?? '')) return '';
			if (!ctx.keys) throw new AuthMissingError('finmei', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('finmei', 'api_key');
			return apiKey;
		},
	} satisfies InternalFinmeiPlugin;
}

export type {
	FinmeiBinaryResponse,
	FinmeiBuyer,
	FinmeiCreateCustomerInputSchema,
	FinmeiCreateExpenseInputSchema,
	FinmeiCreateInvoiceInputSchema,
	FinmeiCreatePaymentInputSchema,
	FinmeiCreateProductInputSchema,
	FinmeiCurrency,
	FinmeiCustomer,
	FinmeiDeleteResponse,
	FinmeiEndpointInputs,
	FinmeiEndpointOutputs,
	FinmeiExpense,
	FinmeiInvoice,
	FinmeiInvoiceItem,
	FinmeiPaginationMeta,
	FinmeiPayment,
	FinmeiPaymentOption,
	FinmeiProduct,
	FinmeiProfile,
	FinmeiSeller,
} from './endpoints/types';
