import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Input Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const AssistantsCreateInputSchema = z
	.object({
		type: z.enum(['outbound', 'inbound', 'widget']),
		name: z.string(),
		agent: z
			.object({
				prompt: z.string(),
				greeting_message: z.string(),
				llm: z.string(),
				language: z.string(),
				voice_id: z.string(),
			})
			.passthrough(),
		description: z.string().optional(),
		phone_number: z.string().optional(),
		external_webhook_url: z.string().optional(),
		is_recording: z.boolean().optional(),
	})
	.passthrough();

export const AssistantsListInputSchema = z
	.object({
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.optional();

export const AssistantsGetInputSchema = z
	.object({
		model_id: z.string().optional(),
		assistant_id: z.string().optional(),
	})
	.passthrough()
	.refine((v) => Boolean(v.model_id || v.assistant_id), {
		message: 'model_id is required',
	});

export const AssistantsUpdateInputSchema = z
	.object({
		model_id: z.string().optional(),
		assistant_id: z.string().optional(),
		name: z.string().optional(),
		type: z.enum(['outbound', 'inbound', 'widget']).optional(),
		description: z.string().optional(),
		phone_number: z.string().optional(),
		external_webhook_url: z.string().optional(),
		is_recording: z.boolean().optional(),
		agent: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough()
	.refine((v) => Boolean(v.model_id || v.assistant_id), {
		message: 'model_id is required',
	});

export const AssistantsDeleteInputSchema = z
	.object({
		model_id: z.string().optional(),
		assistant_id: z.string().optional(),
	})
	.passthrough()
	.refine((v) => Boolean(v.model_id || v.assistant_id), {
		message: 'model_id is required',
	});

export const CallsCreateInputSchema = z
	.object({
		model_id: z.string(),
		phone: z.string(),
		name: z.string(),
		from_phone_number: z.string().optional(),
		custom_variables: z
			.union([
				z.array(
					z.object({
						key: z.string(),
						value: z.string(),
					}),
				),
				z.record(z.string(), z.unknown()),
			])
			.optional(),
		lead_email: z.string().optional(),
		lead_timezone: z.string().optional(),
		prompt: z.string().optional(),
		greeting: z.string().optional(),
	})
	.passthrough();

export const CallsListInputSchema = z
	.object({
		model_id: z.string(),
		limit: z.number().optional(),
		offset: z.number().optional(),
		from_date: z.number().optional(),
		to_date: z.number().optional(),
		call_status: z.string().optional(),
		duration_min: z.number().optional(),
		duration_max: z.number().optional(),
		lead_phone_number: z.string().optional(),
	})
	.passthrough();

export const CallsGetInputSchema = z
	.object({
		call_id: z.string(),
	})
	.passthrough();

export const ContactsCreateInputSchema = z
	.object({
		name: z.string(),
		phone_number: z.string(),
		email: z.string().optional(),
		company: z.string().optional(),
		contact_metadata: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();

export const ContactsListInputSchema = z
	.object({
		limit: z.number().optional(),
		offset: z.number().optional(),
		search: z.string().optional(),
	})
	.optional();

export const ContactsGetInputSchema = z
	.object({
		contact_id: z.string(),
	})
	.passthrough();

export const ContactsUpdateInputSchema = z
	.object({
		contact_id: z.string(),
		name: z.string().optional(),
		phone_number: z.string().optional(),
		email: z.string().optional(),
		contact_metadata: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();

export const ContactsDeleteInputSchema = z
	.object({
		contact_id: z.string(),
	})
	.passthrough();

export const KnowledgeBasesCreateInputSchema = z
	.object({
		name: z.string().optional(),
		rag_use_condition: z.string().optional(),
	})
	.passthrough();

export const KnowledgeBasesGetInputSchema = z
	.object({
		knowledge_base_id: z.string(),
	})
	.passthrough();

export const KnowledgeBasesUpdateInputSchema = z
	.object({
		knowledge_base_id: z.string(),
		name: z.string().optional(),
		rag_use_condition: z.string().optional(),
	})
	.passthrough();

export const KnowledgeBasesDeleteInputSchema = z
	.object({
		knowledge_base_id: z.string(),
	})
	.passthrough();

export const KnowledgeBasesAttachInputSchema = z
	.object({
		knowledge_base_id: z.string(),
		model_id: z.string(),
	})
	.passthrough();

export const KnowledgeBasesDetachInputSchema = z
	.object({
		knowledge_base_id: z.string(),
		model_id: z.string(),
	})
	.passthrough();

export const MemoryStoresCreateInputSchema = z
	.object({
		title: z.string(),
		description: z.string().optional(),
	})
	.passthrough();

export const MemoryStoresGetInputSchema = z
	.object({
		memory_store_id: z.string(),
	})
	.passthrough();

export const MemoryStoresListInputSchema = z
	.object({
		title: z.string().optional(),
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.optional();

export const MemoryStoresUpdateInputSchema = z
	.object({
		memory_store_id: z.string(),
		title: z.string().optional(),
		description: z.string().optional(),
	})
	.passthrough();

export const MemoryStoresDeleteInputSchema = z
	.object({
		memory_store_id: z.string(),
	})
	.passthrough();

export const MemoryStoresAttachToAgentInputSchema = z
	.object({
		memory_store_id: z.string(),
		model_id: z.string(),
	})
	.passthrough();

export const MemoryStoresDetachFromAgentInputSchema = z
	.object({
		memory_store_id: z.string(),
		model_id: z.string(),
	})
	.passthrough();

export const PhoneBooksCreateInputSchema = z
	.object({
		name: z.string(),
	})
	.passthrough();

export const PhoneBooksListInputSchema = z
	.object({
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.optional();

export const PhoneBooksDeleteInputSchema = z
	.object({
		phone_book_id: z.string(),
	})
	.passthrough();

const ActionTypeBodySchema = z.record(z.string(), z.unknown());

export const ActionsCreateInputSchema = z
	.object({
		REAL_TIME_BOOKING: ActionTypeBodySchema.optional(),
		CALCOM: ActionTypeBodySchema.optional(),
		GHL: ActionTypeBodySchema.optional(),
		INFORMATION_EXTRACTOR: ActionTypeBodySchema.optional(),
		LIVE_TRANSFER: ActionTypeBodySchema.optional(),
		SEND_SMS: ActionTypeBodySchema.optional(),
		INCALL_SMS: ActionTypeBodySchema.optional(),
		INCALL_WHATSAPP: ActionTypeBodySchema.optional(),
		CUSTOM_ACTION: ActionTypeBodySchema.optional(),
		CUSTOM_EVAL: ActionTypeBodySchema.optional(),
	})
	.passthrough();

export const ActionsListInputSchema = z
	.object({
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.optional();

export const ActionsGetInputSchema = z
	.object({
		action_id: z.string(),
	})
	.passthrough();

export const ActionsUpdateInputSchema = z
	.object({
		action_id: z.string(),
		REAL_TIME_BOOKING: ActionTypeBodySchema.optional(),
		CALCOM: ActionTypeBodySchema.optional(),
		GHL: ActionTypeBodySchema.optional(),
		INFORMATION_EXTRACTOR: ActionTypeBodySchema.optional(),
		LIVE_TRANSFER: ActionTypeBodySchema.optional(),
		SEND_SMS: ActionTypeBodySchema.optional(),
		INCALL_SMS: ActionTypeBodySchema.optional(),
		INCALL_WHATSAPP: ActionTypeBodySchema.optional(),
		CUSTOM_ACTION: ActionTypeBodySchema.optional(),
		CUSTOM_EVAL: ActionTypeBodySchema.optional(),
	})
	.passthrough();

export const ActionsDeleteInputSchema = z
	.object({
		action_id: z.string(),
	})
	.passthrough();

export const ActionsAttachInputSchema = z
	.object({
		model_id: z.string(),
		actions: z.array(z.string()).optional(),
		action_ids: z.array(z.string()).optional(),
		items: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();

export const ActionsDetachInputSchema = z
	.object({
		model_id: z.string(),
		actions: z.array(z.string()).optional(),
		action_ids: z.array(z.string()).optional(),
	})
	.passthrough();

export const VoicesListInputSchema = z
	.object({
		workspace: z.string(),
		limit: z.number().int().optional(),
		offset: z.number().int().optional(),
		search: z.string().optional(),
		provider: z.enum(['elevenlabs', 'deepgram', 'synthflow']).optional(),
	})
	.passthrough();

export const SynthflowAiEndpointInputSchemas = {
	assistantsCreate: AssistantsCreateInputSchema,
	assistantsList: AssistantsListInputSchema,
	assistantsGet: AssistantsGetInputSchema,
	assistantsUpdate: AssistantsUpdateInputSchema,
	assistantsDelete: AssistantsDeleteInputSchema,
	callsCreate: CallsCreateInputSchema,
	callsList: CallsListInputSchema,
	callsGet: CallsGetInputSchema,
	contactsCreate: ContactsCreateInputSchema,
	contactsList: ContactsListInputSchema,
	contactsGet: ContactsGetInputSchema,
	contactsUpdate: ContactsUpdateInputSchema,
	contactsDelete: ContactsDeleteInputSchema,
	knowledgeBasesCreate: KnowledgeBasesCreateInputSchema,
	knowledgeBasesGet: KnowledgeBasesGetInputSchema,
	knowledgeBasesUpdate: KnowledgeBasesUpdateInputSchema,
	knowledgeBasesDelete: KnowledgeBasesDeleteInputSchema,
	knowledgeBasesAttach: KnowledgeBasesAttachInputSchema,
	knowledgeBasesDetach: KnowledgeBasesDetachInputSchema,
	memoryStoresCreate: MemoryStoresCreateInputSchema,
	memoryStoresGet: MemoryStoresGetInputSchema,
	memoryStoresList: MemoryStoresListInputSchema,
	memoryStoresUpdate: MemoryStoresUpdateInputSchema,
	memoryStoresDelete: MemoryStoresDeleteInputSchema,
	memoryStoresAttachToAgent: MemoryStoresAttachToAgentInputSchema,
	memoryStoresDetachFromAgent: MemoryStoresDetachFromAgentInputSchema,
	phoneBooksCreate: PhoneBooksCreateInputSchema,
	phoneBooksList: PhoneBooksListInputSchema,
	phoneBooksDelete: PhoneBooksDeleteInputSchema,
	actionsCreate: ActionsCreateInputSchema,
	actionsList: ActionsListInputSchema,
	actionsGet: ActionsGetInputSchema,
	actionsUpdate: ActionsUpdateInputSchema,
	actionsDelete: ActionsDeleteInputSchema,
	actionsAttach: ActionsAttachInputSchema,
	actionsDetach: ActionsDetachInputSchema,
	voicesList: VoicesListInputSchema,
} as const;

export type SynthflowAiEndpointInputs = {
	[K in keyof typeof SynthflowAiEndpointInputSchemas]: z.infer<
		(typeof SynthflowAiEndpointInputSchemas)[K]
	>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Output Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const GenericSuccessResponseSchema = z
	.object({
		status: z.string().optional(),
		response: z.unknown().optional(),
	})
	.passthrough();

export const AssistantsCreateResponseSchema = z
	.object({
		status: z.string().optional(),
		response: z
			.object({
				model_id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		details: z
			.object({
				phone: z.string().optional(),
				voice: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

export const AssistantsListResponseSchema = z
	.object({
		status: z.string().optional(),
		response: z
			.object({
				pagination: z
					.object({
						total_records: z.number().optional(),
						limit: z.number().optional(),
						offset: z.number().optional(),
					})
					.passthrough()
					.optional(),
				assistants: z
					.union([
						z.array(z.record(z.string(), z.unknown())),
						z.record(z.string(), z.unknown()),
					])
					.optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

export const AssistantsGetResponseSchema = GenericSuccessResponseSchema;
export const AssistantsUpdateResponseSchema = GenericSuccessResponseSchema;
export const AssistantsDeleteResponseSchema = GenericSuccessResponseSchema;

export const CallsCreateResponseSchema = z
	.object({
		status: z.string().optional(),
		response: z
			.object({
				answer: z.string().optional(),
				call_id: z.string().optional(),
			})
			.passthrough()
			.optional(),
		eta: z.number().int().optional(),
	})
	.passthrough();

export const CallsListResponseSchema = z
	.object({
		status: z.string().optional(),
		response: z
			.object({
				pagination: z.record(z.string(), z.unknown()).optional(),
				calls: z.array(z.record(z.string(), z.unknown())).optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

export const CallsGetResponseSchema = GenericSuccessResponseSchema;

export const ContactsCreateResponseSchema = z
	.object({
		status: z.string().optional(),
		response: z
			.object({
				id: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

export const ContactsListResponseSchema = z
	.object({
		status: z.string().optional(),
		response: z
			.object({
				pagination: z.record(z.string(), z.unknown()).optional(),
				contacts: z.array(z.record(z.string(), z.unknown())).optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

export const ContactsGetResponseSchema = GenericSuccessResponseSchema;
export const ContactsUpdateResponseSchema = GenericSuccessResponseSchema;
export const ContactsDeleteResponseSchema = GenericSuccessResponseSchema;

export const KnowledgeBasesCreateResponseSchema = z
	.object({
		status: z.string().optional(),
		response: z
			.object({
				body: z.string().optional(),
				knowledge_base_id: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

export const KnowledgeBasesGetResponseSchema = GenericSuccessResponseSchema;
export const KnowledgeBasesUpdateResponseSchema = GenericSuccessResponseSchema;
export const KnowledgeBasesDeleteResponseSchema = GenericSuccessResponseSchema;

export const KnowledgeBasesAttachResponseSchema = z
	.object({
		status: z.string().optional(),
		response: z
			.object({
				body: z.unknown().optional(),
				knowledge_base_id: z.string().optional(),
				model_id: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

export const KnowledgeBasesDetachResponseSchema = GenericSuccessResponseSchema;

export const MemoryStoresCreateResponseSchema = z
	.object({
		status: z.string().optional(),
		response: z
			.object({
				id: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

export const MemoryStoresGetResponseSchema = GenericSuccessResponseSchema;
export const MemoryStoresListResponseSchema = GenericSuccessResponseSchema;
export const MemoryStoresUpdateResponseSchema = GenericSuccessResponseSchema;
export const MemoryStoresDeleteResponseSchema = GenericSuccessResponseSchema;
export const MemoryStoresAttachToAgentResponseSchema =
	GenericSuccessResponseSchema;
export const MemoryStoresDetachFromAgentResponseSchema =
	GenericSuccessResponseSchema;

export const PhoneBooksCreateResponseSchema = GenericSuccessResponseSchema;
export const PhoneBooksListResponseSchema = GenericSuccessResponseSchema;
export const PhoneBooksDeleteResponseSchema = GenericSuccessResponseSchema;

export const ActionsCreateResponseSchema = GenericSuccessResponseSchema;
export const ActionsListResponseSchema = GenericSuccessResponseSchema;
export const ActionsGetResponseSchema = GenericSuccessResponseSchema;
export const ActionsUpdateResponseSchema = GenericSuccessResponseSchema;
export const ActionsDeleteResponseSchema = GenericSuccessResponseSchema;
export const ActionsAttachResponseSchema = GenericSuccessResponseSchema;
export const ActionsDetachResponseSchema = GenericSuccessResponseSchema;

export const VoicesListResponseSchema = GenericSuccessResponseSchema;

export const SynthflowAiEndpointOutputSchemas = {
	assistantsCreate: AssistantsCreateResponseSchema,
	assistantsList: AssistantsListResponseSchema,
	assistantsGet: AssistantsGetResponseSchema,
	assistantsUpdate: AssistantsUpdateResponseSchema,
	assistantsDelete: AssistantsDeleteResponseSchema,
	callsCreate: CallsCreateResponseSchema,
	callsList: CallsListResponseSchema,
	callsGet: CallsGetResponseSchema,
	contactsCreate: ContactsCreateResponseSchema,
	contactsList: ContactsListResponseSchema,
	contactsGet: ContactsGetResponseSchema,
	contactsUpdate: ContactsUpdateResponseSchema,
	contactsDelete: ContactsDeleteResponseSchema,
	knowledgeBasesCreate: KnowledgeBasesCreateResponseSchema,
	knowledgeBasesGet: KnowledgeBasesGetResponseSchema,
	knowledgeBasesUpdate: KnowledgeBasesUpdateResponseSchema,
	knowledgeBasesDelete: KnowledgeBasesDeleteResponseSchema,
	knowledgeBasesAttach: KnowledgeBasesAttachResponseSchema,
	knowledgeBasesDetach: KnowledgeBasesDetachResponseSchema,
	memoryStoresCreate: MemoryStoresCreateResponseSchema,
	memoryStoresGet: MemoryStoresGetResponseSchema,
	memoryStoresList: MemoryStoresListResponseSchema,
	memoryStoresUpdate: MemoryStoresUpdateResponseSchema,
	memoryStoresDelete: MemoryStoresDeleteResponseSchema,
	memoryStoresAttachToAgent: MemoryStoresAttachToAgentResponseSchema,
	memoryStoresDetachFromAgent: MemoryStoresDetachFromAgentResponseSchema,
	phoneBooksCreate: PhoneBooksCreateResponseSchema,
	phoneBooksList: PhoneBooksListResponseSchema,
	phoneBooksDelete: PhoneBooksDeleteResponseSchema,
	actionsCreate: ActionsCreateResponseSchema,
	actionsList: ActionsListResponseSchema,
	actionsGet: ActionsGetResponseSchema,
	actionsUpdate: ActionsUpdateResponseSchema,
	actionsDelete: ActionsDeleteResponseSchema,
	actionsAttach: ActionsAttachResponseSchema,
	actionsDetach: ActionsDetachResponseSchema,
	voicesList: VoicesListResponseSchema,
} as const;

export type SynthflowAiEndpointOutputs = {
	[K in keyof typeof SynthflowAiEndpointOutputSchemas]: z.infer<
		(typeof SynthflowAiEndpointOutputSchemas)[K]
	>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Type Aliases
// ─────────────────────────────────────────────────────────────────────────────

export type AssistantsCreateInput = z.infer<typeof AssistantsCreateInputSchema>;
export type AssistantsCreateResponse = z.infer<
	typeof AssistantsCreateResponseSchema
>;
export type AssistantsListInput = z.infer<typeof AssistantsListInputSchema>;
export type AssistantsListResponse = z.infer<
	typeof AssistantsListResponseSchema
>;
export type AssistantsGetInput = z.infer<typeof AssistantsGetInputSchema>;
export type AssistantsGetResponse = z.infer<typeof AssistantsGetResponseSchema>;
export type AssistantsUpdateInput = z.infer<typeof AssistantsUpdateInputSchema>;
export type AssistantsUpdateResponse = z.infer<
	typeof AssistantsUpdateResponseSchema
>;
export type AssistantsDeleteInput = z.infer<typeof AssistantsDeleteInputSchema>;
export type AssistantsDeleteResponse = z.infer<
	typeof AssistantsDeleteResponseSchema
>;

export type CallsCreateInput = z.infer<typeof CallsCreateInputSchema>;
export type CallsCreateResponse = z.infer<typeof CallsCreateResponseSchema>;
export type CallsListInput = z.infer<typeof CallsListInputSchema>;
export type CallsListResponse = z.infer<typeof CallsListResponseSchema>;
export type CallsGetInput = z.infer<typeof CallsGetInputSchema>;
export type CallsGetResponse = z.infer<typeof CallsGetResponseSchema>;

export type ContactsCreateInput = z.infer<typeof ContactsCreateInputSchema>;
export type ContactsCreateResponse = z.infer<
	typeof ContactsCreateResponseSchema
>;
export type ContactsListInput = z.infer<typeof ContactsListInputSchema>;
export type ContactsListResponse = z.infer<typeof ContactsListResponseSchema>;
export type ContactsGetInput = z.infer<typeof ContactsGetInputSchema>;
export type ContactsGetResponse = z.infer<typeof ContactsGetResponseSchema>;
export type ContactsUpdateInput = z.infer<typeof ContactsUpdateInputSchema>;
export type ContactsUpdateResponse = z.infer<
	typeof ContactsUpdateResponseSchema
>;
export type ContactsDeleteInput = z.infer<typeof ContactsDeleteInputSchema>;
export type ContactsDeleteResponse = z.infer<
	typeof ContactsDeleteResponseSchema
>;

export type KnowledgeBasesCreateInput = z.infer<
	typeof KnowledgeBasesCreateInputSchema
>;
export type KnowledgeBasesCreateResponse = z.infer<
	typeof KnowledgeBasesCreateResponseSchema
>;
export type KnowledgeBasesGetInput = z.infer<
	typeof KnowledgeBasesGetInputSchema
>;
export type KnowledgeBasesGetResponse = z.infer<
	typeof KnowledgeBasesGetResponseSchema
>;
export type KnowledgeBasesUpdateInput = z.infer<
	typeof KnowledgeBasesUpdateInputSchema
>;
export type KnowledgeBasesUpdateResponse = z.infer<
	typeof KnowledgeBasesUpdateResponseSchema
>;
export type KnowledgeBasesDeleteInput = z.infer<
	typeof KnowledgeBasesDeleteInputSchema
>;
export type KnowledgeBasesDeleteResponse = z.infer<
	typeof KnowledgeBasesDeleteResponseSchema
>;
export type KnowledgeBasesAttachInput = z.infer<
	typeof KnowledgeBasesAttachInputSchema
>;
export type KnowledgeBasesAttachResponse = z.infer<
	typeof KnowledgeBasesAttachResponseSchema
>;
export type KnowledgeBasesDetachInput = z.infer<
	typeof KnowledgeBasesDetachInputSchema
>;
export type KnowledgeBasesDetachResponse = z.infer<
	typeof KnowledgeBasesDetachResponseSchema
>;

export type MemoryStoresCreateInput = z.infer<
	typeof MemoryStoresCreateInputSchema
>;
export type MemoryStoresCreateResponse = z.infer<
	typeof MemoryStoresCreateResponseSchema
>;
export type MemoryStoresGetInput = z.infer<typeof MemoryStoresGetInputSchema>;
export type MemoryStoresGetResponse = z.infer<
	typeof MemoryStoresGetResponseSchema
>;
export type MemoryStoresListInput = z.infer<typeof MemoryStoresListInputSchema>;
export type MemoryStoresListResponse = z.infer<
	typeof MemoryStoresListResponseSchema
>;
export type MemoryStoresUpdateInput = z.infer<
	typeof MemoryStoresUpdateInputSchema
>;
export type MemoryStoresUpdateResponse = z.infer<
	typeof MemoryStoresUpdateResponseSchema
>;
export type MemoryStoresDeleteInput = z.infer<
	typeof MemoryStoresDeleteInputSchema
>;
export type MemoryStoresDeleteResponse = z.infer<
	typeof MemoryStoresDeleteResponseSchema
>;
export type MemoryStoresAttachToAgentInput = z.infer<
	typeof MemoryStoresAttachToAgentInputSchema
>;
export type MemoryStoresAttachToAgentResponse = z.infer<
	typeof MemoryStoresAttachToAgentResponseSchema
>;
export type MemoryStoresDetachFromAgentInput = z.infer<
	typeof MemoryStoresDetachFromAgentInputSchema
>;
export type MemoryStoresDetachFromAgentResponse = z.infer<
	typeof MemoryStoresDetachFromAgentResponseSchema
>;

export type PhoneBooksCreateInput = z.infer<typeof PhoneBooksCreateInputSchema>;
export type PhoneBooksCreateResponse = z.infer<
	typeof PhoneBooksCreateResponseSchema
>;
export type PhoneBooksListInput = z.infer<typeof PhoneBooksListInputSchema>;
export type PhoneBooksListResponse = z.infer<
	typeof PhoneBooksListResponseSchema
>;
export type PhoneBooksDeleteInput = z.infer<typeof PhoneBooksDeleteInputSchema>;
export type PhoneBooksDeleteResponse = z.infer<
	typeof PhoneBooksDeleteResponseSchema
>;

export type ActionsCreateInput = z.infer<typeof ActionsCreateInputSchema>;
export type ActionsCreateResponse = z.infer<typeof ActionsCreateResponseSchema>;
export type ActionsListInput = z.infer<typeof ActionsListInputSchema>;
export type ActionsListResponse = z.infer<typeof ActionsListResponseSchema>;
export type ActionsGetInput = z.infer<typeof ActionsGetInputSchema>;
export type ActionsGetResponse = z.infer<typeof ActionsGetResponseSchema>;
export type ActionsUpdateInput = z.infer<typeof ActionsUpdateInputSchema>;
export type ActionsUpdateResponse = z.infer<typeof ActionsUpdateResponseSchema>;
export type ActionsDeleteInput = z.infer<typeof ActionsDeleteInputSchema>;
export type ActionsDeleteResponse = z.infer<typeof ActionsDeleteResponseSchema>;
export type ActionsAttachInput = z.infer<typeof ActionsAttachInputSchema>;
export type ActionsAttachResponse = z.infer<typeof ActionsAttachResponseSchema>;
export type ActionsDetachInput = z.infer<typeof ActionsDetachInputSchema>;
export type ActionsDetachResponse = z.infer<typeof ActionsDetachResponseSchema>;

export type VoicesListInput = z.infer<typeof VoicesListInputSchema>;
export type VoicesListResponse = z.infer<typeof VoicesListResponseSchema>;
