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
import { Posts } from './endpoints';
import type {
	BeamerEndpointInputs,
	BeamerEndpointOutputs,
} from './endpoints/types';
import {
	BeamerEndpointInputSchemas,
	BeamerEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BeamerSchema } from './schema';

export type BeamerPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBeamerPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof beamerEndpointsNested>;
};

export type BeamerContext = CorsairPluginContext<
	typeof BeamerSchema,
	BeamerPluginOptions
>;

export type BeamerKeyBuilderContext = KeyBuilderContext<BeamerPluginOptions>;

export type BeamerBoundEndpoints = BindEndpoints<typeof beamerEndpointsNested>;

type BeamerEndpoint<K extends keyof BeamerEndpointOutputs> = CorsairEndpoint<
	BeamerContext,
	BeamerEndpointInputs[K],
	BeamerEndpointOutputs[K]
>;

export type BeamerEndpoints = {
	postsGet: BeamerEndpoint<'postsGet'>;
};

const beamerEndpointsNested = {
	posts: {
		get: Posts.get,
	},
} as const;

export const beamerEndpointSchemas = {
	'posts.get': {
		input: BeamerEndpointInputSchemas.postsGet,
		output: BeamerEndpointOutputSchemas.postsGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof beamerEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key';

const beamerEndpointMeta = {
	'posts.get': {
		riskLevel: 'read',
		description: 'Get Beamer posts',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof beamerEndpointsNested>;

export const beamerAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBeamerPlugin<T extends BeamerPluginOptions> = CorsairPlugin<
	'beamer',
	typeof BeamerSchema,
	typeof beamerEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalBeamerPlugin = BaseBeamerPlugin<BeamerPluginOptions>;

export type ExternalBeamerPlugin<T extends BeamerPluginOptions> =
	BaseBeamerPlugin<T>;

export function beamer<const T extends BeamerPluginOptions>(
	incomingOptions: BeamerPluginOptions & T = {} as BeamerPluginOptions & T,
): ExternalBeamerPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'beamer',
		authConfig: beamerAuthConfig,
		schema: BeamerSchema,
		options,
		hooks: options.hooks,
		endpoints: beamerEndpointsNested,
		webhooks: {},
		endpointMeta: beamerEndpointMeta,
		endpointSchemas: beamerEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},

		keyBuilder: async (ctx: BeamerKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key !== undefined) {
				if (!options.key.trim()) {
					throw new AuthMissingError('beamer', 'api_key');
				}
				return options.key;
			}

			if (source === 'endpoint') {
				const res = await ctx.keys.get_api_key();
				if (!res?.trim()) {
					throw new AuthMissingError('beamer', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('beamer', 'api_key');
		},
	} satisfies InternalBeamerPlugin;
}

export type {
	BeamerEndpointInputs,
	BeamerEndpointOutputs,
	PostsGetInput,
	PostsGetResponse,
} from './endpoints/types';
