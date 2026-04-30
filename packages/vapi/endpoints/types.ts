import { z } from 'zod';

// ── Shared sub-schemas ────────────────────────────────────────────────────────

const PaginationInputSchema = z.object({
	limit: z.number().optional(),
	createdAtGt: z.string().optional(),
	createdAtLt: z.string().optional(),
	createdAtGe: z.string().optional(),
	createdAtLe: z.string().optional(),
	updatedAtGt: z.string().optional(),
	updatedAtLt: z.string().optional(),
	updatedAtGe: z.string().optional(),
	updatedAtLe: z.string().optional(),
});

// ── Assistant schemas ─────────────────────────────────────────────────────────

const AssistantsListInputSchema = PaginationInputSchema;

const AssistantsCreateInputSchema = z.object({
	name: z.string().optional(),
	// model, voice, transcriber, and similar nested fields are opaque
	// provider-specific objects (e.g. OpenAI, ElevenLabs, Deepgram) whose
	// shapes vary by provider selection and cannot be statically typed without
	// re-implementing the full Vapi OpenAPI spec.
	model: z.record(z.unknown()).optional(),
	voice: z.record(z.unknown()).optional(),
	transcriber: z.record(z.unknown()).optional(),
	firstMessage: z.string().optional(),
	systemPrompt: z.string().optional(),
	endCallMessage: z.string().optional(),
	endCallPhrases: z.array(z.string()).optional(),
	metadata: z.record(z.unknown()).optional(),
	serverUrl: z.string().optional(),
	serverUrlSecret: z.string().optional(),
	analysisPlan: z.record(z.unknown()).optional(),
	artifactPlan: z.record(z.unknown()).optional(),
	messagePlan: z.record(z.unknown()).optional(),
	startSpeakingPlan: z.record(z.unknown()).optional(),
	stopSpeakingPlan: z.record(z.unknown()).optional(),
	hipaaEnabled: z.boolean().optional(),
	clientMessages: z.array(z.string()).optional(),
	serverMessages: z.array(z.string()).optional(),
	silenceTimeoutSeconds: z.number().optional(),
	maxDurationSeconds: z.number().optional(),
	backgroundSound: z.string().optional(),
	backchannelingEnabled: z.boolean().optional(),
	backgroundDenoisingEnabled: z.boolean().optional(),
	modelOutputInMessagesEnabled: z.boolean().optional(),
});

const AssistantsGetInputSchema = z.object({ id: z.string() });

const AssistantsUpdateInputSchema = AssistantsCreateInputSchema.extend({
	id: z.string(),
});

const AssistantsDeleteInputSchema = z.object({ id: z.string() });

const AssistantSchema = z
	.object({
		id: z.string(),
		orgId: z.string().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
		name: z.string().nullable().optional(),
		model: z.record(z.unknown()).optional(),
		voice: z.record(z.unknown()).optional(),
		transcriber: z.record(z.unknown()).optional(),
		firstMessage: z.string().nullable().optional(),
		systemPrompt: z.string().nullable().optional(),
		endCallMessage: z.string().nullable().optional(),
		endCallPhrases: z.array(z.string()).optional(),
		metadata: z.record(z.unknown()).optional(),
		serverUrl: z.string().nullable().optional(),
		hipaaEnabled: z.boolean().optional(),
	})
	.passthrough();

const AssistantsListResponseSchema = z.array(AssistantSchema);
const AssistantsDeleteResponseSchema = z
	.object({ id: z.string() })
	.passthrough();

// ── Call schemas ──────────────────────────────────────────────────────────────
// Nested fields (assistant, squad, phoneNumber, customer, artifact, analysis,
// messages, metadata) are opaque Vapi-defined objects that vary by provider
// and call type; z.record(z.unknown()) avoids duplicating the full upstream spec.

const CallsListInputSchema = PaginationInputSchema.extend({
	id: z.string().optional(),
	assistantId: z.string().optional(),
	phoneNumberId: z.string().optional(),
});

const CallsCreateInputSchema = z.object({
	assistantId: z.string().optional(),
	assistant: z.record(z.unknown()).optional(),
	assistantOverrides: z.record(z.unknown()).optional(),
	squadId: z.string().optional(),
	squad: z.record(z.unknown()).optional(),
	phoneNumberId: z.string().optional(),
	phoneNumber: z.record(z.unknown()).optional(),
	customerId: z.string().optional(),
	customer: z.record(z.unknown()).optional(),
	name: z.string().optional(),
	metadata: z.record(z.unknown()).optional(),
	scheduledAt: z.string().optional(),
});

const CallsGetInputSchema = z.object({ id: z.string() });

const CallsUpdateInputSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	assistantOverrides: z.record(z.unknown()).optional(),
	metadata: z.record(z.unknown()).optional(),
});

const CallsDeleteInputSchema = z.object({ id: z.string() });

const CallSchema = z
	.object({
		id: z.string(),
		orgId: z.string().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
		type: z.string().optional(),
		status: z.string().optional(),
		endedReason: z.string().nullable().optional(),
		assistantId: z.string().nullable().optional(),
		phoneNumberId: z.string().nullable().optional(),
		squadId: z.string().nullable().optional(),
		startedAt: z.string().nullable().optional(),
		endedAt: z.string().nullable().optional(),
		cost: z.number().optional(),
		messages: z.array(z.record(z.unknown())).optional(),
		artifact: z.record(z.unknown()).optional(),
		analysis: z.record(z.unknown()).optional(),
		metadata: z.record(z.unknown()).optional(),
	})
	.passthrough();

const CallsListResponseSchema = z.array(CallSchema);
const CallsDeleteResponseSchema = z.object({ id: z.string() }).passthrough();

// ── Phone Number schemas ──────────────────────────────────────────────────────

const PhoneNumbersListInputSchema = PaginationInputSchema;

const PhoneNumbersCreateInputSchema = z.object({
	provider: z.enum(['twilio', 'vonage', 'vapi', 'telnyx']).optional(),
	number: z.string().optional(),
	twilioAccountSid: z.string().optional(),
	twilioAuthToken: z.string().optional(),
	vonageApiKey: z.string().optional(),
	vonageApiSecret: z.string().optional(),
	name: z.string().optional(),
	assistantId: z.string().optional(),
	squadId: z.string().optional(),
	serverUrl: z.string().optional(),
	serverUrlSecret: z.string().optional(),
});

const PhoneNumbersGetInputSchema = z.object({ id: z.string() });

const PhoneNumbersUpdateInputSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	assistantId: z.string().optional(),
	squadId: z.string().optional(),
	serverUrl: z.string().optional(),
	serverUrlSecret: z.string().optional(),
});

const PhoneNumbersDeleteInputSchema = z.object({ id: z.string() });

const PhoneNumberSchema = z
	.object({
		id: z.string(),
		orgId: z.string().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
		provider: z.string().optional(),
		number: z.string().optional(),
		name: z.string().nullable().optional(),
		assistantId: z.string().nullable().optional(),
		squadId: z.string().nullable().optional(),
		serverUrl: z.string().nullable().optional(),
	})
	.passthrough();

const PhoneNumbersListResponseSchema = z.array(PhoneNumberSchema);
const PhoneNumbersDeleteResponseSchema = z
	.object({ id: z.string() })
	.passthrough();

// ── Squad schemas ─────────────────────────────────────────────────────────────
// members and membersOverrides are arrays/maps of assistant configurations with
// provider-specific shapes; z.record(z.unknown()) avoids duplicating upstream types.

const SquadsListInputSchema = PaginationInputSchema;

const SquadsCreateInputSchema = z.object({
	name: z.string().optional(),
	members: z.array(z.record(z.unknown())).optional(),
	membersOverrides: z.record(z.unknown()).optional(),
	metadata: z.record(z.unknown()).optional(),
});

const SquadsGetInputSchema = z.object({ id: z.string() });

const SquadsUpdateInputSchema = SquadsCreateInputSchema.extend({
	id: z.string(),
});

const SquadsDeleteInputSchema = z.object({ id: z.string() });

const SquadSchema = z
	.object({
		id: z.string(),
		orgId: z.string().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
		name: z.string().nullable().optional(),
		members: z.array(z.record(z.unknown())).optional(),
		metadata: z.record(z.unknown()).optional(),
	})
	.passthrough();

const SquadsListResponseSchema = z.array(SquadSchema);
const SquadsDeleteResponseSchema = z.object({ id: z.string() }).passthrough();

// ── Tool schemas ──────────────────────────────────────────────────────────────
// messages, function, and server are opaque Vapi-defined objects that vary by
// tool type and provider; z.record(z.unknown()) avoids duplicating upstream types.

const ToolsListInputSchema = PaginationInputSchema;

const ToolsCreateInputSchema = z.object({
	type: z.string().optional(),
	async: z.boolean().optional(),
	messages: z.array(z.record(z.unknown())).optional(),
	function: z.record(z.unknown()).optional(),
	server: z.record(z.unknown()).optional(),
	metadata: z.record(z.unknown()).optional(),
});

const ToolsGetInputSchema = z.object({ id: z.string() });

const ToolsUpdateInputSchema = ToolsCreateInputSchema.extend({
	id: z.string(),
});

const ToolsDeleteInputSchema = z.object({ id: z.string() });

const ToolSchema = z
	.object({
		id: z.string(),
		orgId: z.string().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
		type: z.string().optional(),
		function: z.record(z.unknown()).optional(),
		server: z.record(z.unknown()).optional(),
		metadata: z.record(z.unknown()).optional(),
	})
	.passthrough();

const ToolsListResponseSchema = z.array(ToolSchema);
const ToolsDeleteResponseSchema = z.object({ id: z.string() }).passthrough();

// ── File schemas ──────────────────────────────────────────────────────────────

const FilesListInputSchema = PaginationInputSchema;

const FilesGetInputSchema = z.object({ id: z.string() });

const FilesUpdateInputSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
});

const FilesDeleteInputSchema = z.object({ id: z.string() });

const FileSchema = z
	.object({
		id: z.string(),
		orgId: z.string().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
		name: z.string().optional(),
		originalName: z.string().optional(),
		mimeType: z.string().optional(),
		size: z.number().optional(),
		status: z.string().optional(),
		url: z.string().optional(),
		metadata: z.record(z.unknown()).optional(),
	})
	.passthrough();

const FilesListResponseSchema = z.array(FileSchema);
const FilesDeleteResponseSchema = z.object({ id: z.string() }).passthrough();

// ── Knowledge Base schemas ────────────────────────────────────────────────────

const KnowledgeBasesListInputSchema = PaginationInputSchema;

// Vapi knowledge bases use a provider discriminated union.
// "custom-knowledge-base" requires a server.url; "trieve" has its own config.
const KnowledgeBasesCreateInputSchema = z
	.object({
		provider: z.string(),
		server: z.object({ url: z.string() }).passthrough().optional(),
		name: z.string().optional(),
	})
	.passthrough();

const KnowledgeBasesGetInputSchema = z.object({ id: z.string() });

const KnowledgeBasesUpdateInputSchema = z
	.object({ id: z.string() })
	.passthrough();

const KnowledgeBasesDeleteInputSchema = z.object({ id: z.string() });

const KnowledgeBaseSchema = z
	.object({
		id: z.string(),
		orgId: z.string().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
		provider: z.string().optional(),
		name: z.string().nullable().optional(),
		server: z.record(z.unknown()).optional(),
	})
	.passthrough();

const KnowledgeBasesListResponseSchema = z.array(KnowledgeBaseSchema);
const KnowledgeBasesDeleteResponseSchema = z
	.object({ id: z.string() })
	.passthrough();

// ── Input type map ────────────────────────────────────────────────────────────

export type VapiEndpointInputs = {
	assistantsList: z.infer<typeof AssistantsListInputSchema>;
	assistantsCreate: z.infer<typeof AssistantsCreateInputSchema>;
	assistantsGet: z.infer<typeof AssistantsGetInputSchema>;
	assistantsUpdate: z.infer<typeof AssistantsUpdateInputSchema>;
	assistantsDelete: z.infer<typeof AssistantsDeleteInputSchema>;
	callsList: z.infer<typeof CallsListInputSchema>;
	callsCreate: z.infer<typeof CallsCreateInputSchema>;
	callsGet: z.infer<typeof CallsGetInputSchema>;
	callsUpdate: z.infer<typeof CallsUpdateInputSchema>;
	callsDelete: z.infer<typeof CallsDeleteInputSchema>;
	phoneNumbersList: z.infer<typeof PhoneNumbersListInputSchema>;
	phoneNumbersCreate: z.infer<typeof PhoneNumbersCreateInputSchema>;
	phoneNumbersGet: z.infer<typeof PhoneNumbersGetInputSchema>;
	phoneNumbersUpdate: z.infer<typeof PhoneNumbersUpdateInputSchema>;
	phoneNumbersDelete: z.infer<typeof PhoneNumbersDeleteInputSchema>;
	squadsList: z.infer<typeof SquadsListInputSchema>;
	squadsCreate: z.infer<typeof SquadsCreateInputSchema>;
	squadsGet: z.infer<typeof SquadsGetInputSchema>;
	squadsUpdate: z.infer<typeof SquadsUpdateInputSchema>;
	squadsDelete: z.infer<typeof SquadsDeleteInputSchema>;
	toolsList: z.infer<typeof ToolsListInputSchema>;
	toolsCreate: z.infer<typeof ToolsCreateInputSchema>;
	toolsGet: z.infer<typeof ToolsGetInputSchema>;
	toolsUpdate: z.infer<typeof ToolsUpdateInputSchema>;
	toolsDelete: z.infer<typeof ToolsDeleteInputSchema>;
	filesList: z.infer<typeof FilesListInputSchema>;
	filesGet: z.infer<typeof FilesGetInputSchema>;
	filesUpdate: z.infer<typeof FilesUpdateInputSchema>;
	filesDelete: z.infer<typeof FilesDeleteInputSchema>;
	knowledgeBasesList: z.infer<typeof KnowledgeBasesListInputSchema>;
	knowledgeBasesCreate: z.infer<typeof KnowledgeBasesCreateInputSchema>;
	knowledgeBasesGet: z.infer<typeof KnowledgeBasesGetInputSchema>;
	knowledgeBasesUpdate: z.infer<typeof KnowledgeBasesUpdateInputSchema>;
	knowledgeBasesDelete: z.infer<typeof KnowledgeBasesDeleteInputSchema>;
};

// ── Output type map ───────────────────────────────────────────────────────────

export type VapiEndpointOutputs = {
	assistantsList: z.infer<typeof AssistantsListResponseSchema>;
	assistantsCreate: z.infer<typeof AssistantSchema>;
	assistantsGet: z.infer<typeof AssistantSchema>;
	assistantsUpdate: z.infer<typeof AssistantSchema>;
	assistantsDelete: z.infer<typeof AssistantsDeleteResponseSchema>;
	callsList: z.infer<typeof CallsListResponseSchema>;
	callsCreate: z.infer<typeof CallSchema>;
	callsGet: z.infer<typeof CallSchema>;
	callsUpdate: z.infer<typeof CallSchema>;
	callsDelete: z.infer<typeof CallsDeleteResponseSchema>;
	phoneNumbersList: z.infer<typeof PhoneNumbersListResponseSchema>;
	phoneNumbersCreate: z.infer<typeof PhoneNumberSchema>;
	phoneNumbersGet: z.infer<typeof PhoneNumberSchema>;
	phoneNumbersUpdate: z.infer<typeof PhoneNumberSchema>;
	phoneNumbersDelete: z.infer<typeof PhoneNumbersDeleteResponseSchema>;
	squadsList: z.infer<typeof SquadsListResponseSchema>;
	squadsCreate: z.infer<typeof SquadSchema>;
	squadsGet: z.infer<typeof SquadSchema>;
	squadsUpdate: z.infer<typeof SquadSchema>;
	squadsDelete: z.infer<typeof SquadsDeleteResponseSchema>;
	toolsList: z.infer<typeof ToolsListResponseSchema>;
	toolsCreate: z.infer<typeof ToolSchema>;
	toolsGet: z.infer<typeof ToolSchema>;
	toolsUpdate: z.infer<typeof ToolSchema>;
	toolsDelete: z.infer<typeof ToolsDeleteResponseSchema>;
	filesList: z.infer<typeof FilesListResponseSchema>;
	filesGet: z.infer<typeof FileSchema>;
	filesUpdate: z.infer<typeof FileSchema>;
	filesDelete: z.infer<typeof FilesDeleteResponseSchema>;
	knowledgeBasesList: z.infer<typeof KnowledgeBasesListResponseSchema>;
	knowledgeBasesCreate: z.infer<typeof KnowledgeBaseSchema>;
	knowledgeBasesGet: z.infer<typeof KnowledgeBaseSchema>;
	knowledgeBasesUpdate: z.infer<typeof KnowledgeBaseSchema>;
	knowledgeBasesDelete: z.infer<typeof KnowledgeBasesDeleteResponseSchema>;
};

// ── Input schemas export ──────────────────────────────────────────────────────

export const VapiEndpointInputSchemas = {
	assistantsList: AssistantsListInputSchema,
	assistantsCreate: AssistantsCreateInputSchema,
	assistantsGet: AssistantsGetInputSchema,
	assistantsUpdate: AssistantsUpdateInputSchema,
	assistantsDelete: AssistantsDeleteInputSchema,
	callsList: CallsListInputSchema,
	callsCreate: CallsCreateInputSchema,
	callsGet: CallsGetInputSchema,
	callsUpdate: CallsUpdateInputSchema,
	callsDelete: CallsDeleteInputSchema,
	phoneNumbersList: PhoneNumbersListInputSchema,
	phoneNumbersCreate: PhoneNumbersCreateInputSchema,
	phoneNumbersGet: PhoneNumbersGetInputSchema,
	phoneNumbersUpdate: PhoneNumbersUpdateInputSchema,
	phoneNumbersDelete: PhoneNumbersDeleteInputSchema,
	squadsList: SquadsListInputSchema,
	squadsCreate: SquadsCreateInputSchema,
	squadsGet: SquadsGetInputSchema,
	squadsUpdate: SquadsUpdateInputSchema,
	squadsDelete: SquadsDeleteInputSchema,
	toolsList: ToolsListInputSchema,
	toolsCreate: ToolsCreateInputSchema,
	toolsGet: ToolsGetInputSchema,
	toolsUpdate: ToolsUpdateInputSchema,
	toolsDelete: ToolsDeleteInputSchema,
	filesList: FilesListInputSchema,
	filesGet: FilesGetInputSchema,
	filesUpdate: FilesUpdateInputSchema,
	filesDelete: FilesDeleteInputSchema,
	knowledgeBasesList: KnowledgeBasesListInputSchema,
	knowledgeBasesCreate: KnowledgeBasesCreateInputSchema,
	knowledgeBasesGet: KnowledgeBasesGetInputSchema,
	knowledgeBasesUpdate: KnowledgeBasesUpdateInputSchema,
	knowledgeBasesDelete: KnowledgeBasesDeleteInputSchema,
} as const;

// ── Output schemas export ─────────────────────────────────────────────────────

export const VapiEndpointOutputSchemas = {
	assistantsList: AssistantsListResponseSchema,
	assistantsCreate: AssistantSchema,
	assistantsGet: AssistantSchema,
	assistantsUpdate: AssistantSchema,
	assistantsDelete: AssistantsDeleteResponseSchema,
	callsList: CallsListResponseSchema,
	callsCreate: CallSchema,
	callsGet: CallSchema,
	callsUpdate: CallSchema,
	callsDelete: CallsDeleteResponseSchema,
	phoneNumbersList: PhoneNumbersListResponseSchema,
	phoneNumbersCreate: PhoneNumberSchema,
	phoneNumbersGet: PhoneNumberSchema,
	phoneNumbersUpdate: PhoneNumberSchema,
	phoneNumbersDelete: PhoneNumbersDeleteResponseSchema,
	squadsList: SquadsListResponseSchema,
	squadsCreate: SquadSchema,
	squadsGet: SquadSchema,
	squadsUpdate: SquadSchema,
	squadsDelete: SquadsDeleteResponseSchema,
	toolsList: ToolsListResponseSchema,
	toolsCreate: ToolSchema,
	toolsGet: ToolSchema,
	toolsUpdate: ToolSchema,
	toolsDelete: ToolsDeleteResponseSchema,
	filesList: FilesListResponseSchema,
	filesGet: FileSchema,
	filesUpdate: FileSchema,
	filesDelete: FilesDeleteResponseSchema,
	knowledgeBasesList: KnowledgeBasesListResponseSchema,
	knowledgeBasesCreate: KnowledgeBaseSchema,
	knowledgeBasesGet: KnowledgeBaseSchema,
	knowledgeBasesUpdate: KnowledgeBaseSchema,
	knowledgeBasesDelete: KnowledgeBasesDeleteResponseSchema,
} as const;

// ── Named input/output types ──────────────────────────────────────────────────

export type AssistantsListInput = VapiEndpointInputs['assistantsList'];
export type AssistantsListResponse = VapiEndpointOutputs['assistantsList'];
export type AssistantsCreateInput = VapiEndpointInputs['assistantsCreate'];
export type AssistantsCreateResponse = VapiEndpointOutputs['assistantsCreate'];
export type AssistantsGetInput = VapiEndpointInputs['assistantsGet'];
export type AssistantsGetResponse = VapiEndpointOutputs['assistantsGet'];
export type AssistantsUpdateInput = VapiEndpointInputs['assistantsUpdate'];
export type AssistantsUpdateResponse = VapiEndpointOutputs['assistantsUpdate'];
export type AssistantsDeleteInput = VapiEndpointInputs['assistantsDelete'];
export type AssistantsDeleteResponse = VapiEndpointOutputs['assistantsDelete'];

export type CallsListInput = VapiEndpointInputs['callsList'];
export type CallsListResponse = VapiEndpointOutputs['callsList'];
export type CallsCreateInput = VapiEndpointInputs['callsCreate'];
export type CallsCreateResponse = VapiEndpointOutputs['callsCreate'];
export type CallsGetInput = VapiEndpointInputs['callsGet'];
export type CallsGetResponse = VapiEndpointOutputs['callsGet'];
export type CallsUpdateInput = VapiEndpointInputs['callsUpdate'];
export type CallsUpdateResponse = VapiEndpointOutputs['callsUpdate'];
export type CallsDeleteInput = VapiEndpointInputs['callsDelete'];
export type CallsDeleteResponse = VapiEndpointOutputs['callsDelete'];

export type PhoneNumbersListInput = VapiEndpointInputs['phoneNumbersList'];
export type PhoneNumbersListResponse = VapiEndpointOutputs['phoneNumbersList'];
export type PhoneNumbersCreateInput = VapiEndpointInputs['phoneNumbersCreate'];
export type PhoneNumbersCreateResponse =
	VapiEndpointOutputs['phoneNumbersCreate'];
export type PhoneNumbersGetInput = VapiEndpointInputs['phoneNumbersGet'];
export type PhoneNumbersGetResponse = VapiEndpointOutputs['phoneNumbersGet'];
export type PhoneNumbersUpdateInput = VapiEndpointInputs['phoneNumbersUpdate'];
export type PhoneNumbersUpdateResponse =
	VapiEndpointOutputs['phoneNumbersUpdate'];
export type PhoneNumbersDeleteInput = VapiEndpointInputs['phoneNumbersDelete'];
export type PhoneNumbersDeleteResponse =
	VapiEndpointOutputs['phoneNumbersDelete'];

export type SquadsListInput = VapiEndpointInputs['squadsList'];
export type SquadsListResponse = VapiEndpointOutputs['squadsList'];
export type SquadsCreateInput = VapiEndpointInputs['squadsCreate'];
export type SquadsCreateResponse = VapiEndpointOutputs['squadsCreate'];
export type SquadsGetInput = VapiEndpointInputs['squadsGet'];
export type SquadsGetResponse = VapiEndpointOutputs['squadsGet'];
export type SquadsUpdateInput = VapiEndpointInputs['squadsUpdate'];
export type SquadsUpdateResponse = VapiEndpointOutputs['squadsUpdate'];
export type SquadsDeleteInput = VapiEndpointInputs['squadsDelete'];
export type SquadsDeleteResponse = VapiEndpointOutputs['squadsDelete'];

export type ToolsListInput = VapiEndpointInputs['toolsList'];
export type ToolsListResponse = VapiEndpointOutputs['toolsList'];
export type ToolsCreateInput = VapiEndpointInputs['toolsCreate'];
export type ToolsCreateResponse = VapiEndpointOutputs['toolsCreate'];
export type ToolsGetInput = VapiEndpointInputs['toolsGet'];
export type ToolsGetResponse = VapiEndpointOutputs['toolsGet'];
export type ToolsUpdateInput = VapiEndpointInputs['toolsUpdate'];
export type ToolsUpdateResponse = VapiEndpointOutputs['toolsUpdate'];
export type ToolsDeleteInput = VapiEndpointInputs['toolsDelete'];
export type ToolsDeleteResponse = VapiEndpointOutputs['toolsDelete'];

export type FilesListInput = VapiEndpointInputs['filesList'];
export type FilesListResponse = VapiEndpointOutputs['filesList'];
export type FilesGetInput = VapiEndpointInputs['filesGet'];
export type FilesGetResponse = VapiEndpointOutputs['filesGet'];
export type FilesUpdateInput = VapiEndpointInputs['filesUpdate'];
export type FilesUpdateResponse = VapiEndpointOutputs['filesUpdate'];
export type FilesDeleteInput = VapiEndpointInputs['filesDelete'];
export type FilesDeleteResponse = VapiEndpointOutputs['filesDelete'];

export type KnowledgeBasesListInput = VapiEndpointInputs['knowledgeBasesList'];
export type KnowledgeBasesListResponse =
	VapiEndpointOutputs['knowledgeBasesList'];
export type KnowledgeBasesCreateInput =
	VapiEndpointInputs['knowledgeBasesCreate'];
export type KnowledgeBasesCreateResponse =
	VapiEndpointOutputs['knowledgeBasesCreate'];
export type KnowledgeBasesGetInput = VapiEndpointInputs['knowledgeBasesGet'];
export type KnowledgeBasesGetResponse =
	VapiEndpointOutputs['knowledgeBasesGet'];
export type KnowledgeBasesUpdateInput =
	VapiEndpointInputs['knowledgeBasesUpdate'];
export type KnowledgeBasesUpdateResponse =
	VapiEndpointOutputs['knowledgeBasesUpdate'];
export type KnowledgeBasesDeleteInput =
	VapiEndpointInputs['knowledgeBasesDelete'];
export type KnowledgeBasesDeleteResponse =
	VapiEndpointOutputs['knowledgeBasesDelete'];
