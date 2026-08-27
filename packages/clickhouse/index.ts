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
import { Query } from './endpoints';
import type {
	ClickhouseEndpointInputs,
	ClickhouseEndpointOutputs,
} from './endpoints/types';
import {
	ClickhouseEndpointInputSchemas,
	ClickhouseEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ClickhouseSchema } from './schema';

/**
 * Per-tenant ClickHouse HTTP endpoint (no trailing slash), e.g.
 * `https://ch.example.com:8443`. Each account stores this alongside its
 * basic-auth credential so different tenants can target different clusters.
 */
export type ClickhousePluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** HTTP endpoint of the ClickHouse server the plugin will query. */
	baseUrl?: string;
	key?: string;
	hooks?: InternalClickhousePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof clickhouseEndpointsNested>;
};

export type ClickhouseContext = CorsairPluginContext<
	typeof ClickhouseSchema,
	ClickhousePluginOptions
>;

export type ClickhouseKeyBuilderContext =
	KeyBuilderContext<ClickhousePluginOptions>;

export type ClickhouseBoundEndpoints = BindEndpoints<
	typeof clickhouseEndpointsNested
>;

type ClickhouseEndpoint<K extends keyof ClickhouseEndpointOutputs> =
	CorsairEndpoint<
		ClickhouseContext,
		ClickhouseEndpointInputs[K],
		ClickhouseEndpointOutputs[K]
	>;

export type ClickhouseEndpoints = {
	executeQuery: ClickhouseEndpoint<'executeQuery'>;
};

// ClickHouse has no inbound webhook surface — queries are pull-only.
const clickhouseWebhooksNested = {} as const;

const clickhouseEndpointsNested = {
	query: {
		execute: Query.execute,
	},
} as const;

export const clickhouseEndpointSchemas = {
	'query.execute': {
		input: ClickhouseEndpointInputSchemas.executeQuery,
		output: ClickhouseEndpointOutputSchemas.executeQuery,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof clickhouseEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const clickhouseEndpointMeta = {
	'query.execute': {
		riskLevel: 'read' as const,
		description:
			'Execute a SQL query against the tenant ClickHouse instance and return the result rows.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof clickhouseEndpointsNested
>;

export const clickhouseAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseClickhousePlugin<T extends ClickhousePluginOptions> =
	CorsairPlugin<
		'clickhouse',
		typeof ClickhouseSchema,
		typeof clickhouseEndpointsNested,
		typeof clickhouseWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalClickhousePlugin =
	BaseClickhousePlugin<ClickhousePluginOptions>;

export type ExternalClickhousePlugin<T extends ClickhousePluginOptions> =
	BaseClickhousePlugin<T>;

export function clickhouse<const T extends ClickhousePluginOptions>(
	incomingOptions: ClickhousePluginOptions & T = {} as ClickhousePluginOptions &
		T,
): ExternalClickhousePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'clickhouse',
		authConfig: clickhouseAuthConfig,
		schema: ClickhouseSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: clickhouseEndpointsNested,
		webhooks: clickhouseWebhooksNested,
		endpointMeta: clickhouseEndpointMeta,
		endpointSchemas: clickhouseEndpointSchemas,
		// No inbound webhook surface — ClickHouse HTTP is request/response only.
		pluginWebhookMatcher: (_request) => false,
		pluginTenantWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ClickhouseKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (ctx.authType === 'api_key') {
				const stored = await ctx.keys.get_api_key();
				if (!stored) {
					throw new AuthMissingError('clickhouse', 'api_key');
				}
				return stored.startsWith('Basic ') ? stored : `Basic ${stored}`;
			}
			throw new AuthMissingError('clickhouse', 'api_key');
		},
	} satisfies InternalClickhousePlugin;
}

export type {
	ClickhouseEndpointInputs,
	ClickhouseEndpointOutputs,
	ExecuteQueryInput,
	ExecuteQueryResponse,
} from './endpoints/types';
export {
	ClickhouseEndpointInputSchemas,
	ClickhouseEndpointOutputSchemas,
} from './endpoints/types';
export { ClickhouseSchema } from './schema';
