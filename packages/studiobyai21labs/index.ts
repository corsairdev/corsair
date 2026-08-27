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
import { Chat, Library, Maestro } from './endpoints';
import type {
	StudioByAI21LabsEndpointInputs,
	StudioByAI21LabsEndpointOutputs,
} from './endpoints/types';
import {
	StudioByAI21LabsEndpointInputSchemas,
	StudioByAI21LabsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { StudioByAI21LabsSchema } from './schema';

export type StudioByAI21LabsPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalStudioByAI21LabsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof studioByAI21LabsEndpointsNested>;
};

export type StudioByAI21LabsContext = CorsairPluginContext<
	typeof StudioByAI21LabsSchema,
	StudioByAI21LabsPluginOptions
>;

export type StudioByAI21LabsKeyBuilderContext =
	KeyBuilderContext<StudioByAI21LabsPluginOptions>;

export type StudioByAI21LabsBoundEndpoints = BindEndpoints<
	typeof studioByAI21LabsEndpointsNested
>;

type StudioByAI21LabsEndpoint<K extends keyof StudioByAI21LabsEndpointOutputs> =
	CorsairEndpoint<
		StudioByAI21LabsContext,
		StudioByAI21LabsEndpointInputs[K],
		StudioByAI21LabsEndpointOutputs[K]
	>;

export type StudioByAI21LabsEndpoints = {
	chatCompletions: StudioByAI21LabsEndpoint<'chatCompletions'>;
	listLibraryFiles: StudioByAI21LabsEndpoint<'listLibraryFiles'>;
	uploadWorkspaceFile: StudioByAI21LabsEndpoint<'uploadWorkspaceFile'>;
	getWorkspaceFile: StudioByAI21LabsEndpoint<'getWorkspaceFile'>;
	updateFile: StudioByAI21LabsEndpoint<'updateFile'>;
	deleteFile: StudioByAI21LabsEndpoint<'deleteFile'>;
	getFileDownloadLink: StudioByAI21LabsEndpoint<'getFileDownloadLink'>;
	createMaestroRun: StudioByAI21LabsEndpoint<'createMaestroRun'>;
	retrieveMaestroRun: StudioByAI21LabsEndpoint<'retrieveMaestroRun'>;
};

const studioByAI21LabsEndpointsNested = {
	chat: {
		completions: Chat.completions,
	},
	library: {
		list: Library.list,
		upload: Library.upload,
		get: Library.get,
		update: Library.update,
		delete: Library.deleteFile,
		download: Library.download,
	},
	maestro: {
		createRun: Maestro.createRun,
		retrieveRun: Maestro.retrieveRun,
	},
} as const;

export const studioByAI21LabsEndpointSchemas = {
	'chat.completions': {
		input: StudioByAI21LabsEndpointInputSchemas.chatCompletions,
		output: StudioByAI21LabsEndpointOutputSchemas.chatCompletions,
	},
	'library.list': {
		input: StudioByAI21LabsEndpointInputSchemas.listLibraryFiles,
		output: StudioByAI21LabsEndpointOutputSchemas.listLibraryFiles,
	},
	'library.upload': {
		input: StudioByAI21LabsEndpointInputSchemas.uploadWorkspaceFile,
		output: StudioByAI21LabsEndpointOutputSchemas.uploadWorkspaceFile,
	},
	'library.get': {
		input: StudioByAI21LabsEndpointInputSchemas.getWorkspaceFile,
		output: StudioByAI21LabsEndpointOutputSchemas.getWorkspaceFile,
	},
	'library.update': {
		input: StudioByAI21LabsEndpointInputSchemas.updateFile,
		output: StudioByAI21LabsEndpointOutputSchemas.updateFile,
	},
	'library.delete': {
		input: StudioByAI21LabsEndpointInputSchemas.deleteFile,
		output: StudioByAI21LabsEndpointOutputSchemas.deleteFile,
	},
	'library.download': {
		input: StudioByAI21LabsEndpointInputSchemas.getFileDownloadLink,
		output: StudioByAI21LabsEndpointOutputSchemas.getFileDownloadLink,
	},
	'maestro.createRun': {
		input: StudioByAI21LabsEndpointInputSchemas.createMaestroRun,
		output: StudioByAI21LabsEndpointOutputSchemas.createMaestroRun,
	},
	'maestro.retrieveRun': {
		input: StudioByAI21LabsEndpointInputSchemas.retrieveMaestroRun,
		output: StudioByAI21LabsEndpointOutputSchemas.retrieveMaestroRun,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof studioByAI21LabsEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const studioByAI21LabsEndpointMeta = {
	'chat.completions': {
		riskLevel: 'write',
		description: 'Generate a Jamba chat completion from a conversation history',
	},
	'library.list': {
		riskLevel: 'read',
		description: 'List workspace library files with optional filters',
	},
	'library.upload': {
		riskLevel: 'write',
		description: 'Upload a file or register a public URL in the library',
	},
	'library.get': {
		riskLevel: 'read',
		description: 'Get metadata for a library file',
	},
	'library.update': {
		riskLevel: 'write',
		description: 'Update a library file public URL or labels',
	},
	'library.delete': {
		riskLevel: 'write',
		description: 'Delete a library file',
	},
	'library.download': {
		riskLevel: 'read',
		description: 'Get a signed download URL for a library file',
	},
	'maestro.createRun': {
		riskLevel: 'write',
		description: 'Create an AI21 Maestro run',
	},
	'maestro.retrieveRun': {
		riskLevel: 'read',
		description: 'Retrieve an AI21 Maestro run by id',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof studioByAI21LabsEndpointsNested
>;

export const studioByAI21LabsAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseStudioByAI21LabsPlugin<
	T extends StudioByAI21LabsPluginOptions,
> = CorsairPlugin<
	'studiobyai21labs',
	typeof StudioByAI21LabsSchema,
	typeof studioByAI21LabsEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof studioByAI21LabsAuthConfig
>;

export type InternalStudioByAI21LabsPlugin =
	BaseStudioByAI21LabsPlugin<StudioByAI21LabsPluginOptions>;

export type ExternalStudioByAI21LabsPlugin<
	T extends StudioByAI21LabsPluginOptions,
> = BaseStudioByAI21LabsPlugin<T>;

export function studiobyai21labs<const T extends StudioByAI21LabsPluginOptions>(
	incomingOptions: StudioByAI21LabsPluginOptions &
		T = {} as StudioByAI21LabsPluginOptions & T,
): ExternalStudioByAI21LabsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'studiobyai21labs',
		schema: StudioByAI21LabsSchema,
		options,
		hooks: options.hooks,
		endpoints: studioByAI21LabsEndpointsNested,
		webhooks: {},
		endpointMeta: studioByAI21LabsEndpointMeta,
		endpointSchemas: studioByAI21LabsEndpointSchemas,
		authConfig: studioByAI21LabsAuthConfig,
		pluginWebhookMatcher: () => false,
		errorHandlers: (() => {
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
		keyBuilder: async (ctx: StudioByAI21LabsKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) {
					throw new AuthMissingError('studiobyai21labs', 'api_key');
				}
				return key;
			}

			throw new AuthMissingError('studiobyai21labs', 'api_key');
		},
	} satisfies InternalStudioByAI21LabsPlugin;
}

export type {
	ChatCompletionsInput,
	ChatCompletionsResponse,
	CreateMaestroRunInput,
	CreateMaestroRunResponse,
	DeleteFileInput,
	DeleteFileResponse,
	GetFileDownloadLinkInput,
	GetFileDownloadLinkResponse,
	GetWorkspaceFileInput,
	GetWorkspaceFileResponse,
	ListLibraryFilesInput,
	ListLibraryFilesResponse,
	RetrieveMaestroRunInput,
	RetrieveMaestroRunResponse,
	StudioByAI21LabsEndpointInputs,
	StudioByAI21LabsEndpointOutputs,
	UpdateFileInput,
	UpdateFileResponse,
	UploadWorkspaceFileInput,
	UploadWorkspaceFileResponse,
} from './endpoints/types';

export {
	StudioByAI21LabsEndpointInputSchemas,
	StudioByAI21LabsEndpointOutputSchemas,
} from './endpoints/types';
