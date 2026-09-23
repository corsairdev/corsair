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
import {
	Bots,
	Conversations,
	Documents,
	Folders,
	Messages,
	Uploads,
} from './endpoints';
import type {
	CodyEndpointInputs,
	CodyEndpointOutputs,
} from './endpoints/types';
import {
	CodyEndpointInputSchemas,
	CodyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CodySchema } from './schema';

export type CodyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCodyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof codyEndpointsNested>;
};

export type CodyContext = CorsairPluginContext<
	typeof CodySchema,
	CodyPluginOptions
>;

export type CodyKeyBuilderContext = KeyBuilderContext<CodyPluginOptions>;

export type CodyBoundEndpoints = BindEndpoints<typeof codyEndpointsNested>;

type CodyEndpoint<K extends keyof CodyEndpointOutputs> = CorsairEndpoint<
	CodyContext,
	CodyEndpointInputs[K],
	CodyEndpointOutputs[K]
>;

export type CodyEndpoints = {
	botsList: CodyEndpoint<'botsList'>;
	conversationsList: CodyEndpoint<'conversationsList'>;
	conversationsCreate: CodyEndpoint<'conversationsCreate'>;
	conversationsGet: CodyEndpoint<'conversationsGet'>;
	conversationsUpdate: CodyEndpoint<'conversationsUpdate'>;
	conversationsDelete: CodyEndpoint<'conversationsDelete'>;
	documentsList: CodyEndpoint<'documentsList'>;
	documentsCreate: CodyEndpoint<'documentsCreate'>;
	documentsCreateFromFile: CodyEndpoint<'documentsCreateFromFile'>;
	documentsCreateFromWebpage: CodyEndpoint<'documentsCreateFromWebpage'>;
	documentsGet: CodyEndpoint<'documentsGet'>;
	documentsDelete: CodyEndpoint<'documentsDelete'>;
	foldersList: CodyEndpoint<'foldersList'>;
	foldersCreate: CodyEndpoint<'foldersCreate'>;
	foldersGet: CodyEndpoint<'foldersGet'>;
	foldersUpdate: CodyEndpoint<'foldersUpdate'>;
	messagesList: CodyEndpoint<'messagesList'>;
	messagesSend: CodyEndpoint<'messagesSend'>;
	messagesGet: CodyEndpoint<'messagesGet'>;
	messagesSendForStream: CodyEndpoint<'messagesSendForStream'>;
	uploadsGetSignedUrl: CodyEndpoint<'uploadsGetSignedUrl'>;
};

const codyEndpointsNested = {
	bots: {
		list: Bots.list,
	},
	conversations: {
		list: Conversations.list,
		create: Conversations.create,
		get: Conversations.get,
		update: Conversations.update,
		delete: Conversations.delete,
	},
	documents: {
		list: Documents.list,
		create: Documents.create,
		createFromFile: Documents.createFromFile,
		createFromWebpage: Documents.createFromWebpage,
		get: Documents.get,
		delete: Documents.delete,
	},
	folders: {
		list: Folders.list,
		create: Folders.create,
		get: Folders.get,
		update: Folders.update,
	},
	messages: {
		list: Messages.list,
		send: Messages.send,
		get: Messages.get,
		sendForStream: Messages.sendForStream,
	},
	uploads: {
		getSignedUrl: Uploads.getSignedUrl,
	},
} as const;

export const codyEndpointSchemas = {
	'bots.list': {
		input: CodyEndpointInputSchemas.botsList,
		output: CodyEndpointOutputSchemas.botsList,
	},
	'conversations.list': {
		input: CodyEndpointInputSchemas.conversationsList,
		output: CodyEndpointOutputSchemas.conversationsList,
	},
	'conversations.create': {
		input: CodyEndpointInputSchemas.conversationsCreate,
		output: CodyEndpointOutputSchemas.conversationsCreate,
	},
	'conversations.get': {
		input: CodyEndpointInputSchemas.conversationsGet,
		output: CodyEndpointOutputSchemas.conversationsGet,
	},
	'conversations.update': {
		input: CodyEndpointInputSchemas.conversationsUpdate,
		output: CodyEndpointOutputSchemas.conversationsUpdate,
	},
	'conversations.delete': {
		input: CodyEndpointInputSchemas.conversationsDelete,
		output: CodyEndpointOutputSchemas.conversationsDelete,
	},
	'documents.list': {
		input: CodyEndpointInputSchemas.documentsList,
		output: CodyEndpointOutputSchemas.documentsList,
	},
	'documents.create': {
		input: CodyEndpointInputSchemas.documentsCreate,
		output: CodyEndpointOutputSchemas.documentsCreate,
	},
	'documents.createFromFile': {
		input: CodyEndpointInputSchemas.documentsCreateFromFile,
		output: CodyEndpointOutputSchemas.documentsCreateFromFile,
	},
	'documents.createFromWebpage': {
		input: CodyEndpointInputSchemas.documentsCreateFromWebpage,
		output: CodyEndpointOutputSchemas.documentsCreateFromWebpage,
	},
	'documents.get': {
		input: CodyEndpointInputSchemas.documentsGet,
		output: CodyEndpointOutputSchemas.documentsGet,
	},
	'documents.delete': {
		input: CodyEndpointInputSchemas.documentsDelete,
		output: CodyEndpointOutputSchemas.documentsDelete,
	},
	'folders.list': {
		input: CodyEndpointInputSchemas.foldersList,
		output: CodyEndpointOutputSchemas.foldersList,
	},
	'folders.create': {
		input: CodyEndpointInputSchemas.foldersCreate,
		output: CodyEndpointOutputSchemas.foldersCreate,
	},
	'folders.get': {
		input: CodyEndpointInputSchemas.foldersGet,
		output: CodyEndpointOutputSchemas.foldersGet,
	},
	'folders.update': {
		input: CodyEndpointInputSchemas.foldersUpdate,
		output: CodyEndpointOutputSchemas.foldersUpdate,
	},
	'messages.list': {
		input: CodyEndpointInputSchemas.messagesList,
		output: CodyEndpointOutputSchemas.messagesList,
	},
	'messages.send': {
		input: CodyEndpointInputSchemas.messagesSend,
		output: CodyEndpointOutputSchemas.messagesSend,
	},
	'messages.get': {
		input: CodyEndpointInputSchemas.messagesGet,
		output: CodyEndpointOutputSchemas.messagesGet,
	},
	'messages.sendForStream': {
		input: CodyEndpointInputSchemas.messagesSendForStream,
		output: CodyEndpointOutputSchemas.messagesSendForStream,
	},
	'uploads.getSignedUrl': {
		input: CodyEndpointInputSchemas.uploadsGetSignedUrl,
		output: CodyEndpointOutputSchemas.uploadsGetSignedUrl,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof codyEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const codyEndpointMeta = {
	'bots.list': {
		riskLevel: 'read',
		description: 'Get all bots with optional keyword filtering',
	},
	'conversations.list': {
		riskLevel: 'read',
		description:
			'Get all conversations with optional filtering by bot, keyword, or includes',
	},
	'conversations.create': {
		riskLevel: 'write',
		description:
			'Create a new conversation with a specified bot and optional focus mode documents',
	},
	'conversations.get': {
		riskLevel: 'read',
		description: 'Fetch a conversation by its ID from Cody AI',
	},
	'conversations.update': {
		riskLevel: 'write',
		description:
			'Update a conversation by its ID including name, bot_id, and document_ids',
	},
	'conversations.delete': {
		riskLevel: 'write',
		description: 'Delete a conversation by its ID',
	},
	'documents.list': {
		riskLevel: 'read',
		description:
			'Retrieve all documents from Cody AI account with optional filtering',
	},
	'documents.create': {
		riskLevel: 'write',
		description: 'Create a new document with text or HTML content in Cody AI',
	},
	'documents.createFromFile': {
		riskLevel: 'write',
		description: 'Create a document by uploading a file (up to 100 MB)',
	},
	'documents.createFromWebpage': {
		riskLevel: 'write',
		description: 'Create a document from a publicly accessible webpage URL',
	},
	'documents.get': {
		riskLevel: 'read',
		description: 'Retrieve a specific document by its identifier from Cody AI',
	},
	'documents.delete': {
		riskLevel: 'write',
		description: 'Delete a document by id',
	},
	'folders.list': {
		riskLevel: 'read',
		description: 'Retrieve all folders with optional keyword filtering',
	},
	'folders.create': {
		riskLevel: 'write',
		description: 'Create a new folder in Cody AI for organizing content',
	},
	'folders.get': {
		riskLevel: 'read',
		description: 'Retrieve a specific folder by its identifier',
	},
	'folders.update': {
		riskLevel: 'write',
		description: 'Update a folder by its ID',
	},
	'messages.list': {
		riskLevel: 'read',
		description:
			'Retrieve a paginated list of messages from Cody, optionally filtered by conversation',
	},
	'messages.send': {
		riskLevel: 'write',
		description:
			'Send a message to Cody AI and receive an AI-generated response',
	},
	'messages.get': {
		riskLevel: 'read',
		description: 'Fetch a specific message by its ID from Cody AI',
	},
	'messages.sendForStream': {
		riskLevel: 'write',
		description:
			'Send a message to Cody AI and receive a Server-Sent Events (SSE) stream URL for the AI response',
	},
	'uploads.getSignedUrl': {
		riskLevel: 'read',
		description: 'Get an AWS S3 signed upload URL for file uploads',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof codyEndpointsNested>;

export const codyAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCodyPlugin<T extends CodyPluginOptions> = CorsairPlugin<
	'cody',
	typeof CodySchema,
	typeof codyEndpointsNested,
	never,
	T,
	typeof defaultAuthType
>;

export type InternalCodyPlugin = BaseCodyPlugin<CodyPluginOptions>;

export type ExternalCodyPlugin<T extends CodyPluginOptions> = BaseCodyPlugin<T>;

export function cody<const T extends CodyPluginOptions>(
	incomingOptions: CodyPluginOptions & T = {} as CodyPluginOptions & T,
): ExternalCodyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'cody',
		authConfig: codyAuthConfig,
		schema: CodySchema,
		options: options,
		hooks: options.hooks,
		endpoints: codyEndpointsNested,
		endpointMeta: codyEndpointMeta,
		endpointSchemas: codyEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CodyKeyBuilderContext, source) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('cody', 'api_key');
			}

			const configuredKey = options.key?.trim();
			if (configuredKey) {
				return configuredKey;
			}

			const res = await ctx.keys?.get_api_key();
			const storedKey = res?.trim();
			if (!storedKey) {
				throw new AuthMissingError('cody', 'api_key');
			}

			return storedKey;
		},
	} satisfies InternalCodyPlugin;
}

export type {
	CodyEndpointInputs,
	CodyEndpointOutputs,
} from './endpoints/types';
