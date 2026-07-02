import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import type { AuthTypes } from 'corsair/core';
import type { OnePasswordEndpointInputs, OnePasswordEndpointOutputs } from './endpoints/types';
import { OnePasswordEndpointInputSchemas, OnePasswordEndpointOutputSchemas } from './endpoints/types';
import { Vaults, Items } from './endpoints';
import { OnePasswordSchema } from './schema';
import { errorHandlers } from './error-handlers';

export type OnePasswordPluginOptions = {
	authType?: PickAuth<'api_key'>;
	connectUrl?: string;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalOnePasswordPlugin['hooks'];
	webhookHooks?: InternalOnePasswordPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof onePasswordEndpointsNested>;
};

export type OnePasswordContext = CorsairPluginContext<
	typeof OnePasswordSchema,
	OnePasswordPluginOptions
>;

export type OnePasswordKeyBuilderContext = KeyBuilderContext<OnePasswordPluginOptions>;

export type OnePasswordBoundEndpoints = BindEndpoints<typeof onePasswordEndpointsNested>;

type OnePasswordEndpoint<
	K extends keyof OnePasswordEndpointOutputs,
> = CorsairEndpoint<
	OnePasswordContext,
	OnePasswordEndpointInputs[K],
	OnePasswordEndpointOutputs[K]
>;

export type OnePasswordEndpoints = {
	vaultsList: OnePasswordEndpoint<'vaultsList'>;
	vaultsGet: OnePasswordEndpoint<'vaultsGet'>;
	itemsList: OnePasswordEndpoint<'itemsList'>;
	itemsGet: OnePasswordEndpoint<'itemsGet'>;
	itemsCreate: OnePasswordEndpoint<'itemsCreate'>;
	itemsUpdate: OnePasswordEndpoint<'itemsUpdate'>;
	itemsDelete: OnePasswordEndpoint<'itemsDelete'>;
};

export type OnePasswordWebhooks = Record<string, never>;

export type OnePasswordBoundWebhooks = BindWebhooks<OnePasswordWebhooks>;

const onePasswordEndpointsNested = {
	vaults: {
		list: Vaults.list,
		get: Vaults.get,
	},
	items: {
		list: Items.list,
		get: Items.get,
		create: Items.create,
		update: Items.update,
		delete: Items.delete,
	},
} as const;

const onePasswordWebhooksNested = {} as const;

export const onePasswordEndpointSchemas = {
	'vaults.list': {
		input: OnePasswordEndpointInputSchemas.vaultsList,
		output: OnePasswordEndpointOutputSchemas.vaultsList,
	},
	'vaults.get': {
		input: OnePasswordEndpointInputSchemas.vaultsGet,
		output: OnePasswordEndpointOutputSchemas.vaultsGet,
	},
	'items.list': {
		input: OnePasswordEndpointInputSchemas.itemsList,
		output: OnePasswordEndpointOutputSchemas.itemsList,
	},
	'items.get': {
		input: OnePasswordEndpointInputSchemas.itemsGet,
		output: OnePasswordEndpointOutputSchemas.itemsGet,
	},
	'items.create': {
		input: OnePasswordEndpointInputSchemas.itemsCreate,
		output: OnePasswordEndpointOutputSchemas.itemsCreate,
	},
	'items.update': {
		input: OnePasswordEndpointInputSchemas.itemsUpdate,
		output: OnePasswordEndpointOutputSchemas.itemsUpdate,
	},
	'items.delete': {
		input: OnePasswordEndpointInputSchemas.itemsDelete,
		output: OnePasswordEndpointOutputSchemas.itemsDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof onePasswordEndpointsNested>;

const onePasswordWebhookSchemas = {} as const satisfies RequiredPluginWebhookSchemas<typeof onePasswordWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const onePasswordEndpointMeta = {
	'vaults.list': {
		riskLevel: 'read',
		description: 'List all vaults the integration can access',
	},
	'vaults.get': {
		riskLevel: 'read',
		description: 'Get details of a specific vault by ID',
	},
	'items.list': {
		riskLevel: 'read',
		description: 'List all items inside a specific vault',
	},
	'items.get': {
		riskLevel: 'read',
		description: 'Get details of a vault item (e.g. login credentials, notes)',
	},
	'items.create': {
		riskLevel: 'write',
		description: 'Create a new item in a vault',
	},
	'items.update': {
		riskLevel: 'write',
		description: 'Update details of an existing vault item',
	},
	'items.delete': {
		riskLevel: 'destructive',
		description: 'Delete an item from a vault [DESTRUCTIVE]',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof onePasswordEndpointsNested>;

export const onePasswordAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseOnePasswordPlugin<T extends OnePasswordPluginOptions> = CorsairPlugin<
	'onepassword',
	typeof OnePasswordSchema,
	typeof onePasswordEndpointsNested,
	typeof onePasswordWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalOnePasswordPlugin = BaseOnePasswordPlugin<OnePasswordPluginOptions>;

export type ExternalOnePasswordPlugin<T extends OnePasswordPluginOptions> =
	BaseOnePasswordPlugin<T>;

export function onepassword<const T extends OnePasswordPluginOptions>(
	incomingOptions: OnePasswordPluginOptions & T = {} as OnePasswordPluginOptions & T,
): ExternalOnePasswordPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'onepassword',
		schema: OnePasswordSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: onePasswordEndpointsNested,
		webhooks: onePasswordWebhooksNested,
		endpointMeta: onePasswordEndpointMeta,
		endpointSchemas: onePasswordEndpointSchemas,
		webhookSchemas: onePasswordWebhookSchemas,
		pluginWebhookMatcher: () => {
			return false;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: OnePasswordKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalOnePasswordPlugin;
}

export type {
	OnePasswordEndpointInputs,
	OnePasswordEndpointOutputs,
	VaultsListInput,
	VaultsListResponse,
	VaultsGetInput,
	VaultsGetResponse,
	ItemsListInput,
	ItemsListResponse,
	ItemsGetInput,
	ItemsGetResponse,
	ItemsCreateInput,
	ItemsCreateResponse,
	ItemsUpdateInput,
	ItemsUpdateResponse,
	ItemsDeleteInput,
	ItemsDeleteResponse,
} from './endpoints/types';
