import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Tables } from './endpoints';
import type {
	NasdaqEndpointInputs,
	NasdaqEndpointOutputs,
} from './endpoints/types';
import {
	NasdaqEndpointInputSchemas,
	NasdaqEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { NasdaqSchema } from './schema';

export type NasdaqPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalNasdaqPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof nasdaqEndpointsNested>;
};

export type NasdaqContext = CorsairPluginContext<
	typeof NasdaqSchema,
	NasdaqPluginOptions
>;

export type NasdaqKeyBuilderContext = KeyBuilderContext<NasdaqPluginOptions>;

export type NasdaqBoundEndpoints = BindEndpoints<typeof nasdaqEndpointsNested>;

type NasdaqEndpoint<K extends keyof NasdaqEndpointOutputs> = CorsairEndpoint<
	NasdaqContext,
	NasdaqEndpointInputs[K],
	NasdaqEndpointOutputs[K]
>;

export type NasdaqEndpoints = {
	tablesRows: NasdaqEndpoint<'tablesRows'>;
	tablesMetadata: NasdaqEndpoint<'tablesMetadata'>;
	tablesExport: NasdaqEndpoint<'tablesExport'>;
};

export const nasdaqEndpointsNested = {
	tables: {
		rows: Tables.rows,
		metadata: Tables.metadata,
		export: Tables.exportTable,
	},
} as const;

export const nasdaqEndpointSchemas = {
	'tables.rows': {
		input: NasdaqEndpointInputSchemas.tablesRows,
		output: NasdaqEndpointOutputSchemas.tablesRows,
	},
	'tables.metadata': {
		input: NasdaqEndpointInputSchemas.tablesMetadata,
		output: NasdaqEndpointOutputSchemas.tablesMetadata,
	},
	'tables.export': {
		input: NasdaqEndpointInputSchemas.tablesExport,
		output: NasdaqEndpointOutputSchemas.tablesExport,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof nasdaqEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const nasdaqEndpointMeta = {
	'tables.rows': {
		riskLevel: 'read',
		description:
			'Read one page of rows from a Nasdaq Data Link table, filtered by the columns that table marks filterable; page with the returned cursor',
	},
	'tables.metadata': {
		riskLevel: 'read',
		description:
			'Read a table definition: its columns and types, the columns that can filter a query, its primary key and when it last refreshed',
	},
	'tables.export': {
		riskLevel: 'read',
		description:
			'Queue a bulk export of a table and return the signed zip link, valid for 30 minutes; the first call usually reports the file as still being built',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof nasdaqEndpointsNested>;

export type BaseNasdaqPlugin<T extends NasdaqPluginOptions> = CorsairPlugin<
	'nasdaq',
	typeof NasdaqSchema,
	typeof nasdaqEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalNasdaqPlugin = BaseNasdaqPlugin<NasdaqPluginOptions>;

export type ExternalNasdaqPlugin<T extends NasdaqPluginOptions> =
	BaseNasdaqPlugin<T>;

export function nasdaq<const T extends NasdaqPluginOptions>(
	incomingOptions: NasdaqPluginOptions & T = {} as NasdaqPluginOptions & T,
): ExternalNasdaqPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'nasdaq',
		schema: NasdaqSchema,
		options: options,
		hooks: options.hooks,
		endpoints: nasdaqEndpointsNested,
		webhooks: {},
		endpointMeta: nasdaqEndpointMeta,
		endpointSchemas: nasdaqEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: NasdaqKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('nasdaq', ctx.authType ?? 'api_key');
		},
	} satisfies InternalNasdaqPlugin;
}

export { NasdaqAPIError, tablePath } from './client';

export type {
	NasdaqEndpointInputs,
	NasdaqEndpointOutputs,
	TablesExportInput,
	TablesExportResponse,
	TablesMetadataInput,
	TablesMetadataResponse,
	TablesRowsInput,
	TablesRowsResponse,
} from './endpoints/types';
