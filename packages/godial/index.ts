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
import { Contacts, Lists } from './endpoints';
import type {
	GoDialEndpointInputs,
	GoDialEndpointOutputs,
} from './endpoints/types';
import {
	GoDialEndpointInputSchemas,
	GoDialEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GoDialSchema } from './schema';

export type GoDialPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalGoDialPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof goDialEndpointsNested>;
};

export type GoDialContext = CorsairPluginContext<
	typeof GoDialSchema,
	GoDialPluginOptions
>;

export type GoDialKeyBuilderContext = KeyBuilderContext<GoDialPluginOptions>;
export type GoDialBoundEndpoints = BindEndpoints<typeof goDialEndpointsNested>;

type GoDialEndpoint<K extends keyof GoDialEndpointOutputs> = CorsairEndpoint<
	GoDialContext,
	GoDialEndpointInputs[K],
	GoDialEndpointOutputs[K]
>;

export type GoDialEndpoints = {
	listsList: GoDialEndpoint<'listsList'>;
	contactsAdd: GoDialEndpoint<'contactsAdd'>;
};

const goDialEndpointsNested = {
	lists: { list: Lists.list },
	contacts: { add: Contacts.add },
} as const;

export const goDialEndpointSchemas = {
	'lists.list': {
		input: GoDialEndpointInputSchemas.listsList,
		output: GoDialEndpointOutputSchemas.listsList,
	},
	'contacts.add': {
		input: GoDialEndpointInputSchemas.contactsAdd,
		output: GoDialEndpointOutputSchemas.contactsAdd,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof goDialEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const goDialEndpointMeta = {
	'lists.list': {
		riskLevel: 'read',
		description: 'List the authenticated GoDial account’s lists',
	},
	'contacts.add': {
		riskLevel: 'write',
		description: 'Add a contact to a GoDial list',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof goDialEndpointsNested>;

export const goDialAuthConfig = {
	api_key: {
		account: ['tenant_external_id'],
	},
} as const satisfies PluginAuthConfig;

export type BaseGoDialPlugin<T extends GoDialPluginOptions> = CorsairPlugin<
	'godial',
	typeof GoDialSchema,
	typeof goDialEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalGoDialPlugin = BaseGoDialPlugin<GoDialPluginOptions>;
export type ExternalGoDialPlugin<T extends GoDialPluginOptions> =
	BaseGoDialPlugin<T>;

export function godial<const T extends GoDialPluginOptions>(
	incomingOptions: GoDialPluginOptions & T = {} as GoDialPluginOptions & T,
): ExternalGoDialPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'godial',
		authConfig: goDialAuthConfig,
		schema: GoDialSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: goDialEndpointsNested,
		webhooks: {},
		endpointMeta: goDialEndpointMeta,
		endpointSchemas: goDialEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: GoDialKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key !== undefined) {
				if (options.key.length === 0) {
					throw new AuthMissingError('godial', 'api_key');
				}
				return options.key;
			}
			const apiKey = await ctx.keys?.get_api_key();
			if (!apiKey) throw new AuthMissingError('godial', 'api_key');
			return apiKey;
		},
	} satisfies InternalGoDialPlugin;
}

export type {
	AddContactInput,
	GoDialEndpointInputs,
	GoDialEndpointOutputs,
} from './endpoints/types';
