import { z } from 'zod';

const AccessTokenResponseSchema = z.object({
	uuid: z.string(),
	scopes: z.array(z.string()),
	description: z.string().nullable().optional(),
	createdAt: z.string().optional(),
	expiresAt: z.string().nullable().optional(),
	user: z
		.object({
			email: z.string().optional(),
			name: z.string().optional(),
		})
		.optional(),
});
export type AccessTokenResponse = z.infer<typeof AccessTokenResponseSchema>;

const MetaResponseSchema = z.object({
	webhookIps: z.array(z.string()),
});
export type MetaResponse = z.infer<typeof MetaResponseSchema>;

const UserResponseSchema = z.object({
	id: z.string(),
	graphqlId: z.string().optional(),
	name: z.string(),
	email: z.string(),
	avatarUrl: z.string().optional(),
	createdAt: z.string().optional(),
});
export type UserResponse = z.infer<typeof UserResponseSchema>;

const OrganizationResponseSchema = z.object({
	id: z.string(),
	graphqlId: z.string().optional(),
	url: z.string().optional(),
	webUrl: z.string().optional(),
	name: z.string(),
	slug: z.string(),
	pipelinesUrl: z.string().optional(),
	agentsUrl: z.string().optional(),
	emojisUrl: z.string().optional(),
	createdAt: z.string().optional(),
});
export type OrganizationResponse = z.infer<typeof OrganizationResponseSchema>;

const AgentResponseSchema = z.object({
	id: z.string(),
	graphqlId: z.string().optional(),
	url: z.string().optional(),
	webUrl: z.string().optional(),
	name: z.string(),
	connectionState: z.string(),
	hostname: z.string().optional(),
	ipAddress: z.string().optional(),
	userAgent: z.string().optional(),
	version: z.string().optional(),
	osId: z.string().optional(),
	arch: z.string().optional(),
	queue: z.string().optional(),
	creator: UserResponseSchema.nullable().optional(),
	createdAt: z.string().optional(),
	connectedAt: z.string().nullable().optional(),
	disconnectedAt: z.string().nullable().optional(),
	lostAt: z.string().nullable().optional(),
	stoppedAt: z.string().nullable().optional(),
	job: z.unknown().nullable().optional(),
	lastJobFinishedAt: z.string().nullable().optional(),
	priority: z.number().optional(),
	metaData: z.array(z.string()).optional(),
});
export type AgentResponse = z.infer<typeof AgentResponseSchema>;

const GetCurrentAccessTokenInputSchema = z.object({});
export type GetCurrentAccessTokenInput = z.infer<
	typeof GetCurrentAccessTokenInputSchema
>;

const GetMetaInputSchema = z.object({});
export type GetMetaInput = z.infer<typeof GetMetaInputSchema>;

const GetUserInputSchema = z.object({});
export type GetUserInput = z.infer<typeof GetUserInputSchema>;

const ListOrganizationsInputSchema = z.object({
	page: z.number().optional(),
	perPage: z.number().optional(),
});
export type ListOrganizationsInput = z.infer<
	typeof ListOrganizationsInputSchema
>;
export type ListOrganizationsResponse = OrganizationResponse[];

const ListPipelineAgentsInputSchema = z.object({
	orgSlug: z.string(),
	page: z.number().optional(),
	perPage: z.number().optional(),
});
export type ListPipelineAgentsInput = z.infer<
	typeof ListPipelineAgentsInputSchema
>;
export type ListPipelineAgentsResponse = AgentResponse[];

export type BuildkiteEndpointInputs = {
	getCurrentAccessToken: GetCurrentAccessTokenInput;
	getMeta: GetMetaInput;
	getUser: GetUserInput;
	listOrganizations: ListOrganizationsInput;
	listPipelineAgents: ListPipelineAgentsInput;
};

export type BuildkiteEndpointOutputs = {
	getCurrentAccessToken: AccessTokenResponse;
	getMeta: MetaResponse;
	getUser: UserResponse;
	listOrganizations: ListOrganizationsResponse;
	listPipelineAgents: ListPipelineAgentsResponse;
};

export const BuildkiteEndpointInputSchemas = {
	getCurrentAccessToken: GetCurrentAccessTokenInputSchema,
	getMeta: GetMetaInputSchema,
	getUser: GetUserInputSchema,
	listOrganizations: ListOrganizationsInputSchema,
	listPipelineAgents: ListPipelineAgentsInputSchema,
} as const;

export const BuildkiteEndpointOutputSchemas = {
	getCurrentAccessToken: AccessTokenResponseSchema,
	getMeta: MetaResponseSchema,
	getUser: UserResponseSchema,
	listOrganizations: z.array(OrganizationResponseSchema),
	listPipelineAgents: z.array(AgentResponseSchema),
} as const;
