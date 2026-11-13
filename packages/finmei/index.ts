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
import { Currencies, Expenses, Invoices, Profile } from './endpoints';
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
		description:
			'Create a new expense record with its bill file (base64 PDF or image, required)',
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
	FinmeiCreateExpenseInput,
	FinmeiCreateInvoiceInput,
	FinmeiCurrency,
	FinmeiDeleteResponse,
	FinmeiEndpointInputs,
	FinmeiEndpointOutputs,
	FinmeiExpense,
	FinmeiInvoice,
	FinmeiInvoiceItem,
	FinmeiPaginationMeta,
	FinmeiPaymentOption,
	FinmeiProfile,
	FinmeiSeller,
} from './endpoints/types';
export {
	FinmeiCreateExpenseInputSchema,
	FinmeiCreateInvoiceInputSchema,
} from './endpoints/types';
