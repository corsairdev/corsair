import { z } from 'zod';

const PaginationInputSchema = z
	.object({
		limit: z.number().optional(),
		order: z.string().optional(),
		before: z.string().optional(),
		after: z.string().optional(),
	})
	.passthrough();

const BaseInputSchema = z.object({}).passthrough();
const BaseResponseSchema = z.any();
const ModelMessageSchema = z
	.object({
		role: z.string(),
		content: z.string(),
	})
	.passthrough();

const ModelsListInputSchema = BaseInputSchema;
const ModelsListWithDetailsInputSchema = PaginationInputSchema.extend({
	model: z.string().optional(),
});
const ChatCreateCompletionInputSchema = z
	.object({
		model: z.string(),
		messages: z.array(ModelMessageSchema).min(1),
		maxTokens: z.number().optional(),
		temperature: z.number().optional(),
		topP: z.number().optional(),
		frequencyPenalty: z.number().optional(),
		presencePenalty: z.number().optional(),
		stop: z.union([z.string(), z.array(z.string())]).optional(),
		tools: z.array(z.unknown()).optional(),
		toolChoice: z.unknown().optional(),
		responseFormat: z.unknown().optional(),
		seed: z.number().optional(),
		n: z.number().optional(),
	})
	.passthrough();
const ResponsesCreateInputSchema = z
	.object({
		model: z.string(),
		input: z.unknown().optional(),
		instructions: z.string().optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
		tools: z.array(z.unknown()).optional(),
		temperature: z.number().optional(),
		topP: z.number().optional(),
	})
	.passthrough();
const ResponsesGetInputSchema = z.object({ responseId: z.string() });
const ResponsesDeleteInputSchema = z.object({ responseId: z.string() });
const ResponsesCancelInputSchema = z.object({ responseId: z.string() });
const AssistantsCreateInputSchema = z
	.object({
		model: z.string(),
		name: z.string().optional(),
		description: z.string().optional(),
		instructions: z.string().optional(),
		tools: z.array(z.unknown()).optional(),
		toolResources: z.record(z.string(), z.unknown()).optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
		temperature: z.number().optional(),
		topP: z.number().optional(),
	})
	.passthrough();
const AssistantsListInputSchema = PaginationInputSchema;
const AssistantsGetInputSchema = z.object({ assistantId: z.string() });
const AssistantsUpdateInputSchema = AssistantsCreateInputSchema.extend({
	assistantId: z.string(),
});
const AssistantsDeleteInputSchema = z.object({ assistantId: z.string() });
const ThreadsCreateInputSchema = z
	.object({
		messages: z.array(ModelMessageSchema).optional(),
		toolResources: z.record(z.string(), z.unknown()).optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();
const ThreadsGetInputSchema = z.object({ threadId: z.string() });
const ThreadsUpdateInputSchema = z
	.object({
		threadId: z.string(),
		toolResources: z.record(z.string(), z.unknown()).optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();
const ThreadsDeleteInputSchema = z.object({ threadId: z.string() });
const MessagesCreateInputSchema = z
	.object({
		threadId: z.string(),
		role: z.string(),
		content: z.string(),
		attachments: z.array(z.unknown()).optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();
const MessagesListInputSchema = PaginationInputSchema.extend({
	threadId: z.string(),
});
const MessagesGetInputSchema = z.object({
	threadId: z.string(),
	messageId: z.string(),
});
const MessagesUpdateInputSchema = z
	.object({
		threadId: z.string(),
		messageId: z.string(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();
const MessagesDeleteInputSchema = z.object({
	threadId: z.string(),
	messageId: z.string(),
});
const RunsCreateInputSchema = z
	.object({
		threadId: z.string(),
		assistantId: z.string(),
		instructions: z.string().optional(),
		additionalInstructions: z.string().optional(),
		tools: z.array(z.unknown()).optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();
const RunsListInputSchema = PaginationInputSchema.extend({
	threadId: z.string(),
});
const RunsGetInputSchema = z.object({
	threadId: z.string(),
	runId: z.string(),
});
const RunsUpdateInputSchema = z
	.object({
		threadId: z.string(),
		runId: z.string(),
		instructions: z.string().optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();
const RunsCancelInputSchema = z.object({
	threadId: z.string(),
	runId: z.string(),
});
const RunsSubmitToolOutputsInputSchema = z
	.object({
		threadId: z.string(),
		runId: z.string(),
		toolOutputs: z.array(z.unknown()).optional(),
		stream: z.boolean().optional(),
	})
	.passthrough();
const RunStepsListInputSchema = PaginationInputSchema.extend({
	threadId: z.string(),
	runId: z.string(),
});
const RunStepsGetInputSchema = z.object({
	threadId: z.string(),
	runId: z.string(),
	stepId: z.string(),
});
const BillingGetBalanceInputSchema = BaseInputSchema;
const BatchesListInputSchema = z.object({ batchId: z.string().optional() });
const LumaGetGenerationInputSchema = z.object({ generationId: z.string() });
const LumaListGenerationsInputSchema = z
	.object({
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.passthrough();

export type ModelsListInput = z.infer<typeof ModelsListInputSchema>;
export type ModelsListWithDetailsInput = z.infer<
	typeof ModelsListWithDetailsInputSchema
>;
export type ChatCreateCompletionInput = z.infer<
	typeof ChatCreateCompletionInputSchema
>;
export type ResponsesCreateInput = z.infer<typeof ResponsesCreateInputSchema>;
export type ResponsesGetInput = z.infer<typeof ResponsesGetInputSchema>;
export type ResponsesDeleteInput = z.infer<typeof ResponsesDeleteInputSchema>;
export type ResponsesCancelInput = z.infer<typeof ResponsesCancelInputSchema>;
export type AssistantsCreateInput = z.infer<typeof AssistantsCreateInputSchema>;
export type AssistantsListInput = z.infer<typeof AssistantsListInputSchema>;
export type AssistantsGetInput = z.infer<typeof AssistantsGetInputSchema>;
export type AssistantsUpdateInput = z.infer<typeof AssistantsUpdateInputSchema>;
export type AssistantsDeleteInput = z.infer<typeof AssistantsDeleteInputSchema>;
export type ThreadsCreateInput = z.infer<typeof ThreadsCreateInputSchema>;
export type ThreadsGetInput = z.infer<typeof ThreadsGetInputSchema>;
export type ThreadsUpdateInput = z.infer<typeof ThreadsUpdateInputSchema>;
export type ThreadsDeleteInput = z.infer<typeof ThreadsDeleteInputSchema>;
export type MessagesCreateInput = z.infer<typeof MessagesCreateInputSchema>;
export type MessagesListInput = z.infer<typeof MessagesListInputSchema>;
export type MessagesGetInput = z.infer<typeof MessagesGetInputSchema>;
export type MessagesUpdateInput = z.infer<typeof MessagesUpdateInputSchema>;
export type MessagesDeleteInput = z.infer<typeof MessagesDeleteInputSchema>;
export type RunsCreateInput = z.infer<typeof RunsCreateInputSchema>;
export type RunsListInput = z.infer<typeof RunsListInputSchema>;
export type RunsGetInput = z.infer<typeof RunsGetInputSchema>;
export type RunsUpdateInput = z.infer<typeof RunsUpdateInputSchema>;
export type RunsCancelInput = z.infer<typeof RunsCancelInputSchema>;
export type RunsSubmitToolOutputsInput = z.infer<
	typeof RunsSubmitToolOutputsInputSchema
>;
export type RunStepsListInput = z.infer<typeof RunStepsListInputSchema>;
export type RunStepsGetInput = z.infer<typeof RunStepsGetInputSchema>;
export type BillingGetBalanceInput = z.infer<
	typeof BillingGetBalanceInputSchema
>;
export type BatchesListInput = z.infer<typeof BatchesListInputSchema>;
export type LumaGetGenerationInput = z.infer<
	typeof LumaGetGenerationInputSchema
>;
export type LumaListGenerationsInput = z.infer<
	typeof LumaListGenerationsInputSchema
>;

export type AimlApiEndpointInputs = {
	modelsList: ModelsListInput;
	modelsListWithDetails: ModelsListWithDetailsInput;
	chatCreateCompletion: ChatCreateCompletionInput;
	responsesCreate: ResponsesCreateInput;
	responsesGet: ResponsesGetInput;
	responsesDelete: ResponsesDeleteInput;
	responsesCancel: ResponsesCancelInput;
	assistantsCreate: AssistantsCreateInput;
	assistantsList: AssistantsListInput;
	assistantsGet: AssistantsGetInput;
	assistantsUpdate: AssistantsUpdateInput;
	assistantsDelete: AssistantsDeleteInput;
	threadsCreate: ThreadsCreateInput;
	threadsGet: ThreadsGetInput;
	threadsUpdate: ThreadsUpdateInput;
	threadsDelete: ThreadsDeleteInput;
	messagesCreate: MessagesCreateInput;
	messagesList: MessagesListInput;
	messagesGet: MessagesGetInput;
	messagesUpdate: MessagesUpdateInput;
	messagesDelete: MessagesDeleteInput;
	runsCreate: RunsCreateInput;
	runsList: RunsListInput;
	runsGet: RunsGetInput;
	runsUpdate: RunsUpdateInput;
	runsCancel: RunsCancelInput;
	runsSubmitToolOutputs: RunsSubmitToolOutputsInput;
	runStepsList: RunStepsListInput;
	runStepsGet: RunStepsGetInput;
	billingGetBalance: BillingGetBalanceInput;
	batchesList: BatchesListInput;
	lumaGetGeneration: LumaGetGenerationInput;
	lumaListGenerations: LumaListGenerationsInput;
};

export type AimlApiEndpointOutputs = {
	modelsList: z.infer<typeof BaseResponseSchema>;
	modelsListWithDetails: z.infer<typeof BaseResponseSchema>;
	chatCreateCompletion: z.infer<typeof BaseResponseSchema>;
	responsesCreate: z.infer<typeof BaseResponseSchema>;
	responsesGet: z.infer<typeof BaseResponseSchema>;
	responsesDelete: z.infer<typeof BaseResponseSchema>;
	responsesCancel: z.infer<typeof BaseResponseSchema>;
	assistantsCreate: z.infer<typeof BaseResponseSchema>;
	assistantsList: z.infer<typeof BaseResponseSchema>;
	assistantsGet: z.infer<typeof BaseResponseSchema>;
	assistantsUpdate: z.infer<typeof BaseResponseSchema>;
	assistantsDelete: z.infer<typeof BaseResponseSchema>;
	threadsCreate: z.infer<typeof BaseResponseSchema>;
	threadsGet: z.infer<typeof BaseResponseSchema>;
	threadsUpdate: z.infer<typeof BaseResponseSchema>;
	threadsDelete: z.infer<typeof BaseResponseSchema>;
	messagesCreate: z.infer<typeof BaseResponseSchema>;
	messagesList: z.infer<typeof BaseResponseSchema>;
	messagesGet: z.infer<typeof BaseResponseSchema>;
	messagesUpdate: z.infer<typeof BaseResponseSchema>;
	messagesDelete: z.infer<typeof BaseResponseSchema>;
	runsCreate: z.infer<typeof BaseResponseSchema>;
	runsList: z.infer<typeof BaseResponseSchema>;
	runsGet: z.infer<typeof BaseResponseSchema>;
	runsUpdate: z.infer<typeof BaseResponseSchema>;
	runsCancel: z.infer<typeof BaseResponseSchema>;
	runsSubmitToolOutputs: z.infer<typeof BaseResponseSchema>;
	runStepsList: z.infer<typeof BaseResponseSchema>;
	runStepsGet: z.infer<typeof BaseResponseSchema>;
	billingGetBalance: z.infer<typeof BaseResponseSchema>;
	batchesList: z.infer<typeof BaseResponseSchema>;
	lumaGetGeneration: z.infer<typeof BaseResponseSchema>;
	lumaListGenerations: z.infer<typeof BaseResponseSchema>;
};

export const AimlApiEndpointInputSchemas = {
	modelsList: ModelsListInputSchema,
	modelsListWithDetails: ModelsListWithDetailsInputSchema,
	chatCreateCompletion: ChatCreateCompletionInputSchema,
	responsesCreate: ResponsesCreateInputSchema,
	responsesGet: ResponsesGetInputSchema,
	responsesDelete: ResponsesDeleteInputSchema,
	responsesCancel: ResponsesCancelInputSchema,
	assistantsCreate: AssistantsCreateInputSchema,
	assistantsList: AssistantsListInputSchema,
	assistantsGet: AssistantsGetInputSchema,
	assistantsUpdate: AssistantsUpdateInputSchema,
	assistantsDelete: AssistantsDeleteInputSchema,
	threadsCreate: ThreadsCreateInputSchema,
	threadsGet: ThreadsGetInputSchema,
	threadsUpdate: ThreadsUpdateInputSchema,
	threadsDelete: ThreadsDeleteInputSchema,
	messagesCreate: MessagesCreateInputSchema,
	messagesList: MessagesListInputSchema,
	messagesGet: MessagesGetInputSchema,
	messagesUpdate: MessagesUpdateInputSchema,
	messagesDelete: MessagesDeleteInputSchema,
	runsCreate: RunsCreateInputSchema,
	runsList: RunsListInputSchema,
	runsGet: RunsGetInputSchema,
	runsUpdate: RunsUpdateInputSchema,
	runsCancel: RunsCancelInputSchema,
	runsSubmitToolOutputs: RunsSubmitToolOutputsInputSchema,
	runStepsList: RunStepsListInputSchema,
	runStepsGet: RunStepsGetInputSchema,
	billingGetBalance: BillingGetBalanceInputSchema,
	batchesList: BatchesListInputSchema,
	lumaGetGeneration: LumaGetGenerationInputSchema,
	lumaListGenerations: LumaListGenerationsInputSchema,
} as const;

export const AimlApiEndpointOutputSchemas = {
	modelsList: BaseResponseSchema,
	modelsListWithDetails: BaseResponseSchema,
	chatCreateCompletion: BaseResponseSchema,
	responsesCreate: BaseResponseSchema,
	responsesGet: BaseResponseSchema,
	responsesDelete: BaseResponseSchema,
	responsesCancel: BaseResponseSchema,
	assistantsCreate: BaseResponseSchema,
	assistantsList: BaseResponseSchema,
	assistantsGet: BaseResponseSchema,
	assistantsUpdate: BaseResponseSchema,
	assistantsDelete: BaseResponseSchema,
	threadsCreate: BaseResponseSchema,
	threadsGet: BaseResponseSchema,
	threadsUpdate: BaseResponseSchema,
	threadsDelete: BaseResponseSchema,
	messagesCreate: BaseResponseSchema,
	messagesList: BaseResponseSchema,
	messagesGet: BaseResponseSchema,
	messagesUpdate: BaseResponseSchema,
	messagesDelete: BaseResponseSchema,
	runsCreate: BaseResponseSchema,
	runsList: BaseResponseSchema,
	runsGet: BaseResponseSchema,
	runsUpdate: BaseResponseSchema,
	runsCancel: BaseResponseSchema,
	runsSubmitToolOutputs: BaseResponseSchema,
	runStepsList: BaseResponseSchema,
	runStepsGet: BaseResponseSchema,
	billingGetBalance: BaseResponseSchema,
	batchesList: BaseResponseSchema,
	lumaGetGeneration: BaseResponseSchema,
	lumaListGenerations: BaseResponseSchema,
} as const;
