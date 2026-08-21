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
import { Domain } from './endpoints';
import type {
	SecuritytrailsEndpointInputs,
	SecuritytrailsEndpointOutputs,
} from './endpoints/types';
import {
	SecuritytrailsEndpointInputSchemas,
	SecuritytrailsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SecuritytrailsSchema } from './schema';

export type SecuritytrailsPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalSecuritytrailsPlugin['hooks'];
	webhookHooks?: InternalSecuritytrailsPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof securitytrailsEndpointsNested>;
};

export type SecuritytrailsContext = CorsairPluginContext<
	typeof SecuritytrailsSchema,
	SecuritytrailsPluginOptions
>;

export type SecuritytrailsKeyBuilderContext =
	KeyBuilderContext<SecuritytrailsPluginOptions>;

export type SecuritytrailsBoundEndpoints = BindEndpoints<
	typeof securitytrailsEndpointsNested
>;

type SecuritytrailsEndpoint<K extends keyof SecuritytrailsEndpointOutputs> =
	CorsairEndpoint<
		SecuritytrailsContext,
		SecuritytrailsEndpointInputs[K],
		SecuritytrailsEndpointOutputs[K]
	>;

export type SecuritytrailsEndpoints = {
	domainGet: SecuritytrailsEndpoint<'domainGet'>;
};

const securitytrailsEndpointsNested = {
	domain: {
		get: Domain.get,
	},
} as const;

const securitytrailsWebhooksNested = {} as const;
export const securitytrailsEndpointSchemas = {
	'domain.get': {
		input: SecuritytrailsEndpointInputSchemas.domainGet,
		output: SecuritytrailsEndpointOutputSchemas.domainGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof securitytrailsEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const securitytrailsEndpointMeta = {
	'domain.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof securitytrailsEndpointsNested
>;

export const securitytrailsAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseSecuritytrailsPlugin<T extends SecuritytrailsPluginOptions> =
	CorsairPlugin<
		'securitytrails',
		typeof SecuritytrailsSchema,
		typeof securitytrailsEndpointsNested,
		typeof securitytrailsWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalSecuritytrailsPlugin =
	BaseSecuritytrailsPlugin<SecuritytrailsPluginOptions>;

export type ExternalSecuritytrailsPlugin<
	T extends SecuritytrailsPluginOptions,
> = BaseSecuritytrailsPlugin<T>;

export function securitytrails<const T extends SecuritytrailsPluginOptions>(
	incomingOptions: SecuritytrailsPluginOptions &
		T = {} as SecuritytrailsPluginOptions & T,
): ExternalSecuritytrailsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'securitytrails',
		authConfig: securitytrailsAuthConfig,
		schema: SecuritytrailsSchema,
		options: options,
		hooks: options.hooks,
		endpoints: securitytrailsEndpointsNested,
		endpointMeta: securitytrailsEndpointMeta,
		endpointSchemas: securitytrailsEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SecuritytrailsKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalSecuritytrailsPlugin;
}

export type {
	DomainGetInput,
	DomainGetResponse,
	SecuritytrailsEndpointInputs,
	SecuritytrailsEndpointOutputs,
} from './endpoints/types';
