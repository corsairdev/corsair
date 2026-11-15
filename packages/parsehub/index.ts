import type {
	AuthTypes,
	BindEndpoints,
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
import { Projects } from './endpoints';
import {
	ListProjectsInputSchema,
	ListProjectsResponseSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ParsehubSchema } from './schema';

export type ParsehubPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalParsehubPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof parsehubEndpointsNested>;
};

export type ParsehubContext = CorsairPluginContext<
	typeof ParsehubSchema,
	ParsehubPluginOptions
>;

export type ParsehubKeyBuilderContext =
	KeyBuilderContext<ParsehubPluginOptions>;

const parsehubEndpointsNested = {
	projects: Projects,
} as const;

const parsehubWebhooksNested = {} as const;

export type ParsehubBoundEndpoints = BindEndpoints<
	typeof parsehubEndpointsNested
>;

export const parsehubEndpointSchemas = {
	'projects.list': {
		input: ListProjectsInputSchema,
		output: ListProjectsResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof parsehubEndpointsNested
>;

const parsehubEndpointMeta = {
	'projects.list': {
		riskLevel: 'read',
		description: 'List projects for the authenticated ParseHub account.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof parsehubEndpointsNested>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const parsehubAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseParsehubPlugin<T extends ParsehubPluginOptions> = CorsairPlugin<
	'parsehub',
	typeof ParsehubSchema,
	typeof parsehubEndpointsNested,
	typeof parsehubWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalParsehubPlugin = BaseParsehubPlugin<ParsehubPluginOptions>;

export type ExternalParsehubPlugin<T extends ParsehubPluginOptions> =
	BaseParsehubPlugin<T>;

export function parsehub<const T extends ParsehubPluginOptions>(
	incomingOptions: ParsehubPluginOptions & T = {} as ParsehubPluginOptions & T,
): ExternalParsehubPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'parsehub',
		authConfig: parsehubAuthConfig,
		schema: ParsehubSchema,
		options,
		hooks: options.hooks,
		endpoints: parsehubEndpointsNested,
		webhooks: parsehubWebhooksNested,
		endpointMeta: parsehubEndpointMeta,
		endpointSchemas: parsehubEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ParsehubKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				return key ?? '';
			}

			return '';
		},
	} satisfies InternalParsehubPlugin;
}
