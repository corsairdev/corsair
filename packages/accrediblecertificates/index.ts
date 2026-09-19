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
import { GetCredential } from './endpoints';
import type {
	AccredibleCertificatesEndpointInputs,
	AccredibleCertificatesEndpointOutputs,
} from './endpoints/types';
import {
	AccredibleCertificatesEndpointInputSchemas,
	AccredibleCertificatesEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AccredibleCertificatesSchema } from './schema';

export type AccredibleCertificatesPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalAccredibleCertificatesPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<
		typeof accredibleCertificatesEndpointsNested
	>;
};

export type AccredibleCertificatesContext = CorsairPluginContext<
	typeof AccredibleCertificatesSchema,
	AccredibleCertificatesPluginOptions
>;

export type AccredibleCertificatesKeyBuilderContext =
	KeyBuilderContext<AccredibleCertificatesPluginOptions>;

export type AccredibleCertificatesBoundEndpoints = BindEndpoints<
	typeof accredibleCertificatesEndpointsNested
>;

type AccredibleCertificatesEndpoint<
	K extends keyof AccredibleCertificatesEndpointOutputs,
> = CorsairEndpoint<
	AccredibleCertificatesContext,
	AccredibleCertificatesEndpointInputs[K],
	AccredibleCertificatesEndpointOutputs[K]
>;

export type AccredibleCertificatesEndpoints = {
	getCredential: AccredibleCertificatesEndpoint<'getCredential'>;
};

const accredibleCertificatesEndpointsNested = {
	credentials: {
		get: GetCredential.get,
	},
} as const;

export const accredibleCertificatesEndpointSchemas = {
	'credentials.get': {
		input: AccredibleCertificatesEndpointInputSchemas.getCredential,
		output: AccredibleCertificatesEndpointOutputSchemas.getCredential,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof accredibleCertificatesEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const accredibleCertificatesEndpointMeta = {
	'credentials.get': {
		riskLevel: 'read',
		description: 'Get an credential resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof accredibleCertificatesEndpointsNested
>;

export const accredibleCertificatesAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAccredibleCertificatesPlugin<
	T extends AccredibleCertificatesPluginOptions,
> = CorsairPlugin<
	'accrediblecertificates',
	typeof AccredibleCertificatesSchema,
	typeof accredibleCertificatesEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalAccredibleCertificatesPlugin =
	BaseAccredibleCertificatesPlugin<AccredibleCertificatesPluginOptions>;

export type ExternalAccredibleCertificatesPlugin<
	T extends AccredibleCertificatesPluginOptions,
> = BaseAccredibleCertificatesPlugin<T>;

export function accrediblecertificates<
	const T extends AccredibleCertificatesPluginOptions,
>(
	incomingOptions: AccredibleCertificatesPluginOptions &
		T = {} as AccredibleCertificatesPluginOptions & T,
): ExternalAccredibleCertificatesPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'accrediblecertificates',
		authConfig: accredibleCertificatesAuthConfig,
		schema: AccredibleCertificatesSchema,
		options: options,
		hooks: options.hooks,
		endpoints: accredibleCertificatesEndpointsNested,
		webhooks: {},
		endpointMeta: accredibleCertificatesEndpointMeta,
		endpointSchemas: accredibleCertificatesEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (
			ctx: AccredibleCertificatesKeyBuilderContext,
			source,
		) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalAccredibleCertificatesPlugin;
}

export type {
	AccredibleCertificatesEndpointInputs,
	AccredibleCertificatesEndpointOutputs,
	GetCredentialInput,
	GetCredentialResponse,
} from './endpoints/types';
