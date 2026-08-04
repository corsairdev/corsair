import { z } from 'zod';

const MetadataSchema = z.record(z.string(), z.string()).nullable().optional();

const FunctionToolSchema = z.object({
	type: z.literal('function'),
	function: z.object({
		name: z.string(),
		description: z.string().optional(),
		// Function tool parameters are an arbitrary JSON Schema object defined by the caller.
		parameters: z.record(z.string(), z.unknown()).optional(),
		strict: z.boolean().nullable().optional(),
	}),
});

const AssistantToolSchema = z.union([
	z.object({ type: z.literal('code_interpreter') }),
	z.object({
		type: z.literal('file_search'),
		file_search: z
			.object({
				max_num_results: z.number().optional(),
				ranking_options: z
					.object({
						ranker: z.string().optional(),
						score_threshold: z.number().optional(),
					})
					.optional(),
			})
			.optional(),
	}),
	FunctionToolSchema,
]);
export type AssistantTool = z.infer<typeof AssistantToolSchema>;

const ToolResourcesSchema = z
	.object({
		code_interpreter: z.object({ file_ids: z.array(z.string()) }).optional(),
		file_search: z.object({ vector_store_ids: z.array(z.string()) }).optional(),
	})
	.optional();

// --- Assistants ---

export const AssistantsCreateInputSchema = z.object({
	model: z.string(),
	name: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	instructions: z.string().nullable().optional(),
	tools: z.array(AssistantToolSchema).optional(),
	toolResources: ToolResourcesSchema,
	metadata: MetadataSchema,
	temperature: z.number().nullable().optional(),
	topP: z.number().nullable().optional(),
});
export type AssistantsCreateInput = z.infer<typeof AssistantsCreateInputSchema>;

const AssistantObjectSchema = z.object({
	id: z.string(),
	object: z.literal('assistant'),
	created_at: z.number(),
	name: z.string().nullable(),
	description: z.string().nullable(),
	model: z.string(),
	instructions: z.string().nullable(),
	tools: z.array(AssistantToolSchema),
	metadata: z.record(z.string(), z.string()).nullable().optional(),
	temperature: z.number().nullable().optional(),
	top_p: z.number().nullable().optional(),
});
export type AssistantObject = z.infer<typeof AssistantObjectSchema>;

export const AssistantsCreateResponseSchema = AssistantObjectSchema;
export type AssistantsCreateResponse = z.infer<
	typeof AssistantsCreateResponseSchema
>;

export const AssistantsListInputSchema = z.object({
	limit: z.number().optional(),
	order: z.enum(['asc', 'desc']).optional(),
	after: z.string().optional(),
	before: z.string().optional(),
});
export type AssistantsListInput = z.infer<typeof AssistantsListInputSchema>;

export const AssistantsListResponseSchema = z.object({
	object: z.literal('list'),
	data: z.array(AssistantObjectSchema),
	first_id: z.string().optional(),
	last_id: z.string().optional(),
	has_more: z.boolean(),
});
export type AssistantsListResponse = z.infer<
	typeof AssistantsListResponseSchema
>;

export const AssistantsRetrieveInputSchema = z.object({
	assistantId: z.string(),
});
export type AssistantsRetrieveInput = z.infer<
	typeof AssistantsRetrieveInputSchema
>;
export const AssistantsRetrieveResponseSchema = AssistantObjectSchema;
export type AssistantsRetrieveResponse = z.infer<
	typeof AssistantsRetrieveResponseSchema
>;

export const AssistantsModifyInputSchema = z.object({
	assistantId: z.string(),
	model: z.string().optional(),
	name: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	instructions: z.string().nullable().optional(),
	tools: z.array(AssistantToolSchema).optional(),
	toolResources: ToolResourcesSchema,
	metadata: MetadataSchema,
	temperature: z.number().nullable().optional(),
	topP: z.number().nullable().optional(),
});
export type AssistantsModifyInput = z.infer<typeof AssistantsModifyInputSchema>;
export const AssistantsModifyResponseSchema = AssistantObjectSchema;
export type AssistantsModifyResponse = z.infer<
	typeof AssistantsModifyResponseSchema
>;

export const AssistantsDeleteInputSchema = z.object({
	assistantId: z.string(),
});
export type AssistantsDeleteInput = z.infer<typeof AssistantsDeleteInputSchema>;
export const AssistantsDeleteResponseSchema = z.object({
	id: z.string(),
	object: z.literal('assistant.deleted'),
	deleted: z.boolean(),
});
export type AssistantsDeleteResponse = z.infer<
	typeof AssistantsDeleteResponseSchema
>;

// --- Threads ---

export const ThreadsCreateInputSchema = z.object({
	messages: z
		.array(
			z.object({
				role: z.enum(['user', 'assistant']),
				content: z.string(),
				metadata: MetadataSchema,
			}),
		)
		.optional(),
	toolResources: ToolResourcesSchema,
	metadata: MetadataSchema,
});
export type ThreadsCreateInput = z.infer<typeof ThreadsCreateInputSchema>;

const ThreadObjectSchema = z.object({
	id: z.string(),
	object: z.literal('thread'),
	created_at: z.number(),
	metadata: z.record(z.string(), z.string()).nullable().optional(),
});
export type ThreadObject = z.infer<typeof ThreadObjectSchema>;

export const ThreadsCreateResponseSchema = ThreadObjectSchema;
export type ThreadsCreateResponse = z.infer<typeof ThreadsCreateResponseSchema>;

export const ThreadsRetrieveInputSchema = z.object({ threadId: z.string() });
export type ThreadsRetrieveInput = z.infer<typeof ThreadsRetrieveInputSchema>;
export const ThreadsRetrieveResponseSchema = ThreadObjectSchema;
export type ThreadsRetrieveResponse = z.infer<
	typeof ThreadsRetrieveResponseSchema
>;

export const ThreadsModifyInputSchema = z.object({
	threadId: z.string(),
	toolResources: ToolResourcesSchema,
	metadata: MetadataSchema,
});
export type ThreadsModifyInput = z.infer<typeof ThreadsModifyInputSchema>;
export const ThreadsModifyResponseSchema = ThreadObjectSchema;
export type ThreadsModifyResponse = z.infer<typeof ThreadsModifyResponseSchema>;

export const ThreadsDeleteInputSchema = z.object({ threadId: z.string() });
export type ThreadsDeleteInput = z.infer<typeof ThreadsDeleteInputSchema>;
export const ThreadsDeleteResponseSchema = z.object({
	id: z.string(),
	object: z.literal('thread.deleted'),
	deleted: z.boolean(),
});
export type ThreadsDeleteResponse = z.infer<typeof ThreadsDeleteResponseSchema>;

// --- Messages ---

const MessageContentPartSchema = z.union([
	z.object({
		type: z.literal('text'),
		text: z.object({
			value: z.string(),
			// Annotation shape varies by citation type (file_citation, file_path); not modeled field-by-field.
			annotations: z.array(z.record(z.string(), z.unknown())),
		}),
	}),
	z.object({
		type: z.literal('image_file'),
		image_file: z.object({
			file_id: z.string(),
			detail: z.enum(['auto', 'low', 'high']).optional(),
		}),
	}),
	z.object({
		type: z.literal('image_url'),
		image_url: z.object({
			url: z.string(),
			detail: z.enum(['auto', 'low', 'high']).optional(),
		}),
	}),
]);

const AttachmentSchema = z.object({
	file_id: z.string().optional(),
	tools: z
		.array(
			z.union([
				z.object({ type: z.literal('code_interpreter') }),
				z.object({ type: z.literal('file_search') }),
			]),
		)
		.optional(),
});

export const MessagesCreateInputSchema = z.object({
	threadId: z.string(),
	role: z.enum(['user', 'assistant']),
	content: z.union([z.string(), z.array(MessageContentPartSchema)]),
	attachments: z.array(AttachmentSchema).nullable().optional(),
	metadata: MetadataSchema,
});
export type MessagesCreateInput = z.infer<typeof MessagesCreateInputSchema>;

const MessageObjectSchema = z.object({
	id: z.string(),
	object: z.literal('thread.message'),
	created_at: z.number(),
	thread_id: z.string(),
	status: z.enum(['in_progress', 'incomplete', 'completed']).optional(),
	role: z.enum(['user', 'assistant']),
	content: z.array(MessageContentPartSchema),
	assistant_id: z.string().nullable().optional(),
	run_id: z.string().nullable().optional(),
	attachments: z.array(AttachmentSchema).nullable().optional(),
	metadata: z.record(z.string(), z.string()).nullable().optional(),
});
export type MessageObject = z.infer<typeof MessageObjectSchema>;

export const MessagesCreateResponseSchema = MessageObjectSchema;
export type MessagesCreateResponse = z.infer<
	typeof MessagesCreateResponseSchema
>;

export const MessagesListInputSchema = z.object({
	threadId: z.string(),
	limit: z.number().optional(),
	order: z.enum(['asc', 'desc']).optional(),
	after: z.string().optional(),
	before: z.string().optional(),
	runId: z.string().optional(),
});
export type MessagesListInput = z.infer<typeof MessagesListInputSchema>;

export const MessagesListResponseSchema = z.object({
	object: z.literal('list'),
	data: z.array(MessageObjectSchema),
	first_id: z.string().optional(),
	last_id: z.string().optional(),
	has_more: z.boolean(),
});
export type MessagesListResponse = z.infer<typeof MessagesListResponseSchema>;

export const MessagesRetrieveInputSchema = z.object({
	threadId: z.string(),
	messageId: z.string(),
});
export type MessagesRetrieveInput = z.infer<typeof MessagesRetrieveInputSchema>;
export const MessagesRetrieveResponseSchema = MessageObjectSchema;
export type MessagesRetrieveResponse = z.infer<
	typeof MessagesRetrieveResponseSchema
>;

export const MessagesModifyInputSchema = z.object({
	threadId: z.string(),
	messageId: z.string(),
	metadata: MetadataSchema,
});
export type MessagesModifyInput = z.infer<typeof MessagesModifyInputSchema>;
export const MessagesModifyResponseSchema = MessageObjectSchema;
export type MessagesModifyResponse = z.infer<
	typeof MessagesModifyResponseSchema
>;

export const MessagesDeleteInputSchema = z.object({
	threadId: z.string(),
	messageId: z.string(),
});
export type MessagesDeleteInput = z.infer<typeof MessagesDeleteInputSchema>;
export const MessagesDeleteResponseSchema = z.object({
	id: z.string(),
	object: z.literal('thread.message.deleted'),
	deleted: z.boolean(),
});
export type MessagesDeleteResponse = z.infer<
	typeof MessagesDeleteResponseSchema
>;

// --- Runs ---

const TruncationStrategySchema = z
	.object({
		type: z.enum(['auto', 'last_messages']),
		last_messages: z.number().nullable().optional(),
	})
	.optional();

const ToolChoiceSchema = z
	.union([
		z.enum(['none', 'auto', 'required']),
		z.object({
			type: z.enum(['function', 'code_interpreter', 'file_search']),
			function: z.object({ name: z.string() }).optional(),
		}),
	])
	.optional();

export const RunsCreateInputSchema = z.object({
	threadId: z.string(),
	assistantId: z.string(),
	model: z.string().optional(),
	instructions: z.string().nullable().optional(),
	additionalInstructions: z.string().nullable().optional(),
	tools: z.array(AssistantToolSchema).nullable().optional(),
	metadata: MetadataSchema,
	temperature: z.number().nullable().optional(),
	topP: z.number().nullable().optional(),
	maxPromptTokens: z.number().nullable().optional(),
	maxCompletionTokens: z.number().nullable().optional(),
	truncationStrategy: TruncationStrategySchema,
	toolChoice: ToolChoiceSchema,
	parallelToolCalls: z.boolean().optional(),
});
export type RunsCreateInput = z.infer<typeof RunsCreateInputSchema>;

const RunObjectSchema = z.object({
	id: z.string(),
	object: z.literal('thread.run'),
	created_at: z.number(),
	thread_id: z.string(),
	assistant_id: z.string(),
	status: z.enum([
		'queued',
		'in_progress',
		'requires_action',
		'cancelling',
		'cancelled',
		'failed',
		'completed',
		'incomplete',
		'expired',
	]),
	// required_action shape depends on the action type (currently only submit_tool_outputs); kept loose to avoid breaking on new action types.
	required_action: z.record(z.string(), z.unknown()).nullable().optional(),
	last_error: z
		.object({ code: z.string(), message: z.string() })
		.nullable()
		.optional(),
	model: z.string(),
	instructions: z.string().nullable().optional(),
	tools: z.array(AssistantToolSchema),
	metadata: z.record(z.string(), z.string()).nullable().optional(),
	usage: z
		.object({
			prompt_tokens: z.number(),
			completion_tokens: z.number(),
			total_tokens: z.number(),
		})
		.nullable()
		.optional(),
});
export type RunObject = z.infer<typeof RunObjectSchema>;

export const RunsCreateResponseSchema = RunObjectSchema;
export type RunsCreateResponse = z.infer<typeof RunsCreateResponseSchema>;

export const ThreadsCreateAndRunInputSchema = z.object({
	assistantId: z.string(),
	thread: ThreadsCreateInputSchema.omit({}).partial().optional(),
	model: z.string().optional(),
	instructions: z.string().nullable().optional(),
	tools: z.array(AssistantToolSchema).nullable().optional(),
	toolResources: ToolResourcesSchema,
	metadata: MetadataSchema,
	temperature: z.number().nullable().optional(),
	topP: z.number().nullable().optional(),
	truncationStrategy: TruncationStrategySchema,
	toolChoice: ToolChoiceSchema,
	parallelToolCalls: z.boolean().optional(),
});
export type ThreadsCreateAndRunInput = z.infer<
	typeof ThreadsCreateAndRunInputSchema
>;
export const ThreadsCreateAndRunResponseSchema = RunObjectSchema;
export type ThreadsCreateAndRunResponse = z.infer<
	typeof ThreadsCreateAndRunResponseSchema
>;

export const RunsListInputSchema = z.object({
	threadId: z.string(),
	limit: z.number().optional(),
	order: z.enum(['asc', 'desc']).optional(),
	after: z.string().optional(),
	before: z.string().optional(),
});
export type RunsListInput = z.infer<typeof RunsListInputSchema>;
export const RunsListResponseSchema = z.object({
	object: z.literal('list'),
	data: z.array(RunObjectSchema),
	first_id: z.string().optional(),
	last_id: z.string().optional(),
	has_more: z.boolean(),
});
export type RunsListResponse = z.infer<typeof RunsListResponseSchema>;

export const RunsRetrieveInputSchema = z.object({
	threadId: z.string(),
	runId: z.string(),
});
export type RunsRetrieveInput = z.infer<typeof RunsRetrieveInputSchema>;
export const RunsRetrieveResponseSchema = RunObjectSchema;
export type RunsRetrieveResponse = z.infer<typeof RunsRetrieveResponseSchema>;

export const RunsModifyInputSchema = z.object({
	threadId: z.string(),
	runId: z.string(),
	metadata: MetadataSchema,
});
export type RunsModifyInput = z.infer<typeof RunsModifyInputSchema>;
export const RunsModifyResponseSchema = RunObjectSchema;
export type RunsModifyResponse = z.infer<typeof RunsModifyResponseSchema>;

export const RunsCancelInputSchema = z.object({
	threadId: z.string(),
	runId: z.string(),
});
export type RunsCancelInput = z.infer<typeof RunsCancelInputSchema>;
export const RunsCancelResponseSchema = RunObjectSchema;
export type RunsCancelResponse = z.infer<typeof RunsCancelResponseSchema>;

export const RunsSubmitToolOutputsInputSchema = z.object({
	threadId: z.string(),
	runId: z.string(),
	toolOutputs: z.array(
		z.object({
			toolCallId: z.string().optional(),
			output: z.string().optional(),
		}),
	),
});
export type RunsSubmitToolOutputsInput = z.infer<
	typeof RunsSubmitToolOutputsInputSchema
>;
export const RunsSubmitToolOutputsResponseSchema = RunObjectSchema;
export type RunsSubmitToolOutputsResponse = z.infer<
	typeof RunsSubmitToolOutputsResponseSchema
>;

// --- Run Steps ---

const RunStepObjectSchema = z.object({
	id: z.string(),
	object: z.literal('thread.run.step'),
	created_at: z.number(),
	run_id: z.string(),
	assistant_id: z.string(),
	thread_id: z.string(),
	type: z.enum(['message_creation', 'tool_calls']),
	status: z.enum([
		'in_progress',
		'cancelled',
		'failed',
		'completed',
		'expired',
	]),
	// step_details shape depends on the step type (message_creation vs tool_calls); kept loose rather than modeling both variants.
	step_details: z.record(z.string(), z.unknown()),
	last_error: z
		.object({ code: z.string(), message: z.string() })
		.nullable()
		.optional(),
	usage: z
		.object({
			prompt_tokens: z.number(),
			completion_tokens: z.number(),
			total_tokens: z.number(),
		})
		.nullable()
		.optional(),
});
export type RunStepObject = z.infer<typeof RunStepObjectSchema>;

export const RunStepsListInputSchema = z.object({
	threadId: z.string(),
	runId: z.string(),
	limit: z.number().optional(),
	order: z.enum(['asc', 'desc']).optional(),
	after: z.string().optional(),
	before: z.string().optional(),
});
export type RunStepsListInput = z.infer<typeof RunStepsListInputSchema>;
export const RunStepsListResponseSchema = z.object({
	object: z.literal('list'),
	data: z.array(RunStepObjectSchema),
	first_id: z.string().optional(),
	last_id: z.string().optional(),
	has_more: z.boolean(),
});
export type RunStepsListResponse = z.infer<typeof RunStepsListResponseSchema>;

export const RunStepsRetrieveInputSchema = z.object({
	threadId: z.string(),
	runId: z.string(),
	stepId: z.string(),
});
export type RunStepsRetrieveInput = z.infer<typeof RunStepsRetrieveInputSchema>;
export const RunStepsRetrieveResponseSchema = RunStepObjectSchema;
export type RunStepsRetrieveResponse = z.infer<
	typeof RunStepsRetrieveResponseSchema
>;
