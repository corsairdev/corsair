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
import { Customers, Reference, Transactions } from './endpoints';
import type {
	TaxJarEndpointInputs,
	TaxJarEndpointOutputs,
} from './endpoints/types';
import {
	TaxJarEndpointInputSchemas,
	TaxJarEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { TaxJarSchema } from './schema';

export type TaxJarPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTaxJarPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof taxjarEndpointsNested>;
};

export type TaxJarContext = CorsairPluginContext<
	typeof TaxJarSchema,
	TaxJarPluginOptions
>;

export type TaxJarKeyBuilderContext = KeyBuilderContext<TaxJarPluginOptions>;

export type TaxJarBoundEndpoints = BindEndpoints<typeof taxjarEndpointsNested>;

type TaxJarEndpoint<K extends keyof TaxJarEndpointOutputs> = CorsairEndpoint<
	TaxJarContext,
	TaxJarEndpointInputs[K],
	TaxJarEndpointOutputs[K]
>;

export type TaxJarEndpoints = {
	categoriesList: TaxJarEndpoint<'categoriesList'>;
	ratesGet: TaxJarEndpoint<'ratesGet'>;
	nexusRegionsList: TaxJarEndpoint<'nexusRegionsList'>;
	summaryRatesList: TaxJarEndpoint<'summaryRatesList'>;
	addressesValidate: TaxJarEndpoint<'addressesValidate'>;
	taxesCalculate: TaxJarEndpoint<'taxesCalculate'>;
	ordersList: TaxJarEndpoint<'ordersList'>;
	ordersCreate: TaxJarEndpoint<'ordersCreate'>;
	ordersGet: TaxJarEndpoint<'ordersGet'>;
	ordersUpdate: TaxJarEndpoint<'ordersUpdate'>;
	ordersRemove: TaxJarEndpoint<'ordersRemove'>;
	refundsList: TaxJarEndpoint<'refundsList'>;
	refundsCreate: TaxJarEndpoint<'refundsCreate'>;
	refundsGet: TaxJarEndpoint<'refundsGet'>;
	refundsUpdate: TaxJarEndpoint<'refundsUpdate'>;
	refundsRemove: TaxJarEndpoint<'refundsRemove'>;
	customersList: TaxJarEndpoint<'customersList'>;
	customersCreate: TaxJarEndpoint<'customersCreate'>;
	customersGet: TaxJarEndpoint<'customersGet'>;
	customersUpdate: TaxJarEndpoint<'customersUpdate'>;
	customersRemove: TaxJarEndpoint<'customersRemove'>;
};

const taxjarEndpointsNested = {
	categories: {
		list: Reference.categoriesList,
	},
	rates: {
		get: Reference.ratesGet,
	},
	nexusRegions: {
		list: Reference.nexusRegionsList,
	},
	summaryRates: {
		list: Reference.summaryRatesList,
	},
	addresses: {
		validate: Reference.addressesValidate,
	},
	taxes: {
		calculate: Reference.taxesCalculate,
	},
	orders: {
		list: Transactions.ordersList,
		create: Transactions.ordersCreate,
		get: Transactions.ordersGet,
		update: Transactions.ordersUpdate,
		delete: Transactions.ordersRemove,
	},
	refunds: {
		list: Transactions.refundsList,
		create: Transactions.refundsCreate,
		get: Transactions.refundsGet,
		update: Transactions.refundsUpdate,
		delete: Transactions.refundsRemove,
	},
	customers: {
		list: Customers.customersList,
		create: Customers.customersCreate,
		get: Customers.customersGet,
		update: Customers.customersUpdate,
		delete: Customers.customersRemove,
	},
} as const;

export const taxjarEndpointSchemas = {
	'categories.list': {
		input: TaxJarEndpointInputSchemas.categoriesList,
		output: TaxJarEndpointOutputSchemas.categoriesList,
	},
	'rates.get': {
		input: TaxJarEndpointInputSchemas.ratesGet,
		output: TaxJarEndpointOutputSchemas.ratesGet,
	},
	'nexusRegions.list': {
		input: TaxJarEndpointInputSchemas.nexusRegionsList,
		output: TaxJarEndpointOutputSchemas.nexusRegionsList,
	},
	'summaryRates.list': {
		input: TaxJarEndpointInputSchemas.summaryRatesList,
		output: TaxJarEndpointOutputSchemas.summaryRatesList,
	},
	'addresses.validate': {
		input: TaxJarEndpointInputSchemas.addressesValidate,
		output: TaxJarEndpointOutputSchemas.addressesValidate,
	},
	'taxes.calculate': {
		input: TaxJarEndpointInputSchemas.taxesCalculate,
		output: TaxJarEndpointOutputSchemas.taxesCalculate,
	},
	'orders.list': {
		input: TaxJarEndpointInputSchemas.ordersList,
		output: TaxJarEndpointOutputSchemas.ordersList,
	},
	'orders.create': {
		input: TaxJarEndpointInputSchemas.ordersCreate,
		output: TaxJarEndpointOutputSchemas.ordersCreate,
	},
	'orders.get': {
		input: TaxJarEndpointInputSchemas.ordersGet,
		output: TaxJarEndpointOutputSchemas.ordersGet,
	},
	'orders.update': {
		input: TaxJarEndpointInputSchemas.ordersUpdate,
		output: TaxJarEndpointOutputSchemas.ordersUpdate,
	},
	'orders.delete': {
		input: TaxJarEndpointInputSchemas.ordersRemove,
		output: TaxJarEndpointOutputSchemas.ordersRemove,
	},
	'refunds.list': {
		input: TaxJarEndpointInputSchemas.refundsList,
		output: TaxJarEndpointOutputSchemas.refundsList,
	},
	'refunds.create': {
		input: TaxJarEndpointInputSchemas.refundsCreate,
		output: TaxJarEndpointOutputSchemas.refundsCreate,
	},
	'refunds.get': {
		input: TaxJarEndpointInputSchemas.refundsGet,
		output: TaxJarEndpointOutputSchemas.refundsGet,
	},
	'refunds.update': {
		input: TaxJarEndpointInputSchemas.refundsUpdate,
		output: TaxJarEndpointOutputSchemas.refundsUpdate,
	},
	'refunds.delete': {
		input: TaxJarEndpointInputSchemas.refundsRemove,
		output: TaxJarEndpointOutputSchemas.refundsRemove,
	},
	'customers.list': {
		input: TaxJarEndpointInputSchemas.customersList,
		output: TaxJarEndpointOutputSchemas.customersList,
	},
	'customers.create': {
		input: TaxJarEndpointInputSchemas.customersCreate,
		output: TaxJarEndpointOutputSchemas.customersCreate,
	},
	'customers.get': {
		input: TaxJarEndpointInputSchemas.customersGet,
		output: TaxJarEndpointOutputSchemas.customersGet,
	},
	'customers.update': {
		input: TaxJarEndpointInputSchemas.customersUpdate,
		output: TaxJarEndpointOutputSchemas.customersUpdate,
	},
	'customers.delete': {
		input: TaxJarEndpointInputSchemas.customersRemove,
		output: TaxJarEndpointOutputSchemas.customersRemove,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof taxjarEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const taxjarEndpointMeta = {
	'categories.list': {
		riskLevel: 'read',
		description:
			'List the product tax categories, whose product_tax_code values a tax calculation or line item takes',
	},
	'rates.get': {
		riskLevel: 'read',
		description:
			'Read the combined and per-jurisdiction rates for a postal code, with an optional street address for rooftop accuracy',
	},
	'nexusRegions.list': {
		riskLevel: 'read',
		description: 'List the regions where the account has sales tax nexus',
	},
	'summaryRates.list': {
		riskLevel: 'read',
		description:
			'List the minimum and average tax rate per region, for display rather than calculation',
	},
	'addresses.validate': {
		riskLevel: 'read',
		description:
			'Validate a US address and get back every match TaxJar finds, with the street and ZIP normalized',
	},
	'taxes.calculate': {
		riskLevel: 'read',
		description:
			'Calculate the tax for an order from an origin and destination, optionally per line item, without recording a transaction',
	},
	'orders.list': {
		riskLevel: 'read',
		description:
			'List the order transaction IDs recorded through the API, by date or date range',
	},
	'orders.create': {
		riskLevel: 'destructive',
		description:
			'Record an order transaction for tax reporting; shipping is required even when it is zero',
	},
	'orders.get': {
		riskLevel: 'read',
		description: 'Read one order transaction by its ID',
	},
	'orders.update': {
		riskLevel: 'destructive',
		description:
			'Change an order transaction; a transaction that has been filed may refuse the change',
	},
	'orders.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an order transaction, which removes it from tax reporting and cannot be undone',
	},
	'refunds.list': {
		riskLevel: 'read',
		description:
			'List the refund transaction IDs recorded through the API, by date or date range',
	},
	'refunds.create': {
		riskLevel: 'destructive',
		description:
			'Record a refund transaction, linked to its original order by transaction_reference_id',
	},
	'refunds.get': {
		riskLevel: 'read',
		description: 'Read one refund transaction by its ID',
	},
	'refunds.update': {
		riskLevel: 'destructive',
		description: 'Change a refund transaction',
	},
	'refunds.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a refund transaction, which removes it from tax reporting and cannot be undone',
	},
	'customers.list': {
		riskLevel: 'read',
		description: 'List the customer IDs recorded through the API',
	},
	'customers.create': {
		riskLevel: 'write',
		description:
			'Create an exempt customer, whose exemption applies to later transactions that cite its customer_id',
	},
	'customers.get': {
		riskLevel: 'read',
		description: 'Read one customer with its exemption type and exempt regions',
	},
	'customers.update': {
		riskLevel: 'write',
		description: "Change a customer's exemption or address",
	},
	'customers.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a customer, which removes the exemption from future transactions',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof taxjarEndpointsNested>;

export type BaseTaxJarPlugin<T extends TaxJarPluginOptions> = CorsairPlugin<
	'taxjar',
	typeof TaxJarSchema,
	typeof taxjarEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalTaxJarPlugin = BaseTaxJarPlugin<TaxJarPluginOptions>;

export type ExternalTaxJarPlugin<T extends TaxJarPluginOptions> =
	BaseTaxJarPlugin<T>;

export function taxjar<const T extends TaxJarPluginOptions>(
	incomingOptions: TaxJarPluginOptions & T = {} as TaxJarPluginOptions & T,
): ExternalTaxJarPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'taxjar',
		schema: TaxJarSchema,
		options: options,
		hooks: options.hooks,
		endpoints: taxjarEndpointsNested,
		webhooks: {},
		endpointMeta: taxjarEndpointMeta,
		endpointSchemas: taxjarEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: TaxJarKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('taxjar', ctx.authType ?? 'api_key');
		},
	} satisfies InternalTaxJarPlugin;
}

export { readNumber } from './client';
export type {
	AddressesValidateInput,
	AddressesValidateResponse,
	CategoriesResponse,
	CustomerResponse,
	CustomersCreateInput,
	CustomersListResponse,
	CustomersUpdateInput,
	OrdersCreateInput,
	OrdersListInput,
	OrdersUpdateInput,
	RatesGetInput,
	RatesGetResponse,
	RefundsCreateInput,
	RefundsListInput,
	RefundsUpdateInput,
	SummaryRatesResponse,
	TaxesCalculateInput,
	TaxesCalculateResponse,
	TaxJarCustomer,
	TaxJarEndpointInputs,
	TaxJarEndpointOutputs,
	TaxJarOrderTransaction,
	TaxJarRefundTransaction,
} from './endpoints/types';
