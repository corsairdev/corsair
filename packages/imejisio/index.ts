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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Designs } from './endpoints';
import type {
	ImejisioEndpointInputs,
	ImejisioEndpointOutputs,
} from './endpoints/types';
import {
	ImejisioEndpointInputSchemas,
	ImejisioEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ImejisioSchema } from './schema';

export type ImejisioPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalImejisioPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof imejisioEndpointsNested>;
};

export type ImejisioContext = CorsairPluginContext<
	typeof ImejisioSchema,
	ImejisioPluginOptions
>;

export type ImejisioKeyBuilderContext =
	KeyBuilderContext<ImejisioPluginOptions>;

export type ImejisioBoundEndpoints = BindEndpoints<
	typeof imejisioEndpointsNested
>;

type ImejisioEndpoint<K extends keyof ImejisioEndpointOutputs> =
	CorsairEndpoint<
		ImejisioContext,
		ImejisioEndpointInputs[K],
		ImejisioEndpointOutputs[K]
	>;

export type ImejisioEndpoints = {
	listDesigns: ImejisioEndpoint<'listDesigns'>;
};

export type ImejisioWebhooks = {};

const imejisioEndpointsNested = {
	designs: {
		list: Designs.list,
	},
} as const;

const imejisioWebhooksNested = {} as const;

export const imejisioEndpointSchemas = {
	'designs.list': {
		input: ImejisioEndpointInputSchemas.listDesigns,
		output: ImejisioEndpointOutputSchemas.listDesigns,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof imejisioEndpointsNested
>;

const imejisioWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof imejisioWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const imejisioEndpointMeta = {
	'designs.list': {
		riskLevel: 'read',
		description: "List the authenticated user's designs",
	},
} as const satisfies RequiredPluginEndpointMeta<typeof imejisioEndpointsNested>;

export const imejisioAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseImejisioPlugin<T extends ImejisioPluginOptions> = CorsairPlugin<
	'imejisio',
	typeof ImejisioSchema,
	typeof imejisioEndpointsNested,
	typeof imejisioWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalImejisioPlugin = BaseImejisioPlugin<ImejisioPluginOptions>;

export type ExternalImejisioPlugin<T extends ImejisioPluginOptions> =
	BaseImejisioPlugin<T>;

export function imejisio<const T extends ImejisioPluginOptions>(
	incomingOptions: ImejisioPluginOptions & T = {} as ImejisioPluginOptions & T,
): ExternalImejisioPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'imejisio',
		authConfig: imejisioAuthConfig,
		schema: ImejisioSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: imejisioEndpointsNested,
		webhooks: imejisioWebhooksNested,
		endpointMeta: imejisioEndpointMeta,
		endpointSchemas: imejisioEndpointSchemas,
		webhookSchemas: imejisioWebhookSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ImejisioKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('imejisio', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('imejisio', 'api_key');
		},
	} satisfies InternalImejisioPlugin;
}

export type {
	DesignSummary,
	ImejisioEndpointInputs,
	ImejisioEndpointOutputs,
	ListDesignsInput,
	PaginatedDesigns,
} from './endpoints/types';
