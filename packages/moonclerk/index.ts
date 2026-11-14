import type {
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
import { Customers, Forms, Payments } from './endpoints';
import type {
	MoonClerkEndpointInputs,
	MoonClerkEndpointOutputs,
	MoonClerkOperationName,
} from './endpoints/types';
import {
	MoonClerkEndpointInputSchemas,
	MoonClerkEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { MoonClerkSchema } from './schema';

export type MoonClerkPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalMoonClerkPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof endpoints>;
};
export type MoonClerkContext = CorsairPluginContext<
	typeof MoonClerkSchema,
	MoonClerkPluginOptions
>;
export type MoonClerkKeyBuilderContext =
	KeyBuilderContext<MoonClerkPluginOptions>;
type Endpoint<K extends MoonClerkOperationName> = CorsairEndpoint<
	MoonClerkContext,
	MoonClerkEndpointInputs[K],
	MoonClerkEndpointOutputs[K]
>;
export type MoonClerkEndpoints = { [K in MoonClerkOperationName]: Endpoint<K> };
const endpoints = {
	forms: Forms,
	customers: Customers,
	payments: Payments,
} as const;
export type MoonClerkBoundEndpoints = BindEndpoints<typeof endpoints>;
export const moonClerkEndpointSchemas = {
	'forms.list': {
		input: MoonClerkEndpointInputSchemas.listForms,
		output: MoonClerkEndpointOutputSchemas.listForms,
	},
	'forms.get': {
		input: MoonClerkEndpointInputSchemas.getForm,
		output: MoonClerkEndpointOutputSchemas.getForm,
	},
	'customers.list': {
		input: MoonClerkEndpointInputSchemas.listCustomers,
		output: MoonClerkEndpointOutputSchemas.listCustomers,
	},
	'customers.get': {
		input: MoonClerkEndpointInputSchemas.getCustomer,
		output: MoonClerkEndpointOutputSchemas.getCustomer,
	},
	'payments.list': {
		input: MoonClerkEndpointInputSchemas.listPayments,
		output: MoonClerkEndpointOutputSchemas.listPayments,
	},
	'payments.get': {
		input: MoonClerkEndpointInputSchemas.getPayment,
		output: MoonClerkEndpointOutputSchemas.getPayment,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof endpoints>;
export const moonClerkEndpointMeta = {
	'forms.list': { riskLevel: 'read', description: 'List payment forms' },
	'forms.get': { riskLevel: 'read', description: 'Get a payment form' },
	'customers.list': {
		riskLevel: 'read',
		description: 'List customers and subscriptions',
	},
	'customers.get': {
		riskLevel: 'read',
		description: 'Get a customer and subscription',
	},
	'payments.list': { riskLevel: 'read', description: 'List payments' },
	'payments.get': { riskLevel: 'read', description: 'Get a payment' },
} as const satisfies RequiredPluginEndpointMeta<typeof endpoints>;
export const moonClerkAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;
export type BaseMoonClerkPlugin<T extends MoonClerkPluginOptions> =
	CorsairPlugin<
		'moonclerk',
		typeof MoonClerkSchema,
		typeof endpoints,
		{},
		T,
		'api_key'
	>;
export type InternalMoonClerkPlugin =
	BaseMoonClerkPlugin<MoonClerkPluginOptions>;
export function moonclerk<const T extends MoonClerkPluginOptions>(
	incomingOptions: MoonClerkPluginOptions & T = {} as MoonClerkPluginOptions &
		T,
): BaseMoonClerkPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? 'api_key',
	};
	return {
		id: 'moonclerk',
		authConfig: moonClerkAuthConfig,
		schema: MoonClerkSchema,
		options,
		hooks: options.hooks,
		endpoints,
		webhooks: {},
		endpointMeta: moonClerkEndpointMeta,
		endpointSchemas: moonClerkEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: MoonClerkKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key?.trim()) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key?.trim()) return key;
			}
			throw new AuthMissingError('moonclerk', 'api_key');
		},
	} as BaseMoonClerkPlugin<T>;
}
export type {
	MoonClerkEndpointInputs,
	MoonClerkEndpointOutputs,
	MoonClerkOperationName,
} from './endpoints/types';
