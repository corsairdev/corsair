import type {
	AuthTypes,
	CorsairErrorHandler,
	CorsairPlugin,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import type { EchtpostContext } from './context';
import { listTemplates } from './endpoints';
import {
	ListTemplatesInputSchema,
	ListTemplatesResponseSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { EchtpostSchema } from './schema';

export type { EchtpostContext };

export type EchtpostPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalEchtpostPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof echtpostEndpointsNested>;
};

export type EchtpostKeyBuilderContext =
	KeyBuilderContext<EchtpostPluginOptions>;

const echtpostEndpointsNested = {
	templates: { list: listTemplates },
} as const;

const echtpostWebhooksNested = {} as const;

export const echtpostEndpointSchemas = {
	'templates.list': {
		input: ListTemplatesInputSchema,
		output: ListTemplatesResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof echtpostEndpointsNested
>;

const echtpostEndpointMeta = {
	'templates.list': {
		riskLevel: 'read',
		description: 'List saved Echtpost postcard templates.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof echtpostEndpointsNested>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const echtpostAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseEchtpostPlugin<T extends EchtpostPluginOptions> = CorsairPlugin<
	'echtpost',
	typeof EchtpostSchema,
	typeof echtpostEndpointsNested,
	typeof echtpostWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalEchtpostPlugin = BaseEchtpostPlugin<EchtpostPluginOptions>;

export type ExternalEchtpostPlugin<T extends EchtpostPluginOptions> =
	BaseEchtpostPlugin<T>;

export function echtpost<const T extends EchtpostPluginOptions>(
	incomingOptions: EchtpostPluginOptions & T = {} as EchtpostPluginOptions & T,
): ExternalEchtpostPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'echtpost',
		authConfig: echtpostAuthConfig,
		schema: EchtpostSchema,
		options,
		hooks: options.hooks,
		endpoints: echtpostEndpointsNested,
		webhooks: echtpostWebhooksNested,
		endpointMeta: echtpostEndpointMeta,
		endpointSchemas: echtpostEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: EchtpostKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				return key ?? '';
			}
			return '';
		},
	} satisfies InternalEchtpostPlugin;
}
