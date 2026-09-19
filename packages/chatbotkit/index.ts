import type {
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
	Blueprints,
	Bots,
	Conversations,
	Datasets,
	Files,
	Secrets,
	Skillsets,
	Tasks,
} from './endpoints';
import type {
	ChatbotkitEndpointInputs,
	ChatbotkitEndpointOutputs,
} from './endpoints/types';
import {
	ChatbotkitEndpointInputSchemas,
	ChatbotkitEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ChatbotkitSchema } from './schema';

export type ChatbotkitPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalChatbotkitPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof chatbotkitEndpointsNested>;
};

export type ChatbotkitContext = CorsairPluginContext<
	typeof ChatbotkitSchema,
	ChatbotkitPluginOptions
>;

export type ChatbotkitKeyBuilderContext =
	KeyBuilderContext<ChatbotkitPluginOptions>;

export type ChatbotkitBoundEndpoints = BindEndpoints<
	typeof chatbotkitEndpointsNested
>;

type ChatbotkitEndpoint<K extends keyof ChatbotkitEndpointOutputs> =
	CorsairEndpoint<
		ChatbotkitContext,
		ChatbotkitEndpointInputs[K],
		ChatbotkitEndpointOutputs[K]
	>;

export type ChatbotkitEndpoints = {
	// Bots
	botsList: ChatbotkitEndpoint<'botsList'>;
	botsGet: ChatbotkitEndpoint<'botsGet'>;
	botsCreate: ChatbotkitEndpoint<'botsCreate'>;
	botsUpdate: ChatbotkitEndpoint<'botsUpdate'>;
	botsDelete: ChatbotkitEndpoint<'botsDelete'>;
	botsUpvote: ChatbotkitEndpoint<'botsUpvote'>;
	botsDownvote: ChatbotkitEndpoint<'botsDownvote'>;

	// Datasets
	datasetsList: ChatbotkitEndpoint<'datasetsList'>;
	datasetsGet: ChatbotkitEndpoint<'datasetsGet'>;
	datasetsCreate: ChatbotkitEndpoint<'datasetsCreate'>;
	datasetsUpdate: ChatbotkitEndpoint<'datasetsUpdate'>;
	datasetsDelete: ChatbotkitEndpoint<'datasetsDelete'>;
	datasetsSearch: ChatbotkitEndpoint<'datasetsSearch'>;

	// Skillsets
	skillsetsList: ChatbotkitEndpoint<'skillsetsList'>;
	skillsetsGet: ChatbotkitEndpoint<'skillsetsGet'>;
	skillsetsCreate: ChatbotkitEndpoint<'skillsetsCreate'>;
	skillsetsUpdate: ChatbotkitEndpoint<'skillsetsUpdate'>;
	skillsetsDelete: ChatbotkitEndpoint<'skillsetsDelete'>;

	// Blueprints
	blueprintsList: ChatbotkitEndpoint<'blueprintsList'>;
	blueprintsGet: ChatbotkitEndpoint<'blueprintsGet'>;
	blueprintsCreate: ChatbotkitEndpoint<'blueprintsCreate'>;
	blueprintsUpdate: ChatbotkitEndpoint<'blueprintsUpdate'>;
	blueprintsDelete: ChatbotkitEndpoint<'blueprintsDelete'>;

	// Secrets
	secretsList: ChatbotkitEndpoint<'secretsList'>;
	secretsGet: ChatbotkitEndpoint<'secretsGet'>;
	secretsCreate: ChatbotkitEndpoint<'secretsCreate'>;
	secretsUpdate: ChatbotkitEndpoint<'secretsUpdate'>;
	secretsDelete: ChatbotkitEndpoint<'secretsDelete'>;

	// Conversations
	conversationsList: ChatbotkitEndpoint<'conversationsList'>;
	conversationsGet: ChatbotkitEndpoint<'conversationsGet'>;
	conversationsCreate: ChatbotkitEndpoint<'conversationsCreate'>;
	conversationsUpdate: ChatbotkitEndpoint<'conversationsUpdate'>;
	conversationsDelete: ChatbotkitEndpoint<'conversationsDelete'>;
	conversationsComplete: ChatbotkitEndpoint<'conversationsComplete'>;

	// Files
	filesList: ChatbotkitEndpoint<'filesList'>;
	filesGet: ChatbotkitEndpoint<'filesGet'>;
	filesCreate: ChatbotkitEndpoint<'filesCreate'>;
	filesDelete: ChatbotkitEndpoint<'filesDelete'>;

	// Tasks
	tasksList: ChatbotkitEndpoint<'tasksList'>;
	tasksGet: ChatbotkitEndpoint<'tasksGet'>;
	tasksCreate: ChatbotkitEndpoint<'tasksCreate'>;
	tasksUpdate: ChatbotkitEndpoint<'tasksUpdate'>;
	tasksDelete: ChatbotkitEndpoint<'tasksDelete'>;
};

const chatbotkitEndpointsNested = {
	bots: {
		list: Bots.list,
		get: Bots.get,
		create: Bots.create,
		update: Bots.update,
		delete: Bots.del,
		upvote: Bots.upvote,
		downvote: Bots.downvote,
	},
	datasets: {
		list: Datasets.list,
		get: Datasets.get,
		create: Datasets.create,
		update: Datasets.update,
		delete: Datasets.del,
		search: Datasets.search,
	},
	skillsets: {
		list: Skillsets.list,
		get: Skillsets.get,
		create: Skillsets.create,
		update: Skillsets.update,
		delete: Skillsets.del,
	},
	blueprints: {
		list: Blueprints.list,
		get: Blueprints.get,
		create: Blueprints.create,
		update: Blueprints.update,
		delete: Blueprints.del,
	},
	secrets: {
		list: Secrets.list,
		get: Secrets.get,
		create: Secrets.create,
		update: Secrets.update,
		delete: Secrets.del,
	},
	conversations: {
		list: Conversations.list,
		get: Conversations.get,
		create: Conversations.create,
		update: Conversations.update,
		delete: Conversations.del,
		complete: Conversations.complete,
	},
	files: {
		list: Files.list,
		get: Files.get,
		create: Files.create,
		delete: Files.del,
	},
	tasks: {
		list: Tasks.list,
		get: Tasks.get,
		create: Tasks.create,
		update: Tasks.update,
		delete: Tasks.del,
	},
} as const;

export const chatbotkitEndpointSchemas = {
	// Bots
	'bots.list': {
		input: ChatbotkitEndpointInputSchemas.botsList,
		output: ChatbotkitEndpointOutputSchemas.botsList,
	},
	'bots.get': {
		input: ChatbotkitEndpointInputSchemas.botsGet,
		output: ChatbotkitEndpointOutputSchemas.botsGet,
	},
	'bots.create': {
		input: ChatbotkitEndpointInputSchemas.botsCreate,
		output: ChatbotkitEndpointOutputSchemas.botsCreate,
	},
	'bots.update': {
		input: ChatbotkitEndpointInputSchemas.botsUpdate,
		output: ChatbotkitEndpointOutputSchemas.botsUpdate,
	},
	'bots.delete': {
		input: ChatbotkitEndpointInputSchemas.botsDelete,
		output: ChatbotkitEndpointOutputSchemas.botsDelete,
	},
	'bots.upvote': {
		input: ChatbotkitEndpointInputSchemas.botsUpvote,
		output: ChatbotkitEndpointOutputSchemas.botsUpvote,
	},
	'bots.downvote': {
		input: ChatbotkitEndpointInputSchemas.botsDownvote,
		output: ChatbotkitEndpointOutputSchemas.botsDownvote,
	},

	// Datasets
	'datasets.list': {
		input: ChatbotkitEndpointInputSchemas.datasetsList,
		output: ChatbotkitEndpointOutputSchemas.datasetsList,
	},
	'datasets.get': {
		input: ChatbotkitEndpointInputSchemas.datasetsGet,
		output: ChatbotkitEndpointOutputSchemas.datasetsGet,
	},
	'datasets.create': {
		input: ChatbotkitEndpointInputSchemas.datasetsCreate,
		output: ChatbotkitEndpointOutputSchemas.datasetsCreate,
	},
	'datasets.update': {
		input: ChatbotkitEndpointInputSchemas.datasetsUpdate,
		output: ChatbotkitEndpointOutputSchemas.datasetsUpdate,
	},
	'datasets.delete': {
		input: ChatbotkitEndpointInputSchemas.datasetsDelete,
		output: ChatbotkitEndpointOutputSchemas.datasetsDelete,
	},
	'datasets.search': {
		input: ChatbotkitEndpointInputSchemas.datasetsSearch,
		output: ChatbotkitEndpointOutputSchemas.datasetsSearch,
	},

	// Skillsets
	'skillsets.list': {
		input: ChatbotkitEndpointInputSchemas.skillsetsList,
		output: ChatbotkitEndpointOutputSchemas.skillsetsList,
	},
	'skillsets.get': {
		input: ChatbotkitEndpointInputSchemas.skillsetsGet,
		output: ChatbotkitEndpointOutputSchemas.skillsetsGet,
	},
	'skillsets.create': {
		input: ChatbotkitEndpointInputSchemas.skillsetsCreate,
		output: ChatbotkitEndpointOutputSchemas.skillsetsCreate,
	},
	'skillsets.update': {
		input: ChatbotkitEndpointInputSchemas.skillsetsUpdate,
		output: ChatbotkitEndpointOutputSchemas.skillsetsUpdate,
	},
	'skillsets.delete': {
		input: ChatbotkitEndpointInputSchemas.skillsetsDelete,
		output: ChatbotkitEndpointOutputSchemas.skillsetsDelete,
	},

	// Blueprints
	'blueprints.list': {
		input: ChatbotkitEndpointInputSchemas.blueprintsList,
		output: ChatbotkitEndpointOutputSchemas.blueprintsList,
	},
	'blueprints.get': {
		input: ChatbotkitEndpointInputSchemas.blueprintsGet,
		output: ChatbotkitEndpointOutputSchemas.blueprintsGet,
	},
	'blueprints.create': {
		input: ChatbotkitEndpointInputSchemas.blueprintsCreate,
		output: ChatbotkitEndpointOutputSchemas.blueprintsCreate,
	},
	'blueprints.update': {
		input: ChatbotkitEndpointInputSchemas.blueprintsUpdate,
		output: ChatbotkitEndpointOutputSchemas.blueprintsUpdate,
	},
	'blueprints.delete': {
		input: ChatbotkitEndpointInputSchemas.blueprintsDelete,
		output: ChatbotkitEndpointOutputSchemas.blueprintsDelete,
	},

	// Secrets
	'secrets.list': {
		input: ChatbotkitEndpointInputSchemas.secretsList,
		output: ChatbotkitEndpointOutputSchemas.secretsList,
	},
	'secrets.get': {
		input: ChatbotkitEndpointInputSchemas.secretsGet,
		output: ChatbotkitEndpointOutputSchemas.secretsGet,
	},
	'secrets.create': {
		input: ChatbotkitEndpointInputSchemas.secretsCreate,
		output: ChatbotkitEndpointOutputSchemas.secretsCreate,
	},
	'secrets.update': {
		input: ChatbotkitEndpointInputSchemas.secretsUpdate,
		output: ChatbotkitEndpointOutputSchemas.secretsUpdate,
	},
	'secrets.delete': {
		input: ChatbotkitEndpointInputSchemas.secretsDelete,
		output: ChatbotkitEndpointOutputSchemas.secretsDelete,
	},

	// Conversations
	'conversations.list': {
		input: ChatbotkitEndpointInputSchemas.conversationsList,
		output: ChatbotkitEndpointOutputSchemas.conversationsList,
	},
	'conversations.get': {
		input: ChatbotkitEndpointInputSchemas.conversationsGet,
		output: ChatbotkitEndpointOutputSchemas.conversationsGet,
	},
	'conversations.create': {
		input: ChatbotkitEndpointInputSchemas.conversationsCreate,
		output: ChatbotkitEndpointOutputSchemas.conversationsCreate,
	},
	'conversations.update': {
		input: ChatbotkitEndpointInputSchemas.conversationsUpdate,
		output: ChatbotkitEndpointOutputSchemas.conversationsUpdate,
	},
	'conversations.delete': {
		input: ChatbotkitEndpointInputSchemas.conversationsDelete,
		output: ChatbotkitEndpointOutputSchemas.conversationsDelete,
	},
	'conversations.complete': {
		input: ChatbotkitEndpointInputSchemas.conversationsComplete,
		output: ChatbotkitEndpointOutputSchemas.conversationsComplete,
	},

	// Files
	'files.list': {
		input: ChatbotkitEndpointInputSchemas.filesList,
		output: ChatbotkitEndpointOutputSchemas.filesList,
	},
	'files.get': {
		input: ChatbotkitEndpointInputSchemas.filesGet,
		output: ChatbotkitEndpointOutputSchemas.filesGet,
	},
	'files.create': {
		input: ChatbotkitEndpointInputSchemas.filesCreate,
		output: ChatbotkitEndpointOutputSchemas.filesCreate,
	},
	'files.delete': {
		input: ChatbotkitEndpointInputSchemas.filesDelete,
		output: ChatbotkitEndpointOutputSchemas.filesDelete,
	},

	// Tasks
	'tasks.list': {
		input: ChatbotkitEndpointInputSchemas.tasksList,
		output: ChatbotkitEndpointOutputSchemas.tasksList,
	},
	'tasks.get': {
		input: ChatbotkitEndpointInputSchemas.tasksGet,
		output: ChatbotkitEndpointOutputSchemas.tasksGet,
	},
	'tasks.create': {
		input: ChatbotkitEndpointInputSchemas.tasksCreate,
		output: ChatbotkitEndpointOutputSchemas.tasksCreate,
	},
	'tasks.update': {
		input: ChatbotkitEndpointInputSchemas.tasksUpdate,
		output: ChatbotkitEndpointOutputSchemas.tasksUpdate,
	},
	'tasks.delete': {
		input: ChatbotkitEndpointInputSchemas.tasksDelete,
		output: ChatbotkitEndpointOutputSchemas.tasksDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof chatbotkitEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const chatbotkitEndpointMeta = {
	// Bots
	'bots.list': {
		riskLevel: 'read',
		description: 'List bots on the ChatBotKit account, cursor-paginated',
	},
	'bots.get': {
		riskLevel: 'read',
		description: 'Fetch a single bot by ID or alias',
	},
	'bots.create': {
		riskLevel: 'write',
		description: 'Create a new AI bot',
	},
	'bots.update': {
		riskLevel: 'write',
		description: 'Update an existing bot configuration',
	},
	'bots.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a bot',
	},
	'bots.upvote': {
		riskLevel: 'write',
		description: 'Register an upvote for a bot',
	},
	'bots.downvote': {
		riskLevel: 'write',
		description: 'Register a downvote for a bot',
	},

	// Datasets
	'datasets.list': {
		riskLevel: 'read',
		description: 'List knowledge datasets, cursor-paginated',
	},
	'datasets.get': {
		riskLevel: 'read',
		description: 'Fetch a dataset by ID',
	},
	'datasets.create': {
		riskLevel: 'write',
		description: 'Create a new knowledge dataset',
	},
	'datasets.update': {
		riskLevel: 'write',
		description: 'Update dataset configuration',
	},
	'datasets.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a dataset',
	},
	'datasets.search': {
		riskLevel: 'read',
		description: 'Search a dataset for relevant knowledge records',
	},

	// Skillsets
	'skillsets.list': {
		riskLevel: 'read',
		description: 'List skillsets on the account, cursor-paginated',
	},
	'skillsets.get': {
		riskLevel: 'read',
		description: 'Fetch a skillset by ID',
	},
	'skillsets.create': {
		riskLevel: 'write',
		description: 'Create a new skillset container',
	},
	'skillsets.update': {
		riskLevel: 'write',
		description: 'Update skillset configuration or state',
	},
	'skillsets.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a skillset',
	},

	// Blueprints
	'blueprints.list': {
		riskLevel: 'read',
		description: 'List blueprint templates, cursor-paginated',
	},
	'blueprints.get': {
		riskLevel: 'read',
		description: 'Fetch a blueprint template by ID',
	},
	'blueprints.create': {
		riskLevel: 'write',
		description: 'Create a new blueprint configuration template',
	},
	'blueprints.update': {
		riskLevel: 'write',
		description: 'Update an existing blueprint template',
	},
	'blueprints.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a blueprint template',
	},

	// Secrets
	'secrets.list': {
		riskLevel: 'read',
		description: 'List integration secrets, cursor-paginated',
	},
	'secrets.get': {
		riskLevel: 'read',
		description: 'Fetch a secret credential by ID',
	},
	'secrets.create': {
		riskLevel: 'write',
		description: 'Create a new integration secret credential',
	},
	'secrets.update': {
		riskLevel: 'write',
		description: 'Update an existing integration secret credential',
	},
	'secrets.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a secret credential',
	},

	// Conversations
	'conversations.list': {
		riskLevel: 'read',
		description: 'List conversations, cursor-paginated',
	},
	'conversations.get': {
		riskLevel: 'read',
		description: 'Fetch a conversation by ID',
	},
	'conversations.create': {
		riskLevel: 'write',
		description: 'Create a new conversation chat session',
	},
	'conversations.update': {
		riskLevel: 'write',
		description: 'Update conversation metadata or bot association',
	},
	'conversations.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a conversation session',
	},
	'conversations.complete': {
		riskLevel: 'write',
		description: 'Send message to conversation and get AI response',
	},

	// Files
	'files.list': {
		riskLevel: 'read',
		description: 'List uploaded file resources, cursor-paginated',
	},
	'files.get': {
		riskLevel: 'read',
		description: 'Fetch file metadata by ID',
	},
	'files.create': {
		riskLevel: 'write',
		description: 'Create a new file record',
	},
	'files.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a file resource',
	},

	// Tasks
	'tasks.list': {
		riskLevel: 'read',
		description: 'List background tasks, cursor-paginated',
	},
	'tasks.get': {
		riskLevel: 'read',
		description: 'Fetch a task by ID',
	},
	'tasks.create': {
		riskLevel: 'write',
		description: 'Create a new background execution task',
	},
	'tasks.update': {
		riskLevel: 'write',
		description: 'Update task schedule or bot assignment',
	},
	'tasks.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a background task',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof chatbotkitEndpointsNested
>;

export const chatbotkitAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseChatbotkitPlugin<T extends ChatbotkitPluginOptions> =
	CorsairPlugin<
		'chatbotkit',
		typeof ChatbotkitSchema,
		typeof chatbotkitEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalChatbotkitPlugin =
	BaseChatbotkitPlugin<ChatbotkitPluginOptions>;

export type ExternalChatbotkitPlugin<T extends ChatbotkitPluginOptions> =
	BaseChatbotkitPlugin<T>;

export function chatbotkit<const T extends ChatbotkitPluginOptions>(
	incomingOptions: ChatbotkitPluginOptions & T = {} as ChatbotkitPluginOptions &
		T,
): ExternalChatbotkitPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'chatbotkit',
		authConfig: chatbotkitAuthConfig,
		schema: ChatbotkitSchema,
		options: options,
		hooks: options.hooks,
		endpoints: chatbotkitEndpointsNested,
		webhooks: {},
		endpointMeta: chatbotkitEndpointMeta,
		endpointSchemas: chatbotkitEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ChatbotkitKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys?.get_api_key();
				if (!res) {
					throw new AuthMissingError('chatbotkit', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('chatbotkit', 'api_key');
		},
	} satisfies InternalChatbotkitPlugin;
}

export type {
	// Blueprints
	Blueprint,
	BlueprintsCreateInput,
	BlueprintsCreateResponse,
	BlueprintsDeleteInput,
	BlueprintsDeleteResponse,
	BlueprintsGetInput,
	BlueprintsGetResponse,
	BlueprintsListInput,
	BlueprintsListResponse,
	BlueprintsUpdateInput,
	BlueprintsUpdateResponse,
	// Bots
	Bot,
	BotsCreateInput,
	BotsCreateResponse,
	BotsDeleteInput,
	BotsDeleteResponse,
	BotsDownvoteInput,
	BotsDownvoteResponse,
	BotsGetInput,
	BotsGetResponse,
	BotsListInput,
	BotsListResponse,
	BotsUpdateInput,
	BotsUpdateResponse,
	BotsUpvoteInput,
	BotsUpvoteResponse,
	ChatbotkitEndpointInputs,
	ChatbotkitEndpointOutputs,
	// Files
	ChatbotkitFile,
	// Conversations
	Conversation,
	ConversationCompletionResponse,
	ConversationsCompleteInput,
	ConversationsCompleteResponse,
	ConversationsCreateInput,
	ConversationsCreateResponse,
	ConversationsDeleteInput,
	ConversationsDeleteResponse,
	ConversationsGetInput,
	ConversationsGetResponse,
	ConversationsListInput,
	ConversationsListResponse,
	ConversationsUpdateInput,
	ConversationsUpdateResponse,
	// Datasets
	Dataset,
	DatasetsCreateInput,
	DatasetsCreateResponse,
	DatasetsDeleteInput,
	DatasetsDeleteResponse,
	DatasetsGetInput,
	DatasetsGetResponse,
	DatasetsListInput,
	DatasetsListResponse,
	DatasetsSearchInput,
	DatasetsSearchResponse,
	DatasetsUpdateInput,
	DatasetsUpdateResponse,
	FilesCreateInput,
	FilesCreateResponse,
	FilesDeleteInput,
	FilesDeleteResponse,
	FilesGetInput,
	FilesGetResponse,
	FilesListInput,
	FilesListResponse,
	// Secrets
	Secret,
	SecretsCreateInput,
	SecretsCreateResponse,
	SecretsDeleteInput,
	SecretsDeleteResponse,
	SecretsGetInput,
	SecretsGetResponse,
	SecretsListInput,
	SecretsListResponse,
	SecretsUpdateInput,
	SecretsUpdateResponse,
	// Skillsets
	Skillset,
	SkillsetsCreateInput,
	SkillsetsCreateResponse,
	SkillsetsDeleteInput,
	SkillsetsDeleteResponse,
	SkillsetsGetInput,
	SkillsetsGetResponse,
	SkillsetsListInput,
	SkillsetsListResponse,
	SkillsetsUpdateInput,
	SkillsetsUpdateResponse,
	// Tasks
	Task,
	TasksCreateInput,
	TasksCreateResponse,
	TasksDeleteInput,
	TasksDeleteResponse,
	TasksGetInput,
	TasksGetResponse,
	TasksListInput,
	TasksListResponse,
	TasksUpdateInput,
	TasksUpdateResponse,
} from './endpoints/types';

export type {
	ChatbotkitBlueprint,
	ChatbotkitBot,
	ChatbotkitDataset,
	ChatbotkitSecret,
	ChatbotkitSkillset,
} from './schema/database';
