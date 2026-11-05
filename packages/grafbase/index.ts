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
import {
	AccessTokens,
	Deployments,
	Graphs,
	SchemaVersions,
	Subgraphs,
	Viewer,
} from './endpoints';
import type {
	GrafbaseEndpointInputs,
	GrafbaseEndpointOutputs,
} from './endpoints/types';
import {
	GrafbaseEndpointInputSchemas,
	GrafbaseEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { GrafbaseSchema } from './schema';

export type GrafbasePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalGrafbasePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof grafbaseEndpointsNested>;
};

export type GrafbaseContext = CorsairPluginContext<
	typeof GrafbaseSchema,
	GrafbasePluginOptions
>;

export type GrafbaseKeyBuilderContext =
	KeyBuilderContext<GrafbasePluginOptions>;

export type GrafbaseBoundEndpoints = BindEndpoints<
	typeof grafbaseEndpointsNested
>;

type GrafbaseEndpoint<K extends keyof GrafbaseEndpointOutputs> =
	CorsairEndpoint<
		GrafbaseContext,
		GrafbaseEndpointInputs[K],
		GrafbaseEndpointOutputs[K]
	>;

export type GrafbaseEndpoints = {
	viewerGet: GrafbaseEndpoint<'viewerGet'>;
	graphsList: GrafbaseEndpoint<'graphsList'>;
	graphsGet: GrafbaseEndpoint<'graphsGet'>;
	graphsCreate: GrafbaseEndpoint<'graphsCreate'>;
	graphsDelete: GrafbaseEndpoint<'graphsDelete'>;
	subgraphsGet: GrafbaseEndpoint<'subgraphsGet'>;
	subgraphsPublish: GrafbaseEndpoint<'subgraphsPublish'>;
	subgraphsDelete: GrafbaseEndpoint<'subgraphsDelete'>;
	schemaVersionsList: GrafbaseEndpoint<'schemaVersionsList'>;
	deploymentsGet: GrafbaseEndpoint<'deploymentsGet'>;
	accessTokensList: GrafbaseEndpoint<'accessTokensList'>;
	accessTokensCreate: GrafbaseEndpoint<'accessTokensCreate'>;
	accessTokensDelete: GrafbaseEndpoint<'accessTokensDelete'>;
};

const grafbaseEndpointsNested = {
	viewer: {
		get: Viewer.get,
	},
	graphs: {
		list: Graphs.list,
		get: Graphs.get,
		create: Graphs.create,
		delete: Graphs.delete,
	},
	subgraphs: {
		get: Subgraphs.get,
		publish: Subgraphs.publish,
		delete: Subgraphs.delete,
	},
	schemaVersions: {
		list: SchemaVersions.list,
	},
	deployments: {
		get: Deployments.get,
	},
	accessTokens: {
		list: AccessTokens.list,
		create: AccessTokens.create,
		delete: AccessTokens.delete,
	},
} as const;

export const grafbaseEndpointSchemas = {
	'viewer.get': {
		input: GrafbaseEndpointInputSchemas.viewerGet,
		output: GrafbaseEndpointOutputSchemas.viewerGet,
	},
	'graphs.list': {
		input: GrafbaseEndpointInputSchemas.graphsList,
		output: GrafbaseEndpointOutputSchemas.graphsList,
	},
	'graphs.get': {
		input: GrafbaseEndpointInputSchemas.graphsGet,
		output: GrafbaseEndpointOutputSchemas.graphsGet,
	},
	'graphs.create': {
		input: GrafbaseEndpointInputSchemas.graphsCreate,
		output: GrafbaseEndpointOutputSchemas.graphsCreate,
	},
	'graphs.delete': {
		input: GrafbaseEndpointInputSchemas.graphsDelete,
		output: GrafbaseEndpointOutputSchemas.graphsDelete,
	},
	'subgraphs.get': {
		input: GrafbaseEndpointInputSchemas.subgraphsGet,
		output: GrafbaseEndpointOutputSchemas.subgraphsGet,
	},
	'subgraphs.publish': {
		input: GrafbaseEndpointInputSchemas.subgraphsPublish,
		output: GrafbaseEndpointOutputSchemas.subgraphsPublish,
	},
	'subgraphs.delete': {
		input: GrafbaseEndpointInputSchemas.subgraphsDelete,
		output: GrafbaseEndpointOutputSchemas.subgraphsDelete,
	},
	'schemaVersions.list': {
		input: GrafbaseEndpointInputSchemas.schemaVersionsList,
		output: GrafbaseEndpointOutputSchemas.schemaVersionsList,
	},
	'deployments.get': {
		input: GrafbaseEndpointInputSchemas.deploymentsGet,
		output: GrafbaseEndpointOutputSchemas.deploymentsGet,
	},
	'accessTokens.list': {
		input: GrafbaseEndpointInputSchemas.accessTokensList,
		output: GrafbaseEndpointOutputSchemas.accessTokensList,
	},
	'accessTokens.create': {
		input: GrafbaseEndpointInputSchemas.accessTokensCreate,
		output: GrafbaseEndpointOutputSchemas.accessTokensCreate,
	},
	'accessTokens.delete': {
		input: GrafbaseEndpointInputSchemas.accessTokensDelete,
		output: GrafbaseEndpointOutputSchemas.accessTokensDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof grafbaseEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const grafbaseEndpointMeta = {
	'viewer.get': {
		riskLevel: 'read',
		description:
			'Return the user the access token belongs to; useful to check that a token works',
	},
	'graphs.list': {
		riskLevel: 'read',
		description:
			'List the graphs in an organization with their production branch, paginated; the response also carries the account id that graphs.create needs',
	},
	'graphs.get': {
		riskLevel: 'read',
		description:
			'Get one graph by organization and graph slug, including its production branch',
	},
	'graphs.create': {
		riskLevel: 'write',
		description:
			'Create an empty graph in an organization; it gets a schema when a subgraph is published to it',
	},
	'graphs.delete': {
		riskLevel: 'destructive',
		description:
			'Permanently delete a graph by ID, removing every branch and its schema history',
	},
	'subgraphs.get': {
		riskLevel: 'read',
		description: "Get one subgraph's routing URL and SDL from a graph branch",
	},
	'subgraphs.publish': {
		riskLevel: 'write',
		description:
			'Publish a subgraph SDL to a graph branch, which runs composition and can trigger a gateway deployment; the outcome names the result, and composition failures carry their messages',
	},
	'subgraphs.delete': {
		riskLevel: 'destructive',
		description:
			'Remove a subgraph from a branch and redeploy; dry run first to preview the composition result',
	},
	'schemaVersions.list': {
		riskLevel: 'read',
		description:
			"List a graph's schema versions, the deploy history with change messages, paginated",
	},
	'deployments.get': {
		riskLevel: 'read',
		description:
			"Get one deployment's status, timing, schema change counts and the subgraph that triggered it",
	},
	'accessTokens.list': {
		riskLevel: 'read',
		description:
			'List your access tokens with their expiry and graph scopes, paginated',
	},
	'accessTokens.create': {
		riskLevel: 'write',
		description:
			'Create a USER or ACCOUNT access token; the jwt value is returned only in this response, so store it right away',
	},
	'accessTokens.delete': {
		riskLevel: 'destructive',
		description:
			'Revoke an access token by ID; requests using it stop working immediately',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof grafbaseEndpointsNested>;

export type BaseGrafbasePlugin<T extends GrafbasePluginOptions> = CorsairPlugin<
	'grafbase',
	typeof GrafbaseSchema,
	typeof grafbaseEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalGrafbasePlugin = BaseGrafbasePlugin<GrafbasePluginOptions>;

export type ExternalGrafbasePlugin<T extends GrafbasePluginOptions> =
	BaseGrafbasePlugin<T>;

export function grafbase<const T extends GrafbasePluginOptions>(
	incomingOptions: GrafbasePluginOptions & T = {} as GrafbasePluginOptions & T,
): ExternalGrafbasePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'grafbase',
		schema: GrafbaseSchema,
		options: options,
		hooks: options.hooks,
		endpoints: grafbaseEndpointsNested,
		webhooks: {},
		endpointMeta: grafbaseEndpointMeta,
		endpointSchemas: grafbaseEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: GrafbaseKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('grafbase', ctx.authType ?? 'api_key');
		},
	} satisfies InternalGrafbasePlugin;
}

export { GrafbaseAPIError } from './client';

export type {
	AccessTokensCreateInput,
	AccessTokensCreateResponse,
	AccessTokensDeleteInput,
	AccessTokensDeleteResponse,
	AccessTokensListInput,
	AccessTokensListResponse,
	DeploymentsGetInput,
	DeploymentsGetResponse,
	GrafbaseAccessToken,
	GrafbaseEndpointInputs,
	GrafbaseEndpointOutputs,
	GrafbaseGraph,
	GrafbaseSchemaVersion,
	GraphsCreateInput,
	GraphsCreateResponse,
	GraphsDeleteInput,
	GraphsDeleteResponse,
	GraphsGetInput,
	GraphsGetResponse,
	GraphsListInput,
	GraphsListResponse,
	SchemaVersionsListInput,
	SchemaVersionsListResponse,
	SubgraphsDeleteInput,
	SubgraphsDeleteResponse,
	SubgraphsGetInput,
	SubgraphsGetResponse,
	SubgraphsPublishInput,
	SubgraphsPublishResponse,
	ViewerGetInput,
	ViewerGetResponse,
} from './endpoints/types';
