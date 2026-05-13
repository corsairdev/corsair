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
} from 'corsair/core';
import type { AuthTypes } from 'corsair/core';
import type { BitwardenEndpointInputs, BitwardenEndpointOutputs } from './endpoints/types';
import { BitwardenEndpointInputSchemas, BitwardenEndpointOutputSchemas } from './endpoints/types';
import type { BitwardenWebhookOutputs } from './webhooks/types';
import { Organizations, Collections, Members } from './endpoints';
import { BitwardenSchema } from './schema';
import { errorHandlers } from './error-handlers';

export type BitwardenPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalBitwardenPlugin['hooks'];
	webhookHooks?: InternalBitwardenPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof bitwardenEndpointsNested>;
};

export type BitwardenContext = CorsairPluginContext<
	typeof BitwardenSchema,
	BitwardenPluginOptions
>;

export type BitwardenKeyBuilderContext = KeyBuilderContext<BitwardenPluginOptions>;

export type BitwardenBoundEndpoints = BindEndpoints<typeof bitwardenEndpointsNested>;

type BitwardenEndpoint<
	K extends keyof BitwardenEndpointOutputs,
	Input,
> = CorsairEndpoint<BitwardenContext, Input, BitwardenEndpointOutputs[K]>;

export type BitwardenEndpoints = {
	organizationsList: BitwardenEndpoint<'organizationsList', BitwardenEndpointInputs['organizationsList']>;
	organizationsGet: BitwardenEndpoint<'organizationsGet', BitwardenEndpointInputs['organizationsGet']>;
	collectionsList: BitwardenEndpoint<'collectionsList', BitwardenEndpointInputs['collectionsList']>;
	collectionsGet: BitwardenEndpoint<'collectionsGet', BitwardenEndpointInputs['collectionsGet']>;
	membersList: BitwardenEndpoint<'membersList', BitwardenEndpointInputs['membersList']>;
	membersGet: BitwardenEndpoint<'membersGet', BitwardenEndpointInputs['membersGet']>;
};

type BitwardenWebhook<
	K extends keyof BitwardenWebhookOutputs,
	TEvent,
> = CorsairWebhook<BitwardenContext, TEvent, BitwardenWebhookOutputs[K]>;

export type BitwardenWebhooks = Record<string, never>;

export type BitwardenBoundWebhooks = BindWebhooks<BitwardenWebhooks>;

const bitwardenEndpointsNested = {
	organizations: {
		list: Organizations.list,
		get: Organizations.get,
	},
	collections: {
		list: Collections.list,
		get: Collections.get,
	},
	members: {
		list: Members.list,
		get: Members.get,
	},
} as const;

const bitwardenWebhooksNested = {} as const;

export const bitwardenEndpointSchemas = {
	'organizations.list': {
		input: BitwardenEndpointInputSchemas.organizationsList,
		output: BitwardenEndpointOutputSchemas.organizationsList,
	},
	'organizations.get': {
		input: BitwardenEndpointInputSchemas.organizationsGet,
		output: BitwardenEndpointOutputSchemas.organizationsGet,
	},
	'collections.list': {
		input: BitwardenEndpointInputSchemas.collectionsList,
		output: BitwardenEndpointOutputSchemas.collectionsList,
	},
	'collections.get': {
		input: BitwardenEndpointInputSchemas.collectionsGet,
		output: BitwardenEndpointOutputSchemas.collectionsGet,
	},
	'members.list': {
		input: BitwardenEndpointInputSchemas.membersList,
		output: BitwardenEndpointOutputSchemas.membersList,
	},
	'members.get': {
		input: BitwardenEndpointInputSchemas.membersGet,
		output: BitwardenEndpointOutputSchemas.membersGet,
	},
} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

const bitwardenEndpointMeta = {
	'organizations.list': {
		riskLevel: 'read',
		description: 'List all organizations the API key has access to',
	},
	'organizations.get': {
		riskLevel: 'read',
		description: 'Get details for a specific organization',
	},
	'collections.list': {
		riskLevel: 'read',
		description: 'List all collections in an organization',
	},
	'collections.get': {
		riskLevel: 'read',
		description: 'Get details for a specific collection',
	},
	'members.list': {
		riskLevel: 'read',
		description: 'List all members in an organization',
	},
	'members.get': {
		riskLevel: 'read',
		description: 'Get details for a specific organization member',
	},
} as const;

export const bitwardenAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBitwardenPlugin<T extends BitwardenPluginOptions> = CorsairPlugin<
	'bitwarden',
	typeof BitwardenSchema,
	typeof bitwardenEndpointsNested,
	typeof bitwardenWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalBitwardenPlugin = BaseBitwardenPlugin<BitwardenPluginOptions>;

export type ExternalBitwardenPlugin<T extends BitwardenPluginOptions> =
	BaseBitwardenPlugin<T>;

export function bitwarden<const T extends BitwardenPluginOptions>(
	incomingOptions: BitwardenPluginOptions & T = {} as BitwardenPluginOptions & T,
): ExternalBitwardenPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'bitwarden',
		schema: BitwardenSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: bitwardenEndpointsNested,
		webhooks: bitwardenWebhooksNested,
		endpointMeta: bitwardenEndpointMeta,
		endpointSchemas: bitwardenEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BitwardenKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalBitwardenPlugin;
}

export type {
	BitwardenEndpointInputs,
	BitwardenEndpointOutputs,
} from './endpoints/types';
