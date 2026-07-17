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
	AssistantsEndpoints,
	AudioEndpoints,
	BatchesEndpoints,
	ChatCompletionsEndpoints,
	ChatEndpoints,
	ChatkitEndpoints,
	CompletionsEndpoints,
	ContainerFilesEndpoints,
	ContainersEndpoints,
	ConversationsEndpoints,
	EmbeddingsEndpoints,
	EnginesEndpoints,
	EvalRunsEndpoints,
	EvalsEndpoints,
	FilesEndpoints,
	FineTuningEndpoints,
	GradersEndpoints,
	ImagesEndpoints,
	MessagesEndpoints,
	ModelsEndpoints,
	ModerationEndpoints,
	RealtimeEndpoints,
	ResponsesEndpoints,
	RunStepsEndpoints,
	RunsEndpoints,
	SkillsEndpoints,
	ThreadsEndpoints,
	TokensEndpoints,
	UploadsEndpoints,
	VectorStoreFileBatchesEndpoints,
	VectorStoreFilesEndpoints,
	VectorStoresEndpoints,
	VideosEndpoints,
} from './endpoints';
import type {
	OpenaiEndpointInputs,
	OpenaiEndpointOutputs,
} from './endpoints/types';
import {
	OpenaiEndpointInputSchemas,
	OpenaiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { OpenaiSchema } from './schema';

export type OpenaiPluginOptions = {
	/** Authentication method. Only api_key is supported. */
	authType?: PickAuth<'api_key'>;
	/** Optional: pass the API key directly (bypasses key manager) */
	key?: string;
	/** Optional: lifecycle hooks for endpoints */
	hooks?: InternalOpenaiPlugin['hooks'];
	/** Optional: custom error handlers (merged with defaults) */
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof openaiEndpointsNested>;
};

export type OpenaiContext = CorsairPluginContext<
	typeof OpenaiSchema,
	OpenaiPluginOptions
>;

export type OpenaiKeyBuilderContext = KeyBuilderContext<OpenaiPluginOptions>;

export type OpenaiBoundEndpoints = BindEndpoints<typeof openaiEndpointsNested>;

type OpenaiEndpoint<K extends keyof OpenaiEndpointOutputs> = CorsairEndpoint<
	OpenaiContext,
	OpenaiEndpointInputs[K],
	OpenaiEndpointOutputs[K]
>;

export type OpenaiEndpoints = {
	[K in keyof OpenaiEndpointOutputs]: OpenaiEndpoint<K>;
};

const openaiEndpointsNested = {
	models: {
		list: ModelsEndpoints.list,
		retrieve: ModelsEndpoints.retrieve,
	},
	engines: {
		list: EnginesEndpoints.list,
		retrieve: EnginesEndpoints.retrieve,
	},
	chat: {
		createCompletion: ChatEndpoints.createCompletion,
	},
	embeddings: {
		create: EmbeddingsEndpoints.create,
	},
	files: {
		upload: FilesEndpoints.upload,
		list: FilesEndpoints.list,
		retrieve: FilesEndpoints.retrieve,
		delete: FilesEndpoints.delete,
		downloadContent: FilesEndpoints.downloadContent,
	},
	assistants: {
		create: AssistantsEndpoints.create,
		list: AssistantsEndpoints.list,
		retrieve: AssistantsEndpoints.retrieve,
		modify: AssistantsEndpoints.modify,
		delete: AssistantsEndpoints.delete,
	},
	threads: {
		create: ThreadsEndpoints.create,
		retrieve: ThreadsEndpoints.retrieve,
		modify: ThreadsEndpoints.modify,
		delete: ThreadsEndpoints.delete,
		createAndRun: ThreadsEndpoints.createAndRun,
	},
	messages: {
		create: MessagesEndpoints.create,
		list: MessagesEndpoints.list,
		retrieve: MessagesEndpoints.retrieve,
		modify: MessagesEndpoints.modify,
		delete: MessagesEndpoints.delete,
	},
	runs: {
		create: RunsEndpoints.create,
		list: RunsEndpoints.list,
		retrieve: RunsEndpoints.retrieve,
		modify: RunsEndpoints.modify,
		cancel: RunsEndpoints.cancel,
		submitToolOutputs: RunsEndpoints.submitToolOutputs,
	},
	runSteps: {
		list: RunStepsEndpoints.list,
		retrieve: RunStepsEndpoints.retrieve,
	},
	vectorStores: {
		create: VectorStoresEndpoints.create,
		list: VectorStoresEndpoints.list,
		retrieve: VectorStoresEndpoints.retrieve,
		modify: VectorStoresEndpoints.modify,
		delete: VectorStoresEndpoints.delete,
		search: VectorStoresEndpoints.search,
	},
	vectorStoreFiles: {
		create: VectorStoreFilesEndpoints.create,
		list: VectorStoreFilesEndpoints.list,
		retrieve: VectorStoreFilesEndpoints.retrieve,
		delete: VectorStoreFilesEndpoints.delete,
		updateAttributes: VectorStoreFilesEndpoints.updateAttributes,
		retrieveContent: VectorStoreFilesEndpoints.retrieveContent,
	},
	vectorStoreFileBatches: {
		create: VectorStoreFileBatchesEndpoints.create,
		retrieve: VectorStoreFileBatchesEndpoints.retrieve,
		listFiles: VectorStoreFileBatchesEndpoints.listFiles,
	},
	moderation: {
		create: ModerationEndpoints.create,
	},
	audio: {
		createSpeech: AudioEndpoints.createSpeech,
		createTranscription: AudioEndpoints.createTranscription,
		createTranslation: AudioEndpoints.createTranslation,
	},
	images: {
		create: ImagesEndpoints.create,
		createEdit: ImagesEndpoints.createEdit,
		createVariation: ImagesEndpoints.createVariation,
	},
	videos: {
		create: VideosEndpoints.create,
		list: VideosEndpoints.list,
		retrieve: VideosEndpoints.retrieve,
		delete: VideosEndpoints.delete,
		createRemix: VideosEndpoints.createRemix,
		download: VideosEndpoints.download,
	},
	realtime: {
		createCall: RealtimeEndpoints.createCall,
		createClientSecret: RealtimeEndpoints.createClientSecret,
		createSession: RealtimeEndpoints.createSession,
		createTranscriptionSession: RealtimeEndpoints.createTranscriptionSession,
	},
	chatkit: {
		listThreads: ChatkitEndpoints.listThreads,
		getThread: ChatkitEndpoints.getThread,
		listThreadItems: ChatkitEndpoints.listThreadItems,
	},
	skills: {
		create: SkillsEndpoints.create,
		list: SkillsEndpoints.list,
		delete: SkillsEndpoints.delete,
	},
	containers: {
		create: ContainersEndpoints.create,
		list: ContainersEndpoints.list,
		retrieve: ContainersEndpoints.retrieve,
		delete: ContainersEndpoints.delete,
	},
	containerFiles: {
		create: ContainerFilesEndpoints.create,
		list: ContainerFilesEndpoints.list,
		retrieve: ContainerFilesEndpoints.retrieve,
		retrieveContent: ContainerFilesEndpoints.retrieveContent,
		delete: ContainerFilesEndpoints.delete,
	},
	conversations: {
		create: ConversationsEndpoints.create,
		update: ConversationsEndpoints.update,
		delete: ConversationsEndpoints.delete,
		createItems: ConversationsEndpoints.createItems,
		listItems: ConversationsEndpoints.listItems,
		getItem: ConversationsEndpoints.getItem,
		deleteItem: ConversationsEndpoints.deleteItem,
	},
	fineTuning: {
		createJob: FineTuningEndpoints.createJob,
		listJobs: FineTuningEndpoints.listJobs,
		retrieveJob: FineTuningEndpoints.retrieveJob,
		listCheckpoints: FineTuningEndpoints.listCheckpoints,
		listEvents: FineTuningEndpoints.listEvents,
		cancelJob: FineTuningEndpoints.cancelJob,
	},
	completions: {
		create: CompletionsEndpoints.create,
	},
	responses: {
		create: ResponsesEndpoints.create,
		retrieve: ResponsesEndpoints.retrieve,
		delete: ResponsesEndpoints.delete,
		cancel: ResponsesEndpoints.cancel,
		compact: ResponsesEndpoints.compact,
		listInputItems: ResponsesEndpoints.listInputItems,
	},
	chatCompletions: {
		list: ChatCompletionsEndpoints.list,
		retrieve: ChatCompletionsEndpoints.retrieve,
		update: ChatCompletionsEndpoints.update,
		delete: ChatCompletionsEndpoints.delete,
		listMessages: ChatCompletionsEndpoints.listMessages,
	},
	tokens: {
		countInput: TokensEndpoints.countInput,
	},
	evals: {
		create: EvalsEndpoints.create,
		list: EvalsEndpoints.list,
		get: EvalsEndpoints.get,
		update: EvalsEndpoints.update,
		delete: EvalsEndpoints.delete,
	},
	evalRuns: {
		create: EvalRunsEndpoints.create,
		get: EvalRunsEndpoints.get,
		list: EvalRunsEndpoints.list,
		cancel: EvalRunsEndpoints.cancel,
		delete: EvalRunsEndpoints.delete,
		getOutputItem: EvalRunsEndpoints.getOutputItem,
		listOutputItems: EvalRunsEndpoints.listOutputItems,
	},
	graders: {
		run: GradersEndpoints.run,
		validate: GradersEndpoints.validate,
	},
	batches: {
		create: BatchesEndpoints.create,
		retrieve: BatchesEndpoints.retrieve,
		cancel: BatchesEndpoints.cancel,
		list: BatchesEndpoints.list,
	},
	uploads: {
		create: UploadsEndpoints.create,
		addPart: UploadsEndpoints.addPart,
		complete: UploadsEndpoints.complete,
		cancel: UploadsEndpoints.cancel,
	},
} as const;

// No webhooks — OpenAI's REST API is pull-based; this plugin only covers issue #335's scope.
const openaiWebhooksNested = {} as const;

export const openaiEndpointSchemas = {
	'models.list': {
		input: OpenaiEndpointInputSchemas.modelsList,
		output: OpenaiEndpointOutputSchemas.modelsList,
	},
	'models.retrieve': {
		input: OpenaiEndpointInputSchemas.modelsRetrieve,
		output: OpenaiEndpointOutputSchemas.modelsRetrieve,
	},
	'engines.list': {
		input: OpenaiEndpointInputSchemas.enginesList,
		output: OpenaiEndpointOutputSchemas.enginesList,
	},
	'engines.retrieve': {
		input: OpenaiEndpointInputSchemas.enginesRetrieve,
		output: OpenaiEndpointOutputSchemas.enginesRetrieve,
	},
	'chat.createCompletion': {
		input: OpenaiEndpointInputSchemas.chatCreateCompletion,
		output: OpenaiEndpointOutputSchemas.chatCreateCompletion,
	},
	'embeddings.create': {
		input: OpenaiEndpointInputSchemas.embeddingsCreate,
		output: OpenaiEndpointOutputSchemas.embeddingsCreate,
	},
	'files.upload': {
		input: OpenaiEndpointInputSchemas.filesUpload,
		output: OpenaiEndpointOutputSchemas.filesUpload,
	},
	'files.list': {
		input: OpenaiEndpointInputSchemas.filesList,
		output: OpenaiEndpointOutputSchemas.filesList,
	},
	'files.retrieve': {
		input: OpenaiEndpointInputSchemas.filesRetrieve,
		output: OpenaiEndpointOutputSchemas.filesRetrieve,
	},
	'files.delete': {
		input: OpenaiEndpointInputSchemas.filesDelete,
		output: OpenaiEndpointOutputSchemas.filesDelete,
	},
	'files.downloadContent': {
		input: OpenaiEndpointInputSchemas.filesDownloadContent,
		output: OpenaiEndpointOutputSchemas.filesDownloadContent,
	},
	'assistants.create': {
		input: OpenaiEndpointInputSchemas.assistantsCreate,
		output: OpenaiEndpointOutputSchemas.assistantsCreate,
	},
	'assistants.list': {
		input: OpenaiEndpointInputSchemas.assistantsList,
		output: OpenaiEndpointOutputSchemas.assistantsList,
	},
	'assistants.retrieve': {
		input: OpenaiEndpointInputSchemas.assistantsRetrieve,
		output: OpenaiEndpointOutputSchemas.assistantsRetrieve,
	},
	'assistants.modify': {
		input: OpenaiEndpointInputSchemas.assistantsModify,
		output: OpenaiEndpointOutputSchemas.assistantsModify,
	},
	'assistants.delete': {
		input: OpenaiEndpointInputSchemas.assistantsDelete,
		output: OpenaiEndpointOutputSchemas.assistantsDelete,
	},
	'threads.create': {
		input: OpenaiEndpointInputSchemas.threadsCreate,
		output: OpenaiEndpointOutputSchemas.threadsCreate,
	},
	'threads.retrieve': {
		input: OpenaiEndpointInputSchemas.threadsRetrieve,
		output: OpenaiEndpointOutputSchemas.threadsRetrieve,
	},
	'threads.modify': {
		input: OpenaiEndpointInputSchemas.threadsModify,
		output: OpenaiEndpointOutputSchemas.threadsModify,
	},
	'threads.delete': {
		input: OpenaiEndpointInputSchemas.threadsDelete,
		output: OpenaiEndpointOutputSchemas.threadsDelete,
	},
	'threads.createAndRun': {
		input: OpenaiEndpointInputSchemas.threadsCreateAndRun,
		output: OpenaiEndpointOutputSchemas.threadsCreateAndRun,
	},
	'messages.create': {
		input: OpenaiEndpointInputSchemas.messagesCreate,
		output: OpenaiEndpointOutputSchemas.messagesCreate,
	},
	'messages.list': {
		input: OpenaiEndpointInputSchemas.messagesList,
		output: OpenaiEndpointOutputSchemas.messagesList,
	},
	'messages.retrieve': {
		input: OpenaiEndpointInputSchemas.messagesRetrieve,
		output: OpenaiEndpointOutputSchemas.messagesRetrieve,
	},
	'messages.modify': {
		input: OpenaiEndpointInputSchemas.messagesModify,
		output: OpenaiEndpointOutputSchemas.messagesModify,
	},
	'messages.delete': {
		input: OpenaiEndpointInputSchemas.messagesDelete,
		output: OpenaiEndpointOutputSchemas.messagesDelete,
	},
	'runs.create': {
		input: OpenaiEndpointInputSchemas.runsCreate,
		output: OpenaiEndpointOutputSchemas.runsCreate,
	},
	'runs.list': {
		input: OpenaiEndpointInputSchemas.runsList,
		output: OpenaiEndpointOutputSchemas.runsList,
	},
	'runs.retrieve': {
		input: OpenaiEndpointInputSchemas.runsRetrieve,
		output: OpenaiEndpointOutputSchemas.runsRetrieve,
	},
	'runs.modify': {
		input: OpenaiEndpointInputSchemas.runsModify,
		output: OpenaiEndpointOutputSchemas.runsModify,
	},
	'runs.cancel': {
		input: OpenaiEndpointInputSchemas.runsCancel,
		output: OpenaiEndpointOutputSchemas.runsCancel,
	},
	'runs.submitToolOutputs': {
		input: OpenaiEndpointInputSchemas.runsSubmitToolOutputs,
		output: OpenaiEndpointOutputSchemas.runsSubmitToolOutputs,
	},
	'runSteps.list': {
		input: OpenaiEndpointInputSchemas.runStepsList,
		output: OpenaiEndpointOutputSchemas.runStepsList,
	},
	'runSteps.retrieve': {
		input: OpenaiEndpointInputSchemas.runStepsRetrieve,
		output: OpenaiEndpointOutputSchemas.runStepsRetrieve,
	},
	'vectorStores.create': {
		input: OpenaiEndpointInputSchemas.vectorStoresCreate,
		output: OpenaiEndpointOutputSchemas.vectorStoresCreate,
	},
	'vectorStores.list': {
		input: OpenaiEndpointInputSchemas.vectorStoresList,
		output: OpenaiEndpointOutputSchemas.vectorStoresList,
	},
	'vectorStores.retrieve': {
		input: OpenaiEndpointInputSchemas.vectorStoresRetrieve,
		output: OpenaiEndpointOutputSchemas.vectorStoresRetrieve,
	},
	'vectorStores.modify': {
		input: OpenaiEndpointInputSchemas.vectorStoresModify,
		output: OpenaiEndpointOutputSchemas.vectorStoresModify,
	},
	'vectorStores.delete': {
		input: OpenaiEndpointInputSchemas.vectorStoresDelete,
		output: OpenaiEndpointOutputSchemas.vectorStoresDelete,
	},
	'vectorStores.search': {
		input: OpenaiEndpointInputSchemas.vectorStoresSearch,
		output: OpenaiEndpointOutputSchemas.vectorStoresSearch,
	},
	'vectorStoreFiles.create': {
		input: OpenaiEndpointInputSchemas.vectorStoreFilesCreate,
		output: OpenaiEndpointOutputSchemas.vectorStoreFilesCreate,
	},
	'vectorStoreFiles.list': {
		input: OpenaiEndpointInputSchemas.vectorStoreFilesList,
		output: OpenaiEndpointOutputSchemas.vectorStoreFilesList,
	},
	'vectorStoreFiles.retrieve': {
		input: OpenaiEndpointInputSchemas.vectorStoreFilesRetrieve,
		output: OpenaiEndpointOutputSchemas.vectorStoreFilesRetrieve,
	},
	'vectorStoreFiles.delete': {
		input: OpenaiEndpointInputSchemas.vectorStoreFilesDelete,
		output: OpenaiEndpointOutputSchemas.vectorStoreFilesDelete,
	},
	'vectorStoreFiles.updateAttributes': {
		input: OpenaiEndpointInputSchemas.vectorStoreFilesUpdateAttributes,
		output: OpenaiEndpointOutputSchemas.vectorStoreFilesUpdateAttributes,
	},
	'vectorStoreFiles.retrieveContent': {
		input: OpenaiEndpointInputSchemas.vectorStoreFilesRetrieveContent,
		output: OpenaiEndpointOutputSchemas.vectorStoreFilesRetrieveContent,
	},
	'vectorStoreFileBatches.create': {
		input: OpenaiEndpointInputSchemas.vectorStoreFileBatchesCreate,
		output: OpenaiEndpointOutputSchemas.vectorStoreFileBatchesCreate,
	},
	'vectorStoreFileBatches.retrieve': {
		input: OpenaiEndpointInputSchemas.vectorStoreFileBatchesRetrieve,
		output: OpenaiEndpointOutputSchemas.vectorStoreFileBatchesRetrieve,
	},
	'vectorStoreFileBatches.listFiles': {
		input: OpenaiEndpointInputSchemas.vectorStoreFileBatchesListFiles,
		output: OpenaiEndpointOutputSchemas.vectorStoreFileBatchesListFiles,
	},
	'moderation.create': {
		input: OpenaiEndpointInputSchemas.moderationCreate,
		output: OpenaiEndpointOutputSchemas.moderationCreate,
	},
	'audio.createSpeech': {
		input: OpenaiEndpointInputSchemas.audioCreateSpeech,
		output: OpenaiEndpointOutputSchemas.audioCreateSpeech,
	},
	'audio.createTranscription': {
		input: OpenaiEndpointInputSchemas.audioCreateTranscription,
		output: OpenaiEndpointOutputSchemas.audioCreateTranscription,
	},
	'audio.createTranslation': {
		input: OpenaiEndpointInputSchemas.audioCreateTranslation,
		output: OpenaiEndpointOutputSchemas.audioCreateTranslation,
	},
	'images.create': {
		input: OpenaiEndpointInputSchemas.imagesCreate,
		output: OpenaiEndpointOutputSchemas.imagesCreate,
	},
	'images.createEdit': {
		input: OpenaiEndpointInputSchemas.imagesCreateEdit,
		output: OpenaiEndpointOutputSchemas.imagesCreateEdit,
	},
	'images.createVariation': {
		input: OpenaiEndpointInputSchemas.imagesCreateVariation,
		output: OpenaiEndpointOutputSchemas.imagesCreateVariation,
	},
	'videos.create': {
		input: OpenaiEndpointInputSchemas.videosCreate,
		output: OpenaiEndpointOutputSchemas.videosCreate,
	},
	'videos.list': {
		input: OpenaiEndpointInputSchemas.videosList,
		output: OpenaiEndpointOutputSchemas.videosList,
	},
	'videos.retrieve': {
		input: OpenaiEndpointInputSchemas.videosRetrieve,
		output: OpenaiEndpointOutputSchemas.videosRetrieve,
	},
	'videos.delete': {
		input: OpenaiEndpointInputSchemas.videosDelete,
		output: OpenaiEndpointOutputSchemas.videosDelete,
	},
	'videos.createRemix': {
		input: OpenaiEndpointInputSchemas.videosCreateRemix,
		output: OpenaiEndpointOutputSchemas.videosCreateRemix,
	},
	'videos.download': {
		input: OpenaiEndpointInputSchemas.videosDownload,
		output: OpenaiEndpointOutputSchemas.videosDownload,
	},
	'realtime.createCall': {
		input: OpenaiEndpointInputSchemas.realtimeCreateCall,
		output: OpenaiEndpointOutputSchemas.realtimeCreateCall,
	},
	'realtime.createClientSecret': {
		input: OpenaiEndpointInputSchemas.realtimeCreateClientSecret,
		output: OpenaiEndpointOutputSchemas.realtimeCreateClientSecret,
	},
	'realtime.createSession': {
		input: OpenaiEndpointInputSchemas.realtimeCreateSession,
		output: OpenaiEndpointOutputSchemas.realtimeCreateSession,
	},
	'realtime.createTranscriptionSession': {
		input: OpenaiEndpointInputSchemas.realtimeCreateTranscriptionSession,
		output: OpenaiEndpointOutputSchemas.realtimeCreateTranscriptionSession,
	},
	'chatkit.listThreads': {
		input: OpenaiEndpointInputSchemas.chatkitListThreads,
		output: OpenaiEndpointOutputSchemas.chatkitListThreads,
	},
	'chatkit.getThread': {
		input: OpenaiEndpointInputSchemas.chatkitGetThread,
		output: OpenaiEndpointOutputSchemas.chatkitGetThread,
	},
	'chatkit.listThreadItems': {
		input: OpenaiEndpointInputSchemas.chatkitListThreadItems,
		output: OpenaiEndpointOutputSchemas.chatkitListThreadItems,
	},
	'skills.create': {
		input: OpenaiEndpointInputSchemas.skillsCreate,
		output: OpenaiEndpointOutputSchemas.skillsCreate,
	},
	'skills.list': {
		input: OpenaiEndpointInputSchemas.skillsList,
		output: OpenaiEndpointOutputSchemas.skillsList,
	},
	'skills.delete': {
		input: OpenaiEndpointInputSchemas.skillsDelete,
		output: OpenaiEndpointOutputSchemas.skillsDelete,
	},
	'containers.create': {
		input: OpenaiEndpointInputSchemas.containersCreate,
		output: OpenaiEndpointOutputSchemas.containersCreate,
	},
	'containers.list': {
		input: OpenaiEndpointInputSchemas.containersList,
		output: OpenaiEndpointOutputSchemas.containersList,
	},
	'containers.retrieve': {
		input: OpenaiEndpointInputSchemas.containersRetrieve,
		output: OpenaiEndpointOutputSchemas.containersRetrieve,
	},
	'containers.delete': {
		input: OpenaiEndpointInputSchemas.containersDelete,
		output: OpenaiEndpointOutputSchemas.containersDelete,
	},
	'containerFiles.create': {
		input: OpenaiEndpointInputSchemas.containerFilesCreate,
		output: OpenaiEndpointOutputSchemas.containerFilesCreate,
	},
	'containerFiles.list': {
		input: OpenaiEndpointInputSchemas.containerFilesList,
		output: OpenaiEndpointOutputSchemas.containerFilesList,
	},
	'containerFiles.retrieve': {
		input: OpenaiEndpointInputSchemas.containerFilesRetrieve,
		output: OpenaiEndpointOutputSchemas.containerFilesRetrieve,
	},
	'containerFiles.retrieveContent': {
		input: OpenaiEndpointInputSchemas.containerFilesRetrieveContent,
		output: OpenaiEndpointOutputSchemas.containerFilesRetrieveContent,
	},
	'containerFiles.delete': {
		input: OpenaiEndpointInputSchemas.containerFilesDelete,
		output: OpenaiEndpointOutputSchemas.containerFilesDelete,
	},
	'conversations.create': {
		input: OpenaiEndpointInputSchemas.conversationsCreate,
		output: OpenaiEndpointOutputSchemas.conversationsCreate,
	},
	'conversations.update': {
		input: OpenaiEndpointInputSchemas.conversationsUpdate,
		output: OpenaiEndpointOutputSchemas.conversationsUpdate,
	},
	'conversations.delete': {
		input: OpenaiEndpointInputSchemas.conversationsDelete,
		output: OpenaiEndpointOutputSchemas.conversationsDelete,
	},
	'conversations.createItems': {
		input: OpenaiEndpointInputSchemas.conversationsCreateItems,
		output: OpenaiEndpointOutputSchemas.conversationsCreateItems,
	},
	'conversations.listItems': {
		input: OpenaiEndpointInputSchemas.conversationsListItems,
		output: OpenaiEndpointOutputSchemas.conversationsListItems,
	},
	'conversations.getItem': {
		input: OpenaiEndpointInputSchemas.conversationsGetItem,
		output: OpenaiEndpointOutputSchemas.conversationsGetItem,
	},
	'conversations.deleteItem': {
		input: OpenaiEndpointInputSchemas.conversationsDeleteItem,
		output: OpenaiEndpointOutputSchemas.conversationsDeleteItem,
	},
	'fineTuning.createJob': {
		input: OpenaiEndpointInputSchemas.fineTuningCreateJob,
		output: OpenaiEndpointOutputSchemas.fineTuningCreateJob,
	},
	'fineTuning.listJobs': {
		input: OpenaiEndpointInputSchemas.fineTuningListJobs,
		output: OpenaiEndpointOutputSchemas.fineTuningListJobs,
	},
	'fineTuning.retrieveJob': {
		input: OpenaiEndpointInputSchemas.fineTuningRetrieveJob,
		output: OpenaiEndpointOutputSchemas.fineTuningRetrieveJob,
	},
	'fineTuning.listCheckpoints': {
		input: OpenaiEndpointInputSchemas.fineTuningListCheckpoints,
		output: OpenaiEndpointOutputSchemas.fineTuningListCheckpoints,
	},
	'fineTuning.listEvents': {
		input: OpenaiEndpointInputSchemas.fineTuningListEvents,
		output: OpenaiEndpointOutputSchemas.fineTuningListEvents,
	},
	'fineTuning.cancelJob': {
		input: OpenaiEndpointInputSchemas.fineTuningCancelJob,
		output: OpenaiEndpointOutputSchemas.fineTuningCancelJob,
	},
	'completions.create': {
		input: OpenaiEndpointInputSchemas.completionsCreate,
		output: OpenaiEndpointOutputSchemas.completionsCreate,
	},
	'responses.create': {
		input: OpenaiEndpointInputSchemas.responsesCreate,
		output: OpenaiEndpointOutputSchemas.responsesCreate,
	},
	'responses.retrieve': {
		input: OpenaiEndpointInputSchemas.responsesRetrieve,
		output: OpenaiEndpointOutputSchemas.responsesRetrieve,
	},
	'responses.delete': {
		input: OpenaiEndpointInputSchemas.responsesDelete,
		output: OpenaiEndpointOutputSchemas.responsesDelete,
	},
	'responses.cancel': {
		input: OpenaiEndpointInputSchemas.responsesCancel,
		output: OpenaiEndpointOutputSchemas.responsesCancel,
	},
	'responses.compact': {
		input: OpenaiEndpointInputSchemas.responsesCompact,
		output: OpenaiEndpointOutputSchemas.responsesCompact,
	},
	'responses.listInputItems': {
		input: OpenaiEndpointInputSchemas.responsesListInputItems,
		output: OpenaiEndpointOutputSchemas.responsesListInputItems,
	},
	'chatCompletions.list': {
		input: OpenaiEndpointInputSchemas.chatCompletionsList,
		output: OpenaiEndpointOutputSchemas.chatCompletionsList,
	},
	'chatCompletions.retrieve': {
		input: OpenaiEndpointInputSchemas.chatCompletionsRetrieve,
		output: OpenaiEndpointOutputSchemas.chatCompletionsRetrieve,
	},
	'chatCompletions.update': {
		input: OpenaiEndpointInputSchemas.chatCompletionsUpdate,
		output: OpenaiEndpointOutputSchemas.chatCompletionsUpdate,
	},
	'chatCompletions.delete': {
		input: OpenaiEndpointInputSchemas.chatCompletionsDelete,
		output: OpenaiEndpointOutputSchemas.chatCompletionsDelete,
	},
	'chatCompletions.listMessages': {
		input: OpenaiEndpointInputSchemas.chatCompletionsListMessages,
		output: OpenaiEndpointOutputSchemas.chatCompletionsListMessages,
	},
	'tokens.countInput': {
		input: OpenaiEndpointInputSchemas.tokensCountInput,
		output: OpenaiEndpointOutputSchemas.tokensCountInput,
	},
	'evals.create': {
		input: OpenaiEndpointInputSchemas.evalsCreate,
		output: OpenaiEndpointOutputSchemas.evalsCreate,
	},
	'evals.list': {
		input: OpenaiEndpointInputSchemas.evalsList,
		output: OpenaiEndpointOutputSchemas.evalsList,
	},
	'evals.get': {
		input: OpenaiEndpointInputSchemas.evalsGet,
		output: OpenaiEndpointOutputSchemas.evalsGet,
	},
	'evals.update': {
		input: OpenaiEndpointInputSchemas.evalsUpdate,
		output: OpenaiEndpointOutputSchemas.evalsUpdate,
	},
	'evals.delete': {
		input: OpenaiEndpointInputSchemas.evalsDelete,
		output: OpenaiEndpointOutputSchemas.evalsDelete,
	},
	'evalRuns.create': {
		input: OpenaiEndpointInputSchemas.evalRunsCreate,
		output: OpenaiEndpointOutputSchemas.evalRunsCreate,
	},
	'evalRuns.get': {
		input: OpenaiEndpointInputSchemas.evalRunsGet,
		output: OpenaiEndpointOutputSchemas.evalRunsGet,
	},
	'evalRuns.list': {
		input: OpenaiEndpointInputSchemas.evalRunsList,
		output: OpenaiEndpointOutputSchemas.evalRunsList,
	},
	'evalRuns.cancel': {
		input: OpenaiEndpointInputSchemas.evalRunsCancel,
		output: OpenaiEndpointOutputSchemas.evalRunsCancel,
	},
	'evalRuns.delete': {
		input: OpenaiEndpointInputSchemas.evalRunsDelete,
		output: OpenaiEndpointOutputSchemas.evalRunsDelete,
	},
	'evalRuns.getOutputItem': {
		input: OpenaiEndpointInputSchemas.evalRunsGetOutputItem,
		output: OpenaiEndpointOutputSchemas.evalRunsGetOutputItem,
	},
	'evalRuns.listOutputItems': {
		input: OpenaiEndpointInputSchemas.evalRunsListOutputItems,
		output: OpenaiEndpointOutputSchemas.evalRunsListOutputItems,
	},
	'graders.run': {
		input: OpenaiEndpointInputSchemas.gradersRun,
		output: OpenaiEndpointOutputSchemas.gradersRun,
	},
	'graders.validate': {
		input: OpenaiEndpointInputSchemas.gradersValidate,
		output: OpenaiEndpointOutputSchemas.gradersValidate,
	},
	'batches.create': {
		input: OpenaiEndpointInputSchemas.batchesCreate,
		output: OpenaiEndpointOutputSchemas.batchesCreate,
	},
	'batches.retrieve': {
		input: OpenaiEndpointInputSchemas.batchesRetrieve,
		output: OpenaiEndpointOutputSchemas.batchesRetrieve,
	},
	'batches.cancel': {
		input: OpenaiEndpointInputSchemas.batchesCancel,
		output: OpenaiEndpointOutputSchemas.batchesCancel,
	},
	'batches.list': {
		input: OpenaiEndpointInputSchemas.batchesList,
		output: OpenaiEndpointOutputSchemas.batchesList,
	},
	'uploads.create': {
		input: OpenaiEndpointInputSchemas.uploadsCreate,
		output: OpenaiEndpointOutputSchemas.uploadsCreate,
	},
	'uploads.addPart': {
		input: OpenaiEndpointInputSchemas.uploadsAddPart,
		output: OpenaiEndpointOutputSchemas.uploadsAddPart,
	},
	'uploads.complete': {
		input: OpenaiEndpointInputSchemas.uploadsComplete,
		output: OpenaiEndpointOutputSchemas.uploadsComplete,
	},
	'uploads.cancel': {
		input: OpenaiEndpointInputSchemas.uploadsCancel,
		output: OpenaiEndpointOutputSchemas.uploadsCancel,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof openaiEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const openaiEndpointMeta = {
	'models.list': { riskLevel: 'read', description: 'List available models' },
	'models.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a model by id',
	},
	'engines.list': {
		riskLevel: 'read',
		description: 'List available engines (legacy, deprecated)',
	},
	'engines.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve an engine by id (legacy, deprecated)',
	},
	'chat.createCompletion': {
		riskLevel: 'write',
		description: 'Create a chat completion for the given messages',
	},
	'embeddings.create': {
		riskLevel: 'write',
		description: 'Create embeddings for the given input',
	},
	'files.upload': {
		riskLevel: 'write',
		description: 'Upload a file to OpenAI',
	},
	'files.list': { riskLevel: 'read', description: 'List uploaded files' },
	'files.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve file metadata',
	},
	'files.delete': { riskLevel: 'destructive', description: 'Delete a file' },
	'files.downloadContent': {
		riskLevel: 'read',
		description: 'Download the contents of a file',
	},
	'assistants.create': {
		riskLevel: 'write',
		description: 'Create an assistant',
	},
	'assistants.list': { riskLevel: 'read', description: 'List assistants' },
	'assistants.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve an assistant by id',
	},
	'assistants.modify': {
		riskLevel: 'write',
		description: 'Modify an assistant',
	},
	'assistants.delete': {
		riskLevel: 'destructive',
		description: 'Delete an assistant',
	},
	'threads.create': { riskLevel: 'write', description: 'Create a thread' },
	'threads.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a thread by id',
	},
	'threads.modify': { riskLevel: 'write', description: 'Modify a thread' },
	'threads.delete': {
		riskLevel: 'destructive',
		description: 'Delete a thread',
	},
	'threads.createAndRun': {
		riskLevel: 'write',
		description: 'Create a thread and run it in one call',
	},
	'messages.create': {
		riskLevel: 'write',
		description: 'Create a message on a thread',
	},
	'messages.list': {
		riskLevel: 'read',
		description: 'List messages on a thread',
	},
	'messages.retrieve': { riskLevel: 'read', description: 'Retrieve a message' },
	'messages.modify': { riskLevel: 'write', description: 'Modify a message' },
	'messages.delete': {
		riskLevel: 'destructive',
		description: 'Delete a message',
	},
	'runs.create': {
		riskLevel: 'write',
		description: 'Create a run on a thread',
	},
	'runs.list': { riskLevel: 'read', description: 'List runs on a thread' },
	'runs.retrieve': { riskLevel: 'read', description: 'Retrieve a run' },
	'runs.modify': { riskLevel: 'write', description: 'Modify a run' },
	'runs.cancel': {
		riskLevel: 'destructive',
		description: 'Cancel an in-progress run',
	},
	'runs.submitToolOutputs': {
		riskLevel: 'write',
		description: 'Submit tool outputs to a run awaiting action',
	},
	'runSteps.list': { riskLevel: 'read', description: 'List steps of a run' },
	'runSteps.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a run step',
	},
	'vectorStores.create': {
		riskLevel: 'write',
		description: 'Create a vector store',
	},
	'vectorStores.list': { riskLevel: 'read', description: 'List vector stores' },
	'vectorStores.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a vector store',
	},
	'vectorStores.modify': {
		riskLevel: 'write',
		description: 'Modify a vector store',
	},
	'vectorStores.delete': {
		riskLevel: 'destructive',
		description: 'Delete a vector store',
	},
	'vectorStores.search': {
		riskLevel: 'read',
		description: 'Search a vector store for relevant chunks',
	},
	'vectorStoreFiles.create': {
		riskLevel: 'write',
		description: 'Attach a file to a vector store',
	},
	'vectorStoreFiles.list': {
		riskLevel: 'read',
		description: 'List files attached to a vector store',
	},
	'vectorStoreFiles.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a vector store file',
	},
	'vectorStoreFiles.delete': {
		riskLevel: 'destructive',
		description: 'Detach a file from a vector store',
	},
	'vectorStoreFiles.updateAttributes': {
		riskLevel: 'write',
		description: 'Update attributes on a vector store file',
	},
	'vectorStoreFiles.retrieveContent': {
		riskLevel: 'read',
		description: 'Retrieve the parsed content of a vector store file',
	},
	'vectorStoreFileBatches.create': {
		riskLevel: 'write',
		description: 'Attach a batch of files to a vector store',
	},
	'vectorStoreFileBatches.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a vector store file batch',
	},
	'vectorStoreFileBatches.listFiles': {
		riskLevel: 'read',
		description: 'List files in a vector store file batch',
	},
	'moderation.create': {
		riskLevel: 'read',
		description: 'Classify text/image input against usage policies',
	},
	'audio.createSpeech': {
		riskLevel: 'write',
		description: 'Generate spoken audio from text',
	},
	'audio.createTranscription': {
		riskLevel: 'write',
		description: 'Transcribe audio into text',
	},
	'audio.createTranslation': {
		riskLevel: 'write',
		description: 'Translate audio into English text',
	},
	'images.create': {
		riskLevel: 'write',
		description: 'Generate images from a prompt',
	},
	'images.createEdit': {
		riskLevel: 'write',
		description: 'Edit an image given a prompt and mask',
	},
	'images.createVariation': {
		riskLevel: 'write',
		description: 'Create variations of an image',
	},
	'videos.create': {
		riskLevel: 'write',
		description: 'Generate a video from a prompt',
	},
	'videos.list': { riskLevel: 'read', description: 'List generated videos' },
	'videos.retrieve': { riskLevel: 'read', description: 'Retrieve a video' },
	'videos.delete': {
		riskLevel: 'destructive',
		description: 'Delete a video',
	},
	'videos.createRemix': {
		riskLevel: 'write',
		description: 'Create a remix of an existing video',
	},
	'videos.download': {
		riskLevel: 'read',
		description: 'Download the rendered content of a video',
	},
	'realtime.createCall': {
		riskLevel: 'write',
		description: 'Create a realtime call',
	},
	'realtime.createClientSecret': {
		riskLevel: 'write',
		description: 'Create an ephemeral client secret for the Realtime API',
	},
	'realtime.createSession': {
		riskLevel: 'write',
		description: 'Create a realtime session',
	},
	'realtime.createTranscriptionSession': {
		riskLevel: 'write',
		description: 'Create a realtime transcription session',
	},
	'chatkit.listThreads': {
		riskLevel: 'read',
		description: 'List ChatKit threads',
	},
	'chatkit.getThread': {
		riskLevel: 'read',
		description: 'Retrieve a ChatKit thread',
	},
	'chatkit.listThreadItems': {
		riskLevel: 'read',
		description: 'List items in a ChatKit thread',
	},
	'skills.create': {
		riskLevel: 'write',
		description: 'Upload a skill',
	},
	'skills.list': { riskLevel: 'read', description: 'List skills' },
	'skills.delete': {
		riskLevel: 'destructive',
		description: 'Delete a skill',
	},
	'containers.create': {
		riskLevel: 'write',
		description: 'Create a code interpreter container',
	},
	'containers.list': { riskLevel: 'read', description: 'List containers' },
	'containers.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a container',
	},
	'containers.delete': {
		riskLevel: 'destructive',
		description: 'Delete a container',
	},
	'containerFiles.create': {
		riskLevel: 'write',
		description: 'Add a file to a container',
	},
	'containerFiles.list': {
		riskLevel: 'read',
		description: 'List files in a container',
	},
	'containerFiles.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a container file',
	},
	'containerFiles.retrieveContent': {
		riskLevel: 'read',
		description: 'Download the contents of a container file',
	},
	'containerFiles.delete': {
		riskLevel: 'destructive',
		description: 'Delete a container file',
	},
	'conversations.create': {
		riskLevel: 'write',
		description: 'Create a conversation',
	},
	'conversations.update': {
		riskLevel: 'write',
		description: "Update a conversation's metadata",
	},
	'conversations.delete': {
		riskLevel: 'destructive',
		description: 'Delete a conversation',
	},
	'conversations.createItems': {
		riskLevel: 'write',
		description: 'Add items to a conversation',
	},
	'conversations.listItems': {
		riskLevel: 'read',
		description: 'List items in a conversation',
	},
	'conversations.getItem': {
		riskLevel: 'read',
		description: 'Retrieve a conversation item',
	},
	'conversations.deleteItem': {
		riskLevel: 'destructive',
		description: 'Delete a conversation item',
	},
	'fineTuning.createJob': {
		riskLevel: 'write',
		description: 'Create a fine-tuning job',
	},
	'fineTuning.listJobs': {
		riskLevel: 'read',
		description: 'List fine-tuning jobs',
	},
	'fineTuning.retrieveJob': {
		riskLevel: 'read',
		description: 'Retrieve a fine-tuning job',
	},
	'fineTuning.listCheckpoints': {
		riskLevel: 'read',
		description: 'List checkpoints for a fine-tuning job',
	},
	'fineTuning.listEvents': {
		riskLevel: 'read',
		description: 'List events for a fine-tuning job',
	},
	'fineTuning.cancelJob': {
		riskLevel: 'destructive',
		description: 'Cancel an in-progress fine-tuning job',
	},
	'completions.create': {
		riskLevel: 'write',
		description: 'Create a legacy text completion',
	},
	'responses.create': {
		riskLevel: 'write',
		description: 'Create a model response via the Responses API',
	},
	'responses.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a model response',
	},
	'responses.delete': {
		riskLevel: 'destructive',
		description: 'Delete a stored model response',
	},
	'responses.cancel': {
		riskLevel: 'destructive',
		description: 'Cancel an in-progress background response',
	},
	'responses.compact': {
		riskLevel: 'write',
		description: 'Compact response input to reduce token usage',
	},
	'responses.listInputItems': {
		riskLevel: 'read',
		description: 'List input items for a response',
	},
	'chatCompletions.list': {
		riskLevel: 'read',
		description: 'List stored chat completions',
	},
	'chatCompletions.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a stored chat completion',
	},
	'chatCompletions.update': {
		riskLevel: 'write',
		description: "Update a stored chat completion's metadata",
	},
	'chatCompletions.delete': {
		riskLevel: 'destructive',
		description: 'Delete a stored chat completion',
	},
	'chatCompletions.listMessages': {
		riskLevel: 'read',
		description: 'List messages of a stored chat completion',
	},
	'tokens.countInput': {
		riskLevel: 'read',
		description: 'Count input tokens for a prospective request',
	},
	'evals.create': { riskLevel: 'write', description: 'Create an eval' },
	'evals.list': { riskLevel: 'read', description: 'List evals' },
	'evals.get': { riskLevel: 'read', description: 'Retrieve an eval' },
	'evals.update': { riskLevel: 'write', description: 'Update an eval' },
	'evals.delete': { riskLevel: 'destructive', description: 'Delete an eval' },
	'evalRuns.create': {
		riskLevel: 'write',
		description: 'Create an eval run',
	},
	'evalRuns.get': { riskLevel: 'read', description: 'Retrieve an eval run' },
	'evalRuns.list': { riskLevel: 'read', description: 'List eval runs' },
	'evalRuns.cancel': {
		riskLevel: 'destructive',
		description: 'Cancel an in-progress eval run',
	},
	'evalRuns.delete': {
		riskLevel: 'destructive',
		description: 'Delete an eval run',
	},
	'evalRuns.getOutputItem': {
		riskLevel: 'read',
		description: 'Retrieve an eval run output item',
	},
	'evalRuns.listOutputItems': {
		riskLevel: 'read',
		description: 'List output items for an eval run',
	},
	'graders.run': {
		riskLevel: 'read',
		description: 'Run a grader against a model sample',
	},
	'graders.validate': {
		riskLevel: 'read',
		description: 'Validate a grader configuration',
	},
	'batches.create': {
		riskLevel: 'write',
		description: 'Create a batch job',
	},
	'batches.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a batch job',
	},
	'batches.cancel': {
		riskLevel: 'destructive',
		description: 'Cancel an in-progress batch job',
	},
	'batches.list': { riskLevel: 'read', description: 'List batch jobs' },
	'uploads.create': {
		riskLevel: 'write',
		description: 'Create a multipart upload session',
	},
	'uploads.addPart': {
		riskLevel: 'write',
		description: 'Add a part of file data to an upload',
	},
	'uploads.complete': {
		riskLevel: 'write',
		description: 'Complete a multipart upload session',
	},
	'uploads.cancel': {
		riskLevel: 'destructive',
		description: 'Cancel an in-progress upload session',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof openaiEndpointsNested>;

export const openaiAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseOpenaiPlugin<T extends OpenaiPluginOptions> = CorsairPlugin<
	'openai',
	typeof OpenaiSchema,
	typeof openaiEndpointsNested,
	typeof openaiWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalOpenaiPlugin = BaseOpenaiPlugin<OpenaiPluginOptions>;

export type ExternalOpenaiPlugin<T extends OpenaiPluginOptions> =
	BaseOpenaiPlugin<T>;

export function openai<const T extends OpenaiPluginOptions>(
	incomingOptions: OpenaiPluginOptions & T = {} as OpenaiPluginOptions & T,
): ExternalOpenaiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'openai',
		authConfig: openaiAuthConfig,
		schema: OpenaiSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: openaiEndpointsNested,
		webhooks: openaiWebhooksNested,
		endpointMeta: openaiEndpointMeta,
		endpointSchemas: openaiEndpointSchemas,
		// No webhooks — OpenAI's REST API is pull-based
		pluginWebhookMatcher: undefined,
		// DEFAULT matches everything (`() => true`), so it must always evaluate last
		errorHandlers: (() => {
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
		keyBuilder: async (ctx: OpenaiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('openai', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('openai', 'api_key');
		},
	} satisfies InternalOpenaiPlugin;
}

export type {
	OpenaiEndpointInputs,
	OpenaiEndpointOutputs,
} from './endpoints/types';
