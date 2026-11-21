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
import { AuthMissingError } from 'corsair/core';
import { normalizeMetabaseBaseUrl } from './client';
import { CollectionPermissions, Collections } from './endpoints';
import {
	MetabaseOpenApiEndpointMeta,
	MetabaseOpenApiEndpointSchemas,
	MetabaseOpenApiEndpoints,
} from './endpoints/openapi-endpoints';
import {
	MetabaseEndpointInputSchemas,
	MetabaseEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { MetabaseSchema } from './schema';

export type MetabasePluginOptions = {
	baseUrl?: string;
	requestTimeoutMs?: number;
	maxResponseBytes?: number;
	maxUploadBytes?: number;
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalMetabasePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof metabaseEndpointsNested>;
};

export type MetabaseContext = CorsairPluginContext<
	typeof MetabaseSchema,
	MetabasePluginOptions
>;

export type MetabaseKeyBuilderContext =
	KeyBuilderContext<MetabasePluginOptions>;
export type MetabaseBoundEndpoints = BindEndpoints<
	typeof metabaseEndpointsNested
>;

const metabaseEndpointsNested = {
	collections: Collections,
	collectionPermissions: CollectionPermissions,
	...MetabaseOpenApiEndpoints,
} as const;

export type MetabaseEndpoints = typeof metabaseEndpointsNested;

export const metabaseEndpointSchemas = {
	'collections.list': {
		input: MetabaseEndpointInputSchemas.collectionList,
		output: MetabaseEndpointOutputSchemas.collectionList,
	},
	'collections.create': {
		input: MetabaseEndpointInputSchemas.collectionCreate,
		output: MetabaseEndpointOutputSchemas.collectionCreate,
	},
	'collections.get': {
		input: MetabaseEndpointInputSchemas.collectionGet,
		output: MetabaseEndpointOutputSchemas.collectionGet,
	},
	'collections.update': {
		input: MetabaseEndpointInputSchemas.collectionUpdate,
		output: MetabaseEndpointOutputSchemas.collectionUpdate,
	},
	'collections.delete': {
		input: MetabaseEndpointInputSchemas.collectionDelete,
		output: MetabaseEndpointOutputSchemas.collectionDelete,
	},
	'collections.tree': {
		input: MetabaseEndpointInputSchemas.collectionTree,
		output: MetabaseEndpointOutputSchemas.collectionTree,
	},
	'collections.root.get': {
		input: MetabaseEndpointInputSchemas.collectionRootGet,
		output: MetabaseEndpointOutputSchemas.collectionRootGet,
	},
	'collections.root.items.list': {
		input: MetabaseEndpointInputSchemas.collectionRootItems,
		output: MetabaseEndpointOutputSchemas.collectionRootItems,
	},
	'collections.root.items.metadata': {
		input: MetabaseEndpointInputSchemas.collectionRootItemsMetadata,
		output: MetabaseEndpointOutputSchemas.collectionRootItemsMetadata,
	},
	'collections.root.candidates.list': {
		input: MetabaseEndpointInputSchemas.collectionRootCandidates,
		output: MetabaseEndpointOutputSchemas.collectionRootCandidates,
	},
	'collections.root.candidates.move': {
		input: MetabaseEndpointInputSchemas.collectionRootMoveCandidates,
		output: MetabaseEndpointOutputSchemas.collectionRootMoveCandidates,
	},
	'collections.trash.get': {
		input: MetabaseEndpointInputSchemas.collectionTrashGet,
		output: MetabaseEndpointOutputSchemas.collectionTrashGet,
	},
	'collections.items.list': {
		input: MetabaseEndpointInputSchemas.collectionItems,
		output: MetabaseEndpointOutputSchemas.collectionItems,
	},
	'collections.items.metadata': {
		input: MetabaseEndpointInputSchemas.collectionItemsMetadata,
		output: MetabaseEndpointOutputSchemas.collectionItemsMetadata,
	},
	'collections.candidates.list': {
		input: MetabaseEndpointInputSchemas.collectionCandidates,
		output: MetabaseEndpointOutputSchemas.collectionCandidates,
	},
	'collections.candidates.move': {
		input: MetabaseEndpointInputSchemas.collectionMoveCandidates,
		output: MetabaseEndpointOutputSchemas.collectionMoveCandidates,
	},
	'collectionPermissions.graph.get': {
		input: MetabaseEndpointInputSchemas.collectionGraphGet,
		output: MetabaseEndpointOutputSchemas.collectionGraphGet,
	},
	'collectionPermissions.graph.update': {
		input: MetabaseEndpointInputSchemas.collectionGraphUpdate,
		output: MetabaseEndpointOutputSchemas.collectionGraphUpdate,
	},
	...MetabaseOpenApiEndpointSchemas,
} as const satisfies RequiredPluginEndpointSchemas<
	typeof metabaseEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key';

const metabaseEndpointMeta = {
	'collections.list': {
		riskLevel: 'read',
		description: 'List collections visible to the API key group',
	},
	'collections.create': {
		riskLevel: 'write',
		description: 'Create a Metabase collection',
	},
	'collections.get': {
		riskLevel: 'read',
		description: 'Get a collection by its numeric ID or NanoID',
	},
	'collections.update': {
		riskLevel: 'write',
		description: 'Update or move a collection',
	},
	'collections.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a collection',
	},
	'collections.tree': {
		riskLevel: 'read',
		description: 'Get the collection tree',
	},
	'collections.root.get': {
		riskLevel: 'read',
		description: 'Get the virtual root collection',
	},
	'collections.root.items.list': {
		riskLevel: 'read',
		description: 'List items visible at the collection root',
	},
	'collections.root.items.metadata': {
		riskLevel: 'read',
		description: 'Get model and count metadata for root items',
	},
	'collections.root.candidates.list': {
		riskLevel: 'read',
		description: 'List root questions eligible to move into dashboards',
	},
	'collections.root.candidates.move': {
		riskLevel: 'write',
		description: 'Move eligible root questions into their dashboards',
	},
	'collections.trash.get': {
		riskLevel: 'read',
		description: 'Get the virtual trash collection',
	},
	'collections.items.list': {
		riskLevel: 'read',
		description: 'List items in a collection',
	},
	'collections.items.metadata': {
		riskLevel: 'read',
		description: 'Get model and count metadata for collection items',
	},
	'collections.candidates.list': {
		riskLevel: 'read',
		description: 'List collection questions eligible to move into dashboards',
	},
	'collections.candidates.move': {
		riskLevel: 'write',
		description: 'Move eligible collection questions into their dashboards',
	},
	'collectionPermissions.graph.get': {
		riskLevel: 'read',
		description: 'Read collection permission graph',
	},
	'collectionPermissions.graph.update': {
		riskLevel: 'destructive',
		description: 'Replace collection permission graph entries',
	},
	...MetabaseOpenApiEndpointMeta,
} as const satisfies RequiredPluginEndpointMeta<typeof metabaseEndpointsNested>;

export const metabaseAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseMetabasePlugin<T extends MetabasePluginOptions> = CorsairPlugin<
	'metabase',
	typeof MetabaseSchema,
	typeof metabaseEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalMetabasePlugin = BaseMetabasePlugin<MetabasePluginOptions>;
export type ExternalMetabasePlugin<T extends MetabasePluginOptions> =
	BaseMetabasePlugin<T>;

export function metabase<const T extends MetabasePluginOptions>(
	incomingOptions: MetabasePluginOptions & T = {} as MetabasePluginOptions & T,
): ExternalMetabasePlugin<T> {
	const baseUrl =
		incomingOptions.baseUrl === undefined
			? undefined
			: normalizeMetabaseBaseUrl(incomingOptions.baseUrl).origin;
	const options = {
		...incomingOptions,
		baseUrl,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const { DEFAULT: builtInDefault, ...builtInHandlers } = errorHandlers;
	const { DEFAULT: callerDefault, ...callerHandlers } =
		options.errorHandlers ?? {};
	return {
		id: 'metabase',
		authConfig: metabaseAuthConfig,
		schema: MetabaseSchema,
		options,
		hooks: options.hooks,
		endpoints: metabaseEndpointsNested,
		webhooks: {},
		endpointMeta: metabaseEndpointMeta,
		endpointSchemas: metabaseEndpointSchemas,
		errorHandlers: {
			...callerHandlers,
			...builtInHandlers,
			...callerHandlers,
			DEFAULT: callerDefault ?? builtInDefault,
		},
		keyBuilder: async (ctx: MetabaseKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key !== undefined) {
				if (options.key.length === 0) {
					throw new AuthMissingError('metabase', 'api_key');
				}
				return options.key;
			}
			if (!ctx.keys) throw new AuthMissingError('metabase', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('metabase', 'api_key');
			return apiKey;
		},
	} satisfies InternalMetabasePlugin;
}

export type {
	MetabaseOpenApiEndpointInputs,
	MetabaseOpenApiEndpointOutputs,
} from './endpoints/openapi-endpoints';
export type {
	CollectionTreeNode,
	MetabaseEndpointInputs,
	MetabaseEndpointOutputs,
} from './endpoints/types';
