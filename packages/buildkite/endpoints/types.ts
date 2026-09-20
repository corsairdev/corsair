import { z } from 'zod';
import {
	BuildkiteAccessToken,
	BuildkiteAgent,
	BuildkiteMeta,
	BuildkiteOrganization,
	BuildkiteUser,
} from '../schema';

export const GetCurrentAccessTokenInputSchema = z.object({});
export type GetCurrentAccessTokenInput = z.infer<
	typeof GetCurrentAccessTokenInputSchema
>;
export const GetCurrentAccessTokenOutputSchema = BuildkiteAccessToken;
export type GetCurrentAccessTokenOutput = BuildkiteAccessToken;

export const GetMetaInputSchema = z.object({});
export type GetMetaInput = z.infer<typeof GetMetaInputSchema>;
export const GetMetaOutputSchema = BuildkiteMeta;
export type GetMetaOutput = BuildkiteMeta;

export const GetUserInputSchema = z.object({});
export type GetUserInput = z.infer<typeof GetUserInputSchema>;
export const GetUserOutputSchema = BuildkiteUser;
export type GetUserOutput = BuildkiteUser;

export const ListOrganizationsInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	per_page: z.number().int().min(1).max(100).optional(),
});
export type ListOrganizationsInput = z.infer<
	typeof ListOrganizationsInputSchema
>;
export const ListOrganizationsOutputSchema = z.array(BuildkiteOrganization);
export type ListOrganizationsOutput = z.infer<
	typeof ListOrganizationsOutputSchema
>;

export const ListPipelineAgentsInputSchema = z.object({
	orgSlug: z
		.string()
		.regex(/^[a-z0-9][a-z0-9-]*$/)
		.describe(
			'Official path param {org.slug} on GET /v2/organizations/{org.slug}/agents',
		),
	name: z.string().optional().describe('Official query: ?name='),
	hostname: z.string().optional().describe('Official query: ?hostname='),
	version: z.string().optional().describe('Official query: ?version='),
	cluster_queue_id: z
		.string()
		.optional()
		.describe('Official query: ?cluster_queue_id='),
	page: z.number().int().min(1).optional(),
	per_page: z.number().int().min(1).max(100).optional(),
});
export type ListPipelineAgentsInput = z.infer<
	typeof ListPipelineAgentsInputSchema
>;
export const ListPipelineAgentsOutputSchema = z.array(BuildkiteAgent);
export type ListPipelineAgentsOutput = z.infer<
	typeof ListPipelineAgentsOutputSchema
>;

export type BuildkiteEndpointInputs = {
	getCurrentAccessToken: GetCurrentAccessTokenInput;
	getMeta: GetMetaInput;
	getUser: GetUserInput;
	listOrganizations: ListOrganizationsInput;
	listPipelineAgents: ListPipelineAgentsInput;
};

export type BuildkiteEndpointOutputs = {
	getCurrentAccessToken: GetCurrentAccessTokenOutput;
	getMeta: GetMetaOutput;
	getUser: GetUserOutput;
	listOrganizations: ListOrganizationsOutput;
	listPipelineAgents: ListPipelineAgentsOutput;
};

export const BuildkiteEndpointInputSchemas = {
	getCurrentAccessToken: GetCurrentAccessTokenInputSchema,
	getMeta: GetMetaInputSchema,
	getUser: GetUserInputSchema,
	listOrganizations: ListOrganizationsInputSchema,
	listPipelineAgents: ListPipelineAgentsInputSchema,
} as const;

export const BuildkiteEndpointOutputSchemas = {
	getCurrentAccessToken: GetCurrentAccessTokenOutputSchema,
	getMeta: GetMetaOutputSchema,
	getUser: GetUserOutputSchema,
	listOrganizations: ListOrganizationsOutputSchema,
	listPipelineAgents: ListPipelineAgentsOutputSchema,
} as const;
