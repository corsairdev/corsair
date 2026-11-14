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
import { check } from './endpoints';
import type {
	NeverBounceEndpointInputs,
	NeverBounceEndpointOutputs,
} from './endpoints/types';
import {
	NeverBounceEndpointInputSchemas,
	NeverBounceEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { NeverBounceSchema } from './schema';

export type NeverBouncePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalNeverBouncePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof neverbounceEndpointsNested>;
};

export type NeverBounceContext = CorsairPluginContext<
	typeof NeverBounceSchema,
	NeverBouncePluginOptions
>;

export type NeverBounceKeyBuilderContext =
	KeyBuilderContext<NeverBouncePluginOptions>;
export type NeverBounceBoundEndpoints = BindEndpoints<
	typeof neverbounceEndpointsNested
>;
export type NeverBounceEndpoints = {
	check: CorsairEndpoint<
		NeverBounceContext,
		NeverBounceEndpointInputs['check'],
		NeverBounceEndpointOutputs['check']
	>;
};

const neverbounceEndpointsNested = { single: { check } } as const;

export const neverbounceEndpointSchemas = {
	'single.check': {
		input: NeverBounceEndpointInputSchemas.check,
		output: NeverBounceEndpointOutputSchemas.check,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof neverbounceEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;
const neverbounceEndpointMeta = {
	'single.check': {
		riskLevel: 'destructive',
		description: 'Verify an email address; verification may consume credits',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof neverbounceEndpointsNested
>;

export const neverbounceAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type BaseNeverBouncePlugin<T extends NeverBouncePluginOptions> =
	CorsairPlugin<
		'neverbounce',
		typeof NeverBounceSchema,
		typeof neverbounceEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;
export type InternalNeverBouncePlugin =
	BaseNeverBouncePlugin<NeverBouncePluginOptions>;
export type ExternalNeverBouncePlugin<T extends NeverBouncePluginOptions> =
	BaseNeverBouncePlugin<T>;

export function neverbounce<const T extends NeverBouncePluginOptions>(
	incomingOptions: NeverBouncePluginOptions &
		T = {} as NeverBouncePluginOptions & T,
): ExternalNeverBouncePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
	return {
		id: 'neverbounce',
		authConfig: neverbounceAuthConfig,
		schema: NeverBounceSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: neverbounceEndpointsNested,
		endpointMeta: neverbounceEndpointMeta,
		endpointSchemas: neverbounceEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...specificDefaults,
			...options.errorHandlers,
			DEFAULT: options.errorHandlers?.DEFAULT ?? defaultHandler,
		},
		keyBuilder: async (ctx: NeverBounceKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key) return key;
			}
			throw new AuthMissingError('neverbounce', 'api_key');
		},
	} satisfies InternalNeverBouncePlugin;
}

export type {
	CheckInput,
	CheckResponse,
	NeverBounceEndpointInputs,
	NeverBounceEndpointOutputs,
} from './endpoints/types';
