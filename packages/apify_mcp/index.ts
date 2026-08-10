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
import { ActorsEndpoints, DocsEndpoints, RunsEndpoints } from './endpoints';
import type {
	ApifyMcpEndpointInputs,
	ApifyMcpEndpointOutputs,
} from './endpoints/types';
import {
	ApifyMcpEndpointInputSchemas,
	ApifyMcpEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ApifyMcpSchema } from './schema';

export type ApifyMcpPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalApifyMcpPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof apifyMcpEndpointsNested>;
};

export type ApifyMcpContext = CorsairPluginContext<
	typeof ApifyMcpSchema,
	ApifyMcpPluginOptions
>;

export type ApifyMcpKeyBuilderContext =
	KeyBuilderContext<ApifyMcpPluginOptions>;

export type ApifyMcpBoundEndpoints = BindEndpoints<
	typeof apifyMcpEndpointsNested
>;

type ApifyMcpEndpoint<K extends keyof ApifyMcpEndpointOutputs> =
	CorsairEndpoint<
		ApifyMcpContext,
		ApifyMcpEndpointInputs[K],
		ApifyMcpEndpointOutputs[K]
	>;

export type ApifyMcpEndpoints = {
	searchActors: ApifyMcpEndpoint<'searchActors'>;
	fetchActorDetails: ApifyMcpEndpoint<'fetchActorDetails'>;
	callActor: ApifyMcpEndpoint<'callActor'>;
	ragWebBrowser: ApifyMcpEndpoint<'ragWebBrowser'>;
	getActorRun: ApifyMcpEndpoint<'getActorRun'>;
	getActorOutput: ApifyMcpEndpoint<'getActorOutput'>;
	searchApifyDocs: ApifyMcpEndpoint<'searchApifyDocs'>;
	fetchApifyDocs: ApifyMcpEndpoint<'fetchApifyDocs'>;
};

const apifyMcpEndpointsNested = {
	actors: ActorsEndpoints,
	runs: RunsEndpoints,
	docs: DocsEndpoints,
} as const;

const apifyMcpWebhooksNested = {} as const;

export const apifyMcpEndpointSchemas = {
	'actors.searchActors': {
		input: ApifyMcpEndpointInputSchemas.searchActors,
		output: ApifyMcpEndpointOutputSchemas.searchActors,
	},
	'actors.fetchActorDetails': {
		input: ApifyMcpEndpointInputSchemas.fetchActorDetails,
		output: ApifyMcpEndpointOutputSchemas.fetchActorDetails,
	},
	'actors.callActor': {
		input: ApifyMcpEndpointInputSchemas.callActor,
		output: ApifyMcpEndpointOutputSchemas.callActor,
	},
	'actors.ragWebBrowser': {
		input: ApifyMcpEndpointInputSchemas.ragWebBrowser,
		output: ApifyMcpEndpointOutputSchemas.ragWebBrowser,
	},
	'runs.getActorRun': {
		input: ApifyMcpEndpointInputSchemas.getActorRun,
		output: ApifyMcpEndpointOutputSchemas.getActorRun,
	},
	'runs.getActorOutput': {
		input: ApifyMcpEndpointInputSchemas.getActorOutput,
		output: ApifyMcpEndpointOutputSchemas.getActorOutput,
	},
	'docs.searchApifyDocs': {
		input: ApifyMcpEndpointInputSchemas.searchApifyDocs,
		output: ApifyMcpEndpointOutputSchemas.searchApifyDocs,
	},
	'docs.fetchApifyDocs': {
		input: ApifyMcpEndpointInputSchemas.fetchApifyDocs,
		output: ApifyMcpEndpointOutputSchemas.fetchApifyDocs,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof apifyMcpEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const apifyMcpEndpointMeta = {
	'actors.searchActors': {
		riskLevel: 'read',
		description: 'Search for Actors in the Apify Store',
	},
	'actors.fetchActorDetails': {
		riskLevel: 'read',
		description:
			'Get detailed information about an Actor including schemas and pricing',
	},
	'actors.callActor': {
		riskLevel: 'write',
		description: 'Run an Apify Actor and return run metadata',
	},
	'actors.ragWebBrowser': {
		riskLevel: 'write',
		description:
			'Search the web and scrape top results using the RAG Web Browser Actor',
	},
	'runs.getActorRun': {
		riskLevel: 'read',
		description: 'Get detailed information about a specific Actor run',
	},
	'runs.getActorOutput': {
		riskLevel: 'read',
		description:
			'Retrieve dataset items from an Actor run (Apify MCP get-dataset-items)',
	},
	'docs.searchApifyDocs': {
		riskLevel: 'read',
		description: 'Search Apify and Crawlee documentation',
	},
	'docs.fetchApifyDocs': {
		riskLevel: 'read',
		description: 'Fetch the full content of an Apify documentation page',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof apifyMcpEndpointsNested>;

export const apifyMcpAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseApifyMcpPlugin<T extends ApifyMcpPluginOptions> = CorsairPlugin<
	'apify_mcp',
	typeof ApifyMcpSchema,
	typeof apifyMcpEndpointsNested,
	typeof apifyMcpWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalApifyMcpPlugin = BaseApifyMcpPlugin<ApifyMcpPluginOptions>;

export type ExternalApifyMcpPlugin<T extends ApifyMcpPluginOptions> =
	BaseApifyMcpPlugin<T>;

export function apifyMcp<const T extends ApifyMcpPluginOptions>(
	incomingOptions: ApifyMcpPluginOptions & T = {} as ApifyMcpPluginOptions & T,
): ExternalApifyMcpPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'apify_mcp',
		authConfig: apifyMcpAuthConfig,
		schema: ApifyMcpSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: apifyMcpEndpointsNested,
		webhooks: apifyMcpWebhooksNested,
		endpointMeta: apifyMcpEndpointMeta,
		endpointSchemas: apifyMcpEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ApifyMcpKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('apify_mcp', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('apify_mcp', 'api_key');
		},
	} satisfies InternalApifyMcpPlugin;
}

export type {
	ApifyMcpEndpointInputs,
	ApifyMcpEndpointOutputs,
	CallActorInput,
	FetchActorDetailsInput,
	FetchApifyDocsInput,
	GetActorOutputInput,
	GetActorRunInput,
	McpToolResponse,
	RagWebBrowserInput,
	SearchActorsInput,
	SearchApifyDocsInput,
} from './endpoints/types';

export {
	ApifyMcpEndpointInputSchemas,
	ApifyMcpEndpointOutputSchemas,
	CallActorInputSchema,
	FetchActorDetailsInputSchema,
	FetchApifyDocsInputSchema,
	GetActorOutputInputSchema,
	GetActorRunInputSchema,
	RagWebBrowserInputSchema,
	SearchActorsInputSchema,
	SearchApifyDocsInputSchema,
} from './endpoints/types';
