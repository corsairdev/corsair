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
	Chatbots,
	KnowledgeBases,
	Pipelines,
	Transformations,
} from './endpoints';
import type {
	VectorshiftEndpointInputs,
	VectorshiftEndpointOutputs,
} from './endpoints/types';
import {
	VectorshiftEndpointInputSchemas,
	VectorshiftEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { VectorshiftSchema } from './schema';

export type VectorshiftPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalVectorshiftPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof vectorshiftEndpointsNested>;
};

export type VectorshiftContext = CorsairPluginContext<
	typeof VectorshiftSchema,
	VectorshiftPluginOptions
>;

export type VectorshiftKeyBuilderContext =
	KeyBuilderContext<VectorshiftPluginOptions>;

export type VectorshiftBoundEndpoints = BindEndpoints<
	typeof vectorshiftEndpointsNested
>;

type VectorshiftEndpoint<K extends keyof VectorshiftEndpointOutputs> =
	CorsairEndpoint<
		VectorshiftContext,
		VectorshiftEndpointInputs[K],
		VectorshiftEndpointOutputs[K]
	>;

export type VectorshiftEndpoints = {
	pipelinesList: VectorshiftEndpoint<'pipelinesList'>;
	pipelinesRun: VectorshiftEndpoint<'pipelinesRun'>;
	pipelinesBulkRun: VectorshiftEndpoint<'pipelinesBulkRun'>;
	pipelinesCreate: VectorshiftEndpoint<'pipelinesCreate'>;
	knowledgeBasesCreate: VectorshiftEndpoint<'knowledgeBasesCreate'>;
	knowledgeBasesGet: VectorshiftEndpoint<'knowledgeBasesGet'>;
	knowledgeBasesQuery: VectorshiftEndpoint<'knowledgeBasesQuery'>;
	chatbotsCreate: VectorshiftEndpoint<'chatbotsCreate'>;
	chatbotsRun: VectorshiftEndpoint<'chatbotsRun'>;
	transformationsCreate: VectorshiftEndpoint<'transformationsCreate'>;
	transformationsRun: VectorshiftEndpoint<'transformationsRun'>;
};

const vectorshiftEndpointsNested = {
	pipelines: {
		list: Pipelines.list,
		run: Pipelines.run,
		bulkRun: Pipelines.bulkRun,
		create: Pipelines.create,
	},
	knowledgeBases: {
		create: KnowledgeBases.create,
		get: KnowledgeBases.get,
		query: KnowledgeBases.query,
	},
	chatbots: {
		create: Chatbots.create,
		run: Chatbots.run,
	},
	transformations: {
		create: Transformations.create,
		run: Transformations.run,
	},
} as const;

export const vectorshiftEndpointSchemas = {
	'pipelines.list': {
		input: VectorshiftEndpointInputSchemas.pipelinesList,
		output: VectorshiftEndpointOutputSchemas.pipelinesList,
	},
	'pipelines.run': {
		input: VectorshiftEndpointInputSchemas.pipelinesRun,
		output: VectorshiftEndpointOutputSchemas.pipelinesRun,
	},
	'pipelines.bulkRun': {
		input: VectorshiftEndpointInputSchemas.pipelinesBulkRun,
		output: VectorshiftEndpointOutputSchemas.pipelinesBulkRun,
	},
	'pipelines.create': {
		input: VectorshiftEndpointInputSchemas.pipelinesCreate,
		output: VectorshiftEndpointOutputSchemas.pipelinesCreate,
	},
	'knowledgeBases.create': {
		input: VectorshiftEndpointInputSchemas.knowledgeBasesCreate,
		output: VectorshiftEndpointOutputSchemas.knowledgeBasesCreate,
	},
	'knowledgeBases.get': {
		input: VectorshiftEndpointInputSchemas.knowledgeBasesGet,
		output: VectorshiftEndpointOutputSchemas.knowledgeBasesGet,
	},
	'knowledgeBases.query': {
		input: VectorshiftEndpointInputSchemas.knowledgeBasesQuery,
		output: VectorshiftEndpointOutputSchemas.knowledgeBasesQuery,
	},
	'chatbots.create': {
		input: VectorshiftEndpointInputSchemas.chatbotsCreate,
		output: VectorshiftEndpointOutputSchemas.chatbotsCreate,
	},
	'chatbots.run': {
		input: VectorshiftEndpointInputSchemas.chatbotsRun,
		output: VectorshiftEndpointOutputSchemas.chatbotsRun,
	},
	'transformations.create': {
		input: VectorshiftEndpointInputSchemas.transformationsCreate,
		output: VectorshiftEndpointOutputSchemas.transformationsCreate,
	},
	'transformations.run': {
		input: VectorshiftEndpointInputSchemas.transformationsRun,
		output: VectorshiftEndpointOutputSchemas.transformationsRun,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof vectorshiftEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const vectorshiftEndpointMeta = {
	'pipelines.list': {
		riskLevel: 'read',
		description:
			'List pipeline ids, optionally including shared pipelines and the full objects',
	},
	'pipelines.run': {
		riskLevel: 'write',
		description:
			'Run a pipeline with the given inputs and read back every output node value',
	},
	'pipelines.bulkRun': {
		riskLevel: 'write',
		description:
			'Run one pipeline once per entry in parallel, with separate inputs and a run id each',
	},
	'pipelines.create': {
		riskLevel: 'write',
		description:
			'Create a pipeline from a builder graph, passed through unchanged',
	},
	'knowledgeBases.create': {
		riskLevel: 'write',
		description:
			'Create a knowledge base, choosing the file parser, chunk size and overlap',
	},
	'knowledgeBases.get': {
		riskLevel: 'read',
		description:
			'Read one knowledge base by id, or by name with an optional owner',
	},
	'knowledgeBases.query': {
		riskLevel: 'read',
		description:
			'Ask one or more questions of a knowledge base, with retrieval, reranking and answering switches',
	},
	'chatbots.create': {
		riskLevel: 'write',
		description:
			'Create a chatbot over a pipeline, naming the input and output nodes its messages use',
	},
	'chatbots.run': {
		riskLevel: 'write',
		description:
			'Send a text or audio message to a chatbot and read its reply, continuing a conversation by id',
	},
	'transformations.create': {
		riskLevel: 'write',
		description:
			'Create a transformation from a Python function and its input and output schemas',
	},
	'transformations.run': {
		riskLevel: 'write',
		description:
			"Run a transformation in VectorShift's sandbox with the given arguments",
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof vectorshiftEndpointsNested
>;

export type BaseVectorshiftPlugin<T extends VectorshiftPluginOptions> =
	CorsairPlugin<
		'vectorshift',
		typeof VectorshiftSchema,
		typeof vectorshiftEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalVectorshiftPlugin =
	BaseVectorshiftPlugin<VectorshiftPluginOptions>;

export type ExternalVectorshiftPlugin<T extends VectorshiftPluginOptions> =
	BaseVectorshiftPlugin<T>;

export function vectorshift<const T extends VectorshiftPluginOptions>(
	incomingOptions: VectorshiftPluginOptions &
		T = {} as VectorshiftPluginOptions & T,
): ExternalVectorshiftPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'vectorshift',
		schema: VectorshiftSchema,
		options: options,
		hooks: options.hooks,
		endpoints: vectorshiftEndpointsNested,
		webhooks: {},
		endpointMeta: vectorshiftEndpointMeta,
		endpointSchemas: vectorshiftEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: VectorshiftKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('vectorshift', ctx.authType ?? 'api_key');
		},
	} satisfies InternalVectorshiftPlugin;
}

export {
	isVectorshiftFailure,
	VECTORSHIFT_API_BASE,
	VectorshiftAPIError,
} from './client';

export { VectorshiftRunFailedError } from './endpoints/call';

export type {
	ChatbotsCreateInput,
	ChatbotsCreateResponse,
	ChatbotsRunInput,
	ChatbotsRunResponse,
	KnowledgeBasesCreateInput,
	KnowledgeBasesCreateResponse,
	KnowledgeBasesGetInput,
	KnowledgeBasesGetResponse,
	KnowledgeBasesQueryInput,
	KnowledgeBasesQueryResponse,
	PipelinesBulkRunInput,
	PipelinesBulkRunResponse,
	PipelinesCreateInput,
	PipelinesCreateResponse,
	PipelinesListInput,
	PipelinesListResponse,
	PipelinesRunInput,
	PipelinesRunResponse,
	TransformationsCreateInput,
	TransformationsCreateResponse,
	TransformationsRunInput,
	TransformationsRunResponse,
	VectorshiftEndpointInputs,
	VectorshiftEndpointOutputs,
} from './endpoints/types';
