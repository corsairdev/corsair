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
import { packChaserCredentials } from './client';
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
	ChaserPluginOptions,
	undefined,
	typeof chaserAuthConfig
>;

export type ChaserKeyBuilderContext = KeyBuilderContext<
	ChaserPluginOptions,
	typeof chaserAuthConfig
>;

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
		account: ['tenant_external_id', 'api_secret'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseChaserPlugin<T extends ChaserPluginOptions> = CorsairPlugin<
	'chaser',
	typeof ChaserSchema,
	typeof chaserEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof chaserAuthConfig
>;

export type InternalChaserPlugin = BaseChaserPlugin<ChaserPluginOptions>;

export type ExternalChaserPlugin<T extends ChaserPluginOptions> =
	BaseChaserPlugin<T>;

// The `{} as ...` default below is the exact line `pnpm generate:plugin`
// scaffolds (see scripts/generate-plugin.ts): a default is required for the
// generic-intersected options parameter. It is safe because every
// ChaserPluginOptions field is optional and the value is only spread and
// read, never cast again or written to unsafely.
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
			if (source !== 'endpoint') {
				throw new AuthMissingError('chaser', 'api_key');
			}
			if (ctx.authType === 'api_key') {
				const key = options.key ?? (await ctx.keys.get_api_key());
				const secret = options.secret ?? (await ctx.keys.get_api_secret());
				if (!key || !secret) {
					throw new AuthMissingError('chaser', 'api_key');
				}
				return packChaserCredentials(key, secret);
			}
			throw new AuthMissingError('chaser', 'api_key');
		},
	} satisfies InternalChaserPlugin;
}

export type {
	ChaserEndpointInputs,
	ChaserEndpointOutputs,
} from './endpoints/types';
