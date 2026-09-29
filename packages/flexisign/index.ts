import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
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
import { Templates } from './endpoints';
import type {
	FlexisignEndpointInputs,
	FlexisignEndpointOutputs,
} from './endpoints/types';
import {
	FlexisignEndpointInputSchemas,
	FlexisignEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { FlexisignSchema } from './schema';

export type FlexisignPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalFlexisignPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof flexisignEndpointsNested>;
};

export type FlexisignContext = CorsairPluginContext<
	typeof FlexisignSchema,
	FlexisignPluginOptions
>;

export type FlexisignKeyBuilderContext =
	KeyBuilderContext<FlexisignPluginOptions>;

export type FlexisignBoundEndpoints = BindEndpoints<
	typeof flexisignEndpointsNested
>;

type FlexisignEndpoint<K extends keyof FlexisignEndpointOutputs> =
	CorsairEndpoint<
		FlexisignContext,
		FlexisignEndpointInputs[K],
		FlexisignEndpointOutputs[K]
	>;

export type FlexisignEndpoints = {
	ListTemplates: FlexisignEndpoint<'ListTemplates'>;
};

export type FlexisignWebhooks = Record<string, never>;
export type FlexisignBoundWebhooks = BindWebhooks<FlexisignWebhooks>;

const flexisignEndpointsNested = {
	list: { templates: Templates.listTemplates },
} as const;

const flexisignWebhooksNested = {} as const;

export const flexisignEndpointSchemas = {
	'list.templates': {
		input: FlexisignEndpointInputSchemas.ListTemplates,
		output: FlexisignEndpointOutputSchemas.ListTemplates,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof flexisignEndpointsNested
>;

const flexisignWebhookSchemas = {} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

const flexisignEndpointMeta = {
	'list.templates': {
		riskLevel: 'read',
		description: 'List all available document templates in FlexiSign',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof flexisignEndpointsNested
>;

export const flexisignAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseFlexisignPlugin<T extends FlexisignPluginOptions> =
	CorsairPlugin<
		'flexisign',
		typeof FlexisignSchema,
		typeof flexisignEndpointsNested,
		typeof flexisignWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalFlexisignPlugin =
	BaseFlexisignPlugin<FlexisignPluginOptions>;

export type ExternalFlexisignPlugin<T extends FlexisignPluginOptions> =
	BaseFlexisignPlugin<T>;

export function flexisign<const T extends FlexisignPluginOptions>(
	incomingOptions: FlexisignPluginOptions & T = {} as FlexisignPluginOptions &
		T,
): ExternalFlexisignPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'flexisign',
		authConfig: flexisignAuthConfig,
		schema: FlexisignSchema,
		options: options,
		hooks: options.hooks,
		endpoints: flexisignEndpointsNested,
		webhooks: flexisignWebhooksNested,
		endpointMeta: flexisignEndpointMeta,
		endpointSchemas: flexisignEndpointSchemas,
		webhookSchemas: flexisignWebhookSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: FlexisignKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('flexisign', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('flexisign', 'api_key');
		},
	} satisfies InternalFlexisignPlugin;
}

export type {
	FlexisignEndpointInputs,
	FlexisignEndpointOutputs,
	ListTemplatesInput,
	ListTemplatesResponse,
} from './endpoints/types';
