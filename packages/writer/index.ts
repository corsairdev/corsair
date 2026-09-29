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
import type {
	WriterEndpointInputs,
	WriterEndpointOutputs,
} from './endpoints/types';
import {
	WriterEndpointInputSchemas,
	WriterEndpointOutputSchemas,
} from './endpoints/types';
import {
	addFileToGraph,
	analyzeImages,
	askQuestionToKnowledgeGraph,
	createChat,
	createCompletion,
	createKnowledgeGraph,
	deleteFile,
	deleteKnowledgeGraph,
	detectAiContent,
	downloadFile,
	getFile,
	listApplications,
	listFiles,
	listKnowledgeGraphs,
	listModels,
	medicalComprehend,
	parsePdf,
	removeFileFromGraph,
	retrieveKnowledgeGraph,
	translateText,
	updateKnowledgeGraph,
	uploadFile,
	webSearch,
} from './endpoints/writer';
import { errorHandlers } from './error-handlers';
import { WriterSchema } from './schema';

export type WriterPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalWriterPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof writerEndpointsNested>;
};

export type WriterContext = CorsairPluginContext<
	typeof WriterSchema,
	WriterPluginOptions
>;

export type WriterKeyBuilderContext = KeyBuilderContext<WriterPluginOptions>;

export type WriterBoundEndpoints = BindEndpoints<typeof writerEndpointsNested>;

type WriterEndpoint<K extends keyof WriterEndpointOutputs> = CorsairEndpoint<
	WriterContext,
	WriterEndpointInputs[K],
	WriterEndpointOutputs[K]
>;

export type WriterEndpoints = {
	[K in keyof WriterEndpointOutputs]: WriterEndpoint<K>;
};

const writerEndpointsNested = {
	models: { list: listModels },
	completions: { create: createCompletion },
	chat: { create: createChat },
	files: {
		list: listFiles,
		upload: uploadFile,
		get: getFile,
		download: downloadFile,
		delete: deleteFile,
	},
	knowledgeGraphs: {
		list: listKnowledgeGraphs,
		create: createKnowledgeGraph,
		retrieve: retrieveKnowledgeGraph,
		update: updateKnowledgeGraph,
		delete: deleteKnowledgeGraph,
		addFile: addFileToGraph,
		removeFile: removeFileFromGraph,
		askQuestion: askQuestionToKnowledgeGraph,
	},
	applications: { list: listApplications },
	tools: {
		parsePdf,
		webSearch,
		analyzeImages,
		translateText,
		detectAiContent,
		medicalComprehend,
	},
} as const;

export const writerEndpointSchemas = {
	'models.list': {
		input: WriterEndpointInputSchemas.listModels,
		output: WriterEndpointOutputSchemas.listModels,
	},
	'completions.create': {
		input: WriterEndpointInputSchemas.createCompletion,
		output: WriterEndpointOutputSchemas.createCompletion,
	},
	'chat.create': {
		input: WriterEndpointInputSchemas.createChat,
		output: WriterEndpointOutputSchemas.createChat,
	},
	'files.list': {
		input: WriterEndpointInputSchemas.listFiles,
		output: WriterEndpointOutputSchemas.listFiles,
	},
	'files.upload': {
		input: WriterEndpointInputSchemas.uploadFile,
		output: WriterEndpointOutputSchemas.uploadFile,
	},
	'files.get': {
		input: WriterEndpointInputSchemas.getFile,
		output: WriterEndpointOutputSchemas.getFile,
	},
	'files.download': {
		input: WriterEndpointInputSchemas.downloadFile,
		output: WriterEndpointOutputSchemas.downloadFile,
	},
	'files.delete': {
		input: WriterEndpointInputSchemas.deleteFile,
		output: WriterEndpointOutputSchemas.deleteFile,
	},
	'knowledgeGraphs.list': {
		input: WriterEndpointInputSchemas.listKnowledgeGraphs,
		output: WriterEndpointOutputSchemas.listKnowledgeGraphs,
	},
	'knowledgeGraphs.create': {
		input: WriterEndpointInputSchemas.createKnowledgeGraph,
		output: WriterEndpointOutputSchemas.createKnowledgeGraph,
	},
	'knowledgeGraphs.retrieve': {
		input: WriterEndpointInputSchemas.retrieveKnowledgeGraph,
		output: WriterEndpointOutputSchemas.retrieveKnowledgeGraph,
	},
	'knowledgeGraphs.update': {
		input: WriterEndpointInputSchemas.updateKnowledgeGraph,
		output: WriterEndpointOutputSchemas.updateKnowledgeGraph,
	},
	'knowledgeGraphs.delete': {
		input: WriterEndpointInputSchemas.deleteKnowledgeGraph,
		output: WriterEndpointOutputSchemas.deleteKnowledgeGraph,
	},
	'knowledgeGraphs.addFile': {
		input: WriterEndpointInputSchemas.addFileToGraph,
		output: WriterEndpointOutputSchemas.addFileToGraph,
	},
	'knowledgeGraphs.removeFile': {
		input: WriterEndpointInputSchemas.removeFileFromGraph,
		output: WriterEndpointOutputSchemas.removeFileFromGraph,
	},
	'knowledgeGraphs.askQuestion': {
		input: WriterEndpointInputSchemas.askQuestionToKnowledgeGraph,
		output: WriterEndpointOutputSchemas.askQuestionToKnowledgeGraph,
	},
	'applications.list': {
		input: WriterEndpointInputSchemas.listApplications,
		output: WriterEndpointOutputSchemas.listApplications,
	},
	'tools.parsePdf': {
		input: WriterEndpointInputSchemas.parsePdf,
		output: WriterEndpointOutputSchemas.parsePdf,
	},
	'tools.webSearch': {
		input: WriterEndpointInputSchemas.webSearch,
		output: WriterEndpointOutputSchemas.webSearch,
	},
	'tools.analyzeImages': {
		input: WriterEndpointInputSchemas.analyzeImages,
		output: WriterEndpointOutputSchemas.analyzeImages,
	},
	'tools.translateText': {
		input: WriterEndpointInputSchemas.translateText,
		output: WriterEndpointOutputSchemas.translateText,
	},
	'tools.detectAiContent': {
		input: WriterEndpointInputSchemas.detectAiContent,
		output: WriterEndpointOutputSchemas.detectAiContent,
	},
	'tools.medicalComprehend': {
		input: WriterEndpointInputSchemas.medicalComprehend,
		output: WriterEndpointOutputSchemas.medicalComprehend,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof writerEndpointsNested
>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

const writerEndpointMeta = {
	'models.list': { riskLevel: 'read', description: 'List available models' },
	'completions.create': {
		riskLevel: 'write',
		description: 'Generate text completions',
	},
	'chat.create': {
		riskLevel: 'write',
		description: 'Generate chat completions',
	},
	'files.list': { riskLevel: 'read', description: 'List uploaded files' },
	'files.upload': { riskLevel: 'write', description: 'Upload file' },
	'files.get': { riskLevel: 'read', description: 'Get file details' },
	'files.download': {
		riskLevel: 'read',
		description: 'Download file contents',
	},
	'files.delete': { riskLevel: 'destructive', description: 'Delete file' },
	'knowledgeGraphs.list': {
		riskLevel: 'read',
		description: 'List knowledge graphs',
	},
	'knowledgeGraphs.create': {
		riskLevel: 'write',
		description: 'Create knowledge graph',
	},
	'knowledgeGraphs.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve knowledge graph',
	},
	'knowledgeGraphs.update': {
		riskLevel: 'write',
		description: 'Update knowledge graph',
	},
	'knowledgeGraphs.delete': {
		riskLevel: 'destructive',
		description: 'Delete knowledge graph',
	},
	'knowledgeGraphs.addFile': {
		riskLevel: 'write',
		description: 'Add file to graph',
	},
	'knowledgeGraphs.removeFile': {
		riskLevel: 'destructive',
		description: 'Remove file from graph',
	},
	'knowledgeGraphs.askQuestion': {
		riskLevel: 'read',
		description: 'Ask question to knowledge graph',
	},
	'applications.list': {
		riskLevel: 'read',
		description: 'List no-code applications',
	},
	'tools.parsePdf': { riskLevel: 'read', description: 'Parse PDF file' },
	'tools.webSearch': { riskLevel: 'read', description: 'Search the web' },
	'tools.analyzeImages': {
		riskLevel: 'write',
		description: 'Analyze images with vision models',
	},
	'tools.translateText': {
		riskLevel: 'write',
		description: 'Translate text between languages',
	},
	'tools.detectAiContent': {
		riskLevel: 'read',
		description: 'Detect AI-generated content likelihood',
	},
	'tools.medicalComprehend': {
		riskLevel: 'write',
		description: 'Extract structured medical entities from text',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof writerEndpointsNested>;

export const writerAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

type WriterWebhooks = {};

export type BaseWriterPlugin<T extends WriterPluginOptions> = CorsairPlugin<
	'writer',
	typeof WriterSchema,
	typeof writerEndpointsNested,
	WriterWebhooks,
	T,
	typeof defaultAuthType
>;

export type InternalWriterPlugin = BaseWriterPlugin<WriterPluginOptions>;
export type ExternalWriterPlugin<T extends WriterPluginOptions> =
	BaseWriterPlugin<T>;

export function writer<const T extends WriterPluginOptions>(
	incomingOptions: WriterPluginOptions & T = {} as WriterPluginOptions & T,
): ExternalWriterPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'writer',
		authConfig: writerAuthConfig,
		schema: WriterSchema,
		options,
		hooks: options.hooks,
		endpoints: writerEndpointsNested,
		webhooks: {},
		endpointMeta: writerEndpointMeta,
		endpointSchemas: writerEndpointSchemas,
		errorHandlers: (() => {
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
		keyBuilder: async (ctx: WriterKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) {
					throw new AuthMissingError('writer', 'api_key');
				}
				return key;
			}
			throw new AuthMissingError('writer', 'api_key');
		},
	} satisfies InternalWriterPlugin;
}

export type {
	WriterEndpointInputs,
	WriterEndpointOutputs,
} from './endpoints/types';
