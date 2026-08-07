import { z } from 'zod';

/**
 * Docker Hub API responses are open JSON; Hub does not publish stable TS contracts
 * for every route. Response aliases use DhOpenResponse (= unknown).
 */
type DhOpenResponse = unknown; // open Docker Hub JSON

const OpenResponseSchema = z.unknown(); // open Hub JSON body

const pageFields = {
	page: z.number().int().positive().optional(),
	pageSize: z.number().int().positive().max(100).optional(),
};

// ── Repositories ──────────────────────────────────────────────
const RepositoriesListInputSchema = z.object({
	namespace: z.string(),
	...pageFields,
});
export type RepositoriesListInput = z.infer<typeof RepositoriesListInputSchema>;
export type RepositoriesListResponse = DhOpenResponse; // open Hub JSON

const RepositoriesGetInputSchema = z.object({
	namespace: z.string(),
	name: z.string(),
});
export type RepositoriesGetInput = z.infer<typeof RepositoriesGetInputSchema>;
export type RepositoriesGetResponse = DhOpenResponse; // open Hub JSON

const RepositoriesCreateInputSchema = z.object({
	namespace: z.string(),
	name: z.string(),
	description: z.string().optional(),
	isPrivate: z.boolean().optional(),
	fullDescription: z.string().optional(),
});
export type RepositoriesCreateInput = z.infer<
	typeof RepositoriesCreateInputSchema
>;
export type RepositoriesCreateResponse = DhOpenResponse; // open Hub JSON

const RepositoriesDeleteInputSchema = z.object({
	namespace: z.string(),
	name: z.string(),
});
export type RepositoriesDeleteInput = z.infer<
	typeof RepositoriesDeleteInputSchema
>;
export type RepositoriesDeleteResponse = DhOpenResponse; // open Hub JSON

// ── Tags ──────────────────────────────────────────────────────
const TagsListInputSchema = z.object({
	namespace: z.string(),
	name: z.string(),
	...pageFields,
});
export type TagsListInput = z.infer<typeof TagsListInputSchema>;
export type TagsListResponse = DhOpenResponse; // open Hub JSON

const TagsGetInputSchema = z.object({
	namespace: z.string(),
	name: z.string(),
	tag: z.string(),
});
export type TagsGetInput = z.infer<typeof TagsGetInputSchema>;
export type TagsGetResponse = DhOpenResponse; // open Hub JSON

const TagsDeleteInputSchema = z.object({
	namespace: z.string(),
	name: z.string(),
	tag: z.string(),
});
export type TagsDeleteInput = z.infer<typeof TagsDeleteInputSchema>;
export type TagsDeleteResponse = DhOpenResponse; // open Hub JSON

// ── Images ────────────────────────────────────────────────────
const ImagesListInputSchema = z.object({
	namespace: z.string(),
	name: z.string(),
	...pageFields,
});
export type ImagesListInput = z.infer<typeof ImagesListInputSchema>;
export type ImagesListResponse = DhOpenResponse; // open Hub JSON

const ImagesGetInputSchema = z.object({
	namespace: z.string(),
	name: z.string(),
	digest: z.string(),
	// pageSize only — imagesGet is a digest scan, not a paged list (page would skip early tags)
	pageSize: z.number().int().positive().max(100).optional(),
});
export type ImagesGetInput = z.infer<typeof ImagesGetInputSchema>;
export type ImagesGetResponse = DhOpenResponse; // open Hub JSON

const ImagesDeleteInputSchema = z.object({
	namespace: z.string(),
	manifests: z.array(
		z.object({
			repository: z.string(),
			digest: z.string(),
		}),
	),
	dryRun: z.boolean().optional(),
});
export type ImagesDeleteInput = z.infer<typeof ImagesDeleteInputSchema>;
export type ImagesDeleteResponse = DhOpenResponse; // open Hub JSON

// ── Organizations ─────────────────────────────────────────────
const OrganizationsListInputSchema = z.object({
	...pageFields,
});
export type OrganizationsListInput = z.infer<
	typeof OrganizationsListInputSchema
>;
export type OrganizationsListResponse = DhOpenResponse; // open Hub JSON

const OrganizationsCreateInputSchema = z.object({
	orgname: z.string(),
	fullName: z.string().optional(),
	company: z.string().optional(),
	location: z.string().optional(),
	profileUrl: z.string().optional(),
	gravatarEmail: z.string().optional(),
});
export type OrganizationsCreateInput = z.infer<
	typeof OrganizationsCreateInputSchema
>;
export type OrganizationsCreateResponse = DhOpenResponse; // open Hub JSON

const OrganizationsDeleteInputSchema = z.object({
	orgname: z.string(),
});
export type OrganizationsDeleteInput = z.infer<
	typeof OrganizationsDeleteInputSchema
>;
export type OrganizationsDeleteResponse = DhOpenResponse; // open Hub JSON

const OrganizationsListMembersInputSchema = z.object({
	orgname: z.string(),
	...pageFields,
});
export type OrganizationsListMembersInput = z.infer<
	typeof OrganizationsListMembersInputSchema
>;
export type OrganizationsListMembersResponse = DhOpenResponse; // open Hub JSON

const OrganizationsAddMemberInputSchema = z.object({
	orgname: z.string(),
	/** Docker ID or email to invite */
	member: z.string(),
	role: z.enum(['member', 'owner']).optional(),
});
export type OrganizationsAddMemberInput = z.infer<
	typeof OrganizationsAddMemberInputSchema
>;
export type OrganizationsAddMemberResponse = DhOpenResponse; // open Hub JSON

const OrganizationsRemoveMemberInputSchema = z.object({
	orgname: z.string(),
	username: z.string(),
});
export type OrganizationsRemoveMemberInput = z.infer<
	typeof OrganizationsRemoveMemberInputSchema
>;
export type OrganizationsRemoveMemberResponse = DhOpenResponse; // open Hub JSON

const OrganizationsListAccessTokensInputSchema = z.object({
	orgname: z.string(),
	...pageFields,
});
export type OrganizationsListAccessTokensInput = z.infer<
	typeof OrganizationsListAccessTokensInputSchema
>;
export type OrganizationsListAccessTokensResponse = DhOpenResponse; // open Hub JSON

// ── Teams ─────────────────────────────────────────────────────
const TeamsListInputSchema = z.object({
	orgname: z.string(),
	...pageFields,
});
export type TeamsListInput = z.infer<typeof TeamsListInputSchema>;
export type TeamsListResponse = DhOpenResponse; // open Hub JSON

const TeamsGetInputSchema = z.object({
	orgname: z.string(),
	teamname: z.string(),
});
export type TeamsGetInput = z.infer<typeof TeamsGetInputSchema>;
export type TeamsGetResponse = DhOpenResponse; // open Hub JSON

const TeamsDeleteInputSchema = z.object({
	orgname: z.string(),
	teamname: z.string(),
});
export type TeamsDeleteInput = z.infer<typeof TeamsDeleteInputSchema>;
export type TeamsDeleteResponse = DhOpenResponse; // open Hub JSON

const TeamsListMembersInputSchema = z.object({
	orgname: z.string(),
	teamname: z.string(),
	...pageFields,
});
export type TeamsListMembersInput = z.infer<typeof TeamsListMembersInputSchema>;
export type TeamsListMembersResponse = DhOpenResponse; // open Hub JSON

const TeamsRemoveMemberInputSchema = z.object({
	orgname: z.string(),
	teamname: z.string(),
	username: z.string(),
});
export type TeamsRemoveMemberInput = z.infer<
	typeof TeamsRemoveMemberInputSchema
>;
export type TeamsRemoveMemberResponse = DhOpenResponse; // open Hub JSON

// ── Webhooks ──────────────────────────────────────────────────
const WebhooksListInputSchema = z.object({
	namespace: z.string(),
	name: z.string(),
	...pageFields,
});
export type WebhooksListInput = z.infer<typeof WebhooksListInputSchema>;
export type WebhooksListResponse = DhOpenResponse; // open Hub JSON

const WebhooksGetInputSchema = z.object({
	namespace: z.string(),
	name: z.string(),
	webhookId: z.union([z.string(), z.number()]),
});
export type WebhooksGetInput = z.infer<typeof WebhooksGetInputSchema>;
export type WebhooksGetResponse = DhOpenResponse; // open Hub JSON

const WebhooksCreateInputSchema = z.object({
	namespace: z.string(),
	name: z.string(),
	webhookName: z.string(),
	hookUrl: z.string().url(),
});
export type WebhooksCreateInput = z.infer<typeof WebhooksCreateInputSchema>;
export type WebhooksCreateResponse = DhOpenResponse; // open Hub JSON

const WebhooksDeleteInputSchema = z.object({
	namespace: z.string(),
	name: z.string(),
	webhookId: z.union([z.string(), z.number()]),
});
export type WebhooksDeleteInput = z.infer<typeof WebhooksDeleteInputSchema>;
export type WebhooksDeleteResponse = DhOpenResponse; // open Hub JSON

export type DockerHubEndpointInputs = {
	repositoriesList: RepositoriesListInput;
	repositoriesGet: RepositoriesGetInput;
	repositoriesCreate: RepositoriesCreateInput;
	repositoriesDelete: RepositoriesDeleteInput;
	tagsList: TagsListInput;
	tagsGet: TagsGetInput;
	tagsDelete: TagsDeleteInput;
	imagesList: ImagesListInput;
	imagesGet: ImagesGetInput;
	imagesDelete: ImagesDeleteInput;
	organizationsList: OrganizationsListInput;
	organizationsCreate: OrganizationsCreateInput;
	organizationsDelete: OrganizationsDeleteInput;
	organizationsListMembers: OrganizationsListMembersInput;
	organizationsAddMember: OrganizationsAddMemberInput;
	organizationsRemoveMember: OrganizationsRemoveMemberInput;
	organizationsListAccessTokens: OrganizationsListAccessTokensInput;
	teamsList: TeamsListInput;
	teamsGet: TeamsGetInput;
	teamsDelete: TeamsDeleteInput;
	teamsListMembers: TeamsListMembersInput;
	teamsRemoveMember: TeamsRemoveMemberInput;
	webhooksList: WebhooksListInput;
	webhooksGet: WebhooksGetInput;
	webhooksCreate: WebhooksCreateInput;
	webhooksDelete: WebhooksDeleteInput;
};

export type DockerHubEndpointOutputs = {
	repositoriesList: RepositoriesListResponse;
	repositoriesGet: RepositoriesGetResponse;
	repositoriesCreate: RepositoriesCreateResponse;
	repositoriesDelete: RepositoriesDeleteResponse;
	tagsList: TagsListResponse;
	tagsGet: TagsGetResponse;
	tagsDelete: TagsDeleteResponse;
	imagesList: ImagesListResponse;
	imagesGet: ImagesGetResponse;
	imagesDelete: ImagesDeleteResponse;
	organizationsList: OrganizationsListResponse;
	organizationsCreate: OrganizationsCreateResponse;
	organizationsDelete: OrganizationsDeleteResponse;
	organizationsListMembers: OrganizationsListMembersResponse;
	organizationsAddMember: OrganizationsAddMemberResponse;
	organizationsRemoveMember: OrganizationsRemoveMemberResponse;
	organizationsListAccessTokens: OrganizationsListAccessTokensResponse;
	teamsList: TeamsListResponse;
	teamsGet: TeamsGetResponse;
	teamsDelete: TeamsDeleteResponse;
	teamsListMembers: TeamsListMembersResponse;
	teamsRemoveMember: TeamsRemoveMemberResponse;
	webhooksList: WebhooksListResponse;
	webhooksGet: WebhooksGetResponse;
	webhooksCreate: WebhooksCreateResponse;
	webhooksDelete: WebhooksDeleteResponse;
};

export const DockerHubEndpointInputSchemas = {
	repositoriesList: RepositoriesListInputSchema,
	repositoriesGet: RepositoriesGetInputSchema,
	repositoriesCreate: RepositoriesCreateInputSchema,
	repositoriesDelete: RepositoriesDeleteInputSchema,
	tagsList: TagsListInputSchema,
	tagsGet: TagsGetInputSchema,
	tagsDelete: TagsDeleteInputSchema,
	imagesList: ImagesListInputSchema,
	imagesGet: ImagesGetInputSchema,
	imagesDelete: ImagesDeleteInputSchema,
	organizationsList: OrganizationsListInputSchema,
	organizationsCreate: OrganizationsCreateInputSchema,
	organizationsDelete: OrganizationsDeleteInputSchema,
	organizationsListMembers: OrganizationsListMembersInputSchema,
	organizationsAddMember: OrganizationsAddMemberInputSchema,
	organizationsRemoveMember: OrganizationsRemoveMemberInputSchema,
	organizationsListAccessTokens: OrganizationsListAccessTokensInputSchema,
	teamsList: TeamsListInputSchema,
	teamsGet: TeamsGetInputSchema,
	teamsDelete: TeamsDeleteInputSchema,
	teamsListMembers: TeamsListMembersInputSchema,
	teamsRemoveMember: TeamsRemoveMemberInputSchema,
	webhooksList: WebhooksListInputSchema,
	webhooksGet: WebhooksGetInputSchema,
	webhooksCreate: WebhooksCreateInputSchema,
	webhooksDelete: WebhooksDeleteInputSchema,
} as const;

export const DockerHubEndpointOutputSchemas = {
	repositoriesList: OpenResponseSchema,
	repositoriesGet: OpenResponseSchema,
	repositoriesCreate: OpenResponseSchema,
	repositoriesDelete: OpenResponseSchema,
	tagsList: OpenResponseSchema,
	tagsGet: OpenResponseSchema,
	tagsDelete: OpenResponseSchema,
	imagesList: OpenResponseSchema,
	imagesGet: OpenResponseSchema,
	imagesDelete: OpenResponseSchema,
	organizationsList: OpenResponseSchema,
	organizationsCreate: OpenResponseSchema,
	organizationsDelete: OpenResponseSchema,
	organizationsListMembers: OpenResponseSchema,
	organizationsAddMember: OpenResponseSchema,
	organizationsRemoveMember: OpenResponseSchema,
	organizationsListAccessTokens: OpenResponseSchema,
	teamsList: OpenResponseSchema,
	teamsGet: OpenResponseSchema,
	teamsDelete: OpenResponseSchema,
	teamsListMembers: OpenResponseSchema,
	teamsRemoveMember: OpenResponseSchema,
	webhooksList: OpenResponseSchema,
	webhooksGet: OpenResponseSchema,
	webhooksCreate: OpenResponseSchema,
	webhooksDelete: OpenResponseSchema,
} as const;
