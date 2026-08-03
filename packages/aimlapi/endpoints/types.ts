import { z } from 'zod';

const PaginationInputSchema = z
	.object({
		limit: z.number().optional(),
		order: z.string().optional(),
		before: z.string().optional(),
		after: z.string().optional(),
	})
	.loose();

const ModelMessageSchema = z
	.object({
		role: z.string(),
		content: z.string(),
	})
	.loose();

/** Loose provider payload — AIMLAPI returns OpenAI-shaped objects with extra fields. */
const ObjectResponseSchema = z
	.object({
		id: z.string().optional(),
		object: z.string().optional(),
		created: z.number().optional(),
		created_at: z.number().optional(),
		status: z.string().optional(),
		model: z.string().optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

const ListResponseSchema = z
	.object({
		object: z.string().optional(),
		data: z.array(z.unknown()).optional(),
		has_more: z.boolean().optional(),
		first_id: z.string().optional(),
		last_id: z.string().optional(),
	})
	.loose();

const ModelsListResponseSchema = z.union([
	z.array(z.unknown()),
	ListResponseSchema,
]);

const ChatCompletionResponseSchema = z
	.object({
		id: z.string().optional(),
		object: z.string().optional(),
		created: z.number().optional(),
		model: z.string().optional(),
		choices: z.array(z.unknown()).optional(),
		usage: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

const BillingBalanceResponseSchema = z
	.object({
		current_balance: z.number().optional(),
		balance: z.number().optional(),
		currency: z.string().optional(),
	})
	.loose();

const DeleteResponseSchema = z
	.object({
		id: z.string().optional(),
		object: z.string().optional(),
		deleted: z.boolean().optional(),
	})
	.loose();

const LumaGenerationResponseSchema = z
	.object({
		id: z.string().optional(),
		status: z.string().optional(),
		video: z.unknown().optional(),
		error: z.unknown().optional(),
		meta: z.unknown().optional(),
	})
	.loose();

const ModelsListInputSchema = z.object({}).loose();
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
	.loose();
const ResponsesGetInputSchema = z
	.object({
		responseId: z.string(),
		include: z.array(z.string()).optional(),
		startingAfter: z.number().optional(),
		includeObfuscation: z.boolean().optional(),
	})
	.loose();
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
	.loose();
const AssistantsListInputSchema = PaginationInputSchema;
const AssistantsGetInputSchema = z.object({ assistantId: z.string() });
const AssistantsUpdateInputSchema = z
	.object({
		assistantId: z.string(),
		model: z.string().optional(),
		name: z.string().optional(),
		description: z.string().optional(),
		instructions: z.string().optional(),
		tools: z.array(z.unknown()).optional(),
		toolResources: z.record(z.string(), z.unknown()).optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
		temperature: z.number().optional(),
		topP: z.number().optional(),
	})
	.loose();
const AssistantsDeleteInputSchema = z.object({ assistantId: z.string() });
const ThreadsCreateInputSchema = z
	.object({
		messages: z.array(ModelMessageSchema).optional(),
		toolResources: z.record(z.string(), z.unknown()).optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();
const ThreadsGetInputSchema = z.object({ threadId: z.string() });
const ThreadsUpdateInputSchema = z
	.object({
		threadId: z.string(),
		toolResources: z.record(z.string(), z.unknown()).optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();
const ThreadsDeleteInputSchema = z.object({ threadId: z.string() });
const MessagesCreateInputSchema = z
	.object({
		threadId: z.string(),
		role: z.string(),
		content: z.string(),
		attachments: z.array(z.unknown()).optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();
const MessagesListInputSchema = PaginationInputSchema.extend({
	threadId: z.string(),
	runId: z.string().optional(),
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
	.loose();
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
	.loose();
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
	.loose();
const RunsCancelInputSchema = z.object({
	threadId: z.string(),
	runId: z.string(),
});
const RunsSubmitToolOutputsInputSchema = z
	.object({
		threadId: z.string(),
		runId: z.string(),
		toolOutputs: z.array(z.unknown()).optional(),
	})
	.loose();
const RunStepsListInputSchema = PaginationInputSchema.extend({
	threadId: z.string(),
	runId: z.string(),
});
const RunStepsGetInputSchema = z.object({
	threadId: z.string(),
	runId: z.string(),
	stepId: z.string(),
});
const BillingGetBalanceInputSchema = z.object({}).loose();
const BatchesListInputSchema = z.object({ batchId: z.string() });
const LumaGetGenerationInputSchema = z
	.object({
		generationId: z.string().optional(),
		ids: z.string().optional(),
	})
	.loose()
	.refine((v) => Boolean(v.generationId || v.ids), {
		message: 'generationId or ids is required',
	});
const LumaListGenerationsInputSchema = z
	.object({
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.loose();

export type ModelsListInput = z.infer<typeof ModelsListInputSchema>;
export type ModelsListWithDetailsInput = z.infer<
	typeof ModelsListWithDetailsInputSchema
>;
export type ChatCreateCompletionInput = z.infer<
	typeof ChatCreateCompletionInputSchema
>;
export type ResponsesGetInput = z.infer<typeof ResponsesGetInputSchema>;
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
	responsesGet: ResponsesGetInput;
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
	modelsList: z.infer<typeof ModelsListResponseSchema>;
	modelsListWithDetails: z.infer<typeof ModelsListResponseSchema>;
	chatCreateCompletion: z.infer<typeof ChatCompletionResponseSchema>;
	responsesGet: z.infer<typeof ObjectResponseSchema>;
	assistantsCreate: z.infer<typeof ObjectResponseSchema>;
	assistantsList: z.infer<typeof ListResponseSchema>;
	assistantsGet: z.infer<typeof ObjectResponseSchema>;
	assistantsUpdate: z.infer<typeof ObjectResponseSchema>;
	assistantsDelete: z.infer<typeof DeleteResponseSchema>;
	threadsCreate: z.infer<typeof ObjectResponseSchema>;
	threadsGet: z.infer<typeof ObjectResponseSchema>;
	threadsUpdate: z.infer<typeof ObjectResponseSchema>;
	threadsDelete: z.infer<typeof DeleteResponseSchema>;
	messagesCreate: z.infer<typeof ObjectResponseSchema>;
	messagesList: z.infer<typeof ListResponseSchema>;
	messagesGet: z.infer<typeof ObjectResponseSchema>;
	messagesUpdate: z.infer<typeof ObjectResponseSchema>;
	messagesDelete: z.infer<typeof DeleteResponseSchema>;
	runsCreate: z.infer<typeof ObjectResponseSchema>;
	runsList: z.infer<typeof ListResponseSchema>;
	runsGet: z.infer<typeof ObjectResponseSchema>;
	runsUpdate: z.infer<typeof ObjectResponseSchema>;
	runsCancel: z.infer<typeof ObjectResponseSchema>;
	runsSubmitToolOutputs: z.infer<typeof ObjectResponseSchema>;
	runStepsList: z.infer<typeof ListResponseSchema>;
	runStepsGet: z.infer<typeof ObjectResponseSchema>;
	billingGetBalance: z.infer<typeof BillingBalanceResponseSchema>;
	batchesList: z.infer<typeof ObjectResponseSchema>;
	lumaGetGeneration: z.infer<typeof LumaGenerationResponseSchema>;
	lumaListGenerations: z.infer<typeof ObjectResponseSchema>;
};

export const AimlApiEndpointInputSchemas = {
	modelsList: ModelsListInputSchema,
	modelsListWithDetails: ModelsListWithDetailsInputSchema,
	chatCreateCompletion: ChatCreateCompletionInputSchema,
	responsesGet: ResponsesGetInputSchema,
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
	modelsList: ModelsListResponseSchema,
	modelsListWithDetails: ModelsListResponseSchema,
	chatCreateCompletion: ChatCompletionResponseSchema,
	responsesGet: ObjectResponseSchema,
	assistantsCreate: ObjectResponseSchema,
	assistantsList: ListResponseSchema,
	assistantsGet: ObjectResponseSchema,
	assistantsUpdate: ObjectResponseSchema,
	assistantsDelete: DeleteResponseSchema,
	threadsCreate: ObjectResponseSchema,
	threadsGet: ObjectResponseSchema,
	threadsUpdate: ObjectResponseSchema,
	threadsDelete: DeleteResponseSchema,
	messagesCreate: ObjectResponseSchema,
	messagesList: ListResponseSchema,
	messagesGet: ObjectResponseSchema,
	messagesUpdate: ObjectResponseSchema,
	messagesDelete: DeleteResponseSchema,
	runsCreate: ObjectResponseSchema,
	runsList: ListResponseSchema,
	runsGet: ObjectResponseSchema,
	runsUpdate: ObjectResponseSchema,
	runsCancel: ObjectResponseSchema,
	runsSubmitToolOutputs: ObjectResponseSchema,
	runStepsList: ListResponseSchema,
	runStepsGet: ObjectResponseSchema,
	billingGetBalance: BillingBalanceResponseSchema,
	batchesList: ObjectResponseSchema,
	lumaGetGeneration: LumaGenerationResponseSchema,
	lumaListGenerations: ObjectResponseSchema,
} as const;
