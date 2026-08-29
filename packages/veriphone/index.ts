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
import { Verify } from './endpoints';
import type {
	VeriphoneEndpointInputs,
	VeriphoneEndpointOutputs,
} from './endpoints/types';
import {
	VeriphoneEndpointInputSchemas,
	VeriphoneEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { VeriphoneSchema } from './schema';

export type VeriphonePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalVeriphonePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof veriphoneEndpointsNested>;
};

export type VeriphoneContext = CorsairPluginContext<
	typeof VeriphoneSchema,
	VeriphonePluginOptions
>;

export type VeriphoneKeyBuilderContext =
	KeyBuilderContext<VeriphonePluginOptions>;

export type VeriphoneBoundEndpoints = BindEndpoints<
	typeof veriphoneEndpointsNested
>;

type VeriphoneEndpoint<K extends keyof VeriphoneEndpointOutputs> =
	CorsairEndpoint<
		VeriphoneContext,
		VeriphoneEndpointInputs[K],
		VeriphoneEndpointOutputs[K]
	>;

export type VeriphoneEndpoints = {
	verify: VeriphoneEndpoint<'verify'>;
};

const veriphoneEndpointsNested = {
	verify: Verify.verify,
} as const;

export const veriphoneEndpointSchemas = {
	verify: {
		input: VeriphoneEndpointInputSchemas.verify,
		output: VeriphoneEndpointOutputSchemas.verify,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof veriphoneEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key';

const veriphoneEndpointMeta = {
	verify: {
		riskLevel: 'read',
		description:
			'Verify a phone number and retrieve carrier and country information',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof veriphoneEndpointsNested
>;

export const veriphoneAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseVeriphonePlugin<T extends VeriphonePluginOptions> =
	CorsairPlugin<
		'veriphone',
		typeof VeriphoneSchema,
		typeof veriphoneEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalVeriphonePlugin =
	BaseVeriphonePlugin<VeriphonePluginOptions>;

export type ExternalVeriphonePlugin<T extends VeriphonePluginOptions> =
	BaseVeriphonePlugin<T>;

export function veriphone<const T extends VeriphonePluginOptions>(
	incomingOptions: VeriphonePluginOptions & T = {} as VeriphonePluginOptions &
		T,
): ExternalVeriphonePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'veriphone',
		authConfig: veriphoneAuthConfig,
		schema: VeriphoneSchema,
		options,
		hooks: options.hooks,
		endpoints: veriphoneEndpointsNested,
		webhooks: {},
		endpointMeta: veriphoneEndpointMeta,
		endpointSchemas: veriphoneEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: VeriphoneKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalVeriphonePlugin;
}

export type {
	VerifyInput,
	VerifyResponse,
	VeriphoneEndpointInputs,
	VeriphoneEndpointOutputs,
} from './endpoints/types';
