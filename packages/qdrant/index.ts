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
import { qdrantEndpointsNested } from './endpoints';
import type {
	QdrantEndpointInputs,
	QdrantEndpointOutputs,
} from './endpoints/types';
import {
	QdrantEndpointInputSchemas,
	QdrantEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { QdrantSchema } from './schema';

export type QdrantPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** API key or JWT. Falls back to the account's stored `api_key`. */
	key?: string;
	/** Cluster URL, e.g. `http://localhost:6333`. Falls back to the account's stored `base_url`. */
	baseUrl?: string;
	/** The server has no API key configured: send requests without one. */
	unauthenticated?: boolean;
	hooks?: InternalQdrantPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof qdrantEndpointsNested>;
};

export const qdrantAuthConfig = {
	api_key: {
		account: ['base_url', 'tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type QdrantContext = CorsairPluginContext<
	typeof QdrantSchema,
	QdrantPluginOptions,
	undefined,
	typeof qdrantAuthConfig
>;

export type QdrantKeyBuilderContext = KeyBuilderContext<
	QdrantPluginOptions,
	typeof qdrantAuthConfig
>;

export type QdrantBoundEndpoints = BindEndpoints<typeof qdrantEndpointsNested>;

export type QdrantEndpoints = {
	[K in keyof QdrantEndpointOutputs]: CorsairEndpoint<
		QdrantContext,
		QdrantEndpointInputs[K],
		QdrantEndpointOutputs[K]
	>;
};

type Schemas = {
	[K in keyof typeof QdrantEndpointInputSchemas]: {
		input: (typeof QdrantEndpointInputSchemas)[K];
		output: (typeof QdrantEndpointOutputSchemas)[K];
	};
};

export const qdrantEndpointSchemas = Object.fromEntries(
	Object.entries(QdrantEndpointInputSchemas).map(([key, input]) => [
		key,
		{
			input,
			output: QdrantEndpointOutputSchemas[key as keyof Schemas],
		},
	]),
) as Schemas satisfies RequiredPluginEndpointSchemas<
	typeof qdrantEndpointsNested
>;

const qdrantEndpointMeta = {
	'collections.list': {
		riskLevel: 'read',
		description: 'List the names of all collections in the cluster',
	},
	'collections.get': {
		riskLevel: 'read',
		description:
			'Get a collection’s status, point counts, vector configuration and payload indexes',
	},
	'collections.exists': {
		riskLevel: 'read',
		description: 'Check whether a collection with the given name exists',
	},
	'collections.create': {
		riskLevel: 'write',
		description:
			'Create a collection with dense, sparse or named vector configs, sharding and index settings',
	},
	'collections.update': {
		riskLevel: 'write',
		description:
			'Update a collection’s vector, HNSW, optimizer, quantization or strict-mode parameters',
	},
	'collections.delete': {
		riskLevel: 'destructive',
		description: 'Delete a collection and every point stored in it',
	},
	'aliases.list': {
		riskLevel: 'read',
		description: 'List every collection alias in the cluster',
	},
	'aliases.listForCollection': {
		riskLevel: 'read',
		description: 'List the aliases that point to one collection',
	},
	'aliases.update': {
		riskLevel: 'write',
		description:
			'Atomically create, delete or rename aliases, e.g. to switch traffic to a rebuilt collection',
	},
	'payloadIndexes.create': {
		riskLevel: 'write',
		description:
			'Index a payload field (keyword, integer, float, geo, text, bool, datetime, uuid) for filtering',
	},
	'payloadIndexes.delete': {
		riskLevel: 'destructive',
		description: 'Remove the index on a payload field',
	},
	'points.upsert': {
		riskLevel: 'write',
		description:
			'Insert or replace points with their vectors and payloads, waiting for the write by default',
	},
	'points.get': {
		riskLevel: 'read',
		description:
			'Retrieve points by ID, optionally with their payloads and vectors',
	},
	'points.delete': {
		riskLevel: 'destructive',
		description: 'Delete points selected by ID list or by filter',
	},
	'points.scroll': {
		riskLevel: 'read',
		description:
			'Page through points matching a filter. Pass next_page_offset back as offset to get the next page',
	},
	'points.count': {
		riskLevel: 'read',
		description:
			'Count the points that match a filter, exactly or approximately',
	},
	'points.setPayload': {
		riskLevel: 'write',
		description:
			'Merge payload keys into points selected by ID list or filter, optionally under a nested key',
	},
	'points.overwritePayload': {
		riskLevel: 'destructive',
		description:
			'Replace the whole payload of points selected by ID list or filter',
	},
	'points.deletePayload': {
		riskLevel: 'destructive',
		description:
			'Remove specific payload keys from points selected by ID list or filter',
	},
	'points.clearPayload': {
		riskLevel: 'destructive',
		description:
			'Remove every payload key from points selected by ID list or filter',
	},
	'points.updateVectors': {
		riskLevel: 'write',
		description:
			'Replace specific named vectors on existing points, keeping the others',
	},
	'points.deleteVectors': {
		riskLevel: 'destructive',
		description:
			'Remove named vectors from points selected by ID list or filter',
	},
	'query.points': {
		riskLevel: 'read',
		description:
			'Universal query: nearest-neighbour, hybrid fusion with prefetch, recommend, discover, or order-by',
	},
	'query.batch': {
		riskLevel: 'read',
		description:
			'Run several universal queries against one collection in a single request',
	},
	'query.groups': {
		riskLevel: 'read',
		description:
			'Run a universal query and group hits by a payload field, e.g. one result per document',
	},
	'query.facet': {
		riskLevel: 'read',
		description: 'Count points per distinct value of an indexed payload field',
	},
	'snapshots.list': {
		riskLevel: 'read',
		description: 'List the snapshots stored for a collection',
	},
	'snapshots.create': {
		riskLevel: 'write',
		description:
			'Create a snapshot of a collection on the node and wait for it to finish',
	},
	'snapshots.delete': {
		riskLevel: 'destructive',
		description: 'Delete a collection snapshot from the node',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof qdrantEndpointsNested>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export type BaseQdrantPlugin<T extends QdrantPluginOptions> = CorsairPlugin<
	'qdrant',
	typeof QdrantSchema,
	typeof qdrantEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType,
	typeof qdrantAuthConfig
>;

export type InternalQdrantPlugin = BaseQdrantPlugin<QdrantPluginOptions>;
export type ExternalQdrantPlugin<T extends QdrantPluginOptions> =
	BaseQdrantPlugin<T>;

export function qdrant<const T extends QdrantPluginOptions>(
	incomingOptions: QdrantPluginOptions & T = {} as QdrantPluginOptions & T,
): ExternalQdrantPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'qdrant',
		authConfig: qdrantAuthConfig,
		schema: QdrantSchema,
		options,
		hooks: options.hooks,
		endpoints: qdrantEndpointsNested,
		webhooks: {} as Record<string, never>,
		endpointMeta: qdrantEndpointMeta,
		endpointSchemas: qdrantEndpointSchemas,
		webhookSchemas: {} as Record<string, never>,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: QdrantKeyBuilderContext, source) => {
			if (source !== 'endpoint')
				throw new AuthMissingError('qdrant', 'api_key');
			const key = options.key ?? (await ctx.keys?.get_api_key());
			if (key) return key;
			if (options.unauthenticated) return '';
			throw new AuthMissingError('qdrant', 'api_key');
		},
	} satisfies InternalQdrantPlugin;
}

export { QdrantAPIError } from './client';
export type {
	QdrantEndpointInputs,
	QdrantEndpointOutputs,
} from './endpoints/types';
