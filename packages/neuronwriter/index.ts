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
import { Analysis, Content, Projects, Queries } from './endpoints';
import type {
	NeuronwriterEndpointInputs,
	NeuronwriterEndpointOutputs,
} from './endpoints/types';
import {
	NeuronwriterEndpointInputSchemas,
	NeuronwriterEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { NeuronwriterSchema } from './schema';

export type NeuronwriterPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalNeuronwriterPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof neuronwriterEndpointsNested>;
};

export type NeuronwriterContext = CorsairPluginContext<
	typeof NeuronwriterSchema,
	NeuronwriterPluginOptions
>;

export type NeuronwriterKeyBuilderContext =
	KeyBuilderContext<NeuronwriterPluginOptions>;

export type NeuronwriterBoundEndpoints = BindEndpoints<
	typeof neuronwriterEndpointsNested
>;

type NeuronwriterEndpoint<K extends keyof NeuronwriterEndpointOutputs> =
	CorsairEndpoint<
		NeuronwriterContext,
		NeuronwriterEndpointInputs[K],
		NeuronwriterEndpointOutputs[K]
	>;

export type NeuronwriterEndpoints = {
	projectsList: NeuronwriterEndpoint<'projectsList'>;
	analysisStart: NeuronwriterEndpoint<'analysisStart'>;
	analysisGet: NeuronwriterEndpoint<'analysisGet'>;
	queriesList: NeuronwriterEndpoint<'queriesList'>;
	contentGet: NeuronwriterEndpoint<'contentGet'>;
	contentImport: NeuronwriterEndpoint<'contentImport'>;
	contentEvaluate: NeuronwriterEndpoint<'contentEvaluate'>;
};

export const neuronwriterEndpointsNested = {
	projects: {
		list: Projects.list,
	},
	analysis: {
		start: Analysis.start,
		get: Analysis.get,
	},
	queries: {
		list: Queries.list,
	},
	content: {
		get: Content.get,
		import: Content.importContent,
		evaluate: Content.evaluate,
	},
} as const;

export const neuronwriterEndpointSchemas = {
	'projects.list': {
		input: NeuronwriterEndpointInputSchemas.projectsList,
		output: NeuronwriterEndpointOutputSchemas.projectsList,
	},
	'analysis.start': {
		input: NeuronwriterEndpointInputSchemas.analysisStart,
		output: NeuronwriterEndpointOutputSchemas.analysisStart,
	},
	'analysis.get': {
		input: NeuronwriterEndpointInputSchemas.analysisGet,
		output: NeuronwriterEndpointOutputSchemas.analysisGet,
	},
	'queries.list': {
		input: NeuronwriterEndpointInputSchemas.queriesList,
		output: NeuronwriterEndpointOutputSchemas.queriesList,
	},
	'content.get': {
		input: NeuronwriterEndpointInputSchemas.contentGet,
		output: NeuronwriterEndpointOutputSchemas.contentGet,
	},
	'content.import': {
		input: NeuronwriterEndpointInputSchemas.contentImport,
		output: NeuronwriterEndpointOutputSchemas.contentImport,
	},
	'content.evaluate': {
		input: NeuronwriterEndpointInputSchemas.contentEvaluate,
		output: NeuronwriterEndpointOutputSchemas.contentEvaluate,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof neuronwriterEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const neuronwriterEndpointMeta = {
	'projects.list': {
		riskLevel: 'read',
		description:
			"List the account's projects with the id, language and search engine each one uses",
	},
	'analysis.start': {
		// Spends one Content Writer analysis from the account's monthly limit, so
		// it needs the approval a destructive call gets (R8).
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Queue a content analysis for a keyword, spending one Content Writer analysis from the monthly limit; poll analysis.get for the recommendations',
	},
	'analysis.get': {
		riskLevel: 'read',
		description:
			'Poll one analysis: the status alone while it runs, then the target word count, terms, questions and SERP competitors',
	},
	'queries.list': {
		riskLevel: 'read',
		description:
			'List the queries in a project, filterable by status, source, keyword, language, engine, dates and tags',
	},
	'content.get': {
		riskLevel: 'read',
		description:
			"Read a query's last saved content revision, or the latest autosave as well",
	},
	'content.import': {
		riskLevel: 'write',
		description:
			'Replace the editor content from HTML or a fetched URL, saving it as a new revision',
	},
	'content.evaluate': {
		riskLevel: 'read',
		description:
			'Score content against its analysis without saving a revision, so a draft can be checked before it is written back',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof neuronwriterEndpointsNested
>;

export type BaseNeuronwriterPlugin<T extends NeuronwriterPluginOptions> =
	CorsairPlugin<
		'neuronwriter',
		typeof NeuronwriterSchema,
		typeof neuronwriterEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalNeuronwriterPlugin =
	BaseNeuronwriterPlugin<NeuronwriterPluginOptions>;

export type ExternalNeuronwriterPlugin<T extends NeuronwriterPluginOptions> =
	BaseNeuronwriterPlugin<T>;

export function neuronwriter<const T extends NeuronwriterPluginOptions>(
	incomingOptions: NeuronwriterPluginOptions &
		T = {} as NeuronwriterPluginOptions & T,
): ExternalNeuronwriterPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'neuronwriter',
		schema: NeuronwriterSchema,
		options: options,
		hooks: options.hooks,
		endpoints: neuronwriterEndpointsNested,
		webhooks: {},
		endpointMeta: neuronwriterEndpointMeta,
		endpointSchemas: neuronwriterEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: NeuronwriterKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('neuronwriter', ctx.authType ?? 'api_key');
		},
	} satisfies InternalNeuronwriterPlugin;
}

export { NeuronwriterAPIError } from './client';

export type {
	AnalysisGetInput,
	AnalysisGetResponse,
	AnalysisStartInput,
	AnalysisStartResponse,
	ContentEvaluateInput,
	ContentEvaluateResponse,
	ContentGetInput,
	ContentGetResponse,
	ContentImportInput,
	ContentImportResponse,
	NeuronwriterEndpointInputs,
	NeuronwriterEndpointOutputs,
	NeuronwriterProject,
	NeuronwriterQuerySummary,
	ProjectsListInput,
	ProjectsListResponse,
	QueriesListInput,
	QueriesListResponse,
} from './endpoints/types';
