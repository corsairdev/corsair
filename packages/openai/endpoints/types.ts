import * as Assistants from '../schema/assistants';
import * as Audio from '../schema/audio';
import * as Batches from '../schema/batches';
import * as Chat from '../schema/chat';
import * as ChatExtensions from '../schema/chat-extensions';
import * as Chatkit from '../schema/chatkit';
import * as Containers from '../schema/containers';
import * as Conversations from '../schema/conversations';
import * as Embeddings from '../schema/embeddings';
import * as Evals from '../schema/evals';
import * as Files from '../schema/files';
import * as FineTuning from '../schema/fine-tuning';
import * as Images from '../schema/images';
import * as Models from '../schema/models';
import * as Moderation from '../schema/moderation';
import * as Realtime from '../schema/realtime';
import * as Skills from '../schema/skills';
import * as Uploads from '../schema/uploads';
import * as VectorStores from '../schema/vector-stores';
import * as Videos from '../schema/videos';

export type OpenaiEndpointInputs = {
	modelsList: Models.ModelsListInput;
	modelsRetrieve: Models.ModelsRetrieveInput;
	enginesList: Models.EnginesListInput;
	enginesRetrieve: Models.EnginesRetrieveInput;

	chatCreateCompletion: Chat.ChatCreateCompletionInput;

	embeddingsCreate: Embeddings.EmbeddingsCreateInput;

	filesUpload: Files.FilesUploadInput;
	filesList: Files.FilesListInput;
	filesRetrieve: Files.FilesRetrieveInput;
	filesDelete: Files.FilesDeleteInput;
	filesDownloadContent: Files.FilesDownloadContentInput;

	assistantsCreate: Assistants.AssistantsCreateInput;
	assistantsList: Assistants.AssistantsListInput;
	assistantsRetrieve: Assistants.AssistantsRetrieveInput;
	assistantsModify: Assistants.AssistantsModifyInput;
	assistantsDelete: Assistants.AssistantsDeleteInput;

	threadsCreate: Assistants.ThreadsCreateInput;
	threadsRetrieve: Assistants.ThreadsRetrieveInput;
	threadsModify: Assistants.ThreadsModifyInput;
	threadsDelete: Assistants.ThreadsDeleteInput;
	threadsCreateAndRun: Assistants.ThreadsCreateAndRunInput;

	messagesCreate: Assistants.MessagesCreateInput;
	messagesList: Assistants.MessagesListInput;
	messagesRetrieve: Assistants.MessagesRetrieveInput;
	messagesModify: Assistants.MessagesModifyInput;
	messagesDelete: Assistants.MessagesDeleteInput;

	runsCreate: Assistants.RunsCreateInput;
	runsList: Assistants.RunsListInput;
	runsRetrieve: Assistants.RunsRetrieveInput;
	runsModify: Assistants.RunsModifyInput;
	runsCancel: Assistants.RunsCancelInput;
	runsSubmitToolOutputs: Assistants.RunsSubmitToolOutputsInput;

	runStepsList: Assistants.RunStepsListInput;
	runStepsRetrieve: Assistants.RunStepsRetrieveInput;

	vectorStoresCreate: VectorStores.VectorStoresCreateInput;
	vectorStoresList: VectorStores.VectorStoresListInput;
	vectorStoresRetrieve: VectorStores.VectorStoresRetrieveInput;
	vectorStoresModify: VectorStores.VectorStoresModifyInput;
	vectorStoresDelete: VectorStores.VectorStoresDeleteInput;
	vectorStoresSearch: VectorStores.VectorStoresSearchInput;

	vectorStoreFilesCreate: VectorStores.VectorStoreFilesCreateInput;
	vectorStoreFilesList: VectorStores.VectorStoreFilesListInput;
	vectorStoreFilesRetrieve: VectorStores.VectorStoreFilesRetrieveInput;
	vectorStoreFilesDelete: VectorStores.VectorStoreFilesDeleteInput;
	vectorStoreFilesUpdateAttributes: VectorStores.VectorStoreFilesUpdateAttributesInput;
	vectorStoreFilesRetrieveContent: VectorStores.VectorStoreFilesRetrieveContentInput;

	vectorStoreFileBatchesCreate: VectorStores.VectorStoreFileBatchesCreateInput;
	vectorStoreFileBatchesRetrieve: VectorStores.VectorStoreFileBatchesRetrieveInput;
	vectorStoreFileBatchesListFiles: VectorStores.VectorStoreFileBatchesListFilesInput;

	moderationCreate: Moderation.ModerationCreateInput;

	audioCreateSpeech: Audio.AudioCreateSpeechInput;
	audioCreateTranscription: Audio.AudioCreateTranscriptionInput;
	audioCreateTranslation: Audio.AudioCreateTranslationInput;

	imagesCreate: Images.ImagesCreateInput;
	imagesCreateEdit: Images.ImagesCreateEditInput;
	imagesCreateVariation: Images.ImagesCreateVariationInput;

	videosCreate: Videos.VideosCreateInput;
	videosList: Videos.VideosListInput;
	videosRetrieve: Videos.VideosRetrieveInput;
	videosDelete: Videos.VideosDeleteInput;
	videosCreateRemix: Videos.VideosCreateRemixInput;
	videosDownload: Videos.VideosDownloadInput;

	realtimeCreateCall: Realtime.RealtimeCreateCallInput;
	realtimeCreateClientSecret: Realtime.RealtimeCreateClientSecretInput;
	realtimeCreateSession: Realtime.RealtimeCreateSessionInput;
	realtimeCreateTranscriptionSession: Realtime.RealtimeCreateTranscriptionSessionInput;

	chatkitListThreads: Chatkit.ChatkitListThreadsInput;
	chatkitGetThread: Chatkit.ChatkitGetThreadInput;
	chatkitListThreadItems: Chatkit.ChatkitListThreadItemsInput;

	skillsCreate: Skills.SkillsCreateInput;
	skillsList: Skills.SkillsListInput;
	skillsDelete: Skills.SkillsDeleteInput;

	containersCreate: Containers.ContainersCreateInput;
	containersList: Containers.ContainersListInput;
	containersRetrieve: Containers.ContainersRetrieveInput;
	containersDelete: Containers.ContainersDeleteInput;
	containerFilesCreate: Containers.ContainerFilesCreateInput;
	containerFilesList: Containers.ContainerFilesListInput;
	containerFilesRetrieve: Containers.ContainerFilesRetrieveInput;
	containerFilesRetrieveContent: Containers.ContainerFilesRetrieveContentInput;
	containerFilesDelete: Containers.ContainerFilesDeleteInput;

	conversationsCreate: Conversations.ConversationsCreateInput;
	conversationsUpdate: Conversations.ConversationsUpdateInput;
	conversationsDelete: Conversations.ConversationsDeleteInput;
	conversationsCreateItems: Conversations.ConversationsCreateItemsInput;
	conversationsListItems: Conversations.ConversationsListItemsInput;
	conversationsGetItem: Conversations.ConversationsGetItemInput;
	conversationsDeleteItem: Conversations.ConversationsDeleteItemInput;

	fineTuningCreateJob: FineTuning.FineTuningCreateJobInput;
	fineTuningListJobs: FineTuning.FineTuningListJobsInput;
	fineTuningRetrieveJob: FineTuning.FineTuningRetrieveJobInput;
	fineTuningListCheckpoints: FineTuning.FineTuningListCheckpointsInput;
	fineTuningListEvents: FineTuning.FineTuningListEventsInput;
	fineTuningCancelJob: FineTuning.FineTuningCancelJobInput;

	completionsCreate: ChatExtensions.CompletionsCreateInput;
	responsesCreate: ChatExtensions.ResponsesCreateInput;
	responsesRetrieve: ChatExtensions.ResponsesRetrieveInput;
	responsesDelete: ChatExtensions.ResponsesDeleteInput;
	responsesCancel: ChatExtensions.ResponsesCancelInput;
	responsesCompact: ChatExtensions.ResponsesCompactInput;
	responsesListInputItems: ChatExtensions.ResponsesListInputItemsInput;
	chatCompletionsList: ChatExtensions.ChatCompletionsListInput;
	chatCompletionsRetrieve: ChatExtensions.ChatCompletionsRetrieveInput;
	chatCompletionsUpdate: ChatExtensions.ChatCompletionsUpdateInput;
	chatCompletionsDelete: ChatExtensions.ChatCompletionsDeleteInput;
	chatCompletionsListMessages: ChatExtensions.ChatCompletionsListMessagesInput;
	tokensCountInput: ChatExtensions.TokensCountInputInput;

	evalsCreate: Evals.EvalsCreateInput;
	evalsList: Evals.EvalsListInput;
	evalsGet: Evals.EvalsGetInput;
	evalsUpdate: Evals.EvalsUpdateInput;
	evalsDelete: Evals.EvalsDeleteInput;
	evalRunsCreate: Evals.EvalRunsCreateInput;
	evalRunsGet: Evals.EvalRunsGetInput;
	evalRunsList: Evals.EvalRunsListInput;
	evalRunsCancel: Evals.EvalRunsCancelInput;
	evalRunsDelete: Evals.EvalRunsDeleteInput;
	evalRunsGetOutputItem: Evals.EvalRunsGetOutputItemInput;
	evalRunsListOutputItems: Evals.EvalRunsListOutputItemsInput;
	gradersRun: Evals.GradersRunInput;
	gradersValidate: Evals.GradersValidateInput;

	batchesCreate: Batches.BatchesCreateInput;
	batchesRetrieve: Batches.BatchesRetrieveInput;
	batchesCancel: Batches.BatchesCancelInput;
	batchesList: Batches.BatchesListInput;

	uploadsCreate: Uploads.UploadsCreateInput;
	uploadsAddPart: Uploads.UploadsAddPartInput;
	uploadsComplete: Uploads.UploadsCompleteInput;
	uploadsCancel: Uploads.UploadsCancelInput;
};

export type OpenaiEndpointOutputs = {
	modelsList: Models.ModelsListResponse;
	modelsRetrieve: Models.ModelsRetrieveResponse;
	enginesList: Models.EnginesListResponse;
	enginesRetrieve: Models.EnginesRetrieveResponse;

	chatCreateCompletion: Chat.ChatCreateCompletionResponse;

	embeddingsCreate: Embeddings.EmbeddingsCreateResponse;

	filesUpload: Files.FilesUploadResponse;
	filesList: Files.FilesListResponse;
	filesRetrieve: Files.FilesRetrieveResponse;
	filesDelete: Files.FilesDeleteResponse;
	filesDownloadContent: Files.FilesDownloadContentResponse;

	assistantsCreate: Assistants.AssistantsCreateResponse;
	assistantsList: Assistants.AssistantsListResponse;
	assistantsRetrieve: Assistants.AssistantsRetrieveResponse;
	assistantsModify: Assistants.AssistantsModifyResponse;
	assistantsDelete: Assistants.AssistantsDeleteResponse;

	threadsCreate: Assistants.ThreadsCreateResponse;
	threadsRetrieve: Assistants.ThreadsRetrieveResponse;
	threadsModify: Assistants.ThreadsModifyResponse;
	threadsDelete: Assistants.ThreadsDeleteResponse;
	threadsCreateAndRun: Assistants.ThreadsCreateAndRunResponse;

	messagesCreate: Assistants.MessagesCreateResponse;
	messagesList: Assistants.MessagesListResponse;
	messagesRetrieve: Assistants.MessagesRetrieveResponse;
	messagesModify: Assistants.MessagesModifyResponse;
	messagesDelete: Assistants.MessagesDeleteResponse;

	runsCreate: Assistants.RunsCreateResponse;
	runsList: Assistants.RunsListResponse;
	runsRetrieve: Assistants.RunsRetrieveResponse;
	runsModify: Assistants.RunsModifyResponse;
	runsCancel: Assistants.RunsCancelResponse;
	runsSubmitToolOutputs: Assistants.RunsSubmitToolOutputsResponse;

	runStepsList: Assistants.RunStepsListResponse;
	runStepsRetrieve: Assistants.RunStepsRetrieveResponse;

	vectorStoresCreate: VectorStores.VectorStoresCreateResponse;
	vectorStoresList: VectorStores.VectorStoresListResponse;
	vectorStoresRetrieve: VectorStores.VectorStoresRetrieveResponse;
	vectorStoresModify: VectorStores.VectorStoresModifyResponse;
	vectorStoresDelete: VectorStores.VectorStoresDeleteResponse;
	vectorStoresSearch: VectorStores.VectorStoresSearchResponse;

	vectorStoreFilesCreate: VectorStores.VectorStoreFilesCreateResponse;
	vectorStoreFilesList: VectorStores.VectorStoreFilesListResponse;
	vectorStoreFilesRetrieve: VectorStores.VectorStoreFilesRetrieveResponse;
	vectorStoreFilesDelete: VectorStores.VectorStoreFilesDeleteResponse;
	vectorStoreFilesUpdateAttributes: VectorStores.VectorStoreFilesUpdateAttributesResponse;
	vectorStoreFilesRetrieveContent: VectorStores.VectorStoreFilesRetrieveContentResponse;

	vectorStoreFileBatchesCreate: VectorStores.VectorStoreFileBatchesCreateResponse;
	vectorStoreFileBatchesRetrieve: VectorStores.VectorStoreFileBatchesRetrieveResponse;
	vectorStoreFileBatchesListFiles: VectorStores.VectorStoreFileBatchesListFilesResponse;

	moderationCreate: Moderation.ModerationCreateResponse;

	audioCreateSpeech: Audio.AudioCreateSpeechResponse;
	audioCreateTranscription: Audio.AudioCreateTranscriptionResponse;
	audioCreateTranslation: Audio.AudioCreateTranslationResponse;

	imagesCreate: Images.ImagesCreateResponse;
	imagesCreateEdit: Images.ImagesCreateEditResponse;
	imagesCreateVariation: Images.ImagesCreateVariationResponse;

	videosCreate: Videos.VideosCreateResponse;
	videosList: Videos.VideosListResponse;
	videosRetrieve: Videos.VideosRetrieveResponse;
	videosDelete: Videos.VideosDeleteResponse;
	videosCreateRemix: Videos.VideosCreateRemixResponse;
	videosDownload: Videos.VideosDownloadResponse;

	realtimeCreateCall: Realtime.RealtimeCreateCallResponse;
	realtimeCreateClientSecret: Realtime.RealtimeCreateClientSecretResponse;
	realtimeCreateSession: Realtime.RealtimeCreateSessionResponse;
	realtimeCreateTranscriptionSession: Realtime.RealtimeCreateTranscriptionSessionResponse;

	chatkitListThreads: Chatkit.ChatkitListThreadsResponse;
	chatkitGetThread: Chatkit.ChatkitGetThreadResponse;
	chatkitListThreadItems: Chatkit.ChatkitListThreadItemsResponse;

	skillsCreate: Skills.SkillsCreateResponse;
	skillsList: Skills.SkillsListResponse;
	skillsDelete: Skills.SkillsDeleteResponse;

	containersCreate: Containers.ContainersCreateResponse;
	containersList: Containers.ContainersListResponse;
	containersRetrieve: Containers.ContainersRetrieveResponse;
	containersDelete: Containers.ContainersDeleteResponse;
	containerFilesCreate: Containers.ContainerFilesCreateResponse;
	containerFilesList: Containers.ContainerFilesListResponse;
	containerFilesRetrieve: Containers.ContainerFilesRetrieveResponse;
	containerFilesRetrieveContent: Containers.ContainerFilesRetrieveContentResponse;
	containerFilesDelete: Containers.ContainerFilesDeleteResponse;

	conversationsCreate: Conversations.ConversationsCreateResponse;
	conversationsUpdate: Conversations.ConversationsUpdateResponse;
	conversationsDelete: Conversations.ConversationsDeleteResponse;
	conversationsCreateItems: Conversations.ConversationsCreateItemsResponse;
	conversationsListItems: Conversations.ConversationsListItemsResponse;
	conversationsGetItem: Conversations.ConversationsGetItemResponse;
	conversationsDeleteItem: Conversations.ConversationsDeleteItemResponse;

	fineTuningCreateJob: FineTuning.FineTuningCreateJobResponse;
	fineTuningListJobs: FineTuning.FineTuningListJobsResponse;
	fineTuningRetrieveJob: FineTuning.FineTuningRetrieveJobResponse;
	fineTuningListCheckpoints: FineTuning.FineTuningListCheckpointsResponse;
	fineTuningListEvents: FineTuning.FineTuningListEventsResponse;
	fineTuningCancelJob: FineTuning.FineTuningCancelJobResponse;

	completionsCreate: ChatExtensions.CompletionsCreateResponse;
	responsesCreate: ChatExtensions.ResponsesCreateResponse;
	responsesRetrieve: ChatExtensions.ResponsesRetrieveResponse;
	responsesDelete: ChatExtensions.ResponsesDeleteResponse;
	responsesCancel: ChatExtensions.ResponsesCancelResponse;
	responsesCompact: ChatExtensions.ResponsesCompactResponse;
	responsesListInputItems: ChatExtensions.ResponsesListInputItemsResponse;
	chatCompletionsList: ChatExtensions.ChatCompletionsListResponse;
	chatCompletionsRetrieve: ChatExtensions.ChatCompletionsRetrieveResponse;
	chatCompletionsUpdate: ChatExtensions.ChatCompletionsUpdateResponse;
	chatCompletionsDelete: ChatExtensions.ChatCompletionsDeleteResponse;
	chatCompletionsListMessages: ChatExtensions.ChatCompletionsListMessagesResponse;
	tokensCountInput: ChatExtensions.TokensCountInputResponse;

	evalsCreate: Evals.EvalsCreateResponse;
	evalsList: Evals.EvalsListResponse;
	evalsGet: Evals.EvalsGetResponse;
	evalsUpdate: Evals.EvalsUpdateResponse;
	evalsDelete: Evals.EvalsDeleteResponse;
	evalRunsCreate: Evals.EvalRunsCreateResponse;
	evalRunsGet: Evals.EvalRunsGetResponse;
	evalRunsList: Evals.EvalRunsListResponse;
	evalRunsCancel: Evals.EvalRunsCancelResponse;
	evalRunsDelete: Evals.EvalRunsDeleteResponse;
	evalRunsGetOutputItem: Evals.EvalRunsGetOutputItemResponse;
	evalRunsListOutputItems: Evals.EvalRunsListOutputItemsResponse;
	gradersRun: Evals.GradersRunResponse;
	gradersValidate: Evals.GradersValidateResponse;

	batchesCreate: Batches.BatchesCreateResponse;
	batchesRetrieve: Batches.BatchesRetrieveResponse;
	batchesCancel: Batches.BatchesCancelResponse;
	batchesList: Batches.BatchesListResponse;

	uploadsCreate: Uploads.UploadsCreateResponse;
	uploadsAddPart: Uploads.UploadsAddPartResponse;
	uploadsComplete: Uploads.UploadsCompleteResponse;
	uploadsCancel: Uploads.UploadsCancelResponse;
};

export const OpenaiEndpointInputSchemas = {
	modelsList: Models.ModelsListInputSchema,
	modelsRetrieve: Models.ModelsRetrieveInputSchema,
	enginesList: Models.EnginesListInputSchema,
	enginesRetrieve: Models.EnginesRetrieveInputSchema,

	chatCreateCompletion: Chat.ChatCreateCompletionInputSchema,

	embeddingsCreate: Embeddings.EmbeddingsCreateInputSchema,

	filesUpload: Files.FilesUploadInputSchema,
	filesList: Files.FilesListInputSchema,
	filesRetrieve: Files.FilesRetrieveInputSchema,
	filesDelete: Files.FilesDeleteInputSchema,
	filesDownloadContent: Files.FilesDownloadContentInputSchema,

	assistantsCreate: Assistants.AssistantsCreateInputSchema,
	assistantsList: Assistants.AssistantsListInputSchema,
	assistantsRetrieve: Assistants.AssistantsRetrieveInputSchema,
	assistantsModify: Assistants.AssistantsModifyInputSchema,
	assistantsDelete: Assistants.AssistantsDeleteInputSchema,

	threadsCreate: Assistants.ThreadsCreateInputSchema,
	threadsRetrieve: Assistants.ThreadsRetrieveInputSchema,
	threadsModify: Assistants.ThreadsModifyInputSchema,
	threadsDelete: Assistants.ThreadsDeleteInputSchema,
	threadsCreateAndRun: Assistants.ThreadsCreateAndRunInputSchema,

	messagesCreate: Assistants.MessagesCreateInputSchema,
	messagesList: Assistants.MessagesListInputSchema,
	messagesRetrieve: Assistants.MessagesRetrieveInputSchema,
	messagesModify: Assistants.MessagesModifyInputSchema,
	messagesDelete: Assistants.MessagesDeleteInputSchema,

	runsCreate: Assistants.RunsCreateInputSchema,
	runsList: Assistants.RunsListInputSchema,
	runsRetrieve: Assistants.RunsRetrieveInputSchema,
	runsModify: Assistants.RunsModifyInputSchema,
	runsCancel: Assistants.RunsCancelInputSchema,
	runsSubmitToolOutputs: Assistants.RunsSubmitToolOutputsInputSchema,

	runStepsList: Assistants.RunStepsListInputSchema,
	runStepsRetrieve: Assistants.RunStepsRetrieveInputSchema,

	vectorStoresCreate: VectorStores.VectorStoresCreateInputSchema,
	vectorStoresList: VectorStores.VectorStoresListInputSchema,
	vectorStoresRetrieve: VectorStores.VectorStoresRetrieveInputSchema,
	vectorStoresModify: VectorStores.VectorStoresModifyInputSchema,
	vectorStoresDelete: VectorStores.VectorStoresDeleteInputSchema,
	vectorStoresSearch: VectorStores.VectorStoresSearchInputSchema,

	vectorStoreFilesCreate: VectorStores.VectorStoreFilesCreateInputSchema,
	vectorStoreFilesList: VectorStores.VectorStoreFilesListInputSchema,
	vectorStoreFilesRetrieve: VectorStores.VectorStoreFilesRetrieveInputSchema,
	vectorStoreFilesDelete: VectorStores.VectorStoreFilesDeleteInputSchema,
	vectorStoreFilesUpdateAttributes:
		VectorStores.VectorStoreFilesUpdateAttributesInputSchema,
	vectorStoreFilesRetrieveContent:
		VectorStores.VectorStoreFilesRetrieveContentInputSchema,

	vectorStoreFileBatchesCreate:
		VectorStores.VectorStoreFileBatchesCreateInputSchema,
	vectorStoreFileBatchesRetrieve:
		VectorStores.VectorStoreFileBatchesRetrieveInputSchema,
	vectorStoreFileBatchesListFiles:
		VectorStores.VectorStoreFileBatchesListFilesInputSchema,

	moderationCreate: Moderation.ModerationCreateInputSchema,

	audioCreateSpeech: Audio.AudioCreateSpeechInputSchema,
	audioCreateTranscription: Audio.AudioCreateTranscriptionInputSchema,
	audioCreateTranslation: Audio.AudioCreateTranslationInputSchema,

	imagesCreate: Images.ImagesCreateInputSchema,
	imagesCreateEdit: Images.ImagesCreateEditInputSchema,
	imagesCreateVariation: Images.ImagesCreateVariationInputSchema,

	videosCreate: Videos.VideosCreateInputSchema,
	videosList: Videos.VideosListInputSchema,
	videosRetrieve: Videos.VideosRetrieveInputSchema,
	videosDelete: Videos.VideosDeleteInputSchema,
	videosCreateRemix: Videos.VideosCreateRemixInputSchema,
	videosDownload: Videos.VideosDownloadInputSchema,

	realtimeCreateCall: Realtime.RealtimeCreateCallInputSchema,
	realtimeCreateClientSecret: Realtime.RealtimeCreateClientSecretInputSchema,
	realtimeCreateSession: Realtime.RealtimeCreateSessionInputSchema,
	realtimeCreateTranscriptionSession:
		Realtime.RealtimeCreateTranscriptionSessionInputSchema,

	chatkitListThreads: Chatkit.ChatkitListThreadsInputSchema,
	chatkitGetThread: Chatkit.ChatkitGetThreadInputSchema,
	chatkitListThreadItems: Chatkit.ChatkitListThreadItemsInputSchema,

	skillsCreate: Skills.SkillsCreateInputSchema,
	skillsList: Skills.SkillsListInputSchema,
	skillsDelete: Skills.SkillsDeleteInputSchema,

	containersCreate: Containers.ContainersCreateInputSchema,
	containersList: Containers.ContainersListInputSchema,
	containersRetrieve: Containers.ContainersRetrieveInputSchema,
	containersDelete: Containers.ContainersDeleteInputSchema,
	containerFilesCreate: Containers.ContainerFilesCreateInputSchema,
	containerFilesList: Containers.ContainerFilesListInputSchema,
	containerFilesRetrieve: Containers.ContainerFilesRetrieveInputSchema,
	containerFilesRetrieveContent:
		Containers.ContainerFilesRetrieveContentInputSchema,
	containerFilesDelete: Containers.ContainerFilesDeleteInputSchema,

	conversationsCreate: Conversations.ConversationsCreateInputSchema,
	conversationsUpdate: Conversations.ConversationsUpdateInputSchema,
	conversationsDelete: Conversations.ConversationsDeleteInputSchema,
	conversationsCreateItems: Conversations.ConversationsCreateItemsInputSchema,
	conversationsListItems: Conversations.ConversationsListItemsInputSchema,
	conversationsGetItem: Conversations.ConversationsGetItemInputSchema,
	conversationsDeleteItem: Conversations.ConversationsDeleteItemInputSchema,

	fineTuningCreateJob: FineTuning.FineTuningCreateJobInputSchema,
	fineTuningListJobs: FineTuning.FineTuningListJobsInputSchema,
	fineTuningRetrieveJob: FineTuning.FineTuningRetrieveJobInputSchema,
	fineTuningListCheckpoints: FineTuning.FineTuningListCheckpointsInputSchema,
	fineTuningListEvents: FineTuning.FineTuningListEventsInputSchema,
	fineTuningCancelJob: FineTuning.FineTuningCancelJobInputSchema,

	completionsCreate: ChatExtensions.CompletionsCreateInputSchema,
	responsesCreate: ChatExtensions.ResponsesCreateInputSchema,
	responsesRetrieve: ChatExtensions.ResponsesRetrieveInputSchema,
	responsesDelete: ChatExtensions.ResponsesDeleteInputSchema,
	responsesCancel: ChatExtensions.ResponsesCancelInputSchema,
	responsesCompact: ChatExtensions.ResponsesCompactInputSchema,
	responsesListInputItems: ChatExtensions.ResponsesListInputItemsInputSchema,
	chatCompletionsList: ChatExtensions.ChatCompletionsListInputSchema,
	chatCompletionsRetrieve: ChatExtensions.ChatCompletionsRetrieveInputSchema,
	chatCompletionsUpdate: ChatExtensions.ChatCompletionsUpdateInputSchema,
	chatCompletionsDelete: ChatExtensions.ChatCompletionsDeleteInputSchema,
	chatCompletionsListMessages:
		ChatExtensions.ChatCompletionsListMessagesInputSchema,
	tokensCountInput: ChatExtensions.TokensCountInputInputSchema,

	evalsCreate: Evals.EvalsCreateInputSchema,
	evalsList: Evals.EvalsListInputSchema,
	evalsGet: Evals.EvalsGetInputSchema,
	evalsUpdate: Evals.EvalsUpdateInputSchema,
	evalsDelete: Evals.EvalsDeleteInputSchema,
	evalRunsCreate: Evals.EvalRunsCreateInputSchema,
	evalRunsGet: Evals.EvalRunsGetInputSchema,
	evalRunsList: Evals.EvalRunsListInputSchema,
	evalRunsCancel: Evals.EvalRunsCancelInputSchema,
	evalRunsDelete: Evals.EvalRunsDeleteInputSchema,
	evalRunsGetOutputItem: Evals.EvalRunsGetOutputItemInputSchema,
	evalRunsListOutputItems: Evals.EvalRunsListOutputItemsInputSchema,
	gradersRun: Evals.GradersRunInputSchema,
	gradersValidate: Evals.GradersValidateInputSchema,

	batchesCreate: Batches.BatchesCreateInputSchema,
	batchesRetrieve: Batches.BatchesRetrieveInputSchema,
	batchesCancel: Batches.BatchesCancelInputSchema,
	batchesList: Batches.BatchesListInputSchema,

	uploadsCreate: Uploads.UploadsCreateInputSchema,
	uploadsAddPart: Uploads.UploadsAddPartInputSchema,
	uploadsComplete: Uploads.UploadsCompleteInputSchema,
	uploadsCancel: Uploads.UploadsCancelInputSchema,
} as const;

export const OpenaiEndpointOutputSchemas = {
	modelsList: Models.ModelsListResponseSchema,
	modelsRetrieve: Models.ModelsRetrieveResponseSchema,
	enginesList: Models.EnginesListResponseSchema,
	enginesRetrieve: Models.EnginesRetrieveResponseSchema,

	chatCreateCompletion: Chat.ChatCreateCompletionResponseSchema,

	embeddingsCreate: Embeddings.EmbeddingsCreateResponseSchema,

	filesUpload: Files.FilesUploadResponseSchema,
	filesList: Files.FilesListResponseSchema,
	filesRetrieve: Files.FilesRetrieveResponseSchema,
	filesDelete: Files.FilesDeleteResponseSchema,
	filesDownloadContent: Files.FilesDownloadContentResponseSchema,

	assistantsCreate: Assistants.AssistantsCreateResponseSchema,
	assistantsList: Assistants.AssistantsListResponseSchema,
	assistantsRetrieve: Assistants.AssistantsRetrieveResponseSchema,
	assistantsModify: Assistants.AssistantsModifyResponseSchema,
	assistantsDelete: Assistants.AssistantsDeleteResponseSchema,

	threadsCreate: Assistants.ThreadsCreateResponseSchema,
	threadsRetrieve: Assistants.ThreadsRetrieveResponseSchema,
	threadsModify: Assistants.ThreadsModifyResponseSchema,
	threadsDelete: Assistants.ThreadsDeleteResponseSchema,
	threadsCreateAndRun: Assistants.ThreadsCreateAndRunResponseSchema,

	messagesCreate: Assistants.MessagesCreateResponseSchema,
	messagesList: Assistants.MessagesListResponseSchema,
	messagesRetrieve: Assistants.MessagesRetrieveResponseSchema,
	messagesModify: Assistants.MessagesModifyResponseSchema,
	messagesDelete: Assistants.MessagesDeleteResponseSchema,

	runsCreate: Assistants.RunsCreateResponseSchema,
	runsList: Assistants.RunsListResponseSchema,
	runsRetrieve: Assistants.RunsRetrieveResponseSchema,
	runsModify: Assistants.RunsModifyResponseSchema,
	runsCancel: Assistants.RunsCancelResponseSchema,
	runsSubmitToolOutputs: Assistants.RunsSubmitToolOutputsResponseSchema,

	runStepsList: Assistants.RunStepsListResponseSchema,
	runStepsRetrieve: Assistants.RunStepsRetrieveResponseSchema,

	vectorStoresCreate: VectorStores.VectorStoresCreateResponseSchema,
	vectorStoresList: VectorStores.VectorStoresListResponseSchema,
	vectorStoresRetrieve: VectorStores.VectorStoresRetrieveResponseSchema,
	vectorStoresModify: VectorStores.VectorStoresModifyResponseSchema,
	vectorStoresDelete: VectorStores.VectorStoresDeleteResponseSchema,
	vectorStoresSearch: VectorStores.VectorStoresSearchResponseSchema,

	vectorStoreFilesCreate: VectorStores.VectorStoreFilesCreateResponseSchema,
	vectorStoreFilesList: VectorStores.VectorStoreFilesListResponseSchema,
	vectorStoreFilesRetrieve: VectorStores.VectorStoreFilesRetrieveResponseSchema,
	vectorStoreFilesDelete: VectorStores.VectorStoreFilesDeleteResponseSchema,
	vectorStoreFilesUpdateAttributes:
		VectorStores.VectorStoreFilesUpdateAttributesResponseSchema,
	vectorStoreFilesRetrieveContent:
		VectorStores.VectorStoreFilesRetrieveContentResponseSchema,

	vectorStoreFileBatchesCreate:
		VectorStores.VectorStoreFileBatchesCreateResponseSchema,
	vectorStoreFileBatchesRetrieve:
		VectorStores.VectorStoreFileBatchesRetrieveResponseSchema,
	vectorStoreFileBatchesListFiles:
		VectorStores.VectorStoreFileBatchesListFilesResponseSchema,

	moderationCreate: Moderation.ModerationCreateResponseSchema,

	audioCreateSpeech: Audio.AudioCreateSpeechResponseSchema,
	audioCreateTranscription: Audio.AudioCreateTranscriptionResponseSchema,
	audioCreateTranslation: Audio.AudioCreateTranslationResponseSchema,

	imagesCreate: Images.ImagesCreateResponseSchema,
	imagesCreateEdit: Images.ImagesCreateEditResponseSchema,
	imagesCreateVariation: Images.ImagesCreateVariationResponseSchema,

	videosCreate: Videos.VideosCreateResponseSchema,
	videosList: Videos.VideosListResponseSchema,
	videosRetrieve: Videos.VideosRetrieveResponseSchema,
	videosDelete: Videos.VideosDeleteResponseSchema,
	videosCreateRemix: Videos.VideosCreateRemixResponseSchema,
	videosDownload: Videos.VideosDownloadResponseSchema,

	realtimeCreateCall: Realtime.RealtimeCreateCallResponseSchema,
	realtimeCreateClientSecret: Realtime.RealtimeCreateClientSecretResponseSchema,
	realtimeCreateSession: Realtime.RealtimeCreateSessionResponseSchema,
	realtimeCreateTranscriptionSession:
		Realtime.RealtimeCreateTranscriptionSessionResponseSchema,

	chatkitListThreads: Chatkit.ChatkitListThreadsResponseSchema,
	chatkitGetThread: Chatkit.ChatkitGetThreadResponseSchema,
	chatkitListThreadItems: Chatkit.ChatkitListThreadItemsResponseSchema,

	skillsCreate: Skills.SkillsCreateResponseSchema,
	skillsList: Skills.SkillsListResponseSchema,
	skillsDelete: Skills.SkillsDeleteResponseSchema,

	containersCreate: Containers.ContainersCreateResponseSchema,
	containersList: Containers.ContainersListResponseSchema,
	containersRetrieve: Containers.ContainersRetrieveResponseSchema,
	containersDelete: Containers.ContainersDeleteResponseSchema,
	containerFilesCreate: Containers.ContainerFilesCreateResponseSchema,
	containerFilesList: Containers.ContainerFilesListResponseSchema,
	containerFilesRetrieve: Containers.ContainerFilesRetrieveResponseSchema,
	containerFilesRetrieveContent:
		Containers.ContainerFilesRetrieveContentResponseSchema,
	containerFilesDelete: Containers.ContainerFilesDeleteResponseSchema,

	conversationsCreate: Conversations.ConversationsCreateResponseSchema,
	conversationsUpdate: Conversations.ConversationsUpdateResponseSchema,
	conversationsDelete: Conversations.ConversationsDeleteResponseSchema,
	conversationsCreateItems:
		Conversations.ConversationsCreateItemsResponseSchema,
	conversationsListItems: Conversations.ConversationsListItemsResponseSchema,
	conversationsGetItem: Conversations.ConversationsGetItemResponseSchema,
	conversationsDeleteItem: Conversations.ConversationsDeleteItemResponseSchema,

	fineTuningCreateJob: FineTuning.FineTuningCreateJobResponseSchema,
	fineTuningListJobs: FineTuning.FineTuningListJobsResponseSchema,
	fineTuningRetrieveJob: FineTuning.FineTuningRetrieveJobResponseSchema,
	fineTuningListCheckpoints: FineTuning.FineTuningListCheckpointsResponseSchema,
	fineTuningListEvents: FineTuning.FineTuningListEventsResponseSchema,
	fineTuningCancelJob: FineTuning.FineTuningCancelJobResponseSchema,

	completionsCreate: ChatExtensions.CompletionsCreateResponseSchema,
	responsesCreate: ChatExtensions.ResponsesCreateResponseSchema,
	responsesRetrieve: ChatExtensions.ResponsesRetrieveResponseSchema,
	responsesDelete: ChatExtensions.ResponsesDeleteResponseSchema,
	responsesCancel: ChatExtensions.ResponsesCancelResponseSchema,
	responsesCompact: ChatExtensions.ResponsesCompactResponseSchema,
	responsesListInputItems: ChatExtensions.ResponsesListInputItemsResponseSchema,
	chatCompletionsList: ChatExtensions.ChatCompletionsListResponseSchema,
	chatCompletionsRetrieve: ChatExtensions.ChatCompletionsRetrieveResponseSchema,
	chatCompletionsUpdate: ChatExtensions.ChatCompletionsUpdateResponseSchema,
	chatCompletionsDelete: ChatExtensions.ChatCompletionsDeleteResponseSchema,
	chatCompletionsListMessages:
		ChatExtensions.ChatCompletionsListMessagesResponseSchema,
	tokensCountInput: ChatExtensions.TokensCountInputResponseSchema,

	evalsCreate: Evals.EvalsCreateResponseSchema,
	evalsList: Evals.EvalsListResponseSchema,
	evalsGet: Evals.EvalsGetResponseSchema,
	evalsUpdate: Evals.EvalsUpdateResponseSchema,
	evalsDelete: Evals.EvalsDeleteResponseSchema,
	evalRunsCreate: Evals.EvalRunsCreateResponseSchema,
	evalRunsGet: Evals.EvalRunsGetResponseSchema,
	evalRunsList: Evals.EvalRunsListResponseSchema,
	evalRunsCancel: Evals.EvalRunsCancelResponseSchema,
	evalRunsDelete: Evals.EvalRunsDeleteResponseSchema,
	evalRunsGetOutputItem: Evals.EvalRunsGetOutputItemResponseSchema,
	evalRunsListOutputItems: Evals.EvalRunsListOutputItemsResponseSchema,
	gradersRun: Evals.GradersRunResponseSchema,
	gradersValidate: Evals.GradersValidateResponseSchema,

	batchesCreate: Batches.BatchesCreateResponseSchema,
	batchesRetrieve: Batches.BatchesRetrieveResponseSchema,
	batchesCancel: Batches.BatchesCancelResponseSchema,
	batchesList: Batches.BatchesListResponseSchema,

	uploadsCreate: Uploads.UploadsCreateResponseSchema,
	uploadsAddPart: Uploads.UploadsAddPartResponseSchema,
	uploadsComplete: Uploads.UploadsCompleteResponseSchema,
	uploadsCancel: Uploads.UploadsCancelResponseSchema,
} as const;
