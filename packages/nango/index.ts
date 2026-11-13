import type {
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
import { AuthMissingError } from 'corsair/core';
import type { z } from 'zod';
import { endpoints } from './endpoints';
import { EndpointInputSchemas, EndpointOutputSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { NangoSchema } from './schema';

export type NangoPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalNangoPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof endpoints>;
};
export type NangoContext = CorsairPluginContext<
	typeof NangoSchema,
	NangoPluginOptions
>;
export type NangoKeyBuilderContext = KeyBuilderContext<NangoPluginOptions>;
export type NangoBoundEndpoints = BindEndpoints<typeof endpoints>;

const schema = <K extends keyof typeof EndpointInputSchemas>(key: K) => ({
	input: EndpointInputSchemas[key],
	output: EndpointOutputSchemas[key],
});
export const nangoEndpointSchemas = {
	'connections.import': schema('connections.import'),
	'connections.list': schema('connections.list'),
	'connections.get': schema('connections.get'),
	'connections.patch': schema('connections.patch'),
	'connections.setMetadata': schema('connections.setMetadata'),
	'connections.updateMetadata': schema('connections.updateMetadata'),
	'connections.delete': schema('connections.delete'),
	'sessions.create': schema('sessions.create'),
	'sessions.reconnect': schema('sessions.reconnect'),
	'sessions.get': schema('sessions.get'),
	'sessions.delete': schema('sessions.delete'),
} satisfies RequiredPluginEndpointSchemas<typeof endpoints>;
export type NangoEndpointInputs = {
	[K in keyof typeof nangoEndpointSchemas]: z.input<
		(typeof nangoEndpointSchemas)[K]['input']
	>;
};
export type NangoEndpointOutputs = {
	[K in keyof typeof nangoEndpointSchemas]: z.output<
		(typeof nangoEndpointSchemas)[K]['output']
	>;
};

const endpointMeta = {
	'connections.import': {
		riskLevel: 'write',
		description: 'Import or update a connection with existing credentials',
	},
	'connections.list': { riskLevel: 'read', description: 'List connections' },
	'connections.get': {
		riskLevel: 'read',
		description: 'Get a connection and its credentials',
	},
	'connections.patch': { riskLevel: 'write', description: 'Edit a connection' },
	'connections.setMetadata': {
		riskLevel: 'write',
		description: 'Replace connection metadata',
	},
	'connections.updateMetadata': {
		riskLevel: 'write',
		description: 'Update connection metadata',
	},
	'connections.delete': {
		riskLevel: 'destructive',
		description: 'Delete a connection',
	},
	'sessions.create': {
		riskLevel: 'write',
		description: 'Create a connect session',
	},
	'sessions.reconnect': {
		riskLevel: 'write',
		description: 'Create a reconnect session',
	},
	'sessions.get': {
		riskLevel: 'read',
		description: 'Get a connect session using its token',
	},
	'sessions.delete': {
		riskLevel: 'destructive',
		description: 'Delete a connect session using its token',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof endpoints>;
export const nangoAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;
const defaultAuthType = 'api_key' as const;
export type BaseNangoPlugin<T extends NangoPluginOptions> = CorsairPlugin<
	'nango',
	typeof NangoSchema,
	typeof endpoints,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;
export type InternalNangoPlugin = BaseNangoPlugin<NangoPluginOptions>;
export type ExternalNangoPlugin<T extends NangoPluginOptions> =
	BaseNangoPlugin<T>;

export function nango(): ExternalNangoPlugin<{}>;
export function nango<const T extends NangoPluginOptions>(
	options: NangoPluginOptions & T,
): ExternalNangoPlugin<T>;
export function nango(
	incomingOptions: NangoPluginOptions = {},
): InternalNangoPlugin {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'nango',
		authConfig: nangoAuthConfig,
		schema: NangoSchema,
		options,
		hooks: options.hooks,
		endpoints,
		webhooks: {},
		endpointMeta,
		endpointSchemas: nangoEndpointSchemas,
		errorHandlers: {
			RATE_LIMIT_ERROR: errorHandlers.RATE_LIMIT_ERROR,
			...options.errorHandlers,
			DEFAULT: options.errorHandlers?.DEFAULT ?? errorHandlers.DEFAULT,
		},
		keyBuilder: async (ctx: NangoKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			// These two routes use the session token supplied in the input instead
			// of an environment key; do not require both credentials.
			if (
				ctx.meteredOperationId === 'sessions.get' ||
				ctx.meteredOperationId === 'sessions.delete'
			)
				return '';
			if (options.key?.trim()) return options.key;
			if (!ctx.keys) throw new AuthMissingError('nango', options.authType);
			const key = await ctx.keys.get_api_key();
			if (key?.trim()) return key;
			throw new AuthMissingError('nango', ctx.authType);
		},
	} satisfies InternalNangoPlugin;
}
export { NangoError } from './client';
export * from './endpoints/types';
