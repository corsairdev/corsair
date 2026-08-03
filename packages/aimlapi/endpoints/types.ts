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
		id: z.string(),
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
		data: z.array(z.unknown()),
		has_more: z.boolean().optional(),
		first_id: z.string().optional(),
		last_id: z.string().optional(),
	})
	.loose();

/** AIMLAPI /models item — id plus optional catalog metadata. */
const ModelListItemSchema = z
	.object({
		id: z.string(),
		type: z.string().optional(),
		name: z.string().optional(),
		provider: z.string().optional(),
		info: z
			.object({
				name: z.string().optional(),
				developer: z.string().optional(),
				description: z.string().optional(),
				contextLength: z.number().optional(),
				maxTokens: z.number().optional(),
				url: z.string().optional(),
				docsUrl: z.string().optional(),
				docs_url: z.string().optional(),
				releasedAt: z.string().optional(),
			})
			.loose()
			.optional(),
		features: z.array(z.string()).optional(),
		endpoints: z.array(z.string()).optional(),
		aliases: z.array(z.string()).optional(),
		tags: z.array(z.string()).optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

const ModelsListResponseSchema = z.union([
	z.array(ModelListItemSchema).min(1),
	z
		.object({
			object: z.string().optional(),
			data: z.array(ModelListItemSchema),
			has_more: z.boolean().optional(),
			first_id: z.string().optional(),
			last_id: z.string().optional(),
		})
		.loose(),
]);

const ChatCompletionChoiceSchema = z
	.object({
		index: z.number().optional(),
		message: ModelMessageSchema,
		finish_reason: z.string().optional(),
		finishReason: z.string().optional(),
	})
	.loose();

const ChatCompletionResponseSchema = z
	.object({
		id: z.string().optional(),
		object: z.string().optional(),
		created: z.number().optional(),
		model: z.string().optional(),
		choices: z.array(ChatCompletionChoiceSchema),
		usage: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

const BillingBalanceResponseSchema = z
	.object({
		current_balance: z.number().optional(),
		balance: z.number().optional(),
		currency: z.string().optional(),
	})
	.loose()
	.refine(
		(v) =>
			typeof v.current_balance === 'number' || typeof v.balance === 'number',
		{ message: 'current_balance or balance is required' },
	);

const DeleteResponseSchema = z
	.object({
		id: z.string().optional(),
		object: z.string().optional(),
		deleted: z.boolean(),
	})
	.loose();

const LumaGenerationResponseSchema = z
	.object({
		id: z.string(),
		status: z.string(),
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
const singleGenerationId = (value: string | undefined) =>
	typeof value === 'string' && value.trim().length > 0 && !value.includes(',');

const LumaGetGenerationInputSchema = z
	.object({
		generationId: z.string().optional(),
		ids: z.string().optional(),
	})
	.loose()
	.refine(
		(v) => singleGenerationId(v.generationId) || singleGenerationId(v.ids),
		{
			message:
				'generationId or ids is required (single id; comma-delimited not supported)',
		},
	);

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
} as const;
