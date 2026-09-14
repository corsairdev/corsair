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
import { Contacts } from './endpoints';
import type {
	AgiledEndpointInputs,
	AgiledEndpointOutputs,
} from './endpoints/types';
import {
	AgiledEndpointInputSchemas,
	AgiledEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AgiledSchema } from './schema';

export type AgiledPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalAgiledPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof agiledEndpointsNested>;
};

export type AgiledContext = CorsairPluginContext<
	typeof AgiledSchema,
	AgiledPluginOptions
>;

export type AgiledKeyBuilderContext = KeyBuilderContext<AgiledPluginOptions>;

export type AgiledBoundEndpoints = BindEndpoints<typeof agiledEndpointsNested>;

type AgiledEndpoint<K extends keyof AgiledEndpointOutputs> = CorsairEndpoint<
	AgiledContext,
	AgiledEndpointInputs[K],
	AgiledEndpointOutputs[K]
>;

export type AgiledEndpoints = {
	listContacts: AgiledEndpoint<'listContacts'>;
};

const agiledEndpointsNested = {
	contacts: {
		list: Contacts.list,
	},
} as const;

export const agiledEndpointSchemas = {
	'contacts.list': {
		input: AgiledEndpointInputSchemas.listContacts,
		output: AgiledEndpointOutputSchemas.listContacts,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof agiledEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const agiledEndpointMeta = {
	'contacts.list': {
		riskLevel: 'read',
		description: 'List contacts from an Agiled workspace',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof agiledEndpointsNested>;

export const agiledAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAgiledPlugin<T extends AgiledPluginOptions> = CorsairPlugin<
	'agiled',
	typeof AgiledSchema,
	typeof agiledEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalAgiledPlugin = BaseAgiledPlugin<AgiledPluginOptions>;

export type ExternalAgiledPlugin<T extends AgiledPluginOptions> =
	BaseAgiledPlugin<T>;

export function agiled<const T extends AgiledPluginOptions>(
	incomingOptions: AgiledPluginOptions & T = {} as AgiledPluginOptions & T,
): ExternalAgiledPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'agiled',
		authConfig: agiledAuthConfig,
		schema: AgiledSchema,
		options: options,
		hooks: options.hooks,
		endpoints: agiledEndpointsNested,
		webhooks: {},
		endpointMeta: agiledEndpointMeta,
		endpointSchemas: agiledEndpointSchemas,
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: () => null,
		oauthWebhookTenantLinkResolver: () => null,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AgiledKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('agiled', 'api_key');
		},
	} satisfies InternalAgiledPlugin;
}

export type {
	AgiledEndpointInputs,
	AgiledEndpointOutputs,
	ListContactsInput,
	ListContactsResponse,
} from './endpoints/types';
