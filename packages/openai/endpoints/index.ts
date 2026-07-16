import * as Assistants from './assistants';
import * as Audio from './audio';
import * as Batches from './batches';
import * as Chat from './chat';
import * as ChatExtensions from './chat-extensions';
import * as Chatkit from './chatkit';
import * as Containers from './containers';
import * as Conversations from './conversations';
import * as Embeddings from './embeddings';
import * as Evals from './evals';
import * as Files from './files';
import * as FineTuning from './fine-tuning';
import * as Images from './images';
import * as Models from './models';
import * as Moderation from './moderation';
import * as Realtime from './realtime';
import * as Skills from './skills';
import * as Uploads from './uploads';
import * as VectorStores from './vector-stores';
import * as Videos from './videos';

export const ModelsEndpoints = {
	list: Models.list,
	retrieve: Models.retrieve,
};

export const EnginesEndpoints = {
	list: Models.listEngines,
	retrieve: Models.retrieveEngine,
};

export const ChatEndpoints = {
	createCompletion: Chat.createCompletion,
};

export const EmbeddingsEndpoints = {
	create: Embeddings.create,
};

export const FilesEndpoints = {
	upload: Files.upload,
	list: Files.list,
	retrieve: Files.retrieve,
	delete: Files.deleteFile,
	downloadContent: Files.downloadContent,
};

export const AssistantsEndpoints = {
	create: Assistants.create,
	list: Assistants.list,
	retrieve: Assistants.retrieve,
	modify: Assistants.modify,
	delete: Assistants.deleteAssistant,
};

export const ThreadsEndpoints = {
	create: Assistants.createThread,
	retrieve: Assistants.retrieveThread,
	modify: Assistants.modifyThread,
	delete: Assistants.deleteThread,
	createAndRun: Assistants.createThreadAndRun,
};

export const MessagesEndpoints = {
	create: Assistants.createMessage,
	list: Assistants.listMessages,
	retrieve: Assistants.retrieveMessage,
	modify: Assistants.modifyMessage,
	delete: Assistants.deleteMessage,
};

export const RunsEndpoints = {
	create: Assistants.createRun,
	list: Assistants.listRuns,
	retrieve: Assistants.retrieveRun,
	modify: Assistants.modifyRun,
	cancel: Assistants.cancelRun,
	submitToolOutputs: Assistants.submitToolOutputs,
};

export const RunStepsEndpoints = {
	list: Assistants.listRunSteps,
	retrieve: Assistants.retrieveRunStep,
};

export const VectorStoresEndpoints = {
	create: VectorStores.create,
	list: VectorStores.list,
	retrieve: VectorStores.retrieve,
	modify: VectorStores.modify,
	delete: VectorStores.deleteVectorStore,
	search: VectorStores.search,
};

export const VectorStoreFilesEndpoints = {
	create: VectorStores.createFile,
	list: VectorStores.listFiles,
	retrieve: VectorStores.retrieveFile,
	delete: VectorStores.deleteFile,
	updateAttributes: VectorStores.updateFileAttributes,
	retrieveContent: VectorStores.retrieveFileContent,
};

export const VectorStoreFileBatchesEndpoints = {
	create: VectorStores.createFileBatch,
	retrieve: VectorStores.retrieveFileBatch,
	listFiles: VectorStores.listFileBatchFiles,
};

export const ModerationEndpoints = {
	create: Moderation.create,
};

export const AudioEndpoints = {
	createSpeech: Audio.createSpeech,
	createTranscription: Audio.createTranscription,
	createTranslation: Audio.createTranslation,
};

export const ImagesEndpoints = {
	create: Images.create,
	createEdit: Images.createEdit,
	createVariation: Images.createVariation,
};

export const VideosEndpoints = {
	create: Videos.create,
	list: Videos.list,
	retrieve: Videos.retrieve,
	delete: Videos.deleteVideo,
	createRemix: Videos.createRemix,
	download: Videos.download,
};

export const RealtimeEndpoints = {
	createCall: Realtime.createCall,
	createClientSecret: Realtime.createClientSecret,
	createSession: Realtime.createSession,
	createTranscriptionSession: Realtime.createTranscriptionSession,
};

export const ChatkitEndpoints = {
	listThreads: Chatkit.listThreads,
	getThread: Chatkit.getThread,
	listThreadItems: Chatkit.listThreadItems,
};

export const SkillsEndpoints = {
	create: Skills.create,
	list: Skills.list,
	delete: Skills.deleteSkill,
};

export const ContainersEndpoints = {
	create: Containers.create,
	list: Containers.list,
	retrieve: Containers.retrieve,
	delete: Containers.deleteContainer,
};

export const ContainerFilesEndpoints = {
	create: Containers.createFile,
	list: Containers.listFiles,
	retrieve: Containers.retrieveFile,
	retrieveContent: Containers.retrieveFileContent,
	delete: Containers.deleteFile,
};

export const ConversationsEndpoints = {
	create: Conversations.create,
	update: Conversations.update,
	delete: Conversations.deleteConversation,
	createItems: Conversations.createItems,
	listItems: Conversations.listItems,
	getItem: Conversations.getItem,
	deleteItem: Conversations.deleteItem,
};

export const FineTuningEndpoints = {
	createJob: FineTuning.createJob,
	listJobs: FineTuning.listJobs,
	retrieveJob: FineTuning.retrieveJob,
	listCheckpoints: FineTuning.listCheckpoints,
	listEvents: FineTuning.listEvents,
	cancelJob: FineTuning.cancelJob,
};

export const CompletionsEndpoints = {
	create: ChatExtensions.createCompletion,
};

export const ResponsesEndpoints = {
	create: ChatExtensions.createResponse,
	retrieve: ChatExtensions.retrieveResponse,
	delete: ChatExtensions.deleteResponse,
	cancel: ChatExtensions.cancelResponse,
	compact: ChatExtensions.compactResponse,
	listInputItems: ChatExtensions.listResponseInputItems,
};

export const ChatCompletionsEndpoints = {
	list: ChatExtensions.listChatCompletions,
	retrieve: ChatExtensions.retrieveChatCompletion,
	update: ChatExtensions.updateChatCompletion,
	delete: ChatExtensions.deleteChatCompletion,
	listMessages: ChatExtensions.listChatCompletionMessages,
};

export const TokensEndpoints = {
	countInput: ChatExtensions.countInputTokens,
};

export const EvalsEndpoints = {
	create: Evals.create,
	list: Evals.list,
	get: Evals.get,
	update: Evals.update,
	delete: Evals.deleteEval,
};

export const EvalRunsEndpoints = {
	create: Evals.createRun,
	get: Evals.getRun,
	list: Evals.listRuns,
	cancel: Evals.cancelRun,
	delete: Evals.deleteRun,
	getOutputItem: Evals.getRunOutputItem,
	listOutputItems: Evals.listRunOutputItems,
};

export const GradersEndpoints = {
	run: Evals.runGrader,
	validate: Evals.validateGrader,
};

export const BatchesEndpoints = {
	create: Batches.create,
	retrieve: Batches.retrieve,
	cancel: Batches.cancel,
	list: Batches.list,
};

export const UploadsEndpoints = {
	create: Uploads.create,
	addPart: Uploads.addPart,
	complete: Uploads.complete,
	cancel: Uploads.cancel,
};

export * from './types';
