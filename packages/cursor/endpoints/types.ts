import { z } from 'zod';

// ── Shared Sub-schemas ───────────────────────────────────────────────────────

const ConversationMessageSchema = z
	.object({
		id: z.string().optional(),
		text: z.string().optional(),
		type: z.enum(['user_message', 'assistant_message']).optional(),
	})
	.passthrough();

const AgentSourceSchema = z
	.object({
		ref: z.string().optional(),
		repository: z.string().optional(),
	})
	.passthrough();

const AgentTargetSchema = z
	.object({
		url: z.string().optional(),
		prUrl: z.string().optional(),
		branchName: z.string().optional(),
		autoCreatePr: z.boolean().optional(),
		skipReviewerRequest: z.boolean().optional(),
		openAsCursorGithubApp: z.boolean().optional(),
	})
	.passthrough();

const AgentSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		source: AgentSourceSchema.optional(),
		status: z
			.enum(['RUNNING', 'FINISHED', 'ERROR', 'CREATING', 'EXPIRED'])
			.optional(),
		target: AgentTargetSchema.optional(),
		summary: z.string().optional(),
		createdAt: z.string().optional(),
	})
	.passthrough();

const RepositorySchema = z
	.object({
		name: z.string().optional(),
		owner: z.string().optional(),
		repository: z.string().optional(),
	})
	.passthrough();

// ── Input Schemas ────────────────────────────────────────────────────────────

const AgentsListInputSchema = z.object({
	limit: z.number().int().min(1).max(100).optional(),
	cursor: z.string().optional(),
});

export type AgentsListInput = z.infer<typeof AgentsListInputSchema>;

const AgentsGetConversationInputSchema = z.object({
	id: z.string(),
});

export type AgentsGetConversationInput = z.infer<
	typeof AgentsGetConversationInputSchema
>;

const AccountGetMeInputSchema = z.object({});

export type AccountGetMeInput = z.infer<typeof AccountGetMeInputSchema>;

const ModelsListInputSchema = z.object({});

export type ModelsListInput = z.infer<typeof ModelsListInputSchema>;

const RepositoriesListInputSchema = z.object({});

export type RepositoriesListInput = z.infer<typeof RepositoriesListInputSchema>;

// ── Output Schemas ───────────────────────────────────────────────────────────

const AgentsListResponseSchema = z
	.object({
		agents: z.array(AgentSchema),
		nextCursor: z.string().nullable().optional(),
	})
	.passthrough();

export type AgentsListResponse = z.infer<typeof AgentsListResponseSchema>;

const AgentsGetConversationResponseSchema = z
	.object({
		id: z.string(),
		messages: z.array(ConversationMessageSchema),
	})
	.passthrough();

export type AgentsGetConversationResponse = z.infer<
	typeof AgentsGetConversationResponseSchema
>;

const AccountGetMeResponseSchema = z
	.object({
		apiKeyName: z.string(),
		createdAt: z.string(),
		userEmail: z.string().optional(),
	})
	.passthrough();

export type AccountGetMeResponse = z.infer<typeof AccountGetMeResponseSchema>;

const ModelsListResponseSchema = z
	.object({
		models: z.array(z.string()),
	})
	.passthrough();

export type ModelsListResponse = z.infer<typeof ModelsListResponseSchema>;

const RepositoriesListResponseSchema = z
	.object({
		repositories: z.array(RepositorySchema),
	})
	.passthrough();

export type RepositoriesListResponse = z.infer<
	typeof RepositoriesListResponseSchema
>;

// ── Endpoint I/O Maps ────────────────────────────────────────────────────────

export type CursorEndpointInputs = {
	agentsList: AgentsListInput;
	agentsGetConversation: AgentsGetConversationInput;
	accountGetMe: AccountGetMeInput;
	modelsList: ModelsListInput;
	repositoriesList: RepositoriesListInput;
};

export type CursorEndpointOutputs = {
	agentsList: AgentsListResponse;
	agentsGetConversation: AgentsGetConversationResponse;
	accountGetMe: AccountGetMeResponse;
	modelsList: ModelsListResponse;
	repositoriesList: RepositoriesListResponse;
};

export const CursorEndpointInputSchemas = {
	agentsList: AgentsListInputSchema,
	agentsGetConversation: AgentsGetConversationInputSchema,
	accountGetMe: AccountGetMeInputSchema,
	modelsList: ModelsListInputSchema,
	repositoriesList: RepositoriesListInputSchema,
} as const;

export const CursorEndpointOutputSchemas = {
	agentsList: AgentsListResponseSchema,
	agentsGetConversation: AgentsGetConversationResponseSchema,
	accountGetMe: AccountGetMeResponseSchema,
	modelsList: ModelsListResponseSchema,
	repositoriesList: RepositoriesListResponseSchema,
} as const;
