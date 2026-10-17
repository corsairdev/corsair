import { z } from 'zod';

// Retell adds provider-specific fields to analysis, metadata, and tool-call
// objects over time. Validate these containers while preserving their shape.
const OpaqueObjectSchema = z.record(z.string(), z.unknown());

const TranscriptUtteranceSchema = z
	.object({
		role: z.string().optional(),
		content: z.string().optional(),
		start: z.number().optional(),
		end: z.number().optional(),
	})
	.loose();

const CallSummarySchema = z
	.object({
		call_id: z.string(),
		call_type: z.string().optional(),
		agent_id: z.string().optional(),
		call_status: z.string().optional(),
		start_timestamp: z.number().optional(),
		end_timestamp: z.number().optional(),
		direction: z.string().optional(),
		from_number: z.string().optional(),
		to_number: z.string().optional(),
		disconnection_reason: z.string().optional(),
		metadata: OpaqueObjectSchema.optional(),
	})
	.loose();

const CallDetailSchema = CallSummarySchema.extend({
	transcript: z.string().optional(),
	transcript_object: z.array(TranscriptUtteranceSchema).optional(),
	transcript_with_tool_calls: z.array(OpaqueObjectSchema).optional(),
	scrubbed_transcript_with_tool_calls: z.array(OpaqueObjectSchema).optional(),
	recording_url: z.string().optional(),
	call_analysis: OpaqueObjectSchema.optional(),
	retell_llm_dynamic_variables: OpaqueObjectSchema.optional(),
}).loose();

const ChatSummarySchema = z
	.object({
		chat_id: z.string(),
		agent_id: z.string().optional(),
		chat_status: z.string().optional(),
		start_timestamp: z.number().optional(),
		end_timestamp: z.number().optional(),
		metadata: OpaqueObjectSchema.optional(),
	})
	.loose();

const ChatDetailSchema = ChatSummarySchema.extend({
	transcript: z.string().optional(),
	transcript_with_tool_calls: z.array(OpaqueObjectSchema).optional(),
	chat_analysis: OpaqueObjectSchema.optional(),
}).loose();

const PaginationResponse = <T extends z.ZodType>(item: T) =>
	z
		.object({
			items: z.array(item),
			pagination_key: z.string().nullable().optional(),
			has_more: z.boolean().optional(),
			total_count: z.number().optional(),
		})
		.loose();

const FilterSchema = OpaqueObjectSchema;
const ListInputSchema = z.object({
	filterCriteria: FilterSchema.optional(),
	limit: z.number().int().min(1).max(100).optional(),
	paginationKey: z.string().optional(),
	sortOrder: z.enum(['ascending', 'descending']).optional(),
	enableTotal: z.boolean().optional(),
});

const GetInputSchema = z.object({ id: z.string().min(1) });

export const RetellEndpointInputSchemas = {
	callsList: ListInputSchema,
	callsGet: GetInputSchema,
	chatsList: ListInputSchema,
	chatsGet: GetInputSchema,
} as const;

export const RetellEndpointOutputSchemas = {
	callsList: PaginationResponse(CallSummarySchema),
	callsGet: CallDetailSchema,
	chatsList: PaginationResponse(ChatSummarySchema),
	chatsGet: ChatDetailSchema,
} as const;

export type RetellEndpointInputs = {
	callsList: z.infer<typeof ListInputSchema>;
	callsGet: z.infer<typeof GetInputSchema>;
	chatsList: z.infer<typeof ListInputSchema>;
	chatsGet: z.infer<typeof GetInputSchema>;
};

export type RetellEndpointOutputs = {
	callsList: z.infer<typeof RetellEndpointOutputSchemas.callsList>;
	callsGet: z.infer<typeof RetellEndpointOutputSchemas.callsGet>;
	chatsList: z.infer<typeof RetellEndpointOutputSchemas.chatsList>;
	chatsGet: z.infer<typeof RetellEndpointOutputSchemas.chatsGet>;
};

export type RetellCall = z.infer<typeof CallDetailSchema>;
export type RetellChat = z.infer<typeof ChatDetailSchema>;
