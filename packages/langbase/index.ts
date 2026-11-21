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
import { agent, documents, memory, pipes, threads } from './endpoints';
import type {
	LangbaseEndpointInputs,
	LangbaseEndpointOutputs,
} from './endpoints/types';
import {
	LangbaseEndpointInputSchemas,
	LangbaseEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { LangbaseSchema } from './schema';

export type LangbasePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalLangbasePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof langbaseEndpointsNested>;
};

export type LangbaseContext = CorsairPluginContext<
	typeof LangbaseSchema,
	LangbasePluginOptions
>;

export type LangbasePluginContext = LangbaseContext;

export type LangbaseKeyBuilderContext =
	KeyBuilderContext<LangbasePluginOptions>;

export type LangbaseBoundEndpoints = BindEndpoints<
	typeof langbaseEndpointsNested
>;

type LangbaseEndpoint<K extends keyof LangbaseEndpointOutputs> =
	CorsairEndpoint<
		LangbaseContext,
		LangbaseEndpointInputs[K],
		LangbaseEndpointOutputs[K]
	>;

export type LangbaseEndpoints = {
	[K in keyof LangbaseEndpointOutputs]: LangbaseEndpoint<K>;
};

const langbaseEndpointsNested = {
	agent: {
		run: agent.run,
	},
	pipes: {
		run: pipes.run,
		list: pipes.list,
		get: pipes.get,
		create: pipes.create,
		update: pipes.update,
	},
	memory: {
		list: memory.list,
		create: memory.create,
		delete: memory.delete,
		retrieve: memory.retrieve,
	},
	documents: {
		list: documents.list,
		upload: documents.upload,
		delete: documents.delete,
		retryEmbeddings: documents.retryEmbeddings,
	},
	threads: {
		create: threads.create,
		get: threads.get,
		update: threads.update,
		delete: threads.delete,
		appendMessages: threads.appendMessages,
		listMessages: threads.listMessages,
	},
} as const;

export const langbaseEndpointSchemas = {
	'agent.run': {
		input: LangbaseEndpointInputSchemas['agent.run'],
		output: LangbaseEndpointOutputSchemas['agent.run'],
	},
	'pipes.run': {
		input: LangbaseEndpointInputSchemas['pipes.run'],
		output: LangbaseEndpointOutputSchemas['pipes.run'],
	},
	'pipes.list': {
		input: LangbaseEndpointInputSchemas['pipes.list'],
		output: LangbaseEndpointOutputSchemas['pipes.list'],
	},
	'pipes.get': {
		input: LangbaseEndpointInputSchemas['pipes.get'],
		output: LangbaseEndpointOutputSchemas['pipes.get'],
	},
	'pipes.create': {
		input: LangbaseEndpointInputSchemas['pipes.create'],
		output: LangbaseEndpointOutputSchemas['pipes.create'],
	},
	'pipes.update': {
		input: LangbaseEndpointInputSchemas['pipes.update'],
		output: LangbaseEndpointOutputSchemas['pipes.update'],
	},
	'memory.list': {
		input: LangbaseEndpointInputSchemas['memory.list'],
		output: LangbaseEndpointOutputSchemas['memory.list'],
	},
	'memory.create': {
		input: LangbaseEndpointInputSchemas['memory.create'],
		output: LangbaseEndpointOutputSchemas['memory.create'],
	},
	'memory.delete': {
		input: LangbaseEndpointInputSchemas['memory.delete'],
		output: LangbaseEndpointOutputSchemas['memory.delete'],
	},
	'memory.retrieve': {
		input: LangbaseEndpointInputSchemas['memory.retrieve'],
		output: LangbaseEndpointOutputSchemas['memory.retrieve'],
	},
	'documents.list': {
		input: LangbaseEndpointInputSchemas['documents.list'],
		output: LangbaseEndpointOutputSchemas['documents.list'],
	},
	'documents.upload': {
		input: LangbaseEndpointInputSchemas['documents.upload'],
		output: LangbaseEndpointOutputSchemas['documents.upload'],
	},
	'documents.delete': {
		input: LangbaseEndpointInputSchemas['documents.delete'],
		output: LangbaseEndpointOutputSchemas['documents.delete'],
	},
	'documents.retryEmbeddings': {
		input: LangbaseEndpointInputSchemas['documents.retryEmbeddings'],
		output: LangbaseEndpointOutputSchemas['documents.retryEmbeddings'],
	},
	'threads.create': {
		input: LangbaseEndpointInputSchemas['threads.create'],
		output: LangbaseEndpointOutputSchemas['threads.create'],
	},
	'threads.get': {
		input: LangbaseEndpointInputSchemas['threads.get'],
		output: LangbaseEndpointOutputSchemas['threads.get'],
	},
	'threads.update': {
		input: LangbaseEndpointInputSchemas['threads.update'],
		output: LangbaseEndpointOutputSchemas['threads.update'],
	},
	'threads.delete': {
		input: LangbaseEndpointInputSchemas['threads.delete'],
		output: LangbaseEndpointOutputSchemas['threads.delete'],
	},
	'threads.appendMessages': {
		input: LangbaseEndpointInputSchemas['threads.appendMessages'],
		output: LangbaseEndpointOutputSchemas['threads.appendMessages'],
	},
	'threads.listMessages': {
		input: LangbaseEndpointInputSchemas['threads.listMessages'],
		output: LangbaseEndpointOutputSchemas['threads.listMessages'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof langbaseEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const langbaseEndpointMeta = {
	'agent.run': {
		riskLevel: 'destructive',
		description: 'Run a metered Langbase runtime LLM agent',
	},
	'pipes.run': {
		riskLevel: 'destructive',
		description: 'Run an AI pipe, which can consume Langbase usage credits',
	},
	'pipes.list': {
		riskLevel: 'read',
		description: 'List the configured pipes in the Langbase account',
	},
	'pipes.get': {
		riskLevel: 'read',
		description: 'Retrieve a pipe by owner login and pipe name',
	},
	'pipes.create': {
		riskLevel: 'write',
		description: 'Create a pipe with the supplied Langbase configuration',
	},
	'pipes.update': {
		riskLevel: 'write',
		description: 'Update a pipe configuration by name',
	},
	'memory.list': {
		riskLevel: 'read',
		description: 'List semantic memories in the Langbase account',
	},
	'memory.create': {
		riskLevel: 'write',
		description: 'Create a semantic memory with embedding settings',
	},
	'memory.delete': {
		riskLevel: 'destructive',
		description: 'Delete a semantic memory and its stored documents',
	},
	'memory.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve relevant text chunks from one or more memories',
	},
	'documents.list': {
		riskLevel: 'read',
		description: 'List documents and indexing status in a memory',
	},
	'documents.upload': {
		riskLevel: 'destructive',
		description: 'Upload a document and start memory indexing',
	},
	'documents.delete': {
		riskLevel: 'destructive',
		description: 'Delete a document from a Langbase memory',
	},
	'documents.retryEmbeddings': {
		riskLevel: 'destructive',
		description: 'Retry generating a document embedding',
	},
	'threads.create': {
		riskLevel: 'destructive',
		description: 'Create a conversation thread with optional messages',
	},
	'threads.get': {
		riskLevel: 'read',
		description: 'Retrieve thread metadata by thread ID',
	},
	'threads.update': {
		riskLevel: 'write',
		description: 'Update metadata on an existing conversation thread',
	},
	'threads.delete': {
		riskLevel: 'destructive',
		description: 'Delete a conversation thread and its history',
	},
	'threads.appendMessages': {
		riskLevel: 'destructive',
		description: 'Append messages to an existing conversation thread',
	},
	'threads.listMessages': {
		riskLevel: 'read',
		description: 'Retrieve the chronological messages in a thread',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof langbaseEndpointsNested>;

export const langbaseAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseLangbasePlugin<T extends LangbasePluginOptions> = CorsairPlugin<
	'langbase',
	typeof LangbaseSchema,
	typeof langbaseEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalLangbasePlugin = BaseLangbasePlugin<LangbasePluginOptions>;

export type ExternalLangbasePlugin<T extends LangbasePluginOptions> =
	BaseLangbasePlugin<T>;

export function langbase<const T extends LangbasePluginOptions>(
	incomingOptions: LangbasePluginOptions & T = {} as LangbasePluginOptions & T,
): ExternalLangbasePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'langbase',
		authConfig: langbaseAuthConfig,
		schema: LangbaseSchema,
		options,
		hooks: options.hooks,
		endpoints: langbaseEndpointsNested,
		webhooks: {},
		endpointMeta: langbaseEndpointMeta,
		endpointSchemas: langbaseEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: LangbaseKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (!ctx.keys) throw new AuthMissingError('langbase', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('langbase', 'api_key');
			return apiKey;
		},
	} satisfies InternalLangbasePlugin;
}

export type {
	AppendThreadMessagesInput,
	AppendThreadMessagesOutput,
	CreateMemoryInput,
	CreateMemoryOutput,
	CreatePipeInput,
	CreatePipeOutput,
	CreateThreadInput,
	CreateThreadOutput,
	DeleteDocumentInput,
	DeleteDocumentOutput,
	DeleteMemoryInput,
	DeleteMemoryOutput,
	DeleteThreadInput,
	DeleteThreadOutput,
	GetPipeInput,
	GetPipeOutput,
	GetThreadInput,
	GetThreadOutput,
	LangbaseEndpointInputs,
	LangbaseEndpointOutputs,
	ListDocumentsInput,
	ListDocumentsOutput,
	ListMemoryInput,
	ListMemoryOutput,
	ListPipesInput,
	ListPipesOutput,
	ListThreadMessagesInput,
	ListThreadMessagesOutput,
	MemoryFilter,
	MemoryRecord,
	Pipe,
	RetrieveMemoryInput,
	RetrieveMemoryOutput,
	RetryDocumentEmbeddingsInput,
	RetryDocumentEmbeddingsOutput,
	RunAgentInput,
	RunAgentOutput,
	RunPipeInput,
	RunPipeOutput,
	Thread,
	UpdatePipeInput,
	UpdatePipeOutput,
	UpdateThreadInput,
	UpdateThreadOutput,
	UploadDocumentInput,
	UploadDocumentOutput,
} from './endpoints/types';
