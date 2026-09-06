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
import {
	getInvoice,
	getOrganization,
	listCreditNotes,
	listCustomers,
	listInvoices,
} from './endpoints/chaser';
import type {
	ChaserEndpointInputs,
	ChaserEndpointOutputs,
} from './endpoints/types';
import {
	ChaserEndpointInputSchemas,
	ChaserEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ChaserSchema } from './schema';

export type ChaserPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	secret?: string;
	hooks?: InternalChaserPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof chaserEndpointsNested>;
};

export type ChaserContext = CorsairPluginContext<
	typeof ChaserSchema,
	ChaserPluginOptions
>;

export type ChaserKeyBuilderContext = KeyBuilderContext<ChaserPluginOptions>;

export type ChaserBoundEndpoints = BindEndpoints<typeof chaserEndpointsNested>;

type ChaserEndpoint<K extends keyof ChaserEndpointOutputs> = CorsairEndpoint<
	ChaserContext,
	ChaserEndpointInputs[K],
	ChaserEndpointOutputs[K]
>;

export type ChaserEndpoints = {
	listCustomers: ChaserEndpoint<'listCustomers'>;
	listInvoices: ChaserEndpoint<'listInvoices'>;
	getInvoice: ChaserEndpoint<'getInvoice'>;
	listCreditNotes: ChaserEndpoint<'listCreditNotes'>;
	getOrganization: ChaserEndpoint<'getOrganization'>;
};

const chaserEndpointsNested = {
	customers: {
		list: listCustomers,
	},
	invoices: {
		list: listInvoices,
		get: getInvoice,
	},
	creditNotes: {
		list: listCreditNotes,
	},
	organization: {
		get: getOrganization,
	},
} as const;

export const chaserEndpointSchemas = {
	'customers.list': {
		input: ChaserEndpointInputSchemas.listCustomers,
		output: ChaserEndpointOutputSchemas.listCustomers,
	},
	'invoices.list': {
		input: ChaserEndpointInputSchemas.listInvoices,
		output: ChaserEndpointOutputSchemas.listInvoices,
	},
	'invoices.get': {
		input: ChaserEndpointInputSchemas.getInvoice,
		output: ChaserEndpointOutputSchemas.getInvoice,
	},
	'creditNotes.list': {
		input: ChaserEndpointInputSchemas.listCreditNotes,
		output: ChaserEndpointOutputSchemas.listCreditNotes,
	},
	'organization.get': {
		input: ChaserEndpointInputSchemas.getOrganization,
		output: ChaserEndpointOutputSchemas.getOrganization,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof chaserEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const chaserEndpointMeta = {
	'customers.list': {
		riskLevel: 'read',
		description: 'List all customers',
	},
	'invoices.list': {
		riskLevel: 'read',
		description: 'List all invoices',
	},
	'invoices.get': {
		riskLevel: 'read',
		description: 'Get an invoice by ID',
	},
	'creditNotes.list': {
		riskLevel: 'read',
		description: 'List all credit notes',
	},
	'organization.get': {
		riskLevel: 'read',
		description: 'Get organization details',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof chaserEndpointsNested>;

export const chaserAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseChaserPlugin<T extends ChaserPluginOptions> = CorsairPlugin<
	'chaser',
	typeof ChaserSchema,
	typeof chaserEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalChaserPlugin = BaseChaserPlugin<ChaserPluginOptions>;

export type ExternalChaserPlugin<T extends ChaserPluginOptions> =
	BaseChaserPlugin<T>;

export function chaser<const T extends ChaserPluginOptions>(
	incomingOptions: ChaserPluginOptions & T = {} as ChaserPluginOptions & T,
): ExternalChaserPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'chaser',
		authConfig: chaserAuthConfig,
		schema: ChaserSchema,
		options,
		hooks: options.hooks,
		endpoints: chaserEndpointsNested,
		webhooks: {},
		endpointMeta: chaserEndpointMeta,
		endpointSchemas: chaserEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ChaserKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) {
					throw new Error('Chaser API key is required.');
				}
				return key;
			}
			throw new Error('Chaser API key is required.');
		},
	} satisfies InternalChaserPlugin;
}

export type {
	ChaserEndpointInputs,
	ChaserEndpointOutputs,
} from './endpoints/types';
